import { classRegistry } from '../ClassRegistry';
import { NONE } from '../constants';
import type {
  CanvasEvents,
  DragEventData,
  DragEventRenderingEffectData,
  ObjectEvents,
  StatefulEvent,
  TPointerEvent,
  TPointerEventInfo,
  TPointerEventNames,
  Transform,
} from '../EventTypeDefs';
import { Point } from '../Point';
import type { ActiveSelection } from '../shapes/ActiveSelection';
import type { Group } from '../shapes/Group';
import type { IText } from '../shapes/IText/IText';
import type { FabricObject } from '../shapes/Object/FabricObject';
import { isTouchEvent, stopEvent } from '../util/dom_event';
import { getDocumentFromElement, getWindowFromElement } from '../util/dom_misc';
import { sendPointToPlane } from '../util/misc/planeChange';
import { isActiveSelection } from '../util/typeAssertions';
import type { CanvasOptions, TCanvasOptions } from './CanvasOptions';
import { SelectableCanvas } from './SelectableCanvas';
import { TextEditingManager } from './TextEditingManager';

const addEventOptions = { passive: false } as EventListenerOptions;

const prepareEvent = <T extends Event>(canvas: Canvas, e: T) => {
  const viewportPoint = Object.freeze(canvas.getViewportPoint(e));
  const scenePoint = Object.freeze(
    sendPointToPlane(viewportPoint, undefined, canvas.viewportTransform)
  );
  // should be non writable but too many tests are failing
  Object.defineProperties(e, {
    viewportPoint: {
      value: viewportPoint,
      configurable: true,
      enumerable: false,
      writable: true,
    },
    scenePoint: {
      value: scenePoint,
      configurable: true,
      enumerable: false,
      writable: true,
    },
  });
  return {
    e: e as StatefulEvent<T>,
    viewportPoint,
    scenePoint,
    pointer: viewportPoint,
    absolutePointer: scenePoint,
  };
};

// just to be clear, the utils are now deprecated and those are here exactly as minifier helpers
// because el.addEventListener can't me be minified while a const yes and we use it 47 times in this file.
// few bytes but why give it away.
const addListener = (
  el: HTMLElement | Document,
  ...args: Parameters<HTMLElement['addEventListener']>
) => el.addEventListener(...args);
const removeListener = (
  el: HTMLElement | Document,
  ...args: Parameters<HTMLElement['removeEventListener']>
) => el.removeEventListener(...args);

const syntheticEventConfig = {
  mouse: {
    in: 'over',
    out: 'out',
    targetIn: 'mouseover',
    targetOut: 'mouseout',
    canvasIn: 'mouse:over',
    canvasOut: 'mouse:out',
  },
  drag: {
    in: 'enter',
    out: 'leave',
    targetIn: 'dragenter',
    targetOut: 'dragleave',
    canvasIn: 'drag:enter',
    canvasOut: 'drag:leave',
  },
} as const;

type TSyntheticEventContext = {
  mouse: TPointerEventInfo;
  drag: DragEventData;
};

export class Canvas extends SelectableCanvas implements CanvasOptions {
  /**
   * Contains the id of the touch event that owns the fabric transform
   * @type Number
   * @private
   */
  declare mainTouchId?: number;

  declare enablePointerEvents: boolean;

  /**
   * Holds a reference to a setTimeout timer for event synchronization
   * @type number
   * @private
   */
  private declare _willAddMouseDown: number;

  /**
   * Holds a reference to an object on the canvas that is receiving the drag over event.
   * @type FabricObject
   * @private
   */
  private declare _draggedoverTarget?: FabricObject;

  /**
   * Holds a reference to an object on the canvas from where the drag operation started
   * @type FabricObject
   * @private
   */
  private declare _dragSource?: FabricObject;

  /**
   * Holds a reference to an object on the canvas that is the current drop target
   * May differ from {@link _draggedoverTarget}
   * @todo inspect whether {@link _draggedoverTarget} and {@link _dropTarget} should be merged somehow
   * @type FabricObject
   * @private
   */
  private declare _dropTarget: FabricObject<ObjectEvents> | undefined;

  private _isClick: boolean;

  textEditingManager = new TextEditingManager(this);

  constructor(el?: string | HTMLCanvasElement, options: TCanvasOptions = {}) {
    super(el, options);
    // bind event handlers
    (
      [
        '_onMouseDown',
        '_onTouchStart',
        '_onMouseMove',
        '_onMouseUp',
        '_onTouchEnd',
        '_onResize',
        // '_onGesture',
        // '_onDrag',
        // '_onShake',
        // '_onLongPress',
        // '_onOrientationChange',
        '_onMouseWheel',
        '_onMouseOut',
        '_onMouseEnter',
        '_onContextMenu',
        '_onDoubleClick',
        '_onDragStart',
        '_onDragEnd',
        '_onDragProgress',
        '_onDragOver',
        '_onDragEnter',
        '_onDragLeave',
        '_onDrop',
      ] as (keyof this)[]
    ).forEach((eventHandler) => {
      this[eventHandler] = (this[eventHandler] as Function).bind(this);
    });
    // register event handlers
    this.addOrRemove(addListener, 'add');
  }

  /**
   * return an event prefix pointer or mouse.
   * @private
   */
  private _getEventPrefix() {
    return this.enablePointerEvents ? 'pointer' : 'mouse';
  }

