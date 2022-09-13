import { fabric } from '../../HEADER';
import { Color } from '../color';
import { iMatrix } from '../constants';
import { Filler, TFillerRenderingOptions } from '../Filler';
import { parseTransformAttribute } from '../parser/parseTransformAttribute';
import { Point } from '../point.class';
import { TMat2D } from '../typedefs';
import {
  invertTransform,
  multiplyTransformMatrices,
  multiplyTransformMatrices2,
  transformPoint,
} from '../util/misc/matrix';
import { pick } from '../util/misc/pick';
import { matrixToSVG } from '../util/misc/svgParsing';
import { type TObject } from '../__types__';
import { linearDefaultCoords, radialDefaultCoords } from './constants';
import {
  parseColorStops,
  parseCoords,
  parseGradientUnits,
  parseType,
} from './parser';
import {
  ColorStop,
  GradientCoords,
  GradientOptions,
  GradientType,
  GradientUnits,
  SVGOptions,
} from './typedefs';

// type TGradientExportedKeys = TFillerExportedKeys | 'type' | 'coords' | 'colorStops' | 'gradientUnits' | 'gradientTransform';

/**
 * Gradient class
 * @class Gradient
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-2#gradients}
 */
export class Gradient<
  S,
  T extends GradientType = S extends GradientType ? S : 'linear'
