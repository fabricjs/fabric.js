---
editUrl: false
next: false
prev: false
title: "CanvasOptions"
---

Defined in: [src/canvas/CanvasOptions.ts:229](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L229)

## Extends

- [`StaticCanvasOptions`](/api/interfaces/staticcanvasoptions/).`CanvasTransformOptions`.`CanvasSelectionOptions`.`CanvasCursorOptions`.`TargetFindOptions`.`CanvasEventsOptions`

## Properties

### allowTouchScrolling

> **allowTouchScrolling**: `boolean`

Defined in: [src/canvas/StaticCanvasOptions.ts:150](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/StaticCanvasOptions.ts#L150)

Indicates whether the browser can be scrolled when using a touchscreen and dragging on the canvas
It gives PRIORITY to DOM scrolling, it doesn't make it always possible.
If is true, when using a touch event on the canvas, the canvas will scroll if scroll is possible.
If we are in drawing mode or if we are selecting an object the canvas preventDefault and so it won't scroll

#### Todo

move to Canvas

#### Inherited from

[`StaticCanvasOptions`](/api/interfaces/staticcanvasoptions/).[`allowTouchScrolling`](/api/interfaces/staticcanvasoptions/#allowtouchscrolling)

***

### altActionKey

> **altActionKey**: [`TOptionalModifierKey`](/api/type-aliases/toptionalmodifierkey/)

Defined in: [src/canvas/CanvasOptions.ts:61](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L61)

Indicates which key enable alternate action on corner
values: 'altKey', 'shiftKey', 'ctrlKey'.
If `null` or 'none' or any other string that is not a modifier key
feature is disabled feature disabled.

#### Since

1.6.2

#### Inherited from

`CanvasTransformOptions.altActionKey`

***

### altSelectionKey

> **altSelectionKey**: [`TOptionalModifierKey`](/api/type-aliases/toptionalmodifierkey/)

Defined in: [src/canvas/CanvasOptions.ts:95](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L95)

Indicates which key enable alternative selection
in case of a target overlapping with active object and we don't want to loose the
active selection, we can press this modifier key and continue selecting the current
selected object also when is covered by another or many valid targets for selection.
values: 'altKey', 'shiftKey', 'ctrlKey'.
For a series of reason that come from the general expectations on how
things should work, this feature works only for preserveObjectStacking true.
If `null` or 'none' or any other string that is not a modifier key
feature is disabled.

#### Since

1.6.5

#### Inherited from

`CanvasSelectionOptions.altSelectionKey`

***

### backgroundColor

> **backgroundColor**: `string` \| [`TFiller`](/api/type-aliases/tfiller/)

Defined in: [src/canvas/StaticCanvasOptions.ts:18](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/StaticCanvasOptions.ts#L18)

Background color of canvas instance.

#### Inherited from

[`StaticCanvasOptions`](/api/interfaces/staticcanvasoptions/).[`backgroundColor`](/api/interfaces/staticcanvasoptions/#backgroundcolor)

***

### backgroundImage?

> `optional` **backgroundImage**: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

Defined in: [src/canvas/StaticCanvasOptions.ts:27](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/StaticCanvasOptions.ts#L27)

Background image of canvas instance.
since 2.4.0 image caching is active, please when putting an image as background, add to the
canvas property a reference to the canvas it is on. Otherwise the image cannot detect the zoom
vale. As an alternative you can disable image objectCaching

#### Inherited from

[`StaticCanvasOptions`](/api/interfaces/staticcanvasoptions/).[`backgroundImage`](/api/interfaces/staticcanvasoptions/#backgroundimage)

***

### backgroundVpt

> **backgroundVpt**: `boolean`

Defined in: [src/canvas/StaticCanvasOptions.ts:12](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/StaticCanvasOptions.ts#L12)

if set to false background image is not affected by viewport transform

#### Since

1.6.3

#### Todo

we should really find a different way to do this

#### Inherited from

[`StaticCanvasOptions`](/api/interfaces/staticcanvasoptions/).[`backgroundVpt`](/api/interfaces/staticcanvasoptions/#backgroundvpt)

***

### centeredKey

> **centeredKey**: [`TOptionalModifierKey`](/api/type-aliases/toptionalmodifierkey/)

Defined in: [src/canvas/CanvasOptions.ts:51](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L51)

Indicates which key enable centered Transform
values: 'altKey', 'shiftKey', 'ctrlKey'.
If `null` or 'none' or any other string that is not a modifier key
feature is disabled feature disabled.

#### Since

1.6.2

#### Inherited from

`CanvasTransformOptions.centeredKey`

***

### centeredRotation

> **centeredRotation**: `boolean`

Defined in: [src/canvas/CanvasOptions.ts:41](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L41)

When true, objects use center point as the origin of rotate transformation.
<b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).

#### Since

1.3.4

#### Inherited from

`CanvasTransformOptions.centeredRotation`

***

### centeredScaling

> **centeredScaling**: `boolean`

Defined in: [src/canvas/CanvasOptions.ts:33](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L33)

When true, objects use center point as the origin of scale transformation.
<b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).

#### Since

1.3.4

#### Inherited from

`CanvasTransformOptions.centeredScaling`

***

### clipPath?

> `optional` **clipPath**: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

Defined in: [src/canvas/StaticCanvasOptions.ts:96](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/StaticCanvasOptions.ts#L96)

a fabricObject that, without stroke define a clipping area with their shape. filled in black
the clipPath object gets used when the canvas has rendered, and the context is placed in the
top left corner of the canvas.
clipPath will clip away controls, if you do not want this to happen use controlsAboveOverlay = true

#### Inherited from

[`StaticCanvasOptions`](/api/interfaces/staticcanvasoptions/).[`clipPath`](/api/interfaces/staticcanvasoptions/#clippath)

***

### ~~containerClass~~

> **containerClass**: `string`

Defined in: [src/canvas/CanvasOptions.ts:241](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L241)

Default element class that's given to wrapper (div) element of canvas

:::caution[Deprecated]
customize [CanvasDOMManager](/api/classes/canvasdommanager/) instead or access elements directly
:::

***

### controlsAboveOverlay

> **controlsAboveOverlay**: `boolean`

Defined in: [src/canvas/StaticCanvasOptions.ts:139](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/StaticCanvasOptions.ts#L139)

Indicates whether object controls (borders/controls) are rendered above overlay image

#### Todo

move to Canvas

#### Inherited from

[`StaticCanvasOptions`](/api/interfaces/staticcanvasoptions/).[`controlsAboveOverlay`](/api/interfaces/staticcanvasoptions/#controlsaboveoverlay)

***

### defaultCursor

> **defaultCursor**: `string`

Defined in: [src/canvas/CanvasOptions.ts:149](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L149)

Default cursor value used for the entire canvas

#### Default

```ts
default
```

#### Inherited from

`CanvasCursorOptions.defaultCursor`

***

### enablePointerEvents

> **enablePointerEvents**: `boolean`

Defined in: [src/canvas/CanvasOptions.ts:226](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L226)

When the option is enabled, PointerEvent is used instead of TPointerEvent.

#### Inherited from

`CanvasEventsOptions.enablePointerEvents`

***

### enableRetinaScaling

> **enableRetinaScaling**: `boolean`

Defined in: [src/canvas/StaticCanvasOptions.ts:81](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/StaticCanvasOptions.ts#L81)

When true, canvas is scaled by devicePixelRatio for better rendering on retina screens

#### Inherited from

[`StaticCanvasOptions`](/api/interfaces/staticcanvasoptions/).[`enableRetinaScaling`](/api/interfaces/staticcanvasoptions/#enableretinascaling)

***

### ~~fireMiddleClick~~

> **fireMiddleClick**: `boolean`

Defined in: [src/canvas/CanvasOptions.ts:220](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L220)

Indicates if the canvas can fire middle click events
The default value changed from false to true in Fabric 7.0

:::caution[Deprecated]
since 7.0, Will be removed in Fabric 8.0
:::

#### See

https://fabricjs.com/docs/upgrading/upgrading-to-fabric-70/

#### Since

1.7.8

#### Inherited from

`CanvasEventsOptions.fireMiddleClick`

***

### ~~fireRightClick~~

> **fireRightClick**: `boolean`

Defined in: [src/canvas/CanvasOptions.ts:210](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L210)

Indicates if the canvas can fire right click events
The default value changed from false to true in Fabric 7.0

:::caution[Deprecated]
since 7.0, Will be removed in Fabric 8.0
:::

#### See

https://fabricjs.com/docs/upgrading/upgrading-to-fabric-70/

#### Since

1.6.5

#### Inherited from

`CanvasEventsOptions.fireRightClick`

***

### freeDrawingCursor

> **freeDrawingCursor**: `string`

Defined in: [src/canvas/CanvasOptions.ts:156](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L156)

Cursor value used during free drawing

#### Default

```ts
crosshair
```

#### Inherited from

`CanvasCursorOptions.freeDrawingCursor`

***

### height

> **height**: `number`

Defined in: [src/canvas/StaticCanvasOptions.ts:131](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/StaticCanvasOptions.ts#L131)

Height in virtual/logical pixels of the canvas.
The canvas can be taller than width if retina scaling is active

#### Inherited from

[`StaticCanvasOptions`](/api/interfaces/staticcanvasoptions/).[`height`](/api/interfaces/staticcanvasoptions/#height)

***

### hoverCursor

> **hoverCursor**: `string`

Defined in: [src/canvas/CanvasOptions.ts:135](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L135)

Default cursor value used when hovering over an object on canvas

#### Default

```ts
move
```

#### Inherited from

`CanvasCursorOptions.hoverCursor`

***

### imageSmoothingEnabled

> **imageSmoothingEnabled**: `boolean`

Defined in: [src/canvas/StaticCanvasOptions.ts:87](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/StaticCanvasOptions.ts#L87)

Indicates whether this canvas will use image smoothing, this is on by default in browsers

#### Inherited from

[`StaticCanvasOptions`](/api/interfaces/staticcanvasoptions/).[`imageSmoothingEnabled`](/api/interfaces/staticcanvasoptions/#imagesmoothingenabled)

***

### includeDefaultValues

> **includeDefaultValues**: `boolean`

Defined in: [src/canvas/StaticCanvasOptions.ts:105](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/StaticCanvasOptions.ts#L105)

Indicates whether toObject/toDatalessObject should include default values
if set to false, takes precedence over the object value.

#### Inherited from

[`StaticCanvasOptions`](/api/interfaces/staticcanvasoptions/).[`includeDefaultValues`](/api/interfaces/staticcanvasoptions/#includedefaultvalues)

***

### moveCursor

> **moveCursor**: `string`

Defined in: [src/canvas/CanvasOptions.ts:142](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L142)

Default cursor value used when moving an object on canvas

#### Default

```ts
move
```

#### Inherited from

`CanvasCursorOptions.moveCursor`

***

### notAllowedCursor

> **notAllowedCursor**: `string`

Defined in: [src/canvas/CanvasOptions.ts:164](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L164)

Cursor value used for disabled elements ( corners with disabled action )

#### Since

2.0.0

#### Default

```ts
not-allowed
```

#### Inherited from

`CanvasCursorOptions.notAllowedCursor`

***

### overlayColor

> **overlayColor**: `string` \| [`TFiller`](/api/type-aliases/tfiller/)

Defined in: [src/canvas/StaticCanvasOptions.ts:42](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/StaticCanvasOptions.ts#L42)

Overlay color of canvas instance.

#### Since

1.3.9

#### Inherited from

[`StaticCanvasOptions`](/api/interfaces/staticcanvasoptions/).[`overlayColor`](/api/interfaces/staticcanvasoptions/#overlaycolor)

***

### overlayImage?

> `optional` **overlayImage**: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

Defined in: [src/canvas/StaticCanvasOptions.ts:51](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/StaticCanvasOptions.ts#L51)

Overlay image of canvas instance.
since 2.4.0 image caching is active, please when putting an image as overlay, add to the
canvas property a reference to the canvas it is on. Otherwise the image cannot detect the zoom
vale. As an alternative you can disable image objectCaching

#### Inherited from

[`StaticCanvasOptions`](/api/interfaces/staticcanvasoptions/).[`overlayImage`](/api/interfaces/staticcanvasoptions/#overlayimage)

***

### overlayVpt

> **overlayVpt**: `boolean`

Defined in: [src/canvas/StaticCanvasOptions.ts:35](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/StaticCanvasOptions.ts#L35)

if set to false overlay image is not affected by viewport transform

#### Since

1.6.3

#### Todo

we should really find a different way to do this

#### Inherited from

[`StaticCanvasOptions`](/api/interfaces/staticcanvasoptions/).[`overlayVpt`](/api/interfaces/staticcanvasoptions/#overlayvpt)

***

### perPixelTargetFind

> **perPixelTargetFind**: `boolean`

Defined in: [src/canvas/CanvasOptions.ts:172](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L172)

When true, object detection happens on per-pixel basis rather than on per-bounding-box

#### Inherited from

`TargetFindOptions.perPixelTargetFind`

***

### preserveObjectStacking

> **preserveObjectStacking**: `boolean`

Defined in: [src/canvas/CanvasOptions.ts:249](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L249)

Indicates whether objects should remain in current stack position when selected.
When false objects are brought to top and rendered as part of the selection group

#### Default

```ts
true
```

***

### renderOnAddRemove

> **renderOnAddRemove**: `boolean`

Defined in: [src/canvas/StaticCanvasOptions.ts:64](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/StaticCanvasOptions.ts#L64)

Indicates whether [StaticCanvas#add](/api/classes/staticcanvas/#add), [StaticCanvas#insertAt](/api/classes/staticcanvas/#insertat) and StaticCanvas#remove,
StaticCanvas#moveTo, [StaticCanvas#clear](/api/classes/staticcanvas/#clear) and many more, should also re-render canvas.
Disabling this option will not give a performance boost when adding/removing a lot of objects to/from canvas at once
since the renders are queued and executed one per frame.
Disabling is suggested anyway and managing the renders of the app manually is not a big effort ( canvas.requestRenderAll() )
Left default to true to do not break documentation and old app, fiddles.

#### Inherited from

[`StaticCanvasOptions`](/api/interfaces/staticcanvasoptions/).[`renderOnAddRemove`](/api/interfaces/staticcanvasoptions/#renderonaddremove)

***

### selection

> **selection**: `boolean`

Defined in: [src/canvas/CanvasOptions.ts:69](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L69)

Indicates whether group selection should be enabled

#### Inherited from

`CanvasSelectionOptions.selection`

***

### selectionBorderColor

> **selectionBorderColor**: `string`

Defined in: [src/canvas/CanvasOptions.ts:114](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L114)

Color of the border of selection (usually slightly darker than color of selection itself)

#### Inherited from

`CanvasSelectionOptions.selectionBorderColor`

***

### selectionColor

> **selectionColor**: `string`

Defined in: [src/canvas/CanvasOptions.ts:101](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L101)

Color of selection

#### Inherited from

`CanvasSelectionOptions.selectionColor`

***

### selectionDashArray

> **selectionDashArray**: `number`[]

Defined in: [src/canvas/CanvasOptions.ts:108](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L108)

Default dash array pattern
If not empty the selection border is dashed

#### Inherited from

`CanvasSelectionOptions.selectionDashArray`

***

### selectionFullyContained

> **selectionFullyContained**: `boolean`

Defined in: [src/canvas/CanvasOptions.ts:126](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L126)

Select only shapes that are fully contained in the dragged selection rectangle.

#### Inherited from

`CanvasSelectionOptions.selectionFullyContained`

***

### selectionKey

> **selectionKey**: [`TOptionalModifierKey`](/api/type-aliases/toptionalmodifierkey/) \| (`"altKey"` \| `"ctrlKey"` \| `"metaKey"` \| `"shiftKey"`)[]

Defined in: [src/canvas/CanvasOptions.ts:80](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L80)

Indicates which key or keys enable multiple click selection
Pass value as a string or array of strings
values: 'altKey', 'shiftKey', 'ctrlKey'.
If `null` or empty or containing any other string that is not a modifier key
feature is disabled.

#### Since

1.6.2

#### Inherited from

`CanvasSelectionOptions.selectionKey`

***

### selectionLineWidth

> **selectionLineWidth**: `number`

Defined in: [src/canvas/CanvasOptions.ts:120](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L120)

Width of a line used in object/group selection

#### Inherited from

`CanvasSelectionOptions.selectionLineWidth`

***

### skipOffscreen

> **skipOffscreen**: `boolean`

Defined in: [src/canvas/StaticCanvasOptions.ts:75](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/StaticCanvasOptions.ts#L75)

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

[`StaticCanvasOptions`](/api/interfaces/staticcanvasoptions/).[`skipOffscreen`](/api/interfaces/staticcanvasoptions/#skipoffscreen)

***

### skipTargetFind

> **skipTargetFind**: `boolean`

Defined in: [src/canvas/CanvasOptions.ts:188](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L188)

When true, target detection is skipped. Target detection will return always undefined.
click selection won't work anymore, events will fire with no targets.
if something is selected before setting it to true, it will be deselected at the first click.
area selection will still work. check the `selection` property too.
if you deactivate both, you should look into staticCanvas.

#### Inherited from

`TargetFindOptions.skipTargetFind`

***

### ~~stopContextMenu~~

> **stopContextMenu**: `boolean`

Defined in: [src/canvas/CanvasOptions.ts:200](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L200)

Indicates if the right click on canvas can output the context menu or not
The default value changed from false to true in Fabric 7.0

:::caution[Deprecated]
since 7.0, Will be removed in Fabric 8.0
:::

#### See

https://fabricjs.com/docs/upgrading/upgrading-to-fabric-70/

#### Since

1.6.5

#### Inherited from

`CanvasEventsOptions.stopContextMenu`

***

### svgViewportTransformation

> **svgViewportTransformation**: `boolean`

Defined in: [src/canvas/StaticCanvasOptions.ts:112](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/StaticCanvasOptions.ts#L112)

When true, getSvgTransform() will apply the StaticCanvas.viewportTransform to the SVG transformation. When true,
a zoomed canvas will then produce zoomed SVG output.

#### Inherited from

[`StaticCanvasOptions`](/api/interfaces/staticcanvasoptions/).[`svgViewportTransformation`](/api/interfaces/staticcanvasoptions/#svgviewporttransformation)

***

### targetFindTolerance

> **targetFindTolerance**: `number`

Defined in: [src/canvas/CanvasOptions.ts:178](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L178)

Number of pixels around target pixel to tolerate (consider active) during object detection

#### Inherited from

`TargetFindOptions.targetFindTolerance`

***

### uniformScaling

> **uniformScaling**: `boolean`

Defined in: [src/canvas/CanvasOptions.ts:12](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L12)

When true, objects can be transformed by one side (unproportionately)
when dragged on the corners that normally would not do that.

#### Since

fabric 4.0 // changed name and default value

#### Inherited from

`CanvasTransformOptions.uniformScaling`

***

### uniScaleKey

> **uniScaleKey**: [`TOptionalModifierKey`](/api/type-aliases/toptionalmodifierkey/)

Defined in: [src/canvas/CanvasOptions.ts:25](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/CanvasOptions.ts#L25)

Indicates which key switches uniform scaling.
values: 'altKey', 'shiftKey', 'ctrlKey'.
If `null` or 'none' or any other string that is not a modifier key
feature is disabled.
totally wrong named. this sounds like `uniform scaling`
if Canvas.uniformScaling is true, pressing this will set it to false
and viceversa.

#### Since

1.6.2

#### Inherited from

`CanvasTransformOptions.uniScaleKey`

***

### viewportTransform

> **viewportTransform**: [`TMat2D`](/api/type-aliases/tmat2d/)

Defined in: [src/canvas/StaticCanvasOptions.ts:160](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/StaticCanvasOptions.ts#L160)

The transformation (a Canvas 2D API transform matrix) which focuses the viewport

#### Examples

```ts
canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
```

```ts
canvas.viewportTransform = [0.7, 0, 0, 0.7, 50, 50];
```

#### Inherited from

[`StaticCanvasOptions`](/api/interfaces/staticcanvasoptions/).[`viewportTransform`](/api/interfaces/staticcanvasoptions/#viewporttransform)

***

### width

> **width**: `number`

Defined in: [src/canvas/StaticCanvasOptions.ts:124](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/canvas/StaticCanvasOptions.ts#L124)

Width in virtual/logical pixels of the canvas.
The canvas can be larger than width if retina scaling is active

#### Inherited from

[`StaticCanvasOptions`](/api/interfaces/staticcanvasoptions/).[`width`](/api/interfaces/staticcanvasoptions/#width)
