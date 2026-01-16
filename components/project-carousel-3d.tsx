'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { getStaticContent } from '@/lib/static-content'

const projects = getStaticContent.projects()

// Simple shader for hover distortion
const vertexShader = `
  varying vec2 vUv;
  uniform float uHover;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Subtle ripple on hover
    float wave = sin(position.x * 3.0 + position.y * 3.0) * uHover * 0.015;
    pos.z += wave;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uHover;
  uniform float uOpacity;
  uniform float uBlur;
  
  void main() {
    vec2 uv = vUv;
    vec4 color;
    
    // Apply blur when uBlur > 0 using simple box blur
    if (uBlur > 0.01) {
      float blurSize = uBlur * 0.015;
      color = vec4(0.0);
      
      // 9-sample box blur
      color += texture2D(uTexture, uv + vec2(-blurSize, -blurSize));
      color += texture2D(uTexture, uv + vec2(0.0, -blurSize));
      color += texture2D(uTexture, uv + vec2(blurSize, -blurSize));
      color += texture2D(uTexture, uv + vec2(-blurSize, 0.0));
      color += texture2D(uTexture, uv);
      color += texture2D(uTexture, uv + vec2(blurSize, 0.0));
      color += texture2D(uTexture, uv + vec2(-blurSize, blurSize));
      color += texture2D(uTexture, uv + vec2(0.0, blurSize));
      color += texture2D(uTexture, uv + vec2(blurSize, blurSize));
      color /= 9.0;
      
      // Desaturate blurred images
      float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      color.rgb = mix(color.rgb, vec3(gray), 0.5);
    } else {
      color = texture2D(uTexture, uv);
    }
    
    float brightness = mix(0.75, 1.0, uHover);
    color.rgb *= brightness;
    
    gl_FragColor = vec4(color.rgb, color.a * uOpacity);
  }
`

// Single project card - horizontal layout
function ProjectCard({
  project,
  index,
  activeIndex,
  onSelect
}: {
  project: typeof projects[0]
  index: number
  activeIndex: number
  onSelect: (index: number) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { viewport } = useThree()

  const texture = useTexture(project.image || '/placeholder.jpg')

  // Detect mobile (viewport width less than ~768px in 3D units, roughly 4.5)
  const isMobile = viewport.width < 5

  // Card dimensions - larger on mobile
  const cardWidth = isMobile
    ? Math.min(viewport.width * 0.75, 5)
    : Math.min(viewport.width * 0.5, 6)
  const cardHeight = cardWidth * 0.6

  const distanceFromActive = index - activeIndex
  const absDistance = Math.abs(distanceFromActive)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (!meshRef.current || !materialRef.current) return

    // On mobile: show ONLY active, hide all neighbors
    // On desktop: show active + 1 neighbor on each side
    const isActive = distanceFromActive === 0
    const isNeighbor = absDistance === 1
    const isVisible = isMobile ? isActive : absDistance <= 1

    // Positioning - active centered, neighbors on sides (desktop only)
    const spacing = cardWidth * 0.7
    const targetX = isMobile
      ? (isActive ? 0 : (distanceFromActive > 0 ? 15 : -15)) // Centered on mobile
      : (isVisible ? distanceFromActive * spacing : (distanceFromActive > 0 ? 15 : -15))
    const targetZ = isActive ? 0.5 : (isNeighbor && !isMobile ? -1.5 : -5)
    const targetScale = isActive ? 1 : (isNeighbor && !isMobile ? 0.7 : 0.3)
    const targetOpacity = isActive ? 1 : (isNeighbor && !isMobile ? 0.25 : 0)
    const targetBlur = isActive ? 0 : (isNeighbor && !isMobile ? 1 : 0)
    const targetRotationY = (isNeighbor && !isMobile) ? distanceFromActive * 0.15 : 0

    // Smooth lerp
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.1)
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.1)
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotationY, 0.1)

    const currentScale = meshRef.current.scale.x
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1)
    meshRef.current.scale.set(newScale, newScale, 1)

    // Opacity
    materialRef.current.uniforms.uOpacity.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uOpacity.value, targetOpacity, 0.12
    )

    // Blur
    materialRef.current.uniforms.uBlur.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uBlur.value, targetBlur, 0.1
    )

    // Hover (only active)
    const targetHover = (hovered && isActive) ? 1 : 0
    materialRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uHover.value, targetHover, 0.1
    )
  })

  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uHover: { value: 0 },
    uOpacity: { value: 1 },
    uBlur: { value: 0 }
  }), [texture])

  return (
    <mesh
      ref={meshRef}
      position={[distanceFromActive * 4, 0, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => onSelect(index)}
    >
      <planeGeometry args={[cardWidth, cardHeight, 16, 16]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  )
}

// Carousel scene
function CarouselScene({
  activeIndex,
  onProjectChange
}: {
  activeIndex: number
  onProjectChange: (index: number) => void
}) {
  const { viewport } = useThree()
  const maxProjects = Math.min(projects.length, 6)

  // Mobile: center the carousel, Desktop: slight offset
  const isMobile = viewport.width < 5
  const groupX = isMobile ? 0 : 0.2
  const groupY = isMobile ? 0.6 : 0.4 // Slightly higher on mobile

  return (
    <group position={[groupX, groupY, 0]}>
      {projects.slice(0, maxProjects).map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={index}
          activeIndex={activeIndex}
          onSelect={onProjectChange}
        />
      ))}
    </group>
  )
}

