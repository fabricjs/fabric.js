---
editUrl: false
next: false
prev: false
title: "sendObjectToPlane"
---

> **sendObjectToPlane**(`object`, `from?`, `to?`): [`TMat2D`](/api/type-aliases/tmat2d/)

Defined in: [util/misc/planeChange.ts:81](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/util/misc/planeChange.ts#L81)

A util that abstracts applying transform to objects.\
Sends `object` to the destination coordinate plane by applying the relevant transformations.\
Changes the space/plane where `object` is drawn.\
From the canvas/viewer's perspective `object` remains unchanged.

## Parameters

### object

[`BaseFabricObject`](/api/classes/basefabricobject/)

### from?

[`TMat2D`](/api/type-aliases/tmat2d/)

plane matrix containing object. Passing `undefined` is equivalent to passing the identity matrix, which means `object` is a direct child of canvas.

### to?

[`TMat2D`](/api/type-aliases/tmat2d/)

destination plane matrix to contain object. Passing `undefined` means `object` should be sent to the canvas coordinate plane.

## Returns

[`TMat2D`](/api/type-aliases/tmat2d/)

the transform matrix that was applied to `object`

## Examples

**Move clip path from one object to another while preserving it's appearance as viewed by canvas/viewer**

```ts
let obj, obj2;
let clipPath = new Circle({ radius: 50 });
obj.clipPath = clipPath;
// render
sendObjectToPlane(clipPath, obj.calcTransformMatrix(), obj2.calcTransformMatrix());
obj.clipPath = undefined;
obj2.clipPath = clipPath;
// render, clipPath now clips obj2 but seems unchanged from the eyes of the viewer
```

**Clip an object's clip path with an existing object**

```ts
let obj, existingObj;
let clipPath = new Circle({ radius: 50 });
obj.clipPath = clipPath;
let transformTo = multiplyTransformMatrices(obj.calcTransformMatrix(), clipPath.calcTransformMatrix());
sendObjectToPlane(existingObj, existingObj.group?.calcTransformMatrix(), transformTo);
clipPath.clipPath = existingObj;
```
