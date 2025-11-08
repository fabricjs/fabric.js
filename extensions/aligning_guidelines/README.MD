# Aligning guidelines

## How to use it

```ts
import { AligningGuidelines } from 'fabric/extensions';

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

const aligningGuidelines = new AligningGuidelines(myCanvas, options);

// in order to disable alignment guidelines later:

aligningGuidelines.dispose();
```

### custom function

```ts
import { AligningGuidelines } from 'fabric/extensions';
import { FabricObject } from 'fabric';

// You can customize the return graphic, and the example will only compare it with sibling elements
new AligningGuidelines(myCanvas, {
  getObjectsByTarget: function (target) {
    const set = new Set<FabricObject>();
    const p = target.parent ?? target.canvas;
    p?.getObjects().forEach((o) => {
      set.add(o);
    });
    // Please remember to exclude yourself, or you will always align with yourself.
    set.delete(target);
    return set;
  },
});
```

```ts
import { AligningGuidelines } from 'fabric/extensions';

// You can customize the alignment point, the example only aligns the TL control point
new AligningGuidelines(myCanvas, {
  getPointMap: function (target) {
    const tl = target.getCoords().tl;
    return { tl };
  },
});
```

```ts
import { AligningGuidelines } from 'fabric/extensions';
import { InteractiveFabricObject } from 'fabric';

// deactivate constructor control assignment
InteractiveFabricObject.createControls = function () {
  return {};
};
// custom controllers
InteractiveFabricObject.ownDefaults.controls = {
  abc: new Control({}),
};

// You can set control points for custom controllers
new AligningGuidelines(myCanvas, {
  getPointMap: function (target) {
    const abc = target.getCoords().tl;
    return { abc };
  },
  getContraryMap: function (target) {
    const abc = target.aCoords.br;
    return { abc };
  },
  contraryOriginMap: {
    // If abc is the top-left point, then the reference point is the bottom-right.
    abc: ['right', 'bottom'],
  },
});
```

```ts
import { AligningGuidelines } from 'fabric/extensions';

// You can close all
new AligningGuidelines(myCanvas, {
  closeVLine: true,
  closeHLine: true,
  getPointMap: function (_) {
    return {};
  },
});
```

```ts
import { AligningGuidelines } from 'fabric/extensions';

// You can set dashed lines.
// You can adjust the size of endpoint x.
new AligningGuidelines(myCanvas, {
  lineDash: [2, 2],
  xSize: 10,
});
```

```ts
import { AligningGuidelines } from 'fabric/extensions';

// You can customize drawing line segments. What if you want to draw a Bézier curve?
new AligningGuidelines(myCanvas, {
  drawLine(origin, target) {
    const ctx = this.canvas.getTopContext();
    const viewportTransform = this.canvas.viewportTransform;
    const zoom = this.canvas.getZoom();

    ctx.save();
    ctx.transform(...viewportTransform);
    ctx.lineWidth = this.width / zoom;
    if (this.lineDash) ctx.setLineDash(this.lineDash);
    ctx.strokeStyle = this.color;

    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    const controlPoint1 = { x: (origin.x + target.x) / 3, y: origin.y - 50 }; // 控制点1
    const controlPoint2 = { x: (origin.x + target.x) / 3, y: target.y + 50 }; // 控制点2
    ctx.bezierCurveTo(
      controlPoint1.x,
      controlPoint1.y,
      controlPoint2.x,
      controlPoint2.y,
      target.x,
      target.y,
    );
    ctx.stroke();

    if (this.lineDash) ctx.setLineDash([]);

    this.drawX(origin, -1);
    this.drawX(target, 1);

    ctx.restore();
  },
});
```

```ts
import { AligningGuidelines } from 'fabric/extensions';

// If you don't like the endpoints being "X," you can customize the endpoints. For example, the start point can be a solid circle, and the end point can be a hollow circle.
new AligningGuidelines(myCanvas, {
  drawX(point: Point, dir: number) {
    const ctx = this.canvas.getTopContext();
    const zoom = this.canvas.getZoom();
    const size = this.xSize / zoom;

    ctx.save();
    ctx.translate(point.x, point.y);
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    if (dir == -1) {
      ctx.fillStyle = this.color;
      ctx.fill();
    } else {
      ctx.stroke();
    }
    ctx.restore();
  },
});
```
