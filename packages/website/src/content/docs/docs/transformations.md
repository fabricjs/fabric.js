---
date: '2023-08-20'
title: 'Transformations'
description: 'Transformations'
---

# Transformations

## Math Intro

A transformation is described by a matrix:

```ts
const matrix = [a, b, c, d, e, f];

const vectorX = [a, b];
const vectorY = [c, d];
const translation = [e, f];
```

`vectorX` and `vectorY` describe the transform applied to the unit vectors `[1, 0]` and `[0, 1]` respectively.
We use the decomposed values (`angle`, `scaleX`, `scaleY`, `skewX`, `skewY`) that are derived from the transformation applied to the unit vectors, see `qrDecompose`.

`translation` describes the offset from the parent plane's `(0, 0)` to the center of the plane, decomposed into `translateX` and `translateY`. Canvas `(0, 0)` is the canvas' tl corner, group `(0, 0)` is the group's center point.

Transformations application order:

- Translation
- Rotation
- Scale
- SkewX
- SkewY

Read more about [matrices] and [transforms] on MDN.

## How It Works

Each object has its own transform that defines a _plane_.
An object can exist in a _plane_ defined by another object (e.g. an object nested under a group, a clip path). This means that the object is affected by that _plane_.

Transformations application order:

- Viewport
- Parent groups
- Own

```ts
// own transform
object.calcOwnTransform();

// object transform including parent groups
object.calcTransformMatrix();

// the plane in which the object exists
multiplyTransformMatrixArray([canvas.viewportTransform, object.group?.calcTransformMatrix()]);
```

Using transformations can be tricky. Sometimes we need to use the relative parent plane (e.g. during rendering) whereas sometimes we need to use the canvas plane or the viewport plane (e.g. object intersection, mouse interactions).

Fabric exposes the following utils for such cases:

```
sendPointToPlane
sendVectorToPlane
sendObjectToPlane
```

### Origin

Positioning an object can be done from the center point or from any other point

```ts
// sets the center point in the canvas plane
object.setCenterPoint(point);
// sets the center point in the parent plane
object.setRelativeCenterPoint(point);

// sets the tl point in the canvas plane
object.setXY(point, 'left', 'top');
// sets the br point in the parent plane
object.setRelativeXY(point, 'bottom', 'right');
```

[transforms]: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Transformations#transforms
[matrices]: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Matrix_math_for_the_web
