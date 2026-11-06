---
aimem: 1
id: mem-6f6bdj48
type: memory
title: Reveal observer's -10% inset never reaches the last 10% of the page
summary: Elements near page end stay hidden on tall viewports; a second no-margin observer (tail) in PortfolioShell reveals them on entering the viewport.
status: active
trust: verified
roles: [all]
tags: [css, scroll, reveal]
paths: [components/portfolio-shell.tsx]
author: human:akbar
created: 2026-11-06T09:56:57Z
updated: 2026-11-06T09:56:57Z
verified: 2026-11-06
---

Symptom was the ContactStrip stamp missing on windows taller than about 910px and on mobile: its top sat below the 90% line even at full scroll. Any new REVEAL target near the page end relies on the tail observer. When testing in a hidden Browser pane, IntersectionObserver only fires when a screenshot forces a frame.
