'use client'

export function NoiseOverlay() {
  return (
    <>
      {/* Vignette glow effect */}
      <div
        className="fixed inset-0 z-[9998] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10, 20, 40, 0.4) 100%)',
        }}
        aria-hidden="true"
      />
      {/* Grain texture */}
      <div
        className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: 'url(/noise.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
        aria-hidden="true"
      />
    </>
  )
}
