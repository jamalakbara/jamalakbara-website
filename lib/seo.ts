import type { Metadata } from "next";
import { getSite } from "@/lib/i18n";
import { ID_PUBLISHED, type Lang } from "@/lib/i18n/config";
import { absoluteUrl, localePath } from "@/lib/i18n/routes";

const SITE_NAME = "Jamal Akbar Alam";

type PageKey = "work" | "about" | "contact" | "journal";

/**
 * Canonical and hreflang for a page. Paths are English-style. Every page is
 * canonical to itself; hreflang appears only when both versions are live.
 * Pass `other` when the twin has a different path, or null when it has none.
 */
export function alternatesFor(
  lang: Lang,
  path: string,
  other: string | null = path,
  opts?: { force?: boolean },
) {
  const canonical = absoluteUrl(localePath(lang, path));
  if (other === null || !(ID_PUBLISHED || opts?.force)) return { canonical };
  const en = lang === "en" ? path : other;
  const id = lang === "id" ? path : other;
  return {
    canonical,
    languages: {
      en: absoluteUrl(en),
      id: absoluteUrl(localePath("id", id)),
      "x-default": absoluteUrl(en),
    },
  };
}

/**
 * Builds a route's metadata from admin-editable SEO fields, falling back to
 * the shipped defaults when a field is blank. The short `title` feeds the
 * "%s | Jamal Akbar Alam" template; OpenGraph/Twitter use the full
 * "<title> — Jamal Akbar Alam" form.
 *
 * Pass `template: true` for sections with child routes (e.g. /journal) so the
 * title template still reaches nested pages.
 */
export function buildPageMetadata(
  lang: Lang,
  key: PageKey,
  path: string,
  fallback: { title: string; description: string },
  opts?: { template?: boolean },
): Metadata {
  const seo = getSite(lang).page[key].seo;
  const title = seo?.title?.trim() || fallback.title;
  const description = seo?.description?.trim() || fallback.description;
  const alternates = alternatesFor(lang, path);
  const ogTitle = `${title} — ${SITE_NAME}`;

  return {
    title: opts?.template
      ? { default: title, template: `%s | ${SITE_NAME}` }
      : title,
    description,
    alternates,
    openGraph: {
      title: ogTitle,
      description,
      url: alternates.canonical,
      ...(lang === "id" ? { locale: "id_ID" } : {}),
    },
    twitter: { title: ogTitle, description },
  };
}
