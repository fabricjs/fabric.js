import { getDocument, getEnv } from '../env';
import { dragHandler } from '../controls/drag';
import { getActionFromCorner } from '../controls/util';
import { Point } from '../Point';
import { FabricObject } from '../shapes/Object/FabricObject';
import {
  CanvasEvents,
  ModifierKey,
  TOptionalModifierKey,
  TPointerEvent,
  Transform,
} from '../EventTypeDefs';
import {
  addTransformToObject,
  resetObjectTransform,
  saveObjectTransform,
} from '../util/misc/objectTransforms';
import { StaticCanvas, TCanvasSizeOptions } from './StaticCanvas';
import { isCollection } from '../util/types';
import { invertTransform, transformPoint } from '../util/misc/matrix';
import { isTransparent } from '../util/misc/isTransparent';
import { AssertKeys, TMat2D, TOriginX, TOriginY, TSize } from '../typedefs';
import { degreesToRadians } from '../util/misc/radiansDegreesConversion';
import { getPointer, isTouchEvent } from '../util/dom_event';
import type { IText } from '../shapes/IText/IText';
import { makeElementUnselectable, wrapElement } from '../util/dom_misc';
import { setStyle } from '../util/dom_style';
import type { BaseBrush } from '../brushes/BaseBrush';
import { pick } from '../util/misc/pick';
import { TSVGReviver } from '../typedefs';
import { sendPointToPlane } from '../util/misc/planeChange';
import { ActiveSelection } from '../shapes/ActiveSelection';
import type { TDestroyedCanvas } from './StaticCanvas';

export const DefaultCanvasProperties = {
  uniformScaling: true,
  uniScaleKey: 'shiftKey',
  centeredScaling: false,
  centeredRotation: false,
  centeredKey: 'altKey',
  altActionKey: 'shiftKey',
  selection: true,
  selectionKey: 'shiftKey',
  selectionColor: 'rgba(100, 100, 255, 0.3)', // blue
  selectionDashArray: [],
  selectionBorderColor: 'rgba(255, 255, 255, 0.3)',
  selectionLineWidth: 1,
  selectionFullyContained: false,
  hoverCursor: 'move',
  moveCursor: 'move',
  defaultCursor: 'default',
  freeDrawingCursor: 'crosshair',
  notAllowedCursor: 'not-allowed',
  containerClass: 'canvas-container',
  perPixelTargetFind: false,
  targetFindTolerance: 0,
  skipTargetFind: false,
  preserveObjectStacking: false,
  stopContextMenu: false,
  fireRightClick: false,
  fireMiddleClick: false,
  enablePointerEvents: false,
};

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
export class SelectableCanvas<
  EventSpec extends CanvasEvents = CanvasEvents
