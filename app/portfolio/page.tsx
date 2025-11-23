'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { getStaticContent } from '@/lib/content-manager'
import { StructuredData } from '@/components/structured-data'
import { CustomCursor } from '@/components/custom-cursor'
import { Navigation } from '@/components/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function PortfolioPage() {
  const projects = getStaticContent.projects()
  const services = getStaticContent.services()
  const siteConfig = getStaticContent.siteConfig()
  const ref = useRef(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)
  const isInView = useInView(ref, { once: false, margin: "-100px" })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showStatus, setShowStatus] = useState(false)

  // Formspree form endpoint
  const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || 'https://formspree.io/f/xjkbvlqd'

  const [selectedCategory, setSelectedCategory] = useState('all')

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

  // Filter projects based on selected category
  const filteredProjects = projects.filter(project => {
    if (selectedCategory === 'all') return true
    if (selectedCategory === 'Web Development') {
      return project.category.includes('E-Commerce') || project.category.includes('Backend') || project.category.includes('Development')
    }
    if (selectedCategory === 'UI/UX Design') {
      return project.category.includes('Design') || project.category.includes('UI')
    }
    if (selectedCategory === 'Mobile Development') {
      return project.category.includes('Mobile')
    }
    return true
  })

  const categories = [
    { name: 'All Projects', value: 'all' },
    { name: 'Web Development', value: 'Web Development' },
    { name: 'UI/UX Design', value: 'UI/UX Design' },
    { name: 'Mobile Development', value: 'Mobile Development' }
  ]

  // Trigger initial animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true)
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 60,
        damping: 20,
        duration: 0.6,
      },
    },
  }

  return (
    <>
      <CustomCursor />
      <Navigation />
      <StructuredData type="WebSite" />
      <StructuredData type="Person" />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Portfolio Header */}
        <motion.section
          className="py-32 px-6"
          ref={ref}
          initial="hidden"
          animate={(isInView || hasAnimated) ? "visible" : "hidden"}
        >
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1
              className="text-5xl md:text-6xl font-serif font-bold text-black dark:text-white mb-6"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    ease: "easeOut"
                  }
                }
              }}
            >
              Portfolio Showcase
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 dark:text-gray-400 font-sans max-w-3xl mx-auto"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    delay: 0.2,
                    ease: "easeOut"
                  }
                }
              }}
            >
              Welcome to the complete portfolio of Jamal Akbar Alam. Discover innovative web development projects,
              creative UI/UX designs, and cutting-edge digital solutions that demonstrate expertise in modern
              technologies and strategic thinking.
            </motion.p>
          </div>
        </motion.section>

        {/* Filter Categories */}
        <motion.section
          className="py-12 px-6 border-b border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {categories.map((category) => (
                <motion.button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                  whileHover={{
                    scale: 1.05,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  whileTap={{
                    scale: 0.95,
                    transition: { duration: 0.1 }
                  }}
                  className={`px-6 py-2 rounded-full font-mono text-sm transition-colors duration-300 ${selectedCategory === category.value
                    ? 'bg-black text-white'
                    : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-black hover:text-white'
                    }`}
                >
                  {category.name}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Projects Grid */}
        <motion.section
          className="py-32 px-6"
          ref={ref}
          initial="hidden"
          animate={(isInView || hasAnimated) ? "visible" : "hidden"}
        >
          <div className="max-w-7xl mx-auto">
            {filteredProjects.length > 0 ? (
              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredProjects.map((project) => (
                  <Link href={`/project/${project.id}`} key={project.id}>
                    <motion.div
                      variants={cardVariants}
                      whileHover={{
                        y: -10,
                        transition: { type: "spring" as const, stiffness: 400, damping: 25 }
                      }}
                      className="group relative cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-0 h-full transition-all duration-300 hover:border-black dark:hover:border-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
                    >
                      {/* Project Image */}
                      <div className="aspect-video relative overflow-hidden">
                        <div
                          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url(${project.image})` }}
                          role="img"
                          aria-label={`${project.title} - Portfolio project by Jamal Akbar Alam in ${project.category}`}
                        />
                      </div>

                      {/* Project Content */}
                      <div className="p-6">
                        {/* Category & Year */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-sm font-mono text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            {project.category}
                          </span>
                          <div className="w-12 h-px bg-gray-300 dark:bg-gray-600" />
                          <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                            {project.year}
                          </span>
                        </div>

                        {/* Title */}
                        <motion.h3
                          className="text-xl font-serif font-bold text-black dark:text-white mb-4 transition-colors duration-300 group-hover:text-black dark:group-hover:text-white"
                        >
                          {project.title}
                        </motion.h3>

                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-400 font-sans text-base leading-relaxed mb-6 line-clamp-3">
                          {project.description}
                        </p>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tech.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-mono transition-colors duration-300 group-hover:border-black dark:group-hover:border-white"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* View Project Link */}
                        <div className="inline-flex items-center gap-3 text-black dark:text-white font-medium border-b border-black dark:border-white pb-1 group-hover:gap-4 transition-all duration-300">
                          <span>View Project</span>
                          <motion.div
                            className="w-6 h-6 border border-black dark:border-white flex items-center justify-center transition-colors duration-300"
                            whileHover={{ x: 5 }}
                          >
                            →
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <h3 className="text-2xl font-serif font-bold text-gray-600 dark:text-gray-400 mb-4">
                  No projects found
                </h3>
                <p className="text-gray-500 dark:text-gray-500 mb-6">
                  Try selecting a different category to see more projects.
                </p>
                <motion.button
                  onClick={() => setSelectedCategory('all')}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "#374151",
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  whileTap={{
                    scale: 0.95,
                    transition: { duration: 0.1 }
                  }}
                  animate={{
                    y: [0, -3, 0],
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  className="px-6 py-2 bg-black text-white rounded-full font-mono text-sm hover:bg-gray-800 transition-colors"
                >
                  View All Projects
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Services Integration */}
        <motion.section
          className="py-32 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
          ref={ref}
          initial="hidden"
          animate={(isInView || hasAnimated) ? "visible" : "hidden"}
        >
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <motion.div
              className="text-center mb-20"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    ease: "easeOut"
                  }
                }
              }}
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-black dark:text-white mb-6">
                Expertise & Services
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 font-sans max-w-2xl mx-auto">
                Professional services combining creative design with technical excellence to deliver exceptional digital experiences
              </p>
            </motion.div>

            {/* Services Grid */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {services.slice(0, 6).map((service) => (
                <Link href={`/service/${service.id}`} key={service.id}>
                  <motion.div
                    variants={cardVariants}
                    whileHover={{
                      y: -10,
                      transition: { type: "spring" as const, stiffness: 400, damping: 25 }
                    }}
                    className="group relative cursor-pointer bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-8 h-full transition-all duration-300 hover:border-black dark:hover:border-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
                  >
                    {/* Service Icon */}
                    <motion.div
                      className="text-4xl mb-6 text-black dark:text-white font-mono transition-colors duration-300 group-hover:text-black dark:group-hover:text-white"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {service.icon}
                    </motion.div>

                    {/* Service Content */}
                    <div className="space-y-4">
                      {/* Category */}
                      <motion.span
                        className="text-sm font-mono text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {service.category}
                      </motion.span>

                      {/* Title */}
                      <motion.h3
                        className="text-2xl font-serif font-bold text-black dark:text-white transition-colors duration-300 group-hover:text-black dark:group-hover:text-white"
                      >
                        {service.title}
                      </motion.h3>

                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-400 font-sans leading-relaxed text-base">
                        {service.description}
                      </p>

                      {/* Learn More Link */}
                      <div className="inline-flex items-center gap-3 text-black dark:text-white font-medium border-b border-black dark:border-white pb-1 group-hover:gap-4 transition-all duration-300">
                        <span>Learn More</span>
                        <motion.div
                          className="w-6 h-6 border border-black dark:border-white flex items-center justify-center transition-colors duration-300"
                          whileHover={{ x: 5 }}
                        >
                          →
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          className="pt-20 pb-16 md:pb-24 px-6 bg-emerald-700 dark:bg-emerald-600 text-white dark:text-white relative overflow-hidden min-h-[85vh] z-10 rounded-t-3xl shadow-2xl transition-colors duration-300"
          ref={ref}
          initial="hidden"
          animate={(isInView || hasAnimated) ? "visible" : "hidden"}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10 pb-safe">

            {/* Main CTA Content */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8 }
                }
              }}
            >
              <motion.h2
                className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-[0.9]"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.2, duration: 0.8 }
                  }
                }}
              >
                <span>Let&apos;s Create</span>
                <br />
                <motion.span
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { delay: 0.8, duration: 0.8 }
                    }
                  }
                  }
                  className="text-emerald-200 dark:text-emerald-300"
                >
                  Something Amazing
                </motion.span>
              </motion.h2>

              <motion.p
                className="text-lg md:text-xl text-emerald-100 dark:text-emerald-200 font-sans max-w-xl mx-auto mb-8 leading-normal"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.4, duration: 0.8 }
                  }
                }}
              >
                Ready to transform your ideas into reality? Let&apos;s discuss your next project
                and create something that stands out from the crowd.
              </motion.p>

              {/* Email Me Button with same behavior as Start Project */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.6, duration: 0.8 }
                  }
                }}
              >
                <motion.button
                  variants={{
                    initial: { scale: 1 },
                    animate: {
                      scale: [1, 1.05, 1],
                      transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut" as const
                      }
                    }
                  }}
                  initial="initial"
                  animate="animate"
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "#fff",
                    color: "#065f46",
                    boxShadow: "0 20px 40px rgba(255,255,255,0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(true)}
                  className="group relative px-10 py-4 border-2 border-white text-white font-sans font-medium text-lg transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10">Start Project</span>

                  {/* Button background animation */}
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ type: "tween", duration: 0.3 }}
                  />
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="mt-20 pt-12 border-t border-emerald-500 dark:border-emerald-400 relative z-10 mb-20"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { delay: 1, duration: 0.8 }
                }
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="relative">
                  <div className="text-lg font-serif font-bold mb-2">Email</div>
                  <a
                    href={`mailto:${siteConfig.contact?.email}`}
                    className="text-emerald-300 dark:text-emerald-200 font-mono hover:text-white dark:hover:text-white transition-colors duration-200 cursor-pointer underline-offset-4 hover:underline"
                  >
                    {siteConfig.contact?.email}
                  </a>
                </div>
                <div className="relative">
                  <div className="text-lg font-serif font-bold mb-2">Phone</div>
                  <a
                    href={`https://wa.me/${(siteConfig.contact?.phone || '+6281321766565').replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-300 dark:text-emerald-200 font-mono hover:text-white dark:hover:text-white transition-colors duration-200 cursor-pointer underline-offset-4 hover:underline"
                  >
                    {siteConfig.contact?.phone || '+6281321766565'}
                  </a>
                </div>
                <div className="relative">
                  <div className="text-lg font-serif font-bold mb-2">Location</div>
                  <div className="text-emerald-300 dark:text-emerald-200 font-mono">{siteConfig.contact.location}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Success/Error Status Messages */}
        <AnimatePresence mode="popLayout">
          {showStatus && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-8 right-8 z-[10000] p-4 rounded-lg shadow-lg max-w-sm ${submitStatus === 'success'
                ? 'bg-green-100 border-2 border-green-500 text-green-800'
                : 'bg-red-100 border-2 border-red-500 text-red-800'
                }`}
            >
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] z-[9999] transition-colors duration-300">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-serif font-bold text-black dark:text-white transition-colors duration-300">
                  Let&apos;s Start Something Great
                </DialogTitle>
              </DialogHeader>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="form_name" value="Portfolio Project Inquiry" />
                <input type="hidden" name="_subject" value="New Project Request from Portfolio" />

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
                    placeholder="Tell me about your project... What are your goals? Timeline? Budget considerations?"
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <motion.div
                    whileHover={{
                      scale: isSubmitting ? 1 : 1.02,
                      transition: { type: "spring", stiffness: 300, damping: 20 }
                    }}
                    whileTap={{
                      scale: isSubmitting ? 1 : 0.98,
                      transition: { duration: 0.1 }
                    }}
                    className="flex-1"
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-black text-white hover:bg-gray-800 font-sans font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2"
                        >
                          <motion.svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-0V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </motion.svg>
                          Sending...
                        </motion.span>
                      ) : (
                        'Send Message'
                      )}
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{
                      scale: isSubmitting ? 1 : 1.02,
                      transition: { type: "spring", stiffness: 300, damping: 20 }
                    }}
                    whileTap={{
                      scale: isSubmitting ? 1 : 0.98,
                      transition: { duration: 0.1 }
                    }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                      className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white font-sans font-medium transition-all duration-200"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </motion.div>
                </div>
              </form>
            </motion.div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}