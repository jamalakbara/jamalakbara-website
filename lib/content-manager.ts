import type {
  Service,
  Project,
  NavigationItem,
  AboutContent,
  SiteConfig,
  HeroContent,
  CTAContent
} from './content-types'

// Import fs only on server side
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = typeof window === 'undefined' ? require('fs').promises : null
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = typeof window === 'undefined' ? require('path') : null

// eslint-disable-next-line @typescript-eslint/no-require-imports
const CONTENT_DIR = typeof window === 'undefined' ? require('path').join(process.cwd(), 'content') : null

// Generic function to load JSON content (server-side only)
async function loadContent<T>(filename: string): Promise<T> {
  if (typeof window !== 'undefined') {
    throw new Error('loadContent can only be used on server side')
  }
  
  try {
    const filePath = path!.join(CONTENT_DIR!, filename)
    const fileContent = await fs!.readFile(filePath, 'utf-8')
    return JSON.parse(fileContent) as T
  } catch (error) {
    console.error(`Error loading ${filename}:`, error)
    throw new Error(`Failed to load content from ${filename}`)
  }
}

// Server-side content loaders
export const ContentManager = {
  // Site configuration
  getSiteConfig: async (): Promise<SiteConfig> => {
    return loadContent<SiteConfig>('site-config.json')
  },

  // Navigation items
  getNavigation: async (): Promise<NavigationItem[]> => {
    return loadContent<NavigationItem[]>('navigation.json')
  },

  // Hero section content
  getHeroContent: async (): Promise<HeroContent> => {
    return loadContent<HeroContent>('hero.json')
  },

  // Services content
  getServices: async (): Promise<Service[]> => {
    return loadContent<Service[]>('services.json')
  },

  // Projects content
  getProjects: async (): Promise<Project[]> => {
    return loadContent<Project[]>('projects.json')
  },

  // Featured projects only
  getFeaturedProjects: async (): Promise<Project[]> => {
    const projects = await loadContent<Project[]>('projects.json')
    return projects.filter(project => project.featured)
  },

  // About content
  getAboutContent: async (): Promise<AboutContent> => {
    return loadContent<AboutContent>('about.json')
  },

  // CTA section content
  getCTAContent: async (): Promise<CTAContent> => {
    return loadContent<CTAContent>('cta.json')
  },

  // Get project by ID
  getProjectById: async (id: string): Promise<Project | null> => {
    const projects = await loadContent<Project[]>('projects.json')
    return projects.find(project => project.id === id) || null
  },

  // Get service by ID
  getServiceById: async (id: string): Promise<Service | null> => {
    const services = await loadContent<Service[]>('services.json')
    return services.find(service => service.id === id) || null
  }
}

