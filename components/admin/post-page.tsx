import { notFound } from "next/navigation";
import { listPosts, readPost, type Section } from "@/lib/admin/posts";
import { lastEditFor } from "@/lib/admin/project-meta";
import { PostEditor } from "@/components/admin/post-editor";

// Server wrapper for the post editor (canvas 28) — new + edit, both sections.
export async function PostPage({ section, slug }: { section: Section; slug?: string }) {
  const other = section === "journal" ? "jurnal" : "journal";
  const [post, mine, others, lastEdit] = await Promise.all([
    slug ? readPost(section, slug) : Promise.resolve(null),
    listPosts(section),
    listPosts(other),
    slug ? lastEditFor(section, slug) : Promise.resolve(null),
  ]);
  if (slug && !post) notFound();
  return (
    <PostEditor
      section={section}
      initial={post ?? undefined}
      count={mine.length}
      others={others.map((p) => ({ slug: p.slug, title: p.title, draft: p.draft, alternate: p.alternate }))}
      lastEdit={lastEdit}
    />
  );
}
