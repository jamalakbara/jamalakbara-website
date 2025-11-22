'use client'

import Link from 'next/link'
import { CustomCursor } from '@/components/custom-cursor'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Clock
} from 'lucide-react'
import { motion } from 'framer-motion'
import type { Service } from '@/lib/content-types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useState, useRef } from 'react'

interface ServicePostContentProps {
  service: Service
  otherServices: Service[]
}

export function ServicePostContent({ service, otherServices }: ServicePostContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showStatus, setShowStatus] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  // Formspree form endpoint from environment variables
  const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || 'https://formspree.io/f/xjkbvlqd'

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
        setShowStatus(true)
        setTimeout(() => setShowStatus(false), 3000)
        if (formRef.current) formRef.current.reset()
      } else {
        throw new Error('Form submission failed')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
      setShowStatus(true)
      setTimeout(() => setShowStatus(false), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 20,
      },
    },
  }

  return (
    <>
      <CustomCursor />
      <main className="min-h-screen bg-white dark:bg-black font-sans antialiased">
        <article className="max-w-7xl mx-auto px-6 py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-16"
          >
            {/* Back to Home */}
            <motion.div variants={itemVariants} className="relative z-50">
              <Link
                href="/"
                className="inline-flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300 group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-mono text-sm tracking-wider uppercase">Back to Home</span>
              </Link>
            </motion.div>

            {/* Service Hero */}
            <motion.header
              variants={itemVariants}
              className="relative min-h-[90vh] flex items-center justify-center -mt-32 mb-20 pb-20"
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black -z-10" />

              <div className="text-center space-y-8 max-w-4xl mx-auto px-6">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="text-8xl md:text-9xl mb-8 inline-block"
                >
                  {service.icon}
                </motion.div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-black dark:text-white leading-tight">
                  {service.title}
                </h1>

                {/* Category */}
                <div className="flex items-center justify-center gap-4">
                  <span className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-mono font-bold uppercase tracking-wider">
                    {service.category}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
                  {service.description}
                </p>

                {/* CTA Button */}
                <div className="pt-8">
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className="px-8 py-6 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 text-lg font-mono transition-transform hover:scale-105"
                  >
                    Start a Project
                  </Button>
                </div>
              </div>
            </motion.header>


            {/* Service Content */}
            <motion.div variants={itemVariants} className="space-y-12">

              {/* What I Deliver */}
              <div className="space-y-8">
                <h2 className="text-3xl font-serif font-bold text-black dark:text-white">
                  What I Deliver
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 ">
                    <Zap className="w-8 h-8 mb-4 text-black dark:text-white" />
                    <h3 className="text-xl font-serif font-bold mb-3 text-black dark:text-white">Strategic Planning</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      Comprehensive planning and strategy development tailored to your specific needs and goals.
                    </p>
                  </div>
                  <div className="p-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 ">
                    <CheckCircle2 className="w-8 h-8 mb-4 text-black dark:text-white" />
                    <h3 className="text-xl font-serif font-bold mb-3 text-black dark:text-white">Expert Execution</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      Professional implementation using industry best practices and cutting-edge technologies.
                    </p>
                  </div>
                  <div className="p-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 ">
                    <Shield className="w-8 h-8 mb-4 text-black dark:text-white" />
                    <h3 className="text-xl font-serif font-bold mb-3 text-black dark:text-white">Quality Assurance</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      Rigorous testing and quality control to ensure exceptional results and performance.
                    </p>
                  </div>
                  <div className="p-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 ">
                    <Clock className="w-8 h-8 mb-4 text-black dark:text-white" />
                    <h3 className="text-xl font-serif font-bold mb-3 text-black dark:text-white">Ongoing Support</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      Continuous support and maintenance to keep your project running smoothly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Technologies */}
              <div className="space-y-6">
                <h2 className="text-3xl font-serif font-bold text-black dark:text-white">
                  Technologies
                </h2>
                <div className="flex flex-wrap gap-3">
                  {getTechnologiesForService(service.id).map((tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-sm font-mono text-gray-700 dark:text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Process */}
              <div className="space-y-8">
                <h2 className="text-3xl font-serif font-bold text-black dark:text-white">
                  Process Overview
                </h2>
                <div className="space-y-6">
                  {[
                    { step: 1, title: 'Discovery & Planning', desc: 'Understanding your requirements, goals, and target audience.' },
                    { step: 2, title: 'Design & Development', desc: 'Creating the solution with attention to detail and technical excellence.' },
                    { step: 3, title: 'Testing & Refinement', desc: 'Rigorous testing and iterations to ensure highest quality.' },
                    { step: 4, title: 'Launch & Support', desc: 'Successful deployment and ongoing support for long-term success.' }
                  ].map((item) => (
                    <div key={item.step} className="flex gap-6 p-6 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <div className="flex-shrink-0 w-12 h-12 bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold font-mono text-lg">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-xl mb-2 text-black dark:text-white">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>

            {/* Other Services */}
            {otherServices.length > 0 && (
              <motion.section variants={itemVariants} className="space-y-8 pt-12 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-4xl md:text-5xl font-serif font-bold text-black dark:text-white">
                  Other Services
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {otherServices.map((otherService) => (
                    <Link
                      key={otherService.id}
                      href={`/service/${otherService.id}`}
                      className="group p-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-300"
                    >
                      <div className="flex items-start gap-6">
                        <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{otherService.icon}</div>
                        <div>
                          <h4 className="font-serif font-bold text-xl text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors mb-2">
                            {otherService.title}
                          </h4>
                          <p className="text-sm font-mono text-gray-600 dark:text-gray-400">
                            {otherService.category}
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.section>
            )}

          </motion.div>
        </article>
      </main>

      {/* Success/Error Status Messages */}
      {showStatus && (
        <div className={`fixed top-8 right-8 z-[10000] p-4 shadow-lg max-w-sm ${submitStatus === 'success'
          ? 'bg-green-100 border-2 border-green-500 text-green-800'
          : 'bg-red-100 border-2 border-red-500 text-red-800'
          }`}>
          {submitStatus === 'success' ? (
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="font-medium">Thank you! I&apos;ll get back to you soon.</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="font-medium">Something went wrong. Please try again.</div>
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

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 mt-4">
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
                  {isSubmitting ? 'Sending...' : 'Send Message'}
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
