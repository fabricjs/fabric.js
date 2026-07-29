---
editUrl: false
next: false
prev: false
title: "sendObjectToPlane"
---

> **sendObjectToPlane**(`object`, `from?`, `to?`): [`TMat2D`](/api/type-aliases/tmat2d/)

Defined in: [src/util/misc/planeChange.ts:81](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/util/misc/planeChange.ts#L81)

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

```ts
let obj, existingObj;
let clipPath = new Circle({ radius: 50 });
obj.clipPath = clipPath;
let transformTo = multiplyTransformMatrices(obj.calcTransformMatrix(), clipPath.calcTransformMatrix());
sendObjectToPlane(existingObj, existingObj.group?.calcTransformMatrix(), transformTo);
clipPath.clipPath = existingObj;
```
