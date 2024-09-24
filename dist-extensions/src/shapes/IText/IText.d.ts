import type { ITextEvents } from './ITextBehavior';
import { ITextClickBehavior } from './ITextClickBehavior';
import type { TClassProperties, TFiller, TOptions } from '../../typedefs';
import type { SerializedTextProps, TextProps } from '../Text/Text';
import type { ObjectToCanvasElementOptions } from '../Object/Object';
type CursorBoundaries = {
    left: number;
    top: number;
    leftOffset: number;
    topOffset: number;
};
export declare const iTextDefaultValues: Partial<TClassProperties<IText>>;
interface UniqueITextProps {
    selectionStart: number;
    selectionEnd: number;
}
export interface SerializedITextProps extends SerializedTextProps, UniqueITextProps {
}
export interface ITextProps extends TextProps, UniqueITextProps {
}
/**
 * @fires changed
 * @fires selection:changed
 * @fires editing:entered
 * @fires editing:exited
 * @fires dragstart
 * @fires drag drag event firing on the drag source
 * @fires dragend
 * @fires copy
 * @fires cut
 * @fires paste
 *
 * #### Supported key combinations
 * ```
 *   Move cursor:                    left, right, up, down
 *   Select character:               shift + left, shift + right
 *   Select text vertically:         shift + up, shift + down
 *   Move cursor by word:            alt + left, alt + right
 *   Select words:                   shift + alt + left, shift + alt + right
 *   Move cursor to line start/end:  cmd + left, cmd + right or home, end
 *   Select till start/end of line:  cmd + shift + left, cmd + shift + right or shift + home, shift + end
 *   Jump to start/end of text:      cmd + up, cmd + down
 *   Select till start/end of text:  cmd + shift + up, cmd + shift + down or shift + pgUp, shift + pgDown
 *   Delete character:               backspace
 *   Delete word:                    alt + backspace
 *   Delete line:                    cmd + backspace
 *   Forward delete:                 delete
 *   Copy text:                      ctrl/cmd + c
 *   Paste text:                     ctrl/cmd + v
 *   Cut text:                       ctrl/cmd + x
 *   Select entire text:             ctrl/cmd + a
 *   Quit editing                    tab or esc
 * ```
 *
 * #### Supported mouse/touch combination
 * ```
 *   Position cursor:                click/touch
 *   Create selection:               click/touch & drag
 *   Create selection:               click & shift + click
 *   Select word:                    double click
 *   Select line:                    triple click
 * ```
 */
