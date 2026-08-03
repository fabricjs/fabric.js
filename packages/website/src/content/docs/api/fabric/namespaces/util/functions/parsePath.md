---
editUrl: false
next: false
prev: false
title: "parsePath"
---

> **parsePath**(`pathString`): [`TComplexPathData`](/api/type-aliases/tcomplexpathdata/)

Defined in: [util/path/index.ts:857](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/util/path/index.ts#L857)

## Parameters

### pathString

`string`

## Returns

[`TComplexPathData`](/api/type-aliases/tcomplexpathdata/)

An array of SVG path commands

## Example

**Usage**

```ts
parsePath('M 3 4 Q 3 5 2 1 4 0 Q 9 12 2 1 4 0') === [
  ['M', 3, 4],
  ['Q', 3, 5, 2, 1, 4, 0],
  ['Q', 9, 12, 2, 1, 4, 0],
];
```
