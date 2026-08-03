---
editUrl: false
next: false
prev: false
title: "IText"
---

Defined in: [src/shapes/IText/IText.ts:122](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L122)

## Fires

changed

## Fires

selection:changed

## Fires

editing:entered

## Fires

editing:exited

## Fires

dragstart

## Fires

drag drag event firing on the drag source

## Fires

dragend

## Fires

copy

## Fires

cut

## Fires

paste

#### Supported key combinations
```
  Move cursor:                    left, right, up, down
  Select character:               shift + left, shift + right
  Select text vertically:         shift + up, shift + down
  Move cursor by word:            alt + left, alt + right
  Select words:                   shift + alt + left, shift + alt + right
  Move cursor to line start/end:  cmd + left, cmd + right or home, end
  Select till start/end of line:  cmd + shift + left, cmd + shift + right or shift + home, shift + end
  Jump to start/end of text:      cmd + up, cmd + down
  Select till start/end of text:  cmd + shift + up, cmd + shift + down or shift + pgUp, shift + pgDown
  Delete character:               backspace
  Delete word:                    alt + backspace
  Delete line:                    cmd + backspace
  Forward delete:                 delete
  Copy text:                      ctrl/cmd + c
  Paste text:                     ctrl/cmd + v
  Cut text:                       ctrl/cmd + x
  Select entire text:             ctrl/cmd + a
  Quit editing                    tab or esc
```

#### Supported mouse/touch combination
```
  Position cursor:                click/touch
  Create selection:               click/touch & drag
  Create selection:               click & shift + click
  Select word:                    double click
  Select line:                    triple click
```

## Extends

- `ITextClickBehavior`\<`Props`, `SProps`, `EventSpec`\>

## Extended by

- [`Textbox`](/api/classes/textbox/)

## Type Parameters

### Props

`Props` *extends* [`TOptions`](/api/type-aliases/toptions/)\<[`ITextProps`](/api/interfaces/itextprops/)\> = `Partial`\<[`ITextProps`](/api/interfaces/itextprops/)\>

### SProps

`SProps` *extends* [`SerializedITextProps`](/api/interfaces/serializeditextprops/) = [`SerializedITextProps`](/api/interfaces/serializeditextprops/)

### EventSpec

`EventSpec` *extends* [`ITextEvents`](/api/type-aliases/itextevents/) = [`ITextEvents`](/api/type-aliases/itextevents/)

## Implements

- `UniqueITextProps`

## Constructors

### Constructor

> **new IText**\<`Props`, `SProps`, `EventSpec`\>(`text`, `options?`): `IText`\<`Props`, `SProps`, `EventSpec`\>

Defined in: [src/shapes/IText/IText.ts:224](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L224)

Constructor

#### Parameters

##### text

`string`

Text string

##### options?

`Props`

Options object

#### Returns

`IText`\<`Props`, `SProps`, `EventSpec`\>

#### Overrides

`ITextClickBehavior<Props, SProps, EventSpec>.constructor`

## Properties

### \_\_corner?

> `optional` **\_\_corner**: `string`

Defined in: [src/shapes/Object/InteractiveObject.ts:108](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L108)

keeps the value of the last hovered corner during mouse move.
0 is no corner, or 'mt', 'ml', 'mtr' etc..
It should be private, but there is no harm in using it as
a read-only property.
this isn't cleaned automatically. Non selected objects may have wrong values

#### Inherited from

`ITextClickBehavior.__corner`

***

### \_\_lineHeights

> **\_\_lineHeights**: `number`[]

Defined in: [src/shapes/Text/Text.ts:426](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L426)

#### Inherited from

`ITextClickBehavior.__lineHeights`

***

### \_\_lineWidths

> **\_\_lineWidths**: `number`[]

Defined in: [src/shapes/Text/Text.ts:427](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L427)

#### Inherited from

`ITextClickBehavior.__lineWidths`

***

### \_controlsVisibility

> **\_controlsVisibility**: `Record`\<`string`, `boolean`\>

Defined in: [src/shapes/Object/InteractiveObject.ts:115](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L115)

a map of control visibility for this object.
this was left when controls were introduced to not break the api too much
this takes priority over the generic control visibility

#### Inherited from

`ITextClickBehavior._controlsVisibility`

***

### \_fontSizeMult

> **\_fontSizeMult**: `number`

Defined in: [src/shapes/Text/Text.ts:361](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L361)

Text Line proportion to font Size (in pixels)

#### Inherited from

`ITextClickBehavior._fontSizeMult`

***

### \_scaling?

> `optional` **\_scaling**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:137](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L137)

A boolean used from the gesture module to keep tracking of a scaling
action when there is no scaling transform in place.
This is an edge case and is used twice in all codebase.
Probably added to keep track of some performance issues

#### TODO

use git blame to investigate why it was added
DON'T USE IT. WE WILL TRY TO REMOVE IT

#### Inherited from

`ITextClickBehavior._scaling`

***

### \_text

> **\_text**: `string`[]

Defined in: [src/shapes/Text/Text.ts:424](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L424)

#### Inherited from

`ITextClickBehavior._text`

***

### \_textLines

> **\_textLines**: `string`[][]

Defined in: [src/shapes/Text/Text.ts:421](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L421)

same as textlines, but each line is an array of graphemes as split by splitByGrapheme

#### Inherited from

`ITextClickBehavior._textLines`

***

### \_unwrappedTextLines

> **\_unwrappedTextLines**: `string`[][]

Defined in: [src/shapes/Text/Text.ts:423](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L423)

#### Inherited from

`ITextClickBehavior._unwrappedTextLines`

***

### absolutePositioned

> **absolutePositioned**: `boolean`

Defined in: [src/shapes/Object/Object.ts:215](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L215)

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

`ITextClickBehavior.absolutePositioned`

***

### aCoords

> **aCoords**: [`TCornerPoint`](/api/type-aliases/tcornerpoint/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:65](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L65)

