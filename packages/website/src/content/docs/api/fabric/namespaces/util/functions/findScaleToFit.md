---
editUrl: false
next: false
prev: false
title: "findScaleToFit"
---

> **findScaleToFit**(`source`, `destination`): `number`

Defined in: [util/misc/findScaleTo.ts:11](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/util/misc/findScaleTo.ts#L11)

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
