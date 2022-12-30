import { CanvasEvents, DragEventData, ObjectEvents, TEvent, TPointerEvent, TPointerEventInfo, TPointerEventNames, Transform } from '../EventTypeDefs';
import { Point } from '../point.class';
import { Group } from '../shapes/group.class';
import type { FabricObject } from '../shapes/Object/FabricObject';
import { SelectableCanvas } from './canvas.class';
type TSyntheticEventContext = {
    mouse: {
        e: TPointerEvent;
    };
    drag: DragEventData;
};
export declare class Canvas extends SelectableCanvas {
    /**
     * Contains the id of the touch event that owns the fabric transform
     * @type Number
     * @private
     */
    mainTouchId: null | number;
    /**
     * When the option is enabled, PointerEvent is used instead of TPointerEvent.
     * @type Boolean
     * @default
     */
    enablePointerEvents: boolean;
    /**
     * an internal flag that is used to remember if we already bound the events
     * @type Boolean
     * @private
     */
    private eventsBound;
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
    currentTarget?: FabricObject;
    currentSubTargets?: FabricObject[];
    /**
     * Holds a reference to a pointer during mousedown to compare on mouse up and determine
     * if it was a click event
     * @type FabricObject
     * @private
     */
    _previousPointer: Point;
    /**
     * Adds mouse listeners to canvas
     * @private
     */
    private _initEventListeners;
    /**
     * return an event prefix pointer or mouse.
     * @private
     */
    private _getEventPrefix;
    addOrRemove(functor: any, eventjsFunctor: 'add' | 'remove'): void;
    /**
     * Removes all event listeners
     */
    removeListeners(): void;
    /**
     * @private
     */
    private _bindEvents;
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
    _shouldRender(target: FabricObject | undefined): boolean;
    /**
     * Method that defines the actions when mouse is released on canvas.
     * The method resets the currentTransform parameters, store the image corner
     * position in the image object and render the canvas on top.
     * @private
     * @param {Event} e Event object fired on mouseup
     */
    __onMouseUp(e: TPointerEvent): void;
    /**
     * @private
     * Handle event firing for target and subtargets
     * @param {String} eventType event to fire (up, down or move)
     * @param {Event} e event from mouse
     * @param {object} [data] event data overrides
     * @return {object} options
     */
    _simpleEventHandler<T extends keyof (CanvasEvents | ObjectEvents), E extends TPointerEvent | DragEvent>(eventType: T, { e, ...data }: Omit<(CanvasEvents & ObjectEvents)[T], 'target' | 'subTargets'> & TEvent<E>): (import("../EventTypeDefs").CollectionEvents & {
        'canvas:cleared': never;
        'before:render': {
            ctx: CanvasRenderingContext2D;
        };
        'after:render': {
            ctx: CanvasRenderingContext2D;
        };
    } & Record<"mouse:down" | "mouse:down:before" | "mouse:move" | "mouse:move:before" | "mouse:up" | "mouse:up:before" | "mouse:dblclick", TPointerEventInfo<TPointerEvent>> & Record<"mouse:wheel", TPointerEventInfo<WheelEvent>> & Record<"mouse:over", TEvent<TPointerEvent> & {
        target?: FabricObject<ObjectEvents> | undefined;
        subTargets?: FabricObject<ObjectEvents>[] | undefined;
        button?: number | undefined;
        isClick: boolean;
        pointer: Point;
        transform?: Transform | null | undefined;
        absolutePointer: Point;
        currentSubTargets?: FabricObject<ObjectEvents>[] | undefined;
        currentTarget?: FabricObject<ObjectEvents> | null | undefined;
    } & {
        previousTarget?: FabricObject<ObjectEvents> | undefined;
    }> & Record<"mouse:out", TEvent<TPointerEvent> & {
        target?: FabricObject<ObjectEvents> | undefined;
        subTargets?: FabricObject<ObjectEvents>[] | undefined;
        button?: number | undefined;
        isClick: boolean;
        pointer: Point;
        transform?: Transform | null | undefined;
        absolutePointer: Point;
        currentSubTargets?: FabricObject<ObjectEvents>[] | undefined;
        currentTarget?: FabricObject<ObjectEvents> | null | undefined;
    } & {
        nextTarget?: FabricObject<ObjectEvents> | undefined;
    }> & {
        dragstart: TEvent<DragEvent> & {
            target: FabricObject<ObjectEvents>;
        };
        drag: DragEventData;
        dragover: DragEventData;
        dragenter: TEvent<DragEvent> & {
            target?: FabricObject<ObjectEvents> | undefined;
            subTargets?: FabricObject<ObjectEvents>[] | undefined;
            dragSource?: FabricObject<ObjectEvents> | undefined;
            canDrop?: boolean | undefined;
            didDrop?: boolean | undefined;
            dropTarget?: FabricObject<ObjectEvents> | undefined;
        } & {
            previousTarget?: FabricObject<ObjectEvents> | undefined;
        };
        dragleave: TEvent<DragEvent> & {
            target?: FabricObject<ObjectEvents> | undefined;
            subTargets?: FabricObject<ObjectEvents>[] | undefined;
            dragSource?: FabricObject<ObjectEvents> | undefined;
            canDrop?: boolean | undefined;
            didDrop?: boolean | undefined;
            dropTarget?: FabricObject<ObjectEvents> | undefined;
        } & {
            nextTarget?: FabricObject<ObjectEvents> | undefined;
        };
        dragend: DragEventData;
        'drop:before': TEvent<DragEvent> & {
            target?: FabricObject<ObjectEvents> | undefined;
            subTargets?: FabricObject<ObjectEvents>[] | undefined;
            dragSource?: FabricObject<ObjectEvents> | undefined;
            canDrop?: boolean | undefined;
            didDrop?: boolean | undefined;
            dropTarget?: FabricObject<ObjectEvents> | undefined;
        } & {
            pointer: Point;
        };
        drop: TEvent<DragEvent> & {
            target?: FabricObject<ObjectEvents> | undefined;
            subTargets?: FabricObject<ObjectEvents>[] | undefined;
            dragSource?: FabricObject<ObjectEvents> | undefined;
            canDrop?: boolean | undefined;
            didDrop?: boolean | undefined;
            dropTarget?: FabricObject<ObjectEvents> | undefined;
        } & {
            pointer: Point;
        };
        'drop:after': TEvent<DragEvent> & {
            target?: FabricObject<ObjectEvents> | undefined;
            subTargets?: FabricObject<ObjectEvents>[] | undefined;
            dragSource?: FabricObject<ObjectEvents> | undefined;
            canDrop?: boolean | undefined;
            didDrop?: boolean | undefined;
            dropTarget?: FabricObject<ObjectEvents> | undefined;
        } & {
            pointer: Point;
        };
    } & {
        'drag:enter': TEvent<DragEvent> & {
            target?: FabricObject<ObjectEvents> | undefined;
            subTargets?: FabricObject<ObjectEvents>[] | undefined;
            dragSource?: FabricObject<ObjectEvents> | undefined;
            canDrop?: boolean | undefined;
            didDrop?: boolean | undefined;
            dropTarget?: FabricObject<ObjectEvents> | undefined;
        } & {
            previousTarget?: FabricObject<ObjectEvents> | undefined;
        };
        'drag:leave': TEvent<DragEvent> & {
            target?: FabricObject<ObjectEvents> | undefined;
            subTargets?: FabricObject<ObjectEvents>[] | undefined;
            dragSource?: FabricObject<ObjectEvents> | undefined;
            canDrop?: boolean | undefined;
            didDrop?: boolean | undefined;
            dropTarget?: FabricObject<ObjectEvents> | undefined;
        } & {
            nextTarget?: FabricObject<ObjectEvents> | undefined;
        };
    } & import("../EventTypeDefs").MiscEvents & Record<"object:moving" | "object:scaling" | "object:rotating" | "object:skewing" | "object:resizing", TEvent<TPointerEvent> & {
        transform: Transform;
        pointer: Point;
    } & {
        target: FabricObject<ObjectEvents>;
    }> & Record<"object:modified", import("../EventTypeDefs").ModifiedEvent<TPointerEvent> | {
        target: FabricObject<ObjectEvents>;
    }> & {
        'before:transform': TEvent<TPointerEvent> & {
            transform: Transform;
        };
    } & {
        'selection:created': Partial<TEvent<TPointerEvent>> & {
            selected: FabricObject<ObjectEvents>[];
        };
        'selection:updated': Partial<TEvent<TPointerEvent>> & {
            selected: FabricObject<ObjectEvents>[];
            deselected: FabricObject<ObjectEvents>[];
        };
        'before:selection:cleared': Partial<TEvent<TPointerEvent>> & {
            deselected: FabricObject<ObjectEvents>[];
        };
        'selection:cleared': Partial<TEvent<TPointerEvent>> & {
            deselected: FabricObject<ObjectEvents>[];
        };
    } & {
        'before:path:created': {
            path: FabricObject<ObjectEvents>;
        };
        'path:created': {
            path: FabricObject<ObjectEvents>;
        };
        'erasing:start': never;
        'erasing:end': {
            path: FabricObject<ObjectEvents>;
            targets: FabricObject<ObjectEvents>[];
            subTargets: FabricObject<ObjectEvents>[];
            drawables: {
                backgroundImage?: FabricObject<ObjectEvents> | undefined;
                overlayImage?: FabricObject<ObjectEvents> | undefined;
            };
        };
        'text:selection:changed': {
            target: import("../shapes/itext.class").IText;
        };
        'text:changed': {
            target: import("../shapes/itext.class").IText;
        };
        'text:editing:entered': {
            target: import("../shapes/itext.class").IText;
        };
        'text:editing:exited': {
            target: import("../shapes/itext.class").IText;
        };
    } & Record<"mousedown" | "mousedown:before" | "mousemove" | "mousemove:before" | "mouseup" | "mouseup:before" | "mousedblclick", TPointerEventInfo<TPointerEvent>> & Record<"mousewheel", TPointerEventInfo<WheelEvent>> & Record<"mouseover", TEvent<TPointerEvent> & {
        target?: FabricObject<ObjectEvents> | undefined;
        subTargets?: FabricObject<ObjectEvents>[] | undefined;
        button?: number | undefined;
        isClick: boolean;
        pointer: Point;
        transform?: Transform | null | undefined;
        absolutePointer: Point;
        currentSubTargets?: FabricObject<ObjectEvents>[] | undefined;
        currentTarget?: FabricObject<ObjectEvents> | null | undefined;
    } & {
        previousTarget?: FabricObject<ObjectEvents> | undefined;
    }> & Record<"mouseout", TEvent<TPointerEvent> & {
        target?: FabricObject<ObjectEvents> | undefined;
        subTargets?: FabricObject<ObjectEvents>[] | undefined;
        button?: number | undefined;
        isClick: boolean;
        pointer: Point;
        transform?: Transform | null | undefined;
        absolutePointer: Point;
        currentSubTargets?: FabricObject<ObjectEvents>[] | undefined;
        currentTarget?: FabricObject<ObjectEvents> | null | undefined;
    } & {
        nextTarget?: FabricObject<ObjectEvents> | undefined;
    }> & Record<"moving" | "scaling" | "rotating" | "skewing" | "resizing", import("../EventTypeDefs").BasicTransformEvent<TPointerEvent>> & Record<"modified", import("../EventTypeDefs").ModifiedEvent<TPointerEvent>> & {
        selected: Partial<TEvent<TPointerEvent>> & {
            target: FabricObject<ObjectEvents>;
        };
        deselected: Partial<TEvent<TPointerEvent>> & {
            target: FabricObject<ObjectEvents>;
        };
        added: {
            target: Canvas | Group | import("./static_canvas.class").StaticCanvas<import("../EventTypeDefs").StaticCanvasEvents>;
        };
        removed: {
            target: Canvas | Group | import("./static_canvas.class").StaticCanvas<import("../EventTypeDefs").StaticCanvasEvents>;
        };
        'erasing:end': {
            path: FabricObject<ObjectEvents>;
        };
    })[T];
    _basicEventHandler<T extends keyof (CanvasEvents | ObjectEvents)>(eventType: T, options: (CanvasEvents & ObjectEvents)[T]): (import("../EventTypeDefs").CollectionEvents & {
        'canvas:cleared': never;
        'before:render': {
            ctx: CanvasRenderingContext2D;
        };
        'after:render': {
            ctx: CanvasRenderingContext2D;
        };
    } & Record<"mouse:down" | "mouse:down:before" | "mouse:move" | "mouse:move:before" | "mouse:up" | "mouse:up:before" | "mouse:dblclick", TPointerEventInfo<TPointerEvent>> & Record<"mouse:wheel", TPointerEventInfo<WheelEvent>> & Record<"mouse:over", TEvent<TPointerEvent> & {
        target?: FabricObject<ObjectEvents> | undefined;
        subTargets?: FabricObject<ObjectEvents>[] | undefined;
        button?: number | undefined;
        isClick: boolean;
        pointer: Point;
        transform?: Transform | null | undefined;
        absolutePointer: Point;
        currentSubTargets?: FabricObject<ObjectEvents>[] | undefined;
        currentTarget?: FabricObject<ObjectEvents> | null | undefined;
    } & {
        previousTarget?: FabricObject<ObjectEvents> | undefined;
    }> & Record<"mouse:out", TEvent<TPointerEvent> & {
        target?: FabricObject<ObjectEvents> | undefined;
        subTargets?: FabricObject<ObjectEvents>[] | undefined;
        button?: number | undefined;
        isClick: boolean;
        pointer: Point;
        transform?: Transform | null | undefined;
        absolutePointer: Point;
        currentSubTargets?: FabricObject<ObjectEvents>[] | undefined;
        currentTarget?: FabricObject<ObjectEvents> | null | undefined;
    } & {
        nextTarget?: FabricObject<ObjectEvents> | undefined;
    }> & {
        dragstart: TEvent<DragEvent> & {
            target: FabricObject<ObjectEvents>;
        };
        drag: DragEventData;
        dragover: DragEventData;
        dragenter: TEvent<DragEvent> & {
            target?: FabricObject<ObjectEvents> | undefined;
            subTargets?: FabricObject<ObjectEvents>[] | undefined;
            dragSource?: FabricObject<ObjectEvents> | undefined;
            canDrop?: boolean | undefined;
            didDrop?: boolean | undefined;
            dropTarget?: FabricObject<ObjectEvents> | undefined;
        } & {
            previousTarget?: FabricObject<ObjectEvents> | undefined;
        };
        dragleave: TEvent<DragEvent> & {
            target?: FabricObject<ObjectEvents> | undefined;
            subTargets?: FabricObject<ObjectEvents>[] | undefined;
            dragSource?: FabricObject<ObjectEvents> | undefined;
            canDrop?: boolean | undefined;
            didDrop?: boolean | undefined;
            dropTarget?: FabricObject<ObjectEvents> | undefined;
        } & {
            nextTarget?: FabricObject<ObjectEvents> | undefined;
        };
        dragend: DragEventData;
        'drop:before': TEvent<DragEvent> & {
            target?: FabricObject<ObjectEvents> | undefined;
            subTargets?: FabricObject<ObjectEvents>[] | undefined;
            dragSource?: FabricObject<ObjectEvents> | undefined;
            canDrop?: boolean | undefined;
            didDrop?: boolean | undefined;
            dropTarget?: FabricObject<ObjectEvents> | undefined;
        } & {
            pointer: Point;
        };
        drop: TEvent<DragEvent> & {
            target?: FabricObject<ObjectEvents> | undefined;
            subTargets?: FabricObject<ObjectEvents>[] | undefined;
            dragSource?: FabricObject<ObjectEvents> | undefined;
            canDrop?: boolean | undefined;
            didDrop?: boolean | undefined;
            dropTarget?: FabricObject<ObjectEvents> | undefined;
        } & {
            pointer: Point;
        };
        'drop:after': TEvent<DragEvent> & {
            target?: FabricObject<ObjectEvents> | undefined;
            subTargets?: FabricObject<ObjectEvents>[] | undefined;
            dragSource?: FabricObject<ObjectEvents> | undefined;
            canDrop?: boolean | undefined;
            didDrop?: boolean | undefined;
            dropTarget?: FabricObject<ObjectEvents> | undefined;
        } & {
            pointer: Point;
        };
    } & {
        'drag:enter': TEvent<DragEvent> & {
            target?: FabricObject<ObjectEvents> | undefined;
            subTargets?: FabricObject<ObjectEvents>[] | undefined;
            dragSource?: FabricObject<ObjectEvents> | undefined;
            canDrop?: boolean | undefined;
            didDrop?: boolean | undefined;
            dropTarget?: FabricObject<ObjectEvents> | undefined;
        } & {
            previousTarget?: FabricObject<ObjectEvents> | undefined;
        };
        'drag:leave': TEvent<DragEvent> & {
            target?: FabricObject<ObjectEvents> | undefined;
            subTargets?: FabricObject<ObjectEvents>[] | undefined;
            dragSource?: FabricObject<ObjectEvents> | undefined;
            canDrop?: boolean | undefined;
            didDrop?: boolean | undefined;
            dropTarget?: FabricObject<ObjectEvents> | undefined;
        } & {
            nextTarget?: FabricObject<ObjectEvents> | undefined;
        };
    } & import("../EventTypeDefs").MiscEvents & Record<"object:moving" | "object:scaling" | "object:rotating" | "object:skewing" | "object:resizing", TEvent<TPointerEvent> & {
        transform: Transform;
        pointer: Point;
    } & {
        target: FabricObject<ObjectEvents>;
    }> & Record<"object:modified", import("../EventTypeDefs").ModifiedEvent<TPointerEvent> | {
        target: FabricObject<ObjectEvents>;
    }> & {
        'before:transform': TEvent<TPointerEvent> & {
            transform: Transform;
        };
    } & {
        'selection:created': Partial<TEvent<TPointerEvent>> & {
            selected: FabricObject<ObjectEvents>[];
        };
        'selection:updated': Partial<TEvent<TPointerEvent>> & {
            selected: FabricObject<ObjectEvents>[];
            deselected: FabricObject<ObjectEvents>[];
        };
        'before:selection:cleared': Partial<TEvent<TPointerEvent>> & {
            deselected: FabricObject<ObjectEvents>[];
        };
        'selection:cleared': Partial<TEvent<TPointerEvent>> & {
            deselected: FabricObject<ObjectEvents>[];
        };
    } & {
        'before:path:created': {
            path: FabricObject<ObjectEvents>;
        };
        'path:created': {
            path: FabricObject<ObjectEvents>;
        };
        'erasing:start': never;
        'erasing:end': {
            path: FabricObject<ObjectEvents>;
            targets: FabricObject<ObjectEvents>[];
            subTargets: FabricObject<ObjectEvents>[];
            drawables: {
                backgroundImage?: FabricObject<ObjectEvents> | undefined;
                overlayImage?: FabricObject<ObjectEvents> | undefined;
            };
        };
        'text:selection:changed': {
            target: import("../shapes/itext.class").IText;
        };
        'text:changed': {
            target: import("../shapes/itext.class").IText;
        };
        'text:editing:entered': {
            target: import("../shapes/itext.class").IText;
        };
        'text:editing:exited': {
            target: import("../shapes/itext.class").IText;
        };
    } & Record<"mousedown" | "mousedown:before" | "mousemove" | "mousemove:before" | "mouseup" | "mouseup:before" | "mousedblclick", TPointerEventInfo<TPointerEvent>> & Record<"mousewheel", TPointerEventInfo<WheelEvent>> & Record<"mouseover", TEvent<TPointerEvent> & {
        target?: FabricObject<ObjectEvents> | undefined;
        subTargets?: FabricObject<ObjectEvents>[] | undefined;
        button?: number | undefined;
        isClick: boolean;
        pointer: Point;
        transform?: Transform | null | undefined;
        absolutePointer: Point;
        currentSubTargets?: FabricObject<ObjectEvents>[] | undefined;
        currentTarget?: FabricObject<ObjectEvents> | null | undefined;
    } & {
        previousTarget?: FabricObject<ObjectEvents> | undefined;
    }> & Record<"mouseout", TEvent<TPointerEvent> & {
        target?: FabricObject<ObjectEvents> | undefined;
        subTargets?: FabricObject<ObjectEvents>[] | undefined;
        button?: number | undefined;
        isClick: boolean;
        pointer: Point;
        transform?: Transform | null | undefined;
        absolutePointer: Point;
        currentSubTargets?: FabricObject<ObjectEvents>[] | undefined;
        currentTarget?: FabricObject<ObjectEvents> | null | undefined;
    } & {
        nextTarget?: FabricObject<ObjectEvents> | undefined;
    }> & Record<"moving" | "scaling" | "rotating" | "skewing" | "resizing", import("../EventTypeDefs").BasicTransformEvent<TPointerEvent>> & Record<"modified", import("../EventTypeDefs").ModifiedEvent<TPointerEvent>> & {
        selected: Partial<TEvent<TPointerEvent>> & {
            target: FabricObject<ObjectEvents>;
        };
        deselected: Partial<TEvent<TPointerEvent>> & {
            target: FabricObject<ObjectEvents>;
        };
        added: {
            target: Canvas | Group | import("./static_canvas.class").StaticCanvas<import("../EventTypeDefs").StaticCanvasEvents>;
        };
        removed: {
            target: Canvas | Group | import("./static_canvas.class").StaticCanvas<import("../EventTypeDefs").StaticCanvasEvents>;
        };
        'erasing:end': {
            path: FabricObject<ObjectEvents>;
        };
    })[T];
    /**
     * @private
     * Handle event firing for target and subtargets
     * @param {Event} e event from mouse
     * @param {String} eventType event to fire (up, down or move)
     * @param {fabric.Object} targetObj receiving event
     * @param {Number} [button] button used in the event 1 = left, 2 = middle, 3 = right
     * @param {Boolean} isClick for left button only, indicates that the mouse up happened without move.
     */
    _handleEvent(e: TPointerEvent, eventType: TPointerEventNames, button?: number, isClick?: boolean): void;
    /**
     * End the current transform.
     * You don't usually need to call this method unless you are interrupting a user initiated transform
     * because of some other event ( a press of key combination, or something that block the user UX )
     * @param {Event} [e] send the mouse event that generate the finalize down, so it can be used in the event
     */
    endCurrentTransform(e: TPointerEvent): void;
    /**
     * @private
     * @param {Event} e send the mouse event that generate the finalize down, so it can be used in the event
     */
    _finalizeCurrentTransform(e: TPointerEvent): void;
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
     * @private
     */
    _beforeTransform(e: TPointerEvent): void;
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
     * Return true if the current mouse event that generated a new selection should generate a group
     * @private
     * @param {TPointerEvent} e Event object
     * @param {FabricObject} target
     * @return {Boolean}
     */
    _shouldGroup(e: TPointerEvent, target?: FabricObject): boolean;
    /**
     * Handles active selection creation for user event
     * @private
     * @param {TPointerEvent} e Event object
     * @param {FabricObject} target
     */
    _handleGrouping(e: TPointerEvent, target: FabricObject): void;
    /**
     * @private
     */
    _updateActiveSelection(e: TPointerEvent, target: FabricObject): void;
    /**
     * Generates and set as active the active selection from user events
     * @private
     */
    _createActiveSelection(e: TPointerEvent, target: FabricObject): void;
    /**
     * Finds objects inside the selection rectangle and group them
     * @private
     * @param {Event} e mouse event
     */
    _groupSelectedObjects(e: TPointerEvent): void;
    /**
     * @private
     */
    _collectObjects(e: TPointerEvent): FabricObject<ObjectEvents>[];
    /**
     * @private
     */
    _maybeGroupObjects(e: TPointerEvent): void;
    /**
     * Clones canvas instance without cloning existing data.
     * This essentially copies canvas dimensions since loadFromJSON does not affect canvas size.
     * @returns {StaticCanvas}
     */
    cloneWithoutData(): Canvas;
}
export {};
//# sourceMappingURL=canvas_events.d.ts.map