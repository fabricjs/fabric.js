---
editUrl: false
next: false
prev: false
title: "changeObjectHeight"
---

> `const` **changeObjectHeight**: [`TransformActionHandler`](/api/type-aliases/transformactionhandler/)

Defined in: [src/controls/changeWidth.ts:71](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/controls/changeWidth.ts#L71)

Action handler to change object's height
Needs to be wrapped with `wrapWithFixedAnchor` to be effective
You want to use this only if you are building a new control handler and you want
to reuse some logic. use "changeHeight" if you are looking to just use a control for height

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
