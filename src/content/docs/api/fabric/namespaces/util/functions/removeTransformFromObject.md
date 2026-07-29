---
editUrl: false
next: false
prev: false
title: "removeTransformFromObject"
---

> **removeTransformFromObject**(`object`, `transform`): `void`

Defined in: [src/util/misc/objectTransforms.ts:23](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/util/misc/objectTransforms.ts#L23)

given an object and a transform, apply the inverse transform to the object,
this is equivalent to remove from that object that transformation, so that
added in a space with the removed transform, the object will be the same as before.
Removing from an object a transform that scale by 2 is like scaling it by 1/2.
Removing from an object a transform that rotate by 30deg is like rotating by 30deg
in the opposite direction.
This util is used to add objects inside transformed groups or nested groups.

## Parameters

### object

[`BaseFabricObject`](/api/classes/basefabricobject/)

the object you want to transform

### transform

[`TMat2D`](/api/type-aliases/tmat2d/)

the destination transform

## Returns

`void`
