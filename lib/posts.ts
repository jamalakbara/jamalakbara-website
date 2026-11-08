import { formatPostDate, getJournalPost, getJournalPosts } from "@/lib/journal";
import { formatJurnalDate, getJurnalPost, getJurnalPosts } from "@/lib/jurnal";
import type { Lang } from "@/lib/i18n/config";

// Posts by language: English in content/journal, Bahasa in content/jurnal.
// Server only. The two sets are written separately, and same-topic posts are
// linked through `alternate`.
export const getPosts = (lang: Lang) => (lang === "en" ? getJournalPosts() : getJurnalPosts());

export const getPost = (lang: Lang, slug: string) =>
  lang === "en" ? getJournalPost(slug) : getJurnalPost(slug);

export const formatDate = (lang: Lang, iso: string) =>
  lang === "en" ? formatPostDate(iso) : formatJurnalDate(iso);

/** English slug → Bahasa slug, for mutual pairs of published posts. */
export function postPairs(): Record<string, string> {
  const pairs: Record<string, string> = {};
  for (const post of getJournalPosts()) {
    if (post.alternate && getJurnalPost(post.alternate)?.alternate === post.slug) {
      pairs[post.slug] = post.alternate;
    }
  }
  return pairs;
}
