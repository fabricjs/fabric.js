import { IPoint, Point } from '../../point.class';
import type { TCornerPoint, TDegree } from '../../typedefs';
import { FabricObject } from './Object';
import { TQrDecomposeOut } from '../../util/misc/matrix';
import type { Control } from '../../controls/control.class';
import { ObjectEvents, TPointerEvent } from '../../EventTypeDefs';
import type { Canvas } from '../../canvas/canvas_events';
type TOCoord = IPoint & {
    corner: TCornerPoint;
    touchCorner: TCornerPoint;
};
type TControlSet = Record<string, Control>;
export type FabricObjectWithDragSupport = InteractiveFabricObject & {
    onDragStart: (e: DragEvent) => boolean;
};
export declare class InteractiveFabricObject<EventSpec extends ObjectEvents = ObjectEvents> extends FabricObject<EventSpec> {
    /**
     * Describe object's corner position in canvas element coordinates.
     * properties are depending on control keys and padding the main controls.
     * each property is an object with x, y and corner.
     * The `corner` property contains in a similar manner the 4 points of the
     * interactive area of the corner.
     * The coordinates depends from the controls positionHandler and are used
     * to draw and locate controls
     */
    oCoords: Record<string, TOCoord>;
    /**
     * keeps the value of the last hovered corner during mouse move.
     * 0 is no corner, or 'mt', 'ml', 'mtr' etc..
     * It should be private, but there is no harm in using it as
     * a read-only property.
     * this isn't cleaned automatically. Non selected objects may have wrong values
     * @type number|string|any
     * @default 0
     */
    __corner: 0 | string;
    /**
     * a map of control visibility for this object.
     * this was left when controls were introduced to do not brea the api too much
     * this takes priority over the generic control visibility
     */
    _controlsVisibility: Record<string, boolean>;
    /**
     * The angle that an object will lock to while rotating.
     * @type [TDegree]
     */
    snapAngle?: TDegree;
    /**
     * The angle difference from the current snapped angle in which snapping should occur.
     * When undefined, the snapThreshold will default to the snapAngle.
     * @type [TDegree]
     */
    snapThreshold?: TDegree;
    /**
     * holds the controls for the object.
     * controls are added by default_controls.js
     */
    controls: TControlSet;
    /**
     * internal boolean to signal the code that the object is
     * part of the move action.
     */
    isMoving?: boolean;
    /**
     * internal boolean to signal the code that the object is
     * part of the draggin action.
     * @TODO: discuss isMoving and isDragging being not adequate enough
     * they need to be either both private or more generic
     * Canvas class needs to see this variable
     */
    __isDragging?: boolean;
    /**
     * A boolean used from the gesture module to keep tracking of a scaling
     * action when there is no scaling transform in place.
     * This is an edge case and is used twice in all codebase.
     * Probably added to keep track of some performance issues
     * @TODO use git blame to investigate why it was added
     * DON'T USE IT. WE WILL TRY TO REMOVE IT
     */
    _scaling?: boolean;
    canvas?: Canvas;
    /**
     * Constructor
     * @param {Object} [options] Options object
     */
    constructor(options?: Record<string, unknown>);
    /**
     * Determines which corner has been clicked
     * @private
     * @param {Object} pointer The pointer indicating the mouse position
     * @param {boolean} forTouch indicates if we are looking for interaction area with a touch action
     * @return {String|Boolean} corner code (tl, tr, bl, br, etc.), or false if nothing is found
     */
    _findTargetCorner(pointer: Point, forTouch?: boolean): 0 | string;
    /**
     * Calculates the coordinates of the center of each control plus the corners of the control itself
     * This basically just delegates to each control positionHandler
     * WARNING: changing what is passed to positionHandler is a breaking change, since position handler
     * is a public api and should be done just if extremely necessary
     * @return {Record<string, TOCoord>}
     */
    calcOCoords(): Record<string, TOCoord>;
    /**
     * Sets corner and controls position coordinates based on current angle, width and height, left and top.
     * oCoords are used to find the corners
     * aCoords are used to quickly find an object on the canvas
     * lineCoords are used to quickly find object during pointer events.
     * See {@link https://github.com/fabricjs/fabric.js/wiki/When-to-call-setCoords} and {@link http://fabricjs.com/fabric-gotchas}
     * @return {void}
     */
    setCoords(): void;
    /**
     * Calls a function for each control. The function gets called,
     * with the control, the control's key and the object that is calling the iterator
     * @param {Function} fn function to iterate over the controls over
     */
    forEachControl(fn: (control: any, key: string, fabricObject: InteractiveFabricObject) => any): void;
    /**
     * Sets the coordinates that determine the interaction area of each control
     * note: if we would switch to ROUND corner area, all of this would disappear.
     * everything would resolve to a single point and a pythagorean theorem for the distance
     * @todo evaluate simplification of code switching to circle interaction area at runtime
     * @private
     */
    _setCornerCoords(): void;
    /**
     * Draws a colored layer behind the object, inside its selection borders.
     * Requires public options: padding, selectionBackgroundColor
     * this function is called when the context is transformed
     * has checks to be skipped when the object is on a staticCanvas
     * @todo evaluate if make this disappear in favor of a pre-render hook for objects
     * this was added by Andrea Bogazzi to make possible some feature for work reasons
     * it seemed a good option, now is an edge case
     * @param {CanvasRenderingContext2D} ctx Context to draw on
     */
    drawSelectionBackground(ctx: CanvasRenderingContext2D): void;
    /**
     * @public override this function in order to customize the drawing of the control box, e.g. rounded corners, different border style.
     * @param {CanvasRenderingContext2D} ctx ctx is rotated and translated so that (0,0) is at object's center
     * @param {Point} size the control box size used
     */
    strokeBorders(ctx: CanvasRenderingContext2D, size: Point): void;
    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to draw on
     * @param {Point} size
     * @param {Object} styleOverride object to override the object style
     */
    _drawBorders(ctx: CanvasRenderingContext2D, size: Point, styleOverride?: Record<string, any>): void;
    /**
     * Renders controls and borders for the object
     * the context here is not transformed
     * @todo move to interactivity
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Object} [styleOverride] properties to override the object style
     */
    _renderControls(ctx: CanvasRenderingContext2D, styleOverride?: any): void;
    /**
     * Draws borders of an object's bounding box.
     * Requires public properties: width, height
     * Requires public options: padding, borderColor
     * @param {CanvasRenderingContext2D} ctx Context to draw on
     * @param {object} options object representing current object parameters
     * @param {Object} [styleOverride] object to override the object style
     */
    drawBorders(ctx: CanvasRenderingContext2D, options: TQrDecomposeOut, styleOverride: any): void;
    /**
     * Draws lines from a borders of an object's bounding box to controls that have `withConnection` property set.
     * Requires public properties: width, height
     * Requires public options: padding, borderColor
     * @param {CanvasRenderingContext2D} ctx Context to draw on
     * @param {Point} size object size x = width, y = height
     */
    drawControlsConnectingLines(ctx: CanvasRenderingContext2D, size: Point): void;
    /**
     * Draws corners of an object's bounding box.
     * Requires public properties: width, height
     * Requires public options: cornerSize, padding
     * @param {CanvasRenderingContext2D} ctx Context to draw on
     * @param {Object} styleOverride object to override the object style
     */
    drawControls(ctx: CanvasRenderingContext2D, styleOverride?: {}): void;
    /**
     * Returns true if the specified control is visible, false otherwise.
     * @param {string} controlKey The key of the control. Possible values are usually 'tl', 'tr', 'br', 'bl', 'ml', 'mt', 'mr', 'mb', 'mtr',
     * but since the control api allow for any control name, can be any string.
     * @returns {boolean} true if the specified control is visible, false otherwise
     */
    isControlVisible(controlKey: string): boolean;
    /**
     * Sets the visibility of the specified control.
     * please do not use.
     * @param {String} controlKey The key of the control. Possible values are 'tl', 'tr', 'br', 'bl', 'ml', 'mt', 'mr', 'mb', 'mtr'.
     * but since the control api allow for any control name, can be any string.
     * @param {Boolean} visible true to set the specified control visible, false otherwise
     * @todo discuss this overlap of priority here with the team. Andrea Bogazzi for details
     */
    setControlVisible(controlKey: string, visible: boolean): void;
    /**
     * Sets the visibility state of object controls, this is hust a bulk option for setControlVisible;
     * @param {Record<string, boolean>} [options] with an optional key per control
     * example: {Boolean} [options.bl] true to enable the bottom-left control, false to disable it
     */
    setControlsVisibility(options?: Record<string, boolean>): void;
    /**
     * Clears the canvas.contextTop in a specific area that corresponds to the object's bounding box
     * that is in the canvas.contextContainer.
     * This function is used to clear pieces of contextTop where we render ephemeral effects on top of the object.
     * Example: blinking cursror text selection, drag effects.
     * @todo discuss swapping restoreManually with a renderCallback, but think of async issues
     * @param {Boolean} [restoreManually] When true won't restore the context after clear, in order to draw something else.
     * @return {CanvasRenderingContext2D|undefined} canvas.contextTop that is either still transformed
     * with the object transformMatrix, or restored to neutral transform
     */
    clearContextTop(restoreManually?: boolean): CanvasRenderingContext2D | undefined;
    /**
     * This callback function is called every time _discardActiveObject or _setActiveObject
     * try to to deselect this object. If the function returns true, the process is cancelled
     * @param {Object} [options] options sent from the upper functions
     * @param {TPointerEvent} [options.e] event if the process is generated by an event
     * @param {FabricObject} [options.object] next object we are setting as active, and reason why
     * this is being deselected
  
     */
    onDeselect(options?: {
        e?: TPointerEvent;
        object?: FabricObject;
    }): boolean;
    /**
     * This callback function is called every time _discardActiveObject or _setActiveObject
     * try to to select this object. If the function returns true, the process is cancelled
     * @param {Object} [options] options sent from the upper functions
     * @param {Event} [options.e] event if the process is generated by an event
     */
    onSelect(options?: {
        e?: TPointerEvent;
    }): boolean;
    /**
     * Override to customize drag and drop behavior
     * return true if the object currently dragged can be dropped on the target
     * @public
     * @param {DragEvent} e
     * @returns {boolean}
     */
    canDrop(e?: DragEvent): boolean;
    /**
     * Override to customize drag and drop behavior
     * render a specific effect when an object is the source of a drag event
     * example: render the selection status for the part of text that is being dragged from a text object
     * @public
     * @param {DragEvent} e
     * @returns {boolean}
     */
    renderDragSourceEffect(e: DragEvent): void;
    /**
     * Override to customize drag and drop behavior
     * render a specific effect when an object is the target of a drag event
     * used to show that the underly object can receive a drop, or to show how the
     * object will change when dropping. example: show the cursor where the text is about to be dropped
     * @public
     * @param {DragEvent} e
     * @returns {boolean}
     */
    renderDropTargetEffect(e: DragEvent): void;
}
export {};
//# sourceMappingURL=InteractiveObject.d.ts.map