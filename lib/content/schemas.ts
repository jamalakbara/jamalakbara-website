import { z } from "zod";

// Zod mirrors of the interfaces in lib/content-types.ts, used by the admin
// write path to validate content before it is committed. The public site
// reads the JSON through plain typed imports (lib/content/index.ts) and
// never loads these schemas.

const titleDesc = z.object({ title: z.string().min(1), desc: z.string().min(1) });

// Media/link references are either full URLs (Cloudinary) or root-relative
// paths into public/ (e.g. "/split-bill.png").
const mediaRef = z
  .string()
  .min(1)
  .refine((v) => /^https?:\/\//.test(v) || v.startsWith("/"), {
    message: "must be a URL or a root-relative path",
  });

export const serviceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  category: z.string().optional(),
  features: z.array(z.string()).optional(),
  process: z.array(titleDesc).optional(),
  technologies: z.array(z.string()).optional(),
  benefits: z.array(titleDesc).optional(),
});

export const projectSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "lowercase letters, numbers and dashes only"),
  title: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  summary: z.string().max(110).optional(),
  image: mediaRef,
  video: mediaRef.optional(),
  year: z.string().min(1),
  tech: z.array(z.string()),
  url: z.string().url().optional(),
  livePreview: z.string().url().optional(),
  featured: z.boolean().optional(),
  draft: z.boolean().optional(),
  caseStudy: z.boolean().optional(),
  seo: z.object({ title: z.string(), description: z.string() }).optional(),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  features: z.array(z.string()).optional(),
  gallery: z.array(mediaRef).optional(),
  testimonial: z
    .object({ quote: z.string(), author: z.string(), role: z.string() })
    .optional(),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
});

export const projectsSchema = z.array(projectSchema);

export const servicePageSchema = z.object({
  lang: z.enum(["en", "id"]),
  /** slug of the same page in the other language */
  alternate: z.string().optional(),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "lowercase letters, numbers and dashes only"),
  draft: z.boolean().optional(),
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  intro: z.string().min(1),
  sections: z.array(z.object({ heading: z.string().min(1), body: z.string().min(1) })),
  faq: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })),
  cta: z.object({ heading: z.string().min(1), label: z.string().min(1) }),
  seo: z.object({ title: z.string(), description: z.string() }),
});

export const servicePagesSchema = z.array(servicePageSchema);

export const navigationSchema = z.array(
  z.object({ label: z.string().min(1), href: z.string().min(1) })
);

export const siteConfigSchema = z.object({
  brand: z.object({
    tagline: z.string().min(1),
  }),
  contact: z.object({
    email: z.string().email(),
    whatsappCountry: z.string().optional(),
    whatsappNumber: z.string().optional(),
    location: z.string().min(1),
  }),
  social: z.array(
    z.object({ platform: z.string(), url: z.string().url() })
  ),
});

export const heroSchema = z.object({
  greeting: z.string(),
  name: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  subtitle: z.string().optional(),
  cta: z.object({
    primary: z.object({ text: z.string(), action: z.string() }),
    secondary: z.object({ text: z.string(), action: z.string() }),
  }),
});

const statSchema = z.object({
  label: z.string(),
  value: z.string(),
  description: z.string(),
});

export const aboutSchema = z.object({
  heading: z.object({ main: z.string(), subtitle: z.string() }),
  description: z.array(z.string()),
  expertise: z.object({
    title: z.string(),
    areas: z.array(
      z.object({
        name: z.string(),
        technologies: z.array(z.string()),
        description: z.string(),
      })
    ),
  }),
  indonesianExperience: z.object({
    title: z.string(),
    description: z.string(),
    achievements: z.array(z.string()),
  }),
  stats: z.array(statSchema),
  education: z.object({
    title: z.string(),
    details: z.string(),
    certifications: z.array(z.string()),
  }),
  location: z.object({
    title: z.string(),
    description: z.string(),
    serviceAreas: z.array(z.string()),
  }),
  profileImage: z.string().optional(),
});

export const comprehensiveAboutSchema = z.object({
  heading: z.object({ main: z.string(), subtitle: z.string() }),
  professionalSummary: z.array(z.string()),
  expertise: z.object({
    title: z.string(),
    areas: z.array(
      z.object({
        name: z.string(),
        technologies: z.array(z.string()),
        description: z.string(),
        proficiencyLevel: z.string(),
        yearsExperience: z.number(),
      })
    ),
  }),
  technicalProcess: z.object({
    title: z.string(),
    methodology: z.array(z.string()),
    technologies: z.object({
      frontend: z.array(z.string()),
      backend: z.array(z.string()),
      mobile: z.array(z.string()),
      database: z.array(z.string()),
      cloud: z.array(z.string()),
    }),
  }),
  indonesianMarketExpertise: z
    .object({
      title: z.string(),
      description: z.string(),
      specializations: z.array(
        z.object({
          sector: z.string(),
          description: z.string(),
          achievements: z.array(z.string()),
        })
      ),
    })
    .optional(),
  successStories: z
    .object({
      title: z.string(),
      projects: z.array(
        z.object({
          client: z.string(),
          industry: z.string(),
          challenge: z.string(),
          solution: z.string(),
          results: z.string(),
          technologies: z.array(z.string()),
        })
      ),
    })
    .optional(),
  education: z.object({
    title: z.string(),
    details: z.string(),
    certifications: z.array(z.string()),
    continuousLearning: z.array(z.string()),
  }),
  stats: z.array(statSchema),
  location: z.object({
    title: z.string(),
    description: z.string(),
    serviceAreas: z.array(z.string()),
  }),
  contact: z.object({
    email: z.string(),
    phone: z.string(),
    availability: z.string(),
  }),
  profileImage: z.string().optional(),
});

