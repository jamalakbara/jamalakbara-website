---
aimem: 1
id: mem-r01tkdbw
type: memory
title: "Comico font is a subset: hero name + digits only"
summary: Using Comico for other text renders missing glyphs; re-subset the woff2 in app/fonts first.
status: active
trust: agent
roles: [all]
tags: [fonts, design]
paths: [app/fonts/**]
author: agent:claude-code:claude-opus-5-5
created: 2026-10-20T03:28:16Z
updated: 2026-10-20T03:28:16Z
kind: gotcha
---

Tanker (display/titles), Erode (body/meta) and Comico ship as woff2 subsets via next/font/local. Comico only contains the glyphs for the hero name and number digits. Any other use needs a new subset. All faces are weight 400.
