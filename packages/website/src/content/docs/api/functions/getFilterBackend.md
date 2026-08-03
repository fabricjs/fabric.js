---
editUrl: false
next: false
prev: false
title: "getFilterBackend"
---

> **getFilterBackend**(`strict?`): `FilterBackend`

Defined in: [filters/FilterBackend.ts:29](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/filters/FilterBackend.ts#L29)

Get the current fabricJS filter backend  or initialize one if not available yet

## Parameters

### strict?

`boolean` = `true`

pass `true` to create the backend if it wasn't created yet (default behavior),
pass `false` to get the backend ref without mutating it

## Returns

`FilterBackend`
