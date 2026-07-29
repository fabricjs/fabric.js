---
editUrl: false
next: false
prev: false
title: "TCanvasSizeOptions"
---

> **TCanvasSizeOptions** = \{ `backstoreOnly?`: `true`; `cssOnly?`: `false`; \} \| \{ `backstoreOnly?`: `false`; `cssOnly?`: `true`; \}

Defined in: [src/canvas/StaticCanvas.ts:57](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L57)

Having both options in TCanvasSizeOptions set to true transform the call in a calcOffset
Better try to restrict with types to avoid confusion.
