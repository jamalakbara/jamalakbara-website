'use client'

import { motion, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

interface VelocityScaleProps {
  children: React.ReactNode
  className?: string
  maxScale?: number
  sensitivity?: number
}

export const VelocityScale = ({
  children,
  className = '',
  maxScale = 1.05,
  sensitivity = 1000
}: VelocityScaleProps) => {
  const ref = useRef(null)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)

  const scale = useTransform(
    scrollVelocity,
    [-sensitivity, 0, sensitivity],
    [maxScale, 1, maxScale]
  )

  const smoothScale = useSpring(scale, {
    stiffness: 300,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <motion.div
      ref={ref}
      style={{ scale: smoothScale }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface VelocityBlurProps {
  children: React.ReactNode
  className?: string
  maxBlur?: number
  sensitivity?: number
}

export const VelocityBlur = ({
  children,
  className = '',
  maxBlur = 5,
  sensitivity = 1000
}: VelocityBlurProps) => {
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)

  const blur = useTransform(
    scrollVelocity,
    [-sensitivity, 0, sensitivity],
    [maxBlur, 0, maxBlur]
  )

  const smoothBlur = useSpring(blur, {
    stiffness: 100,
    damping: 30
  })

  return (
    <motion.div
      style={{
        filter: useTransform(smoothBlur, (v) => `blur(${Math.abs(v)}px)`)
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface VelocityRotateProps {
  children: React.ReactNode
  className?: string
  maxRotation?: number
  sensitivity?: number
}

export const VelocityRotate = ({
  children,
  className = '',
  maxRotation = 2,
  sensitivity = 500
}: VelocityRotateProps) => {
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)

  const rotate = useTransform(
    scrollVelocity,
    [-sensitivity, 0, sensitivity],
    [-maxRotation, 0, maxRotation]
  )

  const smoothRotate = useSpring(rotate, {
    stiffness: 200,
    damping: 30
  })

  return (
    <motion.div
      style={{ rotate: smoothRotate }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Scroll direction detector with animations
export const ScrollDirectionIndicator = () => {
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | 'idle'>('idle')

  useEffect(() => {
    const unsubscribe = scrollVelocity.on('change', (latest) => {
      if (Math.abs(latest) < 50) {
        setScrollDirection('idle')
      } else if (latest > 0) {
        setScrollDirection('down')
      } else {
        setScrollDirection('up')
      }
    })

    return () => unsubscribe()
  }, [scrollVelocity])

  return (
    <motion.div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-black/80 dark:bg-white/80 text-white dark:text-black backdrop-blur-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{
        opacity: scrollDirection !== 'idle' ? 1 : 0,
        y: scrollDirection !== 'idle' ? 0 : -20
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="flex items-center space-x-2 text-sm font-medium"
        animate={{
          y: scrollDirection === 'up' ? -2 : scrollDirection === 'down' ? 2 : 0
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.span
          animate={{
            rotate: scrollDirection === 'up' ? 180 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          ↓
        </motion.span>
        <span>
          {scrollDirection === 'up' ? 'Scrolling Up' :
            scrollDirection === 'down' ? 'Scrolling Down' : 'Idle'}
        </span>
      </motion.div>
    </motion.div>
  )
}

// Velocity-based particle system
export const VelocityParticles = () => {
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number }>>([])

  useEffect(() => {
    const unsubscribe = scrollVelocity.on('change', (latest) => {
      if (Math.abs(latest) > 200) {
        const newParticles = Array.from({ length: 5 }, (_, i) => ({
          id: Date.now() + Math.random() + i, // More unique with random addition
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight
        }))

        setParticles(prev => [...prev, ...newParticles].slice(-20)) // Keep max 20 particles

        // Remove particles after animation
        setTimeout(() => {
          setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)))
        }, 1000)
      }
    })

    return () => unsubscribe()
  }, [scrollVelocity])

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-black/30 dark:bg-white/30"
          initial={{
            x: particle.x,
            y: particle.y,
            scale: 0,
            opacity: 1
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            y: particle.y - 50
          }}
          transition={{
            duration: 1,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  )
}

// Speed lines effect
export const SpeedLines = () => {
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)

  const opacity = useTransform(
    scrollVelocity,
    [-1000, -500, 500, 1000],
    [0.8, 0, 0, 0.8]
  )

  const scaleY = useTransform(
    scrollVelocity,
    [-1000, 0, 1000],
    [1.5, 0.1, 1.5]
  )

  return (
    <div className="fixed inset-0 pointer-events-none z-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-full w-px bg-gradient-to-b from-transparent via-black/20 dark:via-white/20 to-transparent"
          style={{
            left: `${10 + i * 10}%`,
            opacity,
            scaleY
          }}
          initial={{ opacity: 0 }}
        />
      ))}
    </div>
  )
}