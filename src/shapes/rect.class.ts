import { fabric } from '../../HEADER';
import { kRect } from '../constants';
import { SHARED_ATTRIBUTES } from '../parser/attributes';
import { parseAttributes } from '../parser/parseAttributes';
import { TClassProperties } from '../typedefs';
import { FabricObject } from './fabricObject.class';
import { fabricObjectDefaultValues } from './object.class';

export class Rect extends FabricObject {
  /**
   * Horizontal border radius
   * @type Number
   * @default
   */
  rx: number;

  /**
   * Vertical border radius
   * @type Number
   * @default
   */
  ry: number;

  /**
   * Constructor
   * @param {Object} [options] Options object
   * @return {Object} thisArg
   */
  constructor(options: Record<string, unknown>) {
    super(options);
    this._initRxRy();
  }

  /**
   * Initializes rx/ry attributes
   * @private
   */
  _initRxRy() {
    const { rx, ry } = this;
    if (rx && !ry) {
      this.ry = rx;
    } else if (ry && !rx) {
      this.rx = ry;
    }
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render(ctx: CanvasRenderingContext2D) {
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
  }

  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject(propertiesToInclude: (keyof this)[] = []) {
    return super.toObject(['rx', 'ry', ...propertiesToInclude]);
  }

  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    const { width, height, rx, ry } = this;
    return [
      '<rect ',
      'COMMON_PARTS',
      `x="${-width / 2}" y="${
        -height / 2
      }" rx="${rx}" ry="${ry}" width="${width}" height="${height}" />\n`,
    ];
  }

  /**
   * List of attribute names to account for when parsing SVG element (used by `Rect.fromElement`)
   * @static
   * @memberOf Rect
   * @see: http://www.w3.org/TR/SVG/shapes.html#RectElement
   */
  static ATTRIBUTE_NAMES = [
    ...SHARED_ATTRIBUTES,
    'x',
    'y',
    'rx',
    'ry',
    'width',
    'height',
  ];

  /**
   * Returns {@link Rect} instance from an object representation
   * @static
   * @memberOf Rect
   * @param {Object} object Object to create an instance from
   * @returns {Promise<Rect>}
   */
  static fromObject(object: any) {
    return FabricObject._fromObject(Rect, object);
  }

  /* _FROM_SVG_START_ */

  /**
   * Returns {@link Rect} instance from an SVG element
   * @static
   * @memberOf Rect
   * @param {SVGElement} element Element to parse
   * @param {Function} callback callback function invoked after parsing
   * @param {Object} [options] Options object
   */
  static fromElement(
    element: SVGElement,
    callback: (rect: Rect | null) => void,
    options = {}
  ) {
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
    } = parseAttributes(element, Rect.ATTRIBUTE_NAMES);

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
  }

  /* _FROM_SVG_END_ */
}

export const rectDefaultValues: Partial<TClassProperties<Rect>> = {
  stateProperties: fabricObjectDefaultValues.stateProperties.concat('rx', 'ry'),
  type: 'rect',
  rx: 0,
  ry: 0,
  cacheProperties: fabricObjectDefaultValues.cacheProperties.concat('rx', 'ry'),
};

Object.assign(Rect.prototype, rectDefaultValues);

fabric.Rect = Rect;
