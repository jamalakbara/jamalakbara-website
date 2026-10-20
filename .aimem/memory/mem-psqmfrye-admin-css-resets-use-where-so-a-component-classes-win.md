---
aimem: 1
id: mem-psqmfrye
type: memory
title: Admin CSS resets use :where() so .a-* component classes win
summary: A plain '.a-shell button {background:none;border:0}' reset out-ranks single-class components like .a-filter and silently unstyles them.
status: active
trust: agent
roles: [all]
tags: [admin, css]
paths: [app/admin/admin.css]
author: agent:claude-code
created: 2026-10-20T17:32:13Z
updated: 2026-10-20T17:32:13Z
---

Fact: base resets in admin.css are written as :where(.a-shell) :where(button|a|h1…) (zero specificity). Why: with '.a-shell button' (0,1,1) the filter chips, tabs and segmented items rendered as bare text. Verify: Work list filter chips have borders.
