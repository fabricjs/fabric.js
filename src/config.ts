
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
let browserShadowBlurConstant = 1;


/**
 * Pixel per Inch as a default value set to 96. Can be changed for more realistic conversion.
 */
let DPI = 96;

/**
 * Pixel limit for cache canvases. 1Mpx , 4Mpx should be fine.
 * @since 1.7.14
 * @type Number
 * @default
 */
let perfLimitSizeTotal = 2097152;

/**
 * Pixel limit for cache canvases width or height. IE fixes the maximum at 5000
 * @since 1.7.14
 * @type Number
 * @default
 */
let maxCacheSideLimit = 4096;

/**
 * Lowest pixel limit for cache canvases, set at 256PX
 * @since 1.7.14
 * @type Number
 * @default
 */
let minCacheSideLimit = 256;

/**
 * if webgl is enabled and available, textureSize will determine the size
 * of the canvas backend
 * @since 2.0.0
 * @type Number
 * @default
 */
let textureSize = 2048;

/**
 * When 'true', style information is not retained when copy/pasting text, making
 * pasted text use destination style.
 * Defaults to 'false'.
 * @type Boolean
 * @default
 */
let disableStyleCopyPaste = false;

/**
 * Enable webgl for filtering picture is available
 * A filtering backend will be initialized, this will both take memory and
 * time since a default 2048x2048 canvas will be created for the gl context
 * @since 2.0.0
 * @type Boolean
 * @default
 */
let enableGLFiltering = true;


/**
 * If disabled boundsOfCurveCache is not used. For apps that make heavy usage of pencil drawing probably disabling it is better
 * @default true
 */
let cachesBoundsOfCurve = true;

/**
 * Skip performance testing of setupGLContext and force the use of putImageData that seems to be the one that works best on
 * Chrome + old hardware. if your users are experiencing empty images after filtering you may try to force this to true
 * this has to be set before instantiating the filtering backend ( before filtering the first image )
 * @type Boolean
 * @default false
 */
let forceGLPutImageData = false;

let NUM_FRACTION_DIGITS = 2;

export default {
    get DPI() {
        return DPI;
    },
    set DPI(value: number) {
        DPI = value;
    },
    get NUM_FRACTION_DIGITS() {
        return NUM_FRACTION_DIGITS;
    },
    set NUM_FRACTION_DIGITS(value: number) {
        NUM_FRACTION_DIGITS = value;
    },
    get browserShadowBlurConstant() {
        return browserShadowBlurConstant;
    },
    set browserShadowBlurConstant(value: number) {
        browserShadowBlurConstant = value;
    },
    get cachesBoundsOfCurve() {
        return cachesBoundsOfCurve;
    },
    set cachesBoundsOfCurve(value: boolean) {
        cachesBoundsOfCurve = value;
    },
    get disableStyleCopyPaste() {
        return disableStyleCopyPaste;
    },
    set disableStyleCopyPaste(value: boolean) {
        disableStyleCopyPaste = value;
    },
    get enableGLFiltering() {
        return enableGLFiltering;
    },
    set enableGLFiltering(value: boolean) {
        enableGLFiltering = value;
    },
    get forceGLPutImageData() {
        return forceGLPutImageData;
    },
    set forceGLPutImageData(value: boolean) {
        forceGLPutImageData = value;
    },
    get maxCacheSideLimit() {
        return maxCacheSideLimit;
    },
    set maxCacheSideLimit(value: number) {
        maxCacheSideLimit = value;
    },
    get minCacheSideLimit() {
        return minCacheSideLimit;
    },
    set minCacheSideLimit(value: number) {
        minCacheSideLimit = value;
    },
    get perfLimitSizeTotal() {
        return perfLimitSizeTotal;
    },
    set perfLimitSizeTotal(value: number) {
        perfLimitSizeTotal = value;
    },
    get textureSize() {
        return textureSize;
    },
    set textureSize(value: number) {
        textureSize = value;
    },
}