import { defineProperty as _defineProperty, objectSpread2 as _objectSpread2, objectWithoutProperties as _objectWithoutProperties } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { config } from '../config.mjs';
import { ifNaN } from '../util/internals/ifNaN.mjs';
import { uid } from '../util/internals/uid.mjs';
import { loadImage } from '../util/misc/objectEnlive.mjs';
import { pick } from '../util/misc/pick.mjs';
import { toFixed } from '../util/misc/toFixed.mjs';
import { classRegistry } from '../ClassRegistry.mjs';
import { log } from '../util/internals/console.mjs';

const _excluded = ["type", "source", "patternTransform"];

/**
 * @see {@link http://fabricjs.com/patterns demo}
 * @see {@link http://fabricjs.com/dynamic-patterns demo}
 */
class Pattern {
  /**
   * Legacy identifier of the class. Prefer using this.constructor.type 'Pattern'
   * or utils like isPattern, or instance of to indentify a pattern in your code.
   * Will be removed in future versiones
   * @TODO add sustainable warning message
   * @type string
   * @deprecated
   */
  get type() {
    return 'pattern';
  }
  set type(value) {
    log('warn', 'Setting type has no effect', value);
  }

  /**
   * @type PatternRepeat
   * @defaults
   */

  /**
   * transform matrix to change the pattern, imported from svgs.
   * @todo verify if using the identity matrix as default makes the rest of the code more easy
   * @type Array
   * @default
   */

  /**
   * The actual pixel source of the pattern
   */

  /**
   * If true, this object will not be exported during the serialization of a canvas
   * @type boolean
   */

  /**
   * ID used for SVG export functionalities
   * @type number
   */

  /**
   * Constructor
   * @param {Object} [options] Options object
   * @param {option.source} [source] the pattern source, eventually empty or a drawable
   */
  constructor(options) {
    _defineProperty(this, "repeat", 'repeat');
    /**
     * Pattern horizontal offset from object's left/top corner
     * @type Number
     * @default
     */
    _defineProperty(this, "offsetX", 0);
    /**
     * Pattern vertical offset from object's left/top corner
     * @type Number
     * @default
     */
    _defineProperty(this, "offsetY", 0);
    /**
     * @type TCrossOrigin
     * @default
     */
    _defineProperty(this, "crossOrigin", '');
    this.id = uid();
    Object.assign(this, options);
  }

  /**
   * @returns true if {@link source} is an <img> element
   */
  isImageSource() {
    return !!this.source && typeof this.source.src === 'string';
  }

  /**
   * @returns true if {@link source} is a <canvas> element
   */
  isCanvasSource() {
    return !!this.source && !!this.source.toDataURL;
  }
  sourceToString() {
    return this.isImageSource() ? this.source.src : this.isCanvasSource() ? this.source.toDataURL() : '';
  }

  /**
   * Returns an instance of CanvasPattern
   * @param {CanvasRenderingContext2D} ctx Context to create pattern
   * @return {CanvasPattern}
   */
  toLive(ctx) {
    if (
    // if the image failed to load, return, and allow rest to continue loading
    !this.source ||
    // if an image
    this.isImageSource() && (!this.source.complete || this.source.naturalWidth === 0 || this.source.naturalHeight === 0)) {
      return null;
    }
    return ctx.createPattern(this.source, this.repeat);
  }

  /**
   * Returns object representation of a pattern
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {object} Object representation of a pattern instance
   */
  toObject() {
    let propertiesToInclude = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    const {
      repeat,
      crossOrigin
    } = this;
    return _objectSpread2(_objectSpread2({}, pick(this, propertiesToInclude)), {}, {
      type: 'pattern',
      source: this.sourceToString(),
      repeat,
      crossOrigin,
      offsetX: toFixed(this.offsetX, config.NUM_FRACTION_DIGITS),
      offsetY: toFixed(this.offsetY, config.NUM_FRACTION_DIGITS),
      patternTransform: this.patternTransform ? [...this.patternTransform] : null
    });
  }

  /* _TO_SVG_START_ */
  /**
   * Returns SVG representation of a pattern
   */
  toSVG(_ref) {
    let {
      width,
      height
    } = _ref;
    const {
        source: patternSource,
        repeat,
        id
      } = this,
      patternOffsetX = ifNaN(this.offsetX / width, 0),
      patternOffsetY = ifNaN(this.offsetY / height, 0),
      patternWidth = repeat === 'repeat-y' || repeat === 'no-repeat' ? 1 + Math.abs(patternOffsetX || 0) : ifNaN(patternSource.width / width, 0),
      patternHeight = repeat === 'repeat-x' || repeat === 'no-repeat' ? 1 + Math.abs(patternOffsetY || 0) : ifNaN(patternSource.height / height, 0);
    return ["<pattern id=\"SVGID_".concat(id, "\" x=\"").concat(patternOffsetX, "\" y=\"").concat(patternOffsetY, "\" width=\"").concat(patternWidth, "\" height=\"").concat(patternHeight, "\">"), "<image x=\"0\" y=\"0\" width=\"".concat(patternSource.width, "\" height=\"").concat(patternSource.height, "\" xlink:href=\"").concat(this.sourceToString(), "\"></image>"), "</pattern>", ''].join('\n');
  }
  /* _TO_SVG_END_ */

  static async fromObject(_ref2, options) {
    let {
        type,
        source,
        patternTransform
      } = _ref2,
      otherOptions = _objectWithoutProperties(_ref2, _excluded);
    const img = await loadImage(source, _objectSpread2(_objectSpread2({}, options), {}, {
      crossOrigin: otherOptions.crossOrigin
    }));
    return new this(_objectSpread2(_objectSpread2({}, otherOptions), {}, {
      patternTransform: patternTransform && patternTransform.slice(0),
      source: img
    }));
  }
}
_defineProperty(Pattern, "type", 'Pattern');
classRegistry.setClass(Pattern);
// kept for compatibility reason
classRegistry.setClass(Pattern, 'pattern');

export { Pattern };
//# sourceMappingURL=Pattern.mjs.map
