//@ts-nocheck
(function (global) {
  var fabric = global.fabric;
  fabric.util.object.extend(
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
      loadFromJSON: function (json, reviver, options) {
        if (!json) {
          return Promise.reject(new Error('fabric.js: `json` is undefined'));
        }

        // serialize if it wasn't already
        var serialized =
          typeof json === 'string' ? JSON.parse(json) : Object.assign({}, json);

        var _this = this,
          renderOnAddRemove = this.renderOnAddRemove;
        this.renderOnAddRemove = false;

        return Promise.all([
          fabric.util.enlivenObjects(serialized.objects || [], {
            reviver: reviver,
            signal: options && options.signal,
          }),
          fabric.util.enlivenObjectEnlivables(
            {
              backgroundImage: serialized.backgroundImage,
              backgroundColor: serialized.background,
              overlayImage: serialized.overlayImage,
              overlayColor: serialized.overlay,
              clipPath: serialized.clipPath,
            },
            { signal: options && options.signal }
          ),
        ]).then(function (res) {
          var enlived = res[0],
            enlivedMap = res[1];
          _this.clear();
          _this.__setupCanvas(serialized, enlived);
          _this.renderOnAddRemove = renderOnAddRemove;
          _this.set(enlivedMap);
          return _this;
        });
      },

      /**
       * @private
       * @param {Object} serialized Object with background and overlay information
       * @param {Array} enlivenedObjects canvas objects
       */
      __setupCanvas: function (serialized, enlivenedObjects) {
        var _this = this;
        enlivenedObjects.forEach(function (obj, index) {
          // we splice the array just in case some custom classes restored from JSON
          // will add more object to canvas at canvas init.
          _this.insertAt(obj, index);
        });
        // remove parts i cannot set as options
        delete serialized.objects;
        delete serialized.backgroundImage;
        delete serialized.overlayImage;
        delete serialized.background;
        delete serialized.overlay;
        // this._initOptions does too many things to just
        // call it. Normally loading an Object from JSON
        // create the Object instance. Here the Canvas is
        // already an instance and we are just loading things over it
        this._setOptions(serialized);
      },

      /**
       * Clones canvas instance
       * @param {Array} [properties] Array of properties to include in the cloned canvas and children
       * @returns {Promise<fabric.Canvas>}
       */
      clone: function (properties) {
        var data = JSON.stringify(this.toJSON(properties));
        return this.cloneWithoutData().then(function (clone) {
          return clone.loadFromJSON(data);
        });
      },

      /**
       * Clones canvas instance without cloning existing data.
       * This essentially copies canvas dimensions, clipping properties, etc.
       * but leaves data empty (so that you can populate it with your own)
       * @returns {Promise<fabric.Canvas>}
       */
      cloneWithoutData: function () {
        var el = fabric.util.createCanvasElement();

        el.width = this.width;
        el.height = this.height;
        // this seems wrong. either Canvas or StaticCanvas
        var clone = new fabric.Canvas(el);
        var data = {};
        if (this.backgroundImage) {
          data.backgroundImage = this.backgroundImage.toObject();
        }
        if (this.backgroundColor) {
          data.background = this.backgroundColor.toObject
            ? this.backgroundColor.toObject()
            : this.backgroundColor;
        }
        return clone.loadFromJSON(data);
      },
    }
  );
})(typeof exports !== 'undefined' ? exports : window);
