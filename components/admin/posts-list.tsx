"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Link2, Pencil, Plus, Search } from "lucide-react";
import type { PostRow } from "@/lib/admin/posts";
import { SECTIONS, postHref, type Section } from "@/lib/admin/sections";
import { localePath } from "@/lib/i18n/routes";
import { Chip } from "@/components/admin/ui";
import { GuardedLink } from "@/components/admin/unsaved";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type Row = PostRow & { section: Section };

export function PostsList({
  rows,
  initialLang,
  initialStatus,
}: {
  rows: Row[];
  initialLang: "all" | "en" | "id";
  initialStatus: "all" | "draft" | "published";
}) {
  const [lang, setLang] = useState(initialLang);
  const titleOf = (section: Section, slug: string) => rows.find((r) => r.section === section && r.slug === slug)?.title;
  const counts = { en: rows.filter((r) => r.section === "journal").length, id: rows.filter((r) => r.section === "jurnal").length };
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(initialStatus);
  const [tag, setTag] = useState("");

  const tags = useMemo(() => [...new Set(rows.flatMap((r) => r.tags))].sort(), [rows]);
  const q = query.trim().toLowerCase();
  const shown = rows.filter(
    (r) =>
      (lang === "all" || SECTIONS[r.section].lang === lang) &&
      (status === "all" || (status === "draft") === r.draft) &&
      (!tag || r.tags.includes(tag)) &&
      (!q || `${r.title} ${r.tags.join(" ")}`.toLowerCase().includes(q))
  );
  const drafts = rows.filter((r) => r.draft).length;

  return (
    <>
      <div className="a-panel a-toolbar">
        <div className="a-seg" role="group" aria-label="Filter by language">
          <button type="button" className="a-seg__item" aria-pressed={lang === "all"} onClick={() => setLang("all")}>
            All · {rows.length}
          </button>
          <button type="button" className="a-seg__item" aria-pressed={lang === "en"} onClick={() => setLang("en")}>
            <span className="a-seg__code">EN</span> {counts.en}
          </button>
          <button type="button" className="a-seg__item" aria-pressed={lang === "id"} onClick={() => setLang("id")}>
            <span className="a-seg__code">ID</span> {counts.id}
          </button>
        </div>
        <label className="a-input" style={{ width: 260, maxWidth: "100%" }}>
          <Search size={16} />
          <input type="search" placeholder="Search titles, tags…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search posts" />
        </label>
        <div style={{ display: "flex", gap: 6 }} role="group" aria-label="Filter by status">
          <button type="button" className="a-filter" aria-pressed={status === "all"} onClick={() => setStatus("all")}>All</button>
          <button type="button" className="a-filter" aria-pressed={status === "published"} onClick={() => setStatus("published")}>
            Published · {rows.length - drafts}
          </button>
          <button type="button" className="a-filter" aria-pressed={status === "draft"} onClick={() => setStatus("draft")}>
            Drafts · {drafts}
          </button>
        </div>
        <span className="a-toolbar__spacer" />
        <select className="a-input" style={{ width: 180 }} value={tag} onChange={(e) => setTag(e.target.value)} aria-label="Filter by tag">
          <option value="">All tags</option>
          {tags.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="a-panel">
        {shown.length === 0 ? (
          <p className="a-row a-muted">{rows.length === 0 ? "No posts yet." : "Nothing matches these filters."}</p>
        ) : (
          <div className="a-list">
            {shown.map((r) => {
              const [y, m, d] = r.date.split("-");
              const meta = SECTIONS[r.section];
              const other = meta.other;
              const otherCode = SECTIONS[other].code;
              const linked = r.alternate && titleOf(other, r.alternate);
              return (
                <div key={`${r.section}-${r.slug}`} className={`a-row${r.draft ? " a-row--dim" : ""}`}>
                  <span className="a-row__date">
                    <span className="a-eyebrow">{m ? `${MONTHS[Number(m) - 1]} ${Number(d)}` : "—"}</span>
                    <span className="a-meta a-muted">{y}</span>
                  </span>
                  <Link href={postHref(r.section, r.slug)} className="a-row__text">
                    <span className="a-row__title a-truncate">
                      <span className="a-seg__code">{meta.code}</span> {r.title}
                    </span>
                    <span className="a-row__meta a-truncate">{r.tags.join(" · ")}</span>
                  </Link>
                  <span className="a-row__hide-m">
                    {linked ? (
                      <Link href={postHref(other, r.alternate!)} className="a-row__link a-row__link--on" title={titleOf(other, r.alternate!)}>
                        <Link2 size={14} /> {otherCode} linked
                      </Link>
                    ) : (
                      <Link href={`${postHref(r.section, r.slug)}#lang`} className="a-row__link">
                        <Plus size={14} /> Add {otherCode} version
                      </Link>
                    )}
                  </span>
                  <Chip kind={r.draft ? "draft" : "published"} />
                  <span className="a-row__side a-row__hide-m">
                    {!r.draft && (
                      <a className="a-iconbtn" href={localePath(meta.lang, `/journal/${r.slug}`)} target="_blank" rel="noreferrer" aria-label={`View ${r.title}`}>
                        <Eye size={16} />
                      </a>
                    )}
                    <Link className="a-iconbtn" href={postHref(r.section, r.slug)} aria-label={`Edit ${r.title}`}>
                      <Pencil size={16} />
                    </Link>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
