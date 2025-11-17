'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { getStaticContent } from '@/lib/content-manager'

const services = getStaticContent.services()

export function ServicesSection() {
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [headingRect, setHeadingRect] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Trigger initial animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true)
    }, 150)
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
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    if (showMagnifier) {
      window.addEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = 'none';
    } else {
      document.body.style.cursor = 'auto';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = 'auto';
    };
  }, [showMagnifier]);

  const handleMouseEnter = () => {
    if (isMobile) return // Disable on mobile
    
    if (headingRef.current) {
      const rect = headingRef.current.getBoundingClientRect();
      setHeadingRect({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
      });
    }
    setShowMagnifier(true);
    // Disable global cursor effects for this element
    document.body.setAttribute('data-disable-cursor', 'true');
  };

  const handleMouseLeave = () => {
    if (isMobile) return // Disable on mobile
    
    setShowMagnifier(false);
    // Re-enable global cursor effects
    document.body.removeAttribute('data-disable-cursor');
  };

  // Determine if magnifier should show (mobile: scroll-based, desktop: hover)
  const shouldShowMagnifier = isMobile ? (scrollProgress > 0.3 && scrollProgress < 0.7) : showMagnifier
  
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
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      },
    },
  }

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 20,
        duration: 0.6
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
    <section id="services" className="py-32 px-6 bg-white dark:bg-black transition-colors duration-300" ref={ref}>
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
                Expertise & Services
                {/* Hide original text in magnified area */}
                {shouldShowMagnifier && (
                  <span
                    className="absolute inset-0 bg-white dark:bg-black pointer-events-none z-10 transition-colors duration-300"
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
                    Expertise & Services
                  </span>
                </div>
              )}
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-sans max-w-2xl mx-auto transition-colors duration-300">
            Professional services combining creative design with technical excellence to deliver exceptional digital experiences
          </p>
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
                boxShadow: 'inset 0 0 8px rgba(0,0,0,0.2)',
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
            {/* Lens reflection effect - subtle and transparent */}
            <div
              className="absolute top-3 left-3 w-3 h-3 border border-gray-400 rounded-full opacity-30"
              style={{
                background: 'transparent',
              }}
            />
          </motion.div>
        )}

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={(isInView || hasAnimated) ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {services.slice(0, 6).map((service) => (
            <Link href={`/service/${service.id}`} key={service.id}>
              <motion.div
                variants={cardVariants}
                whileHover={{
                  y: -10,
                  transition: { type: "spring" as const, stiffness: 400, damping: 25 }
                }}
                className="group relative cursor-pointer bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-8 h-full transition-all duration-300 hover:border-black dark:hover:border-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
              >
              {/* Service Icon */}
              <motion.div
                className="text-4xl mb-6 text-black dark:text-white font-mono transition-colors duration-300 group-hover:text-black dark:group-hover:text-white"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {service.icon}
              </motion.div>

              {/* Service Content */}
              <div className="space-y-4">
                {/* Category */}
                <motion.span
                  className="text-sm font-mono text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  {service.category}
                </motion.span>

                {/* Title */}
                <motion.h3
                  className="text-2xl font-serif font-bold text-black dark:text-white transition-colors duration-300 group-hover:text-black dark:group-hover:text-white"
                >
                  {service.title}
                </motion.h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 font-sans leading-relaxed text-base">
                  {service.description}
                </p>

                {/* Learn More Link */}
                <div className="inline-flex items-center gap-3 text-black dark:text-white font-medium border-b border-black dark:border-white pb-1 group-hover:gap-4 transition-all duration-300">
                  <span>Learn More</span>
                  <motion.div
                    className="w-6 h-6 border border-black dark:border-white flex items-center justify-center transition-colors duration-300"
                    whileHover={{ x: 5 }}
                  >
                    →
                  </motion.div>
                </div>
              </div>
              </motion.div>
              </Link>
          ))}
        </motion.div>

        {/* Bottom Section Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={(isInView || hasAnimated) ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="w-full h-px bg-black dark:bg-white mt-32 origin-left transition-colors duration-300"
        />
      </div>
    </section>
  )
}