---
editUrl: false
next: false
prev: false
title: "Point"
---

Defined in: [src/Point.ts:13](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L13)

Adaptation of work of Kevin Lindsey(kevin@kevlindev.com)

## Implements

- [`XY`](/api/interfaces/xy/)

## Constructors

### Constructor

> **new Point**(): `Point`

Defined in: [src/Point.ts:18](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L18)

#### Returns

`Point`

### Constructor

> **new Point**(`x`, `y`): `Point`

Defined in: [src/Point.ts:19](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L19)

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`Point`

### Constructor

> **new Point**(`point?`): `Point`

Defined in: [src/Point.ts:20](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L20)

#### Parameters

##### point?

[`XY`](/api/interfaces/xy/)

#### Returns

`Point`

## Properties

### x

> **x**: `number`

Defined in: [src/Point.ts:14](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L14)

#### Implementation of

[`XY`](/api/interfaces/xy/).[`x`](/api/interfaces/xy/#x)

***

### y

> **y**: `number`

Defined in: [src/Point.ts:16](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L16)

#### Implementation of

[`XY`](/api/interfaces/xy/).[`y`](/api/interfaces/xy/#y)

## Methods

### add()

> **add**(`that`): `Point`

Defined in: [src/Point.ts:36](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L36)

Adds another point to this one and returns a new one with the sum

#### Parameters

##### that

[`XY`](/api/interfaces/xy/)

#### Returns

`Point`

new Point instance with added values

***

### ~~addEquals()~~

> **addEquals**(`that`): `Point`

Defined in: [src/Point.ts:46](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L46)

Adds another point to this one

:::caution[Deprecated]
This API is no longer supported and may be removed in a future release.
:::

#### Parameters

##### that

[`XY`](/api/interfaces/xy/)

#### Returns

`Point`

thisArg

***

### clone()

> **clone**(): `Point`

Defined in: [src/Point.ts:337](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L337)

return a cloned instance of the point

#### Returns

`Point`

***

### distanceFrom()

> **distanceFrom**(`that`): `number`

Defined in: [src/Point.ts:240](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L240)

Returns distance from this point and another one

#### Parameters

##### that

[`XY`](/api/interfaces/xy/)

#### Returns

`number`

***

### divide()

> **divide**(`that`): `Point`

Defined in: [src/Point.ts:150](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L150)

Divides this point by another and returns a new one

#### Parameters

##### that

[`XY`](/api/interfaces/xy/)

#### Returns

`Point`

***

### eq()

> **eq**(`that`): `boolean`

Defined in: [src/Point.ts:180](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L180)

Returns true if this point is equal to another one

#### Parameters

##### that

[`XY`](/api/interfaces/xy/)

#### Returns

`boolean`

***

### gt()

> **gt**(`that`): `boolean`

Defined in: [src/Point.ts:208](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L208)

Returns true if this point is greater another one

#### Parameters

##### that

[`XY`](/api/interfaces/xy/)

#### Returns

`boolean`

***

### gte()

> **gte**(`that`): `boolean`

Defined in: [src/Point.ts:217](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L217)

Returns true if this point is greater than or equal to another one

#### Parameters

##### that

[`XY`](/api/interfaces/xy/)

#### Returns

`boolean`

***

### lerp()

> **lerp**(`that`, `t`): `Point`

Defined in: [src/Point.ts:227](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L227)

Returns new point which is the result of linear interpolation with this one and another one

#### Parameters

##### that

[`XY`](/api/interfaces/xy/)

##### t

`number` = `0.5`

, position of interpolation, between 0 and 1 default 0.5

#### Returns

`Point`

***

### lt()

> **lt**(`that`): `boolean`

Defined in: [src/Point.ts:189](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L189)

Returns true if this point is less than another one

#### Parameters

##### that

[`XY`](/api/interfaces/xy/)

#### Returns

`boolean`

***

### lte()

> **lte**(`that`): `boolean`

Defined in: [src/Point.ts:198](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L198)

Returns true if this point is less than or equal to another one

#### Parameters

##### that

[`XY`](/api/interfaces/xy/)

#### Returns

`boolean`

***

### max()

> **max**(`that`): `Point`

Defined in: [src/Point.ts:269](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L269)

Returns a new point which is the max of this and another one

#### Parameters

##### that

[`XY`](/api/interfaces/xy/)

#### Returns

`Point`

***

### midPointFrom()

> **midPointFrom**(`that`): `Point`

Defined in: [src/Point.ts:251](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L251)

Returns the point between this point and another one

#### Parameters

##### that

[`XY`](/api/interfaces/xy/)

#### Returns

`Point`

***

### min()

> **min**(`that`): `Point`

Defined in: [src/Point.ts:260](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L260)

Returns a new point which is the min of this and another one

#### Parameters

##### that

[`XY`](/api/interfaces/xy/)

#### Returns

`Point`

***

### multiply()

> **multiply**(`that`): `Point`

Defined in: [src/Point.ts:120](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L120)

Multiplies this point by another value and returns a new one

#### Parameters

##### that

[`XY`](/api/interfaces/xy/)

#### Returns

`Point`

***

### rotate()

> **rotate**(`radians`, `origin`): `Point`

Defined in: [src/Point.ts:347](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L347)

Rotates `point` around `origin` with `radians`

#### Parameters

##### radians

[`TRadian`](/api/type-aliases/tradian/)

The radians of the angle for the rotation

##### origin

[`XY`](/api/interfaces/xy/) = `ZERO`

The origin of the rotation

#### Returns

`Point`

The new rotated point

***

### scalarAdd()

> **scalarAdd**(`scalar`): `Point`

Defined in: [src/Point.ts:57](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L57)

Adds value to this point and returns a new one

#### Parameters

##### scalar

`number`

#### Returns

`Point`

new Point with added value

***

### ~~scalarAddEquals()~~

> **scalarAddEquals**(`scalar`): `Point`

Defined in: [src/Point.ts:67](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L67)

Adds value to this point

:::caution[Deprecated]
This API is no longer supported and may be removed in a future release.
:::

#### Parameters

##### scalar

`number`

#### Returns

`Point`

thisArg

***

### scalarDivide()

> **scalarDivide**(`scalar`): `Point`

Defined in: [src/Point.ts:159](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L159)

Divides this point by a value and returns a new one

#### Parameters

##### scalar

`number`

#### Returns

`Point`

***

### ~~scalarDivideEquals()~~

> **scalarDivideEquals**(`scalar`): `Point`

Defined in: [src/Point.ts:169](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L169)

Divides this point by a value

:::caution[Deprecated]
This API is no longer supported and may be removed in a future release.
:::

#### Parameters

##### scalar

`number`

#### Returns

`Point`

thisArg

***

### scalarMultiply()

> **scalarMultiply**(`scalar`): `Point`

Defined in: [src/Point.ts:129](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L129)

Multiplies this point by a value and returns a new one

#### Parameters

##### scalar

`number`

#### Returns

`Point`

***

### ~~scalarMultiplyEquals()~~

> **scalarMultiplyEquals**(`scalar`): `Point`

Defined in: [src/Point.ts:139](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L139)

Multiplies this point by a value

:::caution[Deprecated]
This API is no longer supported and may be removed in a future release.
:::

#### Parameters

##### scalar

`number`

#### Returns

`Point`

thisArg

***

### scalarSubtract()

> **scalarSubtract**(`scalar`): `Point`

Defined in: [src/Point.ts:99](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L99)

Subtracts value from this point and returns a new one

#### Parameters

##### scalar

`number`

#### Returns

`Point`

***

### ~~scalarSubtractEquals()~~

> **scalarSubtractEquals**(`scalar`): `Point`

Defined in: [src/Point.ts:109](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L109)

Subtracts value from this point

:::caution[Deprecated]
This API is no longer supported and may be removed in a future release.
:::

#### Parameters

##### scalar

`number`

#### Returns

`Point`

thisArg

***

### setFromPoint()

> **setFromPoint**(`that`): `Point`

Defined in: [src/Point.ts:314](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L314)

Sets x/y of this point from another point

#### Parameters

##### that

[`XY`](/api/interfaces/xy/)

#### Returns

`Point`

***

### setX()

> **setX**(`x`): `Point`

Defined in: [src/Point.ts:296](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L296)

Sets x of this point

#### Parameters

##### x

`number`

#### Returns

`Point`

***

### setXY()

> **setXY**(`x`, `y`): `Point`

Defined in: [src/Point.ts:286](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L286)

Sets x/y of this point

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`Point`

***

### setY()

> **setY**(`y`): `Point`

Defined in: [src/Point.ts:305](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L305)

Sets y of this point

#### Parameters

##### y

`number`

#### Returns

`Point`

***

### subtract()

> **subtract**(`that`): `Point`

Defined in: [src/Point.ts:78](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L78)

Subtracts another point from this point and returns a new one

#### Parameters

##### that

[`XY`](/api/interfaces/xy/)

#### Returns

`Point`

new Point object with subtracted values

***

### ~~subtractEquals()~~

> **subtractEquals**(`that`): `Point`

Defined in: [src/Point.ts:88](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L88)

Subtracts another point from this point

:::caution[Deprecated]
This API is no longer supported and may be removed in a future release.
:::

#### Parameters

##### that

[`XY`](/api/interfaces/xy/)

#### Returns

`Point`

thisArg

***

### swap()

> **swap**(`that`): `void`

Defined in: [src/Point.ts:324](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L324)

Swaps x/y of this point and another point

#### Parameters

##### that

[`XY`](/api/interfaces/xy/)

#### Returns

`void`

***

### toString()

> **toString**(): `string`

Defined in: [src/Point.ts:277](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L277)

Returns string representation of this point

#### Returns

`string`

***

### transform()

> **transform**(`t`, `ignoreOffset?`): `Point`

Defined in: [src/Point.ts:366](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Point.ts#L366)

Apply transform t to point p

#### Parameters

##### t

[`TMat2D`](/api/type-aliases/tmat2d/)

The transform

##### ignoreOffset?

`boolean` = `false`

Indicates that the offset should not be applied

#### Returns

`Point`

The transformed point
