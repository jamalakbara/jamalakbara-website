import fs from "fs";
import path from "path";
import matter from "gray-matter";

const JURNAL_DIR = path.join(process.cwd(), "content", "jurnal");

export interface JurnalPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  draft: boolean;
  content: string;
  readingMinutes: number;
}

function parsePost(fileName: string): JurnalPost {
  const slug = fileName.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(JURNAL_DIR, fileName), "utf-8");
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

export function getJurnalPosts(): JurnalPost[] {
  if (!fs.existsSync(JURNAL_DIR)) return [];
  return fs
    .readdirSync(JURNAL_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(parsePost)
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getJurnalPost(slug: string): JurnalPost | null {
  const file = path.join(JURNAL_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const post = parsePost(`${slug}.mdx`);
  return post.draft ? null : post;
}

export function formatJurnalDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
