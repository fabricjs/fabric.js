import { fabric } from '../HEADER';
import { Color } from './color';
import { config } from './config';
import { Point } from './point.class';
import type { FabricObject } from './shapes/Object/FabricObject';
import { TClassProperties } from './typedefs';
import { uid } from './util/internals/uid';
import { degreesToRadians } from './util/misc/radiansDegreesConversion';
import { toFixed } from './util/misc/toFixed';
import { rotateVector } from './util/misc/vectors';

export class Shadow {
  /**
   * Shadow color
   * @type String
   * @default
   */
  color: string;

  /**
   * Shadow blur
   * @type Number
   */
  blur: number;

  /**
   * Shadow horizontal offset
   * @type Number
   * @default
   */
  offsetX: number;

  /**
   * Shadow vertical offset
   * @type Number
   * @default
   */
  offsetY: number;

  /**
   * Whether the shadow should affect stroke operations
   * @type Boolean
   * @default
   */
  affectStroke: boolean;

  /**
   * Indicates whether toObject should include default values
   * @type Boolean
   * @default
   */
  includeDefaultValues: boolean;

  /**
   * When `false`, the shadow will scale with the object.
   * When `true`, the shadow's offsetX, offsetY, and blur will not be affected by the object's scale.
   * default to false
   * @type Boolean
   * @default
   */
  nonScaling: boolean;

  id: number;

  /**
   * @see {@link http://fabricjs.com/shadows|Shadow demo}
   * @param {Object|String} [options] Options object with any of color, blur, offsetX, offsetY properties or string (e.g. "rgba(0,0,0,0.2) 2px 2px 10px")
   */
  constructor(options: Partial<TClassProperties<Shadow>>);
  constructor(svgAttribute: string);
  constructor(arg0: string | Partial<TClassProperties<Shadow>>) {
    const options: Partial<TClassProperties<Shadow>> =
      typeof arg0 === 'string' ? Shadow.parseShadow(arg0) : arg0;
    for (const prop in options) {
      // @ts-expect-error for loops are so messy in TS
      this[prop] = options[prop];
    }

    this.id = uid();
  }

  /**
   * @param {String} value Shadow value to parse
   * @return {Object} Shadow object with color, offsetX, offsetY and blur
   */
  static parseShadow(value: string) {
    const shadowStr = value.trim(),
      [__, offsetX = 0, offsetY = 0, blur = 0] = (
        Shadow.reOffsetsAndBlur.exec(shadowStr) || []
      ).map((value) => parseFloat(value) || 0),
      color = (
        shadowStr.replace(Shadow.reOffsetsAndBlur, '') || 'rgb(0,0,0)'
      ).trim();

    return {
      color,
      offsetX,
      offsetY,
      blur,
    };
  }

  /**
   * Returns a string representation of an instance
   * @see http://www.w3.org/TR/css-text-decor-3/#text-shadow
   * @return {String} Returns CSS3 text-shadow declaration
   */
  toString() {
    return [this.offsetX, this.offsetY, this.blur, this.color].join('px ');
  }

  /**
   * Returns SVG representation of a shadow
   * @param {FabricObject} object
   * @return {String} SVG representation of a shadow
   */
  toSVG(object: FabricObject) {
    const offset = rotateVector(
        new Point(this.offsetX, this.offsetY),
        degreesToRadians(-object.angle)
      ),
      BLUR_BOX = 20,
      color = new Color(this.color);
    let fBoxX = 40,
      fBoxY = 40;

    if (object.width && object.height) {
      //http://www.w3.org/TR/SVG/filters.html#FilterEffectsRegion
      // we add some extra space to filter box to contain the blur ( 20 )
      fBoxX =
        toFixed(
          (Math.abs(offset.x) + this.blur) / object.width,
          config.NUM_FRACTION_DIGITS
        ) *
          100 +
        BLUR_BOX;
      fBoxY =
        toFixed(
          (Math.abs(offset.y) + this.blur) / object.height,
          config.NUM_FRACTION_DIGITS
        ) *
          100 +
        BLUR_BOX;
    }
    if (object.flipX) {
      offset.x *= -1;
    }
    if (object.flipY) {
      offset.y *= -1;
    }

    return `<filter id="SVGID_${this.id}" y="-${fBoxY}%" height="${
      100 + 2 * fBoxY
    }%" x="-${fBoxX}%" width="${
      100 + 2 * fBoxX
    }%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="${toFixed(
      this.blur ? this.blur / 2 : 0,
      config.NUM_FRACTION_DIGITS
    )}"></feGaussianBlur>\n\t<feOffset dx="${toFixed(
      offset.x,
      config.NUM_FRACTION_DIGITS
    )}" dy="${toFixed(
      offset.y,
      config.NUM_FRACTION_DIGITS
    )}" result="oBlur" ></feOffset>\n\t<feFlood flood-color="${color.toRgb()}" flood-opacity="${color.getAlpha()}"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n`;
  }

  /**
   * Returns object representation of a shadow
   * @return {Object} Object representation of a shadow instance
   */
  toObject() {
    const data = {
      color: this.color,
      blur: this.blur,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      affectStroke: this.affectStroke,
      nonScaling: this.nonScaling,
    };

    if (this.includeDefaultValues) {
      return data;
    }

    const defaults = Shadow.prototype;
    const out: Record<string, unknown> = {};
    for (const key in data) {
      if (
        data[key as keyof typeof data] !== defaults[key as keyof typeof data]
      ) {
        out[key] = data[key as keyof typeof data];
      }
    }
    return out;
  }

  /**
   * Regex matching shadow offsetX, offsetY and blur (ex: "2px 2px 10px rgba(0,0,0,0.2)", "rgb(0,255,0) 2px 2px")
   */
  // eslint-disable-next-line max-len
  static reOffsetsAndBlur =
    /(?:\s|^)(-?\d+(?:\.\d*)?(?:px)?(?:\s?|$))?(-?\d+(?:\.\d*)?(?:px)?(?:\s?|$))?(\d+(?:\.\d*)?(?:px)?)?(?:\s?|$)(?:$|\s)/;
}

export const shadowDefaultValues: Partial<TClassProperties<Shadow>> = {
  color: 'rgb(0,0,0)',
  blur: 0,
  offsetX: 0,
  offsetY: 0,
  affectStroke: false,
  includeDefaultValues: true,
  nonScaling: false,
};

Object.assign(Shadow.prototype, shadowDefaultValues);

fabric.Shadow = Shadow;
