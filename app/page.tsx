'use client'

import { CustomCursor } from '@/components/custom-cursor'
import { Navigation } from '@/components/navigation'
import { HeroSection } from '@/components/hero-section'
import { ServicesSection } from '@/components/services-section'
import { FeaturedWorkSection } from '@/components/featured-work-section'
import { AboutSection } from '@/components/about-section'
import { CTASection } from '@/components/cta-section'
import { DynamicBackground } from '@/components/dynamic-background'
import { ParallaxContainer } from '@/components/parallax-layers'
import { VelocityParticles } from '@/components/velocity-effects'
import { useTheme } from '@/contexts/theme-context'
import { motion, useScroll } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Home() {
  const { theme } = useTheme()
  const { scrollYProgress } = useScroll()
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [buttonOnDarkSection, setButtonOnDarkSection] = useState(false)

  // Track scroll position for floating button and detect dark sections
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      setShowBackToTop(scrollTop > 100)
      
      // Detect if button is over dark section
      const buttonRect = {
        top: window.innerHeight - 64 - 32, // bottom-8 = 32px from bottom, button height 64px
        left: window.innerWidth - 64 - 32, // right-8 = 32px from right, button width 64px
        right: window.innerWidth - 32,
        bottom: window.innerHeight - 32
      }
      
      // Check if button overlaps with CTA section (which is dark)
      const ctaSection = document.getElementById('contact')
      if (ctaSection) {
        const ctaRect = ctaSection.getBoundingClientRect()
        const isOverlapping = !(buttonRect.bottom < ctaRect.top || 
                                buttonRect.top > ctaRect.bottom || 
                                buttonRect.right < ctaRect.left || 
                                buttonRect.left > ctaRect.right)
        setButtonOnDarkSection(isOverlapping)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial position
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Advanced Scroll Effects */}
      <DynamicBackground />
      <ParallaxContainer />
      <VelocityParticles />

      <div className="relative min-h-screen">
        {/* Custom Cursor */}
        <CustomCursor />

        {/* Navigation */}
        <Navigation />

        {/* Main Portfolio Sections */}
        <HeroSection />
        <ServicesSection />
        <FeaturedWorkSection />
        <AboutSection />
        <CTASection />
      </div>

      {/* Global Floating Scroll Button with Integrated Progress Ring */}
      <div className="fixed bottom-8 right-8 z-[9999]">
        {/* SVG Circular Text */}
        <svg className="absolute -inset-6 w-28 h-28 animate-spin" style={{ animationDuration: '12s' }}>
          <defs>
            <path
              id="circle"
              d="M 56,56 m -40,0 a 40,40 0 0,1 80,0 a 40,40 0 0,1 -80,0"
            />
          </defs>
          <motion.text
            key={showBackToTop ? 'top' : 'scroll'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`text-[8px] font-sans font-bold uppercase tracking-[0.5px] transition-colors duration-300 ${
              buttonOnDarkSection
                ? 'fill-white'
                : theme === 'dark'
                  ? 'fill-white'
                  : 'fill-black'
            }`}
          >
            <textPath href="#circle" startOffset="0%" spacing="auto">
              {showBackToTop
                ? 'BACK TO TOP • BACK TO TOP • BACK TO TOP • BACK TO TOP • '
                : 'SCROLL DOWN • SCROLL DOWN • SCROLL DOWN • SCROLL DOWN • '
              }
            </textPath>
          </motion.text>
        </svg>

        {/* Progress Ring (Inner Layer - Below Text) */}
        <div className="absolute -inset-4 w-24 h-24">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
            {/* Background ring */}
            <circle
              cx="48"
              cy="48"
              r="34"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-colors duration-300 opacity-20 ${
                buttonOnDarkSection
                  ? 'text-white'
                  : theme === 'dark'
                    ? 'text-white'
                    : 'text-black'
              }`}
            />
            {/* Progress ring */}
            <motion.circle
              cx="48"
              cy="48"
              r="34"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-colors duration-300 ${
                buttonOnDarkSection
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

        {/* Center Button */}
        <motion.button
          className={`relative w-16 h-16 bg-transparent rounded-full transition-all duration-300 flex items-center justify-center hover:bg-opacity-20 ${
            buttonOnDarkSection
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
              const servicesSection = document.getElementById('services');
              if (servicesSection) {
                const navbar = document.querySelector('nav')
                const navbarHeight = navbar ? navbar.offsetHeight + 20 : 100
                const targetPosition = servicesSection.offsetTop - navbarHeight

                window.scrollTo({
                  top: Math.max(0, targetPosition),
                  behavior: 'smooth'
                })
              }
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
            className={`text-xl transition-colors duration-300 ${
              buttonOnDarkSection
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
    </>
  )
}