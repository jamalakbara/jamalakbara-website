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
  getProjectById: async (id: number): Promise<Project | null> => {
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
        "name": "jamalakbara.",
        "shortName": "akbar.",
        "tagline": "Creative Developer & Designer"
      },
      "contact": {
        "email": "jamalakbaralam@live.com",
        "phone": "+6281321766565",
        "location": "Bandung, Indonesia"
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
      "greeting": "Hello, I'm",
      "name": "Jamal Akbar",
      "title": "Creative Developer & Designer",
      "description": "I create digital experiences that blend innovative design with cutting-edge technology. Specializing in web development, brand identity, and user-centered design solutions.",
      "cta": {
        "primary": {
          "text": "View My Work",
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
        "id": "brand-strategy",
        "title": "Brand Strategy",
        "description": "Developing cohesive brand identities that communicate your values and resonate with your audience.",
        "icon": "△",
        "category": "Branding"
      },
      {
        "id": "creative-direction",
        "title": "Creative Direction",
        "description": "Guiding creative projects from concept to completion with strategic thinking and artistic vision.",
        "icon": "◊",
        "category": "Strategy"
      }
    ]
  },
  
  projects: (): Project[] => {
    return [
      {
        "id": 1,
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
        "id": 2,
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
        "id": 3,
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
        "id": 4,
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
        "I'm a creative developer who bridges the gap between design and technology. With over 5 years of experience in web development and digital design, I specialize in creating memorable digital experiences that not only look beautiful but also perform exceptionally.",
        "My approach combines technical expertise with creative vision, ensuring every project delivers both aesthetic appeal and functional excellence. I believe great design should be accessible, intuitive, and meaningful.",
        "Based in the heart of creativity, I work with forward-thinking brands and startups who value innovation and aren't afraid to push boundaries in their digital presence."
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