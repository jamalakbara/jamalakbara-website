'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { gsap } from 'gsap'
import { getStaticContent } from '@/lib/static-content'
import { useSectionManager } from './section-manager'

const siteConfig = getStaticContent.siteConfig()

export function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const { currentSection } = useSectionManager()

  // Mouse position for magnetic effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring physics for smooth movement
  const springConfig = { damping: 20, stiffness: 150 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Set initial hidden state for elements (before animation)
  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion) return

    // Initially hide all animated elements
    gsap.set(containerRef.current.querySelectorAll(".cta-headline-line, .cta-button, .cta-copyright, .cta-social-link"), {
      opacity: 0, y: 30, filter: "blur(10px)"
    })
  }, [prefersReducedMotion])

  // Trigger animation when section becomes visible
  useEffect(() => {
    if (!containerRef.current) return

    // Only animate when CTA section is active (section index 3) and hasn't animated yet
    const isCTAActive = currentSection === 3
    if (!isCTAActive || hasAnimated) return

    const ctx = gsap.context(() => {
      // Skip complex animations if user prefers reduced motion
      if (prefersReducedMotion) {
        gsap.set([
          ".cta-headline-line", ".cta-button", ".cta-footer",
          ".cta-copyright", ".cta-social-link"
        ], {
          opacity: 1, y: 0, scale: 1, filter: "blur(0px)"
        })
        setHasAnimated(true)
        return
      }

      // Master timeline with blur + slide for ALL elements
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
          duration: 0.7
        },
        onComplete: () => setHasAnimated(true)
      })

      // === HEADLINE LINES - Blur + slide with stagger ===
      tl.fromTo(".cta-headline-line",
        { y: 50, opacity: 0, filter: "blur(10px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out"
        },
        "+=0.1"
      )

        // === BUTTON - Blur + slide + slight scale ===
        .fromTo(".cta-button",
          { y: 40, opacity: 0, filter: "blur(10px)", scale: 0.95 },
          { y: 0, opacity: 1, filter: "blur(0px)", scale: 1, duration: 0.8 },
          "-=0.4"
        )

        // === FOOTER COPYRIGHT ===
        .fromTo(".cta-copyright",
          { y: 20, opacity: 0, filter: "blur(8px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.5 },
          "-=0.3"
        )

        // === SOCIAL LINKS - Staggered ===
        .fromTo(".cta-social-link",
          { y: 15, opacity: 0, filter: "blur(6px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.4,
            stagger: 0.08,
            ease: "power2.out"
          },
          "-=0.3"
        )

    }, containerRef)
  }, [currentSection, hasAnimated, prefersReducedMotion])

  // Magnetic button effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY

    const pull = 0.4
    mouseX.set(distanceX * pull)
    mouseY.set(distanceY * pull)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col relative overflow-hidden">
      {/* Subtle gradient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-white/[0.03] via-transparent to-transparent" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          {/* Massive Headline */}
          <h2 className="cta-headline text-[12vw] md:text-[10vw] lg:text-[8vw] font-bold tracking-tighter leading-[0.9] uppercase mb-16">
            <span className="cta-headline-line block text-white overflow-hidden">Let&apos;s</span>
            <span
              className="cta-headline-line block text-transparent overflow-hidden"
              style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}
            >
              Work
            </span>
          </h2>

          {/* Magnetic Button with rotating border */}
          <div
            ref={buttonRef}
            className="cta-button inline-block"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
          >
            <motion.a
              href="https://wa.me/6281321766565"
              target="_blank"
              rel="noopener noreferrer"
              style={{ x, y }}
              className="relative inline-flex items-center justify-center w-40 h-40 md:w-48 md:h-48 rounded-full group"
            >
              {/* Rotating border - blue gradient */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{
                  background: `conic-gradient(from 0deg, transparent, rgba(80, 160, 255, 0.5), rgba(120, 200, 255, 0.3), transparent, transparent)`,
                }}
              />

              {/* Inner circle - glassy blue */}
              <div
                className={`absolute inset-[2px] rounded-full transition-all duration-500 backdrop-blur-sm ${isHovered
                  ? 'bg-white'
                  : 'bg-gradient-to-br from-blue-900/60 via-blue-950/80 to-slate-900/90 border border-blue-400/20'
                  }`}
              />

              {/* Text */}
              <span className={`relative z-10 text-sm md:text-base font-medium uppercase tracking-[0.2em] transition-colors duration-500 ${isHovered ? 'text-blue-900' : 'text-white/90'
                }`}>
                Get in touch
              </span>

              {/* Expand ring on hover - blue tint */}
              <motion.div
                className="absolute inset-0 rounded-full border border-blue-400/30"
                animate={{
                  scale: isHovered ? 1.3 : 1,
                  opacity: isHovered ? 0 : 1
                }}
                transition={{ duration: 0.4 }}
              />
            </motion.a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="cta-footer border-t border-white/10 px-6 md:px-12 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left: Copyright */}
          <p className="cta-copyright text-sm text-white/30 font-sans tracking-wide">
            © {new Date().getFullYear()} {siteConfig.brand.name}
          </p>

          {/* Right: Social links */}
          <div className="flex items-center gap-8">
            {siteConfig.social.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-social-link text-sm text-white/30 hover:text-white transition-colors font-sans uppercase tracking-wider"
              >
                {social.platform}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}