//@ts-nocheck

import { config } from '../../config';
import { getDocument, getEnv } from '../../env';
import { TPointerEvent } from '../../EventTypeDefs';
import { capValue } from '../../util/misc/capValue';
import { ITextBehavior, ITextEvents } from './ITextBehavior';
import type { TKeyMapIText } from './constants';
import { TProps } from '../Object/types';
import { TextProps, SerializedTextProps } from '../Text/Text';

export abstract class ITextKeyBehavior<
  Props extends TProps<TextProps> = Partial<TextProps>,
  SProps extends SerializedTextProps = SerializedTextProps,
  EventSpec extends ITextEvents = ITextEvents
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
    this.hiddenTextarea.addEventListener('cut', this.copy.bind(this));
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
      this[keyMap[e.keyCode]](e);
    } else if (e.keyCode in this.ctrlKeysMapDown && (e.ctrlKey || e.metaKey)) {
      this[this.ctrlKeysMapDown[e.keyCode]](e);
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
      this[this.ctrlKeysMapUp[e.keyCode]](e);
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
  onInput(e: Event) {
    const fromPaste = this.fromPaste;
    this.fromPaste = false;
    e && e.stopPropagation();
    if (!this.isEditing) {
      return;
    }
    const updateAndFire = () => {
      this.updateFromTextArea();
      this.fire('changed');
      if (this.canvas) {
        this.canvas.fire('text:changed', { target: this });
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

  //  */
  onCompositionUpdate(e) {
    this.compositionStart = e.target.selectionStart;
    this.compositionEnd = e.target.selectionEnd;
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
        true
      );
    } else {
      copyPasteData.copiedTextStyle = null;
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
    } else if (e.metaKey || e.keyCode === 35 || e.keyCode === 36) {
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
