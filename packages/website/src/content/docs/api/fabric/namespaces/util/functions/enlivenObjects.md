---
editUrl: false
next: false
prev: false
title: "enlivenObjects"
---

> **enlivenObjects**\<`T`\>(`objects`, `options?`): `Promise`\<`T`[]\>

Defined in: [src/util/misc/objectEnlive.ts:93](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/util/misc/objectEnlive.ts#L93)

## Type Parameters

### T

`T` *extends* [`TFiller`](/api/type-aliases/tfiller/) \| [`Shadow`](/api/classes/shadow/) \| [`BaseFabricObject`](/api/classes/basefabricobject/)\<`Partial`\<`ObjectProps`\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\> \| [`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/)\<`string`, `object`, `object`\> \| [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>

## Parameters

### objects

`any`[]

Objects to enliven

### options?

[`EnlivenObjectOptions`](/api/fabric/namespaces/util/type-aliases/enlivenobjectoptions/) = `{}`

## Returns

`Promise`\<`T`[]\>

## TODO

type this correctly.
Creates corresponding fabric instances from their object representations
