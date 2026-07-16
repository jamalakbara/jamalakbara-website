import { notFound } from "next/navigation";
import matter from "gray-matter";
import { readTextFile } from "@/lib/admin/content-store";
import { PostEditor } from "@/components/admin/post-editor";
import { saveJurnalPost, deleteJurnalPost } from "../actions";
import { PageBody, PageHeading } from "@/components/page-heading";

export const metadata = { title: "Edit post" };

export default async function EditJurnalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const raw = await readTextFile(`content/jurnal/${slug}.mdx`);
  if (raw === null) notFound();

  const { data, content } = matter(raw);

  return (
    <main>
      <PageHeading
        eyebrow="Edit post"
        title={(data.title as string) ?? slug}
        back={{ href: "/admin/jurnal", label: "Jurnal" }}
      />
      <PageBody>
        <PostEditor
          save={saveJurnalPost}
          remove={deleteJurnalPost}
          listHref="/admin/jurnal"
          initial={{
            slug,
            title: (data.title as string) ?? "",
            description: (data.description as string) ?? "",
            date: (data.date as string) ?? "",
            tags: (data.tags as string[]) ?? [],
            draft: data.draft === true,
            body: content,
          }}
        />
      </PageBody>
    </main>
  );
}
