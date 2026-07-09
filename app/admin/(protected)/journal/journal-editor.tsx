"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { deleteJournalPost, saveJournalPost, type JournalPostInput } from "./actions";

interface JournalEditorProps {
  initial?: JournalPostInput;
}

export function JournalEditor({ initial }: JournalEditorProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    slug: initial?.slug ?? "",
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    date: initial?.date ?? new Date().toISOString().slice(0, 10),
    tags: (initial?.tags ?? []).join(", "),
    draft: initial?.draft ?? true,
    body: initial?.body ?? "",
  });

  const [preview, setPreview] = useState<MDXRemoteSerializeResult | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!form.body.trim()) {
      setPreview(null);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/admin/preview/mdx", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ source: form.body }),
        });
        const json = await res.json();
        if (json.ok) {
          setPreview(json.mdxSource);
          setPreviewError(null);
        } else {
          setPreviewError(json.error);
        }
      } catch {
        setPreviewError("Preview request failed");
      }
    }, 600);
    return () => clearTimeout(debounceRef.current);
  }, [form.body]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await saveJournalPost(
        {
          slug: form.slug.trim(),
          title: form.title.trim(),
          description: form.description.trim(),
          date: form.date.trim(),
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          draft: form.draft,
          body: form.body,
        },
        initial?.slug
      );
      if (result.ok) router.push("/admin/journal");
      else setError(result.error);
    });
  }

  function remove() {
    if (!initial) return;
    if (!window.confirm(`Delete post "${initial.title}"?`)) return;
    startTransition(async () => {
      const result = await deleteJournalPost(initial.slug);
      if (result.ok) router.push("/admin/journal");
      else setError(result.error);
    });
  }

  const input = "field-input w-full";
  const label = "mb-1.5 block text-xs text-[var(--m3)]";

  return (
    <form onSubmit={submit} className="space-y-6">
      <section className="liquid-glass cursor-default space-y-4 rounded-2xl p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Title</label>
            <input className={input} required value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div>
            <label className={label}>Slug</label>
            <input
              className={input}
              required
              pattern="[a-z0-9-]+"
              title="lowercase letters, numbers, dashes"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className={label}>Description (doubles as meta description — keep under ~160 chars)</label>
          <textarea className={input} rows={2} required value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={label}>Date</label>
            <input className={input} type="date" required value={form.date} onChange={(e) => set("date", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Tags (comma separated)</label>
            <input className={input} value={form.tags} onChange={(e) => set("tags", e.target.value)} />
          </div>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--m2)]">
          <input
            type="checkbox"
            checked={form.draft}
            onChange={(e) => set("draft", e.target.checked)}
          />
          Draft (hidden from the site and sitemap)
        </label>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className={label}>Body (MDX)</label>
          <textarea
            className="field-input w-full font-mono text-sm leading-relaxed"
            rows={24}
            value={form.body}
            onChange={(e) => set("body", e.target.value)}
            spellCheck={false}
          />
        </div>
        <div>
          <label className={label}>
            Preview {previewError && <span className="text-red-400">— {previewError}</span>}
          </label>
          <div className="liquid-glass h-full max-h-[36rem] cursor-default overflow-y-auto rounded-2xl p-6">
            <div className="journal-prose">
              {preview ? <MDXRemote {...preview} /> : <p className="text-sm text-[var(--m4)]">Start typing to preview…</p>}
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center justify-between">
        <button type="submit" disabled={pending} className="btn-solid rounded-full px-6 py-2.5 text-sm disabled:opacity-40">
          {pending ? "Saving…" : form.draft ? "Save draft" : "Save & publish"}
        </button>
        {initial && (
          <button
            type="button"
            onClick={remove}
            disabled={pending}
            className="text-xs text-red-400/80 hover:text-red-400"
          >
            Delete post
          </button>
        )}
      </div>
    </form>
  );
}
