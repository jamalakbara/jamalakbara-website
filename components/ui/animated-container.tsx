'use client'

import { motion, useInView, type Variants } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedContainerProps {
  children: React.ReactNode
  className?: string
  id?: string
  animation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'custom'
  customVariants?: Variants
  staggerChildren?: boolean
  staggerDelay?: number
  viewportAmount?: number
  once?: boolean
  delay?: number
  duration?: number
}

const animations = {
  fadeUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  slideLeft: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  },
  slideRight: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  }
}

export function AnimatedContainer({
  children,
  className,
  id,
  animation = 'fadeUp',
  customVariants,
  staggerChildren = false,
  staggerDelay = 0.1,
  viewportAmount = 0.3,
  once = true,
  delay = 0,
  duration = 0.8
}: AnimatedContainerProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount: viewportAmount })

  const variants = customVariants || animations[animation as keyof typeof animations]

  const containerVariants = staggerChildren ? {
    ...variants,
    visible: {
      ...variants.visible,
      transition: {
        duration,
        delay,
        staggerChildren: staggerDelay,
        ease: "easeOut" as const
      }
    }
  } : {
    ...variants,
    visible: {
      ...variants.visible,
      transition: {
        duration,
        delay,
        ease: "easeOut" as const
      }
    }
  }

  return (
    <motion.div
      ref={ref}
      id={id}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

// Child component untuk staggered animations
export function AnimatedChild({
  children,
  className,
  delay = 0
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: "easeOut" as const
      }
    }
  }

  return (
    <motion.div
      variants={childVariants}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}