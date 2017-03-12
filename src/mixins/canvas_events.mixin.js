(function() {

  var cursorOffset = {
        mt: 0, // n
        tr: 1, // ne
        mr: 2, // e
        br: 3, // se
        mb: 4, // s
        bl: 5, // sw
        ml: 6, // w
        tl: 7 // nw
      },
      addListener = fabric.util.addListener,
      removeListener = fabric.util.removeListener;

  fabric.util.object.extend(fabric.Canvas.prototype, /** @lends fabric.Canvas.prototype */ {

    /**
     * Map of cursor style values for each of the object controls
     * @private
     */
    cursorMap: [
      'n-resize',
      'ne-resize',
      'e-resize',
      'se-resize',
      's-resize',
      'sw-resize',
      'w-resize',
      'nw-resize'
    ],

    /**
     * Adds mouse listeners to canvas
     * @private
     */
    _initEventListeners: function () {

      this._bindEvents();

      addListener(fabric.window, 'resize', this._onResize);

      // mouse events
      addListener(this.upperCanvasEl, 'mousedown', this._onMouseDown);
      addListener(this.upperCanvasEl, 'mousemove', this._onMouseMove);
      addListener(this.upperCanvasEl, 'mouseout', this._onMouseOut);
      addListener(this.upperCanvasEl, 'mouseenter', this._onMouseEnter);
      addListener(this.upperCanvasEl, 'wheel', this._onMouseWheel);
      addListener(this.upperCanvasEl, 'contextmenu', this._onContextMenu);

      // touch events
      addListener(this.upperCanvasEl, 'touchstart', this._onMouseDown, { passive: false });
      addListener(this.upperCanvasEl, 'touchmove', this._onMouseMove, { passive: false });

      if (typeof eventjs !== 'undefined' && 'add' in eventjs) {
        eventjs.add(this.upperCanvasEl, 'gesture', this._onGesture);
        eventjs.add(this.upperCanvasEl, 'drag', this._onDrag);
        eventjs.add(this.upperCanvasEl, 'orientation', this._onOrientationChange);
        eventjs.add(this.upperCanvasEl, 'shake', this._onShake);
        eventjs.add(this.upperCanvasEl, 'longpress', this._onLongPress);
      }
    },

    /**
     * @private
     */
    _bindEvents: function() {
      this._onMouseDown = this._onMouseDown.bind(this);
      this._onMouseMove = this._onMouseMove.bind(this);
      this._onMouseUp = this._onMouseUp.bind(this);
      this._onResize = this._onResize.bind(this);
      this._onGesture = this._onGesture.bind(this);
      this._onDrag = this._onDrag.bind(this);
      this._onShake = this._onShake.bind(this);
      this._onLongPress = this._onLongPress.bind(this);
      this._onOrientationChange = this._onOrientationChange.bind(this);
      this._onMouseWheel = this._onMouseWheel.bind(this);
      this._onMouseOut = this._onMouseOut.bind(this);
      this._onMouseEnter = this._onMouseEnter.bind(this);
      this._onContextMenu = this._onContextMenu.bind(this);
    },

    /**
     * Removes all event listeners
     */
    removeListeners: function() {
      removeListener(fabric.window, 'resize', this._onResize);

      removeListener(this.upperCanvasEl, 'mousedown', this._onMouseDown);
      removeListener(this.upperCanvasEl, 'mousemove', this._onMouseMove);
      removeListener(this.upperCanvasEl, 'mouseout', this._onMouseOut);
      removeListener(this.upperCanvasEl, 'mouseenter', this._onMouseEnter);
      removeListener(this.upperCanvasEl, 'wheel', this._onMouseWheel);
      removeListener(this.upperCanvasEl, 'contextmenu', this._onContextMenu);

      removeListener(this.upperCanvasEl, 'touchstart', this._onMouseDown);
      removeListener(this.upperCanvasEl, 'touchmove', this._onMouseMove);

      if (typeof eventjs !== 'undefined' && 'remove' in eventjs) {
        eventjs.remove(this.upperCanvasEl, 'gesture', this._onGesture);
        eventjs.remove(this.upperCanvasEl, 'drag', this._onDrag);
        eventjs.remove(this.upperCanvasEl, 'orientation', this._onOrientationChange);
        eventjs.remove(this.upperCanvasEl, 'shake', this._onShake);
        eventjs.remove(this.upperCanvasEl, 'longpress', this._onLongPress);
      }
    },

    /**
     * @private
     * @param {Event} [e] Event object fired on Event.js gesture
     * @param {Event} [self] Inner Event object
     */
    _onGesture: function(e, self) {
      this.__onTransformGesture && this.__onTransformGesture(e, self);
    },

    /**
     * @private
     * @param {Event} [e] Event object fired on Event.js drag
     * @param {Event} [self] Inner Event object
     */
    _onDrag: function(e, self) {
      this.__onDrag && this.__onDrag(e, self);
    },

    /**
     * @private
     * @param {Event} [e] Event object fired on wheel event
     */
    _onMouseWheel: function(e) {
      this.__onMouseWheel(e);
    },

    /**
     * @private
     * @param {Event} e Event object fired on mousedown
     */
    _onMouseOut: function(e) {
      var target = this._hoveredTarget;
      this.fire('mouse:out', { target: target, e: e });
      this._hoveredTarget = null;
      target && target.fire('mouseout', { e: e });
      if (this._iTextInstances) {
        this._iTextInstances.forEach(function(obj) {
          if (obj.isEditing) {
            obj.hiddenTextarea.focus();
          }
        });
      }
    },

    /**
     * @private
     * @param {Event} e Event object fired on mouseenter
     */
    _onMouseEnter: function(e) {
      if (!this.findTarget(e)) {
        this.fire('mouse:over', { target: null, e: e });
        this._hoveredTarget = null;
      }
    },

    /**
     * @private
     * @param {Event} [e] Event object fired on Event.js orientation change
     * @param {Event} [self] Inner Event object
     */
    _onOrientationChange: function(e, self) {
      this.__onOrientationChange && this.__onOrientationChange(e, self);
    },

    /**
     * @private
     * @param {Event} [e] Event object fired on Event.js shake
     * @param {Event} [self] Inner Event object
     */
    _onShake: function(e, self) {
      this.__onShake && this.__onShake(e, self);
    },

    /**
     * @private
     * @param {Event} [e] Event object fired on Event.js shake
     * @param {Event} [self] Inner Event object
     */
    _onLongPress: function(e, self) {
      this.__onLongPress && this.__onLongPress(e, self);
    },

    /**
     * @private
     * @param {Event} e Event object fired on mousedown
     */
    _onContextMenu: function (e) {
      if (this.stopContextMenu) {
        e.stopPropagation();
        e.preventDefault();
      }
      return false;
    },

    /**
     * @private
     * @param {Event} e Event object fired on mousedown
     */
    _onMouseDown: function (e) {
      this.__onMouseDown(e);

      addListener(fabric.document, 'touchend', this._onMouseUp, { passive: false });
      addListener(fabric.document, 'touchmove', this._onMouseMove, { passive: false });

      removeListener(this.upperCanvasEl, 'mousemove', this._onMouseMove);
      removeListener(this.upperCanvasEl, 'touchmove', this._onMouseMove);

      if (e.type === 'touchstart') {
        // Unbind mousedown to prevent double triggers from touch devices
        removeListener(this.upperCanvasEl, 'mousedown', this._onMouseDown);
      }
      else {
        addListener(fabric.document, 'mouseup', this._onMouseUp);
        addListener(fabric.document, 'mousemove', this._onMouseMove);
      }
    },

    /**
     * @private
     * @param {Event} e Event object fired on mouseup
     */
    _onMouseUp: function (e) {
      this.__onMouseUp(e);

      removeListener(fabric.document, 'mouseup', this._onMouseUp);
      removeListener(fabric.document, 'touchend', this._onMouseUp);

      removeListener(fabric.document, 'mousemove', this._onMouseMove);
      removeListener(fabric.document, 'touchmove', this._onMouseMove);

      addListener(this.upperCanvasEl, 'mousemove', this._onMouseMove);
      addListener(this.upperCanvasEl, 'touchmove', this._onMouseMove, { passive: false });

      if (e.type === 'touchend') {
        // Wait 400ms before rebinding mousedown to prevent double triggers
        // from touch devices
        var _this = this;
        setTimeout(function() {
          addListener(_this.upperCanvasEl, 'mousedown', _this._onMouseDown);
        }, 400);
      }
    },

    /**
     * @private
     * @param {Event} e Event object fired on mousemove
     */
    _onMouseMove: function (e) {
      !this.allowTouchScrolling && e.preventDefault && e.preventDefault();
      this.__onMouseMove(e);
    },

    /**
     * @private
     */
    _onResize: function () {
      this.calcOffset();
    },

    /**
     * Decides whether the canvas should be redrawn in mouseup and mousedown events.
     * @private
     * @param {Object} target
     * @param {Object} pointer
     */
    _shouldRender: function(target, pointer) {
      var activeObject = this.getActiveGroup() || this.getActiveObject();

      if (activeObject && activeObject.isEditing && target === activeObject) {
        // if we mouse up/down over a editing textbox a cursor change,
        // there is no need to re render
        return false;
      }
      return !!(
        (target && (
          target.isMoving ||
          target !== activeObject))
        ||
        (!target && !!activeObject)
        ||
        (!target && !activeObject && !this._groupSelector)
        ||
        (pointer &&
          this._previousPointer &&
          this.selection && (
          pointer.x !== this._previousPointer.x ||
          pointer.y !== this._previousPointer.y))
      );
    },

    /**
     * Method that defines the actions when mouse is released on canvas.
     * The method resets the currentTransform parameters, store the image corner
     * position in the image object and render the canvas on top.
     * @private
     * @param {Event} e Event object fired on mouseup
     */
    __onMouseUp: function (e) {
      var target, searchTarget = true, transform = this._currentTransform,
          groupSelector = this._groupSelector,
          isClick = (!groupSelector || (groupSelector.left === 0 && groupSelector.top === 0));

      if (this.isDrawingMode && this._isCurrentlyDrawing) {
        this._onMouseUpInDrawingMode(e);
        return;
      }

      if (transform) {
        this._finalizeCurrentTransform();
        searchTarget = !transform.actionPerformed;
      }

      target = searchTarget ? this.findTarget(e, true) : transform.target;

      var shouldRender = this._shouldRender(target, this.getPointer(e));

      if (target || !isClick) {
        this._maybeGroupObjects(e);
      }
      else {
        // those are done by default on mouse up
        // by _maybeGroupObjects, we are skipping it in case of no target find
        this._groupSelector = null;
        this._currentTransform = null;
      }

      if (target) {
        target.isMoving = false;
      }

      this._handleCursorAndEvent(e, target, 'up');
      target && (target.__corner = 0);
      shouldRender && this.renderAll();
    },

    /**
     * set cursor for mouse up and handle mouseUp event
     * @param {Event} e event from mouse
     * @param {fabric.Object} target receiving event
     * @param {String} eventType event to fire (up, down or move)
     */
    _handleCursorAndEvent: function(e, target, eventType) {
      this._setCursorFromEvent(e, target);
      this._handleEvent(e, eventType, target ? target : null);
    },

    /**
     * Handle event firing for target and subtargets
     * @param {Event} e event from mouse
     * @param {String} eventType event to fire (up, down or move)
     * @param {fabric.Object} targetObj receiving event
     */
    _handleEvent: function(e, eventType, targetObj) {
      var target = typeof targetObj === 'undefined' ? this.findTarget(e) : targetObj,
          targets = this.targets || [],
          options = { e: e, target: target, subTargets: targets };
      this.fire('mouse:' + eventType, options);
      target && target.fire('mouse' + eventType, options);
      for (var i = 0; i < targets.length; i++) {
        targets[i].fire('mouse' + eventType, options);
      }
    },

    /**
     * @private
     */
    _finalizeCurrentTransform: function() {

      var transform = this._currentTransform,
          target = transform.target;

      if (target._scaling) {
        target._scaling = false;
      }

      target.setCoords();
      this._restoreOriginXY(target);

      if (transform.actionPerformed || (this.stateful && target.hasStateChanged())) {
        this.fire('object:modified', { target: target });
        target.fire('modified');
      }
    },

    /**
     * @private
     * @param {Object} target Object to restore
     */
    _restoreOriginXY: function(target) {
      if (this._previousOriginX && this._previousOriginY) {

        var originPoint = target.translateToOriginPoint(
          target.getCenterPoint(),
          this._previousOriginX,
          this._previousOriginY);

        target.originX = this._previousOriginX;
        target.originY = this._previousOriginY;

        target.left = originPoint.x;
        target.top = originPoint.y;

        this._previousOriginX = null;
        this._previousOriginY = null;
      }
    },

    /**
     * @private
     * @param {Event} e Event object fired on mousedown
     */
    _onMouseDownInDrawingMode: function(e) {
      this._isCurrentlyDrawing = true;
      this.discardActiveObject(e).renderAll();
      if (this.clipTo) {
        fabric.util.clipContext(this, this.contextTop);
      }
      var pointer = this.getPointer(e);
      this.freeDrawingBrush.onMouseDown(pointer);
      this._handleEvent(e, 'down');
    },

    /**
     * @private
     * @param {Event} e Event object fired on mousemove
     */
    _onMouseMoveInDrawingMode: function(e) {
      if (this._isCurrentlyDrawing) {
        var pointer = this.getPointer(e);
        this.freeDrawingBrush.onMouseMove(pointer);
      }
      this.setCursor(this.freeDrawingCursor);
      this._handleEvent(e, 'move');
    },

    /**
     * @private
     * @param {Event} e Event object fired on mouseup
     */
    _onMouseUpInDrawingMode: function(e) {
      this._isCurrentlyDrawing = false;
      if (this.clipTo) {
        this.contextTop.restore();
      }
      this.freeDrawingBrush.onMouseUp();
      this._handleEvent(e, 'up');
    },

    /**
     * Method that defines the actions when mouse is clicked on canvas.
     * The method inits the currentTransform parameters and renders all the
     * canvas so the current image can be placed on the top canvas and the rest
     * in on the container one.
     * @private
     * @param {Event} e Event object fired on mousedown
     */
    __onMouseDown: function (e) {

      var target = this.findTarget(e);

      // if right click just fire events
      var isRightClick  = 'which' in e ? e.which === 3 : e.button === 2;
      if (isRightClick) {
        if (this.fireRightClick) {
          this._handleEvent(e, 'down', target ? target : null);
        }
        return;
      }

      var isMiddleClick  = 'which' in e ? e.which === 2 : e.button === 1;
      if (isMiddleClick) {
        if (this.fireMiddleClick) {
          this._handleEvent(e, 'down', target ? target : null);
        }
        return;
      }

      if (this.isDrawingMode) {
        this._onMouseDownInDrawingMode(e);
        return;
      }

      // ignore if some object is being transformed at this moment
      if (this._currentTransform) {
        return;
      }

      // save pointer for check in __onMouseUp event
      var pointer = this.getPointer(e, true);
      this._previousPointer = pointer;

      var shouldRender = this._shouldRender(target, pointer),
          shouldGroup = this._shouldGroup(e, target);

      if (this._shouldClearSelection(e, target)) {
        this._clearSelection(e, target, pointer);
      }
      else if (shouldGroup) {
        this._handleGrouping(e, target);
        target = this.getActiveGroup();
      }

      if (target) {
        if (target.selectable && (target.__corner || !shouldGroup)) {
          this._beforeTransform(e, target);
          this._setupCurrentTransform(e, target);
        }
        var activeObject = this.getActiveObject();
        if (target !== this.getActiveGroup() && target !== activeObject) {
          this.deactivateAll();
          if (target.selectable) {
            activeObject && activeObject.fire('deselected', { e: e });
            this.setActiveObject(target, e);
          }
        }
      }
      this._handleEvent(e, 'down', target ? target : null);
      // we must renderAll so that we update the visuals
      shouldRender && this.renderAll();
    },

    /**
     * @private
     */
    _beforeTransform: function(e, target) {
      this.stateful && target.saveState();

      // determine if it's a drag or rotate case
      if (target._findTargetCorner(this.getPointer(e))) {
        this.onBeforeScaleRotate(target);
      }

    },

    /**
     * @private
     */
    _clearSelection: function(e, target, pointer) {
      this.deactivateAllWithDispatch(e);

      if (target && target.selectable) {
        this.setActiveObject(target, e);
      }
      else if (this.selection) {
        this._groupSelector = {
          ex: pointer.x,
          ey: pointer.y,
          top: 0,
          left: 0
        };
      }
    },

    /**
     * @private
     * @param {Object} target Object for that origin is set to center
     */
    _setOriginToCenter: function(target) {
      this._previousOriginX = this._currentTransform.target.originX;
      this._previousOriginY = this._currentTransform.target.originY;

      var center = target.getCenterPoint();

      target.originX = 'center';
      target.originY = 'center';

      target.left = center.x;
      target.top = center.y;

      this._currentTransform.left = target.left;
      this._currentTransform.top = target.top;
    },

    /**
     * @private
     * @param {Object} target Object for that center is set to origin
     */
    _setCenterToOrigin: function(target) {
      var originPoint = target.translateToOriginPoint(
        target.getCenterPoint(),
        this._previousOriginX,
        this._previousOriginY);

      target.originX = this._previousOriginX;
      target.originY = this._previousOriginY;

      target.left = originPoint.x;
      target.top = originPoint.y;

      this._previousOriginX = null;
      this._previousOriginY = null;
    },

    /**
     * Method that defines the actions when mouse is hovering the canvas.
     * The currentTransform parameter will definde whether the user is rotating/scaling/translating
     * an image or neither of them (only hovering). A group selection is also possible and would cancel
     * all any other type of action.
     * In case of an image transformation only the top canvas will be rendered.
     * @private
     * @param {Event} e Event object fired on mousemove
     */
    __onMouseMove: function (e) {

      var target, pointer;

      if (this.isDrawingMode) {
        this._onMouseMoveInDrawingMode(e);
        return;
      }
      if (typeof e.touches !== 'undefined' && e.touches.length > 1) {
        return;
      }

      var groupSelector = this._groupSelector;

      // We initially clicked in an empty area, so we draw a box for multiple selection
      if (groupSelector) {
        pointer = this.getPointer(e, true);

        groupSelector.left = pointer.x - groupSelector.ex;
        groupSelector.top = pointer.y - groupSelector.ey;

        this.renderTop();
      }
      else if (!this._currentTransform) {
        target = this.findTarget(e);
        this._setCursorFromEvent(e, target);
      }
      else {
        this._transformObject(e);
      }
      this._handleEvent(e, 'move', target ? target : null);
    },

    /**
     * Method that defines actions when an Event Mouse Wheel
     * @param {Event} e Event object fired on mouseup
     */
    __onMouseWheel: function(e) {
      this._handleEvent(e, 'wheel');
    },

    /**
     * @private
     * @param {Event} e Event fired on mousemove
     */
    _transformObject: function(e) {
      var pointer = this.getPointer(e),
          transform = this._currentTransform;

      transform.reset = false;
      transform.target.isMoving = true;
      transform.shiftKey = e.shiftKey;
      transform.altKey = e[this.centeredKey];

      this._beforeScaleTransform(e, transform);
      this._performTransformAction(e, transform, pointer);

      transform.actionPerformed && this.renderAll();
    },

    /**
     * @private
     */
    _performTransformAction: function(e, transform, pointer) {
      var x = pointer.x,
          y = pointer.y,
          target = transform.target,
          action = transform.action,
          actionPerformed = false;

      if (action === 'rotate') {
        (actionPerformed = this._rotateObject(x, y)) && this._fire('rotating', target, e);
      }
      else if (action === 'scale') {
        (actionPerformed = this._onScale(e, transform, x, y)) && this._fire('scaling', target, e);
      }
      else if (action === 'scaleX') {
        (actionPerformed = this._scaleObject(x, y, 'x')) && this._fire('scaling', target, e);
      }
      else if (action === 'scaleY') {
        (actionPerformed = this._scaleObject(x, y, 'y')) && this._fire('scaling', target, e);
      }
      else if (action === 'skewX') {
        (actionPerformed = this._skewObject(x, y, 'x')) && this._fire('skewing', target, e);
      }
      else if (action === 'skewY') {
        (actionPerformed = this._skewObject(x, y, 'y')) && this._fire('skewing', target, e);
      }
      else {
        actionPerformed = this._translateObject(x, y);
        if (actionPerformed) {
          this._fire('moving', target, e);
          this.setCursor(target.moveCursor || this.moveCursor);
        }
      }
      transform.actionPerformed = transform.actionPerformed || actionPerformed;
    },

    /**
     * @private
     */
    _fire: function(eventName, target, e) {
      this.fire('object:' + eventName, { target: target, e: e });
      target.fire(eventName, { e: e });
    },

    /**
     * @private
     */
    _beforeScaleTransform: function(e, transform) {
      if (transform.action === 'scale' || transform.action === 'scaleX' || transform.action === 'scaleY') {
        var centerTransform = this._shouldCenterTransform(transform.target);

        // Switch from a normal resize to center-based
        if ((centerTransform && (transform.originX !== 'center' || transform.originY !== 'center')) ||
           // Switch from center-based resize to normal one
           (!centerTransform && transform.originX === 'center' && transform.originY === 'center')
        ) {
          this._resetCurrentTransform();
          transform.reset = true;
        }
      }
    },

    /**
     * @private
     * @param {Event} e Event object
     * @param {Object} transform current tranform
     * @param {Number} x mouse position x from origin
     * @param {Number} y mouse poistion y from origin
     * @return {Boolean} true if the scaling occurred
     */
    _onScale: function(e, transform, x, y) {
      if ((e[this.uniScaleKey] || this.uniScaleTransform) && !transform.target.get('lockUniScaling')) {
        transform.currentAction = 'scale';
        return this._scaleObject(x, y);
      }
      else {
        // Switch from a normal resize to proportional
        if (!transform.reset && transform.currentAction === 'scale') {
          this._resetCurrentTransform();
        }

        transform.currentAction = 'scaleEqually';
        return this._scaleObject(x, y, 'equally');
      }
    },

    /**
     * Sets the cursor depending on where the canvas is being hovered.
     * Note: very buggy in Opera
     * @param {Event} e Event object
     * @param {Object} target Object that the mouse is hovering, if so.
     */
    _setCursorFromEvent: function (e, target) {
      if (!target || !target.selectable) {
        this.setCursor(this.defaultCursor);
        return false;
      }

      var hoverCursor = target.hoverCursor || this.hoverCursor,
          activeGroup = this.getActiveGroup(),
          // only show proper corner when group selection is not active
          corner = target._findTargetCorner
                    && (!activeGroup || !activeGroup.contains(target))
                    && target._findTargetCorner(this.getPointer(e, true));

      if (!corner) {
        this.setCursor(hoverCursor);
      }
      else {
        this._setCornerCursor(corner, target, e);
      }
      //actually unclear why it should return something
      //is never evaluated
      return true;
    },

    /**
     * @private
     */
    _setCornerCursor: function(corner, target, e) {
      if (corner in cursorOffset) {
        this.setCursor(this._getRotatedCornerCursor(corner, target, e));
      }
      else if (corner === 'mtr' && target.hasRotatingPoint) {
        this.setCursor(this.rotationCursor);
      }
      else {
        this.setCursor(this.defaultCursor);
        return false;
      }
    },

    /**
     * @private
     */
    _getRotatedCornerCursor: function(corner, target, e) {
      var n = Math.round((target.getAngle() % 360) / 45);

      if (n < 0) {
        n += 8; // full circle ahead
      }
      n += cursorOffset[corner];
      if (e[this.altActionKey] && cursorOffset[corner] % 2 === 0) {
        //if we are holding shift and we are on a mx corner...
        n += 2;
      }
      // normalize n to be from 0 to 7
      n %= 8;

      return this.cursorMap[n];
    }
  });
})();
