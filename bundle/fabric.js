'use strict';

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
    devicePixelRatio = 1;
    /**
     * Pixel limit for cache canvases. 1Mpx , 4Mpx should be fine.
     * @since 1.7.14
     * @type Number
     * @default
     */
    perfLimitSizeTotal = 2097152;
    /**
     * Pixel limit for cache canvases width or height. IE fixes the maximum at 5000
     * @since 1.7.14
     * @type Number
     * @default
     */
    maxCacheSideLimit = 4096;
    /**
     * Lowest pixel limit for cache canvases, set at 256PX
     * @since 1.7.14
     * @type Number
     * @default
     */
    minCacheSideLimit = 256;
    /**
     * When 'true', style information is not retained when copy/pasting text, making
     * pasted text use destination style.
     * Defaults to 'false'.
     * @type Boolean
     * @default
     * @deprecated
     */
    disableStyleCopyPaste = false;
    /**
     * Enable webgl for filtering picture is available
     * A filtering backend will be initialized, this will both take memory and
     * time since a default 2048x2048 canvas will be created for the gl context
     * @since 2.0.0
     * @type Boolean
     * @default
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
     * @default
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
     * @default true
     */
    cachesBoundsOfCurve = true;
    /**
     * Map of font files
     * Map<fontFamily, pathToFile> of font files
     */
    fontPaths = {};
    /**
     * Defines the number of fraction digits to use when serializing object values.
     * Used in exporting methods (`toObject`, `toJSON`, `toSVG`)
     * You can use it to increase/decrease precision of such values like left, top, scaleX, scaleY, etc.
     */
    NUM_FRACTION_DIGITS = 4;
}
class Configuration extends BaseConfiguration {
    constructor(config) {
        super();
        this.configure(config);
    }
    configure(config = {}) {
        Object.assign(this, config);
    }
    /**
     * Map<fontFamily, pathToFile> of font files
     */
    addFonts(paths = {}) {
        this.fontPaths = {
            ...this.fontPaths,
            ...paths,
        };
    }
    removeFonts(fontFamilys = []) {
        fontFamilys.forEach((fontFamily) => {
            delete this.fontPaths[fontFamily];
        });
    }
    clearFonts() {
        this.fontPaths = {};
    }
    restoreDefaults(keys) {
        const defaults = new BaseConfiguration();
        const config = keys?.reduce((acc, key) => {
            acc[key] = defaults[key];
            return acc;
        }, {}) || defaults;
        this.configure(config);
    }
}
const config = new Configuration();

class Cache {
    /**
     * Cache of widths of chars in text rendering.
     */
    charWidthsCache = {};
    /**
     * @return {Object} reference to cache
     */
    getFontCache({ fontFamily, fontStyle, fontWeight, }) {
        fontFamily = fontFamily.toLowerCase();
        if (!this.charWidthsCache[fontFamily]) {
            this.charWidthsCache[fontFamily] = {};
        }
        const fontCache = this.charWidthsCache[fontFamily];
        const cacheKey = `${fontStyle.toLowerCase()}_${(fontWeight + '').toLowerCase()}`;
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
        }
        else if (this.charWidthsCache[fontFamily]) {
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
     * This object contains the result of arc to bezier conversion for faster retrieving if the same arc needs to be converted again.
     * It was an internal variable, is accessible since version 2.3.4
     */
    arcToSegmentsCache = {};
    /**
     * This object keeps the results of the boundsOfCurve calculation mapped by the joined arguments necessary to calculate it.
     * It does speed up calculation, if you parse and add always the same paths, but in case of heavy usage of freedrawing
     * you do not get any speed benefit and you get a big object in memory.
     * The object was a private variable before, while now is appended to the lib so that you have access to it and you
     * can eventually clear it.
     * It was an internal variable, is accessible since version 2.3.4
     */
    boundsOfCurveCache = {};
}
const cache = new Cache();

// TODO: consider using https://github.com/swiing/rollup-plugin-import-assertions so we can import json in node and have rollup build pass
// export { version as VERSION } from '../package.json';
function noop() { }
const halfPI = Math.PI / 2;
const twoMathPi = Math.PI * 2;
const PiBy180 = Math.PI / 180;
const iMatrix = Object.freeze([1, 0, 0, 1, 0, 0]);
const DEFAULT_SVG_FONT_SIZE = 16;
const ALIASING_LIMIT = 2;
/* "magic number" for bezier approximations of arcs (http://itc.ktu.lt/itc354/Riskus354.pdf) */
const kRect = 1 - 0.5522847498;
const VERSION = '6';

var fabric = fabric || {
  version: VERSION,
  config,
  cache,
  iMatrix,
};

if (typeof exports !== 'undefined') {
  exports.fabric = fabric;
} else if (typeof define === 'function' && define.amd) {
  /* _AMD_START_ */
  define([], function () {
    return fabric;
  });
}
/* _AMD_END_ */
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  if (
    document instanceof
    (typeof HTMLDocument !== 'undefined' ? HTMLDocument : Document)
  ) {
    fabric.document = document;
  } else {
    fabric.document = document.implementation.createHTMLDocument('');
  }
  fabric.window = window;
  window.fabric = fabric;
} else {
  // assume we're running under node.js when document/window are not present
  var jsdom = require('jsdom');
  var virtualWindow = new jsdom.JSDOM(
    decodeURIComponent(
      '%3C!DOCTYPE%20html%3E%3Chtml%3E%3Chead%3E%3C%2Fhead%3E%3Cbody%3E%3C%2Fbody%3E%3C%2Fhtml%3E'
    ),
    {
      features: {
        FetchExternalResources: ['img'],
      },
      resources: 'usable',
    }
  ).window;
  fabric.document = virtualWindow.document;
  fabric.jsdomImplForWrapper =
    require('jsdom/lib/jsdom/living/generated/utils').implForWrapper;
  fabric.nodeCanvas = require('jsdom/lib/jsdom/utils').Canvas;
  fabric.window = virtualWindow;
  global.DOMParser = fabric.window.DOMParser;
}

/**
 * True when in environment that supports touch events
 * @type boolean
 */
fabric.isTouchSupported =
  'ontouchstart' in fabric.window ||
  'ontouchstart' in fabric.document ||
  (fabric.window &&
    fabric.window.navigator &&
    fabric.window.navigator.maxTouchPoints > 0);

/**
 * True when in environment that's probably Node.js
 * @type boolean
 */
fabric.isLikelyNode =
  typeof Buffer !== 'undefined' && typeof window === 'undefined';

/**
 * @todo move to config when window is exported
 */
config.configure({
  devicePixelRatio:
    fabric.window.devicePixelRatio ||
    fabric.window.webkitDevicePixelRatio ||
    fabric.window.mozDevicePixelRatio ||
    1,
});

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

function createCollectionMixin(Base) {
    class Collection extends Base {
        /**
         * @type {FabricObject[]}
         */
        _objects = [];
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
        add(...objects) {
            const size = this._objects.push(...objects);
            objects.forEach((object) => this._onObjectAdded(object));
            return size;
        }
        /**
         * Inserts an object into collection at specified index
         * @param {number} index Index to insert object at
         * @param {...FabricObject[]} objects Object(s) to insert
         * @returns {number} new array length
         */
        insertAt(index, ...objects) {
            this._objects.splice(index, 0, ...objects);
            objects.forEach((object) => this._onObjectAdded(object));
            return this._objects.length;
        }
        /**
         * Removes objects from a collection, then renders canvas (if `renderOnAddRemove` is not `false`)
         * @private
         * @param {...FabricObject[]} objects objects to remove
         * @returns {FabricObject[]} removed objects
         */
        remove(...objects) {
            const array = this._objects, removed = [];
            objects.forEach((object) => {
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
        getObjects(...types) {
            if (types.length === 0) {
                return [...this._objects];
            }
            return this._objects.filter((o) => types.includes(o.type));
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
         * **Prefer using {@link `FabricObject#isDescendantOf`} for performance reasons**
         * instead of `a.contains(b)` use `b.isDescendantOf(a)`
         * @param {Object} object Object to check against
         * @param {Boolean} [deep=false] `true` to check all descendants, `false` to check only `_objects`
         * @return {Boolean} `true` if collection contains an object
         */
        contains(object, deep) {
            if (this._objects.includes(object)) {
                return true;
            }
            else if (deep) {
                return this._objects.some((obj) => obj instanceof Collection &&
                    obj.contains(object, true));
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
            }
            else {
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
            }
            else {
                newIdx = idx + 1;
            }
            return newIdx;
        }
    }
    // https://github.com/microsoft/TypeScript/issues/32080
    return Collection;
}
fabric.createCollectionMixin = createCollectionMixin;

/**
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-2#events}
 * @see {@link http://fabricjs.com/events|Events demo}
 */
class Observable {
    __eventListeners = {};
    on(arg0, handler) {
        if (!this.__eventListeners) {
            this.__eventListeners = {};
        }
        if (typeof arg0 === 'object') {
            // one object with key/value pairs was passed
            for (const eventName in arg0) {
                this.on(eventName, arg0[eventName]);
            }
            return () => this.off(arg0);
        }
        else if (handler) {
            const eventName = arg0;
            if (!this.__eventListeners[eventName]) {
                this.__eventListeners[eventName] = [];
            }
            this.__eventListeners[eventName].push(handler);
            return () => this.off(eventName, handler);
        }
        else {
            // noop
            return () => false;
        }
    }
    once(arg0, handler) {
        if (typeof arg0 === 'object') {
            // one object with key/value pairs was passed
            const disposers = [];
            for (const eventName in arg0) {
                disposers.push(this.once(eventName, arg0[eventName]));
            }
            return () => disposers.forEach((d) => d());
        }
        else if (handler) {
            const disposer = this.on(arg0, (...args) => {
                handler(...args);
                disposer();
            });
            return disposer;
        }
        else {
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
        }
        else {
            this.__eventListeners[eventName] = [];
        }
    }
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
            for (const eventName in arg0) {
                this._removeEventListener(eventName, arg0[eventName]);
            }
        }
        else {
            this._removeEventListener(arg0, handler);
        }
    }
    /**
     * Fires event with an optional options object
     * @param {String} eventName Event name to fire
     * @param {Object} [options] Options object
     */
    fire(eventName, options) {
        if (!this.__eventListeners) {
            return;
        }
        const listenersForEvent = this.__eventListeners[eventName]?.concat();
        if (listenersForEvent) {
            for (let i = 0; i < listenersForEvent.length; i++) {
                listenersForEvent[i].call(this, options || {});
            }
        }
    }
}
fabric.Observable = Observable;

//@ts-nocheck
class CommonMethods extends Observable {
    /**
     * Sets object's properties from options
     * @param {Object} [options] Options object
     */
    _setOptions(options) {
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
        }
        else {
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

/**
 * Calculate the cos of an angle, avoiding returning floats for known results
 * This function is here just to avoid getting 0.999999999999999 when dealing
 * with numbers that are really 1 or 0.
 * @param {TRadian} angle the angle
 * @return {Number} the cosin value for angle.
 */
const cos = (angle) => {
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
const sin = (angle) => {
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
    x;
    y;
    constructor(arg0 = 0, y = 0) {
        if (typeof arg0 === 'object') {
            this.x = arg0.x;
            this.y = arg0.y;
        }
        else {
            this.x = arg0;
            this.y = y;
        }
    }
    /**
     * Adds another point to this one and returns another one
     * @param {IPoint} that
     * @return {Point} new Point instance with added values
     */
    add(that) {
        return new Point(this.x + that.x, this.y + that.y);
    }
    /**
     * Adds another point to this one
     * @param {IPoint} that
     * @return {Point} thisArg
     * @chainable
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
     * @chainable
     * @deprecated
     */
    scalarAddEquals(scalar) {
        this.x += scalar;
        this.y += scalar;
        return this;
    }
    /**
     * Subtracts another point from this point and returns a new one
     * @param {IPoint} that
     * @return {Point} new Point object with subtracted values
     */
    subtract(that) {
        return new Point(this.x - that.x, this.y - that.y);
    }
    /**
     * Subtracts another point from this point
     * @param {IPoint} that
     * @return {Point} thisArg
     * @chainable
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
     * @chainable
     * @deprecated
     */
    scalarSubtractEquals(scalar) {
        this.x -= scalar;
        this.y -= scalar;
        return this;
    }
    /**
     * Multiplies this point by another value and returns a new one
     * @param {IPoint} that
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
     * @chainable
     * @deprecated
     */
    scalarMultiplyEquals(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    /**
     * Divides this point by another and returns a new one
     * @param {IPoint} that
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
     * @chainable
     * @deprecated
     */
    scalarDivideEquals(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }
    /**
     * Returns true if this point is equal to another one
     * @param {IPoint} that
     * @return {Boolean}
     */
    eq(that) {
        return this.x === that.x && this.y === that.y;
    }
    /**
     * Returns true if this point is less than another one
     * @param {IPoint} that
     * @return {Boolean}
     */
    lt(that) {
        return this.x < that.x && this.y < that.y;
    }
    /**
     * Returns true if this point is less than or equal to another one
     * @param {IPoint} that
     * @return {Boolean}
     */
    lte(that) {
        return this.x <= that.x && this.y <= that.y;
    }
    /**
  
     * Returns true if this point is greater another one
     * @param {IPoint} that
     * @return {Boolean}
     */
    gt(that) {
        return this.x > that.x && this.y > that.y;
    }
    /**
     * Returns true if this point is greater than or equal to another one
     * @param {IPoint} that
     * @return {Boolean}
     */
    gte(that) {
        return this.x >= that.x && this.y >= that.y;
    }
    /**
     * Returns new point which is the result of linear interpolation with this one and another one
     * @param {IPoint} that
     * @param {Number} t , position of interpolation, between 0 and 1 default 0.5
     * @return {Point}
     */
    lerp(that, t = 0.5) {
        t = Math.max(Math.min(1, t), 0);
        return new Point(this.x + (that.x - this.x) * t, this.y + (that.y - this.y) * t);
    }
    /**
     * Returns distance from this point and another one
     * @param {IPoint} that
     * @return {Number}
     */
    distanceFrom(that) {
        const dx = this.x - that.x, dy = this.y - that.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    /**
     * Returns the point between this point and another one
     * @param {IPoint} that
     * @return {Point}
     */
    midPointFrom(that) {
        return this.lerp(that);
    }
    /**
     * Returns a new point which is the min of this and another one
     * @param {IPoint} that
     * @return {Point}
     */
    min(that) {
        return new Point(Math.min(this.x, that.x), Math.min(this.y, that.y));
    }
    /**
     * Returns a new point which is the max of this and another one
     * @param {IPoint} that
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
     * @chainable
     */
    setXY(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    /**
     * Sets x of this point
     * @param {Number} x
     * @chainable
     */
    setX(x) {
        this.x = x;
        return this;
    }
    /**
     * Sets y of this point
     * @param {Number} y
     * @chainable
     */
    setY(y) {
        this.y = y;
        return this;
    }
    /**
     * Sets x/y of this point from another point
     * @param {IPoint} that
     * @chainable
     */
    setFromPoint(that) {
        this.x = that.x;
        this.y = that.y;
        return this;
    }
    /**
     * Swaps x/y of this point and another point
     * @param {IPoint} that
     */
    swap(that) {
        const x = this.x, y = this.y;
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
     * @static
     * @memberOf fabric.util
     * @param {IPoint} origin The origin of the rotation
     * @param {TRadian} radians The radians of the angle for the rotation
     * @return {Point} The new rotated point
     */
    rotate(radians, origin = originZero) {
        // TODO benchmark and verify the add and subtract how much cost
        // and then in case early return if no origin is passed
        const sinus = sin(radians), cosinus = cos(radians);
        const p = this.subtract(origin);
        const rotated = new Point(p.x * cosinus - p.y * sinus, p.x * sinus + p.y * cosinus);
        return rotated.add(origin);
    }
    /**
     * Apply transform t to point p
     * @static
     * @memberOf fabric.util
     * @param  {TMat2D} t The transform
     * @param  {Boolean} [ignoreOffset] Indicates that the offset should not be applied
     * @return {Point} The transformed point
     */
    transform(t, ignoreOffset = false) {
        return new Point(t[0] * this.x + t[2] * this.y + (ignoreOffset ? 0 : t[4]), t[1] * this.x + t[3] * this.y + (ignoreOffset ? 0 : t[5]));
    }
}
const originZero = new Point(0, 0);
fabric.Point = Point;

const _requestAnimFrame = fabric.window.requestAnimationFrame ||
    function (callback) {
        return fabric.window.setTimeout(callback, 1000 / 60);
    };
const _cancelAnimFrame = fabric.window.cancelAnimationFrame || fabric.window.clearTimeout;
/**
 * requestAnimationFrame polyfill based on http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * In order to get a precise start time, `requestAnimFrame` should be called as an entry into the method
 * @param {Function} callback Callback to invoke
 */
function requestAnimFrame(callback) {
    return _requestAnimFrame.call(fabric.window, callback);
}
function cancelAnimFrame(handle) {
    return _cancelAnimFrame.call(fabric.window, handle);
}

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
        animations.forEach((animation) => animation.abort());
        return animations;
    }
    /**
     * Cancel all running animations attached to a Canvas on the next frame
     * @param {Canvas} canvas
     */
    cancelByCanvas(canvas) {
        if (!canvas) {
            return [];
        }
        const animations = this.filter((animation) => typeof animation.target === 'object' &&
            animation.target?.canvas === canvas);
        animations.forEach((animation) => animation.abort());
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
        const animations = this.filter((animation) => animation.target === target);
        animations.forEach((animation) => animation.abort());
        return animations;
    }
}
const runningAnimations = new AnimationRegistry();
fabric.runningAnimations = runningAnimations;

/**
 * Easing functions
 * @see {@link http://gizma.com/easing/ Easing Equations by Robert Penner}
 */
/**
 * Default sinusoidal easing
 */
const defaultEasing = (t, b, c, d) => -c * Math.cos((t / d) * halfPI) + c + b;

const defaultAbort = () => false;
class AnimationBase {
    startValue;
    byValue;
    endValue;
    duration;
    delay;
    easing;
    _onStart;
    _onChange;
    _onComplete;
    _abort;
    /**
     * Used to register the animation to a target object
     * so that it can be cancelled within the object context
     */
    target;
    _state = 'pending';
    /**
     * Time %, or the ratio of `timeElapsed / duration`
     * @see tick
     */
    durationRatio = 0;
    /**
     * Value %, or the ratio of `(currentValue - startValue) / (endValue - startValue)`
     */
    valueRatio = 0;
    /**
     * Current value
     */
    value;
    /**
     * Animation start time ms
     */
    startTime;
    /**
     * Constructor
     * Since both `byValue` and `endValue` are accepted in subclass options
     * and are populated with defaults if missing, we defer to `byValue` and
     * ignore `endValue` to avoid conflict
     */
    constructor({ startValue, byValue, duration = 500, delay = 0, easing = defaultEasing, onStart = noop, onChange = noop, onComplete = noop, abort = defaultAbort, target, }) {
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
        this.endValue = this.calculate(this.duration).value;
    }
    get state() {
        return this._state;
    }
    start() {
        const firstTick = (timestamp) => {
            if (this._state !== 'pending')
                return;
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
        }
        else {
            requestAnimFrame(firstTick);
        }
    }
    tick(t) {
        const durationMs = (t || +new Date()) - this.startTime;
        const boundDurationMs = Math.min(durationMs, this.duration);
        this.durationRatio = boundDurationMs / this.duration;
        const { value, changeRatio } = this.calculate(boundDurationMs);
        this.value = Array.isArray(value) ? value.slice() : value;
        this.valueRatio = changeRatio;
        if (this._state === 'aborted') {
            return;
        }
        else if (this._abort(value, this.valueRatio, this.durationRatio)) {
            this._state = 'aborted';
            this.unregister();
        }
        else if (durationMs >= this.duration) {
            const endValue = this.endValue;
            this.durationRatio = this.valueRatio = 1;
            this._onChange((Array.isArray(endValue) ? endValue.slice() : endValue), this.valueRatio, this.durationRatio);
            this._state = 'completed';
            this._onComplete(endValue, this.valueRatio, this.durationRatio);
            this.unregister();
        }
        else {
            this._onChange(value, this.valueRatio, this.durationRatio);
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
    constructor({ startValue = 0, endValue = 100, byValue = endValue - startValue, ...options }) {
        super({
            ...options,
            startValue,
            byValue,
        });
    }
    calculate(timeElapsed) {
        const value = this.easing(timeElapsed, this.startValue, this.byValue, this.duration);
        return {
            value,
            changeRatio: Math.abs((value - this.startValue) / this.byValue),
        };
    }
}

class ArrayAnimation extends AnimationBase {
    constructor({ startValue = [0], endValue = [100], byValue = endValue.map((value, i) => value - startValue[i]), ...options }) {
        super({
            ...options,
            startValue,
            byValue,
        });
    }
    calculate(timeElapsed) {
        const values = this.startValue.map((value, i) => this.easing(timeElapsed, value, this.byValue[i], this.duration, i));
        return {
            value: values,
            changeRatio: Math.abs((values[0] - this.startValue[0]) / this.byValue[0]),
        };
    }
}

/**
 * Map of the 148 color names with HEX code
 * @see: https://www.w3.org/TR/css3-color/#svg-color
 */
const ColorNameMap = {
    aliceblue: '#F0F8FF',
    antiquewhite: '#FAEBD7',
    aqua: '#00FFFF',
    aquamarine: '#7FFFD4',
    azure: '#F0FFFF',
    beige: '#F5F5DC',
    bisque: '#FFE4C4',
    black: '#000000',
    blanchedalmond: '#FFEBCD',
    blue: '#0000FF',
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
    cyan: '#00FFFF',
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
    fuchsia: '#FF00FF',
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
    lightslategray: '#778899',
    lightslategrey: '#778899',
    lightsteelblue: '#B0C4DE',
    lightyellow: '#FFFFE0',
    lime: '#00FF00',
    limegreen: '#32CD32',
    linen: '#FAF0E6',
    magenta: '#FF00FF',
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
    rebeccapurple: '#663399',
    red: '#FF0000',
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
    white: '#FFFFFF',
    whitesmoke: '#F5F5F5',
    yellow: '#FFFF00',
    yellowgreen: '#9ACD32',
};

/**
 * Regex matching color in RGB or RGBA formats (ex: rgb(0, 0, 0), rgba(255, 100, 10, 0.5), rgba( 255 , 100 , 10 , 0.5 ), rgb(1,1,1), rgba(100%, 60%, 10%, 0.5))
 * @static
 * @field
 * @memberOf Color
 */
// eslint-disable-next-line max-len
const reRGBa = /^rgba?\(\s*(\d{1,3}(?:\.\d+)?%?)\s*,\s*(\d{1,3}(?:\.\d+)?%?)\s*,\s*(\d{1,3}(?:\.\d+)?%?)\s*(?:\s*,\s*((?:\d*\.?\d+)?)\s*)?\)$/i;
/**
 * Regex matching color in HSL or HSLA formats (ex: hsl(200, 80%, 10%), hsla(300, 50%, 80%, 0.5), hsla( 300 , 50% , 80% , 0.5 ))
 * @static
 * @field
 * @memberOf Color
 */
const reHSLa = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3}%)\s*,\s*(\d{1,3}%)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/i;
/**
 * Regex matching color in HEX format (ex: #FF5544CC, #FF5555, 010155, aff)
 * @static
 * @field
 * @memberOf Color
 */
const reHex = /^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i;

/**
 * @param {Number} p
 * @param {Number} q
 * @param {Number} t
 * @return {Number}
 */
function hue2rgb(p, q, t) {
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
}
/**
 * Convert a value ∈ [0, 255] to hex
 */
function hexify(value) {
    const hexValue = value.toString(16).toUpperCase();
    return hexValue.length === 1 ? `0${hexValue}` : hexValue;
}

/**
 * @class Color common color operations
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-2/#colors colors}
 */
class Color {
    _source;
    /**
     *
     * @param {string} [color] optional in hex or rgb(a) or hsl format or from known color list
     */
    constructor(color) {
        if (!color) {
            // we default to black as canvas does
            this.setSource([0, 0, 0, 1]);
        }
        else if (color instanceof Color) {
            this.setSource([...color._source]);
        }
        else if (Array.isArray(color)) {
            const [r, g, b, a = 1] = color;
            this.setSource([r, g, b, a]);
        }
        else {
            this.setSource(this._tryParsingColor(color));
        }
    }
    /**
     * @private
     * @param {string} [color] Color value to parse
     * @returns {TRGBAColorSource}
     */
    _tryParsingColor(color) {
        if (color in ColorNameMap) {
            color = ColorNameMap[color];
        }
        return color === 'transparent'
            ? [255, 255, 255, 0]
            : Color.sourceFromHex(color) ||
                Color.sourceFromRgb(color) ||
                Color.sourceFromHsl(color) ||
                // color is not recognized
                // we default to black as canvas does
                [0, 0, 0, 1];
    }
    /**
     * Adapted from {@link https://gist.github.com/mjackson/5311256 https://gist.github.com/mjackson}
     * @private
     * @param {Number} r Red color value
     * @param {Number} g Green color value
     * @param {Number} b Blue color value
     * @return {TRGBColorSource} Hsl color
     */
    _rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const maxValue = Math.max(r, g, b), minValue = Math.min(r, g, b);
        let h, s;
        const l = (maxValue + minValue) / 2;
        if (maxValue === minValue) {
            h = s = 0; // achromatic
        }
        else {
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
        return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
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
        const source = this.getSource();
        return `rgb(${source[0]},${source[1]},${source[2]})`;
    }
    /**
     * Returns color representation in RGBA format
     * @return {String} ex: rgba(0-255,0-255,0-255,0-1)
     */
    toRgba() {
        const source = this.getSource();
        return `rgba(${source[0]},${source[1]},${source[2]},${source[3]})`;
    }
    /**
     * Returns color representation in HSL format
     * @return {String} ex: hsl(0-360,0%-100%,0%-100%)
     */
    toHsl() {
        const source = this.getSource(), hsl = this._rgbToHsl(source[0], source[1], source[2]);
        return `hsl(${hsl[0]},${hsl[1]}%,${hsl[2]}%)`;
    }
    /**
     * Returns color representation in HSLA format
     * @return {String} ex: hsla(0-360,0%-100%,0%-100%,0-1)
     */
    toHsla() {
        const source = this.getSource(), hsl = this._rgbToHsl(source[0], source[1], source[2]);
        return `hsla(${hsl[0]},${hsl[1]}%,${hsl[2]}%,${source[3]})`;
    }
    /**
     * Returns color representation in HEX format
     * @return {String} ex: FF5555
     */
    toHex() {
        const [r, g, b] = this.getSource();
        return `${hexify(r)}${hexify(g)}${hexify(b)}`;
    }
    /**
     * Returns color representation in HEXA format
     * @return {String} ex: FF5555CC
     */
    toHexa() {
        const source = this.getSource();
        return `${this.toHex()}${hexify(Math.round(source[3] * 255))}`;
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
        const source = this.getSource();
        source[3] = alpha;
        this.setSource(source);
        return this;
    }
    /**
     * Transforms color to its grayscale representation
     * @return {Color} thisArg
     */
    toGrayscale() {
        const source = this.getSource(), average = parseInt((source[0] * 0.3 + source[1] * 0.59 + source[2] * 0.11).toFixed(0), 10), currentAlpha = source[3];
        this.setSource([average, average, average, currentAlpha]);
        return this;
    }
    /**
     * Transforms color to its black and white representation
     * @param {Number} threshold
     * @return {Color} thisArg
     */
    toBlackWhite(threshold) {
        const source = this.getSource(), currentAlpha = source[3];
        let average = Math.round(source[0] * 0.3 + source[1] * 0.59 + source[2] * 0.11);
        average = average < (threshold || 127) ? 0 : 255;
        this.setSource([average, average, average, currentAlpha]);
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
        const [r, g, b, alpha] = this.getSource(), otherAlpha = 0.5, otherSource = otherColor.getSource(), [R, G, B] = [r, g, b].map((value, index) => Math.round(value * (1 - otherAlpha) + otherSource[index] * otherAlpha));
        this.setSource([R, G, B, alpha]);
        return this;
    }
    /**
     * Returns new color object, when given a color in RGB format
     * @memberOf Color
     * @param {String} color Color value ex: rgb(0-255,0-255,0-255)
     * @return {Color}
     */
    static fromRgb(color) {
        return Color.fromRgba(color);
    }
    /**
     * Returns new color object, when given a color in RGBA format
     * @static
     * @function
     * @memberOf Color
     * @param {String} color
     * @return {Color}
     */
    static fromRgba(color) {
        return new Color(Color.sourceFromRgb(color));
    }
    /**
     * Returns array representation (ex: [100, 100, 200, 1]) of a color that's in RGB or RGBA format
     * @memberOf Color
     * @param {String} color Color value ex: rgb(0-255,0-255,0-255), rgb(0%-100%,0%-100%,0%-100%)
     * @return {TRGBAColorSource | undefined} source
     */
    static sourceFromRgb(color) {
        const match = color.match(reRGBa);
        if (match) {
            const r = (parseInt(match[1], 10) / (/%$/.test(match[1]) ? 100 : 1)) *
                (/%$/.test(match[1]) ? 255 : 1), g = (parseInt(match[2], 10) / (/%$/.test(match[2]) ? 100 : 1)) *
                (/%$/.test(match[2]) ? 255 : 1), b = (parseInt(match[3], 10) / (/%$/.test(match[3]) ? 100 : 1)) *
                (/%$/.test(match[3]) ? 255 : 1);
            return [r, g, b, match[4] ? parseFloat(match[4]) : 1];
        }
    }
    /**
     * Returns new color object, when given a color in HSL format
     * @param {String} color Color value ex: hsl(0-260,0%-100%,0%-100%)
     * @memberOf Color
     * @return {Color}
     */
    static fromHsl(color) {
        return Color.fromHsla(color);
    }
    /**
     * Returns new color object, when given a color in HSLA format
     * @static
     * @function
     * @memberOf Color
     * @param {String} color
     * @return {Color}
     */
    static fromHsla(color) {
        return new Color(Color.sourceFromHsl(color));
    }
    /**
     * Returns array representation (ex: [100, 100, 200, 1]) of a color that's in HSL or HSLA format.
     * Adapted from <a href="https://rawgithub.com/mjijackson/mjijackson.github.com/master/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript.html">https://github.com/mjijackson</a>
     * @memberOf Color
     * @param {String} color Color value ex: hsl(0-360,0%-100%,0%-100%) or hsla(0-360,0%-100%,0%-100%, 0-1)
     * @return {TRGBAColorSource | undefined} source
     * @see http://http://www.w3.org/TR/css3-color/#hsl-color
     */
    static sourceFromHsl(color) {
        const match = color.match(reHSLa);
        if (!match) {
            return;
        }
        const h = (((parseFloat(match[1]) % 360) + 360) % 360) / 360, s = parseFloat(match[2]) / (/%$/.test(match[2]) ? 100 : 1), l = parseFloat(match[3]) / (/%$/.test(match[3]) ? 100 : 1);
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        }
        else {
            const q = l <= 0.5 ? l * (s + 1) : l + s - l * s, p = l * 2 - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return [
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255),
            match[4] ? parseFloat(match[4]) : 1,
        ];
    }
    /**
     * Returns new color object, when given a color in HEX format
     * @static
     * @memberOf Color
     * @param {String} color Color value ex: FF5555
     * @return {Color}
     */
    static fromHex(color) {
        return new Color(Color.sourceFromHex(color));
    }
    /**
     * Returns array representation (ex: [100, 100, 200, 1]) of a color that's in HEX format
     * @static
     * @memberOf Color
     * @param {String} color ex: FF5555 or FF5544CC (RGBa)
     * @return {TRGBAColorSource | undefined} source
     */
    static sourceFromHex(color) {
        if (color.match(reHex)) {
            const value = color.slice(color.indexOf('#') + 1), isShortNotation = value.length === 3 || value.length === 4, isRGBa = value.length === 8 || value.length === 4, r = isShortNotation
                ? value.charAt(0) + value.charAt(0)
                : value.substring(0, 2), g = isShortNotation
                ? value.charAt(1) + value.charAt(1)
                : value.substring(2, 4), b = isShortNotation
                ? value.charAt(2) + value.charAt(2)
                : value.substring(4, 6), a = isRGBa
                ? isShortNotation
                    ? value.charAt(3) + value.charAt(3)
                    : value.substring(6, 8)
                : 'FF';
            return [
                parseInt(r, 16),
                parseInt(g, 16),
                parseInt(b, 16),
                parseFloat((parseInt(a, 16) / 255).toFixed(2)),
            ];
        }
    }
}

fabric.Color = Color;

const capValue = (min, value, max) => Math.max(min, Math.min(value, max));

const wrapColorCallback = (callback) => callback &&
    ((rgba, valueRatio, durationRatio) => callback(new Color(rgba).toRgba(), valueRatio, durationRatio));
class ColorAnimation extends AnimationBase {
    constructor({ startValue, endValue, byValue, easing = (timeElapsed, startValue, byValue, duration) => {
        const durationRatio = 1 - Math.cos((timeElapsed / duration) * (Math.PI / 2));
        return startValue + byValue * durationRatio;
    }, onChange, onComplete, abort, ...options }) {
        const startColor = new Color(startValue).getSource();
        const endColor = new Color(endValue).getSource();
        super({
            ...options,
            startValue: startColor,
            byValue: byValue
                ? new Color(byValue)
                    .setAlpha(Array.isArray(byValue) && byValue[3] ? byValue[3] : 0)
                    .getSource()
                : endColor.map((value, i) => value - startColor[i]),
            easing,
            onChange: wrapColorCallback(onChange),
            onComplete: wrapColorCallback(onComplete),
            abort: wrapColorCallback(abort),
        });
    }
    calculate(timeElapsed) {
        const [r, g, b, a] = this.startValue.map((value, i) => this.easing(timeElapsed, value, this.byValue[i], this.duration, i));
        const rgb = [r, g, b].map(Math.round);
        return {
            value: [...rgb, capValue(0, a, 1)],
            changeRatio: 
            // to correctly calculate the change ratio we must find a changed value
            rgb
                .map((p, i) => this.byValue[i] !== 0
                ? Math.abs((p - this.startValue[i]) / this.byValue[i])
                : 0)
                .find((p) => p !== 0) || 0,
        };
    }
}

const isArrayAnimation = (options) => {
    return (Array.isArray(options.startValue) ||
        Array.isArray(options.endValue) ||
        Array.isArray(options.byValue));
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
const animate = (options) => {
    const animation = (isArrayAnimation(options)
        ? new ArrayAnimation(options)
        : new ValueAnimation(options));
    animation.start();
    return animation;
};
const animateColor = (options) => {
    const animation = new ColorAnimation(options);
    animation.start();
    return animation;
};

//@ts-nocheck
/**
 * Wraps element with another element
 * @param {HTMLElement} element Element to wrap
 * @param {HTMLElement|String} wrapper Element to wrap with
 * @param {Object} [attributes] Attributes to set on a wrapper
 * @return {HTMLElement} wrapper
 */
function wrapElement(element, wrapper) {
    if (element.parentNode) {
        element.parentNode.replaceChild(wrapper, element);
    }
    wrapper.appendChild(element);
    return wrapper;
}
/**
 * Returns element scroll offsets
 * @param {HTMLElement} element Element to operate on
 * @return {Object} Object with left/top values
 */
function getScrollLeftTop(element) {
    let left = 0, top = 0;
    const docElement = fabric.document.documentElement, body = fabric.document.body || {
        scrollLeft: 0,
        scrollTop: 0,
    };
    // While loop checks (and then sets element to) .parentNode OR .host
    //  to account for ShadowDOM. We still want to traverse up out of ShadowDOM,
    //  but the .parentNode of a root ShadowDOM node will always be null, instead
    //  it should be accessed through .host. See http://stackoverflow.com/a/24765528/4383938
    while (element && (element.parentNode || element.host)) {
        // Set element to element parent, or 'host' in case of ShadowDOM
        element = element.parentNode || element.host;
        if (element === fabric.document) {
            left = body.scrollLeft || docElement.scrollLeft || 0;
            top = body.scrollTop || docElement.scrollTop || 0;
        }
        else {
            left += element.scrollLeft || 0;
            top += element.scrollTop || 0;
        }
        if (element.nodeType === 1 && element.style.position === 'fixed') {
            break;
        }
    }
    return { left, top };
}
/**
 * Returns offset for a given element
 * @param {HTMLElement} element Element to get offset for
 * @return {Object} Object with "left" and "top" properties
 */
function getElementOffset(element) {
    let box = { left: 0, top: 0 };
    const doc = element && element.ownerDocument, offset = { left: 0, top: 0 }, offsetAttributes = {
        borderLeftWidth: 'left',
        borderTopWidth: 'top',
        paddingLeft: 'left',
        paddingTop: 'top',
    };
    if (!doc) {
        return offset;
    }
    const elemStyle = fabric.document.defaultView.getComputedStyle(element, null);
    for (const attr in offsetAttributes) {
        offset[offsetAttributes[attr]] += parseInt(elemStyle[attr], 10) || 0;
    }
    const docElem = doc.documentElement;
    if (typeof element.getBoundingClientRect !== 'undefined') {
        box = element.getBoundingClientRect();
    }
    const scrollLeftTop = getScrollLeftTop(element);
    return {
        left: box.left + scrollLeftTop.left - (docElem.clientLeft || 0) + offset.left,
        top: box.top + scrollLeftTop.top - (docElem.clientTop || 0) + offset.top,
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
    element.style.userSelect = 'none';
    return element;
}
function getNodeCanvas(element) {
    const impl = fabric.jsdomImplForWrapper(element);
    return impl._canvas || impl._image;
}
function cleanUpJsdomNode(element) {
    if (!fabric.isLikelyNode) {
        return;
    }
    const impl = fabric.jsdomImplForWrapper(element);
    if (impl) {
        impl._image = null;
        impl._canvas = null;
        // unsure if necessary
        impl._currentSrc = null;
        impl._attributes = null;
        impl._classList = null;
    }
}

let id = 0;
const uid = () => id++;

/**
 * Creates canvas element
 * @return {CanvasElement} initialized canvas element
 */
const createCanvasElement = () => fabric.document.createElement('canvas');
/**
 * Creates image element (works on client and node)
 * @return {HTMLImageElement} HTML image element
 */
const createImage = () => fabric.document.createElement('img');
/**
 * since 2.6.0 moved from canvas instance to utility.
 * possibly useless
 * @param {CanvasElement} canvasEl to copy size and content of
 * @param {String} format 'jpeg' or 'png', in some browsers 'webp' is ok too
 * @param {Number} quality <= 1 and > 0
 * @return {String} data url
 */
const toDataURL = (canvasEl, format, quality) => canvasEl.toDataURL(`image/${format}`, quality);
const isHTMLCanvas = (canvas) => {
    return !!canvas && canvas.getContext !== undefined;
};

/**
 * Transforms degrees to radians.
 * @param {TDegree} degrees value in degrees
 * @return {TRadian} value in radians
 */
const degreesToRadians = (degrees) => (degrees * PiBy180);
/**
 * Transforms radians to degrees.
 * @param {TRadian} radians value in radians
 * @return {TDegree} value in degrees
 */
const radiansToDegrees = (radians) => (radians / PiBy180);

/**
 * Apply transform t to point p
 * @param  {Point | IPoint} p The point to transform
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
const invertTransform = (t) => {
    const a = 1 / (t[0] * t[3] - t[1] * t[2]), r = [a * t[3], -a * t[1], -a * t[2], a * t[0], 0, 0], { x, y } = transformPoint(new Point(t[4], t[5]), r, true);
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
const multiplyTransformMatrices = (a, b, is2x2) => [
    a[0] * b[0] + a[2] * b[1],
    a[1] * b[0] + a[3] * b[1],
    a[0] * b[2] + a[2] * b[3],
    a[1] * b[2] + a[3] * b[3],
    is2x2 ? 0 : a[0] * b[4] + a[2] * b[5] + a[4],
    is2x2 ? 0 : a[1] * b[4] + a[3] * b[5] + a[5],
];
/**
 * Decomposes standard 2x3 matrix into transform components
 * @param  {TMat2D} a transformMatrix
 * @return {Object} Components of transform
 */
const qrDecompose = (a) => {
    const angle = Math.atan2(a[1], a[0]), denom = Math.pow(a[0], 2) + Math.pow(a[1], 2), scaleX = Math.sqrt(denom), scaleY = (a[0] * a[3] - a[2] * a[1]) / scaleX, skewX = Math.atan2(a[0] * a[2] + a[1] * a[3], denom);
    return {
        angle: radiansToDegrees(angle),
        scaleX,
        scaleY,
        skewX: radiansToDegrees(skewX),
        skewY: 0,
        translateX: a[4] || 0,
        translateY: a[5] || 0,
    };
};
/**
 * Returns a transform matrix starting from an object of the same kind of
 * the one returned from qrDecompose, useful also if you want to calculate some
 * transformations from an object that is not enlived yet
 * @param  {Object} options
 * @param  {Number} [options.angle] angle in degrees
 * @return {TMat2D} transform matrix
 */
const calcRotateMatrix = ({ angle }) => {
    if (!angle) {
        return iMatrix;
    }
    const theta = degreesToRadians(angle), cosin = cos(theta), sinus = sin(theta);
    return [cosin, sinus, -sinus, cosin, 0, 0];
};
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
const calcDimensionsMatrix = ({ scaleX = 1, scaleY = 1, flipX = false, flipY = false, skewX = 0, skewY = 0, }) => {
    let scaleMatrix = iMatrix;
    if (scaleX !== 1 || scaleY !== 1 || flipX || flipY) {
        scaleMatrix = [
            flipX ? -scaleX : scaleX,
            0,
            0,
            flipY ? -scaleY : scaleY,
            0,
            0,
        ];
    }
    if (skewX) {
        scaleMatrix = multiplyTransformMatrices(scaleMatrix, [1, 0, Math.tan(degreesToRadians(skewX)), 1], true);
    }
    if (skewY) {
        scaleMatrix = multiplyTransformMatrices(scaleMatrix, [1, Math.tan(degreesToRadians(skewY)), 0, 1], true);
    }
    return scaleMatrix;
};
/**
 * Returns a transform matrix starting from an object of the same kind of
 * the one returned from qrDecompose, useful also if you want to calculate some
 * transformations from an object that is not enlived yet
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
const composeMatrix = ({ translateX = 0, translateY = 0, angle = 0, ...otherOptions }) => {
    let matrix = [1, 0, 0, 1, translateX, translateY];
    if (angle) {
        matrix = multiplyTransformMatrices(matrix, calcRotateMatrix({ angle }));
    }
    const scaleMatrix = calcDimensionsMatrix(otherOptions);
    if (scaleMatrix !== iMatrix) {
        matrix = multiplyTransformMatrices(matrix, scaleMatrix);
    }
    return matrix;
};

//@ts-nocheck
function getSvgRegex(arr) {
    return new RegExp('^(' + arr.join('|') + ')\\b', 'i');
}

//@ts-nocheck
const cssRules = {};
const reNum = '(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:[eE][-+]?\\d+)?)';
const commaWsp = '(?:\\s+,?\\s*|,\\s*)';
const reFontDeclaration = new RegExp('(normal|italic)?\\s*(normal|small-caps)?\\s*' +
    '(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\\s*(' +
    reNum +
    '(?:px|cm|mm|em|pt|pc|in)*)(?:\\/(normal|' +
    reNum +
    '))?\\s+(.*)');
const svgValidTagNames = [
    'path',
    'circle',
    'polygon',
    'polyline',
    'ellipse',
    'rect',
    'line',
    'image',
    'text',
], svgViewBoxElements = ['symbol', 'image', 'marker', 'pattern', 'view', 'svg'], svgInvalidAncestors = [
    'pattern',
    'defs',
    'symbol',
    'metadata',
    'clipPath',
    'mask',
    'desc',
], svgValidParents = ['symbol', 'g', 'a', 'svg', 'clipPath', 'defs'], attributesMap = {
    cx: 'left',
    x: 'left',
    r: 'radius',
    cy: 'top',
    y: 'top',
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
}, colorAttributes = {
    stroke: 'strokeOpacity',
    fill: 'fillOpacity',
}, fSize = 'font-size', cPath = 'clip-path';
getSvgRegex(svgValidTagNames);
getSvgRegex(svgViewBoxElements);
getSvgRegex(svgInvalidAncestors);
const svgValidParentsRegEx = getSvgRegex(svgValidParents);

//@ts-nocheck
function rotateMatrix(matrix, args) {
    const cosValue = cos(args[0]), sinValue = sin(args[0]);
    let x = 0, y = 0;
    if (args.length === 3) {
        x = args[1];
        y = args[2];
    }
    matrix[0] = cosValue;
    matrix[1] = sinValue;
    matrix[2] = -sinValue;
    matrix[3] = cosValue;
    matrix[4] = x - (cosValue * x - sinValue * y);
    matrix[5] = y - (sinValue * x + cosValue * y);
}

//@ts-nocheck
function scaleMatrix(matrix, args) {
    const multiplierX = args[0], multiplierY = args.length === 2 ? args[1] : args[0];
    matrix[0] = multiplierX;
    matrix[3] = multiplierY;
}

//@ts-nocheck
function skewMatrix(matrix, args, pos) {
    matrix[pos] = Math.tan(degreesToRadians(args[0]));
}

//@ts-nocheck
function translateMatrix(matrix, args) {
    matrix[4] = args[0];
    if (args.length === 2) {
        matrix[5] = args[1];
    }
}

//@ts-nocheck
// == begin transform regexp
const number = reNum, skewX = '(?:(skewX)\\s*\\(\\s*(' + number + ')\\s*\\))', skewY = '(?:(skewY)\\s*\\(\\s*(' + number + ')\\s*\\))', rotate = '(?:(rotate)\\s*\\(\\s*(' +
    number +
    ')(?:' +
    commaWsp +
    '(' +
    number +
    ')' +
    commaWsp +
    '(' +
    number +
    '))?\\s*\\))', scale = '(?:(scale)\\s*\\(\\s*(' +
    number +
    ')(?:' +
    commaWsp +
    '(' +
    number +
    '))?\\s*\\))', translate = '(?:(translate)\\s*\\(\\s*(' +
    number +
    ')(?:' +
    commaWsp +
    '(' +
    number +
    '))?\\s*\\))', matrix = '(?:(matrix)\\s*\\(\\s*' +
    '(' +
    number +
    ')' +
    commaWsp +
    '(' +
    number +
    ')' +
    commaWsp +
    '(' +
    number +
    ')' +
    commaWsp +
    '(' +
    number +
    ')' +
    commaWsp +
    '(' +
    number +
    ')' +
    commaWsp +
    '(' +
    number +
    ')' +
    '\\s*\\))', transform = '(?:' +
    matrix +
    '|' +
    translate +
    '|' +
    scale +
    '|' +
    rotate +
    '|' +
    skewX +
    '|' +
    skewY +
    ')', transforms = '(?:' + transform + '(?:' + commaWsp + '*' + transform + ')*' + ')', transformList = '^\\s*(?:' + transforms + '?)\\s*$', 
// http://www.w3.org/TR/SVG/coords.html#TransformAttribute
reTransformList = new RegExp(transformList), 
// == end transform regexp
reTransform = new RegExp(transform, 'g');
/**
 * Parses "transform" attribute, returning an array of values
 * @static
 * @function
 * @memberOf fabric
 * @param {String} attributeValue String containing attribute value
 * @return {Array} Array of 6 elements representing transformation matrix
 */
function parseTransformAttribute(attributeValue) {
    // start with identity matrix
    let matrix = iMatrix.concat(), matrices = [];
    // return if no argument was given or
    // an argument does not match transform attribute regexp
    if (!attributeValue ||
        (attributeValue && !reTransformList.test(attributeValue))) {
        return matrix;
    }
    attributeValue.replace(reTransform, function (match) {
        const m = new RegExp(transform).exec(match).filter(function (match) {
            // match !== '' && match != null
            return !!match;
        }), operation = m[1], args = m.slice(2).map(parseFloat);
        switch (operation) {
            case 'translate':
                translateMatrix(matrix, args);
                break;
            case 'rotate':
                args[0] = degreesToRadians(args[0]);
                rotateMatrix(matrix, args);
                break;
            case 'scale':
                scaleMatrix(matrix, args);
                break;
            case 'skewX':
                skewMatrix(matrix, args, 2);
                break;
            case 'skewY':
                skewMatrix(matrix, args, 1);
                break;
            case 'matrix':
                matrix = args;
                break;
        }
        // snapshot current matrix into matrices array
        matrices.push(matrix.concat());
        // reset
        matrix = iMatrix.concat();
    });
    let combinedMatrix = matrices[0];
    while (matrices.length > 1) {
        matrices.shift();
        combinedMatrix = multiplyTransformMatrices(combinedMatrix, matrices[0]);
    }
    return combinedMatrix;
}

/**
 * Populates an object with properties of another object
 * @param {Object} source Source object
 * @param {string[]} properties Properties names to include
 * @returns object populated with the picked keys
 */
const pick = (source, keys = []) => {
    return keys.reduce((o, key) => {
        if (key in source) {
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
 * Converts from attribute value to pixel value if applicable.
 * Returns converted pixels or original value not converted.
 * @param {string} value number to operate on
 * @param {number} fontSize
 * @return {number}
 */
const parseUnit = (value, fontSize) => {
    const unit = /\D{0,2}$/.exec(value), number = parseFloat(value);
    if (!fontSize) {
        fontSize = DEFAULT_SVG_FONT_SIZE;
    }
    const dpi = config.DPI;
    switch (unit?.[0]) {
        case "mm" /* SupportedSVGUnit.mm */:
            return (number * dpi) / 25.4;
        case "cm" /* SupportedSVGUnit.cm */:
            return (number * dpi) / 2.54;
        case "in" /* SupportedSVGUnit.in */:
            return number * dpi;
        case "pt" /* SupportedSVGUnit.pt */:
            return (number * dpi) / 72; // or * 4 / 3
        case "pc" /* SupportedSVGUnit.pc */:
            return ((number * dpi) / 72) * 12; // or * 16
        case "em" /* SupportedSVGUnit.em */:
            return number * fontSize;
        default:
            return number;
    }
};
/**
 * given an array of 6 number returns something like `"matrix(...numbers)"`
 * @param {TMat2D} transform an array with 6 numbers
 * @return {String} transform matrix for svg
 */
const matrixToSVG = (transform) => 'matrix(' +
    transform
        .map((value) => toFixed(value, config.NUM_FRACTION_DIGITS))
        .join(' ') +
    ')';

const linearDefaultCoords = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
};
const radialDefaultCoords = {
    ...linearDefaultCoords,
    r1: 0,
    r2: 0,
};

function parseType(el) {
    return el.nodeName === 'linearGradient' || el.nodeName === 'LINEARGRADIENT'
        ? 'linear'
        : 'radial';
}
function parseGradientUnits(el) {
    return el.getAttribute('gradientUnits') === 'userSpaceOnUse'
        ? 'pixels'
        : 'percentage';
}

const RE_PERCENT = /^(\d+\.\d+)%|(\d+)%$/;
function isPercent(value) {
    return value && RE_PERCENT.test(value);
}
/**
 *
 * @param value
 * @param valueIfNaN
 * @returns ∈ [0, 1]
 */
function parsePercent(value, valueIfNaN) {
    const parsed = typeof value === 'number'
        ? value
        : typeof value === 'string'
            ? parseFloat(value) / (isPercent(value) ? 100 : 1)
            : NaN;
    return capValue(0, ifNaN(parsed, valueIfNaN), 1);
}

const RE_KEY_VALUE_PAIRS = /\s*;\s*/;
const RE_KEY_VALUE = /\s*:\s*/;
function parseColorStop(el, multiplier) {
    let colorValue, opacity;
    const style = el.getAttribute('style');
    if (style) {
        const keyValuePairs = style.split(RE_KEY_VALUE_PAIRS);
        if (keyValuePairs[keyValuePairs.length - 1] === '') {
            keyValuePairs.pop();
        }
        for (let i = keyValuePairs.length; i--;) {
            const [key, value] = keyValuePairs[i]
                .split(RE_KEY_VALUE)
                .map((s) => s.trim());
            if (key === 'stop-color') {
                colorValue = value;
            }
            else if (key === 'stop-opacity') {
                opacity = value;
            }
        }
    }
    const color = new Color(colorValue || el.getAttribute('stop-color') || 'rgb(0,0,0)');
    return {
        offset: parsePercent(el.getAttribute('offset'), 0),
        color: color.toRgb(),
        opacity: ifNaN(parseFloat(opacity || el.getAttribute('stop-opacity') || ''), 1) *
            color.getAlpha() *
            multiplier,
    };
}
function parseColorStops(el, opacityAttr) {
    const colorStops = [], colorStopEls = el.getElementsByTagName('stop'), multiplier = parsePercent(opacityAttr, 1);
    for (let i = colorStopEls.length; i--;) {
        colorStops.push(parseColorStop(colorStopEls[i], multiplier));
    }
    return colorStops;
}

function convertPercentUnitsToValues(valuesToConvert, { width, height, gradientUnits }) {
    let finalValue;
    return Object.keys(valuesToConvert).reduce((acc, prop) => {
        const propValue = valuesToConvert[prop];
        if (propValue === 'Infinity') {
            finalValue = 1;
        }
        else if (propValue === '-Infinity') {
            finalValue = 0;
        }
        else {
            finalValue =
                typeof propValue === 'string' ? parseFloat(propValue) : propValue;
            if (typeof propValue === 'string' && isPercent(propValue)) {
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
        y2: getValue(el, 'y2') || 0,
    };
}
function parseRadialCoords(el) {
    return {
        x1: getValue(el, 'fx') || getValue(el, 'cx') || '50%',
        y1: getValue(el, 'fy') || getValue(el, 'cy') || '50%',
        r1: 0,
        x2: getValue(el, 'cx') || '50%',
        y2: getValue(el, 'cy') || '50%',
        r2: getValue(el, 'r') || '50%',
    };
}
function parseCoords(el, size) {
    return convertPercentUnitsToValues(parseType(el) === 'linear' ? parseLinearCoords(el) : parseRadialCoords(el), {
        ...size,
        gradientUnits: parseGradientUnits(el),
    });
}

//@ts-nocheck
/**
 * Gradient class
 * @class Gradient
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-2#gradients}
 */
class Gradient {
    /**
     * Horizontal offset for aligning gradients coming from SVG when outside pathgroups
     * @type Number
     * @default 0
     */
    offsetX = 0;
    /**
     * Vertical offset for aligning gradients coming from SVG when outside pathgroups
     * @type Number
     * @default 0
     */
    offsetY = 0;
    /**
     * A transform matrix to apply to the gradient before painting.
     * Imported from svg gradients, is not applied with the current transform in the center.
     * Before this transform is applied, the origin point is at the top left corner of the object
     * plus the addition of offsetY and offsetX.
     * @type Number[]
     * @default null
     */
    gradientTransform = null;
    /**
     * coordinates units for coords.
     * If `pixels`, the number of coords are in the same unit of width / height.
     * If set as `percentage` the coords are still a number, but 1 means 100% of width
     * for the X and 100% of the height for the y. It can be bigger than 1 and negative.
     * allowed values pixels or percentage.
     * @type GradientUnits
     * @default 'pixels'
     */
    gradientUnits;
    /**
     * Gradient type linear or radial
     * @type GradientType
     * @default 'linear'
     */
    type;
    /**
     * Defines how the gradient is located in space and spread
     * @type GradientCoords
     */
    coords;
    /**
     * Defines how many colors a gradient has and how they are located on the axis
     * defined by coords
     * @type GradientCoords
     */
    colorStops;
    /**
     * If true, this object will not be exported during the serialization of a canvas
     * @type boolean
     */
    excludeFromExport;
    id;
    constructor({ type = 'linear', gradientUnits = 'pixels', coords, colorStops = [], offsetX = 0, offsetY = 0, gradientTransform, id, }) {
        this.id = id ? `${id}_${uid()}` : uid();
        this.type = type;
        this.gradientUnits = gradientUnits;
        this.gradientTransform = gradientTransform || null;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.coords = {
            ...(this.type === 'radial' ? radialDefaultCoords : linearDefaultCoords),
            ...coords,
        };
        this.colorStops = colorStops.slice();
    }
    // isType<S extends GradientType>(type: S): this is Gradient<S> {
    //   return (this.type as GradientType) === type;
    // }
    /**
     * Adds another colorStop
     * @param {Record<string, string>} colorStop Object with offset and color
     * @return {Gradient} thisArg
     */
    addColorStop(colorStops) {
        for (const position in colorStops) {
            const color = new Color(colorStops[position]);
            this.colorStops.push({
                offset: parseFloat(position),
                color: color.toRgb(),
                opacity: color.getAlpha(),
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
            coords: this.coords,
            colorStops: this.colorStops,
            offsetX: this.offsetX,
            offsetY: this.offsetY,
            gradientUnits: this.gradientUnits,
            gradientTransform: this.gradientTransform
                ? this.gradientTransform.concat()
                : this.gradientTransform,
        };
    }
    /* _TO_SVG_START_ */
    /**
     * Returns SVG representation of an gradient
     * @param {FabricObject} object Object to create a gradient for
     * @return {String} SVG representation of an gradient (linear/radial)
     */
    toSVG(object, { additionalTransform: preTransform } = {}) {
        const markup = [], transform = (this.gradientTransform
            ? this.gradientTransform.concat()
            : iMatrix.concat()), gradientUnits = this.gradientUnits === 'pixels'
            ? 'userSpaceOnUse'
            : 'objectBoundingBox';
        // colorStops must be sorted ascending, and guarded against deep mutations
        const colorStops = this.colorStops
            .map((colorStop) => ({ ...colorStop }))
            .sort((a, b) => {
            return a.offset - b.offset;
        });
        let offsetX = -this.offsetX, offsetY = -this.offsetY;
        if (gradientUnits === 'objectBoundingBox') {
            offsetX /= object.width;
            offsetY /= object.height;
        }
        else {
            offsetX += object.width / 2;
            offsetY += object.height / 2;
        }
        if (object.type === 'path' && this.gradientUnits !== 'percentage') {
            offsetX -= object.pathOffset.x;
            offsetY -= object.pathOffset.y;
        }
        transform[4] -= offsetX;
        transform[5] -= offsetY;
        const commonAttributes = [
            `id="SVGID_${this.id}"`,
            `gradientUnits="${gradientUnits}"`,
            `gradientTransform="${preTransform ? preTransform + ' ' : ''}${matrixToSVG(transform)}"`,
            '',
        ].join(' ');
        if (this.type === 'linear') {
            const { x1, y1, x2, y2 } = this.coords;
            markup.push('<linearGradient ', commonAttributes, ' x1="', x1, '" y1="', y1, '" x2="', x2, '" y2="', y2, '">\n');
        }
        else if (this.type === 'radial') {
            const { x1, y1, x2, y2, r1, r2 } = this
                .coords;
            const needsSwap = r1 > r2;
            // svg radial gradient has just 1 radius. the biggest.
            markup.push('<radialGradient ', commonAttributes, ' cx="', needsSwap ? x1 : x2, '" cy="', needsSwap ? y1 : y2, '" r="', needsSwap ? r1 : r2, '" fx="', needsSwap ? x2 : x1, '" fy="', needsSwap ? y2 : y1, '">\n');
            if (needsSwap) {
                // svg goes from internal to external radius. if radius are inverted, swap color stops.
                colorStops.reverse(); //  mutates array
                colorStops.forEach((colorStop) => {
                    colorStop.offset = 1 - colorStop.offset;
                });
            }
            const minRadius = Math.min(r1, r2);
            if (minRadius > 0) {
                // i have to shift all colorStops and add new one in 0.
                const maxRadius = Math.max(r1, r2), percentageShift = minRadius / maxRadius;
                colorStops.forEach((colorStop) => {
                    colorStop.offset += percentageShift * (1 - colorStop.offset);
                });
            }
        }
        colorStops.forEach(({ color, offset, opacity }) => {
            markup.push('<stop ', 'offset="', offset * 100 + '%', '" style="stop-color:', color, typeof opacity !== 'undefined' ? ';stop-opacity: ' + opacity : ';', '"/>\n');
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
        const coords = this.coords;
        const gradient = this.type === 'linear'
            ? ctx.createLinearGradient(coords.x1, coords.y1, coords.x2, coords.y2)
            : ctx.createRadialGradient(coords.x1, coords.y1, coords.r1, coords.x2, coords.y2, coords.r2);
        this.colorStops.forEach(({ color, opacity, offset }) => {
            gradient.addColorStop(offset, typeof opacity !== 'undefined'
                ? new Color(color).setAlpha(opacity).toRgba()
                : color);
        });
        return gradient;
    }
    /* _FROM_SVG_START_ */
    /**
     * Returns {@link Gradient} instance from an SVG element
     * @static
     * @memberOf Gradient
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
        return new this({
            id: el.getAttribute('id') || undefined,
            type: parseType(el),
            coords: parseCoords(el, {
                width: svgOptions.viewBoxWidth || svgOptions.width,
                height: svgOptions.viewBoxHeight || svgOptions.height,
            }),
            colorStops: parseColorStops(el, svgOptions.opacity),
            gradientUnits,
            gradientTransform: parseTransformAttribute(el.getAttribute('gradientTransform') || ''),
            ...(gradientUnits === 'pixels'
                ? {
                    offsetX: -instance.left,
                    offsetY: -instance.top,
                }
                : {
                    offsetX: 0,
                    offsetY: 0,
                }),
        });
    }
}
fabric.Gradient = Gradient;

/*
 * This Map connects the objects type value with their
 * class implementation. It used from any object to understand which are
 * the classes to enlive when requesting a object.type = 'path' for example.
 * Objects uses it for clipPath, Canvas uses it for everything.
 * This is necessary for generic code to run and enlive instances from serialized representation.
 * You can customize which classes get enlived from SVG parsing using this classRegistry.
 * The Registry start empty and gets filled in depending which files you import.
 * If you want to be able to parse arbitrary SVGs or JSON representation of canvases, coming from
 * differnet sources you will need to import all fabric because you may need all classes.
 */
const JSON$1 = 'json';
const SVG = 'svg';
class ClassRegistry {
    [JSON$1];
    [SVG];
    constructor() {
        this[JSON$1] = new Map();
        this[SVG] = new Map();
    }
    getClass(classType) {
        const constructor = this[JSON$1].get(classType);
        if (!constructor) {
            throw new Error(`No class registered for ${classType}`);
        }
        return constructor;
    }
    setClass(classConstructor, classType) {
        this[JSON$1].set(classType ?? classConstructor.prototype.type, classConstructor);
    }
    getSVGClass(SVGTagName) {
        return this[SVG].get(SVGTagName);
    }
    setSVGClass(classConstructor, SVGTagName) {
        this[SVG].set(SVGTagName ?? classConstructor.prototype.type, classConstructor);
    }
}
const classRegistry = new ClassRegistry();

//@ts-nocheck
/**
 * @see {@link http://fabricjs.com/patterns demo}
 * @see {@link http://fabricjs.com/dynamic-patterns demo}
 */
class Pattern {
    type = 'pattern';
    /**
     * @type TPatternRepeat
     * @defaults
     */
    repeat = 'repeat';
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
    crossOrigin = '';
    /**
     * transform matrix to change the pattern, imported from svgs.
     * @type Array
     * @default
     */
    patternTransform = null;
    /**
     * The actual pixel source of the pattern
     */
    source;
    /**
     * If true, this object will not be exported during the serialization of a canvas
     * @type boolean
     */
    excludeFromExport;
    id;
    /**
     * Constructor
     * @param {Object} [options] Options object
     * @param {option.source} [source] the pattern source, eventually empty or a drawable
     */
    constructor(options = {}) {
        this.id = uid();
        this.setOptions(options);
    }
    setOptions(options) {
        for (const prop in options) {
            this[prop] = options[prop];
        }
    }
    /**
     * @returns true if {@link source} is an <img> element
     */
    isImageSource() {
        return typeof this.source.src === 'string';
    }
    /**
     * @returns true if {@link source} is a <canvas> element
     */
    isCanvasSource() {
        return typeof this.source === 'object' && this.source.toDataURL;
    }
    sourceToString() {
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
    toLive(ctx) {
        if (
        // if the image failed to load, return, and allow rest to continue loading
        !this.source ||
            // if an image
            (this.isImageSource() &&
                (!this.source.complete ||
                    this.source.naturalWidth === 0 ||
                    this.source.naturalHeight === 0))) {
            return '';
        }
        return ctx.createPattern(this.source, this.repeat);
    }
    /**
     * Returns object representation of a pattern
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {object} Object representation of a pattern instance
     */
    toObject(propertiesToInclude) {
        return {
            ...pick(this, propertiesToInclude),
            type: 'pattern',
            source: this.sourceToString(),
            repeat: this.repeat,
            crossOrigin: this.crossOrigin,
            offsetX: toFixed(this.offsetX, config.NUM_FRACTION_DIGITS),
            offsetY: toFixed(this.offsetY, config.NUM_FRACTION_DIGITS),
            patternTransform: this.patternTransform
                ? this.patternTransform.concat()
                : null,
        };
    }
    /* _TO_SVG_START_ */
    /**
     * Returns SVG representation of a pattern
     */
    toSVG({ width, height }) {
        const patternSource = this.source, patternOffsetX = ifNaN(this.offsetX / width, 0), patternOffsetY = ifNaN(this.offsetY / height, 0), patternWidth = this.repeat === 'repeat-y' || this.repeat === 'no-repeat'
            ? 1 + Math.abs(patternOffsetX || 0)
            : ifNaN(patternSource.width / width, 0), patternHeight = this.repeat === 'repeat-x' || this.repeat === 'no-repeat'
            ? 1 + Math.abs(patternOffsetY || 0)
            : ifNaN(patternSource.height / height, 0);
        return [
            `<pattern id="SVGID_${this.id}" x="${patternOffsetX}" y="${patternOffsetY}" width="${patternWidth}" height="${patternHeight}">`,
            `<image x="0" y="0" width="${patternSource.width}" height="${patternSource.height}" xlink:href="${this.sourceToString()}"></image>`,
            `</pattern>`,
            '',
        ].join('\n');
    }
    /* _TO_SVG_END_ */
    static async fromObject({ source, ...serialized }, options) {
        const img = await loadImage(source, {
            ...options,
            crossOrigin: serialized.crossOrigin,
        });
        return new this({ ...serialized, source: img });
    }
}
classRegistry.setClass(Pattern, 'pattern');
fabric.Pattern = Pattern;

/**
 * Loads image element from given url and resolve it, or catch.
 * @param {String} url URL representing an image
 * @param {LoadImageOptions} [options] image loading options
 * @returns {Promise<HTMLImageElement>} the loaded image.
 */
const loadImage = (url, { signal, crossOrigin = null } = {}) => new Promise(function (resolve, reject) {
    if (signal && signal.aborted) {
        return reject(new Error('`options.signal` is in `aborted` state'));
    }
    const img = createImage();
    let abort;
    if (signal) {
        abort = function (err) {
            img.src = '';
            reject(err);
        };
        signal.addEventListener('abort', abort, { once: true });
    }
    const done = function () {
        img.onload = img.onerror = null;
        abort && signal?.removeEventListener('abort', abort);
        resolve(img);
    };
    if (!url) {
        done();
        return;
    }
    img.onload = done;
    img.onerror = function () {
        abort && signal?.removeEventListener('abort', abort);
        reject(new Error('Error loading ' + img.src));
    };
    crossOrigin && (img.crossOrigin = crossOrigin);
    img.src = url;
});
/**
 * Creates corresponding fabric instances from their object representations
 * @param {Object[]} objects Objects to enliven
 * @param {EnlivenObjectOptions} [options]
 * @param {object} [options.namespace] Namespace to get klass "Class" object from
 * @param {(serializedObj: object, instance: FabricObject) => any} [options.reviver] Method for further parsing of object elements,
 * called after each fabric object created.
 * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 * @returns {Promise<FabricObject[]>}
 */
const enlivenObjects = (objects, { signal, reviver = noop } = {}) => new Promise((resolve, reject) => {
    const instances = [];
    signal && signal.addEventListener('abort', reject, { once: true });
    Promise.all(objects.map((obj) => classRegistry
        .getClass(obj.type)
        // @ts-ignore
        .fromObject(obj, {
        signal,
        reviver,
    })
        .then((fabricInstance) => {
        reviver(obj, fabricInstance);
        instances.push(fabricInstance);
        return fabricInstance;
    })))
        .then(resolve)
        .catch((error) => {
        // cleanup
        instances.forEach(function (instance) {
            instance.dispose && instance.dispose();
        });
        reject(error);
    })
        .finally(() => {
        signal && signal.removeEventListener('abort', reject);
    });
});
/**
 * Creates corresponding fabric instances residing in an object, e.g. `clipPath`
 * @param {Object} object with properties to enlive ( fill, stroke, clipPath, path )
 * @param {object} [options]
 * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 * @returns {Promise<Record<string, FabricObject | TFiller | null>>} the input object with enlived values
 */
const enlivenObjectEnlivables = (serializedObject, { signal } = {}) => new Promise((resolve, reject) => {
    const instances = [];
    signal && signal.addEventListener('abort', reject, { once: true });
    // enlive every possible property
    const promises = Object.values(serializedObject).map((value) => {
        if (!value) {
            return value;
        }
        // gradient
        if (value.colorStops) {
            return new Gradient(value);
        }
        // clipPath
        if (value.type) {
            return enlivenObjects([value], { signal }).then(([enlived]) => {
                instances.push(enlived);
                return enlived;
            });
        }
        // pattern
        if (value.source) {
            return Pattern.fromObject(value, { signal }).then((pattern) => {
                instances.push(pattern);
                return pattern;
            });
        }
        return value;
    });
    const keys = Object.keys(serializedObject);
    Promise.all(promises)
        .then((enlived) => {
        return enlived.reduce((acc, instance, index) => {
            acc[keys[index]] = instance;
            return acc;
        }, {});
    })
        .then(resolve)
        .catch((error) => {
        // cleanup
        instances.forEach((instance) => {
            instance.dispose && instance.dispose();
        });
        reject(error);
    })
        .finally(() => {
        signal && signal.removeEventListener('abort', reject);
    });
});

const isFiller = (filler) => {
    return !!filler && filler.toLive !== undefined;
};
const isCollection = (fabricObject) => {
    return !!fabricObject && Array.isArray(fabricObject._objects);
};
const isActiveSelection = (fabricObject) => {
    return !!fabricObject && fabricObject.type === 'activeSelection';
};
const isTextObject = (fabricObject) => {
    // we could use instanceof but that would mean pulling in Text code for a simple check
    // @todo discuss what to do and how to do
    return !!fabricObject && fabricObject.type.includes('text');
};
const isInteractiveTextObject = (fabricObject) => {
    // we could use instanceof but that would mean pulling in Text code for a simple check
    // @todo discuss what to do and how to do
    return !!fabricObject && ['i-text', 'textbox'].includes(fabricObject.type);
};
const isFabricObjectCached = (fabricObject) => {
    return fabricObject.shouldCache() && !!fabricObject._cacheCanvas;
};
const isFabricObjectWithDragSupport = (fabricObject) => {
    return (!!fabricObject &&
        typeof fabricObject.onDragStart ===
            'function');
};

// @ts-nocheck
const CANVAS_INIT_ERROR = 'Could not initialize `canvas` element';
/**
 * Static canvas class
 * @see {@link http://fabricjs.com/static_canvas|StaticCanvas demo}
 * @fires before:render
 * @fires after:render
 * @fires canvas:cleared
 * @fires object:added
 * @fires object:removed
 */
// TODO: fix `EventSpec` inheritance https://github.com/microsoft/TypeScript/issues/26154#issuecomment-1366616260
class StaticCanvas extends createCollectionMixin((CommonMethods)) {
    /**
     * Background color of canvas instance.
     * @type {(String|TFiller)}
     * @default
     */
    backgroundColor;
    /**
     * Background image of canvas instance.
     * since 2.4.0 image caching is active, please when putting an image as background, add to the
     * canvas property a reference to the canvas it is on. Otherwise the image cannot detect the zoom
     * vale. As an alternative you can disable image objectCaching
     * @type FabricObject
     * @default
     */
    backgroundImage;
    /**
     * Overlay color of canvas instance.
     * @since 1.3.9
     * @type {(String|TFiller)}
     * @default
     */
    overlayColor;
    /**
     * Overlay image of canvas instance.
     * since 2.4.0 image caching is active, please when putting an image as overlay, add to the
     * canvas property a reference to the canvas it is on. Otherwise the image cannot detect the zoom
     * vale. As an alternative you can disable image objectCaching
     * @type FabricObject
     * @default
     */
    overlayImage;
    /**
     * Indicates whether toObject/toDatalessObject should include default values
     * if set to false, takes precedence over the object value.
     * @type Boolean
     * @default
     */
    includeDefaultValues;
    /**
     * Indicates whether objects' state should be saved
     * @type Boolean
     * @deprecated
     * @default
     */
    stateful;
    /**
     * Indicates whether {@link add}, {@link insertAt} and {@link remove},
     * {@link moveTo}, {@link clear} and many more, should also re-render canvas.
     * Disabling this option will not give a performance boost when adding/removing a lot of objects to/from canvas at once
     * since the renders are queued and executed one per frame.
     * Disabling is suggested anyway and managing the renders of the app manually is not a big effort ( canvas.requestRenderAll() )
     * Left default to true to do not break documentation and old app, fiddles.
     * @type Boolean
     * @default
     */
    renderOnAddRemove;
    /**
     * Indicates whether object controls (borders/controls) are rendered above overlay image
     * @type Boolean
     * @default
     */
    controlsAboveOverlay;
    /**
     * Indicates whether the browser can be scrolled when using a touchscreen and dragging on the canvas
     * @type Boolean
     * @default
     */
    allowTouchScrolling;
    /**
     * Indicates whether this canvas will use image smoothing, this is on by default in browsers
     * @type Boolean
     * @default
     */
    imageSmoothingEnabled;
    /**
     * The transformation (a Canvas 2D API transform matrix) which focuses the viewport
     * @type Array
     * @example <caption>Default transform</caption>
     * canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
     * @example <caption>Scale by 70% and translate toward bottom-right by 50, without skewing</caption>
     * canvas.viewportTransform = [0.7, 0, 0, 0.7, 50, 50];
     * @default
     */
    viewportTransform;
    /**
     * if set to false background image is not affected by viewport transform
     * @since 1.6.3
     * @type Boolean
     * @todo we should really find a different way to do this
     * @default
     */
    backgroundVpt;
    /**
     * if set to false overlya image is not affected by viewport transform
     * @since 1.6.3
     * @type Boolean
     * @todo we should really find a different way to do this
     * @default
     */
    overlayVpt;
    /**
     * When true, canvas is scaled by devicePixelRatio for better rendering on retina screens
     * @type Boolean
     * @default
     */
    enableRetinaScaling;
    /**
     * Describe canvas element extension over design
     * properties are tl,tr,bl,br.
     * if canvas is not zoomed/panned those points are the four corner of canvas
     * if canvas is viewportTransformed you those points indicate the extension
     * of canvas element in plain untrasformed coordinates
     * The coordinates get updated with @method calcViewportBoundaries.
     */
    vptCoords;
    /**
     * Based on vptCoords and object.aCoords, skip rendering of objects that
     * are not included in current viewport.
     * May greatly help in applications with crowded canvas and use of zoom/pan
     * If One of the corner of the bounding box of the object is on the canvas
     * the objects get rendered.
     * @type Boolean
     * @default
     */
    skipOffscreen;
    /**
     * a fabricObject that, without stroke define a clipping area with their shape. filled in black
     * the clipPath object gets used when the canvas has rendered, and the context is placed in the
     * top left corner of the canvas.
     * clipPath will clip away controls, if you do not want this to happen use controlsAboveOverlay = true
     * @type FabricObject
     */
    clipPath;
    /**
     * A reference to the canvas actual HTMLCanvasElement.
     * Can be use to read the raw pixels, but never write or manipulate
     * @type HTMLCanvasElement
     */
    lowerCanvasEl;
    contextContainer;
    /**
     * Width in virtual/logical pixels of the canvas.
     * The canvas can be larger than width if retina scaling is active
     * @type number
     */
    width;
    /**
     * Height in virtual/logical pixels of the canvas.
     * The canvas can be taller than width if retina scaling is active
     * @type height
     */
    height;
    /**
     * If true the Canvas is in the process or has been disposed/destroyed.
     * No more rendering operation will be executed on this canvas.
     * @type boolean
     */
    destroyed;
    /**
     * Started the process of disposing but not done yet.
     * WIll likely complete the render cycle already scheduled but stopping adding more.
     * @type boolean
     */
    disposed;
    /**
     * Keeps a copy of the canvas style before setting retina scaling and other potions
     * in order to return it to original state on dispose
     * @type string
     */
    _originalCanvasStyle;
    renderAndResetBound;
    requestRenderAllBound;
    _offset;
    hasLostContext;
    nextRenderHandle;
    // reference to
    __cleanupTask;
    add(...objects) {
        const size = super.add(...objects);
        objects.length > 0 && this.renderOnAddRemove && this.requestRenderAll();
        return size;
    }
    insertAt(index, ...objects) {
        const size = super.insertAt(index, ...objects);
        objects.length > 0 && this.renderOnAddRemove && this.requestRenderAll();
        return size;
    }
    remove(...objects) {
        const removed = super.remove(...objects);
        removed.length > 0 && this.renderOnAddRemove && this.requestRenderAll();
        return removed;
    }
    _onObjectAdded(obj) {
        // @ts-ignore;
        this.stateful && obj.setupState();
        if (obj.canvas && obj.canvas !== this) {
            /* _DEV_MODE_START_ */
            console.warn('fabric.Canvas: trying to add an object that belongs to a different canvas.\n' +
                'Resulting to default behavior: removing object from previous canvas and adding to new canvas');
            /* _DEV_MODE_END_ */
            obj.canvas.remove(obj);
        }
        obj._set('canvas', this);
        obj.setCoords();
        this.fire('object:added', { target: obj });
        obj.fire('added', { target: this });
    }
    _onObjectRemoved(obj) {
        obj._set('canvas', undefined);
        this.fire('object:removed', { target: obj });
        obj.fire('removed', { target: this });
    }
    _onStackOrderChanged() {
        this.renderOnAddRemove && this.requestRenderAll();
    }
    constructor(el, options = {}) {
        super();
        this._init(el, options);
    }
    /**
     * @private
     * @param {HTMLCanvasElement | String} el <canvas> element to initialize instance on
     * @param {Object} [options] Options object
     */
    _init(el, options = {}) {
        this.renderAndResetBound = this.renderAndReset.bind(this);
        this.requestRenderAllBound = this.requestRenderAll.bind(this);
        this._initStatic(el, options);
        this._initRetinaScaling();
        this.calcViewportBoundaries();
    }
    /**
     * @private
     * @param {HTMLCanvasElement | String} el <canvas> element to initialize instance on
     * @param {Object} [options] Options object
     */
    _initStatic(el, options = {}) {
        this._objects = [];
        this._createLowerCanvas(el);
        this._originalCanvasStyle = this.lowerCanvasEl.style.cssText;
        this._initOptions(options);
        this.calcOffset();
    }
    /**
     * @private
     */
    _isRetinaScaling() {
        return config.devicePixelRatio > 1 && this.enableRetinaScaling;
    }
    /**
     * @private
     * @return {Number} retinaScaling if applied, otherwise 1;
     */
    getRetinaScaling() {
        return this._isRetinaScaling() ? Math.max(1, config.devicePixelRatio) : 1;
    }
    /**
     * @private
     */
    _initRetinaScaling() {
        if (!this._isRetinaScaling()) {
            return;
        }
        this.__initRetinaScaling(this.lowerCanvasEl, this.contextContainer);
    }
    __initRetinaScaling(canvas, context) {
        const scaleRatio = config.devicePixelRatio;
        canvas.setAttribute('width', (this.width * scaleRatio).toString());
        canvas.setAttribute('height', (this.height * scaleRatio).toString());
        context.scale(scaleRatio, scaleRatio);
    }
    /**
     * Calculates canvas element offset relative to the document
     * This method is also attached as "resize" event handler of window
     */
    calcOffset() {
        return (this._offset = getElementOffset(this.lowerCanvasEl));
    }
    /**
     * @private
     */
    _createCanvasElement() {
        const element = createCanvasElement();
        if (!element) {
            throw new Error(CANVAS_INIT_ERROR);
        }
        if (typeof element.getContext === 'undefined') {
            throw new Error(CANVAS_INIT_ERROR);
        }
        return element;
    }
    /**
     * @private
     * @param {Object} [options] Options object
     */
    _initOptions(options = {}) {
        const lowerCanvasEl = this.lowerCanvasEl;
        this.set(options);
        this.width = this.width || lowerCanvasEl.width || 0;
        this.height = this.height || lowerCanvasEl.height || 0;
        if (!this.lowerCanvasEl.style) {
            return;
        }
        lowerCanvasEl.width = this.width;
        lowerCanvasEl.height = this.height;
        lowerCanvasEl.style.width = this.width + 'px';
        lowerCanvasEl.style.height = this.height + 'px';
        this.viewportTransform = [...this.viewportTransform];
    }
    /**
     * Creates a bottom canvas
     * @private
     * @param {HTMLElement} [canvasEl]
     */
    _createLowerCanvas(canvasEl) {
        // canvasEl === 'HTMLCanvasElement' does not work on jsdom/node
        if (isHTMLCanvas(canvasEl)) {
            this.lowerCanvasEl = canvasEl;
        }
        else {
            this.lowerCanvasEl =
                fabric.document.getElementById(canvasEl) ||
                    canvasEl ||
                    this._createCanvasElement();
        }
        if (this.lowerCanvasEl.hasAttribute('data-fabric')) {
            /* _DEV_MODE_START_ */
            throw new Error('fabric.js: trying to initialize a canvas that has already been initialized');
            /* _DEV_MODE_END_ */
        }
        this.lowerCanvasEl.classList.add('lower-canvas');
        this.lowerCanvasEl.setAttribute('data-fabric', 'main');
        this.contextContainer = this.lowerCanvasEl.getContext('2d');
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
     * Sets width of this canvas instance
     * @param {Number|String} value                         Value to set width to
     * @param {Object}        [options]                     Options object
     * @param {Boolean}       [options.backstoreOnly=false] Set the given dimensions only as canvas backstore dimensions
     * @param {Boolean}       [options.cssOnly=false]       Set the given dimensions only as css dimensions
     * @deprecated will be removed in 7.0
     */
    setWidth(value, options) {
        return this.setDimensions({ width: value }, options);
    }
    /**
     * Sets height of this canvas instance
     * @param {Number|String} value                         Value to set height to
     * @param {Object}        [options]                     Options object
     * @param {Boolean}       [options.backstoreOnly=false] Set the given dimensions only as canvas backstore dimensions
     * @param {Boolean}       [options.cssOnly=false]       Set the given dimensions only as css dimensions
     * @deprecated will be removed in 7.0
     */
    setHeight(value, options) {
        return this.setDimensions({ height: value }, options);
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
    setDimensions(dimensions, { cssOnly = false, backstoreOnly = false } = {}) {
        Object.entries(dimensions).forEach(([prop, value]) => {
            let cssValue = `${value}`;
            if (!cssOnly) {
                this._setBackstoreDimension(prop, value);
                cssValue += 'px';
                this.hasLostContext = true;
            }
            if (!backstoreOnly) {
                this._setCssDimension(prop, cssValue);
            }
        });
        this._initRetinaScaling();
        this.calcOffset();
        if (!cssOnly) {
            this.requestRenderAll();
        }
    }
    /**
     * Helper for setting width/height
     * @private
     * @param {String} prop property (width|height)
     * @param {Number} value value to set property to
     * @todo subclass in canvas and handle upperCanvasEl there.
     */
    _setBackstoreDimension(prop, value) {
        this.lowerCanvasEl[prop] = value;
        this[prop] = value;
    }
    /**
     * Helper for setting css width/height
     * @private
     * @param {String} prop property (width|height)
     * @param {String} value value to set property to
     * @todo subclass in canvas and handle upperCanvasEl there.
     */
    _setCssDimension(prop, value) {
        this.lowerCanvasEl.style[prop] = value;
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
        const activeObject = this._activeObject, backgroundObject = this.backgroundImage, overlayObject = this.overlayImage, len = this._objects.length;
        this.viewportTransform = vpt;
        for (let i = 0; i < len; i++) {
            const object = this._objects[i];
            object.group || object.setCoords();
        }
        if (activeObject) {
            activeObject.setCoords();
        }
        if (backgroundObject) {
            backgroundObject.setCoords();
        }
        if (overlayObject) {
            overlayObject.setCoords();
        }
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
        const before = point, vpt = [...this.viewportTransform];
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
        return this.lowerCanvasEl;
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
        return this.contextContainer;
    }
    /**
     * Clears all contexts (background, main, top) of an instance
     */
    clear() {
        this.remove(...this.getObjects());
        this.backgroundImage = null;
        this.overlayImage = null;
        this.backgroundColor = '';
        this.overlayColor = '';
        this.clearContext(this.contextContainer);
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
        this.renderCanvas(this.contextContainer, this._objects);
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
            this.nextRenderHandle = requestAnimFrame(this.renderAndResetBound);
        }
    }
    /**
     * Calculate the position of the 4 corner of canvas with current viewportTransform.
     * helps to determinate when an object is in the current rendering viewport using
     * object absolute coordinates ( aCoords )
     * @return {Object} points.tl
     * @chainable
     */
    calcViewportBoundaries() {
        const width = this.width, height = this.height, iVpt = invertTransform(this.viewportTransform), a = transformPoint({ x: 0, y: 0 }, iVpt), b = transformPoint({ x: width, y: height }, iVpt), 
        // we don't support vpt flipping
        // but the code is robust enough to mostly work with flipping
        min = a.min(b), max = a.max(b);
        return (this.vptCoords = {
            tl: min,
            tr: new Point(max.x, min.y),
            bl: new Point(min.x, max.y),
            br: max,
        });
    }
    cancelRequestedRender() {
        if (this.nextRenderHandle) {
            cancelAnimFrame(this.nextRenderHandle);
            this.nextRenderHandle = 0;
        }
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
        const v = this.viewportTransform, path = this.clipPath;
        this.calcViewportBoundaries();
        this.clearContext(ctx);
        ctx.imageSmoothingEnabled = this.imageSmoothingEnabled;
        // node-canvas
        // @ts-ignore
        ctx.patternQuality = 'best';
        this.fire('before:render', { ctx: ctx });
        this._renderBackground(ctx);
        ctx.save();
        //apply viewport transform once for all rendering process
        ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
        this._renderObjects(ctx, objects);
        ctx.restore();
        if (!this.controlsAboveOverlay && this.interactive) {
            this.drawControls(ctx);
        }
        if (path) {
            path._set('canvas', this);
            // needed to setup a couple of variables
            path.shouldCache();
            path._transformDone = true;
            path.renderCache({ forClipping: true });
            this.drawClipPathOnCanvas(ctx, path);
        }
        this._renderOverlay(ctx);
        if (this.controlsAboveOverlay && this.interactive) {
            this.drawControls(ctx);
        }
        this.fire('after:render', { ctx: ctx });
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
        const fill = this[`${property}Color`], object = this[`${property}Image`], v = this.viewportTransform, needsVpt = this[`${property}Vpt`];
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
                const m = (fill.gradientTransform ||
                    fill.patternTransform);
                m && ctx.transform(...m);
            }
            ctx.fill();
            ctx.restore();
        }
        if (object) {
            ctx.save();
            if (needsVpt) {
                ctx.transform(...v);
            }
            object.render(ctx);
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
     * Returned value is an object with top and left properties
     * @return {Object} object with "top" and "left" number values
     * @deprecated migrate to `getCenterPoint`
     */
    getCenter() {
        return {
            top: this.height / 2,
            left: this.width / 2,
        };
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
        object.setXY(center, 'center', 'center');
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
     * @return {Object} JSON compatible object
     * @tutorial {@link http://fabricjs.com/fabric-intro-part-3#serialization}
     * @see {@link http://jsfiddle.net/fabricjs/pec86/|jsFiddle demo}
     * @example <caption>JSON without additional properties</caption>
     * var json = canvas.toJSON();
     * @example <caption>JSON with additional properties included</caption>
     * var json = canvas.toJSON(['lockMovementX', 'lockMovementY', 'lockRotation', 'lockScalingX', 'lockScalingY']);
     * @example <caption>JSON without default values</caption>
     * var json = canvas.toJSON();
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
        const clipPathData = clipPath && !clipPath.excludeFromExport
            ? this._toObject(clipPath, methodName, propertiesToInclude)
            : null;
        return {
            version: VERSION,
            ...pick(this, propertiesToInclude),
            objects: this._objects
                .filter((object) => !object.excludeFromExport)
                .map((instance) => this._toObject(instance, methodName, propertiesToInclude)),
            ...this.__serializeBgOverlay(methodName, propertiesToInclude),
            ...(clipPathData ? { clipPath: clipPathData } : null),
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
        const data = {}, bgImage = this.backgroundImage, overlayImage = this.overlayImage, bgColor = this.backgroundColor, overlayColor = this.overlayColor;
        if (isFiller(bgColor)) {
            if (!bgColor.excludeFromExport) {
                data.background = bgColor.toObject(propertiesToInclude);
            }
        }
        else if (bgColor) {
            data.background = bgColor;
        }
        if (isFiller(overlayColor)) {
            if (!overlayColor.excludeFromExport) {
                data.overlay = overlayColor.toObject(propertiesToInclude);
            }
        }
        else if (overlayColor) {
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
     * When true, getSvgTransform() will apply the StaticCanvas.viewportTransform to the SVG transformation. When true,
     * a zoomed canvas will then produce zoomed SVG output.
     * @type Boolean
     * @default
     */
    svgViewportTransformation;
    /**
     * Returns SVG representation of canvas
     * @function
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
     * @tutorial {@link http://fabricjs.com/fabric-intro-part-3#serialization}
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
    toSVG(options = {}, reviver) {
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
        const width = options.width || `${this.width}`, height = options.height || `${this.height}`, NUM_FRACTION_DIGITS = config.NUM_FRACTION_DIGITS, optViewBox = options.viewBox;
        let viewBox;
        if (optViewBox) {
            viewBox = `viewBox="${optViewBox.x} ${optViewBox.y} ${optViewBox.width} ${optViewBox.height}" `;
        }
        else if (this.svgViewportTransformation) {
            const vpt = this.viewportTransform;
            viewBox = `viewBox="${toFixed(-vpt[4] / vpt[0], NUM_FRACTION_DIGITS)} ${toFixed(-vpt[5] / vpt[3], NUM_FRACTION_DIGITS)} ${toFixed(this.width / vpt[0], NUM_FRACTION_DIGITS)} ${toFixed(this.height / vpt[3], NUM_FRACTION_DIGITS)}" `;
        }
        else {
            viewBox = `viewBox="0 0 ${this.width} ${this.height}" `;
        }
        markup.push('<svg ', 'xmlns="http://www.w3.org/2000/svg" ', 'xmlns:xlink="http://www.w3.org/1999/xlink" ', 'version="1.1" ', 'width="', width, '" ', 'height="', height, '" ', viewBox, 'xml:space="preserve">\n', '<desc>Created with Fabric.js ', VERSION, '</desc>\n', '<defs>\n', this.createSVGFontFacesMarkup(), this.createSVGRefElementsMarkup(), this.createSVGClipPathMarkup(options), '</defs>\n');
    }
    createSVGClipPathMarkup(options) {
        const clipPath = this.clipPath;
        if (clipPath) {
            clipPath.clipPathId = `CLIPPATH_${uid()}`;
            return ('<clipPath id="' +
                clipPath.clipPathId +
                '" >\n' +
                this.clipPath.toClipPathSVG(options.reviver) +
                '</clipPath>\n');
        }
        return '';
    }
    /**
     * Creates markup containing SVG referenced elements like patterns, gradients etc.
     * @return {String}
     */
    createSVGRefElementsMarkup() {
        return ['background', 'overlay']
            .map((prop) => {
            const fill = this[`${prop}Color`];
            if (isFiller(fill)) {
                const shouldTransform = this[`${prop}Vpt`], vpt = this.viewportTransform, object = {
                    width: this.width / (shouldTransform ? vpt[0] : 1),
                    height: this.height / (shouldTransform ? vpt[3] : 1),
                };
                return fill.toSVG(object, {
                    additionalTransform: shouldTransform ? matrixToSVG(vpt) : '',
                });
            }
        })
            .join('');
    }
    /**
     * Creates markup containing SVG font faces,
     * font URLs for font faces must be collected by developers
     * and are not extracted from the DOM by fabricjs
     * @param {Array} objects Array of fabric objects
     * @return {String}
     */
    createSVGFontFacesMarkup() {
        const objects = [], fontList = {}, fontPaths = config.fontPaths;
        this._objects.forEach(function add(object) {
            objects.push(object);
            if (isCollection(object)) {
                object._objects.forEach(add);
            }
        });
        objects.forEach((obj) => {
            if (!isTextObject(obj)) {
                return;
            }
            let fontFamily = obj.fontFamily;
            if (fontList[fontFamily] || !fontPaths[fontFamily]) {
                return;
            }
            fontList[fontFamily] = true;
            if (!obj.styles) {
                return;
            }
            Object.values(obj.styles).forEach((styleRow) => {
                Object.values(styleRow).forEach((textCharStyle) => {
                    fontFamily = textCharStyle.fontFamily;
                    if (!fontList[fontFamily] && fontPaths[fontFamily]) {
                        fontList[fontFamily] = true;
                    }
                });
            });
        });
        const fontListMarkup = Object.keys(fontList)
            .map((fontFamily) => `\t\t@font-face {\n\t\t\tfont-family: '${fontFamily}';\n\t\t\tsrc: url('${fontPaths[fontFamily]}');\n\t\t}\n`)
            .join('');
        if (fontListMarkup) {
            return `\t<style type="text/css"><![CDATA[\n${fontListMarkup}]]></style>\n`;
        }
        return '';
    }
    /**
     * @private
     */
    _setSVGObjects(markup, reviver) {
        this.forEachObject((fabricObject) => {
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
            // @ts-ignore TS is so stubbordn that i can't even check if a property exists.
            const repeat = filler.repeat || '', finalWidth = this.width, finalHeight = this.height, shouldInvert = this[`${property}Vpt`], additionalTransform = shouldInvert
                ? matrixToSVG(invertTransform(this.viewportTransform))
                : '';
            markup.push(`<rect transform="${additionalTransform} translate(${finalWidth / 2},${finalHeight / 2})" x="${filler.offsetX - finalWidth / 2}" y="${filler.offsetY - finalHeight / 2}" width="${repeat === 'repeat-y' || repeat === 'no-repeat'
                ? // @ts-ignore
                    filler.source.width
                : finalWidth}" height="${repeat === 'repeat-x' || repeat === 'no-repeat'
                ? // @ts-ignore
                    filler.source.height
                : finalHeight
            // @ts-ignore
            }" fill="url(#SVGID_${filler.id})"></rect>\n`);
        }
        else {
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
     * @tutorial {@link http://fabricjs.com/fabric-intro-part-3#deserialization}
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
    loadFromJSON(json, reviver, { signal } = {}) {
        if (!json) {
            return Promise.reject(new Error('fabric.js: `json` is undefined'));
        }
        // parse json if it wasn't already
        const serialized = typeof json === 'string' ? JSON.parse(json) : json;
        const { objects = [], backgroundImage, background, overlayImage, overlay, clipPath, } = serialized;
        const renderOnAddRemove = this.renderOnAddRemove;
        this.renderOnAddRemove = false;
        return Promise.all([
            enlivenObjects(objects, {
                reviver,
                signal,
            }),
            enlivenObjectEnlivables({
                backgroundImage,
                backgroundColor: background,
                overlayImage,
                overlayColor: overlay,
                clipPath,
            }, { signal }),
        ]).then(([enlived, enlivedMap]) => {
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
     * @returns {Promise<Canvas | StaticCanvas>}
     */
    clone(properties) {
        const data = this.toObject(properties);
        const canvas = this.cloneWithoutData();
        // @ts-ignore
        return canvas.loadFromJSON(data);
    }
    /**
     * Clones canvas instance without cloning existing data.
     * This essentially copies canvas dimensions since loadFromJSON does not affect canvas size.
     * @returns {StaticCanvas}
     */
    cloneWithoutData() {
        const el = createCanvasElement();
        el.width = this.width;
        el.height = this.height;
        // this seems wrong. either Canvas or StaticCanvas
        return new StaticCanvas(el);
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
    toDataURL(options = {}) {
        const { format = "png" /* ImageFormat.png */, quality = 1, multiplier = 1, enableRetinaScaling = false, } = options;
        const finalMultiplier = multiplier * (enableRetinaScaling ? this.getRetinaScaling() : 1);
        return toDataURL(this.toCanvasElement(finalMultiplier, options), format, quality);
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
    toCanvasElement(multiplier = 1, { width, height, left, top, filter } = {}) {
        const scaledWidth = (width || this.width) * multiplier, scaledHeight = (height || this.height) * multiplier, zoom = this.getZoom(), originalWidth = this.width, originalHeight = this.height, newZoom = zoom * multiplier, vp = this.viewportTransform, translateX = (vp[4] - (left || 0)) * multiplier, translateY = (vp[5] - (top || 0)) * multiplier, 
        // @ts-ignore
        originalInteractive = this.interactive, newVp = [newZoom, 0, 0, newZoom, translateX, translateY], originalRetina = this.enableRetinaScaling, canvasEl = createCanvasElement(), 
        // @ts-ignore
        originalContextTop = this.contextTop, objectsToRender = filter ? this._objects.filter(filter) : this._objects;
        canvasEl.width = scaledWidth;
        canvasEl.height = scaledHeight;
        // @ts-ignore
        this.contextTop = null;
        this.enableRetinaScaling = false;
        // @ts-ignore
        this.interactive = false;
        this.viewportTransform = newVp;
        this.width = scaledWidth;
        this.height = scaledHeight;
        this.calcViewportBoundaries();
        this.renderCanvas(canvasEl.getContext('2d'), objectsToRender);
        this.viewportTransform = vp;
        this.width = originalWidth;
        this.height = originalHeight;
        this.calcViewportBoundaries();
        // @ts-ignore
        this.interactive = originalInteractive;
        this.enableRetinaScaling = originalRetina;
        // @ts-ignore
        this.contextTop = originalContextTop;
        return canvasEl;
    }
    /**
     * Waits until rendering has settled to destroy the canvas
     * @returns {Promise<boolean>} a promise resolving to `true` once the canvas has been destroyed or to `false` if the canvas has was already destroyed
     * @throws if aborted by a consequent call
     */
    dispose() {
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
            }
            else if (this.nextRenderHandle) {
                this.__cleanupTask = task;
            }
            else {
                task();
            }
        });
    }
    /**
     * Clears the canvas element, disposes objects and frees resources
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
        this.forEachObject((object) => object.dispose());
        this._objects = [];
        if (this.backgroundImage && this.backgroundImage.dispose) {
            this.backgroundImage.dispose();
        }
        this.backgroundImage = null;
        if (this.overlayImage && this.overlayImage.dispose) {
            this.overlayImage.dispose();
        }
        this.overlayImage = null;
        // @ts-expect-error disposing
        this.contextContainer = null;
        const canvasElement = this.lowerCanvasEl;
        // @ts-expect-error disposing
        this.lowerCanvasEl = undefined;
        // restore canvas style and attributes
        canvasElement.classList.remove('lower-canvas');
        canvasElement.removeAttribute('data-fabric');
        // restore canvas size to original size in case retina scaling was applied
        canvasElement.setAttribute('width', `${this.width}`);
        canvasElement.setAttribute('height', `${this.height}`);
        canvasElement.style.cssText = this._originalCanvasStyle || '';
        this._originalCanvasStyle = undefined;
        cleanUpJsdomNode(canvasElement);
    }
    /**
     * Returns a string representation of an instance
     * @return {String} string representation of an instance
     */
    toString() {
        return `#<Canvas (${this.complexity()}): { objects: ${this._objects.length} }>`;
    }
}
Object.assign(StaticCanvas.prototype, {
    backgroundColor: '',
    backgroundImage: null,
    overlayColor: '',
    overlayImage: null,
    includeDefaultValues: true,
    stateful: false,
    renderOnAddRemove: true,
    controlsAboveOverlay: false,
    allowTouchScrolling: false,
    imageSmoothingEnabled: true,
    viewportTransform: iMatrix.concat(),
    backgroundVpt: true,
    overlayVpt: true,
    enableRetinaScaling: true,
    svgViewportTransformation: true,
    skipOffscreen: true,
    clipPath: undefined,
});
if (fabric.isLikelyNode) {
    Object.assign(StaticCanvas.prototype, {
        createPNGStream() {
            const impl = getNodeCanvas(this.lowerCanvasEl);
            return impl && impl.createPNGStream();
        },
        createJPEGStream(opts) {
            const impl = getNodeCanvas(this.lowerCanvasEl);
            return impl && impl.createJPEGStream(opts);
        },
    });
}
fabric.StaticCanvas = StaticCanvas;

const originOffset = {
    left: -0.5,
    top: -0.5,
    center: 0,
    bottom: 0.5,
    right: 0.5,
};
/**
 * Resolves origin value relative to center
 * @private
 * @param {TOriginX | TOriginY} originValue originX / originY
 * @returns number
 */
const resolveOrigin = (originValue) => typeof originValue === 'string'
    ? originOffset[originValue]
    : originValue - 0.5;

/**
 * Calculates bounding box (left, top, width, height) from given `points`
 * @param {IPoint[]} points
 * @return {Object} Object with left, top, width, height properties
 */
const makeBoundingBoxFromPoints = (points) => {
    if (points.length === 0) {
        return {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
        };
    }
    const { min, max } = points.reduce(({ min, max }, curr) => {
        return {
            min: min.min(curr),
            max: max.max(curr),
        };
    }, { min: new Point(points[0]), max: new Point(points[0]) });
    const size = max.subtract(min);
    return {
        left: min.x,
        top: min.y,
        width: size.x,
        height: size.y,
    };
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
    const { translateX, translateY, scaleX, scaleY, ...otherOptions } = qrDecompose(transform), center = new Point(translateX, translateY);
    object.flipX = false;
    object.flipY = false;
    Object.assign(object, otherOptions);
    object.set({ scaleX, scaleY });
    object.setPositionByOrigin(center, 'center', 'center');
};
/**
 * reset an object transform state to neutral. Top and left are not accounted for
 * @param  {FabricObject} target object to transform
 */
const resetObjectTransform = (target) => {
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
const saveObjectTransform = (target) => ({
    scaleX: target.scaleX,
    scaleY: target.scaleY,
    skewX: target.skewX,
    skewY: target.skewY,
    angle: target.angle,
    left: target.left,
    flipX: target.flipX,
    flipY: target.flipY,
    top: target.top,
});
/**
 * given a width and height, return the size of the bounding box
 * that can contains the box with width/height with applied transform
 * described in options.
 * Use to calculate the boxes around objects for controls.
 * @param {Number} width
 * @param {Number} height
 * @param {Object} options
 * @param {Number} options.scaleX
 * @param {Number} options.scaleY
 * @param {Number} options.skewX
 * @param {Number} options.skewY
 * @returns {Point} size
 */
const sizeAfterTransform = (width, height, options) => {
    const dimX = width / 2, dimY = height / 2, transformMatrix = calcDimensionsMatrix(options), points = [
        new Point(-dimX, -dimY),
        new Point(dimX, -dimY),
        new Point(-dimX, dimY),
        new Point(dimX, dimY),
    ].map((p) => p.transform(transformMatrix)), bbox = makeBoundingBoxFromPoints(points);
    return new Point(bbox.width, bbox.height);
};

// @ts-nocheck
/* _TO_SVG_START_ */
function getSvgColorString(prop, value) {
    if (!value) {
        return `${prop}: none; `;
    }
    else if (value.toLive) {
        return `${prop}: url(#SVGID_${value.id}); `;
    }
    else {
        const color = new Color(value), opacity = color.getAlpha();
        let str = `${prop}: ${color.toRgb()}; `;
        if (opacity !== 1) {
            //change the color in rgb + opacity
            str += `${prop}-opacity: ${opacity.toString()}; `;
        }
        return str;
    }
}
class FabricObjectSVGExportMixin {
    /**
     * When an object is being exported as SVG as a clippath, a reference inside the SVG is needed.
     * This reference is a UID in the fabric namespace and is temporary stored here.
     * @type {String}
     */
    clipPathId;
    /**
     * Returns styles-string for svg-export
     * @param {Boolean} skipShadow a boolean to skip shadow filter output
     * @return {String}
     */
    getSvgStyles(skipShadow) {
        const fillRule = this.fillRule ? this.fillRule : 'nonzero', strokeWidth = this.strokeWidth ? this.strokeWidth : '0', strokeDashArray = this.strokeDashArray
            ? this.strokeDashArray.join(' ')
            : 'none', strokeDashOffset = this.strokeDashOffset ? this.strokeDashOffset : '0', strokeLineCap = this.strokeLineCap ? this.strokeLineCap : 'butt', strokeLineJoin = this.strokeLineJoin ? this.strokeLineJoin : 'miter', strokeMiterLimit = this.strokeMiterLimit ? this.strokeMiterLimit : '4', opacity = typeof this.opacity !== 'undefined' ? this.opacity : '1', visibility = this.visible ? '' : ' visibility: hidden;', filter = skipShadow ? '' : this.getSvgFilter(), fill = getSvgColorString('fill', this.fill), stroke = getSvgColorString('stroke', this.stroke);
        return [
            stroke,
            'stroke-width: ',
            strokeWidth,
            '; ',
            'stroke-dasharray: ',
            strokeDashArray,
            '; ',
            'stroke-linecap: ',
            strokeLineCap,
            '; ',
            'stroke-dashoffset: ',
            strokeDashOffset,
            '; ',
            'stroke-linejoin: ',
            strokeLineJoin,
            '; ',
            'stroke-miterlimit: ',
            strokeMiterLimit,
            '; ',
            fill,
            'fill-rule: ',
            fillRule,
            '; ',
            'opacity: ',
            opacity,
            ';',
            filter,
            visibility,
        ].join('');
    }
    /**
     * Returns styles-string for svg-export
     * @param {Object} style the object from which to retrieve style properties
     * @param {Boolean} useWhiteSpace a boolean to include an additional attribute in the style.
     * @return {String}
     */
    getSvgSpanStyles(style, useWhiteSpace) {
        const term = '; ', fontFamily = style.fontFamily
            ? `font-family: ${style.fontFamily.indexOf("'") === -1 &&
                style.fontFamily.indexOf('"') === -1
                ? `'${style.fontFamily}'`
                : style.fontFamily}${term}`
            : '', strokeWidth = style.strokeWidth
            ? `stroke-width: ${style.strokeWidth}${term}`
            : '', fontSize = style.fontSize ? `font-size: ${style.fontSize}px${term}` : '', fontStyle = style.fontStyle
            ? `font-style: ${style.fontStyle}${term}`
            : '', fontWeight = style.fontWeight
            ? `font-weight: ${style.fontWeight}${term}`
            : '', fill = style.fill ? getSvgColorString('fill', style.fill) : '', stroke = style.stroke ? getSvgColorString('stroke', style.stroke) : '', textDecoration = this.getSvgTextDecoration(style), deltaY = style.deltaY ? `baseline-shift: ${-style.deltaY}; ` : '';
        return [
            stroke,
            strokeWidth,
            fontFamily,
            fontSize,
            fontStyle,
            fontWeight,
            textDecoration
                ? `text-decoration: ${textDecoration}${term}`
                : textDecoration,
            fill,
            deltaY,
            useWhiteSpace ? 'white-space: pre; ' : '',
        ].join('');
    }
    /**
     * Returns text-decoration property for svg-export
     * @param {Object} style the object from which to retrieve style properties
     * @return {String}
     */
    getSvgTextDecoration(style) {
        return ['overline', 'underline', 'line-through']
            .filter((decoration) => style[decoration.replace('-', '')])
            .join(' ');
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
        return [
            this.id ? `id="${this.id}" ` : '',
            this.clipPath ? `clip-path="url(#${this.clipPath.clipPathId})" ` : '',
        ].join('');
    }
    /**
     * Returns transform-string for svg-export
     * @param {Boolean} use the full transform or the single object one.
     * @return {String}
     */
    getSvgTransform(full, additionalTransform = '') {
        const transform = full ? this.calcTransformMatrix() : this.calcOwnMatrix(), svgTransform = `transform="${matrixToSVG(transform)}`;
        return `${svgTransform}${additionalTransform}" `;
    }
    _setSVGBg(textBgRects) {
        if (this.backgroundColor) {
            const NUM_FRACTION_DIGITS = config.NUM_FRACTION_DIGITS;
            textBgRects.push('\t\t<rect ', this._getFillAttributes(this.backgroundColor), ' x="', toFixed(-this.width / 2, NUM_FRACTION_DIGITS), '" y="', toFixed(-this.height / 2, NUM_FRACTION_DIGITS), '" width="', toFixed(this.width, NUM_FRACTION_DIGITS), '" height="', toFixed(this.height, NUM_FRACTION_DIGITS), '"></rect>\n');
        }
    }
    /**
     * Returns svg representation of an instance
     * @param {TSVGReviver} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toSVG(reviver) {
        return this._createBaseSVGMarkup(this._toSVG(reviver), {
            reviver,
        });
    }
    /**
     * Returns svg clipPath representation of an instance
     * @param {TSVGReviver} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toClipPathSVG(reviver) {
        return ('\t' +
            this._createBaseClipPathSVGMarkup(this._toSVG(reviver), {
                reviver,
            }));
    }
    /**
     * @private
     */
    _createBaseClipPathSVGMarkup(objectMarkup, { reviver, additionalTransform = '', } = {}) {
        const commonPieces = [
            this.getSvgTransform(true, additionalTransform),
            this.getSvgCommons(),
        ].join(''), 
        // insert commons in the markup, style and svgCommons
        index = objectMarkup.indexOf('COMMON_PARTS');
        objectMarkup[index] = commonPieces;
        return reviver ? reviver(objectMarkup.join('')) : objectMarkup.join('');
    }
    /**
     * @private
     */
    _createBaseSVGMarkup(objectMarkup, { noStyle, reviver, withShadow, additionalTransform, } = {}) {
        const styleInfo = noStyle ? '' : `style="${this.getSvgStyles()}" `, shadowInfo = withShadow ? `style="${this.getSvgFilter()}" ` : '', clipPath = this.clipPath, vectorEffect = this.strokeUniform
            ? 'vector-effect="non-scaling-stroke" '
            : '', absoluteClipPath = clipPath && clipPath.absolutePositioned, stroke = this.stroke, fill = this.fill, shadow = this.shadow, markup = [], 
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
        const commonPieces = [
            styleInfo,
            vectorEffect,
            noStyle ? '' : this.addPaintOrder(),
            ' ',
            additionalTransform ? `transform="${additionalTransform}" ` : '',
        ].join('');
        objectMarkup[index] = commonPieces;
        if (fill && fill.toLive) {
            markup.push(fill.toSVG(this));
        }
        if (stroke && stroke.toLive) {
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
        return this.paintFirst !== 'fill'
            ? ` paint-order="${this.paintFirst}" `
            : '';
    }
}
/* _TO_SVG_END_ */

//@ts-nocheck
/**
 * **Assuming `T`, `A`, `B` are points on the same line**,
 * check if `T` is contained in `[A, B]` by comparing the direction of the vectors from `T` to `A` and `B`
 * @param T
 * @param A
 * @param B
 * @returns true if `T` is contained
 */
const isContainedInInterval = (T, A, B) => {
    const TA = new Point(T).subtract(A);
    const TB = new Point(T).subtract(B);
    return (Math.sign(TA.x) !== Math.sign(TB.x) || Math.sign(TA.y) !== Math.sign(TB.y));
};
class Intersection {
    points;
    status;
    constructor(status) {
        this.status = status;
        this.points = [];
    }
    /**
     *
     * @param {Point} point
     * @returns
     */
    contains(point) {
        return this.points.some((p) => p.eq(point));
    }
    /**
     * Appends points of intersection
     * @param {...Point[]} points
     * @return {Intersection} thisArg
     * @chainable
     */
    append(...points) {
        this.points = this.points.concat(points.filter((point) => {
            return !this.contains(point);
        }));
        return this;
    }
    /**
     * Checks if a line intersects another
     * @static
     * @param {Point} a1
     * @param {Point} a2
     * @param {Point} b1
     * @param {Point} b2
     * @param {boolean} [aInfinite=true] check segment intersection by passing `false`
     * @param {boolean} [bInfinite=true] check segment intersection by passing `false`
     * @return {Intersection}
     */
    static intersectLineLine(a1, a2, b1, b2, aInfinite = true, bInfinite = true) {
        let result;
        const uaT = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x), ubT = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x), uB = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
        if (uB !== 0) {
            const ua = uaT / uB, ub = ubT / uB;
            if ((aInfinite || (0 <= ua && ua <= 1)) &&
                (bInfinite || (0 <= ub && ub <= 1))) {
                result = new Intersection('Intersection');
                result.append(new Point(a1.x + ua * (a2.x - a1.x), a1.y + ua * (a2.y - a1.y)));
            }
            else {
                result = new Intersection();
            }
        }
        else {
            if (uaT === 0 || ubT === 0) {
                const segmentsCoincide = aInfinite ||
                    bInfinite ||
                    isContainedInInterval(a1, b1, b2) ||
                    isContainedInInterval(a2, b1, b2) ||
                    isContainedInInterval(b1, a1, a2) ||
                    isContainedInInterval(b2, a1, a2);
                result = new Intersection(segmentsCoincide ? 'Coincident' : undefined);
            }
            else {
                result = new Intersection('Parallel');
            }
        }
        return result;
    }
    /**
     * Checks if a segment intersects a line
     * @see {@link intersectLineLine} for line intersection
     * @static
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
     * @static
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
     * @static
     * @see {@link intersectSegmentPolygon} for segment intersection
     * @param {Point} a1 point on line
     * @param {Point} a2 other point on line
     * @param {Point[]} points polygon points
     * @param {boolean} [infinite=true] check segment intersection by passing `false`
     * @return {Intersection}
     */
    static intersectLinePolygon(a1, a2, points, infinite = true) {
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
     * @static
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
     * @static
     * @param {Point[]} points1
     * @param {Point[]} points2
     * @return {Intersection}
     */
    static intersectPolygonPolygon(points1, points2) {
        const result = new Intersection(), length = points1.length;
        const coincidences = [];
        for (let i = 0; i < length; i++) {
            const a1 = points1[i], a2 = points1[(i + 1) % length], inter = Intersection.intersectSegmentPolygon(a1, a2, points2);
            if (inter.status === 'Coincident') {
                coincidences.push(inter);
                result.append(a1, a2);
            }
            else {
                result.append(...inter.points);
            }
        }
        if (coincidences.length > 0 && coincidences.length === points1.length) {
            return new Intersection('Coincident');
        }
        else if (result.points.length > 0) {
            result.status = 'Intersection';
        }
        return result;
    }
    /**
     * Checks if polygon intersects rectangle
     * @static
     * @see {@link intersectPolygonPolygon} for polygon intersection
     * @param {Point[]} points polygon points
     * @param {Point} r1 top left point of rect
     * @param {Point} r2 bottom right point of rect
     * @return {Intersection}
     */
    static intersectPolygonRectangle(points, r1, r2) {
        const min = r1.min(r2), max = r1.max(r2), topRight = new Point(max.x, min.y), bottomLeft = new Point(min.x, max.y);
        return Intersection.intersectPolygonPolygon(points, [
            min,
            topRight,
            max,
            bottomLeft,
        ]);
    }
}
fabric.Intersection = Intersection;

class ObjectOrigin extends CommonMethods {
    /**
     * Top position of an object. Note that by default it's relative to object top. You can change this by setting originY={top/center/bottom}
     * @type Number
     * @default 0
     */
    top;
    /**
     * Left position of an object. Note that by default it's relative to object left. You can change this by setting originX={left/center/right}
     * @type Number
     * @default 0
     */
    left;
    /**
     * Object width
     * @type Number
     * @default
     */
    width;
    /**
     * Object height
     * @type Number
     * @default
     */
    height;
    /**
     * Object scale factor (horizontal)
     * @type Number
     * @default 1
     */
    scaleX;
    /**
     * Object scale factor (vertical)
     * @type Number
     * @default 1
     */
    scaleY;
    /**
     * Angle of skew on x axes of an object (in degrees)
     * @type Number
     * @default 0
     */
    skewX;
    /**
     * Angle of skew on y axes of an object (in degrees)
     * @type Number
     * @default 0
     */
    skewY;
    /**
     * Horizontal origin of transformation of an object (one of "left", "right", "center")
     * See http://jsfiddle.net/1ow02gea/244/ on how originX/originY affect objects in groups
     * @type String
     * @default 'left'
     */
    originX;
    /**
     * Vertical origin of transformation of an object (one of "top", "bottom", "center")
     * See http://jsfiddle.net/1ow02gea/244/ on how originX/originY affect objects in groups
     * @type String
     * @default 'top'
     */
    originY;
    /**
     * Angle of rotation of an object (in degrees)
     * @type Number
     * @default 0
     */
    angle;
    /**
     * Width of a stroke used to render this object
     * @type Number
     * @default 1
     */
    strokeWidth;
    /**
     * When `false`, the stoke width will scale with the object.
     * When `true`, the stroke will always match the exact pixel size entered for stroke width.
     * this Property does not work on Text classes or drawing call that uses strokeText,fillText methods
     * default to false
     * @since 2.6.0
     * @type Boolean
     * @default false
     * @type Boolean
     * @default false
     */
    strokeUniform;
    /**
     * Object containing this object.
     * can influence its size and position
     */
    group;
    _originalOriginX;
    _originalOriginY;
    /**
     * Calculate object bounding box dimensions from its properties scale, skew.
     * @param {Object} [options]
     * @param {Number} [options.scaleX]
     * @param {Number} [options.scaleY]
     * @param {Number} [options.skewX]
     * @param {Number} [options.skewY]
     * @private
     * @returns {Point} dimensions
     */
    _getTransformedDimensions(options = {}) {
        const dimOptions = {
            scaleX: this.scaleX,
            scaleY: this.scaleY,
            skewX: this.skewX,
            skewY: this.skewY,
            width: this.width,
            height: this.height,
            strokeWidth: this.strokeWidth,
            ...options,
        };
        // stroke is applied before/after transformations are applied according to `strokeUniform`
        const strokeWidth = dimOptions.strokeWidth;
        let preScalingStrokeValue = strokeWidth, postScalingStrokeValue = 0;
        if (this.strokeUniform) {
            preScalingStrokeValue = 0;
            postScalingStrokeValue = strokeWidth;
        }
        const dimX = dimOptions.width + preScalingStrokeValue, dimY = dimOptions.height + preScalingStrokeValue, noSkew = dimOptions.skewX === 0 && dimOptions.skewY === 0;
        let finalDimensions;
        if (noSkew) {
            finalDimensions = new Point(dimX * dimOptions.scaleX, dimY * dimOptions.scaleY);
        }
        else {
            finalDimensions = sizeAfterTransform(dimX, dimY, dimOptions);
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
        let x = point.x, y = point.y;
        const offsetX = resolveOrigin(toOriginX) - resolveOrigin(fromOriginX), offsetY = resolveOrigin(toOriginY) - resolveOrigin(fromOriginY);
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
        const p = this.translateToGivenOrigin(point, originX, originY, 'center', 'center');
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
        const p = this.translateToGivenOrigin(center, 'center', 'center', originX, originY);
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
        return this.group
            ? transformPoint(relCenter, this.group.calcTransformMatrix())
            : relCenter;
    }
    /**
     * Returns the center coordinates of the object relative to it's parent
     * @return {Point}
     */
    getRelativeCenterPoint() {
        return this.translateToCenterPoint(new Point(this.left, this.top), this.originX, this.originY);
    }
    /**
     * Returns the coordinates of the object as if it has a different origin
     * @param {TOriginX} originX Horizontal origin: 'left', 'center' or 'right'
     * @param {TOriginY} originY Vertical origin: 'top', 'center' or 'bottom'
     * @return {Point}
     */
    getPointByOrigin(originX, originY) {
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
        const center = this.translateToCenterPoint(pos, originX, originY), position = this.translateToOriginPoint(center, this.originX, this.originY);
        this.set({ left: position.x, top: position.y });
    }
    /**
     * Sets the origin/position of the object to it's center point
     * @private
     * @return {void}
     */
    _setOriginToCenter() {
        this._originalOriginX = this.originX;
        this._originalOriginY = this.originY;
        const center = this.getRelativeCenterPoint();
        this.originX = 'center';
        this.originY = 'center';
        this.left = center.x;
        this.top = center.y;
    }
    /**
     * Resets the origin/position of the object to it's original origin
     * @private
     * @return {void}
     */
    _resetOrigin() {
        if (this._originalOriginX !== undefined &&
            this._originalOriginY !== undefined) {
            const originPoint = this.translateToOriginPoint(this.getRelativeCenterPoint(), this._originalOriginX, this._originalOriginY);
            this.left = originPoint.x;
            this.top = originPoint.y;
            this.originX = this._originalOriginX;
            this.originY = this._originalOriginY;
            this._originalOriginX = undefined;
            this._originalOriginY = undefined;
        }
    }
    /**
     * @private
     */
    _getLeftTopCoords() {
        return this.translateToOriginPoint(this.getRelativeCenterPoint(), 'left', 'top');
    }
}

class ObjectGeometry extends ObjectOrigin {
    /**
     * When true, an object is rendered as flipped horizontally
     * @type Boolean
     * @default false
     */
    flipX;
    /**
     * When true, an object is rendered as flipped vertically
     * @type Boolean
     * @default false
     */
    flipY;
    /**
     * Padding between object and its controlling borders (in pixels)
     * @type Number
     * @default 0
     */
    padding;
    /**
     * Describe object's corner position in canvas object absolute coordinates
     * properties are tl,tr,bl,br and describe the four main corner.
     * each property is an object with x, y, instance of Fabric.Point.
     * The coordinates depends from this properties: width, height, scaleX, scaleY
     * skewX, skewY, angle, strokeWidth, top, left.
     * Those coordinates are useful to understand where an object is. They get updated
     * with lineCoords or oCoords in interactive cases but they do not need to be updated when zoom or panning change.
     * The coordinates get updated with @method setCoords.
     * You can calculate them without updating with @method calcACoords();
     */
    aCoords;
    /**
     * Describe object's corner position in canvas element coordinates.
     * includes padding. Used of object detection.
     * set and refreshed with setCoords.
     * Those could go away
     * @todo investigate how to get rid of those
     */
    lineCoords;
    /**
     * storage cache for object transform matrix
     */
    ownMatrixCache;
    /**
     * storage cache for object full transform matrix
     */
    matrixCache;
    /**
     * A Reference of the Canvas where the object is actually added
     * @type StaticCanvas | Canvas;
     * @default undefined
     * @private
     */
    canvas;
    /**
     * @returns {number} x position according to object's {@link originX} property in canvas coordinate plane
     */
    getX() {
        return this.getXY().x;
    }
    /**
     * @param {number} value x position according to object's {@link originX} property in canvas coordinate plane
     */
    setX(value) {
        this.setXY(this.getXY().setX(value));
    }
    /**
     * @returns {number} y position according to object's {@link originY} property in canvas coordinate plane
     */
    getY() {
        return this.getXY().y;
    }
    /**
     * @param {number} value y position according to object's {@link originY} property in canvas coordinate plane
     */
    setY(value) {
        this.setXY(this.getXY().setY(value));
    }
    /**
     * @returns {number} x position according to object's {@link originX} property in parent's coordinate plane\
     * if parent is canvas then this property is identical to {@link getX}
     */
    getRelativeX() {
        return this.left;
    }
    /**
     * @param {number} value x position according to object's {@link originX} property in parent's coordinate plane\
     * if parent is canvas then this method is identical to {@link setX}
     */
    setRelativeX(value) {
        this.left = value;
    }
    /**
     * @returns {number} y position according to object's {@link originY} property in parent's coordinate plane\
     * if parent is canvas then this property is identical to {@link getY}
     */
    getRelativeY() {
        return this.top;
    }
    /**
     * @param {number} value y position according to object's {@link originY} property in parent's coordinate plane\
     * if parent is canvas then this property is identical to {@link setY}
     */
    setRelativeY(value) {
        this.top = value;
    }
    /**
     * @returns {Point} x position according to object's {@link originX} {@link originY} properties in canvas coordinate plane
     */
    getXY() {
        const relativePosition = this.getRelativeXY();
        return this.group
            ? transformPoint(relativePosition, this.group.calcTransformMatrix())
            : relativePosition;
    }
    /**
     * Set an object position to a particular point, the point is intended in absolute ( canvas ) coordinate.
     * You can specify {@link originX} and {@link originY} values,
     * that otherwise are the object's current values.
     * @example <caption>Set object's bottom left corner to point (5,5) on canvas</caption>
     * object.setXY(new Point(5, 5), 'left', 'bottom').
     * @param {Point} point position in canvas coordinate plane
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
     * @returns {Point} x,y position according to object's {@link originX} {@link originY} properties in parent's coordinate plane
     */
    getRelativeXY() {
        return new Point(this.left, this.top);
    }
    /**
     * As {@link setXY}, but in current parent's coordinate plane (the current group if any or the canvas)
     * @param {Point} point position according to object's {@link originX} {@link originY} properties in parent's coordinate plane
     * @param {TOriginX} [originX] Horizontal origin: 'left', 'center' or 'right'
     * @param {TOriginY} [originY] Vertical origin: 'top', 'center' or 'bottom'
     */
    setRelativeXY(point, originX, originY) {
        this.setPositionByOrigin(point, originX || this.originX, originY || this.originY);
    }
    /**
     * return correct set of coordinates for intersection
     * this will return either aCoords or lineCoords.
     * @param {boolean} absolute will return aCoords if true or lineCoords
     * @param {boolean} calculate will calculate the coords or use the one
     * that are attached to the object instance
     * @return {Object} {tl, tr, br, bl} points
     */
    _getCoords(absolute = false, calculate = false) {
        if (calculate) {
            return absolute ? this.calcACoords() : this.calcLineCoords();
        }
        // swapped this double if in place of setCoords();
        if (!this.aCoords) {
            this.aCoords = this.calcACoords();
        }
        if (!this.lineCoords) {
            this.lineCoords = this.calcLineCoords();
        }
        return absolute ? this.aCoords : this.lineCoords;
    }
    /**
     * return correct set of coordinates for intersection
     * this will return either aCoords or lineCoords.
     * The coords are returned in an array.
     * @param {boolean} absolute will return aCoords if true or lineCoords
     * @param {boolean} calculate will return aCoords if true or lineCoords
     * @return {Array} [tl, tr, br, bl] of points
     */
    getCoords(absolute = false, calculate = false) {
        const { tl, tr, br, bl } = this._getCoords(absolute, calculate);
        const coords = [tl, tr, br, bl];
        if (this.group) {
            const t = this.group.calcTransformMatrix();
            return coords.map((p) => transformPoint(p, t));
        }
        return coords;
    }
    /**
     * Checks if object intersects with an area formed by 2 points
     * @param {Object} pointTL top-left point of area
     * @param {Object} pointBR bottom-right point of area
     * @param {Boolean} [absolute] use coordinates without viewportTransform
     * @param {Boolean} [calculate] use coordinates of current position instead of stored one
     * @return {Boolean} true if object intersects with an area formed by 2 points
     */
    intersectsWithRect(pointTL, pointBR, absolute, calculate) {
        const coords = this.getCoords(absolute, calculate), intersection = Intersection.intersectPolygonRectangle(coords, pointTL, pointBR);
        return intersection.status === 'Intersection';
    }
    /**
     * Checks if object intersects with another object
     * @param {Object} other Object to test
     * @param {Boolean} [absolute] use coordinates without viewportTransform
     * @param {Boolean} [calculate] use coordinates of current position instead of calculating them
     * @return {Boolean} true if object intersects with another object
     */
    intersectsWithObject(other, absolute = false, calculate = false) {
        const intersection = Intersection.intersectPolygonPolygon(this.getCoords(absolute, calculate), other.getCoords(absolute, calculate));
        return (intersection.status === 'Intersection' ||
            intersection.status === 'Coincident' ||
            other.isContainedWithinObject(this, absolute, calculate) ||
            this.isContainedWithinObject(other, absolute, calculate));
    }
    /**
     * Checks if object is fully contained within area of another object
     * @param {Object} other Object to test
     * @param {Boolean} [absolute] use coordinates without viewportTransform
     * @param {Boolean} [calculate] use coordinates of current position instead of store ones
     * @return {Boolean} true if object is fully contained within area of another object
     */
    isContainedWithinObject(other, absolute = false, calculate = false) {
        const points = this.getCoords(absolute, calculate), otherCoords = absolute ? other.aCoords : other.lineCoords, lines = other._getImageLines(otherCoords);
        for (let i = 0; i < 4; i++) {
            if (!other.containsPoint(points[i], lines)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Checks if object is fully contained within area formed by 2 points
     * @param {Object} pointTL top-left point of area
     * @param {Object} pointBR bottom-right point of area
     * @param {Boolean} [absolute] use coordinates without viewportTransform
     * @param {Boolean} [calculate] use coordinates of current position instead of stored one
     * @return {Boolean} true if object is fully contained within area formed by 2 points
     */
    isContainedWithinRect(pointTL, pointBR, absolute, calculate) {
        const boundingRect = this.getBoundingRect(absolute, calculate);
        return (boundingRect.left >= pointTL.x &&
            boundingRect.left + boundingRect.width <= pointBR.x &&
            boundingRect.top >= pointTL.y &&
            boundingRect.top + boundingRect.height <= pointBR.y);
    }
    isOverlapping(other) {
        return (this.intersectsWithObject(other) ||
            this.isContainedWithinObject(other) ||
            other.isContainedWithinObject(this));
    }
    /**
     * Checks if point is inside the object
     * @param {Point} point Point to check against
     * @param {Object} [lines] object returned from @method _getImageLines
     * @param {Boolean} [absolute] use coordinates without viewportTransform
     * @param {Boolean} [calculate] use coordinates of current position instead of stored ones
     * @return {Boolean} true if point is inside the object
     */
    containsPoint(point, lines, absolute = false, calculate = false) {
        const coords = this._getCoords(absolute, calculate), imageLines = lines || this._getImageLines(coords), xPoints = this._findCrossPoints(point, imageLines);
        // if xPoints is odd then point is inside the object
        return xPoints !== 0 && xPoints % 2 === 1;
    }
    /**
     * Checks if object is contained within the canvas with current viewportTransform
     * the check is done stopping at first point that appears on screen
     * @param {Boolean} [calculate] use coordinates of current position instead of .aCoords
     * @return {Boolean} true if object is fully or partially contained within canvas
     */
    isOnScreen(calculate = false) {
        if (!this.canvas) {
            return false;
        }
        const { tl, br } = this.canvas.vptCoords;
        const points = this.getCoords(true, calculate);
        // if some point is on screen, the object is on screen.
        if (points.some((point) => point.x <= br.x &&
            point.x >= tl.x &&
            point.y <= br.y &&
            point.y >= tl.y)) {
            return true;
        }
        // no points on screen, check intersection with absolute coordinates
        if (this.intersectsWithRect(tl, br, true, calculate)) {
            return true;
        }
        return this._containsCenterOfCanvas(tl, br, calculate);
    }
    /**
     * Checks if the object contains the midpoint between canvas extremities
     * Does not make sense outside the context of isOnScreen and isPartiallyOnScreen
     * @private
     * @param {Point} pointTL Top Left point
     * @param {Point} pointBR Top Right point
     * @param {Boolean} calculate use coordinates of current position instead of stored ones
     * @return {Boolean} true if the object contains the point
     */
    _containsCenterOfCanvas(pointTL, pointBR, calculate) {
        // worst case scenario the object is so big that contains the screen
        const centerPoint = pointTL.midPointFrom(pointBR);
        return this.containsPoint(centerPoint, undefined, true, calculate);
    }
    /**
     * Checks if object is partially contained within the canvas with current viewportTransform
     * @param {Boolean} [calculate] use coordinates of current position instead of stored ones
     * @return {Boolean} true if object is partially contained within canvas
     */
    isPartiallyOnScreen(calculate) {
        if (!this.canvas) {
            return false;
        }
        const { tl, br } = this.canvas.vptCoords;
        if (this.intersectsWithRect(tl, br, true, calculate)) {
            return true;
        }
        const allPointsAreOutside = this.getCoords(true, calculate).every((point) => (point.x >= br.x || point.x <= tl.x) &&
            (point.y >= br.y || point.y <= tl.y));
        return (allPointsAreOutside && this._containsCenterOfCanvas(tl, br, calculate));
    }
    /**
     * Method that returns an object with the object edges in it, given the coordinates of the corners
     * @private
     * @param {Object} lineCoords or aCoords Coordinates of the object corners
     */
    _getImageLines({ tl, tr, bl, br }) {
        const lines = {
            topline: {
                o: tl,
                d: tr,
            },
            rightline: {
                o: tr,
                d: br,
            },
            bottomline: {
                o: br,
                d: bl,
            },
            leftline: {
                o: bl,
                d: tl,
            },
        };
        // // debugging
        // if (this.canvas.contextTop) {
        //   this.canvas.contextTop.fillRect(lines.bottomline.d.x, lines.bottomline.d.y, 2, 2);
        //   this.canvas.contextTop.fillRect(lines.bottomline.o.x, lines.bottomline.o.y, 2, 2);
        //
        //   this.canvas.contextTop.fillRect(lines.leftline.d.x, lines.leftline.d.y, 2, 2);
        //   this.canvas.contextTop.fillRect(lines.leftline.o.x, lines.leftline.o.y, 2, 2);
        //
        //   this.canvas.contextTop.fillRect(lines.topline.d.x, lines.topline.d.y, 2, 2);
        //   this.canvas.contextTop.fillRect(lines.topline.o.x, lines.topline.o.y, 2, 2);
        //
        //   this.canvas.contextTop.fillRect(lines.rightline.d.x, lines.rightline.d.y, 2, 2);
        //   this.canvas.contextTop.fillRect(lines.rightline.o.x, lines.rightline.o.y, 2, 2);
        // }
        return lines;
    }
    /**
     * Helper method to determine how many cross points are between the 4 object edges
     * and the horizontal line determined by a point on canvas
     * @private
     * @param {Point} point Point to check
     * @param {Object} lines Coordinates of the object being evaluated
     * @return {number} number of crossPoint
     */
    _findCrossPoints(point, lines) {
        let xcount = 0;
        for (const lineKey in lines) {
            let xi;
            const iLine = lines[lineKey];
            // optimization 1: line below point. no cross
            if (iLine.o.y < point.y && iLine.d.y < point.y) {
                continue;
            }
            // optimization 2: line above point. no cross
            if (iLine.o.y >= point.y && iLine.d.y >= point.y) {
                continue;
            }
            // optimization 3: vertical line case
            if (iLine.o.x === iLine.d.x && iLine.o.x >= point.x) {
                xi = iLine.o.x;
            }
            // calculate the intersection point
            else {
                const b1 = 0;
                const b2 = (iLine.d.y - iLine.o.y) / (iLine.d.x - iLine.o.x);
                const a1 = point.y - b1 * point.x;
                const a2 = iLine.o.y - b2 * iLine.o.x;
                xi = -(a1 - a2) / (b1 - b2);
            }
            // don't count xi < point.x cases
            if (xi >= point.x) {
                xcount += 1;
            }
            // optimization 4: specific for square images
            if (xcount === 2) {
                break;
            }
        }
        return xcount;
    }
    /**
     * Returns coordinates of object's bounding rectangle (left, top, width, height)
     * the box is intended as aligned to axis of canvas.
     * @param {Boolean} [absolute] use coordinates without viewportTransform
     * @param {Boolean} [calculate] use coordinates of current position instead of .lineCoords / .aCoords
     * @return {Object} Object with left, top, width, height properties
     */
    getBoundingRect(absolute, calculate) {
        return makeBoundingBoxFromPoints(this.getCoords(absolute, calculate));
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
        this._set('scaleX', value);
        this._set('scaleY', value);
        this.setCoords();
    }
    /**
     * Scales an object to a given width, with respect to bounding box (scaling by x/y equally)
     * @param {Number} value New width value
     * @param {Boolean} absolute ignore viewport
     * @return {void}
     */
    scaleToWidth(value, absolute) {
        // adjust to bounding rect factor so that rotated shapes would fit as well
        const boundingRectFactor = this.getBoundingRect(absolute).width / this.getScaledWidth();
        return this.scale(value / this.width / boundingRectFactor);
    }
    /**
     * Scales an object to a given height, with respect to bounding box (scaling by x/y equally)
     * @param {Number} value New height value
     * @param {Boolean} absolute ignore viewport
     * @return {void}
     */
    scaleToHeight(value, absolute = false) {
        // adjust to bounding rect factor so that rotated shapes would fit as well
        const boundingRectFactor = this.getBoundingRect(absolute).height / this.getScaledHeight();
        return this.scale(value / this.height / boundingRectFactor);
    }
    getCanvasRetinaScaling() {
        return this.canvas?.getRetinaScaling() || 1;
    }
    /**
     * Returns the object angle relative to canvas counting also the group property
     * @returns {TDegree}
     */
    getTotalAngle() {
        return this.group
            ? qrDecompose(this.calcTransformMatrix()).angle
            : this.angle;
    }
    /**
     * return the coordinate of the 4 corners of the bounding box in HTMLCanvasElement coordinates
     * used for bounding box interactivity with the mouse
     * @returns {TCornerPoint}
     */
    calcLineCoords() {
        const vpt = this.getViewportTransform(), padding = this.padding, angle = degreesToRadians(this.getTotalAngle()), cosP = cos(angle) * padding, sinP = sin(angle) * padding, cosPSinP = cosP + sinP, cosPMinusSinP = cosP - sinP, { tl, tr, bl, br } = this.calcACoords();
        const lineCoords = {
            tl: transformPoint(tl, vpt),
            tr: transformPoint(tr, vpt),
            bl: transformPoint(bl, vpt),
            br: transformPoint(br, vpt),
        };
        if (padding) {
            lineCoords.tl.x -= cosPMinusSinP;
            lineCoords.tl.y -= cosPSinP;
            lineCoords.tr.x += cosPSinP;
            lineCoords.tr.y -= cosPMinusSinP;
            lineCoords.bl.x -= cosPSinP;
            lineCoords.bl.y += cosPMinusSinP;
            lineCoords.br.x += cosPMinusSinP;
            lineCoords.br.y += cosPSinP;
        }
        return lineCoords;
    }
    /**
     * Retrieves viewportTransform from Object's canvas if possible
     * @method getViewportTransform
     * @memberOf FabricObject.prototype
     * @return {TMat2D}
     */
    getViewportTransform() {
        return this.canvas?.viewportTransform || iMatrix.concat();
    }
    /**
     * Calculates the coordinates of the 4 corner of the bbox, in absolute coordinates.
     * those never change with zoom or viewport changes.
     * @return {TCornerPoint}
     */
    calcACoords() {
        const rotateMatrix = calcRotateMatrix({ angle: this.angle }), center = this.getRelativeCenterPoint(), translateMatrix = [1, 0, 0, 1, center.x, center.y], finalMatrix = multiplyTransformMatrices(translateMatrix, rotateMatrix), dim = this._getTransformedDimensions(), w = dim.x / 2, h = dim.y / 2;
        return {
            // corners
            tl: transformPoint({ x: -w, y: -h }, finalMatrix),
            tr: transformPoint({ x: w, y: -h }, finalMatrix),
            bl: transformPoint({ x: -w, y: h }, finalMatrix),
            br: transformPoint({ x: w, y: h }, finalMatrix),
        };
    }
    /**
     * Sets corner and controls position coordinates based on current angle, width and height, left and top.
     * aCoords are used to quickly find an object on the canvas
     * lineCoords are used to quickly find object during pointer events.
     * See {@link https://github.com/fabricjs/fabric.js/wiki/When-to-call-setCoords} and {@link http://fabricjs.com/fabric-gotchas}
     * @param {Boolean} [skipCorners] skip calculation of aCoord, lineCoords.
     * @return {void}
     */
    setCoords() {
        this.aCoords = this.calcACoords();
        // in case we are in a group, for how the inner group target check works,
        // lineCoords are exactly aCoords. Since the vpt gets absorbed by the normalized pointer.
        this.lineCoords = this.group ? this.aCoords : this.calcLineCoords();
    }
    transformMatrixKey(skipGroup = false) {
        const sep = '_';
        let prefix = '';
        if (!skipGroup && this.group) {
            prefix = this.group.transformMatrixKey(skipGroup) + sep;
        }
        return (prefix +
            this.top +
            sep +
            this.left +
            sep +
            this.scaleX +
            sep +
            this.scaleY +
            sep +
            this.skewX +
            sep +
            this.skewY +
            sep +
            this.angle +
            sep +
            this.originX +
            sep +
            this.originY +
            sep +
            this.width +
            sep +
            this.height +
            sep +
            this.strokeWidth +
            this.flipX +
            this.flipY);
    }
    /**
     * calculate transform matrix that represents the current transformations from the
     * object's properties.
     * @param {Boolean} [skipGroup] return transform matrix for object not counting parent transformations
     * There are some situation in which this is useful to avoid the fake rotation.
     * @return {TMat2D} transform matrix for the object
     */
    calcTransformMatrix(skipGroup = false) {
        let matrix = this.calcOwnMatrix();
        if (skipGroup || !this.group) {
            return matrix;
        }
        const key = this.transformMatrixKey(skipGroup), cache = this.matrixCache;
        if (cache && cache.key === key) {
            return cache.value;
        }
        if (this.group) {
            matrix = multiplyTransformMatrices(this.group.calcTransformMatrix(false), matrix);
        }
        this.matrixCache = {
            key,
            value: matrix,
        };
        return matrix;
    }
    /**
     * calculate transform matrix that represents the current transformations from the
     * object's properties, this matrix does not include the group transformation
     * @return {TMat2D} transform matrix for the object
     */
    calcOwnMatrix() {
        const key = this.transformMatrixKey(true), cache = this.ownMatrixCache;
        if (cache && cache.key === key) {
            return cache.value;
        }
        const center = this.getRelativeCenterPoint(), options = {
            angle: this.angle,
            translateX: center.x,
            translateY: center.y,
            scaleX: this.scaleX,
            scaleY: this.scaleY,
            skewX: this.skewX,
            skewY: this.skewY,
            flipX: this.flipX,
            flipY: this.flipY,
        }, value = composeMatrix(options);
        this.ownMatrixCache = {
            key,
            value,
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
        return this._getTransformedDimensions(options)
            .transform(this.getViewportTransform(), true)
            .scalarAdd(2 * this.padding);
    }
}

class StackedObject extends ObjectGeometry {
    /**
     * Checks if object is descendant of target
     * Should be used instead of @link {Collection.contains} for performance reasons
     * @param {TAncestor} target
     * @returns {boolean}
     */
    isDescendantOf(target) {
        let parent = this.group || this.canvas;
        while (parent) {
            if (target === parent) {
                return true;
            }
            else if (parent instanceof fabric.StaticCanvas) {
                //  happens after all parents were traversed through without a match
                return false;
            }
            parent = parent.group || parent.canvas;
        }
        return false;
    }
    /**
     *
     * @param {boolean} [strict] returns only ancestors that are objects (without canvas)
     * @returns {Ancestors} ancestors from bottom to top
     */
    getAncestors(strict) {
        const ancestors = [];
        let parent = this.group || (strict ? undefined : this.canvas);
        while (parent) {
            ancestors.push(parent);
            parent =
                parent.group ||
                    (strict ? undefined : parent.canvas);
        }
        return ancestors;
    }
    /**
     * Compare ancestors
     *
     * @param {StackedObject} other
     * @param {boolean} [strict] finds only ancestors that are objects (without canvas)
     * @returns {AncestryComparison} an object that represent the ancestry situation.
     */
    findCommonAncestors(other, strict) {
        if (this === other) {
            return {
                fork: [],
                otherFork: [],
                common: [this, ...this.getAncestors(strict)],
            };
        }
        const ancestors = this.getAncestors(strict);
        const otherAncestors = other.getAncestors(strict);
        //  if `this` has no ancestors and `this` is top ancestor of `other` we must handle the following case
        if (ancestors.length === 0 &&
            otherAncestors.length > 0 &&
            this === otherAncestors[otherAncestors.length - 1]) {
            return {
                fork: [],
                otherFork: [
                    other,
                    ...otherAncestors.slice(0, otherAncestors.length - 1),
                ],
                common: [this],
            };
        }
        //  compare ancestors
        for (let i = 0, ancestor; i < ancestors.length; i++) {
            ancestor = ancestors[i];
            if (ancestor === other) {
                return {
                    fork: [this, ...ancestors.slice(0, i)],
                    otherFork: [],
                    common: ancestors.slice(i),
                };
            }
            for (let j = 0; j < otherAncestors.length; j++) {
                if (this === otherAncestors[j]) {
                    return {
                        fork: [],
                        otherFork: [other, ...otherAncestors.slice(0, j)],
                        common: [this, ...ancestors],
                    };
                }
                if (ancestor === otherAncestors[j]) {
                    return {
                        fork: [this, ...ancestors.slice(0, i)],
                        otherFork: [other, ...otherAncestors.slice(0, j)],
                        common: ancestors.slice(i),
                    };
                }
            }
        }
        // nothing shared
        return {
            fork: [this, ...ancestors],
            otherFork: [other, ...otherAncestors],
            common: [],
        };
    }
    /**
     *
     * @param {StackedObject} other
     * @param {boolean} [strict] checks only ancestors that are objects (without canvas)
     * @returns {boolean}
     */
    hasCommonAncestors(other, strict) {
        const commonAncestors = this.findCommonAncestors(other, strict);
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
        if (!ancestorData) {
            return undefined;
        }
        if (ancestorData.fork.includes(other)) {
            return true;
        }
        if (ancestorData.otherFork.includes(this)) {
            return false;
        }
        const firstCommonAncestor = ancestorData.common[0];
        if (!firstCommonAncestor) {
            return undefined;
        }
        const headOfFork = ancestorData.fork.pop(), headOfOtherFork = ancestorData.otherFork.pop(), thisIndex = firstCommonAncestor._objects.indexOf(headOfFork), otherIndex = firstCommonAncestor._objects.indexOf(headOfOtherFork);
        return thisIndex > -1 && thisIndex > otherIndex;
    }
}

class AnimatableObject extends StackedObject {
    /**
     * Animation duration (in ms) for fx* methods
     * @type Number
     * @default
     */
    FX_DURATION;
    /**
     * List of properties to consider for animating colors.
     * @type String[]
     */
    colorProperties;
    animate(arg0, arg1, arg2) {
        const animatable = (typeof arg0 === 'string' ? { [arg0]: arg1 } : arg0);
        const keys = Object.keys(animatable);
        const options = (typeof arg0 === 'string' ? arg2 : arg1);
        return keys.map((key, index) => this._animate(key, animatable[key], index === keys.length - 1
            ? options
            : { ...options, onChange: undefined, onComplete: undefined }));
    }
    /**
     * @private
     * @param {String} key Property to animate
     * @param {String} to Value to animate to
     * @param {Object} [options] Options object
     */
    _animate(key, to, options = {}) {
        const path = key.split('.');
        const propIsColor = this.colorProperties.includes(path[path.length - 1]);
        const currentValue = path.reduce((deep, key) => deep[key], this);
        if (!propIsColor && typeof to === 'string') {
            // check for things like +=50
            // which should animate so that the thing moves by 50 units in the positive direction
            to = to.includes('=')
                ? currentValue + parseFloat(to.replace('=', ''))
                : parseFloat(to);
        }
        const animationOptions = {
            target: this,
            startValue: options.startValue ??
                // backward compat
                options.from ??
                currentValue,
            endValue: to,
            // `byValue` takes precedence over `endValue`
            byValue: options.byValue ??
                // backward compat
                options.by,
            easing: options.easing,
            duration: options.duration,
            abort: options.abort?.bind(this),
            onChange: (value, valueRatio, durationRatio) => {
                path.reduce((deep, key, index) => {
                    if (index === path.length - 1) {
                        deep[key] = value;
                    }
                    return deep[key];
                }, this);
                options.onChange &&
                    // @ts-expect-error generic callback arg0 is wrong
                    options.onChange(value, valueRatio, durationRatio);
            },
            onComplete: (value, valueRatio, durationRatio) => {
                this.setCoords();
                options.onComplete &&
                    // @ts-expect-error generic callback arg0 is wrong
                    options.onComplete(value, valueRatio, durationRatio);
            },
        };
        if (propIsColor) {
            return animateColor(animationOptions);
        }
        else {
            return animate(animationOptions);
        }
    }
    /**
     * @private
     * @return {Number} angle value
     */
    _getAngleValueForStraighten() {
        const angle = this.angle % 360;
        if (angle > 0) {
            return Math.round((angle - 1) / 90) * 90;
        }
        return Math.round(angle / 90) * 90;
    }
    /**
     * Straightens an object (rotating it from current angle to one of 0, 90, 180, 270, etc. depending on which is closer)
     */
    straighten() {
        this.rotate(this._getAngleValueForStraighten());
    }
    /**
     * Same as {@link straighten} but with animation
     * @param {Object} callbacks Object with callback functions
     * @param {Function} [callbacks.onComplete] Invoked on completion
     * @param {Function} [callbacks.onChange] Invoked on every step of animation
     */
    fxStraighten(callbacks = {}) {
        const onComplete = callbacks.onComplete || noop, onChange = callbacks.onChange || noop;
        return animate({
            target: this,
            startValue: this.angle,
            endValue: this._getAngleValueForStraighten(),
            duration: this.FX_DURATION,
            onChange: (value) => {
                this.rotate(value);
                onChange(value);
            },
            onComplete: () => {
                this.setCoords();
                onComplete();
            },
        });
    }
}

new Point(1, 0);
/**
 * Rotates `vector` with `radians`
 * @param {Point} vector The vector to rotate (x and y)
 * @param {Number} radians The radians of the angle for the rotation
 * @return {Point} The new rotated point
 */
const rotateVector = (vector, radians) => vector.rotate(radians);

class Shadow {
    /**
     * Shadow color
     * @type String
     * @default
     */
    color;
    /**
     * Shadow blur
     * @type Number
     */
    blur;
    /**
     * Shadow horizontal offset
     * @type Number
     * @default
     */
    offsetX;
    /**
     * Shadow vertical offset
     * @type Number
     * @default
     */
    offsetY;
    /**
     * Whether the shadow should affect stroke operations
     * @type Boolean
     * @default
     */
    affectStroke;
    /**
     * Indicates whether toObject should include default values
     * @type Boolean
     * @default
     */
    includeDefaultValues;
    /**
     * When `false`, the shadow will scale with the object.
     * When `true`, the shadow's offsetX, offsetY, and blur will not be affected by the object's scale.
     * default to false
     * @type Boolean
     * @default
     */
    nonScaling;
    id;
    constructor(arg0) {
        const options = typeof arg0 === 'string' ? Shadow.parseShadow(arg0) : arg0;
        for (const prop in options) {
            // @ts-expect-error for loops are so messy in TS
            this[prop] = options[prop];
        }
        this.id = uid();
    }
    /**
     * @param {String} value Shadow value to parse
     * @return {Object} Shadow object with color, offsetX, offsetY and blur
     */
    static parseShadow(value) {
        const shadowStr = value.trim(), [__, offsetX = 0, offsetY = 0, blur = 0] = (Shadow.reOffsetsAndBlur.exec(shadowStr) || []).map((value) => parseFloat(value) || 0), color = (shadowStr.replace(Shadow.reOffsetsAndBlur, '') || 'rgb(0,0,0)').trim();
        return {
            color,
            offsetX,
            offsetY,
            blur,
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
        const offset = rotateVector(new Point(this.offsetX, this.offsetY), degreesToRadians(-object.angle)), BLUR_BOX = 20, color = new Color(this.color);
        let fBoxX = 40, fBoxY = 40;
        if (object.width && object.height) {
            //http://www.w3.org/TR/SVG/filters.html#FilterEffectsRegion
            // we add some extra space to filter box to contain the blur ( 20 )
            fBoxX =
                toFixed((Math.abs(offset.x) + this.blur) / object.width, config.NUM_FRACTION_DIGITS) *
                    100 +
                    BLUR_BOX;
            fBoxY =
                toFixed((Math.abs(offset.y) + this.blur) / object.height, config.NUM_FRACTION_DIGITS) *
                    100 +
                    BLUR_BOX;
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
        };
        if (this.includeDefaultValues) {
            return data;
        }
        const defaults = Shadow.prototype;
        const out = {};
        for (const key in data) {
            if (data[key] !== defaults[key]) {
                out[key] = data[key];
            }
        }
        return out;
    }
    /**
     * Regex matching shadow offsetX, offsetY and blur (ex: "2px 2px 10px rgba(0,0,0,0.2)", "rgb(0,255,0) 2px 2px")
     */
    // eslint-disable-next-line max-len
    static reOffsetsAndBlur = /(?:\s|^)(-?\d+(?:\.\d*)?(?:px)?(?:\s?|$))?(-?\d+(?:\.\d*)?(?:px)?(?:\s?|$))?(\d+(?:\.\d*)?(?:px)?)?(?:\s?|$)(?:$|\s)/;
}
const shadowDefaultValues = {
    color: 'rgb(0,0,0)',
    blur: 0,
    offsetX: 0,
    offsetY: 0,
    affectStroke: false,
    includeDefaultValues: true,
    nonScaling: false,
};
Object.assign(Shadow.prototype, shadowDefaultValues);
fabric.Shadow = Shadow;

//@ts-nocheck
/**
 * Copies all enumerable properties of one js object to another
 * this does not and cannot compete with generic utils.
 * Does not clone or extend FabricObject subclasses.
 * This is mostly for internal use and has extra handling for fabricJS objects
 * it skips the canvas and group properties in deep cloning.
 * @param {Object} destination Where to copy to
 * @param {Object} source Where to copy from
 * @param {Boolean} [deep] Whether to extend nested objects
 * @return {Object}
 */
const extend = (destination, source, deep) => {
    // the deep clone is for internal use, is not meant to avoid
    // javascript traps or cloning html element or self referenced objects.
    if (deep) {
        if (!fabric.isLikelyNode && source instanceof Element) {
            // avoid cloning deep images, canvases,
            destination = source;
        }
        else if (Array.isArray(source)) {
            destination = [];
            for (let i = 0, len = source.length; i < len; i++) {
                destination[i] = extend({}, source[i], deep);
            }
        }
        else if (source && typeof source === 'object') {
            for (const property in source) {
                if (property === 'canvas' || property === 'group') {
                    // we do not want to clone this props at all.
                    // we want to keep the keys in the copy
                    destination[property] = null;
                }
                else if (Object.prototype.hasOwnProperty.call(source, property)) {
                    destination[property] = extend({}, source[property], deep);
                }
            }
        }
        else {
            // this sounds odd for an extend but is ok for recursive use
            destination = source;
        }
    }
    else {
        for (const property in source) {
            destination[property] = source[property];
        }
    }
    return destination;
};
/**
 * Creates an empty object and copies all enumerable properties of another object to it
 * This method is mostly for internal use, and not intended for duplicating shapes in canvas.
 * @param {Object} object Object to clone
 * @param {Boolean} [deep] Whether to clone nested objects
 * @return {Object}
 */
//TODO: this function return an empty object if you try to clone null
const clone = (object, deep) => deep ? extend({}, object, deep) : { ...object };

/**
 * Capitalizes a string
 * @param {String} string String to capitalize
 * @param {Boolean} [firstLetterOnly] If true only first letter is capitalized
 * and other letters stay untouched, if false first letter is capitalized
 * and other letters are converted to lowercase.
 * @return {String} Capitalized version of a string
 */
const capitalize = (string, firstLetterOnly = false) => `${string.charAt(0).toUpperCase()}${firstLetterOnly ? string.slice(1) : string.slice(1).toLowerCase()}`;

// @ts-nocheck
/**
 * Root object class from which all 2d shape classes inherit from
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-1#objects}
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
let FabricObject$1 = class FabricObject extends AnimatableObject {
    type;
    /**
     * Opacity of an object
     * @type Number
     * @default 1
     */
    opacity;
    /**
     * Size of object's controlling corners (in pixels)
     * @type Number
     * @default 13
     */
    cornerSize;
    /**
     * Size of object's controlling corners when touch interaction is detected
     * @type Number
     * @default 24
     */
    touchCornerSize;
    /**
     * When true, object's controlling corners are rendered as transparent inside (i.e. stroke instead of fill)
     * @type Boolean
     * @default true
     */
    transparentCorners;
    /**
     * Default cursor value used when hovering over this object on canvas
     * @type CSSStyleDeclaration['cursor'] | null
     * @default null
     */
    hoverCursor;
    /**
     * Default cursor value used when moving this object on canvas
     * @type CSSStyleDeclaration['cursor'] | null
     * @default null
     */
    moveCursor;
    /**
     * Color of controlling borders of an object (when it's active)
     * @type String
     * @default rgb(178,204,255)
     */
    borderColor;
    /**
     * Array specifying dash pattern of an object's borders (hasBorder must be true)
     * @since 1.6.2
     * @type Array | null
     * default null;
     */
    borderDashArray;
    /**
     * Color of controlling corners of an object (when it's active)
     * @type String
     * @default rgb(178,204,255)
     */
    cornerColor;
    /**
     * Color of controlling corners of an object (when it's active and transparentCorners false)
     * @since 1.6.2
     * @type String
     * @default null
     */
    cornerStrokeColor;
    /**
     * Specify style of control, 'rect' or 'circle'
     * @since 1.6.2
     * @type 'rect' | 'circle'
     * @default rect
     */
    cornerStyle;
    /**
     * Array specifying dash pattern of an object's control (hasBorder must be true)
     * @since 1.6.2
     * @type Array | null
     */
    cornerDashArray;
    /**
     * When true, this object will use center point as the origin of transformation
     * when being scaled via the controls.
     * <b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).
     * @since 1.3.4
     * @type Boolean
     * @default
     */
    centeredScaling;
    /**
     * When true, this object will use center point as the origin of transformation
     * when being rotated via the controls.
     * <b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).
     * @since 1.3.4
     * @type Boolean
     * @default
     */
    centeredRotation;
    /**
     * When defined, an object is rendered via stroke and this property specifies its color
     * takes css colors https://www.w3.org/TR/css-color-3/
     * @type String
     * @default null
     */
    stroke;
    /**
     * Color of object's fill
     * takes css colors https://www.w3.org/TR/css-color-3/
     * @type String
     * @default rgb(0,0,0)
     */
    fill;
    /**
     * Fill rule used to fill an object
     * accepted values are nonzero, evenodd
     * <b>Backwards incompatibility note:</b> This property was used for setting globalCompositeOperation until v1.4.12 (use `globalCompositeOperation` instead)
     * @type String
     * @default nonzero
     */
    fillRule;
    /**
     * Composite rule used for canvas globalCompositeOperation
     * @type String
     * @default
     */
    globalCompositeOperation;
    /**
     * Background color of an object.
     * takes css colors https://www.w3.org/TR/css-color-3/
     * @type String
     * @default
     */
    backgroundColor;
    /**
     * Selection Background color of an object. colored layer behind the object when it is active.
     * does not mix good with globalCompositeOperation methods.
     * @type String
     * @default
     */
    selectionBackgroundColor;
    /**
     * Array specifying dash pattern of an object's stroke (stroke must be defined)
     * @type Array
     * @default null;
     */
    strokeDashArray;
    /**
     * Line offset of an object's stroke
     * @type Number
     * @default 0
     */
    strokeDashOffset;
    /**
     * Line endings style of an object's stroke (one of "butt", "round", "square")
     * @type String
     * @default butt
     */
    strokeLineCap;
    /**
     * Corner style of an object's stroke (one of "bevel", "round", "miter")
     * @type String
     * @default
     */
    strokeLineJoin;
    /**
     * Maximum miter length (used for strokeLineJoin = "miter") of an object's stroke
     * @type Number
     * @default 4
     */
    strokeMiterLimit;
    /**
     * Shadow object representing shadow of this shape
     * @type Shadow
     * @default null
     */
    shadow;
    /**
     * Opacity of object's controlling borders when object is active and moving
     * @type Number
     * @default 0.4
     */
    borderOpacityWhenMoving;
    /**
     * Scale factor of object's controlling borders
     * bigger number will make a thicker border
     * border is 1, so this is basically a border thickness
     * since there is no way to change the border itself.
     * @type Number
     * @default 1
     */
    borderScaleFactor;
    /**
     * Minimum allowed scale value of an object
     * @type Number
     * @default 0
     */
    minScaleLimit;
    /**
     * When set to `false`, an object can not be selected for modification (using either point-click-based or group-based selection).
     * But events still fire on it.
     * @type Boolean
     * @default
     */
    selectable;
    /**
     * When set to `false`, an object can not be a target of events. All events propagate through it. Introduced in v1.3.4
     * @type Boolean
     * @default
     */
    evented;
    /**
     * When set to `false`, an object is not rendered on canvas
     * @type Boolean
     * @default
     */
    visible;
    /**
     * When set to `false`, object's controls are not displayed and can not be used to manipulate object
     * @type Boolean
     * @default
     */
    hasControls;
    /**
     * When set to `false`, object's controlling borders are not rendered
     * @type Boolean
     * @default
     */
    hasBorders;
    /**
     * When set to `true`, objects are "found" on canvas on per-pixel basis rather than according to bounding box
     * @type Boolean
     * @default
     */
    perPixelTargetFind;
    /**
     * When `false`, default object's values are not included in its serialization
     * @type Boolean
     * @default
     */
    includeDefaultValues;
    /**
     * When `true`, object horizontal movement is locked
     * @type Boolean
     * @default
     */
    lockMovementX;
    /**
     * When `true`, object vertical movement is locked
     * @type Boolean
     * @default
     */
    lockMovementY;
    /**
     * When `true`, object rotation is locked
     * @type Boolean
     * @default
     */
    lockRotation;
    /**
     * When `true`, object horizontal scaling is locked
     * @type Boolean
     * @default
     */
    lockScalingX;
    /**
     * When `true`, object vertical scaling is locked
     * @type Boolean
     * @default
     */
    lockScalingY;
    /**
     * When `true`, object horizontal skewing is locked
     * @type Boolean
     * @default
     */
    lockSkewingX;
    /**
     * When `true`, object vertical skewing is locked
     * @type Boolean
     * @default
     */
    lockSkewingY;
    /**
     * When `true`, object cannot be flipped by scaling into negative values
     * @type Boolean
     * @default
     */
    lockScalingFlip;
    /**
     * When `true`, object is not exported in OBJECT/JSON
     * @since 1.6.3
     * @type Boolean
     * @default
     */
    excludeFromExport;
    /**
     * When `true`, object is cached on an additional canvas.
     * When `false`, object is not cached unless necessary ( clipPath )
     * default to true
     * @since 1.7.0
     * @type Boolean
     * @default true
     */
    objectCaching;
    /**
     * When `true`, object properties are checked for cache invalidation. In some particular
     * situation you may want this to be disabled ( spray brush, very big, groups)
     * or if your application does not allow you to modify properties for groups child you want
     * to disable it for groups.
     * default to false
     * since 1.7.0
     * @type Boolean
     * @default false
     */
    statefullCache;
    /**
     * When `true`, cache does not get updated during scaling. The picture will get blocky if scaled
     * too much and will be redrawn with correct details at the end of scaling.
     * this setting is performance and application dependant.
     * default to true
     * since 1.7.0
     * @type Boolean
     * @default true
     */
    noScaleCache;
    /**
     * When set to `true`, object's cache will be rerendered next render call.
     * since 1.7.0
     * @type Boolean
     * @default true
     */
    dirty;
    /**
     * Determines if the fill or the stroke is drawn first (one of "fill" or "stroke")
     * @type String
     * @default
     */
    paintFirst;
    /**
     * When 'down', object is set to active on mousedown/touchstart
     * When 'up', object is set to active on mouseup/touchend
     * Experimental. Let's see if this breaks anything before supporting officially
     * @private
     * since 4.4.0
     * @type String
     * @default 'down'
     */
    activeOn;
    /**
     * List of properties to consider when checking if state
     * of an object is changed (hasStateChanged)
     * as well as for history (undo/redo) purposes
     * @type Array
     */
    stateProperties;
    /**
     * List of properties to consider when checking if cache needs refresh
     * Those properties are checked by statefullCache ON ( or lazy mode if we want ) or from single
     * calls to Object.set(key, value). If the key is in this list, the object is marked as dirty
     * and refreshed at the next render
     * @type Array
     */
    cacheProperties;
    /**
     * a fabricObject that, without stroke define a clipping area with their shape. filled in black
     * the clipPath object gets used when the object has rendered, and the context is placed in the center
     * of the object cacheCanvas.
     * If you want 0,0 of a clipPath to align with an object center, use clipPath.originX/Y to 'center'
     * @type FabricObject
     */
    clipPath;
    /**
     * Meaningful ONLY when the object is used as clipPath.
     * if true, the clipPath will make the object clip to the outside of the clipPath
     * since 2.4.0
     * @type boolean
     * @default false
     */
    inverted;
    /**
     * Meaningful ONLY when the object is used as clipPath.
     * if true, the clipPath will have its top and left relative to canvas, and will
     * not be influenced by the object transform. This will make the clipPath relative
     * to the canvas, but clipping just a particular object.
     * WARNING this is beta, this feature may change or be renamed.
     * since 2.4.0
     * @type boolean
     * @default false
     */
    absolutePositioned;
    /**
     * Quick access for the _cacheCanvas rendering context
     * This is part of the objectCaching feature
     * since 1.7.0
     * @type boolean
     * @default undefined
     * @private
     */
    _cacheContext = null;
    /**
     * A reference to the HTMLCanvasElement that is used to contain the cache of the object
     * this canvas element is resized and cleared as needed
     * Is marked private, you can read it, don't use it since it is handled by fabric
     * since 1.7.0
     * @type HTMLCanvasElement
     * @default undefined
     * @private
     */
    _cacheCanvas;
    /**
     * Size of the cache canvas, width
     * since 1.7.0
     * @type number
     * @default undefined
     * @private
     */
    cacheWidth;
    /**
     * Size of the cache canvas, height
     * since 1.7.0
     * @type number
     * @default undefined
     * @private
     */
    cacheHeight;
    /**
     * zoom level used on the cacheCanvas to draw the cache, X axe
     * since 1.7.0
     * @type number
     * @default undefined
     * @private
     */
    zoomX;
    /**
     * zoom level used on the cacheCanvas to draw the cache, Y axe
     * since 1.7.0
     * @type number
     * @default undefined
     * @private
     */
    zoomY;
    /**
     * zoom level used on the cacheCanvas to draw the cache, Y axe
     * since 1.7.0
     * @type number
     * @default undefined
     * @private
     */
    cacheTranslationX;
    /**
     * translation of the cacheCanvas away from the center, for subpixel accuracy and crispness
     * since 1.7.0
     * @type number
     * @default undefined
     * @private
     */
    cacheTranslationY;
    /**
     * A reference to the parent of the object, usually a Group
     * @type number
     * @default undefined
     * @private
     */
    group;
    /**
     * A reference to the parent of the object
     * Used to keep the original parent ref when the object has been added to an ActiveSelection, hence loosing the `group` ref
     */
    __owningGroup;
    /**
     * Indicate if the object is sitting on a cache dedicated to it
     * or is part of a larger cache for many object ( a group for example)
     * @type number
     * @default undefined
     * @private
     */
    ownCaching;
    /**
     * Private. indicates if the object inside a group is on a transformed context or not
     * or is part of a larger cache for many object ( a group for example)
     * @type boolean
     * @default undefined
     * @private
     */
    _transformDone;
    callSuper;
    /**
     * Constructor
     * @param {Object} [options] Options object
     */
    constructor(options) {
        super();
        if (options) {
            this.setOptions(options);
        }
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
     * @param {Object} dims
     * @param {Object} dims.width width of canvas
     * @param {Object} dims.height height of canvas
     * @param {Object} dims.zoomX zoomX zoom value to unscale the canvas before drawing cache
     * @param {Object} dims.zoomY zoomY zoom value to unscale the canvas before drawing cache
     * @return {Object}.width width of canvas
     * @return {Object}.height height of canvas
     * @return {Object}.zoomX zoomX zoom value to unscale the canvas before drawing cache
     * @return {Object}.zoomY zoomY zoom value to unscale the canvas before drawing cache
     */
    _limitCacheSize(dims) {
        const width = dims.width, height = dims.height, max = config.maxCacheSideLimit, min = config.minCacheSideLimit;
        if (width <= max &&
            height <= max &&
            width * height <= config.perfLimitSizeTotal) {
            if (width < min) {
                dims.width = min;
            }
            if (height < min) {
                dims.height = min;
            }
            return dims;
        }
        const ar = width / height, [limX, limY] = cache.limitDimsByArea(ar), x = capValue(min, limX, max), y = capValue(min, limY, max);
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
     * @return {Object}.x width of object to be cached
     * @return {Object}.y height of object to be cached
     * @return {Object}.width width of canvas
     * @return {Object}.height height of canvas
     * @return {Object}.zoomX zoomX zoom value to unscale the canvas before drawing cache
     * @return {Object}.zoomY zoomY zoom value to unscale the canvas before drawing cache
     */
    _getCacheCanvasDimensions() {
        const objectScale = this.getTotalObjectScaling(), 
        // calculate dimensions without skewing
        dim = this._getTransformedDimensions({ skewX: 0, skewY: 0 }), neededX = (dim.x * objectScale.x) / this.scaleX, neededY = (dim.y * objectScale.y) / this.scaleY;
        return {
            // for sure this ALIASING_LIMIT is slightly creating problem
            // in situation in which the cache canvas gets an upper limit
            // also objectScale contains already scaleX and scaleY
            width: neededX + ALIASING_LIMIT,
            height: neededY + ALIASING_LIMIT,
            zoomX: objectScale.x,
            zoomY: objectScale.y,
            x: neededX,
            y: neededY,
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
            const target = targetCanvas._currentTransform.target, action = targetCanvas._currentTransform.action;
            if (this === target && action.slice && action.slice(0, 5) === 'scale') {
                return false;
            }
        }
        const canvas = this._cacheCanvas, context = this._cacheContext, dims = this._limitCacheSize(this._getCacheCanvasDimensions()), minCacheSize = config.minCacheSideLimit, width = dims.width, height = dims.height, zoomX = dims.zoomX, zoomY = dims.zoomY, dimensionsChanged = width !== this.cacheWidth || height !== this.cacheHeight, zoomChanged = this.zoomX !== zoomX || this.zoomY !== zoomY;
        if (!canvas || !context) {
            return false;
        }
        let drawingWidth, drawingHeight, shouldRedraw = dimensionsChanged || zoomChanged, additionalWidth = 0, additionalHeight = 0, shouldResizeCanvas = false;
        if (dimensionsChanged) {
            const canvasWidth = this._cacheCanvas.width, canvasHeight = this._cacheCanvas.height, sizeGrowing = width > canvasWidth || height > canvasHeight, sizeShrinking = (width < canvasWidth * 0.9 || height < canvasHeight * 0.9) &&
                canvasWidth > minCacheSize &&
                canvasHeight > minCacheSize;
            shouldResizeCanvas = sizeGrowing || sizeShrinking;
            if (sizeGrowing &&
                !dims.capped &&
                (width > minCacheSize || height > minCacheSize)) {
                additionalWidth = width * 0.1;
                additionalHeight = height * 0.1;
            }
        }
        if (this instanceof fabric.Text && this.path) {
            shouldRedraw = true;
            shouldResizeCanvas = true;
            // IMHO in those lines we are using zoomX and zoomY not the this version.
            additionalWidth += this.getHeightOfLine(0) * this.zoomX;
            additionalHeight += this.getHeightOfLine(0) * this.zoomY;
        }
        if (shouldRedraw) {
            if (shouldResizeCanvas) {
                canvas.width = Math.ceil(width + additionalWidth);
                canvas.height = Math.ceil(height + additionalHeight);
            }
            else {
                context.setTransform(1, 0, 0, 1, 0, 0);
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
            drawingWidth = dims.x / 2;
            drawingHeight = dims.y / 2;
            this.cacheTranslationX =
                Math.round(canvas.width / 2 - drawingWidth) + drawingWidth;
            this.cacheTranslationY =
                Math.round(canvas.height / 2 - drawingHeight) + drawingHeight;
            this.cacheWidth = width;
            this.cacheHeight = height;
            context.translate(this.cacheTranslationX, this.cacheTranslationY);
            context.scale(zoomX, zoomY);
            this.zoomX = zoomX;
            this.zoomY = zoomY;
            return true;
        }
        return false;
    }
    /**
     * Sets object's properties from options
     * @param {Object} [options] Options object
     */
    setOptions(options = {}) {
        this._setOptions(options);
    }
    /**
     * Transforms context when rendering an object
     * @param {CanvasRenderingContext2D} ctx Context
     */
    transform(ctx) {
        const needFullTransform = (this.group && !this.group._transformDone) ||
            (this.group && this.canvas && ctx === this.canvas.contextTop);
        const m = this.calcTransformMatrix(!needFullTransform);
        ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
    }
    /**
     * Returns an object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} Object representation of an instance
     */
    toObject(propertiesToInclude) {
        const NUM_FRACTION_DIGITS = config.NUM_FRACTION_DIGITS, clipPathData = this.clipPath && !this.clipPath.excludeFromExport
            ? {
                ...this.clipPath.toObject(propertiesToInclude),
                inverted: this.clipPath.inverted,
                absolutePositioned: this.clipPath.absolutePositioned,
            }
            : null, object = {
            ...pick(this, propertiesToInclude),
            type: this.type,
            version: VERSION,
            originX: this.originX,
            originY: this.originY,
            left: toFixed(this.left, NUM_FRACTION_DIGITS),
            top: toFixed(this.top, NUM_FRACTION_DIGITS),
            width: toFixed(this.width, NUM_FRACTION_DIGITS),
            height: toFixed(this.height, NUM_FRACTION_DIGITS),
            fill: this.fill && this.fill.toObject ? this.fill.toObject() : this.fill,
            stroke: this.stroke && this.stroke.toObject
                ? this.stroke.toObject()
                : this.stroke,
            strokeWidth: toFixed(this.strokeWidth, NUM_FRACTION_DIGITS),
            strokeDashArray: this.strokeDashArray
                ? this.strokeDashArray.concat()
                : this.strokeDashArray,
            strokeLineCap: this.strokeLineCap,
            strokeDashOffset: this.strokeDashOffset,
            strokeLineJoin: this.strokeLineJoin,
            strokeUniform: this.strokeUniform,
            strokeMiterLimit: toFixed(this.strokeMiterLimit, NUM_FRACTION_DIGITS),
            scaleX: toFixed(this.scaleX, NUM_FRACTION_DIGITS),
            scaleY: toFixed(this.scaleY, NUM_FRACTION_DIGITS),
            angle: toFixed(this.angle, NUM_FRACTION_DIGITS),
            flipX: this.flipX,
            flipY: this.flipY,
            opacity: toFixed(this.opacity, NUM_FRACTION_DIGITS),
            shadow: this.shadow && this.shadow.toObject
                ? this.shadow.toObject()
                : this.shadow,
            visible: this.visible,
            backgroundColor: this.backgroundColor,
            fillRule: this.fillRule,
            paintFirst: this.paintFirst,
            globalCompositeOperation: this.globalCompositeOperation,
            skewX: toFixed(this.skewX, NUM_FRACTION_DIGITS),
            skewY: toFixed(this.skewY, NUM_FRACTION_DIGITS),
            ...(clipPathData ? { clipPath: clipPathData } : null),
        };
        return !this.includeDefaultValues
            ? this._removeDefaultValues(object)
            : object;
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
        const prototype = classRegistry.getClass(object.type).prototype;
        Object.keys(object).forEach(function (prop) {
            if (prop === 'left' || prop === 'top' || prop === 'type') {
                return;
            }
            if (object[prop] === prototype[prop]) {
                delete object[prop];
            }
            // basically a check for [] === []
            if (Array.isArray(object[prop]) &&
                Array.isArray(prototype[prop]) &&
                object[prop].length === 0 &&
                prototype[prop].length === 0) {
                delete object[prop];
            }
        });
        return object;
    }
    /**
     * Returns a string representation of an instance
     * @return {String}
     */
    toString() {
        return `#<${capitalize(this.type)}>`;
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
            }
            else {
                return this.minScaleLimit;
            }
        }
        else if (value === 0) {
            return 0.0001;
        }
        return value;
    }
    /**
     * @private
     * @param {String} key
     * @param {*} value
     */
    _set(key, value) {
        const isChanged = this[key] !== value;
        if (key === 'scaleX' || key === 'scaleY') {
            value = this._constrainScale(value);
        }
        if (key === 'scaleX' && value < 0) {
            this.flipX = !this.flipX;
            value *= -1;
        }
        else if (key === 'scaleY' && value < 0) {
            this.flipY = !this.flipY;
            value *= -1;
        }
        else if (key === 'shadow' && value && !(value instanceof Shadow)) {
            value = new Shadow(value);
        }
        else if (key === 'dirty' && this.group) {
            this.group.set('dirty', value);
        }
        this[key] = value;
        if (isChanged) {
            const groupNeedsUpdate = this.group && this.group.isOnACache();
            if (this.cacheProperties.indexOf(key) > -1) {
                this.dirty = true;
                groupNeedsUpdate && this.group.set('dirty', true);
            }
            else if (groupNeedsUpdate && this.stateProperties.indexOf(key) > -1) {
                this.group.set('dirty', true);
            }
        }
        return this;
    }
    /*
     * @private
     * return if the object would be visible in rendering
     * @memberOf FabricObject.prototype
     * @return {Boolean}
     */
    isNotVisible() {
        return (this.opacity === 0 ||
            (!this.width && !this.height && this.strokeWidth === 0) ||
            !this.visible);
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
        if (this.canvas &&
            this.canvas.skipOffscreen &&
            !this.group &&
            !this.isOnScreen()) {
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
        }
        else {
            this._removeCacheCanvas();
            this.dirty = false;
            this.drawObject(ctx);
            if (this.objectCaching && this.statefullCache) {
                this.saveState({ propertySet: 'cacheProperties' });
            }
        }
        ctx.restore();
    }
    renderCache(options) {
        options = options || {};
        if (!this._cacheCanvas || !this._cacheContext) {
            this._createCacheCanvas();
        }
        if (this.isCacheDirty() && this._cacheContext) {
            this.statefullCache && this.saveState({ propertySet: 'cacheProperties' });
            this.drawObject(this._cacheContext, options.forClipping);
            this.dirty = false;
        }
    }
    /**
     * Remove cacheCanvas and its dimensions from the objects
     */
    _removeCacheCanvas() {
        this._cacheCanvas = undefined;
        this._cacheContext = null;
        this.cacheWidth = 0;
        this.cacheHeight = 0;
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
        return (this.stroke && this.stroke !== 'transparent' && this.strokeWidth !== 0);
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
        return this.fill && this.fill !== 'transparent';
    }
    /**
     * When set to `true`, force the object to have its own cache, even if it is inside a group
     * it may be needed when your object behave in a particular way on the cache and always needs
     * its own isolated canvas to render correctly.
     * Created to be overridden
     * since 1.7.12
     * @returns Boolean
     */
    needsItsOwnCache() {
        if (this.paintFirst === 'stroke' &&
            this.hasFill() &&
            this.hasStroke() &&
            typeof this.shadow === 'object') {
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
     * a cache step. None of the fabric classes requires it.
     * Generally you do not cache objects in groups because the group outside is cached.
     * Read as: cache if is needed, or if the feature is enabled but we are not already caching.
     * @return {Boolean}
     */
    shouldCache() {
        this.ownCaching =
            this.needsItsOwnCache() ||
                (this.objectCaching && (!this.group || !this.group.isOnACache()));
        return this.ownCaching;
    }
    /**
     * Check if this object or a child object will cast a shadow
     * used by Group.shouldCache to know if child has a shadow recursively
     * @return {Boolean}
     * @deprecated
     */
    willDrawShadow() {
        return (!!this.shadow && (this.shadow.offsetX !== 0 || this.shadow.offsetY !== 0));
    }
    /**
     * Execute the drawing operation for an object clipPath
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {FabricObject} clipPath
     */
    drawClipPathOnCache(ctx, clipPath) {
        ctx.save();
        // DEBUG: uncomment this line, comment the following
        // ctx.globalAlpha = 0.4
        if (clipPath.inverted) {
            ctx.globalCompositeOperation = 'destination-out';
        }
        else {
            ctx.globalCompositeOperation = 'destination-in';
        }
        //ctx.scale(1 / 2, 1 / 2);
        if (clipPath.absolutePositioned) {
            const m = invertTransform(this.calcTransformMatrix());
            ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
        }
        clipPath.transform(ctx);
        ctx.scale(1 / clipPath.zoomX, 1 / clipPath.zoomY);
        ctx.drawImage(clipPath._cacheCanvas, -clipPath.cacheTranslationX, -clipPath.cacheTranslationY);
        ctx.restore();
    }
    /**
     * Execute the drawing operation for an object on a specified context
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {boolean} forClipping apply clipping styles
     */
    drawObject(ctx, forClipping) {
        const originalFill = this.fill, originalStroke = this.stroke;
        if (forClipping) {
            this.fill = 'black';
            this.stroke = '';
            this._setClippingProperties(ctx);
        }
        else {
            this._renderBackground(ctx);
        }
        this._render(ctx);
        this._drawClipPath(ctx, this.clipPath);
        this.fill = originalFill;
        this.stroke = originalStroke;
    }
    /**
     * Prepare clipPath state and cache and draw it on instance's cache
     * @param {CanvasRenderingContext2D} ctx
     * @param {FabricObject} clipPath
     */
    _drawClipPath(ctx, clipPath) {
        if (!clipPath) {
            return;
        }
        // needed to setup a couple of variables
        // path canvas gets overridden with this one.
        // TODO find a better solution?
        clipPath._set('canvas', this.canvas);
        clipPath.shouldCache();
        clipPath._transformDone = true;
        clipPath.renderCache({ forClipping: true });
        this.drawClipPathOnCache(ctx, clipPath);
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
     * Check if cache is dirty
     * @param {Boolean} skipCanvas skip canvas checks because this object is painted
     * on parent canvas.
     */
    isCacheDirty(skipCanvas = false) {
        if (this.isNotVisible()) {
            return false;
        }
        if (this._cacheCanvas &&
            this._cacheContext &&
            !skipCanvas &&
            this._updateCacheCanvas()) {
            // in this case the context is already cleared.
            return true;
        }
        else {
            if (this.dirty ||
                (this.clipPath && this.clipPath.absolutePositioned) ||
                (this.statefullCache && this.hasStateChanged('cacheProperties'))) {
                if (this._cacheCanvas && this._cacheContext && !skipCanvas) {
                    const width = this.cacheWidth / this.zoomX;
                    const height = this.cacheHeight / this.zoomY;
                    this._cacheContext.clearRect(-width / 2, -height / 2, width, height);
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
        }
        else {
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
            if (stroke.toLive) {
                if (stroke.gradientUnits === 'percentage' ||
                    stroke.gradientTransform ||
                    stroke.patternTransform) {
                    // need to transform gradient in a pattern.
                    // this is a slow process. If you are hitting this codepath, and the object
                    // is not using caching, you should consider switching it on.
                    // we need a canvas as big as the current object caching canvas.
                    this._applyPatternForTransformedGradient(ctx, stroke);
                }
                else {
                    // is a simple gradient or pattern
                    ctx.strokeStyle = stroke.toLive(ctx, this);
                    this._applyPatternGradientTransform(ctx, stroke);
                }
            }
            else {
                // is a color
                ctx.strokeStyle = decl.stroke;
            }
        }
    }
    _setFillStyles(ctx, { fill }) {
        if (fill) {
            if (fill.toLive) {
                ctx.fillStyle = fill.toLive(ctx, this);
                this._applyPatternGradientTransform(ctx, fill);
            }
            else {
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
        // Spec requires the concatenation of two copies of the dash array when the number of elements is odd
        if (1 & dashArray.length) {
            dashArray.push(...dashArray);
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
        const shadow = this.shadow, canvas = this.canvas, retinaScaling = this.getCanvasRetinaScaling(), [sx, , , sy] = canvas?.viewportTransform || iMatrix, multX = sx * retinaScaling, multY = sy * retinaScaling, scaling = shadow.nonScaling ? new Point(1, 1) : this.getObjectScaling();
        ctx.shadowColor = shadow.color;
        ctx.shadowBlur =
            (shadow.blur *
                config.browserShadowBlurConstant *
                (multX + multY) *
                (scaling.x + scaling.y)) /
                4;
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
        if (!filler || !filler.toLive) {
            return { offsetX: 0, offsetY: 0 };
        }
        const t = filler.gradientTransform || filler.patternTransform;
        const offsetX = -this.width / 2 + filler.offsetX || 0, offsetY = -this.height / 2 + filler.offsetY || 0;
        if (filler.gradientUnits === 'percentage') {
            ctx.transform(this.width, 0, 0, this.height, offsetX, offsetY);
        }
        else {
            ctx.transform(1, 0, 0, 1, offsetX, offsetY);
        }
        if (t) {
            ctx.transform(t[0], t[1], t[2], t[3], t[4], t[5]);
        }
        return { offsetX: offsetX, offsetY: offsetY };
    }
    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderPaintInOrder(ctx) {
        if (this.paintFirst === 'stroke') {
            this._renderStroke(ctx);
            this._renderFill(ctx);
        }
        else {
            this._renderFill(ctx);
            this._renderStroke(ctx);
        }
    }
    /**
     * @private
     * function that actually render something on the context.
     * empty here to allow Obects to work on tests to benchmark fabric functionalites
     * not related to rendering
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render(ctx) {
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
        }
        else {
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
        const dims = this._limitCacheSize(this._getCacheCanvasDimensions()), pCanvas = createCanvasElement(), retinaScaling = this.getCanvasRetinaScaling(), width = dims.x / this.scaleX / retinaScaling, height = dims.y / this.scaleY / retinaScaling;
        pCanvas.width = width;
        pCanvas.height = height;
        const pCtx = pCanvas.getContext('2d');
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
        ctx.scale((retinaScaling * this.scaleX) / dims.zoomX, (retinaScaling * this.scaleY) / dims.zoomY);
        ctx.strokeStyle = pCtx.createPattern(pCanvas, 'no-repeat');
    }
    /**
     * This function is an helper for svg import. it returns the center of the object in the svg
     * untransformed coordinates
     * @private
     * @return {Object} center point from element coordinates
     */
    _findCenterFromElement() {
        return { x: this.left + this.width / 2, y: this.top + this.height / 2 };
    }
    /**
     * This function is an helper for svg import. it decompose the transformMatrix
     * and assign properties to object.
     * untransformed coordinates
     * @todo move away in the svg import stuff.
     * @private
     */
    _assignTransformMatrixProps() {
        if (this.transformMatrix) {
            const options = qrDecompose(this.transformMatrix);
            this.flipX = false;
            this.flipY = false;
            this.set('scaleX', options.scaleX);
            this.set('scaleY', options.scaleY);
            this.angle = options.angle;
            this.skewX = options.skewX;
            this.skewY = 0;
        }
    }
    /**
     * This function is an helper for svg import. it removes the transform matrix
     * and set to object properties that fabricjs can handle
     * @todo move away in the svg import stuff.
     * @private
     * @param {Object} preserveAspectRatioOptions
     */
    _removeTransformMatrix(preserveAspectRatioOptions) {
        let center = this._findCenterFromElement();
        if (this.transformMatrix) {
            this._assignTransformMatrixProps();
            center = transformPoint(center, this.transformMatrix);
        }
        this.transformMatrix = null;
        if (preserveAspectRatioOptions) {
            this.scaleX *= preserveAspectRatioOptions.scaleX;
            this.scaleY *= preserveAspectRatioOptions.scaleY;
            this.cropX = preserveAspectRatioOptions.cropX;
            this.cropY = preserveAspectRatioOptions.cropY;
            center.x += preserveAspectRatioOptions.offsetLeft;
            center.y += preserveAspectRatioOptions.offsetTop;
            this.width = preserveAspectRatioOptions.width;
            this.height = preserveAspectRatioOptions.height;
        }
        this.setPositionByOrigin(center, 'center', 'center');
    }
    /**
     * Clones an instance.
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @returns {Promise<FabricObject>}
     */
    clone(propertiesToInclude) {
        const objectForm = this.toObject(propertiesToInclude);
        // todo ok understand this. is static or it isn't?
        return this.constructor.fromObject(objectForm);
    }
    /**
     * Creates an instance of Image out of an object
     * makes use of toCanvasElement.
     * Once this method was based on toDataUrl and loadImage, so it also had a quality
     * and format option. toCanvasElement is faster and produce no loss of quality.
     * If you need to get a real Jpeg or Png from an object, using toDataURL is the right way to do it.
     * toCanvasElement and then toBlob from the obtained canvas is also a good option.
     * @param {Object} [options] for clone as image, passed to toDataURL
     * @param {Number} [options.multiplier=1] Multiplier to scale by
     * @param {Number} [options.left] Cropping left offset. Introduced in v1.2.14
     * @param {Number} [options.top] Cropping top offset. Introduced in v1.2.14
     * @param {Number} [options.width] Cropping width. Introduced in v1.2.14
     * @param {Number} [options.height] Cropping height. Introduced in v1.2.14
     * @param {Boolean} [options.enableRetinaScaling] Enable retina scaling for clone image. Introduce in 1.6.4
     * @param {Boolean} [options.withoutTransform] Remove current object transform ( no scale , no angle, no flip, no skew ). Introduced in 2.3.4
     * @param {Boolean} [options.withoutShadow] Remove current object shadow. Introduced in 2.4.2
     * @return {Image} Object cloned as image.
     */
    cloneAsImage(options) {
        const canvasEl = this.toCanvasElement(options);
        // TODO: how to import Image w/o an import cycle?
        return new fabric.Image(canvasEl);
    }
    /**
     * Converts an object into a HTMLCanvas element
     * @param {Object} options Options object
     * @param {Number} [options.multiplier=1] Multiplier to scale by
     * @param {Number} [options.left] Cropping left offset. Introduced in v1.2.14
     * @param {Number} [options.top] Cropping top offset. Introduced in v1.2.14
     * @param {Number} [options.width] Cropping width. Introduced in v1.2.14
     * @param {Number} [options.height] Cropping height. Introduced in v1.2.14
     * @param {Boolean} [options.enableRetinaScaling] Enable retina scaling for clone image. Introduce in 1.6.4
     * @param {Boolean} [options.withoutTransform] Remove current object transform ( no scale , no angle, no flip, no skew ). Introduced in 2.3.4
     * @param {Boolean} [options.withoutShadow] Remove current object shadow. Introduced in 2.4.2
     * @return {HTMLCanvasElement} Returns DOM element <canvas> with the FabricObject
     */
    toCanvasElement(options) {
        options || (options = {});
        const origParams = saveObjectTransform(this), originalGroup = this.group, originalShadow = this.shadow, abs = Math.abs, retinaScaling = options.enableRetinaScaling
            ? Math.max(config.devicePixelRatio, 1)
            : 1, multiplier = (options.multiplier || 1) * retinaScaling;
        delete this.group;
        if (options.withoutTransform) {
            resetObjectTransform(this);
        }
        if (options.withoutShadow) {
            this.shadow = null;
        }
        const el = createCanvasElement(), 
        // skip canvas zoom and calculate with setCoords now.
        boundingRect = this.getBoundingRect(true, true), shadow = this.shadow, shadowOffset = new Point();
        if (shadow) {
            const shadowBlur = shadow.blur;
            const scaling = shadow.nonScaling
                ? new Point(1, 1)
                : this.getObjectScaling();
            // consider non scaling shadow.
            shadowOffset.x =
                2 * Math.round(abs(shadow.offsetX) + shadowBlur) * abs(scaling.x);
            shadowOffset.y =
                2 * Math.round(abs(shadow.offsetY) + shadowBlur) * abs(scaling.y);
        }
        const width = boundingRect.width + shadowOffset.x, height = boundingRect.height + shadowOffset.y;
        // if the current width/height is not an integer
        // we need to make it so.
        el.width = Math.ceil(width);
        el.height = Math.ceil(height);
        let canvas = new fabric.StaticCanvas(el, {
            enableRetinaScaling: false,
            renderOnAddRemove: false,
            skipOffscreen: false,
        });
        if (options.format === 'jpeg') {
            canvas.backgroundColor = '#fff';
        }
        this.setPositionByOrigin(new Point(canvas.width / 2, canvas.height / 2), 'center', 'center');
        const originalCanvas = this.canvas;
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
        canvas = null;
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
    toDataURL(options = {}) {
        return toDataURL(this.toCanvasElement(options), options.format || 'png', options.quality || 1);
    }
    /**
     * Returns true if specified type is identical to the type of an instance
     * @param {String} type Type to check against
     * @return {Boolean}
     */
    isType(...types) {
        return types.includes(this.type);
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
        const shouldCenterOrigin = (this.originX !== 'center' || this.originY !== 'center') &&
            this.centeredRotation;
        if (shouldCenterOrigin) {
            this._setOriginToCenter();
        }
        this.set('angle', angle);
        if (shouldCenterOrigin) {
            this._resetOrigin();
        }
    }
    /**
     * Centers object horizontally on canvas to which it was added last.
     * You might need to call `setCoords` on an object after centering, to update controls area.
     */
    centerH() {
        this.canvas && this.canvas.centerObjectH(this);
        return this;
    }
    /**
     * Centers object horizontally on current viewport of canvas to which it was added last.
     * You might need to call `setCoords` on an object after centering, to update controls area.
     */
    viewportCenterH() {
        this.canvas && this.canvas.viewportCenterObjectH(this);
        return this;
    }
    /**
     * Centers object vertically on canvas to which it was added last.
     * You might need to call `setCoords` on an object after centering, to update controls area.
     */
    centerV() {
        this.canvas && this.canvas.centerObjectV(this);
        return this;
    }
    /**
     * Centers object vertically on current viewport of canvas to which it was added last.
     * You might need to call `setCoords` on an object after centering, to update controls area.
     */
    viewportCenterV() {
        this.canvas && this.canvas.viewportCenterObjectV(this);
        return this;
    }
    /**
     * Centers object vertically and horizontally on canvas to which is was added last
     * You might need to call `setCoords` on an object after centering, to update controls area.
     */
    center() {
        this.canvas && this.canvas.centerObject(this);
        return this;
    }
    /**
     * Centers object on current viewport of canvas to which it was added last.
     * You might need to call `setCoords` on an object after centering, to update controls area.
     */
    viewportCenter() {
        this.canvas && this.canvas.viewportCenterObject(this);
        return this;
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
        // todo verify this.
        // runningAnimations is always truthy
        if (runningAnimations) {
            runningAnimations.cancelByTarget(this);
        }
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
    static _fromObject(object, { extraParam, ...options } = {}) {
        return enlivenObjectEnlivables(clone(object, true), options).then((enlivedMap) => {
            // from the resulting enlived options, extract options.extraParam to arg0
            // to avoid accidental overrides later
            const { [extraParam]: arg0, ...rest } = { ...options, ...enlivedMap };
            return extraParam ? new this(arg0, rest) : new this(rest);
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
const fabricObjectDefaultValues = {
    type: 'object',
    originX: 'left',
    originY: 'top',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    scaleX: 1,
    scaleY: 1,
    flipX: false,
    flipY: false,
    opacity: 1,
    angle: 0,
    skewX: 0,
    skewY: 0,
    cornerSize: 13,
    touchCornerSize: 24,
    transparentCorners: true,
    hoverCursor: null,
    moveCursor: null,
    padding: 0,
    borderColor: 'rgb(178,204,255)',
    borderDashArray: null,
    cornerColor: 'rgb(178,204,255)',
    cornerStrokeColor: '',
    cornerStyle: 'rect',
    cornerDashArray: null,
    centeredScaling: false,
    centeredRotation: true,
    fill: 'rgb(0,0,0)',
    fillRule: 'nonzero',
    globalCompositeOperation: 'source-over',
    backgroundColor: '',
    selectionBackgroundColor: '',
    stroke: null,
    strokeWidth: 1,
    strokeDashArray: null,
    strokeDashOffset: 0,
    strokeLineCap: 'butt',
    strokeLineJoin: 'miter',
    strokeMiterLimit: 4,
    shadow: null,
    borderOpacityWhenMoving: 0.4,
    borderScaleFactor: 1,
    minScaleLimit: 0,
    selectable: true,
    evented: true,
    visible: true,
    hasControls: true,
    hasBorders: true,
    perPixelTargetFind: false,
    includeDefaultValues: true,
    lockMovementX: false,
    lockMovementY: false,
    lockRotation: false,
    lockScalingX: false,
    lockScalingY: false,
    lockSkewingX: false,
    lockSkewingY: false,
    lockScalingFlip: false,
    excludeFromExport: false,
    objectCaching: !fabric.isLikelyNode,
    statefullCache: false,
    noScaleCache: true,
    strokeUniform: false,
    dirty: true,
    __corner: 0,
    paintFirst: 'fill',
    activeOn: 'down',
    stateProperties: [
        'top',
        'left',
        'width',
        'height',
        'scaleX',
        'scaleY',
        'flipX',
        'flipY',
        'originX',
        'originY',
        'transformMatrix',
        'stroke',
        'strokeWidth',
        'strokeDashArray',
        'strokeLineCap',
        'strokeDashOffset',
        'strokeLineJoin',
        'strokeMiterLimit',
        'angle',
        'opacity',
        'fill',
        'globalCompositeOperation',
        'shadow',
        'visible',
        'backgroundColor',
        'skewX',
        'skewY',
        'fillRule',
        'paintFirst',
        'clipPath',
        'strokeUniform',
    ],
    cacheProperties: [
        'fill',
        'stroke',
        'strokeWidth',
        'strokeDashArray',
        'width',
        'height',
        'paintFirst',
        'strokeUniform',
        'strokeLineCap',
        'strokeDashOffset',
        'strokeLineJoin',
        'strokeMiterLimit',
        'backgroundColor',
        'clipPath',
    ],
    colorProperties: ['fill', 'stroke', 'backgroundColor'],
    clipPath: undefined,
    inverted: false,
    absolutePositioned: false,
    FX_DURATION: 500,
};
Object.assign(FabricObject$1.prototype, fabricObjectDefaultValues);
classRegistry.setClass(FabricObject$1);

class InteractiveFabricObject extends FabricObject$1 {
    /**
     * Describe object's corner position in canvas element coordinates.
     * properties are depending on control keys and padding the main controls.
     * each property is an object with x, y and corner.
     * The `corner` property contains in a similar manner the 4 points of the
     * interactive area of the corner.
     * The coordinates depends from the controls positionHandler and are used
     * to draw and locate controls
     */
    oCoords = {};
    /**
     * keeps the value of the last hovered corner during mouse move.
     * 0 is no corner, or 'mt', 'ml', 'mtr' etc..
     * It should be private, but there is no harm in using it as
     * a read-only property.
     * this isn't cleaned automatically. Non selected objects may have wrong values
     * @type number|string|any
     * @default 0
     */
    __corner;
    /**
     * a map of control visibility for this object.
     * this was left when controls were introduced to do not brea the api too much
     * this takes priority over the generic control visibility
     */
    _controlsVisibility;
    /**
     * The angle that an object will lock to while rotating.
     * @type [TDegree]
     */
    snapAngle;
    /**
     * The angle difference from the current snapped angle in which snapping should occur.
     * When undefined, the snapThreshold will default to the snapAngle.
     * @type [TDegree]
     */
    snapThreshold;
    /**
     * holds the controls for the object.
     * controls are added by default_controls.js
     */
    controls;
    /**
     * internal boolean to signal the code that the object is
     * part of the move action.
     */
    isMoving;
    /**
     * internal boolean to signal the code that the object is
     * part of the draggin action.
     * @TODO: discuss isMoving and isDragging being not adequate enough
     * they need to be either both private or more generic
     * Canvas class needs to see this variable
     */
    __isDragging;
    /**
     * A boolean used from the gesture module to keep tracking of a scaling
     * action when there is no scaling transform in place.
     * This is an edge case and is used twice in all codebase.
     * Probably added to keep track of some performance issues
     * @TODO use git blame to investigate why it was added
     * DON'T USE IT. WE WILL TRY TO REMOVE IT
     */
    _scaling;
    /**
     * Constructor
     * @param {Object} [options] Options object
     */
    constructor(options) {
        super(options);
    }
    /**
     * Determines which corner has been clicked
     * @private
     * @param {Object} pointer The pointer indicating the mouse position
     * @param {boolean} forTouch indicates if we are looking for interaction area with a touch action
     * @return {String|Boolean} corner code (tl, tr, bl, br, etc.), or false if nothing is found
     */
    _findTargetCorner(pointer, forTouch = false) {
        if (!this.hasControls ||
            !this.canvas ||
            this.canvas._activeObject !== this) {
            return 0;
        }
        this.__corner = 0;
        // had to keep the reverse loop because was breaking tests
        const cornerEntries = Object.entries(this.oCoords);
        for (let i = cornerEntries.length - 1; i >= 0; i--) {
            const [cornerKey, corner] = cornerEntries[i];
            if (!this.isControlVisible(cornerKey)) {
                continue;
            }
            const lines = this._getImageLines(forTouch ? corner.touchCorner : corner.corner);
            const xPoints = this._findCrossPoints(pointer, lines);
            if (xPoints !== 0 && xPoints % 2 === 1) {
                this.__corner = cornerKey;
                return cornerKey;
            }
            // // debugging
            //
            // this.canvas.contextTop.fillRect(lines.bottomline.d.x, lines.bottomline.d.y, 2, 2);
            // this.canvas.contextTop.fillRect(lines.bottomline.o.x, lines.bottomline.o.y, 2, 2);
            //
            // this.canvas.contextTop.fillRect(lines.leftline.d.x, lines.leftline.d.y, 2, 2);
            // this.canvas.contextTop.fillRect(lines.leftline.o.x, lines.leftline.o.y, 2, 2);
            //
            // this.canvas.contextTop.fillRect(lines.topline.d.x, lines.topline.d.y, 2, 2);
            // this.canvas.contextTop.fillRect(lines.topline.o.x, lines.topline.o.y, 2, 2);
            //
            // this.canvas.contextTop.fillRect(lines.rightline.d.x, lines.rightline.d.y, 2, 2);
            // this.canvas.contextTop.fillRect(lines.rightline.o.x, lines.rightline.o.y, 2, 2);
        }
        return 0;
    }
    /**
     * Calculates the coordinates of the center of each control plus the corners of the control itself
     * This basically just delegates to each control positionHandler
     * WARNING: changing what is passed to positionHandler is a breaking change, since position handler
     * is a public api and should be done just if extremely necessary
     * @return {Record<string, TOCoord>}
     */
    calcOCoords() {
        const vpt = this.getViewportTransform(), center = this.getCenterPoint(), tMatrix = [1, 0, 0, 1, center.x, center.y], rMatrix = calcRotateMatrix({
            angle: this.getTotalAngle() - (!!this.group && this.flipX ? 180 : 0),
        }), positionMatrix = multiplyTransformMatrices(tMatrix, rMatrix), startMatrix = multiplyTransformMatrices(vpt, positionMatrix), finalMatrix = multiplyTransformMatrices(startMatrix, [
            1 / vpt[0],
            0,
            0,
            1 / vpt[3],
            0,
            0,
        ]), transformOptions = this.group
            ? qrDecompose(this.calcTransformMatrix())
            : undefined, dim = this._calculateCurrentDimensions(transformOptions), coords = {};
        this.forEachControl((control, key, fabricObject) => {
            coords[key] = control.positionHandler(dim, finalMatrix, fabricObject);
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
     * Sets corner and controls position coordinates based on current angle, width and height, left and top.
     * oCoords are used to find the corners
     * aCoords are used to quickly find an object on the canvas
     * lineCoords are used to quickly find object during pointer events.
     * See {@link https://github.com/fabricjs/fabric.js/wiki/When-to-call-setCoords} and {@link http://fabricjs.com/fabric-gotchas}
     * @return {void}
     */
    setCoords() {
        if (this.callSuper) {
            ObjectGeometry.prototype.setCoords.call(this);
        }
        else {
            super.setCoords();
        }
        // set coordinates of the draggable boxes in the corners used to scale/rotate the image
        this.oCoords = this.calcOCoords();
        this._setCornerCoords();
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
     * Sets the coordinates that determine the interaction area of each control
     * note: if we would switch to ROUND corner area, all of this would disappear.
     * everything would resolve to a single point and a pythagorean theorem for the distance
     * @todo evaluate simplification of code switching to circle interaction area at runtime
     * @private
     */
    _setCornerCoords() {
        Object.entries(this.oCoords).forEach(([controlKey, control]) => {
            const controlObject = this.controls[controlKey];
            control.corner = controlObject.calcCornerCoords(this.angle, this.cornerSize, control.x, control.y, false);
            control.touchCorner = controlObject.calcCornerCoords(this.angle, this.touchCornerSize, control.x, control.y, true);
        });
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
        if (!this.selectionBackgroundColor ||
            (this.canvas && !this.canvas.interactive) ||
            (this.canvas &&
                this.canvas._activeObject !== this)) {
            return;
        }
        ctx.save();
        const center = this.getRelativeCenterPoint(), wh = this._calculateCurrentDimensions(), vpt = this.getViewportTransform();
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
     * @param {Object} styleOverride object to override the object style
     */
    _drawBorders(ctx, size, styleOverride = {}) {
        const options = {
            hasControls: this.hasControls,
            borderColor: this.borderColor,
            borderDashArray: this.borderDashArray,
            ...styleOverride,
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
     * @param {Object} [styleOverride] properties to override the object style
     */
    _renderControls(ctx, styleOverride = {}) {
        const { hasBorders, hasControls } = this;
        const styleOptions = {
            hasBorders,
            hasControls,
            ...styleOverride,
        };
        const vpt = this.getViewportTransform(), shouldDrawBorders = styleOptions.hasBorders, shouldDrawControls = styleOptions.hasControls;
        const matrix = multiplyTransformMatrices(vpt, this.calcTransformMatrix());
        const options = qrDecompose(matrix);
        ctx.save();
        ctx.translate(options.translateX, options.translateY);
        ctx.lineWidth = 1 * this.borderScaleFactor;
        if (!this.group) {
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
     * @param {Object} [styleOverride] object to override the object style
     */
    drawBorders(ctx, options, styleOverride) {
        let size;
        if ((styleOverride && styleOverride.forActiveSelection) || this.group) {
            const bbox = sizeAfterTransform(this.width, this.height, options), stroke = (this.strokeUniform
                ? new Point().scalarAdd(this.canvas ? this.canvas.getZoom() : 1)
                : // this is extremely confusing. options comes from the upper function
                    // and is the qrDecompose of a matrix that takes in account zoom too
                    new Point(options.scaleX, options.scaleY)).scalarMultiply(this.strokeWidth);
            size = bbox.add(stroke).scalarAdd(this.borderScaleFactor);
        }
        else {
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
        this.forEachControl(function (control, key, fabricObject) {
            // in this moment, the ctx is centered on the object.
            // width and height of the above function are the size of the bbox.
            if (control.withConnection && control.getVisibility(fabricObject, key)) {
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
     * @param {CanvasRenderingContext2D} ctx Context to draw on
     * @param {Object} styleOverride object to override the object style
     */
    drawControls(ctx, styleOverride = {}) {
        ctx.save();
        const retinaScaling = this.getCanvasRetinaScaling();
        const { cornerStrokeColor, cornerDashArray, cornerColor } = this;
        const options = {
            cornerStrokeColor,
            cornerDashArray,
            cornerColor,
            ...styleOverride,
        };
        ctx.setTransform(retinaScaling, 0, 0, retinaScaling, 0, 0);
        ctx.strokeStyle = ctx.fillStyle = options.cornerColor;
        if (!this.transparentCorners) {
            ctx.strokeStyle = options.cornerStrokeColor;
        }
        this._setLineDash(ctx, options.cornerDashArray);
        this.setCoords();
        this.forEachControl(function (control, key, fabricObject) {
            if (control.getVisibility(fabricObject, key)) {
                const p = fabricObject.oCoords[key];
                control.render(ctx, p.x, p.y, options, fabricObject);
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
        return (this.controls[controlKey] &&
            this.controls[controlKey].getVisibility(this, controlKey));
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
     * Sets the visibility state of object controls, this is hust a bulk option for setControlVisible;
     * @param {Record<string, boolean>} [options] with an optional key per control
     * example: {Boolean} [options.bl] true to enable the bottom-left control, false to disable it
     */
    setControlsVisibility(options = {}) {
        Object.entries(options).forEach(([controlKey, visibility]) => this.setControlVisible(controlKey, visibility));
    }
    /**
     * Clears the canvas.contextTop in a specific area that corresponds to the object's bounding box
     * that is in the canvas.contextContainer.
     * This function is used to clear pieces of contextTop where we render ephemeral effects on top of the object.
     * Example: blinking cursror text selection, drag effects.
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
        const width = this.width + 4, height = this.height + 4;
        ctx.clearRect(-width / 2, -height / 2, width, height);
        restoreManually || ctx.restore();
        return ctx;
    }
    /**
     * This callback function is called every time _discardActiveObject or _setActiveObject
     * try to to deselect this object. If the function returns true, the process is cancelled
     * @param {Object} [options] options sent from the upper functions
     * @param {TPointerEvent} [options.e] event if the process is generated by an event
     * @param {FabricObject} [options.object] next object we are setting as active, and reason why
     * this is being deselected
  
     */
    onDeselect(options) {
        // implemented by sub-classes, as needed.
        return false;
    }
    /**
     * This callback function is called every time _discardActiveObject or _setActiveObject
     * try to to select this object. If the function returns true, the process is cancelled
     * @param {Object} [options] options sent from the upper functions
     * @param {Event} [options.e] event if the process is generated by an event
     */
    onSelect(options) {
        // implemented by sub-classes, as needed.
        return false;
    }
    /**
     * Override to customize drag and drop behavior
     * return true if the object currently dragged can be dropped on the target
     * @public
     * @param {DragEvent} e
     * @returns {boolean}
     */
    canDrop(e) {
        return false;
    }
    /**
     * Override to customize drag and drop behavior
     * render a specific effect when an object is the source of a drag event
     * example: render the selection status for the part of text that is being dragged from a text object
     * @public
     * @param {DragEvent} e
     * @returns {boolean}
     */
    renderDragSourceEffect(e) {
        // for subclasses
    }
    /**
     * Override to customize drag and drop behavior
     * render a specific effect when an object is the target of a drag event
     * used to show that the underly object can receive a drop, or to show how the
     * object will change when dropping. example: show the cursor where the text is about to be dropped
     * @public
     * @param {DragEvent} e
     * @returns {boolean}
     */
    renderDropTargetEffect(e) {
        // for subclasses
    }
}

/***
 * https://www.typescriptlang.org/docs/handbook/mixins.html#alternative-pattern
 */
function applyMixins(derivedCtor, constructors) {
    constructors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            name !== 'constructor' &&
                Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
                    Object.create(null));
        });
    });
    return derivedCtor;
}

class FabricObject extends InteractiveFabricObject {
}
applyMixins(FabricObject, [FabricObjectSVGExportMixin]);
fabric.Object = FabricObject;

/**
 * Attributes parsed from all SVG elements
 * @type array
 */
const SHARED_ATTRIBUTES = [
    'display',
    'transform',
    'fill',
    'fill-opacity',
    'fill-rule',
    'opacity',
    'stroke',
    'stroke-dasharray',
    'stroke-linecap',
    'stroke-dashoffset',
    'stroke-linejoin',
    'stroke-miterlimit',
    'stroke-opacity',
    'stroke-width',
    'id',
    'paint-order',
    'vector-effect',
    'instantiated_by_use',
    'clip-path',
];

//@ts-nocheck
function selectorMatches(element, selector) {
    let nodeName = element.nodeName, classNames = element.getAttribute('class'), id = element.getAttribute('id'), matcher, i;
    // i check if a selector matches slicing away part from it.
    // if i get empty string i should match
    matcher = new RegExp('^' + nodeName, 'i');
    selector = selector.replace(matcher, '');
    if (id && selector.length) {
        matcher = new RegExp('#' + id + '(?![a-zA-Z\\-]+)', 'i');
        selector = selector.replace(matcher, '');
    }
    if (classNames && selector.length) {
        classNames = classNames.split(' ');
        for (i = classNames.length; i--;) {
            matcher = new RegExp('\\.' + classNames[i] + '(?![a-zA-Z\\-]+)', 'i');
            selector = selector.replace(matcher, '');
        }
    }
    return selector.length === 0;
}

//@ts-nocheck
function doesSomeParentMatch(element, selectors) {
    let selector, parentMatching = true;
    while (element.parentNode &&
        element.parentNode.nodeType === 1 &&
        selectors.length) {
        if (parentMatching) {
            selector = selectors.pop();
        }
        element = element.parentNode;
        parentMatching = selectorMatches(element, selector);
    }
    return selectors.length === 0;
}

//@ts-nocheck
/**
 * @private
 */
function elementMatchesRule(element, selectors) {
    let firstMatching, parentMatching = true;
    //start from rightmost selector.
    firstMatching = selectorMatches(element, selectors.pop());
    if (firstMatching && selectors.length) {
        parentMatching = doesSomeParentMatch(element, selectors);
    }
    return firstMatching && parentMatching && selectors.length === 0;
}

//@ts-nocheck
/**
 * @private
 */
function getGlobalStylesForElement(element, svgUid) {
    const styles = {};
    for (const rule in cssRules[svgUid]) {
        if (elementMatchesRule(element, rule.split(' '))) {
            for (const property in cssRules[svgUid][rule]) {
                styles[property] = cssRules[svgUid][rule][property];
            }
        }
    }
    return styles;
}

//@ts-nocheck
function normalizeAttr(attr) {
    // transform attribute names
    if (attr in attributesMap) {
        return attributesMap[attr];
    }
    return attr;
}

//@ts-nocheck
function normalizeValue(attr, value, parentAttributes, fontSize) {
    let isArray = Array.isArray(value), parsed;
    if ((attr === 'fill' || attr === 'stroke') && value === 'none') {
        value = '';
    }
    else if (attr === 'strokeUniform') {
        return value === 'non-scaling-stroke';
    }
    else if (attr === 'strokeDashArray') {
        if (value === 'none') {
            value = null;
        }
        else {
            value = value.replace(/,/g, ' ').split(/\s+/).map(parseFloat);
        }
    }
    else if (attr === 'transformMatrix') {
        if (parentAttributes && parentAttributes.transformMatrix) {
            value = multiplyTransformMatrices(parentAttributes.transformMatrix, parseTransformAttribute(value));
        }
        else {
            value = parseTransformAttribute(value);
        }
    }
    else if (attr === 'visible') {
        value = value !== 'none' && value !== 'hidden';
        // display=none on parent element always takes precedence over child element
        if (parentAttributes && parentAttributes.visible === false) {
            value = false;
        }
    }
    else if (attr === 'opacity') {
        value = parseFloat(value);
        if (parentAttributes && typeof parentAttributes.opacity !== 'undefined') {
            value *= parentAttributes.opacity;
        }
    }
    else if (attr === 'textAnchor' /* text-anchor */) {
        value = value === 'start' ? 'left' : value === 'end' ? 'right' : 'center';
    }
    else if (attr === 'charSpacing') {
        // parseUnit returns px and we convert it to em
        parsed = (parseUnit(value, fontSize) / fontSize) * 1000;
    }
    else if (attr === 'paintFirst') {
        const fillIndex = value.indexOf('fill');
        const strokeIndex = value.indexOf('stroke');
        var value = 'fill';
        if (fillIndex > -1 && strokeIndex > -1 && strokeIndex < fillIndex) {
            value = 'stroke';
        }
        else if (fillIndex === -1 && strokeIndex > -1) {
            value = 'stroke';
        }
    }
    else if (attr === 'href' || attr === 'xlink:href' || attr === 'font') {
        return value;
    }
    else if (attr === 'imageSmoothing') {
        return value === 'optimizeQuality';
    }
    else {
        parsed = isArray ? value.map(parseUnit) : parseUnit(value, fontSize);
    }
    return !isArray && isNaN(parsed) ? value : parsed;
}

//@ts-nocheck
/**
 * Parses a short font declaration, building adding its properties to a style object
 * @static
 * @function
 * @memberOf fabric
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
    fontWeight = match[3], fontSize = match[4], lineHeight = match[5], fontFamily = match[6];
    if (fontStyle) {
        oStyle.fontStyle = fontStyle;
    }
    if (fontWeight) {
        oStyle.fontWeight = isNaN(parseFloat(fontWeight))
            ? fontWeight
            : parseFloat(fontWeight);
    }
    if (fontSize) {
        oStyle.fontSize = parseUnit(fontSize);
    }
    if (fontFamily) {
        oStyle.fontFamily = fontFamily;
    }
    if (lineHeight) {
        oStyle.lineHeight = lineHeight === 'normal' ? 1 : lineHeight;
    }
}

//@ts-nocheck
function parseStyleObject(style, oStyle) {
    let attr, value;
    for (const prop in style) {
        if (typeof style[prop] === 'undefined') {
            continue;
        }
        attr = prop.toLowerCase();
        value = style[prop];
        oStyle[attr] = value;
    }
}

//@ts-nocheck
function parseStyleString(style, oStyle) {
    let attr, value;
    style
        .replace(/;\s*$/, '')
        .split(';')
        .forEach(function (chunk) {
        const pair = chunk.split(':');
        attr = pair[0].trim().toLowerCase();
        value = pair[1].trim();
        oStyle[attr] = value;
    });
}

//@ts-nocheck
/**
 * Parses "style" attribute, retuning an object with values
 * @static
 * @memberOf fabric
 * @param {SVGElement} element Element to parse
 * @return {Object} Objects with values parsed from style attribute of an element
 */
function parseStyleAttribute(element) {
    const oStyle = {}, style = element.getAttribute('style');
    if (!style) {
        return oStyle;
    }
    if (typeof style === 'string') {
        parseStyleString(style, oStyle);
    }
    else {
        parseStyleObject(style, oStyle);
    }
    return oStyle;
}

//@ts-nocheck
/**
 * @private
 * @param {Object} attributes Array of attributes to parse
 */
function setStrokeFillOpacity(attributes) {
    for (const attr in colorAttributes) {
        if (typeof attributes[colorAttributes[attr]] === 'undefined' ||
            attributes[attr] === '') {
            continue;
        }
        if (typeof attributes[attr] === 'undefined') {
            if (!FabricObject.prototype[attr]) {
                continue;
            }
            attributes[attr] = FabricObject.prototype[attr];
        }
        if (attributes[attr].indexOf('url(') === 0) {
            continue;
        }
        const color = new Color(attributes[attr]);
        attributes[attr] = color
            .setAlpha(toFixed(color.getAlpha() * attributes[colorAttributes[attr]], 2))
            .toRgba();
    }
    return attributes;
}

//@ts-nocheck
/**
 * Returns an object of attributes' name/value, given element and an array of attribute names;
 * Parses parent "g" nodes recursively upwards.
 * @param {DOMElement} element Element to parse
 * @param {Array} attributes Array of attributes to parse
 * @return {Object} object containing parsed attributes' names/values
 */
function parseAttributes(element, attributes, svgUid) {
    if (!element) {
        return {};
    }
    let value, parentAttributes = {}, fontSize, parentFontSize;
    if (typeof svgUid === 'undefined') {
        svgUid = element.getAttribute('svgUid');
    }
    // if there's a parent container (`g` or `a` or `symbol` node), parse its attributes recursively upwards
    if (element.parentNode &&
        svgValidParentsRegEx.test(element.parentNode.nodeName)) {
        parentAttributes = parseAttributes(element.parentNode, attributes, svgUid);
    }
    let ownAttributes = attributes.reduce(function (memo, attr) {
        value = element.getAttribute(attr);
        if (value) {
            // eslint-disable-line
            memo[attr] = value;
        }
        return memo;
    }, {});
    // add values parsed from style, which take precedence over attributes
    // (see: http://www.w3.org/TR/SVG/styling.html#UsingPresentationAttributes)
    const cssAttrs = Object.assign(getGlobalStylesForElement(element, svgUid), parseStyleAttribute(element));
    ownAttributes = Object.assign(ownAttributes, cssAttrs);
    if (cssAttrs[cPath]) {
        element.setAttribute(cPath, cssAttrs[cPath]);
    }
    fontSize = parentFontSize =
        parentAttributes.fontSize || DEFAULT_SVG_FONT_SIZE;
    if (ownAttributes[fSize]) {
        // looks like the minimum should be 9px when dealing with ems. this is what looks like in browsers.
        ownAttributes[fSize] = fontSize = parseUnit(ownAttributes[fSize], parentFontSize);
    }
    const normalizedStyle = {};
    for (const attr in ownAttributes) {
        const normalizedAttr = normalizeAttr(attr);
        const normalizedValue = normalizeValue(normalizedAttr, ownAttributes[attr], parentAttributes, fontSize);
        normalizedStyle[normalizedAttr] = normalizedValue;
    }
    if (normalizedStyle && normalizedStyle.font) {
        parseFontDeclaration(normalizedStyle.font, normalizedStyle);
    }
    const mergedAttrs = { ...parentAttributes, ...normalizedStyle };
    return svgValidParentsRegEx.test(element.nodeName)
        ? mergedAttrs
        : setStrokeFillOpacity(mergedAttrs);
}

class Rect extends FabricObject {
    /**
     * Horizontal border radius
     * @type Number
     * @default
     */
    rx;
    /**
     * Vertical border radius
     * @type Number
     * @default
     */
    ry;
    /**
     * Constructor
     * @param {Object} [options] Options object
     * @return {Object} thisArg
     */
    constructor(options) {
        super(options);
        this._initRxRy();
    }
    /**
     * Initializes rx/ry attributes
     * @private
     */
    _initRxRy() {
        const { rx, ry } = this;
        if (rx && !ry) {
            this.ry = rx;
        }
        else if (ry && !rx) {
            this.rx = ry;
        }
    }
    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render(ctx) {
        const { width: w, height: h } = this;
        const x = -w / 2;
        const y = -h / 2;
        const rx = this.rx ? Math.min(this.rx, w / 2) : 0;
        const ry = this.ry ? Math.min(this.ry, h / 2) : 0;
        const isRounded = rx !== 0 || ry !== 0;
        ctx.beginPath();
        ctx.moveTo(x + rx, y);
        ctx.lineTo(x + w - rx, y);
        isRounded &&
            ctx.bezierCurveTo(x + w - kRect * rx, y, x + w, y + kRect * ry, x + w, y + ry);
        ctx.lineTo(x + w, y + h - ry);
        isRounded &&
            ctx.bezierCurveTo(x + w, y + h - kRect * ry, x + w - kRect * rx, y + h, x + w - rx, y + h);
        ctx.lineTo(x + rx, y + h);
        isRounded &&
            ctx.bezierCurveTo(x + kRect * rx, y + h, x, y + h - kRect * ry, x, y + h - ry);
        ctx.lineTo(x, y + ry);
        isRounded &&
            ctx.bezierCurveTo(x, y + kRect * ry, x + kRect * rx, y, x + rx, y);
        ctx.closePath();
        this._renderPaintInOrder(ctx);
    }
    /**
     * Returns object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject(propertiesToInclude = []) {
        return super.toObject(['rx', 'ry', ...propertiesToInclude]);
    }
    /**
     * Returns svg representation of an instance
     * @return {Array} an array of strings with the specific svg representation
     * of the instance
     */
    _toSVG() {
        const { width, height, rx, ry } = this;
        return [
            '<rect ',
            'COMMON_PARTS',
            `x="${-width / 2}" y="${-height / 2}" rx="${rx}" ry="${ry}" width="${width}" height="${height}" />\n`,
        ];
    }
    /**
     * List of attribute names to account for when parsing SVG element (used by `Rect.fromElement`)
     * @static
     * @memberOf Rect
     * @see: http://www.w3.org/TR/SVG/shapes.html#RectElement
     */
    static ATTRIBUTE_NAMES = [
        ...SHARED_ATTRIBUTES,
        'x',
        'y',
        'rx',
        'ry',
        'width',
        'height',
    ];
    /* _FROM_SVG_START_ */
    /**
     * Returns {@link Rect} instance from an SVG element
     * @static
     * @memberOf Rect
     * @param {SVGElement} element Element to parse
     * @param {Function} callback callback function invoked after parsing
     * @param {Object} [options] Options object
     */
    static fromElement(element, callback, options = {}) {
        if (!element) {
            return callback(null);
        }
        const { left = 0, top = 0, width = 0, height = 0, visible = true, ...restOfparsedAttributes } = parseAttributes(element, this.ATTRIBUTE_NAMES);
        const rect = new this({
            ...options,
            ...restOfparsedAttributes,
            left,
            top,
            width,
            height,
            visible: Boolean(visible && width && height),
        });
        callback(rect);
    }
}
const rectDefaultValues = {
    stateProperties: fabricObjectDefaultValues.stateProperties.concat('rx', 'ry'),
    type: 'rect',
    rx: 0,
    ry: 0,
    cacheProperties: fabricObjectDefaultValues.cacheProperties.concat('rx', 'ry'),
};
Object.assign(Rect.prototype, rectDefaultValues);
classRegistry.setClass(Rect);
classRegistry.setSVGClass(Rect);
fabric.Rect = Rect;

// @ts-nocheck
/**
 * @fires object:added
 * @fires object:removed
 * @fires layout once layout completes
 */
class Group extends createCollectionMixin((FabricObject)) {
    /**
     * Specifies the **layout strategy** for instance
     * Used by `getLayoutStrategyResult` to calculate layout
     * `fit-content`, `fit-content-lazy`, `fixed`, `clip-path` are supported out of the box
     * @type LayoutStrategy
     * @default
     */
    layout;
    /**
     * Used to optimize performance
     * set to `false` if you don't need contained objects to be targets of events
     * @default
     * @type boolean
     */
    subTargetCheck;
    /**
     * Used to allow targeting of object inside groups.
     * set to true if you want to select an object inside a group.\
     * **REQUIRES** `subTargetCheck` set to true
     * @default
     * @type boolean
     */
    interactive;
    /**
     * Used internally to optimize performance
     * Once an object is selected, instance is rendered without the selected object.
     * This way instance is cached only once for the entire interaction with the selected object.
     * @private
     */
    _activeObjects = [];
    /**
     * Constructor
     *
     * @param {FabricObject[]} [objects] instance objects
     * @param {Object} [options] Options object
     * @param {boolean} [objectsRelativeToGroup] true if objects exist in group coordinate plane
     */
    constructor(objects = [], options = {}, objectsRelativeToGroup) {
        super();
        this._objects = objects || [];
        this.__objectMonitor = this.__objectMonitor.bind(this);
        this.__objectSelectionTracker = this.__objectSelectionMonitor.bind(this, true);
        this.__objectSelectionDisposer = this.__objectSelectionMonitor.bind(this, false);
        this._firstLayoutDone = false;
        //  setting angle, skewX, skewY must occur after initial layout
        this.set({ ...options, angle: 0, skewX: 0, skewY: 0 });
        this.forEachObject((object) => {
            this.enterGroup(object, false);
        });
        this._applyLayoutStrategy({
            type: 'initialization',
            options,
            objectsRelativeToGroup,
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
            /* _DEV_MODE_START_ */
            console.error('fabric.Group: circular object trees are not supported, this call has no effect');
            /* _DEV_MODE_END_ */
            return false;
        }
        else if (this._objects.indexOf(object) !== -1) {
            // is already in the objects array
            /* _DEV_MODE_START_ */
            console.error('fabric.Group: duplicate objects are not supported inside group, this call has no effect');
            /* _DEV_MODE_END_ */
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
    add(...objects) {
        const allowedObjects = this._filterObjectsBeforeEnteringGroup(objects);
        const size = super.add(...allowedObjects);
        this._onAfterObjectsChange('added', allowedObjects);
        return size;
    }
    /**
     * Inserts an object into collection at specified index
     * @param {FabricObject[]} objects Object to insert
     * @param {Number} index Index to insert object at
     */
    insertAt(index, ...objects) {
        const allowedObjects = this._filterObjectsBeforeEnteringGroup(objects);
        const size = super.insertAt(index, ...allowedObjects);
        this._onAfterObjectsChange('added', allowedObjects);
        return size;
    }
    /**
     * Remove objects
     * @param {...FabricObject[]} objects
     * @returns {FabricObject[]} removed objects
     */
    remove(...objects) {
        const removed = super.remove(...objects);
        this._onAfterObjectsChange('removed', removed);
        return removed;
    }
    _onObjectAdded(object) {
        this.enterGroup(object, true);
        this.fire('object:added', { target: object });
        object.fire('added', { target: this });
    }
    _onRelativeObjectAdded(object) {
        this.enterGroup(object, false);
        this.fire('object:added', { target: object });
        object.fire('added', { target: this });
    }
    /**
     * @private
     * @param {FabricObject} object
     * @param {boolean} [removeParentTransform] true if object should exit group without applying group's transform to it
     */
    _onObjectRemoved(object, removeParentTransform) {
        this.exitGroup(object, removeParentTransform);
        this.fire('object:removed', { target: object });
        object.fire('removed', { target: this });
    }
    /**
     * @private
     * @param {'added'|'removed'} type
     * @param {FabricObject[]} targets
     */
    _onAfterObjectsChange(type, targets) {
        this._applyLayoutStrategy({
            type: type,
            targets: targets,
        });
        this._set('dirty', true);
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
            this.forEachObject((object) => {
                object._set(key, value);
            });
        }
        if (key === 'layout' && prev !== value) {
            this._applyLayoutStrategy({
                type: 'layout_change',
                layout: value,
                prevLayout: prev,
            });
        }
        if (key === 'interactive') {
            this.forEachObject((object) => this._watchObject(value, object));
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
     * invalidates layout on object modified
     * @private
     */
    __objectMonitor(opt) {
        this._applyLayoutStrategy({ ...opt, type: 'object_modified' });
        this._set('dirty', true);
    }
    /**
     * keeps track of the selected objects
     * @private
     */
    __objectSelectionMonitor(selected, opt) {
        const object = opt.target;
        if (selected) {
            this._activeObjects.push(object);
            this._set('dirty', true);
        }
        else if (this._activeObjects.length > 0) {
            const index = this._activeObjects.indexOf(object);
            if (index > -1) {
                this._activeObjects.splice(index, 1);
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
        const directive = watch ? 'on' : 'off';
        //  make sure we listen only once
        watch && this._watchObject(false, object);
        object[directive]('changed', this.__objectMonitor);
        object[directive]('modified', this.__objectMonitor);
        object[directive]('selected', this.__objectSelectionTracker);
        object[directive]('deselected', this.__objectSelectionDisposer);
    }
    /**
     * @private
     * @param {FabricObject} object
     * @param {boolean} [removeParentTransform] true if object is in canvas coordinate plane
     * @returns {boolean} true if object entered group
     */
    enterGroup(object, removeParentTransform) {
        if (object.group) {
            object.group.remove(object);
        }
        this._enterGroup(object, removeParentTransform);
        return true;
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
        this.interactive && this._watchObject(true, object);
        const activeObject = this.canvas &&
            this.canvas.getActiveObject &&
            this.canvas.getActiveObject();
        // if we are adding the activeObject in a group
        if (activeObject &&
            (activeObject === object || object.isDescendantOf(activeObject))) {
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
        object._set('canvas', undefined);
    }
    /**
     * @private
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
     * Decide if the object should cache or not. Create its own cache level
     * needsItsOwnCache should be used when the object drawing method requires
     * a cache step. None of the fabric classes requires it.
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
        if (FabricObject.prototype.willDrawShadow.call(this)) {
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
        return this.ownCaching || (!!this.group && this.group.isOnACache());
    }
    /**
     * Execute the drawing operation for an object on a specified context
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    drawObject(ctx) {
        this._renderBackground(ctx);
        for (let i = 0; i < this._objects.length; i++) {
            this._objects[i].render(ctx);
        }
        this._drawClipPath(ctx, this.clipPath);
    }
    /**
     * Check if cache is dirty
     */
    isCacheDirty(skipCanvas) {
        if (super.isCacheDirty(skipCanvas)) {
            return true;
        }
        if (!this.statefullCache) {
            return false;
        }
        for (let i = 0; i < this._objects.length; i++) {
            if (this._objects[i].isCacheDirty(true)) {
                if (this._cacheCanvas) {
                    // if this group has not a cache canvas there is nothing to clean
                    const x = this.cacheWidth / this.zoomX, y = this.cacheHeight / this.zoomY;
                    this._cacheContext.clearRect(-x / 2, -y / 2, x, y);
                }
                return true;
            }
        }
        return false;
    }
    /**
     * @override
     * @return {Boolean}
     */
    setCoords() {
        super.setCoords();
        this._shouldSetNestedCoords() &&
            this.forEachObject((object) => object.setCoords());
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
     * @public
     * @param {Partial<LayoutResult> & { layout?: string }} [context] pass values to use for layout calculations
     */
    triggerLayout(context) {
        if (context && context.layout) {
            context.prevLayout = this.layout;
            this.layout = context.layout;
        }
        this._applyLayoutStrategy({ type: 'imperative', context });
    }
    /**
     * @private
     * @param {FabricObject} object
     * @param {Point} diff
     */
    _adjustObjectPosition(object, diff) {
        object.set({
            left: object.left + diff.x,
            top: object.top + diff.y,
        });
    }
    /**
     * initial layout logic:
     * calculate bbox of objects (if necessary) and translate it according to options received from the constructor (left, top, width, height)
     * so it is placed in the center of the bbox received from the constructor
     *
     * @private
     * @param {LayoutContext} context
     */
    _applyLayoutStrategy(context) {
        const isFirstLayout = context.type === 'initialization';
        if (!isFirstLayout && !this._firstLayoutDone) {
            //  reject layout requests before initialization layout
            return;
        }
        const options = isFirstLayout && context.options;
        const initialTransform = options && {
            angle: options.angle || 0,
            skewX: options.skewX || 0,
            skewY: options.skewY || 0,
        };
        const center = this.getRelativeCenterPoint();
        let result = this.getLayoutStrategyResult(this.layout, this._objects.concat(), context);
        let diff;
        if (result) {
            //  handle positioning
            const newCenter = new Point(result.centerX, result.centerY);
            const vector = center
                .subtract(newCenter)
                .add(new Point(result.correctionX || 0, result.correctionY || 0));
            diff = vector.transform(invertTransform(this.calcOwnMatrix()), true);
            //  set dimensions
            this.set({ width: result.width, height: result.height });
            //  adjust objects to account for new center
            !context.objectsRelativeToGroup &&
                this.forEachObject((object) => {
                    this._adjustObjectPosition(object, diff);
                });
            //  clip path as well
            !isFirstLayout &&
                this.layout !== 'clip-path' &&
                this.clipPath &&
                !this.clipPath.absolutePositioned &&
                this._adjustObjectPosition(this.clipPath, diff);
            if (!newCenter.eq(center) || initialTransform) {
                //  set position
                this.setPositionByOrigin(newCenter, 'center', 'center');
                initialTransform && this.set(initialTransform);
                this.setCoords();
            }
        }
        else if (isFirstLayout) {
            //  fill `result` with initial values for the layout hook
            result = {
                centerX: center.x,
                centerY: center.y,
                width: this.width,
                height: this.height,
            };
            initialTransform && this.set(initialTransform);
        }
        else {
            //  no `result` so we return
            return;
        }
        //  flag for next layouts
        this._firstLayoutDone = true;
        //  fire layout hook and event (event will fire only for layouts after initialization layout)
        this.onLayout(context, result);
        this.fire('layout', {
            context,
            result,
            diff,
        });
        //  recursive up
        if (this.group && this.group._applyLayoutStrategy) {
            //  append the path recursion to context
            if (!context.path) {
                context.path = [];
            }
            context.path.push(this);
            //  all parents should invalidate their layout
            this.group._applyLayoutStrategy(context);
        }
    }
    /**
     * Override this method to customize layout.
     * If you need to run logic once layout completes use `onLayout`
     * @public
     * @param {string} layoutDirective
     * @param {FabricObject[]} objects
     * @param {LayoutContext} context
     * @returns {LayoutResult | undefined}
     */
    getLayoutStrategyResult(layoutDirective, objects, context) {
        if (layoutDirective === 'fit-content-lazy' &&
            context.type === 'added' &&
            objects.length > context.targets.length) {
            //  calculate added objects' bbox with existing bbox
            const addedObjects = context.targets.concat(this);
            return this.prepareBoundingBox(layoutDirective, addedObjects, context);
        }
        else if (layoutDirective === 'fit-content' ||
            layoutDirective === 'fit-content-lazy' ||
            (layoutDirective === 'fixed' &&
                (context.type === 'initialization' || context.type === 'imperative'))) {
            return this.prepareBoundingBox(layoutDirective, objects, context);
        }
        else if (layoutDirective === 'clip-path' && this.clipPath) {
            const clipPath = this.clipPath;
            const clipPathSizeAfter = clipPath._getTransformedDimensions();
            if (clipPath.absolutePositioned &&
                (context.type === 'initialization' || context.type === 'layout_change')) {
                //  we want the center point to exist in group's containing plane
                const clipPathCenter = clipPath.getCenterPoint();
                if (this.group) {
                    //  send point from canvas plane to group's containing plane
                    const inv = invertTransform(this.group.calcTransformMatrix());
                    clipPathCenter = transformPoint(clipPathCenter, inv);
                }
                return {
                    centerX: clipPathCenter.x,
                    centerY: clipPathCenter.y,
                    width: clipPathSizeAfter.x,
                    height: clipPathSizeAfter.y,
                };
            }
            else if (!clipPath.absolutePositioned) {
                let center;
                const clipPathRelativeCenter = clipPath.getRelativeCenterPoint(), 
                //  we want the center point to exist in group's containing plane, so we send it upwards
                clipPathCenter = transformPoint(clipPathRelativeCenter, this.calcOwnMatrix(), true);
                if (context.type === 'initialization' ||
                    context.type === 'layout_change') {
                    const bbox = this.prepareBoundingBox(layoutDirective, objects, context) || {};
                    center = new Point(bbox.centerX || 0, bbox.centerY || 0);
                    return {
                        centerX: center.x + clipPathCenter.x,
                        centerY: center.y + clipPathCenter.y,
                        correctionX: bbox.correctionX - clipPathCenter.x,
                        correctionY: bbox.correctionY - clipPathCenter.y,
                        width: clipPath.width,
                        height: clipPath.height,
                    };
                }
                else {
                    center = this.getRelativeCenterPoint();
                    return {
                        centerX: center.x + clipPathCenter.x,
                        centerY: center.y + clipPathCenter.y,
                        width: clipPathSizeAfter.x,
                        height: clipPathSizeAfter.y,
                    };
                }
            }
        }
        else if (layoutDirective === 'svg' && context.type === 'initialization') {
            const bbox = this.getObjectsBoundingBox(objects, true) || {};
            return Object.assign(bbox, {
                correctionX: -bbox.offsetX || 0,
                correctionY: -bbox.offsetY || 0,
            });
        }
    }
    /**
     * Override this method to customize layout.
     * A wrapper around {@link Group#getObjectsBoundingBox}
     * @public
     * @param {string} layoutDirective
     * @param {FabricObject[]} objects
     * @param {LayoutContext} context
     * @returns {LayoutResult | undefined}
     */
    prepareBoundingBox(layoutDirective, objects, context) {
        if (context.type === 'initialization') {
            return this.prepareInitialBoundingBox(layoutDirective, objects, context);
        }
        else if (context.type === 'imperative' && context.context) {
            return Object.assign(this.getObjectsBoundingBox(objects) || {}, context.context);
        }
        else {
            return this.getObjectsBoundingBox(objects);
        }
    }
    /**
     * Calculates center taking into account originX, originY while not being sure that width/height are initialized
     * @public
     * @param {string} layoutDirective
     * @param {FabricObject[]} objects
     * @param {LayoutContext} context
     * @returns {LayoutResult | undefined}
     */
    prepareInitialBoundingBox(layoutDirective, objects, context) {
        const options = context.options || {}, hasX = typeof options.left === 'number', hasY = typeof options.top === 'number', hasWidth = typeof options.width === 'number', hasHeight = typeof options.height === 'number';
        //  performance enhancement
        //  skip layout calculation if bbox is defined
        if ((hasX &&
            hasY &&
            hasWidth &&
            hasHeight &&
            context.objectsRelativeToGroup) ||
            objects.length === 0) {
            //  return nothing to skip layout
            return;
        }
        const bbox = this.getObjectsBoundingBox(objects) || {};
        const width = hasWidth ? this.width : bbox.width || 0, height = hasHeight ? this.height : bbox.height || 0, calculatedCenter = new Point(bbox.centerX || 0, bbox.centerY || 0), origin = new Point(resolveOrigin(this.originX), resolveOrigin(this.originY)), size = new Point(width, height), strokeWidthVector = this._getTransformedDimensions({
            width: 0,
            height: 0,
        }), sizeAfter = this._getTransformedDimensions({
            width: width,
            height: height,
            strokeWidth: 0,
        }), bboxSizeAfter = this._getTransformedDimensions({
            width: bbox.width,
            height: bbox.height,
            strokeWidth: 0,
        }), rotationCorrection = new Point(0, 0);
        //  calculate center and correction
        const originT = origin.scalarAdd(0.5);
        const originCorrection = sizeAfter.multiply(originT);
        const centerCorrection = new Point(hasWidth ? bboxSizeAfter.x / 2 : originCorrection.x, hasHeight ? bboxSizeAfter.y / 2 : originCorrection.y);
        const center = new Point(hasX
            ? this.left - (sizeAfter.x + strokeWidthVector.x) * origin.x
            : calculatedCenter.x - centerCorrection.x, hasY
            ? this.top - (sizeAfter.y + strokeWidthVector.y) * origin.y
            : calculatedCenter.y - centerCorrection.y);
        const offsetCorrection = new Point(hasX
            ? center.x - calculatedCenter.x + bboxSizeAfter.x * (hasWidth ? 0.5 : 0)
            : -(hasWidth
                ? (sizeAfter.x - strokeWidthVector.x) * 0.5
                : sizeAfter.x * originT.x), hasY
            ? center.y -
                calculatedCenter.y +
                bboxSizeAfter.y * (hasHeight ? 0.5 : 0)
            : -(hasHeight
                ? (sizeAfter.y - strokeWidthVector.y) * 0.5
                : sizeAfter.y * originT.y)).add(rotationCorrection);
        const correction = new Point(hasWidth ? -sizeAfter.x / 2 : 0, hasHeight ? -sizeAfter.y / 2 : 0).add(offsetCorrection);
        return {
            centerX: center.x,
            centerY: center.y,
            correctionX: correction.x,
            correctionY: correction.y,
            width: size.x,
            height: size.y,
        };
    }
    /**
     * Calculate the bbox of objects relative to instance's containing plane
     * @public
     * @param {FabricObject[]} objects
     * @returns {LayoutResult | null} bounding box
     */
    getObjectsBoundingBox(objects, ignoreOffset) {
        if (objects.length === 0) {
            return null;
        }
        let min, max;
        objects.forEach((object, i) => {
            const objCenter = object.getRelativeCenterPoint();
            let sizeVector = object._getTransformedDimensions().scalarDivide(2);
            if (object.angle) {
                const rad = degreesToRadians(object.angle), sine = Math.abs(sin(rad)), cosine = Math.abs(cos(rad)), rx = sizeVector.x * cosine + sizeVector.y * sine, ry = sizeVector.x * sine + sizeVector.y * cosine;
                sizeVector = new Point(rx, ry);
            }
            const a = objCenter.subtract(sizeVector);
            const b = objCenter.add(sizeVector);
            if (i === 0) {
                min = new Point(Math.min(a.x, b.x), Math.min(a.y, b.y));
                max = new Point(Math.max(a.x, b.x), Math.max(a.y, b.y));
            }
            else {
                min.setXY(Math.min(min.x, a.x, b.x), Math.min(min.y, a.y, b.y));
                max.setXY(Math.max(max.x, a.x, b.x), Math.max(max.y, a.y, b.y));
            }
        });
        const size = max.subtract(min), relativeCenter = ignoreOffset
            ? size.scalarDivide(2)
            : min.midPointFrom(max), 
        //  we send `relativeCenter` up to group's containing plane
        offset = min.transform(this.calcOwnMatrix()), center = relativeCenter.transform(this.calcOwnMatrix());
        return {
            offsetX: offset.x,
            offsetY: offset.y,
            centerX: center.x,
            centerY: center.y,
            width: size.x,
            height: size.y,
        };
    }
    /**
     * Hook that is called once layout has completed.
     * Provided for layout customization, override if necessary.
     * Complements `getLayoutStrategyResult`, which is called at the beginning of layout.
     * @public
     * @param {LayoutContext} context layout context
     * @param {LayoutResult} result layout result
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    onLayout(context, result) { }
    /**
     *
     * @private
     * @param {'toObject'|'toDatalessObject'} [method]
     * @param {string[]} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @returns {FabricObject[]} serialized objects
     */
    __serializeObjects(method, propertiesToInclude) {
        const _includeDefaultValues = this.includeDefaultValues;
        return this._objects
            .filter(function (obj) {
            return !obj.excludeFromExport;
        })
            .map(function (obj) {
            const originalDefaults = obj.includeDefaultValues;
            obj.includeDefaultValues = _includeDefaultValues;
            const data = obj[method || 'toObject'](propertiesToInclude);
            obj.includeDefaultValues = originalDefaults;
            //delete data.version;
            return data;
        });
    }
    /**
     * Returns object representation of an instance
     * @param {string[]} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject(propertiesToInclude = []) {
        const obj = super.toObject([
            'layout',
            'subTargetCheck',
            'interactive',
            ...propertiesToInclude,
        ]);
        obj.objects = this.__serializeObjects('toObject', propertiesToInclude);
        return obj;
    }
    toString() {
        return `#<Group: (${this.complexity()})>`;
    }
    dispose() {
        this._activeObjects = [];
        this.forEachObject((object) => {
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
        const fillStroke = Rect.prototype._toSVG.call(this, reviver);
        const commons = fillStroke.indexOf('COMMON_PARTS');
        fillStroke[commons] = 'for="group" ';
        return fillStroke.join('');
    }
    /**
     * Returns svg representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
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
        const opacity = typeof this.opacity !== 'undefined' && this.opacity !== 1
            ? `opacity: ${this.opacity};`
            : '', visibility = this.visible ? '' : ' visibility: hidden;';
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
            reviver,
        });
    }
    /**
     * @todo support loading from svg
     * @private
     * @static
     * @memberOf Group
     * @param {Object} object Object to create a group from
     * @returns {Promise<Group>}
     */
    static fromObject({ objects = [], ...options }) {
        return Promise.all([
            enlivenObjects(objects),
            enlivenObjectEnlivables(options),
        ]).then(([objects, hydratedOptions]) => new this(objects, { ...options, ...hydratedOptions }, true));
    }
}
const groupDefaultValues = {
    type: 'group',
    layout: 'fit-content',
    strokeWidth: 0,
    stateProperties: fabricObjectDefaultValues.stateProperties.concat('layout'),
    subTargetCheck: false,
    interactive: false,
};
Object.assign(Group.prototype, groupDefaultValues);
classRegistry.setClass(Group);
fabric.Group = Group;

class ActiveSelection extends Group {
    constructor(objects, options, objectsRelativeToGroup) {
        super(objects, options, objectsRelativeToGroup);
        this.setCoords();
    }
    /**
     * @private
     */
    _shouldSetNestedCoords() {
        return true;
    }
    /**
     * @private
     * @param {FabricObject} object
     * @param {boolean} [removeParentTransform] true if object is in canvas coordinate plane
     * @returns {boolean} true if object entered group
     */
    enterGroup(object, removeParentTransform) {
        if (object.group) {
            //  save ref to group for later in order to return to it
            const parent = object.group;
            parent._exitGroup(object);
            object.__owningGroup = parent;
        }
        this._enterGroup(object, removeParentTransform);
        return true;
    }
    /**
     * we want objects to retain their canvas ref when exiting instance
     * @private
     * @param {FabricObject} object
     * @param {boolean} [removeParentTransform] true if object should exit group without applying group's transform to it
     */
    exitGroup(object, removeParentTransform) {
        this._exitGroup(object, removeParentTransform);
        const parent = object.__owningGroup;
        if (parent) {
            //  return to owning group
            parent.enterGroup(object);
            delete object.__owningGroup;
        }
    }
    /**
     * @private
     * @param {'added'|'removed'} type
     * @param {FabricObject[]} targets
     */
    _onAfterObjectsChange(type, targets) {
        super._onAfterObjectsChange(type, targets);
        const groups = [];
        targets.forEach((object) => {
            object.group &&
                !groups.includes(object.group) &&
                groups.push(object.group);
        });
        if (type === 'removed') {
            //  invalidate groups' layout and mark as dirty
            groups.forEach((group) => {
                group._onAfterObjectsChange('added', targets);
            });
        }
        else {
            //  mark groups as dirty
            groups.forEach((group) => {
                group._set('dirty', true);
            });
        }
    }
    /**
     * If returns true, deselection is cancelled.
     * @since 2.0.0
     * @return {Boolean} [cancel]
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
     * Decide if the object should cache or not. Create its own cache level
     * objectCaching is a global flag, wins over everything
     * needsItsOwnCache should be used when the object drawing method requires
     * a cache step. None of the fabric classes requires it.
     * Generally you do not cache objects in groups because the group outside is cached.
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
        super._renderControls(ctx, styleOverride);
        const options = {
            hasControls: false,
            ...childrenOverride,
            forActiveSelection: true,
        };
        for (let i = 0; i < this._objects.length; i++) {
            this._objects[i]._renderControls(ctx, options);
        }
        ctx.restore();
    }
}
const activeSelectionDefaultValues = {
    ...groupDefaultValues,
    type: 'activeSelection',
    layout: 'fit-content',
    subTargetCheck: false,
    interactive: false,
};
Object.assign(ActiveSelection.prototype, activeSelectionDefaultValues);
classRegistry.setClass(ActiveSelection);
fabric.ActiveSelection = ActiveSelection;

//@ts-nocheck
const touchEvents = ['touchstart', 'touchmove', 'touchend'];
function getTouchInfo(event) {
    const touchProp = event.changedTouches;
    if (touchProp && touchProp[0]) {
        return touchProp[0];
    }
    return event;
}
const getPointer = (event) => {
    const element = event.target, scroll = getScrollLeftTop(element), _evt = getTouchInfo(event);
    return new Point(_evt.clientX + scroll.left, _evt.clientY + scroll.top);
};
const isTouchEvent = (event) => touchEvents.indexOf(event.type) > -1 || event.pointerType === 'touch';
const stopEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
};

/**
 * We are actually looking for the transformation from the destination plane to the source plane (change of basis matrix)\
 * The object will exist on the destination plane and we want it to seem unchanged by it so we invert the destination matrix (`to`) and then apply the source matrix (`from`)
 * @param [from]
 * @param [to]
 * @returns
 */
const calcPlaneChangeMatrix = (from = iMatrix, to = iMatrix) => multiplyTransformMatrices(invertTransform(to), from);
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
 * @see {transformPointRelativeToCanvas} for transforming relative to canvas
 * @param {Point} point
 * @param {TMat2D} [from] plane matrix containing object. Passing `undefined` is equivalent to passing the identity matrix, which means `point` exists in the canvas coordinate plane.
 * @param {TMat2D} [to] destination plane matrix to contain object. Passing `undefined` means `point` should be sent to the canvas coordinate plane.
 * @returns {Point} transformed point
 */
const sendPointToPlane = (point, from = iMatrix, to = iMatrix) => 
//  we are actually looking for the transformation from the destination plane to the source plane (which is a linear mapping)
//  the object will exist on the destination plane and we want it to seem unchanged by it so we reverse the destination matrix (to) and then apply the source matrix (from)
point.transform(calcPlaneChangeMatrix(from, to));

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
    return transform.originX === 'center' && transform.originY === 'center';
}
function invertOrigin(origin) {
    return -resolveOrigin(origin) + 0.5;
}
const isLocked = (target, lockingKey) => target[lockingKey];
const commonEventInfo = (eventData, transform, x, y) => {
    return {
        e: eventData,
        transform,
        pointer: new Point(x, y),
    };
};
/**
 * Combine control position and object angle to find the control direction compared
 * to the object center.
 * @param {FabricObject} fabricObject the fabric object for which we are rendering controls
 * @param {Control} control the control class
 * @return {Number} 0 - 7 a quadrant number
 */
function findCornerQuadrant(fabricObject, control) {
    //  angle is relative to canvas plane
    const angle = fabricObject.getTotalAngle(), cornerAngle = angle + radiansToDegrees(Math.atan2(control.y, control.x)) + 360;
    return Math.round((cornerAngle % 360) / 45);
}
/**
 * @returns the normalized point (rotated relative to center) in local coordinates
 */
function normalizePoint(target, point, originX, originY) {
    const center = target.getRelativeCenterPoint(), p = typeof originX !== 'undefined' && typeof originY !== 'undefined'
        ? target.translateToGivenOrigin(center, 'center', 'center', originX, originY)
        : new Point(target.left, target.top), p2 = target.angle
        ? point.rotate(-degreesToRadians(target.angle), center)
        : point;
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
function getLocalPoint({ target, corner }, originX, originY, x, y) {
    const control = target.controls[corner], zoom = target.canvas?.getZoom() || 1, padding = target.padding / zoom, localPoint = normalizePoint(target, new Point(x, y), originX, originY);
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

const fireEvent = (eventName, options) => {
    const { transform: { target }, } = options;
    target.canvas?.fire(`object:${eventName}`, {
        ...options,
        target,
    });
    target.fire(eventName, options);
};

/**
 * Wrap an action handler with firing an event if the action is performed
 * @param {Function} actionHandler the function to wrap
 * @return {Function} a function with an action handler signature
 */
const wrapWithFireEvent = (eventName, actionHandler) => {
    return ((eventData, transform, x, y) => {
        const actionPerformed = actionHandler(eventData, transform, x, y);
        if (actionPerformed) {
            fireEvent(eventName, commonEventInfo(eventData, transform, x, y));
        }
        return actionPerformed;
    });
};

/**
 * Wrap an action handler with saving/restoring object position on the transform.
 * this is the code that permits to objects to keep their position while transforming.
 * @param {Function} actionHandler the function to wrap
 * @return {Function} a function with an action handler signature
 */
function wrapWithFixedAnchor(actionHandler) {
    return ((eventData, transform, x, y) => {
        const { target, originX, originY } = transform, centerPoint = target.getRelativeCenterPoint(), constraint = target.translateToOriginPoint(centerPoint, originX, originY), actionPerformed = actionHandler(eventData, transform, x, y);
        target.setPositionByOrigin(constraint, originX, originY);
        return actionPerformed;
    });
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
    if (transform.originX === 'center' ||
        (transform.originX === 'right' && localPoint.x < 0) ||
        (transform.originX === 'left' && localPoint.x > 0)) {
        const { target } = transform, strokePadding = target.strokeWidth / (target.strokeUniform ? target.scaleX : 1), multiplier = isTransformCentered(transform) ? 2 : 1, oldWidth = target.width, newWidth = Math.ceil(Math.abs((localPoint.x * multiplier) / target.scaleX) - strokePadding);
        target.set('width', Math.max(newWidth, 0));
        //  check against actual target width in case `newWidth` was rejected
        return oldWidth !== target.width;
    }
    return false;
};
const changeWidth = wrapWithFireEvent('resizing', wrapWithFixedAnchor(changeObjectWidth));

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
    const xSize = this.sizeX || styleOverride.cornerSize || fabricObject.cornerSize, ySize = this.sizeY || styleOverride.cornerSize || fabricObject.cornerSize, transparentCorners = typeof styleOverride.transparentCorners !== 'undefined'
        ? styleOverride.transparentCorners
        : fabricObject.transparentCorners, methodName = transparentCorners ? 'stroke' : 'fill', stroke = !transparentCorners &&
        (styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor);
    let myLeft = left, myTop = top, size;
    ctx.save();
    ctx.fillStyle = styleOverride.cornerColor || fabricObject.cornerColor || '';
    ctx.strokeStyle =
        styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor || '';
    // TODO: use proper ellipse code.
    if (xSize > ySize) {
        size = xSize;
        ctx.scale(1.0, ySize / xSize);
        myTop = (top * xSize) / ySize;
    }
    else if (ySize > xSize) {
        size = ySize;
        ctx.scale(xSize / ySize, 1.0);
        myLeft = (left * ySize) / xSize;
    }
    else {
        size = xSize;
    }
    // this is still wrong
    ctx.lineWidth = 1;
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
    const xSize = this.sizeX || styleOverride.cornerSize || fabricObject.cornerSize, ySize = this.sizeY || styleOverride.cornerSize || fabricObject.cornerSize, transparentCorners = typeof styleOverride.transparentCorners !== 'undefined'
        ? styleOverride.transparentCorners
        : fabricObject.transparentCorners, methodName = transparentCorners ? 'stroke' : 'fill', stroke = !transparentCorners &&
        (styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor), xSizeBy2 = xSize / 2, ySizeBy2 = ySize / 2;
    ctx.save();
    ctx.fillStyle = styleOverride.cornerColor || fabricObject.cornerColor || '';
    ctx.strokeStyle =
        styleOverride.cornerStrokeColor || fabricObject.cornerStrokeColor || '';
    // this is still wrong
    ctx.lineWidth = 1;
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
    const { target, offsetX, offsetY } = transform, newLeft = x - offsetX, newTop = y - offsetY, moveX = !isLocked(target, 'lockMovementX') && target.left !== newLeft, moveY = !isLocked(target, 'lockMovementY') && target.top !== newTop;
    moveX && target.set('left', newLeft);
    moveY && target.set('top', newTop);
    if (moveX || moveY) {
        fireEvent('moving', commonEventInfo(eventData, transform, x, y));
    }
    return moveX || moveY;
};

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
const rotateObjectWithSnapping = (eventData, { target, ex, ey, theta, originX, originY }, x, y) => {
    const pivotPoint = target.translateToOriginPoint(target.getRelativeCenterPoint(), originX, originY);
    if (isLocked(target, 'lockRotation')) {
        return false;
    }
    const lastAngle = Math.atan2(ey - pivotPoint.y, ex - pivotPoint.x), curAngle = Math.atan2(y - pivotPoint.y, x - pivotPoint.x);
    let angle = radiansToDegrees(curAngle - lastAngle + theta);
    if (target.snapAngle && target.snapAngle > 0) {
        const snapAngle = target.snapAngle, snapThreshold = target.snapThreshold || snapAngle, rightAngleLocked = Math.ceil(angle / snapAngle) * snapAngle, leftAngleLocked = Math.floor(angle / snapAngle) * snapAngle;
        if (Math.abs(angle - leftAngleLocked) < snapThreshold) {
            angle = leftAngleLocked;
        }
        else if (Math.abs(angle - rightAngleLocked) < snapThreshold) {
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
const rotationWithSnapping = wrapWithFireEvent('rotating', wrapWithFixedAnchor(rotateObjectWithSnapping));

/**
 * Inspect event and fabricObject properties to understand if the scaling action
 * @param {Event} eventData from the user action
 * @param {FabricObject} fabricObject the fabric object about to scale
 * @return {Boolean} true if scale is proportional
 */
function scaleIsProportional(eventData, fabricObject) {
    const canvas = fabricObject.canvas, uniformIsToggled = eventData[canvas.uniScaleKey];
    return ((canvas.uniformScaling && !uniformIsToggled) ||
        (!canvas.uniformScaling && uniformIsToggled));
}
/**
 * Inspect fabricObject to understand if the current scaling action is allowed
 * @param {FabricObject} fabricObject the fabric object about to scale
 * @param {String} by 'x' or 'y' or ''
 * @param {Boolean} scaleProportionally true if we are trying to scale proportionally
 * @return {Boolean} true if scaling is not allowed at current conditions
 */
function scalingIsForbidden(fabricObject, by, scaleProportionally) {
    const lockX = isLocked(fabricObject, 'lockScalingX'), lockY = isLocked(fabricObject, 'lockScalingY');
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
const scaleCursorStyleHandler = (eventData, control, fabricObject) => {
    const scaleProportionally = scaleIsProportional(eventData, fabricObject), by = control.x !== 0 && control.y === 0
        ? 'x'
        : control.x === 0 && control.y !== 0
            ? 'y'
            : '';
    if (scalingIsForbidden(fabricObject, by, scaleProportionally)) {
        return NOT_ALLOWED_CURSOR;
    }
    const n = findCornerQuadrant(fabricObject, control);
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
function scaleObject(eventData, transform, x, y, options = {}) {
    const target = transform.target, by = options.by, scaleProportionally = scaleIsProportional(eventData, target), forbidScaling = scalingIsForbidden(target, by, scaleProportionally);
    let newPoint, scaleX, scaleY, dim, signX, signY;
    if (forbidScaling) {
        return false;
    }
    if (transform.gestureScale) {
        scaleX = transform.scaleX * transform.gestureScale;
        scaleY = transform.scaleY * transform.gestureScale;
    }
    else {
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
        if (isLocked(target, 'lockScalingFlip') &&
            (transform.signX !== signX || transform.signY !== signY)) {
            return false;
        }
        dim = target._getTransformedDimensions();
        // missing detection of flip and logic to switch the origin
        if (scaleProportionally && !by) {
            // uniform scaling
            const distance = Math.abs(newPoint.x) + Math.abs(newPoint.y), { original } = transform, originalDistance = Math.abs((dim.x * original.scaleX) / target.scaleX) +
                Math.abs((dim.y * original.scaleY) / target.scaleY), scale = distance / originalDistance;
            scaleX = original.scaleX * scale;
            scaleY = original.scaleY * scale;
        }
        else {
            scaleX = Math.abs((newPoint.x * target.scaleX) / dim.x);
            scaleY = Math.abs((newPoint.y * target.scaleY) / dim.y);
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
    // minScale is taken are in the setter.
    const oldScaleX = target.scaleX, oldScaleY = target.scaleY;
    if (!by) {
        !isLocked(target, 'lockScalingX') && target.set('scaleX', scaleX);
        !isLocked(target, 'lockScalingY') && target.set('scaleY', scaleY);
    }
    else {
        // forbidden cases already handled on top here.
        by === 'x' && target.set('scaleX', scaleX);
        by === 'y' && target.set('scaleY', scaleY);
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
    return scaleObject(eventData, transform, x, y, { by: 'x' });
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
    return scaleObject(eventData, transform, x, y, { by: 'y' });
};
const scalingEqually = wrapWithFireEvent('scaling', wrapWithFixedAnchor(scaleObjectFromCorner));
const scalingX = wrapWithFireEvent('scaling', wrapWithFixedAnchor(scaleObjectX));
const scalingY = wrapWithFireEvent('scaling', wrapWithFixedAnchor(scaleObjectY));

const AXIS_KEYS = {
    x: {
        counterAxis: 'y',
        scale: 'scaleX',
        skew: 'skewX',
        lockSkewing: 'lockSkewingX',
        origin: 'originX',
        flip: 'flipX',
    },
    y: {
        counterAxis: 'x',
        scale: 'scaleY',
        skew: 'skewY',
        lockSkewing: 'lockSkewingY',
        origin: 'originY',
        flip: 'flipY',
    },
};
const skewMap = ['ns', 'nesw', 'ew', 'nwse'];
/**
 * return the correct cursor style for the skew action
 * @param {Event} eventData the javascript event that is causing the scale
 * @param {Control} control the control that is interested in the action
 * @param {FabricObject} fabricObject the fabric object that is interested in the action
 * @return {String} a valid css string for the cursor
 */
const skewCursorStyleHandler = (eventData, control, fabricObject) => {
    if (control.x !== 0 && isLocked(fabricObject, 'lockSkewingY')) {
        return NOT_ALLOWED_CURSOR;
    }
    if (control.y !== 0 && isLocked(fabricObject, 'lockSkewingX')) {
        return NOT_ALLOWED_CURSOR;
    }
    const n = findCornerQuadrant(fabricObject, control) % 4;
    return `${skewMap[n]}-resize`;
};
/**
 * Since skewing is applied before scaling, calculations are done in a scaleless plane
 * @see https://github.com/fabricjs/fabric.js/pull/8380
 */
function skewObject(axis, { target, ex, ey, skewingSide, ...transform }, pointer) {
    const { skew: skewKey } = AXIS_KEYS[axis], offset = pointer
        .subtract(new Point(ex, ey))
        .divide(new Point(target.scaleX, target.scaleY))[axis], skewingBefore = target[skewKey], skewingStart = transform[skewKey], shearingStart = Math.tan(degreesToRadians(skewingStart)), 
    // let a, b be the size of target
    // let a' be the value of a after applying skewing
    // then:
    // a' = a + b * skewA => skewA = (a' - a) / b
    // the value b is tricky since skewY is applied before skewX
    b = axis === 'y'
        ? target._getTransformedDimensions({
            scaleX: 1,
            scaleY: 1,
            // since skewY is applied before skewX, b (=width) is not affected by skewX
            skewX: 0,
        }).x
        : target._getTransformedDimensions({
            scaleX: 1,
            scaleY: 1,
        }).y;
    const shearing = (2 * offset * skewingSide) /
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
        const { skewX, scaleX } = target, dimBefore = target._getTransformedDimensions({ skewY: skewingBefore }), dimAfter = target._getTransformedDimensions(), compensationFactor = skewX !== 0 ? dimBefore.x / dimAfter.x : 1;
        compensationFactor !== 1 &&
            target.set('scaleX', compensationFactor * scaleX);
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
    const { target } = transform, { counterAxis, origin: originKey, lockSkewing: lockSkewingKey, skew: skewKey, flip: flipKey, } = AXIS_KEYS[axis];
    if (isLocked(target, lockSkewingKey)) {
        return false;
    }
    const { origin: counterOriginKey, flip: counterFlipKey } = AXIS_KEYS[counterAxis], counterOriginFactor = resolveOrigin(transform[counterOriginKey]) *
        (target[counterFlipKey] ? -1 : 1), 
    // if the counter origin is top/left (= -0.5) then we are skewing x/y values on the bottom/right side of target respectively.
    // if the counter origin is bottom/right (= 0.5) then we are skewing x/y values on the top/left side of target respectively.
    // skewing direction on the top/left side of target is OPPOSITE to the direction of the movement of the pointer,
    // so we factor skewing direction by this value.
    skewingSide = (-Math.sign(counterOriginFactor) *
        (target[flipKey] ? -1 : 1)), skewingDirection = ((target[skewKey] === 0 &&
        // in case skewing equals 0 we use the pointer offset from target center to determine the direction of skewing
        getLocalPoint(transform, 'center', 'center', x, y)[axis] > 0) ||
        // in case target has skewing we use that as the direction
        target[skewKey] > 0
        ? 1
        : -1) * skewingSide, 
    // anchor to the opposite side of the skewing direction
    // normalize value from [-1, 1] to origin value [0, 1]
    origin = -skewingDirection * 0.5 + 0.5;
    const finalHandler = wrapWithFireEvent('skewing', wrapWithFixedAnchor((eventData, transform, x, y) => skewObject(axis, transform, new Point(x, y))));
    return finalHandler(eventData, {
        ...transform,
        [originKey]: origin,
        skewingSide,
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
        return isAlternative ? 'skewX' : 'scaleY';
    }
    if (control.y === 0) {
        // then is scaleY or skewX
        return isAlternative ? 'skewY' : 'scaleX';
    }
};
/**
 * Combine skew and scale style handlers to cover fabric standard use case
 * @param {Event} eventData the javascript event that is causing the scale
 * @param {Control} control the control that is interested in the action
 * @param {FabricObject} fabricObject the fabric object that is interested in the action
 * @return {String} a valid css string for the cursor
 */
const scaleSkewCursorStyleHandler = (eventData, control, fabricObject) => {
    return isAltAction(eventData, fabricObject)
        ? skewCursorStyleHandler(eventData, control, fabricObject)
        : scaleCursorStyleHandler(eventData, control, fabricObject);
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
    return isAltAction(eventData, transform.target)
        ? skewHandlerY(eventData, transform, x, y)
        : scalingX(eventData, transform, x, y);
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
    return isAltAction(eventData, transform.target)
        ? skewHandlerX(eventData, transform, x, y)
        : scalingY(eventData, transform, x, y);
};

/**
 * @todo remove as unused
 */
fabric.controlsUtils = {
    scaleCursorStyleHandler,
    skewCursorStyleHandler,
    scaleSkewCursorStyleHandler,
    rotationWithSnapping,
    scalingEqually,
    scalingX,
    scalingY,
    scalingYOrSkewingX,
    scalingXOrSkewingY,
    changeWidth,
    skewHandlerX,
    skewHandlerY,
    dragHandler,
    scaleOrSkewActionName,
    rotationStyleHandler,
    wrapWithFixedAnchor,
    wrapWithFireEvent,
    getLocalPoint,
    renderCircleControl,
    renderSquareControl,
};

/**
 * Returns true if context has transparent pixel
 * at specified location (taking tolerance into account)
 * @param {CanvasRenderingContext2D} ctx context
 * @param {Number} x x coordinate in canvasElementCoordinate, not fabric space
 * @param {Number} y y coordinate in canvasElementCoordinate, not fabric space
 * @param {Number} tolerance Tolerance pixels around the point, not alpha tolerance
 * @return {boolean} true if transparent
 */
const isTransparent = (ctx, x, y, tolerance) => {
    // If tolerance is > 0 adjust start coords to take into account.
    // If moves off Canvas fix to 0
    if (tolerance > 0) {
        if (x > tolerance) {
            x -= tolerance;
        }
        else {
            x = 0;
        }
        if (y > tolerance) {
            y -= tolerance;
        }
        else {
            y = 0;
        }
    }
    let _isTransparent = true;
    const { data } = ctx.getImageData(x, y, tolerance * 2 || 1, tolerance * 2 || 1);
    const l = data.length;
    // Split image data - for tolerance > 1, pixelDataSize = 4;
    for (let i = 3; i < l; i += 4) {
        const alphaChannel = data[i];
        if (alphaChannel > 0) {
            // Stop if colour found
            _isTransparent = false;
            break;
        }
    }
    return _isTransparent;
};

//@ts-nocheck
// TODO this file needs to go away, cross browser style support is not fabricjs domain.
/**
 * wrapper for setting element's style
 * @param {HTMLElement} element
 * @param {Object | string} styles
 */
function setStyle(element, styles) {
    const elementStyle = element.style;
    if (!elementStyle) {
        return;
    }
    else if (typeof styles === 'string') {
        element.style.cssText += ';' + styles;
    }
    else {
        Object.entries(styles).forEach(([property, value]) => elementStyle.setProperty(property, value));
    }
}

/**
 * Canvas class
 * @class Canvas
 * @extends StaticCanvas
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-1#canvas}
 *
 * @fires object:modified at the end of a transform or any change when statefull is true
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
 *  !flag && this.callSuper('canDrop', e);
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
class SelectableCanvas extends StaticCanvas {
    /**
     * When true, objects can be transformed by one side (unproportionally)
     * when dragged on the corners that normally would not do that.
     * @type Boolean
     * @default
     * @since fabric 4.0 // changed name and default value
     */
    uniformScaling;
    /**
     * Indicates which key switches uniform scaling.
     * values: 'altKey', 'shiftKey', 'ctrlKey'.
     * If `null` or 'none' or any other string that is not a modifier key
     * feature is disabled.
     * totally wrong named. this sounds like `uniform scaling`
     * if Canvas.uniformScaling is true, pressing this will set it to false
     * and viceversa.
     * @since 1.6.2
     * @type ModifierKey
     * @default
     */
    uniScaleKey;
    /**
     * When true, objects use center point as the origin of scale transformation.
     * <b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).
     * @since 1.3.4
     * @type Boolean
     * @default
     */
    centeredScaling;
    /**
     * When true, objects use center point as the origin of rotate transformation.
     * <b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).
     * @since 1.3.4
     * @type Boolean
     * @default
     */
    centeredRotation;
    /**
     * Indicates which key enable centered Transform
     * values: 'altKey', 'shiftKey', 'ctrlKey'.
     * If `null` or 'none' or any other string that is not a modifier key
     * feature is disabled feature disabled.
     * @since 1.6.2
     * @type ModifierKey
     * @default
     */
    centeredKey;
    /**
     * Indicates which key enable alternate action on corner
     * values: 'altKey', 'shiftKey', 'ctrlKey'.
     * If `null` or 'none' or any other string that is not a modifier key
     * feature is disabled feature disabled.
     * @since 1.6.2
     * @type ModifierKey
     * @default
     */
    altActionKey;
    /**
     * Indicates that canvas is interactive. This property should not be changed.
     * @type Boolean
     * @default
     */
    interactive = true;
    /**
     * Indicates whether group selection should be enabled
     * @type Boolean
     * @default
     */
    selection;
    /**
     * Indicates which key or keys enable multiple click selection
     * Pass value as a string or array of strings
     * values: 'altKey', 'shiftKey', 'ctrlKey'.
     * If `null` or empty or containing any other string that is not a modifier key
     * feature is disabled.
     * @since 1.6.2
     * @type ModifierKey|ModifierKey[]
     * @default
     */
    selectionKey;
    /**
     * Indicates which key enable alternative selection
     * in case of target overlapping with active object
     * values: 'altKey', 'shiftKey', 'ctrlKey'.
     * For a series of reason that come from the general expectations on how
     * things should work, this feature works only for preserveObjectStacking true.
     * If `null` or 'none' or any other string that is not a modifier key
     * feature is disabled.
     * @since 1.6.5
     * @type null|ModifierKey
     * @default
     */
    altSelectionKey;
    /**
     * Color of selection
     * @type String
     * @default
     */
    selectionColor;
    /**
     * Default dash array pattern
     * If not empty the selection border is dashed
     * @type Array
     */
    selectionDashArray;
    /**
     * Color of the border of selection (usually slightly darker than color of selection itself)
     * @type String
     * @default
     */
    selectionBorderColor;
    /**
     * Width of a line used in object/group selection
     * @type Number
     * @default
     */
    selectionLineWidth;
    /**
     * Select only shapes that are fully contained in the dragged selection rectangle.
     * @type Boolean
     * @default
     */
    selectionFullyContained;
    /**
     * Default cursor value used when hovering over an object on canvas
     * @type CSSStyleDeclaration['cursor']
     * @default move
     */
    hoverCursor;
    /**
     * Default cursor value used when moving an object on canvas
     * @type CSSStyleDeclaration['cursor']
     * @default move
     */
    moveCursor;
    /**
     * Default cursor value used for the entire canvas
     * @type String
     * @default default
     */
    defaultCursor;
    /**
     * Cursor value used during free drawing
     * @type String
     * @default crosshair
     */
    freeDrawingCursor;
    /**
     * Cursor value used for disabled elements ( corners with disabled action )
     * @type String
     * @since 2.0.0
     * @default not-allowed
     */
    notAllowedCursor;
    /**
     * Default element class that's given to wrapper (div) element of canvas
     * @type String
     * @default
     */
    containerClass;
    /**
     * When true, object detection happens on per-pixel basis rather than on per-bounding-box
     * @type Boolean
     * @default
     */
    perPixelTargetFind;
    /**
     * Number of pixels around target pixel to tolerate (consider active) during object detection
     * @type Number
     * @default
     */
    targetFindTolerance;
    /**
     * When true, target detection is skipped. Target detection will return always undefined.
     * click selection won't work anymore, events will fire with no targets.
     * if something is selected before setting it to true, it will be deselected at the first click.
     * area selection will still work. check the `selection` property too.
     * if you deactivate both, you should look into staticCanvas.
     * @type Boolean
     * @default
     */
    skipTargetFind;
    /**
     * When true, mouse events on canvas (mousedown/mousemove/mouseup) result in free drawing.
     * After mousedown, mousemove creates a shape,
     * and then mouseup finalizes it and adds an instance of `fabric.Path` onto canvas.
     * @tutorial {@link http://fabricjs.com/fabric-intro-part-4#free_drawing}
     * @type Boolean
     * @default
     */
    isDrawingMode;
    /**
     * Indicates whether objects should remain in current stack position when selected.
     * When false objects are brought to top and rendered as part of the selection group
     * @type Boolean
     * @default
     */
    preserveObjectStacking;
    /**
     * Indicates if the right click on canvas can output the context menu or not
     * @type Boolean
     * @since 1.6.5
     * @default
     */
    stopContextMenu;
    /**
     * Indicates if the canvas can fire right click events
     * @type Boolean
     * @since 1.6.5
     * @default
     */
    fireRightClick;
    /**
     * Indicates if the canvas can fire middle click events
     * @type Boolean
     * @since 1.7.8
     * @default
     */
    fireMiddleClick;
    /**
     * Keep track of the subTargets for Mouse Events
     * @type FabricObject[]
     */
    targets = [];
    /**
     * Keep track of the hovered target
     * @type FabricObject | null
     * @private
     */
    _hoveredTarget;
    /**
     * hold the list of nested targets hovered
     * @type FabricObject[]
     * @private
     */
    _hoveredTargets = [];
    /**
     * hold the list of objects to render
     * @type FabricObject[]
     * @private
     */
    _objectsToRender = [];
    /**
     * hold a referenfce to a data structure that contains information
     * on the current on going transform
     * @type
     * @private
     */
    _currentTransform = null;
    /**
     * hold a reference to a data structure used to track the selecion
     * box on canvas drag
     * on the current on going transform
     * @type
     * @private
     */
    _groupSelector = null;
    /**
     * internal flag used to understand if the context top requires a cleanup
     * in case this is true, the contextTop will be cleared at the next render
     * @type boolean
     * @private
     */
    contextTopDirty = false;
    /**
     * a reference to the context of an additional canvas that is used for scratch operations
     * @TODOL This is created automatically when needed, while it shouldn't. is probably not even often needed
     * and is a memory waste. We should either have one that gets added/deleted
     * @type CanvasRenderingContext2D
     * @private
     */
    contextCache;
    /**
     * During a mouse event we may need the pointer multiple times in multiple functions.
     * _absolutePointer holds a reference to the pointer in fabricCanvas/design coordinates that is valid for the event
     * lifespan. Every fabricJS mouse event create and delete the cache every time
     * We do this because there are some HTML DOM inspection functions to get the actual pointer coordinates
     * @type {Point}
     */
    _absolutePointer;
    /**
     * During a mouse event we may need the pointer multiple times in multiple functions.
     * _pointer holds a reference to the pointer in html coordinates that is valid for the event
     * lifespan. Every fabricJS mouse event create and delete the cache every time
     * We do this because there are some HTML DOM inspection functions to get the actual pointer coordinates
     * @type {Point}
     */
    _pointer;
    /**
     * During a mouse event we may need the target multiple times in multiple functions.
     * _target holds a reference to the target that is valid for the event
     * lifespan. Every fabricJS mouse event create and delete the cache every time
     * @type {FabricObject}
     */
    _target;
    upperCanvasEl;
    contextTop;
    wrapperEl;
    cacheCanvasEl;
    _isCurrentlyDrawing;
    freeDrawingBrush;
    _activeObject;
    _hasITextHandlers;
    _iTextInstances;
    /**
     * Constructor
     * @param {HTMLCanvasElement | String} el canvas element to initialize instance on
     * @param {Object} [options] Options object
     * @return {Object} thisArg
     */
    constructor(el, options = {}) {
        super(el, options);
    }
    _init(el, options = {}) {
        this.renderAndResetBound = this.renderAndReset.bind(this);
        this.requestRenderAllBound = this.requestRenderAll.bind(this);
        this._initStatic(el, options);
        this._applyCanvasStyle(this.lowerCanvasEl);
        this._initWrapperElement();
        this._createUpperCanvas();
        // @ts-ignore
        this._initEventListeners();
        this._initRetinaScaling();
        this.calcOffset();
        this._createCacheCanvas();
    }
    /**
     * @private
     */
    _initRetinaScaling() {
        super._initRetinaScaling();
        this.__initRetinaScaling(this.upperCanvasEl, this.contextTop);
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
            this.fire('before:selection:cleared', { deselected: [obj] });
            this._discardActiveObject();
            this.fire('selection:cleared', { deselected: [obj] });
            obj.fire('deselected', {
                target: obj,
            });
        }
        if (obj === this._hoveredTarget) {
            this._hoveredTarget = undefined;
            this._hoveredTargets = [];
        }
        super._onObjectRemoved(obj);
    }
    /**
     * Divides objects in two groups, one to render immediately
     * and one to render as activeGroup.
     * @return {Array} objects to render immediately and pushes the other in the activeGroup.
     */
    _chooseObjectsToRender() {
        const activeObjects = this.getActiveObjects();
        let objsToRender, activeGroupObjects;
        if (!this.preserveObjectStacking && activeObjects.length > 1) {
            objsToRender = [];
            activeGroupObjects = [];
            for (let i = 0, length = this._objects.length; i < length; i++) {
                const object = this._objects[i];
                if (activeObjects.indexOf(object) === -1) {
                    objsToRender.push(object);
                }
                else {
                    activeGroupObjects.push(object);
                }
            }
            if (activeObjects.length > 1 && isCollection(this._activeObject)) {
                this._activeObject._objects = activeGroupObjects;
            }
            objsToRender.push(...activeGroupObjects);
        }
        //  in case a single object is selected render it's entire parent above the other objects
        else if (!this.preserveObjectStacking && activeObjects.length === 1) {
            const target = activeObjects[0], ancestors = target.getAncestors(true);
            const topAncestor = (ancestors.length === 0 ? target : ancestors.pop());
            objsToRender = this._objects.slice();
            const index = objsToRender.indexOf(topAncestor);
            index > -1 && objsToRender.splice(objsToRender.indexOf(topAncestor), 1);
            objsToRender.push(topAncestor);
        }
        else {
            objsToRender = this._objects;
        }
        return objsToRender;
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
        !this._objectsToRender &&
            (this._objectsToRender = this._chooseObjectsToRender());
        this.renderCanvas(this.contextContainer, this._objectsToRender);
    }
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
     */
    renderTop() {
        const ctx = this.contextTop;
        this.clearContext(ctx);
        this.renderTopLayer(ctx);
        // todo: how do i know if the after:render is for the top or normal contex?
        this.fire('after:render', { ctx });
    }
    /**
     * Given a pointer on the canvas with a viewport applied,
     * find out the opinter in
     * @private
     */
    _normalizePointer(object, pointer) {
        return transformPoint(this.restorePointerVpt(pointer), invertTransform(object.calcTransformMatrix()));
    }
    /**
     * Returns true if object is transparent at a certain location
     * Clarification: this is `is target transparent at location X or are controls there`
     * @TODO this seems dumb that we treat controls with transparency. we can find controls
     * programmatically without painting them, the cache canvas optimization is always valid
     * @param {FabricObject} target Object to check
     * @param {Number} x Left coordinate
     * @param {Number} y Top coordinate
     * @return {Boolean}
     */
    isTargetTransparent(target, x, y) {
        // in case the target is the activeObject, we cannot execute this optimization
        // because we need to draw controls too.
        if (isFabricObjectCached(target) && target !== this._activeObject) {
            // optimizatio: we can reuse the cache
            const normalizedPointer = this._normalizePointer(target, new Point(x, y)), targetRelativeX = Math.max(target.cacheTranslationX + normalizedPointer.x * target.zoomX, 0), targetRelativeY = Math.max(target.cacheTranslationY + normalizedPointer.y * target.zoomY, 0);
            return isTransparent(target._cacheContext, Math.round(targetRelativeX), Math.round(targetRelativeY), this.targetFindTolerance);
        }
        const ctx = this.contextCache, originalColor = target.selectionBackgroundColor, v = this.viewportTransform;
        target.selectionBackgroundColor = '';
        this.clearContext(ctx);
        ctx.save();
        ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
        target.render(ctx);
        ctx.restore();
        target.selectionBackgroundColor = originalColor;
        return isTransparent(ctx, x, y, this.targetFindTolerance);
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
            return !!sKey.find((key) => !!key && e[key] === true);
        }
        else {
            return e[sKey];
        }
    }
    /**
     * @private
     * @param {TPointerEvent} e Event object
     * @param {FabricObject} target
     */
    _shouldClearSelection(e, target) {
        const activeObjects = this.getActiveObjects(), activeObject = this._activeObject;
        return !!(!target ||
            (target &&
                activeObject &&
                activeObjects.length > 1 &&
                activeObjects.indexOf(target) === -1 &&
                activeObject !== target &&
                !this._isSelectionKeyPressed(e)) ||
            (target && !target.evented) ||
            (target && !target.selectable && activeObject && activeObject !== target));
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
        if (action === 'scale' ||
            action === 'scaleX' ||
            action === 'scaleY' ||
            action === 'resizing') {
            centerTransform = this.centeredScaling || target.centeredScaling;
        }
        else if (action === 'rotate') {
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
            y: target.originY,
        };
        // is a left control ?
        if (['ml', 'tl', 'bl'].includes(controlName)) {
            origin.x = 'right';
            // is a right control ?
        }
        else if (['mr', 'tr', 'br'].includes(controlName)) {
            origin.x = 'left';
        }
        // is a top control ?
        if (['tl', 'mt', 'tr'].includes(controlName)) {
            origin.y = 'bottom';
            // is a bottom control ?
        }
        else if (['bl', 'mb', 'br'].includes(controlName)) {
            origin.y = 'top';
        }
        return origin;
    }
    /**
     * @private
     * @param {Event} e Event object
     * @param {FaricObject} target
     */
    _setupCurrentTransform(e, target, alreadySelected) {
        if (!target) {
            return;
        }
        let pointer = this.getPointer(e);
        if (target.group) {
            // transform pointer to target's containing coordinate plane
            pointer = sendPointToPlane(pointer, target.group.calcTransformMatrix());
        }
        const corner = target.__corner || '', control = target.controls[corner], actionHandler = alreadySelected && corner
            ? control.getActionHandler(e, target, control)
            : dragHandler, action = getActionFromCorner(alreadySelected, corner, e, target), origin = this._getOriginFromCorner(target, corner), altKey = e[this.centeredKey], 
        /**
         * relative to target's containing coordinate plane
         * both agree on every point
         **/
        transform = {
            target: target,
            action: action,
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
            altKey: altKey,
            original: {
                ...saveObjectTransform(target),
                originX: origin.x,
                originY: origin.y,
            },
        };
        if (this._shouldCenterTransform(target, action, altKey)) {
            transform.originX = 'center';
            transform.originY = 'center';
        }
        this._currentTransform = transform;
        // @ts-ignore
        this._beforeTransform(e);
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
        const { ex, ey, left, top } = this._groupSelector, start = new Point(ex, ey).transform(this.viewportTransform), extent = new Point(ex + left, ey + top).transform(this.viewportTransform), strokeOffset = this.selectionLineWidth / 2;
        let minX = Math.min(start.x, extent.x), minY = Math.min(start.y, extent.y), maxX = Math.max(start.x, extent.x), maxY = Math.max(start.y, extent.y);
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
     * Method that determines what object we are clicking on
     * the skipGroup parameter is for internal use, is needed for shift+click action
     * 11/09/2018 TODO: would be cool if findTarget could discern between being a full target
     * or the outside part of the corner.
     * @param {Event} e mouse event
     * @param {Boolean} skipGroup when true, activeGroup is skipped and only objects are traversed through
     * @return {FabricObject | null} the target found
     */
    findTarget(e, skipGroup = false) {
        if (this.skipTargetFind) {
            return undefined;
        }
        const pointer = this.getPointer(e, true), activeObject = this._activeObject, aObjects = this.getActiveObjects(), isTouch = isTouchEvent(e), shouldLookForActive = (aObjects.length > 1 && !skipGroup) || aObjects.length === 1;
        // first check current group (if one exists)
        // active group does not check sub targets like normal groups.
        // if active group just exits.
        this.targets = [];
        // if we hit the corner of an activeObject, let's return that.
        if (
        // ts doesn't get that if shouldLookForActive is true, activeObject exists
        activeObject &&
            shouldLookForActive &&
            activeObject._findTargetCorner(pointer, isTouch)) {
            return activeObject;
        }
        if (aObjects.length > 1 &&
            isActiveSelection(activeObject) &&
            !skipGroup &&
            this.searchPossibleTargets([activeObject], pointer)) {
            return activeObject;
        }
        let activeTarget;
        let activeTargetSubs = [];
        if (
        // ts doesn't get that if aObjects has one object, activeObject exists
        activeObject &&
            aObjects.length === 1 &&
            activeObject === this.searchPossibleTargets([activeObject], pointer)) {
            if (!this.preserveObjectStacking) {
                return activeObject;
            }
            else {
                activeTarget = activeObject;
                activeTargetSubs = this.targets;
                this.targets = [];
            }
        }
        const target = this.searchPossibleTargets(this._objects, pointer);
        if (e[this.altSelectionKey] &&
            target &&
            activeTarget &&
            target !== activeTarget) {
            this.targets = activeTargetSubs;
            return activeTarget;
        }
        return target;
    }
    /**
     * Checks point is inside the object.
     * @param {Object} [pointer] x,y object of point coordinates we want to check.
     * @param {FabricObject} obj Object to test against
     * @param {Object} [globalPointer] x,y object of point coordinates relative to canvas used to search per pixel target.
     * @return {Boolean} true if point is contained within an area of given object
     * @private
     */
    _checkTarget(pointer, obj, globalPointer) {
        if (obj &&
            obj.visible &&
            obj.evented &&
            // http://www.geog.ubc.ca/courses/klink/gis.notes/ncgia/u32.html
            // http://idav.ucdavis.edu/~okreylos/TAship/Spring2000/PointInPolygon.html
            obj.containsPoint(pointer)) {
            if ((this.perPixelTargetFind || obj.perPixelTargetFind) &&
                !obj.isEditing) {
                if (!this.isTargetTransparent(obj, globalPointer.x, globalPointer.y)) {
                    return true;
                }
            }
            else {
                return true;
            }
        }
        return false;
    }
    /**
     * Internal Function used to search inside objects an object that contains pointer in bounding box or that contains pointerOnCanvas when painted
     * @param {Array} [objects] objects array to look into
     * @param {Object} [pointer] x,y object of point coordinates we want to check.
     * @return {FabricObject} **top most object from given `objects`** that contains pointer
     * @private
     */
    _searchPossibleTargets(objects, pointer) {
        // Cache all targets where their bounding box contains point.
        let target, i = objects.length;
        // Do not check for currently grouped objects, since we check the parent group itself.
        // until we call this function specifically to search inside the activeGroup
        while (i--) {
            const objToCheck = objects[i];
            const pointerToUse = objToCheck.group
                ? this._normalizePointer(objToCheck.group, pointer)
                : pointer;
            if (this._checkTarget(pointerToUse, objToCheck, pointer)) {
                target = objects[i];
                if (isCollection(target) && target.subTargetCheck) {
                    const subTarget = this._searchPossibleTargets(target._objects, pointer);
                    subTarget && this.targets.push(subTarget);
                }
                break;
            }
        }
        return target;
    }
    /**
     * Function used to search inside objects an object that contains pointer in bounding box or that contains pointerOnCanvas when painted
     * @see {@link fabric.Canvas#_searchPossibleTargets}
     * @param {FabricObject[]} [objects] objects array to look into
     * @param {Object} [pointer] x,y object of point coordinates we want to check.
     * @return {FabricObject} **top most object on screen** that contains pointer
     */
    searchPossibleTargets(objects, pointer) {
        const target = this._searchPossibleTargets(objects, pointer);
        // if we found something in this.targets, and the group is interactive, return that subTarget
        // TODO: reverify why interactive. the target should be returned always, but selected only
        // if interactive.
        return target &&
            isCollection(target) &&
            target.interactive &&
            this.targets[0]
            ? this.targets[0]
            : target;
    }
    /**
     * Returns pointer coordinates without the effect of the viewport
     * @param {Object} pointer with "x" and "y" number values in canvas HTML coordinates
     * @return {Object} object with "x" and "y" number values in fabricCanvas coordinates
     */
    restorePointerVpt(pointer) {
        return pointer.transform(invertTransform(this.viewportTransform));
    }
    /**
     * Returns pointer coordinates relative to canvas.
     * Can return coordinates with or without viewportTransform.
     * ignoreVpt false gives back coordinates that represent
     * the point clicked on canvas element.
     * ignoreVpt true gives back coordinates after being processed
     * by the viewportTransform ( sort of coordinates of what is displayed
     * on the canvas where you are clicking.
     * ignoreVpt true = HTMLElement coordinates relative to top,left
     * ignoreVpt false, default = fabric space coordinates, the same used for shape position
     * To interact with your shapes top and left you want to use ignoreVpt true
     * most of the time, while ignoreVpt false will give you coordinates
     * compatible with the object.oCoords system.
     * of the time.
     * @param {Event} e
     * @param {Boolean} ignoreVpt
     * @return {Point}
     */
    getPointer(e, ignoreVpt = false) {
        // return cached values if we are in the event processing chain
        if (this._absolutePointer && !ignoreVpt) {
            return this._absolutePointer;
        }
        if (this._pointer && ignoreVpt) {
            return this._pointer;
        }
        const upperCanvasEl = this.upperCanvasEl, bounds = upperCanvasEl.getBoundingClientRect();
        let pointer = getPointer(e), boundsWidth = bounds.width || 0, boundsHeight = bounds.height || 0;
        if (!boundsWidth || !boundsHeight) {
            if ('top' in bounds && 'bottom' in bounds) {
                boundsHeight = Math.abs(bounds.top - bounds.bottom);
            }
            if ('right' in bounds && 'left' in bounds) {
                boundsWidth = Math.abs(bounds.right - bounds.left);
            }
        }
        this.calcOffset();
        pointer.x = pointer.x - this._offset.left;
        pointer.y = pointer.y - this._offset.top;
        if (!ignoreVpt) {
            pointer = this.restorePointerVpt(pointer);
        }
        const retinaScaling = this.getRetinaScaling();
        if (retinaScaling !== 1) {
            pointer.x /= retinaScaling;
            pointer.y /= retinaScaling;
        }
        // If bounds are not available (i.e. not visible), do not apply scale.
        const cssScale = boundsWidth === 0 || boundsHeight === 0
            ? new Point(1, 1)
            : new Point(upperCanvasEl.width / boundsWidth, upperCanvasEl.height / boundsHeight);
        return pointer.multiply(cssScale);
    }
    /**
     * Sets dimensions (width, height) of this canvas instance. when options.cssOnly flag active you should also supply the unit of measure (px/%/em)
     * @param {Object}        dimensions                    Object with width/height properties
     * @param {Number|String} [dimensions.width]            Width of canvas element
     * @param {Number|String} [dimensions.height]           Height of canvas element
     * @param {Object}        [options]                     Options object
     * @param {Boolean}       [options.backstoreOnly=false] Set the given dimensions only as canvas backstore dimensions
     * @param {Boolean}       [options.cssOnly=false]       Set the given dimensions only as css dimensions
     * @return {Canvas} thisArg
     */
    setDimensions(dimensions, options) {
        // @ts-ignore
        this._resetTransformEventData();
        super.setDimensions(dimensions, options);
        if (this._isCurrentlyDrawing) {
            this.freeDrawingBrush &&
                this.freeDrawingBrush._setBrushStyles(this.contextTop);
        }
    }
    /**
     * Helper for setting width/height
     * @private
     * @param {String} prop property (width|height)
     * @param {Number} value value to set property to
     */
    _setBackstoreDimension(prop, value) {
        super._setBackstoreDimension(prop, value);
        this.upperCanvasEl[prop] = value;
        this.cacheCanvasEl[prop] = value;
    }
    /**
     * Helper for setting css width/height
     * @private
     * @param {String} prop property (width|height)
     * @param {String} value value to set property to
     */
    _setCssDimension(prop, value) {
        super._setCssDimension(prop, value);
        this.upperCanvasEl.style[prop] = value;
        this.wrapperEl.style[prop] = value;
    }
    /**
     * @private
     * @throws {CANVAS_INIT_ERROR} If canvas can not be initialized
     */
    _createUpperCanvas() {
        const lowerCanvasEl = this.lowerCanvasEl;
        // if there is no upperCanvas (most common case) we create one.
        if (!this.upperCanvasEl) {
            this.upperCanvasEl = this._createCanvasElement();
        }
        const upperCanvasEl = this.upperCanvasEl;
        // we assign the same classname of the lowerCanvas
        upperCanvasEl.className = lowerCanvasEl.className;
        // but then we remove the lower-canvas specific className
        upperCanvasEl.classList.remove('lower-canvas');
        // we add the specific upper-canvas class
        upperCanvasEl.classList.add('upper-canvas');
        upperCanvasEl.setAttribute('data-fabric', 'top');
        this.wrapperEl.appendChild(upperCanvasEl);
        upperCanvasEl.style.cssText = lowerCanvasEl.style.cssText;
        this._applyCanvasStyle(upperCanvasEl);
        upperCanvasEl.setAttribute('draggable', 'true');
        this.contextTop = upperCanvasEl.getContext('2d');
    }
    /**
     * @private
     */
    _createCacheCanvas() {
        this.cacheCanvasEl = this._createCanvasElement();
        this.cacheCanvasEl.setAttribute('width', `${this.width}`);
        this.cacheCanvasEl.setAttribute('height', `${this.height}`);
        this.contextCache = this.cacheCanvasEl.getContext('2d');
    }
    /**
     * @private
     */
    _initWrapperElement() {
        if (this.wrapperEl) {
            return;
        }
        const container = fabric.document.createElement('div');
        container.classList.add(this.containerClass);
        this.wrapperEl = wrapElement(this.lowerCanvasEl, container);
        this.wrapperEl.setAttribute('data-fabric', 'wrapper');
        setStyle(this.wrapperEl, {
            width: `${this.width}px`,
            height: `${this.height}px`,
            position: 'relative',
        });
        makeElementUnselectable(this.wrapperEl);
    }
    /**
     * @private
     * @param {HTMLCanvasElement} element canvas element to apply styles on
     */
    _applyCanvasStyle(element) {
        const width = this.width || element.width, height = this.height || element.height;
        setStyle(element, {
            position: 'absolute',
            width: width + 'px',
            height: height + 'px',
            left: 0,
            top: 0,
            'touch-action': this.allowTouchScrolling ? 'manipulation' : 'none',
            '-ms-touch-action': this.allowTouchScrolling ? 'manipulation' : 'none',
        });
        element.width = width;
        element.height = height;
        makeElementUnselectable(element);
    }
    /**
     * Returns context of top canvas where interactions are drawn
     * @returns {CanvasRenderingContext2D}
     */
    getTopContext() {
        return this.contextTop;
    }
    /**
     * Returns context of canvas where object selection is drawn
     * @alias
     * @return {CanvasRenderingContext2D}
     */
    getSelectionContext() {
        return this.contextTop;
    }
    /**
     * Returns &lt;canvas> element on which object selection is drawn
     * @return {HTMLCanvasElement}
     */
    getSelectionElement() {
        return this.upperCanvasEl;
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
        if (active) {
            if (isActiveSelection(active)) {
                return [...active._objects];
            }
            else {
                return [active];
            }
        }
        return [];
    }
    /**
     * @private
     * Compares the old activeObject with the current one and fires correct events
     * @param {FabricObject[]} oldObjects old activeObject
     * @param {TPointerEvent} e mouse event triggering the selection events
     */
    _fireSelectionEvents(oldObjects, e) {
        let somethingChanged = false, invalidate = false;
        const objects = this.getActiveObjects(), added = [], removed = [];
        oldObjects.forEach((target) => {
            if (!objects.includes(target)) {
                somethingChanged = true;
                target.fire('deselected', {
                    e,
                    target,
                });
                removed.push(target);
            }
        });
        objects.forEach((target) => {
            if (!oldObjects.includes(target)) {
                somethingChanged = true;
                target.fire('selected', {
                    e,
                    target,
                });
                added.push(target);
            }
        });
        if (oldObjects.length > 0 && objects.length > 0) {
            invalidate = true;
            somethingChanged &&
                this.fire('selection:updated', {
                    e,
                    selected: added,
                    deselected: removed,
                });
        }
        else if (objects.length > 0) {
            invalidate = true;
            this.fire('selection:created', {
                e,
                selected: added,
            });
        }
        else if (oldObjects.length > 0) {
            invalidate = true;
            this.fire('selection:cleared', {
                e,
                deselected: removed,
            });
        }
        invalidate && (this._objectsToRender = undefined);
    }
    /**
     * Sets given object as the only active object on canvas
     * @param {FabricObject} object Object to set as an active one
     * @param {TPointerEvent} [e] Event (passed along when firing "object:selected")
     * @chainable
     */
    setActiveObject(object, e) {
        // we can't inline this, since _setActiveObject will change what getActiveObjects returns
        const currentActives = this.getActiveObjects();
        this._setActiveObject(object, e);
        this._fireSelectionEvents(currentActives, e);
    }
    /**
     * This is a private method for now.
     * This is supposed to be equivalent to setActiveObject but without firing
     * any event. There is commitment to have this stay this way.
     * This is the functional part of setActiveObject.
     * @private
     * @param {Object} object to set as active
     * @param {Event} [e] Event (passed along when firing "object:selected")
     * @return {Boolean} true if the selection happened
     */
    _setActiveObject(object, e) {
        if (this._activeObject === object) {
            return false;
        }
        if (!this._discardActiveObject(e, object)) {
            return false;
        }
        if (object.onSelect({ e })) {
            return false;
        }
        this._activeObject = object;
        return true;
    }
    /**
     * This is a private method for now.
     * This is supposed to be equivalent to discardActiveObject but without firing
     * any selection events ( can still fire object transformation events ). There is commitment to have this stay this way.
     * This is the functional part of discardActiveObject.
     * @param {Event} [e] Event (passed along when firing "object:deselected")
     * @param {Object} object the next object to set as active, reason why we are discarding this
     * @return {Boolean} true if the selection happened
     * @private
     */
    _discardActiveObject(e, object) {
        const obj = this._activeObject;
        if (obj) {
            // onDeselect return TRUE to cancel selection;
            if (obj.onDeselect({ e, object })) {
                return false;
            }
            if (this._currentTransform && this._currentTransform.target === obj) {
                // @ts-ignore
                this.endCurrentTransform(e);
            }
            this._activeObject = undefined;
        }
        return true;
    }
    /**
     * Discards currently active object and fire events. If the function is called by fabric
     * as a consequence of a mouse event, the event is passed as a parameter and
     * sent to the fire function for the custom events. When used as a method the
     * e param does not have any application.
     * @param {event} e
     * @chainable
     */
    discardActiveObject(e) {
        const currentActives = this.getActiveObjects(), activeObject = this.getActiveObject();
        if (currentActives.length) {
            this.fire('before:selection:cleared', {
                e,
                deselected: [activeObject],
            });
        }
        this._discardActiveObject(e);
        this._fireSelectionEvents(currentActives, e);
    }
    /**
     * Clears the canvas element, disposes objects, removes all event listeners and frees resources
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
        const wrapperEl = this.wrapperEl, lowerCanvasEl = this.lowerCanvasEl, upperCanvasEl = this.upperCanvasEl, cacheCanvasEl = this.cacheCanvasEl;
        // @ts-ignore
        this.removeListeners();
        super.destroy();
        wrapperEl.removeChild(upperCanvasEl);
        wrapperEl.removeChild(lowerCanvasEl);
        this._iTextInstances = [];
        this.contextCache = null;
        this.contextTop = null;
        cleanUpJsdomNode(upperCanvasEl);
        this.upperCanvasEl = undefined;
        cleanUpJsdomNode(cacheCanvasEl);
        this.cacheCanvasEl = undefined;
        if (wrapperEl.parentNode) {
            wrapperEl.parentNode.replaceChild(lowerCanvasEl, wrapperEl);
        }
        this.wrapperEl = undefined;
    }
    /**
     * Clears all contexts (background, main, top) of an instance
     */
    clear() {
        // this.discardActiveGroup();
        this.discardActiveObject();
        this.clearContext(this.contextTop);
        if (this._hasITextHandlers) {
            // @ts-ignore
            this.off('mouse:up', this._mouseUpITextHandler);
            this._iTextInstances = [];
            this._hasITextHandlers = false;
        }
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
        const originalProperties = this._realizeGroupTransformOnObject(instance), object = super._toObject(instance, methodName, propertiesToInclude);
        //Undo the damage we did by changing all of its properties
        instance.set(originalProperties);
        return object;
    }
    /**
     * Realises an object's group transformation on it
     * @private
     * @param {FabricObject} [instance] the object to transform (gets mutated)
     * @returns the original values of instance which were changed
     */
    _realizeGroupTransformOnObject(instance) {
        if (instance.group &&
            isActiveSelection(instance.group) &&
            this._activeObject === instance.group) {
            const layoutProps = [
                'angle',
                'flipX',
                'flipY',
                'left',
                'scaleX',
                'scaleY',
                'skewX',
                'skewY',
                'top',
            ];
            const originalValues = pick(instance, layoutProps);
            addTransformToObject(instance, this._activeObject.calcOwnMatrix());
            return originalValues;
        }
        else {
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
    setViewportTransform(vpt) {
        if (this.renderOnAddRemove &&
            isInteractiveTextObject(this._activeObject) &&
            this._activeObject.isEditing) {
            this._activeObject.clearContextTop();
        }
        super.setViewportTransform(vpt);
    }
}
Object.assign(SelectableCanvas.prototype, {
    uniformScaling: true,
    uniScaleKey: 'shiftKey',
    centeredScaling: false,
    centeredRotation: false,
    centeredKey: 'altKey',
    altActionKey: 'shiftKey',
    selection: true,
    selectionKey: 'shiftKey',
    altSelectionKey: null,
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
    containerClass: 'canvas-container',
    perPixelTargetFind: false,
    targetFindTolerance: 0,
    skipTargetFind: false,
    preserveObjectStacking: false,
    stopContextMenu: false,
    fireRightClick: false,
    fireMiddleClick: false,
    enablePointerEvents: false,
});

const RIGHT_CLICK = 3, MIDDLE_CLICK = 2, LEFT_CLICK = 1, addEventOptions = { passive: false };
function checkClick(e, value) {
    return !!e.button && e.button === value - 1;
}
// just to be clear, the utils are now deprecated and those are here exactly as minifier helpers
// because el.addEventListener can't me be minified while a const yes and we use it 47 times in this file.
// few bytes but why give it away.
const addListener = (el, ...args) => el.addEventListener(...args);
const removeListener = (el, ...args) => el.removeEventListener(...args);
const syntheticEventConfig = {
    mouse: {
        in: 'over',
        out: 'out',
        targetIn: 'mouseover',
        targetOut: 'mouseout',
        canvasIn: 'mouse:over',
        canvasOut: 'mouse:out',
    },
    drag: {
        in: 'enter',
        out: 'leave',
        targetIn: 'dragenter',
        targetOut: 'dragleave',
        canvasIn: 'drag:enter',
        canvasOut: 'drag:leave',
    },
};
class Canvas extends SelectableCanvas {
    /**
     * Contains the id of the touch event that owns the fabric transform
     * @type Number
     * @private
     */
    mainTouchId;
    /**
     * When the option is enabled, PointerEvent is used instead of TPointerEvent.
     * @type Boolean
     * @default
     */
    enablePointerEvents;
    /**
     * an internal flag that is used to remember if we already bound the events
     * @type Boolean
     * @private
     */
    eventsBound;
    /**
     * Holds a reference to a setTimeout timer for event synchronization
     * @type number
     * @private
     */
    _willAddMouseDown;
    /**
     * Holds a reference to an object on the canvas that is receiving the drag over event.
     * @type FabricObject
     * @private
     */
    _draggedoverTarget;
    /**
     * Holds a reference to an object on the canvas from where the drag operation started
     * @type FabricObject
     * @private
     */
    _dragSource;
    currentTarget;
    currentSubTargets;
    /**
     * Holds a reference to a pointer during mousedown to compare on mouse up and determine
     * if it was a click event
     * @type FabricObject
     * @private
     */
    _previousPointer;
    /**
     * Adds mouse listeners to canvas
     * @private
     */
    _initEventListeners() {
        // in case we initialized the class twice. This should not happen normally
        // but in some kind of applications where the canvas element may be changed
        // this is a workaround to having double listeners.
        this.removeListeners();
        this._bindEvents();
        // @ts-ginore
        this.addOrRemove(addListener, 'add');
    }
    /**
     * return an event prefix pointer or mouse.
     * @private
     */
    _getEventPrefix() {
        return this.enablePointerEvents ? 'pointer' : 'mouse';
    }
    addOrRemove(functor, eventjsFunctor) {
        const canvasElement = this.upperCanvasEl, eventTypePrefix = this._getEventPrefix();
        functor(fabric.window, 'resize', this._onResize);
        functor(canvasElement, eventTypePrefix + 'down', this._onMouseDown);
        functor(canvasElement, `${eventTypePrefix}move`, this._onMouseMove, addEventOptions);
        functor(canvasElement, `${eventTypePrefix}out`, this._onMouseOut);
        functor(canvasElement, `${eventTypePrefix}enter`, this._onMouseEnter);
        functor(canvasElement, 'wheel', this._onMouseWheel);
        functor(canvasElement, 'contextmenu', this._onContextMenu);
        functor(canvasElement, 'dblclick', this._onDoubleClick);
        functor(canvasElement, 'dragstart', this._onDragStart);
        functor(canvasElement, 'dragend', this._onDragEnd);
        functor(canvasElement, 'dragover', this._onDragOver);
        functor(canvasElement, 'dragenter', this._onDragEnter);
        functor(canvasElement, 'dragleave', this._onDragLeave);
        functor(canvasElement, 'drop', this._onDrop);
        if (!this.enablePointerEvents) {
            functor(canvasElement, 'touchstart', this._onTouchStart, addEventOptions);
        }
        // if (typeof eventjs !== 'undefined' && eventjsFunctor in eventjs) {
        //   eventjs[eventjsFunctor](canvasElement, 'gesture', this._onGesture);
        //   eventjs[eventjsFunctor](canvasElement, 'drag', this._onDrag);
        //   eventjs[eventjsFunctor](
        //     canvasElement,
        //     'orientation',
        //     this._onOrientationChange
        //   );
        //   eventjs[eventjsFunctor](canvasElement, 'shake', this._onShake);
        //   eventjs[eventjsFunctor](canvasElement, 'longpress', this._onLongPress);
        // }
    }
    /**
     * Removes all event listeners
     */
    removeListeners() {
        this.addOrRemove(removeListener, 'remove');
        // if you dispose on a mouseDown, before mouse up, you need to clean document to...
        const eventTypePrefix = this._getEventPrefix();
        removeListener(fabric.document, `${eventTypePrefix}up`, this._onMouseUp);
        removeListener(fabric.document, 'touchend', this._onTouchEnd, addEventOptions);
        removeListener(fabric.document, `${eventTypePrefix}move`, this._onMouseMove, addEventOptions);
        removeListener(fabric.document, 'touchmove', this._onMouseMove, addEventOptions);
    }
    /**
     * @private
     */
    _bindEvents() {
        if (this.eventsBound) {
            // for any reason we pass here twice we do not want to bind events twice.
            return;
        }
        [
            '_onMouseDown',
            '_onTouchStart',
            '_onMouseMove',
            '_onMouseUp',
            '_onTouchEnd',
            '_onResize',
            // '_onGesture',
            // '_onDrag',
            // '_onShake',
            // '_onLongPress',
            // '_onOrientationChange',
            '_onMouseWheel',
            '_onMouseOut',
            '_onMouseEnter',
            '_onContextMenu',
            '_onDoubleClick',
            '_onDragStart',
            '_onDragEnd',
            '_onDragProgress',
            '_onDragOver',
            '_onDragEnter',
            '_onDragLeave',
            '_onDrop',
        ].forEach((eventHandler) => {
            // @ts-expect-error dumb TS
            this[eventHandler] = this[eventHandler].bind(this);
        });
        this.eventsBound = true;
    }
    /**
     * @private
     * @param {Event} [e] Event object fired on wheel event
     */
    _onMouseWheel(e) {
        this.__onMouseWheel(e);
    }
    /**
     * @private
     * @param {Event} e Event object fired on mousedown
     */
    _onMouseOut(e) {
        const target = this._hoveredTarget;
        const shared = {
            e,
            isClick: false,
            pointer: this.getPointer(e),
            absolutePointer: this.getPointer(e, true),
        };
        this.fire('mouse:out', { ...shared, target });
        this._hoveredTarget = undefined;
        target && target.fire('mouseout', { ...shared });
        this._hoveredTargets.forEach((nestedTarget) => {
            this.fire('mouse:out', { ...shared, target: nestedTarget });
            nestedTarget && nestedTarget.fire('mouseout', { ...shared });
        });
        this._hoveredTargets = [];
    }
    /**
     * @private
     * @param {Event} e Event object fired on mouseenter
     */
    _onMouseEnter(e) {
        // This find target and consequent 'mouse:over' is used to
        // clear old instances on hovered target.
        // calling findTarget has the side effect of killing target.__corner.
        // as a short term fix we are not firing this if we are currently transforming.
        // as a long term fix we need to separate the action of finding a target with the
        // side effects we added to it.
        if (!this._currentTransform && !this.findTarget(e)) {
            this.fire('mouse:over', {
                e,
                isClick: false,
                pointer: this.getPointer(e),
                absolutePointer: this.getPointer(e, true),
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
        const activeObject = this.getActiveObject();
        if (isFabricObjectWithDragSupport(activeObject) &&
            activeObject.onDragStart(e)) {
            this._dragSource = activeObject;
            const options = { e, target: activeObject };
            this.fire('dragstart', options);
            activeObject.fire('dragstart', options);
            addListener(this.upperCanvasEl, 'drag', this._onDragProgress);
            return;
        }
        stopEvent(e);
    }
    /**
     * @private
     */
    _renderDragEffects(e, source, target) {
        const ctx = this.contextTop;
        if (source) {
            source.clearContextTop(true);
            source.renderDragSourceEffect(e);
        }
        if (target) {
            if (target !== source) {
                ctx.restore();
                ctx.save();
                target.clearContextTop(true);
            }
            target.renderDropTargetEffect(e);
        }
        ctx.restore();
    }
    /**
     * supports native like text dragging
     * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#finishing_a_drag
     * @private
     * @param {DragEvent} e
     */
    _onDragEnd(e) {
        const didDrop = !!e.dataTransfer && e.dataTransfer.dropEffect !== 'none', dropTarget = didDrop ? this._activeObject : undefined, options = {
            e,
            target: this._dragSource,
            subTargets: this.targets,
            dragSource: this._dragSource,
            didDrop,
            dropTarget: dropTarget,
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
            dropTarget: this._draggedoverTarget,
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
        const eventType = 'dragover', target = this.findTarget(e), targets = this.targets, options = {
            e: e,
            target,
            subTargets: targets,
            dragSource: this._dragSource,
            canDrop: false,
            dropTarget: undefined,
        };
        let dropTarget;
        //  fire on canvas
        this.fire(eventType, options);
        //  make sure we fire dragenter events before dragover
        //  if dragleave is needed, object will not fire dragover so we don't need to trouble ourselves with it
        this._fireEnterLeaveEvents(target, options);
        if (target) {
            // render drag selection before rendering target cursor for correct visuals
            if (target.canDrop(e)) {
                dropTarget = target;
            }
            target.fire(eventType, options);
        }
        //  propagate the event to subtargets
        for (let i = 0; i < targets.length; i++) {
            const subTarget = targets[i];
            // accept event only if previous targets didn't
            // TODO: verify if those should loop in inverse order then?
            // what is the order of subtargets?
            if (!e.defaultPrevented && subTarget.canDrop(e)) {
                dropTarget = subTarget;
            }
            subTarget.fire(eventType, options);
        }
        //  render drag effects now that relations between source and target is clear
        this._renderDragEffects(e, this._dragSource, dropTarget);
    }
    /**
     * fire `dragleave` on `dragover` targets
     * @private
     * @param {Event} [e] Event object fired on Event.js shake
     */
    _onDragEnter(e) {
        const target = this.findTarget(e);
        const options = {
            e,
            target: target,
            subTargets: this.targets,
            dragSource: this._dragSource,
        };
        this.fire('dragenter', options);
        //  fire dragenter on targets
        this._fireEnterLeaveEvents(target, options);
    }
    /**
     * fire `dragleave` on `dragover` targets
     * @private
     * @param {Event} [e] Event object fired on Event.js shake
     */
    _onDragLeave(e) {
        const options = {
            e,
            target: this._draggedoverTarget,
            subTargets: this.targets,
            dragSource: this._dragSource,
        };
        this.fire('dragleave', options);
        //  fire dragleave on targets
        this._fireEnterLeaveEvents(undefined, options);
        //  clear targets
        this.targets = [];
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
        const options = this._simpleEventHandler('drop:before', {
            e,
            dragSource: this._dragSource,
            pointer: this.getPointer(e),
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
        const options = this._simpleEventHandler('contextmenu:before', { e });
        // TODO: this line is silly because the dev can subscribe to the event and prevent it themselves
        this.stopContextMenu && stopEvent(e);
        this._basicEventHandler('contextmenu', options);
        return false;
    }
    /**
     * @private
     * @param {Event} e Event object fired on mousedown
     */
    _onDoubleClick(e) {
        this._cacheTransformEventData(e);
        this._handleEvent(e, 'dblclick');
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
            return (evt.changedTouches[0].identifier === this.mainTouchId);
        }
        return true;
    }
    /**
     * @private
     * @param {Event} e Event object fired on mousedown
     */
    _onTouchStart(e) {
        e.preventDefault();
        if (this.mainTouchId === null) {
            this.mainTouchId = this.getPointerId(e);
        }
        this.__onMouseDown(e);
        this._resetTransformEventData();
        const canvasElement = this.upperCanvasEl, eventTypePrefix = this._getEventPrefix();
        addListener(fabric.document, 'touchend', this._onTouchEnd, addEventOptions);
        addListener(fabric.document, 'touchmove', this._onMouseMove, addEventOptions);
        // Unbind mousedown to prevent double triggers from touch devices
        removeListener(canvasElement, eventTypePrefix + 'down', this._onMouseDown);
    }
    /**
     * @private
     * @param {Event} e Event object fired on mousedown
     */
    _onMouseDown(e) {
        this.__onMouseDown(e);
        this._resetTransformEventData();
        const canvasElement = this.upperCanvasEl, eventTypePrefix = this._getEventPrefix();
        removeListener(canvasElement, `${eventTypePrefix}move`, this._onMouseMove, addEventOptions);
        addListener(fabric.document, `${eventTypePrefix}up`, this._onMouseUp);
        addListener(fabric.document, `${eventTypePrefix}move`, this._onMouseMove, addEventOptions);
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
        this.__onMouseUp(e);
        this._resetTransformEventData();
        this.mainTouchId = null;
        const eventTypePrefix = this._getEventPrefix();
        removeListener(fabric.document, 'touchend', this._onTouchEnd, addEventOptions);
        removeListener(fabric.document, 'touchmove', this._onMouseMove, addEventOptions);
        if (this._willAddMouseDown) {
            clearTimeout(this._willAddMouseDown);
        }
        this._willAddMouseDown = setTimeout(() => {
            // Wait 400ms before rebinding mousedown to prevent double triggers
            // from touch devices
            addListener(this.upperCanvasEl, eventTypePrefix + 'down', this._onMouseDown);
            this._willAddMouseDown = 0;
        }, 400);
    }
    /**
     * @private
     * @param {Event} e Event object fired on mouseup
     */
    _onMouseUp(e) {
        this.__onMouseUp(e);
        this._resetTransformEventData();
        const canvasElement = this.upperCanvasEl, eventTypePrefix = this._getEventPrefix();
        if (this._isMainEvent(e)) {
            removeListener(fabric.document, `${eventTypePrefix}up`, this._onMouseUp);
            removeListener(fabric.document, `${eventTypePrefix}move`, this._onMouseMove, addEventOptions);
            addListener(canvasElement, `${eventTypePrefix}move`, this._onMouseMove, addEventOptions);
        }
    }
    /**
     * @private
     * @param {Event} e Event object fired on mousemove
     */
    _onMouseMove(e) {
        const activeObject = this.getActiveObject();
        !this.allowTouchScrolling &&
            (!activeObject || !activeObject.__isDragging) &&
            e.preventDefault &&
            e.preventDefault();
        this.__onMouseMove(e);
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
        if (!!activeObject !== !!target ||
            (activeObject && target && activeObject !== target)) {
            // this covers: switch of target, from target to no target, selection of target
            // multiSelection with key and mouse
            return true;
        }
        else if (isInteractiveTextObject(activeObject)) {
            // if we mouse up/down over a editing textbox a cursor change,
            // there is no need to re render
            return false;
        }
        return false;
    }
    /**
     * Method that defines the actions when mouse is released on canvas.
     * The method resets the currentTransform parameters, store the image corner
     * position in the image object and render the canvas on top.
     * @private
     * @param {Event} e Event object fired on mouseup
     */
    __onMouseUp(e) {
        const transform = this._currentTransform, groupSelector = this._groupSelector, isClick = !groupSelector || (groupSelector.left === 0 && groupSelector.top === 0);
        this._cacheTransformEventData(e);
        const target = this._target;
        this._handleEvent(e, 'up:before');
        // if right/middle click just fire events and return
        // target undefined will make the _handleEvent search the target
        if (checkClick(e, RIGHT_CLICK)) {
            if (this.fireRightClick) {
                this._handleEvent(e, 'up', RIGHT_CLICK, isClick);
            }
            return;
        }
        if (checkClick(e, MIDDLE_CLICK)) {
            if (this.fireMiddleClick) {
                this._handleEvent(e, 'up', MIDDLE_CLICK, isClick);
            }
            this._resetTransformEventData();
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
            this._maybeGroupObjects(e);
            if (!shouldRender) {
                shouldRender =
                    this._shouldRender(target) ||
                        (!targetWasActive && target === this._activeObject);
            }
        }
        let pointer, corner;
        if (target) {
            corner = target._findTargetCorner(this.getPointer(e, true), fabric.util.isTouchEvent(e));
            if (target.selectable &&
                target !== this._activeObject &&
                target.activeOn === 'up') {
                this.setActiveObject(target, e);
                shouldRender = true;
            }
            else {
                const control = target.controls[corner];
                const mouseUpHandler = control && control.getMouseUpHandler(e, target, control);
                if (mouseUpHandler) {
                    pointer = this.getPointer(e);
                    mouseUpHandler(e, transform, pointer.x, pointer.y);
                }
            }
            target.isMoving = false;
        }
        // if we are ending up a transform on a different control or a new object
        // fire the original mouse up from the corner that started the transform
        if (transform &&
            (transform.target !== target || transform.corner !== corner)) {
            const originalControl = transform.target && transform.target.controls[transform.corner], originalMouseUpHandler = originalControl &&
                originalControl.getMouseUpHandler(e, transform.target, originalControl);
            pointer = pointer || this.getPointer(e);
            originalMouseUpHandler &&
                originalMouseUpHandler(e, transform, pointer.x, pointer.y);
        }
        this._setCursorFromEvent(e, target);
        this._handleEvent(e, 'up', LEFT_CLICK, isClick);
        this._groupSelector = null;
        this._currentTransform = null;
        // reset the target information about which corner is selected
        target && (target.__corner = 0);
        if (shouldRender) {
            this.requestRenderAll();
        }
        else if (!isClick) {
            this.renderTop();
        }
    }
    /**
     * @private
     * Handle event firing for target and subtargets
     * @param {String} eventType event to fire (up, down or move)
     * @param {Event} e event from mouse
     * @param {object} [data] event data overrides
     * @return {object} options
     */
    _simpleEventHandler(eventType, { e, ...data }) {
        const target = this.findTarget(e), subTargets = this.targets || [];
        // @ts-expect-error TODO fix generic e
        return this._basicEventHandler(eventType, {
            e,
            target,
            subTargets,
            ...data,
        });
    }
    _basicEventHandler(eventType, options) {
        const { target, subTargets = [] } = options;
        this.fire(eventType, options);
        target && target.fire(eventType, options);
        for (let i = 0; i < subTargets.length; i++) {
            subTargets[i].fire(eventType, options);
        }
        return options;
    }
    /**
     * @private
     * Handle event firing for target and subtargets
     * @param {Event} e event from mouse
     * @param {String} eventType event to fire (up, down or move)
     * @param {fabric.Object} targetObj receiving event
     * @param {Number} [button] button used in the event 1 = left, 2 = middle, 3 = right
     * @param {Boolean} isClick for left button only, indicates that the mouse up happened without move.
     */
    _handleEvent(e, eventType, button = LEFT_CLICK, isClick = false) {
        const target = this._target, targets = this.targets || [], options = {
            e: e,
            target: target,
            subTargets: targets,
            button,
            isClick,
            pointer: this.getPointer(e),
            absolutePointer: this.getPointer(e, true),
            transform: this._currentTransform,
        };
        if (eventType === 'up') {
            options.currentTarget = this.findTarget(e);
            options.currentSubTargets = this.targets;
        }
        this.fire(`mouse:${eventType}`, options);
        // this may be a little be more complicated of what we want to handle
        target && target.fire(`mouse${eventType}`, options);
        for (let i = 0; i < targets.length; i++) {
            targets[i].fire(`mouse${eventType}`, options);
        }
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
        const transform = this._currentTransform, target = transform.target, options = {
            e,
            target,
            transform,
            action: transform.action,
        };
        if (target._scaling) {
            target._scaling = false;
        }
        target.setCoords();
        if (transform.actionPerformed ||
            // @ts-ignore
            (this.stateful && target.hasStateChanged())) {
            this.fire('object:modified', options);
            target.fire('modified', options);
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
        const pointer = this.getPointer(e);
        this.freeDrawingBrush &&
            this.freeDrawingBrush.onMouseDown(pointer, { e, pointer });
        this._handleEvent(e, 'down');
    }
    /**
     * @private
     * @param {Event} e Event object fired on mousemove
     */
    _onMouseMoveInDrawingMode(e) {
        if (this._isCurrentlyDrawing) {
            const pointer = this.getPointer(e);
            this.freeDrawingBrush &&
                this.freeDrawingBrush.onMouseMove(pointer, {
                    e,
                    pointer,
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
        const pointer = this.getPointer(e);
        if (this.freeDrawingBrush) {
            this._isCurrentlyDrawing = !!this.freeDrawingBrush.onMouseUp({
                e: e,
                pointer: pointer,
            });
        }
        else {
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
        this._cacheTransformEventData(e);
        this._handleEvent(e, 'down:before');
        let target = this._target;
        // if right click just fire events
        if (checkClick(e, RIGHT_CLICK)) {
            if (this.fireRightClick) {
                this._handleEvent(e, 'down', RIGHT_CLICK);
            }
            return;
        }
        if (checkClick(e, MIDDLE_CLICK)) {
            if (this.fireMiddleClick) {
                this._handleEvent(e, 'down', MIDDLE_CLICK);
            }
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
        const pointer = this.getPointer(e, true);
        // save pointer for check in __onMouseUp event
        this._previousPointer = pointer;
        const shouldRender = this._shouldRender(target), shouldGroup = this._shouldGroup(e, target);
        if (this._shouldClearSelection(e, target)) {
            this.discardActiveObject(e);
        }
        else if (shouldGroup) {
            // in order for shouldGroup to be true, target needs to be true
            this._handleGrouping(e, target);
            target = this._activeObject;
        }
        // we start a group selector rectangle if
        // selection is enabled
        // and there is no target, or the following 3 condition both apply
        // target is not selectable ( otherwise we selected it )
        // target is not editing
        // target is not already selected ( otherwise we drage )
        if (this.selection &&
            (!target ||
                (!target.selectable &&
                    // @ts-ignore
                    !target.isEditing &&
                    target !== this._activeObject))) {
            const p = this.getPointer(e);
            this._groupSelector = {
                ex: p.x,
                ey: p.y,
                top: 0,
                left: 0,
            };
        }
        if (target) {
            const alreadySelected = target === this._activeObject;
            if (target.selectable && target.activeOn === 'down') {
                this.setActiveObject(target, e);
            }
            const corner = target._findTargetCorner(this.getPointer(e, true), fabric.util.isTouchEvent(e));
            if (target === this._activeObject && (corner || !shouldGroup)) {
                this._setupCurrentTransform(e, target, alreadySelected);
                const control = target.controls[corner], pointer = this.getPointer(e), mouseDownHandler = control && control.getMouseDownHandler(e, target, control);
                if (mouseDownHandler) {
                    mouseDownHandler(e, this._currentTransform, pointer.x, pointer.y);
                }
            }
        }
        const invalidate = shouldRender || shouldGroup;
        //  we clear `_objectsToRender` in case of a change in order to repopulate it at rendering
        //  run before firing the `down` event to give the dev a chance to populate it themselves
        invalidate && (this._objectsToRender = undefined);
        this._handleEvent(e, 'down');
        // we must renderAll so that we update the visuals
        invalidate && this.requestRenderAll();
    }
    /**
     * reset cache form common information needed during event processing
     * @private
     */
    _resetTransformEventData() {
        this._target = undefined;
        this._pointer = undefined;
        this._absolutePointer = undefined;
    }
    /**
     * Cache common information needed during event processing
     * @private
     * @param {Event} e Event object fired on event
     */
    _cacheTransformEventData(e) {
        // reset in order to avoid stale caching
        this._resetTransformEventData();
        this._pointer = this.getPointer(e, true);
        this._absolutePointer = this.restorePointerVpt(this._pointer);
        this._target = this._currentTransform
            ? this._currentTransform.target
            : this.findTarget(e);
    }
    /**
     * @private
     */
    _beforeTransform(e) {
        const t = this._currentTransform;
        // @ts-ignore
        this.stateful && t.target.saveState();
        this.fire('before:transform', {
            e,
            transform: t,
        });
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
        this._handleEvent(e, 'move:before');
        this._cacheTransformEventData(e);
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
            const pointer = this.getPointer(e);
            groupSelector.left = pointer.x - groupSelector.ex;
            groupSelector.top = pointer.y - groupSelector.ey;
            this.renderTop();
        }
        else if (!this._currentTransform) {
            const target = this.findTarget(e);
            this._setCursorFromEvent(e, target);
            this._fireOverOutEvents(e, target);
        }
        else {
            this._transformObject(e);
        }
        this._handleEvent(e, 'move');
        this._resetTransformEventData();
    }
    /**
     * Manage the mouseout, mouseover events for the fabric object on the canvas
     * @param {Fabric.Object} target the target where the target from the mousemove event
     * @param {Event} e Event object fired on mousemove
     * @private
     */
    _fireOverOutEvents(e, target) {
        const _hoveredTarget = this._hoveredTarget, _hoveredTargets = this._hoveredTargets, targets = this.targets, length = Math.max(_hoveredTargets.length, targets.length);
        this.fireSyntheticInOutEvents('mouse', {
            e,
            target,
            oldTarget: _hoveredTarget,
            fireCanvas: true,
        });
        for (let i = 0; i < length; i++) {
            this.fireSyntheticInOutEvents('mouse', {
                e,
                target: targets[i],
                oldTarget: _hoveredTargets[i],
            });
        }
        this._hoveredTarget = target;
        this._hoveredTargets = this.targets.concat();
    }
    /**
     * Manage the dragEnter, dragLeave events for the fabric objects on the canvas
     * @param {Fabric.Object} target the target where the target from the onDrag event
     * @param {Object} data Event object fired on dragover
     * @private
     */
    _fireEnterLeaveEvents(target, data) {
        const draggedoverTarget = this._draggedoverTarget, _hoveredTargets = this._hoveredTargets, targets = this.targets, length = Math.max(_hoveredTargets.length, targets.length);
        this.fireSyntheticInOutEvents('drag', {
            ...data,
            target,
            oldTarget: draggedoverTarget,
            fireCanvas: true,
        });
        for (let i = 0; i < length; i++) {
            this.fireSyntheticInOutEvents('drag', {
                ...data,
                target: targets[i],
                oldTarget: _hoveredTargets[i],
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
    fireSyntheticInOutEvents(type, { target, oldTarget, fireCanvas, e, ...data }) {
        const { targetIn, targetOut, canvasIn, canvasOut } = syntheticEventConfig[type];
        const targetChanged = oldTarget !== target;
        if (oldTarget && targetChanged) {
            const outOpt = {
                ...data,
                e,
                target: oldTarget,
                nextTarget: target,
                isClick: false,
                pointer: this.getPointer(e),
                absolutePointer: this.getPointer(e, true),
            };
            fireCanvas && this.fire(canvasIn, outOpt);
            oldTarget.fire(targetOut, outOpt);
        }
        if (target && targetChanged) {
            const inOpt = {
                ...data,
                e,
                target,
                previousTarget: oldTarget,
                isClick: false,
                pointer: this.getPointer(e),
                absolutePointer: this.getPointer(e, true),
            };
            fireCanvas && this.fire(canvasOut, inOpt);
            target.fire(targetIn, inOpt);
        }
    }
    /**
     * Method that defines actions when an Event Mouse Wheel
     * @param {Event} e Event object fired on mouseup
     */
    __onMouseWheel(e) {
        this._cacheTransformEventData(e);
        this._handleEvent(e, 'wheel');
        this._resetTransformEventData();
    }
    /**
     * @private
     * @param {Event} e Event fired on mousemove
     */
    _transformObject(e) {
        const pointer = this.getPointer(e), transform = this._currentTransform, target = transform.target, 
        //  transform pointer to target's containing coordinate plane
        //  both pointer and object should agree on every point
        localPointer = target.group
            ? sendPointToPlane(pointer, undefined, target.group.calcTransformMatrix())
            : pointer;
        // seems used only here.
        // @TODO: investigate;
        // @ts-ignore
        transform.reset = false;
        transform.shiftKey = e.shiftKey;
        transform.altKey = !!this.centeredKey && e[this.centeredKey];
        this._performTransformAction(e, transform, localPointer);
        transform.actionPerformed && this.requestRenderAll();
    }
    /**
     * @private
     */
    _performTransformAction(e, transform, pointer) {
        const x = pointer.x, y = pointer.y, action = transform.action, actionHandler = transform.actionHandler;
        let actionPerformed = false;
        // this object could be created from the function in the control handlers
        if (actionHandler) {
            actionPerformed = actionHandler(e, transform, x, y);
        }
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
        const activeSelection = isActiveSelection(this._activeObject)
            ? this._activeObject
            : null, 
        // only show proper corner when group selection is not active
        corner = (!activeSelection || !activeSelection.contains(target)) &&
            // here we call findTargetCorner always with undefined for the touch parameter.
            // we assume that if you are using a cursor you do not need to interact with
            // the bigger touch area.
            target._findTargetCorner(this.getPointer(e, true));
        if (!corner) {
            if (target.subTargetCheck) {
                // hoverCursor should come from top-most subTarget,
                // so we walk the array backwards
                this.targets
                    .concat()
                    .reverse()
                    .map((_target) => {
                    hoverCursor = _target.hoverCursor || hoverCursor;
                });
            }
            this.setCursor(hoverCursor);
        }
        else {
            const control = target.controls[corner];
            this.setCursor(control.cursorStyleHandler(e, control, target));
        }
    }
    // Grouping objects mixin
    /**
     * Return true if the current mouse event that generated a new selection should generate a group
     * @private
     * @param {TPointerEvent} e Event object
     * @param {FabricObject} target
     * @return {Boolean}
     */
    _shouldGroup(e, target) {
        const activeObject = this._activeObject;
        // check if an active object exists on canvas and if the user is pressing the `selectionKey` while canvas supports multi selection.
        return (!!activeObject &&
            this._isSelectionKeyPressed(e) &&
            this.selection &&
            // on top of that the user also has to hit a target that is selectable.
            !!target &&
            target.selectable &&
            // if all pre-requisite pass, the target is either something different from the current
            // activeObject or if an activeSelection already exists
            // TODO at time of writing why `activeObject.type === 'activeSelection'` matter is unclear.
            // is a very old condition uncertain if still valid.
            (activeObject !== target || activeObject.type === 'activeSelection') &&
            //  make sure `activeObject` and `target` aren't ancestors of each other
            !target.isDescendantOf(activeObject) &&
            !activeObject.isDescendantOf(target) &&
            //  target accepts selection
            !target.onSelect({ e: e }));
    }
    /**
     * Handles active selection creation for user event
     * @private
     * @param {TPointerEvent} e Event object
     * @param {FabricObject} target
     */
    _handleGrouping(e, target) {
        let groupingTarget = target;
        // Called always a shouldGroup, meaning that we can trust this._activeObject exists.
        const activeObject = this._activeObject;
        // avoid multi select when shift click on a corner
        if (activeObject.__corner) {
            return;
        }
        if (groupingTarget === activeObject) {
            // if it's a group, find target again, using activeGroup objects
            groupingTarget = this.findTarget(e, true);
            // if even object is not found or we are on activeObjectCorner, bail out
            if (!groupingTarget || !groupingTarget.selectable) {
                return;
            }
        }
        if (activeObject && activeObject.type === 'activeSelection') {
            this._updateActiveSelection(e, groupingTarget);
        }
        else {
            this._createActiveSelection(e, groupingTarget);
        }
    }
    /**
     * @private
     */
    _updateActiveSelection(e, target) {
        const activeSelection = this._activeObject, currentActiveObjects = activeSelection.getObjects();
        if (target.group === activeSelection) {
            activeSelection.remove(target);
            this._hoveredTarget = target;
            this._hoveredTargets = this.targets.concat();
            if (activeSelection.size() === 1) {
                // activate last remaining object
                this._setActiveObject(activeSelection.item(0), e);
            }
        }
        else {
            activeSelection.add(target);
            this._hoveredTarget = activeSelection;
            this._hoveredTargets = this.targets.concat();
        }
        this._fireSelectionEvents(currentActiveObjects, e);
    }
    /**
     * Generates and set as active the active selection from user events
     * @private
     */
    _createActiveSelection(e, target) {
        const currentActive = this.getActiveObject();
        const groupObjects = target.isInFrontOf(currentActive)
            ? [currentActive, target]
            : [target, currentActive];
        // @ts-ignore
        currentActive.isEditing && currentActive.exitEditing();
        //  handle case: target is nested
        const newActiveSelection = new ActiveSelection(groupObjects, {
            canvas: this,
        });
        this._hoveredTarget = newActiveSelection;
        // ISSUE 4115: should we consider subTargets here?
        // this._hoveredTargets = [];
        // this._hoveredTargets = this.targets.concat();
        this._setActiveObject(newActiveSelection, e);
        this._fireSelectionEvents([currentActive], e);
    }
    /**
     * Finds objects inside the selection rectangle and group them
     * @private
     * @param {Event} e mouse event
     */
    _groupSelectedObjects(e) {
        const group = this._collectObjects(e);
        // do not create group for 1 element only
        if (group.length === 1) {
            this.setActiveObject(group[0], e);
        }
        else if (group.length > 1) {
            const aGroup = new ActiveSelection(group.reverse(), {
                canvas: this,
            });
            this.setActiveObject(aGroup, e);
        }
    }
    /**
     * @private
     */
    _collectObjects(e) {
        const group = [], _groupSelector = this._groupSelector, point1 = new Point(_groupSelector.ex, _groupSelector.ey), point2 = point1.add(new Point(_groupSelector.left, _groupSelector.top)), selectionX1Y1 = point1.min(point2), selectionX2Y2 = point1.max(point2), allowIntersect = !this.selectionFullyContained, isClick = point1.eq(point2);
        // we iterate reverse order to collect top first in case of click.
        for (let i = this._objects.length; i--;) {
            const currentObject = this._objects[i];
            if (!currentObject ||
                !currentObject.selectable ||
                !currentObject.visible) {
                continue;
            }
            if ((allowIntersect &&
                currentObject.intersectsWithRect(selectionX1Y1, selectionX2Y2, true)) ||
                currentObject.isContainedWithinRect(selectionX1Y1, selectionX2Y2, true) ||
                (allowIntersect &&
                    currentObject.containsPoint(selectionX1Y1, undefined, true)) ||
                (allowIntersect &&
                    currentObject.containsPoint(selectionX2Y2, undefined, true))) {
                group.push(currentObject);
                // only add one object if it's a click
                if (isClick) {
                    break;
                }
            }
        }
        if (group.length > 1) {
            return group.filter((object) => !object.onSelect({ e }));
        }
        return group;
    }
    /**
     * @private
     */
    _maybeGroupObjects(e) {
        if (this.selection && this._groupSelector) {
            this._groupSelectedObjects(e);
        }
        this.setCursor(this.defaultCursor);
        // clear selection and current transformation
        this._groupSelector = null;
    }
    /**
     * Clones canvas instance without cloning existing data.
     * This essentially copies canvas dimensions since loadFromJSON does not affect canvas size.
     * @returns {StaticCanvas}
     */
    cloneWithoutData() {
        const el = createCanvasElement();
        el.width = this.width;
        el.height = this.height;
        // this seems wrong. either Canvas or StaticCanvas
        return new Canvas(el);
    }
}
// there is an order execution bug if i put this as public property.
Object.assign(Canvas.prototype, {
    eventsBound: false,
});
fabric.Canvas = Canvas;

exports.Canvas = Canvas;
exports.StaticCanvas = StaticCanvas;
exports.config = config;
//# sourceMappingURL=fabric.js.map
