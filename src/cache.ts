import { config } from './config';
import type { TRectBounds } from './typedefs';

type TextCouplesCache = Map</** char */ string, /** width */ number>;

type FamilyCache = Map</** fontStyleCacheKey */ string, TextCouplesCache>;

export class Cache {
  /**
   * Cache of widths of chars in text rendering.
   */
  declare charWidthsCache: Map</** fontFamily */ string, FamilyCache>;

  constructor() {
    this.charWidthsCache = new Map();
  }

  /**
   * @return {Object} reference to cache
   */
  getFontCache({
    fontFamily,
    fontStyle,
    fontWeight,
  }: {
    fontFamily: string;
    fontStyle: string;
    fontWeight: string | number;
  }): TextCouplesCache {
    fontFamily = fontFamily.toLowerCase();
    const cache = this.charWidthsCache;
    if (!cache.has(fontFamily)) {
      cache.set(fontFamily, new Map<string, TextCouplesCache>());
    }
    const fontCache = cache.get(fontFamily)!;
    const cacheKey = `${fontStyle.toLowerCase()}_${(
      fontWeight + ''
    ).toLowerCase()}`;
    if (!fontCache.has(cacheKey)) {
      fontCache.set(cacheKey, new Map<string, number>());
    }
    return fontCache.get(cacheKey)!;
  }

  /**
   * Clear char widths cache for the given font family or all the cache if no
   * fontFamily is specified.
   * Use it if you know you are loading fonts in a lazy way and you are not waiting
   * for custom fonts to load properly when adding text objects to the canvas.
   * If a text object is added when its own font is not loaded yet, you will get wrong
   * measurement and so wrong bounding boxes.
   * After the font cache is cleared, either change the textObject text content or call
   * initDimensions() to trigger a recalculation
   * @param {String} [fontFamily] font family to clear
   */
  clearFontCache(fontFamily?: string) {
    if (!fontFamily) {
      this.charWidthsCache = new Map();
    } else {
      this.charWidthsCache.delete((fontFamily || '').toLowerCase());
    }
  }

  /**
   * Given current aspect ratio, determines the max width and height that can
   * respect the total allowed area for the cache.
   * @param {number} ar aspect ratio
   * @return {number[]} Limited dimensions X and Y
   */
  limitDimsByArea(ar: number) {
    const { perfLimitSizeTotal } = config;
    const roughWidth = Math.sqrt(perfLimitSizeTotal * ar);
    // we are not returning a point on purpose, to avoid circular dependencies
    // this is an internal utility
    return [
      Math.floor(roughWidth),
      Math.floor(perfLimitSizeTotal / roughWidth),
    ];
  }

  /**
   * This object keeps the results of the boundsOfCurve calculation mapped by the joined arguments necessary to calculate it.
   * It does speed up calculation, if you parse and add always the same paths, but in case of heavy usage of freedrawing
   * you do not get any speed benefit and you get a big object in memory.
   * The object was a private variable before, while now is appended to the lib so that you have access to it and you
   * can eventually clear it.
   * It was an internal variable, is accessible since version 2.3.4
   */
  boundsOfCurveCache: Record<string, TRectBounds> = {};
}

export const cache = new Cache();