  addOrRemove(functor: any, eventjsFunctor: 'add' | 'remove') {
    const canvasElement = this.upperCanvasEl,
      eventTypePrefix = this._getEventPrefix();
    functor(getWindowFromElement(canvasElement), 'resize', this._onResize);
    functor(canvasElement, eventTypePrefix + 'down', this._onMouseDown);
    functor(
      canvasElement,
      `${eventTypePrefix}move`,
      this._onMouseMove,
      addEventOptions
    );
    functor(canvasElement, `${eventTypePrefix}out`, this._onMouseOut);
    functor(canvasElement, `${eventTypePrefix}enter`, this._onMouseEnter);
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
    // if (typeof eventjs !== 'undefined' && eventjsFunctor in eventjs) {
    //   eventjs[eventjsFunctor](canvasElement, 'gesture', this._onGesture);
    //   eventjs[eventjsFunctor](canvasElement, 'drag', this._onDrag);
    //   eventjs[eventjsFunctor](
    //     canvasElement,
    //     'orientation',
    //     this._onOrientationChange
    //   );
    //   eventjs[eventjsFunctor](canvasElement, 'shake', this._onShake);
    //   eventjs[eventjsFunctor](canvasElement, 'longpress', this._onLongPress);
    // }
  }

  /**
   * Removes all event listeners
   */
  removeListeners() {
    this.addOrRemove(removeListener, 'remove');
    // if you dispose on a mouseDown, before mouse up, you need to clean document to...
    const eventTypePrefix = this._getEventPrefix();
    const doc = getDocumentFromElement(this.upperCanvasEl);
    removeListener(
      doc,
      `${eventTypePrefix}up`,
      this._onMouseUp as EventListener
    );
    removeListener(
      doc,
      'touchend',
      this._onTouchEnd as EventListener,
      addEventOptions
    );
    removeListener(
      doc,
      `${eventTypePrefix}move`,
      this._onMouseMove as EventListener,
      addEventOptions
    );
    removeListener(
      doc,
      'touchmove',
      this._onMouseMove as EventListener,
      addEventOptions
    );
  }

  /**
   * @private
   * @param {Event} [e] Event object fired on wheel event
   */
  private _onMouseWheel(e: WheelEvent) {
    this.__onMouseWheel(e);
  }

  /**
   * @private
   * @param {Event} e Event object fired on mousedown
   */
  private _onMouseOut(e: TPointerEvent) {
    const target = this._hoveredTarget;
    const data: CanvasEvents['mouse:out'] = {
      ...prepareEvent(this, e),
      target,
      subTargets: [],
    };
    this.fire('mouse:out', { ...data });
    this._hoveredTarget = undefined;
    target && target.fire('mouseout', { ...data });
    this._hoveredTargets.forEach((nestedTarget) => {
      this.fire('mouse:out', { ...data, target: nestedTarget });
      nestedTarget && nestedTarget.fire('mouseout', { ...data });
    });
    this._hoveredTargets = [];
  }

  /**
   * @private
   * @param {Event} e Event object fired on mouseenter
   */
  private _onMouseEnter(e: TPointerEvent) {
    // This find target and consequent 'mouse:over' is used to
    // clear old instances on hovered target.
    // calling findTarget has the side effect of killing target.__corner.
    // as a short term fix we are not firing this if we are currently transforming.
    // as a long term fix we need to separate the action of finding a target with the
    // side effects we added to it.
    const event = prepareEvent(this, e);
    if (!this._currentTransform && !this.findEventTargets(event).target) {
      this.fire('mouse:over', {
        ...event,
        target: undefined,
        subTargets: [],
      });
      this._hoveredTarget = undefined;
      this._hoveredTargets = [];
    }
  }

  /**
   * supports native like text dragging
   * @private
   * @param {DragEvent} e
   */
  private _onDragStart(e: DragEvent) {
    this._isClick = false;
    const activeObject = this.getActiveObject();
    const event = prepareEvent(this, e);
    if (activeObject && activeObject.onDragStart(event.e)) {
      this._dragSource = activeObject;
      const data: DragEventData = {
        ...event,
        target: activeObject,
        subTargets: [],
      };
      this.fire('dragstart', data);
      activeObject.fire('dragstart', data);
      addListener(
        this.upperCanvasEl,
        'drag',
        this._onDragProgress as EventListener
      );
      return;
    }
    stopEvent(e);
  }

  /**
   * First we clear top context where the effects are being rendered.
   * Then we render the effects.
   * Doing so will render the correct effect for all cases including an overlap between `source` and `target`.
   * @private
   */
  private _renderDragEffects(context: DragEventRenderingEffectData) {
    const { dragSource, dropTarget, prevDropTarget } = context;
    let dirty = false;
    // clear top context
    if (
      prevDropTarget &&
      prevDropTarget !== dragSource &&
      prevDropTarget !== dropTarget
    ) {
      prevDropTarget.clearContextTop();
      dirty = true;
    }
    dragSource?.clearContextTop();
    dropTarget !== dragSource && dropTarget?.clearContextTop();
    // render effects
    const ctx = this.contextTop;
    ctx.save();
    ctx.transform(...this.viewportTransform);
    if (dragSource) {
      ctx.save();
      dragSource.transform(ctx);
      dragSource.renderDragSourceEffect(ctx, context);
      ctx.restore();
      dirty = true;
    }
    if (dropTarget) {
      ctx.save();
      dropTarget.transform(ctx);
      dropTarget.renderDropTargetEffect(ctx, context);
      ctx.restore();
      dirty = true;
    }
    ctx.restore();
    dirty && (this.contextTopDirty = true);
  }

