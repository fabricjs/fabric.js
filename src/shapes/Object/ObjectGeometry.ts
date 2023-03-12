import { Canvas } from '../../canvas/Canvas';
import { StaticCanvas } from '../../canvas/StaticCanvas';
import { iMatrix } from '../../constants';
import { ObjectEvents } from '../../EventTypeDefs';
import { Intersection } from '../../Intersection';
import { Point } from '../../Point';
import type { TAxis, TBBox, TDegree, TMat2D } from '../../typedefs';
import { mapValues } from '../../util/internals';
import {
  calcRotateMatrix,
  invertTransform,
  multiplyTransformMatrices,
  multiplyTransformMatrixChain,
  qrDecompose,
} from '../../util/misc/matrix';
import { degreesToRadians } from '../../util/misc/radiansDegreesConversion';
import { getUnitVector, rotateVector } from '../../util/misc/vectors';
import { BBox, TRotatedBBox } from '../../BBox/BBox';
import { CanvasBBox } from '../../BBox/CanvasBBox';
import { ObjectLayout } from './ObjectLayout';
import { ControlProps } from './types/ControlProps';
import { FillStrokeProps } from './types/FillStrokeProps';

export class ObjectGeometry<EventSpec extends ObjectEvents = ObjectEvents>
  extends ObjectLayout<EventSpec>
  implements
    Pick<FillStrokeProps, 'strokeWidth' | 'strokeUniform'>,
    Pick<ControlProps, 'padding'>
{
  declare strokeWidth: number;
  declare strokeUniform: boolean;
  declare padding: number;

  declare bbox: TRotatedBBox;

  /**
   * A Reference of the Canvas where the object is actually added
   * @type StaticCanvas | Canvas;
   * @default undefined
   * @private
   */
  declare canvas?: StaticCanvas | Canvas;

  skipOffscreen = true;

  /**
   * Override this method if needed
   */
  needsViewportCoords() {
    return this.strokeUniform || !this.padding;
  }

  getCanvasRetinaScaling() {
    return this.canvas?.getRetinaScaling() || 1;
  }

  /**
   * Retrieves viewportTransform from Object's canvas if possible
   * @method getViewportTransform
   * @memberOf FabricObject.prototype
   * @return {TMat2D}
   */
  getViewportTransform(): TMat2D {
    return this.canvas?.viewportTransform || (iMatrix.concat() as TMat2D);
  }

  /**
   * Returns the object angle relative to canvas counting also the group property
   * @returns {TDegree}
   */
  getTotalAngle(): TDegree {
    const { flipX, flipY } = this;
    this.flipX = false;
    this.flipY = false;
    const { angle } = qrDecompose(
      multiplyTransformMatrices(
        this.getViewportTransform(),
        this.calcTransformMatrix()
      )
    );
    this.flipX = flipX;
    this.flipY = flipY;
    return angle;
  }

  protected calcDimensionsVector(
    origin = new Point(1, 1),
    {
      applyViewportTransform = this.needsViewportCoords(),
    }: {
      applyViewportTransform?: boolean;
    } = {}
  ) {
    const vpt = applyViewportTransform ? this.getViewportTransform() : iMatrix;
    const dimVector = origin
      .multiply(new Point(this.width, this.height))
      .add(origin.scalarMultiply(!this.strokeUniform ? this.strokeWidth : 0))
      .transform(
        multiplyTransformMatrices(vpt, this.calcTransformMatrix()),
        true
      );
    const strokeUniformVector = getUnitVector(dimVector).scalarMultiply(
      this.strokeUniform ? this.strokeWidth : 0
    );
    return dimVector.add(strokeUniformVector);
  }

  protected calcCoord(
    origin: Point,
    {
      offset = new Point(),
      applyViewportTransform = this.needsViewportCoords(),
      padding = 0,
    }: {
      offset?: Point;
      applyViewportTransform?: boolean;
      padding?: number;
    } = {}
  ) {
    const vpt = applyViewportTransform ? this.getViewportTransform() : iMatrix;
    const offsetVector = rotateVector(
      offset.add(origin.scalarMultiply(padding * 2)),
      degreesToRadians(this.getTotalAngle())
    );
    const realCenter = this.getCenterPoint().transform(vpt);
    return realCenter
      .add(this.calcDimensionsVector(origin, { applyViewportTransform }))
      .add(offsetVector);
  }

  /**
   * Calculates the coordinates of the 4 corner of the bbox
   * @return {TCornerPoint}
   */
  calcCoords() {
    // const size = new Point(this.width, this.height);
    // return projectStrokeOnPoints(
    //   [
    //     new Point(-0.5, -0.5),
    //     new Point(0.5, -0.5),
    //     new Point(-0.5, 0.5),
    //     new Point(0.5, 0.5),
    //   ].map((origin) => origin.multiply(size)),
    //   {
    //     ...this,
    //     ...qrDecompose(
    //       multiplyTransformMatrices(
    //         this.needsViewportCoords() ? this.getViewportTransform() : iMatrix,
    //         this.calcTransformMatrix()
    //       )
    //     ),
    //   }
    // );

    return mapValues(
      {
        tl: new Point(-0.5, -0.5),
        tr: new Point(0.5, -0.5),
        bl: new Point(-0.5, 0.5),
        br: new Point(0.5, 0.5),
      },
      (origin) => this.calcCoord(origin)
    );
  }

  getCoords(absolute = false) {
    return Object.values(
      (absolute ? this.bbox.sendToCanvas() : this.bbox).getCoords()
    );
  }

  /**
   * Sets corner and controls position coordinates based on current angle, dimensions and position.
   * See {@link https://github.com/fabricjs/fabric.js/wiki/When-to-call-setCoords} and {@link http://fabricjs.com/fabric-gotchas}
   */
  setCoords(): void {
    this.bbox = BBox.rotated(this);
    // debug code
    setTimeout(() => {
      const canvas = this.canvas;
      if (!canvas) return;
      const ctx = canvas.contextTop;
      canvas.clearContext(ctx);
      ctx.save();
      const draw = (point: Point, color: string, radius = 6) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(point.x, point.y, radius, radius, 0, 0, 360);
        ctx.closePath();
        ctx.fill();
      };
      [
        new Point(-0.5, -0.5),
        new Point(0.5, -0.5),
        new Point(-0.5, 0.5),
        new Point(0.5, 0.5),
      ].forEach((origin) => {
        draw(BBox.canvas(this).pointFromOrigin(origin), 'yellow', 10);
        draw(BBox.rotated(this).pointFromOrigin(origin), 'orange', 8);
        draw(BBox.transformed(this).pointFromOrigin(origin), 'silver', 6);
        ctx.save();
        ctx.transform(...this.getViewportTransform());
        draw(
          BBox.canvas(this).sendToCanvas().pointFromOrigin(origin),
          'red',
          10
        );
        draw(
          BBox.rotated(this).sendToCanvas().pointFromOrigin(origin),
          'magenta',
          8
        );
        draw(
          BBox.transformed(this).sendToCanvas().pointFromOrigin(origin),
          'blue',
          6
        );
        ctx.restore();
      });
      ctx.restore();
    }, 50);
  }

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

  /**
   * @param {TDegree} angle Angle value (in degrees)
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
}
