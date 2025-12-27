'use client'

import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import Link from 'next/link'

export function Navigation() {
  const [hidden, setHidden] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const { scrollY } = useScroll()
  // const { trackNavigationClick, trackThemeToggle } = useAnalytics() // Analytics
  const { isMenuOpen, setIsMenuOpen } = useStore()

  // Smart Hide Logic
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0
    if (latest > previous && latest > 150) {
      setHidden(true)
    } else {
      setHidden(false)
    }

    if (latest > 50) {
      setHasScrolled(true)
    } else {
      setHasScrolled(false)
    }
  })

  // Staggered Text Hover Component
  const StaggeredText = ({ text, href }: { text: string; href: string }) => {
    return (
      <Link
        href={href}
        className="relative overflow-hidden block text-xl font-medium uppercase tracking-tight group"
      >
        <div className="relative transition-transform duration-500 ease-out group-hover:-translate-y-[100%]">
          {text}
        </div>
        <div className="absolute top-0 left-0 transition-transform duration-500 ease-out translate-y-[100%] group-hover:translate-y-0">
          {text}
        </div>
      </Link>
    )
  }

  const navLinks = [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' }
  ]

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={`fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-6 flex justify-between items-center transition-colors duration-300 ${hasScrolled ? 'bg-background/80 backdrop-blur-md' : 'bg-transparent'
          }`}
      >
        {/* Logo */}
        <Link href="/" className="z-50 text-2xl font-bold tracking-tighter uppercase">
          Jamal
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <StaggeredText key={link.label} text={link.label} href={link.href} />
          ))}
        </div>

        {/* Mobile Menu Button - Minimal */}
        <button
          className="md:hidden z-50 flex flex-col gap-1.5"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <motion.div
            animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="w-8 h-0.5 bg-foreground"
          />
          <motion.div
            animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-8 h-0.5 bg-foreground"
          />
          <motion.div
            animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="w-8 h-0.5 bg-foreground"
          />
        </button>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <motion.div
        initial={{ clipPath: "circle(0% at 100% 0%)" }}
        animate={{ clipPath: isMenuOpen ? "circle(150% at 100% 0%)" : "circle(0% at 100% 0%)" }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        className="fixed inset-0 z-40 bg-foreground text-background flex flex-col justify-center items-center gap-8 md:hidden"
      >
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={() => setIsMenuOpen(false)}
            className="text-4xl font-bold uppercase tracking-tight text-white mix-blend-difference"
          >
            {link.label}
          </Link>
        ))}
      </motion.div>
    </>
  )
}