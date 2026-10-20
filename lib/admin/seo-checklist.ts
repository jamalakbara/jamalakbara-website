// Shared SEO checklist for the admin editors (project, post, site page) and
// the dashboard "SEO warnings" count. Pure — runs on client and server.
// Limits follow .claude/rules/seo.md: descriptions are search snippets
// (~120–160 chars), titles fit Google's ~60 char display.

export const SITE_HOST = "jamalakbara.com";
export const BRAND_SUFFIX = " | Jamal Akbar Alam";

export type MeterState = "ok" | "warn" | "bad";

export interface SeoCheck {
  label: string;
  ok: boolean;
}

export interface SeoReport {
  snippet: { url: string; title: string; description: string };
  title: { length: number; max: number; state: MeterState; note: string };
  description: { length: number; max: number; state: MeterState; note: string };
  checks: SeoCheck[];
  passed: number;
  total: number;
}

export interface SeoInput {
  /** route path, e.g. "/journal/working-folder-revamp" */
  path: string;
  title: string;
  description: string;
  /** add the "| Jamal Akbar Alam" template suffix (all routes but home) */
  appendBrand?: boolean;
  slug?: string;
  /** topic keyword that should appear in the title (first tag / main tech) */
  keyword?: string;
  /** cover image state; omit when the item has no cover */
  cover?: { set: boolean; alt: boolean };
  /** extra item-specific checks */
  extra?: SeoCheck[];
  /** count description length as a check (off for items without a snippet) */
  descriptionCheck?: boolean;
}

const TITLE_MAX = 60;
const DESC_MIN = 120;
const DESC_MAX = 160;

function titleMeter(len: number) {
  if (len === 0) return { state: "bad" as const, note: "missing" };
  if (len > TITLE_MAX) return { state: "bad" as const, note: "too long — Google cuts it" };
  if (len < 30) return { state: "warn" as const, note: "could be longer" };
  return { state: "ok" as const, note: "" };
}

function descMeter(len: number) {
  if (len === 0) return { state: "bad" as const, note: "missing" };
  if (len > DESC_MAX) return { state: "bad" as const, note: "too long — Google cuts it" };
  if (len < DESC_MIN) return { state: "warn" as const, note: "could be longer" };
  return { state: "ok" as const, note: "" };
}

export function seoReport(input: SeoInput): SeoReport {
  const fullTitle = input.title.trim() + (input.appendBrand === false ? "" : BRAND_SUFFIX);
  const description = input.description.trim();
  const t = titleMeter(fullTitle.trim() === BRAND_SUFFIX.trim() ? 0 : fullTitle.length);
  const d = input.descriptionCheck === false ? { state: "ok" as const, note: "" } : descMeter(description.length);

  const checks: SeoCheck[] = [];
  if (input.slug !== undefined) {
    const words = input.slug.split("-").filter(Boolean).length;
    checks.push({
      label: "Slug is short and readable",
      ok: /^[a-z0-9]+(-[a-z0-9]+)*$/.test(input.slug) && input.slug.length <= 60 && words <= 8,
    });
  }
  if (input.keyword) {
    checks.push({
      label: `Keyword “${input.keyword}” in title`,
      ok: input.title.toLowerCase().includes(input.keyword.toLowerCase()),
    });
  }
  if (input.cover) {
    checks.push({ label: "Cover image is set", ok: input.cover.set });
    if (input.cover.set) checks.push({ label: "Cover image has alt text", ok: input.cover.alt });
  }
  if (input.descriptionCheck !== false) {
    checks.push({ label: `Description between ${DESC_MIN}–${DESC_MAX} chars`, ok: d.state === "ok" });
  }
  // Google drops the brand suffix before it cuts the title itself, so only
  // the page's own title has to fit.
  checks.push({ label: `Title under ${TITLE_MAX} chars`, ok: input.title.trim().length > 0 && input.title.trim().length <= TITLE_MAX });
  if (input.extra) checks.push(...input.extra);

  const crumbs = input.path.split("/").filter(Boolean);
  return {
    snippet: {
      url: [SITE_HOST, ...crumbs].join(" › "),
      title: fullTitle,
      description,
    },
    title: { length: fullTitle.length, max: TITLE_MAX, ...t },
    description: { length: description.length, max: DESC_MAX, ...d },
    checks,
    passed: checks.filter((c) => c.ok).length,
    total: checks.length,
  };
}

/* ---- Per-content helpers (editors + dashboard use the same rules) -------- */

export interface PostSeoFields {
  slug: string;
  title: string;
  description: string;
  tags: string[];
}

export function postSeo(post: PostSeoFields, base: "/journal" | "/jurnal"): SeoReport {
  return seoReport({
    path: `${base}/${post.slug}`,
    title: post.title,
    description: post.description,
    slug: post.slug,
    keyword: post.tags[0],
  });
}

export interface ProjectSeoFields {
  id: string;
  title: string;
  category: string;
  description: string;
  summary?: string;
  image: string;
  tech: string[];
}

/** Projects have no page of their own: they show as rows on /work and in the
 *  Work JSON-LD, so the checks cover what those surfaces read. */
export function projectSeo(p: ProjectSeoFields, altFor: (url: string) => string | undefined): SeoReport {
  const summary = (p.summary ?? "").trim();
  return seoReport({
    path: `/work#${p.id}`,
    title: `${p.title} — ${p.category}`,
    description: p.description,
    slug: p.id,
    descriptionCheck: false,
    cover: { set: Boolean(p.image), alt: Boolean(p.image && altFor(p.image)) },
    extra: [
      { label: "Row summary under 110 chars", ok: summary.length > 0 && summary.length <= 110 },
      ...(p.tech[0]
        ? [{
            label: `Main tech “${p.tech[0]}” in description`,
            ok: p.description.toLowerCase().includes(p.tech[0].toLowerCase()),
          }]
        : []),
    ],
  });
}
