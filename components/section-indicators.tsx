'use client'

import { useSectionManager } from './section-manager'
import { motion } from 'framer-motion'

export function SectionIndicators() {
  const { currentSection, totalSections, sectionNames, goToSection, isAnimating } = useSectionManager()

  if (totalSections === 0) return null

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-4">
      {Array.from({ length: totalSections }).map((_, index) => (
        <button
          key={index}
          onClick={() => !isAnimating && goToSection(index)}
          className="group relative flex items-center justify-center"
          aria-label={`Go to ${sectionNames[index] || `section ${index + 1}`}`}
          disabled={isAnimating}
        >
          {/* Dot */}
          <motion.div
            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSection === index
                ? 'bg-white scale-125'
                : 'bg-white/30 group-hover:bg-white/60'
              }`}
            layout
          />

          {/* Label on hover */}
          <span className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs font-mono uppercase tracking-wider text-white/60 whitespace-nowrap pointer-events-none">
            {sectionNames[index] || `0${index + 1}`}
          </span>

          {/* Active indicator ring */}
          {currentSection === index && (
            <motion.div
              layoutId="activeSection"
              className="absolute inset-0 w-4 h-4 -m-1 rounded-full border border-white/50"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      ))}

      {/* Section counter below dots */}
      <div className="mt-6 text-center">
        <span className="text-xs font-mono text-white/40">
          {String(currentSection + 1).padStart(2, '0')} / {String(totalSections).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}

// Alternative: Horizontal indicators for mobile (bottom of screen)
export function SectionIndicatorsMobile() {
  const { currentSection, totalSections, goToSection, isAnimating } = useSectionManager()

  if (totalSections === 0) return null

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex md:hidden items-center gap-3">
      {Array.from({ length: totalSections }).map((_, index) => (
        <button
          key={index}
          onClick={() => !isAnimating && goToSection(index)}
          className="relative w-8 h-1 rounded-full overflow-hidden bg-white/20"
          aria-label={`Go to section ${index + 1}`}
          disabled={isAnimating}
        >
          {currentSection === index && (
            <motion.div
              layoutId="activeSectionMobile"
              className="absolute inset-0 bg-white"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  )
}
