import type {
  TBBox,
  TCornerPoint,
  TDegree,
  TMat2D,
  TOriginX,
  TOriginY,
} from '../../typedefs';
import { iMatrix } from '../../constants';
import { Intersection } from '../../Intersection';
import { Point } from '../../Point';
import { makeBoundingBoxFromPoints } from '../../util/misc/boundingBoxFromPoints';
import {
  composeMatrix,
  invertTransform,
  multiplyTransformMatrices,
  qrDecompose,
  transformPoint,
} from '../../util/misc/matrix';
import type { Canvas } from '../../canvas/Canvas';
import type { StaticCanvas } from '../../canvas/StaticCanvas';
import { ObjectOrigin } from './ObjectOrigin';
import { ObjectEvents } from '../../EventTypeDefs';
import { mapValues } from '../../util/internals';
import { degreesToRadians } from '../../util/misc/radiansDegreesConversion';
import { getUnitVector, rotateVector } from '../../util/misc/vectors';
import {
  sendPointToPlane,
  sendVectorToPlane,
} from '../../util/misc/planeChange';
import { projectStrokeOnPoints } from '../../util/misc/projectStroke';

type TLineDescriptor = {
  o: Point;
  d: Point;
};

type TBBoxLines = {
  topline: TLineDescriptor;
  leftline: TLineDescriptor;
  bottomline: TLineDescriptor;
  rightline: TLineDescriptor;
};

type TMatrixCache = {
  key: string;
  value: TMat2D;
};

type TACoords = TCornerPoint;

export class ObjectGeometry<
  EventSpec extends ObjectEvents = ObjectEvents
