---
editUrl: false
next: false
prev: false
title: "SerializedITextProps"
---

Defined in: [src/shapes/IText/IText.ts:74](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L74)

## Extends

- [`SerializedTextProps`](/api/interfaces/serializedtextprops/).`UniqueITextProps`

## Extended by

- [`SerializedTextboxProps`](/api/interfaces/serializedtextboxprops/)

## Properties

### angle

> **angle**: [`TDegree`](/api/type-aliases/tdegree/)

Defined in: [src/shapes/Object/types/BaseProps.ts:61](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/BaseProps.ts#L61)

Angle of rotation of an object (in degrees)

#### Default

```ts
0
```

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`angle`](/api/interfaces/serializedtextprops/#angle)

***

### backgroundColor

> **backgroundColor**: `string`

Defined in: [src/shapes/Object/types/SerializedObjectProps.ts:24](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/SerializedObjectProps.ts#L24)

Background color of an object.
takes css colors https://www.w3.org/TR/css-color-3/

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`backgroundColor`](/api/interfaces/serializedtextprops/#backgroundcolor)

***

### charSpacing

> **charSpacing**: `number`

Defined in: [src/shapes/Text/Text.ts:111](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L111)

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`charSpacing`](/api/interfaces/serializedtextprops/#charspacing)

***

### clipPath?

> `optional` **clipPath**: `Partial`\<[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/) & `ClipPathProps`\>

Defined in: [src/shapes/Object/types/SerializedObjectProps.ts:46](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/SerializedObjectProps.ts#L46)

a fabricObject that, without stroke define a clipping area with their shape. filled in black
the clipPath object gets used when the object has rendered, and the context is placed in the center
of the object cacheCanvas.
If you want 0,0 of a clipPath to align with an object center, use clipPath.originX/Y to 'center'

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`clipPath`](/api/interfaces/serializedtextprops/#clippath)

***

### direction

> **direction**: `CanvasDirection`

Defined in: [src/shapes/Text/Text.ts:123](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L123)

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`direction`](/api/interfaces/serializedtextprops/#direction)

***

### fill

> **fill**: `null` \| `string` \| `Record`\<`string`, `any`\> \| [`SerializedGradientProps`](/api/type-aliases/serializedgradientprops/)\<`"linear"`\> \| [`SerializedGradientProps`](/api/type-aliases/serializedgradientprops/)\<`"radial"`\>

Defined in: [src/shapes/Object/types/FillStrokeProps.ts:16](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/FillStrokeProps.ts#L16)

Color of object's fill
takes css colors https://www.w3.org/TR/css-color-3/

#### Default

```ts
rgb(0,0,0)
```

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`fill`](/api/interfaces/serializedtextprops/#fill)

***

### fillRule

> **fillRule**: `CanvasFillRule`

Defined in: [src/shapes/Object/types/FillStrokeProps.ts:25](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/FillStrokeProps.ts#L25)

Fill rule used to fill an object
accepted values are nonzero, evenodd
<b>Backwards incompatibility note:</b> This property was used for setting globalCompositeOperation until v1.4.12 (use `globalCompositeOperation` instead)

#### Default

```ts
nonzero
```

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`fillRule`](/api/interfaces/serializedtextprops/#fillrule)

***

### flipX

> **flipX**: `boolean`

Defined in: [src/shapes/Object/types/BaseProps.ts:68](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/BaseProps.ts#L68)

When true, an object is rendered as flipped horizontally

#### Default

```ts
false
```

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`flipX`](/api/interfaces/serializedtextprops/#flipx)

***

### flipY

> **flipY**: `boolean`

Defined in: [src/shapes/Object/types/BaseProps.ts:75](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/BaseProps.ts#L75)

When true, an object is rendered as flipped vertically

#### Default

```ts
false
```

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`flipY`](/api/interfaces/serializedtextprops/#flipy)

***

### fontFamily

> **fontFamily**: `string`

Defined in: [src/shapes/Text/Text.ts:115](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L115)

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`fontFamily`](/api/interfaces/serializedtextprops/#fontfamily)

***

### fontSize

> **fontSize**: `number`

Defined in: [src/shapes/Text/Text.ts:113](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L113)

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`fontSize`](/api/interfaces/serializedtextprops/#fontsize)

***

### fontStyle

> **fontStyle**: `FontStyle`

Defined in: [src/shapes/Text/Text.ts:116](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L116)

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`fontStyle`](/api/interfaces/serializedtextprops/#fontstyle)

***

### fontWeight

> **fontWeight**: `string` \| `number`

Defined in: [src/shapes/Text/Text.ts:114](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L114)

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`fontWeight`](/api/interfaces/serializedtextprops/#fontweight)

***

### globalCompositeOperation

> **globalCompositeOperation**: `GlobalCompositeOperation`

Defined in: [src/shapes/Object/types/SerializedObjectProps.ts:17](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/SerializedObjectProps.ts#L17)

Composite rule used for canvas globalCompositeOperation

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`globalCompositeOperation`](/api/interfaces/serializedtextprops/#globalcompositeoperation)

***

### height

> **height**: `number`

Defined in: [src/shapes/Object/types/BaseProps.ts:32](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/BaseProps.ts#L32)

Object height

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`height`](/api/interfaces/serializedtextprops/#height)

***

### left

> **left**: `number`

Defined in: [src/shapes/Object/types/BaseProps.ts:11](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/BaseProps.ts#L11)

Left position of an object.
Note that by default it's relative to object left.
You can change this by setting originX

#### Default

```ts
0
```

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`left`](/api/interfaces/serializedtextprops/#left)

***

### lineHeight

> **lineHeight**: `number`

Defined in: [src/shapes/Text/Text.ts:112](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L112)

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`lineHeight`](/api/interfaces/serializedtextprops/#lineheight)

***

### linethrough

> **linethrough**: `boolean`

Defined in: [src/shapes/Text/Text.ts:121](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L121)

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`linethrough`](/api/interfaces/serializedtextprops/#linethrough)

***

### opacity

> **opacity**: `number`

Defined in: [src/shapes/Object/types/SerializedObjectProps.ts:11](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/SerializedObjectProps.ts#L11)

Opacity of an object

#### Default

```ts
1
```

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`opacity`](/api/interfaces/serializedtextprops/#opacity)

***

### ~~originX~~

> **originX**: [`TOriginX`](/api/type-aliases/toriginx/)

Defined in: [src/shapes/Object/types/BaseProps.ts:43](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/BaseProps.ts#L43)

Horizontal origin of transformation of an object (`left`, `center`, `right`  or `[0, 1]`)
See http://jsfiddle.net/1ow02gea/244/ on how originX/originY affect objects in groups

:::caution[Deprecated]
please set your default to 'center' in new projects and don't use it to build logic
The reason is explained here: https://github.com/fabricjs/fabric.js/discussions/9736
To set the default value to 'center' import BaseFabricObject and set the static BaseFabricObject.ownDefaults.originX = 'center'
:::

#### Default

```ts
'left'
```

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`originX`](/api/interfaces/serializedtextprops/#originx)

***

### ~~originY~~

> **originY**: [`TOriginY`](/api/type-aliases/toriginy/)

Defined in: [src/shapes/Object/types/BaseProps.ts:54](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/BaseProps.ts#L54)

Vertical origin of transformation of an object (`top`, `center`, `bottom` or `[0, 1]`)
See http://jsfiddle.net/1ow02gea/244/ on how originX/originY affect objects in groups

:::caution[Deprecated]
please set your default to 'center' in new projects and don't use it to build logic
The reason is explained here: https://github.com/fabricjs/fabric.js/discussions/9736
To set the default value to 'center' import BaseFabricObject and set the static BaseFabricObject.ownDefaults.originY = 'center'
:::

#### Default

```ts
'top'
```

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`originY`](/api/interfaces/serializedtextprops/#originy)

***

### overline

> **overline**: `boolean`

Defined in: [src/shapes/Text/Text.ts:120](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L120)

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`overline`](/api/interfaces/serializedtextprops/#overline)

***

### paintFirst

> **paintFirst**: `"fill"` \| `"stroke"`

Defined in: [src/shapes/Object/types/FillStrokeProps.ts:8](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/FillStrokeProps.ts#L8)

Determines if the fill or the stroke is drawn first (one of "fill" or "stroke")

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`paintFirst`](/api/interfaces/serializedtextprops/#paintfirst)

***

### path?

> `optional` **path**: [`Path`](/api/classes/path/)\<`Partial`\<[`PathProps`](/api/interfaces/pathprops/)\>, [`SerializedPathProps`](/api/interfaces/serializedpathprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

Defined in: [src/shapes/Text/Text.ts:124](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L124)

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`path`](/api/interfaces/serializedtextprops/#path)

***

### pathAlign

> **pathAlign**: [`TPathAlign`](/api/type-aliases/tpathalign/)

Defined in: [src/shapes/Text/Text.ts:118](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L118)

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`pathAlign`](/api/interfaces/serializedtextprops/#pathalign)

***

### pathSide

> **pathSide**: [`TPathSide`](/api/type-aliases/tpathside/)

Defined in: [src/shapes/Text/Text.ts:117](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L117)

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`pathSide`](/api/interfaces/serializedtextprops/#pathside)

***

### scaleX

> **scaleX**: `number`

Defined in: [src/shapes/Object/types/BaseProps.ts:82](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/BaseProps.ts#L82)

Object scale factor (horizontal)

#### Default

```ts
1
```

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`scaleX`](/api/interfaces/serializedtextprops/#scalex)

***

### scaleY

> **scaleY**: `number`

Defined in: [src/shapes/Object/types/BaseProps.ts:89](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/BaseProps.ts#L89)

Object scale factor (vertical)

#### Default

```ts
1
```

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`scaleY`](/api/interfaces/serializedtextprops/#scaley)

***

### selectionEnd

> **selectionEnd**: `number`

Defined in: [src/shapes/IText/IText.ts:71](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L71)

#### Inherited from

`UniqueITextProps.selectionEnd`

***

### selectionStart

> **selectionStart**: `number`

Defined in: [src/shapes/IText/IText.ts:70](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L70)

#### Inherited from

`UniqueITextProps.selectionStart`

***

### shadow

> **shadow**: `null` \| `Partial`\<[`SerializedShadowOptions`](/api/type-aliases/serializedshadowoptions/)\>

Defined in: [src/shapes/Object/types/SerializedObjectProps.ts:31](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/SerializedObjectProps.ts#L31)

Shadow object representing shadow of this shape

#### Default

```ts
null
```

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`shadow`](/api/interfaces/serializedtextprops/#shadow)

***

### skewX

> **skewX**: [`TDegree`](/api/type-aliases/tdegree/)

Defined in: [src/shapes/Object/types/BaseProps.ts:96](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/BaseProps.ts#L96)

Angle of skew on x axes of an object (in degrees)

#### Default

```ts
0
```

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`skewX`](/api/interfaces/serializedtextprops/#skewx)

***

### skewY

> **skewY**: [`TDegree`](/api/type-aliases/tdegree/)

Defined in: [src/shapes/Object/types/BaseProps.ts:103](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/BaseProps.ts#L103)

Angle of skew on y axes of an object (in degrees)

#### Default

```ts
0
```

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`skewY`](/api/interfaces/serializedtextprops/#skewy)

***

### stroke

> **stroke**: `null` \| `string` \| `Record`\<`string`, `any`\> \| [`SerializedGradientProps`](/api/type-aliases/serializedgradientprops/)\<`"linear"`\> \| [`SerializedGradientProps`](/api/type-aliases/serializedgradientprops/)\<`"radial"`\>

Defined in: [src/shapes/Object/types/FillStrokeProps.ts:33](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/FillStrokeProps.ts#L33)

When defined, an object is rendered via stroke and this property specifies its color
takes css colors https://www.w3.org/TR/css-color-3/

#### Default

```ts
null
```

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`stroke`](/api/interfaces/serializedtextprops/#stroke)

***

### strokeDashArray

> **strokeDashArray**: `null` \| `number`[]

Defined in: [src/shapes/Object/types/FillStrokeProps.ts:47](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/FillStrokeProps.ts#L47)

Array specifying dash pattern of an object's stroke (stroke must be defined)

#### Default

```ts
null;
```

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`strokeDashArray`](/api/interfaces/serializedtextprops/#strokedasharray)

***

### strokeDashOffset

> **strokeDashOffset**: `number`

Defined in: [src/shapes/Object/types/FillStrokeProps.ts:54](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/FillStrokeProps.ts#L54)

Line offset of an object's stroke

#### Default

```ts
0
```

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`strokeDashOffset`](/api/interfaces/serializedtextprops/#strokedashoffset)

***

### strokeLineCap

> **strokeLineCap**: `CanvasLineCap`

Defined in: [src/shapes/Object/types/FillStrokeProps.ts:61](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/FillStrokeProps.ts#L61)

Line endings style of an object's stroke (one of "butt", "round", "square")

#### Default

```ts
butt
```

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`strokeLineCap`](/api/interfaces/serializedtextprops/#strokelinecap)

***

### strokeLineJoin

> **strokeLineJoin**: `CanvasLineJoin`

Defined in: [src/shapes/Object/types/FillStrokeProps.ts:67](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/FillStrokeProps.ts#L67)

Corner style of an object's stroke (one of "bevel", "round", "miter")

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`strokeLineJoin`](/api/interfaces/serializedtextprops/#strokelinejoin)

***

### strokeMiterLimit

> **strokeMiterLimit**: `number`

Defined in: [src/shapes/Object/types/FillStrokeProps.ts:74](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/FillStrokeProps.ts#L74)

Maximum miter length (used for strokeLineJoin = "miter") of an object's stroke

#### Default

```ts
4
```

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`strokeMiterLimit`](/api/interfaces/serializedtextprops/#strokemiterlimit)

***

### strokeUniform

> **strokeUniform**: `boolean`

Defined in: [src/shapes/Object/types/FillStrokeProps.ts:87](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/FillStrokeProps.ts#L87)

When `false`, the stoke width will scale with the object.
When `true`, the stroke will always match the exact pixel size entered for stroke width.
this Property does not work on Text classes or drawing call that uses strokeText,fillText methods
default to false

#### Since

2.6.0

#### Default

```ts
false
```

#### Default

```ts
false
```

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`strokeUniform`](/api/interfaces/serializedtextprops/#strokeuniform)

***

### strokeWidth

> **strokeWidth**: `number`

Defined in: [src/shapes/Object/types/FillStrokeProps.ts:40](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/FillStrokeProps.ts#L40)

Width of a stroke used to render this object

#### Default

```ts
1
```

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`strokeWidth`](/api/interfaces/serializedtextprops/#strokewidth)

***

### styles

> **styles**: [`TextStyle`](/api/type-aliases/textstyle/) \| [`TextStyleArray`](/api/fabric/namespaces/util/type-aliases/textstylearray/)

Defined in: [src/shapes/Text/Text.ts:131](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L131)

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`styles`](/api/interfaces/serializedtextprops/#styles)

***

### textAlign

> **textAlign**: `TextAlign`

Defined in: [src/shapes/Text/Text.ts:122](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L122)

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`textAlign`](/api/interfaces/serializedtextprops/#textalign)

***

### textDecorationColor?

> `optional` **textDecorationColor**: `string`

Defined in: [src/shapes/Text/Text.ts:126](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L126)

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`textDecorationColor`](/api/interfaces/serializedtextprops/#textdecorationcolor)

***

### textDecorationThickness

> **textDecorationThickness**: `number`

Defined in: [src/shapes/Text/Text.ts:125](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L125)

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`textDecorationThickness`](/api/interfaces/serializedtextprops/#textdecorationthickness)

***

### top

> **top**: `number`

Defined in: [src/shapes/Object/types/BaseProps.ts:20](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/BaseProps.ts#L20)

Top position of an object.
Note that by default it's relative to object top.
You can change this by setting originY

#### Default

```ts
0
```

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`top`](/api/interfaces/serializedtextprops/#top)

***

### underline

> **underline**: `boolean`

Defined in: [src/shapes/Text/Text.ts:119](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L119)

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`underline`](/api/interfaces/serializedtextprops/#underline)

***

### visible

> **visible**: `boolean`

Defined in: [src/shapes/Object/types/SerializedObjectProps.ts:37](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/SerializedObjectProps.ts#L37)

When set to `false`, an object is not rendered on canvas

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`visible`](/api/interfaces/serializedtextprops/#visible)

***

### width

> **width**: `number`

Defined in: [src/shapes/Object/types/BaseProps.ts:26](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/BaseProps.ts#L26)

Object width

#### Inherited from

[`SerializedTextProps`](/api/interfaces/serializedtextprops/).[`width`](/api/interfaces/serializedtextprops/#width)
