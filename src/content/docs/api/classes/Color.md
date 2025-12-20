---
editUrl: false
next: false
prev: false
title: "Color"
---

Defined in: [src/color/Color.ts:18](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/color/Color.ts#L18)

Color common color operations

## See

[colors](http://fabric5.fabricjs.com/fabric-intro-part-2#colors)

## Constructors

### Constructor

> **new Color**(`color?`): `Color`

Defined in: [src/color/Color.ts:26](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/color/Color.ts#L26)

#### Parameters

##### color?

[`TColorArg`](/api/type-aliases/tcolorarg/)

optional in hex or rgb(a) or hsl format or from known color list

#### Returns

`Color`

## Properties

### isUnrecognised

> **isUnrecognised**: `boolean` = `false`

Defined in: [src/color/Color.ts:20](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/color/Color.ts#L20)

## Methods

### getAlpha()

> **getAlpha**(): `number`

Defined in: [src/color/Color.ts:134](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/color/Color.ts#L134)

Gets value of alpha channel for this color

#### Returns

`number`

0-1

***

### getSource()

> **getSource**(): [`TRGBAColorSource`](/api/type-aliases/trgbacolorsource/)

Defined in: [src/color/Color.ts:65](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/color/Color.ts#L65)

Returns source of this color (where source is an array representation; ex: [200, 200, 100, 1])

#### Returns

[`TRGBAColorSource`](/api/type-aliases/trgbacolorsource/)

***

### overlayWith()

> **overlayWith**(`otherColor`): `Color`

Defined in: [src/color/Color.ts:174](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/color/Color.ts#L174)

Overlays color with another color

#### Parameters

##### otherColor

`string` | `Color`

#### Returns

`Color`

thisArg

***

### setAlpha()

> **setAlpha**(`alpha`): `Color`

Defined in: [src/color/Color.ts:143](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/color/Color.ts#L143)

Sets value of alpha channel for this color

#### Parameters

##### alpha

`number`

Alpha value 0-1

#### Returns

`Color`

thisArg

***

### setSource()

> **setSource**(`source`): `void`

Defined in: [src/color/Color.ts:73](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/color/Color.ts#L73)

Sets source of this color (where source is an array representation; ex: [200, 200, 100, 1])

#### Parameters

##### source

[`TRGBAColorSource`](/api/type-aliases/trgbacolorsource/)

#### Returns

`void`

***

### toBlackWhite()

> **toBlackWhite**(`threshold`): `Color`

Defined in: [src/color/Color.ts:162](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/color/Color.ts#L162)

Transforms color to its black and white representation

#### Parameters

##### threshold

`number`

#### Returns

`Color`

thisArg

***

### toGrayscale()

> **toGrayscale**(): `Color`

Defined in: [src/color/Color.ts:152](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/color/Color.ts#L152)

Transforms color to its grayscale representation

#### Returns

`Color`

thisArg

***

### toHex()

> **toHex**(): `string`

Defined in: [src/color/Color.ts:116](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/color/Color.ts#L116)

Returns color representation in HEX format

#### Returns

`string`

ex: FF5555

***

### toHexa()

> **toHexa**(): `string`

Defined in: [src/color/Color.ts:125](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/color/Color.ts#L125)

Returns color representation in HEXA format

#### Returns

`string`

ex: FF5555CC

***

### toHsl()

> **toHsl**(): `string`

Defined in: [src/color/Color.ts:98](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/color/Color.ts#L98)

Returns color representation in HSL format

#### Returns

`string`

ex: hsl(0-360,0%-100%,0%-100%)

***

### toHsla()

> **toHsla**(): `string`

Defined in: [src/color/Color.ts:107](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/color/Color.ts#L107)

Returns color representation in HSLA format

#### Returns

`string`

ex: hsla(0-360,0%-100%,0%-100%,0-1)

***

### toRgb()

> **toRgb**(): `string`

Defined in: [src/color/Color.ts:81](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/color/Color.ts#L81)

Returns color representation in RGB format

#### Returns

`string`

ex: rgb(0-255,0-255,0-255)

***

### toRgba()

> **toRgba**(): `string`

Defined in: [src/color/Color.ts:90](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/color/Color.ts#L90)

Returns color representation in RGBA format

#### Returns

`string`

ex: rgba(0-255,0-255,0-255,0-1)

***

### fromHex()

> `static` **fromHex**(`color`): `Color`

Defined in: [src/color/Color.ts:287](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/color/Color.ts#L287)

Returns new color object, when given a color in HEX format

#### Parameters

##### color

`string`

Color value ex: FF5555

#### Returns

`Color`

***

### fromHsl()

> `static` **fromHsl**(`color`): `Color`

Defined in: [src/color/Color.ts:231](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/color/Color.ts#L231)

Returns new color object, when given a color in HSL format

#### Parameters

##### color

`string`

Color value ex: hsl(0-260,0%-100%,0%-100%)

#### Returns

`Color`

***

### fromHsla()

> `static` **fromHsla**(`color`): `Color`

Defined in: [src/color/Color.ts:240](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/color/Color.ts#L240)

Returns new color object, when given a color in HSLA format

#### Parameters

##### color

`string`

#### Returns

`Color`

***

### fromRgb()

> `static` **fromRgb**(`color`): `Color`

Defined in: [src/color/Color.ts:195](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/color/Color.ts#L195)

Returns new color object, when given a color in RGB format

#### Parameters

##### color

`string`

Color value ex: rgb(0-255,0-255,0-255)

#### Returns

`Color`

***

### fromRgba()

> `static` **fromRgba**(`color`): `Color`

Defined in: [src/color/Color.ts:204](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/color/Color.ts#L204)

Returns new color object, when given a color in RGBA format

#### Parameters

##### color

`string`

#### Returns

`Color`

***

### parseAngletoDegrees()

> `static` **parseAngletoDegrees**(`value`): `number`

Defined in: [src/color/Color.ts:319](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/color/Color.ts#L319)

Converts a string that could be any angle notation (50deg, 0.5turn, 2rad)
into degrees without the 'deg' suffix

#### Parameters

##### value

`string`

ex: 0deg, 0.5turn, 2rad

#### Returns

`number`

number in degrees or NaN if inputs are invalid

***

### sourceFromHex()

> `static` **sourceFromHex**(`color`): `undefined` \| [`TRGBAColorSource`](/api/type-aliases/trgbacolorsource/)

Defined in: [src/color/Color.ts:296](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/color/Color.ts#L296)

Returns array representation (ex: [100, 100, 200, 1]) of a color that's in HEX format

#### Parameters

##### color

`string`

ex: FF5555 or FF5544CC (RGBa)

#### Returns

`undefined` \| [`TRGBAColorSource`](/api/type-aliases/trgbacolorsource/)

source

***

### sourceFromHsl()

> `static` **sourceFromHsl**(`color`): `undefined` \| [`TRGBAColorSource`](/api/type-aliases/trgbacolorsource/)

Defined in: [src/color/Color.ts:251](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/color/Color.ts#L251)

Returns array representation (ex: [100, 100, 200, 1]) of a color that's in HSL or HSLA format.
Adapted from <a href="https://rawgithub.com/mjijackson/mjijackson.github.com/master/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript.html">https://github.com/mjijackson</a>

#### Parameters

##### color

`string`

Color value ex: hsl(0-360,0%-100%,0%-100%) or hsla(0-360,0%-100%,0%-100%, 0-1)

#### Returns

`undefined` \| [`TRGBAColorSource`](/api/type-aliases/trgbacolorsource/)

source

#### See

http://http://www.w3.org/TR/css3-color/#hsl-color

***

### sourceFromRgb()

> `static` **sourceFromRgb**(`color`): `undefined` \| [`TRGBAColorSource`](/api/type-aliases/trgbacolorsource/)

Defined in: [src/color/Color.ts:213](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/color/Color.ts#L213)

Returns array representation (ex: [100, 100, 200, 1]) of a color that's in RGB or RGBA format

#### Parameters

##### color

`string`

Color value ex: rgb(0-255,0-255,0-255), rgb(0%-100%,0%-100%,0%-100%)

#### Returns

`undefined` \| [`TRGBAColorSource`](/api/type-aliases/trgbacolorsource/)

source
