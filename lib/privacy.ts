import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Lang } from "@/lib/i18n/config";

// Privacy policy text lives in content/privacy/<lang>.mdx. Server only.
export function getPrivacy(lang: Lang) {
  const raw = fs.readFileSync(path.join(process.cwd(), "content", "privacy", `${lang}.mdx`), "utf-8");
  const { data, content } = matter(raw);
  return { updated: String(data.updated ?? ""), content };
}
