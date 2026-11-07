import { MetadataRoute } from 'next'
import { getJournalPosts } from '@/lib/journal'
import { getJurnalPosts } from '@/lib/jurnal'
import { caseStudies, publishedServicePages } from '@/lib/site-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jamalakbara.com'

  const routes = [
    { path: '', priority: 1 },
    { path: '/work', priority: 0.9 },
    { path: '/journal', priority: 0.8 },
    { path: '/jurnal', priority: 0.8 },
    { path: '/about', priority: 0.8 },
    { path: '/contact', priority: 0.7 },
    { path: '/privacy', priority: 0.3 },
  ]

  const staticEntries = routes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    changeFrequency: 'monthly' as const,
    priority: r.priority,
  }))

  const postEntries = getJournalPosts().map((p) => ({
    url: `${baseUrl}/journal/${p.slug}`,
    lastModified: new Date(`${p.date}T00:00:00`),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }))

  const jurnalEntries = getJurnalPosts().map((p) => ({
    url: `${baseUrl}/jurnal/${p.slug}`,
    lastModified: new Date(`${p.date}T00:00:00`),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }))

  const caseEntries = caseStudies.map((p) => ({
    url: `${baseUrl}/work/${p.id}`,
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }))

  const serviceEntries = publishedServicePages.map((p) => ({
    url: `${baseUrl}/layanan/${p.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  return [...staticEntries, ...serviceEntries, ...caseEntries, ...postEntries, ...jurnalEntries]
}
