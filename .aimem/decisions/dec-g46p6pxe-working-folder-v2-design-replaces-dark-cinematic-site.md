---
aimem: 1
id: dec-g46p6pxe
type: decision
title: Working Folder v2 design replaces dark cinematic site
summary: "Oct 2026 revamp: paper panels on pastel aurora, Tanker/Erode/Comico, cobalt #2445DB. Background videos retired on public site; /admin keeps legacy dark styling."
status: accepted
trust: agent
roles: [all]
tags: [design, revamp]
paths: [app/(site)/**, components/site/**, docs/DESIGN_SYSTEM.md]
author: agent:claude-code:claude-opus-5-5
created: 2026-10-20T03:27:37Z
updated: 2026-10-20T03:27:37Z
---

Public site moved to Working Folder v2 (Pencil jamalakbara.pen) in Oct 2026. Tokens/classes live in app/(site)/site.css (--f-*, .f-*); app/globals.css keeps legacy dark tokens used only by /admin — never restyle a globals.css class for the public site.
Per-route background videos (pages.*.backgroundVideo, lib/backgrounds.ts) are no longer rendered; the admin field and data are intentionally kept. GSAP, Lenis and R3F are installed but not used in shipped pages; Framer Motion is the in-use library.
