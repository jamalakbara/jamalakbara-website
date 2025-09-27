'use client'

import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion'
import { useRef } from 'react'

interface ParallaxLayerProps {
  children: React.ReactNode
  speed?: number
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
  offset?: number
}

export const ParallaxLayer = ({ 
  children, 
  speed = 0.5, 
  className = '',
  direction = 'up',
  offset = 0
}: ParallaxLayerProps) => {
  const ref = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const range = [-100 * speed + offset, 100 * speed + offset]

  // Always call hooks in the same order
  const transformUp = useTransform(smoothProgress, [0, 1], range)
  const transformDown = useTransform(smoothProgress, [0, 1], range.slice().reverse())
  const transformLeft = useTransform(smoothProgress, [0, 1], range)
  const transformRight = useTransform(smoothProgress, [0, 1], range.slice().reverse())

  // Select which transform to use based on direction
  let transform
  let style: { [key: string]: MotionValue<number> } = {}

  switch (direction) {
    case 'down':
      transform = transformDown
      style = { y: transform }
      break
    case 'left':
      transform = transformLeft
      style = { x: transform }
      break
    case 'right':
      transform = transformRight
      style = { x: transform }
      break
    case 'up':
    default:
      transform = transformUp
      style = { y: transform }
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

export const ParallaxContainer = () => {
  const { scrollYProgress } = useScroll()
  
  // Multiple parallax layers with different speeds
  const layer1Y = useTransform(scrollYProgress, [0, 1], [0, -200])
  const layer2Y = useTransform(scrollYProgress, [0, 1], [0, -400])
  const layer3Y = useTransform(scrollYProgress, [0, 1], [0, -600])
  
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 15])
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, -15])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1])

  // Create transforms for particles outside the render loop
  const particleTransform1 = useTransform(scrollYProgress, [0, 1], [0, -100 - (0 * 20)])
  const particleTransform2 = useTransform(scrollYProgress, [0, 1], [0, -100 - (1 * 20)])
  const particleTransform3 = useTransform(scrollYProgress, [0, 1], [0, -100 - (2 * 20)])
  const particleTransform4 = useTransform(scrollYProgress, [0, 1], [0, -100 - (3 * 20)])
  const particleTransform5 = useTransform(scrollYProgress, [0, 1], [0, -100 - (4 * 20)])
  const particleTransform6 = useTransform(scrollYProgress, [0, 1], [0, -100 - (5 * 20)])
  const particleTransform7 = useTransform(scrollYProgress, [0, 1], [0, -100 - (6 * 20)])
  const particleTransform8 = useTransform(scrollYProgress, [0, 1], [0, -100 - (7 * 20)])
  const particleTransform9 = useTransform(scrollYProgress, [0, 1], [0, -100 - (8 * 20)])
  const particleTransform10 = useTransform(scrollYProgress, [0, 1], [0, -100 - (9 * 20)])
  const particleTransform11 = useTransform(scrollYProgress, [0, 1], [0, -100 - (10 * 20)])
  const particleTransform12 = useTransform(scrollYProgress, [0, 1], [0, -100 - (11 * 20)])
  
  const particleTransforms = [
    particleTransform1, particleTransform2, particleTransform3, particleTransform4,
    particleTransform5, particleTransform6, particleTransform7, particleTransform8,
    particleTransform9, particleTransform10, particleTransform11, particleTransform12
  ]
  
  const gradientTransform = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      'radial-gradient(circle at 30% 20%, rgba(0,0,0,0.02), transparent 50%)',
      'radial-gradient(circle at 70% 80%, rgba(0,0,0,0.03), transparent 50%)',
      'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.02), transparent 50%)'
    ]
  )

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background Geometric Shapes - Layer 1 (Slowest) */}
      <motion.div
        style={{ y: layer1Y }}
        className="absolute inset-0"
      >
        <div className="absolute top-20 left-10 w-32 h-32 border border-gray-200 dark:border-gray-800 rotate-45 opacity-20" />
        <div className="absolute top-60 right-20 w-24 h-24 bg-gray-100 dark:bg-gray-900 rounded-full opacity-30" />
        <div className="absolute bottom-40 left-1/3 w-16 h-16 border-2 border-gray-300 dark:border-gray-700 opacity-25" />
      </motion.div>

      {/* Mid-ground Elements - Layer 2 (Medium) */}
      <motion.div
        style={{ y: layer2Y, rotateX, rotateY }}
        className="absolute inset-0"
      >
        <div className="absolute top-1/4 right-1/4 w-64 h-64 border border-gray-100 dark:border-gray-900 rounded-full opacity-10" />
        <div className="absolute bottom-1/3 left-1/4 w-48 h-2 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent opacity-20" />
        <div className="absolute top-3/4 right-1/3 w-20 h-20 bg-gray-50 dark:bg-gray-950 transform rotate-12 opacity-15" />
      </motion.div>

      {/* Foreground Elements - Layer 3 (Fastest) */}
      <motion.div
        style={{ y: layer3Y, scale }}
        className="absolute inset-0"
      >
        <div className="absolute top-10 right-10 w-8 h-8 bg-black dark:bg-white opacity-10 rounded-full" />
        <div className="absolute bottom-20 left-20 w-12 h-1 bg-gray-400 dark:bg-gray-600 opacity-30" />
        <div className="absolute top-1/2 left-10 w-6 h-6 border border-gray-500 dark:border-gray-500 rotate-45 opacity-20" />
      </motion.div>

      {/* Floating Particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gray-400 dark:bg-gray-600 rounded-full opacity-40"
          style={{
            left: `${10 + (i * 7)}%`,
            top: `${20 + (i * 5)}%`,
            y: particleTransforms[i],
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3 + (i * 0.5),
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Gradient Overlay for Depth */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: gradientTransform
        }}
      />
    </div>
  )
}