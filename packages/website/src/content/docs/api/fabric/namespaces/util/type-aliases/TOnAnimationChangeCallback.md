---
editUrl: false
next: false
prev: false
title: "TOnAnimationChangeCallback"
---

> **TOnAnimationChangeCallback**\<`T`, `R`\> = (`value`, `valueProgress`, `durationProgress`) => `R`

Defined in: [src/util/animation/types.ts:12](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/util/animation/types.ts#L12)

Callback called every frame

## Type Parameters

### T

`T`

### R

`R` = `void`

## Parameters

### value

`T`

current value of the animation.

### valueProgress

`number`

∈ [0, 1], the current animation progress reflected on value, normalized.
0 is the starting value and 1 is the ending value.

### durationProgress

`number`

∈ [0, 1], the current animation duration normalized to 1.

## Returns

`R`