export const ctaSchema = z.object({
  heading: z.string(),
  description: z.string(),
  form: z.object({
    fields: z.array(
      z.object({
        name: z.string(),
        type: z.string(),
        placeholder: z.string(),
        required: z.boolean(),
      })
    ),
    submitText: z.string(),
    secondaryText: z.string(),
  }),
});

// Optional per-page Cloudinary background-video path (version + public id, no
// extension, e.g. "v1781452916/bg-home_oaxs7i"). Empty → shell uses its default.
const backgroundVideo = z.string().optional();

// Per-route SEO overrides. Empty/absent → route layout falls back to its
// shipped default metadata. `title` is the short route title (feeds the
// "%s | Jamal Akbar Alam" template); `description` is the meta description.
const seo = z.object({ title: z.string(), description: z.string() }).optional();

export const pagesSchema = z.object({
  home: z.object({
    availability: z.string(),
    headline: z.string(),
    intro: z.string(),
    backgroundVideo,
    // Home `title` is the FULL homepage title (also the site-wide default /
    // fallback title) — no "%s | …" template suffix, unlike other routes.
    seo,
  }),
  work: z.object({ eyebrow: z.string(), heading: z.string(), backgroundVideo, seo }),
  about: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    footnote: z.string(),
    backgroundVideo,
    seo,
  }),
  contact: z.object({ eyebrow: z.string(), heading: z.string(), backgroundVideo, seo }),
  journal: z.object({ eyebrow: z.string(), heading: z.string(), backgroundVideo, seo }),
});

// content/site/seo.json: values behind the site's JSON-LD (/admin/seo).
export const seoSettingsSchema = z.object({
  website: z.object({
    name: z.string().min(1),
    alternateName: z.string(),
    description: z.string().min(1),
  }),
  identity: z.object({
    name: z.string().min(1),
    alternateNames: z.array(z.string()),
    jobTitles: z.array(z.string()),
    description: z.string().min(1),
    image: mediaRef,
    sameAs: z.array(z.string().url()),
    knowsAbout: z.array(z.string()),
    awards: z.array(z.string()),
    alumniOf: z.string(),
  }),
  business: z.object({
    enabled: z.boolean(),
    name: z.string().min(1),
    alternateName: z.string(),
    description: z.string().min(1),
    phone: z.string(),
    city: z.string().min(1),
    region: z.string(),
    country: z.string().min(1),
    services: z.array(z.string()),
    areaServed: z.array(z.string()),
  }),
});

export type SeoSettings = z.infer<typeof seoSettingsSchema>;
export type PagesContent = z.infer<typeof pagesSchema>;
export type NavLink = z.infer<typeof navigationSchema>[number];

/** content/media.json — per-asset metadata keyed by media key (public id basename). */
export const mediaMetaSchema = z.object({
  alt: z.record(z.string(), z.string()),
  altId: z.record(z.string(), z.string()).optional(),
});

const seoText = z.object({ title: z.string(), description: z.string() });

/** content/i18n/id/projects.json: Bahasa copy for one project. */
export const idProjectSchema = z.object({
  category: z.string(),
  summary: z.string().max(110),
  description: z.string(),
  challenge: z.string(),
  solution: z.string(),
  features: z.array(z.string()),
  metricLabels: z.array(z.string()),
  seo: seoText,
});

/** content/i18n/id/site.json: Bahasa copy for the site. */
export const idSiteSchema = z.object({
  published: z.boolean(),
  navigation: z.array(z.object({ href: z.string(), label: z.string() })),
  tagline: z.string(),
  location: z.string(),
  pages: z.object({
    home: z.object({ availability: z.string(), headline: z.string(), intro: z.string(), seo: seoText }),
    work: z.object({ eyebrow: z.string(), heading: z.string(), seo: seoText }),
    about: z.object({ eyebrow: z.string(), heading: z.string(), footnote: z.string(), seo: seoText }),
    contact: z.object({ eyebrow: z.string(), heading: z.string(), seo: seoText }),
    journal: z.object({ eyebrow: z.string(), heading: z.string(), seo: seoText }),
  }),
  about: z.object({ description: z.array(z.string()) }),
  seo: z.object({
    website: z.object({ description: z.string() }),
    identity: z.object({ description: z.string(), jobTitles: z.array(z.string()) }),
    business: z.object({ description: z.string(), services: z.array(z.string()) }),
  }),
  ui: z.record(z.string(), z.unknown()),
});
