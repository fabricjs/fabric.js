import { ObjectEvents } from '../../EventTypeDefs';
import { Point } from '../../Point';
import type { TOriginX, TOriginY } from '../../typedefs';
import { resolveOriginPoint } from '../../util/misc/resolveOrigin';
import { sendPointToPlane } from '../../util/misc/planeChange';
import { ObjectBBox } from './ObjectBBox';

export class ObjectPosition<
  EventSpec extends ObjectEvents = ObjectEvents
> extends ObjectBBox<EventSpec> {
  /**
   * @returns {number} x position according to object's {@link originX} property in canvas coordinate plane
   */
  getX(originX: TOriginX = this.originX): number {
    return this.getXY(originX).x;
  }

  /**
   * @param {number} value x position according to object's {@link originX} property in canvas coordinate plane
   */
  setX(value: number, originX: TOriginX = this.originX) {
    this.setXY(this.getXY(originX).setX(value));
  }

  /**
   * @returns {number} y position according to object's {@link originY} property in canvas coordinate plane
   */
  getY(originY: TOriginY = this.originY): number {
    return this.getXY(undefined, originY).y;
  }

  /**
   * @param {number} value y position according to object's {@link originY} property in canvas coordinate plane
   */
  setY(value: number, originY: TOriginY = this.originY) {
    this.setXY(this.getXY(undefined, originY).setY(value));
  }

  /**
   * @returns {Point} x position according to object's {@link originX} {@link originY} properties in canvas coordinate plane
   */
  getXY(
    originX: TOriginX = this.originX,
    originY: TOriginY = this.originY
  ): Point {
    return this.bbox
      .sendToCanvas()
      .pointFromOrigin(resolveOriginPoint(originX, originY));
  }

  /**
   * Set an object position to a particular point, the point is intended in absolute ( canvas ) coordinate.
   * You can specify {@link originX} and {@link originY} values,
   * that otherwise are the object's current values.
   * @example <caption>Set object's bottom left corner to point (5,5) on canvas</caption>
   * object.setXY(new Point(5, 5), 'left', 'bottom').
   * @param {Point} point position in canvas coordinate plane
   * @param {TOriginX} [originX] Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} [originY] Vertical origin: 'top', 'center' or 'bottom'
   */
  setXY(
    point: Point,
    originX: TOriginX = 'center',
    originY: TOriginY = 'center'
  ) {
    const delta = this.bbox
      .sendToParent()
      .getOriginTranslation(
        sendPointToPlane(point, undefined, this.group?.calcTransformMatrix()),
        resolveOriginPoint(originX, originY)
      );
    this.set({
      left: this.left + delta.x,
      top: this.top + delta.y,
    });
    this.setCoords();
  }
}
