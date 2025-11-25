'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

export const StaticSceneryBackground = () => {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = resolvedTheme === 'dark'

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-1000">
      {/* Sky Layer - Static color, no animation */}
      <div
        className={`absolute inset-0 ${isDark ? 'bg-slate-900' : 'bg-sky-300'}`}
      />

      {/* Stars (Dark Mode Only) - Static, no animation */}
      {isDark && (
        <div className="absolute inset-0 opacity-60">
          {/* Generate random stars */}
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Scenery Layers - Static, no parallax */}
      <div className="absolute bottom-0 left-0 right-0 h-[40vh] md:h-[60vh] transition-opacity duration-1000">

        {/* LIGHT MODE: MOUNTAINS */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
          {/* Back Mountain */}
          <svg className="absolute bottom-0 w-full h-full text-emerald-800/20" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          {/* Middle Mountain */}
          <svg className="absolute bottom-0 w-full h-full text-emerald-700/40" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          {/* Front Mountain */}
          <svg className="absolute bottom-0 w-full h-full text-emerald-600/60" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,256L48,245.3C96,235,192,213,288,192C384,171,480,149,576,160C672,171,768,213,864,229.3C960,245,1056,235,1152,208C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        {/* DARK MODE: BEACH / WAVES */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
          {/* Back Wave */}
          <svg className="absolute bottom-0 w-full h-full text-blue-900/30 animate-pulse" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ animationDuration: '4s' }}>
            <path fill="currentColor" d="M0,128L48,144C96,160,192,192,288,197.3C384,203,480,181,576,165.3C672,149,768,139,864,154.7C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          {/* Middle Wave */}
          <svg className="absolute bottom-0 w-full h-full text-blue-800/50 animate-pulse" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ animationDuration: '3s', animationDelay: '1s' }}>
            <path fill="currentColor" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          {/* Front Wave */}
          <svg className="absolute bottom-0 w-full h-full text-blue-700/70 animate-pulse" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ animationDuration: '5s', animationDelay: '0.5s' }}>
            <path fill="currentColor" d="M0,256L48,261.3C96,267,192,277,288,266.7C384,256,480,224,576,213.3C672,203,768,213,864,229.3C960,245,1056,267,1152,266.7C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

      </div>
    </div>
  )
}
