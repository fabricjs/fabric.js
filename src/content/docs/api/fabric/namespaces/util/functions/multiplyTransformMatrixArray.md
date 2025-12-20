---
editUrl: false
next: false
prev: false
title: "multiplyTransformMatrixArray"
---

> **multiplyTransformMatrixArray**(`matrices`, `is2x2?`): [`TMat2D`](/api/type-aliases/tmat2d/)

Defined in: [src/util/misc/matrix.ts:96](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/util/misc/matrix.ts#L96)

Multiplies the matrices array such that a matrix defines the plane for the rest of the matrices **after** it

`multiplyTransformMatrixArray([A, B, C, D])` is equivalent to `A(B(C(D)))`

## Parameters

### matrices

(`undefined` \| `null` \| `false` \| [`TMat2D`](/api/type-aliases/tmat2d/))[]

an array of matrices

### is2x2?

`boolean`

flag to multiply matrices as 2x2 matrices

## Returns

[`TMat2D`](/api/type-aliases/tmat2d/)

the multiplication product
