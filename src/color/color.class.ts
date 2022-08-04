
//@ts-nocheck
import { max, min } from '../util';
import { ColorNameMap } from './color_map';
import { reHSLa, reHex, reRGBa } from './constants';
import { hue2rgb } from './hue2rgb';

/**
 * Color class
 * The purpose of {@link Color} is to abstract and encapsulate common color operations;
 * {@link Color} is a constructor and creates instances of {@link Color} objects.
 *
 * @class Color
 * @param {String} color optional in hex or rgb(a) or hsl format or from known color list
 * @return {Color} thisArg
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-2/#colors}
 */
export class Color {
  constructor(color?) {
    if (!color) {
      this.setSource([0, 0, 0, 1]);
    }
    else {
      this._tryParsingColor(color);
    }
  }

  /**
   * @private
   * @param {String|Array} color Color value to parse
   */
  _tryParsingColor(color) {
    let source;

    if (color in ColorNameMap) {
      color = ColorNameMap[color];
    }

    if (color === 'transparent') {
      source = [255, 255, 255, 0];
    }

    if (!source) {
      source = Color.sourceFromHex(color);
    }
    if (!source) {
      source = Color.sourceFromRgb(color);
    }
    if (!source) {
      source = Color.sourceFromHsl(color);
    }
    if (!source) {
      //if color is not recognize let's make black as canvas does
      source = [0, 0, 0, 1];
    }
    if (source) {
      this.setSource(source);
    }
  }

  /**
   * Adapted from <a href="https://rawgithub.com/mjijackson/mjijackson.github.com/master/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript.html">https://github.com/mjijackson</a>
   * @private
   * @param {Number} r Red color value
   * @param {Number} g Green color value
   * @param {Number} b Blue color value
   * @return {Array} Hsl color
   */
  _rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;

    let h, s, l,
      maxValue = max([r, g, b]),
      minValue = min([r, g, b]);

    l = (maxValue + minValue) / 2;

    if (maxValue === minValue) {
      h = s = 0; // achromatic
    }
    else {
      const d = maxValue - minValue;
      s = l > 0.5 ? d / (2 - maxValue - minValue) : d / (maxValue + minValue);
      switch (maxValue) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [
      Math.round(h * 360),
      Math.round(s * 100),
      Math.round(l * 100)
    ];
  }

  /**
   * Returns source of this color (where source is an array representation; ex: [200, 200, 100, 1])
   * @return {Array}
   */
  getSource() {
    return this._source;
  }

  /**
   * Sets source of this color (where source is an array representation; ex: [200, 200, 100, 1])
   * @param {Array} source
   */
  setSource(source) {
    this._source = source;
  }

  /**
   * Returns color representation in RGB format
   * @return {String} ex: rgb(0-255,0-255,0-255)
   */
  toRgb() {
    const source = this.getSource();
    return 'rgb(' + source[0] + ',' + source[1] + ',' + source[2] + ')';
  }

  /**
   * Returns color representation in RGBA format
   * @return {String} ex: rgba(0-255,0-255,0-255,0-1)
   */
  toRgba() {
    const source = this.getSource();
    return 'rgba(' + source[0] + ',' + source[1] + ',' + source[2] + ',' + source[3] + ')';
  }

  /**
   * Returns color representation in HSL format
   * @return {String} ex: hsl(0-360,0%-100%,0%-100%)
   */
  toHsl() {
    const source = this.getSource(),
      hsl = this._rgbToHsl(source[0], source[1], source[2]);

    return 'hsl(' + hsl[0] + ',' + hsl[1] + '%,' + hsl[2] + '%)';
  }

  /**
   * Returns color representation in HSLA format
   * @return {String} ex: hsla(0-360,0%-100%,0%-100%,0-1)
   */
  toHsla() {
    const source = this.getSource(),
      hsl = this._rgbToHsl(source[0], source[1], source[2]);

    return 'hsla(' + hsl[0] + ',' + hsl[1] + '%,' + hsl[2] + '%,' + source[3] + ')';
  }

  /**
   * Returns color representation in HEX format
   * @return {String} ex: FF5555
   */
  toHex() {
    let source = this.getSource(), r, g, b;

    r = source[0].toString(16);
    r = (r.length === 1) ? ('0' + r) : r;

    g = source[1].toString(16);
    g = (g.length === 1) ? ('0' + g) : g;

    b = source[2].toString(16);
    b = (b.length === 1) ? ('0' + b) : b;

    return r.toUpperCase() + g.toUpperCase() + b.toUpperCase();
  }

