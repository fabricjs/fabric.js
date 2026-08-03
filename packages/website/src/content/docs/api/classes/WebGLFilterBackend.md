---
editUrl: false
next: false
prev: false
title: "WebGLFilterBackend"
---

Defined in: [src/filters/WebGLFilterBackend.ts:11](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/WebGLFilterBackend.ts#L11)

## Constructors

### Constructor

> **new WebGLFilterBackend**(`__namedParameters`): `WebGLFilterBackend`

Defined in: [src/filters/WebGLFilterBackend.ts:56](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/WebGLFilterBackend.ts#L56)

#### Parameters

##### \_\_namedParameters

###### tileSize?

`number` = `config.textureSize`

#### Returns

`WebGLFilterBackend`

## Properties

### aPosition

> **aPosition**: `Float32Array`

Defined in: [src/filters/WebGLFilterBackend.ts:17](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/WebGLFilterBackend.ts#L17)

Define ...

***

### canvas

> **canvas**: `HTMLCanvasElement`

Defined in: [src/filters/WebGLFilterBackend.ts:25](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/WebGLFilterBackend.ts#L25)

***

### gl

> **gl**: `WebGLRenderingContext`

Defined in: [src/filters/WebGLFilterBackend.ts:30](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/WebGLFilterBackend.ts#L30)

The Webgl context that will execute the operations for filtering

***

### gpuInfo

> **gpuInfo**: `any`

Defined in: [src/filters/WebGLFilterBackend.ts:45](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/WebGLFilterBackend.ts#L45)

Contains GPU info for debug

***

### imageBuffer?

> `optional` **imageBuffer**: `ArrayBuffer`

Defined in: [src/filters/WebGLFilterBackend.ts:23](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/WebGLFilterBackend.ts#L23)

If GLPut data is the fastest operation, or if forced, this buffer will be used
to transfer the data back in the 2d logic

***

### programCache

> **programCache**: `any`

Defined in: [src/filters/WebGLFilterBackend.ts:35](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/WebGLFilterBackend.ts#L35)

Keyed map for shader cache

***

### resources

> **resources**: [`TPipelineResources`](/api/type-aliases/tpipelineresources/) = `{}`

Defined in: [src/filters/WebGLFilterBackend.ts:54](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/WebGLFilterBackend.ts#L54)

Experimental. This object is a sort of repository of help layers used to avoid
of recreating them during frequent filtering. If you are previewing a filter with
a slider you probably do not want to create help layers every filter step.
in this object there will be appended some canvases, created once, resized sometimes
cleared never. Clearing is left to the developer.

***

### textureCache

> **textureCache**: [`TTextureCache`](/api/type-aliases/ttexturecache/)

Defined in: [src/filters/WebGLFilterBackend.ts:40](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/WebGLFilterBackend.ts#L40)

Keyed map for texture cache

***

### tileSize

> **tileSize**: `number`

Defined in: [src/filters/WebGLFilterBackend.ts:12](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/WebGLFilterBackend.ts#L12)

## Methods

### applyFilters()

> **applyFilters**(`filters`, `source`, `width`, `height`, `targetCanvas`, `cacheKey?`): `undefined` \| [`TWebGLPipelineState`](/api/type-aliases/twebglpipelinestate/)

Defined in: [src/filters/WebGLFilterBackend.ts:106](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/WebGLFilterBackend.ts#L106)

Attempts to apply the requested filters to the source provided, drawing the filtered output
to the provided target canvas.

#### Parameters

##### filters

[`BaseFilter`](/api/fabric/namespaces/filters/classes/basefilter/)\<`string`, `object`, `object`\>[]

The filters to apply.

##### source

`TexImageSource`

The source to be filtered.

##### width

`number`

The width of the source input.

##### height

`number`

The height of the source input.

##### targetCanvas

`HTMLCanvasElement`

The destination for filtered output to be drawn.

##### cacheKey?

`string`

A key used to cache resources related to the source. If
omitted, caching will be skipped.

#### Returns

`undefined` \| [`TWebGLPipelineState`](/api/type-aliases/twebglpipelinestate/)

***

### captureGPUInfo()

> **captureGPUInfo**(): `any`

Defined in: [src/filters/WebGLFilterBackend.ts:380](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/WebGLFilterBackend.ts#L380)

Attempt to extract GPU information strings from a WebGL context.

Useful information when debugging or blacklisting specific GPUs.

#### Returns

`any`

A GPU info object with renderer and vendor strings.

***

### clearWebGLCaches()

> **clearWebGLCaches**(): `void`

Defined in: [src/filters/WebGLFilterBackend.ts:193](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/WebGLFilterBackend.ts#L193)

Wipe out WebGL-related caches.

#### Returns

`void`

***

### copyGLTo2D()

> **copyGLTo2D**(`gl`, `pipelineState`): `void`

Defined in: [src/filters/WebGLFilterBackend.ts:320](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/WebGLFilterBackend.ts#L320)

Copy an input WebGL canvas on to an output 2D canvas.

The WebGL canvas is assumed to be upside down, with the top-left pixel of the
desired output image appearing in the bottom-left corner of the WebGL canvas.

#### Parameters

##### gl

`WebGLRenderingContext`

##### pipelineState

[`TWebGLPipelineState`](/api/type-aliases/twebglpipelinestate/)

The 2D target canvas to copy on to.

#### Returns

`void`

***

### copyGLTo2DPutImageData()

> **copyGLTo2DPutImageData**(`this`, `gl`, `pipelineState`): `void`

Defined in: [src/filters/WebGLFilterBackend.ts:352](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/WebGLFilterBackend.ts#L352)

Copy an input WebGL canvas on to an output 2D canvas using 2d canvas' putImageData
API. Measurably faster than using ctx.drawImage in Firefox (version 54 on OSX Sierra).

#### Parameters

##### this

`Required`\<`WebGLFilterBackend`\>

##### gl

`WebGLRenderingContext`

##### pipelineState

[`TWebGLPipelineState`](/api/type-aliases/twebglpipelinestate/)

The 2D target canvas to copy on to.

#### Returns

`void`

***

### createTexture()

> **createTexture**(`gl`, `width`, `height`, `textureImageSource?`, `filter?`): `WebGLTexture`

Defined in: [src/filters/WebGLFilterBackend.ts:211](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/WebGLFilterBackend.ts#L211)

Create a WebGL texture object.

Accepts specific dimensions to initialize the texture to or a source image.

#### Parameters

##### gl

`WebGLRenderingContext`

The GL context to use for creating the texture.

##### width

`number`

The width to initialize the texture at.

##### height

`number`

The height to initialize the texture.

##### textureImageSource?

`TexImageSource`

A source for the texture data.

##### filter?

gl.NEAREST default or gl.LINEAR filters for the texture.
This filter is very useful for LUTs filters. If you need interpolation use gl.LINEAR

`9728` | `9729`

#### Returns

`WebGLTexture`

***

### createWebGLCanvas()

> **createWebGLCanvas**(`width`, `height`): `void`

Defined in: [src/filters/WebGLFilterBackend.ts:74](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/WebGLFilterBackend.ts#L74)

Create a canvas element and associated WebGL context and attaches them as
class properties to the GLFilterBackend class.

#### Parameters

##### width

`number`

##### height

`number`

#### Returns

`void`

***

### dispose()

> **dispose**(): `void`

Defined in: [src/filters/WebGLFilterBackend.ts:178](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/WebGLFilterBackend.ts#L178)

Detach event listeners, remove references, and clean up caches.

#### Returns

`void`

***

### evictCachesForKey()

> **evictCachesForKey**(`cacheKey`): `void`

Defined in: [src/filters/WebGLFilterBackend.ts:304](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/WebGLFilterBackend.ts#L304)

Clear out cached resources related to a source image that has been
filtered previously.

#### Parameters

##### cacheKey

`string`

The cache key provided when the source image was filtered.

#### Returns

`void`

***

### getCachedTexture()

> **getCachedTexture**(`uniqueId`, `textureImageSource`, `filter?`): `null` \| `WebGLTexture`

Defined in: [src/filters/WebGLFilterBackend.ts:273](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/WebGLFilterBackend.ts#L273)

Can be optionally used to get a texture from the cache array

If an existing texture is not found, a new texture is created and cached.

#### Parameters

##### uniqueId

`string`

A cache key to use to find an existing texture.

##### textureImageSource

`TexImageSource`

A source to use to create the
texture cache entry if one does not already exist.

##### filter?

`9728` | `9729`

#### Returns

`null` \| `WebGLTexture`

***

### setupGLContext()

> **setupGLContext**(`width`, `height`): `void`

Defined in: [src/filters/WebGLFilterBackend.ts:65](https://github.com/fabricjs/fabric.js/blob/ce64f450bad811750cb5a75aa749fc1502c644be/src/filters/WebGLFilterBackend.ts#L65)

Setup a WebGL context suitable for filtering, and bind any needed event handlers.

#### Parameters

##### width

`number`

##### height

`number`

#### Returns

`void`
