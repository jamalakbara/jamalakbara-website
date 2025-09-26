'use client'

import { motion, useAnimation } from 'framer-motion'
import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  onLoadingComplete: () => void
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const controls = useAnimation()

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsComplete(true)
          return 100
        }
        // Slower progress at the beginning and end for more realistic feel
        const increment = prev < 20 ? Math.random() * 8 + 2 : 
                         prev > 80 ? Math.random() * 2 + 1 : 
                         Math.random() * 15 + 5
        return Math.min(prev + increment, 100)
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isComplete) {
      // Wait a moment then fade out
      setTimeout(() => {
        controls.start({
          opacity: 0,
          scale: 1.1,
          transition: { duration: 0.8, ease: "easeInOut" }
        }).then(() => {
          onLoadingComplete()
        })
      }, 500)
    }
  }, [isComplete, controls, onLoadingComplete])

  return (
    <motion.div
      className="fixed inset-0 z-[99999] bg-white flex items-center justify-center"
      initial={{ opacity: 1, scale: 1 }}
      animate={controls}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent_70%)]" />
      </div>

      <div className="text-center z-10 px-6">
        {/* Logo/Title Animation */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-serif font-bold text-black mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Portfolio
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-gray-600 font-light tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Crafting Digital Experiences
          </motion.p>
        </motion.div>

        {/* Loading Animation */}
        <div className="w-64 mx-auto mb-8">
          {/* Progress Bar Container */}
          <div className="relative h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-black rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "easeOut" }}
            />
          </div>
          
          {/* Progress Text */}
          <motion.div 
            className="mt-4 text-sm text-gray-500 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {Math.round(progress)}%
          </motion.div>
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-black rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Loading Text */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <motion.p 
            className="text-sm text-gray-400 font-light tracking-widest uppercase"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Loading Experience
          </motion.p>
        </motion.div>
      </div>

      {/* Subtle Circular Animation in Background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 border border-black rounded-full"
          style={{ x: "-50%", y: "-50%" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 border border-black rounded-full"
          style={{ x: "-50%", y: "-50%" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </motion.div>
  )
}