"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { useConfirm } from "@/components/admin/confirm-dialog";
import type { ActionResult } from "@/app/admin/(protected)/projects/actions";
import type { PostInput } from "@/lib/admin/post-schema";
import { input, label } from "@/lib/admin/form-styles";

interface PostEditorProps {
  initial?: PostInput;
  save: (input: PostInput, originalSlug?: string) => Promise<ActionResult>;
  remove: (slug: string) => Promise<ActionResult>;
  /** List page to return to on save/delete, e.g. "/admin/journal". */
  listHref: string;
}

export function PostEditor({ initial, save, remove, listHref }: PostEditorProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { confirm, dialog } = useConfirm();

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

  // Proportional scroll-sync between the MDX textarea and the rendered
  // preview. `syncing` locks out the echoed onScroll the programmatic
  // scrollTop assignment fires, so the two panes don't fight.
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const syncing = useRef<"editor" | "preview" | null>(null);

  function syncScroll(source: "editor" | "preview") {
    if (syncing.current && syncing.current !== source) return;
    const from = source === "editor" ? editorRef.current : previewRef.current;
    const to = source === "editor" ? previewRef.current : editorRef.current;
    if (!from || !to) return;
    const fromMax = from.scrollHeight - from.clientHeight;
    const toMax = to.scrollHeight - to.clientHeight;
    if (fromMax <= 0 || toMax <= 0) return;
    syncing.current = source;
    to.scrollTop = (from.scrollTop / fromMax) * toMax;
    requestAnimationFrame(() => {
      syncing.current = null;
    });
  }

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
      const result = await save(
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
      if (result.ok) router.push(listHref);
      else setError(result.error);
    });
  }

  async function onRemove() {
    if (!initial) return;
    if (!(await confirm({ title: `Delete post "${initial.title}"?` }))) return;
    startTransition(async () => {
      const result = await remove(initial.slug);
      if (result.ok) router.push(listHref);
      else setError(result.error);
    });
  }

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
            ref={editorRef}
            onScroll={() => syncScroll("editor")}
            className="field-input h-[32rem] w-full resize-none overflow-y-auto font-mono text-sm leading-relaxed"
            value={form.body}
            onChange={(e) => set("body", e.target.value)}
            spellCheck={false}
          />
        </div>
        <div>
          <label className={label}>
            Preview {previewError && <span className="text-red-400">— {previewError}</span>}
          </label>
          <div
            ref={previewRef}
            onScroll={() => syncScroll("preview")}
            className="liquid-glass h-[32rem] cursor-default overflow-y-auto rounded-2xl p-6"
          >
            <div className="journal-prose">
              {preview ? <MDXRemote {...preview} /> : <p className="text-sm text-[var(--m4)]">Start typing to preview…</p>}
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center justify-between">
        <button type="submit" disabled={pending} className="btn-solid">
          {pending ? "Saving…" : form.draft ? "Save draft" : "Save & publish"}
        </button>
        {initial && (
          <button
            type="button"
            onClick={onRemove}
            disabled={pending}
            className="btn-danger"
          >
            Delete post
          </button>
        )}
      </div>
      {dialog}
    </form>
  );
}
