import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getStaticContent } from '@/lib/content-manager'
import { StructuredData } from '@/components/structured-data'
import { CustomCursor } from '@/components/custom-cursor'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  ArrowRight,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react'

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
      <CustomCursor />
      <main className="min-h-screen bg-gradient-to-br from-background to-secondary/20 font-sans antialiased">
        <article className="container mx-auto px-4 py-16 max-w-4xl">
          {/* Back to Blog */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <header className="mb-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Badge variant="outline">{post.category}</Badge>
              {post.featured && (
                <>
                  <span>•</span>
                  <Badge variant="default">Featured</Badge>
                </>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pb-8 border-b">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-4 mt-6">
              <span className="text-sm font-medium">Share:</span>
              <Button size="sm" variant="outline" className="gap-2">
                <Twitter className="h-4 w-4" />
                Twitter
              </Button>
              <Button size="sm" variant="outline" className="gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
              <Button size="sm" variant="outline" className="gap-2">
                <Github className="h-4 w-4" />
                GitHub
              </Button>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-16">
            <div className="bg-background/50 rounded-lg p-8 mb-8">
              <p className="text-lg leading-relaxed">{post.content}</p>
            </div>

            {/* Content Blocks (if they exist) */}
            {post.contentBlocks && post.contentBlocks.length > 0 && (
              <div className="space-y-8">
                {post.contentBlocks.map((block, index) => (
                  <div key={index} className="bg-background/50 rounded-lg p-8">
                    {block.type === 'heading' && (
                      <h2 className="text-2xl font-bold mb-4">{block.text}</h2>
                    )}
                    {block.type === 'paragraph' && (
                      <p className="text-lg leading-relaxed">{block.text}</p>
                    )}
                    {block.type === 'list' && (
                      <ul className="list-disc list-inside space-y-2 text-lg">
                        {block.items?.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {block.type === 'code' && (
                      <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm">
                          <code>{block.code}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-12 pb-12 border-b">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mb-12">
              <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="group hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <Badge variant="outline" className="text-xs mb-3">
                        {relatedPost.category}
                      </Badge>
                      <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                        <Link href={`/blog/${relatedPost.slug}`} className="hover:underline">
                          {relatedPost.title}
                        </Link>
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{relatedPost.readTime} min read</span>
                        <span>•</span>
                        <span>{formatDate(relatedPost.publishedAt)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Navigation */}
          <nav className="flex items-center justify-between pt-8 border-t">
            {prevPost && (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="group flex items-center gap-2 text-primary hover:gap-3 transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                <div className="text-left">
                  <div className="text-xs text-muted-foreground">Previous</div>
                  <div className="font-medium">{prevPost.title}</div>
                </div>
              </Link>
            )}

            {nextPost && (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group flex items-center gap-2 text-primary hover:gap-3 transition-all ml-auto"
              >
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Next</div>
                  <div className="font-medium">{nextPost.title}</div>
                </div>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </nav>
        </article>
      </main>
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