import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getStaticContent } from '@/lib/content-manager'
import { StructuredData } from '@/components/structured-data'
import { BlogPostContent } from '@/components/blog-post-content'

interface BlogPostParams {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostParams): Promise<Metadata> {
  const blogPosts = getStaticContent.blog()
  const { slug } = await params
  const post = blogPosts.find(p => p.slug === slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} - Jamal Akbar Alam Blog`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://jamalakbara.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      section: post.category,
      tags: post.tags,
      images: post.seo?.ogImage ? [
        {
          url: post.seo.ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      creator: '@jamalakbara',
      images: post.seo?.ogImage ? [post.seo.ogImage] : [],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostParams) {
  const blogPosts = getStaticContent.blog()
  const { slug } = await params
  const post = blogPosts.find(p => p.slug === slug)

  if (!post) {
    notFound()
  }

  // Find related posts (same category, excluding current post)
  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3)

  const currentIndex = blogPosts.findIndex(p => p.id === post.id)
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <>
      <StructuredData type="WebSite" />
      <BlogPostContent
        post={post}
        relatedPosts={relatedPosts}
        prevPost={prevPost}
        nextPost={nextPost}
      />
    </>
  )
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const blogPosts = getStaticContent.blog()
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}