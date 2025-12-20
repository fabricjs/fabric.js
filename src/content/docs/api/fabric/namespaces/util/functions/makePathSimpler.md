---
editUrl: false
next: false
prev: false
title: "makePathSimpler"
---

> **makePathSimpler**(`path`): [`TSimplePathData`](/api/type-aliases/tsimplepathdata/)

Defined in: [src/util/path/index.ts:351](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/util/path/index.ts#L351)

This function takes a parsed SVG path and makes it simpler for fabricJS logic.
Simplification consist of:
- All commands converted to absolute (lowercase to uppercase)
- S converted to C
- T converted to Q
- A converted to C

## Parameters

### path

[`TComplexPathData`](/api/type-aliases/tcomplexpathdata/)

the array of commands of a parsed SVG path for `Path`

## Returns

[`TSimplePathData`](/api/type-aliases/tsimplepathdata/)

the simplified array of commands of a parsed SVG path for `Path`
TODO: figure out how to remove the type assertions in a nice way
