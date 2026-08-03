---
editUrl: false
next: false
prev: false
title: "getSmoothPathFromPoints"
---

> **getSmoothPathFromPoints**(`points`, `correction?`): [`TSimplePathData`](/api/type-aliases/tsimplepathdata/)

Defined in: [src/util/path/index.ts:911](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/util/path/index.ts#L911)

Converts points to a smooth SVG path

## Parameters

### points

[`Point`](/api/classes/point/)[]

Array of points

### correction?

`number` = `0`

Apply a correction to the path (usually we use `width / 1000`). If value is undefined 0 is used as the correction value.

## Returns

[`TSimplePathData`](/api/type-aliases/tsimplepathdata/)

An array of SVG path commands
