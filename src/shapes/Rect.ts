import { kRect } from '../constants';
import { SHARED_ATTRIBUTES } from '../parser/attributes';
import { parseAttributes } from '../parser/parseAttributes';
import type { Abortable, TClassProperties, TOptions } from '../typedefs';
import { classRegistry } from '../ClassRegistry';
import { FabricObject, cacheProperties } from './Object/FabricObject';
import type { FabricObjectProps, SerializedObjectProps } from './Object/types';
import type { ObjectEvents } from '../EventTypeDefs';
import type { CSSRules } from '../parser/typedefs';

export const rectDefaultValues: Partial<TClassProperties<Rect>> = {
  rx: 0,
  ry: 0,
};

interface UniqueRectProps {
  rx: number;
  ry: number;
}

export interface SerializedRectProps
  extends SerializedObjectProps,
    UniqueRectProps {}

export interface RectProps extends FabricObjectProps, UniqueRectProps {}

const RECT_PROPS = ['rx', 'ry'] as const;

export class Rect<
    Props extends TOptions<RectProps> = Partial<RectProps>,
    SProps extends SerializedRectProps = SerializedRectProps,
    EventSpec extends ObjectEvents = ObjectEvents,
  >
  extends FabricObject<Props, SProps, EventSpec>
  implements RectProps
{
  /**
   * Horizontal border radius
   * @type Number
   * @default
   */
  declare rx: number;

  /**
   * Vertical border radius
   * @type Number
   * @default
   */
  declare ry: number;

  static type = 'Rect';

  static cacheProperties = [...cacheProperties, ...RECT_PROPS];

  static ownDefaults = rectDefaultValues;

  static getDefaults(): Record<string, any> {
    return {
      ...super.getDefaults(),
      ...Rect.ownDefaults,
    };
  }

  /**
   * Constructor
   * @param {Object} [options] Options object
   */
  constructor(options?: Props) {
    super();
    Object.assign(this, Rect.ownDefaults);
    this.setOptions(options);
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
        y + ry,
      );

    ctx.lineTo(x + w, y + h - ry);
    isRounded &&
      ctx.bezierCurveTo(
        x + w,
        y + h - kRect * ry,
        x + w - kRect * rx,
        y + h,
        x + w - rx,
        y + h,
      );

    ctx.lineTo(x + rx, y + h);
    isRounded &&
      ctx.bezierCurveTo(
        x + kRect * rx,
        y + h,
        x,
        y + h - kRect * ry,
        x,
        y + h - ry,
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
  toObject<
    T extends Omit<Props & TClassProperties<this>, keyof SProps>,
    K extends keyof T = never,
  >(propertiesToInclude: K[] = []): Pick<T, K> & SProps {
    return super.toObject([...RECT_PROPS, ...propertiesToInclude]);
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

  /* _FROM_SVG_START_ */

  /**
   * Returns {@link Rect} instance from an SVG element
   * @static
   * @memberOf Rect
   * @param {HTMLElement} element Element to parse
   * @param {Object} [options] Options object
   */
  static async fromElement(
    element: HTMLElement,
    options: Abortable,
    cssRules?: CSSRules,
  ) {
    const {
      left = 0,
      top = 0,
      width = 0,
      height = 0,
      visible = true,
      ...restOfparsedAttributes
    } = parseAttributes(element, this.ATTRIBUTE_NAMES, cssRules);

    return new this({
      ...options,
      ...restOfparsedAttributes,
      left,
      top,
      width,
      height,
      visible: Boolean(visible && width && height),
    });
  }

  /* _FROM_SVG_END_ */
}

classRegistry.setClass(Rect);
classRegistry.setSVGClass(Rect);
