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
    // Failsafe: Always complete after 3 seconds max
    const failsafe = setTimeout(() => {
      setIsLoaded(true)
      if (containerRef.current) {
        containerRef.current.style.display = 'none'
      }
    }, 3000)

    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(failsafe)
        setIsLoaded(true)
        if (containerRef.current) {
          containerRef.current.style.display = 'none'
        }
      }
    })

    // Counter Animation
    const counter = { value: 0 }
    tl.to(counter, {
      value: 100,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: () => {
        setCount(Math.round(counter.value))
      }
    })

      // Curtain Reveal
      .to(containerRef.current, {
        y: '-100%',
        duration: 0.8,
        ease: "power4.inOut",
        delay: 0.1
      })

    return () => {
      clearTimeout(failsafe)
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

