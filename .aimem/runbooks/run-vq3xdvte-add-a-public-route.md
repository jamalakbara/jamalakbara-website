---
aimem: 1
id: run-vq3xdvte
type: runbook
title: Add a public route
summary: Page + metadata layout + sitemap (+ NAV_LINKS if navbar) built from components/site/*, then verify on local prod build.
status: active
trust: agent
roles: [all]
tags: [seo, routing]
paths: [app/(site)/**, app/sitemap.ts, lib/site-data.ts]
author: agent:claude-code:claude-opus-5-5
created: 2026-10-20T03:27:47Z
updated: 2026-10-20T03:27:47Z
---

1. app/(site)/<route>/page.tsx (prefer server component for content; client islands for interactivity).
2. app/(site)/<route>/layout.tsx exporting metadata: unique title, description, alternates.canonical (full apex URL), openGraph.url.
3. Add to routes in app/sitemap.ts.
4. Add to NAV_LINKS in lib/site-data.ts only if it belongs in the navbar.
5. Build UI from components/site/* and f-* classes.
6. npm run build && npm start; check title, canonical, sitemap count.