Describe object's corner position in scene coordinates.
The coordinates are derived from the following:
left, top, width, height, scaleX, scaleY, skewX, skewY, angle, strokeWidth.
The coordinates do not depend on viewport changes.
The coordinates get updated with [setCoords](/api/classes/itext/#setcoords).
You can calculate them without updating with [()](/api/classes/itext/#calcacoords)

#### Inherited from

`ITextClickBehavior.aCoords`

***

### angle

> **angle**: [`TDegree`](/api/type-aliases/tdegree/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:588](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L588)

Angle of rotation of an object (in degrees)

#### Default

```ts
0
```

#### Inherited from

`ITextClickBehavior.angle`

***

### backgroundColor

> **backgroundColor**: `string`

Defined in: [src/shapes/Object/Object.ts:202](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L202)

Background color of an object.
takes css colors https://www.w3.org/TR/css-color-3/

#### Inherited from

`ITextClickBehavior.backgroundColor`

***

### borderColor

> **borderColor**: `string`

Defined in: [src/shapes/Object/InteractiveObject.ts:77](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L77)

Color of controlling borders of an object (when it's active)

#### Default

```ts
rgb(178,204,255)
```

#### Inherited from

`ITextClickBehavior.borderColor`

***

### borderDashArray

> **borderDashArray**: `null` \| `number`[]

Defined in: [src/shapes/Object/InteractiveObject.ts:78](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L78)

Array specifying dash pattern of an object's borders (hasBorder must be true)

#### Since

1.6.2

#### Inherited from

`ITextClickBehavior.borderDashArray`

***

### borderOpacityWhenMoving

> **borderOpacityWhenMoving**: `number`

Defined in: [src/shapes/Object/InteractiveObject.ts:79](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L79)

Opacity of object's controlling borders when object is active and moving

#### Default

```ts
0.4
```

#### Inherited from

`ITextClickBehavior.borderOpacityWhenMoving`

***

### borderScaleFactor

> **borderScaleFactor**: `number`

Defined in: [src/shapes/Object/InteractiveObject.ts:80](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L80)

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

`ITextClickBehavior.borderScaleFactor`

***

### caching

> **caching**: `boolean`

Defined in: [src/shapes/IText/IText.ts:203](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L203)

Indicates whether internal text char widths can be cached

***

### centeredRotation

> **centeredRotation**: `boolean`

Defined in: [src/shapes/Object/Object.ts:216](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L216)

When `true` the object will rotate on its center.
When `false` will rotate around the origin point defined by originX and originY.
The value of this property is IGNORED during a transform if the canvas has already
centeredRotation set to `true`
The object method `rotate` will always consider this property and never the canvas's one.

#### Since

1.3.4

#### Inherited from

`ITextClickBehavior.centeredRotation`

***

### centeredScaling

> **centeredScaling**: `boolean`

Defined in: [src/shapes/Object/Object.ts:217](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L217)

When true, this object will use center point as the origin of transformation
when being scaled via the controls.

#### Since

1.3.4

#### Inherited from

`ITextClickBehavior.centeredScaling`

***

### charSpacing

> **charSpacing**: `number`

Defined in: [src/shapes/Text/Text.ts:368](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L368)

additional space between characters
expressed in thousands of em unit

#### Inherited from

`ITextClickBehavior.charSpacing`

***

### clipPath?

> `optional` **clipPath**: [`BaseFabricObject`](/api/classes/basefabricobject/)\<`Partial`\<`ObjectProps`\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

Defined in: [src/shapes/Object/Object.ts:213](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L213)

#### Inherited from

`ITextClickBehavior.clipPath`

***

### clipPathId?

> `optional` **clipPathId**: `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:20](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/FabricObjectSVGExportMixin.ts#L20)

When an object is being exported as SVG as a clippath, a reference inside the SVG is needed.
This reference is a UID in the fabric namespace and is temporary stored here.

#### Inherited from

`ITextClickBehavior.clipPathId`

***

### compositionColor

> **compositionColor**: `string`

Defined in: [src/shapes/IText/IText.ts:197](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L197)

***

### compositionEnd

> **compositionEnd**: `number`

Defined in: [src/shapes/IText/IText.ts:144](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L144)

#### Overrides

`ITextClickBehavior.compositionEnd`

***

### compositionStart

> **compositionStart**: `number`

Defined in: [src/shapes/IText/IText.ts:142](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L142)

#### Overrides

`ITextClickBehavior.compositionStart`

***

### controls

> **controls**: `TControlSet`

Defined in: [src/shapes/Object/InteractiveObject.ts:121](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L121)

holds the controls for the object.
controls are added by default_controls.js

#### Inherited from

`ITextClickBehavior.controls`

***

### cornerColor

> **cornerColor**: `string`

Defined in: [src/shapes/Object/InteractiveObject.ts:71](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L71)

Color of controlling corners of an object (when it's active)

#### Default

```ts
rgb(178,204,255)
```

#### Inherited from

`ITextClickBehavior.cornerColor`

***

### cornerDashArray

> **cornerDashArray**: `null` \| `number`[]

Defined in: [src/shapes/Object/InteractiveObject.ts:74](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L74)

Array specifying dash pattern of an object's control (hasBorder must be true)

#### Since

1.6.2

#### Default

```ts
null
```

#### Inherited from

`ITextClickBehavior.cornerDashArray`

***

### cornerSize

> **cornerSize**: `number`

Defined in: [src/shapes/Object/InteractiveObject.ts:68](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L68)

Size of object's controlling corners (in pixels)

#### Default

```ts
13
```

#### Inherited from

`ITextClickBehavior.cornerSize`

***

### cornerStrokeColor

> **cornerStrokeColor**: `string`

Defined in: [src/shapes/Object/InteractiveObject.ts:72](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L72)

Color of controlling corners of an object (when it's active and transparentCorners false)

#### Since

1.6.2

#### Default

```ts
''
```

#### Inherited from

`ITextClickBehavior.cornerStrokeColor`

***

### ~~cornerStyle~~

> **cornerStyle**: `"circle"` \| `"rect"`

Defined in: [src/shapes/Object/InteractiveObject.ts:73](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L73)

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

`ITextClickBehavior.cornerStyle`

***

### ctrlKeysMapDown

> **ctrlKeysMapDown**: `TKeyMapIText`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:42](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L42)

For functionalities on keyDown + ctrl || cmd

#### Inherited from

[`Textbox`](/api/classes/textbox/).[`ctrlKeysMapDown`](/api/classes/textbox/#ctrlkeysmapdown)

***

### ctrlKeysMapUp

> **ctrlKeysMapUp**: `TKeyMapIText`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:37](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L37)

For functionalities on keyUp + ctrl || cmd

#### Inherited from

[`Textbox`](/api/classes/textbox/).[`ctrlKeysMapUp`](/api/classes/textbox/#ctrlkeysmapup)

***

### cursorColor

> **cursorColor**: `string`

Defined in: [src/shapes/IText/IText.ts:183](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L183)

Color of text cursor color in editing mode.
if not set (default) will take color from the text.
if set to a color value that fabric can understand, it will
be used instead of the color of the text at the current position.

***

### cursorDelay

> **cursorDelay**: `number`

Defined in: [src/shapes/IText/IText.ts:189](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L189)

Delay between cursor blink (in ms)

#### Overrides

`ITextClickBehavior.cursorDelay`

***

### cursorDuration

> **cursorDuration**: `number`

Defined in: [src/shapes/IText/IText.ts:195](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L195)

Duration of cursor fade in (in ms)

#### Overrides

`ITextClickBehavior.cursorDuration`

***

### cursorWidth

> **cursorWidth**: `number`

Defined in: [src/shapes/IText/IText.ts:174](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L174)

Width of cursor (in px)

#### Overrides

`ITextClickBehavior.cursorWidth`

***

### deltaY

> **deltaY**: `number`

Defined in: [src/shapes/Text/Text.ts:374](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L374)

Baseline shift, styles only, keep at 0 for the main text object

#### Inherited from

`ITextClickBehavior.deltaY`

***

### direction

> **direction**: `CanvasDirection`

Defined in: [src/shapes/Text/Text.ts:386](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L386)

WARNING: EXPERIMENTAL. NOT SUPPORTED YET
determine the direction of the text.
This has to be set manually together with textAlign and originX for proper
experience.
some interesting link for the future
https://www.w3.org/International/questions/qa-bidi-unicode-controls

#### Since

4.5.0

#### Inherited from

`ITextClickBehavior.direction`

***

### dirty

> **dirty**: `boolean`

Defined in: [src/shapes/Object/Object.ts:242](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L242)

When set to `true`, object's cache will be rerendered next render call.
since 1.7.0

#### Default

```ts
true
```

#### Inherited from

`ITextClickBehavior.dirty`

***

### editable

> **editable**: `boolean`

Defined in: [src/shapes/IText/IText.ts:162](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L162)

Indicates whether a text can be edited

#### Overrides

`ITextClickBehavior.editable`

***

### editingBorderColor

> **editingBorderColor**: `string`

Defined in: [src/shapes/IText/IText.ts:168](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L168)

Border color of text object while it's in editing mode

#### Overrides

`ITextClickBehavior.editingBorderColor`

***

### evented

> **evented**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:85](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L85)

When set to `false`, an object can not be a target of events. All events propagate through it. Introduced in v1.3.4

#### Inherited from

`ITextClickBehavior.evented`

***

### excludeFromExport

> **excludeFromExport**: `boolean`

Defined in: [src/shapes/Object/Object.ts:209](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L209)

When `true`, object is not exported in OBJECT/JSON

#### Since

1.6.3

#### Inherited from

`ITextClickBehavior.excludeFromExport`

***

### fill

> **fill**: `null` \| `string` \| [`TFiller`](/api/type-aliases/tfiller/)

Defined in: [src/shapes/Object/Object.ts:192](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L192)

#### Inherited from

`ITextClickBehavior.fill`

***

### fillRule

> **fillRule**: `CanvasFillRule`

Defined in: [src/shapes/Object/Object.ts:193](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L193)

Fill rule used to fill an object
accepted values are nonzero, evenodd
<b>Backwards incompatibility note:</b> This property was used for setting globalCompositeOperation until v1.4.12 (use `globalCompositeOperation` instead)

#### Default

```ts
nonzero
```

#### Inherited from

`ITextClickBehavior.fillRule`

***

### flipX

> **flipX**: `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:574](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L574)

When true, an object is rendered as flipped horizontally

#### Default

```ts
false
```

#### Inherited from

`ITextClickBehavior.flipX`

***

### flipY

> **flipY**: `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:575](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L575)

When true, an object is rendered as flipped vertically

#### Default

```ts
false
```

#### Inherited from

`ITextClickBehavior.flipY`

***

### fontFamily

> **fontFamily**: `string`

Defined in: [src/shapes/Text/Text.ts:201](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L201)

Font family

#### Inherited from

`ITextClickBehavior.fontFamily`

***

### fontSize

> **fontSize**: `number`

Defined in: [src/shapes/Text/Text.ts:189](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L189)

Font size (in pixels)

#### Inherited from

`ITextClickBehavior.fontSize`

***

### fontStyle

> **fontStyle**: `FontStyle`

Defined in: [src/shapes/Text/Text.ts:232](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L232)

Font style . Possible values: "", "normal", "italic" or "oblique".

#### Inherited from

`ITextClickBehavior.fontStyle`

***

### fontWeight

> **fontWeight**: `string` \| `number`

Defined in: [src/shapes/Text/Text.ts:195](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L195)

Font weight (e.g. bold, normal, 400, 600, 800)

#### Inherited from

`ITextClickBehavior.fontWeight`

***

### globalCompositeOperation

> **globalCompositeOperation**: `GlobalCompositeOperation`

Defined in: [src/shapes/Object/Object.ts:201](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L201)

Composite rule used for canvas globalCompositeOperation

#### Inherited from

`ITextClickBehavior.globalCompositeOperation`

***

### hasBorders

> **hasBorders**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:81](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L81)

When set to `false`, object's controlling borders are not rendered

#### Inherited from

`ITextClickBehavior.hasBorders`

***

### hasControls

> **hasControls**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:75](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L75)

When set to `false`, object's controls are not displayed and can not be used to manipulate object

#### Default

```ts
true
```

#### Inherited from

`ITextClickBehavior.hasControls`

***

### height

> **height**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:573](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L573)

Object height

#### Inherited from

`ITextClickBehavior.height`

***

### hiddenTextarea

> **hiddenTextarea**: `null` \| `HTMLTextAreaElement`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:44](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L44)

#### Inherited from

[`Textbox`](/api/classes/textbox/).[`hiddenTextarea`](/api/classes/textbox/#hiddentextarea)

***

### hiddenTextareaContainer?

> `optional` **hiddenTextareaContainer**: `null` \| `HTMLElement`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:53](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L53)

DOM container to append the hiddenTextarea.
An alternative to attaching to the document.body.
Useful to reduce laggish redraw of the full document.body tree and
also with modals event capturing that won't let the textarea take focus.

#### Inherited from

[`Textbox`](/api/classes/textbox/).[`hiddenTextareaContainer`](/api/classes/textbox/#hiddentextareacontainer)

***

### hoverCursor

> **hoverCursor**: `null` \| `string`

Defined in: [src/shapes/Object/InteractiveObject.ts:89](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L89)

Default cursor value used when hovering over this object on canvas

#### Default

```ts
null
```

#### Inherited from

`ITextClickBehavior.hoverCursor`

***

### includeDefaultValues

> **includeDefaultValues**: `boolean`

Defined in: [src/shapes/Object/Object.ts:208](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L208)

When `false`, default object's values are not included in its serialization

#### Inherited from

`ITextClickBehavior.includeDefaultValues`

***

### initialized?

> `optional` **initialized**: `true`

Defined in: [src/shapes/Text/Text.ts:428](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L428)

#### Inherited from

`ITextClickBehavior.initialized`

***

### inverted

> **inverted**: `boolean`

Defined in: [src/shapes/Object/Object.ts:214](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L214)

Meaningful ONLY when the object is used as clipPath.
if true, the clipPath will make the object clip to the outside of the clipPath
since 2.4.0

#### Default

```ts
false
```

#### Inherited from

`ITextClickBehavior.inverted`

***

### isEditing

> **isEditing**: `boolean`

Defined in: [src/shapes/IText/IText.ts:156](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L156)

Indicates whether text is in editing mode

#### Overrides

`ITextClickBehavior.isEditing`

***

### isMoving?

> `optional` **isMoving**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:127](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L127)

internal boolean to signal the code that the object is
part of the move action.

#### Inherited from

`ITextClickBehavior.isMoving`

***

### keysMap

> **keysMap**: `TKeyMapIText`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:30](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L30)

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

[`Textbox`](/api/classes/textbox/).[`keysMap`](/api/classes/textbox/#keysmap)

***

### keysMapRtl

> **keysMapRtl**: `TKeyMapIText`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:32](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L32)

#### Inherited from

[`Textbox`](/api/classes/textbox/).[`keysMapRtl`](/api/classes/textbox/#keysmaprtl)

***

### left

> **left**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:571](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L571)

Left position of an object.
Note that by default it's relative to object left.
You can change this by setting originX

#### Default

```ts
0
```

#### Inherited from

`ITextClickBehavior.left`

***

### lineHeight

> **lineHeight**: `number`

Defined in: [src/shapes/Text/Text.ts:238](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L238)

Line height

#### Inherited from

`ITextClickBehavior.lineHeight`

***

### linethrough

> **linethrough**: `boolean`

Defined in: [src/shapes/Text/Text.ts:219](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L219)

Text decoration linethrough.

#### Inherited from

`ITextClickBehavior.linethrough`

***

### lockMovementX

> **lockMovementX**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:59](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L59)

When `true`, object horizontal movement is locked

#### Inherited from

`ITextClickBehavior.lockMovementX`

***

### lockMovementY

> **lockMovementY**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:60](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L60)

When `true`, object vertical movement is locked

#### Inherited from

`ITextClickBehavior.lockMovementY`

***

### lockRotation

> **lockRotation**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:61](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L61)

When `true`, object rotation is locked

#### Inherited from

`ITextClickBehavior.lockRotation`

***

### lockScalingFlip

> **lockScalingFlip**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:66](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L66)

When `true`, object cannot be flipped by scaling into negative values

#### Inherited from

`ITextClickBehavior.lockScalingFlip`

***

### lockScalingX

> **lockScalingX**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:62](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L62)

When `true`, object horizontal scaling is locked

#### Inherited from

`ITextClickBehavior.lockScalingX`

***

### lockScalingY

> **lockScalingY**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:63](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L63)

When `true`, object vertical scaling is locked

#### Inherited from

`ITextClickBehavior.lockScalingY`

***

### lockSkewingX

> **lockSkewingX**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:64](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L64)

When `true`, object horizontal skewing is locked

#### Inherited from

`ITextClickBehavior.lockSkewingX`

***

### lockSkewingY

> **lockSkewingY**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:65](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L65)

When `true`, object vertical skewing is locked

#### Inherited from

`ITextClickBehavior.lockSkewingY`

***

### matrixCache?

> `optional` **matrixCache**: `TMatrixCache`

Defined in: [src/shapes/Object/ObjectGeometry.ts:75](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L75)

storage cache for object full transform matrix

#### Inherited from

`ITextClickBehavior.matrixCache`

***

### MIN\_TEXT\_WIDTH

> **MIN\_TEXT\_WIDTH**: `number`

Defined in: [src/shapes/Text/Text.ts:408](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L408)

contains the min text width to avoid getting 0

#### Inherited from

`ITextClickBehavior.MIN_TEXT_WIDTH`

***

### minScaleLimit

> **minScaleLimit**: `number`

Defined in: [src/shapes/Object/Object.ts:187](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L187)

Minimum allowed scale value of an object

#### Default

```ts
0
```

#### Inherited from

`ITextClickBehavior.minScaleLimit`

***

### moveCursor

> **moveCursor**: `null` \| `string`

Defined in: [src/shapes/Object/InteractiveObject.ts:90](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L90)

Default cursor value used when moving this object on canvas

#### Default

```ts
null
```

#### Inherited from

`ITextClickBehavior.moveCursor`

***

### noScaleCache

> **noScaleCache**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:54](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L54)

When `true`, cache does not get updated during scaling. The picture will get blocky if scaled
too much and will be redrawn with correct details at the end of scaling.
this setting is performance and application dependent.
default to true
since 1.7.0

#### Default

```ts
true
```

#### Inherited from

`ITextClickBehavior.noScaleCache`

***

### objectCaching

> **objectCaching**: `boolean`

Defined in: [src/shapes/Object/Object.ts:211](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L211)

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

`ITextClickBehavior.objectCaching`

***

### oCoords

> **oCoords**: `Record`\<`string`, `TOCoord`\>

Defined in: [src/shapes/Object/InteractiveObject.ts:98](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L98)

The object's controls' position in viewport coordinates
Calculated by [Control#positionHandler](/api/classes/control/#positionhandler) and [Control#calcCornerCoords](/api/classes/control/#calccornercoords), depending on [padding](/api/classes/fabricobject/#padding).
`corner/touchCorner` describe the 4 points forming the interactive area of the corner.
Used to draw and locate controls.

#### Inherited from

`ITextClickBehavior.oCoords`

***

### opacity

> **opacity**: `number`

Defined in: [src/shapes/Object/Object.ts:189](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L189)

Opacity of an object

#### Default

```ts
1
```

#### Inherited from

`ITextClickBehavior.opacity`

***

### ~~originX~~

> **originX**: [`TOriginX`](/api/type-aliases/toriginx/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:583](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L583)

:::caution[Deprecated]
please use 'center' as value in new projects
:::

#### Inherited from

`ITextClickBehavior.originX`

***

### ~~originY~~

> **originY**: [`TOriginY`](/api/type-aliases/toriginy/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:587](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L587)

:::caution[Deprecated]
please use 'center' as value in new projects
:::

#### Inherited from

`ITextClickBehavior.originY`

***

### overline

> **overline**: `boolean`

Defined in: [src/shapes/Text/Text.ts:213](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L213)

Text decoration overline.

#### Inherited from

`ITextClickBehavior.overline`

***

### ownMatrixCache?

> `optional` **ownMatrixCache**: `TMatrixCache`

Defined in: [src/shapes/Object/ObjectGeometry.ts:70](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L70)

storage cache for object transform matrix

#### Inherited from

`ITextClickBehavior.ownMatrixCache`

***

### padding

> **padding**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:55](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L55)

Padding between object and its controlling borders (in pixels)

#### Default

```ts
0
```

#### Inherited from

`ITextClickBehavior.padding`

***

### paintFirst

> **paintFirst**: `"fill"` \| `"stroke"`

Defined in: [src/shapes/Object/Object.ts:191](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L191)

Determines if the fill or the stroke is drawn first (one of "fill" or "stroke")

#### Inherited from

`ITextClickBehavior.paintFirst`

***

### parent?

> `optional` **parent**: [`Group`](/api/classes/group/)

Defined in: [src/shapes/Object/Object.ts:1601](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1601)

A reference to the parent of the object
Used to keep the original parent ref when the object has been added to an ActiveSelection, hence loosing the `group` ref

#### Inherited from

`ITextClickBehavior.parent`

***

### path?

> `optional` **path**: [`Path`](/api/classes/path/)\<`Partial`\<[`PathProps`](/api/interfaces/pathprops/)\>, [`SerializedPathProps`](/api/interfaces/serializedpathprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

Defined in: [src/shapes/Text/Text.ts:301](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L301)

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

`ITextClickBehavior.path`

***

### pathAlign

> **pathAlign**: [`TPathAlign`](/api/type-aliases/tpathalign/)

Defined in: [src/shapes/Text/Text.ts:345](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L345)

How text is aligned to the path. This property determines
the perpendicular position of each character relative to the path.
(one of "baseline", "center", "ascender", "descender")
This feature is in BETA, and its behavior may change

#### Inherited from

`ITextClickBehavior.pathAlign`

***

### pathSide

> **pathSide**: [`TPathSide`](/api/type-aliases/tpathside/)

Defined in: [src/shapes/Text/Text.ts:336](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L336)

Which side of the path the text should be drawn on.
Only used when text has a path

#### Inherited from

`ITextClickBehavior.pathSide`

***

### pathStartOffset

> **pathStartOffset**: `number`

Defined in: [src/shapes/Text/Text.ts:329](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L329)

Offset amount for text path starting position
Only used when text has a path

#### Inherited from

`ITextClickBehavior.pathStartOffset`

***

### perPixelTargetFind

> **perPixelTargetFind**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:86](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L86)

When set to `true`, objects are "found" on canvas on per-pixel basis rather than according to bounding box

#### Inherited from

`ITextClickBehavior.perPixelTargetFind`

***

### scaleX

> **scaleX**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:576](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L576)

Object scale factor (horizontal)

#### Default

```ts
1
```

#### Inherited from

`ITextClickBehavior.scaleX`

***

### scaleY

> **scaleY**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:577](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L577)

Object scale factor (vertical)

#### Default

```ts
1
```

#### Inherited from

`ITextClickBehavior.scaleY`

***

### selectable

> **selectable**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:84](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L84)

When set to `false`, an object can not be selected for modification (using either point-click-based or group-based selection).
But events still fire on it.

#### Inherited from

`ITextClickBehavior.selectable`

***

### ~~selectionBackgroundColor~~

> **selectionBackgroundColor**: `string`

Defined in: [src/shapes/Object/InteractiveObject.ts:82](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L82)

Selection Background color of an object. colored layer behind the object when it is active.
does not mix good with globalCompositeOperation methods.

:::caution[Deprecated]
This API is no longer supported and may be removed in a future release.
:::

#### Inherited from

`ITextClickBehavior.selectionBackgroundColor`

***

### selectionColor

> **selectionColor**: `string`

Defined in: [src/shapes/IText/IText.ts:150](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L150)

Color of text selection

***

### selectionEnd

> **selectionEnd**: `number`

Defined in: [src/shapes/IText/IText.ts:140](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L140)

Index where text selection ends

#### Implementation of

`UniqueITextProps.selectionEnd`

#### Overrides

`ITextClickBehavior.selectionEnd`

***

### selectionStart

> **selectionStart**: `number`

Defined in: [src/shapes/IText/IText.ts:134](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L134)

Index where text selection starts (or where cursor is when there is no selection)

#### Implementation of

`UniqueITextProps.selectionStart`

#### Overrides

`ITextClickBehavior.selectionStart`

***

### shadow

> **shadow**: `null` \| [`Shadow`](/api/classes/shadow/)

Defined in: [src/shapes/Object/Object.ts:204](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L204)

#### Inherited from

`ITextClickBehavior.shadow`

***

### skewX

> **skewX**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:578](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L578)

Angle of skew on x axes of an object (in degrees)

#### Default

```ts
0
```

#### Inherited from

`ITextClickBehavior.skewX`

***

### skewY

> **skewY**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:579](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L579)

Angle of skew on y axes of an object (in degrees)

#### Default

```ts
0
```

#### Inherited from

`ITextClickBehavior.skewY`

***

### snapAngle?

> `optional` **snapAngle**: [`TDegree`](/api/type-aliases/tdegree/)

Defined in: [src/shapes/Object/InteractiveObject.ts:56](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L56)

The angle that an object will lock to while rotating.

#### Inherited from

`ITextClickBehavior.snapAngle`

***

### snapThreshold?

> `optional` **snapThreshold**: [`TDegree`](/api/type-aliases/tdegree/)

Defined in: [src/shapes/Object/InteractiveObject.ts:57](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L57)

The angle difference from the current snapped angle in which snapping should occur.
When undefined, the snapThreshold will default to the snapAngle.

#### Inherited from

`ITextClickBehavior.snapThreshold`

***

### stroke

> **stroke**: `null` \| `string` \| [`TFiller`](/api/type-aliases/tfiller/)

Defined in: [src/shapes/Object/Object.ts:194](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L194)

#### Inherited from

`ITextClickBehavior.stroke`

***

### strokeDashArray

> **strokeDashArray**: `null` \| `number`[]

Defined in: [src/shapes/Object/Object.ts:195](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L195)

Array specifying dash pattern of an object's stroke (stroke must be defined)

#### Default

```ts
null;
```

#### Inherited from

`ITextClickBehavior.strokeDashArray`

***

### strokeDashOffset

> **strokeDashOffset**: `number`

Defined in: [src/shapes/Object/Object.ts:196](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L196)

Line offset of an object's stroke

#### Default

```ts
0
```

#### Inherited from

`ITextClickBehavior.strokeDashOffset`

***

### strokeLineCap

> **strokeLineCap**: `CanvasLineCap`

Defined in: [src/shapes/Object/Object.ts:197](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L197)

Line endings style of an object's stroke (one of "butt", "round", "square")

#### Default

```ts
butt
```

#### Inherited from

`ITextClickBehavior.strokeLineCap`

***

### strokeLineJoin

> **strokeLineJoin**: `CanvasLineJoin`

Defined in: [src/shapes/Object/Object.ts:198](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L198)

Corner style of an object's stroke (one of "bevel", "round", "miter")

#### Inherited from

`ITextClickBehavior.strokeLineJoin`

***

### strokeMiterLimit

> **strokeMiterLimit**: `number`

Defined in: [src/shapes/Object/Object.ts:199](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L199)

Maximum miter length (used for strokeLineJoin = "miter") of an object's stroke

#### Default

```ts
4
```

#### Inherited from

`ITextClickBehavior.strokeMiterLimit`

***

### strokeUniform

> **strokeUniform**: `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:590](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L590)

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

`ITextClickBehavior.strokeUniform`

***

### strokeWidth

> **strokeWidth**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:589](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L589)

