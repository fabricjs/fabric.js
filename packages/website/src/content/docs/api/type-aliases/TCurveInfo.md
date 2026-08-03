---
editUrl: false
next: false
prev: false
title: "TCurveInfo"
---

> **TCurveInfo**\<`C`\> = [`TPathSegmentInfoCommon`](/api/type-aliases/tpathsegmentinfocommon/)\<`C`\> & `object`

Defined in: [util/path/typedefs.ts:11](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/util/path/typedefs.ts#L11)

## Type Declaration

### angleFinder

> **angleFinder**: (`pct`) => `number`

Get the angle to a percent

#### Parameters

##### pct

`number`

#### Returns

`number`

### iterator

> **iterator**: (`pct`) => [`Point`](/api/classes/point/)

Get the Point a certain percent distance along the curve

#### Parameters

##### pct

`number`

#### Returns

[`Point`](/api/classes/point/)

### length

> **length**: `number`

Total length of the curve

## Type Parameters

### C

`C` *extends* `string`
