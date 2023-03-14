import { ObjectEvents } from '../../EventTypeDefs';
import { Point } from '../../Point';
import type { TBBox } from '../../typedefs';
import { BBox } from '../../BBox/BBox';
import { ObjectTransformations } from './ObjectTransformations';
import { ViewportBBox } from '../../BBox/ViewportBBox';

export class ObjectGeometry<
  EventSpec extends ObjectEvents = ObjectEvents
> extends ObjectTransformations<EventSpec> {
  /**
   * Skip rendering of objects that are not included in current drawing area (viewport/bbox for canvas/group respectively).
   * May greatly help in applications with crowded canvas and use of zoom/pan.
   * @type Boolean
   * @default
   */
  skipOffscreen = true;

  /**
   * Checks if object intersects with an area formed by 2 points
   * @param {Object} tl top-left point of area
   * @param {Object} br bottom-right point of area
   * @param {Boolean} [absolute] use coordinates without viewportTransform
   * @return {Boolean} true if object intersects with an area formed by 2 points
   */
  intersectsWithRect(tl: Point, br: Point, absolute?: boolean): boolean {
    const rect = ViewportBBox[absolute ? 'canvasBounds' : 'bounds'](
      tl,
      br,
      this.getViewportTransform()
    );
    return this.bbox.intersects(rect);
  }

  /**
   * Checks if object is fully contained within area formed by 2 points
   * @param {Object} tl top-left point of area
   * @param {Object} br bottom-right point of area
   * @param {Boolean} [absolute] use coordinates without viewportTransform
   * @return {Boolean} true if object is fully contained within area formed by 2 points
   */
  isContainedWithinRect(tl: Point, br: Point, absolute?: boolean): boolean {
    const rect = ViewportBBox[absolute ? 'canvasBounds' : 'bounds'](
      tl,
      br,
      this.getViewportTransform()
    );
    return this.bbox.isContainedBy(rect);
  }

  /**
   * Checks if object **strictly** intersects with another object
   * @param {Object} other Object to test
   * @return {Boolean} true if object intersects with another object
   */
  intersectsWithObject(other: ObjectGeometry): boolean {
    return this.bbox.intersects(other.bbox);
  }

  /**
   * Checks if object is fully contained within area of another object
   * @param {Object} other Object to test
   * @param {Boolean} [absolute] use coordinates without viewportTransform
   * @return {Boolean} true if object is fully contained within area of another object
   */
  isContainedWithinObject(other: ObjectGeometry): boolean {
    return this.bbox.isContainedBy(other.bbox);
  }

  isOverlapping<T extends ObjectGeometry>(other: T): boolean {
    return this.bbox.overlaps(other.bbox);
  }

  /**
   * Checks if point is inside the object
   * @param {Point} points Point to check against
   * @param {Boolean} [absolute] use coordinates without viewportTransform
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
    return ViewportBBox.canvas(this.canvas).overlaps(this.bbox);
  }

  /**
   * Checks if object is partially contained within the canvas with current viewportTransform
   * @return {Boolean} true if object is partially contained within canvas
   */
  isPartiallyOnScreen(): boolean {
    if (!this.canvas) {
      return false;
    }
    const bbox = ViewportBBox.canvas(this.canvas);
    return bbox.intersects(this.bbox) || bbox.isContainedBy(this.bbox);
  }

  /**
   * Returns coordinates of object's bounding rectangle (left, top, width, height)
   * the box is aligned to the axis of canvas.
   * @param {Boolean} [absolute] use coordinates without viewportTransform
   * @return {Object} Object with left, top, width, height properties
   */
  getBoundingRect(absolute = false): TBBox {
    const bbox = BBox.bbox(this);
    return (absolute ? bbox.sendToCanvas() : bbox).getBBox();
  }
}
