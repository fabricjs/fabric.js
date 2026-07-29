---
editUrl: false
next: false
prev: false
title: "LayoutStrategy"
---

Defined in: [src/LayoutManager/LayoutStrategies/LayoutStrategy.ts:21](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/LayoutManager/LayoutStrategies/LayoutStrategy.ts#L21)

Exposes a main public method [calcLayoutResult](/api/classes/layoutstrategy/#calclayoutresult) that is used by the `LayoutManager` to perform layout.
Returning `undefined` signals the `LayoutManager` to skip the layout.

In charge of calculating the bounding box of the passed objects.

## Extended by

- [`ClipPathLayout`](/api/classes/clippathlayout/)
- [`FitContentLayout`](/api/classes/fitcontentlayout/)
- [`FixedLayout`](/api/classes/fixedlayout/)

## Constructors

### Constructor

> **new LayoutStrategy**(): `LayoutStrategy`

#### Returns

`LayoutStrategy`

## Properties

### type

> `static` **type**: `string` = `'strategy'`

Defined in: [src/LayoutManager/LayoutStrategies/LayoutStrategy.ts:25](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/LayoutManager/LayoutStrategies/LayoutStrategy.ts#L25)

override by subclass for persistence (TS does not support `static abstract`)

## Methods

### calcBoundingBox()

> **calcBoundingBox**(`objects`, `context`): `undefined` \| [`LayoutStrategyResult`](/api/type-aliases/layoutstrategyresult/)

Defined in: [src/LayoutManager/LayoutStrategies/LayoutStrategy.ts:68](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/LayoutManager/LayoutStrategies/LayoutStrategy.ts#L68)

Override this method to customize layout.

#### Parameters

##### objects

[`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]

##### context

[`StrictLayoutContext`](/api/type-aliases/strictlayoutcontext/)

#### Returns

`undefined` \| [`LayoutStrategyResult`](/api/type-aliases/layoutstrategyresult/)

***

### calcLayoutResult()

> **calcLayoutResult**(`context`, `objects`): `undefined` \| [`LayoutStrategyResult`](/api/type-aliases/layoutstrategyresult/)

Defined in: [src/LayoutManager/LayoutStrategies/LayoutStrategy.ts:33](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/LayoutManager/LayoutStrategies/LayoutStrategy.ts#L33)

Used by the `LayoutManager` to perform layout
@TODO/fix: if this method is calcResult, should calc unconditionally.
the condition to not calc should be evaluated by the layoutManager.

#### Parameters

##### context

[`StrictLayoutContext`](/api/type-aliases/strictlayoutcontext/)

##### objects

[`FabricObject`](/api/classes/fabricobject/)\<`Partial`\<[`FabricObjectProps`](/api/interfaces/fabricobjectprops/)\>, [`SerializedObjectProps`](/api/interfaces/serializedobjectprops/), [`ObjectEvents`](/api/interfaces/objectevents/)\>[]

#### Returns

`undefined` \| [`LayoutStrategyResult`](/api/type-aliases/layoutstrategyresult/)

layout result **OR** `undefined` to skip layout

***

### getInitialSize()

> **getInitialSize**(`context`, `result`): [`Point`](/api/classes/point/)

Defined in: [src/LayoutManager/LayoutStrategies/LayoutStrategy.ts:58](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/LayoutManager/LayoutStrategies/LayoutStrategy.ts#L58)

#### Parameters

##### context

[`StrictLayoutContext`](/api/type-aliases/strictlayoutcontext/) & [`CommonLayoutContext`](/api/type-aliases/commonlayoutcontext/) & `object`

##### result

`Pick`\<[`LayoutStrategyResult`](/api/type-aliases/layoutstrategyresult/), `"center"` \| `"size"`\>

#### Returns

[`Point`](/api/classes/point/)

***

### shouldLayoutClipPath()

> **shouldLayoutClipPath**(`__namedParameters`): `undefined` \| `boolean`

Defined in: [src/LayoutManager/LayoutStrategies/LayoutStrategy.ts:50](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/LayoutManager/LayoutStrategies/LayoutStrategy.ts#L50)

#### Parameters

##### \_\_namedParameters

[`StrictLayoutContext`](/api/type-aliases/strictlayoutcontext/)

#### Returns

`undefined` \| `boolean`

***

### shouldPerformLayout()

> **shouldPerformLayout**(`__namedParameters`): `boolean`

Defined in: [src/LayoutManager/LayoutStrategies/LayoutStrategy.ts:42](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/LayoutManager/LayoutStrategies/LayoutStrategy.ts#L42)

#### Parameters

##### \_\_namedParameters

[`StrictLayoutContext`](/api/type-aliases/strictlayoutcontext/)

#### Returns

`boolean`
