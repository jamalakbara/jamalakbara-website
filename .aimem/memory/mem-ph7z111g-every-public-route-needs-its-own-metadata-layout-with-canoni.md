---
aimem: 1
id: mem-ph7z111g
type: memory
title: Every public route needs its own metadata layout with canonical
summary: Child routes must set title, description, alternates.canonical, openGraph.url — otherwise they inherit root canonical (/) and look like duplicates.
status: active
trust: agent
roles: [all]
tags: [seo]
paths: [app/(site)/**/layout.tsx]
author: agent:claude-code:claude-opus-5-5
created: 2026-10-20T03:27:43Z
updated: 2026-10-20T03:27:43Z
kind: constraint
---

Sections with child routes must re-declare title: { default, template } — the root '%s | Jamal Akbar Alam' template does not propagate past a nested layout that sets title as a plain string (see app/(site)/journal/layout.tsx). Add route to app/sitemap.ts; NAV_LINKS only if it belongs in the navbar.
