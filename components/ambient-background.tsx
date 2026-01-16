'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

export function AmbientBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const orbsRef = useRef<HTMLDivElement>(null)

  // RAF throttling refs
  const rafId = useRef<number | null>(null)
  const mousePos = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Continuous floating animation
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
    }, containerRef)

    // RAF-throttled Mouse Parallax Effect
    const handleMouseMove = (e: MouseEvent) => {
      // Store mouse position (normalized 0-1)
      mousePos.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      }

      // Only schedule RAF if not already scheduled
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(() => {
          if (!orbsRef.current) {
            rafId.current = null
            return
          }

          const x = (mousePos.current.x - 0.5) * 2 // -1 to 1
          const y = (mousePos.current.y - 0.5) * 2 // -1 to 1

          // Move background orbs for depth
          gsap.to(orbsRef.current, {
            x: -x * 60,
            y: -y * 60,
            duration: 3,
            ease: "power2.out",
            overwrite: 'auto'
          })

          rafId.current = null
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      ctx.revert()
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div ref={orbsRef} className="absolute inset-0 w-full h-full will-change-transform">
        <div className="orb absolute top-[20%] left-[20%] w-[40vw] h-[40vw] bg-purple-900/10 rounded-full blur-[100px]" />
        <div className="orb absolute top-[60%] right-[10%] w-[35vw] h-[35vw] bg-blue-900/10 rounded-full blur-[100px]" />
        <div className="orb absolute top-[40%] left-[60%] w-[200px] h-[200px] bg-indigo-500/5 rounded-full blur-[80px]" />
      </div>
    </div>
  )
}
