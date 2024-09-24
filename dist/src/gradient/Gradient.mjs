import { defineProperty as _defineProperty, objectSpread2 as _objectSpread2 } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { Color } from '../color/Color.mjs';
import { iMatrix } from '../constants.mjs';
import { parseTransformAttribute } from '../parser/parseTransformAttribute.mjs';
import { uid } from '../util/internals/uid.mjs';
import { pick } from '../util/misc/pick.mjs';
import { matrixToSVG } from '../util/misc/svgParsing.mjs';
import { radialDefaultCoords, linearDefaultCoords } from './constants.mjs';
import { parseColorStops } from './parser/parseColorStops.mjs';
import { parseCoords } from './parser/parseCoords.mjs';
import { parseGradientUnits, parseType } from './parser/misc.mjs';
import { classRegistry } from '../ClassRegistry.mjs';
import { isPath } from '../util/typeAssertions.mjs';

/**
 * Gradient class
 * @class Gradient
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-2#gradients}
 */
class Gradient {
  constructor(options) {
    const {
      type = 'linear',
      gradientUnits = 'pixels',
      coords = {},
      colorStops = [],
      offsetX = 0,
      offsetY = 0,
      gradientTransform,
      id
    } = options || {};
    Object.assign(this, {
      type,
      gradientUnits,
      coords: _objectSpread2(_objectSpread2({}, type === 'radial' ? radialDefaultCoords : linearDefaultCoords), coords),
      colorStops,
      offsetX,
      offsetY,
      gradientTransform,
      id: id ? "".concat(id, "_").concat(uid()) : uid()
    });
  }

  /**
   * Adds another colorStop
   * @param {Record<string, string>} colorStop Object with offset and color
   * @return {Gradient} thisArg
   */
  addColorStop(colorStops) {
    for (const position in colorStops) {
      const color = new Color(colorStops[position]);
      this.colorStops.push({
        offset: parseFloat(position),
        color: color.toRgb(),
        opacity: color.getAlpha()
      });
    }
    return this;
  }

  /**
   * Returns object representation of a gradient
   * @param {string[]} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {object}
   */
  toObject(propertiesToInclude) {
    return _objectSpread2(_objectSpread2({}, pick(this, propertiesToInclude)), {}, {
      type: this.type,
      coords: _objectSpread2({}, this.coords),
      colorStops: this.colorStops.map(colorStop => _objectSpread2({}, colorStop)),
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      gradientUnits: this.gradientUnits,
      gradientTransform: this.gradientTransform ? [...this.gradientTransform] : undefined
    });
  }

