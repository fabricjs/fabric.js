import { Point } from '../Point';
import { FabricObject } from '../shapes/Object/FabricObject';
import type { CanvasEvents, ModifierKey, TOptionalModifierKey, TPointerEvent, Transform } from '../EventTypeDefs';
import type { TCanvasSizeOptions } from './StaticCanvas';
import { StaticCanvas } from './StaticCanvas';
import type { TMat2D, TOriginX, TOriginY, TSize, TSVGReviver } from '../typedefs';
import type { BaseBrush } from '../brushes/BaseBrush';
import { CanvasDOMManager } from './DOMManagers/CanvasDOMManager';
import type { CanvasOptions } from './CanvasOptions';
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
export declare class SelectableCanvas<EventSpec extends CanvasEvents = CanvasEvents> extends StaticCanvas<EventSpec> implements Omit<CanvasOptions, 'enablePointerEvents'> {
    _objects: FabricObject[];
    uniformScaling: boolean;
    uniScaleKey: TOptionalModifierKey;
    centeredScaling: boolean;
    centeredRotation: boolean;
    centeredKey: TOptionalModifierKey;
    altActionKey: TOptionalModifierKey;
    selection: boolean;
    selectionKey: TOptionalModifierKey | ModifierKey[];
    altSelectionKey: TOptionalModifierKey;
    selectionColor: string;
    selectionDashArray: number[];
    selectionBorderColor: string;
    selectionLineWidth: number;
    selectionFullyContained: boolean;
    hoverCursor: CSSStyleDeclaration['cursor'];
    moveCursor: CSSStyleDeclaration['cursor'];
    defaultCursor: CSSStyleDeclaration['cursor'];
    freeDrawingCursor: CSSStyleDeclaration['cursor'];
    notAllowedCursor: CSSStyleDeclaration['cursor'];
    containerClass: string;
    perPixelTargetFind: boolean;
    targetFindTolerance: number;
    skipTargetFind: boolean;
    /**
     * When true, mouse events on canvas (mousedown/mousemove/mouseup) result in free drawing.
     * After mousedown, mousemove creates a shape,
     * and then mouseup finalizes it and adds an instance of `fabric.Path` onto canvas.
     * @tutorial {@link http://fabricjs.com/fabric-intro-part-4#free_drawing}
     * @type Boolean
     * @default
     */
    isDrawingMode: boolean;
    preserveObjectStacking: boolean;
    stopContextMenu: boolean;
    fireRightClick: boolean;
    fireMiddleClick: boolean;
    /**
     * Keep track of the subTargets for Mouse Events, ordered bottom up from innermost nested subTarget
     * @type FabricObject[]
     */
    targets: FabricObject[];
    /**
     * Keep track of the hovered target
     * @type FabricObject | null
     * @private
     */
    _hoveredTarget?: FabricObject;
    /**
     * hold the list of nested targets hovered
     * @type FabricObject[]
     * @private
     */
    _hoveredTargets: FabricObject[];
    /**
     * hold the list of objects to render
     * @type FabricObject[]
     * @private
     */
    _objectsToRender?: FabricObject[];
    /**
     * hold a reference to a data structure that contains information
     * on the current on going transform
     * @type
     * @private
     */
    _currentTransform: Transform | null;
    /**
     * hold a reference to a data structure used to track the selection
     * box on canvas drag
     * on the current on going transform
     * x, y, deltaX and deltaY are in scene plane
     * @type
     * @private
     */
    protected _groupSelector: {
        x: number;
        y: number;
        deltaX: number;
        deltaY: number;
    } | null;
    /**
     * internal flag used to understand if the context top requires a cleanup
     * in case this is true, the contextTop will be cleared at the next render
     * @type boolean
     * @private
     */
    contextTopDirty: boolean;
    /**
     * During a mouse event we may need the pointer multiple times in multiple functions.
     * _absolutePointer holds a reference to the pointer in fabricCanvas/design coordinates that is valid for the event
     * lifespan. Every fabricJS mouse event create and delete the cache every time
     * We do this because there are some HTML DOM inspection functions to get the actual pointer coordinates
     * @type {Point}
     */
    protected _absolutePointer?: Point;
    /**
     * During a mouse event we may need the pointer multiple times in multiple functions.
     * _pointer holds a reference to the pointer in html coordinates that is valid for the event
     * lifespan. Every fabricJS mouse event create and delete the cache every time
     * We do this because there are some HTML DOM inspection functions to get the actual pointer coordinates
     * @type {Point}
     */
    protected _pointer?: Point;
    /**
     * During a mouse event we may need the target multiple times in multiple functions.
     * _target holds a reference to the target that is valid for the event
     * lifespan. Every fabricJS mouse event create and delete the cache every time
     * @type {FabricObject}
     */
    protected _target?: FabricObject;
    static ownDefaults: import("../typedefs").TOptions<CanvasOptions>;
    static getDefaults(): Record<string, any>;
    elements: CanvasDOMManager;
    get upperCanvasEl(): HTMLCanvasElement;
    get contextTop(): CanvasRenderingContext2D;
    get wrapperEl(): HTMLDivElement;
    private pixelFindCanvasEl;
    private pixelFindContext;
    protected _isCurrentlyDrawing: boolean;
    freeDrawingBrush?: BaseBrush;
    _activeObject?: FabricObject;
    protected initElements(el?: string | HTMLCanvasElement): void;
    /**
     * @private
     * @param {FabricObject} obj Object that was added
     */
    _onObjectAdded(obj: FabricObject): void;
    /**
     * @private
     * @param {FabricObject} obj Object that was removed
     */
    _onObjectRemoved(obj: FabricObject): void;
    _onStackOrderChanged(): void;
    /**
     * Divides objects in two groups, one to render immediately
     * and one to render as activeGroup.
     * @return {Array} objects to render immediately and pushes the other in the activeGroup.
     */
    _chooseObjectsToRender(): FabricObject[];
    /**
     * Renders both the top canvas and the secondary container canvas.
     */
    renderAll(): void;
    /**
     * text selection is rendered by the active text instance during the rendering cycle
     */
    renderTopLayer(ctx: CanvasRenderingContext2D): void;
    /**
     * Method to render only the top canvas.
     * Also used to render the group selection box.
     * Does not render text selection.
     */
    renderTop(): void;
    /**
     * Set the canvas tolerance value for pixel taret find.
     * Use only integer numbers.
     * @private
     */
    setTargetFindTolerance(value: number): void;
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
    isTargetTransparent(target: FabricObject, x: number, y: number): boolean;
    /**
     * takes an event and determines if selection key has been pressed
     * @private
     * @param {TPointerEvent} e Event object
     */
    _isSelectionKeyPressed(e: TPointerEvent): boolean;
    /**
     * @private
     * @param {TPointerEvent} e Event object
     * @param {FabricObject} target
     */
    _shouldClearSelection(e: TPointerEvent, target?: FabricObject): target is undefined;
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
    private _shouldCenterTransform;
    /**
     * Given the control clicked, determine the origin of the transform.
     * This is bad because controls can totally have custom names
     * should disappear before release 4.0
     * @private
     * @deprecated
     */
    _getOriginFromCorner(target: FabricObject, controlName: string): {
        x: TOriginX;
        y: TOriginY;
    };
    /**
     * @private
     * @param {Event} e Event object
     * @param {FabricObject} target
     * @param {boolean} [alreadySelected] pass true to setup the active control
     */
    _setupCurrentTransform(e: TPointerEvent, target: FabricObject, alreadySelected: boolean): void;
    /**
     * Set the cursor type of the canvas element
     * @param {String} value Cursor type of the canvas element.
     * @see http://www.w3.org/TR/css3-ui/#cursor
     */
    setCursor(value: CSSStyleDeclaration['cursor']): void;
    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx to draw the selection on
     */
    _drawSelection(ctx: CanvasRenderingContext2D): void;
    /**
     * Method that determines what object we are clicking on
     * 11/09/2018 TODO: would be cool if findTarget could discern between being a full target
     * or the outside part of the corner.
     * @param {Event} e mouse event
     * @return {FabricObject | null} the target found
     */
    findTarget(e: TPointerEvent): FabricObject | undefined;
    /**
     * Checks if the point is inside the object selection area including padding
     * @param {FabricObject} obj Object to test against
     * @param {Object} [pointer] point in scene coordinates
     * @return {Boolean} true if point is contained within an area of given object
     * @private
     */
    private _pointIsInObjectSelectionArea;
    /**
     * Checks point is inside the object selection condition. Either area with padding
     * or over pixels if perPixelTargetFind is enabled
     * @param {FabricObject} obj Object to test against
     * @param {Object} [pointer] point from viewport.
     * @return {Boolean} true if point is contained within an area of given object
     * @private
     */
    _checkTarget(obj: FabricObject, pointer: Point): boolean;
    /**
     * Internal Function used to search inside objects an object that contains pointer in bounding box or that contains pointerOnCanvas when painted
     * @param {Array} [objects] objects array to look into
     * @param {Object} [pointer] x,y object of point coordinates we want to check.
     * @return {FabricObject} **top most object from given `objects`** that contains pointer
     * @private
     */
    _searchPossibleTargets(objects: FabricObject[], pointer: Point): FabricObject | undefined;
    /**
     * Function used to search inside objects an object that contains pointer in bounding box or that contains pointerOnCanvas when painted
     * @see {@link _searchPossibleTargets}
     * @param {FabricObject[]} [objects] objects array to look into
     * @param {Point} [pointer] coordinates from viewport to check.
     * @return {FabricObject} **top most object on screen** that contains pointer
     */
    searchPossibleTargets(objects: FabricObject[], pointer: Point): FabricObject | undefined;
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
    getViewportPoint(e: TPointerEvent): Point;
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
    getScenePoint(e: TPointerEvent): Point;
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
    getPointer(e: TPointerEvent, fromViewport?: boolean): Point;
    /**
     * Internal use only
     * @protected
     */
    protected _setDimensionsImpl(dimensions: TSize, options?: TCanvasSizeOptions): void;
    protected _createCacheCanvas(): void;
    /**
     * Returns context of top canvas where interactions are drawn
     * @returns {CanvasRenderingContext2D}
     */
    getTopContext(): CanvasRenderingContext2D;
    /**
     * Returns context of canvas where object selection is drawn
     * @alias
     * @return {CanvasRenderingContext2D}
     */
    getSelectionContext(): CanvasRenderingContext2D;
    /**
     * Returns &lt;canvas> element on which object selection is drawn
     * @return {HTMLCanvasElement}
     */
    getSelectionElement(): HTMLCanvasElement;
    /**
     * Returns currently active object
     * @return {FabricObject | null} active object
     */
    getActiveObject(): FabricObject | undefined;
    /**
     * Returns an array with the current selected objects
     * @return {FabricObject[]} active objects array
     */
    getActiveObjects(): FabricObject[];
    /**
     * @private
     * Compares the old activeObject with the current one and fires correct events
     * @param {FabricObject[]} oldObjects old activeObject
     * @param {TPointerEvent} e mouse event triggering the selection events
     */
    _fireSelectionEvents(oldObjects: FabricObject[], e?: TPointerEvent): void;
    /**
     * Sets given object as the only active object on canvas
     * @param {FabricObject} object Object to set as an active one
     * @param {TPointerEvent} [e] Event (passed along when firing "object:selected")
     * @return {Boolean} true if the object has been selected
     */
    setActiveObject(object: FabricObject, e?: TPointerEvent): boolean;
    /**
     * This is supposed to be equivalent to setActiveObject but without firing
     * any event. There is commitment to have this stay this way.
     * This is the functional part of setActiveObject.
     * @param {Object} object to set as active
     * @param {Event} [e] Event (passed along when firing "object:selected")
     * @return {Boolean} true if the object has been selected
     */
    _setActiveObject(object: FabricObject, e?: TPointerEvent): boolean;
    /**
     * This is supposed to be equivalent to discardActiveObject but without firing
     * any selection events ( can still fire object transformation events ). There is commitment to have this stay this way.
     * This is the functional part of discardActiveObject.
     * @param {Event} [e] Event (passed along when firing "object:deselected")
     * @param {Object} object the next object to set as active, reason why we are discarding this
     * @return {Boolean} true if the active object has been discarded
     */
    _discardActiveObject(e?: TPointerEvent, object?: FabricObject): this is {
        _activeObject: undefined;
    };
    /**
     * Discards currently active object and fire events. If the function is called by fabric
     * as a consequence of a mouse event, the event is passed as a parameter and
     * sent to the fire function for the custom events. When used as a method the
     * e param does not have any application.
     * @param {event} e
     * @return {Boolean} true if the active object has been discarded
     */
    discardActiveObject(e?: TPointerEvent): this is {
        _activeObject: undefined;
    };
    /**
     * End the current transform.
     * You don't usually need to call this method unless you are interrupting a user initiated transform
     * because of some other event ( a press of key combination, or something that block the user UX )
     * @param {Event} [e] send the mouse event that generate the finalize down, so it can be used in the event
     */
    endCurrentTransform(e?: TPointerEvent): void;
    /**
     * @private
     * @param {Event} e send the mouse event that generate the finalize down, so it can be used in the event
     */
    _finalizeCurrentTransform(e?: TPointerEvent): void;
    /**
     * Sets viewport transformation of this canvas instance
     * @param {Array} vpt a Canvas 2D API transform matrix
     */
    setViewportTransform(vpt: TMat2D): void;
    /**
     * @override clears active selection ref and interactive canvas elements and contexts
     */
    destroy(): void;
    /**
     * Clears all contexts (background, main, top) of an instance
     */
    clear(): void;
    /**
     * Draws objects' controls (borders/controls)
     * @param {CanvasRenderingContext2D} ctx Context to render controls on
     */
    drawControls(ctx: CanvasRenderingContext2D): void;
    /**
     * @private
     */
    protected _toObject(instance: FabricObject, methodName: 'toObject' | 'toDatalessObject', propertiesToInclude: string[]): Record<string, any>;
    /**
     * Realizes an object's group transformation on it
     * @private
     * @param {FabricObject} [instance] the object to transform (gets mutated)
     * @returns the original values of instance which were changed
     */
    private _realizeGroupTransformOnObject;
    /**
     * @private
     */
    _setSVGObject(markup: string[], instance: FabricObject, reviver?: TSVGReviver): void;
}
//# sourceMappingURL=SelectableCanvas.d.ts.map