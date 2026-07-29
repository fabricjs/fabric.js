---
editUrl: false
next: false
prev: false
title: "Control"
---

Defined in: [src/controls/Control.ts:31](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L31)

## Constructors

### Constructor

> **new Control**(`options?`): `Control`

Defined in: [src/controls/Control.ts:157](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L157)

#### Parameters

##### options?

`Partial`\<`Control`\>

#### Returns

`Control`

## Properties

### actionHandler

> **actionHandler**: [`TransformActionHandler`](/api/type-aliases/transformactionhandler/)

Defined in: [src/controls/Control.ts:181](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L181)

The control actionHandler, provide one to handle action ( control being moved )

#### Param

the native mouse event

#### Param

properties of the current transform

#### Param

x position of the cursor

#### Param

y position of the cursor

#### Returns

true if the action/event modified the object

***

### actionName

> **actionName**: `string` = `SCALE`

Defined in: [src/controls/Control.ts:53](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L53)

Name of the action that the control will likely execute.
This is optional. FabricJS uses to identify what the user is doing for some
extra optimizations. If you are writing a custom control and you want to know
somewhere else in the code what is going on, you can use this string here.
you can also provide a custom getActionName if your control run multiple actions
depending on some external state.
default to scale since is the most common, used on 4 corners by default

#### Default

```ts
'scale'
```

***

### angle

> **angle**: `number` = `0`

Defined in: [src/controls/Control.ts:62](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L62)

Drawing angle of the control.
NOT used for now, but name marked as needed for internal logic
example: to reuse the same drawing function for different rotated controls

#### Default

```ts
0
```

***

### cursorStyle

> **cursorStyle**: `string` = `'crosshair'`

Defined in: [src/controls/Control.ts:142](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L142)

Css cursor style to display when the control is hovered.
if the method `cursorStyleHandler` is provided, this property is ignored.

#### Default

```ts
'crosshair'
```

***

### mouseDownHandler?

> `optional` **mouseDownHandler**: [`ControlActionHandler`](/api/type-aliases/controlactionhandler/)

Defined in: [src/controls/Control.ts:191](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L191)

The control handler for mouse down, provide one to handle mouse down on control

#### Param

the native mouse event

#### Param

properties of the current transform

#### Param

x position of the cursor

#### Param

y position of the cursor

#### Returns

true if the action/event modified the object

***

### mouseUpHandler?

> `optional` **mouseUpHandler**: [`ControlActionHandler`](/api/type-aliases/controlactionhandler/)

Defined in: [src/controls/Control.ts:201](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L201)

The control mouseUpHandler, provide one to handle an effect on mouse up.

#### Param

the native mouse event

#### Param

properties of the current transform

#### Param

x position of the cursor

#### Param

y position of the cursor

#### Returns

true if the action/event modified the object

***

### offsetX

> **offsetX**: `number` = `0`

Defined in: [src/controls/Control.ts:94](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L94)

Horizontal offset of the control from the defined position. In pixels
Positive offset moves the control to the right, negative to the left.
It used when you want to have position of control that does not scale with
the bounding box. Example: rotation control is placed at x:0, y: 0.5 on
the boundind box, with an offset of 30 pixels vertically. Those 30 pixels will
stay 30 pixels no matter how the object is big. Another example is having 2
controls in the corner, that stay in the same position when the object scale.
of the bounding box.

#### Default

```ts
0
```

***

### offsetY

> **offsetY**: `number` = `0`

Defined in: [src/controls/Control.ts:102](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L102)

Vertical offset of the control from the defined position. In pixels
Positive offset moves the control to the bottom, negative to the top.

#### Default

```ts
0
```

***

### sizeX

> **sizeX**: `number` = `0`

Defined in: [src/controls/Control.ts:110](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L110)

Sets the length of the control. If null, defaults to object's cornerSize.
Expects both sizeX and sizeY to be set when set.

#### Default

```ts
null
```

***

### sizeY

> **sizeY**: `number` = `0`

Defined in: [src/controls/Control.ts:118](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L118)

Sets the height of the control. If null, defaults to object's cornerSize.
Expects both sizeX and sizeY to be set when set.

#### Default

```ts
null
```

***

### touchSizeX

> **touchSizeX**: `number` = `0`

Defined in: [src/controls/Control.ts:126](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L126)

Sets the length of the touch area of the control. If null, defaults to object's touchCornerSize.
Expects both touchSizeX and touchSizeY to be set when set.

#### Default

```ts
null
```

***

### touchSizeY

> **touchSizeY**: `number` = `0`

Defined in: [src/controls/Control.ts:134](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L134)

