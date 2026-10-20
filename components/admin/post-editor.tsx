"use client";

// Canvas 28 "Post editor": MDX editor + live preview, Post details, Bahasa
// version link, SEO checklist and draft preview. Serves /journal + /jurnal.

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import {
  Bold,
  Check,
  Code,
  Heading2,
  ImageIcon,
  Italic,
  Link2,
  List,
  Quote,
  ArrowUpRight,
  Trash2,
} from "lucide-react";
import { useConfirm } from "@/components/admin/confirm-dialog";
import { useToast } from "@/components/admin/toast";
import { useUnsaved } from "@/components/admin/unsaved";
import { MediaPicker } from "@/components/admin/media-field";
import {
  Chip,
  Field,
  PageHeader,
  Panel,
  PreviewButton,
  PreviewPanel,
  SeoPanel,
  TagInput,
  Toggle,
  usePreview,
  useSaveShortcut,
} from "@/components/admin/ui";
import type { PostInput } from "@/lib/admin/post-schema";
import { SECTIONS, type Section } from "@/lib/admin/sections";
import { deletePost, previewPost, savePost } from "@/lib/admin/post-actions";
import { postSeo } from "@/lib/admin/seo-checklist";
import { timeAgo } from "@/lib/admin/format";
import type { LastEdit } from "@/lib/admin/project-meta";

interface OtherPost {
  slug: string;
  title: string;
  draft: boolean;
  alternate?: string;
}

const today = () => new Date().toISOString().slice(0, 10);
const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-");

