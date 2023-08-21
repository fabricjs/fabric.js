import { ColorNameMap } from './color_map';
import { reHSLa, reHex, reRGBa } from './constants';
import type { TRGBAColorSource, TColorArg } from './typedefs';
import {
  hue2rgb,
  hexify,
  rgb2Hsl,
  fromAlphaToFloat,
  greyAverage,
} from './util';

/**
 * @class Color common color operations
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-2/#colors colors}
 */
export class Color {
  private declare _source: TRGBAColorSource;

  /**
   *
   * @param {string} [color] optional in hex or rgb(a) or hsl format or from known color list
   */
  constructor(color?: TColorArg) {
    if (!color) {
      // we default to black as canvas does
      this.setSource([0, 0, 0, 1]);
    } else if (color instanceof Color) {
      this.setSource([...color._source]);
    } else if (Array.isArray(color)) {
      const [r, g, b, a = 1] = color;
      this.setSource([r, g, b, a]);
    } else {
      this.setSource(this._tryParsingColor(color));
    }
  }

  /**
   * @private
   * @param {string} [color] Color value to parse
   * @returns {TRGBAColorSource}
   */
  protected _tryParsingColor(color: string) {
    if (color in ColorNameMap) {
      color = ColorNameMap[color as keyof typeof ColorNameMap];
    }
    return color === 'transparent'
      ? ([255, 255, 255, 0] as TRGBAColorSource)
      : Color.sourceFromHex(color) ||
          Color.sourceFromRgb(color) ||
          Color.sourceFromHsl(color) ||
          // color is not recognized
          // we default to black as canvas does
          ([0, 0, 0, 1] as TRGBAColorSource);
  }

  /**
   * Returns source of this color (where source is an array representation; ex: [200, 200, 100, 1])
   * @return {TRGBAColorSource}
   */
  getSource() {
    return this._source;
  }

  /**
   * Sets source of this color (where source is an array representation; ex: [200, 200, 100, 1])
   * @param {TRGBAColorSource} source
   */
  setSource(source: TRGBAColorSource) {
    this._source = source;
  }

  /**
   * Returns color representation in RGB format
   * @return {String} ex: rgb(0-255,0-255,0-255)
   */
  toRgb() {
    const [r, g, b] = this.getSource();
    return `rgb(${r},${g},${b})`;
  }

  /**
   * Returns color representation in RGBA format
   * @return {String} ex: rgba(0-255,0-255,0-255,0-1)
   */
  toRgba() {
    return `rgba(${this.getSource().join(',')})`;
  }

  /**
   * Returns color representation in HSL format
   * @return {String} ex: hsl(0-360,0%-100%,0%-100%)
   */
  toHsl() {
    const [h, s, l] = rgb2Hsl(...this.getSource());
    return `hsl(${h},${s}%,${l}%)`;
  }

  /**
   * Returns color representation in HSLA format
   * @return {String} ex: hsla(0-360,0%-100%,0%-100%,0-1)
   */
  toHsla() {
    const [h, s, l, a] = rgb2Hsl(...this.getSource());
    return `hsla(${h},${s}%,${l}%,${a})`;
  }

  /**
   * Returns color representation in HEX format
   * @return {String} ex: FF5555
   */
  toHex() {
    const fullHex = this.toHexa();
    return fullHex.slice(0, 6);
  }

  /**
   * Returns color representation in HEXA format
   * @return {String} ex: FF5555CC
   */
  toHexa() {
    const [r, g, b, a] = this.getSource();
    return `${hexify(r)}${hexify(g)}${hexify(b)}${hexify(Math.round(a * 255))}`;
  }

  /**
   * Gets value of alpha channel for this color
   * @return {Number} 0-1
   */
  getAlpha() {
    return this.getSource()[3];
  }

  /**
   * Sets value of alpha channel for this color
   * @param {Number} alpha Alpha value 0-1
   * @return {Color} thisArg
   */
  setAlpha(alpha: number) {
    this._source[3] = alpha;
    return this;
  }

  /**
   * Transforms color to its grayscale representation
   * @return {Color} thisArg
   */
  toGrayscale() {
    this.setSource(greyAverage(this.getSource()));
    return this;
  }

  /**
   * Transforms color to its black and white representation
   * @param {Number} threshold
   * @return {Color} thisArg
   */
  toBlackWhite(threshold: number) {
    const [average, , , a] = greyAverage(this.getSource()),
      bOrW = average < (threshold || 127) ? 0 : 255;
    this.setSource([bOrW, bOrW, bOrW, a]);
    return this;
  }

