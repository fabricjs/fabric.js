---
editUrl: false
next: false
prev: false
title: "BaseFilter"
---

Defined in: [src/filters/BaseFilter.ts:21](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L21)

## Extended by

- [`BlendColor`](/api/fabric/namespaces/filters/classes/blendcolor/)
- [`BlendImage`](/api/fabric/namespaces/filters/classes/blendimage/)
- [`Blur`](/api/fabric/namespaces/filters/classes/blur/)
- [`Brightness`](/api/fabric/namespaces/filters/classes/brightness/)
- [`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/)
- [`Composed`](/api/fabric/namespaces/filters/classes/composed/)
- [`Contrast`](/api/fabric/namespaces/filters/classes/contrast/)
- [`Convolute`](/api/fabric/namespaces/filters/classes/convolute/)
- [`Gamma`](/api/fabric/namespaces/filters/classes/gamma/)
- [`Grayscale`](/api/fabric/namespaces/filters/classes/grayscale/)
- [`Invert`](/api/fabric/namespaces/filters/classes/invert/)
- [`Noise`](/api/fabric/namespaces/filters/classes/noise/)
- [`Pixelate`](/api/fabric/namespaces/filters/classes/pixelate/)
- [`RemoveColor`](/api/fabric/namespaces/filters/classes/removecolor/)
- [`Resize`](/api/fabric/namespaces/filters/classes/resize/)
- [`Saturation`](/api/fabric/namespaces/filters/classes/saturation/)
- [`Vibrance`](/api/fabric/namespaces/filters/classes/vibrance/)

## Type Parameters

### Name

`Name` *extends* `string`

### OwnProps

`OwnProps` *extends* `Record`\<`string`, `any`\> = `object`

### SerializedProps

`SerializedProps` *extends* `Record`\<`string`, `any`\> = `OwnProps`

## Constructors

### Constructor

> **new BaseFilter**\<`Name`, `OwnProps`, `SerializedProps`\>(`options?`): `BaseFilter`\<`Name`, `OwnProps`, `SerializedProps`\>

Defined in: [src/filters/BaseFilter.ts:55](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L55)

Constructor

#### Parameters

##### options?

`object` & `Partial`\<`OwnProps`\> & `Record`\<`string`, `any`\> = `{}`

Options object

#### Returns

`BaseFilter`\<`Name`, `OwnProps`, `SerializedProps`\>

## Properties

### defaults

> `static` **defaults**: `Record`\<`string`, `unknown`\>

Defined in: [src/filters/BaseFilter.ts:49](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L49)

***

### type

> `static` **type**: `string` = `'BaseFilter'`

Defined in: [src/filters/BaseFilter.ts:40](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L40)

The class type. Used to identify which class this is.
This is used for serialization purposes and internally it can be used
to identify classes. As a developer you could use `instance of Class`
but to avoid importing all the code and blocking tree shaking we try
to avoid doing that.

***

### uniformLocations

> `static` **uniformLocations**: `string`[] = `[]`

Defined in: [src/filters/BaseFilter.ts:47](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L47)

Contains the uniform locations for the fragment shader.
uStepW and uStepH are handled by the BaseFilter, each filter class
needs to specify all the one that are needed

## Accessors

### type

#### Get Signature

> **get** **type**(): `Name`

Defined in: [src/filters/BaseFilter.ts:29](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L29)

Filter type

##### Returns

`Name`

## Methods

### \_setupFrameBuffer()

> **\_setupFrameBuffer**(`options`): `void`

Defined in: [src/filters/BaseFilter.ts:203](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L203)

#### Parameters

##### options

[`TWebGLPipelineState`](/api/type-aliases/twebglpipelinestate/)

#### Returns

`void`

***

### \_swapTextures()

> **\_swapTextures**(`options`): `void`

Defined in: [src/filters/BaseFilter.ts:230](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L230)

#### Parameters

##### options

[`TWebGLPipelineState`](/api/type-aliases/twebglpipelinestate/)

#### Returns

`void`

***

### applyTo()

> **applyTo**(`options`): `void`

Defined in: [src/filters/BaseFilter.ts:263](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L263)

Apply this filter to the input image data provided.

Determines whether to use WebGL or Canvas2D based on the options.webgl flag.

#### Parameters

##### options

[`TWebGLPipelineState`](/api/type-aliases/twebglpipelinestate/) | [`T2DPipelineState`](/api/type-aliases/t2dpipelinestate/)

#### Returns

`void`

***

### applyTo2d()

> **applyTo2d**(`_options`): `void`

Defined in: [src/filters/BaseFilter.ts:273](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L273)

#### Parameters

##### \_options

[`T2DPipelineState`](/api/type-aliases/t2dpipelinestate/)

#### Returns

`void`

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

***

### getCacheKey()

> **getCacheKey**(): `string`

Defined in: [src/filters/BaseFilter.ts:282](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L282)

Returns a string that represent the current selected shader code for the filter.
Used to force recompilation when parameters change or to retrieve the shader from cache

#### Returns

`string`

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

***

### getVertexSource()

> **getVertexSource**(): `string`

Defined in: [src/filters/BaseFilter.ts:70](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L70)

#### Returns

`string`

***

### isNeutralState()

> **isNeutralState**(`options?`): `boolean`

Defined in: [src/filters/BaseFilter.ts:246](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L246)

Generic isNeutral implementation for one parameter based filters.
Used only in image applyFilters to discard filters that will not have an effect
on the image
Other filters may need their own version ( ColorMatrix, HueRotation, gamma, ComposedFilter )

#### Parameters

##### options?

`any`

#### Returns

`boolean`

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

***

### toJSON()

> **toJSON**(): `object` & `SerializedProps`

Defined in: [src/filters/BaseFilter.ts:405](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L405)

Returns a JSON representation of an instance

#### Returns

`object` & `SerializedProps`

JSON

***

### toObject()

> **toObject**(): `object` & `SerializedProps`

Defined in: [src/filters/BaseFilter.ts:385](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L385)

Returns object representation of an instance
It will automatically export the default values of a filter,
stored in the static defaults property.

#### Returns

`object` & `SerializedProps`

Object representation of an instance

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

***

### fromObject()

> `static` **fromObject**(`__namedParameters`, `_options?`): `Promise`\<`BaseFilter`\<`string`, `object`, `object`\>\>

Defined in: [src/filters/BaseFilter.ts:410](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L410)

#### Parameters

##### \_\_namedParameters

`Record`\<`string`, `any`\>

##### \_options?

[`Abortable`](/api/type-aliases/abortable/)

#### Returns

`Promise`\<`BaseFilter`\<`string`, `object`, `object`\>\>
