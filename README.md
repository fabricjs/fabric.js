# Fabric.js

<a href="http://fabricjs.com/kitchensink" target="_blank"><img align="right" src="https://github.com/kangax/fabric.js/raw/master/lib/screenshot.png" style="width:400px"></a>

<a href="http://fabricjs.com">FabricJS.com</a> is a **simple and powerful Javascript HTML5 canvas library**. It is also an **SVG-to-canvas parser**.

<!-- build/coverage status, climate -->

[![Build Status](https://secure.travis-ci.org/fabricjs/fabric.js.svg?branch=master)](http://travis-ci.org/#!/kangax/fabric.js)
[![Code Climate](https://d3s6mut3hikguw.cloudfront.net/github/kangax/fabric.js/badges/gpa.svg)](https://codeclimate.com/github/kangax/fabric.js)
[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/fabricjs/fabric.js)

<!-- npm, bower, CDNJS versions, downloads -->

[![CDNJS version](https://img.shields.io/cdnjs/v/fabric.js.svg)](https://cdnjs.com/libraries/fabric.js)
[![NPM version](https://badge.fury.io/js/fabric.svg)](http://badge.fury.io/js/fabric)
[![Downloads per month](https://img.shields.io/npm/dm/fabric.svg)](https://www.npmjs.org/package/fabric)
[![Bower version](https://badge.fury.io/bo/fabric.svg)](http://badge.fury.io/bo/fabric)

## Features

- drag-n-drop objects on canvas,
- scale, move, rotate and group objects with mouse,
- use predefined shapes or create custom objects,
- works super-fast with many objects,
- supports JPG, PNG, JSON and SVG formats,
- ready-to-use image filters,
- create animations,
- and much more!

<br />

<a href="http://fabricjs.com/fabric-intro-part-1">Introduction</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="http://fabricjs.com/docs/">Docs</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="http://fabricjs.com/demos/">Demos</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="http://fabricjs.com/kitchensink/">Kitchensink</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="http://fabricjs.com/benchmarks/">Benchmarks</a>
<span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
<a href="https://github.com/fabricjs/fabric.js/wiki">Contribution</a>
<br />

<hr />

## Quick Start

```
$ npm install fabric --save
```

After this, you can import fabric like so:

```
const fabric = require("fabric").fabric;
```

Or you can use this instead if your build pipeline supports ES6 imports:

```
import { fabric } from "fabric";
```

NOTE: If you are using Fabric.js in a Node.js script, you will depend on [node-canvas](https://github.com/Automattic/node-canvas). `node-canvas` is an HTML canvas replacement that works on top of native libraries. Please [follow the instructions](https://github.com/Automattic/node-canvas#compiling) to get it up and running.

NOTE: es6 imports won't work in browser or with bundlers which expect es6 module like vite. Use commonjs syntax instead.

## Usage

### Plain HTML

```html
<canvas id="canvas" width="300" height="300"></canvas>

<!-- Get latest version: https://cdnjs.com/libraries/fabric.js -->
<script src="lib/fabric.js"></script>
<script>
  var canvas = new fabric.Canvas('canvas');

  var rect = new fabric.Rect({
    top: 100,
    left: 100,
    width: 60,
    height: 70,
    fill: 'red',
  });
  canvas.add(rect);
</script>
```

### ReactJS

```tsx
import React, {useEffect, useRef} from 'react'
import {fabric} from 'fabric'

const FabricJSCanvas = () => {
  const canvasEl = useRef(null)
  useEffect(() => {
    const options = { ... };
    const canvas = new fabric.Canvas(canvasEl.current, options);
    // make the fabric.Canvas instance available to your app
    updateCanvasContext(canvas);
    return () => {
      updateCanvasContext(null);
      canvas.dispose()
    }
  }, []);

  return (<canvas width="300" height="300" ref={canvasEl}/>)
});
export default FabricJSCanvas;
```

NOTE: Fabric.js requires a `window` object.

## Building

1.  Build distribution file **[~77K minified, ~20K gzipped]**

         $ node build.js

    1.1 Or build a custom distribution file, by passing (comma separated) module names to be included.

          $ node build.js modules=text,serialization,parser
          // or
          $ node build.js modules=text
          // or
          $ node build.js modules=parser,text
          // etc.

    By default (when none of the modules are specified) only basic functionality is included.
    See the list of modules below for more information on each one of them.
    Note that default distribution has support for **static canvases** only.

    To get minimal distribution with interactivity, make sure to include corresponding module:

          $ node build.js modules=interaction

    1.2 You can also include all modules like so:

          $ node build.js modules=ALL

    1.3 You can exclude a few modules like so:

          $ node build.js modules=ALL exclude=gestures,image_filters

2.  Create a minified distribution file

        # Using YUICompressor (default option)
        $ node build.js modules=... minifier=yui

        # or Google Closure Compiler
        $ node build.js modules=... minifier=closure

3.  Enable AMD support via require.js (requires uglify)

        $ node build.js requirejs modules=...

4.  Create source map file for better productive debugging (requires uglify or google closure compiler).<br>More information about [source maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/).

        $ node build.js sourcemap modules=...

    If you use google closure compiler you have to add `sourceMappingURL` manually at the end of the minified file all.min.js (see issue https://code.google.com/p/closure-compiler/issues/detail?id=941).

        //# sourceMappingURL=fabric.min.js.map

5.  Ensure code guidelines are met (prerequisite: `npm -g install eslint`)

        $ npm run lint && npm run lint_tests

## Testing

### 1. Install NPM packages

```
$ npm install
```

### 2. Run tests Chrome and Node (by default):

```
$ testem
```

See testem docs for more info: https://github.com/testem/testem

## Optional modules

These are the optional modules that could be specified for inclusion, when building custom version of fabric:

- **text** — Adds support for static text (`fabric.Text`)
- **itext** — Adds support for interactive text (`fabric.IText`, `fabric.Textbox`)
- **serialization** — Adds support for `loadFromJSON`, `loadFromDatalessJSON`, and `clone` methods on `fabric.Canvas`
- **interaction** — Adds support for interactive features of fabric — selecting/transforming objects/groups via mouse/touch devices.
- **parser** — Adds support for `fabric.parseSVGDocument`, `fabric.loadSVGFromURL`, and `fabric.loadSVGFromString`
- **image_filters** — Adds support for image filters, such as grayscale of white removal.
- **easing** — Adds support for animation easing functions
- **node** — Adds support for running fabric under node.js, with help of [jsdom](https://github.com/tmpvar/jsdom) and [node-canvas](https://github.com/learnboost/node-canvas) libraries.
- **freedrawing** — Adds support for free drawing
- **erasing** — Adds support for object erasing using an eraser brush
- **gestures** — Adds support for multitouch gestures with help of [Event.js](https://github.com/mudcube/Event.js)
- **object_straightening** — Adds support for rotating an object to one of 0, 90, 180, 270, etc. depending on which is angle is closer.
- **animation** — Adds support for animation (`fabric.util.animate`, `fabric.util.requestAnimFrame`, `fabric.Object#animate`, `fabric.Canvas#fxCenterObjectH/#fxCenterObjectV/#fxRemove`)

Additional flags for build script are:

- **requirejs** — Makes fabric requirejs AMD-compatible in `dist/fabric.js`. _Note:_ an unminified, requirejs-compatible version is always created in `dist/fabric.require.js`
- **no-strict** — Strips "use strict" directives from source
- **no-svg-export** — Removes svg exporting functionality
- **sourcemap** - Generates a sourceMap file and adds the `sourceMappingURL` (only if uglifyjs is used) to `dist/fabric.min.js`

For example:

    node build.js modules=ALL exclude=json no-strict no-svg-export

## Goals

- Unit tested (1150+ tests at the moment, 79%+ coverage)
- Modular (~60 small ["classes", modules, mixins](http://fabricjs.com/docs/))
- Cross-browser
- [Fast](https://github.com/kangax/fabric.js/wiki/Focus-on-speed)
- Encapsulated in one object
- No browser sniffing for critical functionality
- Runs under ES5 strict mode
- Runs on a server under [Node.js](http://nodejs.org/) (active stable releases and latest of current) (see [Node.js limitations](https://github.com/kangax/fabric.js/wiki/Fabric-limitations-in-node.js))
- Follows [Semantic Versioning](http://semver.org/)

## Supported browsers

- Firefox 4+
- Safari 5+
- Opera 9.64+
- Chrome (all versions)
- Edge (chromium based, all versions)
- IE11 and Edge legacy, not supported. Fabric up to 5.0 is written with ES5 in mind, but no specific tests are run for those browsers.

You can [run automated unit tests](http://fabricjs.com/test/unit/) right in the browser.

## More resources

- [Fabric.js on Twitter](https://twitter.com/fabricjs)
- [Fabric.js on CodeTriage](https://www.codetriage.com/kangax/fabric.js)
- [Fabric.js on Stackoverflow](https://stackoverflow.com/questions/tagged/fabricjs)
- [Fabric.js on jsfiddle](https://jsfiddle.net/user/fabricjs/fiddles/)
- [Fabric.js on Codepen.io](https://codepen.io/tag/fabricjs)
- [Presentation from BK.js](http://www.slideshare.net/kangax/fabricjs-building-acanvaslibrarybk)
- [Presentation from Falsy Values](http://www.slideshare.net/kangax/fabric-falsy-values-8067834)

## Credits

- [@kangax](https://twitter.com/kangax)
- [Andrea Bogazzi](https://twitter.com/AndreaBogazzi) for help with bugs, new features, documentation, GitHub issues
- [melchiar](https://github.com/melchiar)
- [ShaMan123](https://github.com/ShaMan123)
- Ernest Delgado for the original idea of [manipulating images on canvas](http://www.ernestdelgado.com/archive/canvas/)
- [Maxim "hakunin" Chernyak](http://twitter.com/hakunin) for ideas, and help with various parts of the library throughout its life
- [Sergey Nisnevich](http://nisnya.com) for help with geometry logic
- [Stefan Kienzle](https://twitter.com/kienzle_s) for help with bugs, features, documentation, GitHub issues
- [Shutterstock](http://www.shutterstock.com/jobs) for the time and resources invested in using and improving Fabric.js
- [and all the other GitHub contributors](https://github.com/kangax/fabric.js/graphs/contributors)

## Sponsor authors

- https://flattr.com/@kangax
- https://github.com/sponsors/asturur
- https://www.patreon.com/fabricJS

## MIT License

Copyright (c) 2008-2015 Printio (Juriy Zaytsev, Maxim Chernyak)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
