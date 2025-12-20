---
editUrl: false
next: false
prev: false
title: "Canvas2dFilterBackend"
---

Defined in: [src/filters/Canvas2dFilterBackend.ts:7](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/Canvas2dFilterBackend.ts#L7)

## Constructors

### Constructor

> **new Canvas2dFilterBackend**(): `Canvas2dFilterBackend`

#### Returns

`Canvas2dFilterBackend`

## Properties

### resources

> **resources**: [`TPipelineResources`](/api/type-aliases/tpipelineresources/) = `{}`

Defined in: [src/filters/Canvas2dFilterBackend.ts:15](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/Canvas2dFilterBackend.ts#L15)

Experimental. This object is a sort of repository of help layers used to avoid
of recreating them during frequent filtering. If you are previewing a filter with
a slider you probably do not want to create help layers every filter step.
in this object there will be appended some canvases, created once, resized sometimes
cleared never. Clearing is left to the developer.

## Methods

### applyFilters()

> **applyFilters**(`filters`, `sourceElement`, `sourceWidth`, `sourceHeight`, `targetCanvas`): `void` \| [`T2DPipelineState`](/api/type-aliases/t2dpipelinestate/)

Defined in: [src/filters/Canvas2dFilterBackend.ts:27](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/Canvas2dFilterBackend.ts#L27)

Apply a set of filters against a source image and draw the filtered output
to the provided destination canvas.

#### Parameters

##### filters

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/)\<`string`, `Record`\<`string`, `any`\>, `Record`\<`string`, `any`\>\>[]

The filter to apply.

##### sourceElement

`CanvasImageSource`

The source to be filtered.

##### sourceWidth

`number`

The width of the source input.

##### sourceHeight

`number`

The height of the source input.

##### targetCanvas

`HTMLCanvasElement`

The destination for filtered output to be drawn.

#### Returns

`void` \| [`T2DPipelineState`](/api/type-aliases/t2dpipelinestate/)