Width of a stroke used to render this object

#### Default

```ts
1
```

#### Inherited from

`ITextClickBehavior.strokeWidth`

***

### styles

> **styles**: [`TextStyle`](/api/type-aliases/textstyle/)

Defined in: [src/shapes/Text/Text.ts:278](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L278)

#### Inherited from

`ITextClickBehavior.styles`

***

### subscript

> **subscript**: `object`

Defined in: [src/shapes/Text/Text.ts:259](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L259)

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

`ITextClickBehavior.subscript`

***

### superscript

> **superscript**: `object`

Defined in: [src/shapes/Text/Text.ts:243](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L243)

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

`ITextClickBehavior.superscript`

***

### text

> **text**: `string`

Defined in: [src/shapes/Text/Text.ts:183](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L183)

#### Inherited from

`ITextClickBehavior.text`

***

### textAlign

> **textAlign**: `TextAlign`

Defined in: [src/shapes/Text/Text.ts:226](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L226)

Text alignment. Possible values: "left", "center", "right", "justify",
"justify-left", "justify-center" or "justify-right".

#### Inherited from

`ITextClickBehavior.textAlign`

***

### textBackgroundColor

> **textBackgroundColor**: `string`

Defined in: [src/shapes/Text/Text.ts:276](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L276)

Background color of text lines

#### Inherited from

`ITextClickBehavior.textBackgroundColor`

***

### textDecorationColor?

> `optional` **textDecorationColor**: `string`

Defined in: [src/shapes/Text/Text.ts:323](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L323)

Optional text decoration color for underline, overline and strikethrough.
When undefined, decoration color falls back to the text fill color.
This feature is not really supported by anything else than svg 2 specs with css3 support.
Chrome does not support this, nor firefox apparently.

#### Inherited from

`ITextClickBehavior.textDecorationColor`

***

### textDecorationThickness

> **textDecorationThickness**: `number`

Defined in: [src/shapes/Text/Text.ts:315](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L315)

The text decoration thickness for underline, overline and strikethrough
The thickness is expressed in thousandths of fontSize ( em ).
The original value was 1/15 that translates to 66.6667 thousandths.
The choice of unit of measure is to align with charSpacing.
You can slim the thickness without issues, while large underline or overline may end up
outside the bounding box of the text. In order to fix that a bigger refactor of the code
is needed and is out of scope for now. If you need such large overline on the first line
of text or large underline on the last line of text, consider disabling caching as a
workaround

#### Default

```ts
66.667
```

#### Inherited from

`ITextClickBehavior.textDecorationThickness`

***

### textLines

> **textLines**: `string`[]

Defined in: [src/shapes/Text/Text.ts:415](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L415)

contains the the text of the object, divided in lines as they are displayed
on screen. Wrapping will divide the text independently of line breaks

#### Inherited from

`ITextClickBehavior.textLines`

***

### top

> **top**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:570](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L570)

Top position of an object.
Note that by default it's relative to object top.
You can change this by setting originY

#### Default

```ts
0
```

#### Inherited from

`ITextClickBehavior.top`

***

### touchCornerSize

> **touchCornerSize**: `number`

Defined in: [src/shapes/Object/InteractiveObject.ts:69](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L69)

Size of object's controlling corners when touch interaction is detected

#### Default

```ts
24
```

#### Inherited from

`ITextClickBehavior.touchCornerSize`

***

### transparentCorners

> **transparentCorners**: `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:70](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L70)

When true, object's controlling corners are rendered as transparent inside (i.e. stroke instead of fill)

#### Default

```ts
true
```

#### Inherited from

`ITextClickBehavior.transparentCorners`

***

### underline

> **underline**: `boolean`

Defined in: [src/shapes/Text/Text.ts:207](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L207)

Text decoration underline.

#### Inherited from

`ITextClickBehavior.underline`

***

### visible

> **visible**: `boolean`

Defined in: [src/shapes/Object/Object.ts:206](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L206)

When set to `false`, an object is not rendered on canvas

#### Inherited from

`ITextClickBehavior.visible`

***

### width

> **width**: `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:572](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L572)

Object width

#### Inherited from

`ITextClickBehavior.width`

***

### \_styleProperties

> `static` **\_styleProperties**: readonly `StylePropertiesType`[] = `styleProperties`

