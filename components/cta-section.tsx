'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { gsap } from 'gsap'
import { getStaticContent } from '@/lib/static-content'

const siteConfig = getStaticContent.siteConfig()

export function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Mouse position for magnetic effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring physics for smooth movement
  const springConfig = { damping: 20, stiffness: 150 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(".cta-headline",
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
      )

      gsap.fromTo(".cta-button",
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)", delay: 0.5 }
      )

      gsap.fromTo(".cta-footer",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.7 }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

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
    <div ref={containerRef} className="w-full h-full flex flex-col relative overflow-hidden bg-[#0a0a0a]">
      {/* Subtle gradient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-white/[0.03] via-transparent to-transparent" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          {/* Massive Headline */}
          <h2 className="cta-headline text-[12vw] md:text-[10vw] lg:text-[8vw] font-bold tracking-tighter leading-[0.9] uppercase mb-16">
            <span className="block text-white">Let&apos;s</span>
            <span
              className="block text-transparent"
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
              href={`mailto:${siteConfig.contact.email}`}
              style={{ x, y }}
              className="relative inline-flex items-center justify-center w-40 h-40 md:w-48 md:h-48 rounded-full group"
            >
              {/* Rotating border */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{
                  background: `conic-gradient(from 0deg, transparent, rgba(255,255,255,0.3), transparent, transparent)`,
                }}
              />

              {/* Inner circle */}
              <div className={`absolute inset-[2px] rounded-full transition-all duration-500 ${isHovered ? 'bg-white' : 'bg-[#0a0a0a]'
                }`} />

              {/* Text */}
              <span className={`relative z-10 text-sm md:text-base font-medium uppercase tracking-[0.2em] transition-colors duration-500 ${isHovered ? 'text-black' : 'text-white/70'
                }`}>
                Get in touch
              </span>

              {/* Expand ring on hover */}
              <motion.div
                className="absolute inset-0 rounded-full border border-white/10"
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
          <p className="text-sm text-white/30 font-sans tracking-wide">
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
                className="text-sm text-white/30 hover:text-white transition-colors font-sans uppercase tracking-wider"
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