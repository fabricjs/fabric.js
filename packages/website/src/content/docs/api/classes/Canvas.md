---
editUrl: false
next: false
prev: false
title: "Canvas"
---

Defined in: [src/canvas/Canvas.ts:73](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/Canvas.ts#L73)

## Extends

- `SelectableCanvas`

## Implements

- [`CanvasOptions`](/api/interfaces/canvasoptions/)

## Constructors

### Constructor

> **new Canvas**(`el?`, `options?`): `Canvas`

Defined in: [src/canvas/Canvas.ts:123](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/Canvas.ts#L123)

#### Parameters

##### el?

`string` | `HTMLCanvasElement`

##### options?

`TCanvasOptions` = `{}`

#### Returns

`Canvas`

#### Overrides

`SelectableCanvas.constructor`

## Properties

### \_activeObject?

> `optional` **\_activeObject**: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

Defined in: [src/canvas/SelectableCanvas.ts:333](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L333)

#### Inherited from

`SelectableCanvas._activeObject`

***

### \_objects

> **\_objects**: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]

Defined in: [src/canvas/SelectableCanvas.ts:178](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L178)

#### TODO

needs to end up in the constructor too

#### Inherited from

`SelectableCanvas._objects`

***

### \_offset

> **\_offset**: `object`

Defined in: [src/canvas/StaticCanvas.ts:166](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L166)

#### left

> **left**: `number`

#### top

> **top**: `number`

#### Inherited from

`SelectableCanvas._offset`

***

### allowTouchScrolling

> **allowTouchScrolling**: `boolean`

Defined in: [src/canvas/StaticCanvas.ts:130](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L130)

#### Todo

move to Canvas

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`allowTouchScrolling`](/api/interfaces/canvasoptions/#allowtouchscrolling)

#### Inherited from

`SelectableCanvas.allowTouchScrolling`

***

### altActionKey

> **altActionKey**: [`TOptionalModifierKey`](/api/type-aliases/toptionalmodifierkey/)

Defined in: [src/canvas/SelectableCanvas.ts:186](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L186)

Indicates which key enable alternate action on corner
values: 'altKey', 'shiftKey', 'ctrlKey'.
If `null` or 'none' or any other string that is not a modifier key
feature is disabled feature disabled.

#### Since

1.6.2

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`altActionKey`](/api/interfaces/canvasoptions/#altactionkey)

#### Inherited from

`SelectableCanvas.altActionKey`

***

### altSelectionKey

> **altSelectionKey**: [`TOptionalModifierKey`](/api/type-aliases/toptionalmodifierkey/)

Defined in: [src/canvas/SelectableCanvas.ts:191](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L191)

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

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`altSelectionKey`](/api/interfaces/canvasoptions/#altselectionkey)

#### Inherited from

`SelectableCanvas.altSelectionKey`

***

### backgroundColor

> **backgroundColor**: `string` \| [`TFiller`](/api/type-aliases/tfiller/)

Defined in: [src/canvas/StaticCanvas.ts:105](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L105)

Background color of canvas instance.

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`backgroundColor`](/api/interfaces/canvasoptions/#backgroundcolor)

#### Inherited from

`SelectableCanvas.backgroundColor`

***

### backgroundImage?

> `optional` **backgroundImage**: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

Defined in: [src/canvas/StaticCanvas.ts:106](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L106)

Background image of canvas instance.
since 2.4.0 image caching is active, please when putting an image as background, add to the
canvas property a reference to the canvas it is on. Otherwise the image cannot detect the zoom
vale. As an alternative you can disable image objectCaching

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`backgroundImage`](/api/interfaces/canvasoptions/#backgroundimage)

#### Inherited from

`SelectableCanvas.backgroundImage`

***

### backgroundVpt

> **backgroundVpt**: `boolean`

Defined in: [src/canvas/StaticCanvas.ts:104](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L104)

if set to false background image is not affected by viewport transform

#### Since

1.6.3

#### Todo

we should really find a different way to do this

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`backgroundVpt`](/api/interfaces/canvasoptions/#backgroundvpt)

#### Inherited from

`SelectableCanvas.backgroundVpt`

***

### centeredKey

> **centeredKey**: [`TOptionalModifierKey`](/api/type-aliases/toptionalmodifierkey/)

Defined in: [src/canvas/SelectableCanvas.ts:185](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L185)

Indicates which key enable centered Transform
values: 'altKey', 'shiftKey', 'ctrlKey'.
If `null` or 'none' or any other string that is not a modifier key
feature is disabled feature disabled.

#### Since

1.6.2

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`centeredKey`](/api/interfaces/canvasoptions/#centeredkey)

#### Inherited from

`SelectableCanvas.centeredKey`

***

### centeredRotation

> **centeredRotation**: `boolean`

Defined in: [src/canvas/SelectableCanvas.ts:184](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L184)

When true, objects use center point as the origin of rotate transformation.
<b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).

#### Since

1.3.4

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`centeredRotation`](/api/interfaces/canvasoptions/#centeredrotation)

#### Inherited from

`SelectableCanvas.centeredRotation`

***

### centeredScaling

> **centeredScaling**: `boolean`

Defined in: [src/canvas/SelectableCanvas.ts:183](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L183)

When true, objects use center point as the origin of scale transformation.
<b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).

#### Since

