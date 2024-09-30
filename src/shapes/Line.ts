import { SHARED_ATTRIBUTES } from '../parser/attributes';
import { parseAttributes } from '../parser/parseAttributes';
import type { Abortable, TClassProperties, TOptions } from '../typedefs';
import { classRegistry } from '../ClassRegistry';
import { FabricObject, cacheProperties } from './Object/FabricObject';
import { Point } from '../Point';
import { isFiller } from '../util/typeAssertions';
import type { FabricObjectProps, SerializedObjectProps } from './Object/types';
import type { ObjectEvents } from '../EventTypeDefs';
import { makeBoundingBoxFromPoints } from '../util';
import { CENTER, LEFT, TOP } from '../constants';
import type { CSSRules } from '../parser/typedefs';

// @TODO this code is terrible and Line should be a special case of polyline.

const coordProps = ['x1', 'x2', 'y1', 'y2'] as const;

interface UniqueLineProps {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export interface SerializedLineProps
  extends SerializedObjectProps,
    UniqueLineProps {}

export class Line<
    Props extends TOptions<FabricObjectProps> = Partial<FabricObjectProps>,
    SProps extends SerializedLineProps = SerializedLineProps,
    EventSpec extends ObjectEvents = ObjectEvents,
  >
  extends FabricObject<Props, SProps, EventSpec>
  implements UniqueLineProps
{
  /**
   * x value or first line edge
   * @type number
   * @default
   */
  declare x1: number;

  /**
   * y value or first line edge
   * @type number
   * @default
   */
  declare y1: number;

  /**
   * x value or second line edge
   * @type number
   * @default
   */
  declare x2: number;

  /**
   * y value or second line edge
   * @type number
   * @default
   */
  declare y2: number;

  static type = 'Line';

  static cacheProperties = [...cacheProperties, ...coordProps];
  /**
   * Constructor
   * @param {Array} [points] Array of points
   * @param {Object} [options] Options object
   * @return {Line} thisArg
   */
  constructor([x1, y1, x2, y2] = [0, 0, 0, 0], options: Partial<Props> = {}) {
    super();
    Object.assign(this, Line.ownDefaults);
    this.setOptions(options);
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this._setWidthHeight();
    const { left, top } = options;
    typeof left === 'number' && this.set(LEFT, left);
    typeof top === 'number' && this.set(TOP, top);
  }

  /**
   * @private
   * @param {Object} [options] Options
   */
  _setWidthHeight() {
    const { x1, y1, x2, y2 } = this;
    this.width = Math.abs(x2 - x1);
    this.height = Math.abs(y2 - y1);
    const { left, top, width, height } = makeBoundingBoxFromPoints([
      { x: x1, y: y1 },
      { x: x2, y: y2 },
    ]);
    const position = new Point(left + width / 2, top + height / 2);
    this.setPositionByOrigin(position, CENTER, CENTER);
  }

  /**
   * @private
   * @param {String} key
   * @param {*} value
   */
  _set(key: string, value: any) {
    super._set(key, value);
    if (coordProps.includes(key as keyof UniqueLineProps)) {
      // this doesn't make sense very much, since setting x1 when top or left
      // are already set, is just going to show a strange result since the
      // line will move way more than the developer expect.
      // in fabric5 it worked only when the line didn't have extra transformations,
      // in fabric6 too. With extra transform they behave bad in different ways.
      // This needs probably a good rework or a tutorial if you have to create a dynamic line
      this._setWidthHeight();
    }
    return this;
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();

    const p = this.calcLinePoints();
    ctx.moveTo(p.x1, p.y1);
    ctx.lineTo(p.x2, p.y2);

    ctx.lineWidth = this.strokeWidth;

    // TODO: test this
    // make sure setting "fill" changes color of a line
    // (by copying fillStyle to strokeStyle, since line is stroked, not filled)
    const origStrokeStyle = ctx.strokeStyle;
    if (isFiller(this.stroke)) {
      ctx.strokeStyle = this.stroke.toLive(ctx)!;
    } else {
      ctx.strokeStyle = this.stroke ?? ctx.fillStyle;
    }
    this.stroke && this._renderStroke(ctx);
    ctx.strokeStyle = origStrokeStyle;
  }

  /**
   * This function is an helper for svg import. it returns the center of the object in the svg
   * untransformed coordinates
   * @private
   * @return {Point} center point from element coordinates
   */
  _findCenterFromElement(): Point {
    return new Point((this.x1 + this.x2) / 2, (this.y1 + this.y2) / 2);
  }

  /**
   * Returns object representation of an instance
   * @method toObject
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject<
    T extends Omit<Props & TClassProperties<this>, keyof SProps>,
    K extends keyof T = never,
  >(propertiesToInclude: K[] = []): Pick<T, K> & SProps {
    return {
      ...super.toObject(propertiesToInclude),
      ...this.calcLinePoints(),
    };
  }

  /*
   * Calculate object dimensions from its properties
   * @private
   */
  _getNonTransformedDimensions(): Point {
    const dim = super._getNonTransformedDimensions();
    if (this.strokeLineCap === 'butt') {
      if (this.width === 0) {
        dim.y -= this.strokeWidth;
      }
      if (this.height === 0) {
        dim.x -= this.strokeWidth;
      }
    }
    return dim;
  }

  /**
   * Recalculates line points given width and height
   * Those points are simply placed around the center,
   * This is not useful outside internal render functions and svg output
   * Is not meant to be for the developer.
   * @private
   */
  calcLinePoints(): UniqueLineProps {
    const { x1: _x1, x2: _x2, y1: _y1, y2: _y2, width, height } = this;
    const xMult = _x1 <= _x2 ? -1 : 1,
      yMult = _y1 <= _y2 ? -1 : 1,
      x1 = (xMult * width) / 2,
      y1 = (yMult * height) / 2,
      x2 = (xMult * -width) / 2,
      y2 = (yMult * -height) / 2;

    return {
      x1,
      x2,
      y1,
      y2,
    };
  }

  /* _FROM_SVG_START_ */

  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    const { x1, x2, y1, y2 } = this.calcLinePoints();
    return [
      '<line ',
      'COMMON_PARTS',
      `x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />\n`,
    ];
  }

