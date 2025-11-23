'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CustomCursor } from '@/components/custom-cursor'
import {
  Calendar,
  ArrowLeft,
  ArrowRight,
  Github,
  ExternalLink,
  Layers,
  Check,
  Quote,
  TrendingUp
} from 'lucide-react'
import { motion } from 'framer-motion'
import type { Project } from '@/lib/content-types'
import { ContactModal } from '@/components/contact-modal'

interface ProjectPostContentProps {
  project: Project
  relatedProjects: Project[]
  prevProject: Project | null
  nextProject: Project | null
}

export function ProjectPostContent({ project, relatedProjects, prevProject, nextProject }: ProjectPostContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Animation variants
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 20,
      },
    },
  }

  return (
    <>
      <CustomCursor />
      <main className="min-h-screen bg-white dark:bg-black font-sans antialiased">
        <article className="max-w-7xl mx-auto px-6 py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-16"
          >
            {/* Back to Projects */}
            <motion.div variants={itemVariants} className="relative z-50">
              <Link
                href="/"
                className="inline-flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300 group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-mono text-sm tracking-wider uppercase">Back to Home</span>
              </Link>
            </motion.div>

            {/* Project Header */}
            <motion.header variants={itemVariants} className="space-y-8">
              {/* Category */}
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-xs font-mono font-bold uppercase tracking-wider">
                  {project.category}
                </span>
                {project.featured && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="px-3 py-1 bg-yellow-500 text-black text-xs font-mono font-bold uppercase tracking-wider">
                      ⭐ Featured
                    </span>
                  </>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-black dark:text-white leading-tight">
                {project.title}
              </h1>

              {/* Project Meta */}
              <div className="flex flex-wrap items-center gap-8 text-sm text-gray-500 dark:text-gray-500 pb-8 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-mono">{project.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  <span className="font-mono">{project.tech.length} Technologies</span>
                </div>
              </div>

              {/* Project Links */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex gap-3">
                  {project.livePreview && (
                    <motion.a
                      href={project.livePreview}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-mono text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Live Preview
                    </motion.a>
                  )}
                  {project.url && (
                    <motion.a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-black dark:text-white font-mono text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 flex items-center gap-2"
                    >
                      <Github className="h-4 w-4" />
                      View Code
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.header>

            {/* Featured Image */}
            <motion.div variants={itemVariants} className="relative aspect-video w-full overflow-hidden border border-gray-200 dark:border-gray-700">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </motion.div>

            {/* Project Content */}
            <motion.div variants={itemVariants} className="space-y-12">
              {/* Description & Story */}
              <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                  {/* Overview */}
                  <div className="space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-black dark:text-white">
                      Overview
                    </h2>
                    <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400 leading-relaxed">
                      <p>{project.description}</p>
                    </div>
                  </div>

                  {/* Challenge & Solution */}
                  {(project.challenge || project.solution) && (
                    <div className="space-y-12">
                      {project.challenge && (
                        <div className="space-y-6">
                          <h3 className="text-xl font-serif font-bold text-black dark:text-white">
                            The Challenge
                          </h3>
                          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                            {project.challenge}
                          </p>
                        </div>
                      )}
                      {project.solution && (
                        <div className="space-y-6">
                          <h3 className="text-xl font-serif font-bold text-black dark:text-white">
                            The Solution
                          </h3>
                          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                            {project.solution}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Sidebar: Tech & Features */}
                <div className="space-y-12">
                  {/* Technologies */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-mono font-bold uppercase tracking-wider text-black dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4">
                      Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-900 text-sm font-mono text-gray-700 dark:text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Features */}
                  {project.features && project.features.length > 0 && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-mono font-bold uppercase tracking-wider text-black dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4">
                        Key Features
                      </h3>
                      <ul className="space-y-4">
                        {project.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                            <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Metrics */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12 border-y border-gray-200 dark:border-gray-700">
                  {project.metrics.map((metric, index) => (
                    <div key={index} className="text-center space-y-2">
                      <div className="text-3xl md:text-4xl font-bold font-serif text-black dark:text-white">
                        {metric.value}
                      </div>
                      <div className="text-xs font-mono uppercase tracking-wider text-gray-500">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-serif font-bold text-black dark:text-white">
                    Project Gallery
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {project.gallery.map((image, index) => (
                      <div key={index} className="relative aspect-video bg-gray-100 dark:bg-gray-900 overflow-hidden border border-gray-200 dark:border-gray-700">
                        <Image
                          src={image}
                          alt={`${project.title} screenshot ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Section */}
              <div className="bg-black dark:bg-white text-white dark:text-black p-12 text-center space-y-8">
                <h2 className="text-3xl md:text-4xl font-serif font-bold">
                  Interested in a project like this?
                </h2>
                <p className="text-lg text-gray-300 dark:text-gray-700 max-w-2xl mx-auto">
                  Let's discuss how we can bring your vision to life with the same level of quality and attention to detail.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-8 py-4 bg-white dark:bg-black text-black dark:text-white font-mono text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                  >
                    Start a Project
                  </button>
                </div>
              </div>

              <ContactModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} projectTitle={project.title} />

              {/* Share Project */}
              <div className="pt-12 border-t border-gray-200 dark:border-gray-700 text-center">
                <h2 className="text-xl font-serif font-bold text-black dark:text-white mb-8">
                  Share This Project
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://jamalakbara.com/project/${project.id}`)}&text=${encodeURIComponent(`Check out ${project.title} by @jamalakbara`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-900 text-black dark:text-white font-mono text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                    Share on Twitter
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://jamalakbara.com/project/${project.id}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-6 py-3 bg-[#0077b5] text-white font-mono text-sm hover:opacity-80 transition-opacity"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    Share on LinkedIn
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Related Projects */}
            {relatedProjects.length > 0 && (
              <motion.section variants={itemVariants} className="space-y-8 pt-12 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-4xl md:text-5xl font-serif font-bold text-black dark:text-white">
                  More Projects
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {relatedProjects.map((relatedProject) => (
                    <motion.article
                      key={relatedProject.id}
                      variants={itemVariants}
                      whileHover={{
                        scale: 1.02,
                        y: -5,
                        boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)"
                      }}
                      transition={{ type: "spring", stiffness: 100, damping: 20 }}
                      className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 p-6 hover:border-black dark:hover:border-white transition-all duration-300 group cursor-pointer"
                    >
                      <Link href={`/project/${relatedProject.id}`} className="block">
                        <div className="relative aspect-video overflow-hidden mb-6">
                          <Image
                            src={relatedProject.image}
                            alt={relatedProject.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <span className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-xs font-mono font-bold uppercase tracking-wider mb-4 inline-block">
                          {relatedProject.category}
                        </span>
                        <h4 className="text-xl md:text-2xl font-serif font-bold text-black dark:text-white mb-3 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                          {relatedProject.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {relatedProject.description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
                          <span className="font-mono">{relatedProject.year}</span>
                          <span className="font-mono">{relatedProject.tech.length} Techs</span>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Navigation */}
            <motion.nav variants={itemVariants} className="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
              {prevProject ? (
                <Link
                  href={`/project/${prevProject.id}`}
                  className="group flex items-center gap-4 text-black dark:text-white hover:gap-6 transition-all duration-300"
                >
                  <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                  <div className="text-left">
                    <div className="text-sm font-mono text-gray-600 dark:text-gray-400 mb-1">Previous</div>
                    <div className="font-medium text-lg">{prevProject.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextProject && (
                <Link
                  href={`/project/${nextProject.id}`}
                  className="group flex items-center gap-4 text-black dark:text-white hover:gap-6 transition-all duration-300 ml-auto"
                >
                  <div className="text-right">
                    <div className="text-sm font-mono text-gray-600 dark:text-gray-400 mb-1">Next</div>
                    <div className="font-medium text-lg">{nextProject.title}</div>
                  </div>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              )}
            </motion.nav>
          </motion.div>
        </article>
      </main>
    </>
  )
}
