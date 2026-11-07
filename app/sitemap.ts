import { MetadataRoute } from 'next'
import { getSite } from '@/lib/i18n'
import { ID_PUBLISHED, type Lang } from '@/lib/i18n/config'
import { absoluteUrl, localePath } from '@/lib/i18n/routes'
import { getPosts } from '@/lib/posts'
import { alternatesFor } from '@/lib/seo'

type Entry = MetadataRoute.Sitemap[number]

// Every live page in every live language. English and Bahasa twins list each
// other through `alternates.languages`.
export default function sitemap(): MetadataRoute.Sitemap {
  const langs: Lang[] = ID_PUBLISHED ? ['en', 'id'] : ['en']

  const entry = (lang: Lang, path: string, fields: Partial<Entry>, other: string | null = path): Entry => {
    const { languages } = alternatesFor(lang, path, other, { force: true })
    return {
      url: absoluteUrl(localePath(lang, path)),
      ...fields,
      ...(ID_PUBLISHED && languages ? { alternates: { languages } } : {}),
    }
  }

  const pages = [
    { path: '/', priority: 1 },
    { path: '/work', priority: 0.9 },
    { path: '/journal', priority: 0.8 },
    { path: '/about', priority: 0.8 },
    { path: '/contact', priority: 0.7 },
    { path: '/privacy', priority: 0.3 },
  ]

  const staticEntries = langs.flatMap((lang) =>
    pages.map((p) => entry(lang, p.path, { changeFrequency: 'monthly', priority: p.priority })),
  )

  // /jurnal is live before launch, so it joins the English list until then.
  const jurnalIndex = ID_PUBLISHED
    ? []
    : [{ url: absoluteUrl(localePath('id', '/journal')), changeFrequency: 'monthly' as const, priority: 0.8 }]

  const postEntries = (['en', 'id'] as Lang[]).flatMap((lang) =>
    getPosts(lang).map((p) =>
      entry(
        lang,
        `/journal/${p.slug}`,
        { lastModified: new Date(`${p.date}T00:00:00`), changeFrequency: 'yearly', priority: 0.6 },
        p.alternate ? `/journal/${p.alternate}` : null,
      ),
    ),
  )

  const caseEntries = langs.flatMap((lang) => {
    const other = lang === 'en' ? getSite('id') : getSite('en')
    return getSite(lang).caseStudies.map((p) =>
      entry(
        lang,
        `/work/${p.id}`,
        { changeFrequency: 'yearly', priority: 0.7 },
        other.caseStudies.some((o) => o.id === p.id) ? `/work/${p.id}` : null,
      ),
    )
  })

  const serviceEntries = langs.flatMap((lang) =>
    getSite(lang).services.map((p) =>
      entry(
        lang,
        `/services/${p.slug}`,
        { changeFrequency: 'monthly', priority: 0.9 },
        p.alternate ? `/services/${p.alternate}` : null,
      ),
    ),
  )

  return [...staticEntries, ...jurnalIndex, ...serviceEntries, ...caseEntries, ...postEntries]
}
