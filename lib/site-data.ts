import {
  about as aboutContent,
  navigation,
  pages,
  projects,
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
  image: string;
  video?: string;
};

export const works: WorkRow[] = projects.map((p, i) => ({
  id: p.id,
  num: String(i + 1).padStart(2, "0"),
  title: p.title,
  category: p.category,
  year: p.year,
  href: p.livePreview || p.url || "#",
  image: p.image,
  video: p.video,
}));

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

/* ---- Contact ---------------------------------------------------------- */
export const contact = {
  eyebrow: pages.contact.eyebrow,
  heading: pages.contact.heading,
  email: siteConfig.contact.email, // hello-im@jamalakbara.com
  // wa.me number, composed from country dial + local (digits only)
  whatsapp: waNumber(siteConfig.contact.whatsappCountry, siteConfig.contact.whatsappNumber),
  socials: siteConfig.social.map((s) => ({ label: s.platform, url: s.url })),
};
