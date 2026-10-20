---
aimem: 1
id: mem-y9hnr14q
type: memory
title: How to run and test
summary: npm run dev (Webpack default; dev:turbopack opt-in), npm run build as the gate, verify SEO on a local prod server.
status: active
trust: agent
roles: [all]
tags: [pinned, tooling]
author: agent:claude-code:claude-opus-5-5
created: 2026-10-20T03:27:41Z
updated: 2026-10-20T03:27:41Z
kind: howto
---

- npm run dev / npm run build / npm start. Turbopack variants are opt-in (dev:turbopack, build:turbopack).
- No test suite; lint is broken. npm run build type-checks content + pages and fails on metadata type errors.
- After SEO changes: on a local prod server check <title> and rel=canonical per page, /sitemap.xml URL count, JSON-LD on article pages.
- Visual changes: pixel-diff recipe in docs/DESIGN_SYSTEM.md §8 at 1440 and 390 widths.
