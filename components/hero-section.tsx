'use client'

import { motion, useScroll, useTransform, useAnimation } from 'framer-motion'
import { useRef, useEffect } from 'react'

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
    let animationTimeout: NodeJS.Timeout | null = null
    let isMounted = true

    const animateWords = async () => {
      // Wait for component to fully mount
      await new Promise(resolve => {
        animationTimeout = setTimeout(resolve, 100)
      })

      // Check if component is still mounted
      if (!isMounted) return

      // Wait for initial load
      await new Promise(resolve => {
        animationTimeout = setTimeout(resolve, 3000)
      })

      if (!isMounted) return

      const runAnimation = async () => {
        if (!isMounted) return

        // Animate each word with faster stagger
        for (let i = 0; i < subWords.length; i++) {
          if (!isMounted) break

          try {
            await controls.start((index) => {
              if (index === i) {
                const variants = [
                  // Quick glow
                  {
                    scale: [1, 1.08, 1],
                    color: ["#6b7280", "#000", "#6b7280"],
                    textShadow: ["none", "0 0 8px rgba(0,0,0,0.3)", "none"],
                    transition: { duration: 0.5 }
                  },
                  // Gentle bounce
                  {
                    y: [0, -4, 0],
                    scale: [1, 1.03, 1],
                    color: ["#6b7280", "#333", "#6b7280"],
                    transition: { duration: 0.4 }
                  },
                  // Pulse effect
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
          } catch (error) {
            console.warn('Animation control error:', error)
            break
          }

          // Check if still mounted before continuing
          if (!isMounted) break

          // Faster delay between words
          await new Promise(resolve => {
            animationTimeout = setTimeout(resolve, 200)
          })
        }

        // Check if still mounted before next cycle
        if (!isMounted) return

        // Shorter wait before next cycle
        await new Promise(resolve => {
          animationTimeout = setTimeout(resolve, 3000)
        })

        // Run next cycle only if still mounted
        if (isMounted) {
          runAnimation()
        }
      }

      runAnimation()
    }

    animateWords()

    return () => {
      isMounted = false
      if (animationTimeout) {
        clearTimeout(animationTimeout)
      }
    }
  }, [controls, subWords.length])

  
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

  // Scroll-triggered animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut" as const
      }
    }
  }

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
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
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-white dark:bg-black transition-colors duration-300"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Headline with Staggered Animation */}
        <motion.h1
          variants={fadeInUp}
          className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-black dark:text-white leading-tight mb-8 transition-colors duration-300"
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
          variants={fadeInUp}
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-sans max-w-2xl mx-auto leading-relaxed transition-colors duration-300"
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
          variants={fadeInUp}
          className="mt-12 mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const workSection = document.getElementById('work')
              if (workSection) {
                workSection.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            className="px-8 py-4 border-2 border-black dark:border-white text-black dark:text-white bg-transparent hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-sans font-medium text-lg transition-all duration-300 cursor-hover"
          >
            View My Work
          </motion.button>
        </motion.div>

      </div>

      {/* Background Texture (Optional) */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
      </div>
    </motion.section>
  )
}