Sets the height of the touch area of the control. If null, defaults to object's touchCornerSize.
Expects both touchSizeX and touchSizeY to be set when set.

#### Default

```ts
null
```

***

### transformAnchorPoint?

> `optional` **transformAnchorPoint**: `object`

Defined in: [src/controls/Control.ts:152](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L152)

#### x

> **x**: [`TOriginX`](/api/type-aliases/toriginx/)

#### y

> **y**: [`TOriginY`](/api/type-aliases/toriginy/)

***

### visible

> **visible**: `boolean` = `true`

Defined in: [src/controls/Control.ts:40](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L40)

keep track of control visibility.
mainly for backward compatibility.
if you do not want to see a control, you can remove it
from the control set.

#### Default

```ts
true
```

***

### withConnection

> **withConnection**: `boolean` = `false`

Defined in: [src/controls/Control.ts:150](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L150)

If controls has an offsetY or offsetX, draw a line that connects
the control to the bounding box

#### Default

```ts
false
```

***

### x

> **x**: `number` = `0`

Defined in: [src/controls/Control.ts:71](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L71)

Relative position of the control. X
0,0 is the center of the Object, while -0.5 (left) or 0.5 (right) are the extremities
of the bounding box.

#### Default

```ts
0
```

***

### y

> **y**: `number` = `0`

Defined in: [src/controls/Control.ts:80](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L80)

Relative position of the control. Y
0,0 is the center of the Object, while -0.5 (top) or 0.5 (bottom) are the extremities
of the bounding box.

#### Default

```ts
0
```

## Methods

### calcCornerCoords()

> **calcCornerCoords**(`angle`, `objectCornerSize`, `centerX`, `centerY`, `isTouch`, `fabricObject`): `object`

Defined in: [src/controls/Control.ts:340](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L340)

Returns the coords for this control based on object values.

#### Parameters

##### angle

[`TDegree`](/api/type-aliases/tdegree/)

##### objectCornerSize

`number`

cornerSize from the fabric object holding the control (or touchCornerSize if
  isTouch is true)

##### centerX

`number`

x coordinate where the control center should be

##### centerY

`number`

y coordinate where the control center should be

##### isTouch

`boolean`

true if touch corner, false if normal corner

##### fabricObject

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/)

#### Returns

`object`

##### bl

> **bl**: [`Point`](/api/classes/point/)

##### br

> **br**: [`Point`](/api/classes/point/)

##### tl

> **tl**: [`Point`](/api/classes/point/)

##### tr

> **tr**: [`Point`](/api/classes/point/)

***

### commonRenderProps()

> **commonRenderProps**(`ctx`, `left`, `top`, `fabricObject`, `styleOverride`): `object`

Defined in: [src/controls/Control.ts:370](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L370)

This is an helper method to prepare the canvas to render a control
It detectes common control properties and sets the correct fill and
stroke styles on the context. It does not execute translations or
rotations since different controls need differnt combination of these.

#### Parameters

##### ctx

`CanvasRenderingContext2D`

##### left

`number`

##### top

`number`

##### fabricObject

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/)

##### styleOverride

[`ControlRenderingStyleOverride`](/api/type-aliases/controlrenderingstyleoverride/) = `{}`

#### Returns

`object`

##### opName

> **opName**: `"fill"` \| `"stroke"`

##### stroke

> **stroke**: `boolean`

##### transparentCorners

> **transparentCorners**: `boolean`

##### xSize

> **xSize**: `number`

##### ySize

> **ySize**: `number`

***

### cursorStyleHandler()

> **cursorStyleHandler**(`eventData`, `control`, `fabricObject`, `coord`): `string`

Defined in: [src/controls/Control.ts:272](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L272)

Returns control cursorStyle for css using cursorStyle. If you need a more elaborate
function you can pass one in the constructor
the cursorStyle property

#### Parameters

##### eventData

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

the native mouse event

##### control

`Control`

the current control ( likely this)

##### fabricObject

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/)

##### coord

`TOCoord`

#### Returns

`string`

***

### getActionHandler()

> **getActionHandler**(`eventData`, `fabricObject`, `control`): `undefined` \| [`TransformActionHandler`](/api/type-aliases/transformactionhandler/)

Defined in: [src/controls/Control.ts:224](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L224)

Returns control actionHandler

#### Parameters

##### eventData

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

the native mouse event

##### fabricObject

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/)

on which the control is displayed

##### control

`Control`

control for which the action handler is being asked

#### Returns

`undefined` \| [`TransformActionHandler`](/api/type-aliases/transformactionhandler/)

the action handler

***

### getActionName()

