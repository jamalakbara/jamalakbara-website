---
aimem: 1
id: mem-99sc2k6k
type: memory
title: Normalize localized nav URLs before naming view transitions
summary: Use basePath so English and Bahasa links share a valid transition name.
status: active
trust: verified
roles: [all]
paths: [components/portfolio-shell.tsx]
author: human:akbar
created: 2026-11-08T15:07:35Z
updated: 2026-11-08T15:07:35Z
verified: 2026-11-08
kind: gotcha
---

A raw /id/work URL produced f-nav-id/work, which CSS rejects. Use basePath to obtain f-nav-work. Verified in Chrome that the active link and notch both animate across Bahasa routes.
