import type { ObjectEvents, TPointerEvent, TPointerEventInfo } from '../../EventTypeDefs';
import type { FabricObject } from '../Object/FabricObject';
import { FabricText } from '../Text/Text';
import type { TOnAnimationChangeCallback } from '../../util/animation/types';
import type { ValueAnimation } from '../../util/animation/ValueAnimation';
import type { TextStyleDeclaration } from '../Text/StyledText';
import type { SerializedTextProps, TextProps } from '../Text/Text';
import type { TOptions } from '../../typedefs';
export type ITextEvents = ObjectEvents & {
    'selection:changed': never;
    changed: never | {
        index: number;
        action: string;
    };
    tripleclick: TPointerEventInfo;
    'editing:entered': never | {
        e: TPointerEvent;
    };
    'editing:exited': never;
};
export declare abstract class ITextBehavior<Props extends TOptions<TextProps> = Partial<TextProps>, SProps extends SerializedTextProps = SerializedTextProps, EventSpec extends ITextEvents = ITextEvents> extends FabricText<Props, SProps, EventSpec> {
    abstract isEditing: boolean;
    abstract cursorDelay: number;
    abstract selectionStart: number;
    abstract selectionEnd: number;
    abstract cursorDuration: number;
    abstract editable: boolean;
    abstract editingBorderColor: string;
    abstract compositionStart: number;
    abstract compositionEnd: number;
    abstract hiddenTextarea: HTMLTextAreaElement | null;
    /**
     * Helps determining when the text is in composition, so that the cursor
     * rendering is altered.
     */
    protected inCompositionMode: boolean;
    protected _reSpace: RegExp;
    private _currentTickState?;
    private _currentTickCompleteState?;
    protected _currentCursorOpacity: number;
    private _textBeforeEdit;
    protected __selectionStartOnMouseDown: number;
    protected selected: boolean;
    protected cursorOffsetCache: {
        left?: number;
        top?: number;
    };
    protected _savedProps?: {
        hasControls: boolean;
        borderColor: string;
        lockMovementX: boolean;
        lockMovementY: boolean;
        selectable: boolean;
        hoverCursor: CSSStyleDeclaration['cursor'] | null;
        defaultCursor?: CSSStyleDeclaration['cursor'];
        moveCursor?: CSSStyleDeclaration['cursor'];
    };
    protected _selectionDirection: 'left' | 'right' | null;
    abstract initHiddenTextarea(): void;
    abstract _fireSelectionChanged(): void;
    abstract renderCursorOrSelection(): void;
    abstract getSelectionStartFromPointer(e: TPointerEvent): number;
    abstract _getCursorBoundaries(index: number, skipCaching?: boolean): {
        left: number;
        top: number;
        leftOffset: number;
        topOffset: number;
    };
    /**
     * Initializes all the interactive behavior of IText
     */
    initBehavior(): void;
    onDeselect(options?: {
        e?: TPointerEvent;
        object?: FabricObject;
    }): boolean;
    /**
     * @private
     */
    _animateCursor({ toValue, duration, delay, onComplete, }: {
        toValue: number;
        duration: number;
        delay?: number;
        onComplete?: TOnAnimationChangeCallback<number, void>;
    }): ValueAnimation;
    /**
     * changes the cursor from visible to invisible
     */
    private _tick;
    /**
     * Changes the cursor from invisible to visible
     */
    private _onTickComplete;
    /**
     * Initializes delayed cursor
     */
    initDelayedCursor(restart?: boolean): void;
    /**
     * Aborts cursor animation, clears all timeouts and clear textarea context if necessary
     */
    abortCursorAnimation(): void;
    /**
     * Restart tue cursor animation if either is in complete state ( between animations )
     * or if it never started before
     */
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
    searchWordBoundary(selectionStart: number, direction: 1 | -1): number;
    /**
     * TODO fix: selectionStart set as 0 will be ignored?
     * Selects a word based on the index
     * @param {Number} selectionStart Index of a character
     */
    selectWord(selectionStart?: number): void;
    /**
     * TODO fix: selectionStart set as 0 will be ignored?
     * Selects a line based on the index
     * @param {Number} selectionStart Index of a character
     */
    selectLine(selectionStart?: number): this;
    /**
     * Enters editing state
     */
    enterEditing(e?: TPointerEvent): void;
    /**
     * called by {@link Canvas#textEditingManager}
     */
    updateSelectionOnMouseMove(e: TPointerEvent): void;
    /**
     * @private
     */
    _setEditingProps(): void;
    /**
     * convert from textarea to grapheme indexes
     */
    fromStringToGraphemeSelection(start: number, end: number, text: string): {
        selectionStart: number;
        selectionEnd: number;
    };
    /**
     * convert from fabric to textarea values
     */
    fromGraphemeToStringSelection(start: number, end: number, graphemes: string[]): {
        selectionStart: number;
        selectionEnd: number;
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
        left: string;
        top: string;
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
     * runs the actual logic that exits from editing state, see {@link exitEditing}
     */
    protected _exitEditing(): void;
    /**
     * Exits from editing state and fires relevant events
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
    insertNewlineStyleObject(lineIndex: number, charIndex: number, qty: number, copiedStyle?: {
        [index: number]: TextStyleDeclaration;
    }): void;
    /**
     * Inserts style object for a given line/char index
     * @param {Number} lineIndex Index of a line
     * @param {Number} charIndex Index of a char
     * @param {Number} quantity number Style object to insert, if given
     * @param {Array} copiedStyle array of style objects
     */
    insertCharStyleObject(lineIndex: number, charIndex: number, quantity: number, copiedStyle?: TextStyleDeclaration[]): void;
    /**
     * Inserts style object(s)
     * @param {Array} insertedText Characters at the location where style is inserted
     * @param {Number} start cursor index for inserting style
     * @param {Array} [copiedStyle] array of style objects to insert.
     */
    insertNewStyleBlock(insertedText: string[], start: number, copiedStyle?: TextStyleDeclaration[]): void;
    /**
     * Removes characters from start/end
     * start/end ar per grapheme position in _text array.
     *
     * @param {Number} start
     * @param {Number} end default to start + 1
     */
    removeChars(start: number, end?: number): void;
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
    insertChars(text: string, style: TextStyleDeclaration[] | undefined, start: number, end?: number): void;
    /**
     * Set the selectionStart and selectionEnd according to the new position of cursor
     * mimic the key - mouse navigation when shift is pressed.
     */
    setSelectionStartEndWithShift(start: number, end: number, newSelection: number): void;
}
//# sourceMappingURL=ITextBehavior.d.ts.map