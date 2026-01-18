'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Custom hook for scroll-triggered animations within section-based navigation
 * Works with the SectionManager's section visibility system
 */
export function useScrollAnimation(options: {
    threshold?: number
    rootMargin?: string
    triggerOnce?: boolean
} = {}) {
    const ref = useRef<HTMLDivElement>(null)
    const [isInView, setIsInView] = useState(false)
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

    // Check for reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        setPrefersReducedMotion(mediaQuery.matches)

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches)
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true)
                    if (options.triggerOnce) {
                        observer.unobserve(element)
                    }
                } else if (!options.triggerOnce) {
                    setIsInView(false)
                }
            },
            {
                threshold: options.threshold ?? 0.1,
                rootMargin: options.rootMargin ?? '0px'
            }
        )

        observer.observe(element)
        return () => observer.disconnect()
    }, [options.threshold, options.rootMargin, options.triggerOnce])

    return { ref, isInView, prefersReducedMotion }
}

/**
 * Animation variants for common scroll effects
 * Use with Framer Motion's AnimatePresence
 */
export const scrollAnimationVariants = {
    // Fade up with blur
    fadeUpBlur: {
        hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
        }
    },

    // Slide in from left
    slideInLeft: {
        hidden: { opacity: 0, x: -60 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
        }
    },

    // Slide in from right
    slideInRight: {
        hidden: { opacity: 0, x: 60 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
        }
    },

    // Scale up with fade
    scaleUp: {
        hidden: { opacity: 0, scale: 0.85 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }
        }
    },

    // Stagger container
    staggerContainer: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    },

    // Stagger item
    staggerItem: {
        hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
        }
    },

    // Character reveal (for text)
    charReveal: {
        hidden: { y: 100, rotateX: 90, opacity: 0 },
        visible: {
            y: 0,
            rotateX: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }
        }
    },

    // Mask reveal (clip-path based)
    maskReveal: {
        hidden: { clipPath: 'inset(100% 0 0 0)' },
        visible: {
            clipPath: 'inset(0% 0 0 0)',
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
        }
    },

    // Reduced motion fallback
    reducedMotion: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.3 }
        }
    }
}

/**
 * Helper to get animation variants based on reduced motion preference
 */
export function getAnimationVariant(
    variant: keyof typeof scrollAnimationVariants,
    prefersReducedMotion: boolean
) {
    return prefersReducedMotion
        ? scrollAnimationVariants.reducedMotion
        : scrollAnimationVariants[variant]
}
