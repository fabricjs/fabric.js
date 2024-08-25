# Origin upater

A wrapper for the fromObject function of fabricJS.
Once wrapped the function will take a serialized object with any value of originX and originY and return a fabric instance with originX and originY set to the new defaults, but with the same old visual position.

## How to use it

All you need to do is import and call the function `installOriginWrapperUpdater` in your project

```ts
import { installOriginWrapperUpdater } from 'fabric/extensions';

installOriginWrapperUpdater();
```
