---
editUrl: false
next: false
prev: false
title: "SerializedGroupProps"
---

Defined in: [src/shapes/Group.ts:60](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Group.ts#L60)

## Extends

- [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`GroupOwnProps`](/api/interfaces/groupownprops/)

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

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`angle`](/api/interfaces/serializedobjectprops/#angle)

***

### backgroundColor

> **backgroundColor**: `string`

Defined in: [src/shapes/Object/types/SerializedObjectProps.ts:24](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/SerializedObjectProps.ts#L24)

Background color of an object.
takes css colors https://www.w3.org/TR/css-color-3/

#### Inherited from

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`backgroundColor`](/api/interfaces/serializedobjectprops/#backgroundcolor)

***

### clipPath?

> `optional` **clipPath**: `Partial`\<[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/) & `ClipPathProps`\>

Defined in: [src/shapes/Object/types/SerializedObjectProps.ts:46](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/SerializedObjectProps.ts#L46)

a fabricObject that, without stroke define a clipping area with their shape. filled in black
the clipPath object gets used when the object has rendered, and the context is placed in the center
of the object cacheCanvas.
If you want 0,0 of a clipPath to align with an object center, use clipPath.originX/Y to 'center'

#### Inherited from

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`clipPath`](/api/interfaces/serializedobjectprops/#clippath)

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

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`fill`](/api/interfaces/serializedobjectprops/#fill)

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

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`fillRule`](/api/interfaces/serializedobjectprops/#fillrule)

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

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`flipX`](/api/interfaces/serializedobjectprops/#flipx)

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

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`flipY`](/api/interfaces/serializedobjectprops/#flipy)

***

### globalCompositeOperation

> **globalCompositeOperation**: `GlobalCompositeOperation`

Defined in: [src/shapes/Object/types/SerializedObjectProps.ts:17](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/SerializedObjectProps.ts#L17)

Composite rule used for canvas globalCompositeOperation

#### Inherited from

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`globalCompositeOperation`](/api/interfaces/serializedobjectprops/#globalcompositeoperation)

***

### height

> **height**: `number`

Defined in: [src/shapes/Object/types/BaseProps.ts:32](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/BaseProps.ts#L32)

Object height

#### Inherited from

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`height`](/api/interfaces/serializedobjectprops/#height)

***

### interactive

> **interactive**: `boolean`

Defined in: [src/shapes/Group.ts:57](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Group.ts#L57)

#### Inherited from

[`GroupOwnProps`](/api/interfaces/groupownprops/).[`interactive`](/api/interfaces/groupownprops/#interactive)

***

### layoutManager

> **layoutManager**: [`SerializedLayoutManager`](/api/type-aliases/serializedlayoutmanager/)

Defined in: [src/shapes/Group.ts:63](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Group.ts#L63)

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

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`left`](/api/interfaces/serializedobjectprops/#left)

***

### objects

> **objects**: [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/)[]

Defined in: [src/shapes/Group.ts:62](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Group.ts#L62)

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

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`opacity`](/api/interfaces/serializedobjectprops/#opacity)

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

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`originX`](/api/interfaces/serializedobjectprops/#originx)

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

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`originY`](/api/interfaces/serializedobjectprops/#originy)

***

### paintFirst

> **paintFirst**: `"fill"` \| `"stroke"`

Defined in: [src/shapes/Object/types/FillStrokeProps.ts:8](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/FillStrokeProps.ts#L8)

Determines if the fill or the stroke is drawn first (one of "fill" or "stroke")

#### Inherited from

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`paintFirst`](/api/interfaces/serializedobjectprops/#paintfirst)

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

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`scaleX`](/api/interfaces/serializedobjectprops/#scalex)

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

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`scaleY`](/api/interfaces/serializedobjectprops/#scaley)

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

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`shadow`](/api/interfaces/serializedobjectprops/#shadow)

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

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`skewX`](/api/interfaces/serializedobjectprops/#skewx)

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

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`skewY`](/api/interfaces/serializedobjectprops/#skewy)

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

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`stroke`](/api/interfaces/serializedobjectprops/#stroke)

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

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`strokeDashArray`](/api/interfaces/serializedobjectprops/#strokedasharray)

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

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`strokeDashOffset`](/api/interfaces/serializedobjectprops/#strokedashoffset)

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

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`strokeLineCap`](/api/interfaces/serializedobjectprops/#strokelinecap)

***

### strokeLineJoin

> **strokeLineJoin**: `CanvasLineJoin`

Defined in: [src/shapes/Object/types/FillStrokeProps.ts:67](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/FillStrokeProps.ts#L67)

Corner style of an object's stroke (one of "bevel", "round", "miter")

#### Inherited from

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`strokeLineJoin`](/api/interfaces/serializedobjectprops/#strokelinejoin)

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

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`strokeMiterLimit`](/api/interfaces/serializedobjectprops/#strokemiterlimit)

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

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`strokeUniform`](/api/interfaces/serializedobjectprops/#strokeuniform)

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

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`strokeWidth`](/api/interfaces/serializedobjectprops/#strokewidth)

***

### subTargetCheck

> **subTargetCheck**: `boolean`

Defined in: [src/shapes/Group.ts:56](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Group.ts#L56)

#### Inherited from

[`GroupOwnProps`](/api/interfaces/groupownprops/).[`subTargetCheck`](/api/interfaces/groupownprops/#subtargetcheck)

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

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`top`](/api/interfaces/serializedobjectprops/#top)

***

### visible

> **visible**: `boolean`

Defined in: [src/shapes/Object/types/SerializedObjectProps.ts:37](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/SerializedObjectProps.ts#L37)

When set to `false`, an object is not rendered on canvas

#### Inherited from

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`visible`](/api/interfaces/serializedobjectprops/#visible)

***

### width

> **width**: `number`

Defined in: [src/shapes/Object/types/BaseProps.ts:26](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/types/BaseProps.ts#L26)

Object width

#### Inherited from

[`SerializedObjectProps`](/api/interfaces/serializedobjectprops/).[`width`](/api/interfaces/serializedobjectprops/#width)
