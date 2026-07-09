import { notFound } from "next/navigation";
import matter from "gray-matter";
import { readTextFile } from "@/lib/admin/content-store";
import { JournalEditor } from "../journal-editor";

export const metadata = { title: "Edit post" };

export default async function EditJournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const raw = await readTextFile(`content/journal/${slug}.mdx`);
  if (raw === null) notFound();

  const { data, content } = matter(raw);

  return (
    <main>
      <p
        className="mb-2 text-sm italic text-[var(--m3)]"
        style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
      >
        — Edit post
      </p>
      <h1 className="mb-8 text-3xl font-light tracking-tight">
        {(data.title as string) ?? slug}
      </h1>
      <JournalEditor
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
    </main>
  );
}
