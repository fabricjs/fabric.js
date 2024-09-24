import { defineProperty as _defineProperty } from '../_virtual/_rollupPluginBabelHelpers.mjs';
import { config } from './config.mjs';

class Cache {
  constructor() {
    /**
     * Cache of widths of chars in text rendering.
     */
    _defineProperty(this, "charWidthsCache", {});
    /**
     * This object keeps the results of the boundsOfCurve calculation mapped by the joined arguments necessary to calculate it.
     * It does speed up calculation, if you parse and add always the same paths, but in case of heavy usage of freedrawing
     * you do not get any speed benefit and you get a big object in memory.
     * The object was a private variable before, while now is appended to the lib so that you have access to it and you
     * can eventually clear it.
     * It was an internal variable, is accessible since version 2.3.4
     */
    _defineProperty(this, "boundsOfCurveCache", {});
  }
  /**
   * @return {Object} reference to cache
   */
  getFontCache(_ref) {
    let {
      fontFamily,
      fontStyle,
      fontWeight
    } = _ref;
    fontFamily = fontFamily.toLowerCase();
    if (!this.charWidthsCache[fontFamily]) {
      this.charWidthsCache[fontFamily] = {};
    }
    const fontCache = this.charWidthsCache[fontFamily];
    const cacheKey = "".concat(fontStyle.toLowerCase(), "_").concat((fontWeight + '').toLowerCase());
    if (!fontCache[cacheKey]) {
      fontCache[cacheKey] = {};
    }
    return fontCache[cacheKey];
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
  clearFontCache(fontFamily) {
    fontFamily = (fontFamily || '').toLowerCase();
    if (!fontFamily) {
      this.charWidthsCache = {};
    } else if (this.charWidthsCache[fontFamily]) {
      delete this.charWidthsCache[fontFamily];
    }
  }

  /**
   * Given current aspect ratio, determines the max width and height that can
   * respect the total allowed area for the cache.
   * @param {number} ar aspect ratio
   * @return {number[]} Limited dimensions X and Y
   */
  limitDimsByArea(ar) {
    const {
      perfLimitSizeTotal
    } = config;
    const roughWidth = Math.sqrt(perfLimitSizeTotal * ar);
    // we are not returning a point on purpose, to avoid circular dependencies
    // this is an internal utility
    return [Math.floor(roughWidth), Math.floor(perfLimitSizeTotal / roughWidth)];
  }
}
const cache = new Cache();

export { Cache, cache };
//# sourceMappingURL=cache.mjs.map
