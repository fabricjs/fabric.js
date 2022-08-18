//@ts-nocheck

import { fabric } from "../../HEADER";
import { Color } from "../color";
import { iMatrix, incrementUID } from "../constants";
import { parseTransformAttribute } from "../parser/parseTransformAttribute";
import { matrixToSVG, populateWithProperties } from "../util";
import { convertPercentUnitsToValues } from "./convertPercentUnitsToValues";
import { parseColorStops } from "./parseColorStops";
import { parseCoords, parseType } from "./parser";

type SVGOptions = {
  /**
   * width part of the viewBox attribute on svg
   */
  viewBoxWidth: number,
  /**
   * height part of the viewBox attribute on svg
   */
  viewBoxHeight: number,
  /**
   * width part of the svg tag if viewBox is not specified
   */
  width: number,
  /**
   * height part of the svg tag if viewBox is not specified
   */
}
type GradientUnits = 'pixels' | 'percentage';
type GradientType = 'linear' | 'radial';

/**
 * Gradient class
 * @class Gradient
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-2#gradients}
 */
export class Gradient {

  /**
   * Horizontal offset for aligning gradients coming from SVG when outside pathgroups
   * @type Number
   * @default 0
   */
  offsetX = 0

  /**
   * Vertical offset for aligning gradients coming from SVG when outside pathgroups
   * @type Number
   * @default 0
   */
  offsetY = 0

  /**
   * A transform matrix to apply to the gradient before painting.
   * Imported from svg gradients, is not applied with the current transform in the center.
   * Before this transform is applied, the origin point is at the top left corner of the object
   * plus the addition of offsetY and offsetX.
   * @type Number[]
   * @default null
   */
  gradientTransform = null

  /**
   * coordinates units for coords.
   * If `pixels`, the number of coords are in the same unit of width / height.
   * If set as `percentage` the coords are still a number, but 1 means 100% of width
   * for the X and 100% of the height for the y. It can be bigger than 1 and negative.
   * allowed values pixels or percentage.
   * @type GradientUnits
   * @default 'pixels'
   */
  gradientUnits: GradientUnits = 'pixels'

  /**
   * Gradient type linear or radial
   * @type GradientType
   * @default 'linear'
   */
  type: GradientType = 'linear'

  /**
   * Constructor
   * @param {Object} options Options object with type, coords, gradientUnits and colorStops
   * @param {Object} [options.type] gradient type linear or radial
   * @param {Object} [options.gradientUnits] gradient units
   * @param {Object} [options.offsetX] SVG import compatibility
   * @param {Object} [options.offsetY] SVG import compatibility
   * @param {Object[]} options.colorStops contains the colorstops.
   * @param {Object} options.coords contains the coords of the gradient
   * @param {Number} [options.coords.x1] X coordiante of the first point for linear or of the focal point for radial
   * @param {Number} [options.coords.y1] Y coordiante of the first point for linear or of the focal point for radial
   * @param {Number} [options.coords.x2] X coordiante of the second point for linear or of the center point for radial
   * @param {Number} [options.coords.y2] Y coordiante of the second point for linear or of the center point for radial
   * @param {Number} [options.coords.r1] only for radial gradient, radius of the inner circle
   * @param {Number} [options.coords.r2] only for radial gradient, radius of the external circle
   * @return {Gradient} thisArg
   */
  constructor({ coords, colorStops, ...options } = {}) {
    // sets everything, then coords and colorstops get sets again
    Object.keys(options).forEach((option) => {
      this[option] = options[option];
    });

    const uid = fabric.Object.__uid++;
    this.id = this.id ? `${this.id}_${uid}` : uid;

    const coords = {
      x1 = 0,
      y1 = 0,
      x2 = 0,
      y2 = 0
    } = options.coords || {};
    const radii = this.type === 'radial' ?
      {
        r1 = 0,
        r2 = 0,
      } = options.coords || {} :
      {};
    this.coords = { ...coords, ...radii };
    this.colorStops = colorStops.slice();
  }

