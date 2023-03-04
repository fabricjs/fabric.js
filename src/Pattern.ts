import { config } from './config';
import { TCrossOrigin, TMat2D, TSize } from './typedefs';
import { ifNaN } from './util/internals';
import { uid } from './util/internals/uid';
import { loadImage } from './util/misc/objectEnlive';
import { pick } from './util/misc/pick';
import { toFixed } from './util/misc/toFixed';
import { classRegistry } from './ClassRegistry';

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
  /**
   * Legacy identifier of the class. Prefer using this.constructor.name 'Pattern'
   * or utils like isPattern
   * Will be removed in fabric 7 or 8.
   * @TODO add sustainable warning message
   * @type string
   * @deprecated
   */
  get type() {
    return 'pattern';
  }

  set type(value) {
    console.warn('Setting type has no effect', value);
  }

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
   * @todo verify if using the identity matrix as default makes the rest of the code more easy
   * @type Array
   * @default
   */
  patternTransform: TMat2D | null = null;

  /**
   * The actual pixel source of the pattern
   */
  declare source: CanvasImageSource;

  /**
   * If true, this object will not be exported during the serialization of a canvas
   * @type boolean
   */
  declare excludeFromExport?: boolean;

  /**
   * ID used for SVG export functionalities
   * @type number
   */
  declare readonly id: number;

  /**
   * Constructor
   * @param {Object} [options] Options object
   * @param {option.source} [source] the pattern source, eventually empty or a drawable
   */
  constructor(options: TPatternOptions = {}) {
    this.id = uid();
    Object.assign(this, options);
  }

  /**
   * @returns true if {@link source} is an <img> element
   */
  isImageSource(): this is TImageSource {
    return (
      !!this.source && typeof (this.source as HTMLImageElement).src === 'string'
    );
  }

  /**
   * @returns true if {@link source} is a <canvas> element
   */
  isCanvasSource(): this is TCanvasSource {
    return !!this.source && !!(this.source as HTMLCanvasElement).toDataURL;
  }

  sourceToString(): string {
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
  toLive(ctx: CanvasRenderingContext2D): CanvasPattern | null {
    if (
      // if the image failed to load, return, and allow rest to continue loading
      !this.source ||
      // if an image
      (this.isImageSource() &&
        (!this.source.complete ||
          this.source.naturalWidth === 0 ||
          this.source.naturalHeight === 0))
    ) {
      return null;
    }

    return ctx.createPattern(this.source, this.repeat)!;
  }

  /**
   * Returns object representation of a pattern
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {object} Object representation of a pattern instance
   */
  toObject(propertiesToInclude: string[] = []): Record<string, any> {
    const { repeat, crossOrigin } = this;
    return {
      ...pick(this, propertiesToInclude as (keyof this)[]),
      type: 'pattern',
      source: this.sourceToString(),
      repeat,
      crossOrigin,
      offsetX: toFixed(this.offsetX, config.NUM_FRACTION_DIGITS),
      offsetY: toFixed(this.offsetY, config.NUM_FRACTION_DIGITS),
      patternTransform: this.patternTransform
        ? [...this.patternTransform]
        : null,
    };
  }

  /* _TO_SVG_START_ */
  /**
   * Returns SVG representation of a pattern
   */
  toSVG({ width, height }: TSize): string {
    const { source: patternSource, repeat, id } = this,
      patternOffsetX = ifNaN(this.offsetX / width, 0),
      patternOffsetY = ifNaN(this.offsetY / height, 0),
      patternWidth =
        repeat === 'repeat-y' || repeat === 'no-repeat'
          ? 1 + Math.abs(patternOffsetX || 0)
          : ifNaN((patternSource.width as number) / width, 0),
      patternHeight =
        repeat === 'repeat-x' || repeat === 'no-repeat'
          ? 1 + Math.abs(patternOffsetY || 0)
          : ifNaN((patternSource.height as number) / height, 0);

    return [
      `<pattern id="SVGID_${id}" x="${patternOffsetX}" y="${patternOffsetY}" width="${patternWidth}" height="${patternHeight}">`,
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
  ): Promise<Pattern> {
    const img = await loadImage(source, {
      ...options,
      crossOrigin: serialized.crossOrigin,
    });
    return new this({ ...serialized, source: img });
  }
}

classRegistry.setClass(Pattern);
// kept for compatibility reason
classRegistry.setClass(Pattern, 'pattern');
