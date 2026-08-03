---
editUrl: false
next: false
prev: false
title: "TEasingFunction"
---

> **TEasingFunction**\<`T`\> = `T` *extends* `number`[] ? (`timeElapsed`, `startValue`, `byValue`, `duration`, `index`) => `number` : (`timeElapsed`, `startValue`, `byValue`, `duration`) => `number`

Defined in: [util/animation/types.ts:34](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/util/animation/types.ts#L34)

An easing function used to calculate the current value

## Type Parameters

### T

`T` = `unknown`

## See

AnimationBase#calculate

## Param

**timeElapsed**

ms elapsed since start

## Param

**startValue**

## Param

**byValue**

## Param

**duration**

in ms

## Returns

next value
