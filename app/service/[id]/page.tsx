'use client'

import React, { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { getStaticContent } from '@/lib/content-manager'
import { StructuredData } from '@/components/structured-data'
import { CustomCursor } from '@/components/custom-cursor'
import { ServicePostContent } from '@/components/service-post-content'
import type { Service } from '@/lib/content-types'

interface ServicePageProps {
  params: Promise<{ id: string }>
}

export default function ServicePage({ params }: ServicePageProps) {
  const [service, setService] = useState<Service | null>(null)
  const [otherServices, setOtherServices] = useState<Service[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadService() {
      try {
        const { id } = await params
        const services = getStaticContent.services()
        const foundService = services.find(s => s.id === id)

        if (foundService) {
          setService(foundService)
          setOtherServices(services.filter(s => s.id !== id))
        } else {
          setError('Service not found')
        }
      } catch {
        setError('Error loading service')
      } finally {
        setIsLoading(false)
      }
    }

    loadService()
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

  if (error || !service) {
    notFound()
  }

  return (
    <>
      <StructuredData type="Service" data={service} />
      <ServicePostContent
        service={service}
        otherServices={otherServices}
        relatedProjects={getRelatedProjects(service.id)}
      />
    </>
  )
}

function getRelatedProjects(serviceId: string) {
  const projects = getStaticContent.projects()
  switch (serviceId) {
    case 'mobile-development':
      return projects.filter(p => p.id === 'split-bill-app')
    case 'backend-development':
      return projects.filter(p => ['base-data-dashboard', 'combo'].includes(p.id))
    case 'ui-ux-design':
      return projects.filter(p => ['aza-wear', 'duma', 'sonderlab'].includes(p.id)).slice(0, 2)
    case 'frontend-development':
      return projects.filter(p => ['sonderlab', 'nawaclo', 'green-rebel-foods'].includes(p.id)).slice(0, 2)
    default:
      return projects.filter(p => p.featured).slice(0, 2)
  }
}