---
aimem: 1
id: inc-ardxvjg0
type: incident
title: /admin prefix leaked in URL on cms.jamalakbara.com
summary: next-auth redirects and hardcoded admin Links exposed /admin/* on the cms host; fixed with clean-path redirects in proxy.ts (2026-07-11).
status: resolved
trust: agent
roles: [all]
tags: [admin, routing]
paths: [proxy.ts]
author: agent:claude-code:claude-opus-5-5
created: 2026-10-20T03:27:47Z
updated: 2026-10-20T03:27:47Z
---

Cause: rewrite mapped cms.*/x → /admin/x, but next-auth redirects used internal paths and admin Link hrefs are /admin/*. Fix: ab7e304 (clean login/dashboard redirects), 7f16eb3 (redirect /admin/* → clean path on cms host, /api/admin exempt).
