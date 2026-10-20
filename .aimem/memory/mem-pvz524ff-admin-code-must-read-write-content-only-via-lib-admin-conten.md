---
aimem: 1
id: mem-pvz524ff
type: memory
title: Admin code must read/write content only via lib/admin/content-store.ts
summary: Never fs-read content in prod admin code; on Vercel the backend is the GitHub API, fs only in local dev (override ADMIN_CONTENT_BACKEND).
status: active
trust: agent
roles: [all]
tags: [cms, admin]
paths: [lib/admin/**, app/admin/**, app/api/admin/**]
author: agent:claude-code:claude-opus-5-5
created: 2026-10-20T03:28:15Z
updated: 2026-10-20T03:28:15Z
links: [dec-rpqe6kjf]
kind: constraint
---

content-store switches backend automatically: local dev = fs writes to the working tree (you review + commit), Vercel = GitHub Contents/Git Data API via lib/admin/github.ts. The deployed filesystem is the build snapshot, so fs reads in prod return stale content. Override with ADMIN_CONTENT_BACKEND=fs|github.
