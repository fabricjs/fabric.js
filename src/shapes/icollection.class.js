(function (global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = {}),
      multiplyTransformMatrices = fabric.util.multiplyTransformMatrices,
      invertTransform = fabric.util.invertTransform,
      applyTransformToObject = fabric.util.applyTransformToObject,
      clone = fabric.util.object.clone,
      extend = fabric.util.object.extend;

  if (fabric.ICollection) {
    fabric.warn('fabric.ICollection is already defined');
    return;
  }

  /**
   * ICollection class
   * @class fabric.ICollection
   * @extends fabric.Object
   * @mixes fabric.Collection
   * @fires added on added object before layout
   * @fires removed on removed object before layout
   * @see {@link fabric.ICollection#initialize} for constructor definition
   */
  fabric.ICollection = fabric.util.createClass(fabric.Object, fabric.Collection, /** @lends fabric.ICollection.prototype */ {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'i-collection',

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
     * @param {fabric.Object[]} [objects] instance objects
     * @param {Object} [options] Options object
     * @return {fabric.ICollection} thisArg
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
     * @private
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
     * Use the matrix diff to keep clip path in place after resizing instance by applying the inverted diff to it
     * @private
     */
    _applyMatrixDiffToClipPath: function () {
      var clipPath = this.clipPath;
      if (clipPath && !clipPath.absolutePositioned && this.prevMatrixCache && this.ownMatrixCache.key !== this.prevMatrixCache.key) {
        var from = this.prevMatrixCache.cache, to = this.calcOwnMatrix();
        var transformDiff = multiplyTransformMatrices(invertTransform(to), from);
        applyTransformToObject(clipPath, multiplyTransformMatrices(transformDiff, clipPath.calcTransformMatrix()));
      }
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

    /**
     * @private
     */
    _onBeforeObjectsChange: function () {
      this._applyMatrixDiff();
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
     * invalidates layout on object modified
     * @private
     */
    __objectMonitor: function (opt) {
      this._applyLayoutStrategy(extend(clone(opt), {
        type: 'object_modified'
      }));
      this._set('dirty', true);
    },

    /**
     * keeps track of the selected object
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
      object._set('parent', this);
      object._set('canvas', this.canvas);
      this._watchObject(true, object);
      object.fire('added', { target: this });
      this._applyLayoutStrategy({
        type: 'object_added',
        target: object
      });
      this._set('dirty', true);
    },

    /**
     * @private
     * @param {fabric.Object} object
     */
    _onObjectRemoved: function (object) {
      delete object.canvas;
      delete object.parent;
      this._watchObject(false, object);
      object.fire('removed', { target: this });
      this._applyLayoutStrategy({
        type: 'object_removed',
        target: object
      });
      if (this._activeObject === object) {
        this._activeObject = undefined;
      }
      this._set('dirty', true);
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
      if (this.callSuper('isCacheDirty', skipCanvas)) {
        return true;
      }
      if (!this.statefullCache) {
        return false;
      }
      return this._objects.some(function (object) {
        return object.isCacheDirty(true);
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
      //  refresh matrix cache
      this.calcOwnMatrix();
      //  keep clip path in place
      this._applyMatrixDiffToClipPath();
      //  set diff point without changing objects matrices
      this._applyMatrixDiff(true);
      //  make sure coords are up to date
      context.type !== 'initialization' && this.callSuper('setCoords');
      //  recursive up
      if (this.parent && this.parent._applyLayoutStrategy) {
        //  append the path recursion to context
        if (!context.path) {
          context.path = [];
        }
        context.path.push(this);
        //  all parents should invalidate their layout
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
     * @todo support instance rotation
     * @public
     * @param {fabric.Object[]} objects
     * @returns
     */
    getObjectsBoundingBox: function (objects) {
      var coords = [];
      for (var i = 0, o; i < objects.length; ++i) {
        o = objects[i];
        coords.push.apply(coords, o.getCoords(true, true));
      }
      var bounds = coords.reduce(function (acc, point) {
        return {
          min: {
            x: Math.min(acc.min.x, point.x),
            y: Math.min(acc.min.y, point.y)
          },
          max: {
            x: Math.max(acc.max.x, point.x),
            y: Math.max(acc.max.y, point.y)
          }
        }
      }, { min: coords[0], max: coords[0] });
      var center = new fabric.Point(bounds.min.x, bounds.min.y).midPointFrom(bounds.max),
        width = (bounds.max.x - bounds.min.x) / (this.scaleX || 1),
        height = (bounds.max.y - bounds.min.y) / (this.scaleY || 1),
        rad = fabric.util.degreesToRadians(this.angle || 0),
        cos = Math.abs(Math.cos(rad)),
        sin = Math.abs(Math.sin(rad));
      return {
        left: center.x,
        top: center.y,
        width: width * cos + height * sin,
        height: width * sin + height * cos,
        originX: 'center',
        originY: 'center'
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
      return '#<fabric.ICollection: (' + this.complexity() + ')>';
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
     * Returns styles-string for svg-export, specific version for ICollection
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
   * Returns fabric.ICollection instance from an object representation
   * @static
   * @memberOf fabric.ICollection
   * @param {Object} object Object to create an instance from
   * @param {function} [callback] invoked with new instance as first argument
   */
  fabric.ICollection.fromObject = function (object, callback) {
    var objects = object.objects,
        options = clone(object, true);
    delete options.objects;
    if (typeof objects === 'string') {
      // it has to be a url or something went wrong.
      fabric.loadSVGFromURL(objects, function (elements) {
        var group = fabric.util.groupSVGElements(elements, object, objects);
        group.set(options);
        group._restoreObjectsState();
        callback && callback(new fabric.ICollection(group._objects, options));
      });
      return;
    }
    fabric.util.enlivenObjects(objects, function (enlivenedObjects) {
      fabric.util.enlivenObjects([object.clipPath], function (enlivedClipPath) {
        var options = clone(object, true);
        options.clipPath = enlivedClipPath[0];
        delete options.objects;
        callback && callback(new fabric.ICollection(enlivenedObjects, options));
      });
    });
  };

})(typeof exports !== 'undefined' ? exports : this);
