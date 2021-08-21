(function (global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = {}),
      min = fabric.util.array.min,
      max = fabric.util.array.max;

  if (fabric.Layer) {
    return;
  }

  /**
   * Layer class
   * @class fabric.Layer
   * @extends fabric.Object
   * @mixes fabric.Collection
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-3#groups}
   * @see {@link fabric.Layer#initialize} for constructor definition
   */
  fabric.Layer = fabric.util.createClass(fabric.Object, fabric.Collection, /** @lends fabric.Layer.prototype */ {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'layer',

    /**
     * Width of stroke
     * @type Number
     * @default
     */
    strokeWidth: 0,

    /**
     * Indicates if click, mouseover, mouseout events & hoverCursor should also check for subtargets
     * @type Boolean
     * @default
     */
    subTargetCheck: false,

    /**
     * Groups are container, do not render anything on theyr own, ence no cache properties
     * @type Array
     * @default
     */
    cacheProperties: [],

    /**
     * @type 'none' | 'wrap-content'
     * @default
     */
    layoutStrategy: 'wrap-content',

    /**
     * Constructor
     * @param {Object} objects Layer objects
     * @param {Object} [options] Options object
     * @return {Object} thisArg
     */
    initialize: function (objects, options) {
      this.callSuper('initialize', options || {});
      this._objects = objects || [];
      this.forEachObject(function (object) {
        object.layer = this;
        object.setCoords();
      }, this);
      var rect = this.getBoundingRect(true, true);
      this.width = options.width || rect.width;
      this.height = options.height || rect.height;
      var point = new fabric.Point(options.left || rect.left, options.top || rect.top);
      var originX = 'left', originY = 'top';
      if (options.originX && options.left) {
        originX = options.originX;
      }
      if (options.originY && options.top) {
        originY = options.originY;
      }
      this.setPositionByOrigin(point, originX, originY);
      this.setCoords();
      this._attachTransformHandler();
    },

    /**
     * @private
     */
    _attachTransformHandler: function () {
      var _this = this;
      this.on('mousedown:before', function () {
        _this._originalTransform = _this.calcTransformMatrix();
      });
      this.on('modified', function () {
        _this.applyTransformToObjects(_this._originalTransform);
      });
    },

    /**
     *
     * @param {number[]} pre layer transform to remove
     * @param {number[]} [post] layer transform to add, if no value is provided the current transform is used
     */
    applyTransformToObjects: function (pre, post) {
      var inv = fabric.util.invertTransform(pre);
      post = post || this.calcTransformMatrix();
      this.forEachObject(function (object) {
        var localTransform = fabric.util.multiplyTransformMatrices(inv, object.calcTransformMatrix());
        var transform = fabric.util.multiplyTransformMatrices(post, localTransform);
        fabric.util.applyTransformToObject(object, transform);
        object.setCoords();
      });
    },
    /*
        setPositionByOrigin: function (pos, originX, originY) {
          var pre = this.calcTransformMatrix();
          this.callSuper('setPositionByOrigin', pos, originX, originY);
          this.applyTransformToObjects(pre);
        },
    */

    /**
     * @private
     */
    _set: function (key, value) {
      if (key === 'canvas') {
        var i = this._objects.length;
        while (i--) {
          this._objects[i]._set(key, value);
        }
      }
      fabric.Object.prototype._set.call(this, key, value);
    },

    /**
     * @private
     */
    _onObjectAdded: function (object) {
      this.dirty = true;
      object.layer = this;
      object._set('canvas', this.canvas);
      this._applyLayoutStrategy();
    },

    /**
     * @private
     */
    _onObjectRemoved: function (object) {
      this.dirty = true;
      delete object.layer;
      this._applyLayoutStrategy();
    },

    /**
     * Returns coordinates of object's bounding rectangle (left, top, width, height)
     * the box is intended as aligned to axis of canvas.
     * @param {Boolean} [absolute] use coordinates without viewportTransform
     * @param {Boolean} [calculate] use coordinates of current position instead of .oCoords / .aCoords
     * @return {Object} Object with left, top, width, height properties
     */
    getBoundingRect: function (absolute, calculate) {
      var aX = [],
          aY = [],
          o, coords,
          i = 0, iLen = this._objects.length,
          j;

      for (; i < iLen; ++i) {
        o = this._objects[i];
        coords = o.getCoords(absolute, calculate);
        for (j = 0; j < coords.length; j++) {
          aX.push(coords[j].x);
          aY.push(coords[j].y);
        }
      }

      var minXY = new fabric.Point(min(aX), min(aY)),
          maxXY = new fabric.Point(max(aX), max(aY));

      return {
        left: minXY.x || 0,
        top: minXY.y || 0,
        width: (maxXY.x - minXY.x) / this.scaleX || 0,
        height: (maxXY.y - minXY.y) / this.scaleY || 0
      };
    },

    /**
     * @private
     */
    _applyBoundingRect: function (maintainPosition) {
      var rect = this.getBoundingRect(true, true);
      this.set({ width: rect.width, height: rect.height });
      !maintainPosition && this.setPositionByOrigin({ x: rect.left, y: rect.top }, 'left', 'top');
    },

    /**
     * @private
     */
    _applyLayoutStrategy: function (maintainPosition) {
      return;
      if (this.layoutStrategy === 'wrap-content') {
        this._applyBoundingRect(maintainPosition);
        this.setCoords();
        this.dirty = true;
      }
    },

    /**
     * Decide if the object should cache or not. Create its own cache level
     * needsItsOwnCache should be used when the object drawing method requires
     * a cache step. None of the fabric classes requires it.
     * Generally you do not cache objects in groups because the layer is already cached.
     * @return {Boolean}
     */
    shouldCache: function () {
      var ownCache = fabric.Object.prototype.shouldCache.call(this);
      if (ownCache) {
        for (var i = 0, len = this._objects.length; i < len; i++) {
          if (this._objects[i].willDrawShadow()) {
            this.ownCaching = false;
            return false;
          }
        }
      }
      return ownCache;
    },

    /**
     * Check if this object or a child object will cast a shadow
     * @return {Boolean}
     */
    willDrawShadow: function () {
      if (fabric.Object.prototype.willDrawShadow.call(this)) {
        return true;
      }
      for (var i = 0, len = this._objects.length; i < len; i++) {
        if (this._objects[i].willDrawShadow()) {
          return true;
        }
      }
      return false;
    },

    /**
     * Check if this layer or its parent layer are caching, recursively up
     * @return {Boolean}
     */
    isOnACache: function () {
      return this.ownCaching || (this.layer && this.layer.isOnACache());
    },

    /**
     * Execute the drawing operation for an object on a specified context
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    drawObject: function (ctx) {
      var m = fabric.util.invertTransform(this.calcTransformMatrix());
      ctx.save();
      ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
      for (var i = 0, len = this._objects.length; i < len; i++) {
        this._objects[i].render(ctx);
      }
      ctx.restore();
      this._drawClipPath(ctx);
    },

    /**
     * Check if cache is dirty
     */
    isCacheDirty: function (skipCanvas) {
      if (this.callSuper('isCacheDirty', skipCanvas)) {
        return true;
      }
      if (!this.statefullCache) {
        return false;
      }
      for (var i = 0, len = this._objects.length; i < len; i++) {
        if (this._objects[i].isCacheDirty(true)) {
          if (this._cacheCanvas) {
            // if this layer has not a cache canvas there is nothing to clean
            var x = this.cacheWidth / this.zoomX, y = this.cacheHeight / this.zoomY;
            this._cacheContext.clearRect(-x / 2, -y / 2, x, y);
          }
          return true;
        }
      }
      return false;
    },

    /**
     * Returns object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject: function (propertiesToInclude) {
      var _includeDefaultValues = this.includeDefaultValues;
      var objsToObject = this._objects
        .filter(function (obj) {
          return !obj.excludeFromExport;
        })
        .map(function (obj) {
          var originalDefaults = obj.includeDefaultValues;
          obj.includeDefaultValues = _includeDefaultValues;
          var _obj = obj.toObject(propertiesToInclude);
          obj.includeDefaultValues = originalDefaults;
          return _obj;
        });
      var obj = fabric.Object.prototype.toObject.call(this, propertiesToInclude);
      obj.objects = objsToObject;
      return obj;
    },

    /**
     * Returns object representation of an instance, in dataless mode.
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toDatalessObject: function (propertiesToInclude) {
      var objsToObject, sourcePath = this.sourcePath;
      if (sourcePath) {
        objsToObject = sourcePath;
      }
      else {
        var _includeDefaultValues = this.includeDefaultValues;
        objsToObject = this._objects.map(function (obj) {
          var originalDefaults = obj.includeDefaultValues;
          obj.includeDefaultValues = _includeDefaultValues;
          var _obj = obj.toDatalessObject(propertiesToInclude);
          obj.includeDefaultValues = originalDefaults;
          return _obj;
        });
      }
      var obj = fabric.Object.prototype.toDatalessObject.call(this, propertiesToInclude);
      obj.objects = objsToObject;
      return obj;
    },

    /**
     * Destroys a layer (restoring state of its objects)
     * @return {fabric.Layer} thisArg
     * @chainable
     */
    destroy: function () {
      this._objects.forEach(function (object) {
        delete object.layer;
      });
    },

    /* _TO_SVG_START_ */
    /**
     * Returns transform-string for svg-export
     * @param {Boolean} use the full transform or the single object one.
     * @return {String}
     */
    getSvgTransform: function (full, additionalTransform) {
      var svgTransform = 'transform="' + fabric.util.matrixToSVG([1, 0, 0, 1, 0, 0]);
      return svgTransform +
        (additionalTransform || '') + '" ';
    },

    /**
     * Returns styles-string for svg-export, specific version for layer
     * @return {String}
     */
    getSvgStyles: function () {
      var opacity = typeof this.opacity !== 'undefined' && this.opacity !== 1 ?
            'opacity: ' + this.opacity + ';' : '',
          visibility = this.visible ? '' : ' visibility: hidden;';
      return [
        opacity,
        this.getSvgFilter(),
        visibility
      ].join('');
    },

    /**
     * Returns svg representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    _toSVG: function (reviver) {
      var svgString = ['<g ', 'COMMON_PARTS', ' >\n'];

      for (var i = 0, len = this._objects.length; i < len; i++) {
        svgString.push('\t\t', this._objects[i].toSVG(reviver));
      }
      svgString.push('</g>\n');
      return svgString;
    },

    /**
     * Returns svg clipPath representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toClipPathSVG: function (reviver) {
      var svgString = [];

      for (var i = 0, len = this._objects.length; i < len; i++) {
        svgString.push('\t', this._objects[i].toClipPathSVG(reviver));
      }

      return this._createBaseClipPathSVGMarkup(svgString, { reviver: reviver });
    },
    /* _TO_SVG_END_ */

    /**
     * Returns string represenation of a layer
     * @return {String}
     */
    toString: function () {
      return '#<fabric.Layer: (' + this.complexity() + ')>';
    },

  });

  /**
   * Returns {@link fabric.Layer} instance from an object representation
   * @static
   * @memberOf fabric.Layer
   * @param {Object} object Object to create a layer from
   * @param {Function} [callback] Callback to invoke when an layer instance is created
   */
  fabric.Layer.fromObject = function (object, callback) {
    var objects = object.objects,
        options = fabric.util.object.clone(object, true);
    delete options.objects;
    if (typeof objects === 'string') {
      // it has to be an url or something went wrong.
      fabric.loadSVGFromURL(objects, function (elements) {
        typeof objects !== 'undefined' && (options.sourcePath = objects);
        callback && callback(new fabric.Layer(elements, options));
      });
      return;
    }
    fabric.util.enlivenObjects(objects, function (enlivenedObjects) {
      fabric.util.enlivenObjects([object.clipPath], function (enlivedClipPath) {
        var options = fabric.util.object.clone(object, true);
        options.clipPath = enlivedClipPath[0];
        delete options.objects;
        callback && callback(new fabric.Layer(enlivenedObjects, options));
      });
    });
  };

})(typeof exports !== 'undefined' ? exports : this);
