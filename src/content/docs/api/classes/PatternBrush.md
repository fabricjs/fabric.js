---
editUrl: false
next: false
prev: false
title: "PatternBrush"
---

Defined in: [src/brushes/PatternBrush.ts:7](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/PatternBrush.ts#L7)

## See

[demo](http://fabric5.fabricjs.com/freedrawing|Freedrawing)

## Extends

- [`PencilBrush`](/api/classes/pencilbrush/)

## Constructors

### Constructor

> **new PatternBrush**(`canvas`): `PatternBrush`

Defined in: [src/brushes/PatternBrush.ts:10](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/PatternBrush.ts#L10)

#### Parameters

##### canvas

[`Canvas`](/api/classes/canvas/)

#### Returns

`PatternBrush`

#### Overrides

[`PencilBrush`](/api/classes/pencilbrush/).[`constructor`](/api/classes/pencilbrush/#constructor)

## Properties

### canvas

> **canvas**: [`Canvas`](/api/classes/canvas/)

Defined in: [src/brushes/BaseBrush.ts:66](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/BaseBrush.ts#L66)

#### Todo

add type

#### Inherited from

[`PencilBrush`](/api/classes/pencilbrush/).[`canvas`](/api/classes/pencilbrush/#canvas)

***

### color

> **color**: `string` = `'rgb(0, 0, 0)'`

Defined in: [src/brushes/BaseBrush.ts:15](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/BaseBrush.ts#L15)

Color of a brush

#### Inherited from

[`PencilBrush`](/api/classes/pencilbrush/).[`color`](/api/classes/pencilbrush/#color)

***

### decimate

> **decimate**: `number` = `0.4`

Defined in: [src/brushes/PencilBrush.ts:25](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/PencilBrush.ts#L25)

Discard points that are less than `decimate` pixel distant from each other

#### Default

```ts
0.4
```

#### Inherited from

[`PencilBrush`](/api/classes/pencilbrush/).[`decimate`](/api/classes/pencilbrush/#decimate)

***

### drawStraightLine

> **drawStraightLine**: `boolean` = `false`

Defined in: [src/brushes/PencilBrush.ts:34](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/PencilBrush.ts#L34)

Draws a straight line between last recorded point to current pointer
Used for `shift` functionality

#### Default

```ts
false
```

#### Inherited from

[`PencilBrush`](/api/classes/pencilbrush/).[`drawStraightLine`](/api/classes/pencilbrush/#drawstraightline)

***

### limitedToCanvasSize

> **limitedToCanvasSize**: `boolean` = `false`

Defined in: [src/brushes/BaseBrush.ts:61](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/BaseBrush.ts#L61)

When `true`, the free drawing is limited to the whiteboard size. Default to false.

#### Default

```ts
false
```

#### Inherited from

[`PencilBrush`](/api/classes/pencilbrush/).[`limitedToCanvasSize`](/api/classes/pencilbrush/#limitedtocanvassize)

***

### shadow

> **shadow**: `null` \| [`Shadow`](/api/classes/shadow/) = `null`

Defined in: [src/brushes/BaseBrush.ts:29](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/BaseBrush.ts#L29)

Shadow object representing shadow of this shape.
<b>Backwards incompatibility note:</b> This property replaces "shadowColor" (String), "shadowOffsetX" (Number),
"shadowOffsetY" (Number) and "shadowBlur" (Number) since v1.2.12

#### Inherited from

[`PencilBrush`](/api/classes/pencilbrush/).[`shadow`](/api/classes/pencilbrush/#shadow)

***

### source?

> `optional` **source**: `CanvasImageSource`

Defined in: [src/brushes/PatternBrush.ts:8](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/PatternBrush.ts#L8)

***

### straightLineKey

> **straightLineKey**: `undefined` \| `null` \| `"altKey"` \| `"ctrlKey"` \| `"metaKey"` \| `"shiftKey"` = `'shiftKey'`

Defined in: [src/brushes/PencilBrush.ts:41](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/PencilBrush.ts#L41)

The event modifier key that makes the brush draw a straight line.
If `null` or 'none' or any other string that is not a modifier key the feature is disabled.

#### Inherited from

[`PencilBrush`](/api/classes/pencilbrush/).[`straightLineKey`](/api/classes/pencilbrush/#straightlinekey)

***

### strokeDashArray

> **strokeDashArray**: `null` \| `number`[] = `null`

Defined in: [src/brushes/BaseBrush.ts:53](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/BaseBrush.ts#L53)

Stroke Dash Array.

#### Inherited from

[`PencilBrush`](/api/classes/pencilbrush/).[`strokeDashArray`](/api/classes/pencilbrush/#strokedasharray)

***

### strokeLineCap

> **strokeLineCap**: `CanvasLineCap` = `'round'`

Defined in: [src/brushes/BaseBrush.ts:35](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/BaseBrush.ts#L35)

Line endings style of a brush (one of "butt", "round", "square")

#### Inherited from

[`PencilBrush`](/api/classes/pencilbrush/).[`strokeLineCap`](/api/classes/pencilbrush/#strokelinecap)

***

### strokeLineJoin

> **strokeLineJoin**: `CanvasLineJoin` = `'round'`

Defined in: [src/brushes/BaseBrush.ts:41](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/BaseBrush.ts#L41)

Corner style of a brush (one of "bevel", "round", "miter")

#### Inherited from

[`PencilBrush`](/api/classes/pencilbrush/).[`strokeLineJoin`](/api/classes/pencilbrush/#strokelinejoin)

***

### strokeMiterLimit

> **strokeMiterLimit**: `number` = `10`

Defined in: [src/brushes/BaseBrush.ts:47](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/BaseBrush.ts#L47)

Maximum miter length (used for strokeLineJoin = "miter") of a brush's

#### Inherited from

[`PencilBrush`](/api/classes/pencilbrush/).[`strokeMiterLimit`](/api/classes/pencilbrush/#strokemiterlimit)

***

### width

> **width**: `number` = `1`

Defined in: [src/brushes/BaseBrush.ts:21](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/BaseBrush.ts#L21)

Width of a brush, has to be a Number, no string literals

#### Inherited from

[`PencilBrush`](/api/classes/pencilbrush/).[`width`](/api/classes/pencilbrush/#width)

## Methods

### \_finalizeAndAddPath()

> **\_finalizeAndAddPath**(): `void`

Defined in: [src/brushes/PencilBrush.ts:275](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/PencilBrush.ts#L275)

On mouseup after drawing the path on contextTop canvas
we use the points captured to create an new Path object
and add it to the canvas.

#### Returns

`void`

#### Inherited from

[`PencilBrush`](/api/classes/pencilbrush/).[`_finalizeAndAddPath`](/api/classes/pencilbrush/#_finalizeandaddpath)

***

### \_setBrushStyles()

> **\_setBrushStyles**(`ctx`): `void`

Defined in: [src/brushes/PatternBrush.ts:50](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/PatternBrush.ts#L50)

Sets brush styles

#### Parameters

##### ctx

`CanvasRenderingContext2D`

#### Returns

`void`

#### Overrides

`PencilBrush._setBrushStyles`

***

### convertPointsToSVGPath()

> **convertPointsToSVGPath**(`points`): [`TSimplePathData`](/api/type-aliases/tsimplepathdata/)

Defined in: [src/brushes/PencilBrush.ts:213](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/PencilBrush.ts#L213)

Converts points to SVG path

#### Parameters

##### points

[`Point`](/api/classes/point/)[]

Array of points

#### Returns

[`TSimplePathData`](/api/type-aliases/tsimplepathdata/)

SVG path commands

#### Inherited from

[`PencilBrush`](/api/classes/pencilbrush/).[`convertPointsToSVGPath`](/api/classes/pencilbrush/#convertpointstosvgpath)

***

### createPath()

> **createPath**(`pathData`): [`Path`](/api/classes/path/)\<`Partial`\<[`PathProps`](/api/interfaces/pathprops/)\>, [`SerializedPathProps`](/api/interfaces/serializedpathprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

Defined in: [src/brushes/PatternBrush.ts:59](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/PatternBrush.ts#L59)

Creates path

#### Parameters

##### pathData

[`TSimplePathData`](/api/type-aliases/tsimplepathdata/)

#### Returns

[`Path`](/api/classes/path/)\<`Partial`\<[`PathProps`](/api/interfaces/pathprops/)\>, [`SerializedPathProps`](/api/interfaces/serializedpathprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

#### Overrides

[`PencilBrush`](/api/classes/pencilbrush/).[`createPath`](/api/classes/pencilbrush/#createpath)

***

### decimatePoints()

> **decimatePoints**(`points`, `distance`): [`Point`](/api/classes/point/)[]

Defined in: [src/brushes/PencilBrush.ts:244](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/PencilBrush.ts#L244)

Decimate points array with the decimate value

#### Parameters

##### points

[`Point`](/api/classes/point/)[]

##### distance

`number`

#### Returns

[`Point`](/api/classes/point/)[]

#### Inherited from

[`PencilBrush`](/api/classes/pencilbrush/).[`decimatePoints`](/api/classes/pencilbrush/#decimatepoints)

***

### getPattern()

> **getPattern**(`ctx`): `null` \| `CanvasPattern`

Defined in: [src/brushes/PatternBrush.ts:42](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/PatternBrush.ts#L42)

Creates "pattern" instance property

#### Parameters

##### ctx

`CanvasRenderingContext2D`

#### Returns

`null` \| `CanvasPattern`

***

### getPatternSrc()

> **getPatternSrc**(): `HTMLCanvasElement`

Defined in: [src/brushes/PatternBrush.ts:14](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/PatternBrush.ts#L14)

#### Returns

`HTMLCanvasElement`

***

### needsFullRender()

> **needsFullRender**(): `boolean`

Defined in: [src/brushes/PencilBrush.ts:53](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/PencilBrush.ts#L53)

#### Returns

`boolean`

#### Inherited from

[`PencilBrush`](/api/classes/pencilbrush/).[`needsFullRender`](/api/classes/pencilbrush/#needsfullrender)

***

### onMouseDown()

> **onMouseDown**(`pointer`, `__namedParameters`): `void`

Defined in: [src/brushes/PencilBrush.ts:67](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/PencilBrush.ts#L67)

Invoked on mouse down

#### Parameters

##### pointer

[`Point`](/api/classes/point/)

##### \_\_namedParameters

[`TEvent`](/api/interfaces/tevent/)

#### Returns

`void`

#### Inherited from

[`PencilBrush`](/api/classes/pencilbrush/).[`onMouseDown`](/api/classes/pencilbrush/#onmousedown)

***

### onMouseMove()

> **onMouseMove**(`pointer`, `__namedParameters`): `void`

Defined in: [src/brushes/PencilBrush.ts:83](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/PencilBrush.ts#L83)

Invoked on mouse move

#### Parameters

##### pointer

[`Point`](/api/classes/point/)

##### \_\_namedParameters

[`TEvent`](/api/interfaces/tevent/)

#### Returns

`void`

#### Inherited from

[`PencilBrush`](/api/classes/pencilbrush/).[`onMouseMove`](/api/classes/pencilbrush/#onmousemove)

***

### onMouseUp()

> **onMouseUp**(`__namedParameters`): `boolean`

Defined in: [src/brushes/PencilBrush.ts:121](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/PencilBrush.ts#L121)

Invoked on mouse up

#### Parameters

##### \_\_namedParameters

[`TEvent`](/api/interfaces/tevent/)

#### Returns

`boolean`

#### Inherited from

[`PencilBrush`](/api/classes/pencilbrush/).[`onMouseUp`](/api/classes/pencilbrush/#onmouseup)

***

### drawSegment()

> `static` **drawSegment**(`ctx`, `p1`, `p2`): [`Point`](/api/classes/point/)

Defined in: [src/brushes/PencilBrush.ts:57](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/PencilBrush.ts#L57)

#### Parameters

##### ctx

`CanvasRenderingContext2D`

##### p1

[`Point`](/api/classes/point/)

##### p2

[`Point`](/api/classes/point/)

#### Returns

[`Point`](/api/classes/point/)

#### Inherited from

[`PencilBrush`](/api/classes/pencilbrush/).[`drawSegment`](/api/classes/pencilbrush/#drawsegment)
