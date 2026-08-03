---
editUrl: false
next: false
prev: false
title: "scalingYOrSkewingX"
---

> `const` **scalingYOrSkewingX**: [`TransformActionHandler`](/api/type-aliases/transformactionhandler/)

Defined in: [src/controls/scaleSkew.ts:85](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/scaleSkew.ts#L85)

Composed action handler to either scale Y or skew X
Needs to be wrapped with `wrapWithFixedAnchor` to be effective

## Param

javascript event that is doing the transform

## Param

javascript object containing a series of information around the current transform

## Param

current mouse x position, canvas normalized

## Param

current mouse y position, canvas normalized

## Returns

true if some change happened
