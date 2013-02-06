fabric.util.object.extend(fabric.StaticCanvas.prototype, /** @scope fabric.StaticCanvas.prototype */ {

  /**
   * Populates canvas with data from the specified dataless JSON
   * JSON format must conform to the one of `fabric.Canvas#toDatalessJSON`
   * @method loadFromDatalessJSON
   * @param {String|Object} json JSON string or object
   * @param {Function} callback Callback, invoked when json is parsed
   *                            and corresponding objects (e.g: fabric.Image)
   *                            are initialized
   * @return {fabric.Canvas} instance
   * @chainable
   */
  loadFromDatalessJSON: function (json, callback) {

    if (!json) return;

    // serialize if it wasn't already
    var serialized = (typeof json === 'string')
      ? JSON.parse(json)
      : json;

    if (!serialized || (serialized && !serialized.objects)) return;

    this.clear();

    var _this = this;
    this._enlivenDatalessObjects(serialized.objects, function() {
      _this._setBgOverlayImages(serialized, callback);
    });
  },

  /**
   * @method _enlivenDatalessObjects
   * @param {Array} objects
   * @param {Function} callback
   */
  _enlivenDatalessObjects: function (objects, callback) {
    var _this = this,
        numLoadedObjects = 0,
        numTotalObjects = objects.length;

    /** @ignore */
    function onObjectLoaded(object, index) {
      _this.insertAt(object, index, true);
      object.setCoords();
      if (++numLoadedObjects === numTotalObjects) {
        callback && callback();
      }
    }

    /** @ignore */
    function loadObject(obj, index) {

      var pathProp = obj.paths ? 'paths' : 'path';
      var path = obj[pathProp];

      delete obj[pathProp];

      if (typeof path !== 'string') {
        if (obj.type === 'image' || obj.type === 'group') {
          fabric[fabric.util.string.capitalize(obj.type)].fromObject(obj, function (o) {
            onObjectLoaded(o, index);
          });
        }
        else {
          var klass = fabric[fabric.util.string.camelize(fabric.util.string.capitalize(obj.type))];
          if (!klass || !klass.fromObject) return;

          // restore path
          if (path) {
            obj[pathProp] = path;
          }
          onObjectLoaded(klass.fromObject(obj), index);
        }
      }
      else {
        if (obj.type === 'image') {
          fabric.util.loadImage(path, function (image) {
            var oImg = new fabric.Image(image);

            oImg.setSourcePath(path);

            fabric.util.object.extend(oImg, obj);
            oImg.setAngle(obj.angle);

            onObjectLoaded(oImg, index);
          });
        }
        else if (obj.type === 'text') {

          if (obj.useNative) {
            onObjectLoaded(fabric.Text.fromObject(obj), index);
          }
          else {
            obj.path = path;
            var object = fabric.Text.fromObject(obj);
            /** @ignore */
            var onscriptload = function () {
              // TODO (kangax): find out why Opera refuses to work without this timeout
              if (Object.prototype.toString.call(fabric.window.opera) === '[object Opera]') {
                setTimeout(function () {
                  onObjectLoaded(object, index);
                }, 500);
              }
              else {
                onObjectLoaded(object, index);
              }
            };

            fabric.util.getScript(path, onscriptload);
          }
        }
        else {
          fabric.loadSVGFromURL(path, function (elements) {
            var object = fabric.util.groupSVGElements(elements, obj, path);

            // copy parameters from serialied json to object (left, top, scaleX, scaleY, etc.)
            // skip this step if an object is a PathGroup, since we already passed it options object before
            if (!(object instanceof fabric.PathGroup)) {
              fabric.util.object.extend(object, obj);
              if (typeof obj.angle !== 'undefined') {
                object.setAngle(obj.angle);
              }
            }

            onObjectLoaded(object, index);
          });
        }
      }
    }

    if (numTotalObjects === 0 && callback) {
      callback();
    }

    try {
      objects.forEach(loadObject, this);
    }
    catch(e) {
      fabric.log(e);
    }
  },

  /**
   * Populates canvas with data from the specified JSON
   * JSON format must conform to the one of `fabric.Canvas#toJSON`
   * @method loadFromJSON
   * @param {String|Object} json JSON string or object
   * @param {Function} callback Callback, invoked when json is parsed
   *                            and corresponding objects (e.g: fabric.Image)
   *                            are initialized
   * @return {fabric.Canvas} instance
   * @chainable
   */
  loadFromJSON: function (json, callback) {
    if (!json) return;

    // serialize if it wasn't already
    var serialized = (typeof json === 'string')
      ? JSON.parse(json)
      : json;

    var _this = this;
    this._enlivenObjects(serialized.objects, function () {
      _this._setBgOverlayImages(serialized, callback);
    });

    return this;
  },

  _setBgOverlayImages: function(serialized, callback) {

    var _this = this,
        backgroundPatternLoaded,
        backgroundImageLoaded,
        overlayImageLoaded;

    if (serialized.backgroundImage) {
      this.setBackgroundImage(serialized.backgroundImage, function() {

        _this.backgroundImageOpacity = serialized.backgroundImageOpacity;
        _this.backgroundImageStretch = serialized.backgroundImageStretch;

        _this.renderAll();

        backgroundImageLoaded = true;

        callback && overlayImageLoaded && backgroundPatternLoaded && callback();
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

        callback && backgroundImageLoaded && backgroundPatternLoaded && callback();
      });
    }
    else {
      overlayImageLoaded = true;
    }

    if (serialized.background) {
      this.setBackgroundColor(serialized.background, function() {

        _this.renderAll();
        backgroundPatternLoaded = true;

        callback && overlayImageLoaded && backgroundImageLoaded && callback();
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
   * @method _enlivenObjects
   * @param {Array} objects
   * @param {Function} callback
   */
  _enlivenObjects: function (objects, callback) {
    var _this = this;
    fabric.util.enlivenObjects(objects, function(enlivenedObjects) {
      enlivenedObjects.forEach(function(obj, index) {
        _this.insertAt(obj, index, true);
      });
      callback && callback();
    });
  },

  /**
   * @private
   * @method _toDataURL
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
   * @method _toDataURLWithMultiplier
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
   * @method clone
   * @param {Object} [callback] Receives cloned instance as a first argument
   */
  clone: function (callback) {
    var data = JSON.stringify(this);
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
   * @method cloneWithoutData
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