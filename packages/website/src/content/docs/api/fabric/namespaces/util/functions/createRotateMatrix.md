---
editUrl: false
next: false
prev: false
title: "createRotateMatrix"
---

> **createRotateMatrix**(`angle?`, `pivotPoint?`): [`TMat2D`](/api/type-aliases/tmat2d/)

Defined in: [util/misc/matrix.ts:185](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/util/misc/matrix.ts#L185)

Generate a rotation matrix around around a point (x,y), defaulting to (0,0)

A matrix in the form of
[cos(a) -sin(a) -x*cos(a)+y*sin(a)+x]
[sin(a)  cos(a) -x*sin(a)-y*cos(a)+y]
[0       0      1                 ]

## Parameters

### angle?

[`TRotateMatrixArgs`](/api/fabric/namespaces/util/type-aliases/trotatematrixargs/) = `{}`

rotation in degrees

### pivotPoint?

`Partial`\<[`XY`](/api/interfaces/xy/)\> = `{}`

pivot point to rotate around

## Returns

[`TMat2D`](/api/type-aliases/tmat2d/)

matrix
