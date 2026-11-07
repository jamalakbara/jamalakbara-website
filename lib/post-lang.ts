// EN ↔ ID post linking (set in the admin "Bahasa version" panel, stored as
// `alternate: <slug>` in both posts' frontmatter). A link is only honoured
// when it is mutual and both posts are published, so hreflang never points at
// a draft or a post that doesn't point back.
import { getSite } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/routes";
import { getPost } from "@/lib/posts";

export interface PostLang {
  /** path of the twin post, English-style */
  path: string;
  link: { href: string; label: string; hrefLang: Lang };
}

export function postLang(from: Lang, slug: string, alternate?: string): PostLang | null {
  if (!alternate) return null;
  const to: Lang = from === "en" ? "id" : "en";
  const other = getPost(to, alternate);
  if (!other || other.alternate !== slug) return null;
  const path = `/journal/${alternate}`;
  return {
    path,
    link: { href: localePath(to, path), label: getSite(from).ui.article.otherLanguage, hrefLang: to },
  };
}
