# @fabricjs/node

Preferred Node.js entrypoint for Fabric.js.

```js
import { StaticCanvas } from '@fabricjs/node';
```

This package depends on `@fabricjs/core` and owns Node-specific environment
setup, including `canvas`, `jsdom`, and Node canvas stream helpers.

Existing applications can continue to use `import { StaticCanvas } from 'fabric/node'`.
The legacy entrypoint is a compatibility facade over this package, so the two
imports share class identities when their versions match.
