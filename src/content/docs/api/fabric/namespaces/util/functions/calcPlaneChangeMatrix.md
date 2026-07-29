---
editUrl: false
next: false
prev: false
title: "calcPlaneChangeMatrix"
---

> **calcPlaneChangeMatrix**(`from?`, `to?`): [`TMat2D`](/api/type-aliases/tmat2d/)

Defined in: [src/util/misc/planeChange.ts:15](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/util/misc/planeChange.ts#L15)

We are actually looking for the transformation from the destination plane to the source plane (change of basis matrix)\
The object will exist on the destination plane and we want it to seem unchanged by it so we invert the destination matrix (`to`) and then apply the source matrix (`from`)

## Parameters

### from?

[`TMat2D`](/api/type-aliases/tmat2d/) = `iMatrix`

### to?

[`TMat2D`](/api/type-aliases/tmat2d/) = `iMatrix`

## Returns

[`TMat2D`](/api/type-aliases/tmat2d/)
