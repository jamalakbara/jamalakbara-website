"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/content-types";
import { MediaField } from "@/components/admin/media-field";
import { useConfirm } from "@/components/admin/confirm-dialog";
import { deleteProject, upsertProject } from "./actions";
import { input, label } from "@/lib/admin/form-styles";

const lines = (s: string) =>
  s.split("\n").map((l) => l.trim()).filter(Boolean);
const commas = (s: string) =>
  s.split(",").map((l) => l.trim()).filter(Boolean);

type MetricRow = { label: string; value: string };

export function ProjectForm({ initial }: { initial?: Project }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { confirm, dialog } = useConfirm();

  const [form, setForm] = useState({
    id: initial?.id ?? "",
    title: initial?.title ?? "",
    category: initial?.category ?? "",
    year: initial?.year ?? String(new Date().getFullYear()),
    description: initial?.description ?? "",
    image: initial?.image ?? "",
    video: initial?.video ?? "",
    url: initial?.url ?? "",
    livePreview: initial?.livePreview ?? "",
    featured: initial?.featured ?? false,
    tech: (initial?.tech ?? []).join(", "),
    challenge: initial?.challenge ?? "",
    solution: initial?.solution ?? "",
    features: (initial?.features ?? []).join("\n"),
    gallery: (initial?.gallery ?? []).join("\n"),
    testimonialQuote: initial?.testimonial?.quote ?? "",
    testimonialAuthor: initial?.testimonial?.author ?? "",
    testimonialRole: initial?.testimonial?.role ?? "",
  });
  const [metrics, setMetrics] = useState<MetricRow[]>(initial?.metrics ?? []);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  function buildProject(): Project {
    const opt = (s: string) => (s.trim() ? s.trim() : undefined);
    return {
      id: form.id.trim(),
      title: form.title.trim(),
      category: form.category.trim(),
      year: form.year.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      video: opt(form.video),
      url: opt(form.url),
      livePreview: opt(form.livePreview),
      featured: form.featured || undefined,
      tech: commas(form.tech),
      challenge: opt(form.challenge),
      solution: opt(form.solution),
      features: lines(form.features).length ? lines(form.features) : undefined,
      gallery: lines(form.gallery).length ? lines(form.gallery) : undefined,
      testimonial: form.testimonialQuote.trim()
        ? {
            quote: form.testimonialQuote.trim(),
            author: form.testimonialAuthor.trim(),
            role: form.testimonialRole.trim(),
          }
        : undefined,
      metrics: metrics.filter((m) => m.label.trim() && m.value.trim()).length
        ? metrics.filter((m) => m.label.trim() && m.value.trim())
        : undefined,
    };
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await upsertProject(buildProject(), initial?.id);
      if (result.ok) router.push("/admin/projects");
      else setError(result.error);
    });
  }

  async function remove() {
    if (!initial) return;
    if (!(await confirm({ title: `Delete project "${initial.title}"?` }))) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteProject(initial.id);
      if (result.ok) router.push("/admin/projects");
      else setError(result.error);
    });
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <section className="liquid-glass cursor-default space-y-4 rounded-2xl p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Title</label>
            <input className={input} required value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div>
            <label className={label}>Slug (id)</label>
            <input
              className={input}
              required
              pattern="[a-z0-9-]+"
              title="lowercase letters, numbers, dashes"
              value={form.id}
              onChange={(e) => set("id", e.target.value)}
            />
          </div>
          <div>
            <label className={label}>Category</label>
            <input className={input} required value={form.category} onChange={(e) => set("category", e.target.value)} />
          </div>
          <div>
            <label className={label}>Year</label>
            <input className={input} required value={form.year} onChange={(e) => set("year", e.target.value)} />
          </div>
        </div>
        <div>
          <label className={label}>Description</label>
          <textarea className={input} rows={3} required value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>
        <div>
          <label className={label}>Tech (comma separated)</label>
          <input className={input} value={form.tech} onChange={(e) => set("tech", e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Live site URL</label>
            <input className={input} type="url" value={form.url} onChange={(e) => set("url", e.target.value)} />
          </div>
          <div>
            <label className={label}>Live preview URL</label>
            <input className={input} type="url" value={form.livePreview} onChange={(e) => set("livePreview", e.target.value)} />
          </div>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--m2)]">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set("featured", e.target.checked)}
          />
          Featured
        </label>
      </section>

      <section className="liquid-glass cursor-default space-y-4 rounded-2xl p-6">
        <h2 className="text-sm text-[var(--m2)]">Media</h2>
        <MediaField label="Thumbnail image" value={form.image} onChange={(v) => set("image", v)} />
        <MediaField label="Hover video (optional)" accept="video/*" value={form.video} onChange={(v) => set("video", v)} />
        <div>
          <label className={label}>Gallery URLs (one per line)</label>
          <textarea className={input} rows={3} value={form.gallery} onChange={(e) => set("gallery", e.target.value)} />
        </div>
      </section>

      <details className="liquid-glass cursor-default rounded-2xl p-6" open={Boolean(initial?.challenge)}>
        <summary className="cursor-pointer text-sm text-[var(--m2)]">
          Case study (optional)
        </summary>
        <div className="mt-4 space-y-4">
          <div>
            <label className={label}>Challenge</label>
            <textarea className={input} rows={3} value={form.challenge} onChange={(e) => set("challenge", e.target.value)} />
          </div>
          <div>
            <label className={label}>Solution</label>
            <textarea className={input} rows={3} value={form.solution} onChange={(e) => set("solution", e.target.value)} />
          </div>
          <div>
            <label className={label}>Feature list (one per line)</label>
            <textarea className={input} rows={4} value={form.features} onChange={(e) => set("features", e.target.value)} />
          </div>

          <div>
            <label className={label}>Metrics</label>
            <div className="space-y-2">
              {metrics.map((m, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className={input}
                    placeholder="Label"
                    value={m.label}
                    onChange={(e) =>
                      setMetrics((rows) => rows.map((r, j) => (j === i ? { ...r, label: e.target.value } : r)))
                    }
                  />
                  <input
                    className={input}
                    placeholder="Value"
                    value={m.value}
                    onChange={(e) =>
                      setMetrics((rows) => rows.map((r, j) => (j === i ? { ...r, value: e.target.value } : r)))
                    }
                  />
                  <button
                    type="button"
                    className="liquid-glass btn-icon"
                    onClick={() => setMetrics((rows) => rows.filter((_, j) => j !== i))}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="liquid-glass rounded-full px-4 py-1.5 text-xs"
                onClick={() => setMetrics((rows) => [...rows, { label: "", value: "" }])}
              >
                Add metric
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-3">
              <label className={label}>Testimonial quote</label>
              <textarea className={input} rows={2} value={form.testimonialQuote} onChange={(e) => set("testimonialQuote", e.target.value)} />
            </div>
            <div>
              <label className={label}>Author</label>
              <input className={input} value={form.testimonialAuthor} onChange={(e) => set("testimonialAuthor", e.target.value)} />
            </div>
            <div>
              <label className={label}>Role</label>
              <input className={input} value={form.testimonialRole} onChange={(e) => set("testimonialRole", e.target.value)} />
            </div>
          </div>
        </div>
      </details>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center justify-between">
        <button type="submit" disabled={pending} className="btn-solid">
          {pending ? "Saving…" : initial ? "Save project" : "Create project"}
        </button>
        {initial && (
          <button
            type="button"
            onClick={remove}
            disabled={pending}
            className="btn-danger"
          >
            Delete project
          </button>
        )}
      </div>
      {dialog}
    </form>
  );
}
