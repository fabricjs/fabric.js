---
editUrl: false
next: false
prev: false
title: "ObjectEvents"
---

Defined in: [EventTypeDefs.ts:297](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/EventTypeDefs.ts#L297)

## Extends

- [`ObjectPointerEvents`](/api/type-aliases/objectpointerevents/).`DnDEvents`.[`MiscEvents`](/api/interfaces/miscevents/).[`ObjectModificationEvents`](/api/type-aliases/objectmodificationevents/)

## Extended by

- [`GroupEvents`](/api/interfaces/groupevents/)

## Properties

### added

> **added**: `object`

Defined in: [EventTypeDefs.ts:307](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/EventTypeDefs.ts#L307)

#### target

> **target**: [`Canvas`](/api/classes/canvas/) \| [`Group`](/api/classes/group/) \| [`StaticCanvas`](/api/classes/staticcanvas/)\<[`StaticCanvasEvents`](/api/interfaces/staticcanvasevents/)\>

***

### before:render

> **before:render**: `object`

Defined in: [EventTypeDefs.ts:312](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/EventTypeDefs.ts#L312)

#### ctx

> **ctx**: `CanvasRenderingContext2D`

***

### contextmenu

> **contextmenu**: `SimpleEventHandler`\<`Event`\>

Defined in: [EventTypeDefs.ts:294](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/EventTypeDefs.ts#L294)

#### Inherited from

[`MiscEvents`](/api/interfaces/miscevents/).[`contextmenu`](/api/interfaces/miscevents/#contextmenu)

***

### contextmenu:before

> **contextmenu:before**: `SimpleEventHandler`\<`Event`\>

Defined in: [EventTypeDefs.ts:293](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/EventTypeDefs.ts#L293)

#### Inherited from

[`MiscEvents`](/api/interfaces/miscevents/).[`contextmenu:before`](/api/interfaces/miscevents/#contextmenubefore)

***

### deselected

> **deselected**: `Partial`\<[`TEvent`](/api/interfaces/tevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>\> & `object`

Defined in: [EventTypeDefs.ts:303](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/EventTypeDefs.ts#L303)

#### Type Declaration

##### target

> **target**: [`FabricObject`](/api/classes/fabricobject/)

***

### drag

> **drag**: [`DragEventData`](/api/interfaces/drageventdata/)

Defined in: [EventTypeDefs.ts:212](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/EventTypeDefs.ts#L212)

#### Inherited from

`DnDEvents.drag`

***

### dragend

> **dragend**: [`DragEventData`](/api/interfaces/drageventdata/)

Defined in: [EventTypeDefs.ts:216](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/EventTypeDefs.ts#L216)

#### Inherited from

`DnDEvents.dragend`

***

### dragenter

> **dragenter**: [`DragEventData`](/api/interfaces/drageventdata/) & `InEvent`

Defined in: [EventTypeDefs.ts:214](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/EventTypeDefs.ts#L214)

#### Inherited from

`DnDEvents.dragenter`

***

### dragleave

> **dragleave**: [`DragEventData`](/api/interfaces/drageventdata/) & `OutEvent`

Defined in: [EventTypeDefs.ts:215](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/EventTypeDefs.ts#L215)

#### Inherited from

`DnDEvents.dragleave`

***

### dragover

> **dragover**: [`DragEventData`](/api/interfaces/drageventdata/)

Defined in: [EventTypeDefs.ts:213](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/EventTypeDefs.ts#L213)

#### Inherited from

`DnDEvents.dragover`

***

### dragstart

> **dragstart**: `TEventWithTarget`\<`DragEvent`\>

Defined in: [EventTypeDefs.ts:211](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/EventTypeDefs.ts#L211)

#### Inherited from

`DnDEvents.dragstart`

***

### drop

> **drop**: [`DropEventData`](/api/interfaces/dropeventdata/)

Defined in: [EventTypeDefs.ts:218](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/EventTypeDefs.ts#L218)

#### Inherited from

`DnDEvents.drop`

***

### drop:after

> **drop:after**: [`DropEventData`](/api/interfaces/dropeventdata/)

Defined in: [EventTypeDefs.ts:219](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/EventTypeDefs.ts#L219)

#### Inherited from

`DnDEvents.drop:after`

***

### drop:before

> **drop:before**: [`DropEventData`](/api/interfaces/dropeventdata/)

Defined in: [EventTypeDefs.ts:217](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/EventTypeDefs.ts#L217)

#### Inherited from

`DnDEvents.drop:before`

***

### erasing:end

> **erasing:end**: `object`

Defined in: [EventTypeDefs.ts:311](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/EventTypeDefs.ts#L311)

#### path

> **path**: [`FabricObject`](/api/classes/fabricobject/)

***

### modified

> **modified**: [`ModifiedEvent`](/api/interfaces/modifiedevent/)

Defined in: [EventTypeDefs.ts:150](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/EventTypeDefs.ts#L150)

#### Inherited from

`ObjectModificationEvents.modified`

***

### modifyPath

> **modifyPath**: [`BasicTransformEvent`](/api/interfaces/basictransformevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & [`ModifyPathEvent`](/api/interfaces/modifypathevent/)

Defined in: [EventTypeDefs.ts:149](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/EventTypeDefs.ts#L149)

#### Inherited from

`ObjectModificationEvents.modifyPath`

***

### modifyPoly

> **modifyPoly**: [`BasicTransformEvent`](/api/interfaces/basictransformevent/)

Defined in: [EventTypeDefs.ts:148](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/EventTypeDefs.ts#L148)

#### Inherited from

`ObjectModificationEvents.modifyPoly`

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

Defined in: [EventTypeDefs.ts:143](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/EventTypeDefs.ts#L143)

#### Inherited from

`ObjectModificationEvents.moving`

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

Defined in: [EventTypeDefs.ts:308](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/EventTypeDefs.ts#L308)

#### target

> **target**: [`Canvas`](/api/classes/canvas/) \| [`Group`](/api/classes/group/) \| [`StaticCanvas`](/api/classes/staticcanvas/)\<[`StaticCanvasEvents`](/api/interfaces/staticcanvasevents/)\>

***

### resizing

> **resizing**: [`BasicTransformEvent`](/api/interfaces/basictransformevent/)

Defined in: [EventTypeDefs.ts:147](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/EventTypeDefs.ts#L147)

#### Inherited from

`ObjectModificationEvents.resizing`

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

Defined in: [EventTypeDefs.ts:145](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/EventTypeDefs.ts#L145)

#### Inherited from

`ObjectModificationEvents.rotating`

***

### scaling

> **scaling**: [`BasicTransformEvent`](/api/interfaces/basictransformevent/)

Defined in: [EventTypeDefs.ts:144](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/EventTypeDefs.ts#L144)

#### Inherited from

`ObjectModificationEvents.scaling`

***

### selected

> **selected**: `Partial`\<[`TEvent`](/api/interfaces/tevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>\> & `object`

Defined in: [EventTypeDefs.ts:300](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/EventTypeDefs.ts#L300)

#### Type Declaration

##### target

> **target**: [`FabricObject`](/api/classes/fabricobject/)

***

### skewing

> **skewing**: [`BasicTransformEvent`](/api/interfaces/basictransformevent/)

Defined in: [EventTypeDefs.ts:146](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/EventTypeDefs.ts#L146)

#### Inherited from

`ObjectModificationEvents.skewing`
