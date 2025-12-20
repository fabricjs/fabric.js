---
editUrl: false
next: false
prev: false
title: "ObjectEvents"
---

Defined in: [src/EventTypeDefs.ts:288](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L288)

## Extends

- [`ObjectPointerEvents`](/api/type-aliases/objectpointerevents/).`DnDEvents`.[`MiscEvents`](/api/interfaces/miscevents/).[`ObjectModificationEvents`](/api/type-aliases/objectmodificationevents/)

## Extended by

- [`GroupEvents`](/api/interfaces/groupevents/)

## Properties

### added

> **added**: `object`

Defined in: [src/EventTypeDefs.ts:301](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L301)

#### target

> **target**: [`Canvas`](/api/classes/canvas/) \| [`Group`](/api/classes/group/) \| [`StaticCanvas`](/api/classes/staticcanvas/)\<[`StaticCanvasEvents`](/api/interfaces/staticcanvasevents/)\>

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

### deselected

> **deselected**: `Partial`\<[`TEvent`](/api/interfaces/tevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>\> & `object`

Defined in: [src/EventTypeDefs.ts:297](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L297)

#### Type Declaration

##### target

> **target**: [`FabricObject`](/api/classes/fabricobject/)

***

### drag

> **drag**: [`DragEventData`](/api/interfaces/drageventdata/)

Defined in: [src/EventTypeDefs.ts:203](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L203)

#### Inherited from

`DnDEvents.drag`

***

### dragend

> **dragend**: [`DragEventData`](/api/interfaces/drageventdata/)

Defined in: [src/EventTypeDefs.ts:207](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L207)

#### Inherited from

`DnDEvents.dragend`

***

### dragenter

> **dragenter**: [`DragEventData`](/api/interfaces/drageventdata/) & `InEvent`

Defined in: [src/EventTypeDefs.ts:205](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L205)

#### Inherited from

`DnDEvents.dragenter`

***

### dragleave

> **dragleave**: [`DragEventData`](/api/interfaces/drageventdata/) & `OutEvent`

Defined in: [src/EventTypeDefs.ts:206](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L206)

#### Inherited from

`DnDEvents.dragleave`

***

### dragover

> **dragover**: [`DragEventData`](/api/interfaces/drageventdata/)

Defined in: [src/EventTypeDefs.ts:204](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L204)

#### Inherited from

`DnDEvents.dragover`

***

### dragstart

> **dragstart**: `TEventWithTarget`\<`DragEvent`\>

Defined in: [src/EventTypeDefs.ts:202](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L202)

#### Inherited from

`DnDEvents.dragstart`

***

### drop

> **drop**: [`DropEventData`](/api/interfaces/dropeventdata/)

Defined in: [src/EventTypeDefs.ts:209](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L209)

#### Inherited from

`DnDEvents.drop`

***

### drop:after

> **drop:after**: [`DropEventData`](/api/interfaces/dropeventdata/)

Defined in: [src/EventTypeDefs.ts:210](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L210)

#### Inherited from

`DnDEvents.drop:after`

***

### drop:before

> **drop:before**: [`DropEventData`](/api/interfaces/dropeventdata/)

Defined in: [src/EventTypeDefs.ts:208](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L208)

#### Inherited from

`DnDEvents.drop:before`

***

### erasing:end

> **erasing:end**: `object`

Defined in: [src/EventTypeDefs.ts:305](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L305)

#### path

> **path**: [`FabricObject`](/api/classes/fabricobject/)

***

### modified

> **modified**: [`ModifiedEvent`](/api/interfaces/modifiedevent/)

Defined in: [src/EventTypeDefs.ts:147](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L147)

#### Inherited from

[`ObjectModificationEvents`](/api/type-aliases/objectmodificationevents/).[`modified`](/api/type-aliases/objectmodificationevents/#modified)

***

### modifyPath

> **modifyPath**: [`BasicTransformEvent`](/api/interfaces/basictransformevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & [`ModifyPathEvent`](/api/interfaces/modifypathevent/)

Defined in: [src/EventTypeDefs.ts:146](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L146)

#### Inherited from

[`ObjectModificationEvents`](/api/type-aliases/objectmodificationevents/).[`modifyPath`](/api/type-aliases/objectmodificationevents/#modifypath)

***

### modifyPoly

> **modifyPoly**: [`BasicTransformEvent`](/api/interfaces/basictransformevent/)

Defined in: [src/EventTypeDefs.ts:145](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L145)

#### Inherited from

[`ObjectModificationEvents`](/api/type-aliases/objectmodificationevents/).[`modifyPoly`](/api/type-aliases/objectmodificationevents/#modifypoly)

***

### mousedblclick

> **mousedblclick**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>

#### Inherited from

`ObjectPointerEvents.mousedblclick`

***

### mousedown

> **mousedown**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object`

#### Type Declaration

##### alreadySelected

> **alreadySelected**: `boolean`

Indicates if the target or current target where already selected
before the cycle of mouse down -> mouse up started

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`mousedown`](/api/interfaces/objectevents/#mousedown)

***

### mousedown:before

> **mousedown:before**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>

#### Inherited from

`ObjectPointerEvents.mousedown:before`

***

### mousemove

> **mousemove**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>

#### Inherited from

`ObjectPointerEvents.mousemove`

***

### mousemove:before

> **mousemove:before**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>

#### Inherited from

`ObjectPointerEvents.mousemove:before`

***

### mouseout

> **mouseout**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `OutEvent`

#### Inherited from

`ObjectPointerEvents.mouseout`

***

### mouseover

> **mouseover**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `InEvent`

#### Inherited from

`ObjectPointerEvents.mouseover`

***

### mousetripleclick

> **mousetripleclick**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>

#### Inherited from

`ObjectPointerEvents.mousetripleclick`

***

### mouseup

> **mouseup**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object`

#### Type Declaration

##### isClick

> **isClick**: `boolean`

#### Inherited from

`ObjectPointerEvents.mouseup`

***

### mouseup:before

> **mouseup:before**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object`

#### Type Declaration

##### isClick

> **isClick**: `boolean`

#### Inherited from

`ObjectPointerEvents.mouseup:before`

***

### mousewheel

> **mousewheel**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<`WheelEvent`\>

#### Inherited from

`ObjectPointerEvents.mousewheel`

***

### moving

> **moving**: [`BasicTransformEvent`](/api/interfaces/basictransformevent/)

Defined in: [src/EventTypeDefs.ts:140](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L140)

#### Inherited from

[`ObjectModificationEvents`](/api/type-aliases/objectmodificationevents/).[`moving`](/api/type-aliases/objectmodificationevents/#moving)

***

### pinch

> **pinch**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object`

#### Type Declaration

##### scale

> **scale**: `number`

#### Inherited from

`ObjectPointerEvents.pinch`

***

### removed

> **removed**: `object`

Defined in: [src/EventTypeDefs.ts:302](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L302)

#### target

> **target**: [`Canvas`](/api/classes/canvas/) \| [`Group`](/api/classes/group/) \| [`StaticCanvas`](/api/classes/staticcanvas/)\<[`StaticCanvasEvents`](/api/interfaces/staticcanvasevents/)\>

***

### resizing

> **resizing**: [`BasicTransformEvent`](/api/interfaces/basictransformevent/)

Defined in: [src/EventTypeDefs.ts:144](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L144)

#### Inherited from

[`ObjectModificationEvents`](/api/type-aliases/objectmodificationevents/).[`resizing`](/api/type-aliases/objectmodificationevents/#resizing)

***

### rotate

> **rotate**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object`

#### Type Declaration

##### rotation

> **rotation**: `number`

#### Inherited from

`ObjectPointerEvents.rotate`

***

### rotating

> **rotating**: [`BasicTransformEvent`](/api/interfaces/basictransformevent/)

Defined in: [src/EventTypeDefs.ts:142](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L142)

#### Inherited from

[`ObjectModificationEvents`](/api/type-aliases/objectmodificationevents/).[`rotating`](/api/type-aliases/objectmodificationevents/#rotating)

***

### scaling

> **scaling**: [`BasicTransformEvent`](/api/interfaces/basictransformevent/)

Defined in: [src/EventTypeDefs.ts:141](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L141)

#### Inherited from

[`ObjectModificationEvents`](/api/type-aliases/objectmodificationevents/).[`scaling`](/api/type-aliases/objectmodificationevents/#scaling)

***

### selected

> **selected**: `Partial`\<[`TEvent`](/api/interfaces/tevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>\> & `object`

Defined in: [src/EventTypeDefs.ts:294](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L294)

#### Type Declaration

##### target

> **target**: [`FabricObject`](/api/classes/fabricobject/)

***

### skewing

> **skewing**: [`BasicTransformEvent`](/api/interfaces/basictransformevent/)

Defined in: [src/EventTypeDefs.ts:143](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/EventTypeDefs.ts#L143)

#### Inherited from

[`ObjectModificationEvents`](/api/type-aliases/objectmodificationevents/).[`skewing`](/api/type-aliases/objectmodificationevents/#skewing)
