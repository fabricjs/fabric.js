import { Point } from '../../Point';
import type { Group } from '../Group';
import { TDegree, TOriginX, TOriginY } from '../../typedefs';
import { transformPoint } from '../../util/misc/matrix';
import { sizeAfterTransform } from '../../util/misc/objectTransforms';
import { degreesToRadians } from '../../util/misc/radiansDegreesConversion';
import { CommonMethods } from '../../CommonMethods';
import { resolveOrigin } from '../../util/misc/resolveOrigin';

export class ObjectOrigin<EventSpec> extends CommonMethods<EventSpec> {
  /**
   * Top position of an object. Note that by default it's relative to object top. You can change this by setting originY={top/center/bottom}
   * @type Number
   * @default 0
   */
  declare top: number;

  /**
   * Left position of an object. Note that by default it's relative to object left. You can change this by setting originX={left/center/right}
   * @type Number
   * @default 0
   */
  declare left: number;

  /**
   * Object width
   * @type Number
   * @default
   */
  declare width: number;

  /**
   * Object height
   * @type Number
   * @default
   */
  declare height: number;

  /**
   * Object scale factor (horizontal)
   * @type Number
   * @default 1
   */
  declare scaleX: number;

  /**
   * Object scale factor (vertical)
   * @type Number
   * @default 1
   */
  declare scaleY: number;

  /**
   * Angle of skew on x axes of an object (in degrees)
   * @type Number
   * @default 0
   */
  declare skewX: number;

  /**
   * Angle of skew on y axes of an object (in degrees)
   * @type Number
   * @default 0
   */
  declare skewY: number;

  /**
   * Horizontal origin of transformation of an object (one of "left", "right", "center")
   * See http://jsfiddle.net/1ow02gea/244/ on how originX/originY affect objects in groups
   * @type String
   * @default 'left'
   */
  declare originX: TOriginX;

  /**
   * Vertical origin of transformation of an object (one of "top", "bottom", "center")
   * See http://jsfiddle.net/1ow02gea/244/ on how originX/originY affect objects in groups
   * @type String
   * @default 'top'
   */
  declare originY: TOriginY;

  /**
   * Angle of rotation of an object (in degrees)
   * @type Number
   * @default 0
   */
  declare angle: TDegree;

  /**
   * Width of a stroke used to render this object
   * @type Number
   * @default 1
   */
  declare strokeWidth: number;

  /**
   * When `false`, the stoke width will scale with the object.
   * When `true`, the stroke will always match the exact pixel size entered for stroke width.
   * this Property does not work on Text classes or drawing call that uses strokeText,fillText methods
   * default to false
   * @since 2.6.0
   * @type Boolean
   * @default false
   * @type Boolean
   * @default false
   */
  declare strokeUniform: boolean;

  /**
   * Object containing this object.
   * can influence its size and position
   */
  declare group?: Group;

  declare _originalOriginX?: TOriginX;

  declare _originalOriginY?: TOriginY;

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
  _getTransformedDimensions(options: any = {}): Point {
    const dimOptions = {
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      skewX: this.skewX,
      skewY: this.skewY,
      width: this.width,
      height: this.height,
      strokeWidth: this.strokeWidth,
      ...options,
    };
    // stroke is applied before/after transformations are applied according to `strokeUniform`
    const strokeWidth = dimOptions.strokeWidth;
    let preScalingStrokeValue = strokeWidth,
      postScalingStrokeValue = 0;

    if (this.strokeUniform) {
      preScalingStrokeValue = 0;
      postScalingStrokeValue = strokeWidth;
    }
    const dimX = dimOptions.width + preScalingStrokeValue,
      dimY = dimOptions.height + preScalingStrokeValue,
      noSkew = dimOptions.skewX === 0 && dimOptions.skewY === 0;
    let finalDimensions;
    if (noSkew) {
      finalDimensions = new Point(
        dimX * dimOptions.scaleX,
        dimY * dimOptions.scaleY
      );
    } else {
      finalDimensions = sizeAfterTransform(dimX, dimY, dimOptions);
    }

    return finalDimensions.scalarAdd(postScalingStrokeValue);
  }

