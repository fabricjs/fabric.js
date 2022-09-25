# Fabric.js

<a href="http://fabricjs.com/kitchensink" target="_blank"><img align="right" src="/lib/screenshot.png" style="width:400px"></a>



A **simple and powerful Javascript HTML5 canvas library**.

- [**Website**](http://fabricjs.com/) 
- [**GOTCHAS**](./GOTCHAS.md)
- [**Contributing, Developing and More**](/CONTRIBUTING.md)
---

<!-- build/coverage status, climate -->
[![🩺](../../actions/workflows/build.yml/badge.svg)](../../actions/workflows/build.yml)
[![🧪](../../actions/workflows/tests.yml/badge.svg)](../../actions/workflows/tests.yml)
[![CodeQL](../../actions/workflows/codeql-analysis.yml/badge.svg)](../../actions/workflows/codeql-analysis.yml)

---

<!-- npm, bower, CDNJS versions, downloads -->
[![CDNJS version](https://img.shields.io/cdnjs/v/fabric.js.svg)](https://cdnjs.com/libraries/fabric.js)
[![CDNJS](https://data.jsdelivr.com/v1/package/npm/fabric/badge)](https://www.jsdelivr.com/package/npm/fabric)
[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/fabricjs/fabric.js)

[![NPM version](https://badge.fury.io/js/fabric.svg)](http://badge.fury.io/js/fabric)
[![Downloads per month](https://img.shields.io/npm/dm/fabric.svg)](https://www.npmjs.org/package/fabric)
[![Bower version](https://badge.fury.io/bo/fabric.svg)](http://badge.fury.io/bo/fabric)

---

[![Sponsor asturur](https://img.shields.io/static/v1?label=Sponsor%20asturur&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/asturur)
[![Sponsor melchiar](https://img.shields.io/static/v1?label=Sponsor%20melchiar&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/melchiar)
[![Sponsor ShaMan123](https://img.shields.io/static/v1?label=Sponsor%20ShaMan123&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/ShaMan123)
[![Patreon](https://img.shields.io/static/v1?label=Patreon&message=%F0%9F%91%8D&logo=Patreon&color=blueviolet)](https://www.patreon.com/fabricJS)

-----

## Features 
- Out of the box interactions such as scale, move, rotate, skew, group...
- Built in shapes, controls, animations, image filters, gradients, patterns, brushes...
- `JPG`, `PNG`, `JSON` and `SVG` i/o
- Typed and modular
- [Unit tested](/CONTRIBUTING.md#-testing)

#### Supported Browsers/Environments
| Context  | Supported Version | Notes |
| :-------------: | :-------------: | ------------- |
| Firefox | ✔️ | version >= 4 |  
| Safari | ✔️ | version >= 5 |  
| Opera | ✔️ | version >= 9.64 |  
| Chrome | ✔️ |  
| Edge | ✔️ | chromium based |
| Edge Legacy | ❌ | 
| IE11 | ❌ |  
| Node.js | ✔️ |  [Node.js installation](#nodejs)


## Installation

```bash
$ npm install fabric --save
// or
$ yarn add fabric
```

```js

// es6 imports
import { fabric } from "fabric";

//  or cjs
const fabric = require("fabric").fabric;

```

#### Node.js

Fabric.js depends on [node-canvas](https://github.com/Automattic/node-canvas) for a canvas implementation (`HTMLCanvasElement` replacement) and [jsdom](https://github.com/jsdom/jsdom) for a `window` implementation on node.
This means that you may encounter `node-canvas` limitations and [bugs](https://github.com/Automattic/node-canvas/issues).

Follow these [instructions](https://github.com/Automattic/node-canvas#compiling) to get `node-canvas` up and running.


#### Browser es6

See [browser modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) for using es6 imports in the browser or use a dedicated bundler.

#### CDN

- [fabric on cdnjs](https://cdnjs.com/libraries/fabric.js)
- [fabric on jsdelivr](https://www.jsdelivr.com/package/npm/fabric)

## Quick Start

#### Plain HTML

```html
<canvas id="canvas" width="300" height="300"></canvas>

<script src="https://cdn.jsdelivr.net/npm/fabric"></script>
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
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', 'attachment; filename="fabric.png"');
      canvas.createPNGStream().pipe(res);
    }
    else if (req.url === '/view') {
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
    console.log(`> Ready on http://localhost:${port}, http://localhost:${port}/view, http://localhost:${port}/download`);
  });
```

---

## Other Solutions

| Project  | Description | Demo |
| ------------- | ------------- | :-------------: |
| [Three.js](https://github.com/mrdoob/three.js/)  | 3D graphics |  
| [PixiJS](https://github.com/pixijs/pixijs)  | WebGL renderer |  
| [Konva](https://github.com/konvajs/konva)  | *Competition* | ❌ |
| [Canvas2PDF](https://github.com/joshua-gould/canvas2pdf)  | PDF renderer |  
| [html-to-image](https://github.com/bubkoo/html-to-image)  | HTML to image/canvas |


## More Resources

- [Fabric.js on Twitter](https://twitter.com/fabricjs)
- [Fabric.js on CodeTriage](https://www.codetriage.com/kangax/fabric.js)
- [Fabric.js on Stackoverflow](https://stackoverflow.com/questions/tagged/fabricjs)
- [Fabric.js on jsfiddle](https://jsfiddle.net/user/fabricjs/fiddles/)
- [Fabric.js on Codepen.io](https://codepen.io/tag/fabricjs)


## Credits [![Patreon](https://img.shields.io/static/v1?label=Patreon&message=%F0%9F%91%8D&logo=Patreon&color=blueviolet)](https://www.patreon.com/fabricJS)

- [@kangax](https://twitter.com/kangax)
- [asturur](https://github.com/asturur), [Andrea Bogazzi](https://twitter.com/AndreaBogazzi) 
[![Sponsor asturur](https://img.shields.io/static/v1?label=Sponsor%20asturur&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/asturur)
- [melchiar](https://github.com/melchiar) [![Sponsor melchiar](https://img.shields.io/static/v1?label=Sponsor%20melchiar&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/melchiar)
- [ShaMan123](https://github.com/ShaMan123) [![Sponsor ShaMan123](https://img.shields.io/static/v1?label=Sponsor%20ShaMan123&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/ShaMan123)
- Ernest Delgado for the original idea of [manipulating images on canvas](http://www.ernestdelgado.com/archive/canvas/)
- [Maxim "hakunin" Chernyak](http://twitter.com/hakunin) for ideas, and help with various parts of the library throughout its life
- [Sergey Nisnevich](http://nisnya.com) for help with geometry logic
- [Stefan Kienzle](https://twitter.com/kienzle_s) for help with bugs, features, documentation, GitHub issues
- [Shutterstock](http://www.shutterstock.com/jobs) for the time and resources invested in using and improving Fabric.js
- [and all the other contributors](https://github.com/fabricjs/fabric.js/graphs/contributors)

