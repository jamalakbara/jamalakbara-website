'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  description?: string
  className?: string
  alignment?: 'left' | 'center' | 'right'
  titleVariant?: 'default' | 'gradient' | 'outlined'
  showDivider?: boolean
  customIcon?: React.ReactNode
  badge?: string
}

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.2,
      ease: "easeOut" as const
    }
  }
}

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const
    }
  }
}

const alignmentClasses = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end'
}

const titleVariants = {
  default: 'text-white',
  gradient: 'bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent',
  outlined: 'text-white stroke-white stroke-1 [-webkit-text-stroke:1px_white]'
}

export function SectionHeader({
  title,
  subtitle,
  description,
  className,
  alignment = 'center',
  titleVariant = 'default',
  showDivider = false,
  customIcon,
  badge
}: SectionHeaderProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={cn(
        'flex flex-col gap-4 mb-16',
        alignmentClasses[alignment],
        className
      )}
    >
      {/* Badge */}
      {badge && (
        <motion.div variants={childVariants}>
          <div className="inline-flex items-center px-3 py-1 text-xs font-semibold text-white bg-zinc-800/50 border border-zinc-700 rounded-full backdrop-blur-sm">
            {badge}
          </div>
        </motion.div>
      )}

      {/* Custom Icon */}
      {customIcon && (
        <motion.div variants={childVariants}>
          {customIcon}
        </motion.div>
      )}

      {/* Subtitle */}
      {subtitle && (
        <motion.h3 
          variants={childVariants}
          className="text-zinc-400 text-lg font-medium tracking-wide uppercase"
        >
          {subtitle}
        </motion.h3>
      )}

      {/* Main Title */}
      <motion.h2 
        variants={childVariants}
        className={cn(
          'text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.9]',
          titleVariants[titleVariant]
        )}
      >
        {title}
      </motion.h2>

      {/* Divider */}
      {showDivider && (
        <motion.div
          variants={childVariants}
          className="flex justify-center"
        >
          <motion.div
            className="w-24 h-0.5 bg-gradient-to-r from-transparent via-zinc-400 to-transparent"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
        </motion.div>
      )}

      {/* Description */}
      {description && (
        <motion.p 
          variants={childVariants}
          className="text-zinc-400 text-lg leading-relaxed max-w-2xl"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  )
}