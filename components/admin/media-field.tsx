"use client";

// Media inputs (kit "Admin / Field / Media"): a cover/video row and a gallery
// grid. Values are plain Cloudinary secure_url strings. Uploads are signed
// server-side (/api/admin/media/sign) and go straight to Cloudinary.

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ImagePlus, Images, Upload, X } from "lucide-react";
import { cldThumb, formatBytes } from "@/lib/admin/format";
import { mediaKey } from "@/lib/media-meta";

export type MediaKind = "image" | "video";

export interface MediaItem {
  publicId: string;
  url: string;
  format: string;
  bytes: number;
  width?: number | null;
  height?: number | null;
  createdAt?: string;
}

const FOLDER: Record<MediaKind, string> = { image: "portfolio/images", video: "portfolio/videos" };

export const isVideoUrl = (v: string) => /\/video\/upload\//.test(v) || /\.(mp4|mov|webm|m4v|ogv)$/i.test(v);

/** Signed direct upload to Cloudinary. Returns the stored secure_url. */
export async function uploadToCloudinary(file: File, kind: MediaKind): Promise<{ url: string; publicId: string }> {
  const assetFolder = FOLDER[kind];
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

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, { method: "POST", body: form });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || "Upload failed");
  return { url: json.secure_url as string, publicId: json.public_id as string };
}

function useUpload(kind: MediaKind, onDone: (url: string) => void) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const input = (
    <input
      ref={ref}
      type="file"
      accept={kind === "video" ? "video/*" : "image/*"}
      hidden
      onChange={async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setBusy(true);
        setError(null);
        try {
          onDone((await uploadToCloudinary(file, kind)).url);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Upload failed");
        } finally {
          setBusy(false);
          if (ref.current) ref.current.value = "";
        }
      }}
    />
  );
  return { busy, error, input, pick: () => ref.current?.click() };
}

/** Cover / hover-video row: thumb · name · actions (library, upload, clear). */
export function MediaField({
  label,
  hint,
  value,
  onChange,
  kind = "image",
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (url: string) => void;
  kind?: MediaKind;
}) {
  const [picking, setPicking] = useState(false);
  const upload = useUpload(kind, onChange);
  return (
    <div className="a-field">
      <div className="a-media">
        {value ? (
          kind === "video" || isVideoUrl(value) ? (
            <video className="a-media__thumb" src={value} muted playsInline preload="metadata" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="a-media__thumb" src={cldThumb(value)} alt="" />
          )
        ) : (
          <span className="a-media__thumb" />
        )}
        <span className="a-media__text">
          <span className="a-label a-truncate">
            {label} · {value ? mediaKey(value) : "none"}
          </span>
          <span className="a-meta a-muted a-truncate">{upload.busy ? "Uploading…" : hint}</span>
        </span>
        <span className="a-media__actions">
          <button type="button" className="a-iconbtn" aria-label={`Choose ${label} from library`} title="From library" onClick={() => setPicking(true)}>
            <Images size={16} />
          </button>
          <button type="button" className="a-iconbtn" aria-label={`Upload ${label}`} title="Upload" onClick={upload.pick} disabled={upload.busy}>
            <Upload size={16} />
          </button>
          {value && (
            <button type="button" className="a-iconbtn a-iconbtn--danger" aria-label={`Remove ${label}`} title="Remove" onClick={() => onChange("")}>
              <X size={16} />
            </button>
          )}
        </span>
        {upload.input}
      </div>
      {upload.error && <p className="a-field__help a-field__help--error">{upload.error}</p>}
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
    </div>
  );
}

