import { ObjectEvents, TEvent } from '../EventTypeDefs';
import { Text } from '../shapes/text.class';
import { TPointerEvent } from '../typedefs';
import type { Canvas } from '../canvas/canvas_events';
import { TextStyleDeclaration } from './text_style.mixin';
export declare abstract class ITextBehaviorMixin<EventSpec extends ObjectEvents> extends Text<EventSpec> {
    abstract isEditing: boolean;
    abstract cursorDelay: number;
    abstract selectionStart: number;
    abstract selectionEnd: number;
    abstract cursorDuration: number;
    abstract editable: boolean;
    abstract editingBorderColor: string;
    abstract compositionStart: number;
    abstract compositionEnd: number;
    abstract hiddenTextarea: HTMLTextAreaElement;
    /**
     * Helps determining when the text is in composition, so that the cursor
     * rendering is altered.
     */
    protected inCompositionMode: boolean;
    protected _reSpace: RegExp;
    private _currentTickState;
    private _cursorTimeout1;
    private _cursorTimeout2;
    private _currentTickCompleteState;
    protected _currentCursorOpacity: number;
    private _textBeforeEdit;
    protected __isMousedown: boolean;
    protected __selectionStartOnMouseDown: number;
    private __dragImageDisposer;
    private __dragStartFired;
    protected __isDragging: boolean;
    protected __dragStartSelection: {
        selectionStart: number;
        selectionEnd: number;
    };
    protected __isDraggingOver: boolean;
    protected selected: boolean;
    protected __lastSelected: boolean;
    protected cursorOffsetCache: {
        left?: number;
        top?: number;
    };
    protected _savedProps: {
        hasControls: boolean;
        borderColor: string;
        lockMovementX: boolean;
        lockMovementY: boolean;
        selectable: boolean;
        hoverCursor: string | null;
        defaultCursor: string;
        moveCursor: CSSStyleDeclaration['cursor'];
    };
    protected _selectionDirection: 'left' | 'right' | null;
    abstract initHiddenTextarea(): void;
    abstract initCursorSelectionHandlers(): void;
    abstract initDoubleClickSimulation(): void;
    abstract _fireSelectionChanged(): void;
    abstract renderCursorOrSelection(): void;
    abstract getSelectionStartFromPointer(e: TPointerEvent): number;
    abstract _getCursorBoundaries(index: number, skipCaching: boolean): {
        left: number;
        top: number;
        leftOffset: number;
        topOffset: number;
    };
    /**
     * Initializes all the interactive behavior of IText
     */
    initBehavior(): void;
    onDeselect(): void;
    /**
     * Initializes "added" event handler
     */
    initAddedHandler(): void;
    initRemovedHandler(): void;
    /**
     * register canvas event to manage exiting on other instances
     * @private
     */
    _initCanvasHandlers(canvas: Canvas): void;
    /**
     * remove canvas event to manage exiting on other instances
     * @private
     */
    _removeCanvasHandlers(canvas: Canvas): void;
    /**
     * @private
     */
    _tick(): void;
    /**
     * @private
     */
    _animateCursor(obj: any, targetOpacity: any, duration: any, completeMethod: any): {
        isAborted: boolean;
        abort: () => void;
    };
    /**
     * @private
     */
    _onTickComplete(): void;
    /**
     * Initializes delayed cursor
     */
    initDelayedCursor(restart?: boolean): void;
    /**
     * Aborts cursor animation, clears all timeouts and clear textarea context if necessary
     */
    abortCursorAnimation(): void;
    restartCursorIfNeeded(): void;
    /**
     * Selects entire text
     */
    selectAll(): this;
    /**
     * Returns selected text
     * @return {String}
     */
    getSelectedText(): string;
    /**
     * Find new selection index representing start of current word according to current selection index
     * @param {Number} startFrom Current selection index
     * @return {Number} New selection index
     */
    findWordBoundaryLeft(startFrom: number): number;
    /**
     * Find new selection index representing end of current word according to current selection index
     * @param {Number} startFrom Current selection index
     * @return {Number} New selection index
     */
    findWordBoundaryRight(startFrom: number): number;
    /**
     * Find new selection index representing start of current line according to current selection index
     * @param {Number} startFrom Current selection index
     * @return {Number} New selection index
     */
    findLineBoundaryLeft(startFrom: number): number;
    /**
     * Find new selection index representing end of current line according to current selection index
     * @param {Number} startFrom Current selection index
     * @return {Number} New selection index
     */
    findLineBoundaryRight(startFrom: number): number;
    /**
     * Finds index corresponding to beginning or end of a word
     * @param {Number} selectionStart Index of a character
     * @param {Number} direction 1 or -1
     * @return {Number} Index of the beginning or end of a word
     */
    searchWordBoundary(selectionStart: number, direction: number): number;
    /**
     * Selects a word based on the index
     * @param {Number} selectionStart Index of a character
     */
    selectWord(selectionStart: number): void;
    /**
     * Selects a line based on the index
     * @param {Number} selectionStart Index of a character
     */
    selectLine(selectionStart: number): this;
    /**
     * Enters editing state
     */
    enterEditing(e: any): this | undefined;
    exitEditingOnOthers(canvas: Canvas): void;
    /**
     * Initializes "mousemove" event handler
     */
    initMouseMoveHandler(): void;
    /**
     * @private
     */
    mouseMoveHandler(options: any): void;
    /**
     * Override to customize the drag image
     * https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/setDragImage
     * @param {DragEvent} e
     * @param {object} data
     * @param {number} data.selectionStart
     * @param {number} data.selectionEnd
     * @param {string} data.text
     * @param {string} data.value selected text
     */
    setDragImage(e: DragEvent, data: {
        selectionStart: number;
        selectionEnd: number;
        text: string;
        value: string;
    }): void;
    /**
     * support native like text dragging
     * @private
     * @param {DragEvent} e
     * @returns {boolean} should handle event
     */
    onDragStart(e: DragEvent): boolean;
    /**
     * Override to customize drag and drop behavior
     * @public
     * @param {DragEvent} e
     * @returns {boolean}
     */
    canDrop(e: DragEvent): boolean;
    /**
     * support native like text dragging
     * @private
     * @param {object} options
     * @param {DragEvent} options.e
     */
    dragEnterHandler({ e }: TEvent<DragEvent>): void;
    /**
     * support native like text dragging
     * @private
     * @param {object} options
     * @param {DragEvent} options.e
     */
    dragOverHandler({ e }: TEvent<DragEvent>): void;
    /**
     * support native like text dragging
     * @private
     */
    dragLeaveHandler(): void;
    /**
     * support native like text dragging
     * fired only on the drag source
     * handle changes to the drag source in case of a drop on another object or a cancellation
     * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#finishing_a_drag
     * @private
     * @param {object} options
     * @param {DragEvent} options.e
     */
    dragEndHandler({ e }: TEvent<DragEvent>): void;
    /**
     * support native like text dragging
     *
     * Override the `text/plain | application/fabric` types of {@link DragEvent#dataTransfer}
     * in order to change the drop value or to customize styling respectively, by listening to the `drop:before` event
     * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#performing_a_drop
     * @private
     * @param {object} options
     * @param {DragEvent} options.e
     */
    dropHandler({ e }: TEvent<DragEvent>): void;
    /**
     * @private
     */
    _setEditingProps(): void;
    /**
     * convert from textarea to grapheme indexes
     */
    fromStringToGraphemeSelection(start: any, end: any, text: any): {
        selectionStart: number;
        selectionEnd: number;
    };
    /**
     * convert from fabric to textarea values
     */
    fromGraphemeToStringSelection(start: any, end: any, _text: any): {
        selectionStart: any;
        selectionEnd: any;
    };
    /**
     * @private
     */
    _updateTextarea(): void;
    /**
     * @private
     */
    updateFromTextArea(): void;
    /**
     * @private
     */
    updateTextareaPosition(): void;
    /**
     * @private
     * @return {Object} style contains style for hiddenTextarea
     */
    _calcTextareaPosition(): {
        left: number;
        top: number;
        fontSize?: undefined;
        charHeight?: undefined;
    } | {
        left: string;
        top: string;
        fontSize: string;
        charHeight: number;
    };
    /**
     * @private
     */
    _saveEditingProps(): void;
    /**
     * @private
     */
    _restoreEditingProps(): void;
    /**
     * Exits from editing state
     */
    exitEditing(): this;
    /**
     * @private
     */
    _removeExtraneousStyles(): void;
    /**
     * remove and reflow a style block from start to end.
     * @param {Number} start linear start position for removal (included in removal)
     * @param {Number} end linear end position for removal ( excluded from removal )
     */
    removeStyleFromTo(start: number, end: number): void;
    /**
     * Shifts line styles up or down
     * @param {Number} lineIndex Index of a line
     * @param {Number} offset Can any number?
     */
    shiftLineStyles(lineIndex: number, offset: number): void;
    /**
     * Handle insertion of more consecutive style lines for when one or more
     * newlines gets added to the text. Since current style needs to be shifted
     * first we shift the current style of the number lines needed, then we add
     * new lines from the last to the first.
     * @param {Number} lineIndex Index of a line
     * @param {Number} charIndex Index of a char
     * @param {Number} qty number of lines to add
     * @param {Array} copiedStyle Array of objects styles
     */
    insertNewlineStyleObject(lineIndex: number, charIndex: number, qty: number, copiedStyle: any): void;
    /**
     * Inserts style object for a given line/char index
     * @param {Number} lineIndex Index of a line
     * @param {Number} charIndex Index of a char
     * @param {Number} quantity number Style object to insert, if given
     * @param {Array} copiedStyle array of style objects
     */
    insertCharStyleObject(lineIndex: number, charIndex: number, quantity: number, copiedStyle: TextStyleDeclaration[]): void;
    /**
     * Inserts style object(s)
     * @param {Array} insertedText Characters at the location where style is inserted
     * @param {Number} start cursor index for inserting style
     * @param {Array} [copiedStyle] array of style objects to insert.
     */
    insertNewStyleBlock(insertedText: string[], start: number, copiedStyle: TextStyleDeclaration[]): void;
    /**
     * Removes characters from start/end
     * start/end ar per grapheme position in _text array.
     *
     * @param {Number} start
     * @param {Number} end default to start + 1
     */
    removeChars(start: number, end: number): void;
    /**
     * insert characters at start position, before start position.
     * start  equal 1 it means the text get inserted between actual grapheme 0 and 1
     * if style array is provided, it must be as the same length of text in graphemes
     * if end is provided and is bigger than start, old text is replaced.
     * start/end ar per grapheme position in _text array.
     *
     * @param {String} text text to insert
     * @param {Array} style array of style objects
     * @param {Number} start
     * @param {Number} end default to start + 1
     */
    insertChars(text: string, style: TextStyleDeclaration[], start: number, end: number): void;
    /**
     * Set the selectionStart and selectionEnd according to the new position of cursor
     * mimic the key - mouse navigation when shift is pressed.
     */
    setSelectionStartEndWithShift(start: any, end: any, newSelection: any): void;
}
//# sourceMappingURL=itext_behavior.mixin.d.ts.map