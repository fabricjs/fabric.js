---
editUrl: false
next: false
prev: false
title: "FixedLayout"
---

Defined in: [src/LayoutManager/LayoutStrategies/FixedLayout.ts:13](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/LayoutManager/LayoutStrategies/FixedLayout.ts#L13)

Layout will keep target's initial size.

## Extends

- [`LayoutStrategy`](/api/classes/layoutstrategy/)

## Constructors

### Constructor

> **new FixedLayout**(): `FixedLayout`

#### Returns

`FixedLayout`

#### Inherited from

[`LayoutStrategy`](/api/classes/layoutstrategy/).[`constructor`](/api/classes/layoutstrategy/#constructor)

## Properties

### type

> `readonly` `static` **type**: `"fixed"` = `'fixed'`

Defined in: [src/LayoutManager/LayoutStrategies/FixedLayout.ts:14](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/LayoutManager/LayoutStrategies/FixedLayout.ts#L14)

override by subclass for persistence (TS does not support `static abstract`)

#### Overrides

[`LayoutStrategy`](/api/classes/layoutstrategy/).[`type`](/api/classes/layoutstrategy/#type)

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

#### Inherited from

[`LayoutStrategy`](/api/classes/layoutstrategy/).[`calcBoundingBox`](/api/classes/layoutstrategy/#calcboundingbox)

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

#### Inherited from

[`LayoutStrategy`](/api/classes/layoutstrategy/).[`calcLayoutResult`](/api/classes/layoutstrategy/#calclayoutresult)

***

### getInitialSize()

> **getInitialSize**(`__namedParameters`, `__namedParameters`): [`Point`](/api/classes/point/)

Defined in: [src/LayoutManager/LayoutStrategies/FixedLayout.ts:19](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/LayoutManager/LayoutStrategies/FixedLayout.ts#L19)

respect target's initial size

#### Parameters

##### \_\_namedParameters

[`StrictLayoutContext`](/api/type-aliases/strictlayoutcontext/) & [`CommonLayoutContext`](/api/type-aliases/commonlayoutcontext/) & `object`

##### \_\_namedParameters

`Pick`\<[`LayoutStrategyResult`](/api/type-aliases/layoutstrategyresult/), `"center"` \| `"size"`\>

#### Returns

[`Point`](/api/classes/point/)

#### Overrides

[`LayoutStrategy`](/api/classes/layoutstrategy/).[`getInitialSize`](/api/classes/layoutstrategy/#getinitialsize)

***

### shouldLayoutClipPath()

> **shouldLayoutClipPath**(`__namedParameters`): `undefined` \| `boolean`

Defined in: [src/LayoutManager/LayoutStrategies/LayoutStrategy.ts:50](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/LayoutManager/LayoutStrategies/LayoutStrategy.ts#L50)

#### Parameters

##### \_\_namedParameters

[`StrictLayoutContext`](/api/type-aliases/strictlayoutcontext/)

#### Returns

`undefined` \| `boolean`

#### Inherited from

[`LayoutStrategy`](/api/classes/layoutstrategy/).[`shouldLayoutClipPath`](/api/classes/layoutstrategy/#shouldlayoutclippath)

***

### shouldPerformLayout()

> **shouldPerformLayout**(`__namedParameters`): `boolean`

Defined in: [src/LayoutManager/LayoutStrategies/LayoutStrategy.ts:42](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/LayoutManager/LayoutStrategies/LayoutStrategy.ts#L42)

#### Parameters

##### \_\_namedParameters

[`StrictLayoutContext`](/api/type-aliases/strictlayoutcontext/)

#### Returns

`boolean`

#### Inherited from

[`LayoutStrategy`](/api/classes/layoutstrategy/).[`shouldPerformLayout`](/api/classes/layoutstrategy/#shouldperformlayout)
