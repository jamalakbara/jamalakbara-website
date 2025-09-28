import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getStaticContent } from '@/lib/content-manager'
import { StructuredData } from '@/components/structured-data'
import { Metadata } from 'next'

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params
  const project = getStaticContent.projects().find(p => p.id === parseInt(id))

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: `${project.title} | jamalakbara.`,
    description: project.description,
    keywords: project.tech.join(', '),
    openGraph: {
      title: `${project.title} | jamalakbara.`,
      description: project.description,
      images: [
        {
          url: project.image,
          width: 1200,
          height: 630,
          alt: project.title,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | jamalakbara.`,
      description: project.description,
      images: [project.image],
    }
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  const project = getStaticContent.projects().find(p => p.id === parseInt(id))

  if (!project) {
    notFound()
  }

  return (
    <>
      <StructuredData type="Project" data={project} />

      <article className="min-h-screen bg-white dark:bg-black">
        {/* Header */}
        <header className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="relative z-10 text-center text-white px-6">
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
              {project.title}
            </h1>
            <p className="text-xl md:text-2xl font-mono mb-8 opacity-90">
              {project.category}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex gap-6 justify-center">
              {project.livePreview && (
                <a
                  href={project.livePreview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-white text-black font-mono text-sm tracking-wider hover:bg-gray-200 transition-colors"
                >
                  VIEW LIVE
                </a>
              )}
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 border border-white text-white font-mono text-sm tracking-wider hover:bg-white hover:text-black transition-colors"
              >
                VIEW PROJECT
              </a>
            </div>
          </div>

          <Link
            href="/#work"
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </Link>
        </header>

        {/* Content */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-3xl font-serif font-bold mb-6 text-black dark:text-white">
                    Project Overview
                  </h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-serif font-bold mb-4 text-black dark:text-white">
                    Technologies Used
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {project.tech.map((tech) => (
                      <div
                        key={tech}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-400 transition-colors"
                      >
                        <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
                          {tech}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-serif font-bold mb-4 text-black dark:text-white">
                    Project Details
                  </h3>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="font-mono">Year</span>
                      <span>{project.year}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="font-mono">Category</span>
                      <span>{project.category}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-mono">Status</span>
                      <span className="text-green-600">Completed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                <div className="p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-serif font-bold mb-4 text-black dark:text-white">
                    Quick Links
                  </h3>
                  <div className="space-y-3">
                    {project.livePreview && (
                      <a
                        href={project.livePreview}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center px-4 py-3 bg-black text-white font-mono text-sm hover:bg-gray-800 transition-colors"
                      >
                        Live Preview
                      </a>
                    )}
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center px-4 py-3 border border-black text-black font-mono text-sm hover:bg-black hover:text-white transition-colors"
                    >
                      Project Details
                    </a>
                    <Link
                      href="/#work"
                      className="block w-full text-center px-4 py-3 border border-gray-300 text-gray-700 font-mono text-sm hover:border-gray-400 transition-colors"
                    >
                      Back to Projects
                    </Link>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-serif font-bold mb-4 text-black dark:text-white">
                    Share Project
                  </h3>
                  <div className="flex gap-3">
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://jamalakbara.com/project/${project.id}`)}&text=${encodeURIComponent(`Check out ${project.title} by @jamalakbara`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-3 py-2 bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors"
                    >
                      Twitter
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://jamalakbara.com/project/${project.id}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-3 py-2 bg-blue-700 text-white text-sm hover:bg-blue-800 transition-colors"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Projects */}
            <div className="mt-20 pt-20 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-serif font-bold mb-8 text-black dark:text-white">
                More Projects
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {getStaticContent.projects()
                  .filter(p => p.id !== project.id && p.featured)
                  .slice(0, 2)
                  .map((relatedProject) => (
                    <Link
                      key={relatedProject.id}
                      href={`/project/${relatedProject.id}`}
                      className="group block"
                    >
                      <div className="relative aspect-video overflow-hidden mb-4">
                        <Image
                          src={relatedProject.image}
                          alt={relatedProject.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      </div>
                      <h4 className="text-xl font-serif font-bold text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                        {relatedProject.title}
                      </h4>
                      <p className="text-sm font-mono text-gray-600 dark:text-gray-400 mt-1">
                        {relatedProject.category} • {relatedProject.year}
                      </p>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </article>
    </>
  )
}