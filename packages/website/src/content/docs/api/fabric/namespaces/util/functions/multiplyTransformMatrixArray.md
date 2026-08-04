---
editUrl: false
next: false
prev: false
title: "multiplyTransformMatrixArray"
---

> **multiplyTransformMatrixArray**(`matrices`, `is2x2?`): [`TMat2D`](/api/type-aliases/tmat2d/)

Defined in: [util/misc/matrix.ts:96](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/util/misc/matrix.ts#L96)

Multiplies the matrices array such that a matrix defines the plane for the rest of the matrices **after** it

`multiplyTransformMatrixArray([A, B, C, D])` is equivalent to `A(B(C(D)))`

## Parameters

### matrices

(`false` \| [`TMat2D`](/api/type-aliases/tmat2d/) \| `null` \| `undefined`)[]

an array of matrices

### is2x2?

`boolean`

flag to multiply matrices as 2x2 matrices

## Returns

[`TMat2D`](/api/type-aliases/tmat2d/)

the multiplication product
