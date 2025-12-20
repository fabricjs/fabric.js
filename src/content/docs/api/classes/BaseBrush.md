---
editUrl: false
next: false
prev: false
title: "BaseBrush"
---

Defined in: [src/brushes/BaseBrush.ts:10](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/BaseBrush.ts#L10)

## See

[demo](http://fabric5.fabricjs.com/freedrawing|Freedrawing)

## Extended by

- [`PencilBrush`](/api/classes/pencilbrush/)
- [`CircleBrush`](/api/classes/circlebrush/)
- [`SprayBrush`](/api/classes/spraybrush/)

## Constructors

### Constructor

> **new BaseBrush**(`canvas`): `BaseBrush`

Defined in: [src/brushes/BaseBrush.ts:68](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/BaseBrush.ts#L68)

#### Parameters

##### canvas

[`Canvas`](/api/classes/canvas/)

#### Returns

`BaseBrush`

## Properties

### canvas

> **canvas**: [`Canvas`](/api/classes/canvas/)

Defined in: [src/brushes/BaseBrush.ts:66](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/BaseBrush.ts#L66)

#### Todo

add type

***

### color

> **color**: `string` = `'rgb(0, 0, 0)'`

Defined in: [src/brushes/BaseBrush.ts:15](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/BaseBrush.ts#L15)

Color of a brush

***

### limitedToCanvasSize

> **limitedToCanvasSize**: `boolean` = `false`

Defined in: [src/brushes/BaseBrush.ts:61](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/BaseBrush.ts#L61)

When `true`, the free drawing is limited to the whiteboard size. Default to false.

#### Default

```ts
false
```

***

### shadow

> **shadow**: `null` \| [`Shadow`](/api/classes/shadow/) = `null`

Defined in: [src/brushes/BaseBrush.ts:29](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/BaseBrush.ts#L29)

Shadow object representing shadow of this shape.
<b>Backwards incompatibility note:</b> This property replaces "shadowColor" (String), "shadowOffsetX" (Number),
"shadowOffsetY" (Number) and "shadowBlur" (Number) since v1.2.12

***

### strokeDashArray

> **strokeDashArray**: `null` \| `number`[] = `null`

Defined in: [src/brushes/BaseBrush.ts:53](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/BaseBrush.ts#L53)

Stroke Dash Array.

***

### strokeLineCap

> **strokeLineCap**: `CanvasLineCap` = `'round'`

Defined in: [src/brushes/BaseBrush.ts:35](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/BaseBrush.ts#L35)

Line endings style of a brush (one of "butt", "round", "square")

***

### strokeLineJoin

> **strokeLineJoin**: `CanvasLineJoin` = `'round'`

Defined in: [src/brushes/BaseBrush.ts:41](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/BaseBrush.ts#L41)

Corner style of a brush (one of "bevel", "round", "miter")

***

### strokeMiterLimit

> **strokeMiterLimit**: `number` = `10`

Defined in: [src/brushes/BaseBrush.ts:47](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/BaseBrush.ts#L47)

Maximum miter length (used for strokeLineJoin = "miter") of a brush's

***

### width

> **width**: `number` = `1`

Defined in: [src/brushes/BaseBrush.ts:21](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/BaseBrush.ts#L21)

Width of a brush, has to be a Number, no string literals

## Methods

### \_render()

> `abstract` **\_render**(): `void`

Defined in: [src/brushes/BaseBrush.ts:72](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/BaseBrush.ts#L72)

#### Returns

`void`

***

### onMouseDown()

> `abstract` **onMouseDown**(`pointer`, `ev`): `void`

Defined in: [src/brushes/BaseBrush.ts:73](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/BaseBrush.ts#L73)

#### Parameters

##### pointer

[`Point`](/api/classes/point/)

##### ev

[`TBrushEventData`](/api/type-aliases/tbrusheventdata/)

#### Returns

`void`

***

### onMouseMove()

> `abstract` **onMouseMove**(`pointer`, `ev`): `void`

Defined in: [src/brushes/BaseBrush.ts:74](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/BaseBrush.ts#L74)

#### Parameters

##### pointer

[`Point`](/api/classes/point/)

##### ev

[`TBrushEventData`](/api/type-aliases/tbrusheventdata/)

#### Returns

`void`

***

### onMouseUp()

> `abstract` **onMouseUp**(`ev`): `boolean` \| `void`

Defined in: [src/brushes/BaseBrush.ts:78](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/brushes/BaseBrush.ts#L78)

#### Parameters

##### ev

[`TBrushEventData`](/api/type-aliases/tbrusheventdata/)

#### Returns

`boolean` \| `void`

true if brush should continue blocking interaction
