import { JSDOM } from 'jsdom';
import utils from 'jsdom/lib/jsdom/living/generated/utils.js';

function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

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
     */
    _defineProperty(this, "perfLimitSizeTotal", 2097152);
    /**
     * Pixel limit for cache canvases width or height. IE fixes the maximum at 5000
     * @since 1.7.14
     * @type Number
     */
    _defineProperty(this, "maxCacheSideLimit", 4096);
    /**
     * Lowest pixel limit for cache canvases, set at 256PX
     * @since 1.7.14
     * @type Number
     */
    _defineProperty(this, "minCacheSideLimit", 256);
    /**
     * When 'true', style information is not retained when copy/pasting text, making
     * pasted text use destination style.
     * Defaults to 'false'.
     * @type Boolean
     * @deprecated
     */
    _defineProperty(this, "disableStyleCopyPaste", false);
    /**
     * Enable webgl for filtering picture is available
     * A filtering backend will be initialized, this will both take memory and
     * time since a default 2048x2048 canvas will be created for the gl context
     * @since 2.0.0
     * @type Boolean
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
    this.fontPaths = {
      ...this.fontPaths,
      ...paths
    };
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

const log = function (severity) {
  for (var _len = arguments.length, optionalParams = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    optionalParams[_key - 1] = arguments[_key];
  }
  return (
    // eslint-disable-next-line no-restricted-syntax
    console[severity]('fabric', ...optionalParams)
  );
};
class FabricError extends Error {
  constructor(message, options) {
    super(`fabric: ${message}`, options);
  }
}
class SignalAbortedError extends FabricError {
  constructor(context) {
    super(`${context} 'options.signal' is in 'aborted' state`);
  }
}

class GLProbe {}

/**
 * Lazy initialize WebGL constants
 */
class WebGLProbe extends GLProbe {
  /**
   * Tests if webgl supports certain precision
   * @param {WebGL} Canvas WebGL context to test on
   * @param {GLPrecision} Precision to test can be any of following
   * @returns {Boolean} Whether the user's browser WebGL supports given precision.
   */
  testPrecision(gl, precision) {
    const fragmentSource = `precision ${precision} float;\nvoid main(){}`;
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) {
      return false;
    }
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);
    return !!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
  }

  /**
   * query browser for WebGL
   */
  queryWebGL(canvas) {
    const gl = canvas.getContext('webgl');
    if (gl) {
      this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      this.GLPrecision = ['highp', 'mediump', 'lowp'].find(precision => this.testPrecision(gl, precision));
      gl.getExtension('WEBGL_lose_context').loseContext();
      log('log', `WebGL: max texture size ${this.maxTextureSize}`);
    }
  }
  isSupported(textureSize) {
    return !!this.maxTextureSize && this.maxTextureSize >= textureSize;
  }
}

/* eslint-disable no-restricted-globals */
const copyPasteData$1 = {};
const getEnv$2 = () => {
  return {
    document,
    window,
    isTouchSupported: 'ontouchstart' in window || 'ontouchstart' in document || window && window.navigator && window.navigator.maxTouchPoints > 0,
    WebGLProbe: new WebGLProbe(),
    dispose() {
      // noop
    },
    copyPasteData: copyPasteData$1
  };
};

/**
 * This file is consumed by fabric.
 * The `./node` and `./browser` files define the env variable that is used by this module.
 * The `./browser` module is defined to be the default env and doesn't set the env at all.
 * This is done in order to support isomorphic usage for browser and node applications
 * since window and document aren't defined at time of import in SSR, we can't set env so we avoid it by deferring to the default env.
 */

let env;

/**
 * Sets the environment variables used by fabric.\
 * This is exposed for special cases, such as configuring a test environment, and should be used with care.
 *
 * **CAUTION**: Must be called before using the package.
 *
 * @example
 * <caption>Passing `window` and `document` objects to fabric (in case they are mocked or something)</caption>
 * import { getEnv, setEnv } from 'fabric';
 * // we want fabric to use the `window` and `document` objects exposed by the environment we are running in.
 * setEnv({ ...getEnv(), window, document });
 * // done with setup, using fabric is now safe
 */
const setEnv = value => {
  env = value;
};

/**
 * In order to support SSR we **MUST** access the browser env only after the window has loaded
 */
const getEnv$1 = () => env || (env = getEnv$2());
const getFabricDocument = () => getEnv$1().document;
const getFabricWindow = () => getEnv$1().window;

/**
 * @returns the config value if defined, fallbacks to the environment value
 */
const getDevicePixelRatio = () => {
  var _config$devicePixelRa;
  return Math.max((_config$devicePixelRa = config.devicePixelRatio) !== null && _config$devicePixelRa !== void 0 ? _config$devicePixelRa : getFabricWindow().devicePixelRatio, 1);
};

/**
 * @todo GL rendering in node is possible:
 * - https://github.com/stackgl/headless-gl
 * - https://github.com/akira-cn/node-canvas-webgl
 */
class NodeGLProbe extends GLProbe {
  queryWebGL() {
    // noop
  }
  isSupported() {
    return false;
  }
}

/* eslint-disable no-restricted-globals */

const {
  implForWrapper: jsdomImplForWrapper
} = utils;
const copyPasteData = {};
const {
  window: JSDOMWindow
} = new JSDOM(decodeURIComponent('%3C!DOCTYPE%20html%3E%3Chtml%3E%3Chead%3E%3C%2Fhead%3E%3Cbody%3E%3C%2Fbody%3E%3C%2Fhtml%3E'), {
  resources: 'usable',
  // needed for `requestAnimationFrame`
  pretendToBeVisual: true
});
const getNodeCanvas = canvasEl => {
  const impl = jsdomImplForWrapper(canvasEl);
  return impl._canvas || impl._image;
};
const dispose = element => {
  const impl = jsdomImplForWrapper(element);
  if (impl) {
    impl._image = null;
    impl._canvas = null;
    // unsure if necessary
    impl._currentSrc = null;
    impl._attributes = null;
    impl._classList = null;
  }
};
const getEnv = () => {
  return {
    document: JSDOMWindow.document,
    window: JSDOMWindow,
    isTouchSupported: false,
    WebGLProbe: new NodeGLProbe(),
    dispose,
    copyPasteData
  };
};

class Cache {
  /**
   * Cache of widths of chars in text rendering.
   */

  constructor() {
    /**
     * This object keeps the results of the boundsOfCurve calculation mapped by the joined arguments necessary to calculate it.
     * It does speed up calculation, if you parse and add always the same paths, but in case of heavy usage of freedrawing
     * you do not get any speed benefit and you get a big object in memory.
     * The object was a private variable before, while now is appended to the lib so that you have access to it and you
     * can eventually clear it.
     * It was an internal variable, is accessible since version 2.3.4
     */
    _defineProperty(this, "boundsOfCurveCache", {});
    this.charWidthsCache = new Map();
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
    const cache = this.charWidthsCache;
    if (!cache.has(fontFamily)) {
      cache.set(fontFamily, new Map());
    }
    const fontCache = cache.get(fontFamily);
    const cacheKey = `${fontStyle.toLowerCase()}_${(fontWeight + '').toLowerCase()}`;
    if (!fontCache.has(cacheKey)) {
      fontCache.set(cacheKey, new Map());
    }
    return fontCache.get(cacheKey);
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

var version = "7.0.0";

// use this syntax so babel plugin see this import here
const VERSION = version;
// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}
const halfPI = Math.PI / 2;
const quarterPI = Math.PI / 4;
const twoMathPi = Math.PI * 2;
const PiBy180 = Math.PI / 180;
const iMatrix = Object.freeze([1, 0, 0, 1, 0, 0]);
const DEFAULT_SVG_FONT_SIZE = 16;
const ALIASING_LIMIT = 2;

/* "magic number" for bezier approximations of arcs (http://itc.ktu.lt/itc354/Riskus354.pdf) */
const kRect = 1 - 0.5522847498;
const CENTER = 'center';
const LEFT = 'left';
const TOP = 'top';
const BOTTOM = 'bottom';
const RIGHT = 'right';
const NONE = 'none';
const reNewline = /\r?\n/;
const MOVING = 'moving';
const SCALING = 'scaling';
const ROTATING = 'rotating';
const ROTATE = 'rotate';
const SKEWING = 'skewing';
const RESIZING = 'resizing';
const MODIFY_POLY = 'modifyPoly';
const MODIFY_PATH = 'modifyPath';
const CHANGED = 'changed';
const SCALE = 'scale';
const SCALE_X = 'scaleX';
const SCALE_Y = 'scaleY';
const SKEW_X = 'skewX';
const SKEW_Y = 'skewY';
const FILL = 'fill';
const STROKE = 'stroke';
const MODIFIED = 'modified';
const LTR = 'ltr';
const RTL = 'rtl';
const NORMAL = 'normal';

/*
 * This Map connects the objects type value with their
 * class implementation. It used from any object to understand which are
 * the classes to enlive when requesting a object.type = 'path' for example.
 * Objects uses it for clipPath, Canvas uses it for everything.
 * This is necessary for generic code to run and enlive instances from serialized representation.
 * You can customize which classes get enlived from SVG parsing using this classRegistry.
 * The Registry start empty and gets filled in depending which files you import.
 * If you want to be able to parse arbitrary SVGs or JSON representation of canvases, coming from
 * different sources you will need to import all fabric because you may need all classes.
 */

const JSON$1 = 'json';
const SVG = 'svg';
class ClassRegistry {
  constructor() {
    this[JSON$1] = new Map();
    this[SVG] = new Map();
  }
  has(classType) {
    return this[JSON$1].has(classType);
  }
  getClass(classType) {
    const constructor = this[JSON$1].get(classType);
    if (!constructor) {
      throw new FabricError(`No class registered for ${classType}`);
    }
    return constructor;
  }
  setClass(classConstructor, classType) {
    if (classType) {
      this[JSON$1].set(classType, classConstructor);
    } else {
      this[JSON$1].set(classConstructor.type, classConstructor);
      // legacy
      // @TODO: needs to be removed in fabric 7 or 8
      this[JSON$1].set(classConstructor.type.toLowerCase(), classConstructor);
    }
  }
  getSVGClass(SVGTagName) {
    return this[SVG].get(SVGTagName);
  }
  setSVGClass(classConstructor, SVGTagName) {
    this[SVG].set(SVGTagName !== null && SVGTagName !== void 0 ? SVGTagName : classConstructor.type.toLowerCase(), classConstructor);
  }
}
const classRegistry = new ClassRegistry();

/**
 * Array holding all running animations
 */
class AnimationRegistry extends Array {
  /**
   * Remove a single animation using an animation context
   * @param {AnimationBase} context
   */
  remove(context) {
    const index = this.indexOf(context);
    index > -1 && this.splice(index, 1);
  }

  /**
   * Cancel all running animations on the next frame
   */
  cancelAll() {
    const animations = this.splice(0);
    animations.forEach(animation => animation.abort());
    return animations;
  }

  /**
   * Cancel all running animations attached to a canvas on the next frame
   * @param {StaticCanvas} canvas
   */
  cancelByCanvas(canvas) {
    if (!canvas) {
      return [];
    }
    const animations = this.filter(animation => {
      var _animation$target;
      return animation.target === canvas || typeof animation.target === 'object' && ((_animation$target = animation.target) === null || _animation$target === void 0 ? void 0 : _animation$target.canvas) === canvas;
    });
    animations.forEach(animation => animation.abort());
    return animations;
  }

  /**
   * Cancel all running animations for target on the next frame
   * @param target
   */
  cancelByTarget(target) {
    if (!target) {
      return [];
    }
    const animations = this.filter(animation => animation.target === target);
    animations.forEach(animation => animation.abort());
    return animations;
  }
}
const runningAnimations = new AnimationRegistry();

/**
 * @see {@link http://fabric5.fabricjs.com/fabric-intro-part-2#events}
 * @see {@link http://fabric5.fabricjs.com/events|Events demo}
 */
class Observable {
  constructor() {
    _defineProperty(this, "__eventListeners", {});
  }
  /**
   * Observes specified event
   * @alias on
   * @param {string} eventName Event name (eg. 'after:render')
   * @param {EventRegistryObject} handlers key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})
   * @param {Function} handler Function that receives a notification when an event of the specified type occurs
   * @return {Function} disposer
   */
  on(arg0, handler) {
    if (!this.__eventListeners) {
      this.__eventListeners = {};
    }
    if (typeof arg0 === 'object') {
      // one object with key/value pairs was passed
      Object.entries(arg0).forEach(_ref => {
        let [eventName, handler] = _ref;
        this.on(eventName, handler);
      });
      return () => this.off(arg0);
    } else if (handler) {
      const eventName = arg0;
      if (!this.__eventListeners[eventName]) {
        this.__eventListeners[eventName] = [];
      }
      this.__eventListeners[eventName].push(handler);
      return () => this.off(eventName, handler);
    } else {
      // noop
      return () => false;
    }
  }

  /**
   * Observes specified event **once**
   * @alias once
   * @param {string} eventName Event name (eg. 'after:render')
   * @param {EventRegistryObject} handlers key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})
   * @param {Function} handler Function that receives a notification when an event of the specified type occurs
   * @return {Function} disposer
   */

  once(arg0, handler) {
    if (typeof arg0 === 'object') {
      // one object with key/value pairs was passed
      const disposers = [];
      Object.entries(arg0).forEach(_ref2 => {
        let [eventName, handler] = _ref2;
        disposers.push(this.once(eventName, handler));
      });
      return () => disposers.forEach(d => d());
    } else if (handler) {
      const disposer = this.on(arg0, function onceHandler() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        handler.call(this, ...args);
        disposer();
      });
      return disposer;
    } else {
      // noop
      return () => false;
    }
  }

  /**
   * @private
   * @param {string} eventName
   * @param {Function} [handler]
   */
  _removeEventListener(eventName, handler) {
    if (!this.__eventListeners[eventName]) {
      return;
    }
    if (handler) {
      const eventListener = this.__eventListeners[eventName];
      const index = eventListener.indexOf(handler);
      index > -1 && eventListener.splice(index, 1);
    } else {
      this.__eventListeners[eventName] = [];
    }
  }

  /**
   * Unsubscribe all event listeners for eventname.
   * Do not use this pattern. You could kill internal fabricJS events.
   * We know we should have protected events for internal flows, but we don't have yet
   * @deprecated
   * @param {string} eventName event name (eg. 'after:render')
   */

  /**
   * unsubscribe an event listener
   * @param {string} eventName event name (eg. 'after:render')
   * @param {TEventCallback} handler event listener to unsubscribe
   */

  /**
   * unsubscribe event listeners
   * @param handlers handlers key/value pairs (eg. {'after:render': handler, 'selection:cleared': handler})
   */

  /**
   * unsubscribe all event listeners
   */

  off(arg0, handler) {
    if (!this.__eventListeners) {
      return;
    }

    // remove all key/value pairs (event name -> event handler)
    if (typeof arg0 === 'undefined') {
      for (const eventName in this.__eventListeners) {
        this._removeEventListener(eventName);
      }
    }
    // one object with key/value pairs was passed
    else if (typeof arg0 === 'object') {
      Object.entries(arg0).forEach(_ref3 => {
        let [eventName, handler] = _ref3;
        this._removeEventListener(eventName, handler);
      });
    } else {
      this._removeEventListener(arg0, handler);
    }
  }

  /**
   * Fires event with an optional options object
   * @param {String} eventName Event name to fire
   * @param {Object} [options] Options object
   */
  fire(eventName, options) {
    var _this$__eventListener;
    if (!this.__eventListeners) {
      return;
    }
    const listenersForEvent = (_this$__eventListener = this.__eventListeners[eventName]) === null || _this$__eventListener === void 0 ? void 0 : _this$__eventListener.concat();
    if (listenersForEvent) {
      for (let i = 0; i < listenersForEvent.length; i++) {
        listenersForEvent[i].call(this, options || {});
      }
    }
  }
}

/**
 * Removes value from an array.
 * Presence of value (and its position in an array) is determined via `Array.prototype.indexOf`
 * @param {Array} array
 * @param {*} value
 * @return {Array} original array
 */
const removeFromArray = (array, value) => {
  const idx = array.indexOf(value);
  if (idx !== -1) {
    array.splice(idx, 1);
  }
  return array;
};

/**
 * Calculate the cos of an angle, avoiding returning floats for known results
 * This function is here just to avoid getting 0.999999999999999 when dealing
 * with numbers that are really 1 or 0.
 * @param {TRadian} angle the angle
 * @return {Number} the cosin value for angle.
 */
const cos = angle => {
  if (angle === 0) {
    return 1;
  }
  const angleSlice = Math.abs(angle) / halfPI;
  switch (angleSlice) {
    case 1:
    case 3:
      return 0;
    case 2:
      return -1;
  }
  return Math.cos(angle);
};

/**
 * Calculate the cos of an angle, avoiding returning floats for known results
 * This function is here just to avoid getting 0.999999999999999 when dealing
 * with numbers that are really 1 or 0.
 * @param {TRadian} angle the angle
 * @return {Number} the sin value for angle.
 */
const sin = angle => {
  if (angle === 0) {
    return 0;
  }
  const angleSlice = angle / halfPI;
  const value = Math.sign(angle);
  switch (angleSlice) {
    case 1:
      return value;
    case 2:
      return 0;
    case 3:
      return -value;
  }
  return Math.sin(angle);
};

/**
 * Adaptation of work of Kevin Lindsey(kevin@kevlindev.com)
 */
class Point {
  constructor() {
    let arg0 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    let y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (typeof arg0 === 'object') {
      this.x = arg0.x;
      this.y = arg0.y;
    } else {
      this.x = arg0;
      this.y = y;
    }
  }

  /**
   * Adds another point to this one and returns a new one with the sum
   * @param {XY} that
   * @return {Point} new Point instance with added values
   */
  add(that) {
    return new Point(this.x + that.x, this.y + that.y);
  }

  /**
   * Adds another point to this one
   * @param {XY} that
   * @return {Point} thisArg
   * @deprecated
   */
  addEquals(that) {
    this.x += that.x;
    this.y += that.y;
    return this;
  }

  /**
   * Adds value to this point and returns a new one
   * @param {Number} scalar
   * @return {Point} new Point with added value
   */
  scalarAdd(scalar) {
    return new Point(this.x + scalar, this.y + scalar);
  }

  /**
   * Adds value to this point
   * @param {Number} scalar
   * @return {Point} thisArg
   * @deprecated
   */
  scalarAddEquals(scalar) {
    this.x += scalar;
    this.y += scalar;
    return this;
  }

  /**
   * Subtracts another point from this point and returns a new one
   * @param {XY} that
   * @return {Point} new Point object with subtracted values
   */
  subtract(that) {
    return new Point(this.x - that.x, this.y - that.y);
  }

  /**
   * Subtracts another point from this point
   * @param {XY} that
   * @return {Point} thisArg
   * @deprecated
   */
  subtractEquals(that) {
    this.x -= that.x;
    this.y -= that.y;
    return this;
  }

  /**
   * Subtracts value from this point and returns a new one
   * @param {Number} scalar
   * @return {Point}
   */
  scalarSubtract(scalar) {
    return new Point(this.x - scalar, this.y - scalar);
  }

  /**
   * Subtracts value from this point
   * @param {Number} scalar
   * @return {Point} thisArg
   * @deprecated
   */
  scalarSubtractEquals(scalar) {
    this.x -= scalar;
    this.y -= scalar;
    return this;
  }

  /**
   * Multiplies this point by another value and returns a new one
   * @param {XY} that
   * @return {Point}
   */
  multiply(that) {
    return new Point(this.x * that.x, this.y * that.y);
  }

  /**
   * Multiplies this point by a value and returns a new one
   * @param {Number} scalar
   * @return {Point}
   */
  scalarMultiply(scalar) {
    return new Point(this.x * scalar, this.y * scalar);
  }

  /**
   * Multiplies this point by a value
   * @param {Number} scalar
   * @return {Point} thisArg
   * @deprecated
   */
  scalarMultiplyEquals(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  /**
   * Divides this point by another and returns a new one
   * @param {XY} that
   * @return {Point}
   */
  divide(that) {
    return new Point(this.x / that.x, this.y / that.y);
  }

  /**
   * Divides this point by a value and returns a new one
   * @param {Number} scalar
   * @return {Point}
   */
  scalarDivide(scalar) {
    return new Point(this.x / scalar, this.y / scalar);
  }

  /**
   * Divides this point by a value
   * @param {Number} scalar
   * @return {Point} thisArg
   * @deprecated
   */
  scalarDivideEquals(scalar) {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  /**
   * Returns true if this point is equal to another one
   * @param {XY} that
   * @return {Boolean}
   */
  eq(that) {
    return this.x === that.x && this.y === that.y;
  }

  /**
   * Returns true if this point is less than another one
   * @param {XY} that
   * @return {Boolean}
   */
  lt(that) {
    return this.x < that.x && this.y < that.y;
  }

  /**
   * Returns true if this point is less than or equal to another one
   * @param {XY} that
   * @return {Boolean}
   */
  lte(that) {
    return this.x <= that.x && this.y <= that.y;
  }

  /**
    * Returns true if this point is greater another one
   * @param {XY} that
   * @return {Boolean}
   */
  gt(that) {
    return this.x > that.x && this.y > that.y;
  }

  /**
   * Returns true if this point is greater than or equal to another one
   * @param {XY} that
   * @return {Boolean}
   */
  gte(that) {
    return this.x >= that.x && this.y >= that.y;
  }

  /**
   * Returns new point which is the result of linear interpolation with this one and another one
   * @param {XY} that
   * @param {Number} t , position of interpolation, between 0 and 1 default 0.5
   * @return {Point}
   */
  lerp(that) {
    let t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;
    t = Math.max(Math.min(1, t), 0);
    return new Point(this.x + (that.x - this.x) * t, this.y + (that.y - this.y) * t);
  }

  /**
   * Returns distance from this point and another one
   * @param {XY} that
   * @return {Number}
   */
  distanceFrom(that) {
    const dx = this.x - that.x,
      dy = this.y - that.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Returns the point between this point and another one
   * @param {XY} that
   * @return {Point}
   */
  midPointFrom(that) {
    return this.lerp(that);
  }

  /**
   * Returns a new point which is the min of this and another one
   * @param {XY} that
   * @return {Point}
   */
  min(that) {
    return new Point(Math.min(this.x, that.x), Math.min(this.y, that.y));
  }

  /**
   * Returns a new point which is the max of this and another one
   * @param {XY} that
   * @return {Point}
   */
  max(that) {
    return new Point(Math.max(this.x, that.x), Math.max(this.y, that.y));
  }

  /**
   * Returns string representation of this point
   * @return {String}
   */
  toString() {
    return `${this.x},${this.y}`;
  }

  /**
   * Sets x/y of this point
   * @param {Number} x
   * @param {Number} y
   */
  setXY(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Sets x of this point
   * @param {Number} x
   */
  setX(x) {
    this.x = x;
    return this;
  }

  /**
   * Sets y of this point
   * @param {Number} y
   */
  setY(y) {
    this.y = y;
    return this;
  }

  /**
   * Sets x/y of this point from another point
   * @param {XY} that
   */
  setFromPoint(that) {
    this.x = that.x;
    this.y = that.y;
    return this;
  }

  /**
   * Swaps x/y of this point and another point
   * @param {XY} that
   */
  swap(that) {
    const x = this.x,
      y = this.y;
    this.x = that.x;
    this.y = that.y;
    that.x = x;
    that.y = y;
  }

  /**
   * return a cloned instance of the point
   * @return {Point}
   */
  clone() {
    return new Point(this.x, this.y);
  }

  /**
   * Rotates `point` around `origin` with `radians`
   * @param {XY} origin The origin of the rotation
   * @param {TRadian} radians The radians of the angle for the rotation
   * @return {Point} The new rotated point
   */
  rotate(radians) {
    let origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ZERO;
    // TODO benchmark and verify the add and subtract how much cost
    // and then in case early return if no origin is passed
    const sinus = sin(radians),
      cosinus = cos(radians);
    const p = this.subtract(origin);
    const rotated = new Point(p.x * cosinus - p.y * sinus, p.x * sinus + p.y * cosinus);
    return rotated.add(origin);
  }

  /**
   * Apply transform t to point p
   * @param  {TMat2D} t The transform
   * @param  {Boolean} [ignoreOffset] Indicates that the offset should not be applied
   * @return {Point} The transformed point
   */
  transform(t) {
    let ignoreOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return new Point(t[0] * this.x + t[2] * this.y + (ignoreOffset ? 0 : t[4]), t[1] * this.x + t[3] * this.y + (ignoreOffset ? 0 : t[5]));
  }
}
const ZERO = new Point(0, 0);

const isCollection = fabricObject => {
  return !!fabricObject && Array.isArray(fabricObject._objects);
};
function createCollectionMixin(Base) {
  class Collection extends Base {
    constructor() {
      super(...arguments);
      /**
       * @type {FabricObject[]}
       * @TODO needs to end up in the constructor too
       */
      _defineProperty(this, "_objects", []);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _onObjectAdded(object) {
      // subclasses should override this method
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _onObjectRemoved(object) {
      // subclasses should override this method
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _onStackOrderChanged(object) {
      // subclasses should override this method
    }

    /**
     * Adds objects to collection
     * Objects should be instances of (or inherit from) FabricObject
     * @param {...FabricObject[]} objects to add
     * @returns {number} new array length
     */
    add() {
      for (var _len = arguments.length, objects = new Array(_len), _key = 0; _key < _len; _key++) {
        objects[_key] = arguments[_key];
      }
      const size = this._objects.push(...objects);
      objects.forEach(object => this._onObjectAdded(object));
      return size;
    }

    /**
     * Inserts an object into collection at specified index
     * @param {number} index Index to insert object at
     * @param {...FabricObject[]} objects Object(s) to insert
     * @returns {number} new array length
     */
    insertAt(index) {
      for (var _len2 = arguments.length, objects = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        objects[_key2 - 1] = arguments[_key2];
      }
      this._objects.splice(index, 0, ...objects);
      objects.forEach(object => this._onObjectAdded(object));
      return this._objects.length;
    }

    /**
     * Removes objects from a collection, then renders canvas (if `renderOnAddRemove` is not `false`)
     * @private
     * @param {...FabricObject[]} objects objects to remove
     * @returns {FabricObject[]} removed objects
     */
    remove() {
      const array = this._objects,
        removed = [];
      for (var _len3 = arguments.length, objects = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        objects[_key3] = arguments[_key3];
      }
      objects.forEach(object => {
        const index = array.indexOf(object);
        // only call onObjectRemoved if an object was actually removed
        if (index !== -1) {
          array.splice(index, 1);
          removed.push(object);
          this._onObjectRemoved(object);
        }
      });
      return removed;
    }

    /**
     * Executes given function for each object in this group
     * A simple shortcut for getObjects().forEach, before es6 was more complicated,
     * now is just a shortcut.
     * @param {Function} callback
     *                   Callback invoked with current object as first argument,
     *                   index - as second and an array of all objects - as third.
     */
    forEachObject(callback) {
      this.getObjects().forEach((object, index, objects) => callback(object, index, objects));
    }

    /**
     * Returns an array of children objects of this instance
     * @param {...String} [types] When specified, only objects of these types are returned
     * @return {Array}
     */
    getObjects() {
      for (var _len4 = arguments.length, types = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        types[_key4] = arguments[_key4];
      }
      if (types.length === 0) {
        return [...this._objects];
      }
      return this._objects.filter(o => o.isType(...types));
    }

    /**
     * Returns object at specified index
     * @param {Number} index
     * @return {Object} object at index
     */
    item(index) {
      return this._objects[index];
    }

    /**
     * Returns true if collection contains no objects
     * @return {Boolean} true if collection is empty
     */
    isEmpty() {
      return this._objects.length === 0;
    }

    /**
     * Returns a size of a collection (i.e: length of an array containing its objects)
     * @return {Number} Collection size
     */
    size() {
      return this._objects.length;
    }

    /**
     * Returns true if collection contains an object.\
     * **Prefer using {@link FabricObject#isDescendantOf} for performance reasons**
     * instead of `a.contains(b)` use `b.isDescendantOf(a)`
     * @param {Object} object Object to check against
     * @param {Boolean} [deep=false] `true` to check all descendants, `false` to check only `_objects`
     * @return {Boolean} `true` if collection contains an object
     */
    contains(object, deep) {
      if (this._objects.includes(object)) {
        return true;
      } else if (deep) {
        return this._objects.some(obj => obj instanceof Collection && obj.contains(object, true));
      }
      return false;
    }

    /**
     * Returns number representation of a collection complexity
     * @return {Number} complexity
     */
    complexity() {
      return this._objects.reduce((memo, current) => {
        memo += current.complexity ? current.complexity() : 0;
        return memo;
      }, 0);
    }

    /**
     * Moves an object or the objects of a multiple selection
     * to the bottom of the stack of drawn objects
     * @param {fabric.Object} object Object to send to back
     * @returns {boolean} true if change occurred
     */
    sendObjectToBack(object) {
      if (!object || object === this._objects[0]) {
        return false;
      }
      removeFromArray(this._objects, object);
      this._objects.unshift(object);
      this._onStackOrderChanged(object);
      return true;
    }

    /**
     * Moves an object or the objects of a multiple selection
     * to the top of the stack of drawn objects
     * @param {fabric.Object} object Object to send
     * @returns {boolean} true if change occurred
     */
    bringObjectToFront(object) {
      if (!object || object === this._objects[this._objects.length - 1]) {
        return false;
      }
      removeFromArray(this._objects, object);
      this._objects.push(object);
      this._onStackOrderChanged(object);
      return true;
    }

    /**
     * Moves an object or a selection down in stack of drawn objects
     * An optional parameter, `intersecting` allows to move the object in behind
     * the first intersecting object. Where intersection is calculated with
     * bounding box. If no intersection is found, there will not be change in the
     * stack.
     * @param {fabric.Object} object Object to send
     * @param {boolean} [intersecting] If `true`, send object behind next lower intersecting object
     * @returns {boolean} true if change occurred
     */
    sendObjectBackwards(object, intersecting) {
      if (!object) {
        return false;
      }
      const idx = this._objects.indexOf(object);
      if (idx !== 0) {
        // if object is not on the bottom of stack
        const newIdx = this.findNewLowerIndex(object, idx, intersecting);
        removeFromArray(this._objects, object);
        this._objects.splice(newIdx, 0, object);
        this._onStackOrderChanged(object);
        return true;
      }
      return false;
    }

    /**
     * Moves an object or a selection up in stack of drawn objects
     * An optional parameter, intersecting allows to move the object in front
     * of the first intersecting object. Where intersection is calculated with
     * bounding box. If no intersection is found, there will not be change in the
     * stack.
     * @param {fabric.Object} object Object to send
     * @param {boolean} [intersecting] If `true`, send object in front of next upper intersecting object
     * @returns {boolean} true if change occurred
     */
    bringObjectForward(object, intersecting) {
      if (!object) {
        return false;
      }
      const idx = this._objects.indexOf(object);
      if (idx !== this._objects.length - 1) {
        // if object is not on top of stack (last item in an array)
        const newIdx = this.findNewUpperIndex(object, idx, intersecting);
        removeFromArray(this._objects, object);
        this._objects.splice(newIdx, 0, object);
        this._onStackOrderChanged(object);
        return true;
      }
      return false;
    }

    /**
     * Moves an object to specified level in stack of drawn objects
     * @param {fabric.Object} object Object to send
     * @param {number} index Position to move to
     * @returns {boolean} true if change occurred
     */
    moveObjectTo(object, index) {
      if (object === this._objects[index]) {
        return false;
      }
      removeFromArray(this._objects, object);
      this._objects.splice(index, 0, object);
      this._onStackOrderChanged(object);
      return true;
    }
    findNewLowerIndex(object, idx, intersecting) {
      let newIdx;
      if (intersecting) {
        newIdx = idx;
        // traverse down the stack looking for the nearest intersecting object
        for (let i = idx - 1; i >= 0; --i) {
          if (object.isOverlapping(this._objects[i])) {
            newIdx = i;
            break;
          }
        }
      } else {
        newIdx = idx - 1;
      }
      return newIdx;
    }
    findNewUpperIndex(object, idx, intersecting) {
      let newIdx;
      if (intersecting) {
        newIdx = idx;
        // traverse up the stack looking for the nearest intersecting object
        for (let i = idx + 1; i < this._objects.length; ++i) {
          if (object.isOverlapping(this._objects[i])) {
            newIdx = i;
            break;
          }
        }
      } else {
        newIdx = idx + 1;
      }
      return newIdx;
    }

    /**
     * Given a bounding box, return all the objects of the collection that are contained in the bounding box.
     * If `includeIntersecting` is true, return also the objects that intersect the bounding box as well.
     * This is meant to work with selection. Is not a generic method.
     * @param {TBBox} bbox a bounding box in scene coordinates
     * @param {{ includeIntersecting?: boolean }} options an object with includeIntersecting
     * @returns array of objects contained in the bounding box, ordered from top to bottom stacking wise
     */
    collectObjects(_ref) {
      let {
        left,
        top,
        width,
        height
      } = _ref;
      let {
        includeIntersecting = true
      } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      const objects = [],
        tl = new Point(left, top),
        br = tl.add(new Point(width, height));

      // we iterate reverse order to collect top first in case of click.
      for (let i = this._objects.length - 1; i >= 0; i--) {
        const object = this._objects[i];
        if (object.selectable && object.visible && (includeIntersecting && object.intersectsWithRect(tl, br) || object.isContainedWithinRect(tl, br) || includeIntersecting && object.containsPoint(tl) || includeIntersecting && object.containsPoint(br))) {
          objects.push(object);
        }
      }
      return objects;
    }
  }

  // https://github.com/microsoft/TypeScript/issues/32080
  return Collection;
}

class CommonMethods extends Observable {
  /**
   * Sets object's properties from options, for initialization only
   * @protected
   * @param {Object} [options] Options object
   */
  _setOptions() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    for (const prop in options) {
      this.set(prop, options[prop]);
    }
  }

  /**
   * @private
   */
  _setObject(obj) {
    for (const prop in obj) {
      this._set(prop, obj[prop]);
    }
  }

  /**
   * Sets property to a given value. When changing position/dimension -related properties (left, top, scale, angle, etc.) `set` does not update position of object's borders/controls. If you need to update those, call `setCoords()`.
   * @param {String|Object} key Property name or object (if object, iterate over the object properties)
   * @param {Object|Function} value Property value (if function, the value is passed into it and its return value is used as a new one)
   */
  set(key, value) {
    if (typeof key === 'object') {
      this._setObject(key);
    } else {
      this._set(key, value);
    }
    return this;
  }
  _set(key, value) {
    this[key] = value;
  }

  /**
   * Toggles specified property from `true` to `false` or from `false` to `true`
   * @param {String} property Property to toggle
   */
  toggle(property) {
    const value = this.get(property);
    if (typeof value === 'boolean') {
      this.set(property, !value);
    }
    return this;
  }

  /**
   * Basic getter
   * @param {String} property Property name
   * @return {*} value of a property
   */
  get(property) {
    return this[property];
  }
}

function requestAnimFrame(callback) {
  return getFabricWindow().requestAnimationFrame(callback);
}
function cancelAnimFrame(handle) {
  return getFabricWindow().cancelAnimationFrame(handle);
}

let id = 0;
const uid = () => id++;

/**
 * Creates canvas element
 * @return {CanvasElement} initialized canvas element
 */
const createCanvasElement = () => {
  const element = getFabricDocument().createElement('canvas');
  if (!element || typeof element.getContext === 'undefined') {
    throw new FabricError('Failed to create `canvas` element');
  }
  return element;
};

/**
 * Creates image element (works on client and node)
 * @return {HTMLImageElement} HTML image element
 */
const createImage = () => getFabricDocument().createElement('img');

/**
 * Creates a canvas element that is a copy of another and is also painted
 * @param {CanvasElement} canvas to copy size and content of
 * @return {CanvasElement} initialized canvas element
 */
const copyCanvasElement = canvas => {
  var _newCanvas$getContext;
  const newCanvas = createCanvasElementFor(canvas);
  (_newCanvas$getContext = newCanvas.getContext('2d')) === null || _newCanvas$getContext === void 0 || _newCanvas$getContext.drawImage(canvas, 0, 0);
  return newCanvas;
};

/**
 * Creates a canvas element as big as another
 * @param {CanvasElement} canvas to copy size and content of
 * @return {CanvasElement} initialized canvas element
 */
const createCanvasElementFor = canvas => {
  const newCanvas = createCanvasElement();
  newCanvas.width = canvas.width;
  newCanvas.height = canvas.height;
  return newCanvas;
};

/**
 * since 2.6.0 moved from canvas instance to utility.
 * possibly useless
 * @param {CanvasElement} canvasEl to copy size and content of
 * @param {String} format 'jpeg' or 'png', in some browsers 'webp' is ok too
 * @param {number} quality <= 1 and > 0
 * @return {String} data url
 */
const toDataURL = (canvasEl, format, quality) => canvasEl.toDataURL(`image/${format}`, quality);
const isHTMLCanvas = canvas => {
  return !!canvas && canvas.getContext !== undefined;
};
const toBlob = (canvasEl, format, quality) => new Promise((resolve, _) => {
  canvasEl.toBlob(resolve, `image/${format}`, quality);
});

/**
 * Transforms degrees to radians.
 * @param {TDegree} degrees value in degrees
 * @return {TRadian} value in radians
 */
const degreesToRadians = degrees => degrees * PiBy180;

/**
 * Transforms radians to degrees.
 * @param {TRadian} radians value in radians
 * @return {TDegree} value in degrees
 */
const radiansToDegrees = radians => radians / PiBy180;

const isIdentityMatrix = mat => mat.every((value, index) => value === iMatrix[index]);

/**
 * Apply transform t to point p
 * @deprecated use {@link Point#transform}
 * @param  {Point | XY} p The point to transform
 * @param  {Array} t The transform
 * @param  {Boolean} [ignoreOffset] Indicates that the offset should not be applied
 * @return {Point} The transformed point
 */
const transformPoint = (p, t, ignoreOffset) => new Point(p).transform(t, ignoreOffset);

/**
 * Invert transformation t
 * @param {Array} t The transform
 * @return {Array} The inverted transform
 */
const invertTransform = t => {
  const a = 1 / (t[0] * t[3] - t[1] * t[2]),
    r = [a * t[3], -a * t[1], -a * t[2], a * t[0], 0, 0],
    {
      x,
      y
    } = new Point(t[4], t[5]).transform(r, true);
  r[4] = -x;
  r[5] = -y;
  return r;
};

/**
 * Multiply matrix A by matrix B to nest transformations
 * @param  {TMat2D} a First transformMatrix
 * @param  {TMat2D} b Second transformMatrix
 * @param  {Boolean} is2x2 flag to multiply matrices as 2x2 matrices
 * @return {TMat2D} The product of the two transform matrices
 */
const multiplyTransformMatrices = (a, b, is2x2) => [a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1], a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3], is2x2 ? 0 : a[0] * b[4] + a[2] * b[5] + a[4], is2x2 ? 0 : a[1] * b[4] + a[3] * b[5] + a[5]];

/**
 * Multiplies the matrices array such that a matrix defines the plane for the rest of the matrices **after** it
 *
 * `multiplyTransformMatrixArray([A, B, C, D])` is equivalent to `A(B(C(D)))`
 *
 * @param matrices an array of matrices
 * @param [is2x2] flag to multiply matrices as 2x2 matrices
 * @returns the multiplication product
 */
const multiplyTransformMatrixArray = (matrices, is2x2) => matrices.reduceRight((product, curr) => curr && product ? multiplyTransformMatrices(curr, product, is2x2) : curr || product, undefined) || iMatrix.concat();
const calcPlaneRotation = _ref => {
  let [a, b] = _ref;
  return Math.atan2(b, a);
};

/**
 * Decomposes standard 2x3 matrix into transform components
 * @param  {TMat2D} a transformMatrix
 * @return {Object} Components of transform
 */
const qrDecompose = a => {
  const angle = calcPlaneRotation(a),
    denom = Math.pow(a[0], 2) + Math.pow(a[1], 2),
    scaleX = Math.sqrt(denom),
    scaleY = (a[0] * a[3] - a[2] * a[1]) / scaleX,
    skewX = Math.atan2(a[0] * a[2] + a[1] * a[3], denom);
  return {
    angle: radiansToDegrees(angle),
    scaleX,
    scaleY,
    skewX: radiansToDegrees(skewX),
    skewY: 0,
    translateX: a[4] || 0,
    translateY: a[5] || 0
  };
};

/**
 * Generate a translation matrix
 *
 * A translation matrix in the form of
 * [ 1 0 x ]
 * [ 0 1 y ]
 * [ 0 0 1 ]
 *
 * See {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#translate} for more details
 *
 * @param {number} x translation on X axis
 * @param {number} [y] translation on Y axis
 * @returns {TMat2D} matrix
 */
const createTranslateMatrix = function (x) {
  let y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return [1, 0, 0, 1, x, y];
};

/**
 * Generate a rotation matrix around around a point (x,y), defaulting to (0,0)
 *
 * A matrix in the form of
 * [cos(a) -sin(a) -x*cos(a)+y*sin(a)+x]
 * [sin(a)  cos(a) -x*sin(a)-y*cos(a)+y]
 * [0       0      1                 ]
 *
 *
 * @param {TDegree} angle rotation in degrees
 * @param {XY} [pivotPoint] pivot point to rotate around
 * @returns {TMat2D} matrix
 */
function createRotateMatrix() {
  let {
    angle = 0
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let {
    x = 0,
    y = 0
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const angleRadiant = degreesToRadians(angle),
    cosValue = cos(angleRadiant),
    sinValue = sin(angleRadiant);
  return [cosValue, sinValue, -sinValue, cosValue, x ? x - (cosValue * x - sinValue * y) : 0, y ? y - (sinValue * x + cosValue * y) : 0];
}

/**
 * Generate a scale matrix around the point (0,0)
 *
 * A matrix in the form of
 * [x 0 0]
 * [0 y 0]
 * [0 0 1]
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#scale}
 *
 * @param {number} x scale on X axis
 * @param {number} [y] scale on Y axis
 * @returns {TMat2D} matrix
 */
const createScaleMatrix = function (x) {
  let y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
  return [x, 0, 0, y, 0, 0];
};
const angleToSkew = angle => Math.tan(degreesToRadians(angle));

/**
 * Generate a skew matrix for the X axis
 *
 * A matrix in the form of
 * [1 x 0]
 * [0 1 0]
 * [0 0 1]
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#skewx}
 *
 * @param {TDegree} skewValue translation on X axis
 * @returns {TMat2D} matrix
 */
const createSkewXMatrix = skewValue => [1, 0, angleToSkew(skewValue), 1, 0, 0];

/**
 * Generate a skew matrix for the Y axis
 *
 * A matrix in the form of
 * [1 0 0]
 * [y 1 0]
 * [0 0 1]
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#skewy}
 *
 * @param {TDegree} skewValue translation on Y axis
 * @returns {TMat2D} matrix
 */
const createSkewYMatrix = skewValue => [1, angleToSkew(skewValue), 0, 1, 0, 0];

/**
 * Returns a transform matrix starting from an object of the same kind of
 * the one returned from qrDecompose, useful also if you want to calculate some
 * transformations from an object that is not enlived yet.
 * is called DimensionsTransformMatrix because those properties are the one that influence
 * the size of the resulting box of the object.
 * @param  {Object} options
 * @param  {Number} [options.scaleX]
 * @param  {Number} [options.scaleY]
 * @param  {Boolean} [options.flipX]
 * @param  {Boolean} [options.flipY]
 * @param  {Number} [options.skewX]
 * @param  {Number} [options.skewY]
 * @return {Number[]} transform matrix
 */
const calcDimensionsMatrix = _ref2 => {
  let {
    scaleX = 1,
    scaleY = 1,
    flipX = false,
    flipY = false,
    skewX = 0,
    skewY = 0
  } = _ref2;
  let matrix = createScaleMatrix(flipX ? -scaleX : scaleX, flipY ? -scaleY : scaleY);
  if (skewX) {
    matrix = multiplyTransformMatrices(matrix, createSkewXMatrix(skewX), true);
  }
  if (skewY) {
    matrix = multiplyTransformMatrices(matrix, createSkewYMatrix(skewY), true);
  }
  return matrix;
};

/**
 * Returns a transform matrix starting from an object of the same kind of
 * the one returned from qrDecompose, useful also if you want to calculate some
 * transformations from an object that is not enlived yet
 * Before changing this function look at: src/benchmarks/calcTransformMatrix.mjs
 * @param  {Object} options
 * @param  {Number} [options.angle]
 * @param  {Number} [options.scaleX]
 * @param  {Number} [options.scaleY]
 * @param  {Boolean} [options.flipX]
 * @param  {Boolean} [options.flipY]
 * @param  {Number} [options.skewX]
 * @param  {Number} [options.skewY]
 * @param  {Number} [options.translateX]
 * @param  {Number} [options.translateY]
 * @return {Number[]} transform matrix
 */
const composeMatrix = options => {
  const {
    translateX = 0,
    translateY = 0,
    angle = 0
  } = options;
  let matrix = createTranslateMatrix(translateX, translateY);
  if (angle) {
    matrix = multiplyTransformMatrices(matrix, createRotateMatrix({
      angle
    }));
  }
  const scaleMatrix = calcDimensionsMatrix(options);
  if (!isIdentityMatrix(scaleMatrix)) {
    matrix = multiplyTransformMatrices(matrix, scaleMatrix);
  }
  return matrix;
};

/**
 * Loads image element from given url and resolve it, or catch.
 * @param {String} url URL representing an image
 * @param {LoadImageOptions} [options] image loading options
 * @returns {Promise<HTMLImageElement>} the loaded image.
 */
const loadImage = function (url) {
  let {
    signal,
    crossOrigin = null
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new Promise(function (resolve, reject) {
    if (signal && signal.aborted) {
      return reject(new SignalAbortedError('loadImage'));
    }
    const img = createImage();
    let abort;
    if (signal) {
      abort = function (err) {
        img.src = '';
        reject(err);
      };
      signal.addEventListener('abort', abort, {
        once: true
      });
    }
    const done = function () {
      img.onload = img.onerror = null;
      abort && (signal === null || signal === void 0 ? void 0 : signal.removeEventListener('abort', abort));
      resolve(img);
    };
    if (!url) {
      done();
      return;
    }
    img.onload = done;
    img.onerror = function () {
      abort && (signal === null || signal === void 0 ? void 0 : signal.removeEventListener('abort', abort));
      reject(new FabricError(`Error loading ${img.src}`));
    };
    crossOrigin && (img.crossOrigin = crossOrigin);
    img.src = url;
  });
};
/**
 * @TODO type this correctly.
 * Creates corresponding fabric instances from their object representations
 * @param {Object[]} objects Objects to enliven
 * @param {EnlivenObjectOptions} [options]
 * @param {(serializedObj: object, instance: FabricObject) => any} [options.reviver] Method for further parsing of object elements,
 * called after each fabric object created.
 * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 * @returns {Promise<FabricObject[]>}
 */
const enlivenObjects = function (objects) {
  let {
    signal,
    reviver = noop
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new Promise((resolve, reject) => {
    const instances = [];
    signal && signal.addEventListener('abort', reject, {
      once: true
    });
    Promise.all(objects.map(obj => classRegistry.getClass(obj.type).fromObject(obj, {
      signal
    }).then(fabricInstance => {
      reviver(obj, fabricInstance);
      instances.push(fabricInstance);
      return fabricInstance;
    }))).then(resolve).catch(error => {
      // cleanup
      instances.forEach(instance => {
        instance.dispose && instance.dispose();
      });
      reject(error);
    }).finally(() => {
      signal && signal.removeEventListener('abort', reject);
    });
  });
};

/**
 * Creates corresponding fabric instances residing in an object, e.g. `clipPath`
 * @param {Object} object with properties to enlive ( fill, stroke, clipPath, path )
 * @param {object} [options]
 * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 * @returns {Promise<Record<string, FabricObject | TFiller | null>>} the input object with enlived values
 */
const enlivenObjectEnlivables = function (serializedObject) {
  let {
    signal
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new Promise((resolve, reject) => {
    const instances = [];
    signal && signal.addEventListener('abort', reject, {
      once: true
    });
    // enlive every possible property
    const promises = Object.values(serializedObject).map(value => {
      if (!value) {
        return value;
      }
      /**
       * clipPath or shadow or gradient or text on a path or a pattern,
       * or the backgroundImage or overlayImage of canvas
       * If we have a type and there is a classe registered for it, we enlive it.
       * If there is no class registered for it we return the value as is
       * */
      if (value.type && classRegistry.has(value.type)) {
        return enlivenObjects([value], {
          signal
        }).then(_ref => {
          let [enlived] = _ref;
          instances.push(enlived);
          return enlived;
        });
      }
      return value;
    });
    const keys = Object.keys(serializedObject);
    Promise.all(promises).then(enlived => {
      return enlived.reduce((acc, instance, index) => {
        acc[keys[index]] = instance;
        return acc;
      }, {});
    }).then(resolve).catch(error => {
      // cleanup
      instances.forEach(instance => {
        instance.dispose && instance.dispose();
      });
      reject(error);
    }).finally(() => {
      signal && signal.removeEventListener('abort', reject);
    });
  });
};

/**
 * Populates an object with properties of another object
 * @param {Object} source Source object
 * @param {string[]} properties Properties names to include
 * @returns object populated with the picked keys
 */
const pick = function (source) {
  let keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return keys.reduce((o, key) => {
    if (key in source) {
      o[key] = source[key];
    }
    return o;
  }, {});
};
const pickBy = (source, predicate) => {
  return Object.keys(source).reduce((o, key) => {
    if (predicate(source[key], key, source)) {
      o[key] = source[key];
    }
    return o;
  }, {});
};

/**
 * A wrapper around Number#toFixed, which contrary to native method returns number, not string.
 * @param {number|string} number number to operate on
 * @param {number} fractionDigits number of fraction digits to "leave"
 * @return {number}
 */
const toFixed = (number, fractionDigits) => parseFloat(Number(number).toFixed(fractionDigits));

/**
 * given an array of 6 number returns something like `"matrix(...numbers)"`
 * @param {TMat2D} transform an array with 6 numbers
 * @return {String} transform matrix for svg
 */
const matrixToSVG = transform => 'matrix(' + transform.map(value => toFixed(value, config.NUM_FRACTION_DIGITS)).join(' ') + ')';

const isFiller = filler => {
  return !!filler && filler.toLive !== undefined;
};
const isSerializableFiller = filler => {
  return !!filler && typeof filler.toObject === 'function';
};
const isPattern = filler => {
  return !!filler && filler.offsetX !== undefined && 'source' in filler;
};
const isTextObject = fabricObject => {
  return !!fabricObject && typeof fabricObject._renderText === 'function';
};
const isPath = fabricObject => {
  // we could use instanceof but that would mean pulling in Text code for a simple check
  // @todo discuss what to do and how to do
  return !!fabricObject && typeof fabricObject._renderPathCommands === 'function';
};
const isActiveSelection = fabricObject => !!fabricObject && 'multiSelectionStacking' in fabricObject;

/**
 * Returns element scroll offsets
 * @param {HTMLElement} element Element to operate on
 * @return {Object} Object with left/top values
 */
function getScrollLeftTop(element) {
  const doc = element && getDocumentFromElement(element);
  let left = 0,
    top = 0;
  if (!element || !doc) {
    return {
      left,
      top
    };
  }
  let elementLoop = element;
  const docElement = doc.documentElement,
    body = doc.body || {
      scrollLeft: 0,
      scrollTop: 0
    };
  // While loop checks (and then sets element to) .parentNode OR .host
  //  to account for ShadowDOM. We still want to traverse up out of ShadowDOM,
  //  but the .parentNode of a root ShadowDOM node will always be null, instead
  //  it should be accessed through .host. See http://stackoverflow.com/a/24765528/4383938
  while (elementLoop && (elementLoop.parentNode || elementLoop.host)) {
    elementLoop = elementLoop.parentNode || elementLoop.host;
    if (elementLoop === doc) {
      left = body.scrollLeft || docElement.scrollLeft || 0;
      top = body.scrollTop || docElement.scrollTop || 0;
    } else {
      left += elementLoop.scrollLeft || 0;
      top += elementLoop.scrollTop || 0;
    }
    if (elementLoop.nodeType === 1 && elementLoop.style.position === 'fixed') {
      break;
    }
  }
  return {
    left,
    top
  };
}
const getDocumentFromElement = el => el.ownerDocument || null;
const getWindowFromElement = el => {
  var _el$ownerDocument;
  return ((_el$ownerDocument = el.ownerDocument) === null || _el$ownerDocument === void 0 ? void 0 : _el$ownerDocument.defaultView) || null;
};

const setCanvasDimensions = function (el, ctx, _ref) {
  let {
    width,
    height
  } = _ref;
  let retinaScaling = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  el.width = width;
  el.height = height;
  if (retinaScaling > 1) {
    el.setAttribute('width', (width * retinaScaling).toString());
    el.setAttribute('height', (height * retinaScaling).toString());
    ctx.scale(retinaScaling, retinaScaling);
  }
};
const setCSSDimensions = (el, _ref2) => {
  let {
    width,
    height
  } = _ref2;
  width && (el.style.width = typeof width === 'number' ? `${width}px` : width);
  height && (el.style.height = typeof height === 'number' ? `${height}px` : height);
};

/**
 * Returns offset for a given element
 * @param {HTMLElement} element Element to get offset for
 * @return {Object} Object with "left" and "top" properties
 */
function getElementOffset(element) {
  var _getWindowFromElement;
  const doc = element && getDocumentFromElement(element),
    offset = {
      left: 0,
      top: 0
    };
  if (!doc) {
    return offset;
  }
  const elemStyle = ((_getWindowFromElement = getWindowFromElement(element)) === null || _getWindowFromElement === void 0 ? void 0 : _getWindowFromElement.getComputedStyle(element, null)) || {};
  offset.left += parseInt(elemStyle.borderLeftWidth, 10) || 0;
  offset.top += parseInt(elemStyle.borderTopWidth, 10) || 0;
  offset.left += parseInt(elemStyle.paddingLeft, 10) || 0;
  offset.top += parseInt(elemStyle.paddingTop, 10) || 0;
  let box = {
    left: 0,
    top: 0
  };
  const docElem = doc.documentElement;
  if (typeof element.getBoundingClientRect !== 'undefined') {
    box = element.getBoundingClientRect();
  }
  const scrollLeftTop = getScrollLeftTop(element);
  return {
    left: box.left + scrollLeftTop.left - (docElem.clientLeft || 0) + offset.left,
    top: box.top + scrollLeftTop.top - (docElem.clientTop || 0) + offset.top
  };
}

/**
 * Makes element unselectable
 * @param {HTMLElement} element Element to make unselectable
 * @return {HTMLElement} Element that was passed in
 */
function makeElementUnselectable(element) {
  if (typeof element.onselectstart !== 'undefined') {
    element.onselectstart = () => false;
  }
  element.style.userSelect = NONE;
  return element;
}

class StaticCanvasDOMManager {
  constructor(arg0) {
    /**
     * Keeps a copy of the canvas style before setting retina scaling and other potions
     * in order to return it to original state on dispose
     * @type string
     */
    _defineProperty(this, "_originalCanvasStyle", void 0);
    _defineProperty(this, "lower", void 0);
    const el = this.createLowerCanvas(arg0);
    this.lower = {
      el,
      ctx: el.getContext('2d')
    };
  }
  createLowerCanvas(arg0) {
    // canvasEl === 'HTMLCanvasElement' does not work on jsdom/node
    const el = isHTMLCanvas(arg0) ? arg0 : arg0 && getFabricDocument().getElementById(arg0) || createCanvasElement();
    if (el.hasAttribute('data-fabric')) {
      throw new FabricError('Trying to initialize a canvas that has already been initialized. Did you forget to dispose the canvas?');
    }
    this._originalCanvasStyle = el.style.cssText;
    el.setAttribute('data-fabric', 'main');
    el.classList.add('lower-canvas');
    return el;
  }
  cleanupDOM(_ref) {
    let {
      width,
      height
    } = _ref;
    const {
      el
    } = this.lower;
    // restore canvas style and attributes
    el.classList.remove('lower-canvas');
    el.removeAttribute('data-fabric');
    // restore canvas size to original size in case retina scaling was applied
    el.setAttribute('width', `${width}`);
    el.setAttribute('height', `${height}`);
    el.style.cssText = this._originalCanvasStyle || '';
    this._originalCanvasStyle = undefined;
  }
  setDimensions(size, retinaScaling) {
    const {
      el,
      ctx
    } = this.lower;
    setCanvasDimensions(el, ctx, size, retinaScaling);
  }
  setCSSDimensions(size) {
    setCSSDimensions(this.lower.el, size);
  }

  /**
   * Calculates canvas element offset relative to the document
   */
  calcOffset() {
    return getElementOffset(this.lower.el);
  }
  dispose() {
    getEnv$1().dispose(this.lower.el);
    // @ts-expect-error disposing
    delete this.lower;
  }
}

const staticCanvasDefaults = {
  backgroundVpt: true,
  backgroundColor: '',
  overlayVpt: true,
  overlayColor: '',
  includeDefaultValues: true,
  svgViewportTransformation: true,
  renderOnAddRemove: true,
  skipOffscreen: true,
  enableRetinaScaling: true,
  imageSmoothingEnabled: true,
  /**
   * @todo move to Canvas
   */
  controlsAboveOverlay: false,
  /**
   * @todo move to Canvas
   */
  allowTouchScrolling: false,
  viewportTransform: [...iMatrix],
  patternQuality: 'best'
};

/**
 * Having both options in TCanvasSizeOptions set to true transform the call in a calcOffset
 * Better try to restrict with types to avoid confusion.
 */

/**
 * Static canvas class
 * @see {@link http://fabric5.fabricjs.com/static_canvas|StaticCanvas demo}
 * @fires before:render
 * @fires after:render
 * @fires canvas:cleared
 * @fires object:added
 * @fires object:removed
 */
// TODO: fix `EventSpec` inheritance https://github.com/microsoft/TypeScript/issues/26154#issuecomment-1366616260
let StaticCanvas$1 = class StaticCanvas extends createCollectionMixin(CommonMethods) {
  // background

  // overlay

  // rendering config

  /**
   * @todo move to Canvas
   */

  /**
   * @todo move to Canvas
   */

  /**
   * The viewport bounding box in scene plane coordinates, see {@link calcViewportBoundaries}
   */

  /**
   * A reference to the canvas actual HTMLCanvasElement.
   * Can be use to read the raw pixels, but never write or manipulate
   * @type HTMLCanvasElement
   */
  get lowerCanvasEl() {
    var _this$elements$lower;
    return (_this$elements$lower = this.elements.lower) === null || _this$elements$lower === void 0 ? void 0 : _this$elements$lower.el;
  }
  get contextContainer() {
    var _this$elements$lower2;
    return (_this$elements$lower2 = this.elements.lower) === null || _this$elements$lower2 === void 0 ? void 0 : _this$elements$lower2.ctx;
  }

  /**
   * If true the Canvas is in the process or has been disposed/destroyed.
   * No more rendering operation will be executed on this canvas.
   * @type boolean
   */

  /**
   * Started the process of disposing but not done yet.
   * WIll likely complete the render cycle already scheduled but stopping adding more.
   * @type boolean
   */

  /**
   * When true control drawing is skipped.
   * This boolean is used to avoid toDataURL to export controls.
   * Usage of this boolean to build up other flows and features is not supported
   * @type Boolean
   * @default false
   */

  /**
   * Controls the rendering of images under node-canvas.
   * Has no effects on the browser context.
   */

  // reference to

  static getDefaults() {
    return StaticCanvas.ownDefaults;
  }
  constructor(el) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super();
    Object.assign(this, this.constructor.getDefaults());
    this.set(options);
    this.initElements(el);
    this._setDimensionsImpl({
      width: this.width || this.elements.lower.el.width || 0,
      height: this.height || this.elements.lower.el.height || 0
    });
    this.skipControlsDrawing = false;
    this.viewportTransform = [...this.viewportTransform];
    this.calcViewportBoundaries();
  }
  initElements(el) {
    this.elements = new StaticCanvasDOMManager(el);
  }
  add() {
    const size = super.add(...arguments);
    arguments.length > 0 && this.renderOnAddRemove && this.requestRenderAll();
    return size;
  }
  insertAt(index) {
    for (var _len = arguments.length, objects = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      objects[_key - 1] = arguments[_key];
    }
    const size = super.insertAt(index, ...objects);
    objects.length > 0 && this.renderOnAddRemove && this.requestRenderAll();
    return size;
  }
  remove() {
    const removed = super.remove(...arguments);
    removed.length > 0 && this.renderOnAddRemove && this.requestRenderAll();
    return removed;
  }
  _onObjectAdded(obj) {
    if (obj.canvas && obj.canvas !== this) {
      log('warn', 'Canvas is trying to add an object that belongs to a different canvas.\n' + 'Resulting to default behavior: removing object from previous canvas and adding to new canvas');
      obj.canvas.remove(obj);
    }
    obj._set('canvas', this);
    obj.setCoords();
    this.fire('object:added', {
      target: obj
    });
    obj.fire('added', {
      target: this
    });
  }
  _onObjectRemoved(obj) {
    obj._set('canvas', undefined);
    this.fire('object:removed', {
      target: obj
    });
    obj.fire('removed', {
      target: this
    });
  }
  _onStackOrderChanged() {
    this.renderOnAddRemove && this.requestRenderAll();
  }

  /**
   * @private
   * @see https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/HTML-canvas-guide/SettingUptheCanvas/SettingUptheCanvas.html
   * @return {Number} retinaScaling if applied, otherwise 1;
   */
  getRetinaScaling() {
    return this.enableRetinaScaling ? getDevicePixelRatio() : 1;
  }

  /**
   * Calculates canvas element offset relative to the document
   * This method is also attached as "resize" event handler of window
   */
  calcOffset() {
    return this._offset = this.elements.calcOffset();
  }

  /**
   * Returns canvas width (in px)
   * @return {Number}
   */
  getWidth() {
    return this.width;
  }

  /**
   * Returns canvas height (in px)
   * @return {Number}
   */
  getHeight() {
    return this.height;
  }

  /**
   * Internal use only
   * @protected
   */
  _setDimensionsImpl(dimensions) {
    let {
      cssOnly = false,
      backstoreOnly = false
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!cssOnly) {
      const size = {
        width: this.width,
        height: this.height,
        ...dimensions
      };
      this.elements.setDimensions(size, this.getRetinaScaling());
      this.hasLostContext = true;
      this.width = size.width;
      this.height = size.height;
    }
    if (!backstoreOnly) {
      this.elements.setCSSDimensions(dimensions);
    }
    this.calcOffset();
  }

  /**
   * Sets dimensions (width, height) of this canvas instance. when options.cssOnly flag active you should also supply the unit of measure (px/%/em)
   * @param {Object}        dimensions                    Object with width/height properties
   * @param {Number|String} [dimensions.width]            Width of canvas element
   * @param {Number|String} [dimensions.height]           Height of canvas element
   * @param {Object}        [options]                     Options object
   * @param {Boolean}       [options.backstoreOnly=false] Set the given dimensions only as canvas backstore dimensions
   * @param {Boolean}       [options.cssOnly=false]       Set the given dimensions only as css dimensions
   */

  setDimensions(dimensions, options) {
    this._setDimensionsImpl(dimensions, options);
    if (!options || !options.cssOnly) {
      this.requestRenderAll();
    }
  }

  /**
   * Returns canvas zoom level
   * @return {Number}
   */
  getZoom() {
    return this.viewportTransform[0];
  }

  /**
   * Sets viewport transformation of this canvas instance
   * @param {Array} vpt a Canvas 2D API transform matrix
   */
  setViewportTransform(vpt) {
    this.viewportTransform = vpt;
    this.calcViewportBoundaries();
    this.renderOnAddRemove && this.requestRenderAll();
  }

  /**
   * Sets zoom level of this canvas instance, the zoom centered around point
   * meaning that following zoom to point with the same point will have the visual
   * effect of the zoom originating from that point. The point won't move.
   * It has nothing to do with canvas center or visual center of the viewport.
   * @param {Point} point to zoom with respect to
   * @param {Number} value to set zoom to, less than 1 zooms out
   */
  zoomToPoint(point, value) {
    // TODO: just change the scale, preserve other transformations
    const before = point,
      vpt = [...this.viewportTransform];
    const newPoint = transformPoint(point, invertTransform(vpt));
    vpt[0] = value;
    vpt[3] = value;
    const after = transformPoint(newPoint, vpt);
    vpt[4] += before.x - after.x;
    vpt[5] += before.y - after.y;
    this.setViewportTransform(vpt);
  }

  /**
   * Sets zoom level of this canvas instance
   * @param {Number} value to set zoom to, less than 1 zooms out
   */
  setZoom(value) {
    this.zoomToPoint(new Point(0, 0), value);
  }

  /**
   * Pan viewport so as to place point at top left corner of canvas
   * @param {Point} point to move to
   */
  absolutePan(point) {
    const vpt = [...this.viewportTransform];
    vpt[4] = -point.x;
    vpt[5] = -point.y;
    return this.setViewportTransform(vpt);
  }

  /**
   * Pans viewpoint relatively
   * @param {Point} point (position vector) to move by
   */
  relativePan(point) {
    return this.absolutePan(new Point(-point.x - this.viewportTransform[4], -point.y - this.viewportTransform[5]));
  }

  /**
   * Returns &lt;canvas> element corresponding to this instance
   * @return {HTMLCanvasElement}
   */
  getElement() {
    return this.elements.lower.el;
  }

  /**
   * Clears specified context of canvas element
   * @param {CanvasRenderingContext2D} ctx Context to clear
   */
  clearContext(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Returns context of canvas where objects are drawn
   * @return {CanvasRenderingContext2D}
   */
  getContext() {
    return this.elements.lower.ctx;
  }

  /**
   * Clears all contexts (background, main, top) of an instance
   */
  clear() {
    this.remove(...this.getObjects());
    this.backgroundImage = undefined;
    this.overlayImage = undefined;
    this.backgroundColor = '';
    this.overlayColor = '';
    this.clearContext(this.getContext());
    this.fire('canvas:cleared');
    this.renderOnAddRemove && this.requestRenderAll();
  }

  /**
   * Renders the canvas
   */
  renderAll() {
    this.cancelRequestedRender();
    if (this.destroyed) {
      return;
    }
    this.renderCanvas(this.getContext(), this._objects);
  }

  /**
   * Function created to be instance bound at initialization
   * used in requestAnimationFrame rendering
   * Let the fabricJS call it. If you call it manually you could have more
   * animationFrame stacking on to of each other
   * for an imperative rendering, use canvas.renderAll
   * @private
   */
  renderAndReset() {
    this.nextRenderHandle = 0;
    this.renderAll();
  }

  /**
   * Append a renderAll request to next animation frame.
   * unless one is already in progress, in that case nothing is done
   * a boolean flag will avoid appending more.
   */
  requestRenderAll() {
    if (!this.nextRenderHandle && !this.disposed && !this.destroyed) {
      this.nextRenderHandle = requestAnimFrame(() => this.renderAndReset());
    }
  }

  /**
   * Calculate the position of the 4 corner of canvas with current viewportTransform.
   * helps to determinate when an object is in the current rendering viewport
   */
  calcViewportBoundaries() {
    const width = this.width,
      height = this.height,
      iVpt = invertTransform(this.viewportTransform),
      a = transformPoint({
        x: 0,
        y: 0
      }, iVpt),
      b = transformPoint({
        x: width,
        y: height
      }, iVpt),
      // we don't support vpt flipping
      // but the code is robust enough to mostly work with flipping
      min = a.min(b),
      max = a.max(b);
    return this.vptCoords = {
      tl: min,
      tr: new Point(max.x, min.y),
      bl: new Point(min.x, max.y),
      br: max
    };
  }
  cancelRequestedRender() {
    if (this.nextRenderHandle) {
      cancelAnimFrame(this.nextRenderHandle);
      this.nextRenderHandle = 0;
    }
  }
  drawControls(_ctx) {
    // Static canvas has no controls
  }

  /**
   * Renders background, objects, overlay and controls.
   * @param {CanvasRenderingContext2D} ctx
   * @param {Array} objects to render
   */
  renderCanvas(ctx, objects) {
    if (this.destroyed) {
      return;
    }
    const v = this.viewportTransform,
      path = this.clipPath;
    this.calcViewportBoundaries();
    this.clearContext(ctx);
    ctx.imageSmoothingEnabled = this.imageSmoothingEnabled;
    // @ts-expect-error node-canvas stuff
    ctx.patternQuality = this.patternQuality;
    this.fire('before:render', {
      ctx
    });
    this._renderBackground(ctx);
    ctx.save();
    //apply viewport transform once for all rendering process
    ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
    this._renderObjects(ctx, objects);
    ctx.restore();
    if (!this.controlsAboveOverlay && !this.skipControlsDrawing) {
      this.drawControls(ctx);
    }
    if (path) {
      path._set('canvas', this);
      // needed to setup a couple of variables
      // todo migrate to the newer one
      path.shouldCache();
      path._transformDone = true;
      path.renderCache({
        forClipping: true
      });
      this.drawClipPathOnCanvas(ctx, path);
    }
    this._renderOverlay(ctx);
    if (this.controlsAboveOverlay && !this.skipControlsDrawing) {
      this.drawControls(ctx);
    }
    this.fire('after:render', {
      ctx
    });
    if (this.__cleanupTask) {
      this.__cleanupTask();
      this.__cleanupTask = undefined;
    }
  }

  /**
   * Paint the cached clipPath on the lowerCanvasEl
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  drawClipPathOnCanvas(ctx, clipPath) {
    const v = this.viewportTransform;
    ctx.save();
    ctx.transform(...v);
    // DEBUG: uncomment this line, comment the following
    // ctx.globalAlpha = 0.4;
    ctx.globalCompositeOperation = 'destination-in';
    clipPath.transform(ctx);
    ctx.scale(1 / clipPath.zoomX, 1 / clipPath.zoomY);
    ctx.drawImage(clipPath._cacheCanvas, -clipPath.cacheTranslationX, -clipPath.cacheTranslationY);
    ctx.restore();
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {Array} objects to render
   */
  _renderObjects(ctx, objects) {
    for (let i = 0, len = objects.length; i < len; ++i) {
      objects[i] && objects[i].render(ctx);
    }
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {string} property 'background' or 'overlay'
   */
  _renderBackgroundOrOverlay(ctx, property) {
    const fill = this[`${property}Color`],
      object = this[`${property}Image`],
      v = this.viewportTransform,
      needsVpt = this[`${property}Vpt`];
    if (!fill && !object) {
      return;
    }
    const isAFiller = isFiller(fill);
    if (fill) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this.width, 0);
      ctx.lineTo(this.width, this.height);
      ctx.lineTo(0, this.height);
      ctx.closePath();
      ctx.fillStyle = isAFiller ? fill.toLive(ctx /* this */) : fill;
      if (needsVpt) {
        ctx.transform(...v);
      }
      if (isAFiller) {
        ctx.transform(1, 0, 0, 1, fill.offsetX || 0, fill.offsetY || 0);
        const m = fill.gradientTransform || fill.patternTransform;
        m && ctx.transform(...m);
      }
      ctx.fill();
      ctx.restore();
    }
    if (object) {
      ctx.save();
      const {
        skipOffscreen
      } = this;
      // if the object doesn't move with the viewport,
      // the offscreen concept does not apply;
      this.skipOffscreen = needsVpt;
      if (needsVpt) {
        ctx.transform(...v);
      }
      object.render(ctx);
      this.skipOffscreen = skipOffscreen;
      ctx.restore();
    }
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderBackground(ctx) {
    this._renderBackgroundOrOverlay(ctx, 'background');
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderOverlay(ctx) {
    this._renderBackgroundOrOverlay(ctx, 'overlay');
  }

  /**
   * Returns coordinates of a center of canvas.
   * @return {Point}
   */
  getCenterPoint() {
    return new Point(this.width / 2, this.height / 2);
  }

  /**
   * Centers object horizontally in the canvas
   */
  centerObjectH(object) {
    return this._centerObject(object, new Point(this.getCenterPoint().x, object.getCenterPoint().y));
  }

  /**
   * Centers object vertically in the canvas
   * @param {FabricObject} object Object to center vertically
   */
  centerObjectV(object) {
    return this._centerObject(object, new Point(object.getCenterPoint().x, this.getCenterPoint().y));
  }

  /**
   * Centers object vertically and horizontally in the canvas
   * @param {FabricObject} object Object to center vertically and horizontally
   */
  centerObject(object) {
    return this._centerObject(object, this.getCenterPoint());
  }

  /**
   * Centers object vertically and horizontally in the viewport
   * @param {FabricObject} object Object to center vertically and horizontally
   */
  viewportCenterObject(object) {
    return this._centerObject(object, this.getVpCenter());
  }

  /**
   * Centers object horizontally in the viewport, object.top is unchanged
   * @param {FabricObject} object Object to center vertically and horizontally
   */
  viewportCenterObjectH(object) {
    return this._centerObject(object, new Point(this.getVpCenter().x, object.getCenterPoint().y));
  }

  /**
   * Centers object Vertically in the viewport, object.top is unchanged
   * @param {FabricObject} object Object to center vertically and horizontally
   */
  viewportCenterObjectV(object) {
    return this._centerObject(object, new Point(object.getCenterPoint().x, this.getVpCenter().y));
  }

  /**
   * Calculate the point in canvas that correspond to the center of actual viewport.
   * @return {Point} vpCenter, viewport center
   */
  getVpCenter() {
    return transformPoint(this.getCenterPoint(), invertTransform(this.viewportTransform));
  }

  /**
   * @private
   * @param {FabricObject} object Object to center
   * @param {Point} center Center point
   */
  _centerObject(object, center) {
    object.setXY(center, CENTER, CENTER);
    object.setCoords();
    this.renderOnAddRemove && this.requestRenderAll();
  }

  /**
   * Returns dataless JSON representation of canvas
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {String} json string
   */
  toDatalessJSON(propertiesToInclude) {
    return this.toDatalessObject(propertiesToInclude);
  }

  /**
   * Returns object representation of canvas
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject(propertiesToInclude) {
    return this._toObjectMethod('toObject', propertiesToInclude);
  }

  /**
   * Returns Object representation of canvas
   * this alias is provided because if you call JSON.stringify on an instance,
   * the toJSON object will be invoked if it exists.
   * Having a toJSON method means you can do JSON.stringify(myCanvas)
   * JSON does not support additional properties because toJSON has its own signature
   * @return {Object} JSON compatible object
   * @see {@link http://fabric5.fabricjs.com/fabric-intro-part-3#serialization}
   * @see {@link http://jsfiddle.net/fabricjs/pec86/|jsFiddle demo}
   * @example <caption>JSON representation of canvas </caption>
   * const json = canvas.toJSON();
   * @example <caption>JSON representation of canvas </caption>
   * const json = JSON.stringify(canvas);
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Returns dataless object representation of canvas
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toDatalessObject(propertiesToInclude) {
    return this._toObjectMethod('toDatalessObject', propertiesToInclude);
  }

  /**
   * @private
   */
  _toObjectMethod(methodName, propertiesToInclude) {
    const clipPath = this.clipPath;
    const clipPathData = clipPath && !clipPath.excludeFromExport ? this._toObject(clipPath, methodName, propertiesToInclude) : null;
    return {
      version: VERSION,
      ...pick(this, propertiesToInclude),
      objects: this._objects.filter(object => !object.excludeFromExport).map(instance => this._toObject(instance, methodName, propertiesToInclude)),
      ...this.__serializeBgOverlay(methodName, propertiesToInclude),
      ...(clipPathData ? {
        clipPath: clipPathData
      } : null)
    };
  }

  /**
   * @private
   */
  _toObject(instance, methodName, propertiesToInclude) {
    let originalValue;
    if (!this.includeDefaultValues) {
      originalValue = instance.includeDefaultValues;
      instance.includeDefaultValues = false;
    }
    const object = instance[methodName](propertiesToInclude);
    if (!this.includeDefaultValues) {
      instance.includeDefaultValues = !!originalValue;
    }
    return object;
  }

  /**
   * @private
   */
  __serializeBgOverlay(methodName, propertiesToInclude) {
    const data = {},
      bgImage = this.backgroundImage,
      overlayImage = this.overlayImage,
      bgColor = this.backgroundColor,
      overlayColor = this.overlayColor;
    if (isFiller(bgColor)) {
      if (!bgColor.excludeFromExport) {
        data.background = bgColor.toObject(propertiesToInclude);
      }
    } else if (bgColor) {
      data.background = bgColor;
    }
    if (isFiller(overlayColor)) {
      if (!overlayColor.excludeFromExport) {
        data.overlay = overlayColor.toObject(propertiesToInclude);
      }
    } else if (overlayColor) {
      data.overlay = overlayColor;
    }
    if (bgImage && !bgImage.excludeFromExport) {
      data.backgroundImage = this._toObject(bgImage, methodName, propertiesToInclude);
    }
    if (overlayImage && !overlayImage.excludeFromExport) {
      data.overlayImage = this._toObject(overlayImage, methodName, propertiesToInclude);
    }
    return data;
  }

  /* _TO_SVG_START_ */

  /**
   * Returns SVG representation of canvas
   * @param {Object} [options] Options object for SVG output
   * @param {Boolean} [options.suppressPreamble=false] If true xml tag is not included
   * @param {Object} [options.viewBox] SVG viewbox object
   * @param {Number} [options.viewBox.x] x-coordinate of viewbox
   * @param {Number} [options.viewBox.y] y-coordinate of viewbox
   * @param {Number} [options.viewBox.width] Width of viewbox
   * @param {Number} [options.viewBox.height] Height of viewbox
   * @param {String} [options.encoding=UTF-8] Encoding of SVG output
   * @param {String} [options.width] desired width of svg with or without units
   * @param {String} [options.height] desired height of svg with or without units
   * @param {Function} [reviver] Method for further parsing of svg elements, called after each fabric object converted into svg representation.
   * @return {String} SVG string
   * @see {@link http://fabric5.fabricjs.com/fabric-intro-part-3#serialization}
   * @see {@link http://jsfiddle.net/fabricjs/jQ3ZZ/|jsFiddle demo}
   * @example <caption>Normal SVG output</caption>
   * var svg = canvas.toSVG();
   * @example <caption>SVG output without preamble (without &lt;?xml ../>)</caption>
   * var svg = canvas.toSVG({suppressPreamble: true});
   * @example <caption>SVG output with viewBox attribute</caption>
   * var svg = canvas.toSVG({
   *   viewBox: {
   *     x: 100,
   *     y: 100,
   *     width: 200,
   *     height: 300
   *   }
   * });
   * @example <caption>SVG output with different encoding (default: UTF-8)</caption>
   * var svg = canvas.toSVG({encoding: 'ISO-8859-1'});
   * @example <caption>Modify SVG output with reviver function</caption>
   * var svg = canvas.toSVG(null, function(svg) {
   *   return svg.replace('stroke-dasharray: ; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; ', '');
   * });
   */
  toSVG() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let reviver = arguments.length > 1 ? arguments[1] : undefined;
    options.reviver = reviver;
    const markup = [];
    this._setSVGPreamble(markup, options);
    this._setSVGHeader(markup, options);
    if (this.clipPath) {
      markup.push(`<g clip-path="url(#${this.clipPath.clipPathId})" >\n`);
    }
    this._setSVGBgOverlayColor(markup, 'background');
    this._setSVGBgOverlayImage(markup, 'backgroundImage', reviver);
    this._setSVGObjects(markup, reviver);
    if (this.clipPath) {
      markup.push('</g>\n');
    }
    this._setSVGBgOverlayColor(markup, 'overlay');
    this._setSVGBgOverlayImage(markup, 'overlayImage', reviver);
    markup.push('</svg>');
    return markup.join('');
  }

  /**
   * @private
   */
  _setSVGPreamble(markup, options) {
    if (options.suppressPreamble) {
      return;
    }
    markup.push('<?xml version="1.0" encoding="', options.encoding || 'UTF-8', '" standalone="no" ?>\n', '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ', '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n');
  }

  /**
   * @private
   */
  _setSVGHeader(markup, options) {
    const width = options.width || `${this.width}`,
      height = options.height || `${this.height}`,
      NUM_FRACTION_DIGITS = config.NUM_FRACTION_DIGITS,
      optViewBox = options.viewBox;
    let viewBox;
    if (optViewBox) {
      viewBox = `viewBox="${optViewBox.x} ${optViewBox.y} ${optViewBox.width} ${optViewBox.height}" `;
    } else if (this.svgViewportTransformation) {
      const vpt = this.viewportTransform;
      viewBox = `viewBox="${toFixed(-vpt[4] / vpt[0], NUM_FRACTION_DIGITS)} ${toFixed(-vpt[5] / vpt[3], NUM_FRACTION_DIGITS)} ${toFixed(this.width / vpt[0], NUM_FRACTION_DIGITS)} ${toFixed(this.height / vpt[3], NUM_FRACTION_DIGITS)}" `;
    } else {
      viewBox = `viewBox="0 0 ${this.width} ${this.height}" `;
    }
    markup.push('<svg ', 'xmlns="http://www.w3.org/2000/svg" ', 'xmlns:xlink="http://www.w3.org/1999/xlink" ', 'version="1.1" ', 'width="', width, '" ', 'height="', height, '" ', viewBox, 'xml:space="preserve">\n', '<desc>Created with Fabric.js ', VERSION, '</desc>\n', '<defs>\n', this.createSVGFontFacesMarkup(), this.createSVGRefElementsMarkup(), this.createSVGClipPathMarkup(options), '</defs>\n');
  }
  createSVGClipPathMarkup(options) {
    const clipPath = this.clipPath;
    if (clipPath) {
      clipPath.clipPathId = `CLIPPATH_${uid()}`;
      return `<clipPath id="${clipPath.clipPathId}" >\n${clipPath.toClipPathSVG(options.reviver)}</clipPath>\n`;
    }
    return '';
  }

  /**
   * Creates markup containing SVG referenced elements like patterns, gradients etc.
   * @return {String}
   */
  createSVGRefElementsMarkup() {
    return ['background', 'overlay'].map(prop => {
      const fill = this[`${prop}Color`];
      if (isFiller(fill)) {
        const shouldTransform = this[`${prop}Vpt`],
          vpt = this.viewportTransform,
          object = {
            // otherwise circular dependency
            isType: () => false,
            width: this.width / (shouldTransform ? vpt[0] : 1),
            height: this.height / (shouldTransform ? vpt[3] : 1)
          };
        return fill.toSVG(object, {
          additionalTransform: shouldTransform ? matrixToSVG(vpt) : ''
        });
      }
    }).join('');
  }

  /**
   * Creates markup containing SVG font faces,
   * font URLs for font faces must be collected by developers
   * and are not extracted from the DOM by fabricjs
   * @param {Array} objects Array of fabric objects
   * @return {String}
   */
  createSVGFontFacesMarkup() {
    const objects = [],
      fontList = {},
      fontPaths = config.fontPaths;
    this._objects.forEach(function add(object) {
      objects.push(object);
      if (isCollection(object)) {
        object._objects.forEach(add);
      }
    });
    objects.forEach(obj => {
      if (!isTextObject(obj)) {
        return;
      }
      const {
        styles,
        fontFamily
      } = obj;
      if (fontList[fontFamily] || !fontPaths[fontFamily]) {
        return;
      }
      fontList[fontFamily] = true;
      if (!styles) {
        return;
      }
      Object.values(styles).forEach(styleRow => {
        Object.values(styleRow).forEach(_ref => {
          let {
            fontFamily = ''
          } = _ref;
          if (!fontList[fontFamily] && fontPaths[fontFamily]) {
            fontList[fontFamily] = true;
          }
        });
      });
    });
    const fontListMarkup = Object.keys(fontList).map(fontFamily => `\t\t@font-face {\n\t\t\tfont-family: '${fontFamily}';\n\t\t\tsrc: url('${fontPaths[fontFamily]}');\n\t\t}\n`).join('');
    if (fontListMarkup) {
      return `\t<style type="text/css"><![CDATA[\n${fontListMarkup}]]></style>\n`;
    }
    return '';
  }

  /**
   * @private
   */
  _setSVGObjects(markup, reviver) {
    this.forEachObject(fabricObject => {
      if (fabricObject.excludeFromExport) {
        return;
      }
      this._setSVGObject(markup, fabricObject, reviver);
    });
  }

  /**
   * This is its own function because the Canvas ( non static ) requires extra code here
   * @private
   */
  _setSVGObject(markup, instance, reviver) {
    markup.push(instance.toSVG(reviver));
  }

  /**
   * @private
   */
  _setSVGBgOverlayImage(markup, property, reviver) {
    const bgOrOverlay = this[property];
    if (bgOrOverlay && !bgOrOverlay.excludeFromExport && bgOrOverlay.toSVG) {
      markup.push(bgOrOverlay.toSVG(reviver));
    }
  }

  /**
   * @TODO this seems to handle patterns but fail at gradients.
   * @private
   */
  _setSVGBgOverlayColor(markup, property) {
    const filler = this[`${property}Color`];
    if (!filler) {
      return;
    }
    if (isFiller(filler)) {
      const repeat = filler.repeat || '',
        finalWidth = this.width,
        finalHeight = this.height,
        shouldInvert = this[`${property}Vpt`],
        additionalTransform = shouldInvert ? matrixToSVG(invertTransform(this.viewportTransform)) : '';
      markup.push(`<rect transform="${additionalTransform} translate(${finalWidth / 2},${finalHeight / 2})" x="${filler.offsetX - finalWidth / 2}" y="${filler.offsetY - finalHeight / 2}" width="${(repeat === 'repeat-y' || repeat === 'no-repeat') && isPattern(filler) ? filler.source.width : finalWidth}" height="${(repeat === 'repeat-x' || repeat === 'no-repeat') && isPattern(filler) ? filler.source.height : finalHeight}" fill="url(#SVGID_${filler.id})"></rect>\n`);
    } else {
      markup.push('<rect x="0" y="0" width="100%" height="100%" ', 'fill="', filler, '"', '></rect>\n');
    }
  }
  /* _TO_SVG_END_ */

  /**
   * Populates canvas with data from the specified JSON.
   * JSON format must conform to the one of {@link fabric.Canvas#toJSON}
   *
   * **IMPORTANT**: It is recommended to abort loading tasks before calling this method to prevent race conditions and unnecessary networking
   *
   * @param {String|Object} json JSON string or object
   * @param {Function} [reviver] Method for further parsing of JSON elements, called after each fabric object created.
   * @param {Object} [options] options
   * @param {AbortSignal} [options.signal] see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @return {Promise<Canvas | StaticCanvas>} instance
   * @see {@link http://fabric5.fabricjs.com/fabric-intro-part-3#deserialization}
   * @see {@link http://jsfiddle.net/fabricjs/fmgXt/|jsFiddle demo}
   * @example <caption>loadFromJSON</caption>
   * canvas.loadFromJSON(json).then((canvas) => canvas.requestRenderAll());
   * @example <caption>loadFromJSON with reviver</caption>
   * canvas.loadFromJSON(json, function(o, object) {
   *   // `o` = json object
   *   // `object` = fabric.Object instance
   *   // ... do some stuff ...
   * }).then((canvas) => {
   *   ... canvas is restored, add your code.
   * });
   *
   */
  loadFromJSON(json, reviver) {
    let {
      signal
    } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (!json) {
      return Promise.reject(new FabricError('`json` is undefined'));
    }

    // parse json if it wasn't already
    const {
      objects = [],
      ...serialized
    } = typeof json === 'string' ? JSON.parse(json) : json;
    const {
      backgroundImage,
      background,
      overlayImage,
      overlay,
      clipPath
    } = serialized;
    const renderOnAddRemove = this.renderOnAddRemove;
    this.renderOnAddRemove = false;
    return Promise.all([enlivenObjects(objects, {
      reviver,
      signal
    }), enlivenObjectEnlivables({
      backgroundImage,
      backgroundColor: background,
      overlayImage,
      overlayColor: overlay,
      clipPath
    }, {
      signal
    })]).then(_ref2 => {
      let [enlived, enlivedMap] = _ref2;
      this.clear();
      this.add(...enlived);
      this.set(serialized);
      this.set(enlivedMap);
      this.renderOnAddRemove = renderOnAddRemove;
      return this;
    });
  }

  /**
   * Clones canvas instance
   * @param {string[]} [properties] Array of properties to include in the cloned canvas and children
   */
  clone(properties) {
    const data = this.toObject(properties);
    const canvas = this.cloneWithoutData();
    return canvas.loadFromJSON(data);
  }

  /**
   * Clones canvas instance without cloning existing data.
   * This essentially copies canvas dimensions since loadFromJSON does not affect canvas size.
   */
  cloneWithoutData() {
    const el = createCanvasElementFor(this);
    return new this.constructor(el);
  }

  /**
   * Exports canvas element to a dataurl image. Note that when multiplier is used, cropping is scaled appropriately
   * @param {Object} [options] Options object
   * @param {String} [options.format=png] The format of the output image. Either "jpeg" or "png"
   * @param {Number} [options.quality=1] Quality level (0..1). Only used for jpeg.
   * @param {Number} [options.multiplier=1] Multiplier to scale by, to have consistent
   * @param {Number} [options.left] Cropping left offset. Introduced in v1.2.14
   * @param {Number} [options.top] Cropping top offset. Introduced in v1.2.14
   * @param {Number} [options.width] Cropping width. Introduced in v1.2.14
   * @param {Number} [options.height] Cropping height. Introduced in v1.2.14
   * @param {Boolean} [options.enableRetinaScaling] Enable retina scaling for clone image. Introduce in 2.0.0
   * @param {(object: fabric.Object) => boolean} [options.filter] Function to filter objects.
   * @return {String} Returns a data: URL containing a representation of the object in the format specified by options.format
   * @see {@link https://jsfiddle.net/xsjua1rd/ demo}
   * @example <caption>Generate jpeg dataURL with lower quality</caption>
   * var dataURL = canvas.toDataURL({
   *   format: 'jpeg',
   *   quality: 0.8
   * });
   * @example <caption>Generate cropped png dataURL (clipping of canvas)</caption>
   * var dataURL = canvas.toDataURL({
   *   format: 'png',
   *   left: 100,
   *   top: 100,
   *   width: 200,
   *   height: 200
   * });
   * @example <caption>Generate double scaled png dataURL</caption>
   * var dataURL = canvas.toDataURL({
   *   format: 'png',
   *   multiplier: 2
   * });
   * @example <caption>Generate dataURL with objects that overlap a specified object</caption>
   * var myObject;
   * var dataURL = canvas.toDataURL({
   *   filter: (object) => object.isContainedWithinObject(myObject) || object.intersectsWithObject(myObject)
   * });
   */
  toDataURL() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const {
      format = 'png',
      quality = 1,
      multiplier = 1,
      enableRetinaScaling = false
    } = options;
    const finalMultiplier = multiplier * (enableRetinaScaling ? this.getRetinaScaling() : 1);
    return toDataURL(this.toCanvasElement(finalMultiplier, options), format, quality);
  }
  toBlob() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const {
      format = 'png',
      quality = 1,
      multiplier = 1,
      enableRetinaScaling = false
    } = options;
    const finalMultiplier = multiplier * (enableRetinaScaling ? this.getRetinaScaling() : 1);
    return toBlob(this.toCanvasElement(finalMultiplier, options), format, quality);
  }

  /**
   * Create a new HTMLCanvas element painted with the current canvas content.
   * No need to resize the actual one or repaint it.
   * Will transfer object ownership to a new canvas, paint it, and set everything back.
   * This is an intermediary step used to get to a dataUrl but also it is useful to
   * create quick image copies of a canvas without passing for the dataUrl string
   * @param {Number} [multiplier] a zoom factor.
   * @param {Object} [options] Cropping informations
   * @param {Number} [options.left] Cropping left offset.
   * @param {Number} [options.top] Cropping top offset.
   * @param {Number} [options.width] Cropping width.
   * @param {Number} [options.height] Cropping height.
   * @param {(object: fabric.Object) => boolean} [options.filter] Function to filter objects.
   */
  toCanvasElement() {
    let multiplier = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    let {
      width,
      height,
      left,
      top,
      filter
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const scaledWidth = (width || this.width) * multiplier,
      scaledHeight = (height || this.height) * multiplier,
      zoom = this.getZoom(),
      originalWidth = this.width,
      originalHeight = this.height,
      originalSkipControlsDrawing = this.skipControlsDrawing,
      newZoom = zoom * multiplier,
      vp = this.viewportTransform,
      translateX = (vp[4] - (left || 0)) * multiplier,
      translateY = (vp[5] - (top || 0)) * multiplier,
      newVp = [newZoom, 0, 0, newZoom, translateX, translateY],
      originalRetina = this.enableRetinaScaling,
      canvasEl = createCanvasElementFor({
        width: scaledWidth,
        height: scaledHeight
      }),
      objectsToRender = filter ? this._objects.filter(obj => filter(obj)) : this._objects;
    this.enableRetinaScaling = false;
    this.viewportTransform = newVp;
    this.width = scaledWidth;
    this.height = scaledHeight;
    this.skipControlsDrawing = true;
    this.calcViewportBoundaries();
    this.renderCanvas(canvasEl.getContext('2d'), objectsToRender);
    this.viewportTransform = vp;
    this.width = originalWidth;
    this.height = originalHeight;
    this.calcViewportBoundaries();
    this.enableRetinaScaling = originalRetina;
    this.skipControlsDrawing = originalSkipControlsDrawing;
    return canvasEl;
  }

  /**
   * Waits until rendering has settled to destroy the canvas
   * @returns {Promise<boolean>} a promise resolving to `true` once the canvas has been destroyed or to `false` if the canvas has was already destroyed
   * @throws if aborted by a consequent call
   */
  dispose() {
    !this.disposed && this.elements.cleanupDOM({
      width: this.width,
      height: this.height
    });
    runningAnimations.cancelByCanvas(this);
    this.disposed = true;
    return new Promise((resolve, reject) => {
      const task = () => {
        this.destroy();
        resolve(true);
      };
      task.kill = reject;
      if (this.__cleanupTask) {
        this.__cleanupTask.kill('aborted');
      }
      if (this.destroyed) {
        resolve(false);
      } else if (this.nextRenderHandle) {
        this.__cleanupTask = task;
      } else {
        task();
      }
    });
  }

  /**
   * Clears the canvas element, disposes objects and frees resources.
   *
   * Invoked as part of the **async** operation of {@link dispose}.
   *
   * **CAUTION**:
   *
   * This method is **UNSAFE**.
   * You may encounter a race condition using it if there's a requested render.
   * Call this method only if you are sure rendering has settled.
   * Consider using {@link dispose} as it is **SAFE**
   *
   * @private
   */
  destroy() {
    this.destroyed = true;
    this.cancelRequestedRender();
    this.forEachObject(object => object.dispose());
    this._objects = [];
    if (this.backgroundImage) {
      this.backgroundImage.dispose();
    }
    this.backgroundImage = undefined;
    if (this.overlayImage) {
      this.overlayImage.dispose();
    }
    this.overlayImage = undefined;
    this.elements.dispose();
  }

  /**
   * Returns a string representation of an instance
   * @return {String} string representation of an instance
   */
  toString() {
    return `#<Canvas (${this.complexity()}): { objects: ${this._objects.length} }>`;
  }
};
_defineProperty(StaticCanvas$1, "ownDefaults", staticCanvasDefaults);

const touchEvents = ['touchstart', 'touchmove', 'touchend'];
function getTouchInfo(event) {
  const touchProp = event.changedTouches;
  if (touchProp && touchProp[0]) {
    return touchProp[0];
  }
  return event;
}
const getPointer = event => {
  const element = event.target,
    scroll = getScrollLeftTop(element),
    _evt = getTouchInfo(event);
  return new Point(_evt.clientX + scroll.left, _evt.clientY + scroll.top);
};
const isTouchEvent = event => touchEvents.includes(event.type) || event.pointerType === 'touch';
const stopEvent = e => {
  e.preventDefault();
  e.stopPropagation();
};

/**
 * Calculates bounding box (left, top, width, height) from given `points`
 * @param {XY[]} points
 * @return {Object} Object with left, top, width, height properties
 */
const makeBoundingBoxFromPoints = points => {
  let left = 0,
    top = 0,
    width = 0,
    height = 0;
  for (let i = 0, len = points.length; i < len; i++) {
    const {
      x,
      y
    } = points[i];
    if (x > width || !i) width = x;
    if (x < left || !i) left = x;
    if (y > height || !i) height = y;
    if (y < top || !i) top = y;
  }
  return {
    left,
    top,
    width: width - left,
    height: height - top
  };
};

/**
 * given an object and a transform, apply the inverse transform to the object,
 * this is equivalent to remove from that object that transformation, so that
 * added in a space with the removed transform, the object will be the same as before.
 * Removing from an object a transform that scale by 2 is like scaling it by 1/2.
 * Removing from an object a transform that rotate by 30deg is like rotating by 30deg
 * in the opposite direction.
 * This util is used to add objects inside transformed groups or nested groups.
 * @param {FabricObject} object the object you want to transform
 * @param {TMat2D} transform the destination transform
 */
const removeTransformFromObject = (object, transform) => {
  const inverted = invertTransform(transform),
    finalTransform = multiplyTransformMatrices(inverted, object.calcOwnMatrix());
  applyTransformToObject(object, finalTransform);
};

/**
 * given an object and a transform, apply the transform to the object.
 * this is equivalent to change the space where the object is drawn.
 * Adding to an object a transform that scale by 2 is like scaling it by 2.
 * This is used when removing an object from an active selection for example.
 * @param {FabricObject} object the object you want to transform
 * @param {Array} transform the destination transform
 */
const addTransformToObject = (object, transform) => applyTransformToObject(object, multiplyTransformMatrices(transform, object.calcOwnMatrix()));

/**
 * discard an object transform state and apply the one from the matrix.
 * @param {FabricObject} object the object you want to transform
 * @param {Array} transform the destination transform
 */
const applyTransformToObject = (object, transform) => {
  const {
      translateX,
      translateY,
      scaleX,
      scaleY,
      ...otherOptions
    } = qrDecompose(transform),
    center = new Point(translateX, translateY);
  object.flipX = false;
  object.flipY = false;
  Object.assign(object, otherOptions);
  object.set({
    scaleX,
    scaleY
  });
  object.setPositionByOrigin(center, CENTER, CENTER);
};
/**
 * reset an object transform state to neutral. Top and left are not accounted for
 * @param  {FabricObject} target object to transform
 */
const resetObjectTransform = target => {
  target.scaleX = 1;
  target.scaleY = 1;
  target.skewX = 0;
  target.skewY = 0;
  target.flipX = false;
  target.flipY = false;
  target.rotate(0);
};

/**
 * Extract Object transform values
 * @param  {FabricObject} target object to read from
 * @return {Object} Components of transform
 */
const saveObjectTransform = target => ({
  scaleX: target.scaleX,
  scaleY: target.scaleY,
  skewX: target.skewX,
  skewY: target.skewY,
  angle: target.angle,
  left: target.left,
  flipX: target.flipX,
  flipY: target.flipY,
  top: target.top
});

/**
 * given a width and height, return the size of the bounding box
 * that can contains the box with width/height with applied transform.
 * Use to calculate the boxes around objects for controls.
 * @param {Number} width
 * @param {Number} height
 * @param {TMat2D} t
 * @returns {Point} size
 */
const sizeAfterTransform = (width, height, t) => {
  const dimX = width / 2,
    dimY = height / 2,
    points = [new Point(-dimX, -dimY), new Point(dimX, -dimY), new Point(-dimX, dimY), new Point(dimX, dimY)].map(p => p.transform(t)),
    bbox = makeBoundingBoxFromPoints(points);
  return new Point(bbox.width, bbox.height);
};

/**
 * We are actually looking for the transformation from the destination plane to the source plane (change of basis matrix)\
 * The object will exist on the destination plane and we want it to seem unchanged by it so we invert the destination matrix (`to`) and then apply the source matrix (`from`)
 * @param [from]
 * @param [to]
 * @returns
 */
const calcPlaneChangeMatrix = function () {
  let from = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : iMatrix;
  let to = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : iMatrix;
  return multiplyTransformMatrices(invertTransform(to), from);
};

/**
 * Sends a point from the source coordinate plane to the destination coordinate plane.\
 * From the canvas/viewer's perspective the point remains unchanged.
 *
 * @example <caption>Send point from canvas plane to group plane</caption>
 * var obj = new Rect({ left: 20, top: 20, width: 60, height: 60, strokeWidth: 0 });
 * var group = new Group([obj], { strokeWidth: 0 });
 * var sentPoint1 = sendPointToPlane(new Point(50, 50), undefined, group.calcTransformMatrix());
 * var sentPoint2 = sendPointToPlane(new Point(50, 50), iMatrix, group.calcTransformMatrix());
 * console.log(sentPoint1, sentPoint2) //  both points print (0,0) which is the center of group
 *
 * @param {Point} point
 * @param {TMat2D} [from] plane matrix containing object. Passing `undefined` is equivalent to passing the identity matrix, which means `point` exists in the canvas coordinate plane.
 * @param {TMat2D} [to] destination plane matrix to contain object. Passing `undefined` means `point` should be sent to the canvas coordinate plane.
 * @returns {Point} transformed point
 */
const sendPointToPlane = function (point) {
  let from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : iMatrix;
  let to = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : iMatrix;
  return point.transform(calcPlaneChangeMatrix(from, to));
};

/**
 * See {@link sendPointToPlane}
 */
const sendVectorToPlane = function (point) {
  let from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : iMatrix;
  let to = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : iMatrix;
  return point.transform(calcPlaneChangeMatrix(from, to), true);
};

/**
 *
 * A util that abstracts applying transform to objects.\
 * Sends `object` to the destination coordinate plane by applying the relevant transformations.\
 * Changes the space/plane where `object` is drawn.\
 * From the canvas/viewer's perspective `object` remains unchanged.
 *
 * @example <caption>Move clip path from one object to another while preserving it's appearance as viewed by canvas/viewer</caption>
 * let obj, obj2;
 * let clipPath = new Circle({ radius: 50 });
 * obj.clipPath = clipPath;
 * // render
 * sendObjectToPlane(clipPath, obj.calcTransformMatrix(), obj2.calcTransformMatrix());
 * obj.clipPath = undefined;
 * obj2.clipPath = clipPath;
 * // render, clipPath now clips obj2 but seems unchanged from the eyes of the viewer
 *
 * @example <caption>Clip an object's clip path with an existing object</caption>
 * let obj, existingObj;
 * let clipPath = new Circle({ radius: 50 });
 * obj.clipPath = clipPath;
 * let transformTo = multiplyTransformMatrices(obj.calcTransformMatrix(), clipPath.calcTransformMatrix());
 * sendObjectToPlane(existingObj, existingObj.group?.calcTransformMatrix(), transformTo);
 * clipPath.clipPath = existingObj;
 *
 * @param {FabricObject} object
 * @param {Matrix} [from] plane matrix containing object. Passing `undefined` is equivalent to passing the identity matrix, which means `object` is a direct child of canvas.
 * @param {Matrix} [to] destination plane matrix to contain object. Passing `undefined` means `object` should be sent to the canvas coordinate plane.
 * @returns {Matrix} the transform matrix that was applied to `object`
 */
const sendObjectToPlane = (object, from, to) => {
  const t = calcPlaneChangeMatrix(from, to);
  applyTransformToObject(object, multiplyTransformMatrices(t, object.calcOwnMatrix()));
  return t;
};

const fireEvent = (eventName, options) => {
  var _target$canvas;
  const {
    transform: {
      target
    }
  } = options;
  (_target$canvas = target.canvas) === null || _target$canvas === void 0 || _target$canvas.fire(`object:${eventName}`, {
    ...options,
    target
  });
  target.fire(eventName, options);
};

const originOffset = {
  left: -0.5,
  top: -0.5,
  center: 0,
  bottom: 0.5,
  right: 0.5
};
/**
 * Resolves origin value relative to center
 * @private
 * @param {TOriginX | TOriginY} originValue originX / originY
 * @returns number
 */

const resolveOrigin = originValue => typeof originValue === 'string' ? originOffset[originValue] : originValue - 0.5;

const unitVectorX = new Point(1, 0);
const zero = new Point();

/**
 * Rotates `vector` with `radians`
 * @param {Point} vector The vector to rotate (x and y)
 * @param {Number} radians The radians of the angle for the rotation
 * @return {Point} The new rotated point
 */
const rotateVector = (vector, radians) => vector.rotate(radians);

/**
 * Creates a vector from points represented as a point
 *
 * @param {Point} from
 * @param {Point} to
 * @returns {Point} vector
 */
const createVector = (from, to) => new Point(to).subtract(from);

/**
 * return the magnitude of a vector
 * @return {number}
 */
const magnitude = point => point.distanceFrom(zero);

/**
 * Calculates the angle between 2 vectors
 * @param {Point} a
 * @param {Point} b
 * @returns the angle in radians from `a` to `b`
 */
const calcAngleBetweenVectors = (a, b) => Math.atan2(crossProduct(a, b), dotProduct(a, b));

/**
 * Calculates the angle between the x axis and the vector
 * @param {Point} v
 * @returns the angle in radians of `v`
 */
const calcVectorRotation = v => calcAngleBetweenVectors(unitVectorX, v);

/**
 * @param {Point} v
 * @returns {Point} vector representing the unit vector pointing to the direction of `v`
 */
const getUnitVector = v => v.eq(zero) ? v : v.scalarDivide(magnitude(v));

/**
 * @param {Point} v
 * @param {Boolean} [counterClockwise] the direction of the orthogonal vector, defaults to `true`
 * @returns {Point} the unit orthogonal vector
 */
const getOrthonormalVector = function (v) {
  let counterClockwise = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return getUnitVector(new Point(-v.y, v.x).scalarMultiply(counterClockwise ? 1 : -1));
};

/**
 * Cross product of two vectors in 2D
 * @param {Point} a
 * @param {Point} b
 * @returns {number} the magnitude of Z vector
 */
const crossProduct = (a, b) => a.x * b.y - a.y * b.x;

/**
 * Dot product of two vectors in 2D
 * @param {Point} a
 * @param {Point} b
 * @returns {number}
 */
const dotProduct = (a, b) => a.x * b.x + a.y * b.y;

/**
 * Checks if the vector is between two others. It is considered
 * to be inside when the vector to be tested is between the
 * initial vector and the final vector (included) in a counterclockwise direction.
 * @param {Point} t vector to be tested
 * @param {Point} a initial vector
 * @param {Point} b final vector
 * @returns {boolean} true if the vector is among the others
 */
const isBetweenVectors = (t, a, b) => {
  if (t.eq(a) || t.eq(b)) return true;
  const AxB = crossProduct(a, b),
    AxT = crossProduct(a, t),
    BxT = crossProduct(b, t);
  return AxB >= 0 ? AxT >= 0 && BxT <= 0 : !(AxT <= 0 && BxT >= 0);
};

const NOT_ALLOWED_CURSOR = 'not-allowed';

/**
 * @param {Boolean} alreadySelected true if target is already selected
 * @param {String} corner a string representing the corner ml, mr, tl ...
 * @param {Event} e Event object
 * @param {FabricObject} [target] inserted back to help overriding. Unused
 */
const getActionFromCorner = (alreadySelected, corner, e, target) => {
  if (!corner || !alreadySelected) {
    return 'drag';
  }
  const control = target.controls[corner];
  return control.getActionName(e, control, target);
};

/**
 * Checks if transform is centered
 * @param {Object} transform transform data
 * @return {Boolean} true if transform is centered
 */
function isTransformCentered(transform) {
  return resolveOrigin(transform.originX) === resolveOrigin(CENTER) && resolveOrigin(transform.originY) === resolveOrigin(CENTER);
}
function invertOrigin(origin) {
  return -resolveOrigin(origin) + 0.5;
}
const isLocked = (target, lockingKey) => target[lockingKey];
const commonEventInfo = (eventData, transform, x, y) => {
  return {
    e: eventData,
    transform,
    pointer: new Point(x, y)
  };
};

/**
 * Combine control position and object angle to find the control direction compared
 * to the object center.
 * @param {FabricObject} fabricObject the fabric object for which we are rendering controls
 * @param {Control} control the control class
 * @return {Number} 0 - 7 a quadrant number
 */
function findCornerQuadrant(fabricObject, control, coord) {
  const target = coord;
  const center = sendPointToPlane(fabricObject.getCenterPoint(), fabricObject.canvas.viewportTransform, undefined);
  const angle = calcVectorRotation(createVector(center, target)) + twoMathPi;
  return Math.round(angle % twoMathPi / quarterPI);
}

/**
 * @returns the normalized point (rotated relative to center) in local coordinates
 */
function normalizePoint(target, point, originX, originY) {
  const center = target.getRelativeCenterPoint(),
    p = typeof originX !== 'undefined' && typeof originY !== 'undefined' ? target.translateToGivenOrigin(center, CENTER, CENTER, originX, originY) : new Point(target.left, target.top),
    p2 = target.angle ? point.rotate(-degreesToRadians(target.angle), center) : point;
  return p2.subtract(p);
}

/**
 * Transforms a point to the offset from the given origin
 * @param {Object} transform
 * @param {String} originX
 * @param {String} originY
 * @param {number} x
 * @param {number} y
 * @return {Fabric.Point} the normalized point
 */
function getLocalPoint(_ref, originX, originY, x, y) {
  var _target$canvas;
  let {
    target,
    corner
  } = _ref;
  const control = target.controls[corner],
    zoom = ((_target$canvas = target.canvas) === null || _target$canvas === void 0 ? void 0 : _target$canvas.getZoom()) || 1,
    padding = target.padding / zoom,
    localPoint = normalizePoint(target, new Point(x, y), originX, originY);
  if (localPoint.x >= padding) {
    localPoint.x -= padding;
  }
  if (localPoint.x <= -padding) {
    localPoint.x += padding;
  }
  if (localPoint.y >= padding) {
    localPoint.y -= padding;
  }
  if (localPoint.y <= padding) {
    localPoint.y += padding;
  }
  localPoint.x -= control.offsetX;
  localPoint.y -= control.offsetY;
  return localPoint;
}

/**
 * Action handler
 * @private
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if the translation occurred
 */
const dragHandler = (eventData, transform, x, y) => {
  const {
      target,
      offsetX,
      offsetY
    } = transform,
    newLeft = x - offsetX,
    newTop = y - offsetY,
    moveX = !isLocked(target, 'lockMovementX') && target.left !== newLeft,
    moveY = !isLocked(target, 'lockMovementY') && target.top !== newTop;
  moveX && target.set(LEFT, newLeft);
  moveY && target.set(TOP, newTop);
  if (moveX || moveY) {
    fireEvent(MOVING, commonEventInfo(eventData, transform, x, y));
  }
  return moveX || moveY;
};

const normalizeWs = value => value.replace(/\s+/g, ' ');

/**
 * Map of the 148 color names with HEX code
 * @see: https://www.w3.org/TR/css3-color/#svg-color
 */
const ColorNameMap = {
  aliceblue: '#F0F8FF',
  antiquewhite: '#FAEBD7',
  aqua: '#0FF',
  aquamarine: '#7FFFD4',
  azure: '#F0FFFF',
  beige: '#F5F5DC',
  bisque: '#FFE4C4',
  black: '#000',
  blanchedalmond: '#FFEBCD',
  blue: '#00F',
  blueviolet: '#8A2BE2',
  brown: '#A52A2A',
  burlywood: '#DEB887',
  cadetblue: '#5F9EA0',
  chartreuse: '#7FFF00',
  chocolate: '#D2691E',
  coral: '#FF7F50',
  cornflowerblue: '#6495ED',
  cornsilk: '#FFF8DC',
  crimson: '#DC143C',
  cyan: '#0FF',
  darkblue: '#00008B',
  darkcyan: '#008B8B',
  darkgoldenrod: '#B8860B',
  darkgray: '#A9A9A9',
  darkgrey: '#A9A9A9',
  darkgreen: '#006400',
  darkkhaki: '#BDB76B',
  darkmagenta: '#8B008B',
  darkolivegreen: '#556B2F',
  darkorange: '#FF8C00',
  darkorchid: '#9932CC',
  darkred: '#8B0000',
  darksalmon: '#E9967A',
  darkseagreen: '#8FBC8F',
  darkslateblue: '#483D8B',
  darkslategray: '#2F4F4F',
  darkslategrey: '#2F4F4F',
  darkturquoise: '#00CED1',
  darkviolet: '#9400D3',
  deeppink: '#FF1493',
  deepskyblue: '#00BFFF',
  dimgray: '#696969',
  dimgrey: '#696969',
  dodgerblue: '#1E90FF',
  firebrick: '#B22222',
  floralwhite: '#FFFAF0',
  forestgreen: '#228B22',
  fuchsia: '#F0F',
  gainsboro: '#DCDCDC',
  ghostwhite: '#F8F8FF',
  gold: '#FFD700',
  goldenrod: '#DAA520',
  gray: '#808080',
  grey: '#808080',
  green: '#008000',
  greenyellow: '#ADFF2F',
  honeydew: '#F0FFF0',
  hotpink: '#FF69B4',
  indianred: '#CD5C5C',
  indigo: '#4B0082',
  ivory: '#FFFFF0',
  khaki: '#F0E68C',
  lavender: '#E6E6FA',
  lavenderblush: '#FFF0F5',
  lawngreen: '#7CFC00',
  lemonchiffon: '#FFFACD',
  lightblue: '#ADD8E6',
  lightcoral: '#F08080',
  lightcyan: '#E0FFFF',
  lightgoldenrodyellow: '#FAFAD2',
  lightgray: '#D3D3D3',
  lightgrey: '#D3D3D3',
  lightgreen: '#90EE90',
  lightpink: '#FFB6C1',
  lightsalmon: '#FFA07A',
  lightseagreen: '#20B2AA',
  lightskyblue: '#87CEFA',
  lightslategray: '#789',
  lightslategrey: '#789',
  lightsteelblue: '#B0C4DE',
  lightyellow: '#FFFFE0',
  lime: '#0F0',
  limegreen: '#32CD32',
  linen: '#FAF0E6',
  magenta: '#F0F',
  maroon: '#800000',
  mediumaquamarine: '#66CDAA',
  mediumblue: '#0000CD',
  mediumorchid: '#BA55D3',
  mediumpurple: '#9370DB',
  mediumseagreen: '#3CB371',
  mediumslateblue: '#7B68EE',
  mediumspringgreen: '#00FA9A',
  mediumturquoise: '#48D1CC',
  mediumvioletred: '#C71585',
  midnightblue: '#191970',
  mintcream: '#F5FFFA',
  mistyrose: '#FFE4E1',
  moccasin: '#FFE4B5',
  navajowhite: '#FFDEAD',
  navy: '#000080',
  oldlace: '#FDF5E6',
  olive: '#808000',
  olivedrab: '#6B8E23',
  orange: '#FFA500',
  orangered: '#FF4500',
  orchid: '#DA70D6',
  palegoldenrod: '#EEE8AA',
  palegreen: '#98FB98',
  paleturquoise: '#AFEEEE',
  palevioletred: '#DB7093',
  papayawhip: '#FFEFD5',
  peachpuff: '#FFDAB9',
  peru: '#CD853F',
  pink: '#FFC0CB',
  plum: '#DDA0DD',
  powderblue: '#B0E0E6',
  purple: '#800080',
  rebeccapurple: '#639',
  red: '#F00',
  rosybrown: '#BC8F8F',
  royalblue: '#4169E1',
  saddlebrown: '#8B4513',
  salmon: '#FA8072',
  sandybrown: '#F4A460',
  seagreen: '#2E8B57',
  seashell: '#FFF5EE',
  sienna: '#A0522D',
  silver: '#C0C0C0',
  skyblue: '#87CEEB',
  slateblue: '#6A5ACD',
  slategray: '#708090',
  slategrey: '#708090',
  snow: '#FFFAFA',
  springgreen: '#00FF7F',
  steelblue: '#4682B4',
  tan: '#D2B48C',
  teal: '#008080',
  thistle: '#D8BFD8',
  tomato: '#FF6347',
  turquoise: '#40E0D0',
  violet: '#EE82EE',
  wheat: '#F5DEB3',
  white: '#FFF',
  whitesmoke: '#F5F5F5',
  yellow: '#FF0',
  yellowgreen: '#9ACD32'
};

/**
 * Regex matching color in RGB or RGBA formats (ex: `rgb(0, 0, 0)`, `rgba(255, 100, 10, 0.5)`, `rgba( 255 , 100 , 10 , 0.5 )`, `rgb(1,1,1)`, `rgba(100%, 60%, 10%, 0.5)`)
 * Also matching rgba(r g b / a) as per new specs
 * https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb
 *
 * In order to avoid performance issues, you have to clean the input string for this regex from multiple spaces before.
 * ex: colorString.replace(/\s+/g, ' ');
 *
 * Formal syntax at the time of writing:
 * <rgb()> =
 *  rgb( [ <percentage> | none ]{3} [ / [ <alpha-value> | none ] ]? )  |
 *  rgb( [ <number> | none ]{3} [ / [ <alpha-value> | none ] ]? )
 * <alpha-value> = <number> | <percentage>
 *
 * For learners this is how you can read this regex
 * Regular expression for matching an rgba or rgb CSS color value
 *
 * /^          # Beginning of the string
 * rgba?       # "rgb" or "rgba"
 * \(\s?       # Opening parenthesis and zero or one whitespace character
 * (\d{0,3}    # 0 to three digits R channel
 *  (?:\.\d+)? # Optional decimal with one or more digits
 * )           # End of capturing group for the first color component
 * %?          # Optional percent sign after the first color component
 * \s?         # Zero or one whitespace character
 * [\s|,]      # Separator between color components can be a space or comma
 * \s?         # Zero or one whitespace character
 * (\d{0,3}    # 0 to three digits G channel
 *  (?:\.\d+)? # Optional decimal with one or more digits
 * )           # End of capturing group for the second color component
 * %?          # Optional percent sign after the second color component
 * \s?         # Zero or one whitespace character
 * [\s|,]      # Separator between color components can be a space or comma
 * \s?         # Zero or one whitespace character
 * (\d{0,3}    # 0 to three digits B channel
 *  (?:\.\d+)? # Optional decimal with one or more digits
 * )           # End of capturing group for the third color component
 * %?          # Optional percent sign after the third color component
 * \s?         # Zero or one whitespace character
 * (?:         # Beginning of non-capturing group for alpha value
 *  \s?        # Zero or one whitespace character
 *  [,/]       # Comma or slash separator for alpha value
 *  \s?        # Zero or one whitespace character
 *  (\d{0,3}   # Zero to three digits
 *    (?:\.\d+)? # Optional decimal with one or more digits
 *  )          # End of capturing group for alpha value
 *  %?         # Optional percent sign after alpha value
 *  \s?        # Zero or one whitespace character
 * )?          # End of non-capturing group for alpha value (optional)
 * \)          # Closing parenthesis
 * $           # End of the string
 *
 * The alpha channel can be in the format 0.4 .7 or 1 or 73%
 *
 * WARNING this regex doesn't fail on off spec colors. it matches everything that could be a color.
 * So the spec does not allow for `rgba(30 , 45%  35, 49%)` but this will work anyways for us
 */
const reRGBa = () => /^rgba?\(\s?(\d{0,3}(?:\.\d+)?%?)\s?[\s|,]\s?(\d{0,3}(?:\.\d+)?%?)\s?[\s|,]\s?(\d{0,3}(?:\.\d+)?%?)\s?(?:\s?[,/]\s?(\d{0,3}(?:\.\d+)?%?)\s?)?\)$/i;

/**
 * Regex matching color in HSL or HSLA formats (ex: hsl(0deg 0%, 0%), hsla(160, 100, 10, 0.5), hsla( 180 , 100 , 10 , 0.5 ), hsl(1,1,1))
 * Also matching hsla(h s l / a) as per new specs
 * https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl
 * In order to avoid performance issues, you have to clean the input string for this regex from multiple spaces before.
 * ex: colorString.replace(/\s+/g, ' ');
 * Formal syntax at the time of writing:
 * <hsl()> =
 *   hsl( [ <hue> | none ] [ <percentage> | none ] [ <percentage> | none ] [ / [ <alpha-value> | none ] ]? )
 *
 * <hue> =
 *   <number>  |
 *   <angle>
 *
 * <alpha-value> =
 *   <number>      |
 *   <percentage>
 *
 * For learners this is how you can read this regex
 * Regular expression for matching an hsla or hsl CSS color value
 *
 * /^hsla?\(         // Matches the beginning of the string and the opening parenthesis of "hsl" or "hsla"
 * \s?               // Matches any whitespace character (space, tab, etc.) zero or one time
 * (\d{0,3}          // Hue: 0 to three digits - start capture in a group
 * (?:\.\d+)?        // Hue: Optional (non capture group) decimal with one or more digits.
 * (?:deg|turn|rad)? // Hue: Optionally include suffix deg or turn or rad
 * )                 // Hue: End capture group
 * \s?               // Matches any whitespace character zero or one time
 * [\s|,]            // Matches a space, tab or comma
 * \s?               // Matches any whitespace character zero or one time
 * (\d{0,3}          // Saturation: 0 to three digits - start capture in a group
 * (?:\.\d+)?        // Saturation: Optional decimal with one or more digits in a non-capturing group
 * %?)               // Saturation: match optional % character and end capture group
 * \s?               // Matches any whitespace character zero or one time
 * [\s|,]            // Matches a space, tab or comma
 * \s?               // Matches any whitespace character zero or one time
 * (\d{0,3}          // Lightness: 0 to three digits - start capture in a group
 * (?:\.\d+)?        // Lightness: Optional decimal with one or more digits in a non-capturing group
 * %?)                // Lightness: match % character and end capture group
 * \s?               // Matches any whitespace character zero or one time
 * (?:               // Alpha: Begins a non-capturing group for the alpha value
 *   \s?             // Matches any whitespace character zero or one time
 *   [,/]            // Matches a comma or forward slash
 *   \s?             // Matches any whitespace character zero or one time
 *   (\d*(?:\.\d+)?%?) // Matches zero or more digits, optionally followed by a decimal point and one or more digits, followed by an optional percentage sign and captures it in a group
 *   \s?             // Matches any whitespace character zero or one time
 * )?                // Makes the alpha value group optional
 * \)                // Matches the closing parenthesis
 * $/i               // Matches the end of the string and sets the regular expression to case-insensitive mode
 *
 * WARNING this regex doesn't fail on off spec colors. It matches everything that could be a color.
 * So the spec does not allow `hsl(30 , 45%  35, 49%)` but this will work anyways for us.
 */
const reHSLa = () => /^hsla?\(\s?([+-]?\d{0,3}(?:\.\d+)?(?:deg|turn|rad)?)\s?[\s|,]\s?(\d{0,3}(?:\.\d+)?%?)\s?[\s|,]\s?(\d{0,3}(?:\.\d+)?%?)\s?(?:\s?[,/]\s?(\d*(?:\.\d+)?%?)\s?)?\)$/i;

/**
 * Regex matching color in HEX format (ex: #FF5544CC, #FF5555, 010155, aff)
 */
const reHex = () => /^#?(([0-9a-f]){3,4}|([0-9a-f]{2}){3,4})$/i;

/**
 * @param {Number} p
 * @param {Number} q
 * @param {Number} t
 * @return {Number}
 */
const hue2rgb = (p, q, t) => {
  if (t < 0) {
    t += 1;
  }
  if (t > 1) {
    t -= 1;
  }
  if (t < 1 / 6) {
    return p + (q - p) * 6 * t;
  }
  if (t < 1 / 2) {
    return q;
  }
  if (t < 2 / 3) {
    return p + (q - p) * (2 / 3 - t) * 6;
  }
  return p;
};

/**
 * Adapted from {@link https://gist.github.com/mjackson/5311256 https://gist.github.com/mjackson}
 * @param {Number} r Red color value
 * @param {Number} g Green color value
 * @param {Number} b Blue color value
 * @param {Number} a Alpha color value pass through
 * @return {TRGBColorSource} Hsl color
 */
const rgb2Hsl = (r, g, b, a) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const maxValue = Math.max(r, g, b),
    minValue = Math.min(r, g, b);
  let h, s;
  const l = (maxValue + minValue) / 2;
  if (maxValue === minValue) {
    h = s = 0; // achromatic
  } else {
    const d = maxValue - minValue;
    s = l > 0.5 ? d / (2 - maxValue - minValue) : d / (maxValue + minValue);
    switch (maxValue) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100), a];
};
const fromAlphaToFloat = function () {
  let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '1';
  return parseFloat(value) / (value.endsWith('%') ? 100 : 1);
};

/**
 * Convert a value in the inclusive range [0, 255] to hex
 */
const hexify = value => Math.min(Math.round(value), 255).toString(16).toUpperCase().padStart(2, '0');

/**
 * Calculate the grey average value for rgb and pass through alpha
 */
const greyAverage = _ref => {
  let [r, g, b, a = 1] = _ref;
  const avg = Math.round(r * 0.3 + g * 0.59 + b * 0.11);
  return [avg, avg, avg, a];
};

/**
 * @class Color common color operations
 * @see {@link http://fabric5.fabricjs.com/fabric-intro-part-2#colors colors}
 */
class Color {
  /**
   *
   * @param {string} [color] optional in hex or rgb(a) or hsl format or from known color list
   */
  constructor(color) {
    _defineProperty(this, "isUnrecognised", false);
    if (!color) {
      // we default to black as canvas does
      this.setSource([0, 0, 0, 1]);
    } else if (color instanceof Color) {
      this.setSource([...color._source]);
    } else if (Array.isArray(color)) {
      const [r, g, b, a = 1] = color;
      this.setSource([r, g, b, a]);
    } else {
      this.setSource(this._tryParsingColor(color));
    }
  }

  /**
   * @private
   * @param {string} [color] Color value to parse
   * @returns {TRGBAColorSource}
   */
  _tryParsingColor(color) {
    color = color.toLowerCase();
    if (color in ColorNameMap) {
      color = ColorNameMap[color];
    }
    return color === 'transparent' ? [255, 255, 255, 0] : Color.sourceFromHex(color) || Color.sourceFromRgb(color) || Color.sourceFromHsl(color) ||
    // color is not recognized
    // we default to black as canvas does
    // eslint-disable-next-line no-constant-binary-expression
    (this.isUnrecognised = true) && [0, 0, 0, 1];
  }

  /**
   * Returns source of this color (where source is an array representation; ex: [200, 200, 100, 1])
   * @return {TRGBAColorSource}
   */
  getSource() {
    return this._source;
  }

  /**
   * Sets source of this color (where source is an array representation; ex: [200, 200, 100, 1])
   * @param {TRGBAColorSource} source
   */
  setSource(source) {
    this._source = source;
  }

  /**
   * Returns color representation in RGB format
   * @return {String} ex: rgb(0-255,0-255,0-255)
   */
  toRgb() {
    const [r, g, b] = this.getSource();
    return `rgb(${r},${g},${b})`;
  }

  /**
   * Returns color representation in RGBA format
   * @return {String} ex: rgba(0-255,0-255,0-255,0-1)
   */
  toRgba() {
    return `rgba(${this.getSource().join(',')})`;
  }

  /**
   * Returns color representation in HSL format
   * @return {String} ex: hsl(0-360,0%-100%,0%-100%)
   */
  toHsl() {
    const [h, s, l] = rgb2Hsl(...this.getSource());
    return `hsl(${h},${s}%,${l}%)`;
  }

  /**
   * Returns color representation in HSLA format
   * @return {String} ex: hsla(0-360,0%-100%,0%-100%,0-1)
   */
  toHsla() {
    const [h, s, l, a] = rgb2Hsl(...this.getSource());
    return `hsla(${h},${s}%,${l}%,${a})`;
  }

  /**
   * Returns color representation in HEX format
   * @return {String} ex: FF5555
   */
  toHex() {
    const fullHex = this.toHexa();
    return fullHex.slice(0, 6);
  }

  /**
   * Returns color representation in HEXA format
   * @return {String} ex: FF5555CC
   */
  toHexa() {
    const [r, g, b, a] = this.getSource();
    return `${hexify(r)}${hexify(g)}${hexify(b)}${hexify(Math.round(a * 255))}`;
  }

  /**
   * Gets value of alpha channel for this color
   * @return {Number} 0-1
   */
  getAlpha() {
    return this.getSource()[3];
  }

  /**
   * Sets value of alpha channel for this color
   * @param {Number} alpha Alpha value 0-1
   * @return {Color} thisArg
   */
  setAlpha(alpha) {
    this._source[3] = alpha;
    return this;
  }

  /**
   * Transforms color to its grayscale representation
   * @return {Color} thisArg
   */
  toGrayscale() {
    this.setSource(greyAverage(this.getSource()));
    return this;
  }

  /**
   * Transforms color to its black and white representation
   * @param {Number} threshold
   * @return {Color} thisArg
   */
  toBlackWhite(threshold) {
    const [average,,, a] = greyAverage(this.getSource()),
      bOrW = average < (threshold || 127) ? 0 : 255;
    this.setSource([bOrW, bOrW, bOrW, a]);
    return this;
  }

  /**
   * Overlays color with another color
   * @param {String|Color} otherColor
   * @return {Color} thisArg
   */
  overlayWith(otherColor) {
    if (!(otherColor instanceof Color)) {
      otherColor = new Color(otherColor);
    }
    const source = this.getSource(),
      otherAlpha = 0.5,
      otherSource = otherColor.getSource(),
      [R, G, B] = source.map((value, index) => Math.round(value * (1 - otherAlpha) + otherSource[index] * otherAlpha));
    this.setSource([R, G, B, source[3]]);
    return this;
  }

  /**
   * Returns new color object, when given a color in RGB format
   * @param {String} color Color value ex: rgb(0-255,0-255,0-255)
   * @return {Color}
   */
  static fromRgb(color) {
    return Color.fromRgba(color);
  }

  /**
   * Returns new color object, when given a color in RGBA format
   * @param {String} color
   * @return {Color}
   */
  static fromRgba(color) {
    return new Color(Color.sourceFromRgb(color));
  }

  /**
   * Returns array representation (ex: [100, 100, 200, 1]) of a color that's in RGB or RGBA format
   * @param {String} color Color value ex: rgb(0-255,0-255,0-255), rgb(0%-100%,0%-100%,0%-100%)
   * @return {TRGBAColorSource | undefined} source
   */
  static sourceFromRgb(color) {
    const match = normalizeWs(color).match(reRGBa());
    if (match) {
      const [r, g, b] = match.slice(1, 4).map(value => {
        const parsedValue = parseFloat(value);
        return value.endsWith('%') ? Math.round(parsedValue * 2.55) : parsedValue;
      });
      return [r, g, b, fromAlphaToFloat(match[4])];
    }
  }

  /**
   * Returns new color object, when given a color in HSL format
   * @param {String} color Color value ex: hsl(0-260,0%-100%,0%-100%)
   * @return {Color}
   */
  static fromHsl(color) {
    return Color.fromHsla(color);
  }

  /**
   * Returns new color object, when given a color in HSLA format
   * @param {String} color
   * @return {Color}
   */
  static fromHsla(color) {
    return new Color(Color.sourceFromHsl(color));
  }

  /**
   * Returns array representation (ex: [100, 100, 200, 1]) of a color that's in HSL or HSLA format.
   * Adapted from <a href="https://rawgithub.com/mjijackson/mjijackson.github.com/master/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript.html">https://github.com/mjijackson</a>
   * @param {String} color Color value ex: hsl(0-360,0%-100%,0%-100%) or hsla(0-360,0%-100%,0%-100%, 0-1)
   * @return {TRGBAColorSource | undefined} source
   * @see http://http://www.w3.org/TR/css3-color/#hsl-color
   */
  static sourceFromHsl(color) {
    const match = normalizeWs(color).match(reHSLa());
    if (!match) {
      return;
    }
    const match1degrees = Color.parseAngletoDegrees(match[1]);
    const h = (match1degrees % 360 + 360) % 360 / 360,
      s = parseFloat(match[2]) / 100,
      l = parseFloat(match[3]) / 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l <= 0.5 ? l * (s + 1) : l + s - l * s,
        p = l * 2 - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), fromAlphaToFloat(match[4])];
  }

  /**
   * Returns new color object, when given a color in HEX format
   * @param {String} color Color value ex: FF5555
   * @return {Color}
   */
  static fromHex(color) {
    return new Color(Color.sourceFromHex(color));
  }

  /**
   * Returns array representation (ex: [100, 100, 200, 1]) of a color that's in HEX format
   * @param {String} color ex: FF5555 or FF5544CC (RGBa)
   * @return {TRGBAColorSource | undefined} source
   */
  static sourceFromHex(color) {
    if (color.match(reHex())) {
      const value = color.slice(color.indexOf('#') + 1),
        isShortNotation = value.length <= 4;
      let expandedValue;
      if (isShortNotation) {
        expandedValue = value.split('').map(hex => hex + hex);
      } else {
        expandedValue = value.match(/.{2}/g);
      }
      const [r, g, b, a = 255] = expandedValue.map(hexCouple => parseInt(hexCouple, 16));
      return [r, g, b, a / 255];
    }
  }

  /**
   * Converts a string that could be any angle notation (50deg, 0.5turn, 2rad)
   * into degrees without the 'deg' suffix
   * @param {String} value ex: 0deg, 0.5turn, 2rad
   * @return {Number} number in degrees or NaN if inputs are invalid
   */
  static parseAngletoDegrees(value) {
    const lowercase = value.toLowerCase();
    const numeric = parseFloat(lowercase);
    if (lowercase.includes('rad')) {
      return radiansToDegrees(numeric);
    }
    if (lowercase.includes('turn')) {
      return numeric * 360;
    }

    // Value is probably just a number already in degrees eg '50'
    return numeric;
  }
}

/**
 * Returns array of attributes for given svg that fabric parses
 * @param {SVGElementName} type Type of svg element (eg. 'circle')
 * @return {Array} string names of supported attributes
 */
const getSvgAttributes = type => {
  const commonAttributes = ['instantiated_by_use', 'style', 'id', 'class'];
  switch (type) {
    case 'linearGradient':
      return commonAttributes.concat(['x1', 'y1', 'x2', 'y2', 'gradientUnits', 'gradientTransform']);
    case 'radialGradient':
      return commonAttributes.concat(['gradientUnits', 'gradientTransform', 'cx', 'cy', 'r', 'fx', 'fy', 'fr']);
    case 'stop':
      return commonAttributes.concat(['offset', 'stop-color', 'stop-opacity']);
  }
  return commonAttributes;
};

/**
 * Converts from attribute value to pixel value if applicable.
 * Returns converted pixels or original value not converted.
 * @param {string} value number to operate on
 * @param {number} fontSize
 * @return {number}
 */
const parseUnit = function (value) {
  let fontSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_SVG_FONT_SIZE;
  const unit = /\D{0,2}$/.exec(value),
    number = parseFloat(value);
  const dpi = config.DPI;
  switch (unit === null || unit === void 0 ? void 0 : unit[0]) {
    case 'mm':
      return number * dpi / 25.4;
    case 'cm':
      return number * dpi / 2.54;
    case 'in':
      return number * dpi;
    case 'pt':
      return number * dpi / 72;
    // or * 4 / 3

    case 'pc':
      return number * dpi / 72 * 12;
    // or * 16

    case 'em':
      return number * fontSize;
    default:
      return number;
  }
};
// align can be either none or undefined or a combination of mid/max
const parseAlign = align => {
  //divide align in alignX and alignY
  if (align && align !== NONE) {
    return [align.slice(1, 4), align.slice(5, 8)];
  } else if (align === NONE) {
    return [align, align];
  }
  return ['Mid', 'Mid'];
};

/**
 * Parse preserveAspectRatio attribute from element
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/preserveAspectRatio
 * @param {string} attribute to be parsed
 * @return {Object} an object containing align and meetOrSlice attribute
 */
const parsePreserveAspectRatioAttribute = attribute => {
  const [firstPart, secondPart] = attribute.trim().split(' ');
  const [alignX, alignY] = parseAlign(firstPart);
  return {
    meetOrSlice: secondPart || 'meet',
    alignX,
    alignY
  };
};

/**
 * Adobe Illustrator (at least CS5) is unable to render rgba()-based fill values
 * we work around it by "moving" alpha channel into opacity attribute and setting fill's alpha to 1
 * @param prop
 * @param value
 * @param {boolean} inlineStyle The default is inline style, the separator used is ":", The other is "="
 * @returns
 */
const colorPropToSVG = function (prop, value) {
  let inlineStyle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  let colorValue;
  let opacityValue;
  if (!value) {
    colorValue = 'none';
  } else if (value.toLive) {
    colorValue = `url(#SVGID_${value.id})`;
  } else {
    const color = new Color(value),
      opacity = color.getAlpha();
    colorValue = color.toRgb();
    if (opacity !== 1) {
      opacityValue = opacity.toString();
    }
  }
  if (inlineStyle) {
    return `${prop}: ${colorValue}; ${opacityValue ? `${prop}-opacity: ${opacityValue}; ` : ''}`;
  } else {
    return `${prop}="${colorValue}" ${opacityValue ? `${prop}-opacity="${opacityValue}" ` : ''}`;
  }
};
const createSVGRect = function (color, _ref) {
  let {
    left,
    top,
    width,
    height
  } = _ref;
  let precision = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : config.NUM_FRACTION_DIGITS;
  const svgColor = colorPropToSVG(FILL, color, false);
  const [x, y, w, h] = [left, top, width, height].map(value => toFixed(value, precision));
  return `<rect ${svgColor} x="${x}" y="${y}" width="${w}" height="${h}"></rect>`;
};

class FabricObjectSVGExportMixin {
  /**
   * When an object is being exported as SVG as a clippath, a reference inside the SVG is needed.
   * This reference is a UID in the fabric namespace and is temporary stored here.
   * @type {String}
   */

  /**
   * Returns styles-string for svg-export
   * @param {Boolean} skipShadow a boolean to skip shadow filter output
   * @return {String}
   */
  getSvgStyles(skipShadow) {
    const fillRule = this.fillRule ? this.fillRule : 'nonzero',
      strokeWidth = this.strokeWidth ? this.strokeWidth : '0',
      strokeDashArray = this.strokeDashArray ? this.strokeDashArray.join(' ') : NONE,
      strokeDashOffset = this.strokeDashOffset ? this.strokeDashOffset : '0',
      strokeLineCap = this.strokeLineCap ? this.strokeLineCap : 'butt',
      strokeLineJoin = this.strokeLineJoin ? this.strokeLineJoin : 'miter',
      strokeMiterLimit = this.strokeMiterLimit ? this.strokeMiterLimit : '4',
      opacity = typeof this.opacity !== 'undefined' ? this.opacity : '1',
      visibility = this.visible ? '' : ' visibility: hidden;',
      filter = skipShadow ? '' : this.getSvgFilter(),
      fill = colorPropToSVG(FILL, this.fill),
      stroke = colorPropToSVG(STROKE, this.stroke);
    return [stroke, 'stroke-width: ', strokeWidth, '; ', 'stroke-dasharray: ', strokeDashArray, '; ', 'stroke-linecap: ', strokeLineCap, '; ', 'stroke-dashoffset: ', strokeDashOffset, '; ', 'stroke-linejoin: ', strokeLineJoin, '; ', 'stroke-miterlimit: ', strokeMiterLimit, '; ', fill, 'fill-rule: ', fillRule, '; ', 'opacity: ', opacity, ';', filter, visibility].join('');
  }

  /**
   * Returns filter for svg shadow
   * @return {String}
   */
  getSvgFilter() {
    return this.shadow ? `filter: url(#SVGID_${this.shadow.id});` : '';
  }

  /**
   * Returns id attribute for svg output
   * @return {String}
   */
  getSvgCommons() {
    return [this.id ? `id="${this.id}" ` : '', this.clipPath ? `clip-path="url(#${this.clipPath.clipPathId})" ` : ''].join('');
  }

  /**
   * Returns transform-string for svg-export
   * @param {Boolean} use the full transform or the single object one.
   * @return {String}
   */
  getSvgTransform(full) {
    let additionalTransform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    const transform = full ? this.calcTransformMatrix() : this.calcOwnMatrix(),
      svgTransform = `transform="${matrixToSVG(transform)}`;
    return `${svgTransform}${additionalTransform}" `;
  }

  /**
   * Returns svg representation of an instance
   * This function is implemented in each subclass
   * This is just because typescript otherwise cryies all the time
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG(_reviver) {
    return [''];
  }

  /**
   * Returns svg representation of an instance
   * @param {TSVGReviver} [reviver] Method for further parsing of svg representation.
   * @return {String} svg representation of an instance
   */
  toSVG(reviver) {
    return this._createBaseSVGMarkup(this._toSVG(reviver), {
      reviver
    });
  }

  /**
   * Returns svg clipPath representation of an instance
   * @param {TSVGReviver} [reviver] Method for further parsing of svg representation.
   * @return {String} svg representation of an instance
   */
  toClipPathSVG(reviver) {
    return '\t' + this._createBaseClipPathSVGMarkup(this._toSVG(reviver), {
      reviver
    });
  }

  /**
   * @private
   */
  _createBaseClipPathSVGMarkup(objectMarkup) {
    let {
      reviver,
      additionalTransform = ''
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const commonPieces = [this.getSvgTransform(true, additionalTransform), this.getSvgCommons()].join(''),
      // insert commons in the markup, style and svgCommons
      index = objectMarkup.indexOf('COMMON_PARTS');
    objectMarkup[index] = commonPieces;
    return reviver ? reviver(objectMarkup.join('')) : objectMarkup.join('');
  }

  /**
   * @private
   */
  _createBaseSVGMarkup(objectMarkup) {
    let {
      noStyle,
      reviver,
      withShadow,
      additionalTransform
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const styleInfo = noStyle ? '' : `style="${this.getSvgStyles()}" `,
      shadowInfo = withShadow ? `style="${this.getSvgFilter()}" ` : '',
      clipPath = this.clipPath,
      vectorEffect = this.strokeUniform ? 'vector-effect="non-scaling-stroke" ' : '',
      absoluteClipPath = clipPath && clipPath.absolutePositioned,
      stroke = this.stroke,
      fill = this.fill,
      shadow = this.shadow,
      markup = [],
      // insert commons in the markup, style and svgCommons
      index = objectMarkup.indexOf('COMMON_PARTS');
    let clipPathMarkup;
    if (clipPath) {
      clipPath.clipPathId = `CLIPPATH_${uid()}`;
      clipPathMarkup = `<clipPath id="${clipPath.clipPathId}" >\n${clipPath.toClipPathSVG(reviver)}</clipPath>\n`;
    }
    if (absoluteClipPath) {
      markup.push('<g ', shadowInfo, this.getSvgCommons(), ' >\n');
    }
    markup.push('<g ', this.getSvgTransform(false), !absoluteClipPath ? shadowInfo + this.getSvgCommons() : '', ' >\n');
    const commonPieces = [styleInfo, vectorEffect, noStyle ? '' : this.addPaintOrder(), ' ', additionalTransform ? `transform="${additionalTransform}" ` : ''].join('');
    objectMarkup[index] = commonPieces;
    if (isFiller(fill)) {
      markup.push(fill.toSVG(this));
    }
    if (isFiller(stroke)) {
      markup.push(stroke.toSVG(this));
    }
    if (shadow) {
      markup.push(shadow.toSVG(this));
    }
    if (clipPath) {
      markup.push(clipPathMarkup);
    }
    markup.push(objectMarkup.join(''));
    markup.push('</g>\n');
    absoluteClipPath && markup.push('</g>\n');
    return reviver ? reviver(markup.join('')) : markup.join('');
  }
  addPaintOrder() {
    return this.paintFirst !== FILL ? ` paint-order="${this.paintFirst}" ` : '';
  }
}

function getSvgRegex(arr) {
  return new RegExp('^(' + arr.join('|') + ')\\b', 'i');
}

const TEXT_DECORATION_THICKNESS = 'textDecorationThickness';
const fontProperties = ['fontSize', 'fontWeight', 'fontFamily', 'fontStyle'];
const textDecorationProperties = ['underline', 'overline', 'linethrough'];
const textLayoutProperties = [...fontProperties, 'lineHeight', 'text', 'charSpacing', 'textAlign', 'styles', 'path', 'pathStartOffset', 'pathSide', 'pathAlign'];
const additionalProps = [...textLayoutProperties, ...textDecorationProperties, 'textBackgroundColor', 'direction', TEXT_DECORATION_THICKNESS];
const styleProperties = [...fontProperties, ...textDecorationProperties, STROKE, 'strokeWidth', FILL, 'deltaY', 'textBackgroundColor', TEXT_DECORATION_THICKNESS];

// @TODO: Many things here are configuration related and shouldn't be on the class nor prototype
// regexes, list of properties that are not suppose to change by instances, magic consts.
// this will be a separated effort
const textDefaultValues = {
  _reNewline: reNewline,
  _reSpacesAndTabs: /[ \t\r]/g,
  _reSpaceAndTab: /[ \t\r]/,
  _reWords: /\S+/g,
  fontSize: 40,
  fontWeight: NORMAL,
  fontFamily: 'Times New Roman',
  underline: false,
  overline: false,
  linethrough: false,
  textAlign: LEFT,
  fontStyle: NORMAL,
  lineHeight: 1.16,
  textBackgroundColor: '',
  stroke: null,
  shadow: null,
  path: undefined,
  pathStartOffset: 0,
  pathSide: LEFT,
  pathAlign: 'baseline',
  charSpacing: 0,
  deltaY: 0,
  direction: LTR,
  CACHE_FONT_SIZE: 400,
  MIN_TEXT_WIDTH: 2,
  // Text magic numbers
  superscript: {
    size: 0.6,
    // fontSize factor
    baseline: -0.35 // baseline-shift factor (upwards)
  },
  subscript: {
    size: 0.6,
    // fontSize factor
    baseline: 0.11 // baseline-shift factor (downwards)
  },
  _fontSizeFraction: 0.222,
  offsets: {
    underline: 0.1,
    linethrough: -0.28167,
    // added 1/30 to original number
    overline: -0.81333 // added 1/15 to original number
  },
  _fontSizeMult: 1.13,
  [TEXT_DECORATION_THICKNESS]: 66.667 // before implementation was 1/15
};
const JUSTIFY = 'justify';
const JUSTIFY_LEFT = 'justify-left';
const JUSTIFY_RIGHT = 'justify-right';
const JUSTIFY_CENTER = 'justify-center';

// matches, e.g.: +14.56e-12, etc.
const reNum = String.raw`[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?`;
const viewportSeparator = String.raw`(?:\s*,?\s+|\s*,\s*)`;
const svgNS = 'http://www.w3.org/2000/svg';
const reFontDeclaration = new RegExp('(normal|italic)?\\s*(normal|small-caps)?\\s*' + '(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\\s*(' + reNum + '(?:px|cm|mm|em|pt|pc|in)*)(?:\\/(normal|' + reNum + '))?\\s+(.*)');
const svgValidTagNames = ['path', 'circle', 'polygon', 'polyline', 'ellipse', 'rect', 'line', 'image', 'text'],
  svgViewBoxElements = ['symbol', 'image', 'marker', 'pattern', 'view', 'svg'],
  svgInvalidAncestors = ['pattern', 'defs', 'symbol', 'metadata', 'clipPath', 'mask', 'desc'],
  svgValidParents = ['symbol', 'g', 'a', 'svg', 'clipPath', 'defs'],
  attributesMap = {
    cx: LEFT,
    x: LEFT,
    r: 'radius',
    cy: TOP,
    y: TOP,
    display: 'visible',
    visibility: 'visible',
    transform: 'transformMatrix',
    'fill-opacity': 'fillOpacity',
    'fill-rule': 'fillRule',
    'font-family': 'fontFamily',
    'font-size': 'fontSize',
    'font-style': 'fontStyle',
    'font-weight': 'fontWeight',
    'letter-spacing': 'charSpacing',
    'paint-order': 'paintFirst',
    'stroke-dasharray': 'strokeDashArray',
    'stroke-dashoffset': 'strokeDashOffset',
    'stroke-linecap': 'strokeLineCap',
    'stroke-linejoin': 'strokeLineJoin',
    'stroke-miterlimit': 'strokeMiterLimit',
    'stroke-opacity': 'strokeOpacity',
    'stroke-width': 'strokeWidth',
    'text-decoration': 'textDecoration',
    'text-anchor': 'textAnchor',
    opacity: 'opacity',
    'clip-path': 'clipPath',
    'clip-rule': 'clipRule',
    'vector-effect': 'strokeUniform',
    'image-rendering': 'imageSmoothing',
    'text-decoration-thickness': TEXT_DECORATION_THICKNESS
  },
  fSize = 'font-size',
  cPath = 'clip-path';
const svgValidTagNamesRegEx = getSvgRegex(svgValidTagNames);
const svgViewBoxElementsRegEx = getSvgRegex(svgViewBoxElements);
const svgValidParentsRegEx = getSvgRegex(svgValidParents);

// http://www.w3.org/TR/SVG/coords.html#ViewBoxAttribute

const reViewBoxAttrValue = new RegExp(String.raw`^\s*(${reNum})${viewportSeparator}(${reNum})${viewportSeparator}(${reNum})${viewportSeparator}(${reNum})\s*$`);

/**
   * Regex matching shadow offsetX, offsetY and blur (ex: "2px 2px 10px rgba(0,0,0,0.2)", "rgb(0,255,0) 2px 2px")
   * - (?:\s|^): This part captures either a whitespace character (\s) or the beginning of a line (^). It's non-capturing (due to (?:...)), meaning it doesn't create a capturing group.
   * - (-?\d+(?:\.\d*)?(?:px)?(?:\s?|$))?: This captures the first component of the shadow, which is the horizontal offset. Breaking it down:
   *   - (-?\d+): Captures an optional minus sign followed by one or more digits (integer part of the number).
   *   - (?:\.\d*)?: Optionally captures a decimal point followed by zero or more digits (decimal part of the number).
   *   - (?:px)?: Optionally captures the "px" unit.
   *   - (?:\s?|$): Captures either an optional whitespace or the end of the line. This whole part is wrapped in a non-capturing group and marked as optional with ?.
   * - (-?\d+(?:\.\d*)?(?:px)?(?:\s?|$))?: Similar to the previous step, this captures the vertical offset.

(\d+(?:\.\d*)?(?:px)?)?: This captures the blur radius. It's similar to the horizontal offset but without the optional minus sign.

(?:\s+(-?\d+(?:\.\d*)?(?:px)?(?:\s?|$))?){0,1}: This captures an optional part for the color. It allows for whitespace followed by a component with an optional minus sign, digits, decimal point, and "px" unit.

(?:$|\s): This captures either the end of the line or a whitespace character. It ensures that the match ends either at the end of the string or with a whitespace character.
   */
// eslint-disable-next-line max-len

const shadowOffsetRegex = '(-?\\d+(?:\\.\\d*)?(?:px)?(?:\\s?|$))?';
const reOffsetsAndBlur = new RegExp('(?:\\s|^)' + shadowOffsetRegex + shadowOffsetRegex + '(' + reNum + '?(?:px)?)?(?:\\s?|$)(?:$|\\s)');
const shadowDefaultValues = {
  color: 'rgb(0,0,0)',
  blur: 0,
  offsetX: 0,
  offsetY: 0,
  affectStroke: false,
  includeDefaultValues: true,
  nonScaling: false
};
class Shadow {
  /**
   * @see {@link http://fabric5.fabricjs.com/shadows|Shadow demo}
   * @param {Object|String} [options] Options object with any of color, blur, offsetX, offsetY properties or string (e.g. "rgba(0,0,0,0.2) 2px 2px 10px")
   */

  constructor() {
    let arg0 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const options = typeof arg0 === 'string' ? Shadow.parseShadow(arg0) : arg0;
    Object.assign(this, Shadow.ownDefaults, options);
    this.id = uid();
  }

  /**
   * @param {String} value Shadow value to parse
   * @return {Object} Shadow object with color, offsetX, offsetY and blur
   */
  static parseShadow(value) {
    const shadowStr = value.trim(),
      [, offsetX = 0, offsetY = 0, blur = 0] = (reOffsetsAndBlur.exec(shadowStr) || []).map(value => parseFloat(value) || 0),
      color = (shadowStr.replace(reOffsetsAndBlur, '') || 'rgb(0,0,0)').trim();
    return {
      color,
      offsetX,
      offsetY,
      blur
    };
  }

  /**
   * Returns a string representation of an instance
   * @see http://www.w3.org/TR/css-text-decor-3/#text-shadow
   * @return {String} Returns CSS3 text-shadow declaration
   */
  toString() {
    return [this.offsetX, this.offsetY, this.blur, this.color].join('px ');
  }

  /**
   * Returns SVG representation of a shadow
   * @param {FabricObject} object
   * @return {String} SVG representation of a shadow
   */
  toSVG(object) {
    const offset = rotateVector(new Point(this.offsetX, this.offsetY), degreesToRadians(-object.angle)),
      BLUR_BOX = 20,
      color = new Color(this.color);
    let fBoxX = 40,
      fBoxY = 40;
    if (object.width && object.height) {
      //http://www.w3.org/TR/SVG/filters.html#FilterEffectsRegion
      // we add some extra space to filter box to contain the blur ( 20 )
      fBoxX = toFixed((Math.abs(offset.x) + this.blur) / object.width, config.NUM_FRACTION_DIGITS) * 100 + BLUR_BOX;
      fBoxY = toFixed((Math.abs(offset.y) + this.blur) / object.height, config.NUM_FRACTION_DIGITS) * 100 + BLUR_BOX;
    }
    if (object.flipX) {
      offset.x *= -1;
    }
    if (object.flipY) {
      offset.y *= -1;
    }
    return `<filter id="SVGID_${this.id}" y="-${fBoxY}%" height="${100 + 2 * fBoxY}%" x="-${fBoxX}%" width="${100 + 2 * fBoxX}%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="${toFixed(this.blur ? this.blur / 2 : 0, config.NUM_FRACTION_DIGITS)}"></feGaussianBlur>\n\t<feOffset dx="${toFixed(offset.x, config.NUM_FRACTION_DIGITS)}" dy="${toFixed(offset.y, config.NUM_FRACTION_DIGITS)}" result="oBlur" ></feOffset>\n\t<feFlood flood-color="${color.toRgb()}" flood-opacity="${color.getAlpha()}"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n`;
  }

  /**
   * Returns object representation of a shadow
   * @return {Object} Object representation of a shadow instance
   */
  toObject() {
    const data = {
      color: this.color,
      blur: this.blur,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      affectStroke: this.affectStroke,
      nonScaling: this.nonScaling,
      type: this.constructor.type
    };
    const defaults = Shadow.ownDefaults;
    return !this.includeDefaultValues ? pickBy(data, (value, key) => value !== defaults[key]) : data;
  }
  static async fromObject(options) {
    return new this(options);
  }
}
/**
 * Shadow color
 * @type String
 */
/**
 * Shadow blur
 * @type Number
 */
/**
 * Shadow horizontal offset
 * @type Number
 */
/**
 * Shadow vertical offset
 * @type Number
 */
/**
 * Whether the shadow should affect stroke operations
 * @type Boolean
 */
/**
 * Indicates whether toObject should include default values
 * @type Boolean
 */
/**
 * When `false`, the shadow will scale with the object.
 * When `true`, the shadow's offsetX, offsetY, and blur will not be affected by the object's scale.
 * default to false
 * @type Boolean
 */
_defineProperty(Shadow, "ownDefaults", shadowDefaultValues);
_defineProperty(Shadow, "type", 'shadow');
classRegistry.setClass(Shadow, 'shadow');

const capValue = (min, value, max) => Math.max(min, Math.min(value, max));

const stateProperties = [TOP, LEFT, SCALE_X, SCALE_Y, 'flipX', 'flipY', 'originX', 'originY', 'angle', 'opacity', 'globalCompositeOperation', 'shadow', 'visible', SKEW_X, SKEW_Y];
const cacheProperties = [FILL, STROKE, 'strokeWidth', 'strokeDashArray', 'width', 'height', 'paintFirst', 'strokeUniform', 'strokeLineCap', 'strokeDashOffset', 'strokeLineJoin', 'strokeMiterLimit', 'backgroundColor', 'clipPath'];
const fabricObjectDefaultValues = {
  // see composeMatrix() to see order of transforms. First defaults listed based on this
  top: 0,
  left: 0,
  width: 0,
  height: 0,
  angle: 0,
  flipX: false,
  flipY: false,
  scaleX: 1,
  scaleY: 1,
  minScaleLimit: 0,
  skewX: 0,
  skewY: 0,
  originX: CENTER,
  originY: CENTER,
  strokeWidth: 1,
  strokeUniform: false,
  padding: 0,
  opacity: 1,
  paintFirst: FILL,
  fill: 'rgb(0,0,0)',
  fillRule: 'nonzero',
  stroke: null,
  strokeDashArray: null,
  strokeDashOffset: 0,
  strokeLineCap: 'butt',
  strokeLineJoin: 'miter',
  strokeMiterLimit: 4,
  globalCompositeOperation: 'source-over',
  backgroundColor: '',
  shadow: null,
  visible: true,
  includeDefaultValues: true,
  excludeFromExport: false,
  objectCaching: true,
  clipPath: undefined,
  inverted: false,
  absolutePositioned: false,
  centeredRotation: true,
  centeredScaling: false,
  dirty: true
};
const interactiveObjectDefaultValues = {
  noScaleCache: true,
  lockMovementX: false,
  lockMovementY: false,
  lockRotation: false,
  lockScalingX: false,
  lockScalingY: false,
  lockSkewingX: false,
  lockSkewingY: false,
  lockScalingFlip: false,
  cornerSize: 13,
  touchCornerSize: 24,
  transparentCorners: true,
  cornerColor: 'rgb(178,204,255)',
  cornerStrokeColor: '',
  cornerStyle: 'rect',
  cornerDashArray: null,
  hasControls: true,
  borderColor: 'rgb(178,204,255)',
  borderDashArray: null,
  borderOpacityWhenMoving: 0.4,
  borderScaleFactor: 1,
  hasBorders: true,
  selectionBackgroundColor: '',
  selectable: true,
  evented: true,
  perPixelTargetFind: false,
  activeOn: 'down',
  hoverCursor: null,
  moveCursor: null
};

/**
 * Easing functions
 * @see {@link http://gizma.com/easing/ Easing Equations by Robert Penner}
 */

const normalize = (a, c, p, s) => {
  if (a < Math.abs(c)) {
    a = c;
    s = p / 4;
  } else {
    //handle the 0/0 case:
    if (c === 0 && a === 0) {
      s = p / twoMathPi * Math.asin(1);
    } else {
      s = p / twoMathPi * Math.asin(c / a);
    }
  }
  return {
    a,
    c,
    p,
    s
  };
};
const elastic = (a, s, p, t, d) => a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * twoMathPi / p);

/**
 * Default sinusoidal easing
 */
const defaultEasing = (t, b, c, d) => -c * Math.cos(t / d * halfPI) + c + b;

/**
 * Cubic easing in
 */
const easeInCubic = (t, b, c, d) => c * (t / d) ** 3 + b;

/**
 * Cubic easing out
 */
const easeOutCubic = (t, b, c, d) => c * ((t / d - 1) ** 3 + 1) + b;

/**
 * Cubic easing in and out
 */
const easeInOutCubic = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) {
    return c / 2 * t ** 3 + b;
  }
  return c / 2 * ((t - 2) ** 3 + 2) + b;
};

/**
 * Quartic easing in
 */
const easeInQuart = (t, b, c, d) => c * (t /= d) * t ** 3 + b;

/**
 * Quartic easing out
 */
const easeOutQuart = (t, b, c, d) => -c * ((t = t / d - 1) * t ** 3 - 1) + b;

/**
 * Quartic easing in and out
 */
const easeInOutQuart = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) {
    return c / 2 * t ** 4 + b;
  }
  return -c / 2 * ((t -= 2) * t ** 3 - 2) + b;
};

/**
 * Quintic easing in
 */
const easeInQuint = (t, b, c, d) => c * (t / d) ** 5 + b;

/**
 * Quintic easing out
 */
const easeOutQuint = (t, b, c, d) => c * ((t / d - 1) ** 5 + 1) + b;

/**
 * Quintic easing in and out
 */
const easeInOutQuint = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) {
    return c / 2 * t ** 5 + b;
  }
  return c / 2 * ((t - 2) ** 5 + 2) + b;
};

/**
 * Sinusoidal easing in
 */
const easeInSine = (t, b, c, d) => -c * Math.cos(t / d * halfPI) + c + b;

/**
 * Sinusoidal easing out
 */
const easeOutSine = (t, b, c, d) => c * Math.sin(t / d * halfPI) + b;

/**
 * Sinusoidal easing in and out
 */
const easeInOutSine = (t, b, c, d) => -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;

/**
 * Exponential easing in
 */
const easeInExpo = (t, b, c, d) => t === 0 ? b : c * 2 ** (10 * (t / d - 1)) + b;

/**
 * Exponential easing out
 */
const easeOutExpo = (t, b, c, d) => t === d ? b + c : c * -(2 ** (-10 * t / d) + 1) + b;

/**
 * Exponential easing in and out
 */
const easeInOutExpo = (t, b, c, d) => {
  if (t === 0) {
    return b;
  }
  if (t === d) {
    return b + c;
  }
  t /= d / 2;
  if (t < 1) {
    return c / 2 * 2 ** (10 * (t - 1)) + b;
  }
  return c / 2 * -(2 ** (-10 * --t) + 2) + b;
};

/**
 * Circular easing in
 */
const easeInCirc = (t, b, c, d) => -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;

/**
 * Circular easing out
 */
const easeOutCirc = (t, b, c, d) => c * Math.sqrt(1 - (t = t / d - 1) * t) + b;

/**
 * Circular easing in and out
 */
const easeInOutCirc = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) {
    return -c / 2 * (Math.sqrt(1 - t ** 2) - 1) + b;
  }
  return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
};

/**
 * Elastic easing in
 */
const easeInElastic = (t, b, c, d) => {
  const s = 1.70158,
    a = c;
  let p = 0;
  if (t === 0) {
    return b;
  }
  t /= d;
  if (t === 1) {
    return b + c;
  }
  if (!p) {
    p = d * 0.3;
  }
  const {
    a: normA,
    s: normS,
    p: normP
  } = normalize(a, c, p, s);
  return -elastic(normA, normS, normP, t, d) + b;
};

/**
 * Elastic easing out
 */
const easeOutElastic = (t, b, c, d) => {
  const s = 1.70158,
    a = c;
  let p = 0;
  if (t === 0) {
    return b;
  }
  t /= d;
  if (t === 1) {
    return b + c;
  }
  if (!p) {
    p = d * 0.3;
  }
  const {
    a: normA,
    s: normS,
    p: normP,
    c: normC
  } = normalize(a, c, p, s);
  return normA * 2 ** (-10 * t) * Math.sin((t * d - normS) * twoMathPi / normP) + normC + b;
};

/**
 * Elastic easing in and out
 */
const easeInOutElastic = (t, b, c, d) => {
  const s = 1.70158,
    a = c;
  let p = 0;
  if (t === 0) {
    return b;
  }
  t /= d / 2;
  if (t === 2) {
    return b + c;
  }
  if (!p) {
    p = d * (0.3 * 1.5);
  }
  const {
    a: normA,
    s: normS,
    p: normP,
    c: normC
  } = normalize(a, c, p, s);
  if (t < 1) {
    return -0.5 * elastic(normA, normS, normP, t, d) + b;
  }
  return normA * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - normS) * twoMathPi / normP) * 0.5 + normC + b;
};

/**
 * Backwards easing in
 */
const easeInBack = function (t, b, c, d) {
  let s = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1.70158;
  return c * (t /= d) * t * ((s + 1) * t - s) + b;
};

/**
 * Backwards easing out
 */
const easeOutBack = function (t, b, c, d) {
  let s = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1.70158;
  return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
};

/**
 * Backwards easing in and out
 */
const easeInOutBack = function (t, b, c, d) {
  let s = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1.70158;
  t /= d / 2;
  if (t < 1) {
    return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
  }
  return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
};

/**
 * Bouncing easing out
 */
const easeOutBounce = (t, b, c, d) => {
  if ((t /= d) < 1 / 2.75) {
    return c * (7.5625 * t * t) + b;
  } else if (t < 2 / 2.75) {
    return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
  } else if (t < 2.5 / 2.75) {
    return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
  } else {
    return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
  }
};

/**
 * Bouncing easing in
 */
const easeInBounce = (t, b, c, d) => c - easeOutBounce(d - t, 0, c, d) + b;

/**
 * Bouncing easing in and out
 */
const easeInOutBounce = (t, b, c, d) => t < d / 2 ? easeInBounce(t * 2, 0, c, d) * 0.5 + b : easeOutBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;

/**
 * Quadratic easing in
 */
const easeInQuad = (t, b, c, d) => c * (t /= d) * t + b;

/**
 * Quadratic easing out
 */
const easeOutQuad = (t, b, c, d) => -c * (t /= d) * (t - 2) + b;

/**
 * Quadratic easing in and out
 */
const easeInOutQuad = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) {
    return c / 2 * t ** 2 + b;
  }
  return -c / 2 * (--t * (t - 2) - 1) + b;
};

var easing = /*#__PURE__*/Object.freeze({
  __proto__: null,
  defaultEasing: defaultEasing,
  easeInBack: easeInBack,
  easeInBounce: easeInBounce,
  easeInCirc: easeInCirc,
  easeInCubic: easeInCubic,
  easeInElastic: easeInElastic,
  easeInExpo: easeInExpo,
  easeInOutBack: easeInOutBack,
  easeInOutBounce: easeInOutBounce,
  easeInOutCirc: easeInOutCirc,
  easeInOutCubic: easeInOutCubic,
  easeInOutElastic: easeInOutElastic,
  easeInOutExpo: easeInOutExpo,
  easeInOutQuad: easeInOutQuad,
  easeInOutQuart: easeInOutQuart,
  easeInOutQuint: easeInOutQuint,
  easeInOutSine: easeInOutSine,
  easeInQuad: easeInQuad,
  easeInQuart: easeInQuart,
  easeInQuint: easeInQuint,
  easeInSine: easeInSine,
  easeOutBack: easeOutBack,
  easeOutBounce: easeOutBounce,
  easeOutCirc: easeOutCirc,
  easeOutCubic: easeOutCubic,
  easeOutElastic: easeOutElastic,
  easeOutExpo: easeOutExpo,
  easeOutQuad: easeOutQuad,
  easeOutQuart: easeOutQuart,
  easeOutQuint: easeOutQuint,
  easeOutSine: easeOutSine
});

const defaultAbort = () => false;
class AnimationBase {
  /**
   * Current value
   */

  /**
   * Animation start time ms
   */

  constructor(_ref) {
    let {
      startValue,
      byValue,
      duration = 500,
      delay = 0,
      easing = defaultEasing,
      onStart = noop,
      onChange = noop,
      onComplete = noop,
      abort = defaultAbort,
      target
    } = _ref;
    /**
     * Used to register the animation to a target object
     * so that it can be cancelled within the object context
     */
    _defineProperty(this, "_state", 'pending');
    /**
     * Time %, or the ratio of `timeElapsed / duration`
     * @see tick
     */
    _defineProperty(this, "durationProgress", 0);
    /**
     * Value %, or the ratio of `(currentValue - startValue) / (endValue - startValue)`
     */
    _defineProperty(this, "valueProgress", 0);
    this.tick = this.tick.bind(this);
    this.duration = duration;
    this.delay = delay;
    this.easing = easing;
    this._onStart = onStart;
    this._onChange = onChange;
    this._onComplete = onComplete;
    this._abort = abort;
    this.target = target;
    this.startValue = startValue;
    this.byValue = byValue;
    this.value = this.startValue;
    this.endValue = Object.freeze(this.calculate(this.duration).value);
  }
  get state() {
    return this._state;
  }
  isDone() {
    return this._state === 'aborted' || this._state === 'completed';
  }

  /**
   * Calculate the current value based on the easing parameters
   * @param timeElapsed in ms
   * @protected
   */

  start() {
    const firstTick = timestamp => {
      if (this._state !== 'pending') return;
      this.startTime = timestamp || +new Date();
      this._state = 'running';
      this._onStart();
      this.tick(this.startTime);
    };
    this.register();

    // setTimeout(cb, 0) will run cb on the next frame, causing a delay
    // we don't want that
    if (this.delay > 0) {
      setTimeout(() => requestAnimFrame(firstTick), this.delay);
    } else {
      requestAnimFrame(firstTick);
    }
  }
  tick(t) {
    const durationMs = (t || +new Date()) - this.startTime;
    const boundDurationMs = Math.min(durationMs, this.duration);
    this.durationProgress = boundDurationMs / this.duration;
    const {
      value,
      valueProgress
    } = this.calculate(boundDurationMs);
    this.value = Object.freeze(value);
    this.valueProgress = valueProgress;
    if (this._state === 'aborted') {
      return;
    } else if (this._abort(this.value, this.valueProgress, this.durationProgress)) {
      this._state = 'aborted';
      this.unregister();
    } else if (durationMs >= this.duration) {
      this.durationProgress = this.valueProgress = 1;
      this._onChange(this.endValue, this.valueProgress, this.durationProgress);
      this._state = 'completed';
      this._onComplete(this.endValue, this.valueProgress, this.durationProgress);
      this.unregister();
    } else {
      this._onChange(this.value, this.valueProgress, this.durationProgress);
      requestAnimFrame(this.tick);
    }
  }
  register() {
    runningAnimations.push(this);
  }
  unregister() {
    runningAnimations.remove(this);
  }
  abort() {
    this._state = 'aborted';
    this.unregister();
  }
}

class ValueAnimation extends AnimationBase {
  constructor(_ref) {
    let {
      startValue = 0,
      endValue = 100,
      ...otherOptions
    } = _ref;
    super({
      ...otherOptions,
      startValue,
      byValue: endValue - startValue
    });
  }
  calculate(timeElapsed) {
    const value = this.easing(timeElapsed, this.startValue, this.byValue, this.duration);
    return {
      value,
      valueProgress: Math.abs((value - this.startValue) / this.byValue)
    };
  }
}

class ArrayAnimation extends AnimationBase {
  constructor(_ref) {
    let {
      startValue = [0],
      endValue = [100],
      ...options
    } = _ref;
    super({
      ...options,
      startValue,
      byValue: endValue.map((value, i) => value - startValue[i])
    });
  }
  calculate(timeElapsed) {
    const values = this.startValue.map((value, i) => this.easing(timeElapsed, value, this.byValue[i], this.duration, i));
    return {
      value: values,
      valueProgress: Math.abs((values[0] - this.startValue[0]) / this.byValue[0])
    };
  }
}

const defaultColorEasing = (timeElapsed, startValue, byValue, duration) => {
  const durationProgress = 1 - Math.cos(timeElapsed / duration * halfPI);
  return startValue + byValue * durationProgress;
};
const wrapColorCallback = callback => callback && ((rgba, valueProgress, durationProgress) => callback(new Color(rgba).toRgba(), valueProgress, durationProgress));
class ColorAnimation extends AnimationBase {
  constructor(_ref) {
    let {
      startValue,
      endValue,
      easing = defaultColorEasing,
      onChange,
      onComplete,
      abort,
      ...options
    } = _ref;
    const startColor = new Color(startValue).getSource();
    const endColor = new Color(endValue).getSource();
    super({
      ...options,
      startValue: startColor,
      byValue: endColor.map((value, i) => value - startColor[i]),
      easing,
      onChange: wrapColorCallback(onChange),
      onComplete: wrapColorCallback(onComplete),
      abort: wrapColorCallback(abort)
    });
  }
  calculate(timeElapsed) {
    const [r, g, b, a] = this.startValue.map((value, i) => this.easing(timeElapsed, value, this.byValue[i], this.duration, i));
    const value = [...[r, g, b].map(Math.round), capValue(0, a, 1)];
    return {
      value,
      valueProgress:
      // to correctly calculate the change ratio we must find a changed value
      value.map((p, i) => this.byValue[i] !== 0 ? Math.abs((p - this.startValue[i]) / this.byValue[i]) : 0).find(p => p !== 0) || 0
    };
  }
}

const isArrayAnimation = options => {
  return Array.isArray(options.startValue) || Array.isArray(options.endValue);
};

/**
 * Changes value(s) from startValue to endValue within a certain period of time,
 * invoking callbacks as the value(s) change.
 *
 * @example
 * animate({
 *   startValue: 1,
 *   endValue: 0,
 *   onChange: (v) => {
 *     obj.set('opacity', v);
 *     // since we are running in a requested frame we should call `renderAll` and not `requestRenderAll`
 *     canvas.renderAll();
 *   }
 * });
 *
 * @example Using lists:
 * animate({
 *   startValue: [1, 2, 3],
 *   endValue: [2, 4, 6],
 *   onChange: ([x, y, zoom]) => {
 *     canvas.zoomToPoint(new Point(x, y), zoom);
 *     canvas.renderAll();
 *   }
 * });
 *
 */

function animate(options) {
  const animation = isArrayAnimation(options) ? new ArrayAnimation(options) : new ValueAnimation(options);
  animation.start();
  return animation;
}
function animateColor(options) {
  const animation = new ColorAnimation(options);
  animation.start();
  return animation;
}

/* Adaptation of work of Kevin Lindsey (kevin@kevlindev.com) */

class Intersection {
  constructor(status) {
    this.status = status;
    this.points = [];
  }

  /**
   * Used to verify if a point is alredy in the collection
   * @param {Point} point
   * @returns {boolean}
   */
  includes(point) {
    return this.points.some(p => p.eq(point));
  }

  /**
   * Appends points of intersection
   * @param {...Point[]} points
   * @return {Intersection} thisArg
   */
  append() {
    for (var _len = arguments.length, points = new Array(_len), _key = 0; _key < _len; _key++) {
      points[_key] = arguments[_key];
    }
    this.points = this.points.concat(points.filter(point => {
      return !this.includes(point);
    }));
    return this;
  }

  /**
   * check if point T is on the segment or line defined between A and B
   *
   * @param {Point} T the point we are checking for
   * @param {Point} A one extremity of the segment
   * @param {Point} B the other extremity of the segment
   * @param [infinite] if true checks if `T` is on the line defined by `A` and `B`
   * @returns true if `T` is contained
   */
  static isPointContained(T, A, B) {
    let infinite = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    if (A.eq(B)) {
      // Edge case: the segment is a point, we check for coincidence,
      // infinite param has no meaning because there are infinite lines to consider
      return T.eq(A);
    } else if (A.x === B.x) {
      // Edge case: horizontal line.
      // we first check if T.x has the same value, and then if T.y is contained between A.y and B.y
      return T.x === A.x && (infinite || T.y >= Math.min(A.y, B.y) && T.y <= Math.max(A.y, B.y));
    } else if (A.y === B.y) {
      // Edge case: vertical line.
      // we first check if T.y has the same value, and then if T.x is contained between A.x and B.x
      return T.y === A.y && (infinite || T.x >= Math.min(A.x, B.x) && T.x <= Math.max(A.x, B.x));
    } else {
      // Generic case: sloped line.
      // we check that AT has the same slope as AB
      // for the segment case we need both the vectors to have the same direction and for AT to be lte AB in size
      // for the infinite case we check the absolute value of the slope, since direction is meaningless
      const AB = createVector(A, B);
      const AT = createVector(A, T);
      const s = AT.divide(AB);
      return infinite ? Math.abs(s.x) === Math.abs(s.y) : s.x === s.y && s.x >= 0 && s.x <= 1;
    }
  }

  /**
   * Use the ray casting algorithm to determine if point is in the polygon defined by points
   * @see https://en.wikipedia.org/wiki/Point_in_polygon
   * @param point
   * @param points polygon points
   * @returns
   */
  static isPointInPolygon(point, points) {
    const other = new Point(point).setX(Math.min(point.x - 1, ...points.map(p => p.x)));
    let hits = 0;
    for (let index = 0; index < points.length; index++) {
      const inter = this.intersectSegmentSegment(
      // polygon side
      points[index], points[(index + 1) % points.length],
      // ray
      point, other);
      if (inter.includes(point)) {
        // point is on the polygon side
        return true;
      }
      hits += Number(inter.status === 'Intersection');
    }
    return hits % 2 === 1;
  }

  /**
   * Checks if a line intersects another
   * @see {@link https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection line intersection}
   * @see {@link https://en.wikipedia.org/wiki/Cramer%27s_rule Cramer's rule}
   * @param {Point} a1
   * @param {Point} a2
   * @param {Point} b1
   * @param {Point} b2
   * @param {boolean} [aInfinite=true] check segment intersection by passing `false`
   * @param {boolean} [bInfinite=true] check segment intersection by passing `false`
   * @return {Intersection}
   */
  static intersectLineLine(a1, a2, b1, b2) {
    let aInfinite = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
    let bInfinite = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
    const a2xa1x = a2.x - a1.x,
      a2ya1y = a2.y - a1.y,
      b2xb1x = b2.x - b1.x,
      b2yb1y = b2.y - b1.y,
      a1xb1x = a1.x - b1.x,
      a1yb1y = a1.y - b1.y,
      uaT = b2xb1x * a1yb1y - b2yb1y * a1xb1x,
      ubT = a2xa1x * a1yb1y - a2ya1y * a1xb1x,
      uB = b2yb1y * a2xa1x - b2xb1x * a2ya1y;
    if (uB !== 0) {
      const ua = uaT / uB,
        ub = ubT / uB;
      if ((aInfinite || 0 <= ua && ua <= 1) && (bInfinite || 0 <= ub && ub <= 1)) {
        return new Intersection('Intersection').append(new Point(a1.x + ua * a2xa1x, a1.y + ua * a2ya1y));
      } else {
        return new Intersection();
      }
    } else {
      if (uaT === 0 || ubT === 0) {
        const segmentsCoincide = aInfinite || bInfinite || Intersection.isPointContained(a1, b1, b2) || Intersection.isPointContained(a2, b1, b2) || Intersection.isPointContained(b1, a1, a2) || Intersection.isPointContained(b2, a1, a2);
        return new Intersection(segmentsCoincide ? 'Coincident' : undefined);
      } else {
        return new Intersection('Parallel');
      }
    }
  }

  /**
   * Checks if a segment intersects a line
   * @see {@link intersectLineLine} for line intersection
   * @param {Point} s1 boundary point of segment
   * @param {Point} s2 other boundary point of segment
   * @param {Point} l1 point on line
   * @param {Point} l2 other point on line
   * @return {Intersection}
   */
  static intersectSegmentLine(s1, s2, l1, l2) {
    return Intersection.intersectLineLine(s1, s2, l1, l2, false, true);
  }

  /**
   * Checks if a segment intersects another
   * @see {@link intersectLineLine} for line intersection
   * @param {Point} a1 boundary point of segment
   * @param {Point} a2 other boundary point of segment
   * @param {Point} b1 boundary point of segment
   * @param {Point} b2 other boundary point of segment
   * @return {Intersection}
   */
  static intersectSegmentSegment(a1, a2, b1, b2) {
    return Intersection.intersectLineLine(a1, a2, b1, b2, false, false);
  }

  /**
   * Checks if line intersects polygon
   *
   * @todo account for stroke
   *
   * @see {@link intersectSegmentPolygon} for segment intersection
   * @param {Point} a1 point on line
   * @param {Point} a2 other point on line
   * @param {Point[]} points polygon points
   * @param {boolean} [infinite=true] check segment intersection by passing `false`
   * @return {Intersection}
   */
  static intersectLinePolygon(a1, a2, points) {
    let infinite = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    const result = new Intersection();
    const length = points.length;
    for (let i = 0, b1, b2, inter; i < length; i++) {
      b1 = points[i];
      b2 = points[(i + 1) % length];
      inter = Intersection.intersectLineLine(a1, a2, b1, b2, infinite, false);
      if (inter.status === 'Coincident') {
        return inter;
      }
      result.append(...inter.points);
    }
    if (result.points.length > 0) {
      result.status = 'Intersection';
    }
    return result;
  }

  /**
   * Checks if segment intersects polygon
   * @see {@link intersectLinePolygon} for line intersection
   * @param {Point} a1 boundary point of segment
   * @param {Point} a2 other boundary point of segment
   * @param {Point[]} points polygon points
   * @return {Intersection}
   */
  static intersectSegmentPolygon(a1, a2, points) {
    return Intersection.intersectLinePolygon(a1, a2, points, false);
  }

  /**
   * Checks if polygon intersects another polygon
   *
   * @todo account for stroke
   *
   * @param {Point[]} points1
   * @param {Point[]} points2
   * @return {Intersection}
   */
  static intersectPolygonPolygon(points1, points2) {
    const result = new Intersection(),
      length = points1.length;
    const coincidences = [];
    for (let i = 0; i < length; i++) {
      const a1 = points1[i],
        a2 = points1[(i + 1) % length],
        inter = Intersection.intersectSegmentPolygon(a1, a2, points2);
      if (inter.status === 'Coincident') {
        coincidences.push(inter);
        result.append(a1, a2);
      } else {
        result.append(...inter.points);
      }
    }
    if (coincidences.length > 0 && coincidences.length === points1.length) {
      return new Intersection('Coincident');
    } else if (result.points.length > 0) {
      result.status = 'Intersection';
    }
    return result;
  }

  /**
   * Checks if polygon intersects rectangle
   * @see {@link intersectPolygonPolygon} for polygon intersection
   * @param {Point[]} points polygon points
   * @param {Point} r1 top left point of rect
   * @param {Point} r2 bottom right point of rect
   * @return {Intersection}
   */
  static intersectPolygonRectangle(points, r1, r2) {
    const min = r1.min(r2),
      max = r1.max(r2),
      topRight = new Point(max.x, min.y),
      bottomLeft = new Point(min.x, max.y);
    return Intersection.intersectPolygonPolygon(points, [min, topRight, max, bottomLeft]);
  }
}

class ObjectGeometry extends CommonMethods {
  // #region Geometry

  /**
   * Describe object's corner position in scene coordinates.
   * The coordinates are derived from the following:
   * left, top, width, height, scaleX, scaleY, skewX, skewY, angle, strokeWidth.
   * The coordinates do not depend on viewport changes.
   * The coordinates get updated with {@link setCoords}.
   * You can calculate them without updating with {@link calcACoords()}
   */

  /**
   * storage cache for object transform matrix
   */

  /**
   * storage cache for object full transform matrix
   */

  /**
   * A Reference of the Canvas where the object is actually added
   * @type StaticCanvas | Canvas;
   * @default undefined
   * @private
   */

  /**
   * @returns {number} x position according to object's originX property in canvas coordinate plane
   */
  getX() {
    return this.getXY().x;
  }

  /**
   * @param {number} value x position according to object's originX property in canvas coordinate plane
   */
  setX(value) {
    this.setXY(this.getXY().setX(value));
  }

  /**
   * @returns {number} y position according to object's originY property in canvas coordinate plane
   */
  getY() {
    return this.getXY().y;
  }

  /**
   * @param {number} value y position according to object's originY property in canvas coordinate plane
   */
  setY(value) {
    this.setXY(this.getXY().setY(value));
  }

  /**
   * @returns {number} x position according to object's originX property in parent's coordinate plane\
   * if parent is canvas then this property is identical to {@link getX}
   */
  getRelativeX() {
    return this.left;
  }

  /**
   * @param {number} value x position according to object's originX property in parent's coordinate plane\
   * if parent is canvas then this method is identical to {@link setX}
   */
  setRelativeX(value) {
    this.left = value;
  }

  /**
   * @returns {number} y position according to object's originY property in parent's coordinate plane\
   * if parent is canvas then this property is identical to {@link getY}
   */
  getRelativeY() {
    return this.top;
  }

  /**
   * @param {number} value y position according to object's originY property in parent's coordinate plane\
   * if parent is canvas then this property is identical to {@link setY}
   */
  setRelativeY(value) {
    this.top = value;
  }

  /**
   * @returns {Point} x position according to object's originX originY properties in canvas coordinate plane
   */
  getXY() {
    const relativePosition = this.getRelativeXY();
    return this.group ? transformPoint(relativePosition, this.group.calcTransformMatrix()) : relativePosition;
  }

  /**
   * Set an object position to a particular point, the point is intended in absolute ( canvas ) coordinate.
   * You can specify originX and originY values,
   * that otherwise are the object's current values.
   * @example <caption>Set object's bottom left corner to point (5,5) on canvas</caption>
   * object.setXY(new Point(5, 5), 'left', 'bottom').
   * @param {Point} point position in scene coordinate plane
   * @param {TOriginX} [originX] Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} [originY] Vertical origin: 'top', 'center' or 'bottom'
   */
  setXY(point, originX, originY) {
    if (this.group) {
      point = transformPoint(point, invertTransform(this.group.calcTransformMatrix()));
    }
    this.setRelativeXY(point, originX, originY);
  }

  /**
   * @returns {Point} x,y position according to object's originX originY properties in parent's coordinate plane
   */
  getRelativeXY() {
    return new Point(this.left, this.top);
  }

  /**
   * As {@link setXY}, but in current parent's coordinate plane (the current group if any or the canvas)
   * @param {Point} point position according to object's originX originY properties in parent's coordinate plane
   * @param {TOriginX} [originX] Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} [originY] Vertical origin: 'top', 'center' or 'bottom'
   */
  setRelativeXY(point) {
    let originX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.originX;
    let originY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.originY;
    this.setPositionByOrigin(point, originX, originY);
  }

  /**
   * @deprecated intermidiate method to be removed, do not use
   */
  isStrokeAccountedForInDimensions() {
    return false;
  }

  /**
   * @return {Point[]} [tl, tr, br, bl] in the scene plane
   */
  getCoords() {
    const {
      tl,
      tr,
      br,
      bl
    } = this.aCoords || (this.aCoords = this.calcACoords());
    const coords = [tl, tr, br, bl];
    if (this.group) {
      const t = this.group.calcTransformMatrix();
      return coords.map(p => transformPoint(p, t));
    }
    return coords;
  }

  /**
   * Checks if object intersects with the scene rect formed by tl and br
   */
  intersectsWithRect(tl, br) {
    const intersection = Intersection.intersectPolygonRectangle(this.getCoords(), tl, br);
    return intersection.status === 'Intersection';
  }

  /**
   * Checks if object intersects with another object
   * @param {Object} other Object to test
   * @return {Boolean} true if object intersects with another object
   */
  intersectsWithObject(other) {
    const intersection = Intersection.intersectPolygonPolygon(this.getCoords(), other.getCoords());
    return intersection.status === 'Intersection' || intersection.status === 'Coincident' || other.isContainedWithinObject(this) || this.isContainedWithinObject(other);
  }

  /**
   * Checks if object is fully contained within area of another object
   * @param {Object} other Object to test
   * @return {Boolean} true if object is fully contained within area of another object
   */
  isContainedWithinObject(other) {
    const points = this.getCoords();
    return points.every(point => other.containsPoint(point));
  }

  /**
   * Checks if object is fully contained within the scene rect formed by tl and br
   */
  isContainedWithinRect(tl, br) {
    const {
      left,
      top,
      width,
      height
    } = this.getBoundingRect();
    return left >= tl.x && left + width <= br.x && top >= tl.y && top + height <= br.y;
  }
  isOverlapping(other) {
    return this.intersectsWithObject(other) || this.isContainedWithinObject(other) || other.isContainedWithinObject(this);
  }

  /**
   * Checks if point is inside the object
   * @param {Point} point Point to check against
   * @return {Boolean} true if point is inside the object
   */
  containsPoint(point) {
    return Intersection.isPointInPolygon(point, this.getCoords());
  }

  /**
   * Checks if object is contained within the canvas with current viewportTransform
   * the check is done stopping at first point that appears on screen
   * @return {Boolean} true if object is fully or partially contained within canvas
   */
  isOnScreen() {
    if (!this.canvas) {
      return false;
    }
    const {
      tl,
      br
    } = this.canvas.vptCoords;
    const points = this.getCoords();
    // if some point is on screen, the object is on screen.
    if (points.some(point => point.x <= br.x && point.x >= tl.x && point.y <= br.y && point.y >= tl.y)) {
      return true;
    }
    // no points on screen, check intersection with absolute coordinates
    if (this.intersectsWithRect(tl, br)) {
      return true;
    }
    // check if the object is so big that it contains the entire viewport
    return this.containsPoint(tl.midPointFrom(br));
  }

  /**
   * Checks if object is partially contained within the canvas with current viewportTransform
   * @return {Boolean} true if object is partially contained within canvas
   */
  isPartiallyOnScreen() {
    if (!this.canvas) {
      return false;
    }
    const {
      tl,
      br
    } = this.canvas.vptCoords;
    if (this.intersectsWithRect(tl, br)) {
      return true;
    }
    const allPointsAreOutside = this.getCoords().every(point => (point.x >= br.x || point.x <= tl.x) && (point.y >= br.y || point.y <= tl.y));
    // check if the object is so big that it contains the entire viewport
    return allPointsAreOutside && this.containsPoint(tl.midPointFrom(br));
  }

  /**
   * Returns coordinates of object's bounding rectangle (left, top, width, height)
   * the box is intended as aligned to axis of canvas.
   * @return {Object} Object with left, top, width, height properties
   */
  getBoundingRect() {
    return makeBoundingBoxFromPoints(this.getCoords());
  }

  /**
   * Returns width of an object's bounding box counting transformations
   * @todo shouldn't this account for group transform and return the actual size in canvas coordinate plane?
   * @return {Number} width value
   */
  getScaledWidth() {
    return this._getTransformedDimensions().x;
  }

  /**
   * Returns height of an object bounding box counting transformations
   * @todo shouldn't this account for group transform and return the actual size in canvas coordinate plane?
   * @return {Number} height value
   */
  getScaledHeight() {
    return this._getTransformedDimensions().y;
  }

  /**
   * Scales an object (equally by x and y)
   * @param {Number} value Scale factor
   * @return {void}
   */
  scale(value) {
    this._set(SCALE_X, value);
    this._set(SCALE_Y, value);
    this.setCoords();
  }

  /**
   * Scales an object to a given width, with respect to bounding box (scaling by x/y equally)
   * @param {Number} value New width value
   * @return {void}
   */
  scaleToWidth(value) {
    // adjust to bounding rect factor so that rotated shapes would fit as well
    const boundingRectFactor = this.getBoundingRect().width / this.getScaledWidth();
    return this.scale(value / this.width / boundingRectFactor);
  }

  /**
   * Scales an object to a given height, with respect to bounding box (scaling by x/y equally)
   * @param {Number} value New height value
   * @return {void}
   */
  scaleToHeight(value) {
    // adjust to bounding rect factor so that rotated shapes would fit as well
    const boundingRectFactor = this.getBoundingRect().height / this.getScaledHeight();
    return this.scale(value / this.height / boundingRectFactor);
  }
  getCanvasRetinaScaling() {
    var _this$canvas;
    return ((_this$canvas = this.canvas) === null || _this$canvas === void 0 ? void 0 : _this$canvas.getRetinaScaling()) || 1;
  }

  /**
   * Returns the object angle relative to canvas counting also the group property
   * @returns {TDegree}
   */
  getTotalAngle() {
    return this.group ? radiansToDegrees(calcPlaneRotation(this.calcTransformMatrix())) : this.angle;
  }

  /**
   * Retrieves viewportTransform from Object's canvas if available
   * @return {TMat2D}
   */
  getViewportTransform() {
    var _this$canvas2;
    return ((_this$canvas2 = this.canvas) === null || _this$canvas2 === void 0 ? void 0 : _this$canvas2.viewportTransform) || iMatrix.concat();
  }

  /**
   * Calculates the coordinates of the 4 corner of the bbox, in absolute coordinates.
   * those never change with zoom or viewport changes.
   * @return {TCornerPoint}
   */
  calcACoords() {
    const rotateMatrix = createRotateMatrix({
        angle: this.angle
      }),
      {
        x,
        y
      } = this.getRelativeCenterPoint(),
      tMatrix = createTranslateMatrix(x, y),
      finalMatrix = multiplyTransformMatrices(tMatrix, rotateMatrix),
      dim = this._getTransformedDimensions(),
      w = dim.x / 2,
      h = dim.y / 2;
    return {
      // corners
      tl: transformPoint({
        x: -w,
        y: -h
      }, finalMatrix),
      tr: transformPoint({
        x: w,
        y: -h
      }, finalMatrix),
      bl: transformPoint({
        x: -w,
        y: h
      }, finalMatrix),
      br: transformPoint({
        x: w,
        y: h
      }, finalMatrix)
    };
  }

  /**
   * Sets corner and controls position coordinates based on current angle, width and height, left and top.
   * aCoords are used to quickly find an object on the canvas.
   * See {@link https://github.com/fabricjs/fabric.js/wiki/When-to-call-setCoords} and {@link http://fabric5.fabricjs.com/fabric-gotchas}
   */
  setCoords() {
    this.aCoords = this.calcACoords();
  }
  transformMatrixKey() {
    let skipGroup = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    let prefix = [];
    if (!skipGroup && this.group) {
      prefix = this.group.transformMatrixKey(skipGroup);
    }
    prefix.push(this.top, this.left, this.width, this.height, this.scaleX, this.scaleY, this.angle, this.strokeWidth, this.skewX, this.skewY, +this.flipX, +this.flipY, resolveOrigin(this.originX), resolveOrigin(this.originY));
    return prefix;
  }

  /**
   * calculate transform matrix that represents the current transformations from the
   * object's properties.
   * @param {Boolean} [skipGroup] return transform matrix for object not counting parent transformations
   * There are some situation in which this is useful to avoid the fake rotation.
   * @return {TMat2D} transform matrix for the object
   */
  calcTransformMatrix() {
    let skipGroup = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    let matrix = this.calcOwnMatrix();
    if (skipGroup || !this.group) {
      return matrix;
    }
    const key = this.transformMatrixKey(skipGroup),
      cache = this.matrixCache;
    if (cache && cache.key.every((x, i) => x === key[i])) {
      return cache.value;
    }
    if (this.group) {
      matrix = multiplyTransformMatrices(this.group.calcTransformMatrix(false), matrix);
    }
    this.matrixCache = {
      key,
      value: matrix
    };
    return matrix;
  }

  /**
   * calculate transform matrix that represents the current transformations from the
   * object's properties, this matrix does not include the group transformation
   * @return {TMat2D} transform matrix for the object
   */
  calcOwnMatrix() {
    const key = this.transformMatrixKey(true),
      cache = this.ownMatrixCache;
    if (cache && cache.key === key) {
      return cache.value;
    }
    const center = this.getRelativeCenterPoint(),
      options = {
        angle: this.angle,
        translateX: center.x,
        translateY: center.y,
        scaleX: this.scaleX,
        scaleY: this.scaleY,
        skewX: this.skewX,
        skewY: this.skewY,
        flipX: this.flipX,
        flipY: this.flipY
      },
      value = composeMatrix(options);
    this.ownMatrixCache = {
      key,
      value
    };
    return value;
  }

  /**
   * Calculate object dimensions from its properties
   * @private
   * @returns {Point} dimensions
   */
  _getNonTransformedDimensions() {
    return new Point(this.width, this.height).scalarAdd(this.strokeWidth);
  }

  /**
   * Calculate object dimensions for controls box, including padding and canvas zoom.
   * and active selection
   * @private
   * @param {object} [options] transform options
   * @returns {Point} dimensions
   */
  _calculateCurrentDimensions(options) {
    return this._getTransformedDimensions(options).transform(this.getViewportTransform(), true).scalarAdd(2 * this.padding);
  }

  // #region Origin

  /**
   * @deprecated please use 'center' as value in new projects
   * */

  /**
   * @deprecated please use 'center' as value in new projects
   * */

  /**
   * Object containing this object.
   * can influence its size and position
   */

  /**
   * Calculate object bounding box dimensions from its properties scale, skew.
   * This bounding box is aligned with object angle and not with canvas axis or screen.
   * @param {Object} [options]
   * @param {Number} [options.scaleX]
   * @param {Number} [options.scaleY]
   * @param {Number} [options.skewX]
   * @param {Number} [options.skewY]
   * @private
   * @returns {Point} dimensions
   */
  _getTransformedDimensions() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const dimOptions = {
      // if scaleX or scaleY are negative numbers,
      // this will return dimensions that are negative.
      // and this will break assumptions around the codebase
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      skewX: this.skewX,
      skewY: this.skewY,
      width: this.width,
      height: this.height,
      strokeWidth: this.strokeWidth,
      // TODO remove this spread. is visible in the performance inspection
      ...options
    };
    // stroke is applied before/after transformations are applied according to `strokeUniform`
    const strokeWidth = dimOptions.strokeWidth;
    let preScalingStrokeValue = strokeWidth,
      postScalingStrokeValue = 0;
    if (this.strokeUniform) {
      preScalingStrokeValue = 0;
      postScalingStrokeValue = strokeWidth;
    }
    const dimX = dimOptions.width + preScalingStrokeValue,
      dimY = dimOptions.height + preScalingStrokeValue,
      noSkew = dimOptions.skewX === 0 && dimOptions.skewY === 0;
    let finalDimensions;
    if (noSkew) {
      finalDimensions = new Point(dimX * dimOptions.scaleX, dimY * dimOptions.scaleY);
    } else {
      finalDimensions = sizeAfterTransform(dimX, dimY, calcDimensionsMatrix(dimOptions));
    }
    return finalDimensions.scalarAdd(postScalingStrokeValue);
  }

  /**
   * Translates the coordinates from a set of origin to another (based on the object's dimensions)
   * @param {Point} point The point which corresponds to the originX and originY params
   * @param {TOriginX} fromOriginX Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} fromOriginY Vertical origin: 'top', 'center' or 'bottom'
   * @param {TOriginX} toOriginX Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} toOriginY Vertical origin: 'top', 'center' or 'bottom'
   * @return {Point}
   */
  translateToGivenOrigin(point, fromOriginX, fromOriginY, toOriginX, toOriginY) {
    let x = point.x,
      y = point.y;
    const offsetX = resolveOrigin(toOriginX) - resolveOrigin(fromOriginX),
      offsetY = resolveOrigin(toOriginY) - resolveOrigin(fromOriginY);
    if (offsetX || offsetY) {
      const dim = this._getTransformedDimensions();
      x += offsetX * dim.x;
      y += offsetY * dim.y;
    }
    return new Point(x, y);
  }

  /**
   * Translates the coordinates from origin to center coordinates (based on the object's dimensions)
   * @param {Point} point The point which corresponds to the originX and originY params
   * @param {TOriginX} originX Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} originY Vertical origin: 'top', 'center' or 'bottom'
   * @return {Point}
   */
  translateToCenterPoint(point, originX, originY) {
    if (originX === CENTER && originY === CENTER) {
      return point;
    }
    const p = this.translateToGivenOrigin(point, originX, originY, CENTER, CENTER);
    if (this.angle) {
      return p.rotate(degreesToRadians(this.angle), point);
    }
    return p;
  }

  /**
   * Translates the coordinates from center to origin coordinates (based on the object's dimensions)
   * @param {Point} center The point which corresponds to center of the object
   * @param {OriginX} originX Horizontal origin: 'left', 'center' or 'right'
   * @param {OriginY} originY Vertical origin: 'top', 'center' or 'bottom'
   * @return {Point}
   */
  translateToOriginPoint(center, originX, originY) {
    const p = this.translateToGivenOrigin(center, CENTER, CENTER, originX, originY);
    if (this.angle) {
      return p.rotate(degreesToRadians(this.angle), center);
    }
    return p;
  }

  /**
   * Returns the center coordinates of the object relative to canvas
   * @return {Point}
   */
  getCenterPoint() {
    const relCenter = this.getRelativeCenterPoint();
    return this.group ? transformPoint(relCenter, this.group.calcTransformMatrix()) : relCenter;
  }

  /**
   * Returns the center coordinates of the object relative to it's parent
   * @return {Point}
   */
  getRelativeCenterPoint() {
    return this.translateToCenterPoint(new Point(this.left, this.top), this.originX, this.originY);
  }

  /**
   * Alias of {@link getPositionByOrigin}
   * @deprecated use {@link getPositionByOrigin} instead
   */
  getPointByOrigin(originX, originY) {
    return this.getPositionByOrigin(originX, originY);
  }

  /**
   * This function is the mirror of {@link setPositionByOrigin}
   * Returns the position of the object based on specified origin.
   * Take an object that has left, top set to 100, 100 with origin 'left', 'top'.
   * Return the values of left top ( wrapped in a point ) that you would need to keep
   * the same position if origin where different ( ex: center, bottom )
   * Alternatively you can use this to also find which point in the parent plane is a specific origin
   * ( where is the bottom right corner of my object? )
   * @param {TOriginX} originX Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} originY Vertical origin: 'top', 'center' or 'bottom'
   * @return {Point}
   */
  getPositionByOrigin(originX, originY) {
    return this.translateToOriginPoint(this.getRelativeCenterPoint(), originX, originY);
  }

  /**
   * Sets the position of the object taking into consideration the object's origin
   * @param {Point} pos The new position of the object
   * @param {TOriginX} originX Horizontal origin: 'left', 'center' or 'right'
   * @param {TOriginY} originY Vertical origin: 'top', 'center' or 'bottom'
   * @return {void}
   */
  setPositionByOrigin(pos, originX, originY) {
    const center = this.translateToCenterPoint(pos, originX, originY),
      position = this.translateToOriginPoint(center, this.originX, this.originY);
    this.set({
      left: position.x,
      top: position.y
    });
  }

  /**
   * @private
   */
  _getLeftTopCoords() {
    return this.getPositionByOrigin(LEFT, TOP);
  }

  /**
   * An utility method to position the object by its left top corner.
   * Useful to reposition objects since now the default origin is center/center
   * Places the left/top corner of the object bounding box in p.
   */
  positionByLeftTop(p) {
    return this.setPositionByOrigin(p, LEFT, TOP);
  }
}

/**
 * Root object class from which all 2d shape classes inherit from
 * @see {@link http://fabric5.fabricjs.com/fabric-intro-part-1#objects}
 *
 * @fires added
 * @fires removed
 *
 * @fires selected
 * @fires deselected
 *
 * @fires rotating
 * @fires scaling
 * @fires moving
 * @fires skewing
 * @fires modified
 *
 * @fires mousedown
 * @fires mouseup
 * @fires mouseover
 * @fires mouseout
 * @fires mousewheel
 * @fires mousedblclick
 *
 * @fires dragover
 * @fires dragenter
 * @fires dragleave
 * @fires drop
 */
let FabricObject$1 = class FabricObject extends ObjectGeometry {
  static getDefaults() {
    return FabricObject.ownDefaults;
  }

  /**
   * The class type.
   * This is used for serialization and deserialization purposes and internally it can be used
   * to identify classes.
   * When we transform a class in a plain JS object we need a way to recognize which class it was,
   * and the type is the way we do that. It has no other purposes and you should not give one.
   * Hard to reach on instances and please do not use to drive instance's logic (this.constructor.type).
   * To idenfity a class use instanceof class ( instanceof Rect ).
   * We do not do that in fabricJS code because we want to try to have code splitting possible.
   */

  /**
   * Legacy identifier of the class. Prefer using utils like isType or instanceOf
   * Will be removed in fabric 7 or 8.
   * The setter exists to avoid type errors in old code and possibly current deserialization code.
   * DO NOT build new code around this type value
   * @TODO add sustainable warning message
   * @type string
   * @deprecated
   */
  get type() {
    const name = this.constructor.type;
    if (name === 'FabricObject') {
      return 'object';
    }
    return name.toLowerCase();
  }
  set type(value) {
    log('warn', 'Setting type has no effect', value);
  }

  /**
   * Constructor
   * @param {Object} [options] Options object
   */
  constructor(options) {
    super();
    /**
     * Quick access for the _cacheCanvas rendering context
     * This is part of the objectCaching feature
     * since 1.7.0
     * @type boolean
     * @default undefined
     * @private
     */
    _defineProperty(this, "_cacheContext", null);
    Object.assign(this, FabricObject.ownDefaults);
    this.setOptions(options);
  }

  /**
   * Create a the canvas used to keep the cached copy of the object
   * @private
   */
  _createCacheCanvas() {
    this._cacheCanvas = createCanvasElement();
    this._cacheContext = this._cacheCanvas.getContext('2d');
    this._updateCacheCanvas();
    // if canvas gets created, is empty, so dirty.
    this.dirty = true;
  }

  /**
   * Limit the cache dimensions so that X * Y do not cross config.perfLimitSizeTotal
   * and each side do not cross fabric.cacheSideLimit
   * those numbers are configurable so that you can get as much detail as you want
   * making bargain with performances.
   * It mutates the input object dims.
   * @param {TCacheCanvasDimensions} dims
   * @return {TCacheCanvasDimensions} dims
   */
  _limitCacheSize(dims) {
    const width = dims.width,
      height = dims.height,
      max = config.maxCacheSideLimit,
      min = config.minCacheSideLimit;
    if (width <= max && height <= max && width * height <= config.perfLimitSizeTotal) {
      if (width < min) {
        dims.width = min;
      }
      if (height < min) {
        dims.height = min;
      }
      return dims;
    }
    const ar = width / height,
      [limX, limY] = cache.limitDimsByArea(ar),
      x = capValue(min, limX, max),
      y = capValue(min, limY, max);
    if (width > x) {
      dims.zoomX /= width / x;
      dims.width = x;
      dims.capped = true;
    }
    if (height > y) {
      dims.zoomY /= height / y;
      dims.height = y;
      dims.capped = true;
    }
    return dims;
  }

  /**
   * Return the dimension and the zoom level needed to create a cache canvas
   * big enough to host the object to be cached.
   * @private
   * @return {TCacheCanvasDimensions} Informations about the object to be cached
   */
  _getCacheCanvasDimensions() {
    const objectScale = this.getTotalObjectScaling(),
      // calculate dimensions without skewing
      dim = this._getTransformedDimensions({
        skewX: 0,
        skewY: 0
      }),
      neededX = dim.x * objectScale.x / this.scaleX,
      neededY = dim.y * objectScale.y / this.scaleY;
    return {
      // for sure this ALIASING_LIMIT is slightly creating problem
      // in situation in which the cache canvas gets an upper limit
      // also objectScale contains already scaleX and scaleY
      width: Math.ceil(neededX + ALIASING_LIMIT),
      height: Math.ceil(neededY + ALIASING_LIMIT),
      zoomX: objectScale.x,
      zoomY: objectScale.y,
      x: neededX,
      y: neededY
    };
  }

  /**
   * Update width and height of the canvas for cache
   * returns true or false if canvas needed resize.
   * @private
   * @return {Boolean} true if the canvas has been resized
   */
  _updateCacheCanvas() {
    const canvas = this._cacheCanvas,
      context = this._cacheContext,
      {
        width,
        height,
        zoomX,
        zoomY,
        x,
        y
      } = this._limitCacheSize(this._getCacheCanvasDimensions()),
      dimensionsChanged = width !== canvas.width || height !== canvas.height,
      zoomChanged = this.zoomX !== zoomX || this.zoomY !== zoomY;
    if (!canvas || !context) {
      return false;
    }
    const shouldRedraw = dimensionsChanged || zoomChanged;
    if (shouldRedraw) {
      if (width !== canvas.width || height !== canvas.height) {
        canvas.width = width;
        canvas.height = height;
      } else {
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
      const drawingWidth = x / 2;
      const drawingHeight = y / 2;
      this.cacheTranslationX = Math.round(canvas.width / 2 - drawingWidth) + drawingWidth;
      this.cacheTranslationY = Math.round(canvas.height / 2 - drawingHeight) + drawingHeight;
      context.translate(this.cacheTranslationX, this.cacheTranslationY);
      context.scale(zoomX, zoomY);
      this.zoomX = zoomX;
      this.zoomY = zoomY;
      return true;
    }
    return false;
  }

  /**
   * Sets object's properties from options, for class constructor only.
   * Needs to be overridden for different defaults.
   * @protected
   * @param {Object} [options] Options object
   */
  setOptions() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this._setOptions(options);
  }

  /**
   * Transforms context when rendering an object
   * @param {CanvasRenderingContext2D} ctx Context
   */
  transform(ctx) {
    const needFullTransform = this.group && !this.group._transformDone || this.group && this.canvas && ctx === this.canvas.contextTop;
    const m = this.calcTransformMatrix(!needFullTransform);
    ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
  }

  /**
   * Return the object scale factor counting also the group scaling
   * @return {Point}
   */
  getObjectScaling() {
    // if the object is a top level one, on the canvas, we go for simple aritmetic
    // otherwise the complex method with angles will return approximations and decimals
    // and will likely kill the cache when not needed
    // https://github.com/fabricjs/fabric.js/issues/7157
    if (!this.group) {
      return new Point(Math.abs(this.scaleX), Math.abs(this.scaleY));
    }
    // if we are inside a group total zoom calculation is complex, we defer to generic matrices
    const options = qrDecompose(this.calcTransformMatrix());
    return new Point(Math.abs(options.scaleX), Math.abs(options.scaleY));
  }

  /**
   * Return the object scale factor counting also the group scaling, zoom and retina
   * @return {Object} object with scaleX and scaleY properties
   */
  getTotalObjectScaling() {
    const scale = this.getObjectScaling();
    if (this.canvas) {
      const zoom = this.canvas.getZoom();
      const retina = this.getCanvasRetinaScaling();
      return scale.scalarMultiply(zoom * retina);
    }
    return scale;
  }

  /**
   * Return the object opacity counting also the group property
   * @return {Number}
   */
  getObjectOpacity() {
    let opacity = this.opacity;
    if (this.group) {
      opacity *= this.group.getObjectOpacity();
    }
    return opacity;
  }

  /**
   * Makes sure the scale is valid and modifies it if necessary
   * @todo: this is a control action issue, not a geometry one
   * @private
   * @param {Number} value, unconstrained
   * @return {Number} constrained value;
   */
  _constrainScale(value) {
    if (Math.abs(value) < this.minScaleLimit) {
      if (value < 0) {
        return -this.minScaleLimit;
      } else {
        return this.minScaleLimit;
      }
    } else if (value === 0) {
      return 0.0001;
    }
    return value;
  }

  /**
   * Handles setting values on the instance and handling internal side effects
   * @protected
   * @param {String} key
   * @param {*} value
   */
  _set(key, value) {
    if (key === SCALE_X || key === SCALE_Y) {
      value = this._constrainScale(value);
    }
    if (key === SCALE_X && value < 0) {
      this.flipX = !this.flipX;
      value *= -1;
    } else if (key === 'scaleY' && value < 0) {
      this.flipY = !this.flipY;
      value *= -1;
      // i don't like this automatic initialization here
    } else if (key === 'shadow' && value && !(value instanceof Shadow)) {
      value = new Shadow(value);
    }
    const isChanged = this[key] !== value;
    this[key] = value;

    // invalidate caches
    if (isChanged && this.constructor.cacheProperties.includes(key)) {
      this.dirty = true;
    }
    // a dirty child makes the parent dirty.
    // but a non dirty child does not make the parent not dirty.
    // the parent could be dirty for some other reason.
    this.parent && (this.dirty || isChanged && this.constructor.stateProperties.includes(key)) && this.parent._set('dirty', true);
    return this;
  }

  /**
   * return if the object would be visible in rendering
   * @return {Boolean}
   */
  isNotVisible() {
    return this.opacity === 0 || !this.width && !this.height && this.strokeWidth === 0 || !this.visible;
  }

  /**
   * Renders an object on a specified context
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  render(ctx) {
    // do not render if width/height are zeros or object is not visible
    if (this.isNotVisible()) {
      return;
    }
    if (this.canvas && this.canvas.skipOffscreen && !this.group && !this.isOnScreen()) {
      return;
    }
    ctx.save();
    this._setupCompositeOperation(ctx);
    this.drawSelectionBackground(ctx);
    this.transform(ctx);
    this._setOpacity(ctx);
    this._setShadow(ctx);
    if (this.shouldCache()) {
      this.renderCache();
      this.drawCacheOnCanvas(ctx);
    } else {
      this._removeCacheCanvas();
      this.drawObject(ctx, false, {});
      this.dirty = false;
    }
    ctx.restore();
  }
  drawSelectionBackground(_ctx) {
    /* no op */
  }
  renderCache(options) {
    options = options || {};
    if (!this._cacheCanvas || !this._cacheContext) {
      this._createCacheCanvas();
    }
    if (this.isCacheDirty() && this._cacheContext) {
      const {
        zoomX,
        zoomY,
        cacheTranslationX,
        cacheTranslationY
      } = this;
      const {
        width,
        height
      } = this._cacheCanvas;
      this.drawObject(this._cacheContext, options.forClipping, {
        zoomX,
        zoomY,
        cacheTranslationX,
        cacheTranslationY,
        width,
        height,
        parentClipPaths: []
      });
      this.dirty = false;
    }
  }

  /**
   * Remove cacheCanvas and its dimensions from the objects
   */
  _removeCacheCanvas() {
    this._cacheCanvas = undefined;
    this._cacheContext = null;
  }

  /**
   * return true if the object will draw a stroke
   * Does not consider text styles. This is just a shortcut used at rendering time
   * We want it to be an approximation and be fast.
   * wrote to avoid extra caching, it has to return true when stroke happens,
   * can guess when it will not happen at 100% chance, does not matter if it misses
   * some use case where the stroke is invisible.
   * @since 3.0.0
   * @returns Boolean
   */
  hasStroke() {
    return !!this.stroke && this.stroke !== 'transparent' && this.strokeWidth !== 0;
  }

  /**
   * return true if the object will draw a fill
   * Does not consider text styles. This is just a shortcut used at rendering time
   * We want it to be an approximation and be fast.
   * wrote to avoid extra caching, it has to return true when fill happens,
   * can guess when it will not happen at 100% chance, does not matter if it misses
   * some use case where the fill is invisible.
   * @since 3.0.0
   * @returns Boolean
   */
  hasFill() {
    return !!this.fill && this.fill !== 'transparent';
  }

  /**
   * When returns `true`, force the object to have its own cache, even if it is inside a group
   * it may be needed when your object behave in a particular way on the cache and always needs
   * its own isolated canvas to render correctly.
   * Created to be overridden
   * since 1.7.12
   * @returns Boolean
   */
  needsItsOwnCache() {
    // TODO re-evaluate this shadow condition
    if (this.paintFirst === STROKE && this.hasFill() && this.hasStroke() && !!this.shadow) {
      return true;
    }
    if (this.clipPath) {
      return true;
    }
    return false;
  }

  /**
   * Decide if the object should cache or not. Create its own cache level
   * objectCaching is a global flag, wins over everything
   * needsItsOwnCache should be used when the object drawing method requires
   * a cache step.
   * Generally you do not cache objects in groups because the group outside is cached.
   * Read as: cache if is needed, or if the feature is enabled but we are not already caching.
   * @return {Boolean}
   */
  shouldCache() {
    this.ownCaching = this.objectCaching && (!this.parent || !this.parent.isOnACache()) || this.needsItsOwnCache();
    return this.ownCaching;
  }

  /**
   * Check if this object will cast a shadow with an offset.
   * used by Group.shouldCache to know if child has a shadow recursively
   * @return {Boolean}
   * @deprecated
   */
  willDrawShadow() {
    return !!this.shadow && (this.shadow.offsetX !== 0 || this.shadow.offsetY !== 0);
  }

  /**
   * Execute the drawing operation for an object clipPath
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {FabricObject} clipPath
   */
  drawClipPathOnCache(ctx, clipPath, canvasWithClipPath) {
    ctx.save();
    // DEBUG: uncomment this line, comment the following
    // ctx.globalAlpha = 0.4
    if (clipPath.inverted) {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'destination-in';
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(canvasWithClipPath, 0, 0);
    ctx.restore();
  }

  /**
   * Execute the drawing operation for an object on a specified context
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {boolean} forClipping apply clipping styles
   * @param {DrawContext} context additional context for rendering
   */
  drawObject(ctx, forClipping, context) {
    const originalFill = this.fill,
      originalStroke = this.stroke;
    if (forClipping) {
      this.fill = 'black';
      this.stroke = '';
      this._setClippingProperties(ctx);
    } else {
      this._renderBackground(ctx);
    }
    this._render(ctx);
    this._drawClipPath(ctx, this.clipPath, context);
    this.fill = originalFill;
    this.stroke = originalStroke;
  }
  createClipPathLayer(clipPath, context) {
    const canvas = createCanvasElementFor(context);
    const ctx = canvas.getContext('2d');
    ctx.translate(context.cacheTranslationX, context.cacheTranslationY);
    ctx.scale(context.zoomX, context.zoomY);
    clipPath._cacheCanvas = canvas;
    context.parentClipPaths.forEach(prevClipPath => {
      prevClipPath.transform(ctx);
    });
    context.parentClipPaths.push(clipPath);
    if (clipPath.absolutePositioned) {
      const m = invertTransform(this.calcTransformMatrix());
      ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
    }
    clipPath.transform(ctx);
    clipPath.drawObject(ctx, true, context);
    return canvas;
  }

  /**
   * Prepare clipPath state and cache and draw it on instance's cache
   * @param {CanvasRenderingContext2D} ctx
   * @param {FabricObject} clipPath
   */
  _drawClipPath(ctx, clipPath, context) {
    if (!clipPath) {
      return;
    }
    // needed to setup _transformDone
    // TODO find a better solution?
    clipPath._transformDone = true;
    const canvas = this.createClipPathLayer(clipPath, context);
    this.drawClipPathOnCache(ctx, clipPath, canvas);
  }

  /**
   * Paint the cached copy of the object on the target context.
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  drawCacheOnCanvas(ctx) {
    ctx.scale(1 / this.zoomX, 1 / this.zoomY);
    ctx.drawImage(this._cacheCanvas, -this.cacheTranslationX, -this.cacheTranslationY);
  }

  /**
   * Check if cache is dirty and if is dirty clear the context.
   * This check has a big side effect, it changes the underlying cache canvas if necessary.
   * Do not call this method on your own to check if the cache is dirty, because if it is,
   * it is also going to wipe the cache. This is badly designed and needs to be fixed.
   * @param {Boolean} skipCanvas skip canvas checks because this object is painted
   * on parent canvas.
   */
  isCacheDirty() {
    let skipCanvas = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    if (this.isNotVisible()) {
      return false;
    }
    const canvas = this._cacheCanvas;
    const ctx = this._cacheContext;
    if (canvas && ctx && !skipCanvas && this._updateCacheCanvas()) {
      // in this case the context is already cleared.
      return true;
    } else {
      if (this.dirty || this.clipPath && this.clipPath.absolutePositioned) {
        if (canvas && ctx && !skipCanvas) {
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.restore();
        }
        return true;
      }
    }
    return false;
  }

  /**
   * Draws a background for the object big as its untransformed dimensions
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderBackground(ctx) {
    if (!this.backgroundColor) {
      return;
    }
    const dim = this._getNonTransformedDimensions();
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(-dim.x / 2, -dim.y / 2, dim.x, dim.y);
    // if there is background color no other shadows
    // should be casted
    this._removeShadow(ctx);
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _setOpacity(ctx) {
    if (this.group && !this.group._transformDone) {
      ctx.globalAlpha = this.getObjectOpacity();
    } else {
      ctx.globalAlpha *= this.opacity;
    }
  }
  _setStrokeStyles(ctx, decl) {
    const stroke = decl.stroke;
    if (stroke) {
      ctx.lineWidth = decl.strokeWidth;
      ctx.lineCap = decl.strokeLineCap;
      ctx.lineDashOffset = decl.strokeDashOffset;
      ctx.lineJoin = decl.strokeLineJoin;
      ctx.miterLimit = decl.strokeMiterLimit;
      if (isFiller(stroke)) {
        if (stroke.gradientUnits === 'percentage' || stroke.gradientTransform || stroke.patternTransform) {
          // need to transform gradient in a pattern.
          // this is a slow process. If you are hitting this codepath, and the object
          // is not using caching, you should consider switching it on.
          // we need a canvas as big as the current object caching canvas.
          this._applyPatternForTransformedGradient(ctx, stroke);
        } else {
          // is a simple gradient or pattern
          ctx.strokeStyle = stroke.toLive(ctx);
          this._applyPatternGradientTransform(ctx, stroke);
        }
      } else {
        // is a color
        ctx.strokeStyle = decl.stroke;
      }
    }
  }
  _setFillStyles(ctx, _ref) {
    let {
      fill
    } = _ref;
    if (fill) {
      if (isFiller(fill)) {
        ctx.fillStyle = fill.toLive(ctx);
        this._applyPatternGradientTransform(ctx, fill);
      } else {
        ctx.fillStyle = fill;
      }
    }
  }
  _setClippingProperties(ctx) {
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'transparent';
    ctx.fillStyle = '#000000';
  }

  /**
   * @private
   * Sets line dash
   * @param {CanvasRenderingContext2D} ctx Context to set the dash line on
   * @param {Array} dashArray array representing dashes
   */
  _setLineDash(ctx, dashArray) {
    if (!dashArray || dashArray.length === 0) {
      return;
    }
    ctx.setLineDash(dashArray);
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _setShadow(ctx) {
    if (!this.shadow) {
      return;
    }
    const shadow = this.shadow,
      canvas = this.canvas,
      retinaScaling = this.getCanvasRetinaScaling(),
      [sx,,, sy] = (canvas === null || canvas === void 0 ? void 0 : canvas.viewportTransform) || iMatrix,
      multX = sx * retinaScaling,
      multY = sy * retinaScaling,
      scaling = shadow.nonScaling ? new Point(1, 1) : this.getObjectScaling();
    ctx.shadowColor = shadow.color;
    ctx.shadowBlur = shadow.blur * config.browserShadowBlurConstant * (multX + multY) * (scaling.x + scaling.y) / 4;
    ctx.shadowOffsetX = shadow.offsetX * multX * scaling.x;
    ctx.shadowOffsetY = shadow.offsetY * multY * scaling.y;
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _removeShadow(ctx) {
    if (!this.shadow) {
      return;
    }
    ctx.shadowColor = '';
    ctx.shadowBlur = ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {TFiller} filler {@link Pattern} or {@link Gradient}
   */
  _applyPatternGradientTransform(ctx, filler) {
    if (!isFiller(filler)) {
      return {
        offsetX: 0,
        offsetY: 0
      };
    }
    const t = filler.gradientTransform || filler.patternTransform;
    const offsetX = -this.width / 2 + filler.offsetX || 0,
      offsetY = -this.height / 2 + filler.offsetY || 0;
    if (filler.gradientUnits === 'percentage') {
      ctx.transform(this.width, 0, 0, this.height, offsetX, offsetY);
    } else {
      ctx.transform(1, 0, 0, 1, offsetX, offsetY);
    }
    if (t) {
      ctx.transform(t[0], t[1], t[2], t[3], t[4], t[5]);
    }
    return {
      offsetX: offsetX,
      offsetY: offsetY
    };
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderPaintInOrder(ctx) {
    if (this.paintFirst === STROKE) {
      this._renderStroke(ctx);
      this._renderFill(ctx);
    } else {
      this._renderFill(ctx);
      this._renderStroke(ctx);
    }
  }

  /**
   * @private
   * function that actually render something on the context.
   * empty here to allow Obects to work on tests to benchmark fabric functionalites
   * not related to rendering
   * @param {CanvasRenderingContext2D} _ctx Context to render on
   */
  _render(_ctx) {
    // placeholder to be overridden
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderFill(ctx) {
    if (!this.fill) {
      return;
    }
    ctx.save();
    this._setFillStyles(ctx, this);
    if (this.fillRule === 'evenodd') {
      ctx.fill('evenodd');
    } else {
      ctx.fill();
    }
    ctx.restore();
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderStroke(ctx) {
    if (!this.stroke || this.strokeWidth === 0) {
      return;
    }
    if (this.shadow && !this.shadow.affectStroke) {
      this._removeShadow(ctx);
    }
    ctx.save();
    if (this.strokeUniform) {
      const scaling = this.getObjectScaling();
      ctx.scale(1 / scaling.x, 1 / scaling.y);
    }
    this._setLineDash(ctx, this.strokeDashArray);
    this._setStrokeStyles(ctx, this);
    ctx.stroke();
    ctx.restore();
  }

  /**
   * This function try to patch the missing gradientTransform on canvas gradients.
   * transforming a context to transform the gradient, is going to transform the stroke too.
   * we want to transform the gradient but not the stroke operation, so we create
   * a transformed gradient on a pattern and then we use the pattern instead of the gradient.
   * this method has drawbacks: is slow, is in low resolution, needs a patch for when the size
   * is limited.
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {Gradient} filler
   */
  _applyPatternForTransformedGradient(ctx, filler) {
    var _pCtx$createPattern;
    const dims = this._limitCacheSize(this._getCacheCanvasDimensions()),
      retinaScaling = this.getCanvasRetinaScaling(),
      width = dims.x / this.scaleX / retinaScaling,
      height = dims.y / this.scaleY / retinaScaling,
      pCanvas = createCanvasElementFor({
        // in case width and height are less than 1px, we have to round up.
        // since the pattern is no-repeat, this is fine
        width: Math.ceil(width),
        height: Math.ceil(height)
      });
    const pCtx = pCanvas.getContext('2d');
    if (!pCtx) {
      return;
    }
    pCtx.beginPath();
    pCtx.moveTo(0, 0);
    pCtx.lineTo(width, 0);
    pCtx.lineTo(width, height);
    pCtx.lineTo(0, height);
    pCtx.closePath();
    pCtx.translate(width / 2, height / 2);
    pCtx.scale(dims.zoomX / this.scaleX / retinaScaling, dims.zoomY / this.scaleY / retinaScaling);
    this._applyPatternGradientTransform(pCtx, filler);
    pCtx.fillStyle = filler.toLive(ctx);
    pCtx.fill();
    ctx.translate(-this.width / 2 - this.strokeWidth / 2, -this.height / 2 - this.strokeWidth / 2);
    ctx.scale(retinaScaling * this.scaleX / dims.zoomX, retinaScaling * this.scaleY / dims.zoomY);
    ctx.strokeStyle = (_pCtx$createPattern = pCtx.createPattern(pCanvas, 'no-repeat')) !== null && _pCtx$createPattern !== void 0 ? _pCtx$createPattern : '';
  }

  /**
   * This function is an helper for svg import. it returns the center of the object in the svg
   * untransformed coordinates
   * It doesn't matter where the objects origin are, svg has left and top in the top left corner,
   * And this method is only run once on the object after the fromElement parser.
   * @private
   * @return {Point} center point from element coordinates
   */
  _findCenterFromElement() {
    return new Point(this.left + this.width / 2, this.top + this.height / 2);
  }

  /**
   * Clones an instance.
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @returns {Promise<FabricObject>}
   */
  clone(propertiesToInclude) {
    const objectForm = this.toObject(propertiesToInclude);
    return this.constructor.fromObject(objectForm);
  }

  /**
   * Creates an instance of Image out of an object
   * makes use of toCanvasElement.
   * Once this method was based on toDataUrl and loadImage, so it also had a quality
   * and format option. toCanvasElement is faster and produce no loss of quality.
   * If you need to get a real Jpeg or Png from an object, using toDataURL is the right way to do it.
   * toCanvasElement and then toBlob from the obtained canvas is also a good option.
   * @todo fix the export type, it could not be Image but the type that getClass return for 'image'.
   * @param {ObjectToCanvasElementOptions} [options] for clone as image, passed to toDataURL
   * @param {Number} [options.multiplier=1] Multiplier to scale by
   * @param {Number} [options.left] Cropping left offset. Introduced in v1.2.14
   * @param {Number} [options.top] Cropping top offset. Introduced in v1.2.14
   * @param {Number} [options.width] Cropping width. Introduced in v1.2.14
   * @param {Number} [options.height] Cropping height. Introduced in v1.2.14
   * @param {Boolean} [options.enableRetinaScaling] Enable retina scaling for clone image. Introduce in 1.6.4
   * @param {Boolean} [options.withoutTransform] Remove current object transform ( no scale , no angle, no flip, no skew ). Introduced in 2.3.4
   * @param {Boolean} [options.withoutShadow] Remove current object shadow. Introduced in 2.4.2
   * @return {FabricImage} Object cloned as image.
   */
  cloneAsImage(options) {
    const canvasEl = this.toCanvasElement(options);
    // TODO: how to import Image w/o an import cycle?
    const ImageClass = classRegistry.getClass('image');
    return new ImageClass(canvasEl);
  }

  /**
   * Converts an object into a HTMLCanvas element
   * @param {ObjectToCanvasElementOptions} options Options object
   * @param {Number} [options.multiplier=1] Multiplier to scale by
   * @param {Number} [options.left] Cropping left offset. Introduced in v1.2.14
   * @param {Number} [options.top] Cropping top offset. Introduced in v1.2.14
   * @param {Number} [options.width] Cropping width. Introduced in v1.2.14
   * @param {Number} [options.height] Cropping height. Introduced in v1.2.14
   * @param {Boolean} [options.enableRetinaScaling] Enable retina scaling for clone image. Introduce in 1.6.4
   * @param {Boolean} [options.withoutTransform] Remove current object transform ( no scale , no angle, no flip, no skew ). Introduced in 2.3.4
   * @param {Boolean} [options.withoutShadow] Remove current object shadow. Introduced in 2.4.2
   * @param {Boolean} [options.viewportTransform] Account for canvas viewport transform
   * @param {(el?: HTMLCanvasElement) => StaticCanvas} [options.canvasProvider] Create the output canvas
   * @return {HTMLCanvasElement} Returns DOM element <canvas> with the FabricObject
   */
  toCanvasElement() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const origParams = saveObjectTransform(this),
      originalGroup = this.group,
      originalShadow = this.shadow,
      abs = Math.abs,
      retinaScaling = options.enableRetinaScaling ? getDevicePixelRatio() : 1,
      multiplier = (options.multiplier || 1) * retinaScaling,
      canvasProvider = options.canvasProvider || (el => new StaticCanvas$1(el, {
        enableRetinaScaling: false,
        renderOnAddRemove: false,
        skipOffscreen: false
      }));
    delete this.group;
    if (options.withoutTransform) {
      resetObjectTransform(this);
    }
    if (options.withoutShadow) {
      this.shadow = null;
    }
    if (options.viewportTransform) {
      sendObjectToPlane(this, this.getViewportTransform());
    }
    this.setCoords();
    const el = createCanvasElement(),
      boundingRect = this.getBoundingRect(),
      shadow = this.shadow,
      shadowOffset = new Point();
    if (shadow) {
      const shadowBlur = shadow.blur;
      const scaling = shadow.nonScaling ? new Point(1, 1) : this.getObjectScaling();
      // consider non scaling shadow.
      shadowOffset.x = 2 * Math.round(abs(shadow.offsetX) + shadowBlur) * abs(scaling.x);
      shadowOffset.y = 2 * Math.round(abs(shadow.offsetY) + shadowBlur) * abs(scaling.y);
    }
    const width = boundingRect.width + shadowOffset.x,
      height = boundingRect.height + shadowOffset.y;
    // if the current width/height is not an integer
    // we need to make it so.
    el.width = Math.ceil(width);
    el.height = Math.ceil(height);
    const canvas = canvasProvider(el);
    if (options.format === 'jpeg') {
      canvas.backgroundColor = '#fff';
    }
    this.setPositionByOrigin(new Point(canvas.width / 2, canvas.height / 2), CENTER, CENTER);
    const originalCanvas = this.canvas;
    // static canvas and canvas have both an array of InteractiveObjects
    // @ts-expect-error this needs to be fixed somehow, or ignored globally
    canvas._objects = [this];
    this.set('canvas', canvas);
    this.setCoords();
    const canvasEl = canvas.toCanvasElement(multiplier || 1, options);
    this.set('canvas', originalCanvas);
    this.shadow = originalShadow;
    if (originalGroup) {
      this.group = originalGroup;
    }
    this.set(origParams);
    this.setCoords();
    // canvas.dispose will call image.dispose that will nullify the elements
    // since this canvas is a simple element for the process, we remove references
    // to objects in this way in order to avoid object trashing.
    canvas._objects = [];
    // since render has settled it is safe to destroy canvas
    canvas.destroy();
    return canvasEl;
  }

  /**
   * Converts an object into a data-url-like string
   * @param {Object} options Options object
   * @param {String} [options.format=png] The format of the output image. Either "jpeg" or "png"
   * @param {Number} [options.quality=1] Quality level (0..1). Only used for jpeg.
   * @param {Number} [options.multiplier=1] Multiplier to scale by
   * @param {Number} [options.left] Cropping left offset. Introduced in v1.2.14
   * @param {Number} [options.top] Cropping top offset. Introduced in v1.2.14
   * @param {Number} [options.width] Cropping width. Introduced in v1.2.14
   * @param {Number} [options.height] Cropping height. Introduced in v1.2.14
   * @param {Boolean} [options.enableRetinaScaling] Enable retina scaling for clone image. Introduce in 1.6.4
   * @param {Boolean} [options.withoutTransform] Remove current object transform ( no scale , no angle, no flip, no skew ). Introduced in 2.3.4
   * @param {Boolean} [options.withoutShadow] Remove current object shadow. Introduced in 2.4.2
   * @return {String} Returns a data: URL containing a representation of the object in the format specified by options.format
   */
  toDataURL() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return toDataURL(this.toCanvasElement(options), options.format || 'png', options.quality || 1);
  }
  toBlob() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return toBlob(this.toCanvasElement(options), options.format || 'png', options.quality || 1);
  }

  /**
   * Checks if the instance is of any of the specified types.
   * We use this to filter a list of objects for the `getObjects` function.
   *
   * For detecting an instance type `instanceOf` is a better check,
   * but to avoid to make specific classes a dependency of generic code
   * internally we use this.
   *
   * This compares both the static class `type` and the instance's own `type` property
   * against the provided list of types.
   *
   * @param types - A list of type strings to check against.
   * @returns `true` if the object's type or class type matches any in the list, otherwise `false`.
   */
  isType() {
    for (var _len = arguments.length, types = new Array(_len), _key = 0; _key < _len; _key++) {
      types[_key] = arguments[_key];
    }
    return types.includes(this.constructor.type) || types.includes(this.type);
  }

  /**
   * Returns complexity of an instance
   * @return {Number} complexity of this instance (is 1 unless subclassed)
   */
  complexity() {
    return 1;
  }

  /**
   * Returns a JSON representation of an instance
   * @return {Object} JSON
   */
  toJSON() {
    // delegate, not alias
    return this.toObject();
  }

  /**
   * Sets "angle" of an instance with centered rotation
   * @param {TDegree} angle Angle value (in degrees)
   */
  rotate(angle) {
    const {
      centeredRotation,
      originX,
      originY
    } = this;
    if (centeredRotation) {
      const {
        x,
        y
      } = this.getRelativeCenterPoint();
      this.originX = CENTER;
      this.originY = CENTER;
      this.left = x;
      this.top = y;
    }
    this.set('angle', angle);
    if (centeredRotation) {
      const {
        x,
        y
      } = this.getPositionByOrigin(originX, originY);
      this.left = x;
      this.top = y;
      this.originX = originX;
      this.originY = originY;
    }
  }

  /**
   * This callback function is called by the parent group of an object every
   * time a non-delegated property changes on the group. It is passed the key
   * and value as parameters. Not adding in this function's signature to avoid
   * Travis build error about unused variables.
   */
  setOnGroup() {
    // implemented by sub-classes, as needed.
  }

  /**
   * Sets canvas globalCompositeOperation for specific object
   * custom composition operation for the particular object can be specified using globalCompositeOperation property
   * @param {CanvasRenderingContext2D} ctx Rendering canvas context
   */
  _setupCompositeOperation(ctx) {
    if (this.globalCompositeOperation) {
      ctx.globalCompositeOperation = this.globalCompositeOperation;
    }
  }

  /**
   * cancel instance's running animations
   * override if necessary to dispose artifacts such as `clipPath`
   */
  dispose() {
    runningAnimations.cancelByTarget(this);
    this.off();
    this._set('canvas', undefined);
    // clear caches
    this._cacheCanvas && getEnv$1().dispose(this._cacheCanvas);
    this._cacheCanvas = undefined;
    this._cacheContext = null;
  }

  // #region Animation methods
  /**
   * List of properties to consider for animating colors.
   * @type String[]
   */

  /**
   * Animates object's properties
   * @param {Record<string, number | number[] | TColorArg>} animatable map of keys and end values
   * @param {Partial<AnimationOptions<T>>} options
   * @see {@link http://fabric5.fabricjs.com/fabric-intro-part-2#animation}
   * @return {Record<string, TAnimation<T>>} map of animation contexts
   *
   * As object — multiple properties
   *
   * object.animate({ left: ..., top: ... });
   * object.animate({ left: ..., top: ... }, { duration: ... });
   */
  animate(animatable, options) {
    return Object.entries(animatable).reduce((acc, _ref2) => {
      let [key, endValue] = _ref2;
      acc[key] = this._animate(key, endValue, options);
      return acc;
    }, {});
  }

  /**
   * @private
   * @param {String} key Property to animate
   * @param {String} to Value to animate to
   * @param {Object} [options] Options object
   */
  _animate(key, endValue) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    const path = key.split('.');
    const propIsColor = this.constructor.colorProperties.includes(path[path.length - 1]);
    const {
      abort,
      startValue,
      onChange,
      onComplete
    } = options;
    const animationOptions = {
      ...options,
      target: this,
      // path.reduce... is the current value in case start value isn't provided
      startValue: startValue !== null && startValue !== void 0 ? startValue : path.reduce((deep, key) => deep[key], this),
      endValue,
      abort: abort === null || abort === void 0 ? void 0 : abort.bind(this),
      onChange: (value, valueProgress, durationProgress) => {
        path.reduce((deep, key, index) => {
          if (index === path.length - 1) {
            deep[key] = value;
          }
          return deep[key];
        }, this);
        onChange &&
        // @ts-expect-error generic callback arg0 is wrong
        onChange(value, valueProgress, durationProgress);
      },
      onComplete: (value, valueProgress, durationProgress) => {
        this.setCoords();
        onComplete &&
        // @ts-expect-error generic callback arg0 is wrong
        onComplete(value, valueProgress, durationProgress);
      }
    };
    return propIsColor ? animateColor(animationOptions) : animate(animationOptions);
  }

  // #region Object stacking methods

  /**
   * A reference to the parent of the object
   * Used to keep the original parent ref when the object has been added to an ActiveSelection, hence loosing the `group` ref
   */

  /**
   * Checks if object is descendant of target
   * Should be used instead of {@link Group.contains} or {@link StaticCanvas.contains} for performance reasons
   * @param {TAncestor} target
   * @returns {boolean}
   */
  isDescendantOf(target) {
    const {
      parent,
      group
    } = this;
    return parent === target || group === target ||
    // walk up
    !!parent && parent.isDescendantOf(target) || !!group && group !== parent && group.isDescendantOf(target);
  }

  /**
   * @returns {Ancestors} ancestors (excluding `ActiveSelection`) from bottom to top
   */
  getAncestors() {
    const ancestors = [];
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let parent = this;
    do {
      parent = parent.parent;
      parent && ancestors.push(parent);
    } while (parent);
    return ancestors;
  }

  /**
   * Compare ancestors
   *
   * @param {StackedObject} other
   * @returns {AncestryComparison} an object that represent the ancestry situation.
   */
  findCommonAncestors(other) {
    if (this === other) {
      return {
        fork: [],
        otherFork: [],
        common: [this, ...this.getAncestors()]
      };
    }
    const ancestors = this.getAncestors();
    const otherAncestors = other.getAncestors();
    //  if `this` has no ancestors and `this` is top ancestor of `other` we must handle the following case
    if (ancestors.length === 0 && otherAncestors.length > 0 && this === otherAncestors[otherAncestors.length - 1]) {
      return {
        fork: [],
        otherFork: [other, ...otherAncestors.slice(0, otherAncestors.length - 1)],
        common: [this]
      };
    }
    //  compare ancestors
    for (let i = 0, ancestor; i < ancestors.length; i++) {
      ancestor = ancestors[i];
      if (ancestor === other) {
        return {
          fork: [this, ...ancestors.slice(0, i)],
          otherFork: [],
          common: ancestors.slice(i)
        };
      }
      for (let j = 0; j < otherAncestors.length; j++) {
        if (this === otherAncestors[j]) {
          return {
            fork: [],
            otherFork: [other, ...otherAncestors.slice(0, j)],
            common: [this, ...ancestors]
          };
        }
        if (ancestor === otherAncestors[j]) {
          return {
            fork: [this, ...ancestors.slice(0, i)],
            otherFork: [other, ...otherAncestors.slice(0, j)],
            common: ancestors.slice(i)
          };
        }
      }
    }
    // nothing shared
    return {
      fork: [this, ...ancestors],
      otherFork: [other, ...otherAncestors],
      common: []
    };
  }

  /**
   *
   * @param {StackedObject} other
   * @returns {boolean}
   */
  hasCommonAncestors(other) {
    const commonAncestors = this.findCommonAncestors(other);
    return commonAncestors && !!commonAncestors.common.length;
  }

  /**
   *
   * @param {FabricObject} other object to compare against
   * @returns {boolean | undefined} if objects do not share a common ancestor or they are strictly equal it is impossible to determine which is in front of the other; in such cases the function returns `undefined`
   */
  isInFrontOf(other) {
    if (this === other) {
      return undefined;
    }
    const ancestorData = this.findCommonAncestors(other);
    if (ancestorData.fork.includes(other)) {
      return true;
    }
    if (ancestorData.otherFork.includes(this)) {
      return false;
    }
    // if there isn't a common ancestor, we take the canvas.
    // if there is no canvas, there is nothing to compare
    const firstCommonAncestor = ancestorData.common[0] || this.canvas;
    if (!firstCommonAncestor) {
      return undefined;
    }
    const headOfFork = ancestorData.fork.pop(),
      headOfOtherFork = ancestorData.otherFork.pop(),
      thisIndex = firstCommonAncestor._objects.indexOf(headOfFork),
      otherIndex = firstCommonAncestor._objects.indexOf(headOfOtherFork);
    return thisIndex > -1 && thisIndex > otherIndex;
  }

  // #region Serialization
  /**
   * Define a list of custom properties that will be serialized when
   * instance.toObject() gets called
   */

  /**
   * Returns an object representation of an instance
   * @param {string[]} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} Object representation of an instance
   */
  toObject() {
    let propertiesToInclude = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    const propertiesToSerialize = propertiesToInclude.concat(FabricObject.customProperties, this.constructor.customProperties || []);
    let clipPathData;
    const NUM_FRACTION_DIGITS = config.NUM_FRACTION_DIGITS;
    const {
      clipPath,
      fill,
      stroke,
      shadow,
      strokeDashArray,
      left,
      top,
      originX,
      originY,
      width,
      height,
      strokeWidth,
      strokeLineCap,
      strokeDashOffset,
      strokeLineJoin,
      strokeUniform,
      strokeMiterLimit,
      scaleX,
      scaleY,
      angle,
      flipX,
      flipY,
      opacity,
      visible,
      backgroundColor,
      fillRule,
      paintFirst,
      globalCompositeOperation,
      skewX,
      skewY
    } = this;
    if (clipPath && !clipPath.excludeFromExport) {
      clipPathData = clipPath.toObject(propertiesToSerialize.concat('inverted', 'absolutePositioned'));
    }
    const toFixedBound = val => toFixed(val, NUM_FRACTION_DIGITS);
    const object = {
      ...pick(this, propertiesToSerialize),
      type: this.constructor.type,
      version: VERSION,
      originX,
      originY,
      left: toFixedBound(left),
      top: toFixedBound(top),
      width: toFixedBound(width),
      height: toFixedBound(height),
      fill: isSerializableFiller(fill) ? fill.toObject() : fill,
      stroke: isSerializableFiller(stroke) ? stroke.toObject() : stroke,
      strokeWidth: toFixedBound(strokeWidth),
      strokeDashArray: strokeDashArray ? strokeDashArray.concat() : strokeDashArray,
      strokeLineCap,
      strokeDashOffset,
      strokeLineJoin,
      strokeUniform,
      strokeMiterLimit: toFixedBound(strokeMiterLimit),
      scaleX: toFixedBound(scaleX),
      scaleY: toFixedBound(scaleY),
      angle: toFixedBound(angle),
      flipX,
      flipY,
      opacity: toFixedBound(opacity),
      shadow: shadow ? shadow.toObject() : shadow,
      visible,
      backgroundColor,
      fillRule,
      paintFirst,
      globalCompositeOperation,
      skewX: toFixedBound(skewX),
      skewY: toFixedBound(skewY),
      ...(clipPathData ? {
        clipPath: clipPathData
      } : null)
    };
    return !this.includeDefaultValues ? this._removeDefaultValues(object) : object;
  }

  /**
   * Returns (dataless) object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} Object representation of an instance
   */
  toDatalessObject(propertiesToInclude) {
    // will be overwritten by subclasses
    return this.toObject(propertiesToInclude);
  }

  /**
   * @private
   * @param {Object} object
   */
  _removeDefaultValues(object) {
    // getDefaults() ( get from static ownDefaults ) should win over prototype since anyway they get assigned to instance
    // ownDefault vs prototype is swappable only if you change all the fabric objects consistently.
    const defaults = this.constructor.getDefaults();
    const hasStaticDefaultValues = Object.keys(defaults).length > 0;
    const baseValues = hasStaticDefaultValues ? defaults : Object.getPrototypeOf(this);
    return pickBy(object, (value, key) => {
      if (key === LEFT || key === TOP || key === 'type') {
        return true;
      }
      const baseValue = baseValues[key];
      return value !== baseValue &&
      // basically a check for [] === []
      !(Array.isArray(value) && Array.isArray(baseValue) && value.length === 0 && baseValue.length === 0);
    });
  }

  /**
   * Returns a string representation of an instance
   * @return {String}
   */
  toString() {
    return `#<${this.constructor.type}>`;
  }

  /**
   *
   * @param {Function} klass
   * @param {object} object
   * @param {object} [options]
   * @param {string} [options.extraParam] property to pass as first argument to the constructor
   * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @returns {Promise<FabricObject>}
   */
  static _fromObject(_ref3) {
    let {
      type,
      ...serializedObjectOptions
    } = _ref3;
    let {
      extraParam,
      ...options
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return enlivenObjectEnlivables(serializedObjectOptions, options).then(enlivedObjectOptions => {
      // from the resulting enlived options, extract options.extraParam to arg0
      // to avoid accidental overrides later
      if (extraParam) {
        delete enlivedObjectOptions[extraParam];
        return new this(serializedObjectOptions[extraParam],
        // @ts-expect-error different signature
        enlivedObjectOptions);
      } else {
        return new this(enlivedObjectOptions);
      }
    });
  }

  /**
   *
   * @param {object} object
   * @param {object} [options]
   * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @returns {Promise<FabricObject>}
   */
  static fromObject(object, options) {
    return this._fromObject(object, options);
  }
};
/**
 * This list of properties is used to check if the state of an object is changed.
 * This state change now is only used for children of groups to understand if a group
 * needs its cache regenerated during a .set call
 * @type Array
 */
_defineProperty(FabricObject$1, "stateProperties", stateProperties);
/**
 * List of properties to consider when checking if cache needs refresh
 * Those properties are checked by
 * calls to Object.set(key, value). If the key is in this list, the object is marked as dirty
 * and refreshed at the next render
 * @type Array
 */
_defineProperty(FabricObject$1, "cacheProperties", cacheProperties);
_defineProperty(FabricObject$1, "ownDefaults", fabricObjectDefaultValues);
_defineProperty(FabricObject$1, "type", 'FabricObject');
_defineProperty(FabricObject$1, "colorProperties", [FILL, STROKE, 'backgroundColor']);
_defineProperty(FabricObject$1, "customProperties", []);
classRegistry.setClass(FabricObject$1);
classRegistry.setClass(FabricObject$1, 'object');

/**
 * Wrap an action handler with firing an event if the action is performed
 * @param {TModificationEvents} eventName the event we want to fire
 * @param {TransformActionHandler<T>} actionHandler the function to wrap
 * @param {object} extraEventInfo extra information to pas to the event handler
 * @return {TransformActionHandler<T>} a function with an action handler signature
 */
const wrapWithFireEvent = (eventName, actionHandler, extraEventInfo) => {
  return (eventData, transform, x, y) => {
    const actionPerformed = actionHandler(eventData, transform, x, y);
    if (actionPerformed) {
      fireEvent(eventName, {
        ...commonEventInfo(eventData, transform, x, y),
        ...extraEventInfo
      });
    }
    return actionPerformed;
  };
};

/**
 * Wrap an action handler with saving/restoring object position on the transform.
 * this is the code that permits to objects to keep their position while transforming.
 * @param {Function} actionHandler the function to wrap
 * @return {Function} a function with an action handler signature
 */
function wrapWithFixedAnchor(actionHandler) {
  return (eventData, transform, x, y) => {
    const {
        target,
        originX,
        originY
      } = transform,
      constraint = target.getPositionByOrigin(originX, originY),
      actionPerformed = actionHandler(eventData, transform, x, y);
    // flipping requires to change the transform origin, so we read from the mutated transform
    // instead of leveraging the one destructured before
    target.setPositionByOrigin(constraint, transform.originX, transform.originY);
    return actionPerformed;
  };
}

/**
 * Action handler to change object's width
 * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
const changeObjectWidth = (eventData, transform, x, y) => {
  const localPoint = getLocalPoint(transform, transform.originX, transform.originY, x, y);
  //  make sure the control changes width ONLY from it's side of target
  if (resolveOrigin(transform.originX) === resolveOrigin(CENTER) || resolveOrigin(transform.originX) === resolveOrigin(RIGHT) && localPoint.x < 0 || resolveOrigin(transform.originX) === resolveOrigin(LEFT) && localPoint.x > 0) {
    const {
        target
      } = transform,
      strokePadding = target.strokeWidth / (target.strokeUniform ? target.scaleX : 1),
      multiplier = isTransformCentered(transform) ? 2 : 1,
      oldWidth = target.width,
      newWidth = Math.abs(localPoint.x * multiplier / target.scaleX) - strokePadding;
    target.set('width', Math.max(newWidth, 1));
    //  check against actual target width in case `newWidth` was rejected
    return oldWidth !== target.width;
  }
  return false;
};
const changeWidth = wrapWithFireEvent(RESIZING, wrapWithFixedAnchor(changeObjectWidth));

/**
 * Render a round control, as per fabric features.
 * This function is written to respect object properties like transparentCorners, cornerSize
 * cornerColor, cornerStrokeColor
 * plus the addition of offsetY and offsetX.
 * @param {CanvasRenderingContext2D} ctx context to render on
 * @param {Number} left x coordinate where the control center should be
 * @param {Number} top y coordinate where the control center should be
 * @param {Object} styleOverride override for FabricObject controls style
 * @param {FabricObject} fabricObject the fabric object for which we are rendering controls
 */
function renderCircleControl(ctx, left, top, styleOverride, fabricObject) {
  styleOverride = styleOverride || {};
  const xSize = this.sizeX || styleOverride.cornerSize || fabricObject.cornerSize,
    ySize = this.sizeY || styleOverride.cornerSize || fabricObject.cornerSize,
    transparentCorners = typeof styleOverride.transparentCorners !== 'undefined' ? styleOverride.transparentCorners : fabricObject.transparentCorners,
    methodName = transparentCorners ? STROKE : FILL,
    stroke = !transparentCorners && (styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor);
  let myLeft = left,
    myTop = top,
    size;
  ctx.save();
  ctx.fillStyle = styleOverride.cornerColor || fabricObject.cornerColor || '';
  ctx.strokeStyle = styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor || '';
  // TODO: use proper ellipse code.
  if (xSize > ySize) {
    size = xSize;
    ctx.scale(1.0, ySize / xSize);
    myTop = top * xSize / ySize;
  } else if (ySize > xSize) {
    size = ySize;
    ctx.scale(xSize / ySize, 1.0);
    myLeft = left * ySize / xSize;
  } else {
    size = xSize;
  }
  ctx.beginPath();
  ctx.arc(myLeft, myTop, size / 2, 0, twoMathPi, false);
  ctx[methodName]();
  if (stroke) {
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Render a square control, as per fabric features.
 * This function is written to respect object properties like transparentCorners, cornerSize
 * cornerColor, cornerStrokeColor
 * plus the addition of offsetY and offsetX.
 * @param {CanvasRenderingContext2D} ctx context to render on
 * @param {Number} left x coordinate where the control center should be
 * @param {Number} top y coordinate where the control center should be
 * @param {Object} styleOverride override for FabricObject controls style
 * @param {FabricObject} fabricObject the fabric object for which we are rendering controls
 */
function renderSquareControl(ctx, left, top, styleOverride, fabricObject) {
  styleOverride = styleOverride || {};
  const xSize = this.sizeX || styleOverride.cornerSize || fabricObject.cornerSize,
    ySize = this.sizeY || styleOverride.cornerSize || fabricObject.cornerSize,
    transparentCorners = typeof styleOverride.transparentCorners !== 'undefined' ? styleOverride.transparentCorners : fabricObject.transparentCorners,
    methodName = transparentCorners ? STROKE : FILL,
    stroke = !transparentCorners && (styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor),
    xSizeBy2 = xSize / 2,
    ySizeBy2 = ySize / 2;
  ctx.save();
  ctx.fillStyle = styleOverride.cornerColor || fabricObject.cornerColor || '';
  ctx.strokeStyle = styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor || '';
  ctx.translate(left, top);
  //  angle is relative to canvas plane
  const angle = fabricObject.getTotalAngle();
  ctx.rotate(degreesToRadians(angle));
  // this does not work, and fixed with ( && ) does not make sense.
  // to have real transparent corners we need the controls on upperCanvas
  // transparentCorners || ctx.clearRect(-xSizeBy2, -ySizeBy2, xSize, ySize);
  ctx[`${methodName}Rect`](-xSizeBy2, -ySizeBy2, xSize, ySize);
  if (stroke) {
    ctx.strokeRect(-xSizeBy2, -ySizeBy2, xSize, ySize);
  }
  ctx.restore();
}

class Control {
  constructor(options) {
    /**
     * keep track of control visibility.
     * mainly for backward compatibility.
     * if you do not want to see a control, you can remove it
     * from the control set.
     * @type {Boolean}
     * @default true
     */
    _defineProperty(this, "visible", true);
    /**
     * Name of the action that the control will likely execute.
     * This is optional. FabricJS uses to identify what the user is doing for some
     * extra optimizations. If you are writing a custom control and you want to know
     * somewhere else in the code what is going on, you can use this string here.
     * you can also provide a custom getActionName if your control run multiple actions
     * depending on some external state.
     * default to scale since is the most common, used on 4 corners by default
     * @type {String}
     * @default 'scale'
     */
    _defineProperty(this, "actionName", SCALE);
    /**
     * Drawing angle of the control.
     * NOT used for now, but name marked as needed for internal logic
     * example: to reuse the same drawing function for different rotated controls
     * @type {Number}
     * @default 0
     */
    _defineProperty(this, "angle", 0);
    /**
     * Relative position of the control. X
     * 0,0 is the center of the Object, while -0.5 (left) or 0.5 (right) are the extremities
     * of the bounding box.
     * @type {Number}
     * @default 0
     */
    _defineProperty(this, "x", 0);
    /**
     * Relative position of the control. Y
     * 0,0 is the center of the Object, while -0.5 (top) or 0.5 (bottom) are the extremities
     * of the bounding box.
     * @type {Number}
     * @default 0
     */
    _defineProperty(this, "y", 0);
    /**
     * Horizontal offset of the control from the defined position. In pixels
     * Positive offset moves the control to the right, negative to the left.
     * It used when you want to have position of control that does not scale with
     * the bounding box. Example: rotation control is placed at x:0, y: 0.5 on
     * the boundind box, with an offset of 30 pixels vertically. Those 30 pixels will
     * stay 30 pixels no matter how the object is big. Another example is having 2
     * controls in the corner, that stay in the same position when the object scale.
     * of the bounding box.
     * @type {Number}
     * @default 0
     */
    _defineProperty(this, "offsetX", 0);
    /**
     * Vertical offset of the control from the defined position. In pixels
     * Positive offset moves the control to the bottom, negative to the top.
     * @type {Number}
     * @default 0
     */
    _defineProperty(this, "offsetY", 0);
    /**
     * Sets the length of the control. If null, defaults to object's cornerSize.
     * Expects both sizeX and sizeY to be set when set.
     * @type {?Number}
     * @default null
     */
    _defineProperty(this, "sizeX", 0);
    /**
     * Sets the height of the control. If null, defaults to object's cornerSize.
     * Expects both sizeX and sizeY to be set when set.
     * @type {?Number}
     * @default null
     */
    _defineProperty(this, "sizeY", 0);
    /**
     * Sets the length of the touch area of the control. If null, defaults to object's touchCornerSize.
     * Expects both touchSizeX and touchSizeY to be set when set.
     * @type {?Number}
     * @default null
     */
    _defineProperty(this, "touchSizeX", 0);
    /**
     * Sets the height of the touch area of the control. If null, defaults to object's touchCornerSize.
     * Expects both touchSizeX and touchSizeY to be set when set.
     * @type {?Number}
     * @default null
     */
    _defineProperty(this, "touchSizeY", 0);
    /**
     * Css cursor style to display when the control is hovered.
     * if the method `cursorStyleHandler` is provided, this property is ignored.
     * @type {String}
     * @default 'crosshair'
     */
    _defineProperty(this, "cursorStyle", 'crosshair');
    /**
     * If controls has an offsetY or offsetX, draw a line that connects
     * the control to the bounding box
     * @type {Boolean}
     * @default false
     */
    _defineProperty(this, "withConnection", false);
    Object.assign(this, options);
  }

  /**
   * The control actionHandler, provide one to handle action ( control being moved )
   * @param {Event} eventData the native mouse event
   * @param {Transform} transformData properties of the current transform
   * @param {Number} x x position of the cursor
   * @param {Number} y y position of the cursor
   * @return {Boolean} true if the action/event modified the object
   */

  /**
   * The control handler for mouse down, provide one to handle mouse down on control
   * @param {Event} eventData the native mouse event
   * @param {Transform} transformData properties of the current transform
   * @param {Number} x x position of the cursor
   * @param {Number} y y position of the cursor
   * @return {Boolean} true if the action/event modified the object
   */

  /**
   * The control mouseUpHandler, provide one to handle an effect on mouse up.
   * @param {Event} eventData the native mouse event
   * @param {Transform} transformData properties of the current transform
   * @param {Number} x x position of the cursor
   * @param {Number} y y position of the cursor
   * @return {Boolean} true if the action/event modified the object
   */

  shouldActivate(controlKey, fabricObject, pointer, _ref) {
    var _fabricObject$canvas;
    let {
      tl,
      tr,
      br,
      bl
    } = _ref;
    // TODO: locking logic can be handled here instead of in the control handler logic
    return ((_fabricObject$canvas = fabricObject.canvas) === null || _fabricObject$canvas === void 0 ? void 0 : _fabricObject$canvas.getActiveObject()) === fabricObject && fabricObject.isControlVisible(controlKey) && Intersection.isPointInPolygon(pointer, [tl, tr, br, bl]);
  }

  /**
   * Returns control actionHandler
   * @param {Event} eventData the native mouse event
   * @param {FabricObject} fabricObject on which the control is displayed
   * @param {Control} control control for which the action handler is being asked
   * @return {Function} the action handler
   */
  getActionHandler(eventData, fabricObject, control) {
    return this.actionHandler;
  }

  /**
   * Returns control mouseDown handler
   * @param {Event} eventData the native mouse event
   * @param {FabricObject} fabricObject on which the control is displayed
   * @param {Control} control control for which the action handler is being asked
   * @return {Function} the action handler
   */
  getMouseDownHandler(eventData, fabricObject, control) {
    return this.mouseDownHandler;
  }

  /**
   * Returns control mouseUp handler.
   * During actions the fabricObject or the control can be of different obj
   * @param {Event} eventData the native mouse event
   * @param {FabricObject} fabricObject on which the control is displayed
   * @param {Control} control control for which the action handler is being asked
   * @return {Function} the action handler
   */
  getMouseUpHandler(eventData, fabricObject, control) {
    return this.mouseUpHandler;
  }

  /**
   * Returns control cursorStyle for css using cursorStyle. If you need a more elaborate
   * function you can pass one in the constructor
   * the cursorStyle property
   * @param {Event} eventData the native mouse event
   * @param {Control} control the current control ( likely this)
   * @param {FabricObject} object on which the control is displayed
   * @return {String}
   */
  cursorStyleHandler(eventData, control, fabricObject, coord) {
    return control.cursorStyle;
  }

  /**
   * Returns the action name. The basic implementation just return the actionName property.
   * @param {Event} eventData the native mouse event
   * @param {Control} control the current control ( likely this)
   * @param {FabricObject} object on which the control is displayed
   * @return {String}
   */
  getActionName(eventData, control, fabricObject) {
    return control.actionName;
  }

  /**
   * Returns controls visibility
   * @param {FabricObject} object on which the control is displayed
   * @param {String} controlKey key where the control is memorized on the
   * @return {Boolean}
   */
  getVisibility(fabricObject, controlKey) {
    var _fabricObject$_contro, _fabricObject$_contro2;
    return (_fabricObject$_contro = (_fabricObject$_contro2 = fabricObject._controlsVisibility) === null || _fabricObject$_contro2 === void 0 ? void 0 : _fabricObject$_contro2[controlKey]) !== null && _fabricObject$_contro !== void 0 ? _fabricObject$_contro : this.visible;
  }

  /**
   * Sets controls visibility
   * @param {Boolean} visibility for the object
   * @return {Void}
   */
  setVisibility(visibility, name, fabricObject) {
    this.visible = visibility;
  }
  positionHandler(dim, finalMatrix, fabricObject, currentControl) {
    return new Point(this.x * dim.x + this.offsetX, this.y * dim.y + this.offsetY).transform(finalMatrix);
  }

  /**
   * Returns the coords for this control based on object values.
   * @param {Number} objectAngle angle from the fabric object holding the control
   * @param {Number} objectCornerSize cornerSize from the fabric object holding the control (or touchCornerSize if
   *   isTouch is true)
   * @param {Number} centerX x coordinate where the control center should be
   * @param {Number} centerY y coordinate where the control center should be
   * @param {boolean} isTouch true if touch corner, false if normal corner
   */
  calcCornerCoords(angle, objectCornerSize, centerX, centerY, isTouch, fabricObject) {
    const t = multiplyTransformMatrixArray([createTranslateMatrix(centerX, centerY), createRotateMatrix({
      angle
    }), createScaleMatrix((isTouch ? this.touchSizeX : this.sizeX) || objectCornerSize, (isTouch ? this.touchSizeY : this.sizeY) || objectCornerSize)]);
    return {
      tl: new Point(-0.5, -0.5).transform(t),
      tr: new Point(0.5, -0.5).transform(t),
      br: new Point(0.5, 0.5).transform(t),
      bl: new Point(-0.5, 0.5).transform(t)
    };
  }

  /**
   * Render function for the control.
   * When this function runs the context is unscaled. unrotate. Just retina scaled.
   * all the functions will have to translate to the point left,top before starting Drawing
   * if they want to draw a control where the position is detected.
   * left and top are the result of the positionHandler function
   * @param {RenderingContext2D} ctx the context where the control will be drawn
   * @param {Number} left position of the canvas where we are about to render the control.
   * @param {Number} top position of the canvas where we are about to render the control.
   * @param {Object} styleOverride
   * @param {FabricObject} fabricObject the object where the control is about to be rendered
   */
  render(ctx, left, top, styleOverride, fabricObject) {
    styleOverride = styleOverride || {};
    switch (styleOverride.cornerStyle || fabricObject.cornerStyle) {
      case 'circle':
        renderCircleControl.call(this, ctx, left, top, styleOverride, fabricObject);
        break;
      default:
        renderSquareControl.call(this, ctx, left, top, styleOverride, fabricObject);
    }
  }
}

/**
 * Find the correct style for the control that is used for rotation.
 * this function is very simple and it just take care of not-allowed or standard cursor
 * @param {Event} eventData the javascript event that is causing the scale
 * @param {Control} control the control that is interested in the action
 * @param {FabricObject} fabricObject the fabric object that is interested in the action
 * @return {String} a valid css string for the cursor
 */
const rotationStyleHandler = (eventData, control, fabricObject) => {
  if (fabricObject.lockRotation) {
    return NOT_ALLOWED_CURSOR;
  }
  return control.cursorStyle;
};

/**
 * Action handler for rotation and snapping, without anchor point.
 * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 * @private
 */
const rotateObjectWithSnapping = (eventData, _ref, x, y) => {
  let {
    target,
    ex,
    ey,
    theta,
    originX,
    originY
  } = _ref;
  const pivotPoint = target.getPositionByOrigin(originX, originY);
  if (isLocked(target, 'lockRotation')) {
    return false;
  }
  const lastAngle = Math.atan2(ey - pivotPoint.y, ex - pivotPoint.x),
    curAngle = Math.atan2(y - pivotPoint.y, x - pivotPoint.x);
  let angle = radiansToDegrees(curAngle - lastAngle + theta);
  if (target.snapAngle && target.snapAngle > 0) {
    const snapAngle = target.snapAngle,
      snapThreshold = target.snapThreshold || snapAngle,
      rightAngleLocked = Math.ceil(angle / snapAngle) * snapAngle,
      leftAngleLocked = Math.floor(angle / snapAngle) * snapAngle;
    if (Math.abs(angle - leftAngleLocked) < snapThreshold) {
      angle = leftAngleLocked;
    } else if (Math.abs(angle - rightAngleLocked) < snapThreshold) {
      angle = rightAngleLocked;
    }
  }

  // normalize angle to positive value
  if (angle < 0) {
    angle = 360 + angle;
  }
  angle %= 360;
  const hasRotated = target.angle !== angle;
  // TODO: why aren't we using set?
  target.angle = angle;
  return hasRotated;
};
const rotationWithSnapping = wrapWithFireEvent(ROTATING, wrapWithFixedAnchor(rotateObjectWithSnapping));

/**
 * Inspect event and fabricObject properties to understand if the scaling action
 * @param {Event} eventData from the user action
 * @param {FabricObject} fabricObject the fabric object about to scale
 * @return {Boolean} true if scale is proportional
 */
function scaleIsProportional(eventData, fabricObject) {
  const canvas = fabricObject.canvas,
    uniformIsToggled = eventData[canvas.uniScaleKey];
  return canvas.uniformScaling && !uniformIsToggled || !canvas.uniformScaling && uniformIsToggled;
}

/**
 * Inspect fabricObject to understand if the current scaling action is allowed
 * @param {FabricObject} fabricObject the fabric object about to scale
 * @param {String} by 'x' or 'y' or ''
 * @param {Boolean} scaleProportionally true if we are trying to scale proportionally
 * @return {Boolean} true if scaling is not allowed at current conditions
 */
function scalingIsForbidden(fabricObject, by, scaleProportionally) {
  const lockX = isLocked(fabricObject, 'lockScalingX'),
    lockY = isLocked(fabricObject, 'lockScalingY');
  if (lockX && lockY) {
    return true;
  }
  if (!by && (lockX || lockY) && scaleProportionally) {
    return true;
  }
  if (lockX && by === 'x') {
    return true;
  }
  if (lockY && by === 'y') {
    return true;
  }
  // code crashes because of a division by 0 if a 0 sized object is scaled
  // forbid to prevent scaling to happen. ISSUE-9475
  const {
    width,
    height,
    strokeWidth
  } = fabricObject;
  if (width === 0 && strokeWidth === 0 && by !== 'y') {
    return true;
  }
  if (height === 0 && strokeWidth === 0 && by !== 'x') {
    return true;
  }
  return false;
}
const scaleMap = ['e', 'se', 's', 'sw', 'w', 'nw', 'n', 'ne', 'e'];

/**
 * return the correct cursor style for the scale action
 * @param {Event} eventData the javascript event that is causing the scale
 * @param {Control} control the control that is interested in the action
 * @param {FabricObject} fabricObject the fabric object that is interested in the action
 * @return {String} a valid css string for the cursor
 */
const scaleCursorStyleHandler = (eventData, control, fabricObject, coord) => {
  const scaleProportionally = scaleIsProportional(eventData, fabricObject),
    by = control.x !== 0 && control.y === 0 ? 'x' : control.x === 0 && control.y !== 0 ? 'y' : '';
  if (scalingIsForbidden(fabricObject, by, scaleProportionally)) {
    return NOT_ALLOWED_CURSOR;
  }
  const n = findCornerQuadrant(fabricObject, control, coord);
  return `${scaleMap[n]}-resize`;
};

/**
 * Basic scaling logic, reused with different constrain for scaling X,Y, freely or equally.
 * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @param {Object} options additional information for scaling
 * @param {String} options.by 'x', 'y', 'equally' or '' to indicate type of scaling
 * @return {Boolean} true if some change happened
 * @private
 */
function scaleObject(eventData, transform, x, y) {
  let options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  const target = transform.target,
    by = options.by,
    scaleProportionally = scaleIsProportional(eventData, target),
    forbidScaling = scalingIsForbidden(target, by, scaleProportionally);
  let newPoint, scaleX, scaleY, dim, signX, signY;
  if (forbidScaling) {
    return false;
  }
  if (transform.gestureScale) {
    scaleX = transform.scaleX * transform.gestureScale;
    scaleY = transform.scaleY * transform.gestureScale;
  } else {
    newPoint = getLocalPoint(transform, transform.originX, transform.originY, x, y);
    // use of sign: We use sign to detect change of direction of an action. sign usually change when
    // we cross the origin point with the mouse. So a scale flip for example. There is an issue when scaling
    // by center and scaling using one middle control ( default: mr, mt, ml, mb), the mouse movement can easily
    // cross many time the origin point and flip the object. so we need a way to filter out the noise.
    // This ternary here should be ok to filter out X scaling when we want Y only and vice versa.
    signX = by !== 'y' ? Math.sign(newPoint.x || transform.signX || 1) : 1;
    signY = by !== 'x' ? Math.sign(newPoint.y || transform.signY || 1) : 1;
    if (!transform.signX) {
      transform.signX = signX;
    }
    if (!transform.signY) {
      transform.signY = signY;
    }
    if (isLocked(target, 'lockScalingFlip') && (transform.signX !== signX || transform.signY !== signY)) {
      return false;
    }
    dim = target._getTransformedDimensions();
    // missing detection of flip and logic to switch the origin
    if (scaleProportionally && !by) {
      // uniform scaling
      const distance = Math.abs(newPoint.x) + Math.abs(newPoint.y),
        {
          original
        } = transform,
        originalDistance = Math.abs(dim.x * original.scaleX / target.scaleX) + Math.abs(dim.y * original.scaleY / target.scaleY),
        scale = distance / originalDistance;
      scaleX = original.scaleX * scale;
      scaleY = original.scaleY * scale;
    } else {
      scaleX = Math.abs(newPoint.x * target.scaleX / dim.x);
      scaleY = Math.abs(newPoint.y * target.scaleY / dim.y);
    }
    // if we are scaling by center, we need to double the scale
    if (isTransformCentered(transform)) {
      scaleX *= 2;
      scaleY *= 2;
    }
    if (transform.signX !== signX && by !== 'y') {
      transform.originX = invertOrigin(transform.originX);
      scaleX *= -1;
      transform.signX = signX;
    }
    if (transform.signY !== signY && by !== 'x') {
      transform.originY = invertOrigin(transform.originY);
      scaleY *= -1;
      transform.signY = signY;
    }
  }
  // minScale is taken care of in the setter.
  const oldScaleX = target.scaleX,
    oldScaleY = target.scaleY;
  if (!by) {
    !isLocked(target, 'lockScalingX') && target.set(SCALE_X, scaleX);
    !isLocked(target, 'lockScalingY') && target.set(SCALE_Y, scaleY);
  } else {
    // forbidden cases already handled on top here.
    by === 'x' && target.set(SCALE_X, scaleX);
    by === 'y' && target.set(SCALE_Y, scaleY);
  }
  return oldScaleX !== target.scaleX || oldScaleY !== target.scaleY;
}

/**
 * Generic scaling logic, to scale from corners either equally or freely.
 * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
const scaleObjectFromCorner = (eventData, transform, x, y) => {
  return scaleObject(eventData, transform, x, y);
};

/**
 * Scaling logic for the X axis.
 * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
const scaleObjectX = (eventData, transform, x, y) => {
  return scaleObject(eventData, transform, x, y, {
    by: 'x'
  });
};

/**
 * Scaling logic for the Y axis.
 * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
const scaleObjectY = (eventData, transform, x, y) => {
  return scaleObject(eventData, transform, x, y, {
    by: 'y'
  });
};
const scalingEqually = wrapWithFireEvent(SCALING, wrapWithFixedAnchor(scaleObjectFromCorner));
const scalingX = wrapWithFireEvent(SCALING, wrapWithFixedAnchor(scaleObjectX));
const scalingY = wrapWithFireEvent(SCALING, wrapWithFixedAnchor(scaleObjectY));

const AXIS_KEYS = {
  x: {
    counterAxis: 'y',
    scale: SCALE_X,
    skew: SKEW_X,
    lockSkewing: 'lockSkewingX',
    origin: 'originX',
    flip: 'flipX'
  },
  y: {
    counterAxis: 'x',
    scale: SCALE_Y,
    skew: SKEW_Y,
    lockSkewing: 'lockSkewingY',
    origin: 'originY',
    flip: 'flipY'
  }
};
const skewMap = ['ns', 'nesw', 'ew', 'nwse'];

/**
 * return the correct cursor style for the skew action
 * @param {Event} eventData the javascript event that is causing the scale
 * @param {Control} control the control that is interested in the action
 * @param {FabricObject} fabricObject the fabric object that is interested in the action
 * @return {String} a valid css string for the cursor
 */
const skewCursorStyleHandler = (eventData, control, fabricObject, coord) => {
  if (control.x !== 0 && isLocked(fabricObject, 'lockSkewingY')) {
    return NOT_ALLOWED_CURSOR;
  }
  if (control.y !== 0 && isLocked(fabricObject, 'lockSkewingX')) {
    return NOT_ALLOWED_CURSOR;
  }
  const n = findCornerQuadrant(fabricObject, control, coord) % 4;
  return `${skewMap[n]}-resize`;
};

/**
 * Since skewing is applied before scaling, calculations are done in a scaleless plane
 * @see https://github.com/fabricjs/fabric.js/pull/8380
 */
function skewObject(axis, _ref, pointer) {
  let {
    target,
    ex,
    ey,
    skewingSide,
    ...transform
  } = _ref;
  const {
      skew: skewKey
    } = AXIS_KEYS[axis],
    offset = pointer.subtract(new Point(ex, ey)).divide(new Point(target.scaleX, target.scaleY))[axis],
    skewingBefore = target[skewKey],
    skewingStart = transform[skewKey],
    shearingStart = Math.tan(degreesToRadians(skewingStart)),
    // let a, b be the size of target
    // let a' be the value of a after applying skewing
    // then:
    // a' = a + b * skewA => skewA = (a' - a) / b
    // the value b is tricky since skewY is applied before skewX
    b = axis === 'y' ? target._getTransformedDimensions({
      scaleX: 1,
      scaleY: 1,
      // since skewY is applied before skewX, b (=width) is not affected by skewX
      skewX: 0
    }).x : target._getTransformedDimensions({
      scaleX: 1,
      scaleY: 1
    }).y;
  const shearing = 2 * offset * skewingSide /
   // we max out fractions to safeguard from asymptotic behavior
  Math.max(b, 1) +
  // add starting state
  shearingStart;
  const skewing = radiansToDegrees(Math.atan(shearing));
  target.set(skewKey, skewing);
  const changed = skewingBefore !== target[skewKey];
  if (changed && axis === 'y') {
    // we don't want skewing to affect scaleX
    // so we factor it by the inverse skewing diff to make it seem unchanged to the viewer
    const {
        skewX,
        scaleX
      } = target,
      dimBefore = target._getTransformedDimensions({
        skewY: skewingBefore
      }),
      dimAfter = target._getTransformedDimensions(),
      compensationFactor = skewX !== 0 ? dimBefore.x / dimAfter.x : 1;
    compensationFactor !== 1 && target.set(SCALE_X, compensationFactor * scaleX);
  }
  return changed;
}

/**
 * Wrapped Action handler for skewing on a given axis, takes care of the
 * skew direction and determines the correct transform origin for the anchor point
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
function skewHandler(axis, eventData, transform, x, y) {
  const {
      target
    } = transform,
    {
      counterAxis,
      origin: originKey,
      lockSkewing: lockSkewingKey,
      skew: skewKey,
      flip: flipKey
    } = AXIS_KEYS[axis];
  if (isLocked(target, lockSkewingKey)) {
    return false;
  }
  const {
      origin: counterOriginKey,
      flip: counterFlipKey
    } = AXIS_KEYS[counterAxis],
    counterOriginFactor = resolveOrigin(transform[counterOriginKey]) * (target[counterFlipKey] ? -1 : 1),
    // if the counter origin is top/left (= -0.5) then we are skewing x/y values on the bottom/right side of target respectively.
    // if the counter origin is bottom/right (= 0.5) then we are skewing x/y values on the top/left side of target respectively.
    // skewing direction on the top/left side of target is OPPOSITE to the direction of the movement of the pointer,
    // so we factor skewing direction by this value.
    skewingSide = -Math.sign(counterOriginFactor) * (target[flipKey] ? -1 : 1),
    skewingDirection = (target[skewKey] === 0 &&
    // in case skewing equals 0 we use the pointer offset from target center to determine the direction of skewing
    getLocalPoint(transform, CENTER, CENTER, x, y)[axis] > 0 ||
    // in case target has skewing we use that as the direction
    target[skewKey] > 0 ? 1 : -1) * skewingSide,
    // anchor to the opposite side of the skewing direction
    // normalize value from [-1, 1] to origin value [0, 1]
    origin = -skewingDirection * 0.5 + 0.5;
  const finalHandler = wrapWithFireEvent(SKEWING, wrapWithFixedAnchor((eventData, transform, x, y) => skewObject(axis, transform, new Point(x, y))));
  return finalHandler(eventData, {
    ...transform,
    [originKey]: origin,
    skewingSide
  }, x, y);
}

/**
 * Wrapped Action handler for skewing on the X axis, takes care of the
 * skew direction and determines the correct transform origin for the anchor point
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
const skewHandlerX = (eventData, transform, x, y) => {
  return skewHandler('x', eventData, transform, x, y);
};

/**
 * Wrapped Action handler for skewing on the Y axis, takes care of the
 * skew direction and determines the correct transform origin for the anchor point
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
const skewHandlerY = (eventData, transform, x, y) => {
  return skewHandler('y', eventData, transform, x, y);
};

function isAltAction(eventData, target) {
  return eventData[target.canvas.altActionKey];
}

/**
 * Inspect event, control and fabricObject to return the correct action name
 * @param {Event} eventData the javascript event that is causing the scale
 * @param {Control} control the control that is interested in the action
 * @param {FabricObject} fabricObject the fabric object that is interested in the action
 * @return {String} an action name
 */
const scaleOrSkewActionName = (eventData, control, fabricObject) => {
  const isAlternative = isAltAction(eventData, fabricObject);
  if (control.x === 0) {
    // then is scaleY or skewX
    return isAlternative ? SKEW_X : SCALE_Y;
  }
  if (control.y === 0) {
    // then is scaleY or skewX
    return isAlternative ? SKEW_Y : SCALE_X;
  }
  return '';
};

/**
 * Combine skew and scale style handlers to cover fabric standard use case
 * @param {Event} eventData the javascript event that is causing the scale
 * @param {Control} control the control that is interested in the action
 * @param {FabricObject} fabricObject the fabric object that is interested in the action
 * @return {String} a valid css string for the cursor
 */
const scaleSkewCursorStyleHandler = (eventData, control, fabricObject, coord) => {
  return isAltAction(eventData, fabricObject) ? skewCursorStyleHandler(eventData, control, fabricObject, coord) : scaleCursorStyleHandler(eventData, control, fabricObject, coord);
};
/**
 * Composed action handler to either scale X or skew Y
 * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
const scalingXOrSkewingY = (eventData, transform, x, y) => {
  return isAltAction(eventData, transform.target) ? skewHandlerY(eventData, transform, x, y) : scalingX(eventData, transform, x, y);
};

/**
 * Composed action handler to either scale Y or skew X
 * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
const scalingYOrSkewingX = (eventData, transform, x, y) => {
  return isAltAction(eventData, transform.target) ? skewHandlerX(eventData, transform, x, y) : scalingY(eventData, transform, x, y);
};

// use this function if you want to generate new controls for every instance
const createObjectDefaultControls = () => ({
  ml: new Control({
    x: -0.5,
    y: 0,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionHandler: scalingXOrSkewingY,
    getActionName: scaleOrSkewActionName
  }),
  mr: new Control({
    x: 0.5,
    y: 0,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionHandler: scalingXOrSkewingY,
    getActionName: scaleOrSkewActionName
  }),
  mb: new Control({
    x: 0,
    y: 0.5,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionHandler: scalingYOrSkewingX,
    getActionName: scaleOrSkewActionName
  }),
  mt: new Control({
    x: 0,
    y: -0.5,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionHandler: scalingYOrSkewingX,
    getActionName: scaleOrSkewActionName
  }),
  tl: new Control({
    x: -0.5,
    y: -0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually
  }),
  tr: new Control({
    x: 0.5,
    y: -0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually
  }),
  bl: new Control({
    x: -0.5,
    y: 0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually
  }),
  br: new Control({
    x: 0.5,
    y: 0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: scalingEqually
  }),
  mtr: new Control({
    x: 0,
    y: -0.5,
    actionHandler: rotationWithSnapping,
    cursorStyleHandler: rotationStyleHandler,
    offsetY: -40,
    withConnection: true,
    actionName: ROTATE
  })
});
const createResizeControls = () => ({
  mr: new Control({
    x: 0.5,
    y: 0,
    actionHandler: changeWidth,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionName: RESIZING
  }),
  ml: new Control({
    x: -0.5,
    y: 0,
    actionHandler: changeWidth,
    cursorStyleHandler: scaleSkewCursorStyleHandler,
    actionName: RESIZING
  })
});
const createTextboxDefaultControls = () => ({
  ...createObjectDefaultControls(),
  ...createResizeControls()
});

class InteractiveFabricObject extends FabricObject$1 {
  static getDefaults() {
    return {
      ...super.getDefaults(),
      ...InteractiveFabricObject.ownDefaults
    };
  }

  /**
   * Constructor
   * @param {Object} [options] Options object
   */
  constructor(options) {
    super();
    Object.assign(this, this.constructor.createControls(), InteractiveFabricObject.ownDefaults);
    this.setOptions(options);
  }

  /**
   * Creates the default control object.
   * If you prefer to have on instance of controls shared among all objects
   * make this function return an empty object and add controls to the ownDefaults
   * @param {Object} [options] Options object
   */
  static createControls() {
    return {
      controls: createObjectDefaultControls()
    };
  }

  /**
   * Update width and height of the canvas for cache
   * returns true or false if canvas needed resize.
   * @private
   * @return {Boolean} true if the canvas has been resized
   */
  _updateCacheCanvas() {
    const targetCanvas = this.canvas;
    if (this.noScaleCache && targetCanvas && targetCanvas._currentTransform) {
      const transform = targetCanvas._currentTransform,
        target = transform.target,
        action = transform.action;
      if (this === target && action && action.startsWith(SCALE)) {
        return false;
      }
    }
    return super._updateCacheCanvas();
  }
  getActiveControl() {
    const key = this.__corner;
    return key ? {
      key,
      control: this.controls[key],
      coord: this.oCoords[key]
    } : undefined;
  }

  /**
   * Determines which corner is under the mouse cursor, represented by `pointer`.
   * This function returns a corner only if the object is the active one.
   * This is done to avoid selecting corner of non active object and activating transformations
   * rather than drag action. The default behavior of fabricJS is that if you want to transform
   * an object, first you select it to show the control set
   * @private
   * @param {Object} pointer The pointer indicating the mouse position
   * @param {boolean} forTouch indicates if we are looking for interaction area with a touch action
   * @return {String|Boolean} corner code (tl, tr, bl, br, etc.), or 0 if nothing is found.
   */
  findControl(pointer) {
    let forTouch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (!this.hasControls || !this.canvas) {
      return undefined;
    }
    this.__corner = undefined;
    const cornerEntries = Object.entries(this.oCoords);
    for (let i = cornerEntries.length - 1; i >= 0; i--) {
      const [key, corner] = cornerEntries[i];
      const control = this.controls[key];
      if (control.shouldActivate(key, this, pointer, forTouch ? corner.touchCorner : corner.corner)) {
        // this.canvas.contextTop.fillRect(pointer.x - 1, pointer.y - 1, 2, 2);
        this.__corner = key;
        return {
          key,
          control,
          coord: this.oCoords[key]
        };
      }
    }
    return undefined;
  }

  /**
   * Calculates the coordinates of the center of each control plus the corners of the control itself
   * This basically just delegates to each control positionHandler
   * WARNING: changing what is passed to positionHandler is a breaking change, since position handler
   * is a public api and should be done just if extremely necessary
   * @return {Record<string, TOCoord>}
   */
  calcOCoords() {
    const vpt = this.getViewportTransform(),
      center = this.getCenterPoint(),
      tMatrix = createTranslateMatrix(center.x, center.y),
      rMatrix = createRotateMatrix({
        angle: this.getTotalAngle() - (!!this.group && this.flipX ? 180 : 0)
      }),
      positionMatrix = multiplyTransformMatrices(tMatrix, rMatrix),
      startMatrix = multiplyTransformMatrices(vpt, positionMatrix),
      finalMatrix = multiplyTransformMatrices(startMatrix, [1 / vpt[0], 0, 0, 1 / vpt[3], 0, 0]),
      transformOptions = this.group ? qrDecompose(this.calcTransformMatrix()) : undefined;
    // decomposing could bring negative scaling and `_calculateCurrentDimensions` can't take it
    if (transformOptions) {
      transformOptions.scaleX = Math.abs(transformOptions.scaleX);
      transformOptions.scaleY = Math.abs(transformOptions.scaleY);
    }
    const dim = this._calculateCurrentDimensions(transformOptions),
      coords = {};
    this.forEachControl((control, key) => {
      const position = control.positionHandler(dim, finalMatrix, this, control);
      // coords[key] are sometimes used as points. Those are points to which we add
      // the property corner and touchCorner from `_calcCornerCoords`.
      // don't remove this assign for an object spread.
      coords[key] = Object.assign(position, this._calcCornerCoords(control, position));
    });

    // debug code
    /*
      const canvas = this.canvas;
      setTimeout(function () {
      if (!canvas) return;
        canvas.contextTop.clearRect(0, 0, 700, 700);
        canvas.contextTop.fillStyle = 'green';
        Object.keys(coords).forEach(function(key) {
          const control = coords[key];
          canvas.contextTop.fillRect(control.x, control.y, 3, 3);
        });
      } 50);
    */
    return coords;
  }

  /**
   * Sets the coordinates that determine the interaction area of each control
   * note: if we would switch to ROUND corner area, all of this would disappear.
   * everything would resolve to a single point and a pythagorean theorem for the distance
   * @todo evaluate simplification of code switching to circle interaction area at runtime
   * @private
   */
  _calcCornerCoords(control, position) {
    const angle = this.getTotalAngle();
    const corner = control.calcCornerCoords(angle, this.cornerSize, position.x, position.y, false, this);
    const touchCorner = control.calcCornerCoords(angle, this.touchCornerSize, position.x, position.y, true, this);
    return {
      corner,
      touchCorner
    };
  }

  /**
   * @override set controls' coordinates as well
   * See {@link https://github.com/fabricjs/fabric.js/wiki/When-to-call-setCoords} and {@link https://fabric5.fabricjs.com/fabric-gotchas}
   * @return {void}
   */
  setCoords() {
    super.setCoords();
    this.canvas && (this.oCoords = this.calcOCoords());
  }

  /**
   * Calls a function for each control. The function gets called,
   * with the control, the control's key and the object that is calling the iterator
   * @param {Function} fn function to iterate over the controls over
   */
  forEachControl(fn) {
    for (const i in this.controls) {
      fn(this.controls[i], i, this);
    }
  }

  /**
   * Draws a colored layer behind the object, inside its selection borders.
   * Requires public options: padding, selectionBackgroundColor
   * this function is called when the context is transformed
   * has checks to be skipped when the object is on a staticCanvas
   * @todo evaluate if make this disappear in favor of a pre-render hook for objects
   * this was added by Andrea Bogazzi to make possible some feature for work reasons
   * it seemed a good option, now is an edge case
   * @param {CanvasRenderingContext2D} ctx Context to draw on
   */
  drawSelectionBackground(ctx) {
    if (!this.selectionBackgroundColor || this.canvas && this.canvas._activeObject !== this) {
      return;
    }
    ctx.save();
    const center = this.getRelativeCenterPoint(),
      wh = this._calculateCurrentDimensions(),
      vpt = this.getViewportTransform();
    ctx.translate(center.x, center.y);
    ctx.scale(1 / vpt[0], 1 / vpt[3]);
    ctx.rotate(degreesToRadians(this.angle));
    ctx.fillStyle = this.selectionBackgroundColor;
    ctx.fillRect(-wh.x / 2, -wh.y / 2, wh.x, wh.y);
    ctx.restore();
  }

  /**
   * @public override this function in order to customize the drawing of the control box, e.g. rounded corners, different border style.
   * @param {CanvasRenderingContext2D} ctx ctx is rotated and translated so that (0,0) is at object's center
   * @param {Point} size the control box size used
   */
  strokeBorders(ctx, size) {
    ctx.strokeRect(-size.x / 2, -size.y / 2, size.x, size.y);
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to draw on
   * @param {Point} size
   * @param {TStyleOverride} styleOverride object to override the object style
   */
  _drawBorders(ctx, size) {
    let styleOverride = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    const options = {
      hasControls: this.hasControls,
      borderColor: this.borderColor,
      borderDashArray: this.borderDashArray,
      ...styleOverride
    };
    ctx.save();
    ctx.strokeStyle = options.borderColor;
    this._setLineDash(ctx, options.borderDashArray);
    this.strokeBorders(ctx, size);
    options.hasControls && this.drawControlsConnectingLines(ctx, size);
    ctx.restore();
  }

  /**
   * Renders controls and borders for the object
   * the context here is not transformed
   * @todo move to interactivity
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {TStyleOverride} [styleOverride] properties to override the object style
   */
  _renderControls(ctx) {
    let styleOverride = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const {
      hasBorders,
      hasControls
    } = this;
    const styleOptions = {
      hasBorders,
      hasControls,
      ...styleOverride
    };
    const vpt = this.getViewportTransform(),
      shouldDrawBorders = styleOptions.hasBorders,
      shouldDrawControls = styleOptions.hasControls;
    const matrix = multiplyTransformMatrices(vpt, this.calcTransformMatrix());
    const options = qrDecompose(matrix);
    ctx.save();
    ctx.translate(options.translateX, options.translateY);
    ctx.lineWidth = this.borderScaleFactor; // 1 * this.borderScaleFactor;
    // since interactive groups have been introduced, an object could be inside a group and needing controls
    // the following equality check `this.group === this.parent` covers:
    // object without a group ( undefined === undefined )
    // object inside a group
    // excludes object inside a group but multi selected since group and parent will differ in value
    if (this.group === this.parent) {
      ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
    }
    if (this.flipX) {
      options.angle -= 180;
    }
    ctx.rotate(degreesToRadians(this.group ? options.angle : this.angle));
    shouldDrawBorders && this.drawBorders(ctx, options, styleOverride);
    shouldDrawControls && this.drawControls(ctx, styleOverride);
    ctx.restore();
  }

  /**
   * Draws borders of an object's bounding box.
   * Requires public properties: width, height
   * Requires public options: padding, borderColor
   * @param {CanvasRenderingContext2D} ctx Context to draw on
   * @param {object} options object representing current object parameters
   * @param {TStyleOverride} [styleOverride] object to override the object style
   */
  drawBorders(ctx, options, styleOverride) {
    let size;
    if (styleOverride && styleOverride.forActiveSelection || this.group) {
      const bbox = sizeAfterTransform(this.width, this.height, calcDimensionsMatrix(options)),
        stroke = !this.isStrokeAccountedForInDimensions() ? (this.strokeUniform ? new Point().scalarAdd(this.canvas ? this.canvas.getZoom() : 1) :
        // this is extremely confusing. options comes from the upper function
        // and is the qrDecompose of a matrix that takes in account zoom too
        new Point(options.scaleX, options.scaleY)).scalarMultiply(this.strokeWidth) : ZERO;
      size = bbox.add(stroke).scalarAdd(this.borderScaleFactor).scalarAdd(this.padding * 2);
    } else {
      size = this._calculateCurrentDimensions().scalarAdd(this.borderScaleFactor);
    }
    this._drawBorders(ctx, size, styleOverride);
  }

  /**
   * Draws lines from a borders of an object's bounding box to controls that have `withConnection` property set.
   * Requires public properties: width, height
   * Requires public options: padding, borderColor
   * @param {CanvasRenderingContext2D} ctx Context to draw on
   * @param {Point} size object size x = width, y = height
   */
  drawControlsConnectingLines(ctx, size) {
    let shouldStroke = false;
    ctx.beginPath();
    this.forEachControl((control, key) => {
      // in this moment, the ctx is centered on the object.
      // width and height of the above function are the size of the bbox.
      if (control.withConnection && control.getVisibility(this, key)) {
        // reset movement for each control
        shouldStroke = true;
        ctx.moveTo(control.x * size.x, control.y * size.y);
        ctx.lineTo(control.x * size.x + control.offsetX, control.y * size.y + control.offsetY);
      }
    });
    shouldStroke && ctx.stroke();
  }

  /**
   * Draws corners of an object's bounding box.
   * Requires public properties: width, height
   * Requires public options: cornerSize, padding
   * Be aware that since fabric 6.0 this function does not call setCoords anymore.
   * setCoords needs to be called manually if the object of which we are rendering controls
   * is outside the standard selection and transform process.
   * @param {CanvasRenderingContext2D} ctx Context to draw on
   * @param {ControlRenderingStyleOverride} styleOverride object to override the object style
   */
  drawControls(ctx) {
    let styleOverride = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    ctx.save();
    const retinaScaling = this.getCanvasRetinaScaling();
    const {
      cornerStrokeColor,
      cornerDashArray,
      cornerColor
    } = this;
    const options = {
      cornerStrokeColor,
      cornerDashArray,
      cornerColor,
      ...styleOverride
    };
    ctx.setTransform(retinaScaling, 0, 0, retinaScaling, 0, 0);
    ctx.strokeStyle = ctx.fillStyle = options.cornerColor;
    if (!this.transparentCorners) {
      ctx.strokeStyle = options.cornerStrokeColor;
    }
    this._setLineDash(ctx, options.cornerDashArray);
    this.forEachControl((control, key) => {
      if (control.getVisibility(this, key)) {
        const p = this.oCoords[key];
        control.render(ctx, p.x, p.y, options, this);
      }
    });
    ctx.restore();
  }

  /**
   * Returns true if the specified control is visible, false otherwise.
   * @param {string} controlKey The key of the control. Possible values are usually 'tl', 'tr', 'br', 'bl', 'ml', 'mt', 'mr', 'mb', 'mtr',
   * but since the control api allow for any control name, can be any string.
   * @returns {boolean} true if the specified control is visible, false otherwise
   */
  isControlVisible(controlKey) {
    return this.controls[controlKey] && this.controls[controlKey].getVisibility(this, controlKey);
  }

  /**
   * Sets the visibility of the specified control.
   * please do not use.
   * @param {String} controlKey The key of the control. Possible values are 'tl', 'tr', 'br', 'bl', 'ml', 'mt', 'mr', 'mb', 'mtr'.
   * but since the control api allow for any control name, can be any string.
   * @param {Boolean} visible true to set the specified control visible, false otherwise
   * @todo discuss this overlap of priority here with the team. Andrea Bogazzi for details
   */
  setControlVisible(controlKey, visible) {
    if (!this._controlsVisibility) {
      this._controlsVisibility = {};
    }
    this._controlsVisibility[controlKey] = visible;
  }

  /**
   * Sets the visibility state of object controls, this is just a bulk option for setControlVisible;
   * @param {Record<string, boolean>} [options] with an optional key per control
   * example: {Boolean} [options.bl] true to enable the bottom-left control, false to disable it
   */
  setControlsVisibility() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    Object.entries(options).forEach(_ref => {
      let [controlKey, visibility] = _ref;
      return this.setControlVisible(controlKey, visibility);
    });
  }

  /**
   * Clears the canvas.contextTop in a specific area that corresponds to the object's bounding box
   * that is in the canvas.contextContainer.
   * This function is used to clear pieces of contextTop where we render ephemeral effects on top of the object.
   * Example: blinking cursor text selection, drag effects.
   * @todo discuss swapping restoreManually with a renderCallback, but think of async issues
   * @param {Boolean} [restoreManually] When true won't restore the context after clear, in order to draw something else.
   * @return {CanvasRenderingContext2D|undefined} canvas.contextTop that is either still transformed
   * with the object transformMatrix, or restored to neutral transform
   */
  clearContextTop(restoreManually) {
    if (!this.canvas) {
      return;
    }
    const ctx = this.canvas.contextTop;
    if (!ctx) {
      return;
    }
    const v = this.canvas.viewportTransform;
    ctx.save();
    ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
    this.transform(ctx);
    // we add 4 pixel, to be sure to do not leave any pixel out
    const width = this.width + 4,
      height = this.height + 4;
    ctx.clearRect(-width / 2, -height / 2, width, height);
    restoreManually || ctx.restore();
    return ctx;
  }

  /**
   * This callback function is called every time _discardActiveObject or _setActiveObject
   * try to to deselect this object. If the function returns true, the process is cancelled
   * @param {Object} [_options] options sent from the upper functions
   * @param {TPointerEvent} [options.e] event if the process is generated by an event
   * @param {FabricObject} [options.object] next object we are setting as active, and reason why
   * this is being deselected
   */
  onDeselect(_options) {
    // implemented by sub-classes, as needed.
    return false;
  }

  /**
   * This callback function is called every time _discardActiveObject or _setActiveObject
   * try to to select this object. If the function returns true, the process is cancelled
   * @param {Object} [_options] options sent from the upper functions
   * @param {Event} [_options.e] event if the process is generated by an event
   */
  onSelect(_options) {
    // implemented by sub-classes, as needed.
    return false;
  }

  /**
   * Override to customize Drag behavior
   * Fired from {@link Canvas#_onMouseMove}
   * @returns true in order for the window to start a drag session
   */
  shouldStartDragging(_e) {
    return false;
  }

  /**
   * Override to customize Drag behavior\
   * Fired once a drag session has started
   * @returns true to handle the drag event
   */
  onDragStart(_e) {
    return false;
  }

  /**
   * Override to customize drag and drop behavior
   * @public
   * @param {DragEvent} _e
   * @returns {boolean} true if the object currently dragged can be dropped on the target
   */
  canDrop(_e) {
    return false;
  }

  /**
   * Override to customize drag and drop behavior
   * render a specific effect when an object is the source of a drag event
   * example: render the selection status for the part of text that is being dragged from a text object
   * @public
   * @param {DragEvent} _e
   */
  renderDragSourceEffect(_e) {
    // for subclasses
  }

  /**
   * Override to customize drag and drop behavior
   * render a specific effect when an object is the target of a drag event
   * used to show that the underly object can receive a drop, or to show how the
   * object will change when dropping. example: show the cursor where the text is about to be dropped
   * @public
   * @param {DragEvent} _e
   */
  renderDropTargetEffect(_e) {
    // for subclasses
  }
}
/**
 * The object's controls' position in viewport coordinates
 * Calculated by {@link Control#positionHandler} and {@link Control#calcCornerCoords}, depending on {@link padding}.
 * `corner/touchCorner` describe the 4 points forming the interactive area of the corner.
 * Used to draw and locate controls.
 */
/**
 * keeps the value of the last hovered corner during mouse move.
 * 0 is no corner, or 'mt', 'ml', 'mtr' etc..
 * It should be private, but there is no harm in using it as
 * a read-only property.
 * this isn't cleaned automatically. Non selected objects may have wrong values
 * @type [string]
 */
/**
 * a map of control visibility for this object.
 * this was left when controls were introduced to not break the api too much
 * this takes priority over the generic control visibility
 */
/**
 * holds the controls for the object.
 * controls are added by default_controls.js
 */
/**
 * internal boolean to signal the code that the object is
 * part of the move action.
 */
/**
 * A boolean used from the gesture module to keep tracking of a scaling
 * action when there is no scaling transform in place.
 * This is an edge case and is used twice in all codebase.
 * Probably added to keep track of some performance issues
 * @TODO use git blame to investigate why it was added
 * DON'T USE IT. WE WILL TRY TO REMOVE IT
 */
_defineProperty(InteractiveFabricObject, "ownDefaults", interactiveObjectDefaultValues);

/***
 * https://www.typescriptlang.org/docs/handbook/mixins.html#alternative-pattern
 */
function applyMixins(derivedCtor, constructors) {
  constructors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      name !== 'constructor' && Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null));
    });
  });
  return derivedCtor;
}

// TODO somehow we have to make a tree-shakeable import

// eslint-disable-next-line @typescript-eslint/no-empty-object-type

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class FabricObject extends InteractiveFabricObject {}
applyMixins(FabricObject, [FabricObjectSVGExportMixin]);
classRegistry.setClass(FabricObject);
classRegistry.setClass(FabricObject, 'object');

/**
 * Returns true if context has transparent pixel
 * at specified location (taking tolerance into account)
 * @param {CanvasRenderingContext2D} ctx context
 * @param {Number} x x coordinate in canvasElementCoordinate, not fabric space. integer
 * @param {Number} y y coordinate in canvasElementCoordinate, not fabric space. integer
 * @param {Number} tolerance Tolerance pixels around the point, not alpha tolerance, integer
 * @return {boolean} true if transparent
 */
const isTransparent = (ctx, x, y, tolerance) => {
  tolerance = Math.round(tolerance);
  const size = tolerance * 2 + 1;
  const {
    data
  } = ctx.getImageData(x - tolerance, y - tolerance, size, size);

  // Split image data - for tolerance > 1, pixelDataSize = 4;
  for (let i = 3; i < data.length; i += 4) {
    const alphaChannel = data[i];
    if (alphaChannel > 0) {
      return false;
    }
  }
  return true;
};

const findIndexRight = (array, predicate) => {
  for (let index = array.length - 1; index >= 0; index--) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
};

/**
 * @see https://github.com/fabricjs/fabric.js/pull/8344
 * @todo consider removing skewing from points before calculating stroke projection,
 * see https://github.com/fabricjs/fabric.js/commit/494a10ee2f8c2278ae9a55b20bf50cf6ee25b064#commitcomment-94751537
 */
class StrokeProjectionsBase {
  constructor(options) {
    this.options = options;
    this.strokeProjectionMagnitude = this.options.strokeWidth / 2;
    this.scale = new Point(this.options.scaleX, this.options.scaleY);
    this.strokeUniformScalar = this.options.strokeUniform ? new Point(1 / this.options.scaleX, 1 / this.options.scaleY) : new Point(1, 1);
  }

  /**
   * When the stroke is uniform, scaling affects the arrangement of points. So we must take it into account.
   */
  createSideVector(from, to) {
    const v = createVector(from, to);
    return this.options.strokeUniform ? v.multiply(this.scale) : v;
  }
  projectOrthogonally(from, to, magnitude) {
    return this.applySkew(from.add(this.calcOrthogonalProjection(from, to, magnitude)));
  }
  isSkewed() {
    return this.options.skewX !== 0 || this.options.skewY !== 0;
  }
  applySkew(point) {
    const p = new Point(point);
    // skewY must be applied before skewX as this distortion affects skewX calculation
    p.y += p.x * Math.tan(degreesToRadians(this.options.skewY));
    p.x += p.y * Math.tan(degreesToRadians(this.options.skewX));
    return p;
  }
  scaleUnitVector(unitVector, scalar) {
    return unitVector.multiply(this.strokeUniformScalar).scalarMultiply(scalar);
  }
}

const zeroVector = new Point();

/**
 * class in charge of finding projections for each type of line join
 * @see {@link [Closed path projections at #8344](https://github.com/fabricjs/fabric.js/pull/8344#2-closed-path)}
 *
 * - MDN:
 *   - https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin
 *   - https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linejoin
 * - Spec: https://svgwg.org/svg2-draft/painting.html#StrokeLinejoinProperty
 * - Playground to understand how the line joins works: https://hypertolosana.github.io/efficient-webgl-stroking/index.html
 * - View the calculated projections for each of the control points: https://codesandbox.io/s/project-stroke-points-with-context-to-trace-b8jc4j?file=/src/index.js
 *
 */
class StrokeLineJoinProjections extends StrokeProjectionsBase {
  static getOrthogonalRotationFactor(vector1, vector2) {
    const angle = vector2 ? calcAngleBetweenVectors(vector1, vector2) : calcVectorRotation(vector1);
    return Math.abs(angle) < halfPI ? -1 : 1;
  }
  constructor(A, B, C, options) {
    super(options);
    /**
     * The point being projected (the angle ∠BAC)
     */
    /**
     * The point before A
     */
    /**
     * The point after A
     */
    /**
     * The AB vector
     */
    _defineProperty(this, "AB", void 0);
    /**
     * The AC vector
     */
    _defineProperty(this, "AC", void 0);
    /**
     * The angle of A (∠BAC)
     */
    _defineProperty(this, "alpha", void 0);
    /**
     * The bisector of A (∠BAC)
     */
    _defineProperty(this, "bisector", void 0);
    this.A = new Point(A);
    this.B = new Point(B);
    this.C = new Point(C);
    this.AB = this.createSideVector(this.A, this.B);
    this.AC = this.createSideVector(this.A, this.C);
    this.alpha = calcAngleBetweenVectors(this.AB, this.AC);
    this.bisector = getUnitVector(
    // if AC is also the zero vector nothing will be projected
    // in that case the next point will handle the projection
    rotateVector(this.AB.eq(zeroVector) ? this.AC : this.AB, this.alpha / 2));
  }
  calcOrthogonalProjection(from, to) {
    let magnitude = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.strokeProjectionMagnitude;
    const vector = this.createSideVector(from, to);
    const orthogonalProjection = getOrthonormalVector(vector);
    const correctSide = StrokeLineJoinProjections.getOrthogonalRotationFactor(orthogonalProjection, this.bisector);
    return this.scaleUnitVector(orthogonalProjection, magnitude * correctSide);
  }

  /**
   * BEVEL
   * Calculation: the projection points are formed by the vector orthogonal to the vertex.
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#2-2-bevel
   */
  projectBevel() {
    const projections = [];
    // if `alpha` equals 0 or 2*PI, the projections are the same for `B` and `C`
    (this.alpha % twoMathPi === 0 ? [this.B] : [this.B, this.C]).forEach(to => {
      projections.push(this.projectOrthogonally(this.A, to));
      projections.push(this.projectOrthogonally(this.A, to, -this.strokeProjectionMagnitude));
    });
    return projections;
  }

  /**
   * MITER
   * Calculation: the corner is formed by extending the outer edges of the stroke
   * at the tangents of the path segments until they intersect.
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#2-1-miter
   */
  projectMiter() {
    const projections = [],
      alpha = Math.abs(this.alpha),
      hypotUnitScalar = 1 / Math.sin(alpha / 2),
      miterVector = this.scaleUnitVector(this.bisector, -this.strokeProjectionMagnitude * hypotUnitScalar);

    // When two line segments meet at a sharp angle, it is possible for the join to extend,
    // far beyond the thickness of the line stroking the path. The stroke-miterlimit imposes
    // a limit on the extent of the line join.
    // MDN: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-miterlimit
    // When the stroke is uniform, scaling changes the arrangement of points, this changes the miter-limit
    const strokeMiterLimit = this.options.strokeUniform ? magnitude(this.scaleUnitVector(this.bisector, this.options.strokeMiterLimit)) : this.options.strokeMiterLimit;
    if (magnitude(miterVector) / this.strokeProjectionMagnitude <= strokeMiterLimit) {
      projections.push(this.applySkew(this.A.add(miterVector)));
    }
    /* when the miter-limit is reached, the stroke line join becomes of type bevel.
      We always need two orthogonal projections which are basically bevel-type projections,
      so regardless of whether the miter-limit was reached or not, we include these projections.
    */
    projections.push(...this.projectBevel());
    return projections;
  }

  /**
   * ROUND (without skew)
   * Calculation: the projections are the two vectors parallel to X and Y axes
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#2-3-1-round-without-skew
   */
  projectRoundNoSkew(startCircle, endCircle) {
    const projections = [],
      // correctSide is used to only consider projecting for the outer side
      correctSide = new Point(StrokeLineJoinProjections.getOrthogonalRotationFactor(this.bisector), StrokeLineJoinProjections.getOrthogonalRotationFactor(new Point(this.bisector.y, this.bisector.x))),
      radiusOnAxisX = new Point(1, 0).scalarMultiply(this.strokeProjectionMagnitude).multiply(this.strokeUniformScalar).multiply(correctSide),
      radiusOnAxisY = new Point(0, 1).scalarMultiply(this.strokeProjectionMagnitude).multiply(this.strokeUniformScalar).multiply(correctSide);
    [radiusOnAxisX, radiusOnAxisY].forEach(vector => {
      if (isBetweenVectors(vector, startCircle, endCircle)) {
        projections.push(this.A.add(vector));
      }
    });
    return projections;
  }

  /**
   * ROUND (with skew)
   * Calculation: the projections are the points furthest from the vertex in
   * the direction of the X and Y axes after distortion.
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#2-3-2-round-skew
   */
  projectRoundWithSkew(startCircle, endCircle) {
    const projections = [];
    const {
        skewX,
        skewY,
        scaleX,
        scaleY,
        strokeUniform
      } = this.options,
      shearing = new Point(Math.tan(degreesToRadians(skewX)), Math.tan(degreesToRadians(skewY)));
    // The points furthest from the vertex in the direction of the X and Y axes after distortion
    const circleRadius = this.strokeProjectionMagnitude,
      newY = strokeUniform ? circleRadius / scaleY / Math.sqrt(1 / scaleY ** 2 + 1 / scaleX ** 2 * shearing.y ** 2) : circleRadius / Math.sqrt(1 + shearing.y ** 2),
      furthestY = new Point(
      // Safe guard due to floating point precision. In some situations the square root
      // was returning NaN because of a negative number close to zero.
      Math.sqrt(Math.max(circleRadius ** 2 - newY ** 2, 0)), newY),
      newX = strokeUniform ? circleRadius / Math.sqrt(1 + shearing.x ** 2 * (1 / scaleY) ** 2 / (1 / scaleX + 1 / scaleX * shearing.x * shearing.y) ** 2) : circleRadius / Math.sqrt(1 + shearing.x ** 2 / (1 + shearing.x * shearing.y) ** 2),
      furthestX = new Point(newX, Math.sqrt(Math.max(circleRadius ** 2 - newX ** 2, 0)));
    [furthestX, furthestX.scalarMultiply(-1), furthestY, furthestY.scalarMultiply(-1)]
    // We need to skew the vector here as this information is used to check if
    // it is between the start and end of the circle segment
    .map(vector => this.applySkew(strokeUniform ? vector.multiply(this.strokeUniformScalar) : vector)).forEach(vector => {
      if (isBetweenVectors(vector, startCircle, endCircle)) {
        projections.push(this.applySkew(this.A).add(vector));
      }
    });
    return projections;
  }
  projectRound() {
    const projections = [];
    /* Include the start and end points of the circle segment, so that only
      the projections contained within it are included */
    // add the orthogonal projections (start and end points of circle segment)
    projections.push(...this.projectBevel());
    // let's determines which one of the orthogonal projection is the beginning and end of the circle segment.
    // when `alpha` equals 0 or 2*PI, we have a straight line, so the way to find the start/end is different.
    const isStraightLine = this.alpha % twoMathPi === 0,
      // change the origin of the projections to point A
      // so that the cross product calculation is correct
      newOrigin = this.applySkew(this.A),
      proj0 = projections[isStraightLine ? 0 : 2].subtract(newOrigin),
      proj1 = projections[isStraightLine ? 1 : 0].subtract(newOrigin),
      // when `isStraightLine` === true, we compare with the vector opposite AB, otherwise we compare with the bisector.
      comparisonVector = isStraightLine ? this.applySkew(this.AB.scalarMultiply(-1)) : this.applySkew(this.bisector.multiply(this.strokeUniformScalar).scalarMultiply(-1)),
      // the beginning of the circle segment is always to the right of the comparison vector (cross product > 0)
      isProj0Start = crossProduct(proj0, comparisonVector) > 0,
      startCircle = isProj0Start ? proj0 : proj1,
      endCircle = isProj0Start ? proj1 : proj0;
    if (!this.isSkewed()) {
      projections.push(...this.projectRoundNoSkew(startCircle, endCircle));
    } else {
      projections.push(...this.projectRoundWithSkew(startCircle, endCircle));
    }
    return projections;
  }

  /**
   * Project stroke width on points returning projections for each point as follows:
   * - `miter`: 1 point corresponding to the outer boundary. If the miter limit is exceeded, it will be 2 points (becomes bevel)
   * - `bevel`: 2 points corresponding to the bevel possible boundaries, orthogonal to the stroke.
   * - `round`: same as `bevel` when it has no skew, with skew are 4 points.
   */
  projectPoints() {
    switch (this.options.strokeLineJoin) {
      case 'miter':
        return this.projectMiter();
      case 'round':
        return this.projectRound();
      default:
        return this.projectBevel();
    }
  }
  project() {
    return this.projectPoints().map(point => ({
      originPoint: this.A,
      projectedPoint: point,
      angle: this.alpha,
      bisector: this.bisector
    }));
  }
}

/**
 * class in charge of finding projections for each type of line cap for start/end of an open path
 * @see {@link [Open path projections at #8344](https://github.com/fabricjs/fabric.js/pull/8344#1-open-path)}
 *
 * Reference:
 * - MDN:
 *   - https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineCap
 *   - https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-linecap
 * - Spec: https://html.spec.whatwg.org/multipage/canvas.html#dom-context-2d-linecap-dev
 * - Playground to understand how the line joins works: https://hypertolosana.github.io/efficient-webgl-stroking/index.html
 * - View the calculated projections for each of the control points: https://codesandbox.io/s/project-stroke-points-with-context-to-trace-b8jc4j?file=/src/index.js
 */
class StrokeLineCapProjections extends StrokeProjectionsBase {
  /**
   * edge point
   */

  /**
   * point next to edge point
   */

  constructor(A, T, options) {
    super(options);
    this.A = new Point(A);
    this.T = new Point(T);
  }
  calcOrthogonalProjection(from, to) {
    let magnitude = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.strokeProjectionMagnitude;
    const vector = this.createSideVector(from, to);
    return this.scaleUnitVector(getOrthonormalVector(vector), magnitude);
  }

  /**
   * OPEN PATH START/END - Line cap: Butt
   * Calculation: to find the projections, just find the points orthogonal to the stroke
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#1-1-butt
   */
  projectButt() {
    return [this.projectOrthogonally(this.A, this.T, this.strokeProjectionMagnitude), this.projectOrthogonally(this.A, this.T, -this.strokeProjectionMagnitude)];
  }

  /**
   * OPEN PATH START/END - Line cap: Round
   * Calculation: same as stroke line join `round`
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#1-2-round
   */
  projectRound() {
    const projections = [];
    if (!this.isSkewed() && this.A.eq(this.T)) {
      /* 1 point case without `skew`
        When `strokeUniform` is true, scaling has no effect.
        So we divide by scale, to remove its effect.
      */
      const projection = new Point(1, 1).scalarMultiply(this.strokeProjectionMagnitude).multiply(this.strokeUniformScalar);
      projections.push(this.applySkew(this.A.add(projection)), this.applySkew(this.A.subtract(projection)));
    } else {
      projections.push(...new StrokeLineJoinProjections(this.A, this.T, this.T, this.options).projectRound());
    }
    return projections;
  }

  /**
   * OPEN PATH START/END - Line cap: Square
   * Calculation: project a rectangle of points on the stroke in the opposite direction of the vector `AT`
   *
   * @see https://github.com/fabricjs/fabric.js/pull/8344#1-3-square
   */
  projectSquare() {
    const projections = [];
    if (this.A.eq(this.T)) {
      /* 1 point case without `skew`
        When `strokeUniform` is true, scaling has no effect.
        So we divide by scale, to remove its effect.
      */
      const projection = new Point(1, 1).scalarMultiply(this.strokeProjectionMagnitude).multiply(this.strokeUniformScalar);
      projections.push(this.A.add(projection), this.A.subtract(projection));
    } else {
      const orthogonalProjection = this.calcOrthogonalProjection(this.A, this.T, this.strokeProjectionMagnitude);
      const strokePointingOut = this.scaleUnitVector(getUnitVector(this.createSideVector(this.A, this.T)), -this.strokeProjectionMagnitude);
      const projectedA = this.A.add(strokePointingOut);
      projections.push(projectedA.add(orthogonalProjection), projectedA.subtract(orthogonalProjection));
    }
    return projections.map(p => this.applySkew(p));
  }
  projectPoints() {
    switch (this.options.strokeLineCap) {
      case 'round':
        return this.projectRound();
      case 'square':
        return this.projectSquare();
      default:
        return this.projectButt();
    }
  }
  project() {
    return this.projectPoints().map(point => ({
      originPoint: this.A,
      projectedPoint: point
    }));
  }
}

/**
 *
 * Used to calculate object's bounding box
 *
 * @see https://github.com/fabricjs/fabric.js/pull/8344
 *
 */
const projectStrokeOnPoints = function (points, options) {
  let openPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  const projections = [];
  if (points.length === 0) {
    return projections;
  }

  // first we remove duplicate neighboring points
  const reduced = points.reduce((reduced, point) => {
    if (!reduced[reduced.length - 1].eq(point)) {
      reduced.push(new Point(point));
    }
    return reduced;
  }, [new Point(points[0])]);
  if (reduced.length === 1) {
    openPath = true;
  } else if (!openPath) {
    // remove points from end in case they equal the first point
    // in order to correctly project the first point
    const start = reduced[0];
    const index = findIndexRight(reduced, point => !point.eq(start));
    reduced.splice(index + 1);
  }
  reduced.forEach((A, index, points) => {
    let B, C;
    if (index === 0) {
      C = points[1];
      B = openPath ? A : points[points.length - 1];
    } else if (index === points.length - 1) {
      B = points[index - 1];
      C = openPath ? A : points[0];
    } else {
      B = points[index - 1];
      C = points[index + 1];
    }
    if (openPath && points.length === 1) {
      projections.push(...new StrokeLineCapProjections(A, A, options).project());
    } else if (openPath && (index === 0 || index === points.length - 1)) {
      projections.push(...new StrokeLineCapProjections(A, index === 0 ? C : B, options).project());
    } else {
      projections.push(...new StrokeLineJoinProjections(A, B, C, options).project());
    }
  });
  return projections;
};

const cloneStyles = style => {
  const newObj = {};
  Object.keys(style).forEach(key => {
    newObj[key] = {};
    Object.keys(style[key]).forEach(keyInner => {
      newObj[key][keyInner] = {
        ...style[key][keyInner]
      };
    });
  });
  return newObj;
};

/**
 * Capitalizes a string
 * @param {String} string String to capitalize
 * @param {Boolean} [firstLetterOnly] If true only first letter is capitalized
 * and other letters stay untouched, if false first letter is capitalized
 * and other letters are converted to lowercase.
 * @return {String} Capitalized version of a string
 */
const capitalize = function (string) {
  let firstLetterOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return `${string.charAt(0).toUpperCase()}${firstLetterOnly ? string.slice(1) : string.slice(1).toLowerCase()}`;
};

/**
 * Escapes XML in a string
 * @param {String} string String to escape
 * @return {String} Escaped version of a string
 */
const escapeXml = string => string.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let segmenter;
const getSegmenter = () => {
  if (!segmenter) {
    segmenter = 'Intl' in getFabricWindow() && 'Segmenter' in Intl && new Intl.Segmenter(undefined, {
      granularity: 'grapheme'
    });
  }
  return segmenter;
};

/**
 * Divide a string in the user perceived single units
 * @param {String} textstring String to escape
 * @return {Array} array containing the graphemes
 */
const graphemeSplit = textstring => {
  segmenter || getSegmenter();
  if (segmenter) {
    const segments = segmenter.segment(textstring);
    return Array.from(segments).map(_ref => {
      let {
        segment
      } = _ref;
      return segment;
    });
  }

  //Fallback
  return graphemeSplitImpl(textstring);
};
const graphemeSplitImpl = textstring => {
  const graphemes = [];
  for (let i = 0, chr; i < textstring.length; i++) {
    if ((chr = getWholeChar(textstring, i)) === false) {
      continue;
    }
    graphemes.push(chr);
  }
  return graphemes;
};

// taken from mdn in the charAt doc page.
const getWholeChar = (str, i) => {
  const code = str.charCodeAt(i);
  if (isNaN(code)) {
    return ''; // Position not found
  }
  if (code < 0xd800 || code > 0xdfff) {
    return str.charAt(i);
  }

  // High surrogate (could change last hex to 0xDB7F to treat high private
  // surrogates as single characters)
  if (0xd800 <= code && code <= 0xdbff) {
    if (str.length <= i + 1) {
      throw 'High surrogate without following low surrogate';
    }
    const next = str.charCodeAt(i + 1);
    if (0xdc00 > next || next > 0xdfff) {
      throw 'High surrogate without following low surrogate';
    }
    return str.charAt(i) + str.charAt(i + 1);
  }
  // Low surrogate (0xDC00 <= code && code <= 0xDFFF)
  if (i === 0) {
    throw 'Low surrogate without preceding high surrogate';
  }
  const prev = str.charCodeAt(i - 1);

  // (could change last hex to 0xDB7F to treat high private
  // surrogates as single characters)
  if (0xd800 > prev || prev > 0xdbff) {
    throw 'Low surrogate without preceding high surrogate';
  }
  // We can pass over low surrogates now as the second component
  // in a pair which we have already processed
  return false;
};

var lang_string = /*#__PURE__*/Object.freeze({
  __proto__: null,
  capitalize: capitalize,
  escapeXml: escapeXml,
  graphemeSplit: graphemeSplit
});

/**
 * @param {Object} prevStyle first style to compare
 * @param {Object} thisStyle second style to compare
 * @param {boolean} forTextSpans whether to check overline, underline, and line-through properties
 * @return {boolean} true if the style changed
 */
const hasStyleChanged = function (prevStyle, thisStyle) {
  let forTextSpans = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return prevStyle.fill !== thisStyle.fill || prevStyle.stroke !== thisStyle.stroke || prevStyle.strokeWidth !== thisStyle.strokeWidth || prevStyle.fontSize !== thisStyle.fontSize || prevStyle.fontFamily !== thisStyle.fontFamily || prevStyle.fontWeight !== thisStyle.fontWeight || prevStyle.fontStyle !== thisStyle.fontStyle || prevStyle.textDecorationThickness !== thisStyle.textDecorationThickness || prevStyle.textBackgroundColor !== thisStyle.textBackgroundColor || prevStyle.deltaY !== thisStyle.deltaY || forTextSpans && (prevStyle.overline !== thisStyle.overline || prevStyle.underline !== thisStyle.underline || prevStyle.linethrough !== thisStyle.linethrough);
};

/**
 * Returns the array form of a text object's inline styles property with styles grouped in ranges
 * rather than per character. This format is less verbose, and is better suited for storage
 * so it is used in serialization (not during runtime).
 * @param {object} styles per character styles for a text object
 * @param {String} text the text string that the styles are applied to
 * @return {{start: number, end: number, style: object}[]}
 */
const stylesToArray = (styles, text) => {
  const textLines = text.split('\n'),
    stylesArray = [];
  let charIndex = -1,
    prevStyle = {};
  // clone style structure to prevent mutation
  styles = cloneStyles(styles);

  //loop through each textLine
  for (let i = 0; i < textLines.length; i++) {
    const chars = graphemeSplit(textLines[i]);
    if (!styles[i]) {
      //no styles exist for this line, so add the line's length to the charIndex total and reset prevStyle
      charIndex += chars.length;
      prevStyle = {};
      continue;
    }
    //loop through each character of the current line
    for (let c = 0; c < chars.length; c++) {
      charIndex++;
      const thisStyle = styles[i][c];
      //check if style exists for this character
      if (thisStyle && Object.keys(thisStyle).length > 0) {
        if (hasStyleChanged(prevStyle, thisStyle, true)) {
          stylesArray.push({
            start: charIndex,
            end: charIndex + 1,
            style: thisStyle
          });
        } else {
          //if style is the same as previous character, increase end index
          stylesArray[stylesArray.length - 1].end++;
        }
      }
      prevStyle = thisStyle || {};
    }
  }
  return stylesArray;
};

/**
 * Returns the object form of the styles property with styles that are assigned per
 * character rather than grouped by range. This format is more verbose, and is
 * only used during runtime (not for serialization/storage)
 * @param {Array} styles the serialized form of a text object's styles
 * @param {String} text the text string that the styles are applied to
 * @return {Object}
 */
const stylesFromArray = (styles, text) => {
  if (!Array.isArray(styles)) {
    // clone to prevent mutation
    return cloneStyles(styles);
  }
  const textLines = text.split(reNewline),
    stylesObject = {};
  let charIndex = -1,
    styleIndex = 0;
  //loop through each textLine
  for (let i = 0; i < textLines.length; i++) {
    const chars = graphemeSplit(textLines[i]);

    //loop through each character of the current line
    for (let c = 0; c < chars.length; c++) {
      charIndex++;
      //check if there's a style collection that includes the current character
      if (styles[styleIndex] && styles[styleIndex].start <= charIndex && charIndex < styles[styleIndex].end) {
        //create object for line index if it doesn't exist
        stylesObject[i] = stylesObject[i] || {};
        //assign a style at this character's index
        stylesObject[i][c] = {
          ...styles[styleIndex].style
        };
        //if character is at the end of the current style collection, move to the next
        if (charIndex === styles[styleIndex].end - 1) {
          styleIndex++;
        }
      }
    }
  }
  return stylesObject;
};

/**
 * Attributes parsed from all SVG elements
 * @type array
 */
const SHARED_ATTRIBUTES = ['display', 'transform', FILL, 'fill-opacity', 'fill-rule', 'opacity', STROKE, 'stroke-dasharray', 'stroke-linecap', 'stroke-dashoffset', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'id', 'paint-order', 'vector-effect', 'instantiated_by_use', 'clip-path'];

function selectorMatches(element, selector) {
  const nodeName = element.nodeName;
  const classNames = element.getAttribute('class');
  const id = element.getAttribute('id');
  const azAz = '(?![a-zA-Z\\-]+)';
  let matcher;
  // i check if a selector matches slicing away part from it.
  // if i get empty string i should match
  matcher = new RegExp('^' + nodeName, 'i');
  selector = selector.replace(matcher, '');
  if (id && selector.length) {
    matcher = new RegExp('#' + id + azAz, 'i');
    selector = selector.replace(matcher, '');
  }
  if (classNames && selector.length) {
    const splitClassNames = classNames.split(' ');
    for (let i = splitClassNames.length; i--;) {
      matcher = new RegExp('\\.' + splitClassNames[i] + azAz, 'i');
      selector = selector.replace(matcher, '');
    }
  }
  return selector.length === 0;
}

function doesSomeParentMatch(element, selectors) {
  let selector,
    parentMatching = true;
  while (element.parentElement && element.parentElement.nodeType === 1 && selectors.length) {
    if (parentMatching) {
      selector = selectors.pop();
    }
    element = element.parentElement;
    parentMatching = selectorMatches(element, selector);
  }
  return selectors.length === 0;
}

/**
 * @private
 */

function elementMatchesRule(element, selectors) {
  let parentMatching = true;
  // start from rightmost selector.
  const firstMatching = selectorMatches(element, selectors.pop());
  if (firstMatching && selectors.length) {
    parentMatching = doesSomeParentMatch(element, selectors);
  }
  return firstMatching && parentMatching && selectors.length === 0;
}

/**
 * @private
 */

function getGlobalStylesForElement(element) {
  let cssRules = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let styles = {};
  for (const rule in cssRules) {
    if (elementMatchesRule(element, rule.split(' '))) {
      styles = {
        ...styles,
        ...cssRules[rule]
      };
    }
  }
  return styles;
}

const normalizeAttr = attr => {
  var _attributesMap;
  return (_attributesMap = attributesMap[attr]) !== null && _attributesMap !== void 0 ? _attributesMap : attr;
};

const regex$1 = new RegExp(`(${reNum})`, 'gi');
const cleanupSvgAttribute = attributeValue => normalizeWs(attributeValue.replace(regex$1, ' $1 ')
// replace annoying commas and arbitrary whitespace with single spaces
.replace(/,/gi, ' '));

// == begin transform regexp
const p$1 = `(${reNum})`;
const skewX = String.raw`(skewX)\(${p$1}\)`;
const skewY = String.raw`(skewY)\(${p$1}\)`;
const rotate = String.raw`(rotate)\(${p$1}(?: ${p$1} ${p$1})?\)`;
const scale = String.raw`(scale)\(${p$1}(?: ${p$1})?\)`;
const translate = String.raw`(translate)\(${p$1}(?: ${p$1})?\)`;
const matrix = String.raw`(matrix)\(${p$1} ${p$1} ${p$1} ${p$1} ${p$1} ${p$1}\)`;
const transform = `(?:${matrix}|${translate}|${rotate}|${scale}|${skewX}|${skewY})`;
const transforms = `(?:${transform}*)`;
const transformList = String.raw`^\s*(?:${transforms}?)\s*$`;
// http://www.w3.org/TR/SVG/coords.html#TransformAttribute
const reTransformList = new RegExp(transformList);
const reTransform = new RegExp(transform);
const reTransformAll = new RegExp(transform, 'g');
// == end transform regexp

/**
 * Parses "transform" attribute, returning an array of values
 * @param {String} attributeValue String containing attribute value
 * @return {TTransformMatrix} Array of 6 elements representing transformation matrix
 */
function parseTransformAttribute(attributeValue) {
  // first we clean the string
  attributeValue = cleanupSvgAttribute(attributeValue)
  // remove spaces around front parentheses
  .replace(/\s*([()])\s*/gi, '$1');

  // start with identity matrix
  const matrices = [];

  // return if no argument was given or
  // an argument does not match transform attribute regexp
  if (!attributeValue || attributeValue && !reTransformList.test(attributeValue)) {
    return [...iMatrix];
  }
  for (const match of attributeValue.matchAll(reTransformAll)) {
    const transformMatch = reTransform.exec(match[0]);
    if (!transformMatch) {
      continue;
    }
    let matrix = iMatrix;
    const matchedParams = transformMatch.filter(m => !!m);
    const [, operation, ...rawArgs] = matchedParams;
    const [arg0, arg1, arg2, arg3, arg4, arg5] = rawArgs.map(arg => parseFloat(arg));
    switch (operation) {
      case 'translate':
        matrix = createTranslateMatrix(arg0, arg1);
        break;
      case ROTATE:
        matrix = createRotateMatrix({
          angle: arg0
        }, {
          x: arg1,
          y: arg2
        });
        break;
      case SCALE:
        matrix = createScaleMatrix(arg0, arg1);
        break;
      case SKEW_X:
        matrix = createSkewXMatrix(arg0);
        break;
      case SKEW_Y:
        matrix = createSkewYMatrix(arg0);
        break;
      case 'matrix':
        matrix = [arg0, arg1, arg2, arg3, arg4, arg5];
        break;
    }

    // snapshot current matrix into matrices array
    matrices.push(matrix);
  }
  return multiplyTransformMatrixArray(matrices);
}

function normalizeValue(attr, value, parentAttributes, fontSize) {
  const isArray = Array.isArray(value);
  let parsed;
  let ouputValue = value;
  if ((attr === FILL || attr === STROKE) && value === NONE) {
    ouputValue = '';
  } else if (attr === 'strokeUniform') {
    return value === 'non-scaling-stroke';
  } else if (attr === 'strokeDashArray') {
    if (value === NONE) {
      ouputValue = null;
    } else {
      ouputValue = value.replace(/,/g, ' ').split(/\s+/).map(parseFloat);
    }
  } else if (attr === 'transformMatrix') {
    if (parentAttributes && parentAttributes.transformMatrix) {
      ouputValue = multiplyTransformMatrices(parentAttributes.transformMatrix, parseTransformAttribute(value));
    } else {
      ouputValue = parseTransformAttribute(value);
    }
  } else if (attr === 'visible') {
    ouputValue = value !== NONE && value !== 'hidden';
    // display=none on parent element always takes precedence over child element
    if (parentAttributes && parentAttributes.visible === false) {
      ouputValue = false;
    }
  } else if (attr === 'opacity') {
    ouputValue = parseFloat(value);
    if (parentAttributes && typeof parentAttributes.opacity !== 'undefined') {
      ouputValue *= parentAttributes.opacity;
    }
  } else if (attr === 'textAnchor' /* text-anchor */) {
    ouputValue = value === 'start' ? LEFT : value === 'end' ? RIGHT : CENTER;
  } else if (attr === 'charSpacing' || attr === TEXT_DECORATION_THICKNESS) {
    // parseUnit returns px and we convert it to em
    parsed = parseUnit(value, fontSize) / fontSize * 1000;
  } else if (attr === 'paintFirst') {
    const fillIndex = value.indexOf(FILL);
    const strokeIndex = value.indexOf(STROKE);
    ouputValue = FILL;
    if (fillIndex > -1 && strokeIndex > -1 && strokeIndex < fillIndex) {
      ouputValue = STROKE;
    } else if (fillIndex === -1 && strokeIndex > -1) {
      ouputValue = STROKE;
    }
  } else if (attr === 'href' || attr === 'xlink:href' || attr === 'font' || attr === 'id') {
    return value;
  } else if (attr === 'imageSmoothing') {
    return value === 'optimizeQuality';
  } else {
    parsed = isArray ? value.map(parseUnit) : parseUnit(value, fontSize);
  }
  return !isArray && isNaN(parsed) ? ouputValue : parsed;
}

/**
 * Parses a short font declaration, building adding its properties to a style object
 * @param {String} value font declaration
 * @param {Object} oStyle definition
 */
function parseFontDeclaration(value, oStyle) {
  const match = value.match(reFontDeclaration);
  if (!match) {
    return;
  }
  const fontStyle = match[1],
    // font variant is not used
    // fontVariant = match[2],
    fontWeight = match[3],
    fontSize = match[4],
    lineHeight = match[5],
    fontFamily = match[6];
  if (fontStyle) {
    oStyle.fontStyle = fontStyle;
  }
  if (fontWeight) {
    oStyle.fontWeight = isNaN(parseFloat(fontWeight)) ? fontWeight : parseFloat(fontWeight);
  }
  if (fontSize) {
    oStyle.fontSize = parseUnit(fontSize);
  }
  if (fontFamily) {
    oStyle.fontFamily = fontFamily;
  }
  if (lineHeight) {
    oStyle.lineHeight = lineHeight === NORMAL ? 1 : lineHeight;
  }
}

/**
 * Takes a style object and parses it in one that has only defined values
 * and lowercases properties
 * @param style
 * @param oStyle
 */
function parseStyleObject(style, oStyle) {
  Object.entries(style).forEach(_ref => {
    let [prop, value] = _ref;
    if (value === undefined) {
      return;
    }
    oStyle[prop.toLowerCase()] = value;
  });
}

/**
 * Takes a style string and parses it in one that has only defined values
 * and lowercases properties
 * @param style
 * @param oStyle
 */
function parseStyleString(style, oStyle) {
  style.replace(/;\s*$/, '').split(';').forEach(chunk => {
    if (!chunk) return;
    const [attr, value] = chunk.split(':');
    oStyle[attr.trim().toLowerCase()] = value.trim();
  });
}

/**
 * Parses "style" attribute, retuning an object with values
 * @param {SVGElement} element Element to parse
 * @return {Object} Objects with values parsed from style attribute of an element
 */
function parseStyleAttribute(element) {
  const oStyle = {},
    style = element.getAttribute('style');
  if (!style) {
    return oStyle;
  }
  if (typeof style === 'string') {
    parseStyleString(style, oStyle);
  } else {
    parseStyleObject(style, oStyle);
  }
  return oStyle;
}

const colorAttributesMap = {
  stroke: 'strokeOpacity',
  fill: 'fillOpacity'
};

/**
 * @private
 * @param {Object} attributes Array of attributes to parse
 */

function setStrokeFillOpacity(attributes) {
  const defaults = FabricObject.getDefaults();
  Object.entries(colorAttributesMap).forEach(_ref => {
    let [attr, colorAttr] = _ref;
    if (typeof attributes[colorAttr] === 'undefined' || attributes[attr] === '') {
      return;
    }
    if (typeof attributes[attr] === 'undefined') {
      if (!defaults[attr]) {
        return;
      }
      attributes[attr] = defaults[attr];
    }
    if (attributes[attr].indexOf('url(') === 0) {
      return;
    }
    const color = new Color(attributes[attr]);
    attributes[attr] = color.setAlpha(toFixed(color.getAlpha() * attributes[colorAttr], 2)).toRgba();
  });
  return attributes;
}

/**
 * Returns an object of attributes' name/value, given element and an array of attribute names;
 * Parses parent "g" nodes recursively upwards.
 * @param {SVGElement | HTMLElement} element Element to parse
 * @param {Array} attributes Array of attributes to parse
 * @return {Object} object containing parsed attributes' names/values
 */
function parseAttributes(element, attributes, cssRules) {
  if (!element) {
    return {};
  }
  let parentAttributes = {},
    fontSize,
    parentFontSize = DEFAULT_SVG_FONT_SIZE;

  // if there's a parent container (`g` or `a` or `symbol` node), parse its attributes recursively upwards
  if (element.parentNode && svgValidParentsRegEx.test(element.parentNode.nodeName)) {
    parentAttributes = parseAttributes(element.parentElement, attributes, cssRules);
    if (parentAttributes.fontSize) {
      fontSize = parentFontSize = parseUnit(parentAttributes.fontSize);
    }
  }
  const ownAttributes = {
    ...attributes.reduce((memo, attr) => {
      const value = element.getAttribute(attr);
      if (value) {
        memo[attr] = value;
      }
      return memo;
    }, {}),
    // add values parsed from style, which take precedence over attributes
    // (see: http://www.w3.org/TR/SVG/styling.html#UsingPresentationAttributes)
    ...getGlobalStylesForElement(element, cssRules),
    ...parseStyleAttribute(element)
  };
  if (ownAttributes[cPath]) {
    element.setAttribute(cPath, ownAttributes[cPath]);
  }
  if (ownAttributes[fSize]) {
    // looks like the minimum should be 9px when dealing with ems. this is what looks like in browsers.
    fontSize = parseUnit(ownAttributes[fSize], parentFontSize);
    ownAttributes[fSize] = `${fontSize}`;
  }

  // this should have its own complex type
  const normalizedStyle = {};
  for (const attr in ownAttributes) {
    const normalizedAttr = normalizeAttr(attr);
    const normalizedValue = normalizeValue(normalizedAttr, ownAttributes[attr], parentAttributes, fontSize);
    normalizedStyle[normalizedAttr] = normalizedValue;
  }
  if (normalizedStyle && normalizedStyle.font) {
    parseFontDeclaration(normalizedStyle.font, normalizedStyle);
  }
  const mergedAttrs = {
    ...parentAttributes,
    ...normalizedStyle
  };
  return svgValidParentsRegEx.test(element.nodeName) ? mergedAttrs : setStrokeFillOpacity(mergedAttrs);
}

const rectDefaultValues = {
  rx: 0,
  ry: 0
};
const RECT_PROPS = ['rx', 'ry'];
class Rect extends FabricObject {
  static getDefaults() {
    return {
      ...super.getDefaults(),
      ...Rect.ownDefaults
    };
  }

  /**
   * Constructor
   * @param {Object} [options] Options object
   */
  constructor(options) {
    super();
    Object.assign(this, Rect.ownDefaults);
    this.setOptions(options);
    this._initRxRy();
  }
  /**
   * Initializes rx/ry attributes
   * @private
   */
  _initRxRy() {
    const {
      rx,
      ry
    } = this;
    if (rx && !ry) {
      this.ry = rx;
    } else if (ry && !rx) {
      this.rx = ry;
    }
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render(ctx) {
    const {
      width: w,
      height: h
    } = this;
    const x = -w / 2;
    const y = -h / 2;
    const rx = this.rx ? Math.min(this.rx, w / 2) : 0;
    const ry = this.ry ? Math.min(this.ry, h / 2) : 0;
    const isRounded = rx !== 0 || ry !== 0;
    ctx.beginPath();
    ctx.moveTo(x + rx, y);
    ctx.lineTo(x + w - rx, y);
    isRounded && ctx.bezierCurveTo(x + w - kRect * rx, y, x + w, y + kRect * ry, x + w, y + ry);
    ctx.lineTo(x + w, y + h - ry);
    isRounded && ctx.bezierCurveTo(x + w, y + h - kRect * ry, x + w - kRect * rx, y + h, x + w - rx, y + h);
    ctx.lineTo(x + rx, y + h);
    isRounded && ctx.bezierCurveTo(x + kRect * rx, y + h, x, y + h - kRect * ry, x, y + h - ry);
    ctx.lineTo(x, y + ry);
    isRounded && ctx.bezierCurveTo(x, y + kRect * ry, x + kRect * rx, y, x + rx, y);
    ctx.closePath();
    this._renderPaintInOrder(ctx);
  }

  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject() {
    let propertiesToInclude = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return super.toObject([...RECT_PROPS, ...propertiesToInclude]);
  }

  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    const {
      width,
      height,
      rx,
      ry
    } = this;
    return ['<rect ', 'COMMON_PARTS', `x="${-width / 2}" y="${-height / 2}" rx="${rx}" ry="${ry}" width="${width}" height="${height}" />\n`];
  }

  /**
   * List of attribute names to account for when parsing SVG element (used by `Rect.fromElement`)
   * @see: http://www.w3.org/TR/SVG/shapes.html#RectElement
   */

  /* _FROM_SVG_START_ */

  /**
   * Returns {@link Rect} instance from an SVG element
   * @param {HTMLElement} element Element to parse
   * @param {Object} [options] Options object
   */
  static async fromElement(element, options, cssRules) {
    const {
      left = 0,
      top = 0,
      width = 0,
      height = 0,
      visible = true,
      ...restOfparsedAttributes
    } = parseAttributes(element, this.ATTRIBUTE_NAMES, cssRules);
    return new this({
      ...options,
      ...restOfparsedAttributes,
      left,
      top,
      width,
      height,
      visible: Boolean(visible && width && height)
    });
  }

  /* _FROM_SVG_END_ */
}
/**
 * Horizontal border radius
 * @type Number
 */
/**
 * Vertical border radius
 * @type Number
 */
_defineProperty(Rect, "type", 'Rect');
_defineProperty(Rect, "cacheProperties", [...cacheProperties, ...RECT_PROPS]);
_defineProperty(Rect, "ownDefaults", rectDefaultValues);
_defineProperty(Rect, "ATTRIBUTE_NAMES", [...SHARED_ATTRIBUTES, 'x', 'y', 'rx', 'ry', 'width', 'height']);
classRegistry.setClass(Rect);
classRegistry.setSVGClass(Rect);

const LAYOUT_TYPE_INITIALIZATION = 'initialization';
const LAYOUT_TYPE_ADDED = 'added';
const LAYOUT_TYPE_REMOVED = 'removed';
const LAYOUT_TYPE_IMPERATIVE = 'imperative';
const LAYOUT_TYPE_OBJECT_MODIFIED = 'object_modified';
const LAYOUT_TYPE_OBJECT_MODIFYING = 'object_modifying';

/**
 * @returns 2 points, the tl and br corners of the non rotated bounding box of an object
 * in the {@link group} plane, taking into account objects that {@link group} is their parent
 * but also belong to the active selection.
 */
const getObjectBounds = (destinationGroup, object) => {
  const {
    strokeUniform,
    strokeWidth,
    width,
    height,
    group: currentGroup
  } = object;
  const t = currentGroup && currentGroup !== destinationGroup ? calcPlaneChangeMatrix(currentGroup.calcTransformMatrix(), destinationGroup.calcTransformMatrix()) : null;
  const objectCenter = t ? object.getRelativeCenterPoint().transform(t) : object.getRelativeCenterPoint();
  const accountForStroke = !object['isStrokeAccountedForInDimensions']();
  const strokeUniformVector = strokeUniform && accountForStroke ? sendVectorToPlane(new Point(strokeWidth, strokeWidth), undefined, destinationGroup.calcTransformMatrix()) : ZERO;
  const scalingStrokeWidth = !strokeUniform && accountForStroke ? strokeWidth : 0;
  const sizeVector = sizeAfterTransform(width + scalingStrokeWidth, height + scalingStrokeWidth, multiplyTransformMatrixArray([t, object.calcOwnMatrix()], true)).add(strokeUniformVector).scalarDivide(2);
  return [objectCenter.subtract(sizeVector), objectCenter.add(sizeVector)];
};

/**
 * Exposes a main public method {@link calcLayoutResult} that is used by the `LayoutManager` to perform layout.
 * Returning `undefined` signals the `LayoutManager` to skip the layout.
 *
 * In charge of calculating the bounding box of the passed objects.
 */
class LayoutStrategy {
  /**
   * Used by the `LayoutManager` to perform layout
   * @TODO/fix: if this method is calcResult, should calc unconditionally.
   * the condition to not calc should be evaluated by the layoutManager.
   * @returns layout result **OR** `undefined` to skip layout
   */
  calcLayoutResult(context, objects) {
    if (this.shouldPerformLayout(context)) {
      return this.calcBoundingBox(objects, context);
    }
  }
  shouldPerformLayout(_ref) {
    let {
      type,
      prevStrategy,
      strategy
    } = _ref;
    return type === LAYOUT_TYPE_INITIALIZATION || type === LAYOUT_TYPE_IMPERATIVE || !!prevStrategy && strategy !== prevStrategy;
  }
  shouldLayoutClipPath(_ref2) {
    let {
      type,
      target: {
        clipPath
      }
    } = _ref2;
    return type !== LAYOUT_TYPE_INITIALIZATION && clipPath && !clipPath.absolutePositioned;
  }
  getInitialSize(context, result) {
    return result.size;
  }

  /**
   * Override this method to customize layout.
   */
  calcBoundingBox(objects, context) {
    const {
      type,
      target
    } = context;
    if (type === LAYOUT_TYPE_IMPERATIVE && context.overrides) {
      return context.overrides;
    }
    if (objects.length === 0) {
      return;
    }
    const {
      left,
      top,
      width,
      height
    } = makeBoundingBoxFromPoints(objects.map(object => getObjectBounds(target, object)).reduce((coords, curr) => coords.concat(curr), []));
    const bboxSize = new Point(width, height);
    const bboxLeftTop = new Point(left, top);
    const bboxCenter = bboxLeftTop.add(bboxSize.scalarDivide(2));
    if (type === LAYOUT_TYPE_INITIALIZATION) {
      const actualSize = this.getInitialSize(context, {
        size: bboxSize,
        center: bboxCenter
      });
      return {
        // in `initialization` we do not account for target's transformation matrix
        center: bboxCenter,
        // TODO: investigate if this is still necessary
        relativeCorrection: new Point(0, 0),
        size: actualSize
      };
    } else {
      //  we send `relativeCenter` up to group's containing plane
      const center = bboxCenter.transform(target.calcOwnMatrix());
      return {
        center,
        size: bboxSize
      };
    }
  }
}
/**
 * override by subclass for persistence (TS does not support `static abstract`)
 */
_defineProperty(LayoutStrategy, "type", 'strategy');

/**
 * Layout will adjust the bounding box to fit target's objects.
 */
class FitContentLayout extends LayoutStrategy {
  /**
   * @override layout on all triggers
   * Override at will
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  shouldPerformLayout(context) {
    return true;
  }
}
_defineProperty(FitContentLayout, "type", 'fit-content');
classRegistry.setClass(FitContentLayout);

const LAYOUT_MANAGER = 'layoutManager';
class LayoutManager {
  constructor() {
    let strategy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new FitContentLayout();
    _defineProperty(this, "strategy", void 0);
    this.strategy = strategy;
    this._subscriptions = new Map();
  }
  performLayout(context) {
    const strictContext = {
      bubbles: true,
      strategy: this.strategy,
      ...context,
      prevStrategy: this._prevLayoutStrategy,
      stopPropagation() {
        this.bubbles = false;
      }
    };
    this.onBeforeLayout(strictContext);
    const layoutResult = this.getLayoutResult(strictContext);
    if (layoutResult) {
      this.commitLayout(strictContext, layoutResult);
    }
    this.onAfterLayout(strictContext, layoutResult);
    this._prevLayoutStrategy = strictContext.strategy;
  }

  /**
   * Attach handlers for events that we know will invalidate the layout when
   * performed on child objects ( general transforms ).
   * Returns the disposers for later unsubscribing and cleanup
   * @param {FabricObject} object
   * @param {RegistrationContext & Partial<StrictLayoutContext>} context
   * @returns {VoidFunction[]} disposers remove the handlers
   */
  attachHandlers(object, context) {
    const {
      target
    } = context;
    return [MODIFIED, MOVING, RESIZING, ROTATING, SCALING, SKEWING, CHANGED, MODIFY_POLY, MODIFY_PATH].map(key => object.on(key, e => this.performLayout(key === MODIFIED ? {
      type: LAYOUT_TYPE_OBJECT_MODIFIED,
      trigger: key,
      e,
      target
    } : {
      type: LAYOUT_TYPE_OBJECT_MODIFYING,
      trigger: key,
      e,
      target
    })));
  }

  /**
   * Subscribe an object to transform events that will trigger a layout change on the parent
   * This is important only for interactive groups.
   * @param object
   * @param context
   */
  subscribe(object, context) {
    this.unsubscribe(object, context);
    const disposers = this.attachHandlers(object, context);
    this._subscriptions.set(object, disposers);
  }

  /**
   * unsubscribe object layout triggers
   */
  unsubscribe(object, _context) {
    (this._subscriptions.get(object) || []).forEach(d => d());
    this._subscriptions.delete(object);
  }
  unsubscribeTargets(context) {
    context.targets.forEach(object => this.unsubscribe(object, context));
  }
  subscribeTargets(context) {
    context.targets.forEach(object => this.subscribe(object, context));
  }
  onBeforeLayout(context) {
    const {
      target,
      type
    } = context;
    const {
      canvas
    } = target;
    // handle layout triggers subscription
    // @TODO: gate the registration when the group is interactive
    if (type === LAYOUT_TYPE_INITIALIZATION || type === LAYOUT_TYPE_ADDED) {
      this.subscribeTargets(context);
    } else if (type === LAYOUT_TYPE_REMOVED) {
      this.unsubscribeTargets(context);
    }
    // fire layout event (event will fire only for layouts after initialization layout)
    target.fire('layout:before', {
      context
    });
    canvas && canvas.fire('object:layout:before', {
      target,
      context
    });
    if (type === LAYOUT_TYPE_IMPERATIVE && context.deep) {
      const {
        strategy: _,
        ...tricklingContext
      } = context;
      // traverse the tree
      target.forEachObject(object => object.layoutManager && object.layoutManager.performLayout({
        ...tricklingContext,
        bubbles: false,
        target: object
      }));
    }
  }
  getLayoutResult(context) {
    const {
      target,
      strategy,
      type
    } = context;
    const result = strategy.calcLayoutResult(context, target.getObjects());
    if (!result) {
      return;
    }
    const prevCenter = type === LAYOUT_TYPE_INITIALIZATION ? new Point() : target.getRelativeCenterPoint();
    const {
      center: nextCenter,
      correction = new Point(),
      relativeCorrection = new Point()
    } = result;
    const offset = prevCenter.subtract(nextCenter).add(correction).transform(
    // in `initialization` we do not account for target's transformation matrix
    type === LAYOUT_TYPE_INITIALIZATION ? iMatrix : invertTransform(target.calcOwnMatrix()), true).add(relativeCorrection);
    return {
      result,
      prevCenter,
      nextCenter,
      offset
    };
  }
  commitLayout(context, layoutResult) {
    const {
      target
    } = context;
    const {
      result: {
        size
      },
      nextCenter
    } = layoutResult;
    // set dimensions
    target.set({
      width: size.x,
      height: size.y
    });
    // layout descendants
    this.layoutObjects(context, layoutResult);
    //  set position
    // in `initialization` we do not account for target's transformation matrix
    if (context.type === LAYOUT_TYPE_INITIALIZATION) {
      var _context$x, _context$y;
      // TODO: what about strokeWidth?
      target.set({
        left: (_context$x = context.x) !== null && _context$x !== void 0 ? _context$x : nextCenter.x + size.x * resolveOrigin(target.originX),
        top: (_context$y = context.y) !== null && _context$y !== void 0 ? _context$y : nextCenter.y + size.y * resolveOrigin(target.originY)
      });
    } else {
      target.setPositionByOrigin(nextCenter, CENTER, CENTER);
      // invalidate
      target.setCoords();
      target.set('dirty', true);
    }
  }
  layoutObjects(context, layoutResult) {
    const {
      target
    } = context;
    //  adjust objects to account for new center
    target.forEachObject(object => {
      object.group === target && this.layoutObject(context, layoutResult, object);
    });
    // adjust clip path to account for new center
    context.strategy.shouldLayoutClipPath(context) && this.layoutObject(context, layoutResult, target.clipPath);
  }

  /**
   * @param {FabricObject} object
   * @param {Point} offset
   */
  layoutObject(context, _ref, object) {
    let {
      offset
    } = _ref;
    // TODO: this is here for cache invalidation.
    // verify if this is necessary since we have explicit
    // cache invalidation at the end of commitLayout
    object.set({
      left: object.left + offset.x,
      top: object.top + offset.y
    });
  }
  onAfterLayout(context, layoutResult) {
    const {
      target,
      strategy,
      bubbles,
      prevStrategy: _,
      ...bubblingContext
    } = context;
    const {
      canvas
    } = target;

    //  fire layout event (event will fire only for layouts after initialization layout)
    target.fire('layout:after', {
      context,
      result: layoutResult
    });
    canvas && canvas.fire('object:layout:after', {
      context,
      result: layoutResult,
      target
    });

    //  bubble
    const parent = target.parent;
    if (bubbles && parent !== null && parent !== void 0 && parent.layoutManager) {
      //  add target to context#path
      (bubblingContext.path || (bubblingContext.path = [])).push(target);
      //  all parents should invalidate their layout
      parent.layoutManager.performLayout({
        ...bubblingContext,
        target: parent
      });
    }
    target.set('dirty', true);
  }
  dispose() {
    const {
      _subscriptions
    } = this;
    _subscriptions.forEach(disposers => disposers.forEach(d => d()));
    _subscriptions.clear();
  }
  toObject() {
    return {
      type: LAYOUT_MANAGER,
      strategy: this.strategy.constructor.type
    };
  }
  toJSON() {
    return this.toObject();
  }
}
classRegistry.setClass(LayoutManager, LAYOUT_MANAGER);

/**
 * This class handles the specific case of creating a group using {@link Group#fromObject} and is not meant to be used in any other case.
 * We could have used a boolean in the constructor, as we did previously, but we think the boolean
 * would stay in the group's constructor interface and create confusion, therefore it was removed.
 * This layout manager doesn't do anything and therefore keeps the exact layout the group had when {@link Group#toObject} was called.
 */
class NoopLayoutManager extends LayoutManager {
  performLayout() {}
}
const groupDefaultValues = {
  strokeWidth: 0,
  subTargetCheck: false,
  interactive: false
};

/**
 * @fires object:added
 * @fires object:removed
 * @fires layout:before
 * @fires layout:after
 */
class Group extends createCollectionMixin(FabricObject) {
  static getDefaults() {
    return {
      ...super.getDefaults(),
      ...Group.ownDefaults
    };
  }

  /**
   * Constructor
   *
   * @param {FabricObject[]} [objects] instance objects
   * @param {Object} [options] Options object
   */
  constructor() {
    let objects = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super();
    /**
     * Used to optimize performance
     * set to `false` if you don't need contained objects to be targets of events
     * @type boolean
     */
    /**
     * Used to allow targeting of object inside groups.
     * set to true if you want to select an object inside a group.\
     * **REQUIRES** `subTargetCheck` set to true
     * This will be not removed but slowly replaced with a method setInteractive
     * that will take care of enabling subTargetCheck and necessary object events.
     * There is too much attached to group interactivity to just be evaluated by a
     * boolean in the code
     * @deprecated
     * @type boolean
     */
    /**
     * Used internally to optimize performance
     * Once an object is selected, instance is rendered without the selected object.
     * This way instance is cached only once for the entire interaction with the selected object.
     * @private
     */
    _defineProperty(this, "_activeObjects", []);
    _defineProperty(this, "__objectSelectionTracker", void 0);
    _defineProperty(this, "__objectSelectionDisposer", void 0);
    Object.assign(this, Group.ownDefaults);
    this.setOptions(options);
    this.groupInit(objects, options);
  }

  /**
   * Shared code between group and active selection
   * Meant to be used by the constructor.
   */
  groupInit(objects, options) {
    var _options$layoutManage;
    this._objects = [...objects]; // Avoid unwanted mutations of Collection to affect the caller

    this.__objectSelectionTracker = this.__objectSelectionMonitor.bind(this, true);
    this.__objectSelectionDisposer = this.__objectSelectionMonitor.bind(this, false);
    this.forEachObject(object => {
      this.enterGroup(object, false);
    });

    // perform initial layout
    this.layoutManager = (_options$layoutManage = options.layoutManager) !== null && _options$layoutManage !== void 0 ? _options$layoutManage : new LayoutManager();
    this.layoutManager.performLayout({
      type: LAYOUT_TYPE_INITIALIZATION,
      target: this,
      targets: [...objects],
      // @TODO remove this concept from the layout manager.
      // Layout manager will calculate the correct position,
      // group options can override it later.
      x: options.left,
      y: options.top
    });
  }

  /**
   * Checks if object can enter group and logs relevant warnings
   * @private
   * @param {FabricObject} object
   * @returns
   */
  canEnterGroup(object) {
    if (object === this || this.isDescendantOf(object)) {
      //  prevent circular object tree
      log('error', 'Group: circular object trees are not supported, this call has no effect');
      return false;
    } else if (this._objects.indexOf(object) !== -1) {
      // is already in the objects array
      log('error', 'Group: duplicate objects are not supported inside group, this call has no effect');
      return false;
    }
    return true;
  }

  /**
   * Override this method to enhance performance (for groups with a lot of objects).
   * If Overriding, be sure not pass illegal objects to group - it will break your app.
   * @private
   */
  _filterObjectsBeforeEnteringGroup(objects) {
    return objects.filter((object, index, array) => {
      // can enter AND is the first occurrence of the object in the passed args (to prevent adding duplicates)
      return this.canEnterGroup(object) && array.indexOf(object) === index;
    });
  }

  /**
   * Add objects
   * @param {...FabricObject[]} objects
   */
  add() {
    for (var _len = arguments.length, objects = new Array(_len), _key = 0; _key < _len; _key++) {
      objects[_key] = arguments[_key];
    }
    const allowedObjects = this._filterObjectsBeforeEnteringGroup(objects);
    const size = super.add(...allowedObjects);
    this._onAfterObjectsChange(LAYOUT_TYPE_ADDED, allowedObjects);
    return size;
  }

  /**
   * Inserts an object into collection at specified index
   * @param {FabricObject[]} objects Object to insert
   * @param {Number} index Index to insert object at
   */
  insertAt(index) {
    for (var _len2 = arguments.length, objects = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      objects[_key2 - 1] = arguments[_key2];
    }
    const allowedObjects = this._filterObjectsBeforeEnteringGroup(objects);
    const size = super.insertAt(index, ...allowedObjects);
    this._onAfterObjectsChange(LAYOUT_TYPE_ADDED, allowedObjects);
    return size;
  }

  /**
   * Remove objects
   * @param {...FabricObject[]} objects
   * @returns {FabricObject[]} removed objects
   */
  remove() {
    const removed = super.remove(...arguments);
    this._onAfterObjectsChange(LAYOUT_TYPE_REMOVED, removed);
    return removed;
  }
  _onObjectAdded(object) {
    this.enterGroup(object, true);
    this.fire('object:added', {
      target: object
    });
    object.fire('added', {
      target: this
    });
  }

  /**
   * @private
   * @param {FabricObject} object
   * @param {boolean} [removeParentTransform] true if object should exit group without applying group's transform to it
   */
  _onObjectRemoved(object, removeParentTransform) {
    this.exitGroup(object, removeParentTransform);
    this.fire('object:removed', {
      target: object
    });
    object.fire('removed', {
      target: this
    });
  }

  /**
   * @private
   * @param {'added'|'removed'} type
   * @param {FabricObject[]} targets
   */
  _onAfterObjectsChange(type, targets) {
    this.layoutManager.performLayout({
      type,
      targets,
      target: this
    });
  }
  _onStackOrderChanged() {
    this._set('dirty', true);
  }

  /**
   * @private
   * @param {string} key
   * @param {*} value
   */
  _set(key, value) {
    const prev = this[key];
    super._set(key, value);
    if (key === 'canvas' && prev !== value) {
      (this._objects || []).forEach(object => {
        object._set(key, value);
      });
    }
    return this;
  }

  /**
   * @private
   */
  _shouldSetNestedCoords() {
    return this.subTargetCheck;
  }

  /**
   * Remove all objects
   * @returns {FabricObject[]} removed objects
   */
  removeAll() {
    this._activeObjects = [];
    return this.remove(...this._objects);
  }

  /**
   * keeps track of the selected objects
   * @private
   */
  __objectSelectionMonitor(selected, _ref) {
    let {
      target: object
    } = _ref;
    const activeObjects = this._activeObjects;
    if (selected) {
      activeObjects.push(object);
      this._set('dirty', true);
    } else if (activeObjects.length > 0) {
      const index = activeObjects.indexOf(object);
      if (index > -1) {
        activeObjects.splice(index, 1);
        this._set('dirty', true);
      }
    }
  }

  /**
   * @private
   * @param {boolean} watch
   * @param {FabricObject} object
   */
  _watchObject(watch, object) {
    //  make sure we listen only once
    watch && this._watchObject(false, object);
    if (watch) {
      object.on('selected', this.__objectSelectionTracker);
      object.on('deselected', this.__objectSelectionDisposer);
    } else {
      object.off('selected', this.__objectSelectionTracker);
      object.off('deselected', this.__objectSelectionDisposer);
    }
  }

  /**
   * @private
   * @param {FabricObject} object
   * @param {boolean} [removeParentTransform] true if object is in canvas coordinate plane
   */
  enterGroup(object, removeParentTransform) {
    object.group && object.group.remove(object);
    object._set('parent', this);
    this._enterGroup(object, removeParentTransform);
  }

  /**
   * @private
   * @param {FabricObject} object
   * @param {boolean} [removeParentTransform] true if object is in canvas coordinate plane
   */
  _enterGroup(object, removeParentTransform) {
    if (removeParentTransform) {
      // can this be converted to utils (sendObjectToPlane)?
      applyTransformToObject(object, multiplyTransformMatrices(invertTransform(this.calcTransformMatrix()), object.calcTransformMatrix()));
    }
    this._shouldSetNestedCoords() && object.setCoords();
    object._set('group', this);
    object._set('canvas', this.canvas);
    this._watchObject(true, object);
    const activeObject = this.canvas && this.canvas.getActiveObject && this.canvas.getActiveObject();
    // if we are adding the activeObject in a group
    if (activeObject && (activeObject === object || object.isDescendantOf(activeObject))) {
      this._activeObjects.push(object);
    }
  }

  /**
   * @private
   * @param {FabricObject} object
   * @param {boolean} [removeParentTransform] true if object should exit group without applying group's transform to it
   */
  exitGroup(object, removeParentTransform) {
    this._exitGroup(object, removeParentTransform);
    object._set('parent', undefined);
    object._set('canvas', undefined);
  }

  /**
   * Executes the inner fabric logic of exiting a group.
   * - Stop watching the object
   * - Remove the object from the optimization map this._activeObjects
   * - unset the group property of the object
   * @protected
   * @param {FabricObject} object
   * @param {boolean} [removeParentTransform] true if object should exit group without applying group's transform to it
   */
  _exitGroup(object, removeParentTransform) {
    object._set('group', undefined);
    if (!removeParentTransform) {
      applyTransformToObject(object, multiplyTransformMatrices(this.calcTransformMatrix(), object.calcTransformMatrix()));
      object.setCoords();
    }
    this._watchObject(false, object);
    const index = this._activeObjects.length > 0 ? this._activeObjects.indexOf(object) : -1;
    if (index > -1) {
      this._activeObjects.splice(index, 1);
    }
  }

  /**
   * Decide if the group should cache or not. Create its own cache level
   * needsItsOwnCache should be used when the object drawing method requires
   * a cache step.
   * Generally you do not cache objects in groups because the group is already cached.
   * @return {Boolean}
   */
  shouldCache() {
    const ownCache = FabricObject.prototype.shouldCache.call(this);
    if (ownCache) {
      for (let i = 0; i < this._objects.length; i++) {
        if (this._objects[i].willDrawShadow()) {
          this.ownCaching = false;
          return false;
        }
      }
    }
    return ownCache;
  }

  /**
   * Check if this object or a child object will cast a shadow
   * @return {Boolean}
   */
  willDrawShadow() {
    if (super.willDrawShadow()) {
      return true;
    }
    for (let i = 0; i < this._objects.length; i++) {
      if (this._objects[i].willDrawShadow()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if instance or its group are caching, recursively up
   * @return {Boolean}
   */
  isOnACache() {
    return this.ownCaching || !!this.parent && this.parent.isOnACache();
  }

  /**
   * Execute the drawing operation for an object on a specified context
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  drawObject(ctx, forClipping, context) {
    this._renderBackground(ctx);
    for (let i = 0; i < this._objects.length; i++) {
      var _this$canvas;
      const obj = this._objects[i];
      // TODO: handle rendering edge case somehow
      if ((_this$canvas = this.canvas) !== null && _this$canvas !== void 0 && _this$canvas.preserveObjectStacking && obj.group !== this) {
        ctx.save();
        ctx.transform(...invertTransform(this.calcTransformMatrix()));
        obj.render(ctx);
        ctx.restore();
      } else if (obj.group === this) {
        obj.render(ctx);
      }
    }
    this._drawClipPath(ctx, this.clipPath, context);
  }

  /**
   * @override
   * @return {Boolean}
   */
  setCoords() {
    super.setCoords();
    this._shouldSetNestedCoords() && this.forEachObject(object => object.setCoords());
  }
  triggerLayout() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.layoutManager.performLayout({
      target: this,
      type: LAYOUT_TYPE_IMPERATIVE,
      ...options
    });
  }

  /**
   * Renders instance on a given context
   * @param {CanvasRenderingContext2D} ctx context to render instance on
   */
  render(ctx) {
    this._transformDone = true;
    super.render(ctx);
    this._transformDone = false;
  }

  /**
   *
   * @private
   * @param {'toObject'|'toDatalessObject'} [method]
   * @param {string[]} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @returns {FabricObject[]} serialized objects
   */
  __serializeObjects(method, propertiesToInclude) {
    const _includeDefaultValues = this.includeDefaultValues;
    return this._objects.filter(function (obj) {
      return !obj.excludeFromExport;
    }).map(function (obj) {
      const originalDefaults = obj.includeDefaultValues;
      obj.includeDefaultValues = _includeDefaultValues;
      const data = obj[method || 'toObject'](propertiesToInclude);
      obj.includeDefaultValues = originalDefaults;
      // delete data.version;
      return data;
    });
  }

  /**
   * Returns object representation of an instance
   * @param {string[]} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject() {
    let propertiesToInclude = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    const layoutManager = this.layoutManager.toObject();
    return {
      ...super.toObject(['subTargetCheck', 'interactive', ...propertiesToInclude]),
      ...(layoutManager.strategy !== 'fit-content' || this.includeDefaultValues ? {
        layoutManager
      } : {}),
      objects: this.__serializeObjects('toObject', propertiesToInclude)
    };
  }
  toString() {
    return `#<Group: (${this.complexity()})>`;
  }
  dispose() {
    this.layoutManager.unsubscribeTargets({
      targets: this.getObjects(),
      target: this
    });
    this._activeObjects = [];
    this.forEachObject(object => {
      this._watchObject(false, object);
      object.dispose();
    });
    super.dispose();
  }

  /**
   * @private
   */
  _createSVGBgRect(reviver) {
    if (!this.backgroundColor) {
      return '';
    }
    const fillStroke = Rect.prototype._toSVG.call(this);
    const commons = fillStroke.indexOf('COMMON_PARTS');
    fillStroke[commons] = 'for="group" ';
    const markup = fillStroke.join('');
    return reviver ? reviver(markup) : markup;
  }

  /**
   * Returns svg representation of an instance
   * @param {TSVGReviver} [reviver] Method for further parsing of svg representation.
   * @return {String} svg representation of an instance
   */
  _toSVG(reviver) {
    const svgString = ['<g ', 'COMMON_PARTS', ' >\n'];
    const bg = this._createSVGBgRect(reviver);
    bg && svgString.push('\t\t', bg);
    for (let i = 0; i < this._objects.length; i++) {
      svgString.push('\t\t', this._objects[i].toSVG(reviver));
    }
    svgString.push('</g>\n');
    return svgString;
  }

  /**
   * Returns styles-string for svg-export, specific version for group
   * @return {String}
   */
  getSvgStyles() {
    const opacity = typeof this.opacity !== 'undefined' && this.opacity !== 1 ? `opacity: ${this.opacity};` : '',
      visibility = this.visible ? '' : ' visibility: hidden;';
    return [opacity, this.getSvgFilter(), visibility].join('');
  }

  /**
   * Returns svg clipPath representation of an instance
   * @param {Function} [reviver] Method for further parsing of svg representation.
   * @return {String} svg representation of an instance
   */
  toClipPathSVG(reviver) {
    const svgString = [];
    const bg = this._createSVGBgRect(reviver);
    bg && svgString.push('\t', bg);
    for (let i = 0; i < this._objects.length; i++) {
      svgString.push('\t', this._objects[i].toClipPathSVG(reviver));
    }
    return this._createBaseClipPathSVGMarkup(svgString, {
      reviver
    });
  }

  /**
   * @todo support loading from svg
   * @private
   * @param {Object} object Object to create a group from
   * @returns {Promise<Group>}
   */
  static fromObject(_ref2, abortable) {
    let {
      type,
      objects = [],
      layoutManager,
      ...options
    } = _ref2;
    return Promise.all([enlivenObjects(objects, abortable), enlivenObjectEnlivables(options, abortable)]).then(_ref3 => {
      let [objects, hydratedOptions] = _ref3;
      const group = new this(objects, {
        ...options,
        ...hydratedOptions,
        layoutManager: new NoopLayoutManager()
      });
      if (layoutManager) {
        const layoutClass = classRegistry.getClass(layoutManager.type);
        const strategyClass = classRegistry.getClass(layoutManager.strategy);
        group.layoutManager = new layoutClass(new strategyClass());
      } else {
        group.layoutManager = new LayoutManager();
      }
      group.layoutManager.subscribeTargets({
        type: LAYOUT_TYPE_INITIALIZATION,
        target: group,
        targets: group.getObjects()
      });
      group.setCoords();
      return group;
    });
  }
}
_defineProperty(Group, "type", 'Group');
_defineProperty(Group, "ownDefaults", groupDefaultValues);
classRegistry.setClass(Group);

/**
 * TODO experiment with different layout manager and svg results ( fixed fit content )
 * Groups SVG elements (usually those retrieved from SVG document)
 * @param {FabricObject[]} elements FabricObject(s) parsed from svg, to group
 * @return {FabricObject | Group}
 */
const groupSVGElements = (elements, options) => {
  if (elements && elements.length === 1) {
    return elements[0];
  }
  return new Group(elements, options);
};

/**
 * Finds the scale for the object source to fit inside the object destination,
 * keeping aspect ratio intact.
 * respect the total allowed area for the cache.
 * @param {TSize} source natural unscaled size of the object
 * @param {TSize} destination natural unscaled size of the object
 * @return {Number} scale factor to apply to source to fit into destination
 */
const findScaleToFit = (source, destination) => Math.min(destination.width / source.width, destination.height / source.height);

/**
 * Finds the scale for the object source to cover entirely the object destination,
 * keeping aspect ratio intact.
 * respect the total allowed area for the cache.
 * @param {TSize} source natural unscaled size of the object
 * @param {TSize} destination natural unscaled size of the object
 * @return {Number} scale factor to apply to source to cover destination
 */
const findScaleToCover = (source, destination) => Math.max(destination.width / source.width, destination.height / source.height);

const commaWsp = `\\s*,?\\s*`;

/**
 * p for param
 * using "bad naming" here because it makes the regex much easier to read
 * p is a number that is preceded by an arbitary number of spaces, maybe 0,
 * a comma or not, and then possibly more spaces or not.
 */
const p = `${commaWsp}(${reNum})`;

// const reMoveToCommand = `(M) ?(?:${p}${p} ?)+`;

// const reLineCommand = `(L) ?(?:${p}${p} ?)+`;

// const reHorizontalLineCommand = `(H) ?(?:${p} ?)+`;

// const reVerticalLineCommand = `(V) ?(?:${p} ?)+`;

// const reClosePathCommand = String.raw`(Z)\s*`;

// const reCubicCurveCommand = `(C) ?(?:${p}${p}${p}${p}${p}${p} ?)+`;

// const reCubicCurveShortcutCommand = `(S) ?(?:${p}${p}${p}${p} ?)+`;

// const reQuadraticCurveCommand = `(Q) ?(?:${p}${p}${p}${p} ?)+`;

// const reQuadraticCurveShortcutCommand = `(T) ?(?:${p}${p} ?)+`;

const reArcCommandPoints = `${p}${p}${p}${commaWsp}([01])${commaWsp}([01])${p}${p}`;
// const reArcCommand = `(A) ?(?:${reArcCommandPoints} ?)+`;

// export const rePathCommandGroups =
//   `(?:(?:${reMoveToCommand})` +
//   `|(?:${reLineCommand})` +
//   `|(?:${reHorizontalLineCommand})` +
//   `|(?:${reVerticalLineCommand})` +
//   `|(?:${reClosePathCommand})` +
//   `|(?:${reCubicCurveCommand})` +
//   `|(?:${reCubicCurveShortcutCommand})` +
//   `|(?:${reQuadraticCurveCommand})` +
//   `|(?:${reQuadraticCurveShortcutCommand})` +
//   `|(?:${reArcCommand}))`;

const rePathCommand = '[mzlhvcsqta][^mzlhvcsqta]*';

/**
 * Commands that may be repeated
 */
const repeatedCommands = {
  m: 'l',
  M: 'L'
};

/**
 * Convert an arc of a rotated ellipse to a Bezier Curve
 * @param {TRadian} theta1 start of the arc
 * @param {TRadian} theta2 end of the arc
 * @param cosTh cosine of the angle of rotation
 * @param sinTh sine of the angle of rotation
 * @param rx x-axis radius (before rotation)
 * @param ry y-axis radius (before rotation)
 * @param cx1 center x of the ellipse
 * @param cy1 center y of the ellipse
 * @param mT
 * @param fromX starting point of arc x
 * @param fromY starting point of arc y
 */
const segmentToBezier = (theta1, theta2, cosTh, sinTh, rx, ry, cx1, cy1, mT, fromX, fromY) => {
  const costh1 = cos(theta1),
    sinth1 = sin(theta1),
    costh2 = cos(theta2),
    sinth2 = sin(theta2),
    toX = cosTh * rx * costh2 - sinTh * ry * sinth2 + cx1,
    toY = sinTh * rx * costh2 + cosTh * ry * sinth2 + cy1,
    cp1X = fromX + mT * (-cosTh * rx * sinth1 - sinTh * ry * costh1),
    cp1Y = fromY + mT * (-sinTh * rx * sinth1 + cosTh * ry * costh1),
    cp2X = toX + mT * (cosTh * rx * sinth2 + sinTh * ry * costh2),
    cp2Y = toY + mT * (sinTh * rx * sinth2 - cosTh * ry * costh2);
  return ['C', cp1X, cp1Y, cp2X, cp2Y, toX, toY];
};

/**
 * Adapted from {@link http://dxr.mozilla.org/mozilla-central/source/dom/svg/SVGPathDataParser.cpp}
 * by Andrea Bogazzi code is under MPL. if you don't have a copy of the license you can take it here
 * http://mozilla.org/MPL/2.0/
 * @param toX
 * @param toY
 * @param rx
 * @param ry
 * @param {number} large 0 or 1 flag
 * @param {number} sweep 0 or 1 flag
 * @param rotateX
 */
const arcToSegments = (toX, toY, rx, ry, large, sweep, rotateX) => {
  if (rx === 0 || ry === 0) {
    return [];
  }
  let fromX = 0,
    fromY = 0,
    root = 0;
  const PI = Math.PI,
    theta = rotateX * PiBy180,
    sinTheta = sin(theta),
    cosTh = cos(theta),
    px = 0.5 * (-cosTh * toX - sinTheta * toY),
    py = 0.5 * (-cosTh * toY + sinTheta * toX),
    rx2 = rx ** 2,
    ry2 = ry ** 2,
    py2 = py ** 2,
    px2 = px ** 2,
    pl = rx2 * ry2 - rx2 * py2 - ry2 * px2;
  let _rx = Math.abs(rx);
  let _ry = Math.abs(ry);
  if (pl < 0) {
    const s = Math.sqrt(1 - pl / (rx2 * ry2));
    _rx *= s;
    _ry *= s;
  } else {
    root = (large === sweep ? -1 : 1.0) * Math.sqrt(pl / (rx2 * py2 + ry2 * px2));
  }
  const cx = root * _rx * py / _ry,
    cy = -root * _ry * px / _rx,
    cx1 = cosTh * cx - sinTheta * cy + toX * 0.5,
    cy1 = sinTheta * cx + cosTh * cy + toY * 0.5;
  let mTheta = calcVectorAngle(1, 0, (px - cx) / _rx, (py - cy) / _ry);
  let dtheta = calcVectorAngle((px - cx) / _rx, (py - cy) / _ry, (-px - cx) / _rx, (-py - cy) / _ry);
  if (sweep === 0 && dtheta > 0) {
    dtheta -= 2 * PI;
  } else if (sweep === 1 && dtheta < 0) {
    dtheta += 2 * PI;
  }

  // Convert into cubic bezier segments <= 90deg
  const segments = Math.ceil(Math.abs(dtheta / PI * 2)),
    result = [],
    mDelta = dtheta / segments,
    mT = 8 / 3 * Math.sin(mDelta / 4) * Math.sin(mDelta / 4) / Math.sin(mDelta / 2);
  let th3 = mTheta + mDelta;
  for (let i = 0; i < segments; i++) {
    result[i] = segmentToBezier(mTheta, th3, cosTh, sinTheta, _rx, _ry, cx1, cy1, mT, fromX, fromY);
    fromX = result[i][5];
    fromY = result[i][6];
    mTheta = th3;
    th3 += mDelta;
  }
  return result;
};

/**
 * @private
 * Calculate the angle between two vectors
 * @param ux u endpoint x
 * @param uy u endpoint y
 * @param vx v endpoint x
 * @param vy v endpoint y
 */
const calcVectorAngle = (ux, uy, vx, vy) => {
  const ta = Math.atan2(uy, ux),
    tb = Math.atan2(vy, vx);
  if (tb >= ta) {
    return tb - ta;
  } else {
    return 2 * Math.PI - (ta - tb);
  }
};

// functions for the Cubic beizer
// taken from: https://github.com/konvajs/konva/blob/7.0.5/src/shapes/Path.ts#L350
const CB1 = t => t ** 3;
const CB2 = t => 3 * t ** 2 * (1 - t);
const CB3 = t => 3 * t * (1 - t) ** 2;
const CB4 = t => (1 - t) ** 3;

/**
 * Calculate bounding box of a cubic Bezier curve
 * Taken from http://jsbin.com/ivomiq/56/edit (no credits available)
 * TODO: can we normalize this with the starting points set at 0 and then translated the bbox?
 * @param {number} begx starting point
 * @param {number} begy
 * @param {number} cp1x first control point
 * @param {number} cp1y
 * @param {number} cp2x second control point
 * @param {number} cp2y
 * @param {number} endx end of bezier
 * @param {number} endy
 * @return {TRectBounds} the rectangular bounds
 */
function getBoundsOfCurve(begx, begy, cp1x, cp1y, cp2x, cp2y, endx, endy) {
  let argsString;
  if (config.cachesBoundsOfCurve) {
    // eslint-disable-next-line
    argsString = [...arguments].join();
    if (cache.boundsOfCurveCache[argsString]) {
      return cache.boundsOfCurveCache[argsString];
    }
  }
  const sqrt = Math.sqrt,
    abs = Math.abs,
    tvalues = [],
    bounds = [[0, 0], [0, 0]];
  let b = 6 * begx - 12 * cp1x + 6 * cp2x;
  let a = -3 * begx + 9 * cp1x - 9 * cp2x + 3 * endx;
  let c = 3 * cp1x - 3 * begx;
  for (let i = 0; i < 2; ++i) {
    if (i > 0) {
      b = 6 * begy - 12 * cp1y + 6 * cp2y;
      a = -3 * begy + 9 * cp1y - 9 * cp2y + 3 * endy;
      c = 3 * cp1y - 3 * begy;
    }
    if (abs(a) < 1e-12) {
      if (abs(b) < 1e-12) {
        continue;
      }
      const t = -c / b;
      if (0 < t && t < 1) {
        tvalues.push(t);
      }
      continue;
    }
    const b2ac = b * b - 4 * c * a;
    if (b2ac < 0) {
      continue;
    }
    const sqrtb2ac = sqrt(b2ac);
    const t1 = (-b + sqrtb2ac) / (2 * a);
    if (0 < t1 && t1 < 1) {
      tvalues.push(t1);
    }
    const t2 = (-b - sqrtb2ac) / (2 * a);
    if (0 < t2 && t2 < 1) {
      tvalues.push(t2);
    }
  }
  let j = tvalues.length;
  const jlen = j;
  const iterator = getPointOnCubicBezierIterator(begx, begy, cp1x, cp1y, cp2x, cp2y, endx, endy);
  while (j--) {
    const {
      x,
      y
    } = iterator(tvalues[j]);
    bounds[0][j] = x;
    bounds[1][j] = y;
  }
  bounds[0][jlen] = begx;
  bounds[1][jlen] = begy;
  bounds[0][jlen + 1] = endx;
  bounds[1][jlen + 1] = endy;
  const result = [new Point(Math.min(...bounds[0]), Math.min(...bounds[1])), new Point(Math.max(...bounds[0]), Math.max(...bounds[1]))];
  if (config.cachesBoundsOfCurve) {
    cache.boundsOfCurveCache[argsString] = result;
  }
  return result;
}

/**
 * Converts arc to a bunch of cubic Bezier curves
 * @param {number} fx starting point x
 * @param {number} fy starting point y
 * @param {TParsedArcCommand} coords Arc command
 */
const fromArcToBeziers = (fx, fy, _ref) => {
  let [_, rx, ry, rot, large, sweep, tx, ty] = _ref;
  const segsNorm = arcToSegments(tx - fx, ty - fy, rx, ry, large, sweep, rot);
  for (let i = 0, len = segsNorm.length; i < len; i++) {
    segsNorm[i][1] += fx;
    segsNorm[i][2] += fy;
    segsNorm[i][3] += fx;
    segsNorm[i][4] += fy;
    segsNorm[i][5] += fx;
    segsNorm[i][6] += fy;
  }
  return segsNorm;
};

/**
 * This function takes a parsed SVG path and makes it simpler for fabricJS logic.
 * Simplification consist of:
 * - All commands converted to absolute (lowercase to uppercase)
 * - S converted to C
 * - T converted to Q
 * - A converted to C
 * @param {TComplexPathData} path the array of commands of a parsed SVG path for `Path`
 * @return {TSimplePathData} the simplified array of commands of a parsed SVG path for `Path`
 * TODO: figure out how to remove the type assertions in a nice way
 */
const makePathSimpler = path => {
  // x and y represent the last point of the path, AKA the previous command point.
  // we add them to each relative command to make it an absolute comment.
  // we also swap the v V h H with L, because are easier to transform.
  let x = 0,
    y = 0;
  // x1 and y1 represent the last point of the subpath. the subpath is started with
  // m or M command. When a z or Z command is drawn, x and y need to be resetted to
  // the last x1 and y1.
  let x1 = 0,
    y1 = 0;
  // previous will host the letter of the previous command, to handle S and T.
  // controlX and controlY will host the previous reflected control point
  const destinationPath = [];
  let previous,
    // placeholders
    controlX = 0,
    controlY = 0;
  for (const parsedCommand of path) {
    const current = [...parsedCommand];
    let converted;
    switch (current[0] // first letter
    ) {
      case 'l':
        // lineto, relative
        current[1] += x;
        current[2] += y;
      // falls through
      case 'L':
        x = current[1];
        y = current[2];
        converted = ['L', x, y];
        break;
      case 'h':
        // horizontal lineto, relative
        current[1] += x;
      // falls through
      case 'H':
        x = current[1];
        converted = ['L', x, y];
        break;
      case 'v':
        // vertical lineto, relative
        current[1] += y;
      // falls through
      case 'V':
        y = current[1];
        converted = ['L', x, y];
        break;
      case 'm':
        // moveTo, relative
        current[1] += x;
        current[2] += y;
      // falls through
      case 'M':
        x = current[1];
        y = current[2];
        x1 = current[1];
        y1 = current[2];
        converted = ['M', x, y];
        break;
      case 'c':
        // bezierCurveTo, relative
        current[1] += x;
        current[2] += y;
        current[3] += x;
        current[4] += y;
        current[5] += x;
        current[6] += y;
      // falls through
      case 'C':
        controlX = current[3];
        controlY = current[4];
        x = current[5];
        y = current[6];
        converted = ['C', current[1], current[2], controlX, controlY, x, y];
        break;
      case 's':
        // shorthand cubic bezierCurveTo, relative
        current[1] += x;
        current[2] += y;
        current[3] += x;
        current[4] += y;
      // falls through
      case 'S':
        // would be sScC but since we are swapping sSc for C, we check just that.
        if (previous === 'C') {
          // calculate reflection of previous control points
          controlX = 2 * x - controlX;
          controlY = 2 * y - controlY;
        } else {
          // If there is no previous command or if the previous command was not a C, c, S, or s,
          // the control point is coincident with the current point
          controlX = x;
          controlY = y;
        }
        x = current[3];
        y = current[4];
        converted = ['C', controlX, controlY, current[1], current[2], x, y];
        // converted[3] and converted[4] are NOW the second control point.
        // we keep it for the next reflection.
        controlX = converted[3];
        controlY = converted[4];
        break;
      case 'q':
        // quadraticCurveTo, relative
        current[1] += x;
        current[2] += y;
        current[3] += x;
        current[4] += y;
      // falls through
      case 'Q':
        controlX = current[1];
        controlY = current[2];
        x = current[3];
        y = current[4];
        converted = ['Q', controlX, controlY, x, y];
        break;
      case 't':
        // shorthand quadraticCurveTo, relative
        current[1] += x;
        current[2] += y;
      // falls through
      case 'T':
        if (previous === 'Q') {
          // calculate reflection of previous control point
          controlX = 2 * x - controlX;
          controlY = 2 * y - controlY;
        } else {
          // If there is no previous command or if the previous command was not a Q, q, T or t,
          // assume the control point is coincident with the current point
          controlX = x;
          controlY = y;
        }
        x = current[1];
        y = current[2];
        converted = ['Q', controlX, controlY, x, y];
        break;
      case 'a':
        current[6] += x;
        current[7] += y;
      // falls through
      case 'A':
        fromArcToBeziers(x, y, current).forEach(b => destinationPath.push(b));
        x = current[6];
        y = current[7];
        break;
      case 'z':
      case 'Z':
        x = x1;
        y = y1;
        converted = ['Z'];
        break;
    }
    if (converted) {
      destinationPath.push(converted);
      previous = converted[0];
    } else {
      previous = '';
    }
  }
  return destinationPath;
};

// todo verify if we can just use the point class here
/**
 * Calc length from point x1,y1 to x2,y2
 * @param {number} x1 starting point x
 * @param {number} y1 starting point y
 * @param {number} x2 starting point x
 * @param {number} y2 starting point y
 * @return {number} length of segment
 */
const calcLineLength = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

/**
 * Get an iterator that takes a percentage and returns a point
 * @param {number} begx
 * @param {number} begy
 * @param {number} cp1x
 * @param {number} cp1y
 * @param {number} cp2x
 * @param {number} cp2y
 * @param {number} endx
 * @param {number} endy
 */
const getPointOnCubicBezierIterator = (begx, begy, cp1x, cp1y, cp2x, cp2y, endx, endy) => pct => {
  const c1 = CB1(pct),
    c2 = CB2(pct),
    c3 = CB3(pct),
    c4 = CB4(pct);
  return new Point(endx * c1 + cp2x * c2 + cp1x * c3 + begx * c4, endy * c1 + cp2y * c2 + cp1y * c3 + begy * c4);
};
const QB1 = t => t ** 2;
const QB2 = t => 2 * t * (1 - t);
const QB3 = t => (1 - t) ** 2;
const getTangentCubicIterator = (p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y) => pct => {
  const qb1 = QB1(pct),
    qb2 = QB2(pct),
    qb3 = QB3(pct),
    tangentX = 3 * (qb3 * (p2x - p1x) + qb2 * (p3x - p2x) + qb1 * (p4x - p3x)),
    tangentY = 3 * (qb3 * (p2y - p1y) + qb2 * (p3y - p2y) + qb1 * (p4y - p3y));
  return Math.atan2(tangentY, tangentX);
};
const getPointOnQuadraticBezierIterator = (p1x, p1y, p2x, p2y, p3x, p3y) => pct => {
  const c1 = QB1(pct),
    c2 = QB2(pct),
    c3 = QB3(pct);
  return new Point(p3x * c1 + p2x * c2 + p1x * c3, p3y * c1 + p2y * c2 + p1y * c3);
};
const getTangentQuadraticIterator = (p1x, p1y, p2x, p2y, p3x, p3y) => pct => {
  const invT = 1 - pct,
    tangentX = 2 * (invT * (p2x - p1x) + pct * (p3x - p2x)),
    tangentY = 2 * (invT * (p2y - p1y) + pct * (p3y - p2y));
  return Math.atan2(tangentY, tangentX);
};

// this will run over a path segment (a cubic or quadratic segment) and approximate it
// with 100 segments. This will good enough to calculate the length of the curve
const pathIterator = (iterator, x1, y1) => {
  let tempP = new Point(x1, y1),
    tmpLen = 0;
  for (let perc = 1; perc <= 100; perc += 1) {
    const p = iterator(perc / 100);
    tmpLen += calcLineLength(tempP.x, tempP.y, p.x, p.y);
    tempP = p;
  }
  return tmpLen;
};

/**
 * Given a pathInfo, and a distance in pixels, find the percentage from 0 to 1
 * that correspond to that pixels run over the path.
 * The percentage will be then used to find the correct point on the canvas for the path.
 * @param {Array} segInfo fabricJS collection of information on a parsed path
 * @param {number} distance from starting point, in pixels.
 * @return {TPointAngle} info object with x and y ( the point on canvas ) and angle, the tangent on that point;
 */
const findPercentageForDistance = (segInfo, distance) => {
  let perc = 0,
    tmpLen = 0,
    tempP = {
      x: segInfo.x,
      y: segInfo.y
    },
    p = {
      ...tempP
    },
    nextLen,
    nextStep = 0.01,
    lastPerc = 0;
  // nextStep > 0.0001 covers 0.00015625 that 1/64th of 1/100
  // the path
  const iterator = segInfo.iterator,
    angleFinder = segInfo.angleFinder;
  while (tmpLen < distance && nextStep > 0.0001) {
    p = iterator(perc);
    lastPerc = perc;
    nextLen = calcLineLength(tempP.x, tempP.y, p.x, p.y);
    // compare tmpLen each cycle with distance, decide next perc to test.
    if (nextLen + tmpLen > distance) {
      // we discard this step and we make smaller steps.
      perc -= nextStep;
      nextStep /= 2;
    } else {
      tempP = p;
      perc += nextStep;
      tmpLen += nextLen;
    }
  }
  return {
    ...p,
    angle: angleFinder(lastPerc)
  };
};

/**
 * Run over a parsed and simplified path and extract some information (length of each command and starting point)
 * @param {TSimplePathData} path parsed path commands
 * @return {TPathSegmentInfo[]} path commands information
 */
const getPathSegmentsInfo = path => {
  let totalLength = 0,
    //x2 and y2 are the coords of segment start
    //x1 and y1 are the coords of the current point
    x1 = 0,
    y1 = 0,
    x2 = 0,
    y2 = 0,
    iterator,
    tempInfo;
  const info = [];
  for (const current of path) {
    const basicInfo = {
      x: x1,
      y: y1,
      command: current[0],
      length: 0
    };
    switch (current[0] //first letter
    ) {
      case 'M':
        tempInfo = basicInfo;
        tempInfo.x = x2 = x1 = current[1];
        tempInfo.y = y2 = y1 = current[2];
        break;
      case 'L':
        tempInfo = basicInfo;
        tempInfo.length = calcLineLength(x1, y1, current[1], current[2]);
        x1 = current[1];
        y1 = current[2];
        break;
      case 'C':
        iterator = getPointOnCubicBezierIterator(x1, y1, current[1], current[2], current[3], current[4], current[5], current[6]);
        tempInfo = basicInfo;
        tempInfo.iterator = iterator;
        tempInfo.angleFinder = getTangentCubicIterator(x1, y1, current[1], current[2], current[3], current[4], current[5], current[6]);
        tempInfo.length = pathIterator(iterator, x1, y1);
        x1 = current[5];
        y1 = current[6];
        break;
      case 'Q':
        iterator = getPointOnQuadraticBezierIterator(x1, y1, current[1], current[2], current[3], current[4]);
        tempInfo = basicInfo;
        tempInfo.iterator = iterator;
        tempInfo.angleFinder = getTangentQuadraticIterator(x1, y1, current[1], current[2], current[3], current[4]);
        tempInfo.length = pathIterator(iterator, x1, y1);
        x1 = current[3];
        y1 = current[4];
        break;
      case 'Z':
        // we add those in order to ease calculations later
        tempInfo = basicInfo;
        tempInfo.destX = x2;
        tempInfo.destY = y2;
        tempInfo.length = calcLineLength(x1, y1, x2, y2);
        x1 = x2;
        y1 = y2;
        break;
    }
    totalLength += tempInfo.length;
    info.push(tempInfo);
  }
  info.push({
    length: totalLength,
    x: x1,
    y: y1
  });
  return info;
};

/**
 * Get the point on the path that is distance along the path
 * @param path
 * @param distance
 * @param infos
 */
const getPointOnPath = function (path, distance) {
  let infos = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : getPathSegmentsInfo(path);
  let i = 0;
  while (distance - infos[i].length > 0 && i < infos.length - 2) {
    distance -= infos[i].length;
    i++;
  }
  const segInfo = infos[i],
    segPercent = distance / segInfo.length,
    segment = path[i];
  switch (segInfo.command) {
    case 'M':
      return {
        x: segInfo.x,
        y: segInfo.y,
        angle: 0
      };
    case 'Z':
      return {
        ...new Point(segInfo.x, segInfo.y).lerp(new Point(segInfo.destX, segInfo.destY), segPercent),
        angle: Math.atan2(segInfo.destY - segInfo.y, segInfo.destX - segInfo.x)
      };
    case 'L':
      return {
        ...new Point(segInfo.x, segInfo.y).lerp(new Point(segment[1], segment[2]), segPercent),
        angle: Math.atan2(segment[2] - segInfo.y, segment[1] - segInfo.x)
      };
    case 'C':
      return findPercentageForDistance(segInfo, distance);
    case 'Q':
      return findPercentageForDistance(segInfo, distance);
    // throw Error('Invalid command');
  }
};
const rePathCmdAll = new RegExp(rePathCommand, 'gi');
const regExpArcCommandPoints = new RegExp(reArcCommandPoints, 'g');
const reMyNum = new RegExp(reNum, 'gi');
const commandLengths = {
  m: 2,
  l: 2,
  h: 1,
  v: 1,
  c: 6,
  s: 4,
  q: 4,
  t: 2,
  a: 7
};
/**
 *
 * @param {string} pathString
 * @return {TComplexPathData} An array of SVG path commands
 * @example <caption>Usage</caption>
 * parsePath('M 3 4 Q 3 5 2 1 4 0 Q 9 12 2 1 4 0') === [
 *   ['M', 3, 4],
 *   ['Q', 3, 5, 2, 1, 4, 0],
 *   ['Q', 9, 12, 2, 1, 4, 0],
 * ];
 */
const parsePath = pathString => {
  var _pathString$match;
  const chain = [];
  const all = (_pathString$match = pathString.match(rePathCmdAll)) !== null && _pathString$match !== void 0 ? _pathString$match : [];
  for (const matchStr of all) {
    // take match string and save the first letter as the command
    const commandLetter = matchStr[0];
    // in case of Z we have very little to do
    if (commandLetter === 'z' || commandLetter === 'Z') {
      chain.push([commandLetter]);
      continue;
    }
    const commandLength = commandLengths[commandLetter.toLowerCase()];
    let paramArr = [];
    if (commandLetter === 'a' || commandLetter === 'A') {
      // the arc command ha some peculariaties that requires a special regex other than numbers
      // it is possible to avoid using a space between the sweep and large arc flags, making them either
      // 00, 01, 10 or 11, making them identical to a plain number for the regex reMyNum
      // reset the regexp
      regExpArcCommandPoints.lastIndex = 0;
      for (let out = null; out = regExpArcCommandPoints.exec(matchStr);) {
        paramArr.push(...out.slice(1));
      }
    } else {
      paramArr = matchStr.match(reMyNum) || [];
    }

    // inspect the length of paramArr, if is longer than commandLength
    // we are dealing with repeated commands
    for (let i = 0; i < paramArr.length; i += commandLength) {
      const newCommand = new Array(commandLength);
      const transformedCommand = repeatedCommands[commandLetter];
      newCommand[0] = i > 0 && transformedCommand ? transformedCommand : commandLetter;
      for (let j = 0; j < commandLength; j++) {
        newCommand[j + 1] = parseFloat(paramArr[i + j]);
      }
      chain.push(newCommand);
    }
  }
  return chain;
};

/**
 *
 * Converts points to a smooth SVG path
 * @param {XY[]} points Array of points
 * @param {number} [correction] Apply a correction to the path (usually we use `width / 1000`). If value is undefined 0 is used as the correction value.
 * @return {(string|number)[][]} An array of SVG path commands
 */
const getSmoothPathFromPoints = function (points) {
  let correction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let p1 = new Point(points[0]),
    p2 = new Point(points[1]),
    multSignX = 1,
    multSignY = 0;
  const path = [],
    len = points.length,
    manyPoints = len > 2;
  if (manyPoints) {
    multSignX = points[2].x < p2.x ? -1 : points[2].x === p2.x ? 0 : 1;
    multSignY = points[2].y < p2.y ? -1 : points[2].y === p2.y ? 0 : 1;
  }
  path.push(['M', p1.x - multSignX * correction, p1.y - multSignY * correction]);
  let i;
  for (i = 1; i < len; i++) {
    if (!p1.eq(p2)) {
      const midPoint = p1.midPointFrom(p2);
      // p1 is our bezier control point
      // midpoint is our endpoint
      // start point is p(i-1) value.
      path.push(['Q', p1.x, p1.y, midPoint.x, midPoint.y]);
    }
    p1 = points[i];
    if (i + 1 < points.length) {
      p2 = points[i + 1];
    }
  }
  if (manyPoints) {
    multSignX = p1.x > points[i - 2].x ? 1 : p1.x === points[i - 2].x ? 0 : -1;
    multSignY = p1.y > points[i - 2].y ? 1 : p1.y === points[i - 2].y ? 0 : -1;
  }
  path.push(['L', p1.x + multSignX * correction, p1.y + multSignY * correction]);
  return path;
};

/**
 * Transform a path by transforming each segment.
 * it has to be a simplified path or it won't work.
 * WARNING: this depends from pathOffset for correct operation
 * @param {TSimplePathData} path fabricJS parsed and simplified path commands
 * @param {TMat2D} transform matrix that represent the transformation
 * @param {Point} [pathOffset] `Path.pathOffset`
 * @returns {TSimplePathData} the transformed path
 */
const transformPath = (path, transform, pathOffset) => {
  if (pathOffset) {
    transform = multiplyTransformMatrices(transform, [1, 0, 0, 1, -pathOffset.x, -pathOffset.y]);
  }
  return path.map(pathSegment => {
    const newSegment = [...pathSegment];
    for (let i = 1; i < pathSegment.length - 1; i += 2) {
      // TODO: is there a way to get around casting to any?
      const {
        x,
        y
      } = transformPoint({
        x: pathSegment[i],
        y: pathSegment[i + 1]
      }, transform);
      newSegment[i] = x;
      newSegment[i + 1] = y;
    }
    return newSegment;
  });
};

/**
 * Returns an array of path commands to create a regular polygon
 * @param {number} numVertexes
 * @param {number} radius
 * @returns {TSimplePathData} An array of SVG path commands
 */
const getRegularPolygonPath = (numVertexes, radius) => {
  const interiorAngle = Math.PI * 2 / numVertexes;
  // rotationAdjustment rotates the path by 1/2 the interior angle so that the polygon always has a flat side on the bottom
  // This isn't strictly necessary, but it's how we tend to think of and expect polygons to be drawn
  let rotationAdjustment = -halfPI;
  if (numVertexes % 2 === 0) {
    rotationAdjustment += interiorAngle / 2;
  }
  const d = new Array(numVertexes + 1);
  for (let i = 0; i < numVertexes; i++) {
    const rad = i * interiorAngle + rotationAdjustment;
    const {
      x,
      y
    } = new Point(cos(rad), sin(rad)).scalarMultiply(radius);
    d[i] = [i === 0 ? 'M' : 'L', x, y];
  }
  d[numVertexes] = ['Z'];
  return d;
};

/**
 * Join path commands to go back to svg format
 * @param {TSimplePathData} pathData fabricJS parsed path commands
 * @param {number} fractionDigits number of fraction digits to "leave"
 * @return {String} joined path 'M 0 0 L 20 30'
 */
const joinPath = (pathData, fractionDigits) => pathData.map(segment => {
  return segment.map((arg, i) => {
    if (i === 0) return arg;
    return fractionDigits === undefined ? arg : toFixed(arg, fractionDigits);
  }).join(' ');
}).join(' ');

/**
 * Merges 2 clip paths into one visually equal clip path
 *
 * **IMPORTANT**:\
 * Does **NOT** clone the arguments, clone them proir if necessary.
 *
 * Creates a wrapper (group) that contains one clip path and is clipped by the other so content is kept where both overlap.
 * Use this method if both the clip paths may have nested clip paths of their own, so assigning one to the other's clip path property is not possible.
 *
 * In order to handle the `inverted` property we follow logic described in the following cases:\
 * **(1)** both clip paths are inverted - the clip paths pass the inverted prop to the wrapper and loose it themselves.\
 * **(2)** one is inverted and the other isn't - the wrapper shouldn't become inverted and the inverted clip path must clip the non inverted one to produce an identical visual effect.\
 * **(3)** both clip paths are not inverted - wrapper and clip paths remain unchanged.
 *
 * @param {fabric.Object} c1
 * @param {fabric.Object} c2
 * @returns {fabric.Object} merged clip path
 */
const mergeClipPaths = (c1, c2) => {
  var _b$group;
  let a = c1,
    b = c2;
  if (a.inverted && !b.inverted) {
    //  case (2)
    a = c2;
    b = c1;
  }
  //  `b` becomes `a`'s clip path so we transform `b` to `a` coordinate plane
  sendObjectToPlane(b, (_b$group = b.group) === null || _b$group === void 0 ? void 0 : _b$group.calcTransformMatrix(), a.calcTransformMatrix());
  //  assign the `inverted` prop to the wrapping group
  const inverted = a.inverted && b.inverted;
  if (inverted) {
    //  case (1)
    a.inverted = b.inverted = false;
  }
  return new Group([a], {
    clipPath: b,
    inverted
  });
};

/**
 * Returns random number between 2 specified ones.
 * @param {Number} min lower limit
 * @param {Number} max upper limit
 * @return {Number} random value (between min and max)
 */
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * This function is an helper for svg import. it decompose the transformMatrix
 * and assign properties to object.
 * untransformed coordinates
 * @private
 */
const _assignTransformMatrixProps = object => {
  if (object.transformMatrix) {
    const {
      scaleX,
      scaleY,
      angle,
      skewX
    } = qrDecompose(object.transformMatrix);
    object.flipX = false;
    object.flipY = false;
    object.set(SCALE_X, scaleX);
    object.set(SCALE_Y, scaleY);
    object.angle = angle;
    object.skewX = skewX;
    object.skewY = 0;
  }
};

/**
 * This function is an helper for svg import. it removes the transform matrix
 * and set to object properties that fabricjs can handle
 * @private
 * @param {Object} preserveAspectRatioOptions
 */
const removeTransformMatrixForSvgParsing = (object, preserveAspectRatioOptions) => {
  let center = object._findCenterFromElement();
  if (object.transformMatrix) {
    _assignTransformMatrixProps(object);
    center = center.transform(object.transformMatrix);
  }
  delete object.transformMatrix;
  if (preserveAspectRatioOptions) {
    object.scaleX *= preserveAspectRatioOptions.scaleX;
    object.scaleY *= preserveAspectRatioOptions.scaleY;
    object.cropX = preserveAspectRatioOptions.cropX;
    object.cropY = preserveAspectRatioOptions.cropY;
    center.x += preserveAspectRatioOptions.offsetLeft;
    center.y += preserveAspectRatioOptions.offsetTop;
    object.width = preserveAspectRatioOptions.width;
    object.height = preserveAspectRatioOptions.height;
  }
  object.setPositionByOrigin(center, CENTER, CENTER);
};

var index$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  addTransformToObject: addTransformToObject,
  animate: animate,
  animateColor: animateColor,
  applyTransformToObject: applyTransformToObject,
  calcAngleBetweenVectors: calcAngleBetweenVectors,
  calcDimensionsMatrix: calcDimensionsMatrix,
  calcPlaneChangeMatrix: calcPlaneChangeMatrix,
  calcVectorRotation: calcVectorRotation,
  cancelAnimFrame: cancelAnimFrame,
  capValue: capValue,
  composeMatrix: composeMatrix,
  copyCanvasElement: copyCanvasElement,
  cos: cos,
  createCanvasElement: createCanvasElement,
  createImage: createImage,
  createRotateMatrix: createRotateMatrix,
  createScaleMatrix: createScaleMatrix,
  createSkewXMatrix: createSkewXMatrix,
  createSkewYMatrix: createSkewYMatrix,
  createTranslateMatrix: createTranslateMatrix,
  createVector: createVector,
  crossProduct: crossProduct,
  degreesToRadians: degreesToRadians,
  dotProduct: dotProduct,
  ease: easing,
  enlivenObjectEnlivables: enlivenObjectEnlivables,
  enlivenObjects: enlivenObjects,
  findScaleToCover: findScaleToCover,
  findScaleToFit: findScaleToFit,
  getBoundsOfCurve: getBoundsOfCurve,
  getOrthonormalVector: getOrthonormalVector,
  getPathSegmentsInfo: getPathSegmentsInfo,
  getPointOnPath: getPointOnPath,
  getPointer: getPointer,
  getRandomInt: getRandomInt,
  getRegularPolygonPath: getRegularPolygonPath,
  getSmoothPathFromPoints: getSmoothPathFromPoints,
  getSvgAttributes: getSvgAttributes,
  getUnitVector: getUnitVector,
  groupSVGElements: groupSVGElements,
  hasStyleChanged: hasStyleChanged,
  invertTransform: invertTransform,
  isBetweenVectors: isBetweenVectors,
  isIdentityMatrix: isIdentityMatrix,
  isTouchEvent: isTouchEvent,
  isTransparent: isTransparent,
  joinPath: joinPath,
  loadImage: loadImage,
  magnitude: magnitude,
  makeBoundingBoxFromPoints: makeBoundingBoxFromPoints,
  makePathSimpler: makePathSimpler,
  matrixToSVG: matrixToSVG,
  mergeClipPaths: mergeClipPaths,
  multiplyTransformMatrices: multiplyTransformMatrices,
  multiplyTransformMatrixArray: multiplyTransformMatrixArray,
  parsePath: parsePath,
  parsePreserveAspectRatioAttribute: parsePreserveAspectRatioAttribute,
  parseUnit: parseUnit,
  pick: pick,
  projectStrokeOnPoints: projectStrokeOnPoints,
  qrDecompose: qrDecompose,
  radiansToDegrees: radiansToDegrees,
  removeFromArray: removeFromArray,
  removeTransformFromObject: removeTransformFromObject,
  removeTransformMatrixForSvgParsing: removeTransformMatrixForSvgParsing,
  requestAnimFrame: requestAnimFrame,
  resetObjectTransform: resetObjectTransform,
  rotateVector: rotateVector,
  saveObjectTransform: saveObjectTransform,
  sendObjectToPlane: sendObjectToPlane,
  sendPointToPlane: sendPointToPlane,
  sendVectorToPlane: sendVectorToPlane,
  sin: sin,
  sizeAfterTransform: sizeAfterTransform,
  string: lang_string,
  stylesFromArray: stylesFromArray,
  stylesToArray: stylesToArray,
  toBlob: toBlob,
  toDataURL: toDataURL,
  toFixed: toFixed,
  transformPath: transformPath,
  transformPoint: transformPoint
});

// TODO this file needs to go away, cross browser style support is not fabricjs domain.

/**
 * wrapper for setting element's style
 * @param {HTMLElement} element an HTMLElement
 * @param {Object} styles to apply to element
 */
function setStyle(element, styles) {
  const elementStyle = element.style;
  if (!elementStyle) {
    return;
  }
  Object.entries(styles).forEach(_ref => {
    let [property, value] = _ref;
    return elementStyle.setProperty(property, value);
  });
}

class CanvasDOMManager extends StaticCanvasDOMManager {
  constructor(arg0) {
    let {
      allowTouchScrolling = false,
      containerClass = ''
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super(arg0);
    _defineProperty(this, "upper", void 0);
    _defineProperty(this, "container", void 0);
    const {
      el: lowerCanvasEl
    } = this.lower;
    const upperCanvasEl = this.createUpperCanvas();
    this.upper = {
      el: upperCanvasEl,
      ctx: upperCanvasEl.getContext('2d')
    };
    this.applyCanvasStyle(lowerCanvasEl, {
      allowTouchScrolling
    });
    this.applyCanvasStyle(upperCanvasEl, {
      allowTouchScrolling,
      styles: {
        position: 'absolute',
        left: '0',
        top: '0'
      }
    });
    const container = this.createContainerElement();
    container.classList.add(containerClass);
    if (lowerCanvasEl.parentNode) {
      lowerCanvasEl.parentNode.replaceChild(container, lowerCanvasEl);
    }
    container.append(lowerCanvasEl, upperCanvasEl);
    this.container = container;
  }
  createUpperCanvas() {
    const {
      el: lowerCanvasEl
    } = this.lower;
    const el = createCanvasElement();
    // we assign the same classname of the lowerCanvas
    el.className = lowerCanvasEl.className;
    // but then we remove the lower-canvas specific className
    el.classList.remove('lower-canvas');
    // we add the specific upper-canvas class
    el.classList.add('upper-canvas');
    el.setAttribute('data-fabric', 'top');
    el.style.cssText = lowerCanvasEl.style.cssText;
    el.setAttribute('draggable', 'true');
    return el;
  }
  createContainerElement() {
    const container = getFabricDocument().createElement('div');
    container.setAttribute('data-fabric', 'wrapper');
    setStyle(container, {
      position: 'relative'
    });
    makeElementUnselectable(container);
    return container;
  }

  /**
   * @private
   * @param {HTMLCanvasElement} element canvas element to apply styles on
   */
  applyCanvasStyle(element, options) {
    const {
      styles,
      allowTouchScrolling
    } = options;
    setStyle(element, {
      ...styles,
      'touch-action': allowTouchScrolling ? 'manipulation' : NONE
    });
    makeElementUnselectable(element);
  }
  setDimensions(size, retinaScaling) {
    super.setDimensions(size, retinaScaling);
    const {
      el,
      ctx
    } = this.upper;
    setCanvasDimensions(el, ctx, size, retinaScaling);
  }
  setCSSDimensions(size) {
    super.setCSSDimensions(size);
    setCSSDimensions(this.upper.el, size);
    setCSSDimensions(this.container, size);
  }
  cleanupDOM(size) {
    const container = this.container,
      {
        el: lowerCanvasEl
      } = this.lower,
      {
        el: upperCanvasEl
      } = this.upper;
    super.cleanupDOM(size);
    container.removeChild(upperCanvasEl);
    container.removeChild(lowerCanvasEl);
    if (container.parentNode) {
      container.parentNode.replaceChild(lowerCanvasEl, container);
    }
  }
  dispose() {
    super.dispose();
    getEnv$1().dispose(this.upper.el);
    // @ts-expect-error disposing
    delete this.upper;
    // @ts-expect-error disposing
    delete this.container;
  }
}

const canvasDefaults = {
  uniformScaling: true,
  uniScaleKey: 'shiftKey',
  centeredScaling: false,
  centeredRotation: false,
  centeredKey: 'altKey',
  altActionKey: 'shiftKey',
  selection: true,
  selectionKey: 'shiftKey',
  selectionColor: 'rgba(100, 100, 255, 0.3)',
  selectionDashArray: [],
  selectionBorderColor: 'rgba(255, 255, 255, 0.3)',
  selectionLineWidth: 1,
  selectionFullyContained: false,
  hoverCursor: 'move',
  moveCursor: 'move',
  defaultCursor: 'default',
  freeDrawingCursor: 'crosshair',
  notAllowedCursor: 'not-allowed',
  perPixelTargetFind: false,
  targetFindTolerance: 0,
  skipTargetFind: false,
  stopContextMenu: true,
  fireRightClick: true,
  fireMiddleClick: true,
  enablePointerEvents: false,
  containerClass: 'canvas-container',
  preserveObjectStacking: true
};

/**
 * Canvas class
 * @class Canvas
 * @extends StaticCanvas
 * @see {@link http://fabric5.fabricjs.com/fabric-intro-part-1#canvas}
 *
 * @fires object:modified at the end of a transform
 * @fires object:rotating while an object is being rotated from the control
 * @fires object:scaling while an object is being scaled by controls
 * @fires object:moving while an object is being dragged
 * @fires object:skewing while an object is being skewed from the controls
 *
 * @fires before:transform before a transform is is started
 * @fires before:selection:cleared
 * @fires selection:cleared
 * @fires selection:updated
 * @fires selection:created
 *
 * @fires path:created after a drawing operation ends and the path is added
 * @fires mouse:down
 * @fires mouse:move
 * @fires mouse:up
 * @fires mouse:down:before  on mouse down, before the inner fabric logic runs
 * @fires mouse:move:before on mouse move, before the inner fabric logic runs
 * @fires mouse:up:before on mouse up, before the inner fabric logic runs
 * @fires mouse:over
 * @fires mouse:out
 * @fires mouse:dblclick whenever a native dbl click event fires on the canvas.
 *
 * @fires dragover
 * @fires dragenter
 * @fires dragleave
 * @fires drag:enter object drag enter
 * @fires drag:leave object drag leave
 * @fires drop:before before drop event. Prepare for the drop event (same native event).
 * @fires drop
 * @fires drop:after after drop event. Run logic on canvas after event has been accepted/declined (same native event).
 * @example
 * let a: fabric.Object, b: fabric.Object;
 * let flag = false;
 * canvas.add(a, b);
 * a.on('drop:before', opt => {
 *  //  we want a to accept the drop even though it's below b in the stack
 *  flag = this.canDrop(opt.e);
 * });
 * b.canDrop = function(e) {
 *  !flag && this.draggableTextDelegate.canDrop(e);
 * }
 * b.on('dragover', opt => b.set('fill', opt.dropTarget === b ? 'pink' : 'black'));
 * a.on('drop', opt => {
 *  opt.e.defaultPrevented  //  drop occurred
 *  opt.didDrop             //  drop occurred on canvas
 *  opt.target              //  drop target
 *  opt.target !== a && a.set('text', 'I lost');
 * });
 * canvas.on('drop:after', opt => {
 *  //  inform user who won
 *  if(!opt.e.defaultPrevented) {
 *    // no winners
 *  }
 *  else if(!opt.didDrop) {
 *    //  my objects didn't win, some other lucky object
 *  }
 *  else {
 *    //  we have a winner it's opt.target!!
 *  }
 * })
 *
 * @fires after:render at the end of the render process, receives the context in the callback
 * @fires before:render at start the render process, receives the context in the callback
 *
 * @fires contextmenu:before
 * @fires contextmenu
 * @example
 * let handler;
 * targets.forEach(target => {
 *   target.on('contextmenu:before', opt => {
 *     //  decide which target should handle the event before canvas hijacks it
 *     if (someCaseHappens && opt.targets.includes(target)) {
 *       handler = target;
 *     }
 *   });
 *   target.on('contextmenu', opt => {
 *     //  do something fantastic
 *   });
 * });
 * canvas.on('contextmenu', opt => {
 *   if (!handler) {
 *     //  no one takes responsibility, it's always left to me
 *     //  let's show them how it's done!
 *   }
 * });
 *
 */
class SelectableCanvas extends StaticCanvas$1 {
  constructor() {
    super(...arguments);
    // transform config
    // selection config
    // cursors
    // target find config
    /**
     * When true, mouse events on canvas (mousedown/mousemove/mouseup) result in free drawing.
     * After mousedown, mousemove creates a shape,
     * and then mouseup finalizes it and adds an instance of `fabric.Path` onto canvas.
     * @see {@link http://fabric5.fabricjs.com/fabric-intro-part-4#free_drawing}
     * @type Boolean
     */
    // event config
    /**
     * Keep track of the hovered target in the previous event
     * @type FabricObject | null
     * @private
     */
    /**
     * hold the list of nested targets hovered in the previous events
     * @type FabricObject[]
     * @private
     */
    _defineProperty(this, "_hoveredTargets", []);
    /**
     * hold a reference to a data structure that contains information
     * on the current on going transform
     * @type
     * @private
     */
    _defineProperty(this, "_currentTransform", null);
    /**
     * hold a reference to a data structure used to track the selection
     * box on canvas drag
     * on the current on going transform
     * x, y, deltaX and deltaY are in scene plane
     * @type
     * @private
     */
    _defineProperty(this, "_groupSelector", null);
    /**
     * internal flag used to understand if the context top requires a cleanup
     * in case this is true, the contextTop will be cleared at the next render
     * @type boolean
     * @private
     */
    _defineProperty(this, "contextTopDirty", false);
  }
  static getDefaults() {
    return {
      ...super.getDefaults(),
      ...SelectableCanvas.ownDefaults
    };
  }
  get upperCanvasEl() {
    var _this$elements$upper;
    return (_this$elements$upper = this.elements.upper) === null || _this$elements$upper === void 0 ? void 0 : _this$elements$upper.el;
  }
  get contextTop() {
    var _this$elements$upper2;
    return (_this$elements$upper2 = this.elements.upper) === null || _this$elements$upper2 === void 0 ? void 0 : _this$elements$upper2.ctx;
  }
  get wrapperEl() {
    return this.elements.container;
  }
  initElements(el) {
    this.elements = new CanvasDOMManager(el, {
      allowTouchScrolling: this.allowTouchScrolling,
      containerClass: this.containerClass
    });
    this._createCacheCanvas();
  }

  /**
   * @private
   * @param {FabricObject} obj Object that was added
   */
  _onObjectAdded(obj) {
    this._objectsToRender = undefined;
    super._onObjectAdded(obj);
  }

  /**
   * @private
   * @param {FabricObject} obj Object that was removed
   */
  _onObjectRemoved(obj) {
    this._objectsToRender = undefined;
    // removing active object should fire "selection:cleared" events
    if (obj === this._activeObject) {
      this.fire('before:selection:cleared', {
        deselected: [obj]
      });
      this._discardActiveObject();
      this.fire('selection:cleared', {
        deselected: [obj]
      });
      obj.fire('deselected', {
        target: obj
      });
    }
    if (obj === this._hoveredTarget) {
      this._hoveredTarget = undefined;
      this._hoveredTargets = [];
    }
    super._onObjectRemoved(obj);
  }
  _onStackOrderChanged() {
    this._objectsToRender = undefined;
    super._onStackOrderChanged();
  }

  /**
   * Divides objects in two groups, one to render immediately
   * and one to render as activeGroup.
   * @return {Array} objects to render immediately and pushes the other in the activeGroup.
   */
  _chooseObjectsToRender() {
    const activeObject = this._activeObject;
    return !this.preserveObjectStacking && activeObject ? this._objects.filter(object => !object.group && object !== activeObject).concat(activeObject) : this._objects;
  }

  /**
   * Renders both the top canvas and the secondary container canvas.
   */
  renderAll() {
    this.cancelRequestedRender();
    if (this.destroyed) {
      return;
    }
    if (this.contextTopDirty && !this._groupSelector && !this.isDrawingMode) {
      this.clearContext(this.contextTop);
      this.contextTopDirty = false;
    }
    if (this.hasLostContext) {
      this.renderTopLayer(this.contextTop);
      this.hasLostContext = false;
    }
    !this._objectsToRender && (this._objectsToRender = this._chooseObjectsToRender());
    this.renderCanvas(this.getContext(), this._objectsToRender);
  }

  /**
   * text selection is rendered by the active text instance during the rendering cycle
   */
  renderTopLayer(ctx) {
    ctx.save();
    if (this.isDrawingMode && this._isCurrentlyDrawing) {
      this.freeDrawingBrush && this.freeDrawingBrush._render();
      this.contextTopDirty = true;
    }
    // we render the top context - last object
    if (this.selection && this._groupSelector) {
      this._drawSelection(ctx);
      this.contextTopDirty = true;
    }
    ctx.restore();
  }

  /**
   * Method to render only the top canvas.
   * Also used to render the group selection box.
   * Does not render text selection.
   */
  renderTop() {
    const ctx = this.contextTop;
    this.clearContext(ctx);
    this.renderTopLayer(ctx);
    // todo: how do i know if the after:render is for the top or normal contex?
    this.fire('after:render', {
      ctx
    });
  }

  /**
   * Set the canvas tolerance value for pixel taret find.
   * Use only integer numbers.
   * @private
   */
  setTargetFindTolerance(value) {
    value = Math.round(value);
    this.targetFindTolerance = value;
    const retina = this.getRetinaScaling();
    const size = Math.ceil((value * 2 + 1) * retina);
    this.pixelFindCanvasEl.width = this.pixelFindCanvasEl.height = size;
    this.pixelFindContext.scale(retina, retina);
  }

  /**
   * Returns true if object is transparent at a certain location
   * Clarification: this is `is target transparent at location X or are controls there`
   * @TODO this seems dumb that we treat controls with transparency. we can find controls
   * programmatically without painting them, the cache canvas optimization is always valid
   * @param {FabricObject} target Object to check
   * @param {Number} x Left coordinate in viewport space
   * @param {Number} y Top coordinate in viewport space
   * @return {Boolean}
   */
  isTargetTransparent(target, x, y) {
    const tolerance = this.targetFindTolerance;
    const ctx = this.pixelFindContext;
    this.clearContext(ctx);
    ctx.save();
    ctx.translate(-x + tolerance, -y + tolerance);
    ctx.transform(...this.viewportTransform);
    const selectionBgc = target.selectionBackgroundColor;
    target.selectionBackgroundColor = '';
    target.render(ctx);
    target.selectionBackgroundColor = selectionBgc;
    ctx.restore();
    // our canvas is square, and made around tolerance.
    // so tolerance in this case also represent the center of the canvas.
    const enhancedTolerance = Math.round(tolerance * this.getRetinaScaling());
    return isTransparent(ctx, enhancedTolerance, enhancedTolerance, enhancedTolerance);
  }

  /**
   * takes an event and determines if selection key has been pressed
   * @private
   * @param {TPointerEvent} e Event object
   */
  _isSelectionKeyPressed(e) {
    const sKey = this.selectionKey;
    if (!sKey) {
      return false;
    }
    if (Array.isArray(sKey)) {
      return !!sKey.find(key => !!key && e[key] === true);
    } else {
      return e[sKey];
    }
  }

  /**
   * @private
   * @param {TPointerEvent} e Event object
   * @param {FabricObject} target
   */
  _shouldClearSelection(e, target) {
    const activeObjects = this.getActiveObjects(),
      activeObject = this._activeObject;
    return !!(!target || target && activeObject && activeObjects.length > 1 && activeObjects.indexOf(target) === -1 && activeObject !== target && !this._isSelectionKeyPressed(e) || target && !target.evented || target && !target.selectable && activeObject && activeObject !== target);
  }

  /**
   * This method will take in consideration a modifier key pressed and the control we are
   * about to drag, and try to guess the anchor point ( origin ) of the transormation.
   * This should be really in the realm of controls, and we should remove specific code for legacy
   * embedded actions.
   * @TODO this probably deserve discussion/rediscovery and change/refactor
   * @private
   * @deprecated
   * @param {FabricObject} target
   * @param {string} action
   * @param {boolean} altKey
   * @returns {boolean} true if the transformation should be centered
   */
  _shouldCenterTransform(target, action, modifierKeyPressed) {
    if (!target) {
      return;
    }
    let centerTransform;
    if (action === SCALE || action === SCALE_X || action === SCALE_Y || action === RESIZING) {
      centerTransform = this.centeredScaling || target.centeredScaling;
    } else if (action === ROTATE) {
      centerTransform = this.centeredRotation || target.centeredRotation;
    }
    return centerTransform ? !modifierKeyPressed : modifierKeyPressed;
  }

  /**
   * Given the control clicked, determine the origin of the transform.
   * This is bad because controls can totally have custom names
   * should disappear before release 4.0
   * @private
   * @deprecated
   */
  _getOriginFromCorner(target, controlName) {
    const origin = {
      x: target.originX,
      y: target.originY
    };
    if (!controlName) {
      return origin;
    }

    // is a left control ?
    if (['ml', 'tl', 'bl'].includes(controlName)) {
      origin.x = RIGHT;
      // is a right control ?
    } else if (['mr', 'tr', 'br'].includes(controlName)) {
      origin.x = LEFT;
    }
    // is a top control ?
    if (['tl', 'mt', 'tr'].includes(controlName)) {
      origin.y = BOTTOM;
      // is a bottom control ?
    } else if (['bl', 'mb', 'br'].includes(controlName)) {
      origin.y = TOP;
    }
    return origin;
  }

  /**
   * @private
   * @param {Event} e Event object
   * @param {FabricObject} target
   * @param {boolean} [alreadySelected] pass true to setup the active control
   */
  _setupCurrentTransform(e, target, alreadySelected) {
    var _control$getActionHan;
    const pointer = target.group ?
    // transform pointer to target's containing coordinate plane
    sendPointToPlane(this.getScenePoint(e), undefined, target.group.calcTransformMatrix()) : this.getScenePoint(e);
    const {
        key: corner = '',
        control
      } = target.getActiveControl() || {},
      actionHandler = alreadySelected && control ? (_control$getActionHan = control.getActionHandler(e, target, control)) === null || _control$getActionHan === void 0 ? void 0 : _control$getActionHan.bind(control) : dragHandler,
      action = getActionFromCorner(alreadySelected, corner, e, target),
      altKey = e[this.centeredKey],
      origin = this._shouldCenterTransform(target, action, altKey) ? {
        x: CENTER,
        y: CENTER
      } : this._getOriginFromCorner(target, corner),
      /**
       * relative to target's containing coordinate plane
       * both agree on every point
       **/
      transform = {
        target: target,
        action,
        actionHandler,
        actionPerformed: false,
        corner,
        scaleX: target.scaleX,
        scaleY: target.scaleY,
        skewX: target.skewX,
        skewY: target.skewY,
        offsetX: pointer.x - target.left,
        offsetY: pointer.y - target.top,
        originX: origin.x,
        originY: origin.y,
        ex: pointer.x,
        ey: pointer.y,
        lastX: pointer.x,
        lastY: pointer.y,
        theta: degreesToRadians(target.angle),
        width: target.width,
        height: target.height,
        shiftKey: e.shiftKey,
        altKey,
        original: {
          ...saveObjectTransform(target),
          originX: origin.x,
          originY: origin.y
        }
      };
    this._currentTransform = transform;
    this.fire('before:transform', {
      e,
      transform
    });
  }

  /**
   * Set the cursor type of the canvas element
   * @param {String} value Cursor type of the canvas element.
   * @see http://www.w3.org/TR/css3-ui/#cursor
   */
  setCursor(value) {
    this.upperCanvasEl.style.cursor = value;
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx to draw the selection on
   */
  _drawSelection(ctx) {
    const {
        x,
        y,
        deltaX,
        deltaY
      } = this._groupSelector,
      start = new Point(x, y).transform(this.viewportTransform),
      extent = new Point(x + deltaX, y + deltaY).transform(this.viewportTransform),
      strokeOffset = this.selectionLineWidth / 2;
    let minX = Math.min(start.x, extent.x),
      minY = Math.min(start.y, extent.y),
      maxX = Math.max(start.x, extent.x),
      maxY = Math.max(start.y, extent.y);
    if (this.selectionColor) {
      ctx.fillStyle = this.selectionColor;
      ctx.fillRect(minX, minY, maxX - minX, maxY - minY);
    }
    if (!this.selectionLineWidth || !this.selectionBorderColor) {
      return;
    }
    ctx.lineWidth = this.selectionLineWidth;
    ctx.strokeStyle = this.selectionBorderColor;
    minX += strokeOffset;
    minY += strokeOffset;
    maxX -= strokeOffset;
    maxY -= strokeOffset;
    // selection border
    // @TODO: is _setLineDash still necessary on modern canvas?
    FabricObject.prototype._setLineDash.call(this, ctx, this.selectionDashArray);
    ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
  }

  /**
   * This function is in charge of deciding which is the object that is the current target of an interaction event.
   * For interaction event we mean a pointer related action on the canvas.
   * Which is the
   * 11/09/2018 TODO: would be cool if findTarget could discern between being a full target
   * or the outside part of the corner.
   * @param {Event} e mouse event
   * @return {TargetsInfoWithContainer} the target found
   */
  findTarget(e) {
    // this._targetInfo is cached by _cacheTransformEventData
    // and destroyed by _resetTransformEventData
    if (this._targetInfo) {
      return this._targetInfo;
    }
    if (this.skipTargetFind) {
      return {
        subTargets: [],
        currentSubTargets: []
      };
    }
    const pointer = this.getScenePoint(e),
      activeObject = this._activeObject,
      aObjects = this.getActiveObjects(),
      targetInfo = this.searchPossibleTargets(this._objects, pointer);
    const {
      subTargets: currentSubTargets,
      container: currentContainer,
      target: currentTarget
    } = targetInfo;
    const fullTargetInfo = {
      ...targetInfo,
      currentSubTargets,
      currentContainer,
      currentTarget
    };

    // simplest case no active object, return a new target
    if (!activeObject) {
      return fullTargetInfo;
    }

    // check pointer is over active selection and possibly perform `subTargetCheck`
    const activeObjectTargetInfo = {
      ...this.searchPossibleTargets([activeObject], pointer),
      currentSubTargets,
      currentContainer,
      currentTarget
    };
    const activeObjectControl = activeObject.findControl(this.getViewportPoint(e), isTouchEvent(e));

    // we are clicking exactly the control of an active object, shortcut to that object.
    if (activeObjectControl) {
      return {
        ...activeObjectTargetInfo,
        target: activeObject // we override target in case we are in the outside part of the corner.
      };
    }

    // in case we are over the active object
    if (activeObjectTargetInfo.target) {
      if (aObjects.length > 1) {
        // in case of active selection and target hit over the activeSelection, just exit
        // TODO Verify if we need to override target with container
        return activeObjectTargetInfo;
      }
      // from here onward not an active selection, just an activeOject that maybe is a group

      // preserveObjectStacking is false, so activeObject is drawn on top, just return activeObject
      if (!this.preserveObjectStacking) {
        // TODO Verify if we need to override target with container
        return activeObjectTargetInfo;
      }

      // In case we are in preserveObjectStacking ( selection in stack )
      // there is the possibility to force with `altSelectionKey` to return the activeObject
      // from any point in the stack, even if we have another object completely on top of it.
      if (this.preserveObjectStacking && e[this.altSelectionKey]) {
        // TODO Verify if we need to override target with container
        return activeObjectTargetInfo;
      }
    }

    // we have an active object, but we ruled out it being our target in any way.
    return fullTargetInfo;
  }

  /**
   * Checks if the point is inside the object selection area including padding
   * @param {FabricObject} obj Object to test against
   * @param {Object} [pointer] point in scene coordinates
   * @return {Boolean} true if point is contained within an area of given object
   * @private
   */
  _pointIsInObjectSelectionArea(obj, point) {
    // getCoords will already take care of group de-nesting
    let coords = obj.getCoords();
    const viewportZoom = this.getZoom();
    const padding = obj.padding / viewportZoom;
    if (padding) {
      const [tl, tr, br, bl] = coords;
      // what is the angle of the object?
      // we could use getTotalAngle, but is way easier to look at it
      // from how coords are oriented, since if something went wrong
      // at least we are consistent.
      const angleRadians = Math.atan2(tr.y - tl.y, tr.x - tl.x),
        cosP = cos(angleRadians) * padding,
        sinP = sin(angleRadians) * padding,
        cosPSinP = cosP + sinP,
        cosPMinusSinP = cosP - sinP;
      coords = [new Point(tl.x - cosPMinusSinP, tl.y - cosPSinP), new Point(tr.x + cosPSinP, tr.y - cosPMinusSinP), new Point(br.x + cosPMinusSinP, br.y + cosPSinP), new Point(bl.x - cosPSinP, bl.y + cosPMinusSinP)];
      // in case of padding we calculate the new coords on the fly.
      // otherwise we have to maintain 2 sets of coordinates for everything.
      // we can reiterate on storing them.
      // if this is slow, for now the semplification is large and doesn't impact
      // rendering.
      // the idea behind this is that outside target check we don't need ot know
      // where those coords are
    }
    return Intersection.isPointInPolygon(point, coords);
  }

  /**
   * Checks point is inside the object selection condition. Either area with padding
   * or over pixels if perPixelTargetFind is enabled
   * @param {FabricObject} obj Object to test against
   * @param {Point} pointer point from scene.
   * @return {Boolean} true if point is contained within an area of given object
   * @private
   */
  _checkTarget(obj, pointer) {
    if (obj && obj.visible && obj.evented && this._pointIsInObjectSelectionArea(obj, pointer)) {
      if ((this.perPixelTargetFind || obj.perPixelTargetFind) && !obj.isEditing) {
        const viewportPoint = pointer.transform(this.viewportTransform);
        if (!this.isTargetTransparent(obj, viewportPoint.x, viewportPoint.y)) {
          return true;
        }
      } else {
        return true;
      }
    }
    return false;
  }

  /**
   * Given an array of objects search possible targets under the pointer position
   * Returns an
   * @param {Array} objects objects array to look into
   * @param {Object} pointer x,y object of point of scene coordinates we want to check.
   * @param {Object} subTargets If passed, subtargets will be collected inside the array
   * @return {TargetsInfo} **top most object from given `objects`** that contains pointer
   * @private
   */
  _searchPossibleTargets(objects, pointer, subTargets) {
    let i = objects.length;
    // Do not check for currently grouped objects, since we check the parent group itself.
    // until we call this function specifically to search inside the activeGroup
    while (i--) {
      const target = objects[i];
      if (this._checkTarget(target, pointer)) {
        if (isCollection(target) && target.subTargetCheck) {
          const {
            target: subTarget
          } = this._searchPossibleTargets(target._objects, pointer, subTargets);
          subTarget && subTargets.push(subTarget);
        }
        return {
          target,
          subTargets
        };
      }
    }
    return {
      subTargets: []
    };
  }

  /**
   * Search inside an objects array the fiurst object that contains pointer
   * Collect subTargets of that object inside the subTargets array passed as parameter
   * @param {FabricObject[]} objects objects array to look into
   * @param {Point} pointer coordinates from viewport to check.
   * @return {FabricObject} **top most object on screen** that contains pointer
   */
  searchPossibleTargets(objects, pointer) {
    const targetInfo = this._searchPossibleTargets(objects, pointer, []);

    // outermost target is the container.
    targetInfo.container = targetInfo.target;
    const {
      container,
      subTargets
    } = targetInfo;
    if (container && isCollection(container) && container.interactive && subTargets[0]) {
      /** subTargets[0] is the innermost nested target, but it could be inside non interactive groups
       * and so not a possible selection target.
       * We loop the array from the end that is outermost innertarget.
       */
      for (let i = subTargets.length - 1; i > 0; i--) {
        const t = subTargets[i];
        if (!(isCollection(t) && t.interactive)) {
          // one of the subtargets was not interactive. that is the last subtarget we can return.
          // we can't dig more deep;
          targetInfo.target = t;
          return targetInfo;
        }
      }
      targetInfo.target = subTargets[0];
      return targetInfo;
    }
    return targetInfo;
  }

  /**
   * @returns point existing in the same plane as the {@link HTMLCanvasElement},
   * `(0, 0)` being the top left corner of the {@link HTMLCanvasElement}.
   * This means that changes to the {@link viewportTransform} do not change the values of the point
   * and it remains unchanged from the viewer's perspective.
   *
   * @example
   * const scenePoint = sendPointToPlane(
   *  this.getViewportPoint(e),
   *  undefined,
   *  canvas.viewportTransform
   * );
   *
   */
  getViewportPoint(e) {
    if (this._viewportPoint) {
      return this._viewportPoint;
    }
    return this._getPointerImpl(e, true);
  }

  /**
   * @returns point existing in the scene (the same plane as the plane {@link FabricObject#getCenterPoint} exists in).
   * This means that changes to the {@link viewportTransform} do not change the values of the point,
   * however, from the viewer's perspective, the point is changed.
   *
   * @example
   * const viewportPoint = sendPointToPlane(
   *  this.getScenePoint(e),
   *  canvas.viewportTransform
   * );
   *
   */
  getScenePoint(e) {
    if (this._scenePoint) {
      return this._scenePoint;
    }
    return this._getPointerImpl(e);
  }

  /**
   * Returns pointer relative to canvas.
   *
   * Use {@link getViewportPoint} or {@link getScenePoint} instead.
   *
   * @param {Event} e
   * @param {Boolean} [fromViewport] whether to return the point from the viewport or in the scene
   * @return {Point}
   */
  _getPointerImpl(e) {
    let fromViewport = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const upperCanvasEl = this.upperCanvasEl,
      bounds = upperCanvasEl.getBoundingClientRect();
    let pointer = getPointer(e),
      boundsWidth = bounds.width || 0,
      boundsHeight = bounds.height || 0;
    if (!boundsWidth || !boundsHeight) {
      if (TOP in bounds && BOTTOM in bounds) {
        boundsHeight = Math.abs(bounds.top - bounds.bottom);
      }
      if (RIGHT in bounds && LEFT in bounds) {
        boundsWidth = Math.abs(bounds.right - bounds.left);
      }
    }
    this.calcOffset();
    pointer.x = pointer.x - this._offset.left;
    pointer.y = pointer.y - this._offset.top;
    if (!fromViewport) {
      pointer = sendPointToPlane(pointer, undefined, this.viewportTransform);
    }
    const retinaScaling = this.getRetinaScaling();
    if (retinaScaling !== 1) {
      pointer.x /= retinaScaling;
      pointer.y /= retinaScaling;
    }

    // If bounds are not available (i.e. not visible), do not apply scale.
    const cssScale = boundsWidth === 0 || boundsHeight === 0 ? new Point(1, 1) : new Point(upperCanvasEl.width / boundsWidth, upperCanvasEl.height / boundsHeight);
    return pointer.multiply(cssScale);
  }

  /**
   * Internal use only
   * @protected
   */
  _setDimensionsImpl(dimensions, options) {
    // @ts-expect-error this method exists in the subclass - should be moved or declared as abstract
    this._resetTransformEventData();
    super._setDimensionsImpl(dimensions, options);
    if (this._isCurrentlyDrawing) {
      this.freeDrawingBrush && this.freeDrawingBrush._setBrushStyles(this.contextTop);
    }
  }
  _createCacheCanvas() {
    this.pixelFindCanvasEl = createCanvasElement();
    this.pixelFindContext = this.pixelFindCanvasEl.getContext('2d', {
      willReadFrequently: true
    });
    this.setTargetFindTolerance(this.targetFindTolerance);
  }

  /**
   * Returns context of top canvas where interactions are drawn
   * @returns {CanvasRenderingContext2D}
   */
  getTopContext() {
    return this.elements.upper.ctx;
  }

  /**
   * Returns context of canvas where object selection is drawn
   * @alias
   * @return {CanvasRenderingContext2D}
   */
  getSelectionContext() {
    return this.elements.upper.ctx;
  }

  /**
   * Returns &lt;canvas> element on which object selection is drawn
   * @return {HTMLCanvasElement}
   */
  getSelectionElement() {
    return this.elements.upper.el;
  }

  /**
   * Returns currently active object
   * @return {FabricObject | null} active object
   */
  getActiveObject() {
    return this._activeObject;
  }

  /**
   * Returns an array with the current selected objects
   * @return {FabricObject[]} active objects array
   */
  getActiveObjects() {
    const active = this._activeObject;
    return isActiveSelection(active) ? active.getObjects() : active ? [active] : [];
  }

  /**
   * @private
   * Compares the old activeObject with the current one and fires correct events
   * @param {FabricObject[]} oldObjects old activeObject
   * @param {TPointerEvent} e mouse event triggering the selection events
   */
  _fireSelectionEvents(oldObjects, e) {
    let somethingChanged = false,
      invalidate = false;
    const objects = this.getActiveObjects(),
      added = [],
      removed = [];
    oldObjects.forEach(target => {
      if (!objects.includes(target)) {
        somethingChanged = true;
        target.fire('deselected', {
          e,
          target
        });
        removed.push(target);
      }
    });
    objects.forEach(target => {
      if (!oldObjects.includes(target)) {
        somethingChanged = true;
        target.fire('selected', {
          e,
          target
        });
        added.push(target);
      }
    });
    if (oldObjects.length > 0 && objects.length > 0) {
      invalidate = true;
      somethingChanged && this.fire('selection:updated', {
        e,
        selected: added,
        deselected: removed
      });
    } else if (objects.length > 0) {
      invalidate = true;
      this.fire('selection:created', {
        e,
        selected: added
      });
    } else if (oldObjects.length > 0) {
      invalidate = true;
      this.fire('selection:cleared', {
        e,
        deselected: removed
      });
    }
    invalidate && (this._objectsToRender = undefined);
  }

  /**
   * Sets given object as the only active object on canvas
   * @param {FabricObject} object Object to set as an active one
   * @param {TPointerEvent} [e] Event (passed along when firing "object:selected")
   * @return {Boolean} true if the object has been selected
   */
  setActiveObject(object, e) {
    // we can't inline this, since _setActiveObject will change what getActiveObjects returns
    const currentActives = this.getActiveObjects();
    const selected = this._setActiveObject(object, e);
    this._fireSelectionEvents(currentActives, e);
    return selected;
  }

  /**
   * This is supposed to be equivalent to setActiveObject but without firing
   * any event. There is commitment to have this stay this way.
   * This is the functional part of setActiveObject.
   * @param {Object} object to set as active
   * @param {Event} [e] Event (passed along when firing "object:selected")
   * @return {Boolean} true if the object has been selected
   */
  _setActiveObject(object, e) {
    const prevActiveObject = this._activeObject;
    if (prevActiveObject === object) {
      return false;
    }
    // after calling this._discardActiveObject, this,_activeObject could be undefined
    if (!this._discardActiveObject(e, object) && this._activeObject) {
      // refused to deselect
      return false;
    }
    if (object.onSelect({
      e
    })) {
      return false;
    }
    this._activeObject = object;
    if (isActiveSelection(object) && prevActiveObject !== object) {
      object.set('canvas', this);
    }
    object.setCoords();
    return true;
  }

  /**
   * This is supposed to be equivalent to discardActiveObject but without firing
   * any selection events ( can still fire object transformation events ). There is commitment to have this stay this way.
   * This is the functional part of discardActiveObject.
   * @param {Event} [e] Event (passed along when firing "object:deselected")
   * @param {Object} object the next object to set as active, reason why we are discarding this
   * @return {Boolean} true if the active object has been discarded
   */
  _discardActiveObject(e, object) {
    const obj = this._activeObject;
    if (obj) {
      // onDeselect return TRUE to cancel selection;
      if (obj.onDeselect({
        e,
        object
      })) {
        return false;
      }
      if (this._currentTransform && this._currentTransform.target === obj) {
        this.endCurrentTransform(e);
      }
      if (isActiveSelection(obj) && obj === this._hoveredTarget) {
        this._hoveredTarget = undefined;
      }
      this._activeObject = undefined;
      return true;
    }
    return false;
  }

  /**
   * Discards currently active object and fire events. If the function is called by fabric
   * as a consequence of a mouse event, the event is passed as a parameter and
   * sent to the fire function for the custom events. When used as a method the
   * e param does not have any application.
   * @param {event} e
   * @return {Boolean} true if the active object has been discarded
   */
  discardActiveObject(e) {
    const currentActives = this.getActiveObjects(),
      activeObject = this.getActiveObject();
    if (currentActives.length) {
      this.fire('before:selection:cleared', {
        e,
        deselected: [activeObject]
      });
    }
    const discarded = this._discardActiveObject(e);
    this._fireSelectionEvents(currentActives, e);
    return discarded;
  }

  /**
   * End the current transform.
   * You don't usually need to call this method unless you are interrupting a user initiated transform
   * because of some other event ( a press of key combination, or something that block the user UX )
   * @param {Event} [e] send the mouse event that generate the finalize down, so it can be used in the event
   */
  endCurrentTransform(e) {
    const transform = this._currentTransform;
    this._finalizeCurrentTransform(e);
    if (transform && transform.target) {
      // this could probably go inside _finalizeCurrentTransform
      transform.target.isMoving = false;
    }
    this._currentTransform = null;
  }

  /**
   * @private
   * @param {Event} e send the mouse event that generate the finalize down, so it can be used in the event
   */
  _finalizeCurrentTransform(e) {
    const transform = this._currentTransform,
      target = transform.target,
      options = {
        e,
        target,
        transform,
        action: transform.action
      };
    if (target._scaling) {
      target._scaling = false;
    }
    target.setCoords();
    if (transform.actionPerformed) {
      this.fire('object:modified', options);
      target.fire(MODIFIED, options);
    }
  }

  /**
   * Sets viewport transformation of this canvas instance
   * @param {Array} vpt a Canvas 2D API transform matrix
   */
  setViewportTransform(vpt) {
    super.setViewportTransform(vpt);
    const activeObject = this._activeObject;
    if (activeObject) {
      activeObject.setCoords();
    }
  }

  /**
   * @override clears active selection ref and interactive canvas elements and contexts
   */
  destroy() {
    // dispose of active selection
    const activeObject = this._activeObject;
    if (isActiveSelection(activeObject)) {
      activeObject.removeAll();
      activeObject.dispose();
    }
    delete this._activeObject;
    super.destroy();

    // free resources

    // pixel find canvas
    // @ts-expect-error disposing
    this.pixelFindContext = null;
    // @ts-expect-error disposing
    this.pixelFindCanvasEl = undefined;
  }

  /**
   * Clears all contexts (background, main, top) of an instance
   */
  clear() {
    // discard active object and fire events
    this.discardActiveObject();
    // make sure we clear the active object in case it refused to be discarded
    this._activeObject = undefined;
    this.clearContext(this.contextTop);
    super.clear();
  }

  /**
   * Draws objects' controls (borders/controls)
   * @param {CanvasRenderingContext2D} ctx Context to render controls on
   */
  drawControls(ctx) {
    const activeObject = this._activeObject;
    if (activeObject) {
      activeObject._renderControls(ctx);
    }
  }

  /**
   * @private
   */
  _toObject(instance, methodName, propertiesToInclude) {
    // If the object is part of the current selection group, it should
    // be transformed appropriately
    // i.e. it should be serialised as it would appear if the selection group
    // were to be destroyed.
    const originalProperties = this._realizeGroupTransformOnObject(instance),
      object = super._toObject(instance, methodName, propertiesToInclude);
    //Undo the damage we did by changing all of its properties
    instance.set(originalProperties);
    return object;
  }

  /**
   * Realizes an object's group transformation on it
   * @private
   * @param {FabricObject} [instance] the object to transform (gets mutated)
   * @returns the original values of instance which were changed
   */
  _realizeGroupTransformOnObject(instance) {
    const {
      group
    } = instance;
    if (group && isActiveSelection(group) && this._activeObject === group) {
      const layoutProps = ['angle', 'flipX', 'flipY', LEFT, SCALE_X, SCALE_Y, SKEW_X, SKEW_Y, TOP];
      const originalValues = pick(instance, layoutProps);
      addTransformToObject(instance, group.calcOwnMatrix());
      return originalValues;
    } else {
      return {};
    }
  }

  /**
   * @private
   */
  _setSVGObject(markup, instance, reviver) {
    // If the object is in a selection group, simulate what would happen to that
    // object when the group is deselected
    const originalProperties = this._realizeGroupTransformOnObject(instance);
    super._setSVGObject(markup, instance, reviver);
    instance.set(originalProperties);
  }
}
_defineProperty(SelectableCanvas, "ownDefaults", canvasDefaults);

/**
 * In charge of synchronizing all interactive text instances of a canvas
 */
class TextEditingManager {
  constructor(canvas) {
    _defineProperty(this, "targets", []);
    _defineProperty(this, "__disposer", void 0);
    const cb = () => {
      const {
        hiddenTextarea
      } = canvas.getActiveObject() || {};
      hiddenTextarea && hiddenTextarea.focus();
    };
    const el = canvas.upperCanvasEl;
    el.addEventListener('click', cb);
    this.__disposer = () => el.removeEventListener('click', cb);
  }
  exitTextEditing() {
    this.target = undefined;
    this.targets.forEach(target => {
      if (target.isEditing) {
        target.exitEditing();
      }
    });
  }
  add(target) {
    this.targets.push(target);
  }
  remove(target) {
    this.unregister(target);
    removeFromArray(this.targets, target);
  }
  register(target) {
    this.target = target;
  }
  unregister(target) {
    if (target === this.target) {
      this.target = undefined;
    }
  }
  onMouseMove(e) {
    var _this$target;
    ((_this$target = this.target) === null || _this$target === void 0 ? void 0 : _this$target.isEditing) && this.target.updateSelectionOnMouseMove(e);
  }
  clear() {
    this.targets = [];
    this.target = undefined;
  }
  dispose() {
    this.clear();
    this.__disposer();
    // @ts-expect-error disposing
    delete this.__disposer;
  }
}

const addEventOptions = {
  passive: false
};
const getEventPoints = (canvas, e) => {
  const viewportPoint = canvas.getViewportPoint(e);
  const scenePoint = canvas.getScenePoint(e);
  return {
    viewportPoint,
    scenePoint
  };
};

// just to be clear, the utils are now deprecated and those are here exactly as minifier helpers
// because el.addEventListener can't me be minified while a const yes and we use it 47 times in this file.
// few bytes but why give it away.
const addListener = function (el) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  return el.addEventListener(...args);
};
const removeListener = function (el) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }
  return el.removeEventListener(...args);
};
const syntheticEventConfig = {
  mouse: {
    in: 'over',
    out: 'out',
    targetIn: 'mouseover',
    targetOut: 'mouseout',
    canvasIn: 'mouse:over',
    canvasOut: 'mouse:out'
  },
  drag: {
    in: 'enter',
    out: 'leave',
    targetIn: 'dragenter',
    targetOut: 'dragleave',
    canvasIn: 'drag:enter',
    canvasOut: 'drag:leave'
  }
};
let Canvas$1 = class Canvas extends SelectableCanvas {
  constructor(el) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super(el, options);
    // bind event handlers
    /**
     * Contains the id of the touch event that owns the fabric transform
     * @type Number
     * @private
     */
    /**
     * Holds a reference to a setTimeout timer for event synchronization
     * @type number
     * @private
     */
    /**
     * Holds a reference to an object on the canvas that is receiving the drag over event.
     * @type FabricObject
     * @private
     */
    /**
     * Holds a reference to an object on the canvas from where the drag operation started
     * @type FabricObject
     * @private
     */
    /**
     * Holds a reference to an object on the canvas that is the current drop target
     * May differ from {@link _draggedoverTarget}
     * @todo inspect whether {@link _draggedoverTarget} and {@link _dropTarget} should be merged somehow
     * @type FabricObject
     * @private
     */
    /**
     * a boolean that keeps track of the click state during a cycle of mouse down/up.
     * If a mouse move occurs it becomes false.
     * Is true by default, turns false on mouse move.
     * Used to determine if a mouseUp is a click
     */
    _defineProperty(this, "_isClick", void 0);
    _defineProperty(this, "textEditingManager", new TextEditingManager(this));
    ['_onMouseDown', '_onTouchStart', '_onMouseMove', '_onMouseUp', '_onTouchEnd', '_onResize',
    // '_onGesture',
    // '_onDrag',
    // '_onShake',
    // '_onLongPress',
    // '_onOrientationChange',
    '_onMouseWheel', '_onMouseOut', '_onMouseEnter', '_onContextMenu', '_onClick', '_onDragStart', '_onDragEnd', '_onDragProgress', '_onDragOver', '_onDragEnter', '_onDragLeave', '_onDrop'].forEach(eventHandler => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      this[eventHandler] = this[eventHandler].bind(this);
    });
    // register event handlers
    this.addOrRemove(addListener);
  }

  /**
   * return an event prefix pointer or mouse.
   * @private
   */
  _getEventPrefix() {
    return this.enablePointerEvents ? 'pointer' : 'mouse';
  }
  addOrRemove(functor) {
    let forTouch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const canvasElement = this.upperCanvasEl,
      eventTypePrefix = this._getEventPrefix();
    functor(getWindowFromElement(canvasElement), 'resize', this._onResize);
    functor(canvasElement, eventTypePrefix + 'down', this._onMouseDown);
    functor(canvasElement, `${eventTypePrefix}move`, this._onMouseMove, addEventOptions);
    functor(canvasElement, `${eventTypePrefix}out`, this._onMouseOut);
    functor(canvasElement, `${eventTypePrefix}enter`, this._onMouseEnter);
    functor(canvasElement, 'wheel', this._onMouseWheel, {
      passive: false
    });
    functor(canvasElement, 'contextmenu', this._onContextMenu);
    if (!forTouch) {
      functor(canvasElement, 'click', this._onClick);
      functor(canvasElement, 'dblclick', this._onClick);
    }
    functor(canvasElement, 'dragstart', this._onDragStart);
    functor(canvasElement, 'dragend', this._onDragEnd);
    functor(canvasElement, 'dragover', this._onDragOver);
    functor(canvasElement, 'dragenter', this._onDragEnter);
    functor(canvasElement, 'dragleave', this._onDragLeave);
    functor(canvasElement, 'drop', this._onDrop);
    if (!this.enablePointerEvents) {
      functor(canvasElement, 'touchstart', this._onTouchStart, addEventOptions);
    }
  }

  /**
   * Removes all event listeners, used when disposing the instance
   */
  removeListeners() {
    this.addOrRemove(removeListener);
    // if you dispose on a mouseDown, before mouse up, you need to clean document to...
    const eventTypePrefix = this._getEventPrefix();
    const doc = getDocumentFromElement(this.upperCanvasEl);
    removeListener(doc, `${eventTypePrefix}up`, this._onMouseUp);
    removeListener(doc, 'touchend', this._onTouchEnd, addEventOptions);
    removeListener(doc, `${eventTypePrefix}move`, this._onMouseMove, addEventOptions);
    removeListener(doc, 'touchmove', this._onMouseMove, addEventOptions);
    clearTimeout(this._willAddMouseDown);
  }

  /**
   * @private
   * @param {Event} [e] Event object fired on wheel event
   */
  _onMouseWheel(e) {
    this._cacheTransformEventData(e);
    this._handleEvent(e, 'wheel');
    this._resetTransformEventData();
  }

  /**
   * @private
   * @param {Event} e Event object fired on mousedown
   */
  _onMouseOut(e) {
    const target = this._hoveredTarget;
    const shared = {
      e,
      ...getEventPoints(this, e)
    };
    this.fire('mouse:out', {
      ...shared,
      target
    });
    this._hoveredTarget = undefined;
    target && target.fire('mouseout', {
      ...shared
    });
    this._hoveredTargets.forEach(nestedTarget => {
      this.fire('mouse:out', {
        ...shared,
        target: nestedTarget
      });
      nestedTarget && nestedTarget.fire('mouseout', {
        ...shared
      });
    });
    this._hoveredTargets = [];
  }

  /**
   * @private
   * Used when the mouse cursor enter the canvas from outside
   * @param {Event} e Event object fired on mouseenter
   */
  _onMouseEnter(e) {
    // This find target and consequent 'mouse:over' is used to
    // clear old instances on hovered target.
    // calling findTarget has the side effect of killing target.__corner.
    // as a short term fix we are not firing this if we are currently transforming.
    // as a long term fix we need to separate the action of finding a target with the
    // side effects we added to it.
    const {
      target
    } = this.findTarget(e);
    // we fire the event only when there is no target, if there is a target, the specific
    // target event will fire.
    if (!this._currentTransform && !target) {
      this.fire('mouse:over', {
        e,
        ...getEventPoints(this, e)
      });
      this._hoveredTarget = undefined;
      this._hoveredTargets = [];
    }
  }

  /**
   * supports native like text dragging
   * @private
   * @param {DragEvent} e
   */
  _onDragStart(e) {
    this._isClick = false;
    const activeObject = this.getActiveObject();
    if (activeObject && activeObject.onDragStart(e)) {
      this._dragSource = activeObject;
      const options = {
        e,
        target: activeObject
      };
      this.fire('dragstart', options);
      activeObject.fire('dragstart', options);
      addListener(this.upperCanvasEl, 'drag', this._onDragProgress);
      return;
    }
    stopEvent(e);
  }

  /**
   * First we clear top context where the effects are being rendered.
   * Then we render the effects.
   * Doing so will render the correct effect for all cases including an overlap between `source` and `target`.
   * @private
   */
  _renderDragEffects(e, source, target) {
    let dirty = false;
    // clear top context
    const dropTarget = this._dropTarget;
    if (dropTarget && dropTarget !== source && dropTarget !== target) {
      dropTarget.clearContextTop();
      dirty = true;
    }
    source === null || source === void 0 || source.clearContextTop();
    target !== source && (target === null || target === void 0 ? void 0 : target.clearContextTop());
    // render effects
    const ctx = this.contextTop;
    ctx.save();
    ctx.transform(...this.viewportTransform);
    if (source) {
      ctx.save();
      source.transform(ctx);
      source.renderDragSourceEffect(e);
      ctx.restore();
      dirty = true;
    }
    if (target) {
      ctx.save();
      target.transform(ctx);
      target.renderDropTargetEffect(e);
      ctx.restore();
      dirty = true;
    }
    ctx.restore();
    dirty && (this.contextTopDirty = true);
  }

  /**
   * supports native like text dragging
   * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#finishing_a_drag
   * @private
   * @param {DragEvent} e
   */
  _onDragEnd(e) {
    const {
      currentSubTargets
    } = this.findTarget(e);
    const didDrop = !!e.dataTransfer && e.dataTransfer.dropEffect !== NONE,
      dropTarget = didDrop ? this._activeObject : undefined,
      options = {
        e,
        target: this._dragSource,
        subTargets: currentSubTargets,
        dragSource: this._dragSource,
        didDrop,
        dropTarget: dropTarget
      };
    removeListener(this.upperCanvasEl, 'drag', this._onDragProgress);
    this.fire('dragend', options);
    this._dragSource && this._dragSource.fire('dragend', options);
    delete this._dragSource;
    // we need to call mouse up synthetically because the browser won't
    this._onMouseUp(e);
  }

  /**
   * fire `drag` event on canvas and drag source
   * @private
   * @param {DragEvent} e
   */
  _onDragProgress(e) {
    const options = {
      e,
      target: this._dragSource,
      dragSource: this._dragSource,
      dropTarget: this._draggedoverTarget
    };
    this.fire('drag', options);
    this._dragSource && this._dragSource.fire('drag', options);
  }

  /**
   * prevent default to allow drop event to be fired
   * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#specifying_drop_targets
   * @private
   * @param {DragEvent} [e] Event object fired on Event.js shake
   */
  _onDragOver(e) {
    const eventType = 'dragover';
    const {
      currentContainer: target,
      currentSubTargets
    } = this.findTarget(e);
    const dragSource = this._dragSource;
    const options = {
      e,
      target,
      subTargets: currentSubTargets,
      dragSource,
      canDrop: false,
      dropTarget: undefined
    };
    let dropTarget;
    //  fire on canvas
    this.fire(eventType, options);
    //  make sure we fire dragenter events before dragover
    //  if dragleave is needed, object will not fire dragover so we don't need to trouble ourselves with it
    this._fireEnterLeaveEvents(e, target, options);
    if (target) {
      if (target.canDrop(e)) {
        dropTarget = target;
      }
      target.fire(eventType, options);
    }
    //  propagate the event to subtargets
    for (let i = 0; i < currentSubTargets.length; i++) {
      const subTarget = currentSubTargets[i];
      // accept event only if previous targets didn't (the accepting target calls `preventDefault` to inform that the event is taken)
      // TODO: verify if those should loop in inverse order then?
      // what is the order of subtargets?
      if (subTarget.canDrop(e)) {
        dropTarget = subTarget;
      }
      subTarget.fire(eventType, options);
    }
    //  render drag effects now that relations between source and target is clear
    this._renderDragEffects(e, dragSource, dropTarget);
    this._dropTarget = dropTarget;
  }

  /**
   * fire `dragleave` on `dragover` targets
   * @private
   * @param {Event} [e] Event object fired on Event.js shake
   */
  _onDragEnter(e) {
    const {
      currentContainer,
      currentSubTargets
    } = this.findTarget(e);
    const options = {
      e,
      target: currentContainer,
      subTargets: currentSubTargets,
      dragSource: this._dragSource
    };
    this.fire('dragenter', options);
    //  fire dragenter on targets
    this._fireEnterLeaveEvents(e, currentContainer, options);
  }

  /**
   * fire `dragleave` on `dragover` targets
   * @private
   * @param {Event} [e] Event object fired on Event.js shake
   */
  _onDragLeave(e) {
    const {
      currentSubTargets
    } = this.findTarget(e);
    const options = {
      e,
      target: this._draggedoverTarget,
      subTargets: currentSubTargets,
      dragSource: this._dragSource
    };
    this.fire('dragleave', options);

    //  fire dragleave on targets
    this._fireEnterLeaveEvents(e, undefined, options);
    this._renderDragEffects(e, this._dragSource);
    this._dropTarget = undefined;
    this._hoveredTargets = [];
  }

  /**
   * `drop:before` is a an event that allows you to schedule logic
   * before the `drop` event. Prefer `drop` event always, but if you need
   * to run some drop-disabling logic on an event, since there is no way
   * to handle event handlers ordering, use `drop:before`
   * @private
   * @param {Event} e
   */
  _onDrop(e) {
    const {
      currentContainer,
      currentSubTargets
    } = this.findTarget(e);
    const options = this._basicEventHandler('drop:before', {
      e,
      target: currentContainer,
      subTargets: currentSubTargets,
      dragSource: this._dragSource,
      ...getEventPoints(this, e)
    });
    //  will be set by the drop target
    options.didDrop = false;
    //  will be set by the drop target, used in case options.target refuses the drop
    options.dropTarget = undefined;
    //  fire `drop`
    this._basicEventHandler('drop', options);
    //  inform canvas of the drop
    //  we do this because canvas was unaware of what happened at the time the `drop` event was fired on it
    //  use for side effects
    this.fire('drop:after', options);
  }

  /**
   * @private
   * @param {Event} e Event object fired on mousedown
   */
  _onContextMenu(e) {
    const {
      target,
      subTargets
    } = this.findTarget(e);
    const options = this._basicEventHandler('contextmenu:before', {
      e,
      target,
      subTargets
    });
    // TODO: this line is silly because the dev can subscribe to the event and prevent it themselves
    this.stopContextMenu && stopEvent(e);
    this._basicEventHandler('contextmenu', options);
    return false;
  }

  /**
   * @private
   * @param {Event} e Event object fired on mousedown
   */
  _onClick(e) {
    const clicks = e.detail;
    if (clicks > 3 || clicks < 2) return;
    this._cacheTransformEventData(e);
    clicks == 2 && e.type === 'dblclick' && this._handleEvent(e, 'dblclick');
    clicks == 3 && this._handleEvent(e, 'tripleclick');
    this._resetTransformEventData();
  }

  /**
   * This supports gesture event firing
   * It is a method to keep some code organized, it exposes private methods
   * in a way that works and still keep them private
   * This is supposed to mirror _handleEvent
   */
  fireEventFromPointerEvent(e, eventName, secondaryName) {
    let extraData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    this._cacheTransformEventData(e);
    const {
        target,
        subTargets
      } = this.findTarget(e),
      options = {
        e,
        target,
        subTargets,
        ...getEventPoints(this, e),
        transform: this._currentTransform,
        ...extraData
      };
    this.fire(eventName, options);
    // this may be a little be more complicated of what we want to handle
    target && target.fire(secondaryName, options);
    for (let i = 0; i < subTargets.length; i++) {
      subTargets[i] !== target && subTargets[i].fire(secondaryName, options);
    }
    this._resetTransformEventData();
  }

  /**
   * Return a the id of an event.
   * returns either the pointerId or the identifier or 0 for the mouse event
   * @private
   * @param {Event} evt Event object
   */
  getPointerId(evt) {
    const changedTouches = evt.changedTouches;
    if (changedTouches) {
      return changedTouches[0] && changedTouches[0].identifier;
    }
    if (this.enablePointerEvents) {
      return evt.pointerId;
    }
    return -1;
  }

  /**
   * Determines if an event has the id of the event that is considered main
   * @private
   * @param {evt} event Event object
   */
  _isMainEvent(evt) {
    if (evt.isPrimary === true) {
      return true;
    }
    if (evt.isPrimary === false) {
      return false;
    }
    if (evt.type === 'touchend' && evt.touches.length === 0) {
      return true;
    }
    if (evt.changedTouches) {
      return evt.changedTouches[0].identifier === this.mainTouchId;
    }
    return true;
  }

  /**
   * @private
   * @param {Event} e Event object fired on mousedown
   */
  _onTouchStart(e) {
    this._cacheTransformEventData(e);
    // we will prevent scrolling if allowTouchScrolling is not enabled and
    let shouldPreventScrolling = !this.allowTouchScrolling;
    const currentActiveObject = this._activeObject;
    if (this.mainTouchId === undefined) {
      this.mainTouchId = this.getPointerId(e);
    }
    this.__onMouseDown(e);
    const {
      target
    } = this.findTarget(e);
    // after executing fabric logic for mouse down let's see
    // if we didn't change target or if we are drawing
    // we want to prevent scrolling anyway
    if (this.isDrawingMode || currentActiveObject && target === currentActiveObject) {
      shouldPreventScrolling = true;
    }
    // prevent default, will block scrolling from start
    shouldPreventScrolling && e.preventDefault();
    const canvasElement = this.upperCanvasEl,
      eventTypePrefix = this._getEventPrefix();
    const doc = getDocumentFromElement(canvasElement);
    addListener(doc, 'touchend', this._onTouchEnd, addEventOptions);
    // if we scroll don't register the touch move event
    shouldPreventScrolling && addListener(doc, 'touchmove', this._onMouseMove, addEventOptions);
    // Unbind mousedown to prevent double triggers from touch devices
    removeListener(canvasElement, `${eventTypePrefix}down`, this._onMouseDown);
    this._resetTransformEventData();
  }

  /**
   * @private
   * @param {Event} e Event object fired on mousedown
   */
  _onMouseDown(e) {
    this._cacheTransformEventData(e);
    this.__onMouseDown(e);
    const canvasElement = this.upperCanvasEl,
      eventTypePrefix = this._getEventPrefix();
    // switch from moving on the canvas element to moving on the document
    removeListener(canvasElement, `${eventTypePrefix}move`, this._onMouseMove, addEventOptions);
    const doc = getDocumentFromElement(canvasElement);
    addListener(doc, `${eventTypePrefix}up`, this._onMouseUp);
    addListener(doc, `${eventTypePrefix}move`, this._onMouseMove, addEventOptions);
    this._resetTransformEventData();
  }

  /**
   * @private
   * @param {Event} e Event object fired on mousedown
   */
  _onTouchEnd(e) {
    if (e.touches.length > 0) {
      // if there are still touches stop here
      return;
    }
    this._cacheTransformEventData(e);
    this.__onMouseUp(e);
    this._resetTransformEventData();
    delete this.mainTouchId;
    const eventTypePrefix = this._getEventPrefix();
    const doc = getDocumentFromElement(this.upperCanvasEl);
    removeListener(doc, 'touchend', this._onTouchEnd, addEventOptions);
    removeListener(doc, 'touchmove', this._onMouseMove, addEventOptions);
    if (this._willAddMouseDown) {
      clearTimeout(this._willAddMouseDown);
    }
    this._willAddMouseDown = setTimeout(() => {
      // Wait 400ms before rebinding mousedown to prevent double triggers
      // from touch devices
      addListener(this.upperCanvasEl, `${eventTypePrefix}down`, this._onMouseDown);
      this._willAddMouseDown = 0;
    }, 400);
  }

  /**
   * @private
   * @param {Event} e Event object fired on mouseup
   */
  _onMouseUp(e) {
    this._cacheTransformEventData(e);
    this.__onMouseUp(e);
    const canvasElement = this.upperCanvasEl,
      eventTypePrefix = this._getEventPrefix();
    if (this._isMainEvent(e)) {
      const doc = getDocumentFromElement(this.upperCanvasEl);
      removeListener(doc, `${eventTypePrefix}up`, this._onMouseUp);
      removeListener(doc, `${eventTypePrefix}move`, this._onMouseMove, addEventOptions);
      addListener(canvasElement, `${eventTypePrefix}move`, this._onMouseMove, addEventOptions);
    }
    this._resetTransformEventData();
  }

  /**
   * @private
   * @param {Event} e Event object fired on mousemove
   */
  _onMouseMove(e) {
    this._cacheTransformEventData(e);
    const activeObject = this.getActiveObject();
    !this.allowTouchScrolling && (!activeObject ||
    // a drag event sequence is started by the active object flagging itself on mousedown / mousedown:before
    // we must not prevent the event's default behavior in order for the window to start dragging
    !activeObject.shouldStartDragging(e)) && e.preventDefault && e.preventDefault();
    this.__onMouseMove(e);
    this._resetTransformEventData();
  }

  /**
   * @private
   */
  _onResize() {
    this.calcOffset();
    this._resetTransformEventData();
  }

  /**
   * Decides whether the canvas should be redrawn in mouseup and mousedown events.
   * @private
   * @param {Object} target
   */
  _shouldRender(target) {
    const activeObject = this.getActiveObject();
    // if just one of them is available or if they are both but are different objects
    // this covers: switch of target, from target to no target, selection of target
    // multiSelection with key and mouse
    return !!activeObject !== !!target || activeObject && target && activeObject !== target;
  }

  /**
   * Method that defines the actions when mouse is released on canvas.
   * The method resets the currentTransform parameters, store the image corner
   * position in the image object and render the canvas on top.
   * @private
   * @param {Event} e Event object fired on mouseup
   */
  __onMouseUp(e) {
    var _this$_activeObject;
    this._handleEvent(e, 'up:before');
    const transform = this._currentTransform;
    const isClick = this._isClick;
    const {
      target
    } = this.findTarget(e);

    // if right/middle click just fire events and return
    // target undefined will make the _handleEvent search the target
    const {
      button
    } = e;
    if (button) {
      (this.fireMiddleClick && button === 1 || this.fireRightClick && button === 2) && this._handleEvent(e, 'up');
      return;
    }
    if (this.isDrawingMode && this._isCurrentlyDrawing) {
      this._onMouseUpInDrawingMode(e);
      return;
    }
    if (!this._isMainEvent(e)) {
      return;
    }
    let shouldRender = false;
    if (transform) {
      this._finalizeCurrentTransform(e);
      shouldRender = transform.actionPerformed;
    }
    if (!isClick) {
      const targetWasActive = target === this._activeObject;
      this.handleSelection(e);
      if (!shouldRender) {
        shouldRender = this._shouldRender(target) || !targetWasActive && target === this._activeObject;
      }
    }
    let pointer, corner;
    if (target) {
      const found = target.findControl(this.getViewportPoint(e), isTouchEvent(e));
      const {
        key,
        control
      } = found || {};
      corner = key;
      if (target.selectable && target !== this._activeObject && target.activeOn === 'up') {
        this.setActiveObject(target, e);
        shouldRender = true;
      } else if (control) {
        const mouseUpHandler = control.getMouseUpHandler(e, target, control);
        if (mouseUpHandler) {
          pointer = this.getScenePoint(e);
          mouseUpHandler.call(control, e, transform, pointer.x, pointer.y);
        }
      }
      target.isMoving = false;
    }
    // if we are ending up a transform on a different control or a new object
    // fire the original mouse up from the corner that started the transform
    if (transform && (transform.target !== target || transform.corner !== corner)) {
      const originalControl = transform.target && transform.target.controls[transform.corner],
        originalMouseUpHandler = originalControl && originalControl.getMouseUpHandler(e, transform.target, originalControl);
      pointer = pointer || this.getScenePoint(e);
      originalMouseUpHandler && originalMouseUpHandler.call(originalControl, e, transform, pointer.x, pointer.y);
    }
    this._setCursorFromEvent(e, target);
    this._handleEvent(e, 'up');
    this._groupSelector = null;
    this._currentTransform = null;
    // reset the target information about which corner is selected
    target && (target.__corner = undefined);
    if (shouldRender) {
      this.requestRenderAll();
    } else if (!isClick && !((_this$_activeObject = this._activeObject) !== null && _this$_activeObject !== void 0 && _this$_activeObject.isEditing)) {
      this.renderTop();
    }
  }
  _basicEventHandler(eventType, options) {
    const {
      target,
      subTargets = []
    } = options;
    this.fire(eventType, options);
    target && target.fire(eventType, options);
    for (let i = 0; i < subTargets.length; i++) {
      subTargets[i] !== target && subTargets[i].fire(eventType, options);
    }
    return options;
  }

  /**
   * @private
   * Handle event firing for target and subtargets
   * @param {TPointerEvent} e event from mouse
   * @param {TPointerEventNames} eventType
   */
  _handleEvent(e, eventType, extraData) {
    const {
        target,
        subTargets
      } = this.findTarget(e),
      options = {
        e,
        target,
        subTargets,
        ...getEventPoints(this, e),
        transform: this._currentTransform,
        ...(eventType === 'down:before' || eventType === 'down' ? extraData : {})
      };
    if (eventType === 'up:before' || eventType === 'up') {
      options.isClick = this._isClick;
    }
    this.fire(`mouse:${eventType}`, options);
    // this may be a little be more complicated of what we want to handle
    target && target.fire(`mouse${eventType}`, options);
    for (let i = 0; i < subTargets.length; i++) {
      subTargets[i] !== target && subTargets[i].fire(`mouse${eventType}`, options);
    }
  }

  /**
   * @private
   * @param {Event} e Event object fired on mousedown
   */
  _onMouseDownInDrawingMode(e) {
    this._isCurrentlyDrawing = true;
    if (this.getActiveObject()) {
      this.discardActiveObject(e);
      this.requestRenderAll();
    }
    // TODO: this is a scene point so it should be renamed
    const pointer = this.getScenePoint(e);
    this.freeDrawingBrush && this.freeDrawingBrush.onMouseDown(pointer, {
      e,
      pointer
    });
    this._handleEvent(e, 'down', {
      alreadySelected: false
    });
  }

  /**
   * @private
   * @param {Event} e Event object fired on mousemove
   */
  _onMouseMoveInDrawingMode(e) {
    if (this._isCurrentlyDrawing) {
      const pointer = this.getScenePoint(e);
      this.freeDrawingBrush && this.freeDrawingBrush.onMouseMove(pointer, {
        e,
        // this is an absolute pointer, the naming is wrong
        pointer
      });
    }
    this.setCursor(this.freeDrawingCursor);
    this._handleEvent(e, 'move');
  }

  /**
   * @private
   * @param {Event} e Event object fired on mouseup
   */
  _onMouseUpInDrawingMode(e) {
    const pointer = this.getScenePoint(e);
    if (this.freeDrawingBrush) {
      this._isCurrentlyDrawing = !!this.freeDrawingBrush.onMouseUp({
        e: e,
        // this is an absolute pointer, the naming is wrong
        pointer
      });
    } else {
      this._isCurrentlyDrawing = false;
    }
    this._handleEvent(e, 'up');
  }

  /**
   * Method that defines the actions when mouse is clicked on canvas.
   * The method inits the currentTransform parameters and renders all the
   * canvas so the current image can be placed on the top canvas and the rest
   * in on the container one.
   * @private
   * @param {Event} e Event object fired on mousedown
   */
  __onMouseDown(e) {
    this._isClick = true;
    this._handleEvent(e, 'down:before');
    let {
      target
    } = this.findTarget(e);
    let alreadySelected = !!target && target === this._activeObject;
    // if right/middle click just fire events
    const {
      button
    } = e;
    if (button) {
      (this.fireMiddleClick && button === 1 || this.fireRightClick && button === 2) && this._handleEvent(e, 'down', {
        alreadySelected
      });
      return;
    }
    if (this.isDrawingMode) {
      this._onMouseDownInDrawingMode(e);
      return;
    }
    if (!this._isMainEvent(e)) {
      return;
    }

    // ignore if some object is being transformed at this moment
    if (this._currentTransform) {
      return;
    }
    let shouldRender = this._shouldRender(target);
    let grouped = false;
    if (this.handleMultiSelection(e, target)) {
      // active object might have changed while grouping
      target = this._activeObject;
      grouped = true;
      shouldRender = true;
    } else if (this._shouldClearSelection(e, target)) {
      this.discardActiveObject(e);
    }
    // we start a group selector rectangle if
    // selection is enabled
    // and there is no target, or the following 3 conditions are satisfied:
    // target is not selectable ( otherwise we selected it )
    // target is not editing
    // target is not already selected ( otherwise we drag )
    if (this.selection && (!target || !target.selectable && !target.isEditing && target !== this._activeObject)) {
      const p = this.getScenePoint(e);
      this._groupSelector = {
        x: p.x,
        y: p.y,
        deltaY: 0,
        deltaX: 0
      };
    }

    // check again because things could have changed
    alreadySelected = !!target && target === this._activeObject;
    if (target) {
      if (target.selectable && target.activeOn === 'down') {
        this.setActiveObject(target, e);
      }
      const handle = target.findControl(this.getViewportPoint(e), isTouchEvent(e));
      if (target === this._activeObject && (handle || !grouped)) {
        this._setupCurrentTransform(e, target, alreadySelected);
        const control = handle ? handle.control : undefined,
          pointer = this.getScenePoint(e),
          mouseDownHandler = control && control.getMouseDownHandler(e, target, control);
        mouseDownHandler && mouseDownHandler.call(control, e, this._currentTransform, pointer.x, pointer.y);
      }
    }
    //  we clear `_objectsToRender` in case of a change in order to repopulate it at rendering
    //  run before firing the `down` event to give the dev a chance to populate it themselves
    shouldRender && (this._objectsToRender = undefined);
    this._handleEvent(e, 'down', {
      alreadySelected: alreadySelected
    });
    // we must renderAll so that we update the visuals
    shouldRender && this.requestRenderAll();
  }

  /**
   * reset cache form common information needed during event processing
   * @private
   */
  _resetTransformEventData() {
    this._targetInfo = this._viewportPoint = this._scenePoint = undefined;
  }

  /**
   * Cache common information needed during event processing
   * @private
   * @param {Event} e Event object fired on event
   */
  _cacheTransformEventData(e) {
    // reset in order to avoid stale caching
    this._resetTransformEventData();
    this._viewportPoint = this.getViewportPoint(e);
    this._scenePoint = sendPointToPlane(this._viewportPoint, undefined, this.viewportTransform);
    this._targetInfo = this.findTarget(e);
    // TODO: investigate better if this can be made less implicit in the code
    if (this._currentTransform) {
      this._targetInfo.target = this._currentTransform.target;
    }
  }

  /**
   * Method that defines the actions when mouse is hovering the canvas.
   * The currentTransform parameter will define whether the user is rotating/scaling/translating
   * an image or neither of them (only hovering). A group selection is also possible and would cancel
   * all any other type of action.
   * In case of an image transformation only the top canvas will be rendered.
   * @private
   * @param {Event} e Event object fired on mousemove
   */
  __onMouseMove(e) {
    this._isClick = false;
    this._handleEvent(e, 'move:before');
    if (this.isDrawingMode) {
      this._onMouseMoveInDrawingMode(e);
      return;
    }
    if (!this._isMainEvent(e)) {
      return;
    }
    const groupSelector = this._groupSelector;

    // We initially clicked in an empty area, so we draw a box for multiple selection
    if (groupSelector) {
      const pointer = this.getScenePoint(e);
      groupSelector.deltaX = pointer.x - groupSelector.x;
      groupSelector.deltaY = pointer.y - groupSelector.y;
      this.renderTop();
    } else if (!this._currentTransform) {
      const {
        target
      } = this.findTarget(e);
      this._setCursorFromEvent(e, target);
      this._fireOverOutEvents(e, target);
    } else {
      this._transformObject(e);
    }
    this.textEditingManager.onMouseMove(e);
    this._handleEvent(e, 'move');
  }

  /**
   * Manage the mouseout, mouseover events for the fabric object on the canvas
   * @param {Fabric.Object} target the target where the target from the mousemove event
   * @param {Event} e Event object fired on mousemove
   * @private
   */
  _fireOverOutEvents(e, target) {
    const {
        _hoveredTarget,
        _hoveredTargets
      } = this,
      {
        subTargets
      } = this.findTarget(e),
      length = Math.max(_hoveredTargets.length, subTargets.length);
    this.fireSyntheticInOutEvents('mouse', {
      e,
      target,
      oldTarget: _hoveredTarget,
      fireCanvas: true
    });
    for (let i = 0; i < length; i++) {
      if (subTargets[i] === target || _hoveredTargets[i] && _hoveredTargets[i] === _hoveredTarget) {
        continue;
      }
      this.fireSyntheticInOutEvents('mouse', {
        e,
        target: subTargets[i],
        oldTarget: _hoveredTargets[i]
      });
    }
    this._hoveredTarget = target;
    this._hoveredTargets = subTargets;
  }

  /**
   * Manage the dragEnter, dragLeave events for the fabric objects on the canvas
   * @param {Fabric.Object} target the target where the target from the onDrag event
   * @param {Object} data Event object fired on dragover
   * @private
   */
  _fireEnterLeaveEvents(e, target, data) {
    const draggedoverTarget = this._draggedoverTarget,
      _hoveredTargets = this._hoveredTargets,
      {
        subTargets
      } = this.findTarget(e),
      length = Math.max(_hoveredTargets.length, subTargets.length);
    this.fireSyntheticInOutEvents('drag', {
      ...data,
      target,
      oldTarget: draggedoverTarget,
      fireCanvas: true
    });
    for (let i = 0; i < length; i++) {
      this.fireSyntheticInOutEvents('drag', {
        ...data,
        target: subTargets[i],
        oldTarget: _hoveredTargets[i]
      });
    }
    this._draggedoverTarget = target;
  }

  /**
   * Manage the synthetic in/out events for the fabric objects on the canvas
   * @param {Fabric.Object} target the target where the target from the supported events
   * @param {Object} data Event object fired
   * @param {Object} config configuration for the function to work
   * @param {String} config.targetName property on the canvas where the old target is stored
   * @param {String} [config.canvasEvtOut] name of the event to fire at canvas level for out
   * @param {String} config.evtOut name of the event to fire for out
   * @param {String} [config.canvasEvtIn] name of the event to fire at canvas level for in
   * @param {String} config.evtIn name of the event to fire for in
   * @private
   */
  fireSyntheticInOutEvents(type, _ref) {
    let {
      target,
      oldTarget,
      fireCanvas,
      e,
      ...data
    } = _ref;
    const {
      targetIn,
      targetOut,
      canvasIn,
      canvasOut
    } = syntheticEventConfig[type];
    const targetChanged = oldTarget !== target;
    if (oldTarget && targetChanged) {
      const outOpt = {
        ...data,
        e,
        target: oldTarget,
        nextTarget: target,
        ...getEventPoints(this, e)
      };
      fireCanvas && this.fire(canvasOut, outOpt);
      oldTarget.fire(targetOut, outOpt);
    }
    if (target && targetChanged) {
      const inOpt = {
        ...data,
        e,
        target,
        previousTarget: oldTarget,
        ...getEventPoints(this, e)
      };
      fireCanvas && this.fire(canvasIn, inOpt);
      target.fire(targetIn, inOpt);
    }
  }

  /**
   * @private
   * @param {Event} e Event fired on mousemove
   */
  _transformObject(e) {
    const scenePoint = this.getScenePoint(e),
      transform = this._currentTransform,
      target = transform.target,
      //  transform pointer to target's containing coordinate plane
      //  both pointer and object should agree on every point
      localPointer = target.group ? sendPointToPlane(scenePoint, undefined, target.group.calcTransformMatrix()) : scenePoint;
    transform.shiftKey = e.shiftKey;
    transform.altKey = !!this.centeredKey && e[this.centeredKey];
    this._performTransformAction(e, transform, localPointer);
    transform.actionPerformed && this.requestRenderAll();
  }

  /**
   * @private
   */
  _performTransformAction(e, transform, pointer) {
    const {
      action,
      actionHandler,
      target
    } = transform;
    const actionPerformed = !!actionHandler && actionHandler(e, transform, pointer.x, pointer.y);
    actionPerformed && target.setCoords();

    // this object could be created from the function in the control handlers
    if (action === 'drag' && actionPerformed) {
      transform.target.isMoving = true;
      this.setCursor(transform.target.moveCursor || this.moveCursor);
    }
    transform.actionPerformed = transform.actionPerformed || actionPerformed;
  }

  /**
   * Sets the cursor depending on where the canvas is being hovered.
   * Note: very buggy in Opera
   * @param {Event} e Event object
   * @param {Object} target Object that the mouse is hovering, if so.
   */
  _setCursorFromEvent(e, target) {
    if (!target) {
      this.setCursor(this.defaultCursor);
      return;
    }
    let hoverCursor = target.hoverCursor || this.hoverCursor;
    const activeSelection = isActiveSelection(this._activeObject) ? this._activeObject : null,
      // only show proper corner when group selection is not active
      corner = (!activeSelection || target.group !== activeSelection) &&
      // here we call findTargetCorner always with undefined for the touch parameter.
      // we assume that if you are using a cursor you do not need to interact with
      // the bigger touch area.
      target.findControl(this.getViewportPoint(e));
    if (!corner) {
      if (target.subTargetCheck) {
        // hoverCursor should come from top-most subTarget,
        // so we walk the array backwards
        const {
          subTargets
        } = this.findTarget(e);
        subTargets.concat().reverse().forEach(_target => {
          hoverCursor = _target.hoverCursor || hoverCursor;
        });
      }
      this.setCursor(hoverCursor);
    } else {
      const {
        control,
        coord
      } = corner;
      this.setCursor(control.cursorStyleHandler(e, control, target, coord));
    }
  }

  /**
   * ## Handles multiple selection
   * - toggles `target` selection (selects/deselects `target` if it isn't/is selected respectively)
   * - sets the active object in case it is not set or in case there is a single active object left under active selection.
   * ---
   * - If the active object is the active selection we add/remove `target` from it
   * - If not, add the active object and `target` to the active selection and make it the active object.
   * @TODO rewrite this after find target is refactored
   * @private
   * @param {TPointerEvent} e Event object
   * @param {FabricObject} target target of event to select/deselect
   * @returns true if grouping occurred
   */
  handleMultiSelection(e, target) {
    const activeObject = this._activeObject;
    const isAS = isActiveSelection(activeObject);
    if (
    // check if an active object exists on canvas and if the user is pressing the `selectionKey` while canvas supports multi selection.
    !!activeObject && this._isSelectionKeyPressed(e) && this.selection &&
    // on top of that the user also has to hit a target that is selectable.
    !!target && target.selectable && (
    // group target and active object only if they are different objects
    // else we try to find a subtarget of `ActiveSelection`
    activeObject !== target || isAS) && (
    //  make sure `activeObject` and `target` aren't ancestors of each other in case `activeObject` is not `ActiveSelection`
    // if it is then we want to remove `target` from it
    isAS || !target.isDescendantOf(activeObject) && !activeObject.isDescendantOf(target)) &&
    //  target accepts selection
    !target.onSelect({
      e
    }) &&
    // make sure we are not on top of a control
    !activeObject.getActiveControl()) {
      if (isAS) {
        const prevActiveObjects = activeObject.getObjects();
        let subTargets = [];
        // const { subTargets: testSubTargets } = this.findTarget(e);
        if (target === activeObject) {
          const pointer = this.getScenePoint(e);
          let targetInfo = this.searchPossibleTargets(prevActiveObjects, pointer);
          // console.log(testSubTargets.includes(targetInfo.target));
          if (targetInfo.target) {
            target = targetInfo.target;
            subTargets = targetInfo.subTargets;
          } else {
            targetInfo = this.searchPossibleTargets(this._objects, pointer);
            target = targetInfo.target;
            subTargets = targetInfo.subTargets;
          }
          // if nothing is found bail out
          if (!target || !target.selectable) {
            return false;
          }
        }
        if (target.group === activeObject) {
          // `target` is part of active selection => remove it
          activeObject.remove(target);
          this._hoveredTarget = target;
          this._hoveredTargets = subTargets;
          // if after removing an object we are left with one only...
          if (activeObject.size() === 1) {
            // activate last remaining object
            // deselecting the active selection will remove the remaining object from it
            this._setActiveObject(activeObject.item(0), e);
          }
        } else {
          // `target` isn't part of active selection => add it
          activeObject.multiSelectAdd(target);
          this._hoveredTarget = activeObject;
          this._hoveredTargets = subTargets;
        }
        this._fireSelectionEvents(prevActiveObjects, e);
      } else {
        activeObject.isEditing && activeObject.exitEditing();
        // add the active object and the target to the active selection and set it as the active object
        const klass = classRegistry.getClass('ActiveSelection');
        const newActiveSelection = new klass([], {
          /**
           * it is crucial to pass the canvas ref before calling {@link ActiveSelection#multiSelectAdd}
           * since it uses {@link FabricObject#isInFrontOf} which relies on the canvas ref
           */
          canvas: this
        });
        newActiveSelection.multiSelectAdd(activeObject, target);
        this._hoveredTarget = newActiveSelection;
        // ISSUE 4115: should we consider subTargets here?
        // this._hoveredTargets = [];
        // this._hoveredTargets = this.targets.concat();
        this._setActiveObject(newActiveSelection, e);
        this._fireSelectionEvents([activeObject], e);
      }
      return true;
    }
    return false;
  }

  /**
   * ## Handles selection
   * - selects objects that are contained in (and possibly intersecting) the selection bounding box
   * - sets the active object
   * ---
   * runs on mouse up after a mouse move
   */
  handleSelection(e) {
    if (!this.selection || !this._groupSelector) {
      return false;
    }
    const {
        x,
        y,
        deltaX,
        deltaY
      } = this._groupSelector,
      point1 = new Point(x, y),
      point2 = point1.add(new Point(deltaX, deltaY)),
      tl = point1.min(point2),
      br = point1.max(point2),
      size = br.subtract(tl);
    const collectedObjects = this.collectObjects({
      left: tl.x,
      top: tl.y,
      width: size.x,
      height: size.y
    }, {
      includeIntersecting: !this.selectionFullyContained
    });
    const objects =
    // though this method runs only after mouse move the pointer could do a mouse up on the same position as mouse down
    // should it be handled as is?
    point1.eq(point2) ? collectedObjects[0] ? [collectedObjects[0]] : [] : collectedObjects.length > 1 ? collectedObjects.filter(object => !object.onSelect({
      e
    })).reverse() :
    // `setActiveObject` will call `onSelect(collectedObjects[0])` in this case
    collectedObjects;

    // set active object
    if (objects.length === 1) {
      // set as active object
      this.setActiveObject(objects[0], e);
    } else if (objects.length > 1) {
      // add to active selection and make it the active object
      const klass = classRegistry.getClass('ActiveSelection');
      this.setActiveObject(new klass(objects, {
        canvas: this
      }), e);
    }

    // cleanup
    this._groupSelector = null;
    return true;
  }

  /**
   * Wraps the original toCanvasElement with a function that removes
   * the context top for the time the function is run.
   * So we avoid painting side effects on the upper canvas when exporting
   */
  toCanvasElement() {
    let multiplier = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    let options = arguments.length > 1 ? arguments[1] : undefined;
    const {
      upper
    } = this.elements;
    upper.ctx = undefined;
    const htmlElement = super.toCanvasElement(multiplier, options);
    upper.ctx = upper.el.getContext('2d');
    return htmlElement;
  }

  /**
   * @override clear {@link textEditingManager}
   */
  clear() {
    this.textEditingManager.clear();
    super.clear();
  }

  /**
   * @override clear {@link textEditingManager}
   */
  destroy() {
    this.removeListeners();
    this.textEditingManager.dispose();
    super.destroy();
  }
};

const linearDefaultCoords = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0
};
const radialDefaultCoords = {
  ...linearDefaultCoords,
  r1: 0,
  r2: 0
};

/**
 *
 * @param value value to check if NaN
 * @param [valueIfNaN]
 * @returns `fallback` is `value is NaN
 */
const ifNaN = (value, valueIfNaN) => {
  return isNaN(value) && typeof valueIfNaN === 'number' ? valueIfNaN : value;
};

/**
 * Will loosely accept as percent numbers that are not like
 * 3.4a%. This function does not check for the correctness of a percentage
 * but it checks that values that are in theory correct are or arent percentages
 */
function isPercent(value) {
  // /%$/ Matches strings that end with a percent sign (%)
  return value && /%$/.test(value) && Number.isFinite(parseFloat(value));
}

/**
 * Parse a percentage value in an svg.
 * @param value
 * @param fallback in case of not possible to parse the number
 * @returns ∈ [0, 1]
 */
function parsePercent(value, valueIfNaN) {
  const parsed = typeof value === 'number' ? value : typeof value === 'string' ? parseFloat(value) / (isPercent(value) ? 100 : 1) : NaN;
  return capValue(0, ifNaN(parsed, valueIfNaN), 1);
}

const RE_KEY_VALUE_PAIRS = /\s*;\s*/;
const RE_KEY_VALUE = /\s*:\s*/;
function parseColorStop(el, opacityMultiplier) {
  let colorValue, opacityValue;
  const style = el.getAttribute('style');
  if (style) {
    const keyValuePairs = style.split(RE_KEY_VALUE_PAIRS);
    if (keyValuePairs[keyValuePairs.length - 1] === '') {
      keyValuePairs.pop();
    }
    for (let i = keyValuePairs.length; i--;) {
      const [key, value] = keyValuePairs[i].split(RE_KEY_VALUE).map(s => s.trim());
      if (key === 'stop-color') {
        colorValue = value;
      } else if (key === 'stop-opacity') {
        opacityValue = value;
      }
    }
  }
  colorValue = colorValue || el.getAttribute('stop-color') || 'rgb(0,0,0)';
  opacityValue = ifNaN(parseFloat(opacityValue || el.getAttribute('stop-opacity') || ''), 1);
  const color = new Color(colorValue);
  color.setAlpha(color.getAlpha() * opacityValue * opacityMultiplier);
  return {
    offset: parsePercent(el.getAttribute('offset'), 0),
    color: color.toRgba()
  };
}
function parseColorStops(el, opacityAttr) {
  const colorStops = [],
    colorStopEls = el.getElementsByTagName('stop'),
    multiplier = parsePercent(opacityAttr, 1);
  for (let i = colorStopEls.length; i--;) {
    colorStops.push(parseColorStop(colorStopEls[i], multiplier));
  }
  return colorStops;
}

function parseType(el) {
  return el.nodeName === 'linearGradient' || el.nodeName === 'LINEARGRADIENT' ? 'linear' : 'radial';
}
function parseGradientUnits(el) {
  return el.getAttribute('gradientUnits') === 'userSpaceOnUse' ? 'pixels' : 'percentage';
}

function convertPercentUnitsToValues(valuesToConvert, _ref) {
  let {
    width,
    height,
    gradientUnits
  } = _ref;
  let finalValue;
  return Object.entries(valuesToConvert).reduce((acc, _ref2) => {
    let [prop, propValue] = _ref2;
    if (propValue === 'Infinity') {
      finalValue = 1;
    } else if (propValue === '-Infinity') {
      finalValue = 0;
    } else {
      const isString = typeof propValue === 'string';
      finalValue = isString ? parseFloat(propValue) : propValue;
      if (isString && isPercent(propValue)) {
        finalValue *= 0.01;
        if (gradientUnits === 'pixels') {
          // then we need to fix those percentages here in svg parsing
          if (prop === 'x1' || prop === 'x2' || prop === 'r2') {
            finalValue *= width;
          }
          if (prop === 'y1' || prop === 'y2') {
            finalValue *= height;
          }
        }
      }
    }
    acc[prop] = finalValue;
    return acc;
  }, {});
}
function getValue(el, key) {
  return el.getAttribute(key);
}
function parseLinearCoords(el) {
  return {
    x1: getValue(el, 'x1') || 0,
    y1: getValue(el, 'y1') || 0,
    x2: getValue(el, 'x2') || '100%',
    y2: getValue(el, 'y2') || 0
  };
}
function parseRadialCoords(el) {
  return {
    x1: getValue(el, 'fx') || getValue(el, 'cx') || '50%',
    y1: getValue(el, 'fy') || getValue(el, 'cy') || '50%',
    r1: 0,
    x2: getValue(el, 'cx') || '50%',
    y2: getValue(el, 'cy') || '50%',
    r2: getValue(el, 'r') || '50%'
  };
}
function parseCoords(el, size) {
  return convertPercentUnitsToValues(parseType(el) === 'linear' ? parseLinearCoords(el) : parseRadialCoords(el), {
    ...size,
    gradientUnits: parseGradientUnits(el)
  });
}

/**
 * Gradient class
 * @class Gradient
 * @see {@link http://fabric5.fabricjs.com/fabric-intro-part-2#gradients}
 */
class Gradient {
  constructor(options) {
    const {
      type = 'linear',
      gradientUnits = 'pixels',
      coords = {},
      colorStops = [],
      offsetX = 0,
      offsetY = 0,
      gradientTransform,
      id
    } = options || {};
    Object.assign(this, {
      type,
      gradientUnits,
      coords: {
        ...(type === 'radial' ? radialDefaultCoords : linearDefaultCoords),
        ...coords
      },
      colorStops,
      offsetX,
      offsetY,
      gradientTransform,
      id: id ? `${id}_${uid()}` : uid()
    });
  }

  /**
   * Adds another colorStop
   * @param {Record<string, string>} colorStop Object with offset and color
   * @return {Gradient} thisArg
   */
  addColorStop(colorStops) {
    for (const position in colorStops) {
      this.colorStops.push({
        offset: parseFloat(position),
        color: colorStops[position]
      });
    }
    return this;
  }

  /**
   * Returns object representation of a gradient
   * @param {string[]} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {object}
   */
  toObject(propertiesToInclude) {
    return {
      ...pick(this, propertiesToInclude),
      type: this.type,
      coords: {
        ...this.coords
      },
      colorStops: this.colorStops.map(colorStop => ({
        ...colorStop
      })),
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      gradientUnits: this.gradientUnits,
      gradientTransform: this.gradientTransform ? [...this.gradientTransform] : undefined
    };
  }

  /* _TO_SVG_START_ */
  /**
   * Returns SVG representation of an gradient
   * @param {FabricObject} object Object to create a gradient for
   * @return {String} SVG representation of an gradient (linear/radial)
   */
  toSVG(object) {
    let {
      additionalTransform: preTransform
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const markup = [],
      transform = this.gradientTransform ? this.gradientTransform.concat() : iMatrix.concat(),
      gradientUnits = this.gradientUnits === 'pixels' ? 'userSpaceOnUse' : 'objectBoundingBox';
    // colorStops must be sorted ascending, and guarded against deep mutations
    const colorStops = this.colorStops.map(colorStop => ({
      ...colorStop
    })).sort((a, b) => {
      return a.offset - b.offset;
    });
    let offsetX = -this.offsetX,
      offsetY = -this.offsetY;
    if (gradientUnits === 'objectBoundingBox') {
      offsetX /= object.width;
      offsetY /= object.height;
    } else {
      offsetX += object.width / 2;
      offsetY += object.height / 2;
    }
    // todo what about polygon/polyline?
    if (isPath(object) && this.gradientUnits !== 'percentage') {
      offsetX -= object.pathOffset.x;
      offsetY -= object.pathOffset.y;
    }
    transform[4] -= offsetX;
    transform[5] -= offsetY;
    const commonAttributes = [`id="SVGID_${this.id}"`, `gradientUnits="${gradientUnits}"`, `gradientTransform="${preTransform ? preTransform + ' ' : ''}${matrixToSVG(transform)}"`, ''].join(' ');
    if (this.type === 'linear') {
      const {
        x1,
        y1,
        x2,
        y2
      } = this.coords;
      markup.push('<linearGradient ', commonAttributes, ' x1="', x1, '" y1="', y1, '" x2="', x2, '" y2="', y2, '">\n');
    } else if (this.type === 'radial') {
      const {
        x1,
        y1,
        x2,
        y2,
        r1,
        r2
      } = this.coords;
      const needsSwap = r1 > r2;
      // svg radial gradient has just 1 radius. the biggest.
      markup.push('<radialGradient ', commonAttributes, ' cx="', needsSwap ? x1 : x2, '" cy="', needsSwap ? y1 : y2, '" r="', needsSwap ? r1 : r2, '" fx="', needsSwap ? x2 : x1, '" fy="', needsSwap ? y2 : y1, '">\n');
      if (needsSwap) {
        // svg goes from internal to external radius. if radius are inverted, swap color stops.
        colorStops.reverse(); //  mutates array
        colorStops.forEach(colorStop => {
          colorStop.offset = 1 - colorStop.offset;
        });
      }
      const minRadius = Math.min(r1, r2);
      if (minRadius > 0) {
        // i have to shift all colorStops and add new one in 0.
        const maxRadius = Math.max(r1, r2),
          percentageShift = minRadius / maxRadius;
        colorStops.forEach(colorStop => {
          colorStop.offset += percentageShift * (1 - colorStop.offset);
        });
      }
    }
    colorStops.forEach(_ref => {
      let {
        color,
        offset
      } = _ref;
      markup.push(`<stop offset="${offset * 100}%" style="stop-color:${color};"/>\n`);
    });
    markup.push(this.type === 'linear' ? '</linearGradient>' : '</radialGradient>', '\n');
    return markup.join('');
  }
  /* _TO_SVG_END_ */

  /**
   * Returns an instance of CanvasGradient
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @return {CanvasGradient}
   */
  toLive(ctx) {
    const {
      x1,
      y1,
      x2,
      y2,
      r1,
      r2
    } = this.coords;
    const gradient = this.type === 'linear' ? ctx.createLinearGradient(x1, y1, x2, y2) : ctx.createRadialGradient(x1, y1, r1, x2, y2, r2);
    this.colorStops.forEach(_ref2 => {
      let {
        color,
        offset
      } = _ref2;
      gradient.addColorStop(offset, color);
    });
    return gradient;
  }
  static async fromObject(options) {
    const {
      colorStops,
      gradientTransform
    } = options;
    return new this({
      ...options,
      colorStops: colorStops ? colorStops.map(colorStop => ({
        ...colorStop
      })) : undefined,
      gradientTransform: gradientTransform ? [...gradientTransform] : undefined
    });
  }

  /* _FROM_SVG_START_ */
  /**
   * Returns {@link Gradient} instance from an SVG element
   * @param {SVGGradientElement} el SVG gradient element
   * @param {FabricObject} instance
   * @param {String} opacity A fill-opacity or stroke-opacity attribute to multiply to each stop's opacity.
   * @param {SVGOptions} svgOptions an object containing the size of the SVG in order to parse correctly gradients
   * that uses gradientUnits as 'userSpaceOnUse' and percentages.
   * @return {Gradient} Gradient instance
   * @see http://www.w3.org/TR/SVG/pservers.html#LinearGradientElement
   * @see http://www.w3.org/TR/SVG/pservers.html#RadialGradientElement
   *
   *  @example
   *
   *  <linearGradient id="linearGrad1">
   *    <stop offset="0%" stop-color="white"/>
   *    <stop offset="100%" stop-color="black"/>
   *  </linearGradient>
   *
   *  OR
   *
   *  <linearGradient id="linearGrad2">
   *    <stop offset="0" style="stop-color:rgb(255,255,255)"/>
   *    <stop offset="1" style="stop-color:rgb(0,0,0)"/>
   *  </linearGradient>
   *
   *  OR
   *
   *  <radialGradient id="radialGrad1">
   *    <stop offset="0%" stop-color="white" stop-opacity="1" />
   *    <stop offset="50%" stop-color="black" stop-opacity="0.5" />
   *    <stop offset="100%" stop-color="white" stop-opacity="1" />
   *  </radialGradient>
   *
   *  OR
   *
   *  <radialGradient id="radialGrad2">
   *    <stop offset="0" stop-color="rgb(255,255,255)" />
   *    <stop offset="0.5" stop-color="rgb(0,0,0)" />
   *    <stop offset="1" stop-color="rgb(255,255,255)" />
   *  </radialGradient>
   *
   */
  static fromElement(el, instance, svgOptions) {
    const gradientUnits = parseGradientUnits(el);
    const center = instance._findCenterFromElement();
    return new this({
      id: el.getAttribute('id') || undefined,
      type: parseType(el),
      coords: parseCoords(el, {
        width: svgOptions.viewBoxWidth || svgOptions.width,
        height: svgOptions.viewBoxHeight || svgOptions.height
      }),
      colorStops: parseColorStops(el, svgOptions.opacity),
      gradientUnits,
      gradientTransform: parseTransformAttribute(el.getAttribute('gradientTransform') || ''),
      ...(gradientUnits === 'pixels' ? {
        offsetX: instance.width / 2 - center.x,
        offsetY: instance.height / 2 - center.y
      } : {
        offsetX: 0,
        offsetY: 0
      })
    });
  }
  /* _FROM_SVG_END_ */
}
/**
 * Horizontal offset for aligning gradients coming from SVG when outside pathgroups
 * @type Number
 * @default 0
 */
/**
 * Vertical offset for aligning gradients coming from SVG when outside pathgroups
 * @type Number
 * @default 0
 */
/**
 * A transform matrix to apply to the gradient before painting.
 * Imported from svg gradients, is not applied with the current transform in the center.
 * Before this transform is applied, the origin point is at the top left corner of the object
 * plus the addition of offsetY and offsetX.
 * @type Number[]
 * @default null
 */
/**
 * coordinates units for coords.
 * If `pixels`, the number of coords are in the same unit of width / height.
 * If set as `percentage` the coords are still a number, but 1 means 100% of width
 * for the X and 100% of the height for the y. It can be bigger than 1 and negative.
 * allowed values pixels or percentage.
 * @type GradientUnits
 * @default 'pixels'
 */
/**
 * Gradient type linear or radial
 * @type GradientType
 * @default 'linear'
 */
/**
 * Defines how the gradient is located in space and spread
 * @type GradientCoords
 */
/**
 * Defines how many colors a gradient has and how they are located on the axis
 * defined by coords
 * @type GradientCoords
 */
/**
 * If true, this object will not be exported during the serialization of a canvas
 * @type boolean
 */
/**
 * ID used for SVG export functionalities
 * @type number | string
 */
_defineProperty(Gradient, "type", 'Gradient');
classRegistry.setClass(Gradient, 'gradient');
classRegistry.setClass(Gradient, 'linear');
classRegistry.setClass(Gradient, 'radial');

/**
 * @see {@link http://fabric5.fabricjs.com/patterns demo}
 * @see {@link http://fabric5.fabricjs.com/dynamic-patterns demo}
 */
class Pattern {
  /**
   * Legacy identifier of the class. Prefer using this.constructor.type 'Pattern'
   * or utils like isPattern, or instance of to indentify a pattern in your code.
   * Will be removed in future versiones
   * @TODO add sustainable warning message
   * @type string
   * @deprecated
   */
  get type() {
    return 'pattern';
  }
  set type(value) {
    log('warn', 'Setting type has no effect', value);
  }

  /**
   * @type PatternRepeat
   * @defaults
   */

  /**
   * transform matrix to change the pattern, imported from svgs.
   * @todo verify if using the identity matrix as default makes the rest of the code more easy
   * @type Array
   */

  /**
   * The actual pixel source of the pattern
   */

  /**
   * If true, this object will not be exported during the serialization of a canvas
   * @type boolean
   */

  /**
   * ID used for SVG export functionalities
   * @type number
   */

  /**
   * Constructor
   * @param {Object} [options] Options object
   * @param {option.source} [source] the pattern source, eventually empty or a drawable
   */
  constructor(options) {
    _defineProperty(this, "repeat", 'repeat');
    /**
     * Pattern horizontal offset from object's left/top corner
     * @type Number
     */
    _defineProperty(this, "offsetX", 0);
    /**
     * Pattern vertical offset from object's left/top corner
     * @type Number
     */
    _defineProperty(this, "offsetY", 0);
    /**
     * @type TCrossOrigin
     */
    _defineProperty(this, "crossOrigin", '');
    this.id = uid();
    Object.assign(this, options);
  }

  /**
   * @returns true if {@link source} is an <img> element
   */
  isImageSource() {
    return !!this.source && typeof this.source.src === 'string';
  }

  /**
   * @returns true if {@link source} is a <canvas> element
   */
  isCanvasSource() {
    return !!this.source && !!this.source.toDataURL;
  }
  sourceToString() {
    return this.isImageSource() ? this.source.src : this.isCanvasSource() ? this.source.toDataURL() : '';
  }

  /**
   * Returns an instance of CanvasPattern
   * @param {CanvasRenderingContext2D} ctx Context to create pattern
   * @return {CanvasPattern}
   */
  toLive(ctx) {
    if (
    // if the image failed to load, return, and allow rest to continue loading
    !this.source ||
    // if an image
    this.isImageSource() && (!this.source.complete || this.source.naturalWidth === 0 || this.source.naturalHeight === 0)) {
      return null;
    }
    return ctx.createPattern(this.source, this.repeat);
  }

  /**
   * Returns object representation of a pattern
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {object} Object representation of a pattern instance
   */
  toObject() {
    let propertiesToInclude = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    const {
      repeat,
      crossOrigin
    } = this;
    return {
      ...pick(this, propertiesToInclude),
      type: 'pattern',
      source: this.sourceToString(),
      repeat,
      crossOrigin,
      offsetX: toFixed(this.offsetX, config.NUM_FRACTION_DIGITS),
      offsetY: toFixed(this.offsetY, config.NUM_FRACTION_DIGITS),
      patternTransform: this.patternTransform ? [...this.patternTransform] : null
    };
  }

  /* _TO_SVG_START_ */
  /**
   * Returns SVG representation of a pattern
   */
  toSVG(_ref) {
    let {
      width,
      height
    } = _ref;
    const {
        source: patternSource,
        repeat,
        id
      } = this,
      patternOffsetX = ifNaN(this.offsetX / width, 0),
      patternOffsetY = ifNaN(this.offsetY / height, 0),
      patternWidth = repeat === 'repeat-y' || repeat === 'no-repeat' ? 1 + Math.abs(patternOffsetX || 0) : ifNaN(patternSource.width / width, 0),
      patternHeight = repeat === 'repeat-x' || repeat === 'no-repeat' ? 1 + Math.abs(patternOffsetY || 0) : ifNaN(patternSource.height / height, 0);
    return [`<pattern id="SVGID_${id}" x="${patternOffsetX}" y="${patternOffsetY}" width="${patternWidth}" height="${patternHeight}">`, `<image x="0" y="0" width="${patternSource.width}" height="${patternSource.height}" xlink:href="${this.sourceToString()}"></image>`, `</pattern>`, ''].join('\n');
  }
  /* _TO_SVG_END_ */

  static async fromObject(_ref2, options) {
    let {
      type,
      source,
      patternTransform,
      ...otherOptions
    } = _ref2;
    const img = await loadImage(source, {
      ...options,
      crossOrigin: otherOptions.crossOrigin
    });
    return new this({
      ...otherOptions,
      patternTransform: patternTransform && patternTransform.slice(0),
      source: img
    });
  }
}
_defineProperty(Pattern, "type", 'Pattern');
classRegistry.setClass(Pattern);
// kept for compatibility reason
classRegistry.setClass(Pattern, 'pattern');

/**
 * @see {@link http://fabric5.fabricjs.com/freedrawing|Freedrawing demo}
 */
class BaseBrush {
  /**
   * @todo add type
   */

  constructor(canvas) {
    /**
     * Color of a brush
     * @type String
     */
    _defineProperty(this, "color", 'rgb(0, 0, 0)');
    /**
     * Width of a brush, has to be a Number, no string literals
     * @type Number
     */
    _defineProperty(this, "width", 1);
    /**
     * Shadow object representing shadow of this shape.
     * <b>Backwards incompatibility note:</b> This property replaces "shadowColor" (String), "shadowOffsetX" (Number),
     * "shadowOffsetY" (Number) and "shadowBlur" (Number) since v1.2.12
     * @type Shadow
     */
    _defineProperty(this, "shadow", null);
    /**
     * Line endings style of a brush (one of "butt", "round", "square")
     * @type String
     */
    _defineProperty(this, "strokeLineCap", 'round');
    /**
     * Corner style of a brush (one of "bevel", "round", "miter")
     * @type String
     */
    _defineProperty(this, "strokeLineJoin", 'round');
    /**
     * Maximum miter length (used for strokeLineJoin = "miter") of a brush's
     * @type Number
     */
    _defineProperty(this, "strokeMiterLimit", 10);
    /**
     * Stroke Dash Array.
     * @type Array
     */
    _defineProperty(this, "strokeDashArray", null);
    /**
     * When `true`, the free drawing is limited to the whiteboard size. Default to false.
     * @type Boolean
     * @default false
     */
    _defineProperty(this, "limitedToCanvasSize", false);
    this.canvas = canvas;
  }

  /**
   * @returns true if brush should continue blocking interaction
   */

  /**
   * Sets brush styles
   * @private
   * @param {CanvasRenderingContext2D} ctx
   */
  _setBrushStyles(ctx) {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.lineCap = this.strokeLineCap;
    ctx.miterLimit = this.strokeMiterLimit;
    ctx.lineJoin = this.strokeLineJoin;
    ctx.setLineDash(this.strokeDashArray || []);
  }

  /**
   * Sets the transformation on given context
   * @param {CanvasRenderingContext2D} ctx context to render on
   * @private
   */
  _saveAndTransform(ctx) {
    const v = this.canvas.viewportTransform;
    ctx.save();
    ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
  }
  needsFullRender() {
    const color = new Color(this.color);
    return color.getAlpha() < 1 || !!this.shadow;
  }

  /**
   * Sets brush shadow styles
   * @private
   */
  _setShadow() {
    if (!this.shadow || !this.canvas) {
      return;
    }
    const canvas = this.canvas,
      shadow = this.shadow,
      ctx = canvas.contextTop,
      zoom = canvas.getZoom() * canvas.getRetinaScaling();
    ctx.shadowColor = shadow.color;
    ctx.shadowBlur = shadow.blur * zoom;
    ctx.shadowOffsetX = shadow.offsetX * zoom;
    ctx.shadowOffsetY = shadow.offsetY * zoom;
  }

  /**
   * Removes brush shadow styles
   * @private
   */
  _resetShadow() {
    const ctx = this.canvas.contextTop;
    ctx.shadowColor = '';
    ctx.shadowBlur = ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
  }

  /**
   * Check is pointer is outside canvas boundaries
   * @param {Object} pointer
   * @private
   */
  _isOutSideCanvas(pointer) {
    return pointer.x < 0 || pointer.x > this.canvas.getWidth() || pointer.y < 0 || pointer.y > this.canvas.getHeight();
  }
}

class Path extends FabricObject {
  /**
   * Constructor
   * @param {TComplexPathData} path Path data (sequence of coordinates and corresponding "command" tokens)
   * @param {Partial<PathProps>} [options] Options object
   * @return {Path} thisArg
   */
  constructor(path) {
    let {
      path: _,
      left,
      top,
      ...options
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super();
    Object.assign(this, Path.ownDefaults);
    this.setOptions(options);
    this._setPath(path || [], true);
    typeof left === 'number' && this.set(LEFT, left);
    typeof top === 'number' && this.set(TOP, top);
  }

  /**
   * @private
   * @param {TComplexPathData | string} path Path data (sequence of coordinates and corresponding "command" tokens)
   * @param {boolean} [adjustPosition] pass true to reposition the object according to the bounding box
   * @returns {Point} top left position of the bounding box, useful for complementary positioning
   */
  _setPath(path, adjustPosition) {
    this.path = makePathSimpler(Array.isArray(path) ? path : parsePath(path));
    this.setBoundingBox(adjustPosition);
  }

  /**
   * This function is an helper for svg import. it returns the center of the object in the svg
   * untransformed coordinates, by look at the polyline/polygon points.
   * @private
   * @return {Point} center point from element coordinates
   */
  _findCenterFromElement() {
    const bbox = this._calcBoundsFromPath();
    return new Point(bbox.left + bbox.width / 2, bbox.top + bbox.height / 2);
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx context to render path on
   */
  _renderPathCommands(ctx) {
    const l = -this.pathOffset.x,
      t = -this.pathOffset.y;
    ctx.beginPath();
    for (const command of this.path) {
      switch (command[0] // first letter
      ) {
        case 'L':
          // lineto, absolute
          ctx.lineTo(command[1] + l, command[2] + t);
          break;
        case 'M':
          // moveTo, absolute
          ctx.moveTo(command[1] + l, command[2] + t);
          break;
        case 'C':
          // bezierCurveTo, absolute
          ctx.bezierCurveTo(command[1] + l, command[2] + t, command[3] + l, command[4] + t, command[5] + l, command[6] + t);
          break;
        case 'Q':
          // quadraticCurveTo, absolute
          ctx.quadraticCurveTo(command[1] + l, command[2] + t, command[3] + l, command[4] + t);
          break;
        case 'Z':
          ctx.closePath();
          break;
      }
    }
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx context to render path on
   */
  _render(ctx) {
    this._renderPathCommands(ctx);
    this._renderPaintInOrder(ctx);
  }

  /**
   * Returns string representation of an instance
   * @return {string} string representation of an instance
   */
  toString() {
    return `#<Path (${this.complexity()}): { "top": ${this.top}, "left": ${this.left} }>`;
  }

  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject() {
    let propertiesToInclude = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return {
      ...super.toObject(propertiesToInclude),
      path: this.path.map(pathCmd => pathCmd.slice())
    };
  }

  /**
   * Returns dataless object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toDatalessObject() {
    let propertiesToInclude = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    const o = this.toObject(propertiesToInclude);
    if (this.sourcePath) {
      delete o.path;
      o.sourcePath = this.sourcePath;
    }
    return o;
  }

  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    const path = joinPath(this.path, config.NUM_FRACTION_DIGITS);
    return ['<path ', 'COMMON_PARTS', `d="${path}" stroke-linecap="round" />\n`];
  }

  /**
   * @private
   * @return the path command's translate transform attribute
   */
  _getOffsetTransform() {
    const digits = config.NUM_FRACTION_DIGITS;
    return ` translate(${toFixed(-this.pathOffset.x, digits)}, ${toFixed(-this.pathOffset.y, digits)})`;
  }

  /**
   * Returns svg clipPath representation of an instance
   * @param {Function} [reviver] Method for further parsing of svg representation.
   * @return {string} svg representation of an instance
   */
  toClipPathSVG(reviver) {
    const additionalTransform = this._getOffsetTransform();
    return '\t' + this._createBaseClipPathSVGMarkup(this._toSVG(), {
      reviver,
      additionalTransform: additionalTransform
    });
  }

  /**
   * Returns svg representation of an instance
   * @param {Function} [reviver] Method for further parsing of svg representation.
   * @return {string} svg representation of an instance
   */
  toSVG(reviver) {
    const additionalTransform = this._getOffsetTransform();
    return this._createBaseSVGMarkup(this._toSVG(), {
      reviver,
      additionalTransform: additionalTransform
    });
  }

  /**
   * Returns number representation of an instance complexity
   * @return {number} complexity of this instance
   */
  complexity() {
    return this.path.length;
  }
  setDimensions() {
    this.setBoundingBox();
  }
  setBoundingBox(adjustPosition) {
    const {
      width,
      height,
      pathOffset
    } = this._calcDimensions();
    this.set({
      width,
      height,
      pathOffset
    });
    // using pathOffset because it match the use case.
    // if pathOffset change here we need to use left + width/2 , top + height/2
    adjustPosition && this.setPositionByOrigin(pathOffset, CENTER, CENTER);
  }
  _calcBoundsFromPath() {
    const bounds = [];
    let subpathStartX = 0,
      subpathStartY = 0,
      x = 0,
      // current x
      y = 0; // current y

    for (const command of this.path) {
      // current instruction
      switch (command[0] // first letter
      ) {
        case 'L':
          // lineto, absolute
          x = command[1];
          y = command[2];
          bounds.push({
            x: subpathStartX,
            y: subpathStartY
          }, {
            x,
            y
          });
          break;
        case 'M':
          // moveTo, absolute
          x = command[1];
          y = command[2];
          subpathStartX = x;
          subpathStartY = y;
          break;
        case 'C':
          // bezierCurveTo, absolute
          bounds.push(...getBoundsOfCurve(x, y, command[1], command[2], command[3], command[4], command[5], command[6]));
          x = command[5];
          y = command[6];
          break;
        case 'Q':
          // quadraticCurveTo, absolute
          bounds.push(...getBoundsOfCurve(x, y, command[1], command[2], command[1], command[2], command[3], command[4]));
          x = command[3];
          y = command[4];
          break;
        case 'Z':
          x = subpathStartX;
          y = subpathStartY;
          break;
      }
    }
    return makeBoundingBoxFromPoints(bounds);
  }

  /**
   * @private
   */
  _calcDimensions() {
    const bbox = this._calcBoundsFromPath();
    return {
      ...bbox,
      pathOffset: new Point(bbox.left + bbox.width / 2, bbox.top + bbox.height / 2)
    };
  }

  /**
   * List of attribute names to account for when parsing SVG element (used by `Path.fromElement`)
   * @see http://www.w3.org/TR/SVG/paths.html#PathElement
   */

  /**
   * Creates an instance of Path from an object
   * @param {Object} object
   * @returns {Promise<Path>}
   */
  static fromObject(object) {
    return this._fromObject(object, {
      extraParam: 'path'
    });
  }

  /**
   * Creates an instance of Path from an SVG <path> element
   * @param {HTMLElement} element to parse
   * @param {Partial<PathProps>} [options] Options object
   */
  static async fromElement(element, options, cssRules) {
    const {
      d,
      ...parsedAttributes
    } = parseAttributes(element, this.ATTRIBUTE_NAMES, cssRules);
    return new this(d, {
      ...parsedAttributes,
      ...options,
      // we pass undefined to instruct the constructor to position the object using the bbox
      left: undefined,
      top: undefined
    });
  }
}
/**
 * Array of path points
 * @type Array
 */
_defineProperty(Path, "type", 'Path');
_defineProperty(Path, "cacheProperties", [...cacheProperties, 'path', 'fillRule']);
_defineProperty(Path, "ATTRIBUTE_NAMES", [...SHARED_ATTRIBUTES, 'd']);
classRegistry.setClass(Path);
classRegistry.setSVGClass(Path);

/* _FROM_SVG_START_ */

/**
 * @private
 * @param {TSimplePathData} pathData SVG path commands
 * @returns {boolean}
 */
function isEmptySVGPath(pathData) {
  return joinPath(pathData) === 'M 0 0 Q 0 0 0 0 L 0 0';
}
class PencilBrush extends BaseBrush {
  constructor(canvas) {
    super(canvas);
    /**
     * Discard points that are less than `decimate` pixel distant from each other
     * @type Number
     * @default 0.4
     */
    _defineProperty(this, "decimate", 0.4);
    /**
     * Draws a straight line between last recorded point to current pointer
     * Used for `shift` functionality
     *
     * @type boolean
     * @default false
     */
    _defineProperty(this, "drawStraightLine", false);
    /**
     * The event modifier key that makes the brush draw a straight line.
     * If `null` or 'none' or any other string that is not a modifier key the feature is disabled.
     * @type {ModifierKey | undefined | null}
     */
    _defineProperty(this, "straightLineKey", 'shiftKey');
    this._points = [];
    this._hasStraightLine = false;
  }
  needsFullRender() {
    return super.needsFullRender() || this._hasStraightLine;
  }
  static drawSegment(ctx, p1, p2) {
    const midPoint = p1.midPointFrom(p2);
    ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
    return midPoint;
  }

  /**
   * Invoked on mouse down
   * @param {Point} pointer
   */
  onMouseDown(pointer, _ref) {
    let {
      e
    } = _ref;
    if (!this.canvas._isMainEvent(e)) {
      return;
    }
    this.drawStraightLine = !!this.straightLineKey && e[this.straightLineKey];
    this._prepareForDrawing(pointer);
    // capture coordinates immediately
    // this allows to draw dots (when movement never occurs)
    this._addPoint(pointer);
    this._render();
  }

  /**
   * Invoked on mouse move
   * @param {Point} pointer
   */
  onMouseMove(pointer, _ref2) {
    let {
      e
    } = _ref2;
    if (!this.canvas._isMainEvent(e)) {
      return;
    }
    this.drawStraightLine = !!this.straightLineKey && e[this.straightLineKey];
    if (this.limitedToCanvasSize === true && this._isOutSideCanvas(pointer)) {
      return;
    }
    if (this._addPoint(pointer) && this._points.length > 1) {
      if (this.needsFullRender()) {
        // redraw curve
        // clear top canvas
        this.canvas.clearContext(this.canvas.contextTop);
        this._render();
      } else {
        const points = this._points,
          length = points.length,
          ctx = this.canvas.contextTop;
        // draw the curve update
        this._saveAndTransform(ctx);
        if (this.oldEnd) {
          ctx.beginPath();
          ctx.moveTo(this.oldEnd.x, this.oldEnd.y);
        }
        this.oldEnd = PencilBrush.drawSegment(ctx, points[length - 2], points[length - 1]);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  /**
   * Invoked on mouse up
   */
  onMouseUp(_ref3) {
    let {
      e
    } = _ref3;
    if (!this.canvas._isMainEvent(e)) {
      return true;
    }
    this.drawStraightLine = false;
    this.oldEnd = undefined;
    this._finalizeAndAddPath();
    return false;
  }

  /**
   * @private
   * @param {Point} pointer Actual mouse position related to the canvas.
   */
  _prepareForDrawing(pointer) {
    this._reset();
    this._addPoint(pointer);
    this.canvas.contextTop.moveTo(pointer.x, pointer.y);
  }

  /**
   * @private
   * @param {Point} point Point to be added to points array
   */
  _addPoint(point) {
    if (this._points.length > 1 && point.eq(this._points[this._points.length - 1])) {
      return false;
    }
    if (this.drawStraightLine && this._points.length > 1) {
      this._hasStraightLine = true;
      this._points.pop();
    }
    this._points.push(point);
    return true;
  }

  /**
   * Clear points array and set contextTop canvas style.
   * @private
   */
  _reset() {
    this._points = [];
    this._setBrushStyles(this.canvas.contextTop);
    this._setShadow();
    this._hasStraightLine = false;
  }

  /**
   * Draw a smooth path on the topCanvas using quadraticCurveTo
   * @private
   * @param {CanvasRenderingContext2D} [ctx]
   */
  _render() {
    let ctx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.canvas.contextTop;
    let p1 = this._points[0],
      p2 = this._points[1];
    this._saveAndTransform(ctx);
    ctx.beginPath();
    //if we only have 2 points in the path and they are the same
    //it means that the user only clicked the canvas without moving the mouse
    //then we should be drawing a dot. A path isn't drawn between two identical dots
    //that's why we set them apart a bit
    if (this._points.length === 2 && p1.x === p2.x && p1.y === p2.y) {
      const width = this.width / 1000;
      p1.x -= width;
      p2.x += width;
    }
    ctx.moveTo(p1.x, p1.y);
    for (let i = 1; i < this._points.length; i++) {
      // we pick the point between pi + 1 & pi + 2 as the
      // end point and p1 as our control point.
      PencilBrush.drawSegment(ctx, p1, p2);
      p1 = this._points[i];
      p2 = this._points[i + 1];
    }
    // Draw last line as a straight line while
    // we wait for the next point to be able to calculate
    // the bezier control point
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Converts points to SVG path
   * @param {Point[]} points Array of points
   * @return {TSimplePathData} SVG path commands
   */
  convertPointsToSVGPath(points) {
    const correction = this.width / 1000;
    return getSmoothPathFromPoints(points, correction);
  }

  /**
   * Creates a Path object to add on canvas
   * @param {TSimplePathData} pathData Path data
   * @return {Path} Path to add on canvas
   */
  createPath(pathData) {
    const path = new Path(pathData, {
      fill: null,
      stroke: this.color,
      strokeWidth: this.width,
      strokeLineCap: this.strokeLineCap,
      strokeMiterLimit: this.strokeMiterLimit,
      strokeLineJoin: this.strokeLineJoin,
      strokeDashArray: this.strokeDashArray
    });
    if (this.shadow) {
      this.shadow.affectStroke = true;
      path.shadow = new Shadow(this.shadow);
    }
    return path;
  }

  /**
   * Decimate points array with the decimate value
   */
  decimatePoints(points, distance) {
    if (points.length <= 2) {
      return points;
    }
    let lastPoint = points[0],
      cDistance;
    const zoom = this.canvas.getZoom(),
      adjustedDistance = Math.pow(distance / zoom, 2),
      l = points.length - 1,
      newPoints = [lastPoint];
    // TODO investigate why this is not i < l
    for (let i = 1; i < l - 1; i++) {
      cDistance = Math.pow(lastPoint.x - points[i].x, 2) + Math.pow(lastPoint.y - points[i].y, 2);
      if (cDistance >= adjustedDistance) {
        lastPoint = points[i];
        newPoints.push(lastPoint);
      }
    }
    // Add the last point from the original line to the end of the array.
    // This ensures decimate doesn't delete the last point on the line, and ensures the line is > 1 point.
    newPoints.push(points[l]);
    return newPoints;
  }

  /**
   * On mouseup after drawing the path on contextTop canvas
   * we use the points captured to create an new Path object
   * and add it to the canvas.
   */
  _finalizeAndAddPath() {
    const ctx = this.canvas.contextTop;
    ctx.closePath();
    if (this.decimate) {
      this._points = this.decimatePoints(this._points, this.decimate);
    }
    const pathData = this.convertPointsToSVGPath(this._points);
    if (isEmptySVGPath(pathData)) {
      // do not create 0 width/height paths, as they are
      // rendered inconsistently across browsers
      // Firefox 4, for example, renders a dot,
      // whereas Chrome 10 renders nothing
      this.canvas.requestRenderAll();
      return;
    }
    const path = this.createPath(pathData);
    this.canvas.clearContext(this.canvas.contextTop);
    this.canvas.fire('before:path:created', {
      path: path
    });
    this.canvas.add(path);
    this.canvas.requestRenderAll();
    path.setCoords();
    this._resetShadow();

    // fire event 'path' created
    this.canvas.fire('path:created', {
      path: path
    });
  }
}

const CIRCLE_PROPS = ['radius', 'startAngle', 'endAngle', 'counterClockwise'];
const circleDefaultValues = {
  radius: 0,
  startAngle: 0,
  endAngle: 360,
  counterClockwise: false
};
class Circle extends FabricObject {
  static getDefaults() {
    return {
      ...super.getDefaults(),
      ...Circle.ownDefaults
    };
  }

  /**
   * Constructor
   * @param {Object} [options] Options object
   */
  constructor(options) {
    super();
    Object.assign(this, Circle.ownDefaults);
    this.setOptions(options);
  }

  /**
   * @private
   * @param {String} key
   * @param {*} value
   */
  _set(key, value) {
    super._set(key, value);
    if (key === 'radius') {
      this.setRadius(value);
    }
    return this;
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx context to render on
   */
  _render(ctx) {
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, degreesToRadians(this.startAngle), degreesToRadians(this.endAngle), this.counterClockwise);
    this._renderPaintInOrder(ctx);
  }

  /**
   * Returns horizontal radius of an object (according to how an object is scaled)
   * @return {Number}
   */
  getRadiusX() {
    return this.get('radius') * this.get(SCALE_X);
  }

  /**
   * Returns vertical radius of an object (according to how an object is scaled)
   * @return {Number}
   */
  getRadiusY() {
    return this.get('radius') * this.get(SCALE_Y);
  }

  /**
   * Sets radius of an object (and updates width accordingly)
   */
  setRadius(value) {
    this.radius = value;
    this.set({
      width: value * 2,
      height: value * 2
    });
  }

  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject() {
    let propertiesToInclude = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return super.toObject([...CIRCLE_PROPS, ...propertiesToInclude]);
  }

  /* _TO_SVG_START_ */

  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    const angle = (this.endAngle - this.startAngle) % 360;
    if (angle === 0) {
      return ['<circle ', 'COMMON_PARTS', 'cx="0" cy="0" ', 'r="', `${this.radius}`, '" />\n'];
    } else {
      const {
        radius
      } = this;
      const start = degreesToRadians(this.startAngle),
        end = degreesToRadians(this.endAngle),
        startX = cos(start) * radius,
        startY = sin(start) * radius,
        endX = cos(end) * radius,
        endY = sin(end) * radius,
        largeFlag = angle > 180 ? 1 : 0,
        sweepFlag = this.counterClockwise ? 0 : 1;
      return [`<path d="M ${startX} ${startY} A ${radius} ${radius} 0 ${largeFlag} ${sweepFlag} ${endX} ${endY}" `, 'COMMON_PARTS', ' />\n'];
    }
  }
  /* _TO_SVG_END_ */

  /* _FROM_SVG_START_ */
  /**
   * List of attribute names to account for when parsing SVG element (used by {@link Circle.fromElement})
   * @see: http://www.w3.org/TR/SVG/shapes.html#CircleElement
   */

  /**
   * Returns {@link Circle} instance from an SVG element
   * @param {HTMLElement} element Element to parse
   * @param {Object} [options] Partial Circle object to default missing properties on the element.
   * @throws {Error} If value of `r` attribute is missing or invalid
   */
  static async fromElement(element, options, cssRules) {
    const {
      left = 0,
      top = 0,
      radius = 0,
      ...otherParsedAttributes
    } = parseAttributes(element, this.ATTRIBUTE_NAMES, cssRules);

    // this probably requires to be fixed for default origins not being top/left.

    return new this({
      ...otherParsedAttributes,
      radius,
      left: left - radius,
      top: top - radius
    });
  }

  /* _FROM_SVG_END_ */

  /**
   * @todo how do we declare this??
   */
  static fromObject(object) {
    return super._fromObject(object);
  }
}
_defineProperty(Circle, "type", 'Circle');
_defineProperty(Circle, "cacheProperties", [...cacheProperties, ...CIRCLE_PROPS]);
_defineProperty(Circle, "ownDefaults", circleDefaultValues);
_defineProperty(Circle, "ATTRIBUTE_NAMES", ['cx', 'cy', 'r', ...SHARED_ATTRIBUTES]);
classRegistry.setClass(Circle);
classRegistry.setSVGClass(Circle);

class CircleBrush extends BaseBrush {
  constructor(canvas) {
    super(canvas);
    /**
     * Width of a brush
     * @type Number
     */
    _defineProperty(this, "width", 10);
    this.points = [];
  }

  /**
   * Invoked inside on mouse down and mouse move
   * @param {Point} pointer
   */
  drawDot(pointer) {
    const point = this.addPoint(pointer),
      ctx = this.canvas.contextTop;
    this._saveAndTransform(ctx);
    this.dot(ctx, point);
    ctx.restore();
  }
  dot(ctx, point) {
    ctx.fillStyle = point.fill;
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  }

  /**
   * Invoked on mouse down
   */
  onMouseDown(pointer) {
    this.points = [];
    this.canvas.clearContext(this.canvas.contextTop);
    this._setShadow();
    this.drawDot(pointer);
  }

  /**
   * Render the full state of the brush
   * @private
   */
  _render() {
    const ctx = this.canvas.contextTop,
      points = this.points;
    this._saveAndTransform(ctx);
    for (let i = 0; i < points.length; i++) {
      this.dot(ctx, points[i]);
    }
    ctx.restore();
  }

  /**
   * Invoked on mouse move
   * @param {Point} pointer
   */
  onMouseMove(pointer) {
    if (this.limitedToCanvasSize === true && this._isOutSideCanvas(pointer)) {
      return;
    }
    if (this.needsFullRender()) {
      this.canvas.clearContext(this.canvas.contextTop);
      this.addPoint(pointer);
      this._render();
    } else {
      this.drawDot(pointer);
    }
  }

  /**
   * Invoked on mouse up
   */
  onMouseUp() {
    const originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
    this.canvas.renderOnAddRemove = false;
    const circles = [];
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i],
        circle = new Circle({
          radius: point.radius,
          left: point.x,
          top: point.y,
          originX: CENTER,
          originY: CENTER,
          fill: point.fill
        });
      this.shadow && (circle.shadow = new Shadow(this.shadow));
      circles.push(circle);
    }
    const group = new Group(circles, {
      canvas: this.canvas
    });
    this.canvas.fire('before:path:created', {
      path: group
    });
    this.canvas.add(group);
    this.canvas.fire('path:created', {
      path: group
    });
    this.canvas.clearContext(this.canvas.contextTop);
    this._resetShadow();
    this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
    this.canvas.requestRenderAll();
  }

  /**
   * @param {Object} pointer
   * @return {Point} Just added pointer point
   */
  addPoint(_ref) {
    let {
      x,
      y
    } = _ref;
    const pointerPoint = {
      x,
      y,
      radius: getRandomInt(Math.max(0, this.width - 20), this.width + 20) / 2,
      fill: new Color(this.color).setAlpha(getRandomInt(0, 100) / 100).toRgba()
    };
    this.points.push(pointerPoint);
    return pointerPoint;
  }
}

/**
 *
 * @param rects
 * @returns
 */
function getUniqueRects(rects) {
  const uniqueRects = {};
  const uniqueRectsArray = [];
  for (let i = 0, key; i < rects.length; i++) {
    key = `${rects[i].left}${rects[i].top}`;
    if (!uniqueRects[key]) {
      uniqueRects[key] = true;
      uniqueRectsArray.push(rects[i]);
    }
  }
  return uniqueRectsArray;
}
class SprayBrush extends BaseBrush {
  /**
   * Constructor
   * @param {Canvas} canvas
   * @return {SprayBrush} Instance of a spray brush
   */
  constructor(canvas) {
    super(canvas);
    /**
     * Width of a spray
     * @type Number
     */
    _defineProperty(this, "width", 10);
    /**
     * Density of a spray (number of dots per chunk)
     * @type Number
     */
    _defineProperty(this, "density", 20);
    /**
     * Width of spray dots
     * @type Number
     */
    _defineProperty(this, "dotWidth", 1);
    /**
     * Width variance of spray dots
     * @type Number
     */
    _defineProperty(this, "dotWidthVariance", 1);
    /**
     * Whether opacity of a dot should be random
     * @type Boolean
     */
    _defineProperty(this, "randomOpacity", false);
    /**
     * Whether overlapping dots (rectangles) should be removed (for performance reasons)
     * @type Boolean
     */
    _defineProperty(this, "optimizeOverlapping", true);
    this.sprayChunks = [];
    this.sprayChunk = [];
  }

  /**
   * Invoked on mouse down
   * @param {Point} pointer
   */
  onMouseDown(pointer) {
    this.sprayChunks = [];
    this.canvas.clearContext(this.canvas.contextTop);
    this._setShadow();
    this.addSprayChunk(pointer);
    this.renderChunck(this.sprayChunk);
  }

  /**
   * Invoked on mouse move
   * @param {Point} pointer
   */
  onMouseMove(pointer) {
    if (this.limitedToCanvasSize === true && this._isOutSideCanvas(pointer)) {
      return;
    }
    this.addSprayChunk(pointer);
    this.renderChunck(this.sprayChunk);
  }

  /**
   * Invoked on mouse up
   */
  onMouseUp() {
    const originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
    this.canvas.renderOnAddRemove = false;
    const rects = [];
    for (let i = 0; i < this.sprayChunks.length; i++) {
      const sprayChunk = this.sprayChunks[i];
      for (let j = 0; j < sprayChunk.length; j++) {
        const chunck = sprayChunk[j];
        const rect = new Rect({
          width: chunck.width,
          height: chunck.width,
          left: chunck.x + 1,
          top: chunck.y + 1,
          originX: CENTER,
          originY: CENTER,
          fill: this.color
        });
        rects.push(rect);
      }
    }
    const group = new Group(this.optimizeOverlapping ? getUniqueRects(rects) : rects, {
      objectCaching: true,
      subTargetCheck: false,
      interactive: false
    });
    this.shadow && group.set('shadow', new Shadow(this.shadow));
    this.canvas.fire('before:path:created', {
      path: group
    });
    this.canvas.add(group);
    this.canvas.fire('path:created', {
      path: group
    });
    this.canvas.clearContext(this.canvas.contextTop);
    this._resetShadow();
    this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
    this.canvas.requestRenderAll();
  }
  renderChunck(sprayChunck) {
    const ctx = this.canvas.contextTop;
    ctx.fillStyle = this.color;
    this._saveAndTransform(ctx);
    for (let i = 0; i < sprayChunck.length; i++) {
      const point = sprayChunck[i];
      ctx.globalAlpha = point.opacity;
      ctx.fillRect(point.x, point.y, point.width, point.width);
    }
    ctx.restore();
  }

  /**
   * Render all spray chunks
   */
  _render() {
    const ctx = this.canvas.contextTop;
    ctx.fillStyle = this.color;
    this._saveAndTransform(ctx);
    for (let i = 0; i < this.sprayChunks.length; i++) {
      this.renderChunck(this.sprayChunks[i]);
    }
    ctx.restore();
  }

  /**
   * @param {Point} pointer
   */
  addSprayChunk(pointer) {
    this.sprayChunk = [];
    const radius = this.width / 2;
    for (let i = 0; i < this.density; i++) {
      this.sprayChunk.push({
        x: getRandomInt(pointer.x - radius, pointer.x + radius),
        y: getRandomInt(pointer.y - radius, pointer.y + radius),
        width: this.dotWidthVariance ? getRandomInt(
        // bottom clamp width to 1
        Math.max(1, this.dotWidth - this.dotWidthVariance), this.dotWidth + this.dotWidthVariance) : this.dotWidth,
        opacity: this.randomOpacity ? getRandomInt(0, 100) / 100 : 1
      });
    }
    this.sprayChunks.push(this.sprayChunk);
  }
}

class PatternBrush extends PencilBrush {
  constructor(canvas) {
    super(canvas);
  }
  getPatternSrc() {
    const dotWidth = 20,
      dotDistance = 5,
      patternCanvas = createCanvasElement(),
      patternCtx = patternCanvas.getContext('2d');
    patternCanvas.width = patternCanvas.height = dotWidth + dotDistance;
    if (patternCtx) {
      patternCtx.fillStyle = this.color;
      patternCtx.beginPath();
      patternCtx.arc(dotWidth / 2, dotWidth / 2, dotWidth / 2, 0, Math.PI * 2, false);
      patternCtx.closePath();
      patternCtx.fill();
    }
    return patternCanvas;
  }

  /**
   * Creates "pattern" instance property
   * @param {CanvasRenderingContext2D} ctx
   */
  getPattern(ctx) {
    return ctx.createPattern(this.source || this.getPatternSrc(), 'repeat');
  }

  /**
   * Sets brush styles
   * @param {CanvasRenderingContext2D} ctx
   */
  _setBrushStyles(ctx) {
    super._setBrushStyles(ctx);
    const pattern = this.getPattern(ctx);
    pattern && (ctx.strokeStyle = pattern);
  }

  /**
   * Creates path
   */
  createPath(pathData) {
    const path = super.createPath(pathData),
      topLeft = path._getLeftTopCoords().scalarAdd(path.strokeWidth / 2);
    path.stroke = new Pattern({
      source: this.source || this.getPatternSrc(),
      offsetX: -topLeft.x,
      offsetY: -topLeft.y
    });
    return path;
  }
}

// @TODO this code is terrible and Line should be a special case of polyline.

const coordProps = ['x1', 'x2', 'y1', 'y2'];
/**
 * A Class to draw a line
 * A bunch of methods will be added to Polyline to handle the line case
 * The line class is very strange to work with, is all special, it hardly aligns
 * to what a developer want everytime there is an angle
 * @deprecated
 */
class Line extends FabricObject {
  /**
   * Constructor
   * @param {Array} [points] Array of points
   * @param {Object} [options] Options object
   * @return {Line} thisArg
   */
  constructor() {
    let [x1, y1, x2, y2] = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [0, 0, 0, 0];
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super();
    Object.assign(this, Line.ownDefaults);
    this.setOptions(options);
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this._setWidthHeight();
    const {
      left,
      top
    } = options;
    typeof left === 'number' && this.set(LEFT, left);
    typeof top === 'number' && this.set(TOP, top);
  }

  /**
   * @private
   * @param {Object} [options] Options
   */
  _setWidthHeight() {
    const {
      x1,
      y1,
      x2,
      y2
    } = this;
    this.width = Math.abs(x2 - x1);
    this.height = Math.abs(y2 - y1);
    const {
      left,
      top,
      width,
      height
    } = makeBoundingBoxFromPoints([{
      x: x1,
      y: y1
    }, {
      x: x2,
      y: y2
    }]);
    const position = new Point(left + width / 2, top + height / 2);
    this.setPositionByOrigin(position, CENTER, CENTER);
  }

  /**
   * @private
   * @param {String} key
   * @param {*} value
   */
  _set(key, value) {
    super._set(key, value);
    if (coordProps.includes(key)) {
      // this doesn't make sense very much, since setting x1 when top or left
      // are already set, is just going to show a strange result since the
      // line will move way more than the developer expect.
      // in fabric5 it worked only when the line didn't have extra transformations,
      // in fabric6 too. With extra transform they behave bad in different ways.
      // This needs probably a good rework or a tutorial if you have to create a dynamic line
      this._setWidthHeight();
    }
    return this;
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render(ctx) {
    ctx.beginPath();
    const p = this.calcLinePoints();
    ctx.moveTo(p.x1, p.y1);
    ctx.lineTo(p.x2, p.y2);
    ctx.lineWidth = this.strokeWidth;

    // TODO: test this
    // make sure setting "fill" changes color of a line
    // (by copying fillStyle to strokeStyle, since line is stroked, not filled)
    const origStrokeStyle = ctx.strokeStyle;
    if (isFiller(this.stroke)) {
      ctx.strokeStyle = this.stroke.toLive(ctx);
    } else {
      var _this$stroke;
      ctx.strokeStyle = (_this$stroke = this.stroke) !== null && _this$stroke !== void 0 ? _this$stroke : ctx.fillStyle;
    }
    this.stroke && this._renderStroke(ctx);
    ctx.strokeStyle = origStrokeStyle;
  }

  /**
   * This function is an helper for svg import. it returns the center of the object in the svg
   * untransformed coordinates
   * @private
   * @return {Point} center point from element coordinates
   */
  _findCenterFromElement() {
    return new Point((this.x1 + this.x2) / 2, (this.y1 + this.y2) / 2);
  }

  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject() {
    let propertiesToInclude = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return {
      ...super.toObject(propertiesToInclude),
      ...this.calcLinePoints()
    };
  }

  /*
   * Calculate object dimensions from its properties
   * @private
   */
  _getNonTransformedDimensions() {
    const dim = super._getNonTransformedDimensions();
    if (this.strokeLineCap === 'butt') {
      if (this.width === 0) {
        dim.y -= this.strokeWidth;
      }
      if (this.height === 0) {
        dim.x -= this.strokeWidth;
      }
    }
    return dim;
  }

  /**
   * Recalculates line points given width and height
   * Those points are simply placed around the center,
   * This is not useful outside internal render functions and svg output
   * Is not meant to be for the developer.
   * @private
   */
  calcLinePoints() {
    const {
      x1: _x1,
      x2: _x2,
      y1: _y1,
      y2: _y2,
      width,
      height
    } = this;
    const xMult = _x1 <= _x2 ? -1 : 1,
      yMult = _y1 <= _y2 ? -1 : 1,
      x1 = xMult * width / 2,
      y1 = yMult * height / 2,
      x2 = xMult * -width / 2,
      y2 = yMult * -height / 2;
    return {
      x1,
      x2,
      y1,
      y2
    };
  }

  /* _FROM_SVG_START_ */

  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    const {
      x1,
      x2,
      y1,
      y2
    } = this.calcLinePoints();
    return ['<line ', 'COMMON_PARTS', `x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />\n`];
  }

  /**
   * List of attribute names to account for when parsing SVG element (used by {@link Line.fromElement})
   * @see http://www.w3.org/TR/SVG/shapes.html#LineElement
   */

  /**
   * Returns Line instance from an SVG element
   * @param {HTMLElement} element Element to parse
   * @param {Object} [options] Options object
   * @param {Function} [callback] callback function invoked after parsing
   */
  static async fromElement(element, options, cssRules) {
    const {
      x1 = 0,
      y1 = 0,
      x2 = 0,
      y2 = 0,
      ...parsedAttributes
    } = parseAttributes(element, this.ATTRIBUTE_NAMES, cssRules);
    return new this([x1, y1, x2, y2], parsedAttributes);
  }

  /* _FROM_SVG_END_ */

  /**
   * Returns Line instance from an object representation
   * @param {Object} object Object to create an instance from
   * @returns {Promise<Line>}
   */
  static fromObject(_ref) {
    let {
      x1,
      y1,
      x2,
      y2,
      ...object
    } = _ref;
    return this._fromObject({
      ...object,
      points: [x1, y1, x2, y2]
    }, {
      extraParam: 'points'
    });
  }
}
/**
 * x value or first line edge
 * @type number
 */
/**
 * y value or first line edge
 * @type number
 */
/**
 * x value or second line edge
 * @type number
 */
/**
 * y value or second line edge
 * @type number
 */
_defineProperty(Line, "type", 'Line');
_defineProperty(Line, "cacheProperties", [...cacheProperties, ...coordProps]);
_defineProperty(Line, "ATTRIBUTE_NAMES", SHARED_ATTRIBUTES.concat(coordProps));
classRegistry.setClass(Line);
classRegistry.setSVGClass(Line);

const triangleDefaultValues = {
  width: 100,
  height: 100
};
class Triangle extends FabricObject {
  static getDefaults() {
    return {
      ...super.getDefaults(),
      ...Triangle.ownDefaults
    };
  }

  /**
   * Constructor
   * @param {Object} [options] Options object
   */
  constructor(options) {
    super();
    Object.assign(this, Triangle.ownDefaults);
    this.setOptions(options);
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render(ctx) {
    const widthBy2 = this.width / 2,
      heightBy2 = this.height / 2;
    ctx.beginPath();
    ctx.moveTo(-widthBy2, heightBy2);
    ctx.lineTo(0, -heightBy2);
    ctx.lineTo(widthBy2, heightBy2);
    ctx.closePath();
    this._renderPaintInOrder(ctx);
  }

  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    const widthBy2 = this.width / 2,
      heightBy2 = this.height / 2,
      points = `${-widthBy2} ${heightBy2},0 ${-heightBy2},${widthBy2} ${heightBy2}`;
    return ['<polygon ', 'COMMON_PARTS', 'points="', points, '" />'];
  }
}
_defineProperty(Triangle, "type", 'Triangle');
_defineProperty(Triangle, "ownDefaults", triangleDefaultValues);
classRegistry.setClass(Triangle);
classRegistry.setSVGClass(Triangle);

const ellipseDefaultValues = {
  rx: 0,
  ry: 0
};
const ELLIPSE_PROPS = ['rx', 'ry'];
class Ellipse extends FabricObject {
  static getDefaults() {
    return {
      ...super.getDefaults(),
      ...Ellipse.ownDefaults
    };
  }

  /**
   * Constructor
   * @param {Object} [options] Options object
   */
  constructor(options) {
    super();
    Object.assign(this, Ellipse.ownDefaults);
    this.setOptions(options);
  }

  /**
   * @private
   * @param {String} key
   * @param {*} value
   * @return {Ellipse} thisArg
   */
  _set(key, value) {
    super._set(key, value);
    switch (key) {
      case 'rx':
        this.rx = value;
        this.set('width', value * 2);
        break;
      case 'ry':
        this.ry = value;
        this.set('height', value * 2);
        break;
    }
    return this;
  }

  /**
   * Returns horizontal radius of an object (according to how an object is scaled)
   * @return {Number}
   */
  getRx() {
    return this.get('rx') * this.get(SCALE_X);
  }

  /**
   * Returns Vertical radius of an object (according to how an object is scaled)
   * @return {Number}
   */
  getRy() {
    return this.get('ry') * this.get(SCALE_Y);
  }

  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject() {
    let propertiesToInclude = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return super.toObject([...ELLIPSE_PROPS, ...propertiesToInclude]);
  }

  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    return ['<ellipse ', 'COMMON_PARTS', `cx="0" cy="0" rx="${this.rx}" ry="${this.ry}" />\n`];
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx context to render on
   */
  _render(ctx) {
    ctx.beginPath();
    ctx.save();
    ctx.transform(1, 0, 0, this.ry / this.rx, 0, 0);
    ctx.arc(0, 0, this.rx, 0, twoMathPi, false);
    ctx.restore();
    this._renderPaintInOrder(ctx);
  }

  /* _FROM_SVG_START_ */

  /**
   * List of attribute names to account for when parsing SVG element (used by {@link Ellipse.fromElement})
   * @see http://www.w3.org/TR/SVG/shapes.html#EllipseElement
   */

  /**
   * Returns {@link Ellipse} instance from an SVG element
   * @param {HTMLElement} element Element to parse
   * @return {Ellipse}
   */
  static async fromElement(element, options, cssRules) {
    const parsedAttributes = parseAttributes(element, this.ATTRIBUTE_NAMES, cssRules);
    parsedAttributes.left = (parsedAttributes.left || 0) - parsedAttributes.rx;
    parsedAttributes.top = (parsedAttributes.top || 0) - parsedAttributes.ry;
    return new this(parsedAttributes);
  }

  /* _FROM_SVG_END_ */
}
/**
 * Horizontal radius
 * @type Number
 */
/**
 * Vertical radius
 * @type Number
 */
_defineProperty(Ellipse, "type", 'Ellipse');
_defineProperty(Ellipse, "cacheProperties", [...cacheProperties, ...ELLIPSE_PROPS]);
_defineProperty(Ellipse, "ownDefaults", ellipseDefaultValues);
_defineProperty(Ellipse, "ATTRIBUTE_NAMES", [...SHARED_ATTRIBUTES, 'cx', 'cy', 'rx', 'ry']);
classRegistry.setClass(Ellipse);
classRegistry.setSVGClass(Ellipse);

/**
 * Parses "points" attribute, returning an array of values
 * @param {String} points points attribute string
 * @return {Array} array of points
 */
function parsePointsAttribute(points) {
  // points attribute is required and must not be empty
  if (!points) {
    return [];
  }

  // replace commas with whitespace and remove bookending whitespace
  const pointsSplit = points.replace(/,/g, ' ').trim().split(/\s+/);
  const parsedPoints = [];
  for (let i = 0; i < pointsSplit.length; i += 2) {
    parsedPoints.push({
      x: parseFloat(pointsSplit[i]),
      y: parseFloat(pointsSplit[i + 1])
    });
  }

  // odd number of points is an error
  // if (parsedPoints.length % 2 !== 0) {
  //   return null;
  // }
  return parsedPoints;
}

const polylineDefaultValues = {
  /**
   * @deprecated transient option soon to be removed in favor of a different design
   */
  exactBoundingBox: false
};
class Polyline extends FabricObject {
  static getDefaults() {
    return {
      ...super.getDefaults(),
      ...Polyline.ownDefaults
    };
  }

  /**
   * A list of properties that if changed trigger a recalculation of dimensions
   * @todo check if you really need to recalculate for all cases
   */

  /**
   * Constructor
   * @param {Array} points Array of points (where each point is an object with x and y)
   * @param {Object} [options] Options object
   * @return {Polyline} thisArg
   * @example
   * var poly = new Polyline([
   *     { x: 10, y: 10 },
   *     { x: 50, y: 30 },
   *     { x: 40, y: 70 },
   *     { x: 60, y: 50 },
   *     { x: 100, y: 150 },
   *     { x: 40, y: 100 }
   *   ], {
   *   stroke: 'red',
   *   left: 100,
   *   top: 100
   * });
   */
  constructor() {
    let points = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super();
    _defineProperty(this, "strokeDiff", void 0);
    Object.assign(this, Polyline.ownDefaults);
    this.setOptions(options);
    this.points = points;
    const {
      left,
      top
    } = options;
    this.initialized = true;
    this.setBoundingBox(true);
    typeof left === 'number' && this.set(LEFT, left);
    typeof top === 'number' && this.set(TOP, top);
  }
  isOpen() {
    return true;
  }
  _projectStrokeOnPoints(options) {
    return projectStrokeOnPoints(this.points, options, this.isOpen());
  }

  /**
   * Calculate the polygon bounding box
   * @private
   */
  _calcDimensions(options) {
    options = {
      scaleX: this.scaleX,
      scaleY: this.scaleY,
      skewX: this.skewX,
      skewY: this.skewY,
      strokeLineCap: this.strokeLineCap,
      strokeLineJoin: this.strokeLineJoin,
      strokeMiterLimit: this.strokeMiterLimit,
      strokeUniform: this.strokeUniform,
      strokeWidth: this.strokeWidth,
      ...(options || {})
    };
    const points = this.exactBoundingBox ? this._projectStrokeOnPoints(options).map(projection => projection.projectedPoint) : this.points;
    if (points.length === 0) {
      return {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        pathOffset: new Point(),
        strokeOffset: new Point(),
        strokeDiff: new Point()
      };
    }
    const bbox = makeBoundingBoxFromPoints(points),
      // Remove scale effect, since it's applied after
      matrix = calcDimensionsMatrix({
        ...options,
        scaleX: 1,
        scaleY: 1
      }),
      bboxNoStroke = makeBoundingBoxFromPoints(this.points.map(p => transformPoint(p, matrix, true))),
      scale = new Point(this.scaleX, this.scaleY);
    let offsetX = bbox.left + bbox.width / 2,
      offsetY = bbox.top + bbox.height / 2;
    if (this.exactBoundingBox) {
      offsetX = offsetX - offsetY * Math.tan(degreesToRadians(this.skewX));
      // Order of those assignments is important.
      // offsetY relies on offsetX being already changed by the line above
      offsetY = offsetY - offsetX * Math.tan(degreesToRadians(this.skewY));
    }
    return {
      ...bbox,
      pathOffset: new Point(offsetX, offsetY),
      strokeOffset: new Point(bboxNoStroke.left, bboxNoStroke.top).subtract(new Point(bbox.left, bbox.top)).multiply(scale),
      strokeDiff: new Point(bbox.width, bbox.height).subtract(new Point(bboxNoStroke.width, bboxNoStroke.height)).multiply(scale)
    };
  }

  /**
   * This function is an helper for svg import. it returns the center of the object in the svg
   * untransformed coordinates, by look at the polyline/polygon points.
   * @private
   * @return {Point} center point from element coordinates
   */
  _findCenterFromElement() {
    const bbox = makeBoundingBoxFromPoints(this.points);
    return new Point(bbox.left + bbox.width / 2, bbox.top + bbox.height / 2);
  }
  setDimensions() {
    this.setBoundingBox();
  }
  setBoundingBox(adjustPosition) {
    const {
      left,
      top,
      width,
      height,
      pathOffset,
      strokeOffset,
      strokeDiff
    } = this._calcDimensions();
    this.set({
      width,
      height,
      pathOffset,
      strokeOffset,
      strokeDiff
    });
    adjustPosition && this.setPositionByOrigin(new Point(left + width / 2, top + height / 2), CENTER, CENTER);
  }

  /**
   * @deprecated intermidiate method to be removed, do not use
   */
  isStrokeAccountedForInDimensions() {
    return this.exactBoundingBox;
  }

  /**
   * @override stroke is taken in account in size
   */
  _getNonTransformedDimensions() {
    return this.exactBoundingBox ?
    // TODO: fix this
    new Point(this.width, this.height) : super._getNonTransformedDimensions();
  }

  /**
   * @override stroke and skewing are taken into account when projecting stroke on points,
   * therefore we don't want the default calculation to account for skewing as well.
   * Though it is possible to pass `width` and `height` in `options`, doing so is very strange, use with discretion.
   *
   * @private
   */
  _getTransformedDimensions() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (this.exactBoundingBox) {
      let size;
      /* When `strokeUniform = true`, any changes to the properties require recalculating the `width` and `height` because
        the stroke projections are affected.
        When `strokeUniform = false`, we don't need to recalculate for scale transformations, as the effect of scale on
        projections follows a linear function (e.g. scaleX of 2 just multiply width by 2)*/
      if (Object.keys(options).some(key => this.strokeUniform || this.constructor.layoutProperties.includes(key))) {
        var _options$width, _options$height;
        const {
          width,
          height
        } = this._calcDimensions(options);
        size = new Point((_options$width = options.width) !== null && _options$width !== void 0 ? _options$width : width, (_options$height = options.height) !== null && _options$height !== void 0 ? _options$height : height);
      } else {
        var _options$width2, _options$height2;
        size = new Point((_options$width2 = options.width) !== null && _options$width2 !== void 0 ? _options$width2 : this.width, (_options$height2 = options.height) !== null && _options$height2 !== void 0 ? _options$height2 : this.height);
      }
      return size.multiply(new Point(options.scaleX || this.scaleX, options.scaleY || this.scaleY));
    } else {
      return super._getTransformedDimensions(options);
    }
  }

  /**
   * Recalculates dimensions when changing skew and scale
   * @private
   */
  _set(key, value) {
    const changed = this.initialized && this[key] !== value;
    const output = super._set(key, value);
    if (this.exactBoundingBox && changed && ((key === SCALE_X || key === SCALE_Y) && this.strokeUniform && this.constructor.layoutProperties.includes('strokeUniform') || this.constructor.layoutProperties.includes(key))) {
      this.setDimensions();
    }
    return output;
  }

  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} Object representation of an instance
   */
  toObject() {
    let propertiesToInclude = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return {
      ...super.toObject(propertiesToInclude),
      points: this.points.map(_ref => {
        let {
          x,
          y
        } = _ref;
        return {
          x,
          y
        };
      })
    };
  }

  /**
   * Returns svg representation of an instance
   * @return {Array} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    const points = [],
      diffX = this.pathOffset.x,
      diffY = this.pathOffset.y,
      NUM_FRACTION_DIGITS = config.NUM_FRACTION_DIGITS;
    for (let i = 0, len = this.points.length; i < len; i++) {
      points.push(toFixed(this.points[i].x - diffX, NUM_FRACTION_DIGITS), ',', toFixed(this.points[i].y - diffY, NUM_FRACTION_DIGITS), ' ');
    }
    return [`<${this.constructor.type.toLowerCase()} `, 'COMMON_PARTS', `points="${points.join('')}" />\n`];
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render(ctx) {
    const len = this.points.length,
      x = this.pathOffset.x,
      y = this.pathOffset.y;
    if (!len || isNaN(this.points[len - 1].y)) {
      // do not draw if no points or odd points
      // NaN comes from parseFloat of a empty string in parser
      return;
    }
    ctx.beginPath();
    ctx.moveTo(this.points[0].x - x, this.points[0].y - y);
    for (let i = 0; i < len; i++) {
      const point = this.points[i];
      ctx.lineTo(point.x - x, point.y - y);
    }
    !this.isOpen() && ctx.closePath();
    this._renderPaintInOrder(ctx);
  }

  /**
   * Returns complexity of an instance
   * @return {Number} complexity of this instance
   */
  complexity() {
    return this.points.length;
  }

  /* _FROM_SVG_START_ */

  /**
   * List of attribute names to account for when parsing SVG element (used by {@link Polyline.fromElement})
   * @see: http://www.w3.org/TR/SVG/shapes.html#PolylineElement
   */

  /**
   * Returns Polyline instance from an SVG element
   * @param {HTMLElement} element Element to parser
   * @param {Object} [options] Options object
   */
  static async fromElement(element, options, cssRules) {
    const points = parsePointsAttribute(element.getAttribute('points')),
      // we omit left and top to instruct the constructor to position the object using the bbox

      {
        left,
        top,
        ...parsedAttributes
      } = parseAttributes(element, this.ATTRIBUTE_NAMES, cssRules);
    return new this(points, {
      ...parsedAttributes,
      ...options
    });
  }

  /* _FROM_SVG_END_ */

  /**
   * Returns Polyline instance from an object representation
   * @param {Object} object Object to create an instance from
   * @returns {Promise<Polyline>}
   */
  static fromObject(object) {
    return this._fromObject(object, {
      extraParam: 'points'
    });
  }
}
/**
 * Points array
 * @type Array
 */
/**
 * WARNING: Feature in progress
 * Calculate the exact bounding box taking in account strokeWidth on acute angles
 * this will be turned to true by default on fabric 6.0
 * maybe will be left in as an optimization since calculations may be slow
 * @deprecated transient option soon to be removed in favor of a different design
 * @type Boolean
 * @default false
 */
_defineProperty(Polyline, "ownDefaults", polylineDefaultValues);
_defineProperty(Polyline, "type", 'Polyline');
_defineProperty(Polyline, "layoutProperties", [SKEW_X, SKEW_Y, 'strokeLineCap', 'strokeLineJoin', 'strokeMiterLimit', 'strokeWidth', 'strokeUniform', 'points']);
_defineProperty(Polyline, "cacheProperties", [...cacheProperties, 'points']);
_defineProperty(Polyline, "ATTRIBUTE_NAMES", [...SHARED_ATTRIBUTES]);
classRegistry.setClass(Polyline);
classRegistry.setSVGClass(Polyline);

class Polygon extends Polyline {
  isOpen() {
    return false;
  }
}
_defineProperty(Polygon, "ownDefaults", polylineDefaultValues);
_defineProperty(Polygon, "type", 'Polygon');
classRegistry.setClass(Polygon);
classRegistry.setSVGClass(Polygon);

class StyledText extends FabricObject {
  /**
   * Returns true if object has no styling or no styling in a line
   * @param {Number} lineIndex , lineIndex is on wrapped lines.
   * @return {Boolean}
   */
  isEmptyStyles(lineIndex) {
    if (!this.styles) {
      return true;
    }
    if (typeof lineIndex !== 'undefined' && !this.styles[lineIndex]) {
      return true;
    }
    const obj = typeof lineIndex === 'undefined' ? this.styles : {
      line: this.styles[lineIndex]
    };
    for (const p1 in obj) {
      for (const p2 in obj[p1]) {
        // eslint-disable-next-line no-unused-vars
        for (const p3 in obj[p1][p2]) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Returns true if object has a style property or has it ina specified line
   * This function is used to detect if a text will use a particular property or not.
   * @param {String} property to check for
   * @param {Number} lineIndex to check the style on
   * @return {Boolean}
   */
  styleHas(property, lineIndex) {
    if (!this.styles) {
      return false;
    }
    if (typeof lineIndex !== 'undefined' && !this.styles[lineIndex]) {
      return false;
    }
    const obj = typeof lineIndex === 'undefined' ? this.styles : {
      0: this.styles[lineIndex]
    };
    // eslint-disable-next-line
    for (const p1 in obj) {
      // eslint-disable-next-line
      for (const p2 in obj[p1]) {
        if (typeof obj[p1][p2][property] !== 'undefined') {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Check if characters in a text have a value for a property
   * whose value matches the textbox's value for that property.  If so,
   * the character-level property is deleted.  If the character
   * has no other properties, then it is also deleted.  Finally,
   * if the line containing that character has no other characters
   * then it also is deleted.
   */
  cleanStyle(property) {
    if (!this.styles) {
      return false;
    }
    const obj = this.styles;
    let stylesCount = 0,
      letterCount,
      stylePropertyValue,
      allStyleObjectPropertiesMatch = true,
      graphemeCount = 0;
    for (const p1 in obj) {
      letterCount = 0;
      for (const p2 in obj[p1]) {
        const styleObject = obj[p1][p2] || {},
          stylePropertyHasBeenSet = styleObject[property] !== undefined;
        stylesCount++;
        if (stylePropertyHasBeenSet) {
          if (!stylePropertyValue) {
            stylePropertyValue = styleObject[property];
          } else if (styleObject[property] !== stylePropertyValue) {
            allStyleObjectPropertiesMatch = false;
          }
          if (styleObject[property] === this[property]) {
            delete styleObject[property];
          }
        } else {
          allStyleObjectPropertiesMatch = false;
        }
        if (Object.keys(styleObject).length !== 0) {
          letterCount++;
        } else {
          delete obj[p1][p2];
        }
      }
      if (letterCount === 0) {
        delete obj[p1];
      }
    }
    // if every grapheme has the same style set then
    // delete those styles and set it on the parent
    for (let i = 0; i < this._textLines.length; i++) {
      graphemeCount += this._textLines[i].length;
    }
    if (allStyleObjectPropertiesMatch && stylesCount === graphemeCount) {
      this[property] = stylePropertyValue;
      this.removeStyle(property);
    }
  }

  /**
   * Remove a style property or properties from all individual character styles
   * in a text object.  Deletes the character style object if it contains no other style
   * props.  Deletes a line style object if it contains no other character styles.
   *
   * @param {String} props The property to remove from character styles.
   */
  removeStyle(property) {
    if (!this.styles) {
      return;
    }
    const obj = this.styles;
    let line, lineNum, charNum;
    for (lineNum in obj) {
      line = obj[lineNum];
      for (charNum in line) {
        delete line[charNum][property];
        if (Object.keys(line[charNum]).length === 0) {
          delete line[charNum];
        }
      }
      if (Object.keys(line).length === 0) {
        delete obj[lineNum];
      }
    }
  }
  _extendStyles(index, style) {
    const {
      lineIndex,
      charIndex
    } = this.get2DCursorLocation(index);
    if (!this._getLineStyle(lineIndex)) {
      this._setLineStyle(lineIndex);
    }
    const newStyle = pickBy({
      // first create a new object that is a merge of existing and new
      ...this._getStyleDeclaration(lineIndex, charIndex),
      ...style
      // use the predicate to discard undefined values
    }, value => value !== undefined);

    // finally assign to the old position the new style
    this._setStyleDeclaration(lineIndex, charIndex, newStyle);
  }

  /**
   * Gets style of a current selection/cursor (at the start position)
   * @param {Number} startIndex Start index to get styles at
   * @param {Number} endIndex End index to get styles at, if not specified startIndex + 1
   * @param {Boolean} [complete] get full style or not
   * @return {Array} styles an array with one, zero or more Style objects
   */
  getSelectionStyles(startIndex, endIndex, complete) {
    const styles = [];
    for (let i = startIndex; i < (endIndex || startIndex); i++) {
      styles.push(this.getStyleAtPosition(i, complete));
    }
    return styles;
  }

  /**
   * Gets style of a current selection/cursor position
   * @param {Number} position  to get styles at
   * @param {Boolean} [complete] full style if true
   * @return {Object} style Style object at a specified index
   * @private
   */
  getStyleAtPosition(position, complete) {
    const {
      lineIndex,
      charIndex
    } = this.get2DCursorLocation(position);
    return complete ? this.getCompleteStyleDeclaration(lineIndex, charIndex) : this._getStyleDeclaration(lineIndex, charIndex);
  }

  /**
   * Sets style of a current selection, if no selection exist, do not set anything.
   * @param {Object} styles Styles object
   * @param {Number} startIndex Start index to get styles at
   * @param {Number} [endIndex] End index to get styles at, if not specified startIndex + 1
   */
  setSelectionStyles(styles, startIndex, endIndex) {
    for (let i = startIndex; i < (endIndex || startIndex); i++) {
      this._extendStyles(i, styles);
    }
    /* not included in _extendStyles to avoid clearing cache more than once */
    this._forceClearCache = true;
  }

  /**
   * Get a reference, not a clone, to the style object for a given character,
   * if no style is set for a line or char, return a new empty object.
   * This is tricky and confusing because when you get an empty object you can't
   * determine if it is a reference or a new one.
   * @TODO this should always return a reference or always a clone or undefined when necessary.
   * @protected
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @return {TextStyleDeclaration} a style object reference to the existing one or a new empty object when undefined
   */
  _getStyleDeclaration(lineIndex, charIndex) {
    var _lineStyle$charIndex;
    const lineStyle = this.styles && this.styles[lineIndex];
    return lineStyle ? (_lineStyle$charIndex = lineStyle[charIndex]) !== null && _lineStyle$charIndex !== void 0 ? _lineStyle$charIndex : {} : {};
  }

  /**
   * return a new object that contains all the style property for a character
   * the object returned is newly created
   * @param {Number} lineIndex of the line where the character is
   * @param {Number} charIndex position of the character on the line
   * @return {Object} style object
   */
  getCompleteStyleDeclaration(lineIndex, charIndex) {
    return {
      ...pick(this, this.constructor._styleProperties),
      ...this._getStyleDeclaration(lineIndex, charIndex)
    };
  }

  /**
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @param {Object} style
   * @private
   */
  _setStyleDeclaration(lineIndex, charIndex, style) {
    this.styles[lineIndex][charIndex] = style;
  }

  /**
   *
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @private
   */
  _deleteStyleDeclaration(lineIndex, charIndex) {
    delete this.styles[lineIndex][charIndex];
  }

  /**
   * @param {Number} lineIndex
   * @return {Boolean} if the line exists or not
   * @private
   */
  _getLineStyle(lineIndex) {
    return !!this.styles[lineIndex];
  }

  /**
   * Set the line style to an empty object so that is initialized
   * @param {Number} lineIndex
   * @private
   */
  _setLineStyle(lineIndex) {
    this.styles[lineIndex] = {};
  }
  _deleteLineStyle(lineIndex) {
    delete this.styles[lineIndex];
  }
}
_defineProperty(StyledText, "_styleProperties", styleProperties);

const multipleSpacesRegex = /  +/g;
const dblQuoteRegex = /"/g;
function createSVGInlineRect(color, left, top, width, height) {
  return `\t\t${createSVGRect(color, {
    left,
    top,
    width,
    height
  })}\n`;
}
class TextSVGExportMixin extends FabricObjectSVGExportMixin {
  _toSVG() {
    const offsets = this._getSVGLeftTopOffsets(),
      textAndBg = this._getSVGTextAndBg(offsets.textTop, offsets.textLeft);
    return this._wrapSVGTextAndBg(textAndBg);
  }
  toSVG(reviver) {
    const textSvg = this._createBaseSVGMarkup(this._toSVG(), {
        reviver,
        noStyle: true,
        withShadow: true
      }),
      path = this.path;
    if (path) {
      return textSvg + path._createBaseSVGMarkup(path._toSVG(), {
        reviver,
        withShadow: true,
        additionalTransform: matrixToSVG(this.calcOwnMatrix())
      });
    }
    return textSvg;
  }
  _getSVGLeftTopOffsets() {
    return {
      textLeft: -this.width / 2,
      textTop: -this.height / 2,
      lineTop: this.getHeightOfLine(0)
    };
  }
  _wrapSVGTextAndBg(_ref) {
    let {
      textBgRects,
      textSpans
    } = _ref;
    const noShadow = true,
      textDecoration = this.getSvgTextDecoration(this);
    return [textBgRects.join(''), '\t\t<text xml:space="preserve" ', `font-family="${this.fontFamily.replace(dblQuoteRegex, "'")}" `, `font-size="${this.fontSize}" `, this.fontStyle ? `font-style="${this.fontStyle}" ` : '', this.fontWeight ? `font-weight="${this.fontWeight}" ` : '', textDecoration ? `text-decoration="${textDecoration}" ` : '', this.direction === 'rtl' ? `direction="${this.direction}" ` : '', 'style="', this.getSvgStyles(noShadow), '"', this.addPaintOrder(), ' >', textSpans.join(''), '</text>\n'];
  }

  /**
   * @private
   * @param {Number} textTopOffset Text top offset
   * @param {Number} textLeftOffset Text left offset
   * @return {Object}
   */
  _getSVGTextAndBg(textTopOffset, textLeftOffset) {
    const textSpans = [],
      textBgRects = [];
    let height = textTopOffset,
      lineOffset;

    // bounding-box background
    this.backgroundColor && textBgRects.push(...createSVGInlineRect(this.backgroundColor, -this.width / 2, -this.height / 2, this.width, this.height));

    // text and text-background
    for (let i = 0, len = this._textLines.length; i < len; i++) {
      lineOffset = this._getLineLeftOffset(i);
      if (this.direction === 'rtl') {
        lineOffset += this.width;
      }
      if (this.textBackgroundColor || this.styleHas('textBackgroundColor', i)) {
        this._setSVGTextLineBg(textBgRects, i, textLeftOffset + lineOffset, height);
      }
      this._setSVGTextLineText(textSpans, i, textLeftOffset + lineOffset, height);
      height += this.getHeightOfLine(i);
    }
    return {
      textSpans,
      textBgRects
    };
  }
  _createTextCharSpan(char, styleDecl, left, top, charBox) {
    const numFractionDigit = config.NUM_FRACTION_DIGITS;
    const styleProps = this.getSvgSpanStyles(styleDecl, char !== char.trim() || !!char.match(multipleSpacesRegex)),
      fillStyles = styleProps ? `style="${styleProps}"` : '',
      dy = styleDecl.deltaY,
      dySpan = dy ? ` dy="${toFixed(dy, numFractionDigit)}" ` : '',
      {
        angle,
        renderLeft,
        renderTop,
        width
      } = charBox;
    let angleAttr = '';
    if (renderLeft !== undefined) {
      const wBy2 = width / 2;
      angle && (angleAttr = ` rotate="${toFixed(radiansToDegrees(angle), numFractionDigit)}"`);
      const m = createRotateMatrix({
        angle: radiansToDegrees(angle)
      });
      m[4] = renderLeft;
      m[5] = renderTop;
      const renderPoint = new Point(-wBy2, 0).transform(m);
      left = renderPoint.x;
      top = renderPoint.y;
    }
    return `<tspan x="${toFixed(left, numFractionDigit)}" y="${toFixed(top, numFractionDigit)}" ${dySpan}${angleAttr}${fillStyles}>${escapeXml(char)}</tspan>`;
  }
  _setSVGTextLineText(textSpans, lineIndex, textLeftOffset, textTopOffset) {
    const lineHeight = this.getHeightOfLine(lineIndex),
      isJustify = this.textAlign.includes(JUSTIFY),
      line = this._textLines[lineIndex];
    let actualStyle,
      nextStyle,
      charsToRender = '',
      charBox,
      style,
      boxWidth = 0,
      timeToRender;
    textTopOffset += lineHeight * (1 - this._fontSizeFraction) / this.lineHeight;
    for (let i = 0, len = line.length - 1; i <= len; i++) {
      timeToRender = i === len || this.charSpacing || this.path;
      charsToRender += line[i];
      charBox = this.__charBounds[lineIndex][i];
      if (boxWidth === 0) {
        textLeftOffset += charBox.kernedWidth - charBox.width;
        boxWidth += charBox.width;
      } else {
        boxWidth += charBox.kernedWidth;
      }
      if (isJustify && !timeToRender) {
        if (this._reSpaceAndTab.test(line[i])) {
          timeToRender = true;
        }
      }
      if (!timeToRender) {
        // if we have charSpacing or a path, we render char by char
        actualStyle = actualStyle || this.getCompleteStyleDeclaration(lineIndex, i);
        nextStyle = this.getCompleteStyleDeclaration(lineIndex, i + 1);
        timeToRender = hasStyleChanged(actualStyle, nextStyle, true);
      }
      if (timeToRender) {
        style = this._getStyleDeclaration(lineIndex, i);
        textSpans.push(this._createTextCharSpan(charsToRender, style, textLeftOffset, textTopOffset, charBox));
        charsToRender = '';
        actualStyle = nextStyle;
        if (this.direction === 'rtl') {
          textLeftOffset -= boxWidth;
        } else {
          textLeftOffset += boxWidth;
        }
        boxWidth = 0;
      }
    }
  }
  _setSVGTextLineBg(textBgRects, i, leftOffset, textTopOffset) {
    const line = this._textLines[i],
      heightOfLine = this.getHeightOfLine(i) / this.lineHeight;
    let boxWidth = 0,
      boxStart = 0,
      currentColor,
      lastColor = this.getValueOfPropertyAt(i, 0, 'textBackgroundColor');
    for (let j = 0; j < line.length; j++) {
      const {
        left,
        width,
        kernedWidth
      } = this.__charBounds[i][j];
      currentColor = this.getValueOfPropertyAt(i, j, 'textBackgroundColor');
      if (currentColor !== lastColor) {
        lastColor && textBgRects.push(...createSVGInlineRect(lastColor, leftOffset + boxStart, textTopOffset, boxWidth, heightOfLine));
        boxStart = left;
        boxWidth = width;
        lastColor = currentColor;
      } else {
        boxWidth += kernedWidth;
      }
    }
    currentColor && textBgRects.push(...createSVGInlineRect(lastColor, leftOffset + boxStart, textTopOffset, boxWidth, heightOfLine));
  }

  /**
   * Returns styles-string for svg-export
   * @param {Boolean} skipShadow a boolean to skip shadow filter output
   * @return {String}
   */
  getSvgStyles(skipShadow) {
    return `${super.getSvgStyles(skipShadow)} text-decoration-thickness: ${toFixed(this.textDecorationThickness * this.getObjectScaling().y / 10, config.NUM_FRACTION_DIGITS)}%; white-space: pre;`;
  }

  /**
   * Returns styles-string for svg-export
   * @param {Object} style the object from which to retrieve style properties
   * @param {Boolean} useWhiteSpace a boolean to include an additional attribute in the style.
   * @return {String}
   */
  getSvgSpanStyles(style, useWhiteSpace) {
    const {
      fontFamily,
      strokeWidth,
      stroke,
      fill,
      fontSize,
      fontStyle,
      fontWeight,
      deltaY,
      textDecorationThickness,
      linethrough,
      overline,
      underline
    } = style;
    const textDecoration = this.getSvgTextDecoration({
      underline: underline !== null && underline !== void 0 ? underline : this.underline,
      overline: overline !== null && overline !== void 0 ? overline : this.overline,
      linethrough: linethrough !== null && linethrough !== void 0 ? linethrough : this.linethrough
    });
    const thickness = textDecorationThickness || this.textDecorationThickness;
    return [stroke ? colorPropToSVG(STROKE, stroke) : '', strokeWidth ? `stroke-width: ${strokeWidth}; ` : '', fontFamily ? `font-family: ${!fontFamily.includes("'") && !fontFamily.includes('"') ? `'${fontFamily}'` : fontFamily}; ` : '', fontSize ? `font-size: ${fontSize}px; ` : '', fontStyle ? `font-style: ${fontStyle}; ` : '', fontWeight ? `font-weight: ${fontWeight}; ` : '', textDecoration ? `text-decoration: ${textDecoration}; text-decoration-thickness: ${toFixed(thickness * this.getObjectScaling().y / 10, config.NUM_FRACTION_DIGITS)}%; ` : '', fill ? colorPropToSVG(FILL, fill) : '', deltaY ? `baseline-shift: ${-deltaY}; ` : '', useWhiteSpace ? 'white-space: pre; ' : ''].join('');
  }

  /**
   * Returns text-decoration property for svg-export
   * @param {Object} style the object from which to retrieve style properties
   * @return {String}
   */
  getSvgTextDecoration(style) {
    return ['overline', 'underline', 'line-through'].filter(decoration => style[decoration.replace('-', '')]).join(' ');
  }
}

let measuringContext;

/**
 * Return a context for measurement of text string.
 * if created it gets stored for reuse
 */
function getMeasuringContext() {
  if (!measuringContext) {
    const canvas = createCanvasElementFor({
      width: 0,
      height: 0
    });
    measuringContext = canvas.getContext('2d');
  }
  return measuringContext;
}

/**
 * Measure and return the info of a single grapheme.
 * needs the the info of previous graphemes already filled
 * Override to customize measuring
 */

// @TODO this is not complete

/**
 * Text class
 * @see {@link http://fabric5.fabricjs.com/fabric-intro-part-2#text}
 */
class FabricText extends StyledText {
  static getDefaults() {
    return {
      ...super.getDefaults(),
      ...FabricText.ownDefaults
    };
  }
  constructor(text, options) {
    super();
    /**
     * contains characters bounding boxes
     * This variable is considered to be protected.
     * But for how mixins are implemented right now, we can't leave it private
     * @protected
     */
    _defineProperty(this, "__charBounds", []);
    Object.assign(this, FabricText.ownDefaults);
    this.setOptions(options);
    if (!this.styles) {
      this.styles = {};
    }
    this.text = text;
    this.initialized = true;
    if (this.path) {
      this.setPathInfo();
    }
    this.initDimensions();
    this.setCoords();
  }

  /**
   * If text has a path, it will add the extra information needed
   * for path and text calculations
   */
  setPathInfo() {
    const path = this.path;
    if (path) {
      path.segmentsInfo = getPathSegmentsInfo(path.path);
    }
  }

  /**
   * @private
   * Divides text into lines of text and lines of graphemes.
   */
  _splitText() {
    const newLines = this._splitTextIntoLines(this.text);
    this.textLines = newLines.lines;
    this._textLines = newLines.graphemeLines;
    this._unwrappedTextLines = newLines._unwrappedLines;
    this._text = newLines.graphemeText;
    return newLines;
  }

  /**
   * Initialize or update text dimensions.
   * Updates this.width and this.height with the proper values.
   * Does not return dimensions.
   */
  initDimensions() {
    this._splitText();
    this._clearCache();
    this.dirty = true;
    if (this.path) {
      this.width = this.path.width;
      this.height = this.path.height;
    } else {
      this.width = this.calcTextWidth() || this.cursorWidth || this.MIN_TEXT_WIDTH;
      this.height = this.calcTextHeight();
    }
    if (this.textAlign.includes(JUSTIFY)) {
      // once text is measured we need to make space fatter to make justified text.
      this.enlargeSpaces();
    }
  }

  /**
   * Enlarge space boxes and shift the others
   */
  enlargeSpaces() {
    let diffSpace, currentLineWidth, numberOfSpaces, accumulatedSpace, line, charBound, spaces;
    for (let i = 0, len = this._textLines.length; i < len; i++) {
      if (this.textAlign !== JUSTIFY && (i === len - 1 || this.isEndOfWrapping(i))) {
        continue;
      }
      accumulatedSpace = 0;
      line = this._textLines[i];
      currentLineWidth = this.getLineWidth(i);
      if (currentLineWidth < this.width && (spaces = this.textLines[i].match(this._reSpacesAndTabs))) {
        numberOfSpaces = spaces.length;
        diffSpace = (this.width - currentLineWidth) / numberOfSpaces;
        for (let j = 0; j <= line.length; j++) {
          charBound = this.__charBounds[i][j];
          if (this._reSpaceAndTab.test(line[j])) {
            charBound.width += diffSpace;
            charBound.kernedWidth += diffSpace;
            charBound.left += accumulatedSpace;
            accumulatedSpace += diffSpace;
          } else {
            charBound.left += accumulatedSpace;
          }
        }
      }
    }
  }

  /**
   * Detect if the text line is ended with an hard break
   * text and itext do not have wrapping, return false
   * @return {Boolean}
   */
  isEndOfWrapping(lineIndex) {
    return lineIndex === this._textLines.length - 1;
  }

  /**
   * Detect if a line has a linebreak and so we need to account for it when moving
   * and counting style.
   * It return always 1 for text and Itext. Textbox has its own implementation
   * @return Number
   */

  missingNewlineOffset(_lineIndex) {
    return 1;
  }

  /**
   * Returns 2d representation (lineIndex and charIndex) of cursor
   * @param {Number} selectionStart
   * @param {Boolean} [skipWrapping] consider the location for unwrapped lines. useful to manage styles.
   */
  get2DCursorLocation(selectionStart, skipWrapping) {
    const lines = skipWrapping ? this._unwrappedTextLines : this._textLines;
    let i;
    for (i = 0; i < lines.length; i++) {
      if (selectionStart <= lines[i].length) {
        return {
          lineIndex: i,
          charIndex: selectionStart
        };
      }
      selectionStart -= lines[i].length + this.missingNewlineOffset(i, skipWrapping);
    }
    return {
      lineIndex: i - 1,
      charIndex: lines[i - 1].length < selectionStart ? lines[i - 1].length : selectionStart
    };
  }

  /**
   * Returns string representation of an instance
   * @return {String} String representation of text object
   */
  toString() {
    return `#<Text (${this.complexity()}): { "text": "${this.text}", "fontFamily": "${this.fontFamily}" }>`;
  }

  /**
   * Return the dimension and the zoom level needed to create a cache canvas
   * big enough to host the object to be cached.
   * @private
   * @param {Object} dim.x width of object to be cached
   * @param {Object} dim.y height of object to be cached
   * @return {Object}.width width of canvas
   * @return {Object}.height height of canvas
   * @return {Object}.zoomX zoomX zoom value to unscale the canvas before drawing cache
   * @return {Object}.zoomY zoomY zoom value to unscale the canvas before drawing cache
   */
  _getCacheCanvasDimensions() {
    const dims = super._getCacheCanvasDimensions();
    const fontSize = this.fontSize;
    dims.width += fontSize * dims.zoomX;
    dims.height += fontSize * dims.zoomY;
    return dims;
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render(ctx) {
    const path = this.path;
    path && !path.isNotVisible() && path._render(ctx);
    this._setTextStyles(ctx);
    this._renderTextLinesBackground(ctx);
    this._renderTextDecoration(ctx, 'underline');
    this._renderText(ctx);
    this._renderTextDecoration(ctx, 'overline');
    this._renderTextDecoration(ctx, 'linethrough');
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderText(ctx) {
    if (this.paintFirst === STROKE) {
      this._renderTextStroke(ctx);
      this._renderTextFill(ctx);
    } else {
      this._renderTextFill(ctx);
      this._renderTextStroke(ctx);
    }
  }

  /**
   * Set the font parameter of the context with the object properties or with charStyle
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {Object} [charStyle] object with font style properties
   * @param {String} [charStyle.fontFamily] Font Family
   * @param {Number} [charStyle.fontSize] Font size in pixels. ( without px suffix )
   * @param {String} [charStyle.fontWeight] Font weight
   * @param {String} [charStyle.fontStyle] Font style (italic|normal)
   */
  _setTextStyles(ctx, charStyle, forMeasuring) {
    ctx.textBaseline = 'alphabetic';
    if (this.path) {
      switch (this.pathAlign) {
        case CENTER:
          ctx.textBaseline = 'middle';
          break;
        case 'ascender':
          ctx.textBaseline = TOP;
          break;
        case 'descender':
          ctx.textBaseline = BOTTOM;
          break;
      }
    }
    ctx.font = this._getFontDeclaration(charStyle, forMeasuring);
  }

  /**
   * calculate and return the text Width measuring each line.
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @return {Number} Maximum width of Text object
   */
  calcTextWidth() {
    let maxWidth = this.getLineWidth(0);
    for (let i = 1, len = this._textLines.length; i < len; i++) {
      const currentLineWidth = this.getLineWidth(i);
      if (currentLineWidth > maxWidth) {
        maxWidth = currentLineWidth;
      }
    }
    return maxWidth;
  }

  /**
   * @private
   * @param {String} method Method name ("fillText" or "strokeText")
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {String} line Text to render
   * @param {Number} left Left position of text
   * @param {Number} top Top position of text
   * @param {Number} lineIndex Index of a line in a text
   */
  _renderTextLine(method, ctx, line, left, top, lineIndex) {
    this._renderChars(method, ctx, line, left, top, lineIndex);
  }

  /**
   * Renders the text background for lines, taking care of style
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderTextLinesBackground(ctx) {
    if (!this.textBackgroundColor && !this.styleHas('textBackgroundColor')) {
      return;
    }
    const originalFill = ctx.fillStyle,
      leftOffset = this._getLeftOffset();
    let lineTopOffset = this._getTopOffset();
    for (let i = 0, len = this._textLines.length; i < len; i++) {
      const heightOfLine = this.getHeightOfLine(i);
      if (!this.textBackgroundColor && !this.styleHas('textBackgroundColor', i)) {
        lineTopOffset += heightOfLine;
        continue;
      }
      const jlen = this._textLines[i].length;
      const lineLeftOffset = this._getLineLeftOffset(i);
      let boxWidth = 0;
      let boxStart = 0;
      let drawStart;
      let currentColor;
      let lastColor = this.getValueOfPropertyAt(i, 0, 'textBackgroundColor');
      const bgHeight = this.getHeightOfLineImpl(i);
      for (let j = 0; j < jlen; j++) {
        // at this point charbox are either standard or full with pathInfo if there is a path.
        const charBox = this.__charBounds[i][j];
        currentColor = this.getValueOfPropertyAt(i, j, 'textBackgroundColor');
        if (this.path) {
          ctx.save();
          ctx.translate(charBox.renderLeft, charBox.renderTop);
          ctx.rotate(charBox.angle);
          ctx.fillStyle = currentColor;
          currentColor && ctx.fillRect(-charBox.width / 2, -bgHeight * (1 - this._fontSizeFraction), charBox.width, bgHeight);
          ctx.restore();
        } else if (currentColor !== lastColor) {
          drawStart = leftOffset + lineLeftOffset + boxStart;
          if (this.direction === RTL) {
            drawStart = this.width - drawStart - boxWidth;
          }
          ctx.fillStyle = lastColor;
          lastColor && ctx.fillRect(drawStart, lineTopOffset, boxWidth, bgHeight);
          boxStart = charBox.left;
          boxWidth = charBox.width;
          lastColor = currentColor;
        } else {
          boxWidth += charBox.kernedWidth;
        }
      }
      if (currentColor && !this.path) {
        drawStart = leftOffset + lineLeftOffset + boxStart;
        if (this.direction === RTL) {
          drawStart = this.width - drawStart - boxWidth;
        }
        ctx.fillStyle = currentColor;
        ctx.fillRect(drawStart, lineTopOffset, boxWidth, bgHeight);
      }
      lineTopOffset += heightOfLine;
    }
    ctx.fillStyle = originalFill;
    // if there is text background color no
    // other shadows should be casted
    this._removeShadow(ctx);
  }

  /**
   * measure and return the width of a single character.
   * possibly overridden to accommodate different measure logic or
   * to hook some external lib for character measurement
   * @private
   * @param {String} _char, char to be measured
   * @param {Object} charStyle style of char to be measured
   * @param {String} [previousChar] previous char
   * @param {Object} [prevCharStyle] style of previous char
   */
  _measureChar(_char, charStyle, previousChar, prevCharStyle) {
    const fontCache = cache.getFontCache(charStyle),
      fontDeclaration = this._getFontDeclaration(charStyle),
      couple = previousChar ? previousChar + _char : _char,
      stylesAreEqual = previousChar && fontDeclaration === this._getFontDeclaration(prevCharStyle),
      fontMultiplier = charStyle.fontSize / this.CACHE_FONT_SIZE;
    let width, coupleWidth, previousWidth, kernedWidth;
    if (previousChar && fontCache.has(previousChar)) {
      previousWidth = fontCache.get(previousChar);
    }
    if (fontCache.has(_char)) {
      kernedWidth = width = fontCache.get(_char);
    }
    if (stylesAreEqual && fontCache.has(couple)) {
      coupleWidth = fontCache.get(couple);
      kernedWidth = coupleWidth - previousWidth;
    }
    if (width === undefined || previousWidth === undefined || coupleWidth === undefined) {
      const ctx = getMeasuringContext();
      // send a TRUE to specify measuring font size CACHE_FONT_SIZE
      this._setTextStyles(ctx, charStyle, true);
      if (width === undefined) {
        kernedWidth = width = ctx.measureText(_char).width;
        fontCache.set(_char, width);
      }
      if (previousWidth === undefined && stylesAreEqual && previousChar) {
        previousWidth = ctx.measureText(previousChar).width;
        fontCache.set(previousChar, previousWidth);
      }
      if (stylesAreEqual && coupleWidth === undefined) {
        // we can measure the kerning couple and subtract the width of the previous character
        coupleWidth = ctx.measureText(couple).width;
        fontCache.set(couple, coupleWidth);
        // safe to use the non-null since if undefined we defined it before.
        kernedWidth = coupleWidth - previousWidth;
      }
    }
    return {
      width: width * fontMultiplier,
      kernedWidth: kernedWidth * fontMultiplier
    };
  }

  /**
   * Computes height of character at given position
   * @param {Number} line the line index number
   * @param {Number} _char the character index number
   * @return {Number} fontSize of the character
   */
  getHeightOfChar(line, _char) {
    return this.getValueOfPropertyAt(line, _char, 'fontSize');
  }

  /**
   * measure a text line measuring all characters.
   * @param {Number} lineIndex line number
   */
  measureLine(lineIndex) {
    const lineInfo = this._measureLine(lineIndex);
    if (this.charSpacing !== 0) {
      lineInfo.width -= this._getWidthOfCharSpacing();
    }
    if (lineInfo.width < 0) {
      lineInfo.width = 0;
    }
    return lineInfo;
  }

  /**
   * measure every grapheme of a line, populating __charBounds
   * @param {Number} lineIndex
   * @return {Object} object.width total width of characters
   * @return {Object} object.numOfSpaces length of chars that match this._reSpacesAndTabs
   */
  _measureLine(lineIndex) {
    let width = 0,
      prevGrapheme,
      graphemeInfo;
    const reverse = this.pathSide === RIGHT,
      path = this.path,
      line = this._textLines[lineIndex],
      llength = line.length,
      lineBounds = new Array(llength);
    this.__charBounds[lineIndex] = lineBounds;
    for (let i = 0; i < llength; i++) {
      const grapheme = line[i];
      graphemeInfo = this._getGraphemeBox(grapheme, lineIndex, i, prevGrapheme);
      lineBounds[i] = graphemeInfo;
      width += graphemeInfo.kernedWidth;
      prevGrapheme = grapheme;
    }
    // this latest bound box represent the last character of the line
    // to simplify cursor handling in interactive mode.
    lineBounds[llength] = {
      left: graphemeInfo ? graphemeInfo.left + graphemeInfo.width : 0,
      width: 0,
      kernedWidth: 0,
      height: this.fontSize,
      deltaY: 0
    };
    if (path && path.segmentsInfo) {
      let positionInPath = 0;
      const totalPathLength = path.segmentsInfo[path.segmentsInfo.length - 1].length;
      switch (this.textAlign) {
        case LEFT:
          positionInPath = reverse ? totalPathLength - width : 0;
          break;
        case CENTER:
          positionInPath = (totalPathLength - width) / 2;
          break;
        case RIGHT:
          positionInPath = reverse ? 0 : totalPathLength - width;
          break;
        //todo - add support for justify
      }
      positionInPath += this.pathStartOffset * (reverse ? -1 : 1);
      for (let i = reverse ? llength - 1 : 0; reverse ? i >= 0 : i < llength; reverse ? i-- : i++) {
        graphemeInfo = lineBounds[i];
        if (positionInPath > totalPathLength) {
          positionInPath %= totalPathLength;
        } else if (positionInPath < 0) {
          positionInPath += totalPathLength;
        }
        // it would probably much faster to send all the grapheme position for a line
        // and calculate path position/angle at once.
        this._setGraphemeOnPath(positionInPath, graphemeInfo);
        positionInPath += graphemeInfo.kernedWidth;
      }
    }
    return {
      width: width,
      numOfSpaces: 0
    };
  }

  /**
   * Calculate the angle  and the left,top position of the char that follow a path.
   * It appends it to graphemeInfo to be reused later at rendering
   * @private
   * @param {Number} positionInPath to be measured
   * @param {GraphemeBBox} graphemeInfo current grapheme box information
   * @param {Object} startingPoint position of the point
   */
  _setGraphemeOnPath(positionInPath, graphemeInfo) {
    const centerPosition = positionInPath + graphemeInfo.kernedWidth / 2,
      path = this.path;

    // we are at currentPositionOnPath. we want to know what point on the path is.
    const info = getPointOnPath(path.path, centerPosition, path.segmentsInfo);
    graphemeInfo.renderLeft = info.x - path.pathOffset.x;
    graphemeInfo.renderTop = info.y - path.pathOffset.y;
    graphemeInfo.angle = info.angle + (this.pathSide === RIGHT ? Math.PI : 0);
  }

  /**
   *
   * @param {String} grapheme to be measured
   * @param {Number} lineIndex index of the line where the char is
   * @param {Number} charIndex position in the line
   * @param {String} [prevGrapheme] character preceding the one to be measured
   * @returns {GraphemeBBox} grapheme bbox
   */
  _getGraphemeBox(grapheme, lineIndex, charIndex, prevGrapheme, skipLeft) {
    const style = this.getCompleteStyleDeclaration(lineIndex, charIndex),
      prevStyle = prevGrapheme ? this.getCompleteStyleDeclaration(lineIndex, charIndex - 1) : {},
      info = this._measureChar(grapheme, style, prevGrapheme, prevStyle);
    let kernedWidth = info.kernedWidth,
      width = info.width,
      charSpacing;
    if (this.charSpacing !== 0) {
      charSpacing = this._getWidthOfCharSpacing();
      width += charSpacing;
      kernedWidth += charSpacing;
    }
    const box = {
      width,
      left: 0,
      height: style.fontSize,
      kernedWidth,
      deltaY: style.deltaY
    };
    if (charIndex > 0 && !skipLeft) {
      const previousBox = this.__charBounds[lineIndex][charIndex - 1];
      box.left = previousBox.left + previousBox.width + info.kernedWidth - info.width;
    }
    return box;
  }

  /**
   * Calculate height of line at 'lineIndex',
   * without the lineHeigth multiplication factor
   * @private
   * @param {Number} lineIndex index of line to calculate
   * @return {Number}
   */
  getHeightOfLineImpl(lineIndex) {
    const lh = this.__lineHeights;
    if (lh[lineIndex]) {
      return lh[lineIndex];
    }

    // char 0 is measured before the line cycle because it needs to char
    // emptylines
    let maxHeight = this.getHeightOfChar(lineIndex, 0);
    for (let i = 1, len = this._textLines[lineIndex].length; i < len; i++) {
      maxHeight = Math.max(this.getHeightOfChar(lineIndex, i), maxHeight);
    }
    return lh[lineIndex] = maxHeight * this._fontSizeMult;
  }

  /**
   * Calculate height of line at 'lineIndex'
   * @param {Number} lineIndex index of line to calculate
   * @return {Number}
   */
  getHeightOfLine(lineIndex) {
    return this.getHeightOfLineImpl(lineIndex) * this.lineHeight;
  }

  /**
   * Calculate text box height
   */
  calcTextHeight() {
    let height = 0;
    for (let i = 0, len = this._textLines.length; i < len; i++) {
      height += i === len - 1 ? this.getHeightOfLineImpl(i) : this.getHeightOfLine(i);
    }
    return height;
  }

  /**
   * @private
   * @return {Number} Left offset
   */
  _getLeftOffset() {
    return this.direction === LTR ? -this.width / 2 : this.width / 2;
  }

  /**
   * @private
   * @return {Number} Top offset
   */
  _getTopOffset() {
    return -this.height / 2;
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {String} method Method name ("fillText" or "strokeText")
   */
  _renderTextCommon(ctx, method) {
    ctx.save();
    let lineHeights = 0;
    const left = this._getLeftOffset(),
      top = this._getTopOffset();
    for (let i = 0, len = this._textLines.length; i < len; i++) {
      this._renderTextLine(method, ctx, this._textLines[i], left + this._getLineLeftOffset(i), top + lineHeights + this.getHeightOfLineImpl(i), i);
      lineHeights += this.getHeightOfLine(i);
    }
    ctx.restore();
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderTextFill(ctx) {
    if (!this.fill && !this.styleHas(FILL)) {
      return;
    }
    this._renderTextCommon(ctx, 'fillText');
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderTextStroke(ctx) {
    if ((!this.stroke || this.strokeWidth === 0) && this.isEmptyStyles()) {
      return;
    }
    if (this.shadow && !this.shadow.affectStroke) {
      this._removeShadow(ctx);
    }
    ctx.save();
    this._setLineDash(ctx, this.strokeDashArray);
    ctx.beginPath();
    this._renderTextCommon(ctx, 'strokeText');
    ctx.closePath();
    ctx.restore();
  }

  /**
   * @private
   * @param {String} method fillText or strokeText.
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {Array} line Content of the line, splitted in an array by grapheme
   * @param {Number} left
   * @param {Number} top
   * @param {Number} lineIndex
   */
  _renderChars(method, ctx, line, left, top, lineIndex) {
    const isJustify = this.textAlign.includes(JUSTIFY),
      path = this.path,
      shortCut = !isJustify && this.charSpacing === 0 && this.isEmptyStyles(lineIndex) && !path,
      isLtr = this.direction === LTR,
      sign = this.direction === LTR ? 1 : -1,
      // this was changed in the PR #7674
      // currentDirection = ctx.canvas.getAttribute('dir');
      currentDirection = ctx.direction;
    let actualStyle,
      nextStyle,
      charsToRender = '',
      charBox,
      boxWidth = 0,
      timeToRender,
      drawingLeft;
    ctx.save();
    if (currentDirection !== this.direction) {
      ctx.canvas.setAttribute('dir', isLtr ? LTR : RTL);
      ctx.direction = isLtr ? LTR : RTL;
      ctx.textAlign = isLtr ? LEFT : RIGHT;
    }
    top -= this.getHeightOfLineImpl(lineIndex) * this._fontSizeFraction;
    if (shortCut) {
      // render all the line in one pass without checking
      // drawingLeft = isLtr ? left : left - this.getLineWidth(lineIndex);
      this._renderChar(method, ctx, lineIndex, 0, line.join(''), left, top);
      ctx.restore();
      return;
    }
    for (let i = 0, len = line.length - 1; i <= len; i++) {
      timeToRender = i === len || this.charSpacing || path;
      charsToRender += line[i];
      charBox = this.__charBounds[lineIndex][i];
      if (boxWidth === 0) {
        left += sign * (charBox.kernedWidth - charBox.width);
        boxWidth += charBox.width;
      } else {
        boxWidth += charBox.kernedWidth;
      }
      if (isJustify && !timeToRender) {
        if (this._reSpaceAndTab.test(line[i])) {
          timeToRender = true;
        }
      }
      if (!timeToRender) {
        // if we have charSpacing, we render char by char
        actualStyle = actualStyle || this.getCompleteStyleDeclaration(lineIndex, i);
        nextStyle = this.getCompleteStyleDeclaration(lineIndex, i + 1);
        timeToRender = hasStyleChanged(actualStyle, nextStyle, false);
      }
      if (timeToRender) {
        if (path) {
          ctx.save();
          ctx.translate(charBox.renderLeft, charBox.renderTop);
          ctx.rotate(charBox.angle);
          this._renderChar(method, ctx, lineIndex, i, charsToRender, -boxWidth / 2, 0);
          ctx.restore();
        } else {
          drawingLeft = left;
          this._renderChar(method, ctx, lineIndex, i, charsToRender, drawingLeft, top);
        }
        charsToRender = '';
        actualStyle = nextStyle;
        left += sign * boxWidth;
        boxWidth = 0;
      }
    }
    ctx.restore();
  }

  /**
   * This function try to patch the missing gradientTransform on canvas gradients.
   * transforming a context to transform the gradient, is going to transform the stroke too.
   * we want to transform the gradient but not the stroke operation, so we create
   * a transformed gradient on a pattern and then we use the pattern instead of the gradient.
   * this method has drawbacks: is slow, is in low resolution, needs a patch for when the size
   * is limited.
   * @private
   * @param {TFiller} filler a fabric gradient instance
   * @return {CanvasPattern} a pattern to use as fill/stroke style
   */
  _applyPatternGradientTransformText(filler) {
    // TODO: verify compatibility with strokeUniform
    const width = this.width + this.strokeWidth,
      height = this.height + this.strokeWidth,
      pCanvas = createCanvasElementFor({
        width,
        height
      }),
      pCtx = pCanvas.getContext('2d');
    pCanvas.width = width;
    pCanvas.height = height;
    pCtx.beginPath();
    pCtx.moveTo(0, 0);
    pCtx.lineTo(width, 0);
    pCtx.lineTo(width, height);
    pCtx.lineTo(0, height);
    pCtx.closePath();
    pCtx.translate(width / 2, height / 2);
    pCtx.fillStyle = filler.toLive(pCtx);
    this._applyPatternGradientTransform(pCtx, filler);
    pCtx.fill();
    return pCtx.createPattern(pCanvas, 'no-repeat');
  }
  handleFiller(ctx, property, filler) {
    let offsetX, offsetY;
    if (isFiller(filler)) {
      if (filler.gradientUnits === 'percentage' || filler.gradientTransform || filler.patternTransform) {
        // need to transform gradient in a pattern.
        // this is a slow process. If you are hitting this codepath, and the object
        // is not using caching, you should consider switching it on.
        // we need a canvas as big as the current object caching canvas.
        offsetX = -this.width / 2;
        offsetY = -this.height / 2;
        ctx.translate(offsetX, offsetY);
        ctx[property] = this._applyPatternGradientTransformText(filler);
        return {
          offsetX,
          offsetY
        };
      } else {
        // is a simple gradient or pattern
        ctx[property] = filler.toLive(ctx);
        return this._applyPatternGradientTransform(ctx, filler);
      }
    } else {
      // is a color
      ctx[property] = filler;
    }
    return {
      offsetX: 0,
      offsetY: 0
    };
  }

  /**
   * This function prepare the canvas for a stroke style, and stroke and strokeWidth
   * need to be sent in as defined
   * @param {CanvasRenderingContext2D} ctx
   * @param {CompleteTextStyleDeclaration} style with stroke and strokeWidth defined
   * @returns
   */
  _setStrokeStyles(ctx, _ref) {
    let {
      stroke,
      strokeWidth
    } = _ref;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = this.strokeLineCap;
    ctx.lineDashOffset = this.strokeDashOffset;
    ctx.lineJoin = this.strokeLineJoin;
    ctx.miterLimit = this.strokeMiterLimit;
    return this.handleFiller(ctx, 'strokeStyle', stroke);
  }

  /**
   * This function prepare the canvas for a ill style, and fill
   * need to be sent in as defined
   * @param {CanvasRenderingContext2D} ctx
   * @param {CompleteTextStyleDeclaration} style with ill defined
   * @returns
   */
  _setFillStyles(ctx, _ref2) {
    let {
      fill
    } = _ref2;
    return this.handleFiller(ctx, 'fillStyle', fill);
  }

  /**
   * @private
   * @param {String} method
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @param {String} _char
   * @param {Number} left Left coordinate
   * @param {Number} top Top coordinate
   * @param {Number} lineHeight Height of the line
   */
  _renderChar(method, ctx, lineIndex, charIndex, _char, left, top) {
    const decl = this._getStyleDeclaration(lineIndex, charIndex),
      fullDecl = this.getCompleteStyleDeclaration(lineIndex, charIndex),
      shouldFill = method === 'fillText' && fullDecl.fill,
      shouldStroke = method === 'strokeText' && fullDecl.stroke && fullDecl.strokeWidth;
    if (!shouldStroke && !shouldFill) {
      return;
    }
    ctx.save();
    ctx.font = this._getFontDeclaration(fullDecl);
    if (decl.textBackgroundColor) {
      this._removeShadow(ctx);
    }
    if (decl.deltaY) {
      top += decl.deltaY;
    }
    if (shouldFill) {
      const fillOffsets = this._setFillStyles(ctx, fullDecl);
      ctx.fillText(_char, left - fillOffsets.offsetX, top - fillOffsets.offsetY);
    }
    if (shouldStroke) {
      const strokeOffsets = this._setStrokeStyles(ctx, fullDecl);
      ctx.strokeText(_char, left - strokeOffsets.offsetX, top - strokeOffsets.offsetY);
    }
    ctx.restore();
  }

  /**
   * Turns the character into a 'superior figure' (i.e. 'superscript')
   * @param {Number} start selection start
   * @param {Number} end selection end
   */
  setSuperscript(start, end) {
    this._setScript(start, end, this.superscript);
  }

  /**
   * Turns the character into an 'inferior figure' (i.e. 'subscript')
   * @param {Number} start selection start
   * @param {Number} end selection end
   */
  setSubscript(start, end) {
    this._setScript(start, end, this.subscript);
  }

  /**
   * Applies 'schema' at given position
   * @private
   * @param {Number} start selection start
   * @param {Number} end selection end
   * @param {Number} schema
   */
  _setScript(start, end, schema) {
    const loc = this.get2DCursorLocation(start, true),
      fontSize = this.getValueOfPropertyAt(loc.lineIndex, loc.charIndex, 'fontSize'),
      dy = this.getValueOfPropertyAt(loc.lineIndex, loc.charIndex, 'deltaY'),
      style = {
        fontSize: fontSize * schema.size,
        deltaY: dy + fontSize * schema.baseline
      };
    this.setSelectionStyles(style, start, end);
  }

  /**
   * @private
   * @param {Number} lineIndex index text line
   * @return {Number} Line left offset
   */
  _getLineLeftOffset(lineIndex) {
    const lineWidth = this.getLineWidth(lineIndex),
      lineDiff = this.width - lineWidth,
      textAlign = this.textAlign,
      direction = this.direction,
      isEndOfWrapping = this.isEndOfWrapping(lineIndex);
    let leftOffset = 0;
    if (textAlign === JUSTIFY || textAlign === JUSTIFY_CENTER && !isEndOfWrapping || textAlign === JUSTIFY_RIGHT && !isEndOfWrapping || textAlign === JUSTIFY_LEFT && !isEndOfWrapping) {
      return 0;
    }
    if (textAlign === CENTER) {
      leftOffset = lineDiff / 2;
    }
    if (textAlign === RIGHT) {
      leftOffset = lineDiff;
    }
    if (textAlign === JUSTIFY_CENTER) {
      leftOffset = lineDiff / 2;
    }
    if (textAlign === JUSTIFY_RIGHT) {
      leftOffset = lineDiff;
    }
    if (direction === RTL) {
      if (textAlign === RIGHT || textAlign === JUSTIFY_RIGHT) {
        leftOffset = 0;
      } else if (textAlign === LEFT || textAlign === JUSTIFY_LEFT) {
        leftOffset = -lineDiff;
      } else if (textAlign === CENTER || textAlign === JUSTIFY_CENTER) {
        leftOffset = -lineDiff / 2;
      }
    }
    return leftOffset;
  }

  /**
   * @private
   */
  _clearCache() {
    this._forceClearCache = false;
    this.__lineWidths = [];
    this.__lineHeights = [];
    this.__charBounds = [];
  }

  /**
   * Measure a single line given its index. Used to calculate the initial
   * text bounding box. The values are calculated and stored in __lineWidths cache.
   * @private
   * @param {Number} lineIndex line number
   * @return {Number} Line width
   */
  getLineWidth(lineIndex) {
    if (this.__lineWidths[lineIndex] !== undefined) {
      return this.__lineWidths[lineIndex];
    }
    const {
      width
    } = this.measureLine(lineIndex);
    this.__lineWidths[lineIndex] = width;
    return width;
  }
  _getWidthOfCharSpacing() {
    if (this.charSpacing !== 0) {
      return this.fontSize * this.charSpacing / 1000;
    }
    return 0;
  }

  /**
   * Retrieves the value of property at given character position
   * @param {Number} lineIndex the line number
   * @param {Number} charIndex the character number
   * @param {String} property the property name
   * @returns the value of 'property'
   */
  getValueOfPropertyAt(lineIndex, charIndex, property) {
    var _charStyle$property;
    const charStyle = this._getStyleDeclaration(lineIndex, charIndex);
    return (_charStyle$property = charStyle[property]) !== null && _charStyle$property !== void 0 ? _charStyle$property : this[property];
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderTextDecoration(ctx, type) {
    if (!this[type] && !this.styleHas(type)) {
      return;
    }
    let topOffset = this._getTopOffset();
    const leftOffset = this._getLeftOffset(),
      path = this.path,
      charSpacing = this._getWidthOfCharSpacing(),
      offsetAligner = type === 'linethrough' ? 0.5 : type === 'overline' ? 1 : 0,
      offsetY = this.offsets[type];
    for (let i = 0, len = this._textLines.length; i < len; i++) {
      const heightOfLine = this.getHeightOfLine(i);
      if (!this[type] && !this.styleHas(type, i)) {
        topOffset += heightOfLine;
        continue;
      }
      const line = this._textLines[i];
      const maxHeight = heightOfLine / this.lineHeight;
      const lineLeftOffset = this._getLineLeftOffset(i);
      let boxStart = 0;
      let boxWidth = 0;
      let lastDecoration = this.getValueOfPropertyAt(i, 0, type);
      let lastFill = this.getValueOfPropertyAt(i, 0, FILL);
      let lastTickness = this.getValueOfPropertyAt(i, 0, TEXT_DECORATION_THICKNESS);
      let currentDecoration = lastDecoration;
      let currentFill = lastFill;
      let currentTickness = lastTickness;
      const top = topOffset + maxHeight * (1 - this._fontSizeFraction);
      let size = this.getHeightOfChar(i, 0);
      let dy = this.getValueOfPropertyAt(i, 0, 'deltaY');
      for (let j = 0, jlen = line.length; j < jlen; j++) {
        const charBox = this.__charBounds[i][j];
        currentDecoration = this.getValueOfPropertyAt(i, j, type);
        currentFill = this.getValueOfPropertyAt(i, j, FILL);
        currentTickness = this.getValueOfPropertyAt(i, j, TEXT_DECORATION_THICKNESS);
        const currentSize = this.getHeightOfChar(i, j);
        const currentDy = this.getValueOfPropertyAt(i, j, 'deltaY');
        if (path && currentDecoration && currentFill) {
          const finalTickness = this.fontSize * currentTickness / 1000;
          ctx.save();
          // bug? verify lastFill is a valid fill here.
          ctx.fillStyle = lastFill;
          ctx.translate(charBox.renderLeft, charBox.renderTop);
          ctx.rotate(charBox.angle);
          ctx.fillRect(-charBox.kernedWidth / 2, offsetY * currentSize + currentDy - offsetAligner * finalTickness, charBox.kernedWidth, finalTickness);
          ctx.restore();
        } else if ((currentDecoration !== lastDecoration || currentFill !== lastFill || currentSize !== size || currentTickness !== lastTickness || currentDy !== dy) && boxWidth > 0) {
          const finalTickness = this.fontSize * lastTickness / 1000;
          let drawStart = leftOffset + lineLeftOffset + boxStart;
          if (this.direction === RTL) {
            drawStart = this.width - drawStart - boxWidth;
          }
          if (lastDecoration && lastFill && lastTickness) {
            // bug? verify lastFill is a valid fill here.
            ctx.fillStyle = lastFill;
            ctx.fillRect(drawStart, top + offsetY * size + dy - offsetAligner * finalTickness, boxWidth, finalTickness);
          }
          boxStart = charBox.left;
          boxWidth = charBox.width;
          lastDecoration = currentDecoration;
          lastTickness = currentTickness;
          lastFill = currentFill;
          size = currentSize;
          dy = currentDy;
        } else {
          boxWidth += charBox.kernedWidth;
        }
      }
      let drawStart = leftOffset + lineLeftOffset + boxStart;
      if (this.direction === RTL) {
        drawStart = this.width - drawStart - boxWidth;
      }
      ctx.fillStyle = currentFill;
      const finalTickness = this.fontSize * currentTickness / 1000;
      currentDecoration && currentFill && currentTickness && ctx.fillRect(drawStart, top + offsetY * size + dy - offsetAligner * finalTickness, boxWidth - charSpacing, finalTickness);
      topOffset += heightOfLine;
    }
    // if there is text background color no
    // other shadows should be casted
    this._removeShadow(ctx);
  }

  /**
   * return font declaration string for canvas context
   * @param {Object} [styleObject] object
   * @returns {String} font declaration formatted for canvas context.
   */
  _getFontDeclaration() {
    let {
      fontFamily = this.fontFamily,
      fontStyle = this.fontStyle,
      fontWeight = this.fontWeight,
      fontSize = this.fontSize
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let forMeasuring = arguments.length > 1 ? arguments[1] : undefined;
    const parsedFontFamily = fontFamily.includes("'") || fontFamily.includes('"') || fontFamily.includes(',') || FabricText.genericFonts.includes(fontFamily.toLowerCase()) ? fontFamily : `"${fontFamily}"`;
    return [fontStyle, fontWeight, `${forMeasuring ? this.CACHE_FONT_SIZE : fontSize}px`, parsedFontFamily].join(' ');
  }

  /**
   * Renders text instance on a specified context
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  render(ctx) {
    if (!this.visible) {
      return;
    }
    if (this.canvas && this.canvas.skipOffscreen && !this.group && !this.isOnScreen()) {
      return;
    }
    if (this._forceClearCache) {
      this.initDimensions();
    }
    super.render(ctx);
  }

  /**
   * Override this method to customize grapheme splitting
   * @todo the util `graphemeSplit` needs to be injectable in some way.
   * is more comfortable to inject the correct util rather than having to override text
   * in the middle of the prototype chain
   * @param {string} value
   * @returns {string[]} array of graphemes
   */
  graphemeSplit(value) {
    return graphemeSplit(value);
  }

  /**
   * Returns the text as an array of lines.
   * @param {String} text text to split
   * @returns  Lines in the text
   */
  _splitTextIntoLines(text) {
    const lines = text.split(this._reNewline),
      newLines = new Array(lines.length),
      newLine = ['\n'];
    let newText = [];
    for (let i = 0; i < lines.length; i++) {
      newLines[i] = this.graphemeSplit(lines[i]);
      newText = newText.concat(newLines[i], newLine);
    }
    newText.pop();
    return {
      _unwrappedLines: newLines,
      lines: lines,
      graphemeText: newText,
      graphemeLines: newLines
    };
  }

  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} Object representation of an instance
   */
  toObject() {
    let propertiesToInclude = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return {
      ...super.toObject([...additionalProps, ...propertiesToInclude]),
      styles: stylesToArray(this.styles, this.text),
      ...(this.path ? {
        path: this.path.toObject()
      } : {})
    };
  }
  set(key, value) {
    const {
      textLayoutProperties
    } = this.constructor;
    super.set(key, value);
    let needsDims = false;
    let isAddingPath = false;
    if (typeof key === 'object') {
      for (const _key in key) {
        if (_key === 'path') {
          this.setPathInfo();
        }
        needsDims = needsDims || textLayoutProperties.includes(_key);
        isAddingPath = isAddingPath || _key === 'path';
      }
    } else {
      needsDims = textLayoutProperties.includes(key);
      isAddingPath = key === 'path';
    }
    if (isAddingPath) {
      this.setPathInfo();
    }
    if (needsDims && this.initialized) {
      this.initDimensions();
      this.setCoords();
    }
    return this;
  }

  /**
   * Returns complexity of an instance
   * @return {Number} complexity
   */
  complexity() {
    return 1;
  }

  /**
   * List of generic font families
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#generic-name
   */

  /**
   * Returns FabricText instance from an SVG element (<b>not yet implemented</b>)
   * @param {HTMLElement} element Element to parse
   * @param {Object} [options] Options object
   */
  static async fromElement(element, options, cssRules) {
    const parsedAttributes = parseAttributes(element, FabricText.ATTRIBUTE_NAMES, cssRules);
    const {
      textAnchor = LEFT,
      textDecoration = '',
      dx = 0,
      dy = 0,
      top = 0,
      left = 0,
      fontSize = DEFAULT_SVG_FONT_SIZE,
      strokeWidth = 1,
      ...restOfOptions
    } = {
      ...options,
      ...parsedAttributes
    };
    const textContent = normalizeWs(element.textContent || '').trim();

    // this code here is probably the usual issue for SVG center find
    // this can later looked at again and probably removed.

    const text = new this(textContent, {
        left: left + dx,
        top: top + dy,
        underline: textDecoration.includes('underline'),
        overline: textDecoration.includes('overline'),
        linethrough: textDecoration.includes('line-through'),
        // we initialize this as 0
        strokeWidth: 0,
        fontSize,
        ...restOfOptions
      }),
      textHeightScaleFactor = text.getScaledHeight() / text.height,
      lineHeightDiff = (text.height + text.strokeWidth) * text.lineHeight - text.height,
      scaledDiff = lineHeightDiff * textHeightScaleFactor,
      textHeight = text.getScaledHeight() + scaledDiff;
    let offX = 0;
    /*
      Adjust positioning:
        x/y attributes in SVG correspond to the bottom-left corner of text bounding box
        fabric output by default at top, left.
    */
    if (textAnchor === CENTER) {
      offX = text.getScaledWidth() / 2;
    }
    if (textAnchor === RIGHT) {
      offX = text.getScaledWidth();
    }
    text.set({
      left: text.left - offX,
      top: text.top - (textHeight - text.fontSize * (0.07 + text._fontSizeFraction)) / text.lineHeight,
      strokeWidth
    });
    return text;
  }

  /* _FROM_SVG_END_ */

  /**
   * Returns FabricText instance from an object representation
   * @param {Object} object plain js Object to create an instance from
   * @returns {Promise<FabricText>}
   */
  static fromObject(object) {
    return this._fromObject({
      ...object,
      styles: stylesFromArray(object.styles || {}, object.text)
    }, {
      extraParam: 'text'
    });
  }
}
/**
 * Properties that requires a text layout recalculation when changed
 * @type string[]
 * @protected
 */
_defineProperty(FabricText, "textLayoutProperties", textLayoutProperties);
_defineProperty(FabricText, "cacheProperties", [...cacheProperties, ...additionalProps]);
_defineProperty(FabricText, "ownDefaults", textDefaultValues);
_defineProperty(FabricText, "type", 'Text');
_defineProperty(FabricText, "genericFonts", ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-serif', 'ui-sans-serif', 'ui-monospace', 'ui-rounded', 'math', 'emoji', 'fangsong']);
/* _FROM_SVG_START_ */
/**
 * List of attribute names to account for when parsing SVG element (used by {@link FabricText.fromElement})
 * @see: http://www.w3.org/TR/SVG/text.html#TextElement
 */
_defineProperty(FabricText, "ATTRIBUTE_NAMES", SHARED_ATTRIBUTES.concat('x', 'y', 'dx', 'dy', 'font-family', 'font-style', 'font-weight', 'font-size', 'letter-spacing', 'text-decoration', 'text-anchor'));
applyMixins(FabricText, [TextSVGExportMixin]);
classRegistry.setClass(FabricText);
classRegistry.setSVGClass(FabricText);

/**
 * #### Dragging IText/Textbox Lifecycle
 * - {@link start} is called from `mousedown` {@link IText#_mouseDownHandler} and determines if dragging should start by testing {@link isPointerOverSelection}
 * - if true `mousedown` {@link IText#_mouseDownHandler} is blocked to keep selection
 * - if the pointer moves, canvas fires numerous mousemove {@link Canvas#_onMouseMove} that we make sure **aren't** prevented ({@link IText#shouldStartDragging}) in order for the window to start a drag session
 * - once/if the session starts canvas calls {@link onDragStart} on the active object to determine if dragging should occur
 * - canvas fires relevant drag events that are handled by the handlers defined in this scope
 * - {@link end} is called from `mouseup` {@link IText#mouseUpHandler}, blocking IText default click behavior
 * - in case the drag session didn't occur, {@link end} handles a click, since logic to do so was blocked during `mousedown`
 */
class DraggableTextDelegate {
  constructor(target) {
    _defineProperty(this, "target", void 0);
    _defineProperty(this, "__mouseDownInPlace", false);
    _defineProperty(this, "__dragStartFired", false);
    _defineProperty(this, "__isDraggingOver", false);
    _defineProperty(this, "__dragStartSelection", void 0);
    _defineProperty(this, "__dragImageDisposer", void 0);
    _defineProperty(this, "_dispose", void 0);
    this.target = target;
    const disposers = [this.target.on('dragenter', this.dragEnterHandler.bind(this)), this.target.on('dragover', this.dragOverHandler.bind(this)), this.target.on('dragleave', this.dragLeaveHandler.bind(this)), this.target.on('dragend', this.dragEndHandler.bind(this)), this.target.on('drop', this.dropHandler.bind(this))];
    this._dispose = () => {
      disposers.forEach(d => d());
      this._dispose = undefined;
    };
  }
  isPointerOverSelection(e) {
    const target = this.target;
    const newSelection = target.getSelectionStartFromPointer(e);
    return target.isEditing && newSelection >= target.selectionStart && newSelection <= target.selectionEnd && target.selectionStart < target.selectionEnd;
  }

  /**
   * @public override this method to disable dragging and default to mousedown logic
   */
  start(e) {
    return this.__mouseDownInPlace = this.isPointerOverSelection(e);
  }

  /**
   * @public override this method to disable dragging without discarding selection
   */
  isActive() {
    return this.__mouseDownInPlace;
  }

  /**
   * Ends interaction and sets cursor in case of a click
   * @returns true if was active
   */
  end(e) {
    const active = this.isActive();
    if (active && !this.__dragStartFired) {
      // mousedown has been blocked since `active` is true => cursor has not been set.
      // `__dragStartFired` is false => dragging didn't occur, pointer didn't move and is over selection.
      // meaning this is actually a click, `active` is a false positive.
      this.target.setCursorByClick(e);
      this.target.initDelayedCursor(true);
    }
    this.__mouseDownInPlace = false;
    this.__dragStartFired = false;
    this.__isDraggingOver = false;
    return active;
  }
  getDragStartSelection() {
    return this.__dragStartSelection;
  }

  /**
   * Override to customize the drag image
   * https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/setDragImage
   */
  setDragImage(e, _ref) {
    var _e$dataTransfer;
    let {
      selectionStart,
      selectionEnd
    } = _ref;
    const target = this.target;
    const canvas = target.canvas;
    const flipFactor = new Point(target.flipX ? -1 : 1, target.flipY ? -1 : 1);
    const boundaries = target._getCursorBoundaries(selectionStart);
    const selectionPosition = new Point(boundaries.left + boundaries.leftOffset, boundaries.top + boundaries.topOffset).multiply(flipFactor);
    const pos = selectionPosition.transform(target.calcTransformMatrix());
    const pointer = canvas.getScenePoint(e);
    const diff = pointer.subtract(pos);
    const retinaScaling = target.getCanvasRetinaScaling();
    const bbox = target.getBoundingRect();
    const correction = pos.subtract(new Point(bbox.left, bbox.top));
    const vpt = canvas.viewportTransform;
    const offset = correction.add(diff).transform(vpt, true);
    //  prepare instance for drag image snapshot by making all non selected text invisible
    const bgc = target.backgroundColor;
    const styles = cloneStyles(target.styles);
    target.backgroundColor = '';
    const styleOverride = {
      stroke: 'transparent',
      fill: 'transparent',
      textBackgroundColor: 'transparent'
    };
    target.setSelectionStyles(styleOverride, 0, selectionStart);
    target.setSelectionStyles(styleOverride, selectionEnd, target.text.length);
    target.dirty = true;
    const dragImage = target.toCanvasElement({
      enableRetinaScaling: canvas.enableRetinaScaling,
      viewportTransform: true
    });
    // restore values
    target.backgroundColor = bgc;
    target.styles = styles;
    target.dirty = true;
    //  position drag image offscreen
    setStyle(dragImage, {
      position: 'fixed',
      left: `${-dragImage.width}px`,
      border: NONE,
      width: `${dragImage.width / retinaScaling}px`,
      height: `${dragImage.height / retinaScaling}px`
    });
    this.__dragImageDisposer && this.__dragImageDisposer();
    this.__dragImageDisposer = () => {
      dragImage.remove();
    };
    getDocumentFromElement(e.target || this.target.hiddenTextarea).body.appendChild(dragImage);
    (_e$dataTransfer = e.dataTransfer) === null || _e$dataTransfer === void 0 || _e$dataTransfer.setDragImage(dragImage, offset.x, offset.y);
  }

  /**
   * @returns {boolean} determines whether {@link target} should/shouldn't become a drag source
   */
  onDragStart(e) {
    this.__dragStartFired = true;
    const target = this.target;
    const active = this.isActive();
    if (active && e.dataTransfer) {
      const selection = this.__dragStartSelection = {
        selectionStart: target.selectionStart,
        selectionEnd: target.selectionEnd
      };
      const value = target._text.slice(selection.selectionStart, selection.selectionEnd).join('');
      const data = {
        text: target.text,
        value,
        ...selection
      };
      e.dataTransfer.setData('text/plain', value);
      e.dataTransfer.setData('application/fabric', JSON.stringify({
        value: value,
        styles: target.getSelectionStyles(selection.selectionStart, selection.selectionEnd, true)
      }));
      e.dataTransfer.effectAllowed = 'copyMove';
      this.setDragImage(e, data);
    }
    target.abortCursorAnimation();
    return active;
  }

  /**
   * use {@link targetCanDrop} to respect overriding
   * @returns {boolean} determines whether {@link target} should/shouldn't become a drop target
   */
  canDrop(e) {
    if (this.target.editable && !this.target.getActiveControl() && !e.defaultPrevented) {
      if (this.isActive() && this.__dragStartSelection) {
        //  drag source trying to drop over itself
        //  allow dropping only outside of drag start selection
        const index = this.target.getSelectionStartFromPointer(e);
        const dragStartSelection = this.__dragStartSelection;
        return index < dragStartSelection.selectionStart || index > dragStartSelection.selectionEnd;
      }
      return true;
    }
    return false;
  }

  /**
   * in order to respect overriding {@link IText#canDrop} we call that instead of calling {@link canDrop} directly
   */
  targetCanDrop(e) {
    return this.target.canDrop(e);
  }
  dragEnterHandler(_ref2) {
    let {
      e
    } = _ref2;
    const canDrop = this.targetCanDrop(e);
    if (!this.__isDraggingOver && canDrop) {
      this.__isDraggingOver = true;
    }
  }
  dragOverHandler(ev) {
    const {
      e
    } = ev;
    const canDrop = this.targetCanDrop(e);
    if (!this.__isDraggingOver && canDrop) {
      this.__isDraggingOver = true;
    } else if (this.__isDraggingOver && !canDrop) {
      //  drop state has changed
      this.__isDraggingOver = false;
    }
    if (this.__isDraggingOver) {
      //  can be dropped, inform browser
      e.preventDefault();
      //  inform event subscribers
      ev.canDrop = true;
      ev.dropTarget = this.target;
    }
  }
  dragLeaveHandler() {
    if (this.__isDraggingOver || this.isActive()) {
      this.__isDraggingOver = false;
    }
  }

  /**
   * Override the `text/plain | application/fabric` types of {@link DragEvent#dataTransfer}
   * in order to change the drop value or to customize styling respectively, by listening to the `drop:before` event
   * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#performing_a_drop
   */
  dropHandler(ev) {
    var _e$dataTransfer2;
    const {
      e
    } = ev;
    const didDrop = e.defaultPrevented;
    this.__isDraggingOver = false;
    // inform browser that the drop has been accepted
    e.preventDefault();
    let insert = (_e$dataTransfer2 = e.dataTransfer) === null || _e$dataTransfer2 === void 0 ? void 0 : _e$dataTransfer2.getData('text/plain');
    if (insert && !didDrop) {
      const target = this.target;
      const canvas = target.canvas;
      let insertAt = target.getSelectionStartFromPointer(e);
      const {
        styles
      } = e.dataTransfer.types.includes('application/fabric') ? JSON.parse(e.dataTransfer.getData('application/fabric')) : {};
      const trailing = insert[Math.max(0, insert.length - 1)];
      const selectionStartOffset = 0;
      //  drag and drop in same instance
      if (this.__dragStartSelection) {
        const selectionStart = this.__dragStartSelection.selectionStart;
        const selectionEnd = this.__dragStartSelection.selectionEnd;
        if (insertAt > selectionStart && insertAt <= selectionEnd) {
          insertAt = selectionStart;
        } else if (insertAt > selectionEnd) {
          insertAt -= selectionEnd - selectionStart;
        }
        target.removeChars(selectionStart, selectionEnd);
        // prevent `dragend` from handling event
        delete this.__dragStartSelection;
      }
      //  remove redundant line break
      if (target._reNewline.test(trailing) && (target._reNewline.test(target._text[insertAt]) || insertAt === target._text.length)) {
        insert = insert.trimEnd();
      }
      //  inform subscribers
      ev.didDrop = true;
      ev.dropTarget = target;
      //  finalize
      target.insertChars(insert, styles, insertAt);
      // can this part be moved in an outside event? andrea to check.
      canvas.setActiveObject(target);
      target.enterEditing(e);
      target.selectionStart = Math.min(insertAt + selectionStartOffset, target._text.length);
      target.selectionEnd = Math.min(target.selectionStart + insert.length, target._text.length);
      target.hiddenTextarea.value = target.text;
      target._updateTextarea();
      target.hiddenTextarea.focus();
      target.fire(CHANGED, {
        index: insertAt + selectionStartOffset,
        action: 'drop'
      });
      canvas.fire('text:changed', {
        target
      });
      canvas.contextTopDirty = true;
      canvas.requestRenderAll();
    }
  }

  /**
   * fired only on the drag source after drop (if occurred)
   * handle changes to the drag source in case of a drop on another object or a cancellation
   * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#finishing_a_drag
   */
  dragEndHandler(_ref3) {
    let {
      e
    } = _ref3;
    if (this.isActive() && this.__dragStartFired) {
      //  once the drop event finishes we check if we need to change the drag source
      //  if the drag source received the drop we bail out since the drop handler has already handled logic
      if (this.__dragStartSelection) {
        var _e$dataTransfer3;
        const target = this.target;
        const canvas = this.target.canvas;
        const {
          selectionStart,
          selectionEnd
        } = this.__dragStartSelection;
        const dropEffect = ((_e$dataTransfer3 = e.dataTransfer) === null || _e$dataTransfer3 === void 0 ? void 0 : _e$dataTransfer3.dropEffect) || NONE;
        if (dropEffect === NONE) {
          // pointer is back over selection
          target.selectionStart = selectionStart;
          target.selectionEnd = selectionEnd;
          target._updateTextarea();
          target.hiddenTextarea.focus();
        } else {
          target.clearContextTop();
          if (dropEffect === 'move') {
            target.removeChars(selectionStart, selectionEnd);
            target.selectionStart = target.selectionEnd = selectionStart;
            target.hiddenTextarea && (target.hiddenTextarea.value = target.text);
            target._updateTextarea();
            target.fire(CHANGED, {
              index: selectionStart,
              action: 'dragend'
            });
            canvas.fire('text:changed', {
              target
            });
            canvas.requestRenderAll();
          }
          target.exitEditing();
        }
      }
    }
    this.__dragImageDisposer && this.__dragImageDisposer();
    delete this.__dragImageDisposer;
    delete this.__dragStartSelection;
    this.__isDraggingOver = false;
  }
  dispose() {
    this._dispose && this._dispose();
  }
}

/**
 *  extend this regex to support non english languages
 *
 *  - ` `      Matches a SPACE character (char code 32).
 *  - `\n`     Matches a LINE FEED character (char code 10).
 *  - `\.`     Matches a "." character (char code 46).
 *  - `,`      Matches a "," character (char code 44).
 *  - `;`      Matches a ";" character (char code 59).
 *  - `!`      Matches a "!" character (char code 33).
 *  - `\?`     Matches a "?" character (char code 63).
 *  - `\-`     Matches a "-" character (char code 45).
 */
// eslint-disable-next-line no-useless-escape
const reNonWord = /[ \n\.,;!\?\-]/;
class ITextBehavior extends FabricText {
  constructor() {
    super(...arguments);
    /**
     * Helps determining when the text is in composition, so that the cursor
     * rendering is altered.
     */
    _defineProperty(this, "_currentCursorOpacity", 1);
  }
  /**
   * Keeps track if the IText object was selected before the actual click.
   * This because we want to delay enter editing by a click.
   */
  /**
   * Initializes all the interactive behavior of IText
   */
  initBehavior() {
    this._tick = this._tick.bind(this);
    this._onTickComplete = this._onTickComplete.bind(this);
    this.updateSelectionOnMouseMove = this.updateSelectionOnMouseMove.bind(this);
  }
  onDeselect(options) {
    this.isEditing && this.exitEditing();
    this.selected = false;
    return super.onDeselect(options);
  }

  /**
   * @private
   */
  _animateCursor(_ref) {
    let {
      toValue,
      duration,
      delay,
      onComplete
    } = _ref;
    return animate({
      startValue: this._currentCursorOpacity,
      endValue: toValue,
      duration,
      delay,
      onComplete,
      abort: () => !this.canvas ||
      // we do not want to animate a selection, only cursor
      this.selectionStart !== this.selectionEnd,
      onChange: value => {
        this._currentCursorOpacity = value;
        this.renderCursorOrSelection();
      }
    });
  }

  /**
   * changes the cursor from visible to invisible
   */
  _tick(delay) {
    this._currentTickState = this._animateCursor({
      toValue: 0,
      duration: this.cursorDuration / 2,
      delay: Math.max(delay || 0, 100),
      onComplete: this._onTickComplete
    });
  }

  /**
   * Changes the cursor from invisible to visible
   */
  _onTickComplete() {
    var _this$_currentTickCom;
    (_this$_currentTickCom = this._currentTickCompleteState) === null || _this$_currentTickCom === void 0 || _this$_currentTickCom.abort();
    this._currentTickCompleteState = this._animateCursor({
      toValue: 1,
      duration: this.cursorDuration,
      onComplete: this._tick
    });
  }

  /**
   * Initializes delayed cursor
   */
  initDelayedCursor(restart) {
    this.abortCursorAnimation();
    this._tick(restart ? 0 : this.cursorDelay);
  }

  /**
   * Aborts cursor animation, clears all timeouts and clear textarea context if necessary
   */
  abortCursorAnimation() {
    let shouldClear = false;
    [this._currentTickState, this._currentTickCompleteState].forEach(cursorAnimation => {
      if (cursorAnimation && !cursorAnimation.isDone()) {
        shouldClear = true;
        cursorAnimation.abort();
      }
    });
    this._currentCursorOpacity = 1;

    //  make sure we clear context even if instance is not editing
    if (shouldClear) {
      this.clearContextTop();
    }
  }

  /**
   * Restart tue cursor animation if either is in complete state ( between animations )
   * or if it never started before
   */
  restartCursorIfNeeded() {
    if ([this._currentTickState, this._currentTickCompleteState].some(cursorAnimation => !cursorAnimation || cursorAnimation.isDone())) {
      this.initDelayedCursor();
    }
  }

  /**
   * Selects entire text
   */
  selectAll() {
    this.selectionStart = 0;
    this.selectionEnd = this._text.length;
    this._fireSelectionChanged();
    this._updateTextarea();
    return this;
  }

  /**
   * Selects entire text and updates the visual state
   */
  cmdAll() {
    this.selectAll();
    this.renderCursorOrSelection();
  }

  /**
   * Returns selected text
   * @return {String}
   */
  getSelectedText() {
    return this._text.slice(this.selectionStart, this.selectionEnd).join('');
  }

  /**
   * Find new selection index representing start of current word according to current selection index
   * @param {Number} startFrom Current selection index
   * @return {Number} New selection index
   */
  findWordBoundaryLeft(startFrom) {
    let offset = 0,
      index = startFrom - 1;

    // remove space before cursor first
    if (this._reSpace.test(this._text[index])) {
      while (this._reSpace.test(this._text[index])) {
        offset++;
        index--;
      }
    }
    while (/\S/.test(this._text[index]) && index > -1) {
      offset++;
      index--;
    }
    return startFrom - offset;
  }

  /**
   * Find new selection index representing end of current word according to current selection index
   * @param {Number} startFrom Current selection index
   * @return {Number} New selection index
   */
  findWordBoundaryRight(startFrom) {
    let offset = 0,
      index = startFrom;

    // remove space after cursor first
    if (this._reSpace.test(this._text[index])) {
      while (this._reSpace.test(this._text[index])) {
        offset++;
        index++;
      }
    }
    while (/\S/.test(this._text[index]) && index < this._text.length) {
      offset++;
      index++;
    }
    return startFrom + offset;
  }

  /**
   * Find new selection index representing start of current line according to current selection index
   * @param {Number} startFrom Current selection index
   * @return {Number} New selection index
   */
  findLineBoundaryLeft(startFrom) {
    let offset = 0,
      index = startFrom - 1;
    while (!/\n/.test(this._text[index]) && index > -1) {
      offset++;
      index--;
    }
    return startFrom - offset;
  }

  /**
   * Find new selection index representing end of current line according to current selection index
   * @param {Number} startFrom Current selection index
   * @return {Number} New selection index
   */
  findLineBoundaryRight(startFrom) {
    let offset = 0,
      index = startFrom;
    while (!/\n/.test(this._text[index]) && index < this._text.length) {
      offset++;
      index++;
    }
    return startFrom + offset;
  }

  /**
   * Finds index corresponding to beginning or end of a word
   * @param {Number} selectionStart Index of a character
   * @param {Number} direction 1 or -1
   * @return {Number} Index of the beginning or end of a word
   */
  searchWordBoundary(selectionStart, direction) {
    const text = this._text;
    // if we land on a space we move the cursor backwards
    // if we are searching boundary end we move the cursor backwards ONLY if we don't land on a line break
    let index = selectionStart > 0 && this._reSpace.test(text[selectionStart]) && (direction === -1 || !reNewline.test(text[selectionStart - 1])) ? selectionStart - 1 : selectionStart,
      _char = text[index];
    while (index > 0 && index < text.length && !reNonWord.test(_char)) {
      index += direction;
      _char = text[index];
    }
    if (direction === -1 && reNonWord.test(_char)) {
      index++;
    }
    return index;
  }

  /**
   * Selects the word that contains the char at index selectionStart
   * @param {Number} selectionStart Index of a character
   */
  selectWord(selectionStart) {
    selectionStart = selectionStart !== null && selectionStart !== void 0 ? selectionStart : this.selectionStart;
    // search backwards
    const newSelectionStart = this.searchWordBoundary(selectionStart, -1),
      // search forward
      newSelectionEnd = Math.max(newSelectionStart, this.searchWordBoundary(selectionStart, 1));
    this.selectionStart = newSelectionStart;
    this.selectionEnd = newSelectionEnd;
    this._fireSelectionChanged();
    this._updateTextarea();
    // remove next major, for now it renders twice :(
    this.renderCursorOrSelection();
  }

  /**
   * Selects the line that contains selectionStart
   * @param {Number} selectionStart Index of a character
   */
  selectLine(selectionStart) {
    selectionStart = selectionStart !== null && selectionStart !== void 0 ? selectionStart : this.selectionStart;
    const newSelectionStart = this.findLineBoundaryLeft(selectionStart),
      newSelectionEnd = this.findLineBoundaryRight(selectionStart);
    this.selectionStart = newSelectionStart;
    this.selectionEnd = newSelectionEnd;
    this._fireSelectionChanged();
    this._updateTextarea();
  }

  /**
   * Enters editing state
   */
  enterEditing(e) {
    if (this.isEditing || !this.editable) {
      return;
    }
    this.enterEditingImpl();
    this.fire('editing:entered', e ? {
      e
    } : undefined);
    this._fireSelectionChanged();
    if (this.canvas) {
      this.canvas.fire('text:editing:entered', {
        target: this,
        e
      });
      this.canvas.requestRenderAll();
    }
  }

  /**
   * runs the actual logic that enter from editing state, see {@link enterEditing}
   */
  enterEditingImpl() {
    if (this.canvas) {
      this.canvas.calcOffset();
      this.canvas.textEditingManager.exitTextEditing();
    }
    this.isEditing = true;
    this.initHiddenTextarea();
    this.hiddenTextarea.focus();
    this.hiddenTextarea.value = this.text;
    this._updateTextarea();
    this._saveEditingProps();
    this._setEditingProps();
    this._textBeforeEdit = this.text;
    this._tick();
  }

  /**
   * called by {@link Canvas#textEditingManager}
   */
  updateSelectionOnMouseMove(e) {
    if (this.getActiveControl()) {
      return;
    }
    const el = this.hiddenTextarea;
    // regain focus
    getDocumentFromElement(el).activeElement !== el && el.focus();
    const newSelectionStart = this.getSelectionStartFromPointer(e),
      currentStart = this.selectionStart,
      currentEnd = this.selectionEnd;
    if ((newSelectionStart !== this.__selectionStartOnMouseDown || currentStart === currentEnd) && (currentStart === newSelectionStart || currentEnd === newSelectionStart)) {
      return;
    }
    if (newSelectionStart > this.__selectionStartOnMouseDown) {
      this.selectionStart = this.__selectionStartOnMouseDown;
      this.selectionEnd = newSelectionStart;
    } else {
      this.selectionStart = newSelectionStart;
      this.selectionEnd = this.__selectionStartOnMouseDown;
    }
    if (this.selectionStart !== currentStart || this.selectionEnd !== currentEnd) {
      this._fireSelectionChanged();
      this._updateTextarea();
      this.renderCursorOrSelection();
    }
  }

  /**
   * @private
   */
  _setEditingProps() {
    this.hoverCursor = 'text';
    if (this.canvas) {
      this.canvas.defaultCursor = this.canvas.moveCursor = 'text';
    }
    this.borderColor = this.editingBorderColor;
    this.hasControls = this.selectable = false;
    this.lockMovementX = this.lockMovementY = true;
  }

  /**
   * convert from textarea to grapheme indexes
   */
  fromStringToGraphemeSelection(start, end, text) {
    const smallerTextStart = text.slice(0, start),
      graphemeStart = this.graphemeSplit(smallerTextStart).length;
    if (start === end) {
      return {
        selectionStart: graphemeStart,
        selectionEnd: graphemeStart
      };
    }
    const smallerTextEnd = text.slice(start, end),
      graphemeEnd = this.graphemeSplit(smallerTextEnd).length;
    return {
      selectionStart: graphemeStart,
      selectionEnd: graphemeStart + graphemeEnd
    };
  }

  /**
   * convert from fabric to textarea values
   */
  fromGraphemeToStringSelection(start, end, graphemes) {
    const smallerTextStart = graphemes.slice(0, start),
      graphemeStart = smallerTextStart.join('').length;
    if (start === end) {
      return {
        selectionStart: graphemeStart,
        selectionEnd: graphemeStart
      };
    }
    const smallerTextEnd = graphemes.slice(start, end),
      graphemeEnd = smallerTextEnd.join('').length;
    return {
      selectionStart: graphemeStart,
      selectionEnd: graphemeStart + graphemeEnd
    };
  }

  /**
   * @private
   */
  _updateTextarea() {
    this.cursorOffsetCache = {};
    if (!this.hiddenTextarea) {
      return;
    }
    if (!this.inCompositionMode) {
      const newSelection = this.fromGraphemeToStringSelection(this.selectionStart, this.selectionEnd, this._text);
      this.hiddenTextarea.selectionStart = newSelection.selectionStart;
      this.hiddenTextarea.selectionEnd = newSelection.selectionEnd;
    }
    this.updateTextareaPosition();
  }

  /**
   * This function updates the text value from the hidden textarea and recalculates the text bounding box
   * size and position.
   * It is called by fabricJS internals, do not use it directly.
   * @private
   */
  updateFromTextArea() {
    const {
      hiddenTextarea,
      direction,
      textAlign,
      inCompositionMode
    } = this;
    if (!hiddenTextarea) {
      return;
    }
    // we want to anchor the textarea position depending on text alignment
    // or in case of text justify depending on ltr/rtl direction.
    // this.textAlign.replace('justify-', '') leverages the fact that our textAlign values all contain the word left/right/center,
    // that match the originX values.
    const anchorX = textAlign !== JUSTIFY ? textAlign.replace('justify-', '') : direction === LTR ? LEFT : RIGHT;
    const originalPosition = this.getPositionByOrigin(anchorX, 'top');
    this.cursorOffsetCache = {};
    this.text = hiddenTextarea.value;
    this.set('dirty', true);
    this.initDimensions();
    this.setPositionByOrigin(originalPosition, anchorX, 'top');
    this.setCoords();
    const newSelection = this.fromStringToGraphemeSelection(hiddenTextarea.selectionStart, hiddenTextarea.selectionEnd, hiddenTextarea.value);
    this.selectionEnd = this.selectionStart = newSelection.selectionEnd;
    if (!inCompositionMode) {
      this.selectionStart = newSelection.selectionStart;
    }
    this.updateTextareaPosition();
  }

  /**
   * @private
   */
  updateTextareaPosition() {
    if (this.selectionStart === this.selectionEnd) {
      const style = this._calcTextareaPosition();
      this.hiddenTextarea.style.left = style.left;
      this.hiddenTextarea.style.top = style.top;
    }
  }

  /**
   * @private
   * @return {Object} style contains style for hiddenTextarea
   */
  _calcTextareaPosition() {
    if (!this.canvas) {
      return {
        left: '1px',
        top: '1px'
      };
    }
    const desiredPosition = this.inCompositionMode ? this.compositionStart : this.selectionStart,
      boundaries = this._getCursorBoundaries(desiredPosition),
      cursorLocation = this.get2DCursorLocation(desiredPosition),
      lineIndex = cursorLocation.lineIndex,
      charIndex = cursorLocation.charIndex,
      charHeight = this.getValueOfPropertyAt(lineIndex, charIndex, 'fontSize') * this.lineHeight,
      leftOffset = boundaries.leftOffset,
      retinaScaling = this.getCanvasRetinaScaling(),
      upperCanvas = this.canvas.upperCanvasEl,
      upperCanvasWidth = upperCanvas.width / retinaScaling,
      upperCanvasHeight = upperCanvas.height / retinaScaling,
      maxWidth = upperCanvasWidth - charHeight,
      maxHeight = upperCanvasHeight - charHeight;
    const p = new Point(boundaries.left + leftOffset, boundaries.top + boundaries.topOffset + charHeight).transform(this.calcTransformMatrix()).transform(this.canvas.viewportTransform).multiply(new Point(upperCanvas.clientWidth / upperCanvasWidth, upperCanvas.clientHeight / upperCanvasHeight));
    if (p.x < 0) {
      p.x = 0;
    }
    if (p.x > maxWidth) {
      p.x = maxWidth;
    }
    if (p.y < 0) {
      p.y = 0;
    }
    if (p.y > maxHeight) {
      p.y = maxHeight;
    }

    // add canvas offset on document
    p.x += this.canvas._offset.left;
    p.y += this.canvas._offset.top;
    return {
      left: `${p.x}px`,
      top: `${p.y}px`,
      fontSize: `${charHeight}px`,
      charHeight: charHeight
    };
  }

  /**
   * @private
   */
  _saveEditingProps() {
    this._savedProps = {
      hasControls: this.hasControls,
      borderColor: this.borderColor,
      lockMovementX: this.lockMovementX,
      lockMovementY: this.lockMovementY,
      hoverCursor: this.hoverCursor,
      selectable: this.selectable,
      defaultCursor: this.canvas && this.canvas.defaultCursor,
      moveCursor: this.canvas && this.canvas.moveCursor
    };
  }

  /**
   * @private
   */
  _restoreEditingProps() {
    if (!this._savedProps) {
      return;
    }
    this.hoverCursor = this._savedProps.hoverCursor;
    this.hasControls = this._savedProps.hasControls;
    this.borderColor = this._savedProps.borderColor;
    this.selectable = this._savedProps.selectable;
    this.lockMovementX = this._savedProps.lockMovementX;
    this.lockMovementY = this._savedProps.lockMovementY;
    if (this.canvas) {
      this.canvas.defaultCursor = this._savedProps.defaultCursor || this.canvas.defaultCursor;
      this.canvas.moveCursor = this._savedProps.moveCursor || this.canvas.moveCursor;
    }
    delete this._savedProps;
  }

  /**
   * runs the actual logic that exits from editing state, see {@link exitEditing}
   * But it does not fire events
   */
  exitEditingImpl() {
    const hiddenTextarea = this.hiddenTextarea;
    this.selected = false;
    this.isEditing = false;
    if (hiddenTextarea) {
      hiddenTextarea.blur && hiddenTextarea.blur();
      hiddenTextarea.parentNode && hiddenTextarea.parentNode.removeChild(hiddenTextarea);
    }
    this.hiddenTextarea = null;
    this.abortCursorAnimation();
    this.selectionStart !== this.selectionEnd && this.clearContextTop();
    this.selectionEnd = this.selectionStart;
    this._restoreEditingProps();
    if (this._forceClearCache) {
      this.initDimensions();
      this.setCoords();
    }
  }

  /**
   * Exits from editing state and fires relevant events
   */
  exitEditing() {
    const isTextChanged = this._textBeforeEdit !== this.text;
    this.exitEditingImpl();
    this.fire('editing:exited');
    isTextChanged && this.fire(MODIFIED);
    if (this.canvas) {
      this.canvas.fire('text:editing:exited', {
        target: this
      });
      // todo: evaluate add an action to this event
      isTextChanged && this.canvas.fire('object:modified', {
        target: this
      });
    }
    return this;
  }

  /**
   * @private
   */
  _removeExtraneousStyles() {
    for (const prop in this.styles) {
      if (!this._textLines[prop]) {
        delete this.styles[prop];
      }
    }
  }

  /**
   * remove and reflow a style block from start to end.
   * @param {Number} start linear start position for removal (included in removal)
   * @param {Number} end linear end position for removal ( excluded from removal )
   */
  removeStyleFromTo(start, end) {
    const {
        lineIndex: lineStart,
        charIndex: charStart
      } = this.get2DCursorLocation(start, true),
      {
        lineIndex: lineEnd,
        charIndex: charEnd
      } = this.get2DCursorLocation(end, true);
    if (lineStart !== lineEnd) {
      // step1 remove the trailing of lineStart
      if (this.styles[lineStart]) {
        for (let i = charStart; i < this._unwrappedTextLines[lineStart].length; i++) {
          delete this.styles[lineStart][i];
        }
      }
      // step2 move the trailing of lineEnd to lineStart if needed
      if (this.styles[lineEnd]) {
        for (let i = charEnd; i < this._unwrappedTextLines[lineEnd].length; i++) {
          const styleObj = this.styles[lineEnd][i];
          if (styleObj) {
            this.styles[lineStart] || (this.styles[lineStart] = {});
            this.styles[lineStart][charStart + i - charEnd] = styleObj;
          }
        }
      }
      // step3 detects lines will be completely removed.
      for (let i = lineStart + 1; i <= lineEnd; i++) {
        delete this.styles[i];
      }
      // step4 shift remaining lines.
      this.shiftLineStyles(lineEnd, lineStart - lineEnd);
    } else {
      // remove and shift left on the same line
      if (this.styles[lineStart]) {
        const styleObj = this.styles[lineStart];
        const diff = charEnd - charStart;
        for (let i = charStart; i < charEnd; i++) {
          delete styleObj[i];
        }
        for (const char in this.styles[lineStart]) {
          const numericChar = parseInt(char, 10);
          if (numericChar >= charEnd) {
            styleObj[numericChar - diff] = styleObj[char];
            delete styleObj[char];
          }
        }
      }
    }
  }

  /**
   * Shifts line styles up or down
   * @param {Number} lineIndex Index of a line
   * @param {Number} offset Can any number?
   */
  shiftLineStyles(lineIndex, offset) {
    const clonedStyles = Object.assign({}, this.styles);
    for (const line in this.styles) {
      const numericLine = parseInt(line, 10);
      if (numericLine > lineIndex) {
        this.styles[numericLine + offset] = clonedStyles[numericLine];
        if (!clonedStyles[numericLine - offset]) {
          delete this.styles[numericLine];
        }
      }
    }
  }

  /**
   * Handle insertion of more consecutive style lines for when one or more
   * newlines gets added to the text. Since current style needs to be shifted
   * first we shift the current style of the number lines needed, then we add
   * new lines from the last to the first.
   * @param {Number} lineIndex Index of a line
   * @param {Number} charIndex Index of a char
   * @param {Number} qty number of lines to add
   * @param {Array} copiedStyle Array of objects styles
   */
  insertNewlineStyleObject(lineIndex, charIndex, qty, copiedStyle) {
    const newLineStyles = {};
    const originalLineLength = this._unwrappedTextLines[lineIndex].length;
    const isEndOfLine = originalLineLength === charIndex;
    let someStyleIsCarryingOver = false;
    qty || (qty = 1);
    this.shiftLineStyles(lineIndex, qty);
    const currentCharStyle = this.styles[lineIndex] ? this.styles[lineIndex][charIndex === 0 ? charIndex : charIndex - 1] : undefined;

    // we clone styles of all chars
    // after cursor onto the current line
    for (const index in this.styles[lineIndex]) {
      const numIndex = parseInt(index, 10);
      if (numIndex >= charIndex) {
        someStyleIsCarryingOver = true;
        newLineStyles[numIndex - charIndex] = this.styles[lineIndex][index];
        // remove lines from the previous line since they're on a new line now
        if (!(isEndOfLine && charIndex === 0)) {
          delete this.styles[lineIndex][index];
        }
      }
    }
    let styleCarriedOver = false;
    if (someStyleIsCarryingOver && !isEndOfLine) {
      // if is end of line, the extra style we copied
      // is probably not something we want
      this.styles[lineIndex + qty] = newLineStyles;
      styleCarriedOver = true;
    }
    if (styleCarriedOver || originalLineLength > charIndex) {
      // skip the last line of since we already prepared it.
      // or contains text without style that we don't want to style
      // just because it changed lines
      qty--;
    }
    // for the all the lines or all the other lines
    // we clone current char style onto the next (otherwise empty) line
    while (qty > 0) {
      if (copiedStyle && copiedStyle[qty - 1]) {
        this.styles[lineIndex + qty] = {
          0: {
            ...copiedStyle[qty - 1]
          }
        };
      } else if (currentCharStyle) {
        this.styles[lineIndex + qty] = {
          0: {
            ...currentCharStyle
          }
        };
      } else {
        delete this.styles[lineIndex + qty];
      }
      qty--;
    }
    this._forceClearCache = true;
  }

  /**
   * Inserts style object for a given line/char index
   * @param {Number} lineIndex Index of a line
   * @param {Number} charIndex Index of a char
   * @param {Number} quantity number Style object to insert, if given
   * @param {Array} copiedStyle array of style objects
   */
  insertCharStyleObject(lineIndex, charIndex, quantity, copiedStyle) {
    if (!this.styles) {
      this.styles = {};
    }
    const currentLineStyles = this.styles[lineIndex],
      currentLineStylesCloned = currentLineStyles ? {
        ...currentLineStyles
      } : {};
    quantity || (quantity = 1);
    // shift all char styles by quantity forward
    // 0,1,2,3 -> (charIndex=2) -> 0,1,3,4 -> (insert 2) -> 0,1,2,3,4
    for (const index in currentLineStylesCloned) {
      const numericIndex = parseInt(index, 10);
      if (numericIndex >= charIndex) {
        currentLineStyles[numericIndex + quantity] = currentLineStylesCloned[numericIndex];
        // only delete the style if there was nothing moved there
        if (!currentLineStylesCloned[numericIndex - quantity]) {
          delete currentLineStyles[numericIndex];
        }
      }
    }
    this._forceClearCache = true;
    if (copiedStyle) {
      while (quantity--) {
        if (!Object.keys(copiedStyle[quantity]).length) {
          continue;
        }
        if (!this.styles[lineIndex]) {
          this.styles[lineIndex] = {};
        }
        this.styles[lineIndex][charIndex + quantity] = {
          ...copiedStyle[quantity]
        };
      }
      return;
    }
    if (!currentLineStyles) {
      return;
    }
    const newStyle = currentLineStyles[charIndex ? charIndex - 1 : 1];
    while (newStyle && quantity--) {
      this.styles[lineIndex][charIndex + quantity] = {
        ...newStyle
      };
    }
  }

  /**
   * Inserts style object(s)
   * @param {Array} insertedText Characters at the location where style is inserted
   * @param {Number} start cursor index for inserting style
   * @param {Array} [copiedStyle] array of style objects to insert.
   */
  insertNewStyleBlock(insertedText, start, copiedStyle) {
    const cursorLoc = this.get2DCursorLocation(start, true),
      addedLines = [0];
    let linesLength = 0;
    // get an array of how many char per lines are being added.
    for (let i = 0; i < insertedText.length; i++) {
      if (insertedText[i] === '\n') {
        linesLength++;
        addedLines[linesLength] = 0;
      } else {
        addedLines[linesLength]++;
      }
    }
    // for the first line copy the style from the current char position.
    if (addedLines[0] > 0) {
      this.insertCharStyleObject(cursorLoc.lineIndex, cursorLoc.charIndex, addedLines[0], copiedStyle);
      copiedStyle = copiedStyle && copiedStyle.slice(addedLines[0] + 1);
    }
    linesLength && this.insertNewlineStyleObject(cursorLoc.lineIndex, cursorLoc.charIndex + addedLines[0], linesLength);
    let i;
    for (i = 1; i < linesLength; i++) {
      if (addedLines[i] > 0) {
        this.insertCharStyleObject(cursorLoc.lineIndex + i, 0, addedLines[i], copiedStyle);
      } else if (copiedStyle) {
        // this test is required in order to close #6841
        // when a pasted buffer begins with a newline then
        // this.styles[cursorLoc.lineIndex + i] and copiedStyle[0]
        // may be undefined for some reason
        if (this.styles[cursorLoc.lineIndex + i] && copiedStyle[0]) {
          this.styles[cursorLoc.lineIndex + i][0] = copiedStyle[0];
        }
      }
      copiedStyle = copiedStyle && copiedStyle.slice(addedLines[i] + 1);
    }
    if (addedLines[i] > 0) {
      this.insertCharStyleObject(cursorLoc.lineIndex + i, 0, addedLines[i], copiedStyle);
    }
  }

  /**
   * Removes characters from start/end
   * start/end ar per grapheme position in _text array.
   *
   * @param {Number} start
   * @param {Number} end default to start + 1
   */
  removeChars(start) {
    let end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : start + 1;
    this.removeStyleFromTo(start, end);
    this._text.splice(start, end - start);
    this.text = this._text.join('');
    this.set('dirty', true);
    this.initDimensions();
    this.setCoords();
    this._removeExtraneousStyles();
  }

  /**
   * insert characters at start position, before start position.
   * start  equal 1 it means the text get inserted between actual grapheme 0 and 1
   * if style array is provided, it must be as the same length of text in graphemes
   * if end is provided and is bigger than start, old text is replaced.
   * start/end ar per grapheme position in _text array.
   *
   * @param {String} text text to insert
   * @param {Array} style array of style objects
   * @param {Number} start
   * @param {Number} end default to start + 1
   */
  insertChars(text, style, start) {
    let end = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : start;
    if (end > start) {
      this.removeStyleFromTo(start, end);
    }
    const graphemes = this.graphemeSplit(text);
    this.insertNewStyleBlock(graphemes, start, style);
    this._text = [...this._text.slice(0, start), ...graphemes, ...this._text.slice(end)];
    this.text = this._text.join('');
    this.set('dirty', true);
    this.initDimensions();
    this.setCoords();
    this._removeExtraneousStyles();
  }

  /**
   * Set the selectionStart and selectionEnd according to the new position of cursor
   * mimic the key - mouse navigation when shift is pressed.
   */
  setSelectionStartEndWithShift(start, end, newSelection) {
    if (newSelection <= start) {
      if (end === start) {
        this._selectionDirection = LEFT;
      } else if (this._selectionDirection === RIGHT) {
        this._selectionDirection = LEFT;
        this.selectionEnd = start;
      }
      this.selectionStart = newSelection;
    } else if (newSelection > start && newSelection < end) {
      if (this._selectionDirection === RIGHT) {
        this.selectionEnd = newSelection;
      } else {
        this.selectionStart = newSelection;
      }
    } else {
      // newSelection is > selection start and end
      if (end === start) {
        this._selectionDirection = RIGHT;
      } else if (this._selectionDirection === LEFT) {
        this._selectionDirection = RIGHT;
        this.selectionStart = end;
      }
      this.selectionEnd = newSelection;
    }
  }
}

class ITextKeyBehavior extends ITextBehavior {
  /**
   * For functionalities on keyDown
   * Map a special key to a function of the instance/prototype
   * If you need different behavior for ESC or TAB or arrows, you have to change
   * this map setting the name of a function that you build on the IText or
   * your prototype.
   * the map change will affect all Instances unless you need for only some text Instances
   * in that case you have to clone this object and assign your Instance.
   * this.keysMap = Object.assign({}, this.keysMap);
   * The function must be in IText.prototype.myFunction And will receive event as args[0]
   */

  /**
   * For functionalities on keyUp + ctrl || cmd
   */

  /**
   * For functionalities on keyDown + ctrl || cmd
   */

  /**
   * DOM container to append the hiddenTextarea.
   * An alternative to attaching to the document.body.
   * Useful to reduce laggish redraw of the full document.body tree and
   * also with modals event capturing that won't let the textarea take focus.
   * @type HTMLElement
   */

  /**
   * Initializes hidden textarea (needed to bring up keyboard in iOS)
   */
  initHiddenTextarea() {
    const doc = this.canvas && getDocumentFromElement(this.canvas.getElement()) || getFabricDocument();
    const textarea = doc.createElement('textarea');
    Object.entries({
      autocapitalize: 'off',
      autocorrect: 'off',
      autocomplete: 'off',
      spellcheck: 'false',
      'data-fabric': 'textarea',
      wrap: 'off',
      name: 'fabricTextarea'
    }).map(_ref => {
      let [attribute, value] = _ref;
      return textarea.setAttribute(attribute, value);
    });
    const {
      top,
      left,
      fontSize
    } = this._calcTextareaPosition();
    // line-height: 1px; was removed from the style to fix this:
    // https://bugs.chromium.org/p/chromium/issues/detail?id=870966
    textarea.style.cssText = `position: absolute; top: ${top}; left: ${left}; z-index: -999; opacity: 0; width: 1px; height: 1px; font-size: 1px; padding-top: ${fontSize};`;
    (this.hiddenTextareaContainer || doc.body).appendChild(textarea);
    Object.entries({
      blur: 'blur',
      keydown: 'onKeyDown',
      keyup: 'onKeyUp',
      input: 'onInput',
      copy: 'copy',
      cut: 'copy',
      paste: 'paste',
      compositionstart: 'onCompositionStart',
      compositionupdate: 'onCompositionUpdate',
      compositionend: 'onCompositionEnd'
    }).map(_ref2 => {
      let [eventName, handler] = _ref2;
      return textarea.addEventListener(eventName, this[handler].bind(this));
    });
    this.hiddenTextarea = textarea;
  }

  /**
   * Override this method to customize cursor behavior on textbox blur
   */
  blur() {
    this.abortCursorAnimation();
  }

  /**
   * Handles keydown event
   * only used for arrows and combination of modifier keys.
   * @param {KeyboardEvent} e Event object
   */
  onKeyDown(e) {
    if (!this.isEditing) {
      return;
    }
    const keyMap = this.direction === 'rtl' ? this.keysMapRtl : this.keysMap;
    if (e.keyCode in keyMap) {
      this[keyMap[e.keyCode]](e);
    } else if (e.keyCode in this.ctrlKeysMapDown && (e.ctrlKey || e.metaKey)) {
      this[this.ctrlKeysMapDown[e.keyCode]](e);
    } else {
      return;
    }
    e.stopImmediatePropagation();
    e.preventDefault();
    if (e.keyCode >= 33 && e.keyCode <= 40) {
      // if i press an arrow key just update selection
      this.inCompositionMode = false;
      this.clearContextTop();
      this.renderCursorOrSelection();
    } else {
      this.canvas && this.canvas.requestRenderAll();
    }
  }

  /**
   * Handles keyup event
   * We handle KeyUp because ie11 and edge have difficulties copy/pasting
   * if a copy/cut event fired, keyup is dismissed
   * @param {KeyboardEvent} e Event object
   */
  onKeyUp(e) {
    if (!this.isEditing || this._copyDone || this.inCompositionMode) {
      this._copyDone = false;
      return;
    }
    if (e.keyCode in this.ctrlKeysMapUp && (e.ctrlKey || e.metaKey)) {
      this[this.ctrlKeysMapUp[e.keyCode]](e);
    } else {
      return;
    }
    e.stopImmediatePropagation();
    e.preventDefault();
    this.canvas && this.canvas.requestRenderAll();
  }

  /**
   * Handles onInput event
   * @param {Event} e Event object
   */
  onInput(e) {
    const fromPaste = this.fromPaste;
    const {
      value,
      selectionStart,
      selectionEnd
    } = this.hiddenTextarea;
    this.fromPaste = false;
    e && e.stopPropagation();
    if (!this.isEditing) {
      return;
    }
    const updateAndFire = () => {
      this.updateFromTextArea();
      this.fire(CHANGED);
      if (this.canvas) {
        this.canvas.fire('text:changed', {
          target: this
        });
        this.canvas.requestRenderAll();
      }
    };
    if (this.hiddenTextarea.value === '') {
      this.styles = {};
      updateAndFire();
      return;
    }
    // decisions about style changes.
    const nextText = this._splitTextIntoLines(value).graphemeText,
      charCount = this._text.length,
      nextCharCount = nextText.length,
      _selectionStart = this.selectionStart,
      _selectionEnd = this.selectionEnd,
      selection = _selectionStart !== _selectionEnd;
    let copiedStyle,
      removedText,
      charDiff = nextCharCount - charCount,
      removeFrom,
      removeTo;
    const textareaSelection = this.fromStringToGraphemeSelection(selectionStart, selectionEnd, value);
    const backDelete = _selectionStart > textareaSelection.selectionStart;
    if (selection) {
      removedText = this._text.slice(_selectionStart, _selectionEnd);
      charDiff += _selectionEnd - _selectionStart;
    } else if (nextCharCount < charCount) {
      if (backDelete) {
        removedText = this._text.slice(_selectionEnd + charDiff, _selectionEnd);
      } else {
        removedText = this._text.slice(_selectionStart, _selectionStart - charDiff);
      }
    }
    const insertedText = nextText.slice(textareaSelection.selectionEnd - charDiff, textareaSelection.selectionEnd);
    if (removedText && removedText.length) {
      if (insertedText.length) {
        // let's copy some style before deleting.
        // we want to copy the style before the cursor OR the style at the cursor if selection
        // is bigger than 0.
        copiedStyle = this.getSelectionStyles(_selectionStart, _selectionStart + 1, false);
        // now duplicate the style one for each inserted text.
        copiedStyle = insertedText.map(() =>
        // this return an array of references, but that is fine since we are
        // copying the style later.
        copiedStyle[0]);
      }
      if (selection) {
        removeFrom = _selectionStart;
        removeTo = _selectionEnd;
      } else if (backDelete) {
        // detect differences between forwardDelete and backDelete
        removeFrom = _selectionEnd - removedText.length;
        removeTo = _selectionEnd;
      } else {
        removeFrom = _selectionEnd;
        removeTo = _selectionEnd + removedText.length;
      }
      this.removeStyleFromTo(removeFrom, removeTo);
    }
    if (insertedText.length) {
      const {
        copyPasteData
      } = getEnv$1();
      if (fromPaste && insertedText.join('') === copyPasteData.copiedText && !config.disableStyleCopyPaste) {
        copiedStyle = copyPasteData.copiedTextStyle;
      }
      this.insertNewStyleBlock(insertedText, _selectionStart, copiedStyle);
    }
    updateAndFire();
  }

  /**
   * Composition start
   */
  onCompositionStart() {
    this.inCompositionMode = true;
  }

  /**
   * Composition end
   */
  onCompositionEnd() {
    this.inCompositionMode = false;
  }
  onCompositionUpdate(_ref3) {
    let {
      target
    } = _ref3;
    const {
      selectionStart,
      selectionEnd
    } = target;
    this.compositionStart = selectionStart;
    this.compositionEnd = selectionEnd;
    this.updateTextareaPosition();
  }

  /**
   * Copies selected text
   */
  copy() {
    if (this.selectionStart === this.selectionEnd) {
      //do not cut-copy if no selection
      return;
    }
    const {
      copyPasteData
    } = getEnv$1();
    copyPasteData.copiedText = this.getSelectedText();
    if (!config.disableStyleCopyPaste) {
      copyPasteData.copiedTextStyle = this.getSelectionStyles(this.selectionStart, this.selectionEnd, true);
    } else {
      copyPasteData.copiedTextStyle = undefined;
    }
    this._copyDone = true;
  }

  /**
   * Pastes text
   */
  paste() {
    this.fromPaste = true;
  }

  /**
   * Finds the width in pixels before the cursor on the same line
   * @private
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @return {Number} widthBeforeCursor width before cursor
   */
  _getWidthBeforeCursor(lineIndex, charIndex) {
    let widthBeforeCursor = this._getLineLeftOffset(lineIndex),
      bound;
    if (charIndex > 0) {
      bound = this.__charBounds[lineIndex][charIndex - 1];
      widthBeforeCursor += bound.left + bound.width;
    }
    return widthBeforeCursor;
  }

  /**
   * Gets start offset of a selection
   * @param {KeyboardEvent} e Event object
   * @param {Boolean} isRight
   * @return {Number}
   */
  getDownCursorOffset(e, isRight) {
    const selectionProp = this._getSelectionForOffset(e, isRight),
      cursorLocation = this.get2DCursorLocation(selectionProp),
      lineIndex = cursorLocation.lineIndex;
    // if on last line, down cursor goes to end of line
    if (lineIndex === this._textLines.length - 1 || e.metaKey || e.keyCode === 34) {
      // move to the end of a text
      return this._text.length - selectionProp;
    }
    const charIndex = cursorLocation.charIndex,
      widthBeforeCursor = this._getWidthBeforeCursor(lineIndex, charIndex),
      indexOnOtherLine = this._getIndexOnLine(lineIndex + 1, widthBeforeCursor),
      textAfterCursor = this._textLines[lineIndex].slice(charIndex);
    return textAfterCursor.length + indexOnOtherLine + 1 + this.missingNewlineOffset(lineIndex);
  }

  /**
   * private
   * Helps finding if the offset should be counted from Start or End
   * @param {KeyboardEvent} e Event object
   * @param {Boolean} isRight
   * @return {Number}
   */
  _getSelectionForOffset(e, isRight) {
    if (e.shiftKey && this.selectionStart !== this.selectionEnd && isRight) {
      return this.selectionEnd;
    } else {
      return this.selectionStart;
    }
  }

  /**
   * @param {KeyboardEvent} e Event object
   * @param {Boolean} isRight
   * @return {Number}
   */
  getUpCursorOffset(e, isRight) {
    const selectionProp = this._getSelectionForOffset(e, isRight),
      cursorLocation = this.get2DCursorLocation(selectionProp),
      lineIndex = cursorLocation.lineIndex;
    if (lineIndex === 0 || e.metaKey || e.keyCode === 33) {
      // if on first line, up cursor goes to start of line
      return -selectionProp;
    }
    const charIndex = cursorLocation.charIndex,
      widthBeforeCursor = this._getWidthBeforeCursor(lineIndex, charIndex),
      indexOnOtherLine = this._getIndexOnLine(lineIndex - 1, widthBeforeCursor),
      textBeforeCursor = this._textLines[lineIndex].slice(0, charIndex),
      missingNewlineOffset = this.missingNewlineOffset(lineIndex - 1);
    // return a negative offset
    return -this._textLines[lineIndex - 1].length + indexOnOtherLine - textBeforeCursor.length + (1 - missingNewlineOffset);
  }

  /**
   * for a given width it founds the matching character.
   * @private
   */
  _getIndexOnLine(lineIndex, width) {
    const line = this._textLines[lineIndex],
      lineLeftOffset = this._getLineLeftOffset(lineIndex);
    let widthOfCharsOnLine = lineLeftOffset,
      indexOnLine = 0,
      charWidth,
      foundMatch;
    for (let j = 0, jlen = line.length; j < jlen; j++) {
      charWidth = this.__charBounds[lineIndex][j].width;
      widthOfCharsOnLine += charWidth;
      if (widthOfCharsOnLine > width) {
        foundMatch = true;
        const leftEdge = widthOfCharsOnLine - charWidth,
          rightEdge = widthOfCharsOnLine,
          offsetFromLeftEdge = Math.abs(leftEdge - width),
          offsetFromRightEdge = Math.abs(rightEdge - width);
        indexOnLine = offsetFromRightEdge < offsetFromLeftEdge ? j : j - 1;
        break;
      }
    }

    // reached end
    if (!foundMatch) {
      indexOnLine = line.length - 1;
    }
    return indexOnLine;
  }

  /**
   * Moves cursor down
   * @param {KeyboardEvent} e Event object
   */
  moveCursorDown(e) {
    if (this.selectionStart >= this._text.length && this.selectionEnd >= this._text.length) {
      return;
    }
    this._moveCursorUpOrDown('Down', e);
  }

  /**
   * Moves cursor up
   * @param {KeyboardEvent} e Event object
   */
  moveCursorUp(e) {
    if (this.selectionStart === 0 && this.selectionEnd === 0) {
      return;
    }
    this._moveCursorUpOrDown('Up', e);
  }

  /**
   * Moves cursor up or down, fires the events
   * @param {String} direction 'Up' or 'Down'
   * @param {KeyboardEvent} e Event object
   */
  _moveCursorUpOrDown(direction, e) {
    const offset = this[`get${direction}CursorOffset`](e, this._selectionDirection === RIGHT);
    if (e.shiftKey) {
      this.moveCursorWithShift(offset);
    } else {
      this.moveCursorWithoutShift(offset);
    }
    if (offset !== 0) {
      const max = this.text.length;
      this.selectionStart = capValue(0, this.selectionStart, max);
      this.selectionEnd = capValue(0, this.selectionEnd, max);
      // TODO fix: abort and init should be an alternative depending
      // on selectionStart/End being equal or different
      this.abortCursorAnimation();
      this.initDelayedCursor();
      this._fireSelectionChanged();
      this._updateTextarea();
    }
  }

  /**
   * Moves cursor with shift
   * @param {Number} offset
   */
  moveCursorWithShift(offset) {
    const newSelection = this._selectionDirection === LEFT ? this.selectionStart + offset : this.selectionEnd + offset;
    this.setSelectionStartEndWithShift(this.selectionStart, this.selectionEnd, newSelection);
    return offset !== 0;
  }

  /**
   * Moves cursor up without shift
   * @param {Number} offset
   */
  moveCursorWithoutShift(offset) {
    if (offset < 0) {
      this.selectionStart += offset;
      this.selectionEnd = this.selectionStart;
    } else {
      this.selectionEnd += offset;
      this.selectionStart = this.selectionEnd;
    }
    return offset !== 0;
  }

  /**
   * Moves cursor left
   * @param {KeyboardEvent} e Event object
   */
  moveCursorLeft(e) {
    if (this.selectionStart === 0 && this.selectionEnd === 0) {
      return;
    }
    this._moveCursorLeftOrRight('Left', e);
  }

  /**
   * @private
   * @return {Boolean} true if a change happened
   *
   * @todo refactor not to use method name composition
   */
  _move(e, prop, direction) {
    let newValue;
    if (e.altKey) {
      newValue = this[`findWordBoundary${direction}`](this[prop]);
    } else if (e.metaKey || e.keyCode === 35 || e.keyCode === 36) {
      newValue = this[`findLineBoundary${direction}`](this[prop]);
    } else {
      this[prop] += direction === 'Left' ? -1 : 1;
      return true;
    }
    if (typeof newValue !== 'undefined' && this[prop] !== newValue) {
      this[prop] = newValue;
      return true;
    }
    return false;
  }

  /**
   * @private
   */
  _moveLeft(e, prop) {
    return this._move(e, prop, 'Left');
  }

  /**
   * @private
   */
  _moveRight(e, prop) {
    return this._move(e, prop, 'Right');
  }

  /**
   * Moves cursor left without keeping selection
   * @param {KeyboardEvent} e
   */
  moveCursorLeftWithoutShift(e) {
    let change = true;
    this._selectionDirection = LEFT;

    // only move cursor when there is no selection,
    // otherwise we discard it, and leave cursor on same place
    if (this.selectionEnd === this.selectionStart && this.selectionStart !== 0) {
      change = this._moveLeft(e, 'selectionStart');
    }
    this.selectionEnd = this.selectionStart;
    return change;
  }

  /**
   * Moves cursor left while keeping selection
   * @param {KeyboardEvent} e
   */
  moveCursorLeftWithShift(e) {
    if (this._selectionDirection === RIGHT && this.selectionStart !== this.selectionEnd) {
      return this._moveLeft(e, 'selectionEnd');
    } else if (this.selectionStart !== 0) {
      this._selectionDirection = LEFT;
      return this._moveLeft(e, 'selectionStart');
    }
  }

  /**
   * Moves cursor right
   * @param {KeyboardEvent} e Event object
   */
  moveCursorRight(e) {
    if (this.selectionStart >= this._text.length && this.selectionEnd >= this._text.length) {
      return;
    }
    this._moveCursorLeftOrRight('Right', e);
  }

  /**
   * Moves cursor right or Left, fires event
   * @param {String} direction 'Left', 'Right'
   * @param {KeyboardEvent} e Event object
   */
  _moveCursorLeftOrRight(direction, e) {
    const actionName = `moveCursor${direction}${e.shiftKey ? 'WithShift' : 'WithoutShift'}`;
    this._currentCursorOpacity = 1;
    if (this[actionName](e)) {
      // TODO fix: abort and init should be an alternative depending
      // on selectionStart/End being equal or different
      this.abortCursorAnimation();
      this.initDelayedCursor();
      this._fireSelectionChanged();
      this._updateTextarea();
    }
  }

  /**
   * Moves cursor right while keeping selection
   * @param {KeyboardEvent} e
   */
  moveCursorRightWithShift(e) {
    if (this._selectionDirection === LEFT && this.selectionStart !== this.selectionEnd) {
      return this._moveRight(e, 'selectionStart');
    } else if (this.selectionEnd !== this._text.length) {
      this._selectionDirection = RIGHT;
      return this._moveRight(e, 'selectionEnd');
    }
  }

  /**
   * Moves cursor right without keeping selection
   * @param {KeyboardEvent} e Event object
   */
  moveCursorRightWithoutShift(e) {
    let changed = true;
    this._selectionDirection = RIGHT;
    if (this.selectionStart === this.selectionEnd) {
      changed = this._moveRight(e, 'selectionStart');
      this.selectionEnd = this.selectionStart;
    } else {
      this.selectionStart = this.selectionEnd;
    }
    return changed;
  }
}

/**
 * `LEFT_CLICK === 0`
 */
const notALeftClick = e => !!e.button;
class ITextClickBehavior extends ITextKeyBehavior {
  constructor() {
    super(...arguments);
    _defineProperty(this, "draggableTextDelegate", void 0);
  }
  initBehavior() {
    // Initializes event handlers related to cursor or selection
    this.on('mousedown', this._mouseDownHandler);
    this.on('mouseup', this.mouseUpHandler);
    this.on('mousedblclick', this.doubleClickHandler);
    this.on('mousetripleclick', this.tripleClickHandler);
    this.draggableTextDelegate = new DraggableTextDelegate(this);
    super.initBehavior();
  }

  /**
   * If this method returns true a mouse move operation over a text selection
   * will not prevent the native mouse event allowing the browser to start a drag operation.
   * shouldStartDragging can be read 'do not prevent default for mouse move event'
   * To prevent drag and drop between objects both shouldStartDragging and onDragStart should return false
   * @returns
   */
  shouldStartDragging() {
    return this.draggableTextDelegate.isActive();
  }

  /**
   * @public override this method to control whether instance should/shouldn't become a drag source,
   * @see also {@link DraggableTextDelegate#isActive}
   * To prevent drag and drop between objects both shouldStartDragging and onDragStart should return false
   * @returns {boolean} should handle event
   */
  onDragStart(e) {
    return this.draggableTextDelegate.onDragStart(e);
  }

  /**
   * @public override this method to control whether instance should/shouldn't become a drop target
   */
  canDrop(e) {
    return this.draggableTextDelegate.canDrop(e);
  }

  /**
   * Default handler for double click, select a word
   */
  doubleClickHandler(options) {
    if (!this.isEditing) {
      return;
    }
    this.selectWord(this.getSelectionStartFromPointer(options.e));
    this.renderCursorOrSelection();
  }

  /**
   * Default handler for triple click, select a line
   */
  tripleClickHandler(options) {
    if (!this.isEditing) {
      return;
    }
    this.selectLine(this.getSelectionStartFromPointer(options.e));
    this.renderCursorOrSelection();
  }

  /**
   * Default event handler for the basic functionalities needed on _mouseDown
   * can be overridden to do something different.
   * Scope of this implementation is: find the click position, set selectionStart
   * find selectionEnd, initialize the drawing of either cursor or selection area
   * initializing a mousedDown on a text area will cancel fabricjs knowledge of
   * current compositionMode. It will be set to false.
   */
  _mouseDownHandler(_ref) {
    let {
      e,
      alreadySelected
    } = _ref;
    if (!this.canvas || !this.editable || notALeftClick(e) || this.getActiveControl()) {
      return;
    }
    if (this.draggableTextDelegate.start(e)) {
      return;
    }
    this.canvas.textEditingManager.register(this);
    if (alreadySelected) {
      this.inCompositionMode = false;
      this.setCursorByClick(e);
    }
    if (this.isEditing) {
      this.__selectionStartOnMouseDown = this.selectionStart;
      if (this.selectionStart === this.selectionEnd) {
        this.abortCursorAnimation();
      }
      this.renderCursorOrSelection();
    }
    this.selected || (this.selected = alreadySelected || this.isEditing);
  }

  /**
   * standard handler for mouse up, overridable
   * @private
   */
  mouseUpHandler(_ref2) {
    let {
      e,
      transform
    } = _ref2;
    const didDrag = this.draggableTextDelegate.end(e);
    if (this.canvas) {
      this.canvas.textEditingManager.unregister(this);
      const activeObject = this.canvas._activeObject;
      if (activeObject && activeObject !== this) {
        // avoid running this logic when there is an active object
        // this because is possible with shift click and fast clicks,
        // to rapidly deselect and reselect this object and trigger an enterEdit
        return;
      }
    }
    if (!this.editable || this.group && !this.group.interactive || transform && transform.actionPerformed || notALeftClick(e) || didDrag) {
      return;
    }
    if (this.selected && !this.getActiveControl()) {
      this.enterEditing(e);
      if (this.selectionStart === this.selectionEnd) {
        this.initDelayedCursor(true);
      } else {
        this.renderCursorOrSelection();
      }
    }
  }

  /**
   * Changes cursor location in a text depending on passed pointer (x/y) object
   * @param {TPointerEvent} e Event object
   */
  setCursorByClick(e) {
    const newSelection = this.getSelectionStartFromPointer(e),
      start = this.selectionStart,
      end = this.selectionEnd;
    if (e.shiftKey) {
      this.setSelectionStartEndWithShift(start, end, newSelection);
    } else {
      this.selectionStart = newSelection;
      this.selectionEnd = newSelection;
    }
    if (this.isEditing) {
      this._fireSelectionChanged();
      this._updateTextarea();
    }
  }

  /**
   * Returns index of a character corresponding to where an object was clicked
   * @param {TPointerEvent} e Event object
   * @return {Number} Index of a character
   */
  getSelectionStartFromPointer(e) {
    const mouseOffset = this.canvas.getScenePoint(e).transform(invertTransform(this.calcTransformMatrix())).add(new Point(-this._getLeftOffset(), -this._getTopOffset()));
    let height = 0,
      charIndex = 0,
      lineIndex = 0;
    for (let i = 0; i < this._textLines.length; i++) {
      if (height <= mouseOffset.y) {
        height += this.getHeightOfLine(i);
        lineIndex = i;
        if (i > 0) {
          charIndex += this._textLines[i - 1].length + this.missingNewlineOffset(i - 1);
        }
      } else {
        break;
      }
    }
    const lineLeftOffset = Math.abs(this._getLineLeftOffset(lineIndex));
    let width = lineLeftOffset;
    const charLength = this._textLines[lineIndex].length;
    const chars = this.__charBounds[lineIndex];
    for (let j = 0; j < charLength; j++) {
      // i removed something about flipX here, check.
      const charWidth = chars[j].kernedWidth;
      const widthAfter = width + charWidth;
      if (mouseOffset.x <= widthAfter) {
        // if the pointer is closer to the end of the char we increment charIndex
        // in order to position the cursor after the char
        if (Math.abs(mouseOffset.x - widthAfter) <= Math.abs(mouseOffset.x - width)) {
          charIndex++;
        }
        break;
      }
      width = widthAfter;
      charIndex++;
    }
    return Math.min(
    // if object is horizontally flipped, mirror cursor location from the end
    this.flipX ? charLength - charIndex : charIndex, this._text.length);
  }
}

const MOVE_CURSOR_UP = 'moveCursorUp';
const MOVE_CURSOR_DOWN = 'moveCursorDown';
const MOVE_CURSOR_LEFT = 'moveCursorLeft';
const MOVE_CURSOR_RIGHT = 'moveCursorRight';
const EXIT_EDITING = 'exitEditing';

// @TODO look into import { Key } from 'ts-key-enum';
// and transition from keyCode to Key
// also reduce string duplication
const keysMap = {
  9: EXIT_EDITING,
  27: EXIT_EDITING,
  33: MOVE_CURSOR_UP,
  34: MOVE_CURSOR_DOWN,
  35: MOVE_CURSOR_RIGHT,
  36: MOVE_CURSOR_LEFT,
  37: MOVE_CURSOR_LEFT,
  38: MOVE_CURSOR_UP,
  39: MOVE_CURSOR_RIGHT,
  40: MOVE_CURSOR_DOWN
};
const keysMapRtl = {
  9: EXIT_EDITING,
  27: EXIT_EDITING,
  33: MOVE_CURSOR_UP,
  34: MOVE_CURSOR_DOWN,
  35: MOVE_CURSOR_LEFT,
  36: MOVE_CURSOR_RIGHT,
  37: MOVE_CURSOR_RIGHT,
  38: MOVE_CURSOR_UP,
  39: MOVE_CURSOR_LEFT,
  40: MOVE_CURSOR_DOWN
};

/**
 * For functionalities on keyUp + ctrl || cmd
 */
const ctrlKeysMapUp = {
  67: 'copy',
  // there was a reason this wasn't deleted. for now leave it here
  88: 'cut'
};

/**
 * For functionalities on keyDown + ctrl || cmd
 */
const ctrlKeysMapDown = {
  65: 'cmdAll'
};

/**
 * Set the transform of the passed context to the same of a specific Canvas or StaticCanvas.
 * setTransform is used since this utility will RESET the ctx transform to the basic value
 * of retina scaling and viewport transform
 * It is not meant to be added to other transforms, it is used internally to preapre canvases to draw
 * @param ctx
 * @param canvas
 */
const applyCanvasTransform = (ctx, canvas) => {
  const scale = canvas.getRetinaScaling();
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  const v = canvas.viewportTransform;
  ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
};

// Declare IText protected properties to workaround TS
const protectedDefaultValues = {
  _selectionDirection: null,
  _reSpace: /\s|\r?\n/,
  inCompositionMode: false
};
const iTextDefaultValues = {
  selectionStart: 0,
  selectionEnd: 0,
  selectionColor: 'rgba(17,119,255,0.3)',
  isEditing: false,
  editable: true,
  editingBorderColor: 'rgba(102,153,255,0.25)',
  cursorWidth: 2,
  cursorColor: '',
  cursorDelay: 1000,
  cursorDuration: 600,
  caching: true,
  hiddenTextareaContainer: null,
  keysMap,
  keysMapRtl,
  ctrlKeysMapDown,
  ctrlKeysMapUp,
  ...protectedDefaultValues
};

// @TODO this is not complete

/**
 * @fires changed
 * @fires selection:changed
 * @fires editing:entered
 * @fires editing:exited
 * @fires dragstart
 * @fires drag drag event firing on the drag source
 * @fires dragend
 * @fires copy
 * @fires cut
 * @fires paste
 *
 * #### Supported key combinations
 * ```
 *   Move cursor:                    left, right, up, down
 *   Select character:               shift + left, shift + right
 *   Select text vertically:         shift + up, shift + down
 *   Move cursor by word:            alt + left, alt + right
 *   Select words:                   shift + alt + left, shift + alt + right
 *   Move cursor to line start/end:  cmd + left, cmd + right or home, end
 *   Select till start/end of line:  cmd + shift + left, cmd + shift + right or shift + home, shift + end
 *   Jump to start/end of text:      cmd + up, cmd + down
 *   Select till start/end of text:  cmd + shift + up, cmd + shift + down or shift + pgUp, shift + pgDown
 *   Delete character:               backspace
 *   Delete word:                    alt + backspace
 *   Delete line:                    cmd + backspace
 *   Forward delete:                 delete
 *   Copy text:                      ctrl/cmd + c
 *   Paste text:                     ctrl/cmd + v
 *   Cut text:                       ctrl/cmd + x
 *   Select entire text:             ctrl/cmd + a
 *   Quit editing                    tab or esc
 * ```
 *
 * #### Supported mouse/touch combination
 * ```
 *   Position cursor:                click/touch
 *   Create selection:               click/touch & drag
 *   Create selection:               click & shift + click
 *   Select word:                    double click
 *   Select line:                    triple click
 * ```
 */
class IText extends ITextClickBehavior {
  static getDefaults() {
    return {
      ...super.getDefaults(),
      ...IText.ownDefaults
    };
  }
  get type() {
    const type = super.type;
    // backward compatibility
    return type === 'itext' ? 'i-text' : type;
  }

  /**
   * Constructor
   * @param {String} text Text string
   * @param {Object} [options] Options object
   */
  constructor(text, options) {
    super(text, {
      ...IText.ownDefaults,
      ...options
    });
    this.initBehavior();
  }

  /**
   * While editing handle differently
   * @private
   * @param {string} key
   * @param {*} value
   */
  _set(key, value) {
    if (this.isEditing && this._savedProps && key in this._savedProps) {
      // @ts-expect-error irritating TS
      this._savedProps[key] = value;
      return this;
    }
    if (key === 'canvas') {
      this.canvas instanceof Canvas$1 && this.canvas.textEditingManager.remove(this);
      value instanceof Canvas$1 && value.textEditingManager.add(this);
    }
    return super._set(key, value);
  }

  /**
   * Sets selection start (left boundary of a selection)
   * @param {Number} index Index to set selection start to
   */
  setSelectionStart(index) {
    index = Math.max(index, 0);
    this._updateAndFire('selectionStart', index);
  }

  /**
   * Sets selection end (right boundary of a selection)
   * @param {Number} index Index to set selection end to
   */
  setSelectionEnd(index) {
    index = Math.min(index, this.text.length);
    this._updateAndFire('selectionEnd', index);
  }

  /**
   * @private
   * @param {String} property 'selectionStart' or 'selectionEnd'
   * @param {Number} index new position of property
   */
  _updateAndFire(property, index) {
    if (this[property] !== index) {
      this._fireSelectionChanged();
      this[property] = index;
    }
    this._updateTextarea();
  }

  /**
   * Fires the even of selection changed
   * @private
   */
  _fireSelectionChanged() {
    this.fire('selection:changed');
    this.canvas && this.canvas.fire('text:selection:changed', {
      target: this
    });
  }

  /**
   * Initialize text dimensions. Render all text on given context
   * or on a offscreen canvas to get the text width with measureText.
   * Updates this.width and this.height with the proper values.
   * Does not return dimensions.
   * @private
   */
  initDimensions() {
    this.isEditing && this.initDelayedCursor();
    super.initDimensions();
  }

  /**
   * Gets style of a current selection/cursor (at the start position)
   * if startIndex or endIndex are not provided, selectionStart or selectionEnd will be used.
   * @param {Number} startIndex Start index to get styles at
   * @param {Number} endIndex End index to get styles at, if not specified selectionEnd or startIndex + 1
   * @param {Boolean} [complete] get full style or not
   * @return {Array} styles an array with one, zero or more Style objects
   */
  getSelectionStyles() {
    let startIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.selectionStart || 0;
    let endIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.selectionEnd;
    let complete = arguments.length > 2 ? arguments[2] : undefined;
    return super.getSelectionStyles(startIndex, endIndex, complete);
  }

  /**
   * Sets style of a current selection, if no selection exist, do not set anything.
   * @param {Object} [styles] Styles object
   * @param {Number} [startIndex] Start index to get styles at
   * @param {Number} [endIndex] End index to get styles at, if not specified selectionEnd or startIndex + 1
   */
  setSelectionStyles(styles) {
    let startIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.selectionStart || 0;
    let endIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.selectionEnd;
    return super.setSelectionStyles(styles, startIndex, endIndex);
  }

  /**
   * Returns 2d representation (lineIndex and charIndex) of cursor (or selection start)
   * @param {Number} [selectionStart] Optional index. When not given, current selectionStart is used.
   * @param {Boolean} [skipWrapping] consider the location for unwrapped lines. useful to manage styles.
   */
  get2DCursorLocation() {
    let selectionStart = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.selectionStart;
    let skipWrapping = arguments.length > 1 ? arguments[1] : undefined;
    return super.get2DCursorLocation(selectionStart, skipWrapping);
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  render(ctx) {
    super.render(ctx);
    // clear the cursorOffsetCache, so we ensure to calculate once per renderCursor
    // the correct position but not at every cursor animation.
    this.cursorOffsetCache = {};
    this.renderCursorOrSelection();
  }

  /**
   * @override block cursor/selection logic while rendering the exported canvas
   * @todo this workaround should be replaced with a more robust solution
   */
  toCanvasElement(options) {
    const isEditing = this.isEditing;
    this.isEditing = false;
    const canvas = super.toCanvasElement(options);
    this.isEditing = isEditing;
    return canvas;
  }

  /**
   * Renders cursor or selection (depending on what exists)
   * it does on the contextTop. If contextTop is not available, do nothing.
   */
  renderCursorOrSelection() {
    if (!this.isEditing || !this.canvas) {
      return;
    }
    const ctx = this.clearContextTop(true);
    if (!ctx) {
      return;
    }
    const boundaries = this._getCursorBoundaries();
    const ancestors = this.findAncestorsWithClipPath();
    const hasAncestorsWithClipping = ancestors.length > 0;
    let drawingCtx = ctx;
    let drawingCanvas = undefined;
    if (hasAncestorsWithClipping) {
      // we have some clipPath, we need to draw the selection on an intermediate layer.
      drawingCanvas = createCanvasElementFor(ctx.canvas);
      drawingCtx = drawingCanvas.getContext('2d');
      applyCanvasTransform(drawingCtx, this.canvas);
      const m = this.calcTransformMatrix();
      drawingCtx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
    }
    if (this.selectionStart === this.selectionEnd && !this.inCompositionMode) {
      this.renderCursor(drawingCtx, boundaries);
    } else {
      this.renderSelection(drawingCtx, boundaries);
    }
    if (hasAncestorsWithClipping) {
      // we need a neutral context.
      // this won't work for nested clippaths in which a clippath
      // has its own clippath
      for (const ancestor of ancestors) {
        const clipPath = ancestor.clipPath;
        const clippingCanvas = createCanvasElementFor(ctx.canvas);
        const clippingCtx = clippingCanvas.getContext('2d');
        applyCanvasTransform(clippingCtx, this.canvas);
        // position the ctx in the center of the outer ancestor
        if (!clipPath.absolutePositioned) {
          const m = ancestor.calcTransformMatrix();
          clippingCtx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
        }
        clipPath.transform(clippingCtx);
        // we assign an empty drawing context, we don't plan to have this working for nested clippaths for now
        clipPath.drawObject(clippingCtx, true, {});
        this.drawClipPathOnCache(drawingCtx, clipPath, clippingCanvas);
      }
    }
    if (hasAncestorsWithClipping) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(drawingCanvas, 0, 0);
    }
    this.canvas.contextTopDirty = true;
    ctx.restore();
  }

  /**
   * Finds and returns an array of clip paths that are applied to the parent
   * group(s) of the current FabricObject instance. The object's hierarchy is
   * traversed upwards (from the current object towards the root of the canvas),
   * checking each parent object for the presence of a `clipPath` that is not
   * absolutely positioned.
   */
  findAncestorsWithClipPath() {
    const clipPathAncestors = [];
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let obj = this;
    while (obj) {
      if (obj.clipPath) {
        clipPathAncestors.push(obj);
      }
      obj = obj.parent;
    }
    return clipPathAncestors;
  }

  /**
   * Returns cursor boundaries (left, top, leftOffset, topOffset)
   * left/top are left/top of entire text box
   * leftOffset/topOffset are offset from that left/top point of a text box
   * @private
   * @param {number} [index] index from start
   * @param {boolean} [skipCaching]
   */
  _getCursorBoundaries() {
    let index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.selectionStart;
    let skipCaching = arguments.length > 1 ? arguments[1] : undefined;
    const left = this._getLeftOffset(),
      top = this._getTopOffset(),
      offsets = this._getCursorBoundariesOffsets(index, skipCaching);
    return {
      left: left,
      top: top,
      leftOffset: offsets.left,
      topOffset: offsets.top
    };
  }

  /**
   * Caches and returns cursor left/top offset relative to instance's center point
   * @private
   * @param {number} index index from start
   * @param {boolean} [skipCaching]
   */
  _getCursorBoundariesOffsets(index, skipCaching) {
    if (skipCaching) {
      return this.__getCursorBoundariesOffsets(index);
    }
    if (this.cursorOffsetCache && 'top' in this.cursorOffsetCache) {
      return this.cursorOffsetCache;
    }
    return this.cursorOffsetCache = this.__getCursorBoundariesOffsets(index);
  }

  /**
   * Calculates cursor left/top offset relative to instance's center point
   * @private
   * @param {number} index index from start
   */
  __getCursorBoundariesOffsets(index) {
    let topOffset = 0,
      leftOffset = 0;
    const {
      charIndex,
      lineIndex
    } = this.get2DCursorLocation(index);
    const {
      textAlign,
      direction
    } = this;
    for (let i = 0; i < lineIndex; i++) {
      topOffset += this.getHeightOfLine(i);
    }
    const lineLeftOffset = this._getLineLeftOffset(lineIndex);
    const bound = this.__charBounds[lineIndex][charIndex];
    bound && (leftOffset = bound.left);
    if (this.charSpacing !== 0 && charIndex === this._textLines[lineIndex].length) {
      leftOffset -= this._getWidthOfCharSpacing();
    }
    let left = lineLeftOffset + (leftOffset > 0 ? leftOffset : 0);
    if (direction === RTL) {
      if (textAlign === RIGHT || textAlign === JUSTIFY || textAlign === JUSTIFY_RIGHT) {
        left *= -1;
      } else if (textAlign === LEFT || textAlign === JUSTIFY_LEFT) {
        left = lineLeftOffset - (leftOffset > 0 ? leftOffset : 0);
      } else if (textAlign === CENTER || textAlign === JUSTIFY_CENTER) {
        left = lineLeftOffset - (leftOffset > 0 ? leftOffset : 0);
      }
    }
    return {
      top: topOffset,
      left
    };
  }

  /**
   * Renders cursor on context Top, outside the animation cycle, on request
   * Used for the drag/drop effect.
   * If contextTop is not available, do nothing.
   */
  renderCursorAt(selectionStart) {
    this._renderCursor(this.canvas.contextTop, this._getCursorBoundaries(selectionStart, true), selectionStart);
  }

  /**
   * Renders cursor
   * @param {Object} boundaries
   * @param {CanvasRenderingContext2D} ctx transformed context to draw on
   */
  renderCursor(ctx, boundaries) {
    this._renderCursor(ctx, boundaries, this.selectionStart);
  }

  /**
   * Return the data needed to render the cursor for given selection start
   * The left,top are relative to the object, while width and height are prescaled
   * to look think with canvas zoom and object scaling,
   * so they depend on canvas and object scaling
   */
  getCursorRenderingData() {
    let selectionStart = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.selectionStart;
    let boundaries = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._getCursorBoundaries(selectionStart);
    const cursorLocation = this.get2DCursorLocation(selectionStart),
      lineIndex = cursorLocation.lineIndex,
      charIndex = cursorLocation.charIndex > 0 ? cursorLocation.charIndex - 1 : 0,
      charHeight = this.getValueOfPropertyAt(lineIndex, charIndex, 'fontSize'),
      multiplier = this.getObjectScaling().x * this.canvas.getZoom(),
      cursorWidth = this.cursorWidth / multiplier,
      dy = this.getValueOfPropertyAt(lineIndex, charIndex, 'deltaY'),
      topOffset = boundaries.topOffset + (1 - this._fontSizeFraction) * this.getHeightOfLine(lineIndex) / this.lineHeight - charHeight * (1 - this._fontSizeFraction);
    return {
      color: this.cursorColor || this.getValueOfPropertyAt(lineIndex, charIndex, 'fill'),
      opacity: this._currentCursorOpacity,
      left: boundaries.left + boundaries.leftOffset - cursorWidth / 2,
      top: topOffset + boundaries.top + dy,
      width: cursorWidth,
      height: charHeight
    };
  }

  /**
   * Render the cursor at the given selectionStart.
   * @param {CanvasRenderingContext2D} ctx transformed context to draw on
   */
  _renderCursor(ctx, boundaries, selectionStart) {
    const {
      color,
      opacity,
      left,
      top,
      width,
      height
    } = this.getCursorRenderingData(selectionStart, boundaries);
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.fillRect(left, top, width, height);
  }

  /**
   * Renders text selection
   * @param {Object} boundaries Object with left/top/leftOffset/topOffset
   * @param {CanvasRenderingContext2D} ctx transformed context to draw on
   */
  renderSelection(ctx, boundaries) {
    const selection = {
      selectionStart: this.inCompositionMode ? this.hiddenTextarea.selectionStart : this.selectionStart,
      selectionEnd: this.inCompositionMode ? this.hiddenTextarea.selectionEnd : this.selectionEnd
    };
    this._renderSelection(ctx, selection, boundaries);
  }

  /**
   * Renders drag start text selection
   */
  renderDragSourceEffect() {
    const dragStartSelection = this.draggableTextDelegate.getDragStartSelection();
    this._renderSelection(this.canvas.contextTop, dragStartSelection, this._getCursorBoundaries(dragStartSelection.selectionStart, true));
  }
  renderDropTargetEffect(e) {
    const dragSelection = this.getSelectionStartFromPointer(e);
    this.renderCursorAt(dragSelection);
  }

  /**
   * Renders text selection
   * @private
   * @param {{ selectionStart: number, selectionEnd: number }} selection
   * @param {Object} boundaries Object with left/top/leftOffset/topOffset
   * @param {CanvasRenderingContext2D} ctx transformed context to draw on
   */
  _renderSelection(ctx, selection, boundaries) {
    const {
      textAlign,
      direction
    } = this;
    const selectionStart = selection.selectionStart,
      selectionEnd = selection.selectionEnd,
      isJustify = textAlign.includes(JUSTIFY),
      start = this.get2DCursorLocation(selectionStart),
      end = this.get2DCursorLocation(selectionEnd),
      startLine = start.lineIndex,
      endLine = end.lineIndex,
      startChar = start.charIndex < 0 ? 0 : start.charIndex,
      endChar = end.charIndex < 0 ? 0 : end.charIndex;
    for (let i = startLine; i <= endLine; i++) {
      const lineOffset = this._getLineLeftOffset(i) || 0;
      let lineHeight = this.getHeightOfLine(i),
        realLineHeight = 0,
        boxStart = 0,
        boxEnd = 0;
      if (i === startLine) {
        boxStart = this.__charBounds[startLine][startChar].left;
      }
      if (i >= startLine && i < endLine) {
        boxEnd = isJustify && !this.isEndOfWrapping(i) ? this.width : this.getLineWidth(i) || 5; // WTF is this 5?
      } else if (i === endLine) {
        if (endChar === 0) {
          boxEnd = this.__charBounds[endLine][endChar].left;
        } else {
          const charSpacing = this._getWidthOfCharSpacing();
          boxEnd = this.__charBounds[endLine][endChar - 1].left + this.__charBounds[endLine][endChar - 1].width - charSpacing;
        }
      }
      realLineHeight = lineHeight;
      if (this.lineHeight < 1 || i === endLine && this.lineHeight > 1) {
        lineHeight /= this.lineHeight;
      }
      let drawStart = boundaries.left + lineOffset + boxStart,
        drawHeight = lineHeight,
        extraTop = 0;
      const drawWidth = boxEnd - boxStart;
      if (this.inCompositionMode) {
        ctx.fillStyle = this.compositionColor || 'black';
        drawHeight = 1;
        extraTop = lineHeight;
      } else {
        ctx.fillStyle = this.selectionColor;
      }
      if (direction === RTL) {
        if (textAlign === RIGHT || textAlign === JUSTIFY || textAlign === JUSTIFY_RIGHT) {
          drawStart = this.width - drawStart - drawWidth;
        } else if (textAlign === LEFT || textAlign === JUSTIFY_LEFT) {
          drawStart = boundaries.left + lineOffset - boxEnd;
        } else if (textAlign === CENTER || textAlign === JUSTIFY_CENTER) {
          drawStart = boundaries.left + lineOffset - boxEnd;
        }
      }
      ctx.fillRect(drawStart, boundaries.top + boundaries.topOffset + extraTop, drawWidth, drawHeight);
      boundaries.topOffset += realLineHeight;
    }
  }

  /**
   * High level function to know the height of the cursor.
   * the currentChar is the one that precedes the cursor
   * Returns fontSize of char at the current cursor
   * Unused from the library, is for the end user
   * @return {Number} Character font size
   */
  getCurrentCharFontSize() {
    const cp = this._getCurrentCharIndex();
    return this.getValueOfPropertyAt(cp.l, cp.c, 'fontSize');
  }

  /**
   * High level function to know the color of the cursor.
   * the currentChar is the one that precedes the cursor
   * Returns color (fill) of char at the current cursor
   * if the text object has a pattern or gradient for filler, it will return that.
   * Unused by the library, is for the end user
   * @return {String | TFiller} Character color (fill)
   */
  getCurrentCharColor() {
    const cp = this._getCurrentCharIndex();
    return this.getValueOfPropertyAt(cp.l, cp.c, FILL);
  }

  /**
   * Returns the cursor position for the getCurrent.. functions
   * @private
   */
  _getCurrentCharIndex() {
    const cursorPosition = this.get2DCursorLocation(this.selectionStart, true),
      charIndex = cursorPosition.charIndex > 0 ? cursorPosition.charIndex - 1 : 0;
    return {
      l: cursorPosition.lineIndex,
      c: charIndex
    };
  }
  dispose() {
    this.exitEditingImpl();
    this.draggableTextDelegate.dispose();
    super.dispose();
  }
}
/**
 * Index where text selection starts (or where cursor is when there is no selection)
 * @type Number
 */
/**
 * Index where text selection ends
 * @type Number
 */
/**
 * Color of text selection
 * @type String
 */
/**
 * Indicates whether text is in editing mode
 * @type Boolean
 */
/**
 * Indicates whether a text can be edited
 * @type Boolean
 */
/**
 * Border color of text object while it's in editing mode
 * @type String
 */
/**
 * Width of cursor (in px)
 * @type Number
 */
/**
 * Color of text cursor color in editing mode.
 * if not set (default) will take color from the text.
 * if set to a color value that fabric can understand, it will
 * be used instead of the color of the text at the current position.
 * @type String
 */
/**
 * Delay between cursor blink (in ms)
 * @type Number
 */
/**
 * Duration of cursor fade in (in ms)
 * @type Number
 */
/**
 * Indicates whether internal text char widths can be cached
 * @type Boolean
 */
_defineProperty(IText, "ownDefaults", iTextDefaultValues);
_defineProperty(IText, "type", 'IText');
classRegistry.setClass(IText);
// legacy
classRegistry.setClass(IText, 'i-text');

// @TODO: Many things here are configuration related and shouldn't be on the class nor prototype
// regexes, list of properties that are not suppose to change by instances, magic consts.
// this will be a separated effort
const textboxDefaultValues = {
  minWidth: 20,
  dynamicMinWidth: 2,
  lockScalingFlip: true,
  noScaleCache: false,
  _wordJoiners: /[ \t\r]/,
  splitByGrapheme: false
};

// @TODO this is not complete

/**
 * Textbox class, based on IText, allows the user to resize the text rectangle
 * and wraps lines automatically. Textboxes have their Y scaling locked, the
 * user can only change width. Height is adjusted automatically based on the
 * wrapping of lines.
 */
class Textbox extends IText {
  static getDefaults() {
    return {
      ...super.getDefaults(),
      ...Textbox.ownDefaults
    };
  }

  /**
   * Constructor
   * @param {String} text Text string
   * @param {Object} [options] Options object
   */
  constructor(text, options) {
    super(text, {
      ...Textbox.ownDefaults,
      ...options
    });
  }

  /**
   * Creates the default control object.
   * If you prefer to have on instance of controls shared among all objects
   * make this function return an empty object and add controls to the ownDefaults object
   */
  static createControls() {
    return {
      controls: createTextboxDefaultControls()
    };
  }

  /**
   * Unlike superclass's version of this function, Textbox does not update
   * its width.
   * @private
   * @override
   */
  initDimensions() {
    if (!this.initialized) {
      return;
    }
    this.isEditing && this.initDelayedCursor();
    this._clearCache();
    // clear dynamicMinWidth as it will be different after we re-wrap line
    this.dynamicMinWidth = 0;
    // wrap lines
    this._styleMap = this._generateStyleMap(this._splitText());
    // if after wrapping, the width is smaller than dynamicMinWidth, change the width and re-wrap
    if (this.dynamicMinWidth > this.width) {
      this._set('width', this.dynamicMinWidth);
    }
    if (this.textAlign.includes(JUSTIFY)) {
      // once text is measured we need to make space fatter to make justified text.
      this.enlargeSpaces();
    }
    // clear cache and re-calculate height
    this.height = this.calcTextHeight();
  }

  /**
   * Generate an object that translates the style object so that it is
   * broken up by visual lines (new lines and automatic wrapping).
   * The original text styles object is broken up by actual lines (new lines only),
   * which is only sufficient for Text / IText
   * @private
   */
  _generateStyleMap(textInfo) {
    let realLineCount = 0,
      realLineCharCount = 0,
      charCount = 0;
    const map = {};
    for (let i = 0; i < textInfo.graphemeLines.length; i++) {
      if (textInfo.graphemeText[charCount] === '\n' && i > 0) {
        realLineCharCount = 0;
        charCount++;
        realLineCount++;
      } else if (!this.splitByGrapheme && this._reSpaceAndTab.test(textInfo.graphemeText[charCount]) && i > 0) {
        // this case deals with space's that are removed from end of lines when wrapping
        realLineCharCount++;
        charCount++;
      }
      map[i] = {
        line: realLineCount,
        offset: realLineCharCount
      };
      charCount += textInfo.graphemeLines[i].length;
      realLineCharCount += textInfo.graphemeLines[i].length;
    }
    return map;
  }

  /**
   * Returns true if object has a style property or has it on a specified line
   * @param {Number} lineIndex
   * @return {Boolean}
   */
  styleHas(property, lineIndex) {
    if (this._styleMap && !this.isWrapping) {
      const map = this._styleMap[lineIndex];
      if (map) {
        lineIndex = map.line;
      }
    }
    return super.styleHas(property, lineIndex);
  }

  /**
   * Returns true if object has no styling or no styling in a line
   * @param {Number} lineIndex , lineIndex is on wrapped lines.
   * @return {Boolean}
   */
  isEmptyStyles(lineIndex) {
    if (!this.styles) {
      return true;
    }
    let offset = 0,
      nextLineIndex = lineIndex + 1,
      nextOffset,
      shouldLimit = false;
    const map = this._styleMap[lineIndex],
      mapNextLine = this._styleMap[lineIndex + 1];
    if (map) {
      lineIndex = map.line;
      offset = map.offset;
    }
    if (mapNextLine) {
      nextLineIndex = mapNextLine.line;
      shouldLimit = nextLineIndex === lineIndex;
      nextOffset = mapNextLine.offset;
    }
    const obj = typeof lineIndex === 'undefined' ? this.styles : {
      line: this.styles[lineIndex]
    };
    for (const p1 in obj) {
      for (const p2 in obj[p1]) {
        const p2Number = parseInt(p2, 10);
        if (p2Number >= offset && (!shouldLimit || p2Number < nextOffset)) {
          for (const p3 in obj[p1][p2]) {
            return false;
          }
        }
      }
    }
    return true;
  }

  /**
   * @protected
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @return {TextStyleDeclaration} a style object reference to the existing one or a new empty object when undefined
   */
  _getStyleDeclaration(lineIndex, charIndex) {
    if (this._styleMap && !this.isWrapping) {
      const map = this._styleMap[lineIndex];
      if (!map) {
        return {};
      }
      lineIndex = map.line;
      charIndex = map.offset + charIndex;
    }
    return super._getStyleDeclaration(lineIndex, charIndex);
  }

  /**
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @param {Object} style
   * @private
   */
  _setStyleDeclaration(lineIndex, charIndex, style) {
    const map = this._styleMap[lineIndex];
    super._setStyleDeclaration(map.line, map.offset + charIndex, style);
  }

  /**
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @private
   */
  _deleteStyleDeclaration(lineIndex, charIndex) {
    const map = this._styleMap[lineIndex];
    super._deleteStyleDeclaration(map.line, map.offset + charIndex);
  }

  /**
   * probably broken need a fix
   * Returns the real style line that correspond to the wrapped lineIndex line
   * Used just to verify if the line does exist or not.
   * @param {Number} lineIndex
   * @returns {Boolean} if the line exists or not
   * @private
   */
  _getLineStyle(lineIndex) {
    const map = this._styleMap[lineIndex];
    return !!this.styles[map.line];
  }

  /**
   * Set the line style to an empty object so that is initialized
   * @param {Number} lineIndex
   * @param {Object} style
   * @private
   */
  _setLineStyle(lineIndex) {
    const map = this._styleMap[lineIndex];
    super._setLineStyle(map.line);
  }

  /**
   * Wraps text using the 'width' property of Textbox. First this function
   * splits text on newlines, so we preserve newlines entered by the user.
   * Then it wraps each line using the width of the Textbox by calling
   * _wrapLine().
   * @param {Array} lines The string array of text that is split into lines
   * @param {Number} desiredWidth width you want to wrap to
   * @returns {Array} Array of lines
   */
  _wrapText(lines, desiredWidth) {
    this.isWrapping = true;
    // extract all thewords and the widths to optimally wrap lines.
    const data = this.getGraphemeDataForRender(lines);
    const wrapped = [];
    for (let i = 0; i < data.wordsData.length; i++) {
      wrapped.push(...this._wrapLine(i, desiredWidth, data));
    }
    this.isWrapping = false;
    return wrapped;
  }

  /**
   * For each line of text terminated by an hard line stop,
   * measure each word width and extract the largest word from all.
   * The returned words here are the one that at the end will be rendered.
   * @param {string[]} lines the lines we need to measure
   *
   */
  getGraphemeDataForRender(lines) {
    const splitByGrapheme = this.splitByGrapheme,
      infix = splitByGrapheme ? '' : ' ';
    let largestWordWidth = 0;
    const data = lines.map((line, lineIndex) => {
      let offset = 0;
      const wordsOrGraphemes = splitByGrapheme ? this.graphemeSplit(line) : this.wordSplit(line);
      if (wordsOrGraphemes.length === 0) {
        return [{
          word: [],
          width: 0
        }];
      }
      return wordsOrGraphemes.map(word => {
        // if using splitByGrapheme words are already in graphemes.
        const graphemeArray = splitByGrapheme ? [word] : this.graphemeSplit(word);
        const width = this._measureWord(graphemeArray, lineIndex, offset);
        largestWordWidth = Math.max(width, largestWordWidth);
        offset += graphemeArray.length + infix.length;
        return {
          word: graphemeArray,
          width
        };
      });
    });
    return {
      wordsData: data,
      largestWordWidth
    };
  }

  /**
   * Helper function to measure a string of text, given its lineIndex and charIndex offset
   * It gets called when charBounds are not available yet.
   * Override if necessary
   * Use with {@link Textbox#wordSplit}
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {String} text
   * @param {number} lineIndex
   * @param {number} charOffset
   * @returns {number}
   */
  _measureWord(word, lineIndex) {
    let charOffset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    let width = 0,
      prevGrapheme;
    const skipLeft = true;
    for (let i = 0, len = word.length; i < len; i++) {
      const box = this._getGraphemeBox(word[i], lineIndex, i + charOffset, prevGrapheme, skipLeft);
      width += box.kernedWidth;
      prevGrapheme = word[i];
    }
    return width;
  }

  /**
   * Override this method to customize word splitting
   * Use with {@link Textbox#_measureWord}
   * @param {string} value
   * @returns {string[]} array of words
   */
  wordSplit(value) {
    return value.split(this._wordJoiners);
  }

  /**
   * Wraps a line of text using the width of the Textbox as desiredWidth
   * and leveraging the known width o words from GraphemeData
   * @private
   * @param {Number} lineIndex
   * @param {Number} desiredWidth width you want to wrap the line to
   * @param {GraphemeData} graphemeData an object containing all the lines' words width.
   * @param {Number} reservedSpace space to remove from wrapping for custom functionalities
   * @returns {Array} Array of line(s) into which the given text is wrapped
   * to.
   */
  _wrapLine(lineIndex, desiredWidth, _ref) {
    let {
      largestWordWidth,
      wordsData
    } = _ref;
    let reservedSpace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    const additionalSpace = this._getWidthOfCharSpacing(),
      splitByGrapheme = this.splitByGrapheme,
      graphemeLines = [],
      infix = splitByGrapheme ? '' : ' ';
    let lineWidth = 0,
      line = [],
      // spaces in different languages?
      offset = 0,
      infixWidth = 0,
      lineJustStarted = true;
    desiredWidth -= reservedSpace;
    const maxWidth = Math.max(desiredWidth, largestWordWidth, this.dynamicMinWidth);
    // layout words
    const data = wordsData[lineIndex];
    offset = 0;
    let i;
    for (i = 0; i < data.length; i++) {
      const {
        word,
        width: wordWidth
      } = data[i];
      offset += word.length;
      lineWidth += infixWidth + wordWidth - additionalSpace;
      if (lineWidth > maxWidth && !lineJustStarted) {
        graphemeLines.push(line);
        line = [];
        lineWidth = wordWidth;
        lineJustStarted = true;
      } else {
        lineWidth += additionalSpace;
      }
      if (!lineJustStarted && !splitByGrapheme) {
        line.push(infix);
      }
      line = line.concat(word);
      infixWidth = splitByGrapheme ? 0 : this._measureWord([infix], lineIndex, offset);
      offset++;
      lineJustStarted = false;
    }
    i && graphemeLines.push(line);

    // TODO: this code is probably not necessary anymore.
    // it can be moved out of this function since largestWordWidth is now
    // known in advance
    if (largestWordWidth + reservedSpace > this.dynamicMinWidth) {
      this.dynamicMinWidth = largestWordWidth - additionalSpace + reservedSpace;
    }
    return graphemeLines;
  }

  /**
   * Detect if the text line is ended with an hard break
   * text and itext do not have wrapping, return false
   * @param {Number} lineIndex text to split
   * @return {Boolean}
   */
  isEndOfWrapping(lineIndex) {
    if (!this._styleMap[lineIndex + 1]) {
      // is last line, return true;
      return true;
    }
    if (this._styleMap[lineIndex + 1].line !== this._styleMap[lineIndex].line) {
      // this is last line before a line break, return true;
      return true;
    }
    return false;
  }

  /**
   * Detect if a line has a linebreak and so we need to account for it when moving
   * and counting style.
   * This is important only for splitByGrapheme at the end of wrapping.
   * If we are not wrapping the offset is always 1
   * @return Number
   */
  missingNewlineOffset(lineIndex, skipWrapping) {
    if (this.splitByGrapheme && !skipWrapping) {
      return this.isEndOfWrapping(lineIndex) ? 1 : 0;
    }
    return 1;
  }

  /**
   * Gets lines of text to render in the Textbox. This function calculates
   * text wrapping on the fly every time it is called.
   * @param {String} text text to split
   * @returns {Array} Array of lines in the Textbox.
   * @override
   */
  _splitTextIntoLines(text) {
    const newText = super._splitTextIntoLines(text),
      graphemeLines = this._wrapText(newText.lines, this.width),
      lines = new Array(graphemeLines.length);
    for (let i = 0; i < graphemeLines.length; i++) {
      lines[i] = graphemeLines[i].join('');
    }
    newText.lines = lines;
    newText.graphemeLines = graphemeLines;
    return newText;
  }
  getMinWidth() {
    return Math.max(this.minWidth, this.dynamicMinWidth);
  }
  _removeExtraneousStyles() {
    const linesToKeep = new Map();
    for (const prop in this._styleMap) {
      const propNumber = parseInt(prop, 10);
      if (this._textLines[propNumber]) {
        const lineIndex = this._styleMap[prop].line;
        linesToKeep.set(`${lineIndex}`, true);
      }
    }
    for (const prop in this.styles) {
      if (!linesToKeep.has(prop)) {
        delete this.styles[prop];
      }
    }
  }

  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject() {
    let propertiesToInclude = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return super.toObject(['minWidth', 'splitByGrapheme', ...propertiesToInclude]);
  }
}
/**
 * Minimum width of textbox, in pixels.
 * @type Number
 */
/**
 * Minimum calculated width of a textbox, in pixels.
 * fixed to 2 so that an empty textbox cannot go to 0
 * and is still selectable without text.
 * @type Number
 */
/**
 * Use this boolean property in order to split strings that have no white space concept.
 * this is a cheap way to help with chinese/japanese
 * @type Boolean
 * @since 2.6.0
 */
_defineProperty(Textbox, "type", 'Textbox');
_defineProperty(Textbox, "textLayoutProperties", [...IText.textLayoutProperties, 'width']);
_defineProperty(Textbox, "ownDefaults", textboxDefaultValues);
classRegistry.setClass(Textbox);

/**
 * Layout will adjust the bounding box to match the clip path bounding box.
 */
class ClipPathLayout extends LayoutStrategy {
  shouldPerformLayout(context) {
    return !!context.target.clipPath && super.shouldPerformLayout(context);
  }
  shouldLayoutClipPath() {
    return false;
  }
  calcLayoutResult(context, objects) {
    const {
      target
    } = context;
    const {
      clipPath,
      group
    } = target;
    if (!clipPath || !this.shouldPerformLayout(context)) {
      return;
    }
    // TODO: remove stroke calculation from this case
    const {
      width,
      height
    } = makeBoundingBoxFromPoints(getObjectBounds(target, clipPath));
    const size = new Point(width, height);
    if (clipPath.absolutePositioned) {
      //  we want the center point to exist in group's containing plane
      const clipPathCenter = sendPointToPlane(clipPath.getRelativeCenterPoint(), undefined, group ? group.calcTransformMatrix() : undefined);
      return {
        center: clipPathCenter,
        size
      };
    } else {
      //  we want the center point to exist in group's containing plane, so we send it upwards
      const clipPathCenter = clipPath.getRelativeCenterPoint().transform(target.calcOwnMatrix(), true);
      if (this.shouldPerformLayout(context)) {
        // the clip path is positioned relative to the group's center which is affected by the bbox
        // so we first calculate the bbox
        const {
          center = new Point(),
          correction = new Point()
        } = this.calcBoundingBox(objects, context) || {};
        return {
          center: center.add(clipPathCenter),
          correction: correction.subtract(clipPathCenter),
          size
        };
      } else {
        return {
          center: target.getRelativeCenterPoint().add(clipPathCenter),
          size
        };
      }
    }
  }
}
_defineProperty(ClipPathLayout, "type", 'clip-path');
classRegistry.setClass(ClipPathLayout);

/**
 * Layout will keep target's initial size.
 */
class FixedLayout extends LayoutStrategy {
  /**
   * @override respect target's initial size
   */
  getInitialSize(_ref, _ref2) {
    let {
      target
    } = _ref;
    let {
      size
    } = _ref2;
    return new Point(target.width || size.x, target.height || size.y);
  }
}
_defineProperty(FixedLayout, "type", 'fixed');
classRegistry.setClass(FixedLayout);

/**
 * Today the LayoutManager class also takes care of subscribing event handlers
 * to update the group layout when the group is interactive and a transform is applied
 * to a child object.
 * The ActiveSelection is never interactive, but it could contain objects from
 * groups that are.
 * The standard LayoutManager would subscribe the children of the activeSelection to
 * perform layout changes to the active selection itself, what we need instead is that
 * the transformation applied to the active selection will trigger changes to the
 * original group of the children ( the one referenced under the parent property )
 * This subclass of the LayoutManager has a single duty to fill the gap of this difference.`
 */
class ActiveSelectionLayoutManager extends LayoutManager {
  subscribeTargets(context) {
    const activeSelection = context.target;
    const parents = context.targets.reduce((parents, target) => {
      target.parent && parents.add(target.parent);
      return parents;
    }, new Set());
    parents.forEach(parent => {
      parent.layoutManager.subscribeTargets({
        target: parent,
        targets: [activeSelection]
      });
    });
  }

  /**
   * unsubscribe from parent only if all its children were deselected
   */
  unsubscribeTargets(context) {
    const activeSelection = context.target;
    const selectedObjects = activeSelection.getObjects();
    const parents = context.targets.reduce((parents, target) => {
      target.parent && parents.add(target.parent);
      return parents;
    }, new Set());
    parents.forEach(parent => {
      !selectedObjects.some(object => object.parent === parent) && parent.layoutManager.unsubscribeTargets({
        target: parent,
        targets: [activeSelection]
      });
    });
  }
}

const activeSelectionDefaultValues = {
  multiSelectionStacking: 'canvas-stacking'
};

/**
 * Used by Canvas to manage selection.
 *
 * @example
 * class MyActiveSelection extends ActiveSelection {
 *   ...
 * }
 *
 * // override the default `ActiveSelection` class
 * classRegistry.setClass(MyActiveSelection)
 */
class ActiveSelection extends Group {
  static getDefaults() {
    return {
      ...super.getDefaults(),
      ...ActiveSelection.ownDefaults
    };
  }

  /**
   * The ActiveSelection needs to use the ActiveSelectionLayoutManager
   * or selections on interactive groups may be broken
   */

  /**
   * controls how selected objects are added during a multiselection event
   * - `canvas-stacking` adds the selected object to the active selection while respecting canvas object stacking order
   * - `selection-order` adds the selected object to the top of the stack,
   * meaning that the stack is ordered by the order in which objects were selected
   * @default `canvas-stacking`
   */

  constructor() {
    let objects = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super();
    Object.assign(this, ActiveSelection.ownDefaults);
    this.setOptions(options);
    const {
      left,
      top,
      layoutManager
    } = options;
    this.groupInit(objects, {
      left,
      top,
      layoutManager: layoutManager !== null && layoutManager !== void 0 ? layoutManager : new ActiveSelectionLayoutManager()
    });
  }

  /**
   * @private
   */
  _shouldSetNestedCoords() {
    return true;
  }

  /**
   * @private
   * @override we don't want the selection monitor to be active
   */
  __objectSelectionMonitor() {
    //  noop
  }

  /**
   * Adds objects with respect to {@link multiSelectionStacking}
   * @param targets object to add to selection
   */
  multiSelectAdd() {
    for (var _len = arguments.length, targets = new Array(_len), _key = 0; _key < _len; _key++) {
      targets[_key] = arguments[_key];
    }
    if (this.multiSelectionStacking === 'selection-order') {
      this.add(...targets);
    } else {
      //  respect object stacking as it is on canvas
      //  perf enhancement for large ActiveSelection: consider a binary search of `isInFrontOf`
      targets.forEach(target => {
        const index = this._objects.findIndex(obj => obj.isInFrontOf(target));
        const insertAt = index === -1 ?
        //  `target` is in front of all other objects
        this.size() : index;
        this.insertAt(insertAt, target);
      });
    }
  }

  /**
   * @override block ancestors/descendants of selected objects from being selected to prevent a circular object tree
   */
  canEnterGroup(object) {
    if (this.getObjects().some(o => o.isDescendantOf(object) || object.isDescendantOf(o))) {
      //  prevent circular object tree
      log('error', 'ActiveSelection: circular object trees are not supported, this call has no effect');
      return false;
    }
    return super.canEnterGroup(object);
  }

  /**
   * Change an object so that it can be part of an active selection.
   * this method is called by multiselectAdd from canvas code.
   * @private
   * @param {FabricObject} object
   * @param {boolean} [removeParentTransform] true if object is in canvas coordinate plane
   */
  enterGroup(object, removeParentTransform) {
    // This condition check that the object has currently a group, and the group
    // is also its parent, meaning that is not in an active selection, but is
    // in a normal group.
    if (object.parent && object.parent === object.group) {
      // Disconnect the object from the group functionalities, but keep the ref parent intact
      // for later re-enter
      object.parent._exitGroup(object);
      // in this case the object is probably inside an active selection.
    } else if (object.group && object.parent !== object.group) {
      // in this case group.remove will also clear the old parent reference.
      object.group.remove(object);
    }
    // enter the active selection from a render perspective
    // the object will be in the objects array of both the ActiveSelection and the Group
    // but referenced in the group's _activeObjects so that it won't be rendered twice.
    this._enterGroup(object, removeParentTransform);
  }

  /**
   * we want objects to retain their canvas ref when exiting instance
   * @private
   * @param {FabricObject} object
   * @param {boolean} [removeParentTransform] true if object should exit group without applying group's transform to it
   */
  exitGroup(object, removeParentTransform) {
    this._exitGroup(object, removeParentTransform);
    // return to parent
    object.parent && object.parent._enterGroup(object, true);
  }

  /**
   * @private
   * @param {'added'|'removed'} type
   * @param {FabricObject[]} targets
   */
  _onAfterObjectsChange(type, targets) {
    super._onAfterObjectsChange(type, targets);
    const groups = new Set();
    targets.forEach(object => {
      const {
        parent
      } = object;
      parent && groups.add(parent);
    });
    if (type === LAYOUT_TYPE_REMOVED) {
      //  invalidate groups' layout and mark as dirty
      groups.forEach(group => {
        group._onAfterObjectsChange(LAYOUT_TYPE_ADDED, targets);
      });
    } else {
      //  mark groups as dirty
      groups.forEach(group => {
        group._set('dirty', true);
      });
    }
  }

  /**
   * @override remove all objects
   */
  onDeselect() {
    this.removeAll();
    return false;
  }

  /**
   * Returns string representation of a group
   * @return {String}
   */
  toString() {
    return `#<ActiveSelection: (${this.complexity()})>`;
  }

  /**
   * Decide if the object should cache or not. The Active selection never caches
   * @return {Boolean}
   */
  shouldCache() {
    return false;
  }

  /**
   * Check if this group or its parent group are caching, recursively up
   * @return {Boolean}
   */
  isOnACache() {
    return false;
  }

  /**
   * Renders controls and borders for the object
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {Object} [styleOverride] properties to override the object style
   * @param {Object} [childrenOverride] properties to override the children overrides
   */
  _renderControls(ctx, styleOverride, childrenOverride) {
    ctx.save();
    ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
    const options = {
      hasControls: false,
      ...childrenOverride,
      forActiveSelection: true
    };
    for (let i = 0; i < this._objects.length; i++) {
      this._objects[i]._renderControls(ctx, options);
    }
    super._renderControls(ctx, styleOverride);
    ctx.restore();
  }
}
_defineProperty(ActiveSelection, "type", 'ActiveSelection');
_defineProperty(ActiveSelection, "ownDefaults", activeSelectionDefaultValues);
classRegistry.setClass(ActiveSelection);
classRegistry.setClass(ActiveSelection, 'activeSelection');

/**
 * Canvas 2D filter backend.
 */

class Canvas2dFilterBackend {
  constructor() {
    /**
     * Experimental. This object is a sort of repository of help layers used to avoid
     * of recreating them during frequent filtering. If you are previewing a filter with
     * a slider you probably do not want to create help layers every filter step.
     * in this object there will be appended some canvases, created once, resized sometimes
     * cleared never. Clearing is left to the developer.
     **/
    _defineProperty(this, "resources", {});
  }
  /**
   * Apply a set of filters against a source image and draw the filtered output
   * to the provided destination canvas.
   *
   * @param {EnhancedFilter} filters The filter to apply.
   * @param {HTMLImageElement|HTMLCanvasElement} sourceElement The source to be filtered.
   * @param {Number} sourceWidth The width of the source input.
   * @param {Number} sourceHeight The height of the source input.
   * @param {HTMLCanvasElement} targetCanvas The destination for filtered output to be drawn.
   */
  applyFilters(filters, sourceElement, sourceWidth, sourceHeight, targetCanvas) {
    const ctx = targetCanvas.getContext('2d', {
      willReadFrequently: true,
      desynchronized: true
    });
    if (!ctx) {
      return;
    }
    ctx.drawImage(sourceElement, 0, 0, sourceWidth, sourceHeight);
    const imageData = ctx.getImageData(0, 0, sourceWidth, sourceHeight);
    const originalImageData = ctx.getImageData(0, 0, sourceWidth, sourceHeight);
    const pipelineState = {
      sourceWidth,
      sourceHeight,
      imageData,
      originalEl: sourceElement,
      originalImageData,
      canvasEl: targetCanvas,
      ctx,
      filterBackend: this
    };
    filters.forEach(filter => {
      filter.applyTo(pipelineState);
    });
    const {
      imageData: imageDataPostFilter
    } = pipelineState;
    if (imageDataPostFilter.width !== sourceWidth || imageDataPostFilter.height !== sourceHeight) {
      targetCanvas.width = imageDataPostFilter.width;
      targetCanvas.height = imageDataPostFilter.height;
    }
    ctx.putImageData(imageDataPostFilter, 0, 0);
    return pipelineState;
  }
}

class WebGLFilterBackend {
  constructor() {
    let {
      tileSize = config.textureSize
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    /**
     * Define ...
     **/
    _defineProperty(this, "aPosition", new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]));
    /**
     * Experimental. This object is a sort of repository of help layers used to avoid
     * of recreating them during frequent filtering. If you are previewing a filter with
     * a slider you probably do not want to create help layers every filter step.
     * in this object there will be appended some canvases, created once, resized sometimes
     * cleared never. Clearing is left to the developer.
     **/
    _defineProperty(this, "resources", {});
    this.tileSize = tileSize;
    this.setupGLContext(tileSize, tileSize);
    this.captureGPUInfo();
  }

  /**
   * Setup a WebGL context suitable for filtering, and bind any needed event handlers.
   */
  setupGLContext(width, height) {
    this.dispose();
    this.createWebGLCanvas(width, height);
  }

  /**
   * Create a canvas element and associated WebGL context and attaches them as
   * class properties to the GLFilterBackend class.
   */
  createWebGLCanvas(width, height) {
    const canvas = createCanvasElementFor({
      width,
      height
    });
    const glOptions = {
        alpha: true,
        premultipliedAlpha: false,
        depth: false,
        stencil: false,
        antialias: false
      },
      gl = canvas.getContext('webgl', glOptions);
    if (!gl) {
      return;
    }
    gl.clearColor(0, 0, 0, 0);
    // this canvas can fire webglcontextlost and webglcontextrestored
    this.canvas = canvas;
    this.gl = gl;
  }

  /**
   * Attempts to apply the requested filters to the source provided, drawing the filtered output
   * to the provided target canvas.
   *
   * @param {Array} filters The filters to apply.
   * @param {TexImageSource} source The source to be filtered.
   * @param {Number} width The width of the source input.
   * @param {Number} height The height of the source input.
   * @param {HTMLCanvasElement} targetCanvas The destination for filtered output to be drawn.
   * @param {String|undefined} cacheKey A key used to cache resources related to the source. If
   * omitted, caching will be skipped.
   */
  applyFilters(filters, source, width, height, targetCanvas, cacheKey) {
    const gl = this.gl;
    const ctx = targetCanvas.getContext('2d');
    if (!gl || !ctx) {
      return;
    }
    let cachedTexture;
    if (cacheKey) {
      cachedTexture = this.getCachedTexture(cacheKey, source);
    }
    const pipelineState = {
      originalWidth: source.width || source.naturalWidth || 0,
      originalHeight: source.height || source.naturalHeight || 0,
      sourceWidth: width,
      sourceHeight: height,
      destinationWidth: width,
      destinationHeight: height,
      context: gl,
      sourceTexture: this.createTexture(gl, width, height, !cachedTexture ? source : undefined),
      targetTexture: this.createTexture(gl, width, height),
      originalTexture: cachedTexture || this.createTexture(gl, width, height, !cachedTexture ? source : undefined),
      passes: filters.length,
      webgl: true,
      aPosition: this.aPosition,
      programCache: this.programCache,
      pass: 0,
      filterBackend: this,
      targetCanvas: targetCanvas
    };
    const tempFbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, tempFbo);
    filters.forEach(filter => {
      filter && filter.applyTo(pipelineState);
    });
    resizeCanvasIfNeeded(pipelineState);
    this.copyGLTo2D(gl, pipelineState);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.deleteTexture(pipelineState.sourceTexture);
    gl.deleteTexture(pipelineState.targetTexture);
    gl.deleteFramebuffer(tempFbo);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    return pipelineState;
  }

  /**
   * Detach event listeners, remove references, and clean up caches.
   */
  dispose() {
    if (this.canvas) {
      // we are disposing, we don't care about the fact
      // that the canvas shouldn't be null.
      // @ts-expect-error disposing
      this.canvas = null;
      // @ts-expect-error disposing
      this.gl = null;
    }
    this.clearWebGLCaches();
  }

  /**
   * Wipe out WebGL-related caches.
   */
  clearWebGLCaches() {
    this.programCache = {};
    this.textureCache = {};
  }

  /**
   * Create a WebGL texture object.
   *
   * Accepts specific dimensions to initialize the texture to or a source image.
   *
   * @param {WebGLRenderingContext} gl The GL context to use for creating the texture.
   * @param {number} width The width to initialize the texture at.
   * @param {number} height The height to initialize the texture.
   * @param {TexImageSource} textureImageSource A source for the texture data.
   * @param {number} filter gl.NEAREST default or gl.LINEAR filters for the texture.
   * This filter is very useful for LUTs filters. If you need interpolation use gl.LINEAR
   * @returns {WebGLTexture}
   */
  createTexture(gl, width, height, textureImageSource, filter) {
    const {
      NEAREST,
      TEXTURE_2D,
      RGBA,
      UNSIGNED_BYTE,
      CLAMP_TO_EDGE,
      TEXTURE_MAG_FILTER,
      TEXTURE_MIN_FILTER,
      TEXTURE_WRAP_S,
      TEXTURE_WRAP_T
    } = gl;
    const texture = gl.createTexture();
    gl.bindTexture(TEXTURE_2D, texture);
    gl.texParameteri(TEXTURE_2D, TEXTURE_MAG_FILTER, filter || NEAREST);
    gl.texParameteri(TEXTURE_2D, TEXTURE_MIN_FILTER, filter || NEAREST);
    gl.texParameteri(TEXTURE_2D, TEXTURE_WRAP_S, CLAMP_TO_EDGE);
    gl.texParameteri(TEXTURE_2D, TEXTURE_WRAP_T, CLAMP_TO_EDGE);
    if (textureImageSource) {
      gl.texImage2D(TEXTURE_2D, 0, RGBA, RGBA, UNSIGNED_BYTE, textureImageSource);
    } else {
      gl.texImage2D(TEXTURE_2D, 0, RGBA, width, height, 0, RGBA, UNSIGNED_BYTE, null);
    }
    // disabled because website and issues with different typescript version
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return texture;
  }

  /**
   * Can be optionally used to get a texture from the cache array
   *
   * If an existing texture is not found, a new texture is created and cached.
   *
   * @param {String} uniqueId A cache key to use to find an existing texture.
   * @param {HTMLImageElement|HTMLCanvasElement} textureImageSource A source to use to create the
   * texture cache entry if one does not already exist.
   */
  getCachedTexture(uniqueId, textureImageSource, filter) {
    const {
      textureCache
    } = this;
    if (textureCache[uniqueId]) {
      return textureCache[uniqueId];
    } else {
      const texture = this.createTexture(this.gl, textureImageSource.width, textureImageSource.height, textureImageSource, filter);
      if (texture) {
        textureCache[uniqueId] = texture;
      }
      return texture;
    }
  }

  /**
   * Clear out cached resources related to a source image that has been
   * filtered previously.
   *
   * @param {String} cacheKey The cache key provided when the source image was filtered.
   */
  evictCachesForKey(cacheKey) {
    if (this.textureCache[cacheKey]) {
      this.gl.deleteTexture(this.textureCache[cacheKey]);
      delete this.textureCache[cacheKey];
    }
  }

  /**
   * Copy an input WebGL canvas on to an output 2D canvas.
   *
   * The WebGL canvas is assumed to be upside down, with the top-left pixel of the
   * desired output image appearing in the bottom-left corner of the WebGL canvas.
   *
   * @param {WebGLRenderingContext} sourceContext The WebGL context to copy from.
   * @param {Object} pipelineState The 2D target canvas to copy on to.
   */
  copyGLTo2D(gl, pipelineState) {
    const glCanvas = gl.canvas,
      targetCanvas = pipelineState.targetCanvas,
      ctx = targetCanvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.translate(0, targetCanvas.height); // move it down again
    ctx.scale(1, -1); // vertical flip
    // where is my image on the big glcanvas?
    const sourceY = glCanvas.height - targetCanvas.height;
    ctx.drawImage(glCanvas, 0, sourceY, targetCanvas.width, targetCanvas.height, 0, 0, targetCanvas.width, targetCanvas.height);
  }

  /**
   * Copy an input WebGL canvas on to an output 2D canvas using 2d canvas' putImageData
   * API. Measurably faster than using ctx.drawImage in Firefox (version 54 on OSX Sierra).
   *
   * @param {WebGLRenderingContext} sourceContext The WebGL context to copy from.
   * @param {HTMLCanvasElement} targetCanvas The 2D target canvas to copy on to.
   * @param {Object} pipelineState The 2D target canvas to copy on to.
   */
  copyGLTo2DPutImageData(gl, pipelineState) {
    const targetCanvas = pipelineState.targetCanvas,
      ctx = targetCanvas.getContext('2d'),
      dWidth = pipelineState.destinationWidth,
      dHeight = pipelineState.destinationHeight,
      numBytes = dWidth * dHeight * 4;
    if (!ctx) {
      return;
    }
    const u8 = new Uint8Array(this.imageBuffer, 0, numBytes);
    const u8Clamped = new Uint8ClampedArray(this.imageBuffer, 0, numBytes);
    gl.readPixels(0, 0, dWidth, dHeight, gl.RGBA, gl.UNSIGNED_BYTE, u8);
    const imgData = new ImageData(u8Clamped, dWidth, dHeight);
    ctx.putImageData(imgData, 0, 0);
  }

  /**
   * Attempt to extract GPU information strings from a WebGL context.
   *
   * Useful information when debugging or blacklisting specific GPUs.
   *
   * @returns {Object} A GPU info object with renderer and vendor strings.
   */
  captureGPUInfo() {
    if (this.gpuInfo) {
      return this.gpuInfo;
    }
    const gl = this.gl,
      gpuInfo = {
        renderer: '',
        vendor: ''
      };
    if (!gl) {
      return gpuInfo;
    }
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (ext) {
      const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
      const vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL);
      if (renderer) {
        gpuInfo.renderer = renderer.toLowerCase();
      }
      if (vendor) {
        gpuInfo.vendor = vendor.toLowerCase();
      }
    }
    this.gpuInfo = gpuInfo;
    return gpuInfo;
  }
}
function resizeCanvasIfNeeded(pipelineState) {
  const targetCanvas = pipelineState.targetCanvas,
    width = targetCanvas.width,
    height = targetCanvas.height,
    dWidth = pipelineState.destinationWidth,
    dHeight = pipelineState.destinationHeight;
  if (width !== dWidth || height !== dHeight) {
    targetCanvas.width = dWidth;
    targetCanvas.height = dHeight;
  }
}

let filterBackend;

/**
 * Verifies if it is possible to initialize webgl or fallback on a canvas2d filtering backend
 */
function initFilterBackend() {
  const {
    WebGLProbe
  } = getEnv$1();
  WebGLProbe.queryWebGL(createCanvasElement());
  if (config.enableGLFiltering && WebGLProbe.isSupported(config.textureSize)) {
    return new WebGLFilterBackend({
      tileSize: config.textureSize
    });
  } else {
    return new Canvas2dFilterBackend();
  }
}

/**
 * Get the current fabricJS filter backend  or initialize one if not available yet
 * @param [strict] pass `true` to create the backend if it wasn't created yet (default behavior),
 * pass `false` to get the backend ref without mutating it
 */
function getFilterBackend() {
  let strict = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  if (!filterBackend && strict) {
    filterBackend = initFilterBackend();
  }
  return filterBackend;
}
function setFilterBackend(backend) {
  filterBackend = backend;
}

// @todo Would be nice to have filtering code not imported directly.

const imageDefaultValues = {
  strokeWidth: 0,
  srcFromAttribute: false,
  minimumScaleTrigger: 0.5,
  cropX: 0,
  cropY: 0,
  imageSmoothing: true
};
const IMAGE_PROPS = ['cropX', 'cropY'];

/**
 * @see {@link http://fabric5.fabricjs.com/fabric-intro-part-1#images}
 */
class FabricImage extends FabricObject {
  static getDefaults() {
    return {
      ...super.getDefaults(),
      ...FabricImage.ownDefaults
    };
  }
  /**
   * Constructor
   * Image can be initialized with any canvas drawable or a string.
   * The string should be a url and will be loaded as an image.
   * Canvas and Image element work out of the box, while videos require extra code to work.
   * Please check video element events for seeking.
   * @param {ImageSource | string} element Image element
   * @param {Object} [options] Options object
   */

  constructor(arg0, options) {
    super();
    /**
     * When calling {@link FabricImage.getSrc}, return value from element src with `element.getAttribute('src')`.
     * This allows for relative urls as image src.
     * @since 2.7.0
     * @type Boolean
     * @default false
     */
    /**
     * private
     * contains last value of scaleX to detect
     * if the Image got resized after the last Render
     * @type Number
     */
    _defineProperty(this, "_lastScaleX", 1);
    /**
     * private
     * contains last value of scaleY to detect
     * if the Image got resized after the last Render
     * @type Number
     */
    _defineProperty(this, "_lastScaleY", 1);
    /**
     * private
     * contains last value of scaling applied by the apply filter chain
     * @type Number
     */
    _defineProperty(this, "_filterScalingX", 1);
    /**
     * private
     * contains last value of scaling applied by the apply filter chain
     * @type Number
     */
    _defineProperty(this, "_filterScalingY", 1);
    this.filters = [];
    Object.assign(this, FabricImage.ownDefaults);
    this.setOptions(options);
    this.cacheKey = `texture${uid()}`;
    this.setElement(typeof arg0 === 'string' ? (this.canvas && getDocumentFromElement(this.canvas.getElement()) || getFabricDocument()).getElementById(arg0) : arg0, options);
  }

  /**
   * Returns image element which this instance if based on
   */
  getElement() {
    return this._element;
  }

  /**
   * Sets image element for this instance to a specified one.
   * If filters defined they are applied to new image.
   * You might need to call `canvas.renderAll` and `object.setCoords` after replacing, to render new image and update controls area.
   * @param {HTMLImageElement} element
   * @param {Partial<TSize>} [size] Options object
   */
  setElement(element) {
    let size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    this.removeTexture(this.cacheKey);
    this.removeTexture(`${this.cacheKey}_filtered`);
    this._element = element;
    this._originalElement = element;
    this._setWidthHeight(size);
    if (this.filters.length !== 0) {
      this.applyFilters();
    }
    // resizeFilters work on the already filtered copy.
    // we need to apply resizeFilters AFTER normal filters.
    // applyResizeFilters is run more often than normal filters
    // and is triggered by user interactions rather than dev code
    if (this.resizeFilter) {
      this.applyResizeFilters();
    }
  }

  /**
   * Delete a single texture if in webgl mode
   */
  removeTexture(key) {
    const backend = getFilterBackend(false);
    if (backend instanceof WebGLFilterBackend) {
      backend.evictCachesForKey(key);
    }
  }

  /**
   * Delete textures, reference to elements and eventually JSDOM cleanup
   */
  dispose() {
    super.dispose();
    this.removeTexture(this.cacheKey);
    this.removeTexture(`${this.cacheKey}_filtered`);
    this._cacheContext = null;
    ['_originalElement', '_element', '_filteredEl', '_cacheCanvas'].forEach(elementKey => {
      const el = this[elementKey];
      el && getEnv$1().dispose(el);
      // @ts-expect-error disposing
      this[elementKey] = undefined;
    });
  }

  /**
   * Get the crossOrigin value (of the corresponding image element)
   */
  getCrossOrigin() {
    return this._originalElement && (this._originalElement.crossOrigin || null);
  }

  /**
   * Returns original size of an image
   */
  getOriginalSize() {
    const element = this.getElement();
    if (!element) {
      return {
        width: 0,
        height: 0
      };
    }
    return {
      width: element.naturalWidth || element.width,
      height: element.naturalHeight || element.height
    };
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _stroke(ctx) {
    if (!this.stroke || this.strokeWidth === 0) {
      return;
    }
    const w = this.width / 2,
      h = this.height / 2;
    ctx.beginPath();
    ctx.moveTo(-w, -h);
    ctx.lineTo(w, -h);
    ctx.lineTo(w, h);
    ctx.lineTo(-w, h);
    ctx.lineTo(-w, -h);
    ctx.closePath();
  }

  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} Object representation of an instance
   */
  toObject() {
    let propertiesToInclude = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    const filters = [];
    this.filters.forEach(filterObj => {
      filterObj && filters.push(filterObj.toObject());
    });
    return {
      ...super.toObject([...IMAGE_PROPS, ...propertiesToInclude]),
      src: this.getSrc(),
      crossOrigin: this.getCrossOrigin(),
      filters,
      ...(this.resizeFilter ? {
        resizeFilter: this.resizeFilter.toObject()
      } : {})
    };
  }

  /**
   * Returns true if an image has crop applied, inspecting values of cropX,cropY,width,height.
   * @return {Boolean}
   */
  hasCrop() {
    return !!this.cropX || !!this.cropY || this.width < this._element.width || this.height < this._element.height;
  }

  /**
   * Returns svg representation of an instance
   * @return {string[]} an array of strings with the specific svg representation
   * of the instance
   */
  _toSVG() {
    const imageMarkup = [],
      element = this._element,
      x = -this.width / 2,
      y = -this.height / 2;
    let svgString = [],
      strokeSvg = [],
      clipPath = '',
      imageRendering = '';
    if (!element) {
      return [];
    }
    if (this.hasCrop()) {
      const clipPathId = uid();
      svgString.push('<clipPath id="imageCrop_' + clipPathId + '">\n', '\t<rect x="' + x + '" y="' + y + '" width="' + this.width + '" height="' + this.height + '" />\n', '</clipPath>\n');
      clipPath = ' clip-path="url(#imageCrop_' + clipPathId + ')" ';
    }
    if (!this.imageSmoothing) {
      imageRendering = ' image-rendering="optimizeSpeed"';
    }
    imageMarkup.push('\t<image ', 'COMMON_PARTS', `xlink:href="${this.getSvgSrc(true)}" x="${x - this.cropX}" y="${y - this.cropY
    // we're essentially moving origin of transformation from top/left corner to the center of the shape
    // by wrapping it in container <g> element with actual transformation, then offsetting object to the top/left
    // so that object's center aligns with container's left/top
    }" width="${element.width || element.naturalWidth}" height="${element.height || element.naturalHeight}"${imageRendering}${clipPath}></image>\n`);
    if (this.stroke || this.strokeDashArray) {
      const origFill = this.fill;
      this.fill = null;
      strokeSvg = [`\t<rect x="${x}" y="${y}" width="${this.width}" height="${this.height}" style="${this.getSvgStyles()}" />\n`];
      this.fill = origFill;
    }
    if (this.paintFirst !== FILL) {
      svgString = svgString.concat(strokeSvg, imageMarkup);
    } else {
      svgString = svgString.concat(imageMarkup, strokeSvg);
    }
    return svgString;
  }

  /**
   * Returns source of an image
   * @param {Boolean} filtered indicates if the src is needed for svg
   * @return {String} Source of an image
   */
  getSrc(filtered) {
    const element = filtered ? this._element : this._originalElement;
    if (element) {
      if (element.toDataURL) {
        return element.toDataURL();
      }
      if (this.srcFromAttribute) {
        return element.getAttribute('src') || '';
      } else {
        return element.src;
      }
    } else {
      return this.src || '';
    }
  }

  /**
   * Alias for getSrc
   * @param filtered
   * @deprecated
   */
  getSvgSrc(filtered) {
    return this.getSrc(filtered);
  }

  /**
   * Loads and sets source of an image\
   * **IMPORTANT**: It is recommended to abort loading tasks before calling this method to prevent race conditions and unnecessary networking
   * @param {String} src Source string (URL)
   * @param {LoadImageOptions} [options] Options object
   */
  setSrc(src) {
    let {
      crossOrigin,
      signal
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return loadImage(src, {
      crossOrigin,
      signal
    }).then(img => {
      typeof crossOrigin !== 'undefined' && this.set({
        crossOrigin
      });
      this.setElement(img);
    });
  }

  /**
   * Returns string representation of an instance
   * @return {String} String representation of an instance
   */
  toString() {
    return `#<Image: { src: "${this.getSrc()}" }>`;
  }
  applyResizeFilters() {
    const filter = this.resizeFilter,
      minimumScale = this.minimumScaleTrigger,
      objectScale = this.getTotalObjectScaling(),
      scaleX = objectScale.x,
      scaleY = objectScale.y,
      elementToFilter = this._filteredEl || this._originalElement;
    if (this.group) {
      this.set('dirty', true);
    }
    if (!filter || scaleX > minimumScale && scaleY > minimumScale) {
      this._element = elementToFilter;
      this._filterScalingX = 1;
      this._filterScalingY = 1;
      this._lastScaleX = scaleX;
      this._lastScaleY = scaleY;
      return;
    }
    const canvasEl = createCanvasElementFor(elementToFilter),
      {
        width,
        height
      } = elementToFilter;
    this._element = canvasEl;
    this._lastScaleX = filter.scaleX = scaleX;
    this._lastScaleY = filter.scaleY = scaleY;
    getFilterBackend().applyFilters([filter], elementToFilter, width, height, this._element);
    this._filterScalingX = canvasEl.width / this._originalElement.width;
    this._filterScalingY = canvasEl.height / this._originalElement.height;
  }

  /**
   * Applies filters assigned to this image (from "filters" array) or from filter param
   * @param {Array} filters to be applied
   * @param {Boolean} forResizing specify if the filter operation is a resize operation
   */
  applyFilters() {
    let filters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.filters || [];
    filters = filters.filter(filter => filter && !filter.isNeutralState());
    this.set('dirty', true);

    // needs to clear out or WEBGL will not resize correctly
    this.removeTexture(`${this.cacheKey}_filtered`);
    if (filters.length === 0) {
      this._element = this._originalElement;
      // this is unsafe and needs to be rethinkend
      this._filteredEl = undefined;
      this._filterScalingX = 1;
      this._filterScalingY = 1;
      return;
    }
    const imgElement = this._originalElement,
      sourceWidth = imgElement.naturalWidth || imgElement.width,
      sourceHeight = imgElement.naturalHeight || imgElement.height;
    if (this._element === this._originalElement) {
      // if the _element a reference to _originalElement
      // we need to create a new element to host the filtered pixels
      const canvasEl = createCanvasElementFor({
        width: sourceWidth,
        height: sourceHeight
      });
      this._element = canvasEl;
      this._filteredEl = canvasEl;
    } else if (this._filteredEl) {
      // if the _element is it own element,
      // and we also have a _filteredEl, then we clean up _filteredEl
      // and we assign it to _element.
      // in this way we invalidate the eventual old resize filtered element
      this._element = this._filteredEl;
      this._filteredEl.getContext('2d').clearRect(0, 0, sourceWidth, sourceHeight);
      // we also need to resize again at next renderAll, so remove saved _lastScaleX/Y
      this._lastScaleX = 1;
      this._lastScaleY = 1;
    }
    getFilterBackend().applyFilters(filters, this._originalElement, sourceWidth, sourceHeight, this._element, this.cacheKey);
    if (this._originalElement.width !== this._element.width || this._originalElement.height !== this._element.height) {
      this._filterScalingX = this._element.width / this._originalElement.width;
      this._filterScalingY = this._element.height / this._originalElement.height;
    }
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _render(ctx) {
    ctx.imageSmoothingEnabled = this.imageSmoothing;
    if (this.isMoving !== true && this.resizeFilter && this._needsResize()) {
      this.applyResizeFilters();
    }
    this._stroke(ctx);
    this._renderPaintInOrder(ctx);
  }

  /**
   * Paint the cached copy of the object on the target context.
   * it will set the imageSmoothing for the draw operation
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  drawCacheOnCanvas(ctx) {
    ctx.imageSmoothingEnabled = this.imageSmoothing;
    super.drawCacheOnCanvas(ctx);
  }

  /**
   * Decide if the FabricImage should cache or not. Create its own cache level
   * needsItsOwnCache should be used when the object drawing method requires
   * a cache step.
   * Generally you do not cache objects in groups because the group outside is cached.
   * This is the special Image version where we would like to avoid caching where possible.
   * Essentially images do not benefit from caching. They may require caching, and in that
   * case we do it. Also caching an image usually ends in a loss of details.
   * A full performance audit should be done.
   * @return {Boolean}
   */
  shouldCache() {
    return this.needsItsOwnCache();
  }
  _renderFill(ctx) {
    const elementToDraw = this._element;
    if (!elementToDraw) {
      return;
    }
    const scaleX = this._filterScalingX,
      scaleY = this._filterScalingY,
      w = this.width,
      h = this.height,
      // crop values cannot be lesser than 0.
      cropX = Math.max(this.cropX, 0),
      cropY = Math.max(this.cropY, 0),
      elWidth = elementToDraw.naturalWidth || elementToDraw.width,
      elHeight = elementToDraw.naturalHeight || elementToDraw.height,
      sX = cropX * scaleX,
      sY = cropY * scaleY,
      // the width height cannot exceed element width/height, starting from the crop offset.
      sW = Math.min(w * scaleX, elWidth - sX),
      sH = Math.min(h * scaleY, elHeight - sY),
      x = -w / 2,
      y = -h / 2,
      maxDestW = Math.min(w, elWidth / scaleX - cropX),
      maxDestH = Math.min(h, elHeight / scaleY - cropY);
    elementToDraw && ctx.drawImage(elementToDraw, sX, sY, sW, sH, x, y, maxDestW, maxDestH);
  }

  /**
   * needed to check if image needs resize
   * @private
   */
  _needsResize() {
    const scale = this.getTotalObjectScaling();
    return scale.x !== this._lastScaleX || scale.y !== this._lastScaleY;
  }

  /**
   * @private
   * @deprecated unused
   */
  _resetWidthHeight() {
    this.set(this.getOriginalSize());
  }

  /**
   * @private
   * Set the width and the height of the image object, using the element or the
   * options.
   */
  _setWidthHeight() {
    let {
      width,
      height
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const size = this.getOriginalSize();
    this.width = width || size.width;
    this.height = height || size.height;
  }

  /**
   * Calculate offset for center and scale factor for the image in order to respect
   * the preserveAspectRatio attribute
   * @private
   */
  parsePreserveAspectRatioAttribute() {
    const pAR = parsePreserveAspectRatioAttribute(this.preserveAspectRatio || ''),
      pWidth = this.width,
      pHeight = this.height,
      parsedAttributes = {
        width: pWidth,
        height: pHeight
      };
    let rWidth = this._element.width,
      rHeight = this._element.height,
      scaleX = 1,
      scaleY = 1,
      offsetLeft = 0,
      offsetTop = 0,
      cropX = 0,
      cropY = 0,
      offset;
    if (pAR && (pAR.alignX !== NONE || pAR.alignY !== NONE)) {
      if (pAR.meetOrSlice === 'meet') {
        scaleX = scaleY = findScaleToFit(this._element, parsedAttributes);
        offset = (pWidth - rWidth * scaleX) / 2;
        if (pAR.alignX === 'Min') {
          offsetLeft = -offset;
        }
        if (pAR.alignX === 'Max') {
          offsetLeft = offset;
        }
        offset = (pHeight - rHeight * scaleY) / 2;
        if (pAR.alignY === 'Min') {
          offsetTop = -offset;
        }
        if (pAR.alignY === 'Max') {
          offsetTop = offset;
        }
      }
      if (pAR.meetOrSlice === 'slice') {
        scaleX = scaleY = findScaleToCover(this._element, parsedAttributes);
        offset = rWidth - pWidth / scaleX;
        if (pAR.alignX === 'Mid') {
          cropX = offset / 2;
        }
        if (pAR.alignX === 'Max') {
          cropX = offset;
        }
        offset = rHeight - pHeight / scaleY;
        if (pAR.alignY === 'Mid') {
          cropY = offset / 2;
        }
        if (pAR.alignY === 'Max') {
          cropY = offset;
        }
        rWidth = pWidth / scaleX;
        rHeight = pHeight / scaleY;
      }
    } else {
      scaleX = pWidth / rWidth;
      scaleY = pHeight / rHeight;
    }
    return {
      width: rWidth,
      height: rHeight,
      scaleX,
      scaleY,
      offsetLeft,
      offsetTop,
      cropX,
      cropY
    };
  }

  /**
   * List of attribute names to account for when parsing SVG element (used by {@link FabricImage.fromElement})
   * @see {@link http://www.w3.org/TR/SVG/struct.html#ImageElement}
   */

  /**
   * Creates an instance of FabricImage from its object representation
   * @param {Object} object Object to create an instance from
   * @param {object} [options] Options object
   * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @returns {Promise<FabricImage>}
   */
  static fromObject(_ref, options) {
    let {
      filters: f,
      resizeFilter: rf,
      src,
      crossOrigin,
      type,
      ...object
    } = _ref;
    return Promise.all([loadImage(src, {
      ...options,
      crossOrigin
    }), f && enlivenObjects(f, options),
    // redundant - handled by enlivenObjectEnlivables, but nicely explicit
    rf ? enlivenObjects([rf], options) : [], enlivenObjectEnlivables(object, options)]).then(_ref2 => {
      let [el, filters = [], [resizeFilter], hydratedProps = {}] = _ref2;
      return new this(el, {
        ...object,
        // TODO: passing src creates a difference between image creation and restoring from JSON
        src,
        filters,
        resizeFilter,
        ...hydratedProps
      });
    });
  }

  /**
   * Creates an instance of Image from an URL string
   * @param {String} url URL to create an image from
   * @param {LoadImageOptions} [options] Options object
   * @returns {Promise<FabricImage>}
   */
  static fromURL(url) {
    let {
      crossOrigin = null,
      signal
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let imageOptions = arguments.length > 2 ? arguments[2] : undefined;
    return loadImage(url, {
      crossOrigin,
      signal
    }).then(img => new this(img, imageOptions));
  }

  /**
   * Returns {@link FabricImage} instance from an SVG element
   * @param {HTMLElement} element Element to parse
   * @param {Object} [options] Options object
   * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @param {Function} callback Callback to execute when Image object is created
   */
  static async fromElement(element) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let cssRules = arguments.length > 2 ? arguments[2] : undefined;
    const parsedAttributes = parseAttributes(element, this.ATTRIBUTE_NAMES, cssRules);
    return this.fromURL(parsedAttributes['xlink:href'] || parsedAttributes['href'], options, parsedAttributes).catch(err => {
      log('log', 'Unable to parse Image', err);
      return null;
    });
  }
}
_defineProperty(FabricImage, "type", 'Image');
_defineProperty(FabricImage, "cacheProperties", [...cacheProperties, ...IMAGE_PROPS]);
_defineProperty(FabricImage, "ownDefaults", imageDefaultValues);
_defineProperty(FabricImage, "ATTRIBUTE_NAMES", [...SHARED_ATTRIBUTES, 'x', 'y', 'width', 'height', 'preserveAspectRatio', 'xlink:href', 'href', 'crossOrigin', 'image-rendering']);
classRegistry.setClass(FabricImage);
classRegistry.setSVGClass(FabricImage);

/**
 * Add a <g> element that envelop all child elements and makes the viewbox transformMatrix descend on all elements
 */
function applyViewboxTransform(element) {
  if (!svgViewBoxElementsRegEx.test(element.nodeName)) {
    return {};
  }
  const viewBoxAttr = element.getAttribute('viewBox');
  let scaleX = 1;
  let scaleY = 1;
  let minX = 0;
  let minY = 0;
  let matrix;
  let el;
  const widthAttr = element.getAttribute('width');
  const heightAttr = element.getAttribute('height');
  const x = element.getAttribute('x') || 0;
  const y = element.getAttribute('y') || 0;
  const goodViewbox = viewBoxAttr && reViewBoxAttrValue.test(viewBoxAttr);
  const missingViewBox = !goodViewbox;
  const missingDimAttr = !widthAttr || !heightAttr || widthAttr === '100%' || heightAttr === '100%';
  let translateMatrix = '';
  let widthDiff = 0;
  let heightDiff = 0;
  if (missingViewBox) {
    if ((x || y) && element.parentNode && element.parentNode.nodeName !== '#document') {
      translateMatrix = ' translate(' + parseUnit(x || '0') + ' ' + parseUnit(y || '0') + ') ';
      matrix = (element.getAttribute('transform') || '') + translateMatrix;
      element.setAttribute('transform', matrix);
      element.removeAttribute('x');
      element.removeAttribute('y');
    }
  }
  if (missingViewBox && missingDimAttr) {
    return {
      width: 0,
      height: 0
    };
  }
  const parsedDim = {
    width: 0,
    height: 0
  };
  if (missingViewBox) {
    parsedDim.width = parseUnit(widthAttr);
    parsedDim.height = parseUnit(heightAttr);
    // set a transform for elements that have x y and are inner(only) SVGs
    return parsedDim;
  }
  const pasedViewBox = viewBoxAttr.match(reViewBoxAttrValue);
  minX = -parseFloat(pasedViewBox[1]);
  minY = -parseFloat(pasedViewBox[2]);
  const viewBoxWidth = parseFloat(pasedViewBox[3]);
  const viewBoxHeight = parseFloat(pasedViewBox[4]);
  parsedDim.minX = minX;
  parsedDim.minY = minY;
  parsedDim.viewBoxWidth = viewBoxWidth;
  parsedDim.viewBoxHeight = viewBoxHeight;
  if (!missingDimAttr) {
    parsedDim.width = parseUnit(widthAttr);
    parsedDim.height = parseUnit(heightAttr);
    scaleX = parsedDim.width / viewBoxWidth;
    scaleY = parsedDim.height / viewBoxHeight;
  } else {
    parsedDim.width = viewBoxWidth;
    parsedDim.height = viewBoxHeight;
  }

  // default is to preserve aspect ratio
  const preserveAspectRatio = parsePreserveAspectRatioAttribute(element.getAttribute('preserveAspectRatio') || '');
  if (preserveAspectRatio.alignX !== NONE) {
    //translate all container for the effect of Mid, Min, Max
    if (preserveAspectRatio.meetOrSlice === 'meet') {
      scaleY = scaleX = scaleX > scaleY ? scaleY : scaleX;
      // calculate additional translation to move the viewbox
    }
    if (preserveAspectRatio.meetOrSlice === 'slice') {
      scaleY = scaleX = scaleX > scaleY ? scaleX : scaleY;
      // calculate additional translation to move the viewbox
    }
    widthDiff = parsedDim.width - viewBoxWidth * scaleX;
    heightDiff = parsedDim.height - viewBoxHeight * scaleX;
    if (preserveAspectRatio.alignX === 'Mid') {
      widthDiff /= 2;
    }
    if (preserveAspectRatio.alignY === 'Mid') {
      heightDiff /= 2;
    }
    if (preserveAspectRatio.alignX === 'Min') {
      widthDiff = 0;
    }
    if (preserveAspectRatio.alignY === 'Min') {
      heightDiff = 0;
    }
  }
  if (scaleX === 1 && scaleY === 1 && minX === 0 && minY === 0 && x === 0 && y === 0) {
    return parsedDim;
  }
  if ((x || y) && element.parentNode.nodeName !== '#document') {
    translateMatrix = ' translate(' + parseUnit(x || '0') + ' ' + parseUnit(y || '0') + ') ';
  }
  matrix = translateMatrix + ' matrix(' + scaleX + ' 0' + ' 0 ' + scaleY + ' ' + (minX * scaleX + widthDiff) + ' ' + (minY * scaleY + heightDiff) + ') ';
  // seems unused.
  // parsedDim.viewboxTransform = parseTransformAttribute(matrix);
  if (element.nodeName === 'svg') {
    el = element.ownerDocument.createElementNS(svgNS, 'g');
    // element.firstChild != null
    while (element.firstChild) {
      el.appendChild(element.firstChild);
    }
    element.appendChild(el);
  } else {
    el = element;
    el.removeAttribute('x');
    el.removeAttribute('y');
    matrix = el.getAttribute('transform') + matrix;
  }
  el.setAttribute('transform', matrix);
  return parsedDim;
}

const getTagName = node => node.tagName.replace('svg:', '');

const svgInvalidAncestorsRegEx = getSvgRegex(svgInvalidAncestors);
function hasInvalidAncestor(element) {
  let _element = element;
  while (_element && (_element = _element.parentElement)) {
    if (_element && _element.nodeName && svgInvalidAncestorsRegEx.test(getTagName(_element)) && !_element.getAttribute('instantiated_by_use')) {
      return true;
    }
  }
  return false;
}

function getMultipleNodes(doc, nodeNames) {
  let nodeName,
    nodeArray = [],
    nodeList,
    i,
    len;
  for (i = 0, len = nodeNames.length; i < len; i++) {
    nodeName = nodeNames[i];
    nodeList = doc.getElementsByTagNameNS('http://www.w3.org/2000/svg', nodeName);
    nodeArray = nodeArray.concat(Array.from(nodeList));
  }
  return nodeArray;
}

function parseUseDirectives(doc) {
  const nodelist = getMultipleNodes(doc, ['use', 'svg:use']);
  const skipAttributes = ['x', 'y', 'xlink:href', 'href', 'transform'];
  for (const useElement of nodelist) {
    const useAttributes = useElement.attributes;
    const useAttrMap = {};
    for (const attr of useAttributes) {
      attr.value && (useAttrMap[attr.name] = attr.value);
    }
    const xlink = (useAttrMap['xlink:href'] || useAttrMap.href || '').slice(1);
    if (xlink === '') {
      return;
    }
    const referencedElement = doc.getElementById(xlink);
    if (referencedElement === null) {
      // if we can't find the target of the xlink, consider this use tag bad, similar to no xlink
      return;
    }
    let clonedOriginal = referencedElement.cloneNode(true);
    const originalAttributes = clonedOriginal.attributes;
    const originalAttrMap = {};
    for (const attr of originalAttributes) {
      attr.value && (originalAttrMap[attr.name] = attr.value);
    }

    // Transform attribute needs to be merged in a particular way
    const {
      x = 0,
      y = 0,
      transform = ''
    } = useAttrMap;
    const currentTrans = `${transform} ${originalAttrMap.transform || ''} translate(${x}, ${y})`;
    applyViewboxTransform(clonedOriginal);
    if (/^svg$/i.test(clonedOriginal.nodeName)) {
      // if is an SVG, create a group and apply all the attributes on top of it
      const el3 = clonedOriginal.ownerDocument.createElementNS(svgNS, 'g');
      Object.entries(originalAttrMap).forEach(_ref => {
        let [name, value] = _ref;
        return el3.setAttributeNS(svgNS, name, value);
      });
      el3.append(...clonedOriginal.childNodes);
      clonedOriginal = el3;
    }
    for (const attr of useAttributes) {
      if (!attr) {
        continue;
      }
      const {
        name,
        value
      } = attr;
      if (skipAttributes.includes(name)) {
        continue;
      }
      if (name === 'style') {
        // when use has a style, merge the two styles, with the ref being priority (not use)
        // priority is by feature. an attribute for fill on the original element
        // will overwrite the fill in style or attribute for tha use
        const styleRecord = {};
        parseStyleString(value, styleRecord);
        // cleanup styleRecord from attributes of original
        Object.entries(originalAttrMap).forEach(_ref2 => {
          let [name, value] = _ref2;
          styleRecord[name] = value;
        });
        // now we can put in the style of the original that will overwrite the original attributes
        parseStyleString(originalAttrMap.style || '', styleRecord);
        const mergedStyles = Object.entries(styleRecord).map(entry => entry.join(':')).join(';');
        clonedOriginal.setAttribute(name, mergedStyles);
      } else {
        // set the attribute from use element only if the original does not have it already
        !originalAttrMap[name] && clonedOriginal.setAttribute(name, value);
      }
    }
    clonedOriginal.setAttribute('transform', currentTrans);
    clonedOriginal.setAttribute('instantiated_by_use', '1');
    clonedOriginal.removeAttribute('id');
    useElement.parentNode.replaceChild(clonedOriginal, useElement);
  }
}

const gradientsAttrs = ['gradientTransform', 'x1', 'x2', 'y1', 'y2', 'gradientUnits', 'cx', 'cy', 'r', 'fx', 'fy'];
const xlinkAttr = 'xlink:href';
function recursivelyParseGradientsXlink(doc, gradient) {
  var _gradient$getAttribut;
  const xLink = ((_gradient$getAttribut = gradient.getAttribute(xlinkAttr)) === null || _gradient$getAttribut === void 0 ? void 0 : _gradient$getAttribut.slice(1)) || '',
    referencedGradient = doc.getElementById(xLink);
  if (referencedGradient && referencedGradient.getAttribute(xlinkAttr)) {
    recursivelyParseGradientsXlink(doc, referencedGradient);
  }
  if (referencedGradient) {
    gradientsAttrs.forEach(attr => {
      const value = referencedGradient.getAttribute(attr);
      if (!gradient.hasAttribute(attr) && value) {
        gradient.setAttribute(attr, value);
      }
    });
    if (!gradient.children.length) {
      const referenceClone = referencedGradient.cloneNode(true);
      while (referenceClone.firstChild) {
        gradient.appendChild(referenceClone.firstChild);
      }
    }
  }
  gradient.removeAttribute(xlinkAttr);
}

const tagArray = ['linearGradient', 'radialGradient', 'svg:linearGradient', 'svg:radialGradient'];

/**
 * Parses an SVG document, returning all of the gradient declarations found in it
 * @param {SVGDocument} doc SVG document to parse
 * @return {Object} Gradient definitions; key corresponds to element id, value -- to gradient definition element
 */
function getGradientDefs(doc) {
  const elList = getMultipleNodes(doc, tagArray);
  const gradientDefs = {};
  let j = elList.length;
  while (j--) {
    const el = elList[j];
    if (el.getAttribute('xlink:href')) {
      recursivelyParseGradientsXlink(doc, el);
    }
    const id = el.getAttribute('id');
    if (id) {
      gradientDefs[id] = el;
    }
  }
  return gradientDefs;
}

/**
 * Returns CSS rules for a given SVG document
 * @param {HTMLElement} doc SVG document to parse
 * @return {Object} CSS rules of this document
 */
function getCSSRules(doc) {
  const styles = doc.getElementsByTagName('style');
  const allRules = {};

  // very crude parsing of style contents
  for (let i = 0; i < styles.length; i++) {
    const styleContents = (styles[i].textContent || '').replace(
    // remove comments
    /\/\*[\s\S]*?\*\//g, '');
    if (styleContents.trim() === '') {
      continue;
    }
    // recovers all the rule in this form `body { style code... }`
    // rules = styleContents.match(/[^{]*\{[\s\S]*?\}/g);
    styleContents.split('}')
    // remove empty rules and remove everything if we didn't split in at least 2 pieces
    .filter((rule, index, array) => array.length > 1 && rule.trim())
    // at this point we have hopefully an array of rules `body { style code... `
    .forEach(rule => {
      // if there is more than one opening bracket and the rule starts with '@', it is likely
      // a nested at-rule like @media, @supports, @scope, etc. Ignore these as the code below
      // can not handle it.
      if ((rule.match(/{/g) || []).length > 1 && rule.trim().startsWith('@')) {
        return;
      }
      const match = rule.split('{'),
        ruleObj = {},
        declaration = match[1].trim(),
        propertyValuePairs = declaration.split(';').filter(function (pair) {
          return pair.trim();
        });
      for (let j = 0; j < propertyValuePairs.length; j++) {
        const pair = propertyValuePairs[j].split(':'),
          property = pair[0].trim(),
          value = pair[1].trim();
        ruleObj[property] = value;
      }
      rule = match[0].trim();
      rule.split(',').forEach(_rule => {
        _rule = _rule.replace(/^svg/i, '').trim();
        if (_rule === '') {
          return;
        }
        allRules[_rule] = {
          ...(allRules[_rule] || {}),
          ...ruleObj
        };
      });
    });
  }
  return allRules;
}

const findTag = el => classRegistry.getSVGClass(getTagName(el).toLowerCase());
class ElementsParser {
  constructor(elements, options, reviver, doc, clipPaths) {
    this.elements = elements;
    this.options = options;
    this.reviver = reviver;
    this.regexUrl = /^url\(['"]?#([^'"]+)['"]?\)/g;
    this.doc = doc;
    this.clipPaths = clipPaths;
    this.gradientDefs = getGradientDefs(doc);
    this.cssRules = getCSSRules(doc);
  }
  parse() {
    return Promise.all(this.elements.map(element => this.createObject(element)));
  }
  async createObject(el) {
    const klass = findTag(el);
    if (klass) {
      const obj = await klass.fromElement(el, this.options, this.cssRules);
      this.resolveGradient(obj, el, FILL);
      this.resolveGradient(obj, el, STROKE);
      if (obj instanceof FabricImage && obj._originalElement) {
        removeTransformMatrixForSvgParsing(obj, obj.parsePreserveAspectRatioAttribute());
      } else {
        removeTransformMatrixForSvgParsing(obj);
      }
      await this.resolveClipPath(obj, el);
      this.reviver && this.reviver(el, obj);
      return obj;
    }
    return null;
  }
  extractPropertyDefinition(obj, property, storage) {
    const value = obj[property],
      regex = this.regexUrl;
    if (!regex.test(value)) {
      return undefined;
    }
    // verify: can we remove the 'g' flag? and remove lastIndex changes?
    regex.lastIndex = 0;
    // we passed the regex test, so we know is not null;
    const id = regex.exec(value)[1];
    regex.lastIndex = 0;
    // @todo fix this
    return storage[id];
  }
  resolveGradient(obj, el, property) {
    const gradientDef = this.extractPropertyDefinition(obj, property, this.gradientDefs);
    if (gradientDef) {
      const opacityAttr = el.getAttribute(property + '-opacity');
      const gradient = Gradient.fromElement(gradientDef, obj, {
        ...this.options,
        opacity: opacityAttr
      });
      obj.set(property, gradient);
    }
  }

  // TODO: resolveClipPath could be run once per clippath with minor work per object.
  // is a refactor that i m not sure is worth on this code
  async resolveClipPath(obj, usingElement, exactOwner) {
    const clipPathElements = this.extractPropertyDefinition(obj, 'clipPath', this.clipPaths);
    if (clipPathElements) {
      const objTransformInv = invertTransform(obj.calcTransformMatrix());
      const clipPathTag = clipPathElements[0].parentElement;
      let clipPathOwner = usingElement;
      while (!exactOwner && clipPathOwner.parentElement && clipPathOwner.getAttribute('clip-path') !== obj.clipPath) {
        clipPathOwner = clipPathOwner.parentElement;
      }
      // move the clipPath tag as sibling to the real element that is using it
      clipPathOwner.parentElement.appendChild(clipPathTag);

      // this multiplication order could be opposite.
      // but i don't have an svg to test it
      // at the first SVG that has a transform on both places and is misplaced
      // try to invert this multiplication order
      const finalTransform = parseTransformAttribute(`${clipPathOwner.getAttribute('transform') || ''} ${clipPathTag.getAttribute('originalTransform') || ''}`);
      clipPathTag.setAttribute('transform', `matrix(${finalTransform.join(',')})`);
      const container = await Promise.all(clipPathElements.map(clipPathElement => {
        return findTag(clipPathElement).fromElement(clipPathElement, this.options, this.cssRules).then(enlivedClippath => {
          removeTransformMatrixForSvgParsing(enlivedClippath);
          enlivedClippath.fillRule = enlivedClippath.clipRule;
          delete enlivedClippath.clipRule;
          return enlivedClippath;
        });
      }));
      const clipPath = container.length === 1 ? container[0] : new Group(container);
      const gTransform = multiplyTransformMatrices(objTransformInv, clipPath.calcTransformMatrix());
      if (clipPath.clipPath) {
        await this.resolveClipPath(clipPath, clipPathOwner,
        // this is tricky.
        // it tries to differentiate from when clipPaths are inherited by outside groups
        // or when are really clipPaths referencing other clipPaths
        clipPathTag.getAttribute('clip-path') ? clipPathOwner : undefined);
      }
      const {
        scaleX,
        scaleY,
        angle,
        skewX,
        translateX,
        translateY
      } = qrDecompose(gTransform);
      clipPath.set({
        flipX: false,
        flipY: false
      });
      clipPath.set({
        scaleX,
        scaleY,
        angle,
        skewX,
        skewY: 0
      });
      clipPath.setPositionByOrigin(new Point(translateX, translateY), CENTER, CENTER);
      obj.clipPath = clipPath;
    } else {
      // if clip-path does not resolve to any element, delete the property.
      delete obj.clipPath;
      return;
    }
  }
}

const isValidSvgTag = el => svgValidTagNamesRegEx.test(getTagName(el));
const createEmptyResponse = () => ({
  objects: [],
  elements: [],
  options: {},
  allElements: []
});

/**
 * Parses an SVG document, converts it to an array of corresponding fabric.* instances and passes them to a callback
 * @param {HTMLElement} doc SVG document to parse
 * @param {TSvgParsedCallback} callback Invoked when the parsing is done, with null if parsing wasn't possible with the list of svg nodes.
 * @param {TSvgReviverCallback} [reviver] Extra callback for further parsing of SVG elements, called after each fabric object has been created.
 * Takes as input the original svg element and the generated `FabricObject` as arguments. Used to inspect extra properties not parsed by fabric,
 * or extra custom manipulation
 * @param {Object} [options] Object containing options for parsing
 * @param {String} [options.crossOrigin] crossOrigin setting to use for external resources
 * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 * @return {SVGParsingOutput}
 * {@link SVGParsingOutput} also receives `allElements` array as the last argument. This is the full list of svg nodes available in the document.
 * You may want to use it if you are trying to regroup the objects as they were originally grouped in the SVG. ( This was the reason why it was added )
 */
async function parseSVGDocument(doc, reviver) {
  let {
    crossOrigin,
    signal
  } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (signal && signal.aborted) {
    log('log', new SignalAbortedError('parseSVGDocument'));
    // this is an unhappy path, we dont care about speed
    return createEmptyResponse();
  }
  const documentElement = doc.documentElement;
  parseUseDirectives(doc);
  const descendants = Array.from(documentElement.getElementsByTagName('*')),
    options = {
      ...applyViewboxTransform(documentElement),
      crossOrigin,
      signal
    };
  const elements = descendants.filter(el => {
    applyViewboxTransform(el);
    return isValidSvgTag(el) && !hasInvalidAncestor(el); // http://www.w3.org/TR/SVG/struct.html#DefsElement
  });
  if (!elements || elements && !elements.length) {
    return {
      ...createEmptyResponse(),
      options,
      allElements: descendants
    };
  }
  const localClipPaths = {};
  descendants.filter(el => getTagName(el) === 'clipPath').forEach(el => {
    el.setAttribute('originalTransform', el.getAttribute('transform') || '');
    const id = el.getAttribute('id');
    localClipPaths[id] = Array.from(el.getElementsByTagName('*')).filter(el => isValidSvgTag(el));
  });

  // Precedence of rules:   style > class > attribute
  const elementParser = new ElementsParser(elements, options, reviver, doc, localClipPaths);
  const instances = await elementParser.parse();
  return {
    objects: instances,
    elements,
    options,
    allElements: descendants
  };
}

/**
 * Takes string corresponding to an SVG document, and parses it into a set of fabric objects
 * @param {String} string representing the svg
 * @param {TSvgParsedCallback} callback Invoked when the parsing is done, with null if parsing wasn't possible with the list of svg nodes.
 * {@link TSvgParsedCallback} also receives `allElements` array as the last argument. This is the full list of svg nodes available in the document.
 * You may want to use it if you are trying to regroup the objects as they were originally grouped in the SVG. ( This was the reason why it was added )
 * @param {TSvgReviverCallback} [reviver] Extra callback for further parsing of SVG elements, called after each fabric object has been created.
 * Takes as input the original svg element and the generated `FabricObject` as arguments. Used to inspect extra properties not parsed by fabric,
 * or extra custom manipulation
 * @param {Object} [options] Object containing options for parsing
 * @param {String} [options.crossOrigin] crossOrigin setting to use for external resources
 * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 */
function loadSVGFromString(string, reviver, options) {
  const parser = new (getFabricWindow().DOMParser)(),
    // should we use `image/svg+xml` here?
    doc = parser.parseFromString(string.trim(), 'text/xml');
  return parseSVGDocument(doc, reviver, options);
}

/**
 * Takes url corresponding to an SVG document, and parses it into a set of fabric objects.
 * Note that SVG is fetched via fetch API, so it needs to conform to SOP (Same Origin Policy)
 * @param {string} url where the SVG is
 * @param {TSvgParsedCallback} callback Invoked when the parsing is done, with null if parsing wasn't possible with the list of svg nodes.
 * {@link TSvgParsedCallback} also receives `allElements` array as the last argument. This is the full list of svg nodes available in the document.
 * You may want to use it if you are trying to regroup the objects as they were originally grouped in the SVG. ( This was the reason why it was added )
 * @param {TSvgReviverCallback} [reviver] Extra callback for further parsing of SVG elements, called after each fabric object has been created.
 * Takes as input the original svg element and the generated `FabricObject` as arguments. Used to inspect extra properties not parsed by fabric,
 * or extra custom manipulation
 * @param {Object} [options] Object containing options for parsing
 * @param {String} [options.crossOrigin] crossOrigin setting to use for external resources
 * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 */
function loadSVGFromURL(url, reviver) {
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return fetch(url.replace(/^\n\s*/, '').trim(), {
    signal: options.signal
  }).then(response => {
    if (!response.ok) {
      throw new FabricError(`HTTP error! status: ${response.status}`);
    }
    return response.text();
  }).then(svgText => {
    return loadSVGFromString(svgText, reviver, options);
  }).catch(() => {
    // this is an unhappy path, we dont care about speed
    return createEmptyResponse();
  });
}

const ACTION_NAME$1 = MODIFY_POLY;
/**
 * This function locates the controls.
 * It'll be used both for drawing and for interaction.
 */
const createPolyPositionHandler = pointIndex => {
  return function (dim, finalMatrix, polyObject) {
    const {
      points,
      pathOffset
    } = polyObject;
    return new Point(points[pointIndex]).subtract(pathOffset).transform(multiplyTransformMatrices(polyObject.getViewportTransform(), polyObject.calcTransformMatrix()));
  };
};

/**
 * This function defines what the control does.
 * It'll be called on every mouse move after a control has been clicked and is being dragged.
 * The function receives as argument the mouse event, the current transform object
 * and the current position in canvas coordinate `transform.target` is a reference to the
 * current object being transformed.
 */
const polyActionHandler = (eventData, transform, x, y) => {
  const {
    target,
    pointIndex
  } = transform;
  const poly = target;
  const mouseLocalPosition = sendPointToPlane(new Point(x, y), undefined, poly.calcOwnMatrix());
  poly.points[pointIndex] = mouseLocalPosition.add(poly.pathOffset);
  poly.setDimensions();
  poly.set('dirty', true);
  return true;
};

/**
 * Keep the polygon in the same position when we change its `width`/`height`/`top`/`left`.
 */
const factoryPolyActionHandler = (pointIndex, fn) => {
  return function (eventData, transform, x, y) {
    const poly = transform.target,
      anchorPoint = new Point(poly.points[(pointIndex > 0 ? pointIndex : poly.points.length) - 1]),
      anchorPointInParentPlane = anchorPoint.subtract(poly.pathOffset).transform(poly.calcOwnMatrix()),
      actionPerformed = fn(eventData, {
        ...transform,
        pointIndex
      }, x, y);
    const newAnchorPointInParentPlane = anchorPoint.subtract(poly.pathOffset).transform(poly.calcOwnMatrix());
    const diff = newAnchorPointInParentPlane.subtract(anchorPointInParentPlane);
    poly.left -= diff.x;
    poly.top -= diff.y;
    return actionPerformed;
  };
};
const createPolyActionHandler = pointIndex => wrapWithFireEvent(ACTION_NAME$1, factoryPolyActionHandler(pointIndex, polyActionHandler));
function createPolyControls(arg0) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const controls = {};
  for (let idx = 0; idx < (typeof arg0 === 'number' ? arg0 : arg0.points.length); idx++) {
    controls[`p${idx}`] = new Control({
      actionName: ACTION_NAME$1,
      positionHandler: createPolyPositionHandler(idx),
      actionHandler: createPolyActionHandler(idx),
      ...options
    });
  }
  return controls;
}

const ACTION_NAME = 'modifyPath';
const calcPathPointPosition = (pathObject, commandIndex, pointIndex) => {
  const {
    path,
    pathOffset
  } = pathObject;
  const command = path[commandIndex];
  return new Point(command[pointIndex] - pathOffset.x, command[pointIndex + 1] - pathOffset.y).transform(multiplyTransformMatrices(pathObject.getViewportTransform(), pathObject.calcTransformMatrix()));
};
const movePathPoint = (pathObject, x, y, commandIndex, pointIndex) => {
  const {
    path,
    pathOffset
  } = pathObject;
  const anchorCommand = path[(commandIndex > 0 ? commandIndex : path.length) - 1];
  const anchorPoint = new Point(anchorCommand[pointIndex], anchorCommand[pointIndex + 1]);
  const anchorPointInParentPlane = anchorPoint.subtract(pathOffset).transform(pathObject.calcOwnMatrix());
  const mouseLocalPosition = sendPointToPlane(new Point(x, y), undefined, pathObject.calcOwnMatrix());
  path[commandIndex][pointIndex] = mouseLocalPosition.x + pathOffset.x;
  path[commandIndex][pointIndex + 1] = mouseLocalPosition.y + pathOffset.y;
  pathObject.setDimensions();
  const newAnchorPointInParentPlane = anchorPoint.subtract(pathObject.pathOffset).transform(pathObject.calcOwnMatrix());
  const diff = newAnchorPointInParentPlane.subtract(anchorPointInParentPlane);
  pathObject.left -= diff.x;
  pathObject.top -= diff.y;
  pathObject.set('dirty', true);
  return true;
};

/**
 * This function locates the controls.
 * It'll be used both for drawing and for interaction.
 */
function pathPositionHandler(dim, finalMatrix, pathObject) {
  const {
    commandIndex,
    pointIndex
  } = this;
  return calcPathPointPosition(pathObject, commandIndex, pointIndex);
}

/**
 * This function defines what the control does.
 * It'll be called on every mouse move after a control has been clicked and is being dragged.
 * The function receives as argument the mouse event, the current transform object
 * and the current position in canvas coordinate `transform.target` is a reference to the
 * current object being transformed.
 */
function pathActionHandler(eventData, transform, x, y) {
  const {
    target
  } = transform;
  const {
    commandIndex,
    pointIndex
  } = this;
  const actionPerformed = movePathPoint(target, x, y, commandIndex, pointIndex);
  {
    fireEvent(this.actionName, {
      ...commonEventInfo(eventData, transform, x, y),
      commandIndex,
      pointIndex
    });
  }
  return actionPerformed;
}
const indexFromPrevCommand = previousCommandType => previousCommandType === 'C' ? 5 : previousCommandType === 'Q' ? 3 : 1;
class PathPointControl extends Control {
  constructor(options) {
    super(options);
  }
  render(ctx, left, top, styleOverride, fabricObject) {
    const overrides = {
      ...styleOverride,
      cornerColor: this.controlFill,
      cornerStrokeColor: this.controlStroke,
      transparentCorners: !this.controlFill
    };
    super.render(ctx, left, top, overrides, fabricObject);
  }
}
class PathControlPointControl extends PathPointControl {
  constructor(options) {
    super(options);
  }
  render(ctx, left, top, styleOverride, fabricObject) {
    const {
      path
    } = fabricObject;
    const {
      commandIndex,
      pointIndex,
      connectToCommandIndex,
      connectToPointIndex
    } = this;
    ctx.save();
    ctx.strokeStyle = this.controlStroke;
    if (this.connectionDashArray) {
      ctx.setLineDash(this.connectionDashArray);
    }
    const [commandType] = path[commandIndex];
    const point = calcPathPointPosition(fabricObject, connectToCommandIndex, connectToPointIndex);
    if (commandType === 'Q') {
      // one control point connects to 2 points
      const point2 = calcPathPointPosition(fabricObject, commandIndex, pointIndex + 2);
      ctx.moveTo(point2.x, point2.y);
      ctx.lineTo(left, top);
    } else {
      ctx.moveTo(left, top);
    }
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    ctx.restore();
    super.render(ctx, left, top, styleOverride, fabricObject);
  }
}
const createControl = (commandIndexPos, pointIndexPos, isControlPoint, options, connectToCommandIndex, connectToPointIndex) => new (isControlPoint ? PathControlPointControl : PathPointControl)({
  commandIndex: commandIndexPos,
  pointIndex: pointIndexPos,
  actionName: ACTION_NAME,
  positionHandler: pathPositionHandler,
  actionHandler: pathActionHandler,
  connectToCommandIndex,
  connectToPointIndex,
  ...options,
  ...(isControlPoint ? options.controlPointStyle : options.pointStyle)
});
function createPathControls(path) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const controls = {};
  let previousCommandType = 'M';
  path.path.forEach((command, commandIndex) => {
    const commandType = command[0];
    if (commandType !== 'Z') {
      controls[`c_${commandIndex}_${commandType}`] = createControl(commandIndex, command.length - 2, false, options);
    }
    switch (commandType) {
      case 'C':
        controls[`c_${commandIndex}_C_CP_1`] = createControl(commandIndex, 1, true, options, commandIndex - 1, indexFromPrevCommand(previousCommandType));
        controls[`c_${commandIndex}_C_CP_2`] = createControl(commandIndex, 3, true, options, commandIndex, 5);
        break;
      case 'Q':
        controls[`c_${commandIndex}_Q_CP_1`] = createControl(commandIndex, 1, true, options, commandIndex, 3);
        break;
    }
    previousCommandType = commandType;
  });
  return controls;
}

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  changeWidth: changeWidth,
  createObjectDefaultControls: createObjectDefaultControls,
  createPathControls: createPathControls,
  createPolyActionHandler: createPolyActionHandler,
  createPolyControls: createPolyControls,
  createPolyPositionHandler: createPolyPositionHandler,
  createResizeControls: createResizeControls,
  createTextboxDefaultControls: createTextboxDefaultControls,
  dragHandler: dragHandler,
  factoryPolyActionHandler: factoryPolyActionHandler,
  getLocalPoint: getLocalPoint,
  polyActionHandler: polyActionHandler,
  renderCircleControl: renderCircleControl,
  renderSquareControl: renderSquareControl,
  rotationStyleHandler: rotationStyleHandler,
  rotationWithSnapping: rotationWithSnapping,
  scaleCursorStyleHandler: scaleCursorStyleHandler,
  scaleOrSkewActionName: scaleOrSkewActionName,
  scaleSkewCursorStyleHandler: scaleSkewCursorStyleHandler,
  scalingEqually: scalingEqually,
  scalingX: scalingX,
  scalingXOrSkewingY: scalingXOrSkewingY,
  scalingY: scalingY,
  scalingYOrSkewingX: scalingYOrSkewingX,
  skewCursorStyleHandler: skewCursorStyleHandler,
  skewHandlerX: skewHandlerX,
  skewHandlerY: skewHandlerY,
  wrapWithFireEvent: wrapWithFireEvent,
  wrapWithFixedAnchor: wrapWithFixedAnchor
});

const isWebGLPipelineState = options => {
  return options.webgl !== undefined;
};

/**
 * Pick a method to copy data from GL context to 2d canvas.  In some browsers using
 * drawImage should be faster, but is also bugged for a small combination of old hardware
 * and drivers.
 * putImageData is faster than drawImage for that specific operation.
 */
const isPutImageFaster = (width, height) => {
  const targetCanvas = createCanvasElementFor({
    width,
    height
  });
  const sourceCanvas = createCanvasElement();
  const gl = sourceCanvas.getContext('webgl');
  // eslint-disable-next-line no-undef
  const imageBuffer = new ArrayBuffer(width * height * 4);
  const testContext = {
    imageBuffer: imageBuffer
  };
  const testPipelineState = {
    destinationWidth: width,
    destinationHeight: height,
    targetCanvas: targetCanvas
  };
  let startTime;
  startTime = getFabricWindow().performance.now();
  WebGLFilterBackend.prototype.copyGLTo2D.call(testContext, gl, testPipelineState);
  const drawImageTime = getFabricWindow().performance.now() - startTime;
  startTime = getFabricWindow().performance.now();
  WebGLFilterBackend.prototype.copyGLTo2DPutImageData.call(testContext, gl, testPipelineState);
  const putImageDataTime = getFabricWindow().performance.now() - startTime;
  return drawImageTime > putImageDataTime;
};

const highPsourceCode = `precision highp float`;
const identityFragmentShader = `
    ${highPsourceCode};
    varying vec2 vTexCoord;
    uniform sampler2D uTexture;
    void main() {
      gl_FragColor = texture2D(uTexture, vTexCoord);
    }`;
const vertexSource$1 = `
    attribute vec2 aPosition;
    varying vec2 vTexCoord;
    void main() {
      vTexCoord = aPosition;
      gl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);
    }`;

const regex = new RegExp(highPsourceCode, 'g');
class BaseFilter {
  /**
   * Filter type
   */
  get type() {
    return this.constructor.type;
  }

  /**
   * The class type. Used to identify which class this is.
   * This is used for serialization purposes and internally it can be used
   * to identify classes. As a developer you could use `instance of Class`
   * but to avoid importing all the code and blocking tree shaking we try
   * to avoid doing that.
   */

  /**
   * Constructor
   * @param {Object} [options] Options object
   */
  constructor() {
    let {
      type,
      ...options
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    Object.assign(this, this.constructor.defaults, options);
  }
  getFragmentSource() {
    return identityFragmentShader;
  }
  getVertexSource() {
    return vertexSource$1;
  }

  /**
   * Compile this filter's shader program.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context to use for shader compilation.
   * @param {String} fragmentSource fragmentShader source for compilation
   * @param {String} vertexSource vertexShader source for compilation
   */
  createProgram(gl) {
    let fragmentSource = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.getFragmentSource();
    let vertexSource = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.getVertexSource();
    const {
      WebGLProbe: {
        GLPrecision = 'highp'
      }
    } = getEnv$1();
    if (GLPrecision !== 'highp') {
      fragmentSource = fragmentSource.replace(regex, highPsourceCode.replace('highp', GLPrecision));
    }
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!vertexShader || !fragmentShader || !program) {
      throw new FabricError('Vertex, fragment shader or program creation error');
    }
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      throw new FabricError(`Vertex shader compile error for ${this.type}: ${gl.getShaderInfoLog(vertexShader)}`);
    }
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      throw new FabricError(`Fragment shader compile error for ${this.type}: ${gl.getShaderInfoLog(fragmentShader)}`);
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new FabricError(`Shader link error for "${this.type}" ${gl.getProgramInfoLog(program)}`);
    }
    const uniformLocations = this.getUniformLocations(gl, program) || {};
    uniformLocations.uStepW = gl.getUniformLocation(program, 'uStepW');
    uniformLocations.uStepH = gl.getUniformLocation(program, 'uStepH');
    return {
      program,
      attributeLocations: this.getAttributeLocations(gl, program),
      uniformLocations
    };
  }

  /**
   * Return a map of attribute names to WebGLAttributeLocation objects.
   *
   * @param {WebGLRenderingContext} gl The canvas context used to compile the shader program.
   * @param {WebGLShaderProgram} program The shader program from which to take attribute locations.
   * @returns {Object} A map of attribute names to attribute locations.
   */
  getAttributeLocations(gl, program) {
    return {
      aPosition: gl.getAttribLocation(program, 'aPosition')
    };
  }

  /**
   * Return a map of uniform names to WebGLUniformLocation objects.
   *
   * @param {WebGLRenderingContext} gl The canvas context used to compile the shader program.
   * @param {WebGLShaderProgram} program The shader program from which to take uniform locations.
   * @returns {Object} A map of uniform names to uniform locations.
   */
  getUniformLocations(gl, program) {
    const locations = this.constructor.uniformLocations;
    const uniformLocations = {};
    for (let i = 0; i < locations.length; i++) {
      uniformLocations[locations[i]] = gl.getUniformLocation(program, locations[i]);
    }
    return uniformLocations;
  }

  /**
   * Send attribute data from this filter to its shader program on the GPU.
   *
   * @param {WebGLRenderingContext} gl The canvas context used to compile the shader program.
   * @param {Object} attributeLocations A map of shader attribute names to their locations.
   */
  sendAttributeData(gl, attributeLocations, aPositionData) {
    const attributeLocation = attributeLocations.aPosition;
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(attributeLocation);
    gl.vertexAttribPointer(attributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, aPositionData, gl.STATIC_DRAW);
  }
  _setupFrameBuffer(options) {
    const gl = options.context;
    if (options.passes > 1) {
      const width = options.destinationWidth;
      const height = options.destinationHeight;
      if (options.sourceWidth !== width || options.sourceHeight !== height) {
        gl.deleteTexture(options.targetTexture);
        options.targetTexture = options.filterBackend.createTexture(gl, width, height);
      }
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, options.targetTexture, 0);
    } else {
      // draw last filter on canvas and not to framebuffer.
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.finish();
    }
  }
  _swapTextures(options) {
    options.passes--;
    options.pass++;
    const temp = options.targetTexture;
    options.targetTexture = options.sourceTexture;
    options.sourceTexture = temp;
  }

  /**
   * Generic isNeutral implementation for one parameter based filters.
   * Used only in image applyFilters to discard filters that will not have an effect
   * on the image
   * Other filters may need their own version ( ColorMatrix, HueRotation, gamma, ComposedFilter )
   * @param {Object} options
   **/
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isNeutralState(options) {
    return false;
  }

  /**
   * Apply this filter to the input image data provided.
   *
   * Determines whether to use WebGL or Canvas2D based on the options.webgl flag.
   *
   * @param {Object} options
   * @param {Number} options.passes The number of filters remaining to be executed
   * @param {Boolean} options.webgl Whether to use webgl to render the filter.
   * @param {WebGLTexture} options.sourceTexture The texture setup as the source to be filtered.
   * @param {WebGLTexture} options.targetTexture The texture where filtered output should be drawn.
   * @param {WebGLRenderingContext} options.context The GL context used for rendering.
   * @param {Object} options.programCache A map of compiled shader programs, keyed by filter type.
   */
  applyTo(options) {
    if (isWebGLPipelineState(options)) {
      this._setupFrameBuffer(options);
      this.applyToWebGL(options);
      this._swapTextures(options);
    } else {
      this.applyTo2d(options);
    }
  }
  applyTo2d(_options) {
    // override by subclass
  }

  /**
   * Returns a string that represent the current selected shader code for the filter.
   * Used to force recompilation when parameters change or to retrieve the shader from cache
   * @type string
   **/
  getCacheKey() {
    return this.type;
  }

  /**
   * Retrieves the cached shader.
   * @param {Object} options
   * @param {WebGLRenderingContext} options.context The GL context used for rendering.
   * @param {Object} options.programCache A map of compiled shader programs, keyed by filter type.
   * @return {WebGLProgram} the compiled program shader
   */
  retrieveShader(options) {
    const key = this.getCacheKey();
    if (!options.programCache[key]) {
      options.programCache[key] = this.createProgram(options.context);
    }
    return options.programCache[key];
  }

  /**
   * Apply this filter using webgl.
   *
   * @param {Object} options
   * @param {Number} options.passes The number of filters remaining to be executed
   * @param {Boolean} options.webgl Whether to use webgl to render the filter.
   * @param {WebGLTexture} options.originalTexture The texture of the original input image.
   * @param {WebGLTexture} options.sourceTexture The texture setup as the source to be filtered.
   * @param {WebGLTexture} options.targetTexture The texture where filtered output should be drawn.
   * @param {WebGLRenderingContext} options.context The GL context used for rendering.
   * @param {Object} options.programCache A map of compiled shader programs, keyed by filter type.
   */
  applyToWebGL(options) {
    const gl = options.context;
    const shader = this.retrieveShader(options);
    if (options.pass === 0 && options.originalTexture) {
      gl.bindTexture(gl.TEXTURE_2D, options.originalTexture);
    } else {
      gl.bindTexture(gl.TEXTURE_2D, options.sourceTexture);
    }
    gl.useProgram(shader.program);
    this.sendAttributeData(gl, shader.attributeLocations, options.aPosition);
    gl.uniform1f(shader.uniformLocations.uStepW, 1 / options.sourceWidth);
    gl.uniform1f(shader.uniformLocations.uStepH, 1 / options.sourceHeight);
    this.sendUniformData(gl, shader.uniformLocations);
    gl.viewport(0, 0, options.destinationWidth, options.destinationHeight);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  bindAdditionalTexture(gl, texture, textureUnit) {
    gl.activeTexture(textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // reset active texture to 0 as usual
    gl.activeTexture(gl.TEXTURE0);
  }
  unbindAdditionalTexture(gl, textureUnit) {
    gl.activeTexture(textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.activeTexture(gl.TEXTURE0);
  }

  /**
   * Send uniform data from this filter to its shader program on the GPU.
   *
   * Intended to be overridden by subclasses.
   *
   * @param {WebGLRenderingContext} _gl The canvas context used to compile the shader program.
   * @param {Object} _uniformLocations A map of shader uniform names to their locations.
   */
  sendUniformData(_gl, _uniformLocations) {
    // override by subclass
  }

  /**
   * If needed by a 2d filter, this functions can create an helper canvas to be used
   * remember that options.targetCanvas is available for use till end of chain.
   */
  createHelpLayer(options) {
    if (!options.helpLayer) {
      const {
        sourceWidth,
        sourceHeight
      } = options;
      const helpLayer = createCanvasElementFor({
        width: sourceWidth,
        height: sourceHeight
      });
      options.helpLayer = helpLayer;
    }
  }

  /**
   * Returns object representation of an instance
   * It will automatically export the default values of a filter,
   * stored in the static defaults property.
   * @return {Object} Object representation of an instance
   */
  toObject() {
    const defaultKeys = Object.keys(this.constructor.defaults || {});
    return {
      type: this.type,
      ...defaultKeys.reduce((acc, key) => {
        acc[key] = this[key];
        return acc;
      }, {})
    };
  }

  /**
   * Returns a JSON representation of an instance
   * @return {Object} JSON
   */
  toJSON() {
    // delegate, not alias
    return this.toObject();
  }
  static async fromObject(_ref, _options) {
    let {
      type,
      ...filterOptions
    } = _ref;
    return new this(filterOptions);
  }
}
_defineProperty(BaseFilter, "type", 'BaseFilter');
/**
 * Contains the uniform locations for the fragment shader.
 * uStepW and uStepH are handled by the BaseFilter, each filter class
 * needs to specify all the one that are needed
 */
_defineProperty(BaseFilter, "uniformLocations", []);

const blendColorFragmentSource = {
  multiply: 'gl_FragColor.rgb *= uColor.rgb;\n',
  screen: 'gl_FragColor.rgb = 1.0 - (1.0 - gl_FragColor.rgb) * (1.0 - uColor.rgb);\n',
  add: 'gl_FragColor.rgb += uColor.rgb;\n',
  difference: 'gl_FragColor.rgb = abs(gl_FragColor.rgb - uColor.rgb);\n',
  subtract: 'gl_FragColor.rgb -= uColor.rgb;\n',
  lighten: 'gl_FragColor.rgb = max(gl_FragColor.rgb, uColor.rgb);\n',
  darken: 'gl_FragColor.rgb = min(gl_FragColor.rgb, uColor.rgb);\n',
  exclusion: 'gl_FragColor.rgb += uColor.rgb - 2.0 * (uColor.rgb * gl_FragColor.rgb);\n',
  overlay: `
    if (uColor.r < 0.5) {
      gl_FragColor.r *= 2.0 * uColor.r;
    } else {
      gl_FragColor.r = 1.0 - 2.0 * (1.0 - gl_FragColor.r) * (1.0 - uColor.r);
    }
    if (uColor.g < 0.5) {
      gl_FragColor.g *= 2.0 * uColor.g;
    } else {
      gl_FragColor.g = 1.0 - 2.0 * (1.0 - gl_FragColor.g) * (1.0 - uColor.g);
    }
    if (uColor.b < 0.5) {
      gl_FragColor.b *= 2.0 * uColor.b;
    } else {
      gl_FragColor.b = 1.0 - 2.0 * (1.0 - gl_FragColor.b) * (1.0 - uColor.b);
    }
    `,
  tint: `
    gl_FragColor.rgb *= (1.0 - uColor.a);
    gl_FragColor.rgb += uColor.rgb;
    `
};

const blendColorDefaultValues = {
  color: '#F95C63',
  mode: 'multiply',
  alpha: 1
};

/**
 * Color Blend filter class
 * @example
 * const filter = new BlendColor({
 *  color: '#000',
 *  mode: 'multiply'
 * });
 *
 * const filter = new BlendImage({
 *  image: fabricImageObject,
 *  mode: 'multiply'
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 */
class BlendColor extends BaseFilter {
  getCacheKey() {
    return `${this.type}_${this.mode}`;
  }
  getFragmentSource() {
    return `
      precision highp float;
      uniform sampler2D uTexture;
      uniform vec4 uColor;
      varying vec2 vTexCoord;
      void main() {
        vec4 color = texture2D(uTexture, vTexCoord);
        gl_FragColor = color;
        if (color.a > 0.0) {
          ${blendColorFragmentSource[this.mode]}
        }
      }
      `;
  }

  /**
   * Apply the Blend operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d(_ref) {
    let {
      imageData: {
        data
      }
    } = _ref;
    const source = new Color(this.color).getSource();
    const alpha = this.alpha;
    const tr = source[0] * alpha;
    const tg = source[1] * alpha;
    const tb = source[2] * alpha;
    const alpha1 = 1 - alpha;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      let oR, oG, oB;
      switch (this.mode) {
        case 'multiply':
          oR = r * tr / 255;
          oG = g * tg / 255;
          oB = b * tb / 255;
          break;
        case 'screen':
          oR = 255 - (255 - r) * (255 - tr) / 255;
          oG = 255 - (255 - g) * (255 - tg) / 255;
          oB = 255 - (255 - b) * (255 - tb) / 255;
          break;
        case 'add':
          oR = r + tr;
          oG = g + tg;
          oB = b + tb;
          break;
        case 'difference':
          oR = Math.abs(r - tr);
          oG = Math.abs(g - tg);
          oB = Math.abs(b - tb);
          break;
        case 'subtract':
          oR = r - tr;
          oG = g - tg;
          oB = b - tb;
          break;
        case 'darken':
          oR = Math.min(r, tr);
          oG = Math.min(g, tg);
          oB = Math.min(b, tb);
          break;
        case 'lighten':
          oR = Math.max(r, tr);
          oG = Math.max(g, tg);
          oB = Math.max(b, tb);
          break;
        case 'overlay':
          oR = tr < 128 ? 2 * r * tr / 255 : 255 - 2 * (255 - r) * (255 - tr) / 255;
          oG = tg < 128 ? 2 * g * tg / 255 : 255 - 2 * (255 - g) * (255 - tg) / 255;
          oB = tb < 128 ? 2 * b * tb / 255 : 255 - 2 * (255 - b) * (255 - tb) / 255;
          break;
        case 'exclusion':
          oR = tr + r - 2 * tr * r / 255;
          oG = tg + g - 2 * tg * g / 255;
          oB = tb + b - 2 * tb * b / 255;
          break;
        case 'tint':
          oR = tr + r * alpha1;
          oG = tg + g * alpha1;
          oB = tb + b * alpha1;
      }
      data[i] = oR;
      data[i + 1] = oG;
      data[i + 2] = oB;
    }
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(gl, uniformLocations) {
    const source = new Color(this.color).getSource();
    source[0] = this.alpha * source[0] / 255;
    source[1] = this.alpha * source[1] / 255;
    source[2] = this.alpha * source[2] / 255;
    source[3] = this.alpha;
    gl.uniform4fv(uniformLocations.uColor, source);
  }
}
/**
 * Color to make the blend operation with. default to a reddish color since black or white
 * gives always strong result.
 * @type String
 **/
/**
 * Blend mode for the filter: one of multiply, add, difference, screen, subtract,
 * darken, lighten, overlay, exclusion, tint.
 * @type String
 **/
/**
 * alpha value. represent the strength of the blend color operation.
 * @type Number
 **/
_defineProperty(BlendColor, "defaults", blendColorDefaultValues);
_defineProperty(BlendColor, "type", 'BlendColor');
_defineProperty(BlendColor, "uniformLocations", ['uColor']);
classRegistry.setClass(BlendColor);

const fragmentSource$c = {
  multiply: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform sampler2D uImage;
    uniform vec4 uColor;
    varying vec2 vTexCoord;
    varying vec2 vTexCoord2;
    void main() {
      vec4 color = texture2D(uTexture, vTexCoord);
      vec4 color2 = texture2D(uImage, vTexCoord2);
      color.rgba *= color2.rgba;
      gl_FragColor = color;
    }
    `,
  mask: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform sampler2D uImage;
    uniform vec4 uColor;
    varying vec2 vTexCoord;
    varying vec2 vTexCoord2;
    void main() {
      vec4 color = texture2D(uTexture, vTexCoord);
      vec4 color2 = texture2D(uImage, vTexCoord2);
      color.a = color2.a;
      gl_FragColor = color;
    }
    `
};
const vertexSource = `
    attribute vec2 aPosition;
    varying vec2 vTexCoord;
    varying vec2 vTexCoord2;
    uniform mat3 uTransformMatrix;
    void main() {
      vTexCoord = aPosition;
      vTexCoord2 = (uTransformMatrix * vec3(aPosition, 1.0)).xy;
      gl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);
    }
    `;

const blendImageDefaultValues = {
  mode: 'multiply',
  alpha: 1
};

/**
 * Image Blend filter class
 * @example
 * const filter = new filters.BlendColor({
 *  color: '#000',
 *  mode: 'multiply'
 * });
 *
 * const filter = new BlendImage({
 *  image: fabricImageObject,
 *  mode: 'multiply'
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 */
class BlendImage extends BaseFilter {
  getCacheKey() {
    return `${this.type}_${this.mode}`;
  }
  getFragmentSource() {
    return fragmentSource$c[this.mode];
  }
  getVertexSource() {
    return vertexSource;
  }
  applyToWebGL(options) {
    const gl = options.context,
      texture = this.createTexture(options.filterBackend, this.image);
    this.bindAdditionalTexture(gl, texture, gl.TEXTURE1);
    super.applyToWebGL(options);
    this.unbindAdditionalTexture(gl, gl.TEXTURE1);
  }
  createTexture(backend, image) {
    return backend.getCachedTexture(image.cacheKey, image.getElement());
  }

  /**
   * Calculate a transformMatrix to adapt the image to blend over
   * @param {Object} options
   * @param {WebGLRenderingContext} options.context The GL context used for rendering.
   * @param {Object} options.programCache A map of compiled shader programs, keyed by filter type.
   */
  calculateMatrix() {
    const image = this.image,
      {
        width,
        height
      } = image.getElement();
    return [1 / image.scaleX, 0, 0, 0, 1 / image.scaleY, 0, -image.left / width, -image.top / height, 1];
  }

  /**
   * Apply the Blend operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d(_ref) {
    let {
      imageData: {
        data,
        width,
        height
      },
      filterBackend: {
        resources
      }
    } = _ref;
    const image = this.image;
    if (!resources.blendImage) {
      resources.blendImage = createCanvasElement();
    }
    const canvas1 = resources.blendImage;
    const context = canvas1.getContext('2d');
    if (canvas1.width !== width || canvas1.height !== height) {
      canvas1.width = width;
      canvas1.height = height;
    } else {
      context.clearRect(0, 0, width, height);
    }
    context.setTransform(image.scaleX, 0, 0, image.scaleY, image.left, image.top);
    context.drawImage(image.getElement(), 0, 0, width, height);
    const blendData = context.getImageData(0, 0, width, height).data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      const tr = blendData[i];
      const tg = blendData[i + 1];
      const tb = blendData[i + 2];
      const ta = blendData[i + 3];
      switch (this.mode) {
        case 'multiply':
          data[i] = r * tr / 255;
          data[i + 1] = g * tg / 255;
          data[i + 2] = b * tb / 255;
          data[i + 3] = a * ta / 255;
          break;
        case 'mask':
          data[i + 3] = ta;
          break;
      }
    }
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(gl, uniformLocations) {
    const matrix = this.calculateMatrix();
    gl.uniform1i(uniformLocations.uImage, 1); // texture unit 1.
    gl.uniformMatrix3fv(uniformLocations.uTransformMatrix, false, matrix);
  }

  /**
   * Returns object representation of an instance
   * TODO: Handle the possibility of missing image better.
   * As of now a BlendImage filter without image can't be used with fromObject
   * @return {Object} Object representation of an instance
   */
  toObject() {
    return {
      ...super.toObject(),
      image: this.image && this.image.toObject()
    };
  }

  /**
   * Create filter instance from an object representation
   * @param {object} object Object to create an instance from
   * @param {object} [options]
   * @param {AbortSignal} [options.signal] handle aborting image loading, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @returns {Promise<BlendImage>}
   */
  static async fromObject(_ref2, options) {
    let {
      type,
      image,
      ...filterOptions
    } = _ref2;
    return FabricImage.fromObject(image, options).then(enlivedImage => new this({
      ...filterOptions,
      image: enlivedImage
    }));
  }
}
/**
 * Image to make the blend operation with.
 **/
/**
 * Blend mode for the filter: either 'multiply' or 'mask'. 'multiply' will
 * multiply the values of each channel (R, G, B, and A) of the filter image by
 * their corresponding values in the base image. 'mask' will only look at the
 * alpha channel of the filter image, and apply those values to the base
 * image's alpha channel.
 * @type String
 **/
/**
 * alpha value. represent the strength of the blend image operation.
 * not implemented.
 **/
_defineProperty(BlendImage, "type", 'BlendImage');
_defineProperty(BlendImage, "defaults", blendImageDefaultValues);
_defineProperty(BlendImage, "uniformLocations", ['uTransformMatrix', 'uImage']);
classRegistry.setClass(BlendImage);

const fragmentSource$b = `
    precision highp float;
    uniform sampler2D uTexture;
    uniform vec2 uDelta;
    varying vec2 vTexCoord;
    const float nSamples = 15.0;
    vec3 v3offset = vec3(12.9898, 78.233, 151.7182);
    float random(vec3 scale) {
      /* use the fragment position for a different seed per-pixel */
      return fract(sin(dot(gl_FragCoord.xyz, scale)) * 43758.5453);
    }
    void main() {
      vec4 color = vec4(0.0);
      float totalC = 0.0;
      float totalA = 0.0;
      float offset = random(v3offset);
      for (float t = -nSamples; t <= nSamples; t++) {
        float percent = (t + offset - 0.5) / nSamples;
        vec4 sample = texture2D(uTexture, vTexCoord + uDelta * percent);
        float weight = 1.0 - abs(percent);
        float alpha = weight * sample.a;
        color.rgb += sample.rgb * alpha;
        color.a += alpha;
        totalA += weight;
        totalC += alpha;
      }
      gl_FragColor.rgb = color.rgb / totalC;
      gl_FragColor.a = color.a / totalA;
    }
  `;

const blurDefaultValues = {
  blur: 0
};

/**
 * Blur filter class
 * @example
 * const filter = new Blur({
 *   blur: 0.5
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 */
class Blur extends BaseFilter {
  getFragmentSource() {
    return fragmentSource$b;
  }
  applyTo(options) {
    if (isWebGLPipelineState(options)) {
      // this aspectRatio is used to give the same blur to vertical and horizontal
      this.aspectRatio = options.sourceWidth / options.sourceHeight;
      options.passes++;
      this._setupFrameBuffer(options);
      this.horizontal = true;
      this.applyToWebGL(options);
      this._swapTextures(options);
      this._setupFrameBuffer(options);
      this.horizontal = false;
      this.applyToWebGL(options);
      this._swapTextures(options);
    } else {
      this.applyTo2d(options);
    }
  }
  applyTo2d(_ref) {
    let {
      imageData: {
        data,
        width,
        height
      }
    } = _ref;
    // this code mimic the shader for output consistency
    // it samples 31 pixels across the image over a distance that depends from the blur value.
    this.aspectRatio = width / height;
    this.horizontal = true;
    let blurValue = this.getBlurValue() * width;
    const imageData = new Uint8ClampedArray(data);
    const samples = 15;
    const bytesInRow = 4 * width;
    for (let i = 0; i < data.length; i += 4) {
      let r = 0.0,
        g = 0.0,
        b = 0.0,
        a = 0.0,
        totalA = 0;
      const minIRow = i - i % bytesInRow;
      const maxIRow = minIRow + bytesInRow;
      // for now let's keep noise out of the way
      // let pixelOffset = 0;
      // const offset = Math.random() * 3;
      // if (offset > 2) {
      //   pixelOffset = 4;
      // } else if (offset < 1) {
      //   pixelOffset = -4;
      // }
      for (let j = -samples + 1; j < samples; j++) {
        const percent = j / samples;
        const distance = Math.floor(blurValue * percent) * 4;
        const weight = 1 - Math.abs(percent);
        let sampledPixel = i + distance; // + pixelOffset;
        // try to implement edge mirroring
        if (sampledPixel < minIRow) {
          sampledPixel = minIRow;
        } else if (sampledPixel > maxIRow) {
          sampledPixel = maxIRow;
        }
        const localAlpha = data[sampledPixel + 3] * weight;
        r += data[sampledPixel] * localAlpha;
        g += data[sampledPixel + 1] * localAlpha;
        b += data[sampledPixel + 2] * localAlpha;
        a += localAlpha;
        totalA += weight;
      }
      imageData[i] = r / a;
      imageData[i + 1] = g / a;
      imageData[i + 2] = b / a;
      imageData[i + 3] = a / totalA;
    }
    this.horizontal = false;
    blurValue = this.getBlurValue() * height;
    for (let i = 0; i < imageData.length; i += 4) {
      let r = 0.0,
        g = 0.0,
        b = 0.0,
        a = 0.0,
        totalA = 0;
      const minIRow = i % bytesInRow;
      const maxIRow = imageData.length - bytesInRow + minIRow;
      // for now let's keep noise out of the way
      // let pixelOffset = 0;
      // const offset = Math.random() * 3;
      // if (offset > 2) {
      //   pixelOffset = bytesInRow;
      // } else if (offset < 1) {
      //   pixelOffset = -bytesInRow;
      // }
      for (let j = -samples + 1; j < samples; j++) {
        const percent = j / samples;
        const distance = Math.floor(blurValue * percent) * bytesInRow;
        const weight = 1 - Math.abs(percent);
        let sampledPixel = i + distance; // + pixelOffset;
        // try to implement edge mirroring
        if (sampledPixel < minIRow) {
          sampledPixel = minIRow;
        } else if (sampledPixel > maxIRow) {
          sampledPixel = maxIRow;
        }
        const localAlpha = imageData[sampledPixel + 3] * weight;
        r += imageData[sampledPixel] * localAlpha;
        g += imageData[sampledPixel + 1] * localAlpha;
        b += imageData[sampledPixel + 2] * localAlpha;
        a += localAlpha;
        totalA += weight;
      }
      data[i] = r / a;
      data[i + 1] = g / a;
      data[i + 2] = b / a;
      data[i + 3] = a / totalA;
    }
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(gl, uniformLocations) {
    const delta = this.chooseRightDelta();
    gl.uniform2fv(uniformLocations.uDelta, delta);
  }
  isNeutralState() {
    return this.blur === 0;
  }
  getBlurValue() {
    let blurScale = 1;
    const {
      horizontal,
      aspectRatio
    } = this;
    if (horizontal) {
      if (aspectRatio > 1) {
        // image is wide, i want to shrink radius horizontal
        blurScale = 1 / aspectRatio;
      }
    } else {
      if (aspectRatio < 1) {
        // image is tall, i want to shrink radius vertical
        blurScale = aspectRatio;
      }
    }
    return blurScale * this.blur * 0.12;
  }

  /**
   * choose right value of image percentage to blur with
   * @returns {Array} a numeric array with delta values
   */
  chooseRightDelta() {
    const blur = this.getBlurValue();
    return this.horizontal ? [blur, 0] : [0, blur];
  }
}
/**
 * blur value, in percentage of image dimensions.
 * specific to keep the image blur constant at different resolutions
 * range between 0 and 1.
 * @type Number
 */
_defineProperty(Blur, "type", 'Blur');
_defineProperty(Blur, "defaults", blurDefaultValues);
_defineProperty(Blur, "uniformLocations", ['uDelta']);
classRegistry.setClass(Blur);

const fragmentSource$a = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform float uBrightness;
  varying vec2 vTexCoord;
  void main() {
    vec4 color = texture2D(uTexture, vTexCoord);
    color.rgb += uBrightness;
    gl_FragColor = color;
  }
`;

const brightnessDefaultValues = {
  brightness: 0
};

/**
 * Brightness filter class
 * @example
 * const filter = new Brightness({
 *   brightness: 0.05
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
class Brightness extends BaseFilter {
  getFragmentSource() {
    return fragmentSource$a;
  }

  /**
   * Apply the Brightness operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d(_ref) {
    let {
      imageData: {
        data
      }
    } = _ref;
    const brightness = Math.round(this.brightness * 255);
    for (let i = 0; i < data.length; i += 4) {
      data[i] += brightness;
      data[i + 1] += brightness;
      data[i + 2] += brightness;
    }
  }
  isNeutralState() {
    return this.brightness === 0;
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(gl, uniformLocations) {
    gl.uniform1f(uniformLocations.uBrightness, this.brightness);
  }
}
/**
 * Brightness value, from -1 to 1.
 * translated to -255 to 255 for 2d
 * 0.0039215686 is the part of 1 that get translated to 1 in 2d
 * @param {Number} brightness
 */
_defineProperty(Brightness, "type", 'Brightness');
_defineProperty(Brightness, "defaults", brightnessDefaultValues);
_defineProperty(Brightness, "uniformLocations", ['uBrightness']);
classRegistry.setClass(Brightness);

const fragmentSource$9 = `
  precision highp float;
  uniform sampler2D uTexture;
  varying vec2 vTexCoord;
  uniform mat4 uColorMatrix;
  uniform vec4 uConstants;
  void main() {
    vec4 color = texture2D(uTexture, vTexCoord);
    color *= uColorMatrix;
    color += uConstants;
    gl_FragColor = color;
  }`;

const colorMatrixDefaultValues = {
  matrix: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  colorsOnly: true
};

/**
   * Color Matrix filter class
   * @see {@link http://fabric5.fabricjs.com/image-filters|ImageFilters demo}
   * @see {@link http://phoboslab.org/log/2013/11/fast-image-filters-with-webgl demo}
   * @example <caption>Kodachrome filter</caption>
   * const filter = new ColorMatrix({
   *  matrix: [
       1.1285582396593525, -0.3967382283601348, -0.03992559172921793, 0, 63.72958762196502,
       -0.16404339962244616, 1.0835251566291304, -0.05498805115633132, 0, 24.732407896706203,
       -0.16786010706155763, -0.5603416277695248, 1.6014850761964943, 0, 35.62982807460946,
       0, 0, 0, 1, 0
      ]
   * });
   * object.filters.push(filter);
   * object.applyFilters();
   */
class ColorMatrix extends BaseFilter {
  getFragmentSource() {
    return fragmentSource$9;
  }

  /**
   * Apply the ColorMatrix operation to a Uint8Array representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8Array to be filtered.
   */
  applyTo2d(options) {
    const imageData = options.imageData,
      data = imageData.data,
      m = this.matrix,
      colorsOnly = this.colorsOnly;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      data[i] = r * m[0] + g * m[1] + b * m[2] + m[4] * 255;
      data[i + 1] = r * m[5] + g * m[6] + b * m[7] + m[9] * 255;
      data[i + 2] = r * m[10] + g * m[11] + b * m[12] + m[14] * 255;
      if (!colorsOnly) {
        const a = data[i + 3];
        data[i] += a * m[3];
        data[i + 1] += a * m[8];
        data[i + 2] += a * m[13];
        data[i + 3] = r * m[15] + g * m[16] + b * m[17] + a * m[18] + m[19] * 255;
      }
    }
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(gl, uniformLocations) {
    const m = this.matrix,
      matrix = [m[0], m[1], m[2], m[3], m[5], m[6], m[7], m[8], m[10], m[11], m[12], m[13], m[15], m[16], m[17], m[18]],
      constants = [m[4], m[9], m[14], m[19]];
    gl.uniformMatrix4fv(uniformLocations.uColorMatrix, false, matrix);
    gl.uniform4fv(uniformLocations.uConstants, constants);
  }
  toObject() {
    return {
      ...super.toObject(),
      matrix: [...this.matrix]
    };
  }
}
/**
 * Colormatrix for pixels.
 * array of 20 floats. Numbers in positions 4, 9, 14, 19 loose meaning
 * outside the -1, 1 range.
 * 0.0039215686 is the part of 1 that get translated to 1 in 2d
 * @param {Array} matrix array of 20 numbers.
 */
/**
 * Lock the colormatrix on the color part, skipping alpha, mainly for non webgl scenario
 * to save some calculation
 * @type Boolean
 * @default true
 */
_defineProperty(ColorMatrix, "type", 'ColorMatrix');
_defineProperty(ColorMatrix, "defaults", colorMatrixDefaultValues);
_defineProperty(ColorMatrix, "uniformLocations", ['uColorMatrix', 'uConstants']);
classRegistry.setClass(ColorMatrix);

function createColorMatrixFilter(key, matrix) {
  var _Class;
  const newClass = (_Class = class newClass extends ColorMatrix {
    toObject() {
      return {
        type: this.type,
        colorsOnly: this.colorsOnly
      };
    }
  }, _defineProperty(_Class, "type", key), _defineProperty(_Class, "defaults", {
    colorsOnly: false,
    matrix
  }), _Class);
  classRegistry.setClass(newClass, key);
  return newClass;
}
const Brownie = createColorMatrixFilter('Brownie', [0.5997, 0.34553, -0.27082, 0, 0.186, -0.0377, 0.86095, 0.15059, 0, -0.1449, 0.24113, -0.07441, 0.44972, 0, -0.02965, 0, 0, 0, 1, 0]);
const Vintage = createColorMatrixFilter('Vintage', [0.62793, 0.32021, -0.03965, 0, 0.03784, 0.02578, 0.64411, 0.03259, 0, 0.02926, 0.0466, -0.08512, 0.52416, 0, 0.02023, 0, 0, 0, 1, 0]);
const Kodachrome = createColorMatrixFilter('Kodachrome', [1.12855, -0.39673, -0.03992, 0, 0.24991, -0.16404, 1.08352, -0.05498, 0, 0.09698, -0.16786, -0.56034, 1.60148, 0, 0.13972, 0, 0, 0, 1, 0]);
const Technicolor = createColorMatrixFilter('Technicolor', [1.91252, -0.85453, -0.09155, 0, 0.04624, -0.30878, 1.76589, -0.10601, 0, -0.27589, -0.2311, -0.75018, 1.84759, 0, 0.12137, 0, 0, 0, 1, 0]);
const Polaroid = createColorMatrixFilter('Polaroid', [1.438, -0.062, -0.062, 0, 0, -0.122, 1.378, -0.122, 0, 0, -0.016, -0.016, 1.483, 0, 0, 0, 0, 0, 1, 0]);
const Sepia = createColorMatrixFilter('Sepia', [0.393, 0.769, 0.189, 0, 0, 0.349, 0.686, 0.168, 0, 0, 0.272, 0.534, 0.131, 0, 0, 0, 0, 0, 1, 0]);
const BlackWhite = createColorMatrixFilter('BlackWhite', [1.5, 1.5, 1.5, 0, -1, 1.5, 1.5, 1.5, 0, -1, 1.5, 1.5, 1.5, 0, -1, 0, 0, 0, 1, 0]);

/**
 * A container class that knows how to apply a sequence of filters to an input image.
 */
class Composed extends BaseFilter {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    super(options);
    this.subFilters = options.subFilters || [];
  }

  /**
   * Apply this container's filters to the input image provided.
   *
   * @param {Object} options
   * @param {Number} options.passes The number of filters remaining to be applied.
   */
  applyTo(options) {
    if (isWebGLPipelineState(options)) {
      options.passes += this.subFilters.length - 1;
    }
    this.subFilters.forEach(filter => {
      filter.applyTo(options);
    });
  }

  /**
   * Serialize this filter into JSON.
   * @returns {Object} A JSON representation of this filter.
   */
  toObject() {
    return {
      type: this.type,
      subFilters: this.subFilters.map(filter => filter.toObject())
    };
  }
  isNeutralState() {
    return !this.subFilters.some(filter => !filter.isNeutralState());
  }

  /**
   * Deserialize a JSON definition of a ComposedFilter into a concrete instance.
   * @param {oject} object Object to create an instance from
   * @param {object} [options]
   * @param {AbortSignal} [options.signal] handle aborting `BlendImage` filter loading, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @returns {Promise<Composed>}
   */
  static fromObject(object, options) {
    return Promise.all((object.subFilters || []).map(filter => classRegistry.getClass(filter.type).fromObject(filter, options))).then(enlivedFilters => new this({
      subFilters: enlivedFilters
    }));
  }
}
/**
 * A non sparse array of filters to apply
 */
_defineProperty(Composed, "type", 'Composed');
classRegistry.setClass(Composed);

const fragmentSource$8 = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform float uContrast;
  varying vec2 vTexCoord;
  void main() {
    vec4 color = texture2D(uTexture, vTexCoord);
    float contrastF = 1.015 * (uContrast + 1.0) / (1.0 * (1.015 - uContrast));
    color.rgb = contrastF * (color.rgb - 0.5) + 0.5;
    gl_FragColor = color;
  }`;

const contrastDefaultValues = {
  contrast: 0
};

/**
 * Contrast filter class
 * @example
 * const filter = new Contrast({
 *   contrast: 0.25
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
class Contrast extends BaseFilter {
  getFragmentSource() {
    return fragmentSource$8;
  }
  isNeutralState() {
    return this.contrast === 0;
  }

  /**
   * Apply the Contrast operation to a Uint8Array representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8Array to be filtered.
   */
  applyTo2d(_ref) {
    let {
      imageData: {
        data
      }
    } = _ref;
    const contrast = Math.floor(this.contrast * 255),
      contrastF = 259 * (contrast + 255) / (255 * (259 - contrast));
    for (let i = 0; i < data.length; i += 4) {
      data[i] = contrastF * (data[i] - 128) + 128;
      data[i + 1] = contrastF * (data[i + 1] - 128) + 128;
      data[i + 2] = contrastF * (data[i + 2] - 128) + 128;
    }
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(gl, uniformLocations) {
    gl.uniform1f(uniformLocations.uContrast, this.contrast);
  }
}
/**
 * contrast value, range from -1 to 1.
 * @param {Number} contrast
 * @default 0
 */
_defineProperty(Contrast, "type", 'Contrast');
_defineProperty(Contrast, "defaults", contrastDefaultValues);
_defineProperty(Contrast, "uniformLocations", ['uContrast']);
classRegistry.setClass(Contrast);

const fragmentSource$7 = {
  Convolute_3_1: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform float uMatrix[9];
    uniform float uStepW;
    uniform float uStepH;
    varying vec2 vTexCoord;
    void main() {
      vec4 color = vec4(0, 0, 0, 0);
      for (float h = 0.0; h < 3.0; h+=1.0) {
        for (float w = 0.0; w < 3.0; w+=1.0) {
          vec2 matrixPos = vec2(uStepW * (w - 1), uStepH * (h - 1));
          color += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 3.0 + w)];
        }
      }
      gl_FragColor = color;
    }
    `,
  Convolute_3_0: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform float uMatrix[9];
    uniform float uStepW;
    uniform float uStepH;
    varying vec2 vTexCoord;
    void main() {
      vec4 color = vec4(0, 0, 0, 1);
      for (float h = 0.0; h < 3.0; h+=1.0) {
        for (float w = 0.0; w < 3.0; w+=1.0) {
          vec2 matrixPos = vec2(uStepW * (w - 1.0), uStepH * (h - 1.0));
          color.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 3.0 + w)];
        }
      }
      float alpha = texture2D(uTexture, vTexCoord).a;
      gl_FragColor = color;
      gl_FragColor.a = alpha;
    }
    `,
  Convolute_5_1: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform float uMatrix[25];
    uniform float uStepW;
    uniform float uStepH;
    varying vec2 vTexCoord;
    void main() {
      vec4 color = vec4(0, 0, 0, 0);
      for (float h = 0.0; h < 5.0; h+=1.0) {
        for (float w = 0.0; w < 5.0; w+=1.0) {
          vec2 matrixPos = vec2(uStepW * (w - 2.0), uStepH * (h - 2.0));
          color += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 5.0 + w)];
        }
      }
      gl_FragColor = color;
    }
    `,
  Convolute_5_0: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform float uMatrix[25];
    uniform float uStepW;
    uniform float uStepH;
    varying vec2 vTexCoord;
    void main() {
      vec4 color = vec4(0, 0, 0, 1);
      for (float h = 0.0; h < 5.0; h+=1.0) {
        for (float w = 0.0; w < 5.0; w+=1.0) {
          vec2 matrixPos = vec2(uStepW * (w - 2.0), uStepH * (h - 2.0));
          color.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 5.0 + w)];
        }
      }
      float alpha = texture2D(uTexture, vTexCoord).a;
      gl_FragColor = color;
      gl_FragColor.a = alpha;
    }
    `,
  Convolute_7_1: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform float uMatrix[49];
    uniform float uStepW;
    uniform float uStepH;
    varying vec2 vTexCoord;
    void main() {
      vec4 color = vec4(0, 0, 0, 0);
      for (float h = 0.0; h < 7.0; h+=1.0) {
        for (float w = 0.0; w < 7.0; w+=1.0) {
          vec2 matrixPos = vec2(uStepW * (w - 3.0), uStepH * (h - 3.0));
          color += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 7.0 + w)];
        }
      }
      gl_FragColor = color;
    }
    `,
  Convolute_7_0: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform float uMatrix[49];
    uniform float uStepW;
    uniform float uStepH;
    varying vec2 vTexCoord;
    void main() {
      vec4 color = vec4(0, 0, 0, 1);
      for (float h = 0.0; h < 7.0; h+=1.0) {
        for (float w = 0.0; w < 7.0; w+=1.0) {
          vec2 matrixPos = vec2(uStepW * (w - 3.0), uStepH * (h - 3.0));
          color.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 7.0 + w)];
        }
      }
      float alpha = texture2D(uTexture, vTexCoord).a;
      gl_FragColor = color;
      gl_FragColor.a = alpha;
    }
    `,
  Convolute_9_1: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform float uMatrix[81];
    uniform float uStepW;
    uniform float uStepH;
    varying vec2 vTexCoord;
    void main() {
      vec4 color = vec4(0, 0, 0, 0);
      for (float h = 0.0; h < 9.0; h+=1.0) {
        for (float w = 0.0; w < 9.0; w+=1.0) {
          vec2 matrixPos = vec2(uStepW * (w - 4.0), uStepH * (h - 4.0));
          color += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 9.0 + w)];
        }
      }
      gl_FragColor = color;
    }
    `,
  Convolute_9_0: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform float uMatrix[81];
    uniform float uStepW;
    uniform float uStepH;
    varying vec2 vTexCoord;
    void main() {
      vec4 color = vec4(0, 0, 0, 1);
      for (float h = 0.0; h < 9.0; h+=1.0) {
        for (float w = 0.0; w < 9.0; w+=1.0) {
          vec2 matrixPos = vec2(uStepW * (w - 4.0), uStepH * (h - 4.0));
          color.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 9.0 + w)];
        }
      }
      float alpha = texture2D(uTexture, vTexCoord).a;
      gl_FragColor = color;
      gl_FragColor.a = alpha;
    }
    `
};

const convoluteDefaultValues = {
  opaque: false,
  matrix: [0, 0, 0, 0, 1, 0, 0, 0, 0]
};

/**
 * Adapted from <a href="http://www.html5rocks.com/en/tutorials/canvas/imagefilters/">html5rocks article</a>
 * @example <caption>Sharpen filter</caption>
 * const filter = new Convolute({
 *   matrix: [ 0, -1,  0,
 *            -1,  5, -1,
 *             0, -1,  0 ]
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 * @example <caption>Blur filter</caption>
 * const filter = new Convolute({
 *   matrix: [ 1/9, 1/9, 1/9,
 *             1/9, 1/9, 1/9,
 *             1/9, 1/9, 1/9 ]
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 * @example <caption>Emboss filter</caption>
 * const filter = new Convolute({
 *   matrix: [ 1,   1,  1,
 *             1, 0.7, -1,
 *            -1,  -1, -1 ]
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 * @example <caption>Emboss filter with opaqueness</caption>
 * const filter = new Convolute({
 *   opaque: true,
 *   matrix: [ 1,   1,  1,
 *             1, 0.7, -1,
 *            -1,  -1, -1 ]
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 */
class Convolute extends BaseFilter {
  getCacheKey() {
    return `${this.type}_${Math.sqrt(this.matrix.length)}_${this.opaque ? 1 : 0}`;
  }
  getFragmentSource() {
    return fragmentSource$7[this.getCacheKey()];
  }

  /**
   * Apply the Brightness operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d(options) {
    const imageData = options.imageData,
      data = imageData.data,
      weights = this.matrix,
      side = Math.round(Math.sqrt(weights.length)),
      halfSide = Math.floor(side / 2),
      sw = imageData.width,
      sh = imageData.height,
      output = options.ctx.createImageData(sw, sh),
      dst = output.data,
      // go through the destination image pixels
      alphaFac = this.opaque ? 1 : 0;
    let r, g, b, a, dstOff, scx, scy, srcOff, wt, x, y, cx, cy;
    for (y = 0; y < sh; y++) {
      for (x = 0; x < sw; x++) {
        dstOff = (y * sw + x) * 4;
        // calculate the weighed sum of the source image pixels that
        // fall under the convolution matrix
        r = 0;
        g = 0;
        b = 0;
        a = 0;
        for (cy = 0; cy < side; cy++) {
          for (cx = 0; cx < side; cx++) {
            scy = y + cy - halfSide;
            scx = x + cx - halfSide;

            // eslint-disable-next-line max-depth
            if (scy < 0 || scy >= sh || scx < 0 || scx >= sw) {
              continue;
            }
            srcOff = (scy * sw + scx) * 4;
            wt = weights[cy * side + cx];
            r += data[srcOff] * wt;
            g += data[srcOff + 1] * wt;
            b += data[srcOff + 2] * wt;
            // eslint-disable-next-line max-depth
            if (!alphaFac) {
              a += data[srcOff + 3] * wt;
            }
          }
        }
        dst[dstOff] = r;
        dst[dstOff + 1] = g;
        dst[dstOff + 2] = b;
        if (!alphaFac) {
          dst[dstOff + 3] = a;
        } else {
          dst[dstOff + 3] = data[dstOff + 3];
        }
      }
    }
    options.imageData = output;
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(gl, uniformLocations) {
    gl.uniform1fv(uniformLocations.uMatrix, this.matrix);
  }

  /**
   * Returns object representation of an instance
   * @return {Object} Object representation of an instance
   */
  toObject() {
    return {
      ...super.toObject(),
      opaque: this.opaque,
      matrix: [...this.matrix]
    };
  }
}
/*
 * Opaque value (true/false)
 */
/*
 * matrix for the filter, max 9x9
 */
_defineProperty(Convolute, "type", 'Convolute');
_defineProperty(Convolute, "defaults", convoluteDefaultValues);
_defineProperty(Convolute, "uniformLocations", ['uMatrix', 'uOpaque', 'uHalfSize', 'uSize']);
classRegistry.setClass(Convolute);

const fragmentSource$6 = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform vec3 uGamma;
  varying vec2 vTexCoord;
  void main() {
    vec4 color = texture2D(uTexture, vTexCoord);
    vec3 correction = (1.0 / uGamma);
    color.r = pow(color.r, correction.r);
    color.g = pow(color.g, correction.g);
    color.b = pow(color.b, correction.b);
    gl_FragColor = color;
    gl_FragColor.rgb *= color.a;
  }
`;

const GAMMA = 'Gamma';
const gammaDefaultValues = {
  gamma: [1, 1, 1]
};

/**
 * Gamma filter class
 * @example
 * const filter = new Gamma({
 *   gamma: [1, 0.5, 2.1]
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
class Gamma extends BaseFilter {
  getFragmentSource() {
    return fragmentSource$6;
  }
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    super(options);
    this.gamma = options.gamma || this.constructor.defaults.gamma.concat();
  }

  /**
   * Apply the Gamma operation to a Uint8Array representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8Array to be filtered.
   */
  applyTo2d(_ref) {
    let {
      imageData: {
        data
      }
    } = _ref;
    const gamma = this.gamma,
      rInv = 1 / gamma[0],
      gInv = 1 / gamma[1],
      bInv = 1 / gamma[2];
    if (!this.rgbValues) {
      this.rgbValues = {
        r: new Uint8Array(256),
        g: new Uint8Array(256),
        b: new Uint8Array(256)
      };
    }

    // This is an optimization - pre-compute a look-up table for each color channel
    // instead of performing these pow calls for each pixel in the image.
    const rgb = this.rgbValues;
    for (let i = 0; i < 256; i++) {
      rgb.r[i] = Math.pow(i / 255, rInv) * 255;
      rgb.g[i] = Math.pow(i / 255, gInv) * 255;
      rgb.b[i] = Math.pow(i / 255, bInv) * 255;
    }
    for (let i = 0; i < data.length; i += 4) {
      data[i] = rgb.r[data[i]];
      data[i + 1] = rgb.g[data[i + 1]];
      data[i + 2] = rgb.b[data[i + 2]];
    }
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(gl, uniformLocations) {
    gl.uniform3fv(uniformLocations.uGamma, this.gamma);
  }
  isNeutralState() {
    const {
      gamma
    } = this;
    return gamma[0] === 1 && gamma[1] === 1 && gamma[2] === 1;
  }
  toObject() {
    return {
      type: GAMMA,
      gamma: this.gamma.concat()
    };
  }
}
/**
 * Gamma array value, from 0.01 to 2.2.
 * @param {Array} gamma
 */
_defineProperty(Gamma, "type", GAMMA);
_defineProperty(Gamma, "defaults", gammaDefaultValues);
_defineProperty(Gamma, "uniformLocations", ['uGamma']);
classRegistry.setClass(Gamma);

const fragmentSource$5 = {
  average: `
    precision highp float;
    uniform sampler2D uTexture;
    varying vec2 vTexCoord;
    void main() {
      vec4 color = texture2D(uTexture, vTexCoord);
      float average = (color.r + color.b + color.g) / 3.0;
      gl_FragColor = vec4(average, average, average, color.a);
    }
    `,
  lightness: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform int uMode;
    varying vec2 vTexCoord;
    void main() {
      vec4 col = texture2D(uTexture, vTexCoord);
      float average = (max(max(col.r, col.g),col.b) + min(min(col.r, col.g),col.b)) / 2.0;
      gl_FragColor = vec4(average, average, average, col.a);
    }
    `,
  luminosity: `
    precision highp float;
    uniform sampler2D uTexture;
    uniform int uMode;
    varying vec2 vTexCoord;
    void main() {
      vec4 col = texture2D(uTexture, vTexCoord);
      float average = 0.21 * col.r + 0.72 * col.g + 0.07 * col.b;
      gl_FragColor = vec4(average, average, average, col.a);
    }
    `
};

const grayscaleDefaultValues = {
  mode: 'average'
};

/**
 * Grayscale image filter class
 * @example
 * const filter = new Grayscale();
 * object.filters.push(filter);
 * object.applyFilters();
 */
class Grayscale extends BaseFilter {
  /**
   * Apply the Grayscale operation to a Uint8Array representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8Array to be filtered.
   */
  applyTo2d(_ref) {
    let {
      imageData: {
        data
      }
    } = _ref;
    for (let i = 0, value; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      switch (this.mode) {
        case 'average':
          value = (r + g + b) / 3;
          break;
        case 'lightness':
          value = (Math.min(r, g, b) + Math.max(r, g, b)) / 2;
          break;
        case 'luminosity':
          value = 0.21 * r + 0.72 * g + 0.07 * b;
          break;
      }
      data[i + 2] = data[i + 1] = data[i] = value;
    }
  }
  getCacheKey() {
    return `${this.type}_${this.mode}`;
  }
  getFragmentSource() {
    return fragmentSource$5[this.mode];
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(gl, uniformLocations) {
    const mode = 1;
    gl.uniform1i(uniformLocations.uMode, mode);
  }

  /**
   * Grayscale filter isNeutralState implementation
   * The filter is never neutral
   * on the image
   **/
  isNeutralState() {
    return false;
  }
}
_defineProperty(Grayscale, "type", 'Grayscale');
_defineProperty(Grayscale, "defaults", grayscaleDefaultValues);
_defineProperty(Grayscale, "uniformLocations", ['uMode']);
classRegistry.setClass(Grayscale);

const hueRotationDefaultValues = {
  ...colorMatrixDefaultValues,
  rotation: 0
};

/**
 * HueRotation filter class
 * @example
 * const filter = new HueRotation({
 *   rotation: -0.5
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
class HueRotation extends ColorMatrix {
  calculateMatrix() {
    const rad = this.rotation * Math.PI,
      cosine = cos(rad),
      sine = sin(rad),
      aThird = 1 / 3,
      aThirdSqtSin = Math.sqrt(aThird) * sine,
      OneMinusCos = 1 - cosine;
    this.matrix = [cosine + OneMinusCos / 3, aThird * OneMinusCos - aThirdSqtSin, aThird * OneMinusCos + aThirdSqtSin, 0, 0, aThird * OneMinusCos + aThirdSqtSin, cosine + aThird * OneMinusCos, aThird * OneMinusCos - aThirdSqtSin, 0, 0, aThird * OneMinusCos - aThirdSqtSin, aThird * OneMinusCos + aThirdSqtSin, cosine + aThird * OneMinusCos, 0, 0, 0, 0, 0, 1, 0];
  }
  isNeutralState() {
    return this.rotation === 0;
  }
  applyTo(options) {
    this.calculateMatrix();
    super.applyTo(options);
  }
  toObject() {
    return {
      type: this.type,
      rotation: this.rotation
    };
  }
}
/**
 * HueRotation value, from -1 to 1.
 */
_defineProperty(HueRotation, "type", 'HueRotation');
_defineProperty(HueRotation, "defaults", hueRotationDefaultValues);
classRegistry.setClass(HueRotation);

const fragmentSource$4 = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform int uInvert;
  uniform int uAlpha;
  varying vec2 vTexCoord;
  void main() {
    vec4 color = texture2D(uTexture, vTexCoord);
    if (uInvert == 1) {
      if (uAlpha == 1) {
        gl_FragColor = vec4(1.0 - color.r,1.0 -color.g,1.0 -color.b,1.0 -color.a);
      } else {
        gl_FragColor = vec4(1.0 - color.r,1.0 -color.g,1.0 -color.b,color.a);
      }
    } else {
      gl_FragColor = color;
    }
  }
`;

const invertDefaultValues = {
  alpha: false,
  invert: true
};

/**
 * @example
 * const filter = new Invert();
 * object.filters.push(filter);
 * object.applyFilters(canvas.renderAll.bind(canvas));
 */
class Invert extends BaseFilter {
  /**
   * Apply the Invert operation to a Uint8Array representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8Array to be filtered.
   */
  applyTo2d(_ref) {
    let {
      imageData: {
        data
      }
    } = _ref;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
      if (this.alpha) {
        data[i + 3] = 255 - data[i + 3];
      }
    }
  }
  getFragmentSource() {
    return fragmentSource$4;
  }

  /**
   * Invert filter isNeutralState implementation
   * Used only in image applyFilters to discard filters that will not have an effect
   * on the image
   * @param {Object} options
   **/
  isNeutralState() {
    return !this.invert;
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(gl, uniformLocations) {
    gl.uniform1i(uniformLocations.uInvert, Number(this.invert));
    gl.uniform1i(uniformLocations.uAlpha, Number(this.alpha));
  }
}
/**
 * Invert also alpha.
 * @param {Boolean} alpha
 **/
/**
 * Filter invert. if false, does nothing
 * @param {Boolean} invert
 */
_defineProperty(Invert, "type", 'Invert');
_defineProperty(Invert, "defaults", invertDefaultValues);
_defineProperty(Invert, "uniformLocations", ['uInvert', 'uAlpha']);
classRegistry.setClass(Invert);

const fragmentSource$3 = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform float uStepH;
  uniform float uNoise;
  uniform float uSeed;
  varying vec2 vTexCoord;
  float rand(vec2 co, float seed, float vScale) {
    return fract(sin(dot(co.xy * vScale ,vec2(12.9898 , 78.233))) * 43758.5453 * (seed + 0.01) / 2.0);
  }
  void main() {
    vec4 color = texture2D(uTexture, vTexCoord);
    color.rgb += (0.5 - rand(vTexCoord, uSeed, 0.1 / uStepH)) * uNoise;
    gl_FragColor = color;
  }
`;

const noiseDefaultValues = {
  noise: 0
};

/**
 * Noise filter class
 * @example
 * const filter = new Noise({
 *   noise: 700
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 */
class Noise extends BaseFilter {
  getFragmentSource() {
    return fragmentSource$3;
  }

  /**
   * Apply the Brightness operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d(_ref) {
    let {
      imageData: {
        data
      }
    } = _ref;
    const noise = this.noise;
    for (let i = 0; i < data.length; i += 4) {
      const rand = (0.5 - Math.random()) * noise;
      data[i] += rand;
      data[i + 1] += rand;
      data[i + 2] += rand;
    }
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(gl, uniformLocations) {
    gl.uniform1f(uniformLocations.uNoise, this.noise / 255);
    gl.uniform1f(uniformLocations.uSeed, Math.random());
  }
  isNeutralState() {
    return this.noise === 0;
  }
}
/**
 * Noise value, from
 * @param {Number} noise
 */
_defineProperty(Noise, "type", 'Noise');
_defineProperty(Noise, "defaults", noiseDefaultValues);
_defineProperty(Noise, "uniformLocations", ['uNoise', 'uSeed']);
classRegistry.setClass(Noise);

const fragmentSource$2 = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform float uBlocksize;
  uniform float uStepW;
  uniform float uStepH;
  varying vec2 vTexCoord;
  void main() {
    float blockW = uBlocksize * uStepW;
    float blockH = uBlocksize * uStepH;
    int posX = int(vTexCoord.x / blockW);
    int posY = int(vTexCoord.y / blockH);
    float fposX = float(posX);
    float fposY = float(posY);
    vec2 squareCoords = vec2(fposX * blockW, fposY * blockH);
    vec4 color = texture2D(uTexture, squareCoords);
    gl_FragColor = color;
  }
`;

const pixelateDefaultValues = {
  blocksize: 4
};

/**
 * Pixelate filter class
 * @example
 * const filter = new Pixelate({
 *   blocksize: 8
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
class Pixelate extends BaseFilter {
  /**
   * Apply the Pixelate operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d(_ref) {
    let {
      imageData: {
        data,
        width,
        height
      }
    } = _ref;
    for (let i = 0; i < height; i += this.blocksize) {
      for (let j = 0; j < width; j += this.blocksize) {
        const index = i * 4 * width + j * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const a = data[index + 3];
        for (let _i = i; _i < Math.min(i + this.blocksize, height); _i++) {
          for (let _j = j; _j < Math.min(j + this.blocksize, width); _j++) {
            const index = _i * 4 * width + _j * 4;
            data[index] = r;
            data[index + 1] = g;
            data[index + 2] = b;
            data[index + 3] = a;
          }
        }
      }
    }
  }

  /**
   * Indicate when the filter is not gonna apply changes to the image
   **/
  isNeutralState() {
    return this.blocksize === 1;
  }
  getFragmentSource() {
    return fragmentSource$2;
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(gl, uniformLocations) {
    gl.uniform1f(uniformLocations.uBlocksize, this.blocksize);
  }
}
_defineProperty(Pixelate, "type", 'Pixelate');
_defineProperty(Pixelate, "defaults", pixelateDefaultValues);
_defineProperty(Pixelate, "uniformLocations", ['uBlocksize']);
classRegistry.setClass(Pixelate);

const fragmentShader = `
precision highp float;
uniform sampler2D uTexture;
uniform vec4 uLow;
uniform vec4 uHigh;
varying vec2 vTexCoord;
void main() {
  gl_FragColor = texture2D(uTexture, vTexCoord);
  if(all(greaterThan(gl_FragColor.rgb,uLow.rgb)) && all(greaterThan(uHigh.rgb,gl_FragColor.rgb))) {
    gl_FragColor.a = 0.0;
  }
}
`;

const removeColorDefaultValues = {
  color: '#FFFFFF',
  distance: 0.02,
  useAlpha: false
};

/**
 * Remove white filter class
 * @example
 * const filter = new RemoveColor({
 *   threshold: 0.2,
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 * canvas.renderAll();
 */
class RemoveColor extends BaseFilter {
  getFragmentSource() {
    return fragmentShader;
  }

  /**
   * Applies filter to canvas element
   * @param {Object} canvasEl Canvas element to apply filter to
   */
  applyTo2d(_ref) {
    let {
      imageData: {
        data
      }
    } = _ref;
    const distance = this.distance * 255,
      source = new Color(this.color).getSource(),
      lowC = [source[0] - distance, source[1] - distance, source[2] - distance],
      highC = [source[0] + distance, source[1] + distance, source[2] + distance];
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (r > lowC[0] && g > lowC[1] && b > lowC[2] && r < highC[0] && g < highC[1] && b < highC[2]) {
        data[i + 3] = 0;
      }
    }
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(gl, uniformLocations) {
    const source = new Color(this.color).getSource(),
      distance = this.distance,
      lowC = [0 + source[0] / 255 - distance, 0 + source[1] / 255 - distance, 0 + source[2] / 255 - distance, 1],
      highC = [source[0] / 255 + distance, source[1] / 255 + distance, source[2] / 255 + distance, 1];
    gl.uniform4fv(uniformLocations.uLow, lowC);
    gl.uniform4fv(uniformLocations.uHigh, highC);
  }
}
/**
 * Color to remove, in any format understood by {@link Color}.
 */
/**
 * distance to actual color, as value up or down from each r,g,b
 * between 0 and 1
 **/
/**
 * For color to remove inside distance, use alpha channel for a smoother deletion
 * NOT IMPLEMENTED YET
 **/
_defineProperty(RemoveColor, "type", 'RemoveColor');
_defineProperty(RemoveColor, "defaults", removeColorDefaultValues);
_defineProperty(RemoveColor, "uniformLocations", ['uLow', 'uHigh']);
classRegistry.setClass(RemoveColor);

const resizeDefaultValues = {
  resizeType: 'hermite',
  scaleX: 1,
  scaleY: 1,
  lanczosLobes: 3
};
/**
 * Resize image filter class
 * @example
 * const filter = new Resize();
 * object.filters.push(filter);
 * object.applyFilters(canvas.renderAll.bind(canvas));
 */
class Resize extends BaseFilter {
  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(gl, uniformLocations) {
    gl.uniform2fv(uniformLocations.uDelta, this.horizontal ? [1 / this.width, 0] : [0, 1 / this.height]);
    gl.uniform1fv(uniformLocations.uTaps, this.taps);
  }
  getFilterWindow() {
    const scale = this.tempScale;
    return Math.ceil(this.lanczosLobes / scale);
  }
  getCacheKey() {
    const filterWindow = this.getFilterWindow();
    return `${this.type}_${filterWindow}`;
  }
  getFragmentSource() {
    const filterWindow = this.getFilterWindow();
    return this.generateShader(filterWindow);
  }
  getTaps() {
    const lobeFunction = this.lanczosCreate(this.lanczosLobes),
      scale = this.tempScale,
      filterWindow = this.getFilterWindow(),
      taps = new Array(filterWindow);
    for (let i = 1; i <= filterWindow; i++) {
      taps[i - 1] = lobeFunction(i * scale);
    }
    return taps;
  }

  /**
   * Generate vertex and shader sources from the necessary steps numbers
   * @param {Number} filterWindow
   */
  generateShader(filterWindow) {
    const offsets = new Array(filterWindow);
    for (let i = 1; i <= filterWindow; i++) {
      offsets[i - 1] = `${i}.0 * uDelta`;
    }
    return `
      precision highp float;
      uniform sampler2D uTexture;
      uniform vec2 uDelta;
      varying vec2 vTexCoord;
      uniform float uTaps[${filterWindow}];
      void main() {
        vec4 color = texture2D(uTexture, vTexCoord);
        float sum = 1.0;
        ${offsets.map((offset, i) => `
              color += texture2D(uTexture, vTexCoord + ${offset}) * uTaps[${i}] + texture2D(uTexture, vTexCoord - ${offset}) * uTaps[${i}];
              sum += 2.0 * uTaps[${i}];
            `).join('\n')}
        gl_FragColor = color / sum;
      }
    `;
  }
  applyToForWebgl(options) {
    options.passes++;
    this.width = options.sourceWidth;
    this.horizontal = true;
    this.dW = Math.round(this.width * this.scaleX);
    this.dH = options.sourceHeight;
    this.tempScale = this.dW / this.width;
    this.taps = this.getTaps();
    options.destinationWidth = this.dW;
    super.applyTo(options);
    options.sourceWidth = options.destinationWidth;
    this.height = options.sourceHeight;
    this.horizontal = false;
    this.dH = Math.round(this.height * this.scaleY);
    this.tempScale = this.dH / this.height;
    this.taps = this.getTaps();
    options.destinationHeight = this.dH;
    super.applyTo(options);
    options.sourceHeight = options.destinationHeight;
  }

  /**
   * Apply the resize filter to the image
   * Determines whether to use WebGL or Canvas2D based on the options.webgl flag.
   *
   * @param {Object} options
   * @param {Number} options.passes The number of filters remaining to be executed
   * @param {Boolean} options.webgl Whether to use webgl to render the filter.
   * @param {WebGLTexture} options.sourceTexture The texture setup as the source to be filtered.
   * @param {WebGLTexture} options.targetTexture The texture where filtered output should be drawn.
   * @param {WebGLRenderingContext} options.context The GL context used for rendering.
   * @param {Object} options.programCache A map of compiled shader programs, keyed by filter type.
   */
  applyTo(options) {
    if (isWebGLPipelineState(options)) {
      this.applyToForWebgl(options);
    } else {
      this.applyTo2d(options);
    }
  }
  isNeutralState() {
    return this.scaleX === 1 && this.scaleY === 1;
  }
  lanczosCreate(lobes) {
    return x => {
      if (x >= lobes || x <= -lobes) {
        return 0.0;
      }
      if (x < 1.1920929e-7 && x > -1.1920929e-7) {
        return 1.0;
      }
      x *= Math.PI;
      const xx = x / lobes;
      return Math.sin(x) / x * Math.sin(xx) / xx;
    };
  }
  applyTo2d(options) {
    const imageData = options.imageData,
      scaleX = this.scaleX,
      scaleY = this.scaleY;
    this.rcpScaleX = 1 / scaleX;
    this.rcpScaleY = 1 / scaleY;
    const oW = imageData.width;
    const oH = imageData.height;
    const dW = Math.round(oW * scaleX);
    const dH = Math.round(oH * scaleY);
    let newData;
    if (this.resizeType === 'sliceHack') {
      newData = this.sliceByTwo(options, oW, oH, dW, dH);
    } else if (this.resizeType === 'hermite') {
      newData = this.hermiteFastResize(options, oW, oH, dW, dH);
    } else if (this.resizeType === 'bilinear') {
      newData = this.bilinearFiltering(options, oW, oH, dW, dH);
    } else if (this.resizeType === 'lanczos') {
      newData = this.lanczosResize(options, oW, oH, dW, dH);
    } else {
      // this should never trigger, is here just for safety net.
      newData = new ImageData(dW, dH);
    }
    options.imageData = newData;
  }

  /**
   * Filter sliceByTwo
   * @param {Object} canvasEl Canvas element to apply filter to
   * @param {Number} oW Original Width
   * @param {Number} oH Original Height
   * @param {Number} dW Destination Width
   * @param {Number} dH Destination Height
   * @returns {ImageData}
   */
  sliceByTwo(options, oW, oH, dW, dH) {
    const imageData = options.imageData;
    const mult = 0.5;
    let doneW = false;
    let doneH = false;
    let stepW = oW * mult;
    let stepH = oH * mult;
    const resources = options.filterBackend.resources;
    let sX = 0;
    let sY = 0;
    const dX = oW;
    let dY = 0;
    if (!resources.sliceByTwo) {
      resources.sliceByTwo = createCanvasElement();
    }
    const tmpCanvas = resources.sliceByTwo;
    if (tmpCanvas.width < oW * 1.5 || tmpCanvas.height < oH) {
      tmpCanvas.width = oW * 1.5;
      tmpCanvas.height = oH;
    }
    const ctx = tmpCanvas.getContext('2d');
    ctx.clearRect(0, 0, oW * 1.5, oH);
    ctx.putImageData(imageData, 0, 0);
    dW = Math.floor(dW);
    dH = Math.floor(dH);
    while (!doneW || !doneH) {
      oW = stepW;
      oH = stepH;
      if (dW < Math.floor(stepW * mult)) {
        stepW = Math.floor(stepW * mult);
      } else {
        stepW = dW;
        doneW = true;
      }
      if (dH < Math.floor(stepH * mult)) {
        stepH = Math.floor(stepH * mult);
      } else {
        stepH = dH;
        doneH = true;
      }
      ctx.drawImage(tmpCanvas, sX, sY, oW, oH, dX, dY, stepW, stepH);
      sX = dX;
      sY = dY;
      dY += stepH;
    }
    return ctx.getImageData(sX, sY, dW, dH);
  }

  /**
   * Filter lanczosResize
   * @param {Object} canvasEl Canvas element to apply filter to
   * @param {Number} oW Original Width
   * @param {Number} oH Original Height
   * @param {Number} dW Destination Width
   * @param {Number} dH Destination Height
   * @returns {ImageData}
   */
  lanczosResize(options, oW, oH, dW, dH) {
    function process(u) {
      let v, i, weight, idx, a, red, green, blue, alpha, fX, fY;
      center.x = (u + 0.5) * ratioX;
      icenter.x = Math.floor(center.x);
      for (v = 0; v < dH; v++) {
        center.y = (v + 0.5) * ratioY;
        icenter.y = Math.floor(center.y);
        a = 0;
        red = 0;
        green = 0;
        blue = 0;
        alpha = 0;
        for (i = icenter.x - range2X; i <= icenter.x + range2X; i++) {
          if (i < 0 || i >= oW) {
            continue;
          }
          fX = Math.floor(1000 * Math.abs(i - center.x));
          if (!cacheLanc[fX]) {
            cacheLanc[fX] = {};
          }
          for (let j = icenter.y - range2Y; j <= icenter.y + range2Y; j++) {
            if (j < 0 || j >= oH) {
              continue;
            }
            fY = Math.floor(1000 * Math.abs(j - center.y));
            if (!cacheLanc[fX][fY]) {
              cacheLanc[fX][fY] = lanczos(Math.sqrt(Math.pow(fX * rcpRatioX, 2) + Math.pow(fY * rcpRatioY, 2)) / 1000);
            }
            weight = cacheLanc[fX][fY];
            if (weight > 0) {
              idx = (j * oW + i) * 4;
              a += weight;
              red += weight * srcData[idx];
              green += weight * srcData[idx + 1];
              blue += weight * srcData[idx + 2];
              alpha += weight * srcData[idx + 3];
            }
          }
        }
        idx = (v * dW + u) * 4;
        destData[idx] = red / a;
        destData[idx + 1] = green / a;
        destData[idx + 2] = blue / a;
        destData[idx + 3] = alpha / a;
      }
      if (++u < dW) {
        return process(u);
      } else {
        return destImg;
      }
    }
    const srcData = options.imageData.data,
      destImg = options.ctx.createImageData(dW, dH),
      destData = destImg.data,
      lanczos = this.lanczosCreate(this.lanczosLobes),
      ratioX = this.rcpScaleX,
      ratioY = this.rcpScaleY,
      rcpRatioX = 2 / this.rcpScaleX,
      rcpRatioY = 2 / this.rcpScaleY,
      range2X = Math.ceil(ratioX * this.lanczosLobes / 2),
      range2Y = Math.ceil(ratioY * this.lanczosLobes / 2),
      cacheLanc = {},
      center = {
        x: 0,
        y: 0
      },
      icenter = {
        x: 0,
        y: 0
      };
    return process(0);
  }

  /**
   * bilinearFiltering
   * @param {Object} canvasEl Canvas element to apply filter to
   * @param {Number} oW Original Width
   * @param {Number} oH Original Height
   * @param {Number} dW Destination Width
   * @param {Number} dH Destination Height
   * @returns {ImageData}
   */
  bilinearFiltering(options, oW, oH, dW, dH) {
    let a;
    let b;
    let c;
    let d;
    let x;
    let y;
    let i;
    let j;
    let xDiff;
    let yDiff;
    let chnl;
    let color;
    let offset = 0;
    let origPix;
    const ratioX = this.rcpScaleX;
    const ratioY = this.rcpScaleY;
    const w4 = 4 * (oW - 1);
    const img = options.imageData;
    const pixels = img.data;
    const destImage = options.ctx.createImageData(dW, dH);
    const destPixels = destImage.data;
    for (i = 0; i < dH; i++) {
      for (j = 0; j < dW; j++) {
        x = Math.floor(ratioX * j);
        y = Math.floor(ratioY * i);
        xDiff = ratioX * j - x;
        yDiff = ratioY * i - y;
        origPix = 4 * (y * oW + x);
        for (chnl = 0; chnl < 4; chnl++) {
          a = pixels[origPix + chnl];
          b = pixels[origPix + 4 + chnl];
          c = pixels[origPix + w4 + chnl];
          d = pixels[origPix + w4 + 4 + chnl];
          color = a * (1 - xDiff) * (1 - yDiff) + b * xDiff * (1 - yDiff) + c * yDiff * (1 - xDiff) + d * xDiff * yDiff;
          destPixels[offset++] = color;
        }
      }
    }
    return destImage;
  }

  /**
   * hermiteFastResize
   * @param {Object} canvasEl Canvas element to apply filter to
   * @param {Number} oW Original Width
   * @param {Number} oH Original Height
   * @param {Number} dW Destination Width
   * @param {Number} dH Destination Height
   * @returns {ImageData}
   */
  hermiteFastResize(options, oW, oH, dW, dH) {
    const ratioW = this.rcpScaleX,
      ratioH = this.rcpScaleY,
      ratioWHalf = Math.ceil(ratioW / 2),
      ratioHHalf = Math.ceil(ratioH / 2),
      img = options.imageData,
      data = img.data,
      img2 = options.ctx.createImageData(dW, dH),
      data2 = img2.data;
    for (let j = 0; j < dH; j++) {
      for (let i = 0; i < dW; i++) {
        const x2 = (i + j * dW) * 4;
        let weight = 0;
        let weights = 0;
        let weightsAlpha = 0;
        let gxR = 0;
        let gxG = 0;
        let gxB = 0;
        let gxA = 0;
        const centerY = (j + 0.5) * ratioH;
        for (let yy = Math.floor(j * ratioH); yy < (j + 1) * ratioH; yy++) {
          const dy = Math.abs(centerY - (yy + 0.5)) / ratioHHalf,
            centerX = (i + 0.5) * ratioW,
            w0 = dy * dy;
          for (let xx = Math.floor(i * ratioW); xx < (i + 1) * ratioW; xx++) {
            let dx = Math.abs(centerX - (xx + 0.5)) / ratioWHalf;
            const w = Math.sqrt(w0 + dx * dx);
            /* eslint-disable max-depth */
            if (w > 1 && w < -1) {
              continue;
            }
            //hermite filter
            weight = 2 * w * w * w - 3 * w * w + 1;
            if (weight > 0) {
              dx = 4 * (xx + yy * oW);
              //alpha
              gxA += weight * data[dx + 3];
              weightsAlpha += weight;
              //colors
              if (data[dx + 3] < 255) {
                weight = weight * data[dx + 3] / 250;
              }
              gxR += weight * data[dx];
              gxG += weight * data[dx + 1];
              gxB += weight * data[dx + 2];
              weights += weight;
            }
            /* eslint-enable max-depth */
          }
        }
        data2[x2] = gxR / weights;
        data2[x2 + 1] = gxG / weights;
        data2[x2 + 2] = gxB / weights;
        data2[x2 + 3] = gxA / weightsAlpha;
      }
    }
    return img2;
  }
}
/**
 * Resize type
 * for webgl resizeType is just lanczos, for canvas2d can be:
 * bilinear, hermite, sliceHack, lanczos.
 */
/**
 * Scale factor for resizing, x axis
 * @param {Number} scaleX
 */
/**
 * Scale factor for resizing, y axis
 * @param {Number} scaleY
 */
/**
 * LanczosLobes parameter for lanczos filter, valid for resizeType lanczos
 * @param {Number} lanczosLobes
 */
_defineProperty(Resize, "type", 'Resize');
_defineProperty(Resize, "defaults", resizeDefaultValues);
_defineProperty(Resize, "uniformLocations", ['uDelta', 'uTaps']);
classRegistry.setClass(Resize);

const fragmentSource$1 = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform float uSaturation;
  varying vec2 vTexCoord;
  void main() {
    vec4 color = texture2D(uTexture, vTexCoord);
    float rgMax = max(color.r, color.g);
    float rgbMax = max(rgMax, color.b);
    color.r += rgbMax != color.r ? (rgbMax - color.r) * uSaturation : 0.00;
    color.g += rgbMax != color.g ? (rgbMax - color.g) * uSaturation : 0.00;
    color.b += rgbMax != color.b ? (rgbMax - color.b) * uSaturation : 0.00;
    gl_FragColor = color;
  }
`;

const saturationDefaultValues = {
  saturation: 0
};

/**
 * Saturate filter class
 * @example
 * const filter = new Saturation({
 *   saturation: 1
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
class Saturation extends BaseFilter {
  getFragmentSource() {
    return fragmentSource$1;
  }

  /**
   * Apply the Saturation operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d(_ref) {
    let {
      imageData: {
        data
      }
    } = _ref;
    const adjust = -this.saturation;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const max = Math.max(r, g, b);
      data[i] += max !== r ? (max - r) * adjust : 0;
      data[i + 1] += max !== g ? (max - g) * adjust : 0;
      data[i + 2] += max !== b ? (max - b) * adjust : 0;
    }
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {Object} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(gl, uniformLocations) {
    gl.uniform1f(uniformLocations.uSaturation, -this.saturation);
  }
  isNeutralState() {
    return this.saturation === 0;
  }
}
/**
 * Saturation value, from -1 to 1.
 * Increases/decreases the color saturation.
 * A value of 0 has no effect.
 *
 * @param {Number} saturation
 */
_defineProperty(Saturation, "type", 'Saturation');
_defineProperty(Saturation, "defaults", saturationDefaultValues);
_defineProperty(Saturation, "uniformLocations", ['uSaturation']);
classRegistry.setClass(Saturation);

const fragmentSource = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform float uVibrance;
  varying vec2 vTexCoord;
  void main() {
    vec4 color = texture2D(uTexture, vTexCoord);
    float max = max(color.r, max(color.g, color.b));
    float avg = (color.r + color.g + color.b) / 3.0;
    float amt = (abs(max - avg) * 2.0) * uVibrance;
    color.r += max != color.r ? (max - color.r) * amt : 0.00;
    color.g += max != color.g ? (max - color.g) * amt : 0.00;
    color.b += max != color.b ? (max - color.b) * amt : 0.00;
    gl_FragColor = color;
  }
`;

const vibranceDefaultValues = {
  vibrance: 0
};

/**
 * Vibrance filter class
 * @example
 * const filter = new Vibrance({
 *   vibrance: 1
 * });
 * object.filters.push(filter);
 * object.applyFilters();
 */
class Vibrance extends BaseFilter {
  getFragmentSource() {
    return fragmentSource;
  }

  /**
   * Apply the Vibrance operation to a Uint8ClampedArray representing the pixels of an image.
   *
   * @param {Object} options
   * @param {ImageData} options.imageData The Uint8ClampedArray to be filtered.
   */
  applyTo2d(_ref) {
    let {
      imageData: {
        data
      }
    } = _ref;
    const adjust = -this.vibrance;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const max = Math.max(r, g, b);
      const avg = (r + g + b) / 3;
      const amt = Math.abs(max - avg) * 2 / 255 * adjust;
      data[i] += max !== r ? (max - r) * amt : 0;
      data[i + 1] += max !== g ? (max - g) * amt : 0;
      data[i + 2] += max !== b ? (max - b) * amt : 0;
    }
  }

  /**
   * Send data from this filter to its shader program's uniforms.
   *
   * @param {WebGLRenderingContext} gl The GL canvas context used to compile this filter's shader.
   * @param {TWebGLUniformLocationMap} uniformLocations A map of string uniform names to WebGLUniformLocation objects
   */
  sendUniformData(gl, uniformLocations) {
    gl.uniform1f(uniformLocations.uVibrance, -this.vibrance);
  }
  isNeutralState() {
    return this.vibrance === 0;
  }
}
/**
 * Vibrance value, from -1 to 1.
 * Increases/decreases the saturation of more muted colors with less effect on saturated colors.
 * A value of 0 has no effect.
 *
 * @param {Number} vibrance
 */
_defineProperty(Vibrance, "type", 'Vibrance');
_defineProperty(Vibrance, "defaults", vibranceDefaultValues);
_defineProperty(Vibrance, "uniformLocations", ['uVibrance']);
classRegistry.setClass(Vibrance);

var filters = /*#__PURE__*/Object.freeze({
  __proto__: null,
  BaseFilter: BaseFilter,
  BlackWhite: BlackWhite,
  BlendColor: BlendColor,
  BlendImage: BlendImage,
  Blur: Blur,
  Brightness: Brightness,
  Brownie: Brownie,
  ColorMatrix: ColorMatrix,
  Composed: Composed,
  Contrast: Contrast,
  Convolute: Convolute,
  Gamma: Gamma,
  Grayscale: Grayscale,
  HueRotation: HueRotation,
  Invert: Invert,
  Kodachrome: Kodachrome,
  Noise: Noise,
  Pixelate: Pixelate,
  Polaroid: Polaroid,
  RemoveColor: RemoveColor,
  Resize: Resize,
  Saturation: Saturation,
  Sepia: Sepia,
  Technicolor: Technicolor,
  Vibrance: Vibrance,
  Vintage: Vintage
});

// First we set the env variable

setEnv(getEnv());
FabricObject$1.ownDefaults.objectCaching = false;
class StaticCanvas extends StaticCanvas$1 {
  getNodeCanvas() {
    return getNodeCanvas(this.getElement());
  }
  createPNGStream(opts) {
    return this.getNodeCanvas().createPNGStream(opts);
  }
  createJPEGStream(opts) {
    return this.getNodeCanvas().createJPEGStream(opts);
  }
}

/**
 * **NOTICE**:
 * {@link Canvas} is designed for interactivity.
 * Therefore, using it in node has no benefit.
 * Use {@link StaticCanvas} instead.
 */
class Canvas extends Canvas$1 {
  getNodeCanvas() {
    return getNodeCanvas(this.getElement());
  }
  createPNGStream(opts) {
    return this.getNodeCanvas().createPNGStream(opts);
  }
  createJPEGStream(opts) {
    return this.getNodeCanvas().createJPEGStream(opts);
  }
}

export { ActiveSelection, BaseBrush, FabricObject$1 as BaseFabricObject, Canvas, Canvas2dFilterBackend, CanvasDOMManager, Circle, CircleBrush, ClipPathLayout, Color, Control, Ellipse, FabricImage, FabricObject, FabricText, FitContentLayout, FixedLayout, Gradient, Group, IText, FabricImage as Image, InteractiveFabricObject, Intersection, LayoutManager, LayoutStrategy, Line, FabricObject as Object, Observable, Path, Pattern, PatternBrush, PencilBrush, Point, Polygon, Polyline, Rect, Shadow, SprayBrush, StaticCanvas, StaticCanvasDOMManager, FabricText as Text, Textbox, Triangle, WebGLFilterBackend, cache, classRegistry, config, index as controlsUtils, createCollectionMixin, filters, getEnv$1 as getEnv, getFabricDocument, getFabricWindow, getFilterBackend, iMatrix, initFilterBackend, isPutImageFaster, isWebGLPipelineState, loadSVGFromString, loadSVGFromURL, parseSVGDocument, runningAnimations, setEnv, setFilterBackend, index$1 as util, VERSION as version };
//# sourceMappingURL=index.node.mjs.map
