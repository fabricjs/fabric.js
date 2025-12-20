---
editUrl: false
next: false
prev: false
title: "enlivenObjects"
---

> **enlivenObjects**\<`T`\>(`objects`, `options?`): `Promise`\<`T`[]\>

Defined in: [src/util/misc/objectEnlive.ts:92](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/util/misc/objectEnlive.ts#L92)

## Type Parameters

### T

`T` *extends* [`TFiller`](/api/type-aliases/tfiller/) \| [`Shadow`](/api/classes/shadow/) \| [`BaseFabricObject`](/api/classes/basefabricobject/)\<`Partial`\<`ObjectProps`\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\> \| [`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\> \| [`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/)\<`string`, `object`, `object`\>

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
