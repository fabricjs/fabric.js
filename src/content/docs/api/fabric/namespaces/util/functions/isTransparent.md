---
editUrl: false
next: false
prev: false
title: "isTransparent"
---

> **isTransparent**(`ctx`, `x`, `y`, `tolerance`): `boolean`

Defined in: [src/util/misc/isTransparent.ts:10](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/util/misc/isTransparent.ts#L10)

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
