---
date: '2017-07-29'
description: 'Changelog for version 1 of Fabric.JS'
title: 'Fabric filters'
---
### Introduction

Fabric has a filtering engine that can work on both WEBGL or plain CPU javascript.  
Fabric has 2 classes to handle filtering, one is called `WebglFilterBackend` another is `Canvas2dFilterBackend`.  
The first time you get to filter an image, this code is run:
```js
    fabric.initFilterBackend = function() {
      if (fabric.enableGLFiltering &&  fabric.isWebglSupported && fabric.isWebglSupported(fabric.textureSize)) {
        console.log('max texture size: ' + fabric.maxTextureSize);
        return (new fabric.WebglFilterBackend({ tileSize: fabric.textureSize }));
      }
      else if (fabric.Canvas2dFilterBackend) {
        return (new fabric.Canvas2dFilterBackend());
      }
    };
 ``` 

This code will identify if the WEBGL is enabled and supported and set in fabric the backend to use.  

### Canvas2d backend

The canvas backend is very simple. It creates an object containing some basic properties:
```js

    var pipelineState = {
      sourceWidth: sourceWidth,  // starting widht of the image to be filtered
      sourceHeight: sourceHeight, // starting height of the image to be filtered
      imageData: imageData, // imageData of the image to be filtered
      originalEl: sourceElement, // original picture element (image or canvas) of the image to be filtered
      originalImageData: originalImageData, // original picture element (image or canvas) of the image to be filtered
      canvasEl: targetCanvas, // canvas element that is the destination of filtering
      ctx: ctx, // context of canvasEl
      filterBackend: this,  // reference to filterBackend.
    };
```  

Then this object is sent to every `applyTo` function of each filter in the chain. The apply2d function is triggered. This function is problably ( but is not necessary ) going to modify imageData. At the end of the filter chain this imageData is applied to the canvasEl that then will be referenced as the `fabric.Image` instance `.element` property, that is the one that gets displayed on the `fabric.Canvas`.  
The applyTo filter can do different things from manipulating the pixel values as long as it mutates the imageData. Writing a filter that apply a mask using `globalCompositeOperation` and another image via `context.drawImage` is another way to filter the image.

### WEBGL backend

Webgl context is more complicated to handle than canvas2d context.  
To be filtered images needs to be put in a texture. Texture size limit varies with hardware and drivers.  
Number of active contexts is limited on the browsers, so filtering many images one after the other often crash the browser.  
So to achieve something that is stable and usable fabricjs needs to make compromises. A canvas get initialized at 2048x2048 that looks like a safe limit for old hardware. This limit the max image size that can be filtered with fabricjs at that size unless the dev decide to set it higher setting the parameter `fabric.textureSize`.  
You are still limited from the maximum canvas size in a browser. So the minimum between canvas size and maxTextureSize is your size cap for image filterin in webgl. This initialized canvas gets referenced in the filter backend and will be used as final step to draw the result of the WEBGL operations in the filter chain.  
Every image gets assigned a textured id in the constructor, the first time the image gets filtered, the image gets loaded as texture once then the same texture gets reused next time for faster filtering.  
Bringing the result of the webgl filter chain down to the main fabric.Canvas is a costly operation that gets executed either with a getImageData or with drawimage, depending what is the fastest result from a syntetic benchmark executed when the WEBGL backend gets initialized.
```js
    var pipelineState = {
      originalWidth: source.width || source.originalWidth,
      originalHeight: source.height || source.originalHeight,
      sourceWidth: width,
      sourceHeight: height,
      context: gl, // context of the webgl canvas
      sourceTexture: this.createTexture(gl, width, height, !cachedTexture && source), // image texture A
      targetTexture: this.createTexture(gl, width, height), // another texture with same dimensions texture B
      originalTexture: cachedTexture ||
        this.createTexture(gl, width, height, !cachedTexture && source),  // the cached texture that is read only for us
      passes: filters.length,
      webgl: true, // just a flag that inform the filters that we are in the webgl domain
      squareVertices: this.squareVertices,
      programCache: this.programCache, // cache of the compiled shaders
      pass: 0, // passes needed to complete the filtering, needed to understand when we are at -1 from end
      filterBackend: this  // reference to filterBackend.
    };
```  

