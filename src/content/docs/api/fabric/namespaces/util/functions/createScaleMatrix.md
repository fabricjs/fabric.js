---
editUrl: false
next: false
prev: false
title: "createScaleMatrix"
---

> **createScaleMatrix**(`x`, `y?`): [`TMat2D`](/api/type-aliases/tmat2d/)

Defined in: [src/util/misc/matrix.ts:200](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/util/misc/matrix.ts#L200)

Generate a scale matrix around the point (0,0)

A matrix in the form of
[x 0 0]
[0 y 0]
[0 0 1]

[https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#scale](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#scale)

## Parameters

### x

`number`

scale on X axis

### y?

`number` = `x`

scale on Y axis

## Returns

[`TMat2D`](/api/type-aliases/tmat2d/)

matrix
