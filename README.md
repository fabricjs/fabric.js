# Fabric.js

<a href="http://fabricjs.com/kitchensink" target="_blank"><img align="right" src="/lib/screenshot.png" style="width:400px"></a>

A **simple and powerful Javascript HTML5 canvas library**.

- [**Website**][website]
- [**GOTCHAS**][gotchas]
- [**Contributing, Developing and More**](CONTRIBUTING.md)

---

<!-- build/coverage status, climate -->

[![🩺](../../actions/workflows/build.yml/badge.svg)](../../actions/workflows/build.yml)
[![🧪](../../actions/workflows/tests.yml/badge.svg)](../../actions/workflows/tests.yml)
[![CodeQL](../../actions/workflows/codeql-analysis.yml/badge.svg)](../../actions/workflows/codeql-analysis.yml)

---

<!-- npm, bower, CDNJS versions, downloads -->

[![cdnjs](https://img.shields.io/cdnjs/v/fabric.js.svg)][cdnjs]
[![jsdelivr](https://data.jsdelivr.com/v1/package/npm/fabric/badge)][jsdelivr]
[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/fabricjs/fabric.js)

[![NPM](https://badge.fury.io/js/fabric.svg)](http://badge.fury.io/js/fabric)
[![Downloads per month](https://img.shields.io/npm/dm/fabric.svg)](https://www.npmjs.org/package/fabric)
[![Bower](https://badge.fury.io/bo/fabric.svg)](http://badge.fury.io/bo/fabric)

---

[![Sponsor asturur](https://img.shields.io/static/v1?label=Sponsor%20asturur&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/asturur)
[![Sponsor melchiar](https://img.shields.io/static/v1?label=Sponsor%20melchiar&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/melchiar)
[![Sponsor ShaMan123](https://img.shields.io/static/v1?label=Sponsor%20ShaMan123&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/ShaMan123)
[![Patreon](https://img.shields.io/static/v1?label=Patreon&message=%F0%9F%91%8D&logo=Patreon&color=blueviolet)](https://www.patreon.com/fabricJS)

---

## Features

- Out of the box interactions such as scale, move, rotate, skew, group...
- Built in shapes, controls, animations, image filters, gradients, patterns, brushes...
- `JPG`, `PNG`, `JSON` and `SVG` i/o
- Typed and modular
- [Unit tested](CONTRIBUTING.md#%F0%9F%A7%AA%20testing)

#### Supported Browsers/Environments

|   Context   | Supported Version | Notes                           |
| :---------: | :---------------: | ------------------------------- |
|   Firefox   |        ✔️         | modern version (tbd)            |
|   Safari    |        ✔️         | version >= 10.1                 |
|    Opera    |        ✔️         | chromium based                  |
|   Chrome    |        ✔️         | modern version (tbd)            |
|    Edge     |        ✔️         | chromium based                  |
| Edge Legacy |        ❌         |
|    IE11     |        ❌         |
|   Node.js   |        ✔️         | [Node.js installation](#nodejs) |

Fabric.js Does not use transpilation by default, the browser version we support is determined by the level of canvas api we want to use and some js syntax. While JS can be easily transpiled, canvas API can't.

## Installation

```bash
$ npm install fabric --save
// or
$ yarn add fabric
```

```js
// es6 imports
import { fabric } from 'fabric';

//  or cjs
const fabric = require('fabric').fabric;
```

#### Browser

[![cdnjs](https://img.shields.io/cdnjs/v/fabric.js.svg)][cdnjs]
[![jsdelivr](https://data.jsdelivr.com/v1/package/npm/fabric/badge)][jsdelivr]

See [browser modules][mdn_es6] for using es6 imports in the browser or use a dedicated bundler.

#### Node.js

Fabric.js depends on [node-canvas][node_canvas] for a canvas implementation (`HTMLCanvasElement` replacement) and [jsdom][jsdom] for a `window` implementation on node.
This means that you may encounter `node-canvas` limitations and [bugs][node_canvas_issues].

Follow these [instructions][node_canvas_install] to get `node-canvas` up and running.

## Quick Start

<details><summary><b>Plain HTML</b></summary>

```html
<canvas id="canvas" width="300" height="300"></canvas>

<script src="https://cdn.jsdelivr.net/npm/fabric"></script>
<script>
  const canvas = new fabric.Canvas('canvas');
  const rect = new fabric.Rect({
    top: 100,
    left: 100,
    width: 60,
    height: 70,
    fill: 'red',
  });
  canvas.add(rect);
</script>
```

</details>

<details><summary><b>ReactJS</b></summary>

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

</details>

<details><summary><b>Node.js</b></summary>

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
    } else if (req.url === '/view') {
      canvas.createPNGStream().pipe(res);
    } else {
      const imageData = canvas.toDataURL();
      res.writeHead(200, '', { 'Content-Type': 'text/html' });
      res.write(`<img src="${imageData}" />`);
      res.end();
    }
  })
  .listen(port, (err) => {
    if (err) throw err;
    console.log(
      `> Ready on http://localhost:${port}, http://localhost:${port}/view, http://localhost:${port}/download`
    );
  });
```

</details>

---

## Other Solutions

| Project                        | Description          | Demo |
| ------------------------------ | -------------------- | :--: |
| [Three.js][three.js]           | 3D graphics          |
| [PixiJS][pixijs]               | WebGL renderer       |
| [Konva][konva]                 | Similar features     |  ❌  |
| [Canvas2PDF][canvas2pdf]       | PDF renderer         |
| [html-to-image][html-to-image] | HTML to image/canvas |

## More Resources

- [Demos on `fabricjs.com`][demos]
- [Fabric.js on `Twitter`][twitter]
- [Fabric.js on `CodeTriage`][code_triage]
- [Fabric.js on `Stack Overflow`][so]
- [Fabric.js on `jsfiddle`][jsfiddles]
- [Fabric.js on `Codepen.io`][codepens]

## Credits [![Patreon](https://img.shields.io/static/v1?label=Patreon&message=%F0%9F%91%8D&logo=Patreon&color=blueviolet)](https://www.patreon.com/fabricJS)

- [kangax][kagnax]
- [asturur][asturur] on [`Twitter`][asturur_twitter]
  [![Sponsor asturur](https://img.shields.io/static/v1?label=Sponsor%20asturur&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/asturur)
- [melchiar][melchiar] [![Sponsor melchiar](https://img.shields.io/static/v1?label=Sponsor%20melchiar&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/melchiar)
- [ShaMan123][shaman123] [![Sponsor ShaMan123](https://img.shields.io/static/v1?label=Sponsor%20ShaMan123&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/ShaMan123)
- Ernest Delgado for the original idea of [manipulating images on canvas](http://www.ernestdelgado.com/archive/canvas/)
- [Maxim "hakunin" Chernyak](http://twitter.com/hakunin) for ideas, and help with various parts of the library throughout its life
- [Sergey Nisnevich](http://nisnya.com) for help with geometry logic
- [Stefan Kienzle](https://twitter.com/kienzle_s) for help with bugs, features, documentation, GitHub issues
- [Shutterstock](http://www.shutterstock.com/jobs) for the time and resources invested in using and improving Fabric.js
- [and all the other contributors][contributors]

[asturur]: https://github.com/asturur
[asturur_twitter]: https://twitter.com/AndreaBogazzi
[canvas2pdf]: https://github.com/joshua-gould/canvas2pdf
[cdnjs]: https://cdnjs.com/libraries/fabric.js
[code_triage]: https://www.codetriage.com/kangax/fabric.js
[codepens]: https://codepen.io/tag/fabricjs
[contributors]: https://github.com/fabricjs/fabric.js/graphs/contributors
[demos]: http://fabricjs.com/demos/
[gotchas]: http://fabricjs.com/fabric-gotchas
[html-to-image]: https://github.com/bubkoo/html-to-image
[jsdelivr]: https://www.jsdelivr.com/package/npm/fabric
[jsdom]: https://github.com/jsdom/jsdom
[jsfiddles]: https://jsfiddle.net/user/fabricjs/fiddles/
[kagnax]: https://twitter.com/kangax
[konva]: https://github.com/konvajs/konva
[mdn_es6]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
[melchiar]: https://github.com/melchiar
[node_canvas]: https://github.com/Automattic/node-canvas
[node_canvas_install]: https://github.com/Automattic/node-canvas#compiling
[node_canvas_issues]: https://github.com/Automattic/node-canvas/issues
[patreon_badge]: https://img.shields.io/static/v1?label=Patreon&message=%F0%9F%91%8D&logo=Patreon&color=blueviolet
[pixijs]: https://github.com/pixijs/pixijs
[shaman123]: https://github.com/ShaMan123
[so]: https://stackoverflow.com/questions/tagged/fabricjs
[three.js]: https://github.com/mrdoob/three.js/
[twitter]: https://twitter.com/fabricjs
[website]: http://fabricjs.com/
