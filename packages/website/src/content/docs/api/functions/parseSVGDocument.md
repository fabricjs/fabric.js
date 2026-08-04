---
editUrl: false
next: false
prev: false
title: "parseSVGDocument"
---

> **parseSVGDocument**(`doc`, `reviver?`, `callback?`): `Promise`\<`SVGParsingOutput`\>

Defined in: [parser/parseSVGDocument.ts:35](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/parser/parseSVGDocument.ts#L35)

Parses an SVG document, converts it to an array of corresponding fabric.* instances and passes them to a callback

## Parameters

### doc

`Document`

SVG document to parse

### reviver?

`TSvgReviverCallback`

Extra callback for further parsing of SVG elements, called after each fabric object has been created.
Takes as input the original svg element and the generated `FabricObject` as arguments. Used to inspect extra properties not parsed by fabric,
or extra custom manipulation

### callback?

[`LoadImageOptions`](/api/fabric/namespaces/util/type-aliases/loadimageoptions/) = `{}`

Invoked when the parsing is done, with null if parsing wasn't possible with the list of svg nodes.

## Returns

`Promise`\<`SVGParsingOutput`\>

SVGParsingOutput also receives `allElements` array as the last argument. This is the full list of svg nodes available in the document.
You may want to use it if you are trying to regroup the objects as they were originally grouped in the SVG. ( This was the reason why it was added )
