'use client'

import { useCallback, useState, useEffect, memo } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { Container, ISourceOptions } from '@tsparticles/engine'

// Define options outside the component to prevent recreation on every render
const PARTICLE_OPTIONS: ISourceOptions = {
    fullScreen: {
        enable: true,
        zIndex: -1, // Behind all content
    },
    fpsLimit: 60,
    detectRetina: true,
    background: {
        color: {
            value: 'transparent',
        },
    },
    particles: {
        number: {
            value: 400, // Good balance of density and performance
            density: {
                enable: true,
                width: 1920,
                height: 1080,
            },
        },
        color: {
            value: [
                '#ffffff', // pure white (stars)
                '#a8d4ff', // soft sky blue
                '#7eb8ff', // light azure
                '#c4a7e7', // soft lavender
                '#e8a8c8', // muted rose
                '#ffd4a8', // warm peach
                '#a8e6cf', // soft mint
                '#ffb8c8', // blush pink
                '#b8d4ff', // powder blue
                '#d4c8ff', // light violet
                '#ffe8b8', // soft gold
            ],
        },
        shape: {
            type: 'circle',
        },
        opacity: {
            value: { min: 0.2, max: 0.6 },
            animation: {
                enable: true,
                speed: 0.3,
                sync: false,
            },
        },
        size: {
            value: { min: 1, max: 2.5 }, // Smaller particles for denser look
            animation: {
                enable: false,
            },
        },
        links: {
            enable: false,
        },
        move: {
            enable: true,
            speed: 0.8, // Slower base movement
            direction: 'none',
            random: true,
            straight: false,
            outModes: {
                default: 'out',
            },
            attract: {
                enable: false,
            },
        },
    },
    interactivity: {
        detectsOn: 'window',
        events: {
            onHover: {
                enable: true,
                mode: 'repulse',
            },
            onClick: {
                enable: false, // Disable click for cleaner experience
            },
            resize: {
                enable: true,
            },
        },
        modes: {
            repulse: {
                distance: 100,
                duration: 0.4,
                speed: 1,
            },
        },
    },
}

// Memoized Particles wrapper to prevent unnecessary re-renders
const MemoizedParticles = memo(function MemoizedParticles({
    particlesLoaded
}: {
    particlesLoaded: (container?: Container) => Promise<void>
}) {
    return (
        <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={PARTICLE_OPTIONS}
            className="!fixed !inset-0 !z-[-1] !pointer-events-none"
        />
    )
})

export function ParticleBackground() {
    const [init, setInit] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const [isTouchDevice, setIsTouchDevice] = useState(false)

    // Track mounted state for SSR
    useEffect(() => {
        setIsMounted(true)
        // Check touch device once on mount
        setIsTouchDevice(window.matchMedia('(hover: none)').matches)
    }, [])

    // Initialize tsParticles engine once
    useEffect(() => {
        if (!isMounted || isTouchDevice) return

        initParticlesEngine(async (engine) => {
            await loadSlim(engine)
        }).then(() => {
            setInit(true)
        })
    }, [isMounted, isTouchDevice])

    // Stable callback that never changes
    const particlesLoaded = useCallback(async (container?: Container) => {
        // Optional: console.log for debugging
        // console.log('Particles container loaded', container)
    }, [])

    // Don't render until mounted, initialized, and not on touch device
    if (!isMounted || isTouchDevice || !init) {
        return null
    }

    return <MemoizedParticles particlesLoaded={particlesLoaded} />
}