  /**
   * supports native like text dragging
   * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#finishing_a_drag
   * @private
   * @param {DragEvent} e
   */
  private _onDragEnd(e: DragEvent) {
    const didDrop = !!e.dataTransfer && e.dataTransfer.dropEffect !== NONE,
      dropTarget = didDrop ? this._activeObject : undefined,
      options: DragEventData = {
        ...prepareEvent(this, e),
        target: this._dragSource as FabricObject,
        subTargets: this.targets,
        dragSource: this._dragSource as FabricObject,
        didDrop,
        dropTarget: dropTarget as FabricObject,
      };
    removeListener(
      this.upperCanvasEl,
      'drag',
      this._onDragProgress as EventListener
    );
    this.fire('dragend', options);
    this._dragSource && this._dragSource.fire('dragend', options);
    delete this._dragSource;
    // we need to call mouse up synthetically because the browser won't
    this._onMouseUp(e);
  }

  /**
   * fire `drag` event on canvas and drag source
   * @private
   * @param {DragEvent} e
   */
  private _onDragProgress(e: DragEvent) {
    const options: DragEventData = {
      ...prepareEvent(this, e),
      target: this._dragSource,
      dragSource: this._dragSource,
      dropTarget: this._draggedoverTarget,
      subTargets: [],
    };
    this.fire('drag', options);
    this._dragSource && this._dragSource.fire('drag', options);
  }

  /**
   * As opposed to {@link findEventTargets} we want the top most object to be returned w/o the active object cutting in line.
   * Override at will
   */
  protected findDragTargets({
    e,
    viewportPoint,
  }: {
    e: DragEvent;
    viewportPoint: Point;
    scenePoint: Point;
  }) {
    this.targets = [];
    const target = this._searchPossibleTargets(this._objects, viewportPoint);
    return {
      target,
      subTargets: [...this.targets],
    };
  }

  /**
   * prevent default to allow drop event to be fired
   * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#specifying_drop_targets
   * @private
   * @param {DragEvent} [ev] Event object fired on Event.js shake
   */
  private _onDragOver(ev: DragEvent) {
    const eventType = 'dragover';
    const dragSource = this._dragSource as FabricObject;
    const event = prepareEvent(this, ev);
    const data = {
      ...event,
      ...this.findDragTargets(event),
      dragSource,
      canDrop: false,
      dropTarget: undefined,
    };
    const { e, target, subTargets } = data;
    let dropTarget;
    //  fire on canvas
    this.fire(eventType, data);
    //  make sure we fire dragenter events before dragover
    //  if dragleave is needed, object will not fire dragover so we don't need to trouble ourselves with it
    this._fireEnterLeaveEvents(target, data);
    if (target) {
      if (target.canDrop(e)) {
        dropTarget = target;
      }
      target.fire(eventType, data);
    }
    //  propagate the event to subtargets
    for (const subTarget of subTargets) {
      // accept event only if previous targets didn't (the accepting target calls `preventDefault` to inform that the event is taken)
      // TODO: verify if those should loop in inverse order then?
      // what is the order of subtargets?
      if (subTarget.canDrop(e)) {
        dropTarget = subTarget;
      }
      subTarget.fire(eventType, data);
    }

    //  render drag effects now that relations between source and target is clear
    this._renderDragEffects({
      ...event,
      e,
      dragSource,
      dropTarget,
      prevDropTarget: this._dropTarget,
    });
    this._dropTarget = dropTarget;
  }

  /**
   * fire `dragleave` on `dragover` targets
   * @private
   * @param {Event} [e] Event object fired on Event.js shake
   */
  private _onDragEnter(e: DragEvent) {
    const event = prepareEvent(this, e);
    const data = {
      ...event,
      ...this.findDragTargets(event),
      dragSource: this._dragSource,
    };
    this.fire('dragenter', data);
    //  fire dragenter on targets
    this._fireEnterLeaveEvents(data.target, data);
  }

  /**
   * fire `dragleave` on `dragover` targets
   * @private
   * @param {Event} [e] Event object fired on Event.js shake
   */
  private _onDragLeave(e: DragEvent) {
    const event = prepareEvent(this, e);
    const options: DragEventData = {
      ...event,
      target: this._draggedoverTarget,
      subTargets: this.targets,
      dragSource: this._dragSource,
    };
    this.fire('dragleave', options);

    //  fire dragleave on targets
    this._fireEnterLeaveEvents(undefined, options);
    this._renderDragEffects({
      ...event,
      dragSource: this._dragSource,
      dropTarget: undefined,
      prevDropTarget: this._dropTarget,
    });
    this._dropTarget = undefined;
    //  clear targets
    this.targets = [];
    this._hoveredTargets = [];
  }

  /**
   * `drop:before` is a an event that allows you to schedule logic
   * before the `drop` event. Prefer `drop` event always, but if you need
   * to run some drop-disabling logic on an event, since there is no way
   * to handle event handlers ordering, use `drop:before`
   * @private
   * @param {Event} e
   */
  private _onDrop(e: DragEvent) {
    const event = prepareEvent(this, e);
    const data: DragEventData = {
      ...event,
      ...this.findDragTargets(event),
      dragSource: this._dragSource,
    };
    this._basicEventHandler('drop:before', data);
    //  will be set by the drop target
    data.didDrop = false;
    //  will be set by the drop target, used in case options.target refuses the drop
    data.dropTarget = undefined;
    //  fire `drop`
    this._basicEventHandler('drop', data);
    //  inform canvas of the drop
    //  we do this because canvas was unaware of what happened at the time the `drop` event was fired on it
    //  use for side effects
    this.fire('drop:after', data);
  }

