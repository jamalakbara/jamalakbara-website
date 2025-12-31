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
  image: string;
  year: string;
  tech: string[];
  url?: string;
  livePreview?: string;
  featured?: boolean;
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
      tools: string[];
    };
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
    name: string;
    shortName: string;
    fullName?: string;
    tagline: string;
    description?: string;
  };
  contact: {
    email: string;
    phone?: string;
    location: string;
  };
  social: {
    platform: string;
    url: string;
    handle: string;
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

export interface BlogContent {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  author: string;
  readTime: number;
  featured: boolean;
  seo: {
    metaDescription: string;
    keywords: string[];
    ogImage?: string;
  };
  contentBlocks?: {
    type: 'heading' | 'paragraph' | 'list' | 'code';
    text?: string;
    level?: number;
    items?: string[];
    language?: string;
    code?: string;
  }[];
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