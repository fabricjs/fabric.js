import { ObjectEvents } from '../EventTypeDefs';
import { IPoint, Point } from '../point.class';
import { TPointerEvent, TransformEvent } from '../typedefs';
import { ITextKeyBehaviorMixin } from './itext_key_behavior.mixin';
export declare abstract class ITextClickBehaviorMixin<EventSpec extends ObjectEvents> extends ITextKeyBehaviorMixin<EventSpec> {
    private __lastClickTime;
    private __lastLastClickTime;
    private __lastPointer;
    private __newClickTime;
    /**
     * Initializes "dbclick" event handler
     */
    initDoubleClickSimulation(): void;
    /**
     * Default event handler to simulate triple click
     * @private
     */
    onMouseDown(options: TransformEvent): void;
    isTripleClick(newPointer: IPoint): boolean;
    /**
     * Initializes event handlers related to cursor or selection
     */
    initCursorSelectionHandlers(): void;
    /**
     * Default handler for double click, select a word
     */
    doubleClickHandler(options: TransformEvent): void;
    /**
     * Default handler for triple click, select a line
     */
    tripleClickHandler(options: TransformEvent): void;
    /**
     * Initializes double and triple click event handlers
     */
    initClicks(): void;
    /**
     * Default event handler for the basic functionalities needed on _mouseDown
     * can be overridden to do something different.
     * Scope of this implementation is: find the click position, set selectionStart
     * find selectionEnd, initialize the drawing of either cursor or selection area
     * initializing a mousedDown on a text area will cancel fabricjs knowledge of
     * current compositionMode. It will be set to false.
     */
    _mouseDownHandler(options: TransformEvent): void;
    /**
     * Default event handler for the basic functionalities needed on mousedown:before
     * can be overridden to do something different.
     * Scope of this implementation is: verify the object is already selected when mousing down
     */
    _mouseDownHandlerBefore(options: TransformEvent): void;
    /**
     * Initializes "mousedown" event handler
     */
    initMousedownHandler(): void;
    /**
     * Initializes "mouseup" event handler
     */
    initMouseupHandler(): void;
    /**
     * standard handler for mouse up, overridable
     * @private
     */
    mouseUpHandler(options: TransformEvent): void;
    /**
     * Changes cursor location in a text depending on passed pointer (x/y) object
     * @param {TPointerEvent} e Event object
     */
    setCursorByClick(e: TPointerEvent): void;
    /**
     * Returns coordinates of a pointer relative to object's top left corner in object's plane
     * @param {TPointerEvent} e Event to operate upon
     * @param {IPoint} [pointer] Pointer to operate upon (instead of event)
     * @return {Point} Coordinates of a pointer (x, y)
     */
    getLocalPointer(e: TPointerEvent, pointer: IPoint): Point;
    /**
     * Returns index of a character corresponding to where an object was clicked
     * @param {TPointerEvent} e Event object
     * @return {Number} Index of a character
     */
    getSelectionStartFromPointer(e: TPointerEvent): number;
    /**
     * @private
     */
    _getNewSelectionStartFromOffset(mouseOffset: IPoint, prevWidth: number, width: number, index: number, jlen: number): number;
}
//# sourceMappingURL=itext_click_behavior.mixin.d.ts.map