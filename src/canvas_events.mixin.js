(function(){

  var cursorMap = {
    'tr': 'ne-resize',
    'br': 'se-resize',
    'bl': 'sw-resize',
    'tl': 'nw-resize',
    'ml': 'w-resize',
    'mt': 'n-resize',
    'mr': 'e-resize',
    'mb': 's-resize'
  },
  addListener = fabric.util.addListener,
  removeListener = fabric.util.removeListener,
  getPointer = fabric.util.getPointer;

  fabric.util.object.extend(fabric.Canvas.prototype, /** @scope fabric.Canvas.prototype */ {

    /**
     * Adds mouse listeners to  canvas
     * @method _initEvents
     * @private
     * See configuration documentation for more details.
     */
    _initEvents: function () {
      var _this = this;

      this._onMouseDown = this._onMouseDown.bind(this);
      this._onMouseMove = this._onMouseMove.bind(this);
      this._onMouseUp = this._onMouseUp.bind(this);
      this._onResize = this._onResize.bind(this);

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
     * @method _onMouseDown
     * @private
     */
    _onMouseDown: function (e) {
      this.__onMouseDown(e);

      !fabric.isTouchSupported && addListener(fabric.document, 'mouseup', this._onMouseUp);
      fabric.isTouchSupported && addListener(fabric.document, 'touchend', this._onMouseUp);

      !fabric.isTouchSupported && addListener(fabric.document, 'mousemove', this._onMouseMove);
      fabric.isTouchSupported && addListener(fabric.document, 'touchmove', this._onMouseMove);

      !fabric.isTouchSupported && removeListener(this.upperCanvasEl, 'mousemove', this._onMouseMove);
      fabric.isTouchSupported && removeListener(this.upperCanvasEl, 'touchmove', this._onMouseMove);
    },

    /**
     * @method _onMouseUp
     * @private
     */
    _onMouseUp: function (e) {
      this.__onMouseUp(e);

      !fabric.isTouchSupported && removeListener(fabric.document, 'mouseup', this._onMouseUp);
      fabric.isTouchSupported && removeListener(fabric.document, 'touchend', this._onMouseUp);

      !fabric.isTouchSupported && removeListener(fabric.document, 'mousemove', this._onMouseMove);
      fabric.isTouchSupported && removeListener(fabric.document, 'touchmove', this._onMouseMove);

      !fabric.isTouchSupported && addListener(this.upperCanvasEl, 'mousemove', this._onMouseMove);
      fabric.isTouchSupported && addListener(this.upperCanvasEl, 'touchmove', this._onMouseMove);
    },

    /**
     * @method _onMouseMove
     * @private
     */
    _onMouseMove: function (e) {
      e.preventDefault && e.preventDefault();
      this.__onMouseMove(e);
    },

    /**
     * @method _onResize
     * @private
     */
    _onResize: function () {
      this.calcOffset();
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
          this._currentTransform.target.adjustPosition(this._previousOriginX);
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
        this._currentTransform.target.adjustPosition('center');
        this._currentTransform.left = this._currentTransform.target.left;
        this._currentTransform.top = this._currentTransform.target.top;
      }
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
        pointer = getPointer(e, this.upperCanvasEl);

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
        pointer = getPointer(e, this.upperCanvasEl);

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
            target: this._currentTransform.target,
            e: e
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
        var corner = target._findTargetCorner
                      && (!activeGroup || !activeGroup.contains(target))
                      && target._findTargetCorner(e, this._offset);

        if (!corner) {
          s.cursor = this.hoverCursor;
        }
        else {
          if (corner in cursorMap) {
            s.cursor = cursorMap[corner];
          }
          else if (corner === 'mtr' && target.hasRotatingPoint) {
            s.cursor = this.rotationCursor;
          }
          else {
            s.cursor = this.defaultCursor;
            return false;
          }
        }
      }
      return true;
    }
  });
})();
