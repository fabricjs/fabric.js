---
editUrl: false
next: false
prev: false
title: "addTransformToObject"
---

> **addTransformToObject**(`object`, `transform`): `void`

Defined in: [util/misc/objectTransforms.ts:43](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/util/misc/objectTransforms.ts#L43)

given an object and a transform, apply the transform to the object.
this is equivalent to change the space where the object is drawn.
Adding to an object a transform that scale by 2 is like scaling it by 2.
This is used when removing an object from an active selection for example.

## Parameters

### object

[`BaseFabricObject`](/api/classes/basefabricobject/)

the object you want to transform

### transform

[`TMat2D`](/api/type-aliases/tmat2d/)

the destination transform

## Returns

`void`
