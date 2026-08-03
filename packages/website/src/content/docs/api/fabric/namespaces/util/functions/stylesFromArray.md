---
editUrl: false
next: false
prev: false
title: "stylesFromArray"
---

> **stylesFromArray**(`styles`, `text`): [`TextStyle`](/api/type-aliases/textstyle/)

Defined in: [src/util/misc/textStyles.ts:101](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/util/misc/textStyles.ts#L101)

Returns the object form of the styles property with styles that are assigned per
character rather than grouped by range. This format is more verbose, and is
only used during runtime (not for serialization/storage)

## Parameters

### styles

the serialized form of a text object's styles

[`TextStyle`](/api/type-aliases/textstyle/) | [`TextStyleArray`](/api/fabric/namespaces/util/type-aliases/textstylearray/)

### text

`string`

the text string that the styles are applied to

## Returns

[`TextStyle`](/api/type-aliases/textstyle/)
