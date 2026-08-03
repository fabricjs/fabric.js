---
editUrl: false
next: false
prev: false
title: "FabricObject"
---

Defined in: [src/shapes/Object/FabricObject.ts:12](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/FabricObject.ts#L12)

Exported so we can tweak default values

## Extends

- `FabricObjectSVGExportMixin`.[`InteractiveFabricObject`](/api/classes/interactivefabricobject/)\<`Props`, `SProps`, `EventSpec`\>

## Extended by

- [`Line`](/api/classes/line/)
- [`Circle`](/api/classes/circle/)
- [`Triangle`](/api/classes/triangle/)
- [`Ellipse`](/api/classes/ellipse/)
- [`Rect`](/api/classes/rect/)
- [`Path`](/api/classes/path/)
- [`Polyline`](/api/classes/polyline/)
- [`FabricImage`](/api/classes/fabricimage/)

## Type Parameters

### Props

`Props` *extends* [`TFabricObjectProps`](/api/type-aliases/tfabricobjectprops/) = `Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>

### SProps

`SProps` *extends* [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/) = [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/)

### EventSpec

`EventSpec` *extends* [`ObjectEvents`](/api/interfaces/objectevents/) = [`ObjectEvents`](/api/interfaces/objectevents/)

## Constructors

### Constructor

> **new FabricObject**\<`Props`, `SProps`, `EventSpec`\>(`options?`): `FabricObject`\<`Props`, `SProps`, `EventSpec`\>

Defined in: [src/shapes/Object/InteractiveObject.ts:154](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L154)

Constructor

#### Parameters

##### options?

`Props`

Options object

#### Returns

`FabricObject`\<`Props`, `SProps`, `EventSpec`\>

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`constructor`](/api/classes/interactivefabricobject/#constructor)

## Properties

### \_\_corner?

> `optional` **\_\_corner**: `string`

Defined in: [src/shapes/Object/InteractiveObject.ts:108](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L108)

keeps the value of the last hovered corner during mouse move.
0 is no corner, or 'mt', 'ml', 'mtr' etc..
It should be private, but there is no harm in using it as
a read-only property.
this isn't cleaned automatically. Non selected objects may have wrong values

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`__corner`](/api/classes/interactivefabricobject/#__corner)

***

### \_controlsVisibility

> **\_controlsVisibility**: `Record`\<`string`, `boolean`\>

Defined in: [src/shapes/Object/InteractiveObject.ts:115](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L115)

a map of control visibility for this object.
this was left when controls were introduced to not break the api too much
this takes priority over the generic control visibility

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`_controlsVisibility`](/api/classes/interactivefabricobject/#_controlsvisibility)

***

### \_scaling?

> `optional` **\_scaling**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:137](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L137)

A boolean used from the gesture module to keep tracking of a scaling
action when there is no scaling transform in place.
This is an edge case and is used twice in all codebase.
Probably added to keep track of some performance issues

#### TODO

use git blame to investigate why it was added
DON'T USE IT. WE WILL TRY TO REMOVE IT

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`_scaling`](/api/classes/interactivefabricobject/#_scaling)

***

### absolutePositioned

> **absolutePositioned**: `boolean`

Defined in: [src/shapes/Object/Object.ts:215](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L215)

Meaningful ONLY when the object is used as clipPath.
if true, the clipPath will have its top and left relative to canvas, and will
not be influenced by the object transform. This will make the clipPath relative
to the canvas, but clipping just a particular object.
WARNING this is beta, this feature may change or be renamed.
since 2.4.0

#### Default

```ts
false
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`absolutePositioned`](/api/classes/interactivefabricobject/#absolutepositioned)

***

### aCoords

> **aCoords**: [`TCornerPoint`](/api/type-aliases/tcornerpoint/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:65](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L65)

Describe object's corner position in scene coordinates.
The coordinates are derived from the following:
left, top, width, height, scaleX, scaleY, skewX, skewY, angle, strokeWidth.
The coordinates do not depend on viewport changes.
The coordinates get updated with [setCoords](/api/classes/fabricobject/#setcoords).
You can calculate them without updating with [()](/api/classes/fabricobject/#calcacoords)

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`aCoords`](/api/classes/interactivefabricobject/#acoords)

***

### angle

> **angle**: [`TDegree`](/api/type-aliases/tdegree/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:588](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L588)

Angle of rotation of an object (in degrees)

#### Default

```ts
0
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`angle`](/api/classes/interactivefabricobject/#angle)

***

### backgroundColor

> **backgroundColor**: `string`

Defined in: [src/shapes/Object/Object.ts:202](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L202)

Background color of an object.
takes css colors https://www.w3.org/TR/css-color-3/

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`backgroundColor`](/api/classes/interactivefabricobject/#backgroundcolor)

***

### borderColor

> **borderColor**: `string`

Defined in: [src/shapes/Object/InteractiveObject.ts:77](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L77)

Color of controlling borders of an object (when it's active)

#### Default

```ts
rgb(178,204,255)
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`borderColor`](/api/classes/interactivefabricobject/#bordercolor)

***

### borderDashArray

> **borderDashArray**: `null` \| `number`[]

Defined in: [src/shapes/Object/InteractiveObject.ts:78](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L78)

Array specifying dash pattern of an object's borders (hasBorder must be true)

#### Since

1.6.2

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`borderDashArray`](/api/classes/interactivefabricobject/#borderdasharray)

***

### borderOpacityWhenMoving

> **borderOpacityWhenMoving**: `number`

Defined in: [src/shapes/Object/InteractiveObject.ts:79](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L79)

Opacity of object's controlling borders when object is active and moving

#### Default

```ts
0.4
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`borderOpacityWhenMoving`](/api/classes/interactivefabricobject/#borderopacitywhenmoving)

***

### borderScaleFactor

> **borderScaleFactor**: `number`

Defined in: [src/shapes/Object/InteractiveObject.ts:80](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L80)

Scale factor for the border of the objects ( selection box and controls stroke ).
Bigger number will make a thicker border
border default value is 1, so this scale value is equal to a border and control strokeWidth.
If you need to divide border from control strokeWidth
you will need to write your own render function for controls

#### Default

```ts
1
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`borderScaleFactor`](/api/classes/interactivefabricobject/#borderscalefactor)

***

### centeredRotation

> **centeredRotation**: `boolean`

Defined in: [src/shapes/Object/Object.ts:216](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L216)

When `true` the object will rotate on its center.
When `false` will rotate around the origin point defined by originX and originY.
The value of this property is IGNORED during a transform if the canvas has already
centeredRotation set to `true`
The object method `rotate` will always consider this property and never the canvas's one.

#### Since

1.3.4

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`centeredRotation`](/api/classes/interactivefabricobject/#centeredrotation)

***

### centeredScaling

> **centeredScaling**: `boolean`

Defined in: [src/shapes/Object/Object.ts:217](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L217)

When true, this object will use center point as the origin of transformation
when being scaled via the controls.

#### Since

1.3.4

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`centeredScaling`](/api/classes/interactivefabricobject/#centeredscaling)

***

### clipPath?

> `optional` **clipPath**: [`BaseFabricObject`](/api/classes/basefabricobject/)\<`Partial`\<`ObjectProps`\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

Defined in: [src/shapes/Object/Object.ts:213](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L213)

a fabricObject that, without stroke define a clipping area with their shape. filled in black
the clipPath object gets used when the object has rendered, and the context is placed in the center
of the object cacheCanvas.
If you want 0,0 of a clipPath to align with an object center, use clipPath.originX/Y to 'center'

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`clipPath`](/api/classes/interactivefabricobject/#clippath)

***

### clipPathId?

> `optional` **clipPathId**: `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:20](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/FabricObjectSVGExportMixin.ts#L20)

When an object is being exported as SVG as a clippath, a reference inside the SVG is needed.
This reference is a UID in the fabric namespace and is temporary stored here.

#### Inherited from

`FabricObjectSVGExportMixin.clipPathId`

***

### controls

> **controls**: `TControlSet`

Defined in: [src/shapes/Object/InteractiveObject.ts:121](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L121)

holds the controls for the object.
controls are added by default_controls.js

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`controls`](/api/classes/interactivefabricobject/#controls)

***

### cornerColor

> **cornerColor**: `string`

Defined in: [src/shapes/Object/InteractiveObject.ts:71](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L71)

Color of controlling corners of an object (when it's active)

#### Default

```ts
rgb(178,204,255)
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`cornerColor`](/api/classes/interactivefabricobject/#cornercolor)

***

### cornerDashArray

> **cornerDashArray**: `null` \| `number`[]

Defined in: [src/shapes/Object/InteractiveObject.ts:74](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L74)

Array specifying dash pattern of an object's control (hasBorder must be true)

#### Since

1.6.2

#### Default

```ts
null
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`cornerDashArray`](/api/classes/interactivefabricobject/#cornerdasharray)

***

### cornerSize

> **cornerSize**: `number`

Defined in: [src/shapes/Object/InteractiveObject.ts:68](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L68)

Size of object's controlling corners (in pixels)

#### Default

```ts
13
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`cornerSize`](/api/classes/interactivefabricobject/#cornersize)

***

### cornerStrokeColor

> **cornerStrokeColor**: `string`

Defined in: [src/shapes/Object/InteractiveObject.ts:72](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L72)

Color of controlling corners of an object (when it's active and transparentCorners false)

#### Since

1.6.2

#### Default

```ts
''
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`cornerStrokeColor`](/api/classes/interactivefabricobject/#cornerstrokecolor)

***

### ~~cornerStyle~~

> **cornerStyle**: `"circle"` \| `"rect"`

Defined in: [src/shapes/Object/InteractiveObject.ts:73](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L73)

Specify style of control, 'rect' or 'circle'
This is deprecated. In the future there will be a standard control render
And you can swap it with one of the alternative proposed with the control api

:::caution[Deprecated]
This API is no longer supported and may be removed in a future release.
:::

#### Since

1.6.2

#### Default

```ts
'rect'
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`cornerStyle`](/api/classes/interactivefabricobject/#cornerstyle)

***

### dirty

> **dirty**: `boolean`

Defined in: [src/shapes/Object/Object.ts:242](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L242)

When set to `true`, object's cache will be rerendered next render call.
since 1.7.0

#### Default

```ts
true
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`dirty`](/api/classes/interactivefabricobject/#dirty)

***

### evented

> **evented**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:85](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L85)

When set to `false`, an object can not be a target of events. All events propagate through it. Introduced in v1.3.4

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`evented`](/api/classes/interactivefabricobject/#evented)

***

### excludeFromExport

> **excludeFromExport**: `boolean`

Defined in: [src/shapes/Object/Object.ts:209](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L209)

When `true`, object is not exported in OBJECT/JSON

#### Since

1.6.3

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`excludeFromExport`](/api/classes/interactivefabricobject/#excludefromexport)

***

### fill

> **fill**: `null` \| `string` \| [`TFiller`](/api/type-aliases/tfiller/)

Defined in: [src/shapes/Object/Object.ts:192](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L192)

Color of object's fill
takes css colors https://www.w3.org/TR/css-color-3/

#### Default

```ts
rgb(0,0,0)
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`fill`](/api/classes/interactivefabricobject/#fill)

***

### fillRule

> **fillRule**: `CanvasFillRule`

Defined in: [src/shapes/Object/Object.ts:193](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L193)

Fill rule used to fill an object
accepted values are nonzero, evenodd
<b>Backwards incompatibility note:</b> This property was used for setting globalCompositeOperation until v1.4.12 (use `globalCompositeOperation` instead)

#### Default

```ts
nonzero
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`fillRule`](/api/classes/interactivefabricobject/#fillrule)

***

### flipX

> **flipX**: `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:574](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L574)

When true, an object is rendered as flipped horizontally

#### Default

```ts
false
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`flipX`](/api/classes/interactivefabricobject/#flipx)

***

### flipY

> **flipY**: `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:575](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L575)

When true, an object is rendered as flipped vertically

#### Default

```ts
false
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`flipY`](/api/classes/interactivefabricobject/#flipy)

***

### globalCompositeOperation

> **globalCompositeOperation**: `GlobalCompositeOperation`

Defined in: [src/shapes/Object/Object.ts:201](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L201)

Composite rule used for canvas globalCompositeOperation

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`globalCompositeOperation`](/api/classes/interactivefabricobject/#globalcompositeoperation)

***

### hasBorders

> **hasBorders**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:81](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L81)

When set to `false`, object's controlling borders are not rendered

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`hasBorders`](/api/classes/interactivefabricobject/#hasborders)

***

### hasControls

> **hasControls**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:75](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L75)

When set to `false`, object's controls are not displayed and can not be used to manipulate object

#### Default

```ts
true
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`hasControls`](/api/classes/interactivefabricobject/#hascontrols)

***

### height

> **height**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:573](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L573)

Object height

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`height`](/api/classes/interactivefabricobject/#height)

***

### hoverCursor

> **hoverCursor**: `null` \| `string`

Defined in: [src/shapes/Object/InteractiveObject.ts:89](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L89)

Default cursor value used when hovering over this object on canvas

#### Default

```ts
null
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`hoverCursor`](/api/classes/interactivefabricobject/#hovercursor)

***

### includeDefaultValues

> **includeDefaultValues**: `boolean`

Defined in: [src/shapes/Object/Object.ts:208](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L208)

When `false`, default object's values are not included in its serialization

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`includeDefaultValues`](/api/classes/interactivefabricobject/#includedefaultvalues)

***

### inverted

> **inverted**: `boolean`

Defined in: [src/shapes/Object/Object.ts:214](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L214)

Meaningful ONLY when the object is used as clipPath.
if true, the clipPath will make the object clip to the outside of the clipPath
since 2.4.0

#### Default

```ts
false
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`inverted`](/api/classes/interactivefabricobject/#inverted)

***

### isMoving?

> `optional` **isMoving**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:127](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L127)

