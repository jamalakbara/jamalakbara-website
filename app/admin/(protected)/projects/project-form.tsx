"use client";

// Canvas 26 "Project editor": Basics / Media / Story / Results on the left,
// Publish · Draft preview · SEO rail on the right.

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, GripVertical, Link2, Plus, Trash2 } from "lucide-react";
import type { Project } from "@/lib/content-types";
import { MediaField, GalleryField } from "@/components/admin/media-field";
import { useConfirm } from "@/components/admin/confirm-dialog";
import { useToast } from "@/components/admin/toast";
import { useUnsaved } from "@/components/admin/unsaved";
import {
  Chip,
  Field,
  PageHeader,
  Panel,
  PreviewButton,
  PreviewPanel,
  Section,
  LanguageBar,
  SeoPanel,
  type EditLanguage,
  TagInput,
  Toggle,
  usePreview,
  useSaveShortcut,
} from "@/components/admin/ui";
import { projectSeo } from "@/lib/admin/seo-checklist";
import { saveProjectTranslation } from "@/lib/admin/translation-actions";
import { blankProject, type IdProject } from "@/lib/i18n/completeness";
import { mediaKey } from "@/lib/media-meta";
import { timeAgo } from "@/lib/admin/format";
import type { LastEdit } from "@/lib/admin/project-meta";
import { deleteProject, previewProject, upsertProject } from "./actions";

type Metric = { label: string; value: string };

function toForm(p?: Project) {
  return {
    id: p?.id ?? "",
    title: p?.title ?? "",
    category: p?.category ?? "",
    year: p?.year ?? String(new Date().getFullYear()),
    description: p?.description ?? "",
    summary: p?.summary ?? "",
    image: p?.image ?? "",
    video: p?.video ?? "",
    url: p?.url ?? "",
    livePreview: p?.livePreview ?? "",
    featured: p?.featured ?? false,
    draft: p?.draft ?? false,
    caseStudy: p?.caseStudy ?? false,
    seoTitle: p?.seo?.title ?? "",
    seoDescription: p?.seo?.description ?? "",
    tech: p?.tech ?? [],
    challenge: p?.challenge ?? "",
    solution: p?.solution ?? "",
    features: (p?.features ?? []).join("\n"),
    gallery: p?.gallery ?? [],
    testimonialQuote: p?.testimonial?.quote ?? "",
    testimonialAuthor: p?.testimonial?.author ?? "",
    testimonialRole: p?.testimonial?.role ?? "",
    metrics: (p?.metrics ?? []) as Metric[],
  };
}
type Form = ReturnType<typeof toForm>;

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-");

function buildProject(f: Form): Project {
  const opt = (s: string) => (s.trim() ? s.trim() : undefined);
  const features = f.features.split("\n").map((l) => l.trim()).filter(Boolean);
  const metrics = f.metrics.filter((m) => m.label.trim() && m.value.trim());
  return {
    id: f.id.trim(),
    title: f.title.trim(),
    category: f.category.trim(),
    year: f.year.trim(),
    description: f.description.trim(),
    summary: opt(f.summary),
    image: f.image.trim(),
    video: opt(f.video),
    url: opt(f.url),
    livePreview: opt(f.livePreview),
    featured: f.featured || undefined,
    draft: f.draft || undefined,
    caseStudy: f.caseStudy || undefined,
    seo: f.seoTitle.trim() || f.seoDescription.trim() ? { title: f.seoTitle.trim(), description: f.seoDescription.trim() } : undefined,
    tech: f.tech,
    challenge: opt(f.challenge),
    solution: opt(f.solution),
    features: features.length ? features : undefined,
    gallery: f.gallery.length ? f.gallery : undefined,
    testimonial: f.testimonialQuote.trim()
      ? { quote: f.testimonialQuote.trim(), author: f.testimonialAuthor.trim(), role: f.testimonialRole.trim() }
      : undefined,
    metrics: metrics.length ? metrics : undefined,
  };
}

