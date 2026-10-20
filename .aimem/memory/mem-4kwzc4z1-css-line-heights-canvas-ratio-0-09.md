---
aimem: 1
id: mem-4kwzc4z1
type: memory
title: CSS line-heights = canvas ratio + 0.09
summary: "Pencil canvas adds the faces' line gap; role classes also carry padding-block: 1px to match."
status: active
trust: agent
roles: [all]
tags: [design, typography]
paths: [app/(site)/site.css]
author: agent:claude-code:claude-opus-5-5
created: 2026-10-20T03:28:16Z
updated: 2026-10-20T03:28:16Z
kind: gotcha
---

When porting a line-height from Pencil, add 0.09 to the canvas ratio, because the canvas includes the font's line gap and the browser does not. Role classes (.f-display, .f-title, .f-body, ...) carry padding-block: 1px. Verify with the pixel-diff recipe in docs/DESIGN_SYSTEM.md §8.
