---
aimem: 1
id: mem-ej9x5wan
type: memory
title: /privacy UPDATED date must be bumped on data-handling changes
summary: Server component with hardcoded copy; bump UPDATED when policy text, analytics, storage keys or third parties change.
status: active
trust: agent
roles: [all]
tags: [privacy, analytics]
paths: [app/(site)/privacy/**]
author: agent:claude-code:claude-opus-5-5
created: 2026-10-20T03:28:17Z
updated: 2026-10-20T03:28:17Z
kind: constraint
---

/privacy has hardcoded copy and inline metadata in app/(site)/privacy/layout.tsx; not admin-editable, not in the navbar, linked from the cookie banner. Any change to GA, localStorage keys (e.g. cookie-consent) or third parties requires updating the policy text and UPDATED date.
