//@ts-nocheck

import {
  cos, sin
} from '../util';
import { BaseFilter } from "./base_filter.class";
import { ColorMatrix } from "./colormatrix_filter.class";


/**
 * HueRotation filter class
 * @class HueRotation
 * @memberOf fabric.Image.filters
 * @extends BaseFilter
 * @see {@link http://fabricjs.com/image-filters|ImageFilters demo}
 * @example
 * var filter = new HueRotation({
 *   rotation: -0.5
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
export class HueRotation extends ColorMatrix {

  /**
   * Filter type
   * @param {String} type
   * @default
   */
  type = 'HueRotation'

  /**
   * HueRotation value, from -1 to 1.
   * the unit is radians
   * @param {Number} myParameter
   * @default
   */
  rotation = 0

  /**
   * Describe the property that is the filter parameter
   * @param {String} m
   * @default
   */
  mainParameter = 'rotation'

  calculateMatrix() {
    var rad = this.rotation * Math.PI, cosValue = cos(rad), sinValue = sin(rad),
      aThird = 1 / 3, aThirdSqtSin = Math.sqrt(aThird) * sinValue, OneMinusCos = 1 - cosValue;
    this.matrix = [
      1, 0, 0, 0, 0,
      0, 1, 0, 0, 0,
      0, 0, 1, 0, 0,
      0, 0, 0, 1, 0
    ];
    this.matrix[0] = cosValue + OneMinusCos / 3;
    this.matrix[1] = aThird * OneMinusCos - aThirdSqtSin;
    this.matrix[2] = aThird * OneMinusCos + aThirdSqtSin;
    this.matrix[5] = aThird * OneMinusCos + aThirdSqtSin;
    this.matrix[6] = cosValue + aThird * OneMinusCos;
    this.matrix[7] = aThird * OneMinusCos - aThirdSqtSin;
    this.matrix[10] = aThird * OneMinusCos - aThirdSqtSin;
    this.matrix[11] = aThird * OneMinusCos + aThirdSqtSin;
    this.matrix[12] = cosValue + aThird * OneMinusCos;
  }

  /**
   * HueRotation isNeutralState implementation
   * Used only in image applyFilters to discard filters that will not have an effect
   * on the image
   * @param {Object} options
   **/
  isNeutralState(options) {
    this.calculateMatrix();
    return super.isNeutralState(options);
  }

  /**
   * Apply this filter to the input image data provided.
   *
   * Determines whether to use WebGL or Canvas2D based on the options.webgl flag.
   *
   * @param {Object} options
   * @param {Number} options.passes The number of filters remaining to be executed
   * @param {Boolean} options.webgl Whether to use webgl to render the filter.
   * @param {WebGLTexture} options.sourceTexture The texture setup as the source to be filtered.
   * @param {WebGLTexture} options.targetTexture The texture where filtered output should be drawn.
   * @param {WebGLRenderingContext} options.context The GL context used for rendering.
   * @param {Object} options.programCache A map of compiled shader programs, keyed by filter type.
   */
  applyTo(options) {
    this.calculateMatrix();
    super.applyTo(options);
  }

}
