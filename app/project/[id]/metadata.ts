import { Metadata } from 'next'
import { getStaticContent } from '@/lib/content-manager'

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params
  const project = getStaticContent.projects().find(p => p.id === id)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: `${project.title} - ${project.category} | jamalakbara.`,
    description: `${project.description} Built with ${project.tech.slice(0, 3).join(', ')} technologies. Completed in ${project.year}.`,
    keywords: project.tech.join(', ') + `, ${project.category.toLowerCase()}, ${project.year}, web development, portfolio project`,
    openGraph: {
      title: `${project.title} - ${project.category} | jamalakbara.`,
      description: `${project.description} Built with ${project.tech.slice(0, 3).join(', ')} technologies.`,
      images: [
        {
          url: project.image,
          width: 1200,
          height: 630,
          alt: `${project.title} - ${project.category} project by Jamal Akbar`,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} - ${project.category} | jamalakbara.`,
      description: `${project.description} Built with ${project.tech.slice(0, 3).join(', ')} technologies.`,
      images: [project.image],
      creator: '@jamalakbara',
      site: '@jamalakbara',
    },
    alternates: {
      canonical: `https://jamalakbara.com/project/${project.id}`,
    },
  }
}