  /**
   * @private
   * @param {Event} e Event object fired on mousedown
   */
  private _onContextMenu(e: Event): false {
    const event = prepareEvent(this, e);
    const data: CanvasEvents['contextmenu'] = {
      ...event,
      ...this.findEventTargets(event),
    };
    this._basicEventHandler('contextmenu:before', data);
    // TODO: this line is silly because the dev can subscribe to the event and prevent it themselves
    this.stopContextMenu && stopEvent(e);
    this._basicEventHandler('contextmenu', data);
    return false;
  }

  /**
   * @private
   * @param {Event} e Event object fired on mousedown
   */
  private _onDoubleClick(e: TPointerEvent) {
    const event = prepareEvent(this, e);
    this._handleEvent('dblclick', {
      ...event,
      ...this.findEventTargets(event),
      transform: this._currentTransform,
    });
  }

  /**
   * Return a the id of an event.
   * returns either the pointerId or the identifier or 0 for the mouse event
   * @private
   * @param {Event} evt Event object
   */
  getPointerId(evt: TouchEvent | PointerEvent): number {
    const changedTouches = (evt as TouchEvent).changedTouches;

    if (changedTouches) {
      return changedTouches[0] && changedTouches[0].identifier;
    }

    if (this.enablePointerEvents) {
      return (evt as PointerEvent).pointerId;
    }

    return -1;
  }

  /**
   * Determines if an event has the id of the event that is considered main
   * @private
   * @param {evt} event Event object
   */
  _isMainEvent(evt: Event): boolean {
    if ((evt as PointerEvent).isPrimary === true) {
      return true;
    }
    if ((evt as PointerEvent).isPrimary === false) {
      return false;
    }
    if (evt.type === 'touchend' && (evt as TouchEvent).touches.length === 0) {
      return true;
    }
    if ((evt as TouchEvent).changedTouches) {
      return (
        (evt as TouchEvent).changedTouches[0].identifier === this.mainTouchId
      );
    }
    return true;
  }

  /**
   * @private
   * @param {TouchEvent} e Event object fired on mousedown
   */
  _onTouchStart(e: TouchEvent) {
    e.preventDefault();
    if (this.mainTouchId === undefined) {
      this.mainTouchId = this.getPointerId(e);
    }
    this.__onMouseDown(e);
    const canvasElement = this.upperCanvasEl,
      eventTypePrefix = this._getEventPrefix();
    const doc = getDocumentFromElement(canvasElement);
    addListener(
      doc,
      'touchend',
      this._onTouchEnd as EventListener,
      addEventOptions
    );
    addListener(
      doc,
      'touchmove',
      this._onMouseMove as EventListener,
      addEventOptions
    );
    // Unbind mousedown to prevent double triggers from touch devices
    removeListener(
      canvasElement,
      `${eventTypePrefix}down`,
      this._onMouseDown as EventListener
    );
  }

  /**
   * @private
   * @param {MouseEvent | PointerEvent} e Event object fired on mousedown
   */
  _onMouseDown(e: MouseEvent | PointerEvent) {
    this.__onMouseDown(e);
    const canvasElement = this.upperCanvasEl,
      eventTypePrefix = this._getEventPrefix();
    removeListener(
      canvasElement,
      `${eventTypePrefix}move`,
      this._onMouseMove as EventListener,
      addEventOptions
    );
    const doc = getDocumentFromElement(canvasElement);
    addListener(doc, `${eventTypePrefix}up`, this._onMouseUp as EventListener);
    addListener(
      doc,
      `${eventTypePrefix}move`,
      this._onMouseMove as EventListener,
      addEventOptions
    );
  }

  /**
   * @private
   * @param {TouchEvent} e Event object fired on mousedown
   */
  _onTouchEnd(e: TouchEvent) {
    if (e.touches.length > 0) {
      // if there are still touches stop here
      return;
    }
    this.__onMouseUp(e);
    delete this.mainTouchId;
    const eventTypePrefix = this._getEventPrefix();
    const doc = getDocumentFromElement(this.upperCanvasEl);
    removeListener(
      doc,
      'touchend',
      this._onTouchEnd as EventListener,
      addEventOptions
    );
    removeListener(
      doc,
      'touchmove',
      this._onMouseMove as EventListener,
      addEventOptions
    );
    if (this._willAddMouseDown) {
      clearTimeout(this._willAddMouseDown);
    }
    this._willAddMouseDown = setTimeout(() => {
      // Wait 400ms before rebinding mousedown to prevent double triggers
      // from touch devices
      addListener(
        this.upperCanvasEl,
        `${eventTypePrefix}down`,
        this._onMouseDown as EventListener
      );
      this._willAddMouseDown = 0;
    }, 400) as unknown as number;
  }

  /**
   * @private
   * @param {MouseEvent | PointerEvent} e Event object fired on mouseup
   */
  _onMouseUp(e: MouseEvent | PointerEvent) {
    this.__onMouseUp(e);
    const canvasElement = this.upperCanvasEl,
      eventTypePrefix = this._getEventPrefix();
    if (this._isMainEvent(e)) {
      const doc = getDocumentFromElement(this.upperCanvasEl);
      removeListener(
        doc,
        `${eventTypePrefix}up`,
        this._onMouseUp as EventListener
      );
      removeListener(
        doc,
        `${eventTypePrefix}move`,
        this._onMouseMove as EventListener,
        addEventOptions
      );
      addListener(
        canvasElement,
        `${eventTypePrefix}move`,
        this._onMouseMove as EventListener,
        addEventOptions
      );
    }
  }