  /**
   * List of attribute names to account for when parsing SVG element (used by {@link Line.fromElement})
   * @static
   * @memberOf Line
   * @see http://www.w3.org/TR/SVG/shapes.html#LineElement
   */
  static ATTRIBUTE_NAMES = SHARED_ATTRIBUTES.concat(coordProps);

  /**
   * Returns Line instance from an SVG element
   * @static
   * @memberOf Line
   * @param {HTMLElement} element Element to parse
   * @param {Object} [options] Options object
   * @param {Function} [callback] callback function invoked after parsing
   */
  static async fromElement(
    element: HTMLElement,
    options: Abortable,
    cssRules?: CSSRules,
  ) {
    const {
      x1 = 0,
      y1 = 0,
      x2 = 0,
      y2 = 0,
      ...parsedAttributes
    } = parseAttributes(element, this.ATTRIBUTE_NAMES, cssRules);
    return new this([x1, y1, x2, y2], parsedAttributes);
  }

  /* _FROM_SVG_END_ */

  /**
   * Returns Line instance from an object representation
   * @static
   * @memberOf Line
   * @param {Object} object Object to create an instance from
   * @returns {Promise<Line>}
   */
  static fromObject<T extends TOptions<SerializedLineProps>>({
    x1,
    y1,
    x2,
    y2,
    ...object
  }: T) {
    return this._fromObject<Line>(
      {
        ...object,
        points: [x1, y1, x2, y2],
      },
      {
        extraParam: 'points',
      },
    );
  }
}

classRegistry.setClass(Line);
classRegistry.setSVGClass(Line);
