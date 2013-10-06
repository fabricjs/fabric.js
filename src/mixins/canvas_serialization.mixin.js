fabric.util.object.extend(fabric.StaticCanvas.prototype, /** @lends fabric.StaticCanvas.prototype */ {

  /**
   * Populates canvas with data from the specified dataless JSON.
   * JSON format must conform to the one of {@link fabric.Canvas#toDatalessJSON}
   * @deprecated since 1.2.2
   * @param {String|Object} json JSON string or object
   * @param {Function} callback Callback, invoked when json is parsed
   *                            and corresponding objects (e.g: {@link fabric.Image})
   *                            are initialized
   * @param {Function} [reviver] Method for further parsing of JSON elements, called after each fabric object created.
   * @return {fabric.Canvas} instance
   * @chainable
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-3/#deserialization}
   */
  loadFromDatalessJSON: function (json, callback, reviver) {
    return this.loadFromJSON(json, callback, reviver);
  },

  /**
   * Populates canvas with data from the specified JSON.
   * JSON format must conform to the one of {@link fabric.Canvas#toJSON}
   * @param {String|Object} json JSON string or object
   * @param {Function} callback Callback, invoked when json is parsed
   *                            and corresponding objects (e.g: {@link fabric.Image})
   *                            are initialized
   * @param {Function} [reviver] Method for further parsing of JSON elements, called after each fabric object created.
   * @return {fabric.Canvas} instance
   * @chainable
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-3/#deserialization}
   * @see {@link http://jsfiddle.net/fabricjs/fmgXt/|jsFiddle demo}
   * @example <caption>loadFromJSON</caption>
   * canvas.loadFromJSON(json, canvas.renderAll.bind(canvas));
   * @example <caption>loadFromJSON with reviver</caption>
   * canvas.loadFromJSON(json, canvas.renderAll.bind(canvas), function(o, object) {
   *   // `o` = json object
   *   // `object` = fabric.Object instance
   *   // ... do some stuff ...
   * });
   */
  loadFromJSON: function (json, callback, reviver) {
    if (!json) return;

    // serialize if it wasn't already
    var serialized = (typeof json === 'string')
      ? JSON.parse(json)
      : json;

    this.clear();

    var _this = this;
    this._enlivenObjects(serialized.objects, function () {
      _this._setBgOverlayImages(serialized, callback);
    }, reviver);

    return this;
  },

  _setBgOverlayImages: function(serialized, callback) {

    var _this = this,
        backgroundPatternLoaded,
        backgroundImageLoaded,
        overlayImageLoaded;

    var cbIfLoaded = function () {
      callback && backgroundImageLoaded && overlayImageLoaded && backgroundPatternLoaded && callback();
    };

    if (serialized.backgroundImage) {
      this.setBackgroundImage(serialized.backgroundImage, function() {

        _this.backgroundImageOpacity = serialized.backgroundImageOpacity;
        _this.backgroundImageStretch = serialized.backgroundImageStretch;

        _this.renderAll();

        backgroundImageLoaded = true;

        cbIfLoaded();
      });
    }
    else {
      backgroundImageLoaded = true;
    }

    if (serialized.overlayImage) {
      this.setOverlayImage(serialized.overlayImage, function() {

        _this.overlayImageLeft = serialized.overlayImageLeft || 0;
        _this.overlayImageTop = serialized.overlayImageTop || 0;

        _this.renderAll();
        overlayImageLoaded = true;

        cbIfLoaded();
      });
    }
    else {
      overlayImageLoaded = true;
    }

    if (serialized.background) {
      this.setBackgroundColor(serialized.background, function() {

        _this.renderAll();
        backgroundPatternLoaded = true;

        cbIfLoaded();
      });
    }
    else {
      backgroundPatternLoaded = true;
    }

    if (!serialized.backgroundImage && !serialized.overlayImage && !serialized.background) {
      callback && callback();
    }
  },

  /**
   * @private
   * @param {Array} objects
   * @param {Function} callback
   * @param {Function} [reviver]
   */
  _enlivenObjects: function (objects, callback, reviver) {
    var _this = this;

    if (objects.length === 0) {
      callback && callback();
    }

    var renderOnAddRemove = this.renderOnAddRemove;
    this.renderOnAddRemove = false;

    fabric.util.enlivenObjects(objects, function(enlivenedObjects) {
      enlivenedObjects.forEach(function(obj, index) {
        _this.insertAt(obj, index, true);
      });

      _this.renderOnAddRemove = renderOnAddRemove;
      callback && callback();
    }, null, reviver);
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
   */
  clone: function (callback, properties) {
    var data = JSON.stringify(this.toJSON(properties));
    this.cloneWithoutData(function(clone) {
      clone.loadFromJSON(data, function() {
        callback && callback(clone);
      });
    });
  },

  /**
   * Clones canvas instance without cloning existing data.
   * This essentially copies canvas dimensions, clipping properties, etc.
   * but leaves data empty (so that you can populate it with your own)
   * @param {Object} [callback] Receives cloned instance as a first argument
   */
  cloneWithoutData: function(callback) {
    var el = fabric.document.createElement('canvas');

    el.width = this.getWidth();
    el.height = this.getHeight();

    var clone = new fabric.Canvas(el);
    clone.clipTo = this.clipTo;
    if (this.backgroundImage) {
      clone.setBackgroundImage(this.backgroundImage.src, function() {
        clone.renderAll();
        callback && callback(clone);
      });
      clone.backgroundImageOpacity = this.backgroundImageOpacity;
      clone.backgroundImageStretch = this.backgroundImageStretch;
    }
    else {
      callback && callback(clone);
    }
  }
});
