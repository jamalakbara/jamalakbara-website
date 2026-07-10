"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* Awwwards-grade animated admin background: a domain-warped fbm flow field
   rendered on a fullscreen quad, tinted through the brand palette (warm
   near-black base, ember, orange, electric blue, cream highlight). The
   cursor bends the flow and drags a soft glow. Film grain + vignette on top.
   Motion freezes under prefers-reduced-motion. Admin-only, so WebGL weight
   is acceptable (private, single-user, never public/SEO). */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    // Fullscreen quad: geometry is a [2,2] plane, so position.xy is already
    // in clip space (-1..1). Bypass the projection entirely.
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform vec2  uMouse;      // -1..1, smoothed torch position
  uniform vec2  uMouseVel;   // cursor velocity (units/sec, smoothed)
  uniform float uMouseSpeed; // 0..1 normalized speed
  uniform vec2  uResolution;

  uniform vec3 uBg;
  uniform vec3 uUmber;   // warm brown pools (brand shadow ramp)
  uniform vec3 uTaupe;   // muted warm mid (--m4)
  uniform vec3 uAccent;  // brand orange (--accent)
  uniform vec3 uWarm;    // hover amber (--accent-hi)
  uniform vec3 uCream;   // ink highlight (--ink)
  uniform vec3 uBlue;    // cool steel-blue accent (counterpoint to orange)

  // --- Ashima simplex noise 2D ---
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0))
                             + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                            dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // fractal brownian motion
  float fbm(vec2 p){
    float v = 0.0;
    float a = 0.5;
    for(int i = 0; i < 4; i++){
      v += a * snoise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  float hash(vec2 p){
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main(){
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    // Larger scale => big soft fields with generous negative space.
    vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5) * 0.85;

    float t = uTime * 0.035;
    vec2 mouse = uMouse * vec2(aspect, 1.0) * 0.6;

    // Cursor in field space + per-fragment proximity to it.
    vec2 fragP = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
    vec2 torch = uMouse * vec2(aspect, 1.0) * 0.5;
    float cDist = distance(fragP, torch);
    float cProx = smoothstep(0.75, 0.0, cDist);
    // Velocity wake: bend the flow in the travel direction near the cursor.
    vec2 bend = uMouseVel * cProx * 0.04;

    // iq-style domain warp, nudged by the cursor + its wake
    vec2 q;
    q.x = fbm(p + t);
    q.y = fbm(p + vec2(5.2, 1.3) - t);

    vec2 r;
    r.x = fbm(p + 1.1 * q + vec2(1.7, 9.2) + 0.12 * t + mouse + bend);
    r.y = fbm(p + 1.1 * q + vec2(8.3, 2.8) + 0.10 * t + mouse + bend);

    float f = fbm(p + 1.2 * r);

    // Warm film-grade build-up matching the public site: near-black base with
    // brown/amber pools and orange accent blooms. No blue — brand is all-warm.
    // Thresholds keep large stretches near-black so admin text stays legible.
    vec3 col = uBg;
    col = mix(col, uUmber,  smoothstep(-0.15, 0.8, f) * 0.9);
    col = mix(col, uTaupe,  smoothstep(0.15, 0.9, length(q)) * 0.32);
    // Blue accent pools where r.x is LOW — spatially opposite the orange bloom,
    // so warm and cool never muddy into grey.
    col = mix(col, uBlue,   pow(clamp(-r.x + 0.22, 0.0, 1.0), 1.7) * 0.42);
    col = mix(col, uAccent, pow(clamp(r.x + 0.18, 0.0, 1.0), 1.6) * 0.55);
    col = mix(col, uWarm,   clamp(r.y, 0.0, 1.0) * 0.32);
    col = mix(col, uCream,  clamp(f, 0.0, 1.0) * 0.06);

    // --- Cursor torch + velocity wake ---
    // Warm light pool that brightens (and heats) with cursor speed.
    float torchFall = smoothstep(0.55, 0.0, cDist);
    col += uWarm   * torchFall * (0.22 + uMouseSpeed * 0.5);
    col += uAccent * smoothstep(0.85, 0.0, cDist) * (0.12 + uMouseSpeed * 0.35);
    // Comet tail: a warm streak stretched behind the direction of travel.
    vec2 vdir = length(uMouseVel) > 0.001 ? normalize(uMouseVel) : vec2(0.0);
    float along = dot(fragP - torch, -vdir);
    float tail = smoothstep(0.6, 0.0, cDist) * clamp(along * 3.0, 0.0, 1.0);
    col += uAccent * tail * uMouseSpeed * 0.5;

    // Vignette toward the base color — pulls edges into black.
    float vig = smoothstep(1.2, 0.3, length(uv - 0.5) * 1.4);
    col = mix(uBg, col, mix(0.55, 1.0, vig));

    // Film grain
    float g = hash(uv * uResolution + fract(uTime));
    col += (g - 0.5) * 0.03;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function srgb(hex: string) {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

function FlowField({ reducedMotion }: { reducedMotion: boolean }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  const smoothedMouse = useRef(new THREE.Vector2(0, 0));
  const velocity = useRef(new THREE.Vector2(0, 0));
  const prevPointer = useRef(new THREE.Vector2(0, 0));
  const instVel = useRef(new THREE.Vector2(0, 0));
  // Track the cursor at the window level — the canvas is pointer-events:none
  // (so admin clicks pass through), which means r3f's own pointer never fires.
  const pointerTarget = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerTarget.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseVel: { value: new THREE.Vector2(0, 0) },
      uMouseSpeed: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uBg: { value: srgb("#0c0908") }, // --bg
      uUmber: { value: srgb("#4f3826") }, // warm brown pools
      uTaupe: { value: srgb("#7d7163") }, // --m4
      uAccent: { value: srgb("#e0875a") }, // --accent
      uWarm: { value: srgb("#eab38a") }, // --accent-hi
      uCream: { value: srgb("#f4ede3") }, // --ink
      uBlue: { value: srgb("#4d86c4") }, // steel-blue accent
    }),
    []
  );

  useFrame((_, delta) => {
    const mat = materialRef.current;
    if (!mat) return;

    // Freeze motion for reduced-motion users; still render one rich frame.
    if (!reducedMotion) {
      uniforms.uTime.value += delta;
    }

    // Window-tracked pointer, normalized -1..1 (see effect above).
    const p = pointerTarget.current;

    if (reducedMotion) {
      velocity.current.set(0, 0);
      uniforms.uMouseSpeed.value = 0;
    } else {
      // Instantaneous velocity (units/sec), then smoothed so the wake eases
      // in and decays to zero when the cursor rests.
      const dt = Math.max(delta, 0.001);
      instVel.current.set(
        (p.x - prevPointer.current.x) / dt,
        (p.y - prevPointer.current.y) / dt
      );
      velocity.current.lerp(instVel.current, 0.15);
      uniforms.uMouseSpeed.value = Math.min(velocity.current.length() * 0.1, 1);
    }
    prevPointer.current.copy(p);

    // Torch position tracks the cursor closely (still eased for a liquid feel).
    smoothedMouse.current.lerp(p, reducedMotion ? 1 : 0.16);
    uniforms.uMouse.value.copy(smoothedMouse.current);
    uniforms.uMouseVel.value.copy(velocity.current);
    uniforms.uResolution.value.set(
      size.width * viewport.dpr,
      size.height * viewport.dpr
    );
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function ShaderScene() {
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      frameloop={reducedMotion ? "demand" : "always"}
      style={{ width: "100%", height: "100%" }}
    >
      <FlowField reducedMotion={reducedMotion} />
    </Canvas>
  );
}
