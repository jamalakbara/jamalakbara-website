'use client'

import { useRef, useState, MouseEvent, useEffect } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { getStaticContent } from '@/lib/static-content'
import type { Project } from '@/lib/content-types'
import { DistortedImage } from '@/components/distorted-image'

gsap.registerPlugin(ScrollTrigger)

const projects = getStaticContent.projects()

export function BentoGrid() {
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // Header text reveal animation
      gsap.fromTo(".bento-header-line",
        { y: 100, opacity: 0, rotateX: 45 },
        {
          y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.2, ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Description reveal
      gsap.fromTo(".bento-description",
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="work" className="py-32 px-4 md:px-8 bg-[#0a0a0a] relative z-10 overflow-hidden" ref={containerRef}>
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header with GSAP Animation */}
        <div
          ref={headerRef}
          className="mb-24 md:mb-32 flex flex-col md:flex-row md:items-end justify-between gap-8"
          style={{ perspective: '1000px' }}
        >
          <div className="overflow-hidden">
            <h2 className="font-bold tracking-tighter uppercase leading-[0.85] text-white">
              <span className="bento-header-line block text-[12vw] md:text-[7vw]">Selected</span>
              <span className="bento-header-line block text-[12vw] md:text-[7vw]">Works</span>
            </h2>
          </div>
          <div className="md:max-w-md md:pb-4">
            <p className="bento-description text-lg text-white/60 font-light leading-relaxed">
              A collection of digital experiences crafted with precision, focusing on interaction, performance, and aesthetic excellence.
            </p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <BentoCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function BentoCard({ project, index }: { project: Project, index: number }) {
  // Define layout pattern for dynamic grid
  // Pattern: Hero(12) -> Half(6,6) -> Asym(7,5) -> Asym(5,7) -> Half(6,6)
  const pattern = [
    { col: 'md:col-span-12', aspect: 'aspect-[16/9] md:aspect-[2.2/1]' },
    { col: 'md:col-span-6', aspect: 'aspect-[4/3] md:aspect-[16/10]' },
    { col: 'md:col-span-6', aspect: 'aspect-[4/3] md:aspect-[16/10]' },
    { col: 'md:col-span-7', aspect: 'aspect-[4/3] md:aspect-[16/10]' },
    { col: 'md:col-span-5', aspect: 'aspect-[4/3] md:aspect-[16/10]' },
    { col: 'md:col-span-5', aspect: 'aspect-[4/3] md:aspect-[16/10]' },
    { col: 'md:col-span-7', aspect: 'aspect-[4/3] md:aspect-[16/10]' },
    { col: 'md:col-span-6', aspect: 'aspect-[4/3] md:aspect-[16/10]' },
    { col: 'md:col-span-6', aspect: 'aspect-[4/3] md:aspect-[16/10]' },
  ]

  const layout = pattern[index % pattern.length]
  const colSpanClass = `${layout.col} ${layout.aspect}`

  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Mouse tracking for magnetic effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - left)
    mouseY.set(e.clientY - top)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-3xl overflow-hidden bg-zinc-900 border border-white/5 ${colSpanClass}`}
    >
      <Link href={`/work/${project.id}`} className="block h-full w-full cursor-none">

        {/* Background Image Logic */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Desktop: WebGL Distortion */}
          <div className="hidden md:block absolute inset-0 w-full h-full">
            <DistortedImage
              src={project.image || '/placeholder.jpg'}
              alt={project.title}
              isHovered={isHovered}
              className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>

          {/* Mobile: Standard Optimized Image */}
          <div className="block md:hidden absolute inset-0 w-full h-full">
            <div className="relative w-full h-full transition-transform duration-700 ease-out group-hover:scale-105">
              <Image
                src={project.image || '/placeholder.jpg'}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>

          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 pointer-events-none" />
        </div>

        {/* Content Container */}
        <div className="absolute inset-0 z-10 p-6 md:p-10 flex flex-col justify-between">

          {/* Top Row: Year & Category */}
          <div className="flex justify-between items-start">
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full border border-white/20 bg-black/20 backdrop-blur-md text-xs font-mono uppercase tracking-wider text-white/80">
                {project.year || '2024'}
              </span>
              <span className="hidden md:inline-block px-3 py-1 rounded-full border border-white/20 bg-black/20 backdrop-blur-md text-xs font-mono uppercase tracking-wider text-white/80">
                {project.category}
              </span>
            </div>
            {/* View Project Button (Custom Cursor target) */}
            <div className="md:hidden w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-black" />
            </div>
          </div>

          {/* Bottom Row: Title & Tech Stack */}
          <div className="relative overflow-hidden">
            <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
              <h3 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                {project.title}
              </h3>

              <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
                {project.tech?.slice(0, 4).map((t, i) => (
                  <span key={i} className="text-[10px] md:text-xs font-medium text-white/70 bg-white/10 px-2 py-1 rounded">
                    {t}
                  </span>
                ))}
                {project.tech && project.tech.length > 4 && (
                  <span className="text-[10px] md:text-xs font-medium text-white/70 bg-white/10 px-2 py-1 rounded">
                    +{project.tech.length - 4}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Floating "View" Button that follows mouse (Desktop only) */}
        <CursorFollower mouseX={mouseX} mouseY={mouseY} />

      </Link>
    </motion.div>
  )
}

function CursorFollower({ mouseX, mouseY }: { mouseX: any, mouseY: any }) {
  // Optimized spring physics for snappy, smooth following
  // Reduced mass for less inertia, increased stiffness for faster tracking
  const springConfig = { damping: 28, stiffness: 500, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  return (
    <motion.div
      style={{
        left: x,
        top: y,
        translateX: '-50%',
        translateY: '-50%'
      }}
      className="hidden md:flex absolute z-50 pointer-events-none items-center justify-center w-24 h-24 bg-blue-600 rounded-full opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out"
    >
      <span className="text-white text-sm font-medium tracking-widest uppercase">View</span>
    </motion.div>
  )
}
