import { MetadataRoute } from 'next'
import { getStaticContent } from '@/lib/content-manager'
import fs from 'fs'
import path from 'path'

// Get file modification time for better sitemap accuracy
function getFileModTime(filename: string): Date {
  try {
    const filePath = path.join(process.cwd(), 'content', filename)
    const stats = fs.statSync(filePath)
    return stats.mtime
  } catch {
    console.warn(`Could not get modification time for ${filename}, using current time`)
    return new Date()
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jamalakbara.com'
  const projects = getStaticContent.projects()
  const services = getStaticContent.services()

  // Get content file modification times
  const siteConfigModTime = getFileModTime('site-config.json')
  const servicesModTime = getFileModTime('services.json')
  const projectsModTime = getFileModTime('projects.json')
  const aboutModTime = getFileModTime('about.json')
  const ctaModTime = getFileModTime('cta.json')

  const staticPages = [
    {
      url: baseUrl,
      lastModified: siteConfigModTime,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/#services`,
      lastModified: servicesModTime,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#work`,
      lastModified: projectsModTime,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#about`,
      lastModified: aboutModTime,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#contact`,
      lastModified: ctaModTime,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  const projectPages = projects.map((project) => ({
    url: `${baseUrl}/project/${project.id}`,
    lastModified: projectsModTime,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const servicePages = services.map((service) => ({
    url: `${baseUrl}/service/${service.id}`,
    lastModified: servicesModTime,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...projectPages, ...servicePages]
}