fabric.util.object.extend(fabric.StaticCanvas.prototype, /** @lends fabric.StaticCanvas.prototype */ {
  /**
   * Populates canvas with data from the specified JSON.
   * JSON format must conform to the one of {@link fabric.Canvas#toJSON}
   * @param {String|Object} json JSON string or object
   * @param {Function} [reviver] Method for further parsing of JSON elements, called after each fabric object created.
   * @return {Promise<fabric.Canvas>} instance
   * @chainable
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
   *   ... your canvas callback
   * });
   */
  loadFromJSON: function (json, reviver) {
    if (!json) {
      return;
    }

    // serialize if it wasn't already
    var serialized = (typeof json === 'string')
      ? JSON.parse(json)
      : fabric.util.object.clone(json);

    var _this = this,
        renderOnAddRemove = this.renderOnAddRemove;

    this.renderOnAddRemove = false;

    return fabric.util.enlivenObjects(serialized.objects || [], '', reviver)
      .then(function(enlived) {
        _this.clear();
        return fabric.util.enlivenObjectEnlivables({
          backgroundImage: serialized.backgroundImage,
          backgroundColor: serialized.background,
          overlayImage: serialized.overlayImage,
          overlayColor: serialized.overlay,
          clipPath: serialized.clipPath,
        })
          .then(function(enlivedMap) {
            _this.__setupCanvas(serialized, enlived, renderOnAddRemove);
            _this.set(enlivedMap);
            return _this;
          });
      });
  },

  /**
   * @private
   * @param {Object} serialized Object with background and overlay information
   * @param {Array} enlivenedObjects canvas objects
   * @param {boolean} renderOnAddRemove renderOnAddRemove setting for the canvas
   */
  __setupCanvas: function(serialized, enlivenedObjects, renderOnAddRemove) {
    var _this = this;
    enlivenedObjects.forEach(function(obj, index) {
      // we splice the array just in case some custom classes restored from JSON
      // will add more object to canvas at canvas init.
      _this.insertAt(obj, index);
    });
    this.renderOnAddRemove = renderOnAddRemove;
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
   * @private
   * @param {String} property Property to set (backgroundColor, overlayColor)
   * @param {(Object|String)} value Value to set
   */
  __setBgOverlay: function(property, value) {
    var _this = this;

    if (!value) {
      return;
    }
    this['set' + fabric.util.string.capitalize(property, true)](value);
  },

  /**
   * @private
   * @param {String} format
   * @param {Function} callback
   */
  _toDataURL: function (format, callback) {
    this.clone(function (clone) {
      callback(clone.toDataURL(format));
    });
  },

  /**
   * @private
   * @param {String} format
   * @param {Number} multiplier
   * @param {Function} callback
   */
  _toDataURLWithMultiplier: function (format, multiplier, callback) {
    this.clone(function (clone) {
      callback(clone.toDataURLWithMultiplier(format, multiplier));
    });
  },

  /**
   * Clones canvas instance
   * @param {Object} [callback] Receives cloned instance as a first argument
   * @param {Array} [properties] Array of properties to include in the cloned canvas and children
   * @returns {Promise<fabric.Canvas>}
   */
  clone: function (properties) {
    var data = JSON.stringify(this.toJSON(properties));
    return this.cloneWithoutData().then(function(clone) {
      return clone.loadFromJSON(data);
    });
  },

  /**
   * Clones canvas instance without cloning existing data.
   * This essentially copies canvas dimensions, clipping properties, etc.
   * but leaves data empty (so that you can populate it with your own)
   * @param {Object} [callback] Receives cloned instance as a first argument
   * @returns {Promise<fabric.Canvas>}
   */
  cloneWithoutData: function() {
    var el = fabric.util.createCanvasElement();

    el.width = this.width;
    el.height = this.height;
    // this seems wrong. either Canvas or StaticCanvas
    var clone = new fabric.Canvas(el);
    if (this.backgroundImage) {
      // TODO verify this
      clone.setBackgroundImage(this.backgroundImage.src);
      return Promise.resolve(clone);
    }
    return Promise.resolve(clone);
  }
});
