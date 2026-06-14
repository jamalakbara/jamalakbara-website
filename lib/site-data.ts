import { getStaticContent } from "./static-content";

const siteConfig = getStaticContent.siteConfig();
const aboutContent = getStaticContent.about();

/* ---- Navigation ------------------------------------------------------- */
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const BRAND = siteConfig.brand; // shortName "jamalakbara."

/* ---- Home ------------------------------------------------------------- */
export const home = {
  role: siteConfig.brand.tagline, // "Creative Developer & Designer"
  location: siteConfig.contact.location, // "Based in Bandung, Indonesia"
  availability: "Open for new work",
  headline: "I build fast, useful things for the web.",
  intro:
    "I'm Akbar, a developer and designer. I make websites and apps that load fast and stay easy to use.",
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

export const works: WorkRow[] = getStaticContent.projects().map((p, i) => ({
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
  eyebrow: "Selected Work",
  heading: "Things I've built.",
};

/* ---- About ------------------------------------------------------------ */
export const about = {
  eyebrow: "About",
  portrait: aboutContent.profileImage || "/profile-image.png",
  heading: "Developer and designer who likes to build.",
  paragraphs: [aboutContent.description[0], aboutContent.description[1]],
  footnote:
    "Computer Science, Telkom University. Currently independent and open to new collaborations.",
  chips: aboutContent.expertise.areas.map((a) => a.name),
};

/* ---- Contact ---------------------------------------------------------- */
export const contact = {
  eyebrow: "Contact",
  heading: "Got an idea? Let's talk.",
  email: siteConfig.contact.email, // hello-im@jamalakbara.com
  socials: siteConfig.social.map((s) => ({ label: s.platform, url: s.url })),
};
