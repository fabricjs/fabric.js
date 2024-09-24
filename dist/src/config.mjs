import { objectSpread2 as _objectSpread2, defineProperty as _defineProperty } from '../_virtual/_rollupPluginBabelHelpers.mjs';

class BaseConfiguration {
  constructor() {
    /**
     * Browser-specific constant to adjust CanvasRenderingContext2D.shadowBlur value,
     * which is unitless and not rendered equally across browsers.
     *
     * Values that work quite well (as of October 2017) are:
     * - Chrome: 1.5
     * - Edge: 1.75
     * - Firefox: 0.9
     * - Safari: 0.95
     *
     * @since 2.0.0
     * @type Number
     * @default 1
     */
    _defineProperty(this, "browserShadowBlurConstant", 1);
    /**
     * Pixel per Inch as a default value set to 96. Can be changed for more realistic conversion.
     */
    _defineProperty(this, "DPI", 96);
    /**
     * Device Pixel Ratio
     * @see https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/HTML-canvas-guide/SettingUptheCanvas/SettingUptheCanvas.html
     */
    _defineProperty(this, "devicePixelRatio", typeof window !== 'undefined' ? window.devicePixelRatio : 1);
    // eslint-disable-line no-restricted-globals
    /**
     * Pixel limit for cache canvases. 1Mpx , 4Mpx should be fine.
     * @since 1.7.14
     * @type Number
     * @default
     */
    _defineProperty(this, "perfLimitSizeTotal", 2097152);
    /**
     * Pixel limit for cache canvases width or height. IE fixes the maximum at 5000
     * @since 1.7.14
     * @type Number
     * @default
     */
    _defineProperty(this, "maxCacheSideLimit", 4096);
    /**
     * Lowest pixel limit for cache canvases, set at 256PX
     * @since 1.7.14
     * @type Number
     * @default
     */
    _defineProperty(this, "minCacheSideLimit", 256);
    /**
     * When 'true', style information is not retained when copy/pasting text, making
     * pasted text use destination style.
     * Defaults to 'false'.
     * @type Boolean
     * @default
     * @deprecated
     */
    _defineProperty(this, "disableStyleCopyPaste", false);
    /**
     * Enable webgl for filtering picture is available
     * A filtering backend will be initialized, this will both take memory and
     * time since a default 2048x2048 canvas will be created for the gl context
     * @since 2.0.0
     * @type Boolean
     * @default
     */
    _defineProperty(this, "enableGLFiltering", true);
    /**
     * if webgl is enabled and available, textureSize will determine the size
     * of the canvas backend
     *
     * In order to support old hardware set to `2048` to avoid OOM
     *
     * @since 2.0.0
     * @type Number
     * @default
     */
    _defineProperty(this, "textureSize", 4096);
    /**
     * Skip performance testing of setupGLContext and force the use of putImageData that seems to be the one that works best on
     * Chrome + old hardware. if your users are experiencing empty images after filtering you may try to force this to true
     * this has to be set before instantiating the filtering backend ( before filtering the first image )
     * @type Boolean
     * @default false
     */
    _defineProperty(this, "forceGLPutImageData", false);
    /**
     * If disabled boundsOfCurveCache is not used. For apps that make heavy usage of pencil drawing probably disabling it is better
     * With the standard behaviour of fabric to translate all curves in absolute commands and by not subtracting the starting point from
     * the curve is very hard to hit any cache.
     * Enable only if you know why it could be useful.
     * Candidate for removal/simplification
     * @default false
     */
    _defineProperty(this, "cachesBoundsOfCurve", false);
    /**
     * Map of font files
     * Map<fontFamily, pathToFile> of font files
     */
    _defineProperty(this, "fontPaths", {});
    /**
     * Defines the number of fraction digits to use when serializing object values.
     * Used in exporting methods (`toObject`, `toJSON`, `toSVG`)
     * You can use it to increase/decrease precision of such values like left, top, scaleX, scaleY, etc.
     */
    _defineProperty(this, "NUM_FRACTION_DIGITS", 4);
  }
}
class Configuration extends BaseConfiguration {
  constructor(config) {
    super();
    this.configure(config);
  }
  configure() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    Object.assign(this, config);
  }

  /**
   * Map<fontFamily, pathToFile> of font files
   */
  addFonts() {
    let paths = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.fontPaths = _objectSpread2(_objectSpread2({}, this.fontPaths), paths);
  }
  removeFonts() {
    let fontFamilys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    fontFamilys.forEach(fontFamily => {
      delete this.fontPaths[fontFamily];
    });
  }
  clearFonts() {
    this.fontPaths = {};
  }
  restoreDefaults(keys) {
    const defaults = new BaseConfiguration();
    const config = (keys === null || keys === void 0 ? void 0 : keys.reduce((acc, key) => {
      acc[key] = defaults[key];
      return acc;
    }, {})) || defaults;
    this.configure(config);
  }
}
const config = new Configuration();

export { Configuration, config };
//# sourceMappingURL=config.mjs.map
