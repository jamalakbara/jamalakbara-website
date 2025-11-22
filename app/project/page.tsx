'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { getStaticContent } from '@/lib/content-manager'
import { StructuredData } from '@/components/structured-data'
import { CustomCursor } from '@/components/custom-cursor'
import { Navigation } from '@/components/navigation'

export default function ProjectsPage() {
  const projects = getStaticContent.projects()
  const ref = useRef(null)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const isInView = useInView(ref, { once: false, margin: "-100px" })

  // Trigger initial animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true)
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  // Filter projects based on selected category
  const filteredProjects = projects.filter(project => {
    if (selectedCategory === 'all') return true
    if (selectedCategory === 'Web Development') {
      return project.category.includes('E-Commerce') || project.category.includes('Backend') || project.category.includes('Development')
    }
    if (selectedCategory === 'UI/UX Design') {
      return project.category.includes('Design') || project.category.includes('UI')
    }
    if (selectedCategory === 'Mobile Development') {
      return project.category.includes('Mobile')
    }
    return true
  })

  const categories = [
    { name: 'All Projects', value: 'all' },
    { name: 'Web Development', value: 'Web Development' },
    { name: 'UI/UX Design', value: 'UI/UX Design' },
    { name: 'Mobile Development', value: 'Mobile Development' }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
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
        duration: 0.6,
      },
    },
  }

  return (
    <>
      <CustomCursor />
      <Navigation />
      <StructuredData type="WebSite" />
      <StructuredData type="Person" />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Projects Header */}
        <motion.section
          className="py-32 px-6"
          ref={ref}
          initial="hidden"
          animate={(isInView || hasAnimated) ? "visible" : "hidden"}
        >
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1
              className="text-5xl md:text-6xl font-serif font-bold text-black dark:text-white mb-6"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    ease: "easeOut"
                  }
                }
              }}
            >
              Projects
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 dark:text-gray-400 font-sans max-w-3xl mx-auto"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    delay: 0.2,
                    ease: "easeOut"
                  }
                }
              }}
            >
              Discover innovative web development projects, creative UI/UX designs, and cutting-edge digital solutions that demonstrate expertise in modern technologies
            </motion.p>
          </div>
        </motion.section>

        {/* Filter Categories */}
        <motion.section
          className="py-12 px-6 border-b border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {categories.map((category) => (
                <motion.button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                  whileHover={{
                    scale: 1.05,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  whileTap={{
                    scale: 0.95,
                    transition: { duration: 0.1 }
                  }}
                  className={`px-6 py-2 rounded-full font-mono text-sm transition-colors duration-300 ${selectedCategory === category.value
                      ? 'bg-black text-white'
                      : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-black hover:text-white'
                    }`}
                >
                  {category.name}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Projects Grid */}
        <motion.section
          className="py-32 px-6"
          ref={ref}
          initial="hidden"
          animate={(isInView || hasAnimated) ? "visible" : "hidden"}
        >
          <div className="max-w-7xl mx-auto">
            {filteredProjects.length > 0 ? (
              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredProjects.map((project) => (
                  <Link href={`/project/${project.id}`} key={project.id}>
                    <motion.div
                      variants={cardVariants}
                      whileHover={{
                        y: -10,
                        transition: { type: "spring" as const, stiffness: 400, damping: 25 }
                      }}
                      className="group relative cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-0 h-full transition-all duration-300 hover:border-black dark:hover:border-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
                    >
                      {/* Project Image */}
                      <div className="aspect-video relative overflow-hidden">
                        <div
                          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url(${project.image})` }}
                          role="img"
                          aria-label={`${project.title} - Portfolio project by Jamal Akbar Alam in ${project.category}`}
                        />
                      </div>

                      {/* Project Content */}
                      <div className="p-6">
                        {/* Category & Year */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-sm font-mono text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            {project.category}
                          </span>
                          <div className="w-12 h-px bg-gray-300 dark:bg-gray-600" />
                          <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                            {project.year}
                          </span>
                        </div>

                        {/* Title */}
                        <motion.h3
                          className="text-xl font-serif font-bold text-black dark:text-white mb-4 transition-colors duration-300 group-hover:text-black dark:group-hover:text-white"
                        >
                          {project.title}
                        </motion.h3>

                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-400 font-sans text-base leading-relaxed mb-6 line-clamp-3">
                          {project.description}
                        </p>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tech.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-mono transition-colors duration-300 group-hover:border-black dark:group-hover:border-white"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* View Project Link */}
                        <div className="inline-flex items-center gap-3 text-black dark:text-white font-medium border-b border-black dark:border-white pb-1 group-hover:gap-4 transition-all duration-300">
                          <span>View Project</span>
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
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <h3 className="text-2xl font-serif font-bold text-gray-600 dark:text-gray-400 mb-4">
                  No projects found
                </h3>
                <p className="text-gray-500 dark:text-gray-500 mb-6">
                  Try selecting a different category to see more projects.
                </p>
                <motion.button
                  onClick={() => setSelectedCategory('all')}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "#374151",
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  whileTap={{
                    scale: 0.95,
                    transition: { duration: 0.1 }
                  }}
                  animate={{
                    y: [0, -3, 0],
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  className="px-6 py-2 bg-black text-white rounded-full font-mono text-sm hover:bg-gray-800 transition-colors"
                >
                  View All Projects
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Back to Home */}
        <motion.section
          className="py-32 px-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-3 bg-black text-white font-mono text-sm hover:bg-gray-800 transition-colors"
          >
            ← Back to Home
          </Link>
        </motion.section>
      </div>
    </>
  )
}