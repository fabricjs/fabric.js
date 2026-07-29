---
editUrl: false
next: false
prev: false
title: "TAnimationCallbacks"
---

> **TAnimationCallbacks**\<`T`\> = `object`

Defined in: [src/util/animation/types.ts:74](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/util/animation/types.ts#L74)

## Type Parameters

### T

`T`

## Properties

### abort

> **abort**: [`TAbortCallback`](/api/fabric/namespaces/util/type-aliases/tabortcallback/)\<`T`\>

Defined in: [src/util/animation/types.ts:94](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/util/animation/types.ts#L94)

Function called at each frame.
If it returns true, abort

***

### onChange

> **onChange**: [`TOnAnimationChangeCallback`](/api/fabric/namespaces/util/type-aliases/tonanimationchangecallback/)\<`T`\>

Defined in: [src/util/animation/types.ts:83](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/util/animation/types.ts#L83)

Called at each frame of the animation

***

### onComplete

> **onComplete**: [`TOnAnimationChangeCallback`](/api/fabric/namespaces/util/type-aliases/tonanimationchangecallback/)\<`T`\>

Defined in: [src/util/animation/types.ts:88](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/util/animation/types.ts#L88)

Called after the last frame of the animation

***

### onStart

> **onStart**: `VoidFunction`

Defined in: [src/util/animation/types.ts:78](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/util/animation/types.ts#L78)

Called when the animation starts
