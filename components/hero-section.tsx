'use client'

import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { useStore } from '@/lib/store'

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const isLoaded = useStore((state) => state.isLoaded)
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false)

  useEffect(() => {
    if (!isLoaded || !containerRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

      // Animate lines up
      tl.fromTo(".hero-line",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          delay: 0.3
        }
      )
        // Animate subtitle
        .fromTo(".subtitle",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          "-=0.6"
        )
        // Animate scroll indicator
        .fromTo(".scroll-indicator",
          { opacity: 0 },
          { opacity: 1, duration: 1 },
          "-=0.5"
        )
    }, containerRef)

    // Scroll listener for indicator
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrollIndicatorHidden(true)
      } else {
        setScrollIndicatorHidden(false)
      }
    }

    // Interactive parallax effect for text
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const x = (clientX / window.innerWidth - 0.5) * 15
      const y = (clientY / window.innerHeight - 0.5) * 15

      if (titleRef.current) {
        gsap.to(titleRef.current, {
          x: x,
          y: y,
          duration: 1.2,
          ease: "power3.out"
        })
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      ctx.revert()
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isLoaded])

  return (
    <section
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center relative px-4 md:px-8 overflow-hidden bg-[#0a0a0a]"
      id="hero"
    >
      {/* Main Content */}
      <div className="relative z-10 text-center">
        <h1
          ref={titleRef}
          className="font-bold tracking-tighter leading-[0.85] uppercase mb-8 flex flex-col items-center justify-center"
        >
          <div className="overflow-hidden">
            <span className="hero-line block text-[14vw] md:text-[10vw] lg:text-[9vw] text-white">
              CREATIVE
            </span>
          </div>
          <div className="overflow-hidden">
            <span className="hero-line block text-[14vw] md:text-[10vw] lg:text-[9vw] text-transparent" style={{ WebkitTextStroke: '2px white' }}>
              DEVELOPER
            </span>
          </div>
        </h1>

        <p className="subtitle max-w-2xl mx-auto text-lg md:text-xl font-light tracking-wide text-white/60">
          Crafting immersive digital experiences with precision, artistry, and physics-driven interaction.
        </p>
      </div>

      {/* Scroll Down Indicator */}
      <div
        className={`scroll-indicator absolute bottom-12 left-1/2 -translate-x-1/2 transition-opacity duration-500 ${scrollIndicatorHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-mono">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </div>

      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[50vw] h-[50vw] bg-purple-900/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[40vw] h-[40vw] bg-blue-900/15 rounded-full blur-[150px]" />
      </div>
    </section>
  )
}