# Fabric.js

<a href="http://fabricjs.com/kitchensink" target="_blank"><img align="right" src="/lib/screenshot.png" style="width:400px"></a>



A **simple and powerful Javascript HTML5 canvas library**.

---

<!-- build/coverage status, climate -->
[![Build Status](https://secure.travis-ci.org/fabricjs/fabric.js.svg?branch=master)](http://travis-ci.org/#!/fabricjs/fabric.js)
[![Code Climate](https://d3s6mut3hikguw.cloudfront.net/github/kangax/fabric.js/badges/gpa.svg)](https://codeclimate.com/github/kangax/fabric.js)
[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/fabricjs/fabric.js)


<!-- npm, bower, CDNJS versions, downloads -->
[![CDNJS version](https://img.shields.io/cdnjs/v/fabric.js.svg)](https://cdnjs.com/libraries/fabric.js)
[![CDNJS](https://data.jsdelivr.com/v1/package/npm/fabric/badge)](https://www.jsdelivr.com/package/npm/fabric)

[![NPM version](https://badge.fury.io/js/fabric.svg)](http://badge.fury.io/js/fabric)
[![Downloads per month](https://img.shields.io/npm/dm/fabric.svg)](https://www.npmjs.org/package/fabric)
[![Bower version](https://badge.fury.io/bo/fabric.svg)](http://badge.fury.io/bo/fabric)

---

[![](https://img.shields.io/static/v1?label=Sponsor%20asturur&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/asturur)
[![](https://img.shields.io/static/v1?label=Sponsor%20melchiar&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/melchiar)
[![](https://img.shields.io/static/v1?label=Sponsor%20ShaMan123&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/ShaMan123)
[![](https://img.shields.io/static/v1?label=Patreon&message=%F0%9F%91%8D&logo=Patreon&color=blueviolet)](https://www.patreon.com/fabricJS)

-----

## Features 
- Out of the box interactions - scale, move, rotate, skew, group and more
- Built in shapes, controls, animations, image filters, gradients, patterns, brushes...
- `JPG`, `PNG`, `JSON` and `SVG` i/o
- [Fast](https://github.com/fabricjs/fabric.js/wiki/Focus-on-speed)
- Typed and modular
- Cross-browser, see [supported browsers](#supported-browsers)
- Runs on [Node.js](http://nodejs.org/), see [Node.js installation](#nodejs) and [limitations](https://github.com/fabricjs/fabric.js/wiki/Fabric-limitations-in-node.js)
- [Unit tested](/CONTRIBUTING.md#-testing)


## Installation

```bash
$ npm install fabric --save
// or
$ yarn add fabric
```

```js

// es6 imports
import { fabric } from "fabric";

//  cjs
const fabric = require("fabric").fabric;

```

#### Node.js
If you are using Fabric.js in a Node.js script, you will depend on [node-canvas](https://github.com/Automattic/node-canvas) for a canvas implementation (`HTMLCanvasElement` replacement) and [jsdom](https://github.com/jsdom/jsdom) for a `window` implementation.

Follow these [instructions](https://github.com/Automattic/node-canvas#compiling) to get `node-canvas` up and running.

See [Node.js limitations](https://github.com/fabricjs/fabric.js/wiki/Fabric-limitations-in-node.js).

#### Browser es6

See [browser modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) for using es6 imports in the browser or use a dedicated bundler.

#### CDN

[cdnjs](https://cdnjs.com/libraries/fabric.js), [jsdelivr](https://www.jsdelivr.com/package/npm/fabric)

## Quick Start

#### Plain HTML

```html
<canvas id="canvas" width="300" height="300"></canvas>

<script src="https://cdn.jsdelivr.net/npm/fabric/dist/fabric.min.js"></script>
<script>
    const canvas = new fabric.Canvas('canvas');
    const rect = new fabric.Rect({
        top : 100,
        left : 100,
        width : 60,
        height : 70,
        fill : 'red'
    });
    canvas.add(rect);
</script>
```

#### ReactJS

```tsx
import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

export const FabricJSCanvas = () => {
  const canvasEl = useRef(null);
  useEffect(() => {
    const options = { ... };
    const canvas = new fabric.Canvas(canvasEl.current, options);
    // make the fabric.Canvas instance available to your app
    updateCanvasContext(canvas);
    return () => {
      updateCanvasContext(null);
      canvas.dispose();
    }
  }, []);
  
  return (<canvas width="300" height="300" ref={canvasEl}/>)
});

```

#### Node.js

```js
const http = require('http');
const { fabric } = require('fabric');

const port = 8080;

http
  .createServer((req, res) => {
    const canvas = new fabric.Canvas(null, { width: 100, height: 100 });
    const rect = new fabric.Rect({ width: 20, height: 50, fill: '#ff0000' });
    const text = new fabric.Text('fabric.js', { fill: 'blue', fontSize: 24 });
    canvas.add(rect, text);
    canvas.renderAll();
    if (req.url === '/download') {
      canvas.createPNGStream().pipe(res);
    }
    else {
      const imageData = canvas.toDataURL();
      res.writeHead(200, '', { 'Content-Type': 'text/html' });
      res.write(`<img src="${imageData}" />`);
      res.end();
    }
  })
  .listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
```

## Supported Browsers

- Firefox 4+
- Safari 5+
- Opera 9.64+
- Chrome (all versions)
- Edge (chromium based, all versions)

IE11 and Edge legacy are **not** supported


## Contributing, Developing and More

Follow the [Contribution Guide](/CONTRIBUTING.md)


## More Resources

- [Fabric.js on Twitter](https://twitter.com/fabricjs)
- [Fabric.js on CodeTriage](https://www.codetriage.com/kangax/fabric.js)
- [Fabric.js on Stackoverflow](https://stackoverflow.com/questions/tagged/fabricjs)
- [Fabric.js on jsfiddle](https://jsfiddle.net/user/fabricjs/fiddles/)
- [Fabric.js on Codepen.io](https://codepen.io/tag/fabricjs)


## Credits

- [@kangax](https://twitter.com/kangax)
- [asturur](https://github.com/asturur), [Andrea Bogazzi](https://twitter.com/AndreaBogazzi)
- [melchiar](https://github.com/melchiar)
- [ShaMan123](https://github.com/ShaMan123)
- Ernest Delgado for the original idea of [manipulating images on canvas](http://www.ernestdelgado.com/archive/canvas/)
- [Maxim "hakunin" Chernyak](http://twitter.com/hakunin) for ideas, and help with various parts of the library throughout its life
- [Sergey Nisnevich](http://nisnya.com) for help with geometry logic
- [Stefan Kienzle](https://twitter.com/kienzle_s) for help with bugs, features, documentation, GitHub issues
- [Shutterstock](http://www.shutterstock.com/jobs) for the time and resources invested in using and improving Fabric.js
- [and all the other contributors](https://github.com/fabricjs/fabric.js/graphs/contributors)

