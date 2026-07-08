import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Server-only journal reader. Posts live in content/journal/*.mdx with
// frontmatter: title, description, date (YYYY-MM-DD), tags, draft.
// Drafts stay in the repo but never render, list, or hit the sitemap.

const JOURNAL_DIR = path.join(process.cwd(), "content", "journal");

export interface JournalPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO YYYY-MM-DD
  tags: string[];
  draft: boolean;
  content: string; // raw MDX body
  readingMinutes: number;
}

function parsePost(fileName: string): JournalPost {
  const slug = fileName.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(JOURNAL_DIR, fileName), "utf-8");
  const { data, content } = matter(raw);
  const words = content.trim().split(/\s+/).length;
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? "",
    tags: data.tags ?? [],
    draft: data.draft === true,
    content,
    readingMinutes: Math.max(1, Math.round(words / 200)),
  };
}

export function getJournalPosts(): JournalPost[] {
  if (!fs.existsSync(JOURNAL_DIR)) return [];
  return fs
    .readdirSync(JOURNAL_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(parsePost)
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getJournalPost(slug: string): JournalPost | null {
  const file = path.join(JOURNAL_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const post = parsePost(`${slug}.mdx`);
  return post.draft ? null : post;
}

export function formatPostDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
