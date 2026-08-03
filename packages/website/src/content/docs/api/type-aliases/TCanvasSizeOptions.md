---
editUrl: false
next: false
prev: false
title: "TCanvasSizeOptions"
---

> **TCanvasSizeOptions** = \{ `backstoreOnly?`: `true`; `cssOnly?`: `false`; \} \| \{ `backstoreOnly?`: `false`; `cssOnly?`: `true`; \}

Defined in: [canvas/StaticCanvas.ts:56](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/canvas/StaticCanvas.ts#L56)

Having both options in TCanvasSizeOptions set to true transform the call in a calcOffset
Better try to restrict with types to avoid confusion.
