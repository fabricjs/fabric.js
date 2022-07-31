//@ts-nocheck

import { cacheProperties, halfPI, SHARED_ATTRIBUTES } from '../constants';
import { parseAttributes } from "../parser/_parser";
import { FabricObject } from './object.class';

/**
 * Ellipse class
 * @class Ellipse
 * @extends FabricObject
 */
export class Ellipse extends FabricObject {

  /**
   * Type of an object
   * @type String
   * @default
   */
  type = 'ellipse'

  /**
   * Horizontal radius
   * @type Number
   * @default
   */
  rx = 0

  /**
   * Vertical radius
   * @type Number
   * @default
   */
  ry = 0

  cacheProperties = cacheProperties.concat('rx', 'ry')

  /**
   * Constructor
   * @param {Object} [options] Options object
   * @return {Ellipse} thisArg
   */
  constructor(options) {
    super(options);
    this.set('rx', options && options.rx || 0);
    this.set('ry', options && options.ry || 0);
  }

  /**
   * @private
   * @param {String} key
   * @param {*} value
   * @return {Ellipse} thisArg
   */
  _set(key, value) {
    super._set(key, value);
    switch (key) {

      case 'rx':
        this.rx = value;
        this.set('width', value * 2);
        break;

      case 'ry':
        this.ry = value;
        this.set('height', value * 2);
        break;

    }
    return this;
  }

  /**
   * Returns horizontal radius of an object (according to how an object is scaled)
   * @return {Number}
   */
  getRx() {
    return this.get('rx') * this.get('scaleX');
  }

  /**
   * Returns Vertical radius of an object (according to how an object is scaled)
   * @return {Number}
   */
  getRy() {
    return this.get('ry') * this.get('scaleY');
  }

  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject(propertiesToInclude) {
    return super.toObject(['rx', 'ry'].concat(propertiesToInclude));
  }

  /* _TO_SVG_START_ */
  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    return [
      '<ellipse ', 'COMMON_PARTS',
      'cx="0" cy="0" ',
      'rx="', this.rx,
      '" ry="', this.ry,
      '" />\n'
    ];
  }
  /* _TO_SVG_END_ */

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx context to render on
   */
  _render(ctx) {
    ctx.beginPath();
    ctx.save();
    ctx.transform(1, 0, 0, this.ry / this.rx, 0, 0);
    ctx.arc(
      0,
      0,
      this.rx,
      0,
      halfPI,
      false);
    ctx.restore();
    this._renderPaintInOrder(ctx);
  }

  /* _FROM_SVG_START_ */
  /**
   * List of attribute names to account for when parsing SVG element (used by {@link Ellipse.fromElement})
   * @static
   * @memberOf Ellipse
   * @see http://www.w3.org/TR/SVG/shapes.html#EllipseElement
   */
  static ATTRIBUTE_NAMES = SHARED_ATTRIBUTES.concat('cx cy rx ry'.split(' '));

  /**
   * Returns {@link Ellipse} instance from an SVG element
   * @static
   * @memberOf Ellipse
   * @param {SVGElement} element Element to parse
   * @param {Function} [callback] Options callback invoked after parsing is finished
   * @return {Ellipse}
   */
  static fromElement(element, callback) {

    var parsedAttributes = parseAttributes(element, Ellipse.ATTRIBUTE_NAMES);

    parsedAttributes.left = (parsedAttributes.left || 0) - parsedAttributes.rx;
    parsedAttributes.top = (parsedAttributes.top || 0) - parsedAttributes.ry;
    callback(new Ellipse(parsedAttributes));
  };
  /* _FROM_SVG_END_ */

  /**
   * Returns {@link Ellipse} instance from an object representation
   * @static
   * @memberOf Ellipse
   * @param {Object} object Object to create an instance from
   * @returns {Promise<Ellipse>}
   */
  static fromObject(object) {
    return FabricObject._fromObject(Ellipse, object);
  };


}

