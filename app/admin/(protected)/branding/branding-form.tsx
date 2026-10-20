"use client";

// Canvas 31 "Branding": favicon / app icons / wordmark / Open Graph slots,
// icon-set sync banner + regenerate, manifest colours. Every replace commits.

import { useRef, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, CircleCheck, Download, FileJson, RefreshCw, Upload } from "lucide-react";
import { BRANDING_SLOTS, MAX_BRANDING_BYTES, type BrandingSlot } from "@/lib/admin/branding";
import { useToast } from "@/components/admin/toast";
import { useConfirm } from "@/components/admin/confirm-dialog";
import { PageHeader } from "@/components/admin/ui";
import { regenerateIconSet, saveBrandingAsset, saveManifestColors } from "./actions";

function imageSize(file: File): Promise<{ w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("could not read image"));
    };
    img.src = url;
  });
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.onerror = () => reject(new Error("could not read file"));
    reader.readAsDataURL(file);
  });
}

const EXPECT: Partial<Record<BrandingSlot, [number, number]>> = {
  "apple-icon": [180, 180],
  "icon-192": [192, 192],
  "icon-512": [512, 512],
  "og-image": [1200, 630],
};

function useReplace(bump: () => void) {
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  async function replace(slot: BrandingSlot, file: File) {
    const entry = BRANDING_SLOTS[slot];
    if (file.size > MAX_BRANDING_BYTES) return toast.error("File too large (max 1 MB)");
    const want = EXPECT[slot];
    if (want) {
      try {
        const { w, h } = await imageSize(file);
        if (w !== want[0] || h !== want[1]) return toast.error(`${entry.label} must be exactly ${want[0]}×${want[1]} (got ${w}×${h})`);
      } catch {
        return toast.error("Could not read image dimensions");
      }
    }
    const base64 = await toBase64(file);
    startTransition(async () => {
      const result = await saveBrandingAsset(slot, base64);
      if (!result.ok) return toast.error(result.error);
      toast.saved(result, entry.label);
      bump();
    });
  }
  return { pending, replace };
}

function Slot({
  title,
  path,
  note,
  preview,
  slots,
  onReplace,
  pending,
}: {
  title: string;
  path: string;
  note: string;
  preview: ReactNode;
  slots: BrandingSlot[];
  onReplace: (slot: BrandingSlot, file: File) => void;
  pending: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [target, setTarget] = useState<BrandingSlot>(slots[0]);
  return (
    <section className="a-panel" style={{ overflow: "hidden" }}>
      <div className="a-slot__preview" style={{ borderRadius: 0 }}>{preview}</div>
      <div className="a-panel__body" style={{ gap: 12 }}>
        <h2 className="a-title">{title}</h2>
        <p className="a-mono a-muted">{path}</p>
        <p className="a-meta a-muted">{note}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {slots.length > 1 && (
            <select className="a-input" style={{ width: "auto", minHeight: 48 }} value={target} onChange={(e) => setTarget(e.target.value as BrandingSlot)} aria-label="Which file">
              {slots.map((s) => (
                <option key={s} value={s}>
                  {BRANDING_SLOTS[s].label}
                </option>
              ))}
            </select>
          )}
          <button type="button" className="a-btn a-btn--secondary" disabled={pending} onClick={() => ref.current?.click()}>
            <Upload size={16} />
            Replace
          </button>
          <a className="a-btn a-btn--ghost" href={BRANDING_SLOTS[target].publicUrl} download>
            <Download size={16} />
            Download
          </a>
        </div>
        <input
          ref={ref}
          type="file"
          hidden
          accept={BRANDING_SLOTS[target].accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onReplace(target, file);
            e.target.value = "";
          }}
        />
      </div>
    </section>
  );
}