  /* _TO_SVG_START_ */
  /**
   * Returns SVG representation of an gradient
   * @param {FabricObject} object Object to create a gradient for
   * @return {String} SVG representation of an gradient (linear/radial)
   */
  toSVG(object) {
    let {
      additionalTransform: preTransform
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const markup = [],
      transform = this.gradientTransform ? this.gradientTransform.concat() : iMatrix.concat(),
      gradientUnits = this.gradientUnits === 'pixels' ? 'userSpaceOnUse' : 'objectBoundingBox';
    // colorStops must be sorted ascending, and guarded against deep mutations
    const colorStops = this.colorStops.map(colorStop => _objectSpread2({}, colorStop)).sort((a, b) => {
      return a.offset - b.offset;
    });
    let offsetX = -this.offsetX,
      offsetY = -this.offsetY;
    if (gradientUnits === 'objectBoundingBox') {
      offsetX /= object.width;
      offsetY /= object.height;
    } else {
      offsetX += object.width / 2;
      offsetY += object.height / 2;
    }
    // todo what about polygon/polyline?
    if (isPath(object) && this.gradientUnits !== 'percentage') {
      offsetX -= object.pathOffset.x;
      offsetY -= object.pathOffset.y;
    }
    transform[4] -= offsetX;
    transform[5] -= offsetY;
    const commonAttributes = ["id=\"SVGID_".concat(this.id, "\""), "gradientUnits=\"".concat(gradientUnits, "\""), "gradientTransform=\"".concat(preTransform ? preTransform + ' ' : '').concat(matrixToSVG(transform), "\""), ''].join(' ');
    if (this.type === 'linear') {
      const {
        x1,
        y1,
        x2,
        y2
      } = this.coords;
      markup.push('<linearGradient ', commonAttributes, ' x1="', x1, '" y1="', y1, '" x2="', x2, '" y2="', y2, '">\n');
    } else if (this.type === 'radial') {
      const {
        x1,
        y1,
        x2,
        y2,
        r1,
        r2
      } = this.coords;
      const needsSwap = r1 > r2;
      // svg radial gradient has just 1 radius. the biggest.
      markup.push('<radialGradient ', commonAttributes, ' cx="', needsSwap ? x1 : x2, '" cy="', needsSwap ? y1 : y2, '" r="', needsSwap ? r1 : r2, '" fx="', needsSwap ? x2 : x1, '" fy="', needsSwap ? y2 : y1, '">\n');
      if (needsSwap) {
        // svg goes from internal to external radius. if radius are inverted, swap color stops.
        colorStops.reverse(); //  mutates array
        colorStops.forEach(colorStop => {
          colorStop.offset = 1 - colorStop.offset;
        });
      }
      const minRadius = Math.min(r1, r2);
      if (minRadius > 0) {
        // i have to shift all colorStops and add new one in 0.
        const maxRadius = Math.max(r1, r2),
          percentageShift = minRadius / maxRadius;
        colorStops.forEach(colorStop => {
          colorStop.offset += percentageShift * (1 - colorStop.offset);
        });
      }
    }
    colorStops.forEach(_ref => {
      let {
        color,
        offset,
        opacity
      } = _ref;
      markup.push('<stop ', 'offset="', offset * 100 + '%', '" style="stop-color:', color, typeof opacity !== 'undefined' ? ';stop-opacity: ' + opacity : ';', '"/>\n');
    });
    markup.push(this.type === 'linear' ? '</linearGradient>' : '</radialGradient>', '\n');
    return markup.join('');
  }
  /* _TO_SVG_END_ */

  /**
   * Returns an instance of CanvasGradient
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @return {CanvasGradient}
   */
  toLive(ctx) {
    const {
      x1,
      y1,
      x2,
      y2,
      r1,
      r2
    } = this.coords;
    const gradient = this.type === 'linear' ? ctx.createLinearGradient(x1, y1, x2, y2) : ctx.createRadialGradient(x1, y1, r1, x2, y2, r2);
    this.colorStops.forEach(_ref2 => {
      let {
        color,
        opacity,
        offset
      } = _ref2;
      gradient.addColorStop(offset, typeof opacity !== 'undefined' ? new Color(color).setAlpha(opacity).toRgba() : color);
    });
    return gradient;
  }
  static async fromObject(options) {
    const {
      colorStops,
      gradientTransform
    } = options;
    return new this(_objectSpread2(_objectSpread2({}, options), {}, {
      colorStops: colorStops ? colorStops.map(colorStop => _objectSpread2({}, colorStop)) : undefined,
      gradientTransform: gradientTransform ? [...gradientTransform] : undefined
    }));
  }

  /* _FROM_SVG_START_ */
  /**
   * Returns {@link Gradient} instance from an SVG element
   * @static
   * @memberOf Gradient
   * @param {SVGGradientElement} el SVG gradient element
   * @param {FabricObject} instance
   * @param {String} opacity A fill-opacity or stroke-opacity attribute to multiply to each stop's opacity.
   * @param {SVGOptions} svgOptions an object containing the size of the SVG in order to parse correctly gradients
   * that uses gradientUnits as 'userSpaceOnUse' and percentages.
   * @return {Gradient} Gradient instance
   * @see http://www.w3.org/TR/SVG/pservers.html#LinearGradientElement
   * @see http://www.w3.org/TR/SVG/pservers.html#RadialGradientElement
   *
   *  @example
   *
   *  <linearGradient id="linearGrad1">
   *    <stop offset="0%" stop-color="white"/>
   *    <stop offset="100%" stop-color="black"/>
   *  </linearGradient>
   *
   *  OR
   *
   *  <linearGradient id="linearGrad2">
   *    <stop offset="0" style="stop-color:rgb(255,255,255)"/>
   *    <stop offset="1" style="stop-color:rgb(0,0,0)"/>
   *  </linearGradient>
   *
   *  OR
   *
   *  <radialGradient id="radialGrad1">
   *    <stop offset="0%" stop-color="white" stop-opacity="1" />
   *    <stop offset="50%" stop-color="black" stop-opacity="0.5" />
   *    <stop offset="100%" stop-color="white" stop-opacity="1" />
   *  </radialGradient>
   *
   *  OR
   *
   *  <radialGradient id="radialGrad2">
   *    <stop offset="0" stop-color="rgb(255,255,255)" />
   *    <stop offset="0.5" stop-color="rgb(0,0,0)" />
   *    <stop offset="1" stop-color="rgb(255,255,255)" />
   *  </radialGradient>
   *
   */
  static fromElement(el, instance, svgOptions) {
    const gradientUnits = parseGradientUnits(el);
    const center = instance._findCenterFromElement();
    return new this(_objectSpread2({
      id: el.getAttribute('id') || undefined,
      type: parseType(el),
      coords: parseCoords(el, {
        width: svgOptions.viewBoxWidth || svgOptions.width,
        height: svgOptions.viewBoxHeight || svgOptions.height
      }),
      colorStops: parseColorStops(el, svgOptions.opacity),
      gradientUnits,
      gradientTransform: parseTransformAttribute(el.getAttribute('gradientTransform') || '')
    }, gradientUnits === 'pixels' ? {
      offsetX: instance.width / 2 - center.x,
      offsetY: instance.height / 2 - center.y
    } : {
      offsetX: 0,
      offsetY: 0
    }));
  }
  /* _FROM_SVG_END_ */
}
/**
 * Horizontal offset for aligning gradients coming from SVG when outside pathgroups
 * @type Number
 * @default 0
 */
/**
 * Vertical offset for aligning gradients coming from SVG when outside pathgroups
 * @type Number
 * @default 0
 */
/**
 * A transform matrix to apply to the gradient before painting.
 * Imported from svg gradients, is not applied with the current transform in the center.
 * Before this transform is applied, the origin point is at the top left corner of the object
 * plus the addition of offsetY and offsetX.
 * @type Number[]
 * @default null
 */
/**
 * coordinates units for coords.
 * If `pixels`, the number of coords are in the same unit of width / height.
 * If set as `percentage` the coords are still a number, but 1 means 100% of width
 * for the X and 100% of the height for the y. It can be bigger than 1 and negative.
 * allowed values pixels or percentage.
 * @type GradientUnits
 * @default 'pixels'
 */
/**
 * Gradient type linear or radial
 * @type GradientType
 * @default 'linear'
 */
/**
 * Defines how the gradient is located in space and spread
 * @type GradientCoords
 */
/**
 * Defines how many colors a gradient has and how they are located on the axis
 * defined by coords
 * @type GradientCoords
 */
/**
 * If true, this object will not be exported during the serialization of a canvas
 * @type boolean
 */
/**
 * ID used for SVG export functionalities
 * @type number | string
 */
_defineProperty(Gradient, "type", 'Gradient');
classRegistry.setClass(Gradient, 'gradient');
classRegistry.setClass(Gradient, 'linear');
classRegistry.setClass(Gradient, 'radial');

export { Gradient };
//# sourceMappingURL=Gradient.mjs.map
