import type { TBoundingBox } from '../util/misc/boundingBoxFromPoints';
import { Intersection, IntersectionType } from '../intersection.class';
import { IPoint, Point } from '../point.class';
import { TMat2D, TOriginX, TOriginY } from '../typedefs';
import { CommonMethods } from './shared_methods.mixin';
import { calcRotateMatrix, invertTransform, multiplyTransformMatrices, qrDecompose, transformPoint } from '../util/misc/matrix';
import { cos } from '../util/misc/cos';
import { sin } from '../util/misc/sin';
import { FabricObject } from '../shapes/object.class';
import { makeBoundingBoxFromPoints } from '../util/misc/boundingBoxFromPoints';
import { degreesToRadians } from '../util/misc/radiansDegreesConversion';

type TCornerPoint = {
  tl: Point,
  tr: Point,
  bl: Point,
  br: Point,
}

type TOCoord = IPoint & {
  corner: TCornerPoint
};

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

type TControlSet = Record<string, Control>

type TACoords = TCornerPoint;

export class ObjectGeometry extends CommonMethods {
  /**
   * Describe object's corner position in canvas element coordinates.
   * properties are depending on control keys and padding the main controls.
   * each property is an object with x, y and corner.
   * The `corner` property contains in a similar manner the 4 points of the
   * interactive area of the corner.
   * The coordinates depends from the controls positionHandler and are used
   * to draw and locate controls
   * @memberOf fabric.Object.prototype
   */
  oCoords: Record<string, TOCoord> = {}

  /**
   * Describe object's corner position in canvas object absolute coordinates
   * properties are tl,tr,bl,br and describe the four main corner.
   * each property is an object with x, y, instance of Fabric.Point.
   * The coordinates depends from this properties: width, height, scaleX, scaleY
   * skewX, skewY, angle, strokeWidth, top, left.
   * Those coordinates are useful to understand where an object is. They get updated
   * with oCoords but they do not need to be updated when zoom or panning change.
   * The coordinates get updated with @method setCoords.
   * You can calculate them without updating with @method calcACoords();
   * @memberOf fabric.Object.prototype
   */
  aCoords: TACoords

  /**
   * Describe object's corner position in canvas element coordinates.
   * includes padding. Used of object detection.
   * set and refreshed with setCoords.
   * Those could go away
   * @todo investigate how to get rid of those
   * @memberOf fabric.Object.prototype
   */
  lineCoords: TCornerPoint

  /**
   * storage for object transform matrix
   */
  ownMatrixCache?: TMat2D

  /**
   * storage for object full transform matrix
   */
  matrixCache?: TMat2D

  /**
   * custom controls interface
   * controls are added by default_controls.js
   */
  controls: TControlSet = {}

  /**
   * @returns {number} x position according to object's {@link fabric.Object#originX} property in canvas coordinate plane
   */
  getX(): number {
    return this.getXY().x;
  }

  /**
   * @param {number} value x position according to object's {@link fabric.Object#originX} property in canvas coordinate plane
   */
  setX(value: number) {
    this.setXY(this.getXY().setX(value));
  }

  /**
   * @returns {number} y position according to object's {@link fabric.Object#originY} property in canvas coordinate plane
   */
  getY(): number {
    return this.getXY().y;
  }

  /**
   * @param {number} value y position according to object's {@link fabric.Object#originY} property in canvas coordinate plane
   */
  setY(value: number) {
    this.setXY(this.getXY().setY(value));
  }

  /**
   * @returns {number} x position according to object's {@link fabric.Object#originX} property in parent's coordinate plane\
   * if parent is canvas then this property is identical to {@link fabric.Object#getX}
   */
  getRelativeX(): number {
    return this.left;
  }

  /**
   * @param {number} value x position according to object's {@link fabric.Object#originX} property in parent's coordinate plane\
   * if parent is canvas then this method is identical to {@link fabric.Object#setX}
   */
  setRelativeX(value: number) {
    this.left = value;
  }

  /**
   * @returns {number} y position according to object's {@link fabric.Object#originY} property in parent's coordinate plane\
   * if parent is canvas then this property is identical to {@link fabric.Object#getY}
   */
  getRelativeY(): number {
    return this.top;
  }

