'use client'

import { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function MountainBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const skyRef = useRef<HTMLDivElement>(null)
  const sunRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useGSAP(() => {
    if (!mounted) return

    // 1. Sky Gradient Animation
    // Morning (Top) -> Day -> Sunset -> Night (Bottom)
    gsap.fromTo(skyRef.current,
      {
        background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F7FA 100%)' // Morning
      },
      {
        background: 'linear-gradient(to bottom, #0B1026 0%, #2B32B2 100%)', // Night
        ease: 'none',
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1
        }
      }
    )

    // 2. Sun/Moon Movement (Arc)
    // Start: Bottom Left (Rise)
    // Mid: Top Center (Noon)
    // End: Bottom Right (Set) -> into CTA Section

    // We use a motion path approximation using x/y coordinates
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
      }
    })

    // Rise to Noon
    tl.fromTo(sunRef.current,
      { x: '0vw', y: '0vh' }, // Relative to initial position
      {
        x: '40vw',
        y: '-20vh', // Move up and right
        scale: 1,
        backgroundColor: '#FFD700', // Gold Sun
        boxShadow: '0 0 60px rgba(255, 215, 0, 0.6)',
        ease: 'power1.out',
        duration: 0.5
      })

      // Noon to Set (into Night)
      .to(sunRef.current, {
        x: '80vw',
        y: '55vh', // Sunk into footer
        scale: 0.9,
        backgroundColor: '#FF8C00', // Orange/Red Sunset color
        boxShadow: '0 0 40px rgba(255, 140, 0, 0.5)',
        ease: 'power1.in',
        duration: 0.5
      })

  }, { scope: containerRef, dependencies: [mounted] })

  if (!mounted) return null

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Sky Layer */}
      <div ref={skyRef} className="absolute inset-0 transition-colors duration-1000" />

      {/* Celestial Body (Sun) */}
      <div
        ref={sunRef}
        className="absolute w-24 h-24 rounded-full bg-yellow-400 shadow-[0_0_60px_rgba(255,215,0,0.6)]"
        style={{
          left: '10vw',
          top: '30vh', // Start position (Higher, visible)
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Mountain Layers (SVG) */}
      <div className="absolute bottom-0 left-0 right-0 h-[40vh] md:h-[60vh]">
        <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
          {/* Back Layer - Mist/Far Mountains */}
          <path
            fill="rgba(255,255,255,0.3)"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />

          {/* Middle Layer */}
          <path
            fill="rgba(255,255,255,0.6)"
            d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,170.7C672,149,768,139,864,154.7C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />

          {/* Front Layer - Darker */}
          <path
            fill="rgba(255,255,255,0.9)"
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </div>
  )
}
