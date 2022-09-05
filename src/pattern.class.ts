import { fabric } from "../HEADER";
import { config } from "./config";
import { TCrossOrigin, TMat2D } from "./typedefs";
import { loadImage } from "./util/misc/objectEnlive";
import { pick } from "./util/misc/pick";
import { toFixed } from "./util/misc/toFixed";

export type TPatternRepeat = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';

/**
 * Pattern class
 * @class fabric.Pattern
 * @see {@link http://fabricjs.com/patterns|Pattern demo}
 * @see {@link http://fabricjs.com/dynamic-patterns demo}
 */
export class Pattern {

  /**
   * @type TPatternRepeat
   * @defaults
   */
  repeat: TPatternRepeat = 'repeat'

  /**
   * Pattern horizontal offset from object's left/top corner
   * @type Number
   * @default
   */
  offsetX = 0

  /**
   * Pattern vertical offset from object's left/top corner
   * @type Number
   * @default
   */
  offsetY = 0

  /**
   * @type TCrossOrigin
   * @default
   */
  crossOrigin: TCrossOrigin = ''

  /**
   * transform matrix to change the pattern, imported from svgs.
   * @type Array
   * @default
   */
  patternTransform: TMat2D | null = null

  type = 'pattern'

  source!: CanvasImageSource;

  readonly id: number;

  /**
   * Constructor
   * @param {Object} [options] Options object
   * @param {option.source} [source] the pattern source, eventually empty or a drawable
   * @return {fabric.Pattern} thisArg
   */
  constructor(options = {}) {
    this.id = fabric.Object.__uid++;
    this.setOptions(options);
  }

  sourceToString() {
    return typeof this.source.src === 'string' ?
      // <img> element
      this.source.src :
      typeof this.source === 'object' && this.source.toDataURL ?
        // <canvas> element
        this.source.toDataURL() :
        '';
  }

  /**
   * Returns object representation of a pattern
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} Object representation of a pattern instance
   */
  toObject(propertiesToInclude: (keyof this)[]) {
    return {
      ...pick(this, propertiesToInclude),
      type: 'pattern',
      source: this.sourceToString(),
      repeat: this.repeat,
      crossOrigin: this.crossOrigin,
      offsetX: toFixed(this.offsetX, config.NUM_FRACTION_DIGITS),
      offsetY: toFixed(this.offsetY, config.NUM_FRACTION_DIGITS),
      patternTransform: this.patternTransform ? this.patternTransform.concat() : null
    };
  }

  /* _TO_SVG_START_ */
  /**
   * Returns SVG representation of a pattern
   * @param {fabric.Object} object
   * @return {String} SVG representation of a pattern
   */
  toSVG(object) {
    const patternSource = typeof this.source === 'function' ? this.source() : this.source,
      patternOffsetX = this.offsetX / object.width,
      patternOffsetY = this.offsetY / object.height,
      patternImgSrc = this.sourceToString();
    let patternWidth = patternSource.width / object.width,
      patternHeight = patternSource.height / object.height;
    if (this.repeat === 'repeat-x' || this.repeat === 'no-repeat') {
      patternHeight = 1 + Math.abs(patternOffsetY || 0);
    }
    if (this.repeat === 'repeat-y' || this.repeat === 'no-repeat') {
      patternWidth = 1 + Math.abs(patternOffsetX || 0);
    }

    return [
      `<pattern id="SVGID_${this.id}" x="${patternOffsetX}" y="${patternOffsetY}" width="${patternWidth}" height="${patternHeight}">`,
      `<image x="0" y="0" width="${patternSource.width}" height="${patternSource.height}" xlink:href="${patternImgSrc}"></image>`,
      `</pattern>`,
      ''
    ].join('\n');
  }
  /* _TO_SVG_END_ */

  setOptions<K extends keyof this>(options: Record<K, this[K]>) {
    for (const prop in options) {
      this[prop] = options[prop];
    }
  }

  /**
   * Returns an instance of CanvasPattern
   * @param {CanvasRenderingContext2D} ctx Context to create pattern
   * @return {CanvasPattern}
   */
  toLive(ctx: CanvasRenderingContext2D) {
    const source = this.source;

    if (
      // if the image failed to load, return, and allow rest to continue loading
      !source
      // if an image
      || (typeof source.src !== 'undefined'
        && (!source.complete || source.naturalWidth === 0 || source.naturalHeight === 0))
    ) {
      return '';
    }

    return ctx.createPattern(source, this.repeat);
  }

  /**
   *
   * @param {object} object
   * @param {object} [options]
   * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @returns
   */
  static async fromObject(object: any, options: { signal: AbortSignal }) {
    const img = await loadImage(object.source, {
      ...options,
      crossOrigin: object.crossOrigin
    })
    return new Pattern({ ...object, source: img });
  }
}


fabric.Pattern = Pattern;