internal boolean to signal the code that the object is
part of the move action.

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`isMoving`](/api/classes/interactivefabricobject/#ismoving)

***

### left

> **left**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:571](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L571)

Left position of an object.
Note that by default it's relative to object left.
You can change this by setting originX

#### Default

```ts
0
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`left`](/api/classes/interactivefabricobject/#left)

***

### lockMovementX

> **lockMovementX**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:59](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L59)

When `true`, object horizontal movement is locked

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`lockMovementX`](/api/classes/interactivefabricobject/#lockmovementx)

***

### lockMovementY

> **lockMovementY**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:60](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L60)

When `true`, object vertical movement is locked

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`lockMovementY`](/api/classes/interactivefabricobject/#lockmovementy)

***

### lockRotation

> **lockRotation**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:61](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L61)

When `true`, object rotation is locked

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`lockRotation`](/api/classes/interactivefabricobject/#lockrotation)

***

### lockScalingFlip

> **lockScalingFlip**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:66](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L66)

When `true`, object cannot be flipped by scaling into negative values

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`lockScalingFlip`](/api/classes/interactivefabricobject/#lockscalingflip)

***

### lockScalingX

> **lockScalingX**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:62](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L62)

When `true`, object horizontal scaling is locked

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`lockScalingX`](/api/classes/interactivefabricobject/#lockscalingx)

***

### lockScalingY

> **lockScalingY**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:63](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L63)

When `true`, object vertical scaling is locked

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`lockScalingY`](/api/classes/interactivefabricobject/#lockscalingy)

***

### lockSkewingX

> **lockSkewingX**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:64](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L64)

When `true`, object horizontal skewing is locked

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`lockSkewingX`](/api/classes/interactivefabricobject/#lockskewingx)

***

### lockSkewingY

> **lockSkewingY**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:65](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L65)

When `true`, object vertical skewing is locked

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`lockSkewingY`](/api/classes/interactivefabricobject/#lockskewingy)

***

### matrixCache?

> `optional` **matrixCache**: `TMatrixCache`

Defined in: [src/shapes/Object/ObjectGeometry.ts:75](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L75)

storage cache for object full transform matrix

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`matrixCache`](/api/classes/interactivefabricobject/#matrixcache)

***

### minScaleLimit

> **minScaleLimit**: `number`

Defined in: [src/shapes/Object/Object.ts:187](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L187)

Minimum allowed scale value of an object

#### Default

```ts
0
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`minScaleLimit`](/api/classes/interactivefabricobject/#minscalelimit)

***

### moveCursor

> **moveCursor**: `null` \| `string`

Defined in: [src/shapes/Object/InteractiveObject.ts:90](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L90)

Default cursor value used when moving this object on canvas

#### Default

```ts
null
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`moveCursor`](/api/classes/interactivefabricobject/#movecursor)

***

### noScaleCache

> **noScaleCache**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:54](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L54)

When `true`, cache does not get updated during scaling. The picture will get blocky if scaled
too much and will be redrawn with correct details at the end of scaling.
this setting is performance and application dependent.
default to true
since 1.7.0

#### Default

```ts
true
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`noScaleCache`](/api/classes/interactivefabricobject/#noscalecache)

***

### objectCaching

> **objectCaching**: `boolean`

Defined in: [src/shapes/Object/Object.ts:211](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L211)

When `true`, object is cached on an additional canvas.
When `false`, object is not cached unless necessary ( clipPath )
default to true

#### Since

1.7.0

#### Default

```ts
true
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`objectCaching`](/api/classes/interactivefabricobject/#objectcaching)

***

### oCoords

> **oCoords**: `Record`\<`string`, `TOCoord`\>

Defined in: [src/shapes/Object/InteractiveObject.ts:98](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L98)

The object's controls' position in viewport coordinates
Calculated by [Control#positionHandler](/api/classes/control/#positionhandler) and [Control#calcCornerCoords](/api/classes/control/#calccornercoords), depending on [padding](/api/classes/fabricobject/#padding).
`corner/touchCorner` describe the 4 points forming the interactive area of the corner.
Used to draw and locate controls.

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`oCoords`](/api/classes/interactivefabricobject/#ocoords)

***

### opacity

> **opacity**: `number`

Defined in: [src/shapes/Object/Object.ts:189](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L189)

Opacity of an object

#### Default

```ts
1
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`opacity`](/api/classes/interactivefabricobject/#opacity)

***

### ~~originX~~

> **originX**: [`TOriginX`](/api/type-aliases/toriginx/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:583](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L583)

:::caution[Deprecated]
please use 'center' as value in new projects
:::

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`originX`](/api/classes/interactivefabricobject/#originx)

***

### ~~originY~~

> **originY**: [`TOriginY`](/api/type-aliases/toriginy/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:587](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L587)

:::caution[Deprecated]
please use 'center' as value in new projects
:::

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`originY`](/api/classes/interactivefabricobject/#originy)

***

### ownMatrixCache?

> `optional` **ownMatrixCache**: `TMatrixCache`

Defined in: [src/shapes/Object/ObjectGeometry.ts:70](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L70)

storage cache for object transform matrix

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`ownMatrixCache`](/api/classes/interactivefabricobject/#ownmatrixcache)

***

### padding

> **padding**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:55](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L55)

Padding between object and its controlling borders (in pixels)

#### Default

```ts
0
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`padding`](/api/classes/interactivefabricobject/#padding)

***

### paintFirst

> **paintFirst**: `"fill"` \| `"stroke"`

Defined in: [src/shapes/Object/Object.ts:191](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L191)

Determines if the fill or the stroke is drawn first (one of "fill" or "stroke")

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`paintFirst`](/api/classes/interactivefabricobject/#paintfirst)

***

### parent?

> `optional` **parent**: [`Group`](/api/classes/group/)

Defined in: [src/shapes/Object/Object.ts:1601](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1601)

A reference to the parent of the object
Used to keep the original parent ref when the object has been added to an ActiveSelection, hence loosing the `group` ref

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`parent`](/api/classes/interactivefabricobject/#parent)

***

### perPixelTargetFind

> **perPixelTargetFind**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:86](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L86)

When set to `true`, objects are "found" on canvas on per-pixel basis rather than according to bounding box

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`perPixelTargetFind`](/api/classes/interactivefabricobject/#perpixeltargetfind)

***

### scaleX

> **scaleX**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:576](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L576)

Object scale factor (horizontal)

#### Default

```ts
1
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`scaleX`](/api/classes/interactivefabricobject/#scalex)

***

### scaleY

> **scaleY**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:577](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L577)

Object scale factor (vertical)

#### Default

```ts
1
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`scaleY`](/api/classes/interactivefabricobject/#scaley)

***

### selectable

> **selectable**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:84](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L84)

When set to `false`, an object can not be selected for modification (using either point-click-based or group-based selection).
But events still fire on it.

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`selectable`](/api/classes/interactivefabricobject/#selectable)

***

### ~~selectionBackgroundColor~~

> **selectionBackgroundColor**: `string`

Defined in: [src/shapes/Object/InteractiveObject.ts:82](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L82)

Selection Background color of an object. colored layer behind the object when it is active.
does not mix good with globalCompositeOperation methods.

:::caution[Deprecated]
This API is no longer supported and may be removed in a future release.
:::

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`selectionBackgroundColor`](/api/classes/interactivefabricobject/#selectionbackgroundcolor)

***

### shadow

> **shadow**: `null` \| [`Shadow`](/api/classes/shadow/)

Defined in: [src/shapes/Object/Object.ts:204](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L204)

Shadow object representing shadow of this shape

#### Default

```ts
null
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`shadow`](/api/classes/interactivefabricobject/#shadow)

***

### skewX

> **skewX**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:578](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L578)

