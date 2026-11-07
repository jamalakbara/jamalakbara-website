import {
  about as aboutContent,
  navigation,
  pages,
  projects,
  servicePages,
  siteConfig,
} from "@/lib/content";
import { waNumber } from "@/lib/country-codes";

/* ---- Navigation ------------------------------------------------------- */
export const NAV_LINKS = navigation;

/* ---- Home ------------------------------------------------------------- */
export const home = {
  role: siteConfig.brand.tagline, // "Creative Developer & Designer"
  location: siteConfig.contact.location, // "Based in Bandung, Indonesia"
  availability: pages.home.availability,
  headline: pages.home.headline,
  intro: pages.home.intro,
};

/* ---- Work ------------------------------------------------------------- */
export type WorkRow = {
  id: string;
  num: string;
  title: string;
  category: string;
  year: string;
  href: string;
  /** internal /work/<id> page when the case study is published */
  caseHref?: string;
  image: string;
  video?: string;
  description: string;
  /** media strip for the project row: gallery when set, else the cover image */
  media: string[];
  featured: boolean;
};

export const works: WorkRow[] = projects
  .filter((p) => !p.draft)
  .map((p, i) => ({
  id: p.id,
  num: String(i + 1).padStart(2, "0"),
  title: p.title,
  category: p.category,
  year: p.year,
  href: p.livePreview || p.url || "#",
  caseHref: p.caseStudy ? `/work/${p.id}` : undefined,
  image: p.image,
  video: p.video,
  description: p.summary?.trim() || p.description,
  media: (p.gallery?.length ? p.gallery : [p.image]).filter(Boolean).slice(0, 3),
  featured: p.featured === true,
}));

/** projects with a published /work/<id> page */
export const caseStudies = projects.filter((p) => !p.draft && p.caseStudy);

export const work = {
  eyebrow: pages.work.eyebrow,
  heading: pages.work.heading,
};

/* ---- About ------------------------------------------------------------ */
export const about = {
  eyebrow: pages.about.eyebrow,
  portrait: aboutContent.profileImage || "/profile-image.png",
  heading: pages.about.heading,
  paragraphs: aboutContent.description.filter((p) => p.trim()),
  footnote: pages.about.footnote,
  chips: aboutContent.expertise.areas.map((a) => a.name),
};

/* ---- Journal ---------------------------------------------------------- */
export const journal = {
  eyebrow: pages.journal.eyebrow,
  heading: pages.journal.heading,
};

export const kontak = {
  eyebrow: pages.kontak.eyebrow,
  heading: pages.kontak.heading,
};

export const jurnal = {
  eyebrow: pages.jurnal.eyebrow,
  heading: pages.jurnal.heading,
};

/* ---- Service pages ---------------------------------------------------- */
export const publishedServicePages = servicePages.filter((p) => !p.draft);

/** internal links into /layanan, rendered only once a page is published */
export const serviceLinks = publishedServicePages.map((p) => ({
  href: `/layanan/${p.slug}`,
  label: p.seo.title.trim() || p.title,
}));

/* ---- Bahasa section --------------------------------------------------- */
// /layanan, /jurnal and /kontak form their own Bahasa section with its own nav,
// so a visitor stays in one language. The nav's language link crosses over.
// Off until the full bilingual site ships: everything shows the English nav.
export const BAHASA_SECTION_LIVE: boolean = false;

export const BAHASA_NAV = [
  ...publishedServicePages.slice(0, 1).map((p) => ({ label: "Layanan", href: `/layanan/${p.slug}` })),
  { label: "Jurnal", href: "/jurnal" },
  { label: "Kontak", href: "/kontak" },
];

export const BAHASA_STRIP = BAHASA_SECTION_LIVE
  ? { heading: "Punya rencana?", label: "Ngobrol yuk", href: "/kontak" }
  : undefined;

export const isBahasaPath = (path: string) =>
  BAHASA_SECTION_LIVE && /^\/(jurnal|layanan|kontak)(\/|$)/.test(path);

export function languageLink(path: string) {
  if (isBahasaPath(path)) {
    const href = path.startsWith("/kontak") ? "/contact" : path.startsWith("/jurnal") ? "/journal" : "/";
    return { href, label: "English", lang: "en" };
  }
  const href = path.startsWith("/contact") ? "/kontak" : path.startsWith("/journal") ? "/jurnal" : BAHASA_NAV[0].href;
  return { href, label: "Bahasa", lang: "id" };
}

/* ---- Contact ---------------------------------------------------------- */
export const contact = {
  eyebrow: pages.contact.eyebrow,
  heading: pages.contact.heading,
  email: siteConfig.contact.email, // hello-im@jamalakbara.com
  // wa.me number, composed from country dial + local (digits only)
  whatsapp: waNumber(siteConfig.contact.whatsappCountry, siteConfig.contact.whatsappNumber),
  socials: siteConfig.social.map((s) => ({ label: s.platform, url: s.url })),
};