export declare class IText<Props extends TOptions<ITextProps> = Partial<ITextProps>, SProps extends SerializedITextProps = SerializedITextProps, EventSpec extends ITextEvents = ITextEvents> extends ITextClickBehavior<Props, SProps, EventSpec> implements UniqueITextProps {
    /**
     * Index where text selection starts (or where cursor is when there is no selection)
     * @type Number
     * @default
     */
    selectionStart: number;
    /**
     * Index where text selection ends
     * @type Number
     * @default
     */
    selectionEnd: number;
    compositionStart: number;
    compositionEnd: number;
    /**
     * Color of text selection
     * @type String
     * @default
     */
    selectionColor: string;
    /**
     * Indicates whether text is in editing mode
     * @type Boolean
     * @default
     */
    isEditing: boolean;
    /**
     * Indicates whether a text can be edited
     * @type Boolean
     * @default
     */
    editable: boolean;
    /**
     * Border color of text object while it's in editing mode
     * @type String
     * @default
     */
    editingBorderColor: string;
    /**
     * Width of cursor (in px)
     * @type Number
     * @default
     */
    cursorWidth: number;
    /**
     * Color of text cursor color in editing mode.
     * if not set (default) will take color from the text.
     * if set to a color value that fabric can understand, it will
     * be used instead of the color of the text at the current position.
     * @type String
     * @default
     */
    cursorColor: string;
    /**
     * Delay between cursor blink (in ms)
     * @type Number
     * @default
     */
    cursorDelay: number;
    /**
     * Duration of cursor fade in (in ms)
     * @type Number
     * @default
     */
    cursorDuration: number;
    compositionColor: string;
    /**
     * Indicates whether internal text char widths can be cached
     * @type Boolean
     * @default
     */
    caching: boolean;
    static ownDefaults: Partial<TClassProperties<IText<Partial<ITextProps>, SerializedITextProps, ITextEvents>>>;
    static getDefaults(): Record<string, any>;
    static type: string;
    get type(): string;
    /**
     * Constructor
     * @param {String} text Text string
     * @param {Object} [options] Options object
     */
    constructor(text: string, options?: Props);
    /**
     * While editing handle differently
     * @private
     * @param {string} key
     * @param {*} value
     */
    _set(key: string, value: any): this;
    /**
     * Sets selection start (left boundary of a selection)
     * @param {Number} index Index to set selection start to
     */
    setSelectionStart(index: number): void;
    /**
     * Sets selection end (right boundary of a selection)
     * @param {Number} index Index to set selection end to
     */
    setSelectionEnd(index: number): void;
    /**
     * @private
     * @param {String} property 'selectionStart' or 'selectionEnd'
     * @param {Number} index new position of property
     */
    protected _updateAndFire(property: 'selectionStart' | 'selectionEnd', index: number): void;
    /**
     * Fires the even of selection changed
     * @private
     */
    _fireSelectionChanged(): void;
    /**
     * Initialize text dimensions. Render all text on given context
     * or on a offscreen canvas to get the text width with measureText.
     * Updates this.width and this.height with the proper values.
     * Does not return dimensions.
     * @private
     */
    initDimensions(): void;
    /**
     * Gets style of a current selection/cursor (at the start position)
     * if startIndex or endIndex are not provided, selectionStart or selectionEnd will be used.
     * @param {Number} startIndex Start index to get styles at
     * @param {Number} endIndex End index to get styles at, if not specified selectionEnd or startIndex + 1
     * @param {Boolean} [complete] get full style or not
     * @return {Array} styles an array with one, zero or more Style objects
     */
    getSelectionStyles(startIndex?: number, endIndex?: number, complete?: boolean): Partial<import("../Text/StyledText").CompleteTextStyleDeclaration>[];
    /**
     * Sets style of a current selection, if no selection exist, do not set anything.
     * @param {Object} [styles] Styles object
     * @param {Number} [startIndex] Start index to get styles at
     * @param {Number} [endIndex] End index to get styles at, if not specified selectionEnd or startIndex + 1
     */
    setSelectionStyles(styles: object, startIndex?: number, endIndex?: number): void;
    /**
     * Returns 2d representation (lineIndex and charIndex) of cursor (or selection start)
     * @param {Number} [selectionStart] Optional index. When not given, current selectionStart is used.
     * @param {Boolean} [skipWrapping] consider the location for unwrapped lines. useful to manage styles.
     */
    get2DCursorLocation(selectionStart?: number, skipWrapping?: boolean): {
        lineIndex: number;
        charIndex: number;
    };
    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    render(ctx: CanvasRenderingContext2D): void;
    /**
     * @override block cursor/selection logic while rendering the exported canvas
     * @todo this workaround should be replaced with a more robust solution
     */
    toCanvasElement(options?: ObjectToCanvasElementOptions): HTMLCanvasElement;
    /**
     * Renders cursor or selection (depending on what exists)
     * it does on the contextTop. If contextTop is not available, do nothing.
     */
    renderCursorOrSelection(): void;
    /**
     * Returns cursor boundaries (left, top, leftOffset, topOffset)
     * left/top are left/top of entire text box
     * leftOffset/topOffset are offset from that left/top point of a text box
     * @private
     * @param {number} [index] index from start
     * @param {boolean} [skipCaching]
     */
    _getCursorBoundaries(index?: number, skipCaching?: boolean): CursorBoundaries;
    /**
     * Caches and returns cursor left/top offset relative to instance's center point
     * @private
     * @param {number} index index from start
     * @param {boolean} [skipCaching]
     */
    _getCursorBoundariesOffsets(index: number, skipCaching?: boolean): {
        left: number;
        top: number;
    };
    /**
     * Calculates cursor left/top offset relative to instance's center point
     * @private
     * @param {number} index index from start
     */
    __getCursorBoundariesOffsets(index: number): {
        top: number;
        left: number;
    };
    /**
     * Renders cursor on context Top, outside the animation cycle, on request
     * Used for the drag/drop effect.
     * If contextTop is not available, do nothing.
     */
    renderCursorAt(selectionStart: number): void;
    /**
     * Renders cursor
     * @param {Object} boundaries
     * @param {CanvasRenderingContext2D} ctx transformed context to draw on
     */
    renderCursor(ctx: CanvasRenderingContext2D, boundaries: CursorBoundaries): void;
    _renderCursor(ctx: CanvasRenderingContext2D, boundaries: CursorBoundaries, selectionStart: number): void;
    /**
     * Renders text selection
     * @param {Object} boundaries Object with left/top/leftOffset/topOffset
     * @param {CanvasRenderingContext2D} ctx transformed context to draw on
     */
    renderSelection(ctx: CanvasRenderingContext2D, boundaries: CursorBoundaries): void;
    /**
     * Renders drag start text selection
     */
    renderDragSourceEffect(): void;
    renderDropTargetEffect(e: DragEvent): void;
    /**
     * Renders text selection
     * @private
     * @param {{ selectionStart: number, selectionEnd: number }} selection
     * @param {Object} boundaries Object with left/top/leftOffset/topOffset
     * @param {CanvasRenderingContext2D} ctx transformed context to draw on
     */
    _renderSelection(ctx: CanvasRenderingContext2D, selection: {
        selectionStart: number;
        selectionEnd: number;
    }, boundaries: CursorBoundaries): void;
    /**
     * High level function to know the height of the cursor.
     * the currentChar is the one that precedes the cursor
     * Returns fontSize of char at the current cursor
     * Unused from the library, is for the end user
     * @return {Number} Character font size
     */
    getCurrentCharFontSize(): number;
    /**
     * High level function to know the color of the cursor.
     * the currentChar is the one that precedes the cursor
     * Returns color (fill) of char at the current cursor
     * if the text object has a pattern or gradient for filler, it will return that.
     * Unused by the library, is for the end user
     * @return {String | TFiller} Character color (fill)
     */
    getCurrentCharColor(): string | TFiller | null;
    /**
     * Returns the cursor position for the getCurrent.. functions
     * @private
     */
    _getCurrentCharIndex(): {
        l: number;
        c: number;
    };
    dispose(): void;
}
export {};
//# sourceMappingURL=IText.d.ts.map