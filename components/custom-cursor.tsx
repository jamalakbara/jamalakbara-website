'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // RAF throttling ref
  const rafId = useRef<number | null>(null)
  const mousePos = useRef({ x: 0, y: 0 })

  // Track mounted state for SSR
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    // Check for touch devices - don't show custom cursor
    if (window.matchMedia('(hover: none)').matches) {
      return
    }

    // Hide default cursor
    document.body.style.cursor = 'none'

    const cursor = cursorRef.current
    const follower = followerRef.current

    if (!cursor || !follower) return

    // RAF-throttled cursor movement
    const moveCursor = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }

      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(() => {
          gsap.to(cursor, {
            x: mousePos.current.x,
            y: mousePos.current.y,
            duration: 0.1,
            ease: 'power2.out',
            overwrite: 'auto'
          })

          gsap.to(follower, {
            x: mousePos.current.x,
            y: mousePos.current.y,
            duration: 0.6,
            ease: 'power3.out',
            overwrite: 'auto'
          })

          rafId.current = null
        })
      }
    }

    // Event delegation for hover detection - much more efficient than MutationObserver
    const handleMouseOver = (e: Event) => {
      const target = e.target as HTMLElement
      const interactive = target.closest('a, button, input, textarea, select, [data-hover], [role="button"]')

      if (interactive && !isHovering) {
        setIsHovering(true)
        gsap.to([cursor, follower], { scale: 1.5, duration: 0.3, overwrite: 'auto' })
      }
    }

    const handleMouseOut = (e: Event) => {
      const target = e.target as HTMLElement
      const relatedTarget = (e as MouseEvent).relatedTarget as HTMLElement | null
      const interactive = target.closest('a, button, input, textarea, select, [data-hover], [role="button"]')

      // Only unhover if we're leaving an interactive element and not entering another one
      if (interactive) {
        const stillOnInteractive = relatedTarget?.closest('a, button, input, textarea, select, [data-hover], [role="button"]')
        if (!stillOnInteractive) {
          setIsHovering(false)
          gsap.to([cursor, follower], { scale: 1, duration: 0.3, overwrite: 'auto' })
        }
      }
    }

    window.addEventListener('mousemove', moveCursor, { passive: true })
    document.addEventListener('mouseover', handleMouseOver, { passive: true })
    document.addEventListener('mouseout', handleMouseOut, { passive: true })

    return () => {
      document.body.style.cursor = 'auto'
      window.removeEventListener('mousemove', moveCursor)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [isMounted, isHovering])

  // Don't render until mounted (prevents hydration mismatch)
  if (!isMounted) {
    return null
  }

  // Don't render on touch devices
  if (window.matchMedia('(hover: none)').matches) {
    return null
  }

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference -translate-x-1/2 -translate-y-1/2 will-change-transform"
      />
      <div
        ref={followerRef}
        className={`fixed top-0 left-0 w-8 h-8 border border-white rounded-full pointer-events-none z-[9998] mix-blend-difference -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 will-change-transform ${isHovering ? 'opacity-50' : 'opacity-100'}`}
      />
    </>
  )
}