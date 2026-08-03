---
editUrl: false
next: false
prev: false
title: "stylesFromArray"
---

> **stylesFromArray**(`styles`, `text`): [`TextStyle`](/api/type-aliases/textstyle/)

Defined in: [util/misc/textStyles.ts:101](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/util/misc/textStyles.ts#L101)

Returns the object form of the styles property with styles that are assigned per
character rather than grouped by range. This format is more verbose, and is
only used during runtime (not for serialization/storage)

## Parameters

### styles

[`TextStyle`](/api/type-aliases/textstyle/) \| [`TextStyleArray`](/api/fabric/namespaces/util/type-aliases/textstylearray/)

the serialized form of a text object's styles

### text

`string`

the text string that the styles are applied to

## Returns

[`TextStyle`](/api/type-aliases/textstyle/)
