'use client'

import { Navigation } from '@/components/navigation'
import { HeroSection } from '@/components/hero-section'
import { BentoGrid } from '@/components/bento-grid'
import { AboutSection } from '@/components/about-section'
import { CTASection } from '@/components/cta-section'
import { CustomCursor } from '@/components/custom-cursor'
// import { useStore } from '@/lib/store'

export default function Home() {
  // const isLoaded = useStore((state) => state.isLoaded)

  return (
    <div className="relative min-h-screen">
      <CustomCursor />

      {/* Content only visible after preloader allows scrolling/interaction, 
          but technically visible under the curtain. 
          The Preloader component handles the blocking overlay. */}

      <Navigation />

      <main className="relative z-10 bg-background text-foreground">
        <HeroSection />
        <BentoGrid />
        <AboutSection />
        <CTASection />
      </main>
    </div>
  )
}