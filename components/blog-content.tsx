'use client'

import Link from 'next/link'
import { CustomCursor } from '@/components/custom-cursor'
import { Calendar, Clock, ArrowRight, User, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import type { BlogPost } from '@/lib/content-types'

interface BlogContentProps {
  featuredPosts: BlogPost[]
  regularPosts: BlogPost[]
}

export function BlogContent({ featuredPosts, regularPosts }: BlogContentProps) {
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
        type: "spring",
        stiffness: 80,
        damping: 20,
      },
    },
  }

  return (
    <>
      <CustomCursor />
      <main className="min-h-screen bg-white dark:bg-black font-sans antialiased">
        {/* Hero Section */}
        <section className="py-32 px-6 bg-white dark:bg-black">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 60, damping: 20 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center gap-4 mb-8">
                <BookOpen className="h-12 w-12 text-black dark:text-white" />
                <h1 className="text-4xl md:text-6xl lg:text-8xl font-serif font-bold text-black dark:text-white">
                  Blog & Insights
                </h1>
              </div>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                Expert insights on web development, Indonesian tech ecosystem, and digital transformation strategies for modern businesses.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {['Web Development', 'Indonesian Tech', 'Mobile Apps', 'UI/UX Design', 'Performance'].map((tag, index) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index, type: "spring", stiffness: 100 }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-mono bg-gray-50 dark:bg-gray-900 text-black dark:text-white"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Posts Section */}
        {featuredPosts.length > 0 && (
          <section className="py-32 px-6 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, type: "spring", stiffness: 60, damping: 20 }}
                className="text-center mb-16"
              >
                <h2 className="text-5xl md:text-6xl font-serif font-bold text-black dark:text-white mb-4">
                  Featured Articles
                </h2>
                <div className="flex items-center justify-center gap-3 mb-6">
                  <span className="text-2xl">⭐</span>
                  <span className="text-gray-600 dark:text-gray-400">Hand-picked insights</span>
                </div>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid lg:grid-cols-2 gap-12"
              >
                {featuredPosts.map((post) => (
                  <motion.article
                    key={post.id}
                    variants={itemVariants}
                    className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 p-8 hover:border-black dark:hover:border-white transition-all duration-300 group cursor-pointer"
                    whileHover={{
                      scale: 1.02,
                      y: -10,
                      boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)"
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  >
                    <Link href={`/blog/${post.slug}`} className="block">
                      {/* Featured Badge */}
                      <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-xs font-mono font-bold uppercase tracking-wider">
                          Featured
                        </span>
                        <span className="text-gray-400">•</span>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-black dark:text-white mb-4 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Meta Information */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-500">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="font-mono">{post.author}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span className="font-mono">{post.readTime} min read</span>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-xs font-mono bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Read More Link */}
                      <div className="flex items-center gap-3 group/link">
                        <span className="font-mono text-sm font-medium tracking-wider uppercase text-black dark:text-white group-hover/link:gap-4 transition-all duration-300">
                          Read Article
                        </span>
                        <ArrowRight className="h-4 w-4 text-black dark:text-white group-hover/link:translate-x-1 transition-transform duration-300" />
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* All Posts Section */}
        <section className="py-32 px-6 bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring", stiffness: 60, damping: 20 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-black dark:text-white mb-4">
                All Articles
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Explore our complete collection of insights, tutorials, and industry analysis.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-8"
            >
              {regularPosts.map((post) => (
                <motion.article
                  key={post.id}
                  variants={itemVariants}
                  className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-8 hover:border-black dark:hover:border-white transition-all duration-300 group cursor-pointer"
                  whileHover={{
                    scale: 1.01,
                    y: -5,
                    boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)"
                  }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      {/* Category Badge and Date */}
                      <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-xs font-mono font-bold uppercase tracking-wider">
                          {post.category}
                        </span>
                        <span className="text-gray-400">•</span>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>

                      {/* Meta Information */}
                      <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-500">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="font-mono">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="font-mono">{post.readTime} min read</span>
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-black dark:text-white mb-4 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Tags and Read More */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-xs font-mono bg-white dark:bg-black text-gray-700 dark:text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 group/link">
                        <span className="font-mono text-sm font-medium tracking-wider uppercase text-black dark:text-white group-hover/link:gap-4 transition-all duration-300">
                          Read Article
                        </span>
                        <ArrowRight className="h-4 w-4 text-black dark:text-white group-hover/link:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-32 px-6 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring", stiffness: 60, damping: 20 }}
              className="bg-white dark:bg-black border-2 border-black dark:border-white p-12 text-center"
            >
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-black dark:text-white mb-6">
                Stay Updated
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                Get the latest insights on web development, Indonesian tech trends, and digital transformation strategies delivered to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-black dark:text-white font-mono text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                  required
                />
                <motion.button
                  type="submit"
                  className="px-8 py-3 border-2 border-black dark:border-white bg-transparent text-black dark:text-white font-mono text-sm font-medium tracking-wider uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </form>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-6 font-mono">
                No spam, unsubscribe anytime. Just valuable insights.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  )
}