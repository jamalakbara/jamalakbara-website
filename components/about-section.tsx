'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { getStaticContent } from '@/lib/content-manager'

const aboutContent = getStaticContent.about()

export function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isAboutHovered, setIsAboutHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"])

  // Update scroll progress for mobile animation
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrollProgress(latest)
    })
    
    return () => unsubscribe()
  }, [scrollYProgress])
  
  // Determine if animation should be active
  const shouldAnimate = isMobile ? scrollProgress > 0.3 && scrollProgress < 0.8 : isAboutHovered

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
        className="mt-16 mb-16 overflow-hidden whitespace-nowrap w-full flex items-center"
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
              {/* Profile Image */}
              {aboutContent.profileImage && (
                <Image
                  src={aboutContent.profileImage}
                  alt="Jamal Akbar - Creative developer and designer based in Bandung, Indonesia with 5+ years of experience"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}
              
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
              className="text-5xl md:text-6xl font-serif font-bold text-black dark:text-white leading-tight transition-colors duration-300 cursor-pointer relative"
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              onMouseEnter={() => !isMobile && setIsAboutHovered(true)}
              onMouseLeave={() => !isMobile && setIsAboutHovered(false)}
            >
              {/* Two line layout */}
              <div className="block">
                <div>{aboutContent.heading.main}</div>
                <div className="relative inline-block">
                  {/* "jamal" - disappears */}
                  <motion.span
                    className="inline-block"
                    animate={{
                      opacity: shouldAnimate ? 0 : 1,
                      scale: shouldAnimate ? 0.9 : 1
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    jamal
                  </motion.span>
                  
                  {/* "akbar" - transforms */}
                  <motion.span
                    className="inline-block relative"
                    style={{
                      background: shouldAnimate ? 'linear-gradient(45deg, #000000, #404040, #000000)' : 'transparent',
                      WebkitBackgroundClip: shouldAnimate ? 'text' : 'unset',
                      backgroundClip: shouldAnimate ? 'text' : 'unset',
                      color: shouldAnimate ? 'transparent' : 'inherit'
                    }}
                    animate={{
                      x: shouldAnimate ? -60 : 0,
                      scale: shouldAnimate ? 1.05 : 1
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1 }}
                  >
                    akbar
                  </motion.span>
                  
                  {/* "a" (after akbar) - disappears */}
                  <motion.span
                    className="inline-block"
                    animate={{
                      opacity: shouldAnimate ? 0 : 1,
                      scale: shouldAnimate ? 0.9 : 1
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    a
                  </motion.span>
                  
                  {/* "." - moves with akbar */}
                  <motion.span
                    className="inline-block"
                    animate={{
                      x: shouldAnimate ? -60 : 0
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1 }}
                  >
                    .
                  </motion.span>
                </div>
              </div>
            </motion.h2>

            <motion.div 
              className="space-y-6"
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {aboutContent.description.map((paragraph, index) => (
                <p 
                  key={index}
                  className={`${index === 0 ? 'text-xl text-gray-700 dark:text-gray-300' : 'text-lg text-gray-600 dark:text-gray-400'} font-sans leading-relaxed transition-colors duration-300`}
                >
                  {paragraph}
                </p>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200"
              variants={fadeInUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {aboutContent.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-serif font-bold text-black dark:text-white mb-2 transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>
              ))}
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