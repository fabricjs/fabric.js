---
editUrl: false
next: false
prev: false
title: "StaticCanvasOptions"
---

Defined in: [src/canvas/StaticCanvasOptions.ts:115](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvasOptions.ts#L115)

## Extends

- `CanvasDrawableOptions`.`CanvasRenderingOptions`.`CanvasExportOptions`

## Extended by

- [`CanvasOptions`](/api/interfaces/canvasoptions/)

## Properties

### allowTouchScrolling

> **allowTouchScrolling**: `boolean`

Defined in: [src/canvas/StaticCanvasOptions.ts:148](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvasOptions.ts#L148)

Indicates whether the browser can be scrolled when using a touchscreen and dragging on the canvas
It gives PRIORITY to DOM scrolling, it doesn't make it always possible.
If is true, when using a touch event on the canvas, the canvas will scroll if scroll is possible.
If we are in drawing mode or if we are selecting an object the canvas preventDefault and so it won't scroll

#### Todo

move to Canvas

***

### backgroundColor

> **backgroundColor**: `string` \| [`TFiller`](/api/type-aliases/tfiller/)

Defined in: [src/canvas/StaticCanvasOptions.ts:18](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvasOptions.ts#L18)

Background color of canvas instance.

#### Inherited from

`CanvasDrawableOptions.backgroundColor`

***

### backgroundImage?

> `optional` **backgroundImage**: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

Defined in: [src/canvas/StaticCanvasOptions.ts:27](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvasOptions.ts#L27)

Background image of canvas instance.
since 2.4.0 image caching is active, please when putting an image as background, add to the
canvas property a reference to the canvas it is on. Otherwise the image cannot detect the zoom
vale. As an alternative you can disable image objectCaching

#### Inherited from

`CanvasDrawableOptions.backgroundImage`

***

### backgroundVpt

> **backgroundVpt**: `boolean`

Defined in: [src/canvas/StaticCanvasOptions.ts:12](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvasOptions.ts#L12)

if set to false background image is not affected by viewport transform

#### Since

1.6.3

#### Todo

we should really find a different way to do this

#### Inherited from

`CanvasDrawableOptions.backgroundVpt`

***

### clipPath?

> `optional` **clipPath**: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

Defined in: [src/canvas/StaticCanvasOptions.ts:96](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvasOptions.ts#L96)

a fabricObject that, without stroke define a clipping area with their shape. filled in black
the clipPath object gets used when the canvas has rendered, and the context is placed in the
top left corner of the canvas.
clipPath will clip away controls, if you do not want this to happen use controlsAboveOverlay = true

#### Inherited from

`CanvasRenderingOptions.clipPath`

***

### controlsAboveOverlay

> **controlsAboveOverlay**: `boolean`

Defined in: [src/canvas/StaticCanvasOptions.ts:137](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvasOptions.ts#L137)

Indicates whether object controls (borders/controls) are rendered above overlay image

#### Todo

move to Canvas

***

### enableRetinaScaling

> **enableRetinaScaling**: `boolean`

Defined in: [src/canvas/StaticCanvasOptions.ts:81](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvasOptions.ts#L81)

When true, canvas is scaled by devicePixelRatio for better rendering on retina screens

#### Inherited from

`CanvasRenderingOptions.enableRetinaScaling`

***

### height

> **height**: `number`

Defined in: [src/canvas/StaticCanvasOptions.ts:129](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvasOptions.ts#L129)

Height in virtual/logical pixels of the canvas.
The canvas can be taller than width if retina scaling is active

***

### imageSmoothingEnabled

> **imageSmoothingEnabled**: `boolean`

Defined in: [src/canvas/StaticCanvasOptions.ts:87](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvasOptions.ts#L87)

Indicates whether this canvas will use image smoothing, this is on by default in browsers

#### Inherited from

`CanvasRenderingOptions.imageSmoothingEnabled`

***

### includeDefaultValues

> **includeDefaultValues**: `boolean`

Defined in: [src/canvas/StaticCanvasOptions.ts:105](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvasOptions.ts#L105)

Indicates whether toObject/toDatalessObject should include default values
if set to false, takes precedence over the object value.

#### Inherited from

`CanvasExportOptions.includeDefaultValues`

***

### overlayColor

> **overlayColor**: `string` \| [`TFiller`](/api/type-aliases/tfiller/)

Defined in: [src/canvas/StaticCanvasOptions.ts:42](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvasOptions.ts#L42)

Overlay color of canvas instance.

#### Since

1.3.9

#### Inherited from

`CanvasDrawableOptions.overlayColor`

***

### overlayImage?

> `optional` **overlayImage**: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

Defined in: [src/canvas/StaticCanvasOptions.ts:51](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvasOptions.ts#L51)

Overlay image of canvas instance.
since 2.4.0 image caching is active, please when putting an image as overlay, add to the
canvas property a reference to the canvas it is on. Otherwise the image cannot detect the zoom
vale. As an alternative you can disable image objectCaching

#### Inherited from

`CanvasDrawableOptions.overlayImage`

***

### overlayVpt

> **overlayVpt**: `boolean`

Defined in: [src/canvas/StaticCanvasOptions.ts:35](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvasOptions.ts#L35)

if set to false overlay image is not affected by viewport transform

#### Since

1.6.3

#### Todo

we should really find a different way to do this

#### Inherited from

`CanvasDrawableOptions.overlayVpt`

***

### renderOnAddRemove

> **renderOnAddRemove**: `boolean`

Defined in: [src/canvas/StaticCanvasOptions.ts:64](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvasOptions.ts#L64)

Indicates whether [StaticCanvas#add](/api/classes/staticcanvas/#add), [StaticCanvas#insertAt](/api/classes/staticcanvas/#insertat) and StaticCanvas#remove,
StaticCanvas#moveTo, [StaticCanvas#clear](/api/classes/staticcanvas/#clear) and many more, should also re-render canvas.
Disabling this option will not give a performance boost when adding/removing a lot of objects to/from canvas at once
since the renders are queued and executed one per frame.
Disabling is suggested anyway and managing the renders of the app manually is not a big effort ( canvas.requestRenderAll() )
Left default to true to do not break documentation and old app, fiddles.

#### Inherited from

`CanvasRenderingOptions.renderOnAddRemove`

***

### skipOffscreen

> **skipOffscreen**: `boolean`

Defined in: [src/canvas/StaticCanvasOptions.ts:75](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvasOptions.ts#L75)

Based on vptCoords and object.aCoords, skip rendering of objects that
are not included in current viewport.
May greatly help in applications with crowded canvas and use of zoom/pan
If One of the corner of the bounding box of the object is on the canvas
the objects get rendered.

#### Default

```ts
true
```

#### Inherited from

`CanvasRenderingOptions.skipOffscreen`

***

### svgViewportTransformation

> **svgViewportTransformation**: `boolean`

Defined in: [src/canvas/StaticCanvasOptions.ts:112](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvasOptions.ts#L112)

When true, getSvgTransform() will apply the StaticCanvas.viewportTransform to the SVG transformation. When true,
a zoomed canvas will then produce zoomed SVG output.

#### Inherited from

`CanvasExportOptions.svgViewportTransformation`

***

### viewportTransform

> **viewportTransform**: [`TMat2D`](/api/type-aliases/tmat2d/)

Defined in: [src/canvas/StaticCanvasOptions.ts:158](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvasOptions.ts#L158)

The transformation (a Canvas 2D API transform matrix) which focuses the viewport

#### Examples

```ts
canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
```

```ts
canvas.viewportTransform = [0.7, 0, 0, 0.7, 50, 50];
```

***

### width

> **width**: `number`

Defined in: [src/canvas/StaticCanvasOptions.ts:122](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvasOptions.ts#L122)

Width in virtual/logical pixels of the canvas.
The canvas can be larger than width if retina scaling is active
