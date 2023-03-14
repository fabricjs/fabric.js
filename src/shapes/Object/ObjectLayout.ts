import { CommonMethods } from '../../CommonMethods';
import { ObjectEvents } from '../../EventTypeDefs';
import { Point } from '../../Point';
import type { TDegree, TMat2D, TOriginX, TOriginY } from '../../typedefs';
import {
  composeMatrix,
  multiplyTransformMatrices,
} from '../../util/misc/matrix';
import { sizeAfterTransform } from '../../util/misc/objectTransforms';
import { sendPointToPlane } from '../../util/misc/planeChange';
import { degreesToRadians } from '../../util/misc/radiansDegreesConversion';
import { resolveOriginPoint } from '../../util/misc/resolveOrigin';
import type { Group } from '../Group';
import { BaseProps } from './types/BaseProps';

type TMatrixCache = {
  key: string;
  value: TMat2D;
};

export class ObjectLayout<EventSpec extends ObjectEvents = ObjectEvents>
  extends CommonMethods<EventSpec>
  implements BaseProps
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
   * Returns the center coordinates of the object relative to it's parent
   * @return {Point}
   */
  getRelativeCenterPoint(): Point {
    return new Point(this.left, this.top).add(
      this.getDimensionsVectorForLayout(
        resolveOriginPoint({ x: this.originX, y: this.originY }).scalarMultiply(
          -1
        )
      )
    );
  }

  setRelativeCenterPoint(point: Point): void {
    const position = point.add(
      this.getDimensionsVectorForLayout(
        resolveOriginPoint({ x: this.originX, y: this.originY })
      )
    );
    this.set({ left: position.x, top: position.y });
  }

  /**
   * Returns the center coordinates of the object relative to canvas
   * @return {Point}
   */
  getCenterPoint(): Point {
    return sendPointToPlane(
      this.getRelativeCenterPoint(),
      this.group?.calcTransformMatrix()
    );
  }

  setCenterPoint(point: Point) {
    this.setRelativeCenterPoint(
      sendPointToPlane(point, undefined, this.group?.calcTransformMatrix())
    );
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
          // this.strokeWidth +
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
      value = composeMatrix({
        angle: this.angle,
        translateX: center.x,
        translateY: center.y,
        scaleX: this.scaleX,
        scaleY: this.scaleY,
        skewX: this.skewX,
        skewY: this.skewY,
        flipX: this.flipX,
        flipY: this.flipY,
      });
    this.ownMatrixCache = {
      key,
      value,
    };
    return value;
  }
}
