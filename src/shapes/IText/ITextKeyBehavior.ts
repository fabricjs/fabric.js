import { config } from '../../config';
import { getFabricDocument, getEnv } from '../../env';
import { capValue } from '../../util/misc/capValue';
import type { ITextEvents } from './ITextBehavior';
import { ITextBehavior } from './ITextBehavior';
import type { TKeyMapIText } from './constants';
import type { TOptions } from '../../typedefs';
import type { TextProps, SerializedTextProps } from '../Text/Text';
import { getDocumentFromElement } from '../../util/dom_misc';
import { CHANGED, LEFT, RIGHT } from '../../constants';
import type { IText } from './IText';
import type { TextStyleDeclaration } from '../Text/StyledText';

export abstract class ITextKeyBehavior<
  Props extends TOptions<TextProps> = Partial<TextProps>,
  SProps extends SerializedTextProps = SerializedTextProps,
  EventSpec extends ITextEvents = ITextEvents,
> extends ITextBehavior<Props, SProps, EventSpec> {
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
  declare keysMap: TKeyMapIText;

  declare keysMapRtl: TKeyMapIText;

  /**
   * For functionalities on keyUp + ctrl || cmd
   */
  declare ctrlKeysMapUp: TKeyMapIText;

  /**
   * For functionalities on keyDown + ctrl || cmd
   */
  declare ctrlKeysMapDown: TKeyMapIText;

  declare hiddenTextarea: HTMLTextAreaElement | null;

  /**
   * DOM container to append the hiddenTextarea.
   * An alternative to attaching to the document.body.
   * Useful to reduce laggish redraw of the full document.body tree and
   * also with modals event capturing that won't let the textarea take focus.
   * @type HTMLElement
   * @default
   */
  declare hiddenTextareaContainer?: HTMLElement | null;

  private declare _clickHandlerInitialized: boolean;
  private declare _copyDone: boolean;
  private declare fromPaste: boolean;

  /**
   * Initializes hidden textarea (needed to bring up keyboard in iOS)
   */
  initHiddenTextarea() {
    const doc =
      (this.canvas && getDocumentFromElement(this.canvas.getElement())) ||
      getFabricDocument();
    const textarea = doc.createElement('textarea');
    Object.entries({
      autocapitalize: 'off',
      autocorrect: 'off',
      autocomplete: 'off',
      spellcheck: 'false',
      'data-fabric': 'textarea',
      wrap: 'off',
    }).map(([attribute, value]) => textarea.setAttribute(attribute, value));
    const { top, left, fontSize } = this._calcTextareaPosition();
    // line-height: 1px; was removed from the style to fix this:
    // https://bugs.chromium.org/p/chromium/issues/detail?id=870966
    textarea.style.cssText = `position: absolute; top: ${top}; left: ${left}; z-index: -999; opacity: 0; width: 1px; height: 1px; font-size: 1px; padding-top: ${fontSize};`;

    (this.hiddenTextareaContainer || doc.body).appendChild(textarea);

    Object.entries({
      blur: 'blur',
      keydown: 'onKeyDown',
      keyup: 'onKeyUp',
      input: 'onInput',
      copy: 'copy',
      cut: 'copy',
      paste: 'paste',
      compositionstart: 'onCompositionStart',
      compositionupdate: 'onCompositionUpdate',
      compositionend: 'onCompositionEnd',
    } as Record<string, keyof this>).map(([eventName, handler]) =>
      textarea.addEventListener(
        eventName,
        (this[handler] as EventListener).bind(this),
      ),
    );
    this.hiddenTextarea = textarea;
  }

  /**
   * Override this method to customize cursor behavior on textbox blur
   */
  blur() {
    this.abortCursorAnimation();
  }

  /**
   * Handles keydown event
   * only used for arrows and combination of modifier keys.
   * @param {KeyboardEvent} e Event object
   */
  onKeyDown(e: KeyboardEvent) {
    if (!this.isEditing) {
      return;
    }
    const keyMap = this.direction === 'rtl' ? this.keysMapRtl : this.keysMap;
    if (e.keyCode in keyMap) {
      (this[keyMap[e.keyCode] as keyof this] as (arg: KeyboardEvent) => void)(
        e,
      );
    } else if (e.keyCode in this.ctrlKeysMapDown && (e.ctrlKey || e.metaKey)) {
      (
        this[this.ctrlKeysMapDown[e.keyCode] as keyof this] as (
          arg: KeyboardEvent,
        ) => void
      )(e);
    } else {
      return;
    }
    e.stopImmediatePropagation();
    e.preventDefault();
    if (e.keyCode >= 33 && e.keyCode <= 40) {
      // if i press an arrow key just update selection
      this.inCompositionMode = false;
      this.clearContextTop();
      this.renderCursorOrSelection();
    } else {
      this.canvas && this.canvas.requestRenderAll();
    }
  }

  /**
   * Handles keyup event
   * We handle KeyUp because ie11 and edge have difficulties copy/pasting
   * if a copy/cut event fired, keyup is dismissed
   * @param {KeyboardEvent} e Event object
   */
  onKeyUp(e: KeyboardEvent) {
    if (!this.isEditing || this._copyDone || this.inCompositionMode) {
      this._copyDone = false;
      return;
    }
    if (e.keyCode in this.ctrlKeysMapUp && (e.ctrlKey || e.metaKey)) {
      (
        this[this.ctrlKeysMapUp[e.keyCode] as keyof this] as (
          arg: KeyboardEvent,
        ) => void
      )(e);
    } else {
      return;
    }
    e.stopImmediatePropagation();
    e.preventDefault();
    this.canvas && this.canvas.requestRenderAll();
  }

  /**
   * Handles onInput event
   * @param {Event} e Event object
   */
  onInput(this: this & { hiddenTextarea: HTMLTextAreaElement }, e: Event) {
    const fromPaste = this.fromPaste;
    this.fromPaste = false;
    e && e.stopPropagation();
    if (!this.isEditing) {
      return;
    }
    const updateAndFire = () => {
      this.updateFromTextArea();
      this.fire(CHANGED);
      if (this.canvas) {
        this.canvas.fire('text:changed', { target: this as unknown as IText });
        this.canvas.requestRenderAll();
      }
    };
    if (this.hiddenTextarea.value === '') {
      this.styles = {};
      updateAndFire();
      return;
    }
    // decisions about style changes.
    const nextText = this._splitTextIntoLines(
        this.hiddenTextarea.value,
      ).graphemeText,
      charCount = this._text.length,
      nextCharCount = nextText.length,
      selectionStart = this.selectionStart,
      selectionEnd = this.selectionEnd,
      selection = selectionStart !== selectionEnd;
    let copiedStyle: TextStyleDeclaration[] | undefined,
      removedText,
      charDiff = nextCharCount - charCount,
      removeFrom,
      removeTo;

    const textareaSelection = this.fromStringToGraphemeSelection(
      this.hiddenTextarea.selectionStart,
      this.hiddenTextarea.selectionEnd,
      this.hiddenTextarea.value,
    );
    const backDelete = selectionStart > textareaSelection.selectionStart;

    if (selection) {
      removedText = this._text.slice(selectionStart, selectionEnd);
      charDiff += selectionEnd - selectionStart;
    } else if (nextCharCount < charCount) {
      if (backDelete) {
        removedText = this._text.slice(selectionEnd + charDiff, selectionEnd);
      } else {
        removedText = this._text.slice(
          selectionStart,
          selectionStart - charDiff,
        );
      }
    }
    const insertedText = nextText.slice(
      textareaSelection.selectionEnd - charDiff,
      textareaSelection.selectionEnd,
    );
    if (removedText && removedText.length) {
      if (insertedText.length) {
        // let's copy some style before deleting.
        // we want to copy the style before the cursor OR the style at the cursor if selection
        // is bigger than 0.
        copiedStyle = this.getSelectionStyles(
          selectionStart,
          selectionStart + 1,
          false,
        );
        // now duplicate the style one for each inserted text.
        copiedStyle = insertedText.map(
          () =>
            // this return an array of references, but that is fine since we are
            // copying the style later.
            copiedStyle![0],
        );
      }
      if (selection) {
        removeFrom = selectionStart;
        removeTo = selectionEnd;
      } else if (backDelete) {
        // detect differences between forwardDelete and backDelete
        removeFrom = selectionEnd - removedText.length;
        removeTo = selectionEnd;
      } else {
        removeFrom = selectionEnd;
        removeTo = selectionEnd + removedText.length;
      }
      this.removeStyleFromTo(removeFrom, removeTo);
    }
    if (insertedText.length) {
      const { copyPasteData } = getEnv();
      if (
        fromPaste &&
        insertedText.join('') === copyPasteData.copiedText &&
        !config.disableStyleCopyPaste
      ) {
        copiedStyle = copyPasteData.copiedTextStyle;
      }
      this.insertNewStyleBlock(insertedText, selectionStart, copiedStyle);
    }
    updateAndFire();
  }

  /**
   * Composition start
   */
  onCompositionStart() {
    this.inCompositionMode = true;
  }

  /**
   * Composition end
   */
  onCompositionEnd() {
    this.inCompositionMode = false;
  }

  onCompositionUpdate({ target }: CompositionEvent) {
    const { selectionStart, selectionEnd } = target as HTMLTextAreaElement;
    this.compositionStart = selectionStart;
    this.compositionEnd = selectionEnd;
    this.updateTextareaPosition();
  }

  /**
   * Copies selected text
   */
  copy() {
    if (this.selectionStart === this.selectionEnd) {
      //do not cut-copy if no selection
      return;
    }
    const { copyPasteData } = getEnv();
    copyPasteData.copiedText = this.getSelectedText();
    if (!config.disableStyleCopyPaste) {
      copyPasteData.copiedTextStyle = this.getSelectionStyles(
        this.selectionStart,
        this.selectionEnd,
        true,
      );
    } else {
      copyPasteData.copiedTextStyle = undefined;
    }
    this._copyDone = true;
  }

  /**
   * Pastes text
   */
  paste() {
    this.fromPaste = true;
  }

  /**
   * Finds the width in pixels before the cursor on the same line
   * @private
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @return {Number} widthBeforeCursor width before cursor
   */
  _getWidthBeforeCursor(lineIndex: number, charIndex: number): number {
    let widthBeforeCursor = this._getLineLeftOffset(lineIndex),
      bound;

    if (charIndex > 0) {
      bound = this.__charBounds[lineIndex][charIndex - 1];
      widthBeforeCursor += bound.left + bound.width;
    }
    return widthBeforeCursor;
  }

  /**
   * Gets start offset of a selection
   * @param {KeyboardEvent} e Event object
   * @param {Boolean} isRight
   * @return {Number}
   */
  getDownCursorOffset(e: KeyboardEvent, isRight: boolean): number {
    const selectionProp = this._getSelectionForOffset(e, isRight),
      cursorLocation = this.get2DCursorLocation(selectionProp),
      lineIndex = cursorLocation.lineIndex;
    // if on last line, down cursor goes to end of line
    if (
      lineIndex === this._textLines.length - 1 ||
      e.metaKey ||
      e.keyCode === 34
    ) {
      // move to the end of a text
      return this._text.length - selectionProp;
    }
    const charIndex = cursorLocation.charIndex,
      widthBeforeCursor = this._getWidthBeforeCursor(lineIndex, charIndex),
      indexOnOtherLine = this._getIndexOnLine(lineIndex + 1, widthBeforeCursor),
      textAfterCursor = this._textLines[lineIndex].slice(charIndex);
    return (
      textAfterCursor.length +
      indexOnOtherLine +
      1 +
      this.missingNewlineOffset(lineIndex)
    );
  }

  /**
   * private
   * Helps finding if the offset should be counted from Start or End
   * @param {KeyboardEvent} e Event object
   * @param {Boolean} isRight
   * @return {Number}
   */
  _getSelectionForOffset(e: KeyboardEvent, isRight: boolean): number {
    if (e.shiftKey && this.selectionStart !== this.selectionEnd && isRight) {
      return this.selectionEnd;
    } else {
      return this.selectionStart;
    }
  }

  /**
   * @param {KeyboardEvent} e Event object
   * @param {Boolean} isRight
   * @return {Number}
   */
  getUpCursorOffset(e: KeyboardEvent, isRight: boolean): number {
    const selectionProp = this._getSelectionForOffset(e, isRight),
      cursorLocation = this.get2DCursorLocation(selectionProp),
      lineIndex = cursorLocation.lineIndex;
    if (lineIndex === 0 || e.metaKey || e.keyCode === 33) {
      // if on first line, up cursor goes to start of line
      return -selectionProp;
    }
    const charIndex = cursorLocation.charIndex,
      widthBeforeCursor = this._getWidthBeforeCursor(lineIndex, charIndex),
      indexOnOtherLine = this._getIndexOnLine(lineIndex - 1, widthBeforeCursor),
      textBeforeCursor = this._textLines[lineIndex].slice(0, charIndex),
      missingNewlineOffset = this.missingNewlineOffset(lineIndex - 1);
    // return a negative offset
    return (
      -this._textLines[lineIndex - 1].length +
      indexOnOtherLine -
      textBeforeCursor.length +
      (1 - missingNewlineOffset)
    );
  }

  /**
   * for a given width it founds the matching character.
   * @private
   */
  _getIndexOnLine(lineIndex: number, width: number) {
    const line = this._textLines[lineIndex],
      lineLeftOffset = this._getLineLeftOffset(lineIndex);
    let widthOfCharsOnLine = lineLeftOffset,
      indexOnLine = 0,
      charWidth,
      foundMatch;

    for (let j = 0, jlen = line.length; j < jlen; j++) {
      charWidth = this.__charBounds[lineIndex][j].width;
      widthOfCharsOnLine += charWidth;
      if (widthOfCharsOnLine > width) {
        foundMatch = true;
        const leftEdge = widthOfCharsOnLine - charWidth,
          rightEdge = widthOfCharsOnLine,
          offsetFromLeftEdge = Math.abs(leftEdge - width),
          offsetFromRightEdge = Math.abs(rightEdge - width);

        indexOnLine = offsetFromRightEdge < offsetFromLeftEdge ? j : j - 1;
        break;
      }
    }

    // reached end
    if (!foundMatch) {
      indexOnLine = line.length - 1;
    }

    return indexOnLine;
  }

  /**
   * Moves cursor down
   * @param {KeyboardEvent} e Event object
   */
  moveCursorDown(e: KeyboardEvent) {
    if (
      this.selectionStart >= this._text.length &&
      this.selectionEnd >= this._text.length
    ) {
      return;
    }
    this._moveCursorUpOrDown('Down', e);
  }

  /**
   * Moves cursor up
   * @param {KeyboardEvent} e Event object
   */
  moveCursorUp(e: KeyboardEvent) {
    if (this.selectionStart === 0 && this.selectionEnd === 0) {
      return;
    }
    this._moveCursorUpOrDown('Up', e);
  }

  /**
   * Moves cursor up or down, fires the events
   * @param {String} direction 'Up' or 'Down'
   * @param {KeyboardEvent} e Event object
   */
  _moveCursorUpOrDown(direction: 'Up' | 'Down', e: KeyboardEvent) {
    const offset = this[`get${direction}CursorOffset`](
      e,
      this._selectionDirection === RIGHT,
    );
    if (e.shiftKey) {
      this.moveCursorWithShift(offset);
    } else {
      this.moveCursorWithoutShift(offset);
    }
    if (offset !== 0) {
      const max = this.text.length;
      this.selectionStart = capValue(0, this.selectionStart, max);
      this.selectionEnd = capValue(0, this.selectionEnd, max);
      // TODO fix: abort and init should be an alternative depending
      // on selectionStart/End being equal or different
      this.abortCursorAnimation();
      this.initDelayedCursor();
      this._fireSelectionChanged();
      this._updateTextarea();
    }
  }

  /**
   * Moves cursor with shift
   * @param {Number} offset
   */
  moveCursorWithShift(offset: number) {
    const newSelection =
      this._selectionDirection === LEFT
        ? this.selectionStart + offset
        : this.selectionEnd + offset;
    this.setSelectionStartEndWithShift(
      this.selectionStart,
      this.selectionEnd,
      newSelection,
    );
    return offset !== 0;
  }

  /**
   * Moves cursor up without shift
   * @param {Number} offset
   */
  moveCursorWithoutShift(offset: number) {
    if (offset < 0) {
      this.selectionStart += offset;
      this.selectionEnd = this.selectionStart;
    } else {
      this.selectionEnd += offset;
      this.selectionStart = this.selectionEnd;
    }
    return offset !== 0;
  }

  /**
   * Moves cursor left
   * @param {KeyboardEvent} e Event object
   */
  moveCursorLeft(e: KeyboardEvent) {
    if (this.selectionStart === 0 && this.selectionEnd === 0) {
      return;
    }
    this._moveCursorLeftOrRight('Left', e);
  }

  /**
   * @private
   * @return {Boolean} true if a change happened
   *
   * @todo refactor not to use method name composition
   */
  _move(
    e: KeyboardEvent,
    prop: 'selectionStart' | 'selectionEnd',
    direction: 'Left' | 'Right',
  ): boolean {
    let newValue: number | undefined;
    if (e.altKey) {
      newValue = this[`findWordBoundary${direction}`](this[prop]);
    } else if (e.metaKey || e.keyCode === 35 || e.keyCode === 36) {
      newValue = this[`findLineBoundary${direction}`](this[prop]);
    } else {
      this[prop] += direction === 'Left' ? -1 : 1;
      return true;
    }
    if (typeof newValue !== 'undefined' && this[prop] !== newValue) {
      this[prop] = newValue;
      return true;
    }
    return false;
  }

  /**
   * @private
   */
  _moveLeft(e: KeyboardEvent, prop: 'selectionStart' | 'selectionEnd') {
    return this._move(e, prop, 'Left');
  }

  /**
   * @private
   */
  _moveRight(e: KeyboardEvent, prop: 'selectionStart' | 'selectionEnd') {
    return this._move(e, prop, 'Right');
  }

  /**
   * Moves cursor left without keeping selection
   * @param {KeyboardEvent} e
   */
  moveCursorLeftWithoutShift(e: KeyboardEvent) {
    let change = true;
    this._selectionDirection = LEFT;

    // only move cursor when there is no selection,
    // otherwise we discard it, and leave cursor on same place
    if (
      this.selectionEnd === this.selectionStart &&
      this.selectionStart !== 0
    ) {
      change = this._moveLeft(e, 'selectionStart');
    }
    this.selectionEnd = this.selectionStart;
    return change;
  }

  /**
   * Moves cursor left while keeping selection
   * @param {KeyboardEvent} e
   */
  moveCursorLeftWithShift(e: KeyboardEvent) {
    if (
      this._selectionDirection === RIGHT &&
      this.selectionStart !== this.selectionEnd
    ) {
      return this._moveLeft(e, 'selectionEnd');
    } else if (this.selectionStart !== 0) {
      this._selectionDirection = LEFT;
      return this._moveLeft(e, 'selectionStart');
    }
  }

  /**
   * Moves cursor right
   * @param {KeyboardEvent} e Event object
   */
  moveCursorRight(e: KeyboardEvent) {
    if (
      this.selectionStart >= this._text.length &&
      this.selectionEnd >= this._text.length
    ) {
      return;
    }
    this._moveCursorLeftOrRight('Right', e);
  }

  /**
   * Moves cursor right or Left, fires event
   * @param {String} direction 'Left', 'Right'
   * @param {KeyboardEvent} e Event object
   */
  _moveCursorLeftOrRight(direction: 'Left' | 'Right', e: KeyboardEvent) {
    const actionName = `moveCursor${direction}${
      e.shiftKey ? 'WithShift' : 'WithoutShift'
    }` as const;
    this._currentCursorOpacity = 1;
    if (this[actionName](e)) {
      // TODO fix: abort and init should be an alternative depending
      // on selectionStart/End being equal or different
      this.abortCursorAnimation();
      this.initDelayedCursor();
      this._fireSelectionChanged();
      this._updateTextarea();
    }
  }

  /**
   * Moves cursor right while keeping selection
   * @param {KeyboardEvent} e
   */
  moveCursorRightWithShift(e: KeyboardEvent) {
    if (
      this._selectionDirection === LEFT &&
      this.selectionStart !== this.selectionEnd
    ) {
      return this._moveRight(e, 'selectionStart');
    } else if (this.selectionEnd !== this._text.length) {
      this._selectionDirection = RIGHT;
      return this._moveRight(e, 'selectionEnd');
    }
  }

  /**
   * Moves cursor right without keeping selection
   * @param {KeyboardEvent} e Event object
   */
  moveCursorRightWithoutShift(e: KeyboardEvent) {
    let changed = true;
    this._selectionDirection = RIGHT;

    if (this.selectionStart === this.selectionEnd) {
      changed = this._moveRight(e, 'selectionStart');
      this.selectionEnd = this.selectionStart;
    } else {
      this.selectionStart = this.selectionEnd;
    }
    return changed;
  }
}
