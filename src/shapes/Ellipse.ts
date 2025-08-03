import { SCALE_X, SCALE_Y, twoMathPi } from '../constants';
import { SHARED_ATTRIBUTES } from '../parser/attributes';
import { parseAttributes } from '../parser/parseAttributes';
import type { Abortable, TClassProperties, TOptions } from '../typedefs';
import { classRegistry } from '../ClassRegistry';
import { FabricObject, cacheProperties } from './Object/FabricObject';
import type { FabricObjectProps, SerializedObjectProps } from './Object/types';
import type { ObjectEvents } from '../EventTypeDefs';
import type { CSSRules } from '../parser/typedefs';

export const ellipseDefaultValues: Partial<TClassProperties<Ellipse>> = {
  rx: 0,
  ry: 0,
};

interface UniqueEllipseProps {
  rx: number;
  ry: number;
}

export interface SerializedEllipseProps
  extends SerializedObjectProps,
    UniqueEllipseProps {}

export interface EllipseProps extends FabricObjectProps, UniqueEllipseProps {}

const ELLIPSE_PROPS = ['rx', 'ry'] as const;

export class Ellipse<
    Props extends TOptions<EllipseProps> = Partial<EllipseProps>,
    SProps extends SerializedEllipseProps = SerializedEllipseProps,
    EventSpec extends ObjectEvents = ObjectEvents,
  >
  extends FabricObject<Props, SProps, EventSpec>
  implements EllipseProps
{
  /**
   * Horizontal radius
   * @type Number
   */
  declare rx: number;

  /**
   * Vertical radius
   * @type Number
   */
  declare ry: number;

  static type = 'Ellipse';

  static cacheProperties = [...cacheProperties, ...ELLIPSE_PROPS];

  static ownDefaults = ellipseDefaultValues;

  static getDefaults(): Record<string, any> {
    return {
      ...super.getDefaults(),
      ...Ellipse.ownDefaults,
    };
  }

  /**
   * Constructor
   * @param {Object} [options] Options object
   */
  constructor(options?: Props) {
    super();
    Object.assign(this, Ellipse.ownDefaults);
    this.setOptions(options);
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
    return this.get('rx') * this.get(SCALE_X);
  }

  /**
   * Returns Vertical radius of an object (according to how an object is scaled)
   * @return {Number}
   */
  getRy() {
    return this.get('ry') * this.get(SCALE_Y);
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
    return super.toObject([...ELLIPSE_PROPS, ...propertiesToInclude]);
  }

  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG(): string[] {
    return [
      '<ellipse ',
      'COMMON_PARTS',
      `cx="0" cy="0" rx="${this.rx}" ry="${this.ry}" />\n`,
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
   * @see http://www.w3.org/TR/SVG/shapes.html#EllipseElement
   */
  static ATTRIBUTE_NAMES = [...SHARED_ATTRIBUTES, 'cx', 'cy', 'rx', 'ry'];

  /**
   * Returns {@link Ellipse} instance from an SVG element
   * @param {HTMLElement} element Element to parse
   * @return {Ellipse}
   */
  static async fromElement(
    element: HTMLElement,
    options?: Abortable,
    cssRules?: CSSRules,
  ) {
    const parsedAttributes = parseAttributes(
      element,
      this.ATTRIBUTE_NAMES,
      cssRules,
    );

    parsedAttributes.left = (parsedAttributes.left || 0) - parsedAttributes.rx;
    parsedAttributes.top = (parsedAttributes.top || 0) - parsedAttributes.ry;
    return new this(parsedAttributes);
  }

  /* _FROM_SVG_END_ */
}

classRegistry.setClass(Ellipse);
classRegistry.setSVGClass(Ellipse);
