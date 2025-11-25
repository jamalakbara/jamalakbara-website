'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll } from 'framer-motion'
import { getStaticContent } from '@/lib/content-manager'
import { StructuredData } from '@/components/structured-data'
import { CustomCursor } from '@/components/custom-cursor'
import { Navigation } from '@/components/navigation'
import { BlogContent } from '@/components/blog-content'
import { ParallaxContainer } from '@/components/parallax-layers'
import { VelocityParticles } from '@/components/velocity-effects'
import { StaticSceneryBackground } from '@/components/static-scenery-background'
import { useTheme } from '@/contexts/theme-context'

export default function BlogPage() {
  const { theme } = useTheme()
  const { scrollYProgress } = useScroll()
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [buttonOnDarkSection, setButtonOnDarkSection] = useState(false)
  const [mounted, setMounted] = useState(false)

  const blogPosts = getStaticContent.blog()
  const sortedPosts = [...blogPosts].sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
  const featuredPosts = sortedPosts.filter(post => post.featured)
  const regularPosts = sortedPosts.filter(post => !post.featured)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      setShowBackToTop(scrollTop > 100)

      const buttonRect = {
        top: window.innerHeight - 64 - 32,
        left: window.innerWidth - 64 - 32,
        right: window.innerWidth - 32,
        bottom: window.innerHeight - 32
      }

      const darkSections = document.querySelectorAll('.bg-black, [class*="dark:bg-white"]')
      let isOverDark = false

      darkSections.forEach(section => {
        const rect = section.getBoundingClientRect()
        const isOverlapping = !(buttonRect.bottom < rect.top ||
          buttonRect.top > rect.bottom ||
          buttonRect.right < rect.left ||
          buttonRect.left > rect.right)
        if (isOverlapping) isOverDark = true
      })

      setButtonOnDarkSection(isOverDark)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <StaticSceneryBackground />
      <ParallaxContainer />
      <VelocityParticles />
      <CustomCursor />
      <Navigation />
      <StructuredData type="WebSite" />

      <BlogContent
        featuredPosts={featuredPosts}
        regularPosts={regularPosts}
      />

      {mounted && (
        <div className="fixed bottom-8 right-8 z-[9999]">
          <svg className="absolute -inset-6 w-28 h-28 animate-spin" style={{ animationDuration: '12s' }}>
            <defs>
              <path
                id="circle-blog-list"
                d="M 56,56 m -40,0 a 40,40 0 0,1 80,0 a 40,40 0 0,1 -80,0"
              />
            </defs>
            <motion.text
              key={showBackToTop ? 'top' : 'scroll'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`text-[8px] font-sans font-bold uppercase tracking-[0.5px] transition-colors duration-300 ${buttonOnDarkSection
                  ? 'fill-white'
                  : theme === 'dark'
                    ? 'fill-white'
                    : 'fill-black'
                }`}
            >
              <textPath href="#circle-blog-list" startOffset="0%" spacing="auto">
                {showBackToTop
                  ? 'BACK TO TOP • BACK TO TOP • BACK TO TOP • BACK TO TOP • '
                  : 'SCROLL DOWN • SCROLL DOWN • SCROLL DOWN • SCROLL DOWN • '
                }
              </textPath>
            </motion.text>
          </svg>

          <div className="absolute -inset-4 w-24 h-24">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r="34"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`transition-colors duration-300 opacity-20 ${buttonOnDarkSection
                    ? 'text-white'
                    : theme === 'dark'
                      ? 'text-white'
                      : 'text-black'
                  }`}
              />
              <motion.circle
                cx="48"
                cy="48"
                r="34"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`transition-colors duration-300 ${buttonOnDarkSection
                    ? 'text-white'
                    : theme === 'dark'
                      ? 'text-white'
                      : 'text-black'
                  }`}
                strokeLinecap="round"
                style={{
                  pathLength: scrollYProgress
                }}
                strokeDasharray="213.628"
                strokeDashoffset="213.628"
              />
            </svg>
          </div>

          <motion.button
            className={`relative w-16 h-16 bg-transparent rounded-full transition-all duration-300 flex items-center justify-center hover:bg-opacity-20 ${buttonOnDarkSection
                ? 'text-white hover:bg-white'
                : theme === 'dark'
                  ? 'text-white hover:bg-white/20 dark:text-white dark:hover:bg-white/20'
                  : 'text-black hover:bg-black/20'
              }`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 300, damping: 25 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (showBackToTop) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
              }
            }}
            style={{ backgroundColor: 'transparent' }}
          >
            <motion.div
              animate={{
                y: showBackToTop ? [0, -3, 0] : [0, 3, 0],
                rotate: showBackToTop ? 0 : 180
              }}
              transition={{
                y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                rotate: { duration: 0.3 }
              }}
              className={`text-xl transition-colors duration-300 ${buttonOnDarkSection
                  ? 'text-white'
                  : theme === 'dark'
                    ? 'text-white'
                    : 'text-black'
                }`}
            >
              ↑
            </motion.div>
          </motion.button>
        </div>
      )}
    </>
  )
}