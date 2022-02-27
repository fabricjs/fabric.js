(function (global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = {}),
      multiplyTransformMatrices = fabric.util.multiplyTransformMatrices,
      invertTransform = fabric.util.invertTransform,
      transformPoint = fabric.util.transformPoint,
      applyTransformToObject = fabric.util.applyTransformToObject,
      degreesToRadians = fabric.util.degreesToRadians,
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
       * set to `false` if you don't need caontained objects to be target of events
       * @default
       * @type boolean
       */
      subTargetCheck: false,

      /**
       * Used to allow targeting of object inside groups.
       * set to true if you want to select an object inside a group.
       * REQUIRES subTargetCheck set to true
       * @default
       * @type boolean
       */
      interactive: false,

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
            );
            var center = transformPoint(this.getCenterPoint(), t);
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
        if (key === 'interactive') {
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
       * Inserts an object into collection at specified index
       * @param {fabric.Object} objects Object to insert
       * @param {Number} index Index to insert object at
       */
      insertAt: function (objects, index) {
        fabric.Collection.insertAt.call(this, objects, index,  this._onObjectAdded);
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

      // /**
      //  * backward compatibility
      //  * @deprecated
      //  */
      // addWithUpdate: function () {
      //   this.add.apply(this, arguments);
      // },

      // /**
      //  * backward compatibility
      //  * @deprecated
      //  */
      // removeWithUpdate: function () {
      //   this.remove.apply(this, arguments);
      // },

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
        // TODO check what changed ischeck
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
            /* _DEV_MODE_START_ */
            console.warn('fabric.Group: duplicate objects are not supported inside group, this call has no effect');
            /* _DEV_MODE_END_ */
            return;
          }
          object.group.remove(object);
        }
        // if (object.type === 'layer') {
        //   throw new Error('fabric.Group: nesting layers is not supported inside group');
        // }
        // can be this converted to utils?
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
        this._watchObject(true, object);
        var activeObject = this.canvas && this.canvas.getActiveObject && this.canvas.getActiveObject();
        // if we are adding the activeObject in a group
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

      /**
       * @override
       * @return {Boolean}
       */
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
       * @param {boolean} [forClipping]
       */
      _render: function (ctx, forClipping) {
        //  render fill/stroke courtesy of rect
        !forClipping && (this.hasFill() || this.hasStroke()) && fabric.Rect.prototype._render.call(this, ctx);
        this._renderObjects(ctx, forClipping);
      },

      /**
       * Render objects:\
       * Canvas is in charge of rendering the selected objects in case of multiselection.\
       * In case a single object is selected it's entire tree will be rendered by canvas above the other objects (`preserveObjectStacking = false`)
       * @private
       * @param {CanvasRenderingContext2D} ctx Context to render on
       * @param {boolean} [renderAllObjects] override default behavior to render all objects, included selected objects
       * @todo support perPixelTargetFind
       */
      _renderObjects: function (ctx, renderAllObjects) {
        var localActiveObjects = this._activeObjects,
            activeObjectsSize = this.canvas.getActiveObjects ? this.canvas.getActiveObjects().length : 0,
            preserveObjectStacking = this.canvas.preserveObjectStacking;
        this.forEachObject(function (object) {
          if (renderAllObjects || preserveObjectStacking || activeObjectsSize <= 1
            || localActiveObjects.length === 0 || localActiveObjects.indexOf(object) === -1) {
            object.render(ctx);
          }
        }, this);
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
       * @param {LayoutContext} context
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
        //  handle positioning
        var newCenter = new fabric.Point(result.centerX, result.centerY);
        var vector = center.subtract(newCenter).add(new fabric.Point(result.correctionX || 0, result.correctionY || 0));
        var diff = transformPoint(vector, invertTransform(this.calcOwnMatrix()), true);
        //  set dimensions
        this.set({ width: result.width, height: result.height });
        //  adjust objects to account for new center
        !context.objectsRelativeToGroup && this.forEachObject(function (object) {
          this._adjustObjectPosition(object, diff);
        }, this);
        //  clip path as well
        !isFirstLayout && this.layout !== 'clip-path' && this.clipPath && !this.clipPath.absolutePositioned
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
       *
       * @typedef {'initialization'|'object_modified'|'added'|'removed'|'layout_change'|'imperative'} LayoutContextType
       *
       * @typedef LayoutContext context object with data regarding what triggered the call
       * @property {LayoutContextType} type
       * @property {fabric.Object[]} [path] array of objects starting from the object that triggered the call to the current one
       *
       * @typedef LayoutResult positioning and layout data **relative** to instance's parent
       * @property {number} centerX new centerX as measured by the containing plane (same as `left` with `originX` set to `center`)
       * @property {number} centerY new centerY as measured by the containing plane (same as `top` with `originY` set to `center`)
       * @property {number} [correctionX] correctionX to translate objects by, measured as `centerX`
       * @property {number} [correctionY] correctionY to translate objects by, measured as `centerY`
       * @property {number} width
       * @property {number} height
       *
       * @param {string} layoutDirective
       * @param {fabric.Object[]} objects
       * @param {LayoutContext} context
       * @returns {LayoutResult | undefined}
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
          var clipPathSizeAfter = clipPath._getTransformedDimensions();
          if (clipPath.absolutePositioned && (context.type === 'initialization' || context.type === 'layout_change')) {
            //  we want the center point to exist in group's containing plane
            var clipPathCenter = clipPath.getCenterPoint();
            if (this.group) {
              //  send point from canvas plane to group's containing plane
              var inv = invertTransform(this.group.calcTransformMatrix());
              clipPathCenter = transformPoint(clipPathCenter, inv);
            }
            return {
              centerX: clipPathCenter.x,
              centerY: clipPathCenter.y,
              width: clipPathSizeAfter.x,
              height: clipPathSizeAfter.y,
            };
          }
          else if (!clipPath.absolutePositioned) {
            var center;
            var clipPathRelativeCenter = clipPath.getRelativeCenterPoint(),
                //  we want the center point to exist in group's containing plane, so we send it upwards
                clipPathCenter = transformPoint(clipPathRelativeCenter, this.calcOwnMatrix(), true);
            if (context.type === 'initialization' || context.type === 'layout_change') {
              var bbox = this.prepareBoundingBox(layoutDirective, objects, context) || {};
              center = new fabric.Point(bbox.centerX || 0, bbox.centerY || 0);
              return {
                centerX: center.x + clipPathCenter.x,
                centerY: center.y + clipPathCenter.y,
                correctionX: bbox.correctionX - clipPathCenter.x,
                correctionY: bbox.correctionY - clipPathCenter.y,
                width: clipPath.width,
                height: clipPath.height,
              };
            }
            else {
              center = this.getRelativeCenterPoint();
              return {
                centerX: center.x + clipPathCenter.x,
                centerY: center.y + clipPathCenter.y,
                width: clipPathSizeAfter.x,
                height: clipPathSizeAfter.y,
              };
            }
          }
        }
        else if (layoutDirective === 'svg' && context.type === 'initialization') {
          var bbox = this.getObjectsBoundingBox(objects, true) || {};
          return Object.assign(bbox, {
            correctionX: -bbox.offsetX || 0,
            correctionY: -bbox.offsetY || 0,
          });
        }
      },

      /**
       * Override this method to customize layout.
       * A wrapper around {@link fabric.Group#getObjectsBoundingBox}
       * @public
       * @param {string} layoutDirective
       * @param {fabric.Object[]} objects
       * @param {LayoutContext} context
       * @returns {LayoutResult | undefined}
       */
      prepareBoundingBox: function (layoutDirective, objects, context) {
        if (context.type === 'initialization') {
          return this.prepareInitialBoundingBox(layoutDirective, objects, context);
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
       * Calculates center taking into account originX, originY while not being sure that width/height are initialized
       * @public
       * @param {string} layoutDirective
       * @param {fabric.Object[]} objects
       * @param {LayoutContext} context
       * @returns {LayoutResult | undefined}
       */
      prepareInitialBoundingBox: function (layoutDirective, objects, context) {
        var options = context.options || {},
            hasX = typeof options.left === 'number',
            hasY = typeof options.top === 'number',
            hasWidth = typeof options.width === 'number',
            hasHeight = typeof options.height === 'number';

        //  performance enhancement
        //  skip layout calculation if bbox is defined
        if ((hasX && hasY && hasWidth && hasHeight && context.objectsRelativeToGroup) || objects.length === 0) {
          //  return nothing to skip layout
          return;
        }

        var bbox = this.getObjectsBoundingBox(objects) || {};
        var width = hasWidth ? this.width : (bbox.width || 0),
            height = hasHeight ? this.height : (bbox.height || 0),
            calculatedCenter = new fabric.Point(bbox.centerX || 0, bbox.centerY || 0),
            origin = new fabric.Point(this.resolveOriginX(this.originX), this.resolveOriginY(this.originY)),
            size = new fabric.Point(width, height),
            strokeWidthVector = this._getTransformedDimensions({ width: 0, height: 0 }),
            sizeAfter = this._getTransformedDimensions({
              width: width,
              height: height,
              strokeWidth: 0
            }),
            bboxSizeAfter = this._getTransformedDimensions({
              width: bbox.width,
              height: bbox.height,
              strokeWidth: 0
            }),
            rotationCorrection = new fabric.Point(0, 0);

        if (this.angle) {
          var rad = degreesToRadians(this.angle),
              sin = Math.abs(fabric.util.sin(rad)),
              cos = Math.abs(fabric.util.cos(rad));
          sizeAfter.setXY(
            sizeAfter.x * cos + sizeAfter.y * sin,
            sizeAfter.x * sin + sizeAfter.y * cos
          );
          bboxSizeAfter.setXY(
            bboxSizeAfter.x * cos + bboxSizeAfter.y * sin,
            bboxSizeAfter.x * sin + bboxSizeAfter.y * cos
          );
          strokeWidthVector = fabric.util.rotateVector(strokeWidthVector, rad);
          //  correct center after rotating
          var strokeCorrection = strokeWidthVector.multiply(origin.scalarAdd(-0.5).scalarDivide(-2));
          rotationCorrection = sizeAfter.subtract(size).scalarDivide(2).add(strokeCorrection);
          calculatedCenter.addEquals(rotationCorrection);
        }
        //  calculate center and correction
        var originT = origin.scalarAdd(0.5);
        var originCorrection = sizeAfter.multiply(originT);
        var centerCorrection = new fabric.Point(
          hasWidth ? bboxSizeAfter.x / 2 : originCorrection.x,
          hasHeight ? bboxSizeAfter.y / 2 : originCorrection.y
        );
        var center = new fabric.Point(
          hasX ? this.left - (sizeAfter.x + strokeWidthVector.x) * origin.x : calculatedCenter.x - centerCorrection.x,
          hasY ? this.top - (sizeAfter.y + strokeWidthVector.y) * origin.y : calculatedCenter.y - centerCorrection.y
        );
        var offsetCorrection = new fabric.Point(
          hasX ?
            center.x - calculatedCenter.x + bboxSizeAfter.x * (hasWidth ? 0.5 : 0) :
            -(hasWidth ? (sizeAfter.x - strokeWidthVector.x) * 0.5 : sizeAfter.x * originT.x),
          hasY ?
            center.y - calculatedCenter.y + bboxSizeAfter.y * (hasHeight ? 0.5 : 0) :
            -(hasHeight ? (sizeAfter.y - strokeWidthVector.y) * 0.5 : sizeAfter.y * originT.y)
        ).add(rotationCorrection);
        var correction = new fabric.Point(
          hasWidth ? -sizeAfter.x / 2 : 0,
          hasHeight ? -sizeAfter.y / 2 : 0
        ).add(offsetCorrection);

        return {
          centerX: center.x,
          centerY: center.y,
          correctionX: correction.x,
          correctionY: correction.y,
          width: size.x,
          height: size.y,
        };
      },

      /**
       * Calculate the bbox of objects relative to instance's containing plane
       * @public
       * @param {fabric.Object[]} objects
       * @returns {LayoutResult | null} bounding box
       */
      getObjectsBoundingBox: function (objects, ignoreOffset) {
        if (objects.length === 0) {
          return null;
        }
        var objCenter, sizeVector, min, max, a, b;
        objects.forEach(function (object, i) {
          objCenter = object.getRelativeCenterPoint();
          sizeVector = object._getTransformedDimensions().scalarDivideEquals(2);
          if (object.angle) {
            var rad = degreesToRadians(object.angle),
                sin = Math.abs(fabric.util.sin(rad)),
                cos = Math.abs(fabric.util.cos(rad)),
                rx = sizeVector.x * cos + sizeVector.y * sin,
                ry = sizeVector.x * sin + sizeVector.y * cos;
            sizeVector = new fabric.Point(rx, ry);
          }
          a = objCenter.subtract(sizeVector);
          b = objCenter.add(sizeVector);
          if (i === 0) {
            min = new fabric.Point(Math.min(a.x, b.x), Math.min(a.y, b.y));
            max = new fabric.Point(Math.max(a.x, b.x), Math.max(a.y, b.y));
          }
          else {
            min.setXY(Math.min(min.x, a.x, b.x), Math.min(min.y, a.y, b.y));
            max.setXY(Math.max(max.x, a.x, b.x), Math.max(max.y, a.y, b.y));
          }
        });

        var size = max.subtract(min),
            relativeCenter = ignoreOffset ? size.scalarDivide(2) : min.midPointFrom(max),
            //  we send `relativeCenter` up to group's containing plane
            offset = transformPoint(min, this.calcOwnMatrix()),
            center = transformPoint(relativeCenter, this.calcOwnMatrix());

        return {
          offsetX: offset.x,
          offsetY: offset.y,
          centerX: center.x,
          centerY: center.y,
          width: size.x,
          height: size.y,
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
        var obj = this.callSuper('toObject', ['layout', 'subTargetCheck', 'interactive'].concat(propertiesToInclude));
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
        if (!this.hasFill() && !this.hasStroke()) {
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
        var fillStroke = this._createFillStrokeSVGRect(reviver);
        fillStroke && svgString.push('\t\t', fillStroke);
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
        var fillStroke = this._createFillStrokeSVGRect(reviver);
        fillStroke && svgString.push('\t\t', fillStroke);
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
        options = clone(object, true);
    delete options.objects;
    return Promise.all([
      fabric.util.enlivenObjects(objects),
      fabric.util.enlivenObjectEnlivables(options)
    ]).then(function (enlivened) {
      return new fabric.Group(enlivened[0], Object.assign(options, enlivened[1]), true);
    });
  };

})(typeof exports !== 'undefined' ? exports : this);
