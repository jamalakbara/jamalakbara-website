"use client";

// Canvas 41 "Translations": how much of the Bahasa site is written, the
// interface strings and privacy text, and the switch that publishes /id.

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { saveTranslations } from "@/lib/admin/translation-actions";
import { uiFields, type IdSite, type TranslationReport } from "@/lib/i18n/completeness";
import { Chip, Field, PageHeader, Panel, Toggle, useSaveShortcut } from "@/components/admin/ui";
import { useToast } from "@/components/admin/toast";
import { GuardedLink, useUnsaved } from "@/components/admin/unsaved";

type Path = (string | number)[];

function setIn<T>(target: T, path: Path, value: string): T {
  const [key, ...rest] = path;
  if (key === undefined) return value as T;
  const copy = (Array.isArray(target) ? [...target] : { ...target }) as Record<string | number, unknown>;
  copy[key] = setIn(copy[key], rest, value);
  return copy as T;
}

const sectionTitle = (key: string) => key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");

const previewContext: Record<string, string> = {
  "contact.greeting": "Appears in the prefilled WhatsApp message.",
  "contact.replyTo": "Appears in the prefilled WhatsApp message.",
  "privacy.description": "Used as the page’s search description.",
  "common.opensNewTab": "Announced by screen readers on links that open a new tab.",
};

