import type { Metadata } from "next";
import { pages } from "@/lib/content";

const SITE_URL = "https://jamalakbara.com";
const SITE_NAME = "Jamal Akbar Alam";

type PageKey = "work" | "about" | "contact" | "journal";

/**
 * Builds a route's metadata from admin-editable SEO fields in
 * `content/site/pages.json`, falling back to the shipped defaults when a field
 * is blank/absent. The short `title` feeds the "%s | Jamal Akbar Alam"
 * template; OpenGraph/Twitter use the full "<title> — Jamal Akbar Alam" form.
 *
 * Pass `template: true` for sections with child routes (e.g. /journal) so the
 * title template still reaches nested pages.
 */
export function buildPageMetadata(
  key: PageKey,
  path: string,
  fallback: { title: string; description: string },
  opts?: { template?: boolean },
): Metadata {
  const seo = pages[key].seo;
  const title = seo?.title?.trim() || fallback.title;
  const description = seo?.description?.trim() || fallback.description;
  const url = `${SITE_URL}${path}`;
  const ogTitle = `${title} — ${SITE_NAME}`;

  return {
    title: opts?.template
      ? { default: title, template: `%s | ${SITE_NAME}` }
      : title,
    description,
    alternates: { canonical: url },
    openGraph: { title: ogTitle, description, url },
    twitter: { title: ogTitle, description },
  };
}
