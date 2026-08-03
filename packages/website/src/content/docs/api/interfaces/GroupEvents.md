---
editUrl: false
next: false
prev: false
title: "GroupEvents"
---

Defined in: [src/shapes/Group.ts:50](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Group.ts#L50)

## Extends

- [`ObjectEvents`](/api/interfaces/objectevents/).[`CollectionEvents`](/api/interfaces/collectionevents/)

## Properties

### added

> **added**: `object`

Defined in: [src/EventTypeDefs.ts:307](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L307)

#### target

> **target**: [`Canvas`](/api/classes/canvas/) \| [`Group`](/api/classes/group/) \| [`StaticCanvas`](/api/classes/staticcanvas/)\<[`StaticCanvasEvents`](/api/interfaces/staticcanvasevents/)\>

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`added`](/api/interfaces/objectevents/#added)

***

### before:render

> **before:render**: `object`

Defined in: [src/EventTypeDefs.ts:312](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L312)

#### ctx

> **ctx**: `CanvasRenderingContext2D`

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`before:render`](/api/interfaces/objectevents/#beforerender)

***

### contextmenu

> **contextmenu**: `SimpleEventHandler`\<`Event`\>

Defined in: [src/EventTypeDefs.ts:294](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L294)

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`contextmenu`](/api/interfaces/objectevents/#contextmenu)

***

### contextmenu:before

> **contextmenu:before**: `SimpleEventHandler`\<`Event`\>

Defined in: [src/EventTypeDefs.ts:293](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L293)

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`contextmenu:before`](/api/interfaces/objectevents/#contextmenubefore)

***

### deselected

> **deselected**: `Partial`\<[`TEvent`](/api/interfaces/tevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>\> & `object`

Defined in: [src/EventTypeDefs.ts:303](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L303)

#### Type Declaration

##### target

> **target**: [`FabricObject`](/api/classes/fabricobject/)

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`deselected`](/api/interfaces/objectevents/#deselected)

***

### drag

> **drag**: [`DragEventData`](/api/interfaces/drageventdata/)

Defined in: [src/EventTypeDefs.ts:212](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L212)

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`drag`](/api/interfaces/objectevents/#drag)

***

### dragend

> **dragend**: [`DragEventData`](/api/interfaces/drageventdata/)

Defined in: [src/EventTypeDefs.ts:216](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L216)

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`dragend`](/api/interfaces/objectevents/#dragend)

***

### dragenter

> **dragenter**: [`DragEventData`](/api/interfaces/drageventdata/) & `InEvent`

Defined in: [src/EventTypeDefs.ts:214](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L214)

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`dragenter`](/api/interfaces/objectevents/#dragenter)

***

### dragleave

> **dragleave**: [`DragEventData`](/api/interfaces/drageventdata/) & `OutEvent`

Defined in: [src/EventTypeDefs.ts:215](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L215)

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`dragleave`](/api/interfaces/objectevents/#dragleave)

***

### dragover

> **dragover**: [`DragEventData`](/api/interfaces/drageventdata/)

Defined in: [src/EventTypeDefs.ts:213](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L213)

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`dragover`](/api/interfaces/objectevents/#dragover)

***

### dragstart

> **dragstart**: `TEventWithTarget`\<`DragEvent`\>

Defined in: [src/EventTypeDefs.ts:211](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L211)

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`dragstart`](/api/interfaces/objectevents/#dragstart)

***

### drop

> **drop**: [`DropEventData`](/api/interfaces/dropeventdata/)

Defined in: [src/EventTypeDefs.ts:218](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L218)

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`drop`](/api/interfaces/objectevents/#drop)

***

### drop:after

> **drop:after**: [`DropEventData`](/api/interfaces/dropeventdata/)

Defined in: [src/EventTypeDefs.ts:219](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L219)

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`drop:after`](/api/interfaces/objectevents/#dropafter)

***

### drop:before

> **drop:before**: [`DropEventData`](/api/interfaces/dropeventdata/)

Defined in: [src/EventTypeDefs.ts:217](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L217)

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`drop:before`](/api/interfaces/objectevents/#dropbefore)

***

### erasing:end

> **erasing:end**: `object`

Defined in: [src/EventTypeDefs.ts:311](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L311)

#### path

> **path**: [`FabricObject`](/api/classes/fabricobject/)

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`erasing:end`](/api/interfaces/objectevents/#erasingend)

***

### layout:after

> **layout:after**: [`LayoutAfterEvent`](/api/type-aliases/layoutafterevent/)

Defined in: [src/shapes/Group.ts:52](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Group.ts#L52)

***

### layout:before

> **layout:before**: [`LayoutBeforeEvent`](/api/type-aliases/layoutbeforeevent/)

Defined in: [src/shapes/Group.ts:51](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/shapes/Group.ts#L51)

***

### modified

> **modified**: [`ModifiedEvent`](/api/interfaces/modifiedevent/)

Defined in: [src/EventTypeDefs.ts:150](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L150)

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`modified`](/api/interfaces/objectevents/#modified)

***

### modifyPath

> **modifyPath**: [`BasicTransformEvent`](/api/interfaces/basictransformevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & [`ModifyPathEvent`](/api/interfaces/modifypathevent/)

Defined in: [src/EventTypeDefs.ts:149](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L149)

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`modifyPath`](/api/interfaces/objectevents/#modifypath)

***

### modifyPoly

> **modifyPoly**: [`BasicTransformEvent`](/api/interfaces/basictransformevent/)

Defined in: [src/EventTypeDefs.ts:148](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L148)

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`modifyPoly`](/api/interfaces/objectevents/#modifypoly)

***

### mousedblclick

> **mousedblclick**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`mousedblclick`](/api/interfaces/objectevents/#mousedblclick)

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

[`ObjectEvents`](/api/interfaces/objectevents/).[`mousedown:before`](/api/interfaces/objectevents/#mousedownbefore)

***

### mousemove

> **mousemove**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`mousemove`](/api/interfaces/objectevents/#mousemove)

***

### mousemove:before

> **mousemove:before**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`mousemove:before`](/api/interfaces/objectevents/#mousemovebefore)

***

### mouseout

> **mouseout**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `OutEvent`

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`mouseout`](/api/interfaces/objectevents/#mouseout)

***

### mouseover

> **mouseover**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `InEvent`

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`mouseover`](/api/interfaces/objectevents/#mouseover)

***

### mousetripleclick

> **mousetripleclick**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`mousetripleclick`](/api/interfaces/objectevents/#mousetripleclick)

***

### mouseup

> **mouseup**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object`

#### Type Declaration

##### isClick

> **isClick**: `boolean`

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`mouseup`](/api/interfaces/objectevents/#mouseup)

***

### mouseup:before

> **mouseup:before**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object`

#### Type Declaration

##### isClick

> **isClick**: `boolean`

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`mouseup:before`](/api/interfaces/objectevents/#mouseupbefore)

***

### mousewheel

> **mousewheel**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<`WheelEvent`\>

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`mousewheel`](/api/interfaces/objectevents/#mousewheel)

***

### moving

> **moving**: [`BasicTransformEvent`](/api/interfaces/basictransformevent/)

Defined in: [src/EventTypeDefs.ts:143](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L143)

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`moving`](/api/interfaces/objectevents/#moving)

***

### object:added

> **object:added**: `object`

Defined in: [src/EventTypeDefs.ts:244](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L244)

#### target

> **target**: [`FabricObject`](/api/classes/fabricobject/)

#### Inherited from

[`CollectionEvents`](/api/interfaces/collectionevents/).[`object:added`](/api/interfaces/collectionevents/#objectadded)

***

### object:removed

> **object:removed**: `object`

Defined in: [src/EventTypeDefs.ts:245](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L245)

#### target

> **target**: [`FabricObject`](/api/classes/fabricobject/)

#### Inherited from

[`CollectionEvents`](/api/interfaces/collectionevents/).[`object:removed`](/api/interfaces/collectionevents/#objectremoved)

***

### pinch

> **pinch**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object`

#### Type Declaration

##### scale

> **scale**: `number`

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`pinch`](/api/interfaces/objectevents/#pinch)

***

### removed

> **removed**: `object`

Defined in: [src/EventTypeDefs.ts:308](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L308)

#### target

> **target**: [`Canvas`](/api/classes/canvas/) \| [`Group`](/api/classes/group/) \| [`StaticCanvas`](/api/classes/staticcanvas/)\<[`StaticCanvasEvents`](/api/interfaces/staticcanvasevents/)\>

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`removed`](/api/interfaces/objectevents/#removed)

***

### resizing

> **resizing**: [`BasicTransformEvent`](/api/interfaces/basictransformevent/)

Defined in: [src/EventTypeDefs.ts:147](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L147)

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`resizing`](/api/interfaces/objectevents/#resizing)

***

### rotate

> **rotate**: [`TPointerEventInfo`](/api/interfaces/tpointereventinfo/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\> & `object`

#### Type Declaration

##### rotation

> **rotation**: `number`

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`rotate`](/api/interfaces/objectevents/#rotate)

***

### rotating

> **rotating**: [`BasicTransformEvent`](/api/interfaces/basictransformevent/)

Defined in: [src/EventTypeDefs.ts:145](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L145)

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`rotating`](/api/interfaces/objectevents/#rotating)

***

### scaling

> **scaling**: [`BasicTransformEvent`](/api/interfaces/basictransformevent/)

Defined in: [src/EventTypeDefs.ts:144](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L144)

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`scaling`](/api/interfaces/objectevents/#scaling)

***

### selected

> **selected**: `Partial`\<[`TEvent`](/api/interfaces/tevent/)\<[`TPointerEvent`](/api/type-aliases/tpointerevent/)\>\> & `object`

Defined in: [src/EventTypeDefs.ts:300](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L300)

#### Type Declaration

##### target

> **target**: [`FabricObject`](/api/classes/fabricobject/)

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`selected`](/api/interfaces/objectevents/#selected)

***

### skewing

> **skewing**: [`BasicTransformEvent`](/api/interfaces/basictransformevent/)

Defined in: [src/EventTypeDefs.ts:146](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L146)

#### Inherited from

[`ObjectEvents`](/api/interfaces/objectevents/).[`skewing`](/api/interfaces/objectevents/#skewing)
