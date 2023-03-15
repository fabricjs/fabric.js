import { BBox } from '../../BBox/BBox';
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
  invertTransform,
  isMatrixEqual,
  multiplyTransformMatrices,
  multiplyTransformMatrixChain,
} from '../../util/misc/matrix';
import { applyTransformToObject } from '../../util/misc/objectTransforms';
import {
  calcBaseChangeMatrix,
  sendPointToPlane,
} from '../../util/misc/planeChange';
import { degreesToRadians } from '../../util/misc/radiansDegreesConversion';
import {
  createVector,
  getOrthonormalVector,
  getUnitVector,
} from '../../util/misc/vectors';
import { ObjectPosition } from './ObjectPosition';

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
   * @returns true if transform has changed
   */
  transformObjectInPlane(
    transform: TMat2D,
    {
      originX = this.originX,
      originY = this.originY,
      plane = iMatrix,
    }: {
      originX?: TOriginX;
      originY?: TOriginY;
      plane?: TMat2D;
    } = {}
  ) {
    const transformCenter = sendPointToPlane(
      this.getXY(originX, originY),
      undefined,
      plane
    );
    const ownTransform = multiplyTransformMatrixChain([
      invertTransform(plane),
      [1, 0, 0, 1, transformCenter.x, transformCenter.y],
      transform,
      [1, 0, 0, 1, -transformCenter.x, -transformCenter.y],
      plane,
      this.calcOwnMatrix(),
    ]);

    if (!isMatrixEqual(ownTransform, this.calcOwnMatrix())) {
      // TODO: stop using decomposed values in favor of a matrix
      applyTransformToObject(this, ownTransform);
      this.setCoords();
      this.group?._set('dirty', true);
      return true;
    }

    return false;
  }

  /**
   * Transforms object with respect to origin
   * @param transform
   * @param param1 options
   * @returns true if transform has changed
   */
  transformObject(
    transform: TMat2D,
    {
      originX = this.originX,
      originY = this.originY,
      inViewport = false,
    }: ObjectTransformOptions = {}
  ) {
    return this.transformObjectInPlane(
      inViewport
        ? multiplyTransformMatrices(
            invertTransform(this.getViewportTransform()),
            transform
          )
        : transform,
      { originX, originY, plane: this.group?.calcTransformMatrix() }
    );
  }

  setObjectTransform(transform: TMat2D, options?: ObjectTransformOptions) {
    return this.transformObject(
      multiplyTransformMatrices(
        transform,
        invertTransform(
          options?.inViewport
            ? this.calcTransformMatrixInViewport()
            : this.calcTransformMatrix()
        )
      ),
      options
    );
  }

  translate(x: number, y: number, inViewport?: boolean) {
    return this.transformObject([1, 0, 0, 1, x, y], { inViewport });
  }

  scale(x: number, y: number, options?: ObjectTransformOptions) {
    const [a, b, c, d] = options?.inViewport
      ? this.calcTransformMatrixInViewport()
      : this.calcTransformMatrix();
    return this.transformObject([x / a, 0, 0, y / d, 0, 0], options);
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
    const bbox = BBox.bbox(this);
    const { tl, tr, bl } = (
      options?.inViewport ? bbox : bbox.sendToCanvas()
    ).getCoords();
    return this.shearSides(
      [createVector(tl, tr), createVector(tl, bl)],
      [x, y],
      options
    );
  }

  shearBy(x: number, y: number, options?: ObjectTransformOptions) {
    const bbox = BBox.transformed(this);
    const { tl, tr, bl } = (
      options?.inViewport ? bbox : bbox.sendToCanvas()
    ).getCoords();
    return this.shearSides(
      [
        getUnitVector(createVector(tl, tr)),
        getUnitVector(createVector(tl, bl)),
      ],
      [x, y],
      options
    );
  }

  protected shearSides(
    [vx, vy]: [Point, Point],
    [x, y]: [number, number],
    options?: ObjectTransformOptions
  ) {
    const xVector = getUnitVector(vx);
    const yVector = getUnitVector(vy);
    return this.shearSidesBy(
      [xVector, yVector],
      [
        getOrthonormalVector(xVector).scalarMultiply(y),
        getOrthonormalVector(yVector).scalarMultiply(x),
      ],
      options
    );
  }

  /**
   *
   * @param param0 2 vectors representing the sides of the object
   * @param param1 2 vectors representing the shearing offset affecting the 2 side vectors respectively (dy affects vx and dx affects vy)
   * @param options
   * @returns
   */
  shearSidesBy(
    [vx, vy]: [Point, Point],
    [dy, dx]: [Point, Point],
    options?: ObjectTransformOptions
  ) {
    const [a, b, c, d] = options?.inViewport
      ? this.calcTransformMatrixInViewport()
      : this.calcTransformMatrix();
    const xTVector = getUnitVector(new Point(a, b));
    const yTVector = getUnitVector(new Point(c, d));
    const newXVector = getUnitVector(vx.add(dy));
    const newYVector = getUnitVector(vy.add(dx));
    return this.transformObject(
      calcBaseChangeMatrix([xTVector, yTVector], [newXVector, newYVector]),
      options
    );
  }

  /**
   * Rotates object to angle
   * @param {TDegree} angle Angle value (in degrees)
   * @returns true if transform has changed
   */
  rotate(angle: TDegree, options?: ObjectTransformOptions) {
    return this.transformObject(
      calcRotateMatrix({
        rotation:
          degreesToRadians(angle) -
          (options?.inViewport
            ? this.bbox
            : this.bbox.sendToCanvas()
          ).getRotation(),
      }),
      options
    );
  }

  /**
   * Rotates object by angle
   * @param {TDegree} angle Angle value (in degrees)
   * @returns true if transform has changed
   */
  rotateBy(angle: TDegree, options?: ObjectTransformOptions) {
    return this.transformObject(calcRotateMatrix({ angle }), options);
  }

  flip(x: boolean, y: boolean, options?: ObjectTransformOptions) {
    return this.transformObject([x ? -1 : 1, 0, 0, y ? -1 : 1, 0, 0], options);
  }
}
