"use client";

// Canvas 30 "Media": drop zone, filters (All / Images / Video / Unused),
// grid or list, and a details panel with "Used in", alt text, copy, delete.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, CloudUpload, Copy, LayoutGrid, List, Search, Trash2, Upload, X } from "lucide-react";
import { useConfirm } from "@/components/admin/confirm-dialog";
import { useToast } from "@/components/admin/toast";
import { Field, PageHeader } from "@/components/admin/ui";
import { uploadToCloudinary, type MediaItem, type MediaKind } from "@/components/admin/media-field";
import { cldThumb, formatBytes } from "@/lib/admin/format";
import { mediaKey } from "@/lib/media-meta";
import { saveMediaAlt } from "./actions";

type Filter = "all" | "image" | "video" | "unused";
type Item = MediaItem & { kind: MediaKind };
interface Use {
  label: string;
  href: string;
}

const kindOf = (file: File): MediaKind => (file.type.startsWith("video") ? "video" : "image");

export function MediaLibrary({
  stats,
  consoleUrl,
  focusUpload,
}: {
  stats: { images: number; videos: number } | null;
  consoleUrl: string;
  focusUpload: boolean;
}) {
  const toast = useToast();
  const { confirm, dialog } = useConfirm();
  const [items, setItems] = useState<Record<MediaKind, Item[]>>({ image: [], video: [] });
  const [cursors, setCursors] = useState<Record<MediaKind, string | null>>({ image: null, video: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<Record<string, Use[]> | null>(null);
  const [alt, setAlt] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(0);
  const [over, setOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLButtonElement>(null);

  const load = useCallback(async (kind: MediaKind, cursor?: string | null) => {
    const params = new URLSearchParams({ type: kind });
    if (cursor) params.set("cursor", cursor);
    const res = await fetch(`/api/admin/media?${params}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to load media");
    const fresh = (json.resources as MediaItem[]).map((r) => ({ ...r, kind }));
    setItems((all) => ({ ...all, [kind]: cursor ? [...all[kind], ...fresh] : fresh }));
    setCursors((c) => ({ ...c, [kind]: json.nextCursor }));
  }, []);

  const loadUsage = useCallback(async () => {
    const res = await fetch("/api/admin/media/usage");
    if (!res.ok) return;
    const json = await res.json();
    setUsage(json.usage);
    setAlt(json.alt);
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([load("image"), load("video"), loadUsage()])
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load media"))
      .finally(() => setLoading(false));
    if (focusUpload) dropRef.current?.focus();
  }, [load, loadUsage, focusUpload]);

  const all = useMemo(
    () => [...items.image, ...items.video].sort((a, b) => ((a.createdAt ?? "") < (b.createdAt ?? "") ? 1 : -1)),
    [items]
  );
  const usesOf = (i: Item) => usage?.[mediaKey(i.publicId)] ?? [];
  const unusedCount = usage ? all.filter((i) => usesOf(i).length === 0).length : null;
  const q = query.trim().toLowerCase();
  const shown = all.filter(
    (i) =>
      (filter === "all" || (filter === "unused" ? usage && usesOf(i).length === 0 : i.kind === filter)) &&
      (!q || i.publicId.toLowerCase().includes(q) || usesOf(i).some((u) => u.label.toLowerCase().includes(q)))
  );
  const selected = all.find((i) => i.publicId === selectedId) ?? null;
  const more = filter === "image" ? cursors.image : filter === "video" ? cursors.video : cursors.image || cursors.video;

  async function uploadFiles(files: FileList | File[]) {
    const list = [...files];
    if (!list.length) return;
    setUploading((n) => n + list.length);
    for (const file of list) {
      try {
        await uploadToCloudinary(file, kindOf(file));
        toast.show({ tone: "ok", title: "Uploaded to Cloudinary", body: file.name });
      } catch (e) {
        toast.error(`${file.name}: ${e instanceof Error ? e.message : "upload failed"}`);
      } finally {
        setUploading((n) => n - 1);
      }
    }
    await Promise.all([load("image"), load("video")]).catch(() => {});
  }

  async function remove(item: Item) {
    const uses = usesOf(item);
    const ok = await confirm({
      title: `Delete ${item.publicId}?`,
      message: uses.length
        ? `It’s used in ${uses.map((u) => u.label).join(", ")} — those will show a broken image. Deleting from Cloudinary can’t be undone.`
        : "Deleting from Cloudinary can’t be undone.",
      confirmLabel: "Delete file",
    });
    if (!ok) return;
    const res = await fetch("/api/admin/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId: item.publicId, type: item.kind }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return toast.error(json.error || "Delete failed");
    setItems((all) => ({ ...all, [item.kind]: all[item.kind].filter((i) => i.publicId !== item.publicId) }));
    setSelectedId(null);
    toast.show({ tone: "ok", title: "Deleted from Cloudinary", body: item.publicId });
  }

  const total = stats ? stats.images + stats.videos : all.length;

  return (
    <>
      <PageHeader
        eyebrow="Settings / Media"
        index="06"
        title="Media library"
        subtitle={`${total} assets on Cloudinary · portfolio/images and portfolio/videos`}
        actions={
          <>
            <a className="a-btn a-btn--secondary" href={consoleUrl} target="_blank" rel="noreferrer">
              <ArrowUpRight size={16} />
              Open Cloudinary
            </a>
            <button type="button" className="a-btn a-btn--primary" onClick={() => fileRef.current?.click()}>
              <Upload size={16} />
              Upload
            </button>
          </>
        }
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files) void uploadFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <div className="a-panel a-toolbar">
        <label className="a-input" style={{ width: 240, maxWidth: "100%" }}>
          <Search size={16} />
          <input type="search" placeholder="Search by name or project…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search media" />
        </label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }} role="group" aria-label="Filter">
          {(
            [
              ["all", `All · ${total}`],
              ["image", `Images · ${stats?.images ?? items.image.length}`],
              ["video", `Video · ${stats?.videos ?? items.video.length}`],
              ["unused", `Unused${unusedCount === null ? "" : ` · ${unusedCount}`}`],
            ] as const
          ).map(([key, label]) => (
            <button key={key} type="button" className="a-filter" aria-pressed={filter === key} onClick={() => setFilter(key)}>
              {label}
            </button>
          ))}
        </div>
        <span className="a-toolbar__spacer" />
        <span className="a-seg" style={{ height: 40 }} role="group" aria-label="View">
          <button type="button" className="a-seg__item" aria-pressed={view === "grid"} aria-label="Grid view" onClick={() => setView("grid")}>
            <LayoutGrid size={15} />
          </button>
          <button type="button" className="a-seg__item" aria-pressed={view === "list"} aria-label="List view" onClick={() => setView("list")}>
            <List size={15} />
          </button>
        </span>
      </div>

      <div className={selected ? "a-grid a-grid--rail" : "a-stack"}>
        <section className="a-panel a-panel__body">
          <button
            ref={dropRef}
            type="button"
            className="a-drop"
            data-over={over || focusUpload}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(true);
            }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setOver(false);
              void uploadFiles(e.dataTransfer.files);
            }}
          >
            <CloudUpload size={16} />
            {uploading ? `Uploading ${uploading} file${uploading === 1 ? "" : "s"}…` : "Drop images or video here — uploads go straight to Cloudinary, signed"}
          </button>
          {error && <p className="a-banner">{error}</p>}
          {filter === "unused" && usage && (
            <p className="a-meta a-muted">Not referenced by any project, site copy or post (scans the loaded assets).</p>
          )}

          {view === "grid" ? (
            <div className="a-mgrid">
              {shown.map((item) => (
                <button key={item.publicId} type="button" className="a-mcard" aria-pressed={selectedId === item.publicId} onClick={() => setSelectedId(item.publicId)}>
                  <span className="a-mcard__img">
                    {item.kind === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cldThumb(item.url, 480, 360)} alt={alt[mediaKey(item.publicId)] ?? ""} loading="lazy" />
                    ) : (
                      <video src={item.url} muted playsInline preload="metadata" />
                    )}
                    <span className="a-mcard__check">
                      <Check size={12} />
                    </span>
                    {usage && usesOf(item).length === 0 && <span className="a-mcard__badge a-chip">Unused</span>}
                  </span>
                  <span className="a-small a-truncate">{item.publicId}</span>
                  <span className="a-meta a-muted">
                    {item.width && item.height ? `${item.width}×${item.height} · ` : ""}
                    {formatBytes(item.bytes)}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="a-mlist">
              {shown.map((item) => (
                <button key={item.publicId} type="button" className="a-row a-row--link" style={{ textAlign: "left", minHeight: 64, padding: "8px 4px" }} aria-pressed={selectedId === item.publicId} onClick={() => setSelectedId(item.publicId)}>
                  {item.kind === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="a-row__thumb" src={cldThumb(item.url)} alt="" loading="lazy" />
                  ) : (
                    <video className="a-row__thumb" src={item.url} muted preload="metadata" />
                  )}
                  <span className="a-row__text">
                    <span className="a-small a-truncate">{item.publicId}</span>
                    <span className="a-row__meta">
                      {item.format} · {formatBytes(item.bytes)} · {usesOf(item).map((u) => u.label).join(", ") || "unused"}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
          {loading && all.length === 0 && <p className="a-small a-muted">Loading library…</p>}
          {!loading && shown.length === 0 && <p className="a-small a-muted">Nothing here{q ? ` for “${query}”` : ""}.</p>}
          {more && (
            <button
              type="button"
              className="a-btn a-btn--secondary"
              style={{ alignSelf: "center" }}
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  if ((filter === "all" || filter === "unused" || filter === "image") && cursors.image) await load("image", cursors.image);
                  if ((filter === "all" || filter === "unused" || filter === "video") && cursors.video) await load("video", cursors.video);
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Failed to load media");
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? "Loading…" : "Load more"}
            </button>
          )}
        </section>

        {selected && (
          <Details
            key={selected.publicId}
            item={selected}
            uses={usesOf(selected)}
            scanned={usage !== null}
            alt={alt[mediaKey(selected.publicId)] ?? ""}
            onClose={() => setSelectedId(null)}
            onDelete={() => remove(selected)}
            onAltSaved={(value) => setAlt((a) => ({ ...a, [mediaKey(selected.publicId)]: value }))}
          />
        )}
      </div>
      {dialog}
    </>
  );
}

function Details({
  item,
  uses,
  scanned,
  alt,
  onClose,
  onDelete,
  onAltSaved,
}: {
  item: Item;
  uses: Use[];
  scanned: boolean;
  alt: string;
  onClose: () => void;
  onDelete: () => void;
  onAltSaved: (value: string) => void;
}) {
  const toast = useToast();
  const [draft, setDraft] = useState(alt);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  async function saveAlt() {
    if (draft.trim() === alt.trim()) return;
    setSaving(true);
    const result = await saveMediaAlt(mediaKey(item.publicId), draft);
    setSaving(false);
    if (!result.ok) return toast.error(result.error);
    onAltSaved(draft.trim());
    toast.saved(result, `Alt text · ${mediaKey(item.publicId)}`);
  }

  return (
    <aside className="a-panel a-sticky" aria-label="Details">
      <div className="a-panel__head">
        <h2 className="a-title">Details</h2>
        <button type="button" className="a-iconbtn" aria-label="Close details" onClick={onClose}>
          <X size={16} />
        </button>
      </div>
      <div className="a-panel__body">
        {item.kind === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cldThumb(item.url, 640, 480)} alt={alt} style={{ width: "100%", borderRadius: 4, aspectRatio: "4 / 3", objectFit: "cover", background: "var(--f-surface)" }} />
        ) : (
          <video src={item.url} controls muted playsInline style={{ width: "100%", borderRadius: 4 }} />
        )}
        <dl className="a-kv">
          <dt>Public ID</dt>
          <dd>{item.publicId}</dd>
          <dt>Size</dt>
          <dd>
            {item.width && item.height ? `${item.width} × ${item.height} · ` : ""}
            {formatBytes(item.bytes)} · {item.format}
          </dd>
          {item.createdAt && (
            <>
              <dt>Uploaded</dt>
              <dd>{new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</dd>
            </>
          )}
        </dl>
        <hr className="a-divider" />
        <div className="a-field">
          <span className="a-field__top">Used in</span>
          {!scanned ? (
            <p className="a-meta a-muted">Scanning content…</p>
          ) : uses.length === 0 ? (
            <p className="a-meta a-muted">Not used anywhere yet.</p>
          ) : (
            uses.map((u) => (
              <Link key={u.label} href={u.href} className="a-link a-small">
                {u.label}
              </Link>
            ))
          )}
        </div>
        {item.kind === "image" && (
          <Field label="Alt text" count={draft.length} max={125} help="Read by screen readers and Google Images. Saved to content/media.json — the Work rows use it.">
            <input className="a-input" value={draft} maxLength={125} onChange={(e) => setDraft(e.target.value)} onBlur={saveAlt} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), saveAlt())} />
            {saving && <span className="a-meta a-muted">Saving…</span>}
          </Field>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            className="a-btn a-btn--secondary"
            style={{ flex: 1 }}
            onClick={async () => {
              await navigator.clipboard.writeText(item.url);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied" : "Copy URL"}
          </button>
          <button type="button" className="a-btn a-btn--danger" onClick={onDelete}>
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </aside>
  );
}