  /**
   * @private
   * @param {Event} e Event object fired on mousemove
   */
  _onMouseMove(e: Event) {
    const activeObject = this.getActiveObject();
    !this.allowTouchScrolling &&
      (!activeObject ||
        // a drag event sequence is started by the active object flagging itself on mousedown / mousedown:before
        // we must not prevent the event's default behavior in order for the window to start dragging
        !activeObject.shouldStartDragging(e)) &&
      e.preventDefault &&
      e.preventDefault();
    this.__onMouseMove(e);
  }

  /**
   * @private
   */
  _onResize() {
    this.calcOffset();
  }

  /**
   * Method that defines the actions when mouse is released on canvas.
   * The method resets the currentTransform parameters, store the image corner
   * position in the image object and render the canvas on top.
   * @private
   * @param {Event} ev Event object fired on mouseup
   */
  __onMouseUp(ev: Event) {
    const event = prepareEvent(this, ev);
    const transformTarget = this._currentTransform?.target;
    const eventTargets = transformTarget
      ? { target: transformTarget, subTargets: this.targets }
      : this.findEventTargets(event);
    const currentEventTargets =
      eventTargets.target === transformTarget
        ? this.findEventTargets(event)
        : eventTargets;
    const data = {
      ...event,
      ...eventTargets,
      transform: this._currentTransform,
      isClick: this._isClick,
      currentTarget: currentEventTargets.target,
      currentSubTargets: currentEventTargets.subTargets,
    } as CanvasEvents['mouse:up'];

    this._handleEvent('up:before', data);

    const { e, target, transform, isClick, viewportPoint, scenePoint } = data;

    // if right/middle click just fire events and return
    // target undefined will make the _handleEvent search the target
    const { button } = e as MouseEvent;
    if (button) {
      ((this.fireMiddleClick && button === 1) ||
        (this.fireRightClick && button === 2)) &&
        this._handleEvent('up', data);
      return;
    }

    if (this.isDrawingMode && this._isCurrentlyDrawing) {
      this._isCurrentlyDrawing =
        !!this.freeDrawingBrush?.onMouseUp({
          ...data,
          // this is an absolute pointer, the naming is wrong
          pointer: data.scenePoint,
        }) || false;
      this._handleEvent('up', data);
      return;
    }

    if (!this._isMainEvent(e)) {
      return;
    }

    const actionPerformed = this._finalizeCurrentTransform(e);
    const executedAreaSelection =
      !actionPerformed && !isClick && this.handleSelection(e);
    const selectedTarget =
      !executedAreaSelection &&
      target &&
      target.selectable &&
      target !== this._activeObject &&
      target.activeOn === 'up' &&
      this.setActiveObject(target, e);

    if (transform) {
      const foundControl = target
        ? target.findControl(viewportPoint, isTouchEvent(e))
        : undefined;
      if (foundControl && foundControl.control && target) {
        const { control } = foundControl;
        const mouseUpHandler = control.getMouseUpHandler(e, target, control);
        if (mouseUpHandler) {
          mouseUpHandler.call(
            control,
            e,
            transform,
            scenePoint.x,
            scenePoint.y
          );
        }
      }
      // if we are ending up a transform on a different control or a new object
      // fire the original mouse up from the corner that started the transform
      if (
        transform.target !== target ||
        transform.corner !== foundControl?.key
      ) {
        const originalControl =
            transform.target && transform.target.controls[transform.corner],
          originalMouseUpHandler =
            originalControl &&
            originalControl.getMouseUpHandler(
              e,
              transform.target,
              originalControl
            );
        originalMouseUpHandler &&
          originalMouseUpHandler.call(
            originalControl,
            e,
            transform,
            scenePoint.x,
            scenePoint.y
          );
      }
    }

    this._setCursorFromEvent(e, target);
    this._handleEvent('up', data);

    this._groupSelector = null;
    delete this._currentTransform;
    // reset the target information about which corner is selected
    target && (target.__corner = undefined);

    if (actionPerformed || executedAreaSelection || selectedTarget) {
      this.requestRenderAll();
    } else if (!isClick && !(this._activeObject as IText)?.isEditing) {
      this.renderTop();
    }
  }

  _basicEventHandler<T extends keyof (CanvasEvents | ObjectEvents)>(
    eventType: T,
    data: (CanvasEvents & ObjectEvents)[T]
  ) {
    const { target, subTargets = [] } = data as {
      target?: FabricObject;
      subTargets: FabricObject[];
    };
    this.fire(eventType, data);
    target && target.fire(eventType, data);
    for (const subTarget of subTargets) {
      subTarget !== target && subTarget.fire(eventType, data);
    }
  }

  /**
   * @private
   * Handle event firing for target and subtargets
   * @param {TPointerEvent} e event from mouse
   * @param {TPointerEventNames} eventType
   */
  _handleEvent<T extends TPointerEventNames>(
    eventType: T,
    data: CanvasEvents[`mouse:${T}`]
  ) {
    const { target, subTargets } = data;
    this.fire(`mouse:${eventType}`, data);
    // this may be a little be more complicated of what we want to handle
    target && target.fire(`mouse${eventType}`, data);
    for (const subTarget of subTargets) {
      subTarget !== target && subTarget.fire(`mouse${eventType}`, data);
    }
  }

