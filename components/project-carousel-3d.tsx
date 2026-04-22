'use client'

import { useRef, useState, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture, useVideoTexture } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { getStaticContent } from '@/lib/static-content'
import { useSectionManager } from './section-manager'

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

// Video texture component - separated to avoid conditional hook issues
function VideoTextureMesh({
  videoUrl,
  cardWidth,
  cardHeight,
  isActive
}: {
  videoUrl: string
  cardWidth: number
  cardHeight: number
  isActive: boolean
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const playPromiseRef = useRef<Promise<void> | undefined>(undefined)

  // Use drei's useVideoTexture with proper settings
  const videoTexture = useVideoTexture(videoUrl, {
    muted: true,
    loop: true,
    start: false,
    playsInline: true,
    crossOrigin: 'anonymous'
  })

  useEffect(() => {
    let isEffectActive = true;
    const video = videoTexture.source?.data as HTMLVideoElement
    if (!video) return

    // Set video attributes for better autoplay support
    video.setAttribute('playsinline', '')
    video.setAttribute('muted', '')
    video.muted = true
    video.playsInline = true
    video.autoplay = false // Explicitly control autoplay

    const attemptPlay = () => {
      if (!isEffectActive) return;
      if (video.readyState >= 2) { // HAVE_CURRENT_DATA or higher
        try {
          const promise = video.play();
          playPromiseRef.current = promise;
          if (promise !== undefined) {
            promise.catch((error) => {
              if (error.name === 'AbortError' || error.name === 'NotAllowedError') {
                return;
              }
              console.log('Autoplay blocked, will retry on next interaction:', error)
              const startVideo = () => {
                if (isEffectActive) video.play().catch(() => {})
                document.removeEventListener('click', startVideo)
              }
              document.addEventListener('click', startVideo, { once: true })
            })
          }
        } catch (e) {
          // handle synchronous play errors
        }
      }
    }

    if (isActive) {
      if (video.readyState >= 2) {
        const timeoutId = setTimeout(attemptPlay, 100)
        return () => {
          isEffectActive = false;
          clearTimeout(timeoutId);
          if (playPromiseRef.current !== undefined) {
            playPromiseRef.current.then(() => {
              video.pause()
            }).catch(() => {})
          } else {
            video.pause()
          }
        }
      } else {
        const onLoadedData = () => {
          attemptPlay()
          video.removeEventListener('loadeddata', onLoadedData)
        }
        video.addEventListener('loadeddata', onLoadedData)
        return () => {
          isEffectActive = false;
          video.removeEventListener('loadeddata', onLoadedData)
          if (playPromiseRef.current !== undefined) {
            playPromiseRef.current.then(() => {
              video.pause()
            }).catch(() => {})
          } else {
            video.pause()
          }
        }
      }
    } else {
      if (playPromiseRef.current !== undefined) {
        playPromiseRef.current.then(() => {
          video.pause()
        }).catch(() => {})
      } else {
        try {
          video.pause()
        } catch (e) {}
      }
      return () => {
        isEffectActive = false;
      }
    }
  }, [videoTexture, isActive])

  // Update texture each frame for video playback
  useFrame(() => {
    if (materialRef.current && isActive) {
      materialRef.current.uniforms.uTexture.value.needsUpdate = true
    }
  })

  const uniforms = useMemo(() => ({
    uTexture: { value: videoTexture },
    uHover: { value: 0 },
    uOpacity: { value: 1 },
    uBlur: { value: 0 }
  }), [videoTexture])

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
      transparent
    />
  )
}

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

  // Determine if this card is active
  const isActive = index === activeIndex

  // Create a simple gray placeholder as data URL (1x1 pixel)
  const placeholderDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8c+bMfwAHzAL+8w4HdwAAAABJRU5ErkJggg=='

  // Load image texture (use data URL placeholder if project image fails)
  const imageTexture = useTexture(project.image || placeholderDataURL)

  // Detect mobile (viewport width less than ~768px in 3D units, roughly 4.5)
  // Using a slightly higher threshold for better mobile detection
  const isMobile = viewport.width < 5.5

  // Card dimensions - on mobile, use a percentage that ensures proper centering
  // The key is to use viewport-relative sizing that accounts for the full available width
  const cardWidth = isMobile
    ? Math.min(viewport.width * 0.85, 4.5) // Wider relative to viewport for better centering
    : Math.min(viewport.width * 0.5, 6)
  const cardHeight = cardWidth * 0.6

  const distanceFromActive = index - activeIndex
  const absDistance = Math.abs(distanceFromActive)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (!meshRef.current) return

    // On mobile: show ONLY active, hide all neighbors
    // On desktop: show active + 1 neighbor on each side
    const isActiveCard = distanceFromActive === 0
    const isNeighbor = absDistance === 1
    const isVisible = isMobile ? isActiveCard : absDistance <= 1

    // Positioning - active centered at exact 0, neighbors on sides (desktop only)
    const spacing = cardWidth * 0.7
    // Force active card to x=0 on mobile for perfect centering
    const targetX = isMobile
      ? (isActiveCard ? 0 : (distanceFromActive > 0 ? 20 : -20)) // Force center, push inactive far offscreen
      : (isVisible ? distanceFromActive * spacing : (distanceFromActive > 0 ? 15 : -15))
    const targetZ = isActiveCard ? 0.3 : (isNeighbor && !isMobile ? -1.5 : -5) // Slightly less z-push on active for cleaner look
    const targetScale = isActiveCard ? 1 : (isNeighbor && !isMobile ? 0.7 : 0.3)
    const targetOpacity = isActiveCard ? 1 : (isNeighbor && !isMobile ? 0.25 : 0)
    const targetBlur = isActiveCard ? 0 : (isNeighbor && !isMobile ? 1 : 0)
    const targetRotationY = (isNeighbor && !isMobile) ? distanceFromActive * 0.15 : 0

    // Smooth lerp
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.1)
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.1)
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotationY, 0.1)

    const currentScale = meshRef.current.scale.x
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1)
    meshRef.current.scale.set(newScale, newScale, 1)

    // Update shader uniforms for image-only cards
    if (materialRef.current) {
      // Opacity
      materialRef.current.uniforms.uOpacity.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uOpacity.value, targetOpacity, 0.12
      )

      // Blur
      materialRef.current.uniforms.uBlur.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uBlur.value, targetBlur, 0.1
      )

      // Hover (only active)
      const targetHover = (hovered && isActiveCard) ? 1 : 0
      materialRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uHover.value, targetHover, 0.1
      )
    }
  })

  const imageUniforms = useMemo(() => ({
    uTexture: { value: imageTexture },
    uHover: { value: 0 },
    uOpacity: { value: 1 },
    uBlur: { value: 0 }
  }), [imageTexture])

  // Render with video if project has video URL, otherwise just image
  const hasVideo = !!project.video

  return (
    <mesh
      ref={meshRef}
      position={[distanceFromActive * 4, 0, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => onSelect(index)}
    >
      <planeGeometry args={[cardWidth, cardHeight, 16, 16]} />
      {hasVideo ? (
        <Suspense fallback={
          <shaderMaterial
            ref={materialRef}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={imageUniforms}
            transparent
          />
        }>
          <VideoTextureMesh
            videoUrl={project.video!}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            isActive={isActive}
          />
        </Suspense>
      ) : (
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={imageUniforms}
          transparent
        />
      )}
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
  const maxProjects = projects.length

  // Mobile: center the carousel exactly at 0, Desktop: slight offset
  const isMobile = viewport.width < 5.5
  // Ensure groupX is exactly 0 on mobile for perfect horizontal centering
  const groupX = isMobile ? 0 : 0.2
  // Lower vertical position on mobile to reduce gap between image and info section
  const groupY = isMobile ? 0.2 : 0.4

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
  const maxProjects = projects.length
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const { currentSection } = useSectionManager()

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Set initial hidden state for elements (before animation)
  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion) return

    // Initially hide all animated elements
    gsap.set(containerRef.current.querySelectorAll(".carousel-section-label, .carousel-project-info, .carousel-counter, .carousel-nav-arrow"), {
      opacity: 0, y: 30, filter: "blur(10px)"
    })
  }, [prefersReducedMotion])

  // Trigger animation when section becomes visible
  useEffect(() => {
    if (!containerRef.current) return

    // Only animate when Projects section is active (section index 1) and hasn't animated yet
    const isProjectsActive = currentSection === 1
    if (!isProjectsActive || hasAnimated) return

    const ctx = gsap.context(() => {
      // Skip complex animations if user prefers reduced motion
      if (prefersReducedMotion) {
        gsap.set([
          ".carousel-section-label", ".carousel-project-info",
          ".carousel-counter", ".carousel-nav-arrow"
        ], {
          opacity: 1, y: 0, filter: "blur(0px)"
        })
        setHasAnimated(true)
        return
      }

      // Master timeline with blur + slide for ALL elements
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
          duration: 0.7
        },
        onComplete: () => setHasAnimated(true)
      })

      // === SECTION LABEL ===
      tl.fromTo(".carousel-section-label",
        { y: 20, opacity: 0, filter: "blur(8px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.5 },
        "+=0.1"
      )

        // === PROJECT INFO ===
        .fromTo(".carousel-project-info",
          { y: 40, opacity: 0, filter: "blur(10px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.7 },
          "-=0.3"
        )

        // === COUNTER (Desktop) ===
        .fromTo(".carousel-counter",
          { y: 30, opacity: 0, filter: "blur(8px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.6 },
          "-=0.4"
        )

        // === NAV ARROWS ===
        .fromTo(".carousel-nav-arrow",
          { y: 20, opacity: 0, filter: "blur(6px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.5,
            stagger: 0.1
          },
          "-=0.4"
        )

    }, containerRef)
  }, [currentSection, hasAnimated, prefersReducedMotion])

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
          <Suspense fallback={null}>
            <CarouselScene activeIndex={activeProject} onProjectChange={setActiveProject} />
          </Suspense>
        </Canvas>
      </div>

      {/* Project info - Mobile: bottom center with safe area padding, Desktop: bottom left */}
      <div className="carousel-project-info absolute left-0 right-0 bottom-0 md:left-16 md:right-auto md:bottom-16 z-10 px-4 pb-safe-6 md:px-0 md:pb-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent md:bg-none">
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

            {currentProject.url ? (
              <a
                href={currentProject.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-fit group"
              >
                <h2 className="text-2xl md:text-5xl font-bold text-white mb-1 md:mb-2 tracking-tight leading-tight group-hover:text-white/80 transition-colors">
                  {currentProject.title}
                </h2>
              </a>
            ) : (
              <h2 className="text-2xl md:text-5xl font-bold text-white mb-1 md:mb-2 tracking-tight leading-tight">
                {currentProject.title}
              </h2>
            )}
            <p className="text-xs md:text-sm text-white/40 mb-3 md:mb-4">{currentProject.year}</p>

            <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-5">
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

              {/* Progress Bar - Mobile inline */}
              <div className="flex items-center gap-2 md:hidden">
                <div className="w-16 h-1 bg-white/15 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((activeProject + 1) / maxProjects) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Counter - Desktop only */}
      <div className="carousel-counter hidden md:block absolute right-16 bottom-16 z-10">
        <div className="text-right mb-4">
          <span className="text-7xl font-bold text-white">
            {String(activeProject + 1).padStart(2, '0')}
          </span>
          <span className="text-xl text-white/30 ml-2">
            / {String(maxProjects).padStart(2, '0')}
          </span>
        </div>

        {/* Progress Bar - Desktop */}
        <div className="flex justify-end">
          <div className="w-24 h-1.5 bg-white/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((activeProject + 1) / maxProjects) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Section label */}
      <div className="carousel-section-label absolute top-24 left-6 md:left-16 z-10">
        <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-white/40">Selected Works</span>
      </div>

      {/* Navigation Arrows - centered with the carousel image */}
      <div className="carousel-nav-arrow absolute left-4 md:left-16 top-[45%] md:top-1/2 -translate-y-1/2 z-20">
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

      <div className="carousel-nav-arrow absolute right-4 md:right-16 top-[45%] md:top-1/2 -translate-y-1/2 z-20">
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
