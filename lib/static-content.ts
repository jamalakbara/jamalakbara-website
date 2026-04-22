import type {
  Service,
  Project,
  NavigationItem,
  AboutContent,
  ComprehensiveAboutContent,
  SiteConfig,
  HeroContent,
  CTAContent,
  BlogContent
} from './content-types'

// Client-side content loader (for static generation and client-side usage)
export const getStaticContent = {
  siteConfig: (): SiteConfig => {
    return {
      "brand": {
        "name": "Jamal Akbar Alam",
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
      { "id": "contact", "label": "Contact" },
      { "id": "blog", "label": "Blog", "href": "/blog" }
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
        "category": "Design",
        "features": [
          "User Research & Persona Development",
          "Wireframing & Interactive Prototyping",
          "Comprehensive Design Systems",
          "High-Fidelity UI Design",
          "Usability Testing & Iteration"
        ],
        "process": [
          { "title": "Discovery", "desc": "Understanding your business goals, target audience, and user needs through in-depth research." },
          { "title": "Definition", "desc": "Structuring the information architecture and creating user flows to ensure a logical journey." },
          { "title": "Design", "desc": "Crafting visual elements and interactive prototypes that align with your brand identity." },
          { "title": "Validation", "desc": "Testing designs with real users to identify friction points and refine the experience." }
        ],
        "technologies": [
          "Figma", "Adobe XD", "Sketch", "Principle", "InVision", "Photoshop", "Illustrator"
        ],
        "benefits": [
          { "title": "Higher Conversion Rates", "desc": "Optimized user flows that guide visitors toward your business goals." },
          { "title": "Brand Consistency", "desc": "A unified visual language that strengthens your brand presence across all touchpoints." },
          { "title": "User Satisfaction", "desc": "Intuitive interfaces that make your product a joy to use, increasing retention." }
        ]
      },
      {
        "id": "frontend-development",
        "title": "Frontend Development",
        "description": "Building responsive, performant web applications using modern technologies and best practices.",
        "icon": "◉",
        "category": "Development",
        "features": [
          "Responsive & Adaptive Design",
          "Single Page Applications (SPA)",
          "Progressive Web Apps (PWA)",
          "Performance Optimization (Core Web Vitals)",
          "Accessibility Compliance (WCAG)"
        ],
        "process": [
          { "title": "Architecture", "desc": "Planning the component structure and state management strategy for scalability." },
          { "title": "Development", "desc": "Writing clean, semantic, and modular code using modern frameworks like React and Next.js." },
          { "title": "Optimization", "desc": "Fine-tuning performance, ensuring fast load times and smooth animations." },
          { "title": "Integration", "desc": "Connecting with backend APIs and third-party services seamlessly." }
        ],
        "technologies": [
          "React", "Next.js", "TypeScript", "Tailwind CSS", "Styled Components", "Redux", "Zustand"
        ],
        "benefits": [
          { "title": "Blazing Fast Performance", "desc": "Optimized code delivery for instant page loads and smooth interactions." },
          { "title": "SEO Friendly", "desc": "Server-side rendering and semantic HTML to boost your search engine rankings." },
          { "title": "Cross-Device Compatibility", "desc": "Flawless experience on desktops, tablets, and mobile devices." }
        ]
      },
      {
        "id": "backend-development",
        "title": "Backend Development",
        "description": "Building robust server-side applications, APIs, and database systems that power modern web experiences with scalability and security.",
        "icon": "△",
        "category": "Development",
        "features": [
          "RESTful & GraphQL API Design",
          "Database Architecture & Optimization",
          "Authentication & Authorization Systems",
          "Microservices Architecture",
          "Cloud Infrastructure Setup"
        ],
        "process": [
          { "title": "System Design", "desc": "Designing scalable database schemas and API architecture." },
          { "title": "Implementation", "desc": "Developing secure and efficient server-side logic and data processing pipelines." },
          { "title": "Security", "desc": "Implementing robust security measures including encryption and access controls." },
          { "title": "Deployment", "desc": "Setting up CI/CD pipelines and cloud infrastructure for reliable hosting." }
        ],
        "technologies": [
          "Python", "FastAPI", "Django", "Node.js", "Express.js",
          "PostgreSQL", "MongoDB", "MySQL", "Redis", "Docker", "AWS"
        ],
        "benefits": [
          { "title": "Scalability", "desc": "Systems designed to grow with your user base without compromising performance." },
          { "title": "Data Integrity", "desc": "Reliable data storage and management ensuring accuracy and consistency." },
          { "title": "Security", "desc": "Enterprise-grade security to protect sensitive user and business data." }
        ]
      },
      {
        "id": "mobile-development",
        "title": "Mobile Development",
        "description": "Creating native and cross-platform mobile applications with React Native and Flutter, delivering seamless user experiences across iOS and Android devices.",
        "icon": "▫",
        "category": "Development",
        "features": [
          "Cross-Platform Development",
          "Native Module Integration",
          "Offline-First Architecture",
          "Push Notification Systems",
          "App Store Optimization & Deployment"
        ],
        "process": [
          { "title": "Strategy", "desc": "Defining the mobile strategy and platform-specific requirements." },
          { "title": "UI/UX Adaptation", "desc": "Adapting designs for native mobile patterns and gestures." },
          { "title": "Development", "desc": "Building the app using React Native for code reusability and native performance." },
          { "title": "Release", "desc": "Managing the submission and approval process for App Store and Google Play." }
        ],
        "technologies": [
          "React Native", "Expo", "TypeScript", "Redux", "Firebase", "SQLite", "Jest"
        ],
        "benefits": [
          { "title": "Wider Reach", "desc": "Launch on both iOS and Android simultaneously to reach maximum audience." },
          { "title": "Cost Effective", "desc": "Shared codebase reduces development time and maintenance costs." },
          { "title": "Native Performance", "desc": "Smooth, 60fps animations and native look-and-feel." }
        ]
      }
    ]
  },

  projects: (): Project[] => {
    return [
      {
        "id": "adana",
        "title": "Adana",
        "category": "Web Development",
        "description": "A high-performance modern web application built with Next.js, focusing on exceptional user experience, scalability, and clean architecture.",
        "image": "https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1776850023/adana_n83dlc.png",
        "year": "2026",
        "tech": ["Next.js", "TypeScript", "React", "Tailwind CSS"],
        "url": "https://byadana.com",
        "livePreview": "https://byadana.com",
        "challenge": "The project required a scalable architecture and a highly responsive user interface to handle modern web demands while maintaining fast load times.",
        "solution": "Developed a robust frontend using Next.js framework, leveraging server-side rendering and optimal image delivery to ensure top-tier performance.",
        "features": [
          "Server-Side Rendering (SSR)",
          "Static Site Generation (SSG)",
          "Responsive Modern Design",
          "Optimized Core Web Vitals"
        ],
        "metrics": [
          { "label": "Lighthouse Score", "value": "99" },
          { "label": "Page Load Time", "value": "<1s" }
        ],
        "gallery": ["https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1776850023/adana_n83dlc.png"],
        "featured": true
      },
      {
        "id": "rawtype-riot",
        "title": "Rawtype Riot",
        "category": "E-Commerce Development",
        "description": "A bold streetwear e-commerce platform built with Shopify, featuring custom theme development, dynamic product showcases, and seamless checkout experience. Designed to capture the raw energy of street culture with optimal performance and scalability.",
        "image": "https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1770146623/rawtyperiot_hg0kn8.webp",
        "video": "https://res.cloudinary.com/dh0spkwh3/video/upload/q_auto,f_auto/v1770147989/rawtyperiot_e53hke.webm",
        "year": "2026",
        "tech": ["Shopify", "Liquid", "JavaScript", "CSS3", "GraphQL"],
        "url": "https://rawtyperiot.com",
        "livePreview": "https://rawtyperiot.com",
        "challenge": "Rawtype Riot needed a digital storefront that embodied the rebellious spirit of street culture while managing limited edition drops and high-traffic releases. The brand required a platform that could handle flash sales and maintain performance during peak demand without sacrificing the edgy, artistic aesthetic that defines their identity.",
        "solution": "Developed a custom Shopify theme with bold typography and street-inspired design elements. Implemented advanced queue management for product drops, optimized image delivery for high-quality product photography, and created a seamless mobile-first experience that resonates with their urban audience.",
        "features": [
          "Custom Streetwear Theme Design",
          "Limited Edition Drop Management",
          "Queue System for High-Traffic Releases",
          "Mobile-First Responsive Design",
          "Social Media Integration"
        ],
        "metrics": [
          { "label": "Drop Sell-Out Time", "value": "<5 min" },
          { "label": "Mobile Traffic", "value": "82%" }
        ],
        "gallery": ["https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1770146623/rawtyperiot_hg0kn8.webp"],
        "featured": true
      },
      {
        "id": "sonderlab",
        "title": "Sonderlab",
        "category": "E-Commerce Development",
        "description": "A modern e-commerce platform built with Shopify, featuring custom theme development, advanced product filtering, and seamless checkout experience. Designed for scalability and optimal performance.",
        "image": "https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1768698828/sonderlab-project_y86tym.png",
        "video": "https://res.cloudinary.com/dh0spkwh3/video/upload/q_auto,f_auto/v1768708989/sonderlab_w9ag7c.webm",
        "year": "2024",
        "tech": ["Shopify", "Liquid", "JavaScript", "CSS3", "GraphQL"],
        "url": "https://sonderlab.co",
        "livePreview": "https://sonderlab.co",
        "challenge": "Sonderlab needed a distinct digital presence that matched their curated fashion aesthetic while handling complex inventory management and high-volume traffic during drops. The standard Shopify themes were too limiting for their unique brand identity.",
        "solution": "We built a fully custom Shopify storefront using Liquid and React, implementing a bespoke design system that reflects their brand. The backend was optimized for flash sales, ensuring zero downtime during high-traffic events, while the frontend provides a fluid, app-like experience.",
        "features": [
          "Custom Shopify Theme Development",
          "Advanced Product Filtering System",
          "Real-time Inventory Management",
          "Seamless Checkout Integration",
          "Mobile-First Responsive Design"
        ],
        "metrics": [
          { "label": "Traffic Increase", "value": "150%" },
          { "label": "Conversion Rate", "value": "3.2%" }
        ],
        "gallery": ["https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1768698828/sonderlab-project_y86tym.png"],
        "featured": true
      },
      {
        "id": "herotales",
        "title": "Herotales Bedtime Stories",
        "category": "Web Development",
        "description": "An interactive web application for generating and reading personalized bedtime stories for children. Built with Next.js and modern web technologies, featuring AI-powered story generation, beautiful illustrations, and an engaging reading experience.",
        "image": "https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1770144902/Screenshot_2026-02-04_at_01.54.37_z6azmr.png",
        "year": "2026",
        "tech": ["Next.js", "TypeScript", "React", "Tailwind CSS", "AI Integration"],
        "url": "https://herotales.vercel.app",
        "livePreview": "https://herotales.vercel.app",
        "challenge": "Parents needed a convenient way to access engaging, age-appropriate bedtime stories that could be personalized for their children. The challenge was to create a platform that combined storytelling with modern technology while maintaining the warmth and engagement of traditional bedtime reading.",
        "solution": "Developed a Next.js application with AI-powered story generation capabilities. Implemented a user-friendly interface that allows parents to customize story elements, created a library of beautifully designed story templates, and optimized the reading experience for both desktop and mobile devices with consideration for low-light reading environments.",
        "features": [
          "AI-Powered Story Generation",
          "Personalization Options",
          "Beautiful Story Illustrations",
          "Dark Mode for Bedtime",
          "Story Library & Favorites",
          "Responsive Reading Experience"
        ],
        "metrics": [
          { "label": "Stories Generated", "value": "1k+" },
          { "label": "User Satisfaction", "value": "4.8/5" }
        ],
        "gallery": ["https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1770144902/Screenshot_2026-02-04_at_01.54.37_z6azmr.png"],
        "featured": true
      },
      {
        "id": "speakez",
        "title": "Speakez",
        "category": "Web Development",
        "description": "An innovative AI-powered English practice platform that reinvents language learning through real-time conversation. Built with Next.js frontend and Go backend, featuring advanced AI integration for natural voice interactions and personalized learning experiences.",
        "image": "https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1770144566/Screenshot_2026-02-04_at_01.45.46_higp2d.png",
        "year": "2026",
        "tech": ["Next.js", "Go", "AI Integration", "TypeScript", "WebSocket"],
        "url": "https://speakez-fe.vercel.app",
        "livePreview": "https://speakez-fe.vercel.app",
        "challenge": "English learners in Indonesia needed an accessible, judgment-free environment to practice speaking English. Traditional learning methods lacked real-time feedback and personalized conversation practice, making it difficult for learners to improve their fluency and confidence.",
        "solution": "Developed an AI-powered conversation platform using Next.js for a responsive frontend and Go for high-performance backend services. Integrated advanced AI models for natural language processing and real-time voice interaction, creating an immersive learning experience that adapts to each user's proficiency level.",
        "features": [
          "AI-Powered Voice Conversations",
          "Real-time Speech Recognition",
          "Personalized Learning Paths",
          "Progress Tracking Dashboard",
          "Topic-Based Practice Sessions",
          "Pronunciation Feedback"
        ],
        "metrics": [
          { "label": "Active Users", "value": "500+" },
          { "label": "Practice Sessions", "value": "10k+" }
        ],
        "gallery": ["https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1770144566/Screenshot_2026-02-04_at_01.45.46_higp2d.png"],
        "featured": true
      },
      {
        "id": "nawaclo",
        "title": "Nawaclo",
        "category": "E-Commerce Development",
        "description": "Modern e-commerce platform developed with Shopify, featuring custom theme development, advanced product catalog management, and optimized shopping experience. Built with scalable architecture to handle high-volume transactions and seamless customer interactions across all devices.",
        "image": "https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1770146104/Screenshot_2026-02-04_at_02.14.36_vhavvm.png",
        "year": "2024",
        "tech": ["Shopify", "Liquid", "JavaScript", "CSS3", "GraphQL"],
        "url": "https://nawaclo.com",
        "livePreview": "https://nawaclo.com",
        "challenge": "Nawaclo needed to transition from a standard template to a fully custom brand experience that could handle their growing inventory and complex product variations. They required a system that could maintain high performance while showcasing high-resolution product imagery.",
        "solution": "Built a bespoke Shopify theme with a focus on visual storytelling and performance. Implemented lazy loading strategies for images, a custom mega-menu for better navigation, and a streamlined checkout process to reduce cart abandonment.",
        "features": [
          "Custom Mega-Menu Navigation",
          "Advanced Product Filtering",
          "Instagram Feed Integration",
          "Size Recommendation Engine",
          "Automated Email Marketing"
        ],
        "metrics": [
          { "label": "Page Load Speed", "value": "0.8s" },
          { "label": "Sales Growth", "value": "45%" }
        ],
        "gallery": ["https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1770146104/Screenshot_2026-02-04_at_02.14.36_vhavvm.png"],
        "featured": true
      },
      {
        "id": "lakon-indonesia",
        "title": "Lakon Indonesia",
        "category": "E-Commerce Development",
        "description": "E-commerce platform development for Lakon Indonesia, a contemporary Indonesian fashion brand celebrating local culture and craftsmanship. Built with custom Shopify theme featuring curated collections, storytelling elements, and seamless shopping experience that showcases Indonesia's rich textile heritage.",
        "image": "https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1770145241/Screenshot_2026-02-04_at_02.00.10_c7wsi1.png",
        "year": "2024",
        "tech": ["Shopify", "Liquid", "JavaScript", "CSS3", "GraphQL"],
        "url": "https://lakonindonesia.com/",
        "livePreview": "https://lakonindonesia.com/",
        "challenge": "Lakon Indonesia required an e-commerce platform that could tell the story behind each collection while showcasing their made-to-order and upcycled products. The brand needed to communicate their commitment to sustainability and Indonesian craftsmanship, requiring a platform that balanced commercial functionality with rich storytelling.",
        "solution": "Created a custom Shopify theme with dedicated collection story pages, integrated a made-to-order system with custom workflows, and built a visual timeline showcasing the brand's collections throughout the years. Implemented custom product filters for sustainable materials and added a holiday collection system for seasonal drops.",
        "features": [
          "Collection Storytelling Pages",
          "Made-to-Order System",
          "Upcycled Product Showcase",
          "Collection Timeline",
          "Holiday Collection Management",
          "Gift Recommendation Engine"
        ],
        "metrics": [
          { "label": "Brand Engagement", "value": "6m+ avg" },
          { "label": "Return Customers", "value": "42%" }
        ],
        "gallery": ["https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1770145241/Screenshot_2026-02-04_at_02.00.10_c7wsi1.png"],
        "featured": true
      },
      {
        "id": "duma",
        "title": "Duma",
        "category": "E-Commerce Development",
        "description": "E-commerce platform development for Duma, featuring modern Shopify theme with fashion-forward product presentation, comprehensive inventory management, and optimized shopping experience. Built with scalable architecture to handle fashion retail operations and provide seamless customer journey across all devices.",
        "image": "https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1770145443/Screenshot_2026-02-04_at_02.03.40_mazucd.png",
        "year": "2021",
        "tech": ["Shopify", "Liquid", "JavaScript", "CSS3", "GraphQL"],
        "url": "https://dumaofficial.com/",
        "livePreview": "https://dumaofficial.com/",
        "challenge": "Duma required a scalable e-commerce solution to handle their rapid international expansion. They needed a platform that could support multiple languages, currencies, and regional inventory management without compromising performance.",
        "solution": "Implemented a headless Shopify setup using Hydrogen and React to deliver a blazing-fast global storefront. Integrated a PIM system for centralized product management across all regions.",
        "features": [
          "Headless Architecture",
          "Multi-Region Support",
          "PIM Integration",
          "Algolia Search",
          "Automated Returns Portal"
        ],
        "metrics": [
          { "label": "Global Reach", "value": "12 Countries" },
          { "label": "Load Time", "value": "0.5s" }
        ],
        "gallery": ["https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1770145443/Screenshot_2026-02-04_at_02.03.40_mazucd.png"],
        "featured": true
      },
      {
        "id": "combo",
        "title": "Combo",
        "category": "Backend Development",
        "description": "A comprehensive backend development project featuring modern Python technologies for building scalable server-side applications with efficient data management, secure authentication systems, and containerized deployment strategies.",
        "challenge": "The client required a scalable backend infrastructure to support a multi-platform application with real-time data synchronization needs. The system needed to handle concurrent connections efficiently while maintaining data integrity.",
        "solution": "Architected a microservices-ready backend using Python and FastAPI. Implemented Docker containers for consistent deployment across environments and utilized Redis for high-performance caching to reduce database load.",
        "features": [
          "High-Performance API Architecture",
          "JWT Authentication & Authorization",
          "Docker Containerization",
          "Redis Caching Layer",
          "Automated CI/CD Pipelines"
        ],
        "metrics": [
          { "label": "API Latency", "value": "<50ms" },
          { "label": "Uptime", "value": "99.9%" }
        ],
        "image": "https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1770145959/Screenshot_2026-02-04_at_02.12.18_yxp6yy.png",
        "gallery": ["https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1770145959/Screenshot_2026-02-04_at_02.12.18_yxp6yy.png"],
        "year": "2024",
        "tech": ["Python", "FastAPI", "MongoDB", "MySQL", "JWT", "Redis"],
        "url": "https://combo.co.id/",
        "livePreview": "https://combo.co.id/",
        "featured": true
      },
      {
        "id": "base-data-dashboard",
        "title": "Base Data Dashboard",
        "category": "Backend Development",
        "description": "A comprehensive backend system for data management and analytics dashboard. Built with robust authentication, efficient data processing, and scalable architecture to handle complex data operations and real-time reporting.",
        "image": "https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1770146325/Screenshot_2026-02-04_at_02.16.54_xz5lvl.png",
        "year": "2022",
        "tech": ["Python", "FastAPI", "MongoDB", "MySQL", "JWT", "Redis"],
        "url": "https://bdd.ai",
        "challenge": "The client needed to visualize massive datasets from multiple sources in real-time. The existing solution was slow and difficult to navigate, making it hard for stakeholders to make quick data-driven decisions.",
        "solution": "Developed a high-performance dashboard using Python/FastAPI for the backend and React for the frontend. Utilized MongoDB for flexible data storage and Redis for caching frequently accessed data, ensuring sub-second response times.",
        "features": [
          "Real-time Data Visualization",
          "Custom Report Generation",
          "Role-Based Access Control",
          "Data Export Capabilities",
          "Interactive Charts & Graphs"
        ],
        "metrics": [
          { "label": "Data Processing", "value": "1M+ rows/s" },
          { "label": "Query Time", "value": "<200ms" }
        ],
        "gallery": ["https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1770146325/Screenshot_2026-02-04_at_02.16.54_xz5lvl.png"],
        "featured": true
      },
      {
        "id": "hmns",
        "title": "HMNS",
        "category": "E-Commerce Development",
        "description": "E-commerce platform development for HMNS, a premium Indonesian perfumery brand. Features elegant Shopify theme with sophisticated product presentation, fragrance discovery tools, and seamless shopping experience designed to reflect the brand's artistic approach to scent.",
        "image": "https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1770146101/Screenshot_2026-02-04_at_02.13.43_dywr1x.png",
        "year": "2021",
        "tech": ["Shopify", "Liquid", "JavaScript", "CSS3", "GraphQL"],
        "url": "https://madeforhmns.com/",
        "livePreview": "https://madeforhmns.com/",
        "challenge": "HMNS needed a digital presence that could convey the artistry and sensory experience of their perfumes through a screen. The challenge was to create an immersive e-commerce experience that educates customers about fragrance notes while maintaining a clean, luxury aesthetic suitable for a premium perfume brand.",
        "solution": "Built a custom Shopify theme with an emphasis on visual storytelling and sensory language. Implemented a fragrance finder tool that helps customers discover scents based on preferences, integrated a rich content section for fragrance education, and created a smooth, app-like browsing experience with subtle animations that complement the brand's premium positioning.",
        "features": [
          "Custom Fragrance Finder Tool",
          "Rich Content Integration",
          "Scent Profile Visualization",
          "Wishlist & Favorites",
          "Store Locator Integration",
          "Educational Content Hub"
        ],
        "metrics": [
          { "label": "Engagement Rate", "value": "5m+ avg" },
          { "label": "Conversion Rate", "value": "4.1%" }
        ],
        "gallery": ["https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1770146101/Screenshot_2026-02-04_at_02.13.43_dywr1x.png"],
        "featured": true
      },
      {
        "id": "bions-bni",
        "title": "BIONS by BNI",
        "category": "Backend Development",
        "description": "Backend development for BIONS, BNI's integrated business and operational system. Built robust server-side infrastructure to handle enterprise-level banking operations, transaction processing, and data management with high security standards and performance requirements.",
        "image": "https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1770145961/Screenshot_2026-02-04_at_02.11.42_irj1lk.png",
        "year": "2023",
        "tech": ["CodeIgniter 4", "PHP", "MySQL", "Redis", "REST API", "JWT"],
        "url": "https://www.bions.id/",
        "livePreview": "https://www.bions.id/",
        "challenge": "BNI required a scalable backend system that could handle high-volume banking transactions while maintaining strict security protocols and compliance with banking regulations. The system needed to support multiple user roles, real-time data processing, and seamless integration with existing banking infrastructure.",
        "solution": "Developed a robust backend using CodeIgniter 4 with optimized database architecture and caching strategies. Implemented multi-layered security with JWT authentication, role-based access control, and encrypted data transmission. Utilized Redis for session management and high-speed data caching to ensure sub-second response times.",
        "features": [
          "Enterprise Authentication System",
          "Real-time Transaction Processing",
          "Role-Based Access Control",
          "RESTful API Architecture",
          "Advanced Caching with Redis",
          "Secure Data Encryption"
        ],
        "metrics": [
          { "label": "Response Time", "value": "<100ms" },
          { "label": "Concurrent Users", "value": "10k+" }
        ],
        "gallery": ["https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1770145961/Screenshot_2026-02-04_at_02.11.42_irj1lk.png"],
        "featured": true
      },
      {
        "id": "green-rebel-foods",
        "title": "Green Rebel Foods",
        "category": "E-commerce Development",
        "description": "E-commerce platform development for Green Rebel Foods, featuring custom Shopify theme with product variant management, subscription system, and integrated marketing tools.",
        "image": "https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1770146105/Screenshot_2026-02-04_at_02.14.10_s2pdwq.png",
        "year": "2021",
        "tech": ["Shopify", "Liquid", "JavaScript", "CSS3", "React", "GraphQL"],
        "url": "https://greenrebelfoods.com",
        "livePreview": "https://greenrebelfoods.com",
        "challenge": "Green Rebel Foods needed a subscription-first e-commerce platform to drive recurring revenue for their plant-based food products. They also needed to educate customers about the benefits of their products through content integration.",
        "solution": "Developed a Shopify store with deep Recharge integration for seamless subscriptions. Created a custom blog and recipe section that links directly to products, driving content-led commerce.",
        "features": [
          "Subscription Management",
          "Recipe-to-Cart Functionality",
          "Custom Bundle Builder",
          "Loyalty Program Integration",
          "Store Locator"
        ],
        "metrics": [
          { "label": "Subscribers", "value": "2k+" },
          { "label": "Retention Rate", "value": "85%" }
        ],
        "gallery": ["https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1770146105/Screenshot_2026-02-04_at_02.14.10_s2pdwq.png"],
        "featured": true
      },
      {
        "id": "aza-wear",
        "title": "Aza Wear",
        "category": "E-Commerce Development",
        "description": "E-commerce platform development for Aza Wear, featuring modern Shopify theme with fashion-focused product presentation, size and variant management, and seamless shopping experience. Built with scalable architecture to handle fashion inventory and provide elegant customer journey across all devices.",
        "image": "https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1770146328/Screenshot_2026-02-04_at_02.17.10_iwhz9a.png",
        "year": "2020",
        "tech": ["Shopify", "Liquid", "JavaScript", "CSS3", "GraphQL"],
        "url": "https://azawear.com/",
        "livePreview": "https://azawear.com/",
        "challenge": "Aza Wear needed a high-end digital flagship store that reflected their luxury positioning. The challenge was to create an immersive shopping experience that felt like a boutique visit, with high-quality visuals and smooth interactions.",
        "solution": "Designed and developed a premium Shopify theme with a focus on minimalism and typography. Integrated high-resolution video backgrounds, smooth page transitions, and a 'shop the look' feature to increase average order value.",
        "features": [
          "Video-First Design",
          "Shop the Look Functionality",
          "Advanced Size Guide",
          "Wishlist Integration",
          "Multi-Currency Support"
        ],
        "metrics": [
          { "label": "Avg. Session", "value": "4m 30s" },
          { "label": "Mobile Sales", "value": "70%" }
        ],
        "gallery": ["https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1770146328/Screenshot_2026-02-04_at_02.17.10_iwhz9a.png"],
        "featured": true
      },
      {
        "id": "split-bill-app",
        "title": "Split Bill App",
        "category": "Mobile Development",
        "description": "A user-friendly mobile application designed to simplify bill splitting among friends and groups. Features intuitive interface, real-time calculations, and social sharing capabilities.",
        "challenge": "Users needed a simple, intuitive way to split complex bills among friends without the friction of account creation or complicated math. Existing apps were often cluttered or required mandatory sign-ups.",
        "solution": "Developed a lightweight, offline-first mobile web app using React. Focused on a minimal UI that allows bill splitting in seconds. Implemented local storage for data persistence without requiring a backend account system.",
        "features": [
          "OCR Receipt Scanning",
          "Real-time Calculation",
          "Shareable Bill Links",
          "Offline Functionality",
          "Dark Mode Support"
        ],
        "metrics": [
          { "label": "Active Users", "value": "5k+" },
          { "label": "Bills Split", "value": "50k+" }
        ],
        "image": "/split-bill.png",
        "gallery": ["/split-bill.png"],
        "year": "2025",
        "tech": ["Swift", "SwiftUI", "Figma"],
        "url": "https://github.com/jamalakbara/split-bill",
        "featured": true
      },
      {
        "id": "state-medical-equipment",
        "title": "State Medical Equipment",
        "category": "E-Commerce Development",
        "description": "E-commerce platform development for State Medical Equipment, featuring custom Shopify theme with product catalog management, medical equipment specifications, and integrated B2B commerce solutions tailored for healthcare industry needs.",
        "image": "https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1770146328/Screenshot_2026-02-04_at_02.17.46_bjhlid.png",
        "year": "2020",
        "tech": ["Shopify", "Liquid", "JavaScript", "CSS3", "GraphQL"],
        "url": "https://statemedicalequipment.com/",
        "livePreview": "https://statemedicalequipment.com/",
        "challenge": "State Medical Equipment required a B2B-focused e-commerce platform that could handle complex medical specifications, bulk ordering, and strict compliance requirements while remaining user-friendly for hospital procurement teams.",
        "solution": "Created a specialized Shopify Plus store with custom B2B logic. Implemented a request-for-quote system, tiered pricing based on customer groups, and detailed product specification sheets.",
        "features": [
          "B2B Customer Portal",
          "Request for Quote System",
          "Tiered Pricing Logic",
          "Bulk Ordering Tools",
          "Compliance Document Management"
        ],
        "metrics": [
          { "label": "B2B Orders", "value": "+60%" },
          { "label": "Quote Conversion", "value": "28%" }
        ],
        "gallery": ["https://res.cloudinary.com/dh0spkwh3/image/upload/q_auto,f_auto/v1770146328/Screenshot_2026-02-04_at_02.17.46_bjhlid.png"],
        "featured": true
      }
    ]
  },

  featuredProjects: (): Project[] => {
    const projects = getStaticContent.projects()
    return projects.filter(project => project.featured)
  },

  homepageShowcaseProjects: (): Project[] => {
    const projects = getStaticContent.projects()
    const showcaseIds = ['sonderlab', 'combo', 'split-bill-app']
    return projects.filter(project => showcaseIds.includes(project.id))
  },

  about: (): AboutContent => {
    return {
      "heading": {
        "main": "About",
        "subtitle": "Expert Full-Stack Developer & UI/UX Designer in Bandung, Indonesia"
      },
      "description": [
        "Hey! I'm Akbar - just a developer from Bandung who loves turning cool ideas into actual working apps. I spend my days coding, designing, and figuring out how to make things work better.",
        "For the past 5+ years, I've been building websites and apps that actually work well in Indonesia - yeah, dealing with our unpredictable internet and making sure everything runs smoothly even when the connection isn't great.",
        "I'm pretty comfortable with both the creative and technical sides of things. Whether it's making something look awesome or making sure the code doesn't break (usually both), I enjoy figuring stuff out and building things that people actually want to use.",
        "Always up for interesting projects - especially if it's something that can help Indonesian businesses grow or makes life a bit easier for people here."
      ],
      "expertise": {
        "title": "Specialized Skills",
        "areas": [
          {
            "name": "Web Development",
            "technologies": ["Next.js 15", "React.js", "TypeScript", "Node.js", "Tailwind CSS", "Python"],
            "description": "Modern, performant web applications optimized for Indonesian users"
          },
          {
            "name": "Mobile Development",
            "technologies": ["React Native", "Progressive Web Apps", "iOS", "Android"],
            "description": "Cross-platform mobile apps with offline capabilities for Indonesian connectivity"
          },
          {
            "name": "Indonesian Market Integration",
            "technologies": ["Midtrans", "Xendit", "GoPay", "OVO", "Dana", "QRIS"],
            "description": "Seamless integration with Indonesian payment systems"
          },
          {
            "name": "UI/UX Design",
            "technologies": ["Figma", "Adobe Creative Suite", "Design Systems"],
            "description": "User-centered design tailored for Indonesian user behavior and preferences"
          }
        ]
      },
      "indonesianExperience": {
        "title": "Indonesian Market Expertise",
        "description": "Deep understanding of Indonesian digital landscape with extensive experience working with local businesses across various sectors including e-commerce, fintech, education, and healthcare.",
        "achievements": [
          "Successfully delivered 50+ projects for Indonesian clients",
          "Expert in Indonesian payment gateway integrations",
          "Optimized applications for Indonesian internet conditions",
          "Culturally-aware UI/UX design for Indonesian users"
        ]
      },
      "stats": [
        {
          "label": "Projects",
          "value": "50+",
          "description": "Completed projects for Indonesian clients"
        },
        {
          "label": "Clients",
          "value": "25+",
          "description": "Happy Indonesian & Southeast Asian clients"
        },
        {
          "label": "Years",
          "value": "5+",
          "description": "Experience in Indonesian tech industry"
        },
        {
          "label": "Technologies",
          "value": "20+",
          "description": "Modern technologies mastered"
        }
      ],
      "education": {
        "title": "Education & Background",
        "details": "Bachelor of Computer Science from Telkom University, specializing in Software Engineering and Web Technologies. Continuously updating skills with latest frameworks and best practices in web development.",
        "certifications": [
          "AWS Certified Cloud Practitioner",
          "Advanced React & Next.js Development"
        ]
      },
      "location": {
        "title": "Based in Bandung, Indonesia",
        "description": "Available for both remote and on-site projects across Indonesia and Southeast Asia. Deep understanding of local business culture and technical requirements.",
        "serviceAreas": ["Bandung", "Jakarta", "Surabaya", "Yogyakarta", "Remote Indonesia", "Southeast Asia"]
      },
      "profileImage": "/profile-image.png"
    }
  },

  // Comprehensive About content for dedicated /about page
  comprehensiveAbout: (): ComprehensiveAboutContent => {
    return {
      "heading": {
        "main": "About Jamal Akbar Alam",
        "subtitle": "Creative Developer & Designer"
      },
      "professionalSummary": [
        "Hey, I'm Akbar. I'm a developer based in Bandung who loves building things for the web. I've spent the last 5+ years figuring out how to make websites look good and run fast—even when the internet isn't great.",
        "I'm not just about writing code; I care about the whole experience. From the first pixel in the design to the final deploy, I want everything to feel right. I mostly work with React and Next.js, but I'm always picking up new tools to solve whatever problem is in front of me.",
        "At the end of the day, I just want to build cool stuff that works. Whether it's a complex dashboard, an e-commerce site, or a simple landing page, I try to keep it clean, fast, and useful."
      ],
      "expertise": {
        "title": "What I Actually Do",
        "areas": [
          {
            "name": "Full-Stack Web",
            "technologies": ["Next.js", "React", "TypeScript", "Node.js", "Tailwind", "PostgreSQL"],
            "description": "Building full web apps from scratch. Frontend, backend, database—the whole thing.",
            "proficiencyLevel": "Expert",
            "yearsExperience": 5
          },
          {
            "name": "Mobile Apps",
            "technologies": ["React Native", "Expo", "iOS", "Android"],
            "description": "Making apps for phones. I focus on keeping them smooth and usable offline.",
            "proficiencyLevel": "Advanced",
            "yearsExperience": 4
          },
          {
            "name": "Payment Tech",
            "technologies": ["Midtrans", "Xendit", "E-Wallets", "QRIS"],
            "description": "Hooking up payments so companies can actually get paid. I know the local gateways inside out.",
            "proficiencyLevel": "Expert",
            "yearsExperience": 5
          },
          {
            "name": "UI/UX Design",
            "technologies": ["Figma", "Design Systems", "Prototyping"],
            "description": "Designing how it looks and feels. I like things to be simple and easy to use.",
            "proficiencyLevel": "Advanced",
            "yearsExperience": 5
          }
        ]
      },
      "technicalProcess": {
        "title": "My Stack",
        "methodology": [], // Kept empty or removed as we don't display it anymore
        "technologies": {
          "frontend": ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
          "backend": ["Node.js", "Python", "FastAPI", "PostgreSQL", "Supabase"],
          "mobile": ["React Native", "Expo"],
          "database": ["PostgreSQL", "MongoDB", "Redis", "MySQL"],
          "cloud": ["AWS", "Vercel", "Docker"]
        }
      },
      "stats": [
        {
          "label": "Shipped Projects",
          "value": "50+",
          "description": "Real apps in the wild"
        },
        {
          "label": "Happy Clients",
          "value": "25+",
          "description": "People I've helped"
        },
        {
          "label": "Years Coding",
          "value": "5+",
          "description": "and counting"
        },
        {
          "label": "Tech Stack",
          "value": "15+",
          "description": "Tools I use daily"
        }
      ],
      "education": {
        "title": "Background",
        "details": "I studied Computer Science at Telkom University. It gave me a solid foundation in how computers actually work, which helps when debugging weird issues.",
        "certifications": [
          "AWS Certified Cloud Practitioner",
          "Advanced React & Next.js"
        ],
        "continuousLearning": [
          "Building side projects",
          "Reading docs (lots of them)",
          "Exploring new tech"
        ]
      },
      "location": {
        "title": "Where I'm At",
        "description": "Currently based in Bandung, Indonesia. I'm available for remote work or coffee if you're in town.",
        "serviceAreas": ["Bandung", "Remote Worldwide"]
      },
      "contact": {
        "email": "hello-im@jamalakbara.com",
        "phone": "+6281321766565",
        "availability": "Open to interesting projects."
      },
      "profileImage": "/profile-image.png"
    }
  },

  blog: (): BlogContent[] => {
    return [
      {
        "id": "nextjs-15-performance-guide",
        "title": "Next.js 15 Performance Optimization: Complete Guide for Indonesian Developers",
        "slug": "nextjs-15-performance-guide",
        "excerpt": "Learn how to optimize Next.js 15 applications for Indonesian internet conditions and improve Core Web Vitals scores with practical tips and real-world examples.",
        "content": "As a web developer based in Indonesia, I've learned that performance optimization isn't just about implementing best practices—it's about understanding the unique challenges of Indonesian internet infrastructure. In this comprehensive guide, I'll share practical strategies for optimizing Next.js 15 applications specifically for Indonesian users...",
        "category": "Web Development",
        "tags": ["Next.js 15", "Performance Optimization", "Indonesian Developers", "Web Vitals"],
        "publishedAt": "2024-06-15",
        "updatedAt": "2024-06-15",
        "author": "Jamal Akbar Alam",
        "readTime": 8,
        "featured": true,
        "seo": {
          "metaDescription": "Complete guide to optimizing Next.js 15 applications for Indonesian internet conditions. Learn performance tips, Core Web Vitals optimization, and practical strategies for Indonesian web developers.",
          "keywords": ["Next.js 15", "performance optimization", "Indonesian web development", "Core Web Vitals", "web performance Indonesia"],
          "ogImage": "/blog/nextjs-15-performance-guide.jpg"
        },
        "contentBlocks": [
          {
            "type": "heading",
            "level": 2,
            "text": "Understanding Indonesian Internet Challenges"
          },
          {
            "type": "paragraph",
            "text": "Indonesia presents unique challenges for web developers: variable internet speeds across regions, mobile-first usage patterns, and the need for efficient data usage. These factors make performance optimization crucial for user experience and business success."
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Next.js 15 Features for Indonesian Developers"
          },
          {
            "type": "list",
            "items": [
              "Turbopack for faster development builds",
              "Enhanced image optimization with WebP support",
              "Improved bundle splitting strategies",
              "Better server-side rendering performance"
            ]
          },
          {
            "type": "heading",
            "level": 2,
            "text": "Practical Optimization Techniques"
          },
          {
            "type": "code",
            "language": "javascript",
            "code": "// Optimized image component for Indonesian users\nimport Image from 'next/image'\n\nfunction OptimizedProductImage({ src, alt }) {\n  return (\n    <Image\n      src={src}\n      alt={alt}\n      width={400}\n      height={300}\n      priority={false}\n      placeholder=\"blur\"\n      quality={75}\n      sizes=\"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw\"\n    />\n  )\n}"
          }
        ]
      },
      {
        "id": "indonesian-payment-gateway-integration",
        "title": "Complete Guide to Indonesian Payment Gateway Integration",
        "slug": "indonesian-payment-gateway-integration",
        "excerpt": "Step-by-step tutorial on integrating popular Indonesian payment methods like GoPay, OVO, Dana, and Midtrans into your e-commerce applications with secure best practices.",
        "content": "Payment gateway integration is crucial for e-commerce success in Indonesia. With diverse payment preferences ranging from e-wallets to bank transfers, understanding the Indonesian payment ecosystem is essential for developers. In this guide, I'll walk you through integrating the most popular payment methods...",
        "category": "E-Commerce",
        "tags": ["Payment Gateway", "Indonesian E-Commerce", "Midtrans", "GoPay", "OVO"],
        "publishedAt": "2024-05-20",
        "updatedAt": "2024-05-20",
        "author": "Jamal Akbar Alam",
        "readTime": 12,
        "featured": true,
        "seo": {
          "metaDescription": "Learn how to integrate Indonesian payment gateways like Midtrans, GoPay, OVO, and Dana into your e-commerce applications. Complete tutorial with code examples and best practices.",
          "keywords": ["Indonesian payment gateway", "Midtrans integration", "GoPay API", "OVO payment", "e-commerce Indonesia"],
          "ogImage": "/blog/indonesian-payment-gateway.jpg"
        }
      },
      {
        "id": "react-native-indonesia-optimization",
        "title": "Building Mobile Apps for Indonesian Users: React Native Optimization Guide",
        "slug": "react-native-indonesia-optimization",
        "excerpt": "Optimize React Native applications for Indonesian users with offline capabilities, data compression, and performance tuning for varying network conditions across Indonesia.",
        "content": "Mobile app development in Indonesia requires special consideration for network conditions, device diversity, and user behavior patterns. Having built several mobile applications for the Indonesian market, I've compiled essential optimization strategies...",
        "category": "Mobile Development",
        "tags": ["React Native", "Mobile Development", "Indonesian Market", "Performance", "Offline-First"],
        "publishedAt": "2024-04-10",
        "updatedAt": "2024-04-10",
        "author": "Jamal Akbar Alam",
        "readTime": 10,
        "featured": false,
        "seo": {
          "metaDescription": "Optimize React Native apps for Indonesian users. Learn offline-first strategies, data compression techniques, and performance tuning for Indonesian mobile app development.",
          "keywords": ["React Native Indonesia", "mobile app optimization", "Indonesian users", "offline-first apps", "mobile development"],
          "ogImage": "/blog/react-native-optimization.jpg"
        }
      },
      {
        "id": "web-accessibility-indonesia",
        "title": "Web Accessibility in Indonesia: Building Inclusive Digital Experiences",
        "slug": "web-accessibility-indonesia",
        "excerpt": "Understanding and implementing web accessibility standards for Indonesian users, including language considerations, screen reader support, and inclusive design principles.",
        "content": "Web accessibility is often overlooked in Indonesian digital products, yet it's crucial for creating inclusive experiences. With Indonesia's diverse population and varying levels of digital literacy, accessibility becomes even more important...",
        "category": "UI/UX Design",
        "tags": ["Accessibility", "Inclusive Design", "Indonesian Users", "WCAG", "Screen Readers"],
        "publishedAt": "2024-03-15",
        "updatedAt": "2024-03-15",
        "author": "Jamal Akbar Alam",
        "readTime": 7,
        "featured": false,
        "seo": {
          "metaDescription": "Learn web accessibility best practices for Indonesian users. Implement WCAG standards, screen reader support, and inclusive design for Indonesian digital products.",
          "keywords": ["web accessibility Indonesia", "inclusive design", "WCAG compliance", "Indonesian users", "screen reader support"],
          "ogImage": "/blog/web-accessibility.jpg"
        }
      },
      {
        "id": "typescript-best-practices-2024",
        "title": "TypeScript Best Practices 2024: Enterprise-Ready Code for Indonesian Developers",
        "slug": "typescript-best-practices-2024",
        "excerpt": "Advanced TypeScript patterns and best practices for building scalable, maintainable applications. Perfect for Indonesian development teams looking to improve code quality.",
        "content": "TypeScript has become essential for large-scale application development, but many Indonesian development teams still struggle with implementing it effectively. Drawing from my experience working with Indonesian enterprise clients, here are the best practices that have proven most valuable...",
        "category": "Programming",
        "tags": ["TypeScript", "Best Practices", "Enterprise Development", "Code Quality", "Indonesian Developers"],
        "publishedAt": "2024-01-20",
        "updatedAt": "2024-01-20",
        "author": "Jamal Akbar Alam",
        "readTime": 9,
        "featured": false,
        "seo": {
          "metaDescription": "TypeScript best practices for Indonesian developers. Learn advanced patterns, enterprise development strategies, and code quality improvement techniques.",
          "keywords": ["TypeScript best practices", "Indonesian developers", "enterprise code", "TypeScript patterns", "code quality"],
          "ogImage": "/blog/typescript-best-practices.jpg"
        }
      }
    ]
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