Then this object is sent to every `applyTo` function of each filter in the chain. The applyToWebgl function is triggered. Each applyToWebgl iteration read from a texture and write to the other in the couple A - B.  
The first filter reads from originalTexture and write to A, then we swap between A and B, till the last filter that instead of writing the data to another texture, paints it on the canvas element that we are using in glmode.  
From this canvas then we make a copy to the final canvas element that will be referenced in the `fabric.Image` as the `.element` property that represent the final filtered image.  
Other than collecting the data and creating the pipelineState object, the webgl backend creates and keep a reference of created textures.

### The fabric filter

fabric has a basic non working class, used to keep all the basic filter functionality, from which we extend each filter class.  
Once the filter backend gathered the necessary data for filtering, the `pipelineState`, what it does is:  
```js
    filters.forEach(filter => {
      filter.applyTo(pipelineState)
    });
```

This will make iterate each filter over the data, producing the final result. Each webgl filter needs a series of step before being used, that can be executed once:

    - compiling the vertex shader
    - compiling the fragment shader
    - linking the 2 pieces in a program
    - keep track of the identifiers that represets our filter parameters
  

and some operations that gets exectued each filtering:

    - send data to the program when is filtering time
    - bind additional textures if the filter needs them
  

I'm not going in details over the webgl code for those operations, since there are better tutorial and example online ( where i took most of the inspiration and code ).  
What is important is that fabric exposes a way to provide a fragment shader, a javascript function ( for non webgl filtering ), eventually a vertex shader and the it will handle all the rest to make it happen.

### An example of fabric filter, Brightness

To create a filter you need to know how it operates over the image data. The brightness filter add a or subtract from each channel a value.  
We will need a filter parameter to represent how much we want this value to be and the functions to apply it with plain JS or with WEBGL.

#### The javascript version

For the plain javascript version, we need to add a value to each channel of imageData except the alpha.  
In fabricjs this means we have to populate the apply2d function of the filter with an iterator that add the brightness value to 3 bytes out of 4:
```js
    /**
     * Apply the MyFilter operation to a Uint8ClampedArray representing the pixels of an image.
     *
     * @param {Object} options
     * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
     */
     applyTo2d: function(options) {
       if (this.brightess === 0) {
         // early return if the brightness is 0, since we do not need to change anything
         return;
       }
       var imageData = options.imageData,
           data = imageData.data, i, len = data.length;
       for (i = 0; i < len; i += 4) {
         // we iterate 4 bytes at once to represent a pixel in rgba 8,8,8,8 format.
         data[i] += this.brightess;
         data[i + 1] += this.brightess;
         data[i + 2] += this.brightess;
       }
     },
```

That's it. At this point the image data has been changed, the function does not return anything and the pipelineState gets passed to the next filter.

#### The WEBGL version

The WEBGL version require to write a fragment shader insted of javascript function. Fabric.js provides a standard function that does not change anything to start with. I will not go in detail of what you can do or not do with WEBGL, since i have not the necessary expertise an since there is much material out ther with lot of explanations.  
The basic fragment shader looks like this:
```js
/**
 * Fragment source for the brightness program
 */
    precision highp float;
    uniform sampler2D uTexture;
    varying vec2 vTexCoord;
    void main() {
    vec4 color = texture2D(uTexture, vTexCoord);
    gl_FragColor = color;
}
```
We need to add a parameter to represent the brightness and add this paramter to each pixel of the rgb value of the color.
```js
/**
 * Fragment source for the brightness program
 */
    precision highp float;
    uniform sampler2D uTexture;
    uniform float uBrightness;
    varying vec2 vTexCoord;
    void main() {
    vec4 color = texture2D(uTexture, vTexCoord);
    color.rgb += uBrightness;
    gl_FragColor = color;
}
```

we added a float uniform called uBrightness outside the main loop. The main loop adds this value to the rgb vector for each pixel of the image that we extract from the texture using the vTextCoord.  
To make fabric find and valorize that value in the fragment shader with our brightness level we need to populate 2 methods of the filter class:
```js
/**
* Return WebGL uniform locations for this filter's shader.
*
* @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
* @param {WebGLShaderProgram} program This filter's compiled shader program.
*/
getUniformLocations: function(gl, program) {
    return {
    uBrightness: gl.getUniformLocation(program, 'uBrightness'),
    };
},

/**
* Send data from this filter to its shader program's uniforms.
*
* @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
* @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
*/
sendUniformData: function(gl, uniformLocations) {
    gl.uniform1f(uniformLocations.uBrightness, this.brightness);
},
```

