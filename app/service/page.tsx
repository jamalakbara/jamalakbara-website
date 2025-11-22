'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { getStaticContent } from '@/lib/content-manager'
import { StructuredData } from '@/components/structured-data'
import { CustomCursor } from '@/components/custom-cursor'
import { Navigation } from '@/components/navigation'

export default function ServicesPage() {
  const services = getStaticContent.services()
  const ref = useRef(null)
  const [hasAnimated, setHasAnimated] = useState(false)
  const isInView = useInView(ref, { once: false, margin: "-100px" })

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
        {/* Services Header */}
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
              Services
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
              Professional services combining creative design with technical excellence to deliver exceptional digital experiences
            </motion.p>
          </div>
        </motion.section>

        {/* Services Grid */}
        <motion.section
          className="py-32 px-6"
          ref={ref}
          initial="hidden"
          animate={(isInView || hasAnimated) ? "visible" : "hidden"}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {services.map((service) => (
                <Link href={`/service/${service.id}`} key={service.id}>
                  <motion.div
                    variants={cardVariants}
                    whileHover={{
                      y: -10,
                      transition: { type: "spring" as const, stiffness: 400, damping: 25 }
                    }}
                    className="group relative cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 h-full transition-all duration-300 hover:border-black dark:hover:border-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
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

        {/* Back to Home */}
        <motion.section
          className="py-32 px-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-3 bg-black text-white font-mono text-sm hover:bg-gray-800 transition-colors"
          >
            ← Back to Home
          </Link>
        </motion.section>
      </div>
    </>
  )
}