> extends StaticCanvas<EventSpec> {
  declare _objects: FabricObject[];
  /**
   * When true, objects can be transformed by one side (unproportionally)
   * when dragged on the corners that normally would not do that.
   * @type Boolean
   * @default
   * @since fabric 4.0 // changed name and default value
   */
  declare uniformScaling: boolean;

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
  declare uniScaleKey: TOptionalModifierKey;

  /**
   * When true, objects use center point as the origin of scale transformation.
   * <b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).
   * @since 1.3.4
   * @type Boolean
   * @default
   */
  declare centeredScaling: boolean;

  /**
   * When true, objects use center point as the origin of rotate transformation.
   * <b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).
   * @since 1.3.4
   * @type Boolean
   * @default
   */
  declare centeredRotation: boolean;

  /**
   * Indicates which key enable centered Transform
   * values: 'altKey', 'shiftKey', 'ctrlKey'.
   * If `null` or 'none' or any other string that is not a modifier key
   * feature is disabled feature disabled.
   * @since 1.6.2
   * @type ModifierKey
   * @default
   */
  declare centeredKey: TOptionalModifierKey;

  /**
   * Indicates which key enable alternate action on corner
   * values: 'altKey', 'shiftKey', 'ctrlKey'.
   * If `null` or 'none' or any other string that is not a modifier key
   * feature is disabled feature disabled.
   * @since 1.6.2
   * @type ModifierKey
   * @default
   */
  declare altActionKey: TOptionalModifierKey;

  /**
   * Indicates that canvas is interactive. This property should not be changed.
   * @type Boolean
   * @default
   */
  interactive = true;

  /**
   * Indicates whether group selection should be enabled
   * @type Boolean
   * @default
   */
  declare selection: boolean;

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
  declare selectionKey: TOptionalModifierKey | ModifierKey[];

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
  declare altSelectionKey: TOptionalModifierKey;

  /**
   * Color of selection
   * @type String
   * @default
   */
  declare selectionColor: string;

  /**
   * Default dash array pattern
   * If not empty the selection border is dashed
   * @type Array
   */
  declare selectionDashArray: number[];

  /**
   * Color of the border of selection (usually slightly darker than color of selection itself)
   * @type String
   * @default
   */
  declare selectionBorderColor: string;

  /**
   * Width of a line used in object/group selection
   * @type Number
   * @default
   */
  declare selectionLineWidth: number;

  /**
   * Select only shapes that are fully contained in the dragged selection rectangle.
   * @type Boolean
   * @default
   */
  declare selectionFullyContained: boolean;

  /**
   * Default cursor value used when hovering over an object on canvas
   * @type CSSStyleDeclaration['cursor']
   * @default move
   */
  declare hoverCursor: CSSStyleDeclaration['cursor'];

  /**
   * Default cursor value used when moving an object on canvas
   * @type CSSStyleDeclaration['cursor']
   * @default move
   */
  declare moveCursor: CSSStyleDeclaration['cursor'];

  /**
   * Default cursor value used for the entire canvas
   * @type String
   * @default default
   */
  declare defaultCursor: CSSStyleDeclaration['cursor'];

  /**
   * Cursor value used during free drawing
   * @type String
   * @default crosshair
   */
  declare freeDrawingCursor: CSSStyleDeclaration['cursor'];

  /**
   * Cursor value used for disabled elements ( corners with disabled action )
   * @type String
   * @since 2.0.0
   * @default not-allowed
   */
  declare notAllowedCursor: CSSStyleDeclaration['cursor'];

  /**
   * Default element class that's given to wrapper (div) element of canvas
   * @type String
   * @default
   */
  declare containerClass: string;

  /**
   * When true, object detection happens on per-pixel basis rather than on per-bounding-box
   * @type Boolean
   * @default
   */
  declare perPixelTargetFind: boolean;

  /**
   * Number of pixels around target pixel to tolerate (consider active) during object detection
   * @type Number
   * @default
   */
  declare targetFindTolerance: number;

  /**
   * When true, target detection is skipped. Target detection will return always undefined.
   * click selection won't work anymore, events will fire with no targets.
   * if something is selected before setting it to true, it will be deselected at the first click.
   * area selection will still work. check the `selection` property too.
   * if you deactivate both, you should look into staticCanvas.
   * @type Boolean
   * @default
   */
  declare skipTargetFind: boolean;

  /**
   * When true, mouse events on canvas (mousedown/mousemove/mouseup) result in free drawing.
   * After mousedown, mousemove creates a shape,
   * and then mouseup finalizes it and adds an instance of `fabric.Path` onto canvas.
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-4#free_drawing}
   * @type Boolean
   * @default
   */
  declare isDrawingMode: boolean;

  /**
   * Indicates whether objects should remain in current stack position when selected.
   * When false objects are brought to top and rendered as part of the selection group
   * @type Boolean
   * @default
   */
  declare preserveObjectStacking: boolean;

  /**
   * Indicates if the right click on canvas can output the context menu or not
   * @type Boolean
   * @since 1.6.5
   * @default
   */
  declare stopContextMenu: boolean;

  /**
   * Indicates if the canvas can fire right click events
   * @type Boolean
   * @since 1.6.5
   * @default
   */
  declare fireRightClick: boolean;

  /**
   * Indicates if the canvas can fire middle click events
   * @type Boolean
   * @since 1.7.8
   * @default
   */
  declare fireMiddleClick: boolean;

  /**
   * Keep track of the subTargets for Mouse Events
   * @type FabricObject[]
   */
  targets: FabricObject[] = [];

  /**
   * Keep track of the hovered target
   * @type FabricObject | null
   * @private
   */
  declare _hoveredTarget?: FabricObject;

  /**
   * hold the list of nested targets hovered
   * @type FabricObject[]
   * @private
   */
  _hoveredTargets: FabricObject[] = [];

  /**
   * hold the list of objects to render
   * @type FabricObject[]
   * @private
   */
  _objectsToRender?: FabricObject[] = [];

  /**
   * hold a referenfce to a data structure that contains information
   * on the current on going transform
   * @type
   * @private
   */
  _currentTransform: Transform | null = null;

  /**
   * hold a reference to a data structure used to track the selection
   * box on canvas drag
   * on the current on going transform
   * @type
   * @private
   */
  protected _groupSelector: {
    x: number;
    y: number;
    deltaX: number;
    deltaY: number;
  } | null = null;

  /**
   * internal flag used to understand if the context top requires a cleanup
   * in case this is true, the contextTop will be cleared at the next render
   * @type boolean
   * @private
   */
  contextTopDirty = false;

  /**
   * During a mouse event we may need the pointer multiple times in multiple functions.
   * _absolutePointer holds a reference to the pointer in fabricCanvas/design coordinates that is valid for the event
   * lifespan. Every fabricJS mouse event create and delete the cache every time
   * We do this because there are some HTML DOM inspection functions to get the actual pointer coordinates
   * @type {Point}
   */
  protected declare _absolutePointer?: Point;

  /**
   * During a mouse event we may need the pointer multiple times in multiple functions.
   * _pointer holds a reference to the pointer in html coordinates that is valid for the event
   * lifespan. Every fabricJS mouse event create and delete the cache every time
   * We do this because there are some HTML DOM inspection functions to get the actual pointer coordinates
   * @type {Point}
   */
  protected declare _pointer?: Point;

  /**
   * During a mouse event we may need the target multiple times in multiple functions.
   * _target holds a reference to the target that is valid for the event
   * lifespan. Every fabricJS mouse event create and delete the cache every time
   * @type {FabricObject}
   */
  protected declare _target?: FabricObject;

  static ownDefaults: Record<string, any> = DefaultCanvasProperties;

  static getDefaults(): Record<string, any> {
    return { ...super.getDefaults(), ...SelectableCanvas.ownDefaults };
  }

  declare upperCanvasEl: HTMLCanvasElement;
  declare contextTop: CanvasRenderingContext2D;
  declare wrapperEl: HTMLDivElement;
  private declare pixelFindCanvasEl: HTMLCanvasElement;
  private declare pixelFindContext: CanvasRenderingContext2D;

  protected declare _isCurrentlyDrawing: boolean;
  declare freeDrawingBrush?: BaseBrush;
  declare _activeObject?: FabricObject;
  protected readonly _activeSelection: ActiveSelection;

  constructor(el: string | HTMLCanvasElement, options = {}) {
    super(el, options);
    this._activeSelection = new ActiveSelection([], { canvas: this });
  }

  protected initElements(el: string | HTMLCanvasElement) {
    super.initElements(el);
    this._applyCanvasStyle(this.lowerCanvasEl);
    this._initWrapperElement();
    this._createUpperCanvas();
    this._createCacheCanvas();
  }

  protected _initRetinaScaling() {
    super._initRetinaScaling();
    this.__initRetinaScaling(this.upperCanvasEl, this.contextTop);
  }

  /**
   * @private
   * @param {FabricObject} obj Object that was added
   */
  _onObjectAdded(obj: FabricObject) {
    this._objectsToRender = undefined;
    super._onObjectAdded(obj);
  }

  /**
   * @private
   * @param {FabricObject} obj Object that was removed
   */
  _onObjectRemoved(obj: FabricObject) {
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
      this._hoveredTarget = undefined;
      this._hoveredTargets = [];
    }
    super._onObjectRemoved(obj);
  }

  /**
   * Divides objects in two groups, one to render immediately
   * and one to render as activeGroup.
   * @return {Array} objects to render immediately and pushes the other in the activeGroup.
   */
  _chooseObjectsToRender(): FabricObject[] {
    const activeObject = this._activeObject;
    return !this.preserveObjectStacking && activeObject
      ? this._objects
          .filter((object) => !object.group && object !== activeObject)
          .concat(activeObject)
      : this._objects;
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
    !this._objectsToRender &&
      (this._objectsToRender = this._chooseObjectsToRender());
    this.renderCanvas(this.contextContainer, this._objectsToRender);
  }

  /**
   * text selection is rendered by the active text instance during the rendering cycle
   */
  renderTopLayer(ctx: CanvasRenderingContext2D): void {
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
    this.fire('after:render', { ctx });
  }

  /**
   * Given a pointer on the canvas with a viewport applied,
   * find out the pointer in object coordinates
   * @private
   */
  _normalizePointer(object: FabricObject, pointer: Point): Point {
    return transformPoint(
      this.restorePointerVpt(pointer),
      invertTransform(object.calcTransformMatrix())
    );
  }

  /**
   * Set the canvas tolerance value for pixel taret find.
   * Use only integer numbers.
   * @private
   */
  setTargetFindTolerance(value: number) {
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
   * @param {Number} x Left coordinate
   * @param {Number} y Top coordinate
   * @return {Boolean}
   */
  isTargetTransparent(target: FabricObject, x: number, y: number): boolean {
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
    return isTransparent(
      ctx,
      enhancedTolerance,
      enhancedTolerance,
      enhancedTolerance
    );
  }

  /**
   * takes an event and determines if selection key has been pressed
   * @private
   * @param {TPointerEvent} e Event object
   */
  _isSelectionKeyPressed(e: TPointerEvent): boolean {
    const sKey = this.selectionKey;
    if (!sKey) {
      return false;
    }
    if (Array.isArray(sKey)) {
      return !!sKey.find((key) => !!key && e[key] === true);
    } else {
      return e[sKey];
    }
  }

  /**
   * @private
   * @param {TPointerEvent} e Event object
   * @param {FabricObject} target
   */
  _shouldClearSelection(
    e: TPointerEvent,
    target?: FabricObject
  ): target is undefined {
    const activeObjects = this.getActiveObjects(),
      activeObject = this._activeObject;

    return !!(
      !target ||
      (target &&
        activeObject &&
        activeObjects.length > 1 &&
        activeObjects.indexOf(target) === -1 &&
        activeObject !== target &&
        !this._isSelectionKeyPressed(e)) ||
      (target && !target.evented) ||
      (target && !target.selectable && activeObject && activeObject !== target)
    );
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
  private _shouldCenterTransform(
    target: FabricObject,
    action: string,
    modifierKeyPressed: boolean
  ) {
    if (!target) {
      return;
    }

    let centerTransform;

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

    return centerTransform ? !modifierKeyPressed : modifierKeyPressed;
  }

  /**
   * Given the control clicked, determine the origin of the transform.
   * This is bad because controls can totally have custom names
   * should disappear before release 4.0
   * @private
   * @deprecated
   */
  _getOriginFromCorner(
    target: FabricObject,
    controlName: string
  ): { x: TOriginX; y: TOriginY } {
    const origin = {
      x: target.originX,
      y: target.originY,
    };
    // is a left control ?
    if (['ml', 'tl', 'bl'].includes(controlName)) {
      origin.x = 'right';
      // is a right control ?
    } else if (['mr', 'tr', 'br'].includes(controlName)) {
      origin.x = 'left';
    }
    // is a top control ?
    if (['tl', 'mt', 'tr'].includes(controlName)) {
      origin.y = 'bottom';
      // is a bottom control ?
    } else if (['bl', 'mb', 'br'].includes(controlName)) {
      origin.y = 'top';
    }
    return origin;
  }

  /**
   * @private
   * @param {Event} e Event object
   * @param {FaricObject} target
   */
  _setupCurrentTransform(
    e: TPointerEvent,
    target: FabricObject,
    alreadySelected: boolean
  ): void {
    if (!target) {
      return;
    }
    const pointer = target.group
      ? // transform pointer to target's containing coordinate plane
        sendPointToPlane(
          this.getPointer(e),
          undefined,
          target.group.calcTransformMatrix()
        )
      : this.getPointer(e);
    const corner = target.__corner || '',
      control = !!corner && target.controls[corner],
      actionHandler =
        alreadySelected && control
          ? control.getActionHandler(e, target, control)
          : dragHandler,
      action = getActionFromCorner(alreadySelected, corner, e, target),
      origin = this._getOriginFromCorner(target, corner),
      altKey = e[this.centeredKey as ModifierKey],
      /**
       * relative to target's containing coordinate plane
       * both agree on every point
       **/
      transform: Transform = {
        target: target,
        action: action,
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
        altKey: altKey,
        original: {
          ...saveObjectTransform(target),
          originX: origin.x,
          originY: origin.y,
        },
      };

    if (this._shouldCenterTransform(target, action, altKey)) {
      transform.originX = 'center';
      transform.originY = 'center';
    }
    this._currentTransform = transform;
    // @ts-ignore
    this._beforeTransform(e);
  }

  /**
   * Set the cursor type of the canvas element
   * @param {String} value Cursor type of the canvas element.
   * @see http://www.w3.org/TR/css3-ui/#cursor
   */
  setCursor(value: CSSStyleDeclaration['cursor']): void {
    this.upperCanvasEl.style.cursor = value;
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx to draw the selection on
   */
  _drawSelection(ctx: CanvasRenderingContext2D): void {
    const { x, y, deltaX, deltaY } = this._groupSelector!,
      start = new Point(x, y).transform(this.viewportTransform),
      extent = new Point(x + deltaX, y + deltaY).transform(
        this.viewportTransform
      ),
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
    FabricObject.prototype._setLineDash.call(
      this,
      ctx,
      this.selectionDashArray
    );
    ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
  }

  /**
   * Method that determines what object we are clicking on
   * 11/09/2018 TODO: would be cool if findTarget could discern between being a full target
   * or the outside part of the corner.
   * @param {Event} e mouse event
   * @return {FabricObject | null} the target found
   */
  findTarget(e: TPointerEvent): FabricObject | undefined {
    if (this.skipTargetFind) {
      return undefined;
    }

    const pointer = this.getPointer(e, true),
      activeObject = this._activeObject,
      aObjects = this.getActiveObjects();

    this.targets = [];

    if (activeObject && aObjects.length >= 1) {
      if (activeObject._findTargetCorner(pointer, isTouchEvent(e))) {
        // if we hit the corner of the active object, let's return that.
        return activeObject;
      } else if (
        aObjects.length > 1 &&
        // check pointer is over active selection and possibly perform `subTargetCheck`
        this.searchPossibleTargets([activeObject], pointer)
      ) {
        // active selection does not select sub targets like normal groups
        return activeObject;
      } else if (
        activeObject === this.searchPossibleTargets([activeObject], pointer)
      ) {
        // active object is not an active selection
        if (!this.preserveObjectStacking) {
          return activeObject;
        } else {
          const subTargets = this.targets;
          this.targets = [];
          const target = this.searchPossibleTargets(this._objects, pointer);
          if (
            e[this.altSelectionKey as ModifierKey] &&
            target &&
            target !== activeObject
          ) {
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
   * Checks point is inside the object.
   * @param {Object} [pointer] x,y object of point coordinates we want to check.
   * @param {FabricObject} obj Object to test against
   * @param {Object} [globalPointer] x,y object of point coordinates relative to canvas used to search per pixel target.
   * @return {Boolean} true if point is contained within an area of given object
   * @private
   */
  _checkTarget(
    pointer: Point,
    obj: FabricObject,
    globalPointer: Point
  ): boolean {
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
        !(obj as unknown as IText).isEditing
      ) {
        if (!this.isTargetTransparent(obj, globalPointer.x, globalPointer.y)) {
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
  _searchPossibleTargets(
    objects: FabricObject[],
    pointer: Point
  ): FabricObject | undefined {
    // Cache all targets where their bounding box contains point.
    let target,
      i = objects.length;
    // Do not check for currently grouped objects, since we check the parent group itself.
    // until we call this function specifically to search inside the activeGroup
    while (i--) {
      const objToCheck = objects[i];
      const pointerToUse = objToCheck.group
        ? this._normalizePointer(objToCheck.group, pointer)
        : pointer;
      if (this._checkTarget(pointerToUse, objToCheck, pointer)) {
        target = objects[i];
        if (isCollection(target) && target.subTargetCheck) {
          const subTarget = this._searchPossibleTargets(
            target._objects as FabricObject[],
            pointer
          );
          subTarget && this.targets.push(subTarget);
        }
        break;
      }
    }
    return target;
  }

  /**
   * Function used to search inside objects an object that contains pointer in bounding box or that contains pointerOnCanvas when painted
   * @see {@link fabric.Canvas#_searchPossibleTargets}
   * @param {FabricObject[]} [objects] objects array to look into
   * @param {Object} [pointer] x,y object of point coordinates we want to check.
   * @return {FabricObject} **top most object on screen** that contains pointer
   */
  searchPossibleTargets(
    objects: FabricObject[],
    pointer: Point
  ): FabricObject | undefined {
    const target = this._searchPossibleTargets(objects, pointer);
    // if we found something in this.targets, and the group is interactive, return that subTarget
    // TODO: reverify why interactive. the target should be returned always, but selected only
    // if interactive.
    return target &&
      isCollection(target) &&
      target.interactive &&
      this.targets[0]
      ? this.targets[0]
      : target;
  }

  /**
   * Returns pointer coordinates without the effect of the viewport
   * @param {Object} pointer with "x" and "y" number values in canvas HTML coordinates
   * @return {Object} object with "x" and "y" number values in fabricCanvas coordinates
   */
  restorePointerVpt(pointer: Point): Point {
    return pointer.transform(invertTransform(this.viewportTransform));
  }

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
  getPointer(e: TPointerEvent, ignoreVpt = false): Point {
    // return cached values if we are in the event processing chain
    if (this._absolutePointer && !ignoreVpt) {
      return this._absolutePointer;
    }
    if (this._pointer && ignoreVpt) {
      return this._pointer;
    }

    const upperCanvasEl = this.upperCanvasEl,
      bounds = upperCanvasEl.getBoundingClientRect();
    let pointer = getPointer(e),
      boundsWidth = bounds.width || 0,
      boundsHeight = bounds.height || 0;

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

    const retinaScaling = this.getRetinaScaling();
    if (retinaScaling !== 1) {
      pointer.x /= retinaScaling;
      pointer.y /= retinaScaling;
    }

    // If bounds are not available (i.e. not visible), do not apply scale.
    const cssScale =
      boundsWidth === 0 || boundsHeight === 0
        ? new Point(1, 1)
        : new Point(
            upperCanvasEl.width / boundsWidth,
            upperCanvasEl.height / boundsHeight
          );

    return pointer.multiply(cssScale);
  }

  /**
   * Internal use only
   * @protected
   */
  protected _setDimensionsImpl(
    dimensions: TSize,
    options?: TCanvasSizeOptions
  ) {
    // @ts-ignore
    this._resetTransformEventData();
    super._setDimensionsImpl(dimensions, options);
    if (this._isCurrentlyDrawing) {
      this.freeDrawingBrush &&
        this.freeDrawingBrush._setBrushStyles(this.contextTop);
    }
  }

  /**
   * Helper for setting width/height
   * @private
   * @param {String} prop property (width|height)
   * @param {Number} value value to set property to
   */
  _setBackstoreDimension(prop: keyof TSize, value: number) {
    super._setBackstoreDimension(prop, value);
    this.upperCanvasEl[prop] = value;
  }

  /**
   * Helper for setting css width/height
   * @private
   * @param {String} prop property (width|height)
   * @param {String} value value to set property to
   */
  _setCssDimension(prop: keyof TSize, value: string) {
    super._setCssDimension(prop, value);
    this.upperCanvasEl.style[prop] = value;
    this.wrapperEl.style[prop] = value;
  }

  /**
   * @private
   * @throws {CANVAS_INIT_ERROR} If canvas can not be initialized
   */
  protected _createUpperCanvas() {
    const lowerCanvasEl = this.lowerCanvasEl;

    // if there is no upperCanvas (most common case) we create one.
    if (!this.upperCanvasEl) {
      this.upperCanvasEl = this._createCanvasElement();
    }
    const upperCanvasEl = this.upperCanvasEl;
    // we assign the same classname of the lowerCanvas
    upperCanvasEl.className = lowerCanvasEl.className;
    // but then we remove the lower-canvas specific className
    upperCanvasEl.classList.remove('lower-canvas');
    // we add the specific upper-canvas class
    upperCanvasEl.classList.add('upper-canvas');
    upperCanvasEl.setAttribute('data-fabric', 'top');
    this.wrapperEl.appendChild(upperCanvasEl);
    upperCanvasEl.style.cssText = lowerCanvasEl.style.cssText;
    this._applyCanvasStyle(upperCanvasEl);
    upperCanvasEl.setAttribute('draggable', 'true');
    this.contextTop = upperCanvasEl.getContext('2d')!;
  }

  protected _createCacheCanvas() {
    this.pixelFindCanvasEl = this._createCanvasElement();
    this.pixelFindContext = this.pixelFindCanvasEl.getContext('2d', {
      willReadFrequently: true,
    })!;
    this.setTargetFindTolerance(this.targetFindTolerance);
  }

  protected _initWrapperElement() {
    const container = getDocument().createElement('div');
    container.classList.add(this.containerClass);
    this.wrapperEl = wrapElement(this.lowerCanvasEl, container);
    this.wrapperEl.setAttribute('data-fabric', 'wrapper');
    setStyle(this.wrapperEl, {
      width: `${this.width}px`,
      height: `${this.height}px`,
      position: 'relative',
    });
    makeElementUnselectable(this.wrapperEl);
  }

  /**
   * @private
   * @param {HTMLCanvasElement} element canvas element to apply styles on
   */
  protected _applyCanvasStyle(element: HTMLCanvasElement) {
    const width = this.width || element.width,
      height = this.height || element.height;

    setStyle(element, {
      position: 'absolute',
      width: width + 'px',
      height: height + 'px',
      left: 0,
      top: 0,
      'touch-action': this.allowTouchScrolling ? 'manipulation' : 'none',
      '-ms-touch-action': this.allowTouchScrolling ? 'manipulation' : 'none',
    });
    element.width = width;
    element.height = height;
    makeElementUnselectable(element);
  }

  /**
   * Returns context of top canvas where interactions are drawn
   * @returns {CanvasRenderingContext2D}
   */
  getTopContext(): CanvasRenderingContext2D {
    return this.contextTop;
  }

  /**
   * Returns context of canvas where object selection is drawn
   * @alias
   * @return {CanvasRenderingContext2D}
   */
  getSelectionContext(): CanvasRenderingContext2D {
    return this.contextTop;
  }

  /**
   * Returns &lt;canvas> element on which object selection is drawn
   * @return {HTMLCanvasElement}
   */
  getSelectionElement(): HTMLCanvasElement {
    return this.upperCanvasEl;
  }

  /**
   * Returns currently active object
   * @return {FabricObject | null} active object
   */
  getActiveObject(): FabricObject | undefined {
    return this._activeObject;
  }

  /**
   * Returns instance's active selection
   */
  getActiveSelection() {
    return this._activeSelection;
  }

  /**
   * Returns an array with the current selected objects
   * @return {FabricObject[]} active objects array
   */
  getActiveObjects(): FabricObject[] {
    const active = this._activeObject;
    if (active) {
      if (active === this._activeSelection) {
        return [...(active as ActiveSelection)._objects];
      } else {
        return [active];
      }
    }
    return [];
  }

  /**
   * @private
   * Compares the old activeObject with the current one and fires correct events
   * @param {FabricObject[]} oldObjects old activeObject
   * @param {TPointerEvent} e mouse event triggering the selection events
   */
  _fireSelectionEvents(oldObjects: FabricObject[], e?: TPointerEvent) {
    let somethingChanged = false,
      invalidate = false;
    const objects = this.getActiveObjects(),
      added: FabricObject[] = [],
      removed: FabricObject[] = [];

    oldObjects.forEach((target) => {
      if (!objects.includes(target)) {
        somethingChanged = true;
        target.fire('deselected', {
          e,
          target,
        });
        removed.push(target);
      }
    });

    objects.forEach((target) => {
      if (!oldObjects.includes(target)) {
        somethingChanged = true;
        target.fire('selected', {
          e,
          target,
        });
        added.push(target);
      }
    });

    if (oldObjects.length > 0 && objects.length > 0) {
      invalidate = true;
      somethingChanged &&
        this.fire('selection:updated', {
          e,
          selected: added,
          deselected: removed,
        });
    } else if (objects.length > 0) {
      invalidate = true;
      this.fire('selection:created', {
        e,
        selected: added,
      });
    } else if (oldObjects.length > 0) {
      invalidate = true;
      this.fire('selection:cleared', {
        e,
        deselected: removed,
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
  setActiveObject(
    object: FabricObject,
    e?: TPointerEvent
  ): this is AssertKeys<this, '_activeObject'> {
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
  _setActiveObject(
    object: FabricObject,
    e?: TPointerEvent
  ): this is AssertKeys<this, '_activeObject'> {
    if (this._activeObject === object) {
      return false;
    }
    if (!this._discardActiveObject(e, object) && this._activeObject) {
      // refused to deselect
      return false;
    }
    if (object.onSelect({ e })) {
      return false;
    }
    this._activeObject = object;

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
  _discardActiveObject(
    e?: TPointerEvent,
    object?: FabricObject
  ): this is { _activeObject: undefined } {
    const obj = this._activeObject;
    if (obj) {
      // onDeselect return TRUE to cancel selection;
      if (obj.onDeselect({ e, object })) {
        return false;
      }
      // clear active selection
      if (obj === this._activeSelection) {
        this._activeSelection.removeAll();
        resetObjectTransform(this._activeSelection);
      }
      if (this._currentTransform && this._currentTransform.target === obj) {
        // @ts-ignore
        this.endCurrentTransform(e);
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
  discardActiveObject(e?: TPointerEvent): this is { _activeObject: undefined } {
    const currentActives = this.getActiveObjects(),
      activeObject = this.getActiveObject();
    if (currentActives.length) {
      this.fire('before:selection:cleared', {
        e,
        deselected: [activeObject!],
      });
    }
    const discarded = this._discardActiveObject(e);
    this._fireSelectionEvents(currentActives, e);
    return discarded;
  }

  /**
   * Sets viewport transformation of this canvas instance
   * @param {Array} vpt a Canvas 2D API transform matrix
   */
  setViewportTransform(vpt: TMat2D) {
    super.setViewportTransform(vpt);
    const activeObject = this._activeObject;
    if (activeObject) {
      activeObject.setCoords();
    }
  }

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
  destroy() {
    const wrapperEl = this.wrapperEl as HTMLDivElement,
      lowerCanvasEl = this.lowerCanvasEl!,
      upperCanvasEl = this.upperCanvasEl!,
      activeSelection = this._activeSelection!;
    // dispose of active selection
    activeSelection.removeAll();
    (this as TDestroyedCanvas<this>)._activeSelection = undefined;
    activeSelection.dispose();
    super.destroy();
    wrapperEl.removeChild(upperCanvasEl);
    wrapperEl.removeChild(lowerCanvasEl);
    (this as TDestroyedCanvas<this>).pixelFindContext = null;
    (this as TDestroyedCanvas<this>).contextTop = null;
    // TODO: interactive canvas should NOT be used in node, therefore there is no reason to cleanup node canvas
    getEnv().dispose(upperCanvasEl);
    (this as TDestroyedCanvas<this>).upperCanvasEl = undefined;
    getEnv().dispose(this.pixelFindCanvasEl!);
    (this as TDestroyedCanvas<this>).pixelFindCanvasEl = undefined;
    if (wrapperEl.parentNode) {
      wrapperEl.parentNode.replaceChild(lowerCanvasEl, wrapperEl);
    }
    (this as TDestroyedCanvas<this>).wrapperEl = undefined;
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
  drawControls(ctx: CanvasRenderingContext2D) {
    const activeObject = this._activeObject;

    if (activeObject) {
      activeObject._renderControls(ctx);
    }
  }

  /**
   * @private
   */
  _toObject(
    instance: FabricObject,
    methodName: 'toObject' | 'toDatalessObject',
    propertiesToInclude: string[]
  ): Record<string, any> {
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
  _realizeGroupTransformOnObject(
    instance: FabricObject
  ): Partial<typeof instance> {
    if (
      instance.group &&
      instance.group === this._activeSelection &&
      this._activeObject === instance.group
    ) {
      const layoutProps = [
        'angle',
        'flipX',
        'flipY',
        'left',
        'scaleX',
        'scaleY',
        'skewX',
        'skewY',
        'top',
      ] as (keyof typeof instance)[];
      const originalValues = pick<typeof instance>(instance, layoutProps);
      addTransformToObject(instance, this._activeObject.calcOwnMatrix());
      return originalValues;
    } else {
      return {};
    }
  }

  /**
   * @private
   */
  _setSVGObject(
    markup: string[],
    instance: FabricObject,
    reviver: TSVGReviver
  ) {
    // If the object is in a selection group, simulate what would happen to that
    // object when the group is deselected
    const originalProperties = this._realizeGroupTransformOnObject(instance);
    super._setSVGObject(markup, instance, reviver);
    instance.set(originalProperties);
  }
}
