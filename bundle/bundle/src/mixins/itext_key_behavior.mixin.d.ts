import { ObjectEvents } from '../EventTypeDefs';
import { TPointerEvent } from '../typedefs';
import { ITextBehaviorMixin } from './itext_behavior.mixin';
import type { TKeyMapIText } from './itext_key_const';
export declare abstract class ITextKeyBehaviorMixin<EventSpec extends ObjectEvents> extends ITextBehaviorMixin<EventSpec> {
    /**
     * For functionalities on keyDown
     * Map a special key to a function of the instance/prototype
     * If you need different behavior for ESC or TAB or arrows, you have to change
     * this map setting the name of a function that you build on the IText or
     * your prototype.
     * the map change will affect all Instances unless you need for only some text Instances
     * in that case you have to clone this object and assign your Instance.
     * this.keysMap = Object.assign({}, this.keysMap);
     * The function must be in IText.prototype.myFunction And will receive event as args[0]
     */
    keysMap: TKeyMapIText;
    keysMapRtl: TKeyMapIText;
    /**
     * For functionalities on keyUp + ctrl || cmd
     */
    ctrlKeysMapUp: TKeyMapIText;
    /**
     * For functionalities on keyDown + ctrl || cmd
     */
    ctrlKeysMapDown: TKeyMapIText;
    hiddenTextarea: HTMLTextAreaElement | null;
    /**
     * DOM container to append the hiddenTextarea.
     * An alternative to attaching to the document.body.
     * Useful to reduce laggish redraw of the full document.body tree and
     * also with modals event capturing that won't let the textarea take focus.
     * @type HTMLElement
     * @default
     */
    hiddenTextareaContainer?: HTMLElement | null;
    private _clickHandlerInitialized;
    private _copyDone;
    private fromPaste;
    /**
     * Initializes hidden textarea (needed to bring up keyboard in iOS)
     */
    initHiddenTextarea(): void;
    onClick(): void;
    /**
     * Override this method to customize cursor behavior on textbox blur
     */
    blur(): void;
    /**
     * Handles keydown event
     * only used for arrows and combination of modifier keys.
     * @param {KeyboardEvent} e Event object
     */
    onKeyDown(e: KeyboardEvent): void;
    /**
     * Handles keyup event
     * We handle KeyUp because ie11 and edge have difficulties copy/pasting
     * if a copy/cut event fired, keyup is dismissed
     * @param {KeyboardEvent} e Event object
     */
    onKeyUp(e: KeyboardEvent): void;
    /**
     * Handles onInput event
     * @param {Event} e Event object
     */
    onInput(e: Event): void;
    /**
     * Composition start
     */
    onCompositionStart(): void;
    /**
     * Composition end
     */
    onCompositionEnd(): void;
    onCompositionUpdate(e: any): void;
    /**
     * Copies selected text
     */
    copy(): void;
    /**
     * Pastes text
     */
    paste(): void;
    /**
     * Finds the width in pixels before the cursor on the same line
     * @private
     * @param {Number} lineIndex
     * @param {Number} charIndex
     * @return {Number} widthBeforeCursor width before cursor
     */
    _getWidthBeforeCursor(lineIndex: number, charIndex: number): number;
    /**
     * Gets start offset of a selection
     * @param {TPointerEvent} e Event object
     * @param {Boolean} isRight
     * @return {Number}
     */
    getDownCursorOffset(e: KeyboardEvent, isRight: boolean): number;
    /**
     * private
     * Helps finding if the offset should be counted from Start or End
     * @param {KeyboardEvent} e Event object
     * @param {Boolean} isRight
     * @return {Number}
     */
    _getSelectionForOffset(e: KeyboardEvent, isRight: boolean): number;
    /**
     * @param {KeyboardEvent} e Event object
     * @param {Boolean} isRight
     * @return {Number}
     */
    getUpCursorOffset(e: KeyboardEvent, isRight: boolean): number;
    /**
     * for a given width it founds the matching character.
     * @private
     */
    _getIndexOnLine(lineIndex: number, width: number): number;
    /**
     * Moves cursor down
     * @param {TPointerEvent} e Event object
     */
    moveCursorDown(e: TPointerEvent): void;
    /**
     * Moves cursor up
     * @param {TPointerEvent} e Event object
     */
    moveCursorUp(e: TPointerEvent): void;
    /**
     * Moves cursor up or down, fires the events
     * @param {String} direction 'Up' or 'Down'
     * @param {TPointerEvent} e Event object
     */
    _moveCursorUpOrDown(direction: 'Up' | 'Down', e: TPointerEvent): void;
    /**
     * Moves cursor with shift
     * @param {Number} offset
     */
    moveCursorWithShift(offset: number): boolean;
    /**
     * Moves cursor up without shift
     * @param {Number} offset
     */
    moveCursorWithoutShift(offset: number): boolean;
    /**
     * Moves cursor left
     * @param {TPointerEvent} e Event object
     */
    moveCursorLeft(e: TPointerEvent): void;
    /**
     * @private
     * @return {Boolean} true if a change happened
     */
    _move(e: any, prop: any, direction: any): boolean;
    /**
     * @private
     */
    _moveLeft(e: any, prop: any): boolean;
    /**
     * @private
     */
    _moveRight(e: any, prop: any): boolean;
    /**
     * Moves cursor left without keeping selection
     * @param {TPointerEvent} e
     */
    moveCursorLeftWithoutShift(e: TPointerEvent): boolean;
    /**
     * Moves cursor left while keeping selection
     * @param {TPointerEvent} e
     */
    moveCursorLeftWithShift(e: TPointerEvent): boolean | undefined;
    /**
     * Moves cursor right
     * @param {TPointerEvent} e Event object
     */
    moveCursorRight(e: TPointerEvent): void;
    /**
     * Moves cursor right or Left, fires event
     * @param {String} direction 'Left', 'Right'
     * @param {TPointerEvent} e Event object
     */
    _moveCursorLeftOrRight(direction: string, e: TPointerEvent): void;
    /**
     * Moves cursor right while keeping selection
     * @param {TPointerEvent} e
     */
    moveCursorRightWithShift(e: TPointerEvent): boolean | undefined;
    /**
     * Moves cursor right without keeping selection
     * @param {TPointerEvent} e Event object
     */
    moveCursorRightWithoutShift(e: TPointerEvent): boolean;
}
//# sourceMappingURL=itext_key_behavior.mixin.d.ts.map