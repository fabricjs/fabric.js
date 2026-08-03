---
editUrl: false
next: false
prev: false
title: "scalingYOrSkewingX"
---

> `const` **scalingYOrSkewingX**: [`TransformActionHandler`](/api/type-aliases/transformactionhandler/)

Defined in: [controls/scaleSkew.ts:85](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/controls/scaleSkew.ts#L85)

Composed action handler to either scale Y or skew X
Needs to be wrapped with `wrapWithFixedAnchor` to be effective

## Param

**eventData**

javascript event that is doing the transform

## Param

**transform**

javascript object containing a series of information around the current transform

## Param

**x**

current mouse x position, canvas normalized

## Param

**y**

current mouse y position, canvas normalized

## Returns

true if some change happened
