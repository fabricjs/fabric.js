//@ts-nocheck

import { fabric } from '../../HEADER';
import { extend } from '../util/lang_object';
import { createCanvasElement } from '../util/misc/dom';
import {
  enlivenObjectEnlivables,
  enlivenObjects,
} from '../util/misc/objectEnlive';

extend(
  fabric.StaticCanvas.prototype,
  /** @lends fabric.StaticCanvas.prototype */ {
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
     * @return {Promise<fabric.Canvas>} instance
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
    loadFromJSON(json, reviver, options) {
      if (!json) {
        return Promise.reject(new Error('fabric.js: `json` is undefined'));
      }

      const renderOnAddRemove = this.renderOnAddRemove;
      this.renderOnAddRemove = false;

      const {
        backgroundImage,
        background: backgroundColor,
        overlayImage,
        overlay: overlayColor,
        clipPath,
        objects = [],
        ...props
      } = typeof json === 'string' ? JSON.parse(json) : json;

      return Promise.all([
        enlivenObjects(objects, {
          reviver: reviver,
          signal: options && options.signal,
        }),
        enlivenObjectEnlivables(
          {
            backgroundImage,
            backgroundColor,
            overlayImage,
            overlayColor,
            clipPath,
          },
          { signal: options && options.signal }
        ),
      ]).then(([enlivenedObjects, enlivedMap]) => {
        this.clear();
        enlivenedObjects.forEach((obj, index) => {
          // we splice the array just in case some custom classes restored from JSON
          // will add more object to canvas at canvas init.
          this.insertAt(obj, index);
        });
        this.renderOnAddRemove = renderOnAddRemove;
        this.set({
          ...props,
          backgroundColor,
          overlayColor,
          ...enlivedMap,
        });
      });
    },

    cloneBare() {
      const el = createCanvasElement();
      el.width = this.width;
      el.height = this.height;
      return this instanceof fabric.Canvas
        ? new fabric.Canvas(el)
        : new fabric.StaticCanvas(el);
    },

    /**
     * Clones canvas instance
     * @param {Array} [properties] Array of properties to include in the cloned canvas and children
     * @returns {Promise<fabric.Canvas>}
     */
    async clone(properties) {
      const data = this.toObject(properties);
      const clone = this.cloneBare();
      await clone.loadFromJSON(data);
      return clone;
    },

    /**
     * Clones canvas instance without cloning existing data.
     * This essentially copies canvas dimensions, clipping properties, etc.
     * but leaves data empty (so that you can populate it with your own)
     * @returns {Promise<fabric.Canvas>}
     */
    async cloneWithoutData() {
      const clone = this.cloneBare();
      await clone.loadFromJSON({
        backgroundImage: this.backgroundImage?.toObject(),
        background: this.backgroundColor?.toObject
          ? this.backgroundColor.toObject()
          : this.backgroundColor,
      });
      return clone;
    },
  }
);
