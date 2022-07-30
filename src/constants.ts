import { context } from "./context";

export const halfPI = Math.PI / 2;

export const ALIASING_LIMIT = 2;

/**
 * Default SVG font size
 * @static
 * @memberOf Text
 */
export const DEFAULT_SVG_FONT_SIZE = 16;

/* _FROM_SVG_START_ */
/**
 * Attributes parsed from all SVG elements
 * @type array
 */
export const SHARED_ATTRIBUTES = [
    'display',
    'transform',
    'fill', 'fill-opacity', 'fill-rule',
    'opacity',
    'stroke', 'stroke-dasharray', 'stroke-linecap', 'stroke-dashoffset',
    'stroke-linejoin', 'stroke-miterlimit',
    'stroke-opacity', 'stroke-width',
    'id', 'paint-order', 'vector-effect',
    'instantiated_by_use', 'clip-path',
];
/* _FROM_SVG_END_ */

/**
 * Device Pixel Ratio
 * @see https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/HTML-canvas-guide/SettingUptheCanvas/SettingUptheCanvas.html
 */
export let devicePixelRatio = context.window.devicePixelRatio ||
    context.window.webkitDevicePixelRatio ||
    context.window.mozDevicePixelRatio ||
    1;

export const reNum = '(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:[eE][-+]?\\d+)?)';

export const commaWsp = '(?:\\s+,?\\s*|,\\s*)';

export const rePathCommand = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:[eE][-+]?\d+)?)/ig;

export const reNonWord = /[ \n\.,;!\?\-]/;

export const fontPaths = {};

export const iMatrix = Object.freeze([1, 0, 0, 1, 0, 0]);

export const svgNS = 'http://www.w3.org/2000/svg';

/**
 * True when in environment that supports touch events
 * @type boolean
 */
export const isTouchSupported = 'ontouchstart' in context.window || 'ontouchstart' in context.document ||
    (context.window && context.window.navigator && context.window.navigator.maxTouchPoints > 0);

/**
 * True when in environment that's probably Node.js
 * @type boolean
 */
export const isLikelyNode = typeof Buffer !== 'undefined' &&
    typeof window === 'undefined';

