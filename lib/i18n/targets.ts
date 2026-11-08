import { notFound } from "next/navigation";
import { getSite } from "@/lib/i18n";
import { ID_PUBLISHED, type Lang } from "@/lib/i18n/config";
import type { LanguageTargets } from "@/lib/i18n/routes";
import { postPairs } from "@/lib/posts";

// Server only: reads post frontmatter.

/** Pages that exist in both languages, for the nav's language link. */
export function languageTargets(): LanguageTargets {
  const en = getSite("en");
  const id = getSite("id");
  const idServices = new Set(id.services.map((p) => p.slug));
  return {
    posts: postPairs(),
    services: Object.fromEntries(
      en.services.flatMap((p) => (p.alternate && idServices.has(p.alternate) ? [[p.slug, p.alternate]] : [])),
    ),
    caseStudies: en.caseStudies.filter((p) => id.caseStudies.some((o) => o.id === p.id)).map((p) => p.id),
  };
}

/** Bahasa pages 404 until the site is published in /admin/translations. */
export function requireLive(lang: Lang) {
  if (lang === "id" && !ID_PUBLISHED) notFound();
}
