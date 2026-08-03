---
editUrl: false
next: false
prev: false
title: "CircleBrush"
---

Defined in: [src/brushes/CircleBrush.ts:12](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/CircleBrush.ts#L12)

## See

[demo](http://fabric5.fabricjs.com/freedrawing|Freedrawing)

## Extends

- [`BaseBrush`](/api/classes/basebrush/)

## Constructors

### Constructor

> **new CircleBrush**(`canvas`): `CircleBrush`

Defined in: [src/brushes/CircleBrush.ts:21](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/CircleBrush.ts#L21)

#### Parameters

##### canvas

[`Canvas`](/api/classes/canvas/)

#### Returns

`CircleBrush`

#### Overrides

[`BaseBrush`](/api/classes/basebrush/).[`constructor`](/api/classes/basebrush/#constructor)

## Properties

### canvas

> **canvas**: [`Canvas`](/api/classes/canvas/)

Defined in: [src/brushes/BaseBrush.ts:66](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/BaseBrush.ts#L66)

#### Todo

add type

#### Inherited from

[`BaseBrush`](/api/classes/basebrush/).[`canvas`](/api/classes/basebrush/#canvas)

***

### color

> **color**: `string` = `'rgb(0, 0, 0)'`

Defined in: [src/brushes/BaseBrush.ts:15](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/BaseBrush.ts#L15)

Color of a brush

#### Inherited from

[`BaseBrush`](/api/classes/basebrush/).[`color`](/api/classes/basebrush/#color)

***

### limitedToCanvasSize

> **limitedToCanvasSize**: `boolean` = `false`

Defined in: [src/brushes/BaseBrush.ts:61](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/BaseBrush.ts#L61)

When `true`, the free drawing is limited to the whiteboard size. Default to false.

#### Default

```ts
false
```

#### Inherited from

[`BaseBrush`](/api/classes/basebrush/).[`limitedToCanvasSize`](/api/classes/basebrush/#limitedtocanvassize)

***

### points

> **points**: [`CircleBrushPoint`](/api/type-aliases/circlebrushpoint/)[]

Defined in: [src/brushes/CircleBrush.ts:19](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/CircleBrush.ts#L19)

***

### shadow

> **shadow**: `null` \| [`Shadow`](/api/classes/shadow/) = `null`

Defined in: [src/brushes/BaseBrush.ts:29](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/BaseBrush.ts#L29)

Shadow object representing shadow of this shape.
<b>Backwards incompatibility note:</b> This property replaces "shadowColor" (String), "shadowOffsetX" (Number),
"shadowOffsetY" (Number) and "shadowBlur" (Number) since v1.2.12

#### Inherited from

[`BaseBrush`](/api/classes/basebrush/).[`shadow`](/api/classes/basebrush/#shadow)

***

### strokeDashArray

> **strokeDashArray**: `null` \| `number`[] = `null`

Defined in: [src/brushes/BaseBrush.ts:53](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/BaseBrush.ts#L53)

Stroke Dash Array.

#### Inherited from

[`BaseBrush`](/api/classes/basebrush/).[`strokeDashArray`](/api/classes/basebrush/#strokedasharray)

***

### strokeLineCap

> **strokeLineCap**: `CanvasLineCap` = `'round'`

Defined in: [src/brushes/BaseBrush.ts:35](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/BaseBrush.ts#L35)

Line endings style of a brush (one of "butt", "round", "square")

#### Inherited from

[`BaseBrush`](/api/classes/basebrush/).[`strokeLineCap`](/api/classes/basebrush/#strokelinecap)

***

### strokeLineJoin

> **strokeLineJoin**: `CanvasLineJoin` = `'round'`

Defined in: [src/brushes/BaseBrush.ts:41](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/BaseBrush.ts#L41)

Corner style of a brush (one of "bevel", "round", "miter")

#### Inherited from

[`BaseBrush`](/api/classes/basebrush/).[`strokeLineJoin`](/api/classes/basebrush/#strokelinejoin)

***

### strokeMiterLimit

> **strokeMiterLimit**: `number` = `10`

Defined in: [src/brushes/BaseBrush.ts:47](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/BaseBrush.ts#L47)

Maximum miter length (used for strokeLineJoin = "miter") of a brush's

#### Inherited from

[`BaseBrush`](/api/classes/basebrush/).[`strokeMiterLimit`](/api/classes/basebrush/#strokemiterlimit)

***

### width

> **width**: `number` = `10`

Defined in: [src/brushes/CircleBrush.ts:17](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/CircleBrush.ts#L17)

Width of a brush

#### Overrides

[`BaseBrush`](/api/classes/basebrush/).[`width`](/api/classes/basebrush/#width)

## Methods

### addPoint()

> **addPoint**(`pointer`): [`CircleBrushPoint`](/api/type-aliases/circlebrushpoint/)

Defined in: [src/brushes/CircleBrush.ts:127](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/CircleBrush.ts#L127)

#### Parameters

##### pointer

[`Point`](/api/classes/point/)

#### Returns

[`CircleBrushPoint`](/api/type-aliases/circlebrushpoint/)

Just added pointer point

***

### dot()

> **dot**(`ctx`, `point`): `void`

Defined in: [src/brushes/CircleBrush.ts:38](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/CircleBrush.ts#L38)

#### Parameters

##### ctx

`CanvasRenderingContext2D`

##### point

[`CircleBrushPoint`](/api/type-aliases/circlebrushpoint/)

#### Returns

`void`

***

### drawDot()

> **drawDot**(`pointer`): `void`

Defined in: [src/brushes/CircleBrush.ts:30](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/CircleBrush.ts#L30)

Invoked inside on mouse down and mouse move

#### Parameters

##### pointer

[`Point`](/api/classes/point/)

#### Returns

`void`

***

### onMouseDown()

> **onMouseDown**(`pointer`): `void`

Defined in: [src/brushes/CircleBrush.ts:49](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/CircleBrush.ts#L49)

Invoked on mouse down

#### Parameters

##### pointer

[`Point`](/api/classes/point/)

#### Returns

`void`

#### Overrides

[`BaseBrush`](/api/classes/basebrush/).[`onMouseDown`](/api/classes/basebrush/#onmousedown)

***

### onMouseMove()

> **onMouseMove**(`pointer`): `void`

Defined in: [src/brushes/CircleBrush.ts:74](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/CircleBrush.ts#L74)

Invoked on mouse move

#### Parameters

##### pointer

[`Point`](/api/classes/point/)

#### Returns

`void`

#### Overrides

[`BaseBrush`](/api/classes/basebrush/).[`onMouseMove`](/api/classes/basebrush/#onmousemove)

***

### onMouseUp()

> **onMouseUp**(): `void`

Defined in: [src/brushes/CircleBrush.ts:90](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/CircleBrush.ts#L90)

Invoked on mouse up

#### Returns

`void`

#### Overrides

[`BaseBrush`](/api/classes/basebrush/).[`onMouseUp`](/api/classes/basebrush/#onmouseup)
