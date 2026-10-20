---
aimem: 1
id: mem-f5gqe41w
type: memory
title: Client components must not import values from server admin modules
summary: Importing SECTIONS from lib/admin/posts.ts (→ content-store → node:fs) into the post editor broke the client chunk; client-safe constants live in lib/admin/sections.ts.
status: active
trust: agent
roles: [all]
tags: [admin, nextjs]
paths: [lib/admin/sections.ts, lib/admin/posts.ts]
author: agent:claude-code
created: 2026-10-20T17:32:14Z
updated: 2026-10-20T17:32:14Z
---

Fact: client admin components may import only types from lib/admin/{posts,activity,project-meta,content-store}. Why: dev returned 500 'error generating chunk item content-store.ts [app-client]'. Verify: curl /admin/journal/<slug> returns 200.
