import { StaticCanvas } from '../canvas/StaticCanvas';
import { Point } from '../Point';
import { TMat2D } from '../typedefs';
import { mapValues } from '../util/internals';
import { makeBoundingBoxFromPoints } from '../util/misc/boundingBoxFromPoints';
import { calcBaseChangeMatrix } from '../util/misc/planeChange';
import { ViewportBBox } from './ViewportBBox';

export class CanvasBBox extends ViewportBBox {
  static getViewportCoords(canvas: StaticCanvas) {
    const size = new Point(canvas.width, canvas.height);
    return mapValues(
      {
        tl: new Point(-0.5, -0.5),
        tr: new Point(0.5, -0.5),
        br: new Point(0.5, 0.5),
        bl: new Point(-0.5, 0.5),
      },
      (coord) => coord.multiply(size).transform(canvas.viewportTransform)
    );
  }

  static getPlanes(canvas: StaticCanvas) {
    const vpt: TMat2D = [...canvas.viewportTransform];
    return {
      viewport() {
        return vpt;
      },
    };
  }

  static transformed(canvas: StaticCanvas) {
    return new this(
      this.getTransformation(this.getViewportCoords(canvas)),
      this.getPlanes(canvas)
    );
  }

  static bbox(canvas: StaticCanvas) {
    const coords = this.getViewportCoords(canvas);
    const bbox = makeBoundingBoxFromPoints(Object.values(coords));
    const transform = calcBaseChangeMatrix(
      undefined,
      [new Point(bbox.width, 0), new Point(0, bbox.height)],
      coords.tl.midPointFrom(coords.br)
    );
    return new this(transform, this.getPlanes(canvas));
  }
}
