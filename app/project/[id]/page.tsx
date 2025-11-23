'use client'

import React, { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { getStaticContent } from '@/lib/content-manager'
import { StructuredData } from '@/components/structured-data'
import { CustomCursor } from '@/components/custom-cursor'
import { ProjectPostContent } from '@/components/project-post-content'
import type { Project } from '@/lib/content-types'

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([])
  const [prevProject, setPrevProject] = useState<Project | null>(null)
  const [nextProject, setNextProject] = useState<Project | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProject() {
      try {
        const { id } = await params
        const projects = getStaticContent.projects()
        const foundProject = projects.find(p => p.id === id)

        if (foundProject) {
          setProject(foundProject)

          // Find related projects (same category, excluding current)
          const related = projects
            .filter(p => p.category === foundProject.category && p.id !== foundProject.id)
            .slice(0, 2)
          setRelatedProjects(related)

          // Find prev/next projects
          const currentIndex = projects.findIndex(p => p.id === foundProject.id)
          setPrevProject(currentIndex > 0 ? projects[currentIndex - 1] : null)
          setNextProject(currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null)
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
      <ProjectPostContent
        project={project}
        relatedProjects={relatedProjects}
        prevProject={prevProject}
        nextProject={nextProject}
      />
    </>
  )
}