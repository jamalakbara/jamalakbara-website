import { getSite } from '@/lib/i18n'
import { SITE_URL, type Lang } from '@/lib/i18n/config'
import { absoluteUrl, localePath } from '@/lib/i18n/routes'

// JSON-LD for the public site. Values come from content/site/seo.json and its
// Bahasa overlay (/admin/seo). Each type renders only on the pages it
// describes; see .claude/rules/seo.md. FAQ markup must match an FAQ visible on
// the page.

export interface ProjectData {
  id: string
  title: string
  description: string
  image: string
  year: string
  category: string
  tech: string[]
}

export interface FaqItem {
  question: string
  answer: string
}

type StructuredDataProps = { lang: Lang } & (
  | { type: 'WebSite' | 'Person' | 'LocalBusiness' }
  | { type: 'Project'; data: ProjectData }
  | { type: 'FAQ'; data: FaqItem[] }
  | { type: 'Breadcrumb'; data: { name: string; path: string }[] }
)

const nonEmpty = (list: string[]) => list.map((v) => v.trim()).filter(Boolean)

function postalAddress(lang: Lang) {
  const { city, region, country } = getSite(lang).seo.business
  return {
    '@type': 'PostalAddress',
    addressLocality: city,
    ...(region ? { addressRegion: region } : {}),
    addressCountry: country,
  }
}

function website(lang: Lang) {
  const { name, alternateName, description } = getSite(lang).seo.website
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    ...(alternateName ? { alternateName } : {}),
    url: absoluteUrl(localePath(lang, '/')),
    description,
    inLanguage: lang,
  }
}

function person(lang: Lang) {
  const { seo, contact } = getSite(lang)
  const { identity, business } = seo
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: identity.name,
    alternateName: nonEmpty(identity.alternateNames),
    url: SITE_URL,
    image: identity.image,
    sameAs: nonEmpty(identity.sameAs),
    jobTitle: nonEmpty(identity.jobTitles),
    description: identity.description,
    email: contact.email,
    ...(business.phone ? { telephone: business.phone } : {}),
    address: postalAddress(lang),
    knowsAbout: nonEmpty(identity.knowsAbout),
    award: nonEmpty(identity.awards),
    ...(identity.alumniOf
      ? { alumniOf: { '@type': 'EducationalOrganization', name: identity.alumniOf } }
      : {}),
    ...(business.enabled ? { worksFor: { '@type': 'Organization', name: business.name } } : {}),
  }
}

function localBusiness(lang: Lang) {
  const { seo, contact } = getSite(lang)
  const { business } = seo
  if (!business.enabled) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    ...(business.alternateName ? { alternateName: business.alternateName } : {}),
    description: business.description,
    url: SITE_URL,
    email: contact.email,
    ...(business.phone ? { telephone: business.phone } : {}),
    address: postalAddress(lang),
    areaServed: nonEmpty(business.areaServed).map((name) => ({ '@type': 'Place', name })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: nonEmpty(business.services).map((name) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name },
      })),
    },
  }
}

function project(lang: Lang, p: ProjectData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: p.title,
    description: p.description,
    url: absoluteUrl(localePath(lang, `/work/${p.id}`)),
    image: p.image,
    dateCreated: p.year,
    creator: { '@type': 'Person', name: getSite(lang).seo.identity.name, url: SITE_URL },
    genre: p.category,
    keywords: p.tech.join(', '),
    inLanguage: lang,
  }
}

function faq(items: FaqItem[]) {
  if (items.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

function breadcrumb(lang: Lang, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(localePath(lang, item.path)),
    })),
  }
}

function build(props: StructuredDataProps) {
  switch (props.type) {
    case 'WebSite':
      return website(props.lang)
    case 'Person':
      return person(props.lang)
    case 'LocalBusiness':
      return localBusiness(props.lang)
    case 'Project':
      return project(props.lang, props.data)
    case 'FAQ':
      return faq(props.data)
    case 'Breadcrumb':
      return breadcrumb(props.lang, props.data)
  }
}

export function StructuredData(props: StructuredDataProps) {
  const structuredData = build(props)
  if (!structuredData) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
    />
  )
}
