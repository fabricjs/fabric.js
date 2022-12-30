import { Point } from '../point.class';
import { FabricObject } from '../shapes/Object/FabricObject';
import { CanvasEvents, ModifierKey, TOptionalModifierKey, TPointerEvent, Transform } from '../EventTypeDefs';
import { StaticCanvas, TCanvasSizeOptions } from './static_canvas.class';
import { TMat2D, TOriginX, TOriginY, TSize } from '../typedefs';
import type { IText } from '../shapes/itext.class';
import type { BaseBrush } from '../brushes/base_brush.class';
import type { Textbox } from '../shapes/textbox.class';
import { TSVGReviver } from '../mixins/object.svg_export';
type TDestroyedCanvas = Omit<SelectableCanvas<CanvasEvents>, 'contextTop' | 'contextCache' | 'lowerCanvasEl' | 'upperCanvasEl' | 'cacheCanvasEl' | 'wrapperEl'> & {
    wrapperEl?: HTMLDivElement;
    cacheCanvasEl?: HTMLCanvasElement;
    upperCanvasEl?: HTMLCanvasElement;
    lowerCanvasEl?: HTMLCanvasElement;
    contextCache?: CanvasRenderingContext2D | null;
    contextTop?: CanvasRenderingContext2D | null;
};
/**
 * Canvas class
 * @class Canvas
 * @extends StaticCanvas
 * @tutorial {@link http://fabricjs.com/fabric-intro-part-1#canvas}
 *
 * @fires object:modified at the end of a transform or any change when statefull is true
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
 *  !flag && this.callSuper('canDrop', e);
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
export declare class SelectableCanvas<EventSpec extends CanvasEvents = CanvasEvents> extends StaticCanvas<EventSpec> {
    /**
     * When true, objects can be transformed by one side (unproportionally)
     * when dragged on the corners that normally would not do that.
     * @type Boolean
     * @default
     * @since fabric 4.0 // changed name and default value
     */
    uniformScaling: boolean;
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
    uniScaleKey: TOptionalModifierKey;
    /**
     * When true, objects use center point as the origin of scale transformation.
     * <b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).
     * @since 1.3.4
     * @type Boolean
     * @default
     */
    centeredScaling: boolean;
    /**
     * When true, objects use center point as the origin of rotate transformation.
     * <b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).
     * @since 1.3.4
     * @type Boolean
     * @default
     */
    centeredRotation: boolean;
    /**
     * Indicates which key enable centered Transform
     * values: 'altKey', 'shiftKey', 'ctrlKey'.
     * If `null` or 'none' or any other string that is not a modifier key
     * feature is disabled feature disabled.
     * @since 1.6.2
     * @type ModifierKey
     * @default
     */
    centeredKey: TOptionalModifierKey;
    /**
     * Indicates which key enable alternate action on corner
     * values: 'altKey', 'shiftKey', 'ctrlKey'.
     * If `null` or 'none' or any other string that is not a modifier key
     * feature is disabled feature disabled.
     * @since 1.6.2
     * @type ModifierKey
     * @default
     */
    altActionKey: TOptionalModifierKey;
    /**
     * Indicates that canvas is interactive. This property should not be changed.
     * @type Boolean
     * @default
     */
    interactive: boolean;
    /**
     * Indicates whether group selection should be enabled
     * @type Boolean
     * @default
     */
    selection: boolean;
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
    selectionKey: TOptionalModifierKey | ModifierKey[];
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
    altSelectionKey: TOptionalModifierKey;
    /**
     * Color of selection
     * @type String
     * @default
     */
    selectionColor: string;
    /**
     * Default dash array pattern
     * If not empty the selection border is dashed
     * @type Array
     */
    selectionDashArray: number[];
    /**
     * Color of the border of selection (usually slightly darker than color of selection itself)
     * @type String
     * @default
     */
    selectionBorderColor: string;
    /**
     * Width of a line used in object/group selection
     * @type Number
     * @default
     */
    selectionLineWidth: number;
    /**
     * Select only shapes that are fully contained in the dragged selection rectangle.
     * @type Boolean
     * @default
     */
    selectionFullyContained: boolean;
    /**
     * Default cursor value used when hovering over an object on canvas
     * @type CSSStyleDeclaration['cursor']
     * @default move
     */
    hoverCursor: CSSStyleDeclaration['cursor'];
    /**
     * Default cursor value used when moving an object on canvas
     * @type CSSStyleDeclaration['cursor']
     * @default move
     */
    moveCursor: CSSStyleDeclaration['cursor'];
    /**
     * Default cursor value used for the entire canvas
     * @type String
     * @default default
     */
    defaultCursor: CSSStyleDeclaration['cursor'];
    /**
     * Cursor value used during free drawing
     * @type String
     * @default crosshair
     */
    freeDrawingCursor: CSSStyleDeclaration['cursor'];
    /**
     * Cursor value used for disabled elements ( corners with disabled action )
     * @type String
     * @since 2.0.0
     * @default not-allowed
     */
    notAllowedCursor: CSSStyleDeclaration['cursor'];
    /**
     * Default element class that's given to wrapper (div) element of canvas
     * @type String
     * @default
     */
    containerClass: string;
    /**
     * When true, object detection happens on per-pixel basis rather than on per-bounding-box
     * @type Boolean
     * @default
     */
    perPixelTargetFind: boolean;
    /**
     * Number of pixels around target pixel to tolerate (consider active) during object detection
     * @type Number
     * @default
     */
    targetFindTolerance: number;
    /**
     * When true, target detection is skipped. Target detection will return always undefined.
     * click selection won't work anymore, events will fire with no targets.
     * if something is selected before setting it to true, it will be deselected at the first click.
     * area selection will still work. check the `selection` property too.
     * if you deactivate both, you should look into staticCanvas.
     * @type Boolean
     * @default
     */
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
    /**
     * Indicates whether objects should remain in current stack position when selected.
     * When false objects are brought to top and rendered as part of the selection group
     * @type Boolean
     * @default
     */
    preserveObjectStacking: boolean;
    /**
     * Indicates if the right click on canvas can output the context menu or not
     * @type Boolean
     * @since 1.6.5
     * @default
     */
    stopContextMenu: boolean;
    /**
     * Indicates if the canvas can fire right click events
     * @type Boolean
     * @since 1.6.5
     * @default
     */
    fireRightClick: boolean;
    /**
     * Indicates if the canvas can fire middle click events
     * @type Boolean
     * @since 1.7.8
     * @default
     */
    fireMiddleClick: boolean;
    /**
     * Keep track of the subTargets for Mouse Events
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
     * hold a referenfce to a data structure that contains information
     * on the current on going transform
     * @type
     * @private
     */
    _currentTransform: Transform | null;
    /**
     * hold a reference to a data structure used to track the selecion
     * box on canvas drag
     * on the current on going transform
     * @type
     * @private
     */
    _groupSelector: any;
    /**
     * internal flag used to understand if the context top requires a cleanup
     * in case this is true, the contextTop will be cleared at the next render
     * @type boolean
     * @private
     */
    contextTopDirty: boolean;
    /**
     * a reference to the context of an additional canvas that is used for scratch operations
     * @TODOL This is created automatically when needed, while it shouldn't. is probably not even often needed
     * and is a memory waste. We should either have one that gets added/deleted
     * @type CanvasRenderingContext2D
     * @private
     */
    contextCache: CanvasRenderingContext2D;
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
    upperCanvasEl: HTMLCanvasElement;
    contextTop: CanvasRenderingContext2D;
    wrapperEl: HTMLDivElement;
    cacheCanvasEl: HTMLCanvasElement;
    protected _isCurrentlyDrawing: boolean;
    freeDrawingBrush?: BaseBrush;
    _activeObject?: FabricObject;
    _hasITextHandlers?: boolean;
    _iTextInstances: (IText | Textbox)[];
    /**
     * Constructor
     * @param {HTMLCanvasElement | String} el canvas element to initialize instance on
     * @param {Object} [options] Options object
     * @return {Object} thisArg
     */
    constructor(el: string | HTMLCanvasElement, options?: {});
    _init(el: string | HTMLCanvasElement, options?: {}): void;
    /**
     * @private
     */
    _initRetinaScaling(): void;
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
    renderTopLayer(ctx: CanvasRenderingContext2D): void;
    /**
     * Method to render only the top canvas.
     * Also used to render the group selection box.
     */
    renderTop(): void;
    /**
     * Given a pointer on the canvas with a viewport applied,
     * find out the opinter in
     * @private
     */
    _normalizePointer(object: FabricObject, pointer: Point): Point;
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
    _shouldClearSelection(e: TPointerEvent, target?: FabricObject): boolean;
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
     * @param {FaricObject} target
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
     * the skipGroup parameter is for internal use, is needed for shift+click action
     * 11/09/2018 TODO: would be cool if findTarget could discern between being a full target
     * or the outside part of the corner.
     * @param {Event} e mouse event
     * @param {Boolean} skipGroup when true, activeGroup is skipped and only objects are traversed through
     * @return {FabricObject | null} the target found
     */
    findTarget(e: TPointerEvent, skipGroup?: boolean): FabricObject | undefined;
    /**
     * Checks point is inside the object.
     * @param {Object} [pointer] x,y object of point coordinates we want to check.
     * @param {FabricObject} obj Object to test against
     * @param {Object} [globalPointer] x,y object of point coordinates relative to canvas used to search per pixel target.
     * @return {Boolean} true if point is contained within an area of given object
     * @private
     */
    _checkTarget(pointer: Point, obj: FabricObject, globalPointer: Point): boolean;
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
     * @see {@link fabric.Canvas#_searchPossibleTargets}
     * @param {FabricObject[]} [objects] objects array to look into
     * @param {Object} [pointer] x,y object of point coordinates we want to check.
     * @return {FabricObject} **top most object on screen** that contains pointer
     */
    searchPossibleTargets(objects: FabricObject[], pointer: Point): FabricObject | undefined;
    /**
     * Returns pointer coordinates without the effect of the viewport
     * @param {Object} pointer with "x" and "y" number values in canvas HTML coordinates
     * @return {Object} object with "x" and "y" number values in fabricCanvas coordinates
     */
    restorePointerVpt(pointer: Point): Point;
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
    getPointer(e: TPointerEvent, ignoreVpt?: boolean): Point;
    /**
     * Sets dimensions (width, height) of this canvas instance. when options.cssOnly flag active you should also supply the unit of measure (px/%/em)
     * @param {Object}        dimensions                    Object with width/height properties
     * @param {Number|String} [dimensions.width]            Width of canvas element
     * @param {Number|String} [dimensions.height]           Height of canvas element
     * @param {Object}        [options]                     Options object
     * @param {Boolean}       [options.backstoreOnly=false] Set the given dimensions only as canvas backstore dimensions
     * @param {Boolean}       [options.cssOnly=false]       Set the given dimensions only as css dimensions
     * @return {Canvas} thisArg
     */
    setDimensions(dimensions: TSize, options?: TCanvasSizeOptions): void;
    /**
     * Helper for setting width/height
     * @private
     * @param {String} prop property (width|height)
     * @param {Number} value value to set property to
     */
    _setBackstoreDimension(prop: keyof TSize, value: number): void;
    /**
     * Helper for setting css width/height
     * @private
     * @param {String} prop property (width|height)
     * @param {String} value value to set property to
     */
    _setCssDimension(prop: keyof TSize, value: string): void;
    /**
     * @private
     * @throws {CANVAS_INIT_ERROR} If canvas can not be initialized
     */
    _createUpperCanvas(): void;
    /**
     * @private
     */
    _createCacheCanvas(): void;
    /**
     * @private
     */
    _initWrapperElement(): void;
    /**
     * @private
     * @param {HTMLCanvasElement} element canvas element to apply styles on
     */
    _applyCanvasStyle(element: HTMLCanvasElement): void;
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
     * @chainable
     */
    setActiveObject(object: FabricObject, e?: TPointerEvent): void;
    /**
     * This is a private method for now.
     * This is supposed to be equivalent to setActiveObject but without firing
     * any event. There is commitment to have this stay this way.
     * This is the functional part of setActiveObject.
     * @private
     * @param {Object} object to set as active
     * @param {Event} [e] Event (passed along when firing "object:selected")
     * @return {Boolean} true if the selection happened
     */
    _setActiveObject(object: FabricObject, e?: TPointerEvent): boolean;
    /**
     * This is a private method for now.
     * This is supposed to be equivalent to discardActiveObject but without firing
     * any selection events ( can still fire object transformation events ). There is commitment to have this stay this way.
     * This is the functional part of discardActiveObject.
     * @param {Event} [e] Event (passed along when firing "object:deselected")
     * @param {Object} object the next object to set as active, reason why we are discarding this
     * @return {Boolean} true if the selection happened
     * @private
     */
    _discardActiveObject(e?: TPointerEvent, object?: FabricObject): boolean;
    /**
     * Discards currently active object and fire events. If the function is called by fabric
     * as a consequence of a mouse event, the event is passed as a parameter and
     * sent to the fire function for the custom events. When used as a method the
     * e param does not have any application.
     * @param {event} e
     * @chainable
     */
    discardActiveObject(e?: TPointerEvent): void;
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
    destroy(this: TDestroyedCanvas): void;
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
    _toObject(instance: FabricObject, methodName: 'toObject' | 'toDatalessObject', propertiesToInclude: string[]): Record<string, any>;
    /**
     * Realises an object's group transformation on it
     * @private
     * @param {FabricObject} [instance] the object to transform (gets mutated)
     * @returns the original values of instance which were changed
     */
    _realizeGroupTransformOnObject(instance: FabricObject): Partial<typeof instance>;
    /**
     * @private
     */
    _setSVGObject(markup: string[], instance: FabricObject, reviver: TSVGReviver): void;
    setViewportTransform(vpt: TMat2D): void;
}
export {};
//# sourceMappingURL=canvas.class.d.ts.map