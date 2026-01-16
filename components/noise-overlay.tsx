'use client'

export function NoiseOverlay() {
  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.04] mix-blend-overlay"
      style={{
        backgroundImage: 'url(/noise.png)',
        backgroundRepeat: 'repeat',
        backgroundSize: '256px 256px',
      }}
      aria-hidden="true"
    />
  )
}