  /**
   * Method that defines the actions when mouse is clicked on canvas.
   * The method inits the currentTransform parameters and renders all the
   * canvas so the current image can be placed on the top canvas and the rest
   * in on the container one.
   * @private
   * @param {Event} ev Event object fired on mousedown
   */
  __onMouseDown(ev: Event) {
    this._isClick = true;
    const event = prepareEvent(this, ev);
    const eventTargets = this._currentTransform
      ? { target: this._currentTransform.target, subTargets: this.targets }
      : this.findEventTargets(event);
    const data = {
      ...event,
      ...eventTargets,
      transform: this._currentTransform,
    } as CanvasEvents['mouse:down'];

    this._handleEvent('down:before', data);

    // if right/middle click just fire events
    const { button } = ev as MouseEvent;
    if (button) {
      ((this.fireMiddleClick && button === 1) ||
        (this.fireRightClick && button === 2)) &&
        this._handleEvent('down', data);

      return;
    }

    const { e, target, viewportPoint, scenePoint } = data;

    if (this.isDrawingMode) {
      this._isCurrentlyDrawing = true;
      const discardedActiveObject = this.discardActiveObject(e);
      this.freeDrawingBrush &&
        this.freeDrawingBrush.onMouseDown(scenePoint, {
          ...data,
          // TODO: this is a scene point so it should be renamed
          pointer: scenePoint,
        });

      this._handleEvent('down', data);
      discardedActiveObject && this.requestRenderAll();
      return;
    }

    if (!this._isMainEvent(e)) {
      return;
    }

    // ignore if some object is being transformed at this moment
    if (this._currentTransform) {
      return;
    }

    const prevActiveObject = this._activeObject;

    const executedMultiSelection = this.handleMultiSelection(e, target);
    const discardedActiveObject =
      !executedMultiSelection &&
      this._shouldClearSelection(e, target) &&
      this.discardActiveObject(e);
    const selectedTarget =
      !executedMultiSelection &&
      !!target &&
      target.selectable &&
      target.activeOn === 'down' &&
      this.setActiveObject(target, e);

    // active object might have changed while handling the previous lines of logic
    const activeObject = this._activeObject;

    // we start a group selector rectangle if
    // selection is enabled
    // and there is no target, or the following 3 conditions are satisfied:
    // target is not selectable ( otherwise we selected it )
    // target is not editing
    // target is not already selected ( otherwise we drag )
    const shouldStartAreaSelection =
      !executedMultiSelection &&
      !selectedTarget &&
      this.selection &&
      (!activeObject ||
        (!(activeObject as IText).isEditing &&
          activeObject !== prevActiveObject));

    if (shouldStartAreaSelection) {
      this._groupSelector = {
        x: scenePoint.x,
        y: scenePoint.y,
        deltaY: 0,
        deltaX: 0,
      };
    }

    if (activeObject) {
      const controlContext =
        activeObject === prevActiveObject &&
        activeObject.findControl(viewportPoint, isTouchEvent(e));
      const transformContext =
        controlContext ||
        (!executedMultiSelection ? ({ key: 'drag' } as const) : undefined);

      if (transformContext) {
        const transform = this.setupCurrentTransform({
          ...data,
          target: activeObject,
          action: transformContext,
        });
        this.fire('before:transform', {
          e,
          transform,
        });

        const mouseDownHandler =
          controlContext &&
          controlContext.control.getMouseDownHandler(
            e,
            activeObject,
            controlContext.control
          );

        mouseDownHandler &&
          mouseDownHandler.call(
            controlContext.control,
            e,
            transform,
            scenePoint.x,
            scenePoint.y
          );
      }
    }

    const dirty =
      executedMultiSelection || discardedActiveObject || selectedTarget;

    //  we clear `_objectsToRender` in case of a change in order to repopulate it at rendering
    //  run before firing the `down` event to give the dev a chance to populate it themselves
    dirty && (this._objectsToRender = undefined);

    this._handleEvent('down', data);

    // we must renderAll so that we update the visuals
    dirty && this.requestRenderAll();
  }

  /**
   * Method that defines the actions when mouse is hovering the canvas.
   * The currentTransform parameter will define whether the user is rotating/scaling/translating
   * an image or neither of them (only hovering). A group selection is also possible and would cancel
   * all any other type of action.
   * In case of an image transformation only the top canvas will be rendered.
   * @private
   * @param {Event} ev Event object fired on mousemove
   */
  __onMouseMove(ev: Event) {
    this._isClick = false;
    const event = prepareEvent(this, ev);
    const eventTargets = this._currentTransform
      ? { target: this._currentTransform.target, subTargets: this.targets }
      : this.findEventTargets(event);
    const data = {
      ...event,
      ...eventTargets,
      transform: this._currentTransform,
    } as CanvasEvents['mouse:move'];

    this._handleEvent('move:before', data);

    const { e, scenePoint } = data;

    if (this.isDrawingMode) {
      if (this.freeDrawingBrush && this._isCurrentlyDrawing) {
        this.freeDrawingBrush.onMouseMove(scenePoint, {
          ...data,
          // this is an absolute pointer, the naming is wrong
          pointer: scenePoint,
        });
      }
      this.setCursor(this.freeDrawingCursor);
      this._handleEvent('move', data);
      return;
    }

    if (!this._isMainEvent(e)) {
      return;
    }

    const groupSelector = this._groupSelector;

    // We initially clicked in an empty area, so we draw a box for multiple selection
    if (groupSelector) {
      groupSelector.deltaX = scenePoint.x - groupSelector.x;
      groupSelector.deltaY = scenePoint.y - groupSelector.y;
      this.renderTop();
    } else if (!this._currentTransform) {
      const { target } = this.findEventTargets(data);
      this._setCursorFromEvent(e, target);
      this._fireOverOutEvents(data, target);
    } else {
      this.transformObject(data, this._currentTransform);
    }

    this.textEditingManager.onMouseMove(e);
    this._handleEvent('move', data);
  }

