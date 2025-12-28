'use client'

import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { useStore } from '@/lib/store'

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleContainerRef = useRef<HTMLHeadingElement>(null)
  const creativeRef = useRef<HTMLSpanElement>(null)
  const developerRef = useRef<HTMLSpanElement>(null)
  const isLoaded = useStore((state) => state.isLoaded)
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false)

  // Floating elements refs
  const orbsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only run animation when preloader is done
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      // 1. Initial State Set
      // Split text logic is manual here to avoid extra dependencies, 
      // but for "Awwwards" level, we want char-by-char reveal.
      // We will select chars by class below.

      // 2. Animate Background Orbs (Continuous)
      gsap.to(".orb", {
        y: "random(-20, 20)",
        x: "random(-20, 20)",
        opacity: "random(0.3, 0.6)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 1
      })

      // 3. Entrance Animation (Wait for Preloader if needed, 
      // but here we just start after a small delay for dramatic effect)

      // Animate "CREATIVE" chars
      tl.fromTo(".char-creative",
        { y: 120, rotateY: 10, opacity: 0 },
        {
          y: 0,
          rotateY: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.04,
          ease: "back.out(1.7)"
        },
        "+=0.5"
      )

        // Animate "DEVELOPER" chars
        .fromTo(".char-developer",
          { y: 120, rotateY: -10, opacity: 0 },
          {
            y: 0,
            rotateY: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.04,
            ease: "back.out(1.7)"
          },
          "-=1.0"
        )

        // Animate Subtitle
        .fromTo(".subtitle",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          "-=0.5"
        )

        // Animate Scroll Indicator
        .fromTo(".scroll-indicator",
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          "-=0.5"
        )

    }, containerRef)

    // Magnetic / Parallax Effect on Mouse Move
    const handleMouseMove = (e: MouseEvent) => {
      if (!titleContainerRef.current) return

      const { clientX, clientY } = e
      const x = (clientX / window.innerWidth - 0.5) * 2 // -1 to 1
      const y = (clientY / window.innerHeight - 0.5) * 2 // -1 to 1

      // Move the whole title block slightly
      gsap.to(titleContainerRef.current, {
        x: x * 30, // 30px movement range
        y: y * 30,
        rotationX: -y * 5, // Subtle 3D tilt
        rotationY: x * 5,
        duration: 2,
        ease: "power2.out"
      })

      // Move background orbs more for depth (parallax)
      if (orbsRef.current) {
        gsap.to(orbsRef.current, {
          x: -x * 60,
          y: -y * 60,
          duration: 3,
          ease: "power2.out"
        })
      }
    }

    // Scroll listener
    const handleScroll = () => {
      setScrollIndicatorHidden(window.scrollY > 100)

      // Parallax scroll effect for title
      if (titleContainerRef.current) {
        gsap.to(titleContainerRef.current, {
          y: window.scrollY * 0.5, // Move down at half speed
          opacity: 1 - (window.scrollY / 700), // Fade out
          overwrite: 'auto'
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)

    return () => {
      ctx.revert()
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isLoaded])

  // Helper to split text into chars
  const splitText = (text: string, className: string) => {
    return text.split('').map((char, i) => (
      <span key={i} className={`inline-block ${className} ${char === ' ' ? 'w-[4vw]' : ''}`}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))
  }

  return (
    <section
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center relative px-4 md:px-8 overflow-hidden bg-[#0a0a0a] perspective-1000"
      id="hero"
    >
      {/* Ambient Floating Elements (Background) */}
      <div ref={orbsRef} className="absolute inset-0 z-0 pointer-events-none">
        <div className="orb absolute top-[20%] left-[20%] w-[40vw] h-[40vw] bg-purple-900/10 rounded-full blur-[100px]" />
        <div className="orb absolute top-[60%] right-[10%] w-[35vw] h-[35vw] bg-blue-900/10 rounded-full blur-[100px]" />
        {/* Adds subtle "dust" or small particles if needed, keeping it minimal for now */}
        <div className="orb absolute top-[40%] left-[60%] w-[200px] h-[200px] bg-indigo-500/5 rounded-full blur-[80px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center" style={{ perspective: '1000px' }}>
        <h1
          ref={titleContainerRef}
          className="font-bold tracking-tighter leading-[0.85] uppercase mb-16 md:mb-24 flex flex-col items-center justify-center select-none"
        >
          {/* Row 1: CREATIVE */}
          <div className="overflow-hidden mb-2 md:mb-4">
            <span ref={creativeRef} className="block text-[13vw] md:text-[10vw] lg:text-[9vw] text-white mix-blend-difference">
              {splitText("CREATIVE", "char-creative")}
            </span>
          </div>

          {/* Row 2: DEVELOPER (Outlined) */}
          <div className="overflow-hidden">
            <span ref={developerRef} className="block text-[13vw] md:text-[10vw] lg:text-[9vw] text-transparent"
              style={{ WebkitTextStroke: '1px rgba(255,255,255,0.8)' }}>
              {splitText("DEVELOPER", "char-developer")}
            </span>
          </div>
        </h1>

        <p className="subtitle max-w-2xl mx-auto text-lg md:text-xl font-light tracking-wide text-white/50 mix-blend-plus-lighter mt-8">
          Crafting immersive digital experiences with precision, artistry, and physics-driven interaction.
        </p>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div
        className={`scroll-indicator absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-700 ${scrollIndicatorHidden ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-mono animate-pulse">
            Scroll
          </span>
          {/* Looping line animation */}
          <div className="relative w-[1px] h-16 bg-white/10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-white/50 to-transparent animate-scroll-line" />
          </div>
        </div>
      </div>

    </section>
  )
}