import { objectSpread2 as _objectSpread2 } from '../../../_virtual/_rollupPluginBabelHelpers.mjs';
import { Point } from '../../Point.mjs';
import { calcDimensionsMatrix, transformPoint } from '../../util/misc/matrix.mjs';
import { sizeAfterTransform } from '../../util/misc/objectTransforms.mjs';
import { degreesToRadians } from '../../util/misc/radiansDegreesConversion.mjs';
import { CommonMethods } from '../../CommonMethods.mjs';
import { resolveOrigin } from '../../util/misc/resolveOrigin.mjs';
import { CENTER, LEFT, TOP } from '../../constants.mjs';

class ObjectOrigin extends CommonMethods {
  /**
   * Object containing this object.
   * can influence its size and position
   */

  /**
   * Calculate object bounding box dimensions from its properties scale, skew.
   * This bounding box is aligned with object angle and not with canvas axis or screen.
   * @param {Object} [options]
   * @param {Number} [options.scaleX]
   * @param {Number} [options.scaleY]
   * @param {Number} [options.skewX]
   * @param {Number} [options.skewY]
   * @private
   * @returns {Point} dimensions
   */
  _getTransformedDimensions() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const dimOptions = _objectSpread2({
      // if scaleX or scaleY are negative numbers,
      // this will return dimensions that are negative.
      // and this will break assumptions around the codebase
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      skewX: this.skewX,
      skewY: this.skewY,
      width: this.width,
      height: this.height,
      strokeWidth: this.strokeWidth
    }, options);
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
      finalDimensions = new Point(dimX * dimOptions.scaleX, dimY * dimOptions.scaleY);
    } else {
      finalDimensions = sizeAfterTransform(dimX, dimY, calcDimensionsMatrix(dimOptions));
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
  translateToGivenOrigin(point, fromOriginX, fromOriginY, toOriginX, toOriginY) {
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
  translateToCenterPoint(point, originX, originY) {
    const p = this.translateToGivenOrigin(point, originX, originY, CENTER, CENTER);
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
  translateToOriginPoint(center, originX, originY) {
    const p = this.translateToGivenOrigin(center, CENTER, CENTER, originX, originY);
    if (this.angle) {
      return p.rotate(degreesToRadians(this.angle), center);
    }
    return p;
  }

  /**
   * Returns the center coordinates of the object relative to canvas
   * @return {Point}
   */
  getCenterPoint() {
    const relCenter = this.getRelativeCenterPoint();
    return this.group ? transformPoint(relCenter, this.group.calcTransformMatrix()) : relCenter;
  }

  /**
   * Returns the center coordinates of the object relative to it's parent
   * @return {Point}
   */
  getRelativeCenterPoint() {
    return this.translateToCenterPoint(new Point(this.left, this.top), this.originX, this.originY);
  }

  /**
   * Returns the coordinates of the object as if it has a different origin
   * @param {TOriginX} originX Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} originY Vertical origin: 'top', 'center' or 'bottom'
   * @return {Point}
   */
  getPointByOrigin(originX, originY) {
    return this.translateToOriginPoint(this.getRelativeCenterPoint(), originX, originY);
  }

  /**
   * Sets the position of the object taking into consideration the object's origin
   * @param {Point} pos The new position of the object
   * @param {TOriginX} originX Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} originY Vertical origin: 'top', 'center' or 'bottom'
   * @return {void}
   */
  setPositionByOrigin(pos, originX, originY) {
    const center = this.translateToCenterPoint(pos, originX, originY),
      position = this.translateToOriginPoint(center, this.originX, this.originY);
    this.set({
      left: position.x,
      top: position.y
    });
  }

  /**
   * @private
   */
  _getLeftTopCoords() {
    return this.translateToOriginPoint(this.getRelativeCenterPoint(), LEFT, TOP);
  }
}

export { ObjectOrigin };
//# sourceMappingURL=ObjectOrigin.mjs.map
