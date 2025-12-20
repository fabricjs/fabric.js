---
editUrl: false
next: false
prev: false
title: "Textbox"
---

Defined in: [src/shapes/Textbox.ts:54](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Textbox.ts#L54)

Textbox class, based on IText, allows the user to resize the text rectangle
and wraps lines automatically. Textboxes have their Y scaling locked, the
user can only change width. Height is adjusted automatically based on the
wrapping of lines.

## Extends

- [`IText`](/api/classes/itext/)\<`Props`, `SProps`, `EventSpec`\>

## Type Parameters

### Props

`Props` *extends* [`TOptions`](/api/type-aliases/toptions/)\<[`TextboxProps`](/api/interfaces/textboxprops/)\> = `Partial`\<[`TextboxProps`](/api/interfaces/textboxprops/)\>

### SProps

`SProps` *extends* [`SerializedTextboxProps`](/api/interfaces/serializedtextboxprops/) = [`SerializedTextboxProps`](/api/interfaces/serializedtextboxprops/)

### EventSpec

`EventSpec` *extends* [`ITextEvents`](/api/type-aliases/itextevents/) = [`ITextEvents`](/api/type-aliases/itextevents/)

## Implements

- `UniqueTextboxProps`

## Constructors

### Constructor

> **new Textbox**\<`Props`, `SProps`, `EventSpec`\>(`text`, `options?`): `Textbox`\<`Props`, `SProps`, `EventSpec`\>

Defined in: [src/shapes/Textbox.ts:108](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Textbox.ts#L108)

Constructor

#### Parameters

##### text

`string`

Text string

##### options?

`Props`

Options object

#### Returns

`Textbox`\<`Props`, `SProps`, `EventSpec`\>

#### Overrides

[`IText`](/api/classes/itext/).[`constructor`](/api/classes/itext/#constructor)

## Properties

### \_\_corner?

> `optional` **\_\_corner**: `string`

Defined in: [src/shapes/Object/InteractiveObject.ts:105](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L105)

keeps the value of the last hovered corner during mouse move.
0 is no corner, or 'mt', 'ml', 'mtr' etc..
It should be private, but there is no harm in using it as
a read-only property.
this isn't cleaned automatically. Non selected objects may have wrong values

#### Inherited from

[`IText`](/api/classes/itext/).[`__corner`](/api/classes/itext/#__corner)

***

### \_\_lineHeights

> **\_\_lineHeights**: `number`[]

Defined in: [src/shapes/Text/Text.ts:417](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L417)

#### Inherited from

[`IText`](/api/classes/itext/).[`__lineHeights`](/api/classes/itext/#__lineheights)

***

### \_\_lineWidths

> **\_\_lineWidths**: `number`[]

Defined in: [src/shapes/Text/Text.ts:418](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L418)

#### Inherited from

[`IText`](/api/classes/itext/).[`__lineWidths`](/api/classes/itext/#__linewidths)

***

### \_controlsVisibility

> **\_controlsVisibility**: `Record`\<`string`, `boolean`\>

Defined in: [src/shapes/Object/InteractiveObject.ts:112](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L112)

a map of control visibility for this object.
this was left when controls were introduced to not break the api too much
this takes priority over the generic control visibility

#### Inherited from

[`IText`](/api/classes/itext/).[`_controlsVisibility`](/api/classes/itext/#_controlsvisibility)

***

### \_fontSizeMult

> **\_fontSizeMult**: `number`

Defined in: [src/shapes/Text/Text.ts:352](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L352)

Text Line proportion to font Size (in pixels)

#### Inherited from

[`IText`](/api/classes/itext/).[`_fontSizeMult`](/api/classes/itext/#_fontsizemult)

***

### \_scaling?

> `optional` **\_scaling**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:134](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L134)

A boolean used from the gesture module to keep tracking of a scaling
action when there is no scaling transform in place.
This is an edge case and is used twice in all codebase.
Probably added to keep track of some performance issues

#### TODO

use git blame to investigate why it was added
DON'T USE IT. WE WILL TRY TO REMOVE IT

#### Inherited from

[`IText`](/api/classes/itext/).[`_scaling`](/api/classes/itext/#_scaling)

***

### \_styleMap

> **\_styleMap**: `StyleMap`

Defined in: [src/shapes/Textbox.ts:86](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Textbox.ts#L86)

***

### \_text

> **\_text**: `string`[]

Defined in: [src/shapes/Text/Text.ts:415](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L415)

#### Inherited from

[`IText`](/api/classes/itext/).[`_text`](/api/classes/itext/#_text)

***

### \_textLines

> **\_textLines**: `string`[][]

Defined in: [src/shapes/Text/Text.ts:412](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L412)

same as textlines, but each line is an array of graphemes as split by splitByGrapheme

#### Inherited from

[`IText`](/api/classes/itext/).[`_textLines`](/api/classes/itext/#_textlines)

***

### \_unwrappedTextLines

> **\_unwrappedTextLines**: `string`[][]

Defined in: [src/shapes/Text/Text.ts:414](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L414)

#### Inherited from

[`IText`](/api/classes/itext/).[`_unwrappedTextLines`](/api/classes/itext/#_unwrappedtextlines)

***

### \_wordJoiners

> **\_wordJoiners**: `RegExp`

Defined in: [src/shapes/Textbox.ts:84](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Textbox.ts#L84)

#### Implementation of

`UniqueTextboxProps._wordJoiners`

***

### absolutePositioned

> **absolutePositioned**: `boolean`

Defined in: [src/shapes/Object/Object.ts:215](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L215)

Meaningful ONLY when the object is used as clipPath.
if true, the clipPath will have its top and left relative to canvas, and will
not be influenced by the object transform. This will make the clipPath relative
to the canvas, but clipping just a particular object.
WARNING this is beta, this feature may change or be renamed.
since 2.4.0

#### Default

```ts
false
```

#### Inherited from

[`IText`](/api/classes/itext/).[`absolutePositioned`](/api/classes/itext/#absolutepositioned)

***

### aCoords

> **aCoords**: [`TCornerPoint`](/api/type-aliases/tcornerpoint/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:63](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L63)

Describe object's corner position in scene coordinates.
The coordinates are derived from the following:
left, top, width, height, scaleX, scaleY, skewX, skewY, angle, strokeWidth.
The coordinates do not depend on viewport changes.
The coordinates get updated with [setCoords](/api/classes/textbox/#setcoords).
You can calculate them without updating with [()](/api/classes/textbox/#calcacoords)

#### Inherited from

[`IText`](/api/classes/itext/).[`aCoords`](/api/classes/itext/#acoords)

***

### angle

> **angle**: [`TDegree`](/api/type-aliases/tdegree/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:581](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L581)

Angle of rotation of an object (in degrees)

#### Default

```ts
0
```

#### Inherited from

[`IText`](/api/classes/itext/).[`angle`](/api/classes/itext/#angle)

***

### backgroundColor

> **backgroundColor**: `string`

Defined in: [src/shapes/Object/Object.ts:202](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L202)

Background color of an object.
takes css colors https://www.w3.org/TR/css-color-3/

#### Inherited from

[`IText`](/api/classes/itext/).[`backgroundColor`](/api/classes/itext/#backgroundcolor)

***

### borderColor

> **borderColor**: `string`

Defined in: [src/shapes/Object/InteractiveObject.ts:74](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L74)

Color of controlling borders of an object (when it's active)

#### Default

```ts
rgb(178,204,255)
```

#### Inherited from

[`IText`](/api/classes/itext/).[`borderColor`](/api/classes/itext/#bordercolor)

***

### borderDashArray

> **borderDashArray**: `null` \| `number`[]

Defined in: [src/shapes/Object/InteractiveObject.ts:75](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L75)

Array specifying dash pattern of an object's borders (hasBorder must be true)

#### Since

1.6.2

#### Inherited from

[`IText`](/api/classes/itext/).[`borderDashArray`](/api/classes/itext/#borderdasharray)

***

### borderOpacityWhenMoving

> **borderOpacityWhenMoving**: `number`

Defined in: [src/shapes/Object/InteractiveObject.ts:76](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L76)

Opacity of object's controlling borders when object is active and moving

#### Default

```ts
0.4
```

#### Inherited from

[`IText`](/api/classes/itext/).[`borderOpacityWhenMoving`](/api/classes/itext/#borderopacitywhenmoving)

***

### borderScaleFactor

> **borderScaleFactor**: `number`

Defined in: [src/shapes/Object/InteractiveObject.ts:77](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L77)

Scale factor for the border of the objects ( selection box and controls stroke ).
Bigger number will make a thicker border
border default value is 1, so this scale value is equal to a border and control strokeWidth.
If you need to divide border from control strokeWidth
you will need to write your own render function for controls

#### Default

```ts
1
```

#### Inherited from

[`IText`](/api/classes/itext/).[`borderScaleFactor`](/api/classes/itext/#borderscalefactor)

***

### caching

> **caching**: `boolean`

Defined in: [src/shapes/IText/IText.ts:204](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L204)

Indicates whether internal text char widths can be cached

#### Inherited from

[`IText`](/api/classes/itext/).[`caching`](/api/classes/itext/#caching)

***

### centeredRotation

> **centeredRotation**: `boolean`

Defined in: [src/shapes/Object/Object.ts:216](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L216)

When `true` the object will rotate on its center.
When `false` will rotate around the origin point defined by originX and originY.
The value of this property is IGNORED during a transform if the canvas has already
centeredRotation set to `true`
The object method `rotate` will always consider this property and never the canvas's one.

#### Since

1.3.4

#### Inherited from

[`IText`](/api/classes/itext/).[`centeredRotation`](/api/classes/itext/#centeredrotation)

***

### centeredScaling

> **centeredScaling**: `boolean`

Defined in: [src/shapes/Object/Object.ts:217](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L217)

When true, this object will use center point as the origin of transformation
when being scaled via the controls.

#### Since

1.3.4

#### Inherited from

[`IText`](/api/classes/itext/).[`centeredScaling`](/api/classes/itext/#centeredscaling)

***

### charSpacing

> **charSpacing**: `number`

Defined in: [src/shapes/Text/Text.ts:359](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L359)

additional space between characters
expressed in thousands of em unit

#### Inherited from

[`IText`](/api/classes/itext/).[`charSpacing`](/api/classes/itext/#charspacing)

***

### clipPath?

> `optional` **clipPath**: [`BaseFabricObject`](/api/classes/basefabricobject/)\<`Partial`\<`ObjectProps`\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

Defined in: [src/shapes/Object/Object.ts:213](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L213)

#### Inherited from

[`IText`](/api/classes/itext/).[`clipPath`](/api/classes/itext/#clippath)

***

### clipPathId?

> `optional` **clipPathId**: `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:15](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/FabricObjectSVGExportMixin.ts#L15)

When an object is being exported as SVG as a clippath, a reference inside the SVG is needed.
This reference is a UID in the fabric namespace and is temporary stored here.

#### Inherited from

[`IText`](/api/classes/itext/).[`clipPathId`](/api/classes/itext/#clippathid)

***

### compositionColor

> **compositionColor**: `string`

Defined in: [src/shapes/IText/IText.ts:198](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L198)

#### Inherited from

[`IText`](/api/classes/itext/).[`compositionColor`](/api/classes/itext/#compositioncolor)

***

### compositionEnd

> **compositionEnd**: `number`

Defined in: [src/shapes/IText/IText.ts:145](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L145)

#### Inherited from

[`IText`](/api/classes/itext/).[`compositionEnd`](/api/classes/itext/#compositionend)

***

### compositionStart

> **compositionStart**: `number`

Defined in: [src/shapes/IText/IText.ts:143](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L143)

#### Inherited from

[`IText`](/api/classes/itext/).[`compositionStart`](/api/classes/itext/#compositionstart)

***

### controls

> **controls**: `TControlSet`

Defined in: [src/shapes/Object/InteractiveObject.ts:118](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L118)

holds the controls for the object.
controls are added by default_controls.js

#### Inherited from

[`IText`](/api/classes/itext/).[`controls`](/api/classes/itext/#controls)

***

### cornerColor

> **cornerColor**: `string`

Defined in: [src/shapes/Object/InteractiveObject.ts:68](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L68)

Color of controlling corners of an object (when it's active)

#### Default

```ts
rgb(178,204,255)
```

#### Inherited from

[`IText`](/api/classes/itext/).[`cornerColor`](/api/classes/itext/#cornercolor)

***

### cornerDashArray

> **cornerDashArray**: `null` \| `number`[]

Defined in: [src/shapes/Object/InteractiveObject.ts:71](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L71)

Array specifying dash pattern of an object's control (hasBorder must be true)

#### Since

1.6.2

#### Default

```ts
null
```

#### Inherited from

[`IText`](/api/classes/itext/).[`cornerDashArray`](/api/classes/itext/#cornerdasharray)

***

### cornerSize

> **cornerSize**: `number`

Defined in: [src/shapes/Object/InteractiveObject.ts:65](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L65)

Size of object's controlling corners (in pixels)

#### Default

```ts
13
```

#### Inherited from

[`IText`](/api/classes/itext/).[`cornerSize`](/api/classes/itext/#cornersize)

***

### cornerStrokeColor

> **cornerStrokeColor**: `string`

Defined in: [src/shapes/Object/InteractiveObject.ts:69](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L69)

Color of controlling corners of an object (when it's active and transparentCorners false)

#### Since

1.6.2

#### Default

```ts
''
```

#### Inherited from

[`IText`](/api/classes/itext/).[`cornerStrokeColor`](/api/classes/itext/#cornerstrokecolor)

***

### ~~cornerStyle~~

> **cornerStyle**: `"circle"` \| `"rect"`

Defined in: [src/shapes/Object/InteractiveObject.ts:70](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L70)

Specify style of control, 'rect' or 'circle'
This is deprecated. In the future there will be a standard control render
And you can swap it with one of the alternative proposed with the control api

:::caution[Deprecated]
This API is no longer supported and may be removed in a future release.
:::

#### Since

1.6.2

#### Default

```ts
'rect'
```

#### Inherited from

[`IText`](/api/classes/itext/).[`cornerStyle`](/api/classes/itext/#cornerstyle)

***

### ctrlKeysMapDown

> **ctrlKeysMapDown**: `TKeyMapIText`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:42](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L42)

For functionalities on keyDown + ctrl || cmd

#### Inherited from

[`IText`](/api/classes/itext/).[`ctrlKeysMapDown`](/api/classes/itext/#ctrlkeysmapdown)

***

### ctrlKeysMapUp

> **ctrlKeysMapUp**: `TKeyMapIText`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:37](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L37)

For functionalities on keyUp + ctrl || cmd

#### Inherited from

[`IText`](/api/classes/itext/).[`ctrlKeysMapUp`](/api/classes/itext/#ctrlkeysmapup)

***

### cursorColor

> **cursorColor**: `string`

Defined in: [src/shapes/IText/IText.ts:184](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L184)

Color of text cursor color in editing mode.
if not set (default) will take color from the text.
if set to a color value that fabric can understand, it will
be used instead of the color of the text at the current position.

#### Inherited from

[`IText`](/api/classes/itext/).[`cursorColor`](/api/classes/itext/#cursorcolor)

***

### cursorDelay

> **cursorDelay**: `number`

Defined in: [src/shapes/IText/IText.ts:190](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L190)

Delay between cursor blink (in ms)

#### Inherited from

[`IText`](/api/classes/itext/).[`cursorDelay`](/api/classes/itext/#cursordelay)

***

### cursorDuration

> **cursorDuration**: `number`

Defined in: [src/shapes/IText/IText.ts:196](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L196)

Duration of cursor fade in (in ms)

#### Inherited from

[`IText`](/api/classes/itext/).[`cursorDuration`](/api/classes/itext/#cursorduration)

***

### cursorWidth

> **cursorWidth**: `number`

Defined in: [src/shapes/IText/IText.ts:175](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L175)

Width of cursor (in px)

#### Inherited from

[`IText`](/api/classes/itext/).[`cursorWidth`](/api/classes/itext/#cursorwidth)

***

### deltaY

> **deltaY**: `number`

Defined in: [src/shapes/Text/Text.ts:365](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L365)

Baseline shift, styles only, keep at 0 for the main text object

#### Inherited from

[`IText`](/api/classes/itext/).[`deltaY`](/api/classes/itext/#deltay)

***

### direction

> **direction**: `CanvasDirection`

Defined in: [src/shapes/Text/Text.ts:377](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L377)

WARNING: EXPERIMENTAL. NOT SUPPORTED YET
determine the direction of the text.
This has to be set manually together with textAlign and originX for proper
experience.
some interesting link for the future
https://www.w3.org/International/questions/qa-bidi-unicode-controls

#### Since

4.5.0

#### Inherited from

[`IText`](/api/classes/itext/).[`direction`](/api/classes/itext/#direction)

***

### dirty

> **dirty**: `boolean`

Defined in: [src/shapes/Object/Object.ts:242](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L242)

When set to `true`, object's cache will be rerendered next render call.
since 1.7.0

#### Default

```ts
true
```

#### Inherited from

[`IText`](/api/classes/itext/).[`dirty`](/api/classes/itext/#dirty)

***

### dynamicMinWidth

> **dynamicMinWidth**: `number`

Defined in: [src/shapes/Textbox.ts:74](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Textbox.ts#L74)

Minimum calculated width of a textbox, in pixels.
fixed to 2 so that an empty textbox cannot go to 0
and is still selectable without text.

#### Implementation of

`UniqueTextboxProps.dynamicMinWidth`

***

### editable

> **editable**: `boolean`

Defined in: [src/shapes/IText/IText.ts:163](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L163)

Indicates whether a text can be edited

#### Inherited from

[`IText`](/api/classes/itext/).[`editable`](/api/classes/itext/#editable)

***

### editingBorderColor

> **editingBorderColor**: `string`

Defined in: [src/shapes/IText/IText.ts:169](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L169)

Border color of text object while it's in editing mode

#### Inherited from

[`IText`](/api/classes/itext/).[`editingBorderColor`](/api/classes/itext/#editingbordercolor)

***

### evented

> **evented**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:82](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L82)

When set to `false`, an object can not be a target of events. All events propagate through it. Introduced in v1.3.4

#### Inherited from

[`IText`](/api/classes/itext/).[`evented`](/api/classes/itext/#evented)

***

### excludeFromExport

> **excludeFromExport**: `boolean`

Defined in: [src/shapes/Object/Object.ts:209](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L209)

When `true`, object is not exported in OBJECT/JSON

#### Since

1.6.3

#### Inherited from

[`IText`](/api/classes/itext/).[`excludeFromExport`](/api/classes/itext/#excludefromexport)

***

### fill

> **fill**: `null` \| `string` \| [`TFiller`](/api/type-aliases/tfiller/)

Defined in: [src/shapes/Object/Object.ts:192](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L192)

#### Inherited from

[`IText`](/api/classes/itext/).[`fill`](/api/classes/itext/#fill)

***

### fillRule

> **fillRule**: `CanvasFillRule`

Defined in: [src/shapes/Object/Object.ts:193](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L193)

Fill rule used to fill an object
accepted values are nonzero, evenodd
<b>Backwards incompatibility note:</b> This property was used for setting globalCompositeOperation until v1.4.12 (use `globalCompositeOperation` instead)

#### Default

```ts
nonzero
```

#### Inherited from

[`IText`](/api/classes/itext/).[`fillRule`](/api/classes/itext/#fillrule)

***

### flipX

> **flipX**: `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:567](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L567)

When true, an object is rendered as flipped horizontally

#### Default

```ts
false
```

#### Inherited from

[`IText`](/api/classes/itext/).[`flipX`](/api/classes/itext/#flipx)

***

### flipY

> **flipY**: `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:568](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L568)

When true, an object is rendered as flipped vertically

#### Default

```ts
false
```

#### Inherited from

[`IText`](/api/classes/itext/).[`flipY`](/api/classes/itext/#flipy)

***

### fontFamily

> **fontFamily**: `string`

Defined in: [src/shapes/Text/Text.ts:200](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L200)

Font family

#### Inherited from

[`IText`](/api/classes/itext/).[`fontFamily`](/api/classes/itext/#fontfamily)

***

### fontSize

> **fontSize**: `number`

Defined in: [src/shapes/Text/Text.ts:188](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L188)

Font size (in pixels)

#### Inherited from

[`IText`](/api/classes/itext/).[`fontSize`](/api/classes/itext/#fontsize)

***

### fontStyle

> **fontStyle**: `FontStyle`

Defined in: [src/shapes/Text/Text.ts:231](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L231)

Font style . Possible values: "", "normal", "italic" or "oblique".

#### Inherited from

[`IText`](/api/classes/itext/).[`fontStyle`](/api/classes/itext/#fontstyle)

***

### fontWeight

> **fontWeight**: `string` \| `number`

Defined in: [src/shapes/Text/Text.ts:194](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L194)

Font weight (e.g. bold, normal, 400, 600, 800)

#### Inherited from

[`IText`](/api/classes/itext/).[`fontWeight`](/api/classes/itext/#fontweight)

***

### globalCompositeOperation

> **globalCompositeOperation**: `GlobalCompositeOperation`

Defined in: [src/shapes/Object/Object.ts:201](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L201)

Composite rule used for canvas globalCompositeOperation

#### Inherited from

[`IText`](/api/classes/itext/).[`globalCompositeOperation`](/api/classes/itext/#globalcompositeoperation)

***

### hasBorders

> **hasBorders**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:78](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L78)

When set to `false`, object's controlling borders are not rendered

#### Inherited from

[`IText`](/api/classes/itext/).[`hasBorders`](/api/classes/itext/#hasborders)

***

### hasControls

> **hasControls**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:72](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L72)

When set to `false`, object's controls are not displayed and can not be used to manipulate object

#### Default

```ts
true
```

#### Inherited from

[`IText`](/api/classes/itext/).[`hasControls`](/api/classes/itext/#hascontrols)

***

### height

> **height**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:566](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L566)

Object height

#### Inherited from

[`IText`](/api/classes/itext/).[`height`](/api/classes/itext/#height)

***

### hiddenTextarea

> **hiddenTextarea**: `null` \| `HTMLTextAreaElement`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:44](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L44)

#### Inherited from

[`IText`](/api/classes/itext/).[`hiddenTextarea`](/api/classes/itext/#hiddentextarea)

***

### hiddenTextareaContainer?

> `optional` **hiddenTextareaContainer**: `null` \| `HTMLElement`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:53](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L53)

DOM container to append the hiddenTextarea.
An alternative to attaching to the document.body.
Useful to reduce laggish redraw of the full document.body tree and
also with modals event capturing that won't let the textarea take focus.

#### Inherited from

[`IText`](/api/classes/itext/).[`hiddenTextareaContainer`](/api/classes/itext/#hiddentextareacontainer)

***

### hoverCursor

> **hoverCursor**: `null` \| `string`

Defined in: [src/shapes/Object/InteractiveObject.ts:86](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L86)

Default cursor value used when hovering over this object on canvas

#### Default

```ts
null
```

#### Inherited from

[`IText`](/api/classes/itext/).[`hoverCursor`](/api/classes/itext/#hovercursor)

***

### includeDefaultValues

> **includeDefaultValues**: `boolean`

Defined in: [src/shapes/Object/Object.ts:208](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L208)

When `false`, default object's values are not included in its serialization

#### Inherited from

[`IText`](/api/classes/itext/).[`includeDefaultValues`](/api/classes/itext/#includedefaultvalues)

***

### initialized?

> `optional` **initialized**: `true`

Defined in: [src/shapes/Text/Text.ts:419](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L419)

#### Inherited from

[`IText`](/api/classes/itext/).[`initialized`](/api/classes/itext/#initialized)

***

### inverted

> **inverted**: `boolean`

Defined in: [src/shapes/Object/Object.ts:214](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L214)

Meaningful ONLY when the object is used as clipPath.
if true, the clipPath will make the object clip to the outside of the clipPath
since 2.4.0

#### Default

```ts
false
```

#### Inherited from

[`IText`](/api/classes/itext/).[`inverted`](/api/classes/itext/#inverted)

***

### isEditing

> **isEditing**: `boolean`

Defined in: [src/shapes/IText/IText.ts:157](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L157)

Indicates whether text is in editing mode

#### Inherited from

[`IText`](/api/classes/itext/).[`isEditing`](/api/classes/itext/#isediting)

***

### isMoving?

> `optional` **isMoving**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:124](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L124)

internal boolean to signal the code that the object is
part of the move action.

#### Inherited from

[`IText`](/api/classes/itext/).[`isMoving`](/api/classes/itext/#ismoving)

***

### isWrapping

> **isWrapping**: `boolean`

Defined in: [src/shapes/Textbox.ts:88](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Textbox.ts#L88)

***

### keysMap

> **keysMap**: `TKeyMapIText`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:30](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L30)

For functionalities on keyDown
Map a special key to a function of the instance/prototype
If you need different behavior for ESC or TAB or arrows, you have to change
this map setting the name of a function that you build on the IText or
your prototype.
the map change will affect all Instances unless you need for only some text Instances
in that case you have to clone this object and assign your Instance.
this.keysMap = Object.assign({}, this.keysMap);
The function must be in IText.prototype.myFunction And will receive event as args[0]

#### Inherited from

[`IText`](/api/classes/itext/).[`keysMap`](/api/classes/itext/#keysmap)

***

### keysMapRtl

> **keysMapRtl**: `TKeyMapIText`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:32](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L32)

#### Inherited from

[`IText`](/api/classes/itext/).[`keysMapRtl`](/api/classes/itext/#keysmaprtl)

***

### left

> **left**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:564](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L564)

Left position of an object.
Note that by default it's relative to object left.
You can change this by setting originX

#### Default

```ts
0
```

#### Inherited from

[`IText`](/api/classes/itext/).[`left`](/api/classes/itext/#left)

***

### lineHeight

> **lineHeight**: `number`

Defined in: [src/shapes/Text/Text.ts:237](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L237)

Line height

#### Inherited from

[`IText`](/api/classes/itext/).[`lineHeight`](/api/classes/itext/#lineheight)

***

### linethrough

> **linethrough**: `boolean`

Defined in: [src/shapes/Text/Text.ts:218](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L218)

Text decoration linethrough.

#### Inherited from

[`IText`](/api/classes/itext/).[`linethrough`](/api/classes/itext/#linethrough)

***

### lockMovementX

> **lockMovementX**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:56](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L56)

When `true`, object horizontal movement is locked

#### Inherited from

[`IText`](/api/classes/itext/).[`lockMovementX`](/api/classes/itext/#lockmovementx)

***

### lockMovementY

> **lockMovementY**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:57](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L57)

When `true`, object vertical movement is locked

#### Inherited from

[`IText`](/api/classes/itext/).[`lockMovementY`](/api/classes/itext/#lockmovementy)

***

### lockRotation

> **lockRotation**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:58](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L58)

When `true`, object rotation is locked

#### Inherited from

[`IText`](/api/classes/itext/).[`lockRotation`](/api/classes/itext/#lockrotation)

***

### lockScalingFlip

> **lockScalingFlip**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:63](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L63)

When `true`, object cannot be flipped by scaling into negative values

#### Inherited from

[`IText`](/api/classes/itext/).[`lockScalingFlip`](/api/classes/itext/#lockscalingflip)

***

### lockScalingX

> **lockScalingX**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:59](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L59)

When `true`, object horizontal scaling is locked

#### Inherited from

[`IText`](/api/classes/itext/).[`lockScalingX`](/api/classes/itext/#lockscalingx)

***

### lockScalingY

> **lockScalingY**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:60](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L60)

When `true`, object vertical scaling is locked

#### Inherited from

[`IText`](/api/classes/itext/).[`lockScalingY`](/api/classes/itext/#lockscalingy)

***

### lockSkewingX

> **lockSkewingX**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:61](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L61)

When `true`, object horizontal skewing is locked

#### Inherited from

[`IText`](/api/classes/itext/).[`lockSkewingX`](/api/classes/itext/#lockskewingx)

***

### lockSkewingY

> **lockSkewingY**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:62](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L62)

When `true`, object vertical skewing is locked

#### Inherited from

[`IText`](/api/classes/itext/).[`lockSkewingY`](/api/classes/itext/#lockskewingy)

***

### matrixCache?

> `optional` **matrixCache**: `TMatrixCache`

Defined in: [src/shapes/Object/ObjectGeometry.ts:73](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L73)

storage cache for object full transform matrix

#### Inherited from

[`IText`](/api/classes/itext/).[`matrixCache`](/api/classes/itext/#matrixcache)

***

### MIN\_TEXT\_WIDTH

> **MIN\_TEXT\_WIDTH**: `number`

Defined in: [src/shapes/Text/Text.ts:399](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L399)

contains the min text width to avoid getting 0

#### Inherited from

[`IText`](/api/classes/itext/).[`MIN_TEXT_WIDTH`](/api/classes/itext/#min_text_width)

***

### minScaleLimit

> **minScaleLimit**: `number`

Defined in: [src/shapes/Object/Object.ts:187](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L187)

Minimum allowed scale value of an object

#### Default

```ts
0
```

#### Inherited from

[`IText`](/api/classes/itext/).[`minScaleLimit`](/api/classes/itext/#minscalelimit)

***

### minWidth

> **minWidth**: `number`

Defined in: [src/shapes/Textbox.ts:66](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Textbox.ts#L66)

Minimum width of textbox, in pixels.

#### Implementation of

`UniqueTextboxProps.minWidth`

***

### moveCursor

> **moveCursor**: `null` \| `string`

Defined in: [src/shapes/Object/InteractiveObject.ts:87](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L87)

Default cursor value used when moving this object on canvas

#### Default

```ts
null
```

#### Inherited from

[`IText`](/api/classes/itext/).[`moveCursor`](/api/classes/itext/#movecursor)

***

### noScaleCache

> **noScaleCache**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:51](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L51)

When `true`, cache does not get updated during scaling. The picture will get blocky if scaled
too much and will be redrawn with correct details at the end of scaling.
this setting is performance and application dependant.
default to true
since 1.7.0

#### Default

```ts
true
```

#### Inherited from

[`IText`](/api/classes/itext/).[`noScaleCache`](/api/classes/itext/#noscalecache)

***

### objectCaching

> **objectCaching**: `boolean`

Defined in: [src/shapes/Object/Object.ts:211](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L211)

When `true`, object is cached on an additional canvas.
When `false`, object is not cached unless necessary ( clipPath )
default to true

#### Since

1.7.0

#### Default

```ts
true
```

#### Inherited from

[`IText`](/api/classes/itext/).[`objectCaching`](/api/classes/itext/#objectcaching)

***

### oCoords

> **oCoords**: `Record`\<`string`, `TOCoord`\>

Defined in: [src/shapes/Object/InteractiveObject.ts:95](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L95)

The object's controls' position in viewport coordinates
Calculated by [Control#positionHandler](/api/classes/control/#positionhandler) and [Control#calcCornerCoords](/api/classes/control/#calccornercoords), depending on [padding](/api/classes/fabricobject/#padding).
`corner/touchCorner` describe the 4 points forming the interactive area of the corner.
Used to draw and locate controls.

#### Inherited from

[`IText`](/api/classes/itext/).[`oCoords`](/api/classes/itext/#ocoords)

***

### opacity

> **opacity**: `number`

Defined in: [src/shapes/Object/Object.ts:189](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L189)

Opacity of an object

#### Default

```ts
1
```

#### Inherited from

[`IText`](/api/classes/itext/).[`opacity`](/api/classes/itext/#opacity)

***

### ~~originX~~

> **originX**: [`TOriginX`](/api/type-aliases/toriginx/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:576](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L576)

:::caution[Deprecated]
please use 'center' as value in new projects
:::

#### Inherited from

[`IText`](/api/classes/itext/).[`originX`](/api/classes/itext/#originx)

***

### ~~originY~~

> **originY**: [`TOriginY`](/api/type-aliases/toriginy/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:580](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L580)

:::caution[Deprecated]
please use 'center' as value in new projects
:::

#### Inherited from

[`IText`](/api/classes/itext/).[`originY`](/api/classes/itext/#originy)

***

### overline

> **overline**: `boolean`

Defined in: [src/shapes/Text/Text.ts:212](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L212)

Text decoration overline.

#### Inherited from

[`IText`](/api/classes/itext/).[`overline`](/api/classes/itext/#overline)

***

### ownMatrixCache?

> `optional` **ownMatrixCache**: `TMatrixCache`

Defined in: [src/shapes/Object/ObjectGeometry.ts:68](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L68)

storage cache for object transform matrix

#### Inherited from

[`IText`](/api/classes/itext/).[`ownMatrixCache`](/api/classes/itext/#ownmatrixcache)

***

### padding

> **padding**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:53](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L53)

Padding between object and its controlling borders (in pixels)

#### Default

```ts
0
```

#### Inherited from

[`IText`](/api/classes/itext/).[`padding`](/api/classes/itext/#padding)

***

### paintFirst

> **paintFirst**: `"fill"` \| `"stroke"`

Defined in: [src/shapes/Object/Object.ts:191](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L191)

Determines if the fill or the stroke is drawn first (one of "fill" or "stroke")

#### Inherited from

[`IText`](/api/classes/itext/).[`paintFirst`](/api/classes/itext/#paintfirst)

***

### parent?

> `optional` **parent**: [`Group`](/api/classes/group/)

Defined in: [src/shapes/Object/Object.ts:1600](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L1600)

A reference to the parent of the object
Used to keep the original parent ref when the object has been added to an ActiveSelection, hence loosing the `group` ref

#### Inherited from

[`IText`](/api/classes/itext/).[`parent`](/api/classes/itext/#parent)

***

### path?

> `optional` **path**: [`Path`](/api/classes/path/)\<`Partial`\<[`PathProps`](/api/interfaces/pathprops/)\>, [`SerializedPathProps`](/api/interfaces/serializedpathprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

Defined in: [src/shapes/Text/Text.ts:300](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L300)

Path that the text should follow.
since 4.6.0 the path will be drawn automatically.
if you want to make the path visible, give it a stroke and strokeWidth or fill value
if you want it to be hidden, assign visible = false to the path.
This feature is in BETA, and SVG import/export is not yet supported.

#### Example

```ts
const textPath = new Text('Text on a path', {
    top: 150,
    left: 150,
    textAlign: 'center',
    charSpacing: -50,
    path: new Path('M 0 0 C 50 -100 150 -100 200 0', {
        strokeWidth: 1,
        visible: false
    }),
    pathSide: 'left',
    pathStartOffset: 0
});
```

#### Inherited from

[`IText`](/api/classes/itext/).[`path`](/api/classes/itext/#path)

***

### pathAlign

> **pathAlign**: [`TPathAlign`](/api/type-aliases/tpathalign/)

Defined in: [src/shapes/Text/Text.ts:336](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L336)

How text is aligned to the path. This property determines
the perpendicular position of each character relative to the path.
(one of "baseline", "center", "ascender", "descender")
This feature is in BETA, and its behavior may change

#### Inherited from

[`IText`](/api/classes/itext/).[`pathAlign`](/api/classes/itext/#pathalign)

***

### pathSide

> **pathSide**: [`TPathSide`](/api/type-aliases/tpathside/)

Defined in: [src/shapes/Text/Text.ts:327](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L327)

Which side of the path the text should be drawn on.
Only used when text has a path

#### Inherited from

[`IText`](/api/classes/itext/).[`pathSide`](/api/classes/itext/#pathside)

***

### pathStartOffset

> **pathStartOffset**: `number`

Defined in: [src/shapes/Text/Text.ts:320](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L320)

Offset amount for text path starting position
Only used when text has a path

#### Inherited from

[`IText`](/api/classes/itext/).[`pathStartOffset`](/api/classes/itext/#pathstartoffset)

***

### perPixelTargetFind

> **perPixelTargetFind**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:83](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L83)

When set to `true`, objects are "found" on canvas on per-pixel basis rather than according to bounding box

#### Inherited from

[`IText`](/api/classes/itext/).[`perPixelTargetFind`](/api/classes/itext/#perpixeltargetfind)

***

### scaleX

> **scaleX**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:569](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L569)

Object scale factor (horizontal)

#### Default

```ts
1
```

#### Inherited from

[`IText`](/api/classes/itext/).[`scaleX`](/api/classes/itext/#scalex)

***

### scaleY

> **scaleY**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:570](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L570)

Object scale factor (vertical)

#### Default

```ts
1
```

#### Inherited from

[`IText`](/api/classes/itext/).[`scaleY`](/api/classes/itext/#scaley)

***

### selectable

> **selectable**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:81](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L81)

When set to `false`, an object can not be selected for modification (using either point-click-based or group-based selection).
But events still fire on it.

#### Inherited from

[`IText`](/api/classes/itext/).[`selectable`](/api/classes/itext/#selectable)

***

### ~~selectionBackgroundColor~~

> **selectionBackgroundColor**: `string`

Defined in: [src/shapes/Object/InteractiveObject.ts:79](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L79)

Selection Background color of an object. colored layer behind the object when it is active.
does not mix good with globalCompositeOperation methods.

:::caution[Deprecated]
This API is no longer supported and may be removed in a future release.
:::

#### Inherited from

[`IText`](/api/classes/itext/).[`selectionBackgroundColor`](/api/classes/itext/#selectionbackgroundcolor)

***

### selectionColor

> **selectionColor**: `string`

Defined in: [src/shapes/IText/IText.ts:151](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L151)

Color of text selection

#### Inherited from

[`IText`](/api/classes/itext/).[`selectionColor`](/api/classes/itext/#selectioncolor)

***

### selectionEnd

> **selectionEnd**: `number`

Defined in: [src/shapes/IText/IText.ts:141](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L141)

Index where text selection ends

#### Inherited from

[`IText`](/api/classes/itext/).[`selectionEnd`](/api/classes/itext/#selectionend)

***

### selectionStart

> **selectionStart**: `number`

Defined in: [src/shapes/IText/IText.ts:135](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L135)

Index where text selection starts (or where cursor is when there is no selection)

#### Inherited from

[`IText`](/api/classes/itext/).[`selectionStart`](/api/classes/itext/#selectionstart)

***

### shadow

> **shadow**: `null` \| [`Shadow`](/api/classes/shadow/)

Defined in: [src/shapes/Object/Object.ts:204](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L204)

#### Inherited from

[`IText`](/api/classes/itext/).[`shadow`](/api/classes/itext/#shadow)

***

### skewX

> **skewX**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:571](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L571)

Angle of skew on x axes of an object (in degrees)

#### Default

```ts
0
```

#### Inherited from

[`IText`](/api/classes/itext/).[`skewX`](/api/classes/itext/#skewx)

***

### skewY

> **skewY**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:572](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L572)

Angle of skew on y axes of an object (in degrees)

#### Default

```ts
0
```

#### Inherited from

[`IText`](/api/classes/itext/).[`skewY`](/api/classes/itext/#skewy)

***

### snapAngle?

> `optional` **snapAngle**: [`TDegree`](/api/type-aliases/tdegree/)

Defined in: [src/shapes/Object/InteractiveObject.ts:53](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L53)

The angle that an object will lock to while rotating.

#### Inherited from

[`IText`](/api/classes/itext/).[`snapAngle`](/api/classes/itext/#snapangle)

***

### snapThreshold?

> `optional` **snapThreshold**: [`TDegree`](/api/type-aliases/tdegree/)

Defined in: [src/shapes/Object/InteractiveObject.ts:54](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L54)

The angle difference from the current snapped angle in which snapping should occur.
When undefined, the snapThreshold will default to the snapAngle.

#### Inherited from

[`IText`](/api/classes/itext/).[`snapThreshold`](/api/classes/itext/#snapthreshold)

***

### splitByGrapheme

> **splitByGrapheme**: `boolean`

Defined in: [src/shapes/Textbox.ts:82](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Textbox.ts#L82)

Use this boolean property in order to split strings that have no white space concept.
this is a cheap way to help with chinese/japanese

#### Since

2.6.0

#### Implementation of

`UniqueTextboxProps.splitByGrapheme`

***

### stroke

> **stroke**: `null` \| `string` \| [`TFiller`](/api/type-aliases/tfiller/)

Defined in: [src/shapes/Object/Object.ts:194](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L194)

#### Inherited from

[`IText`](/api/classes/itext/).[`stroke`](/api/classes/itext/#stroke)

***

### strokeDashArray

> **strokeDashArray**: `null` \| `number`[]

Defined in: [src/shapes/Object/Object.ts:195](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L195)

Array specifying dash pattern of an object's stroke (stroke must be defined)

#### Default

```ts
null;
```

#### Inherited from

[`IText`](/api/classes/itext/).[`strokeDashArray`](/api/classes/itext/#strokedasharray)

***

### strokeDashOffset

> **strokeDashOffset**: `number`

Defined in: [src/shapes/Object/Object.ts:196](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L196)

Line offset of an object's stroke

#### Default

```ts
0
```

#### Inherited from

[`IText`](/api/classes/itext/).[`strokeDashOffset`](/api/classes/itext/#strokedashoffset)

***

### strokeLineCap

> **strokeLineCap**: `CanvasLineCap`

Defined in: [src/shapes/Object/Object.ts:197](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L197)

Line endings style of an object's stroke (one of "butt", "round", "square")

#### Default

```ts
butt
```

#### Inherited from

[`IText`](/api/classes/itext/).[`strokeLineCap`](/api/classes/itext/#strokelinecap)

***

### strokeLineJoin

> **strokeLineJoin**: `CanvasLineJoin`

Defined in: [src/shapes/Object/Object.ts:198](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L198)

Corner style of an object's stroke (one of "bevel", "round", "miter")

#### Inherited from

[`IText`](/api/classes/itext/).[`strokeLineJoin`](/api/classes/itext/#strokelinejoin)

***

### strokeMiterLimit

> **strokeMiterLimit**: `number`

Defined in: [src/shapes/Object/Object.ts:199](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L199)

Maximum miter length (used for strokeLineJoin = "miter") of an object's stroke

#### Default

```ts
4
```

#### Inherited from

[`IText`](/api/classes/itext/).[`strokeMiterLimit`](/api/classes/itext/#strokemiterlimit)

***

### strokeUniform

> **strokeUniform**: `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:583](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L583)

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

[`IText`](/api/classes/itext/).[`strokeUniform`](/api/classes/itext/#strokeuniform)

***

### strokeWidth

> **strokeWidth**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:582](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L582)

Width of a stroke used to render this object

#### Default

```ts
1
```

#### Inherited from

[`IText`](/api/classes/itext/).[`strokeWidth`](/api/classes/itext/#strokewidth)

***

### styles

> **styles**: [`TextStyle`](/api/type-aliases/textstyle/)

Defined in: [src/shapes/Text/Text.ts:277](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L277)

#### Inherited from

[`IText`](/api/classes/itext/).[`styles`](/api/classes/itext/#styles)

***

### subscript

> **subscript**: `object`

Defined in: [src/shapes/Text/Text.ts:258](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L258)

Subscript schema object (minimum overlap)

#### baseline

> **baseline**: `number`

baseline-shift factor (downwards)

##### Default

```ts
0.11
```

#### size

> **size**: `number`

fontSize factor

##### Default

```ts
0.6
```

#### Inherited from

[`IText`](/api/classes/itext/).[`subscript`](/api/classes/itext/#subscript)

***

### superscript

> **superscript**: `object`

Defined in: [src/shapes/Text/Text.ts:242](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L242)

Superscript schema object (minimum overlap)

#### baseline

> **baseline**: `number`

baseline-shift factor (upwards)

##### Default

```ts
-0.35
```

#### size

> **size**: `number`

fontSize factor

##### Default

```ts
0.6
```

#### Inherited from

[`IText`](/api/classes/itext/).[`superscript`](/api/classes/itext/#superscript)

***

### text

> **text**: `string`

Defined in: [src/shapes/Text/Text.ts:182](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L182)

#### Inherited from

[`IText`](/api/classes/itext/).[`text`](/api/classes/itext/#text)

***

### textAlign

> **textAlign**: `TextAlign`

Defined in: [src/shapes/Text/Text.ts:225](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L225)

Text alignment. Possible values: "left", "center", "right", "justify",
"justify-left", "justify-center" or "justify-right".

#### Inherited from

[`IText`](/api/classes/itext/).[`textAlign`](/api/classes/itext/#textalign)

***

### textBackgroundColor

> **textBackgroundColor**: `string`

Defined in: [src/shapes/Text/Text.ts:275](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L275)

Background color of text lines

#### Inherited from

[`IText`](/api/classes/itext/).[`textBackgroundColor`](/api/classes/itext/#textbackgroundcolor)

***

### textDecorationThickness

> **textDecorationThickness**: `number`

Defined in: [src/shapes/Text/Text.ts:314](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L314)

The text decoration tickness for underline, overline and strikethrough
The tickness is expressed in thousandths of fontSize ( em ).
The original value was 1/15 that translates to 66.6667 thousandths.
The choice of unit of measure is to align with charSpacing.
You can slim the tickness without issues, while large underline or overline may end up
outside the bounding box of the text. In order to fix that a bigger refactor of the code
is needed and is out of scope for now. If you need such large overline on the first line
of text or large underline on the last line of text, consider disabling caching as a
workaround

#### Default

```ts
66.667
```

#### Inherited from

[`IText`](/api/classes/itext/).[`textDecorationThickness`](/api/classes/itext/#textdecorationthickness)

***

### textLines

> **textLines**: `string`[]

Defined in: [src/shapes/Text/Text.ts:406](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L406)

contains the the text of the object, divided in lines as they are displayed
on screen. Wrapping will divide the text independently of line breaks

#### Inherited from

[`IText`](/api/classes/itext/).[`textLines`](/api/classes/itext/#textlines)

***

### top

> **top**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:563](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L563)

Top position of an object.
Note that by default it's relative to object top.
You can change this by setting originY

#### Default

```ts
0
```

#### Inherited from

[`IText`](/api/classes/itext/).[`top`](/api/classes/itext/#top)

***

### touchCornerSize

> **touchCornerSize**: `number`

Defined in: [src/shapes/Object/InteractiveObject.ts:66](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L66)

Size of object's controlling corners when touch interaction is detected

#### Default

```ts
24
```

#### Inherited from

[`IText`](/api/classes/itext/).[`touchCornerSize`](/api/classes/itext/#touchcornersize)

***

### transparentCorners

> **transparentCorners**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:67](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L67)

When true, object's controlling corners are rendered as transparent inside (i.e. stroke instead of fill)

#### Default

```ts
true
```

#### Inherited from

[`IText`](/api/classes/itext/).[`transparentCorners`](/api/classes/itext/#transparentcorners)

***

### underline

> **underline**: `boolean`

Defined in: [src/shapes/Text/Text.ts:206](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L206)

Text decoration underline.

#### Inherited from

[`IText`](/api/classes/itext/).[`underline`](/api/classes/itext/#underline)

***

### visible

> **visible**: `boolean`

Defined in: [src/shapes/Object/Object.ts:206](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L206)

When set to `false`, an object is not rendered on canvas

#### Inherited from

[`IText`](/api/classes/itext/).[`visible`](/api/classes/itext/#visible)

***

### width

> **width**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:565](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L565)

Object width

#### Inherited from

[`IText`](/api/classes/itext/).[`width`](/api/classes/itext/#width)

***

### \_styleProperties

> `static` **\_styleProperties**: readonly `StylePropertiesType`[] = `styleProperties`

Defined in: [src/shapes/Text/StyledText.ts:30](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/StyledText.ts#L30)

#### Inherited from

[`IText`](/api/classes/itext/).[`_styleProperties`](/api/classes/itext/#_styleproperties)

***

### ATTRIBUTE\_NAMES

> `static` **ATTRIBUTE\_NAMES**: `string`[]

Defined in: [src/shapes/Text/Text.ts:1841](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L1841)

List of attribute names to account for when parsing SVG element (used by [FabricText.fromElement](/api/classes/fabrictext/#fromelement))
@see: http://www.w3.org/TR/SVG/text.html#TextElement

#### Inherited from

[`IText`](/api/classes/itext/).[`ATTRIBUTE_NAMES`](/api/classes/itext/#attribute_names)

***

### cacheProperties

> `static` **cacheProperties**: `string`[]

Defined in: [src/shapes/Text/Text.ts:421](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L421)

List of properties to consider when checking if cache needs refresh
Those properties are checked by
calls to Object.set(key, value). If the key is in this list, the object is marked as dirty
and refreshed at the next render

#### Inherited from

[`IText`](/api/classes/itext/).[`cacheProperties`](/api/classes/itext/#cacheproperties)

***

### colorProperties

> `static` **colorProperties**: `string`[]

Defined in: [src/shapes/Object/Object.ts:1507](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L1507)

List of properties to consider for animating colors.

#### Inherited from

[`IText`](/api/classes/itext/).[`colorProperties`](/api/classes/itext/#colorproperties)

***

### customProperties

> `static` **customProperties**: `string`[] = `[]`

Defined in: [src/shapes/Object/Object.ts:1748](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L1748)

Define a list of custom properties that will be serialized when
instance.toObject() gets called

#### Inherited from

[`IText`](/api/classes/itext/).[`customProperties`](/api/classes/itext/#customproperties)

***

### genericFonts

> `static` **genericFonts**: `string`[]

Defined in: [src/shapes/Text/Text.ts:1819](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L1819)

List of generic font families

#### See

https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#generic-name

#### Inherited from

[`IText`](/api/classes/itext/).[`genericFonts`](/api/classes/itext/#genericfonts)

***

### ownDefaults

> `static` **ownDefaults**: `Partial`\<[`TClassProperties`](/api/type-aliases/tclassproperties/)\<`Textbox`\<`Partial`\<[`TextboxProps`](/api/interfaces/textboxprops/)\>, [`SerializedTextboxProps`](/api/interfaces/serializedtextboxprops/), [`ITextEvents`](/api/type-aliases/itextevents/)\>\>\> = `textboxDefaultValues`

Defined in: [src/shapes/Textbox.ts:94](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Textbox.ts#L94)

#### Overrides

[`IText`](/api/classes/itext/).[`ownDefaults`](/api/classes/itext/#owndefaults)

***

### stateProperties

> `static` **stateProperties**: `string`[]

Defined in: [src/shapes/Object/Object.ts:225](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L225)

This list of properties is used to check if the state of an object is changed.
This state change now is only used for children of groups to understand if a group
needs its cache regenerated during a .set call

#### Inherited from

[`IText`](/api/classes/itext/).[`stateProperties`](/api/classes/itext/#stateproperties)

***

### type

> `static` **type**: `string` = `'Textbox'`

Defined in: [src/shapes/Textbox.ts:90](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Textbox.ts#L90)

#### Overrides

[`IText`](/api/classes/itext/).[`type`](/api/classes/itext/#type)

## Accessors

### type

#### Get Signature

> **get** **type**(): `string`

Defined in: [src/shapes/IText/IText.ts:214](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L214)

Legacy identifier of the class. Prefer using utils like isType or instanceOf
Will be removed in fabric 7 or 8.
The setter exists to avoid type errors in old code and possibly current deserialization code.
DO NOT build new code around this type value

##### TODO

add sustainable warning message

:::caution[Deprecated]
This API is no longer supported and may be removed in a future release.
:::

##### Returns

`string`

#### Inherited from

[`IText`](/api/classes/itext/).[`type`](/api/classes/itext/#type-1)

## Methods

### \_drawClipPath()

> **\_drawClipPath**(`ctx`, `clipPath`, `context`): `void`

Defined in: [src/shapes/Object/Object.ts:871](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L871)

Prepare clipPath state and cache and draw it on instance's cache

#### Parameters

##### ctx

`CanvasRenderingContext2D`

##### clipPath

`undefined` | [`BaseFabricObject`](/api/classes/basefabricobject/)\<`Partial`\<`ObjectProps`\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

##### context

[`DrawContext`](/api/type-aliases/drawcontext/)

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`_drawClipPath`](/api/classes/itext/#_drawclippath)

***

### \_getFontDeclaration()

> **\_getFontDeclaration**(`__namedParameters?`, `forMeasuring?`): `string`

Defined in: [src/shapes/Text/Text.ts:1678](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L1678)

return font declaration string for canvas context

#### Parameters

##### \_\_namedParameters?

`Partial`\<`Pick`\<[`TextStyleDeclaration`](/api/type-aliases/textstyledeclaration/), `"fontFamily"` \| `"fontStyle"` \| `"fontWeight"` \| `"fontSize"`\>\> = `{}`

##### forMeasuring?

`boolean`

#### Returns

`string`

font declaration formatted for canvas context.

#### Inherited from

[`IText`](/api/classes/itext/).[`_getFontDeclaration`](/api/classes/itext/#_getfontdeclaration)

***

### \_getGraphemeBox()

> **\_getGraphemeBox**(`grapheme`, `lineIndex`, `charIndex`, `prevGrapheme?`, `skipLeft?`): [`GraphemeBBox`](/api/type-aliases/graphemebbox/)

Defined in: [src/shapes/Text/Text.ts:980](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L980)

#### Parameters

##### grapheme

`string`

to be measured

##### lineIndex

`number`

index of the line where the char is

##### charIndex

`number`

position in the line

##### prevGrapheme?

`string`

character preceding the one to be measured

##### skipLeft?

`boolean`

#### Returns

[`GraphemeBBox`](/api/type-aliases/graphemebbox/)

grapheme bbox

#### Inherited from

[`IText`](/api/classes/itext/).[`_getGraphemeBox`](/api/classes/itext/#_getgraphemebox)

***

### \_getSelectionForOffset()

> **\_getSelectionForOffset**(`e`, `isRight`): `number`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:383](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L383)

private
Helps finding if the offset should be counted from Start or End

#### Parameters

##### e

`KeyboardEvent`

Event object

##### isRight

`boolean`

#### Returns

`number`

#### Inherited from

[`IText`](/api/classes/itext/).[`_getSelectionForOffset`](/api/classes/itext/#_getselectionforoffset)

***

### \_getWidthOfCharSpacing()

> **\_getWidthOfCharSpacing**(): `number`

Defined in: [src/shapes/Text/Text.ts:1527](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L1527)

#### Returns

`number`

#### Inherited from

[`IText`](/api/classes/itext/).[`_getWidthOfCharSpacing`](/api/classes/itext/#_getwidthofcharspacing)

***

### \_limitCacheSize()

> **\_limitCacheSize**(`dims`): [`TSize`](/api/type-aliases/tsize/) & `object` & `object`

Defined in: [src/shapes/Object/Object.ts:397](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L397)

Limit the cache dimensions so that X * Y do not cross config.perfLimitSizeTotal
and each side do not cross fabric.cacheSideLimit
those numbers are configurable so that you can get as much detail as you want
making bargain with performances.
It mutates the input object dims.

#### Parameters

##### dims

[`TSize`](/api/type-aliases/tsize/) & `object` & `object`

#### Returns

[`TSize`](/api/type-aliases/tsize/) & `object` & `object`

dims

#### Inherited from

[`IText`](/api/classes/itext/).[`_limitCacheSize`](/api/classes/itext/#_limitcachesize)

***

### \_measureLine()

> **\_measureLine**(`lineIndex`): `object`

Defined in: [src/shapes/Text/Text.ts:888](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L888)

measure every grapheme of a line, populating __charBounds

#### Parameters

##### lineIndex

`number`

#### Returns

`object`

object.width total width of characters

##### numOfSpaces

> **numOfSpaces**: `number` = `0`

##### width

> **width**: `number`

#### Inherited from

[`IText`](/api/classes/itext/).[`_measureLine`](/api/classes/itext/#_measureline)

***

### \_measureWord()

> **\_measureWord**(`word`, `lineIndex`, `charOffset`): `number`

Defined in: [src/shapes/Textbox.ts:386](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Textbox.ts#L386)

Helper function to measure a string of text, given its lineIndex and charIndex offset
It gets called when charBounds are not available yet.
Override if necessary
Use with [Textbox#wordSplit](/api/classes/textbox/#wordsplit)

#### Parameters

##### word

`string`[]

##### lineIndex

`number`

##### charOffset

`number` = `0`

#### Returns

`number`

***

### \_mouseDownHandler()

> **\_mouseDownHandler**(`__namedParameters`): `void`

Defined in: [src/shapes/IText/ITextClickBehavior.ts:98](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextClickBehavior.ts#L98)

Default event handler for the basic functionalities needed on _mouseDown
can be overridden to do something different.
Scope of this implementation is: find the click position, set selectionStart
find selectionEnd, initialize the drawing of either cursor or selection area
initializing a mousedDown on a text area will cancel fabricjs knowledge of
current compositionMode. It will be set to false.

#### Parameters

##### \_\_namedParameters

[`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object`

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`_mouseDownHandler`](/api/classes/itext/#_mousedownhandler)

***

### \_moveCursorLeftOrRight()

> **\_moveCursorLeftOrRight**(`direction`, `e`): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:645](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L645)

Moves cursor right or Left, fires event

#### Parameters

##### direction

'Left', 'Right'

`"Left"` | `"Right"`

##### e

`KeyboardEvent`

Event object

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`_moveCursorLeftOrRight`](/api/classes/itext/#_movecursorleftorright)

***

### \_moveCursorUpOrDown()

> **\_moveCursorUpOrDown**(`direction`, `e`): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:483](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L483)

Moves cursor up or down, fires the events

#### Parameters

##### direction

'Up' or 'Down'

`"Up"` | `"Down"`

##### e

`KeyboardEvent`

Event object

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`_moveCursorUpOrDown`](/api/classes/itext/#_movecursorupordown)

***

### \_removeCacheCanvas()

> **\_removeCacheCanvas**(): `void`

Defined in: [src/shapes/Object/Object.ts:707](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L707)

Remove cacheCanvas and its dimensions from the objects

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`_removeCacheCanvas`](/api/classes/itext/#_removecachecanvas)

***

### \_renderControls()

> **\_renderControls**(`ctx`, `styleOverride?`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:435](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L435)

Renders controls and borders for the object
the context here is not transformed

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Context to render on

##### styleOverride?

`TStyleOverride` = `{}`

properties to override the object style

#### Returns

`void`

#### Todo

move to interactivity

#### Inherited from

[`IText`](/api/classes/itext/).[`_renderControls`](/api/classes/itext/#_rendercontrols)

***

### \_renderCursor()

> **\_renderCursor**(`ctx`, `boundaries`, `selectionStart`): `void`

Defined in: [src/shapes/IText/IText.ts:602](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L602)

Render the cursor at the given selectionStart.

#### Parameters

##### ctx

`CanvasRenderingContext2D`

transformed context to draw on

##### boundaries

[`CursorBoundaries`](/api/type-aliases/cursorboundaries/)

##### selectionStart

`number`

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`_renderCursor`](/api/classes/itext/#_rendercursor)

***

### \_setClippingProperties()

> **\_setClippingProperties**(`ctx`): `void`

Defined in: [src/shapes/Object/Object.ts:1016](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L1016)

#### Parameters

##### ctx

`CanvasRenderingContext2D`

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`_setClippingProperties`](/api/classes/itext/#_setclippingproperties)

***

### \_setFillStyles()

> **\_setFillStyles**(`ctx`, `style`): `object`

Defined in: [src/shapes/Text/Text.ts:1344](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L1344)

This function prepare the canvas for a ill style, and fill
need to be sent in as defined

#### Parameters

##### ctx

`CanvasRenderingContext2D`

##### style

`Pick`\<`this`, `"fill"`\>

with ill defined

#### Returns

`object`

##### offsetX

> **offsetX**: `number`

##### offsetY

> **offsetY**: `number`

#### Inherited from

[`IText`](/api/classes/itext/).[`_setFillStyles`](/api/classes/itext/#_setfillstyles)

***

### \_setStrokeStyles()

> **\_setStrokeStyles**(`ctx`, `style`): `object`

Defined in: [src/shapes/Text/Text.ts:1322](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L1322)

This function prepare the canvas for a stroke style, and stroke and strokeWidth
need to be sent in as defined

#### Parameters

##### ctx

`CanvasRenderingContext2D`

##### style

`Pick`\<[`CompleteTextStyleDeclaration`](/api/type-aliases/completetextstyledeclaration/), `"stroke"` \| `"strokeWidth"`\>

with stroke and strokeWidth defined

#### Returns

`object`

##### offsetX

> **offsetX**: `number`

##### offsetY

> **offsetY**: `number`

#### Inherited from

[`IText`](/api/classes/itext/).[`_setStrokeStyles`](/api/classes/itext/#_setstrokestyles)

***

### \_setupCompositeOperation()

> **\_setupCompositeOperation**(`ctx`): `void`

Defined in: [src/shapes/Object/Object.ts:1482](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L1482)

Sets canvas globalCompositeOperation for specific object
custom composition operation for the particular object can be specified using globalCompositeOperation property

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Rendering canvas context

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`_setupCompositeOperation`](/api/classes/itext/#_setupcompositeoperation)

***

### \_splitTextIntoLines()

> **\_splitTextIntoLines**(`text`): `TextLinesInfo`

Defined in: [src/shapes/Textbox.ts:530](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Textbox.ts#L530)

Gets lines of text to render in the Textbox. This function calculates
text wrapping on the fly every time it is called.

#### Parameters

##### text

`string`

text to split

#### Returns

`TextLinesInfo`

Array of lines in the Textbox.

#### Overrides

[`IText`](/api/classes/itext/).[`_splitTextIntoLines`](/api/classes/itext/#_splittextintolines)

***

### \_toSVG()

> **\_toSVG**(`_reviver?`): `string`[]

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:121](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/FabricObjectSVGExportMixin.ts#L121)

Returns svg representation of an instance
This function is implemented in each subclass
This is just because typescript otherwise cryies all the time

#### Parameters

##### \_reviver?

[`TSVGReviver`](/api/type-aliases/tsvgreviver/)

#### Returns

`string`[]

an array of strings with the specific svg representation
of the instance

#### Inherited from

[`IText`](/api/classes/itext/).[`_toSVG`](/api/classes/itext/#_tosvg)

***

### \_wrapText()

> **\_wrapText**(`lines`, `desiredWidth`): `string`[][]

Defined in: [src/shapes/Textbox.ts:321](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Textbox.ts#L321)

Wraps text using the 'width' property of Textbox. First this function
splits text on newlines, so we preserve newlines entered by the user.
Then it wraps each line using the width of the Textbox by calling
_wrapLine().

#### Parameters

##### lines

`string`[]

The string array of text that is split into lines

##### desiredWidth

`number`

width you want to wrap to

#### Returns

`string`[][]

Array of lines

***

### abortCursorAnimation()

> **abortCursorAnimation**(): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:183](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L183)

Aborts cursor animation, clears all timeouts and clear textarea context if necessary

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`abortCursorAnimation`](/api/classes/itext/#abortcursoranimation)

***

### addPaintOrder()

> **addPaintOrder**(`this`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:250](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/FabricObjectSVGExportMixin.ts#L250)

#### Parameters

##### this

`FabricObjectSVGExportMixin` & [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

#### Returns

`string`

#### Inherited from

[`IText`](/api/classes/itext/).[`addPaintOrder`](/api/classes/itext/#addpaintorder)

***

### animate()

> **animate**\<`T`\>(`animatable`, `options?`): `Record`\<`string`, [`TAnimation`](/api/fabric/namespaces/util/type-aliases/tanimation/)\<`T`\>\>

Defined in: [src/shapes/Object/Object.ts:1521](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L1521)

Animates object's properties

#### Type Parameters

##### T

`T` *extends* `number` \| `number`[] \| [`TColorArg`](/api/type-aliases/tcolorarg/)

#### Parameters

##### animatable

`Record`\<`string`, `T`\>

map of keys and end values

##### options?

`Partial`\<[`AnimationOptions`](/api/fabric/namespaces/util/type-aliases/animationoptions/)\<`T`\>\>

#### Returns

`Record`\<`string`, [`TAnimation`](/api/fabric/namespaces/util/type-aliases/tanimation/)\<`T`\>\>

map of animation contexts

As object — multiple properties

object.animate({ left: ..., top: ... });
object.animate({ left: ..., top: ... }, { duration: ... });

#### See

[http://fabric5.fabricjs.com/fabric-intro-part-2#animation](http://fabric5.fabricjs.com/fabric-intro-part-2#animation)

#### Inherited from

[`IText`](/api/classes/itext/).[`animate`](/api/classes/itext/#animate)

***

### blur()

> **blur**(): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:106](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L106)

Override this method to customize cursor behavior on textbox blur

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`blur`](/api/classes/itext/#blur)

***

### calcACoords()

> **calcACoords**(): [`TCornerPoint`](/api/type-aliases/tcornerpoint/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:427](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L427)

Calculates the coordinates of the 4 corner of the bbox, in absolute coordinates.
those never change with zoom or viewport changes.

#### Returns

[`TCornerPoint`](/api/type-aliases/tcornerpoint/)

#### Inherited from

[`IText`](/api/classes/itext/).[`calcACoords`](/api/classes/itext/#calcacoords)

***

### calcOCoords()

> **calcOCoords**(): `Record`\<`string`, `TOCoord`\>

Defined in: [src/shapes/Object/InteractiveObject.ts:255](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L255)

Calculates the coordinates of the center of each control plus the corners of the control itself
This basically just delegates to each control positionHandler
WARNING: changing what is passed to positionHandler is a breaking change, since position handler
is a public api and should be done just if extremely necessary

#### Returns

`Record`\<`string`, `TOCoord`\>

#### Inherited from

[`IText`](/api/classes/itext/).[`calcOCoords`](/api/classes/itext/#calcocoords)

***

### calcOwnMatrix()

> **calcOwnMatrix**(): [`TMat2D`](/api/type-aliases/tmat2d/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:513](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L513)

calculate transform matrix that represents the current transformations from the
object's properties, this matrix does not include the group transformation

#### Returns

[`TMat2D`](/api/type-aliases/tmat2d/)

transform matrix for the object

#### Inherited from

[`IText`](/api/classes/itext/).[`calcOwnMatrix`](/api/classes/itext/#calcownmatrix)

***

### calcTextHeight()

> **calcTextHeight**(): `number`

Defined in: [src/shapes/Text/Text.ts:1052](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L1052)

Calculate text box height

#### Returns

`number`

#### Inherited from

[`IText`](/api/classes/itext/).[`calcTextHeight`](/api/classes/itext/#calctextheight)

***

### calcTransformMatrix()

> **calcTransformMatrix**(`skipGroup?`): [`TMat2D`](/api/type-aliases/tmat2d/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:485](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L485)

calculate transform matrix that represents the current transformations from the
object's properties.

#### Parameters

##### skipGroup?

`boolean` = `false`

return transform matrix for object not counting parent transformations
There are some situation in which this is useful to avoid the fake rotation.

#### Returns

[`TMat2D`](/api/type-aliases/tmat2d/)

transform matrix for the object

#### Inherited from

[`IText`](/api/classes/itext/).[`calcTransformMatrix`](/api/classes/itext/#calctransformmatrix)

***

### canDrop()

> **canDrop**(`e`): `boolean`

Defined in: [src/shapes/IText/ITextClickBehavior.ts:64](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextClickBehavior.ts#L64)

override this method to control whether instance should/shouldn't become a drop target

#### Parameters

##### e

`DragEvent`

#### Returns

`boolean`

#### Inherited from

[`IText`](/api/classes/itext/).[`canDrop`](/api/classes/itext/#candrop)

***

### cleanStyle()

> **cleanStyle**(`property`): `undefined` \| `false`

Defined in: [src/shapes/Text/StyledText.ts:101](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/StyledText.ts#L101)

Check if characters in a text have a value for a property
whose value matches the textbox's value for that property.  If so,
the character-level property is deleted.  If the character
has no other properties, then it is also deleted.  Finally,
if the line containing that character has no other characters
then it also is deleted.

#### Parameters

##### property

`StylePropertiesType`

#### Returns

`undefined` \| `false`

#### Inherited from

[`IText`](/api/classes/itext/).[`cleanStyle`](/api/classes/itext/#cleanstyle)

***

### clearContextTop()

> **clearContextTop**(`restoreManually?`): `undefined` \| `CanvasRenderingContext2D`

Defined in: [src/shapes/Object/InteractiveObject.ts:627](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L627)

Clears the canvas.contextTop in a specific area that corresponds to the object's bounding box
that is in the canvas.contextContainer.
This function is used to clear pieces of contextTop where we render ephemeral effects on top of the object.
Example: blinking cursor text selection, drag effects.

#### Parameters

##### restoreManually?

`boolean`

When true won't restore the context after clear, in order to draw something else.

#### Returns

`undefined` \| `CanvasRenderingContext2D`

canvas.contextTop that is either still transformed
with the object transformMatrix, or restored to neutral transform

#### Todo

discuss swapping restoreManually with a renderCallback, but think of async issues

#### Inherited from

[`IText`](/api/classes/itext/).[`clearContextTop`](/api/classes/itext/#clearcontexttop)

***

### clone()

> **clone**(`propertiesToInclude?`): `Promise`\<`Textbox`\<`Props`, `SProps`, `EventSpec`\>\>

Defined in: [src/shapes/Object/Object.ts:1244](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L1244)

Clones an instance.

#### Parameters

##### propertiesToInclude?

`string`[]

Any properties that you might want to additionally include in the output

#### Returns

`Promise`\<`Textbox`\<`Props`, `SProps`, `EventSpec`\>\>

#### Inherited from

[`IText`](/api/classes/itext/).[`clone`](/api/classes/itext/#clone)

***

### cloneAsImage()

> **cloneAsImage**(`options?`): [`FabricImage`](/api/classes/fabricimage/)

Defined in: [src/shapes/Object/Object.ts:1270](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L1270)

Creates an instance of Image out of an object
makes use of toCanvasElement.
Once this method was based on toDataUrl and loadImage, so it also had a quality
and format option. toCanvasElement is faster and produce no loss of quality.
If you need to get a real Jpeg or Png from an object, using toDataURL is the right way to do it.
toCanvasElement and then toBlob from the obtained canvas is also a good option.

#### Parameters

##### options?

`ObjectToCanvasElementOptions`

for clone as image, passed to toDataURL

#### Returns

[`FabricImage`](/api/classes/fabricimage/)

Object cloned as image.

#### Todo

fix the export type, it could not be Image but the type that getClass return for 'image'.

#### Inherited from

[`IText`](/api/classes/itext/).[`cloneAsImage`](/api/classes/itext/#cloneasimage)

***

### cmdAll()

> **cmdAll**(): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:230](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L230)

Selects entire text and updates the visual state

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`cmdAll`](/api/classes/itext/#cmdall)

***

### complexity()

> **complexity**(): `number`

Defined in: [src/shapes/Text/Text.ts:1811](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L1811)

Returns complexity of an instance

#### Returns

`number`

complexity

#### Inherited from

[`IText`](/api/classes/itext/).[`complexity`](/api/classes/itext/#complexity)

***

### containsPoint()

> **containsPoint**(`point`): `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:282](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L282)

Checks if point is inside the object

#### Parameters

##### point

[`Point`](/api/classes/point/)

Point to check against

#### Returns

`boolean`

true if point is inside the object

#### Inherited from

[`IText`](/api/classes/itext/).[`containsPoint`](/api/classes/itext/#containspoint)

***

### copy()

> **copy**(): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:301](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L301)

Copies selected text

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`copy`](/api/classes/itext/#copy)

***

### dispose()

> **dispose**(): `void`

Defined in: [src/shapes/IText/IText.ts:772](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L772)

cancel instance's running animations
override if necessary to dispose artifacts such as `clipPath`

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`dispose`](/api/classes/itext/#dispose)

***

### doubleClickHandler()

> **doubleClickHandler**(`options`): `void`

Defined in: [src/shapes/IText/ITextClickBehavior.ts:71](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextClickBehavior.ts#L71)

Default handler for double click, select a word

#### Parameters

##### options

[`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`doubleClickHandler`](/api/classes/itext/#doubleclickhandler)

***

### drawBorders()

> **drawBorders**(`ctx`, `options`, `styleOverride?`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:478](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L478)

Draws borders of an object's bounding box.
Requires public properties: width, height
Requires public options: padding, borderColor

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Context to draw on

##### options

[`TQrDecomposeOut`](/api/fabric/namespaces/util/type-aliases/tqrdecomposeout/)

object representing current object parameters

##### styleOverride?

`TStyleOverride`

object to override the object style

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`drawBorders`](/api/classes/itext/#drawborders)

***

### drawCacheOnCanvas()

> **drawCacheOnCanvas**(`this`, `ctx`): `void`

Defined in: [src/shapes/Object/Object.ts:893](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L893)

Paint the cached copy of the object on the target context.

#### Parameters

##### this

`TCachedFabricObject`

##### ctx

`CanvasRenderingContext2D`

Context to render on

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`drawCacheOnCanvas`](/api/classes/itext/#drawcacheoncanvas)

***

### drawClipPathOnCache()

> **drawClipPathOnCache**(`ctx`, `clipPath`, `canvasWithClipPath`): `void`

Defined in: [src/shapes/Object/Object.ts:799](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L799)

Execute the drawing operation for an object clipPath

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Context to render on

##### clipPath

[`BaseFabricObject`](/api/classes/basefabricobject/)

##### canvasWithClipPath

`HTMLCanvasElement`

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`drawClipPathOnCache`](/api/classes/itext/#drawclippathoncache)

***

### drawControls()

> **drawControls**(`ctx`, `styleOverride`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:550](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L550)

Draws corners of an object's bounding box.
Requires public properties: width, height
Requires public options: cornerSize, padding
Be aware that since fabric 6.0 this function does not call setCoords anymore.
setCoords needs to be called manually if the object of which we are rendering controls
is outside the standard selection and transform process.

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Context to draw on

##### styleOverride

`ControlRenderingStyleOverride` = `{}`

object to override the object style

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`drawControls`](/api/classes/itext/#drawcontrols)

***

### drawControlsConnectingLines()

> **drawControlsConnectingLines**(`ctx`, `size`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:517](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L517)

Draws lines from a borders of an object's bounding box to controls that have `withConnection` property set.
Requires public properties: width, height
Requires public options: padding, borderColor

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Context to draw on

##### size

[`Point`](/api/classes/point/)

object size x = width, y = height

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`drawControlsConnectingLines`](/api/classes/itext/#drawcontrolsconnectinglines)

***

### drawObject()

> **drawObject**(`ctx`, `forClipping`, `context`): `void`

Defined in: [src/shapes/Object/Object.ts:823](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L823)

Execute the drawing operation for an object on a specified context

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Context to render on

##### forClipping

apply clipping styles

`undefined` | `boolean`

##### context

[`DrawContext`](/api/type-aliases/drawcontext/)

additional context for rendering

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`drawObject`](/api/classes/itext/#drawobject)

***

### drawSelectionBackground()

> **drawSelectionBackground**(`ctx`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:375](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L375)

Draws a colored layer behind the object, inside its selection borders.
Requires public options: padding, selectionBackgroundColor
this function is called when the context is transformed
has checks to be skipped when the object is on a staticCanvas

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Context to draw on

#### Returns

`void`

#### Todo

evaluate if make this disappear in favor of a pre-render hook for objects
this was added by Andrea Bogazzi to make possible some feature for work reasons
it seemed a good option, now is an edge case

#### Inherited from

[`IText`](/api/classes/itext/).[`drawSelectionBackground`](/api/classes/itext/#drawselectionbackground)

***

### enlargeSpaces()

> **enlargeSpaces**(): `void`

Defined in: [src/shapes/Text/Text.ts:497](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L497)

Enlarge space boxes and shift the others

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`enlargeSpaces`](/api/classes/itext/#enlargespaces)

***

### enterEditing()

> **enterEditing**(`e?`): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:392](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L392)

Enters editing state

#### Parameters

##### e?

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`enterEditing`](/api/classes/itext/#enterediting)

***

### enterEditingImpl()

> **enterEditingImpl**(): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:411](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L411)

runs the actual logic that enter from editing state, see [enterEditing](/api/classes/textbox/#enterediting)

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`enterEditingImpl`](/api/classes/itext/#entereditingimpl)

***

### exitEditing()

> **exitEditing**(): `Textbox`\<`Props`, `SProps`, `EventSpec`\>

Defined in: [src/shapes/IText/ITextBehavior.ts:726](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L726)

Exits from editing state and fires relevant events

#### Returns

`Textbox`\<`Props`, `SProps`, `EventSpec`\>

#### Inherited from

[`IText`](/api/classes/itext/).[`exitEditing`](/api/classes/itext/#exitediting)

***

### exitEditingImpl()

> **exitEditingImpl**(): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:702](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L702)

runs the actual logic that exits from editing state, see [exitEditing](/api/classes/textbox/#exitediting)
But it does not fire events

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`exitEditingImpl`](/api/classes/itext/#exiteditingimpl)

***

### findAncestorsWithClipPath()

> **findAncestorsWithClipPath**(): [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]

Defined in: [src/shapes/IText/IText.ts:441](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L441)

Finds and returns an array of clip paths that are applied to the parent
group(s) of the current FabricObject instance. The object's hierarchy is
traversed upwards (from the current object towards the root of the canvas),
checking each parent object for the presence of a `clipPath` that is not
absolutely positioned.

#### Returns

[`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]

#### Inherited from

[`IText`](/api/classes/itext/).[`findAncestorsWithClipPath`](/api/classes/itext/#findancestorswithclippath)

***

### findCommonAncestors()

> **findCommonAncestors**\<`T`\>(`other`): `AncestryComparison`

Defined in: [src/shapes/Object/Object.ts:1639](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L1639)

Compare ancestors

#### Type Parameters

##### T

`T` *extends* `Textbox`\<`Props`, `SProps`, `EventSpec`\>

#### Parameters

##### other

`T`

#### Returns

`AncestryComparison`

an object that represent the ancestry situation.

#### Inherited from

[`IText`](/api/classes/itext/).[`findCommonAncestors`](/api/classes/itext/#findcommonancestors)

***

### findLineBoundaryLeft()

> **findLineBoundaryLeft**(`startFrom`): `number`

Defined in: [src/shapes/IText/ITextBehavior.ts:296](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L296)

Find new selection index representing start of current line according to current selection index

#### Parameters

##### startFrom

`number`

Current selection index

#### Returns

`number`

New selection index

#### Inherited from

[`IText`](/api/classes/itext/).[`findLineBoundaryLeft`](/api/classes/itext/#findlineboundaryleft)

***

### findLineBoundaryRight()

> **findLineBoundaryRight**(`startFrom`): `number`

Defined in: [src/shapes/IText/ITextBehavior.ts:313](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L313)

Find new selection index representing end of current line according to current selection index

#### Parameters

##### startFrom

`number`

Current selection index

#### Returns

`number`

New selection index

#### Inherited from

[`IText`](/api/classes/itext/).[`findLineBoundaryRight`](/api/classes/itext/#findlineboundaryright)

***

### findWordBoundaryLeft()

> **findWordBoundaryLeft**(`startFrom`): `number`

Defined in: [src/shapes/IText/ITextBehavior.ts:248](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L248)

Find new selection index representing start of current word according to current selection index

#### Parameters

##### startFrom

`number`

Current selection index

#### Returns

`number`

New selection index

#### Inherited from

[`IText`](/api/classes/itext/).[`findWordBoundaryLeft`](/api/classes/itext/#findwordboundaryleft)

***

### findWordBoundaryRight()

> **findWordBoundaryRight**(`startFrom`): `number`

Defined in: [src/shapes/IText/ITextBehavior.ts:272](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L272)

Find new selection index representing end of current word according to current selection index

#### Parameters

##### startFrom

`number`

Current selection index

#### Returns

`number`

New selection index

#### Inherited from

[`IText`](/api/classes/itext/).[`findWordBoundaryRight`](/api/classes/itext/#findwordboundaryright)

***

### fire()

> **fire**\<`K`\>(`eventName`, `options?`): `void`

Defined in: [src/Observable.ts:167](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Observable.ts#L167)

Fires event with an optional options object

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### eventName

`K`

Event name to fire

##### options?

`EventSpec`\[`K`\]

Options object

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`fire`](/api/classes/itext/#fire)

***

### forEachControl()

> **forEachControl**(`fn`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:353](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L353)

Calls a function for each control. The function gets called,
with the control, the control's key and the object that is calling the iterator

#### Parameters

##### fn

(`control`, `key`, `fabricObject`) => `any`

function to iterate over the controls over

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`forEachControl`](/api/classes/itext/#foreachcontrol)

***

### fromGraphemeToStringSelection()

> **fromGraphemeToStringSelection**(`start`, `end`, `graphemes`): `object`

Defined in: [src/shapes/IText/ITextBehavior.ts:504](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L504)

convert from fabric to textarea values

#### Parameters

##### start

`number`

##### end

`number`

##### graphemes

`string`[]

#### Returns

`object`

##### selectionEnd

> **selectionEnd**: `number` = `graphemeStart`

##### selectionStart

> **selectionStart**: `number` = `graphemeStart`

#### Inherited from

[`IText`](/api/classes/itext/).[`fromGraphemeToStringSelection`](/api/classes/itext/#fromgraphemetostringselection)

***

### fromStringToGraphemeSelection()

> **fromStringToGraphemeSelection**(`start`, `end`, `text`): `object`

Defined in: [src/shapes/IText/ITextBehavior.ts:487](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L487)

convert from textarea to grapheme indexes

#### Parameters

##### start

`number`

##### end

`number`

##### text

`string`

#### Returns

`object`

##### selectionEnd

> **selectionEnd**: `number` = `graphemeStart`

##### selectionStart

> **selectionStart**: `number` = `graphemeStart`

#### Inherited from

[`IText`](/api/classes/itext/).[`fromStringToGraphemeSelection`](/api/classes/itext/#fromstringtographemeselection)

***

### get()

> **get**(`property`): `any`

Defined in: [src/CommonMethods.ts:59](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/CommonMethods.ts#L59)

Basic getter

#### Parameters

##### property

`string`

Property name

#### Returns

`any`

value of a property

#### Inherited from

[`IText`](/api/classes/itext/).[`get`](/api/classes/itext/#get)

***

### get2DCursorLocation()

> **get2DCursorLocation**(`selectionStart?`, `skipWrapping?`): `object`

Defined in: [src/shapes/IText/IText.ts:340](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L340)

Returns 2d representation (lineIndex and charIndex) of cursor (or selection start)

#### Parameters

##### selectionStart?

`number` = `...`

Optional index. When not given, current selectionStart is used.

##### skipWrapping?

`boolean`

consider the location for unwrapped lines. useful to manage styles.

#### Returns

`object`

##### charIndex

> **charIndex**: `number` = `selectionStart`

##### lineIndex

> **lineIndex**: `number` = `i`

#### Inherited from

[`IText`](/api/classes/itext/).[`get2DCursorLocation`](/api/classes/itext/#get2dcursorlocation)

***

### getActiveControl()

> **getActiveControl**(): `undefined` \| \{ `control`: [`Control`](/api/classes/control/); `coord`: `TOCoord`; `key`: `string`; \}

Defined in: [src/shapes/Object/InteractiveObject.ts:194](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L194)

#### Returns

`undefined` \| \{ `control`: [`Control`](/api/classes/control/); `coord`: `TOCoord`; `key`: `string`; \}

#### Inherited from

[`IText`](/api/classes/itext/).[`getActiveControl`](/api/classes/itext/#getactivecontrol)

***

### getAncestors()

> **getAncestors**(): `Ancestors`

Defined in: [src/shapes/Object/Object.ts:1622](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L1622)

#### Returns

`Ancestors`

ancestors (excluding `ActiveSelection`) from bottom to top

#### Inherited from

[`IText`](/api/classes/itext/).[`getAncestors`](/api/classes/itext/#getancestors)

***

### getBoundingRect()

> **getBoundingRect**(): [`TBBox`](/api/type-aliases/tbbox/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:343](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L343)

Returns coordinates of object's bounding rectangle (left, top, width, height)
the box is intended as aligned to axis of canvas.

#### Returns

[`TBBox`](/api/type-aliases/tbbox/)

Object with left, top, width, height properties

#### Inherited from

[`IText`](/api/classes/itext/).[`getBoundingRect`](/api/classes/itext/#getboundingrect)

***

### getCanvasRetinaScaling()

> **getCanvasRetinaScaling**(): `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:400](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L400)

#### Returns

`number`

#### Inherited from

[`IText`](/api/classes/itext/).[`getCanvasRetinaScaling`](/api/classes/itext/#getcanvasretinascaling)

***

### getCenterPoint()

> **getCenterPoint**(): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:733](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L733)

Returns the center coordinates of the object relative to canvas

#### Returns

[`Point`](/api/classes/point/)

#### Inherited from

[`IText`](/api/classes/itext/).[`getCenterPoint`](/api/classes/itext/#getcenterpoint)

***

### getCompleteStyleDeclaration()

> **getCompleteStyleDeclaration**(`lineIndex`, `charIndex`): [`CompleteTextStyleDeclaration`](/api/type-aliases/completetextstyledeclaration/)

Defined in: [src/shapes/Text/StyledText.ts:276](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/StyledText.ts#L276)

return a new object that contains all the style property for a character
the object returned is newly created

#### Parameters

##### lineIndex

`number`

of the line where the character is

##### charIndex

`number`

position of the character on the line

#### Returns

[`CompleteTextStyleDeclaration`](/api/type-aliases/completetextstyledeclaration/)

style object

#### Inherited from

[`IText`](/api/classes/itext/).[`getCompleteStyleDeclaration`](/api/classes/itext/#getcompletestyledeclaration)

***

### getCoords()

> **getCoords**(): [`Point`](/api/classes/point/)[]

Defined in: [src/shapes/Object/ObjectGeometry.ts:204](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L204)

#### Returns

[`Point`](/api/classes/point/)[]

[tl, tr, br, bl] in the scene plane

#### Inherited from

[`IText`](/api/classes/itext/).[`getCoords`](/api/classes/itext/#getcoords)

***

### getCurrentCharColor()

> **getCurrentCharColor**(): `null` \| `string` \| [`TFiller`](/api/type-aliases/tfiller/)

Defined in: [src/shapes/IText/IText.ts:756](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L756)

High level function to know the color of the cursor.
the currentChar is the one that precedes the cursor
Returns color (fill) of char at the current cursor
if the text object has a pattern or gradient for filler, it will return that.
Unused by the library, is for the end user

#### Returns

`null` \| `string` \| [`TFiller`](/api/type-aliases/tfiller/)

Character color (fill)

#### Inherited from

[`IText`](/api/classes/itext/).[`getCurrentCharColor`](/api/classes/itext/#getcurrentcharcolor)

***

### getCurrentCharFontSize()

> **getCurrentCharFontSize**(): `number`

Defined in: [src/shapes/IText/IText.ts:743](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L743)

High level function to know the height of the cursor.
the currentChar is the one that precedes the cursor
Returns fontSize of char at the current cursor
Unused from the library, is for the end user

#### Returns

`number`

Character font size

#### Inherited from

[`IText`](/api/classes/itext/).[`getCurrentCharFontSize`](/api/classes/itext/#getcurrentcharfontsize)

***

### getCursorRenderingData()

> **getCursorRenderingData**(`selectionStart`, `boundaries`): [`CursorRenderingData`](/api/type-aliases/cursorrenderingdata/)

Defined in: [src/shapes/IText/IText.ts:568](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L568)

Return the data needed to render the cursor for given selection start
The left,top are relative to the object, while width and height are prescaled
to look think with canvas zoom and object scaling,
so they depend on canvas and object scaling

#### Parameters

##### selectionStart

`number` = `...`

##### boundaries

[`CursorBoundaries`](/api/type-aliases/cursorboundaries/) = `...`

#### Returns

[`CursorRenderingData`](/api/type-aliases/cursorrenderingdata/)

#### Inherited from

[`IText`](/api/classes/itext/).[`getCursorRenderingData`](/api/classes/itext/#getcursorrenderingdata)

***

### getDownCursorOffset()

> **getDownCursorOffset**(`e`, `isRight`): `number`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:351](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L351)

Gets start offset of a selection

#### Parameters

##### e

`KeyboardEvent`

Event object

##### isRight

`boolean`

#### Returns

`number`

#### Inherited from

[`IText`](/api/classes/itext/).[`getDownCursorOffset`](/api/classes/itext/#getdowncursoroffset)

***

### getGraphemeDataForRender()

> **getGraphemeDataForRender**(`lines`): [`GraphemeData`](/api/type-aliases/graphemedata/)

Defined in: [src/shapes/Textbox.ts:340](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Textbox.ts#L340)

For each line of text terminated by an hard line stop,
measure each word width and extract the largest word from all.
The returned words here are the one that at the end will be rendered.

#### Parameters

##### lines

`string`[]

the lines we need to measure

#### Returns

[`GraphemeData`](/api/type-aliases/graphemedata/)

***

### getHeightOfChar()

> **getHeightOfChar**(`line`, `_char`): `number`

Defined in: [src/shapes/Text/Text.ts:863](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L863)

Computes height of character at given position

#### Parameters

##### line

`number`

the line index number

##### \_char

`number`

the character index number

#### Returns

`number`

fontSize of the character

#### Inherited from

[`IText`](/api/classes/itext/).[`getHeightOfChar`](/api/classes/itext/#getheightofchar)

***

### getHeightOfLine()

> **getHeightOfLine**(`lineIndex`): `number`

Defined in: [src/shapes/Text/Text.ts:1045](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L1045)

Calculate height of line at 'lineIndex'

#### Parameters

##### lineIndex

`number`

index of line to calculate

#### Returns

`number`

#### Inherited from

[`IText`](/api/classes/itext/).[`getHeightOfLine`](/api/classes/itext/#getheightofline)

***

### getMinWidth()

> **getMinWidth**(): `number`

Defined in: [src/shapes/Textbox.ts:542](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Textbox.ts#L542)

#### Returns

`number`

***

### getObjectOpacity()

> **getObjectOpacity**(): `number`

Defined in: [src/shapes/Object/Object.ts:560](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L560)

Return the object opacity counting also the group property

#### Returns

`number`

#### Inherited from

[`IText`](/api/classes/itext/).[`getObjectOpacity`](/api/classes/itext/#getobjectopacity)

***

### getObjectScaling()

> **getObjectScaling**(): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/Object.ts:529](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L529)

Return the object scale factor counting also the group scaling

#### Returns

[`Point`](/api/classes/point/)

#### Inherited from

[`IText`](/api/classes/itext/).[`getObjectScaling`](/api/classes/itext/#getobjectscaling)

***

### ~~getPointByOrigin()~~

> **getPointByOrigin**(`originX`, `originY`): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:756](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L756)

Alias of [getPositionByOrigin](/api/classes/textbox/#getpositionbyorigin)

:::caution[Deprecated]
use [getPositionByOrigin](/api/classes/textbox/#getpositionbyorigin) instead
:::

#### Parameters

##### originX

[`TOriginX`](/api/type-aliases/toriginx/)

##### originY

[`TOriginY`](/api/type-aliases/toriginy/)

#### Returns

[`Point`](/api/classes/point/)

#### Inherited from

[`IText`](/api/classes/itext/).[`getPointByOrigin`](/api/classes/itext/#getpointbyorigin)

***

### getPositionByOrigin()

> **getPositionByOrigin**(`originX`, `originY`): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:772](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L772)

This function is the mirror of [setPositionByOrigin](/api/classes/textbox/#setpositionbyorigin)
Returns the position of the object based on specified origin.
Take an object that has left, top set to 100, 100 with origin 'left', 'top'.
Return the values of left top ( wrapped in a point ) that you would need to keep
the same position if origin where different ( ex: center, bottom )
Alternatively you can use this to also find which point in the parent plane is a specific origin
( where is the bottom right corner of my object? )

#### Parameters

##### originX

[`TOriginX`](/api/type-aliases/toriginx/)

Horizontal origin: 'left', 'center' or 'right'

##### originY

[`TOriginY`](/api/type-aliases/toriginy/)

Vertical origin: 'top', 'center' or 'bottom'

#### Returns

[`Point`](/api/classes/point/)

#### Inherited from

[`IText`](/api/classes/itext/).[`getPositionByOrigin`](/api/classes/itext/#getpositionbyorigin)

***

### getRelativeCenterPoint()

> **getRelativeCenterPoint**(): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:744](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L744)

Returns the center coordinates of the object relative to it's parent

#### Returns

[`Point`](/api/classes/point/)

#### Inherited from

[`IText`](/api/classes/itext/).[`getRelativeCenterPoint`](/api/classes/itext/#getrelativecenterpoint)

***

### getRelativeX()

> **getRelativeX**(): `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:115](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L115)

#### Returns

`number`

x position according to object's originX property in parent's coordinate plane\
if parent is canvas then this property is identical to [getX](/api/classes/textbox/#getx)

#### Inherited from

[`IText`](/api/classes/itext/).[`getRelativeX`](/api/classes/itext/#getrelativex)

***

### getRelativeXY()

> **getRelativeXY**(): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:176](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L176)

#### Returns

[`Point`](/api/classes/point/)

x,y position according to object's originX originY properties in parent's coordinate plane

#### Inherited from

[`IText`](/api/classes/itext/).[`getRelativeXY`](/api/classes/itext/#getrelativexy)

***

### getRelativeY()

> **getRelativeY**(): `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:131](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L131)

#### Returns

`number`

y position according to object's originY property in parent's coordinate plane\
if parent is canvas then this property is identical to [getY](/api/classes/textbox/#gety)

#### Inherited from

[`IText`](/api/classes/itext/).[`getRelativeY`](/api/classes/itext/#getrelativey)

***

### getScaledHeight()

> **getScaledHeight**(): `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:361](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L361)

Returns height of an object bounding box counting transformations

#### Returns

`number`

height value

#### Todo

shouldn't this account for group transform and return the actual size in canvas coordinate plane?

#### Inherited from

[`IText`](/api/classes/itext/).[`getScaledHeight`](/api/classes/itext/#getscaledheight)

***

### getScaledWidth()

> **getScaledWidth**(): `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:352](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L352)

Returns width of an object's bounding box counting transformations

#### Returns

`number`

width value

#### Todo

shouldn't this account for group transform and return the actual size in canvas coordinate plane?

#### Inherited from

[`IText`](/api/classes/itext/).[`getScaledWidth`](/api/classes/itext/#getscaledwidth)

***

### getSelectedText()

> **getSelectedText**(): `string`

Defined in: [src/shapes/IText/ITextBehavior.ts:239](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L239)

Returns selected text

#### Returns

`string`

#### Inherited from

[`IText`](/api/classes/itext/).[`getSelectedText`](/api/classes/itext/#getselectedtext)

***

### getSelectionStartFromPointer()

> **getSelectionStartFromPointer**(`e`): `number`

Defined in: [src/shapes/IText/ITextClickBehavior.ts:193](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextClickBehavior.ts#L193)

Returns index of a character corresponding to where an object was clicked

#### Parameters

##### e

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

Event object

#### Returns

`number`

Index of a character

#### Inherited from

[`IText`](/api/classes/itext/).[`getSelectionStartFromPointer`](/api/classes/itext/#getselectionstartfrompointer)

***

### getSelectionStyles()

> **getSelectionStyles**(`startIndex`, `endIndex`, `complete?`): `Partial`\<[`CompleteTextStyleDeclaration`](/api/type-aliases/completetextstyledeclaration/)\>[]

Defined in: [src/shapes/IText/IText.ts:313](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L313)

Gets style of a current selection/cursor (at the start position)
if startIndex or endIndex are not provided, selectionStart or selectionEnd will be used.

#### Parameters

##### startIndex

`number` = `...`

Start index to get styles at

##### endIndex

`number` = `...`

End index to get styles at, if not specified selectionEnd or startIndex + 1

##### complete?

`boolean`

get full style or not

#### Returns

`Partial`\<[`CompleteTextStyleDeclaration`](/api/type-aliases/completetextstyledeclaration/)\>[]

styles an array with one, zero or more Style objects

#### Inherited from

[`IText`](/api/classes/itext/).[`getSelectionStyles`](/api/classes/itext/#getselectionstyles)

***

### getSvgCommons()

> **getSvgCommons**(`this`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:85](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/FabricObjectSVGExportMixin.ts#L85)

Returns id attribute for svg output

#### Parameters

##### this

`FabricObjectSVGExportMixin` & [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\> & `object`

#### Returns

`string`

#### Inherited from

[`IText`](/api/classes/itext/).[`getSvgCommons`](/api/classes/itext/#getsvgcommons)

***

### getSvgFilter()

> **getSvgFilter**(`this`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:77](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/FabricObjectSVGExportMixin.ts#L77)

Returns filter for svg shadow

#### Parameters

##### this

`FabricObjectSVGExportMixin` & [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

#### Returns

`string`

#### Inherited from

[`IText`](/api/classes/itext/).[`getSvgFilter`](/api/classes/itext/#getsvgfilter)

***

### getSvgStyles()

> **getSvgStyles**(`this`, `skipShadow?`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:22](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/FabricObjectSVGExportMixin.ts#L22)

Returns styles-string for svg-export

#### Parameters

##### this

`FabricObjectSVGExportMixin` & [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

##### skipShadow?

`boolean`

a boolean to skip shadow filter output

#### Returns

`string`

#### Inherited from

[`IText`](/api/classes/itext/).[`getSvgStyles`](/api/classes/itext/#getsvgstyles)

***

### getSvgTransform()

> **getSvgTransform**(`this`, `full?`, `additionalTransform?`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:104](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/FabricObjectSVGExportMixin.ts#L104)

Returns transform-string for svg-export

#### Parameters

##### this

`FabricObjectSVGExportMixin` & [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

##### full?

`boolean`

##### additionalTransform?

`string` = `''`

#### Returns

`string`

#### Inherited from

[`IText`](/api/classes/itext/).[`getSvgTransform`](/api/classes/itext/#getsvgtransform)

***

### getTotalAngle()

> **getTotalAngle**(): [`TDegree`](/api/type-aliases/tdegree/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:408](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L408)

Returns the object angle relative to canvas counting also the group property

#### Returns

[`TDegree`](/api/type-aliases/tdegree/)

#### Inherited from

[`IText`](/api/classes/itext/).[`getTotalAngle`](/api/classes/itext/#gettotalangle)

***

### getTotalObjectScaling()

> **getTotalObjectScaling**(): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/Object.ts:546](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L546)

Return the object scale factor counting also the group scaling, zoom and retina

#### Returns

[`Point`](/api/classes/point/)

object with scaleX and scaleY properties

#### Inherited from

[`IText`](/api/classes/itext/).[`getTotalObjectScaling`](/api/classes/itext/#gettotalobjectscaling)

***

### getUpCursorOffset()

> **getUpCursorOffset**(`e`, `isRight`): `number`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:396](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L396)

#### Parameters

##### e

`KeyboardEvent`

Event object

##### isRight

`boolean`

#### Returns

`number`

#### Inherited from

[`IText`](/api/classes/itext/).[`getUpCursorOffset`](/api/classes/itext/#getupcursoroffset)

***

### getValueOfPropertyAt()

> **getValueOfPropertyAt**\<`T`\>(`lineIndex`, `charIndex`, `property`): `Textbox`\<`Props`, `SProps`, `EventSpec`\>\[`T`\]

Defined in: [src/shapes/Text/Text.ts:1541](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L1541)

Retrieves the value of property at given character position

#### Type Parameters

##### T

`T` *extends* `StylePropertiesType`

#### Parameters

##### lineIndex

`number`

the line number

##### charIndex

`number`

the character number

##### property

`T`

the property name

#### Returns

`Textbox`\<`Props`, `SProps`, `EventSpec`\>\[`T`\]

the value of 'property'

#### Inherited from

[`IText`](/api/classes/itext/).[`getValueOfPropertyAt`](/api/classes/itext/#getvalueofpropertyat)

***

### getViewportTransform()

> **getViewportTransform**(): [`TMat2D`](/api/type-aliases/tmat2d/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:418](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L418)

Retrieves viewportTransform from Object's canvas if available

#### Returns

[`TMat2D`](/api/type-aliases/tmat2d/)

#### Inherited from

[`IText`](/api/classes/itext/).[`getViewportTransform`](/api/classes/itext/#getviewporttransform)

***

### getX()

> **getX**(): `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:86](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L86)

#### Returns

`number`

x position according to object's originX property in canvas coordinate plane

#### Inherited from

[`IText`](/api/classes/itext/).[`getX`](/api/classes/itext/#getx)

***

### getXY()

> **getXY**(): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:146](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L146)

#### Returns

[`Point`](/api/classes/point/)

x position according to object's originX originY properties in canvas coordinate plane

#### Inherited from

[`IText`](/api/classes/itext/).[`getXY`](/api/classes/itext/#getxy)

***

### getY()

> **getY**(): `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:100](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L100)

#### Returns

`number`

y position according to object's originY property in canvas coordinate plane

#### Inherited from

[`IText`](/api/classes/itext/).[`getY`](/api/classes/itext/#gety)

***

### graphemeSplit()

> **graphemeSplit**(`value`): `string`[]

Defined in: [src/shapes/Text/Text.ts:1737](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L1737)

Override this method to customize grapheme splitting

#### Parameters

##### value

`string`

#### Returns

`string`[]

array of graphemes

#### Todo

the util `graphemeSplit` needs to be injectable in some way.
is more comfortable to inject the correct util rather than having to override text
in the middle of the prototype chain

#### Inherited from

[`IText`](/api/classes/itext/).[`graphemeSplit`](/api/classes/itext/#graphemesplit)

***

### handleFiller()

> **handleFiller**\<`T`\>(`ctx`, `property`, `filler`): `object`

Defined in: [src/shapes/Text/Text.ts:1282](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L1282)

#### Type Parameters

##### T

`T` *extends* `"fill"` \| `"stroke"`

#### Parameters

##### ctx

`CanvasRenderingContext2D`

##### property

`` `${T}Style` ``

##### filler

`string` | [`TFiller`](/api/type-aliases/tfiller/)

#### Returns

`object`

##### offsetX

> **offsetX**: `number`

##### offsetY

> **offsetY**: `number`

#### Inherited from

[`IText`](/api/classes/itext/).[`handleFiller`](/api/classes/itext/#handlefiller)

***

### hasCommonAncestors()

> **hasCommonAncestors**\<`T`\>(`other`): `boolean`

Defined in: [src/shapes/Object/Object.ts:1704](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L1704)

#### Type Parameters

##### T

`T` *extends* `Textbox`\<`Props`, `SProps`, `EventSpec`\>

#### Parameters

##### other

`T`

#### Returns

`boolean`

#### Inherited from

[`IText`](/api/classes/itext/).[`hasCommonAncestors`](/api/classes/itext/#hascommonancestors)

***

### hasFill()

> **hasFill**(): `boolean`

Defined in: [src/shapes/Object/Object.ts:738](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L738)

return true if the object will draw a fill
Does not consider text styles. This is just a shortcut used at rendering time
We want it to be an approximation and be fast.
wrote to avoid extra caching, it has to return true when fill happens,
can guess when it will not happen at 100% chance, does not matter if it misses
some use case where the fill is invisible.

#### Returns

`boolean`

Boolean

#### Since

3.0.0

#### Inherited from

[`IText`](/api/classes/itext/).[`hasFill`](/api/classes/itext/#hasfill)

***

### hasStroke()

> **hasStroke**(): `boolean`

Defined in: [src/shapes/Object/Object.ts:722](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L722)

return true if the object will draw a stroke
Does not consider text styles. This is just a shortcut used at rendering time
We want it to be an approximation and be fast.
wrote to avoid extra caching, it has to return true when stroke happens,
can guess when it will not happen at 100% chance, does not matter if it misses
some use case where the stroke is invisible.

#### Returns

`boolean`

Boolean

#### Since

3.0.0

#### Inherited from

[`IText`](/api/classes/itext/).[`hasStroke`](/api/classes/itext/#hasstroke)

***

### initBehavior()

> **initBehavior**(): `void`

Defined in: [src/shapes/IText/ITextClickBehavior.ts:26](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextClickBehavior.ts#L26)

Initializes all the interactive behavior of IText

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`initBehavior`](/api/classes/itext/#initbehavior)

***

### initDelayedCursor()

> **initDelayedCursor**(`restart?`): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:175](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L175)

Initializes delayed cursor

#### Parameters

##### restart?

`boolean`

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`initDelayedCursor`](/api/classes/itext/#initdelayedcursor)

***

### initHiddenTextarea()

> **initHiddenTextarea**(): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:62](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L62)

Initializes hidden textarea (needed to bring up keyboard in iOS)

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`initHiddenTextarea`](/api/classes/itext/#inithiddentextarea)

***

### insertChars()

> **insertChars**(`text`, `style`, `start`, `end`): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:1062](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L1062)

insert characters at start position, before start position.
start  equal 1 it means the text get inserted between actual grapheme 0 and 1
if style array is provided, it must be as the same length of text in graphemes
if end is provided and is bigger than start, old text is replaced.
start/end ar per grapheme position in _text array.

#### Parameters

##### text

`string`

text to insert

##### style

array of style objects

`undefined` | `Partial`\<[`CompleteTextStyleDeclaration`](/api/type-aliases/completetextstyledeclaration/)\>[]

##### start

`number`

##### end

`number` = `start`

default to start + 1

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`insertChars`](/api/classes/itext/#insertchars)

***

### insertCharStyleObject()

> **insertCharStyleObject**(`lineIndex`, `charIndex`, `quantity`, `copiedStyle?`): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:912](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L912)

Inserts style object for a given line/char index

#### Parameters

##### lineIndex

`number`

Index of a line

##### charIndex

`number`

Index of a char

##### quantity

`number`

number Style object to insert, if given

##### copiedStyle?

`Partial`\<[`CompleteTextStyleDeclaration`](/api/type-aliases/completetextstyledeclaration/)\>[]

array of style objects

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`insertCharStyleObject`](/api/classes/itext/#insertcharstyleobject)

***

### insertNewlineStyleObject()

> **insertNewlineStyleObject**(`lineIndex`, `charIndex`, `qty`, `copiedStyle?`): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:843](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L843)

Handle insertion of more consecutive style lines for when one or more
newlines gets added to the text. Since current style needs to be shifted
first we shift the current style of the number lines needed, then we add
new lines from the last to the first.

#### Parameters

##### lineIndex

`number`

Index of a line

##### charIndex

`number`

Index of a char

##### qty

`number`

number of lines to add

##### copiedStyle?

Array of objects styles

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`insertNewlineStyleObject`](/api/classes/itext/#insertnewlinestyleobject)

***

### insertNewStyleBlock()

> **insertNewStyleBlock**(`insertedText`, `start`, `copiedStyle?`): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:970](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L970)

Inserts style object(s)

#### Parameters

##### insertedText

`string`[]

Characters at the location where style is inserted

##### start

`number`

cursor index for inserting style

##### copiedStyle?

`Partial`\<[`CompleteTextStyleDeclaration`](/api/type-aliases/completetextstyledeclaration/)\>[]

array of style objects to insert.

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`insertNewStyleBlock`](/api/classes/itext/#insertnewstyleblock)

***

### intersectsWithObject()

> **intersectsWithObject**(`other`): `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:232](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L232)

Checks if object intersects with another object

#### Parameters

##### other

`ObjectGeometry`

Object to test

#### Returns

`boolean`

true if object intersects with another object

#### Inherited from

[`IText`](/api/classes/itext/).[`intersectsWithObject`](/api/classes/itext/#intersectswithobject)

***

### intersectsWithRect()

> **intersectsWithRect**(`tl`, `br`): `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:218](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L218)

Checks if object intersects with the scene rect formed by tl and br

#### Parameters

##### tl

[`Point`](/api/classes/point/)

##### br

[`Point`](/api/classes/point/)

#### Returns

`boolean`

#### Inherited from

[`IText`](/api/classes/itext/).[`intersectsWithRect`](/api/classes/itext/#intersectswithrect)

***

### isCacheDirty()

> **isCacheDirty**(`skipCanvas`): `boolean`

Defined in: [src/shapes/Object/Object.ts:910](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L910)

Check if cache is dirty and if is dirty clear the context.
This check has a big side effect, it changes the underlying cache canvas if necessary.
Do not call this method on your own to check if the cache is dirty, because if it is,
it is also going to wipe the cache. This is badly designed and needs to be fixed.

#### Parameters

##### skipCanvas

`boolean` = `false`

skip canvas checks because this object is painted
on parent canvas.

#### Returns

`boolean`

#### Inherited from

[`IText`](/api/classes/itext/).[`isCacheDirty`](/api/classes/itext/#iscachedirty)

***

### isContainedWithinObject()

> **isContainedWithinObject**(`other`): `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:251](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L251)

Checks if object is fully contained within area of another object

#### Parameters

##### other

`ObjectGeometry`

Object to test

#### Returns

`boolean`

true if object is fully contained within area of another object

#### Inherited from

[`IText`](/api/classes/itext/).[`isContainedWithinObject`](/api/classes/itext/#iscontainedwithinobject)

***

### isContainedWithinRect()

> **isContainedWithinRect**(`tl`, `br`): `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:259](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L259)

Checks if object is fully contained within the scene rect formed by tl and br

#### Parameters

##### tl

[`Point`](/api/classes/point/)

##### br

[`Point`](/api/classes/point/)

#### Returns

`boolean`

#### Inherited from

[`IText`](/api/classes/itext/).[`isContainedWithinRect`](/api/classes/itext/#iscontainedwithinrect)

***

### isControlVisible()

> **isControlVisible**(`controlKey`): `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:584](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L584)

Returns true if the specified control is visible, false otherwise.

#### Parameters

##### controlKey

`string`

The key of the control. Possible values are usually 'tl', 'tr', 'br', 'bl', 'ml', 'mt', 'mr', 'mb', 'mtr',
but since the control api allow for any control name, can be any string.

#### Returns

`boolean`

true if the specified control is visible, false otherwise

#### Inherited from

[`IText`](/api/classes/itext/).[`isControlVisible`](/api/classes/itext/#iscontrolvisible)

***

### isDescendantOf()

> **isDescendantOf**(`target`): `boolean`

Defined in: [src/shapes/Object/Object.ts:1608](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L1608)

Checks if object is descendant of target
Should be used instead of [Group.contains](/api/classes/group/#contains) or [StaticCanvas.contains](/api/classes/staticcanvas/#contains) for performance reasons

#### Parameters

##### target

`TAncestor`

#### Returns

`boolean`

#### Inherited from

[`IText`](/api/classes/itext/).[`isDescendantOf`](/api/classes/itext/#isdescendantof)

***

### isEmptyStyles()

> **isEmptyStyles**(`lineIndex`): `boolean`

Defined in: [src/shapes/Textbox.ts:206](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Textbox.ts#L206)

Returns true if object has no styling or no styling in a line

#### Parameters

##### lineIndex

`number`

, lineIndex is on wrapped lines.

#### Returns

`boolean`

#### Overrides

[`IText`](/api/classes/itext/).[`isEmptyStyles`](/api/classes/itext/#isemptystyles)

***

### isEndOfWrapping()

> **isEndOfWrapping**(`lineIndex`): `boolean`

Defined in: [src/shapes/Textbox.ts:497](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Textbox.ts#L497)

Detect if the text line is ended with an hard break
text and itext do not have wrapping, return false

#### Parameters

##### lineIndex

`number`

text to split

#### Returns

`boolean`

#### Overrides

[`IText`](/api/classes/itext/).[`isEndOfWrapping`](/api/classes/itext/#isendofwrapping)

***

### isInFrontOf()

> **isInFrontOf**\<`T`\>(`other`): `undefined` \| `boolean`

Defined in: [src/shapes/Object/Object.ts:1714](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L1714)

#### Type Parameters

##### T

`T` *extends* `Textbox`\<`Props`, `SProps`, `EventSpec`\>

#### Parameters

##### other

`T`

object to compare against

#### Returns

`undefined` \| `boolean`

if objects do not share a common ancestor or they are strictly equal it is impossible to determine which is in front of the other; in such cases the function returns `undefined`

#### Inherited from

[`IText`](/api/classes/itext/).[`isInFrontOf`](/api/classes/itext/#isinfrontof)

***

### isNotVisible()

> **isNotVisible**(): `boolean`

Defined in: [src/shapes/Object/Object.ts:637](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L637)

return if the object would be visible in rendering

#### Returns

`boolean`

#### Inherited from

[`IText`](/api/classes/itext/).[`isNotVisible`](/api/classes/itext/#isnotvisible)

***

### isOnScreen()

> **isOnScreen**(): `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:291](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L291)

Checks if object is contained within the canvas with current viewportTransform
the check is done stopping at first point that appears on screen

#### Returns

`boolean`

true if object is fully or partially contained within canvas

#### Inherited from

[`IText`](/api/classes/itext/).[`isOnScreen`](/api/classes/itext/#isonscreen)

***

### isOverlapping()

> **isOverlapping**\<`T`\>(`other`): `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:269](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L269)

#### Type Parameters

##### T

`T` *extends* `ObjectGeometry`\<[`ObjectEvents`](/api/interfaces/objectevents/)\>

#### Parameters

##### other

`T`

#### Returns

`boolean`

#### Inherited from

[`IText`](/api/classes/itext/).[`isOverlapping`](/api/classes/itext/#isoverlapping)

***

### isPartiallyOnScreen()

> **isPartiallyOnScreen**(): `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:321](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L321)

Checks if object is partially contained within the canvas with current viewportTransform

#### Returns

`boolean`

true if object is partially contained within canvas

#### Inherited from

[`IText`](/api/classes/itext/).[`isPartiallyOnScreen`](/api/classes/itext/#ispartiallyonscreen)

***

### isType()

> **isType**(...`types`): `boolean`

Defined in: [src/shapes/Object/Object.ts:1417](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L1417)

Checks if the instance is of any of the specified types.
We use this to filter a list of objects for the `getObjects` function.

For detecting an instance type `instanceOf` is a better check,
but to avoid to make specific classes a dependency of generic code
internally we use this.

This compares both the static class `type` and the instance's own `type` property
against the provided list of types.

#### Parameters

##### types

...`string`[]

A list of type strings to check against.

#### Returns

`boolean`

`true` if the object's type or class type matches any in the list, otherwise `false`.

#### Inherited from

[`IText`](/api/classes/itext/).[`isType`](/api/classes/itext/#istype)

***

### measureLine()

> **measureLine**(`lineIndex`): `object`

Defined in: [src/shapes/Text/Text.ts:871](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L871)

measure a text line measuring all characters.

#### Parameters

##### lineIndex

`number`

line number

#### Returns

`object`

##### numOfSpaces

> **numOfSpaces**: `number` = `0`

##### width

> **width**: `number`

#### Inherited from

[`IText`](/api/classes/itext/).[`measureLine`](/api/classes/itext/#measureline)

***

### missingNewlineOffset()

> **missingNewlineOffset**(`lineIndex`, `skipWrapping?`): `0` \| `1`

Defined in: [src/shapes/Textbox.ts:516](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Textbox.ts#L516)

Detect if a line has a linebreak and so we need to account for it when moving
and counting style.
This is important only for splitByGrapheme at the end of wrapping.
If we are not wrapping the offset is always 1

#### Parameters

##### lineIndex

`number`

##### skipWrapping?

`boolean`

#### Returns

`0` \| `1`

Number

#### Overrides

[`IText`](/api/classes/itext/).[`missingNewlineOffset`](/api/classes/itext/#missingnewlineoffset)

***

### moveCursorDown()

> **moveCursorDown**(`e`): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:457](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L457)

Moves cursor down

#### Parameters

##### e

`KeyboardEvent`

Event object

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`moveCursorDown`](/api/classes/itext/#movecursordown)

***

### moveCursorLeft()

> **moveCursorLeft**(`e`): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:542](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L542)

Moves cursor left

#### Parameters

##### e

`KeyboardEvent`

Event object

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`moveCursorLeft`](/api/classes/itext/#movecursorleft)

***

### moveCursorLeftWithoutShift()

> **moveCursorLeftWithoutShift**(`e`): `boolean`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:594](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L594)

Moves cursor left without keeping selection

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`boolean`

#### Inherited from

[`IText`](/api/classes/itext/).[`moveCursorLeftWithoutShift`](/api/classes/itext/#movecursorleftwithoutshift)

***

### moveCursorLeftWithShift()

> **moveCursorLeftWithShift**(`e`): `undefined` \| `boolean`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:614](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L614)

Moves cursor left while keeping selection

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`undefined` \| `boolean`

#### Inherited from

[`IText`](/api/classes/itext/).[`moveCursorLeftWithShift`](/api/classes/itext/#movecursorleftwithshift)

***

### moveCursorRight()

> **moveCursorRight**(`e`): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:630](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L630)

Moves cursor right

#### Parameters

##### e

`KeyboardEvent`

Event object

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`moveCursorRight`](/api/classes/itext/#movecursorright)

***

### moveCursorRightWithoutShift()

> **moveCursorRightWithoutShift**(`e`): `boolean`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:680](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L680)

Moves cursor right without keeping selection

#### Parameters

##### e

`KeyboardEvent`

Event object

#### Returns

`boolean`

#### Inherited from

[`IText`](/api/classes/itext/).[`moveCursorRightWithoutShift`](/api/classes/itext/#movecursorrightwithoutshift)

***

### moveCursorRightWithShift()

> **moveCursorRightWithShift**(`e`): `undefined` \| `boolean`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:664](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L664)

Moves cursor right while keeping selection

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`undefined` \| `boolean`

#### Inherited from

[`IText`](/api/classes/itext/).[`moveCursorRightWithShift`](/api/classes/itext/#movecursorrightwithshift)

***

### moveCursorUp()

> **moveCursorUp**(`e`): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:471](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L471)

Moves cursor up

#### Parameters

##### e

`KeyboardEvent`

Event object

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`moveCursorUp`](/api/classes/itext/#movecursorup)

***

### moveCursorWithoutShift()

> **moveCursorWithoutShift**(`offset`): `boolean`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:527](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L527)

Moves cursor up without shift

#### Parameters

##### offset

`number`

#### Returns

`boolean`

#### Inherited from

[`IText`](/api/classes/itext/).[`moveCursorWithoutShift`](/api/classes/itext/#movecursorwithoutshift)

***

### moveCursorWithShift()

> **moveCursorWithShift**(`offset`): `boolean`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:510](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L510)

Moves cursor with shift

#### Parameters

##### offset

`number`

#### Returns

`boolean`

#### Inherited from

[`IText`](/api/classes/itext/).[`moveCursorWithShift`](/api/classes/itext/#movecursorwithshift)

***

### needsItsOwnCache()

> **needsItsOwnCache**(): `boolean`

Defined in: [src/shapes/Object/Object.ts:750](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L750)

When returns `true`, force the object to have its own cache, even if it is inside a group
it may be needed when your object behave in a particular way on the cache and always needs
its own isolated canvas to render correctly.
Created to be overridden
since 1.7.12

#### Returns

`boolean`

Boolean

#### Inherited from

[`IText`](/api/classes/itext/).[`needsItsOwnCache`](/api/classes/itext/#needsitsowncache)

***

### off()

#### Call Signature

> **off**\<`K`\>(`eventName`): `void`

Defined in: [src/Observable.ts:122](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Observable.ts#L122)

Unsubscribe all event listeners for eventname.
Do not use this pattern. You could kill internal fabricJS events.
We know we should have protected events for internal flows, but we don't have yet

:::caution[Deprecated]
This API is no longer supported and may be removed in a future release.
:::

##### Type Parameters

###### K

`K` *extends* `string` \| `number` \| `symbol`

##### Parameters

###### eventName

`K`

event name (eg. 'after:render')

##### Returns

`void`

##### Inherited from

[`IText`](/api/classes/itext/).[`off`](/api/classes/itext/#off)

#### Call Signature

> **off**\<`K`\>(`eventName`, `handler`): `void`

Defined in: [src/Observable.ts:128](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Observable.ts#L128)

unsubscribe an event listener

##### Type Parameters

###### K

`K` *extends* `string` \| `number` \| `symbol`

##### Parameters

###### eventName

`K`

event name (eg. 'after:render')

###### handler

`TEventCallback`

event listener to unsubscribe

##### Returns

`void`

##### Inherited from

[`IText`](/api/classes/itext/).[`off`](/api/classes/itext/#off)

#### Call Signature

> **off**(`handlers`): `void`

Defined in: [src/Observable.ts:133](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Observable.ts#L133)

unsubscribe event listeners

##### Parameters

###### handlers

`EventRegistryObject`\<`EventSpec`\>

handlers key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})

##### Returns

`void`

##### Inherited from

[`IText`](/api/classes/itext/).[`off`](/api/classes/itext/#off)

#### Call Signature

> **off**(): `void`

Defined in: [src/Observable.ts:137](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Observable.ts#L137)

unsubscribe all event listeners

##### Returns

`void`

##### Inherited from

[`IText`](/api/classes/itext/).[`off`](/api/classes/itext/#off)

***

### on()

#### Call Signature

> **on**\<`K`, `E`\>(`eventName`, `handler`): `VoidFunction`

Defined in: [src/Observable.ts:23](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Observable.ts#L23)

Observes specified event

##### Type Parameters

###### K

`K` *extends* `string` \| `number` \| `symbol`

###### E

`E`

##### Parameters

###### eventName

`K`

Event name (eg. 'after:render')

###### handler

`TEventCallback`\<`E`\>

Function that receives a notification when an event of the specified type occurs

##### Returns

`VoidFunction`

disposer

##### Alias

on

##### Inherited from

[`IText`](/api/classes/itext/).[`on`](/api/classes/itext/#on)

#### Call Signature

> **on**(`handlers`): `VoidFunction`

Defined in: [src/Observable.ts:27](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Observable.ts#L27)

Observes specified event

##### Parameters

###### handlers

`EventRegistryObject`\<`EventSpec`\>

key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})

##### Returns

`VoidFunction`

disposer

##### Alias

on

##### Inherited from

[`IText`](/api/classes/itext/).[`on`](/api/classes/itext/#on)

***

### once()

#### Call Signature

> **once**\<`K`, `E`\>(`eventName`, `handler`): `VoidFunction`

Defined in: [src/Observable.ts:62](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Observable.ts#L62)

Observes specified event **once**

##### Type Parameters

###### K

`K` *extends* `string` \| `number` \| `symbol`

###### E

`E`

##### Parameters

###### eventName

`K`

Event name (eg. 'after:render')

###### handler

`TEventCallback`\<`E`\>

Function that receives a notification when an event of the specified type occurs

##### Returns

`VoidFunction`

disposer

##### Alias

once

##### Inherited from

[`IText`](/api/classes/itext/).[`once`](/api/classes/itext/#once)

#### Call Signature

> **once**(`handlers`): `VoidFunction`

Defined in: [src/Observable.ts:66](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/Observable.ts#L66)

Observes specified event **once**

##### Parameters

###### handlers

`EventRegistryObject`\<`EventSpec`\>

key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})

##### Returns

`VoidFunction`

disposer

##### Alias

once

##### Inherited from

[`IText`](/api/classes/itext/).[`once`](/api/classes/itext/#once)

***

### onCompositionEnd()

> **onCompositionEnd**(): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:287](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L287)

Composition end

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`onCompositionEnd`](/api/classes/itext/#oncompositionend)

***

### onCompositionStart()

> **onCompositionStart**(): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:280](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L280)

Composition start

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`onCompositionStart`](/api/classes/itext/#oncompositionstart)

***

### onCompositionUpdate()

> **onCompositionUpdate**(`__namedParameters`): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:291](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L291)

#### Parameters

##### \_\_namedParameters

`CompositionEvent`

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`onCompositionUpdate`](/api/classes/itext/#oncompositionupdate)

***

### onDeselect()

> **onDeselect**(`options?`): `boolean`

Defined in: [src/shapes/IText/ITextBehavior.ts:111](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L111)

This callback function is called every time _discardActiveObject or _setActiveObject
try to to deselect this object. If the function returns true, the process is cancelled

#### Parameters

##### options?

###### e?

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

event if the process is generated by an event

###### object?

[`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

next object we are setting as active, and reason why
this is being deselected

#### Returns

`boolean`

#### Inherited from

[`IText`](/api/classes/itext/).[`onDeselect`](/api/classes/itext/#ondeselect)

***

### onDragStart()

> **onDragStart**(`e`): `boolean`

Defined in: [src/shapes/IText/ITextClickBehavior.ts:57](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextClickBehavior.ts#L57)

override this method to control whether instance should/shouldn't become a drag source,

#### Parameters

##### e

`DragEvent`

#### Returns

`boolean`

should handle event

#### See

also DraggableTextDelegate#isActive
To prevent drag and drop between objects both shouldStartDragging and onDragStart should return false

#### Inherited from

[`IText`](/api/classes/itext/).[`onDragStart`](/api/classes/itext/#ondragstart)

***

### onInput()

> **onInput**(`this`, `e`): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:174](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L174)

Handles onInput event

#### Parameters

##### this

`Textbox`\<`Props`, `SProps`, `EventSpec`\> & `object`

##### e

`Event`

Event object

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`onInput`](/api/classes/itext/#oninput)

***

### onKeyDown()

> **onKeyDown**(`e`): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:115](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L115)

Handles keydown event
only used for arrows and combination of modifier keys.

#### Parameters

##### e

`KeyboardEvent`

Event object

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`onKeyDown`](/api/classes/itext/#onkeydown)

***

### onKeyUp()

> **onKeyUp**(`e`): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:151](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L151)

Handles keyup event
We handle KeyUp because ie11 and edge have difficulties copy/pasting
if a copy/cut event fired, keyup is dismissed

#### Parameters

##### e

`KeyboardEvent`

Event object

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`onKeyUp`](/api/classes/itext/#onkeyup)

***

### onSelect()

> **onSelect**(`_options?`): `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:672](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L672)

This callback function is called every time _discardActiveObject or _setActiveObject
try to to select this object. If the function returns true, the process is cancelled

#### Parameters

##### \_options?

options sent from the upper functions

###### e?

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

event if the process is generated by an event

#### Returns

`boolean`

#### Inherited from

[`IText`](/api/classes/itext/).[`onSelect`](/api/classes/itext/#onselect)

***

### paste()

> **paste**(): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:323](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextKeyBehavior.ts#L323)

Pastes text

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`paste`](/api/classes/itext/#paste)

***

### positionByLeftTop()

> **positionByLeftTop**(`p`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:809](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L809)

An utility method to position the object by its left top corner.
Useful to reposition objects since now the default origin is center/center
Places the left/top corner of the object bounding box in p.

#### Parameters

##### p

[`Point`](/api/classes/point/)

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`positionByLeftTop`](/api/classes/itext/#positionbylefttop)

***

### removeChars()

> **removeChars**(`start`, `end`): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:1040](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L1040)

Removes characters from start/end
start/end ar per grapheme position in _text array.

#### Parameters

##### start

`number`

##### end

`number` = `...`

default to start + 1

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`removeChars`](/api/classes/itext/#removechars)

***

### removeStyle()

> **removeStyle**(`property`): `void`

Defined in: [src/shapes/Text/StyledText.ts:162](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/StyledText.ts#L162)

Remove a style property or properties from all individual character styles
in a text object.  Deletes the character style object if it contains no other style
props.  Deletes a line style object if it contains no other character styles.

#### Parameters

##### property

`StylePropertiesType`

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`removeStyle`](/api/classes/itext/#removestyle)

***

### removeStyleFromTo()

> **removeStyleFromTo**(`start`, `end`): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:758](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L758)

remove and reflow a style block from start to end.

#### Parameters

##### start

`number`

linear start position for removal (included in removal)

##### end

`number`

linear end position for removal ( excluded from removal )

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`removeStyleFromTo`](/api/classes/itext/#removestylefromto)

***

### renderCache()

> **renderCache**(`this`, `options?`): `void`

Defined in: [src/shapes/Object/Object.ts:683](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L683)

#### Parameters

##### this

`TCachedFabricObject`

##### options?

`any`

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`renderCache`](/api/classes/itext/#rendercache)

***

### renderCursor()

> **renderCursor**(`ctx`, `boundaries`): `void`

Defined in: [src/shapes/IText/IText.ts:558](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L558)

Renders cursor

#### Parameters

##### ctx

`CanvasRenderingContext2D`

transformed context to draw on

##### boundaries

[`CursorBoundaries`](/api/type-aliases/cursorboundaries/)

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`renderCursor`](/api/classes/itext/#rendercursor)

***

### renderCursorAt()

> **renderCursorAt**(`selectionStart`): `void`

Defined in: [src/shapes/IText/IText.ts:545](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L545)

Renders cursor on context Top, outside the animation cycle, on request
Used for the drag/drop effect.
If contextTop is not available, do nothing.

#### Parameters

##### selectionStart

`number`

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`renderCursorAt`](/api/classes/itext/#rendercursorat)

***

### renderCursorOrSelection()

> **renderCursorOrSelection**(): `void`

Defined in: [src/shapes/IText/IText.ts:375](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L375)

Renders cursor or selection (depending on what exists)
it does on the contextTop. If contextTop is not available, do nothing.

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`renderCursorOrSelection`](/api/classes/itext/#rendercursororselection)

***

### renderDragSourceEffect()

> **renderDragSourceEffect**(): `void`

Defined in: [src/shapes/IText/IText.ts:634](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L634)

Renders drag start text selection

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`renderDragSourceEffect`](/api/classes/itext/#renderdragsourceeffect)

***

### renderDropTargetEffect()

> **renderDropTargetEffect**(`e`): `void`

Defined in: [src/shapes/IText/IText.ts:644](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L644)

Override to customize drag and drop behavior
render a specific effect when an object is the target of a drag event
used to show that the underly object can receive a drop, or to show how the
object will change when dropping. example: show the cursor where the text is about to be dropped

#### Parameters

##### e

`DragEvent`

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`renderDropTargetEffect`](/api/classes/itext/#renderdroptargeteffect)

***

### renderSelection()

> **renderSelection**(`ctx`, `boundaries`): `void`

Defined in: [src/shapes/IText/IText.ts:619](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L619)

Renders text selection

#### Parameters

##### ctx

`CanvasRenderingContext2D`

transformed context to draw on

##### boundaries

[`CursorBoundaries`](/api/type-aliases/cursorboundaries/)

Object with left/top/leftOffset/topOffset

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`renderSelection`](/api/classes/itext/#renderselection)

***

### restartCursorIfNeeded()

> **restartCursorIfNeeded**(): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:206](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L206)

Restart tue cursor animation if either is in complete state ( between animations )
or if it never started before

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`restartCursorIfNeeded`](/api/classes/itext/#restartcursorifneeded)

***

### rotate()

> **rotate**(`angle`): `void`

Defined in: [src/shapes/Object/Object.ts:1445](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L1445)

Sets "angle" of an instance with centered rotation

#### Parameters

##### angle

[`TDegree`](/api/type-aliases/tdegree/)

Angle value (in degrees)

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`rotate`](/api/classes/itext/#rotate)

***

### scale()

> **scale**(`value`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:370](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L370)

Scales an object (equally by x and y)

#### Parameters

##### value

`number`

Scale factor

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`scale`](/api/classes/itext/#scale)

***

### scaleToHeight()

> **scaleToHeight**(`value`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:393](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L393)

Scales an object to a given height, with respect to bounding box (scaling by x/y equally)

#### Parameters

##### value

`number`

New height value

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`scaleToHeight`](/api/classes/itext/#scaletoheight)

***

### scaleToWidth()

> **scaleToWidth**(`value`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:381](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L381)

Scales an object to a given width, with respect to bounding box (scaling by x/y equally)

#### Parameters

##### value

`number`

New width value

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`scaleToWidth`](/api/classes/itext/#scaletowidth)

***

### searchWordBoundary()

> **searchWordBoundary**(`selectionStart`, `direction`): `number`

Defined in: [src/shapes/IText/ITextBehavior.ts:331](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L331)

Finds index corresponding to beginning or end of a word

#### Parameters

##### selectionStart

`number`

Index of a character

##### direction

1 or -1

`-1` | `1`

#### Returns

`number`

Index of the beginning or end of a word

#### Inherited from

[`IText`](/api/classes/itext/).[`searchWordBoundary`](/api/classes/itext/#searchwordboundary)

***

### selectAll()

> **selectAll**(): `Textbox`\<`Props`, `SProps`, `EventSpec`\>

Defined in: [src/shapes/IText/ITextBehavior.ts:219](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L219)

Selects entire text

#### Returns

`Textbox`\<`Props`, `SProps`, `EventSpec`\>

#### Inherited from

[`IText`](/api/classes/itext/).[`selectAll`](/api/classes/itext/#selectall)

***

### selectLine()

> **selectLine**(`selectionStart?`): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:378](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L378)

Selects the line that contains selectionStart

#### Parameters

##### selectionStart?

`number`

Index of a character

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`selectLine`](/api/classes/itext/#selectline)

***

### selectWord()

> **selectWord**(`selectionStart?`): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:356](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L356)

Selects the word that contains the char at index selectionStart

#### Parameters

##### selectionStart?

`number`

Index of a character

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`selectWord`](/api/classes/itext/#selectword)

***

### set()

> **set**(`key`, `value?`): `Textbox`\<`Props`, `SProps`, `EventSpec`\>

Defined in: [src/shapes/Text/Text.ts:1780](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L1780)

Sets property to a given value. When changing position/dimension -related properties (left, top, scale, angle, etc.) `set` does not update position of object's borders/controls. If you need to update those, call `setCoords()`.

#### Parameters

##### key

`any`

Property name or object (if object, iterate over the object properties)

##### value?

`any`

Property value (if function, the value is passed into it and its return value is used as a new one)

#### Returns

`Textbox`\<`Props`, `SProps`, `EventSpec`\>

#### Inherited from

[`IText`](/api/classes/itext/).[`set`](/api/classes/itext/#set)

***

### setControlsVisibility()

> **setControlsVisibility**(`options?`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:611](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L611)

Sets the visibility state of object controls, this is just a bulk option for setControlVisible;

#### Parameters

##### options?

`Record`\<`string`, `boolean`\> = `{}`

with an optional key per control
example: {Boolean} [options.bl] true to enable the bottom-left control, false to disable it

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`setControlsVisibility`](/api/classes/itext/#setcontrolsvisibility)

***

### setControlVisible()

> **setControlVisible**(`controlKey`, `visible`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:599](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L599)

Sets the visibility of the specified control.
please do not use.

#### Parameters

##### controlKey

`string`

The key of the control. Possible values are 'tl', 'tr', 'br', 'bl', 'ml', 'mt', 'mr', 'mb', 'mtr'.
but since the control api allow for any control name, can be any string.

##### visible

`boolean`

true to set the specified control visible, false otherwise

#### Returns

`void`

#### Todo

discuss this overlap of priority here with the team. Andrea Bogazzi for details

#### Inherited from

[`IText`](/api/classes/itext/).[`setControlVisible`](/api/classes/itext/#setcontrolvisible)

***

### setCoords()

> **setCoords**(): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:343](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L343)

set controls' coordinates as well
See [https://github.com/fabricjs/fabric.js/wiki/When-to-call-setCoords](https://github.com/fabricjs/fabric.js/wiki/When-to-call-setCoords) and [https://fabric5.fabricjs.com/fabric-gotchas](https://fabric5.fabricjs.com/fabric-gotchas)

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`setCoords`](/api/classes/itext/#setcoords)

***

### setCursorByClick()

> **setCursorByClick**(`e`): `void`

Defined in: [src/shapes/IText/ITextClickBehavior.ts:172](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextClickBehavior.ts#L172)

Changes cursor location in a text depending on passed pointer (x/y) object

#### Parameters

##### e

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

Event object

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`setCursorByClick`](/api/classes/itext/#setcursorbyclick)

***

### setOnGroup()

> **setOnGroup**(): `void`

Defined in: [src/shapes/Object/Object.ts:1473](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L1473)

This callback function is called by the parent group of an object every
time a non-delegated property changes on the group. It is passed the key
and value as parameters. Not adding in this function's signature to avoid
Travis build error about unused variables.

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`setOnGroup`](/api/classes/itext/#setongroup)

***

### setPathInfo()

> **setPathInfo**(): `void`

Defined in: [src/shapes/Text/Text.ts:451](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L451)

If text has a path, it will add the extra information needed
for path and text calculations

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`setPathInfo`](/api/classes/itext/#setpathinfo)

***

### setPositionByOrigin()

> **setPositionByOrigin**(`pos`, `originX`, `originY`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:787](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L787)

Sets the position of the object taking into consideration the object's origin

#### Parameters

##### pos

[`Point`](/api/classes/point/)

The new position of the object

##### originX

[`TOriginX`](/api/type-aliases/toriginx/)

Horizontal origin: 'left', 'center' or 'right'

##### originY

[`TOriginY`](/api/type-aliases/toriginy/)

Vertical origin: 'top', 'center' or 'bottom'

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`setPositionByOrigin`](/api/classes/itext/#setpositionbyorigin)

***

### setRelativeX()

> **setRelativeX**(`value`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:123](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L123)

#### Parameters

##### value

`number`

x position according to object's originX property in parent's coordinate plane\
if parent is canvas then this method is identical to [setX](/api/classes/textbox/#setx)

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`setRelativeX`](/api/classes/itext/#setrelativex)

***

### setRelativeXY()

> **setRelativeXY**(`point`, `originX?`, `originY?`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:186](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L186)

As [setXY](/api/classes/textbox/#setxy), but in current parent's coordinate plane (the current group if any or the canvas)

#### Parameters

##### point

[`Point`](/api/classes/point/)

position according to object's originX originY properties in parent's coordinate plane

##### originX?

[`TOriginX`](/api/type-aliases/toriginx/) = `...`

Horizontal origin: 'left', 'center' or 'right'

##### originY?

[`TOriginY`](/api/type-aliases/toriginy/) = `...`

Vertical origin: 'top', 'center' or 'bottom'

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`setRelativeXY`](/api/classes/itext/#setrelativexy)

***

### setRelativeY()

> **setRelativeY**(`value`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:139](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L139)

#### Parameters

##### value

`number`

y position according to object's originY property in parent's coordinate plane\
if parent is canvas then this property is identical to [setY](/api/classes/textbox/#sety)

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`setRelativeY`](/api/classes/itext/#setrelativey)

***

### setSelectionEnd()

> **setSelectionEnd**(`index`): `void`

Defined in: [src/shapes/IText/IText.ts:263](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L263)

Sets selection end (right boundary of a selection)

#### Parameters

##### index

`number`

Index to set selection end to

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`setSelectionEnd`](/api/classes/itext/#setselectionend)

***

### setSelectionStart()

> **setSelectionStart**(`index`): `void`

Defined in: [src/shapes/IText/IText.ts:254](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L254)

Sets selection start (left boundary of a selection)

#### Parameters

##### index

`number`

Index to set selection start to

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`setSelectionStart`](/api/classes/itext/#setselectionstart)

***

### setSelectionStartEndWithShift()

> **setSelectionStartEndWithShift**(`start`, `end`, `newSelection`): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:1089](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L1089)

Set the selectionStart and selectionEnd according to the new position of cursor
mimic the key - mouse navigation when shift is pressed.

#### Parameters

##### start

`number`

##### end

`number`

##### newSelection

`number`

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`setSelectionStartEndWithShift`](/api/classes/itext/#setselectionstartendwithshift)

***

### setSelectionStyles()

> **setSelectionStyles**(`styles?`, `startIndex?`, `endIndex?`): `void`

Defined in: [src/shapes/IText/IText.ts:327](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L327)

Sets style of a current selection, if no selection exist, do not set anything.

#### Parameters

##### styles?

`object`

Styles object

##### startIndex?

`number` = `...`

Start index to get styles at

##### endIndex?

`number` = `...`

End index to get styles at, if not specified selectionEnd or startIndex + 1

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`setSelectionStyles`](/api/classes/itext/#setselectionstyles)

***

### setSubscript()

> **setSubscript**(`start`, `end`): `void`

Defined in: [src/shapes/Text/Text.ts:1423](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L1423)

Turns the character into an 'inferior figure' (i.e. 'subscript')

#### Parameters

##### start

`number`

selection start

##### end

`number`

selection end

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`setSubscript`](/api/classes/itext/#setsubscript)

***

### setSuperscript()

> **setSuperscript**(`start`, `end`): `void`

Defined in: [src/shapes/Text/Text.ts:1414](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L1414)

Turns the character into a 'superior figure' (i.e. 'superscript')

#### Parameters

##### start

`number`

selection start

##### end

`number`

selection end

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`setSuperscript`](/api/classes/itext/#setsuperscript)

***

### setX()

> **setX**(`value`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:93](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L93)

#### Parameters

##### value

`number`

x position according to object's originX property in canvas coordinate plane

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`setX`](/api/classes/itext/#setx)

***

### setXY()

> **setXY**(`point`, `originX?`, `originY?`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:163](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L163)

Set an object position to a particular point, the point is intended in absolute ( canvas ) coordinate.
You can specify originX and originY values,
that otherwise are the object's current values.

#### Parameters

##### point

[`Point`](/api/classes/point/)

position in scene coordinate plane

##### originX?

[`TOriginX`](/api/type-aliases/toriginx/)

Horizontal origin: 'left', 'center' or 'right'

##### originY?

[`TOriginY`](/api/type-aliases/toriginy/)

Vertical origin: 'top', 'center' or 'bottom'

#### Returns

`void`

#### Example

```ts
object.setXY(new Point(5, 5), 'left', 'bottom').
```

#### Inherited from

[`IText`](/api/classes/itext/).[`setXY`](/api/classes/itext/#setxy)

***

### setY()

> **setY**(`value`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:107](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L107)

#### Parameters

##### value

`number`

y position according to object's originY property in canvas coordinate plane

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`setY`](/api/classes/itext/#sety)

***

### shiftLineStyles()

> **shiftLineStyles**(`lineIndex`, `offset`): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:820](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L820)

Shifts line styles up or down

#### Parameters

##### lineIndex

`number`

Index of a line

##### offset

`number`

Can any number?

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`shiftLineStyles`](/api/classes/itext/#shiftlinestyles)

***

### shouldCache()

> **shouldCache**(): `boolean`

Defined in: [src/shapes/Object/Object.ts:775](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L775)

Decide if the object should cache or not. Create its own cache level
objectCaching is a global flag, wins over everything
needsItsOwnCache should be used when the object drawing method requires
a cache step.
Generally you do not cache objects in groups because the group outside is cached.
Read as: cache if is needed, or if the feature is enabled but we are not already caching.

#### Returns

`boolean`

#### Inherited from

[`IText`](/api/classes/itext/).[`shouldCache`](/api/classes/itext/#shouldcache)

***

### shouldStartDragging()

> **shouldStartDragging**(): `boolean`

Defined in: [src/shapes/IText/ITextClickBehavior.ts:47](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextClickBehavior.ts#L47)

If this method returns true a mouse move operation over a text selection
will not prevent the native mouse event allowing the browser to start a drag operation.
shouldStartDragging can be read 'do not prevent default for mouse move event'
To prevent drag and drop between objects both shouldStartDragging and onDragStart should return false

#### Returns

`boolean`

#### Inherited from

[`IText`](/api/classes/itext/).[`shouldStartDragging`](/api/classes/itext/#shouldstartdragging)

***

### strokeBorders()

> **strokeBorders**(`ctx`, `size`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:399](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/InteractiveObject.ts#L399)

override this function in order to customize the drawing of the control box, e.g. rounded corners, different border style.

#### Parameters

##### ctx

`CanvasRenderingContext2D`

ctx is rotated and translated so that (0,0) is at object's center

##### size

[`Point`](/api/classes/point/)

the control box size used

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`strokeBorders`](/api/classes/itext/#strokeborders)

***

### styleHas()

> **styleHas**(`property`, `lineIndex`): `boolean`

Defined in: [src/shapes/Textbox.ts:191](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Textbox.ts#L191)

Returns true if object has a style property or has it on a specified line

#### Parameters

##### property

`StylePropertiesType`

##### lineIndex

`number`

#### Returns

`boolean`

#### Overrides

[`IText`](/api/classes/itext/).[`styleHas`](/api/classes/itext/#stylehas)

***

### toBlob()

> **toBlob**(`options`): `Promise`\<`null` \| `Blob`\>

Defined in: [src/shapes/Object/Object.ts:1395](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L1395)

#### Parameters

##### options

`toDataURLOptions` = `{}`

#### Returns

`Promise`\<`null` \| `Blob`\>

#### Inherited from

[`IText`](/api/classes/itext/).[`toBlob`](/api/classes/itext/#toblob)

***

### toCanvasElement()

> **toCanvasElement**(`options?`): `HTMLCanvasElement`

Defined in: [src/shapes/IText/IText.ts:363](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/IText.ts#L363)

block cursor/selection logic while rendering the exported canvas

#### Parameters

##### options?

`ObjectToCanvasElementOptions`

#### Returns

`HTMLCanvasElement`

#### Todo

this workaround should be replaced with a more robust solution

#### Inherited from

[`IText`](/api/classes/itext/).[`toCanvasElement`](/api/classes/itext/#tocanvaselement)

***

### toClipPathSVG()

> **toClipPathSVG**(`this`, `reviver?`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:144](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/FabricObjectSVGExportMixin.ts#L144)

Returns svg clipPath representation of an instance

#### Parameters

##### this

`FabricObjectSVGExportMixin` & [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

##### reviver?

[`TSVGReviver`](/api/type-aliases/tsvgreviver/)

Method for further parsing of svg representation.

#### Returns

`string`

svg representation of an instance

#### Inherited from

[`IText`](/api/classes/itext/).[`toClipPathSVG`](/api/classes/itext/#toclippathsvg)

***

### toDatalessObject()

> **toDatalessObject**(`propertiesToInclude?`): `any`

Defined in: [src/shapes/Object/Object.ts:1848](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L1848)

Returns (dataless) object representation of an instance

#### Parameters

##### propertiesToInclude?

`any`[]

Any properties that you might want to additionally include in the output

#### Returns

`any`

Object representation of an instance

#### Inherited from

[`IText`](/api/classes/itext/).[`toDatalessObject`](/api/classes/itext/#todatalessobject)

***

### toDataURL()

> **toDataURL**(`options`): `string`

Defined in: [src/shapes/Object/Object.ts:1388](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L1388)

Converts an object into a data-url-like string

#### Parameters

##### options

`toDataURLOptions` = `{}`

Options object

#### Returns

`string`

Returns a data: URL containing a representation of the object in the format specified by options.format

#### Inherited from

[`IText`](/api/classes/itext/).[`toDataURL`](/api/classes/itext/#todataurl)

***

### toggle()

> **toggle**(`property`): `Textbox`\<`Props`, `SProps`, `EventSpec`\>

Defined in: [src/CommonMethods.ts:46](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/CommonMethods.ts#L46)

Toggles specified property from `true` to `false` or from `false` to `true`

#### Parameters

##### property

`string`

Property to toggle

#### Returns

`Textbox`\<`Props`, `SProps`, `EventSpec`\>

#### Inherited from

[`IText`](/api/classes/itext/).[`toggle`](/api/classes/itext/#toggle)

***

### toJSON()

> **toJSON**(): `any`

Defined in: [src/shapes/Object/Object.ts:1436](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L1436)

Returns a JSON representation of an instance

#### Returns

`any`

JSON

#### Inherited from

[`IText`](/api/classes/itext/).[`toJSON`](/api/classes/itext/#tojson)

***

### toObject()

> **toObject**\<`T`, `K`\>(`propertiesToInclude?`): `Pick`\<`T`, `K`\> & `SProps`

Defined in: [src/shapes/Textbox.ts:567](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Textbox.ts#L567)

Returns object representation of an instance

#### Type Parameters

##### T

`T` *extends* `Omit`\<`Props` & [`TClassProperties`](/api/type-aliases/tclassproperties/)\<`Textbox`\<`Props`, `SProps`, `EventSpec`\>\>, keyof `SProps`\>

##### K

`K` *extends* `string` \| `number` \| `symbol` = `never`

#### Parameters

##### propertiesToInclude?

`K`[] = `[]`

Any properties that you might want to additionally include in the output

#### Returns

`Pick`\<`T`, `K`\> & `SProps`

object representation of an instance

#### Overrides

[`IText`](/api/classes/itext/).[`toObject`](/api/classes/itext/#toobject)

***

### toString()

> **toString**(): `string`

Defined in: [src/shapes/Text/Text.ts:587](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L587)

Returns string representation of an instance

#### Returns

`string`

String representation of text object

#### Inherited from

[`IText`](/api/classes/itext/).[`toString`](/api/classes/itext/#tostring)

***

### toSVG()

> **toSVG**(`this`, `reviver?`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:130](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/FabricObjectSVGExportMixin.ts#L130)

Returns svg representation of an instance

#### Parameters

##### this

`FabricObjectSVGExportMixin` & [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

##### reviver?

[`TSVGReviver`](/api/type-aliases/tsvgreviver/)

Method for further parsing of svg representation.

#### Returns

`string`

svg representation of an instance

#### Inherited from

[`IText`](/api/classes/itext/).[`toSVG`](/api/classes/itext/#tosvg)

***

### transform()

> **transform**(`ctx`): `void`

Defined in: [src/shapes/Object/Object.ts:517](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L517)

Transforms context when rendering an object

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Context

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`transform`](/api/classes/itext/#transform)

***

### transformMatrixKey()

> **transformMatrixKey**(`skipGroup`): `number`[]

Defined in: [src/shapes/Object/ObjectGeometry.ts:453](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L453)

#### Parameters

##### skipGroup

`boolean` = `false`

#### Returns

`number`[]

#### Inherited from

[`IText`](/api/classes/itext/).[`transformMatrixKey`](/api/classes/itext/#transformmatrixkey)

***

### translateToCenterPoint()

> **translateToCenterPoint**(`point`, `originX`, `originY`): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:683](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L683)

Translates the coordinates from origin to center coordinates (based on the object's dimensions)

#### Parameters

##### point

[`Point`](/api/classes/point/)

The point which corresponds to the originX and originY params

##### originX

[`TOriginX`](/api/type-aliases/toriginx/)

Horizontal origin: 'left', 'center' or 'right'

##### originY

[`TOriginY`](/api/type-aliases/toriginy/)

Vertical origin: 'top', 'center' or 'bottom'

#### Returns

[`Point`](/api/classes/point/)

#### Inherited from

[`IText`](/api/classes/itext/).[`translateToCenterPoint`](/api/classes/itext/#translatetocenterpoint)

***

### translateToGivenOrigin()

> **translateToGivenOrigin**(`point`, `fromOriginX`, `fromOriginY`, `toOriginX`, `toOriginY`): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:655](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L655)

Translates the coordinates from a set of origin to another (based on the object's dimensions)

#### Parameters

##### point

[`Point`](/api/classes/point/)

The point which corresponds to the originX and originY params

##### fromOriginX

[`TOriginX`](/api/type-aliases/toriginx/)

Horizontal origin: 'left', 'center' or 'right'

##### fromOriginY

[`TOriginY`](/api/type-aliases/toriginy/)

Vertical origin: 'top', 'center' or 'bottom'

##### toOriginX

[`TOriginX`](/api/type-aliases/toriginx/)

Horizontal origin: 'left', 'center' or 'right'

##### toOriginY

[`TOriginY`](/api/type-aliases/toriginy/)

Vertical origin: 'top', 'center' or 'bottom'

#### Returns

[`Point`](/api/classes/point/)

#### Inherited from

[`IText`](/api/classes/itext/).[`translateToGivenOrigin`](/api/classes/itext/#translatetogivenorigin)

***

### translateToOriginPoint()

> **translateToOriginPoint**(`center`, `originX`, `originY`): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:711](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/ObjectGeometry.ts#L711)

Translates the coordinates from center to origin coordinates (based on the object's dimensions)

#### Parameters

##### center

[`Point`](/api/classes/point/)

The point which corresponds to center of the object

##### originX

[`TOriginX`](/api/type-aliases/toriginx/)

Horizontal origin: 'left', 'center' or 'right'

##### originY

[`TOriginY`](/api/type-aliases/toriginy/)

Vertical origin: 'top', 'center' or 'bottom'

#### Returns

[`Point`](/api/classes/point/)

#### Inherited from

[`IText`](/api/classes/itext/).[`translateToOriginPoint`](/api/classes/itext/#translatetooriginpoint)

***

### tripleClickHandler()

> **tripleClickHandler**(`options`): `void`

Defined in: [src/shapes/IText/ITextClickBehavior.ts:82](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextClickBehavior.ts#L82)

Default handler for triple click, select a line

#### Parameters

##### options

[`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`tripleClickHandler`](/api/classes/itext/#tripleclickhandler)

***

### updateSelectionOnMouseMove()

> **updateSelectionOnMouseMove**(`e`): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:433](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/IText/ITextBehavior.ts#L433)

called by [Canvas#textEditingManager](/api/classes/canvas/#texteditingmanager)

#### Parameters

##### e

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

#### Returns

`void`

#### Inherited from

[`IText`](/api/classes/itext/).[`updateSelectionOnMouseMove`](/api/classes/itext/#updateselectiononmousemove)

***

### ~~willDrawShadow()~~

> **willDrawShadow**(): `boolean`

Defined in: [src/shapes/Object/Object.ts:788](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L788)

Check if this object will cast a shadow with an offset.
used by Group.shouldCache to know if child has a shadow recursively

:::caution[Deprecated]
This API is no longer supported and may be removed in a future release.
:::

#### Returns

`boolean`

#### Inherited from

[`IText`](/api/classes/itext/).[`willDrawShadow`](/api/classes/itext/#willdrawshadow)

***

### wordSplit()

> **wordSplit**(`value`): `string`[]

Defined in: [src/shapes/Textbox.ts:410](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Textbox.ts#L410)

Override this method to customize word splitting
Use with [Textbox#\_measureWord](/api/classes/textbox/#_measureword)

#### Parameters

##### value

`string`

#### Returns

`string`[]

array of words

***

### \_fromObject()

> `static` **\_fromObject**\<`S`\>(`__namedParameters`, `__namedParameters`): `Promise`\<`S`\>

Defined in: [src/shapes/Object/Object.ts:1901](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Object/Object.ts#L1901)

#### Type Parameters

##### S

`S` *extends* [`BaseFabricObject`](/api/classes/basefabricobject/)\<`Partial`\<`ObjectProps`\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

#### Parameters

##### \_\_namedParameters

`Record`\<`string`, `unknown`\>

##### \_\_namedParameters

[`Abortable`](/api/type-aliases/abortable/) & `object` = `{}`

#### Returns

`Promise`\<`S`\>

#### Inherited from

[`IText`](/api/classes/itext/).[`_fromObject`](/api/classes/itext/#_fromobject)

***

### createControls()

> `static` **createControls**(): `object`

Defined in: [src/shapes/Textbox.ts:117](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Textbox.ts#L117)

Creates the default control object.
If you prefer to have on instance of controls shared among all objects
make this function return an empty object and add controls to the ownDefaults object

#### Returns

`object`

##### controls

> **controls**: `Record`\<`string`, [`Control`](/api/classes/control/)\>

#### Overrides

[`IText`](/api/classes/itext/).[`createControls`](/api/classes/itext/#createcontrols)

***

### fromElement()

> `static` **fromElement**(`element`, `options?`, `cssRules?`): `Promise`\<[`FabricText`](/api/classes/fabrictext/)\<\{ `fontSize`: `number`; `left`: `number`; `linethrough`: `boolean`; `overline`: `boolean`; `signal?`: `AbortSignal`; `strokeWidth`: `number`; `top`: `number`; `underline`: `boolean`; \}, [`SerializedTextProps`](/api/interfaces/serializedtextprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>\>

Defined in: [src/shapes/Text/Text.ts:1860](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L1860)

Returns FabricText instance from an SVG element (<b>not yet implemented</b>)

#### Parameters

##### element

Element to parse

`HTMLElement` | `SVGElement`

##### options?

[`Abortable`](/api/type-aliases/abortable/)

Options object

##### cssRules?

`CSSRules`

#### Returns

`Promise`\<[`FabricText`](/api/classes/fabrictext/)\<\{ `fontSize`: `number`; `left`: `number`; `linethrough`: `boolean`; `overline`: `boolean`; `signal?`: `AbortSignal`; `strokeWidth`: `number`; `top`: `number`; `underline`: `boolean`; \}, [`SerializedTextProps`](/api/interfaces/serializedtextprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>\>

#### Inherited from

[`IText`](/api/classes/itext/).[`fromElement`](/api/classes/itext/#fromelement)

***

### fromObject()

> `static` **fromObject**\<`T`, `S`\>(`object`): `Promise`\<`S`\>

Defined in: [src/shapes/Text/Text.ts:1935](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Text/Text.ts#L1935)

Returns FabricText instance from an object representation

#### Type Parameters

##### T

`T` *extends* [`TOptions`](/api/type-aliases/toptions/)\<[`SerializedTextProps`](/api/interfaces/serializedtextprops/)\>

##### S

`S` *extends* [`FabricText`](/api/classes/fabrictext/)\<`Partial`\<[`TextProps`](/api/interfaces/textprops/)\>, [`SerializedTextProps`](/api/interfaces/serializedtextprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

#### Parameters

##### object

`T`

plain js Object to create an instance from

#### Returns

`Promise`\<`S`\>

#### Inherited from

[`IText`](/api/classes/itext/).[`fromObject`](/api/classes/itext/#fromobject)

***

### getDefaults()

> `static` **getDefaults**(): `Record`\<`string`, `any`\>

Defined in: [src/shapes/Textbox.ts:96](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/shapes/Textbox.ts#L96)

#### Returns

`Record`\<`string`, `any`\>

#### Overrides

[`IText`](/api/classes/itext/).[`getDefaults`](/api/classes/itext/#getdefaults)
