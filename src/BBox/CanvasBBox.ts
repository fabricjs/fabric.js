import { StaticCanvas } from '../canvas/StaticCanvas';
import { Point } from '../Point';
import { TMat2D } from '../typedefs';
import { calcBaseChangeMatrix } from '../util/misc/planeChange';
import { ViewportBBox } from './ViewportBBox';

export class CanvasBBox extends ViewportBBox {
  static getPlanes(canvas: StaticCanvas) {
    const vpt: TMat2D = [...canvas.viewportTransform];
    return {
      viewport() {
        return vpt;
      },
    };
  }

  static bbox(canvas: StaticCanvas) {
    const transform = calcBaseChangeMatrix(
      undefined,
      [new Point(canvas.width, 0), new Point(0, canvas.height)],
      canvas.getCenterPoint()
    );
    return new this(transform, this.getPlanes(canvas));
  }
}
