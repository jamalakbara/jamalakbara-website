'use client'

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import { useRef, ReactNode } from 'react'
import { useTheme } from '@/contexts/theme-context'

interface ScrollColorTransitionProps {
  children: ReactNode
  className?: string
  fromColor?: string
  toColor?: string
  fromColorDark?: string
  toColorDark?: string
  triggerPoint?: [number, number]
}

export const ScrollColorTransition = ({ 
  children, 
  className = '',
  fromColor = '#000000',
  toColor = '#666666',
  fromColorDark = '#ffffff',
  toColorDark = '#999999',
  triggerPoint = [0, 1]
}: ScrollColorTransitionProps) => {
  const { theme } = useTheme()
  const ref = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"]
  })

  const color = useTransform(
    scrollYProgress,
    triggerPoint,
    theme === 'light' ? [fromColor, toColor] : [fromColorDark, toColorDark]
  )

  return (
    <motion.div
      ref={ref}
      style={{ color }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface ScrollBackgroundTransitionProps {
  children: ReactNode
  className?: string
  fromBg?: string
  toBg?: string
  fromBgDark?: string
  toBgDark?: string
}

export const ScrollBackgroundTransition = ({ 
  children, 
  className = '',
  fromBg = 'transparent',
  toBg = 'rgba(0,0,0,0.05)',
  fromBgDark = 'transparent',
  toBgDark = 'rgba(255,255,255,0.05)'
}: ScrollBackgroundTransitionProps) => {
  const { theme } = useTheme()
  const ref = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    theme === 'light' 
      ? [fromBg, toBg, fromBg] 
      : [fromBgDark, toBgDark, fromBgDark]
  )

  return (
    <motion.div
      ref={ref}
      style={{ backgroundColor }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Advanced gradient text effect based on scroll
interface ScrollGradientTextProps {
  children: ReactNode
  className?: string
  gradient?: [string, string]
  gradientDark?: [string, string]
}

export const ScrollGradientText = ({ 
  children, 
  className = '',
  gradient = ['#000000', '#666666'],
  gradientDark = ['#ffffff', '#999999']
}: ScrollGradientTextProps) => {
  const { theme } = useTheme()
  const ref = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const [color1, color2] = theme === 'light' ? gradient : gradientDark

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        background: useTransform(
          scrollYProgress,
          [0, 0.5, 1],
          [
            `linear-gradient(90deg, ${color1} 0%, ${color2} 100%)`,
            `linear-gradient(90deg, ${color2} 0%, ${color1} 50%, ${color2} 100%)`,
            `linear-gradient(90deg, ${color2} 0%, ${color1} 100%)`
          ]
        ),
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}
    >
      {children}
    </motion.div>
  )
}

// Scroll-based opacity and blur effects
interface ScrollRevealProps {
  children: ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'blur'
  delay?: number
  distance?: number
}

export const ScrollReveal = ({ 
  children, 
  className = '',
  direction = 'up',
  distance = 50
}: ScrollRevealProps) => {
  const ref = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  })

  // Always call hooks in the same order
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])
  const yTransform = useTransform(scrollYProgress, [0, 0.3], [distance, 0])
  const yTransformReverse = useTransform(scrollYProgress, [0, 0.3], [-distance, 0])
  const xTransform = useTransform(scrollYProgress, [0, 0.3], [distance, 0])
  const xTransformReverse = useTransform(scrollYProgress, [0, 0.3], [-distance, 0])
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.8, 1])
  const blur = useTransform(scrollYProgress, [0, 0.3], [10, 0])
  const blurFilter = useTransform(blur, (v) => `blur(${v}px)`)

  const style: { [key: string]: MotionValue<number> | MotionValue<string> } = { opacity }

  switch (direction) {
    case 'up':
      style.y = yTransform
      break
    case 'down':
      style.y = yTransformReverse
      break
    case 'left':
      style.x = xTransform
      break
    case 'right':
      style.x = xTransformReverse
      break
    case 'scale':
      style.scale = scale
      break
    case 'blur':
      style.filter = blurFilter
      break
  }

  return (
    <motion.div
      ref={ref}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  )
}