const YEARS = Array.from({ length: 12 }, (_, i) => String(new Date().getFullYear() + 1 - i));
const host = (u: string) => u.replace(/^https?:\/\//, "").replace(/\/$/, "");

export function ProjectForm({
  initial,
  index,
  categories,
  alt,
  lastEdit,
  bahasa,
}: {
  initial?: Project;
  index: number;
  categories: string[];
  alt: Record<string, string>;
  lastEdit: LastEdit | null;
  bahasa?: IdProject;
}) {
  const router = useRouter();
  const toast = useToast();
  const { confirm, dialog } = useConfirm();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(() => toForm(initial));
  const [form, setForm] = useState(saved);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [error, setError] = useState<string | null>(null);

  const [language, setLanguage] = useState<EditLanguage>("en");
  const [savedId, setSavedId] = useState<IdProject | null>(() => (initial ? (bahasa ?? blankProject(initial)) : null));
  const [idForm, setIdForm] = useState(savedId);
  const setId = (patch: Partial<IdProject>) => setIdForm((f) => (f ? { ...f, ...patch } : f));
  const idDirty = JSON.stringify(idForm) !== JSON.stringify(savedId);
  const formDirty = JSON.stringify(form) !== JSON.stringify(saved);
  const dirty = formDirty || idDirty;
  useUnsaved(dirty);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => ({ ...f, [key]: value }));
  const project = useMemo(() => buildProject(form), [form]);
  // What this project reads like in the language being edited.
  const shown = useMemo<Project>(() => {
    if (language === "en" || !idForm) return project;
    const pick = (id: string, en?: string) => id.trim() || en;
    return {
      ...project,
      category: pick(idForm.category, project.category) as string,
      summary: pick(idForm.summary, project.summary),
      description: pick(idForm.description, project.description) as string,
      seo: idForm.seo,
    };
  }, [language, idForm, project]);
  const seo = useMemo(() => projectSeo(shown, (u) => alt[mediaKey(u)], language), [shown, alt, language]);
  const preview = usePreview(() => previewProject(shown));
  const summaryOver = form.summary.length > 110;

  function save() {
    if (pending) return;
    setError(null);
    startTransition(async () => {
      if (idDirty && idForm && initial) {
        const translated = await saveProjectTranslation(initial.id, idForm);
        if (!translated.ok) {
          setError(translated.error);
          toast.error(translated.error);
          return;
        }
        setSavedId(idForm);
        if (!formDirty) {
          toast.saved(translated, `“${project.title}” in Bahasa`);
          router.refresh();
          return;
        }
      }
      const result = await upsertProject(project, initial?.id);
      if (!result.ok) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      setSaved(form);
      toast.saved(result, `“${project.title}”`);
      if (!initial || initial.id !== result.id) router.replace(`/admin/projects/${result.id}`);
      else router.refresh();
    });
  }
  useSaveShortcut(save, dirty);

  async function remove() {
    if (!initial) return;
    if (!(await confirm({ title: `Delete “${initial.title}”?`, message: "It disappears from /work on the next publish. This can’t be undone here.", confirmLabel: "Delete project" }))) return;
    startTransition(async () => {
      const result = await deleteProject(initial.id);
      if (!result.ok) return toast.error(result.error);
      toast.saved(result, `Removed “${initial.title}”`);
      setSaved(form);
      router.push("/admin/projects");
    });
  }

  const status = form.draft ? "Hidden from site" : lastEdit?.state === "building" ? "Building" : "Published";
  const subtitle = [form.category || "No category", form.year, initial ? (dirty ? "unsaved edits" : lastEdit ? `last saved ${timeAgo(lastEdit.date)}` : null) : "new project"]
    .filter(Boolean)
    .join(" · ");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="a-stack"
    >
      <PageHeader
        eyebrow={initial ? "Work / Edit" : "Work / New"}
        index={String(index + 1).padStart(2, "0")}
        title={form.title || "Untitled project"}
        subtitle={subtitle}
        back={{ href: "/admin/projects", label: "All work" }}
        actions={
          <>
            <PreviewButton preview={preview} />
            <button type="submit" className="a-btn a-btn--primary" disabled={pending}>
              <Check size={16} />
              {pending ? "Saving…" : form.draft ? "Save (hidden)" : "Save & publish"}
            </button>
          </>
        }
      />

      {error && <p className="a-banner">Save failed — {error}</p>}

      {initial && <LanguageBar value={language} onChange={setLanguage} note="Copy and SEO change per language. Media and tech are shared." />}

      <div className="a-grid a-grid--rail">
        <div className="a-stack">
          {language === "id" && idForm && initial && (
            <Section n="ID" title="Bahasa copy">
              <p className="a-meta a-muted">Needs category, row summary and description to show on /id/work. A case study needs the story too.</p>
              <Field label="Category">
                <input className="a-input" placeholder={initial.category} value={idForm.category} onChange={(e) => setId({ category: e.target.value })} />
              </Field>
              <Field label="Row summary" count={idForm.summary.length} max={110}>
                <textarea className="a-input" rows={2} placeholder={initial.summary} value={idForm.summary} onChange={(e) => setId({ summary: e.target.value })} />
              </Field>
              <Field label="Description" count={idForm.description.length}>
                <textarea className="a-input" rows={4} placeholder={initial.description} value={idForm.description} onChange={(e) => setId({ description: e.target.value })} />
              </Field>
              <Field label="Challenge" count={idForm.challenge.length}>
                <textarea className="a-input" rows={4} placeholder={initial.challenge} value={idForm.challenge} onChange={(e) => setId({ challenge: e.target.value })} />
              </Field>
              <Field label="Solution" count={idForm.solution.length}>
                <textarea className="a-input" rows={4} placeholder={initial.solution} value={idForm.solution} onChange={(e) => setId({ solution: e.target.value })} />
              </Field>
              {(initial.features ?? []).map((feature, i) => (
                <Field key={i} label={`Feature ${i + 1}`}>
                  <input
                    className="a-input"
                    placeholder={feature}
                    value={idForm.features[i] ?? ""}
                    onChange={(e) => setId({ features: (initial.features ?? []).map((_, j) => (j === i ? e.target.value : (idForm.features[j] ?? ""))) })}
                  />
                </Field>
              ))}
              {(initial.metrics ?? []).map((metric, i) => (
                <Field key={i} label={`Metric label ${i + 1}`} help={`Value stays ${metric.value}`}>
                  <input
                    className="a-input"
                    placeholder={metric.label}
                    value={idForm.metricLabels[i] ?? ""}
                    onChange={(e) => setId({ metricLabels: (initial.metrics ?? []).map((_, j) => (j === i ? e.target.value : (idForm.metricLabels[j] ?? ""))) })}
                  />
                </Field>
              ))}
              <Field label="SEO title" count={idForm.seo.title.length} max={40}>
                <input className="a-input" value={idForm.seo.title} onChange={(e) => setId({ seo: { ...idForm.seo, title: e.target.value } })} />
              </Field>
              <Field label="SEO description" count={idForm.seo.description.length} max={160} min={120}>
                <textarea className="a-input" rows={3} value={idForm.seo.description} onChange={(e) => setId({ seo: { ...idForm.seo, description: e.target.value } })} />
              </Field>
            </Section>
          )}
          {language === "en" && (
            <>
          <Section n="01" title="Basics">
            <div className="a-row2">
              <Field label="Title" count={form.title.length} max={60}>
                <input
                  className="a-input"
                  required
                  value={form.title}
                  onChange={(e) => {
                    set("title", e.target.value);
                    if (!slugTouched) set("id", slugify(e.target.value));
                  }}
                />
              </Field>
              <Field label="Slug" help={`jamalakbara.com/work${form.caseStudy ? "/" : "#"}${form.id || "…"}`}>
                <label className="a-input">
                  <Link2 size={16} />
                  <input
                    required
                    pattern="[a-z0-9-]+"
                    title="lowercase letters, numbers, dashes"
                    value={form.id}
                    onChange={(e) => {
                      setSlugTouched(true);
                      set("id", e.target.value);
                    }}
                  />
                </label>
              </Field>
            </div>
            <div className="a-row3">
              <Field label="Category">
                <input className="a-input" list="a-categories" required value={form.category} onChange={(e) => set("category", e.target.value)} />
                <datalist id="a-categories">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </Field>
              <Field label="Year">
                <select className="a-input" value={form.year} onChange={(e) => set("year", e.target.value)}>
                  {[...new Set([form.year, ...YEARS])].map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </Field>
              <Field label="Live site">
                <input className="a-input" type="url" placeholder="https://" value={form.url} onChange={(e) => set("url", e.target.value)} />
              </Field>
            </div>
            <Field
              label="Row summary"
              count={form.summary.length}
              max={110}
              error={summaryOver ? "Keep it under 110 characters." : undefined}
              help="Shown on the Work rows — two lines at most."
            >
              <textarea className="a-input" rows={2} aria-invalid={summaryOver} value={form.summary} onChange={(e) => set("summary", e.target.value)} />
            </Field>
            <Field label="Description" count={form.description.length}>
              <textarea className="a-input" rows={4} required value={form.description} onChange={(e) => set("description", e.target.value)} />
            </Field>
          </Section>

          <Section n="02" title="Media">
            <MediaField label="Cover" hint="Fallback when there is no gallery · Cloudinary" value={form.image} onChange={(v) => set("image", v)} />
            <GalleryField value={form.gallery} onChange={(v) => set("gallery", v)} />
            <MediaField label="Row video" kind="video" hint="MP4 or WebM · silent loop in the Work row's first media slot (first frame is the poster)" value={form.video} onChange={(v) => set("video", v)} />
            <Field label="Live preview URL" help="Where the row links when set (else the live site).">
              <input className="a-input" type="url" placeholder="https://" value={form.livePreview} onChange={(e) => set("livePreview", e.target.value)} />
            </Field>
          </Section>

          <Section n="03" title="Story">
            <Field label="Challenge" count={form.challenge.length}>
              <textarea className="a-input" rows={4} value={form.challenge} onChange={(e) => set("challenge", e.target.value)} />
            </Field>
            <Field label="Solution" count={form.solution.length}>
              <textarea className="a-input" rows={4} value={form.solution} onChange={(e) => set("solution", e.target.value)} />
            </Field>
            <Field label="Features" help="One per line.">
              <textarea className="a-input" rows={4} value={form.features} onChange={(e) => set("features", e.target.value)} />
            </Field>
          </Section>

          <Section n="04" title="Results">
            <Field label="Tech">
              <TagInput value={form.tech} onChange={(v) => set("tech", v)} />
            </Field>
            <div className="a-field">
              <span className="a-field__top">Metrics</span>
              {form.metrics.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <GripVertical size={16} color="var(--f-line)" aria-hidden />
                  <input
                    className="a-input"
                    style={{ flex: 3 }}
                    placeholder="Label"
                    aria-label={`Metric ${i + 1} label`}
                    value={m.label}
                    onChange={(e) => set("metrics", form.metrics.map((r, j) => (j === i ? { ...r, label: e.target.value } : r)))}
                  />
                  <input
                    className="a-input"
                    style={{ flex: 1 }}
                    placeholder="Value"
                    aria-label={`Metric ${i + 1} value`}
                    value={m.value}
                    onChange={(e) => set("metrics", form.metrics.map((r, j) => (j === i ? { ...r, value: e.target.value } : r)))}
                  />
                  <button type="button" className="a-iconbtn a-iconbtn--danger" aria-label={`Remove metric ${i + 1}`} onClick={() => set("metrics", form.metrics.filter((_, j) => j !== i))}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button type="button" className="a-link a-small" style={{ display: "inline-flex", alignItems: "center", gap: 6, alignSelf: "flex-start" }} onClick={() => set("metrics", [...form.metrics, { label: "", value: "" }])}>
                <Plus size={14} />
                Add metric
              </button>
            </div>
            <Field label="Testimonial quote">
              <textarea className="a-input" rows={3} value={form.testimonialQuote} onChange={(e) => set("testimonialQuote", e.target.value)} />
            </Field>
            <div className="a-row2">
              <Field label="Author">
                <input className="a-input" value={form.testimonialAuthor} onChange={(e) => set("testimonialAuthor", e.target.value)} />
              </Field>
              <Field label="Role">
                <input className="a-input" value={form.testimonialRole} onChange={(e) => set("testimonialRole", e.target.value)} />
              </Field>
            </div>
          </Section>

          <Section n="05" title="Case study">
            <p className="a-meta a-muted">
              Check challenge, solution and metrics before you publish. Off keeps the row linking to the live site.
            </p>
            <Toggle checked={form.caseStudy} onChange={(v) => set("caseStudy", v)}>
              Publish case study page
            </Toggle>
            <Field label="SEO title" count={form.seoTitle.length} max={40} help="Blank uses the project title.">
              <input className="a-input" value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} />
            </Field>
            <Field label="SEO description" count={form.seoDescription.length} max={160} min={120} help="Blank uses the row summary.">
              <textarea className="a-input" rows={3} value={form.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} />
            </Field>
          </Section>
            </>
          )}
        </div>

        <aside className="a-stack a-sticky">
          <Panel
            title="Publish"
            aside={<Chip kind={form.draft ? "draft" : lastEdit?.state === "building" ? "building" : "live"}>{status}</Chip>}
          >
            <div style={{ marginTop: -12 }}>
              <Toggle checked={form.featured} onChange={(v) => set("featured", v)}>
                Featured on home
              </Toggle>
              <Toggle checked={form.draft} onChange={(v) => set("draft", v)}>
                Hide from site (draft)
              </Toggle>
            </div>
            <hr className="a-divider" />
            <p className="a-meta a-muted">
              {lastEdit ? `Last commit ${lastEdit.sha.slice(0, 7)} · ${timeAgo(lastEdit.date)}` : initial ? "No commits found for this project yet." : "Not saved yet."}
              <br />
              {form.url ? `Links to ${host(form.url)} · ` : ""}Saving commits to main → Vercel rebuilds in ~2 min
            </p>
          </Panel>
          <PreviewPanel preview={preview} />
          <SeoPanel report={seo} />
          {initial && (
            <button type="button" className="a-btn a-btn--ghost" style={{ color: "var(--f-error)", justifyContent: "space-between" }} onClick={remove} disabled={pending}>
              Delete this project
              <Trash2 size={16} />
            </button>
          )}
        </aside>
      </div>
      {dialog}
    </form>
  );
}
