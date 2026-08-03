---
editUrl: false
next: false
prev: false
title: "SprayBrush"
---

Defined in: [src/brushes/SprayBrush.ts:31](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/SprayBrush.ts#L31)

## See

[demo](http://fabric5.fabricjs.com/freedrawing|Freedrawing)

## Extends

- [`BaseBrush`](/api/classes/basebrush/)

## Constructors

### Constructor

> **new SprayBrush**(`canvas`): `SprayBrush`

Defined in: [src/brushes/SprayBrush.ts:77](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/SprayBrush.ts#L77)

Constructor

#### Parameters

##### canvas

[`Canvas`](/api/classes/canvas/)

#### Returns

`SprayBrush`

Instance of a spray brush

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

### density

> **density**: `number` = `20`

Defined in: [src/brushes/SprayBrush.ts:42](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/SprayBrush.ts#L42)

Density of a spray (number of dots per chunk)

***

### dotWidth

> **dotWidth**: `number` = `1`

Defined in: [src/brushes/SprayBrush.ts:48](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/SprayBrush.ts#L48)

Width of spray dots

***

### dotWidthVariance

> **dotWidthVariance**: `number` = `1`

Defined in: [src/brushes/SprayBrush.ts:54](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/SprayBrush.ts#L54)

Width variance of spray dots

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

### optimizeOverlapping

> **optimizeOverlapping**: `boolean` = `true`

Defined in: [src/brushes/SprayBrush.ts:66](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/SprayBrush.ts#L66)

Whether overlapping dots (rectangles) should be removed (for performance reasons)

***

### randomOpacity

> **randomOpacity**: `boolean` = `false`

Defined in: [src/brushes/SprayBrush.ts:60](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/SprayBrush.ts#L60)

Whether opacity of a dot should be random

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

Defined in: [src/brushes/SprayBrush.ts:36](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/SprayBrush.ts#L36)

Width of a spray

#### Overrides

[`BaseBrush`](/api/classes/basebrush/).[`width`](/api/classes/basebrush/#width)

## Methods

### \_render()

> **\_render**(): `void`

Defined in: [src/brushes/SprayBrush.ts:171](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/SprayBrush.ts#L171)

Render all spray chunks

#### Returns

`void`

#### Overrides

[`BaseBrush`](/api/classes/basebrush/).[`_render`](/api/classes/basebrush/#_render)

***

### addSprayChunk()

> **addSprayChunk**(`pointer`): `void`

Defined in: [src/brushes/SprayBrush.ts:186](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/SprayBrush.ts#L186)

#### Parameters

##### pointer

[`Point`](/api/classes/point/)

#### Returns

`void`

***

### onMouseDown()

> **onMouseDown**(`pointer`): `void`

Defined in: [src/brushes/SprayBrush.ts:87](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/SprayBrush.ts#L87)

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

Defined in: [src/brushes/SprayBrush.ts:100](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/SprayBrush.ts#L100)

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

Defined in: [src/brushes/SprayBrush.ts:111](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/SprayBrush.ts#L111)

Invoked on mouse up

#### Returns

`void`

#### Overrides

[`BaseBrush`](/api/classes/basebrush/).[`onMouseUp`](/api/classes/basebrush/#onmouseup)

***

### renderChunck()

> **renderChunck**(`sprayChunck`): `void`

Defined in: [src/brushes/SprayBrush.ts:153](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/brushes/SprayBrush.ts#L153)

#### Parameters

##### sprayChunck

[`SprayBrushPoint`](/api/type-aliases/spraybrushpoint/)[]

#### Returns

`void`
