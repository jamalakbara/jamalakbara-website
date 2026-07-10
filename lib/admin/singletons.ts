import { z, type ZodType } from "zod";
import {
  aboutSchema,
  comprehensiveAboutSchema,
  ctaSchema,
  heroSchema,
  navigationSchema,
  pagesSchema,
  serviceSchema,
  siteConfigSchema,
} from "@/lib/content/schemas";

// Registry of the site-copy singleton files editable at /admin/site.
export const SINGLETONS = {
  pages: { path: "content/site/pages.json", schema: pagesSchema, label: "Pages" },
  hero: { path: "content/site/hero.json", schema: heroSchema, label: "Hero" },
  "site-config": {
    path: "content/site/site-config.json",
    schema: siteConfigSchema,
    label: "Site config",
  },
  navigation: {
    path: "content/site/navigation.json",
    schema: navigationSchema,
    label: "Navigation",
  },
  services: {
    path: "content/site/services.json",
    schema: z.array(serviceSchema),
    label: "Services",
  },
  about: { path: "content/site/about.json", schema: aboutSchema, label: "About" },
  "comprehensive-about": {
    path: "content/site/comprehensive-about.json",
    schema: comprehensiveAboutSchema,
    label: "About (SEO)",
  },
  cta: { path: "content/site/cta.json", schema: ctaSchema, label: "CTA" },
} as const satisfies Record<string, { path: string; schema: ZodType; label: string }>;

export type SingletonKey = keyof typeof SINGLETONS;
