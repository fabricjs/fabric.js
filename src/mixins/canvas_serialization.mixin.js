fabric.util.object.extend(fabric.StaticCanvas.prototype, /** @lends fabric.StaticCanvas.prototype */ {

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
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-3#deserialization}
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
    if (!json) {
      return;
    }

    // serialize if it wasn't already
    var automaticRender = this.automaticRender,
        serialized = (typeof json === 'string')
          ? JSON.parse(json)
          : fabric.util.object.clone(json);

    this.automaticRender = false;
    this.clear();
    var _this = this;
    this._enlivenObjects(serialized.objects, function () {
      _this._setBgOverlay([serialized.backgroundObject, serialized.overlayObject], function () {
        // remove parts i cannot set as options
        delete serialized.objects;
        delete serialized.backgroundObject;
        delete serialized.overlayObject;
        _this._initOptions(serialized);
        _this.automaticRender = automaticRender;
        callback && callback();
      }, reviver);
    }, reviver);
    return this;
  },

  /**
   * @private
   * @param {String} property Property to set (backgroundObject, overlayObject, backgroundFill, overlayFill)
   * @param {(Object|String)} value Value to set
   * @param {Object} loaded Set loaded property to true if property is set
   * @param {Object} callback Callback function to invoke after property is set
   */
  _setBgOverlay: function(objects, callback, reviver) {
    var _this = this;
    fabric.util.enlivenObjects(objects, function(enlivenedObjects) {
      enlivenedObjects.forEach(function(obj, index) {
        index === 0 && (_this.backgroundObject = obj);
        index === 1 && (_this.overlayObject = obj);
      });
      callback && callback();
    }, null, reviver);
  },

  /**
   * @private
   * @param {Array} objects
   * @param {Function} callback
   * @param {Function} [reviver]
   */
  _enlivenObjects: function (objects, callback, reviver) {
    var _this = this;

    if (!objects || objects.length === 0) {
      callback && callback();
      return;
    }

    fabric.util.enlivenObjects(objects, function(enlivenedObjects) {
      enlivenedObjects.forEach(function(obj, index) {
        // we splice the array just in case some custom classes restored from JSON
        // will add more object to canvas at canvas init.
        _this.insertAt(obj, index);
      });
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
    if (this.backgroundObject) {
      clone.setbackgroundObject(this.backgroundObject.src, function() {
        clone.renderAll();
        callback && callback(clone);
      });
      clone.backgroundObjectOpacity = this.backgroundObjectOpacity;
      clone.backgroundObjectStretch = this.backgroundObjectStretch;
    }
    else {
      callback && callback(clone);
    }
  }
});