  /**
   * Overlays color with another color
   * @param {String|Color} otherColor
   * @return {Color} thisArg
   */
  overlayWith(otherColor: string | Color) {
    if (!(otherColor instanceof Color)) {
      otherColor = new Color(otherColor);
    }

    const source = this.getSource(),
      otherAlpha = 0.5,
      otherSource = otherColor.getSource(),
      [R, G, B] = source.map((value, index) =>
        Math.round(value * (1 - otherAlpha) + otherSource[index] * otherAlpha)
      );

    this.setSource([R, G, B, source[3]]);
    return this;
  }

  /**
   * Returns new color object, when given a color in RGB format
   * @memberOf Color
   * @param {String} color Color value ex: rgb(0-255,0-255,0-255)
   * @return {Color}
   */
  static fromRgb(color: string): Color {
    return Color.fromRgba(color);
  }

  /**
   * Returns new color object, when given a color in RGBA format
   * @static
   * @function
   * @memberOf Color
   * @param {String} color
   * @return {Color}
   */
  static fromRgba(color: string): Color {
    return new Color(Color.sourceFromRgb(color));
  }

  /**
   * Returns array representation (ex: [100, 100, 200, 1]) of a color that's in RGB or RGBA format
   * @memberOf Color
   * @param {String} color Color value ex: rgb(0-255,0-255,0-255), rgb(0%-100%,0%-100%,0%-100%)
   * @return {TRGBAColorSource | undefined} source
   */
  static sourceFromRgb(color: string): TRGBAColorSource | undefined {
    const match = color.match(reRGBa());
    if (match) {
      const [r, g, b] = match.slice(1, 4).map((value) => {
        const parsedValue = parseFloat(value);
        return value.endsWith('%')
          ? Math.round(parsedValue * 2.55)
          : parsedValue;
      });
      return [r, g, b, fromAlphaToFloat(match[4])];
    }
  }

  /**
   * Returns new color object, when given a color in HSL format
   * @param {String} color Color value ex: hsl(0-260,0%-100%,0%-100%)
   * @memberOf Color
   * @return {Color}
   */
  static fromHsl(color: string): Color {
    return Color.fromHsla(color);
  }

  /**
   * Returns new color object, when given a color in HSLA format
   * @static
   * @function
   * @memberOf Color
   * @param {String} color
   * @return {Color}
   */
  static fromHsla(color: string): Color {
    return new Color(Color.sourceFromHsl(color));
  }

  /**
   * Returns array representation (ex: [100, 100, 200, 1]) of a color that's in HSL or HSLA format.
   * Adapted from <a href="https://rawgithub.com/mjijackson/mjijackson.github.com/master/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript.html">https://github.com/mjijackson</a>
   * @memberOf Color
   * @param {String} color Color value ex: hsl(0-360,0%-100%,0%-100%) or hsla(0-360,0%-100%,0%-100%, 0-1)
   * @return {TRGBAColorSource | undefined} source
   * @see http://http://www.w3.org/TR/css3-color/#hsl-color
   */
  static sourceFromHsl(color: string): TRGBAColorSource | undefined {
    const match = color.match(reHSLa());
    if (!match) {
      return;
    }

    const h = (((parseFloat(match[1]) % 360) + 360) % 360) / 360,
      s = parseFloat(match[2]) / 100,
      l = parseFloat(match[3]) / 100;
    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l <= 0.5 ? l * (s + 1) : l + s - l * s,
        p = l * 2 - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255),
      fromAlphaToFloat(match[4]),
    ];
  }

  /**
   * Returns new color object, when given a color in HEX format
   * @static
   * @memberOf Color
   * @param {String} color Color value ex: FF5555
   * @return {Color}
   */
  static fromHex(color: string): Color {
    return new Color(Color.sourceFromHex(color));
  }

  /**
   * Returns array representation (ex: [100, 100, 200, 1]) of a color that's in HEX format
   * @static
   * @memberOf Color
   * @param {String} color ex: FF5555 or FF5544CC (RGBa)
   * @return {TRGBAColorSource | undefined} source
   */
  static sourceFromHex(color: string): TRGBAColorSource | undefined {
    if (color.match(reHex())) {
      const value = color.slice(color.indexOf('#') + 1),
        isShortNotation = value.length <= 4;
      let expandedValue: string[];
      if (isShortNotation) {
        expandedValue = value.split('').map((hex) => hex + hex);
      } else {
        expandedValue = value.match(/.{2}/g)!;
      }
      const [r, g, b, a = 255] = expandedValue.map((hexCouple) =>
        parseInt(hexCouple, 16)
      );
      return [r, g, b, a / 255];
    }
  }
}