export function TranslationsEditor({
  initialSite,
  initialPrivacy,
  report,
  ui,
}: {
  initialSite: IdSite;
  initialPrivacy: { updated: string; body: string };
  report: TranslationReport;
  ui: unknown;
}) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [base, setBase] = useState({ site: initialSite, privacy: initialPrivacy });
  const [site, setSite] = useState(initialSite);
  const [privacy, setPrivacy] = useState(initialPrivacy);
  const [error, setError] = useState<string | null>(null);
  const [previewSection, setPreviewSection] = useState<string | null>(null);
  const [previewFieldId, setPreviewFieldId] = useState<string | null>(null);
  const [lastEdited, setLastEdited] = useState<Record<string, string>>({});
  const [previewMatch, setPreviewMatch] = useState<"text" | "control" | "missing" | "multiple" | null>(null);
  const previewFrame = useRef<HTMLIFrameElement>(null);

  const dirty = JSON.stringify({ site, privacy }) !== JSON.stringify(base);
  useUnsaved(dirty);

  const fields = useMemo(() => uiFields(ui, site.ui).filter((f) => f.en.trim()), [ui, site.ui]);
  const savedValues = useMemo(
    () => new Map(uiFields(ui, base.site.ui).map((f) => [JSON.stringify(f.path), f.id])),
    [ui, base.site.ui],
  );
  const sections = useMemo(() => [...new Set(fields.map((f) => String(f.path[0])))], [fields]);
  const previewField = fields.find((f) => JSON.stringify(f.path) === previewFieldId);
  const previewValue = previewField && (previewField.id.trim() ? previewField.id : previewField.en);
  const savedPreviewValue = previewField && (savedValues.get(JSON.stringify(previewField.path))?.trim()
    ? savedValues.get(JSON.stringify(previewField.path))
    : previewField.en);
  const required = report.groups.filter((g) => g.required);
  const missing = required.flatMap((g) => g.missing);

  useEffect(() => {
    if (!previewSection) return;
    const frame = previewFrame.current;
    const origin = window.location.origin;
    const send = () => frame?.contentWindow?.postMessage(
      {
        type: "interface-preview",
        section: previewSection,
        draft: site.ui,
        field: previewFieldId,
        key: previewField?.path[1],
        value: previewValue,
      },
      origin,
    );
    const receive = (event: MessageEvent) => {
      if (event.origin !== origin || event.source !== frame?.contentWindow) return;
      if (event.data?.type === "interface-preview-ready") send();
      if (event.data?.type === "interface-preview-match" && event.data.field === previewFieldId && event.data.value === previewValue) {
        setPreviewMatch(event.data.match);
      }
    };
    window.addEventListener("message", receive);
    send();
    return () => window.removeEventListener("message", receive);
  }, [previewSection, site.ui, previewFieldId, previewField, previewValue]);

  function selectPreview(section: string, field: string | null) {
    if (section !== previewSection || field !== previewFieldId) setPreviewMatch(null);
    setPreviewSection(section);
    setPreviewFieldId(field);
  }

  function save() {
    if (!dirty || pending) return;
    setError(null);
    startTransition(async () => {
      const result = await saveTranslations(site, privacy);
      if (!result.ok) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      setBase({ site, privacy });
      toast.saved(result, "Bahasa copy");
      router.refresh();
    });
  }
  useSaveShortcut(save, dirty);

  return (
    <>
      <PageHeader
        eyebrow="Content / Translations"
        index="04"
        title="Translations"
        subtitle={dirty ? "Unsaved changes · one save = one commit" : "What still needs Bahasa before the site can go live."}
        actions={
          <button type="button" className="a-btn a-btn--primary" onClick={save} disabled={!dirty || pending}>
            <Check size={16} />
            {pending ? "Saving…" : "Save & publish"}
          </button>
        }
      />
      {error && <p className="a-banner">Save failed — {error}</p>}

      <div className="a-grid a-grid--rail">
        <div className="a-stack">
          <Panel title="Progress" bodyClass="a-panel__body">
            {report.groups.map((g) => (
              <div key={g.key} className="a-meter" style={{ padding: 0 }}>
                <div className="a-meter__top">
                  <span>
                    {g.label}
                    <span className="a-meta a-muted"> · {g.detail}</span>
                  </span>
                  <span className="a-meter__val" data-state={g.done === g.total ? undefined : "warn"}>
                    {g.done} of {g.total}
                  </span>
                </div>
                <div className="a-meter__track">
                  <div className="a-meter__bar" data-state={g.done === g.total ? undefined : "warn"} style={{ width: `${g.total ? (g.done / g.total) * 100 : 100}%` }} />
                </div>
              </div>
            ))}
          </Panel>

          <section className="a-panel" id="interface">
            <div className="a-panel__head">
              <h2 className="a-title">Interface text</h2>
            </div>
            <div className="a-panel__body">
              <p className="a-meta a-muted">Open a section to compare its Bahasa text with the English original. Keep {"{name}"} and {"{n}"} as they are, and keep line breaks where you want them on the page.</p>
              <div className="a-interface-layout" data-preview={previewSection !== null}>
                <div className="a-stack">
                  {sections.map((section) => {
                    const list = fields.filter((f) => f.path[0] === section).map((f) => ({
                      ...f,
                      different: Boolean(f.id.trim()) && f.id !== f.en,
                      unsaved: f.id !== savedValues.get(JSON.stringify(f.path)),
                    }));
                    const left = list.filter((f) => !f.id.trim()).length;
                    const different = list.filter((f) => f.different).length;
                    const unsaved = list.filter((f) => f.unsaved).length;
                    return (
                      <details key={section} open={left > 0 && left < list.length}>
                        <summary className="a-label" style={{ cursor: "pointer", padding: "8px 0" }}>
                          {sectionTitle(section)}{" "}
                          <span className="a-meta a-muted">
                            {different} of {list.length} differ from English
                            {left > 0 && ` · ${left} left`}
                          </span>
                          {unsaved > 0 && <>{" "}<Chip kind="draft">{unsaved} unsaved</Chip></>}
                        </summary>
                        <div className="a-stack" style={{ gap: 12, paddingTop: 8 }}>
                          <div>
                            <button
                              type="button"
                              className="a-btn a-btn--secondary"
                              aria-pressed={previewSection === section}
                              onClick={() => selectPreview(section, lastEdited[section] ?? null)}
                            >
                              Preview {sectionTitle(section)} on site
                            </button>
                          </div>
                          {list.map((f) => {
                            const label = f.path.slice(1).join(" / ");
                            const inputId = `translation-${f.path.join(".")}`;
                            const fieldId = JSON.stringify(f.path);
                            const update = (value: string) => {
                              setSite((s) => ({ ...s, ui: setIn(s.ui, f.path, value) }));
                              setLastEdited((edited) => ({ ...edited, [section]: fieldId }));
                              if (previewSection) selectPreview(section, fieldId);
                            };
                            return (
                              <Field
                                key={inputId}
                                htmlFor={inputId}
                                label={
                                  <>
                                    {label}{" "}
                                    {f.different && <Chip kind="bahasa">Differs from English</Chip>}
                                    {f.unsaved && <>{" "}<Chip kind="draft">Unsaved</Chip></>}
                                  </>
                                }
                                help={<>English original: <span style={{ whiteSpace: "pre-wrap" }}>{f.en}</span></>}
                              >
                                {f.en.length > 60 || f.en.includes("\n") ? (
                                  <textarea id={inputId} className="a-input" rows={3} placeholder={f.en} value={f.id} onChange={(e) => update(e.target.value)} />
                                ) : (
                                  <input id={inputId} className="a-input" placeholder={f.en} value={f.id} onChange={(e) => update(e.target.value)} />
                                )}
                              </Field>
                            );
                          })}
                        </div>
                      </details>
                    );
                  })}
                </div>
                {previewSection && (
                  <div className="a-stack a-interface-preview">
                    <div className="a-interface-preview__head">
                      <div>
                        <h3 className="a-title">{sectionTitle(previewSection)} preview</h3>
                        <p className="a-meta a-muted">Updates as you edit · Bahasa draft</p>
                      </div>
                      <button type="button" className="a-btn a-btn--ghost" onClick={() => {
                        setPreviewSection(null);
                        setPreviewFieldId(null);
                      }}>
                        Close
                      </button>
                    </div>
                    {previewField ? (
                      <div className="a-interface-preview__copy">
                        <p className="a-label">{previewField.path.slice(1).join(" / ")}</p>
                        {savedPreviewValue !== previewValue && <p className="a-meta a-muted">Saved · {savedPreviewValue}</p>}
                        <p className="a-meta">Current · {previewValue}</p>
                        <p className="a-meta a-muted" role="status">
                          {previewMatch === "text" && "Highlighted on the page."}
                          {previewMatch === "control" && "Highlighted the control that uses this text."}
                          {previewMatch === "multiple" && "This wording appears in several places in this view."}
                          {previewMatch === "missing" && (previewContext[previewField.path.join(".")] ?? "This text is outside the current view or appears in another page state.")}
                        </p>
                      </div>
                    ) : <p className="a-meta a-muted">Edit a field to find it on the page.</p>}
                    <iframe
                      ref={previewFrame}
                      src={`/admin/interface-preview?section=${encodeURIComponent(previewSection)}`}
                      title={`${sectionTitle(previewSection)} site preview`}
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="a-panel" id="privacy">
            <div className="a-panel__head">
              <h2 className="a-title">Privacy policy</h2>
            </div>
            <div className="a-panel__body">
              <Field label="Last updated" help="Use YYYY-MM-DD.">
                <input className="a-input" value={privacy.updated} onChange={(e) => setPrivacy((p) => ({ ...p, updated: e.target.value }))} />
              </Field>
              <Field label="Text" count={privacy.body.length} help="Markdown. Each ## heading joins the in-page index.">
                <textarea className="a-input" rows={16} value={privacy.body} onChange={(e) => setPrivacy((p) => ({ ...p, body: e.target.value }))} />
              </Field>
            </div>
          </section>
        </div>

        <aside className="a-stack a-sticky">
          <Panel title="Publish Bahasa" bodyClass="a-panel__body">
            <Toggle checked={site.published} onChange={(v) => (report.ready || !v) && setSite((s) => ({ ...s, published: v }))}>
              Publish Bahasa site
            </Toggle>
            <p className="a-meta a-muted">
              {report.ready
                ? "Required copy is done. Publishing turns on /id, the language link and hreflang, and redirects old /jurnal URLs."
                : "Locked until pages, interface text and the privacy policy are done. Projects can follow later."}
            </p>
            {missing.slice(0, 8).map((m) => (
              <GuardedLink key={m.label} href={m.href} className="a-media">
                <span className="a-media__text">
                  <span className="a-label a-truncate">{m.label}</span>
                </span>
                <ArrowRight size={16} />
              </GuardedLink>
            ))}
            {missing.length > 8 && <p className="a-meta a-muted">And {missing.length - 8} more.</p>}
          </Panel>
        </aside>
      </div>
    </>
  );
}
