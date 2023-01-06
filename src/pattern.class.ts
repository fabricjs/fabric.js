//@ts-nocheck
import { config } from './config';
import { TCrossOrigin, TMat2D, TSize } from './typedefs';
import { ifNaN } from './util/internals';
import { uid } from './util/internals/uid';
import { loadImage } from './util/misc/objectEnlive';
import { pick } from './util/misc/pick';
import { toFixed } from './util/misc/toFixed';
import { classRegistry } from './util/class_registry';

export type TPatternRepeat = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';

type TExportedKeys =
  | 'crossOrigin'
  | 'offsetX'
  | 'offsetY'
  | 'patternTransform'
  | 'repeat'
  | 'source';

export type TPatternOptions = Partial<Pick<Pattern, TExportedKeys>>;

export type TPatternSerialized = TPatternOptions & {
  source: string;
};

export type TPatternHydrationOptions = {
  /**
   * handle aborting
   * @see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   */
  signal?: AbortSignal;
};

type TImageSource = { source: HTMLImageElement };
type TCanvasSource = { source: HTMLCanvasElement };

/**
 * @see {@link http://fabricjs.com/patterns demo}
 * @see {@link http://fabricjs.com/dynamic-patterns demo}
 */
export class Pattern {
  type = 'pattern';

  /**
   * @type TPatternRepeat
   * @defaults
   */
  repeat: TPatternRepeat = 'repeat';

  /**
   * Pattern horizontal offset from object's left/top corner
   * @type Number
   * @default
   */
  offsetX = 0;

  /**
   * Pattern vertical offset from object's left/top corner
   * @type Number
   * @default
   */
  offsetY = 0;

  /**
   * @type TCrossOrigin
   * @default
   */
  crossOrigin: TCrossOrigin = '';

  /**
   * transform matrix to change the pattern, imported from svgs.
   * @type Array
   * @default
   */
  patternTransform: TMat2D | null = null;

  /**
   * The actual pixel source of the pattern
   */
  source!: CanvasImageSource;

  /**
   * If true, this object will not be exported during the serialization of a canvas
   * @type boolean
   */
  excludeFromExport?: boolean;

  readonly id: number;

  /**
   * Constructor
   * @param {Object} [options] Options object
   * @param {option.source} [source] the pattern source, eventually empty or a drawable
   */
  constructor(options: TPatternOptions = {}) {
    this.id = uid();
    this.setOptions(options);
  }

  setOptions<K extends TExportedKeys>(options: Record<K, this[K]>) {
    for (const prop in options) {
      this[prop] = options[prop];
    }
  }

  /**
   * @returns true if {@link source} is an <img> element
   */
  isImageSource(): this is TImageSource {
    return typeof this.source.src === 'string';
  }

  /**
   * @returns true if {@link source} is a <canvas> element
   */
  isCanvasSource(): this is TCanvasSource {
    return typeof this.source === 'object' && this.source.toDataURL;
  }

  sourceToString() {
    return this.isImageSource()
      ? this.source.src
      : this.isCanvasSource()
      ? this.source.toDataURL()
      : '';
  }

  /**
   * Returns an instance of CanvasPattern
   * @param {CanvasRenderingContext2D} ctx Context to create pattern
   * @return {CanvasPattern}
   */
  toLive(ctx: CanvasRenderingContext2D): CanvasPattern | string {
    if (
      // if the image failed to load, return, and allow rest to continue loading
      !this.source ||
      // if an image
      (this.isImageSource() &&
        (!this.source.complete ||
          this.source.naturalWidth === 0 ||
          this.source.naturalHeight === 0))
    ) {
      return '';
    }

    return ctx.createPattern(this.source, this.repeat);
  }

  /**
   * Returns object representation of a pattern
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {object} Object representation of a pattern instance
   */
  toObject(propertiesToInclude?: (keyof this | string)[]) {
    return {
      ...pick(this, propertiesToInclude),
      type: 'pattern',
      source: this.sourceToString(),
      repeat: this.repeat,
      crossOrigin: this.crossOrigin,
      offsetX: toFixed(this.offsetX, config.NUM_FRACTION_DIGITS),
      offsetY: toFixed(this.offsetY, config.NUM_FRACTION_DIGITS),
      patternTransform: this.patternTransform
        ? this.patternTransform.concat()
        : null,
    };
  }

  /* _TO_SVG_START_ */
  /**
   * Returns SVG representation of a pattern
   */
  toSVG({ width, height }: TSize) {
    const patternSource = this.source,
      patternOffsetX = ifNaN(this.offsetX / width, 0),
      patternOffsetY = ifNaN(this.offsetY / height, 0),
      patternWidth =
        this.repeat === 'repeat-y' || this.repeat === 'no-repeat'
          ? 1 + Math.abs(patternOffsetX || 0)
          : ifNaN(patternSource.width / width, 0),
      patternHeight =
        this.repeat === 'repeat-x' || this.repeat === 'no-repeat'
          ? 1 + Math.abs(patternOffsetY || 0)
          : ifNaN(patternSource.height / height, 0);

    return [
      `<pattern id="SVGID_${this.id}" x="${patternOffsetX}" y="${patternOffsetY}" width="${patternWidth}" height="${patternHeight}">`,
      `<image x="0" y="0" width="${patternSource.width}" height="${
        patternSource.height
      }" xlink:href="${this.sourceToString()}"></image>`,
      `</pattern>`,
      '',
    ].join('\n');
  }
  /* _TO_SVG_END_ */

  static async fromObject(
    { source, ...serialized }: TPatternSerialized,
    options: TPatternHydrationOptions
  ) {
    const img = await loadImage(source, {
      ...options,
      crossOrigin: serialized.crossOrigin,
    });
    return new this({ ...serialized, source: img });
  }
}

classRegistry.setClass(Pattern, 'pattern');
