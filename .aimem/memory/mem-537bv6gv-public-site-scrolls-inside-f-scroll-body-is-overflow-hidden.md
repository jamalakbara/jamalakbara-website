---
aimem: 1
id: mem-537bv6gv
type: memory
title: Public site scrolls inside .f-scroll, body is overflow:hidden
summary: Scroll listeners / scroll-into-view must target the .f-scroll container, not window. Admin has its own scroll container and is not wrapped by PortfolioShell.
status: active
trust: agent
roles: [all]
tags: [layout]
paths: [components/portfolio-shell.tsx, app/(site)/site.css]
author: agent:claude-code:claude-opus-5-5
created: 2026-10-20T03:28:16Z
updated: 2026-10-20T03:28:16Z
kind: gotcha
---

PortfolioShell renders the aurora field and nav, and the page content scrolls inside .f-scroll; body has overflow:hidden. window scroll events and window.scrollTo do nothing on the public site — attach to the .f-scroll element. /admin is outside PortfolioShell with its own scroller.
