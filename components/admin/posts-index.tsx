import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { listPosts, SECTIONS, type Section } from "@/lib/admin/posts";
import { PageHeader } from "@/components/admin/ui";
import { PostsList } from "@/components/admin/posts-list";

// Canvas 27 "Journal list" — serves /admin/journal and /admin/jurnal.
export async function PostsIndex({ section, status }: { section: Section; status?: string }) {
  const meta = SECTIONS[section];
  const [rows, otherRows] = await Promise.all([listPosts(section), listPosts(meta.other)]);
  const en = section === "journal" ? rows : otherRows;
  const id = section === "jurnal" ? rows : otherRows;
  return (
    <>
      <PageHeader
        eyebrow={`Content / ${meta.label}`}
        index={section === "journal" ? "03" : "04"}
        title={meta.label}
        subtitle={`${en.length} posts in English at /journal · ${id.length} in Bahasa at /jurnal`}
        actions={
          <>
            <a className="a-btn a-btn--secondary" href={meta.base} target="_blank" rel="noreferrer">
              <ArrowUpRight size={16} />
              View {meta.base}
            </a>
            <Link className="a-btn a-btn--primary" href={`/admin/${section}/new`}>
              <Plus size={16} />
              {section === "journal" ? "New post" : "Tulis baru"}
            </Link>
          </>
        }
      />
      <PostsList
        key={`${section}-${status ?? "all"}`}
        section={section}
        rows={rows}
        counts={{ journal: en.length, jurnal: id.length }}
        otherTitles={Object.fromEntries(otherRows.map((r) => [r.slug, r.title]))}
        initialStatus={status === "draft" || status === "published" ? status : "all"}
      />
    </>
  );
}