Defined in: [src/shapes/Text/StyledText.ts:30](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/StyledText.ts#L30)

#### Inherited from

`ITextClickBehavior._styleProperties`

***

### ATTRIBUTE\_NAMES

> `static` **ATTRIBUTE\_NAMES**: `string`[]

Defined in: [src/shapes/Text/Text.ts:1857](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L1857)

List of attribute names to account for when parsing SVG element (used by [FabricText.fromElement](/api/classes/fabrictext/#fromelement))
@see: http://www.w3.org/TR/SVG/text.html#TextElement

#### Inherited from

`ITextClickBehavior.ATTRIBUTE_NAMES`

***

### cacheProperties

> `static` **cacheProperties**: `string`[]

Defined in: [src/shapes/Text/Text.ts:430](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L430)

List of properties to consider when checking if cache needs refresh
Those properties are checked by
calls to Object.set(key, value). If the key is in this list, the object is marked as dirty
and refreshed at the next render

#### Inherited from

`ITextClickBehavior.cacheProperties`

***

### colorProperties

> `static` **colorProperties**: `string`[]

Defined in: [src/shapes/Object/Object.ts:1508](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1508)

List of properties to consider for animating colors.

#### Inherited from

`ITextClickBehavior.colorProperties`

***

### customProperties

> `static` **customProperties**: `string`[] = `[]`

Defined in: [src/shapes/Object/Object.ts:1749](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1749)

Define a list of custom properties that will be serialized when
instance.toObject() gets called

#### Inherited from

`ITextClickBehavior.customProperties`

***

### genericFonts

> `static` **genericFonts**: `string`[]

Defined in: [src/shapes/Text/Text.ts:1835](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L1835)

List of generic font families

#### See

https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#generic-name

#### Inherited from

`ITextClickBehavior.genericFonts`

***

### ownDefaults

> `static` **ownDefaults**: `Partial`\<[`TClassProperties`](/api/type-aliases/tclassproperties/)\<`IText`\<`Partial`\<[`ITextProps`](/api/interfaces/itextprops/)\>, [`SerializedITextProps`](/api/interfaces/serializeditextprops/), [`ITextEvents`](/api/type-aliases/itextevents/)\>\>\> = `iTextDefaultValues`

Defined in: [src/shapes/IText/IText.ts:205](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L205)

#### Overrides

`ITextClickBehavior.ownDefaults`

***

### stateProperties

> `static` **stateProperties**: `string`[]

Defined in: [src/shapes/Object/Object.ts:225](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L225)

This list of properties is used to check if the state of an object is changed.
This state change now is only used for children of groups to understand if a group
needs its cache regenerated during a .set call

#### Inherited from

`ITextClickBehavior.stateProperties`

***

### type

> `static` **type**: `string` = `'IText'`

Defined in: [src/shapes/IText/IText.ts:211](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L211)

#### Overrides

`ITextClickBehavior.type`

## Accessors

### type

#### Get Signature

> **get** **type**(): `string`

Defined in: [src/shapes/IText/IText.ts:213](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L213)

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

#### Overrides

`ITextClickBehavior.type`

## Methods

### \_drawClipPath()

> **\_drawClipPath**(`ctx`, `clipPath`, `context`): `void`

Defined in: [src/shapes/Object/Object.ts:872](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L872)

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

`ITextClickBehavior._drawClipPath`

***

### \_getFontDeclaration()

> **\_getFontDeclaration**(`__namedParameters?`, `forMeasuring?`): `string`

Defined in: [src/shapes/Text/Text.ts:1694](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L1694)

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

`ITextClickBehavior._getFontDeclaration`

***

### \_getGraphemeBox()

> **\_getGraphemeBox**(`grapheme`, `lineIndex`, `charIndex`, `prevGrapheme?`, `skipLeft?`): [`GraphemeBBox`](/api/type-aliases/graphemebbox/)

Defined in: [src/shapes/Text/Text.ts:989](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L989)

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

`ITextClickBehavior._getGraphemeBox`

***

### \_getSelectionForOffset()

> **\_getSelectionForOffset**(`e`, `isRight`): `number`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:383](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L383)

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

`ITextClickBehavior._getSelectionForOffset`

***

### \_getWidthOfCharSpacing()

> **\_getWidthOfCharSpacing**(): `number`

Defined in: [src/shapes/Text/Text.ts:1536](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L1536)

#### Returns

`number`

#### Inherited from

`ITextClickBehavior._getWidthOfCharSpacing`

***

### \_limitCacheSize()

> **\_limitCacheSize**(`dims`): [`TSize`](/api/type-aliases/tsize/) & `object` & `object`

Defined in: [src/shapes/Object/Object.ts:397](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L397)

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

`ITextClickBehavior._limitCacheSize`

***

### \_measureLine()

> **\_measureLine**(`lineIndex`): `object`

Defined in: [src/shapes/Text/Text.ts:897](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L897)

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

`ITextClickBehavior._measureLine`

***

### \_mouseDownHandler()

> **\_mouseDownHandler**(`__namedParameters`): `void`

Defined in: [src/shapes/IText/ITextClickBehavior.ts:98](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextClickBehavior.ts#L98)

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

`ITextClickBehavior._mouseDownHandler`

***

### \_moveCursorLeftOrRight()

> **\_moveCursorLeftOrRight**(`direction`, `e`): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:645](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L645)

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

`ITextClickBehavior._moveCursorLeftOrRight`

***

### \_moveCursorUpOrDown()

> **\_moveCursorUpOrDown**(`direction`, `e`): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:483](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L483)

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

`ITextClickBehavior._moveCursorUpOrDown`

***

### \_removeCacheCanvas()

> **\_removeCacheCanvas**(): `void`

Defined in: [src/shapes/Object/Object.ts:707](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L707)

Remove cacheCanvas and its dimensions from the objects

#### Returns

`void`

#### Inherited from

`ITextClickBehavior._removeCacheCanvas`

***

### \_renderControls()

> **\_renderControls**(`ctx`, `styleOverride?`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:440](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L440)

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

`ITextClickBehavior._renderControls`

***

### \_renderCursor()

> **\_renderCursor**(`ctx`, `boundaries`, `selectionStart`): `void`

Defined in: [src/shapes/IText/IText.ts:601](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L601)

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

***

### \_setClippingProperties()

> **\_setClippingProperties**(`ctx`): `void`

Defined in: [src/shapes/Object/Object.ts:1017](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1017)

#### Parameters

##### ctx

`CanvasRenderingContext2D`

#### Returns

`void`

#### Inherited from

`ITextClickBehavior._setClippingProperties`

***

### \_setFillStyles()

> **\_setFillStyles**(`ctx`, `style`): `object`

Defined in: [src/shapes/Text/Text.ts:1353](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L1353)

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

`ITextClickBehavior._setFillStyles`

***

### \_setStrokeStyles()

> **\_setStrokeStyles**(`ctx`, `style`): `object`

Defined in: [src/shapes/Text/Text.ts:1331](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L1331)

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

`ITextClickBehavior._setStrokeStyles`

***

### \_setupCompositeOperation()

> **\_setupCompositeOperation**(`ctx`): `void`

Defined in: [src/shapes/Object/Object.ts:1483](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1483)

Sets canvas globalCompositeOperation for specific object
custom composition operation for the particular object can be specified using globalCompositeOperation property

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Rendering canvas context

#### Returns

`void`

#### Inherited from

`ITextClickBehavior._setupCompositeOperation`

***

### \_splitTextIntoLines()

> **\_splitTextIntoLines**(`text`): `TextLinesInfo`

Defined in: [src/shapes/Text/Text.ts:1762](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L1762)

Returns the text as an array of lines.

#### Parameters

##### text

`string`

text to split

#### Returns

`TextLinesInfo`

Lines in the text

#### Inherited from

`ITextClickBehavior._splitTextIntoLines`

***

### \_toSVG()

> **\_toSVG**(`_reviver?`): `string`[]

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:136](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/FabricObjectSVGExportMixin.ts#L136)

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

`ITextClickBehavior._toSVG`

***

### abortCursorAnimation()

> **abortCursorAnimation**(): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:183](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L183)

Aborts cursor animation, clears all timeouts and clear textarea context if necessary

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.abortCursorAnimation`

***

### addPaintOrder()

> **addPaintOrder**(`this`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:265](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/FabricObjectSVGExportMixin.ts#L265)

#### Parameters

##### this

`FabricObjectSVGExportMixin` & [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

#### Returns

`string`

#### Inherited from

`ITextClickBehavior.addPaintOrder`

***

### animate()

> **animate**\<`T`\>(`animatable`, `options?`): `Record`\<`string`, [`TAnimation`](/api/fabric/namespaces/util/type-aliases/tanimation/)\<`T`\>\>

Defined in: [src/shapes/Object/Object.ts:1522](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1522)

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

`ITextClickBehavior.animate`

***

### blur()

> **blur**(): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:106](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L106)

Override this method to customize cursor behavior on textbox blur

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.blur`

***

### calcACoords()

> **calcACoords**(): [`TCornerPoint`](/api/type-aliases/tcornerpoint/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:429](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L429)

Calculates the coordinates of the 4 corner of the bbox, in absolute coordinates.
those never change with zoom or viewport changes.

#### Returns

[`TCornerPoint`](/api/type-aliases/tcornerpoint/)

#### Inherited from

`ITextClickBehavior.calcACoords`

***

### calcOCoords()

> **calcOCoords**(): `Record`\<`string`, `TOCoord`\>

Defined in: [src/shapes/Object/InteractiveObject.ts:258](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L258)

Calculates the coordinates of the center of each control plus the corners of the control itself
This basically just delegates to each control positionHandler
WARNING: changing what is passed to positionHandler is a breaking change, since position handler
is a public api and should be done just if extremely necessary

#### Returns

`Record`\<`string`, `TOCoord`\>

#### Inherited from

`ITextClickBehavior.calcOCoords`

***

### calcOwnMatrix()

> **calcOwnMatrix**(): [`TMat2D`](/api/type-aliases/tmat2d/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:515](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L515)

calculate transform matrix that represents the current transformations from the
object's properties, this matrix does not include the group transformation

#### Returns

[`TMat2D`](/api/type-aliases/tmat2d/)

transform matrix for the object

#### Inherited from

`ITextClickBehavior.calcOwnMatrix`

***

### calcTextHeight()

> **calcTextHeight**(): `number`

Defined in: [src/shapes/Text/Text.ts:1061](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L1061)

Calculate text box height

#### Returns

`number`

#### Inherited from

`ITextClickBehavior.calcTextHeight`

***

### calcTransformMatrix()

> **calcTransformMatrix**(`skipGroup?`): [`TMat2D`](/api/type-aliases/tmat2d/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:487](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L487)

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

`ITextClickBehavior.calcTransformMatrix`

***

### canDrop()

> **canDrop**(`e`): `boolean`

Defined in: [src/shapes/IText/ITextClickBehavior.ts:64](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextClickBehavior.ts#L64)

override this method to control whether instance should/shouldn't become a drop target

#### Parameters

##### e

`DragEvent`

#### Returns

`boolean`

#### Inherited from

`ITextClickBehavior.canDrop`

***

### cleanStyle()

> **cleanStyle**(`property`): `undefined` \| `false`

Defined in: [src/shapes/Text/StyledText.ts:98](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/StyledText.ts#L98)

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

`ITextClickBehavior.cleanStyle`

***

### clearContextTop()

> **clearContextTop**(`restoreManually?`): `undefined` \| `CanvasRenderingContext2D`

Defined in: [src/shapes/Object/InteractiveObject.ts:637](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L637)

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

`ITextClickBehavior.clearContextTop`

***

### clone()

> **clone**(`propertiesToInclude?`): `Promise`\<`IText`\<`Props`, `SProps`, `EventSpec`\>\>

Defined in: [src/shapes/Object/Object.ts:1245](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1245)

Clones an instance.

#### Parameters

##### propertiesToInclude?

`string`[]

Any properties that you might want to additionally include in the output

#### Returns

`Promise`\<`IText`\<`Props`, `SProps`, `EventSpec`\>\>

#### Inherited from

`ITextClickBehavior.clone`

***

### cloneAsImage()

> **cloneAsImage**(`options?`): [`FabricImage`](/api/classes/fabricimage/)

Defined in: [src/shapes/Object/Object.ts:1271](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1271)

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

`ITextClickBehavior.cloneAsImage`

***

### cmdAll()

> **cmdAll**(): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:230](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L230)

Selects entire text and updates the visual state

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.cmdAll`

***

### complexity()

> **complexity**(): `number`

Defined in: [src/shapes/Text/Text.ts:1827](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L1827)

Returns complexity of an instance

#### Returns

`number`

complexity

#### Inherited from

`ITextClickBehavior.complexity`

***

### containsPoint()

> **containsPoint**(`point`): `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:284](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L284)

Checks if point is inside the object

#### Parameters

##### point

[`Point`](/api/classes/point/)

Point to check against

#### Returns

`boolean`

true if point is inside the object

#### Inherited from

`ITextClickBehavior.containsPoint`

***

### copy()

> **copy**(): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:301](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L301)

Copies selected text

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.copy`

***

### dispose()

> **dispose**(): `void`

Defined in: [src/shapes/IText/IText.ts:770](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L770)

cancel instance's running animations
override if necessary to dispose artifacts such as `clipPath`

#### Returns

`void`

#### Overrides

`ITextClickBehavior.dispose`

***

### doubleClickHandler()

> **doubleClickHandler**(`options`): `void`

Defined in: [src/shapes/IText/ITextClickBehavior.ts:71](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextClickBehavior.ts#L71)

Default handler for double click, select a word

#### Parameters

##### options

[`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.doubleClickHandler`

***

### drawBorders()

> **drawBorders**(`ctx`, `options`, `styleOverride?`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:488](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L488)

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

`ITextClickBehavior.drawBorders`

***

### drawCacheOnCanvas()

> **drawCacheOnCanvas**(`this`, `ctx`): `void`

Defined in: [src/shapes/Object/Object.ts:894](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L894)

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

`ITextClickBehavior.drawCacheOnCanvas`

***

### drawClipPathOnCache()

> **drawClipPathOnCache**(`ctx`, `clipPath`, `canvasWithClipPath`): `void`

Defined in: [src/shapes/Object/Object.ts:799](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L799)

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

`ITextClickBehavior.drawClipPathOnCache`

***

### drawControls()

> **drawControls**(`ctx`, `styleOverride`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:560](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L560)

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

[`ControlRenderingStyleOverride`](/api/type-aliases/controlrenderingstyleoverride/) = `{}`

object to override the object style

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.drawControls`

***

### drawControlsConnectingLines()

> **drawControlsConnectingLines**(`ctx`, `size`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:527](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L527)

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

`ITextClickBehavior.drawControlsConnectingLines`

***

### drawObject()

> **drawObject**(`ctx`, `forClipping`, `context`): `void`

Defined in: [src/shapes/Object/Object.ts:823](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L823)

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

`ITextClickBehavior.drawObject`

***

### drawSelectionBackground()

> **drawSelectionBackground**(`ctx`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:380](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L380)

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

`ITextClickBehavior.drawSelectionBackground`

***

### enlargeSpaces()

> **enlargeSpaces**(): `void`

Defined in: [src/shapes/Text/Text.ts:506](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L506)

Enlarge space boxes and shift the others

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.enlargeSpaces`

***

### enterEditing()

> **enterEditing**(`e?`): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:392](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L392)

Enters editing state

#### Parameters

##### e?

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.enterEditing`

***

### enterEditingImpl()

> **enterEditingImpl**(): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:411](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L411)