Angle of skew on x axes of an object (in degrees)

#### Default

```ts
0
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`skewX`](/api/classes/interactivefabricobject/#skewx)

***

### skewY

> **skewY**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:579](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L579)

Angle of skew on y axes of an object (in degrees)

#### Default

```ts
0
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`skewY`](/api/classes/interactivefabricobject/#skewy)

***

### snapAngle?

> `optional` **snapAngle**: [`TDegree`](/api/type-aliases/tdegree/)

Defined in: [src/shapes/Object/InteractiveObject.ts:56](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L56)

The angle that an object will lock to while rotating.

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`snapAngle`](/api/classes/interactivefabricobject/#snapangle)

***

### snapThreshold?

> `optional` **snapThreshold**: [`TDegree`](/api/type-aliases/tdegree/)

Defined in: [src/shapes/Object/InteractiveObject.ts:57](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L57)

The angle difference from the current snapped angle in which snapping should occur.
When undefined, the snapThreshold will default to the snapAngle.

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`snapThreshold`](/api/classes/interactivefabricobject/#snapthreshold)

***

### stroke

> **stroke**: `null` \| `string` \| [`TFiller`](/api/type-aliases/tfiller/)

Defined in: [src/shapes/Object/Object.ts:194](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L194)

When defined, an object is rendered via stroke and this property specifies its color
takes css colors https://www.w3.org/TR/css-color-3/

#### Default

```ts
null
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`stroke`](/api/classes/interactivefabricobject/#stroke)

***

### strokeDashArray

> **strokeDashArray**: `null` \| `number`[]

Defined in: [src/shapes/Object/Object.ts:195](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L195)

Array specifying dash pattern of an object's stroke (stroke must be defined)

#### Default

```ts
null;
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`strokeDashArray`](/api/classes/interactivefabricobject/#strokedasharray)

***

### strokeDashOffset

> **strokeDashOffset**: `number`

Defined in: [src/shapes/Object/Object.ts:196](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L196)

Line offset of an object's stroke

#### Default

```ts
0
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`strokeDashOffset`](/api/classes/interactivefabricobject/#strokedashoffset)

***

### strokeLineCap

> **strokeLineCap**: `CanvasLineCap`

Defined in: [src/shapes/Object/Object.ts:197](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L197)

Line endings style of an object's stroke (one of "butt", "round", "square")

#### Default

```ts
butt
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`strokeLineCap`](/api/classes/interactivefabricobject/#strokelinecap)

***

### strokeLineJoin

> **strokeLineJoin**: `CanvasLineJoin`

Defined in: [src/shapes/Object/Object.ts:198](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L198)

Corner style of an object's stroke (one of "bevel", "round", "miter")

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`strokeLineJoin`](/api/classes/interactivefabricobject/#strokelinejoin)

***

### strokeMiterLimit

> **strokeMiterLimit**: `number`

Defined in: [src/shapes/Object/Object.ts:199](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L199)

Maximum miter length (used for strokeLineJoin = "miter") of an object's stroke

#### Default

```ts
4
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`strokeMiterLimit`](/api/classes/interactivefabricobject/#strokemiterlimit)

***

### strokeUniform

> **strokeUniform**: `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:590](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L590)

When `false`, the stoke width will scale with the object.
When `true`, the stroke will always match the exact pixel size entered for stroke width.
this Property does not work on Text classes or drawing call that uses strokeText,fillText methods
default to false

#### Since

2.6.0

#### Default

```ts
false
```

#### Default

```ts
false
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`strokeUniform`](/api/classes/interactivefabricobject/#strokeuniform)

***

### strokeWidth

> **strokeWidth**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:589](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L589)

Width of a stroke used to render this object

#### Default

```ts
1
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`strokeWidth`](/api/classes/interactivefabricobject/#strokewidth)

***

### top

> **top**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:570](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L570)

Top position of an object.
Note that by default it's relative to object top.
You can change this by setting originY

#### Default

```ts
0
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`top`](/api/classes/interactivefabricobject/#top)

***

### touchCornerSize

> **touchCornerSize**: `number`

Defined in: [src/shapes/Object/InteractiveObject.ts:69](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L69)

Size of object's controlling corners when touch interaction is detected

#### Default

```ts
24
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`touchCornerSize`](/api/classes/interactivefabricobject/#touchcornersize)

***

### transparentCorners

> **transparentCorners**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:70](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L70)

When true, object's controlling corners are rendered as transparent inside (i.e. stroke instead of fill)

#### Default

```ts
true
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`transparentCorners`](/api/classes/interactivefabricobject/#transparentcorners)

***

### visible

> **visible**: `boolean`

Defined in: [src/shapes/Object/Object.ts:206](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L206)

When set to `false`, an object is not rendered on canvas

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`visible`](/api/classes/interactivefabricobject/#visible)

***

### width

> **width**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:572](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L572)

Object width

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`width`](/api/classes/interactivefabricobject/#width)

***

### cacheProperties

> `static` **cacheProperties**: `string`[]

Defined in: [src/shapes/Object/Object.ts:234](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L234)

List of properties to consider when checking if cache needs refresh
Those properties are checked by
calls to Object.set(key, value). If the key is in this list, the object is marked as dirty
and refreshed at the next render

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`cacheProperties`](/api/classes/interactivefabricobject/#cacheproperties)

***

### colorProperties

> `static` **colorProperties**: `string`[]

Defined in: [src/shapes/Object/Object.ts:1508](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1508)

List of properties to consider for animating colors.

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`colorProperties`](/api/classes/interactivefabricobject/#colorproperties)

***

### customProperties

> `static` **customProperties**: `string`[] = `[]`

Defined in: [src/shapes/Object/Object.ts:1749](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1749)

Define a list of custom properties that will be serialized when
instance.toObject() gets called

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`customProperties`](/api/classes/interactivefabricobject/#customproperties)

***

### ownDefaults

> `static` **ownDefaults**: `Partial`\<[`TClassProperties`](/api/type-aliases/tclassproperties/)\<[`InteractiveFabricObject`](/api/classes/interactivefabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>\>\> = `interactiveObjectDefaultValues`

Defined in: [src/shapes/Object/InteractiveObject.ts:141](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L141)

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`ownDefaults`](/api/classes/interactivefabricobject/#owndefaults)

***

### stateProperties

> `static` **stateProperties**: `string`[]

Defined in: [src/shapes/Object/Object.ts:225](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L225)

This list of properties is used to check if the state of an object is changed.
This state change now is only used for children of groups to understand if a group
needs its cache regenerated during a .set call

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`stateProperties`](/api/classes/interactivefabricobject/#stateproperties)

***

### type

> `static` **type**: `string` = `'FabricObject'`

Defined in: [src/shapes/Object/Object.ts:343](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L343)

The class type.
This is used for serialization and deserialization purposes and internally it can be used
to identify classes.
When we transform a class in a plain JS object we need a way to recognize which class it was,
and the type is the way we do that. It has no other purposes and you should not give one.
Hard to reach on instances and please do not use to drive instance's logic (this.constructor.type).
To idenfity a class use instanceof class ( instanceof Rect ).
We do not do that in fabricJS code because we want to try to have code splitting possible.

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`type`](/api/classes/interactivefabricobject/#type)

## Accessors

### type

#### Get Signature

> **get** **type**(): `string`

Defined in: [src/shapes/Object/Object.ts:354](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L354)

Legacy identifier of the class. Prefer using utils like isType or instanceOf
Will be removed in fabric 7 or 8.
The setter exists to avoid type errors in old code and possibly current deserialization code.
DO NOT build new code around this type value

##### TODO

add sustainable warning message

:::caution[Deprecated]
This API is no longer supported and may be removed in a future release.
:::

##### Returns

`string`

#### Set Signature

> **set** **type**(`value`): `void`

Defined in: [src/shapes/Object/Object.ts:362](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L362)

##### Parameters

###### value

`string`

##### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`type`](/api/classes/interactivefabricobject/#type-1)

## Methods

### \_drawClipPath()

> **\_drawClipPath**(`ctx`, `clipPath`, `context`): `void`

Defined in: [src/shapes/Object/Object.ts:872](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L872)

Prepare clipPath state and cache and draw it on instance's cache

#### Parameters

##### ctx

`CanvasRenderingContext2D`

##### clipPath

`undefined` | [`BaseFabricObject`](/api/classes/basefabricobject/)\<`Partial`\<`ObjectProps`\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

##### context

[`DrawContext`](/api/type-aliases/drawcontext/)

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`_drawClipPath`](/api/classes/interactivefabricobject/#_drawclippath)

***

### \_limitCacheSize()

> **\_limitCacheSize**(`dims`): [`TSize`](/api/type-aliases/tsize/) & `object` & `object`

Defined in: [src/shapes/Object/Object.ts:397](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L397)

Limit the cache dimensions so that X * Y do not cross config.perfLimitSizeTotal
and each side do not cross fabric.cacheSideLimit
those numbers are configurable so that you can get as much detail as you want
making bargain with performances.
It mutates the input object dims.

#### Parameters

##### dims

[`TSize`](/api/type-aliases/tsize/) & `object` & `object`

#### Returns

[`TSize`](/api/type-aliases/tsize/) & `object` & `object`

dims

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`_limitCacheSize`](/api/classes/interactivefabricobject/#_limitcachesize)

***

### \_removeCacheCanvas()

> **\_removeCacheCanvas**(): `void`

Defined in: [src/shapes/Object/Object.ts:707](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L707)

Remove cacheCanvas and its dimensions from the objects

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`_removeCacheCanvas`](/api/classes/interactivefabricobject/#_removecachecanvas)

***

### \_renderControls()

> **\_renderControls**(`ctx`, `styleOverride?`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:440](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L440)

Renders controls and borders for the object
the context here is not transformed

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Context to render on

##### styleOverride?

`TStyleOverride` = `{}`

properties to override the object style

#### Returns

`void`

#### Todo

move to interactivity

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`_renderControls`](/api/classes/interactivefabricobject/#_rendercontrols)

***

### \_setClippingProperties()

> **\_setClippingProperties**(`ctx`): `void`

Defined in: [src/shapes/Object/Object.ts:1017](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1017)

#### Parameters

##### ctx

`CanvasRenderingContext2D`

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`_setClippingProperties`](/api/classes/interactivefabricobject/#_setclippingproperties)

***

### \_setFillStyles()

> **\_setFillStyles**(`ctx`, `__namedParameters`): `void`

Defined in: [src/shapes/Object/Object.ts:1006](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1006)

#### Parameters

##### ctx

`CanvasRenderingContext2D`

##### \_\_namedParameters

`Pick`\<`this`, `"fill"`\>

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`_setFillStyles`](/api/classes/interactivefabricobject/#_setfillstyles)

***

### \_setStrokeStyles()

> **\_setStrokeStyles**(`ctx`, `decl`): `void`

Defined in: [src/shapes/Object/Object.ts:964](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L964)

#### Parameters

##### ctx

`CanvasRenderingContext2D`

##### decl

`Pick`\<`this`, `"stroke"` \| `"strokeWidth"` \| `"strokeLineCap"` \| `"strokeDashOffset"` \| `"strokeLineJoin"` \| `"strokeMiterLimit"`\>

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`_setStrokeStyles`](/api/classes/interactivefabricobject/#_setstrokestyles)

***

### \_setupCompositeOperation()

> **\_setupCompositeOperation**(`ctx`): `void`

Defined in: [src/shapes/Object/Object.ts:1483](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1483)

Sets canvas globalCompositeOperation for specific object
custom composition operation for the particular object can be specified using globalCompositeOperation property

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Rendering canvas context

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`_setupCompositeOperation`](/api/classes/interactivefabricobject/#_setupcompositeoperation)

***

### \_toSVG()

> **\_toSVG**(`_reviver?`): `string`[]

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:136](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/FabricObjectSVGExportMixin.ts#L136)

Returns svg representation of an instance
This function is implemented in each subclass
This is just because typescript otherwise cryies all the time

#### Parameters

##### \_reviver?

[`TSVGReviver`](/api/type-aliases/tsvgreviver/)

#### Returns

`string`[]

an array of strings with the specific svg representation
of the instance

#### Inherited from

`FabricObjectSVGExportMixin._toSVG`

***

### addPaintOrder()

> **addPaintOrder**(`this`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:265](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/FabricObjectSVGExportMixin.ts#L265)

#### Parameters

##### this

`FabricObjectSVGExportMixin` & `FabricObject`\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

#### Returns

`string`

#### Inherited from

`FabricObjectSVGExportMixin.addPaintOrder`

***

### animate()

> **animate**\<`T`\>(`animatable`, `options?`): `Record`\<`string`, [`TAnimation`](/api/fabric/namespaces/util/type-aliases/tanimation/)\<`T`\>\>

Defined in: [src/shapes/Object/Object.ts:1522](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1522)

Animates object's properties

#### Type Parameters

##### T

`T` *extends* `number` \| `number`[] \| [`TColorArg`](/api/type-aliases/tcolorarg/)

#### Parameters

##### animatable

`Record`\<`string`, `T`\>

map of keys and end values

##### options?

`Partial`\<[`AnimationOptions`](/api/fabric/namespaces/util/type-aliases/animationoptions/)\<`T`\>\>

#### Returns

`Record`\<`string`, [`TAnimation`](/api/fabric/namespaces/util/type-aliases/tanimation/)\<`T`\>\>

map of animation contexts

As object — multiple properties

object.animate({ left: ..., top: ... });
object.animate({ left: ..., top: ... }, { duration: ... });

#### See

[http://fabric5.fabricjs.com/fabric-intro-part-2#animation](http://fabric5.fabricjs.com/fabric-intro-part-2#animation)

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`animate`](/api/classes/interactivefabricobject/#animate)

***

### calcACoords()

> **calcACoords**(): [`TCornerPoint`](/api/type-aliases/tcornerpoint/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:429](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L429)

Calculates the coordinates of the 4 corner of the bbox, in absolute coordinates.
those never change with zoom or viewport changes.

#### Returns

[`TCornerPoint`](/api/type-aliases/tcornerpoint/)

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`calcACoords`](/api/classes/interactivefabricobject/#calcacoords)

***

### calcOCoords()

> **calcOCoords**(): `Record`\<`string`, `TOCoord`\>

Defined in: [src/shapes/Object/InteractiveObject.ts:258](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L258)

Calculates the coordinates of the center of each control plus the corners of the control itself
This basically just delegates to each control positionHandler
WARNING: changing what is passed to positionHandler is a breaking change, since position handler
is a public api and should be done just if extremely necessary

#### Returns

`Record`\<`string`, `TOCoord`\>

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`calcOCoords`](/api/classes/interactivefabricobject/#calcocoords)

***

### calcOwnMatrix()

> **calcOwnMatrix**(): [`TMat2D`](/api/type-aliases/tmat2d/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:515](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L515)

calculate transform matrix that represents the current transformations from the
object's properties, this matrix does not include the group transformation

#### Returns

[`TMat2D`](/api/type-aliases/tmat2d/)

transform matrix for the object

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`calcOwnMatrix`](/api/classes/interactivefabricobject/#calcownmatrix)

***

### calcTransformMatrix()

> **calcTransformMatrix**(`skipGroup?`): [`TMat2D`](/api/type-aliases/tmat2d/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:487](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L487)

calculate transform matrix that represents the current transformations from the
object's properties.

#### Parameters

##### skipGroup?

`boolean` = `false`

return transform matrix for object not counting parent transformations
There are some situation in which this is useful to avoid the fake rotation.

#### Returns

[`TMat2D`](/api/type-aliases/tmat2d/)

transform matrix for the object

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`calcTransformMatrix`](/api/classes/interactivefabricobject/#calctransformmatrix)

***

### canDrop()

> **canDrop**(`_e`): `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:711](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L711)

