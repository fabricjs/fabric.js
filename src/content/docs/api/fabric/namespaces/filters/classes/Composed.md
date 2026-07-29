---
editUrl: false
next: false
prev: false
title: "Composed"
---

Defined in: [src/filters/Composed.ts:17](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/Composed.ts#L17)

A container class that knows how to apply a sequence of filters to an input image.

## Extends

- [`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/)\<`"Composed"`, `ComposedOwnProps`, `ComposedSerializedProps`\>

## Constructors

### Constructor

> **new Composed**(`options`): `Composed`

Defined in: [src/filters/Composed.ts:29](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/Composed.ts#L29)

#### Parameters

##### options

`object` & `Record`\<`string`, `any`\> = `{}`

#### Returns

`Composed`

#### Overrides

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`constructor`](/api/fabric/namespaces/filters/classes/basefilter/#constructor)

## Properties

### subFilters

> **subFilters**: [`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/)\<`string`, `object`, `object`\>[]

Defined in: [src/filters/Composed.ts:25](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/Composed.ts#L25)

A non sparse array of filters to apply

***

### defaults

> `static` **defaults**: `Record`\<`string`, `unknown`\>

Defined in: [src/filters/BaseFilter.ts:49](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L49)

#### Inherited from

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`defaults`](/api/fabric/namespaces/filters/classes/basefilter/#defaults)

***

### type

> `static` **type**: `string` = `'Composed'`

Defined in: [src/filters/Composed.ts:27](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/Composed.ts#L27)

The class type. Used to identify which class this is.
This is used for serialization purposes and internally it can be used
to identify classes. As a developer you could use `instance of Class`
but to avoid importing all the code and blocking tree shaking we try
to avoid doing that.

#### Overrides

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`type`](/api/fabric/namespaces/filters/classes/basefilter/#type)

***

### uniformLocations

> `static` **uniformLocations**: `string`[] = `[]`

Defined in: [src/filters/BaseFilter.ts:47](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L47)

Contains the uniform locations for the fragment shader.
uStepW and uStepH are handled by the BaseFilter, each filter class
needs to specify all the one that are needed

#### Inherited from

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`uniformLocations`](/api/fabric/namespaces/filters/classes/basefilter/#uniformlocations)

## Accessors

### type

#### Get Signature

> **get** **type**(): `Name`

Defined in: [src/filters/BaseFilter.ts:29](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L29)

Filter type

##### Returns

`Name`

#### Inherited from

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`type`](/api/fabric/namespaces/filters/classes/basefilter/#type-1)

## Methods

### \_setupFrameBuffer()

> **\_setupFrameBuffer**(`options`): `void`

Defined in: [src/filters/BaseFilter.ts:203](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L203)

#### Parameters

##### options

[`TWebGLPipelineState`](/api/type-aliases/twebglpipelinestate/)

#### Returns

`void`

#### Inherited from

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`_setupFrameBuffer`](/api/fabric/namespaces/filters/classes/basefilter/#_setupframebuffer)

***

### \_swapTextures()

> **\_swapTextures**(`options`): `void`

Defined in: [src/filters/BaseFilter.ts:230](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L230)

#### Parameters

##### options

[`TWebGLPipelineState`](/api/type-aliases/twebglpipelinestate/)

#### Returns

`void`

#### Inherited from

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`_swapTextures`](/api/fabric/namespaces/filters/classes/basefilter/#_swaptextures)

***

### applyTo()

> **applyTo**(`options`): `void`

Defined in: [src/filters/Composed.ts:42](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/Composed.ts#L42)

Apply this container's filters to the input image provided.

#### Parameters

##### options

[`TWebGLPipelineState`](/api/type-aliases/twebglpipelinestate/) | [`T2DPipelineState`](/api/type-aliases/t2dpipelinestate/)

#### Returns

`void`

#### Overrides

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`applyTo`](/api/fabric/namespaces/filters/classes/basefilter/#applyto)

***

### applyTo2d()

> **applyTo2d**(`_options`): `void`

Defined in: [src/filters/BaseFilter.ts:273](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L273)

#### Parameters

##### \_options

[`T2DPipelineState`](/api/type-aliases/t2dpipelinestate/)

#### Returns

`void`

#### Inherited from

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`applyTo2d`](/api/fabric/namespaces/filters/classes/basefilter/#applyto2d)

***

### applyToWebGL()

> **applyToWebGL**(`options`): `void`

Defined in: [src/filters/BaseFilter.ts:313](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L313)

Apply this filter using webgl.

#### Parameters

##### options

[`TWebGLPipelineState`](/api/type-aliases/twebglpipelinestate/)

#### Returns

`void`

#### Inherited from

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`applyToWebGL`](/api/fabric/namespaces/filters/classes/basefilter/#applytowebgl)

***

### bindAdditionalTexture()

> **bindAdditionalTexture**(`gl`, `texture`, `textureUnit`): `void`

Defined in: [src/filters/BaseFilter.ts:332](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L332)

#### Parameters

##### gl

`WebGLRenderingContext`

##### texture

`WebGLTexture`

##### textureUnit

`number`

#### Returns

`void`

#### Inherited from

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`bindAdditionalTexture`](/api/fabric/namespaces/filters/classes/basefilter/#bindadditionaltexture)

***

### createHelpLayer()

> **createHelpLayer**(`options`): `void`

Defined in: [src/filters/BaseFilter.ts:368](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L368)

If needed by a 2d filter, this functions can create an helper canvas to be used
remember that options.targetCanvas is available for use till end of chain.

#### Parameters

##### options

[`T2DPipelineState`](/api/type-aliases/t2dpipelinestate/)

#### Returns

`void`

#### Inherited from

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`createHelpLayer`](/api/fabric/namespaces/filters/classes/basefilter/#createhelplayer)

***

### createProgram()

> **createProgram**(`gl`, `fragmentSource`, `vertexSource`): `object`

Defined in: [src/filters/BaseFilter.ts:81](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L81)

Compile this filter's shader program.

#### Parameters

##### gl

`WebGLRenderingContext`

The GL canvas context to use for shader compilation.

##### fragmentSource

`string` = `...`

fragmentShader source for compilation

##### vertexSource

`string` = `...`

vertexShader source for compilation

#### Returns

`object`

##### attributeLocations

> **attributeLocations**: [`TWebGLAttributeLocationMap`](/api/type-aliases/twebglattributelocationmap/)

##### program

> **program**: `WebGLProgram`

##### uniformLocations

> **uniformLocations**: [`TWebGLUniformLocationMap`](/api/type-aliases/twebgluniformlocationmap/)

#### Inherited from

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`createProgram`](/api/fabric/namespaces/filters/classes/basefilter/#createprogram)

***

### getAttributeLocations()

> **getAttributeLocations**(`gl`, `program`): [`TWebGLAttributeLocationMap`](/api/type-aliases/twebglattributelocationmap/)

Defined in: [src/filters/BaseFilter.ts:151](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L151)

Return a map of attribute names to WebGLAttributeLocation objects.

#### Parameters

##### gl

`WebGLRenderingContext`

The canvas context used to compile the shader program.

##### program

`WebGLProgram`

The shader program from which to take attribute locations.

#### Returns

[`TWebGLAttributeLocationMap`](/api/type-aliases/twebglattributelocationmap/)

A map of attribute names to attribute locations.

#### Inherited from

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`getAttributeLocations`](/api/fabric/namespaces/filters/classes/basefilter/#getattributelocations)

***

### getCacheKey()

> **getCacheKey**(): `string`

Defined in: [src/filters/BaseFilter.ts:282](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L282)

Returns a string that represent the current selected shader code for the filter.
Used to force recompilation when parameters change or to retrieve the shader from cache

#### Returns

`string`

#### Inherited from

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`getCacheKey`](/api/fabric/namespaces/filters/classes/basefilter/#getcachekey)

***

### getUniformLocations()

> **getUniformLocations**(`gl`, `program`): [`TWebGLUniformLocationMap`](/api/type-aliases/twebgluniformlocationmap/)

Defined in: [src/filters/BaseFilter.ts:167](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L167)

Return a map of uniform names to WebGLUniformLocation objects.

#### Parameters

##### gl

`WebGLRenderingContext`

The canvas context used to compile the shader program.

##### program

`WebGLProgram`

The shader program from which to take uniform locations.

#### Returns

[`TWebGLUniformLocationMap`](/api/type-aliases/twebgluniformlocationmap/)

A map of uniform names to uniform locations.

#### Inherited from

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`getUniformLocations`](/api/fabric/namespaces/filters/classes/basefilter/#getuniformlocations)

***

### getVertexSource()

> **getVertexSource**(): `string`

Defined in: [src/filters/BaseFilter.ts:70](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L70)

#### Returns

`string`

#### Inherited from

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`getVertexSource`](/api/fabric/namespaces/filters/classes/basefilter/#getvertexsource)

***

### isNeutralState()

> **isNeutralState**(): `boolean`

Defined in: [src/filters/Composed.ts:62](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/Composed.ts#L62)

Generic isNeutral implementation for one parameter based filters.
Used only in image applyFilters to discard filters that will not have an effect
on the image
Other filters may need their own version ( ColorMatrix, HueRotation, gamma, ComposedFilter )

#### Returns

`boolean`

#### Overrides

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`isNeutralState`](/api/fabric/namespaces/filters/classes/basefilter/#isneutralstate)

***

### retrieveShader()

> **retrieveShader**(`options`): [`TWebGLProgramCacheItem`](/api/type-aliases/twebglprogramcacheitem/)

Defined in: [src/filters/BaseFilter.ts:293](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L293)

Retrieves the cached shader.

#### Parameters

##### options

[`TWebGLPipelineState`](/api/type-aliases/twebglpipelinestate/)

#### Returns

[`TWebGLProgramCacheItem`](/api/type-aliases/twebglprogramcacheitem/)

the compiled program shader

#### Inherited from

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`retrieveShader`](/api/fabric/namespaces/filters/classes/basefilter/#retrieveshader)

***

### sendAttributeData()

> **sendAttributeData**(`gl`, `attributeLocations`, `aPositionData`): `void`

Defined in: [src/filters/BaseFilter.ts:190](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L190)

Send attribute data from this filter to its shader program on the GPU.

#### Parameters

##### gl

`WebGLRenderingContext`

The canvas context used to compile the shader program.

##### attributeLocations

`Record`\<`string`, `number`\>

A map of shader attribute names to their locations.

##### aPositionData

`Float32Array`

#### Returns

`void`

#### Inherited from

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`sendAttributeData`](/api/fabric/namespaces/filters/classes/basefilter/#sendattributedata)

***

### sendUniformData()

> **sendUniformData**(`_gl`, `_uniformLocations`): `void`

Defined in: [src/filters/BaseFilter.ts:357](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L357)

Send uniform data from this filter to its shader program on the GPU.

Intended to be overridden by subclasses.

#### Parameters

##### \_gl

`WebGLRenderingContext`

The canvas context used to compile the shader program.

##### \_uniformLocations

[`TWebGLUniformLocationMap`](/api/type-aliases/twebgluniformlocationmap/)

A map of shader uniform names to their locations.

#### Returns

`void`

#### Inherited from

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`sendUniformData`](/api/fabric/namespaces/filters/classes/basefilter/#senduniformdata)

***

### toJSON()

> **toJSON**(): `object` & `ComposedSerializedProps`

Defined in: [src/filters/BaseFilter.ts:405](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L405)

Returns a JSON representation of an instance

#### Returns

`object` & `ComposedSerializedProps`

JSON

#### Inherited from

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`toJSON`](/api/fabric/namespaces/filters/classes/basefilter/#tojson)

***

### toObject()

> **toObject**(): `object`

Defined in: [src/filters/Composed.ts:55](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/Composed.ts#L55)

Serialize this filter into JSON.

#### Returns

`object`

A JSON representation of this filter.

##### subFilters

> **subFilters**: `object` & `object`[]

##### type

> **type**: `"Composed"`

#### Overrides

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`toObject`](/api/fabric/namespaces/filters/classes/basefilter/#toobject)

***

### unbindAdditionalTexture()

> **unbindAdditionalTexture**(`gl`, `textureUnit`): `void`

Defined in: [src/filters/BaseFilter.ts:343](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L343)

#### Parameters

##### gl

`WebGLRenderingContext`

##### textureUnit

`number`

#### Returns

`void`

#### Inherited from

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`unbindAdditionalTexture`](/api/fabric/namespaces/filters/classes/basefilter/#unbindadditionaltexture)

***

### fromObject()

> `static` **fromObject**(`object`, `options?`): `Promise`\<`Composed`\>

Defined in: [src/filters/Composed.ts:73](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/Composed.ts#L73)

Deserialize a JSON definition of a ComposedFilter into a concrete instance.

#### Parameters

##### object

`Record`\<`string`, `any`\>

Object to create an instance from

##### options?

###### signal

`AbortSignal`

handle aborting `BlendImage` filter loading, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal

#### Returns

`Promise`\<`Composed`\>

#### Overrides

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`fromObject`](/api/fabric/namespaces/filters/classes/basefilter/#fromobject)
