'use client'

import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

// Custom Shader Material for Liquid Distortion
const LiquidShaderMaterial = {
  uniforms: {
    uTexture: { value: null },
    uHover: { value: 0 },
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2() },
    uMouse: { value: new THREE.Vector2() }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    uniform float uHover;
    uniform float uTime;
    varying vec2 vUv;

    // Simplex Noise Function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = vUv;
      
      // Liquid displacement based on noise and hover intensity
      float noise = snoise(uv * 10.0 + uTime * 0.5);
      float distortion = noise * uHover * 0.1; // Intensity
      
      // Apply distortion to UVs
      vec2 distortedUV = uv + vec2(distortion, distortion * 0.5);
      
      // RGB Shift Effect (Chromatic Aberration) based on hover
      float r = texture2D(uTexture, distortedUV + vec2(0.01 * uHover, 0.0)).r;
      float g = texture2D(uTexture, distortedUV).g;
      float b = texture2D(uTexture, distortedUV - vec2(0.01 * uHover, 0.0)).b;
      
      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `
}

function ImagePlane({ src, isHovered }: { src: string, isHovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const texture = useTexture(src)
  const { viewport } = useThree()

  // Create shader material only once
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uHover: { value: 0 },
        uTime: { value: 0 }
      },
      vertexShader: LiquidShaderMaterial.vertexShader,
      fragmentShader: LiquidShaderMaterial.fragmentShader
    })
  }, [texture])

  useFrame((state) => {
    if (meshRef.current) {
      // Smoothly interpolate hover value
      const targetHover = isHovered ? 1.0 : 0.0
      material.uniforms.uHover.value = THREE.MathUtils.lerp(
        material.uniforms.uHover.value,
        targetHover,
        0.1
      )
      // Continuous time update for liquid noise
      material.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  // Scale plane to cover viewport (cover style)
  const scale = useMemo(() => {
    const tex = texture as THREE.Texture
    const imageAspect = tex.image.width / tex.image.height
    const canvasAspect = viewport.width / viewport.height

    // Analogous to object-fit: cover
    if (imageAspect > canvasAspect) {
      return [viewport.height * imageAspect, viewport.height, 1] as [number, number, number]
    } else {
      return [viewport.width, viewport.width / imageAspect, 1] as [number, number, number]
    }
  }, [texture, viewport])


  return (
    <mesh ref={meshRef} scale={scale}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}

export function DistortedImage({ src, alt, className, isHovered }: { src: string, alt: string, className?: string, isHovered?: boolean }) {
  const [internalHover, setInternalHover] = useState(false)

  // Logic: If isHovered prop is provided, use it. Otherwise use internal hover state.
  const activeHover = isHovered !== undefined ? isHovered : internalHover

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className || ''}`}
      onMouseEnter={() => setInternalHover(true)}
      onMouseLeave={() => setInternalHover(false)}
    >
      <Canvas
        camera={{ position: [0, 0, 1], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        dpr={[1, 2]} // Support high-res displays
      >
        <ImagePlane src={src} isHovered={activeHover} />
      </Canvas>
    </div>
  )
}
