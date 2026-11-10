# @fabricjs/skia

An optional Node.js backend for Fabric, using jsdom 31 and
[@napi-rs/canvas](https://github.com/Brooooooklyn/canvas). It does not load
node-canvas or require Cairo/Pango. The existing `@fabricjs/node` and
`fabric/node` entrypoints continue to use node-canvas and jsdom 26.

## Install and use

Requires Node **22.22.2+, 24.15.0+, or 26+**, following jsdom 31's supported
release lines. This requirement applies to the Skia backend only.

```sh
npm install @fabricjs/skia
```

```js
import { StaticCanvas, Rect } from '@fabricjs/skia';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

const canvas = new StaticCanvas(undefined, { width: 200, height: 100 });
canvas.add(new Rect({ width: 100, height: 50, fill: 'red' }));
canvas.renderAll();
await pipeline(canvas.createPNGStream(), createWriteStream('output.png'));
await canvas.dispose();
```

`fabric/skia` is the equivalent compatibility entrypoint in the `fabric`
package. Install its optional peer explicitly with `npm install fabric @fabricjs/skia`.
Installing `fabric` alone does not install Skia or raise its Node.js requirement.
Both ESM `import` and CommonJS `require` are supported. Browser and core
packages do not depend on this backend.

## Backend selection and compatibility

Choose **one Fabric backend per process or worker**, and use that entrypoint
consistently. Do not mix `fabric/node`, `fabric/skia`, or the browser entrypoint
in one realm: Fabric's environment, text caches, class registry and defaults
are shared. Use separate workers to compare backends. This package does not
patch jsdom's module cache, replace `canvas`, or modify native prototypes.

- The public `Canvas`/`StaticCanvas` classes include `getNodeCanvas()`,
  `createPNGStream()` and `createJPEGStream()` like the Node entrypoint.
- `getNodeCanvas()` returns a **native napi canvas**, with APIs such as
  `toBuffer('image/png')` and `encode('png')`. It is not node-canvas, and does
  not itself have `createPNGStream()` or `createJPEGStream()` methods.
- Fabric's stream methods return **Node.js Readable streams**, supporting
  `.pipe()`, `pipeline()` and async iteration. Encoding failures are stream
  errors. Consume the stream before disposing its canvas.
- JPEG quality uses **0–1**, defaults to **0.75**, and is converted internally
  to Skia's 0–100 scale. Non-finite or out-of-range values throw `RangeError`.
- PNG compression/filter/palette options and JPEG progressive/chroma-subsampling
  options are accepted by the compatibility types but are not implemented by
  Skia. PNG resolution is supported. Do not rely on ignored options.
- Image pixels, text measurements and encoded bytes differ from node-canvas.
  Keep backend-specific visual baselines. Image loading is asynchronous;
  await `util.loadImage()`, `FabricImage.fromURL()` or other loading promises.
- Filtering uses Fabric's Canvas2D backend, not WebGL.

The initial backend pins napi 1.1.0 and jsdom 31.0.0 so changes in native
rendering or private jsdom integration are reviewed explicitly.

## Fonts

Register fonts before creating or measuring Fabric text:

```js
import { GlobalFonts, FabricText, cache } from '@fabricjs/skia';

for (const face of ['Regular', 'Bold']) {
  if (!GlobalFonts.registerFromPath(`/fonts/Ubuntu-${face}.ttf`, 'MyUbuntu')) {
    throw new Error(`Could not register Ubuntu-${face}`);
  }
}
cache.clearFontCache('MyUbuntu');
const text = new FabricText('Hello', {
  fontFamily: 'MyUbuntu',
  fontWeight: 700,
});
```

`GlobalFonts` and `setTextRenderer` are direct re-exports of the backend's
matching napi instance. Font registration does not automatically clear Fabric's
text caches.

Weight and style come from the font file's metadata. Register each needed
face; naming a bold file as a family does not make it a regular face. If only
a bold face is available, normal-weight requests can select that face: the
Ubuntu-Bold-only test verifies identical normal/bold pixels and metrics. The
`registerFont()` helper in `@napi-rs/canvas/node-canvas.js` accepts node-canvas's
options, but likewise derives weight/style from the file. If fonts change
after text has been measured, clear Fabric's font cache and remeasure existing
text. Variable-font support depends on napi/Skia and the font; verify the axes
and requested weights used by your application. The adapter tests cover the
Roboto Mono variable weight axis at 100, 400 and 900, not every font or axis.

napi 1.1.0 defaults to portable FreeType text rendering. To opt into its
platform-specific renderer, call `setTextRenderer('system')` from
`@fabricjs/skia` before creating canvases or measuring text. That setting affects
the whole process, including worker threads. Use separate processes, not workers,
to compare portable and system text rendering. Register deterministic font files
when comparing output across machines; system fonts and fallback can differ.

## Development

From the repository root, `pnpm run test:vitest:skia` runs the independent
Skia unit project. Existing Node/browser projects remain separate. Use
`pnpm run build` and `pnpm run smoke:packages` to validate published artifacts,
including a clean Skia-only installation without node-canvas.

`pnpm run test:e2e:skia` runs the shared rendering cases with Skia; the existing
`pnpm run test:e2e` keeps the browser and node-canvas coverage. CI runs both
commands in separate jobs. Browser-only cases are skipped in the Skia job, and
this mode never creates or updates snapshots.

Most cases compare against the existing browser goldens. The decorated-text
shadow regression instead compares cached/uncached RGBA within each renderer,
checks that foreground and shadow pixels exist, and attaches the rendered PNG.
This tests the caching invariant without depending on system-font metrics across
renderers. It does not assert a particular font outline. Other golden comparisons
and tolerances are unchanged.
