"use client";

import { useEffect } from "react";

// Port of the canvas sticker shader `shaders/sticker-hover-peel.glsl`, used
// by the collage stickers, project number tiles and About capability icons
// (.f-sticker, .f-tile, .f-cap__icon):
// the top-right corner peels toward the pointer side, darkens slightly and
// lifts a soft shadow. Strength follows the pointer's distance from the sticker
// edge (as on the canvas); website handoff timing: enter 220 ms ease-out,
// exit spring (stiffness 260, damping 20). One shared WebGL canvas is moved
// into whichever sticker or tile is hovered, so the page holds a single context.
// Without WebGL, on touch, or under prefers-reduced-motion nothing mounts and
// site.css falls back to the shadow-only hover.

const FRAG = `
precision mediump float;
uniform vec2 u_resolution;
uniform sampler2D u_content;
uniform float u_hover;
vec4 artwork(vec2 uv) {
  return texture2D(u_content,uv)*step(0.0,uv.x)*step(uv.x,1.0)*step(0.0,uv.y)*step(uv.y,1.0);
}
void main(){
  vec2 uv=gl_FragCoord.xy/u_resolution;
  float hover=u_hover;
  float curl=smoothstep(0.2,1.0,uv.x)*smoothstep(0.1,1.0,uv.y);
  vec2 q=uv;
  q.x+=hover*curl*0.035;
  q.y-=hover*curl*0.065;
  vec4 ink=artwork(q);
  float shade=0.0;
  for(int i=0;i<5;i++){
    float o=float(i)-2.0;
    shade+=artwork(uv+vec2(o*0.008,0.025+o*0.006)).a;
  }
  shade=max(shade*0.2*0.20*hover,0.0);
  ink.rgb*=1.0-0.07*hover*curl;
  gl_FragColor=ink+vec4(vec3(0.10,0.085,0.06)*shade,shade)*(1.0-ink.a);
}`;

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}`;
const TARGET = ".f-sticker, .f-tile, .f-cap__icon";
const ENTER_MS = 220;
const STIFFNESS = 260;
const DAMPING = 20;

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function StickerPeel() {
  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = document.createElement("canvas");
    canvas.className = "f-sticker__peel";
    canvas.setAttribute("aria-hidden", "true");
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true });
    if (!gl) return;

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
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uHover = gl.getUniformLocation(prog, "u_hover");

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.clearColor(0, 0, 0, 0);

    // Rasterise the SVG at the sticker's on-screen size (crisp at any DPR).
    const raster = document.createElement("canvas");
    const ctx2d = raster.getContext("2d")!;

    let host: HTMLElement | null = null;
    let hidden: HTMLElement[] = [];
    let boxX = 0;
    let boxY = 0;
    let boxW = 1;
    let boxH = 1;
    let edge = 0; // pointer edge factor, 0..1
    let enterAt = 0;
    let inside = false;
    let hover = 0;
    let vel = 0;
    let last = 0;
    let raf = 0;

    const draw = () => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uHover, hover);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const detach = () => {
      for (const el of hidden) el.style.visibility = "";
      canvas.remove();
      host = null;
      hidden = [];
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      if (inside) {
        hover = easeOut(Math.min((now - enterAt) / ENTER_MS, 1)) * edge;
        vel = 0;
      } else {
        // spring back to rest, sub-stepped for stability
        for (let i = 0; i < 4; i++) {
          const h = dt / 4;
          vel += (-STIFFNESS * hover - DAMPING * vel) * h;
          hover += vel * h;
        }
        if (Math.abs(hover) < 1e-3 && Math.abs(vel) < 1e-3) {
          hover = 0;
          draw();
          detach();
          raf = 0;
          return;
        }
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const attach = (el: HTMLElement) => {
      const pic = el.querySelector("img");
      if (!pic || !pic.complete || !pic.naturalWidth) return false;
      if (host && host !== el) detach();
      if (host === el) return true;
      // The shader runs on the artwork's own box, as on the canvas: stickers
      // fill their (rotated) span; tile and icon artwork sits inside a larger,
      // unrotated box, so measure its offset there.
      if (pic.offsetWidth === el.offsetWidth && pic.offsetHeight === el.offsetHeight) {
        boxX = boxY = 0;
      } else {
        const hr = el.getBoundingClientRect();
        const pr = pic.getBoundingClientRect();
        const k = el.offsetWidth / hr.width;
        boxX = (pr.left - hr.left) * k;
        boxY = (pr.top - hr.top) * k;
      }
      boxW = pic.offsetWidth;
      boxH = pic.offsetHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(boxW * dpr));
      const h = Math.max(1, Math.round(boxH * dpr));
      raster.width = w;
      raster.height = h;
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx2d.clearRect(0, 0, boxW, boxH);
      ctx2d.drawImage(pic, 0, 0, boxW, boxH);
      const label = el.querySelector<HTMLElement>(".f-tile__n");
      if (label) drawLabel(ctx2d, label, boxX, boxY);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, raster);
      canvas.width = w;
      canvas.height = h;
      gl.uniform2f(uRes, w, h);
      hover = 0;
      vel = 0;
      draw();
      Object.assign(canvas.style, { left: `${boxX}px`, top: `${boxY}px`, width: `${boxW}px`, height: `${boxH}px` });
      el.appendChild(canvas);
      hidden = label ? [pic, label] : [pic];
      for (const x of hidden) x.style.visibility = "hidden";
      host = el;
      return true;
    };

    const edgeOf = (el: HTMLElement, e: PointerEvent) => {
      // offsetX/Y are in the target's local (pre-rotation) box: exact for the
      // host and for artwork filling it; otherwise (tile digits, tiles are
      // unrotated) measure against the host's client rect.
      const t = e.target as HTMLElement;
      let px: number, py: number;
      if (t === el || (t.offsetWidth === el.offsetWidth && t.offsetHeight === el.offsetHeight)) {
        px = e.offsetX;
        py = e.offsetY;
      } else {
        const r = el.getBoundingClientRect();
        px = ((e.clientX - r.left) / r.width) * el.offsetWidth;
        py = ((e.clientY - r.top) / r.height) * el.offsetHeight;
      }
      const x = (px - boxX) / boxW;
      const y = (py - boxY) / boxH;
      return smoothstep(0, 0.18, Math.min(x, 1 - x, y, 1 - y));
    };

    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = (e.target as Element).closest?.(TARGET) as HTMLElement | null;
      if (!el || el === host && inside) return;
      if (!attach(el)) return;
      inside = true;
      enterAt = performance.now() - easeOutInverse(Math.min(Math.max(hover, 0), 1)) * ENTER_MS;
      edge = edgeOf(el, e);
      start();
    };
    const onMove = (e: PointerEvent) => {
      if (!host || !inside) return;
      edge = edgeOf(host, e);
    };
    const onOut = (e: PointerEvent) => {
      if (!host || !inside) return;
      if (e.relatedTarget instanceof Node && host.contains(e.relatedTarget)) return;
      inside = false;
      start();
    };

    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onOut);
    document.documentElement.dataset.peel = "";

    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
      delete document.documentElement.dataset.peel;
      cancelAnimationFrame(raf);
      detach();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return null;
}

// Paint a tile's Comico digits where the DOM sets them: positioned centre,
// rotation from the computed transform, baseline as CSS lays out the line box.
function drawLabel(ctx: CanvasRenderingContext2D, el: HTMLElement, dx: number, dy: number) {
  const cs = getComputedStyle(el);
  const m = new DOMMatrix(cs.transform === "none" ? undefined : cs.transform);
  const size = parseFloat(cs.fontSize);
  const lh = cs.lineHeight === "normal" ? size * 1.2 : parseFloat(cs.lineHeight);
  ctx.save();
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  ctx.fillStyle = cs.color;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  const tm = ctx.measureText(el.textContent ?? "");
  const asc = tm.fontBoundingBoxAscent ?? size * 0.8;
  const desc = tm.fontBoundingBoxDescent ?? size * 0.2;
  ctx.translate(parseFloat(cs.left) - dx, parseFloat(cs.top) - dy);
  ctx.rotate(Math.atan2(m.b, m.a));
  ctx.fillText(el.textContent ?? "", 0, -lh / 2 + (lh - asc - desc) / 2 + asc);
  ctx.restore();
}

// Resume the enter curve from the current value when re-entering mid-spring.
function easeOutInverse(v: number) {
  return 1 - Math.cbrt(1 - v);
}