> **getActionName**(`eventData`, `control`, `fabricObject`): `string`

Defined in: [src/controls/Control.ts:288](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L288)

Returns the action name. The basic implementation just return the actionName property.

#### Parameters

##### eventData

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

the native mouse event

##### control

`Control`

the current control ( likely this)

##### fabricObject

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/)

#### Returns

`string`

***

### getMouseDownHandler()

> **getMouseDownHandler**(`eventData`, `fabricObject`, `control`): `undefined` \| [`ControlActionHandler`](/api/type-aliases/controlactionhandler/)

Defined in: [src/controls/Control.ts:239](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L239)

Returns control mouseDown handler

#### Parameters

##### eventData

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

the native mouse event

##### fabricObject

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/)

on which the control is displayed

##### control

`Control`

control for which the action handler is being asked

#### Returns

`undefined` \| [`ControlActionHandler`](/api/type-aliases/controlactionhandler/)

the action handler

***

### getMouseUpHandler()

> **getMouseUpHandler**(`eventData`, `fabricObject`, `control`): `undefined` \| [`ControlActionHandler`](/api/type-aliases/controlactionhandler/)

Defined in: [src/controls/Control.ts:255](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L255)

Returns control mouseUp handler.
During actions the fabricObject or the control can be of different obj

#### Parameters

##### eventData

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

the native mouse event

##### fabricObject

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/)

on which the control is displayed

##### control

`Control`

control for which the action handler is being asked

#### Returns

`undefined` \| [`ControlActionHandler`](/api/type-aliases/controlactionhandler/)

the action handler

***

### getTransformAnchorPoint()

> **getTransformAnchorPoint**(): `object`

Defined in: [src/controls/Control.ts:161](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L161)

#### Returns

`object`

##### x

> **x**: [`TOriginX`](/api/type-aliases/toriginx/)

##### y

> **y**: [`TOriginY`](/api/type-aliases/toriginy/)

***

### getVisibility()

> **getVisibility**(`fabricObject`, `controlKey`): `boolean`

Defined in: [src/controls/Control.ts:302](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L302)

Returns controls visibility

#### Parameters

##### fabricObject

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/)

##### controlKey

`string`

key where the control is memorized on the

#### Returns

`boolean`

***

### positionHandler()

> **positionHandler**(`dim`, `finalMatrix`, `fabricObject`, `currentControl`): [`Point`](/api/classes/point/)

Defined in: [src/controls/Control.ts:319](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L319)

#### Parameters

##### dim

[`Point`](/api/classes/point/)

##### finalMatrix

[`TMat2D`](/api/type-aliases/tmat2d/)

##### fabricObject

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/)

##### currentControl

`Control`

#### Returns

[`Point`](/api/classes/point/)

***

### render()

> **render**(`ctx`, `left`, `top`, `styleOverride`, `fabricObject`): `void`

Defined in: [src/controls/Control.ts:421](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L421)

Render function for the control.
When this function runs the context is unscaled. unrotate. Just retina scaled.
all the functions will have to translate to the point left,top before starting Drawing
if they want to draw a control where the position is detected.
left and top are the result of the positionHandler function

#### Parameters

##### ctx

`CanvasRenderingContext2D`

the context where the control will be drawn

##### left

`number`

position of the canvas where we are about to render the control.

##### top

`number`

position of the canvas where we are about to render the control.

##### styleOverride

`undefined` | `Partial`\<`Pick`\<[`InteractiveFabricObject`](/api/classes/interactivefabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>, `"cornerStyle"` \| `"cornerSize"` \| `"cornerColor"` \| `"cornerStrokeColor"` \| `"cornerDashArray"` \| `"transparentCorners"`\>\>

##### fabricObject

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/)

the object where the control is about to be rendered

#### Returns

`void`

***

### setVisibility()

> **setVisibility**(`visibility`, `name?`, `fabricObject?`): `void`

Defined in: [src/controls/Control.ts:311](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L311)

Sets controls visibility

#### Parameters

##### visibility

`boolean`

for the object

##### name?

`string`

##### fabricObject?

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

#### Returns

`void`

***

### shouldActivate()

> **shouldActivate**(`controlKey`, `fabricObject`, `pointer`, `__namedParameters`): `boolean`

Defined in: [src/controls/Control.ts:203](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/Control.ts#L203)

#### Parameters

##### controlKey

`string`

##### fabricObject

[`InteractiveFabricObject`](/api/classes/interactivefabricobject/)

##### pointer

[`Point`](/api/classes/point/)

##### \_\_namedParameters

[`TCornerPoint`](/api/type-aliases/tcornerpoint/)

#### Returns

`boolean`
