import { defineProperty as _defineProperty, objectSpread2 as _objectSpread2 } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { dragHandler } from '../controls/drag.mjs';
import { getActionFromCorner } from '../controls/util.mjs';
import { Point } from '../Point.mjs';
import { FabricObject } from '../shapes/Object/FabricObject.mjs';
import { saveObjectTransform, addTransformToObject } from '../util/misc/objectTransforms.mjs';
import { StaticCanvas } from './StaticCanvas.mjs';
import { isCollection } from '../Collection.mjs';
import { isTransparent } from '../util/misc/isTransparent.mjs';
import { degreesToRadians } from '../util/misc/radiansDegreesConversion.mjs';
import { isTouchEvent, getPointer } from '../util/dom_event.mjs';
import { pick } from '../util/misc/pick.mjs';
import { sendPointToPlane } from '../util/misc/planeChange.mjs';
import { cos } from '../util/misc/cos.mjs';
import { sin } from '../util/misc/sin.mjs';
import '../util/misc/vectors.mjs';
import '../util/misc/projectStroke/StrokeLineJoinProjections.mjs';
import { SCALE, SCALE_X, SCALE_Y, RESIZING, ROTATE, RIGHT, LEFT, BOTTOM, TOP, CENTER, MODIFIED, SKEW_X, SKEW_Y } from '../constants.mjs';
import { createCanvasElement } from '../util/misc/dom.mjs';
import '../config.mjs';
import '../shapes/Group.mjs';
import '../cache.mjs';
import '../parser/constants.mjs';
import '../util/animation/AnimationRegistry.mjs';
import { CanvasDOMManager } from './DOMManagers/CanvasDOMManager.mjs';
import { canvasDefaults } from './CanvasOptions.mjs';
import { Intersection } from '../Intersection.mjs';
import { isActiveSelection } from '../util/typeAssertions.mjs';

