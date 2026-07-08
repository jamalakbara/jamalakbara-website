import { MetadataRoute } from 'next'
import { getJournalPosts } from '@/lib/journal'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jamalakbara.com'
  const lastModified = new Date()

  const routes = [
    { path: '', priority: 1 },
    { path: '/work', priority: 0.9 },
    { path: '/journal', priority: 0.8 },
    { path: '/about', priority: 0.8 },
    { path: '/contact', priority: 0.7 },
  ]

  const staticEntries = routes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: r.priority,
  }))

  const postEntries = getJournalPosts().map((p) => ({
    url: `${baseUrl}/journal/${p.slug}`,
    lastModified: new Date(`${p.date}T00:00:00`),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }))

  return [...staticEntries, ...postEntries]
}
