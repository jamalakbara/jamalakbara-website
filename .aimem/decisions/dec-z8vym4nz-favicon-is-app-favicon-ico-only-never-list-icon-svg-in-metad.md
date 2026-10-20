---
aimem: 1
id: dec-z8vym4nz
type: decision
title: Favicon is app/favicon.ico only; never list icon.svg in metadata icons
summary: Browsers prefer SVG over ICO, so an icon.svg entry hides the favicon. Favicon + 3 app icons (stamp artwork) are regenerated together.
status: accepted
trust: agent
roles: [all]
tags: [icons, seo, branding]
paths: [app/favicon.ico, public/icon*.png, public/apple-icon.png, public/icon.svg, app/layout.tsx]
author: agent:claude-code:claude-opus-5-5
created: 2026-10-20T03:27:38Z
updated: 2026-10-20T03:27:38Z
---

History: 2026-07-08 an icon.svg metadata entry overrode the ICO; reverted (commit 0e44a94). Oct 2026 the favicon was refreshed to the cobalt stamp portrait (owner-approved).
App icons: public/icon.svg (source), apple-icon.png 180, icon-192.png, icon-512.png — same stamp artwork. public/logo.svg is the wordmark (remote font, non-square) — never use as an icon. manifest.json background/theme color = #F8F6F0.
