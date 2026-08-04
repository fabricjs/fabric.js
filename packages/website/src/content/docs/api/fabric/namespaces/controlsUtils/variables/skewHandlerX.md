---
editUrl: false
next: false
prev: false
title: "skewHandlerX"
---

> `const` **skewHandlerX**: [`TransformActionHandler`](/api/type-aliases/transformactionhandler/)

Defined in: [controls/skew.ts:226](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/controls/skew.ts#L226)

Wrapped Action handler for skewing on the X axis, takes care of the
skew direction and determines the correct transform origin for the anchor point

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