  /**
   * Returns color representation in HEXA format
   * @return {String} ex: FF5555CC
   */
  toHexa() {
    let source = this.getSource(), a;

    a = Math.round(source[3] * 255);
    a = a.toString(16);
    a = (a.length === 1) ? ('0' + a) : a;

    return this.toHex() + a.toUpperCase();
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
  setAlpha(alpha) {
    const source = this.getSource();
    source[3] = alpha;
    this.setSource(source);
    return this;
  }

  /**
   * Transforms color to its grayscale representation
   * @return {Color} thisArg
   */
  toGrayscale() {
    const source = this.getSource(),
      average = parseInt((source[0] * 0.3 + source[1] * 0.59 + source[2] * 0.11).toFixed(0), 10),
      currentAlpha = source[3];
    this.setSource([average, average, average, currentAlpha]);
    return this;
  }

  /**
   * Transforms color to its black and white representation
   * @param {Number} threshold
   * @return {Color} thisArg
   */
  toBlackWhite(threshold) {
    let source = this.getSource(),
      average = (source[0] * 0.3 + source[1] * 0.59 + source[2] * 0.11).toFixed(0),
      currentAlpha = source[3];

    threshold = threshold || 127;

    average = (Number(average) < Number(threshold)) ? 0 : 255;
    this.setSource([average, average, average, currentAlpha]);
    return this;
  }

  /**
   * Overlays color with another color
   * @param {String|Color} otherColor
   * @return {Color} thisArg
   */
  overlayWith(otherColor) {
    if (!(otherColor instanceof Color)) {
      otherColor = new Color(otherColor);
    }

    let result = [],
      alpha = this.getAlpha(),
      otherAlpha = 0.5,
      source = this.getSource(),
      otherSource = otherColor.getSource(), i;

    for (i = 0; i < 3; i++) {
      result.push(Math.round((source[i] * (1 - otherAlpha)) + (otherSource[i] * otherAlpha)));
    }

    result[3] = alpha;
    this.setSource(result);
    return this;
  }



  /**
   * Returns new color object, when given a color in RGB format
   * @memberOf Color
   * @param {String} color Color value ex: rgb(0-255,0-255,0-255)
   * @return {Color}
   */
  static fromRgb(color) {
    return Color.fromSource(Color.sourceFromRgb(color));
  }

  /**
   * Returns array representation (ex: [100, 100, 200, 1]) of a color that's in RGB or RGBA format
   * @memberOf Color
   * @param {String} color Color value ex: rgb(0-255,0-255,0-255), rgb(0%-100%,0%-100%,0%-100%)
   * @return {Array} source
   */
  static sourceFromRgb(color) {
    const match = color.match(reRGBa);
    if (match) {
      const r = parseInt(match[1], 10) / (/%$/.test(match[1]) ? 100 : 1) * (/%$/.test(match[1]) ? 255 : 1),
        g = parseInt(match[2], 10) / (/%$/.test(match[2]) ? 100 : 1) * (/%$/.test(match[2]) ? 255 : 1),
        b = parseInt(match[3], 10) / (/%$/.test(match[3]) ? 100 : 1) * (/%$/.test(match[3]) ? 255 : 1);

      return [
        parseInt(r, 10),
        parseInt(g, 10),
        parseInt(b, 10),
        match[4] ? parseFloat(match[4]) : 1
      ];
    }
  }

  /**
   * Returns new color object, when given a color in RGBA format
   * @static
   * @function
   * @memberOf Color
   * @param {String} color
   * @return {Color}
   */
  static fromRgba = Color.fromRgb

  /**
   * Returns new color object, when given a color in HSL format
   * @param {String} color Color value ex: hsl(0-260,0%-100%,0%-100%)
   * @memberOf Color
   * @return {Color}
   */
  static fromHsl(color) {
    return Color.fromSource(Color.sourceFromHsl(color));
  }

  /**
   * Returns array representation (ex: [100, 100, 200, 1]) of a color that's in HSL or HSLA format.
   * Adapted from <a href="https://rawgithub.com/mjijackson/mjijackson.github.com/master/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript.html">https://github.com/mjijackson</a>
   * @memberOf Color
   * @param {String} color Color value ex: hsl(0-360,0%-100%,0%-100%) or hsla(0-360,0%-100%,0%-100%, 0-1)
   * @return {Array} source
   * @see http://http://www.w3.org/TR/css3-color/#hsl-color
   */
  static sourceFromHsl(color) {
    const match = color.match(reHSLa);
    if (!match) {
      return;
    }

    let h = (((parseFloat(match[1]) % 360) + 360) % 360) / 360,
      s = parseFloat(match[2]) / (/%$/.test(match[2]) ? 100 : 1),
      l = parseFloat(match[3]) / (/%$/.test(match[3]) ? 100 : 1),
      r, g, b;

    if (s === 0) {
      r = g = b = l;
    }
    else {
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
      match[4] ? parseFloat(match[4]) : 1
    ];
  }

  /**
   * Returns new color object, when given a color in HSLA format
   * @static
   * @function
   * @memberOf Color
   * @param {String} color
   * @return {Color}
   */
  static fromHsla = Color.fromHsl

  /**
   * Returns new color object, when given a color in HEX format
   * @static
   * @memberOf Color
   * @param {String} color Color value ex: FF5555
   * @return {Color}
   */
  static fromHex(color) {
    return Color.fromSource(Color.sourceFromHex(color));
  }

  /**
   * Returns array representation (ex: [100, 100, 200, 1]) of a color that's in HEX format
   * @static
   * @memberOf Color
   * @param {String} color ex: FF5555 or FF5544CC (RGBa)
   * @return {Array} source
   */
  static sourceFromHex(color) {
    if (color.match(reHex)) {
      const value = color.slice(color.indexOf('#') + 1),
        isShortNotation = (value.length === 3 || value.length === 4),
        isRGBa = (value.length === 8 || value.length === 4),
        r = isShortNotation ? (value.charAt(0) + value.charAt(0)) : value.substring(0, 2),
        g = isShortNotation ? (value.charAt(1) + value.charAt(1)) : value.substring(2, 4),
        b = isShortNotation ? (value.charAt(2) + value.charAt(2)) : value.substring(4, 6),
        a = isRGBa ? (isShortNotation ? (value.charAt(3) + value.charAt(3)) : value.substring(6, 8)) : 'FF';

      return [
        parseInt(r, 16),
        parseInt(g, 16),
        parseInt(b, 16),
        parseFloat((parseInt(a, 16) / 255).toFixed(2))
      ];
    }
  }

  /**
   * Returns new color object, when given color in array representation (ex: [200, 100, 100, 0.5])
   * @static
   * @memberOf Color
   * @param {Array} source
   * @return {Color}
   */
  static fromSource(source) {
    const oColor = new Color();
    oColor.setSource(source);
    return oColor;
  }


}



