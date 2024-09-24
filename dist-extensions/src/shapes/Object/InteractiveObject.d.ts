import { Point } from '../../Point';
import type { TCornerPoint, TDegree } from '../../typedefs';
import { FabricObject } from './Object';
import type { TQrDecomposeOut } from '../../util/misc/matrix';
import type { Control } from '../../controls/Control';
import type { ObjectEvents, TPointerEvent } from '../../EventTypeDefs';
import type { Canvas } from '../../canvas/Canvas';
import type { ControlRenderingStyleOverride } from '../../controls/controlRendering';
import type { FabricObjectProps } from './types/FabricObjectProps';
import type { TFabricObjectProps, SerializedObjectProps } from './types';
export type TOCoord = Point & {
    corner: TCornerPoint;
    touchCorner: TCornerPoint;
};
export type TControlSet = Record<string, Control>;
export type TBorderRenderingStyleOverride = Partial<Pick<InteractiveFabricObject, 'borderColor' | 'borderDashArray'>>;
export type TStyleOverride = ControlRenderingStyleOverride & TBorderRenderingStyleOverride & Partial<Pick<InteractiveFabricObject, 'hasBorders' | 'hasControls'> & {
    forActiveSelection: boolean;
}>;
export declare class InteractiveFabricObject<Props extends TFabricObjectProps = Partial<FabricObjectProps>, SProps extends SerializedObjectProps = SerializedObjectProps, EventSpec extends ObjectEvents = ObjectEvents> extends FabricObject<Props, SProps, EventSpec> implements FabricObjectProps {
    noScaleCache: boolean;
    snapAngle?: TDegree;
    snapThreshold?: TDegree;
    lockMovementX: boolean;
    lockMovementY: boolean;
    lockRotation: boolean;
    lockScalingX: boolean;
    lockScalingY: boolean;
    lockSkewingX: boolean;
    lockSkewingY: boolean;
    lockScalingFlip: boolean;
    cornerSize: number;
    touchCornerSize: number;
    transparentCorners: boolean;
    cornerColor: string;
    cornerStrokeColor: string;
    cornerStyle: 'rect' | 'circle';
    cornerDashArray: number[] | null;
    hasControls: boolean;
    borderColor: string;
    borderDashArray: number[] | null;
    borderOpacityWhenMoving: number;
    borderScaleFactor: number;
    hasBorders: boolean;
    selectionBackgroundColor: string;
    selectable: boolean;
    evented: boolean;
    perPixelTargetFind: boolean;
    activeOn: 'down' | 'up';
    hoverCursor: CSSStyleDeclaration['cursor'] | null;
    moveCursor: CSSStyleDeclaration['cursor'] | null;
    /**
     * The object's controls' position in viewport coordinates
     * Calculated by {@link Control#positionHandler} and {@link Control#calcCornerCoords}, depending on {@link padding}.
     * `corner/touchCorner` describe the 4 points forming the interactive area of the corner.
     * Used to draw and locate controls.
     */
    oCoords: Record<string, TOCoord>;
    /**
     * keeps the value of the last hovered corner during mouse move.
     * 0 is no corner, or 'mt', 'ml', 'mtr' etc..
     * It should be private, but there is no harm in using it as
     * a read-only property.
     * this isn't cleaned automatically. Non selected objects may have wrong values
     * @type [string]
     */
    __corner?: string;
    /**
     * a map of control visibility for this object.
     * this was left when controls were introduced to not break the api too much
     * this takes priority over the generic control visibility
     */
    _controlsVisibility: Record<string, boolean>;
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
     * A boolean used from the gesture module to keep tracking of a scaling
     * action when there is no scaling transform in place.
     * This is an edge case and is used twice in all codebase.
     * Probably added to keep track of some performance issues
     * @TODO use git blame to investigate why it was added
     * DON'T USE IT. WE WILL TRY TO REMOVE IT
     */
    _scaling?: boolean;
    canvas?: Canvas;
    static ownDefaults: Partial<import("../../typedefs").TClassProperties<InteractiveFabricObject<Partial<FabricObjectProps>, SerializedObjectProps, ObjectEvents>>>;
    static getDefaults(): Record<string, any>;
    /**
     * Constructor
     * @param {Object} [options] Options object
     */
    constructor(options?: Props);
    /**
     * Creates the default control object.
     * If you prefer to have on instance of controls shared among all objects
     * make this function return an empty object and add controls to the ownDefaults
     * @param {Object} [options] Options object
     */
    static createControls(): {
        controls: Record<string, Control>;
    };
    /**
     * Update width and height of the canvas for cache
     * returns true or false if canvas needed resize.
     * @private
     * @return {Boolean} true if the canvas has been resized
     */
    _updateCacheCanvas(): boolean;
    getActiveControl(): {
        key: string;
        control: Control;
        coord: TOCoord;
    } | undefined;
    /**
     * Determines which corner is under the mouse cursor, represented by `pointer`.
     * This function is return a corner only if the object is the active one.
     * This is done to avoid selecting corner of non active object and activating transformations
     * rather than drag action. The default behavior of fabricJS is that if you want to transform
     * an object, first you select it to show the control set
     * @private
     * @param {Object} pointer The pointer indicating the mouse position
     * @param {boolean} forTouch indicates if we are looking for interaction area with a touch action
     * @return {String|Boolean} corner code (tl, tr, bl, br, etc.), or 0 if nothing is found.
     */
    findControl(pointer: Point, forTouch?: boolean): {
        key: string;
        control: Control;
        coord: TOCoord;
    } | undefined;
    /**
     * Calculates the coordinates of the center of each control plus the corners of the control itself
     * This basically just delegates to each control positionHandler
     * WARNING: changing what is passed to positionHandler is a breaking change, since position handler
     * is a public api and should be done just if extremely necessary
     * @return {Record<string, TOCoord>}
     */
    calcOCoords(): Record<string, TOCoord>;
    /**
     * Sets the coordinates that determine the interaction area of each control
     * note: if we would switch to ROUND corner area, all of this would disappear.
     * everything would resolve to a single point and a pythagorean theorem for the distance
     * @todo evaluate simplification of code switching to circle interaction area at runtime
     * @private
     */
    private _calcCornerCoords;
    /**
     * @override set controls' coordinates as well
     * See {@link https://github.com/fabricjs/fabric.js/wiki/When-to-call-setCoords} and {@link http://fabricjs.com/fabric-gotchas}
     * @return {void}
     */
    setCoords(): void;
    /**
     * Calls a function for each control. The function gets called,
     * with the control, the control's key and the object that is calling the iterator
     * @param {Function} fn function to iterate over the controls over
     */
    forEachControl(fn: (control: Control, key: string, fabricObject: InteractiveFabricObject) => any): void;
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
     * @param {TStyleOverride} styleOverride object to override the object style
     */
    _drawBorders(ctx: CanvasRenderingContext2D, size: Point, styleOverride?: TStyleOverride): void;
    /**
     * Renders controls and borders for the object
     * the context here is not transformed
     * @todo move to interactivity
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {TStyleOverride} [styleOverride] properties to override the object style
     */
    _renderControls(ctx: CanvasRenderingContext2D, styleOverride?: TStyleOverride): void;
    /**
     * Draws borders of an object's bounding box.
     * Requires public properties: width, height
     * Requires public options: padding, borderColor
     * @param {CanvasRenderingContext2D} ctx Context to draw on
     * @param {object} options object representing current object parameters
     * @param {TStyleOverride} [styleOverride] object to override the object style
     */
    drawBorders(ctx: CanvasRenderingContext2D, options: TQrDecomposeOut, styleOverride: TStyleOverride): void;
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
     * Be aware that since fabric 6.0 this function does not call setCoords anymore.
     * setCoords needs to be called manually if the object of which we are rendering controls
     * is outside the standard selection and transform process.
     * @param {CanvasRenderingContext2D} ctx Context to draw on
     * @param {ControlRenderingStyleOverride} styleOverride object to override the object style
     */
    drawControls(ctx: CanvasRenderingContext2D, styleOverride?: ControlRenderingStyleOverride): void;
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
     * Sets the visibility state of object controls, this is just a bulk option for setControlVisible;
     * @param {Record<string, boolean>} [options] with an optional key per control
     * example: {Boolean} [options.bl] true to enable the bottom-left control, false to disable it
     */
    setControlsVisibility(options?: Record<string, boolean>): void;
    /**
     * Clears the canvas.contextTop in a specific area that corresponds to the object's bounding box
     * that is in the canvas.contextContainer.
     * This function is used to clear pieces of contextTop where we render ephemeral effects on top of the object.
     * Example: blinking cursor text selection, drag effects.
     * @todo discuss swapping restoreManually with a renderCallback, but think of async issues
     * @param {Boolean} [restoreManually] When true won't restore the context after clear, in order to draw something else.
     * @return {CanvasRenderingContext2D|undefined} canvas.contextTop that is either still transformed
     * with the object transformMatrix, or restored to neutral transform
     */
    clearContextTop(restoreManually?: boolean): CanvasRenderingContext2D | undefined;
    /**
     * This callback function is called every time _discardActiveObject or _setActiveObject
     * try to to deselect this object. If the function returns true, the process is cancelled
     * @param {Object} [_options] options sent from the upper functions
     * @param {TPointerEvent} [options.e] event if the process is generated by an event
     * @param {FabricObject} [options.object] next object we are setting as active, and reason why
     * this is being deselected
     */
    onDeselect(_options?: {
        e?: TPointerEvent;
        object?: InteractiveFabricObject;
    }): boolean;
    /**
     * This callback function is called every time _discardActiveObject or _setActiveObject
     * try to to select this object. If the function returns true, the process is cancelled
     * @param {Object} [_options] options sent from the upper functions
     * @param {Event} [_options.e] event if the process is generated by an event
     */
    onSelect(_options?: {
        e?: TPointerEvent;
    }): boolean;
    /**
     * Override to customize Drag behavior
     * Fired from {@link Canvas#_onMouseMove}
     * @returns true in order for the window to start a drag session
     */
    shouldStartDragging(_e: TPointerEvent): boolean;
    /**
     * Override to customize Drag behavior\
     * Fired once a drag session has started
     * @returns true to handle the drag event
     */
    onDragStart(_e: DragEvent): boolean;
    /**
     * Override to customize drag and drop behavior
     * @public
     * @param {DragEvent} _e
     * @returns {boolean} true if the object currently dragged can be dropped on the target
     */
    canDrop(_e: DragEvent): boolean;
    /**
     * Override to customize drag and drop behavior
     * render a specific effect when an object is the source of a drag event
     * example: render the selection status for the part of text that is being dragged from a text object
     * @public
     * @param {DragEvent} _e
     */
    renderDragSourceEffect(_e: DragEvent): void;
    /**
     * Override to customize drag and drop behavior
     * render a specific effect when an object is the target of a drag event
     * used to show that the underly object can receive a drop, or to show how the
     * object will change when dropping. example: show the cursor where the text is about to be dropped
     * @public
     * @param {DragEvent} _e
     */
    renderDropTargetEffect(_e: DragEvent): void;
}
//# sourceMappingURL=InteractiveObject.d.ts.map