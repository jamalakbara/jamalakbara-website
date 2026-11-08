---
aimem: 1
id: mem-22mftkxf
type: memory
title: Service static params must include locale and slug together
summary: Returning an empty English slug list with dynamicParams=false omitted every Bahasa detail page from the production build.
status: active
trust: verified
roles: [all]
author: human:akbar
created: 2026-11-08T12:16:25Z
updated: 2026-11-08T12:16:25Z
verified: 2026-11-08
kind: gotcha
---

Return complete lang/slug pairs for all live service pages. Verified the five Bahasa pages are prerendered and return 200 in the standalone server.
