'use client'

import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { useStore } from '@/lib/store'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Navigation() {
  const [hidden, setHidden] = useState(false)
  const [activeTab, setActiveTab] = useState('')
  const { scrollY } = useScroll()
  const { isMenuOpen, setIsMenuOpen } = useStore()

  // Smart Hide Logic
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0
    if (latest > previous && latest > 150) {
      setHidden(true)
    } else {
      setHidden(false)
    }
  })

  const navLinks = [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' }
  ]

  return (
    <>
      {/* Desktop Floating Pill Nav */}
      <motion.nav
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: -100, opacity: 0 },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-50 items-center justify-between px-2 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md shadow-lg"
      >
        {/* Logo - Magnetic */}
        <div className="pl-4 pr-8">
          <Magnetic>
            <Link href="/" className="text-xl font-bold tracking-tight text-white hover:text-white/80 transition-colors">
              jamalakbara.
            </Link>
          </Magnetic>
        </div>

        {/* Links - With Sliding Indicator */}
        <div className="flex gap-1 bg-white/5 rounded-full p-1">
          {navLinks.map((link) => (
            <Magnetic key={link.label}>
              <Link
                href={link.href}
                onMouseEnter={() => setActiveTab(link.label)}
                onMouseLeave={() => setActiveTab('')}
                className="relative px-5 py-2 text-sm font-medium uppercase tracking-wide text-white/70 hover:text-white transition-colors"
              >
                {activeTab === link.label && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-white/10 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            </Magnetic>
          ))}
        </div>

        {/* Contact/Status Indicator */}
        <div className="pl-8 pr-4 flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Available</span>
        </div>
      </motion.nav>

      {/* Mobile Nav Button (Top Right) */}
      <motion.div
        variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35 }}
        className="md:hidden fixed top-6 right-6 z-50 mix-blend-difference"
      >
        <button
          className="flex flex-col gap-1.5 p-4"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <motion.div
            animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="w-8 h-0.5 bg-white"
          />
          <motion.div
            animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-8 h-0.5 bg-white"
          />
          <motion.div
            animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="w-8 h-0.5 bg-white"
          />
        </button>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <motion.div
        initial={{ clipPath: "circle(0% at 100% 0%)" }}
        animate={{ clipPath: isMenuOpen ? "circle(150% at 100% 0%)" : "circle(0% at 100% 0%)" }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        className="fixed inset-0 z-40 bg-[#0a0a0a] text-white flex flex-col justify-center items-center gap-8 md:hidden"
      >
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={() => setIsMenuOpen(false)}
            className="text-5xl font-bold uppercase tracking-tighter text-transparent"
            style={{ WebkitTextStroke: '1px rgba(255,255,255,0.8)' }}
          >
            {link.label}
          </Link>
        ))}
      </motion.div>
    </>
  )
}

function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    const { height, width, left, top } = ref.current?.getBoundingClientRect() || { height: 0, width: 0, left: 0, top: 0 }
    const middleX = clientX - (left + width / 2)
    const middleY = clientY - (top + height / 2)
    setPosition({ x: middleX * 0.1, y: middleY * 0.1 })
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 })
  }

  // Smooth spring movement
  const { x, y } = position

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  )
}