> extends Filler<CanvasGradient> {
  /**
   * A transform matrix to apply to the gradient before painting.
   * Imported from svg gradients, is not applied with the current transform in the center.
   * Before this transform is applied, the origin point is at the top left corner of the object
   * plus the addition of offsetY and offsetX.
   * @type Number[]
   * @default null
   */
  gradientTransform: TMat2D | null = null;

  /**
   * coordinates units for coords.
   * If `pixels`, the number of coords are in the same unit of width / height.
   * If set as `percentage` the coords are still a number, but 1 means 100% of width
   * for the X and 100% of the height for the y. It can be bigger than 1 and negative.
   * allowed values pixels or percentage.
   * @type GradientUnits
   * @default 'pixels'
   */
  gradientUnits: GradientUnits = 'pixels';

  /**
   * Gradient type linear or radial
   * @type GradientType
   * @default 'linear'
   */
  type: T;

  coords: GradientCoords<T>;

  colorStops: ColorStop[];

  private id: string | number;

  constructor({
    type = 'linear' as T,
    gradientUnits = 'pixels',
    coords,
    colorStops = [],
    offsetX = 0,
    offsetY = 0,
    gradientTransform,
    id,
  }: GradientOptions<T>) {
    const uid = fabric.Object.__uid++;
    super();
    this.id = id ? `${id}_${uid}` : uid;
    this.type = type;
    this.gradientUnits = gradientUnits;
    this.gradientTransform = gradientTransform || null;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.coords = {
      ...(this.type === 'radial' ? radialDefaultCoords : linearDefaultCoords),
      ...coords,
    } as GradientCoords<T>;
    this.colorStops = colorStops.slice();
  }

  isType<S extends GradientType>(type: S): this is Gradient<S> {
    return (this.type as GradientType) === type;
  }

  /**
   * Adds another colorStop
   * @param {Record<string, string>} colorStop Object with offset and color
   * @return {Gradient} thisArg
   */
  addColorStop(colorStops: Record<string, string>) {
    for (const position in colorStops) {
      const color = new Color(colorStops[position]);
      this.colorStops.push({
        offset: parseFloat(position),
        color: color.toRgb(),
        opacity: color.getAlpha(),
      });
    }
    return this;
  }

  /**
   * A linear gradient is created along the line connecting the two given coordinates.
   * e.g. if we have a linear gradient denfined by a vector along the x axis a line of color will be drawn on the y axis.
   *
   * This means that in order to transform a linear gradient by it's coordinates we need to apply a rotation matrix on the given transform.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createLinearGradient
   */
  private calcTransform({
    size,
    offset,
    noTransform,
  }: TFillerRenderingOptions) {
    const t = (!noTransform && this.gradientTransform) || iMatrix;
    const gradientCenter = new Point(
      this.coords.x1,
      this.coords.y1
    ).midPointFrom(new Point(this.coords.x2, this.coords.y2));
    // rotate 90deg from center of gradient
    const rotate = multiplyTransformMatrices2([
      [1, 0, 0, 1, gradientCenter.x / 2, gradientCenter.y / 2],
      [0, -1, 1, 0, 0, 0],
      [1, 0, 0, 1, -gradientCenter.x / 2, -gradientCenter.y / 2],
    ]);
    return multiplyTransformMatrices(
      [1, 0, 0, 1, offset.x, offset.y],
      multiplyTransformMatrices2(
        [
          invertTransform(rotate),
          t,
          rotate,
          // scale to size
          this.gradientUnits === 'percentage'
            ? [size.width || 1, 0, 0, size.height || 1, 0, 0]
            : iMatrix,
        ],
        true
      )
    );
  }

  protected toLive(
    ctx: CanvasRenderingContext2D,
    { transform, noTransform }: TFillerRenderingOptions & { transform: TMat2D }
  ) {
    if (!this.type) {
      return null;
    }
    const coords = this.coords as GradientCoords<'radial'>;
    const t = this.gradientTransform || iMatrix;
    let gradient: CanvasGradient;
    if (this.type === 'linear') {
      const p1 = transformPoint(new Point(coords.x1, coords.y1), transform);
      const p2 = transformPoint(new Point(coords.x2, coords.y2), transform);
      console.log(p1, p2);
      if (p1.eq(p2) || t[0] === 0 || t[3] === 0) {
        return null;
      }
      gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
      noTransform && ctx.transform(...(this.gradientTransform || iMatrix));
    } else {
      gradient = ctx.createRadialGradient(
        coords.x1,
        coords.y1,
        coords.r1,
        coords.x2,
        coords.y2,
        coords.r2
      );
      ctx.transform(...transform);
    }

    this.colorStops.forEach(({ color, opacity, offset }) => {
      gradient.addColorStop(
        offset,
        typeof opacity !== 'undefined'
          ? new Color(color).setAlpha(opacity).toRgba()
          : color
      );
    });

    return gradient;
  }

  protected prepare(
    ctx: CanvasRenderingContext2D,
    options: TFillerRenderingOptions
  ) {
    const transform = this.calcTransform(options);
    ctx[`${options.action}Style`] =
      this.toLive(ctx, { ...options, transform }) || 'transparent';
    return this.type === 'radial'
      ? new Point().transform(transform).scalarMultiply(-1)
      : undefined;
  }

  toObject(propertiesToInclude?: (keyof this)[]) {
    return {
      ...pick(this, propertiesToInclude),
      ...super.toObject(propertiesToInclude),
      type: this.type,
      coords: this.coords,
      colorStops: this.colorStops,
      gradientUnits: this.gradientUnits,
      gradientTransform: this.gradientTransform
        ? this.gradientTransform.concat()
        : this.gradientTransform,
    };
  }

  /* _TO_SVG_START_ */
  /**
   * Returns SVG representation of an gradient
   * @param {fabric.Object} object Object to create a gradient for
   * @return {String} SVG representation of an gradient (linear/radial)
   */
  toSVG(
    object: TObject,
    { additionalTransform: preTransform }: { additionalTransform?: string } = {}
  ) {
    const markup = [],
      transform = (
        this.gradientTransform
          ? this.gradientTransform.concat()
          : iMatrix.concat()
      ) as TMat2D,
      gradientUnits =
        this.gradientUnits === 'pixels'
          ? 'userSpaceOnUse'
          : 'objectBoundingBox';
    // colorStops must be sorted ascending, and guarded against deep mutations
    const colorStops = this.colorStops
      .map((colorStop) => ({ ...colorStop }))
      .sort((a, b) => {
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
    if (object.type === 'path' && this.gradientUnits !== 'percentage') {
      offsetX -= object.pathOffset.x;
      offsetY -= object.pathOffset.y;
    }
    transform[4] -= offsetX;
    transform[5] -= offsetY;

    const commonAttributes = [
      `id="SVGID_${this.id}"`,
      `gradientUnits="${gradientUnits}"`,
      `gradientTransform="${
        preTransform ? preTransform + ' ' : ''
      }${matrixToSVG(transform)}"`,
      '',
    ].join(' ');

    if (this.type === 'linear') {
      const { x1, y1, x2, y2 } = this.coords;
      markup.push(
        '<linearGradient ',
        commonAttributes,
        ' x1="',
        x1,
        '" y1="',
        y1,
        '" x2="',
        x2,
        '" y2="',
        y2,
        '">\n'
      );
    } else if (this.type === 'radial') {
      const { x1, y1, x2, y2, r1, r2 } = this
        .coords as GradientCoords<'radial'>;
      const needsSwap = r1 > r2;
      // svg radial gradient has just 1 radius. the biggest.
      markup.push(
        '<radialGradient ',
        commonAttributes,
        ' cx="',
        needsSwap ? x1 : x2,
        '" cy="',
        needsSwap ? y1 : y2,
        '" r="',
        needsSwap ? r1 : r2,
        '" fx="',
        needsSwap ? x2 : x1,
        '" fy="',
        needsSwap ? y2 : y1,
        '">\n'
      );
      if (needsSwap) {
        // svg goes from internal to external radius. if radius are inverted, swap color stops.
        colorStops.reverse(); //  mutates array
        colorStops.forEach((colorStop) => {
          colorStop.offset = 1 - colorStop.offset;
        });
      }
      const minRadius = Math.min(r1, r2);
      if (minRadius > 0) {
        // i have to shift all colorStops and add new one in 0.
        const maxRadius = Math.max(r1, r2),
          percentageShift = minRadius / maxRadius;
        colorStops.forEach((colorStop) => {
          colorStop.offset += percentageShift * (1 - colorStop.offset);
        });
      }
    }

    colorStops.forEach(({ color, offset, opacity }) => {
      markup.push(
        '<stop ',
        'offset="',
        offset * 100 + '%',
        '" style="stop-color:',
        color,
        typeof opacity !== 'undefined' ? ';stop-opacity: ' + opacity : ';',
        '"/>\n'
      );
    });

    markup.push(
      this.type === 'linear' ? '</linearGradient>' : '</radialGradient>',
      '\n'
    );

    return markup.join('');
  }
  /* _TO_SVG_END_ */

  /* _FROM_SVG_START_ */
  /**
   * Returns {@link Gradient} instance from an SVG element
   * @static
   * @memberOf Gradient
   * @param {SVGGradientElement} el SVG gradient element
   * @param {TObject} instance
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
  static fromElement(
    el: SVGGradientElement,
    instance: TObject,
    svgOptions: SVGOptions
  ): Gradient<GradientType> {
    const gradientUnits = parseGradientUnits(el);
    return new Gradient({
      id: el.getAttribute('id') || undefined,
      type: parseType(el),
      coords: parseCoords(el, {
        width: svgOptions.viewBoxWidth || svgOptions.width,
        height: svgOptions.viewBoxHeight || svgOptions.height,
      }),
      colorStops: parseColorStops(el, svgOptions.opacity),
      gradientUnits,
      gradientTransform: parseTransformAttribute(
        el.getAttribute('gradientTransform') || ''
      ),
      ...(gradientUnits === 'pixels'
        ? {
            offsetX: -instance.left,
            offsetY: -instance.top,
          }
        : {
            offsetX: 0,
            offsetY: 0,
          }),
    });
  }
  /* _FROM_SVG_END_ */
}

fabric.Gradient = Gradient;
