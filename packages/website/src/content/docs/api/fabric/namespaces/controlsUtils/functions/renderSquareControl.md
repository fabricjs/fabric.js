---
editUrl: false
next: false
prev: false
title: "renderSquareControl"
---

> **renderSquareControl**(`this`, `ctx`, `left`, `top`, `styleOverride`, `fabricObject`): `void`

Defined in: [controls/controlRendering.ts:82](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/controls/controlRendering.ts#L82)

Render a square control, as per fabric features.
This function is written to respect object properties like transparentCorners, cornerSize
cornerColor, cornerStrokeColor
plus the addition of offsetY and offsetX.

## Parameters

### this

[`Control`](/api/classes/control/)

### ctx

`CanvasRenderingContext2D`

context to render on

### left

`number`

x coordinate where the control center should be

### top

`number`

y coordinate where the control center should be

### styleOverride

[`ControlRenderingStyleOverride`](/api/type-aliases/controlrenderingstyleoverride/)

override for FabricObject controls style

### fabricObject

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/)

the fabric object for which we are rendering controls

## Returns

`void`
