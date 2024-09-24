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
  color: 'rgba(255,0,0,0.9)',
  /** Close Vertical line, default false. */
  closeVLine: false,
  /** Close horizontal line, default false. */
  closeHLine: false,
};

const deactivate = initAligningGuidelines(myCanvas, options);

// in order to disable alignment guidelines later:

deactivate();
```

### custom function

```ts
import { initAligningGuidelines } from 'fabric/extensions';
import { FabricObject } from 'fabric';

// You can customize the return graphic, and the example will only compare it with sibling elements
initAligningGuidelines(myCanvas, {
  getObjectsByTarget: function (target) {
    const set = new Set<FabricObject>();
    const p = target.parent ?? target.canvas;
    p?.getObjects().forEach((o) => {
      set.add(o);
    });
    return set;
  },
});
```

```ts
import { initAligningGuidelines } from 'fabric/extensions';

// You can customize the alignment point, the example only aligns the TL control point
initAligningGuidelines(myCanvas, {
  getPointMap: function (target) {
    const tl = target.getCoords().tl;
    return { tl };
  },
});
```

```ts
import { initAligningGuidelines } from 'fabric/extensions';

FabricObject.createControls = function () {
  // custom controllers
  return { controls: { abc: new Control({}) } };
};

// You can set control points for custom controllers
initAligningGuidelines(myCanvas, {
  getPointMap: function (target) {
    const abc = target.getCoords().tl;
    return { abc };
  },
  getContraryMap: function (target) {
    const abc = target.aCoords.br;
    return { abc };
  },
});
```

```ts
import { initAligningGuidelines } from 'fabric/extensions';

// You can close all
initAligningGuidelines(myCanvas, {
  closeVLine: true,
  closeHLine: true,
  getPointMap: function (_) {
    return {};
  },
});
```