/**
 * Canvas class
 * @class Canvas
 * @extends StaticCanvas
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-1#canvas}
 *
 * @fires object:modified at the end of a transform
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
 *  !flag && this.draggableTextDelegate.canDrop(e);
 * }
 * b.on('dragover', opt => b.set('fill', opt.dropTarget === b ? 'pink' : 'black'));
 * a.on('drop', opt => {
 *  opt.e.defaultPrevented  //  drop occurred
 *  opt.didDrop             //  drop occurred on canvas
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
class SelectableCanvas extends StaticCanvas {
  constructor() {
    super(...arguments);
    // transform config
    // selection config
    // cursors
    // target find config
    /**
     * When true, mouse events on canvas (mousedown/mousemove/mouseup) result in free drawing.
     * After mousedown, mousemove creates a shape,
     * and then mouseup finalizes it and adds an instance of `fabric.Path` onto canvas.
     * @tutorial {@link http://fabricjs.com/fabric-intro-part-4#free_drawing}
     * @type Boolean
     * @default
     */
    // event config
    /**
     * Keep track of the subTargets for Mouse Events, ordered bottom up from innermost nested subTarget
     * @type FabricObject[]
     */
    _defineProperty(this, "targets", []);
    /**
     * hold the list of nested targets hovered
     * @type FabricObject[]
     * @private
     */
    _defineProperty(this, "_hoveredTargets", []);
    /**
     * hold the list of objects to render
     * @type FabricObject[]
     * @private
     */
    _defineProperty(this, "_objectsToRender", void 0);
    /**
     * hold a reference to a data structure that contains information
     * on the current on going transform
     * @type
     * @private
     */
    _defineProperty(this, "_currentTransform", null);
    /**
     * hold a reference to a data structure used to track the selection
     * box on canvas drag
     * on the current on going transform
     * x, y, deltaX and deltaY are in scene plane
     * @type
     * @private
     */
    _defineProperty(this, "_groupSelector", null);
    /**
     * internal flag used to understand if the context top requires a cleanup
     * in case this is true, the contextTop will be cleared at the next render
     * @type boolean
     * @private
     */
    _defineProperty(this, "contextTopDirty", false);
  }
  static getDefaults() {
    return _objectSpread2(_objectSpread2({}, super.getDefaults()), SelectableCanvas.ownDefaults);
  }
  get upperCanvasEl() {
    var _this$elements$upper;
    return (_this$elements$upper = this.elements.upper) === null || _this$elements$upper === void 0 ? void 0 : _this$elements$upper.el;
  }
  get contextTop() {
    var _this$elements$upper2;
    return (_this$elements$upper2 = this.elements.upper) === null || _this$elements$upper2 === void 0 ? void 0 : _this$elements$upper2.ctx;
  }
  get wrapperEl() {
    return this.elements.container;
  }
  initElements(el) {
    this.elements = new CanvasDOMManager(el, {
      allowTouchScrolling: this.allowTouchScrolling,
      containerClass: this.containerClass
    });
    this._createCacheCanvas();
  }

  /**
   * @private
   * @param {FabricObject} obj Object that was added
   */
  _onObjectAdded(obj) {
    this._objectsToRender = undefined;
    super._onObjectAdded(obj);
  }

  /**
   * @private
   * @param {FabricObject} obj Object that was removed
   */
  _onObjectRemoved(obj) {
    this._objectsToRender = undefined;
    // removing active object should fire "selection:cleared" events
    if (obj === this._activeObject) {
      this.fire('before:selection:cleared', {
        deselected: [obj]
      });
      this._discardActiveObject();
      this.fire('selection:cleared', {
        deselected: [obj]
      });
      obj.fire('deselected', {
        target: obj
      });
    }
    if (obj === this._hoveredTarget) {
      this._hoveredTarget = undefined;
      this._hoveredTargets = [];
    }
    super._onObjectRemoved(obj);
  }
  _onStackOrderChanged() {
    this._objectsToRender = undefined;
    super._onStackOrderChanged();
  }

  /**
   * Divides objects in two groups, one to render immediately
   * and one to render as activeGroup.
   * @return {Array} objects to render immediately and pushes the other in the activeGroup.
   */
  _chooseObjectsToRender() {
    const activeObject = this._activeObject;
    return !this.preserveObjectStacking && activeObject ? this._objects.filter(object => !object.group && object !== activeObject).concat(activeObject) : this._objects;
  }

  /**
   * Renders both the top canvas and the secondary container canvas.
   */
  renderAll() {
    this.cancelRequestedRender();
    if (this.destroyed) {
      return;
    }
    if (this.contextTopDirty && !this._groupSelector && !this.isDrawingMode) {
      this.clearContext(this.contextTop);
      this.contextTopDirty = false;
    }
    if (this.hasLostContext) {
      this.renderTopLayer(this.contextTop);
      this.hasLostContext = false;
    }
    !this._objectsToRender && (this._objectsToRender = this._chooseObjectsToRender());
    this.renderCanvas(this.getContext(), this._objectsToRender);
  }

  /**
   * text selection is rendered by the active text instance during the rendering cycle
   */
  renderTopLayer(ctx) {
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
  }

  /**
   * Method to render only the top canvas.
   * Also used to render the group selection box.
   * Does not render text selection.
   */
  renderTop() {
    const ctx = this.contextTop;
    this.clearContext(ctx);
    this.renderTopLayer(ctx);
    // todo: how do i know if the after:render is for the top or normal contex?
    this.fire('after:render', {
      ctx
    });
  }

  /**
   * Set the canvas tolerance value for pixel taret find.
   * Use only integer numbers.
   * @private
   */
  setTargetFindTolerance(value) {
    value = Math.round(value);
    this.targetFindTolerance = value;
    const retina = this.getRetinaScaling();
    const size = Math.ceil((value * 2 + 1) * retina);
    this.pixelFindCanvasEl.width = this.pixelFindCanvasEl.height = size;
    this.pixelFindContext.scale(retina, retina);
  }

  /**
   * Returns true if object is transparent at a certain location
   * Clarification: this is `is target transparent at location X or are controls there`
   * @TODO this seems dumb that we treat controls with transparency. we can find controls
   * programmatically without painting them, the cache canvas optimization is always valid
   * @param {FabricObject} target Object to check
   * @param {Number} x Left coordinate in viewport space
   * @param {Number} y Top coordinate in viewport space
   * @return {Boolean}
   */
  isTargetTransparent(target, x, y) {
    const tolerance = this.targetFindTolerance;
    const ctx = this.pixelFindContext;
    this.clearContext(ctx);
    ctx.save();
    ctx.translate(-x + tolerance, -y + tolerance);
    ctx.transform(...this.viewportTransform);
    const selectionBgc = target.selectionBackgroundColor;
    target.selectionBackgroundColor = '';
    target.render(ctx);
    target.selectionBackgroundColor = selectionBgc;
    ctx.restore();
    // our canvas is square, and made around tolerance.
    // so tolerance in this case also represent the center of the canvas.
    const enhancedTolerance = Math.round(tolerance * this.getRetinaScaling());
    return isTransparent(ctx, enhancedTolerance, enhancedTolerance, enhancedTolerance);
  }

  /**
   * takes an event and determines if selection key has been pressed
   * @private
   * @param {TPointerEvent} e Event object
   */
  _isSelectionKeyPressed(e) {
    const sKey = this.selectionKey;
    if (!sKey) {
      return false;
    }
    if (Array.isArray(sKey)) {
      return !!sKey.find(key => !!key && e[key] === true);
    } else {
      return e[sKey];
    }
  }

  /**
   * @private
   * @param {TPointerEvent} e Event object
   * @param {FabricObject} target
   */
  _shouldClearSelection(e, target) {
    const activeObjects = this.getActiveObjects(),
      activeObject = this._activeObject;
    return !!(!target || target && activeObject && activeObjects.length > 1 && activeObjects.indexOf(target) === -1 && activeObject !== target && !this._isSelectionKeyPressed(e) || target && !target.evented || target && !target.selectable && activeObject && activeObject !== target);
  }

  /**
   * This method will take in consideration a modifier key pressed and the control we are
   * about to drag, and try to guess the anchor point ( origin ) of the transormation.
   * This should be really in the realm of controls, and we should remove specific code for legacy
   * embedded actions.
   * @TODO this probably deserve discussion/rediscovery and change/refactor
   * @private
   * @deprecated
   * @param {FabricObject} target
   * @param {string} action
   * @param {boolean} altKey
   * @returns {boolean} true if the transformation should be centered
   */
  _shouldCenterTransform(target, action, modifierKeyPressed) {
    if (!target) {
      return;
    }
    let centerTransform;
    if (action === SCALE || action === SCALE_X || action === SCALE_Y || action === RESIZING) {
      centerTransform = this.centeredScaling || target.centeredScaling;
    } else if (action === ROTATE) {
      centerTransform = this.centeredRotation || target.centeredRotation;
    }
    return centerTransform ? !modifierKeyPressed : modifierKeyPressed;
  }

  /**
   * Given the control clicked, determine the origin of the transform.
   * This is bad because controls can totally have custom names
   * should disappear before release 4.0
   * @private
   * @deprecated
   */
  _getOriginFromCorner(target, controlName) {
    const origin = {
      x: target.originX,
      y: target.originY
    };
    if (!controlName) {
      return origin;
    }

    // is a left control ?
    if (['ml', 'tl', 'bl'].includes(controlName)) {
      origin.x = RIGHT;
      // is a right control ?
    } else if (['mr', 'tr', 'br'].includes(controlName)) {
      origin.x = LEFT;
    }
    // is a top control ?
    if (['tl', 'mt', 'tr'].includes(controlName)) {
      origin.y = BOTTOM;
      // is a bottom control ?
    } else if (['bl', 'mb', 'br'].includes(controlName)) {
      origin.y = TOP;
    }
    return origin;
  }

  /**
   * @private
   * @param {Event} e Event object
   * @param {FabricObject} target
   * @param {boolean} [alreadySelected] pass true to setup the active control
   */
  _setupCurrentTransform(e, target, alreadySelected) {
    var _control$getActionHan;
    const pointer = target.group ?
    // transform pointer to target's containing coordinate plane
    sendPointToPlane(this.getScenePoint(e), undefined, target.group.calcTransformMatrix()) : this.getScenePoint(e);
    const {
        key: corner = '',
        control
      } = target.getActiveControl() || {},
      actionHandler = alreadySelected && control ? (_control$getActionHan = control.getActionHandler(e, target, control)) === null || _control$getActionHan === void 0 ? void 0 : _control$getActionHan.bind(control) : dragHandler,
      action = getActionFromCorner(alreadySelected, corner, e, target),
      altKey = e[this.centeredKey],
      origin = this._shouldCenterTransform(target, action, altKey) ? {
        x: CENTER,
        y: CENTER
      } : this._getOriginFromCorner(target, corner),
      /**
       * relative to target's containing coordinate plane
       * both agree on every point
       **/
      transform = {
        target: target,
        action,
        actionHandler,
        actionPerformed: false,
        corner,
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
        altKey,
        original: _objectSpread2(_objectSpread2({}, saveObjectTransform(target)), {}, {
          originX: origin.x,
          originY: origin.y
        })
      };
    this._currentTransform = transform;
    this.fire('before:transform', {
      e,
      transform
    });
  }

  /**
   * Set the cursor type of the canvas element
   * @param {String} value Cursor type of the canvas element.
   * @see http://www.w3.org/TR/css3-ui/#cursor
   */
  setCursor(value) {
    this.upperCanvasEl.style.cursor = value;
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx to draw the selection on
   */
  _drawSelection(ctx) {
    const {
        x,
        y,
        deltaX,
        deltaY
      } = this._groupSelector,
      start = new Point(x, y).transform(this.viewportTransform),
      extent = new Point(x + deltaX, y + deltaY).transform(this.viewportTransform),
      strokeOffset = this.selectionLineWidth / 2;
    let minX = Math.min(start.x, extent.x),
      minY = Math.min(start.y, extent.y),
      maxX = Math.max(start.x, extent.x),
      maxY = Math.max(start.y, extent.y);
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
    // @TODO: is _setLineDash still necessary on modern canvas?
    FabricObject.prototype._setLineDash.call(this, ctx, this.selectionDashArray);
    ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
  }

  /**
   * Method that determines what object we are clicking on
   * 11/09/2018 TODO: would be cool if findTarget could discern between being a full target
   * or the outside part of the corner.
   * @param {Event} e mouse event
   * @return {FabricObject | null} the target found
   */
  findTarget(e) {
    if (this.skipTargetFind) {
      return undefined;
    }
    const pointer = this.getViewportPoint(e),
      activeObject = this._activeObject,
      aObjects = this.getActiveObjects();
    this.targets = [];
    if (activeObject && aObjects.length >= 1) {
      if (activeObject.findControl(pointer, isTouchEvent(e))) {
        // if we hit the corner of the active object, let's return that.
        return activeObject;
      } else if (aObjects.length > 1 &&
      // check pointer is over active selection and possibly perform `subTargetCheck`
      this.searchPossibleTargets([activeObject], pointer)) {
        // active selection does not select sub targets like normal groups
        return activeObject;
      } else if (activeObject === this.searchPossibleTargets([activeObject], pointer)) {
        // active object is not an active selection
        if (!this.preserveObjectStacking) {
          return activeObject;
        } else {
          const subTargets = this.targets;
          this.targets = [];
          const target = this.searchPossibleTargets(this._objects, pointer);
          if (e[this.altSelectionKey] && target && target !== activeObject) {
            // alt selection: select active object even though it is not the top most target
            // restore targets
            this.targets = subTargets;
            return activeObject;
          }
          return target;
        }
      }
    }
    return this.searchPossibleTargets(this._objects, pointer);
  }

  /**
   * Checks if the point is inside the object selection area including padding
   * @param {FabricObject} obj Object to test against
   * @param {Object} [pointer] point in scene coordinates
   * @return {Boolean} true if point is contained within an area of given object
   * @private
   */
  _pointIsInObjectSelectionArea(obj, point) {
    // getCoords will already take care of group de-nesting
    let coords = obj.getCoords();
    const viewportZoom = this.getZoom();
    const padding = obj.padding / viewportZoom;
    if (padding) {
      const [tl, tr, br, bl] = coords;
      // what is the angle of the object?
      // we could use getTotalAngle, but is way easier to look at it
      // from how coords are oriented, since if something went wrong
      // at least we are consistent.
      const angleRadians = Math.atan2(tr.y - tl.y, tr.x - tl.x),
        cosP = cos(angleRadians) * padding,
        sinP = sin(angleRadians) * padding,
        cosPSinP = cosP + sinP,
        cosPMinusSinP = cosP - sinP;
      coords = [new Point(tl.x - cosPMinusSinP, tl.y - cosPSinP), new Point(tr.x + cosPSinP, tr.y - cosPMinusSinP), new Point(br.x + cosPMinusSinP, br.y + cosPSinP), new Point(bl.x - cosPSinP, bl.y + cosPMinusSinP)];
      // in case of padding we calculate the new coords on the fly.
      // otherwise we have to maintain 2 sets of coordinates for everything.
      // we can reiterate on storing them.
      // if this is slow, for now the semplification is large and doesn't impact
      // rendering.
      // the idea behind this is that outside target check we don't need ot know
      // where those coords are
    }
    return Intersection.isPointInPolygon(point, coords);
  }

  /**
   * Checks point is inside the object selection condition. Either area with padding
   * or over pixels if perPixelTargetFind is enabled
   * @param {FabricObject} obj Object to test against
   * @param {Object} [pointer] point from viewport.
   * @return {Boolean} true if point is contained within an area of given object
   * @private
   */
  _checkTarget(obj, pointer) {
    if (obj && obj.visible && obj.evented && this._pointIsInObjectSelectionArea(obj, sendPointToPlane(pointer, undefined, this.viewportTransform))) {
      if ((this.perPixelTargetFind || obj.perPixelTargetFind) && !obj.isEditing) {
        if (!this.isTargetTransparent(obj, pointer.x, pointer.y)) {
          return true;
        }
      } else {
        return true;
      }
    }
    return false;
  }

  /**
   * Internal Function used to search inside objects an object that contains pointer in bounding box or that contains pointerOnCanvas when painted
   * @param {Array} [objects] objects array to look into
   * @param {Object} [pointer] x,y object of point coordinates we want to check.
   * @return {FabricObject} **top most object from given `objects`** that contains pointer
   * @private
   */
  _searchPossibleTargets(objects, pointer) {
    // Cache all targets where their bounding box contains point.
    let i = objects.length;
    // Do not check for currently grouped objects, since we check the parent group itself.
    // until we call this function specifically to search inside the activeGroup
    while (i--) {
      const target = objects[i];
      if (this._checkTarget(target, pointer)) {
        if (isCollection(target) && target.subTargetCheck) {
          const subTarget = this._searchPossibleTargets(target._objects, pointer);
          subTarget && this.targets.push(subTarget);
        }
        return target;
      }
    }
  }

  /**
   * Function used to search inside objects an object that contains pointer in bounding box or that contains pointerOnCanvas when painted
   * @see {@link _searchPossibleTargets}
   * @param {FabricObject[]} [objects] objects array to look into
   * @param {Point} [pointer] coordinates from viewport to check.
   * @return {FabricObject} **top most object on screen** that contains pointer
   */
  searchPossibleTargets(objects, pointer) {
    const target = this._searchPossibleTargets(objects, pointer);

    // if we found something in this.targets, and the group is interactive, return the innermost subTarget
    // that is still interactive
    // TODO: reverify why interactive. the target should be returned always, but selected only
    // if interactive.
    if (target && isCollection(target) && target.interactive && this.targets[0]) {
      /** targets[0] is the innermost nested target, but it could be inside non interactive groups and so not a selection target */
      const targets = this.targets;
      for (let i = targets.length - 1; i > 0; i--) {
        const t = targets[i];
        if (!(isCollection(t) && t.interactive)) {
          // one of the subtargets was not interactive. that is the last subtarget we can return.
          // we can't dig more deep;
          return t;
        }
      }
      return targets[0];
    }
    return target;
  }

  /**
   * @returns point existing in the same plane as the {@link HTMLCanvasElement},
   * `(0, 0)` being the top left corner of the {@link HTMLCanvasElement}.
   * This means that changes to the {@link viewportTransform} do not change the values of the point
   * and it remains unchanged from the viewer's perspective.
   *
   * @example
   * const scenePoint = sendPointToPlane(
   *  this.getViewportPoint(e),
   *  undefined,
   *  canvas.viewportTransform
   * );
   *
   */
  getViewportPoint(e) {
    if (this._pointer) {
      return this._pointer;
    }
    return this.getPointer(e, true);
  }

  /**
   * @returns point existing in the scene (the same plane as the plane {@link FabricObject#getCenterPoint} exists in).
   * This means that changes to the {@link viewportTransform} do not change the values of the point,
   * however, from the viewer's perspective, the point is changed.
   *
   * @example
   * const viewportPoint = sendPointToPlane(
   *  this.getScenePoint(e),
   *  canvas.viewportTransform
   * );
   *
   */
  getScenePoint(e) {
    if (this._absolutePointer) {
      return this._absolutePointer;
    }
    return this.getPointer(e);
  }

  /**
   * Returns pointer relative to canvas.
   *
   * @deprecated This method is deprecated since v6 to protect you from misuse.
   * Use {@link getViewportPoint} or {@link getScenePoint} instead.
   *
   * @param {Event} e
   * @param {Boolean} [fromViewport] whether to return the point from the viewport or in the scene
   * @return {Point}
   */
  getPointer(e) {
    let fromViewport = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const upperCanvasEl = this.upperCanvasEl,
      bounds = upperCanvasEl.getBoundingClientRect();
    let pointer = getPointer(e),
      boundsWidth = bounds.width || 0,
      boundsHeight = bounds.height || 0;
    if (!boundsWidth || !boundsHeight) {
      if (TOP in bounds && BOTTOM in bounds) {
        boundsHeight = Math.abs(bounds.top - bounds.bottom);
      }
      if (RIGHT in bounds && LEFT in bounds) {
        boundsWidth = Math.abs(bounds.right - bounds.left);
      }
    }
    this.calcOffset();
    pointer.x = pointer.x - this._offset.left;
    pointer.y = pointer.y - this._offset.top;
    if (!fromViewport) {
      pointer = sendPointToPlane(pointer, undefined, this.viewportTransform);
    }
    const retinaScaling = this.getRetinaScaling();
    if (retinaScaling !== 1) {
      pointer.x /= retinaScaling;
      pointer.y /= retinaScaling;
    }

    // If bounds are not available (i.e. not visible), do not apply scale.
    const cssScale = boundsWidth === 0 || boundsHeight === 0 ? new Point(1, 1) : new Point(upperCanvasEl.width / boundsWidth, upperCanvasEl.height / boundsHeight);
    return pointer.multiply(cssScale);
  }

  /**
   * Internal use only
   * @protected
   */
  _setDimensionsImpl(dimensions, options) {
    // @ts-expect-error this method exists in the subclass - should be moved or declared as abstract
    this._resetTransformEventData();
    super._setDimensionsImpl(dimensions, options);
    if (this._isCurrentlyDrawing) {
      this.freeDrawingBrush && this.freeDrawingBrush._setBrushStyles(this.contextTop);
    }
  }
  _createCacheCanvas() {
    this.pixelFindCanvasEl = createCanvasElement();
    this.pixelFindContext = this.pixelFindCanvasEl.getContext('2d', {
      willReadFrequently: true
    });
    this.setTargetFindTolerance(this.targetFindTolerance);
  }

  /**
   * Returns context of top canvas where interactions are drawn
   * @returns {CanvasRenderingContext2D}
   */
  getTopContext() {
    return this.elements.upper.ctx;
  }

  /**
   * Returns context of canvas where object selection is drawn
   * @alias
   * @return {CanvasRenderingContext2D}
   */
  getSelectionContext() {
    return this.elements.upper.ctx;
  }

  /**
   * Returns &lt;canvas> element on which object selection is drawn
   * @return {HTMLCanvasElement}
   */
  getSelectionElement() {
    return this.elements.upper.el;
  }

  /**
   * Returns currently active object
   * @return {FabricObject | null} active object
   */
  getActiveObject() {
    return this._activeObject;
  }

  /**
   * Returns an array with the current selected objects
   * @return {FabricObject[]} active objects array
   */
  getActiveObjects() {
    const active = this._activeObject;
    return isActiveSelection(active) ? active.getObjects() : active ? [active] : [];
  }

  /**
   * @private
   * Compares the old activeObject with the current one and fires correct events
   * @param {FabricObject[]} oldObjects old activeObject
   * @param {TPointerEvent} e mouse event triggering the selection events
   */
  _fireSelectionEvents(oldObjects, e) {
    let somethingChanged = false,
      invalidate = false;
    const objects = this.getActiveObjects(),
      added = [],
      removed = [];
    oldObjects.forEach(target => {
      if (!objects.includes(target)) {
        somethingChanged = true;
        target.fire('deselected', {
          e,
          target
        });
        removed.push(target);
      }
    });
    objects.forEach(target => {
      if (!oldObjects.includes(target)) {
        somethingChanged = true;
        target.fire('selected', {
          e,
          target
        });
        added.push(target);
      }
    });
    if (oldObjects.length > 0 && objects.length > 0) {
      invalidate = true;
      somethingChanged && this.fire('selection:updated', {
        e,
        selected: added,
        deselected: removed
      });
    } else if (objects.length > 0) {
      invalidate = true;
      this.fire('selection:created', {
        e,
        selected: added
      });
    } else if (oldObjects.length > 0) {
      invalidate = true;
      this.fire('selection:cleared', {
        e,
        deselected: removed
      });
    }
    invalidate && (this._objectsToRender = undefined);
  }

  /**
   * Sets given object as the only active object on canvas
   * @param {FabricObject} object Object to set as an active one
   * @param {TPointerEvent} [e] Event (passed along when firing "object:selected")
   * @return {Boolean} true if the object has been selected
   */
  setActiveObject(object, e) {
    // we can't inline this, since _setActiveObject will change what getActiveObjects returns
    const currentActives = this.getActiveObjects();
    const selected = this._setActiveObject(object, e);
    this._fireSelectionEvents(currentActives, e);
    return selected;
  }

  /**
   * This is supposed to be equivalent to setActiveObject but without firing
   * any event. There is commitment to have this stay this way.
   * This is the functional part of setActiveObject.
   * @param {Object} object to set as active
   * @param {Event} [e] Event (passed along when firing "object:selected")
   * @return {Boolean} true if the object has been selected
   */
  _setActiveObject(object, e) {
    const prevActiveObject = this._activeObject;
    if (prevActiveObject === object) {
      return false;
    }
    // after calling this._discardActiveObject, this,_activeObject could be undefined
    if (!this._discardActiveObject(e, object) && this._activeObject) {
      // refused to deselect
      return false;
    }
    if (object.onSelect({
      e
    })) {
      return false;
    }
    this._activeObject = object;
    if (isActiveSelection(object) && prevActiveObject !== object) {
      object.set('canvas', this);
    }
    object.setCoords();
    return true;
  }

  /**
   * This is supposed to be equivalent to discardActiveObject but without firing
   * any selection events ( can still fire object transformation events ). There is commitment to have this stay this way.
   * This is the functional part of discardActiveObject.
   * @param {Event} [e] Event (passed along when firing "object:deselected")
   * @param {Object} object the next object to set as active, reason why we are discarding this
   * @return {Boolean} true if the active object has been discarded
   */
  _discardActiveObject(e, object) {
    const obj = this._activeObject;
    if (obj) {
      // onDeselect return TRUE to cancel selection;
      if (obj.onDeselect({
        e,
        object
      })) {
        return false;
      }
      if (this._currentTransform && this._currentTransform.target === obj) {
        this.endCurrentTransform(e);
      }
      if (isActiveSelection(obj) && obj === this._hoveredTarget) {
        this._hoveredTarget = undefined;
      }
      this._activeObject = undefined;
      return true;
    }
    return false;
  }

  /**
   * Discards currently active object and fire events. If the function is called by fabric
   * as a consequence of a mouse event, the event is passed as a parameter and
   * sent to the fire function for the custom events. When used as a method the
   * e param does not have any application.
   * @param {event} e
   * @return {Boolean} true if the active object has been discarded
   */
  discardActiveObject(e) {
    const currentActives = this.getActiveObjects(),
      activeObject = this.getActiveObject();
    if (currentActives.length) {
      this.fire('before:selection:cleared', {
        e,
        deselected: [activeObject]
      });
    }
    const discarded = this._discardActiveObject(e);
    this._fireSelectionEvents(currentActives, e);
    return discarded;
  }

  /**
   * End the current transform.
   * You don't usually need to call this method unless you are interrupting a user initiated transform
   * because of some other event ( a press of key combination, or something that block the user UX )
   * @param {Event} [e] send the mouse event that generate the finalize down, so it can be used in the event
   */
  endCurrentTransform(e) {
    const transform = this._currentTransform;
    this._finalizeCurrentTransform(e);
    if (transform && transform.target) {
      // this could probably go inside _finalizeCurrentTransform
      transform.target.isMoving = false;
    }
    this._currentTransform = null;
  }

  /**
   * @private
   * @param {Event} e send the mouse event that generate the finalize down, so it can be used in the event
   */
  _finalizeCurrentTransform(e) {
    const transform = this._currentTransform,
      target = transform.target,
      options = {
        e,
        target,
        transform,
        action: transform.action
      };
    if (target._scaling) {
      target._scaling = false;
    }
    target.setCoords();
    if (transform.actionPerformed) {
      this.fire('object:modified', options);
      target.fire(MODIFIED, options);
    }
  }

  /**
   * Sets viewport transformation of this canvas instance
   * @param {Array} vpt a Canvas 2D API transform matrix
   */
  setViewportTransform(vpt) {
    super.setViewportTransform(vpt);
    const activeObject = this._activeObject;
    if (activeObject) {
      activeObject.setCoords();
    }
  }

  /**
   * @override clears active selection ref and interactive canvas elements and contexts
   */
  destroy() {
    // dispose of active selection
    const activeObject = this._activeObject;
    if (isActiveSelection(activeObject)) {
      activeObject.removeAll();
      activeObject.dispose();
    }
    delete this._activeObject;
    super.destroy();

    // free resources

    // pixel find canvas
    // @ts-expect-error disposing
    this.pixelFindContext = null;
    // @ts-expect-error disposing
    this.pixelFindCanvasEl = undefined;
  }

  /**
   * Clears all contexts (background, main, top) of an instance
   */
  clear() {
    // discard active object and fire events
    this.discardActiveObject();
    // make sure we clear the active object in case it refused to be discarded
    this._activeObject = undefined;
    this.clearContext(this.contextTop);
    super.clear();
  }

  /**
   * Draws objects' controls (borders/controls)
   * @param {CanvasRenderingContext2D} ctx Context to render controls on
   */
  drawControls(ctx) {
    const activeObject = this._activeObject;
    if (activeObject) {
      activeObject._renderControls(ctx);
    }
  }

  /**
   * @private
   */
  _toObject(instance, methodName, propertiesToInclude) {
    // If the object is part of the current selection group, it should
    // be transformed appropriately
    // i.e. it should be serialised as it would appear if the selection group
    // were to be destroyed.
    const originalProperties = this._realizeGroupTransformOnObject(instance),
      object = super._toObject(instance, methodName, propertiesToInclude);
    //Undo the damage we did by changing all of its properties
    instance.set(originalProperties);
    return object;
  }

  /**
   * Realizes an object's group transformation on it
   * @private
   * @param {FabricObject} [instance] the object to transform (gets mutated)
   * @returns the original values of instance which were changed
   */
  _realizeGroupTransformOnObject(instance) {
    const {
      group
    } = instance;
    if (group && isActiveSelection(group) && this._activeObject === group) {
      const layoutProps = ['angle', 'flipX', 'flipY', LEFT, SCALE_X, SCALE_Y, SKEW_X, SKEW_Y, TOP];
      const originalValues = pick(instance, layoutProps);
      addTransformToObject(instance, group.calcOwnMatrix());
      return originalValues;
    } else {
      return {};
    }
  }

  /**
   * @private
   */
  _setSVGObject(markup, instance, reviver) {
    // If the object is in a selection group, simulate what would happen to that
    // object when the group is deselected
    const originalProperties = this._realizeGroupTransformOnObject(instance);
    super._setSVGObject(markup, instance, reviver);
    instance.set(originalProperties);
  }
}
_defineProperty(SelectableCanvas, "ownDefaults", canvasDefaults);

export { SelectableCanvas };
//# sourceMappingURL=SelectableCanvas.mjs.map
