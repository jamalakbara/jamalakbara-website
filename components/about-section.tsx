'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef } from 'react'

export function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"])

  const marqueeText = "DESIGN • DEVELOPMENT • STRATEGY • CREATIVITY • INNOVATION • "

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

  const slideInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut" as const,
        delay: 0.2
      }
    }
  }

  const slideInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut" as const,
        delay: 0.4
      }
    }
  }

  return (
    <>
      {/* Marquee Text - Full Width, No Padding */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="mt-16 mb-16 overflow-hidden whitespace-nowrap w-full"
        style={{ height: '120px' }}
      >
        <div className="marquee-single text-6xl md:text-8xl font-mono font-bold text-gray-200 dark:text-gray-800 transition-colors duration-300">
          {marqueeText}{marqueeText}{marqueeText}{marqueeText}
        </div>
      </motion.div>

      <section id="about" className="py-8 px-6 bg-white dark:bg-black transition-colors duration-300 overflow-hidden" ref={ref}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Profile Image with Parallax */}
          <motion.div 
            className="relative order-2 lg:order-1"
            variants={slideInLeft}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div
              style={{ y: imageY }}
              className="relative aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-300 overflow-hidden"
            >
              {/* Placeholder for profile image */}
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500 font-mono text-lg">
                  Profile Image
                </span>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-16 h-16 border-2 border-black dark:border-white transition-colors duration-300" />
              <div className="absolute bottom-4 left-4 w-8 h-8 bg-black dark:bg-white transition-colors duration-300" />
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div 
            className="space-y-8 order-1 lg:order-2"
            variants={slideInRight}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.h2 
              className="text-5xl md:text-6xl font-serif font-bold text-black dark:text-white leading-tight transition-colors duration-300"
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              About the Studio
            </motion.h2>

            <motion.div 
              className="space-y-6"
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <p className="text-xl text-gray-700 dark:text-gray-300 font-sans leading-relaxed transition-colors duration-300">
                With over 5 years of experience in digital design and development, 
                I specialize in creating meaningful experiences that bridge the gap 
                between beautiful design and functional technology.
              </p>

              <p className="text-lg text-gray-600 dark:text-gray-400 font-sans leading-relaxed transition-colors duration-300">
                My approach combines strategic thinking with creative execution, 
                ensuring every project not only looks exceptional but also serves 
                its intended purpose with precision and elegance.
              </p>

              <p className="text-lg text-gray-600 dark:text-gray-400 font-sans leading-relaxed transition-colors duration-300">
                Based in the heart of creativity, I work with forward-thinking 
                brands and startups who value innovation and aren&apos;t afraid to push 
                boundaries in their digital presence.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200"
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <div className="text-center">
                <div className="text-3xl font-serif font-bold text-black dark:text-white mb-2 transition-colors duration-300">50+</div>
                <div className="text-sm font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-serif font-bold text-black dark:text-white mb-2 transition-colors duration-300">5</div>
                <div className="text-sm font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">Years</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-serif font-bold text-black dark:text-white mb-2 transition-colors duration-300">100%</div>
                <div className="text-sm font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">Passion</div>
              </div>
            </motion.div>

            {/* Philosophy */}
            <motion.div 
              className="bg-gray-50 dark:bg-gray-800 p-8 border-l-4 border-black dark:border-white transition-colors duration-300"
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <p className="text-lg font-serif italic text-black dark:text-white leading-relaxed transition-colors duration-300">
                &ldquo;Great design is not about making something look good. 
                It&apos;s about making something work beautifully.&rdquo;
              </p>
            </motion.div>
          </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}