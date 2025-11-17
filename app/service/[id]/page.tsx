'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getStaticContent } from '@/lib/content-manager'
import { StructuredData } from '@/components/structured-data'
import { CustomCursor } from '@/components/custom-cursor'
import { LoadingScreen } from '@/components/loading-screen'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface ServicePageProps {
  params: Promise<{ id: string }>
}

export default function ServicePage({ params }: ServicePageProps) {
  const [service, setService] = useState<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  const [error, setError] = useState<string | null>(null)
  const [showLoadingScreen, setShowLoadingScreen] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showStatus, setShowStatus] = useState(false)
  const formRef = React.useRef<HTMLFormElement>(null)

  // Formspree form endpoint from environment variables
  const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || 'https://formspree.io/f/xjkbvlqd'

  useEffect(() => {
    async function loadService() {
      try {
        const { id } = await params
        const foundService = getStaticContent.services().find(s => s.id === id)
        if (foundService) {
          setService(foundService)
        } else {
          setError('Service not found')
        }
      } catch {
        setError('Error loading service')
      } finally {
        // Add a small delay to show loading screen for better UX
        setTimeout(() => setShowLoadingScreen(false), 300)
      }
    }

    loadService()
  }, [params])

  if (showLoadingScreen) {
    return (
      <>
        <CustomCursor />
        <LoadingScreen onLoadingComplete={() => {}} />
      </>
    )
  }

  if (error || !service) {
    notFound()
  }

  const relatedProjects = getStaticContent.projects().filter(project =>
    project.category.toLowerCase().includes(service.category?.toLowerCase() || '') ||
    project.tech.some(tech =>
      tech.toLowerCase().includes(service.title.toLowerCase())
    )
  )

  const siteConfig = getStaticContent.siteConfig()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const formData = new FormData(event.currentTarget)

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        setSubmitStatus('success')
        setIsModalOpen(false)

        // Show success message briefly
        setShowStatus(true)
        setTimeout(() => {
          setShowStatus(false)
        }, 3000)

        // Reset form using ref
        if (formRef.current) {
          formRef.current.reset()
        }
      } else {
        throw new Error('Form submission failed')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
      setShowStatus(true)
      setTimeout(() => {
        setShowStatus(false)
      }, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <StructuredData type="Service" data={service} />
      <CustomCursor />

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

          <motion.button
            onClick={() => {
              const nextSection = document.querySelector('section')
              if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            whileHover={{
              scale: 1.1,
              color: "#000",
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
            whileTap={{
              scale: 0.9,
              transition: { duration: 0.1 }
            }}
            animate={{
              y: [0, 8, 0],
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <motion.svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{
                y: [0, 3, 0],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </motion.svg>
          </motion.button>
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
                  <h3 className="text-2xl font-serif font-bold mb-4 text-black dark:text-white">
                    Technologies Used
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {getTechnologiesForService(service.id).map((tech) => (
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
                    <a
                      href={`https://wa.me/${(siteConfig.contact?.phone || '+6281321766565').replace(/\D/g, '')}?text=${encodeURIComponent(`Hi! I'm interested in your ${service.title} service. Can you provide more information about pricing and availability?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center px-4 py-3 bg-black text-white font-mono text-sm hover:bg-gray-800 transition-colors"
                    >
                      Request Quote
                    </a>
                    <Link
                      href="/"
                      className="block w-full text-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-mono text-sm hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
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
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="block w-full text-center px-4 py-3 bg-white text-black font-mono text-sm hover:bg-gray-200 transition-colors"
                  >
                    Start Project
                  </button>
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
                          alt={`${project.title} - ${project.category} project by Jamal Akbar, showcasing ${project.tech.slice(0, 2).join(', ')} technologies`}
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

      {/* Success/Error Status Messages */}
      {showStatus && (
        <div className={`fixed top-8 right-8 z-[10000] p-4 rounded-lg shadow-lg max-w-sm ${
          submitStatus === 'success'
            ? 'bg-green-100 border-2 border-green-500 text-green-800'
            : 'bg-red-100 border-2 border-red-500 text-red-800'
        }`}>
          {submitStatus === 'success' ? (
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 00016 0zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 01-1.414 1.414l2 2a1 1 0 001.414 0l-4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Thank you! I&apos;ll get back to you soon.</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <div className="font-medium">Something went wrong.</div>
                <div className="text-sm opacity-75">Please try again or email me directly.</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contact Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] z-[9999] transition-colors duration-300">
          <div className="mb-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif font-bold text-black dark:text-white transition-colors duration-300">
                Let&apos;s Start Something Great
              </DialogTitle>
            </DialogHeader>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="form_name" value={`Service Inquiry - ${service.title}`} />
              <input type="hidden" name="_subject" value={`New ${service.title} Service Request from Portfolio`} />
              <input type="hidden" name="service" value={service.title} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-sans font-medium text-black dark:text-white mb-2">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    className="border-2 border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white bg-white dark:bg-gray-800 text-black dark:text-white"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-sans font-medium text-black dark:text-white mb-2">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    className="border-2 border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white bg-white dark:bg-gray-800 text-black dark:text-white"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-sans font-medium text-black dark:text-white mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="border-2 border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white bg-white dark:bg-gray-800 text-black dark:text-white"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="projectDetails" className="block text-sm font-sans font-medium text-black dark:text-white mb-2">
                  Project Details
                </label>
                <Textarea
                  id="projectDetails"
                  name="projectDetails"
                  className="border-2 border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white bg-white dark:bg-gray-800 text-black dark:text-white min-h-[120px]"
                  placeholder={`Tell me about your ${service.title} project... What are your goals? Timeline? Budget considerations?`}
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-black text-white hover:bg-gray-800 font-sans font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-0V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white font-sans font-medium"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
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
      'React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Styled Components', 'Redux', 'Zustand'
    ],
    'backend-development': [
      'Python', 'FastAPI', 'Django', 'Node.js', 'Express.js',
      'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'SQLite', 'Supabase',
      'REST API', 'GraphQL', 'JWT Authentication', 'OAuth 2.0', 'WebSockets',
      'Docker', 'AWS', 'Vercel', 'Heroku',
      'Git', 'GitHub', 'GitLab', 'CI/CD', 'Testing', 'Unit Tests', 'Integration Tests'
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