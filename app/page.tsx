'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionManager, Section } from '@/components/section-manager'
import { HeroSection } from '@/components/hero-section'
import { ProjectCarousel3D } from '@/components/project-carousel-3d'
import { AboutSection } from '@/components/about-section'
import { CTASection } from '@/components/cta-section'
import { CustomCursor } from '@/components/custom-cursor'
import { NoiseOverlay } from '@/components/noise-overlay'
import { LiquidBackground } from '@/components/liquid-background'
import { useStore } from '@/lib/store'

const menuItems = [
  { label: 'Home', index: 0 },
  { label: 'Works', index: 1 },
  { label: 'About', index: 2 },
  { label: 'Contact', index: 3 },
]

export default function Home() {
  const [currentSectionName, setCurrentSectionName] = useState('Hero')
  const { isMenuOpen, setIsMenuOpen, goToSection } = useStore()

  const handleSectionChange = (index: number, name: string) => {
    setCurrentSectionName(name)
  }

  return (
    <>
      <LiquidBackground />
      <CustomCursor />
      <NoiseOverlay />

      {/* Menu Overlay - Awwwards Level */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ clipPath: 'circle(0% at calc(100% - 48px) 48px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 48px) 48px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 48px) 48px)' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col"
          >
            {/* Main navigation area */}
            <div className="flex-1 flex items-center px-6 md:px-16 lg:px-24">
              <nav className="w-full">
                {menuItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                    className="group"
                  >
                    <button
                      onClick={() => goToSection(item.index)}
                      className="w-full flex items-center justify-between py-4 md:py-6 border-b border-white/10 group-hover:border-white/30 transition-colors"
                    >
                      {/* Index number */}
                      <span className="text-xs md:text-sm font-mono text-white/30 group-hover:text-white/60 transition-colors">
                        0{item.index + 1}
                      </span>

                      {/* Label - massive with outline effect */}
                      <span
                        className="text-[12vw] md:text-[10vw] lg:text-[8vw] font-bold uppercase tracking-tighter leading-none transition-all duration-500 text-transparent group-hover:text-white"
                        style={{
                          WebkitTextStroke: '1px rgba(255,255,255,0.3)',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget.style as unknown as Record<string, string>).webkitTextStroke = '0'
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget.style as unknown as Record<string, string>).webkitTextStroke = '1px rgba(255,255,255,0.3)'
                        }}
                      >
                        {item.label}
                      </span>

                      {/* Arrow */}
                      <motion.span
                        className="text-white/30 group-hover:text-white transition-colors"
                        initial={{ x: 0 }}
                        whileHover={{ x: 10 }}
                      >
                        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </motion.span>
                    </button>
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="px-6 md:px-16 lg:px-24 py-8 border-t border-white/10 flex justify-between items-center"
            >
              <span className="text-sm text-white/40">Available for work</span>
              <a
                href="mailto:hello@jamalakbara.com"
                className="text-sm text-white/40 hover:text-white transition-colors"
              >
                hello@jamalakbara.com
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex justify-between items-center pointer-events-none">
        {/* Logo */}
        <Link href="/" className="pointer-events-auto text-sm font-bold text-white tracking-tight">
          jamalakbara<span className="text-white/50">.</span>
        </Link>

        {/* Menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="pointer-events-auto text-xs font-mono uppercase tracking-widest text-white/50 hover:text-white transition-colors"
        >
          {isMenuOpen ? 'Close' : 'Menu'}
        </button>
      </header>

      {/* Section-based Navigation */}
      <SectionManager onSectionChange={handleSectionChange}>
        {/* Section 0: Hero */}
        <Section name="Hero">
          <HeroSection />
        </Section>

        {/* Section 1: Selected Works */}
        <Section name="Works">
          <ProjectCarousel3D />
        </Section>

        {/* Section 2: About */}
        <Section name="About">
          <AboutSection />
        </Section>

        {/* Section 3: Contact */}
        <Section name="Contact">
          <CTASection />
        </Section>
      </SectionManager>
    </>
  )
}