> extends ObjectOrigin<EventSpec> {
  /**
   * Describe object's corner position in canvas object absolute coordinates
   * properties are tl,tr,bl,br and describe the four main corner.
   * each property is an object with x, y, instance of Fabric.Point.
   * The coordinates depends from this properties: width, height, scaleX, scaleY
   * skewX, skewY, angle, strokeWidth, top, left.
   * Those coordinates are useful to understand where an object is. They get updated
   * with lineCoords or oCoords in interactive cases but they do not need to be updated when zoom or panning change.
   * The coordinates get updated with @method setCoords.
   * You can calculate them without updating with @method calcACoords();
   */
  declare cornerCoords: TACoords;

  /**
   * storage cache for object transform matrix
   */
  declare ownMatrixCache?: TMatrixCache;

  /**
   * storage cache for object full transform matrix
   */
  declare matrixCache?: TMatrixCache;

  /**
   * A Reference of the Canvas where the object is actually added
   * @type StaticCanvas | Canvas;
   * @default undefined
   * @private
   */
  declare canvas?: StaticCanvas | Canvas;

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
   * @returns {number} x position according to object's {@link originX} property in parent's coordinate plane\
   * if parent is canvas then this property is identical to {@link getX}
   */
  getRelativeX(): number {
    return this.left;
  }

  /**
   * @param {number} value x position according to object's {@link originX} property in parent's coordinate plane\
   * if parent is canvas then this method is identical to {@link setX}
   */
  setRelativeX(value: number) {
    this.left = value;
  }

  /**
   * @returns {number} y position according to object's {@link originY} property in parent's coordinate plane\
   * if parent is canvas then this property is identical to {@link getY}
   */
  getRelativeY(): number {
    return this.top;
  }

  /**
   * @param {number} value y position according to object's {@link originY} property in parent's coordinate plane\
   * if parent is canvas then this property is identical to {@link setY}
   */
  setRelativeY(value: number) {
    this.top = value;
  }

  /**
   * @returns {Point} x position according to object's {@link originX} {@link originY} properties in canvas coordinate plane
   */
  getXY(): Point {
    const relativePosition = this.getRelativeXY();
    return this.group
      ? transformPoint(relativePosition, this.group.calcTransformMatrix())
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
    if (this.group) {
      point = transformPoint(
        point,
        invertTransform(this.group.calcTransformMatrix())
      );
    }
    this.setRelativeXY(point, originX, originY);
  }

  /**
   * @returns {Point} x,y position according to object's {@link originX} {@link originY} properties in parent's coordinate plane
   */
  getRelativeXY(): Point {
    return new Point(this.left, this.top);
  }

  /**
   * As {@link setXY}, but in current parent's coordinate plane (the current group if any or the canvas)
   * @param {Point} point position according to object's {@link originX} {@link originY} properties in parent's coordinate plane
   * @param {TOriginX} [originX] Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} [originY] Vertical origin: 'top', 'center' or 'bottom'
   */
  setRelativeXY(point: Point, originX?: TOriginX, originY?: TOriginY) {
    this.setPositionByOrigin(
      point,
      originX || this.originX,
      originY || this.originY
    );
  }

  /**
   * return correct set of coordinates for intersection
   * this will return either aCoords or lineCoords.
   * @param {boolean} absolute will return aCoords if true or lineCoords
   * @param {boolean} calculate will calculate the coords or use the one
   * that are attached to the object instance
   * @return {Object} {tl, tr, br, bl} points
   */
  _getCoords(absolute = false, calculate = false): TCornerPoint {
    const from = this.needsViewportCoords()
      ? this.getViewportTransform()
      : undefined;
    const to = absolute ? undefined : this.getViewportTransform();
    if (calculate) {
      return mapValues(this.calcCoords(), (coord) =>
        sendPointToPlane(coord, from, to)
      );
    }
    // swapped this double if in place of setCoords();
    if (!this.cornerCoords) {
      this.cornerCoords = this.calcCoords();
    }
    return mapValues(this.cornerCoords, (coord) =>
      sendPointToPlane(coord, from, to)
    );
  }

  /**
   * return correct set of coordinates for intersection
   * this will return either aCoords or lineCoords.
   * The coords are returned in an array.
   * @param {boolean} absolute will return aCoords if true or lineCoords
   * @param {boolean} calculate will return aCoords if true or lineCoords
   * @return {Array} [tl, tr, br, bl] of points
   */
  getCoords(absolute = false, calculate = false): Point[] {
    const { tl, tr, br, bl } = this._getCoords(absolute, calculate);
    return [tl, tr, br, bl];
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
    absolute?: boolean,
    calculate?: boolean
  ): boolean {
    const coords = this.getCoords(absolute, calculate),
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
  intersectsWithObject(
    other: ObjectGeometry,
    absolute = false,
    calculate = false
  ): boolean {
    const intersection = Intersection.intersectPolygonPolygon(
      this.getCoords(absolute, calculate),
      other.getCoords(absolute, calculate)
    );
    return (
      intersection.status === 'Intersection' ||
      intersection.status === 'Coincident' ||
      other.isContainedWithinObject(this, absolute, calculate) ||
      this.isContainedWithinObject(other, absolute, calculate)
    );
  }

  /**
   * Checks if object is fully contained within area of another object
   * @param {Object} other Object to test
   * @param {Boolean} [absolute] use coordinates without viewportTransform
   * @param {Boolean} [calculate] use coordinates of current position instead of store ones
   * @return {Boolean} true if object is fully contained within area of another object
   */
  isContainedWithinObject(
    other: ObjectGeometry,
    absolute = false,
    calculate = false
  ): boolean {
    return other.containsPoints(
      this.getCoords(absolute, calculate),
      absolute,
      calculate
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
    absolute?: boolean,
    calculate?: boolean
  ): boolean {
    const boundingRect = this.getBoundingRect(absolute, calculate);
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
  containsPoint(point: Point, absolute = false, calculate = false) {
    return this.containsPoints([point], absolute, calculate);
  }

  /**
   * Checks if point is inside the object
   * @param {Point[]} points Points to check against
   * @param {Boolean} [absolute] use coordinates without viewportTransform
   * @param {Boolean} [calculate] use coordinates of current position instead of stored ones
   * @return {Boolean} true if points are inside the object
   */
  containsPoints(points: Point[], absolute = false, calculate = false) {
    const imageLines = this._getImageLines(
      this._getCoords(absolute, calculate)
    );
    return points.every((point) => {
      const xPoints = this._findCrossPoints(point, imageLines);
      // if xPoints is odd then point is inside the object
      return xPoints !== 0 && xPoints % 2 === 1;
    });
  }
  /**
   * Checks if object is contained within the canvas with current viewportTransform
   * the check is done stopping at first point that appears on screen
   * @param {Boolean} [calculate] use coordinates of current position instead of .aCoords
   * @return {Boolean} true if object is fully or partially contained within canvas
   */
  isOnScreen(calculate = false): boolean {
    if (!this.canvas) {
      return false;
    }
    const { tl, br } = this.canvas.vptCoords;
    const points = this.getCoords(true, calculate);
    // if some point is on screen, the object is on screen.
    if (
      points.some(
        (point) =>
          point.x <= br.x &&
          point.x >= tl.x &&
          point.y <= br.y &&
          point.y >= tl.y
      )
    ) {
      return true;
    }
    // no points on screen, check intersection with absolute coordinates
    if (this.intersectsWithRect(tl, br, true, calculate)) {
      return true;
    }
    return this._containsCenterOfCanvas(tl, br, calculate);
  }

  /**
   * Checks if the object contains the midpoint between canvas extremities
   * Does not make sense outside the context of isOnScreen and isPartiallyOnScreen
   * @private
   * @param {Point} pointTL Top Left point
   * @param {Point} pointBR Top Right point
   * @param {Boolean} calculate use coordinates of current position instead of stored ones
   * @return {Boolean} true if the object contains the point
   */
  private _containsCenterOfCanvas(
    pointTL: Point,
    pointBR: Point,
    calculate?: boolean
  ): boolean {
    // worst case scenario the object is so big that contains the screen
    const centerPoint = pointTL.midPointFrom(pointBR);
    return this.containsPoint(centerPoint, true, calculate);
  }

  /**
   * Checks if object is partially contained within the canvas with current viewportTransform
   * @param {Boolean} [calculate] use coordinates of current position instead of stored ones
   * @return {Boolean} true if object is partially contained within canvas
   */
  isPartiallyOnScreen(calculate?: boolean): boolean {
    if (!this.canvas) {
      return false;
    }
    const { tl, br } = this.canvas.vptCoords;
    if (this.intersectsWithRect(tl, br, true, calculate)) {
      return true;
    }
    const allPointsAreOutside = this.getCoords(true, calculate).every(
      (point) =>
        (point.x >= br.x || point.x <= tl.x) &&
        (point.y >= br.y || point.y <= tl.y)
    );
    return (
      allPointsAreOutside && this._containsCenterOfCanvas(tl, br, calculate)
    );
  }

  /**
   * Method that returns an object with the object edges in it, given the coordinates of the corners
   * @private
   * @param {Object} lineCoords or aCoords Coordinates of the object corners
   */
  _getImageLines({ tl, tr, bl, br }: TCornerPoint): TBBoxLines {
    const lines = {
      topline: {
        o: tl,
        d: tr,
      },
      rightline: {
        o: tr,
        d: br,
      },
      bottomline: {
        o: br,
        d: bl,
      },
      leftline: {
        o: bl,
        d: tl,
      },
    };

    // // debugging
    // if (this.canvas.contextTop) {
    //   this.canvas.contextTop.fillRect(lines.bottomline.d.x, lines.bottomline.d.y, 2, 2);
    //   this.canvas.contextTop.fillRect(lines.bottomline.o.x, lines.bottomline.o.y, 2, 2);
    //
    //   this.canvas.contextTop.fillRect(lines.leftline.d.x, lines.leftline.d.y, 2, 2);
    //   this.canvas.contextTop.fillRect(lines.leftline.o.x, lines.leftline.o.y, 2, 2);
    //
    //   this.canvas.contextTop.fillRect(lines.topline.d.x, lines.topline.d.y, 2, 2);
    //   this.canvas.contextTop.fillRect(lines.topline.o.x, lines.topline.o.y, 2, 2);
    //
    //   this.canvas.contextTop.fillRect(lines.rightline.d.x, lines.rightline.d.y, 2, 2);
    //   this.canvas.contextTop.fillRect(lines.rightline.o.x, lines.rightline.o.y, 2, 2);
    // }

    return lines;
  }

  /**
   * Helper method to determine how many cross points are between the 4 object edges
   * and the horizontal line determined by a point on canvas
   * @private
   * @param {Point} point Point to check
   * @param {Object} lines Coordinates of the object being evaluated
   * @return {number} number of crossPoint
   */
  _findCrossPoints(point: Point, lines: TBBoxLines): number {
    let xcount = 0;

    for (const lineKey in lines) {
      let xi;
      const iLine = lines[lineKey as keyof TBBoxLines];
      // optimization 1: line below point. no cross
      if (iLine.o.y < point.y && iLine.d.y < point.y) {
        continue;
      }
      // optimization 2: line above point. no cross
      if (iLine.o.y >= point.y && iLine.d.y >= point.y) {
        continue;
      }
      // optimization 3: vertical line case
      if (iLine.o.x === iLine.d.x && iLine.o.x >= point.x) {
        xi = iLine.o.x;
      }
      // calculate the intersection point
      else {
        const b1 = 0;
        const b2 = (iLine.d.y - iLine.o.y) / (iLine.d.x - iLine.o.x);
        const a1 = point.y - b1 * point.x;
        const a2 = iLine.o.y - b2 * iLine.o.x;

        xi = -(a1 - a2) / (b1 - b2);
      }
      // don't count xi < point.x cases
      if (xi >= point.x) {
        xcount += 1;
      }
      // optimization 4: specific for square images
      if (xcount === 2) {
        break;
      }
    }
    return xcount;
  }

  /**
   * Returns coordinates of object's bounding rectangle (left, top, width, height)
   * the box is intended as aligned to axis of canvas.
   * @param {Boolean} [absolute] use coordinates without viewportTransform
   * @param {Boolean} [calculate] use coordinates of current position instead of .lineCoords / .aCoords
   * @return {Object} Object with left, top, width, height properties
   */
  getBoundingRect(absolute?: boolean, calculate?: boolean): TBBox {
    return makeBoundingBoxFromPoints(this.getCoords(absolute, calculate));
  }

  /**
   * Returns width of an object's bounding box counting transformations
   * @todo shouldn't this account for group transform and return the actual size in canvas coordinate plane?
   * @return {Number} width value
   */
  getScaledWidth(): number {
    return this._getTransformedDimensions().x;
  }

  /**
   * Returns height of an object bounding box counting transformations
   * @todo shouldn't this account for group transform and return the actual size in canvas coordinate plane?
   * @return {Number} height value
   */
  getScaledHeight(): number {
    return this._getTransformedDimensions().y;
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
   * Scales an object to a given width, with respect to bounding box (scaling by x/y equally)
   * @param {Number} value New width value
   * @param {Boolean} absolute ignore viewport
   * @return {void}
   */
  scaleToWidth(value: number, absolute?: boolean) {
    // adjust to bounding rect factor so that rotated shapes would fit as well
    const boundingRectFactor =
      this.getBoundingRect(absolute).width / this.getScaledWidth();
    return this.scale(value / this.width / boundingRectFactor);
  }

  /**
   * Scales an object to a given height, with respect to bounding box (scaling by x/y equally)
   * @param {Number} value New height value
   * @param {Boolean} absolute ignore viewport
   * @return {void}
   */
  scaleToHeight(value: number, absolute = false) {
    // adjust to bounding rect factor so that rotated shapes would fit as well
    const boundingRectFactor =
      this.getBoundingRect(absolute).height / this.getScaledHeight();
    return this.scale(value / this.height / boundingRectFactor);
  }

  getCanvasRetinaScaling() {
    return this.canvas?.getRetinaScaling() || 1;
  }

  /**
   * Returns the object angle relative to canvas counting also the group property
   * @returns {TDegree}
   */
  getTotalAngle(): TDegree {
    const { flipX, flipY } = this;
    this.flipX = false;
    this.flipY = false;
    const { angle } = qrDecompose(this.calcTransformMatrix());
    this.flipX = flipX;
    this.flipY = flipY;
    return angle;
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

  protected needsViewportCoords() {
    return this.strokeUniform || !this.padding;
  }

  protected calcDimensionsVector(
    origin = new Point(1, 1),
    {
      // origin = new Point(1, 1),
      applyViewportTransform = this.needsViewportCoords(),
    }: {
      // origin?: Point;
      applyViewportTransform?: boolean;
    } = {}
  ) {
    const vpt = applyViewportTransform ? this.getViewportTransform() : iMatrix;
    const dimVector = origin
      .multiply(new Point(this.width, this.height))
      .scalarAdd(!this.strokeUniform ? this.strokeWidth * 2 : 0)
      .transform(
        multiplyTransformMatrices(vpt, this.calcTransformMatrix()),
        true
      );
    const strokeUniformVector = getUnitVector(dimVector).scalarMultiply(
      this.strokeUniform ? this.strokeWidth * 2 : 0
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
      .add(
        this.calcDimensionsVector(origin, { origin, applyViewportTransform })
      )
      .add(offsetVector);
  }

  /**
   * Calculates the coordinates of the 4 corner of the bbox
   * @return {TCornerPoint}
   */
  calcCoords(): TCornerPoint {
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

  /**
   * Sets corner and controls position coordinates based on current angle, width and height, left and top.
   * aCoords are used to quickly find an object on the canvas
   * See {@link https://github.com/fabricjs/fabric.js/wiki/When-to-call-setCoords} and {@link http://fabricjs.com/fabric-gotchas}
   */
  setCoords(): void {
    this.cornerCoords = this.calcCoords();
    // debug code
    setTimeout(() => {
      const canvas = this.canvas;
      if (!canvas) return;
      const ctx = canvas.contextTop;
      canvas.clearContext(ctx);
      ctx.fillStyle = 'blue';
      Object.keys(this.cornerCoords).forEach((key) => {
        const control = this.cornerCoords[key];
        ctx.beginPath();
        ctx.ellipse(control.x, control.y, 6, 6, 0, 0, 360);
        ctx.closePath();
        ctx.fill();
      });
    }, 50);
  }

  transformMatrixKey(skipGroup = false): string {
    const sep = '_';
    let prefix = '';
    if (!skipGroup && this.group) {
      prefix = this.group.transformMatrixKey(skipGroup) + sep;
    }
    return (
      prefix +
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
      this.strokeWidth +
      this.flipX +
      this.flipY
    );
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

  /**
   * Calculate object dimensions from its properties
   * @deprecated
   * @private
   * @returns {Point} dimensions
   */
  _getNonTransformedDimensions(): Point {
    return new Point(this.width, this.height).scalarAdd(this.strokeWidth);
  }

  /**
   * Calculate object bounding box dimensions from its properties scale, skew.
   * @deprecated
   * @param {Object} [options]
   * @param {Number} [options.scaleX]
   * @param {Number} [options.scaleY]
   * @param {Number} [options.skewX]
   * @param {Number} [options.skewY]
   * @private
   * @returns {Point} dimensions
   */
  _getTransformedDimensions1(options: any = {}): Point {
    return sendVectorToPlane(
      this.calcDimensionsVector(/*new Point(options.width||)*/),
      this.group?.calcTransformMatrix(),
      composeMatrix({
        scaleX: this.scaleX,
        scaleY: this.scaleY,
        skewX: this.skewX,
        skewY: this.skewY,
        ...options,
      })
    );
  }

  /**
   * Calculate object dimensions for controls box, including padding and canvas zoom.
   * and active selection
   * @deprecated
   * @private
   * @param {object} [options] transform options
   * @returns {Point} dimensions
   */
  _calculateCurrentDimensions(options?: any): Point {
    return this._getTransformedDimensions(options)
      .transform(this.getViewportTransform(), true)
      .scalarAdd(2 * this.padding);
  }
}