function emptyPost(): PostInput {
  return { slug: "", title: "", description: "", date: today(), tags: [], draft: true, alternate: undefined, body: "" };
}

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function PostEditor({
  section,
  initial,
  count,
  others,
  lastEdit,
}: {
  section: Section;
  initial?: PostInput;
  count: number;
  others: OtherPost[];
  lastEdit: LastEdit | null;
}) {
  const meta = SECTIONS[section];
  const other = SECTIONS[meta.other];
  const router = useRouter();
  const toast = useToast();
  const { confirm, dialog } = useConfirm();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState<PostInput>(() => initial ?? emptyPost());
  const [form, setForm] = useState<PostInput>(saved);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"write" | "preview">("write");
  const [picking, setPicking] = useState(false);

  const dirtyKeys = (Object.keys(form) as (keyof PostInput)[]).filter(
    (k) => JSON.stringify(form[k] ?? null) !== JSON.stringify(saved[k] ?? null)
  );
  const dirty = dirtyKeys.length > 0;
  useUnsaved(dirty);

  const set = <K extends keyof PostInput>(key: K, value: PostInput[K]) => setForm((f) => ({ ...f, [key]: value }));
  const seo = useMemo(() => postSeo(form, meta.base), [form, meta.base]);
  const preview = usePreview(() => previewPost(section, form));
  const words = form.body.trim() ? form.body.trim().split(/\s+/).length : 0;

  /* ---- live preview (debounced compile) ---- */
  const [compiled, setCompiled] = useState<MDXRemoteSerializeResult | null>(null);
  const [compileError, setCompileError] = useState<string | null>(null);
  useEffect(() => {
    if (!form.body.trim()) {
      setCompiled(null);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const res = await fetch("/api/admin/preview/mdx", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ source: form.body }),
        });
        const json = await res.json();
        if (json.ok) {
          setCompiled(json.mdxSource);
          setCompileError(null);
        } else setCompileError(json.error);
      } catch {
        setCompileError("Preview request failed");
      }
    }, 500);
    return () => clearTimeout(t);
  }, [form.body]);

  /* ---- scroll sync ---- */
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
    requestAnimationFrame(() => (syncing.current = null));
  }

  /* ---- toolbar ---- */
  function wrap(before: string, after = before, placeholder = "text") {
    const el = editorRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const picked = value.slice(s, e) || placeholder;
    const next = value.slice(0, s) + before + picked + after + value.slice(e);
    set("body", next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + before.length, s + before.length + picked.length);
    });
  }
  function linePrefix(prefix: string) {
    const el = editorRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const start = value.lastIndexOf("\n", s - 1) + 1;
    const block = value.slice(start, e).split("\n").map((l) => prefix + l).join("\n");
    set("body", value.slice(0, start) + block + value.slice(e));
    requestAnimationFrame(() => el.focus());
  }
  function insert(text: string) {
    const el = editorRef.current;
    const at = el?.selectionStart ?? form.body.length;
    set("body", form.body.slice(0, at) + text + form.body.slice(at));
  }

  /* ---- save / delete ---- */
  function save() {
    if (pending) return;
    setError(null);
    startTransition(async () => {
      const result = await savePost(section, form, initial?.slug);
      if (!result.ok) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      setSaved(form);
      toast.saved(result, `“${form.title}”`);
      if (!initial || initial.slug !== result.slug) router.replace(`/admin/${section}/${result.slug}`);
      else router.refresh();
    });
  }
  useSaveShortcut(save, dirty);

  async function remove() {
    if (!initial) return;
    if (!(await confirm({ title: `Delete “${initial.title}”?`, message: "The post file is removed in one commit. A linked post in the other language is unlinked.", confirmLabel: "Delete post" }))) return;
    startTransition(async () => {
      const result = await deletePost(section, initial.slug);
      if (!result.ok) return toast.error(result.error);
      setSaved(form);
      toast.saved(result, `Removed “${initial.title}”`);
      router.push(`/admin/${section}`);
    });
  }

  const status = initial
    ? saved.draft
      ? `Draft · dated ${formatDate(saved.date)}`
      : `Published ${formatDate(saved.date)}`
    : "New post";
  const subtitle = [
    status,
    dirty ? `${dirtyKeys.length} unsaved edit${dirtyKeys.length === 1 ? "" : "s"}` : null,
    !dirty && lastEdit ? `last saved ${timeAgo(lastEdit.date)}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const linked = others.find((o) => o.slug === form.alternate);
  // Posts on the other side that are free (or already ours).
  const linkable = others.filter((o) => !o.alternate || o.alternate === initial?.slug || o.slug === form.alternate);

  return (
    <form
      className="a-stack"
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <PageHeader
        eyebrow={`${meta.label} / ${meta.code}`}
        index={String(count).padStart(2, "0")}
        title={form.title || "Untitled post"}
        subtitle={subtitle}
        back={{ href: `/admin/${section}`, label: `All ${meta.label.toLowerCase()} posts` }}
        actions={
          <>
            <PreviewButton preview={preview} />
            <button type="submit" className="a-btn a-btn--primary" disabled={pending}>
              <Check size={16} />
              {pending ? "Saving…" : form.draft ? "Save draft" : "Save & publish"}
            </button>
          </>
        }
      />
      {error && <p className="a-banner">Save failed — {error}</p>}

      <div className="a-grid a-grid--rail">
        <div className="a-editor" data-view={view}>
          <div className="a-editor__bar" role="toolbar" aria-label="Formatting">
            <button type="button" className="a-iconbtn" aria-label="Heading" title="Heading" onClick={() => linePrefix("## ")}><Heading2 size={16} /></button>
            <button type="button" className="a-iconbtn" aria-label="Bold" title="Bold" onClick={() => wrap("**")}><Bold size={16} /></button>
            <button type="button" className="a-iconbtn" aria-label="Italic" title="Italic" onClick={() => wrap("*")}><Italic size={16} /></button>
            <button type="button" className="a-iconbtn" aria-label="Link" title="Link" onClick={() => wrap("[", "](https://)", "link text")}><Link2 size={16} /></button>
            <button type="button" className="a-iconbtn" aria-label="Quote" title="Quote" onClick={() => linePrefix("> ")}><Quote size={16} /></button>
            <button type="button" className="a-iconbtn" aria-label="Code" title="Code" onClick={() => wrap("`")}><Code size={16} /></button>
            <button type="button" className="a-iconbtn" aria-label="List" title="List" onClick={() => linePrefix("- ")}><List size={16} /></button>
            <button type="button" className="a-iconbtn" aria-label="Image" title="Image from library" onClick={() => setPicking(true)}><ImageIcon size={16} /></button>
            <span className="a-editor__stats">
              {words.toLocaleString()} words · {Math.max(1, Math.round(words / 200))} min read
            </span>
          </div>
          <div className="a-editor__tabs a-seg" style={{ height: 40, margin: "8px 12px 0" }}>
            <button type="button" className="a-seg__item" aria-pressed={view === "write"} onClick={() => setView("write")}>Write</button>
            <button type="button" className="a-seg__item" aria-pressed={view === "preview"} onClick={() => setView("preview")}>Preview</button>
          </div>
          <textarea
            ref={editorRef}
            className="a-editor__code"
            aria-label="Post body (MDX)"
            value={form.body}
            onChange={(e) => set("body", e.target.value)}
            onScroll={() => syncScroll("editor")}
            spellCheck={false}
            placeholder={"## A heading\n\nStart writing in MDX…"}
          />
          <div ref={previewRef} className="a-editor__preview" onScroll={() => syncScroll("preview")}>
            <p className="a-editor__live">Live preview · site styles{compileError && <span style={{ color: "var(--f-error)" }}> — {compileError}</span>}</p>
            {form.title && <h1 className="a-display" style={{ fontSize: 28, marginBottom: 16 }}>{form.title}</h1>}
            <div className="a-prose">
              {compiled ? <MDXRemote {...compiled} /> : <p className="a-muted">Start typing to preview…</p>}
            </div>
          </div>
        </div>

        <aside className="a-stack">
          <Panel title="Post details" aside={<Chip kind={form.draft ? "draft" : "published"} />}>
            <Field label="Slug" help={`jamalakbara.com${meta.base}/${form.slug || "…"}`}>
              <input
                className="a-input"
                required
                pattern="[a-z0-9-]+"
                title="lowercase letters, numbers, dashes"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", e.target.value);
                }}
              />
            </Field>
            <Field label="Title" count={form.title.length} max={60}>
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
            <Field label={<>Description <span className="a-muted">· meta snippet</span></>} count={form.description.length} max={160} min={120}>
              <textarea className="a-input" rows={4} required value={form.description} onChange={(e) => set("description", e.target.value)} />
            </Field>
            <Field label="Date" help="Bump it on substantial edits — freshness counts.">
              <input className="a-input" type="date" required value={form.date} onChange={(e) => set("date", e.target.value)} />
            </Field>
            <Field label="Tags" help="The first tag is the SEO keyword.">
              <TagInput value={form.tags} onChange={(v) => set("tags", v)} />
            </Field>
            <Toggle checked={form.draft} onChange={(v) => set("draft", v)}>
              Draft — hide from {meta.base} and sitemap
            </Toggle>
          </Panel>

          <section className="a-panel" id="lang">
            <div className="a-panel__head">
              <h2 className="a-title">{section === "journal" ? "Bahasa version" : "English version"}</h2>
              <span className="a-seg" style={{ height: 36 }} aria-hidden>
                <span className="a-seg__item" aria-pressed={section === "journal"}>EN</span>
                <span className="a-seg__item" aria-pressed={section === "jurnal"}>ID</span>
              </span>
            </div>
            <div className="a-panel__body">
              <Field label={`Linked ${other.label} post`}>
                <select className="a-input" value={form.alternate ?? ""} onChange={(e) => set("alternate", e.target.value || undefined)}>
                  <option value="">Not linked</option>
                  {linkable.map((o) => (
                    <option key={o.slug} value={o.slug}>
                      {o.title}
                      {o.draft ? " (draft)" : ""}
                    </option>
                  ))}
                </select>
              </Field>
              {linked && (
                <Link href={`/admin/${meta.other}/${linked.slug}`} className="a-media">
                  <Link2 size={16} color="var(--f-muted)" />
                  <span className="a-media__text">
                    <span className="a-label a-truncate">{linked.title}</span>
                    <span className="a-meta a-muted a-truncate">
                      {other.base}/{linked.slug} · {linked.draft ? "Draft" : "Published"}
                    </span>
                  </span>
                  <ArrowUpRight size={16} />
                </Link>
              )}
              <p className="a-meta a-muted">
                {section === "journal" ? "Jurnal" : "Bahasa"} posts are written natively, not translated — linking only adds hreflang and a language switch. Both posts update in one commit.
              </p>
            </div>
          </section>

          <SeoPanel report={seo} />
          <PreviewPanel preview={preview} />
          {initial && (
            <button type="button" className="a-btn a-btn--ghost" style={{ color: "var(--f-error)", justifyContent: "space-between" }} onClick={remove} disabled={pending}>
              Delete this post
              <Trash2 size={16} />
            </button>
          )}
        </aside>
      </div>
      {picking && (
        <MediaPicker
          kind="image"
          onClose={() => setPicking(false)}
          onSelect={(url) => {
            insert(`\n![Describe the image](${url})\n`);
            setPicking(false);
          }}
        />
      )}
      {dialog}
    </form>
  );
}
