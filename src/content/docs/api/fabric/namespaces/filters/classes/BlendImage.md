---
editUrl: false
next: false
prev: false
title: "BlendImage"
---

Defined in: [src/filters/BlendImage.ts:41](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BlendImage.ts#L41)

Image Blend filter class

## Example

```ts
const filter = new filters.BlendColor({
 color: '#000',
 mode: 'multiply'
});

const filter = new BlendImage({
 image: fabricImageObject,
 mode: 'multiply'
});
object.filters.push(filter);
object.applyFilters();
canvas.renderAll();
```

## Extends

- [`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/)\<`"BlendImage"`, `BlendImageOwnProps`\>

## Constructors

### Constructor

> **new BlendImage**(`options?`): `BlendImage`

Defined in: [src/filters/BaseFilter.ts:55](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L55)

Constructor

#### Parameters

##### options?

`object` & `Partial`\<`BlendImageOwnProps`\> & `Record`\<`string`, `any`\> = `{}`

Options object

#### Returns

`BlendImage`

#### Inherited from

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`constructor`](/api/fabric/namespaces/filters/classes/basefilter/#constructor)

## Properties

### alpha

> **alpha**: `number`

Defined in: [src/filters/BlendImage.ts:61](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BlendImage.ts#L61)

alpha value. represent the strength of the blend image operation.
not implemented.

***

### image

> **image**: [`FabricImage`](/api/classes/fabricimage/)

Defined in: [src/filters/BlendImage.ts:45](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BlendImage.ts#L45)

Image to make the blend operation with.

***

### mode

> **mode**: `TBlendImageMode`

Defined in: [src/filters/BlendImage.ts:55](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BlendImage.ts#L55)

Blend mode for the filter: either 'multiply' or 'mask'. 'multiply' will
multiply the values of each channel (R, G, B, and A) of the filter image by
their corresponding values in the base image. 'mask' will only look at the
alpha channel of the filter image, and apply those values to the base
image's alpha channel.

***

### defaults

> `static` **defaults**: `BlendImageOwnProps` = `blendImageDefaultValues`

Defined in: [src/filters/BlendImage.ts:65](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BlendImage.ts#L65)

#### Overrides

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`defaults`](/api/fabric/namespaces/filters/classes/basefilter/#defaults)

***

### type

> `static` **type**: `string` = `'BlendImage'`

Defined in: [src/filters/BlendImage.ts:63](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BlendImage.ts#L63)

The class type. Used to identify which class this is.
This is used for serialization purposes and internally it can be used
to identify classes. As a developer you could use `instance of Class`
but to avoid importing all the code and blocking tree shaking we try
to avoid doing that.

#### Overrides

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`type`](/api/fabric/namespaces/filters/classes/basefilter/#type)

***

### uniformLocations

> `static` **uniformLocations**: `string`[]

Defined in: [src/filters/BlendImage.ts:67](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BlendImage.ts#L67)

Contains the uniform locations for the fragment shader.
uStepW and uStepH are handled by the BaseFilter, each filter class
needs to specify all the one that are needed

#### Overrides

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

Defined in: [src/filters/BaseFilter.ts:263](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L263)

Apply this filter to the input image data provided.

Determines whether to use WebGL or Canvas2D based on the options.webgl flag.

#### Parameters

##### options

[`TWebGLPipelineState`](/api/type-aliases/twebglpipelinestate/) | [`T2DPipelineState`](/api/type-aliases/t2dpipelinestate/)

#### Returns

`void`

#### Inherited from

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`applyTo`](/api/fabric/namespaces/filters/classes/basefilter/#applyto)

***

### applyTo2d()

> **applyTo2d**(`options`): `void`

Defined in: [src/filters/BlendImage.ts:121](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BlendImage.ts#L121)

Apply the Blend operation to a Uint8ClampedArray representing the pixels of an image.

#### Parameters

##### options

[`T2DPipelineState`](/api/type-aliases/t2dpipelinestate/)

#### Returns

`void`

#### Overrides

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`applyTo2d`](/api/fabric/namespaces/filters/classes/basefilter/#applyto2d)

***

### applyToWebGL()

> **applyToWebGL**(`options`): `void`

Defined in: [src/filters/BlendImage.ts:81](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BlendImage.ts#L81)

Apply this filter using webgl.

#### Parameters

##### options

[`TWebGLPipelineState`](/api/type-aliases/twebglpipelinestate/)

#### Returns

`void`

#### Overrides

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

### calculateMatrix()

> **calculateMatrix**(): `number`[]

Defined in: [src/filters/BlendImage.ts:99](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BlendImage.ts#L99)

Calculate a transformMatrix to adapt the image to blend over

#### Returns

`number`[]

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

### createTexture()

> **createTexture**(`backend`, `image`): `null` \| `WebGLTexture`

Defined in: [src/filters/BlendImage.ts:89](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BlendImage.ts#L89)

#### Parameters

##### backend

[`WebGLFilterBackend`](/api/classes/webglfilterbackend/)

##### image

[`FabricImage`](/api/classes/fabricimage/)

#### Returns

`null` \| `WebGLTexture`

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

Defined in: [src/filters/BlendImage.ts:69](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BlendImage.ts#L69)

Returns a string that represent the current selected shader code for the filter.
Used to force recompilation when parameters change or to retrieve the shader from cache

#### Returns

`string`

#### Overrides

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`getCacheKey`](/api/fabric/namespaces/filters/classes/basefilter/#getcachekey)

***

### getFragmentSource()

> **getFragmentSource**(): `string`

Defined in: [src/filters/BlendImage.ts:73](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BlendImage.ts#L73)

#### Returns

`string`

#### Overrides

`BaseFilter.getFragmentSource`

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

Defined in: [src/filters/BlendImage.ts:77](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BlendImage.ts#L77)

#### Returns

`string`

#### Overrides

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`getVertexSource`](/api/fabric/namespaces/filters/classes/basefilter/#getvertexsource)

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

#### Inherited from

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

> **sendUniformData**(`gl`, `uniformLocations`): `void`

Defined in: [src/filters/BlendImage.ts:178](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BlendImage.ts#L178)

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

#### Overrides

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`sendUniformData`](/api/fabric/namespaces/filters/classes/basefilter/#senduniformdata)

***

### toJSON()

> **toJSON**(): `object` & `BlendImageOwnProps`

Defined in: [src/filters/BaseFilter.ts:405](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BaseFilter.ts#L405)

Returns a JSON representation of an instance

#### Returns

`object` & `BlendImageOwnProps`

JSON

#### Inherited from

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`toJSON`](/api/fabric/namespaces/filters/classes/basefilter/#tojson)

***

### toObject()

> **toObject**(): `object` & `BlendImageOwnProps`

Defined in: [src/filters/BlendImage.ts:193](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BlendImage.ts#L193)

Returns object representation of an instance
TODO: Handle the possibility of missing image better.
As of now a BlendImage filter without image can't be used with fromObject

#### Returns

`object` & `BlendImageOwnProps`

Object representation of an instance

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

> `static` **fromObject**(`object`, `options?`): `Promise`\<[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/)\<`"BlendImage"`, `BlendImageOwnProps`, `BlendImageOwnProps`\>\>

Defined in: [src/filters/BlendImage.ts:210](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/BlendImage.ts#L210)

Create filter instance from an object representation

#### Parameters

##### object

`Record`\<`string`, `any`\>

Object to create an instance from

##### options?

###### signal

`AbortSignal`

handle aborting image loading, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal

#### Returns

`Promise`\<[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/)\<`"BlendImage"`, `BlendImageOwnProps`, `BlendImageOwnProps`\>\>

#### Overrides

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/).[`fromObject`](/api/fabric/namespaces/filters/classes/basefilter/#fromobject)
