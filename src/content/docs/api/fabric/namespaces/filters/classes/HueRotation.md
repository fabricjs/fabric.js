---
editUrl: false
next: false
prev: false
title: "HueRotation"
---

Defined in: [src/filters/HueRotation.ts:33](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/HueRotation.ts#L33)

HueRotation filter class

## Example

```ts
const filter = new HueRotation({
  rotation: -0.5
});
object.filters.push(filter);
object.applyFilters();
```

## Extends

- [`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/)\<`"HueRotation"`, `HueRotationOwnProps`, `HueRotationSerializedProps`\>

## Constructors

### Constructor

> **new HueRotation**(`options?`): `HueRotation`

Defined in: [src/filters/BaseFilter.ts:55](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/BaseFilter.ts#L55)

Constructor

#### Parameters

##### options?

`object` & `Partial`\<`HueRotationOwnProps`\> & `Record`\<`string`, `any`\> = `{}`

Options object

#### Returns

`HueRotation`

#### Inherited from

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`constructor`](/api/fabric/namespaces/filters/classes/colormatrix/#constructor)

## Properties

### colorsOnly

> **colorsOnly**: `boolean`

Defined in: [src/filters/ColorMatrix.ts:56](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/ColorMatrix.ts#L56)

Lock the colormatrix on the color part, skipping alpha, mainly for non webgl scenario
to save some calculation

#### Default

```ts
true
```

#### Inherited from

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`colorsOnly`](/api/fabric/namespaces/filters/classes/colormatrix/#colorsonly)

***

### matrix

> **matrix**: [`TMatColorMatrix`](/api/type-aliases/tmatcolormatrix/)

Defined in: [src/filters/ColorMatrix.ts:48](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/ColorMatrix.ts#L48)

Colormatrix for pixels.
array of 20 floats. Numbers in positions 4, 9, 14, 19 loose meaning
outside the -1, 1 range.
0.0039215686 is the part of 1 that get translated to 1 in 2d

#### Param

array of 20 numbers.

#### Inherited from

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`matrix`](/api/fabric/namespaces/filters/classes/colormatrix/#matrix)

***

### rotation

> **rotation**: `number`

Defined in: [src/filters/HueRotation.ts:41](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/HueRotation.ts#L41)

HueRotation value, from -1 to 1.

***

### defaults

> `static` **defaults**: `HueRotationOwnProps` = `hueRotationDefaultValues`

Defined in: [src/filters/HueRotation.ts:45](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/HueRotation.ts#L45)

#### Overrides

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`defaults`](/api/fabric/namespaces/filters/classes/colormatrix/#defaults)

***

### type

> `static` **type**: `string` = `'HueRotation'`

Defined in: [src/filters/HueRotation.ts:43](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/HueRotation.ts#L43)

The class type. Used to identify which class this is.
This is used for serialization purposes and internally it can be used
to identify classes. As a developer you could use `instance of Class`
but to avoid importing all the code and blocking tree shaking we try
to avoid doing that.

#### Overrides

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`type`](/api/fabric/namespaces/filters/classes/colormatrix/#type)

***

### uniformLocations

> `static` **uniformLocations**: `string`[]

Defined in: [src/filters/ColorMatrix.ts:62](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/ColorMatrix.ts#L62)

Contains the uniform locations for the fragment shader.
uStepW and uStepH are handled by the BaseFilter, each filter class
needs to specify all the one that are needed

#### Inherited from

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`uniformLocations`](/api/fabric/namespaces/filters/classes/colormatrix/#uniformlocations)

## Accessors

### type

#### Get Signature

> **get** **type**(): `Name`

Defined in: [src/filters/BaseFilter.ts:29](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/BaseFilter.ts#L29)

Filter type

##### Returns

`Name`

#### Inherited from

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`type`](/api/fabric/namespaces/filters/classes/colormatrix/#type-1)

## Methods

### \_setupFrameBuffer()

> **\_setupFrameBuffer**(`options`): `void`

Defined in: [src/filters/BaseFilter.ts:203](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/BaseFilter.ts#L203)

#### Parameters

##### options

[`TWebGLPipelineState`](/api/type-aliases/twebglpipelinestate/)

#### Returns

`void`

#### Inherited from

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`_setupFrameBuffer`](/api/fabric/namespaces/filters/classes/colormatrix/#_setupframebuffer)

***

### \_swapTextures()

> **\_swapTextures**(`options`): `void`

Defined in: [src/filters/BaseFilter.ts:230](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/BaseFilter.ts#L230)

#### Parameters

##### options

[`TWebGLPipelineState`](/api/type-aliases/twebglpipelinestate/)

#### Returns

`void`

#### Inherited from

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`_swapTextures`](/api/fabric/namespaces/filters/classes/colormatrix/#_swaptextures)

***

### applyTo()

> **applyTo**(`options`): `void`

Defined in: [src/filters/HueRotation.ts:82](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/HueRotation.ts#L82)

Apply this filter to the input image data provided.

Determines whether to use WebGL or Canvas2D based on the options.webgl flag.

#### Parameters

##### options

[`TWebGLPipelineState`](/api/type-aliases/twebglpipelinestate/) | [`T2DPipelineState`](/api/type-aliases/t2dpipelinestate/)

#### Returns

`void`

#### Overrides

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`applyTo`](/api/fabric/namespaces/filters/classes/colormatrix/#applyto)

***

### applyTo2d()

> **applyTo2d**(`options`): `void`

Defined in: [src/filters/ColorMatrix.ts:74](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/ColorMatrix.ts#L74)

Apply the ColorMatrix operation to a Uint8Array representing the pixels of an image.

#### Parameters

##### options

[`T2DPipelineState`](/api/type-aliases/t2dpipelinestate/)

#### Returns

`void`

#### Inherited from

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`applyTo2d`](/api/fabric/namespaces/filters/classes/colormatrix/#applyto2d)

***

### applyToWebGL()

> **applyToWebGL**(`options`): `void`

Defined in: [src/filters/BaseFilter.ts:313](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/BaseFilter.ts#L313)

Apply this filter using webgl.

#### Parameters

##### options

[`TWebGLPipelineState`](/api/type-aliases/twebglpipelinestate/)

#### Returns

`void`

#### Inherited from

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`applyToWebGL`](/api/fabric/namespaces/filters/classes/colormatrix/#applytowebgl)

***

### bindAdditionalTexture()

> **bindAdditionalTexture**(`gl`, `texture`, `textureUnit`): `void`

Defined in: [src/filters/BaseFilter.ts:332](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/BaseFilter.ts#L332)

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

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`bindAdditionalTexture`](/api/fabric/namespaces/filters/classes/colormatrix/#bindadditionaltexture)

***

### calculateMatrix()

> **calculateMatrix**(): `void`

Defined in: [src/filters/HueRotation.ts:47](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/HueRotation.ts#L47)

#### Returns

`void`

***

### createHelpLayer()

> **createHelpLayer**(`options`): `void`

Defined in: [src/filters/BaseFilter.ts:368](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/BaseFilter.ts#L368)

If needed by a 2d filter, this functions can create an helper canvas to be used
remember that options.targetCanvas is available for use till end of chain.

#### Parameters

##### options

[`T2DPipelineState`](/api/type-aliases/t2dpipelinestate/)

#### Returns

`void`

#### Inherited from

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`createHelpLayer`](/api/fabric/namespaces/filters/classes/colormatrix/#createhelplayer)

***

### createProgram()

> **createProgram**(`gl`, `fragmentSource`, `vertexSource`): `object`

Defined in: [src/filters/BaseFilter.ts:81](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/BaseFilter.ts#L81)

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

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`createProgram`](/api/fabric/namespaces/filters/classes/colormatrix/#createprogram)

***

### getAttributeLocations()

> **getAttributeLocations**(`gl`, `program`): [`TWebGLAttributeLocationMap`](/api/type-aliases/twebglattributelocationmap/)

Defined in: [src/filters/BaseFilter.ts:151](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/BaseFilter.ts#L151)

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

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`getAttributeLocations`](/api/fabric/namespaces/filters/classes/colormatrix/#getattributelocations)

***

### getCacheKey()

> **getCacheKey**(): `string`

Defined in: [src/filters/BaseFilter.ts:282](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/BaseFilter.ts#L282)

Returns a string that represent the current selected shader code for the filter.
Used to force recompilation when parameters change or to retrieve the shader from cache

#### Returns

`string`

#### Inherited from

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`getCacheKey`](/api/fabric/namespaces/filters/classes/colormatrix/#getcachekey)

***

### getFragmentSource()

> **getFragmentSource**(): `string`

Defined in: [src/filters/ColorMatrix.ts:64](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/ColorMatrix.ts#L64)

#### Returns

`string`

#### Inherited from

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`getFragmentSource`](/api/fabric/namespaces/filters/classes/colormatrix/#getfragmentsource)

***

### getUniformLocations()

> **getUniformLocations**(`gl`, `program`): [`TWebGLUniformLocationMap`](/api/type-aliases/twebgluniformlocationmap/)

Defined in: [src/filters/BaseFilter.ts:167](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/BaseFilter.ts#L167)

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

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`getUniformLocations`](/api/fabric/namespaces/filters/classes/colormatrix/#getuniformlocations)

***

### getVertexSource()

> **getVertexSource**(): `string`

Defined in: [src/filters/BaseFilter.ts:70](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/BaseFilter.ts#L70)

#### Returns

`string`

#### Inherited from

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`getVertexSource`](/api/fabric/namespaces/filters/classes/colormatrix/#getvertexsource)

***

### isNeutralState()

> **isNeutralState**(): `boolean`

Defined in: [src/filters/HueRotation.ts:78](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/HueRotation.ts#L78)

Generic isNeutral implementation for one parameter based filters.
Used only in image applyFilters to discard filters that will not have an effect
on the image
Other filters may need their own version ( ColorMatrix, HueRotation, gamma, ComposedFilter )

#### Returns

`boolean`

#### Overrides

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`isNeutralState`](/api/fabric/namespaces/filters/classes/colormatrix/#isneutralstate)

***

### retrieveShader()

> **retrieveShader**(`options`): [`TWebGLProgramCacheItem`](/api/type-aliases/twebglprogramcacheitem/)

Defined in: [src/filters/BaseFilter.ts:293](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/BaseFilter.ts#L293)

Retrieves the cached shader.

#### Parameters

##### options

[`TWebGLPipelineState`](/api/type-aliases/twebglpipelinestate/)

#### Returns

[`TWebGLProgramCacheItem`](/api/type-aliases/twebglprogramcacheitem/)

the compiled program shader

#### Inherited from

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`retrieveShader`](/api/fabric/namespaces/filters/classes/colormatrix/#retrieveshader)

***

### sendAttributeData()

> **sendAttributeData**(`gl`, `attributeLocations`, `aPositionData`): `void`

Defined in: [src/filters/BaseFilter.ts:190](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/BaseFilter.ts#L190)

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

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`sendAttributeData`](/api/fabric/namespaces/filters/classes/colormatrix/#sendattributedata)

***

### sendUniformData()

> **sendUniformData**(`gl`, `uniformLocations`): `void`

Defined in: [src/filters/ColorMatrix.ts:105](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/ColorMatrix.ts#L105)

Send data from this filter to its shader program's uniforms.

#### Parameters

##### gl

`WebGLRenderingContext`

The GL canvas context used to compile this filter's shader.

##### uniformLocations

[`TWebGLUniformLocationMap`](/api/type-aliases/twebgluniformlocationmap/)

A map of string uniform names to WebGLUniformLocation objects

#### Returns

`void`

#### Inherited from

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`sendUniformData`](/api/fabric/namespaces/filters/classes/colormatrix/#senduniformdata)

***

### toJSON()

> **toJSON**(): `object` & `HueRotationSerializedProps`

Defined in: [src/filters/BaseFilter.ts:405](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/BaseFilter.ts#L405)

Returns a JSON representation of an instance

#### Returns

`object` & `HueRotationSerializedProps`

JSON

#### Inherited from

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`toJSON`](/api/fabric/namespaces/filters/classes/colormatrix/#tojson)

***

### toObject()

> **toObject**(): `object`

Defined in: [src/filters/HueRotation.ts:87](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/HueRotation.ts#L87)

Returns object representation of an instance
It will automatically export the default values of a filter,
stored in the static defaults property.

#### Returns

`object`

Object representation of an instance

##### rotation

> **rotation**: `number`

##### type

> **type**: `"HueRotation"`

#### Overrides

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`toObject`](/api/fabric/namespaces/filters/classes/colormatrix/#toobject)

***

### unbindAdditionalTexture()

> **unbindAdditionalTexture**(`gl`, `textureUnit`): `void`

Defined in: [src/filters/BaseFilter.ts:343](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/BaseFilter.ts#L343)

#### Parameters

##### gl

`WebGLRenderingContext`

##### textureUnit

`number`

#### Returns

`void`

#### Inherited from

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`unbindAdditionalTexture`](/api/fabric/namespaces/filters/classes/colormatrix/#unbindadditionaltexture)

***

### fromObject()

> `static` **fromObject**(`__namedParameters`, `_options?`): `Promise`\<[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/)\<`string`, `object`, `object`\>\>

Defined in: [src/filters/BaseFilter.ts:410](https://github.com/fabricjs/fabric.js/blob/210ef03ea157dba4ba760f1657f98d392ab02bc5/src/filters/BaseFilter.ts#L410)

#### Parameters

##### \_\_namedParameters

`Record`\<`string`, `any`\>

##### \_options?

[`Abortable`](/api/type-aliases/abortable/)

#### Returns

`Promise`\<[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/)\<`string`, `object`, `object`\>\>

#### Inherited from

[`ColorMatrix`](/api/fabric/namespaces/filters/classes/colormatrix/).[`fromObject`](/api/fabric/namespaces/filters/classes/colormatrix/#fromobject)
