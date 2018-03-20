//#region Globals

export const isLikelyNode: boolean;
export const isTouchSupported: boolean;

/**
 * Pixel per Inch as a default value set to 96. Can be changed for more realistic conversion.
 */
export var DPI: number;

/**
 * Pixel limit for cache canvases. 1Mpx , 4Mpx should be fine.
 */
export var perfLimitSizeTotal: number;

/**
 * Pixel limit for cache canvases width or height. IE fixes the maximum at 5000
 */
export let maxCacheSideLimit: number;

/**
 * Lowest pixel limit for cache canvases, set at 256PX
 */
export let minCacheSideLimit: number;

/**
 * Cache Object for widths of chars in text rendering.
 */
export const charWidthsCache: any;

/**
 * if webgl is enabled and available, textureSize will determine the size
 * of the canvas backend
 */
export let textureSize: number;

/**
 * Enable webgl for filtering picture is available
 * A filtering backend will be initialized, this will both take memory and
 * time since a default 2048x2048 canvas will be created for the gl context
 */
export let enableGLFiltering: boolean;

/**
 * Device Pixel Ratio
 * @see https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/HTML-canvas-guide/SettingUptheCanvas/SettingUptheCanvas.html
 */
export const devicePixelRatio: number;

/**
 * Browser-specific constant to adjust CanvasRenderingContext2D.shadowBlur value,
 * which is unitless and not rendered equally across browsers.
 *
 * Values that work quite well (as of October 2017) are:
 * - Chrome: 1.5
 * - Edge: 1.75
 * - Firefox: 0.9
 * - Safari: 0.95
 */
export let browserShadowBlurConstant: number;

//#endregion

//#region Shapes
import { Circle, CircleOptions} from "./shapes/circle";
export { Circle, CircleOptions};

import { Group, GroupOptions} from "./shapes/group";
export { Group, GroupOptions};

import { Image, ImageOptions } from "./shapes/image";
export { Image, ImageOptions };

import { Line, LineOptions } from "./shapes/line";
export { Line, LineOptions };

import { Object, ObjectOptions } from "./shapes/object";
export { Object, ObjectOptions };

import { Path, PathOptions } from "./shapes/path";
export { Path, PathOptions }

import { Rect } from './shapes/rect';
export { Rect };

import { Text, TextOptions } from "./shapes/text";
export { Text, TextOptions };

import { Triangle, TriangleOptions } from "./shapes/triangle";
export { Triangle, TriangleOptions };

//#endregion

//#region Canvas
import { StaticCanvas, StaticCanvasOptions } from "./static-canvas";
export { StaticCanvas, StaticCanvasOptions };

import { Canvas, CanvasOptions } from "./canvas";
export { Canvas, CanvasOptions };
//#endregion

import { Point } from "./point";
export { Point };

export * from "./parser";

import { util } from "./util/misc"
export { util };


export interface CommonMethods {
  /**
   * Sets property to a given value. When changing position/dimension -related properties (left, top, scale, angle, etc.) `set` does not update position of object's borders/controls. If you need to update those, call `setCoords()`.
   * @param {Object} key Object (iterate over the object properties)
   */
  set(options: Partial<this>) : this;


  /**
   * Sets property to a given value. When changing position/dimension -related properties (left, top, scale, angle, etc.) `set` does not update position of object's borders/controls. If you need to update those, call `setCoords()`.
   */
  set<K extends keyof this>(key: K, value: this[K] | ((value: this[K]) => this[K])): this;

  /**
   * Toggles specified property from `true` to `false` or from `false` to `true`
   * @param {String} property Property to toggle
   */
  toggle(property: keyof this) : this;

  /**
   * Basic getter
   * @param {String} property Property name
   */
  get<K extends keyof this>(property: K): this[K];
}

export interface IEvent {
  e: Event;
  target?: Object;
}
