'use client'

import { motion, useScroll, useTransform, useAnimation } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

export function HeroSection() {
  const ref = useRef(null)
  const controls = useAnimation()
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const heroText = "Creative Developer & Designer"
  const subText = "Crafting digital experiences with precision and artistry"

  const words = heroText.split(' ')
  const subWords = subText.split(' ')

  // Auto-animate subtitle words periodically
  useEffect(() => {
    let animationTimeout: NodeJS.Timeout
    
    const animateWords = async () => {
      // Wait for initial load (dipercepat dari 4 detik jadi 3 detik)
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const runAnimation = async () => {
        // Animate each word with faster stagger
        for (let i = 0; i < subWords.length; i++) {
          controls.start((index) => {
            if (index === i) {
              const variants = [
                // Quick glow (dipercepat dari 0.8s jadi 0.5s)
                { 
                  scale: [1, 1.08, 1], 
                  color: ["#6b7280", "#000", "#6b7280"],
                  textShadow: ["none", "0 0 8px rgba(0,0,0,0.3)", "none"],
                  transition: { duration: 0.5 }
                },
                // Gentle bounce (dipercepat dari 0.6s jadi 0.4s)
                { 
                  y: [0, -4, 0], 
                  scale: [1, 1.03, 1],
                  color: ["#6b7280", "#333", "#6b7280"],
                  transition: { duration: 0.4 }
                },
                // Pulse effect (dipercepat dari 0.5s jadi 0.3s)
                { 
                  scale: [1, 1.06, 1], 
                  color: ["#6b7280", "#222", "#6b7280"],
                  transition: { duration: 0.3 }
                }
              ]
              return variants[i % variants.length]
            }
            return {}
          })
          // Faster delay between words (dipercepat dari 300ms jadi 200ms)
          await new Promise(resolve => setTimeout(resolve, 200))
        }
        
        // Shorter wait before next cycle (dipercepat dari 5 detik jadi 3 detik)
        await new Promise(resolve => setTimeout(resolve, 3000))
        runAnimation()
      }
      
      runAnimation()
    }
    
    animateWords()
    
    return () => {
      if (animationTimeout) {
        clearTimeout(animationTimeout)
      }
    }
  }, [controls, subWords.length])

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  }

  const hoverVariant = {
    scale: 1.05,
    rotate: [-1, 1, -1, 0],
    transition: {
      duration: 0.3,
      ease: "easeInOut" as const
    }
  }

  return (
    <motion.section
      id="hero"
      ref={ref}
      style={{ y, opacity }}
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-white"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Headline with Staggered Animation */}
        <motion.h1
          variants={container}
          initial="hidden"
          animate="visible"
          className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-black leading-tight mb-8"
        >
          {words.map((word, index) => (
            <motion.span
              key={index}
              variants={child}
              whileHover={hoverVariant}
              className="inline-block mr-4 cursor-hover"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle with Staggered Animation */}
        <motion.p
          variants={container}
          initial="hidden"
          animate="visible"
          custom={1.5}
          className="text-xl md:text-2xl text-gray-600 font-sans max-w-2xl mx-auto leading-relaxed"
        >
          {subWords.map((word, index) => (
            <motion.span
              key={index}
              custom={index}
              variants={child}
              animate={controls}
              className="inline-block mr-2"
            >
              {word}
            </motion.span>
          ))}
        </motion.p>

        {/* CTA Button with Subtle Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="mt-12 mb-16"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "#000",
              color: "#fff"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const workSection = document.getElementById('work')
              if (workSection) {
                workSection.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            className="px-8 py-4 border-2 border-black text-black font-sans font-medium text-lg transition-colors duration-300 cursor-hover"
          >
            View My Work
          </motion.button>
        </motion.div>

      </div>

      {/* Background Texture (Optional) */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent_70%)]" />
      </div>
    </motion.section>
  )
}