export function BrandingForm({
  sync,
  colors,
}: {
  sync: { inSync: boolean; known: boolean; date: string | null; outOf: string[] };
  colors: { background: string; theme: string };
}) {
  const router = useRouter();
  const toast = useToast();
  const { confirm, dialog } = useConfirm();
  const [v, setV] = useState(0);
  const bump = () => {
    setV((n) => n + 1);
    router.refresh();
  };
  const { pending, replace } = useReplace(bump);
  const [regen, startRegen] = useTransition();
  const [bg, setBg] = useState(colors.background);
  const [theme, setTheme] = useState(colors.theme);
  const [savingColors, startColors] = useTransition();
  const src = (slot: BrandingSlot) => `${BRANDING_SLOTS[slot].publicUrl}?v=${v}`;
  const colorsDirty = bg.toUpperCase() !== colors.background.toUpperCase() || theme.toUpperCase() !== colors.theme.toUpperCase();

  const when = sync.date ? new Date(sync.date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : null;

  async function regenerate() {
    const ok = await confirm({
      title: "Regenerate the icon set?",
      message: "Renders favicon.ico, apple-icon and both manifest icons from public/icon.svg and commits all four together.",
      confirmLabel: "Regenerate",
    });
    if (!ok) return;
    startRegen(async () => {
      const result = await regenerateIconSet();
      if (!result.ok) return toast.error(result.error);
      toast.saved(result, "Icon set");
      bump();
    });
  }

  return (
    <>
      <PageHeader
        eyebrow="Settings / Branding"
        index="07"
        title="Branding"
        subtitle="What browsers, phones and link previews show. Replacing a file commits it."
        actions={
          <>
            <a className="a-btn a-btn--secondary" href="/manifest.json" target="_blank" rel="noreferrer">
              <FileJson size={16} />
              View manifest
            </a>
            <button type="button" className="a-btn a-btn--primary" onClick={regenerate} disabled={regen}>
              <RefreshCw size={16} />
              {regen ? "Regenerating…" : "Regenerate icon set"}
            </button>
          </>
        }
      />

      <p className={`a-banner ${sync.inSync || !sync.known ? "a-banner--ok" : ""}`}>
        {sync.inSync || !sync.known ? <CircleCheck size={16} /> : <CircleAlert size={16} />}
        <span className="a-banner__text">
          {sync.inSync
            ? `Favicon and all app icons use the same stamp artwork${when ? ` (updated ${when})` : ""}. Replace one and the set is flagged out of sync.`
            : !sync.known
              ? "Favicon and app icons come from public/icon.svg. Replace one and the set is flagged out of sync."
              : `Out of sync: ${sync.outOf.map((s) => BRANDING_SLOTS[s as BrandingSlot].label).join(", ")} changed separately. Regenerate the set from icon.svg to match.`}
        </span>
      </p>

      <div className="a-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <Slot
          title="Favicon"
          path="app/favicon.ico"
          note="16 + 32 px ICO. The only icons.icon entry — never list icon.svg."
          slots={["favicon"]}
          onReplace={replace}
          pending={pending}
          preview={[16, 32, 44].map((s) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={s} src={src("favicon")} alt={`Favicon at ${s}px`} width={s} height={s} />
          ))}
        />
        <Slot
          title="App icons"
          path="public/icon-192.png · icon-512.png · apple-icon.png"
          note="PWA manifest and iOS home screen. Generated together from public/icon.svg."
          slots={["apple-icon", "icon-192", "icon-512"]}
          onReplace={replace}
          pending={pending}
          preview={(["apple-icon", "icon-192", "icon-512"] as const).map((s, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={s} src={src(s)} alt={BRANDING_SLOTS[s].label} width={44 + i * 20} height={44 + i * 20} />
          ))}
        />
        <Slot
          title="Wordmark"
          path="public/logo.svg"
          note="Full text logo. Not used as an icon — non-square and loads a remote font."
          slots={["logo"]}
          onReplace={replace}
          pending={pending}
          // eslint-disable-next-line @next/next/no-img-element
          preview={<img src={src("logo")} alt="Wordmark" style={{ maxWidth: "70%", maxHeight: 64 }} />}
        />
      </div>

      <div className="a-grid a-grid--rail" style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)" }}>
        <Slot
          title="Open Graph"
          path="public/og-image.jpg · 1200 × 630"
          note="Link preview on WhatsApp, X and LinkedIn."
          slots={["og-image"]}
          onReplace={replace}
          pending={pending}
          // eslint-disable-next-line @next/next/no-img-element
          preview={<img src={src("og-image")} alt="Open Graph image" style={{ width: "80%", maxHeight: "none", aspectRatio: "1200 / 630", objectFit: "cover", borderRadius: 4 }} />}
        />
        <section className="a-panel" style={{ alignSelf: "start" }}>
          <div className="a-panel__head">
            <h2 className="a-title">Manifest colours</h2>
          </div>
          <div className="a-panel__body">
            {(
              [
                ["background_color", bg, setBg],
                ["theme_color", theme, setTheme],
              ] as const
            ).map(([name, value, set]) => (
              <label key={name} style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 16, borderBottom: "1px solid var(--f-line)" }}>
                <input type="color" value={value} onChange={(e) => set(e.target.value)} style={{ width: 24, height: 24, border: "1px solid var(--f-line)", borderRadius: 4, padding: 0, background: "none" }} />
                <span className="a-mono" style={{ flex: 1 }}>{name}</span>
                <input className="a-input a-input--mono" style={{ width: 110, minHeight: 36 }} value={value} onChange={(e) => set(e.target.value)} aria-label={name} />
              </label>
            ))}
            <p className="a-meta a-muted">Keep both on Working Folder paper (#F8F6F0) so the splash screen matches the site.</p>
            {colorsDirty && (
              <button
                type="button"
                className="a-btn a-btn--primary"
                disabled={savingColors}
                onClick={() =>
                  startColors(async () => {
                    const result = await saveManifestColors(bg, theme);
                    if (!result.ok) return toast.error(result.error);
                    toast.saved(result, "Manifest colours");
                    router.refresh();
                  })
                }
              >
                {savingColors ? "Saving…" : "Save colours"}
              </button>
            )}
          </div>
        </section>
      </div>
      {dialog}
    </>
  );
}
