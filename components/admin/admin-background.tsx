"use client";

import dynamic from "next/dynamic";

// WebGL scene is client-only — never server-render the Canvas.
const ShaderScene = dynamic(() => import("./shader-scene"), { ssr: false });

/* Fixed, non-interactive shader backdrop for the admin surface. Sits behind
   all admin chrome (z-0); the CSS base color shows until WebGL mounts. */
export function AdminBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 bg-[var(--bg)]"
    >
      <ShaderScene />
    </div>
  );
}