// Client-side content loader (for static generation and client-side usage)
export const getStaticContent = {
  siteConfig: (): SiteConfig => {
    return {
      "brand": {
        "name": "Portfolio Jamal Akbar Alam",
        "shortName": "jamalakbara.",
        "fullName": "Jamal Akbar Alam",
        "tagline": "Creative Developer & Designer",
        "description": "Portfolio showcasing web development, UI/UX design, and creative digital solutions by Jamal Akbar Alam"
      },
      "contact": {
        "email": "hello-im@jamalakbara.com",
        "location": "Based in Bandung, Indonesia",
        "phone": "+6281321766565"
      },
      "social": [
        {
          "platform": "GitHub",
          "url": "https://github.com/jamalakbara",
          "handle": "@jamalakbara"
        },
        {
          "platform": "LinkedIn",
          "url": "https://linkedin.com/in/jamalakbara",
          "handle": "@jamalakbara"
        },
        {
          "platform": "Twitter",
          "url": "https://twitter.com/jamalakbara",
          "handle": "@jamalakbara"
        }
      ]
    }
  },
  
  navigation: (): NavigationItem[] => {
    return [
      { "id": "hero", "label": "Home" },
      { "id": "services", "label": "Services" },
      { "id": "work", "label": "Work" },
      { "id": "about", "label": "About" },
      { "id": "contact", "label": "Contact" }
    ]
  },
  
  hero: (): HeroContent => {
    return {
      "greeting": "Welcome to the portfolio of",
      "name": "Jamal Akbar Alam",
      "title": "Creative Developer & Designer",
      "description": "Explore my portfolio featuring innovative web development, UI/UX design, and digital experiences. As Jamal Akbar Alam, I create exceptional solutions that blend cutting-edge technology with creative design, specializing in React, Next.js, and modern development frameworks.",
      "subtitle": "Portfolio • Web Development • Creative Design",
      "cta": {
        "primary": {
          "text": "View Portfolio",
          "action": "scroll-to-work"
        },
        "secondary": {
          "text": "Get In Touch",
          "action": "scroll-to-contact"
        }
      }
    }
  },
  
  services: (): Service[] => {
    return [
      {
        "id": "ui-ux-design",
        "title": "UI/UX Design",
        "description": "Creating intuitive and visually stunning user interfaces that enhance user experience and drive engagement.",
        "icon": "✦",
        "category": "Design"
      },
      {
        "id": "frontend-development",
        "title": "Frontend Development", 
        "description": "Building responsive, performant web applications using modern technologies and best practices.",
        "icon": "◉",
        "category": "Development"
      },
      {
        "id": "backend-development",
        "title": "Backend Development",
        "description": "Building robust server-side applications, APIs, and database systems that power modern web experiences with scalability and security.",
        "icon": "△",
        "category": "Development"
      },
      {
        "id": "mobile-development",
        "title": "Mobile Development",
        "description": "Creating native and cross-platform mobile applications with React Native and Flutter, delivering seamless user experiences across iOS and Android devices.",
        "icon": "▫",
        "category": "Development"
      }
    ]
  },
  
  projects: (): Project[] => {
    return [
      {
        "id": "sonderlab",
        "title": "Sonderlab",
        "category": "E-Commerce Development",
        "description": "A modern e-commerce platform built with Shopify, featuring custom theme development, advanced product filtering, and seamless checkout experience. Designed for scalability and optimal performance.",
        "image": "/sonderlab-project.png",
        "year": "2024",
        "tech": ["Shopify", "Liquid", "JavaScript", "CSS3", "GraphQL", "React"],
        "url": "https://sonderlab.co",
        "livePreview": "https://sonderlab.co",
        "featured": true
      },
      {
        "id": "base-data-dashboard",
        "title": "Base Data Dashboard",
        "category": "Backend Development",
        "description": "A comprehensive backend system for data management and analytics dashboard. Built with robust authentication, efficient data processing, and scalable architecture to handle complex data operations and real-time reporting.",
        "image": "/base-data-dashboard.png",
        "year": "2024",
        "tech": ["Python", "FastAPI", "MongoDB", "MySQL", "JWT", "Redis", "Docker"],
        "url": "https://bdd.ai",
        "featured": true
      },
      {
        "id": "green-rebel-foods",
        "title": "Green Rebel Foods",
        "category": "E-commerce Development",
        "description": "E-commerce platform development for Green Rebel Foods, featuring custom Shopify theme with product variant management, subscription system, and integrated marketing tools.",
        "image": "/green-rebel-foods-v2.png",
        "year": "2021",
        "tech": ["Shopify", "Liquid", "JavaScript", "CSS3", "React", "GraphQL"],
        "url": "https://greenrebelfoods.com",
        "livePreview": "https://greenrebelfoods.com",
        "featured": true
      },
      {
        "id": "mobile-banking-app",
        "title": "Mobile Banking App",
        "category": "Mobile Design",
        "description": "Modern mobile banking application design with focus on security and user experience.",
        "image": "/api/placeholder/600/400",
        "year": "2023",
        "tech": ["React Native", "Figma", "Fintech"],
        "url": "#",
        "featured": false
      }
    ]
  },
  
  featuredProjects: (): Project[] => {
    const projects = getStaticContent.projects()
    return projects.filter(project => project.featured)
  },
  
  about: (): AboutContent => {
    return {
      "heading": {
        "main": "About",
        "subtitle": "Creative developer with a passion for innovation"
      },
      "description": [
        "Hey! I'm a creative developer. Basically, I'm the person who makes sure beautiful designs actually work flawlessly as real-world tech.",
        "I've been doing this for 5+ years, and I specialize in building digital experiences that people genuinely enjoy using. It's not just about looking good; it's got to perform perfectly, too.",
        "I'm equal parts design nerd and code geek. For me, a project isn't done until it's both beautiful and functional. My goal is always to make things that are simple, intuitive, and accessible to as many people as possible.",
        "I get the biggest buzz from working with brands and startups who want to push boundaries and build something truly innovative."
      ],
      "stats": [
        {
          "label": "Projects",
          "value": "50+",
          "description": "Completed projects"
        },
        {
          "label": "Clients",
          "value": "25+", 
          "description": "Happy clients"
        },
        {
          "label": "Years",
          "value": "5+",
          "description": "Experience"
        }
      ],
      "profileImage": "/profile-image.png"
    }
  },
  
  cta: (): CTAContent => {
    return {
      "heading": "Let's Work Together",
      "description": "Ready to bring your vision to life? Let's discuss your project and create something extraordinary together.",
      "form": {
        "fields": [
          {
            "name": "firstName",
            "type": "text",
            "placeholder": "John",
            "required": true
          },
          {
            "name": "lastName", 
            "type": "text",
            "placeholder": "Doe",
            "required": true
          },
          {
            "name": "email",
            "type": "email",
            "placeholder": "john@example.com",
            "required": true
          },
          {
            "name": "projectDetails",
            "type": "textarea",
            "placeholder": "Tell me about your project...",
            "required": true
          }
        ],
        "submitText": "Send Message",
        "secondaryText": "Schedule Call"
      }
    }
  }
}