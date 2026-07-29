---
editUrl: false
next: false
prev: false
title: "LayoutStrategyResult"
---

> **LayoutStrategyResult** = `object`

Defined in: [src/LayoutManager/types.ts:28](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/LayoutManager/types.ts#L28)

## Properties

### center

> **center**: [`Point`](/api/classes/point/)

Defined in: [src/LayoutManager/types.ts:32](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/LayoutManager/types.ts#L32)

new center point as measured by the **containing** plane (same as `left` with `originX` set to `center`)

***

### correction?

> `optional` **correction**: [`Point`](/api/classes/point/)

Defined in: [src/LayoutManager/types.ts:41](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/LayoutManager/types.ts#L41)

correction vector to translate objects by, measured in the same plane as `center`

Since objects are measured relative to the group's center, once the group's size changes we must apply a correction to
the objects' positions so that they relate to the new center.
In other words, this value makes it possible to layout objects relative to the tl corner, for instance, but not only.

***

### relativeCorrection?

> `optional` **relativeCorrection**: [`Point`](/api/classes/point/)

Defined in: [src/LayoutManager/types.ts:46](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/LayoutManager/types.ts#L46)

correction vector to translate objects by as measured by the plane

***

### size

> **size**: [`Point`](/api/classes/point/)

Defined in: [src/LayoutManager/types.ts:51](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/LayoutManager/types.ts#L51)

new width and height of the layout target
