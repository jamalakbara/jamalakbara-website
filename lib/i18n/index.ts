import {
  about as aboutEn,
  idProjects,
  idSite,
  navigation,
  pages,
  projects,
  seoSettings,
  servicePages,
  siteConfig,
  ui as uiEn,
} from "@/lib/content";
import type { Project } from "@/lib/content-types";
import { ID_PUBLISHED, type Lang } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/routes";
import { waNumber } from "@/lib/country-codes";

export type Ui = typeof uiEn;

/** Bahasa over English. Blank Bahasa fields keep the English value. */
function overlay<T>(base: T, top: unknown): T {
  if (Array.isArray(base)) {
    const list = Array.isArray(top) ? top : [];
    return base.map((item, i) => overlay(item, list[i])) as T;
  }
  if (base && typeof base === "object") {
    const source = (top && typeof top === "object" ? top : {}) as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(base).map(([key, value]) => [key, overlay(value, source[key])]),
    ) as T;
  }
  return typeof top === "string" && top.trim() ? (top as T) : base;
}

export type WorkRow = {
  id: string;
  num: string;
  title: string;
  category: string;
  year: string;
  href: string;
  /** internal case study page when it is published */
  caseHref?: string;
  image: string;
  video?: string;
  description: string;
  /** media strip for the project row: gallery when set, else the cover image */
  media: string[];
  featured: boolean;
};

const filled = (s?: string) => Boolean(s?.trim());

/** Row copy is enough for /id/work; a case study also needs its story. */
export function projectTranslated(p: Project, caseStudy = false): boolean {
  const t = (idProjects as Record<string, (typeof idProjects)[string]>)[p.id];
  if (!t || !filled(t.category) || !filled(t.summary) || !filled(t.description)) return false;
  if (!caseStudy) return true;
  return (
    (!p.challenge || filled(t.challenge)) &&
    (!p.solution || filled(t.solution)) &&
    (p.features ?? []).every((_, i) => filled(t.features[i])) &&
    (p.metrics ?? []).every((_, i) => filled(t.metricLabels[i]))
  );
}

/** A project in a language: Bahasa copy over shared names, media and tech. */
export function localizeProject(p: Project, lang: Lang): Project {
  if (lang === "en") return p;
  const t = idProjects[p.id];
  if (!t) return p;
  const text = (id?: string, en?: string) => (filled(id) ? id : en);
  return {
    ...p,
    category: text(t.category, p.category) as string,
    summary: text(t.summary, p.summary),
    description: text(t.description, p.description) as string,
    challenge: text(t.challenge, p.challenge),
    solution: text(t.solution, p.solution),
    features: p.features?.map((f, i) => text(t.features[i], f) as string),
    metrics: p.metrics?.map((m, i) => ({ ...m, label: text(t.metricLabels[i], m.label) as string })),
    seo: filled(t.seo.title) || filled(t.seo.description) ? t.seo : p.seo,
  };
}

const visibleProjects = (lang: Lang) =>
  projects.filter((p) => !p.draft && (lang === "en" || projectTranslated(p)));

function buildSite(lang: Lang, previewUi?: unknown) {
  const id = lang === "id";
  const ui: Ui = id ? overlay(uiEn, previewUi ?? idSite.ui) : uiEn;
  const page = id ? overlay(pages, idSite.pages) : pages;
  const path = (p: string) => localePath(lang, p);

  const caseStudies = visibleProjects(lang)
    .filter((p) => p.caseStudy && (!id || projectTranslated(p, true)))
    .map((p) => localizeProject(p, lang));
  const caseIds = new Set(caseStudies.map((p) => p.id));

  const works: WorkRow[] = visibleProjects(lang).map((source, i) => {
    const p = localizeProject(source, lang);
    return {
      id: p.id,
      num: String(i + 1).padStart(2, "0"),
      title: p.title,
      category: p.category,
      year: p.year,
      href: p.livePreview || p.url || "#",
      caseHref: caseIds.has(p.id) ? path(`/work/${p.id}`) : undefined,
      image: p.image,
      video: p.video,
      description: p.summary?.trim() || p.description,
      media: (p.gallery?.length ? p.gallery : [p.image]).filter(Boolean).slice(0, 3),
      featured: p.featured === true,
    };
  });

  const paragraphs = aboutEn.description.map((para, i) =>
    id && filled(idSite.about.description[i]) ? idSite.about.description[i] : para,
  );

  const services = servicePages.filter((p) => !p.draft && p.lang === lang && (lang === "en" || ID_PUBLISHED || previewUi !== undefined));

  return {
    lang,
    ui,
    path,
    nav: navigation
      .filter((item) => item.href !== "/services" || (id && ID_PUBLISHED && services.length > 0))
      .map((item) => ({ label: item.label, href: path(item.href) })),
    page,
    home: {
      role: (id && idSite.tagline.trim()) || siteConfig.brand.tagline,
      location: (id && idSite.location.trim()) || siteConfig.contact.location,
      availability: page.home.availability,
      headline: page.home.headline,
      intro: page.home.intro,
    },
    works,
    caseStudies,
    work: { eyebrow: page.work.eyebrow, heading: page.work.heading },
    about: {
      eyebrow: page.about.eyebrow,
      portrait: aboutEn.profileImage || "/profile-image.png",
      heading: page.about.heading,
      paragraphs: paragraphs.filter((p) => p.trim()),
      footnote: page.about.footnote,
    },
    journal: { eyebrow: page.journal.eyebrow, heading: page.journal.heading },
    contact: {
      eyebrow: page.contact.eyebrow,
      heading: page.contact.heading,
      email: siteConfig.contact.email,
      // wa.me number, composed from country dial + local (digits only)
      whatsapp: waNumber(siteConfig.contact.whatsappCountry, siteConfig.contact.whatsappNumber),
      socials: siteConfig.social.map((s) => ({ label: s.platform, url: s.url })),
    },
    services,
    serviceLinks: services.map((p) => ({
      href: path(`/services/${p.slug}`),
      label: p.seo.title.trim() || p.title,
    })),
    seo: id
      ? {
          website: overlay(seoSettings.website, idSite.seo.website),
          identity: {
            ...overlay(seoSettings.identity, { description: idSite.seo.identity.description }),
            jobTitles: idSite.seo.identity.jobTitles.length ? idSite.seo.identity.jobTitles : seoSettings.identity.jobTitles,
          },
          business: {
            ...overlay(seoSettings.business, { description: idSite.seo.business.description }),
            services: idSite.seo.business.services.length ? idSite.seo.business.services : seoSettings.business.services,
          },
        }
      : seoSettings,
  };
}

export type Site = ReturnType<typeof buildSite>;

export const getInterfacePreviewSite = (ui: unknown): Site => buildSite("id", ui);

const cache = new Map<Lang, Site>();

/** Everything a page needs in one language. Safe on server and client. */
export function getSite(lang: Lang): Site {
  let site = cache.get(lang);
  if (!site) {
    site = buildSite(lang);
    cache.set(lang, site);
  }
  return site;
}

/** Fill "{n}" style placeholders in a UI string. */
export const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