Override to customize drag and drop behavior

#### Parameters

##### \_e

`DragEvent`

#### Returns

`boolean`

true if the object currently dragged can be dropped on the target

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`canDrop`](/api/classes/interactivefabricobject/#candrop)

***

### clearContextTop()

> **clearContextTop**(`restoreManually?`): `undefined` \| `CanvasRenderingContext2D`

Defined in: [src/shapes/Object/InteractiveObject.ts:637](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L637)

Clears the canvas.contextTop in a specific area that corresponds to the object's bounding box
that is in the canvas.contextContainer.
This function is used to clear pieces of contextTop where we render ephemeral effects on top of the object.
Example: blinking cursor text selection, drag effects.

#### Parameters

##### restoreManually?

`boolean`

When true won't restore the context after clear, in order to draw something else.

#### Returns

`undefined` \| `CanvasRenderingContext2D`

canvas.contextTop that is either still transformed
with the object transformMatrix, or restored to neutral transform

#### Todo

discuss swapping restoreManually with a renderCallback, but think of async issues

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`clearContextTop`](/api/classes/interactivefabricobject/#clearcontexttop)

***

### clone()

> **clone**(`propertiesToInclude?`): `Promise`\<`FabricObject`\<`Props`, `SProps`, `EventSpec`\>\>

Defined in: [src/shapes/Object/Object.ts:1245](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1245)

Clones an instance.

#### Parameters

##### propertiesToInclude?

`string`[]

Any properties that you might want to additionally include in the output

#### Returns

`Promise`\<`FabricObject`\<`Props`, `SProps`, `EventSpec`\>\>

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`clone`](/api/classes/interactivefabricobject/#clone)

***

### cloneAsImage()

> **cloneAsImage**(`options?`): [`FabricImage`](/api/classes/fabricimage/)

Defined in: [src/shapes/Object/Object.ts:1271](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1271)

Creates an instance of Image out of an object
makes use of toCanvasElement.
Once this method was based on toDataUrl and loadImage, so it also had a quality
and format option. toCanvasElement is faster and produce no loss of quality.
If you need to get a real Jpeg or Png from an object, using toDataURL is the right way to do it.
toCanvasElement and then toBlob from the obtained canvas is also a good option.

#### Parameters

##### options?

`ObjectToCanvasElementOptions`

for clone as image, passed to toDataURL

#### Returns

[`FabricImage`](/api/classes/fabricimage/)

Object cloned as image.

#### Todo

fix the export type, it could not be Image but the type that getClass return for 'image'.

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`cloneAsImage`](/api/classes/interactivefabricobject/#cloneasimage)

***

### complexity()

> **complexity**(): `number`

Defined in: [src/shapes/Object/Object.ts:1429](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1429)

Returns complexity of an instance

#### Returns

`number`

complexity of this instance (is 1 unless subclassed)

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`complexity`](/api/classes/interactivefabricobject/#complexity)

***

### containsPoint()

> **containsPoint**(`point`): `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:284](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L284)

Checks if point is inside the object

#### Parameters

##### point

[`Point`](/api/classes/point/)

Point to check against

#### Returns

`boolean`

true if point is inside the object

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`containsPoint`](/api/classes/interactivefabricobject/#containspoint)

***

### dispose()

> **dispose**(): `void`

Defined in: [src/shapes/Object/Object.ts:1493](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1493)

cancel instance's running animations
override if necessary to dispose artifacts such as `clipPath`

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`dispose`](/api/classes/interactivefabricobject/#dispose)

***

### drawBorders()

> **drawBorders**(`ctx`, `options`, `styleOverride?`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:488](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L488)

Draws borders of an object's bounding box.
Requires public properties: width, height
Requires public options: padding, borderColor

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Context to draw on

##### options

[`TQrDecomposeOut`](/api/fabric/namespaces/util/type-aliases/tqrdecomposeout/)

object representing current object parameters

##### styleOverride?

`TStyleOverride`

object to override the object style

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`drawBorders`](/api/classes/interactivefabricobject/#drawborders)

***

### drawCacheOnCanvas()

> **drawCacheOnCanvas**(`this`, `ctx`): `void`

Defined in: [src/shapes/Object/Object.ts:894](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L894)

Paint the cached copy of the object on the target context.

#### Parameters

##### this

`TCachedFabricObject`

##### ctx

`CanvasRenderingContext2D`

Context to render on

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`drawCacheOnCanvas`](/api/classes/interactivefabricobject/#drawcacheoncanvas)

***

### drawClipPathOnCache()

> **drawClipPathOnCache**(`ctx`, `clipPath`, `canvasWithClipPath`): `void`

Defined in: [src/shapes/Object/Object.ts:799](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L799)

Execute the drawing operation for an object clipPath

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Context to render on

##### clipPath

[`BaseFabricObject`](/api/classes/basefabricobject/)

##### canvasWithClipPath

`HTMLCanvasElement`

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`drawClipPathOnCache`](/api/classes/interactivefabricobject/#drawclippathoncache)

***

### drawControls()

> **drawControls**(`ctx`, `styleOverride`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:560](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L560)

Draws corners of an object's bounding box.
Requires public properties: width, height
Requires public options: cornerSize, padding
Be aware that since fabric 6.0 this function does not call setCoords anymore.
setCoords needs to be called manually if the object of which we are rendering controls
is outside the standard selection and transform process.

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Context to draw on

##### styleOverride

[`ControlRenderingStyleOverride`](/api/type-aliases/controlrenderingstyleoverride/) = `{}`

object to override the object style

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`drawControls`](/api/classes/interactivefabricobject/#drawcontrols)

***

### drawControlsConnectingLines()

> **drawControlsConnectingLines**(`ctx`, `size`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:527](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L527)

Draws lines from a borders of an object's bounding box to controls that have `withConnection` property set.
Requires public properties: width, height
Requires public options: padding, borderColor

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Context to draw on

##### size

[`Point`](/api/classes/point/)

object size x = width, y = height

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`drawControlsConnectingLines`](/api/classes/interactivefabricobject/#drawcontrolsconnectinglines)

***

### drawObject()

> **drawObject**(`ctx`, `forClipping`, `context`): `void`

Defined in: [src/shapes/Object/Object.ts:823](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L823)

Execute the drawing operation for an object on a specified context

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Context to render on

##### forClipping

apply clipping styles

`undefined` | `boolean`

##### context

[`DrawContext`](/api/type-aliases/drawcontext/)

additional context for rendering

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`drawObject`](/api/classes/interactivefabricobject/#drawobject)

***

### drawSelectionBackground()

> **drawSelectionBackground**(`ctx`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:380](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L380)

Draws a colored layer behind the object, inside its selection borders.
Requires public options: padding, selectionBackgroundColor
this function is called when the context is transformed
has checks to be skipped when the object is on a staticCanvas

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Context to draw on

#### Returns

`void`

#### Todo

evaluate if make this disappear in favor of a pre-render hook for objects
this was added by Andrea Bogazzi to make possible some feature for work reasons
it seemed a good option, now is an edge case

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`drawSelectionBackground`](/api/classes/interactivefabricobject/#drawselectionbackground)

***

### findCommonAncestors()

> **findCommonAncestors**\<`T`\>(`other`): `AncestryComparison`

Defined in: [src/shapes/Object/Object.ts:1640](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1640)

Compare ancestors

#### Type Parameters

##### T

`T` *extends* `FabricObject`\<`Props`, `SProps`, `EventSpec`\>

#### Parameters

##### other

`T`

#### Returns

`AncestryComparison`

an object that represent the ancestry situation.

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`findCommonAncestors`](/api/classes/interactivefabricobject/#findcommonancestors)

***

### fire()

> **fire**\<`K`\>(`eventName`, `options?`): `void`

Defined in: [src/Observable.ts:167](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Observable.ts#L167)

Fires event with an optional options object

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### eventName

`K`

Event name to fire

##### options?

`EventSpec`\[`K`\]

Options object

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`fire`](/api/classes/interactivefabricobject/#fire)

***

### forEachControl()

> **forEachControl**(`fn`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:358](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L358)

Calls a function for each control. The function gets called,
with the control, the control's key and the object that is calling the iterator

#### Parameters

##### fn

(`control`, `key`, `fabricObject`) => `any`

function to iterate over the controls over

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`forEachControl`](/api/classes/interactivefabricobject/#foreachcontrol)

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

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`get`](/api/classes/interactivefabricobject/#get)

***

### getActiveControl()

> **getActiveControl**(): `undefined` \| \{ `control`: [`Control`](/api/classes/control/); `coord`: `TOCoord`; `key`: `string`; \}

Defined in: [src/shapes/Object/InteractiveObject.ts:197](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L197)

#### Returns

`undefined` \| \{ `control`: [`Control`](/api/classes/control/); `coord`: `TOCoord`; `key`: `string`; \}

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`getActiveControl`](/api/classes/interactivefabricobject/#getactivecontrol)

***

### getAncestors()

> **getAncestors**(): `Ancestors`

Defined in: [src/shapes/Object/Object.ts:1623](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1623)

#### Returns

`Ancestors`

ancestors (excluding `ActiveSelection`) from bottom to top

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`getAncestors`](/api/classes/interactivefabricobject/#getancestors)

***

### getBoundingRect()

> **getBoundingRect**(): [`TBBox`](/api/type-aliases/tbbox/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:345](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L345)

Returns coordinates of object's bounding rectangle (left, top, width, height)
the box is intended as aligned to axis of canvas.

#### Returns

[`TBBox`](/api/type-aliases/tbbox/)

Object with left, top, width, height properties

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`getBoundingRect`](/api/classes/interactivefabricobject/#getboundingrect)

***

### getCanvasRetinaScaling()

> **getCanvasRetinaScaling**(): `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:402](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L402)

