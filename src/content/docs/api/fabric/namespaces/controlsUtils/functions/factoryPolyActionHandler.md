---
editUrl: false
next: false
prev: false
title: "factoryPolyActionHandler"
---

> **factoryPolyActionHandler**(`pointIndex`, `fn`): (`eventData`, `transform`, `x`, `y`) => `boolean`

Defined in: [src/controls/polyControl.ts:68](https://github.com/fabricjs/fabric.js/blob/22fda4575b9a171e8efe201e21ee2bd9d77651b8/src/controls/polyControl.ts#L68)

Keep the polygon in the same position when we change its `width`/`height`/`top`/`left`.

## Parameters

### pointIndex

`number`

### fn

[`TransformActionHandler`](/api/type-aliases/transformactionhandler/)\<`TTransformAnchor`\>

## Returns

> (`eventData`, `transform`, `x`, `y`): `boolean`

### Parameters

#### eventData

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

#### transform

[`Transform`](/api/type-aliases/transform/)

#### x

`number`

#### y

`number`

### Returns

`boolean`
