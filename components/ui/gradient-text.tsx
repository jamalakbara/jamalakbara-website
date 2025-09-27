'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GradientTextProps {
  children: React.ReactNode
  className?: string
  gradient?: 'primary' | 'secondary' | 'accent' | 'rainbow'
  customGradient?: string
  animated?: boolean
  animationType?: 'flow' | 'shimmer' | 'pulse'
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
}

const gradients = {
  primary: 'from-white via-zinc-300 to-zinc-500',
  secondary: 'from-blue-400 via-purple-500 to-pink-500',
  accent: 'from-amber-400 via-orange-500 to-red-500',
  rainbow: 'from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500'
}

const animations = {
  flow: {
    backgroundSize: '200% 200%',
    animation: 'gradient-flow 3s ease infinite'
  },
  shimmer: {
    backgroundSize: '200% 100%',
    animation: 'shimmer 2s ease-in-out infinite'
  },
  pulse: {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  }
}

export function GradientText({
  children,
  className,
  gradient = 'primary',
  customGradient,
  animated = false,
  animationType = 'flow',
  as: Component = 'span'
}: GradientTextProps) {
  const gradientClass = customGradient || `bg-gradient-to-r ${gradients[gradient]}`
  
  const baseClasses = cn(
    'bg-clip-text text-transparent',
    gradientClass,
    animated && 'animate-gradient',
    className
  )

  const style = animated ? animations[animationType] : undefined

  return (
    <Component 
      className={baseClasses}
      style={style}
    >
      {children}
      
      {/* Add CSS keyframes to global styles */}
      {animated && (
        <style jsx global>{`
          @keyframes gradient-flow {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          
          .animate-gradient {
            ${animationType === 'flow' ? 'background-size: 200% 200%; animation: gradient-flow 3s ease infinite;' : ''}
            ${animationType === 'shimmer' ? 'background-size: 200% 100%; animation: shimmer 2s ease-in-out infinite;' : ''}
          }
        `}</style>
      )}
    </Component>
  )
}

// Animated version with Framer Motion
export function AnimatedGradientText({
  children,
  className,
  gradient = 'primary',
  customGradient,
  delay = 0
}: Omit<GradientTextProps, 'animated' | 'animationType' | 'as'> & {
  delay?: number
}) {
  const gradientClass = customGradient || `bg-gradient-to-r ${gradients[gradient]}`

  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        ease: "easeOut"
      }}
      className={cn(
        'bg-clip-text text-transparent',
        gradientClass,
        className
      )}
    >
      {children}
    </motion.span>
  )
}