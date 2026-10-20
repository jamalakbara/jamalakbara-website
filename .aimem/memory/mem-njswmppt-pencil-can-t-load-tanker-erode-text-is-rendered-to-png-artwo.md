---
aimem: 1
id: mem-njswmppt
type: memory
title: Pencil can't load Tanker/Erode — text is rendered to PNG artwork
summary: In jamalakbara.pen, Fontshare text is a '<name> / Fontshare' frame + image rect with live text hidden; render via tools/render-type.swift.
status: active
trust: agent
roles: [all]
tags: [pencil, fonts, design]
author: agent:claude-code
created: 2026-10-20T07:02:47Z
updated: 2026-10-20T07:02:47Z
---

Pencil only has Google fonts. Canvas text that should be Tanker/Erode is drawn as PNG artwork: a frame named '<Name> / Fontshare' (metadata type fontshare-text, content, fontFamily, fontSize) holding a rectangle with an image fill, next to the original text node set enabled:false. Admin screens author text with fontFamily $admin-display (Anton stand-in = Tanker) / $admin-body (Newsreader stand-in = Erode), then render: job JSON {id,text,font,size,line,color,width?,align?,path} -> run 'swift tools/render-type.swift jobs.json' from the .pen folder (~/.pencil/documents/<id>/, fonts in fonts/). Hash id = h*31+codepoint over 'text|font|size|color'. Changing an instance's hidden text does NOT update its artwork — re-render and swap the rect fill. Implement with live text in code, never images.
