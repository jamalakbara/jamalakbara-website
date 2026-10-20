---
aimem: 1
id: mem-wrgtj0pf
type: memory
title: Prod admin commits land on main; merge main into development periodically
summary: main drifts ahead of development with content-only commits from /admin saves.
status: active
trust: agent
roles: [all]
tags: [cms, git]
paths: [content/**]
author: agent:claude-code:claude-opus-5-5
created: 2026-10-20T03:28:15Z
updated: 2026-10-20T03:28:15Z
links: [dec-rpqe6kjf]
kind: constraint
---

On Vercel, /admin saves commit to GITHUB_CONTENT_BRANCH (main) and trigger a rebuild. Feature work happens on development and PRs to main, so development falls behind on content. Merge main → development before starting work that touches content/ to avoid conflicts.
