---
editUrl: false
next: false
prev: false
title: "findScaleToFit"
---

> **findScaleToFit**(`source`, `destination`): `number`

Defined in: [src/util/misc/findScaleTo.ts:11](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/util/misc/findScaleTo.ts#L11)

Finds the scale for the object source to fit inside the object destination,
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

scale factor to apply to source to fit into destination
