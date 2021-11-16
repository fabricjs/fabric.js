(function (global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = {}),
      multiplyTransformMatrices = fabric.util.multiplyTransformMatrices,
      invertTransform = fabric.util.invertTransform,
      applyTransformToObject = fabric.util.applyTransformToObject,
      clone = fabric.util.object.clone,
      extend = fabric.util.object.extend;

  if (fabric.Layer) {
    fabric.warn('fabric.Layer is already defined');
    return;
  }

  /**
   * Layer class
   * @class fabric.Layer
   * @extends fabric.Object
   * @mixes fabric.Collection
   * @see {@link fabric.Layer#initialize} for constructor definition
   */
  fabric.Layer = fabric.util.createClass(fabric.Object, fabric.Collection, /** @lends fabric.Layer.prototype */ {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'layer',

    layout: 'auto',

    fill: '',

    /**
     * Used to optimize performance
     * set to `false` if you don't need objects to be interactive
     */
    subTargetCheck: true,

    /**
     * Used internally to optimize performance
     * Once an object is selected, instance is rendered without the selected object.
     * This way instance is cached only once for the entire interaction with the selected object.
     * @private
     */
    _activeObject: undefined,

    /**
     * Constructor
     * Guard objects' transformations from excessive mutations during initializion.
     *
     * @param {fabric.Object[]} [objects] layer objects
     * @param {Object} [options] Options object
     * @return {fabric.Layer} thisArg
     */
    initialize: function (objects, options) {
      this._objects = objects || [];
      this.__objectMonitor = this.__objectMonitor.bind(this);
      this.callSuper('initialize', options);
      this._applyLayoutStrategy({ type: 'initializion' });
      if (!this.subTargetCheck) {
        this.ownMatrixCache.initialValue = this.calcOwnMatrix();
      }
      this.forEachObject(function (object) {
        if (this.subTargetCheck) {
          object.setCoords();
          this._watchObject(true, object);
        }
        object.set('parent', this);
      }, this);
    },

    /**
     * @private
     * @param {string} key
     * @param {*} value
     */
    _set: function (key, value) {
      if (key === 'subTargetCheck' && this.ownMatrixCache) {
        //  we want to avoid setting `initialValue` during initializion
        var initialValue = this.ownMatrixCache.initialValue;
        if (value && initialValue) {
          this._applyMatrixDiffToObjects(initialValue, this.calcOwnMatrix());
          delete this.ownMatrixCache.initialValue;
        }
        else if (!value && !initialValue) {
          //  we want to prevent this logic from writing over the exisitng value before it has been applied to objects
          this.ownMatrixCache.initialValue = this.calcOwnMatrix();
        }
      }
      this.callSuper('_set', key, value);
      if (key === 'canvas') {
        this.forEachObject(function (object) {
          object._set(key, value);
        });
      }
      if (key === 'layout') {
        this._applyLayoutStrategy({ type: 'layout_change' });
      }
      if (key === 'subTargetCheck') {
        this.forEachObject(this._watchObject.bind(this, value));
      }
      return this;
    },

    /**
     * Applies the matrix diff on all objects.
     * @param {number[]} from The matrix objects are curretly relating to
     * @param {number[]} to The matrix objects should relate to
     */
    _applyMatrixDiffToObjects: function (from, to) {
      var invTransform = invertTransform(from);
      this.forEachObject(function (object) {
        var objectTransform = multiplyTransformMatrices(invTransform, object.calcTransformMatrix());
        applyTransformToObject(object, multiplyTransformMatrices(to, objectTransform));
        object.setCoords();
      });
    },

    /**
     * Compares changes made to the transform matrix and applies them to instance's objects.
     * In other words, call this method to make the current transform the starting point of a transform diff for objects.
     * @param {boolean} [disablePropagation] disable propagation of current transform diff to objects, preventing the existing transform diff from being applied to them unnecessarily.
     */
    _applyMatrixDiff: function (disablePropagation) {
      var key = this.ownMatrixCache && this.ownMatrixCache.key;
      if ((!this.prevMatrixCache || this.prevMatrixCache.key !== key) && this.subTargetCheck) {
        var transform = this.calcOwnMatrix();
        if (this.prevMatrixCache && !disablePropagation) {
          this._applyMatrixDiffToObjects(this.prevMatrixCache.cache, transform);
        }
        this.prevMatrixCache = {
          key: this.ownMatrixCache.key,
          cache: transform
        };
      }
    },

    add: function () {
      this._onBeforeObjectsChange();
      fabric.Collection.add.apply(this, arguments);
    },

    insertAt: function (object, index, nonSplicing) {
      this._onBeforeObjectsChange();
      this.callSuper('insertAt', object, index, nonSplicing);
    },

    remove: function () {
      this._onBeforeObjectsChange();
      fabric.Collection.remove.apply(this, arguments);
    },

    /**
     * @private
     */
    _onBeforeObjectsChange: function () {
      this._applyMatrixDiff();
    },

    /**
     * @private
     */
    __objectMonitor: function (opt) {
      this._applyLayoutStrategy(extend(clone(opt), {
        type: 'object_modified'
      }));
      this._set('dirty', true);
    },

    /**
     * @private
     */
    __objectSelectionMonitor: function (object, selected) {
      if (selected) {
        this._activeObject = object;
        this._set('dirty', true);
      }
      else if (this._activeObject === object) {
        this._activeObject = undefined;
        this._set('dirty', true);
      }
    },

    /**
     * @private
     * @param {boolean} watch
     * @param {fabric.Object} object
     */
    _watchObject: function (watch, object) {
      object[watch ? 'on' : 'off']('modified', this.__objectMonitor);
      object[watch ? 'on' : 'off']('selected', this.__objectSelectionMonitor.bind(this, object, true));
      object[watch ? 'on' : 'off']('deselected', this.__objectSelectionMonitor.bind(this, object, false));
    },

    /**
     * @private
     * @param {fabric.Object} object
     */
    _onObjectAdded: function (object) {
      object._set('canvas', this.canvas);
      object._set('parent', this);
      this._watchObject(true, object);
      this._applyLayoutStrategy({
        type: 'object_added',
        target: object
      });
    },

    /**
     * @private
     * @param {fabric.Object} object
     */
    _onObjectRemoved: function (object) {
      delete object.canvas;
      delete object.parent;
      this._watchObject(false, object);
      this._applyLayoutStrategy({
        type: 'object_removed',
        target: object
      });
    },

    /**
     *
     * @param {object} opt
     * @param {fabric.Object[]} opt.subTargets
     * @returns true to abort selection, a `subTarget` to select that or false to defer to default behavior and allow selection to take place
     */
    onSelect: function (opt) {
      return this.callSuper('onSelect', opt) || (opt.subTargets && opt.subTargets.length > 0 && opt.subTargets[0]);
    },

    isCacheDirty: function (skipCanvas) {
      return this.callSuper('isCacheDirty', skipCanvas)
        || this._objects.some(function (object) {
          return object.isCacheDirty(skipCanvas);
        });
    },

    /**
     * Check if instance or its parent are caching, recursively up
     * @return {Boolean}
     */
    isOnACache: function () {
      return this.ownCaching || (this.parent && this.parent.isOnACache());
    },

    /**
     * hook used to apply matrix diff on objects
     */
    setCoords: function () {
      this._applyMatrixDiff();
      this.callSuper('setCoords');
    },

    /**
     * Performance optimizations:
     *
     * **`subTargetCheck === false`**:
     * In case we don't need instance to be interactive (selectable objects etc.) we don't apply the transform diff to the objects in order to minimize the number of iterations.
     * We transform the entire ctx with the diff instead.
     * We store the initial value of the transform matrix to do so, leaving objects as they were when the initial value was stored, rather than updating them continueously.
     * This means that objects will render correctly on screen, **BUT** that's it. All geometry methods will **NOT WORK**.
     * This optimization is crucial for an instance that contains a very large amount of objects.
     * In case you need to select objects toggle `subTargetCheck` accordingly.
     *
     * **caching**:
     * Objects get updated by `_applyMatrixDiff` that is hooked to `setCoords`.
     * This means that even though objects' transform matrices change they do not trigger rendering.
     * Once an object is selected, instance is rendered without the selected object.
     * This way instance is cached only once for the entire interaction with the selected object.
     *
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render: function (ctx) {
      fabric.Rect.prototype._render.call(this, ctx);
      ctx.save();
      //  if `subTargetCheck === true` then we transform ctx back to canvas plane, objects are up to date with the latest diff
      //  else we apply the matrix diif on ctx by transforming it back by the initial matrix, while objects relate (but not relative) to the initial matrix
      var t = this.subTargetCheck ? this.calcTransformMatrix() : this.ownMatrixCache.initialValue;
      ctx.transform.apply(ctx, invertTransform(t));
      this.forEachObject(function (object) {
        //  do not render the selected object
        object !== this._activeObject && object.render(ctx);
      }, this);
      ctx.restore();
    },

    /**
     * @private
     * @param {object} context see `getLayoutStrategyResult`
     */
    _applyLayoutStrategy: function (context) {
      var result = this.getLayoutStrategyResult(this.layout, this._objects, context);
      this.set(result);
      //  refresh matrix cache and set diff point
      this.calcOwnMatrix();
      this._applyMatrixDiff(true);
      context.type !== 'initialization' && this.callSuper('setCoords');
      //  recursive up
      if (this.parent && this.parent._applyLayoutStrategy) {
        if (!context.path) {
          context.path = [];
        }
        context.path.push(this);
        this.parent._applyLayoutStrategy(context);
      }
    },

    /**
     * Override this method to customize layout
     * @public
     * @param {string} layoutDirective
     * @param {fabric.Object[]} objects
     * @param {object} context object with data regarding what triggered the call
     * @param {'initializion'|'object_modified'|'object_added'|'object_removed'|'layout_change'} context.type
     * @param {fabric.Object[]} context.path array of objects starting from the object that triggered the call to the current one
     * @returns {Object} options object
     */
    getLayoutStrategyResult: function (layoutDirective, objects, context) {  // eslint-disable-line no-unused-vars
      if (layoutDirective === 'auto') {
        return this.getObjectsBoundingBox(objects);
      }
    },

    /**
     * @public
     * @param {fabric.Object[]} objects
     * @returns
     */
    getObjectsBoundingBox: function (objects) {
      var minX = 0, minY = 0, maxX = 0, maxY = 0;
      for (var i = 0, o; i < objects.length; ++i) {
        o = objects[i];
        var box = o.getBoundingRect(true, true);
        if (i === 0) {
          minX = Math.min(box.left, box.left + box.width);
          maxX = Math.max(box.left, box.left + box.width);
          minY = Math.min(box.top, box.top + box.height);
          maxY = Math.max(box.top, box.top + box.height);
        }
        else {
          minX = Math.min(minX, box.left, box.left + box.width);
          maxX = Math.max(maxX, box.left, box.left + box.width);
          minY = Math.min(minY, box.top, box.top + box.height);
          maxY = Math.max(maxY, box.top, box.top + box.height);
        }
      }
      return {
        left: minX,
        top: minY,
        width: (maxX - minX) / (this.scaleX || 1),
        height: (maxY - minY) / (this.scaleY || 1),
        originX: 'left',
        originY: 'top'
      };
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

    toString: function () {
      return '#<fabric.Layer: (' + this.complexity() + ')>';
    },

    dispose: function () {
      this.forEachObject(function (object) {
        object.dispose && object.dispose();
      });
    },

    /* _TO_SVG_START_ */
    /**
     * Returns svg representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    _toSVG: function (reviver) {
      var svgString = ['<g ', 'COMMON_PARTS', ' >\n'];
      svgString.push(new fabric.Rect(this.toObject()).toSVG());
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
     * @override instance's transformations are excessive
     * @param {boolean} full
     * @param {string} additionalTransform
     * @returns
     */
    getSvgTransform: function (full, additionalTransform) {
      var svgTransform = 'transform="' + fabric.util.matrixToSVG(fabric.iMatrix);
      return svgTransform +
        (additionalTransform || '') + '" ';
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
  });

  /**
   * Returns fabric.Layer instance from an object representation
   * @static
   * @memberOf fabric.Layer
   * @param {Object} object Object to create an instance from
   * @param {function} [callback] invoked with new instance as first argument
   */
  fabric.Layer.fromObject = function (object, callback) {
    var objects = object.objects,
        options = clone(object, true);
    delete options.objects;
    if (typeof objects === 'string') {
      // it has to be a url or something went wrong.
      fabric.loadSVGFromURL(objects, function (elements) {
        var group = fabric.util.groupSVGElements(elements, object, objects);
        group.set(options);
        group._restoreObjectsState();
        callback && callback(new fabric.Layer(group._objects, options));
      });
      return;
    }
    fabric.util.enlivenObjects(objects, function (enlivenedObjects) {
      fabric.util.enlivenObjects([object.clipPath], function (enlivedClipPath) {
        var options = clone(object, true);
        options.clipPath = enlivedClipPath[0];
        delete options.objects;
        callback && callback(new fabric.Layer(enlivenedObjects, options));
      });
    });
  };

})(typeof exports !== 'undefined' ? exports : this);
