'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useTheme } from '@/contexts/theme-context'

interface Section {
  id: string
  lightColor: string
  darkColor: string
  textColor: string
  darkTextColor: string
}

const sections: Section[] = [
  { 
    id: 'hero', 
    lightColor: '#ffffff', 
    darkColor: '#000000',
    textColor: '#000000',
    darkTextColor: '#ffffff'
  },
  { 
    id: 'services', 
    lightColor: '#f9fafb', 
    darkColor: '#111827',
    textColor: '#111827',
    darkTextColor: '#f9fafb'
  },
  { 
    id: 'work', 
    lightColor: '#f3f4f6', 
    darkColor: '#1f2937',
    textColor: '#1f2937',
    darkTextColor: '#f3f4f6'
  },
  { 
    id: 'about', 
    lightColor: '#ffffff', 
    darkColor: '#000000',
    textColor: '#000000',
    darkTextColor: '#ffffff'
  },
  { 
    id: 'contact', 
    lightColor: '#065f46', 
    darkColor: '#059669',
    textColor: '#ffffff',
    darkTextColor: '#ffffff'
  }
]

export const DynamicBackground = () => {
  const [currentSection, setCurrentSection] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const { scrollYProgress } = useScroll()

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Transform scroll progress to section index
  const sectionProgress = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [0, 1, 2, 3, 4, 4]
  )

  useEffect(() => {
    const unsubscribe = sectionProgress.on('change', (latest) => {
      setCurrentSection(Math.round(latest))
    })

    return () => unsubscribe()
  }, [sectionProgress])

  const currentSectionData = sections[currentSection] || sections[0]
  const nextSectionData = sections[currentSection + 1] || currentSectionData

  // Calculate progress within current section
  const withinSectionProgress = useTransform(
    scrollYProgress,
    [(currentSection * 0.2), ((currentSection + 1) * 0.2)],
    [0, 1]
  )

  // Use resolvedTheme for consistent server/client rendering
  const actualTheme = isMounted ? resolvedTheme : 'light'

  // Background color interpolation
  const backgroundColor = useTransform(
    withinSectionProgress,
    [0, 1],
    actualTheme === 'light'
      ? [currentSectionData.lightColor, nextSectionData.lightColor]
      : [currentSectionData.darkColor, nextSectionData.darkColor]
  )

  return (
    <>
      {/* Dynamic Background Overlay */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundColor
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isMounted ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        suppressHydrationWarning
      />

      {/* Gradient Overlay for Smooth Transitions */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-1"
        style={{
          background: useTransform(
            scrollYProgress,
            [0, 0.2, 0.4, 0.6, 0.8, 1],
            [
              'radial-gradient(circle at 50% 0%, rgba(0,0,0,0.05), transparent 70%)',
              'radial-gradient(circle at 50% 25%, rgba(0,0,0,0.03), transparent 70%)',
              'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.02), transparent 70%)',
              'radial-gradient(circle at 50% 75%, rgba(0,0,0,0.03), transparent 70%)',
              'radial-gradient(circle at 50% 100%, rgba(255,255,255,0.1), transparent 70%)',
              'radial-gradient(circle at 50% 100%, rgba(255,255,255,0.1), transparent 70%)'
            ]
          )
        }}
        suppressHydrationWarning
      />
    </>
  )
}