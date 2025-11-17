'use client'

import { motion, type Variants, type HTMLMotionProps, type TargetAndTransition } from 'framer-motion'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'cta' | 'outline' | 'dark' | 'emerald' | 'gray'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  hoverScale?: number
  tapScale?: number
  customAnimation?: Variants
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  isLoading?: boolean
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  animationType?: 'scale' | 'slide' | 'bounce' | 'rotate'
}

const variants = {
  primary: 'bg-white text-zinc-900 hover:bg-zinc-100 border border-zinc-200',
  secondary: 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700',
  ghost: 'bg-transparent border border-zinc-800 text-white hover:bg-zinc-800/50',
  cta: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700',
  outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-black hover:text-white',
  dark: 'bg-black text-white hover:bg-gray-800',
  emerald: 'bg-emerald-600 text-white hover:bg-emerald-700',
  gray: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  icon: 'p-2'
}

const roundedStyles = {
  none: '',
  sm: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full'
}

const getAnimationVariants = (type: string, scale: number): {
  whileHover: TargetAndTransition
  whileTap: TargetAndTransition
} => {
  switch (type) {
    case 'slide':
      return {
        whileHover: { x: 5, scale: scale },
        whileTap: { x: 0, scale: scale - 0.1 }
      }
    case 'bounce':
      return {
        whileHover: {
          scale: scale,
          transition: { type: "spring", stiffness: 400, damping: 10 }
        },
        whileTap: { scale: scale - 0.1 }
      }
    case 'rotate':
      return {
        whileHover: {
          scale: scale,
          rotate: [0, 2, -2, 0],
          transition: { duration: 0.5 }
        },
        whileTap: { scale: scale - 0.1 }
      }
    default: // scale
      return {
        whileHover: { scale: scale },
        whileTap: { scale: scale - 0.1 }
      }
  }
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    hoverScale = 1.05,
    customAnimation,
    iconLeft,
    iconRight,
    isLoading = false,
    disabled,
    rounded = 'md',
    animationType = 'scale',
    ...props
  }, ref) => {
    const defaultAnimation: Variants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    }

    const animation = customAnimation || defaultAnimation
    const animationProps = getAnimationVariants(animationType, hoverScale)

    return (
      <motion.button
        ref={ref}
        variants={animation}
        initial="initial"
        animate="animate"
        exit="exit"
        whileHover={animationProps.whileHover}
        whileTap={animationProps.whileTap}
        className={cn(
          'relative inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden',
          variants[variant],
          sizes[size],
          roundedStyles[rounded],
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