---
editUrl: false
next: false
prev: false
title: "findScaleToCover"
---

> **findScaleToCover**(`source`, `destination`): `number`

Defined in: [src/util/misc/findScaleTo.ts:25](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/util/misc/findScaleTo.ts#L25)

Finds the scale for the object source to cover entirely the object destination,
keeping aspect ratio intact.
respect the total allowed area for the cache.

## Parameters

### source

[`TSize`](/api/type-aliases/tsize/)

natural unscaled size of the object

### destination

[`TSize`](/api/type-aliases/tsize/)

natural unscaled size of the object

## Returns

`number`

scale factor to apply to source to cover destination
