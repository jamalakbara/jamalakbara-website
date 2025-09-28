import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getStaticContent } from '@/lib/content-manager'
import { StructuredData } from '@/components/structured-data'
import { Metadata } from 'next'

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

  return {
    title: `${service.title} | jamalakbara.`,
    description: service.description,
    keywords: `${service.title}, ${service.category}, creative services, web development, design`,
    openGraph: {
      title: `${service.title} | jamalakbara.`,
      description: service.description,
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: service.title,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${service.title} | jamalakbara.`,
      description: service.description,
      images: ['/logo.png'],
    }
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { id } = await params
  const service = getStaticContent.services().find(s => s.id === id)

  if (!service) {
    notFound()
  }

  const relatedProjects = getStaticContent.projects().filter(project =>
    project.category.toLowerCase().includes(service.category?.toLowerCase() || '') ||
    project.tech.some(tech =>
      tech.toLowerCase().includes(service.title.toLowerCase())
    )
  )

  return (
    <>
      <StructuredData type="Service" data={service} />

      <article className="min-h-screen bg-white dark:bg-black">
        {/* Header */}
        <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-700" />

          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <div className="text-6xl md:text-8xl font-serif font-bold mb-8 text-black dark:text-white">
              {service.icon}
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-black dark:text-white">
              {service.title}
            </h1>
            <p className="text-xl md:text-2xl font-mono mb-8 text-gray-700 dark:text-gray-300">
              {service.category}
            </p>
            <div className="w-24 h-1 bg-black dark:bg-white mx-auto mb-8" />
          </div>

          <Link
            href="/#services"
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
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
              <div className="lg:col-span-2 space-y-12">
                <div>
                  <h2 className="text-3xl font-serif font-bold mb-6 text-black dark:text-white">
                    About This Service
                  </h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-serif font-bold mb-6 text-black dark:text-white">
                    What I Deliver
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <h4 className="font-serif font-bold text-lg mb-3 text-black dark:text-white">
                        Strategic Planning
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        Comprehensive planning and strategy development tailored to your specific needs and goals.
                      </p>
                    </div>
                    <div className="p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <h4 className="font-serif font-bold text-lg mb-3 text-black dark:text-white">
                        Expert Execution
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        Professional implementation using industry best practices and cutting-edge technologies.
                      </p>
                    </div>
                    <div className="p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <h4 className="font-serif font-bold text-lg mb-3 text-black dark:text-white">
                        Quality Assurance
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        Rigorous testing and quality control to ensure exceptional results and performance.
                      </p>
                    </div>
                    <div className="p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <h4 className="font-serif font-bold text-lg mb-3 text-black dark:text-white">
                        Ongoing Support
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        Continuous support and maintenance to keep your project running smoothly.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-serif font-bold mb-6 text-black dark:text-white">
                    Technologies & Tools
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-900 p-8 border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {getTechnologiesForService(service.id).map((tech) => (
                        <div
                          key={tech}
                          className="text-center p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg"
                        >
                          <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
                            {tech}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-serif font-bold mb-6 text-black dark:text-white">
                    Process Overview
                  </h3>
                  <div className="space-y-6">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-lg mb-2 text-black dark:text-white">
                          Discovery & Planning
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          Understanding your requirements, goals, and target audience to create a comprehensive project plan.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-lg mb-2 text-black dark:text-white">
                          Design & Development
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          Creating the solution with attention to detail, user experience, and technical excellence.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-lg mb-2 text-black dark:text-white">
                          Testing & Refinement
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          Rigorous testing and iterations to ensure the highest quality and performance standards.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-bold">
                        4
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-lg mb-2 text-black dark:text-white">
                          Launch & Support
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          Successful deployment and ongoing support to ensure long-term success.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                <div className="p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-serif font-bold mb-4 text-black dark:text-white">
                    Service Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="font-mono">Category</span>
                      <span>{service.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="font-mono">Timeline</span>
                      <span>2-8 weeks</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-mono">Starting From</span>
                      <span className="text-green-600 font-bold">Contact</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-serif font-bold mb-4 text-black dark:text-white">
                    Get Started
                  </h3>
                  <div className="space-y-3">
                    <Link
                      href="/#contact"
                      className="block w-full text-center px-4 py-3 bg-black text-white font-mono text-sm hover:bg-gray-800 transition-colors"
                    >
                      Request Quote
                    </Link>
                    <Link
                      href="/#services"
                      className="block w-full text-center px-4 py-3 border border-gray-300 text-gray-700 font-mono text-sm hover:border-gray-400 transition-colors"
                    >
                      View All Services
                    </Link>
                  </div>
                </div>

                <div className="p-6 bg-black text-white">
                  <h3 className="text-xl font-serif font-bold mb-4">
                    Let&apos;s Work Together
                  </h3>
                  <p className="text-sm mb-4 opacity-90">
                    Ready to bring your vision to life? Let&apos;s discuss your project requirements.
                  </p>
                  <Link
                    href="/#contact"
                    className="block w-full text-center px-4 py-3 bg-white text-black font-mono text-sm hover:bg-gray-200 transition-colors"
                  >
                    Start Project
                  </Link>
                </div>
              </div>
            </div>

            {/* Related Projects */}
            {relatedProjects.length > 0 && (
              <div className="mt-20 pt-20 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-serif font-bold mb-8 text-black dark:text-white">
                  Related Projects
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {relatedProjects.slice(0, 2).map((project) => (
                    <Link
                      key={project.id}
                      href={`/project/${project.id}`}
                      className="group block"
                    >
                      <div className="relative aspect-video overflow-hidden mb-4">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      </div>
                      <h4 className="text-xl font-serif font-bold text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                        {project.title}
                      </h4>
                      <p className="text-sm font-mono text-gray-600 dark:text-gray-400 mt-1">
                        {project.category} • {project.year}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Other Services */}
            <div className="mt-20 pt-20 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-serif font-bold mb-8 text-black dark:text-white">
                Other Services
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getStaticContent.services()
                  .filter(s => s.id !== service.id)
                  .map((otherService) => (
                    <Link
                      key={otherService.id}
                      href={`/service/${otherService.id}`}
                      className="group p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-gray-400 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-2xl">{otherService.icon}</div>
                        <div>
                          <h4 className="font-serif font-bold text-lg text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                            {otherService.title}
                          </h4>
                          <p className="text-sm font-mono text-gray-600 dark:text-gray-400 mt-1">
                            {otherService.category}
                          </p>
                        </div>
                      </div>
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

// Helper function to get technologies for each service
function getTechnologiesForService(serviceId: string): string[] {
  const technologies: Record<string, string[]> = {
    'ui-ux-design': [
      'Figma', 'Adobe XD', 'Sketch', 'Principle', 'InVision', 'Photoshop', 'Illustrator'
    ],
    'frontend-development': [
      'React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Styled Components', 'Redux', 'Vue.js'
    ],
    'brand-strategy': [
      'Adobe Creative Suite', 'Figma', 'Brand Guidelines', 'Market Research', 'Competitor Analysis'
    ],
    'creative-direction': [
      'Creative Strategy', 'Art Direction', 'Design Systems', 'Team Leadership', 'Project Management'
    ]
  }

  return technologies[serviceId] || []
}