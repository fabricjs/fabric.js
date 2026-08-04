---
editUrl: false
next: false
prev: false
title: "rotationStyleHandler"
---

> `const` **rotationStyleHandler**: [`ControlCursorCallback`](/api/type-aliases/controlcursorcallback/)

Defined in: [controls/rotate.ts:19](https://github.com/fabricjs/fabric.js/blob/51d44795817982682ed08b732d2811d0959cd527/packages/core/src/controls/rotate.ts#L19)

Find the correct style for the control that is used for rotation.
this function is very simple and it just take care of not-allowed or standard cursor

## Param

**eventData**

the javascript event that is causing the scale

## Param

**control**

the control that is interested in the action

## Param

**fabricObject**

the fabric object that is interested in the action

## Returns

a valid css string for the cursor
