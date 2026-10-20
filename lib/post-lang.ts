// EN ↔ ID post linking (set in the admin "Bahasa version" panel, stored as
// `alternate: <slug>` in both posts' frontmatter). A link is only honoured
// when it is mutual and both posts are published, so hreflang never points at
// a draft or a post that doesn't point back.
import type { Metadata } from "next";
import { getJournalPost } from "@/lib/journal";
import { getJurnalPost } from "@/lib/jurnal";

const ORIGIN = "https://jamalakbara.com";

export interface PostLang {
  languages: NonNullable<NonNullable<Metadata["alternates"]>["languages"]>;
  link: { href: string; label: string; hrefLang: "en" | "id" };
}

export function postLang(from: "en" | "id", slug: string, alternate?: string): PostLang | null {
  if (!alternate) return null;
  const other = from === "en" ? getJurnalPost(alternate) : getJournalPost(alternate);
  if (!other || other.alternate !== slug) return null;
  const en = from === "en" ? `${ORIGIN}/journal/${slug}` : `${ORIGIN}/journal/${alternate}`;
  const id = from === "en" ? `${ORIGIN}/jurnal/${alternate}` : `${ORIGIN}/jurnal/${slug}`;
  return {
    languages: { en, id },
    link:
      from === "en"
        ? { href: `/jurnal/${alternate}`, label: "Baca dalam Bahasa Indonesia →", hrefLang: "id" }
        : { href: `/journal/${alternate}`, label: "Read in English →", hrefLang: "en" },
  };
}
