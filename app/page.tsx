'use client'

import { CustomCursor } from '@/components/custom-cursor'
import { Navigation } from '@/components/navigation'
import { HeroSection } from '@/components/hero-section'
import { ServicesSection } from '@/components/services-section'
import { FeaturedWorkSection } from '@/components/featured-work-section'
import { AboutSection } from '@/components/about-section'
import { CTASection } from '@/components/cta-section'
import { LoadingScreen } from '@/components/loading-screen'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Home() {
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [buttonOnDarkSection, setButtonOnDarkSection] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

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
      {/* Loading Screen */}
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      
      {/* Main Content */}
      {!isLoading && (
        <>
          <div className="min-h-screen bg-white">
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

          {/* Global Floating Scroll Button with Circular Text */}
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
                  buttonOnDarkSection ? 'fill-white' : 'fill-black'
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

            {/* Center Button */}
            <motion.button
              className={`relative w-16 h-16 bg-transparent rounded-full transition-all duration-300 flex items-center justify-center hover:bg-opacity-20 ${
                buttonOnDarkSection 
                  ? 'text-white hover:bg-white' 
                  : 'text-black hover:bg-black'
              }`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 300, damping: 25 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                console.log('Floating button clicked, showBackToTop:', showBackToTop)
                if (showBackToTop) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  const servicesSection = document.getElementById('services');
                  console.log('Services section found:', servicesSection)
                  if (servicesSection) {
                    // Get actual navbar height
                    const navbar = document.querySelector('nav')
                    const navbarHeight = navbar ? navbar.offsetHeight + 20 : 100
                    const targetPosition = servicesSection.offsetTop - navbarHeight
                    
                    console.log('Floating button - target position:', targetPosition)
                    
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
                className="text-xl"
              >
                ↑
              </motion.div>
            </motion.button>
          </div>
        </>
      )}
    </>
  )
}