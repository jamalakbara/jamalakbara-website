// Site-facing content reads. Static JSON imports are inlined at build time,
// so this works from both server and client components — the public bundle
// carries the data, not an fs or network dependency. The admin edits these
// files through lib/admin/content-store.ts; a rebuild publishes changes.
import type {
  AboutContent,
  ComprehensiveAboutContent,
  CTAContent,
  HeroContent,
  Project,
  Service,
  SiteConfig,
} from "@/lib/content-types";
import type { NavLink, PagesContent } from "@/lib/content/schemas";

import projectsJson from "@/content/projects.json";
import siteConfigJson from "@/content/site/site-config.json";
import navigationJson from "@/content/site/navigation.json";
import heroJson from "@/content/site/hero.json";
import servicesJson from "@/content/site/services.json";
import aboutJson from "@/content/site/about.json";
import comprehensiveAboutJson from "@/content/site/comprehensive-about.json";
import ctaJson from "@/content/site/cta.json";
import pagesJson from "@/content/site/pages.json";

export const projects = projectsJson as Project[];
export const siteConfig = siteConfigJson as SiteConfig;
export const navigation = navigationJson as NavLink[];
export const hero = heroJson as HeroContent;
export const services = servicesJson as Service[];
export const about = aboutJson as AboutContent;
export const comprehensiveAbout = comprehensiveAboutJson as ComprehensiveAboutContent;
export const cta = ctaJson as CTAContent;
export const pages = pagesJson as PagesContent;
