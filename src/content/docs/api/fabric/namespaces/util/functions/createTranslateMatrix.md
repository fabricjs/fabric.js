---
editUrl: false
next: false
prev: false
title: "createTranslateMatrix"
---

> **createTranslateMatrix**(`x`, `y?`): [`TMat2D`](/api/type-aliases/tmat2d/)

Defined in: [src/util/misc/matrix.ts:147](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/util/misc/matrix.ts#L147)

Generate a translation matrix

A translation matrix in the form of
[ 1 0 x ]
[ 0 1 y ]
[ 0 0 1 ]

See [https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#translate](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#translate) for more details

## Parameters

### x

`number`

translation on X axis

### y?

`number` = `0`

translation on Y axis

## Returns

[`TMat2D`](/api/type-aliases/tmat2d/)

matrix
