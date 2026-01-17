'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // Animate on mount (when section becomes visible)
      gsap.fromTo(".about-header",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
      )

      gsap.fromTo(".bio-word",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.02, ease: "power3.out", delay: 0.4 }
      )

      gsap.fromTo(".service-item",
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out", delay: 0.6 }
      )

      gsap.fromTo(".recognition-item",
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out", delay: 0.7 }
      )

      gsap.fromTo(".tech-marquee",
        { opacity: 0 },
        { opacity: 1, duration: 0.8, delay: 0.8 }
      )

    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Helper to split bio text into words
  const splitBioText = (text: string) => {
    return text.split(' ').map((word, i) => (
      <span key={i} className="bio-word inline-block mr-2">{word}</span>
    ))
  }

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col relative overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex items-center px-6 md:px-12 lg:px-24 py-16 overflow-y-auto">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

            {/* Left: Header */}
            <div className="lg:col-span-3 about-header">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                <h2 className="text-xs font-mono uppercase tracking-widest text-white/40">About</h2>
              </div>
            </div>

            {/* Right: Content */}
            <div className="lg:col-span-9">
              {/* Bio Statement */}
              <h3 className="text-2xl md:text-4xl lg:text-5xl font-light leading-tight mb-12">
                {splitBioText("Developer with a")}
                <span className="text-white font-normal bio-word inline-block mr-2">designer&apos;s eye.</span>
                {splitBioText("Obsessed with polish, performance, and the details that matter.")}
              </h3>

              {/* Services - Single column, minimal */}
              <div className="border-t border-white/10 pt-10">
                <h4 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-6">What I Do</h4>
                <div className="flex flex-wrap gap-3">
                  {['Frontend', 'Backend', 'UI/UX', 'Mobile'].map(item => (
                    <span
                      key={item}
                      className="service-item px-4 py-2 rounded-full border border-white/10 text-sm text-white/60 hover:text-white hover:border-white/30 transition-all duration-300 cursor-default"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack - Minimal single row */}
      <div className="tech-marquee border-t border-white/10 py-4 relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

        <div className="flex overflow-hidden select-none">
          <div
            className="flex gap-8 animate-marquee-left"
            style={{ animationDuration: '35s' }}
          >
            {['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'Tailwind', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'Tailwind', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS'].map((tech, i) => (
              <span
                key={i}
                className="text-sm md:text-base font-medium uppercase tracking-wider text-white/20 whitespace-nowrap"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}