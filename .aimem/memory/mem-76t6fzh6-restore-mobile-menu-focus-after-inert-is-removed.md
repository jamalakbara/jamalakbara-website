---
aimem: 1
id: mem-76t6fzh6
type: memory
title: Restore mobile-menu focus after inert is removed
summary: PortfolioShell restores toggle focus in the menuOpen effect after removing inert, not synchronously inside close().
status: active
trust: verified
roles: [all]
paths: [components/portfolio-shell.tsx]
author: human:akbar
created: 2026-11-08T13:45:03Z
updated: 2026-11-08T13:45:03Z
verified: 2026-11-08
kind: gotcha
---

The mobile menu makes the f-scroll background inert. Focusing its toggle synchronously in close() fails because React has not removed inert yet. Queue a restoration flag and focus in the menuOpen effect after the closed state commits. Verified with Chrome: open menu, Tab/Shift+Tab wrap inside it, close button restores focus to the original toggle.
