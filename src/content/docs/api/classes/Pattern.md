---
editUrl: false
next: false
prev: false
title: "Pattern"
---

Defined in: [src/Pattern/Pattern.ts:20](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Pattern/Pattern.ts#L20)

## See

 - [demo](http://fabric5.fabricjs.com/patterns)
 - [demo](http://fabric5.fabricjs.com/dynamic-patterns)

## Constructors

### Constructor

> **new Pattern**(`options?`): `Pattern`

Defined in: [src/Pattern/Pattern.ts:91](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Pattern/Pattern.ts#L91)

Constructor

#### Parameters

##### options?

[`PatternOptions`](/api/type-aliases/patternoptions/)

Options object

#### Returns

`Pattern`

## Properties

### crossOrigin

> **crossOrigin**: [`TCrossOrigin`](/api/type-aliases/tcrossorigin/) = `''`

Defined in: [src/Pattern/Pattern.ts:60](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Pattern/Pattern.ts#L60)

***

### excludeFromExport?

> `optional` **excludeFromExport**: `boolean`

Defined in: [src/Pattern/Pattern.ts:78](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Pattern/Pattern.ts#L78)

If true, this object will not be exported during the serialization of a canvas

***

### id

> `readonly` **id**: `number`

Defined in: [src/Pattern/Pattern.ts:84](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Pattern/Pattern.ts#L84)

ID used for SVG export functionalities

***

### offsetX

> **offsetX**: `number` = `0`

Defined in: [src/Pattern/Pattern.ts:49](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Pattern/Pattern.ts#L49)

Pattern horizontal offset from object's left/top corner

***

### offsetY

> **offsetY**: `number` = `0`

Defined in: [src/Pattern/Pattern.ts:55](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Pattern/Pattern.ts#L55)

Pattern vertical offset from object's left/top corner

***

### patternTransform?

> `optional` **patternTransform**: [`TMat2D`](/api/type-aliases/tmat2d/)

Defined in: [src/Pattern/Pattern.ts:67](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Pattern/Pattern.ts#L67)

transform matrix to change the pattern, imported from svgs.

#### Todo

verify if using the identity matrix as default makes the rest of the code more easy

***

### repeat

> **repeat**: [`PatternRepeat`](/api/type-aliases/patternrepeat/) = `'repeat'`

Defined in: [src/Pattern/Pattern.ts:43](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Pattern/Pattern.ts#L43)

#### Defaults

***

### source

> **source**: `CanvasImageSource`

Defined in: [src/Pattern/Pattern.ts:72](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Pattern/Pattern.ts#L72)

The actual pixel source of the pattern

***

### type

> `static` **type**: `string` = `'Pattern'`

Defined in: [src/Pattern/Pattern.ts:21](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Pattern/Pattern.ts#L21)

## Accessors

### type

#### Get Signature

> **get** **type**(): `string`

Defined in: [src/Pattern/Pattern.ts:31](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Pattern/Pattern.ts#L31)

Legacy identifier of the class. Prefer using this.constructor.type 'Pattern'
or utils like isPattern, or instance of to indentify a pattern in your code.
Will be removed in future versiones

##### TODO

add sustainable warning message

:::caution[Deprecated]
This API is no longer supported and may be removed in a future release.
:::

##### Returns

`string`

#### Set Signature

> **set** **type**(`value`): `void`

Defined in: [src/Pattern/Pattern.ts:35](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Pattern/Pattern.ts#L35)

##### Parameters

###### value

`string`

##### Returns

`void`

## Methods

### isCanvasSource()

> **isCanvasSource**(): `this is { source: HTMLCanvasElement }`

Defined in: [src/Pattern/Pattern.ts:108](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Pattern/Pattern.ts#L108)

#### Returns

`this is { source: HTMLCanvasElement }`

true if [source](/api/classes/pattern/#source) is a <canvas> element

***

### isImageSource()

> **isImageSource**(): `this is { source: HTMLImageElement }`

Defined in: [src/Pattern/Pattern.ts:99](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Pattern/Pattern.ts#L99)

#### Returns

`this is { source: HTMLImageElement }`

true if [source](/api/classes/pattern/#source) is an <img> element

***

### sourceToString()

> **sourceToString**(): `string`

Defined in: [src/Pattern/Pattern.ts:112](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Pattern/Pattern.ts#L112)

#### Returns

`string`

***

### toLive()

> **toLive**(`ctx`): `null` \| `CanvasPattern`

Defined in: [src/Pattern/Pattern.ts:125](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Pattern/Pattern.ts#L125)

Returns an instance of CanvasPattern

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Context to create pattern

#### Returns

`null` \| `CanvasPattern`

***

### toObject()

> **toObject**(`propertiesToInclude?`): `Record`\<`string`, `any`\>

Defined in: [src/Pattern/Pattern.ts:146](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Pattern/Pattern.ts#L146)

Returns object representation of a pattern

#### Parameters

##### propertiesToInclude?

`string`[] = `[]`

Any properties that you might want to additionally include in the output

#### Returns

`Record`\<`string`, `any`\>

Object representation of a pattern instance

***

### toSVG()

> **toSVG**(`__namedParameters`): `string`

Defined in: [src/Pattern/Pattern.ts:166](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Pattern/Pattern.ts#L166)

Returns SVG representation of a pattern

#### Parameters

##### \_\_namedParameters

[`TSize`](/api/type-aliases/tsize/)

#### Returns

`string`

***

### fromObject()

> `static` **fromObject**(`__namedParameters`, `options?`): `Promise`\<`Pattern`\>

Defined in: [src/Pattern/Pattern.ts:192](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Pattern/Pattern.ts#L192)

#### Parameters

##### \_\_namedParameters

[`SerializedPatternOptions`](/api/type-aliases/serializedpatternoptions/)

##### options?

[`Abortable`](/api/type-aliases/abortable/)

#### Returns

`Promise`\<`Pattern`\>