runs the actual logic that enter from editing state, see [enterEditing](/api/classes/itext/#enterediting)

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.enterEditingImpl`

***

### exitEditing()

> **exitEditing**(): `IText`\<`Props`, `SProps`, `EventSpec`\>

Defined in: [src/shapes/IText/ITextBehavior.ts:726](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L726)

Exits from editing state and fires relevant events

#### Returns

`IText`\<`Props`, `SProps`, `EventSpec`\>

#### Inherited from

`ITextClickBehavior.exitEditing`

***

### exitEditingImpl()

> **exitEditingImpl**(): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:702](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L702)

runs the actual logic that exits from editing state, see [exitEditing](/api/classes/itext/#exitediting)
But it does not fire events

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.exitEditingImpl`

***

### findAncestorsWithClipPath()

> **findAncestorsWithClipPath**(): [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]

Defined in: [src/shapes/IText/IText.ts:440](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L440)

Finds and returns an array of clip paths that are applied to the parent
group(s) of the current FabricObject instance. The object's hierarchy is
traversed upwards (from the current object towards the root of the canvas),
checking each parent object for the presence of a `clipPath` that is not
absolutely positioned.

#### Returns

[`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]

***

### findCommonAncestors()

> **findCommonAncestors**\<`T`\>(`other`): `AncestryComparison`

Defined in: [src/shapes/Object/Object.ts:1640](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1640)

Compare ancestors

#### Type Parameters

##### T

`T` *extends* `IText`\<`Props`, `SProps`, `EventSpec`\>

#### Parameters

##### other

`T`

#### Returns

`AncestryComparison`

an object that represent the ancestry situation.

#### Inherited from

`ITextClickBehavior.findCommonAncestors`

***

### findLineBoundaryLeft()

> **findLineBoundaryLeft**(`startFrom`): `number`

Defined in: [src/shapes/IText/ITextBehavior.ts:296](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L296)

Find new selection index representing start of current line according to current selection index

#### Parameters

##### startFrom

`number`

Current selection index

#### Returns

`number`

New selection index

#### Inherited from

`ITextClickBehavior.findLineBoundaryLeft`

***

### findLineBoundaryRight()

> **findLineBoundaryRight**(`startFrom`): `number`

Defined in: [src/shapes/IText/ITextBehavior.ts:313](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L313)

Find new selection index representing end of current line according to current selection index

#### Parameters

##### startFrom

`number`

Current selection index

#### Returns

`number`

New selection index

#### Inherited from

`ITextClickBehavior.findLineBoundaryRight`

***

### findWordBoundaryLeft()

> **findWordBoundaryLeft**(`startFrom`): `number`

Defined in: [src/shapes/IText/ITextBehavior.ts:248](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L248)

Find new selection index representing start of current word according to current selection index

#### Parameters

##### startFrom

`number`

Current selection index

#### Returns

`number`

New selection index

#### Inherited from

`ITextClickBehavior.findWordBoundaryLeft`

***

### findWordBoundaryRight()

> **findWordBoundaryRight**(`startFrom`): `number`

Defined in: [src/shapes/IText/ITextBehavior.ts:272](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L272)

Find new selection index representing end of current word according to current selection index

#### Parameters

##### startFrom

`number`

Current selection index

#### Returns

`number`

New selection index

#### Inherited from

`ITextClickBehavior.findWordBoundaryRight`

***

### fire()

> **fire**\<`K`\>(`eventName`, `options?`): `void`

Defined in: [src/Observable.ts:167](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Observable.ts#L167)

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

`ITextClickBehavior.fire`

***

### forEachControl()

> **forEachControl**(`fn`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:358](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L358)

Calls a function for each control. The function gets called,
with the control, the control's key and the object that is calling the iterator

#### Parameters

##### fn

(`control`, `key`, `fabricObject`) => `any`

function to iterate over the controls over

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.forEachControl`

***

### fromGraphemeToStringSelection()

> **fromGraphemeToStringSelection**(`start`, `end`, `graphemes`): `object`

Defined in: [src/shapes/IText/ITextBehavior.ts:504](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L504)

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

`ITextClickBehavior.fromGraphemeToStringSelection`

***

### fromStringToGraphemeSelection()

> **fromStringToGraphemeSelection**(`start`, `end`, `text`): `object`

Defined in: [src/shapes/IText/ITextBehavior.ts:487](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L487)

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

`ITextClickBehavior.fromStringToGraphemeSelection`

***

### get()

> **get**(`property`): `any`

Defined in: [src/CommonMethods.ts:59](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/CommonMethods.ts#L59)

Basic getter

#### Parameters

##### property

`string`

Property name

#### Returns

`any`

value of a property

#### Inherited from

`ITextClickBehavior.get`

***

### get2DCursorLocation()

> **get2DCursorLocation**(`selectionStart?`, `skipWrapping?`): `object`

Defined in: [src/shapes/IText/IText.ts:339](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L339)

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

#### Overrides

`ITextClickBehavior.get2DCursorLocation`

***

### getActiveControl()

> **getActiveControl**(): `undefined` \| \{ `control`: [`Control`](/api/classes/control/); `coord`: `TOCoord`; `key`: `string`; \}

Defined in: [src/shapes/Object/InteractiveObject.ts:197](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L197)

#### Returns

`undefined` \| \{ `control`: [`Control`](/api/classes/control/); `coord`: `TOCoord`; `key`: `string`; \}

#### Inherited from

`ITextClickBehavior.getActiveControl`

***

### getAncestors()

> **getAncestors**(): `Ancestors`

Defined in: [src/shapes/Object/Object.ts:1623](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1623)

#### Returns

`Ancestors`

ancestors (excluding `ActiveSelection`) from bottom to top

#### Inherited from

`ITextClickBehavior.getAncestors`

***

### getBoundingRect()

> **getBoundingRect**(): [`TBBox`](/api/type-aliases/tbbox/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:345](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L345)

Returns coordinates of object's bounding rectangle (left, top, width, height)
the box is intended as aligned to axis of canvas.

#### Returns

[`TBBox`](/api/type-aliases/tbbox/)

Object with left, top, width, height properties

#### Inherited from

`ITextClickBehavior.getBoundingRect`

***

### getCanvasRetinaScaling()

> **getCanvasRetinaScaling**(): `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:402](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L402)

#### Returns

`number`

#### Inherited from

`ITextClickBehavior.getCanvasRetinaScaling`

***

### getCenterPoint()

> **getCenterPoint**(): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:740](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L740)

Returns the center coordinates of the object relative to canvas

#### Returns

[`Point`](/api/classes/point/)

#### Inherited from

`ITextClickBehavior.getCenterPoint`

***

### getCompleteStyleDeclaration()

> **getCompleteStyleDeclaration**(`lineIndex`, `charIndex`): [`CompleteTextStyleDeclaration`](/api/type-aliases/completetextstyledeclaration/)

Defined in: [src/shapes/Text/StyledText.ts:273](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/StyledText.ts#L273)

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

`ITextClickBehavior.getCompleteStyleDeclaration`

***

### getCoords()

> **getCoords**(): [`Point`](/api/classes/point/)[]

Defined in: [src/shapes/Object/ObjectGeometry.ts:206](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L206)

#### Returns

[`Point`](/api/classes/point/)[]

[tl, tr, br, bl] in the scene plane

#### Inherited from

`ITextClickBehavior.getCoords`

***

### getCurrentCharColor()

> **getCurrentCharColor**(): `null` \| `string` \| [`TFiller`](/api/type-aliases/tfiller/)

Defined in: [src/shapes/IText/IText.ts:754](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L754)

High level function to know the color of the cursor.
the currentChar is the one that precedes the cursor
Returns color (fill) of char at the current cursor
if the text object has a pattern or gradient for filler, it will return that.
Unused by the library, is for the end user

#### Returns

`null` \| `string` \| [`TFiller`](/api/type-aliases/tfiller/)

Character color (fill)

***

### getCurrentCharFontSize()

> **getCurrentCharFontSize**(): `number`

Defined in: [src/shapes/IText/IText.ts:741](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L741)

High level function to know the height of the cursor.
the currentChar is the one that precedes the cursor
Returns fontSize of char at the current cursor
Unused from the library, is for the end user

#### Returns

`number`

Character font size

***

### getCursorRenderingData()

> **getCursorRenderingData**(`selectionStart`, `boundaries`): [`CursorRenderingData`](/api/type-aliases/cursorrenderingdata/)

Defined in: [src/shapes/IText/IText.ts:567](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L567)

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

***

### getDownCursorOffset()

> **getDownCursorOffset**(`e`, `isRight`): `number`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:351](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L351)

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

`ITextClickBehavior.getDownCursorOffset`

***

### getHeightOfChar()

> **getHeightOfChar**(`line`, `_char`): `number`

Defined in: [src/shapes/Text/Text.ts:872](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L872)

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

`ITextClickBehavior.getHeightOfChar`

***

### getHeightOfLine()

> **getHeightOfLine**(`lineIndex`): `number`

Defined in: [src/shapes/Text/Text.ts:1054](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L1054)

Calculate height of line at 'lineIndex'

#### Parameters

##### lineIndex

`number`

index of line to calculate

#### Returns

`number`

#### Inherited from

`ITextClickBehavior.getHeightOfLine`

***

### getObjectOpacity()

> **getObjectOpacity**(): `number`

Defined in: [src/shapes/Object/Object.ts:560](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L560)

Return the object opacity counting also the group property

#### Returns

`number`

#### Inherited from

`ITextClickBehavior.getObjectOpacity`

***

### getObjectScaling()

> **getObjectScaling**(): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/Object.ts:529](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L529)

Return the object scale factor counting also the group scaling

#### Returns

[`Point`](/api/classes/point/)

#### Inherited from

`ITextClickBehavior.getObjectScaling`

***

### ~~getPointByOrigin()~~

> **getPointByOrigin**(`originX`, `originY`): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:763](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L763)

Alias of [getPositionByOrigin](/api/classes/itext/#getpositionbyorigin)

:::caution[Deprecated]
use [getPositionByOrigin](/api/classes/itext/#getpositionbyorigin) instead
:::

#### Parameters

##### originX

[`TOriginX`](/api/type-aliases/toriginx/)

##### originY

[`TOriginY`](/api/type-aliases/toriginy/)

#### Returns

[`Point`](/api/classes/point/)

#### Inherited from

`ITextClickBehavior.getPointByOrigin`

***

### getPositionByOrigin()

> **getPositionByOrigin**(`originX`, `originY`): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:779](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L779)

This function is the mirror of [setPositionByOrigin](/api/classes/itext/#setpositionbyorigin)
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

`ITextClickBehavior.getPositionByOrigin`

***

### getRelativeCenterPoint()

> **getRelativeCenterPoint**(): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:751](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L751)

Returns the center coordinates of the object relative to it's parent

#### Returns

[`Point`](/api/classes/point/)

#### Inherited from

`ITextClickBehavior.getRelativeCenterPoint`

***

### getRelativeX()

> **getRelativeX**(): `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:117](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L117)

#### Returns

`number`

x position according to object's originX property in parent's coordinate plane\
if parent is canvas then this property is identical to [getX](/api/classes/itext/#getx)

#### Inherited from

`ITextClickBehavior.getRelativeX`

***

### getRelativeXY()

> **getRelativeXY**(): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:178](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L178)

#### Returns

[`Point`](/api/classes/point/)

x,y position according to object's originX originY properties in parent's coordinate plane

#### Inherited from

`ITextClickBehavior.getRelativeXY`

***

### getRelativeY()

> **getRelativeY**(): `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:133](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L133)

#### Returns

`number`

y position according to object's originY property in parent's coordinate plane\
if parent is canvas then this property is identical to [getY](/api/classes/itext/#gety)

#### Inherited from

`ITextClickBehavior.getRelativeY`

***

### getScaledHeight()

> **getScaledHeight**(): `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:363](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L363)

Returns height of an object bounding box counting transformations

#### Returns

`number`

height value

#### Todo

shouldn't this account for group transform and return the actual size in canvas coordinate plane?

#### Inherited from

`ITextClickBehavior.getScaledHeight`

***

### getScaledWidth()

> **getScaledWidth**(): `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:354](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L354)

Returns width of an object's bounding box counting transformations

#### Returns

`number`

width value

#### Todo

shouldn't this account for group transform and return the actual size in canvas coordinate plane?

#### Inherited from

`ITextClickBehavior.getScaledWidth`

***

### getSelectedText()

> **getSelectedText**(): `string`

Defined in: [src/shapes/IText/ITextBehavior.ts:239](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L239)

Returns selected text

#### Returns

`string`

#### Inherited from

`ITextClickBehavior.getSelectedText`

***

### getSelectionStartFromPointer()

> **getSelectionStartFromPointer**(`e`): `number`

Defined in: [src/shapes/IText/ITextClickBehavior.ts:193](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextClickBehavior.ts#L193)

Returns index of a character corresponding to where an object was clicked

#### Parameters

##### e

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

Event object

#### Returns

`number`

Index of a character

#### Inherited from

`ITextClickBehavior.getSelectionStartFromPointer`

***

### getSelectionStyles()

> **getSelectionStyles**(`startIndex`, `endIndex`, `complete?`): `Partial`\<[`CompleteTextStyleDeclaration`](/api/type-aliases/completetextstyledeclaration/)\>[]

Defined in: [src/shapes/IText/IText.ts:312](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L312)

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

#### Overrides

`ITextClickBehavior.getSelectionStyles`

***

### getSvgCommons()

> **getSvgCommons**(`this`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:100](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/FabricObjectSVGExportMixin.ts#L100)

Returns id attribute for svg output

#### Parameters

##### this

`FabricObjectSVGExportMixin` & [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\> & `object`

#### Returns

`string`

#### Inherited from

`ITextClickBehavior.getSvgCommons`

***

### getSvgFilter()

> **getSvgFilter**(`this`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:90](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/FabricObjectSVGExportMixin.ts#L90)

Returns filter for svg shadow

#### Parameters

##### this

`FabricObjectSVGExportMixin` & [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

#### Returns

`string`

#### Inherited from

`ITextClickBehavior.getSvgFilter`

***

### getSvgStyles()

> **getSvgStyles**(`this`, `skipShadow?`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:27](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/FabricObjectSVGExportMixin.ts#L27)

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

`ITextClickBehavior.getSvgStyles`

***

### getSvgTransform()

> **getSvgTransform**(`this`, `full?`, `additionalTransform?`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:119](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/FabricObjectSVGExportMixin.ts#L119)

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

`ITextClickBehavior.getSvgTransform`

***

### getTotalAngle()

> **getTotalAngle**(): [`TDegree`](/api/type-aliases/tdegree/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:410](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L410)

Returns the object angle relative to canvas counting also the group property

#### Returns

[`TDegree`](/api/type-aliases/tdegree/)

#### Inherited from

`ITextClickBehavior.getTotalAngle`

***

### getTotalObjectScaling()

> **getTotalObjectScaling**(): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/Object.ts:546](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L546)

Return the object scale factor counting also the group scaling, zoom and retina

#### Returns

[`Point`](/api/classes/point/)

object with scaleX and scaleY properties

#### Inherited from

`ITextClickBehavior.getTotalObjectScaling`

***

### getUpCursorOffset()

> **getUpCursorOffset**(`e`, `isRight`): `number`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:396](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L396)

#### Parameters

##### e

`KeyboardEvent`

Event object

##### isRight

`boolean`

#### Returns

`number`

#### Inherited from

`ITextClickBehavior.getUpCursorOffset`

***

### getValueOfPropertyAt()

> **getValueOfPropertyAt**\<`T`\>(`lineIndex`, `charIndex`, `property`): `IText`\<`Props`, `SProps`, `EventSpec`\>\[`T`\]

Defined in: [src/shapes/Text/Text.ts:1550](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L1550)

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

`IText`\<`Props`, `SProps`, `EventSpec`\>\[`T`\]

the value of 'property'

#### Inherited from

`ITextClickBehavior.getValueOfPropertyAt`

***

### getViewportTransform()

> **getViewportTransform**(): [`TMat2D`](/api/type-aliases/tmat2d/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:420](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L420)

Retrieves viewportTransform from Object's canvas if available

#### Returns

[`TMat2D`](/api/type-aliases/tmat2d/)

#### Inherited from

`ITextClickBehavior.getViewportTransform`

***

### getX()

> **getX**(): `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:88](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L88)

