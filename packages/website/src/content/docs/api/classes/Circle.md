---
editUrl: false
next: false
prev: false
title: "Circle"
---

Defined in: [src/shapes/Circle.ts:65](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Circle.ts#L65)

Exported so we can tweak default values

## Extends

- [`FabricObject`](/api/classes/fabricobject/)\<`Props`, `SProps`, `EventSpec`\>

## Type Parameters

### Props

`Props` *extends* [`TOptions`](/api/type-aliases/toptions/)\<[`CircleProps`](/api/interfaces/circleprops/)\> = `Partial`\<[`CircleProps`](/api/interfaces/circleprops/)\>

### SProps

`SProps` *extends* [`SerializedCircleProps`](/api/interfaces/serializedcircleprops/) = [`SerializedCircleProps`](/api/interfaces/serializedcircleprops/)

### EventSpec

`EventSpec` *extends* [`ObjectEvents`](/api/interfaces/objectevents/) = [`ObjectEvents`](/api/interfaces/objectevents/)

## Implements

- `UniqueCircleProps`

## Constructors

### Constructor

> **new Circle**\<`Props`, `SProps`, `EventSpec`\>(`options?`): `Circle`\<`Props`, `SProps`, `EventSpec`\>

Defined in: [src/shapes/Circle.ts:95](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Circle.ts#L95)

Constructor

#### Parameters

##### options?

`Props`

Options object

#### Returns

`Circle`\<`Props`, `SProps`, `EventSpec`\>

#### Overrides

[`FabricObject`](/api/classes/fabricobject/).[`constructor`](/api/classes/fabricobject/#constructor)

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

[`FabricObject`](/api/classes/fabricobject/).[`__corner`](/api/classes/fabricobject/#__corner)

***

### \_controlsVisibility

> **\_controlsVisibility**: `Record`\<`string`, `boolean`\>

Defined in: [src/shapes/Object/InteractiveObject.ts:115](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L115)

a map of control visibility for this object.
this was left when controls were introduced to not break the api too much
this takes priority over the generic control visibility

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`_controlsVisibility`](/api/classes/fabricobject/#_controlsvisibility)

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

[`FabricObject`](/api/classes/fabricobject/).[`_scaling`](/api/classes/fabricobject/#_scaling)

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

[`FabricObject`](/api/classes/fabricobject/).[`absolutePositioned`](/api/classes/fabricobject/#absolutepositioned)

***

### aCoords

> **aCoords**: [`TCornerPoint`](/api/type-aliases/tcornerpoint/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:65](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L65)

Describe object's corner position in scene coordinates.
The coordinates are derived from the following:
left, top, width, height, scaleX, scaleY, skewX, skewY, angle, strokeWidth.
The coordinates do not depend on viewport changes.
The coordinates get updated with [setCoords](/api/classes/circle/#setcoords).
You can calculate them without updating with [()](/api/classes/circle/#calcacoords)

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`aCoords`](/api/classes/fabricobject/#acoords)

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

[`FabricObject`](/api/classes/fabricobject/).[`angle`](/api/classes/fabricobject/#angle)

***

### backgroundColor

> **backgroundColor**: `string`

Defined in: [src/shapes/Object/Object.ts:202](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L202)

Background color of an object.
takes css colors https://www.w3.org/TR/css-color-3/

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`backgroundColor`](/api/classes/fabricobject/#backgroundcolor)

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

[`FabricObject`](/api/classes/fabricobject/).[`borderColor`](/api/classes/fabricobject/#bordercolor)

***

### borderDashArray

> **borderDashArray**: `null` \| `number`[]

Defined in: [src/shapes/Object/InteractiveObject.ts:78](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L78)

Array specifying dash pattern of an object's borders (hasBorder must be true)

#### Since

1.6.2

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`borderDashArray`](/api/classes/fabricobject/#borderdasharray)

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

[`FabricObject`](/api/classes/fabricobject/).[`borderOpacityWhenMoving`](/api/classes/fabricobject/#borderopacitywhenmoving)

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

[`FabricObject`](/api/classes/fabricobject/).[`borderScaleFactor`](/api/classes/fabricobject/#borderscalefactor)

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

[`FabricObject`](/api/classes/fabricobject/).[`centeredRotation`](/api/classes/fabricobject/#centeredrotation)

***

### centeredScaling

> **centeredScaling**: `boolean`

Defined in: [src/shapes/Object/Object.ts:217](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L217)

When true, this object will use center point as the origin of transformation
when being scaled via the controls.

#### Since

1.3.4

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`centeredScaling`](/api/classes/fabricobject/#centeredscaling)

***

### clipPath?

> `optional` **clipPath**: [`BaseFabricObject`](/api/classes/basefabricobject/)\<`Partial`\<`ObjectProps`\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

Defined in: [src/shapes/Object/Object.ts:213](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L213)

a fabricObject that, without stroke define a clipping area with their shape. filled in black
the clipPath object gets used when the object has rendered, and the context is placed in the center
of the object cacheCanvas.
If you want 0,0 of a clipPath to align with an object center, use clipPath.originX/Y to 'center'

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`clipPath`](/api/classes/fabricobject/#clippath)

***

### clipPathId?

> `optional` **clipPathId**: `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:20](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/FabricObjectSVGExportMixin.ts#L20)

When an object is being exported as SVG as a clippath, a reference inside the SVG is needed.
This reference is a UID in the fabric namespace and is temporary stored here.

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`clipPathId`](/api/classes/fabricobject/#clippathid)

***

### controls

> **controls**: `TControlSet`

Defined in: [src/shapes/Object/InteractiveObject.ts:121](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L121)

holds the controls for the object.
controls are added by default_controls.js

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`controls`](/api/classes/fabricobject/#controls)

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

[`FabricObject`](/api/classes/fabricobject/).[`cornerColor`](/api/classes/fabricobject/#cornercolor)

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

[`FabricObject`](/api/classes/fabricobject/).[`cornerDashArray`](/api/classes/fabricobject/#cornerdasharray)

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

[`FabricObject`](/api/classes/fabricobject/).[`cornerSize`](/api/classes/fabricobject/#cornersize)

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

[`FabricObject`](/api/classes/fabricobject/).[`cornerStrokeColor`](/api/classes/fabricobject/#cornerstrokecolor)

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

[`FabricObject`](/api/classes/fabricobject/).[`cornerStyle`](/api/classes/fabricobject/#cornerstyle)

***

### counterClockwise

> **counterClockwise**: `boolean`

Defined in: [src/shapes/Circle.ts:76](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Circle.ts#L76)

Orientation for the direction of the circle.
Setting to true will switch the arc of the circle to traverse from startAngle to endAngle in a counter-clockwise direction.
Note: this will only change how the circle is drawn, and does not affect rotational transformation.

#### Default

```ts
false
```

#### Implementation of

`UniqueCircleProps.counterClockwise`

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

[`FabricObject`](/api/classes/fabricobject/).[`dirty`](/api/classes/fabricobject/#dirty)

***

### endAngle

> **endAngle**: `number`

Defined in: [src/shapes/Circle.ts:75](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Circle.ts#L75)

Angle for the end of the circle, in degrees

#### Default

```ts
360
```

#### Implementation of

`UniqueCircleProps.endAngle`

***

### evented

> **evented**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:85](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L85)

When set to `false`, an object can not be a target of events. All events propagate through it. Introduced in v1.3.4

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`evented`](/api/classes/fabricobject/#evented)

***

### excludeFromExport

> **excludeFromExport**: `boolean`

Defined in: [src/shapes/Object/Object.ts:209](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L209)

When `true`, object is not exported in OBJECT/JSON

#### Since

1.6.3

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`excludeFromExport`](/api/classes/fabricobject/#excludefromexport)

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

[`FabricObject`](/api/classes/fabricobject/).[`fill`](/api/classes/fabricobject/#fill)

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

[`FabricObject`](/api/classes/fabricobject/).[`fillRule`](/api/classes/fabricobject/#fillrule)

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

[`FabricObject`](/api/classes/fabricobject/).[`flipX`](/api/classes/fabricobject/#flipx)

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

[`FabricObject`](/api/classes/fabricobject/).[`flipY`](/api/classes/fabricobject/#flipy)

***

### globalCompositeOperation

> **globalCompositeOperation**: `GlobalCompositeOperation`

Defined in: [src/shapes/Object/Object.ts:201](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L201)

Composite rule used for canvas globalCompositeOperation

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`globalCompositeOperation`](/api/classes/fabricobject/#globalcompositeoperation)

***

### hasBorders

> **hasBorders**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:81](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L81)

When set to `false`, object's controlling borders are not rendered

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`hasBorders`](/api/classes/fabricobject/#hasborders)

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

[`FabricObject`](/api/classes/fabricobject/).[`hasControls`](/api/classes/fabricobject/#hascontrols)

***

### height

> **height**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:573](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L573)

Object height

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`height`](/api/classes/fabricobject/#height)

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

[`FabricObject`](/api/classes/fabricobject/).[`hoverCursor`](/api/classes/fabricobject/#hovercursor)

***

### includeDefaultValues

> **includeDefaultValues**: `boolean`

Defined in: [src/shapes/Object/Object.ts:208](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L208)

When `false`, default object's values are not included in its serialization

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`includeDefaultValues`](/api/classes/fabricobject/#includedefaultvalues)

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

[`FabricObject`](/api/classes/fabricobject/).[`inverted`](/api/classes/fabricobject/#inverted)

***

### isMoving?

> `optional` **isMoving**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:127](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L127)

internal boolean to signal the code that the object is
part of the move action.

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`isMoving`](/api/classes/fabricobject/#ismoving)

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

[`FabricObject`](/api/classes/fabricobject/).[`left`](/api/classes/fabricobject/#left)

***

### lockMovementX

> **lockMovementX**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:59](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L59)

When `true`, object horizontal movement is locked

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`lockMovementX`](/api/classes/fabricobject/#lockmovementx)

***

### lockMovementY

> **lockMovementY**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:60](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L60)

When `true`, object vertical movement is locked

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`lockMovementY`](/api/classes/fabricobject/#lockmovementy)

***

### lockRotation

> **lockRotation**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:61](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L61)

When `true`, object rotation is locked

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`lockRotation`](/api/classes/fabricobject/#lockrotation)

***

### lockScalingFlip

> **lockScalingFlip**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:66](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L66)

When `true`, object cannot be flipped by scaling into negative values

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`lockScalingFlip`](/api/classes/fabricobject/#lockscalingflip)

***

### lockScalingX

> **lockScalingX**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:62](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L62)

When `true`, object horizontal scaling is locked

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`lockScalingX`](/api/classes/fabricobject/#lockscalingx)

***

### lockScalingY

> **lockScalingY**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:63](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L63)

When `true`, object vertical scaling is locked

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`lockScalingY`](/api/classes/fabricobject/#lockscalingy)

***

### lockSkewingX

> **lockSkewingX**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:64](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L64)

When `true`, object horizontal skewing is locked

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`lockSkewingX`](/api/classes/fabricobject/#lockskewingx)

***

### lockSkewingY

> **lockSkewingY**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:65](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L65)

When `true`, object vertical skewing is locked

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`lockSkewingY`](/api/classes/fabricobject/#lockskewingy)

***

### matrixCache?

> `optional` **matrixCache**: `TMatrixCache`

Defined in: [src/shapes/Object/ObjectGeometry.ts:75](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L75)

storage cache for object full transform matrix

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`matrixCache`](/api/classes/fabricobject/#matrixcache)

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

[`FabricObject`](/api/classes/fabricobject/).[`minScaleLimit`](/api/classes/fabricobject/#minscalelimit)

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

[`FabricObject`](/api/classes/fabricobject/).[`moveCursor`](/api/classes/fabricobject/#movecursor)

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

[`FabricObject`](/api/classes/fabricobject/).[`noScaleCache`](/api/classes/fabricobject/#noscalecache)

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

[`FabricObject`](/api/classes/fabricobject/).[`objectCaching`](/api/classes/fabricobject/#objectcaching)

***

### oCoords

> **oCoords**: `Record`\<`string`, `TOCoord`\>

Defined in: [src/shapes/Object/InteractiveObject.ts:98](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L98)

The object's controls' position in viewport coordinates
Calculated by [Control#positionHandler](/api/classes/control/#positionhandler) and [Control#calcCornerCoords](/api/classes/control/#calccornercoords), depending on [padding](/api/classes/fabricobject/#padding).
`corner/touchCorner` describe the 4 points forming the interactive area of the corner.
Used to draw and locate controls.

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`oCoords`](/api/classes/fabricobject/#ocoords)

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

[`FabricObject`](/api/classes/fabricobject/).[`opacity`](/api/classes/fabricobject/#opacity)

***

### ~~originX~~

> **originX**: [`TOriginX`](/api/type-aliases/toriginx/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:583](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L583)

:::caution[Deprecated]
please use 'center' as value in new projects
:::

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`originX`](/api/classes/fabricobject/#originx)

***

### ~~originY~~

> **originY**: [`TOriginY`](/api/type-aliases/toriginy/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:587](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L587)

:::caution[Deprecated]
please use 'center' as value in new projects
:::

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`originY`](/api/classes/fabricobject/#originy)

***

### ownMatrixCache?

> `optional` **ownMatrixCache**: `TMatrixCache`

Defined in: [src/shapes/Object/ObjectGeometry.ts:70](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L70)

storage cache for object transform matrix

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`ownMatrixCache`](/api/classes/fabricobject/#ownmatrixcache)

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

[`FabricObject`](/api/classes/fabricobject/).[`padding`](/api/classes/fabricobject/#padding)

***

### paintFirst

> **paintFirst**: `"fill"` \| `"stroke"`

Defined in: [src/shapes/Object/Object.ts:191](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L191)

Determines if the fill or the stroke is drawn first (one of "fill" or "stroke")

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`paintFirst`](/api/classes/fabricobject/#paintfirst)

***

### parent?

> `optional` **parent**: [`Group`](/api/classes/group/)

Defined in: [src/shapes/Object/Object.ts:1601](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1601)

A reference to the parent of the object
Used to keep the original parent ref when the object has been added to an ActiveSelection, hence loosing the `group` ref

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`parent`](/api/classes/fabricobject/#parent)

***

### perPixelTargetFind

> **perPixelTargetFind**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:86](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L86)

When set to `true`, objects are "found" on canvas on per-pixel basis rather than according to bounding box

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`perPixelTargetFind`](/api/classes/fabricobject/#perpixeltargetfind)

***

### radius

> **radius**: `number`

Defined in: [src/shapes/Circle.ts:73](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Circle.ts#L73)

Radius of this circle

#### Default

```ts
0
```

#### Implementation of

`UniqueCircleProps.radius`

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

[`FabricObject`](/api/classes/fabricobject/).[`scaleX`](/api/classes/fabricobject/#scalex)

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

[`FabricObject`](/api/classes/fabricobject/).[`scaleY`](/api/classes/fabricobject/#scaley)

***

### selectable

> **selectable**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:84](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L84)

When set to `false`, an object can not be selected for modification (using either point-click-based or group-based selection).
But events still fire on it.

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`selectable`](/api/classes/fabricobject/#selectable)

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

[`FabricObject`](/api/classes/fabricobject/).[`selectionBackgroundColor`](/api/classes/fabricobject/#selectionbackgroundcolor)

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

[`FabricObject`](/api/classes/fabricobject/).[`shadow`](/api/classes/fabricobject/#shadow)

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

[`FabricObject`](/api/classes/fabricobject/).[`skewX`](/api/classes/fabricobject/#skewx)

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

[`FabricObject`](/api/classes/fabricobject/).[`skewY`](/api/classes/fabricobject/#skewy)

***

### snapAngle?

> `optional` **snapAngle**: [`TDegree`](/api/type-aliases/tdegree/)

Defined in: [src/shapes/Object/InteractiveObject.ts:56](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L56)

The angle that an object will lock to while rotating.

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`snapAngle`](/api/classes/fabricobject/#snapangle)

***

### snapThreshold?

> `optional` **snapThreshold**: [`TDegree`](/api/type-aliases/tdegree/)

Defined in: [src/shapes/Object/InteractiveObject.ts:57](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L57)

The angle difference from the current snapped angle in which snapping should occur.
When undefined, the snapThreshold will default to the snapAngle.

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`snapThreshold`](/api/classes/fabricobject/#snapthreshold)

***

### startAngle

> **startAngle**: `number`

Defined in: [src/shapes/Circle.ts:74](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Circle.ts#L74)

Angle for the start of the circle, in degrees.

#### Default

```ts
0
```

#### Implementation of

`UniqueCircleProps.startAngle`

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

[`FabricObject`](/api/classes/fabricobject/).[`stroke`](/api/classes/fabricobject/#stroke)

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

[`FabricObject`](/api/classes/fabricobject/).[`strokeDashArray`](/api/classes/fabricobject/#strokedasharray)

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

[`FabricObject`](/api/classes/fabricobject/).[`strokeDashOffset`](/api/classes/fabricobject/#strokedashoffset)

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

[`FabricObject`](/api/classes/fabricobject/).[`strokeLineCap`](/api/classes/fabricobject/#strokelinecap)

***

### strokeLineJoin

> **strokeLineJoin**: `CanvasLineJoin`

Defined in: [src/shapes/Object/Object.ts:198](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L198)

Corner style of an object's stroke (one of "bevel", "round", "miter")

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`strokeLineJoin`](/api/classes/fabricobject/#strokelinejoin)

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

[`FabricObject`](/api/classes/fabricobject/).[`strokeMiterLimit`](/api/classes/fabricobject/#strokemiterlimit)

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

[`FabricObject`](/api/classes/fabricobject/).[`strokeUniform`](/api/classes/fabricobject/#strokeuniform)

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

[`FabricObject`](/api/classes/fabricobject/).[`strokeWidth`](/api/classes/fabricobject/#strokewidth)

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

[`FabricObject`](/api/classes/fabricobject/).[`top`](/api/classes/fabricobject/#top)

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

[`FabricObject`](/api/classes/fabricobject/).[`touchCornerSize`](/api/classes/fabricobject/#touchcornersize)

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

[`FabricObject`](/api/classes/fabricobject/).[`transparentCorners`](/api/classes/fabricobject/#transparentcorners)

***

### visible

> **visible**: `boolean`

Defined in: [src/shapes/Object/Object.ts:206](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L206)

When set to `false`, an object is not rendered on canvas

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`visible`](/api/classes/fabricobject/#visible)

***

### width

> **width**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:572](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L572)

Object width

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`width`](/api/classes/fabricobject/#width)

***

### ATTRIBUTE\_NAMES

> `static` **ATTRIBUTE\_NAMES**: `string`[]

Defined in: [src/shapes/Circle.ts:212](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Circle.ts#L212)

List of attribute names to account for when parsing SVG element (used by [Circle.fromElement](/api/classes/circle/#fromelement))
@see: http://www.w3.org/TR/SVG/shapes.html#CircleElement

***

### cacheProperties

> `static` **cacheProperties**: `string`[]

Defined in: [src/shapes/Circle.ts:80](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Circle.ts#L80)

List of properties to consider when checking if cache needs refresh
Those properties are checked by
calls to Object.set(key, value). If the key is in this list, the object is marked as dirty
and refreshed at the next render

#### Overrides

[`FabricObject`](/api/classes/fabricobject/).[`cacheProperties`](/api/classes/fabricobject/#cacheproperties)

***

### colorProperties

> `static` **colorProperties**: `string`[]

Defined in: [src/shapes/Object/Object.ts:1508](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1508)

List of properties to consider for animating colors.

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`colorProperties`](/api/classes/fabricobject/#colorproperties)

***

### customProperties

> `static` **customProperties**: `string`[] = `[]`

Defined in: [src/shapes/Object/Object.ts:1749](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1749)

Define a list of custom properties that will be serialized when
instance.toObject() gets called

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`customProperties`](/api/classes/fabricobject/#customproperties)

***

### ownDefaults

> `static` **ownDefaults**: `Partial`\<[`TClassProperties`](/api/type-aliases/tclassproperties/)\<`Circle`\<`Partial`\<[`CircleProps`](/api/interfaces/circleprops/)\>, [`SerializedCircleProps`](/api/interfaces/serializedcircleprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>\>\> = `circleDefaultValues`

Defined in: [src/shapes/Circle.ts:82](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Circle.ts#L82)

#### Overrides

[`FabricObject`](/api/classes/fabricobject/).[`ownDefaults`](/api/classes/fabricobject/#owndefaults)

***

### stateProperties

> `static` **stateProperties**: `string`[]

Defined in: [src/shapes/Object/Object.ts:225](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L225)

This list of properties is used to check if the state of an object is changed.
This state change now is only used for children of groups to understand if a group
needs its cache regenerated during a .set call

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`stateProperties`](/api/classes/fabricobject/#stateproperties)

***

### type

> `static` **type**: `string` = `'Circle'`

Defined in: [src/shapes/Circle.ts:78](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Circle.ts#L78)

The class type.
This is used for serialization and deserialization purposes and internally it can be used
to identify classes.
When we transform a class in a plain JS object we need a way to recognize which class it was,
and the type is the way we do that. It has no other purposes and you should not give one.
Hard to reach on instances and please do not use to drive instance's logic (this.constructor.type).
To idenfity a class use instanceof class ( instanceof Rect ).
We do not do that in fabricJS code because we want to try to have code splitting possible.

#### Overrides

[`FabricObject`](/api/classes/fabricobject/).[`type`](/api/classes/fabricobject/#type)

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

[`FabricObject`](/api/classes/fabricobject/).[`type`](/api/classes/fabricobject/#type-1)

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

[`FabricObject`](/api/classes/fabricobject/).[`_drawClipPath`](/api/classes/fabricobject/#_drawclippath)

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

[`FabricObject`](/api/classes/fabricobject/).[`_limitCacheSize`](/api/classes/fabricobject/#_limitcachesize)

***

### \_removeCacheCanvas()

> **\_removeCacheCanvas**(): `void`

Defined in: [src/shapes/Object/Object.ts:707](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L707)

Remove cacheCanvas and its dimensions from the objects

#### Returns

`void`

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`_removeCacheCanvas`](/api/classes/fabricobject/#_removecachecanvas)

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

[`FabricObject`](/api/classes/fabricobject/).[`_renderControls`](/api/classes/fabricobject/#_rendercontrols)

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

[`FabricObject`](/api/classes/fabricobject/).[`_setClippingProperties`](/api/classes/fabricobject/#_setclippingproperties)

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

[`FabricObject`](/api/classes/fabricobject/).[`_setFillStyles`](/api/classes/fabricobject/#_setfillstyles)

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

[`FabricObject`](/api/classes/fabricobject/).[`_setStrokeStyles`](/api/classes/fabricobject/#_setstrokestyles)

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

[`FabricObject`](/api/classes/fabricobject/).[`_setupCompositeOperation`](/api/classes/fabricobject/#_setupcompositeoperation)

***

### \_toSVG()

> **\_toSVG**(): `string`[]

Defined in: [src/shapes/Circle.ts:176](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Circle.ts#L176)

Returns svg representation of an instance

#### Returns

`string`[]

an array of strings with the specific svg representation
of the instance

#### Overrides

[`FabricObject`](/api/classes/fabricobject/).[`_toSVG`](/api/classes/fabricobject/#_tosvg)

***

### addPaintOrder()

> **addPaintOrder**(`this`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:265](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/FabricObjectSVGExportMixin.ts#L265)

#### Parameters

##### this

`FabricObjectSVGExportMixin` & [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

#### Returns

`string`

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`addPaintOrder`](/api/classes/fabricobject/#addpaintorder)

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

[`FabricObject`](/api/classes/fabricobject/).[`animate`](/api/classes/fabricobject/#animate)

***

### calcACoords()

> **calcACoords**(): [`TCornerPoint`](/api/type-aliases/tcornerpoint/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:429](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L429)

Calculates the coordinates of the 4 corner of the bbox, in absolute coordinates.
those never change with zoom or viewport changes.

#### Returns

[`TCornerPoint`](/api/type-aliases/tcornerpoint/)

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`calcACoords`](/api/classes/fabricobject/#calcacoords)

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

[`FabricObject`](/api/classes/fabricobject/).[`calcOCoords`](/api/classes/fabricobject/#calcocoords)

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

[`FabricObject`](/api/classes/fabricobject/).[`calcOwnMatrix`](/api/classes/fabricobject/#calcownmatrix)

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

[`FabricObject`](/api/classes/fabricobject/).[`calcTransformMatrix`](/api/classes/fabricobject/#calctransformmatrix)

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

[`FabricObject`](/api/classes/fabricobject/).[`canDrop`](/api/classes/fabricobject/#candrop)

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

[`FabricObject`](/api/classes/fabricobject/).[`clearContextTop`](/api/classes/fabricobject/#clearcontexttop)

***

### clone()

> **clone**(`propertiesToInclude?`): `Promise`\<`Circle`\<`Props`, `SProps`, `EventSpec`\>\>

Defined in: [src/shapes/Object/Object.ts:1245](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1245)

Clones an instance.

#### Parameters

##### propertiesToInclude?

`string`[]

Any properties that you might want to additionally include in the output

#### Returns

`Promise`\<`Circle`\<`Props`, `SProps`, `EventSpec`\>\>

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`clone`](/api/classes/fabricobject/#clone)

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

[`FabricObject`](/api/classes/fabricobject/).[`cloneAsImage`](/api/classes/fabricobject/#cloneasimage)

***

### complexity()

> **complexity**(): `number`

Defined in: [src/shapes/Object/Object.ts:1429](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1429)

Returns complexity of an instance

#### Returns

`number`

complexity of this instance (is 1 unless subclassed)

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`complexity`](/api/classes/fabricobject/#complexity)

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

[`FabricObject`](/api/classes/fabricobject/).[`containsPoint`](/api/classes/fabricobject/#containspoint)

***

### dispose()

> **dispose**(): `void`

Defined in: [src/shapes/Object/Object.ts:1493](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1493)

cancel instance's running animations
override if necessary to dispose artifacts such as `clipPath`

#### Returns

`void`

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`dispose`](/api/classes/fabricobject/#dispose)

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

[`FabricObject`](/api/classes/fabricobject/).[`drawBorders`](/api/classes/fabricobject/#drawborders)

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

[`FabricObject`](/api/classes/fabricobject/).[`drawCacheOnCanvas`](/api/classes/fabricobject/#drawcacheoncanvas)

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

[`FabricObject`](/api/classes/fabricobject/).[`drawClipPathOnCache`](/api/classes/fabricobject/#drawclippathoncache)

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

[`FabricObject`](/api/classes/fabricobject/).[`drawControls`](/api/classes/fabricobject/#drawcontrols)

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

[`FabricObject`](/api/classes/fabricobject/).[`drawControlsConnectingLines`](/api/classes/fabricobject/#drawcontrolsconnectinglines)

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

[`FabricObject`](/api/classes/fabricobject/).[`drawObject`](/api/classes/fabricobject/#drawobject)

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

[`FabricObject`](/api/classes/fabricobject/).[`drawSelectionBackground`](/api/classes/fabricobject/#drawselectionbackground)

***

### findCommonAncestors()

> **findCommonAncestors**\<`T`\>(`other`): `AncestryComparison`

Defined in: [src/shapes/Object/Object.ts:1640](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1640)

Compare ancestors

#### Type Parameters

##### T

`T` *extends* `Circle`\<`Props`, `SProps`, `EventSpec`\>

#### Parameters

##### other

`T`

#### Returns

`AncestryComparison`

an object that represent the ancestry situation.

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`findCommonAncestors`](/api/classes/fabricobject/#findcommonancestors)

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

[`FabricObject`](/api/classes/fabricobject/).[`fire`](/api/classes/fabricobject/#fire)

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

[`FabricObject`](/api/classes/fabricobject/).[`forEachControl`](/api/classes/fabricobject/#foreachcontrol)

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

[`FabricObject`](/api/classes/fabricobject/).[`get`](/api/classes/fabricobject/#get)

***

### getActiveControl()

> **getActiveControl**(): `undefined` \| \{ `control`: [`Control`](/api/classes/control/); `coord`: `TOCoord`; `key`: `string`; \}

Defined in: [src/shapes/Object/InteractiveObject.ts:197](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L197)

#### Returns

`undefined` \| \{ `control`: [`Control`](/api/classes/control/); `coord`: `TOCoord`; `key`: `string`; \}

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`getActiveControl`](/api/classes/fabricobject/#getactivecontrol)

***

### getAncestors()

> **getAncestors**(): `Ancestors`

Defined in: [src/shapes/Object/Object.ts:1623](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1623)

#### Returns

`Ancestors`

ancestors (excluding `ActiveSelection`) from bottom to top

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`getAncestors`](/api/classes/fabricobject/#getancestors)

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

[`FabricObject`](/api/classes/fabricobject/).[`getBoundingRect`](/api/classes/fabricobject/#getboundingrect)

***

### getCanvasRetinaScaling()

> **getCanvasRetinaScaling**(): `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:402](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L402)

#### Returns

`number`

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`getCanvasRetinaScaling`](/api/classes/fabricobject/#getcanvasretinascaling)

***

### getCenterPoint()

> **getCenterPoint**(): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:740](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L740)

Returns the center coordinates of the object relative to canvas

#### Returns

[`Point`](/api/classes/point/)

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`getCenterPoint`](/api/classes/fabricobject/#getcenterpoint)

***

### getCoords()

> **getCoords**(): [`Point`](/api/classes/point/)[]

Defined in: [src/shapes/Object/ObjectGeometry.ts:206](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L206)

#### Returns

[`Point`](/api/classes/point/)[]

[tl, tr, br, bl] in the scene plane

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`getCoords`](/api/classes/fabricobject/#getcoords)

***

### getObjectOpacity()

> **getObjectOpacity**(): `number`

Defined in: [src/shapes/Object/Object.ts:560](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L560)

Return the object opacity counting also the group property

#### Returns

`number`

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`getObjectOpacity`](/api/classes/fabricobject/#getobjectopacity)

***

### getObjectScaling()

> **getObjectScaling**(): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/Object.ts:529](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L529)

Return the object scale factor counting also the group scaling

#### Returns

[`Point`](/api/classes/point/)

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`getObjectScaling`](/api/classes/fabricobject/#getobjectscaling)

***

### ~~getPointByOrigin()~~

> **getPointByOrigin**(`originX`, `originY`): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:763](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L763)

Alias of [getPositionByOrigin](/api/classes/circle/#getpositionbyorigin)

:::caution[Deprecated]
use [getPositionByOrigin](/api/classes/circle/#getpositionbyorigin) instead
:::

#### Parameters

##### originX

[`TOriginX`](/api/type-aliases/toriginx/)

##### originY

[`TOriginY`](/api/type-aliases/toriginy/)

#### Returns

[`Point`](/api/classes/point/)

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`getPointByOrigin`](/api/classes/fabricobject/#getpointbyorigin)

***

### getPositionByOrigin()

> **getPositionByOrigin**(`originX`, `originY`): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:779](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L779)

This function is the mirror of [setPositionByOrigin](/api/classes/circle/#setpositionbyorigin)
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

[`FabricObject`](/api/classes/fabricobject/).[`getPositionByOrigin`](/api/classes/fabricobject/#getpositionbyorigin)

***

### getRadiusX()

> **getRadiusX**(): `number`

Defined in: [src/shapes/Circle.ts:137](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Circle.ts#L137)

Returns horizontal radius of an object (according to how an object is scaled)

#### Returns

`number`

***

### getRadiusY()

> **getRadiusY**(): `number`

Defined in: [src/shapes/Circle.ts:145](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Circle.ts#L145)

Returns vertical radius of an object (according to how an object is scaled)

#### Returns

`number`

***

### getRelativeCenterPoint()

> **getRelativeCenterPoint**(): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:751](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L751)

Returns the center coordinates of the object relative to it's parent

#### Returns

[`Point`](/api/classes/point/)

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`getRelativeCenterPoint`](/api/classes/fabricobject/#getrelativecenterpoint)

***

### getRelativeX()

> **getRelativeX**(): `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:117](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L117)

#### Returns

`number`

x position according to object's originX property in parent's coordinate plane\
if parent is canvas then this property is identical to [getX](/api/classes/circle/#getx)

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`getRelativeX`](/api/classes/fabricobject/#getrelativex)

***

### getRelativeXY()

> **getRelativeXY**(): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:178](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L178)

#### Returns

[`Point`](/api/classes/point/)

x,y position according to object's originX originY properties in parent's coordinate plane

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`getRelativeXY`](/api/classes/fabricobject/#getrelativexy)

***

### getRelativeY()

> **getRelativeY**(): `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:133](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L133)

#### Returns

`number`

y position according to object's originY property in parent's coordinate plane\
if parent is canvas then this property is identical to [getY](/api/classes/circle/#gety)

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`getRelativeY`](/api/classes/fabricobject/#getrelativey)

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

[`FabricObject`](/api/classes/fabricobject/).[`getScaledHeight`](/api/classes/fabricobject/#getscaledheight)

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

[`FabricObject`](/api/classes/fabricobject/).[`getScaledWidth`](/api/classes/fabricobject/#getscaledwidth)

***

### getSvgCommons()

> **getSvgCommons**(`this`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:100](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/FabricObjectSVGExportMixin.ts#L100)

Returns id attribute for svg output

#### Parameters

##### this

`FabricObjectSVGExportMixin` & [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\> & `object`

#### Returns

`string`

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`getSvgCommons`](/api/classes/fabricobject/#getsvgcommons)

***

### getSvgFilter()

> **getSvgFilter**(`this`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:90](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/FabricObjectSVGExportMixin.ts#L90)

Returns filter for svg shadow

#### Parameters

##### this

`FabricObjectSVGExportMixin` & [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

#### Returns

`string`

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`getSvgFilter`](/api/classes/fabricobject/#getsvgfilter)

***

### getSvgStyles()

> **getSvgStyles**(`this`, `skipShadow?`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:27](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/FabricObjectSVGExportMixin.ts#L27)

Returns styles-string for svg-export

#### Parameters

##### this

`FabricObjectSVGExportMixin` & [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

##### skipShadow?

`boolean`

a boolean to skip shadow filter output

#### Returns

`string`

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`getSvgStyles`](/api/classes/fabricobject/#getsvgstyles)

***

### getSvgTransform()

> **getSvgTransform**(`this`, `full?`, `additionalTransform?`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:119](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/FabricObjectSVGExportMixin.ts#L119)

Returns transform-string for svg-export

#### Parameters

##### this

`FabricObjectSVGExportMixin` & [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

##### full?

`boolean`

##### additionalTransform?

`string` = `''`

#### Returns

`string`

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`getSvgTransform`](/api/classes/fabricobject/#getsvgtransform)

***

### getTotalAngle()

> **getTotalAngle**(): [`TDegree`](/api/type-aliases/tdegree/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:410](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L410)

Returns the object angle relative to canvas counting also the group property

#### Returns

[`TDegree`](/api/type-aliases/tdegree/)

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`getTotalAngle`](/api/classes/fabricobject/#gettotalangle)

***

### getTotalObjectScaling()

> **getTotalObjectScaling**(): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/Object.ts:546](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L546)

Return the object scale factor counting also the group scaling, zoom and retina

#### Returns

[`Point`](/api/classes/point/)

object with scaleX and scaleY properties

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`getTotalObjectScaling`](/api/classes/fabricobject/#gettotalobjectscaling)

***

### getViewportTransform()

> **getViewportTransform**(): [`TMat2D`](/api/type-aliases/tmat2d/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:420](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L420)

Retrieves viewportTransform from Object's canvas if available

#### Returns

[`TMat2D`](/api/type-aliases/tmat2d/)

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`getViewportTransform`](/api/classes/fabricobject/#getviewporttransform)

***

### getX()

> **getX**(): `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:88](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L88)

#### Returns

`number`

x position according to object's originX property in canvas coordinate plane

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`getX`](/api/classes/fabricobject/#getx)

***

### getXY()

> **getXY**(): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:148](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L148)

#### Returns

[`Point`](/api/classes/point/)

x position according to object's originX originY properties in canvas coordinate plane

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`getXY`](/api/classes/fabricobject/#getxy)

***

### getY()

> **getY**(): `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:102](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L102)

#### Returns

`number`

y position according to object's originY property in canvas coordinate plane

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`getY`](/api/classes/fabricobject/#gety)

***

### hasCommonAncestors()

> **hasCommonAncestors**\<`T`\>(`other`): `boolean`

Defined in: [src/shapes/Object/Object.ts:1705](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1705)

#### Type Parameters

##### T

`T` *extends* `Circle`\<`Props`, `SProps`, `EventSpec`\>

#### Parameters

##### other

`T`

#### Returns

`boolean`

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`hasCommonAncestors`](/api/classes/fabricobject/#hascommonancestors)

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

[`FabricObject`](/api/classes/fabricobject/).[`hasFill`](/api/classes/fabricobject/#hasfill)

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

[`FabricObject`](/api/classes/fabricobject/).[`hasStroke`](/api/classes/fabricobject/#hasstroke)

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

[`FabricObject`](/api/classes/fabricobject/).[`intersectsWithObject`](/api/classes/fabricobject/#intersectswithobject)

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

[`FabricObject`](/api/classes/fabricobject/).[`intersectsWithRect`](/api/classes/fabricobject/#intersectswithrect)

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

[`FabricObject`](/api/classes/fabricobject/).[`isCacheDirty`](/api/classes/fabricobject/#iscachedirty)

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

[`FabricObject`](/api/classes/fabricobject/).[`isContainedWithinObject`](/api/classes/fabricobject/#iscontainedwithinobject)

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

[`FabricObject`](/api/classes/fabricobject/).[`isContainedWithinRect`](/api/classes/fabricobject/#iscontainedwithinrect)

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

[`FabricObject`](/api/classes/fabricobject/).[`isControlVisible`](/api/classes/fabricobject/#iscontrolvisible)

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

[`FabricObject`](/api/classes/fabricobject/).[`isDescendantOf`](/api/classes/fabricobject/#isdescendantof)

***

### isInFrontOf()

> **isInFrontOf**\<`T`\>(`other`): `undefined` \| `boolean`

Defined in: [src/shapes/Object/Object.ts:1715](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1715)

#### Type Parameters

##### T

`T` *extends* `Circle`\<`Props`, `SProps`, `EventSpec`\>

#### Parameters

##### other

`T`

object to compare against

#### Returns

`undefined` \| `boolean`

if objects do not share a common ancestor or they are strictly equal it is impossible to determine which is in front of the other; in such cases the function returns `undefined`

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`isInFrontOf`](/api/classes/fabricobject/#isinfrontof)

***

### isNotVisible()

> **isNotVisible**(): `boolean`

Defined in: [src/shapes/Object/Object.ts:637](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L637)

return if the object would be visible in rendering

#### Returns

`boolean`

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`isNotVisible`](/api/classes/fabricobject/#isnotvisible)

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

[`FabricObject`](/api/classes/fabricobject/).[`isOnScreen`](/api/classes/fabricobject/#isonscreen)

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

[`FabricObject`](/api/classes/fabricobject/).[`isOverlapping`](/api/classes/fabricobject/#isoverlapping)

***

### isPartiallyOnScreen()

> **isPartiallyOnScreen**(): `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:323](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L323)

Checks if object is partially contained within the canvas with current viewportTransform

#### Returns

`boolean`

true if object is partially contained within canvas

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`isPartiallyOnScreen`](/api/classes/fabricobject/#ispartiallyonscreen)

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

[`FabricObject`](/api/classes/fabricobject/).[`isType`](/api/classes/fabricobject/#istype)

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

[`FabricObject`](/api/classes/fabricobject/).[`needsItsOwnCache`](/api/classes/fabricobject/#needsitsowncache)

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

[`FabricObject`](/api/classes/fabricobject/).[`off`](/api/classes/fabricobject/#off)

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

[`FabricObject`](/api/classes/fabricobject/).[`off`](/api/classes/fabricobject/#off)

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

[`FabricObject`](/api/classes/fabricobject/).[`off`](/api/classes/fabricobject/#off)

#### Call Signature

> **off**(): `void`

Defined in: [src/Observable.ts:137](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Observable.ts#L137)

unsubscribe all event listeners

##### Returns

`void`

##### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`off`](/api/classes/fabricobject/#off)

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

[`FabricObject`](/api/classes/fabricobject/).[`on`](/api/classes/fabricobject/#on)

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

[`FabricObject`](/api/classes/fabricobject/).[`on`](/api/classes/fabricobject/#on)

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

[`FabricObject`](/api/classes/fabricobject/).[`once`](/api/classes/fabricobject/#once)

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

[`FabricObject`](/api/classes/fabricobject/).[`once`](/api/classes/fabricobject/#once)

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

[`FabricObject`](/api/classes/fabricobject/).[`onDeselect`](/api/classes/fabricobject/#ondeselect)

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

[`FabricObject`](/api/classes/fabricobject/).[`onDragStart`](/api/classes/fabricobject/#ondragstart)

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

[`FabricObject`](/api/classes/fabricobject/).[`onSelect`](/api/classes/fabricobject/#onselect)

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

[`FabricObject`](/api/classes/fabricobject/).[`positionByLeftTop`](/api/classes/fabricobject/#positionbylefttop)

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

[`FabricObject`](/api/classes/fabricobject/).[`render`](/api/classes/fabricobject/#render)

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

[`FabricObject`](/api/classes/fabricobject/).[`renderCache`](/api/classes/fabricobject/#rendercache)

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

[`FabricObject`](/api/classes/fabricobject/).[`renderDragSourceEffect`](/api/classes/fabricobject/#renderdragsourceeffect)

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

[`FabricObject`](/api/classes/fabricobject/).[`renderDropTargetEffect`](/api/classes/fabricobject/#renderdroptargeteffect)

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

[`FabricObject`](/api/classes/fabricobject/).[`rotate`](/api/classes/fabricobject/#rotate)

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

[`FabricObject`](/api/classes/fabricobject/).[`scale`](/api/classes/fabricobject/#scale)

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

[`FabricObject`](/api/classes/fabricobject/).[`scaleToHeight`](/api/classes/fabricobject/#scaletoheight)

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

[`FabricObject`](/api/classes/fabricobject/).[`scaleToWidth`](/api/classes/fabricobject/#scaletowidth)

***

### set()

> **set**(`key`, `value?`): `Circle`\<`Props`, `SProps`, `EventSpec`\>

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

`Circle`\<`Props`, `SProps`, `EventSpec`\>

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`set`](/api/classes/fabricobject/#set)

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

[`FabricObject`](/api/classes/fabricobject/).[`setControlsVisibility`](/api/classes/fabricobject/#setcontrolsvisibility)

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

[`FabricObject`](/api/classes/fabricobject/).[`setControlVisible`](/api/classes/fabricobject/#setcontrolvisible)

***

### setCoords()

> **setCoords**(): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:348](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L348)

set controls' coordinates as well
See [https://github.com/fabricjs/fabric.js/wiki/When-to-call-setCoords](https://github.com/fabricjs/fabric.js/wiki/When-to-call-setCoords) and [https://fabric5.fabricjs.com/fabric-gotchas](https://fabric5.fabricjs.com/fabric-gotchas)

#### Returns

`void`

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`setCoords`](/api/classes/fabricobject/#setcoords)

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

[`FabricObject`](/api/classes/fabricobject/).[`setOnGroup`](/api/classes/fabricobject/#setongroup)

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

[`FabricObject`](/api/classes/fabricobject/).[`setPositionByOrigin`](/api/classes/fabricobject/#setpositionbyorigin)

***

### setRadius()

> **setRadius**(`value`): `void`

Defined in: [src/shapes/Circle.ts:152](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Circle.ts#L152)

Sets radius of an object (and updates width accordingly)

#### Parameters

##### value

`number`

#### Returns

`void`

***

### setRelativeX()

> **setRelativeX**(`value`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:125](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L125)

#### Parameters

##### value

`number`

x position according to object's originX property in parent's coordinate plane\
if parent is canvas then this method is identical to [setX](/api/classes/circle/#setx)

#### Returns

`void`

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`setRelativeX`](/api/classes/fabricobject/#setrelativex)

***

### setRelativeXY()

> **setRelativeXY**(`point`, `originX?`, `originY?`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:188](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L188)

As [setXY](/api/classes/circle/#setxy), but in current parent's coordinate plane (the current group if any or the canvas)

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

[`FabricObject`](/api/classes/fabricobject/).[`setRelativeXY`](/api/classes/fabricobject/#setrelativexy)

***

### setRelativeY()

> **setRelativeY**(`value`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:141](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L141)

#### Parameters

##### value

`number`

y position according to object's originY property in parent's coordinate plane\
if parent is canvas then this property is identical to [setY](/api/classes/circle/#sety)

#### Returns

`void`

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`setRelativeY`](/api/classes/fabricobject/#setrelativey)

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

[`FabricObject`](/api/classes/fabricobject/).[`setX`](/api/classes/fabricobject/#setx)

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

[`FabricObject`](/api/classes/fabricobject/).[`setXY`](/api/classes/fabricobject/#setxy)

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

[`FabricObject`](/api/classes/fabricobject/).[`setY`](/api/classes/fabricobject/#sety)

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

[`FabricObject`](/api/classes/fabricobject/).[`shouldCache`](/api/classes/fabricobject/#shouldcache)

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

[`FabricObject`](/api/classes/fabricobject/).[`shouldStartDragging`](/api/classes/fabricobject/#shouldstartdragging)

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

[`FabricObject`](/api/classes/fabricobject/).[`strokeBorders`](/api/classes/fabricobject/#strokeborders)

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

[`FabricObject`](/api/classes/fabricobject/).[`toBlob`](/api/classes/fabricobject/#toblob)

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

[`FabricObject`](/api/classes/fabricobject/).[`toCanvasElement`](/api/classes/fabricobject/#tocanvaselement)

***

### toClipPathSVG()

> **toClipPathSVG**(`this`, `reviver?`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:159](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/FabricObjectSVGExportMixin.ts#L159)

Returns svg clipPath representation of an instance

#### Parameters

##### this

`FabricObjectSVGExportMixin` & [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

##### reviver?

[`TSVGReviver`](/api/type-aliases/tsvgreviver/)

Method for further parsing of svg representation.

#### Returns

`string`

svg representation of an instance

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`toClipPathSVG`](/api/classes/fabricobject/#toclippathsvg)

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

[`FabricObject`](/api/classes/fabricobject/).[`toDatalessObject`](/api/classes/fabricobject/#todatalessobject)

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

[`FabricObject`](/api/classes/fabricobject/).[`toDataURL`](/api/classes/fabricobject/#todataurl)

***

### toggle()

> **toggle**(`property`): `Circle`\<`Props`, `SProps`, `EventSpec`\>

Defined in: [src/CommonMethods.ts:46](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/CommonMethods.ts#L46)

Toggles specified property from `true` to `false` or from `false` to `true`

#### Parameters

##### property

`string`

Property to toggle

#### Returns

`Circle`\<`Props`, `SProps`, `EventSpec`\>

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`toggle`](/api/classes/fabricobject/#toggle)

***

### toJSON()

> **toJSON**(): `any`

Defined in: [src/shapes/Object/Object.ts:1437](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1437)

Returns a JSON representation of an instance

#### Returns

`any`

JSON

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`toJSON`](/api/classes/fabricobject/#tojson)

***

### toObject()

> **toObject**\<`T`, `K`\>(`propertiesToInclude?`): `Pick`\<`T`, `K`\> & `SProps`

Defined in: [src/shapes/Circle.ts:162](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Circle.ts#L162)

Returns object representation of an instance

#### Type Parameters

##### T

`T` *extends* `Omit`\<`Props` & [`TClassProperties`](/api/type-aliases/tclassproperties/)\<`Circle`\<`Props`, `SProps`, `EventSpec`\>\>, keyof `SProps`\>

##### K

`K` *extends* `string` \| `number` \| `symbol` = `never`

#### Parameters

##### propertiesToInclude?

`K`[] = `[]`

Any properties that you might want to additionally include in the output

#### Returns

`Pick`\<`T`, `K`\> & `SProps`

object representation of an instance

#### Overrides

[`FabricObject`](/api/classes/fabricobject/).[`toObject`](/api/classes/fabricobject/#toobject)

***

### toString()

> **toString**(): `string`

Defined in: [src/shapes/Object/Object.ts:1889](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1889)

Returns a string representation of an instance

#### Returns

`string`

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`toString`](/api/classes/fabricobject/#tostring)

***

### toSVG()

> **toSVG**(`this`, `reviver?`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:145](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/FabricObjectSVGExportMixin.ts#L145)

Returns svg representation of an instance

#### Parameters

##### this

`FabricObjectSVGExportMixin` & [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

##### reviver?

[`TSVGReviver`](/api/type-aliases/tsvgreviver/)

Method for further parsing of svg representation.

#### Returns

`string`

svg representation of an instance

#### Inherited from

[`FabricObject`](/api/classes/fabricobject/).[`toSVG`](/api/classes/fabricobject/#tosvg)

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

[`FabricObject`](/api/classes/fabricobject/).[`transform`](/api/classes/fabricobject/#transform)

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

[`FabricObject`](/api/classes/fabricobject/).[`transformMatrixKey`](/api/classes/fabricobject/#transformmatrixkey)

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

[`FabricObject`](/api/classes/fabricobject/).[`translateToCenterPoint`](/api/classes/fabricobject/#translatetocenterpoint)

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

[`FabricObject`](/api/classes/fabricobject/).[`translateToGivenOrigin`](/api/classes/fabricobject/#translatetogivenorigin)

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

[`FabricObject`](/api/classes/fabricobject/).[`translateToOriginPoint`](/api/classes/fabricobject/#translatetooriginpoint)

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

[`FabricObject`](/api/classes/fabricobject/).[`willDrawShadow`](/api/classes/fabricobject/#willdrawshadow)

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

[`FabricObject`](/api/classes/fabricobject/).[`_fromObject`](/api/classes/fabricobject/#_fromobject)

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

[`FabricObject`](/api/classes/fabricobject/).[`createControls`](/api/classes/fabricobject/#createcontrols)

***

### fromElement()

> `static` **fromElement**(`element`, `options?`, `cssRules?`): `Promise`\<`Circle`\<`Partial`\<[`CircleProps`](/api/interfaces/circleprops/)\>, [`SerializedCircleProps`](/api/interfaces/serializedcircleprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>\>

Defined in: [src/shapes/Circle.ts:220](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Circle.ts#L220)

Returns [Circle](/api/classes/circle/) instance from an SVG element

#### Parameters

##### element

`HTMLElement`

Element to parse

##### options?

[`Abortable`](/api/type-aliases/abortable/)

Partial Circle object to default missing properties on the element.

##### cssRules?

`CSSRules`

#### Returns

`Promise`\<`Circle`\<`Partial`\<[`CircleProps`](/api/interfaces/circleprops/)\>, [`SerializedCircleProps`](/api/interfaces/serializedcircleprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>\>

#### Throws

If value of `r` attribute is missing or invalid

***

### fromObject()

> `static` **fromObject**\<`T`\>(`object`): `Promise`\<`Circle`\<`Partial`\<[`CircleProps`](/api/interfaces/circleprops/)\>, [`SerializedCircleProps`](/api/interfaces/serializedcircleprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>\>

Defined in: [src/shapes/Circle.ts:251](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Circle.ts#L251)

#### Type Parameters

##### T

`T` *extends* [`TOptions`](/api/type-aliases/toptions/)\<[`SerializedCircleProps`](/api/interfaces/serializedcircleprops/)\>

#### Parameters

##### object

`T`

#### Returns

`Promise`\<`Circle`\<`Partial`\<[`CircleProps`](/api/interfaces/circleprops/)\>, [`SerializedCircleProps`](/api/interfaces/serializedcircleprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>\>

#### Todo

how do we declare this??

#### Overrides

[`FabricObject`](/api/classes/fabricobject/).[`fromObject`](/api/classes/fabricobject/#fromobject)

***

### getDefaults()

> `static` **getDefaults**(): `Record`\<`string`, `any`\>

Defined in: [src/shapes/Circle.ts:84](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Circle.ts#L84)

#### Returns

`Record`\<`string`, `any`\>

#### Overrides

[`FabricObject`](/api/classes/fabricobject/).[`getDefaults`](/api/classes/fabricobject/#getdefaults)
