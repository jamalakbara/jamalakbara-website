'use client'

import { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react'
import { gsap } from 'gsap'
import { useStore } from '@/lib/store'

// Section Manager Context
interface SectionManagerContextType {
  currentSection: number
  totalSections: number
  sectionNames: string[]
  goToSection: (index: number) => void
  isAnimating: boolean
}

const SectionManagerContext = createContext<SectionManagerContextType | null>(null)

export const useSectionManager = () => {
  const context = useContext(SectionManagerContext)
  if (!context) throw new Error('useSectionManager must be used within SectionManager')
  return context
}

// Section Component Props
interface SectionProps {
  children: ReactNode
  name: string
  className?: string
}

export function Section({ children, name, className = '' }: SectionProps) {
  return (
    <div data-section-name={name} className={`section absolute inset-0 w-full h-full ${className}`}>
      {children}
    </div>
  )
}

// Main Section Manager
interface SectionManagerProps {
  children: ReactNode
  onSectionChange?: (index: number, name: string) => void
}

export function SectionManager({ children, onSectionChange }: SectionManagerProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [sectionNames, setSectionNames] = useState<string[]>([])
  const [totalSections, setTotalSections] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<HTMLDivElement[]>([])
  const lastScrollTime = useRef(0)
  const touchStartY = useRef(0)
  const isInitialized = useRef(false)

  // Initialize sections on mount
  useEffect(() => {
    if (!containerRef.current) return

    // Small delay to ensure DOM is ready
    const initTimeout = setTimeout(() => {
      if (!containerRef.current || isInitialized.current) return

      const sections = containerRef.current.querySelectorAll('[data-section-name]')
      sectionsRef.current = Array.from(sections) as HTMLDivElement[]

      const names = sectionsRef.current.map(s => s.dataset.sectionName || '')
      setSectionNames(names)
      setTotalSections(sectionsRef.current.length)

      // Initialize: show first section, hide others
      sectionsRef.current.forEach((section, i) => {
        gsap.set(section, {
          opacity: i === 0 ? 1 : 0,
          visibility: i === 0 ? 'visible' : 'hidden',
          zIndex: i === 0 ? 10 : 0,
          y: 0,
          scale: 1
        })
      })

      isInitialized.current = true
      console.log('[SectionManager] Initialized with', sectionsRef.current.length, 'sections:', names)
    }, 100)

    return () => clearTimeout(initTimeout)
  }, [])

  // Transition to a specific section
  const transitionTo = useCallback((targetIndex: number) => {
    if (isAnimating) {
      console.log('[SectionManager] Ignoring transition - already animating')
      return
    }
    if (targetIndex < 0 || targetIndex >= sectionsRef.current.length) {
      console.log('[SectionManager] Invalid target index:', targetIndex)
      return
    }
    if (targetIndex === currentSection) {
      console.log('[SectionManager] Already at section:', targetIndex)
      return
    }

    console.log('[SectionManager] Transitioning from', currentSection, 'to', targetIndex)
    setIsAnimating(true)

    const currentEl = sectionsRef.current[currentSection]
    const targetEl = sectionsRef.current[targetIndex]

    if (!currentEl || !targetEl) {
      console.error('[SectionManager] Missing section elements', { currentEl, targetEl })
      setIsAnimating(false)
      return
    }

    const isGoingDown = targetIndex > currentSection

    // Update state immediately for UI feedback
    setCurrentSection(targetIndex)
    onSectionChange?.(targetIndex, sectionNames[targetIndex] || '')

    // Prepare target section BEFORE animating
    gsap.set(targetEl, {
      visibility: 'visible',
      zIndex: 10,
      opacity: 0,
      y: isGoingDown ? 80 : -80,
      scale: 0.98
    })

    // Create timeline for smooth transition
    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false)
        gsap.set(currentEl, { visibility: 'hidden', zIndex: 0 })
        console.log('[SectionManager] Transition complete')
      }
    })

    // Animate out current section - faster for snappy feel
    tl.to(currentEl, {
      opacity: 0,
      y: isGoingDown ? -60 : 60,
      scale: 0.98,
      duration: 0.35,
      ease: 'power2.inOut'
    })

    // Animate in target section (with overlap)
    tl.to(targetEl, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.35,
      ease: 'power2.out'
    }, '-=0.25')

  }, [currentSection, isAnimating, sectionNames, onSectionChange])

  // Go to specific section (exposed method)
  const goToSection = useCallback((index: number) => {
    transitionTo(index)
  }, [transitionTo])

  // Listen for menu navigation from store
  const { targetSection, clearTargetSection } = useStore()

  useEffect(() => {
    if (targetSection !== null && isInitialized.current) {
      transitionTo(targetSection)
      clearTargetSection()
    }
  }, [targetSection, transitionTo, clearTargetSection])

  // Handle wheel events
  useEffect(() => {
    let canScroll = true // Prevent rapid consecutive scrolls

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      // Block scroll during animation AND for a short cooldown after
      if (isAnimating || !canScroll) return

      // Higher threshold to prevent accidental triggers
      if (Math.abs(e.deltaY) < 30) return

      canScroll = false

      // Allow next scroll after animation completes + extra buffer
      setTimeout(() => {
        canScroll = true
      }, 600) // Wait for animation (350ms) + buffer

      // Only move ONE section at a time
      if (e.deltaY > 0 && currentSection < sectionsRef.current.length - 1) {
        transitionTo(currentSection + 1)
      } else if (e.deltaY < 0 && currentSection > 0) {
        transitionTo(currentSection - 1)
      }
    }

    // Handle touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY
      const deltaY = touchStartY.current - touchEndY

      // Throttle
      const now = Date.now()
      if (now - lastScrollTime.current < 1000) return
      lastScrollTime.current = now

      if (isAnimating) return

      // Swipe up = next section, swipe down = previous
      if (deltaY > 50 && currentSection < sectionsRef.current.length - 1) {
        transitionTo(currentSection + 1)
      } else if (deltaY < -50 && currentSection > 0) {
        transitionTo(currentSection - 1)
      }
    }

    // Add listeners
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [currentSection, isAnimating, transitionTo])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        if (currentSection < sectionsRef.current.length - 1) {
          transitionTo(currentSection + 1)
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        if (currentSection > 0) {
          transitionTo(currentSection - 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSection, isAnimating, transitionTo])

  return (
    <SectionManagerContext.Provider
      value={{
        currentSection,
        totalSections,
        sectionNames,
        goToSection,
        isAnimating
      }}
    >
      <div
        ref={containerRef}
        className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#0a0a0a]"
      >
        {children}
      </div>
    </SectionManagerContext.Provider>
  )
}
