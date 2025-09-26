'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    category: "Web Development",
    description: "A modern e-commerce platform with seamless user experience and advanced analytics.",
    image: "/api/placeholder/600/400",
    year: "2024",
    tech: ["Next.js", "TypeScript", "Stripe"]
  },
  {
    id: 2,
    title: "Brand Identity System",
    category: "Branding",
    description: "Complete brand identity design for a sustainable fashion startup.",
    image: "/api/placeholder/600/400",
    year: "2024",
    tech: ["Figma", "Adobe Suite", "Brand Guidelines"]
  },
  {
    id: 3,
    title: "SaaS Dashboard",
    category: "UI/UX Design",
    description: "Intuitive dashboard design for a productivity SaaS application.",
    image: "/api/placeholder/600/400",
    year: "2023",
    tech: ["React", "D3.js", "Tailwind CSS"]
  }
]

export function FeaturedWorkSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showMagnifier, setShowMagnifier] = useState(false)
  const [headingRect, setHeadingRect] = useState({ left: 0, top: 0, width: 0, height: 0 })
  const headingRef = useRef<HTMLHeadingElement>(null)

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

  const handleMouseEnter = () => {
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
    setShowMagnifier(false)
    // Re-enable global cursor effects
    document.body.removeAttribute('data-disable-cursor')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  }

  const projectVariants = {
    hidden: { 
      opacity: 0, 
      y: 80 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 60,
        damping: 20,
        duration: 0.8,
      },
    },
  }

  return (
    <section id="work" className="py-32 px-6 bg-gray-50" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div 
            className="relative inline-block"
            data-no-cursor="true"
          >
            <h2 
              ref={headingRef}
              className="text-5xl md:text-6xl font-serif font-bold text-black mb-6 relative overflow-hidden cursor-none"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <span className="relative z-10">
                Featured Work
                {/* Hide original text in magnified area */}
                {showMagnifier && (
                  <span
                    className="absolute inset-0 bg-gray-50 pointer-events-none z-10"
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
                    Featured Work
                  </span>
                </div>
              )}
            </h2>
          </div>
          <p className="text-xl text-gray-600 font-sans max-w-2xl mx-auto">
            A selection of projects that showcase creativity, technical excellence, and strategic thinking
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
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
                className="lg:w-1/2 relative group cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <motion.div
                  className="relative overflow-hidden bg-white border border-gray-200"
                  whileHover={{ 
                    rotateX: 2,
                    rotateY: index % 2 === 0 ? 3 : -3,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={{ 
                    transformPerspective: "1000px",
                  }}
                >
                  <div className="aspect-[4/3] relative">
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
                      <span className="text-gray-500 font-mono text-lg">
                        Project {project.id}
                      </span>
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center"
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.7)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="text-white text-center"
                    >
                      <div className="text-lg font-sans mb-2">View Case Study</div>
                      <div className="w-12 h-px bg-white mx-auto" />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Project Info */}
              <div className="lg:w-1/2 space-y-6">
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
                    className="text-3xl md:text-4xl font-serif font-bold text-black mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.4 * index }}
                  >
                    {project.title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p 
                    className="text-gray-600 font-sans text-lg leading-relaxed mb-6"
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
                        className="px-3 py-1 text-sm border border-gray-300 text-gray-700 font-mono"
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
                    <motion.button
                      whileHover={{ 
                        x: 10,
                        backgroundColor: "#000",
                        color: "#fff"
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="group flex items-center gap-3 text-black font-sans font-medium border-b border-black pb-1 transition-colors"
                    >
                      <span>View Project</span>
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="w-6 h-6 border border-black flex items-center justify-center"
                      >
                        →
                      </motion.div>
                    </motion.button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          ))}
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
      </div>
    </section>
  )
}