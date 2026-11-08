// Content Management System Types
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  category?: string;
  // New fields for detailed service page
  features?: string[];
  process?: {
    title: string;
    desc: string;
  }[];
  technologies?: string[];
  benefits?: {
    title: string;
    desc: string;
  }[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  /** one-line summary for the Work rows (≤ 110 chars); falls back to description */
  summary?: string;
  image: string;
  video?: string; // Optional video URL (mp4/webm) - plays as autoplay loop
  year: string;
  tech: string[];
  url?: string;
  livePreview?: string;
  featured?: boolean;
  /** hidden from the public site (kept in content for later) */
  draft?: boolean;
  /** publishes the /work/<id> case study page; off until the owner reviews it */
  caseStudy?: boolean;
  /** case study page SEO; blank falls back to title + summary */
  seo?: { title: string; description: string };
  // New fields for detailed case study
  challenge?: string;
  solution?: string;
  features?: string[];
  gallery?: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  metrics?: {
    label: string;
    value: string;
  }[];
}

/** content/service-pages.json: landing pages at /services/<slug> and /id/services/<slug>. */
export interface ServicePage {
  lang: "en" | "id";
  /** slug of the same page in the other language */
  alternate?: string;
  slug: string;
  draft?: boolean;
  eyebrow: string;
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
  faq: { question: string; answer: string }[];
  cta: { heading: string; label: string };
  /** row on the /services overview; blank falls back to title and intro */
  summary?: { label: string; description: string; price: string };
  seo: { title: string; description: string };
}

export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
}

export interface AboutContent {
  heading: {
    main: string;
    subtitle: string;
  };
  description: string[];
  expertise: {
    title: string;
    areas: {
      name: string;
      technologies: string[];
      description: string;
    }[];
  };
  indonesianExperience: {
    title: string;
    description: string;
    achievements: string[];
  };
  stats: {
    label: string;
    value: string;
    description: string;
  }[];
  education: {
    title: string;
    details: string;
    certifications: string[];
  };
  location: {
    title: string;
    description: string;
    serviceAreas: string[];
  };
  profileImage?: string;
}

export interface ComprehensiveAboutContent {
  heading: {
    main: string;
    subtitle: string;
  };
  professionalSummary: string[];
  expertise: {
    title: string;
    areas: {
      name: string;
      technologies: string[];
      description: string;
      proficiencyLevel: string;
      yearsExperience: number;
    }[];
  };
  technicalProcess: {
    title: string;
    methodology: string[];
    technologies: {
      frontend: string[];
      backend: string[];
      mobile: string[];
      database: string[];
      cloud: string[];
    };
  };
  indonesianMarketExpertise?: {
    title: string;
    description: string;
    specializations: {
      sector: string;
      description: string;
      achievements: string[];
    }[];
  };
  successStories?: {
    title: string;
    projects: {
      client: string;
      industry: string;
      challenge: string;
      solution: string;
      results: string;
      technologies: string[];
    }[];
  };
  education: {
    title: string;
    details: string;
    certifications: string[];
    continuousLearning: string[];
  };
  stats: {
    label: string;
    value: string;
    description: string;
  }[];
  location: {
    title: string;
    description: string;
    serviceAreas: string[];
  };
  contact: {
    email: string;
    phone: string;
    availability: string;
  };
  profileImage?: string;
}

export interface SiteConfig {
  brand: {
    tagline: string;
  };
  contact: {
    email: string;
    whatsappCountry?: string; // dial code, digits only (e.g. "62")
    whatsappNumber?: string; // local number, any legal format
    location: string;
  };
  social: {
    platform: string;
    url: string;
  }[];
}

export interface HeroContent {
  greeting: string;
  name: string;
  title: string;
  description: string;
  subtitle?: string;
  cta: {
    primary: {
      text: string;
      action: string;
    };
    secondary: {
      text: string;
      action: string;
    };
  };
}

export interface CTAContent {
  heading: string;
  description: string;
  form: {
    fields: {
      name: string;
      type: string;
      placeholder: string;
      required: boolean;
    }[];
    submitText: string;
    secondaryText: string;
  };
}