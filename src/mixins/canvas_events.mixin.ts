//@ts-nocheck

import { fireEvent } from "../util/fireEvent";


(function(global) {

  var fabric = global.fabric,
      addListener = fabric.util.addListener,
      removeListener = fabric.util.removeListener,
      RIGHT_CLICK = 3, MIDDLE_CLICK = 2, LEFT_CLICK = 1,
      addEventOptions = { passive: false };

  function checkClick(e, value) {
    return e.button && (e.button === value - 1);
  }

  fabric.util.object.extend(fabric.Canvas.prototype, /** @lends fabric.Canvas.prototype */ {

    /**
     * Contains the id of the touch event that owns the fabric transform
     * @type Number
     * @private
     */
    mainTouchId: null,

    /**
     * Adds mouse listeners to canvas
     * @private
     */
    _initEventListeners: function () {
      // in case we initialized the class twice. This should not happen normally
      // but in some kind of applications where the canvas element may be changed
      // this is a workaround to having double listeners.
      this.removeListeners();
      this._bindEvents();
      this.addOrRemove(addListener, 'add');
    },

    /**
     * return an event prefix pointer or mouse.
     * @private
     */
    _getEventPrefix: function () {
      return this.enablePointerEvents ? 'pointer' : 'mouse';
    },

    addOrRemove: function(functor, eventjsFunctor) {
      var canvasElement = this.upperCanvasEl,
          eventTypePrefix = this._getEventPrefix();
      functor(fabric.window, 'resize', this._onResize);
      functor(canvasElement, eventTypePrefix + 'down', this._onMouseDown);
      functor(canvasElement, eventTypePrefix + 'move', this._onMouseMove, addEventOptions);
      functor(canvasElement, eventTypePrefix + 'out', this._onMouseOut);
      functor(canvasElement, eventTypePrefix + 'enter', this._onMouseEnter);
      functor(canvasElement, 'wheel', this._onMouseWheel);
      functor(canvasElement, 'contextmenu', this._onContextMenu);
      functor(canvasElement, 'dblclick', this._onDoubleClick);
      functor(canvasElement, 'dragstart', this._onDragStart);
      functor(canvasElement, 'dragend', this._onDragEnd);
      functor(canvasElement, 'dragover', this._onDragOver);
      functor(canvasElement, 'dragenter', this._onDragEnter);
      functor(canvasElement, 'dragleave', this._onDragLeave);
      functor(canvasElement, 'drop', this._onDrop);
      if (!this.enablePointerEvents) {
        functor(canvasElement, 'touchstart', this._onTouchStart, addEventOptions);
      }
      if (typeof eventjs !== 'undefined' && eventjsFunctor in eventjs) {
        eventjs[eventjsFunctor](canvasElement, 'gesture', this._onGesture);
        eventjs[eventjsFunctor](canvasElement, 'drag', this._onDrag);
        eventjs[eventjsFunctor](canvasElement, 'orientation', this._onOrientationChange);
        eventjs[eventjsFunctor](canvasElement, 'shake', this._onShake);
        eventjs[eventjsFunctor](canvasElement, 'longpress', this._onLongPress);
      }
    },

    /**
     * Removes all event listeners
     */
    removeListeners: function() {
      this.addOrRemove(removeListener, 'remove');
      // if you dispose on a mouseDown, before mouse up, you need to clean document to...
      var eventTypePrefix = this._getEventPrefix();
      removeListener(fabric.document, eventTypePrefix + 'up', this._onMouseUp);
      removeListener(fabric.document, 'touchend', this._onTouchEnd, addEventOptions);
      removeListener(fabric.document, eventTypePrefix + 'move', this._onMouseMove, addEventOptions);
      removeListener(fabric.document, 'touchmove', this._onMouseMove, addEventOptions);
    },

    /**
     * @private
     */
    _bindEvents: function() {
      if (this.eventsBound) {
        // for any reason we pass here twice we do not want to bind events twice.
        return;
      }
      this._onMouseDown = this._onMouseDown.bind(this);
      this._onTouchStart = this._onTouchStart.bind(this);
      this._onMouseMove = this._onMouseMove.bind(this);
      this._onMouseUp = this._onMouseUp.bind(this);
      this._onTouchEnd = this._onTouchEnd.bind(this);
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
      this._onDoubleClick = this._onDoubleClick.bind(this);
      this._onDragStart = this._onDragStart.bind(this);
      this._onDragEnd = this._onDragEnd.bind(this);
      this._onDragProgress = this._onDragProgress.bind(this);
      this._onDragOver = this._onDragOver.bind(this);
      this._onDragEnter = this._onDragEnter.bind(this);
      this._onDragLeave = this._onDragLeave.bind(this);
      this._onDrop = this._onDrop.bind(this);
      this.eventsBound = true;
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

      this._hoveredTargets.forEach(function(nestedTarget){
        this.fire('mouse:out', { target: nestedTarget, e: e });
        nestedTarget && nestedTarget.fire('mouseout', { e: e });
      }, this);
      this._hoveredTargets = [];
    },

    /**
     * @private
     * @param {Event} e Event object fired on mouseenter
     */
    _onMouseEnter: function(e) {
      // This find target and consequent 'mouse:over' is used to
      // clear old instances on hovered target.
      // calling findTarget has the side effect of killing target.__corner.
      // as a short term fix we are not firing this if we are currently transforming.
      // as a long term fix we need to separate the action of finding a target with the
      // side effects we added to it.
      if (!this._currentTransform && !this.findTarget(e)) {
        this.fire('mouse:over', { target: null, e: e });
        this._hoveredTarget = null;
        this._hoveredTargets = [];
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
     * supports native like text dragging
     * @private
     * @param {DragEvent} e
     */
    _onDragStart: function (e) {
      var activeObject = this.getActiveObject();
      if (activeObject && typeof activeObject.onDragStart === 'function' && activeObject.onDragStart(e)) {
        this._dragSource = activeObject;
        var options = { e: e, target: activeObject };
        this.fire('dragstart', options);
        activeObject.fire('dragstart', options);
        addListener(this.upperCanvasEl, 'drag', this._onDragProgress);
        return;
      }
      e.preventDefault();
      e.stopPropagation();
    },

    /**
     * @private
     */
    _renderDragEffects: function (e, source, target) {
      var ctx = this.contextTop;
      if (source) {
        source.clearContextTop(true);
        source.renderDragSourceEffect(e);
      }
      if (target) {
        if (target !== source) {
          ctx.restore();
          ctx.save();
          target.clearContextTop(true);
        }
        target.renderDropTargetEffect(e);
      }
      ctx.restore();
    },

    /**
     * supports native like text dragging
     * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#finishing_a_drag
     * @private
     * @param {DragEvent} e
     */
    _onDragEnd: function (e) {
      var didDrop = e.dataTransfer.dropEffect !== 'none',
          dropTarget = didDrop ? this._activeObject : undefined,
          options = {
            e: e,
            target: this._dragSource,
            subTargets: this.targets,
            dragSource: this._dragSource,
            didDrop: didDrop,
            dropTarget: dropTarget
          };
      removeListener(this.upperCanvasEl, 'drag', this._onDragProgress);
      this.fire('dragend', options);
      this._dragSource && this._dragSource.fire('dragend', options);
      delete this._dragSource;
      // we need to call mouse up synthetically because the browser won't
      this._onMouseUp(e);
    },

    /**
     * fire `drag` event on canvas and drag source
     * @private
     * @param {DragEvent} e
     */
    _onDragProgress: function (e) {
      var options = {
        e: e,
        dragSource: this._dragSource,
        dropTarget: this._draggedoverTarget
      };
      this.fire('drag', options);
      this._dragSource && this._dragSource.fire('drag', options);
    },

    /**
     * prevent default to allow drop event to be fired
     * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#specifying_drop_targets
     * @private
     * @param {Event} [e] Event object fired on Event.js shake
     */
    _onDragOver: function (e) {
      var eventType = 'dragover',
          target = this.findTarget(e),
          targets = this.targets,
          options = {
            e: e,
            target: target,
            subTargets: targets,
            dragSource: this._dragSource,
            canDrop: false,
            dropTarget: undefined
          },
          dropTarget;
      //  fire on canvas
      this.fire(eventType, options);
      //  make sure we fire dragenter events before dragover
      //  if dragleave is needed, object will not fire dragover so we don't need to trouble ourselves with it
      this._fireEnterLeaveEvents(target, options);
      if (target) {
        // render drag selection before rendering target cursor for correct visuals
        if (target.canDrop(e)) { dropTarget = target; };
        target.fire(eventType, options);
      }
      //  propagate the event to subtargets
      for (var i = 0; i < targets.length; i++) {
        target = targets[i];
        //  accept event only if previous targets didn't
        if (!e.defaultPrevented && target.canDrop(e)) {
          dropTarget = target;
        }
        target.fire(eventType, options);
      }
      //  render drag effects now that relations between source and target is clear
      this._renderDragEffects(e, this._dragSource, dropTarget);
    },

    /**
     * fire `dragleave` on `dragover` targets
     * @private
     * @param {Event} [e] Event object fired on Event.js shake
     */
    _onDragEnter: function (e) {
      var target = this.findTarget(e);
      var options = {
        e: e,
        target: target,
        subTargets: this.targets,
        dragSource: this._dragSource
      };
      this.fire('dragenter', options);
      //  fire dragenter on targets
      this._fireEnterLeaveEvents(target, options);
    },

    /**
     * fire `dragleave` on `dragover` targets
     * @private
     * @param {Event} [e] Event object fired on Event.js shake
     */
    _onDragLeave: function (e) {
      var options = {
        e: e,
        target: this._draggedoverTarget,
        subTargets: this.targets,
        dragSource: this._dragSource
      };
      this.fire('dragleave', options);
      //  fire dragleave on targets
      this._fireEnterLeaveEvents(null, options);
      //  clear targets
      this.targets = [];
      this._hoveredTargets = [];
    },

    /**
     * `drop:before` is a an event that allows you to schedule logic
     * before the `drop` event. Prefer `drop` event always, but if you need
     * to run some drop-disabling logic on an event, since there is no way
     * to handle event handlers ordering, use `drop:before`
     * @private
     * @param {Event} e
     */
    _onDrop: function (e) {
      var options = this._simpleEventHandler('drop:before', e, {
        dragSource: this._dragSource,
        pointer: this.getPointer(e)
      });
      //  will be set by the drop target
      options.didDrop = false;
      //  will be set by the drop target, used in case options.target refuses the drop
      options.dropTarget = undefined;
      //  fire `drop`
      this._basicEventHandler('drop', options);
      //  inform canvas of the drop
      //  we do this because canvas was unaware of what happened at the time the `drop` event was fired on it
      //  use for side effects
      this.fire('drop:after', options);
    },

    /**
     * @private
     * @param {Event} e Event object fired on mousedown
     */
    _onContextMenu: function (e) {
      var options = this._simpleEventHandler('contextmenu:before', e);
      if (this.stopContextMenu) {
        e.stopPropagation();
        e.preventDefault();
      }
      this._basicEventHandler('contextmenu', options);
      return false;
    },

    /**
     * @private
     * @param {Event} e Event object fired on mousedown
     */
    _onDoubleClick: function (e) {
      this._cacheTransformEventData(e);
      this._handleEvent(e, 'dblclick');
      this._resetTransformEventData();
    },

    /**
     * Return a the id of an event.
     * returns either the pointerId or the identifier or 0 for the mouse event
     * @private
     * @param {Event} evt Event object
     */
    getPointerId: function(evt) {
      var changedTouches = evt.changedTouches;

      if (changedTouches) {
        return changedTouches[0] && changedTouches[0].identifier;
      }

      if (this.enablePointerEvents) {
        return evt.pointerId;
      }

      return -1;
    },

    /**
     * Determines if an event has the id of the event that is considered main
     * @private
     * @param {evt} event Event object
     */
    _isMainEvent: function(evt) {
      if (evt.isPrimary === true) {
        return true;
      }
      if (evt.isPrimary === false) {
        return false;
      }
      if (evt.type === 'touchend' && evt.touches.length === 0) {
        return true;
      }
      if (evt.changedTouches) {
        return evt.changedTouches[0].identifier === this.mainTouchId;
      }
      return true;
    },

    /**
     * @private
     * @param {Event} e Event object fired on mousedown
     */
    _onTouchStart: function(e) {
      e.preventDefault();
      if (this.mainTouchId === null) {
        this.mainTouchId = this.getPointerId(e);
      }
      this.__onMouseDown(e);
      this._resetTransformEventData();
      var canvasElement = this.upperCanvasEl,
          eventTypePrefix = this._getEventPrefix();
      addListener(fabric.document, 'touchend', this._onTouchEnd, addEventOptions);
      addListener(fabric.document, 'touchmove', this._onMouseMove, addEventOptions);
      // Unbind mousedown to prevent double triggers from touch devices
      removeListener(canvasElement, eventTypePrefix + 'down', this._onMouseDown);
    },

    /**
     * @private
     * @param {Event} e Event object fired on mousedown
     */
    _onMouseDown: function (e) {
      this.__onMouseDown(e);
      this._resetTransformEventData();
      var canvasElement = this.upperCanvasEl,
          eventTypePrefix = this._getEventPrefix();
      removeListener(canvasElement, eventTypePrefix + 'move', this._onMouseMove, addEventOptions);
      addListener(fabric.document, eventTypePrefix + 'up', this._onMouseUp);
      addListener(fabric.document, eventTypePrefix + 'move', this._onMouseMove, addEventOptions);
    },

    /**
     * @private
     * @param {Event} e Event object fired on mousedown
     */
    _onTouchEnd: function(e) {
      if (e.touches.length > 0) {
        // if there are still touches stop here
        return;
      }
      this.__onMouseUp(e);
      this._resetTransformEventData();
      this.mainTouchId = null;
      var eventTypePrefix = this._getEventPrefix();
      removeListener(fabric.document, 'touchend', this._onTouchEnd, addEventOptions);
      removeListener(fabric.document, 'touchmove', this._onMouseMove, addEventOptions);
      var _this = this;
      if (this._willAddMouseDown) {
        clearTimeout(this._willAddMouseDown);
      }
      this._willAddMouseDown = setTimeout(function() {
        // Wait 400ms before rebinding mousedown to prevent double triggers
        // from touch devices
        addListener(_this.upperCanvasEl, eventTypePrefix + 'down', _this._onMouseDown);
        _this._willAddMouseDown = 0;
      }, 400);
    },

    /**
     * @private
     * @param {Event} e Event object fired on mouseup
     */
    _onMouseUp: function (e) {
      this.__onMouseUp(e);
      this._resetTransformEventData();
      var canvasElement = this.upperCanvasEl,
          eventTypePrefix = this._getEventPrefix();
      if (this._isMainEvent(e)) {
        removeListener(fabric.document, eventTypePrefix + 'up', this._onMouseUp);
        removeListener(fabric.document, eventTypePrefix + 'move', this._onMouseMove, addEventOptions);
        addListener(canvasElement, eventTypePrefix + 'move', this._onMouseMove, addEventOptions);
      }
    },

    /**
     * @private
     * @param {Event} e Event object fired on mousemove
     */
    _onMouseMove: function (e) {
      var activeObject = this.getActiveObject();
      !this.allowTouchScrolling && (!activeObject || !activeObject.__isDragging)
        && e.preventDefault && e.preventDefault();
      this.__onMouseMove(e);
    },

    /**
     * @private
     */
    _onResize: function () {
      this.calcOffset();
      this._resetTransformEventData();
    },

    /**
     * Decides whether the canvas should be redrawn in mouseup and mousedown events.
     * @private
     * @param {Object} target
     */
    _shouldRender: function(target) {
      var activeObject = this._activeObject;

      if (
        !!activeObject !== !!target ||
        (activeObject && target && (activeObject !== target))
      ) {
        // this covers: switch of target, from target to no target, selection of target
        // multiSelection with key and mouse
        return true;
      }
      else if (activeObject && activeObject.isEditing) {
        // if we mouse up/down over a editing textbox a cursor change,
        // there is no need to re render
        return false;
      }
      return false;
    },

    /**
     * Method that defines the actions when mouse is released on canvas.
     * The method resets the currentTransform parameters, store the image corner
     * position in the image object and render the canvas on top.
     * @private
     * @param {Event} e Event object fired on mouseup
     */
    __onMouseUp: function (e) {
      var target, transform = this._currentTransform,
          groupSelector = this._groupSelector, shouldRender = false,
          isClick = (!groupSelector || (groupSelector.left === 0 && groupSelector.top === 0));
      this._cacheTransformEventData(e);
      target = this._target;
      this._handleEvent(e, 'up:before');
      // if right/middle click just fire events and return
      // target undefined will make the _handleEvent search the target
      if (checkClick(e, RIGHT_CLICK)) {
        if (this.fireRightClick) {
          this._handleEvent(e, 'up', RIGHT_CLICK, isClick);
        }
        return;
      }

      if (checkClick(e, MIDDLE_CLICK)) {
        if (this.fireMiddleClick) {
          this._handleEvent(e, 'up', MIDDLE_CLICK, isClick);
        }
        this._resetTransformEventData();
        return;
      }

      if (this.isDrawingMode && this._isCurrentlyDrawing) {
        this._onMouseUpInDrawingMode(e);
        return;
      }

      if (!this._isMainEvent(e)) {
        return;
      }
      if (transform) {
        this._finalizeCurrentTransform(e);
        shouldRender = transform.actionPerformed;
      }
      if (!isClick) {
        var targetWasActive = target === this._activeObject;
        this._maybeGroupObjects(e);
        if (!shouldRender) {
          shouldRender = (
            this._shouldRender(target) ||
            (!targetWasActive && target === this._activeObject)
          );
        }
      }
      var corner, pointer;
      if (target) {
        corner = target._findTargetCorner(
          this.getPointer(e, true),
          fabric.util.isTouchEvent(e)
        );
        if (target.selectable && target !== this._activeObject && target.activeOn === 'up') {
          this.setActiveObject(target, e);
          shouldRender = true;
        }
        else {
          var control = target.controls[corner],
              mouseUpHandler = control && control.getMouseUpHandler(e, target, control);
          if (mouseUpHandler) {
            pointer = this.getPointer(e);
            mouseUpHandler(e, transform, pointer.x, pointer.y);
          }
        }
        target.isMoving = false;
      }
      // if we are ending up a transform on a different control or a new object
      // fire the original mouse up from the corner that started the transform
      if (transform && (transform.target !== target || transform.corner !== corner)) {
        var originalControl = transform.target && transform.target.controls[transform.corner],
            originalMouseUpHandler = originalControl && originalControl.getMouseUpHandler(e, target, control);
        pointer = pointer || this.getPointer(e);
        originalMouseUpHandler && originalMouseUpHandler(e, transform, pointer.x, pointer.y);
      }
      this._setCursorFromEvent(e, target);
      this._handleEvent(e, 'up', LEFT_CLICK, isClick);
      this._groupSelector = null;
      this._currentTransform = null;
      // reset the target information about which corner is selected
      target && (target.__corner = 0);
      if (shouldRender) {
        this.requestRenderAll();
      }
      else if (!isClick) {
        this.renderTop();
      }
    },

    /**
     * @private
     * Handle event firing for target and subtargets
     * @param {Event} e event from mouse
     * @param {String} eventType event to fire (up, down or move)
     * @param {object} [data] event data overrides
     * @return {object} options
     */
    _simpleEventHandler: function(eventType, e, data) {
      var target = this.findTarget(e), subTargets = this.targets || [];
      return this._basicEventHandler(eventType, Object.assign({}, {
        e: e,
        target: target,
        subTargets: subTargets,
      }, data));
    },

    _basicEventHandler: function (eventType, options) {
      var target = options.target, subTargets = options.subTargets;
      this.fire(eventType, options);
      target && target.fire(eventType, options);
      for (var i = 0; i < subTargets.length; i++) {
        subTargets[i].fire(eventType, options);
      }
      return options;
    },

    /**
     * @private
     * Handle event firing for target and subtargets
     * @param {Event} e event from mouse
     * @param {String} eventType event to fire (up, down or move)
     * @param {fabric.Object} targetObj receiving event
     * @param {Number} [button] button used in the event 1 = left, 2 = middle, 3 = right
     * @param {Boolean} isClick for left button only, indicates that the mouse up happened without move.
     */
    _handleEvent: function(e, eventType, button, isClick) {
      var target = this._target,
          targets = this.targets || [],
          options = {
            e: e,
            target: target,
            subTargets: targets,
            button: button || LEFT_CLICK,
            isClick: isClick || false,
            pointer: this._pointer,
            absolutePointer: this._absolutePointer,
            transform: this._currentTransform
          };
      if (eventType === 'up') {
        options.currentTarget = this.findTarget(e);
        options.currentSubTargets = this.targets;
      }
      this.fire('mouse:' + eventType, options);
      target && target.fire('mouse' + eventType, options);
      for (var i = 0; i < targets.length; i++) {
        targets[i].fire('mouse' + eventType, options);
      }
    },

    /**
     * End the current transfrom.
     * You don't usually need to call this method unless you are interupting a user initiated transform
     * because of some other event ( a press of key combination, or something that block the user UX )
     * @param {Event} [e] send the mouse event that generate the finalize down, so it can be used in the event
     */
    endCurrentTransform: function(e) {
      var transform = this._currentTransform;
      this._finalizeCurrentTransform(e);
      if (transform && transform.target) {
        // this could probably go inside _finalizeCurrentTransform
        transform.target.isMoving = false;
      };
      this._currentTransform = null;
    },

    /**
     * @private
     * @param {Event} e send the mouse event that generate the finalize down, so it can be used in the event
     */
    _finalizeCurrentTransform: function(e) {

      var transform = this._currentTransform,
          target = transform.target,
          options = {
            e: e,
            target: target,
            transform: transform,
            action: transform.action,
          };

      if (target._scaling) {
        target._scaling = false;
      }

      target.setCoords();

      if (transform.actionPerformed || (this.stateful && target.hasStateChanged())) {
        this._fire('modified', options);
      }
    },

    /**
     * @private
     * @param {Event} e Event object fired on mousedown
     */
    _onMouseDownInDrawingMode: function(e) {
      this._isCurrentlyDrawing = true;
      if (this.getActiveObject()) {
        this.discardActiveObject(e).requestRenderAll();
      }
      var pointer = this.getPointer(e);
      this.freeDrawingBrush.onMouseDown(pointer, { e: e, pointer: pointer });
      this._handleEvent(e, 'down');
    },

    /**
     * @private
     * @param {Event} e Event object fired on mousemove
     */
    _onMouseMoveInDrawingMode: function(e) {
      if (this._isCurrentlyDrawing) {
        var pointer = this.getPointer(e);
        this.freeDrawingBrush.onMouseMove(pointer, { e: e, pointer: pointer });
      }
      this.setCursor(this.freeDrawingCursor);
      this._handleEvent(e, 'move');
    },

    /**
     * @private
     * @param {Event} e Event object fired on mouseup
     */
    _onMouseUpInDrawingMode: function(e) {
      var pointer = this.getPointer(e);
      this._isCurrentlyDrawing = this.freeDrawingBrush.onMouseUp({ e: e, pointer: pointer });
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
      this._cacheTransformEventData(e);
      this._handleEvent(e, 'down:before');
      var target = this._target;
      // if right click just fire events
      if (checkClick(e, RIGHT_CLICK)) {
        if (this.fireRightClick) {
          this._handleEvent(e, 'down', RIGHT_CLICK);
        }
        return;
      }

      if (checkClick(e, MIDDLE_CLICK)) {
        if (this.fireMiddleClick) {
          this._handleEvent(e, 'down', MIDDLE_CLICK);
        }
        return;
      }

      if (this.isDrawingMode) {
        this._onMouseDownInDrawingMode(e);
        return;
      }

      if (!this._isMainEvent(e)) {
        return;
      }

      // ignore if some object is being transformed at this moment
      if (this._currentTransform) {
        return;
      }

      var pointer = this._pointer;
      // save pointer for check in __onMouseUp event
      this._previousPointer = pointer;
      var shouldRender = this._shouldRender(target),
          shouldGroup = this._shouldGroup(e, target);
      if (this._shouldClearSelection(e, target)) {
        this.discardActiveObject(e);
      }
      else if (shouldGroup) {
        this._handleGrouping(e, target);
        target = this._activeObject;
      }

      if (this.selection && (!target ||
        (!target.selectable && !target.isEditing && target !== this._activeObject))) {
        this._groupSelector = {
          ex: this._absolutePointer.x,
          ey: this._absolutePointer.y,
          top: 0,
          left: 0
        };
      }

      if (target) {
        var alreadySelected = target === this._activeObject;
        if (target.selectable && target.activeOn === 'down') {
          this.setActiveObject(target, e);
        }
        var corner = target._findTargetCorner(
          this.getPointer(e, true),
          fabric.util.isTouchEvent(e)
        );
        target.__corner = corner;
        if (target === this._activeObject && (corner || !shouldGroup)) {
          this._setupCurrentTransform(e, target, alreadySelected);
          var control = target.controls[corner],
              pointer = this.getPointer(e),
              mouseDownHandler = control && control.getMouseDownHandler(e, target, control);
          if (mouseDownHandler) {
            mouseDownHandler(e, this._currentTransform, pointer.x, pointer.y);
          }
        }
      }
      var invalidate = shouldRender || shouldGroup;
      //  we clear `_objectsToRender` in case of a change in order to repopulate it at rendering
      //  run before firing the `down` event to give the dev a chance to populate it themselves
      invalidate && (this._objectsToRender = undefined);
      this._handleEvent(e, 'down');
      // we must renderAll so that we update the visuals
      invalidate && this.requestRenderAll();
    },

    /**
     * reset cache form common information needed during event processing
     * @private
     */
    _resetTransformEventData: function() {
      this._target = null;
      this._pointer = null;
      this._absolutePointer = null;
    },

    /**
     * Cache common information needed during event processing
     * @private
     * @param {Event} e Event object fired on event
     */
    _cacheTransformEventData: function(e) {
      // reset in order to avoid stale caching
      this._resetTransformEventData();
      this._pointer = this.getPointer(e, true);
      this._absolutePointer = this.restorePointerVpt(this._pointer);
      this._target = this._currentTransform ? this._currentTransform.target : this.findTarget(e) || null;
    },

    /**
     * @private
     */
    _beforeTransform: function(e) {
      var t = this._currentTransform;
      this.stateful && t.target.saveState();
      this.fire('before:transform', {
        e: e,
        transform: t,
      });
    },

    /**
     * Method that defines the actions when mouse is hovering the canvas.
     * The currentTransform parameter will define whether the user is rotating/scaling/translating
     * an image or neither of them (only hovering). A group selection is also possible and would cancel
     * all any other type of action.
     * In case of an image transformation only the top canvas will be rendered.
     * @private
     * @param {Event} e Event object fired on mousemove
     */
    __onMouseMove: function (e) {
      this._handleEvent(e, 'move:before');
      this._cacheTransformEventData(e);
      var target, pointer;

      if (this.isDrawingMode) {
        this._onMouseMoveInDrawingMode(e);
        return;
      }

      if (!this._isMainEvent(e)) {
        return;
      }

      var groupSelector = this._groupSelector;

      // We initially clicked in an empty area, so we draw a box for multiple selection
      if (groupSelector) {
        pointer = this._absolutePointer;

        groupSelector.left = pointer.x - groupSelector.ex;
        groupSelector.top = pointer.y - groupSelector.ey;

        this.renderTop();
      }
      else if (!this._currentTransform) {
        target = this.findTarget(e) || null;
        this._setCursorFromEvent(e, target);
        this._fireOverOutEvents(target, e);
      }
      else {
        this._transformObject(e);
      }
      this._handleEvent(e, 'move');
      this._resetTransformEventData();
    },

    /**
     * Manage the mouseout, mouseover events for the fabric object on the canvas
     * @param {Fabric.Object} target the target where the target from the mousemove event
     * @param {Event} e Event object fired on mousemove
     * @private
     */
    _fireOverOutEvents: function(target, e) {
      var _hoveredTarget = this._hoveredTarget,
          _hoveredTargets = this._hoveredTargets, targets = this.targets,
          length = Math.max(_hoveredTargets.length, targets.length);

      this.fireSyntheticInOutEvents(target, { e: e }, {
        oldTarget: _hoveredTarget,
        evtOut: 'mouseout',
        canvasEvtOut: 'mouse:out',
        evtIn: 'mouseover',
        canvasEvtIn: 'mouse:over',
      });
      for (var i = 0; i < length; i++){
        this.fireSyntheticInOutEvents(targets[i], { e: e }, {
          oldTarget: _hoveredTargets[i],
          evtOut: 'mouseout',
          evtIn: 'mouseover',
        });
      }
      this._hoveredTarget = target;
      this._hoveredTargets = this.targets.concat();
    },

    /**
     * Manage the dragEnter, dragLeave events for the fabric objects on the canvas
     * @param {Fabric.Object} target the target where the target from the onDrag event
     * @param {Object} data Event object fired on dragover
     * @private
     */
    _fireEnterLeaveEvents: function(target, data) {
      var _draggedoverTarget = this._draggedoverTarget,
          _hoveredTargets = this._hoveredTargets, targets = this.targets,
          length = Math.max(_hoveredTargets.length, targets.length);

      this.fireSyntheticInOutEvents(target, data, {
        oldTarget: _draggedoverTarget,
        evtOut: 'dragleave',
        evtIn: 'dragenter',
        canvasEvtIn: 'drag:enter',
        canvasEvtOut: 'drag:leave',
      });
      for (var i = 0; i < length; i++) {
        this.fireSyntheticInOutEvents(targets[i], data, {
          oldTarget: _hoveredTargets[i],
          evtOut: 'dragleave',
          evtIn: 'dragenter',
        });
      }
      this._draggedoverTarget = target;
    },

    /**
     * Manage the synthetic in/out events for the fabric objects on the canvas
     * @param {Fabric.Object} target the target where the target from the supported events
     * @param {Object} data Event object fired
     * @param {Object} config configuration for the function to work
     * @param {String} config.targetName property on the canvas where the old target is stored
     * @param {String} [config.canvasEvtOut] name of the event to fire at canvas level for out
     * @param {String} config.evtOut name of the event to fire for out
     * @param {String} [config.canvasEvtIn] name of the event to fire at canvas level for in
     * @param {String} config.evtIn name of the event to fire for in
     * @private
     */
    fireSyntheticInOutEvents: function(target, data, config) {
      var inOpt, outOpt, oldTarget = config.oldTarget, outFires, inFires,
          targetChanged = oldTarget !== target, canvasEvtIn = config.canvasEvtIn, canvasEvtOut = config.canvasEvtOut;
      if (targetChanged) {
        inOpt = Object.assign({}, data, { target: target, previousTarget: oldTarget });
        outOpt = Object.assign({}, data, { target: oldTarget, nextTarget: target });
      }
      inFires = target && targetChanged;
      outFires = oldTarget && targetChanged;
      if (outFires) {
        canvasEvtOut && this.fire(canvasEvtOut, outOpt);
        oldTarget.fire(config.evtOut, outOpt);
      }
      if (inFires) {
        canvasEvtIn && this.fire(canvasEvtIn, inOpt);
        target.fire(config.evtIn, inOpt);
      }
    },

    /**
     * Method that defines actions when an Event Mouse Wheel
     * @param {Event} e Event object fired on mouseup
     */
    __onMouseWheel: function(e) {
      this._cacheTransformEventData(e);
      this._handleEvent(e, 'wheel');
      this._resetTransformEventData();
    },

    /**
     * @private
     * @param {Event} e Event fired on mousemove
     */
    _transformObject: function(e) {
      var pointer = this.getPointer(e),
          transform = this._currentTransform,
          target = transform.target,
          //  transform pointer to target's containing coordinate plane
          //  both pointer and object should agree on every point
          localPointer = target.group ?
            fabric.util.sendPointToPlane(pointer, null, target.group.calcTransformMatrix()) :
            pointer;

      transform.reset = false;
      transform.shiftKey = e.shiftKey;
      transform.altKey = e[this.centeredKey];

      this._performTransformAction(e, transform, localPointer);
      transform.actionPerformed && this.requestRenderAll();
    },

    /**
     * @private
     */
    _performTransformAction: function(e, transform, pointer) {
      var x = pointer.x,
          y = pointer.y,
          action = transform.action,
          actionPerformed = false,
          actionHandler = transform.actionHandler;
          // this object could be created from the function in the control handlers


      if (actionHandler) {
        actionPerformed = actionHandler(e, transform, x, y);
      }
      if (action === 'drag' && actionPerformed) {
        transform.target.isMoving = true;
        this.setCursor(transform.target.moveCursor || this.moveCursor);
      }
      transform.actionPerformed = transform.actionPerformed || actionPerformed;
    },

    /**
     * @private
     */
    _fire: function (eventName, options) {
      return fireEvent(eventName, options);
    },

    /**
     * Sets the cursor depending on where the canvas is being hovered.
     * Note: very buggy in Opera
     * @param {Event} e Event object
     * @param {Object} target Object that the mouse is hovering, if so.
     */
    _setCursorFromEvent: function (e, target) {
      if (!target) {
        this.setCursor(this.defaultCursor);
        return false;
      }
      var hoverCursor = target.hoverCursor || this.hoverCursor,
          activeSelection = this._activeObject && this._activeObject.type === 'activeSelection' ?
            this._activeObject : null,
          // only show proper corner when group selection is not active
          corner = (!activeSelection || !activeSelection.contains(target))
          // here we call findTargetCorner always with undefined for the touch parameter.
          // we assume that if you are using a cursor you do not need to interact with
          // the bigger touch area.
                    && target._findTargetCorner(this.getPointer(e, true));

      if (!corner) {
        if (target.subTargetCheck){
          // hoverCursor should come from top-most subTarget,
          // so we walk the array backwards
          this.targets.concat().reverse().map(function(_target){
            hoverCursor = _target.hoverCursor || hoverCursor;
          });
        }
        this.setCursor(hoverCursor);
      }
      else {
        this.setCursor(this.getCornerCursor(corner, target, e));
      }
    },

    /**
     * @private
     */
    getCornerCursor: function(corner, target, e) {
      var control = target.controls[corner];
      return control.cursorStyleHandler(e, control, target);
    }
  });
})(typeof exports !== 'undefined' ? exports : window);
