---
aimem: 1
id: mem-fbq5wfrm
type: memory
title: Keep Interface Text scroll jumps inside the preview frame
summary: Editor focus used to trigger preview selection and scrollIntoView could scroll the outer admin too. Move the preview .f-scroll container directly after edits.
status: active
trust: verified
roles: [all]
paths: [app/admin/interface-preview/**, app/admin/(protected)/translations/**]
author: human:akbar
created: 2026-11-08T10:05:47Z
updated: 2026-11-08T10:05:47Z
verified: 2026-11-08
kind: gotcha
---

Interface Text uses a nested iframe with its own .f-scroll element. For field jumps use .f-scroll.scrollTo and keep MutationObserver re-highlights scroll-free. Editor focus alone should not trigger a jump, and preview validation can focus an input with preventScroll.
