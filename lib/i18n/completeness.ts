import type { idProjects, idSite, pages as pagesEn, ui as uiEn } from "@/lib/content";
import type { Project, ServicePage } from "@/lib/content-types";

// How much of the Bahasa site is written. Pure, so admin screens and the
// publish check share one answer.

export type IdSite = typeof idSite;
export type IdProjects = typeof idProjects;
export type IdProject = IdProjects[string];

export interface UiField {
  /** path inside `ui`, e.g. ["home", "skills", 0, "name"] */
  path: (string | number)[];
  en: string;
  id: string;
}

const isFilled = (value: unknown) => typeof value === "string" && value.trim().length > 0;

/** Every text field in the English UI strings, with its Bahasa value. */
export function uiFields(en: unknown, id: unknown, path: (string | number)[] = []): UiField[] {
  if (typeof en === "string") return [{ path, en, id: typeof id === "string" ? id : "" }];
  if (Array.isArray(en)) {
    const list = Array.isArray(id) ? id : [];
    return en.flatMap((item, i) => uiFields(item, list[i], [...path, i]));
  }
  if (en && typeof en === "object") {
    const source = (id && typeof id === "object" ? id : {}) as Record<string, unknown>;
    return Object.entries(en).flatMap(([key, value]) => uiFields(value, source[key], [...path, key]));
  }
  return [];
}

export const blankProject = (p: Project): IdProject => ({
  category: "",
  summary: "",
  description: "",
  challenge: "",
  solution: "",
  features: (p.features ?? []).map(() => ""),
  metricLabels: (p.metrics ?? []).map(() => ""),
  seo: { title: "", description: "" },
});

export function projectReady(p: Project, t?: IdProject): boolean {
  return Boolean(t && isFilled(t.category) && isFilled(t.summary) && isFilled(t.description));
}

export interface ReportGroup {
  key: string;
  label: string;
  detail: string;
  done: number;
  total: number;
  /** blocks publishing while incomplete */
  required: boolean;
  missing: { label: string; href: string }[];
}

export interface TranslationReport {
  groups: ReportGroup[];
  done: number;
  total: number;
  /** required copy is complete, so Bahasa can be published */
  ready: boolean;
}

export function translationReport(input: {
  site: IdSite;
  ui: typeof uiEn;
  pages: typeof pagesEn;
  aboutParagraphs: string[];
  navigation: { label: string; href: string }[];
  projects: Project[];
  overlays: IdProjects;
  privacy: string;
  servicePages: ServicePage[];
}): TranslationReport {
  const { site, ui, pages, aboutParagraphs, navigation, projects, overlays, privacy, servicePages } = input;

  const pageFields: { label: string; href: string; value: unknown }[] = [];
  const add = (label: string, href: string, value: unknown) => pageFields.push({ label, href, value });
  const siteTab = (tab: string) => `/admin/site?tab=${tab}`;
  for (const key of ["home", "work", "about", "contact", "journal"] as const) {
    const en = pages[key] as Record<string, unknown> & { seo?: { title: string; description: string } };
    const id = site.pages[key] as Record<string, unknown> & { seo: { title: string; description: string } };
    for (const field of Object.keys(id).filter((f) => f !== "seo")) {
      if (isFilled(en[field])) add(`${key}: ${field}`, siteTab(key), id[field]);
    }
    add(`${key}: SEO title`, siteTab(key), id.seo.title);
    add(`${key}: SEO description`, siteTab(key), id.seo.description);
  }
  aboutParagraphs.forEach((para, i) => {
    if (isFilled(para)) add(`about: paragraph ${i + 1}`, siteTab("about"), site.about.description[i]);
  });
  add("home: role line", siteTab("home"), site.tagline);
  add("home: location", siteTab("home"), site.location);
  for (const item of navigation) {
    add(`nav: ${item.label}`, siteTab("navigation"), site.navigation.find((n) => n.href === item.href)?.label);
  }
  add("SEO: website description", "/admin/seo", site.seo.website.description);
  add("SEO: person description", "/admin/seo", site.seo.identity.description);
  add("SEO: business description", "/admin/seo", site.seo.business.description);

  const interfaceFields = uiFields(ui, site.ui).filter((f) => isFilled(f.en));
  const liveProjects = projects.filter((p) => !p.draft);
  const twins = servicePages.filter((p) => p.alternate);

  const toMissing = (list: typeof pageFields) =>
    list.filter((f) => !isFilled(f.value)).map(({ label, href }) => ({ label, href }));

  const groups: ReportGroup[] = [
    {
      key: "pages",
      label: "Pages",
      detail: "Home, Work, About, Contact, Journal, search text",
      done: pageFields.filter((f) => isFilled(f.value)).length,
      total: pageFields.length,
      required: true,
      missing: toMissing(pageFields),
    },
    {
      key: "interface",
      label: "Interface text",
      detail: "Nav, buttons, forms, cookie banner",
      done: interfaceFields.filter((f) => isFilled(f.id)).length,
      total: interfaceFields.length,
      required: true,
      missing: interfaceFields
        .filter((f) => !isFilled(f.id))
        .map((f) => ({ label: f.path.join(" / "), href: "#interface" })),
    },
    {
      key: "privacy",
      label: "Privacy policy",
      detail: "Required before publishing",
      done: isFilled(privacy) ? 1 : 0,
      total: 1,
      required: true,
      missing: isFilled(privacy) ? [] : [{ label: "Privacy policy", href: "#privacy" }],
    },
    {
      key: "projects",
      label: "Projects",
      detail: "Can follow after launch. Untranslated projects stay off /id/work",
      done: liveProjects.filter((p) => projectReady(p, overlays[p.id])).length,
      total: liveProjects.length,
      required: false,
      missing: liveProjects
        .filter((p) => !projectReady(p, overlays[p.id]))
        .map((p) => ({ label: p.title, href: `/admin/projects/${p.id}` })),
    },
    {
      key: "services",
      label: "Service pages",
      detail: "Pages linked to their other-language version",
      done: twins.length,
      total: servicePages.length,
      required: false,
      missing: servicePages
        .filter((p) => !p.alternate)
        .map((p) => ({ label: p.seo.title || p.title, href: `/admin/service-pages/${p.slug}` })),
    },
  ];

  return {
    groups,
    done: groups.reduce((n, g) => n + g.done, 0),
    total: groups.reduce((n, g) => n + g.total, 0),
    ready: groups.every((g) => !g.required || g.done === g.total),
  };
}
