---
editUrl: false
next: false
prev: false
title: "enlivenObjectEnlivables"
---

> **enlivenObjectEnlivables**\<`R`\>(`serializedObject`, `object?`): `Promise`\<`R`\>

Defined in: [util/misc/objectEnlive.ts:174](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/util/misc/objectEnlive.ts#L174)

Creates corresponding fabric instances residing in an object, e.g. `clipPath`

## Type Parameters

### R

`R` = `Record`\<`string`, [`TFiller`](/api/type-aliases/tfiller/) \| [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\> \| `null`\>

## Parameters

### serializedObject

`any`

### object?

[`Abortable`](/api/type-aliases/abortable/) = `{}`

with properties to enlive ( fill, stroke, clipPath, path )

## Returns

`Promise`\<`R`\>

the input object with enlived values
