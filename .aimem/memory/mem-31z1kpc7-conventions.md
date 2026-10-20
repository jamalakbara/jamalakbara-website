---
aimem: 1
id: mem-31z1kpc7
type: memory
title: Conventions
summary: Pencil designs 1:1 pixel-perfect; keep docs/DESIGN_SYSTEM.md in sync; read it before touching styles; honor prefers-reduced-motion.
status: active
trust: agent
roles: [all]
tags: [pinned, design]
paths: [docs/**, app/(site)/site.css]
author: agent:claude-code:claude-opus-5-5
created: 2026-10-20T03:27:42Z
updated: 2026-10-20T03:27:42Z
kind: preference
---

- Owner rejected loose 'inspired by' adaptation (2026-10-17). Take exact values from Pencil, diff against frame exports, update docs in the same change.
- Headings keep CMS text and level; visual breaks via sentenceLines() (lib/site-format.ts) or <br className="f-br-*">. Never duplicate copy per breakpoint.
- Public page.tsx are client components; metadata goes in a sibling layout.tsx. Prefer server components for content-bearing pages; no event handlers in server page files (CSS hovers).
- Commits: conventional (feat/fix/chore(scope)). Work on development; PR to main.
