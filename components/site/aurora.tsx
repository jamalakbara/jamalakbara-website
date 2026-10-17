"use client";

import { useEffect, useRef } from "react";

// Port of the canvas shell shader `shaders/folder-aurora.glsl` with the
// uniforms set on the Working Folder screens (u_motion 0.6, aurora colours).
// The canvas covers the whole scrolling page (like the canvas frames) and is
// rendered at 1/8 resolution — the field is a smooth gradient, so the browser
// upscale is invisible. Static under prefers-reduced-motion; paused when the
// tab is hidden. Falls back to the CSS gradient on .f-shell without WebGL.

const FRAG = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
const float u_motion = 0.6;
const vec3 u_blue = vec3(0.686, 0.741, 0.886);
const vec3 u_lilac = vec3(0.804, 0.757, 0.867);
const vec3 u_mint = vec3(0.749, 0.831, 0.784);
const vec3 u_peach = vec3(0.867, 0.788, 0.722);
void main() {
  vec2 p = gl_FragCoord.xy / u_resolution;
  float t = u_time * 0.055 * u_motion;
  vec2 q = p + 0.13 * vec2(sin(p.y * 9.0 + t), cos(p.x * 5.0 - t));
  float a = 0.5 + 0.5 * sin(q.x * 5.1 + q.y * 7.8 + t);
  float b = 0.5 + 0.5 * cos(q.x * 4.4 - q.y * 9.2 - t * 0.8);
  vec3 cool = mix(u_blue, u_lilac, smoothstep(0.1, 0.9, a));
  vec3 warm = mix(u_mint, u_peach, smoothstep(0.15, 0.85, b));
  float blend = 0.5 + 0.5 * sin(q.y * 12.0 + q.x * 3.0 + t * 0.6);
  gl_FragColor = vec4(mix(cool, warm, smoothstep(0.1, 0.9, blend)), 1.0);
}`;

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}`;
const SCALE = 1 / 8;
const FRAME_MS = 1000 / 15;

export function Aurora() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, preserveDrawingBuffer: false });
    if (!gl) {
      canvas.style.display = "none";
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      canvas.style.display = "none";
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uTime = gl.getUniformLocation(prog, "u_time");

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let last = 0;
    const start = performance.now();

    const draw = (time: number) => {
      gl.uniform1f(uTime, time);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const resize = () => {
      const w = Math.max(1, Math.ceil(canvas.clientWidth * SCALE));
      const h = Math.max(1, Math.ceil(canvas.clientHeight * SCALE));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(uRes, w, h);
      }
      draw(motion.matches ? 0 : (performance.now() - start) / 1000);
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < FRAME_MS) return;
      last = now;
      draw((now - start) / 1000);
    };
    const play = () => {
      cancelAnimationFrame(raf);
      if (!motion.matches && document.visibilityState === "visible") raf = requestAnimationFrame(tick);
      else draw(0);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    play();
    motion.addEventListener("change", play);
    document.addEventListener("visibilitychange", play);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      motion.removeEventListener("change", play);
      document.removeEventListener("visibilitychange", play);
    };
  }, []);

  return <canvas ref={ref} className="f-aurora" aria-hidden="true" />;
}
