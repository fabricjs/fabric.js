---
editUrl: false
next: false
prev: false
title: "changeObjectWidth"
---

> `const` **changeObjectWidth**: [`TransformActionHandler`](/api/type-aliases/transformactionhandler/)

Defined in: [controls/changeWidth.ts:57](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/controls/changeWidth.ts#L57)

Action handler to change object's width
Needs to be wrapped with `wrapWithFixedAnchor` to be effective
You want to use this only if you are building a new control handler and you want
to reuse some logic. use "changeWidth" if you are looking to just use a control for width

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