#### Returns

`number`

x position according to object's originX property in canvas coordinate plane

#### Inherited from

`ITextClickBehavior.getX`

***

### getXY()

> **getXY**(): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:148](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L148)

#### Returns

[`Point`](/api/classes/point/)

x position according to object's originX originY properties in canvas coordinate plane

#### Inherited from

`ITextClickBehavior.getXY`

***

### getY()

> **getY**(): `number`

Defined in: [src/shapes/Object/ObjectGeometry.ts:102](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L102)

#### Returns

`number`

y position according to object's originY property in canvas coordinate plane

#### Inherited from

`ITextClickBehavior.getY`

***

### graphemeSplit()

> **graphemeSplit**(`value`): `string`[]

Defined in: [src/shapes/Text/Text.ts:1753](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L1753)

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

`ITextClickBehavior.graphemeSplit`

***

### handleFiller()

> **handleFiller**\<`T`\>(`ctx`, `property`, `filler`): `object`

Defined in: [src/shapes/Text/Text.ts:1291](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L1291)

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

`ITextClickBehavior.handleFiller`

***

### hasCommonAncestors()

> **hasCommonAncestors**\<`T`\>(`other`): `boolean`

Defined in: [src/shapes/Object/Object.ts:1705](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1705)

#### Type Parameters

##### T

`T` *extends* `IText`\<`Props`, `SProps`, `EventSpec`\>

#### Parameters

##### other

`T`

#### Returns

`boolean`

#### Inherited from

`ITextClickBehavior.hasCommonAncestors`

***

### hasFill()

> **hasFill**(): `boolean`

Defined in: [src/shapes/Object/Object.ts:738](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L738)

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

`ITextClickBehavior.hasFill`

***

### hasStroke()

> **hasStroke**(): `boolean`

Defined in: [src/shapes/Object/Object.ts:722](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L722)

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

`ITextClickBehavior.hasStroke`

***

### initBehavior()

> **initBehavior**(): `void`

Defined in: [src/shapes/IText/ITextClickBehavior.ts:26](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextClickBehavior.ts#L26)

Initializes all the interactive behavior of IText

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.initBehavior`

***

### initDelayedCursor()

> **initDelayedCursor**(`restart?`): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:175](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L175)

Initializes delayed cursor

#### Parameters

##### restart?

`boolean`

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.initDelayedCursor`

***

### initHiddenTextarea()

> **initHiddenTextarea**(): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:62](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L62)

Initializes hidden textarea (needed to bring up keyboard in iOS)

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.initHiddenTextarea`

***

### insertChars()

> **insertChars**(`text`, `style`, `start`, `end`): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:1062](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L1062)

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

`ITextClickBehavior.insertChars`

***

### insertCharStyleObject()

> **insertCharStyleObject**(`lineIndex`, `charIndex`, `quantity`, `copiedStyle?`): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:912](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L912)

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

`ITextClickBehavior.insertCharStyleObject`

***

### insertNewlineStyleObject()

> **insertNewlineStyleObject**(`lineIndex`, `charIndex`, `qty`, `copiedStyle?`): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:843](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L843)

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

`ITextClickBehavior.insertNewlineStyleObject`

***

### insertNewStyleBlock()

> **insertNewStyleBlock**(`insertedText`, `start`, `copiedStyle?`): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:970](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L970)

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

`ITextClickBehavior.insertNewStyleBlock`

***

### intersectsWithObject()

> **intersectsWithObject**(`other`): `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:234](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L234)

Checks if object intersects with another object

#### Parameters

##### other

`ObjectGeometry`

Object to test

#### Returns

`boolean`

true if object intersects with another object

#### Inherited from

`ITextClickBehavior.intersectsWithObject`

***

### intersectsWithRect()

> **intersectsWithRect**(`tl`, `br`): `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:220](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L220)

Checks if object intersects with the scene rect formed by tl and br

#### Parameters

##### tl

[`Point`](/api/classes/point/)

##### br

[`Point`](/api/classes/point/)

#### Returns

`boolean`

#### Inherited from

`ITextClickBehavior.intersectsWithRect`

***

### isCacheDirty()

> **isCacheDirty**(`skipCanvas`): `boolean`

Defined in: [src/shapes/Object/Object.ts:911](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L911)

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

`ITextClickBehavior.isCacheDirty`

***

### isContainedWithinObject()

> **isContainedWithinObject**(`other`): `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:253](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L253)

Checks if object is fully contained within area of another object

#### Parameters

##### other

`ObjectGeometry`

Object to test

#### Returns

`boolean`

true if object is fully contained within area of another object

#### Inherited from

`ITextClickBehavior.isContainedWithinObject`

***

### isContainedWithinRect()

> **isContainedWithinRect**(`tl`, `br`): `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:261](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L261)

Checks if object is fully contained within the scene rect formed by tl and br

#### Parameters

##### tl

[`Point`](/api/classes/point/)

##### br

[`Point`](/api/classes/point/)

#### Returns

`boolean`

#### Inherited from

`ITextClickBehavior.isContainedWithinRect`

***

### isControlVisible()

> **isControlVisible**(`controlKey`): `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:594](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L594)

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

`ITextClickBehavior.isControlVisible`

***

### isDescendantOf()

> **isDescendantOf**(`target`): `boolean`

Defined in: [src/shapes/Object/Object.ts:1609](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1609)

Checks if object is descendant of target
Should be used instead of [Group.contains](/api/classes/group/#contains) or [StaticCanvas.contains](/api/classes/staticcanvas/#contains) for performance reasons

#### Parameters

##### target

`TAncestor`

#### Returns

`boolean`

#### Inherited from

`ITextClickBehavior.isDescendantOf`

***

### isEmptyStyles()

> **isEmptyStyles**(`lineIndex?`): `boolean`

Defined in: [src/shapes/Text/StyledText.ts:41](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/StyledText.ts#L41)

Returns true if object has no styling or no styling in a line

#### Parameters

##### lineIndex?

`number`

, lineIndex is on wrapped lines.

#### Returns

`boolean`

#### Inherited from

`ITextClickBehavior.isEmptyStyles`

***

### isEndOfWrapping()

> **isEndOfWrapping**(`lineIndex`): `boolean`

Defined in: [src/shapes/Text/Text.ts:550](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L550)

Detect if the text line is ended with an hard break
text and itext do not have wrapping, return false

#### Parameters

##### lineIndex

`number`

#### Returns

`boolean`

#### Inherited from

`ITextClickBehavior.isEndOfWrapping`

***

### isInFrontOf()

> **isInFrontOf**\<`T`\>(`other`): `undefined` \| `boolean`

Defined in: [src/shapes/Object/Object.ts:1715](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1715)

#### Type Parameters

##### T

`T` *extends* `IText`\<`Props`, `SProps`, `EventSpec`\>

#### Parameters

##### other

`T`

object to compare against

#### Returns

`undefined` \| `boolean`

if objects do not share a common ancestor or they are strictly equal it is impossible to determine which is in front of the other; in such cases the function returns `undefined`

#### Inherited from

`ITextClickBehavior.isInFrontOf`

***

### isNotVisible()

> **isNotVisible**(): `boolean`

Defined in: [src/shapes/Object/Object.ts:637](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L637)

return if the object would be visible in rendering

#### Returns

`boolean`

#### Inherited from

`ITextClickBehavior.isNotVisible`

***

### isOnScreen()

> **isOnScreen**(): `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:293](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L293)

Checks if object is contained within the canvas with current viewportTransform
the check is done stopping at first point that appears on screen

#### Returns

`boolean`

true if object is fully or partially contained within canvas

#### Inherited from

`ITextClickBehavior.isOnScreen`

***

### isOverlapping()

> **isOverlapping**\<`T`\>(`other`): `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:271](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L271)

#### Type Parameters

##### T

`T` *extends* `ObjectGeometry`\<[`ObjectEvents`](/api/interfaces/objectevents/)\>

#### Parameters

##### other

`T`

#### Returns

`boolean`

#### Inherited from

`ITextClickBehavior.isOverlapping`

***

### isPartiallyOnScreen()

> **isPartiallyOnScreen**(): `boolean`

Defined in: [src/shapes/Object/ObjectGeometry.ts:323](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L323)

Checks if object is partially contained within the canvas with current viewportTransform

#### Returns

`boolean`

true if object is partially contained within canvas

#### Inherited from

`ITextClickBehavior.isPartiallyOnScreen`

***

### isType()

> **isType**(...`types`): `boolean`

Defined in: [src/shapes/Object/Object.ts:1418](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1418)

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

`ITextClickBehavior.isType`

***

### measureLine()

> **measureLine**(`lineIndex`): `object`

Defined in: [src/shapes/Text/Text.ts:880](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L880)

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

`ITextClickBehavior.measureLine`

***

### missingNewlineOffset()

> **missingNewlineOffset**(`lineIndex`, `skipWrapping?`): `0` \| `1`

Defined in: [src/shapes/Text/Text.ts:560](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L560)

Detect if a line has a linebreak and so we need to account for it when moving
and counting style.
It return always 1 for text and Itext. Textbox has its own implementation

#### Parameters

##### lineIndex

`number`

##### skipWrapping?

`boolean`

#### Returns

`0` \| `1`

Number

#### Inherited from

`ITextClickBehavior.missingNewlineOffset`

***

### moveCursorDown()

> **moveCursorDown**(`e`): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:457](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L457)

Moves cursor down

#### Parameters

##### e

`KeyboardEvent`

Event object

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.moveCursorDown`

***

### moveCursorLeft()

> **moveCursorLeft**(`e`): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:542](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L542)

Moves cursor left

#### Parameters

##### e

`KeyboardEvent`

Event object

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.moveCursorLeft`

***

### moveCursorLeftWithoutShift()

> **moveCursorLeftWithoutShift**(`e`): `boolean`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:594](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L594)

Moves cursor left without keeping selection

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`boolean`

#### Inherited from

`ITextClickBehavior.moveCursorLeftWithoutShift`

***

### moveCursorLeftWithShift()

> **moveCursorLeftWithShift**(`e`): `undefined` \| `boolean`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:614](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L614)

Moves cursor left while keeping selection

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`undefined` \| `boolean`

#### Inherited from

`ITextClickBehavior.moveCursorLeftWithShift`

***

### moveCursorRight()

> **moveCursorRight**(`e`): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:630](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L630)

Moves cursor right

#### Parameters

##### e

`KeyboardEvent`

