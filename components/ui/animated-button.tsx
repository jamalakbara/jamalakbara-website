'use client'

import { motion, type Variants, type HTMLMotionProps } from 'framer-motion'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'cta'
  size?: 'sm' | 'md' | 'lg'
  hoverScale?: number
  tapScale?: number
  customAnimation?: Variants
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  isLoading?: boolean
}

const variants = {
  primary: 'bg-white text-zinc-900 hover:bg-zinc-100 border border-zinc-200',
  secondary: 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700',
  ghost: 'bg-transparent border border-zinc-800 text-white hover:bg-zinc-800/50',
  cta: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    hoverScale = 1.05,
    tapScale = 0.95,
    customAnimation,
    iconLeft,
    iconRight,
    isLoading = false,
    disabled,
    ...props
  }, ref) => {
    const defaultAnimation: Variants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    }

    const animation = customAnimation || defaultAnimation

    return (
      <motion.button
        ref={ref}
        variants={animation}
        initial="initial"
        animate="animate"
        exit="exit"
        whileHover={{ 
          scale: hoverScale,
          transition: { type: 'spring', stiffness: 300, damping: 20 }
        }}
        whileTap={{ 
          scale: tapScale,
          transition: { duration: 0.1 }
        }}
        className={cn(
          'relative inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Ripple effect background */}
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-lg"
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        <div className="relative flex items-center gap-2 z-10">
          {iconLeft && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {iconLeft}
            </motion.div>
          )}
          
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            />
          ) : (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {children}
            </motion.span>
          )}
          
          {iconRight && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {iconRight}
            </motion.div>
          )}
        </div>
      </motion.button>
    )
  }
)

AnimatedButton.displayName = 'AnimatedButton'