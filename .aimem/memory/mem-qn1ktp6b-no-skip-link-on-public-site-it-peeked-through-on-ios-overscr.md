---
aimem: 1
id: mem-qn1ktp6b
type: memory
title: "No skip link on public site: it peeked through on iOS overscroll"
summary: Removed 2026-10-18 (7539c41). Hero h1 stays visually hidden for AT/SEO at every width; mobile and desktop share the same hero copy.
status: active
trust: agent
roles: [all]
tags: [a11y, home]
paths: [app/(site)/page.tsx, components/portfolio-shell.tsx]
author: agent:claude-code:claude-opus-5-5
created: 2026-10-20T03:28:16Z
updated: 2026-10-20T03:28:16Z
kind: gotcha
---

The off-screen skip link became visible during iOS rubber-band overscroll, so it was dropped in commit 7539c41. If re-adding one, test overscroll on iOS Safari. Same commit unified mobile/desktop hero copy — don't reintroduce per-breakpoint copy.
