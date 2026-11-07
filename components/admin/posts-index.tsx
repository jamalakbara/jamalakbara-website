import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { listPosts } from "@/lib/admin/posts";
import { PageHeader } from "@/components/admin/ui";
import { PostsList } from "@/components/admin/posts-list";

// Canvas 27 "Journal list": English and Bahasa posts in one list, filtered by language.
export async function PostsIndex({ status, lang }: { status?: string; lang?: "en" | "id" }) {
  const [en, id] = await Promise.all([listPosts("journal"), listPosts("jurnal")]);
  const rows = [
    ...en.map((r) => ({ ...r, section: "journal" as const })),
    ...id.map((r) => ({ ...r, section: "jurnal" as const })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <>
      <PageHeader
        eyebrow="Content / Journal"
        index="03"
        title="Journal"
        subtitle={`${en.length} posts in English · ${id.length} in Bahasa. Pick the language inside each post.`}
        actions={
          <>
            <a className="a-btn a-btn--secondary" href="/journal" target="_blank" rel="noreferrer">
              <ArrowUpRight size={16} />
              View /journal
            </a>
            <Link className="a-btn a-btn--primary" href={lang === "id" ? "/admin/journal/new?lang=id" : "/admin/journal/new"}>
              <Plus size={16} />
              New post
            </Link>
          </>
        }
      />
      <PostsList
        key={`${lang ?? "all"}-${status ?? "all"}`}
        rows={rows}
        initialLang={lang ?? "all"}
        initialStatus={status === "draft" || status === "published" ? status : "all"}
      />
    </>
  );
}
