'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useStore } from '@/lib/store'

export function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLDivElement>(null)
  const setIsLoaded = useStore((state) => state.setIsLoaded)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoaded(true)
        // Optional: Remove from DOM or just hide
        if (containerRef.current) {
          containerRef.current.style.display = 'none'
        }
      }
    })

    // Counter Animation
    const counter = { value: 0 }
    tl.to(counter, {
      value: 100,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        setCount(Math.round(counter.value))
      }
    })

      // Curtain Reveal
      .to(containerRef.current, {
        y: '-100%',
        duration: 1,
        ease: "power4.inOut",
        delay: 0.2
      })

    return () => {
      tl.kill()
    }
  }, [setIsLoaded])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] flex items-center justify-end px-8 md:px-16 bg-[#0a0a0a] text-[#f0f0f0]"
    >
      <div
        ref={counterRef}
        className="text-[15vw] md:text-[20vw] font-bold font-sans leading-none tracking-tighter"
      >
        {count}%
      </div>
    </div>
  )
}
