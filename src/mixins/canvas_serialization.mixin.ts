//@ts-nocheck

import { StaticCanvas } from '../static_canvas.class';
import { extend } from '../util/lang_object';
import { createCanvasElement } from '../util/misc/dom';
import {
  enlivenObjectEnlivables,
  EnlivenObjectOptions,
  enlivenObjects,
} from '../util/misc/objectEnlive';

extend(StaticCanvas.prototype, {
  /**
   * Populates canvas with data from the specified JSON.
   * JSON format must conform to the one of {@link StaticCanvas#toJSON}.
   *
   * **IMPORTANT**:\
   * It is recommended to abort loading tasks **before** calling this method to prevent race conditions and unnecessary networking.
   *
   * @param {JSON | string} json JSON string or object
   * @param {EnlivenObjectOptions['reviver']} [reviver] Method for further parsing of JSON elements, called after each fabric object created.
   * @param {{ signal?: AbortSignal }} [options] options
   *
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-3#deserialization deserialization}
   *
   * @example <caption>loadFromJSON</caption>
   * await canvas.loadFromJSON(json);
   * canvas.requestRenderAll();
   *
   * @example <caption>loadFromJSON with reviver</caption>
   * await canvas.loadFromJSON(json, (data: Record<string, any>, instance: FabricObject) => {
   *    // customize instance
   * });
   * // canvas is restored, add your code.
   *
   */
  async loadFromJSON(
    json: JSON | string,
    reviver: EnlivenObjectOptions['reviver'],
    options: {
      /**
       * @see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
       */
      signal?: AbortSignal;
    } = {}
  ) {
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

    const [enlivenedObjects, enlivedMap] = await Promise.all([
      enlivenObjects(objects, {
        ...options,
        reviver,
      }),
      enlivenObjectEnlivables(
        {
          backgroundImage,
          backgroundColor,
          overlayImage,
          overlayColor,
          clipPath,
        },
        options
      ),
    ]);
    this.clear();
    this.add(...enlivenedObjects);
    this.renderOnAddRemove = renderOnAddRemove;
    this.set({
      ...props,
      // we pass background/overlay color in case they were not enlived (if they are plain colors)
      backgroundColor,
      overlayColor,
      ...enlivedMap,
    });
  },

  cloneBare() {
    const el = createCanvasElement();
    el.width = this.width;
    el.height = this.height;
    return new this.constructor(el);
  },

  /**
   * Clones canvas instance
   * @param {Array} [properties] Array of properties to include in the cloned canvas and children
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
});
