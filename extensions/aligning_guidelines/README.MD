# Aligning guidelines

## How to use it

```ts
import { initAligningGuidelines } from 'fabric/extensions';

const config = {
  /** At what distance from the shape does alignment begin? */
  margin: 4,
  /** Aligning line dimensions */
  width: 1,
  /** Aligning line color */
  color: 'rgb(255,0,0,0.9)',
};

const deactivate = initAligningGuidelines(myCanvas, options);

// in order to disable alignment guidelines later:

deactivate();
```
