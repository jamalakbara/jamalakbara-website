import { ID_PUBLISHED, SITE_URL, type Lang } from "@/lib/i18n/config";

/**
 * Public URL for a path in a language. Paths are always written the English
 * way ("/work", "/journal/x").
 *
 * Before launch only Bahasa journal posts are public, and they stay at their
 * old /jurnal URLs; every other Bahasa link falls back to the English page.
 */
export function localePath(lang: Lang, path: string): string {
  if (lang === "en") return path;
  if (ID_PUBLISHED) return path === "/" ? "/id" : `/id${path}`;
  return path.startsWith("/journal") ? path.replace("/journal", "/jurnal") : path;
}

export const absoluteUrl = (path: string) => (path === "/" ? SITE_URL : `${SITE_URL}${path}`);

/** The language a public URL belongs to. */
export const pathLang = (pathname: string): Lang =>
  /^\/(id|jurnal)(\/|$)/.test(pathname) ? "id" : "en";

/** Public URL back to the English-style path: "/id/work" → "/work", "/jurnal/x" → "/journal/x". */
export function basePath(pathname: string): string {
  // Prerendering sees the internal /en path; the browser sees the public one.
  const stripped = pathname.replace(/^\/(en|id)(?=\/|$)/, "") || "/";
  return stripped.replace(/^\/jurnal(?=\/|$)/, "/journal");
}

/** Links inside post bodies were written for the old routes; map them per language. */
export function contentHref(lang: Lang, href: string): string {
  if (!href.startsWith("/")) return href;
  const path = href === "/kontak" ? "/contact" : href.replace(/^\/jurnal(?=\/|$)/, "/journal");
  return localePath(lang, path);
}

export interface LanguageTargets {
  /** English post slug → Bahasa post slug, mutual published pairs only */
  posts: Record<string, string>;
  /** English service slug → Bahasa service slug */
  services: Record<string, string>;
  /** project ids with a case study in both languages */
  caseStudies: string[];
}

/** Where the language link goes: the same page in the other language, or its nearest list. */
export function languageHref(pathname: string, targets: LanguageTargets): string {
  const from = pathLang(pathname);
  const to: Lang = from === "en" ? "id" : "en";
  const path = basePath(pathname);
  const [, section, slug] = path.split("/");
  const swap = (map: Record<string, string>, key: string) =>
    from === "en" ? map[key] : Object.keys(map).find((k) => map[k] === key);

  if (section === "journal" && slug) {
    const other = swap(targets.posts, slug);
    return localePath(to, other ? `/journal/${other}` : "/journal");
  }
  if (section === "services" && slug) {
    const other = swap(targets.services, slug);
    return localePath(to, other ? `/services/${other}` : "/");
  }
  if (section === "work" && slug) {
    return localePath(to, targets.caseStudies.includes(slug) ? path : "/work");
  }
  return localePath(to, path);
}