  /**
   * @param {number} value y position according to object's {@link fabric.Object#originY} property in parent's coordinate plane\
   * if parent is canvas then this property is identical to {@link fabric.Object#setY}
   */
  setRelativeY(value: number) {
    this.top = value;
  }

  /**
   * @returns {Point} x position according to object's {@link fabric.Object#originX} {@link fabric.Object#originY} properties in canvas coordinate plane
   */
  getXY(): Point {
    const relativePosition = this.getRelativeXY();
    return this.group
      ? transformPoint(
          relativePosition,
          this.group.calcTransformMatrix()
        )
      : relativePosition;
  }

  /**
   * Set an object position to a particular point, the point is intended in absolute ( canvas ) coordinate.
   * You can specify {@link fabric.Object#originX} and {@link fabric.Object#originY} values,
   * that otherwise are the object's current values.
   * @example <caption>Set object's bottom left corner to point (5,5) on canvas</caption>
   * object.setXY(new Point(5, 5), 'left', 'bottom').
   * @param {Point} point position in canvas coordinate plane
   * @param {TOriginX} [originX] Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} [originY] Vertical origin: 'top', 'center' or 'bottom'
   */
  setXY(point: Point, originX: TOriginX, originY: TOriginY) {
    if (this.group) {
      point = transformPoint(
        point,
        invertTransform(this.group.calcTransformMatrix())
      );
    }
    this.setRelativeXY(point, originX, originY);
  }

  /**
   * @returns {Point} x,y position according to object's {@link fabric.Object#originX} {@link fabric.Object#originY} properties in parent's coordinate plane
   */
  getRelativeXY(): Point {
    return new Point(this.left, this.top);
  }

  /**
   * As {@link fabric.Object#setXY}, but in current parent's coordinate plane ( the current group if any or the canvas)
   * @param {Point} point position according to object's {@link fabric.Object#originX} {@link fabric.Object#originY} properties in parent's coordinate plane
   * @param {TOriginX} [originX] Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} [originY] Vertical origin: 'top', 'center' or 'bottom'
   */
  setRelativeXY(point: Point, originX: TOriginX, originY: TOriginY) {
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
    if (calculate) {
      return absolute ? this.calcACoords() : this.calcLineCoords();
    }
    if (!this.aCoords || !this.lineCoords) {
      this.setCoords(true);
    }
    return absolute ? this.aCoords : this.lineCoords;
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
    const coords = [tl, tr, br, bl];
    if (this.group) {
      const t = this.group.calcTransformMatrix();
      return coords.map((p) => transformPoint(p, t));
    }
    return coords;
  }

