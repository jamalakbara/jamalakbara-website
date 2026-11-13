// Render one /work row loop (or all): `npm run render:loop -- adana`.
// Writes out/<id>-loop.mp4 (silent H.264) and out/<id>-loop-poster.jpg.
// Link the uploaded file without q_auto/f_auto: Cloudinary's re-encode (VP9 at
// ~270 kbps) smears the scrolling screenshots into blocks mid-glide.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const ids = process.argv.slice(2);
// Every loop id in src/loops/projects.ts (keys of LOOPS).
const all = [...readFileSync("src/loops/projects.ts", "utf8").matchAll(/^  "?([a-z0-9-]+)"?: \{$/gm)].map((m) => m[1]);
for (const id of ids.length ? ids : all) {
  const run = (...args) => execFileSync("npx", ["remotion", ...args], { stdio: "inherit" });
  // PNG frames → standard limited-range yuv420p. JPEG frames (the config
  // default) yield full-range yuvj420p, which hardware decoders handle worse.
  run("render", `loop-${id}`, `out/${id}-loop.mp4`, "--codec=h264", "--crf=26", "--image-format=png", "--pixel-format=yuv420p", "--muted", "--concurrency=2");
  run("still", `loop-${id}`, `out/${id}-loop-poster.jpg`, "--frame=0", "--image-format=jpeg");
}
