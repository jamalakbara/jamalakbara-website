---
aimem: 1
id: mem-c6vs7spy
type: memory
title: Disable scroll reveals for Interface Text field matching
summary: Preview skips the reveal observer so it can find and scroll to a field below the fold.
status: active
trust: verified
roles: [all]
paths: [components/portfolio-shell.tsx, app/admin/interface-preview/**]
author: human:akbar
created: 2026-11-08T09:50:36Z
updated: 2026-11-08T09:50:36Z
verified: 2026-11-08
kind: gotcha
---

PortfolioShell marks offscreen text data-rv=pending, which sets visibility:hidden. The field finder could not detect a changed Home contact heading until the preview skipped that observer. Verified in Chrome that editing home.contactHeading scrolls the preview to the highlighted heading.
