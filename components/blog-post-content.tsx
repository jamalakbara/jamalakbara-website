'use client'

import Link from 'next/link'
import { CustomCursor } from '@/components/custom-cursor'
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
import { motion } from 'framer-motion'
import type { BlogContent } from '@/lib/content-types'

interface BlogPostContentProps {
  post: BlogContent
  relatedPosts: BlogContent[]
  prevPost: BlogContent | null
  nextPost: BlogContent | null
}

export function BlogPostContent({ post, relatedPosts, prevPost, nextPost }: BlogPostContentProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 20,
      },
    },
  }

  return (
    <>
      <CustomCursor />
      <main className="min-h-screen bg-white dark:bg-black font-sans antialiased">
        <article className="max-w-7xl mx-auto px-6 py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-16"
          >
            {/* Back to Blog */}
            <motion.div variants={itemVariants}>
              <Link
                href="/blog"
                className="inline-flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300 group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-mono text-sm tracking-wider uppercase">Back to Blog</span>
              </Link>
            </motion.div>

            {/* Article Header */}
            <motion.header variants={itemVariants} className="space-y-8">
              {/* Category and Featured Badge */}
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-xs font-mono font-bold uppercase tracking-wider">
                  {post.category}
                </span>
                {post.featured && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="px-3 py-1 bg-yellow-500 text-black text-xs font-mono font-bold uppercase tracking-wider">
                      ⭐ Featured
                    </span>
                  </>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-black dark:text-white leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-4xl">
                {post.excerpt}
              </p>

              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-8 text-sm text-gray-500 dark:text-gray-500 pb-8 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-mono">{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-mono">{formatDate(post.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono">{post.readTime} min read</span>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-6 pt-8">
                <span className="text-sm font-mono font-medium text-gray-600 dark:text-gray-400">Share:</span>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-black dark:text-white font-mono text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 flex items-center gap-2"
                  >
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-black dark:text-white font-mono text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 flex items-center gap-2"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-black dark:text-white font-mono text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 flex items-center gap-2"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </motion.button>
                </div>
              </div>
            </motion.header>

            {/* Article Content */}
            <motion.div variants={itemVariants} className="space-y-8">
              {/* Main Content */}
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-8 md:p-12">
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg md:text-xl text-black dark:text-white leading-relaxed font-serif">
                    {post.content}
                  </p>
                </div>
              </div>

              {/* Content Blocks */}
              {post.contentBlocks && post.contentBlocks.length > 0 && (
                <div className="space-y-8">
                  {post.contentBlocks.map((block, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-8 md:p-12"
                    >
                      {block.type === 'heading' && (
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-black dark:text-white mb-6">
                          {block.text}
                        </h2>
                      )}
                      {block.type === 'paragraph' && (
                        <p className="text-lg md:text-xl text-black dark:text-white leading-relaxed font-serif">
                          {block.text}
                        </p>
                      )}
                      {block.type === 'list' && (
                        <ul className="space-y-4 text-lg md:text-xl text-black dark:text-white">
                          {block.items?.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start gap-3">
                              <span className="text-2xl text-black dark:text-white mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {block.type === 'code' && (
                        <div className="bg-black dark:bg-white text-white dark:text-black p-4 md:p-6 overflow-x-auto">
                          <pre className="text-sm md:text-base font-mono">
                            <code>{block.code}</code>
                          </pre>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Tags */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3 pb-12 border-b border-gray-200 dark:border-gray-700">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-xs font-mono text-gray-700 dark:text-gray-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
                >
                  #{tag}
                </span>
              ))}
            </motion.div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <motion.section variants={itemVariants} className="space-y-8">
                <h3 className="text-4xl md:text-5xl font-serif font-bold text-black dark:text-white">
                  Related Articles
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedPosts.map((relatedPost) => (
                    <motion.article
                      key={relatedPost.id}
                      variants={itemVariants}
                      whileHover={{
                        scale: 1.02,
                        y: -5,
                        boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)"
                      }}
                      transition={{ type: "spring", stiffness: 100, damping: 20 }}
                      className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 p-6 hover:border-black dark:hover:border-white transition-all duration-300 group cursor-pointer"
                    >
                      <Link href={`/blog/${relatedPost.slug}`} className="block">
                        <span className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-xs font-mono font-bold uppercase tracking-wider mb-4 inline-block">
                          {relatedPost.category}
                        </span>
                        <h4 className="text-xl md:text-2xl font-serif font-bold text-black dark:text-white mb-3 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                          {relatedPost.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
                          <span className="font-mono">{relatedPost.readTime} min read</span>
                          <span className="font-mono">{formatDate(relatedPost.publishedAt)}</span>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Navigation */}
            <motion.nav variants={itemVariants} className="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
              {prevPost && (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="group flex items-center gap-4 text-black dark:text-white hover:gap-6 transition-all duration-300"
                >
                  <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
                  <div className="text-left">
                    <div className="text-sm font-mono text-gray-600 dark:text-gray-400 mb-1">Previous</div>
                    <div className="font-medium text-lg">{prevPost.title}</div>
                  </div>
                </Link>
              )}

              {nextPost && (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="group flex items-center gap-4 text-black dark:text-white hover:gap-6 transition-all duration-300 ml-auto"
                >
                  <div className="text-right">
                    <div className="text-sm font-mono text-gray-600 dark:text-gray-400 mb-1">Next</div>
                    <div className="font-medium text-lg">{nextPost.title}</div>
                  </div>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              )}
            </motion.nav>
          </motion.div>
        </article>
      </main>
    </>
  )
}