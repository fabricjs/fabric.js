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
      this._objects = objects;
      this.forEachObject(function (object) {
        object.layer = this;
      }, this);
      this._applyLayoutStrategy();
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
        var pre = fabric.util.invertTransform(_this._originalTransform),
          post = _this.calcTransformMatrix(),
          transform = fabric.util.multiplyTransformMatrices(post, pre);
        this.forEachObject(function (object) {
          fabric.util.addTransformToObject(object, transform);
        });
      });
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
        width: (maxXY.x - minXY.x) || 0,
        height: (maxXY.y - minXY.y) || 0
      };
    },

    /**
     * @private
     */
    _applyBoundingRect: function () {
      const rect = this.getBoundingRect(true);
      this.set({ width: rect.width, height: rect.height });
      this.setPositionByOrigin({ x: rect.left, y: rect.top }, 'left', 'top');
    },

    /**
     * @private
     */
    _applyLayoutStrategy: function () {
      this.layoutStrategy === 'wrap-content' && this._applyBoundingRect();
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
      const m = fabric.util.invertTransform(this.calcTransformMatrix());
      ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
      for (var i = 0, len = this._objects.length; i < len; i++) {
        this._objects[i].render(ctx);
      }
      this.transform(ctx);
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

    /**
     * make a layer an active selection, remove the layer from canvas
     * the layer has to be on canvas for this to work.
     * @return {fabric.ActiveSelection} thisArg
     * @chainable
     */
    toActiveSelection: function () {
      if (!this.canvas) {
        return;
      }
      var objects = this._objects, canvas = this.canvas;
      this._objects = [];
      var options = this.toObject();
      delete options.objects;
      var activeSelection = new fabric.ActiveSelection([]);
      activeSelection.set(options);
      activeSelection.type = 'activeSelection';
      canvas.remove(this);
      objects.forEach(function (object) {
        object.layer = activeSelection;
        object.dirty = true;
        canvas.add(object);
      });
      activeSelection.canvas = canvas;
      activeSelection._objects = objects;
      canvas._activeObject = activeSelection;
      activeSelection.setCoords();
      return activeSelection;
    },

    /* _TO_SVG_START_ */
    /**
     * Returns transform-string for svg-export
     * @param {Boolean} use the full transform or the single object one.
     * @return {String}
     */
    getSvgTransform: function (full, additionalTransform) {
      var transform = fabric.util.invertTransform(full ? this.calcTransformMatrix() : this.calcOwnMatrix()),
        svgTransform = 'transform="' + fabric.util.matrixToSVG(transform);
      return svgTransform +
        (additionalTransform || '') + '" ';
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
        var layer = fabric.util.groupSVGElements(elements, object, objects);
        layer.set(options);
        callback && callback(layer);
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