Event object

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.moveCursorRight`

***

### moveCursorRightWithoutShift()

> **moveCursorRightWithoutShift**(`e`): `boolean`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:680](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L680)

Moves cursor right without keeping selection

#### Parameters

##### e

`KeyboardEvent`

Event object

#### Returns

`boolean`

#### Inherited from

`ITextClickBehavior.moveCursorRightWithoutShift`

***

### moveCursorRightWithShift()

> **moveCursorRightWithShift**(`e`): `undefined` \| `boolean`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:664](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L664)

Moves cursor right while keeping selection

#### Parameters

##### e

`KeyboardEvent`

#### Returns

`undefined` \| `boolean`

#### Inherited from

`ITextClickBehavior.moveCursorRightWithShift`

***

### moveCursorUp()

> **moveCursorUp**(`e`): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:471](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L471)

Moves cursor up

#### Parameters

##### e

`KeyboardEvent`

Event object

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.moveCursorUp`

***

### moveCursorWithoutShift()

> **moveCursorWithoutShift**(`offset`): `boolean`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:527](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L527)

Moves cursor up without shift

#### Parameters

##### offset

`number`

#### Returns

`boolean`

#### Inherited from

`ITextClickBehavior.moveCursorWithoutShift`

***

### moveCursorWithShift()

> **moveCursorWithShift**(`offset`): `boolean`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:510](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L510)

Moves cursor with shift

#### Parameters

##### offset

`number`

#### Returns

`boolean`

#### Inherited from

`ITextClickBehavior.moveCursorWithShift`

***

### needsItsOwnCache()

> **needsItsOwnCache**(): `boolean`

Defined in: [src/shapes/Object/Object.ts:750](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L750)

When returns `true`, force the object to have its own cache, even if it is inside a group
it may be needed when your object behave in a particular way on the cache and always needs
its own isolated canvas to render correctly.
Created to be overridden
since 1.7.12

#### Returns

`boolean`

Boolean

#### Inherited from

`ITextClickBehavior.needsItsOwnCache`

***

### off()

#### Call Signature

> **off**\<`K`\>(`eventName`): `void`

