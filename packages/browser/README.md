# @fabricjs/browser

Preferred browser entrypoint for Fabric.js.

```js
import { Canvas } from '@fabricjs/browser';
```

This package depends on and re-exports `@fabricjs/core`, without pulling the
Node-specific `canvas` and `jsdom` dependencies. Use it for new browser
applications.

Existing applications can continue to use `import { Canvas } from 'fabric'`.
The legacy `fabric` package is a compatibility facade over this package, so the
two imports share class identities when their versions match.
