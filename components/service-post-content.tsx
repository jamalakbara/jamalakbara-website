'use client'

import Link from 'next/link'
import Image from 'next/image'
import { CustomCursor } from '@/components/custom-cursor'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Clock,
  Layers,
  Code,
  Smartphone,
  Palette
} from 'lucide-react'
import { motion } from 'framer-motion'
import type { Service, Project } from '@/lib/content-types'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { ContactModal } from '@/components/contact-modal'
import { getStaticContent } from '@/lib/content-manager'

interface ServicePostContentProps {
  service: Service
  otherServices: Service[]
}



// I need to update the interface first.
// But I can't update the interface in the same file replacement if I want to be safe.
// Actually, I'll just update the component to accept `relatedProjects` and I'll update the parent page in the next step.

export function ServicePostContent({ service, otherServices, relatedProjects = [] }: ServicePostContentProps & { relatedProjects?: Project[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const icons = {
    Zap,
    Shield,
    Clock,
    CheckCircle2,
    Layers,
    Code,
    Smartphone,
    Palette
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
            {/* Back to Home */}
            <motion.div variants={itemVariants} className="relative z-50">
              <Link
                href="/"
                className="inline-flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300 group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-mono text-sm tracking-wider uppercase">Back to Home</span>
              </Link>
            </motion.div>

            {/* Service Hero */}
            <motion.header
              variants={itemVariants}
              className="relative min-h-[60vh] flex items-center justify-center -mt-32 mb-20 pb-20"
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black -z-10" />

              <div className="text-center space-y-8 max-w-4xl mx-auto px-6 pt-32">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="text-8xl md:text-9xl mb-8 inline-block"
                >
                  {service.icon}
                </motion.div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-black dark:text-white leading-tight">
                  {service.title}
                </h1>

                {/* Category */}
                <div className="flex items-center justify-center gap-4">
                  <span className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-mono font-bold uppercase tracking-wider">
                    {service.category}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
                  {service.description}
                </p>

                {/* CTA Button */}
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-mono text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    Start a Project
                  </button>
                </div>
              </div>
            </motion.header>


            {/* Service Content */}
            <motion.div variants={itemVariants} className="space-y-24">

              {/* Benefits (What I Deliver) */}
              {service.benefits && (
                <div className="space-y-12">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-black dark:text-white text-center">
                    What I Deliver
                  </h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    {service.benefits.map((benefit, index) => (
                      <div key={index} className="p-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white transition-colors duration-300">
                        <div className="mb-6">
                          {index === 0 && <Zap className="w-10 h-10 text-black dark:text-white" />}
                          {index === 1 && <Shield className="w-10 h-10 text-black dark:text-white" />}
                          {index === 2 && <Clock className="w-10 h-10 text-black dark:text-white" />}
                          {index > 2 && <CheckCircle2 className="w-10 h-10 text-black dark:text-white" />}
                        </div>
                        <h3 className="text-xl font-serif font-bold mb-4 text-black dark:text-white">{benefit.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {benefit.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Features */}
              {service.features && (
                <div className="space-y-12">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-black dark:text-white text-center">
                    Key Capabilities
                  </h2>
                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 max-w-4xl mx-auto">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                        <span className="text-lg text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Process */}
              {service.process && (
                <div className="space-y-12">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-black dark:text-white text-center">
                    How It Works
                  </h2>
                  <div className="space-y-8 max-w-4xl mx-auto">
                    {service.process.map((step, index) => (
                      <div key={index} className="flex gap-8 p-8 border-b border-gray-100 dark:border-gray-800 last:border-0">
                        <div className="flex-shrink-0 w-16 h-16 bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold font-mono text-2xl rounded-full">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-serif font-bold text-2xl mb-3 text-black dark:text-white">
                            {step.title}
                          </h3>
                          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies */}
              {service.technologies && (
                <div className="space-y-12">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-black dark:text-white text-center">
                    Technologies
                  </h2>
                  <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                    {service.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-base font-mono text-gray-700 dark:text-gray-300 hover:border-black dark:hover:border-white transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Projects */}
              {relatedProjects && relatedProjects.length > 0 && (
                <div className="space-y-12 pt-12 border-t border-gray-200 dark:border-gray-700">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-black dark:text-white text-center">
                    Featured Projects
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    {relatedProjects.map((project) => (
                      <Link key={project.id} href={`/project/${project.id}`} className="group block">
                        <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-900 mb-6">
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        <h3 className="text-2xl font-serif font-bold mb-2 group-hover:underline decoration-2 underline-offset-4">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                          {project.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>

            {/* Other Services */}
            {otherServices.length > 0 && (
              <motion.section variants={itemVariants} className="space-y-12 pt-24 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-4xl md:text-5xl font-serif font-bold text-black dark:text-white">
                  Other Services
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {otherServices.map((otherService) => (
                    <Link
                      key={otherService.id}
                      href={`/service/${otherService.id}`}
                      className="group p-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-300"
                    >
                      <div className="flex items-start gap-6">
                        <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{otherService.icon}</div>
                        <div>
                          <h4 className="font-serif font-bold text-xl text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors mb-2">
                            {otherService.title}
                          </h4>
                          <p className="text-sm font-mono text-gray-600 dark:text-gray-400">
                            {otherService.category}
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.section>
            )}

          </motion.div>
        </article>
      </main>

      <ContactModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} projectTitle={service.title} />
    </>
  )
}
