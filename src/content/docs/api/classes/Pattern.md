---
editUrl: false
next: false
prev: false
title: "Pattern"
---

Defined in: [src/Pattern/Pattern.ts:21](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Pattern/Pattern.ts#L21)

## See

 - [demo](http://fabric5.fabricjs.com/patterns)
 - [demo](http://fabric5.fabricjs.com/dynamic-patterns)

## Constructors

### Constructor

> **new Pattern**(`options?`): `Pattern`

Defined in: [src/Pattern/Pattern.ts:92](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Pattern/Pattern.ts#L92)

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

Defined in: [src/Pattern/Pattern.ts:61](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Pattern/Pattern.ts#L61)

***

### excludeFromExport?

> `optional` **excludeFromExport**: `boolean`

Defined in: [src/Pattern/Pattern.ts:79](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Pattern/Pattern.ts#L79)

If true, this object will not be exported during the serialization of a canvas

***

### id

> `readonly` **id**: `number`

Defined in: [src/Pattern/Pattern.ts:85](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Pattern/Pattern.ts#L85)

ID used for SVG export functionalities

***

### offsetX

> **offsetX**: `number` = `0`

Defined in: [src/Pattern/Pattern.ts:50](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Pattern/Pattern.ts#L50)

Pattern horizontal offset from object's left/top corner

***

### offsetY

> **offsetY**: `number` = `0`

Defined in: [src/Pattern/Pattern.ts:56](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Pattern/Pattern.ts#L56)

Pattern vertical offset from object's left/top corner

***

### patternTransform?

> `optional` **patternTransform**: [`TMat2D`](/api/type-aliases/tmat2d/)

Defined in: [src/Pattern/Pattern.ts:68](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Pattern/Pattern.ts#L68)

transform matrix to change the pattern, imported from svgs.

#### Todo

verify if using the identity matrix as default makes the rest of the code more easy

***

### repeat

> **repeat**: [`PatternRepeat`](/api/type-aliases/patternrepeat/) = `'repeat'`

Defined in: [src/Pattern/Pattern.ts:44](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Pattern/Pattern.ts#L44)

#### Defaults

***

### source

> **source**: `CanvasImageSource`

Defined in: [src/Pattern/Pattern.ts:73](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Pattern/Pattern.ts#L73)

The actual pixel source of the pattern

***

### type

> `static` **type**: `string` = `'Pattern'`

Defined in: [src/Pattern/Pattern.ts:22](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Pattern/Pattern.ts#L22)

## Accessors

### type

#### Get Signature

> **get** **type**(): `string`

Defined in: [src/Pattern/Pattern.ts:32](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Pattern/Pattern.ts#L32)

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

Defined in: [src/Pattern/Pattern.ts:36](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Pattern/Pattern.ts#L36)

##### Parameters

###### value

`string`

##### Returns

`void`

## Methods

### isCanvasSource()

> **isCanvasSource**(): `this is { source: HTMLCanvasElement }`

Defined in: [src/Pattern/Pattern.ts:109](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Pattern/Pattern.ts#L109)

#### Returns

`this is { source: HTMLCanvasElement }`

true if [source](/api/classes/pattern/#source) is a <canvas> element

***

### isImageSource()

> **isImageSource**(): `this is { source: HTMLImageElement }`

Defined in: [src/Pattern/Pattern.ts:100](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Pattern/Pattern.ts#L100)

#### Returns

`this is { source: HTMLImageElement }`

true if [source](/api/classes/pattern/#source) is an <img> element

***

### sourceToString()

> **sourceToString**(): `string`

Defined in: [src/Pattern/Pattern.ts:113](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Pattern/Pattern.ts#L113)

#### Returns

`string`

***

### toLive()

> **toLive**(`ctx`): `null` \| `CanvasPattern`

Defined in: [src/Pattern/Pattern.ts:126](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Pattern/Pattern.ts#L126)

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

Defined in: [src/Pattern/Pattern.ts:147](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Pattern/Pattern.ts#L147)

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

Defined in: [src/Pattern/Pattern.ts:167](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Pattern/Pattern.ts#L167)

Returns SVG representation of a pattern

#### Parameters

##### \_\_namedParameters

[`TSize`](/api/type-aliases/tsize/)

#### Returns

`string`

***

### fromObject()

> `static` **fromObject**(`__namedParameters`, `options?`): `Promise`\<`Pattern`\>

Defined in: [src/Pattern/Pattern.ts:193](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Pattern/Pattern.ts#L193)

#### Parameters

##### \_\_namedParameters

[`SerializedPatternOptions`](/api/type-aliases/serializedpatternoptions/)

##### options?

[`Abortable`](/api/type-aliases/abortable/)

#### Returns

`Promise`\<`Pattern`\>