  /**
   * Checks if object intersects with an area formed by 2 points
   * @param {Object} pointTL top-left point of area
   * @param {Object} pointBR bottom-right point of area
   * @param {Boolean} [absolute] use coordinates without viewportTransform
   * @param {Boolean} [calculate] use coordinates of current position instead of .oCoords
   * @return {Boolean} true if object intersects with an area formed by 2 points
   */
  intersectsWithRect(pointTL: Point, pointBR: Point, absolute: boolean, calculate: boolean): boolean {
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
   * @param {Boolean} [calculate] use coordinates of current position instead of .oCoords
   * @return {Boolean} true if object intersects with another object
   */
  intersectsWithObject(other: FabricObject, absolute: boolean, calculate: boolean): boolean {
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
   * @param {Boolean} [calculate] use coordinates of current position instead of .oCoords
   * @return {Boolean} true if object is fully contained within area of another object
   */
  isContainedWithinObject(other: FabricObject, absolute: boolean, calculate: boolean): boolean {
    const points = this.getCoords(absolute, calculate),
      otherCoords = absolute ? other.aCoords : other.lineCoords,
      lines = other._getImageLines(otherCoords);
    for (let i = 0; i < 4; i++) {
      if (!other.containsPoint(points[i], lines)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Checks if object is fully contained within area formed by 2 points
   * @param {Object} pointTL top-left point of area
   * @param {Object} pointBR bottom-right point of area
   * @param {Boolean} [absolute] use coordinates without viewportTransform
   * @param {Boolean} [calculate] use coordinates of current position instead of .oCoords
   * @return {Boolean} true if object is fully contained within area formed by 2 points
   */
  isContainedWithinRect(pointTL: Point, pointBR: Point, absolute: boolean, calculate: boolean): boolean {
    const boundingRect = this.getBoundingRect(absolute, calculate);
    return (
      boundingRect.left >= pointTL.x &&
      boundingRect.left + boundingRect.width <= pointBR.x &&
      boundingRect.top >= pointTL.y &&
      boundingRect.top + boundingRect.height <= pointBR.y
    );
  }

  /**
   * Checks if point is inside the object
   * @param {Point} point Point to check against
   * @param {Object} [lines] object returned from @method _getImageLines
   * @param {Boolean} [absolute] use coordinates without viewportTransform
   * @param {Boolean} [calculate] use coordinates of current position instead of .oCoords
   * @return {Boolean} true if point is inside the object
   */
  containsPoint(point: Point, lines: TBBoxLines | undefined, absolute: boolean, calculate: boolean): boolean {
    const coords = this._getCoords(absolute, calculate),
      imageLines = lines || this._getImageLines(coords),
      xPoints = this._findCrossPoints(point, imageLines);
    // if xPoints is odd then point is inside the object
    return xPoints !== 0 && xPoints % 2 === 1;
  }

  /**
   * Checks if object is contained within the canvas with current viewportTransform
   * the check is done stopping at first point that appears on screen
   * @param {Boolean} [calculate] use coordinates of current position instead of .aCoords
   * @return {Boolean} true if object is fully or partially contained within canvas
   */
  isOnScreen(calculate: boolean): boolean {
    if (!this.canvas) {
      return false;
    }
    const { tl, br } = this.canvas.vptCoords;
    const points = this.getCoords(true, calculate);
    // if some point is on screen, the object is on screen.
    if (
      points.some((point) => (
          point.x <= br.x &&
          point.x >= tl.x &&
          point.y <= br.y &&
          point.y >= tl.y
        ))
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
   * @param {Boolean} calculate use coordinates of current position instead of .oCoords
   * @return {Boolean} true if the object contains the point
   */
  _containsCenterOfCanvas(pointTL: Point, pointBR: Point, calculate: boolean): boolean {
    // worst case scenario the object is so big that contains the screen
    const centerPoint = pointTL.midPointFrom(pointBR);
    return this.containsPoint(centerPoint, undefined, true, calculate);
  }

  /**
   * Checks if object is partially contained within the canvas with current viewportTransform
   * @param {Boolean} [calculate] use coordinates of current position instead of .oCoords
   * @return {Boolean} true if object is partially contained within canvas
   */
  isPartiallyOnScreen(calculate: boolean): boolean {
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
      allPointsAreOutside &&
      this._containsCenterOfCanvas(tl, br, calculate)
    );
  }

  /**
   * Method that returns an object with the object edges in it, given the coordinates of the corners
   * @private
   * @param {Object} oCoords Coordinates of the object corners
   */
  _getImageLines({ tl, tr, bl, br}: TCornerPoint): TBBoxLines {
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
      const iLine = lines[(lineKey as keyof TBBoxLines)];
      // optimisation 1: line below point. no cross
      if (iLine.o.y < point.y && iLine.d.y < point.y) {
        continue;
      }
      // optimisation 2: line above point. no cross
      if (iLine.o.y >= point.y && iLine.d.y >= point.y) {
        continue;
      }
      // optimisation 3: vertical line case
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
      // dont count xi < point.x cases
      if (xi >= point.x) {
        xcount += 1;
      }
      // optimisation 4: specific for square images
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
   * @param {Boolean} [calculate] use coordinates of current position instead of .oCoords / .aCoords
   * @return {Object} Object with left, top, width, height properties
   */
  getBoundingRect(absolute?: boolean, calculate?: boolean): TBoundingBox {
    return makeBoundingBoxFromPoints(this.getCoords(absolute, calculate));
  }

  /**
   * Returns width of an object's bounding box counting transformations
   * before 2.0 it was named getWidth();
   * consider calling this._getTransformedDimensions if you need both width and height
   * @return {Number} width value
   */
  getScaledWidth(): number {
    return this._getTransformedDimensions().x;
  }

  /**
   * Returns height of an object bounding box counting transformations
   * before 2.0 it was named getHeight();
   * consider calling this._getTransformedDimensions if you need both width and height
   * @return {Number} height value
   */
  getScaledHeight(): number {
    return this._getTransformedDimensions().y;
  }

  /**
   * Makes sure the scale is valid and modifies it if necessary
   * todo: this is a control action issue, not a geometry one
   * @private
   * @param {Number} value, unconstrained
   * @return {Number} constrained value;
   */
  _constrainScale(value: number): number {
    if (Math.abs(value) < this.minScaleLimit) {
      if (value < 0) {
        return -this.minScaleLimit;
      } else {
        return this.minScaleLimit;
      }
    } else if (value === 0) {
      return 0.0001;
    }
    return value;
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
  scaleToWidth(value: number, absolute: boolean) {
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

  calcLineCoords(): TCornerPoint {
    const vpt = this.getViewportTransform(),
      padding = this.padding,
      angle = degreesToRadians(this.getTotalAngle()),
      cosP = cos(angle) * padding,
      sinP = sin(angle) * padding,
      cosPSinP = cosP + sinP,
      cosPMinusSinP = cosP - sinP,
      { tl, tr, bl, br } = this.calcACoords();

    const lineCoords: TCornerPoint = {
      tl: transformPoint(tl, vpt),
      tr: transformPoint(tr, vpt),
      bl: transformPoint(bl, vpt),
      br: transformPoint(br, vpt),
    };

    if (padding) {
      lineCoords.tl.x -= cosPMinusSinP;
      lineCoords.tl.y -= cosPSinP;
      lineCoords.tr.x += cosPSinP;
      lineCoords.tr.y -= cosPMinusSinP;
      lineCoords.bl.x -= cosPSinP;
      lineCoords.bl.y += cosPMinusSinP;
      lineCoords.br.x += cosPMinusSinP;
      lineCoords.br.y += cosPSinP;
    }

    return lineCoords;
  }

  /**
   * Scales an object to a given height, with respect to bounding box (scaling by x/y equally)
   * @param {Number} value New height value
   * @param {Boolean} absolute ignore viewport
   * @return {Record<string, TCornerPoint>}
   */
  calcOCoords(): TOCoord {
    let vpt = this.getViewportTransform(),
      center = this.getCenterPoint(),
      tMatrix = [1, 0, 0, 1, center.x, center.y],
      rMatrix = calcRotateMatrix({
        angle:
          this.getTotalAngle() - (!!this.group && this.flipX ? 180 : 0),
      }),
      positionMatrix = multiplyTransformMatrices(tMatrix, rMatrix),
      startMatrix = multiplyTransformMatrices(vpt, positionMatrix),
      finalMatrix = multiplyTransformMatrices(startMatrix, [
        1 / vpt[0],
        0,
        0,
        1 / vpt[3],
        0,
        0,
      ]),
      transformOptions = this.group
        ? qrDecompose(this.calcTransformMatrix())
        : undefined,
      dim = this._calculateCurrentDimensions(transformOptions),
      coords = {};
    this.forEachControl(function (control, key, fabricObject) {
      coords[key] = control.positionHandler(dim, finalMatrix, fabricObject);
    });

    // debug code
    /*
    var canvas = this.canvas;
  setTimeout(function () {
    if (!canvas) return;
      canvas.contextTop.clearRect(0, 0, 700, 700);
      canvas.contextTop.fillStyle = 'green';
      Object.keys(coords).forEach(function(key) {
        var control = coords[key];
        canvas.contextTop.fillRect(control.x, control.y, 3, 3);
      });
    } 50);
  */
    return coords;
  }

  calcACoords() {
    var rotateMatrix = util.calcRotateMatrix({ angle: this.angle }),
      center = this.getRelativeCenterPoint(),
      translateMatrix = [1, 0, 0, 1, center.x, center.y],
      finalMatrix = multiplyMatrices(translateMatrix, rotateMatrix),
      dim = this._getTransformedDimensions(),
      w = dim.x / 2,
      h = dim.y / 2;
    return {
      // corners
      tl: transformPoint({ x: -w, y: -h }, finalMatrix),
      tr: transformPoint({ x: w, y: -h }, finalMatrix),
      bl: transformPoint({ x: -w, y: h }, finalMatrix),
      br: transformPoint({ x: w, y: h }, finalMatrix),
    };
  }

  /**
   * Sets corner and controls position coordinates based on current angle, width and height, left and top.
   * oCoords are used to find the corners
   * aCoords are used to quickly find an object on the canvas
   * lineCoords are used to quickly find object during pointer events.
   * See {@link https://github.com/fabricjs/fabric.js/wiki/When-to-call-setCoords} and {@link http://fabricjs.com/fabric-gotchas}
   *
   * @param {Boolean} [skipCorners] skip calculation of oCoords.
   * @return {fabric.Object} thisArg
   * @chainable
   */
  setCoords(skipCorners = false) {
    this.aCoords = this.calcACoords();
    // in case we are in a group, for how the inner group target check works,
    // lineCoords are exactly aCoords. Since the vpt gets absorbed by the normalized pointer.
    this.lineCoords = this.group ? this.aCoords : this.calcLineCoords();
    if (skipCorners) {
      return this;
    }
    // set coordinates of the draggable boxes in the corners used to scale/rotate the image
    this.oCoords = this.calcOCoords();
    this._setCornerCoords && this._setCornerCoords();
    return this;
  }

  transformMatrixKey(skipGroup) {
    var sep = '_',
      prefix = '';
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
   * @return {Array} transform matrix for the object
   */
  calcTransformMatrix(skipGroup) {
    var matrix = this.calcOwnMatrix();
    if (skipGroup || !this.group) {
      return matrix;
    }
    var key = this.transformMatrixKey(skipGroup),
      cache = this.matrixCache || (this.matrixCache = {});
    if (cache.key === key) {
      return cache.value;
    }
    if (this.group) {
      matrix = multiplyMatrices(
        this.group.calcTransformMatrix(false),
        matrix
      );
    }
    cache.key = key;
    cache.value = matrix;
    return matrix;
  }

  /**
   * calculate transform matrix that represents the current transformations from the
   * object's properties, this matrix does not include the group transformation
   * @return {Array} transform matrix for the object
   */
  calcOwnMatrix() {
    var key = this.transformMatrixKey(true),
      cache = this.ownMatrixCache || (this.ownMatrixCache = {});
    if (cache.key === key) {
      return cache.value;
    }
    var center = this.getRelativeCenterPoint(),
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
      };
    cache.key = key;
    cache.value = util.composeMatrix(options);
    return cache.value;
  }

  /**
   * Calculate object dimensions from its properties
   * @private
   * @returns {Point} dimensions
   */
  _getNonTransformedDimensions() {
    return new Point(this.width, this.height).scalarAdd(this.strokeWidth);
  }

  /**
   * Calculate object bounding box dimensions from its properties scale, skew.
   * @param {Object} [options]
   * @param {Number} [options.scaleX]
   * @param {Number} [options.scaleY]
   * @param {Number} [options.skewX]
   * @param {Number} [options.skewY]
   * @private
   * @returns {Point} dimensions
   */
  _getTransformedDimensions(options) {
    options = Object.assign(
      {
        scaleX: this.scaleX,
        scaleY: this.scaleY,
        skewX: this.skewX,
        skewY: this.skewY,
        width: this.width,
        height: this.height,
        strokeWidth: this.strokeWidth,
      },
      options || {}
    );
    //  stroke is applied before/after transformations are applied according to `strokeUniform`
    var preScalingStrokeValue,
      postScalingStrokeValue,
      strokeWidth = options.strokeWidth;
    if (this.strokeUniform) {
      preScalingStrokeValue = 0;
      postScalingStrokeValue = strokeWidth;
    } else {
      preScalingStrokeValue = strokeWidth;
      postScalingStrokeValue = 0;
    }
    var dimX = options.width + preScalingStrokeValue,
      dimY = options.height + preScalingStrokeValue,
      finalDimensions,
      noSkew = options.skewX === 0 && options.skewY === 0;
    if (noSkew) {
      finalDimensions = new Point(
        dimX * options.scaleX,
        dimY * options.scaleY
      );
    } else {
      var bbox = util.sizeAfterTransform(dimX, dimY, options);
      finalDimensions = new Point(bbox.x, bbox.y);
    }

    return finalDimensions.scalarAdd(postScalingStrokeValue);
  }

  /**
   * Calculate object dimensions for controls box, including padding and canvas zoom.
   * and active selection
   * @private
   * @param {object} [options] transform options
   * @returns {Point} dimensions
   */
  _calculateCurrentDimensions(options) {
    var vpt = this.getViewportTransform(),
      dim = this._getTransformedDimensions(options),
      p = transformPoint(dim, vpt, true);
    return p.scalarAdd(2 * this.padding);
  }
}
