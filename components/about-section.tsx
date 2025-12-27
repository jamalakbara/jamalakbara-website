'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Parallax for the marquee section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -100])

  return (
    <section id="about" ref={containerRef} className="bg-[#0a0a0a] text-white py-32 relative overflow-hidden">
      {/* Top Content: Bio & Info */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 items-start">

          {/* Header */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <h2 className="text-sm font-mono uppercase tracking-widest text-white/50">About Me</h2>
            </div>
          </div>

          {/* Bio Statement */}
          <div className="md:col-span-9">
            <h3 className="text-3xl md:text-5xl font-light leading-tight mb-12">
              I am a <span className="text-white font-normal">creative developer</span> bridging the gap between design and engineering. My work is driven by precision, physics, and the whitespace between pixels.
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-12">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-white/50 mb-6">Services</h4>
                <ul className="space-y-4">
                  {['Creative Direction', 'Web Development', 'WebGL Experiences', 'Interaction Design'].map(item => (
                    <li key={item} className="flex items-center justify-between group cursor-pointer border-b border-white/5 pb-2 hover:border-white/20 transition-colors">
                      <span className="text-lg text-white/80 group-hover:text-white transition-colors">{item}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-white/50 mb-6">Recognition</h4>
                <ul className="space-y-4">
                  {['Awwwards SOTD', 'CSSDA WOTD', 'FWA of the Day', 'Best Design Award'].map(item => (
                    <li key={item} className="flex items-center justify-between group cursor-pointer border-b border-white/5 pb-2 hover:border-white/20 transition-colors">
                      <span className="text-lg text-white/80 group-hover:text-white transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Massive Tech Stack Section */}
      <div className="relative border-t border-white/10 pt-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
          <h2 className="text-sm font-mono uppercase tracking-widest text-white/50">Tech Stack</h2>
        </div>

        <div className="flex flex-col gap-0 select-none">
          <TechMarquee
            items={['NEXT.JS', 'REACT', 'WEBGL', 'THREE.JS', 'GSAP', 'FRAMER']}
            direction={1}
            speed={40}
          />
          <TechMarquee
            items={['TYPESCRIPT', 'TAILWIND', 'NODE.JS', 'PYTHON', 'FIGMA', 'BLENDER']}
            direction={-1}
            speed={50}
          />
          <TechMarquee
            items={['SHADCN', 'PRISMA', 'POSTGRES', 'DOCKER', 'AWS', 'VERCEL']}
            direction={1}
            speed={45}
          />
        </div>
      </div>
    </section>
  )
}

function TechMarquee({ items, direction = 1, speed = 20 }: { items: string[], direction?: number, speed?: number }) {
  return (
    <div className="relative flex overflow-hidden w-full bg-[#0a0a0a]">
      {/* Gradient Masks for fade effect at edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />

      <motion.div
        initial={{ x: direction === 1 ? "-20%" : "0%" }}
        animate={{ x: direction === 1 ? ["-20%", "0%"] : ["0%", "-20%"] }}
        transition={{
          ease: "linear",
          duration: speed,
          repeat: Infinity
        }}
        className="flex gap-12 md:gap-24 pr-12 md:pr-24"
      >
        {[...items, ...items, ...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className="text-[12vw] md:text-[8vw] font-bold uppercase leading-[0.85] tracking-tighter text-transparent hover:text-white transition-colors duration-500 cursor-none flex-shrink-0"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.2)",
            }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}