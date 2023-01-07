import { twoMathPi } from '../constants';
import { SHARED_ATTRIBUTES } from '../parser/attributes';
import { parseAttributes } from '../parser/parseAttributes';
import { TClassProperties } from '../typedefs';
import { classRegistry } from '../util/class_registry';
import { FabricObject, cacheProperties } from './Object/FabricObject';

export class Ellipse extends FabricObject {
  /**
   * Horizontal radius
   * @type Number
   * @default
   */
  declare rx: number;

  /**
   * Vertical radius
   * @type Number
   * @default
   */
  declare ry: number;

  /**
   * Constructor
   * @param {Object} [options] Options object
   * @return {Ellipse} thisArg
   */
  constructor(options: Record<string, unknown>) {
    super(options);
  }

  /**
   * @private
   * @param {String} key
   * @param {*} value
   * @return {Ellipse} thisArg
   */
  _set(key: string, value: any) {
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
  toObject(propertiesToInclude: string[] = []) {
    return super.toObject(['rx', 'ry', ...propertiesToInclude]);
  }

  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    return [
      '<ellipse ',
      'COMMON_PARTS',
      'cx="0" cy="0" ',
      'rx="',
      this.rx,
      '" ry="',
      this.ry,
      '" />\n',
    ];
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx context to render on
   */
  _render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.save();
    ctx.transform(1, 0, 0, this.ry / this.rx, 0, 0);
    ctx.arc(0, 0, this.rx, 0, twoMathPi, false);
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
  static ATTRIBUTE_NAMES = [...SHARED_ATTRIBUTES, 'cx', 'cy', 'rx', 'ry'];

  /**
   * Returns {@link Ellipse} instance from an SVG element
   * @static
   * @memberOf Ellipse
   * @param {SVGElement} element Element to parse
   * @param {Function} [callback] Options callback invoked after parsing is finished
   * @return {Ellipse}
   */
  static fromElement(
    element: SVGElement,
    callback: (ellipse: Ellipse) => void
  ) {
    const parsedAttributes = parseAttributes(element, this.ATTRIBUTE_NAMES);

    parsedAttributes.left = (parsedAttributes.left || 0) - parsedAttributes.rx;
    parsedAttributes.top = (parsedAttributes.top || 0) - parsedAttributes.ry;
    callback(new this(parsedAttributes));
  }

  /* _FROM_SVG_END_ */
}

export const ellipseDefaultValues: Partial<TClassProperties<Ellipse>> = {
  type: 'ellipse',
  rx: 0,
  ry: 0,
};

Object.assign(Ellipse.prototype, {
  ...ellipseDefaultValues,
  cacheProperties: [...cacheProperties, 'rx', 'ry'],
});

classRegistry.setClass(Ellipse);
classRegistry.setSVGClass(Ellipse);
