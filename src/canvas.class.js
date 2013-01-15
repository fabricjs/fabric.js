(function() {

  var extend = fabric.util.object.extend,
      getPointer = fabric.util.getPointer,
      addListener = fabric.util.addListener,
      removeListener = fabric.util.removeListener,
      degreesToRadians = fabric.util.degreesToRadians,
      radiansToDegrees = fabric.util.radiansToDegrees,
      cursorMap = {
        'tr': 'ne-resize',
        'br': 'se-resize',
        'bl': 'sw-resize',
        'tl': 'nw-resize',
        'ml': 'w-resize',
        'mt': 'n-resize',
        'mr': 'e-resize',
        'mb': 's-resize'
      },

      sqrt = Math.sqrt,
      atan2 = Math.atan2,
      abs = Math.abs,
      min = Math.min,
      max = Math.max,

      STROKE_OFFSET = 0.5;

  /**
   * Canvas class
   * @class fabric.Canvas
   * @constructor
   * @extends fabric.StaticCanvas
   * @param {HTMLElement | String} el &lt;canvas> element to initialize instance on
   * @param {Object} [options] Options object
   */
  fabric.Canvas = function(el, options) {
    options || (options = { });

    this._initStatic(el, options);
    this._initInteractive();
    this._createCacheCanvas();

    fabric.Canvas.activeInstance = this;
  };

  function ProtoProxy(){ }
  ProtoProxy.prototype = fabric.StaticCanvas.prototype;
  fabric.Canvas.prototype = new ProtoProxy();

  var InteractiveMethods = /** @scope fabric.Canvas.prototype */ {

    /**
     * When true, objects can be transformed by one side (unproportionally)
     * @property
     * @type Boolean
     */
    uniScaleTransform:      false,

    /**
     * When true, objects use center point as the origin of transformation
     * @property
     * @type Boolean
     */
    centerTransform:        false,

    /**
     * Indicates that canvas is interactive. This property should not be changed.
     * @property
     * @type Boolean
     */
    interactive:            true,

    /**
     * Indicates whether group selection should be enabled
     * @property
     * @type Boolean
     */
    selection:              true,

    /**
     * Color of selection
     * @property
     * @type String
     */
    selectionColor:         'rgba(100, 100, 255, 0.3)', // blue

    /**
     * Default dash array pattern
     * If not empty the selection border is dashed
     * @property
     * @type Array
     */
    selectionDashArray:      [ ],

    /**
     * Color of the border of selection (usually slightly darker than color of selection itself)
     * @property
     * @type String
     */
    selectionBorderColor:   'rgba(255, 255, 255, 0.3)',

    /**
     * Width of a line used in object/group selection
     * @property
     * @type Number
     */
    selectionLineWidth:     1,

    /**
     * Color of the line used in free drawing mode
     * @property
     * @type String
     */
    freeDrawingColor:       'rgb(0, 0, 0)',

    /**
     * Width of a line used in free drawing mode
     * @property
     * @type Number
     */
    freeDrawingLineWidth:   1,

    /**
     * Default cursor value used when hovering over an object on canvas
     * @property
     * @type String
     */
    hoverCursor:            'move',

    /**
     * Default cursor value used when moving an object on canvas
     * @property
     * @type String
     */
    moveCursor:             'move',

    /**
     * Default cursor value used for the entire canvas
     * @property
     * @type String
     */
    defaultCursor:          'default',

    /**
     * Cursor value used during free drawing
     * @property
     * @type String
     */
    freeDrawingCursor:      'crosshair',

    /**
     * Cursor value used for rotation point
     * @property
     * @type String
     */
    rotationCursor:         'crosshair',

    /**
     * Default element class that's given to wrapper (div) element of canvas
     * @property
     * @type String
     */
    containerClass:        'canvas-container',

    /**
     * When true, object detection happens on per-pixel basis rather than on per-bounding-box
     * @property
     * @type Boolean
     */
    perPixelTargetFind:     false,

    /**
     * Number of pixels around target pixel to tolerate (consider active) during object detection
     * @property
     * @type Number
     */
    targetFindTolerance: 0,

    /**
     * @method _initInteractive
     * @private
     */
    _initInteractive: function() {
      this._currentTransform = null;
      this._groupSelector = null;
      this.freeDrawing = fabric.FreeDrawing && new fabric.FreeDrawing(this);
      this._initWrapperElement();
      this._createUpperCanvas();
      this._initEvents();
      this.calcOffset();
    },

    /**
     * Adds mouse listeners to  canvas
     * @method _initEvents
     * @private
     * See configuration documentation for more details.
     */
    _initEvents: function () {
      var _this = this;

      this._onMouseDown = function (e) {
        _this.__onMouseDown(e);

        addListener(fabric.document, 'mouseup', _this._onMouseUp);
        fabric.isTouchSupported && addListener(fabric.document, 'touchend', _this._onMouseUp);

        addListener(fabric.document, 'mousemove', _this._onMouseMove);
        fabric.isTouchSupported && addListener(fabric.document, 'touchmove', _this._onMouseMove);

        removeListener(_this.upperCanvasEl, 'mousemove', _this._onMouseMove);
        fabric.isTouchSupported && removeListener(_this.upperCanvasEl, 'touchmove', _this._onMouseMove);
      };

      this._onMouseUp = function (e) {
        _this.__onMouseUp(e);

        removeListener(fabric.document, 'mouseup', _this._onMouseUp);
        fabric.isTouchSupported && removeListener(fabric.document, 'touchend', _this._onMouseUp);

        removeListener(fabric.document, 'mousemove', _this._onMouseMove);
        fabric.isTouchSupported && removeListener(fabric.document, 'touchmove', _this._onMouseMove);

        addListener(_this.upperCanvasEl, 'mousemove', _this._onMouseMove);
        fabric.isTouchSupported && addListener(_this.upperCanvasEl, 'touchmove', _this._onMouseMove);
      };

      this._onMouseMove = function (e) {
        e.preventDefault && e.preventDefault();
        _this.__onMouseMove(e);
      };

      this._onResize = function () {
        _this.calcOffset();
      };


      addListener(fabric.window, 'resize', this._onResize);

      if (fabric.isTouchSupported) {
        addListener(this.upperCanvasEl, 'touchstart', this._onMouseDown);
        addListener(this.upperCanvasEl, 'touchmove', this._onMouseMove);

        if (typeof Event !== 'undefined' && 'add' in Event) {
          Event.add(this.upperCanvasEl, 'gesture', function(e, s) {
            _this.__onTransformGesture(e, s);
          });
        }
      }
      else {
        addListener(this.upperCanvasEl, 'mousedown', this._onMouseDown);
        addListener(this.upperCanvasEl, 'mousemove', this._onMouseMove);
      }
    },

    /**
     * Method that defines the actions when mouse is released on canvas.
     * The method resets the currentTransform parameters, store the image corner
     * position in the image object and render the canvas on top.
     * @method __onMouseUp
     * @param {Event} e Event object fired on mouseup
     *
     */
    __onMouseUp: function (e) {

      var target;

      if (this.isDrawingMode && this._isCurrentlyDrawing) {
        this.freeDrawing._finalizeAndAddPath();
        this.fire('mouse:up', { e: e });
        return;
      }

      if (this._currentTransform) {

        var transform = this._currentTransform;

        target = transform.target;
        if (target._scaling) {
          target._scaling = false;
        }

        // determine the new coords everytime the image changes its position
        var i = this._objects.length;
        while (i--) {
          this._objects[i].setCoords();
        }

        target.isMoving = false;

        // only fire :modified event if target coordinates were changed during mousedown-mouseup
        if (this.stateful && target.hasStateChanged()) {
          this.fire('object:modified', { target: target });
          target.fire('modified');
        }

        if (this._previousOriginX) {
          this._adjustPosition(this._currentTransform.target, this._previousOriginX);
          this._previousOriginX = null;
        }
      }

      this._currentTransform = null;

      if (this._groupSelector) {
        // group selection was completed, determine its bounds
        this._findSelectedObjects(e);
      }
      var activeGroup = this.getActiveGroup();
      if (activeGroup) {
        activeGroup.setObjectsCoords();
        activeGroup.set('isMoving', false);
        this._setCursor(this.defaultCursor);
      }

      // clear selection
      this._groupSelector = null;
      this.renderAll();

      this._setCursorFromEvent(e, target);

      // fix for FF
      this._setCursor('');

      var _this = this;
      setTimeout(function () {
        _this._setCursorFromEvent(e, target);
      }, 50);

      this.fire('mouse:up', { target: target, e: e });
      target && target.fire('mouseup', { e: e });
    },

    /**
     * Method that defines the actions when mouse is clic ked on canvas.
     * The method inits the currentTransform parameters and renders all the
     * canvas so the current image can be placed on the top canvas and the rest
     * in on the container one.
     * @method __onMouseDown
     * @param e {Event} Event object fired on mousedown
     *
     */
    __onMouseDown: function (e) {

      var pointer;

      // accept only left clicks
      var isLeftClick  = 'which' in e ? e.which === 1 : e.button === 1;
      if (!isLeftClick && !fabric.isTouchSupported) return;

      if (this.isDrawingMode) {
        pointer = this.getPointer(e);
        this.freeDrawing._prepareForDrawing(pointer);

        // capture coordinates immediately;
        // this allows to draw dots (when movement never occurs)
        this.freeDrawing._captureDrawingPath(pointer);

        this.fire('mouse:down', { e: e });
        return;
      }

      // ignore if some object is being transformed at this moment
      if (this._currentTransform) return;

      var target = this.findTarget(e), corner;
      pointer = this.getPointer(e);

      if (this._shouldClearSelection(e)) {
        this._groupSelector = {
          ex: pointer.x,
          ey: pointer.y,
          top: 0,
          left: 0
        };
        this.deactivateAllWithDispatch();
      }
      else {
        // determine if it's a drag or rotate case
        this.stateful && target.saveState();

        if ((corner = target._findTargetCorner(e, this._offset))) {
          this.onBeforeScaleRotate(target);
        }

        if (this._shouldHandleGroupLogic(e, target)) {
          this._handleGroupLogic(e, target);
          target = this.getActiveGroup();
        }
        else {
          if (target !== this.getActiveGroup()) {
            this.deactivateAll();
          }
          this.setActiveObject(target, e);
        }

        this._setupCurrentTransform(e, target);
      }
      // we must renderAll so that active image is placed on the top canvas
      this.renderAll();

      this.fire('mouse:down', { target: target, e: e });
      target && target.fire('mousedown', { e: e });

      // center origin when rotating
      if (corner === 'mtr') {
        this._previousOriginX = this._currentTransform.target.originX;
        this._adjustPosition(this._currentTransform.target, 'center');
        this._currentTransform.left = this._currentTransform.target.left;
        this._currentTransform.top = this._currentTransform.target.top;
      }
    },

    /**
     * @method _shouldHandleGroupLogic
     * @param e {Event}
     * @param target {fabric.Object}
     * @return {Boolean}
     */
    _shouldHandleGroupLogic: function(e, target) {
      var activeObject = this.getActiveObject();
      return e.shiftKey &&
            (this.getActiveGroup() || (activeObject && activeObject !== target))
            && this.selection;
    },

    /**
      * Method that defines the actions when mouse is hovering the canvas.
      * The currentTransform parameter will definde whether the user is rotating/scaling/translating
      * an image or neither of them (only hovering). A group selection is also possible and would cancel
      * all any other type of action.
      * In case of an image transformation only the top canvas will be rendered.
      * @method __onMouseMove
      * @param e {Event} Event object fired on mousemove
      *
      */
    __onMouseMove: function (e) {

      var target, pointer;

      if (this.isDrawingMode) {
        if (this._isCurrentlyDrawing) {
          pointer = this.getPointer(e);
          this.freeDrawing._captureDrawingPath(pointer);

          // redraw curve
          // clear top canvas
          this.clearContext(this.contextTop);
          this.freeDrawing._render(this.contextTop);
        }
        this.upperCanvasEl.style.cursor = this.freeDrawingCursor;
        this.fire('mouse:move', { e: e });
        return;
      }

      var groupSelector = this._groupSelector;

      // We initially clicked in an empty area, so we draw a box for multiple selection.
      if (groupSelector !== null) {
        pointer = getPointer(e);

        groupSelector.left = pointer.x - this._offset.left - groupSelector.ex;
        groupSelector.top = pointer.y - this._offset.top - groupSelector.ey;
        this.renderTop();
      }
      else if (!this._currentTransform) {

        // alias style to elimintate unnecessary lookup
        var style = this.upperCanvasEl.style;

        // Here we are hovering the canvas then we will determine
        // what part of the pictures we are hovering to change the caret symbol.
        // We won't do that while dragging or rotating in order to improve the
        // performance.
        target = this.findTarget(e);

        if (!target) {
          // image/text was hovered-out from, we remove its borders
          for (var i = this._objects.length; i--; ) {
            if (this._objects[i] && !this._objects[i].active) {
              this._objects[i].setActive(false);
            }
          }
          style.cursor = this.defaultCursor;
        }
        else {
          // set proper cursor
          this._setCursorFromEvent(e, target);
        }
      }
      else {
        // object is being transformed (scaled/rotated/moved/etc.)
        pointer = getPointer(e);

        var x = pointer.x,
            y = pointer.y;

        this._currentTransform.target.isMoving = true;

        var t = this._currentTransform, reset = false;
        if (
            (t.action === 'scale' || t.action === 'scaleX' || t.action === 'scaleY')
            &&
            (
              // Switch from a normal resize to center-based
              (e.altKey && (t.originX !== 'center' || t.originY !== 'center'))
              ||
              // Switch from center-based resize to normal one
              (!e.altKey && t.originX === 'center' && t.originY === 'center')
            )
           ) {
          this._resetCurrentTransform(e);
          reset = true;
        }

        if (this._currentTransform.action === 'rotate') {
          this._rotateObject(x, y);

          this.fire('object:rotating', {
            target: this._currentTransform.target
          });
          this._currentTransform.target.fire('rotating');
        }
        else if (this._currentTransform.action === 'scale') {
          // rotate object only if shift key is not pressed
          // and if it is not a group we are transforming

          // TODO
          /*if (!e.shiftKey) {
            this._rotateObject(x, y);

            this.fire('object:rotating', {
              target: this._currentTransform.target,
              e: e
            });
            this._currentTransform.target.fire('rotating');
          }*/

          // if (!this._currentTransform.target.hasRotatingPoint) {
          //   this._scaleObject(x, y);
          //   this.fire('object:scaling', {
          //     target: this._currentTransform.target
          //   });
          //   this._currentTransform.target.fire('scaling');
          // }

          if (e.shiftKey || this.uniScaleTransform) {
            this._currentTransform.currentAction = 'scale';
            this._scaleObject(x, y);
          }
          else {
            if (!reset && t.currentAction === 'scale') {
              // Switch from a normal resize to proportional
              this._resetCurrentTransform(e);
            }

            this._currentTransform.currentAction = 'scaleEqually';
            this._scaleObject(x, y, 'equally');
          }

          this.fire('object:scaling', {
            target: this._currentTransform.target,
            e: e
          });
        }
        // else if (this._currentTransform.action === 'scale') {
        //   this._scaleObject(x, y);
        //   this.fire('object:scaling', {
        //     target: this._currentTransform.target
        //   });
        //   this._currentTransform.target.fire('scaling');
        // }
        else if (this._currentTransform.action === 'scaleX') {
          this._scaleObject(x, y, 'x');

          this.fire('object:scaling', {
            target: this._currentTransform.target,
            e: e
          });
          this._currentTransform.target.fire('scaling', { e: e });
        }
        else if (this._currentTransform.action === 'scaleY') {
          this._scaleObject(x, y, 'y');

          this.fire('object:scaling', {
            target: this._currentTransform.target,
            e: e
          });
          this._currentTransform.target.fire('scaling', { e: e });
        }
        else {
          this._translateObject(x, y);

          this.fire('object:moving', {
            target: this._currentTransform.target,
            e: e
          });

          this._setCursor(this.moveCursor);

          this._currentTransform.target.fire('moving', { e: e });
        }
        // only commit here. when we are actually moving the pictures
        this.renderAll();
      }
      this.fire('mouse:move', { target: target, e: e });
      target && target.fire('mousemove', { e: e });
    },

    /**
     * Resets the current transform to its original values and chooses the type of resizing based on the event
     * @method _resetCurrentTransform
     * @param e {Event} Event object fired on mousemove
     */
    _resetCurrentTransform: function(e) {
      var t = this._currentTransform;
      t.target.set('scaleX', t.original.scaleX);
      t.target.set('scaleY', t.original.scaleY);
      t.target.set('left', t.original.left);
      t.target.set('top', t.original.top);

      if (e.altKey || this.centerTransform) {
        if (t.originX !== 'center') {
          if (t.originX === 'right') {
            t.mouseXSign = -1;
          }
          else {
            t.mouseXSign = 1;
          }
        }
        if (t.originY !== 'center') {
          if (t.originY === 'bottom') {
            t.mouseYSign = -1;
          }
          else {
            t.mouseYSign = 1;
          }
        }

        t.originX = 'center';
        t.originY = 'center';
      }
      else {
        t.originX = t.original.originX;
        t.originY = t.original.originY;
      }
    },

    /**
     * Applies one implementation of 'point inside polygon' algorithm
     * @method containsPoint
     * @param e { Event } event object
     * @param target { fabric.Object } object to test against
     * @return {Boolean} true if point contains within area of given object
     */
    containsPoint: function (e, target) {
      var pointer = this.getPointer(e),
          xy = this._normalizePointer(target, pointer),
          x = xy.x,
          y = xy.y;

      // http://www.geog.ubc.ca/courses/klink/gis.notes/ncgia/u32.html
      // http://idav.ucdavis.edu/~okreylos/TAship/Spring2000/PointInPolygon.html

      // we iterate through each object. If target found, return it.
      var iLines = target._getImageLines(target.oCoords),
          xpoints = target._findCrossPoints(x, y, iLines);

      // if xcount is odd then we clicked inside the object
      // For the specific case of square images xcount === 1 in all true cases
      if ((xpoints && xpoints % 2 === 1) || target._findTargetCorner(e, this._offset)) {
        return true;
      }
      return false;
    },

    /**
     * @private
     * @method _normalizePointer
     */
    _normalizePointer: function (object, pointer) {

      var activeGroup = this.getActiveGroup(),
          x = pointer.x,
          y = pointer.y;

      var isObjectInGroup = (
        activeGroup &&
        object.type !== 'group' &&
        activeGroup.contains(object)
      );

      if (isObjectInGroup) {
        x -= activeGroup.left;
        y -= activeGroup.top;
      }
      return { x: x, y: y };
    },

    /**
     * @private
     * @method _isTargetTransparent
     */
    _isTargetTransparent: function (target, x, y) {
      var cacheContext = this.contextCache;

      var hasBorders = target.hasBorders, transparentCorners = target.transparentCorners;
      target.hasBorders = target.transparentCorners = false;

      this._draw(cacheContext, target);

      target.hasBorders = hasBorders;
      target.transparentCorners = transparentCorners;

      // If tolerance is > 0 adjust start coords to take into account. If moves off Canvas fix to 0
      if (this.targetFindTolerance > 0) {
        if (x > this.targetFindTolerance) {
          x -= this.targetFindTolerance;
        }
        else {
          x = 0;
        }
        if (y > this.targetFindTolerance) {
          y -= this.targetFindTolerance;
        }
        else {
          y = 0;
        }
      }

      var isTransparent = true;
      var imageData = cacheContext.getImageData(
        x, y, (this.targetFindTolerance * 2) || 1, (this.targetFindTolerance * 2) || 1);

      // Split image data - for tolerance > 1, pixelDataSize = 4;
      for (var i = 3; i < imageData.data.length; i += 4) {
          var temp = imageData.data[i];
          isTransparent = temp <= 0;
          if (isTransparent === false) break; //Stop if colour found
      }

      imageData = null;
      this.clearContext(cacheContext);
      return isTransparent;
    },

    /**
     * @private
     * @method _shouldClearSelection
     */
    _shouldClearSelection: function (e) {
      var target = this.findTarget(e),
          activeGroup = this.getActiveGroup();
      return (
        !target || (
          target &&
          activeGroup &&
          !activeGroup.contains(target) &&
          activeGroup !== target &&
          !e.shiftKey
        )
      );
    },

    /**
     * @private
     * @method _setupCurrentTransform
     */
    _setupCurrentTransform: function (e, target) {
      var action = 'drag',
          corner,
          pointer = getPointer(e);

      corner = target._findTargetCorner(e, this._offset);
      if (corner) {
        action = (corner === 'ml' || corner === 'mr')
          ? 'scaleX'
          : (corner === 'mt' || corner === 'mb')
            ? 'scaleY'
            : corner === 'mtr'
              ? 'rotate'
              : 'scale';
      }

      var originX = "center", originY = "center";

      if (corner === 'ml' || corner === 'tl' || corner === 'bl') {
        originX = "right";
      }
      else if (corner === 'mr' || corner === 'tr' || corner === 'br') {
        originX = "left";
      }

      if (corner === 'tl' || corner === 'mt' || corner === 'tr') {
        originY = "bottom";
      }
      else if (corner === 'bl' || corner === 'mb' || corner === 'br') {
        originY = "top";
      }

      if (corner === 'mtr') {
        originX = 'center';
        originY = 'center';
      }

      // var center = target.getCenterPoint();
      this._currentTransform = {
        target: target,
        action: action,
        scaleX: target.scaleX,
        scaleY: target.scaleY,
        offsetX: pointer.x - target.left,
        offsetY: pointer.y - target.top,
        originX: originX,
        originY: originY,
        ex: pointer.x,
        ey: pointer.y,
        left: target.left,
        top: target.top,
        theta: degreesToRadians(target.angle),
        width: target.width * target.scaleX,
        mouseXSign: 1,
        mouseYSign: 1
      };

      this._currentTransform.original = {
        left: target.left,
        top: target.top,
        scaleX: target.scaleX,
        scaleY: target.scaleY,
        originX: originX,
        originY: originY
      };

      this._resetCurrentTransform(e);
    },

    /**
     * @private
     * @method _handleGroupLogic
     */
    _handleGroupLogic: function (e, target) {
      if (target === this.getActiveGroup()) {
        // if it's a group, find target again, this time skipping group
        target = this.findTarget(e, true);
        // if even object is not found, bail out
        if (!target || target.isType('group')) {
          return;
        }
      }
      var activeGroup = this.getActiveGroup();
      if (activeGroup) {
        if (activeGroup.contains(target)) {
          activeGroup.removeWithUpdate(target);
          this._resetObjectTransform(activeGroup);
          target.setActive(false);
          if (activeGroup.size() === 1) {
            // remove group alltogether if after removal it only contains 1 object
            this.discardActiveGroup();
          }
        }
        else {
          activeGroup.addWithUpdate(target);
          this._resetObjectTransform(activeGroup);
        }
        this.fire('selection:created', { target: activeGroup, e: e });
        activeGroup.setActive(true);
      }
      else {
        // group does not exist
        if (this._activeObject) {
          // only if there's an active object
          if (target !== this._activeObject) {
            // and that object is not the actual target
            var group = new fabric.Group([ this._activeObject, target ]);
            this.setActiveGroup(group);
            activeGroup = this.getActiveGroup();
          }
        }
        // activate target object in any case
        target.setActive(true);
      }

      if (activeGroup) {
        activeGroup.saveCoords();
      }
    },

    /**
     * Translates object by "setting" its left/top
     * @method _translateObject
     * @param x {Number} pointer's x coordinate
     * @param y {Number} pointer's y coordinate
     */
    _translateObject: function (x, y) {
      var target = this._currentTransform.target;

      if (!target.get('lockMovementX')) {
        target.set('left', x - this._currentTransform.offsetX);
      }
      if (!target.get('lockMovementY')) {
        target.set('top', y - this._currentTransform.offsetY);
      }
    },

    /**
     * Scales object by invoking its scaleX/scaleY methods
     * @method _scaleObject
     * @param x {Number} pointer's x coordinate
     * @param y {Number} pointer's y coordinate
     * @param by {String} Either 'x' or 'y' - specifies dimension constraint by which to scale an object.
     *                    When not provided, an object is scaled by both dimensions equally
     */
    _scaleObject: function (x, y, by) {
      var t = this._currentTransform,
          offset = this._offset,
          target = t.target;

      var lockScalingX = target.get('lockScalingX'),
          lockScalingY = target.get('lockScalingY');

      if (lockScalingX && lockScalingY) return;

      // Get the constraint point
      var constraintPosition = target.translateToOriginPoint(target.getCenterPoint(), t.originX, t.originY);
      var localMouse = target.toLocalPoint(new fabric.Point(x - offset.left, y - offset.top), t.originX, t.originY);

      if (t.originX === 'right') {
        localMouse.x *= -1;
      }
      else if (t.originX === 'center') {
        localMouse.x *= t.mouseXSign * 2;

        if (localMouse.x < 0) {
          t.mouseXSign = -t.mouseXSign;
        }
      }

      if (t.originY === 'bottom') {
        localMouse.y *= -1;
      }
      else if (t.originY === 'center') {
        localMouse.y *= t.mouseYSign * 2;

        if (localMouse.y < 0) {
          t.mouseYSign = -t.mouseYSign;
        }
      }

      // Actually scale the object
      var newScaleX = target.scaleX, newScaleY = target.scaleY;
      if (by === 'equally' && !lockScalingX && !lockScalingY) {
        var dist = localMouse.y + localMouse.x;
        var lastDist = (target.height) * t.original.scaleY +
                       (target.width) * t.original.scaleX +
                       (target.padding * 2) -
                       (target.strokeWidth * 2) + 1 /* additional offset needed probably due to subpixel rendering, and avoids jerk when scaling an object */;

        // We use t.scaleX/Y instead of target.scaleX/Y because the object may have a min scale and we'll loose the proportions
        newScaleX = t.original.scaleX * dist/lastDist;
        newScaleY = t.original.scaleY * dist/lastDist;

        target.set('scaleX', newScaleX);
        target.set('scaleY', newScaleY);
      }
      else if (!by) {
        newScaleX = localMouse.x/(target.width+target.padding);
        newScaleY = localMouse.y/(target.height+target.padding);

        lockScalingX || target.set('scaleX', newScaleX);
        lockScalingY || target.set('scaleY', newScaleY);
      }
      else if (by === 'x' && !target.get('lockUniScaling')) {
        newScaleX = localMouse.x/(target.width+target.padding);
        lockScalingX || target.set('scaleX', newScaleX);
      }
      else if (by === 'y' && !target.get('lockUniScaling')) {
        newScaleY = localMouse.y/(target.height+target.padding);
        lockScalingY || target.set('scaleY', newScaleY);
      }

      // Check if we flipped
      if (newScaleX < 0)
      {
        if (t.originX === 'left')
          t.originX = 'right';
        else if (t.originX === 'right')
          t.originX = 'left';
      }

      if (newScaleY < 0)
      {
        if (t.originY === 'top')
          t.originY = 'bottom';
        else if (t.originY === 'bottom')
          t.originY = 'top';
      }

      // Make sure the constraints apply
      target.setPositionByOrigin(constraintPosition, t.originX, t.originY);
    },

    /**
     * Rotates object by invoking its rotate method
     * @method _rotateObject
     * @param x {Number} pointer's x coordinate
     * @param y {Number} pointer's y coordinate
     */
    _rotateObject: function (x, y) {

      var t = this._currentTransform,
          o = this._offset;

      if (t.target.get('lockRotation')) return;

      var lastAngle = atan2(t.ey - t.top - o.top, t.ex - t.left - o.left),
          curAngle = atan2(y - t.top - o.top, x - t.left - o.left);

      t.target.angle = radiansToDegrees(curAngle - lastAngle + t.theta);
    },

    /**
     * @method _setCursor
     */
    _setCursor: function (value) {
      this.upperCanvasEl.style.cursor = value;
    },

    /**
    * @private
    * @method _resetObjectTransform:
    */
    _resetObjectTransform: function (target) {
      target.scaleX = 1;
      target.scaleY = 1;
      target.setAngle(0);
    },

    /**
     * Sets the cursor depending on where the canvas is being hovered.
     * Note: very buggy in Opera
     * @method _setCursorFromEvent
     * @param e {Event} Event object
     * @param target {Object} Object that the mouse is hovering, if so.
     */
    _setCursorFromEvent: function (e, target) {
      var s = this.upperCanvasEl.style;
      if (!target) {
        s.cursor = this.defaultCursor;
        return false;
      }
      else {
        var activeGroup = this.getActiveGroup();
        // only show proper corner when group selection is not active
        var corner = !!target._findTargetCorner
                      && (!activeGroup || !activeGroup.contains(target))
                      && target._findTargetCorner(e, this._offset);

        if (!corner) {
          s.cursor = this.hoverCursor;
        }
        else {
          if (corner in cursorMap) {
            s.cursor = cursorMap[corner];
          } else if (corner === 'mtr' && target.hasRotatingPoint) {
            s.cursor = this.rotationCursor;
          } else {
            s.cursor = this.defaultCursor;
            return false;
          }
        }
      }
      return true;
    },

    /**
     * @method _drawSelection
     * @private
     */
    _drawSelection: function () {
      var ctx = this.contextTop,
          groupSelector = this._groupSelector,
          left = groupSelector.left,
          top = groupSelector.top,
          aleft = abs(left),
          atop = abs(top);

      ctx.fillStyle = this.selectionColor;

      ctx.fillRect(
        groupSelector.ex - ((left > 0) ? 0 : -left),
        groupSelector.ey - ((top > 0) ? 0 : -top),
        aleft,
        atop
      );

      ctx.lineWidth = this.selectionLineWidth;
      ctx.strokeStyle = this.selectionBorderColor;

      // selection border
      if (this.selectionDashArray.length > 1) {
        var px = groupSelector.ex + STROKE_OFFSET - ((left > 0) ? 0: aleft);
        var py = groupSelector.ey + STROKE_OFFSET - ((top > 0) ? 0: atop);
        ctx.beginPath();
        this.drawDashedLine(ctx, px, py, px+aleft, py, this.selectionDashArray);
        this.drawDashedLine(ctx, px, py+atop-1, px+aleft, py+atop-1, this.selectionDashArray);
        this.drawDashedLine(ctx, px, py, px, py+atop, this.selectionDashArray);
        this.drawDashedLine(ctx, px+aleft-1, py, px+aleft-1, py+atop, this.selectionDashArray);
        ctx.closePath();
        ctx.stroke();
      }
      else {
        ctx.strokeRect(
          groupSelector.ex + STROKE_OFFSET - ((left > 0) ? 0 : aleft),
          groupSelector.ey + STROKE_OFFSET - ((top > 0) ? 0 : atop),
          aleft,
          atop
        );
      }
    },

    /**
     * Draws a dashed line between two points
     *
     * This method is used to draw dashed line around selection area.
     * See <a href="http://stackoverflow.com/questions/4576724/dotted-stroke-in-canvas">dotted stroke in canvas</a>
     *
     * @method drawDashedLine
     * @param ctx {Canvas} context
     * @param x {Number} start x coordinate
     * @param y {Number} start y coordinate
     * @param x2 {Number} end x coordinate
     * @param y2 {Number} end y coordinate
     * @param da {Array} dash array pattern
     */
    drawDashedLine: function(ctx, x, y, x2, y2, da) {
      var dx = x2 - x,
          dy = y2 - y,
          len = sqrt(dx*dx + dy*dy),
          rot = atan2(dy, dx),
          dc = da.length,
          di = 0,
          draw = true;

      ctx.save();
      ctx.translate(x, y);
      ctx.moveTo(0, 0);
      ctx.rotate(rot);

      x = 0;
      while (len > x) {
        x += da[di++ % dc];
        if (x > len) {
          x = len;
        }
        ctx[draw ? 'lineTo' : 'moveTo'](x, 0);
        draw = !draw;
      }

      ctx.restore();
    },

    /**
     * @private
     * @method _findSelectedObjects
     */
    _findSelectedObjects: function (e) {
      var group = [ ],
          x1 = this._groupSelector.ex,
          y1 = this._groupSelector.ey,
          x2 = x1 + this._groupSelector.left,
          y2 = y1 + this._groupSelector.top,
          currentObject,
          selectionX1Y1 = new fabric.Point(min(x1, x2), min(y1, y2)),
          selectionX2Y2 = new fabric.Point(max(x1, x2), max(y1, y2));

      for (var i = 0, len = this._objects.length; i < len; ++i) {
        currentObject = this._objects[i];

        if (!currentObject) continue;

        if (currentObject.intersectsWithRect(selectionX1Y1, selectionX2Y2) ||
            currentObject.isContainedWithinRect(selectionX1Y1, selectionX2Y2)) {

          if (this.selection && currentObject.selectable) {
            currentObject.setActive(true);
            group.push(currentObject);
          }
        }
      }

      // do not create group for 1 element only
      if (group.length === 1) {
        this.setActiveObject(group[0], e);
      }
      else if (group.length > 1) {
        group = new fabric.Group(group);
        this.setActiveGroup(group);
        group.saveCoords();
        this.fire('selection:created', { target: group });
      }

      this.renderAll();
    },

    /**
     * Method that determines what object we are clicking on
     * @method findTarget
     * @param {Event} e mouse event
     * @param {Boolean} skipGroup when true, group is skipped and only objects are traversed through
     */
    findTarget: function (e, skipGroup) {

      var target,
          pointer = this.getPointer(e);

      if (this.controlsAboveOverlay &&
          this.lastRenderedObjectWithControlsAboveOverlay &&
          this.containsPoint(e, this.lastRenderedObjectWithControlsAboveOverlay) &&
          this.lastRenderedObjectWithControlsAboveOverlay._findTargetCorner(e, this._offset)) {
        target = this.lastRenderedObjectWithControlsAboveOverlay;
        return target;
      }

      // first check current group (if one exists)
      var activeGroup = this.getActiveGroup();
      if (activeGroup && !skipGroup && this.containsPoint(e, activeGroup)) {
        target = activeGroup;
        return target;
      }

      // then check all of the objects on canvas
      // Cache all targets where their bounding box contains point.
      var possibleTargets = [];
      for (var i = this._objects.length; i--; ) {
        if (this._objects[i] && this.containsPoint(e, this._objects[i])) {
          if (this.perPixelTargetFind || this._objects[i].perPixelTargetFind) {
            possibleTargets[possibleTargets.length] = this._objects[i];
          }
          else {
            target = this._objects[i];
            this.relatedTarget = target;
            break;
          }
        }
      }
      for (var j = 0, len = possibleTargets.length; j < len; j++) {
        pointer = this.getPointer(e);
        var isTransparent = this._isTargetTransparent(possibleTargets[j], pointer.x, pointer.y);
        if (!isTransparent) {
          target = possibleTargets[j];
          this.relatedTarget = target;
          break;
        }
      }
      if (target && target.selectable) {
        return target;
      }
    },

    /**
     * Returns pointer coordinates relative to canvas.
     * @method getPointer
     * @param {Event} e
     * @return {Object} object with "x" and "y" number values
     */
    getPointer: function (e) {
      var pointer = getPointer(e);
      return {
        x: pointer.x - this._offset.left,
        y: pointer.y - this._offset.top
      };
    },

    /**
     * @private
     * @method _createUpperCanvas
     * @param {HTMLElement|String} canvasEl Canvas element
     * @throws {CANVAS_INIT_ERROR} If canvas can not be initialized
     */
    _createUpperCanvas: function () {
      this.upperCanvasEl = this._createCanvasElement();
      this.upperCanvasEl.className = 'upper-canvas';

      this.wrapperEl.appendChild(this.upperCanvasEl);

      this._applyCanvasStyle(this.upperCanvasEl);
      this.contextTop = this.upperCanvasEl.getContext('2d');
    },

    /**
     * @private
     * @method _createCacheCanvas
     */
    _createCacheCanvas: function () {
      this.cacheCanvasEl = this._createCanvasElement();
      this.cacheCanvasEl.setAttribute('width', this.width);
      this.cacheCanvasEl.setAttribute('height', this.height);
      this.contextCache = this.cacheCanvasEl.getContext('2d');
    },

    /**
     * @private
     * @method _initWrapperElement
     * @param {Number} width
     * @param {Number} height
     */
    _initWrapperElement: function () {
      this.wrapperEl = fabric.util.wrapElement(this.lowerCanvasEl, 'div', {
        'class': this.containerClass
      });
      fabric.util.setStyle(this.wrapperEl, {
        width: this.getWidth() + 'px',
        height: this.getHeight() + 'px',
        position: 'relative'
      });
      fabric.util.makeElementUnselectable(this.wrapperEl);
    },

    /**
     * @private
     * @method _applyCanvasStyle
     * @param {Element} element
     */
    _applyCanvasStyle: function (element) {
      var width = this.getWidth() || element.width,
          height = this.getHeight() || element.height;

      fabric.util.setStyle(element, {
        position: 'absolute',
        width: width + 'px',
        height: height + 'px',
        left: 0,
        top: 0
      });
      element.width = width;
      element.height = height;
      fabric.util.makeElementUnselectable(element);
    },

    /**
     * Returns context of canvas where object selection is drawn
     * @method getSelectionContext
     * @return {CanvasRenderingContext2D}
     */
    getSelectionContext: function() {
      return this.contextTop;
    },

    /**
     * Returns &lt;canvas> element on which object selection is drawn
     * @method getSelectionElement
     * @return {HTMLCanvasElement}
     */
    getSelectionElement: function () {
      return this.upperCanvasEl;
    },

    /**
     * Sets given object as active
     * @method setActiveObject
     * @param object {fabric.Object} Object to set as an active one
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    setActiveObject: function (object, e) {
      if (this._activeObject) {
        this._activeObject.setActive(false);
      }
      this._activeObject = object;
      object.setActive(true);

      this.renderAll();

      this.fire('object:selected', { target: object, e: e });
      object.fire('selected', { e: e });
      return this;
    },

    /**
     * Returns currently active object
     * @method getActiveObject
     * @return {fabric.Object} active object
     */
    getActiveObject: function () {
      return this._activeObject;
    },

    /**
     * Discards currently active object
     * @method discardActiveObject
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    discardActiveObject: function () {
      if (this._activeObject) {
        this._activeObject.setActive(false);
      }
      this._activeObject = null;
      return this;
    },

    /**
     * Sets active group to a speicified one
     * @method setActiveGroup
     * @param {fabric.Group} group Group to set as a current one
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    setActiveGroup: function (group) {
      this._activeGroup = group;
      if (group) {
        group.canvas = this;
        group.setActive(true);
      }
      return this;
    },

    /**
     * Returns currently active group
     * @method getActiveGroup
     * @return {fabric.Group} Current group
     */
    getActiveGroup: function () {
      return this._activeGroup;
    },

    /**
     * Removes currently active group
     * @method discardActiveGroup
     * @return {fabric.Canvas} thisArg
     */
    discardActiveGroup: function () {
      var g = this.getActiveGroup();
      if (g) {
        g.destroy();
      }
      return this.setActiveGroup(null);
    },

    /**
     * Deactivates all objects by calling their setActive(false)
     * @method deactivateAll
     * @return {fabric.Canvas} thisArg
     */
    deactivateAll: function () {
      var allObjects = this.getObjects(),
          i = 0,
          len = allObjects.length;
      for ( ; i < len; i++) {
        allObjects[i].setActive(false);
      }
      this.discardActiveGroup();
      this.discardActiveObject();
      return this;
    },

    /**
     * Deactivates all objects and dispatches appropriate events
     * @method deactivateAllWithDispatch
     * @return {fabric.Canvas} thisArg
     */
    deactivateAllWithDispatch: function () {
      var activeObject = this.getActiveGroup() || this.getActiveObject();
      if (activeObject) {
        this.fire('before:selection:cleared', { target: activeObject });
      }
      this.deactivateAll();
      if (activeObject) {
        this.fire('selection:cleared');
      }
      return this;
    },

    /**
     * @private
     * @method _adjustPosition
     * @param obj
     * @param {String} to One of left, center, right
     */
    _adjustPosition: function(obj, to) {

      var angle = fabric.util.degreesToRadians(obj.angle);

      var hypotHalf = obj.getWidth() / 2;
      var xHalf = Math.cos(angle) * hypotHalf;
      var yHalf = Math.sin(angle) * hypotHalf;

      var hypotFull = obj.getWidth();
      var xFull = Math.cos(angle) * hypotFull;
      var yFull = Math.sin(angle) * hypotFull;

      if (obj.originX === 'center' && to === 'left' ||
          obj.originX === 'right' && to === 'center') {
        // move half left
        obj.left -= xHalf;
        obj.top -= yHalf;
      }
      else if (obj.originX === 'left' && to === 'center' ||
               obj.originX === 'center' && to === 'right') {
        // move half right
        obj.left += xHalf;
        obj.top += yHalf;
      }
      else if (obj.originX === 'left' && to === 'right') {
        // move full right
        obj.left += xFull;
        obj.top += yFull;
      }
      else if (obj.originX === 'right' && to === 'left') {
        // move full left
        obj.left -= xFull;
        obj.top -= yFull;
      }

      obj.setCoords();
      obj.originX = to;
    }
  };

  fabric.Canvas.prototype.toString = fabric.StaticCanvas.prototype.toString;
  extend(fabric.Canvas.prototype, InteractiveMethods);

  // iterating manually to workaround Opera's bug
  // where "prototype" property is enumerable and overrides existing prototype
  for (var prop in fabric.StaticCanvas) {
    if (prop !== 'prototype') {
      fabric.Canvas[prop] = fabric.StaticCanvas[prop];
    }
  }

  if (fabric.isTouchSupported) {
    fabric.Canvas.prototype._setCursorFromEvent = function() { };
  }

  /**
   * @class fabric.Element
   * @alias fabric.Canvas
   * @deprecated Use {@link fabric.Canvas} instead.
   * @constructor
   */
  fabric.Element = fabric.Canvas;
})();