#### Returns

`number`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`getCanvasRetinaScaling`](/api/classes/interactivefabricobject/#getcanvasretinascaling)

***

### getCenterPoint()

> **getCenterPoint**(): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:740](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L740)

Returns the center coordinates of the object relative to canvas

#### Returns

[`Point`](/api/classes/point/)

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`getCenterPoint`](/api/classes/interactivefabricobject/#getcenterpoint)

***

### getCoords()

> **getCoords**(): [`Point`](/api/classes/point/)[]

Defined in: [src/shapes/Object/ObjectGeometry.ts:206](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L206)

#### Returns

[`Point`](/api/classes/point/)[]

[tl, tr, br, bl] in the scene plane

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`getCoords`](/api/classes/interactivefabricobject/#getcoords)

***

### getObjectOpacity()

> **getObjectOpacity**(): `number`

Defined in: [src/shapes/Object/Object.ts:560](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L560)

Return the object opacity counting also the group property

#### Returns

`number`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`getObjectOpacity`](/api/classes/interactivefabricobject/#getobjectopacity)

***

### getObjectScaling()

> **getObjectScaling**(): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/Object.ts:529](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L529)

Return the object scale factor counting also the group scaling

#### Returns

[`Point`](/api/classes/point/)

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`getObjectScaling`](/api/classes/interactivefabricobject/#getobjectscaling)

***

### ~~getPointByOrigin()~~

> **getPointByOrigin**(`originX`, `originY`): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:763](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L763)

Alias of [getPositionByOrigin](/api/classes/fabricobject/#getpositionbyorigin)

:::caution[Deprecated]
use [getPositionByOrigin](/api/classes/fabricobject/#getpositionbyorigin) instead
:::

#### Parameters

##### originX

[`TOriginX`](/api/type-aliases/toriginx/)

##### originY

[`TOriginY`](/api/type-aliases/toriginy/)

#### Returns

[`Point`](/api/classes/point/)

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`getPointByOrigin`](/api/classes/interactivefabricobject/#getpointbyorigin)

***

### getPositionByOrigin()

> **getPositionByOrigin**(`originX`, `originY`): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:779](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L779)

This function is the mirror of [setPositionByOrigin](/api/classes/fabricobject/#setpositionbyorigin)
Returns the position of the object based on specified origin.
Take an object that has left, top set to 100, 100 with origin 'left', 'top'.
Return the values of left top ( wrapped in a point ) that you would need to keep
the same position if origin where different ( ex: center, bottom )
Alternatively you can use this to also find which point in the parent plane is a specific origin
( where is the bottom right corner of my object? )

#### Parameters

##### originX

[`TOriginX`](/api/type-aliases/toriginx/)

Horizontal origin: 'left', 'center' or 'right'

##### originY

[`TOriginY`](/api/type-aliases/toriginy/)

Vertical origin: 'top', 'center' or 'bottom'

#### Returns

[`Point`](/api/classes/point/)

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`getPositionByOrigin`](/api/classes/interactivefabricobject/#getpositionbyorigin)

***

### getRelativeCenterPoint()

> **getRelativeCenterPoint**(): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:751](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L751)

Returns the center coordinates of the object relative to it's parent

#### Returns

[`Point`](/api/classes/point/)

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`getRelativeCenterPoint`](/api/classes/interactivefabricobject/#getrelativecenterpoint)

***

### getRelativeX()

> **getRelativeX**(): `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:117](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L117)

#### Returns

`number`

x position according to object's originX property in parent's coordinate plane\
if parent is canvas then this property is identical to [getX](/api/classes/fabricobject/#getx)

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`getRelativeX`](/api/classes/interactivefabricobject/#getrelativex)

***

### getRelativeXY()

> **getRelativeXY**(): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:178](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L178)

#### Returns

[`Point`](/api/classes/point/)

x,y position according to object's originX originY properties in parent's coordinate plane

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`getRelativeXY`](/api/classes/interactivefabricobject/#getrelativexy)

***

### getRelativeY()

> **getRelativeY**(): `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:133](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L133)

#### Returns

`number`

y position according to object's originY property in parent's coordinate plane\
if parent is canvas then this property is identical to [getY](/api/classes/fabricobject/#gety)

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`getRelativeY`](/api/classes/interactivefabricobject/#getrelativey)

***

### getScaledHeight()

> **getScaledHeight**(): `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:363](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L363)

Returns height of an object bounding box counting transformations

#### Returns

`number`

height value

#### Todo

shouldn't this account for group transform and return the actual size in canvas coordinate plane?

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`getScaledHeight`](/api/classes/interactivefabricobject/#getscaledheight)

***

### getScaledWidth()

> **getScaledWidth**(): `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:354](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L354)

Returns width of an object's bounding box counting transformations

#### Returns

`number`

width value

#### Todo

