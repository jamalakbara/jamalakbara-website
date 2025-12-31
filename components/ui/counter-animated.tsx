'use client'

import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring } from 'framer-motion'

interface CounterAnimatedProps {
  from?: number
  to: number
  duration?: number
  className?: string
}

export function CounterAnimated({ from = 0, to, duration = 2, className = "" }: CounterAnimatedProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  const motionValue = useMotionValue(from)
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
    duration: duration * 1000
  })

  useEffect(() => {
    if (inView) {
      motionValue.set(to)
    }
  }, [inView, to, motionValue])

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toString()
      }
    })
  }, [springValue])

  return <span className={className} ref={ref}>{from}</span>
}
