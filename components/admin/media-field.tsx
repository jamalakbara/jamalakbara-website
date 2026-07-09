"use client";

import { useRef, useState } from "react";

interface MediaFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  /** e.g. "image/*" or "video/*" */
  accept?: string;
  placeholder?: string;
}

/**
 * URL input + direct-to-Cloudinary signed upload. The stored value is a
 * plain secure_url string, same shape the content has always used.
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

  const isImage = /\/image\/upload\//.test(value) || /\.(png|jpe?g|webp|avif|gif)$/i.test(value);

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
      {value && isImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="mt-2 h-16 w-auto rounded-lg border border-[rgba(246,243,240,0.08)] object-cover"
        />
      )}
    </div>
  );
}
