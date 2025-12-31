'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

export function AmbientBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const orbsRef = useRef<HTMLDivElement>(null)

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

    // Mouse Parallax Effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!orbsRef.current) return

      const { clientX, clientY } = e
      const x = (clientX / window.innerWidth - 0.5) * 2 // -1 to 1
      const y = (clientY / window.innerHeight - 0.5) * 2 // -1 to 1

      // Move background orbs for depth
      gsap.to(orbsRef.current, {
        x: -x * 60,
        y: -y * 60,
        duration: 3,
        ease: "power2.out"
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      ctx.revert()
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div ref={orbsRef} className="absolute inset-0 w-full h-full">
        <div className="orb absolute top-[20%] left-[20%] w-[40vw] h-[40vw] bg-purple-900/10 rounded-full blur-[100px]" />
        <div className="orb absolute top-[60%] right-[10%] w-[35vw] h-[35vw] bg-blue-900/10 rounded-full blur-[100px]" />
        <div className="orb absolute top-[40%] left-[60%] w-[200px] h-[200px] bg-indigo-500/5 rounded-full blur-[80px]" />
      </div>
    </div>
  )
}
