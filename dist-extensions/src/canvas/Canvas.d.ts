import type { CanvasEvents, DragEventData, ObjectEvents, TPointerEvent, TPointerEventNames, Transform } from '../EventTypeDefs';
import { Point } from '../Point';
import type { FabricObject } from '../shapes/Object/FabricObject';
import type { CanvasOptions, TCanvasOptions } from './CanvasOptions';
import { SelectableCanvas } from './SelectableCanvas';
import { TextEditingManager } from './TextEditingManager';
type TSyntheticEventContext = {
    mouse: {
        e: TPointerEvent;
    };
    drag: DragEventData;
};
export declare class Canvas extends SelectableCanvas implements CanvasOptions {
    /**
     * Contains the id of the touch event that owns the fabric transform
     * @type Number
     * @private
     */
    mainTouchId?: number;
    enablePointerEvents: boolean;
    /**
     * Holds a reference to a setTimeout timer for event synchronization
     * @type number
     * @private
     */
    private _willAddMouseDown;
    /**
     * Holds a reference to an object on the canvas that is receiving the drag over event.
     * @type FabricObject
     * @private
     */
    private _draggedoverTarget?;
    /**
     * Holds a reference to an object on the canvas from where the drag operation started
     * @type FabricObject
     * @private
     */
    private _dragSource?;
    /**
     * Holds a reference to an object on the canvas that is the current drop target
     * May differ from {@link _draggedoverTarget}
     * @todo inspect whether {@link _draggedoverTarget} and {@link _dropTarget} should be merged somehow
     * @type FabricObject
     * @private
     */
    private _dropTarget;
    private _isClick;
    textEditingManager: TextEditingManager;
    constructor(el?: string | HTMLCanvasElement, options?: TCanvasOptions);
    /**
     * return an event prefix pointer or mouse.
     * @private
     */
    private _getEventPrefix;
    addOrRemove(functor: any, _eventjsFunctor: 'add' | 'remove'): void;
    /**
     * Removes all event listeners
     */
    removeListeners(): void;
    /**
     * @private
     * @param {Event} [e] Event object fired on wheel event
     */
    private _onMouseWheel;
    /**
     * @private
     * @param {Event} e Event object fired on mousedown
     */
    private _onMouseOut;
    /**
     * @private
     * @param {Event} e Event object fired on mouseenter
     */
    private _onMouseEnter;
    /**
     * supports native like text dragging
     * @private
     * @param {DragEvent} e
     */
    private _onDragStart;
    /**
     * First we clear top context where the effects are being rendered.
     * Then we render the effects.
     * Doing so will render the correct effect for all cases including an overlap between `source` and `target`.
     * @private
     */
    private _renderDragEffects;
    /**
     * supports native like text dragging
     * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#finishing_a_drag
     * @private
     * @param {DragEvent} e
     */
    private _onDragEnd;
    /**
     * fire `drag` event on canvas and drag source
     * @private
     * @param {DragEvent} e
     */
    private _onDragProgress;
    /**
     * As opposed to {@link findTarget} we want the top most object to be returned w/o the active object cutting in line.
     * Override at will
     */
    protected findDragTargets(e: DragEvent): {
        target: FabricObject<Partial<import("../..").FabricObjectProps>, import("../..").SerializedObjectProps, ObjectEvents> | undefined;
        targets: FabricObject<Partial<import("../..").FabricObjectProps>, import("../..").SerializedObjectProps, ObjectEvents>[];
    };
    /**
     * prevent default to allow drop event to be fired
     * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#specifying_drop_targets
     * @private
     * @param {DragEvent} [e] Event object fired on Event.js shake
     */
    private _onDragOver;
    /**
     * fire `dragleave` on `dragover` targets
     * @private
     * @param {Event} [e] Event object fired on Event.js shake
     */
    private _onDragEnter;
    /**
     * fire `dragleave` on `dragover` targets
     * @private
     * @param {Event} [e] Event object fired on Event.js shake
     */
    private _onDragLeave;
    /**
     * `drop:before` is a an event that allows you to schedule logic
     * before the `drop` event. Prefer `drop` event always, but if you need
     * to run some drop-disabling logic on an event, since there is no way
     * to handle event handlers ordering, use `drop:before`
     * @private
     * @param {Event} e
     */
    private _onDrop;
    /**
     * @private
     * @param {Event} e Event object fired on mousedown
     */
    private _onContextMenu;
    /**
     * @private
     * @param {Event} e Event object fired on mousedown
     */
    private _onDoubleClick;
    /**
     * Return a the id of an event.
     * returns either the pointerId or the identifier or 0 for the mouse event
     * @private
     * @param {Event} evt Event object
     */
    getPointerId(evt: TouchEvent | PointerEvent): number;
    /**
     * Determines if an event has the id of the event that is considered main
     * @private
     * @param {evt} event Event object
     */
    _isMainEvent(evt: TPointerEvent): boolean;
    /**
     * @private
     * @param {Event} e Event object fired on mousedown
     */
    _onTouchStart(e: TouchEvent): void;
    /**
     * @private
     * @param {Event} e Event object fired on mousedown
     */
    _onMouseDown(e: TPointerEvent): void;
    /**
     * @private
     * @param {Event} e Event object fired on mousedown
     */
    _onTouchEnd(e: TouchEvent): void;
    /**
     * @private
     * @param {Event} e Event object fired on mouseup
     */
    _onMouseUp(e: TPointerEvent): void;
    /**
     * @private
     * @param {Event} e Event object fired on mousemove
     */
    _onMouseMove(e: TPointerEvent): void;
    /**
     * @private
     */
    _onResize(): void;
    /**
     * Decides whether the canvas should be redrawn in mouseup and mousedown events.
     * @private
     * @param {Object} target
     */
    _shouldRender(target: FabricObject | undefined): boolean | undefined;
    /**
     * Method that defines the actions when mouse is released on canvas.
     * The method resets the currentTransform parameters, store the image corner
     * position in the image object and render the canvas on top.
     * @private
     * @param {Event} e Event object fired on mouseup
     */
    __onMouseUp(e: TPointerEvent): void;
    _basicEventHandler<T extends keyof (CanvasEvents | ObjectEvents)>(eventType: T, options: (CanvasEvents & ObjectEvents)[T]): (CanvasEvents & ObjectEvents)[T];
    /**
     * @private
     * Handle event firing for target and subtargets
     * @param {TPointerEvent} e event from mouse
     * @param {TPointerEventNames} eventType
     */
    _handleEvent<T extends TPointerEventNames>(e: TPointerEvent, eventType: T): void;
    /**
     * @private
     * @param {Event} e Event object fired on mousedown
     */
    _onMouseDownInDrawingMode(e: TPointerEvent): void;
    /**
     * @private
     * @param {Event} e Event object fired on mousemove
     */
    _onMouseMoveInDrawingMode(e: TPointerEvent): void;
    /**
     * @private
     * @param {Event} e Event object fired on mouseup
     */
    _onMouseUpInDrawingMode(e: TPointerEvent): void;
    /**
     * Method that defines the actions when mouse is clicked on canvas.
     * The method inits the currentTransform parameters and renders all the
     * canvas so the current image can be placed on the top canvas and the rest
     * in on the container one.
     * @private
     * @param {Event} e Event object fired on mousedown
     */
    __onMouseDown(e: TPointerEvent): void;
    /**
     * reset cache form common information needed during event processing
     * @private
     */
    _resetTransformEventData(): void;
    /**
     * Cache common information needed during event processing
     * @private
     * @param {Event} e Event object fired on event
     */
    _cacheTransformEventData(e: TPointerEvent): void;
    /**
     * Method that defines the actions when mouse is hovering the canvas.
     * The currentTransform parameter will define whether the user is rotating/scaling/translating
     * an image or neither of them (only hovering). A group selection is also possible and would cancel
     * all any other type of action.
     * In case of an image transformation only the top canvas will be rendered.
     * @private
     * @param {Event} e Event object fired on mousemove
     */
    __onMouseMove(e: TPointerEvent): void;
    /**
     * Manage the mouseout, mouseover events for the fabric object on the canvas
     * @param {Fabric.Object} target the target where the target from the mousemove event
     * @param {Event} e Event object fired on mousemove
     * @private
     */
    _fireOverOutEvents(e: TPointerEvent, target?: FabricObject): void;
    /**
     * Manage the dragEnter, dragLeave events for the fabric objects on the canvas
     * @param {Fabric.Object} target the target where the target from the onDrag event
     * @param {Object} data Event object fired on dragover
     * @private
     */
    _fireEnterLeaveEvents(target: FabricObject | undefined, data: DragEventData): void;
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
    fireSyntheticInOutEvents<T extends keyof TSyntheticEventContext>(type: T, { target, oldTarget, fireCanvas, e, ...data }: TSyntheticEventContext[T] & {
        target?: FabricObject;
        oldTarget?: FabricObject;
        fireCanvas?: boolean;
    }): void;
    /**
     * Method that defines actions when an Event Mouse Wheel
     * @param {Event} e Event object fired on mouseup
     */
    __onMouseWheel(e: TPointerEvent): void;
    /**
     * @private
     * @param {Event} e Event fired on mousemove
     */
    _transformObject(e: TPointerEvent): void;
    /**
     * @private
     */
    _performTransformAction(e: TPointerEvent, transform: Transform, pointer: Point): void;
    /**
     * Sets the cursor depending on where the canvas is being hovered.
     * Note: very buggy in Opera
     * @param {Event} e Event object
     * @param {Object} target Object that the mouse is hovering, if so.
     */
    _setCursorFromEvent(e: TPointerEvent, target?: FabricObject): void;
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
    protected handleMultiSelection(e: TPointerEvent, target?: FabricObject): boolean;
    /**
     * ## Handles selection
     * - selects objects that are contained in (and possibly intersecting) the selection bounding box
     * - sets the active object
     * ---
     * runs on mouse up after a mouse move
     */
    protected handleSelection(e: TPointerEvent): boolean;
    /**
     * @override clear {@link textEditingManager}
     */
    clear(): void;
    /**
     * @override clear {@link textEditingManager}
     */
    destroy(): void;
}
export {};
//# sourceMappingURL=Canvas.d.ts.map