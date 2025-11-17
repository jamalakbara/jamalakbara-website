import { Metadata } from 'next'
import { getStaticContent } from '@/lib/content-manager'

interface ServicePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { id } = await params
  const service = getStaticContent.services().find(s => s.id === id)

  if (!service) {
    return {
      title: 'Service Not Found',
    }
  }

  const serviceCategory = service.category || 'Professional Services'

  return {
    title: `${service.title} - ${serviceCategory} Services | jamalakbara.`,
    description: `${service.description} Professional ${serviceCategory.toLowerCase()} services in Bandung, Indonesia with 5+ years of experience.`,
    keywords: `${service.title}, ${serviceCategory}, ${serviceCategory.toLowerCase()} services, Bandung, Indonesia, web development, freelance, professional services`,
    openGraph: {
      title: `${service.title} - ${serviceCategory} Services | jamalakbara.`,
      description: `${service.description} Expert ${serviceCategory.toLowerCase()} services delivered in Bandung, Indonesia.`,
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: `${service.title} - ${serviceCategory} Services by Jamal Akbar`,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${service.title} - ${serviceCategory} Services | jamalakbara.`,
      description: `${service.description} Expert ${serviceCategory.toLowerCase()} services delivered in Bandung, Indonesia.`,
      images: ['/logo.png'],
      creator: '@jamalakbara',
      site: '@jamalakbara',
    },
    alternates: {
      canonical: `https://jamalakbara.com/service/${service.id}`,
    },
  }
}