  /**
   * Adds another colorStop
   * @param {Object} colorStop Object with offset and color
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
  toObject(propertiesToInclude: string[]) {
    const object = {
      type: this.type,
      coords: this.coords,
      colorStops: this.colorStops,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      gradientUnits: this.gradientUnits,
      gradientTransform: this.gradientTransform ? this.gradientTransform.concat() : this.gradientTransform
    };
    populateWithProperties(this, object, propertiesToInclude);

    return object;
  }

  /* _TO_SVG_START_ */
  /**
   * Returns SVG representation of an gradient
   * @param {object} object Object to create a gradient for
   * @return {String} SVG representation of an gradient (linear/radial)
   */
  toSVG(object: object, options = {}) {
    const markup = [],
      coords = this.coords,
      needsSwap = coords.r1 > coords.r2,
      transform = this.gradientTransform ? this.gradientTransform.concat() : iMatrix.concat(),
      gradientUnits = this.gradientUnits === 'pixels' ? 'userSpaceOnUse' : 'objectBoundingBox';
    // colorStops must be sorted ascending
    let colorStops = this.colorStops.sort(function (a, b) {
      return a.offset - b.offset;
    });

    let offsetX = -this.offsetX, offsetY = -this.offsetY;
    if (gradientUnits === 'objectBoundingBox') {
      offsetX /= object.width;
      offsetY /= object.height;
    }
    else {
      offsetX += object.width / 2;
      offsetY += object.height / 2;
    }
    if (object.type === 'path' && this.gradientUnits !== 'percentage') {
      offsetX -= object.pathOffset.x;
      offsetY -= object.pathOffset.y;
    }
    transform[4] -= offsetX;
    transform[5] -= offsetY;

    const commonAttributes = [
      `id="SVGID_${this.id}"`,
      `gradientUnits="${gradientUnits}"`,
      `gradientTransform="${options.additionalTransform ? options.additionalTransform + ' ' : ''}${matrixToSVG(transform)}"`,
      ''
    ].join(' ');

    if (this.type === 'linear') {
      markup.push(
        '<linearGradient ',
        commonAttributes,
        ' x1="', coords.x1,
        '" y1="', coords.y1,
        '" x2="', coords.x2,
        '" y2="', coords.y2,
        '">\n'
      );
    }
    else if (this.type === 'radial') {
      // svg radial gradient has just 1 radius. the biggest.
      markup.push(
        '<radialGradient ',
        commonAttributes,
        ' cx="', needsSwap ? coords.x1 : coords.x2,
        '" cy="', needsSwap ? coords.y1 : coords.y2,
        '" r="', needsSwap ? coords.r1 : coords.r2,
        '" fx="', needsSwap ? coords.x2 : coords.x1,
        '" fy="', needsSwap ? coords.y2 : coords.y1,
        '">\n'
      );
    }

    if (this.type === 'radial') {
      if (needsSwap) {
        // svg goes from internal to external radius. if radius are inverted, swap color stops.
        colorStops = colorStops.reverse();
        colorStops.forEach(colorStop => {
          colorStop.offset = 1 - colorStop.offset;
        });
      }
      const minRadius = Math.min(coords.r1, coords.r2);
      if (minRadius > 0) {
        // i have to shift all colorStops and add new one in 0.
        const maxRadius = Math.max(coords.r1, coords.r2),
          percentageShift = minRadius / maxRadius;
        colorStops.forEach(colorStop => {
          colorStop.offset += percentageShift * (1 - colorStop.offset);
        });
      }
    }

    colorStops.forEach(colorStop => {
      markup.push(
        '<stop ',
        'offset="', (colorStop.offset * 100) + '%',
        '" style="stop-color:', colorStop.color,
        (typeof colorStop.opacity !== 'undefined' ? ';stop-opacity: ' + colorStop.opacity : ';'),
        '"/>\n'
      );
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
  toLive(ctx: CanvasRenderingContext2D) {
    if (!this.type) {
      return;
    }

    const coords = this.coords;
    let gradient: CanvasGradient;

    if (this.type === 'linear') {
      gradient = ctx.createLinearGradient(
        coords.x1, coords.y1, coords.x2, coords.y2);
    }
    else if (this.type === 'radial') {
      gradient = ctx.createRadialGradient(
        coords.x1, coords.y1, coords.r1, coords.x2, coords.y2, coords.r2);
    }

    this.colorStops.forEach(({ color, opacity, offset }) => {
      gradient.addColorStop(
        offset,
        typeof opacity !== 'undefined' ?
          new Color(color).setAlpha(opacity).toRgba() :
          color
      );
    });

    return gradient;
  }

  /* _FROM_SVG_START_ */
  /**
   * Returns {@link Gradient} instance from an SVG element
   * @static
   * @memberOf Gradient
   * @param {SVGGradientElement} el SVG gradient element
   * @param {FabricObject} instance
   * @param {String} opacityAttr A fill-opacity or stroke-opacity attribute to multiply to each stop's opacity.
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
  static fromElement(el: SVGGradientElement, instance: fabric.Object, opacityAttr: string, svgOptions: SVGOptions): Gradient {

    const gradientUnits = el.getAttribute('gradientUnits') === 'userSpaceOnUse' ?
        'pixels' :
        'percentage';

    return new Gradient({
      id: el.getAttribute('id'),
      type: parseType(el),
      coords: convertPercentUnitsToValues(
        parseCoords(el),
        svgOptions,
        gradientUnits
      ),
      colorStops: parseColorStops(el, opacityAttr),
      gradientUnits,
      gradientTransform: parseTransformAttribute(el.getAttribute('gradientTransform') || ''),
      ...(gradientUnits === 'pixels' ?
        {
          offsetX: -instance.left,
          offsetY: -instance.top
        } : {
          offsetX: 0,
          offsetY: 0
        })
    });

  }
  /* _FROM_SVG_END_ */
}

fabric.Gradient = Gradient;