shouldn't this account for group transform and return the actual size in canvas coordinate plane?

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`getScaledWidth`](/api/classes/interactivefabricobject/#getscaledwidth)

***

### getSvgCommons()

> **getSvgCommons**(`this`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:100](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/FabricObjectSVGExportMixin.ts#L100)

Returns id attribute for svg output

#### Parameters

##### this

`FabricObjectSVGExportMixin` & `FabricObject`\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\> & `object`

#### Returns

`string`

#### Inherited from

`FabricObjectSVGExportMixin.getSvgCommons`

***

### getSvgFilter()

> **getSvgFilter**(`this`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:90](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/FabricObjectSVGExportMixin.ts#L90)

Returns filter for svg shadow

#### Parameters

##### this

`FabricObjectSVGExportMixin` & `FabricObject`\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

#### Returns

`string`

#### Inherited from

`FabricObjectSVGExportMixin.getSvgFilter`

***

### getSvgStyles()

> **getSvgStyles**(`this`, `skipShadow?`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:27](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/FabricObjectSVGExportMixin.ts#L27)

Returns styles-string for svg-export

#### Parameters

##### this

`FabricObjectSVGExportMixin` & `FabricObject`\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

##### skipShadow?

`boolean`

a boolean to skip shadow filter output

#### Returns

`string`

#### Inherited from

`FabricObjectSVGExportMixin.getSvgStyles`

***

### getSvgTransform()

> **getSvgTransform**(`this`, `full?`, `additionalTransform?`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:119](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/FabricObjectSVGExportMixin.ts#L119)

Returns transform-string for svg-export

#### Parameters

##### this

`FabricObjectSVGExportMixin` & `FabricObject`\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

##### full?

`boolean`

##### additionalTransform?

`string` = `''`

#### Returns

`string`

#### Inherited from

`FabricObjectSVGExportMixin.getSvgTransform`

***

### getTotalAngle()

> **getTotalAngle**(): [`TDegree`](/api/type-aliases/tdegree/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:410](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L410)

Returns the object angle relative to canvas counting also the group property

#### Returns

[`TDegree`](/api/type-aliases/tdegree/)

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`getTotalAngle`](/api/classes/interactivefabricobject/#gettotalangle)

***

### getTotalObjectScaling()

> **getTotalObjectScaling**(): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/Object.ts:546](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L546)

Return the object scale factor counting also the group scaling, zoom and retina

#### Returns

[`Point`](/api/classes/point/)

object with scaleX and scaleY properties

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`getTotalObjectScaling`](/api/classes/interactivefabricobject/#gettotalobjectscaling)

***

### getViewportTransform()

> **getViewportTransform**(): [`TMat2D`](/api/type-aliases/tmat2d/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:420](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L420)

Retrieves viewportTransform from Object's canvas if available

#### Returns

[`TMat2D`](/api/type-aliases/tmat2d/)

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`getViewportTransform`](/api/classes/interactivefabricobject/#getviewporttransform)

***

### getX()

> **getX**(): `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:88](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L88)

#### Returns

`number`

x position according to object's originX property in canvas coordinate plane

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`getX`](/api/classes/interactivefabricobject/#getx)

***

### getXY()

> **getXY**(): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:148](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L148)

#### Returns

[`Point`](/api/classes/point/)

x position according to object's originX originY properties in canvas coordinate plane

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`getXY`](/api/classes/interactivefabricobject/#getxy)

***

### getY()

> **getY**(): `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:102](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L102)

#### Returns

`number`

y position according to object's originY property in canvas coordinate plane

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`getY`](/api/classes/interactivefabricobject/#gety)

***

### hasCommonAncestors()

> **hasCommonAncestors**\<`T`\>(`other`): `boolean`

Defined in: [src/shapes/Object/Object.ts:1705](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1705)

#### Type Parameters

##### T

`T` *extends* `FabricObject`\<`Props`, `SProps`, `EventSpec`\>

#### Parameters

##### other

`T`

#### Returns

`boolean`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`hasCommonAncestors`](/api/classes/interactivefabricobject/#hascommonancestors)

***

### hasFill()

> **hasFill**(): `boolean`

Defined in: [src/shapes/Object/Object.ts:738](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L738)

return true if the object will draw a fill
Does not consider text styles. This is just a shortcut used at rendering time
We want it to be an approximation and be fast.
wrote to avoid extra caching, it has to return true when fill happens,
can guess when it will not happen at 100% chance, does not matter if it misses
some use case where the fill is invisible.

#### Returns

`boolean`

Boolean

#### Since

3.0.0

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`hasFill`](/api/classes/interactivefabricobject/#hasfill)

***

### hasStroke()

> **hasStroke**(): `boolean`

Defined in: [src/shapes/Object/Object.ts:722](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L722)

return true if the object will draw a stroke
Does not consider text styles. This is just a shortcut used at rendering time
We want it to be an approximation and be fast.
wrote to avoid extra caching, it has to return true when stroke happens,
can guess when it will not happen at 100% chance, does not matter if it misses
some use case where the stroke is invisible.

#### Returns

`boolean`

Boolean

#### Since

3.0.0

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`hasStroke`](/api/classes/interactivefabricobject/#hasstroke)

***

### intersectsWithObject()

> **intersectsWithObject**(`other`): `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:234](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L234)

Checks if object intersects with another object

#### Parameters

##### other

`ObjectGeometry`

Object to test

#### Returns

`boolean`

true if object intersects with another object

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`intersectsWithObject`](/api/classes/interactivefabricobject/#intersectswithobject)

***

### intersectsWithRect()

> **intersectsWithRect**(`tl`, `br`): `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:220](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L220)

Checks if object intersects with the scene rect formed by tl and br

#### Parameters

##### tl

[`Point`](/api/classes/point/)

##### br

[`Point`](/api/classes/point/)

#### Returns

`boolean`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`intersectsWithRect`](/api/classes/interactivefabricobject/#intersectswithrect)

***

### isCacheDirty()

> **isCacheDirty**(`skipCanvas`): `boolean`

Defined in: [src/shapes/Object/Object.ts:911](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L911)

Check if cache is dirty and if is dirty clear the context.
This check has a big side effect, it changes the underlying cache canvas if necessary.
Do not call this method on your own to check if the cache is dirty, because if it is,
it is also going to wipe the cache. This is badly designed and needs to be fixed.

#### Parameters

##### skipCanvas

`boolean` = `false`

skip canvas checks because this object is painted
on parent canvas.

#### Returns

`boolean`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`isCacheDirty`](/api/classes/interactivefabricobject/#iscachedirty)

***

### isContainedWithinObject()

> **isContainedWithinObject**(`other`): `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:253](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L253)

Checks if object is fully contained within area of another object

#### Parameters

##### other

`ObjectGeometry`

Object to test

#### Returns

`boolean`

true if object is fully contained within area of another object

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`isContainedWithinObject`](/api/classes/interactivefabricobject/#iscontainedwithinobject)

***

### isContainedWithinRect()

> **isContainedWithinRect**(`tl`, `br`): `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:261](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L261)

Checks if object is fully contained within the scene rect formed by tl and br

#### Parameters

##### tl

[`Point`](/api/classes/point/)

##### br

[`Point`](/api/classes/point/)

#### Returns

`boolean`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`isContainedWithinRect`](/api/classes/interactivefabricobject/#iscontainedwithinrect)

***

### isControlVisible()

> **isControlVisible**(`controlKey`): `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:594](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L594)

Returns true if the specified control is visible, false otherwise.

#### Parameters

##### controlKey

`string`

The key of the control. Possible values are usually 'tl', 'tr', 'br', 'bl', 'ml', 'mt', 'mr', 'mb', 'mtr',
but since the control api allow for any control name, can be any string.

#### Returns

`boolean`

true if the specified control is visible, false otherwise

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`isControlVisible`](/api/classes/interactivefabricobject/#iscontrolvisible)

***

### isDescendantOf()

> **isDescendantOf**(`target`): `boolean`

Defined in: [src/shapes/Object/Object.ts:1609](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1609)

Checks if object is descendant of target
Should be used instead of [Group.contains](/api/classes/group/#contains) or [StaticCanvas.contains](/api/classes/staticcanvas/#contains) for performance reasons

#### Parameters

##### target

`TAncestor`

#### Returns

`boolean`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`isDescendantOf`](/api/classes/interactivefabricobject/#isdescendantof)

***

### isInFrontOf()

> **isInFrontOf**\<`T`\>(`other`): `undefined` \| `boolean`

Defined in: [src/shapes/Object/Object.ts:1715](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1715)

#### Type Parameters

##### T

`T` *extends* `FabricObject`\<`Props`, `SProps`, `EventSpec`\>

#### Parameters

##### other

`T`

object to compare against

#### Returns

`undefined` \| `boolean`

if objects do not share a common ancestor or they are strictly equal it is impossible to determine which is in front of the other; in such cases the function returns `undefined`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`isInFrontOf`](/api/classes/interactivefabricobject/#isinfrontof)

***

### isNotVisible()

> **isNotVisible**(): `boolean`

Defined in: [src/shapes/Object/Object.ts:637](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L637)

return if the object would be visible in rendering

#### Returns

`boolean`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`isNotVisible`](/api/classes/interactivefabricobject/#isnotvisible)

***

### isOnScreen()

> **isOnScreen**(): `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:293](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L293)

Checks if object is contained within the canvas with current viewportTransform
the check is done stopping at first point that appears on screen

#### Returns

`boolean`

true if object is fully or partially contained within canvas

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`isOnScreen`](/api/classes/interactivefabricobject/#isonscreen)

***

### isOverlapping()

> **isOverlapping**\<`T`\>(`other`): `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:271](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L271)

#### Type Parameters

##### T

`T` *extends* `ObjectGeometry`\<[`ObjectEvents`](/api/interfaces/objectevents/)\>

#### Parameters

##### other

`T`

#### Returns

`boolean`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`isOverlapping`](/api/classes/interactivefabricobject/#isoverlapping)

***

### isPartiallyOnScreen()

> **isPartiallyOnScreen**(): `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:323](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L323)

Checks if object is partially contained within the canvas with current viewportTransform

#### Returns

`boolean`

