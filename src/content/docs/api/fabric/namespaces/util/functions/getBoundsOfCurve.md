---
editUrl: false
next: false
prev: false
title: "getBoundsOfCurve"
---

> **getBoundsOfCurve**(`begx`, `begy`, `cp1x`, `cp1y`, `cp2x`, `cp2y`, `endx`, `endy`): [`TRectBounds`](/api/type-aliases/trectbounds/)

Defined in: [src/util/path/index.ts:221](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/util/path/index.ts#L221)

Calculate bounding box of a cubic Bezier curve
Taken from http://jsbin.com/ivomiq/56/edit (no credits available)
TODO: can we normalize this with the starting points set at 0 and then translated the bbox?

## Parameters

### begx

`number`

starting point

### begy

`number`

### cp1x

`number`

first control point

### cp1y

`number`

### cp2x

`number`

second control point

### cp2y

`number`

### endx

`number`

end of bezier

### endy

`number`

## Returns

[`TRectBounds`](/api/type-aliases/trectbounds/)

the rectangular bounds
