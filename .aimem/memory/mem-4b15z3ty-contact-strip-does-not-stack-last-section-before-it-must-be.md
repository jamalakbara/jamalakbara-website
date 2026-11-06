---
aimem: 1
id: mem-4b15z3ty
type: memory
title: "Contact strip does not stack: last section before it must be position:relative"
summary: Section above .f-strip scrolls normally; relative not static, or it paints under earlier sticky sections. data-buried hides a covered section behind it.
status: active
trust: verified
roles: [all]
tags: [css, scroll]
paths: [app/(site)/site.css, components/portfolio-shell.tsx]
author: human:akbar
created: 2026-11-06T09:51:49Z
updated: 2026-11-06T09:51:49Z
verified: 2026-11-06
---

Stacked sections are sticky via .f-main > *. The strip is excluded along with the section above it, so that section never pins. Static would drop it below earlier sticky siblings in paint order. Earlier sticky sections stay stuck to the end of .f-main and would show through the 4px gap on short viewports (About, Privacy), so PortfolioShell sets data-buried (opacity 0, not visibility, to keep links tabbable). In a hidden Browser pane rAF and scroll events are throttled, so cover/buried state looks stale: dispatch a scroll event when testing.
