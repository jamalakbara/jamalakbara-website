'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { usePathname } from 'next/navigation'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = 'none'

    const cursor = cursorRef.current
    const follower = followerRef.current

    if (!cursor || !follower) return

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      })

      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: 'power3.out'
      })
    }

    const handleHoverStart = () => {
      setIsHovering(true)
      gsap.to([cursor, follower], { scale: 1.5, duration: 0.3 })
    }

    const handleHoverEnd = () => {
      setIsHovering(false)
      gsap.to([cursor, follower], { scale: 1, duration: 0.3 })
    }

    window.addEventListener('mousemove', moveCursor)

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, [data-hover]')
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleHoverStart)
      el.addEventListener('mouseleave', handleHoverEnd)
    })

    // Re-bind listeners on path change
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const newElements = document.querySelectorAll('a, button, input, [data-hover]')
          newElements.forEach(el => {
            // Avoid adding duplicate listeners (simplified approach)
            el.removeEventListener('mouseenter', handleHoverStart)
            el.removeEventListener('mouseleave', handleHoverEnd)
            el.addEventListener('mouseenter', handleHoverStart)
            el.addEventListener('mouseleave', handleHoverEnd)
          })
        }
      })
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.body.style.cursor = 'auto'
      window.removeEventListener('mousemove', moveCursor)
      observer.disconnect()
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleHoverStart)
        el.removeEventListener('mouseleave', handleHoverEnd)
      })
    }
  }, [pathname])

  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
    return null
  }

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference -translate-x-1/2 -translate-y-1/2"
      />
      <div
        ref={followerRef}
        className={`fixed top-0 left-0 w-8 h-8 border border-white rounded-full pointer-events-none z-[9998] mix-blend-difference -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${isHovering ? 'opacity-50' : 'opacity-100'}`}
      />
    </>
  )
}