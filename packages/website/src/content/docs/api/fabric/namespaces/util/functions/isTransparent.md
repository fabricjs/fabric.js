---
editUrl: false
next: false
prev: false
title: "isTransparent"
---

> **isTransparent**(`ctx`, `x`, `y`, `tolerance`): `boolean`

Defined in: [src/util/misc/isTransparent.ts:10](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/util/misc/isTransparent.ts#L10)

Returns true if context has transparent pixel
at specified location (taking tolerance into account)

## Parameters

### ctx

`CanvasRenderingContext2D`

context

### x

`number`

x coordinate in canvasElementCoordinate, not fabric space. integer

### y

`number`

y coordinate in canvasElementCoordinate, not fabric space. integer

### tolerance

`number`

Tolerance pixels around the point, not alpha tolerance, integer

## Returns

`boolean`

true if transparent
