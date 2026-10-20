"use client";

// Admin kit (canvas frame 23 "Admin / Components"). Thin wrappers over the
// .a-* classes in app/admin/admin.css so every screen shares one vocabulary.

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Check, CircleDashed, Copy, ExternalLink, Eye, X } from "lucide-react";
import type { SeoReport } from "@/lib/admin/seo-checklist";

/* ---- Page header -------------------------------------------------------- */

export function PageHeader({
  eyebrow,
  index,
  title,
  subtitle,
  actions,
  back,
}: {
  eyebrow: string;
  index?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="a-head">
      <div className="a-head__tab">
        <span className="a-eyebrow">{eyebrow}</span>
        {index && <span className="a-meta">{index}</span>}
      </div>
      <div className="a-head__panel">
        <div className="a-head__titles">
          {back && (
            <Link href={back.href} className="a-head__back">
              <ArrowLeft size={14} />
              {back.label}
            </Link>
          )}
          <h1 className="a-display">{title}</h1>
          {subtitle && <p className="a-head__sub">{subtitle}</p>}
        </div>
        {actions && <div className="a-head__actions">{actions}</div>}
      </div>
    </header>
  );
}

export function Panel({
  title,
  aside,
  children,
  className = "",
  bodyClass = "a-panel__body",
}: {
  title?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClass?: string;
}) {
  return (
    <section className={`a-panel ${className}`}>
      {title && (
        <div className="a-panel__head">
          <h2 className="a-title">{title}</h2>
          {aside}
        </div>
      )}
      <div className={bodyClass}>{children}</div>
    </section>
  );
}

