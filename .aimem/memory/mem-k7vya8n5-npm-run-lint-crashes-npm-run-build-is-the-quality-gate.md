---
aimem: 1
id: mem-k7vya8n5
type: memory
title: npm run lint crashes; npm run build is the quality gate
summary: ESLint 9 + legacy eslintrc = circular-structure error (pre-existing). Build type-checks and prerenders every page.
status: active
trust: agent
roles: [all]
tags: [tooling, build]
paths: [package.json]
author: agent:claude-code:claude-opus-5-5
created: 2026-10-20T03:28:14Z
updated: 2026-10-20T03:28:14Z
kind: gotcha
---

npm run lint fails with a circular-structure error (ESLint 9 with legacy eslintrc config). Pre-existing, documented in CLAUDE.md Known Gaps. Use npm run build instead: next.config.ts does not ignore TS errors, so build type-checks all content and pages and fails on metadata type errors.