Defined in: [src/Observable.ts:122](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Observable.ts#L122)

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

`ITextClickBehavior.off`

#### Call Signature

> **off**\<`K`\>(`eventName`, `handler`): `void`

Defined in: [src/Observable.ts:128](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Observable.ts#L128)

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

`ITextClickBehavior.off`

#### Call Signature

> **off**(`handlers`): `void`

Defined in: [src/Observable.ts:133](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Observable.ts#L133)

unsubscribe event listeners

##### Parameters

###### handlers

`EventRegistryObject`\<`EventSpec`\>

handlers key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})

##### Returns

`void`

##### Inherited from

`ITextClickBehavior.off`

#### Call Signature

> **off**(): `void`

Defined in: [src/Observable.ts:137](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Observable.ts#L137)

unsubscribe all event listeners

##### Returns

`void`

##### Inherited from

`ITextClickBehavior.off`

***

### on()

#### Call Signature

> **on**\<`K`, `E`\>(`eventName`, `handler`): `VoidFunction`

Defined in: [src/Observable.ts:23](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Observable.ts#L23)

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

`ITextClickBehavior.on`

#### Call Signature

> **on**(`handlers`): `VoidFunction`

Defined in: [src/Observable.ts:27](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Observable.ts#L27)

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

`ITextClickBehavior.on`

***

### once()

#### Call Signature

> **once**\<`K`, `E`\>(`eventName`, `handler`): `VoidFunction`

Defined in: [src/Observable.ts:62](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Observable.ts#L62)

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

`ITextClickBehavior.once`

#### Call Signature

> **once**(`handlers`): `VoidFunction`

Defined in: [src/Observable.ts:66](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/Observable.ts#L66)

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

`ITextClickBehavior.once`

***

### onCompositionEnd()

> **onCompositionEnd**(): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:287](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L287)

Composition end

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.onCompositionEnd`

***

### onCompositionStart()

> **onCompositionStart**(): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:280](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L280)

Composition start

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.onCompositionStart`

***

### onCompositionUpdate()

> **onCompositionUpdate**(`__namedParameters`): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:291](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L291)

#### Parameters

##### \_\_namedParameters

`CompositionEvent`

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.onCompositionUpdate`

***

### onDeselect()

> **onDeselect**(`options?`): `boolean`

Defined in: [src/shapes/IText/ITextBehavior.ts:111](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L111)

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

`ITextClickBehavior.onDeselect`

***

### onDragStart()

> **onDragStart**(`e`): `boolean`

Defined in: [src/shapes/IText/ITextClickBehavior.ts:57](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextClickBehavior.ts#L57)

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

`ITextClickBehavior.onDragStart`

***

### onInput()

> **onInput**(`this`, `e`): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:174](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L174)

Handles onInput event

#### Parameters

##### this

`IText`\<`Props`, `SProps`, `EventSpec`\> & `object`

##### e

`Event`

Event object

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.onInput`

***

### onKeyDown()

> **onKeyDown**(`e`): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:115](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L115)

Handles keydown event
only used for arrows and combination of modifier keys.

#### Parameters

##### e

`KeyboardEvent`

Event object

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.onKeyDown`

***

### onKeyUp()

> **onKeyUp**(`e`): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:151](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L151)

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

`ITextClickBehavior.onKeyUp`

***

### onSelect()

> **onSelect**(`_options?`): `boolean`

Defined in: [src/shapes/Object/InteractiveObject.ts:682](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L682)

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

`ITextClickBehavior.onSelect`

***

### paste()

> **paste**(): `void`

Defined in: [src/shapes/IText/ITextKeyBehavior.ts:323](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextKeyBehavior.ts#L323)

Pastes text

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.paste`

***

### positionByLeftTop()

> **positionByLeftTop**(`p`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:816](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L816)

An utility method to position the object by its left top corner.
Useful to reposition objects since now the default origin is center/center
Places the left/top corner of the object bounding box in p.

#### Parameters

##### p

[`Point`](/api/classes/point/)

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.positionByLeftTop`

***

### removeChars()

> **removeChars**(`start`, `end`): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:1040](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L1040)

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

`ITextClickBehavior.removeChars`

***

### removeStyle()

> **removeStyle**(`property`): `void`

Defined in: [src/shapes/Text/StyledText.ts:159](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/StyledText.ts#L159)

Remove a style property or properties from all individual character styles
in a text object.  Deletes the character style object if it contains no other style
props.  Deletes a line style object if it contains no other character styles.

#### Parameters

##### property

`StylePropertiesType`

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.removeStyle`

***

### removeStyleFromTo()

> **removeStyleFromTo**(`start`, `end`): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:758](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L758)

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

`ITextClickBehavior.removeStyleFromTo`

***

### renderCache()

> **renderCache**(`this`, `options?`): `void`

Defined in: [src/shapes/Object/Object.ts:683](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L683)

#### Parameters

##### this

`TCachedFabricObject`

##### options?

`any`

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.renderCache`

***

### renderCursor()

> **renderCursor**(`ctx`, `boundaries`): `void`

Defined in: [src/shapes/IText/IText.ts:557](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L557)

Renders cursor

#### Parameters

##### ctx

`CanvasRenderingContext2D`

transformed context to draw on

##### boundaries

[`CursorBoundaries`](/api/type-aliases/cursorboundaries/)

#### Returns

`void`

***

### renderCursorAt()

> **renderCursorAt**(`selectionStart`): `void`

Defined in: [src/shapes/IText/IText.ts:544](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L544)

Renders cursor on context Top, outside the animation cycle, on request
Used for the drag/drop effect.
If contextTop is not available, do nothing.

#### Parameters

##### selectionStart

`number`

#### Returns

`void`

***

### renderCursorOrSelection()

> **renderCursorOrSelection**(): `void`

Defined in: [src/shapes/IText/IText.ts:374](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L374)

Renders cursor or selection (depending on what exists)
it does on the contextTop. If contextTop is not available, do nothing.

#### Returns

`void`

#### Overrides

`ITextClickBehavior.renderCursorOrSelection`

***

### renderDragSourceEffect()

> **renderDragSourceEffect**(): `void`

Defined in: [src/shapes/IText/IText.ts:633](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L633)

Renders drag start text selection

#### Returns

`void`

#### Overrides

`ITextClickBehavior.renderDragSourceEffect`

***

### renderDropTargetEffect()

> **renderDropTargetEffect**(`e`): `void`

Defined in: [src/shapes/IText/IText.ts:643](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L643)

Override to customize drag and drop behavior
render a specific effect when an object is the target of a drag event
used to show that the underly object can receive a drop, or to show how the
object will change when dropping. example: show the cursor where the text is about to be dropped

#### Parameters

##### e

`DragEvent`

#### Returns

`void`

#### Overrides

`ITextClickBehavior.renderDropTargetEffect`

***

### renderSelection()

> **renderSelection**(`ctx`, `boundaries`): `void`

Defined in: [src/shapes/IText/IText.ts:618](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L618)

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

***

### restartCursorIfNeeded()

> **restartCursorIfNeeded**(): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:206](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L206)

Restart tue cursor animation if either is in complete state ( between animations )
or if it never started before

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.restartCursorIfNeeded`

***

### rotate()

> **rotate**(`angle`): `void`

Defined in: [src/shapes/Object/Object.ts:1446](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1446)

Sets "angle" of an instance with centered rotation

#### Parameters

##### angle

[`TDegree`](/api/type-aliases/tdegree/)

Angle value (in degrees)

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.rotate`

***

### scale()

> **scale**(`value`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:372](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L372)

Scales an object (equally by x and y)

#### Parameters

##### value

`number`

Scale factor

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.scale`

***

### scaleToHeight()

> **scaleToHeight**(`value`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:395](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L395)

Scales an object to a given height, with respect to bounding box (scaling by x/y equally)

#### Parameters

##### value

`number`

New height value

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.scaleToHeight`

***

### scaleToWidth()

> **scaleToWidth**(`value`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:383](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L383)

Scales an object to a given width, with respect to bounding box (scaling by x/y equally)

#### Parameters

##### value

`number`

New width value

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.scaleToWidth`

***

### searchWordBoundary()

> **searchWordBoundary**(`selectionStart`, `direction`): `number`

Defined in: [src/shapes/IText/ITextBehavior.ts:331](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L331)

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

`ITextClickBehavior.searchWordBoundary`

***

### selectAll()

> **selectAll**(): `IText`\<`Props`, `SProps`, `EventSpec`\>

Defined in: [src/shapes/IText/ITextBehavior.ts:219](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L219)

Selects entire text

#### Returns

`IText`\<`Props`, `SProps`, `EventSpec`\>

#### Inherited from

`ITextClickBehavior.selectAll`

***

### selectLine()

> **selectLine**(`selectionStart?`): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:378](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L378)

Selects the line that contains selectionStart

#### Parameters

##### selectionStart?

`number`

Index of a character

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.selectLine`

***

### selectWord()

> **selectWord**(`selectionStart?`): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:356](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L356)

Selects the word that contains the char at index selectionStart

#### Parameters

##### selectionStart?

`number`

Index of a character

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.selectWord`

***

### set()

> **set**(`key`, `value?`): `IText`\<`Props`, `SProps`, `EventSpec`\>

Defined in: [src/shapes/Text/Text.ts:1796](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L1796)

Sets property to a given value. When changing position/dimension -related properties (left, top, scale, angle, etc.) `set` does not update position of object's borders/controls. If you need to update those, call `setCoords()`.

#### Parameters

##### key

`any`

Property name or object (if object, iterate over the object properties)

##### value?

`any`

Property value (if function, the value is passed into it and its return value is used as a new one)

#### Returns

`IText`\<`Props`, `SProps`, `EventSpec`\>

#### Inherited from

`ITextClickBehavior.set`

***

### setControlsVisibility()

> **setControlsVisibility**(`options?`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:621](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L621)

Sets the visibility state of object controls, this is just a bulk option for setControlVisible;

#### Parameters

##### options?

`Record`\<`string`, `boolean`\> = `{}`

with an optional key per control
example: {Boolean} [options.bl] true to enable the bottom-left control, false to disable it

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.setControlsVisibility`

***

### setControlVisible()

> **setControlVisible**(`controlKey`, `visible`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:609](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L609)

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

`ITextClickBehavior.setControlVisible`

***

### setCoords()

> **setCoords**(): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:348](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L348)

set controls' coordinates as well
See [https://github.com/fabricjs/fabric.js/wiki/When-to-call-setCoords](https://github.com/fabricjs/fabric.js/wiki/When-to-call-setCoords) and [https://fabric5.fabricjs.com/fabric-gotchas](https://fabric5.fabricjs.com/fabric-gotchas)

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.setCoords`

***

### setCursorByClick()

> **setCursorByClick**(`e`): `void`

Defined in: [src/shapes/IText/ITextClickBehavior.ts:172](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextClickBehavior.ts#L172)

Changes cursor location in a text depending on passed pointer (x/y) object

#### Parameters

##### e

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

Event object

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.setCursorByClick`

***

### setOnGroup()

> **setOnGroup**(): `void`

Defined in: [src/shapes/Object/Object.ts:1474](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1474)

This callback function is called by the parent group of an object every
time a non-delegated property changes on the group. It is passed the key
and value as parameters. Not adding in this function's signature to avoid
Travis build error about unused variables.

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.setOnGroup`

***

### setPathInfo()

> **setPathInfo**(): `void`

Defined in: [src/shapes/Text/Text.ts:460](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L460)

If text has a path, it will add the extra information needed
for path and text calculations

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.setPathInfo`

***

### setPositionByOrigin()

> **setPositionByOrigin**(`pos`, `originX`, `originY`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:794](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L794)

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

`ITextClickBehavior.setPositionByOrigin`

***

### setRelativeX()

> **setRelativeX**(`value`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:125](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L125)

#### Parameters

##### value

`number`

x position according to object's originX property in parent's coordinate plane\
if parent is canvas then this method is identical to [setX](/api/classes/itext/#setx)

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.setRelativeX`

***

### setRelativeXY()

> **setRelativeXY**(`point`, `originX?`, `originY?`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:188](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L188)

As [setXY](/api/classes/itext/#setxy), but in current parent's coordinate plane (the current group if any or the canvas)

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

`ITextClickBehavior.setRelativeXY`

***

### setRelativeY()

> **setRelativeY**(`value`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:141](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L141)

#### Parameters

##### value

`number`

y position according to object's originY property in parent's coordinate plane\
if parent is canvas then this property is identical to [setY](/api/classes/itext/#sety)

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.setRelativeY`

***

### setSelectionEnd()

> **setSelectionEnd**(`index`): `void`

Defined in: [src/shapes/IText/IText.ts:262](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L262)

Sets selection end (right boundary of a selection)

#### Parameters

##### index

`number`

Index to set selection end to

#### Returns

`void`

***

### setSelectionStart()

> **setSelectionStart**(`index`): `void`

Defined in: [src/shapes/IText/IText.ts:253](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L253)

Sets selection start (left boundary of a selection)

#### Parameters

##### index

`number`

Index to set selection start to

#### Returns

`void`

***

### setSelectionStartEndWithShift()

> **setSelectionStartEndWithShift**(`start`, `end`, `newSelection`): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:1089](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L1089)

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

`ITextClickBehavior.setSelectionStartEndWithShift`

***

### setSelectionStyles()

> **setSelectionStyles**(`styles?`, `startIndex?`, `endIndex?`): `void`

Defined in: [src/shapes/IText/IText.ts:326](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L326)

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

#### Overrides

`ITextClickBehavior.setSelectionStyles`

***

### setSubscript()

> **setSubscript**(`start`, `end`): `void`

Defined in: [src/shapes/Text/Text.ts:1432](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L1432)

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

`ITextClickBehavior.setSubscript`

***

### setSuperscript()

> **setSuperscript**(`start`, `end`): `void`

Defined in: [src/shapes/Text/Text.ts:1423](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L1423)

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

`ITextClickBehavior.setSuperscript`

***

### setX()

> **setX**(`value`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:95](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L95)

#### Parameters

##### value

`number`

x position according to object's originX property in canvas coordinate plane

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.setX`

***

### setXY()

> **setXY**(`point`, `originX?`, `originY?`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:165](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L165)

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

`ITextClickBehavior.setXY`

***

### setY()

> **setY**(`value`): `void`

Defined in: [src/shapes/Object/ObjectGeometry.ts:109](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L109)

#### Parameters

##### value

`number`

y position according to object's originY property in canvas coordinate plane

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.setY`

***

### shiftLineStyles()

> **shiftLineStyles**(`lineIndex`, `offset`): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:820](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L820)

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

`ITextClickBehavior.shiftLineStyles`

***

### shouldCache()

> **shouldCache**(): `boolean`

Defined in: [src/shapes/Object/Object.ts:775](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L775)

Decide if the object should cache or not. Create its own cache level
objectCaching is a global flag, wins over everything
needsItsOwnCache should be used when the object drawing method requires
a cache step.
Generally you do not cache objects in groups because the group outside is cached.
Read as: cache if is needed, or if the feature is enabled but we are not already caching.

#### Returns

`boolean`

#### Inherited from

`ITextClickBehavior.shouldCache`

***

### shouldStartDragging()

> **shouldStartDragging**(): `boolean`

Defined in: [src/shapes/IText/ITextClickBehavior.ts:47](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextClickBehavior.ts#L47)

If this method returns true a mouse move operation over a text selection
will not prevent the native mouse event allowing the browser to start a drag operation.
shouldStartDragging can be read 'do not prevent default for mouse move event'
To prevent drag and drop between objects both shouldStartDragging and onDragStart should return false

#### Returns

`boolean`

#### Inherited from

`ITextClickBehavior.shouldStartDragging`

***

### strokeBorders()

> **strokeBorders**(`ctx`, `size`): `void`

Defined in: [src/shapes/Object/InteractiveObject.ts:404](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L404)

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

`ITextClickBehavior.strokeBorders`

***

### styleHas()

> **styleHas**(`property`, `lineIndex?`): `boolean`

Defined in: [src/shapes/Text/StyledText.ts:69](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/StyledText.ts#L69)

Returns true if object has a style property or has it ina specified line
This function is used to detect if a text will use a particular property or not.

#### Parameters

##### property

`StylePropertiesType`

to check for

##### lineIndex?

`number`

to check the style on

#### Returns

`boolean`

#### Inherited from

`ITextClickBehavior.styleHas`

***

### toBlob()

> **toBlob**(`options`): `Promise`\<`null` \| `Blob`\>

Defined in: [src/shapes/Object/Object.ts:1396](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1396)

#### Parameters

##### options

`toDataURLOptions` = `{}`

#### Returns

`Promise`\<`null` \| `Blob`\>

#### Inherited from

`ITextClickBehavior.toBlob`

***

### toCanvasElement()

> **toCanvasElement**(`options?`): `HTMLCanvasElement`

Defined in: [src/shapes/IText/IText.ts:362](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L362)

block cursor/selection logic while rendering the exported canvas

#### Parameters

##### options?

`ObjectToCanvasElementOptions`

#### Returns

`HTMLCanvasElement`

#### Todo

this workaround should be replaced with a more robust solution

#### Overrides

`ITextClickBehavior.toCanvasElement`

***

### toClipPathSVG()

> **toClipPathSVG**(`this`, `reviver?`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:159](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/FabricObjectSVGExportMixin.ts#L159)

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

`ITextClickBehavior.toClipPathSVG`

***

### toDatalessObject()

> **toDatalessObject**(`propertiesToInclude?`): `any`

Defined in: [src/shapes/Object/Object.ts:1849](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1849)

Returns (dataless) object representation of an instance

#### Parameters

##### propertiesToInclude?

`any`[]

Any properties that you might want to additionally include in the output

#### Returns

`any`

Object representation of an instance

#### Inherited from

`ITextClickBehavior.toDatalessObject`

***

### toDataURL()

> **toDataURL**(`options`): `string`

Defined in: [src/shapes/Object/Object.ts:1389](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1389)

Converts an object into a data-url-like string

#### Parameters

##### options

`toDataURLOptions` = `{}`

Options object

#### Returns

`string`

Returns a data: URL containing a representation of the object in the format specified by options.format

#### Inherited from

`ITextClickBehavior.toDataURL`

***

### toggle()

> **toggle**(`property`): `IText`\<`Props`, `SProps`, `EventSpec`\>

Defined in: [src/CommonMethods.ts:46](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/CommonMethods.ts#L46)

Toggles specified property from `true` to `false` or from `false` to `true`

#### Parameters

##### property

`string`

Property to toggle

#### Returns

`IText`\<`Props`, `SProps`, `EventSpec`\>

#### Inherited from

`ITextClickBehavior.toggle`

***

### toJSON()

> **toJSON**(): `any`

Defined in: [src/shapes/Object/Object.ts:1437](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1437)

Returns a JSON representation of an instance

#### Returns

`any`

JSON

#### Inherited from

`ITextClickBehavior.toJSON`

***

### toObject()

> **toObject**\<`T`, `K`\>(`propertiesToInclude?`): `Pick`\<`T`, `K`\> & `SProps`

Defined in: [src/shapes/Text/Text.ts:1785](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L1785)

Returns object representation of an instance

#### Type Parameters

##### T

`T` *extends* `Omit`\<`Props` & [`TClassProperties`](/api/type-aliases/tclassproperties/)\<`IText`\<`Props`, `SProps`, `EventSpec`\>\>, keyof `SProps`\>

##### K

`K` *extends* `string` \| `number` \| `symbol` = `never`

#### Parameters

##### propertiesToInclude?

`K`[] = `[]`

Any properties that you might want to additionally include in the output

#### Returns

`Pick`\<`T`, `K`\> & `SProps`

Object representation of an instance

#### Inherited from

`ITextClickBehavior.toObject`

***

### toString()

> **toString**(): `string`

Defined in: [src/shapes/Text/Text.ts:596](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L596)

Returns string representation of an instance

#### Returns

`string`

String representation of text object

#### Inherited from

`ITextClickBehavior.toString`

***

### toSVG()

> **toSVG**(`this`, `reviver?`): `string`

Defined in: [src/shapes/Object/FabricObjectSVGExportMixin.ts:145](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/FabricObjectSVGExportMixin.ts#L145)

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

`ITextClickBehavior.toSVG`

***

### transform()

> **transform**(`ctx`): `void`

Defined in: [src/shapes/Object/Object.ts:517](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L517)

Transforms context when rendering an object

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Context

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.transform`

***

### transformMatrixKey()

> **transformMatrixKey**(`skipGroup`): `number`[]

Defined in: [src/shapes/Object/ObjectGeometry.ts:455](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L455)

#### Parameters

##### skipGroup

`boolean` = `false`

#### Returns

`number`[]

#### Inherited from

`ITextClickBehavior.transformMatrixKey`

***

### translateToCenterPoint()

> **translateToCenterPoint**(`point`, `originX`, `originY`): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:690](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L690)

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

`ITextClickBehavior.translateToCenterPoint`

***

### translateToGivenOrigin()

> **translateToGivenOrigin**(`point`, `fromOriginX`, `fromOriginY`, `toOriginX`, `toOriginY`): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:662](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L662)

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

`ITextClickBehavior.translateToGivenOrigin`

***

### translateToOriginPoint()

> **translateToOriginPoint**(`center`, `originX`, `originY`): [`Point`](/api/classes/point/)

Defined in: [src/shapes/Object/ObjectGeometry.ts:718](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/ObjectGeometry.ts#L718)

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

`ITextClickBehavior.translateToOriginPoint`

***

### tripleClickHandler()

> **tripleClickHandler**(`options`): `void`

Defined in: [src/shapes/IText/ITextClickBehavior.ts:82](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextClickBehavior.ts#L82)

Default handler for triple click, select a line

#### Parameters

##### options

[`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.tripleClickHandler`

***

### updateSelectionOnMouseMove()

> **updateSelectionOnMouseMove**(`e`): `void`

Defined in: [src/shapes/IText/ITextBehavior.ts:433](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/ITextBehavior.ts#L433)

called by [Canvas#textEditingManager](/api/classes/canvas/#texteditingmanager)

#### Parameters

##### e

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

#### Returns

`void`

#### Inherited from

`ITextClickBehavior.updateSelectionOnMouseMove`

***

### ~~willDrawShadow()~~

> **willDrawShadow**(): `boolean`

Defined in: [src/shapes/Object/Object.ts:788](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L788)

Check if this object will cast a shadow with an offset.
used by Group.shouldCache to know if child has a shadow recursively

:::caution[Deprecated]
This API is no longer supported and may be removed in a future release.
:::

#### Returns

`boolean`

#### Inherited from

`ITextClickBehavior.willDrawShadow`

***

### \_fromObject()

> `static` **\_fromObject**\<`S`\>(`__namedParameters`, `__namedParameters`): `Promise`\<`S`\>

Defined in: [src/shapes/Object/Object.ts:1902](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/Object.ts#L1902)

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

`ITextClickBehavior._fromObject`

***

### createControls()

> `static` **createControls**(): `object`

Defined in: [src/shapes/Object/InteractiveObject.ts:170](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Object/InteractiveObject.ts#L170)

Creates the default control object.
If you prefer to have on instance of controls shared among all objects
make this function return an empty object and add controls to the ownDefaults

#### Returns

`object`

##### controls

> **controls**: `Record`\<`string`, [`Control`](/api/classes/control/)\>

#### Inherited from

`ITextClickBehavior.createControls`

***

### fromElement()

> `static` **fromElement**(`element`, `options?`, `cssRules?`): `Promise`\<[`FabricText`](/api/classes/fabrictext/)\<\{ `fontSize`: `number`; `left`: `number`; `linethrough`: `boolean`; `overline`: `boolean`; `signal?`: `AbortSignal`; `strokeWidth`: `number`; `top`: `number`; `underline`: `boolean`; \}, [`SerializedTextProps`](/api/interfaces/serializedtextprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>\>

Defined in: [src/shapes/Text/Text.ts:1878](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L1878)

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

`ITextClickBehavior.fromElement`

***

### fromObject()

> `static` **fromObject**\<`T`, `S`\>(`object`): `Promise`\<`S`\>

Defined in: [src/shapes/Text/Text.ts:1953](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Text/Text.ts#L1953)

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

`ITextClickBehavior.fromObject`

***

### getDefaults()

> `static` **getDefaults**(): `Record`\<`string`, `any`\>

Defined in: [src/shapes/IText/IText.ts:207](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/IText/IText.ts#L207)

#### Returns

`Record`\<`string`, `any`\>

#### Overrides

`ITextClickBehavior.getDefaults`