/** Numbered form section ("01 BASICS") */
export function Section({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="a-panel">
      <div className="a-panel__body">
        <div className="a-section__head">
          <span className="a-meta">{n}</span>
          <h2 className="a-title">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

/* ---- Status ------------------------------------------------------------- */

export type ChipKind = "draft" | "published" | "building" | "live" | "failed";

const CHIP_LABEL: Record<ChipKind, string> = {
  draft: "Draft",
  published: "Published",
  building: "Building",
  live: "Live",
  failed: "Failed",
};

export function Chip({ kind, children }: { kind: ChipKind; children?: ReactNode }) {
  return <span className={`a-chip a-chip--${kind}`}>{children ?? CHIP_LABEL[kind]}</span>;
}

/* ---- Fields ------------------------------------------------------------- */

export function counterState(len: number, max?: number, min?: number): "over" | "warn" | undefined {
  if (max !== undefined && len > max) return "over";
  if (min !== undefined && len > 0 && len < min) return "warn";
  return undefined;
}

export function Field({
  label,
  count,
  max,
  min,
  help,
  error,
  children,
  htmlFor,
}: {
  label: ReactNode;
  /** current length → shows "n / max" (or "n chars" without max) */
  count?: number;
  max?: number;
  min?: number;
  help?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <div className="a-field">
      <div className="a-field__top">
        <label htmlFor={htmlFor}>{label}</label>
        {count !== undefined && (
          <span className="a-field__count" data-state={counterState(count, max, min)}>
            {max !== undefined ? `${count} / ${max}` : `${count} chars`}
          </span>
        )}
      </div>
      {children}
      {error ? (
        <p className="a-field__help a-field__help--error">{error}</p>
      ) : help ? (
        <p className="a-field__help">{help}</p>
      ) : null}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="a-toggle">
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="a-toggle__track" aria-hidden />
      <span>{children}</span>
    </label>
  );
}

export function TagInput({
  value,
  onChange,
  placeholder = "Add…",
  id,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  id?: string;
}) {
  const [draft, setDraft] = useState("");
  const commit = () => {
    const parts = draft.split(",").map((t) => t.trim()).filter(Boolean);
    if (parts.length) onChange([...value, ...parts.filter((p) => !value.includes(p))]);
    setDraft("");
  };
  return (
    <div className="a-input a-tags">
      {value.map((tag) => (
        <span key={tag} className="a-tag">
          {tag}
          <button type="button" aria-label={`Remove ${tag}`} onClick={() => onChange(value.filter((t) => t !== tag))}>
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit();
          } else if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
      />
    </div>
  );
}

/* ---- SEO checklist ------------------------------------------------------ */

export function SeoPanel({ report }: { report: SeoReport }) {
  const meterState = (s: "ok" | "warn" | "bad") => (s === "ok" ? undefined : s);
  const pct = (len: number, max: number) => `${Math.min(100, Math.round((len / max) * 100))}%`;
  return (
    <section className="a-panel a-panel--note a-seo" aria-label="SEO checklist">
      <div className="a-panel__head" style={{ padding: "14px 16px" }}>
        <h2 className="a-title">SEO</h2>
        <span className="a-small" style={{ color: report.passed === report.total ? "var(--f-success)" : "var(--f-muted)" }}>
          {report.passed} / {report.total} checks
        </span>
      </div>
      <div className="a-seo__snippet" aria-label="Google result preview">
        <span className="a-seo__url">{report.snippet.url}</span>
        <span className="a-seo__title">{report.snippet.title || "Untitled"}</span>
        <span className="a-seo__desc">{report.snippet.description || "No description yet."}</span>
      </div>
      {(
        [
          ["Title length", report.title],
          ["Description length", report.description],
        ] as const
      ).map(([label, m]) => (
        <div key={label} className="a-meter">
          <div className="a-meter__top">
            <span>{label}</span>
            <span className="a-meter__val" data-state={meterState(m.state)}>
              {m.length} / {m.max}
              {m.note && ` — ${m.note}`}
            </span>
          </div>
          <div className="a-meter__track">
            <div className="a-meter__bar" data-state={meterState(m.state)} style={{ width: pct(m.length, m.max) }} />
          </div>
        </div>
      ))}
      <ul className="a-checks">
        {report.checks.map((c) => (
          <li key={c.label} className="a-check" data-ok={c.ok}>
            {c.ok ? <Check size={15} /> : <CircleDashed size={15} />}
            {c.label}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---- Draft preview ------------------------------------------------------ */

type PreviewFn = () => Promise<{ ok: true; url: string; expiresAt: number } | { ok: false; error: string }>;

export function usePreview(create: PreviewFn) {
  const [link, setLink] = useState<{ url: string; expiresAt: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function open() {
    // Open the tab synchronously (popup blockers), then point it at the link.
    const tab = window.open("about:blank", "_blank");
    setBusy(true);
    setError(null);
    const result = await create();
    setBusy(false);
    if (result.ok) {
      setLink({ url: result.url, expiresAt: result.expiresAt });
      if (tab) tab.location.href = result.url;
    } else {
      tab?.close();
      setError(result.error);
    }
  }
  return { link, busy, error, open };
}

export function PreviewPanel({ preview }: { preview: ReturnType<typeof usePreview> }) {
  const [copied, setCopied] = useState(false);
  const { link, busy, error, open } = preview;
  const path = link ? new URL(link.url).pathname : null;
  return (
    <Panel title="Draft preview">
      <p className="a-small a-muted">
        See unsaved edits rendered with the real site styles. Link expires in 1 hour — anyone with it can view.
      </p>
      {link && (
        <div className="a-copyfield">
          <span className="a-truncate" style={{ flex: 1 }} title={link.url}>
            {path!.length > 34 ? `${path!.slice(0, 34)}…` : path}
          </span>
          <button
            type="button"
            className="a-iconbtn"
            aria-label="Copy preview link"
            onClick={async () => {
              await navigator.clipboard.writeText(link.url);
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            }}
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
          </button>
        </div>
      )}
      {error && <p className="a-field__help a-field__help--error">{error}</p>}
      <button type="button" className="a-btn a-btn--secondary a-btn--block" onClick={open} disabled={busy}>
        <ExternalLink size={16} />
        {busy ? "Preparing preview…" : link ? "Refresh preview" : "Open preview"}
      </button>
    </Panel>
  );
}

export function PreviewButton({ preview }: { preview: ReturnType<typeof usePreview> }) {
  return (
    <button type="button" className="a-btn a-btn--secondary" onClick={preview.open} disabled={preview.busy}>
      <Eye size={16} />
      {preview.busy ? "Preparing…" : "Preview draft"}
    </button>
  );
}

/* ---- Misc --------------------------------------------------------------- */

export function useFieldId(name: string) {
  return `${useId()}-${name}`;
}

export function EmptyState({ icon, title, body, action }: { icon: ReactNode; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="a-empty">
      {icon}
      <h3 className="a-title">{title}</h3>
      <p className="a-small a-muted" style={{ maxWidth: 360 }}>{body}</p>
      {action}
    </div>
  );
}

/* ---- Save bar ----------------------------------------------------------- */

/** ⌘S / Ctrl+S → save while `enabled`. */
export function useSaveShortcut(save: () => void, enabled: boolean) {
  const ref = useRef(save);
  ref.current = save;
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        ref.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled]);
}

export function SaveBar({
  message,
  onDiscard,
  onSave,
  pending,
  saveLabel = "Save changes",
}: {
  message: string;
  onDiscard: () => void;
  onSave: () => void;
  pending: boolean;
  saveLabel?: string;
}) {
  return (
    <div className="a-savebar" role="region" aria-label="Unsaved changes">
      <span className="a-savebar__dot" aria-hidden />
      <span className="a-savebar__msg">{message}</span>
      <kbd className="a-savebar__key">⌘S</kbd>
      <button type="button" className="a-btn a-btn--ghost a-btn--onink" onClick={onDiscard} disabled={pending}>
        Discard
      </button>
      <button type="button" className="a-btn a-btn--primary" onClick={onSave} disabled={pending}>
        <Check size={16} />
        {pending ? "Saving…" : saveLabel}
      </button>
    </div>
  );
}
