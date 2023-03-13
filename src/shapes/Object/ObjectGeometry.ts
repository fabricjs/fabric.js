import { iMatrix } from '../../constants';
import { ObjectEvents } from '../../EventTypeDefs';
import { Intersection } from '../../Intersection';
import { Point } from '../../Point';
import type { TAxis, TBBox, TDegree } from '../../typedefs';
import {
  calcRotateMatrix,
  invertTransform,
  multiplyTransformMatrixChain,
  qrDecompose,
} from '../../util/misc/matrix';
import { BBox } from '../../BBox/BBox';
import { CanvasBBox } from '../../BBox/CanvasBBox';
import { ObjectPosition } from './ObjectPosition';

export class ObjectGeometry<
  EventSpec extends ObjectEvents = ObjectEvents
> extends ObjectPosition<EventSpec> {
  /**
   * Skip rendering of objects that are not included in current drawing area (viewport/bbox for canvas/group respectively).
   * May greatly help in applications with crowded canvas and use of zoom/pan.
   * @type Boolean
   * @default
   */
  skipOffscreen = true;

  /**
   * Checks if object intersects with an area formed by 2 points
   * @param {Object} pointTL top-left point of area
   * @param {Object} pointBR bottom-right point of area
   * @param {Boolean} [absolute] use coordinates without viewportTransform
   * @param {Boolean} [calculate] use coordinates of current position instead of stored one
   * @return {Boolean} true if object intersects with an area formed by 2 points
   */
  intersectsWithRect(
    pointTL: Point,
    pointBR: Point,
    absolute?: boolean
  ): boolean {
    const coords = this.getCoords(absolute),
      intersection = Intersection.intersectPolygonRectangle(
        coords,
        pointTL,
        pointBR
      );
    return intersection.status === 'Intersection';
  }

  /**
   * Checks if object intersects with another object
   * @param {Object} other Object to test
   * @param {Boolean} [absolute] use coordinates without viewportTransform
   * @param {Boolean} [calculate] use coordinates of current position instead of calculating them
   * @return {Boolean} true if object intersects with another object
   */
  intersectsWithObject(other: ObjectGeometry, absolute?: boolean): boolean {
    const intersection = Intersection.intersectPolygonPolygon(
      this.getCoords(absolute),
      other.getCoords(absolute)
    );
    return (
      intersection.status === 'Intersection' ||
      intersection.status === 'Coincident' ||
      other.isContainedWithinObject(this, absolute) ||
      this.isContainedWithinObject(other, absolute)
    );
  }

  /**
   * Checks if object is fully contained within area of another object
   * @param {Object} other Object to test
   * @param {Boolean} [absolute] use coordinates without viewportTransform
   * @param {Boolean} [calculate] use coordinates of current position instead of store ones
   * @return {Boolean} true if object is fully contained within area of another object
   */
  isContainedWithinObject(other: ObjectGeometry, absolute?: boolean): boolean {
    return this.getCoords(absolute).every((coord) =>
      other.containsPoint(coord, absolute)
    );
  }

  /**
   * Checks if object is fully contained within area formed by 2 points
   * @param {Object} pointTL top-left point of area
   * @param {Object} pointBR bottom-right point of area
   * @param {Boolean} [absolute] use coordinates without viewportTransform
   * @param {Boolean} [calculate] use coordinates of current position instead of stored one
   * @return {Boolean} true if object is fully contained within area formed by 2 points
   */
  isContainedWithinRect(
    pointTL: Point,
    pointBR: Point,
    absolute?: boolean
  ): boolean {
    const boundingRect = this.getBoundingRect(absolute);
    return (
      boundingRect.left >= pointTL.x &&
      boundingRect.left + boundingRect.width <= pointBR.x &&
      boundingRect.top >= pointTL.y &&
      boundingRect.top + boundingRect.height <= pointBR.y
    );
  }

  isOverlapping<T extends ObjectGeometry>(other: T): boolean {
    return (
      this.intersectsWithObject(other) ||
      this.isContainedWithinObject(other) ||
      other.isContainedWithinObject(this)
    );
  }

  /**
   * Checks if point is inside the object
   * @param {Point} points Point to check against
   * @param {Boolean} [absolute] use coordinates without viewportTransform
   * @param {Boolean} [calculate] use coordinates of current position instead of stored ones
   * @return {Boolean} true if point is inside the object
   */
  containsPoint(point: Point, absolute = false) {
    return (absolute ? this.bbox.sendToCanvas() : this.bbox).containsPoint(
      point
    );
  }

  /**
   * Checks if object is contained within the canvas with current viewportTransform
   * the check is done stopping at first point that appears on screen
   * @return {Boolean} true if object is fully or partially contained within canvas
   */
  isOnScreen(): boolean {
    if (!this.canvas) {
      return false;
    }
    return CanvasBBox.bbox(this.canvas).overlaps(this.bbox);
  }

  /**
   * Checks if object is partially contained within the canvas with current viewportTransform
   * @param {Boolean} [calculate] use coordinates of current position instead of stored ones
   * @return {Boolean} true if object is partially contained within canvas
   */
  isPartiallyOnScreen(): boolean {
    if (!this.canvas) {
      return false;
    }
    const bbox = CanvasBBox.bbox(this.canvas);
    return bbox.intersects(this.bbox) || bbox.isContainedBy(this.bbox);
  }

  /**
   * Returns coordinates of object's bounding rectangle (left, top, width, height)
   * the box is intended as aligned to axis of canvas.
   * @param {Boolean} [absolute] use coordinates without viewportTransform
   * @return {Object} Object with left, top, width, height properties
   */
  getBoundingRect(absolute = false): TBBox {
    const bbox = BBox.canvas(this);
    return (absolute ? bbox.sendToCanvas() : bbox).getBBox();
  }

  /**
   * Returns width of an object's bounding box counting transformations
   * @todo shouldn't this account for group transform and return the actual size in canvas coordinate plane?
   * @return {Number} width value
   */
  getScaledWidth(): number {
    return BBox.transformed(this).sendToCanvas().getDimensionsVector().x;
  }

  /**
   * Returns height of an object bounding box counting transformations
   * @todo shouldn't this account for group transform and return the actual size in canvas coordinate plane?
   * @return {Number} height value
   */
  getScaledHeight(): number {
    return BBox.transformed(this).sendToCanvas().getDimensionsVector().y;
  }

  /**
   * Scales an object (equally by x and y)
   * @param {Number} value Scale factor
   * @return {void}
   */
  scale(value: number): void {
    this._set('scaleX', value);
    this._set('scaleY', value);
    this.setCoords();
  }

  protected scaleAxisTo(axis: TAxis, value: number, absolute = true) {
    // adjust to bounding rect factor so that rotated shapes would fit as well
    const transformed = BBox.transformed(this)
      .sendToCanvas()
      .getDimensionsVector();
    const rotated = (
      absolute ? this.bbox.sendToCanvas() : this.bbox
    ).getDimensionsVector();
    const boundingRectFactor = rotated[axis] / transformed[axis];
    this.scale(
      value / new Point(this.width, this.height)[axis] / boundingRectFactor
    );
  }

  /**
   * Scales an object to a given width, with respect to bounding box (scaling by x/y equally)
   * @param {Number} value New width value
   * @param {Boolean} absolute ignore viewport
   * @return {void}
   */
  scaleToWidth(value: number, absolute?: boolean) {
    return this.scaleAxisTo('x', value, absolute);
  }

  /**
   * Scales an object to a given height, with respect to bounding box (scaling by x/y equally)
   * @param {Number} value New height value
   * @param {Boolean} absolute ignore viewport
   * @return {void}
   */
  scaleToHeight(value: number, absolute?: boolean) {
    return this.scaleAxisTo('y', value, absolute);
  }

  /**
   * @param {TDegree} angle Angle value (in degrees)
   * @returns own decomposed angle
   */
  rotate(angle: TDegree) {
    const origin = this.centeredRotation ? this.getCenterPoint() : this.getXY();
    const t = multiplyTransformMatrixChain([
      this.group ? invertTransform(this.group.calcTransformMatrix()) : iMatrix,
      calcRotateMatrix({ angle: angle - this.getTotalAngle() }),
      this.calcTransformMatrix(),
    ]);
    const { angle: decomposedAngle } = qrDecompose(t);
    this.set({ angle: decomposedAngle });
    this.centeredRotation ? this.setCenterPoint(origin) : this.setXY(origin);
    this.setCoords();
    return decomposedAngle;
  }
}
