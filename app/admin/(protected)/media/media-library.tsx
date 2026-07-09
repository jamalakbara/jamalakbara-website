"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface MediaItem {
  publicId: string;
  url: string;
  format: string;
  bytes: number;
  createdAt: string;
}

type MediaType = "image" | "video";

function formatBytes(bytes: number): string {
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

export function MediaLibrary() {
  const [type, setType] = useState<MediaType>("image");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(
    async (mediaType: MediaType, nextCursor?: string | null) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ type: mediaType });
        if (nextCursor) params.set("cursor", nextCursor);
        const res = await fetch(`/api/admin/media?${params}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load media");
        setItems((prev) => (nextCursor ? [...prev, ...json.resources] : json.resources));
        setCursor(json.nextCursor);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load media");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    setItems([]);
    setCursor(null);
    void load(type);
  }, [type, load]);

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const signRes = await fetch("/api/admin/media/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!signRes.ok) throw new Error("Could not sign upload");
      const { timestamp, signature, apiKey, cloudName } = await signRes.json();
      const form = new FormData();
      form.append("file", file);
      form.append("api_key", apiKey);
      form.append("timestamp", String(timestamp));
      form.append("signature", signature);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        { method: "POST", body: form }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Upload failed");
      await load(type);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function remove(item: MediaItem) {
    if (!window.confirm(`Delete ${item.publicId} from Cloudinary? Content still referencing it will break.`)) return;
    setError(null);
    const res = await fetch("/api/admin/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId: item.publicId, type }),
    });
    if (res.ok) setItems((prev) => prev.filter((i) => i.publicId !== item.publicId));
    else setError((await res.json()).error || "Delete failed");
  }

  async function copy(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex gap-2">
          {(["image", "video"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className="liquid-glass rounded-full px-4 py-1.5 text-xs capitalize"
              style={type === t ? { color: "var(--accent)", borderColor: "rgba(224,135,90,0.35)" } : undefined}
            >
              {t}s
            </button>
          ))}
        </div>
        <button
          type="button"
          className="btn-solid rounded-full px-5 py-2 text-sm disabled:opacity-40"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept={type === "image" ? "image/*" : "video/*"}
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
          }}
        />
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.publicId} className="liquid-glass cursor-default overflow-hidden rounded-xl">
            {type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.url.replace("/upload/", "/upload/w_400,q_auto,f_auto/")} alt={item.publicId} className="aspect-square w-full object-cover" loading="lazy" />
            ) : (
              <video src={item.url} className="aspect-square w-full object-cover" muted playsInline preload="metadata" />
            )}
            <div className="space-y-1 p-3">
              <p className="truncate text-xs" title={item.publicId}>{item.publicId}</p>
              <p className="text-[10px] text-[var(--m4)]">
                {item.format} · {formatBytes(item.bytes)}
              </p>
              <div className="flex gap-2 pt-1">
                <button type="button" className="nav-link text-[11px] text-[var(--m2)]" onClick={() => copy(item.url)}>
                  {copied === item.url ? "Copied!" : "Copy URL"}
                </button>
                <button type="button" className="text-[11px] text-red-400/80 hover:text-red-400" onClick={() => remove(item)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && !loading && (
        <p className="py-12 text-center text-sm text-[var(--m4)]">No {type}s found.</p>
      )}

      <div className="mt-6 flex justify-center">
        {cursor && (
          <button
            type="button"
            className="liquid-glass rounded-full px-5 py-2 text-sm disabled:opacity-40"
            disabled={loading}
            onClick={() => void load(type, cursor)}
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        )}
        {loading && !cursor && <p className="text-sm text-[var(--m4)]">Loading…</p>}
      </div>
    </div>
  );
}
