//@ts-nocheck
import { dragHandler, getActionFromCorner } from './controls/actions';
import { Point } from './point.class';
import { FabricObject } from './shapes/Object/FabricObject';
import { Transform } from './EventTypeDefs';
import { saveObjectTransform } from './util/misc/objectTransforms';

(function (global) {
  var fabric = global.fabric,
    getPointer = fabric.util.getPointer,
    degreesToRadians = fabric.util.degreesToRadians,
    isTouchEvent = fabric.util.isTouchEvent;

  /**
   * Canvas class
   * @class fabric.Canvas
   * @extends fabric.StaticCanvas
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-1#canvas}
   * @see {@link fabric.Canvas#initialize} for constructor definition
   *
   * @fires object:modified at the end of a transform or any change when statefull is true
   * @fires object:rotating while an object is being rotated from the control
   * @fires object:scaling while an object is being scaled by controls
   * @fires object:moving while an object is being dragged
   * @fires object:skewing while an object is being skewed from the controls
   *
   * @fires before:transform before a transform is is started
   * @fires before:selection:cleared
   * @fires selection:cleared
   * @fires selection:updated
   * @fires selection:created
   *
   * @fires path:created after a drawing operation ends and the path is added
   * @fires mouse:down
   * @fires mouse:move
   * @fires mouse:up
   * @fires mouse:down:before  on mouse down, before the inner fabric logic runs
   * @fires mouse:move:before on mouse move, before the inner fabric logic runs
   * @fires mouse:up:before on mouse up, before the inner fabric logic runs
   * @fires mouse:over
   * @fires mouse:out
   * @fires mouse:dblclick whenever a native dbl click event fires on the canvas.
   *
   * @fires dragover
   * @fires dragenter
   * @fires dragleave
   * @fires drag:enter object drag enter
   * @fires drag:leave object drag leave
   * @fires drop:before before drop event. Prepare for the drop event (same native event).
   * @fires drop
   * @fires drop:after after drop event. Run logic on canvas after event has been accepted/declined (same native event).
   * @example
   * let a: fabric.Object, b: fabric.Object;
   * let flag = false;
   * canvas.add(a, b);
   * a.on('drop:before', opt => {
   *  //  we want a to accept the drop even though it's below b in the stack
   *  flag = this.canDrop(opt.e);
   * });
   * b.canDrop = function(e) {
   *  !flag && this.callSuper('canDrop', e);
   * }
   * b.on('dragover', opt => b.set('fill', opt.dropTarget === b ? 'pink' : 'black'));
   * a.on('drop', opt => {
   *  opt.e.defaultPrevented  //  drop occured
   *  opt.didDrop             //  drop occured on canvas
   *  opt.target              //  drop target
   *  opt.target !== a && a.set('text', 'I lost');
   * });
   * canvas.on('drop:after', opt => {
   *  //  inform user who won
   *  if(!opt.e.defaultPrevented) {
   *    // no winners
   *  }
   *  else if(!opt.didDrop) {
   *    //  my objects didn't win, some other lucky object
   *  }
   *  else {
   *    //  we have a winner it's opt.target!!
   *  }
   * })
   *
   * @fires after:render at the end of the render process, receives the context in the callback
   * @fires before:render at start the render process, receives the context in the callback
   *
   * @fires contextmenu:before
   * @fires contextmenu
   * @example
   * let handler;
   * targets.forEach(target => {
   *   target.on('contextmenu:before', opt => {
   *     //  decide which target should handle the event before canvas hijacks it
   *     if (someCaseHappens && opt.targets.includes(target)) {
   *       handler = target;
   *     }
   *   });
   *   target.on('contextmenu', opt => {
   *     //  do something fantastic
   *   });
   * });
   * canvas.on('contextmenu', opt => {
   *   if (!handler) {
   *     //  no one takes responsibility, it's always left to me
   *     //  let's show them how it's done!
   *   }
   * });
   *
   */
  fabric.Canvas = fabric.util.createClass(
    fabric.StaticCanvas,
    /** @lends fabric.Canvas.prototype */ {
      /**
       * Constructor
       * @param {HTMLElement | String} el &lt;canvas> element to initialize instance on
       * @param {Object} [options] Options object
       * @return {Object} thisArg
       */
      initialize: function (el, options) {
        options || (options = {});
        this.renderAndResetBound = this.renderAndReset.bind(this);
        this.requestRenderAllBound = this.requestRenderAll.bind(this);
        this._initStatic(el, options);
        this._initInteractive();
        this._createCacheCanvas();
      },

      /**
       * When true, objects can be transformed by one side (unproportionally)
       * when dragged on the corners that normally would not do that.
       * @type Boolean
       * @default
       * @since fabric 4.0 // changed name and default value
       */
      uniformScaling: true,

      /**
       * Indicates which key switches uniform scaling.
       * values: 'altKey', 'shiftKey', 'ctrlKey'.
       * If `null` or 'none' or any other string that is not a modifier key
       * feature is disabled.
       * totally wrong named. this sounds like `uniform scaling`
       * if Canvas.uniformScaling is true, pressing this will set it to false
       * and viceversa.
       * @since 1.6.2
       * @type ModifierKey
       * @default
       */
      uniScaleKey: 'shiftKey',

      /**
       * When true, objects use center point as the origin of scale transformation.
       * <b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).
       * @since 1.3.4
       * @type Boolean
       * @default
       */
      centeredScaling: false,

      /**
       * When true, objects use center point as the origin of rotate transformation.
       * <b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).
       * @since 1.3.4
       * @type Boolean
       * @default
       */
      centeredRotation: false,

      /**
       * Indicates which key enable centered Transform
       * values: 'altKey', 'shiftKey', 'ctrlKey'.
       * If `null` or 'none' or any other string that is not a modifier key
       * feature is disabled feature disabled.
       * @since 1.6.2
       * @type ModifierKey
       * @default
       */
      centeredKey: 'altKey',

      /**
       * Indicates which key enable alternate action on corner
       * values: 'altKey', 'shiftKey', 'ctrlKey'.
       * If `null` or 'none' or any other string that is not a modifier key
       * feature is disabled feature disabled.
       * @since 1.6.2
       * @type ModifierKey
       * @default
       */
      altActionKey: 'shiftKey',

      /**
       * Indicates that canvas is interactive. This property should not be changed.
       * @type Boolean
       * @default
       */
      interactive: true,

      /**
       * Indicates whether group selection should be enabled
       * @type Boolean
       * @default
       */
      selection: true,

      /**
       * Indicates which key or keys enable multiple click selection
       * Pass value as a string or array of strings
       * values: 'altKey', 'shiftKey', 'ctrlKey'.
       * If `null` or empty or containing any other string that is not a modifier key
       * feature is disabled.
       * @since 1.6.2
       * @type ModifierKey|ModifierKey[]
       * @default
       */
      selectionKey: 'shiftKey',

      /**
       * Indicates which key enable alternative selection
       * in case of target overlapping with active object
       * values: 'altKey', 'shiftKey', 'ctrlKey'.
       * For a series of reason that come from the general expectations on how
       * things should work, this feature works only for preserveObjectStacking true.
       * If `null` or 'none' or any other string that is not a modifier key
       * feature is disabled.
       * @since 1.6.5
       * @type null|ModifierKey
       * @default
       */
      altSelectionKey: null,

      /**
       * Color of selection
       * @type String
       * @default
       */
      selectionColor: 'rgba(100, 100, 255, 0.3)', // blue

      /**
       * Default dash array pattern
       * If not empty the selection border is dashed
       * @type Array
       */
      selectionDashArray: [],

      /**
       * Color of the border of selection (usually slightly darker than color of selection itself)
       * @type String
       * @default
       */
      selectionBorderColor: 'rgba(255, 255, 255, 0.3)',

      /**
       * Width of a line used in object/group selection
       * @type Number
       * @default
       */
      selectionLineWidth: 1,

      /**
       * Select only shapes that are fully contained in the dragged selection rectangle.
       * @type Boolean
       * @default
       */
      selectionFullyContained: false,

      /**
       * Default cursor value used when hovering over an object on canvas
       * @type String
       * @default
       */
      hoverCursor: 'move',

      /**
       * Default cursor value used when moving an object on canvas
       * @type String
       * @default
       */
      moveCursor: 'move',

      /**
       * Default cursor value used for the entire canvas
       * @type String
       * @default
       */
      defaultCursor: 'default',

      /**
       * Cursor value used during free drawing
       * @type String
       * @default
       */
      freeDrawingCursor: 'crosshair',

      /**
       * Cursor value used for disabled elements ( corners with disabled action )
       * @type String
       * @since 2.0.0
       * @default
       */
      notAllowedCursor: 'not-allowed',

      /**
       * Default element class that's given to wrapper (div) element of canvas
       * @type String
       * @default
       */
      containerClass: 'canvas-container',

      /**
       * When true, object detection happens on per-pixel basis rather than on per-bounding-box
       * @type Boolean
       * @default
       */
      perPixelTargetFind: false,

      /**
       * Number of pixels around target pixel to tolerate (consider active) during object detection
       * @type Number
       * @default
       */
      targetFindTolerance: 0,

      /**
       * When true, target detection is skipped. Target detection will return always undefined.
       * click selection won't work anymore, events will fire with no targets.
       * if something is selected before setting it to true, it will be deselected at the first click.
       * area selection will still work. check the `selection` property too.
       * if you deactivate both, you should look into staticCanvas.
       * @type Boolean
       * @default
       */
      skipTargetFind: false,

      /**
       * When true, mouse events on canvas (mousedown/mousemove/mouseup) result in free drawing.
       * After mousedown, mousemove creates a shape,
       * and then mouseup finalizes it and adds an instance of `fabric.Path` onto canvas.
       * @tutorial {@link http://fabricjs.com/fabric-intro-part-4#free_drawing}
       * @type Boolean
       * @default
       */
      isDrawingMode: false,

      /**
       * Indicates whether objects should remain in current stack position when selected.
       * When false objects are brought to top and rendered as part of the selection group
       * @type Boolean
       * @default
       */
      preserveObjectStacking: false,

      /**
       * Indicates if the right click on canvas can output the context menu or not
       * @type Boolean
       * @since 1.6.5
       * @default
       */
      stopContextMenu: false,

      /**
       * Indicates if the canvas can fire right click events
       * @type Boolean
       * @since 1.6.5
       * @default
       */
      fireRightClick: false,

      /**
       * Indicates if the canvas can fire middle click events
       * @type Boolean
       * @since 1.7.8
       * @default
       */
      fireMiddleClick: false,

      /**
       * Keep track of the subTargets for Mouse Events
       * @type fabric.Object[]
       */
      targets: [],

      /**
       * When the option is enabled, PointerEvent is used instead of MouseEvent.
       * @type Boolean
       * @default
       */
      enablePointerEvents: false,

      /**
       * Keep track of the hovered target
       * @type fabric.Object
       * @private
       */
      _hoveredTarget: null,

      /**
       * hold the list of nested targets hovered
       * @type fabric.Object[]
       * @private
       */
      _hoveredTargets: [],

      /**
       * hold the list of objects to render
       * @type fabric.Object[]
       * @private
       */
      _objectsToRender: undefined,

      /**
       * @private
       */
      _initInteractive: function () {
        this._currentTransform = null;
        this._groupSelector = null;
        this._initWrapperElement();
        this._createUpperCanvas();
        this._initEventListeners();

        this._initRetinaScaling();

        this.freeDrawingBrush =
          fabric.PencilBrush && new fabric.PencilBrush(this);

        this.calcOffset();
      },

      /**
       * @private
       * @param {fabric.Object} obj Object that was added
       */
      _onObjectAdded: function (obj) {
        this._objectsToRender = undefined;
        this.callSuper('_onObjectAdded', obj);
      },

      /**
       * @private
       * @param {fabric.Object} obj Object that was removed
       */
      _onObjectRemoved: function (obj) {
        this._objectsToRender = undefined;
        // removing active object should fire "selection:cleared" events
        if (obj === this._activeObject) {
          this.fire('before:selection:cleared', { deselected: [obj] });
          this._discardActiveObject();
          this.fire('selection:cleared', { deselected: [obj] });
          obj.fire('deselected', {
            target: obj,
          });
        }
        if (obj === this._hoveredTarget) {
          this._hoveredTarget = null;
          this._hoveredTargets = [];
        }
        this.callSuper('_onObjectRemoved', obj);
      },

      /**
       * Divides objects in two groups, one to render immediately
       * and one to render as activeGroup.
       * @return {Array} objects to render immediately and pushes the other in the activeGroup.
       */
      _chooseObjectsToRender: function () {
        var activeObjects = this.getActiveObjects(),
          object,
          objsToRender,
          activeGroupObjects;

        if (!this.preserveObjectStacking && activeObjects.length > 1) {
          objsToRender = [];
          activeGroupObjects = [];
          for (var i = 0, length = this._objects.length; i < length; i++) {
            object = this._objects[i];
            if (activeObjects.indexOf(object) === -1) {
              objsToRender.push(object);
            } else {
              activeGroupObjects.push(object);
            }
          }
          if (activeObjects.length > 1) {
            this._activeObject._objects = activeGroupObjects;
          }
          objsToRender.push.apply(objsToRender, activeGroupObjects);
        }
        //  in case a single object is selected render it's entire parent above the other objects
        else if (!this.preserveObjectStacking && activeObjects.length === 1) {
          var target = activeObjects[0],
            ancestors = target.getAncestors(true);
          var topAncestor = ancestors.length === 0 ? target : ancestors.pop();
          objsToRender = this._objects.slice();
          var index = objsToRender.indexOf(topAncestor);
          index > -1 &&
            objsToRender.splice(objsToRender.indexOf(topAncestor), 1);
          objsToRender.push(topAncestor);
        } else {
          objsToRender = this._objects;
        }
        return objsToRender;
      },

      /**
       * Renders both the top canvas and the secondary container canvas.
       * @return {fabric.Canvas} instance
       * @chainable
       */
      renderAll: function () {
        this.cancelRequestedRender();
        if (this.destroyed) {
          return;
        }
        if (
          this.contextTopDirty &&
          !this._groupSelector &&
          !this.isDrawingMode
        ) {
          this.clearContext(this.contextTop);
          this.contextTopDirty = false;
        }
        if (this.hasLostContext) {
          this.renderTopLayer(this.contextTop);
          this.hasLostContext = false;
        }
        !this._objectsToRender &&
          (this._objectsToRender = this._chooseObjectsToRender());
        this.renderCanvas(this.contextContainer, this._objectsToRender);
        return this;
      },

      renderTopLayer: function (ctx) {
        ctx.save();
        if (this.isDrawingMode && this._isCurrentlyDrawing) {
          this.freeDrawingBrush && this.freeDrawingBrush._render();
          this.contextTopDirty = true;
        }
        // we render the top context - last object
        if (this.selection && this._groupSelector) {
          this._drawSelection(ctx);
          this.contextTopDirty = true;
        }
        ctx.restore();
      },

      /**
       * Method to render only the top canvas.
       * Also used to render the group selection box.
       * @return {fabric.Canvas} thisArg
       * @chainable
       */
      renderTop: function () {
        var ctx = this.contextTop;
        this.clearContext(ctx);
        this.renderTopLayer(ctx);
        this.fire('after:render', { ctx });
        return this;
      },

      /**
       * @private
       */
      _normalizePointer: function (object, pointer) {
        var m = object.calcTransformMatrix(),
          invertedM = fabric.util.invertTransform(m),
          vptPointer = this.restorePointerVpt(pointer);
        return fabric.util.transformPoint(vptPointer, invertedM);
      },

      /**
       * Returns true if object is transparent at a certain location
       * @param {fabric.Object} target Object to check
       * @param {Number} x Left coordinate
       * @param {Number} y Top coordinate
       * @return {Boolean}
       */
      isTargetTransparent: function (target, x, y) {
        // in case the target is the activeObject, we cannot execute this optimization
        // because we need to draw controls too.
        if (
          target.shouldCache() &&
          target._cacheCanvas &&
          target !== this._activeObject
        ) {
          var normalizedPointer = this._normalizePointer(target, {
              x: x,
              y: y,
            }),
            targetRelativeX = Math.max(
              target.cacheTranslationX + normalizedPointer.x * target.zoomX,
              0
            ),
            targetRelativeY = Math.max(
              target.cacheTranslationY + normalizedPointer.y * target.zoomY,
              0
            );

          var isTransparent = fabric.util.isTransparent(
            target._cacheContext,
            Math.round(targetRelativeX),
            Math.round(targetRelativeY),
            this.targetFindTolerance
          );

          return isTransparent;
        }

        var ctx = this.contextCache,
          originalColor = target.selectionBackgroundColor,
          v = this.viewportTransform;

        target.selectionBackgroundColor = '';

        this.clearContext(ctx);

        ctx.save();
        ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
        target.render(ctx);
        ctx.restore();

        target.selectionBackgroundColor = originalColor;

        var isTransparent = fabric.util.isTransparent(
          ctx,
          x,
          y,
          this.targetFindTolerance
        );

        return isTransparent;
      },

      /**
       * takes an event and determines if selection key has been pressed
       * @private
       * @param {Event} e Event object
       */
      _isSelectionKeyPressed: function (e) {
        var selectionKeyPressed = false;

        if (Array.isArray(this.selectionKey)) {
          selectionKeyPressed = !!this.selectionKey.find(function (key) {
            return e[key] === true;
          });
        } else {
          selectionKeyPressed = e[this.selectionKey];
        }

        return selectionKeyPressed;
      },

      /**
       * @private
       * @param {Event} e Event object
       * @param {fabric.Object} target
       */
      _shouldClearSelection: function (e, target) {
        var activeObjects = this.getActiveObjects(),
          activeObject = this._activeObject;

        return (
          !target ||
          (target &&
            activeObject &&
            activeObjects.length > 1 &&
            activeObjects.indexOf(target) === -1 &&
            activeObject !== target &&
            !this._isSelectionKeyPressed(e)) ||
          (target && !target.evented) ||
          (target &&
            !target.selectable &&
            activeObject &&
            activeObject !== target)
        );
      },

      /**
       * centeredScaling from object can't override centeredScaling from canvas.
       * this should be fixed, since object setting should take precedence over canvas.
       * also this should be something that will be migrated in the control properties.
       * as ability to define the origin of the transformation that the control provide.
       * @private
       * @param {fabric.Object} target
       * @param {String} action
       * @param {Boolean} altKey
       */
      _shouldCenterTransform: function (target, action, altKey) {
        if (!target) {
          return;
        }

        var centerTransform;

        if (
          action === 'scale' ||
          action === 'scaleX' ||
          action === 'scaleY' ||
          action === 'resizing'
        ) {
          centerTransform = this.centeredScaling || target.centeredScaling;
        } else if (action === 'rotate') {
          centerTransform = this.centeredRotation || target.centeredRotation;
        }

        return centerTransform ? !altKey : altKey;
      },

      /**
       * should disappear before release 4.0
       * @private
       */
      _getOriginFromCorner: function (target, corner) {
        var origin = {
          x: target.originX,
          y: target.originY,
        };

        if (corner === 'ml' || corner === 'tl' || corner === 'bl') {
          origin.x = 'right';
        } else if (corner === 'mr' || corner === 'tr' || corner === 'br') {
          origin.x = 'left';
        }

        if (corner === 'tl' || corner === 'mt' || corner === 'tr') {
          origin.y = 'bottom';
        } else if (corner === 'bl' || corner === 'mb' || corner === 'br') {
          origin.y = 'top';
        }
        return origin;
      },

      /**
       * @private
       * @param {Event} e Event object
       * @param {fabric.Object} target
       */
      _setupCurrentTransform: function (e, target, alreadySelected) {
        if (!target) {
          return;
        }
        var pointer = this.getPointer(e);
        if (target.group) {
          //  transform pointer to target's containing coordinate plane
          pointer = fabric.util.transformPoint(
            pointer,
            fabric.util.invertTransform(target.group.calcTransformMatrix())
          );
        }
        var corner = target.__corner,
          control = target.controls[corner],
          actionHandler =
            alreadySelected && corner
              ? control.getActionHandler(e, target, control)
              : dragHandler,
          action = getActionFromCorner(alreadySelected, corner, e, target),
          origin = this._getOriginFromCorner(target, corner),
          altKey = e[this.centeredKey],
          /**
           * relative to target's containing coordinate plane
           * both agree on every point
           **/
          transform: Transform = {
            target: target,
            action: action,
            actionHandler: actionHandler,
            corner: corner,
            scaleX: target.scaleX,
            scaleY: target.scaleY,
            skewX: target.skewX,
            skewY: target.skewY,
            offsetX: pointer.x - target.left,
            offsetY: pointer.y - target.top,
            originX: origin.x,
            originY: origin.y,
            ex: pointer.x,
            ey: pointer.y,
            lastX: pointer.x,
            lastY: pointer.y,
            theta: degreesToRadians(target.angle),
            width: target.width,
            height: target.height,
            shiftKey: e.shiftKey,
            altKey: altKey,
            original: saveObjectTransform(target),
          };

        if (this._shouldCenterTransform(target, action, altKey)) {
          transform.originX = 'center';
          transform.originY = 'center';
        }
        transform.original.originX = origin.x;
        transform.original.originY = origin.y;
        this._currentTransform = transform;
        this._beforeTransform(e);
      },

      /**
       * Set the cursor type of the canvas element
       * @param {String} value Cursor type of the canvas element.
       * @see http://www.w3.org/TR/css3-ui/#cursor
       */
      setCursor: function (value) {
        this.upperCanvasEl.style.cursor = value;
      },

      /**
       * @private
       * @param {CanvasRenderingContext2D} ctx to draw the selection on
       */
      _drawSelection: function (ctx) {
        var selector = this._groupSelector,
          viewportStart = new Point(selector.ex, selector.ey),
          start = fabric.util.transformPoint(
            viewportStart,
            this.viewportTransform
          ),
          viewportExtent = new Point(
            selector.ex + selector.left,
            selector.ey + selector.top
          ),
          extent = fabric.util.transformPoint(
            viewportExtent,
            this.viewportTransform
          ),
          minX = Math.min(start.x, extent.x),
          minY = Math.min(start.y, extent.y),
          maxX = Math.max(start.x, extent.x),
          maxY = Math.max(start.y, extent.y),
          strokeOffset = this.selectionLineWidth / 2;

        if (this.selectionColor) {
          ctx.fillStyle = this.selectionColor;
          ctx.fillRect(minX, minY, maxX - minX, maxY - minY);
        }

        if (!this.selectionLineWidth || !this.selectionBorderColor) {
          return;
        }
        ctx.lineWidth = this.selectionLineWidth;
        ctx.strokeStyle = this.selectionBorderColor;

        minX += strokeOffset;
        minY += strokeOffset;
        maxX -= strokeOffset;
        maxY -= strokeOffset;
        // selection border
        FabricObject.prototype._setLineDash.call(
          this,
          ctx,
          this.selectionDashArray
        );
        ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
      },

      /**
       * Method that determines what object we are clicking on
       * the skipGroup parameter is for internal use, is needed for shift+click action
       * 11/09/2018 TODO: would be cool if findTarget could discern between being a full target
       * or the outside part of the corner.
       * @param {Event} e mouse event
       * @param {Boolean} skipGroup when true, activeGroup is skipped and only objects are traversed through
       * @return {fabric.Object} the target found
       */
      findTarget: function (e, skipGroup) {
        if (this.skipTargetFind) {
          return;
        }

        var ignoreZoom = true,
          pointer = this.getPointer(e, ignoreZoom),
          activeObject = this._activeObject,
          aObjects = this.getActiveObjects(),
          activeTarget,
          activeTargetSubs,
          isTouch = isTouchEvent(e),
          shouldLookForActive =
            (aObjects.length > 1 && !skipGroup) || aObjects.length === 1;

        // first check current group (if one exists)
        // active group does not check sub targets like normal groups.
        // if active group just exits.
        this.targets = [];

        // if we hit the corner of an activeObject, let's return that.
        if (
          shouldLookForActive &&
          activeObject._findTargetCorner(pointer, isTouch)
        ) {
          return activeObject;
        }
        if (
          aObjects.length > 1 &&
          activeObject.type === 'activeSelection' &&
          !skipGroup &&
          this.searchPossibleTargets([activeObject], pointer)
        ) {
          return activeObject;
        }
        if (
          aObjects.length === 1 &&
          activeObject === this.searchPossibleTargets([activeObject], pointer)
        ) {
          if (!this.preserveObjectStacking) {
            return activeObject;
          } else {
            activeTarget = activeObject;
            activeTargetSubs = this.targets;
            this.targets = [];
          }
        }
        var target = this.searchPossibleTargets(this._objects, pointer);
        if (
          e[this.altSelectionKey] &&
          target &&
          activeTarget &&
          target !== activeTarget
        ) {
          target = activeTarget;
          this.targets = activeTargetSubs;
        }
        return target;
      },

      /**
       * Checks point is inside the object.
       * @param {Object} [pointer] x,y object of point coordinates we want to check.
       * @param {fabric.Object} obj Object to test against
       * @param {Object} [globalPointer] x,y object of point coordinates relative to canvas used to search per pixel target.
       * @return {Boolean} true if point is contained within an area of given object
       * @private
       */
      _checkTarget: function (pointer, obj, globalPointer) {
        if (
          obj &&
          obj.visible &&
          obj.evented &&
          // http://www.geog.ubc.ca/courses/klink/gis.notes/ncgia/u32.html
          // http://idav.ucdavis.edu/~okreylos/TAship/Spring2000/PointInPolygon.html
          obj.containsPoint(pointer)
        ) {
          if (
            (this.perPixelTargetFind || obj.perPixelTargetFind) &&
            !obj.isEditing
          ) {
            var isTransparent = this.isTargetTransparent(
              obj,
              globalPointer.x,
              globalPointer.y
            );
            if (!isTransparent) {
              return true;
            }
          } else {
            return true;
          }
        }
      },

      /**
       * Internal Function used to search inside objects an object that contains pointer in bounding box or that contains pointerOnCanvas when painted
       * @param {Array} [objects] objects array to look into
       * @param {Object} [pointer] x,y object of point coordinates we want to check.
       * @return {fabric.Object} **top most object from given `objects`** that contains pointer
       * @private
       */
      _searchPossibleTargets: function (objects, pointer) {
        // Cache all targets where their bounding box contains point.
        var target,
          i = objects.length,
          subTarget;
        // Do not check for currently grouped objects, since we check the parent group itself.
        // until we call this function specifically to search inside the activeGroup
        while (i--) {
          var objToCheck = objects[i];
          var pointerToUse = objToCheck.group
            ? this._normalizePointer(objToCheck.group, pointer)
            : pointer;
          if (this._checkTarget(pointerToUse, objToCheck, pointer)) {
            target = objects[i];
            if (target.subTargetCheck && Array.isArray(target._objects)) {
              subTarget = this._searchPossibleTargets(target._objects, pointer);
              subTarget && this.targets.push(subTarget);
            }
            break;
          }
        }
        return target;
      },

      /**
       * Function used to search inside objects an object that contains pointer in bounding box or that contains pointerOnCanvas when painted
       * @see {@link fabric.Canvas#_searchPossibleTargets}
       * @param {Array} [objects] objects array to look into
       * @param {Object} [pointer] x,y object of point coordinates we want to check.
       * @return {fabric.Object} **top most object on screen** that contains pointer
       */
      searchPossibleTargets: function (objects, pointer) {
        var target = this._searchPossibleTargets(objects, pointer);
        return target && target.interactive && this.targets[0]
          ? this.targets[0]
          : target;
      },

      /**
       * Returns pointer coordinates without the effect of the viewport
       * @param {Object} pointer with "x" and "y" number values
       * @return {Object} object with "x" and "y" number values
       */
      restorePointerVpt: function (pointer) {
        return fabric.util.transformPoint(
          pointer,
          fabric.util.invertTransform(this.viewportTransform)
        );
      },

      /**
       * Returns pointer coordinates relative to canvas.
       * Can return coordinates with or without viewportTransform.
       * ignoreVpt false gives back coordinates that represent
       * the point clicked on canvas element.
       * ignoreVpt true gives back coordinates after being processed
       * by the viewportTransform ( sort of coordinates of what is displayed
       * on the canvas where you are clicking.
       * ignoreVpt true = HTMLElement coordinates relative to top,left
       * ignoreVpt false, default = fabric space coordinates, the same used for shape position
       * To interact with your shapes top and left you want to use ignoreVpt true
       * most of the time, while ignoreVpt false will give you coordinates
       * compatible with the object.oCoords system.
       * of the time.
       * @param {Event} e
       * @param {Boolean} ignoreVpt
       * @return {Point}
       */
      getPointer: function (e, ignoreVpt) {
        // return cached values if we are in the event processing chain
        if (this._absolutePointer && !ignoreVpt) {
          return this._absolutePointer;
        }
        if (this._pointer && ignoreVpt) {
          return this._pointer;
        }

        var pointer = getPointer(e),
          upperCanvasEl = this.upperCanvasEl,
          bounds = upperCanvasEl.getBoundingClientRect(),
          boundsWidth = bounds.width || 0,
          boundsHeight = bounds.height || 0,
          cssScale;

        if (!boundsWidth || !boundsHeight) {
          if ('top' in bounds && 'bottom' in bounds) {
            boundsHeight = Math.abs(bounds.top - bounds.bottom);
          }
          if ('right' in bounds && 'left' in bounds) {
            boundsWidth = Math.abs(bounds.right - bounds.left);
          }
        }

        this.calcOffset();
        pointer.x = pointer.x - this._offset.left;
        pointer.y = pointer.y - this._offset.top;
        if (!ignoreVpt) {
          pointer = this.restorePointerVpt(pointer);
        }

        var retinaScaling = this.getRetinaScaling();
        if (retinaScaling !== 1) {
          pointer.x /= retinaScaling;
          pointer.y /= retinaScaling;
        }

        // If bounds are not available (i.e. not visible), do not apply scale.
        cssScale =
          boundsWidth === 0 || boundsHeight === 0
            ? new Point(1, 1)
            : new Point(
                upperCanvasEl.width / boundsWidth,
                upperCanvasEl.height / boundsHeight
              );

        return new Point(pointer.x * cssScale.x, pointer.y * cssScale.y);
      },

      /**
       * Sets dimensions (width, height) of this canvas instance. when options.cssOnly flag active you should also supply the unit of measure (px/%/em)
       * @param {Object}        dimensions                    Object with width/height properties
       * @param {Number|String} [dimensions.width]            Width of canvas element
       * @param {Number|String} [dimensions.height]           Height of canvas element
       * @param {Object}        [options]                     Options object
       * @param {Boolean}       [options.backstoreOnly=false] Set the given dimensions only as canvas backstore dimensions
       * @param {Boolean}       [options.cssOnly=false]       Set the given dimensions only as css dimensions
       * @return {fabric.Canvas} thisArg
       * @chainable
       */
      setDimensions: function (dimensions, options) {
        this._resetTransformEventData();
        return this.callSuper('setDimensions', dimensions, options);
      },

      /**
       * @private
       * @throws {CANVAS_INIT_ERROR} If canvas can not be initialized
       */
      _createUpperCanvas: function () {
        var lowerCanvasEl = this.lowerCanvasEl,
          upperCanvasEl = this.upperCanvasEl;

        // if there is no upperCanvas (most common case) we create one.
        if (!upperCanvasEl) {
          upperCanvasEl = this._createCanvasElement();
          this.upperCanvasEl = upperCanvasEl;
        }
        // we assign the same classname of the lowerCanvas
        upperCanvasEl.className = lowerCanvasEl.className;
        // but then we remove the lower-canvas specific className
        upperCanvasEl.classList.remove('lower-canvas');
        // we add the specific upper-canvas class
        upperCanvasEl.classList.add('upper-canvas');
        upperCanvasEl.setAttribute('data-fabric', 'top');
        this.wrapperEl.appendChild(upperCanvasEl);

        this._copyCanvasStyle(lowerCanvasEl, upperCanvasEl);
        this._applyCanvasStyle(upperCanvasEl);
        upperCanvasEl.setAttribute('draggable', 'true');
        this.contextTop = upperCanvasEl.getContext('2d');
      },

      /**
       * @private
       */
      _createCacheCanvas: function () {
        this.cacheCanvasEl = this._createCanvasElement();
        this.cacheCanvasEl.setAttribute('width', this.width);
        this.cacheCanvasEl.setAttribute('height', this.height);
        this.contextCache = this.cacheCanvasEl.getContext('2d');
      },

      /**
       * @private
       */
      _initWrapperElement: function () {
        if (this.wrapperEl) {
          return;
        }
        const container = fabric.document.createElement('div');
        container.classList.add(this.containerClass);
        this.wrapperEl = fabric.util.wrapElement(this.lowerCanvasEl, container);
        this.wrapperEl.setAttribute('data-fabric', 'wrapper');
        fabric.util.setStyle(this.wrapperEl, {
          width: this.width + 'px',
          height: this.height + 'px',
          position: 'relative',
        });
        fabric.util.makeElementUnselectable(this.wrapperEl);
      },

      /**
       * @private
       * @param {HTMLElement} element canvas element to apply styles on
       */
      _applyCanvasStyle: function (element) {
        var width = this.width || element.width,
          height = this.height || element.height;

        fabric.util.setStyle(element, {
          position: 'absolute',
          width: width + 'px',
          height: height + 'px',
          left: 0,
          top: 0,
          'touch-action': this.allowTouchScrolling ? 'manipulation' : 'none',
          '-ms-touch-action': this.allowTouchScrolling
            ? 'manipulation'
            : 'none',
        });
        element.width = width;
        element.height = height;
        fabric.util.makeElementUnselectable(element);
      },

      /**
       * Copy the entire inline style from one element (fromEl) to another (toEl)
       * @private
       * @param {Element} fromEl Element style is copied from
       * @param {Element} toEl Element copied style is applied to
       */
      _copyCanvasStyle: function (fromEl, toEl) {
        toEl.style.cssText = fromEl.style.cssText;
      },

      /**
       * Returns context of top canvas where interactions are drawn
       * @returns {CanvasRenderingContext2D}
       */
      getTopContext: function () {
        return this.contextTop;
      },

      /**
       * Returns context of canvas where object selection is drawn
       * @alias
       * @return {CanvasRenderingContext2D}
       */
      getSelectionContext: function () {
        return this.contextTop;
      },

      /**
       * Returns &lt;canvas> element on which object selection is drawn
       * @return {HTMLCanvasElement}
       */
      getSelectionElement: function () {
        return this.upperCanvasEl;
      },

      /**
       * Returns currently active object
       * @return {fabric.Object} active object
       */
      getActiveObject: function () {
        return this._activeObject;
      },

      /**
       * Returns an array with the current selected objects
       * @return {fabric.Object} active object
       */
      getActiveObjects: function () {
        var active = this._activeObject;
        if (active) {
          if (active.type === 'activeSelection' && active._objects) {
            return active._objects.slice(0);
          } else {
            return [active];
          }
        }
        return [];
      },

      /**
       * @private
       * Compares the old activeObject with the current one and fires correct events
       * @param {fabric.Object} obj old activeObject
       */
      _fireSelectionEvents: function (oldObjects, e) {
        var somethingChanged = false,
          objects = this.getActiveObjects(),
          added = [],
          removed = [],
          invalidate = false;
        oldObjects.forEach(function (oldObject) {
          if (objects.indexOf(oldObject) === -1) {
            somethingChanged = true;
            oldObject.fire('deselected', {
              e: e,
              target: oldObject,
            });
            removed.push(oldObject);
          }
        });
        objects.forEach(function (object) {
          if (oldObjects.indexOf(object) === -1) {
            somethingChanged = true;
            object.fire('selected', {
              e: e,
              target: object,
            });
            added.push(object);
          }
        });
        if (oldObjects.length > 0 && objects.length > 0) {
          invalidate = true;
          somethingChanged &&
            this.fire('selection:updated', {
              e: e,
              selected: added,
              deselected: removed,
            });
        } else if (objects.length > 0) {
          invalidate = true;
          this.fire('selection:created', {
            e: e,
            selected: added,
          });
        } else if (oldObjects.length > 0) {
          invalidate = true;
          this.fire('selection:cleared', {
            e: e,
            deselected: removed,
          });
        }
        invalidate && (this._objectsToRender = undefined);
      },

      /**
       * Sets given object as the only active object on canvas
       * @param {fabric.Object} object Object to set as an active one
       * @param {Event} [e] Event (passed along when firing "object:selected")
       * @return {fabric.Canvas} thisArg
       * @chainable
       */
      setActiveObject: function (object, e) {
        var currentActives = this.getActiveObjects();
        this._setActiveObject(object, e);
        this._fireSelectionEvents(currentActives, e);
        return this;
      },

      /**
       * This is a private method for now.
       * This is supposed to be equivalent to setActiveObject but without firing
       * any event. There is commitment to have this stay this way.
       * This is the functional part of setActiveObject.
       * @private
       * @param {Object} object to set as active
       * @param {Event} [e] Event (passed along when firing "object:selected")
       * @return {Boolean} true if the selection happened
       */
      _setActiveObject: function (object, e) {
        if (this._activeObject === object) {
          return false;
        }
        if (!this._discardActiveObject(e, object)) {
          return false;
        }
        if (object.onSelect({ e: e })) {
          return false;
        }
        this._activeObject = object;
        return true;
      },

      /**
       * This is a private method for now.
       * This is supposed to be equivalent to discardActiveObject but without firing
       * any selection events ( can still fire object transformation events ). There is commitment to have this stay this way.
       * This is the functional part of discardActiveObject.
       * @param {Event} [e] Event (passed along when firing "object:deselected")
       * @param {Object} object to set as active
       * @return {Boolean} true if the selection happened
       * @private
       */
      _discardActiveObject: function (e, object) {
        var obj = this._activeObject;
        if (obj) {
          // onDeselect return TRUE to cancel selection;
          if (obj.onDeselect({ e: e, object: object })) {
            return false;
          }
          if (this._currentTransform && this._currentTransform.target === obj) {
            this.endCurrentTransform(e);
          }
          this._activeObject = null;
        }
        return true;
      },

      /**
       * Discards currently active object and fire events. If the function is called by fabric
       * as a consequence of a mouse event, the event is passed as a parameter and
       * sent to the fire function for the custom events. When used as a method the
       * e param does not have any application.
       * @param {event} e
       * @return {fabric.Canvas} thisArg
       * @chainable
       */
      discardActiveObject: function (e) {
        var currentActives = this.getActiveObjects(),
          activeObject = this.getActiveObject();
        if (currentActives.length) {
          this.fire('before:selection:cleared', {
            e,
            deselected: [activeObject],
          });
        }
        this._discardActiveObject(e);
        this._fireSelectionEvents(currentActives, e);
        return this;
      },

      /**
       * Clears the canvas element, disposes objects, removes all event listeners and frees resources
       *
       * **CAUTION**:
       *
       * This method is **UNSAFE**.
       * You may encounter a race condition using it if there's a requested render.
       * Call this method only if you are sure rendering has settled.
       * Consider using {@link dispose} as it is **SAFE**
       *
       * @private
       */
      destroy: function () {
        var wrapperEl = this.wrapperEl,
          lowerCanvasEl = this.lowerCanvasEl,
          upperCanvasEl = this.upperCanvasEl,
          cacheCanvasEl = this.cacheCanvasEl;
        this.removeListeners();
        this.callSuper('destroy');
        wrapperEl.removeChild(upperCanvasEl);
        wrapperEl.removeChild(lowerCanvasEl);
        this.contextCache = null;
        this.contextTop = null;
        fabric.util.cleanUpJsdomNode(upperCanvasEl);
        this.upperCanvasEl = undefined;
        fabric.util.cleanUpJsdomNode(cacheCanvasEl);
        this.cacheCanvasEl = undefined;
        if (wrapperEl.parentNode) {
          wrapperEl.parentNode.replaceChild(lowerCanvasEl, wrapperEl);
        }
        delete this.wrapperEl;
        return this;
      },

      /**
       * Clears all contexts (background, main, top) of an instance
       * @return {fabric.Canvas} thisArg
       * @chainable
       */
      clear: function () {
        // this.discardActiveGroup();
        this.discardActiveObject();
        this.clearContext(this.contextTop);
        if (this._hasITextHandlers) {
          this.off('mouse:up', this._mouseUpITextHandler);
          this._iTextInstances = null;
          this._hasITextHandlers = false;
        }
        return this.callSuper('clear');
      },

      /**
       * Draws objects' controls (borders/controls)
       * @param {CanvasRenderingContext2D} ctx Context to render controls on
       */
      drawControls: function (ctx) {
        var activeObject = this._activeObject;

        if (activeObject) {
          activeObject._renderControls(ctx);
        }
      },

      /**
       * @private
       */
      _toObject: function (instance, methodName, propertiesToInclude) {
        //If the object is part of the current selection group, it should
        //be transformed appropriately
        //i.e. it should be serialised as it would appear if the selection group
        //were to be destroyed.
        var originalProperties = this._realizeGroupTransformOnObject(instance),
          object = this.callSuper(
            '_toObject',
            instance,
            methodName,
            propertiesToInclude
          );
        //Undo the damage we did by changing all of its properties
        originalProperties && instance.set(originalProperties);
        return object;
      },

      /**
       * Realises an object's group transformation on it
       * @private
       * @param {fabric.Object} [instance] the object to transform (gets mutated)
       * @returns the original values of instance which were changed
       */
      _realizeGroupTransformOnObject: function (instance) {
        if (
          instance.group &&
          instance.group.type === 'activeSelection' &&
          this._activeObject === instance.group
        ) {
          var layoutProps = [
            'angle',
            'flipX',
            'flipY',
            'left',
            'scaleX',
            'scaleY',
            'skewX',
            'skewY',
            'top',
          ];
          //Copy all the positionally relevant properties across now
          var originalValues = {};
          layoutProps.forEach(function (prop) {
            originalValues[prop] = instance[prop];
          });
          fabric.util.addTransformToObject(
            instance,
            this._activeObject.calcOwnMatrix()
          );
          return originalValues;
        } else {
          return null;
        }
      },

      /**
       * @private
       */
      _setSVGObject: function (markup, instance, reviver) {
        //If the object is in a selection group, simulate what would happen to that
        //object when the group is deselected
        var originalProperties = this._realizeGroupTransformOnObject(instance);
        this.callSuper('_setSVGObject', markup, instance, reviver);
        originalProperties && instance.set(originalProperties);
      },

      setViewportTransform: function (vpt) {
        if (
          this.renderOnAddRemove &&
          this._activeObject &&
          this._activeObject.isEditing
        ) {
          this._activeObject.clearContextTop();
        }
        fabric.StaticCanvas.prototype.setViewportTransform.call(this, vpt);
      },
    }
  );

  // copying static properties manually to work around Opera's bug,
  // where "prototype" property is enumerable and overrides existing prototype
  for (var prop in fabric.StaticCanvas) {
    if (prop !== 'prototype') {
      fabric.Canvas[prop] = fabric.StaticCanvas[prop];
    }
  }
})(typeof exports !== 'undefined' ? exports : window);
