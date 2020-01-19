(function() {

  var getPointer = fabric.util.getPointer,
      degreesToRadians = fabric.util.degreesToRadians,
      radiansToDegrees = fabric.util.radiansToDegrees,
      atan2 = Math.atan2,
      abs = Math.abs,
      supportLineDash = fabric.StaticCanvas.supports('setLineDash'),

      STROKE_OFFSET = 0.5;

  /**
   * Canvas class
   * @class fabric.Canvas
   * @extends fabric.StaticCanvas
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-1#canvas}
   * @see {@link fabric.Canvas#initialize} for constructor definition
   *
   * @fires object:modified at the end of a transform or any change when statefull is true
   * @fires object:rotated at the end of a rotation transform
   * @fires object:scaled at the end of a scale transform
   * @fires object:moved at the end of translation transform
   * @fires object:skewed at the end of a skew transform
   * @fires object:rotating while an object is being rotated from the control
   * @fires object:scaling while an object is being scaled by controls
   * @fires object:moving while an object is being dragged
   * @fires object:skewing while an object is being skewed from the controls
   * @fires object:selected this event is deprecated. use selection:created
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
   * @fires drop
   * @fires after:render at the end of the render process, receives the context in the callback
   * @fires before:render at start the render process, receives the context in the callback
   *
   */
  fabric.Canvas = fabric.util.createClass(fabric.StaticCanvas, /** @lends fabric.Canvas.prototype */ {

    /**
     * Constructor
     * @param {HTMLElement | String} el &lt;canvas> element to initialize instance on
     * @param {Object} [options] Options object
     * @return {Object} thisArg
     */
    initialize: function(el, options) {
      options || (options = { });
      this.renderAndResetBound = this.renderAndReset.bind(this);
      this.requestRenderAllBound = this.requestRenderAll.bind(this);
      this._initStatic(el, options);
      this._initInteractive();
      this._createCacheCanvas();
    },

    /**
     * When true, objects can be transformed by one side (unproportionally)
     * @type Boolean
     * @default
     */
    uniScaleTransform:      false,

    /**
     * Indicates which key enable unproportional scaling
     * values: 'altKey', 'shiftKey', 'ctrlKey'.
     * If `null` or 'none' or any other string that is not a modifier key
     * feature is disabled feature disabled.
     * @since 1.6.2
     * @type String
     * @default
     */
    uniScaleKey:           'shiftKey',

    /**
     * When true, objects use center point as the origin of scale transformation.
     * <b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).
     * @since 1.3.4
     * @type Boolean
     * @default
     */
    centeredScaling:        false,

    /**
     * When true, objects use center point as the origin of rotate transformation.
     * <b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).
     * @since 1.3.4
     * @type Boolean
     * @default
     */
    centeredRotation:       false,

    /**
     * Indicates which key enable centered Transform
     * values: 'altKey', 'shiftKey', 'ctrlKey'.
     * If `null` or 'none' or any other string that is not a modifier key
     * feature is disabled feature disabled.
     * @since 1.6.2
     * @type String
     * @default
     */
    centeredKey:           'altKey',

    /**
     * Indicates which key enable alternate action on corner
     * values: 'altKey', 'shiftKey', 'ctrlKey'.
     * If `null` or 'none' or any other string that is not a modifier key
     * feature is disabled feature disabled.
     * @since 1.6.2
     * @type String
     * @default
     */
    altActionKey:           'shiftKey',

    /**
     * Indicates that canvas is interactive. This property should not be changed.
     * @type Boolean
     * @default
     */
    interactive:            true,

    /**
     * Indicates whether group selection should be enabled
     * @type Boolean
     * @default
     */
    selection:              true,

    /**
     * Indicates which key or keys enable multiple click selection
     * Pass value as a string or array of strings
     * values: 'altKey', 'shiftKey', 'ctrlKey'.
     * If `null` or empty or containing any other string that is not a modifier key
     * feature is disabled.
     * @since 1.6.2
     * @type String|Array
     * @default
     */
    selectionKey:           'shiftKey',

    /**
     * Indicates which key enable alternative selection
     * in case of target overlapping with active object
     * values: 'altKey', 'shiftKey', 'ctrlKey'.
     * For a series of reason that come from the general expectations on how
     * things should work, this feature works only for preserveObjectStacking true.
     * If `null` or 'none' or any other string that is not a modifier key
     * feature is disabled.
     * @since 1.6.5
     * @type null|String
     * @default
     */
    altSelectionKey:           null,

    /**
     * Color of selection
     * @type String
     * @default
     */
    selectionColor:         'rgba(100, 100, 255, 0.3)', // blue

    /**
     * Default dash array pattern
     * If not empty the selection border is dashed
     * @type Array
     */
    selectionDashArray:     [],

    /**
     * Color of the border of selection (usually slightly darker than color of selection itself)
     * @type String
     * @default
     */
    selectionBorderColor:   'rgba(255, 255, 255, 0.3)',

    /**
     * Width of a line used in object/group selection
     * @type Number
     * @default
     */
    selectionLineWidth:     1,

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
    hoverCursor:            'move',

    /**
     * Default cursor value used when moving an object on canvas
     * @type String
     * @default
     */
    moveCursor:             'move',

    /**
     * Default cursor value used for the entire canvas
     * @type String
     * @default
     */
    defaultCursor:          'default',

    /**
     * Cursor value used during free drawing
     * @type String
     * @default
     */
    freeDrawingCursor:      'crosshair',

    /**
     * Cursor value used for rotation point
     * @type String
     * @default
     */
    rotationCursor:         'crosshair',

    /**
     * Cursor value used for disabled elements ( corners with disabled action )
     * @type String
     * @since 2.0.0
     * @default
     */
    notAllowedCursor:         'not-allowed',

    /**
     * Default element class that's given to wrapper (div) element of canvas
     * @type String
     * @default
     */
    containerClass:         'canvas-container',

    /**
     * When true, object detection happens on per-pixel basis rather than on per-bounding-box
     * @type Boolean
     * @default
     */
    perPixelTargetFind:     false,

    /**
     * Number of pixels around target pixel to tolerate (consider active) during object detection
     * @type Number
     * @default
     */
    targetFindTolerance:    0,

    /**
     * When true, target detection is skipped when hovering over canvas. This can be used to improve performance.
     * @type Boolean
     * @default
     */
    skipTargetFind:         false,

    /**
     * When true, mouse events on canvas (mousedown/mousemove/mouseup) result in free drawing.
     * After mousedown, mousemove creates a shape,
     * and then mouseup finalizes it and adds an instance of `fabric.Path` onto canvas.
     * @tutorial {@link http://fabricjs.com/fabric-intro-part-4#free_drawing}
     * @type Boolean
     * @default
     */
    isDrawingMode:          false,

    /**
     * Indicates whether objects should remain in current stack position when selected.
     * When false objects are brought to top and rendered as part of the selection group
     * @type Boolean
     * @default
     */
    preserveObjectStacking: false,

    /**
     * Indicates the angle that an object will lock to while rotating.
     * @type Number
     * @since 1.6.7
     * @default
     */
    snapAngle: 0,

    /**
     * Indicates the distance from the snapAngle the rotation will lock to the snapAngle.
     * When `null`, the snapThreshold will default to the snapAngle.
     * @type null|Number
     * @since 1.6.7
     * @default
     */
    snapThreshold: null,

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
     * @private
     */
    _initInteractive: function() {
      this._currentTransform = null;
      this._groupSelector = null;
      this._initWrapperElement();
      this._createUpperCanvas();
      this._initEventListeners();

      this._initRetinaScaling();

      this.freeDrawingBrush = fabric.PencilBrush && new fabric.PencilBrush(this);

      this.calcOffset();
    },

    /**
     * Divides objects in two groups, one to render immediately
     * and one to render as activeGroup.
     * @return {Array} objects to render immediately and pushes the other in the activeGroup.
     */
    _chooseObjectsToRender: function() {
      var activeObjects = this.getActiveObjects(),
          object, objsToRender, activeGroupObjects;

      if (activeObjects.length > 0 && !this.preserveObjectStacking) {
        objsToRender = [];
        activeGroupObjects = [];
        for (var i = 0, length = this._objects.length; i < length; i++) {
          object = this._objects[i];
          if (activeObjects.indexOf(object) === -1 ) {
            objsToRender.push(object);
          }
          else {
            activeGroupObjects.push(object);
          }
        }
        if (activeObjects.length > 1) {
          this._activeObject._objects = activeGroupObjects;
        }
        objsToRender.push.apply(objsToRender, activeGroupObjects);
      }
      else {
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
      if (this.contextTopDirty && !this._groupSelector && !this.isDrawingMode) {
        this.clearContext(this.contextTop);
        this.contextTopDirty = false;
      }
      if (this.hasLostContext) {
        this.renderTopLayer(this.contextTop);
      }
      var canvasToDrawOn = this.contextContainer;
      this.renderCanvas(canvasToDrawOn, this._chooseObjectsToRender());
      return this;
    },

    renderTopLayer: function(ctx) {
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
      this.fire('after:render');
      return this;
    },

    /**
     * Resets the current transform to its original values and chooses the type of resizing based on the event
     * @private
     */
    _resetCurrentTransform: function() {
      var t = this._currentTransform;

      t.target.set({
        scaleX: t.original.scaleX,
        scaleY: t.original.scaleY,
        skewX: t.original.skewX,
        skewY: t.original.skewY,
        left: t.original.left,
        top: t.original.top
      });

      if (this._shouldCenterTransform(t.target)) {
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
     * Checks if point is contained within an area of given object
     * @param {Event} e Event object
     * @param {fabric.Object} target Object to test against
     * @param {Object} [point] x,y object of point coordinates we want to check.
     * @return {Boolean} true if point is contained within an area of given object
     */
    containsPoint: function (e, target, point) {
      var ignoreZoom = true,
          pointer = point || this.getPointer(e, ignoreZoom),
          xy;

      if (target.group && target.group === this._activeObject && target.group.type === 'activeSelection') {
        xy = this._normalizePointer(target.group, pointer);
      }
      else {
        xy = { x: pointer.x, y: pointer.y };
      }
      // http://www.geog.ubc.ca/courses/klink/gis.notes/ncgia/u32.html
      // http://idav.ucdavis.edu/~okreylos/TAship/Spring2000/PointInPolygon.html
      return (target.containsPoint(xy) || target._findTargetCorner(pointer));
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
      if (target.shouldCache() && target._cacheCanvas && target !== this._activeObject) {
        var normalizedPointer = this._normalizePointer(target, {x: x, y: y}),
            targetRelativeX = Math.max(target.cacheTranslationX + (normalizedPointer.x * target.zoomX), 0),
            targetRelativeY = Math.max(target.cacheTranslationY + (normalizedPointer.y * target.zoomY), 0);

        var isTransparent = fabric.util.isTransparent(
          target._cacheContext, Math.round(targetRelativeX), Math.round(targetRelativeY), this.targetFindTolerance);

        return isTransparent;
      }

      var ctx = this.contextCache,
          originalColor = target.selectionBackgroundColor, v = this.viewportTransform;

      target.selectionBackgroundColor = '';

      this.clearContext(ctx);

      ctx.save();
      ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
      target.render(ctx);
      ctx.restore();

      target === this._activeObject && target._renderControls(ctx, {
        hasBorders: false,
        transparentCorners: false
      }, {
        hasBorders: false,
      });

      target.selectionBackgroundColor = originalColor;

      var isTransparent = fabric.util.isTransparent(
        ctx, x, y, this.targetFindTolerance);

      return isTransparent;
    },

    /**
     * takes an event and determins if selection key has been pressed
     * @private
     * @param {Event} e Event object
     */
    _isSelectionKeyPressed: function(e) {
      var selectionKeyPressed = false;

      if (Object.prototype.toString.call(this.selectionKey) === '[object Array]') {
        selectionKeyPressed = !!this.selectionKey.find(function(key) { return e[key] === true; });
      }
      else {
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
        !target
        ||
        (target &&
          activeObject &&
          activeObjects.length > 1 &&
          activeObjects.indexOf(target) === -1 &&
          activeObject !== target &&
          !this._isSelectionKeyPressed(e))
        ||
        (target && !target.evented)
        ||
        (target &&
          !target.selectable &&
          activeObject &&
          activeObject !== target)
      );
    },

    /**
     * centeredScaling from object can't override centeredScaling from canvas.
     * this should be fixed, since object setting should take precedence over canvas.
     * @private
     * @param {fabric.Object} target
     */
    _shouldCenterTransform: function (target) {
      if (!target) {
        return;
      }

      var t = this._currentTransform,
          centerTransform;

      if (t.action === 'scale' || t.action === 'scaleX' || t.action === 'scaleY') {
        centerTransform = this.centeredScaling || target.centeredScaling;
      }
      else if (t.action === 'rotate') {
        centerTransform = this.centeredRotation || target.centeredRotation;
      }

      return centerTransform ? !t.altKey : t.altKey;
    },

    /**
     * @private
     */
    _getOriginFromCorner: function(target, corner) {
      var origin = {
        x: target.originX,
        y: target.originY
      };

      if (corner === 'ml' || corner === 'tl' || corner === 'bl') {
        origin.x = 'right';
      }
      else if (corner === 'mr' || corner === 'tr' || corner === 'br') {
        origin.x = 'left';
      }

      if (corner === 'tl' || corner === 'mt' || corner === 'tr') {
        origin.y = 'bottom';
      }
      else if (corner === 'bl' || corner === 'mb' || corner === 'br') {
        origin.y = 'top';
      }

      return origin;
    },

    /**
     * @private
     * @param {Boolean} alreadySelected true if target is already selected
     * @param {String} corner a string representing the corner ml, mr, tl ...
     * @param {Event} e Event object
     * @param {fabric.Object} [target] inserted back to help overriding. Unused
     */
    _getActionFromCorner: function(alreadySelected, corner, e /* target */) {
      if (!corner || !alreadySelected) {
        return 'drag';
      }

      switch (corner) {
        case 'mtr':
          return 'rotate';
        case 'ml':
        case 'mr':
          return e[this.altActionKey] ? 'skewY' : 'scaleX';
        case 'mt':
        case 'mb':
          return e[this.altActionKey] ? 'skewX' : 'scaleY';
        default:
          return 'scale';
      }
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

      var pointer = this.getPointer(e),
          corner = target._findTargetCorner(this.getPointer(e, true)),
          action = this._getActionFromCorner(alreadySelected, corner, e, target),
          origin = this._getOriginFromCorner(target, corner);

      this._currentTransform = {
        target: target,
        action: action,
        corner: corner,
        scaleX: target.scaleX,
        scaleY: target.scaleY,
        skewX: target.skewX,
        skewY: target.skewY,
        // used by transation
        offsetX: pointer.x - target.left,
        offsetY: pointer.y - target.top,
        originX: origin.x,
        originY: origin.y,
        ex: pointer.x,
        ey: pointer.y,
        lastX: pointer.x,
        lastY: pointer.y,
        // unsure they are usefull anymore.
        // left: target.left,
        // top: target.top,
        theta: degreesToRadians(target.angle),
        // end of unsure
        width: target.width * target.scaleX,
        mouseXSign: 1,
        mouseYSign: 1,
        shiftKey: e.shiftKey,
        altKey: e[this.centeredKey],
        original: fabric.util.saveObjectTransform(target),
      };

      this._currentTransform.original.originX = origin.x;
      this._currentTransform.original.originY = origin.y;

      this._resetCurrentTransform();
      this._beforeTransform(e);
    },

    /**
     * Translates object by "setting" its left/top
     * @private
     * @param {Number} x pointer's x coordinate
     * @param {Number} y pointer's y coordinate
     * @return {Boolean} true if the translation occurred
     */
    _translateObject: function (x, y) {
      var transform = this._currentTransform,
          target = transform.target,
          newLeft = x - transform.offsetX,
          newTop = y - transform.offsetY,
          moveX = !target.get('lockMovementX') && target.left !== newLeft,
          moveY = !target.get('lockMovementY') && target.top !== newTop;

      moveX && target.set('left', newLeft);
      moveY && target.set('top', newTop);
      return moveX || moveY;
    },

    /**
     * Check if we are increasing a positive skew or lower it,
     * checking mouse direction and pressed corner.
     * @private
     */
    _changeSkewTransformOrigin: function(mouseMove, t, by) {
      var property = 'originX', origins = { 0: 'center' },
          skew = t.target.skewX, originA = 'left', originB = 'right',
          corner = t.corner === 'mt' || t.corner === 'ml' ? 1 : -1,
          flipSign = 1;

      mouseMove = mouseMove > 0 ? 1 : -1;
      if (by === 'y') {
        skew = t.target.skewY;
        originA = 'top';
        originB = 'bottom';
        property = 'originY';
      }
      origins[-1] = originA;
      origins[1] = originB;

      t.target.flipX && (flipSign *= -1);
      t.target.flipY && (flipSign *= -1);

      if (skew === 0) {
        t.skewSign = -corner * mouseMove * flipSign;
        t[property] = origins[-mouseMove];
      }
      else {
        skew = skew > 0 ? 1 : -1;
        t.skewSign = skew;
        t[property] = origins[skew * corner * flipSign];
      }
    },

    /**
     * Skew object by mouse events
     * @private
     * @param {Number} x pointer's x coordinate
     * @param {Number} y pointer's y coordinate
     * @param {String} by Either 'x' or 'y'
     * @return {Boolean} true if the skewing occurred
     */
    _skewObject: function (x, y, by) {
      var t = this._currentTransform,
          target = t.target, skewed = false,
          lockSkewingX = target.get('lockSkewingX'),
          lockSkewingY = target.get('lockSkewingY');

      if ((lockSkewingX && by === 'x') || (lockSkewingY && by === 'y')) {
        return false;
      }

      // Get the constraint point
      var center = target.getCenterPoint(),
          actualMouseByCenter = target.toLocalPoint(new fabric.Point(x, y), 'center', 'center')[by],
          lastMouseByCenter = target.toLocalPoint(new fabric.Point(t.lastX, t.lastY), 'center', 'center')[by],
          actualMouseByOrigin, constraintPosition, dim = target._getTransformedDimensions();

      this._changeSkewTransformOrigin(actualMouseByCenter - lastMouseByCenter, t, by);
      actualMouseByOrigin = target.toLocalPoint(new fabric.Point(x, y), t.originX, t.originY)[by];
      constraintPosition = target.translateToOriginPoint(center, t.originX, t.originY);
      // Actually skew the object
      skewed = this._setObjectSkew(actualMouseByOrigin, t, by, dim);
      t.lastX = x;
      t.lastY = y;
      // Make sure the constraints apply
      target.setPositionByOrigin(constraintPosition, t.originX, t.originY);
      return skewed;
    },

    /**
     * Set object skew
     * @private
     * @return {Boolean} true if the skewing occurred
     */
    _setObjectSkew: function(localMouse, transform, by, _dim) {
      var target = transform.target, newValue, skewed = false,
          skewSign = transform.skewSign, newDim, dimNoSkew,
          otherBy, _otherBy, _by, newDimMouse, skewX, skewY;

      if (by === 'x') {
        otherBy = 'y';
        _otherBy = 'Y';
        _by = 'X';
        skewX = 0;
        skewY = target.skewY;
      }
      else {
        otherBy = 'x';
        _otherBy = 'X';
        _by = 'Y';
        skewX = target.skewX;
        skewY = 0;
      }

      dimNoSkew = target._getTransformedDimensions(skewX, skewY);
      newDimMouse = 2 * Math.abs(localMouse) - dimNoSkew[by];
      if (newDimMouse <= 2) {
        newValue = 0;
      }
      else {
        newValue = skewSign * Math.atan((newDimMouse / target['scale' + _by]) /
                                        (dimNoSkew[otherBy] / target['scale' + _otherBy]));
        newValue = fabric.util.radiansToDegrees(newValue);
      }
      skewed = target['skew' + _by] !== newValue;
      target.set('skew' + _by, newValue);
      if (target['skew' + _otherBy] !== 0) {
        newDim = target._getTransformedDimensions();
        newValue = (_dim[otherBy] / newDim[otherBy]) * target['scale' + _otherBy];
        target.set('scale' + _otherBy, newValue);
      }
      return skewed;
    },

    /**
     * Scales object by invoking its scaleX/scaleY methods
     * @private
     * @param {Number} x pointer's x coordinate
     * @param {Number} y pointer's y coordinate
     * @param {String} by Either 'x' or 'y' - specifies dimension constraint by which to scale an object.
     *                    When not provided, an object is scaled by both dimensions equally
     * @return {Boolean} true if the scaling occurred
     */
    _scaleObject: function (x, y, by) {
      var t = this._currentTransform,
          target = t.target,
          lockScalingX = target.lockScalingX,
          lockScalingY = target.lockScalingY,
          lockScalingFlip = target.lockScalingFlip;

      if (lockScalingX && lockScalingY) {
        return false;
      }

      // Get the constraint point
      var constraintPosition = target.translateToOriginPoint(target.getCenterPoint(), t.originX, t.originY),
          localMouse = target.toLocalPoint(new fabric.Point(x, y), t.originX, t.originY),
          dim = target._getTransformedDimensions(), scaled = false;

      this._setLocalMouse(localMouse, t);

      // Actually scale the object
      scaled = this._setObjectScale(localMouse, t, lockScalingX, lockScalingY, by, lockScalingFlip, dim);

      // Make sure the constraints apply
      target.setPositionByOrigin(constraintPosition, t.originX, t.originY);
      return scaled;
    },

    /**
     * @private
     * @return {Boolean} true if the scaling occurred
     */
    _setObjectScale: function(localMouse, transform, lockScalingX, lockScalingY, by, lockScalingFlip, _dim) {
      var target = transform.target, forbidScalingX = false, forbidScalingY = false, scaled = false,
          scaleX = localMouse.x * target.scaleX / _dim.x,
          scaleY = localMouse.y * target.scaleY / _dim.y,
          changeX = target.scaleX !== scaleX,
          changeY = target.scaleY !== scaleY;

      transform.newScaleX = scaleX;
      transform.newScaleY = scaleY;
      if (fabric.Textbox && by === 'x' && target instanceof fabric.Textbox) {
        var w = target.width * (localMouse.x / _dim.x);
        if (w >= target.getMinWidth()) {
          scaled = w !== target.width;
          target.set('width', w);
          return scaled;
        }
        return false;
      }

      if (lockScalingFlip && scaleX <= 0 && scaleX < target.scaleX) {
        forbidScalingX = true;
        localMouse.x = 0;
      }

      if (lockScalingFlip && scaleY <= 0 && scaleY < target.scaleY) {
        forbidScalingY = true;
        localMouse.y = 0;
      }

      if (by === 'equally' && !lockScalingX && !lockScalingY) {
        scaled = this._scaleObjectEqually(localMouse, target, transform, _dim);
      }
      else if (!by) {
        forbidScalingX || lockScalingX || (target.set('scaleX', scaleX) && (scaled = scaled || changeX));
        forbidScalingY || lockScalingY || (target.set('scaleY', scaleY) && (scaled = scaled || changeY));
      }
      else if (by === 'x' && !target.get('lockUniScaling')) {
        forbidScalingX || lockScalingX || (target.set('scaleX', scaleX) && (scaled = changeX));
      }
      else if (by === 'y' && !target.get('lockUniScaling')) {
        forbidScalingY || lockScalingY || (target.set('scaleY', scaleY) && (scaled = changeY));
      }
      forbidScalingX || forbidScalingY || this._flipObject(transform, by);
      return scaled;
    },

    /**
     * @private
     * @return {Boolean} true if the scaling occurred
     */
    _scaleObjectEqually: function(localMouse, target, transform, _dim) {

      var dist = localMouse.y + localMouse.x,
          lastDist = _dim.y * transform.original.scaleY / target.scaleY +
                     _dim.x * transform.original.scaleX / target.scaleX,
          scaled, signX = localMouse.x < 0 ? -1 : 1,
          signY = localMouse.y < 0 ? -1 : 1, newScaleX, newScaleY;

      // We use transform.scaleX/Y instead of target.scaleX/Y
      // because the object may have a min scale and we'll loose the proportions
      newScaleX = signX * Math.abs(transform.original.scaleX * dist / lastDist);
      newScaleY = signY * Math.abs(transform.original.scaleY * dist / lastDist);
      scaled = newScaleX !== target.scaleX || newScaleY !== target.scaleY;
      target.set('scaleX', newScaleX);
      target.set('scaleY', newScaleY);
      return scaled;
    },

    /**
     * @private
     */
    _flipObject: function(transform, by) {
      if (transform.newScaleX < 0 && by !== 'y') {
        if (transform.originX === 'left') {
          transform.originX = 'right';
        }
        else if (transform.originX === 'right') {
          transform.originX = 'left';
        }
      }

      if (transform.newScaleY < 0 && by !== 'x') {
        if (transform.originY === 'top') {
          transform.originY = 'bottom';
        }
        else if (transform.originY === 'bottom') {
          transform.originY = 'top';
        }
      }
    },

    /**
     * @private
     */
    _setLocalMouse: function(localMouse, t) {
      var target = t.target, zoom = this.getZoom(),
          padding = target.padding / zoom;

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

      // adjust the mouse coordinates when dealing with padding
      if (abs(localMouse.x) > padding) {
        if (localMouse.x < 0) {
          localMouse.x += padding;
        }
        else {
          localMouse.x -= padding;
        }
      }
      else { // mouse is within the padding, set to 0
        localMouse.x = 0;
      }

      if (abs(localMouse.y) > padding) {
        if (localMouse.y < 0) {
          localMouse.y += padding;
        }
        else {
          localMouse.y -= padding;
        }
      }
      else {
        localMouse.y = 0;
      }
    },

    /**
     * Rotates object by invoking its rotate method
     * @private
     * @param {Number} x pointer's x coordinate
     * @param {Number} y pointer's y coordinate
     * @return {Boolean} true if the rotation occurred
     */
    _rotateObject: function (x, y) {

      var t = this._currentTransform,
          target = t.target, constraintPosition,
          constraintPosition = target.translateToOriginPoint(target.getCenterPoint(), t.originX, t.originY);

      if (target.lockRotation) {
        return false;
      }

      var lastAngle = atan2(t.ey - constraintPosition.y, t.ex - constraintPosition.x),
          curAngle = atan2(y - constraintPosition.y, x - constraintPosition.x),
          angle = radiansToDegrees(curAngle - lastAngle + t.theta),
          hasRotated = true;

      if (target.snapAngle > 0) {
        var snapAngle  = target.snapAngle,
            snapThreshold  = target.snapThreshold || snapAngle,
            rightAngleLocked = Math.ceil(angle / snapAngle) * snapAngle,
            leftAngleLocked = Math.floor(angle / snapAngle) * snapAngle;

        if (Math.abs(angle - leftAngleLocked) < snapThreshold) {
          angle = leftAngleLocked;
        }
        else if (Math.abs(angle - rightAngleLocked) < snapThreshold) {
          angle = rightAngleLocked;
        }
      }

      // normalize angle to positive value
      if (angle < 0) {
        angle = 360 + angle;
      }
      angle %= 360;

      if (target.angle === angle) {
        hasRotated = false;
      }
      else {
        // rotation only happen here
        target.angle = angle;
        // Make sure the constraints apply
        target.setPositionByOrigin(constraintPosition, t.originX, t.originY);
      }

      return hasRotated;
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
      var groupSelector = this._groupSelector,
          left = groupSelector.left,
          top = groupSelector.top,
          aleft = abs(left),
          atop = abs(top);

      if (this.selectionColor) {
        ctx.fillStyle = this.selectionColor;

        ctx.fillRect(
          groupSelector.ex - ((left > 0) ? 0 : -left),
          groupSelector.ey - ((top > 0) ? 0 : -top),
          aleft,
          atop
        );
      }

      if (!this.selectionLineWidth || !this.selectionBorderColor) {
        return;
      }
      ctx.lineWidth = this.selectionLineWidth;
      ctx.strokeStyle = this.selectionBorderColor;

      // selection border
      if (this.selectionDashArray.length > 1 && !supportLineDash) {

        var px = groupSelector.ex + STROKE_OFFSET - ((left > 0) ? 0 : aleft),
            py = groupSelector.ey + STROKE_OFFSET - ((top > 0) ? 0 : atop);

        ctx.beginPath();

        fabric.util.drawDashedLine(ctx, px, py, px + aleft, py, this.selectionDashArray);
        fabric.util.drawDashedLine(ctx, px, py + atop - 1, px + aleft, py + atop - 1, this.selectionDashArray);
        fabric.util.drawDashedLine(ctx, px, py, px, py + atop, this.selectionDashArray);
        fabric.util.drawDashedLine(ctx, px + aleft - 1, py, px + aleft - 1, py + atop, this.selectionDashArray);

        ctx.closePath();
        ctx.stroke();
      }
      else {
        fabric.Object.prototype._setLineDash.call(this, ctx, this.selectionDashArray);
        ctx.strokeRect(
          groupSelector.ex + STROKE_OFFSET - ((left > 0) ? 0 : aleft),
          groupSelector.ey + STROKE_OFFSET - ((top > 0) ? 0 : atop),
          aleft,
          atop
        );
      }
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
          activeTarget, activeTargetSubs;

      // first check current group (if one exists)
      // active group does not check sub targets like normal groups.
      // if active group just exits.
      this.targets = [];

      if (aObjects.length > 1 && !skipGroup && activeObject === this._searchPossibleTargets([activeObject], pointer)) {
        return activeObject;
      }
      // if we hit the corner of an activeObject, let's return that.
      if (aObjects.length === 1 && activeObject._findTargetCorner(pointer)) {
        return activeObject;
      }
      if (aObjects.length === 1 &&
        activeObject === this._searchPossibleTargets([activeObject], pointer)) {
        if (!this.preserveObjectStacking) {
          return activeObject;
        }
        else {
          activeTarget = activeObject;
          activeTargetSubs = this.targets;
          this.targets = [];
        }
      }
      var target = this._searchPossibleTargets(this._objects, pointer);
      if (e[this.altSelectionKey] && target && activeTarget && target !== activeTarget) {
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
    _checkTarget: function(pointer, obj, globalPointer) {
      if (obj &&
          obj.visible &&
          obj.evented &&
          this.containsPoint(null, obj, pointer)){
        if ((this.perPixelTargetFind || obj.perPixelTargetFind) && !obj.isEditing) {
          var isTransparent = this.isTargetTransparent(obj, globalPointer.x, globalPointer.y);
          if (!isTransparent) {
            return true;
          }
        }
        else {
          return true;
        }
      }
    },

    /**
     * Function used to search inside objects an object that contains pointer in bounding box or that contains pointerOnCanvas when painted
     * @param {Array} [objects] objects array to look into
     * @param {Object} [pointer] x,y object of point coordinates we want to check.
     * @return {fabric.Object} object that contains pointer
     * @private
     */
    _searchPossibleTargets: function(objects, pointer) {
      // Cache all targets where their bounding box contains point.
      var target, i = objects.length, subTarget;
      // Do not check for currently grouped objects, since we check the parent group itself.
      // until we call this function specifically to search inside the activeGroup
      while (i--) {
        var objToCheck = objects[i];
        var pointerToUse = objToCheck.group && objToCheck.group.type !== 'activeSelection' ?
          this._normalizePointer(objToCheck.group, pointer) : pointer;
        if (this._checkTarget(pointerToUse, objToCheck, pointer)) {
          target = objects[i];
          if (target.subTargetCheck && target instanceof fabric.Group) {
            subTarget = this._searchPossibleTargets(target._objects, pointer);
            subTarget && this.targets.push(subTarget);
          }
          break;
        }
      }
      return target;
    },

    /**
     * Returns pointer coordinates without the effect of the viewport
     * @param {Object} pointer with "x" and "y" number values
     * @return {Object} object with "x" and "y" number values
     */
    restorePointerVpt: function(pointer) {
      return fabric.util.transformPoint(
        pointer,
        fabric.util.invertTransform(this.viewportTransform)
      );
    },

    /**
     * Returns pointer coordinates relative to canvas.
     * Can return coordinates with or without viewportTransform.
     * ignoreZoom false gives back coordinates that represent
     * the point clicked on canvas element.
     * ignoreZoom true gives back coordinates after being processed
     * by the viewportTransform ( sort of coordinates of what is displayed
     * on the canvas where you are clicking.
     * ignoreZoom true = HTMLElement coordinates relative to top,left
     * ignoreZoom false, default = fabric space coordinates, the same used for shape position
     * To interact with your shapes top and left you want to use ignoreZoom true
     * most of the time, while ignoreZoom false will give you coordinates
     * compatible with the object.oCoords system.
     * of the time.
     * @param {Event} e
     * @param {Boolean} ignoreZoom
     * @return {Object} object with "x" and "y" number values
     */
    getPointer: function (e, ignoreZoom) {
      // return cached values if we are in the event processing chain
      if (this._absolutePointer && !ignoreZoom) {
        return this._absolutePointer;
      }
      if (this._pointer && ignoreZoom) {
        return this._pointer;
      }

      var pointer = getPointer(e),
          upperCanvasEl = this.upperCanvasEl,
          bounds = upperCanvasEl.getBoundingClientRect(),
          boundsWidth = bounds.width || 0,
          boundsHeight = bounds.height || 0,
          cssScale;

      if (!boundsWidth || !boundsHeight ) {
        if ('top' in bounds && 'bottom' in bounds) {
          boundsHeight = Math.abs( bounds.top - bounds.bottom );
        }
        if ('right' in bounds && 'left' in bounds) {
          boundsWidth = Math.abs( bounds.right - bounds.left );
        }
      }

      this.calcOffset();
      pointer.x = pointer.x - this._offset.left;
      pointer.y = pointer.y - this._offset.top;
      if (!ignoreZoom) {
        pointer = this.restorePointerVpt(pointer);
      }

      var retinaScaling = this.getRetinaScaling();
      if (retinaScaling !== 1) {
        pointer.x /= retinaScaling;
        pointer.y /= retinaScaling;
      }

      if (boundsWidth === 0 || boundsHeight === 0) {
        // If bounds are not available (i.e. not visible), do not apply scale.
        cssScale = { width: 1, height: 1 };
      }
      else {
        cssScale = {
          width: upperCanvasEl.width / boundsWidth,
          height: upperCanvasEl.height / boundsHeight
        };
      }

      return {
        x: pointer.x * cssScale.width,
        y: pointer.y * cssScale.height
      };
    },

    /**
     * @private
     * @throws {CANVAS_INIT_ERROR} If canvas can not be initialized
     */
    _createUpperCanvas: function () {
      var lowerCanvasClass = this.lowerCanvasEl.className.replace(/\s*lower-canvas\s*/, ''),
          lowerCanvasEl = this.lowerCanvasEl, upperCanvasEl = this.upperCanvasEl;

      // there is no need to create a new upperCanvas element if we have already one.
      if (upperCanvasEl) {
        upperCanvasEl.className = '';
      }
      else {
        upperCanvasEl = this._createCanvasElement();
        this.upperCanvasEl = upperCanvasEl;
      }
      fabric.util.addClass(upperCanvasEl, 'upper-canvas ' + lowerCanvasClass);

      this.wrapperEl.appendChild(upperCanvasEl);

      this._copyCanvasStyle(lowerCanvasEl, upperCanvasEl);
      this._applyCanvasStyle(upperCanvasEl);
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
      this.wrapperEl = fabric.util.wrapElement(this.lowerCanvasEl, 'div', {
        'class': this.containerClass
      });
      fabric.util.setStyle(this.wrapperEl, {
        width: this.width + 'px',
        height: this.height + 'px',
        position: 'relative'
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
        '-ms-touch-action': this.allowTouchScrolling ? 'manipulation' : 'none'
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
     * Returns context of canvas where object selection is drawn
     * @return {CanvasRenderingContext2D}
     */
    getSelectionContext: function() {
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
        }
        else {
          return [active];
        }
      }
      return [];
    },

    /**
     * @private
     * @param {fabric.Object} obj Object that was removed
     */
    _onObjectRemoved: function(obj) {
      // removing active object should fire "selection:cleared" events
      if (obj === this._activeObject) {
        this.fire('before:selection:cleared', { target: obj });
        this._discardActiveObject();
        this.fire('selection:cleared', { target: obj });
        obj.fire('deselected');
      }
      if (obj === this._hoveredTarget){
        this._hoveredTarget = null;
        this._hoveredTargets = [];
      }
      this.callSuper('_onObjectRemoved', obj);
    },

    /**
     * @private
     * Compares the old activeObject with the current one and fires correct events
     * @param {fabric.Object} obj old activeObject
     */
    _fireSelectionEvents: function(oldObjects, e) {
      var somethingChanged = false, objects = this.getActiveObjects(),
          added = [], removed = [], opt = { e: e };
      oldObjects.forEach(function(oldObject) {
        if (objects.indexOf(oldObject) === -1) {
          somethingChanged = true;
          oldObject.fire('deselected', opt);
          removed.push(oldObject);
        }
      });
      objects.forEach(function(object) {
        if (oldObjects.indexOf(object) === -1) {
          somethingChanged = true;
          object.fire('selected', opt);
          added.push(object);
        }
      });
      if (oldObjects.length > 0 && objects.length > 0) {
        opt.selected = added;
        opt.deselected = removed;
        // added for backward compatibility
        opt.updated = added[0] || removed[0];
        opt.target = this._activeObject;
        somethingChanged && this.fire('selection:updated', opt);
      }
      else if (objects.length > 0) {
        // deprecated event
        if (objects.length === 1) {
          opt.target = added[0];
          this.fire('object:selected', opt);
        }
        opt.selected = added;
        // added for backward compatibility
        opt.target = this._activeObject;
        this.fire('selection:created', opt);
      }
      else if (oldObjects.length > 0) {
        opt.deselected = removed;
        this.fire('selection:cleared', opt);
      }
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
     * @private
     * @param {Object} object to set as active
     * @param {Event} [e] Event (passed along when firing "object:selected")
     * @return {Boolean} true if the selection happened
     */
    _setActiveObject: function(object, e) {
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
     * @private
     */
    _discardActiveObject: function(e, object) {
      var obj = this._activeObject;
      if (obj) {
        // onDeselect return TRUE to cancel selection;
        if (obj.onDeselect({ e: e, object: object })) {
          return false;
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
      var currentActives = this.getActiveObjects(), activeObject = this.getActiveObject();
      if (currentActives.length) {
        this.fire('before:selection:cleared', { target: activeObject, e: e });
      }
      this._discardActiveObject(e);
      this._fireSelectionEvents(currentActives, e);
      return this;
    },

    /**
     * Clears a canvas element and removes all event listeners
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    dispose: function () {
      var wrapper = this.wrapperEl;
      this.removeListeners();
      wrapper.removeChild(this.upperCanvasEl);
      wrapper.removeChild(this.lowerCanvasEl);
      this.contextCache = null;
      this.contextTop = null;
      ['upperCanvasEl', 'cacheCanvasEl'].forEach((function(element) {
        fabric.util.cleanUpJsdomNode(this[element]);
        this[element] = undefined;
      }).bind(this));
      if (wrapper.parentNode) {
        wrapper.parentNode.replaceChild(this.lowerCanvasEl, this.wrapperEl);
      }
      delete this.wrapperEl;
      fabric.StaticCanvas.prototype.dispose.call(this);
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
      return this.callSuper('clear');
    },

    /**
     * Draws objects' controls (borders/controls)
     * @param {CanvasRenderingContext2D} ctx Context to render controls on
     */
    drawControls: function(ctx) {
      var activeObject = this._activeObject;

      if (activeObject) {
        activeObject._renderControls(ctx);
      }
    },

    /**
     * @private
     */
    _toObject: function(instance, methodName, propertiesToInclude) {
      //If the object is part of the current selection group, it should
      //be transformed appropriately
      //i.e. it should be serialised as it would appear if the selection group
      //were to be destroyed.
      var originalProperties = this._realizeGroupTransformOnObject(instance),
          object = this.callSuper('_toObject', instance, methodName, propertiesToInclude);
      //Undo the damage we did by changing all of its properties
      this._unwindGroupTransformOnObject(instance, originalProperties);
      return object;
    },

    /**
     * Realises an object's group transformation on it
     * @private
     * @param {fabric.Object} [instance] the object to transform (gets mutated)
     * @returns the original values of instance which were changed
     */
    _realizeGroupTransformOnObject: function(instance) {
      if (instance.group && instance.group.type === 'activeSelection' && this._activeObject === instance.group) {
        var layoutProps = ['angle', 'flipX', 'flipY', 'left', 'scaleX', 'scaleY', 'skewX', 'skewY', 'top'];
        //Copy all the positionally relevant properties across now
        var originalValues = {};
        layoutProps.forEach(function(prop) {
          originalValues[prop] = instance[prop];
        });
        this._activeObject.realizeTransform(instance);
        return originalValues;
      }
      else {
        return null;
      }
    },

    /**
     * Restores the changed properties of instance
     * @private
     * @param {fabric.Object} [instance] the object to un-transform (gets mutated)
     * @param {Object} [originalValues] the original values of instance, as returned by _realizeGroupTransformOnObject
     */
    _unwindGroupTransformOnObject: function(instance, originalValues) {
      if (originalValues) {
        instance.set(originalValues);
      }
    },

    /**
     * @private
     */
    _setSVGObject: function(markup, instance, reviver) {
      //If the object is in a selection group, simulate what would happen to that
      //object when the group is deselected
      var originalProperties = this._realizeGroupTransformOnObject(instance);
      this.callSuper('_setSVGObject', markup, instance, reviver);
      this._unwindGroupTransformOnObject(instance, originalProperties);
    },

    setViewportTransform: function (vpt) {
      if (this.renderOnAddRemove && this._activeObject && this._activeObject.isEditing) {
        this._activeObject.clearContextTop();
      }
      fabric.StaticCanvas.prototype.setViewportTransform.call(this, vpt);
    }
  });

  // copying static properties manually to work around Opera's bug,
  // where "prototype" property is enumerable and overrides existing prototype
  for (var prop in fabric.StaticCanvas) {
    if (prop !== 'prototype') {
      fabric.Canvas[prop] = fabric.StaticCanvas[prop];
    }
  }
})();