/** Gallery grid (max `max`), add from library or upload. */
export function GalleryField({
  value,
  onChange,
  max = 3,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  max?: number;
}) {
  const [picking, setPicking] = useState(false);
  const upload = useUpload("image", (url) => onChange([...value, url].slice(0, max)));
  return (
    <div className="a-field">
      <div className="a-field__top">
        <span>
          Gallery <span className="a-muted">· shown as the row’s media strip (max {max})</span>
        </span>
        <span className="a-field__count">
          {value.length} / {max}
        </span>
      </div>
      <div className="a-gallery">
        {value.map((url, i) => (
          <div key={`${url}-${i}`} className="a-gallery__item">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cldThumb(url, 480, 440)} alt={`Gallery ${i + 1}`} />
            <button
              type="button"
              className="a-gallery__remove"
              aria-label={`Remove gallery image ${i + 1}`}
              onClick={() => onChange(value.filter((_, j) => j !== i))}
            >
              <X size={12} />
            </button>
          </div>
        ))}
        {value.length < max && (
          <button type="button" className="a-gallery__add" onClick={() => setPicking(true)} disabled={upload.busy}>
            <ImagePlus size={18} />
            {upload.busy ? "Uploading…" : "From library"}
          </button>
        )}
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        {value.length < max && (
          <button type="button" className="a-link a-small" onClick={upload.pick}>
            or upload a new image
          </button>
        )}
      </div>
      {upload.input}
      {upload.error && <p className="a-field__help a-field__help--error">{upload.error}</p>}
      {picking && (
        <MediaPicker
          kind="image"
          onClose={() => setPicking(false)}
          onSelect={(url) => {
            onChange([...value, url].slice(0, max));
            setPicking(false);
          }}
        />
      )}
    </div>
  );
}

/** Library dialog: browse the Cloudinary folder, select one, confirm. */
export function MediaPicker({
  kind,
  onSelect,
  onClose,
}: {
  kind: MediaKind;
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [query, setQuery] = useState("");

  const load = useCallback(
    async (next?: string | null) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ type: kind });
        if (next) params.set("cursor", next);
        const res = await fetch(`/api/admin/media?${params}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load media");
        setItems((prev) => (next ? [...prev, ...json.resources] : json.resources));
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
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [load, onClose]);

  const shown = items.filter((i) => !query || i.publicId.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="a-scrim" onClick={onClose}>
      <div className="a-dialog a-dialog--wide" role="dialog" aria-modal="true" aria-label={`Choose ${kind}`} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h2 className="a-title" style={{ flex: 1 }}>
            Choose {kind}
          </h2>
          <button type="button" className="a-iconbtn" aria-label="Close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <input className="a-input" type="search" placeholder="Filter by name…" value={query} onChange={(e) => setQuery(e.target.value)} />
        {error && <p className="a-banner">{error}</p>}
        <div className="a-mgrid" style={{ overflowY: "auto", minHeight: 200 }}>
          {shown.map((item) => (
            <button
              key={item.publicId}
              type="button"
              className="a-mcard"
              aria-pressed={selected?.publicId === item.publicId}
              onClick={() => setSelected(item)}
              onDoubleClick={() => onSelect(item.url)}
            >
              <span className="a-mcard__img">
                {kind === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cldThumb(item.url, 400, 300)} alt="" loading="lazy" />
                ) : (
                  <video src={item.url} muted playsInline preload="metadata" />
                )}
                <span className="a-mcard__check">
                  <Check size={12} />
                </span>
              </span>
              <span className="a-small a-truncate">{item.publicId}</span>
              <span className="a-meta a-muted">
                {item.width && item.height ? `${item.width}×${item.height} · ` : ""}
                {formatBytes(item.bytes)}
              </span>
            </button>
          ))}
          {loading && items.length === 0 && <p className="a-small a-muted">Loading library…</p>}
          {!loading && shown.length === 0 && <p className="a-small a-muted">No {kind}s found.</p>}
        </div>
        <div className="a-dialog__actions" style={{ alignItems: "center" }}>
          {cursor && (
            <button type="button" className="a-btn a-btn--ghost" onClick={() => void load(cursor)} disabled={loading} style={{ marginRight: "auto" }}>
              {loading ? "Loading…" : "Load more"}
            </button>
          )}
          <button type="button" className="a-btn a-btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="a-btn a-btn--primary" disabled={!selected} onClick={() => selected && onSelect(selected.url)}>
            <Check size={16} />
            Use this {kind}
          </button>
        </div>
      </div>
    </div>
  );
}
