"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MediaLightbox } from "./media-lightbox";

interface MediaFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  /** e.g. "image/*" or "video/*" — also selects which library folder to browse */
  accept?: string;
  placeholder?: string;
}

interface MediaItem {
  publicId: string;
  url: string;
  format: string;
  bytes: number;
}

const isVideoUrl = (v: string) =>
  /\/video\/upload\//.test(v) || /\.(mp4|mov|webm|m4v|ogv)$/i.test(v);
const isImageUrl = (v: string) =>
  /\/image\/upload\//.test(v) || /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(v);

/**
 * Asset field: paste a link, upload a file, or select from the Cloudinary
 * library. The stored value is a plain secure_url string. `accept` decides the
 * media kind (image vs video) for uploads, the library filter, and the preview.
 */
export function MediaField({
  label,
  value,
  onChange,
  accept = "image/*",
  placeholder = "https://res.cloudinary.com/…",
}: MediaFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const [previewing, setPreviewing] = useState(false);

  const kind: "image" | "video" = accept.startsWith("video") ? "video" : "image";
  const assetFolder = kind === "image" ? "portfolio/images" : "portfolio/videos";

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const signRes = await fetch("/api/admin/media/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetFolder }),
      });
      if (!signRes.ok) throw new Error("Could not sign upload");
      const { timestamp, signature, apiKey, cloudName } = await signRes.json();

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", apiKey);
      form.append("timestamp", String(timestamp));
      form.append("signature", signature);
      form.append("asset_folder", assetFolder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        { method: "POST", body: form }
      );
      const json = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(json?.error?.message || "Upload failed");
      }
      onChange(json.secure_url as string);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const showVideo = value && isVideoUrl(value);
  const showImage = value && !showVideo && isImageUrl(value);

  return (
    <div>
      <label className="mb-1.5 block text-xs text-[var(--m3)]">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="url"
          className="field-input flex-1"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="liquid-glass shrink-0 rounded-full px-4 py-2 text-xs"
          onClick={() => setPicking(true)}
        >
          Library
        </button>
        <button
          type="button"
          className="liquid-glass shrink-0 rounded-full px-4 py-2 text-xs"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
          }}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      {(showImage || showVideo) && (
        <button
          type="button"
          className="mt-2 block cursor-pointer rounded-lg border border-[rgba(246,243,240,0.08)] overflow-hidden"
          onClick={() => setPreviewing(true)}
          title="Preview"
        >
          {showImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-16 w-auto object-cover" />
          ) : (
            <video src={value} className="h-16 w-auto object-cover" muted playsInline preload="metadata" />
          )}
        </button>
      )}
      {picking && (
        <MediaPicker
          kind={kind}
          onClose={() => setPicking(false)}
          onSelect={(url) => {
            onChange(url);
            setPicking(false);
          }}
        />
      )}
      {previewing && value && (
        <MediaLightbox
          url={value}
          publicId={value.split("/").pop() ?? value}
          kind={showVideo ? "video" : "image"}
          onClose={() => setPreviewing(false)}
        />
      )}
    </div>
  );
}

function MediaPicker({
  kind,
  onSelect,
  onClose,
}: {
  kind: "image" | "video";
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<MediaItem | null>(null);

  const load = useCallback(
    async (nextCursor?: string | null) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ type: kind });
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
    [kind]
  );

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div
      className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="liquid-glass max-h-[80vh] w-full max-w-3xl cursor-default overflow-hidden rounded-2xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm text-[var(--m2)]">Select {kind}</h3>
          <button type="button" className="nav-link cursor-pointer text-xs text-[var(--m3)]" onClick={onClose}>
            Close
          </button>
        </div>
        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
        <div className="grid max-h-[56vh] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3 lg:grid-cols-4">
          {loading && items.length === 0 &&
            Array.from({ length: 8 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="liquid-glass overflow-hidden rounded-xl">
                <div className="aspect-square w-full animate-pulse bg-[var(--m4)]/10" />
                <div className="p-2">
                  <div className="h-2.5 w-3/4 animate-pulse rounded bg-[var(--m4)]/15" />
                </div>
              </div>
            ))}
          {items.map((item) => (
            <button
              key={item.publicId}
              type="button"
              className="liquid-glass group cursor-pointer overflow-hidden rounded-xl text-left"
              onClick={() => setPreview(item)}
            >
              {kind === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url.replace("/upload/", "/upload/w_400,q_auto,f_auto/")}
                  alt={item.publicId}
                  className="aspect-square w-full object-cover transition group-hover:opacity-80"
                  loading="lazy"
                />
              ) : (
                <video
                  src={item.url}
                  className="aspect-square w-full object-cover transition group-hover:opacity-80"
                  muted
                  playsInline
                  preload="metadata"
                />
              )}
              <p className="truncate p-2 text-[11px] text-[var(--m3)]" title={item.publicId}>
                {item.publicId}
              </p>
            </button>
          ))}
        </div>
        {loading && items.length > 0 && (
          <p className="mt-4 text-center text-sm text-[var(--m4)]">Loading…</p>
        )}
        {!loading && items.length === 0 && (
          <p className="py-10 text-center text-sm text-[var(--m4)]">No {kind}s found.</p>
        )}
        {cursor && !loading && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              className="liquid-glass cursor-pointer rounded-full px-5 py-2 text-sm"
              onClick={() => void load(cursor)}
            >
              Load more
            </button>
          </div>
        )}
      </div>

      {preview && (
        <MediaLightbox
          url={preview.url}
          publicId={preview.publicId}
          kind={kind}
          onClose={() => setPreview(null)}
          onSelect={onSelect}
        />
      )}
    </div>
  );
}
