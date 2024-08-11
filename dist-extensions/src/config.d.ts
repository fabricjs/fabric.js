export type TConfiguration = Partial<BaseConfiguration>;
declare class BaseConfiguration {
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
    browserShadowBlurConstant: number;
    /**
     * Pixel per Inch as a default value set to 96. Can be changed for more realistic conversion.
     */
    DPI: number;
    /**
     * Device Pixel Ratio
     * @see https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/HTML-canvas-guide/SettingUptheCanvas/SettingUptheCanvas.html
     */
    devicePixelRatio: number;
    /**
     * Pixel limit for cache canvases. 1Mpx , 4Mpx should be fine.
     * @since 1.7.14
     * @type Number
     * @default
     */
    perfLimitSizeTotal: number;
    /**
     * Pixel limit for cache canvases width or height. IE fixes the maximum at 5000
     * @since 1.7.14
     * @type Number
     * @default
     */
    maxCacheSideLimit: number;
    /**
     * Lowest pixel limit for cache canvases, set at 256PX
     * @since 1.7.14
     * @type Number
     * @default
     */
    minCacheSideLimit: number;
    /**
     * When 'true', style information is not retained when copy/pasting text, making
     * pasted text use destination style.
     * Defaults to 'false'.
     * @type Boolean
     * @default
     * @deprecated
     */
    disableStyleCopyPaste: boolean;
    /**
     * Enable webgl for filtering picture is available
     * A filtering backend will be initialized, this will both take memory and
     * time since a default 2048x2048 canvas will be created for the gl context
     * @since 2.0.0
     * @type Boolean
     * @default
     */
    enableGLFiltering: boolean;
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
    textureSize: number;
    /**
     * Skip performance testing of setupGLContext and force the use of putImageData that seems to be the one that works best on
     * Chrome + old hardware. if your users are experiencing empty images after filtering you may try to force this to true
     * this has to be set before instantiating the filtering backend ( before filtering the first image )
     * @type Boolean
     * @default false
     */
    forceGLPutImageData: boolean;
    /**
     * If disabled boundsOfCurveCache is not used. For apps that make heavy usage of pencil drawing probably disabling it is better
     * @default true
     */
    cachesBoundsOfCurve: boolean;
    /**
     * Map of font files
     * Map<fontFamily, pathToFile> of font files
     */
    fontPaths: Record</** fontFamily */ string, /** pathToFile */ string>;
    /**
     * Defines the number of fraction digits to use when serializing object values.
     * Used in exporting methods (`toObject`, `toJSON`, `toSVG`)
     * You can use it to increase/decrease precision of such values like left, top, scaleX, scaleY, etc.
     */
    NUM_FRACTION_DIGITS: number;
}
export declare class Configuration extends BaseConfiguration {
    constructor(config?: TConfiguration);
    configure(config?: TConfiguration): void;
    /**
     * Map<fontFamily, pathToFile> of font files
     */
    addFonts(paths?: Record</** fontFamily */ string, /** pathToFile */ string>): void;
    removeFonts(fontFamilys?: string[]): void;
    clearFonts(): void;
    restoreDefaults<T extends BaseConfiguration>(keys?: (keyof T)[]): void;
}
export declare const config: Configuration;
export {};
//# sourceMappingURL=config.d.ts.map