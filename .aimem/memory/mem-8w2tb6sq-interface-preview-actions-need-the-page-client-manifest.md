---
aimem: 1
id: mem-8w2tb6sq
type: memory
title: Interface preview actions need the page client manifest
summary: Import and render the shared preview view in the iframe page so Next registers the client components returned by its live preview server action.
status: active
trust: verified
roles: [all]
paths: [app/admin/interface-preview/**, lib/admin/interface-preview*]
author: human:akbar
created: 2026-11-08T09:35:06Z
updated: 2026-11-08T09:35:06Z
verified: 2026-11-08
kind: gotcha
---

Returning JSX directly from an action without also rendering that shared view in the iframe page produced missing React Client Manifest errors in a Turbopack production build. The authenticated iframe server-renders an initial section, then receives unsaved UI via same-origin messages and returns the updated view from a debounced authenticated action.
