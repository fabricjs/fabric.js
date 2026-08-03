---
editUrl: false
next: false
prev: false
title: "scalingXOrSkewingY"
---

> `const` **scalingXOrSkewingY**: [`TransformActionHandler`](/api/type-aliases/transformactionhandler/)

Defined in: [controls/scaleSkew.ts:65](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/controls/scaleSkew.ts#L65)

Composed action handler to either scale X or skew Y
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
