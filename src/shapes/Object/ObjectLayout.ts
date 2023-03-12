import type { TDegree, TMat2D, TOriginX, TOriginY } from '../../typedefs';
import { Point } from '../../Point';
import {
  composeMatrix,
  invertTransform,
  multiplyTransformMatrices,
} from '../../util/misc/matrix';
import { ObjectEvents } from '../../EventTypeDefs';
import { degreesToRadians } from '../../util/misc/radiansDegreesConversion';
import { sizeAfterTransform } from '../../util/misc/objectTransforms';
import type { Group } from '../Group';
import { BaseProps } from './types/BaseProps';
import { CommonMethods } from '../../CommonMethods';
import { FabricObjectProps } from './types';
import { PlaneBBox } from '../../BBox/PlaneBBox';

type TMatrixCache = {
  key: string;
  value: TMat2D;
};

export class ObjectLayout<EventSpec extends ObjectEvents = ObjectEvents>
  extends CommonMethods<EventSpec>
  implements BaseProps, Pick<FabricObjectProps, 'centeredRotation'>
{
  declare left: number;
  declare top: number;
  declare width: number;
  declare height: number;
  declare flipX: boolean;
  declare flipY: boolean;
  declare scaleX: number;
  declare scaleY: number;
  declare skewX: number;
  declare skewY: number;
  declare originX: TOriginX;
  declare originY: TOriginY;
  declare angle: TDegree;
  declare centeredRotation: true;

  /**
   * Object containing this object.
   * can influence its size and position
   */
  declare group?: Group;

  /**
   * storage cache for object transform matrix
   */
  declare ownMatrixCache?: TMatrixCache;

  /**
   * storage cache for object full transform matrix
   */
  declare matrixCache?: TMatrixCache;

  protected getDimensionsVectorForLayout(origin = new Point(1, 1)) {
    return sizeAfterTransform(this.width, this.height, this)
      .rotate(degreesToRadians(this.angle))
      .multiply(origin);
  }

  /**
   * @returns {number} x position according to object's {@link originX} property in canvas coordinate plane
   */
  getX(): number {
    return this.getXY().x;
  }

  /**
   * @param {number} value x position according to object's {@link originX} property in canvas coordinate plane
   */
  setX(value: number) {
    this.setXY(this.getXY().setX(value));
  }

  /**
   * @returns {number} y position according to object's {@link originY} property in canvas coordinate plane
   */
  getY(): number {
    return this.getXY().y;
  }

  /**
   * @param {number} value y position according to object's {@link originY} property in canvas coordinate plane
   */
  setY(value: number) {
    this.setXY(this.getXY().setY(value));
  }

  /**
   * @returns {Point} x position according to object's {@link originX} {@link originY} properties in canvas coordinate plane
   */
  getXY(originX?: TOriginX, originY?: TOriginY): Point {
    const relativePosition = this.getRelativeXY(originX, originY);
    return this.group
      ? relativePosition.transform(this.group.calcTransformMatrix())
      : relativePosition;
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
  setXY(point: Point, originX?: TOriginX, originY?: TOriginY) {
    this.setRelativeXY(
      this.group
        ? point.transform(invertTransform(this.group.calcTransformMatrix()))
        : point,
      originX,
      originY
    );
  }

  /**
   * @returns {Point} x,y position according to object's {@link originX} {@link originY} properties in parent's coordinate plane
   */
  getRelativeXY(
    originX: TOriginX = this.originX,
    originY: TOriginY = this.originY
  ): Point {
    return new Point(this.left, this.top).add(
      this.getDimensionsVectorForLayout(
        PlaneBBox.getOriginDiff(
          { x: this.originX, y: this.originY },
          { x: originX, y: originY }
        )
      )
    );
  }

  /**
   * As {@link setXY}, but in current parent's coordinate plane (the current group if any or the canvas)
   * @param {Point} point position according to object's {@link originX} {@link originY} properties in parent's coordinate plane
   * @param {TOriginX} [originX] Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} [originY] Vertical origin: 'top', 'center' or 'bottom'
   */
  setRelativeXY(
    point: Point,
    originX: TOriginX = this.originX,
    originY: TOriginY = this.originY
  ) {
    const position = point.add(
      this.getDimensionsVectorForLayout(
        PlaneBBox.getOriginDiff(
          { x: originX, y: originY },
          { x: this.originX, y: this.originY }
        )
      )
    );
    this.set({ left: position.x, top: position.y });
  }

  /**
   * Returns the center coordinates of the object relative to it's parent
   * @return {Point}
   */
  getRelativeCenterPoint(): Point {
    return this.getRelativeXY('center', 'center');
  }

  setRelativeCenterPoint(point: Point): void {
    this.setRelativeXY(point, 'center', 'center');
  }

  /**
   * Returns the center coordinates of the object relative to canvas
   * @return {Point}
   */
  getCenterPoint(): Point {
    return this.getXY('center', 'center');
  }

  setCenterPoint(point: Point) {
    this.setXY(point, 'center', 'center');
  }

  transformMatrixKey(skipGroup = false): string {
    const sep = '_';
    return !skipGroup && this.group
      ? this.group.transformMatrixKey() + sep
      : '' +
          this.top +
          sep +
          this.left +
          sep +
          this.scaleX +
          sep +
          this.scaleY +
          sep +
          this.skewX +
          sep +
          this.skewY +
          sep +
          this.angle +
          sep +
          this.originX +
          sep +
          this.originY +
          sep +
          this.width +
          sep +
          this.height +
          sep +
          // TODO: why is this here?
          this.strokeWidth +
          this.flipX +
          this.flipY;
  }

  /**
   * calculate transform matrix that represents the current transformations from the
   * object's properties.
   * @param {Boolean} [skipGroup] return transform matrix for object not counting parent transformations
   * There are some situation in which this is useful to avoid the fake rotation.
   * @return {TMat2D} transform matrix for the object
   */
  calcTransformMatrix(skipGroup = false): TMat2D {
    let matrix = this.calcOwnMatrix();
    if (skipGroup || !this.group) {
      return matrix;
    }
    const key = this.transformMatrixKey(skipGroup),
      cache = this.matrixCache;
    if (cache && cache.key === key) {
      return cache.value;
    }
    if (this.group) {
      matrix = multiplyTransformMatrices(
        this.group.calcTransformMatrix(false),
        matrix
      );
    }
    this.matrixCache = {
      key,
      value: matrix,
    };
    return matrix;
  }

  /**
   * calculate transform matrix that represents the current transformations from the
   * object's properties, this matrix does not include the group transformation
   * @return {TMat2D} transform matrix for the object
   */
  calcOwnMatrix(): TMat2D {
    const key = this.transformMatrixKey(true),
      cache = this.ownMatrixCache;
    if (cache && cache.key === key) {
      return cache.value;
    }
    const center = this.getRelativeCenterPoint(),
      options = {
        angle: this.angle,
        translateX: center.x,
        translateY: center.y,
        scaleX: this.scaleX,
        scaleY: this.scaleY,
        skewX: this.skewX,
        skewY: this.skewY,
        flipX: this.flipX,
        flipY: this.flipY,
      },
      value = composeMatrix(options);
    this.ownMatrixCache = {
      key,
      value,
    };
    return value;
  }
}