  /**
   * Translates the coordinates from a set of origin to another (based on the object's dimensions)
   * @param {Point} point The point which corresponds to the originX and originY params
   * @param {TOriginX} fromOriginX Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} fromOriginY Vertical origin: 'top', 'center' or 'bottom'
   * @param {TOriginX} toOriginX Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} toOriginY Vertical origin: 'top', 'center' or 'bottom'
   * @return {Point}
   */
  translateToGivenOrigin(
    point: Point,
    fromOriginX: TOriginX,
    fromOriginY: TOriginY,
    toOriginX: TOriginX,
    toOriginY: TOriginY
  ): Point {
    let x = point.x,
      y = point.y;
    const offsetX = resolveOrigin(toOriginX) - resolveOrigin(fromOriginX),
      offsetY = resolveOrigin(toOriginY) - resolveOrigin(fromOriginY);

    if (offsetX || offsetY) {
      const dim = this._getTransformedDimensions();
      x += offsetX * dim.x;
      y += offsetY * dim.y;
    }

    return new Point(x, y);
  }

  /**
   * Translates the coordinates from origin to center coordinates (based on the object's dimensions)
   * @param {Point} point The point which corresponds to the originX and originY params
   * @param {TOriginX} originX Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} originY Vertical origin: 'top', 'center' or 'bottom'
   * @return {Point}
   */
  translateToCenterPoint(
    point: Point,
    originX: TOriginX,
    originY: TOriginY
  ): Point {
    const p = this.translateToGivenOrigin(
      point,
      originX,
      originY,
      'center',
      'center'
    );
    if (this.angle) {
      return p.rotate(degreesToRadians(this.angle), point);
    }
    return p;
  }

  /**
   * Translates the coordinates from center to origin coordinates (based on the object's dimensions)
   * @param {Point} center The point which corresponds to center of the object
   * @param {OriginX} originX Horizontal origin: 'left', 'center' or 'right'
   * @param {OriginY} originY Vertical origin: 'top', 'center' or 'bottom'
   * @return {Point}
   */
  translateToOriginPoint(
    center: Point,
    originX: TOriginX,
    originY: TOriginY
  ): Point {
    const p = this.translateToGivenOrigin(
      center,
      'center',
      'center',
      originX,
      originY
    );
    if (this.angle) {
      return p.rotate(degreesToRadians(this.angle), center);
    }
    return p;
  }

  /**
   * Returns the center coordinates of the object relative to canvas
   * @return {Point}
   */
  getCenterPoint(): Point {
    const relCenter = this.getRelativeCenterPoint();
    return this.group
      ? transformPoint(relCenter, this.group.calcTransformMatrix())
      : relCenter;
  }

  /**
   * Returns the center coordinates of the object relative to it's parent
   * @return {Point}
   */
  getRelativeCenterPoint(): Point {
    return this.translateToCenterPoint(
      new Point(this.left, this.top),
      this.originX,
      this.originY
    );
  }

  /**
   * Returns the coordinates of the object as if it has a different origin
   * @param {TOriginX} originX Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} originY Vertical origin: 'top', 'center' or 'bottom'
   * @return {Point}
   */
  getPointByOrigin(originX: TOriginX, originY: TOriginY): Point {
    return this.translateToOriginPoint(
      this.getRelativeCenterPoint(),
      originX,
      originY
    );
  }

  /**
   * Sets the position of the object taking into consideration the object's origin
   * @param {Point} pos The new position of the object
   * @param {TOriginX} originX Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} originY Vertical origin: 'top', 'center' or 'bottom'
   * @return {void}
   */
  setPositionByOrigin(pos: Point, originX: TOriginX, originY: TOriginY) {
    const center = this.translateToCenterPoint(pos, originX, originY),
      position = this.translateToOriginPoint(
        center,
        this.originX,
        this.originY
      );
    this.set({ left: position.x, top: position.y });
  }

  /**
   * Sets the origin/position of the object to it's center point
   * @private
   * @return {void}
   */
  _setOriginToCenter() {
    this._originalOriginX = this.originX;
    this._originalOriginY = this.originY;

    const center = this.getRelativeCenterPoint();

    this.originX = 'center';
    this.originY = 'center';

    this.left = center.x;
    this.top = center.y;
  }

  /**
   * Resets the origin/position of the object to it's original origin
   * @private
   * @return {void}
   */
  _resetOrigin() {
    if (
      this._originalOriginX !== undefined &&
      this._originalOriginY !== undefined
    ) {
      const originPoint = this.translateToOriginPoint(
        this.getRelativeCenterPoint(),
        this._originalOriginX,
        this._originalOriginY
      );

      this.left = originPoint.x;
      this.top = originPoint.y;

      this.originX = this._originalOriginX;
      this.originY = this._originalOriginY;
      this._originalOriginX = undefined;
      this._originalOriginY = undefined;
    }
  }

  /**
   * @private
   */
  _getLeftTopCoords() {
    return this.translateToOriginPoint(
      this.getRelativeCenterPoint(),
      'left',
      'top'
    );
  }
}
