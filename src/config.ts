export type TConfiguration = Partial<BaseConfiguration>;

class BaseConfiguration {
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
  browserShadowBlurConstant = 1;

  /**
   * Pixel per Inch as a default value set to 96. Can be changed for more realistic conversion.
   */
  DPI = 96;

  /**
   * Device Pixel Ratio
   * @see https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/HTML-canvas-guide/SettingUptheCanvas/SettingUptheCanvas.html
   */
  devicePixelRatio =
    typeof window !== 'undefined' ? window.devicePixelRatio : 1; // eslint-disable-line no-restricted-globals

  /**
   * Pixel limit for cache canvases. 1Mpx , 4Mpx should be fine.
   * @since 1.7.14
   * @type Number
   */
  perfLimitSizeTotal = 2097152;

  /**
   * Pixel limit for cache canvases width or height. IE fixes the maximum at 5000
   * @since 1.7.14
   * @type Number
   */
  maxCacheSideLimit = 4096;

  /**
   * Lowest pixel limit for cache canvases, set at 256PX
   * @since 1.7.14
   * @type Number
   */
  minCacheSideLimit = 256;

  /**
   * When 'true', style information is not retained when copy/pasting text, making
   * pasted text use destination style.
   * Defaults to 'false'.
   * @type Boolean
   * @deprecated
   */
  disableStyleCopyPaste = false;

  /**
   * Enable webgl for filtering picture is available
   * A filtering backend will be initialized, this will both take memory and
   * time since a default 2048x2048 canvas will be created for the gl context
   * @since 2.0.0
   * @type Boolean
   */
  enableGLFiltering = true;

  /**
   * if webgl is enabled and available, textureSize will determine the size
   * of the canvas backend
   *
   * In order to support old hardware set to `2048` to avoid OOM
   *
   * @since 2.0.0
   * @type Number
   */
  textureSize = 4096;

  /**
   * Skip performance testing of setupGLContext and force the use of putImageData that seems to be the one that works best on
   * Chrome + old hardware. if your users are experiencing empty images after filtering you may try to force this to true
   * this has to be set before instantiating the filtering backend ( before filtering the first image )
   * @type Boolean
   * @default false
   */
  forceGLPutImageData = false;

  /**
   * If disabled boundsOfCurveCache is not used. For apps that make heavy usage of pencil drawing probably disabling it is better
   * With the standard behaviour of fabric to translate all curves in absolute commands and by not subtracting the starting point from
   * the curve is very hard to hit any cache.
   * Enable only if you know why it could be useful.
   * Candidate for removal/simplification
   * @default false
   */
  cachesBoundsOfCurve = false;

  /**
   * Map of font files
   * Map<fontFamily, pathToFile> of font files
   */
  fontPaths: Record</** fontFamily */ string, /** pathToFile */ string> = {};

  /**
   * Defines the number of fraction digits to use when serializing object values.
   * Used in exporting methods (`toObject`, `toJSON`, `toSVG`)
   * You can use it to increase/decrease precision of such values like left, top, scaleX, scaleY, etc.
   */
  NUM_FRACTION_DIGITS = 4;
}

export class Configuration extends BaseConfiguration {
  constructor(config?: TConfiguration) {
    super();
    this.configure(config);
  }

  configure(config: TConfiguration = {}) {
    Object.assign(this, config);
  }

  /**
   * Map<fontFamily, pathToFile> of font files
   */
  addFonts(
    paths: Record</** fontFamily */ string, /** pathToFile */ string> = {},
  ) {
    this.fontPaths = {
      ...this.fontPaths,
      ...paths,
    };
  }

  removeFonts(fontFamilys: string[] = []) {
    fontFamilys.forEach((fontFamily) => {
      delete this.fontPaths[fontFamily];
    });
  }

  clearFonts() {
    this.fontPaths = {};
  }

  restoreDefaults<T extends BaseConfiguration>(keys?: (keyof T)[]) {
    const defaults = new BaseConfiguration() as T;
    const config =
      keys?.reduce((acc, key) => {
        acc[key] = defaults[key];
        return acc;
      }, {} as T) || defaults;
    this.configure(config);
  }
}

export const config = new Configuration();
