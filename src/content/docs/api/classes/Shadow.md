---
editUrl: false
next: false
prev: false
title: "Shadow"
---

Defined in: [src/Shadow.ts:63](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Shadow.ts#L63)

## Constructors

### Constructor

> **new Shadow**(`options?`): `Shadow`

Defined in: [src/Shadow.ts:118](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Shadow.ts#L118)

#### Parameters

##### options?

`Partial`\<[`TClassProperties`](/api/type-aliases/tclassproperties/)\<`Shadow`\>\>

Options object with any of color, blur, offsetX, offsetY properties or string (e.g. "rgba(0,0,0,0.2) 2px 2px 10px")

#### Returns

`Shadow`

#### See

[demo](http://fabric5.fabricjs.com/shadows|Shadow)

### Constructor

> **new Shadow**(`svgAttribute`): `Shadow`

Defined in: [src/Shadow.ts:119](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Shadow.ts#L119)

#### Parameters

##### svgAttribute

`string`

#### Returns

`Shadow`

## Properties

### affectStroke

> **affectStroke**: `boolean`

Defined in: [src/Shadow.ts:92](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Shadow.ts#L92)

Whether the shadow should affect stroke operations

***

### blur

> **blur**: `number`

Defined in: [src/Shadow.ts:74](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Shadow.ts#L74)

Shadow blur

***

### color

> **color**: `string`

Defined in: [src/Shadow.ts:68](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Shadow.ts#L68)

Shadow color

***

### id

> **id**: `number`

Defined in: [src/Shadow.ts:108](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Shadow.ts#L108)

***

### includeDefaultValues

> **includeDefaultValues**: `boolean`

Defined in: [src/Shadow.ts:98](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Shadow.ts#L98)

Indicates whether toObject should include default values

***

### nonScaling

> **nonScaling**: `boolean`

Defined in: [src/Shadow.ts:106](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Shadow.ts#L106)

When `false`, the shadow will scale with the object.
When `true`, the shadow's offsetX, offsetY, and blur will not be affected by the object's scale.
default to false

***

### offsetX

> **offsetX**: `number`

Defined in: [src/Shadow.ts:80](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Shadow.ts#L80)

Shadow horizontal offset

***

### offsetY

> **offsetY**: `number`

Defined in: [src/Shadow.ts:86](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Shadow.ts#L86)

Shadow vertical offset

***

### ownDefaults

> `static` **ownDefaults**: `Partial`\<[`TClassProperties`](/api/type-aliases/tclassproperties/)\<`Shadow`\>\> = `shadowDefaultValues`

Defined in: [src/Shadow.ts:110](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Shadow.ts#L110)

***

### type

> `static` **type**: `string` = `'shadow'`

Defined in: [src/Shadow.ts:112](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Shadow.ts#L112)

## Methods

### toObject()

> **toObject**(): `Partial`\<[`SerializedShadowOptions`](/api/type-aliases/serializedshadowoptions/)\>

Defined in: [src/Shadow.ts:215](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Shadow.ts#L215)

Returns object representation of a shadow

#### Returns

`Partial`\<[`SerializedShadowOptions`](/api/type-aliases/serializedshadowoptions/)\>

Object representation of a shadow instance

***

### toString()

> **toString**(): `string`

Defined in: [src/Shadow.ts:151](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Shadow.ts#L151)

Returns a string representation of an instance

#### Returns

`string`

Returns CSS3 text-shadow declaration

#### See

http://www.w3.org/TR/css-text-decor-3/#text-shadow

***

### toSVG()

> **toSVG**(`object`): `string`

Defined in: [src/Shadow.ts:160](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Shadow.ts#L160)

Returns SVG representation of a shadow

#### Parameters

##### object

[`FabricObject`](/api/classes/fabricobject/)

#### Returns

`string`

SVG representation of a shadow

***

### fromObject()

> `static` **fromObject**(`options`): `Promise`\<`Shadow`\>

Defined in: [src/Shadow.ts:231](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Shadow.ts#L231)

#### Parameters

##### options

`Partial`\<[`TClassProperties`](/api/type-aliases/tclassproperties/)\<`Shadow`\>\>

#### Returns

`Promise`\<`Shadow`\>

***

### parseShadow()

> `static` **parseShadow**(`value`): `object`

Defined in: [src/Shadow.ts:131](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Shadow.ts#L131)

#### Parameters

##### value

`string`

Shadow value to parse

#### Returns

`object`

Shadow object with color, offsetX, offsetY and blur

##### blur

> **blur**: `number`

##### color

> **color**: `string`

##### offsetX

> **offsetX**: `number`

##### offsetY

> **offsetY**: `number`