1.3.4

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`centeredScaling`](/api/interfaces/canvasoptions/#centeredscaling)

#### Inherited from

`SelectableCanvas.centeredScaling`

***

### clipPath?

> `optional` **clipPath**: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

Defined in: [src/canvas/StaticCanvas.ts:112](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L112)

a fabricObject that, without stroke define a clipping area with their shape. filled in black
the clipPath object gets used when the canvas has rendered, and the context is placed in the
top left corner of the canvas.
clipPath will clip away controls, if you do not want this to happen use controlsAboveOverlay = true

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`clipPath`](/api/interfaces/canvasoptions/#clippath)

#### Inherited from

`SelectableCanvas.clipPath`

***

### ~~containerClass~~

> **containerClass**: `string`

Defined in: [src/canvas/SelectableCanvas.ts:205](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L205)

Default element class that's given to wrapper (div) element of canvas

:::caution[Deprecated]
customize [CanvasDOMManager](/api/classes/canvasdommanager/) instead or access [elements](/api/classes/canvas/#elements) directly
:::

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`containerClass`](/api/interfaces/canvasoptions/#containerclass)

#### Inherited from

`SelectableCanvas.containerClass`

***

### controlsAboveOverlay

> **controlsAboveOverlay**: `boolean`

Defined in: [src/canvas/StaticCanvas.ts:125](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L125)

#### Todo

move to Canvas

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`controlsAboveOverlay`](/api/interfaces/canvasoptions/#controlsaboveoverlay)

#### Inherited from

`SelectableCanvas.controlsAboveOverlay`

***

### defaultCursor

> **defaultCursor**: `string`

Defined in: [src/canvas/SelectableCanvas.ts:201](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L201)

Default cursor value used for the entire canvas

#### Default

```ts
default
```

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`defaultCursor`](/api/interfaces/canvasoptions/#defaultcursor)

#### Inherited from

`SelectableCanvas.defaultCursor`

***

### destroyed?

> `optional` **destroyed**: `boolean`

Defined in: [src/canvas/StaticCanvas.ts:157](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L157)

If true the Canvas is in the process or has been disposed/destroyed.
No more rendering operation will be executed on this canvas.

#### Inherited from

`SelectableCanvas.destroyed`

***

### disposed?

> `optional` **disposed**: `boolean`

Defined in: [src/canvas/StaticCanvas.ts:164](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L164)

Started the process of disposing but not done yet.
WIll likely complete the render cycle already scheduled but stopping adding more.

#### Inherited from

`SelectableCanvas.disposed`

***

### elements

> **elements**: [`CanvasDOMManager`](/api/classes/canvasdommanager/)

Defined in: [src/canvas/SelectableCanvas.ts:318](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L318)

#### Inherited from

`SelectableCanvas.elements`

***

### enablePointerEvents

> **enablePointerEvents**: `boolean`

Defined in: [src/canvas/Canvas.ts:81](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/Canvas.ts#L81)

When the option is enabled, PointerEvent is used instead of TPointerEvent.

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`enablePointerEvents`](/api/interfaces/canvasoptions/#enablepointerevents)

***

### enableRetinaScaling

> **enableRetinaScaling**: `boolean`

Defined in: [src/canvas/StaticCanvas.ts:119](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L119)

When true, canvas is scaled by devicePixelRatio for better rendering on retina screens

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`enableRetinaScaling`](/api/interfaces/canvasoptions/#enableretinascaling)

#### Inherited from

`SelectableCanvas.enableRetinaScaling`

***

### ~~fireMiddleClick~~

> **fireMiddleClick**: `boolean`

Defined in: [src/canvas/SelectableCanvas.ts:226](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L226)

Indicates if the canvas can fire middle click events
The default value changed from false to true in Fabric 7.0

:::caution[Deprecated]
since 7.0, Will be removed in Fabric 8.0
:::

#### See

https://fabricjs.com/docs/upgrading/upgrading-to-fabric-70/

#### Since

1.7.8

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`fireMiddleClick`](/api/interfaces/canvasoptions/#firemiddleclick)

#### Inherited from

`SelectableCanvas.fireMiddleClick`

***

### ~~fireRightClick~~

> **fireRightClick**: `boolean`

Defined in: [src/canvas/SelectableCanvas.ts:225](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L225)

Indicates if the canvas can fire right click events
The default value changed from false to true in Fabric 7.0

:::caution[Deprecated]
since 7.0, Will be removed in Fabric 8.0
:::

#### See

https://fabricjs.com/docs/upgrading/upgrading-to-fabric-70/

#### Since

1.6.5

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`fireRightClick`](/api/interfaces/canvasoptions/#firerightclick)

#### Inherited from

`SelectableCanvas.fireRightClick`

***

### freeDrawingBrush?

> `optional` **freeDrawingBrush**: [`BaseBrush`](/api/classes/basebrush/)

Defined in: [src/canvas/SelectableCanvas.ts:332](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L332)

#### Inherited from

`SelectableCanvas.freeDrawingBrush`

***

### freeDrawingCursor

> **freeDrawingCursor**: `string`

Defined in: [src/canvas/SelectableCanvas.ts:202](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L202)

Cursor value used during free drawing

#### Default

```ts
crosshair
```

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`freeDrawingCursor`](/api/interfaces/canvasoptions/#freedrawingcursor)

#### Inherited from

`SelectableCanvas.freeDrawingCursor`

***

### height

> **height**: `number`

Defined in: [src/canvas/StaticCanvas.ts:101](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L101)

Height in virtual/logical pixels of the canvas.
The canvas can be taller than width if retina scaling is active

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`height`](/api/interfaces/canvasoptions/#height)

#### Inherited from

`SelectableCanvas.height`

***

### hoverCursor

> **hoverCursor**: `string`

Defined in: [src/canvas/SelectableCanvas.ts:199](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L199)

Default cursor value used when hovering over an object on canvas

#### Default

```ts
move
```

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`hoverCursor`](/api/interfaces/canvasoptions/#hovercursor)

#### Inherited from

`SelectableCanvas.hoverCursor`

***

### imageSmoothingEnabled

> **imageSmoothingEnabled**: `boolean`

Defined in: [src/canvas/StaticCanvas.ts:120](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L120)

Indicates whether this canvas will use image smoothing, this is on by default in browsers

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`imageSmoothingEnabled`](/api/interfaces/canvasoptions/#imagesmoothingenabled)

#### Inherited from

`SelectableCanvas.imageSmoothingEnabled`

***

### includeDefaultValues

> **includeDefaultValues**: `boolean`

Defined in: [src/canvas/StaticCanvas.ts:114](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L114)

Indicates whether toObject/toDatalessObject should include default values
if set to false, takes precedence over the object value.

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`includeDefaultValues`](/api/interfaces/canvasoptions/#includedefaultvalues)

#### Inherited from

`SelectableCanvas.includeDefaultValues`

***

### isDrawingMode

> **isDrawingMode**: `boolean`

Defined in: [src/canvas/SelectableCanvas.ts:219](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L219)

When true, mouse events on canvas (mousedown/mousemove/mouseup) result in free drawing.
After mousedown, mousemove creates a shape,
and then mouseup finalizes it and adds an instance of `fabric.Path` onto canvas.

#### See

[http://fabric5.fabricjs.com/fabric-intro-part-4#free\_drawing](http://fabric5.fabricjs.com/fabric-intro-part-4#free_drawing)

#### Inherited from

`SelectableCanvas.isDrawingMode`

***

### moveCursor

> **moveCursor**: `string`

Defined in: [src/canvas/SelectableCanvas.ts:200](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L200)

Default cursor value used when moving an object on canvas

#### Default

```ts
move
```

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`moveCursor`](/api/interfaces/canvasoptions/#movecursor)

#### Inherited from

`SelectableCanvas.moveCursor`

***

### notAllowedCursor

> **notAllowedCursor**: `string`

Defined in: [src/canvas/SelectableCanvas.ts:203](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L203)

Cursor value used for disabled elements ( corners with disabled action )

#### Since

2.0.0

#### Default

```ts
not-allowed
```

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`notAllowedCursor`](/api/interfaces/canvasoptions/#notallowedcursor)

#### Inherited from

`SelectableCanvas.notAllowedCursor`

***

### overlayColor

> **overlayColor**: `string` \| [`TFiller`](/api/type-aliases/tfiller/)

Defined in: [src/canvas/StaticCanvas.ts:109](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L109)

Overlay color of canvas instance.

#### Since

1.3.9

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`overlayColor`](/api/interfaces/canvasoptions/#overlaycolor)

#### Inherited from

`SelectableCanvas.overlayColor`

***

### overlayImage?

> `optional` **overlayImage**: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

Defined in: [src/canvas/StaticCanvas.ts:110](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L110)

Overlay image of canvas instance.
since 2.4.0 image caching is active, please when putting an image as overlay, add to the
canvas property a reference to the canvas it is on. Otherwise the image cannot detect the zoom
vale. As an alternative you can disable image objectCaching

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`overlayImage`](/api/interfaces/canvasoptions/#overlayimage)

#### Inherited from

`SelectableCanvas.overlayImage`

***

### overlayVpt

> **overlayVpt**: `boolean`

Defined in: [src/canvas/StaticCanvas.ts:108](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L108)

if set to false overlay image is not affected by viewport transform

#### Since

1.6.3

#### Todo

we should really find a different way to do this

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`overlayVpt`](/api/interfaces/canvasoptions/#overlayvpt)

#### Inherited from

`SelectableCanvas.overlayVpt`

***

### patternQuality

> **patternQuality**: `PatternQuality`

Defined in: [src/canvas/StaticCanvas.ts:185](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L185)

Controls the rendering of images under node-canvas.
Has no effects on the browser context.

#### Inherited from

`SelectableCanvas.patternQuality`

***

### perPixelTargetFind

> **perPixelTargetFind**: `boolean`

Defined in: [src/canvas/SelectableCanvas.ts:208](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L208)

When true, object detection happens on per-pixel basis rather than on per-bounding-box

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`perPixelTargetFind`](/api/interfaces/canvasoptions/#perpixeltargetfind)

#### Inherited from

`SelectableCanvas.perPixelTargetFind`

***

### preserveObjectStacking

> **preserveObjectStacking**: `boolean`

Defined in: [src/canvas/SelectableCanvas.ts:221](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L221)

Indicates whether objects should remain in current stack position when selected.
When false objects are brought to top and rendered as part of the selection group

#### Default

```ts
true
```

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`preserveObjectStacking`](/api/interfaces/canvasoptions/#preserveobjectstacking)

#### Inherited from

`SelectableCanvas.preserveObjectStacking`

***

### renderOnAddRemove

> **renderOnAddRemove**: `boolean`

Defined in: [src/canvas/StaticCanvas.ts:117](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L117)

Indicates whether [StaticCanvas#add](/api/classes/staticcanvas/#add), [StaticCanvas#insertAt](/api/classes/staticcanvas/#insertat) and StaticCanvas#remove,
StaticCanvas#moveTo, [StaticCanvas#clear](/api/classes/staticcanvas/#clear) and many more, should also re-render canvas.
Disabling this option will not give a performance boost when adding/removing a lot of objects to/from canvas at once
since the renders are queued and executed one per frame.
Disabling is suggested anyway and managing the renders of the app manually is not a big effort ( canvas.requestRenderAll() )
Left default to true to do not break documentation and old app, fiddles.

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`renderOnAddRemove`](/api/interfaces/canvasoptions/#renderonaddremove)

#### Inherited from

`SelectableCanvas.renderOnAddRemove`

***

### selection

> **selection**: `boolean`

Defined in: [src/canvas/SelectableCanvas.ts:189](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L189)

Indicates whether group selection should be enabled

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`selection`](/api/interfaces/canvasoptions/#selection)

#### Inherited from

`SelectableCanvas.selection`

***

### selectionBorderColor

> **selectionBorderColor**: `string`

Defined in: [src/canvas/SelectableCanvas.ts:194](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L194)

Color of the border of selection (usually slightly darker than color of selection itself)

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`selectionBorderColor`](/api/interfaces/canvasoptions/#selectionbordercolor)

#### Inherited from

`SelectableCanvas.selectionBorderColor`

***

### selectionColor

> **selectionColor**: `string`

Defined in: [src/canvas/SelectableCanvas.ts:192](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L192)

Color of selection

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`selectionColor`](/api/interfaces/canvasoptions/#selectioncolor)

#### Inherited from

`SelectableCanvas.selectionColor`

***

### selectionDashArray

> **selectionDashArray**: `number`[]

Defined in: [src/canvas/SelectableCanvas.ts:193](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L193)

Default dash array pattern
If not empty the selection border is dashed

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`selectionDashArray`](/api/interfaces/canvasoptions/#selectiondasharray)

#### Inherited from

`SelectableCanvas.selectionDashArray`

***

### selectionFullyContained

> **selectionFullyContained**: `boolean`

Defined in: [src/canvas/SelectableCanvas.ts:196](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L196)

Select only shapes that are fully contained in the dragged selection rectangle.

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`selectionFullyContained`](/api/interfaces/canvasoptions/#selectionfullycontained)

#### Inherited from

`SelectableCanvas.selectionFullyContained`

***

### selectionKey

> **selectionKey**: [`TOptionalModifierKey`](/api/type-aliases/toptionalmodifierkey/) \| (`"altKey"` \| `"ctrlKey"` \| `"metaKey"` \| `"shiftKey"`)[]

Defined in: [src/canvas/SelectableCanvas.ts:190](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L190)

Indicates which key or keys enable multiple click selection
Pass value as a string or array of strings
values: 'altKey', 'shiftKey', 'ctrlKey'.
If `null` or empty or containing any other string that is not a modifier key
feature is disabled.

#### Since

1.6.2

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`selectionKey`](/api/interfaces/canvasoptions/#selectionkey)

#### Inherited from

`SelectableCanvas.selectionKey`

***

### selectionLineWidth

> **selectionLineWidth**: `number`

Defined in: [src/canvas/SelectableCanvas.ts:195](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L195)

Width of a line used in object/group selection

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`selectionLineWidth`](/api/interfaces/canvasoptions/#selectionlinewidth)

#### Inherited from

`SelectableCanvas.selectionLineWidth`

***

### skipOffscreen

> **skipOffscreen**: `boolean`

Defined in: [src/canvas/StaticCanvas.ts:118](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L118)

Based on vptCoords and object.aCoords, skip rendering of objects that
are not included in current viewport.
May greatly help in applications with crowded canvas and use of zoom/pan
If One of the corner of the bounding box of the object is on the canvas
the objects get rendered.

#### Default

```ts
true
```

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`skipOffscreen`](/api/interfaces/canvasoptions/#skipoffscreen)

#### Inherited from

`SelectableCanvas.skipOffscreen`

***

### skipTargetFind

> **skipTargetFind**: `boolean`

Defined in: [src/canvas/SelectableCanvas.ts:210](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L210)

When true, target detection is skipped. Target detection will return always undefined.
click selection won't work anymore, events will fire with no targets.
if something is selected before setting it to true, it will be deselected at the first click.
area selection will still work. check the `selection` property too.
if you deactivate both, you should look into staticCanvas.

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`skipTargetFind`](/api/interfaces/canvasoptions/#skiptargetfind)

#### Inherited from

`SelectableCanvas.skipTargetFind`

***

### ~~stopContextMenu~~

> **stopContextMenu**: `boolean`

Defined in: [src/canvas/SelectableCanvas.ts:224](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L224)

Indicates if the right click on canvas can output the context menu or not
The default value changed from false to true in Fabric 7.0

:::caution[Deprecated]
since 7.0, Will be removed in Fabric 8.0
:::

#### See

https://fabricjs.com/docs/upgrading/upgrading-to-fabric-70/

#### Since

1.6.5

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`stopContextMenu`](/api/interfaces/canvasoptions/#stopcontextmenu)

#### Inherited from

`SelectableCanvas.stopContextMenu`

***

### svgViewportTransformation

> **svgViewportTransformation**: `boolean`

Defined in: [src/canvas/StaticCanvas.ts:913](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L913)

When true, getSvgTransform() will apply the StaticCanvas.viewportTransform to the SVG transformation. When true,
a zoomed canvas will then produce zoomed SVG output.

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`svgViewportTransformation`](/api/interfaces/canvasoptions/#svgviewporttransformation)

#### Inherited from

`SelectableCanvas.svgViewportTransformation`

***

### targetFindTolerance

> **targetFindTolerance**: `number`

Defined in: [src/canvas/SelectableCanvas.ts:209](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L209)

Number of pixels around target pixel to tolerate (consider active) during object detection

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`targetFindTolerance`](/api/interfaces/canvasoptions/#targetfindtolerance)

#### Inherited from

`SelectableCanvas.targetFindTolerance`

***

### textEditingManager

> **textEditingManager**: `TextEditingManager`

Defined in: [src/canvas/Canvas.ts:121](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/Canvas.ts#L121)

***

### uniformScaling

> **uniformScaling**: `boolean`

Defined in: [src/canvas/SelectableCanvas.ts:181](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L181)

When true, objects can be transformed by one side (unproportionately)
when dragged on the corners that normally would not do that.

#### Since

fabric 4.0 // changed name and default value

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`uniformScaling`](/api/interfaces/canvasoptions/#uniformscaling)

#### Inherited from

`SelectableCanvas.uniformScaling`

***

### uniScaleKey

> **uniScaleKey**: [`TOptionalModifierKey`](/api/type-aliases/toptionalmodifierkey/)

Defined in: [src/canvas/SelectableCanvas.ts:182](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L182)

Indicates which key switches uniform scaling.
values: 'altKey', 'shiftKey', 'ctrlKey'.
If `null` or 'none' or any other string that is not a modifier key
feature is disabled.
totally wrong named. this sounds like `uniform scaling`
if Canvas.uniformScaling is true, pressing this will set it to false
and viceversa.

#### Since

1.6.2

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`uniScaleKey`](/api/interfaces/canvasoptions/#uniscalekey)

#### Inherited from

`SelectableCanvas.uniScaleKey`

***

### viewportTransform

> **viewportTransform**: [`TMat2D`](/api/type-aliases/tmat2d/)

Defined in: [src/canvas/StaticCanvas.ts:132](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L132)

The transformation (a Canvas 2D API transform matrix) which focuses the viewport

#### Examples

```ts
canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
```

```ts
canvas.viewportTransform = [0.7, 0, 0, 0.7, 50, 50];
```

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`viewportTransform`](/api/interfaces/canvasoptions/#viewporttransform)

#### Inherited from

`SelectableCanvas.viewportTransform`

***

### vptCoords

> **vptCoords**: [`TCornerPoint`](/api/type-aliases/tcornerpoint/)

Defined in: [src/canvas/StaticCanvas.ts:137](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L137)

The viewport bounding box in scene plane coordinates, see [calcViewportBoundaries](/api/classes/canvas/#calcviewportboundaries)

#### Inherited from

`SelectableCanvas.vptCoords`

***

### width

> **width**: `number`

Defined in: [src/canvas/StaticCanvas.ts:100](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L100)

Width in virtual/logical pixels of the canvas.
The canvas can be larger than width if retina scaling is active

#### Implementation of

[`CanvasOptions`](/api/interfaces/canvasoptions/).[`width`](/api/interfaces/canvasoptions/#width)

#### Inherited from

`SelectableCanvas.width`

***

### ownDefaults

> `static` **ownDefaults**: [`TOptions`](/api/type-aliases/toptions/)\<[`CanvasOptions`](/api/interfaces/canvasoptions/)\> = `canvasDefaults`

Defined in: [src/canvas/SelectableCanvas.ts:312](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L312)

#### Inherited from

`SelectableCanvas.ownDefaults`

## Accessors

### contextContainer

#### Get Signature

> **get** **contextContainer**(): `CanvasRenderingContext2D`

Defined in: [src/canvas/StaticCanvas.ts:148](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L148)

##### Returns

`CanvasRenderingContext2D`

#### Inherited from

`SelectableCanvas.contextContainer`

***

### contextTop

#### Get Signature

> **get** **contextTop**(): `CanvasRenderingContext2D`

Defined in: [src/canvas/SelectableCanvas.ts:322](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L322)

##### Returns

`CanvasRenderingContext2D`

#### Inherited from

`SelectableCanvas.contextTop`

***

### lowerCanvasEl

#### Get Signature

> **get** **lowerCanvasEl**(): `HTMLCanvasElement`

Defined in: [src/canvas/StaticCanvas.ts:144](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L144)

A reference to the canvas actual HTMLCanvasElement.
Can be use to read the raw pixels, but never write or manipulate

##### Returns

`HTMLCanvasElement`

#### Inherited from

`SelectableCanvas.lowerCanvasEl`

***

### upperCanvasEl

#### Get Signature

> **get** **upperCanvasEl**(): `HTMLCanvasElement`

Defined in: [src/canvas/SelectableCanvas.ts:319](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L319)

##### Returns

`HTMLCanvasElement`

#### Inherited from

`SelectableCanvas.upperCanvasEl`

***

### wrapperEl

#### Get Signature

> **get** **wrapperEl**(): `HTMLDivElement`

Defined in: [src/canvas/SelectableCanvas.ts:325](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L325)

##### Returns

`HTMLDivElement`

#### Inherited from

`SelectableCanvas.wrapperEl`

## Methods

### \_basicEventHandler()

> **\_basicEventHandler**\<`T`\>(`eventType`, `options`): [`CanvasEvents`](/api/interfaces/canvasevents/) & [`ObjectEvents`](/api/interfaces/objectevents/)\[`T`\]

Defined in: [src/canvas/Canvas.ts:923](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/Canvas.ts#L923)

#### Type Parameters

##### T

`T` *extends* `"rotate"` \| `"contextmenu"` \| `"drag"` \| `"dragend"` \| `"dragenter"` \| `"dragleave"` \| `"dragover"` \| `"dragstart"` \| `"drop"` \| `"pinch"` \| `"erasing:end"` \| `"before:render"` \| `"drop:before"` \| `"drop:after"` \| `"contextmenu:before"`

#### Parameters

##### eventType

`T`

##### options

[`CanvasEvents`](/api/interfaces/canvasevents/) & [`ObjectEvents`](/api/interfaces/objectevents/)\[`T`\]

#### Returns

[`CanvasEvents`](/api/interfaces/canvasevents/) & [`ObjectEvents`](/api/interfaces/objectevents/)\[`T`\]

***

### \_chooseObjectsToRender()

> **\_chooseObjectsToRender**(): [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]

Defined in: [src/canvas/SelectableCanvas.ts:384](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L384)

Divides objects in two groups, one to render immediately
and one to render as activeGroup.

#### Returns

[`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]

objects to render immediately and pushes the other in the activeGroup.

#### Inherited from

`SelectableCanvas._chooseObjectsToRender`

***

### \_discardActiveObject()

> **\_discardActiveObject**(`e?`, `object?`): `this is { _activeObject: undefined }`

Defined in: [src/canvas/SelectableCanvas.ts:1285](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L1285)

This is supposed to be equivalent to discardActiveObject but without firing
any selection events ( can still fire object transformation events ). There is commitment to have this stay this way.
This is the functional part of discardActiveObject.

#### Parameters

##### e?

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

Event (passed along when firing "object:deselected")

##### object?

[`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

the next object to set as active, reason why we are discarding this

#### Returns

`this is { _activeObject: undefined }`

true if the active object has been discarded

#### Inherited from

`SelectableCanvas._discardActiveObject`

***

### \_onStackOrderChanged()

> **\_onStackOrderChanged**(): `void`

Defined in: [src/canvas/SelectableCanvas.ts:374](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L374)

#### Returns

`void`

#### Inherited from

`SelectableCanvas._onStackOrderChanged`

***

### \_set()

> **\_set**(`key`, `value`): `void`

Defined in: [src/CommonMethods.ts:38](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/CommonMethods.ts#L38)

#### Parameters

##### key

`string`

##### value

`any`

#### Returns

`void`

#### Inherited from

`SelectableCanvas._set`

***

### \_setActiveObject()

> **\_setActiveObject**(`object`, `e?`): `boolean`

Defined in: [src/canvas/SelectableCanvas.ts:1253](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L1253)

This is supposed to be equivalent to setActiveObject but without firing
any event. There is commitment to have this stay this way.
This is the functional part of setActiveObject.

#### Parameters

##### object

[`FabricObject`](/api/classes/fabricobject/)

to set as active

##### e?

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

Event (passed along when firing "object:selected")

#### Returns

`boolean`

true if the object has been selected

#### Inherited from

`SelectableCanvas._setActiveObject`

***

### \_setCursorFromEvent()

> **\_setCursorFromEvent**(`e`, `target?`): `void`

Defined in: [src/canvas/Canvas.ts:1400](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/Canvas.ts#L1400)

Sets the cursor depending on where the canvas is being hovered.
Note: very buggy in Opera

#### Parameters

##### e

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

Event object

##### target?

[`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

Object that the mouse is hovering, if so.

#### Returns

`void`

***

### absolutePan()

> **absolutePan**(`point`): `void`

Defined in: [src/canvas/StaticCanvas.ts:404](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L404)

Pan viewport so as to place point at top left corner of canvas

#### Parameters

##### point

[`Point`](/api/classes/point/)

to move to

#### Returns

`void`

#### Inherited from

`SelectableCanvas.absolutePan`

***

### add()

> **add**(...`objects`): `number`

Defined in: [src/canvas/StaticCanvas.ts:223](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L223)

Adds objects to collection
Objects should be instances of (or inherit from) FabricObject

#### Parameters

##### objects

...[`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]

to add

#### Returns

`number`

new array length

#### Inherited from

`SelectableCanvas.add`

***

### addOrRemove()

> **addOrRemove**(`functor`, `forTouch`): `void`

Defined in: [src/canvas/Canvas.ts:168](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/Canvas.ts#L168)

#### Parameters

##### functor

`any`

##### forTouch

`boolean` = `false`

#### Returns

`void`

***

### bringObjectForward()

> **bringObjectForward**(`object`, `intersecting?`): `boolean`

Defined in: [src/Collection.ts:240](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Collection.ts#L240)

Moves an object or a selection up in stack of drawn objects
An optional parameter, intersecting allows to move the object in front
of the first intersecting object. Where intersection is calculated with
bounding box. If no intersection is found, there will not be change in the
stack.

#### Parameters

##### object

[`FabricObject`](/api/classes/fabricobject/)

Object to send

##### intersecting?

`boolean`

If `true`, send object in front of next upper intersecting object

#### Returns

`boolean`

true if change occurred

#### Inherited from

`SelectableCanvas.bringObjectForward`

***

### bringObjectToFront()

> **bringObjectToFront**(`object`): `boolean`

Defined in: [src/Collection.ts:194](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Collection.ts#L194)

Moves an object or the objects of a multiple selection
to the top of the stack of drawn objects

#### Parameters

##### object

[`FabricObject`](/api/classes/fabricobject/)

Object to send

#### Returns

`boolean`

true if change occurred

#### Inherited from

`SelectableCanvas.bringObjectToFront`

***

### calcOffset()

> **calcOffset**(): `object`

Defined in: [src/canvas/StaticCanvas.ts:279](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L279)

Calculates canvas element offset relative to the document
This method is also attached as "resize" event handler of window

#### Returns

`object`

##### left

> **left**: `number` = `0`

##### top

> **top**: `number` = `0`

#### Inherited from

`SelectableCanvas.calcOffset`

***

### calcViewportBoundaries()

> **calcViewportBoundaries**(): [`TCornerPoint`](/api/type-aliases/tcornerpoint/)

Defined in: [src/canvas/StaticCanvas.ts:501](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L501)

Calculate the position of the 4 corner of canvas with current viewportTransform.
helps to determinate when an object is in the current rendering viewport

#### Returns

[`TCornerPoint`](/api/type-aliases/tcornerpoint/)

#### Inherited from

`SelectableCanvas.calcViewportBoundaries`

***

### cancelRequestedRender()

> **cancelRequestedRender**(): `void`

Defined in: [src/canvas/StaticCanvas.ts:519](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L519)

#### Returns

`void`

#### Inherited from

`SelectableCanvas.cancelRequestedRender`

***

### centerObject()

> **centerObject**(`object`): `void`

Defined in: [src/canvas/StaticCanvas.ts:716](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L716)

Centers object vertically and horizontally in the canvas

#### Parameters

##### object

[`FabricObject`](/api/classes/fabricobject/)

Object to center vertically and horizontally

#### Returns

`void`

#### Inherited from

`SelectableCanvas.centerObject`

***

### centerObjectH()

> **centerObjectH**(`object`): `void`

Defined in: [src/canvas/StaticCanvas.ts:694](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L694)

Centers object horizontally in the canvas

#### Parameters

##### object

[`FabricObject`](/api/classes/fabricobject/)

#### Returns

`void`

#### Inherited from

`SelectableCanvas.centerObjectH`

***

### centerObjectV()

> **centerObjectV**(`object`): `void`

Defined in: [src/canvas/StaticCanvas.ts:705](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L705)

Centers object vertically in the canvas

#### Parameters

##### object

[`FabricObject`](/api/classes/fabricobject/)

Object to center vertically

#### Returns

`void`

#### Inherited from

`SelectableCanvas.centerObjectV`

***

### clear()

> **clear**(): `void`

Defined in: [src/canvas/Canvas.ts:1618](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/Canvas.ts#L1618)

clear [textEditingManager](/api/classes/canvas/#texteditingmanager)

#### Returns

`void`

#### Overrides

`SelectableCanvas.clear`

***

### clearContext()

> **clearContext**(`ctx`): `void`

Defined in: [src/canvas/StaticCanvas.ts:436](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L436)

Clears specified context of canvas element

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Context to clear

#### Returns

`void`

#### Inherited from

`SelectableCanvas.clearContext`

***

### clone()

> **clone**(`properties?`): `Promise`\<`Canvas`\>

Defined in: [src/canvas/StaticCanvas.ts:1287](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L1287)

Clones canvas instance

#### Parameters

##### properties?

`string`[]

Array of properties to include in the cloned canvas and children

#### Returns

`Promise`\<`Canvas`\>

#### Inherited from

`SelectableCanvas.clone`

***

### cloneWithoutData()

> **cloneWithoutData**(): `Canvas`

Defined in: [src/canvas/StaticCanvas.ts:1297](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L1297)

Clones canvas instance without cloning existing data.
This essentially copies canvas dimensions since loadFromJSON does not affect canvas size.

#### Returns

`Canvas`

#### Inherited from

`SelectableCanvas.cloneWithoutData`

***

### collectObjects()

> **collectObjects**(`bbox`, `options`): [`InteractiveFabricObject`](/api/classes/interactivefabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]

Defined in: [src/Collection.ts:326](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Collection.ts#L326)

Given a bounding box, return all the objects of the collection that are contained in the bounding box.
If `includeIntersecting` is true, return also the objects that intersect the bounding box as well.
This is meant to work with selection. Is not a generic method.

#### Parameters

##### bbox

[`TBBox`](/api/type-aliases/tbbox/)

a bounding box in scene coordinates

##### options

an object with includeIntersecting

###### includeIntersecting?

`boolean` = `true`

#### Returns

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]

array of objects contained in the bounding box, ordered from top to bottom stacking wise

#### Inherited from

`SelectableCanvas.collectObjects`

***

### complexity()

> **complexity**(): `number`

Defined in: [src/Collection.ts:165](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Collection.ts#L165)

Returns number representation of a collection complexity

#### Returns

`number`

complexity

#### Inherited from

`SelectableCanvas.complexity`

***

### contains()

> **contains**(`object`, `deep?`): `boolean`

Defined in: [src/Collection.ts:148](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Collection.ts#L148)

Returns true if collection contains an object.\
**Prefer using [FabricObject#isDescendantOf](/api/classes/fabricobject/#isdescendantof) for performance reasons**
instead of `a.contains(b)` use `b.isDescendantOf(a)`

#### Parameters

##### object

[`FabricObject`](/api/classes/fabricobject/)

Object to check against

##### deep?

`boolean`

`true` to check all descendants, `false` to check only `_objects`

#### Returns

`boolean`

`true` if collection contains an object

#### Inherited from

`SelectableCanvas.contains`

***

### createSVGClipPathMarkup()

> **createSVGClipPathMarkup**(`options`): `string`

Defined in: [src/canvas/StaticCanvas.ts:1040](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L1040)

#### Parameters

##### options

[`TSVGExportOptions`](/api/type-aliases/tsvgexportoptions/)

#### Returns

`string`

#### Inherited from

`SelectableCanvas.createSVGClipPathMarkup`

***

### createSVGFontFacesMarkup()

> **createSVGFontFacesMarkup**(): `string`

Defined in: [src/canvas/StaticCanvas.ts:1083](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L1083)

Creates markup containing SVG font faces,
font URLs for font faces must be collected by developers
and are not extracted from the DOM by fabricjs

#### Returns

`string`

#### Inherited from

`SelectableCanvas.createSVGFontFacesMarkup`

***

### createSVGRefElementsMarkup()

> **createSVGRefElementsMarkup**(): `string`

Defined in: [src/canvas/StaticCanvas.ts:1055](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L1055)

Creates markup containing SVG referenced elements like patterns, gradients etc.

#### Returns

`string`

#### Inherited from

`SelectableCanvas.createSVGRefElementsMarkup`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/canvas/Canvas.ts:1626](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/Canvas.ts#L1626)

clear [textEditingManager](/api/classes/canvas/#texteditingmanager)

#### Returns

`void`

#### Overrides

`SelectableCanvas.destroy`

***

### discardActiveObject()

> **discardActiveObject**(`e?`): `this is { _activeObject: undefined }`

Defined in: [src/canvas/SelectableCanvas.ts:1315](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L1315)

Discards currently active object and fire events. If the function is called by fabric
as a consequence of a mouse event, the event is passed as a parameter and
sent to the fire function for the custom events. When used as a method the
e param does not have any application.

#### Parameters

##### e?

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

#### Returns

`this is { _activeObject: undefined }`

true if the active object has been discarded

#### Inherited from

`SelectableCanvas.discardActiveObject`

***

### dispose()

> **dispose**(): `Promise`\<`boolean`\>

Defined in: [src/canvas/StaticCanvas.ts:1431](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L1431)

Waits until rendering has settled to destroy the canvas

#### Returns

`Promise`\<`boolean`\>

a promise resolving to `true` once the canvas has been destroyed or to `false` if the canvas has was already destroyed

#### Throws

if aborted by a consequent call

#### Inherited from

`SelectableCanvas.dispose`

***

### drawClipPathOnCanvas()

> **drawClipPathOnCanvas**(`ctx`, `clipPath`): `void`

Defined in: [src/canvas/StaticCanvas.ts:583](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L583)

Paint the cached clipPath on the lowerCanvasEl

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Context to render on

##### clipPath

`TCachedFabricObject`

#### Returns

`void`

#### Inherited from

`SelectableCanvas.drawClipPathOnCanvas`

***

### drawControls()

> **drawControls**(`ctx`): `void`

Defined in: [src/canvas/SelectableCanvas.ts:1423](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L1423)

Draws objects' controls (borders/controls)

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Context to render controls on

#### Returns

`void`

#### Inherited from

`SelectableCanvas.drawControls`

***

### endCurrentTransform()

> **endCurrentTransform**(`e?`): `void`

Defined in: [src/canvas/SelectableCanvas.ts:1335](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L1335)

End the current transform.
You don't usually need to call this method unless you are interrupting a user initiated transform
because of some other event ( a press of key combination, or something that block the user UX )

#### Parameters

##### e?

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

send the mouse event that generate the finalize down, so it can be used in the event

#### Returns

`void`

#### Inherited from

`SelectableCanvas.endCurrentTransform`

***

### findNewLowerIndex()

> **findNewLowerIndex**(`object`, `idx`, `intersecting?`): `number`

Defined in: [src/Collection.ts:272](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Collection.ts#L272)

#### Parameters

##### object

[`FabricObject`](/api/classes/fabricobject/)

##### idx

`number`

##### intersecting?

`boolean`

#### Returns

`number`

#### Inherited from

`SelectableCanvas.findNewLowerIndex`

***

### findNewUpperIndex()

> **findNewUpperIndex**(`object`, `idx`, `intersecting?`): `number`

Defined in: [src/Collection.ts:295](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Collection.ts#L295)

#### Parameters

##### object

[`FabricObject`](/api/classes/fabricobject/)

##### idx

`number`

##### intersecting?

`boolean`

#### Returns

`number`

#### Inherited from

`SelectableCanvas.findNewUpperIndex`

***

### findTarget()

> **findTarget**(`e`): `FullTargetsInfoWithContainer`

Defined in: [src/canvas/SelectableCanvas.ts:760](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L760)

This function is in charge of deciding which is the object that is the current target of an interaction event.
For interaction event we mean a pointer related action on the canvas.
Which is the
11/09/2018 TODO: would be cool if findTarget could discern between being a full target
or the outside part of the corner.

#### Parameters

##### e

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

mouse event

#### Returns

`FullTargetsInfoWithContainer`

the target found

#### Inherited from

`SelectableCanvas.findTarget`

***

### fire()

> **fire**\<`K`\>(`eventName`, `options?`): `void`

Defined in: [src/Observable.ts:167](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Observable.ts#L167)

Fires event with an optional options object

#### Type Parameters

##### K

`K` *extends* keyof [`CanvasEvents`](/api/interfaces/canvasevents/)

#### Parameters

##### eventName

`K`

Event name to fire

##### options?

[`CanvasEvents`](/api/interfaces/canvasevents/)\[`K`\]

Options object

#### Returns

`void`

#### Inherited from

`SelectableCanvas.fire`

***

### fireEventFromPointerEvent()

> **fireEventFromPointerEvent**(`e`, `eventName`, `secondaryName`, `extraData`): `void`

Defined in: [src/canvas/Canvas.ts:549](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/Canvas.ts#L549)

This supports gesture event firing
It is a method to keep some code organized, it exposes private methods
in a way that works and still keep them private
This is supposed to mirror _handleEvent

#### Parameters

##### e

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

##### eventName

keyof [`CanvasEvents`](/api/interfaces/canvasevents/)

##### secondaryName

keyof [`ObjectEvents`](/api/interfaces/objectevents/)

##### extraData

`Record`\<`string`, `unknown`\> | \{ `rotation`: `number`; \} | \{ `ping`: `number`; \}

#### Returns

`void`

***

### forEachObject()

> **forEachObject**(`callback`): `void`

Defined in: [src/Collection.ts:91](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Collection.ts#L91)

Executes given function for each object in this group
A simple shortcut for getObjects().forEach, before es6 was more complicated,
now is just a shortcut.

#### Parameters

##### callback

(`object`, `index`, `array`) => `any`

Callback invoked with current object as first argument,
                  index - as second and an array of all objects - as third.

#### Returns

`void`

#### Inherited from

`SelectableCanvas.forEachObject`

***

### get()

> **get**(`property`): `any`

Defined in: [src/CommonMethods.ts:59](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/CommonMethods.ts#L59)

Basic getter

#### Parameters

##### property

`string`

Property name

#### Returns

`any`

value of a property

#### Inherited from

`SelectableCanvas.get`

***

### getActiveObject()

> **getActiveObject**(): `undefined` \| [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

Defined in: [src/canvas/SelectableCanvas.ts:1155](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L1155)

Returns currently active object

#### Returns

`undefined` \| [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

active object

#### Inherited from

`SelectableCanvas.getActiveObject`

***

### getActiveObjects()

> **getActiveObjects**(): [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]

Defined in: [src/canvas/SelectableCanvas.ts:1163](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L1163)

Returns an array with the current selected objects

#### Returns

[`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]

active objects array

#### Inherited from

`SelectableCanvas.getActiveObjects`

***

### getCenterPoint()

> **getCenterPoint**(): [`Point`](/api/classes/point/)

Defined in: [src/canvas/StaticCanvas.ts:687](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L687)

Returns coordinates of a center of canvas.

#### Returns

[`Point`](/api/classes/point/)

#### Inherited from

`SelectableCanvas.getCenterPoint`

***

### getContext()

> **getContext**(): `CanvasRenderingContext2D`

Defined in: [src/canvas/StaticCanvas.ts:444](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L444)

Returns context of canvas where objects are drawn

#### Returns

`CanvasRenderingContext2D`

#### Inherited from

`SelectableCanvas.getContext`

***

### getElement()

> **getElement**(): `HTMLCanvasElement`

Defined in: [src/canvas/StaticCanvas.ts:428](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L428)

Returns &lt;canvas> element corresponding to this instance

#### Returns

`HTMLCanvasElement`

#### Inherited from

`SelectableCanvas.getElement`

***

### getHeight()

> **getHeight**(): `number`

Defined in: [src/canvas/StaticCanvas.ts:295](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L295)

Returns canvas height (in px)

#### Returns

`number`

#### Inherited from

`SelectableCanvas.getHeight`

***

### getObjects()

> **getObjects**(...`types?`): [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]

Defined in: [src/Collection.ts:108](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Collection.ts#L108)

Returns an array of children objects of this instance

#### Parameters

##### types?

...`string`[]

When specified, only objects of these types are returned

#### Returns

[`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]

#### Inherited from

`SelectableCanvas.getObjects`

***

### getScenePoint()

> **getScenePoint**(`e`): [`Point`](/api/classes/point/)

Defined in: [src/canvas/SelectableCanvas.ts:1044](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L1044)

#### Parameters

##### e

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

#### Returns

[`Point`](/api/classes/point/)

point existing in the scene (the same plane as the plane [FabricObject#getCenterPoint](/api/classes/fabricobject/#getcenterpoint) exists in).
This means that changes to the [viewportTransform](/api/classes/staticcanvas/#viewporttransform) do not change the values of the point,
however, from the viewer's perspective, the point is changed.

#### Example

```ts
const viewportPoint = sendPointToPlane(
 this.getScenePoint(e),
 canvas.viewportTransform
);
```

#### Inherited from

`SelectableCanvas.getScenePoint`

***

### getSelectionContext()

> **getSelectionContext**(): `CanvasRenderingContext2D`

Defined in: [src/canvas/SelectableCanvas.ts:1139](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L1139)

Returns context of canvas where object selection is drawn

#### Returns

`CanvasRenderingContext2D`

#### Alias

#### Inherited from

`SelectableCanvas.getSelectionContext`

***

### getSelectionElement()

> **getSelectionElement**(): `HTMLCanvasElement`

Defined in: [src/canvas/SelectableCanvas.ts:1147](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L1147)

Returns &lt;canvas> element on which object selection is drawn

#### Returns

`HTMLCanvasElement`

#### Inherited from

`SelectableCanvas.getSelectionElement`

***

### getTopContext()

> **getTopContext**(): `CanvasRenderingContext2D`

Defined in: [src/canvas/SelectableCanvas.ts:1130](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L1130)

Returns context of top canvas where interactions are drawn

#### Returns

`CanvasRenderingContext2D`

#### Inherited from

`SelectableCanvas.getTopContext`

***

### getViewportPoint()

> **getViewportPoint**(`e`): [`Point`](/api/classes/point/)

Defined in: [src/canvas/SelectableCanvas.ts:1025](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L1025)

#### Parameters

##### e

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

#### Returns

[`Point`](/api/classes/point/)

point existing in the same plane as the HTMLCanvasElement,
`(0, 0)` being the top left corner of the HTMLCanvasElement.
This means that changes to the [viewportTransform](/api/classes/staticcanvas/#viewporttransform) do not change the values of the point
and it remains unchanged from the viewer's perspective.

#### Example

```ts
const scenePoint = sendPointToPlane(
 this.getViewportPoint(e),
 undefined,
 canvas.viewportTransform
);
```

#### Inherited from

`SelectableCanvas.getViewportPoint`

***

### getVpCenter()

> **getVpCenter**(): [`Point`](/api/classes/point/)

Defined in: [src/canvas/StaticCanvas.ts:754](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L754)

Calculate the point in canvas that correspond to the center of actual viewport.

#### Returns

[`Point`](/api/classes/point/)

vpCenter, viewport center

#### Inherited from

`SelectableCanvas.getVpCenter`

***

### getWidth()

> **getWidth**(): `number`

Defined in: [src/canvas/StaticCanvas.ts:287](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L287)

Returns canvas width (in px)

#### Returns

`number`

#### Inherited from

`SelectableCanvas.getWidth`

***

### getZoom()

> **getZoom**(): `number`

Defined in: [src/canvas/StaticCanvas.ts:357](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L357)

Returns the canvas zoom level as the magnitude of the viewport scale.

#### Returns

`number`

#### Inherited from

`SelectableCanvas.getZoom`

***

### insertAt()

> **insertAt**(`index`, ...`objects`): `number`

Defined in: [src/canvas/StaticCanvas.ts:229](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L229)

Inserts an object into collection at specified index

#### Parameters

##### index

`number`

Index to insert object at

##### objects

...[`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]

Object(s) to insert

#### Returns

`number`

new array length

#### Inherited from

`SelectableCanvas.insertAt`

***

### isEmpty()

> **isEmpty**(): `boolean`

Defined in: [src/Collection.ts:128](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Collection.ts#L128)

Returns true if collection contains no objects

#### Returns

`boolean`

true if collection is empty

#### Inherited from

`SelectableCanvas.isEmpty`

***

### isTargetTransparent()

> **isTargetTransparent**(`target`, `x`, `y`): `boolean`

Defined in: [src/canvas/SelectableCanvas.ts:468](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L468)

Returns true if object is transparent at a certain location
Clarification: this is `is target transparent at location X or are controls there`

#### Parameters

##### target

[`FabricObject`](/api/classes/fabricobject/)

Object to check

##### x

`number`

Left coordinate in viewport space

##### y

`number`

Top coordinate in viewport space

#### Returns

`boolean`

#### TODO

this seems dumb that we treat controls with transparency. we can find controls
programmatically without painting them, the cache canvas optimization is always valid

#### Inherited from

`SelectableCanvas.isTargetTransparent`

***

### item()

> **item**(`index`): [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

Defined in: [src/Collection.ts:120](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Collection.ts#L120)

Returns object at specified index

#### Parameters

##### index

`number`

#### Returns

[`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

object at index

#### Inherited from

`SelectableCanvas.item`

***

### loadFromJSON()

> **loadFromJSON**(`json`, `reviver?`, `options?`): `Promise`\<`Canvas`\>

Defined in: [src/canvas/StaticCanvas.ts:1241](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L1241)

Populates canvas with data from the specified JSON.
JSON format must conform to the one of fabric.Canvas#toJSON

**IMPORTANT**: It is recommended to abort loading tasks before calling this method to prevent race conditions and unnecessary networking

#### Parameters

##### json

JSON string or object

`string` | `Record`\<`string`, `any`\>

##### reviver?

\<`T`\>(`serializedObj`, `instance`, `error?`) => `void` \| `Promise`\<`T`\>

Method for further parsing of JSON elements, called after each fabric object created with the instance
if creation was successfully or with defined error if not. If a FabricObject is returned in the reviver, and an error occurred, this instance will be used in place of that one witch generated error.

##### options?

[`Abortable`](/api/type-aliases/abortable/) = `{}`

options

#### Returns

`Promise`\<`Canvas`\>

instance

#### See

 - [http://fabric5.fabricjs.com/fabric-intro-part-3#deserialization](http://fabric5.fabricjs.com/fabric-intro-part-3#deserialization)
 - [demo](http://jsfiddle.net/fabricjs/fmgXt/|jsFiddle)

#### Examples

```ts
canvas.loadFromJSON(json).then((canvas) => canvas.requestRenderAll());
```

```ts
canvas.loadFromJSON(json, function(o, object, error) {
  // `o` = json object
  // `object` = fabric.Object instance or undefined
  // `error` = FabricError or undefined
  // ... do some stuff ...
  if(error){
     return new FabricText('placeholder-object');
  }
}).then((canvas) => {
  ... canvas is restored, add your code.
});
```

#### Inherited from

`SelectableCanvas.loadFromJSON`

***

### moveObjectTo()

> **moveObjectTo**(`object`, `index`): `boolean`

Defined in: [src/Collection.ts:262](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Collection.ts#L262)

Moves an object to specified level in stack of drawn objects

#### Parameters

##### object

[`FabricObject`](/api/classes/fabricobject/)

Object to send

##### index

`number`

Position to move to

#### Returns

`boolean`

true if change occurred

#### Inherited from

`SelectableCanvas.moveObjectTo`

***

### off()

#### Call Signature

> **off**\<`K`\>(`eventName`): `void`

Defined in: [src/Observable.ts:122](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Observable.ts#L122)

Unsubscribe all event listeners for eventname.
Do not use this pattern. You could kill internal fabricJS events.
We know we should have protected events for internal flows, but we don't have yet

:::caution[Deprecated]
This API is no longer supported and may be removed in a future release.
:::

##### Type Parameters

###### K

`K` *extends* keyof [`CanvasEvents`](/api/interfaces/canvasevents/)

##### Parameters

###### eventName

`K`

event name (eg. 'after:render')

##### Returns

`void`

##### Inherited from

`SelectableCanvas.off`

#### Call Signature

> **off**\<`K`\>(`eventName`, `handler`): `void`

Defined in: [src/Observable.ts:128](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Observable.ts#L128)

unsubscribe an event listener

##### Type Parameters

###### K

`K` *extends* keyof [`CanvasEvents`](/api/interfaces/canvasevents/)

##### Parameters

###### eventName

`K`

event name (eg. 'after:render')

###### handler

`TEventCallback`

event listener to unsubscribe

##### Returns

`void`

##### Inherited from

`SelectableCanvas.off`

#### Call Signature

> **off**(`handlers`): `void`

Defined in: [src/Observable.ts:133](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Observable.ts#L133)

unsubscribe event listeners

##### Parameters

###### handlers

`EventRegistryObject`\<`EventSpec`\>

handlers key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})

##### Returns

`void`

##### Inherited from

`SelectableCanvas.off`

#### Call Signature

> **off**(): `void`

Defined in: [src/Observable.ts:137](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Observable.ts#L137)

unsubscribe all event listeners

##### Returns

`void`

##### Inherited from

`SelectableCanvas.off`

***

### on()

#### Call Signature

> **on**\<`K`, `E`\>(`eventName`, `handler`): `VoidFunction`

Defined in: [src/Observable.ts:23](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Observable.ts#L23)

Observes specified event

##### Type Parameters

###### K

`K` *extends* keyof [`CanvasEvents`](/api/interfaces/canvasevents/)

###### E

`E` *extends* [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> \| [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object` \| [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<`WheelEvent`\> \| [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `InEvent` \| [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `OutEvent` \| [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object` \| [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object` \| [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object` \| `TEventWithTarget`\<`DragEvent`\> \| [`DragEventData`](/api/interfaces/drageventdata/) \| [`DragEventData`](/api/interfaces/drageventdata/) & `InEvent` \| [`DragEventData`](/api/interfaces/drageventdata/) & `OutEvent` \| [`DropEventData`](/api/interfaces/dropeventdata/) \| `SimpleEventHandler`\<`Event`\> \| [`ModifiedEvent`](/api/interfaces/modifiedevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> \| \{ `drawables`: \{ `backgroundImage?`: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>; `overlayImage?`: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>; \}; `path`: [`FabricObject`](/api/classes/fabricobject/); `subTargets`: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]; `targets`: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]; \} \| \{ `ctx`: `CanvasRenderingContext2D`; \} \| \{ `target`: [`FabricObject`](/api/classes/fabricobject/); \} \| \{ `target`: [`FabricObject`](/api/classes/fabricobject/); \} \| \{ `path`: [`FabricObject`](/api/classes/fabricobject/); \} \| \{ `path`: [`FabricObject`](/api/classes/fabricobject/); \} \| \{ `target`: [`IText`](/api/classes/itext/); \} \| \{ `target`: [`IText`](/api/classes/itext/); \} \| `object` & `Partial`\<[`TEvent`](/api/interfaces/tevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>\> \| \{ `target`: [`IText`](/api/classes/itext/); \} \| \{ `ctx`: `CanvasRenderingContext2D`; \} \| [`LayoutBeforeEvent`](/api/type-aliases/layoutbeforeevent/) & `object` \| [`LayoutAfterEvent`](/api/type-aliases/layoutafterevent/) & `object` \| [`TEvent`](/api/interfaces/tevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object` \| [`BasicTransformEvent`](/api/interfaces/basictransformevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object` \| [`BasicTransformEvent`](/api/interfaces/basictransformevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object` \| [`BasicTransformEvent`](/api/interfaces/basictransformevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object` \| [`BasicTransformEvent`](/api/interfaces/basictransformevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object` \| [`BasicTransformEvent`](/api/interfaces/basictransformevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object` \| [`BasicTransformEvent`](/api/interfaces/basictransformevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object` \| [`BasicTransformEvent`](/api/interfaces/basictransformevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object` & [`ModifyPathEvent`](/api/interfaces/modifypathevent/) \| `Partial`\<[`TEvent`](/api/interfaces/tevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>\> & `object` \| `Partial`\<[`TEvent`](/api/interfaces/tevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>\> & `object` \| `Partial`\<[`TEvent`](/api/interfaces/tevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>\> & `object` \| `Partial`\<[`TEvent`](/api/interfaces/tevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>\> & `object`

##### Parameters

###### eventName

`K`

Event name (eg. 'after:render')

###### handler

`TEventCallback`\<`E`\>

Function that receives a notification when an event of the specified type occurs

##### Returns

`VoidFunction`

disposer

##### Alias

on

##### Inherited from

`SelectableCanvas.on`

#### Call Signature

> **on**(`handlers`): `VoidFunction`

Defined in: [src/Observable.ts:27](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Observable.ts#L27)

Observes specified event

##### Parameters

###### handlers

`EventRegistryObject`\<`EventSpec`\>

key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})

##### Returns

`VoidFunction`

disposer

##### Alias

on

##### Inherited from

`SelectableCanvas.on`

***

### once()

#### Call Signature

> **once**\<`K`, `E`\>(`eventName`, `handler`): `VoidFunction`

Defined in: [src/Observable.ts:62](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Observable.ts#L62)

Observes specified event **once**

##### Type Parameters

###### K

`K` *extends* keyof [`CanvasEvents`](/api/interfaces/canvasevents/)

###### E

`E` *extends* [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> \| [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object` \| [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<`WheelEvent`\> \| [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `InEvent` \| [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `OutEvent` \| [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object` \| [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object` \| [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object` \| `TEventWithTarget`\<`DragEvent`\> \| [`DragEventData`](/api/interfaces/drageventdata/) \| [`DragEventData`](/api/interfaces/drageventdata/) & `InEvent` \| [`DragEventData`](/api/interfaces/drageventdata/) & `OutEvent` \| [`DropEventData`](/api/interfaces/dropeventdata/) \| `SimpleEventHandler`\<`Event`\> \| [`ModifiedEvent`](/api/interfaces/modifiedevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> \| \{ `drawables`: \{ `backgroundImage?`: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>; `overlayImage?`: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>; \}; `path`: [`FabricObject`](/api/classes/fabricobject/); `subTargets`: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]; `targets`: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]; \} \| \{ `ctx`: `CanvasRenderingContext2D`; \} \| \{ `target`: [`FabricObject`](/api/classes/fabricobject/); \} \| \{ `target`: [`FabricObject`](/api/classes/fabricobject/); \} \| \{ `path`: [`FabricObject`](/api/classes/fabricobject/); \} \| \{ `path`: [`FabricObject`](/api/classes/fabricobject/); \} \| \{ `target`: [`IText`](/api/classes/itext/); \} \| \{ `target`: [`IText`](/api/classes/itext/); \} \| `object` & `Partial`\<[`TEvent`](/api/interfaces/tevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>\> \| \{ `target`: [`IText`](/api/classes/itext/); \} \| \{ `ctx`: `CanvasRenderingContext2D`; \} \| [`LayoutBeforeEvent`](/api/type-aliases/layoutbeforeevent/) & `object` \| [`LayoutAfterEvent`](/api/type-aliases/layoutafterevent/) & `object` \| [`TEvent`](/api/interfaces/tevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object` \| [`BasicTransformEvent`](/api/interfaces/basictransformevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object` \| [`BasicTransformEvent`](/api/interfaces/basictransformevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object` \| [`BasicTransformEvent`](/api/interfaces/basictransformevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object` \| [`BasicTransformEvent`](/api/interfaces/basictransformevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object` \| [`BasicTransformEvent`](/api/interfaces/basictransformevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object` \| [`BasicTransformEvent`](/api/interfaces/basictransformevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object` \| [`BasicTransformEvent`](/api/interfaces/basictransformevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object` & [`ModifyPathEvent`](/api/interfaces/modifypathevent/) \| `Partial`\<[`TEvent`](/api/interfaces/tevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>\> & `object` \| `Partial`\<[`TEvent`](/api/interfaces/tevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>\> & `object` \| `Partial`\<[`TEvent`](/api/interfaces/tevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>\> & `object` \| `Partial`\<[`TEvent`](/api/interfaces/tevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>\> & `object`

##### Parameters

###### eventName

`K`

Event name (eg. 'after:render')

###### handler

`TEventCallback`\<`E`\>

Function that receives a notification when an event of the specified type occurs

##### Returns

`VoidFunction`

disposer

##### Alias

once

##### Inherited from

`SelectableCanvas.once`

#### Call Signature

> **once**(`handlers`): `VoidFunction`

Defined in: [src/Observable.ts:66](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Observable.ts#L66)

Observes specified event **once**

##### Parameters

###### handlers

`EventRegistryObject`\<`EventSpec`\>

key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})

##### Returns

`VoidFunction`

disposer

##### Alias

once

##### Inherited from

`SelectableCanvas.once`

***

### relativePan()

> **relativePan**(`point`): `void`

Defined in: [src/canvas/StaticCanvas.ts:415](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L415)

Pans viewpoint relatively

#### Parameters

##### point

[`Point`](/api/classes/point/)

(position vector) to move by

#### Returns

`void`

#### Inherited from

`SelectableCanvas.relativePan`

***

### removeListeners()

> **removeListeners**(): `void`

Defined in: [src/canvas/Canvas.ts:201](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/Canvas.ts#L201)

Removes all event listeners, used when disposing the instance

#### Returns

`void`

***

### renderAll()

> **renderAll**(): `void`

Defined in: [src/canvas/SelectableCanvas.ts:396](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L396)

Renders both the top canvas and the secondary container canvas.

#### Returns

`void`

#### Inherited from

`SelectableCanvas.renderAll`

***

### renderCanvas()

> **renderCanvas**(`ctx`, `objects`): `void`

Defined in: [src/canvas/StaticCanvas.ts:535](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L535)

Renders background, objects, overlay and controls.

#### Parameters

##### ctx

`CanvasRenderingContext2D`

##### objects

[`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]

to render

#### Returns

`void`

#### Inherited from

`SelectableCanvas.renderCanvas`

***

### renderTop()

> **renderTop**(): `void`

Defined in: [src/canvas/SelectableCanvas.ts:436](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L436)

Method to render only the top canvas.
Also used to render the group selection box.
Does not render text selection.

#### Returns

`void`

#### Inherited from

`SelectableCanvas.renderTop`

***

### renderTopLayer()

> **renderTopLayer**(`ctx`): `void`

Defined in: [src/canvas/SelectableCanvas.ts:417](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L417)

text selection is rendered by the active text instance during the rendering cycle

#### Parameters

##### ctx

`CanvasRenderingContext2D`

#### Returns

`void`

#### Inherited from

`SelectableCanvas.renderTopLayer`

***

### requestRenderAll()

> **requestRenderAll**(): `void`

Defined in: [src/canvas/StaticCanvas.ts:491](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L491)

Append a renderAll request to next animation frame.
unless one is already in progress, in that case nothing is done
a boolean flag will avoid appending more.

#### Returns

`void`

#### Inherited from

`SelectableCanvas.requestRenderAll`

***

### searchPossibleTargets()

> **searchPossibleTargets**(`objects`, `pointer`): `TargetsInfoWithContainer`

Defined in: [src/canvas/SelectableCanvas.ts:971](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L971)

Search inside an objects array the fiurst object that contains pointer
Collect subTargets of that object inside the subTargets array passed as parameter

#### Parameters

##### objects

[`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]

objects array to look into

##### pointer

[`Point`](/api/classes/point/)

coordinates from viewport to check.

#### Returns

`TargetsInfoWithContainer`

**top most object on screen** that contains pointer

#### Inherited from

`SelectableCanvas.searchPossibleTargets`

***

### sendObjectBackwards()

> **sendObjectBackwards**(`object`, `intersecting?`): `boolean`

Defined in: [src/Collection.ts:214](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Collection.ts#L214)

Moves an object or a selection down in stack of drawn objects
An optional parameter, `intersecting` allows to move the object in behind
the first intersecting object. Where intersection is calculated with
bounding box. If no intersection is found, there will not be change in the
stack.

#### Parameters

##### object

[`FabricObject`](/api/classes/fabricobject/)

Object to send

##### intersecting?

`boolean`

If `true`, send object behind next lower intersecting object

#### Returns

`boolean`

true if change occurred

#### Inherited from

`SelectableCanvas.sendObjectBackwards`

***

### sendObjectToBack()

> **sendObjectToBack**(`object`): `boolean`

Defined in: [src/Collection.ts:178](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Collection.ts#L178)

Moves an object or the objects of a multiple selection
to the bottom of the stack of drawn objects

#### Parameters

##### object

[`FabricObject`](/api/classes/fabricobject/)

Object to send to back

#### Returns

`boolean`

true if change occurred

#### Inherited from

`SelectableCanvas.sendObjectToBack`

***

### set()

> **set**(`key`, `value?`): `Canvas`

Defined in: [src/CommonMethods.ts:29](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/CommonMethods.ts#L29)

Sets property to a given value. When changing position/dimension -related properties (left, top, scale, angle, etc.) `set` does not update position of object's borders/controls. If you need to update those, call `setCoords()`.

#### Parameters

##### key

Property name or object (if object, iterate over the object properties)

`string` | `Record`\<`string`, `any`\>

##### value?

`any`

Property value (if function, the value is passed into it and its return value is used as a new one)

#### Returns

`Canvas`

#### Inherited from

`SelectableCanvas.set`

***

### setActiveObject()

> **setActiveObject**(`object`, `e?`): `boolean`

Defined in: [src/canvas/SelectableCanvas.ts:1237](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L1237)

Sets given object as the only active object on canvas

#### Parameters

##### object

[`FabricObject`](/api/classes/fabricobject/)

Object to set as an active one

##### e?

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

Event (passed along when firing "object:selected")

#### Returns

`boolean`

true if the object has been selected

#### Inherited from

`SelectableCanvas.setActiveObject`

***

### setCursor()

> **setCursor**(`value`): `void`

Defined in: [src/canvas/SelectableCanvas.ts:706](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L706)

Set the cursor type of the canvas element

#### Parameters

##### value

`string`

Cursor type of the canvas element.

#### Returns

`void`

#### See

http://www.w3.org/TR/css3-ui/#cursor

#### Inherited from

`SelectableCanvas.setCursor`

***

### setDimensions()

#### Call Signature

> **setDimensions**(`dimensions`, `options?`): `void`

Defined in: [src/canvas/StaticCanvas.ts:334](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L334)

Sets dimensions (width, height) of this canvas instance. when options.cssOnly flag active you should also supply the unit of measure (px/%/em)

##### Parameters

###### dimensions

`Partial`\<`CSSDimensions`\>

Object with width/height properties

###### options?

Options object

###### backstoreOnly?

`false`

Set the given dimensions only as canvas backstore dimensions

###### cssOnly?

`true`

Set the given dimensions only as css dimensions

##### Returns

`void`

##### Inherited from

`SelectableCanvas.setDimensions`

#### Call Signature

> **setDimensions**(`dimensions`, `options?`): `void`

Defined in: [src/canvas/StaticCanvas.ts:338](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L338)

Sets dimensions (width, height) of this canvas instance. when options.cssOnly flag active you should also supply the unit of measure (px/%/em)

##### Parameters

###### dimensions

`Partial`\<[`TSize`](/api/type-aliases/tsize/)\>

Object with width/height properties

###### options?

Options object

###### backstoreOnly?

`true`

Set the given dimensions only as canvas backstore dimensions

###### cssOnly?

`false`

Set the given dimensions only as css dimensions

##### Returns

`void`

##### Inherited from

`SelectableCanvas.setDimensions`

#### Call Signature

> **setDimensions**(`dimensions`, `options?`): `void`

Defined in: [src/canvas/StaticCanvas.ts:342](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L342)

Sets dimensions (width, height) of this canvas instance. when options.cssOnly flag active you should also supply the unit of measure (px/%/em)

##### Parameters

###### dimensions

`Partial`\<[`TSize`](/api/type-aliases/tsize/)\>

Object with width/height properties

###### options?

`undefined`

Options object

##### Returns

`void`

##### Inherited from

`SelectableCanvas.setDimensions`

***

### setViewportTransform()

> **setViewportTransform**(`vpt`): `void`

Defined in: [src/canvas/SelectableCanvas.ts:1375](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L1375)

Sets viewport transformation of this canvas instance

#### Parameters

##### vpt

[`TMat2D`](/api/type-aliases/tmat2d/)

a Canvas 2D API transform matrix

#### Returns

`void`

#### Inherited from

`SelectableCanvas.setViewportTransform`

***

### setZoom()

> **setZoom**(`value`): `void`

Defined in: [src/canvas/StaticCanvas.ts:396](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L396)

Sets zoom level of this canvas instance

#### Parameters

##### value

`number`

to set zoom to, less than 1 zooms out

#### Returns

`void`

#### Inherited from

`SelectableCanvas.setZoom`

***

### size()

> **size**(): `number`

Defined in: [src/Collection.ts:136](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Collection.ts#L136)

Returns a size of a collection (i.e: length of an array containing its objects)

#### Returns

`number`

Collection size

#### Inherited from

`SelectableCanvas.size`

***

### toBlob()

> **toBlob**(`options`): `Promise`\<`null` \| `Blob`\>

Defined in: [src/canvas/StaticCanvas.ts:1356](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L1356)

#### Parameters

##### options

[`TDataUrlOptions`](/api/type-aliases/tdataurloptions/) = `...`

#### Returns

`Promise`\<`null` \| `Blob`\>

#### Inherited from

`SelectableCanvas.toBlob`

***

### toCanvasElement()

> **toCanvasElement**(`multiplier`, `options?`): `HTMLCanvasElement`

Defined in: [src/canvas/Canvas.ts:1604](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/Canvas.ts#L1604)

Wraps the original toCanvasElement with a function that removes
the context top for the time the function is run.
So we avoid painting side effects on the upper canvas when exporting

#### Parameters

##### multiplier

`number` = `1`

##### options?

[`TToCanvasElementOptions`](/api/type-aliases/ttocanvaselementoptions/)

#### Returns

`HTMLCanvasElement`

#### Overrides

`SelectableCanvas.toCanvasElement`

***

### toDatalessJSON()

> **toDatalessJSON**(`propertiesToInclude?`): `any`

Defined in: [src/canvas/StaticCanvas.ts:777](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L777)

Returns dataless JSON representation of canvas

#### Parameters

##### propertiesToInclude?

`string`[]

Any properties that you might want to additionally include in the output

#### Returns

`any`

json string

#### Inherited from

`SelectableCanvas.toDatalessJSON`

***

### toDatalessObject()

> **toDatalessObject**(`propertiesToInclude?`): `any`

Defined in: [src/canvas/StaticCanvas.ts:813](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L813)

Returns dataless object representation of canvas

#### Parameters

##### propertiesToInclude?

`string`[]

Any properties that you might want to additionally include in the output

#### Returns

`any`

object representation of an instance

#### Inherited from

`SelectableCanvas.toDatalessObject`

***

### toDataURL()

> **toDataURL**(`options?`): `string`

Defined in: [src/canvas/StaticCanvas.ts:1340](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L1340)

Exports canvas element to a dataurl image. Note that when multiplier is used, cropping is scaled appropriately

#### Parameters

##### options?

[`TDataUrlOptions`](/api/type-aliases/tdataurloptions/) = `...`

Options object

#### Returns

`string`

Returns a data: URL containing a representation of the object in the format specified by options.format

#### See

[demo](https://jsfiddle.net/xsjua1rd/)

#### Examples

```ts
var dataURL = canvas.toDataURL({
  format: 'jpeg',
  quality: 0.8
});
```

```ts
var dataURL = canvas.toDataURL({
  format: 'png',
  left: 100,
  top: 100,
  width: 200,
  height: 200
});
```

```ts
var dataURL = canvas.toDataURL({
  format: 'png',
  multiplier: 2
});
```

```ts
var myObject;
var dataURL = canvas.toDataURL({
  filter: (object) => object.isContainedWithinObject(myObject) || object.intersectsWithObject(myObject)
});
```

#### Inherited from

`SelectableCanvas.toDataURL`

***

### toggle()

> **toggle**(`property`): `Canvas`

Defined in: [src/CommonMethods.ts:46](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/CommonMethods.ts#L46)

Toggles specified property from `true` to `false` or from `false` to `true`

#### Parameters

##### property

`string`

Property to toggle

#### Returns

`Canvas`

#### Inherited from

`SelectableCanvas.toggle`

***

### toJSON()

> **toJSON**(): `any`

Defined in: [src/canvas/StaticCanvas.ts:804](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L804)

Returns Object representation of canvas
this alias is provided because if you call JSON.stringify on an instance,
the toJSON object will be invoked if it exists.
Having a toJSON method means you can do JSON.stringify(myCanvas)
JSON does not support additional properties because toJSON has its own signature

#### Returns

`any`

JSON compatible object

#### See

 - [http://fabric5.fabricjs.com/fabric-intro-part-3#serialization](http://fabric5.fabricjs.com/fabric-intro-part-3#serialization)
 - [demo](http://jsfiddle.net/fabricjs/pec86/|jsFiddle)

#### Examples

```ts
const json = canvas.toJSON();
```

```ts
const json = JSON.stringify(canvas);
```

#### Inherited from

`SelectableCanvas.toJSON`

***

### toObject()

> **toObject**(`propertiesToInclude?`): `any`

Defined in: [src/canvas/StaticCanvas.ts:786](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L786)

Returns object representation of canvas

#### Parameters

##### propertiesToInclude?

`string`[]

Any properties that you might want to additionally include in the output

#### Returns

`any`

object representation of an instance

#### Inherited from

`SelectableCanvas.toObject`

***

### toString()

> **toString**(): `string`

Defined in: [src/canvas/StaticCanvas.ts:1490](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L1490)

Returns a string representation of an instance

#### Returns

`string`

string representation of an instance

#### Inherited from

`SelectableCanvas.toString`

***

### toSVG()

> **toSVG**(`options?`, `reviver?`): `string`

Defined in: [src/canvas/StaticCanvas.ts:951](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L951)

Returns SVG representation of canvas

#### Parameters

##### options?

[`TSVGExportOptions`](/api/type-aliases/tsvgexportoptions/) = `{}`

Options object for SVG output

##### reviver?

[`TSVGReviver`](/api/type-aliases/tsvgreviver/)

Method for further parsing of svg elements, called after each fabric object converted into svg representation.

#### Returns

`string`

SVG string

#### See

 - [http://fabric5.fabricjs.com/fabric-intro-part-3#serialization](http://fabric5.fabricjs.com/fabric-intro-part-3#serialization)
 - [demo](http://jsfiddle.net/fabricjs/jQ3ZZ/|jsFiddle)

#### Examples

```ts
var svg = canvas.toSVG();
```

```ts
var svg = canvas.toSVG({suppressPreamble: true});
```

```ts
var svg = canvas.toSVG({
  viewBox: {
    x: 100,
    y: 100,
    width: 200,
    height: 300
  }
});
```

```ts
var svg = canvas.toSVG({encoding: 'ISO-8859-1'});
```

```ts
var svg = canvas.toSVG(null, function(svg) {
  return svg.replace('stroke-dasharray: ; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; ', '');
});
```

#### Inherited from

`SelectableCanvas.toSVG`

***

### viewportCenterObject()

> **viewportCenterObject**(`object`): `void`

Defined in: [src/canvas/StaticCanvas.ts:724](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L724)

Centers object vertically and horizontally in the viewport

#### Parameters

##### object

[`FabricObject`](/api/classes/fabricobject/)

Object to center vertically and horizontally

#### Returns

`void`

#### Inherited from

`SelectableCanvas.viewportCenterObject`

***

### viewportCenterObjectH()

> **viewportCenterObjectH**(`object`): `void`

Defined in: [src/canvas/StaticCanvas.ts:732](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L732)

Centers object horizontally in the viewport, object.top is unchanged

#### Parameters

##### object

[`FabricObject`](/api/classes/fabricobject/)

Object to center vertically and horizontally

#### Returns

`void`

#### Inherited from

`SelectableCanvas.viewportCenterObjectH`

***

### viewportCenterObjectV()

> **viewportCenterObjectV**(`object`): `void`

Defined in: [src/canvas/StaticCanvas.ts:743](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L743)

Centers object Vertically in the viewport, object.top is unchanged

#### Parameters

##### object

[`FabricObject`](/api/classes/fabricobject/)

Object to center vertically and horizontally

#### Returns

`void`

#### Inherited from

`SelectableCanvas.viewportCenterObjectV`

***

### zoomToPoint()

> **zoomToPoint**(`point`, `value`): `void`

Defined in: [src/canvas/StaticCanvas.ts:379](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/StaticCanvas.ts#L379)

Sets zoom level of this canvas instance, the zoom centered around point
meaning that following zoom to point with the same point will have the visual
effect of the zoom originating from that point. The point won't move.
It has nothing to do with canvas center or visual center of the viewport.

#### Parameters

##### point

[`Point`](/api/classes/point/)

to zoom with respect to

##### value

`number`

to set zoom to, less than 1 zooms out

#### Returns

`void`

#### Inherited from

`SelectableCanvas.zoomToPoint`

***

### getDefaults()

> `static` **getDefaults**(): `Record`\<`string`, `any`\>

Defined in: [src/canvas/SelectableCanvas.ts:314](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/SelectableCanvas.ts#L314)

#### Returns

`Record`\<`string`, `any`\>

#### Inherited from

`SelectableCanvas.getDefaults`
