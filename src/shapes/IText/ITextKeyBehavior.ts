//@ts-nocheck

import { getDocument } from '../../env';
import { TPointerEvent } from '../../EventTypeDefs';
import { capValue } from '../../util/misc/capValue';
import { ITextBehavior, ITextEvents } from './ITextBehavior';
import { AssertKeys } from '../../typedefs';
import type { IText } from './IText';

export type TKeyMapIText = Record<
  KeyboardEvent['key'],
  keyof IText | ((this: IText, e: KeyboardEvent) => any)
>;

export abstract class ITextKeyBehavior<
  EventSpec extends ITextEvents = ITextEvents
> extends ITextBehavior<EventSpec> {
  /**
   * Prefer using [KeyboardEvent#key]{@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key}
   * or [KeyboardEvent#code]{@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code}
   * instead of **deprecated** [KeyboardEvent#keyCode]{@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode}
   *
   * For functionalities on keyDown
   *
   * @deprecated override {@link handleSelectionChange} instead
   */
  declare keysMap: TKeyMapIText;

  /**
   * For functionalities on keyDown when `direction === 'rtl'`
   *
   * @deprecated override {@link handleSelectionChange} instead
   */
  declare keysMapRtl: TKeyMapIText;

  /**
   * For functionalities on keyDown + ctrl || cmd
   * @deprecated override {@link handleSelectionChange} instead
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
  private declare fromPaste: boolean;

  /**
   * Initializes hidden textarea (needed to bring up keyboard in iOS)
   */
  initHiddenTextarea() {
    this.hiddenTextarea = getDocument().createElement('textarea');
    this.hiddenTextarea.setAttribute('autocapitalize', 'off');
    this.hiddenTextarea.setAttribute('autocorrect', 'off');
    this.hiddenTextarea.setAttribute('autocomplete', 'off');
    this.hiddenTextarea.setAttribute('spellcheck', 'false');
    this.hiddenTextarea.setAttribute('data-fabric', 'textarea');
    this.hiddenTextarea.setAttribute('wrap', 'off');
    const style = this._calcTextareaPosition();
    // line-height: 1px; was removed from the style to fix this:
    // https://bugs.chromium.org/p/chromium/issues/detail?id=870966
    this.hiddenTextarea.style.cssText = `position: absolute; top: ${style.top}; left: ${style.left}; z-index: -999; opacity: 0; width: 1px; height: 1px; font-size: 1px; padding-top: ${style.fontSize};`;

    if (this.hiddenTextareaContainer) {
      this.hiddenTextareaContainer.appendChild(this.hiddenTextarea);
    } else {
      getDocument().body.appendChild(this.hiddenTextarea);
    }

    this.hiddenTextarea.addEventListener('blur', this.blur.bind(this));
    this.hiddenTextarea.addEventListener('keydown', this.onKeyDown.bind(this));
    this.hiddenTextarea.addEventListener('keyup', this.onKeyUp.bind(this));
    this.hiddenTextarea.addEventListener('input', this.onInput.bind(this));
    this.hiddenTextarea.addEventListener('copy', this.copy.bind(this));
    this.hiddenTextarea.addEventListener('cut', this.cut.bind(this));
    this.hiddenTextarea.addEventListener('paste', this.paste.bind(this));
    this.hiddenTextarea.addEventListener(
      'compositionstart',
      this.onCompositionStart.bind(this)
    );
    this.hiddenTextarea.addEventListener(
      'compositionupdate',
      this.onCompositionUpdate.bind(this)
    );
    this.hiddenTextarea.addEventListener(
      'compositionend',
      this.onCompositionEnd.bind(this)
    );

    if (!this._clickHandlerInitialized && this.canvas) {
      this.canvas.upperCanvasEl.addEventListener(
        'click',
        this.onClick.bind(this)
      );
      this._clickHandlerInitialized = true;
    }
  }

  onClick() {
    this.hiddenTextarea && this.hiddenTextarea.focus();
  }

  /**
   * Override this method to customize cursor behavior on textbox blur
   */
  blur() {
    this.abortCursorAnimation();
  }

  /**
   * @returns true if text selection changed
   */
  handleSelectionChange(e: KeyboardEvent): boolean {
    const keyMap =
      e.ctrlKey || e.metaKey
        ? this.ctrlKeysMapDown
        : this.direction === 'rtl'
        ? this.keysMapRtl
        : this.keysMap;
    const value: TKeyMapIText[string] | undefined =
      keyMap[e.key] || keyMap[e.code] || keyMap[e.keyCode];
    const func =
      typeof value === 'string' && typeof this[value] === 'function'
        ? this[value]
        : value;
    // execute
    if (typeof func === 'function') {
      console.warn(
        'fabric.IText: Key maps are deprecated, override `handleSelectionChange` or `onKeyDown` instead.'
      );
      func.call(this, e);
      return true;
    } else if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'a':
          this.selectAll();
          return true;
        default:
          return false;
      }
    } else {
      switch (e.key) {
        case 'Tab':
        case 'Escape':
          this.exitEditing();
          // TODO: shouldn't this be called from `exitEditing`?
          this.canvas.requestRenderAll();
          return true;
        case 'ArrowUp':
        case 'PageUp':
          this.moveCursorUp(e);
          return true;
        case 'ArrowDown':
        case 'PageDown':
          this.moveCursorDown(e);
          return true;
        case 'ArrowLeft':
        case 'Home':
          this.direction === 'rtl'
            ? this.moveCursorRight(e)
            : this.moveCursorLeft(e);
          return true;
        case 'ArrowRight':
        case 'End':
          this.direction === 'rtl'
            ? this.moveCursorLeft(e)
            : this.moveCursorRight(e);
          return true;
        default:
          return false;
      }
    }
  }

  /**
   * Handles keydown event.\
   * Used **ONLY** for changing text selection (including {@link exitEditing}).
   * For anything else use the input event, see {@link onInput}.
   * @param {KeyboardEvent} e Event object
   */
  onKeyDown(e: KeyboardEvent) {
    if (this.isEditing && this.handleSelectionChange(e)) {
      e.stopImmediatePropagation();
      e.preventDefault();
      this.inCompositionMode = false;
      this.renderCursorOrSelection();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onKeyUp(e: KeyboardEvent) {
    // override at will
  }

  /**
   * Handles onInput event
   * @param {Event} e Event object
   */
  onInput(e: Event) {
    e && e.stopPropagation();
    if (!this.isEditing) {
      return;
    }
    // decisions about style changes.
    const nextText = this._splitTextIntoLines(
        this.hiddenTextarea.value
      ).graphemeText,
      charCount = this._text.length,
      nextCharCount = nextText.length,
      selectionStart = this.selectionStart,
      selectionEnd = this.selectionEnd,
      selection = selectionStart !== selectionEnd;
    let copiedStyle,
      removedText,
      charDiff = nextCharCount - charCount,
      removeFrom,
      removeTo;
    if (this.hiddenTextarea.value === '') {
      this.styles = {};
      this.updateFromTextArea();
      this.fire('changed');
      if (this.canvas) {
        this.canvas.fire('text:changed', { target: this });
        this.canvas.requestRenderAll();
      }
      return;
    }

    const textareaSelection = this.fromStringToGraphemeSelection(
      this.hiddenTextarea.selectionStart,
      this.hiddenTextarea.selectionEnd,
      this.hiddenTextarea.value
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
          selectionStart - charDiff
        );
      }
    }
    const insertedText = nextText.slice(
      textareaSelection.selectionEnd - charDiff,
      textareaSelection.selectionEnd
    );
    if (removedText && removedText.length) {
      if (insertedText.length) {
        // let's copy some style before deleting.
        // we want to copy the style before the cursor OR the style at the cursor if selection
        // is bigger than 0.
        copiedStyle = this.getSelectionStyles(
          selectionStart,
          selectionStart + 1,
          false
        );
        // now duplicate the style one for each inserted text.
        copiedStyle = insertedText.map(
          () =>
            // this return an array of references, but that is fine since we are
            // copying the style later.
            copiedStyle[0]
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
      this.insertNewStyleBlock(insertedText, selectionStart, copiedStyle);
    }
    this.updateFromTextArea();
    this.fire('changed');
    if (this.canvas) {
      this.canvas.fire('text:changed', { target: this });
      this.canvas.requestRenderAll();
    }
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

  //  */
  onCompositionUpdate(e: CompositionEvent) {
    this.compositionStart = e.target.selectionStart;
    this.compositionEnd = e.target.selectionEnd;
    this.updateTextareaPosition();
  }

  /**
   *
   * @returns true if text is selected and if the {@link ClipboardEvent#clipboardData} was set
   */
  protected setClipboardData(e: ClipboardEvent) {
    // prevent input event
    e.preventDefault();
    const clipboardData = e.clipboardData;
    if (this.selectionStart === this.selectionEnd || !clipboardData) {
      return false;
    }
    const value = this.getSelectedText();
    clipboardData.setData('text/plain', value);
    clipboardData.setData(
      'application/fabric',
      JSON.stringify({
        value,
        styles: this.getSelectionStyles(
          this.selectionStart,
          this.selectionEnd,
          true
        ),
      })
    );
    return true;
  }

  /**
   * @fires `copy`, use this event to modify the {@link ClipboardEvent#clipboardData}
   */
  copy(e: ClipboardEvent) {
    this.setClipboardData(e) && this.fire('copy', { e });
  }

  /**
   * @fires `cut`, use this event to modify the {@link ClipboardEvent#clipboardData}
   */
  cut(this: AssertKeys<this, 'hiddenTextarea'>, e: ClipboardEvent) {
    if (this.setClipboardData(e)) {
      //  remove selection and force recalculating dimensions
      this._forceClearCache = true;
      this.insertChars('', null, this.selectionStart, this.selectionEnd);
      this.selectionEnd = this.selectionStart;
      this.hiddenTextarea.value = this.text;
      this._updateTextarea();
      this.fire('cut', { e });
      this.fire('changed', { index: this.selectionStart, action: 'cut' });
      this.canvas.fire('text:changed', { target: this });
      this.canvas.requestRenderAll();
    }
  }

  /**
   * @override Override the `text/plain | application/fabric` types of {@link ClipboardEvent#clipboardData}
   * in order to change the pasted value or to customize styling respectively, by listening to the `paste` event
   */
  paste(this: AssertKeys<this, 'hiddenTextarea'>, e: ClipboardEvent) {
    // prevent input event
    e.preventDefault();
    //  fire event before logic to allow overriding clipboard data
    this.fire('paste', { e });
    // obtain values from event
    const clipboardData = e.clipboardData;
    const value = clipboardData.getData('text/plain');
    const { styles } = clipboardData.types.includes('application/fabric')
      ? JSON.parse(clipboardData.getData('application/fabric'))
      : {};
    // execute paste logic
    if (value) {
      this.insertChars(value, styles, this.selectionStart, this.selectionEnd);
      this.selectionStart = this.selectionEnd =
        this.selectionStart + value.length;
      this.hiddenTextarea.value = this.text;
      this._updateTextarea();
      this.fire('changed', { index: this.selectionStart, action: 'paste' });
      this.canvas.fire('text:changed', { target: this });
      this.canvas.requestRenderAll();
    }
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
   * @param {TPointerEvent} e Event object
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
      e.key === 'PageDown'
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
    if (lineIndex === 0 || e.metaKey || e.key === 'PageUp') {
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
   * @param {TPointerEvent} e Event object
   */
  moveCursorDown(e: TPointerEvent) {
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
   * @param {TPointerEvent} e Event object
   */
  moveCursorUp(e: TPointerEvent) {
    if (this.selectionStart === 0 && this.selectionEnd === 0) {
      return;
    }
    this._moveCursorUpOrDown('Up', e);
  }

  /**
   * Moves cursor up or down, fires the events
   * @param {String} direction 'Up' or 'Down'
   * @param {TPointerEvent} e Event object
   */
  _moveCursorUpOrDown(direction: 'Up' | 'Down', e: TPointerEvent) {
    const action = `get${direction}CursorOffset`,
      offset = this[action](e, this._selectionDirection === 'right');
    if (e.shiftKey) {
      this.moveCursorWithShift(offset);
    } else {
      this.moveCursorWithoutShift(offset);
    }
    if (offset !== 0) {
      const max = this.text.length;
      this.selectionStart = capValue(0, this.selectionStart, max);
      this.selectionEnd = capValue(0, this.selectionEnd, max);
      this.abortCursorAnimation();
      this._currentCursorOpacity = 1;
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
      this._selectionDirection === 'left'
        ? this.selectionStart + offset
        : this.selectionEnd + offset;
    this.setSelectionStartEndWithShift(
      this.selectionStart,
      this.selectionEnd,
      newSelection
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
   * @param {TPointerEvent} e Event object
   */
  moveCursorLeft(e: TPointerEvent) {
    if (this.selectionStart === 0 && this.selectionEnd === 0) {
      return;
    }
    this._moveCursorLeftOrRight('Left', e);
  }

  /**
   * @private
   * @return {Boolean} true if a change happened
   */
  _move(e, prop, direction): boolean {
    let newValue;
    if (e.altKey) {
      newValue = this['findWordBoundary' + direction](this[prop]);
    } else if (e.metaKey || e.key === 'End' || e.key === 'Home') {
      newValue = this['findLineBoundary' + direction](this[prop]);
    } else {
      this[prop] += direction === 'Left' ? -1 : 1;
      return true;
    }
    if (typeof newValue !== 'undefined' && this[prop] !== newValue) {
      this[prop] = newValue;
      return true;
    }
  }

  /**
   * @private
   */
  _moveLeft(e, prop) {
    return this._move(e, prop, 'Left');
  }

  /**
   * @private
   */
  _moveRight(e, prop) {
    return this._move(e, prop, 'Right');
  }

  /**
   * Moves cursor left without keeping selection
   * @param {TPointerEvent} e
   */
  moveCursorLeftWithoutShift(e: TPointerEvent) {
    let change = true;
    this._selectionDirection = 'left';

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
   * @param {TPointerEvent} e
   */
  moveCursorLeftWithShift(e: TPointerEvent) {
    if (
      this._selectionDirection === 'right' &&
      this.selectionStart !== this.selectionEnd
    ) {
      return this._moveLeft(e, 'selectionEnd');
    } else if (this.selectionStart !== 0) {
      this._selectionDirection = 'left';
      return this._moveLeft(e, 'selectionStart');
    }
  }

  /**
   * Moves cursor right
   * @param {TPointerEvent} e Event object
   */
  moveCursorRight(e: TPointerEvent) {
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
   * @param {TPointerEvent} e Event object
   */
  _moveCursorLeftOrRight(direction: string, e: TPointerEvent) {
    let actionName = 'moveCursor' + direction + 'With';
    this._currentCursorOpacity = 1;

    if (e.shiftKey) {
      actionName += 'Shift';
    } else {
      actionName += 'outShift';
    }
    if (this[actionName](e)) {
      this.abortCursorAnimation();
      this.initDelayedCursor();
      this._fireSelectionChanged();
      this._updateTextarea();
    }
  }

  /**
   * Moves cursor right while keeping selection
   * @param {TPointerEvent} e
   */
  moveCursorRightWithShift(e: TPointerEvent) {
    if (
      this._selectionDirection === 'left' &&
      this.selectionStart !== this.selectionEnd
    ) {
      return this._moveRight(e, 'selectionStart');
    } else if (this.selectionEnd !== this._text.length) {
      this._selectionDirection = 'right';
      return this._moveRight(e, 'selectionEnd');
    }
  }

  /**
   * Moves cursor right without keeping selection
   * @param {TPointerEvent} e Event object
   */
  moveCursorRightWithoutShift(e: TPointerEvent) {
    let changed = true;
    this._selectionDirection = 'right';

    if (this.selectionStart === this.selectionEnd) {
      changed = this._moveRight(e, 'selectionStart');
      this.selectionEnd = this.selectionStart;
    } else {
      this.selectionStart = this.selectionEnd;
    }
    return changed;
  }
}
