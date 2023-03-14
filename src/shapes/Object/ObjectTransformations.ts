import { iMatrix } from '../../constants';
import { ObjectEvents } from '../../EventTypeDefs';
import { Point } from '../../Point';
import type {
  TAxis,
  TDegree,
  TMat2D,
  TOriginX,
  TOriginY,
} from '../../typedefs';
import {
  calcRotateMatrix,
  calcShearMatrix,
  invertTransform,
  multiplyTransformMatrices,
  multiplyTransformMatrixChain,
} from '../../util/misc/matrix';
import { BBox } from '../../BBox/BBox';
import { ObjectPosition } from './ObjectPosition';
import { degreesToRadians } from '../../util/misc/radiansDegreesConversion';
import { applyTransformToObject } from '../../util/misc/objectTransforms';

type ObjectTransformOptions = {
  originX?: TOriginX;
  originY?: TOriginY;
  inViewport?: boolean;
};

export class ObjectTransformations<
  EventSpec extends ObjectEvents = ObjectEvents
> extends ObjectPosition<EventSpec> {
  /**
   * Returns width of an object's bounding box counting transformations
   * @todo shouldn't this account for group transform and return the actual size in canvas coordinate plane?
   * @deprecated
   * @return {Number} width value
   */
  getScaledWidth(): number {
    return BBox.transformed(this).sendToCanvas().getDimensionsVector().x;
  }

  /**
   * Returns height of an object bounding box counting transformations
   * @todo shouldn't this account for group transform and return the actual size in canvas coordinate plane?
   * @deprecated
   * @return {Number} height value
   */
  getScaledHeight(): number {
    return BBox.transformed(this).sendToCanvas().getDimensionsVector().y;
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
    const scale =
      value / new Point(this.width, this.height)[axis] / boundingRectFactor;
    this.scale(scale, scale);
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
   * Transforms object with respect to origin
   * @param transform
   * @param param1 options
   * @returns own transform
   */
  transformObject(
    transform: TMat2D,
    {
      originX = this.originX,
      originY = this.originY,
      inViewport = false,
    }: ObjectTransformOptions = {}
  ) {
    const transformCenter = this.getXY(originX, originY);
    const t = multiplyTransformMatrixChain([
      this.group ? invertTransform(this.group.calcTransformMatrix()) : iMatrix,
      [1, 0, 0, 1, transformCenter.x, transformCenter.y],
      inViewport ? invertTransform(this.getViewportTransform()) : iMatrix,
      transform,
      [1, 0, 0, 1, -transformCenter.x, -transformCenter.y],
      this.calcTransformMatrix(),
    ]);
    // TODO: stop using decomposed values in favor of a matrix
    applyTransformToObject(this, t);
    this.setCoords();
    return this.calcOwnMatrix();
  }

  setObjectTransform(transform: TMat2D, options?: ObjectTransformOptions) {
    return this.transformObject(
      multiplyTransformMatrices(
        transform,
        invertTransform(this.calcTransformMatrix())
      ),
      options
    );
  }

  translate(x: number, y: number, inViewport?: boolean) {
    return this.transformObject([1, 0, 0, 1, x, y], { inViewport });
  }

  scale(x: number, y: number, options?: ObjectTransformOptions) {
    return this.transformObject([x, 0, 0, y, 0, 0], options);
  }

  scaleBy(x: number, y: number, options?: ObjectTransformOptions) {
    return this.transformObject([x, 0, 0, y, 0, 0], options);
  }

  skew(x: TDegree, y: TDegree, options?: ObjectTransformOptions) {
    return this.shear(
      Math.tan(degreesToRadians(x)),
      Math.tan(degreesToRadians(y)),
      options
    );
  }

  skewBy(x: TDegree, y: TDegree, options?: ObjectTransformOptions) {
    return this.shearBy(
      Math.tan(degreesToRadians(x)),
      Math.tan(degreesToRadians(y)),
      options
    );
  }

  shear(x: number, y: number, options?: ObjectTransformOptions) {
    const [_, b, c] = this.calcTransformMatrix();
    return this.transformObject(
      multiplyTransformMatrices(
        calcShearMatrix({ shearX: x, shearY: y }),
        invertTransform([1, b, c, 1, 0, 0])
      ),
      options
    );
  }

  shearBy(x: number, y: number, options?: ObjectTransformOptions) {
    return this.transformObject(
      calcShearMatrix({ shearX: x, shearY: y }),
      options
    );
  }

  /**
   * Rotates object to angle
   * @param {TDegree} angle Angle value (in degrees)
   * @returns own transform
   */
  rotate(angle: TDegree, options?: ObjectTransformOptions) {
    return this.transformObject(
      calcRotateMatrix({
        rotation: degreesToRadians(angle) - this.bbox.getRotation(),
      }),
      options
    );
  }

  /**
   * Rotates object by angle
   * @param {TDegree} angle Angle value (in degrees)
   * @returns own transform
   */
  rotateBy(angle: TDegree, options?: ObjectTransformOptions) {
    return this.transformObject(calcRotateMatrix({ angle }), options);
  }

  flip(x: boolean, y: boolean, options?: ObjectTransformOptions) {
    return this.transformObject([x ? -1 : 1, 0, 0, y ? -1 : 1, 0, 0], options);
  }
}
