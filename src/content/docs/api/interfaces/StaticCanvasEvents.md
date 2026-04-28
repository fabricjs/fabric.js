---
editUrl: false
next: false
prev: false
title: "StaticCanvasEvents"
---

Defined in: [src/EventTypeDefs.ts:311](https://github.com/fabricjs/fabric.js/blob/22fda4575b9a171e8efe201e21ee2bd9d77651b8/src/EventTypeDefs.ts#L311)

## Extends

- [`CollectionEvents`](/api/interfaces/collectionevents/)

## Extended by

- [`CanvasEvents`](/api/interfaces/canvasevents/)

## Properties

### after:render

> **after:render**: `object`

Defined in: [src/EventTypeDefs.ts:317](https://github.com/fabricjs/fabric.js/blob/22fda4575b9a171e8efe201e21ee2bd9d77651b8/src/EventTypeDefs.ts#L317)

#### ctx

> **ctx**: `CanvasRenderingContext2D`

***

### before:render

> **before:render**: `object`

Defined in: [src/EventTypeDefs.ts:316](https://github.com/fabricjs/fabric.js/blob/22fda4575b9a171e8efe201e21ee2bd9d77651b8/src/EventTypeDefs.ts#L316)

#### ctx

> **ctx**: `CanvasRenderingContext2D`

***

### canvas:cleared

> **canvas:cleared**: `never`

Defined in: [src/EventTypeDefs.ts:313](https://github.com/fabricjs/fabric.js/blob/22fda4575b9a171e8efe201e21ee2bd9d77651b8/src/EventTypeDefs.ts#L313)

***

### object:added

> **object:added**: `object`

Defined in: [src/EventTypeDefs.ts:240](https://github.com/fabricjs/fabric.js/blob/22fda4575b9a171e8efe201e21ee2bd9d77651b8/src/EventTypeDefs.ts#L240)

#### target

> **target**: [`FabricObject`](/api/classes/fabricobject/)

#### Inherited from

[`CollectionEvents`](/api/interfaces/collectionevents/).[`object:added`](/api/interfaces/collectionevents/#objectadded)

***

### object:layout:after

> **object:layout:after**: [`LayoutAfterEvent`](/api/type-aliases/layoutafterevent/) & `object`

Defined in: [src/EventTypeDefs.ts:319](https://github.com/fabricjs/fabric.js/blob/22fda4575b9a171e8efe201e21ee2bd9d77651b8/src/EventTypeDefs.ts#L319)

#### Type Declaration

##### target

> **target**: [`Group`](/api/classes/group/)

***

### object:layout:before

> **object:layout:before**: [`LayoutBeforeEvent`](/api/type-aliases/layoutbeforeevent/) & `object`

Defined in: [src/EventTypeDefs.ts:318](https://github.com/fabricjs/fabric.js/blob/22fda4575b9a171e8efe201e21ee2bd9d77651b8/src/EventTypeDefs.ts#L318)

#### Type Declaration

##### target

> **target**: [`Group`](/api/classes/group/)

***

### object:removed

> **object:removed**: `object`

Defined in: [src/EventTypeDefs.ts:241](https://github.com/fabricjs/fabric.js/blob/22fda4575b9a171e8efe201e21ee2bd9d77651b8/src/EventTypeDefs.ts#L241)

#### target

> **target**: [`FabricObject`](/api/classes/fabricobject/)

#### Inherited from

[`CollectionEvents`](/api/interfaces/collectionevents/).[`object:removed`](/api/interfaces/collectionevents/#objectremoved)