  /**
   * Manage the mouseout, mouseover events for the fabric object on the canvas
   * @param {Fabric.Object} target the target where the target from the mousemove event
   * @param {Event} e Event object fired on mousemove
   * @private
   */
  _fireOverOutEvents(data: TPointerEventInfo, target?: FabricObject) {
    const _hoveredTarget = this._hoveredTarget,
      _hoveredTargets = this._hoveredTargets,
      targets = this.targets,
      length = Math.max(_hoveredTargets.length, targets.length);

    this.fireSyntheticInOutEvents('mouse', {
      ...data,
      target,
      oldTarget: _hoveredTarget,
      fireCanvas: true,
    });
    for (let i = 0; i < length; i++) {
      this.fireSyntheticInOutEvents('mouse', {
        ...data,
        target: targets[i],
        oldTarget: _hoveredTargets[i],
      });
    }
    this._hoveredTarget = target;
    this._hoveredTargets = this.targets.concat();
  }

  /**
   * Manage the dragEnter, dragLeave events for the fabric objects on the canvas
   * @param {Fabric.Object} target the target where the target from the onDrag event
   * @param {Object} data Event object fired on dragover
   * @private
   */
  _fireEnterLeaveEvents(target: FabricObject | undefined, data: DragEventData) {
    const draggedoverTarget = this._draggedoverTarget,
      _hoveredTargets = this._hoveredTargets,
      targets = this.targets,
      length = Math.max(_hoveredTargets.length, targets.length);

    this.fireSyntheticInOutEvents('drag', {
      ...data,
      target,
      oldTarget: draggedoverTarget,
      fireCanvas: true,
    });
    for (let i = 0; i < length; i++) {
      this.fireSyntheticInOutEvents('drag', {
        ...data,
        target: targets[i],
        oldTarget: _hoveredTargets[i],
      });
    }
    this._draggedoverTarget = target;
  }

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
  fireSyntheticInOutEvents<T extends keyof TSyntheticEventContext>(
    type: T,
    {
      target,
      oldTarget,
      fireCanvas,
      ...data
    }: TSyntheticEventContext[T] & {
      target?: FabricObject;
      oldTarget?: FabricObject;
      fireCanvas?: boolean;
    }
  ) {
    const { targetIn, targetOut, canvasIn, canvasOut } =
      syntheticEventConfig[type];
    const targetChanged = oldTarget !== target;

    if (oldTarget && targetChanged) {
      const outOpt: CanvasEvents[typeof canvasOut] = {
        ...data,
        target: oldTarget,
        nextTarget: target,
      };
      fireCanvas && this.fire(canvasOut, outOpt);
      oldTarget.fire(targetOut, outOpt);
    }
    if (target && targetChanged) {
      const inOpt: CanvasEvents[typeof canvasIn] = {
        ...data,
        target,
        previousTarget: oldTarget,
      };
      fireCanvas && this.fire(canvasIn, inOpt);
      target.fire(targetIn, inOpt);
    }
  }

  /**
   * Method that defines actions when an Event Mouse Wheel
   * @param {Event} e Event object fired on mouseup
   */
  __onMouseWheel(e: WheelEvent) {
    const event = prepareEvent(this, e);
    this._handleEvent('wheel', {
      ...event,
      ...this.findEventTargets(event),
      transform: this._currentTransform,
    });
  }

  /**
   * @private
   */
  transformObject({ e, scenePoint }: TPointerEventInfo, transform: Transform) {
    const target = transform.target,
      //  transform pointer to target's containing coordinate plane
      //  both pointer and object should agree on every point
      localPointer = target.group
        ? sendPointToPlane(
            scenePoint,
            undefined,
            target.group.calcTransformMatrix()
          )
        : scenePoint;
    transform.shiftKey = e.shiftKey;
    transform.altKey = !!this.centeredKey && e[this.centeredKey];

    this._performTransformAction(e, transform, localPointer);
    transform.actionPerformed && this.requestRenderAll();
  }

  /**
   * @private
   */
  _performTransformAction(
    e: TPointerEvent,
    transform: Transform,
    pointer: Point
  ) {
    const x = pointer.x,
      y = pointer.y,
      action = transform.action,
      actionHandler = transform.actionHandler;
    let actionPerformed = false;
    // this object could be created from the function in the control handlers

    if (actionHandler) {
      actionPerformed = actionHandler(e, transform, x, y);
    }
    if (action === 'drag' && actionPerformed) {
      transform.target.isMoving = true;
      this.setCursor(transform.target.moveCursor || this.moveCursor);
    }
    transform.actionPerformed = transform.actionPerformed || actionPerformed;
  }

  /**
   * Sets the cursor depending on where the canvas is being hovered.
   * Note: very buggy in Opera
   * @param {Event} e Event object
   * @param {Object} target Object that the mouse is hovering, if so.
   */
  _setCursorFromEvent(e: TPointerEvent, target?: FabricObject) {
    if (!target) {
      this.setCursor(this.defaultCursor);
      return;
    }

    // use control cursor only when active selection is not active
    const activeControl =
      (!isActiveSelection(this._activeObject) ||
        !target.isDescendantOf(this._activeObject)) &&
      target.getActiveControl();

    if (!activeControl) {
      const subTargetHoverCursor =
        (target as Group).subTargetCheck &&
        this.targets.find((subTarget) => subTarget.hoverCursor)?.hoverCursor;
      this.setCursor(
        subTargetHoverCursor || target.hoverCursor || this.hoverCursor
      );
    } else {
      const control = activeControl.control;
      this.setCursor(control.cursorStyleHandler(e, control, target));
    }
  }

