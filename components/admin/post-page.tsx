import { notFound } from "next/navigation";
import { listPosts, readPost, type Section } from "@/lib/admin/posts";
import { lastEditFor } from "@/lib/admin/project-meta";
import { PostEditor } from "@/components/admin/post-editor";

// Server wrapper for the post editor (canvas 28) — new + edit, either language.
export async function PostPage({ section, slug }: { section: Section; slug?: string }) {
  const [post, en, id, lastEdit] = await Promise.all([
    slug ? readPost(section, slug) : Promise.resolve(null),
    listPosts("journal"),
    listPosts("jurnal"),
    slug ? lastEditFor(section, slug) : Promise.resolve(null),
  ]);
  if (slug && !post) notFound();
  const brief = (rows: typeof en) => rows.map((p) => ({ slug: p.slug, title: p.title, draft: p.draft, alternate: p.alternate }));
  return (
    <PostEditor
      section={section}
      initial={post ?? undefined}
      posts={{ journal: brief(en), jurnal: brief(id) }}
      lastEdit={lastEdit}
    />
  );
}
