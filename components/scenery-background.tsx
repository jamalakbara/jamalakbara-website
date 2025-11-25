'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const SceneryBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const skyRef = useRef<HTMLDivElement>(null)
  const celestialRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Animation Logic
  useEffect(() => {
    if (!mounted || !containerRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0
        }
      })

      // 1. Sky Gradient Animation
      // Light: Morning -> Noon -> Sunset -> Night
      // Dark: Night -> Deep Night -> Dawn

      // Animate Sky Background
      // We'll use a simple interpolation for now, but GSAP can tween colors
      // Since we are using CSS transitions for theme switch, we focus on scroll changes
      // 1. Sky Gradient Animation
      // Duration: 10 (Covers 0% to 100% of scroll)
      // 1. Sky Gradient Animation
      // Duration: 10 (Covers 0% to 100% of scroll)
      if (resolvedTheme === 'light') {
        // Hold Day Color (0% -> 70%)
        tl.set(skyRef.current, { backgroundColor: '#87CEEB' }, 0)

        // Sunset Phase (70% -> 85%) - Turns Orange as sun drops
        tl.to(skyRef.current, {
          backgroundColor: '#FF7F50', // Coral/Orange
          ease: 'none',
          duration: 1.5
        }, 7)

          // Night Phase (85% -> 100%) - Turns Dark as sun sinks
          .to(skyRef.current, {
            backgroundColor: '#1a1a2e', // Night Blue
            ease: 'none',
            duration: 1.5
          }, 8.5)
      } else {
        // Dark Mode Gradient
        // 0% -> 60%: Deep Night Blue
        tl.set(skyRef.current, { backgroundColor: '#0f172a' }, 0)

        // 60% -> 85%: Pre-Dawn Purple/Indigo
        tl.to(skyRef.current, {
          backgroundColor: '#312e81', // Indigo
          ease: 'none',
          duration: 2.5
        }, 6)

          // 85% -> 100%: Dawn Blue (Hint of morning)
          .to(skyRef.current, {
            backgroundColor: '#4f46e5', // Lighter Indigo/Blue
            ease: 'none',
            duration: 1.5
          }, 8.5)
      }

      // 2. Celestial Body Arc (Sun or Moon)
      // We use a 0-10 timeline.
      // 0-3: Rise
      // 3-7: Float across top
      // 7-10: Set

      // Initial Position
      gsap.set(celestialRef.current, { x: '0vw', y: '0vh' })

      // Phase 1: Rise (0% -> 30%)
      tl.fromTo(celestialRef.current,
        { x: '0vw', y: '0vh' },
        {
          x: '30vw',
          y: '-20vh', // Peak height
          ease: 'power1.out',
          duration: 3
        }, 0)

        // Phase 2: Float Across (30% -> 70%)
        .to(celestialRef.current, {
          x: '60vw',
          y: '-20vh', // Stay at peak
          ease: 'none',
          duration: 4
        }, 3)

        // Phase 3: Set (70% -> 100%)
        .to(celestialRef.current, {
          x: '90vw',
          y: '55vh', // Sunk into footer
          scale: 0.9,
          ease: 'power1.in',
          duration: 3
        }, 7)

      // 3. Stars Animation (Dark Mode Only)
      if (resolvedTheme === 'dark' && starsRef.current) {
        gsap.to(starsRef.current, {
          y: -50, // Parallax move up
          opacity: 0.8,
          scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 2
          }
        })
      }

    }, containerRef)

    return () => ctx.revert()
  }, [mounted, resolvedTheme])

  if (!mounted) return null

  const isDark = resolvedTheme === 'dark'

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-1000 bg-gray-900">
      {/* Sky Layer */}
      <div
        ref={skyRef}
        className={`absolute inset-0 ${isDark ? 'bg-slate-900' : 'bg-sky-300'}`}
      />

      {/* Stars (Dark Mode Only) */}
      {isDark && (
        <div ref={starsRef} className="absolute inset-0 opacity-60">
          {/* Generate random stars */}
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Celestial Body */}
      <div
        ref={celestialRef}
        className="absolute w-24 h-24 transition-all duration-1000"
        style={{
          left: '10vw',
          top: '30vh',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {isDark ? (
          // Moon (SVG with Mask for true transparency)
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            <defs>
              <mask id="moonMask">
                {/* Base Circle (White = Visible) */}
                <circle cx="50" cy="50" r="48" fill="white" />
                {/* Cutout Circle (Black = Invisible) - Shifted up and right to create crescent */}
                <circle cx="65" cy="35" r="45" fill="black" />
              </mask>
            </defs>
            {/* The Moon Shape */}
            <circle cx="50" cy="50" r="48" fill="#f1f5f9" mask="url(#moonMask)" />
          </svg>
        ) : (
          // Sun (CSS Circle)
          <div className="w-full h-full rounded-full bg-yellow-400 shadow-[0_0_60px_rgba(255,215,0,0.6)]" />
        )}
      </div>

      {/* Scenery Layers */}
      <div className="absolute bottom-0 left-0 right-0 h-[40vh] md:h-[60vh] transition-opacity duration-1000">

        {/* LIGHT MODE: MOUNTAINS */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
          {/* Back Mountain */}
          <svg className="absolute bottom-0 w-full h-full text-emerald-800/20" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          {/* Middle Mountain */}
          <svg className="absolute bottom-0 w-full h-full text-emerald-700/40" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          {/* Front Mountain */}
          <svg className="absolute bottom-0 w-full h-full text-emerald-600/60" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,256L48,245.3C96,235,192,213,288,192C384,171,480,149,576,160C672,171,768,213,864,229.3C960,245,1056,235,1152,208C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        {/* DARK MODE: BEACH / WAVES */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
          {/* Back Wave */}
          <svg className="absolute bottom-0 w-full h-full text-blue-900/30 animate-pulse" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ animationDuration: '4s' }}>
            <path fill="currentColor" d="M0,128L48,144C96,160,192,192,288,197.3C384,203,480,181,576,165.3C672,149,768,139,864,154.7C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          {/* Middle Wave */}
          <svg className="absolute bottom-0 w-full h-full text-blue-800/50 animate-pulse" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ animationDuration: '3s', animationDelay: '1s' }}>
            <path fill="currentColor" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          {/* Front Wave */}
          <svg className="absolute bottom-0 w-full h-full text-blue-700/70 animate-pulse" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ animationDuration: '5s', animationDelay: '0.5s' }}>
            <path fill="currentColor" d="M0,256L48,261.3C96,267,192,277,288,266.7C384,256,480,224,576,213.3C672,203,768,213,864,229.3C960,245,1056,267,1152,266.7C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

      </div>
    </div>
  )
}