  /**
   * ## Handles multiple selection
   * - toggles `target` selection (selects/deselects `target` if it isn't/is selected respectively)
   * - sets the active object in case it is not set or in case there is a single active object left under active selection.
   * ---
   * - If the active object is the active selection we add/remove `target` from it
   * - If not, add the active object and `target` to the active selection and make it the active object.
   * @private
   * @param {TPointerEvent} e Event object
   * @param {FabricObject} target target of event to select/deselect
   * @returns true if grouping occurred
   */
  protected handleMultiSelection(
    e: StatefulEvent<TPointerEvent>,
    target?: FabricObject
  ) {
    const activeObject = this._activeObject;
    const isAS = isActiveSelection(activeObject);
    if (
      // check if an active object exists on canvas and if the user is pressing the `selectionKey` while canvas supports multi selection.
      !!activeObject &&
      this._isSelectionKeyPressed(e) &&
      this.selection &&
      // on top of that the user also has to hit a target that is selectable.
      !!target &&
      target.selectable &&
      // group target and active object only if they are different objects
      // else we try to find a subtarget of `ActiveSelection`
      (activeObject !== target || isAS) &&
      //  make sure `activeObject` and `target` aren't ancestors of each other in case `activeObject` is not `ActiveSelection`
      // if it is then we want to remove `target` from it
      (isAS ||
        (!target.isDescendantOf(activeObject) &&
          !activeObject.isDescendantOf(target))) &&
      //  target accepts selection
      !target.onSelect({ e }) &&
      // make sure we are not on top of a control
      !activeObject.getActiveControl()
    ) {
      if (isAS) {
        const prevActiveObjects = activeObject.getObjects();
        if (target === activeObject) {
          const viewportPoint =
            'viewportPoint' in e ? e.viewportPoint : this.getViewportPoint(e);
          target =
            // first search active objects for a target to remove
            this.searchPossibleTargets(prevActiveObjects, viewportPoint) ||
            //  if not found, search under active selection for a target to add
            // `prevActiveObjects` will be searched but we already know they will not be found
            this.searchPossibleTargets(this._objects, viewportPoint);
          // if nothing is found bail out
          if (!target || !target.selectable) {
            return false;
          }
        }
        if (target.group === activeObject) {
          // `target` is part of active selection => remove it
          activeObject.remove(target);
          this._hoveredTarget = target;
          this._hoveredTargets = [...this.targets];
          // if after removing an object we are left with one only...
          if (activeObject.size() === 1) {
            // activate last remaining object
            // deselecting the active selection will remove the remaining object from it
            this._setActiveObject(activeObject.item(0), e);
          }
        } else {
          // `target` isn't part of active selection => add it
          activeObject.multiSelectAdd(target);
          this._hoveredTarget = activeObject;
          this._hoveredTargets = [...this.targets];
        }
        this._fireSelectionEvents(prevActiveObjects, e);
        return true;
      } else {
        (activeObject as IText).exitEditing &&
          (activeObject as IText).exitEditing();
        // add the active object and the target to the active selection and set it as the active object
        const klass =
          classRegistry.getClass<typeof ActiveSelection>('ActiveSelection');
        const newActiveSelection = new klass([], {
          /**
           * it is crucial to pass the canvas ref before calling {@link ActiveSelection#multiSelectAdd}
           * since it uses {@link FabricObject#isInFrontOf} which relies on the canvas ref
           */
          canvas: this,
        });
        newActiveSelection.multiSelectAdd(activeObject, target);
        this._hoveredTarget = newActiveSelection;
        // ISSUE 4115: should we consider subTargets here?
        // this._hoveredTargets = [];
        // this._hoveredTargets = this.targets.concat();
        this._setActiveObject(newActiveSelection, e);
        this._fireSelectionEvents([activeObject], e);
        return true;
      }
    }
    return false;
  }

  /**
   * ## Handles selection
   * - selects objects that are contained in (and possibly intersecting) the selection bounding box
   * - sets the active object
   * ---
   * runs on mouse up after a mouse move
   */
  protected handleSelection(e: TPointerEvent) {
    if (!this.selection || !this._groupSelector) {
      return false;
    }
    const { x, y, deltaX, deltaY } = this._groupSelector,
      point1 = new Point(x, y),
      point2 = point1.add(new Point(deltaX, deltaY)),
      tl = point1.min(point2),
      br = point1.max(point2),
      size = br.subtract(tl);

    // cleanup
    this._groupSelector = null;

    const collectedObjects = this.collectObjects(
      {
        left: tl.x,
        top: tl.y,
        width: size.x,
        height: size.y,
      },
      { includeIntersecting: !this.selectionFullyContained }
    ) as FabricObject[];

    const objects =
      // though this method runs only after mouse move the pointer could do a mouse up on the same position as mouse down
      // should it be handled as is?
      point1.eq(point2)
        ? collectedObjects[0]
          ? [collectedObjects[0]]
          : []
        : collectedObjects.length > 1
        ? collectedObjects.filter((object) => !object.onSelect({ e })).reverse()
        : // `setActiveObject` will call `onSelect(collectedObjects[0])` in this case
          collectedObjects;

    // set active object
    if (objects.length === 1) {
      // set as active object
      return this.setActiveObject(objects[0], e);
    } else if (objects.length > 1) {
      // add to active selection and make it the active object
      const klass =
        classRegistry.getClass<typeof ActiveSelection>('ActiveSelection');
      return this.setActiveObject(new klass(objects, { canvas: this }), e);
    }

    return false;
  }

  /**
   * @override clear {@link textEditingManager}
   */
  clear() {
    this.textEditingManager.clear();
    super.clear();
  }

  /**
   * @override clear {@link textEditingManager}
   */
  destroy() {
    this.removeListeners();
    this.textEditingManager.dispose();
    super.destroy();
  }
}
