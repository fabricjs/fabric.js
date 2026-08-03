---
editUrl: false
next: false
prev: false
title: "cos"
---

> **cos**(`angle`): `number`

Defined in: [src/util/misc/cos.ts:11](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/util/misc/cos.ts#L11)

Calculate the cos of an angle, avoiding returning floats for known results
This function is here just to avoid getting 0.999999999999999 when dealing
with numbers that are really 1 or 0.

## Parameters

### angle

[`TRadian`](/api/type-aliases/tradian/)

the angle

## Returns

`number`

the cosin value for angle.
