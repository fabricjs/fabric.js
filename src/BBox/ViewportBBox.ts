import type { StaticCanvas } from '../canvas/StaticCanvas';
import { iMatrix } from '../constants';
import { Intersection } from '../Intersection';
import { Point } from '../Point';
import { TBBox, TMat2D } from '../typedefs';
import { makeBoundingBoxFromPoints } from '../util/misc/boundingBoxFromPoints';
import {
  invertTransform,
  multiplyTransformMatrices,
} from '../util/misc/matrix';
import {
  calcBaseChangeMatrix,
  sendPointToPlane,
} from '../util/misc/planeChange';
import { PlaneBBox } from './PlaneBBox';

export interface ViewportBBoxPlanes {
  viewport(): TMat2D;
}

/**
 * This class manages operations in the canvas viewport since object geometry depends on the viewport (e.g. `strokeUniform`)
 *
 */
export class ViewportBBox extends PlaneBBox {
  protected readonly planes: ViewportBBoxPlanes;

  protected constructor(transform: TMat2D, planes: ViewportBBoxPlanes) {
    super(transform);
    this.planes = planes;
  }

  sendToPlane(plane: TMat2D) {
    const backToPlane = invertTransform(
      multiplyTransformMatrices(this.planes.viewport(), plane)
    );
    return new PlaneBBox(
      multiplyTransformMatrices(backToPlane, this.getTransformation())
    );
  }

  sendToCanvas() {
    return this.sendToPlane(iMatrix);
  }

  intersect(other: ViewportBBox) {
    const coords = Object.values(this.getCoords());
    const otherCoords = Object.values(other.getCoords());
    return Intersection.intersectPolygonPolygon(coords, otherCoords);
  }

  intersects(other: ViewportBBox) {
    const intersection = this.intersect(other);
    return (
      intersection.status === 'Intersection' ||
      intersection.status === 'Coincident'
    );
  }

  contains(other: ViewportBBox) {
    const otherCoords = Object.values(other.getCoords());
    return otherCoords.every((coord) => this.containsPoint(coord));
  }

  isContainedBy(other: ViewportBBox) {
    return other.contains(this);
  }

  overlaps(other: ViewportBBox) {
    return (
      this.intersects(other) ||
      this.contains(other) ||
      this.isContainedBy(other)
    );
  }

  static rect({ left, top, width, height }: TBBox, vpt: TMat2D = iMatrix) {
    const transform = calcBaseChangeMatrix(
      undefined,
      [new Point(width, 0), new Point(0, height)],
      new Point(left + width / 2, top + height / 2)
    );
    return new this(transform, {
      viewport() {
        return vpt;
      },
    });
  }

  static bounds(tl: Point, br: Point, vpt: TMat2D) {
    return this.rect(makeBoundingBoxFromPoints([tl, br]), vpt);
  }

  static canvas(canvas: StaticCanvas) {
    return this.rect(
      {
        left: 0,
        top: 0,
        width: canvas.width,
        height: canvas.height,
      },
      [...canvas.viewportTransform]
    );
  }

  static canvasBounds(tl: Point, br: Point, vpt: TMat2D) {
    return this.rect(
      makeBoundingBoxFromPoints(
        [tl, br].map((point) => sendPointToPlane(point, undefined, vpt))
      ),
      vpt
    );
  }
}
