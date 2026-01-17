'use client'

export function LiquidBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#030812]">
      {/* Aurora container */}
      <div className="aurora-container absolute inset-0">
        {/* Primary aurora bands */}
        <div className="aurora aurora-1" />
        <div className="aurora aurora-2" />
        <div className="aurora aurora-3" />
        <div className="aurora aurora-4" />
      </div>

      {/* Subtle center glow - blue */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(40, 100, 200, 0.4) 0%, transparent 60%)',
        }}
      />

      <style jsx>{`
        .aurora-container {
          filter: blur(60px);
          opacity: 0.7;
        }

        .aurora {
          position: absolute;
          width: 150%;
          height: 150%;
          background: linear-gradient(
            180deg,
            transparent 0%,
            var(--aurora-color-1) 20%,
            var(--aurora-color-2) 40%,
            var(--aurora-color-3) 60%,
            transparent 100%
          );
          mix-blend-mode: screen;
          will-change: transform;
        }

        /* Deep blue - primary */
        .aurora-1 {
          --aurora-color-1: rgba(30, 80, 200, 0.5);
          --aurora-color-2: rgba(50, 120, 220, 0.4);
          --aurora-color-3: rgba(20, 60, 180, 0.3);
          top: -50%;
          left: -25%;
          animation: aurora-drift-1 10s ease-in-out infinite;
        }

        /* Electric blue with cyan */
        .aurora-2 {
          --aurora-color-1: rgba(40, 140, 240, 0.4);
          --aurora-color-2: rgba(60, 180, 220, 0.3);
          --aurora-color-3: rgba(30, 100, 200, 0.25);
          top: -30%;
          right: -25%;
          animation: aurora-drift-2 12s ease-in-out infinite;
        }

        /* Royal blue with subtle purple */
        .aurora-3 {
          --aurora-color-1: rgba(60, 90, 220, 0.35);
          --aurora-color-2: rgba(80, 60, 180, 0.25);
          --aurora-color-3: rgba(40, 120, 200, 0.2);
          bottom: -40%;
          left: -20%;
          animation: aurora-drift-3 8s ease-in-out infinite;
        }

        /* Sky blue accent */
        .aurora-4 {
          --aurora-color-1: rgba(50, 150, 255, 0.25);
          --aurora-color-2: rgba(70, 130, 220, 0.2);
          --aurora-color-3: rgba(40, 100, 180, 0.15);
          top: 0%;
          left: 20%;
          animation: aurora-drift-4 15s ease-in-out infinite;
        }

        @keyframes aurora-drift-1 {
          0%, 100% {
            transform: translateX(0%) translateY(0%) rotate(0deg) scale(1);
          }
          25% {
            transform: translateX(10%) translateY(5%) rotate(3deg) scale(1.05);
          }
          50% {
            transform: translateX(5%) translateY(10%) rotate(-2deg) scale(0.95);
          }
          75% {
            transform: translateX(-5%) translateY(5%) rotate(2deg) scale(1.02);
          }
        }

        @keyframes aurora-drift-2 {
          0%, 100% {
            transform: translateX(0%) translateY(0%) rotate(0deg) scale(1);
          }
          33% {
            transform: translateX(-8%) translateY(8%) rotate(-3deg) scale(1.03);
          }
          66% {
            transform: translateX(5%) translateY(-5%) rotate(2deg) scale(0.97);
          }
        }

        @keyframes aurora-drift-3 {
          0%, 100% {
            transform: translateX(0%) translateY(0%) rotate(0deg) scale(1);
          }
          50% {
            transform: translateX(15%) translateY(-10%) rotate(5deg) scale(1.1);
          }
        }

        @keyframes aurora-drift-4 {
          0%, 100% {
            transform: translateX(0%) translateY(0%) rotate(0deg) scale(1);
          }
          20% {
            transform: translateX(-5%) translateY(8%) rotate(-2deg) scale(0.98);
          }
          40% {
            transform: translateX(8%) translateY(5%) rotate(3deg) scale(1.04);
          }
          60% {
            transform: translateX(3%) translateY(-8%) rotate(-1deg) scale(1.02);
          }
          80% {
            transform: translateX(-8%) translateY(-3%) rotate(2deg) scale(0.96);
          }
        }
      `}</style>
    </div>
  )
}
