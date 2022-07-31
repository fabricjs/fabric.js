//@ts-nocheck

import { cacheProperties, SHARED_ATTRIBUTES } from '../constants';
import {
  cos,
  degreesToRadians, sin
} from '../util';
import { parseAttributes } from "../parser/_parser";
import { FabricObject } from './object.class';

function isValidRadius(attributes) {
  return (('radius' in attributes) && (attributes.radius >= 0));
}

/**
 * Circle class
 * @class Circle
 * @extends FabricObject
 */
export class Circle extends FabricObject {

  /**
   * Type of an object
   * @type String
   * @default
   */
  type = 'circle'

  /**
   * Radius of this circle
   * @type Number
   * @default
   */
  radius = 0

  /**
   * degrees of start of the circle.
   * probably will change to degrees in next major version
   * @type Number 0 - 359
   * @default 0
   */
  startAngle = 0

  /**
   * End angle of the circle
   * probably will change to degrees in next major version
   * @type Number 1 - 360
   * @default 360
   */
  endAngle = 360

  cacheProperties = cacheProperties.concat('radius', 'startAngle', 'endAngle')

  /**
   * @private
   * @param {String} key
   * @param {*} value
   * @return {Circle} thisArg
   */
  _set(key, value) {
    super._set(key, value);

    if (key === 'radius') {
      this.setRadius(value);
    }

    return this;
  }

  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject(propertiesToInclude) {
    return super.toObject(['radius', 'startAngle', 'endAngle'].concat(propertiesToInclude));
  }

  /* _TO_SVG_START_ */

  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    var svgString, x = 0, y = 0,
      angle = (this.endAngle - this.startAngle) % 360;

    if (angle === 0) {
      svgString = [
        '<circle ', 'COMMON_PARTS',
        'cx="' + x + '" cy="' + y + '" ',
        'r="', this.radius,
        '" />\n'
      ];
    }
    else {
      var start = degreesToRadians(this.startAngle),
        end = degreesToRadians(this.endAngle),
        radius = this.radius,
        startX = cos(start) * radius,
        startY = sin(start) * radius,
        endX = cos(end) * radius,
        endY = sin(end) * radius,
        largeFlag = angle > 180 ? '1' : '0';
      svgString = [
        '<path d="M ' + startX + ' ' + startY,
        ' A ' + radius + ' ' + radius,
        ' 0 ', +largeFlag + ' 1', ' ' + endX + ' ' + endY,
        '" ', 'COMMON_PARTS', ' />\n'
      ];
    }
    return svgString;
  }
  /* _TO_SVG_END_ */

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx context to render on
   */
  _render(ctx) {
    ctx.beginPath();
    ctx.arc(
      0,
      0,
      this.radius,
      degreesToRadians(this.startAngle),
      degreesToRadians(this.endAngle),
      false
    );
    this._renderPaintInOrder(ctx);
  }

  /**
   * Returns horizontal radius of an object (according to how an object is scaled)
   * @return {Number}
   */
  getRadiusX() {
    return this.get('radius') * this.get('scaleX');
  }

  /**
   * Returns vertical radius of an object (according to how an object is scaled)
   * @return {Number}
   */
  getRadiusY() {
    return this.get('radius') * this.get('scaleY');
  }

  /**
   * Sets radius of an object (and updates width accordingly)
   * @return {Circle} thisArg
   */
  setRadius(value) {
    this.radius = value;
    return this.set('width', value * 2).set('height', value * 2);
  }

  /* _FROM_SVG_START_ */
  /**
   * List of attribute names to account for when parsing SVG element (used by {@link Circle.fromElement})
   * @static
   * @memberOf Circle
   * @see: http://www.w3.org/TR/SVG/shapes.html#CircleElement
   */
  static ATTRIBUTE_NAMES = SHARED_ATTRIBUTES.concat('cx cy r'.split(' '));

  /**
   * Returns {@link Circle} instance from an SVG element
   * @static
   * @memberOf Circle
   * @param {SVGElement} element Element to parse
   * @param {Function} [callback] Options callback invoked after parsing is finished
   * @param {Object} [options] Options object
   * @throws {Error} If value of `r` attribute is missing or invalid
   */
  static fromElement(element, callback) {
    var parsedAttributes = parseAttributes(element, Circle.ATTRIBUTE_NAMES);

    if (!isValidRadius(parsedAttributes)) {
      throw new Error('value of `r` attribute is required and can not be negative');
    }

    parsedAttributes.left = (parsedAttributes.left || 0) - parsedAttributes.radius;
    parsedAttributes.top = (parsedAttributes.top || 0) - parsedAttributes.radius;
    callback(new Circle(parsedAttributes));
  };

  /**
   * @private
   */

  /* _FROM_SVG_END_ */

  /**
   * Returns {@link Circle} instance from an object representation
   * @static
   * @memberOf Circle
   * @param {Object} object Object to create an instance from
   * @returns {Promise<Circle>}
   */
  static fromObject(object) {
    return FabricObject._fromObject(Circle, object);
  };

}


