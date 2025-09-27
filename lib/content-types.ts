// Content Management System Types
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  category?: string;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  year: string;
  tech: string[];
  url?: string;
  featured?: boolean;
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
  stats: {
    label: string;
    value: string;
    description: string;
  }[];
  profileImage?: string;
}

export interface SiteConfig {
  brand: {
    name: string;
    shortName: string;
    tagline: string;
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