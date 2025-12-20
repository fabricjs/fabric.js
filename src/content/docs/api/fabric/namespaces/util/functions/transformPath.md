---
editUrl: false
next: false
prev: false
title: "transformPath"
---

> **transformPath**(`path`, `transform`, `pathOffset?`): [`TSimplePathData`](/api/type-aliases/tsimplepathdata/)

Defined in: [src/util/path/index.ts:966](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/util/path/index.ts#L966)

Transform a path by transforming each segment.
it has to be a simplified path or it won't work.
WARNING: this depends from pathOffset for correct operation

## Parameters

### path

[`TSimplePathData`](/api/type-aliases/tsimplepathdata/)

fabricJS parsed and simplified path commands

### transform

[`TMat2D`](/api/type-aliases/tmat2d/)

matrix that represent the transformation

### pathOffset?

[`Point`](/api/classes/point/)

`Path.pathOffset`

## Returns

[`TSimplePathData`](/api/type-aliases/tsimplepathdata/)

the transformed path
