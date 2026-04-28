---
editUrl: false
next: false
prev: false
title: "polyActionHandler"
---

> **polyActionHandler**(`eventData`, `transform`, `x`, `y`): `boolean`

Defined in: [src/controls/polyControl.ts:45](https://github.com/fabricjs/fabric.js/blob/22fda4575b9a171e8efe201e21ee2bd9d77651b8/src/controls/polyControl.ts#L45)

This function defines what the control does.
It'll be called on every mouse move after a control has been clicked and is being dragged.
The function receives as argument the mouse event, the current transform object
and the current position in canvas coordinate `transform.target` is a reference to the
current object being transformed.

## Parameters

### eventData

[`TPointerEvent`](/api/type-aliases/tpointerevent/)

### transform

`TTransformAnchor`

### x

`number`

### y

`number`

## Returns

`boolean`
