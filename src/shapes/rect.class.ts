//@ts-nocheck
import { fabric } from '../../HEADER';
import { kRect } from '../constants';
/**
 * Rectangle class
 * @class Rect
 * @extends fabric.Object
 * @return {Rect} thisArg
 * @see {@link Rect#initialize} for constructor definition
 */
const Rect = fabric.util.createClass(
  fabric.Object,
  /** @lends Rect.prototype */ {
    /**
     * List of properties to consider when checking if state of an object is changed ({@link fabric.Object#hasStateChanged})
     * as well as for history (undo/redo) purposes
     * @type Array
     */
    stateProperties: fabric.Object.prototype.stateProperties.concat('rx', 'ry'),

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'rect',

    /**
     * Horizontal border radius
     * @type Number
     * @default
     */
    rx: 0,

    /**
     * Vertical border radius
     * @type Number
     * @default
     */
    ry: 0,

    cacheProperties: fabric.Object.prototype.cacheProperties.concat('rx', 'ry'),

    /**
     * Constructor
     * @param {Object} [options] Options object
     * @return {Object} thisArg
     */
    initialize: function (options) {
      this.callSuper('initialize', options);
      this._initRxRy();
    },

    /**
     * Initializes rx/ry attributes
     * @private
     */
    _initRxRy: function () {
      const { rx, ry } = this;
      if (rx && !ry) {
        this.ry = rx;
      } else if (ry && !rx) {
        this.rx = ry;
      }
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render: function (ctx) {
      // 1x1 case (used in spray brush) optimization was removed because
      // with caching and higher zoom level this makes more damage than help
      const { width: w, height: h } = this;
      const x = -w / 2;
      const y = -h / 2;
      const rx = this.rx ? Math.min(this.rx, w / 2) : 0;
      const ry = this.ry ? Math.min(this.ry, h / 2) : 0;
      const isRounded = rx !== 0 || ry !== 0;

      ctx.beginPath();

      ctx.moveTo(x + rx, y);

      ctx.lineTo(x + w - rx, y);
      isRounded &&
        ctx.bezierCurveTo(
          x + w - kRect * rx,
          y,
          x + w,
          y + kRect * ry,
          x + w,
          y + ry
        );

      ctx.lineTo(x + w, y + h - ry);
      isRounded &&
        ctx.bezierCurveTo(
          x + w,
          y + h - kRect * ry,
          x + w - kRect * rx,
          y + h,
          x + w - rx,
          y + h
        );

      ctx.lineTo(x + rx, y + h);
      isRounded &&
        ctx.bezierCurveTo(
          x + kRect * rx,
          y + h,
          x,
          y + h - kRect * ry,
          x,
          y + h - ry
        );

      ctx.lineTo(x, y + ry);
      isRounded &&
        ctx.bezierCurveTo(x, y + kRect * ry, x + kRect * rx, y, x + rx, y);

      ctx.closePath();

      this._renderPaintInOrder(ctx);
    },

    /**
     * Returns object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject: function (propertiesToInclude) {
      return this.callSuper(
        'toObject',
        ['rx', 'ry'].concat(propertiesToInclude)
      );
    },

    /* _TO_SVG_START_ */
    /**
     * Returns svg representation of an instance
     * @return {Array} an array of strings with the specific svg representation
     * of the instance
     */
    _toSVG: function () {
      const { width, height, rx, ry } = this;
      return [
        '<rect ',
        'COMMON_PARTS',
        'x="',
        -width / 2,
        '" y="',
        -height / 2,
        '" rx="',
        rx,
        '" ry="',
        ry,
        '" width="',
        width,
        '" height="',
        height,
        '" />\n',
      ];
    },
    /* _TO_SVG_END_ */
  }
);

/* _FROM_SVG_START_ */
/**
 * List of attribute names to account for when parsing SVG element (used by `Rect.fromElement`)
 * @static
 * @memberOf Rect
 * @see: http://www.w3.org/TR/SVG/shapes.html#RectElement
 */
Rect.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat(
  'x y rx ry width height'.split(' ')
);

/**
 * Returns {@link Rect} instance from an SVG element
 * @static
 * @memberOf Rect
 * @param {SVGElement} element Element to parse
 * @param {Function} callback callback function invoked after parsing
 * @param {Object} [options] Options object
 */
Rect.fromElement = function (element, callback, options = {}) {
  if (!element) {
    return callback(null);
  }
  const {
    left = 0,
    top = 0,
    width = 0,
    height = 0,
    visible = true,
    ...restOfparsedAttributes
  } = fabric.parseAttributes(element, Rect.ATTRIBUTE_NAMES);

  const rect = new Rect({
    ...options,
    ...restOfparsedAttributes,
    left,
    top,
    width,
    height,
    visible: Boolean(visible && width && height),
  });
  callback(rect);
};
/* _FROM_SVG_END_ */

/**
 * Returns {@link Rect} instance from an object representation
 * @static
 * @memberOf Rect
 * @param {Object} object Object to create an instance from
 * @returns {Promise<Rect>}
 */
Rect.fromObject = (object) => fabric.Object._fromObject(Rect, object);

fabric.Rect = Rect;
export { Rect };
