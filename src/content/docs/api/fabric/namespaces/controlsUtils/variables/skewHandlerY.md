---
editUrl: false
next: false
prev: false
title: "skewHandlerY"
---

> `const` **skewHandlerY**: [`TransformActionHandler`](/api/type-aliases/transformactionhandler/)

Defined in: [src/controls/skew.ts:244](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/skew.ts#L244)

Wrapped Action handler for skewing on the Y axis, takes care of the
skew direction and determines the correct transform origin for the anchor point

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
