"use client";

// Canvas 38 "Service page editor": one entry of content/service-pages.json.
// The FAQ here is both the visible FAQ and the page's FAQPage JSON-LD.

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Check, Link2, Plus, Trash2 } from "lucide-react";
import type { ServicePage } from "@/lib/content-types";
import { servicePageSeo } from "@/lib/admin/seo-checklist";
import { deleteServicePage, upsertServicePage } from "@/lib/admin/service-page-actions";
import { useConfirm } from "@/components/admin/confirm-dialog";
import { useToast } from "@/components/admin/toast";
import { useUnsaved } from "@/components/admin/unsaved";
import { Chip, Field, PageHeader, Panel, SeoPanel, Section, Toggle, useSaveShortcut } from "@/components/admin/ui";

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-");

const blank = (): ServicePage => ({
  lang: "id",
  slug: "",
  draft: true,
  eyebrow: "LAYANAN",
  title: "",
  intro: "",
  sections: [{ heading: "", body: "" }],
  faq: [{ question: "", answer: "" }],
  cta: { heading: "", label: "Ceritain ke aku" },
  seo: { title: "", description: "" },
});

export function ServicePageForm({ initial, pages }: { initial?: ServicePage; pages: ServicePage[] }) {
  const router = useRouter();
  const toast = useToast();
  const { confirm, dialog } = useConfirm();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState<ServicePage>(() => initial ?? blank());
  const [form, setForm] = useState<ServicePage>(saved);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [error, setError] = useState<string | null>(null);

  const dirty = JSON.stringify(form) !== JSON.stringify(saved);
  useUnsaved(dirty);

  const set = <K extends keyof ServicePage>(key: K, value: ServicePage[K]) => setForm((f) => ({ ...f, [key]: value }));
  const setAt = <K extends "sections" | "faq">(key: K, i: number, patch: Partial<ServicePage[K][number]>) =>
    setForm((f) => ({ ...f, [key]: f[key].map((item, j) => (j === i ? { ...item, ...patch } : item)) }));
  const removeAt = (key: "sections" | "faq", i: number) => setForm((f) => ({ ...f, [key]: f[key].filter((_, j) => j !== i) }));

  const seo = useMemo(() => servicePageSeo(form), [form]);
  const publicPath = `${form.lang === "id" ? "/id" : ""}/services/${form.slug || "…"}`;
  const twins = pages.filter((p) => p.lang !== form.lang);
  const twin = twins.find((p) => p.slug === form.alternate);

  function save() {
    if (pending) return;
    setError(null);
    startTransition(async () => {
      const result = await upsertServicePage({ ...form, draft: form.draft || undefined }, initial?.slug);
      if (!result.ok) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      setSaved(form);
      toast.saved(result, `“${form.seo.title || form.title}”`);
      if (!initial || initial.slug !== result.slug) router.replace(`/admin/service-pages/${result.slug}`);
      else router.refresh();
    });
  }
  useSaveShortcut(save, dirty);

  async function remove() {
    if (!initial) return;
    if (!(await confirm({ title: `Delete “${initial.title}”?`, message: "The page disappears on the next publish. This can’t be undone here.", confirmLabel: "Delete page" }))) return;
    startTransition(async () => {
      const result = await deleteServicePage(initial.slug);
      if (!result.ok) return toast.error(result.error);
      toast.saved(result, "Page removed");
      setSaved(form);
      router.push("/admin/service-pages");
    });
  }

  return (
    <form
      className="a-stack"
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <PageHeader
        eyebrow={initial ? "Service pages / Edit" : "Service pages / New"}
        index="03"
        title={form.seo.title || form.title || "Untitled page"}
        subtitle={`${publicPath} · ${form.draft ? "draft" : "published"}${dirty ? " · unsaved edits" : ""}`}
        back={{ href: "/admin/service-pages", label: "All service pages" }}
        actions={
          <>
            {initial && !initial.draft && (
              <a className="a-btn a-btn--secondary" href={publicPath} target="_blank" rel="noreferrer">
                <ArrowUpRight size={16} />
                Open page
              </a>
            )}
            <button type="submit" className="a-btn a-btn--primary" disabled={pending}>
              <Check size={16} />
              {pending ? "Saving…" : form.draft ? "Save draft" : "Save & publish"}
            </button>
          </>
        }
      />

      {error && <p className="a-banner">Save failed — {error}</p>}

      <div className="a-grid a-grid--rail">
        <div className="a-stack">
          <Section n="01" title="Page">
            <div className="a-row2">
              <Field label="Eyebrow" help="Small label above the title.">
                <input className="a-input" required value={form.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} />
              </Field>
              <Field label="Slug" help={`jamalakbara.com${publicPath}`}>
                <input
                  className="a-input"
                  required
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", slugify(e.target.value));
                  }}
                />
              </Field>
            </div>
            <Field label="Title" count={form.title.length} help="The page's h1.">
              <input
                className="a-input"
                required
                value={form.title}
                onChange={(e) => {
                  set("title", e.target.value);
                  if (!slugTouched) set("slug", slugify(e.target.value));
                }}
              />
            </Field>
            <Field label="Intro" count={form.intro.length}>
              <textarea className="a-input" rows={4} required value={form.intro} onChange={(e) => set("intro", e.target.value)} />
            </Field>
          </Section>

          <Section n="02" title="Sections">
            {form.sections.map((section, i) => (
              <div key={i} className="a-stack" style={{ gap: 12 }}>
                <Field label={`Heading ${i + 1}`}>
                  <input className="a-input" required value={section.heading} onChange={(e) => setAt("sections", i, { heading: e.target.value })} />
                </Field>
                <Field label="Body" count={section.body.length}>
                  <textarea className="a-input" rows={4} required value={section.body} onChange={(e) => setAt("sections", i, { body: e.target.value })} />
                </Field>
                <button type="button" className="a-link a-small" style={{ alignSelf: "flex-start" }} onClick={() => removeAt("sections", i)}>
                  Remove section
                </button>
                <hr className="a-divider" />
              </div>
            ))}
            <button type="button" className="a-link a-small" style={{ display: "inline-flex", alignItems: "center", gap: 6, alignSelf: "flex-start" }} onClick={() => set("sections", [...form.sections, { heading: "", body: "" }])}>
              <Plus size={14} />
              Add section
            </button>
          </Section>

          <Section n="03" title="FAQ">
            <p className="a-meta a-muted">Shown on the page and sent to Google as FAQ data.</p>
            {form.faq.map((item, i) => (
              <div key={i} className="a-stack" style={{ gap: 12 }}>
                <Field label={`Question ${i + 1}`}>
                  <input className="a-input" required value={item.question} onChange={(e) => setAt("faq", i, { question: e.target.value })} />
                </Field>
                <Field label="Answer" count={item.answer.length}>
                  <textarea className="a-input" rows={3} required value={item.answer} onChange={(e) => setAt("faq", i, { answer: e.target.value })} />
                </Field>
                <button type="button" className="a-link a-small" style={{ alignSelf: "flex-start" }} onClick={() => removeAt("faq", i)}>
                  Remove question
                </button>
                <hr className="a-divider" />
              </div>
            ))}
            <button type="button" className="a-link a-small" style={{ display: "inline-flex", alignItems: "center", gap: 6, alignSelf: "flex-start" }} onClick={() => set("faq", [...form.faq, { question: "", answer: "" }])}>
              <Plus size={14} />
              Add question
            </button>
          </Section>

          <Section n="04" title="CTA and SEO">
            <div className="a-row2">
              <Field label="CTA heading">
                <input className="a-input" required value={form.cta.heading} onChange={(e) => set("cta", { ...form.cta, heading: e.target.value })} />
              </Field>
              <Field label="CTA label">
                <input className="a-input" required value={form.cta.label} onChange={(e) => set("cta", { ...form.cta, label: e.target.value })} />
              </Field>
            </div>
            <Field label="SEO title" count={form.seo.title.length} max={40} help="Shows as “… | Jamal Akbar Alam”. Blank uses the page title.">
              <input className="a-input" value={form.seo.title} onChange={(e) => set("seo", { ...form.seo, title: e.target.value })} />
            </Field>
            <Field label="SEO description" count={form.seo.description.length} max={160} min={120}>
              <textarea className="a-input" rows={3} value={form.seo.description} onChange={(e) => set("seo", { ...form.seo, description: e.target.value })} />
            </Field>
          </Section>
        </div>

        <aside className="a-stack a-sticky">
          <Panel title="Language" bodyClass="a-panel__body">
            <Field label="Page language">
              <select className="a-input" value={form.lang} onChange={(e) => setForm((f) => ({ ...f, lang: e.target.value as ServicePage["lang"], alternate: undefined }))}>
                <option value="en">English</option>
                <option value="id">Bahasa Indonesia</option>
              </select>
            </Field>
            <Field label={form.lang === "id" ? "Linked English page" : "Linked Bahasa page"} help="Adds hreflang and the language link.">
              <select className="a-input" value={form.alternate ?? ""} onChange={(e) => set("alternate", e.target.value || undefined)}>
                <option value="">Not linked</option>
                {twins.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.seo.title || p.title}
                  </option>
                ))}
              </select>
            </Field>
            {twin && (
              <Link href={`/admin/service-pages/${twin.slug}`} className="a-media">
                <Link2 size={16} color="var(--f-muted)" />
                <span className="a-media__text">
                  <span className="a-label a-truncate">{twin.seo.title || twin.title}</span>
                </span>
                <ArrowUpRight size={16} />
              </Link>
            )}
          </Panel>
          <Panel title="Publish" aside={<Chip kind={form.draft ? "draft" : "published"}>{form.draft ? "Draft" : "Published"}</Chip>}>
            <div style={{ marginTop: -12 }}>
              <Toggle checked={!form.draft} onChange={(v) => set("draft", !v)}>
                Published
              </Toggle>
            </div>
            <p className="a-meta a-muted">Drafts have no public page and stay out of the sitemap.</p>
          </Panel>
          <SeoPanel report={seo} />
          {initial && (
            <button type="button" className="a-btn a-btn--ghost" style={{ color: "var(--f-error)", justifyContent: "space-between" }} onClick={remove} disabled={pending}>
              Delete this page
              <Trash2 size={16} />
            </button>
          )}
        </aside>
      </div>
      {dialog}
    </form>
  );
}
