---
editUrl: false
next: false
prev: false
title: "Gradient"
---

Defined in: [src/gradient/Gradient.ts:32](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/gradient/Gradient.ts#L32)

Gradient class
 Gradient

## See

[http://fabric5.fabricjs.com/fabric-intro-part-2#gradients](http://fabric5.fabricjs.com/fabric-intro-part-2#gradients)

## Type Parameters

### S

`S`

### T

`T` *extends* [`GradientType`](/api/type-aliases/gradienttype/) = `S` *extends* [`GradientType`](/api/type-aliases/gradienttype/) ? `S` : `"linear"`

## Constructors

### Constructor

> **new Gradient**\<`S`, `T`\>(`options`): `Gradient`\<`S`, `T`\>

Defined in: [src/gradient/Gradient.ts:105](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/gradient/Gradient.ts#L105)

#### Parameters

##### options

[`GradientOptions`](/api/type-aliases/gradientoptions/)\<`T`\>

#### Returns

`Gradient`\<`S`, `T`\>

## Properties

### colorStops

> **colorStops**: [`ColorStop`](/api/type-aliases/colorstop/)[]

Defined in: [src/gradient/Gradient.ts:89](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/gradient/Gradient.ts#L89)

Defines how many colors a gradient has and how they are located on the axis
defined by coords

***

### coords

> **coords**: [`GradientCoords`](/api/type-aliases/gradientcoords/)\<`T`\>

Defined in: [src/gradient/Gradient.ts:82](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/gradient/Gradient.ts#L82)

Defines how the gradient is located in space and spread

***

### excludeFromExport?

> `optional` **excludeFromExport**: `boolean`

Defined in: [src/gradient/Gradient.ts:95](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/gradient/Gradient.ts#L95)

If true, this object will not be exported during the serialization of a canvas

***

### gradientTransform?

> `optional` **gradientTransform**: [`TMat2D`](/api/type-aliases/tmat2d/)

Defined in: [src/gradient/Gradient.ts:58](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/gradient/Gradient.ts#L58)

A transform matrix to apply to the gradient before painting.
Imported from svg gradients, is not applied with the current transform in the center.
Before this transform is applied, the origin point is at the top left corner of the object
plus the addition of offsetY and offsetX.

#### Default

```ts
null
```

***

### gradientUnits

> **gradientUnits**: [`GradientUnits`](/api/type-aliases/gradientunits/)

Defined in: [src/gradient/Gradient.ts:69](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/gradient/Gradient.ts#L69)

coordinates units for coords.
If `pixels`, the number of coords are in the same unit of width / height.
If set as `percentage` the coords are still a number, but 1 means 100% of width
for the X and 100% of the height for the y. It can be bigger than 1 and negative.
allowed values pixels or percentage.

#### Default

```ts
'pixels'
```

***

### id

> `readonly` **id**: `string` \| `number`

Defined in: [src/gradient/Gradient.ts:101](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/gradient/Gradient.ts#L101)

ID used for SVG export functionalities

***

### offsetX

> **offsetX**: `number`

Defined in: [src/gradient/Gradient.ts:41](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/gradient/Gradient.ts#L41)

Horizontal offset for aligning gradients coming from SVG when outside pathgroups

#### Default

```ts
0
```

***

### offsetY

> **offsetY**: `number`

Defined in: [src/gradient/Gradient.ts:48](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/gradient/Gradient.ts#L48)

Vertical offset for aligning gradients coming from SVG when outside pathgroups

#### Default

```ts
0
```

***

### type

> **type**: `T`

Defined in: [src/gradient/Gradient.ts:76](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/gradient/Gradient.ts#L76)

Gradient type linear or radial

#### Default

```ts
'linear'
```

***

### type

> `static` **type**: `string` = `'Gradient'`

Defined in: [src/gradient/Gradient.ts:103](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/gradient/Gradient.ts#L103)

## Methods

### addColorStop()

> **addColorStop**(`colorStops`): `Gradient`\<`S`, `T`\>

Defined in: [src/gradient/Gradient.ts:136](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/gradient/Gradient.ts#L136)

Adds another colorStop

#### Parameters

##### colorStops

`Record`\<`string`, `string`\>

#### Returns

`Gradient`\<`S`, `T`\>

thisArg

***

### toLive()

> **toLive**(`ctx`): `CanvasGradient`

Defined in: [src/gradient/Gradient.ts:313](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/gradient/Gradient.ts#L313)

Returns an instance of CanvasGradient

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Context to render on

#### Returns

`CanvasGradient`

***

### toObject()

> **toObject**(`propertiesToInclude?`): [`SerializedGradientProps`](/api/type-aliases/serializedgradientprops/)\<`T`\>

Defined in: [src/gradient/Gradient.ts:151](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/gradient/Gradient.ts#L151)

Returns object representation of a gradient

#### Parameters

##### propertiesToInclude?

`string`[]

Any properties that you might want to additionally include in the output

#### Returns

[`SerializedGradientProps`](/api/type-aliases/serializedgradientprops/)\<`T`\>

***

### toSVG()

> **toSVG**(`object`, `__namedParameters`): `string`

Defined in: [src/gradient/Gradient.ts:174](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/gradient/Gradient.ts#L174)

Returns SVG representation of an gradient

#### Parameters

##### object

[`FabricObject`](/api/classes/fabricobject/)

Object to create a gradient for

##### \_\_namedParameters

###### additionalTransform?

`string`

#### Returns

`string`

SVG representation of an gradient (linear/radial)

***

### fromElement()

> `static` **fromElement**(`el`, `instance`, `svgOptions`): `Gradient`\<[`GradientType`](/api/type-aliases/gradienttype/)\>

Defined in: [src/gradient/Gradient.ts:389](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/gradient/Gradient.ts#L389)

Returns [Gradient](/api/classes/gradient/) instance from an SVG element

#### Parameters

##### el

`SVGGradientElement`

SVG gradient element

##### instance

[`FabricObject`](/api/classes/fabricobject/)

##### svgOptions

[`SVGOptions`](/api/type-aliases/svgoptions/)

an object containing the size of the SVG in order to parse correctly gradients
that uses gradientUnits as 'userSpaceOnUse' and percentages.

#### Returns

`Gradient`\<[`GradientType`](/api/type-aliases/gradienttype/)\>

Gradient instance

#### See

 - http://www.w3.org/TR/SVG/pservers.html#LinearGradientElement
 - http://www.w3.org/TR/SVG/pservers.html#RadialGradientElement

#### Example

```ts
<linearGradient id="linearGrad1">
   <stop offset="0%" stop-color="white"/>
   <stop offset="100%" stop-color="black"/>
 </linearGradient>

 OR

 <linearGradient id="linearGrad2">
   <stop offset="0" style="stop-color:rgb(255,255,255)"/>
   <stop offset="1" style="stop-color:rgb(0,0,0)"/>
 </linearGradient>

 OR

 <radialGradient id="radialGrad1">
   <stop offset="0%" stop-color="white" stop-opacity="1" />
   <stop offset="50%" stop-color="black" stop-opacity="0.5" />
   <stop offset="100%" stop-color="white" stop-opacity="1" />
 </radialGradient>

 OR

 <radialGradient id="radialGrad2">
   <stop offset="0" stop-color="rgb(255,255,255)" />
   <stop offset="0.5" stop-color="rgb(0,0,0)" />
   <stop offset="1" stop-color="rgb(255,255,255)" />
 </radialGradient>
```

***

### fromObject()

#### Call Signature

> `static` **fromObject**(`options`): `Promise`\<`Gradient`\<`"linear"`, `"linear"`\>\>

Defined in: [src/gradient/Gradient.ts:327](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/gradient/Gradient.ts#L327)

##### Parameters

###### options

[`GradientOptions`](/api/type-aliases/gradientoptions/)\<`"linear"`\>

##### Returns

`Promise`\<`Gradient`\<`"linear"`, `"linear"`\>\>

#### Call Signature

> `static` **fromObject**(`options`): `Promise`\<`Gradient`\<`"radial"`, `"radial"`\>\>

Defined in: [src/gradient/Gradient.ts:330](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/gradient/Gradient.ts#L330)

##### Parameters

###### options

[`GradientOptions`](/api/type-aliases/gradientoptions/)\<`"radial"`\>

##### Returns

`Promise`\<`Gradient`\<`"radial"`, `"radial"`\>\>
