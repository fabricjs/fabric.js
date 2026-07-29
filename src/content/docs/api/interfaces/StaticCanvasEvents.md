---
editUrl: false
next: false
prev: false
title: "StaticCanvasEvents"
---

Defined in: [src/EventTypeDefs.ts:315](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L315)

## Extends

- [`CollectionEvents`](/api/interfaces/collectionevents/)

## Extended by

- [`CanvasEvents`](/api/interfaces/canvasevents/)

## Properties

### after:render

> **after:render**: `object`

Defined in: [src/EventTypeDefs.ts:321](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L321)

#### ctx

> **ctx**: `CanvasRenderingContext2D`

***

### before:render

> **before:render**: `object`

Defined in: [src/EventTypeDefs.ts:320](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L320)

#### ctx

> **ctx**: `CanvasRenderingContext2D`

***

### canvas:cleared

> **canvas:cleared**: `never`

Defined in: [src/EventTypeDefs.ts:317](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L317)

***

### object:added

> **object:added**: `object`

Defined in: [src/EventTypeDefs.ts:244](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L244)

#### target

> **target**: [`FabricObject`](/api/classes/fabricobject/)

#### Inherited from

[`CollectionEvents`](/api/interfaces/collectionevents/).[`object:added`](/api/interfaces/collectionevents/#objectadded)

***

### object:layout:after

> **object:layout:after**: [`LayoutAfterEvent`](/api/type-aliases/layoutafterevent/) & `object`

Defined in: [src/EventTypeDefs.ts:323](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L323)

#### Type Declaration

##### target

> **target**: [`Group`](/api/classes/group/)

***

### object:layout:before

> **object:layout:before**: [`LayoutBeforeEvent`](/api/type-aliases/layoutbeforeevent/) & `object`

Defined in: [src/EventTypeDefs.ts:322](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L322)

#### Type Declaration

##### target

> **target**: [`Group`](/api/classes/group/)

***

### object:removed

> **object:removed**: `object`

Defined in: [src/EventTypeDefs.ts:245](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/EventTypeDefs.ts#L245)

#### target

> **target**: [`FabricObject`](/api/classes/fabricobject/)

#### Inherited from

[`CollectionEvents`](/api/interfaces/collectionevents/).[`object:removed`](/api/interfaces/collectionevents/#objectremoved)
