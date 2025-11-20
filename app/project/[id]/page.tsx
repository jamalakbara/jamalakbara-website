'use client'

import React, { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getStaticContent } from '@/lib/content-manager'
import { StructuredData } from '@/components/structured-data'
import { CustomCursor } from '@/components/custom-cursor'

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const [project, setProject] = useState<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProject() {
      try {
        const { id } = await params
        const foundProject = getStaticContent.projects().find(p => p.id === id)
        if (foundProject) {
          setProject(foundProject)
        } else {
          setError('Project not found')
        }
      } catch {
        setError('Error loading project')
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [params])

  if (isLoading) {
    return (
      <>
        <CustomCursor />
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
          <div className="text-black dark:text-white">Loading...</div>
        </div>
      </>
    )
  }

  if (error || !project) {
    notFound()
  }

  return (
    <>
      <StructuredData type="Project" data={project} />
      <CustomCursor />

      <article className="min-h-screen bg-white dark:bg-black">
        {/* Header */}
        <header className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={project.image}
              alt={`${project.title} - ${project.category} project showcasing ${project.tech.slice(0, 3).join(', ')} technologies`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="relative z-10 text-center text-white px-6">
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
              {project.title}
            </h1>
            <p className="text-xl md:text-2xl font-mono mb-8 opacity-90">
              {project.category}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {project.tech.map((tech: string) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex gap-6 justify-center">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 border border-white text-white font-mono text-sm tracking-wider hover:bg-white hover:text-black transition-colors"
              >
                VIEW PROJECT
              </a>
            </div>
          </div>

          <button
            onClick={() => {
              const nextSection = document.querySelector('section')
              if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </header>

        {/* Content */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-3xl font-serif font-bold mb-6 text-black dark:text-white">
                    Project Overview
                  </h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-serif font-bold mb-4 text-black dark:text-white">
                    Technologies Used
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {project.tech.map((tech: string) => (
                      <div
                        key={tech}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-400 transition-colors"
                      >
                        <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
                          {tech}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-serif font-bold mb-4 text-black dark:text-white">
                    Project Details
                  </h3>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300">
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="font-mono">Year</span>
                      <span>{project.year}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="font-mono">Category</span>
                      <span>{project.category}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-mono">Status</span>
                      <span className="text-green-600">Completed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                <div className="p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-serif font-bold mb-4 text-black dark:text-white">
                    Quick Links
                  </h3>
                  <div className="space-y-3">
                    {project.livePreview && (
                      <a
                        href={project.livePreview}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center px-4 py-3 bg-black text-white font-mono text-sm hover:bg-gray-800 transition-colors"
                      >
                        Live Preview
                      </a>
                    )}
                    <Link
                      href="/"
                      className="block w-full text-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-mono text-sm hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                    >
                      Back to Projects
                    </Link>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-serif font-bold mb-4 text-black dark:text-white">
                    Share Project
                  </h3>
                  <div className="flex gap-3">
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://jamalakbara.com/project/${project.id}`)}&text=${encodeURIComponent(`Check out ${project.title} by @jamalakbara`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-black text-white text-sm hover:bg-gray-800 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                      </svg>
                      Twitter
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://jamalakbara.com/project/${project.id}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-700 text-white text-sm hover:bg-blue-800 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Projects */}
            <div className="mt-20 pt-20 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-serif font-bold mb-8 text-black dark:text-white">
                More Projects
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {getStaticContent.projects()
                  .filter(p => p.id !== project.id && p.featured)
                  .slice(0, 2)
                  .map((relatedProject) => (
                    <Link
                      key={relatedProject.id}
                      href={`/project/${relatedProject.id}`}
                      className="group block"
                    >
                      <div className="relative aspect-video overflow-hidden mb-4">
                        <Image
                          src={relatedProject.image}
                          alt={`${relatedProject.title} - ${relatedProject.category} project by Jamal Akbar`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      </div>
                      <h4 className="text-xl font-serif font-bold text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                        {relatedProject.title}
                      </h4>
                      <p className="text-sm font-mono text-gray-600 dark:text-gray-400 mt-1">
                        {relatedProject.category} • {relatedProject.year}
                      </p>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </article>
    </>
  )
}