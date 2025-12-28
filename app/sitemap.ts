import { MetadataRoute } from 'next'
import { getStaticContent } from '@/lib/static-content'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jamalakbara.com'

  // Base routes
  const routes = [
    '',
    '/about',
    '/work',
    '/blog',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Projects
  const projects = getStaticContent.projects().map((project) => ({
    url: `${baseUrl}/work/${project.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Blog Posts
  const blogs = getStaticContent.blog().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...routes, ...projects, ...blogs]
}