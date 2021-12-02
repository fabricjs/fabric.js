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
  fabric.ICollection = fabric.util.createClass(fabric.Object, fabric.Collection,
    /** @lends fabric.ICollection.prototype */
    {

      /**
       * Type of an object
       * @type string
       * @default
       */
      type: 'iCollection',

      /**
       * Specifies the **layout strategy** for instance
       * Used by `getLayoutStrategyResult` to calculate layout
       * @type string
       * @default
       */
      layout: 'fit-content',

      /**
       * List of properties to consider when checking if state
       * of an object is changed (fabric.Object#hasStateChanged)
       * as well as for history (undo/redo) purposes
       * @type string[]
       */
      stateProperties: fabric.Object.prototype.stateProperties.concat('layout'),

      /**
       * @default
       * @override
       */
      fill: '',

      /**
       * @default
       * @override
       */
      strokeWidth: 0,

      /**
       * Used to optimize performance
       * set to `false` if you don't need objects to be interactive
       * @default
       * @type boolean
       */
      subTargetCheck: true,

      /**
       * @override
       * @default
       */
      erasable: 'deep',

      /**
       * Used internally to optimize performance
       * Once an object is selected, instance is rendered without the selected object.
       * This way instance is cached only once for the entire interaction with the selected object.
       * @private
       */
      _activeObjects: undefined,

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
        this._activeObjects = [];
        this.__objectMonitor = this.__objectMonitor.bind(this);
        this.__objectSelectionTracker = this.__objectSelectionMonitor.bind(this, true);
        this.__objectSelectionDisposer = this.__objectSelectionMonitor.bind(this, false);
        this.callSuper('initialize', options);
        this._applyLayoutStrategy({ type: 'initializion', options: options });
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
        if (clipPath && !clipPath.absolutePositioned
          && this.prevMatrixCache && this.ownMatrixCache.key !== this.prevMatrixCache.key) {
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
        this._onAfterObjectsChange('added', arguments);
        return this;
      },

      insertAt: function () {
        this._onBeforeObjectsChange();
        fabric.Collection.insertAt.apply(this, arguments);
        this._onAfterObjectsChange('added', arguments);
        return this;
      },

      remove: function () {
        this._onBeforeObjectsChange();
        fabric.Collection.remove.apply(this, arguments);
        this._onAfterObjectsChange('removed', arguments);
        return this;
      },

      removeAll: function () {
        this._activeObjects = [];
        return this.remove.apply(this, this._objects);
      },

      /**
       * @private
       * @param {'added'|'removed'} type
       */
      _onAfterObjectsChange: function (type) {
        this._applyLayoutStrategy({
          type: type,
          targets: arguments
        });
        this._set('dirty', true);
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
       * keeps track of the selected objects
       * @private
       */
      __objectSelectionMonitor: function (selected, opt) {
        var object = opt.target;
        if (selected) {
          this._activeObjects.push(object);
          this._set('dirty', true);
        }
        else if (this._activeObjects.length > 0) {
          var index = this._activeObjects.indexOf(object);
          if (index > -1) {
            this._activeObjects.splice(index, 1);
            this._set('dirty', true);
          }
        }
      },

      /**
       * @private
       * @param {boolean} watch
       * @param {fabric.Object} object
       */
      _watchObject: function (watch, object) {
        var directive = watch ? 'on' : 'off';
        object[directive]('modified', this.__objectMonitor);
        object[directive]('selected', this.__objectSelectionTracker);
        object[directive]('deselected', this.__objectSelectionDisposer);
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
        var activeObject = this.canvas && this.canvas.getActiveObject && this.canvas.getActiveObject();
        if (activeObject && (activeObject === object || object.isDescendantOf(activeObject))) {
          this._activeObjects.push(true);
        }
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
        var index = this._activeObjects.length > 0 ? this._activeObjects.indexOf(object) : -1;
        if (index > -1) {
          this._activeObjects.splice(index, 1);
        }
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

      /**
       * Check if instance or its parent are caching, recursively up
       * @return {Boolean}
       */
      isOnACache: function () {
        return this.ownCaching || (!!this.parent && this.parent.isOnACache());
      },

      /**
       * hook used to apply matrix diff on objects
       * @override
       * @param {boolean} [skipCanvas]
       * @returns {boolean}
       */
      isCacheDirty: function (skipCanvas) {
        //  apply matrix diff before deciding if cache isn't dirty
        this._applyMatrixDiff();
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
       * hook used to apply matrix diff on objects
       */
      setCoords: function () {
        this._applyMatrixDiff();
        this.callSuper('setCoords');
      },

      /**
       * Renders instance on a given context
       * @param {CanvasRenderingContext2D} ctx context to render instance on
       */
      render: function (ctx) {
        //  used to inform objects not to double opacity
        this._transformDone = true;
        this.callSuper('render', ctx);
        this._transformDone = false;
      },

      /**
       * If `subTargetCheck === true` we transform `ctx` back to canvas plane, objects are up to date with the latest diff
       * otherwise we transform ctx back to canvas plane by applying the initial matrix, objects relating accordingly
       *
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
       * **caching and selection**:
       * Once an object is selected, instance is rendered without the selected object.
       * This way instance is cached only once for the entire interaction with the selected object.
       *
       * @private
       * @param {CanvasRenderingContext2D} ctx Context to render on
       */
      _render: function (ctx) {
        ctx.save();
        var t = this.subTargetCheck ? this.calcTransformMatrix() : this.ownMatrixCache.initialValue;
        ctx.transform.apply(ctx, invertTransform(t));
        this._renderObjects(ctx);
        ctx.restore();
      },

      /**
       * **Performance optimization**:
       * render only non-selected objects,
       * canvas is in charge of rendering the selected objects
       * @private
       * @param {CanvasRenderingContext2D} ctx Context to render on
       */
      _renderObjects: function (ctx) {
        this.forEachObject(function (object) {
          if (this._activeObjects.length === 0 || this._activeObjects.indexOf(object) === -1) {
            object.render(ctx);
          }
        }, this);
      },

      /**
       * @private
       * @param {object} context see `getLayoutStrategyResult`
       */
      _applyLayoutStrategy: function (context) {
        var result = this.getLayoutStrategyResult(this.layout, this._objects, context);
        if (!result) {
          return;
        }
        this.set({ width: result.width, height: result.height });
        this.setPositionByOrigin(new fabric.Point(result.x, result.y), result.originX, result.originY);
        //  refresh matrix cache
        this.calcOwnMatrix();
        //  keep clip path in place
        this._applyMatrixDiffToClipPath();
        //  set diff point without changing objects matrices
        this._applyMatrixDiff(true);
        //  make sure coords are up to date
        context.type !== 'initialization' && this.callSuper('setCoords');
        //  fire layout hook
        this.onLayout(context, result);
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
       * Override this method to customize layout.
       * If you need to run logic once layout completes use `onLayout`
       * @public
       * @param {string} layoutDirective
       * @param {fabric.Object[]} objects
       * @param {object} context object with data regarding what triggered the call
       * @param {'initializion'|'object_modified'|'added'|'removed'|'layout_change'} context.type
       * @param {fabric.Object[]} context.path array of objects starting from the object that triggered the call to the current one
       * @returns {Object} options object
       */
      getLayoutStrategyResult: function (layoutDirective, objects, context) {  // eslint-disable-line no-unused-vars
        if (layoutDirective === 'fit-content') {
          return this.getObjectsBoundingBox(objects);
        }
        else if (layoutDirective === 'fixed' && context.type === 'initializion') {
          var bbox = this.getObjectsBoundingBox(objects),
              hasX = typeof context.options.left === 'number',
              hasY = typeof context.options.top === 'number';
          return {
            x: hasX ? this.left : bbox.left,
            y: hasY ? this.top : bbox.top,
            width: this.width || bbox.width,
            height: this.height || bbox.height,
            originX: hasX ? this.originX : 'center',
            originY: hasY ? this.originY : 'center'
          };
        }
      },

      /**
       * Hook that is called once layout has completed.
       * Provided for layout customization, override if necessary.
       * Complements `getLayoutStrategyResult`, which is called at the beginning of layout.
       * @public
       * @param {*} context layout context
       * @param {Object} result layout result
       */
      onLayout: function () {
        //  override by subclass
      },

      /**
       * @todo support instance rotation
       * @public
       * @param {fabric.Object[]} objects
       * @returns
       */
      getObjectsBoundingBox: function (objects) {
        if (objects.length === 0) {
          return {};
        }
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
          };
        }, { min: coords[0], max: coords[0] });
        var center = new fabric.Point(bounds.min.x, bounds.min.y).midPointFrom(bounds.max),
            width = (bounds.max.x - bounds.min.x) / (this.scaleX || 1),
            height = (bounds.max.y - bounds.min.y) / (this.scaleY || 1),
            rad = fabric.util.degreesToRadians(this.angle || 0),
            cos = Math.abs(Math.cos(rad)),
            sin = Math.abs(Math.sin(rad));
        return {
          x: center.x,
          y: center.y,
          width: width * cos + height * sin,
          height: width * sin + height * cos,
          originX: 'center',
          originY: 'center'
        };
      },

      /**
       *
       * @private
       * @param {'toObject'|'toDatalessObject'} [method]
       * @param {string[]} [propertiesToInclude] Any properties that you might want to additionally include in the output
       * @returns {Object[]} serialized objects
       */
      __serializeObjects: function (method, propertiesToInclude) {
        var _includeDefaultValues = this.includeDefaultValues;
        return this._objects
          .filter(function (obj) {
            return !obj.excludeFromExport;
          })
          .map(function (obj) {
            var originalDefaults = obj.includeDefaultValues;
            obj.includeDefaultValues = _includeDefaultValues;
            var data = obj[method || 'toObject'](propertiesToInclude);
            obj.includeDefaultValues = originalDefaults;
            delete data.version;
            return data;
          });
      },

      /**
       * Returns object representation of an instance
       * @param {string[]} [propertiesToInclude] Any properties that you might want to additionally include in the output
       * @return {Object} object representation of an instance
       */
      toObject: function (propertiesToInclude) {
        var obj = fabric.Object.prototype.toObject.call(this, ['layout'].concat(propertiesToInclude));
        obj.objects = this.__serializeObjects('toObject', propertiesToInclude);
        return obj;
      },

      /**
       * Returns object representation of an instance, in dataless mode.
       * @param {string[]} [propertiesToInclude] Any properties that you might want to additionally include in the output
       * @return {Object} object representation of an instance
       */
      toDatalessObject: function (propertiesToInclude) {
        var obj = fabric.Object.prototype.toDatalessObject.call(this, ['layout'].propertiesToInclude);
        obj.objects = this.sourcePath || this.__serializeObjects('toDatalessObject', propertiesToInclude);
        return obj;
      },

      toString: function () {
        return '#<fabric.ICollection: (' + this.complexity() + ')>';
      },

      dispose: function () {
        this._activeObjects = [];
        this.forEachObject(function (object) {
          this._watchObject(false, object);
          object.dispose && object.dispose();
        }, this);
      },

      /* _TO_SVG_START_ */

      /**
       * Returns id attribute for svg output
       * @return {String}
       */
      getSvgCommons: function () {
        if (this.layout !== fabric.util.getKlass(this.type).prototype.layout) {
          var layout = 'fabric-layout="' + this.layout + '"';
          return this.callSuper('getSvgCommons') + ' ' + layout;
        }
        return this.callSuper('getSvgCommons');
      },

      /**
       * Returns svg representation of an instance
       * @param {Function} [reviver] Method for further parsing of svg representation.
       * @return {String} svg representation of an instance
       */
      _toSVG: function (reviver) {
        var svgString = ['<g ', 'COMMON_PARTS', ' >\n'];
        //  in case there's an unapplied matrix diff (`subTargetCheck = false`) we need to use `ownMatrixCache.initialValue`
        var t = invertTransform(this.ownMatrixCache.initialValue || this.calcTransformMatrix());
        svgString.push('<g ', 'transform="', fabric.util.matrixToSVG(t), '">\n');
        for (var i = 0, len = this._objects.length; i < len; i++) {
          svgString.push('\t\t', this._objects[i].toSVG(reviver));
        }
        svgString.push('</g>\n', '</g>\n');
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
    });

  /* _FROM_SVG_START_ */
  /**
   * List of attribute names to account for when parsing SVG element (used by {@link fabric.ICollection.fromElement})
   * @static
   * @memberOf fabric.ICollection
   */
  fabric.ICollection.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat('fabric-layout');
  /* _FROM_SVG_END_ */

  /**
   * @todo support loading from svg
   * @private
   * @static
   * @memberOf fabric.ICollection
   * @param {Object} object Object to create an instance from
   * @param {(objects: fabric.Object[], options?: Object) => any} [callback]
   */
  fabric.ICollection._fromObject = function (object, callback) {
    var objects = object.objects,
        options = clone(object, true);
    delete options.objects;
    if (typeof objects === 'string') {
      // it has to be a url or something went wrong.
      fabric.loadSVGFromURL(objects, function (elements) {
        options = fabric.util.getOptionsFromSVG(elements, object, objects);
        callback && callback(elements, options);
      });
      return;
    }
    fabric.util.enlivenObjects(objects, function (enlivenedObjects) {
      fabric.util.enlivenObjects([object.clipPath], function (enlivedClipPath) {
        var options = clone(object, true);
        options.clipPath = enlivedClipPath[0];
        delete options.objects;
        callback && callback(enlivenedObjects, options);
      });
    });
  };

  /**
   * Returns fabric.ICollection instance from an object representation
   * @static
   * @memberOf fabric.ICollection
   * @param {Object} object Object to create an instance from
   * @param {function} [callback] invoked with new instance as first argument
   */
  fabric.ICollection.fromObject = function (object, callback) {
    callback && fabric.ICollection._fromObject(object, function (objects, options) {
      callback(new fabric.ICollection(objects, options));
    });
  };

})(typeof exports !== 'undefined' ? exports : this);
