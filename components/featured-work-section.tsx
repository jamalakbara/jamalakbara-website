'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getStaticContent } from '@/lib/content-manager'

const projects = getStaticContent.homepageShowcaseProjects()

export function FeaturedWorkSection() {
  const ref = useRef(null)
  const [hasAnimated, setHasAnimated] = useState(false)
  const isInView = useInView(ref, { once: false, margin: "-100px" })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showMagnifier, setShowMagnifier] = useState(false)
  const [headingRect, setHeadingRect] = useState({ left: 0, top: 0, width: 0, height: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [hoveredImage, setHoveredImage] = useState<string | null>(null)
  const [imageRects, setImageRects] = useState<{[key: string]: DOMRect}>({})

  // Trigger initial animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Scroll progress tracking for mobile magnifier
  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = (ref.current as HTMLElement).getBoundingClientRect()
        const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight))
        setScrollProgress(progress)
      }
    }

    if (isMobile) {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [isMobile])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    if (showMagnifier) {
      window.addEventListener('mousemove', handleMouseMove)
      document.body.style.cursor = 'none'
    } else {
      document.body.style.cursor = 'auto'
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.body.style.cursor = 'auto'
    }
  }, [showMagnifier])

  // Track image positions for color restoration effect
  useEffect(() => {
    const updateImageRects = () => {
      const rects: {[key: string]: DOMRect} = {}
      projects.forEach(project => {
        const element = document.getElementById(`project-${project.id}`)
        if (element) {
          rects[`project-${project.id}`] = element.getBoundingClientRect()
        }
      })
      setImageRects(rects)
    }

    updateImageRects()
    window.addEventListener('resize', updateImageRects)
    window.addEventListener('scroll', updateImageRects)

    return () => {
      window.removeEventListener('resize', updateImageRects)
      window.removeEventListener('scroll', updateImageRects)
    }
  }, [])

  // Handle mouse enter/leave for images
  const handleImageMouseEnter = (projectId: string) => {
    if (!isMobile) {
      setHoveredImage(projectId)
    }
  }

  const handleImageMouseLeave = () => {
    setHoveredImage(null)
  }

  const handleMouseEnter = () => {
    if (isMobile) return // Disable on mobile
    
    if (headingRef.current) {
      const rect = headingRef.current.getBoundingClientRect()
      setHeadingRect({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
      })
    }
    setShowMagnifier(true)
    // Disable global cursor effects for this element
    document.body.setAttribute('data-disable-cursor', 'true')
  }

  const handleMouseLeave = () => {
    if (isMobile) return // Disable on mobile
    
    setShowMagnifier(false)
    // Re-enable global cursor effects
    document.body.removeAttribute('data-disable-cursor')
  }

  // Determine if magnifier should show (mobile: scroll-based, desktop: hover)
  const shouldShowMagnifier = isMobile ? (scrollProgress > 0.3 && scrollProgress < 0.7) : showMagnifier

  // Create color restoration effect with dynamic CSS variables
  useEffect(() => {
    const updateCursorPosition = () => {
      if (hoveredImage) {
        const rect = imageRects[hoveredImage]
        if (rect) {
          const relativeX = mousePosition.x - rect.left
          const relativeY = mousePosition.y - rect.top

          document.documentElement.style.setProperty('--cursor-x', `${relativeX}px`)
          document.documentElement.style.setProperty('--cursor-y', `${relativeY}px`)
        }
      }
    }

    updateCursorPosition()
  }, [mousePosition, hoveredImage, imageRects])
  
  // Calculate horizontal position for mobile magnifier animation (left to right)
  const getMagnifierPosition = () => {
    if (!isMobile || !shouldShowMagnifier) return { x: '50%', y: '50%' }
    
    // Map scroll progress (0.3 to 0.7) to horizontal movement (10% to 90%)
    const normalizedProgress = Math.max(0, Math.min(1, (scrollProgress - 0.3) / 0.4))
    const xPosition = 10 + (normalizedProgress * 80) // 10% to 90%
    
    return { x: `${xPosition}%`, y: '50%' }
  }
  
  const magnifierPos = getMagnifierPosition()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const projectVariants = {
    hidden: { 
      opacity: 0, 
      y: 80,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 60,
        damping: 20,
        duration: 0.8,
      },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  }

  return (
    <section id="work" className="py-32 px-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          variants={titleVariants}
          initial="hidden"
          animate={(isInView || hasAnimated) ? "visible" : "hidden"}
          className="text-center mb-20"
        >
          <div 
            className="relative inline-block"
            data-no-cursor="true"
          >
            <h2
              ref={headingRef}
              className="text-5xl md:text-6xl font-serif font-bold text-black dark:text-white mb-6 relative overflow-hidden cursor-none transition-colors duration-300"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <span className="relative z-10">
                Portfolio Showcase
                {/* Hide original text in magnified area */}
                {shouldShowMagnifier && (
                  <span
                    className="absolute inset-0 bg-gray-50 dark:bg-gray-900 pointer-events-none z-10 transition-colors duration-300"
                    style={{
                      clipPath: isMobile 
                        ? `circle(50px at ${magnifierPos.x} ${magnifierPos.y})` 
                        : `circle(35px at ${mousePosition.x - headingRect.left}px ${mousePosition.y - headingRect.top}px)`,
                    }}
                  />
                )}
              </span>
              {/* Magnified text overlay - appears only in circular area around cursor */}
              {shouldShowMagnifier && (
                <div
                  className="absolute inset-0 pointer-events-none z-20"
                  style={{
                    clipPath: isMobile 
                      ? `circle(50px at ${magnifierPos.x} ${magnifierPos.y})` 
                      : `circle(35px at ${mousePosition.x - headingRect.left}px ${mousePosition.y - headingRect.top}px)`,
                  }}
                >
                  <span 
                    className="text-5xl md:text-6xl font-serif font-bold text-blue-600 absolute whitespace-nowrap"
                    style={{
                      transform: `scale(1.4)`,
                      transformOrigin: isMobile ? `${magnifierPos.x} ${magnifierPos.y}` : `${mousePosition.x - headingRect.left}px ${mousePosition.y - headingRect.top}px`,
                      left: 0,
                      top: 0,
                    }}
                  >
                    Portfolio Showcase
                  </span>
                </div>
              )}
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-sans max-w-2xl mx-auto transition-colors duration-300">
            Explore Jamal Akbar Alam&apos;s portfolio featuring innovative web development projects, creative designs, and technical excellence built with modern technologies
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={(isInView || hasAnimated) ? "visible" : "hidden"}
          className="space-y-24"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={projectVariants}
              className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}
            >
              {/* Project Image */}
              <motion.div
                className="lg:w-1/2 relative group w-full"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <motion.div
                  className="relative overflow-hidden transition-colors duration-300"
                  whileHover={{
                    rotateX: 2,
                    rotateY: index % 2 === 0 ? 3 : -3,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={{
                    transformPerspective: "1000px",
                  }}
                >
                  <div className="relative overflow-hidden" style={{
                    aspectRatio: '16/10',
                    minHeight: isMobile ? '200px' : 'auto'
                  }}>
                    {project.livePreview ? (
                      <motion.div
                        id={`project-${project.id}`}
                        className="w-full h-full relative group"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.7, type: "spring", stiffness: 200 }}
                        style={{
                          transformOrigin: 'center center'
                        }}
                        onMouseEnter={() => handleImageMouseEnter(`project-${project.id}`)}
                        onMouseLeave={handleImageMouseLeave}
                        onMouseMove={(e) => {
                          if (hoveredImage === `project-${project.id}`) {
                            setMousePosition({ x: e.clientX, y: e.clientY })
                          }
                        }}
                      >
                        {/* Mobile-friendly image using Next.js Image */}
                        <motion.div
                          className="w-full h-full relative overflow-hidden"
                          whileHover={{ scale: 1.005 }}
                          transition={{ duration: 0.6, type: "spring", stiffness: 150 }}
                        >
                          {/* Use Next.js Image for better mobile compatibility and optimization */}
                          <Image
                            src={project.image}
                            alt={`${project.title} - Portfolio project by Jamal Akbar Alam showcasing ${project.category} development with ${project.tech.slice(0, 3).join(', ')} technologies`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={index === 0}
                            style={{
                              minHeight: '200px'
                            }}
                          />

                          </motion.div>

                        {/* Visit button outside image area */}
                        <motion.div
                          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-400"
                          initial={{ y: 10 }}
                          whileHover={{ y: 0 }}
                        >
                          <Link href={`/project/${project.id}`}>
                            <div className="inline-flex items-center gap-2 bg-cyan-400 text-black px-4 py-2 font-mono text-xs tracking-wider cursor-pointer hover:gap-3 transition-all duration-300">
                              VIEW LIVE
                              <motion.div
                                className="w-4 h-4 border border-black flex items-center justify-center transition-colors duration-300"
                                whileHover={{ x: 2 }}
                              >
                                →
                              </motion.div>
                            </div>
                          </Link>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div
                        id={`project-${project.id}`}
                        className="w-full h-full relative group"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.7, type: "spring", stiffness: 200 }}
                        onMouseEnter={() => handleImageMouseEnter(`project-${project.id}`)}
                        onMouseLeave={handleImageMouseLeave}
                        onMouseMove={(e) => {
                          if (hoveredImage === `project-${project.id}`) {
                            setMousePosition({ x: e.clientX, y: e.clientY })
                          }
                        }}
                      >
                        {/* Mobile-friendly image using Next.js Image */}
                        <motion.div
                          className="w-full h-full relative overflow-hidden"
                          whileHover={{ scale: 1.005 }}
                          transition={{ duration: 0.6, type: "spring", stiffness: 150 }}
                        >
                          {/* Use Next.js Image for better mobile compatibility and optimization */}
                          <Image
                            src={project.image}
                            alt={`${project.title} - Portfolio project by Jamal Akbar Alam showcasing ${project.category} development with ${project.tech.slice(0, 3).join(', ')} technologies`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={index === 0}
                            style={{
                              minHeight: '200px'
                            }}
                          />

                          </motion.div>

                        </motion.div>
                    )}
                </div>
                </motion.div>
              </motion.div>

              {/* Project Info */}
              <div className="lg:w-1/2 space-y-6 w-full">
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  transition={{ delay: 0.2 * index, duration: 0.8 }}
                >
                  {/* Category & Year */}
                  <div className="flex items-center gap-4 mb-4">
                    <motion.span 
                      className="text-sm font-mono tracking-wider text-gray-500 uppercase"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ delay: 0.3 * index }}
                    >
                      {project.category}
                    </motion.span>
                    <div className="w-12 h-px bg-gray-300" />
                    <span className="text-sm font-mono text-gray-500">
                      {project.year}
                    </span>
                  </div>

                  {/* Title */}
                  <motion.h3 
                    className="text-3xl md:text-4xl font-serif font-bold text-black dark:text-white mb-4 transition-colors duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.4 * index }}
                  >
                    {project.title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p 
                    className="text-gray-600 dark:text-gray-400 font-sans text-lg leading-relaxed mb-6 transition-colors duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.5 * index }}
                  >
                    {project.description}
                  </motion.p>

                  {/* Tech Stack */}
                  <motion.div 
                    className="flex flex-wrap gap-3"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.6 * index }}
                  >
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-mono transition-colors duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </motion.div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.7 * index }}
                    className="pt-6"
                  >
                    <Link href={`/project/${project.id}`}>
                      <div className="inline-flex items-center gap-3 text-black dark:text-white font-medium border-b border-black dark:border-white pb-1 group-hover:gap-4 transition-all duration-300 cursor-pointer">
                        <span>View Project</span>
                        <motion.div
                          className="w-6 h-6 border border-black dark:border-white flex items-center justify-center transition-colors duration-300"
                          whileHover={{ x: 5 }}
                        >
                          →
                        </motion.div>
                      </div>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center pt-12"
        >
          <Link href="/portfolio">
            <div className="group inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-black dark:border-white text-black dark:text-white font-mono text-sm font-medium tracking-wider uppercase transition-all duration-300 hover:bg-black hover:text-white cursor-pointer hover:gap-4">
              <span>View All Projects</span>
              <motion.div
                className="w-6 h-6 border border-black dark:border-white flex items-center justify-center transition-colors duration-300"
                whileHover={{ x: 5 }}
              >
                →
              </motion.div>
            </div>
          </Link>
        </motion.div>

        {/* Custom Magnifying Glass Cursor - Desktop only */}
        {shouldShowMagnifier && !isMobile && (
          <motion.div
            className="fixed pointer-events-none z-50"
            style={{
              left: mousePosition.x - 25,
              top: mousePosition.y - 25,
              width: '50px',
              height: '50px',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Magnifying glass lens - transparent */}
            <div
              className="w-full h-full border-3 border-black rounded-full"
              style={{
                background: 'transparent',
              }}
            />
            {/* Magnifying glass handle */}
            <div
              className="absolute w-4 h-1.5 bg-black rounded-full"
              style={{
                bottom: '-8px',
                right: '-6px',
                transform: 'rotate(45deg)',
              }}
            />
            </motion.div>
        )}
      </div>
    </section>
  )
}