"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Link2, Pencil, Plus, Search } from "lucide-react";
import type { PostRow } from "@/lib/admin/posts";
import type { Section } from "@/lib/admin/sections";
import { Chip } from "@/components/admin/ui";
import { GuardedLink } from "@/components/admin/unsaved";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function PostsList({
  section,
  rows,
  counts,
  otherTitles,
  initialStatus,
}: {
  section: Section;
  rows: PostRow[];
  counts: { journal: number; jurnal: number };
  otherTitles: Record<string, string>;
  initialStatus: "all" | "draft" | "published";
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(initialStatus);
  const [tag, setTag] = useState("");
  const other = section === "journal" ? "jurnal" : "journal";
  const otherCode = section === "journal" ? "ID" : "EN";

  const tags = useMemo(() => [...new Set(rows.flatMap((r) => r.tags))].sort(), [rows]);
  const q = query.trim().toLowerCase();
  const shown = rows.filter(
    (r) =>
      (status === "all" || (status === "draft") === r.draft) &&
      (!tag || r.tags.includes(tag)) &&
      (!q || `${r.title} ${r.tags.join(" ")}`.toLowerCase().includes(q))
  );
  const drafts = rows.filter((r) => r.draft).length;

  return (
    <>
      <div className="a-panel a-toolbar">
        <nav className="a-seg" aria-label="Language">
          <GuardedLink href="/admin/journal" className="a-seg__item" aria-current={section === "journal" ? "page" : undefined}>
            <span className="a-seg__code">EN</span> English · {counts.journal}
          </GuardedLink>
          <GuardedLink href="/admin/jurnal" className="a-seg__item" aria-current={section === "jurnal" ? "page" : undefined}>
            <span className="a-seg__code">ID</span> Bahasa · {counts.jurnal}
          </GuardedLink>
        </nav>
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
              const linked = r.alternate && otherTitles[r.alternate];
              return (
                <div key={r.slug} className={`a-row${r.draft ? " a-row--dim" : ""}`}>
                  <span className="a-row__date">
                    <span className="a-eyebrow">{m ? `${MONTHS[Number(m) - 1]} ${Number(d)}` : "—"}</span>
                    <span className="a-meta a-muted">{y}</span>
                  </span>
                  <Link href={`/admin/${section}/${r.slug}`} className="a-row__text">
                    <span className="a-row__title a-truncate">{r.title}</span>
                    <span className="a-row__meta a-truncate">{r.tags.join(" · ")}</span>
                  </Link>
                  <span className="a-row__hide-m">
                    {linked ? (
                      <Link href={`/admin/${other}/${r.alternate}`} className="a-row__link a-row__link--on" title={otherTitles[r.alternate!]}>
                        <Link2 size={14} /> {otherCode} linked
                      </Link>
                    ) : (
                      <Link href={`/admin/${section}/${r.slug}#lang`} className="a-row__link">
                        <Plus size={14} /> Add {otherCode} version
                      </Link>
                    )}
                  </span>
                  <Chip kind={r.draft ? "draft" : "published"} />
                  <span className="a-row__side a-row__hide-m">
                    {!r.draft && (
                      <a className="a-iconbtn" href={`/${section}/${r.slug}`} target="_blank" rel="noreferrer" aria-label={`View ${r.title}`}>
                        <Eye size={16} />
                      </a>
                    )}
                    <Link className="a-iconbtn" href={`/admin/${section}/${r.slug}`} aria-label={`Edit ${r.title}`}>
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
