import Link from "next/link";
import matter from "gray-matter";
import { listContentDir, readTextFile } from "@/lib/admin/content-store";

export const metadata = { title: "Journal" };

interface Row {
  slug: string;
  title: string;
  date: string;
  draft: boolean;
  tags: string[];
}

async function readRows(): Promise<Row[]> {
  const files = (await listContentDir("content/journal")).filter((f) =>
    f.endsWith(".mdx")
  );
  const rows = await Promise.all(
    files.map(async (file): Promise<Row> => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = await readTextFile(`content/journal/${file}`);
      const { data } = matter(raw ?? "");
      return {
        slug,
        title: (data.title as string) ?? slug,
        date: (data.date as string) ?? "",
        draft: data.draft === true,
        tags: (data.tags as string[]) ?? [],
      };
    })
  );
  return rows.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export default async function AdminJournalPage() {
  const rows = await readRows();
  return (
    <main>
      <p
        className="mb-2 text-sm italic text-[var(--m3)]"
        style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
      >
        — Journal
      </p>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-light tracking-tight">
          {rows.length} posts
        </h1>
        <Link href="/admin/journal/new" className="liquid-glass rounded-full px-5 py-2 text-sm">
          New post
        </Link>
      </div>
      <div className="space-y-2">
        {rows.map((row) => (
          <Link
            key={row.slug}
            href={`/admin/journal/${row.slug}`}
            className="liquid-glass flex items-center gap-4 rounded-xl px-5 py-3"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{row.title}</p>
              <p className="truncate text-xs text-[var(--m3)]">
                {row.date} · {row.tags.join(", ")}
              </p>
            </div>
            {row.draft && (
              <span className="shrink-0 rounded-full border border-[rgba(246,243,240,0.12)] px-2.5 py-0.5 text-[10px] text-[var(--m3)]">
                draft
              </span>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
