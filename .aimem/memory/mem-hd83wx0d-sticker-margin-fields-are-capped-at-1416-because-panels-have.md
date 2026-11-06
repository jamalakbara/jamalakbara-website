---
aimem: 1
id: mem-hd83wx0d
type: memory
title: Sticker margin fields are capped at 1416 because panels have fixed height
summary: Title panels stay 308px tall, so cqw sticker fields must stop growing at the canvas width or stickers spill out of the panel on wide screens.
status: active
trust: verified
roles: [all]
tags: [stickers, layout]
paths: [app/(site)/site.css, components/site/sticker.tsx]
author: human:akbar
created: 2026-11-06T09:44:29Z
updated: 2026-11-06T09:44:29Z
verified: 2026-11-06
---

Sticker fields use cqw units against base 1416. .f-stickers--margin and .f-art-margin__field stop at 1416 and margin fields centre beyond it. The home collage keeps scaling because it has its own aspect ratio. Rotated sticker boxes overstate overlap: their corners are transparent, so check ink in a screenshot.
