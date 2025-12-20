---
editUrl: false
next: false
prev: false
title: "pick"
---

> **pick**\<`T`\>(`source`, `keys`): `Partial`\<`T`\>

Defined in: [src/util/misc/pick.ts:7](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/util/misc/pick.ts#L7)

Populates an object with properties of another object

## Type Parameters

### T

`T` *extends* `Record`\<`string`, `any`\>

## Parameters

### source

`T`

Source object

### keys

keyof `T`[] = `[]`

## Returns

`Partial`\<`T`\>

object populated with the picked keys
