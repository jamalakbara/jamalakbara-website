// Post sections for the admin (English /journal + Bahasa /jurnal). Both use
// the same MDX frontmatter shape; `alternate` links a post to its
// counterpart in the other section (kept mutual by savePost/deletePost).
import matter from "gray-matter";
import { listContentDir, readTextFile } from "@/lib/admin/content-store";
import type { PostInput } from "@/lib/admin/post-schema";

import { SECTIONS, type Section } from "@/lib/admin/sections";

export { SECTIONS, type Section };

export const postPath = (section: Section, slug: string) => `content/${section}/${slug}.mdx`;

export interface PostRow {
  slug: string;
  title: string;
  description: string;
  date: string;
  draft: boolean;
  tags: string[];
  alternate?: string;
}

function toRow(slug: string, raw: string): PostRow {
  const { data } = matter(raw);
  return {
    slug,
    title: (data.title as string) ?? slug,
    description: (data.description as string) ?? "",
    date: String(data.date ?? ""),
    draft: data.draft === true,
    tags: (data.tags as string[]) ?? [],
    alternate: typeof data.alternate === "string" ? data.alternate : undefined,
  };
}

export async function listPosts(section: Section): Promise<PostRow[]> {
  const files = (await listContentDir(`content/${section}`)).filter((f) => f.endsWith(".mdx"));
  const rows = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.mdx$/, "");
      return toRow(slug, (await readTextFile(`content/${section}/${file}`)) ?? "");
    })
  );
  return rows.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function readPost(section: Section, slug: string): Promise<PostInput | null> {
  const raw = await readTextFile(postPath(section, slug));
  if (raw === null) return null;
  const { data, content } = matter(raw);
  return {
    slug,
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    date: String(data.date ?? ""),
    tags: (data.tags as string[]) ?? [],
    draft: data.draft === true,
    alternate: typeof data.alternate === "string" ? data.alternate : undefined,
    body: content,
  };
}

/** Frontmatter in the repo's house style: JSON-quoted scalars (valid YAML),
 *  inline tag arrays — so admin saves produce minimal diffs. */
export function serializePost(input: PostInput): string {
  const q = (v: string) => JSON.stringify(v);
  const lines = [
    `title: ${q(input.title)}`,
    `description: ${q(input.description)}`,
    `date: ${q(input.date)}`,
    `tags: [${input.tags.map(q).join(", ")}]`,
    `draft: ${input.draft}`,
    ...(input.alternate ? [`alternate: ${q(input.alternate)}`] : []),
  ];
  const body = input.body.startsWith("\n") ? input.body : `\n${input.body}`;
  return `---\n${lines.join("\n")}\n---\n${body.endsWith("\n") ? body : body + "\n"}`;
}

/** Set or remove one frontmatter key with a minimal text edit (no re-dump). */
export function setFrontmatterKey(raw: string, key: string, value: string | null): string {
  const m = /^---\n([\s\S]*?)\n---/.exec(raw);
  if (!m) return raw;
  const lines = m[1].split("\n").filter((l) => !l.startsWith(`${key}:`));
  if (value !== null) lines.push(`${key}: "${value}"`);
  return `---\n${lines.join("\n")}\n---` + raw.slice(m[0].length);
}
