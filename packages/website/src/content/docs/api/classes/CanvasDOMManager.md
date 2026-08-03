---
editUrl: false
next: false
prev: false
title: "CanvasDOMManager"
---

Defined in: [src/canvas/DOMManagers/CanvasDOMManager.ts:12](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/DOMManagers/CanvasDOMManager.ts#L12)

## Extends

- [`StaticCanvasDOMManager`](/api/classes/staticcanvasdommanager/)

## Constructors

### Constructor

> **new CanvasDOMManager**(`arg0?`, `__namedParameters?`): `CanvasDOMManager`

Defined in: [src/canvas/DOMManagers/CanvasDOMManager.ts:16](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/DOMManagers/CanvasDOMManager.ts#L16)

#### Parameters

##### arg0?

`string` | `HTMLCanvasElement`

##### \_\_namedParameters?

###### allowTouchScrolling?

`boolean` = `false`

###### containerClass?

`string` = `''`

:::caution[Deprecated]
here only for backward compatibility
:::

#### Returns

`CanvasDOMManager`

#### Overrides

[`StaticCanvasDOMManager`](/api/classes/staticcanvasdommanager/).[`constructor`](/api/classes/staticcanvasdommanager/#constructor)

## Properties

### container

> **container**: `HTMLDivElement`

Defined in: [src/canvas/DOMManagers/CanvasDOMManager.ts:14](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/DOMManagers/CanvasDOMManager.ts#L14)

***

### lower

> **lower**: `CanvasItem`

Defined in: [src/canvas/DOMManagers/StaticCanvasDOMManager.ts:22](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/DOMManagers/StaticCanvasDOMManager.ts#L22)

#### Inherited from

[`StaticCanvasDOMManager`](/api/classes/staticcanvasdommanager/).[`lower`](/api/classes/staticcanvasdommanager/#lower)

***

### upper

> **upper**: `CanvasItem`

Defined in: [src/canvas/DOMManagers/CanvasDOMManager.ts:13](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/DOMManagers/CanvasDOMManager.ts#L13)

## Methods

### calcOffset()

> **calcOffset**(): `object`

Defined in: [src/canvas/DOMManagers/StaticCanvasDOMManager.ts:71](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/DOMManagers/StaticCanvasDOMManager.ts#L71)

Calculates canvas element offset relative to the document

#### Returns

`object`

##### left

> **left**: `number` = `0`

##### top

> **top**: `number` = `0`

#### Inherited from

[`StaticCanvasDOMManager`](/api/classes/staticcanvasdommanager/).[`calcOffset`](/api/classes/staticcanvasdommanager/#calcoffset)

***

### cleanupDOM()

> **cleanupDOM**(`size`): `void`

Defined in: [src/canvas/DOMManagers/CanvasDOMManager.ts:109](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/DOMManagers/CanvasDOMManager.ts#L109)

#### Parameters

##### size

[`TSize`](/api/type-aliases/tsize/)

#### Returns

`void`

#### Overrides

[`StaticCanvasDOMManager`](/api/classes/staticcanvasdommanager/).[`cleanupDOM`](/api/classes/staticcanvasdommanager/#cleanupdom)

***

### dispose()

> **dispose**(): `void`

Defined in: [src/canvas/DOMManagers/CanvasDOMManager.ts:121](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/DOMManagers/CanvasDOMManager.ts#L121)

#### Returns

`void`

#### Overrides

[`StaticCanvasDOMManager`](/api/classes/staticcanvasdommanager/).[`dispose`](/api/classes/staticcanvasdommanager/#dispose)

***

### setCSSDimensions()

> **setCSSDimensions**(`size`): `void`

Defined in: [src/canvas/DOMManagers/CanvasDOMManager.ts:103](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/DOMManagers/CanvasDOMManager.ts#L103)

#### Parameters

##### size

`Partial`\<`CSSDimensions`\>

#### Returns

`void`

#### Overrides

[`StaticCanvasDOMManager`](/api/classes/staticcanvasdommanager/).[`setCSSDimensions`](/api/classes/staticcanvasdommanager/#setcssdimensions)

***

### setDimensions()

> **setDimensions**(`size`, `retinaScaling`): `void`

Defined in: [src/canvas/DOMManagers/CanvasDOMManager.ts:97](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/canvas/DOMManagers/CanvasDOMManager.ts#L97)

#### Parameters

##### size

[`TSize`](/api/type-aliases/tsize/)

##### retinaScaling

`number`

#### Returns

`void`

#### Overrides

[`StaticCanvasDOMManager`](/api/classes/staticcanvasdommanager/).[`setDimensions`](/api/classes/staticcanvasdommanager/#setdimensions)
