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
  ServicePage,
  SiteConfig,
} from "@/lib/content-types";
import type { NavLink, PagesContent, SeoSettings } from "@/lib/content/schemas";

import projectsJson from "@/content/projects.json";
import servicePagesJson from "@/content/service-pages.json";
import siteConfigJson from "@/content/site/site-config.json";
import navigationJson from "@/content/site/navigation.json";
import heroJson from "@/content/site/hero.json";
import servicesJson from "@/content/site/services.json";
import aboutJson from "@/content/site/about.json";
import comprehensiveAboutJson from "@/content/site/comprehensive-about.json";
import ctaJson from "@/content/site/cta.json";
import pagesJson from "@/content/site/pages.json";
import seoJson from "@/content/site/seo.json";
import uiJson from "@/content/site/ui.json";
import idSiteJson from "@/content/i18n/id/site.json";
import idProjectsJson from "@/content/i18n/id/projects.json";

export const projects = projectsJson as Project[];
export const servicePages = servicePagesJson as ServicePage[];
export const siteConfig = siteConfigJson as SiteConfig;
export const navigation = navigationJson as NavLink[];
export const hero = heroJson as HeroContent;
export const services = servicesJson as Service[];
export const about = aboutJson as AboutContent;
export const comprehensiveAbout = comprehensiveAboutJson as ComprehensiveAboutContent;
export const cta = ctaJson as CTAContent;
export const pages = pagesJson as PagesContent;
export const seoSettings = seoJson as SeoSettings;
export const ui = uiJson;
export const idSite = idSiteJson as Omit<typeof idSiteJson, "seo"> & {
  seo: {
    website: { description: string };
    identity: { description: string; jobTitles: string[] };
    business: { description: string; services: string[] };
  };
};
export const idProjects = idProjectsJson as Record<
  string,
  {
    category: string;
    summary: string;
    description: string;
    challenge: string;
    solution: string;
    features: string[];
    metricLabels: string[];
    seo: { title: string; description: string };
  }
>;
