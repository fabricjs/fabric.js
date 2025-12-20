---
editUrl: false
next: false
prev: false
title: "CanvasEvents"
---

Defined in: [src/EventTypeDefs.ts:319](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L319)

## Extends

- [`StaticCanvasEvents`](/api/interfaces/staticcanvasevents/).[`CanvasPointerEvents`](/api/type-aliases/canvaspointerevents/).`CanvasDnDEvents`.[`MiscEvents`](/api/interfaces/miscevents/).`CanvasModificationEvents`.`CanvasSelectionEvents`

## Properties

### after:render

> **after:render**: `object`

Defined in: [src/EventTypeDefs.ts:314](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L314)

#### ctx

> **ctx**: `CanvasRenderingContext2D`

#### Inherited from

[`StaticCanvasEvents`](/api/interfaces/staticcanvasevents/).[`after:render`](/api/interfaces/staticcanvasevents/#afterrender)

***

### before:path:created

> **before:path:created**: `object`

Defined in: [src/EventTypeDefs.ts:327](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L327)

#### path

> **path**: [`FabricObject`](/api/classes/fabricobject/)

***

### before:render

> **before:render**: `object`

Defined in: [src/EventTypeDefs.ts:313](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L313)

#### ctx

> **ctx**: `CanvasRenderingContext2D`

#### Inherited from

[`StaticCanvasEvents`](/api/interfaces/staticcanvasevents/).[`before:render`](/api/interfaces/staticcanvasevents/#beforerender)

***

### before:selection:cleared

> **before:selection:cleared**: `Partial`\<[`TEvent`](/api/interfaces/tevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>\> & `object`

Defined in: [src/EventTypeDefs.ts:226](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L226)

#### Type Declaration

##### deselected

> **deselected**: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]

#### Inherited from

`CanvasSelectionEvents.before:selection:cleared`

***

### before:transform

> **before:transform**: [`TEvent`](/api/interfaces/tevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object`

Defined in: [src/EventTypeDefs.ts:151](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L151)

#### Type Declaration

##### transform

> **transform**: [`Transform`](/api/type-aliases/transform/)

#### Inherited from

`CanvasModificationEvents.before:transform`

***

### canvas:cleared

> **canvas:cleared**: `never`

Defined in: [src/EventTypeDefs.ts:310](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L310)

#### Inherited from

[`StaticCanvasEvents`](/api/interfaces/staticcanvasevents/).[`canvas:cleared`](/api/interfaces/staticcanvasevents/#canvascleared)

***

### contextmenu

> **contextmenu**: `SimpleEventHandler`\<`Event`\>

Defined in: [src/EventTypeDefs.ts:285](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L285)

#### Inherited from

[`MiscEvents`](/api/interfaces/miscevents/).[`contextmenu`](/api/interfaces/miscevents/#contextmenu)

***

### contextmenu:before

> **contextmenu:before**: `SimpleEventHandler`\<`Event`\>

Defined in: [src/EventTypeDefs.ts:284](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L284)

#### Inherited from

[`MiscEvents`](/api/interfaces/miscevents/).[`contextmenu:before`](/api/interfaces/miscevents/#contextmenubefore)

***

### drag

> **drag**: [`DragEventData`](/api/interfaces/drageventdata/)

Defined in: [src/EventTypeDefs.ts:203](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L203)

#### Inherited from

`CanvasDnDEvents.drag`

***

### drag:enter

> **drag:enter**: [`DragEventData`](/api/interfaces/drageventdata/) & `InEvent`

Defined in: [src/EventTypeDefs.ts:214](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L214)

#### Inherited from

`CanvasDnDEvents.drag:enter`

***

### drag:leave

> **drag:leave**: [`DragEventData`](/api/interfaces/drageventdata/) & `OutEvent`

Defined in: [src/EventTypeDefs.ts:215](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L215)

#### Inherited from

`CanvasDnDEvents.drag:leave`

***

### dragend

> **dragend**: [`DragEventData`](/api/interfaces/drageventdata/)

Defined in: [src/EventTypeDefs.ts:207](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L207)

#### Inherited from

`CanvasDnDEvents.dragend`

***

### dragenter

> **dragenter**: [`DragEventData`](/api/interfaces/drageventdata/) & `InEvent`

Defined in: [src/EventTypeDefs.ts:205](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L205)

#### Inherited from

`CanvasDnDEvents.dragenter`

***

### dragleave

> **dragleave**: [`DragEventData`](/api/interfaces/drageventdata/) & `OutEvent`

Defined in: [src/EventTypeDefs.ts:206](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L206)

#### Inherited from

`CanvasDnDEvents.dragleave`

***

### dragover

> **dragover**: [`DragEventData`](/api/interfaces/drageventdata/)

Defined in: [src/EventTypeDefs.ts:204](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L204)

#### Inherited from

`CanvasDnDEvents.dragover`

***

### dragstart

> **dragstart**: `TEventWithTarget`\<`DragEvent`\>

Defined in: [src/EventTypeDefs.ts:202](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L202)

#### Inherited from

`CanvasDnDEvents.dragstart`

***

### drop

> **drop**: [`DropEventData`](/api/interfaces/dropeventdata/)

Defined in: [src/EventTypeDefs.ts:209](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L209)

#### Inherited from

`CanvasDnDEvents.drop`

***

### drop:after

> **drop:after**: [`DropEventData`](/api/interfaces/dropeventdata/)

Defined in: [src/EventTypeDefs.ts:210](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L210)

#### Inherited from

`CanvasDnDEvents.drop:after`

***

### drop:before

> **drop:before**: [`DropEventData`](/api/interfaces/dropeventdata/)

Defined in: [src/EventTypeDefs.ts:208](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L208)

#### Inherited from

`CanvasDnDEvents.drop:before`

***

### erasing:end

> **erasing:end**: `object`

Defined in: [src/EventTypeDefs.ts:332](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L332)

#### drawables

> **drawables**: `object`

##### drawables.backgroundImage?

> `optional` **backgroundImage**: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

##### drawables.overlayImage?

> `optional` **overlayImage**: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

#### path

> **path**: [`FabricObject`](/api/classes/fabricobject/)

#### subTargets

> **subTargets**: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]

#### targets

> **targets**: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]

***

### erasing:start

> **erasing:start**: `never`

Defined in: [src/EventTypeDefs.ts:331](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L331)

***

### mouse:dblclick

> **mouse:dblclick**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>

#### Inherited from

`CanvasPointerEvents.mouse:dblclick`

***

### mouse:down

> **mouse:down**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object`

#### Type Declaration

##### alreadySelected

> **alreadySelected**: `boolean`

Indicates if the target or current target where already selected
before the cycle of mouse down -> mouse up started

#### Inherited from

[`CanvasEvents`](/api/interfaces/canvasevents/).[`mouse:down`](/api/interfaces/canvasevents/#mousedown)

***

### mouse:down:before

> **mouse:down:before**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>

#### Inherited from

`CanvasPointerEvents.mouse:down:before`

***

### mouse:move

> **mouse:move**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>

#### Inherited from

`CanvasPointerEvents.mouse:move`

***

### mouse:move:before

> **mouse:move:before**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>

#### Inherited from

`CanvasPointerEvents.mouse:move:before`

***

### mouse:out

> **mouse:out**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `OutEvent`

#### Inherited from

`CanvasPointerEvents.mouse:out`

***

### mouse:over

> **mouse:over**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `InEvent`

#### Inherited from

`CanvasPointerEvents.mouse:over`

***

### mouse:tripleclick

> **mouse:tripleclick**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>

#### Inherited from

`CanvasPointerEvents.mouse:tripleclick`

***

### mouse:up

> **mouse:up**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object`

#### Type Declaration

##### isClick

> **isClick**: `boolean`

#### Inherited from

`CanvasPointerEvents.mouse:up`

***

### mouse:up:before

> **mouse:up:before**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object`

#### Type Declaration

##### isClick

> **isClick**: `boolean`

#### Inherited from

`CanvasPointerEvents.mouse:up:before`

***

### mouse:wheel

> **mouse:wheel**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<`WheelEvent`\>

#### Inherited from

`CanvasPointerEvents.mouse:wheel`

***

### object:added

> **object:added**: `object`

Defined in: [src/EventTypeDefs.ts:235](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L235)

#### target

> **target**: [`FabricObject`](/api/classes/fabricobject/)

#### Inherited from

[`StaticCanvasEvents`](/api/interfaces/staticcanvasevents/).[`object:added`](/api/interfaces/staticcanvasevents/#objectadded)

***

### object:layout:after

> **object:layout:after**: [`LayoutAfterEvent`](/api/type-aliases/layoutafterevent/) & `object`

Defined in: [src/EventTypeDefs.ts:316](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L316)

#### Type Declaration

##### target

> **target**: [`Group`](/api/classes/group/)

#### Inherited from

[`StaticCanvasEvents`](/api/interfaces/staticcanvasevents/).[`object:layout:after`](/api/interfaces/staticcanvasevents/#objectlayoutafter)

***

### object:layout:before

> **object:layout:before**: [`LayoutBeforeEvent`](/api/type-aliases/layoutbeforeevent/) & `object`

Defined in: [src/EventTypeDefs.ts:315](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L315)

#### Type Declaration

##### target

> **target**: [`Group`](/api/classes/group/)

#### Inherited from

[`StaticCanvasEvents`](/api/interfaces/staticcanvasevents/).[`object:layout:before`](/api/interfaces/staticcanvasevents/#objectlayoutbefore)

***

### object:modified

> **object:modified**: [`ModifiedEvent`](/api/interfaces/modifiedevent/)

Defined in: [src/EventTypeDefs.ts:161](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L161)

#### Inherited from

`CanvasModificationEvents.object:modified`

***

### object:modifyPath

> **object:modifyPath**: [`BasicTransformEvent`](/api/interfaces/basictransformevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object` & [`ModifyPathEvent`](/api/interfaces/modifypathevent/)

Defined in: [src/EventTypeDefs.ts:158](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L158)

#### Type Declaration

##### target

> **target**: [`FabricObject`](/api/classes/fabricobject/)

#### Inherited from

`CanvasModificationEvents.object:modifyPath`

***

### object:modifyPoly

> **object:modifyPoly**: [`BasicTransformEvent`](/api/interfaces/basictransformevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object`

Defined in: [src/EventTypeDefs.ts:157](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L157)

#### Type Declaration

##### target

> **target**: [`FabricObject`](/api/classes/fabricobject/)

#### Inherited from

`CanvasModificationEvents.object:modifyPoly`

***

### object:moving

> **object:moving**: [`BasicTransformEvent`](/api/interfaces/basictransformevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object`

Defined in: [src/EventTypeDefs.ts:152](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L152)

#### Type Declaration

##### target

> **target**: [`FabricObject`](/api/classes/fabricobject/)

#### Inherited from

`CanvasModificationEvents.object:moving`

***

### object:removed

> **object:removed**: `object`

Defined in: [src/EventTypeDefs.ts:236](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L236)

#### target

> **target**: [`FabricObject`](/api/classes/fabricobject/)

#### Inherited from

[`StaticCanvasEvents`](/api/interfaces/staticcanvasevents/).[`object:removed`](/api/interfaces/staticcanvasevents/#objectremoved)

***

### object:resizing

> **object:resizing**: [`BasicTransformEvent`](/api/interfaces/basictransformevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object`

Defined in: [src/EventTypeDefs.ts:156](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L156)

#### Type Declaration

##### target

> **target**: [`FabricObject`](/api/classes/fabricobject/)

#### Inherited from

`CanvasModificationEvents.object:resizing`

***

### object:rotating

> **object:rotating**: [`BasicTransformEvent`](/api/interfaces/basictransformevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object`

Defined in: [src/EventTypeDefs.ts:154](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L154)

#### Type Declaration

##### target

> **target**: [`FabricObject`](/api/classes/fabricobject/)

#### Inherited from

`CanvasModificationEvents.object:rotating`

***

### object:scaling

> **object:scaling**: [`BasicTransformEvent`](/api/interfaces/basictransformevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object`

Defined in: [src/EventTypeDefs.ts:153](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L153)

#### Type Declaration

##### target

> **target**: [`FabricObject`](/api/classes/fabricobject/)

#### Inherited from

`CanvasModificationEvents.object:scaling`

***

### object:skewing

> **object:skewing**: [`BasicTransformEvent`](/api/interfaces/basictransformevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object`

Defined in: [src/EventTypeDefs.ts:155](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L155)

#### Type Declaration

##### target

> **target**: [`FabricObject`](/api/classes/fabricobject/)

#### Inherited from

`CanvasModificationEvents.object:skewing`

***

### path:created

> **path:created**: `object`

Defined in: [src/EventTypeDefs.ts:328](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L328)

#### path

> **path**: [`FabricObject`](/api/classes/fabricobject/)

***

### pinch

> **pinch**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object`

#### Type Declaration

##### scale

> **scale**: `number`

#### Inherited from

`CanvasPointerEvents.pinch`

***

### rotate

> **rotate**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object`

#### Type Declaration

##### rotation

> **rotation**: `number`

#### Inherited from

`CanvasPointerEvents.rotate`

***

### selection:cleared

> **selection:cleared**: `Partial`\<[`TEvent`](/api/interfaces/tevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>\> & `object`

Defined in: [src/EventTypeDefs.ts:229](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L229)

#### Type Declaration

##### deselected

> **deselected**: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]

#### Inherited from

`CanvasSelectionEvents.selection:cleared`

***

### selection:created

> **selection:created**: `Partial`\<[`TEvent`](/api/interfaces/tevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>\> & `object`

Defined in: [src/EventTypeDefs.ts:219](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L219)

#### Type Declaration

##### selected

> **selected**: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]

#### Inherited from

`CanvasSelectionEvents.selection:created`

***

### selection:updated

> **selection:updated**: `Partial`\<[`TEvent`](/api/interfaces/tevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>\> & `object`

Defined in: [src/EventTypeDefs.ts:222](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L222)

#### Type Declaration

##### deselected

> **deselected**: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]

##### selected

> **selected**: [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]

#### Inherited from

`CanvasSelectionEvents.selection:updated`

***

### text:changed

> **text:changed**: `object`

Defined in: [src/EventTypeDefs.ts:346](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L346)

#### target

> **target**: [`IText`](/api/classes/itext/)

***

### text:editing:entered

> **text:editing:entered**: `object` & `Partial`\<[`TEvent`](/api/interfaces/tevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>\>

Defined in: [src/EventTypeDefs.ts:347](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L347)

#### Type Declaration

##### target

> **target**: [`IText`](/api/classes/itext/)

***

### text:editing:exited

> **text:editing:exited**: `object`

Defined in: [src/EventTypeDefs.ts:348](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L348)

#### target

> **target**: [`IText`](/api/classes/itext/)

***

### text:selection:changed

> **text:selection:changed**: `object`

Defined in: [src/EventTypeDefs.ts:345](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L345)

#### target

> **target**: [`IText`](/api/classes/itext/)
