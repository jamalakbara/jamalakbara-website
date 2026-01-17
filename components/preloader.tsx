'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useStore } from '@/lib/store'

export function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const setIsLoaded = useStore((state) => state.setIsLoaded)

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

    // Counter Animation using GSAP's textContent (no React re-renders)
    tl.to(counterRef.current, {
      textContent: 100,
      duration: 1.8,
      ease: "power2.inOut",
      snap: { textContent: 1 },
      modifiers: {
        textContent: (value: string) => Math.round(parseFloat(value)).toString()
      }
    }, 0)

    // Progress bar animation
    tl.to(progressRef.current, {
      scaleX: 1,
      duration: 1.8,
      ease: "power2.inOut"
    }, 0)

      // Fade out text and progress
      .to([counterRef.current, progressRef.current], {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: "power2.in"
      })

      // Curtain reveal with elegant ease
      .to(containerRef.current, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.9,
        ease: "power4.inOut"
      })

    return () => {
      clearTimeout(failsafe)
      tl.kill()
    }
  }, [setIsLoaded])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] overflow-hidden"
      style={{ clipPath: 'inset(0 0 0 0)' }}
    >
      {/* Aurora Background - matching site's liquid background */}
      <div className="absolute inset-0 bg-[#030812]">
        {/* Aurora glow effects */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, rgba(40, 100, 200, 0.4) 0%, transparent 50%)'
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 70% 80%, rgba(60, 90, 220, 0.35) 0%, transparent 50%)'
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(50, 150, 255, 0.15) 0%, transparent 70%)'
          }}
        />

        {/* Floating orbs - CSS animated for zero lag */}
        <div className="preloader-orb orb-1" />
        <div className="preloader-orb orb-2" />
        <div className="preloader-orb orb-3" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        {/* Logo / Brand mark placeholder - subtle */}
        <div className="mb-12 text-white/20 text-xs font-mono tracking-[0.4em] uppercase">
          jamalakbara
        </div>

        {/* Counter - Large, minimal, elegant */}
        <div className="relative">
          <span
            ref={counterRef}
            className="text-[25vw] md:text-[18vw] lg:text-[15vw] font-bold leading-none tracking-tighter text-transparent"
            style={{
              WebkitTextStroke: '1px rgba(255,255,255,0.25)',
            }}
          >
            0
          </span>
          <span
            className="absolute -right-[3vw] top-[20%] text-[5vw] md:text-[3vw] text-white/20 font-light"
          >
            %
          </span>
        </div>

        {/* Progress bar - thin, elegant */}
        <div className="mt-12 w-[200px] md:w-[280px] h-[1px] bg-white/10 overflow-hidden">
          <div
            ref={progressRef}
            className="w-full h-full bg-gradient-to-r from-blue-400/60 via-white/40 to-blue-400/60 origin-left"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
      </div>

      {/* Inline styles for orb animations - pure CSS, GPU accelerated */}
      <style jsx>{`
        .preloader-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          will-change: transform;
          opacity: 0.6;
        }

        .orb-1 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(60, 120, 220, 0.6) 0%, transparent 70%);
          top: -10%;
          left: -5%;
          animation: float-orb-1 6s ease-in-out infinite;
        }

        .orb-2 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(80, 160, 255, 0.5) 0%, transparent 70%);
          bottom: 10%;
          right: -5%;
          animation: float-orb-2 8s ease-in-out infinite;
        }

        .orb-3 {
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, rgba(100, 80, 200, 0.4) 0%, transparent 70%);
          top: 40%;
          left: 50%;
          animation: float-orb-3 7s ease-in-out infinite;
        }

        @keyframes float-orb-1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(30px, 40px) scale(1.1);
          }
        }

        @keyframes float-orb-2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-40px, -30px) scale(0.9);
          }
        }

        @keyframes float-orb-3 {
          0%, 100% {
            transform: translate(-50%, 0) scale(1);
          }
          50% {
            transform: translate(-50%, 25px) scale(1.05);
          }
        }
      `}</style>
    </div>
  )
}

