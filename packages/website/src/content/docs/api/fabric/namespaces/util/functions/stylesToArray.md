---
editUrl: false
next: false
prev: false
title: "stylesToArray"
---

> **stylesToArray**(`styles`, `text`): [`TextStyleArray`](/api/fabric/namespaces/util/type-aliases/textstylearray/)

Defined in: [util/misc/textStyles.ts:50](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/util/misc/textStyles.ts#L50)

Returns the array form of a text object's inline styles property with styles grouped in ranges
rather than per character. This format is less verbose, and is better suited for storage
so it is used in serialization (not during runtime).

## Parameters

### styles

[`TextStyle`](/api/type-aliases/textstyle/)

per character styles for a text object

### text

`string`

the text string that the styles are applied to

## Returns

[`TextStyleArray`](/api/fabric/namespaces/util/type-aliases/textstylearray/)
