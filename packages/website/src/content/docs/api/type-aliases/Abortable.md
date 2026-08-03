---
editUrl: false
next: false
prev: false
title: "Abortable"
---

> **Abortable** = `object`

Defined in: [typedefs.ts:124](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/typedefs.ts#L124)

## Properties

### resourceValidator?

> `optional` **resourceValidator?**: (`url`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [typedefs.ts:134](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/typedefs.ts#L134)

Validates a URL before Fabric loads it as an external resource.
Return `false` to skip the resource.

#### Parameters

##### url

`string`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

***

### signal?

> `optional` **signal?**: `AbortSignal`

Defined in: [typedefs.ts:129](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/typedefs.ts#L129)

handle aborting

#### See

https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
