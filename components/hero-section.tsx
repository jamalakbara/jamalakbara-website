'use client'

import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { AmbientBackground } from '@/components/ambient-background'
import { useStore } from '@/lib/store'
import { motion } from 'framer-motion'

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleContainerRef = useRef<HTMLHeadingElement>(null)
  const [currentTime, setCurrentTime] = useState('')
  const { goToSection } = useStore()

  // RAF throttling refs
  const mouseRafId = useRef<number | null>(null)
  const mousePos = useRef({ x: 0.5, y: 0.5 })

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Jakarta'
      }))
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      // Stagger reveal for main title
      tl.fromTo(".char-creative",
        { y: 120, rotateX: 90, opacity: 0 },
        {
          y: 0,
          rotateX: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.03,
          ease: "back.out(1.2)"
        },
        "+=0.3"
      )
        .fromTo(".char-developer",
          { y: 120, rotateX: -90, opacity: 0 },
          {
            y: 0,
            rotateX: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.03,
            ease: "back.out(1.2)"
          },
          "-=0.8"
        )
        // Subtitle fade in
        .fromTo(".hero-subtitle",
          { y: 30, opacity: 0, filter: "blur(10px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8 },
          "-=0.5"
        )
        // Metadata fade in
        .fromTo(".hero-meta",
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          "-=0.3"
        )
        // CTA button
        .fromTo(".hero-cta",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.2"
        )

    }, containerRef)

    // RAF-throttled Magnetic Effect
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      }

      if (mouseRafId.current === null) {
        mouseRafId.current = requestAnimationFrame(() => {
          if (!titleContainerRef.current) {
            mouseRafId.current = null
            return
          }

          const x = (mousePos.current.x - 0.5) * 2
          const y = (mousePos.current.y - 0.5) * 2

          gsap.to(titleContainerRef.current, {
            x: x * 20,
            y: y * 15,
            rotationX: -y * 3,
            rotationY: x * 3,
            duration: 1.5,
            ease: "power2.out",
            overwrite: 'auto'
          })

          mouseRafId.current = null
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      ctx.revert()
      window.removeEventListener('mousemove', handleMouseMove)
      if (mouseRafId.current !== null) cancelAnimationFrame(mouseRafId.current)
    }
  }, [])

  // Helper to split text into chars
  const splitText = (text: string, className: string) => {
    return text.split('').map((char, i) => (
      <span
        key={i}
        className={`inline-block ${className} ${char === ' ' ? 'w-[2vw]' : ''}`}
        style={{ willChange: 'transform, opacity' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))
  }

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col relative overflow-hidden pt-20">
      {/* Ambient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AmbientBackground />
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center relative z-10" style={{ perspective: '1000px' }}>
        <div className="text-center px-4">
          <h1
            ref={titleContainerRef}
            className="font-bold tracking-tighter leading-[0.85] uppercase flex flex-col items-center justify-center select-none will-change-transform"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Row 1: CREATIVE */}
            <div className="overflow-hidden mb-2 md:mb-4">
              <span className="block text-[15vw] md:text-[12vw] lg:text-[10vw] text-white">
                {splitText("CREATIVE", "char-creative")}
              </span>
            </div>

            {/* Row 2: DEVELOPER (Outlined) */}
            <div className="overflow-hidden">
              <span
                className="block text-[15vw] md:text-[12vw] lg:text-[10vw] text-transparent"
                style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.7)' }}
              >
                {splitText("DEVELOPER", "char-developer")}
              </span>
            </div>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle max-w-xl mx-auto text-base md:text-lg font-light tracking-wide text-white/50 mt-8 md:mt-12">
            I make the web feel new again.
          </p>

          {/* CTA Button */}
          <div className="hero-cta mt-10 md:mt-14">
            <button
              onClick={() => goToSection(1)}
              className="group relative px-8 py-4 rounded-full border border-white/20 text-sm font-medium uppercase tracking-widest text-white/80 hover:text-white hover:border-white/40 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">View Selected Works</span>
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom hint - Animated */}
      <div className="hero-meta relative z-20 flex justify-center pb-8">
        <motion.div
          className="flex flex-col items-center gap-2 text-white/30 cursor-pointer"
          onClick={() => goToSection(1)}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Scroll or swipe</span>
          <motion.div
            className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent"
            animate={{ scaleY: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  )
}