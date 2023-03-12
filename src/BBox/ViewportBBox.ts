import { iMatrix } from '../constants';
import { Intersection } from '../Intersection';
import { TMat2D } from '../typedefs';
import {
  invertTransform,
  multiplyTransformMatrices,
} from '../util/misc/matrix';
import { PlaneBBox } from './PlaneBBox';

export interface ViewportBBoxPlanes {
  viewport(): TMat2D;
}

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
    const coords = Object.values(this.getCoordMap());
    const otherCoords = Object.values(other.getCoordMap());
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
    const otherCoords = Object.values(other.getCoordMap());
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
}
