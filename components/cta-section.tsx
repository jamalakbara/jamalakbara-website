'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { getStaticContent } from '@/lib/static-content'
import { ContactModal } from '@/components/contact-modal'
import { ArrowUpRight } from 'lucide-react'

export function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const siteConfig = getStaticContent.siteConfig()
  const [time, setTime] = useState<string>('')

  // Mouse tracking for magnetic button
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    // Calculate normalized position (-1 to 1)
    const x = (e.clientX - left - width / 2) / (width / 2)
    const y = (e.clientY - top - height / 2) / (height / 2)

    mouseX.set(x * 50) // Max movement 50px
    mouseY.set(y * 50)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  // Spring physics for smooth movement
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit'
      }))
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="relative h-screen w-full"
      style={{ clipPath: "inset(0 0 0 0)" }}
      ref={containerRef}
    >
      <div className="relative h-full w-full fixed bottom-0 left-0 right-0 -z-10 flex flex-col justify-between bg-[#0a0a0a] text-white px-6 py-12 md:p-20 overflow-hidden">

        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
          <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-purple-900 rounded-full blur-[150px] mix-blend-screen animate-pulse duration-[5000ms]" />
          <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-blue-900 rounded-full blur-[150px] mix-blend-screen animate-pulse duration-[7000ms]" />
        </div>

        {/* Top Info */}
        <div className="relative z-10 flex justify-between items-start w-full">
          <div className="hidden md:block">
            <span className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Current Status</span>
            <span className="flex items-center gap-2 text-sm text-green-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Available for work
            </span>
          </div>
          <div className="text-right">
            <span className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">Local Time</span>
            <span className="text-sm font-mono">{time} WIB {time.includes('AM') || parseInt(time) < 18 ? '☀️' : '🌙'}</span>
          </div>
        </div>

        {/* Dynamic Center Interaction */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full">
          <p className="text-lg md:text-xl text-white/60 mb-8 font-light tracking-wide uppercase">Have an idea?</p>

          <motion.div
            className="relative cursor-pointer group"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => setIsModalOpen(true)}
            whileHover="hover"
          >
            {/* Magnetic Circle Background */}
            <motion.div
              style={{ x, y }}
              className="absolute inset-0 bg-blue-600 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
            />

            {/* Main Text */}
            <h2 className="relative text-[13vw] md:text-[11vw] font-bold tracking-tighter leading-none text-white mix-blend-difference group-hover:scale-[1.02] transition-transform duration-500 ease-out">
              LET&apos;S TALK
            </h2>

            {/* Hover Reveal Button */}
            <motion.div
              style={{ x, y, left: '50%', top: '50%', translateX: '-50%', translateY: '-50%' }}
              className="absolute w-32 h-32 md:w-48 md:h-48 bg-blue-600 rounded-full flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none"
            >
              <ArrowUpRight className="w-12 h-12 md:w-20 md:h-20 text-white" />
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Footer Info */}
        <div className="relative z-10 w-full pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            {/* Copyright / Brand */}
            <div className="md:col-span-4">
              <h3 className="text-2xl font-bold tracking-tight mb-2">jamalakbara.</h3>
              <p className="text-white/40 text-sm">
                &copy; {new Date().getFullYear()} Jamal Akbar Alam.<br />
                Crafted with Next.js & GSAP.
              </p>
            </div>

            {/* Main Contact Email - Massive */}
            <div className="md:col-span-4 text-center md:text-left">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="block text-2xl md:text-3xl font-light hover:text-blue-400 transition-colors border-b border-transparent hover:border-blue-400 pb-1"
              >
                {siteConfig.contact.email}
              </a>
            </div>

            {/* Socials */}
            <div className="md:col-span-4 flex justify-end gap-6">
              {siteConfig.social.map(s => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener"
                  className="group flex flex-col items-center gap-1"
                >
                  <span className="text-xs font-mono uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                    {s.platform}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ContactModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  )
}