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
   * @fires layout once layout completes
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
       * `fit-content`, `fit-content-lazy`, `fixed`, `clip-path` are supported out of the box
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
      fill: 'rgb(0,0,0)',

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
        this._applyLayoutStrategy({
          type: 'initialization',
          options: options,
          objectsRelativeToGroup: objectsRelativeToGroup
        });
      },

      /**
       * @private
       * @param {string} key
       * @param {*} value
       */
      _set: function (key, value) {
        var prev = this[key];
        this.callSuper('_set', key, value);
        if (key === 'canvas' && prev !== value) {
          this.forEachObject(function (object) {
            object._set(key, value);
          });
        }
        if (key === 'layout' && prev !== value) {
          this._applyLayoutStrategy({ type: 'layout_change', layout: value, prevLayout: prev });
        }
        if (key === 'subTargetCheck') {
          this.forEachObject(this._watchObject.bind(this, value));
        }
        return this;
      },

      /**
       * Add objects
       * @param {...fabric.Object} objects
       */
      add: function () {
        fabric.Collection.add.apply(this, arguments);
        this._onAfterObjectsChange('added', Array.from(arguments));
      },

      /**
       * Add objects that exist in instance's coordinate plane
       * @param {...fabric.Object} objects
       */
      addRelativeToGroup: function () {
        this._objects.push.apply(this._objects, arguments);
        for (var i = 0, length = arguments.length; i < length; i++) {
          this._onObjectAdded(arguments[i], true);
        }
        this._onAfterObjectsChange('added', Array.from(arguments));
      },

      /**
       * Inserts an object into collection at specified index
       * @param {fabric.Object} objects Object to insert
       * @param {Number} index Index to insert object at
       * @param {Boolean} nonSplicing When `true`, no splicing (shifting) of objects occurs
       */
      insertAt: function (objects, index, nonSplicing) {
        fabric.Collection.insertAt.call(this, objects, index, nonSplicing);
        this._onAfterObjectsChange('added', Array.isArray(objects) ? objects : [objects]);
      },

      /**
       * Remove objects
       * @param {...fabric.Object} objects
       */
      remove: function () {
        fabric.Collection.remove.apply(this, arguments);
        this._onAfterObjectsChange('removed', Array.from(arguments));
      },

      /**
       * Remove all objects
       * @returns {fabric.Object[]} removed objects
       */
      removeAll: function () {
        this._activeObjects = [];
        var remove = this._objects.slice();
        this.remove.apply(this, remove);
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
        object[directive]('changed', this.__objectMonitor);
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
        if (object.group) {
          if (object.group === this) {
            throw new Error('fabric.Group: duplicate objects are not supported inside group');
          }
          object.group.remove(object);
        }
        if (object.type === 'layer') {
          throw new Error('fabric.Group: nesting layers is not supported inside group');
        }
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
        this._exitGroup(object, removeParentTransform);
        object._set('canvas', undefined);
      },

      /**
       * @private
       * @param {fabric.Object} object
       * @param {boolean} [removeParentTransform] true if object should exit group without applying group's transform to it
       */
      _exitGroup: function (object, removeParentTransform) {
        object._set('group', undefined);
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
       * @private
       * @param {fabric.Object} object
       * @param {boolean} [relativeToGroup] true if object is in group's coordinate plane
       */
      _onObjectAdded: function (object, relativeToGroup) {
        this.enterGroup(object, relativeToGroup);
        object.fire('added', { target: this });
      },

      /**
       * @private
       * @param {fabric.Object} object
       * @param {boolean} [removeParentTransform] true if object should exit group without applying group's transform to it
       */
      _onObjectRemoved: function (object, removeParentTransform) {
        this.exitGroup(object, removeParentTransform);
        object.fire('removed', { target: this });
      },

      /**
       * Check if instance or its group are caching, recursively up
       * @return {Boolean}
       */
      isOnACache: function () {
        return this.ownCaching || (!!this.group && this.group.isOnACache());
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
        this._renderObjects(ctx);
      },

      /**
       * Render objects:\
       * Canvas is in charge of rendering the selected objects in case of multiselection.\
       * In case a single object is selected it's entire tree will be rendered by canvas above the other objects (`preserveObjectStacking = false`)
       * @private
       * @param {CanvasRenderingContext2D} ctx Context to render on
       * @deprecated
       */
      _renderObjects: function (ctx) {
        var localActiveObjects = this._activeObjects,
          activeObjectsSize = this.canvas.getActiveObjects ? this.canvas.getActiveObjects().length : 0,
          preserveObjectStacking = this.canvas.preserveObjectStacking;
        this.forEachObject(function (object) {
          if (preserveObjectStacking || activeObjectsSize <= 1
            || localActiveObjects.length === 0 || localActiveObjects.indexOf(object) === -1) {
            object.render(ctx);
          }
        }, this);
      },

      /**
       * @public
       * @typedef LayoutContext
       * @property {string} [layout] layout directive
       * @property {number} [centerX] new centerX in canvas coordinate plane
       * @property {number} [centerY] new centerY in canvas coordinate plane
       * @property {number} [width]
       * @property {number} [height]
       * @param {LayoutContext} [context] pass values to use for layout calculations
       */
      triggerLayout: function (context) {
        if (context && context.layout) {
          context.prevLayout = this.layout;
          this.layout = context.layout;
        }
        this._applyLayoutStrategy({ type: 'imperative', context: context });
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
      },

      /**
       * initial layout logic:
       * calculate bbox of objects (if necessary) and translate it according to options recieved from the constructor (left, top, width, height)
       * so it is placed in the center of the bbox received from the constructor
       * 
       * @private
       * @param {object} context see `getLayoutStrategyResult`
       */
      _applyLayoutStrategy: function (context) {
        var transform = this.calcTransformMatrix();
        var isFirstLayout = context.type === 'initialization';
        var center = this.getCenterPoint();
        var result = this.getLayoutStrategyResult(this.layout, this._objects.concat(), context);
        if (!result) {
          //  fire hook on first layout  (firing layout event won't have any effect because at this point no events have been registered)
          isFirstLayout && this.onLayout(context, {
            centerX: center.x,
            centerY: center.y,
            width: this.width,
            height: this.height,
          });
          return;
        }
        this.set({ width: result.width, height: result.height });
        //  handle positioning
        var newCenter = new fabric.Point(result.centerX, result.centerY);
        var diff = fabric.util.transformPoint(
          isFirstLayout ?
            center.subtract(new fabric.Point(result.centerMassX, result.centerMassY)):
            center.subtract(newCenter),
          fabric.util.invertTransform(transform),
          true
        );
        //  adjust objects to account for new center
        this.forEachObject(function (object) {
          this._adjustObjectPosition(object, diff);
        }, this);
        //  clip path as well
        !isFirstLayout && this.clipPath && !this.clipPath.absolutePositioned
          && this._adjustObjectPosition(this.clipPath, diff);
        if (!newCenter.eq(center)) {
          //  set position
          this.setPositionByOrigin(newCenter, 'center', 'center');
          this.setCoords();
        }
        //  fire layout hook and event
        this.onLayout(context, result);
        this.fire('layout', {
          context: context,
          result: result,
          transform: transform,
          diff: diff
        });
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
       * @returns {{ centerX: number, centerY: number, width: number, height: number } | undefined} positioning data
       */
      getLayoutStrategyResult: function (layoutDirective, objects, context) {  // eslint-disable-line no-unused-vars
        //  `fit-content-lazy` performance enhancement
        //  skip if instance had no objects before the `added` event because it may have kept layout after removing all previous objects
        if (layoutDirective === 'fit-content-lazy'
          && context.type === 'added' && objects.length > context.targets.length) {
          //  calculate added objects' bbox with existing bbox
          var objects = context.targets.concat(this);
          return this.getObjectsBoundingBox(objects);
        }
        else if (layoutDirective === 'fit-content' || layoutDirective === 'fit-content-lazy'
          || (layoutDirective === 'fixed' && context.type === 'initialization')) {
          return this.prepareBoundingBox(layoutDirective, objects, context);
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
            var bbox = this.prepareBoundingBox(layoutDirective, objects, context) || {
              centerX: clipPathCenter.x,
              centerY: clipPathCenter.y,
            };
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
       * Override this method to customize layout.
       * A wrapper around {@link fabric.Group#getObjectsBoundingBox}
       * @public
       * @param {string} layoutDirective
       * @param {fabric.Object[]} objects
       * @param {object} context object with data regarding what triggered the call
       * @param {'initialization'|'object_modified'|'added'|'removed'|'layout_change'|'imperative'} context.type
       * @param {fabric.Object[]} context.path array of objects starting from the object that triggered the call to the current one
       * @returns {{ centerX: number, centerY: number, width: number, height: number } | undefined} positioning data in canvas coordinate plane
       */
      prepareBoundingBox: function (layoutDirective, objects, context) {
        if (context.type === 'initialization') {
          var options = context.options || {};
          var hasX = typeof options.left === 'number',
              hasY = typeof options.top === 'number',
              hasWidth = typeof options.width === 'number',
              hasHeight = typeof options.height === 'number';
          //  performance enhancement
          //  skip layout calculation if bbox is defined
          if ((hasX && hasY && hasWidth && hasHeight && context.objectsRelativeToGroup) || objects.length === 0) {
            return;
          }
          else {
            var bbox = this.getObjectsBoundingBox(objects);
            var center = this.getCenterPoint();
            return {
              centerX: hasX || hasY ? center.x : bbox.centerX,
              centerY: hasX || hasY ? center.y : bbox.centerY,
              centerMassX: bbox.centerX,
              centerMassY: bbox.centerY,
              width: hasWidth ? this.width : bbox.width,
              height: hasHeight ? this.height : bbox.height,
            };
          }
        }
        else if (context.type === 'imperative' && context.context) {
          return Object.assign(
            this.getObjectsBoundingBox(objects) || {},
            context.context
          );
        }
        else {
          return this.getObjectsBoundingBox(objects);
        }
      },

      /**
       * uses absolute object coords (in canvas coordinate plane)
       * @public
       * @param {fabric.Object[]} objects
       * @returns {Object | null} bounding box
       */
      getObjectsBoundingBox: function (objects) {
        if (objects.length === 0) {
          return null;
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
            rad = fabric.util.degreesToRadians(this.getTotalAngle() || 0),
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
       * Hook that is called once layout has completed.
       * Provided for layout customization, override if necessary.
       * Complements `getLayoutStrategyResult`, which is called at the beginning of layout.
       * @public
       * @param {*} context layout context
       * @param {Object} result layout result
       */
      onLayout: function (/* context, result */) {
        //  override by subclass
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
            //delete data.version;
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