`getUniformLocations` is instructed to find in the program the variable named `uBrightness`. This function is called once per filter initializaion.  
`sendUniformData` is instructed to valorize the location found with the value of the brightness property of the filter. This function is executed each filtering.  
if your filter needs more parameters, you will add them in the exacty same way. You give them a name in the fragmenShader, then you write a `getUniformLocations` and a `sendUniformData` that locate and valorize more parameters:
```js
    getUniformLocations: function(gl, program) {
      return {
        uBrightness: gl.getUniformLocation(program, 'uBrightness'),
        uParam2: gl.getUniformLocation(program, 'uParam2'),
        uParam3: gl.getUniformLocation(program, 'uParam3'),
      };
    },

    sendUniformData: function(gl, uniformLocations) {
      gl.uniform1f(uniformLocations.uBrightness, this.brightness);
      gl.uniform1f(uniformLocations.uParam2, this.uParam2);
      gl.uniform1f(uniformLocations.uParam3, this.uParam3);
    },
```

After that the filter just works. On the github repository you can find an empty boilerplate class to help you start with your own filter. [empty filter class](https://github.com/kangax/fabric.js/blob/master/src/filters/filter_boilerplate.js)

### Common errors and problems:

#### Picture is cutted

The picture will be painted over a tile of 2048x2048 size, bigger pictures won't fit. `fabric.textureSize` set at 2408 is a safe limit. Most of the hardware will support 4096 and so 4096x4096 is a limit that will probably work and give you less headaches. Take in mind that canvas has a max size too. If you are supporting browsers like IE11 you will have probably problems with canvases bigger than 5000 on a size, whatever your webgl hardware is capable of.

#### Old filter values are incompatible

With this change each filter changed and the default values are between 0 and 1 or -1 and 1.  
Removed filters are: blend_filter splitted in blend_color and blend_image, gradienttransparency is removed, mask_filter is part of blendImage, removewhite is now removecolor, tint filter is now a part of blend color. Here follow a conversion pattern from 1.x filtering:
```js
fabric.Image.filters.BaseFilter.fromObject = function(object, callback) {
  switch (object.type) {
    case 'Brightness':
      object.brightness = object.brightness / 255;
    case 'Contrast':
      object.contrast = object.contrast / 255;
    break;
    case 'Mask':
      object.type = 'BlendImage';
      object.image = object.mask;
    break;
    case 'Blend':
      if (!object.image) {
        object.type = 'BlendColor';
      } else {
        // conversion harder
      }
    break;
    case 'Multiply':
      object.type = 'BlendColor';
      object.mode = 'multiply';
    break;
    // may not give exact same result
    case 'RemoveWhite':
      object.type = 'RemoveColor';
      object.color = '#FFFFFF';
      object.distance = object.distance / 255;
    break;
    case 'Saturate':
      object.saturation = object.saturate / 100;
    break;
    case 'Tint':
      object.type = 'BlendColor';
      object.saturation = object.saturate / 100;
    break;
    // Color matrix in 1.x where made for imageData and the column of the costants
    // was in the -255 to 255 range, now is in the -1 to 1
    case 'ColorMatrix':
      object.matrix[4] = object.matrix[4] / 255;
      object.matrix[9] = object.matrix[9] / 255;
      object.matrix[14] = object.matrix[14] / 255;
      object.matrix[19] = object.matrix[19] / 255;
    break;
  }
  var filter = new fabric.Image.filters[object.type](object);
  callback && callback(filter);
  return filter;
};
```

#### Usage of gpu memory

Each image will create a texture in the gpu memory on first filtering. The texture is identified with an ID and is cached for faster refiltering.  
is dev duty to clean this cache using image.dispose() when he knows he will not use the image anymore. Some image could possibly share the same asset but have 2 copies of the texture in memory, to solve this you can assign to an image the cacheKey property to a fixed value before filtering in order to get the same texture of another existing image. Also canvas.dispose() will call dispose on each image that was on the canvas.

#### Manually initialize the backend

Fabric `fabric.isWebglSupported(fabric.textureSize);` is a fundamental step for webgl to work, is called on first filtering operation from the initBackend procedure. If you plan on using the 2 backends manually, creaing a webgl and a canvas2d to swap on command, you need to run `fabric.isWebglSupported(fabric.textureSize);` once manually. This function will also try to detect your hardware max precision and swap it at runtime since some hardware could not support `highp` by default.