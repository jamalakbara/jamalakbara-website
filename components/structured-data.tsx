'use client'

interface StructuredDataProps {
  type: 'Person' | 'Project' | 'Service' | 'LocalBusiness'
  data?: ProjectData | ServiceData
}

interface ProjectData {
  id: number
  title: string
  description: string
  image: string
  year: string
  category: string
  tech: string[]
  url?: string
  livePreview?: string
}

interface ServiceData {
  id: string
  title: string
  description: string
  category?: string
  icon: string
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const generatePersonStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Jamal Akbar Alam",
      "url": "https://jamalakbara.com",
      "image": "https://jamalakbara.com/profile-image.png",
      "sameAs": [
        "https://github.com/jamalakbara",
        "https://linkedin.com/in/jamalakbara",
        "https://twitter.com/jamalakbara",
        "https://facebook.com/jamalakbara",
        "https://instagram.com/jamalakbara",
      ],
      "jobTitle": "Creative Developer & Designer",
      "worksFor": {
        "@type": "Organization",
        "name": "jamalakbara."
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Bandung",
        "addressCountry": "Indonesia"
      },
      "email": "hello-im@jamalakbara.com",
      "description": "Expert creative developer and designer specializing in modern web development, UI/UX design, and brand strategy with 5+ years of experience.",
      "knowsAbout": [
        "Web Development",
        "UI/UX Design",
        "Frontend Development",
        "Backend Development",
        "Python Development",
        "React Development",
        "Next.js Development",
        "Shopify Development",
        "Brand Strategy",
        "Creative Direction"
      ],
      "hasOccupation": {
        "@type": "Occupation",
        "name": "Creative Developer & Designer",
        "occupationLocation": {
          "@type": "Place",
          "name": "Bandung, Indonesia"
        },
        "description": "Specializes in creating exceptional digital experiences through modern web development and creative design."
      }
    }
  }

  const generateProjectStructuredData = (project: ProjectData) => {
    return {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": project.title,
      "description": project.description,
      "url": project.url || `https://jamalakbara.com/project/${project.id}`,
      "image": project.image,
      "dateCreated": project.year,
      "creator": {
        "@type": "Person",
        "name": "Jamal Akbar Alam",
        "url": "https://jamalakbara.com"
      },
      "genre": project.category,
      "keywords": project.tech.join(", "),
      "about": {
        "@type": "Thing",
        "name": project.category
      },
      "applicationSubCategory": project.category,
      "isAccessibleForFree": true,
      "inLanguage": "en",
      "mainEntity": {
        "@type": "WebPage",
        "name": `${project.title} - Jamal Akbar Alam Portfolio`,
        "description": project.description
      }
    }
  }

  const generateServiceStructuredData = (service: ServiceData) => {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": service.title,
      "description": service.description,
      "url": `https://jamalakbara.com/service/${service.id}`,
      "provider": {
        "@type": "Person",
        "name": "Jamal Akbar Alam",
        "url": "https://jamalakbara.com"
      },
      "serviceType": service.category || 'Professional Services',
      "areaServed": {
        "@type": "Place",
        "name": "Bandung, Indonesia"
      },
      "availableChannel": {
        "@type": "ServiceChannel",
        "serviceUrl": "https://jamalakbara.com"
      },
      "offers": {
        "@type": "Offer",
        "availability": "https://schema.org/InStock"
      },
      "termsOfService": "https://jamalakbara.com/terms"
    }
  }

  const generateLocalBusinessStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "jamalakbara.",
      "alternateName": "Jamal Akbar Alam Creative Development",
      "description": "Expert creative development services specializing in web development, mobile development, backend development, and UI/UX design.",
      "url": "https://jamalakbara.com",
      "telephone": "+6281321766565",
      "email": "hello-im@jamalakbara.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Bandung",
        "addressLocality": "Bandung",
        "addressRegion": "West Java",
        "addressCountry": "Indonesia",
        "postalCode": "40291"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -6.925810544483773,
        "longitude": 107.66517761280582
      },
      "category": "Web Development Services",
      "services": [
        "Web Development",
        "Mobile Development",
        "Backend Development",
        "UI/UX Design",
        "Frontend Development",
        "Python Development",
        "React Development",
        "Next.js Development",
        "Shopify Development"
      ],
      "areaServed": {
        "@type": "Place",
        "name": ["Bandung", "Jakarta", "Surabaya", "Indonesia", "Southeast Asia"]
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Development Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Web Development",
              "description": "Custom web application development using modern technologies"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Mobile Development",
              "description": "Native and cross-platform mobile app development"
            }
          }
        ]
      },
      "openingHours": "Mo-Su 00:00-23:59",
      "availableChannel": {
        "@type": "ServiceChannel",
        "serviceUrl": "https://jamalakbara.com",
        "servicePhone": "+6281321766565"
      }
    }
  }

  const getStructuredData = () => {
    switch (type) {
      case 'Person':
        return generatePersonStructuredData()
      case 'Project':
        return data && 'image' in data ? generateProjectStructuredData(data) : null
      case 'Service':
        return data && 'icon' in data ? generateServiceStructuredData(data) : null
      case 'LocalBusiness':
        return generateLocalBusinessStructuredData()
      default:
        return null
    }
  }

  const structuredData = getStructuredData()

  if (!structuredData) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}