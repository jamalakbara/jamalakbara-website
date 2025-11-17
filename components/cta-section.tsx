'use client'

import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getStaticContent } from '@/lib/content-manager'

export function CTASection() {
  const ref = useRef(null)
  const formRef = useRef<HTMLFormElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showStatus, setShowStatus] = useState(false)
  const siteConfig = getStaticContent.siteConfig()

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

  // Scroll-based animations for stacking effect
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 0.5], [200, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.85, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 1])
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [15, 0])

  const pulseVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  }

  return (
    <>
      <motion.section 
        id="contact"
        className="pt-20 pb-16 md:pb-24 px-4 bg-emerald-700 dark:bg-emerald-600 text-white dark:text-white relative overflow-hidden min-h-[85vh] z-10 rounded-t-3xl shadow-2xl transition-colors duration-300"
        ref={ref}
        style={{ y, scale, opacity, rotateX }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 pb-safe">
          
          {/* Main CTA Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-[0.9]"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span>Let&apos;s Create</span>
              <br />
              <motion.span
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-emerald-200 dark:text-emerald-300"
              >
                Something Amazing
              </motion.span>
            </motion.h2>

            <motion.p 
              className="text-lg md:text-xl text-emerald-100 dark:text-emerald-200 font-sans max-w-xl mx-auto mb-8 leading-normal"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Ready to transform your ideas into reality? Let&apos;s discuss your next project 
              and create something that stands out from the crowd.
            </motion.p>

            {/* Animated CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.button
                variants={pulseVariants}
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
                <span className="relative z-10">Start a Project</span>
                
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
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
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
      <AnimatePresence>
        {showStatus && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-8 right-8 z-[10000] p-4 rounded-lg shadow-lg max-w-sm ${
              submitStatus === 'success'
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
              <input type="hidden" name="form_name" value="Project Inquiry" />
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
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-0V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
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
    </>
  )
}