true if object is partially contained within canvas

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`isPartiallyOnScreen`](/api/classes/interactivefabricobject/#ispartiallyonscreen)

***

### isType()

> **isType**(...`types`): `boolean`

Defined in: [src/shapes/Object/Object.ts:1418](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1418)

Checks if the instance is of any of the specified types.
We use this to filter a list of objects for the `getObjects` function.

For detecting an instance type `instanceOf` is a better check,
but to avoid to make specific classes a dependency of generic code
internally we use this.

This compares both the static class `type` and the instance's own `type` property
against the provided list of types.

#### Parameters

##### types

...`string`[]

A list of type strings to check against.

#### Returns

`boolean`

`true` if the object's type or class type matches any in the list, otherwise `false`.

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`isType`](/api/classes/interactivefabricobject/#istype)

***

### needsItsOwnCache()

> **needsItsOwnCache**(): `boolean`

Defined in: [src/shapes/Object/Object.ts:750](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L750)

When returns `true`, force the object to have its own cache, even if it is inside a group
it may be needed when your object behave in a particular way on the cache and always needs
its own isolated canvas to render correctly.
Created to be overridden
since 1.7.12

#### Returns

`boolean`

Boolean

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`needsItsOwnCache`](/api/classes/interactivefabricobject/#needsitsowncache)

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

`K` *extends* `string` \| `number` \| `symbol`

##### Parameters

###### eventName

`K`

event name (eg. 'after:render')

##### Returns

`void`

##### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`off`](/api/classes/interactivefabricobject/#off)

#### Call Signature

> **off**\<`K`\>(`eventName`, `handler`): `void`

Defined in: [src/Observable.ts:128](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Observable.ts#L128)

unsubscribe an event listener

##### Type Parameters

###### K

`K` *extends* `string` \| `number` \| `symbol`

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

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`off`](/api/classes/interactivefabricobject/#off)

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

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`off`](/api/classes/interactivefabricobject/#off)

#### Call Signature

> **off**(): `void`

Defined in: [src/Observable.ts:137](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Observable.ts#L137)

unsubscribe all event listeners

##### Returns

`void`

##### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`off`](/api/classes/interactivefabricobject/#off)

***

### on()

#### Call Signature

> **on**\<`K`, `E`\>(`eventName`, `handler`): `VoidFunction`

Defined in: [src/Observable.ts:23](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Observable.ts#L23)

Observes specified event

##### Type Parameters

###### K

`K` *extends* `string` \| `number` \| `symbol`

###### E

`E`

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

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`on`](/api/classes/interactivefabricobject/#on)

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

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`on`](/api/classes/interactivefabricobject/#on)

***

### once()

#### Call Signature

> **once**\<`K`, `E`\>(`eventName`, `handler`): `VoidFunction`

Defined in: [src/Observable.ts:62](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Observable.ts#L62)

Observes specified event **once**

##### Type Parameters

###### K

`K` *extends* `string` \| `number` \| `symbol`

###### E

`E`

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

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`once`](/api/classes/interactivefabricobject/#once)

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

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`once`](/api/classes/interactivefabricobject/#once)

***

### onDeselect()

> **onDeselect**(`_options?`): `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:668](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L668)

This callback function is called every time _discardActiveObject or _setActiveObject
try to to deselect this object. If the function returns true, the process is cancelled

#### Parameters

##### \_options?

options sent from the upper functions

###### e?

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

###### object?

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

#### Returns

`boolean`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`onDeselect`](/api/classes/interactivefabricobject/#ondeselect)

***

### onDragStart()

> **onDragStart**(`_e`): `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:701](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L701)

Override to customize Drag behavior\
Fired once a drag session has started

#### Parameters

##### \_e

`DragEvent`

#### Returns

`boolean`

true to handle the drag event

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`onDragStart`](/api/classes/interactivefabricobject/#ondragstart)

***

### onSelect()

> **onSelect**(`_options?`): `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:682](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L682)

This callback function is called every time _discardActiveObject or _setActiveObject
try to to select this object. If the function returns true, the process is cancelled

#### Parameters

##### \_options?

options sent from the upper functions

###### e?

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

event if the process is generated by an event

#### Returns

`boolean`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`onSelect`](/api/classes/interactivefabricobject/#onselect)

***

### positionByLeftTop()

> **positionByLeftTop**(`p`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:816](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L816)

An utility method to position the object by its left top corner.
Useful to reposition objects since now the default origin is center/center
Places the left/top corner of the object bounding box in p.

#### Parameters

##### p

[`Point`](/api/classes/point/)

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`positionByLeftTop`](/api/classes/interactivefabricobject/#positionbylefttop)

***

### render()

> **render**(`ctx`): `void`

Defined in: [src/shapes/Object/Object.ts:649](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L649)

Renders an object on a specified context

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Context to render on

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`render`](/api/classes/interactivefabricobject/#render)

***

### renderCache()

> **renderCache**(`this`, `options?`): `void`

Defined in: [src/shapes/Object/Object.ts:683](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L683)

#### Parameters

##### this

`TCachedFabricObject`

##### options?

`any`

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`renderCache`](/api/classes/interactivefabricobject/#rendercache)

***

### renderDragSourceEffect()

> **renderDragSourceEffect**(`_e`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:722](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L722)

Override to customize drag and drop behavior
render a specific effect when an object is the source of a drag event
example: render the selection status for the part of text that is being dragged from a text object

#### Parameters

##### \_e

`DragEvent`

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`renderDragSourceEffect`](/api/classes/interactivefabricobject/#renderdragsourceeffect)

***

### renderDropTargetEffect()

> **renderDropTargetEffect**(`_e`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:734](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L734)

Override to customize drag and drop behavior
render a specific effect when an object is the target of a drag event
used to show that the underly object can receive a drop, or to show how the
object will change when dropping. example: show the cursor where the text is about to be dropped

#### Parameters

##### \_e

`DragEvent`

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`renderDropTargetEffect`](/api/classes/interactivefabricobject/#renderdroptargeteffect)

***

### rotate()

> **rotate**(`angle`): `void`

Defined in: [src/shapes/Object/Object.ts:1446](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1446)

Sets "angle" of an instance with centered rotation

#### Parameters

##### angle

[`TDegree`](/api/type-aliases/tdegree/)

Angle value (in degrees)

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`rotate`](/api/classes/interactivefabricobject/#rotate)

***

### scale()

> **scale**(`value`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:372](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L372)

Scales an object (equally by x and y)

#### Parameters

##### value

`number`

Scale factor

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`scale`](/api/classes/interactivefabricobject/#scale)

***

### scaleToHeight()

> **scaleToHeight**(`value`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:395](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L395)

Scales an object to a given height, with respect to bounding box (scaling by x/y equally)

#### Parameters

##### value

`number`

New height value

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`scaleToHeight`](/api/classes/interactivefabricobject/#scaletoheight)

***

### scaleToWidth()

> **scaleToWidth**(`value`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:383](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L383)

Scales an object to a given width, with respect to bounding box (scaling by x/y equally)

#### Parameters

##### value

`number`

New width value

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`scaleToWidth`](/api/classes/interactivefabricobject/#scaletowidth)

***

### set()

> **set**(`key`, `value?`): `FabricObject`\<`Props`, `SProps`, `EventSpec`\>

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

`FabricObject`\<`Props`, `SProps`, `EventSpec`\>

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`set`](/api/classes/interactivefabricobject/#set)

***

### setControlsVisibility()

> **setControlsVisibility**(`options?`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:621](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L621)

Sets the visibility state of object controls, this is just a bulk option for setControlVisible;

#### Parameters

##### options?

`Record`\<`string`, `boolean`\> = `{}`

with an optional key per control
example: {Boolean} [options.bl] true to enable the bottom-left control, false to disable it

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`setControlsVisibility`](/api/classes/interactivefabricobject/#setcontrolsvisibility)

***

### setControlVisible()

> **setControlVisible**(`controlKey`, `visible`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:609](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L609)

Sets the visibility of the specified control.
please do not use.

#### Parameters

##### controlKey

`string`

The key of the control. Possible values are 'tl', 'tr', 'br', 'bl', 'ml', 'mt', 'mr', 'mb', 'mtr'.
but since the control api allow for any control name, can be any string.

##### visible

`boolean`

true to set the specified control visible, false otherwise

#### Returns

`void`

#### Todo

discuss this overlap of priority here with the team. Andrea Bogazzi for details

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`setControlVisible`](/api/classes/interactivefabricobject/#setcontrolvisible)

***

### setCoords()

> **setCoords**(): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:348](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L348)

set controls' coordinates as well
See [https://github.com/fabricjs/fabric.js/wiki/When-to-call-setCoords](https://github.com/fabricjs/fabric.js/wiki/When-to-call-setCoords) and [https://fabric5.fabricjs.com/fabric-gotchas](https://fabric5.fabricjs.com/fabric-gotchas)

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`setCoords`](/api/classes/interactivefabricobject/#setcoords)

***

### setOnGroup()

> **setOnGroup**(): `void`

Defined in: [src/shapes/Object/Object.ts:1474](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1474)

This callback function is called by the parent group of an object every
time a non-delegated property changes on the group. It is passed the key
and value as parameters. Not adding in this function's signature to avoid
Travis build error about unused variables.

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`setOnGroup`](/api/classes/interactivefabricobject/#setongroup)

***

### setPositionByOrigin()

> **setPositionByOrigin**(`pos`, `originX`, `originY`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:794](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L794)

Sets the position of the object taking into consideration the object's origin

#### Parameters

##### pos

[`Point`](/api/classes/point/)

The new position of the object

##### originX

[`TOriginX`](/api/type-aliases/toriginx/)

Horizontal origin: 'left', 'center' or 'right'

##### originY

[`TOriginY`](/api/type-aliases/toriginy/)

Vertical origin: 'top', 'center' or 'bottom'

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`setPositionByOrigin`](/api/classes/interactivefabricobject/#setpositionbyorigin)

***

### setRelativeX()

> **setRelativeX**(`value`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:125](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L125)

#### Parameters

##### value

`number`

x position according to object's originX property in parent's coordinate plane\
if parent is canvas then this method is identical to [setX](/api/classes/fabricobject/#setx)

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`setRelativeX`](/api/classes/interactivefabricobject/#setrelativex)

***

### setRelativeXY()

> **setRelativeXY**(`point`, `originX?`, `originY?`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:188](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L188)

As [setXY](/api/classes/fabricobject/#setxy), but in current parent's coordinate plane (the current group if any or the canvas)

#### Parameters

##### point

[`Point`](/api/classes/point/)

position according to object's originX originY properties in parent's coordinate plane

##### originX?

[`TOriginX`](/api/type-aliases/toriginx/) = `...`

Horizontal origin: 'left', 'center' or 'right'

##### originY?

[`TOriginY`](/api/type-aliases/toriginy/) = `...`

Vertical origin: 'top', 'center' or 'bottom'

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`setRelativeXY`](/api/classes/interactivefabricobject/#setrelativexy)

***

### setRelativeY()

> **setRelativeY**(`value`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:141](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L141)

#### Parameters

##### value

`number`

y position according to object's originY property in parent's coordinate plane\
if parent is canvas then this property is identical to [setY](/api/classes/fabricobject/#sety)

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`setRelativeY`](/api/classes/interactivefabricobject/#setrelativey)

***

### setX()

> **setX**(`value`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:95](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L95)

#### Parameters

##### value

`number`

x position according to object's originX property in canvas coordinate plane

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`setX`](/api/classes/interactivefabricobject/#setx)

***

### setXY()

> **setXY**(`point`, `originX?`, `originY?`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:165](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L165)

Set an object position to a particular point, the point is intended in absolute ( canvas ) coordinate.
You can specify originX and originY values,
that otherwise are the object's current values.

#### Parameters

##### point

[`Point`](/api/classes/point/)

position in scene coordinate plane

##### originX?

[`TOriginX`](/api/type-aliases/toriginx/)

Horizontal origin: 'left', 'center' or 'right'

##### originY?

[`TOriginY`](/api/type-aliases/toriginy/)

Vertical origin: 'top', 'center' or 'bottom'

#### Returns

`void`

#### Example

```ts
object.setXY(new Point(5, 5), 'left', 'bottom').
```

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`setXY`](/api/classes/interactivefabricobject/#setxy)

***

### setY()

> **setY**(`value`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:109](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L109)

#### Parameters

##### value

`number`

y position according to object's originY property in canvas coordinate plane

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`setY`](/api/classes/interactivefabricobject/#sety)

***

### shouldCache()

> **shouldCache**(): `boolean`

Defined in: [src/shapes/Object/Object.ts:775](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L775)

Decide if the object should cache or not. Create its own cache level
objectCaching is a global flag, wins over everything
needsItsOwnCache should be used when the object drawing method requires
a cache step.
Generally you do not cache objects in groups because the group outside is cached.
Read as: cache if is needed, or if the feature is enabled but we are not already caching.

#### Returns

`boolean`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`shouldCache`](/api/classes/interactivefabricobject/#shouldcache)

***

### shouldStartDragging()

> **shouldStartDragging**(`_e`): `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:692](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L692)

Override to customize Drag behavior
Fired from Canvas#\_onMouseMove

#### Parameters

##### \_e

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

#### Returns

`boolean`

true in order for the window to start a drag session

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`shouldStartDragging`](/api/classes/interactivefabricobject/#shouldstartdragging)

***

### strokeBorders()

> **strokeBorders**(`ctx`, `size`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:404](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L404)

override this function in order to customize the drawing of the control box, e.g. rounded corners, different border style.

#### Parameters

##### ctx

`CanvasRenderingContext2D`

ctx is rotated and translated so that (0,0) is at object's center

##### size

[`Point`](/api/classes/point/)

the control box size used

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`strokeBorders`](/api/classes/interactivefabricobject/#strokeborders)

***

### toBlob()

> **toBlob**(`options`): `Promise`\<`null` \| `Blob`\>

Defined in: [src/shapes/Object/Object.ts:1396](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1396)

#### Parameters

##### options

`toDataURLOptions` = `{}`

#### Returns

`Promise`\<`null` \| `Blob`\>

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`toBlob`](/api/classes/interactivefabricobject/#toblob)

***

### toCanvasElement()

> **toCanvasElement**(`options`): `HTMLCanvasElement`

Defined in: [src/shapes/Object/Object.ts:1293](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1293)

Converts an object into a HTMLCanvas element

#### Parameters

##### options

`ObjectToCanvasElementOptions` = `{}`

Options object

#### Returns

`HTMLCanvasElement`

Returns DOM element <canvas> with the FabricObject

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`toCanvasElement`](/api/classes/interactivefabricobject/#tocanvaselement)

***

### toClipPathSVG()

> **toClipPathSVG**(`this`, `reviver?`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:159](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/FabricObjectSVGExportMixin.ts#L159)

Returns svg clipPath representation of an instance

#### Parameters

##### this

`FabricObjectSVGExportMixin` & `FabricObject`\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

##### reviver?

[`TSVGReviver`](/api/type-aliases/tsvgreviver/)

Method for further parsing of svg representation.

#### Returns

`string`

svg representation of an instance

#### Inherited from

`FabricObjectSVGExportMixin.toClipPathSVG`

***

### toDatalessObject()

> **toDatalessObject**(`propertiesToInclude?`): `any`

Defined in: [src/shapes/Object/Object.ts:1849](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1849)

Returns (dataless) object representation of an instance

#### Parameters

##### propertiesToInclude?

`any`[]

Any properties that you might want to additionally include in the output

#### Returns

`any`

Object representation of an instance

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`toDatalessObject`](/api/classes/interactivefabricobject/#todatalessobject)

***

### toDataURL()

> **toDataURL**(`options`): `string`

Defined in: [src/shapes/Object/Object.ts:1389](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1389)

Converts an object into a data-url-like string

#### Parameters

##### options

`toDataURLOptions` = `{}`

Options object

#### Returns

`string`

Returns a data: URL containing a representation of the object in the format specified by options.format

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`toDataURL`](/api/classes/interactivefabricobject/#todataurl)

***

### toggle()

> **toggle**(`property`): `FabricObject`\<`Props`, `SProps`, `EventSpec`\>

Defined in: [src/CommonMethods.ts:46](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/CommonMethods.ts#L46)

Toggles specified property from `true` to `false` or from `false` to `true`

#### Parameters

##### property

`string`

Property to toggle

#### Returns

`FabricObject`\<`Props`, `SProps`, `EventSpec`\>

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`toggle`](/api/classes/interactivefabricobject/#toggle)

***

### toJSON()

> **toJSON**(): `any`

Defined in: [src/shapes/Object/Object.ts:1437](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1437)

Returns a JSON representation of an instance

#### Returns

`any`

JSON

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`toJSON`](/api/classes/interactivefabricobject/#tojson)

***

### toObject()

> **toObject**(`propertiesToInclude?`): `any`

Defined in: [src/shapes/Object/Object.ts:1756](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1756)

Returns an object representation of an instance

#### Parameters

##### propertiesToInclude?

`any`[] = `[]`

Any properties that you might want to additionally include in the output

#### Returns

`any`

Object representation of an instance

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`toObject`](/api/classes/interactivefabricobject/#toobject)

***

### toString()

> **toString**(): `string`

Defined in: [src/shapes/Object/Object.ts:1889](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1889)

Returns a string representation of an instance

#### Returns

`string`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`toString`](/api/classes/interactivefabricobject/#tostring)

***

### toSVG()

> **toSVG**(`this`, `reviver?`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:145](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/FabricObjectSVGExportMixin.ts#L145)

Returns svg representation of an instance

#### Parameters

##### this

`FabricObjectSVGExportMixin` & `FabricObject`\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

##### reviver?

[`TSVGReviver`](/api/type-aliases/tsvgreviver/)

Method for further parsing of svg representation.

#### Returns

`string`

svg representation of an instance

#### Inherited from

`FabricObjectSVGExportMixin.toSVG`

***

### transform()

> **transform**(`ctx`): `void`

Defined in: [src/shapes/Object/Object.ts:517](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L517)

Transforms context when rendering an object

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Context

#### Returns

`void`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`transform`](/api/classes/interactivefabricobject/#transform)

***

### transformMatrixKey()

> **transformMatrixKey**(`skipGroup`): `number`[]

Defined in: [src/shapes/Object/ObjectGeometry.ts:455](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L455)

#### Parameters

##### skipGroup

`boolean` = `false`

#### Returns

`number`[]

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`transformMatrixKey`](/api/classes/interactivefabricobject/#transformmatrixkey)

***

### translateToCenterPoint()

> **translateToCenterPoint**(`point`, `originX`, `originY`): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:690](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L690)

Translates the coordinates from origin to center coordinates (based on the object's dimensions)

#### Parameters

##### point

[`Point`](/api/classes/point/)

The point which corresponds to the originX and originY params

##### originX

[`TOriginX`](/api/type-aliases/toriginx/)

Horizontal origin: 'left', 'center' or 'right'

##### originY

[`TOriginY`](/api/type-aliases/toriginy/)

Vertical origin: 'top', 'center' or 'bottom'

#### Returns

[`Point`](/api/classes/point/)

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`translateToCenterPoint`](/api/classes/interactivefabricobject/#translatetocenterpoint)

***

### translateToGivenOrigin()

> **translateToGivenOrigin**(`point`, `fromOriginX`, `fromOriginY`, `toOriginX`, `toOriginY`): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:662](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L662)

Translates the coordinates from a set of origin to another (based on the object's dimensions)

#### Parameters

##### point

[`Point`](/api/classes/point/)

The point which corresponds to the originX and originY params

##### fromOriginX

[`TOriginX`](/api/type-aliases/toriginx/)

Horizontal origin: 'left', 'center' or 'right'

##### fromOriginY

[`TOriginY`](/api/type-aliases/toriginy/)

Vertical origin: 'top', 'center' or 'bottom'

##### toOriginX

[`TOriginX`](/api/type-aliases/toriginx/)

Horizontal origin: 'left', 'center' or 'right'

##### toOriginY

[`TOriginY`](/api/type-aliases/toriginy/)

Vertical origin: 'top', 'center' or 'bottom'

#### Returns

[`Point`](/api/classes/point/)

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`translateToGivenOrigin`](/api/classes/interactivefabricobject/#translatetogivenorigin)

***

### translateToOriginPoint()

> **translateToOriginPoint**(`center`, `originX`, `originY`): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:718](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L718)

Translates the coordinates from center to origin coordinates (based on the object's dimensions)

#### Parameters

##### center

[`Point`](/api/classes/point/)

The point which corresponds to center of the object

##### originX

[`TOriginX`](/api/type-aliases/toriginx/)

Horizontal origin: 'left', 'center' or 'right'

##### originY

[`TOriginY`](/api/type-aliases/toriginy/)

Vertical origin: 'top', 'center' or 'bottom'

#### Returns

[`Point`](/api/classes/point/)

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`translateToOriginPoint`](/api/classes/interactivefabricobject/#translatetooriginpoint)

***

### ~~willDrawShadow()~~

> **willDrawShadow**(): `boolean`

Defined in: [src/shapes/Object/Object.ts:788](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L788)

Check if this object will cast a shadow with an offset.
used by Group.shouldCache to know if child has a shadow recursively

:::caution[Deprecated]
This API is no longer supported and may be removed in a future release.
:::

#### Returns

`boolean`

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`willDrawShadow`](/api/classes/interactivefabricobject/#willdrawshadow)

***

### \_fromObject()

> `static` **\_fromObject**\<`S`\>(`__namedParameters`, `__namedParameters`): `Promise`\<`S`\>

Defined in: [src/shapes/Object/Object.ts:1902](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1902)

#### Type Parameters

##### S

`S` *extends* [`BaseFabricObject`](/api/classes/basefabricobject/)\<`Partial`\<`ObjectProps`\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

#### Parameters

##### \_\_namedParameters

`Record`\<`string`, `unknown`\>

##### \_\_namedParameters

[`Abortable`](/api/type-aliases/abortable/) & `object` = `{}`

#### Returns

`Promise`\<`S`\>

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`_fromObject`](/api/classes/interactivefabricobject/#_fromobject)

***

### createControls()

> `static` **createControls**(): `object`

Defined in: [src/shapes/Object/InteractiveObject.ts:170](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L170)

Creates the default control object.
If you prefer to have on instance of controls shared among all objects
make this function return an empty object and add controls to the ownDefaults

#### Returns

`object`

##### controls

> **controls**: `Record`\<`string`, [`Control`](/api/classes/control/)\>

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`createControls`](/api/classes/interactivefabricobject/#createcontrols)

***

### fromObject()

> `static` **fromObject**\<`T`\>(`object`, `options?`): `Promise`\<[`BaseFabricObject`](/api/classes/basefabricobject/)\<`Partial`\<`ObjectProps`\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>\>

Defined in: [src/shapes/Object/Object.ts:1931](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1931)

#### Type Parameters

##### T

`T` *extends* [`TOptions`](/api/type-aliases/toptions/)\<[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/)\>

#### Parameters

##### object

`T`

##### options?

[`Abortable`](/api/type-aliases/abortable/)

#### Returns

`Promise`\<[`BaseFabricObject`](/api/classes/basefabricobject/)\<`Partial`\<`ObjectProps`\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>\>

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`fromObject`](/api/classes/interactivefabricobject/#fromobject)

***

### getDefaults()

> `static` **getDefaults**(): `Record`\<`string`, `any`\>

Defined in: [src/shapes/Object/InteractiveObject.ts:143](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L143)

#### Returns

`Record`\<`string`, `any`\>

#### Inherited from

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/).[`getDefaults`](/api/classes/interactivefabricobject/#getdefaults)
