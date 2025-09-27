'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const services = [
  {
    title: "UI/UX Design",
    description: "Creating intuitive and visually stunning user interfaces that enhance user experience and drive engagement.",
    icon: "✦"
  },
  {
    title: "Frontend Development",
    description: "Building responsive, performant web applications using modern technologies and best practices.",
    icon: "◉"
  },
  {
    title: "Brand Strategy",
    description: "Developing cohesive brand identities that communicate your values and resonate with your audience.",
    icon: "△"
  },
  {
    title: "Creative Direction",
    description: "Guiding creative projects from concept to completion with strategic thinking and artistic vision.",
    icon: "◊"
  }
]

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [headingRect, setHeadingRect] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const headingRef = useRef<HTMLHeadingElement>(null);

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
    setShowMagnifier(false);
    // Re-enable global cursor effects
    document.body.removeAttribute('data-disable-cursor');
  };

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
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          variants={titleVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
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
                Expertise
                {/* Hide original text in magnified area */}
                {showMagnifier && (
                  <span
                    className="absolute inset-0 bg-white pointer-events-none z-10"
                    style={{
                      clipPath: `circle(35px at ${mousePosition.x - headingRect.left}px ${mousePosition.y - headingRect.top}px)`,
                    }}
                  />
                )}
              </span>
              {/* Magnified text overlay - appears only in circular area around cursor */}
              {showMagnifier && (
                <div
                  className="absolute inset-0 pointer-events-none z-20"
                  style={{
                    clipPath: `circle(35px at ${mousePosition.x - headingRect.left}px ${mousePosition.y - headingRect.top}px)`,
                  }}
                >
                  <span 
                    className="text-5xl md:text-6xl font-serif font-bold text-blue-600 absolute whitespace-nowrap"
                    style={{
                      transform: `scale(1.4)`,
                      transformOrigin: `${mousePosition.x - headingRect.left}px ${mousePosition.y - headingRect.top}px`,
                      left: 0,
                      top: 0,
                    }}
                  >
                    Expertise
                  </span>
                </div>
              )}
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-sans max-w-2xl mx-auto transition-colors duration-300">
            Specialized services that transform ideas into meaningful digital experiences
          </p>
        </motion.div>
        
        {/* Custom Magnifying Glass Cursor */}
        {showMagnifier && (
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
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              whileHover={{
                y: -10,
                transition: { type: "spring", stiffness: 400, damping: 25 }
              }}
              className="group relative"
            >
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-8 h-full transition-all duration-300 group-hover:border-black dark:group-hover:border-white group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:group-hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                {/* Icon */}
                <div className="text-4xl mb-6 text-black dark:text-white font-mono transition-colors duration-300">
                  {service.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-serif font-bold text-black dark:text-white mb-4 group-hover:text-black dark:group-hover:text-white transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 font-sans leading-relaxed text-base transition-colors duration-300">
                  {service.description}
                </p>

                {/* Hover indicator */}
                <motion.div
                  className="absolute bottom-6 right-6 w-6 h-6 border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ rotate: 45 }}
                >
                  <div className="w-full h-full bg-black dark:bg-white transform rotate-45 transition-colors duration-300" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Section Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="w-full h-px bg-black dark:bg-white mt-32 origin-left transition-colors duration-300"
        />
      </div>
    </section>
  )
}