// Main component
export function ProjectCarousel3D() {
  const [activeProject, setActiveProject] = useState(0)
  const currentProject = projects[activeProject] || projects[0]
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const maxProjects = Math.min(projects.length, 6)

  // Arrow key navigation (desktop) and touch swipe (mobile)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Arrow key navigation for desktop
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && activeProject < maxProjects - 1) {
        e.preventDefault()
        setActiveProject(p => p + 1)
      } else if (e.key === 'ArrowLeft' && activeProject > 0) {
        e.preventDefault()
        setActiveProject(p => p - 1)
      }
    }

    // Touch swipe for mobile
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const deltaX = touchStartX.current - e.changedTouches[0].clientX

      // Swipe left = next, swipe right = previous
      if (deltaX > 50 && activeProject < maxProjects - 1) {
        setActiveProject(p => p + 1)
      } else if (deltaX < -50 && activeProject > 0) {
        setActiveProject(p => p - 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [activeProject, maxProjects])

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden pt-20">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <CarouselScene activeIndex={activeProject} onProjectChange={setActiveProject} />
        </Canvas>
      </div>

      {/* Project info - Mobile: bottom center, Desktop: bottom left */}
      <div className="absolute left-0 right-0 bottom-0 md:left-16 md:right-auto md:bottom-16 z-10 px-6 pb-6 md:px-0 md:pb-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent md:bg-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProject}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="max-w-md"
          >
            {/* Mobile: Counter + Category inline */}
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <span className="inline-block px-3 py-1 rounded-full border border-white/20 text-[10px] md:text-xs font-mono uppercase tracking-wider text-white/60">
                {currentProject.category}
              </span>
              {/* Counter - Mobile only inline */}
              <div className="flex items-center gap-1 md:hidden">
                <span className="text-2xl font-bold text-white">
                  {String(activeProject + 1).padStart(2, '0')}
                </span>
                <span className="text-sm text-white/30">
                  / {String(maxProjects).padStart(2, '0')}
                </span>
              </div>
            </div>

            <h2 className="text-2xl md:text-5xl font-bold text-white mb-1 md:mb-2 tracking-tight leading-tight">
              {currentProject.title}
            </h2>
            <p className="text-xs md:text-sm text-white/40 mb-3 md:mb-4">{currentProject.year}</p>

            <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-5">
              {currentProject.tech?.slice(0, 3).map((tech, i) => (
                <span key={i} className="text-[10px] md:text-xs text-white/50 bg-white/5 px-2 py-0.5 md:py-1 rounded">{tech}</span>
              ))}
            </div>

            {/* Mobile: View Project + Pills row */}
            <div className="flex items-center justify-between">
              {currentProject.url && (
                <a
                  href={currentProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  View Project
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              )}

              {/* Nav pills - Mobile inline */}
              <div className="flex gap-1.5 md:hidden">
                {projects.slice(0, maxProjects).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveProject(i)}
                    className={`h-1 rounded-full transition-all duration-300 ${i === activeProject ? 'bg-white w-6' : 'bg-white/30 w-3'
                      }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Counter - Desktop only */}
      <div className="hidden md:block absolute right-16 bottom-16 z-10">
        <div className="text-right mb-4">
          <span className="text-7xl font-bold text-white">
            {String(activeProject + 1).padStart(2, '0')}
          </span>
          <span className="text-xl text-white/30 ml-2">
            / {String(maxProjects).padStart(2, '0')}
          </span>
        </div>

        {/* Horizontal nav pills - Desktop */}
        <div className="flex gap-2 justify-end">
          {projects.slice(0, maxProjects).map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveProject(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === activeProject ? 'bg-white w-8' : 'bg-white/30 w-4 hover:bg-white/50'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Section label */}
      <div className="absolute top-24 left-6 md:left-16 z-10">
        <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-white/40">Selected Works</span>
      </div>

      {/* Navigation Arrows - smaller on mobile, positioned higher */}
      <div className="absolute left-4 md:left-16 top-[40%] md:top-1/2 -translate-y-1/2 z-20">
        <button
          onClick={() => activeProject > 0 && setActiveProject(activeProject - 1)}
          disabled={activeProject === 0}
          className={`w-10 h-10 md:w-14 md:h-14 rounded-full border flex items-center justify-center transition-all duration-300 ${activeProject === 0
            ? 'border-white/10 text-white/20 cursor-not-allowed'
            : 'border-white/30 text-white/70 hover:border-white hover:text-white hover:bg-white/10'
            }`}
          aria-label="Previous project"
        >
          <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="absolute right-4 md:right-16 top-[40%] md:top-1/2 -translate-y-1/2 z-20">
        <button
          onClick={() => activeProject < maxProjects - 1 && setActiveProject(activeProject + 1)}
          disabled={activeProject === maxProjects - 1}
          className={`w-10 h-10 md:w-14 md:h-14 rounded-full border flex items-center justify-center transition-all duration-300 ${activeProject === maxProjects - 1
            ? 'border-white/10 text-white/20 cursor-not-allowed'
            : 'border-white/30 text-white/70 hover:border-white hover:text-white hover:bg-white/10'
            }`}
          aria-label="Next project"
        >
          <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
