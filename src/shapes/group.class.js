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
        if (objectsRelativeToGroup) {
          this.forEachObject(function (object) {
            this.enterGroup(object, false);
          }, this);
        }
        else {
          //  we need to preserve object's center point in relation to canvas and apply group's transform to it
          var inv = invertTransform(this.calcTransformMatrix());
          this.forEachObject(function (object) {
            var t = multiplyTransformMatrices(
              inv,
              object.calcTransformMatrix()
            )
            var center = fabric.util.transformPoint(this.getCenterPoint(), t);
            this.enterGroup(object, false);
            object.setPositionByOrigin(center, 'center', 'center');
          }, this);
        }
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
        fabric.Collection.add.call(this, arguments, this._onObjectAdded);
        this._onAfterObjectsChange('added', Array.from(arguments));
      },

      /**
       * Add objects that exist in instance's coordinate plane
       * @param {...fabric.Object} objects
       */
      addRelativeToGroup: function () {
        fabric.Collection.add.call(this, arguments, this._onRelativeObjectAdded);
        this._onAfterObjectsChange('added', Array.from(arguments));
      },

      /**
       * Inserts an object into collection at specified index
       * @param {fabric.Object} objects Object to insert
       * @param {Number} index Index to insert object at
       * @param {Boolean} nonSplicing When `true`, no splicing (shifting) of objects occurs
       * @param {boolean} [relativeToGroup] true if object is in group's coordinate plane
       */
      insertAt: function (objects, index, nonSplicing, relativeToGroup) {
        fabric.Collection.insertAt.call(this, objects, index, nonSplicing,
          relativeToGroup ? this._onRelativeObjectAdded : this._onObjectAdded);
        this._onAfterObjectsChange('added', Array.isArray(objects) ? objects : [objects]);
      },

      /**
       * Remove objects
       * @param {...fabric.Object} objects
       */
      remove: function () {
        fabric.Collection.remove.call(this, arguments, this._onObjectRemoved);
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
       * @param {boolean} [removeParentTransform] true if object is in canvas coordinate plane
       */
      enterGroup: function (object, removeParentTransform) {
        if (object.group) {
          if (object.group === this) {
            throw new Error('fabric.Group: duplicate objects are not supported inside group');
          }
          object.group.remove(object);
        }
        if (object.type === 'layer') {
          throw new Error('fabric.Group: nesting layers is not supported inside group');
        }
        if (removeParentTransform) {
          applyTransformToObject(
            object,
            multiplyTransformMatrices(
              invertTransform(this.calcTransformMatrix()),
              object.calcTransformMatrix()
            )
          );
        }
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
       */
      _onObjectAdded: function (object) {
        this.enterGroup(object, true);
        object.fire('added', { target: this });
      },

      /**
       * @private
       * @param {fabric.Object} object
       */
      _onRelativeObjectAdded: function (object) {
        this.enterGroup(object, false);
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
        //  render fill/stroke courtesy of rect
        fabric.Rect.prototype._render.call(this, ctx);
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
        var isFirstLayout = context.type === 'initialization';
        var center = this.getRelativeCenterPoint();
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
        var vector = center.subtract(newCenter);
        var diff = fabric.util.transformPoint(vector, fabric.util.invertTransform(this.calcOwnMatrix()), true);
        //  adjust objects to account for new center
        this.forEachObject(function (object) {
          this._adjustObjectPosition(object, diff);
        }, this);
        //  clip path as well
        !isFirstLayout && this.clipPath && !this.clipPath.absolutePositioned
          && this._adjustObjectPosition(this.clipPath, diff);
        if (!newCenter.eq(center)) {
          //  set position
          isFirstLayout ?
            this.setPositionByOrigin(newCenter, this.originX, this.originY) :
            this.setPositionByOrigin(newCenter, 'center', 'center');
          this.setCoords();
        }
        //  fire layout hook and event
        this.onLayout(context, result);
        this.fire('layout', {
          context: context,
          result: result,
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
       * @returns {{ centerX: number, centerY: number, width: number, height: number } | undefined} positioning and layout data **relative** to instance's parent
       */
      getLayoutStrategyResult: function (layoutDirective, objects, context) {  // eslint-disable-line no-unused-vars
        //  `fit-content-lazy` performance enhancement
        //  skip if instance had no objects before the `added` event because it may have kept layout after removing all previous objects
        if (layoutDirective === 'fit-content-lazy'
          && context.type === 'added' && objects.length > context.targets.length) {
          //  calculate added objects' bbox with existing bbox
          var addedObjects = context.targets.concat(this);
          return this.prepareBoundingBox(layoutDirective, addedObjects, context);
        }
        else if (layoutDirective === 'fit-content' || layoutDirective === 'fit-content-lazy'
          || (layoutDirective === 'fixed' && context.type === 'initialization')) {
          return this.prepareBoundingBox(layoutDirective, objects, context);
        }
        else if (layoutDirective === 'clip-path' && this.clipPath) {
          var clipPath = this.clipPath;
          if (clipPath.absolutePositioned && context.type === 'initialization') {
            //  we want the center point to exist in group's containing plane
            var clipPathCenter = clipPath.getCenterPoint();
            if (this.group) {
              //  send point from canvas plane to group's containing plane
              var inv = fabric.util.invertTransform(this.group.calcTransformMatrix());
              clipPathCenter = fabric.util.transformPoint(clipPathCenter, inv);
            }
            return {
              centerX: clipPathCenter.x,
              centerY: clipPathCenter.y,
              width: clipPath.width,
              height: clipPath.height,
            };
          }
          else if (!clipPath.absolutePositioned) {
            var center;
            var clipPathRelativeCenter = clipPath.getRelativeCenterPoint(),
              //  we want the center point to exist in group's containing plane, so we send it upwards
              clipPathCenter = fabric.util.transformPoint(clipPathRelativeCenter, this.calcOwnMatrix(), true);
            if (context.type === 'initialization') {
              var bbox = this.prepareBoundingBox(layoutDirective, objects, context) || {};
              center = new fabric.Point(bbox.centerX || 0, bbox.centerY || 0);
            }
            else {
              center = this.getRelativeCenterPoint();
            }
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
            var bbox = this.getObjectsBoundingBox(objects) || {};
            return Object.assign(
              bbox,
              {
                width: hasWidth ? this.width : (bbox.width || 0),
                height: hasHeight ? this.height : (bbox.height || 0),
              }
            );
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
       * Calculate the bbox of objects relative to instance's containing plane
       * @public
       * @param {fabric.Object[]} objects
       * @returns {Object | null} bounding box
       */
      getObjectsBoundingBox: function (objects) {
        if (objects.length === 0) {
          return null;
        }
        
        var objCenter, size, min, max;
        objects.forEach(function (object, i) {
          objCenter = object.getRelativeCenterPoint();
          size = object._getTransformedDimensions();
          if (i === 0) {
            min = new fabric.Point(objCenter.x - size.x / 2, objCenter.y - size.y / 2);
            max = new fabric.Point(objCenter.x + size.x / 2, objCenter.y + size.y / 2);
          }
          else {
            min.setXY(Math.min(min.x, objCenter.x - size.x / 2), Math.min(min.y, objCenter.y - size.y / 2));
            max.setXY(Math.max(max.x, objCenter.x + size.x / 2), Math.max(max.y, objCenter.y + size.y / 2));
          }
        });

        var width = max.x - min.x,
          height = max.y - min.y,
          relativeCenter = min.midPointFrom(max),
          //  we send `relativeCenter` up to group's containing plane
          centerMass = fabric.util.transformPoint(relativeCenter, this.calcOwnMatrix(), true),
          center = this.getRelativeCenterPoint().add(centerMass);

        return {
          left: min.x,
          top: min.y,
          right: max.x,
          bottom: max.y,
          x: min.x,
          y: min.y,
          centerX: center.x,
          centerY: center.y,
          width: width,
          height: height,
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
        var obj = this.callSuper('toObject', ['layout', 'subTargetCheck'].concat(propertiesToInclude));
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
       * @private
       */
      _createFillStrokeSVGRect: function (reviver) {
        if (!this.fill && 
          (!this.stroke || this.stroke === 'none' || this.stroke === 'transparent' || !this.strokeWidth)) {
          return '';
        }
        var fillStroke = fabric.Rect.prototype._toSVG.call(this, reviver);
        var commons = fillStroke.indexOf('COMMON_PARTS');
        fillStroke[commons] = 'for="group" ';
        return fillStroke.join('');
      },

      /**
       * Returns svg representation of an instance
       * @param {Function} [reviver] Method for further parsing of svg representation.
       * @return {String} svg representation of an instance
       */
      _toSVG: function (reviver) {
        var svgString = ['<g ', 'COMMON_PARTS', ' >\n'];
        svgString.push('\t\t', this._createFillStrokeSVGRect(reviver));
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
        svgString.push('\t\t', this._createFillStrokeSVGRect(reviver));
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
   * @param {Object} object Object to create a group from
   * @returns {Promise<fabric.Group>}
   */
  fabric.Group.fromObject = function(object) {
    var objects = object.objects || [],
        options = fabric.util.object.clone(object, true);
    delete options.objects;
    return Promise.all([
      fabric.util.enlivenObjects(objects),
      fabric.util.enlivenObjectEnlivables(options)
    ]).then(function (enlivened) {
      return new fabric.Group(enlivened[0], Object.assign(options, enlivened[1]), true);
    });
  };

})(typeof exports !== 'undefined' ? exports : this);
