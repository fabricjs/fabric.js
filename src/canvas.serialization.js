fabric.util.object.extend(fabric.StaticCanvas.prototype, {

  /**
   * Populates canvas with data from the specified dataless JSON
   * JSON format must conform to the one of `fabric.Canvas#toDatalessJSON`
   * @method loadFromDatalessJSON
   * @param {String} json JSON string
   * @param {Function} callback Callback, invoked when json is parsed
   *                            and corresponding objects (e.g: fabric.Image)
   *                            are initialized
   * @return {fabric.Canvas} instance
   * @chainable
   */
  loadFromDatalessJSON: function (json, callback) {

    if (!json) {
      return;
    }

    // serialize if it wasn't already
    var serialized = (typeof json === 'string')
      ? JSON.parse(json)
      : json;

    if (!serialized || (serialized && !serialized.objects)) return;

    this.clear();

    // TODO: test this
    this.backgroundColor = serialized.background;
    this._enlivenDatalessObjects(serialized.objects, callback);
  },

  /**
   * @method _enlivenDatalessObjects
   * @param {Array} objects
   * @param {Function} callback
   */
  _enlivenDatalessObjects: function (objects, callback) {

    /** @ignore */
    function onObjectLoaded(object, index) {
      _this.insertAt(object, index, true);
      object.setCoords();
      if (++numLoadedObjects === numTotalObjects) {
        callback && callback();
      }
    }

    var _this = this,
        numLoadedObjects = 0,
        numTotalObjects = objects.length;

    if (numTotalObjects === 0 && callback) {
      callback();
    }

    try {
      objects.forEach(function (obj, index) {

        var pathProp = obj.paths ? 'paths' : 'path';
        var path = obj[pathProp];

        delete obj[pathProp];

        if (typeof path !== 'string') {
          switch (obj.type) {
            case 'image':
              fabric[fabric.util.string.capitalize(obj.type)].fromObject(obj, function (o) {
                onObjectLoaded(o, index);
              });
              break;
            default:
              var klass = fabric[fabric.util.string.camelize(fabric.util.string.capitalize(obj.type))];
              if (klass && klass.fromObject) {
                // restore path
                if (path) {
                  obj[pathProp] = path;
                }
                onObjectLoaded(klass.fromObject(obj), index);
              }
              break;
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

            obj.path = path;
            var object = fabric.Text.fromObject(obj);
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
            }

            fabric.util.getScript(path, onscriptload);
          }
          else {
            fabric.loadSVGFromURL(path, function (elements, options) {
              if (elements.length > 1) {
                var object = new fabric.PathGroup(elements, obj);
              }
              else {
                var object = elements[0];
              }
              object.setSourcePath(path);

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
      }, this);
    }
    catch(e) {
      fabric.log(e.message);
    }
  },

  /**
   * Populates canvas with data from the specified JSON
   * JSON format must conform to the one of `fabric.Canvas#toJSON`
   * @method loadFromJSON
   * @param {String} json JSON string
   * @param {Function} callback Callback, invoked when json is parsed
   *                            and corresponding objects (e.g: fabric.Image)
   *                            are initialized
   * @return {fabric.Canvas} instance
   * @chainable
   */
  loadFromJSON: function (json, callback) {
    if (!json) return;

    var serialized = JSON.parse(json);
    if (!serialized || (serialized && !serialized.objects)) return;

    this.clear();
    var _this = this;
    this._enlivenObjects(serialized.objects, function () {
      _this.backgroundColor = serialized.background;

      if (serialized.backgroundImage) {
        _this.setBackgroundImage(serialized.backgroundImage, _this.renderAll.bind(_this));
        _this.backgroundImageOpacity = serialized.backgroundImageOpacity;
        _this.backgroundImageStretch = serialized.backgroundImageStretch;
      }
      if (callback) {
        callback();
      }
    });

    return this;
  },

  /**
   * @method _enlivenObjects
   * @param {Array} objects
   * @param {Function} callback
   */
  _enlivenObjects: function (objects, callback) {
    var numLoadedImages = 0,
        // get length of all images
        numTotalImages = objects.filter(function (o) {
          return o.type === 'image';
        }).length;

    var _this = this;

    objects.forEach(function (o, index) {
      if (!o.type) {
        return;
      }
      switch (o.type) {
        case 'image':
        case 'font':
          fabric[fabric.util.string.capitalize(o.type)].fromObject(o, function (o) {
            _this.insertAt(o, index, true);
            if (++numLoadedImages === numTotalImages) {
              if (callback) {
                callback();
              }
            }
          });
          break;
        default:
          var klass = fabric[fabric.util.string.camelize(fabric.util.string.capitalize(o.type))];
          if (klass && klass.fromObject) {
            _this.insertAt(klass.fromObject(o), index, true);
          }
          break;
      }
    });

    if (numTotalImages === 0 && callback) {
      callback();
    }
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
        if (callback) {
          callback(clone);
        }
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

    // cache
    var clone = this.__clone || (this.__clone = new fabric.Canvas(el));
    clone.clipTo = this.clipTo;

    if (callback) {
      callback(clone);
    }
  }
});