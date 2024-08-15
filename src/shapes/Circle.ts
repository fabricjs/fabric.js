import type { ObjectEvents } from '../EventTypeDefs';
import { SHARED_ATTRIBUTES } from '../parser/attributes';
import { parseAttributes } from '../parser/parseAttributes';
import { cos } from '../util/misc/cos';
import { degreesToRadians } from '../util/misc/radiansDegreesConversion';
import { sin } from '../util/misc/sin';
import { classRegistry } from '../ClassRegistry';
import { FabricObject, cacheProperties } from './Object/FabricObject';
import type { Abortable, TClassProperties, TOptions } from '../typedefs';
import type { FabricObjectProps, SerializedObjectProps } from './Object/types';
import type { CSSRules } from '../parser/typedefs';
import { SCALE_X, SCALE_Y } from '../constants';

interface UniqueCircleProps {
  /**
   * Radius of this circle
   * @type Number
   * @default 0
   */
  radius: number;

  /**
   * Angle for the start of the circle, in degrees.
   * @type TDegree 0 - 359
   * @default 0
   */
  startAngle: number;

  /**
   * Angle for the end of the circle, in degrees
   * @type TDegree 1 - 360
   * @default 360
   */
  endAngle: number;

  /**
   * Orientation for the direction of the circle.
   * Setting to true will switch the arc of the circle to traverse from startAngle to endAngle in a counter-clockwise direction.
   * Note: this will only change how the circle is drawn, and does not affect rotational transformation.
   * @default false
   */
  counterClockwise: boolean;
}

export interface SerializedCircleProps
  extends SerializedObjectProps,
    UniqueCircleProps {}

export interface CircleProps extends FabricObjectProps, UniqueCircleProps {}

const CIRCLE_PROPS = [
  'radius',
  'startAngle',
  'endAngle',
  'counterClockwise',
] as const;

export const circleDefaultValues: Partial<TClassProperties<Circle>> = {
  radius: 0,
  startAngle: 0,
  endAngle: 360,
  counterClockwise: false,
};

export class Circle<
    Props extends TOptions<CircleProps> = Partial<CircleProps>,
    SProps extends SerializedCircleProps = SerializedCircleProps,
    EventSpec extends ObjectEvents = ObjectEvents,
  >
  extends FabricObject<Props, SProps, EventSpec>
  implements UniqueCircleProps
{
  declare radius: number;
  declare startAngle: number;
  declare endAngle: number;
  declare counterClockwise: boolean;

  static type = 'Circle';

  static cacheProperties = [...cacheProperties, ...CIRCLE_PROPS];

  static ownDefaults = circleDefaultValues;

  static getDefaults(): Record<string, any> {
    return {
      ...super.getDefaults(),
      ...Circle.ownDefaults,
    };
  }

  /**
   * Constructor
   * @param {Object} [options] Options object
   */
  constructor(options?: Props) {
    super();
    Object.assign(this, Circle.ownDefaults);
    this.setOptions(options);
  }

  /**
   * @private
   * @param {String} key
   * @param {*} value
   */
  _set(key: string, value: any) {
    super._set(key, value);

    if (key === 'radius') {
      this.setRadius(value);
    }

    return this;
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx context to render on
   */
  _render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(
      0,
      0,
      this.radius,
      degreesToRadians(this.startAngle),
      degreesToRadians(this.endAngle),
      this.counterClockwise,
    );
    this._renderPaintInOrder(ctx);
  }

  /**
   * Returns horizontal radius of an object (according to how an object is scaled)
   * @return {Number}
   */
  getRadiusX(): number {
    return this.get('radius') * this.get(SCALE_X);
  }

  /**
   * Returns vertical radius of an object (according to how an object is scaled)
   * @return {Number}
   */
  getRadiusY(): number {
    return this.get('radius') * this.get(SCALE_Y);
  }

  /**
   * Sets radius of an object (and updates width accordingly)
   */
  setRadius(value: number) {
    this.radius = value;
    this.set({ width: value * 2, height: value * 2 });
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
    return super.toObject([...CIRCLE_PROPS, ...propertiesToInclude]);
  }

  /* _TO_SVG_START_ */

  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG(): string[] {
    const angle = (this.endAngle - this.startAngle) % 360;

    if (angle === 0) {
      return [
        '<circle ',
        'COMMON_PARTS',
        'cx="0" cy="0" ',
        'r="',
        `${this.radius}`,
        '" />\n',
      ];
    } else {
      const { radius } = this;
      const start = degreesToRadians(this.startAngle),
        end = degreesToRadians(this.endAngle),
        startX = cos(start) * radius,
        startY = sin(start) * radius,
        endX = cos(end) * radius,
        endY = sin(end) * radius,
        largeFlag = angle > 180 ? 1 : 0,
        sweepFlag = this.counterClockwise ? 0 : 1;
      return [
        `<path d="M ${startX} ${startY} A ${radius} ${radius} 0 ${largeFlag} ${sweepFlag} ${endX} ${endY}" `,
        'COMMON_PARTS',
        ' />\n',
      ];
    }
  }
  /* _TO_SVG_END_ */

  /* _FROM_SVG_START_ */
  /**
   * List of attribute names to account for when parsing SVG element (used by {@link Circle.fromElement})
   * @static
   * @memberOf Circle
   * @see: http://www.w3.org/TR/SVG/shapes.html#CircleElement
   */
  static ATTRIBUTE_NAMES = ['cx', 'cy', 'r', ...SHARED_ATTRIBUTES];

  /**
   * Returns {@link Circle} instance from an SVG element
   * @static
   * @memberOf Circle
   * @param {HTMLElement} element Element to parse
   * @param {Object} [options] Partial Circle object to default missing properties on the element.
   * @throws {Error} If value of `r` attribute is missing or invalid
   */
  static async fromElement(
    element: HTMLElement,
    options: Abortable,
    cssRules?: CSSRules,
  ): Promise<Circle> {
    const {
      left = 0,
      top = 0,
      radius = 0,
      ...otherParsedAttributes
    } = parseAttributes(
      element,
      this.ATTRIBUTE_NAMES,
      cssRules,
    ) as Partial<CircleProps>;

    // this probably requires to be fixed for default origins not being top/left.

    return new this({
      ...otherParsedAttributes,
      radius,
      left: left - radius,
      top: top - radius,
    });
  }

  /* _FROM_SVG_END_ */

  /**
   * @todo how do we declare this??
   */
  static fromObject<T extends TOptions<SerializedCircleProps>>(object: T) {
    return super._fromObject<Circle>(object);
  }
}

classRegistry.setClass(Circle);
classRegistry.setSVGClass(Circle);
