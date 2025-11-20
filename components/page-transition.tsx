'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  // Determine transition direction based on navigation patterns
  const getTransitionDirection = () => {
    // Home to service/project = forward
    if (pathname === '/' || pathname === '/portfolio') return 'forward'
    // Service/project detail pages = backward
    if (pathname.includes('/service/') || pathname.includes('/project/')) return 'backward'
    // Default to forward
    return 'forward'
  }

  const transitionDirection = getTransitionDirection()

  const contentVariants = {
    initial: {
      opacity: 0,
      scale: 0.95,
      y: transitionDirection === 'forward' ? 30 : -30
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.1,
        ease: "easeInOut" as const
      }
    },
    exit: {
      opacity: 0,
      scale: 1.05,
      y: transitionDirection === 'forward' ? -30 : 30,
      transition: {
        duration: 0.4,
        ease: "easeInOut" as const
      }
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={contentVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}