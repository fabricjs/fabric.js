(function (global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = {}),
      multiplyTransformMatrices = fabric.util.multiplyTransformMatrices,
      invertTransform = fabric.util.invertTransform,
      applyTransformToObject = fabric.util.applyTransformToObject,
      clone = fabric.util.object.clone,
      extend = fabric.util.object.extend;

  if (fabric.Group) {
    fabric.warn('fabric.Group is already defined');
    return;
  }

  /**
   * Group class
   * @class fabric.Group
   * @extends fabric.Object
   * @mixes fabric.Collection
   * @fires added on added object before layout
   * @fires removed on removed object before layout
   * @see {@link fabric.Group#initialize} for constructor definition
   */
  fabric.Group = fabric.util.createClass(fabric.Object, fabric.Collection,
    /** @lends fabric.Group.prototype */
    {

      /**
       * Type of an object
       * @type string
       * @default
       */
      type: 'group',

      /**
       * Specifies the **layout strategy** for instance
       * Used by `getLayoutStrategyResult` to calculate layout
       * `fit-content`, `fixed`, `clip-path` are supported out of the box
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
       * Used internally to optimize performance
       * Once an object is selected, instance is rendered without the selected object.
       * This way instance is cached only once for the entire interaction with the selected object.
       * @private
       */
      _activeObjects: undefined,

      /**
       * Constructor
       * Guard objects' transformations from excessive mutations during initialization.
       *
       * @param {fabric.Object[]} [objects] instance objects
       * @param {Object} [options] Options object
       * @param {boolean} [objectsRelativeToGroup] true if objects exist in group coordinate plane
       * @return {fabric.Group} thisArg
       */
      initialize: function (objects, options, objectsRelativeToGroup) {
        this._objects = objects || [];
        this._activeObjects = [];
        this.__objectMonitor = this.__objectMonitor.bind(this);
        this.__objectSelectionTracker = this.__objectSelectionMonitor.bind(this, true);
        this.__objectSelectionDisposer = this.__objectSelectionMonitor.bind(this, false);
        this.callSuper('initialize', options);
        this.forEachObject(function (object) {
          this.enterGroup(object, objectsRelativeToGroup);
        }, this);
        var center = options && (typeof options.left !== 'undefined' || typeof options.top !== 'undefined') ?
          this.translateToCenterPoint(
            new fabric.Point(this.left || 0, this.top || 0),
            typeof options.originX !== 'undefined' ? options.originX : this.originX,
            typeof options.originY !== 'undefined' ? options.originY : this.originY
          ) :
          undefined;
        this._applyLayoutStrategy({ type: 'initialization', options: options, center: center });
      },

      /**
       * @private
       * @param {string} key
       * @param {*} value
       */
      _set: function (key, value) {
        var prev = this[key];
        this.callSuper('_set', key, value);
        if (key === 'canvas') {
          this.forEachObject(function (object) {
            object._set(key, value);
          });
        }
        if (key === 'layout' && prev !== this[key]) {
          this._applyLayoutStrategy({ type: 'layout_change', value: value, prevValue: prev });
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

      add: function () {
        this.onBeforeObjectsChange();
        fabric.Collection.add.apply(this, arguments);
        this._onAfterObjectsChange('added', arguments);
      },

      insertAt: function () {
        this.onBeforeObjectsChange();
        fabric.Collection.insertAt.apply(this, arguments);
        this._onAfterObjectsChange('added', arguments);
      },

      remove: function () {
        this.onBeforeObjectsChange();
        fabric.Collection.remove.apply(this, arguments);
        this._onAfterObjectsChange('removed', arguments);
      },

      removeAll: function () {
        this._activeObjects = [];
        var remove = this._objects.slice();
        this.remove.apply(this, this._objects);
        return remove;
      },

      /**
       * backward compatibility
       * @deprecated
       */
      addWithUpdate: function () {
        this.add.apply(this, arguments);
      },

      /**
       * backward compatibility
       * @deprecated
       */
      removeWithUpdate: function () {
        this.remove.apply(this, arguments);
      },

      /**
       * @private
       * @param {'added'|'removed'} type
       * @param {fabric.Object[]} targets
       */
      _onAfterObjectsChange: function (type, targets) {
        this._applyLayoutStrategy({
          type: type,
          targets: targets
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
        //  make sure we listen only once
        watch && this._watchObject(false, object);
        object[directive]('modified', this.__objectMonitor);
        object[directive]('selected', this.__objectSelectionTracker);
        object[directive]('deselected', this.__objectSelectionDisposer);
      },

      /**
       * @private
       * @param {fabric.Object} object
       * @param {boolean} [relativeToGroup] true if object is in group's coordinate plane
       */
      enterGroup: function (object, relativeToGroup) {
        object.group && object.group.remove(object);
        !relativeToGroup && applyTransformToObject(
          object,
          multiplyTransformMatrices(
            invertTransform(this.calcTransformMatrix()),
            object.calcTransformMatrix()
          )
        );
        object.setCoords();
        object._set('group', this);
        object._set('canvas', this.canvas);
        this.subTargetCheck && this._watchObject(true, object);
        var activeObject = this.canvas && this.canvas.getActiveObject && this.canvas.getActiveObject();
        if (activeObject && (activeObject === object || object.isDescendantOf(activeObject))) {
          this._activeObjects.push(object);
        }
      },

      /**
       * @private
       * @param {fabric.Object} object
       * @param {boolean} [removeParentTransform] true if object should exit group without applying group's transform to it
       */
      exitGroup: function (object, removeParentTransform) {
        delete object.canvas;
        delete object.group;
        if (!removeParentTransform) {
          applyTransformToObject(
            object,
            multiplyTransformMatrices(
              this.calcTransformMatrix(),
              object.calcTransformMatrix()
            )
          );
          object.setCoords();
        }
        this._watchObject(false, object);
        var index = this._activeObjects.length > 0 ? this._activeObjects.indexOf(object) : -1;
        if (index > -1) {
          this._activeObjects.splice(index, 1);
        }
      },

      /**
       * override this method if necessary
       */
      onBeforeObjectsChange: function () {

      },

      /**
       * @private
       * @param {fabric.Object} object
       */
      _onObjectAdded: function (object) {
        this.enterGroup(object);
        object.fire('added', { target: this });
      },

      /**
       * @private
       * @param {fabric.Object} object
       */
      _onObjectRemoved: function (object) {
        this.exitGroup(object);
        object.fire('removed', { target: this });
      },

      /**
       * Check if instance or its group are caching, recursively up
       * @return {Boolean}
       */
      isOnACache: function () {
        return this.ownCaching || (!!this.group && this.group.isOnACache());
      },

      /**
       * @override
       * @param {boolean} [skipCanvas]
       * @returns {boolean}
       */
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

      setCoords: function () {
        this.callSuper('setCoords');
        this.subTargetCheck && this.forEachObject(function (object) {
          object.setCoords();
        });
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
       *
       * @private
       * @param {CanvasRenderingContext2D} ctx Context to render on
       */
      _render: function (ctx) {
        this.forEachObject(function (object) {
          object.render(ctx);
        });
      },

      /**
       * render only non-selected objects,
       * canvas is in charge of rendering the selected objects
       * @private
       * @param {CanvasRenderingContext2D} ctx Context to render on
       * @deprecated
       */
      _renderObjects: function (ctx) {
        this.forEachObject(function (object) {
          if (this._activeObjects.length === 0 || this._activeObjects.indexOf(object) === -1) {
            object.render(ctx);
          }
        }, this);
      },

      /**
       * @public
       * @param {string} [layoutDirective]
       */
      triggerLayout: function (layoutDirective) {
        if (layoutDirective) {
          this.set('layout', layoutDirective);
        }
        else {
          this._applyLayoutStrategy({ type: 'imperative' });
        }
      },

      /**
       * @private
       * @param {fabric.Object} object 
       * @param {fabric.Point} diff 
       */
      _adjustObjectPosition: function (object, diff) {
        object.set({
          left: object.left + diff.x,
          top: object.top + diff.y,
        });
        object.setCoords();
      },

      /**
       * @private
       * @param {object} context see `getLayoutStrategyResult`
       */
      _applyLayoutStrategy: function (context) {
        var transform = this.calcTransformMatrix();
        var center = this.getCenterPoint();
        var result = this.getLayoutStrategyResult(this.layout, this._objects, context);
        if (!result) {
          return;
        }
        this.set({ width: result.width, height: result.height });
        //  handle positioning
        var newCenter = new fabric.Point(result.centerX, result.centerY);
        var diff = fabric.util.transformPoint(
          center.subtract(newCenter),
          fabric.util.invertTransform(transform),
          true
        );
        //  adjust objects to account for new center
        this.forEachObject(function (object) {
          this._adjustObjectPosition(object, diff);
        }, this);
        //  clip path as well
        context.type !== 'initialization' && this.clipPath && !this.clipPath.absolutePositioned
          && this._adjustObjectPosition(this.clipPath, diff);
        //  set position
        this.setPositionByOrigin(newCenter, 'center', 'center');
        context.type !== 'initialization' && this.callSuper('setCoords');
        //  fire layout hook
        this.onLayout(context, result);
        //  recursive up
        if (this.group && this.group._applyLayoutStrategy) {
          //  append the path recursion to context
          if (!context.path) {
            context.path = [];
          }
          context.path.push(this);
          //  all parents should invalidate their layout
          this.group._applyLayoutStrategy(context);
        }
      },

      /**
       * Override this method to customize layout.
       * If you need to run logic once layout completes use `onLayout`
       * @public
       * @param {string} layoutDirective
       * @param {fabric.Object[]} objects
       * @param {object} context object with data regarding what triggered the call
       * @param {'initialization'|'object_modified'|'added'|'removed'|'layout_change'|'imperative'} context.type
       * @param {fabric.Object[]} context.path array of objects starting from the object that triggered the call to the current one
       * @returns {{ centerX: number, centerY: number, width: number, height: number }} positioning data
       */
      getLayoutStrategyResult: function (layoutDirective, objects, context) {  // eslint-disable-line no-unused-vars
        var bbox = this.getObjectsBoundingBox(objects);
        if (layoutDirective === 'fit-content') {
          return bbox;
        }
        else if (layoutDirective === 'fixed' && context.type === 'initialization') {
          if (context.center) {
            bbox.centerX = context.center.x;
            bbox.centerY = context.center.y;
          }
          return bbox;
        }
        else if (layoutDirective === 'clip-path' && this.clipPath) {
          var clipPath = this.clipPath;
          var clipPathCenter = clipPath.getCenterPoint();
          if (clipPath.absolutePositioned && context.type === 'initialization') {
            return {
              centerX: clipPathCenter.x,
              centerY: clipPathCenter.y,
              width: clipPath.width,
              height: clipPath.height,
            };
          }
          else if (!clipPath.absolutePositioned && context.type === 'initialization') {
            if (context.center) {
              bbox.centerX = context.center.x;
              bbox.centerY = context.center.y;
            }
            bbox.width = clipPath.width;
            bbox.height = clipPath.height;
            return bbox;
          }
          else if (!clipPath.absolutePositioned) {
            var center = this.getCenterPoint();
            return {
              centerX: center.x + clipPathCenter.x,
              centerY: center.y + clipPathCenter.y,
              width: clipPath.width,
              height: clipPath.height,
            };
          }
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

        var width = bounds.max.x - bounds.min.x,
            height = bounds.max.y - bounds.min.y,
            center = new fabric.Point(bounds.min.x, bounds.min.y).midPointFrom(bounds.max),
            rad = fabric.util.degreesToRadians(this.angle || 0),
            cos = Math.abs(Math.cos(rad)),
            sin = Math.abs(Math.sin(rad));

        return {
          left: bounds.min.x,
          top: bounds.min.y,
          right: bounds.max.x,
          bottom: bounds.max.y,
          x: bounds.min.x,
          y: bounds.min.y,
          centerX: center.x,
          centerY: center.y,
          width: width * cos + height * sin,
          height: width * sin + height * cos,
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
        var obj = this.callSuper('toObject', ['layout'].concat(propertiesToInclude));
        obj.objects = this.__serializeObjects('toObject', propertiesToInclude);
        return obj;
      },

      toString: function () {
        return '#<fabric.Group: (' + this.complexity() + ')>';
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
    });

  /**
   * @todo support loading from svg
   * @private
   * @static
   * @memberOf fabric.Group
   * @param {Object} object Object to create an instance from
   * @param {(objects: fabric.Object[], options?: Object) => any} [callback]
   */
  fabric.Group._fromObject = function (object, callback) {
    var objects = object.objects,
        options = clone(object, true);
    delete options.objects;
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
   * Returns fabric.Group instance from an object representation
   * @static
   * @memberOf fabric.Group
   * @param {Object} object Object to create an instance from
   * @param {function} [callback] invoked with new instance as first argument
   */
  fabric.Group.fromObject = function (object, callback) {
    callback && fabric.Group._fromObject(object, function (objects, options) {
      callback(new fabric.Group(objects, options, true));
    });
  };

})(typeof exports !== 'undefined' ? exports : this);
