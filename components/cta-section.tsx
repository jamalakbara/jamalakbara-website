'use client'

import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { getStaticContent } from '@/lib/content-manager'
import { ContactModal } from '@/components/contact-modal'

export function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const siteConfig = getStaticContent.siteConfig()

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
        className="pt-20 pb-16 md:pb-24 px-6 bg-black/80 dark:bg-white/80 backdrop-blur-xl text-white dark:text-black relative overflow-hidden min-h-[85vh] z-10 rounded-t-3xl shadow-2xl transition-colors duration-300 border border-white/20 dark:border-black/20"
        ref={ref}
        style={{ y, scale, opacity, rotateX }}
      >

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
                className="text-gray-300 dark:text-gray-700"
              >
                Something Amazing
              </motion.span>
            </motion.h2>

            <motion.p
              className="text-lg md:text-xl text-gray-300 dark:text-gray-700 font-sans max-w-xl mx-auto mb-8 leading-normal"
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
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="group relative px-10 py-4 border-2 border-white dark:border-black text-white dark:text-black font-sans font-medium text-lg transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">Start a Project</span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="mt-20 pt-12 border-t border-gray-500 dark:border-gray-600 relative z-10 mb-20"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="relative">
                <div className="text-lg font-serif font-bold mb-2">Email</div>
                <a
                  href={`mailto:${siteConfig.contact?.email}`}
                  className="text-gray-300 dark:text-gray-700 font-mono hover:text-white dark:hover:text-black transition-colors duration-200 cursor-pointer underline-offset-4 hover:underline"
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
                  className="text-gray-300 dark:text-gray-700 font-mono hover:text-white dark:hover:text-black transition-colors duration-200 cursor-pointer underline-offset-4 hover:underline"
                >
                  {siteConfig.contact?.phone || '+6281321766565'}
                </a>
              </div>
              <div className="relative">
                <div className="text-lg font-serif font-bold mb-2">Location</div>
                <div className="text-gray-300 dark:text-gray-700 font-mono">{siteConfig.contact.location}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <ContactModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  )
}