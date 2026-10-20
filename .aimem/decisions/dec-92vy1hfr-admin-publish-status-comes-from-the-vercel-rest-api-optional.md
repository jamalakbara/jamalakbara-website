---
aimem: 1
id: dec-92vy1hfr
type: decision
title: Admin publish status comes from the Vercel REST API (optional env)
summary: VERCEL_TOKEN + VERCEL_PROJECT_ID (+VERCEL_TEAM_ID) give build state per commit sha; without them the admin shows commits only.
status: proposed
trust: agent
roles: [all]
tags: [admin, vercel, deploy]
paths: [lib/admin/vercel.ts, lib/admin/activity.ts, app/api/admin/deploys/**]
author: agent:claude-code
created: 2026-10-20T17:32:04Z
updated: 2026-10-20T17:32:04Z
---

Owner chose Vercel API over GitHub Deployments (would need extra PAT scopes, less detail). Commits come from GitHub on Vercel and local git log on fs backend. Save toasts poll /api/admin/deploys?sha= until live/failed.
