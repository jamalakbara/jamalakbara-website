import { Metadata } from 'next'
import { getStaticContent } from '@/lib/content-manager'
import { StructuredData } from '@/components/structured-data'
import { BlogContent } from '@/components/blog-content'

export const metadata: Metadata = {
  title: 'Blog - Jamal Akbar Alam | Web Development & Indonesian Tech Insights',
  description: 'Read expert articles on web development, Indonesian tech ecosystem, mobile development, and digital transformation by Jamal Akbar Alam, a full-stack developer based in Bandung, Indonesia.',
  keywords: ['web development blog indonesia', 'tech blog bandung', 'jamal akbar alam blog', 'indonesian tech insights', 'next.js tutorial', 'react development indonesia'],
  openGraph: {
    title: 'Blog - Jamal Akbar Alam | Tech Insights & Tutorials',
    description: 'Expert articles on web development, Indonesian tech ecosystem, and digital transformation strategies.',
    url: 'https://jamalakbara.com/blog',
    type: 'website'
  }
}

export default function BlogPage() {
  const blogPosts = getStaticContent.blog()

  // Sort blog posts by date (newest first)
  const sortedPosts = [...blogPosts].sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  const featuredPosts = sortedPosts.filter(post => post.featured)
  const regularPosts = sortedPosts.filter(post => !post.featured)

  return (
    <>
      <StructuredData type="WebSite" />
      <BlogContent
        featuredPosts={featuredPosts}
        regularPosts={regularPosts}
      />
    </>
  )
}