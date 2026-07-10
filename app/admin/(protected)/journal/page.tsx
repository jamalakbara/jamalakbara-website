import Link from "next/link";
import matter from "gray-matter";
import { listContentDir, readTextFile } from "@/lib/admin/content-store";
import { BODY_DELAY_MS, PageHeading } from "@/components/page-heading";

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
      <PageHeading
        eyebrow="Journal"
        title={`${rows.length} posts`}
        action={
          <Link
            href="/admin/journal/new"
            className="liquid-glass shrink-0 rounded-full px-5 py-2 text-sm"
          >
            New post
          </Link>
        }
      />
      <div className="space-y-2">
        {rows.map((row, i) => (
          <Link
            key={row.slug}
            href={`/admin/journal/${row.slug}`}
            className="group liquid-glass admin-card animate-blur-fade-up items-center gap-4 rounded-xl px-5 py-3.5"
            style={{ animationDelay: `${BODY_DELAY_MS + Math.min(i, 8) * 60}ms` }}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm group-hover:text-[var(--ink)]">{row.title}</p>
              <p className="truncate text-xs text-[var(--m3)]">
                {row.date} · {row.tags.join(", ")}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {row.draft && (
                <span className="rounded-md border border-[rgba(224,135,90,0.28)] bg-[rgba(224,135,90,0.1)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--accent-hi)]">
                  draft
                </span>
              )}
              <span
                aria-hidden
                className="text-[var(--m4)] transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[var(--accent-hi)]"
              >
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
