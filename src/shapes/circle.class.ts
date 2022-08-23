//@ts-nocheck
import {fabric} from '../../HEADER';

const degreesToRadians = fabric.util.degreesToRadians;

/**
 * Circle class
 * @class Circle
 * @extends fabric.Object
 * @see {@link Circle#initialize} for constructor definition
 */
const Circle = fabric.util.createClass(fabric.Object, /** @lends Circle.prototype */ {

  /**
   * List of properties to consider when checking if state of an object is changed ({@link fabric.Object#hasStateChanged})
   * as well as for history (undo/redo) purposes
   * @type Array
   */
  stateProperties: fabric.Object.prototype.stateProperties.concat('radius', 'startAngle', 'endAngle'),

  /**
   * Type of an object
   * @type String
   * @default
   */
  type: 'circle',

  /**
   * Radius of this circle
   * @type Number
   * @default
   */
  radius: 0,

  /**
   * degrees of start of the circle.
   * probably will change to degrees in next major version
   * @type Number 0 - 359
   * @default 0
   */
  startAngle: 0,

  /**
   * End angle of the circle
   * probably will change to degrees in next major version
   * @type Number 1 - 360
   * @default 360
   */
  endAngle: 360,

  cacheProperties: fabric.Object.prototype.cacheProperties.concat('radius', 'startAngle', 'endAngle'),

  /**
   * @private
   * @param {String} key
   * @param {*} value
   * @return {Circle} thisArg
   */
  _set: function(key, value) {
    this.callSuper('_set', key, value);

    if (key === 'radius') {
      this.setRadius(value);
    }

    return this;
  },

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx context to render on
   */
  _render: function(ctx) {
    ctx.beginPath();
    ctx.arc(
      0,
      0,
      this.radius,
      degreesToRadians(this.startAngle),
      degreesToRadians(this.endAngle),
      false,
    );
    this._renderPaintInOrder(ctx);
  },

  /**
   * Returns horizontal radius of an object (according to how an object is scaled)
   * @return {Number}
   */
  getRadiusX: function() {
    return this.get('radius') * this.get('scaleX');
  },

  /**
   * Returns vertical radius of an object (according to how an object is scaled)
   * @return {Number}
   */
  getRadiusY: function() {
    return this.get('radius') * this.get('scaleY');
  },

  /**
   * Sets radius of an object (and updates width accordingly)
   * @return {Circle} thisArg
   */
  setRadius: function(value) {
    this.radius = value;
    return this.set('width', value * 2).set('height', value * 2);
  },

  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject: function(propertiesToInclude) {
    return this.callSuper('toObject', ['radius', 'startAngle', 'endAngle'].concat(propertiesToInclude));
  },

  /* _TO_SVG_START_ */

  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG: function() {
    const angle = (this.endAngle - this.startAngle) % 360;

    if (angle === 0) {
      return [
        '<circle ', 'COMMON_PARTS',
        'cx="0" cy="0" ',
        'r="', this.radius,
        '" />\n',
      ];
    } else {
      const { radius } = this;
      const start = degreesToRadians(this.startAngle),
        end = degreesToRadians(this.endAngle),
        startX = fabric.util.cos(start) * radius,
        startY = fabric.util.sin(start) * radius,
        endX = fabric.util.cos(end) * radius,
        endY = fabric.util.sin(end) * radius,
        largeFlag = angle > 180 ? '1' : '0';
      return [
        '<path d="M ' + startX + ' ' + startY,
        ' A ' + radius + ' ' + radius,
        ' 0 ', + largeFlag + ' 1', ' ' + endX + ' ' + endY,
        '" ', 'COMMON_PARTS', ' />\n',
      ];
    }
  },
  /* _TO_SVG_END_ */
});

/* _FROM_SVG_START_ */
/**
 * List of attribute names to account for when parsing SVG element (used by {@link Circle.fromElement})
 * @static
 * @memberOf Circle
 * @see: http://www.w3.org/TR/SVG/shapes.html#CircleElement
 */
Circle.ATTRIBUTE_NAMES = ['cx', 'cy', 'r', ...fabric.SHARED_ATTRIBUTES];

/**
 * Returns {@link Circle} instance from an SVG element
 * @static
 * @memberOf Circle
 * @param {SVGElement} element Element to parse
 * @param {Function} [callback] Options callback invoked after parsing is finished
 * @param {Object} [options] Partial Circle object to default missing properties on the element.
 * @throws {Error} If value of `r` attribute is missing or invalid
 */
Circle.fromElement = function(element, callback) {
  const {
    left = 0,
    top = 0,
    radius,
    ...otherParsedAttributes,
  } = fabric.parseAttributes(element, Circle.ATTRIBUTE_NAMES);

  if (!radius || radius < 0) {
    throw new Error('value of `r` attribute is required and can not be negative');
  }

  // this probably requires to be fixed for default origins not being top/left.
  callback(new fabric.Circle({
    ...otherParsedAttributes,
    radius,
    left: left - radius,
    top: top - radius,
  }));
};

/* _FROM_SVG_END_ */

/**
 * Returns {@link Circle} instance from an object representation
 * @static
 * @memberOf Circle
 * @param {Object} object Object to create an instance from
 * @returns {Promise<Circle>}
 */
Circle.fromObject = (object) => fabric.Object._fromObject(fabric.Circle, object);

fabric.Circle = Circle;
export {
  Circle
}
