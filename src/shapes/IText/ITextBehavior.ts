import type { ObjectEvents, TPointerEvent } from '../../EventTypeDefs';
import { Point } from '../../Point';
import type { FabricObject } from '../Object/FabricObject';
import { FabricText } from '../Text/Text';
import { animate } from '../../util/animation/animate';
import type { TOnAnimationChangeCallback } from '../../util/animation/types';
import type { ValueAnimation } from '../../util/animation/ValueAnimation';
import type { TextStyleDeclaration } from '../Text/StyledText';
import type { SerializedTextProps, TextProps } from '../Text/Text';
import type { TOptions, TOriginX } from '../../typedefs';
import { getDocumentFromElement } from '../../util/dom_misc';
import { LEFT, LTR, MODIFIED, RIGHT, reNewline } from '../../constants';
import type { IText } from './IText';
import { JUSTIFY } from '../Text/constants';

/**
 *  extend this regex to support non english languages
 *
 *  - ` `      Matches a SPACE character (char code 32).
 *  - `\n`     Matches a LINE FEED character (char code 10).
 *  - `\.`     Matches a "." character (char code 46).
 *  - `,`      Matches a "," character (char code 44).
 *  - `;`      Matches a ";" character (char code 59).
 *  - `!`      Matches a "!" character (char code 33).
 *  - `\?`     Matches a "?" character (char code 63).
 *  - `\-`     Matches a "-" character (char code 45).
 */
// eslint-disable-next-line no-useless-escape
const reNonWord = /[ \n\.,;!\?\-]/;

export type ITextEvents = ObjectEvents & {
  'selection:changed': never;
  changed: never | { index: number; action: string };
  'editing:entered': never | { e: TPointerEvent };
  'editing:exited': never;
};

export abstract class ITextBehavior<
  Props extends TOptions<TextProps> = Partial<TextProps>,
  SProps extends SerializedTextProps = SerializedTextProps,
  EventSpec extends ITextEvents = ITextEvents,
> extends FabricText<Props, SProps, EventSpec> {
  declare abstract isEditing: boolean;
  declare abstract cursorDelay: number;
  declare abstract selectionStart: number;
  declare abstract selectionEnd: number;
  declare abstract cursorDuration: number;
  declare abstract editable: boolean;
  declare abstract editingBorderColor: string;

  declare abstract compositionStart: number;
  declare abstract compositionEnd: number;

  declare abstract hiddenTextarea: HTMLTextAreaElement | null;

  /**
   * Helps determining when the text is in composition, so that the cursor
   * rendering is altered.
   */
  declare protected inCompositionMode: boolean;

  declare protected _reSpace: RegExp;
  declare private _currentTickState?: ValueAnimation;
  declare private _currentTickCompleteState?: ValueAnimation;
  protected _currentCursorOpacity = 1;
  declare private _textBeforeEdit: string;
  declare protected __selectionStartOnMouseDown: number;

  /**
   * Keeps track if the IText object was selected before the actual click.
   * This because we want to delay enter editing by a click.
   */
  declare protected selected: boolean;
  declare protected cursorOffsetCache: { left?: number; top?: number };
  declare protected _savedProps?: {
    hasControls: boolean;
    borderColor: string;
    lockMovementX: boolean;
    lockMovementY: boolean;
    selectable: boolean;
    hoverCursor: CSSStyleDeclaration['cursor'] | null;
    defaultCursor?: CSSStyleDeclaration['cursor'];
    moveCursor?: CSSStyleDeclaration['cursor'];
  };
  declare protected _selectionDirection: 'left' | 'right' | null;

  abstract initHiddenTextarea(): void;
  abstract _fireSelectionChanged(): void;
  abstract renderCursorOrSelection(): void;
  abstract getSelectionStartFromPointer(e: TPointerEvent): number;
  abstract _getCursorBoundaries(
    index: number,
    skipCaching?: boolean,
  ): {
    left: number;
    top: number;
    leftOffset: number;
    topOffset: number;
  };

  /**
   * Initializes all the interactive behavior of IText
   */
  initBehavior() {
    this._tick = this._tick.bind(this);
    this._onTickComplete = this._onTickComplete.bind(this);
    this.updateSelectionOnMouseMove =
      this.updateSelectionOnMouseMove.bind(this);
  }

  onDeselect(options?: { e?: TPointerEvent; object?: FabricObject }) {
    this.isEditing && this.exitEditing();
    this.selected = false;
    return super.onDeselect(options);
  }

  /**
   * @private
   */
  _animateCursor({
    toValue,
    duration,
    delay,
    onComplete,
  }: {
    toValue: number;
    duration: number;
    delay?: number;
    onComplete?: TOnAnimationChangeCallback<number>;
  }) {
    return animate({
      startValue: this._currentCursorOpacity,
      endValue: toValue,
      duration,
      delay,
      onComplete,
      abort: () =>
        !this.canvas ||
        // we do not want to animate a selection, only cursor
        this.selectionStart !== this.selectionEnd,
      onChange: (value) => {
        this._currentCursorOpacity = value;
        this.renderCursorOrSelection();
      },
    });
  }

  /**
   * changes the cursor from visible to invisible
   */
  private _tick(delay?: number) {
    this._currentTickState = this._animateCursor({
      toValue: 0,
      duration: this.cursorDuration / 2,
      delay: Math.max(delay || 0, 100),
      onComplete: this._onTickComplete,
    });
  }

  /**
   * Changes the cursor from invisible to visible
   */
  private _onTickComplete() {
    this._currentTickCompleteState?.abort();
    this._currentTickCompleteState = this._animateCursor({
      toValue: 1,
      duration: this.cursorDuration,
      onComplete: this._tick,
    });
  }

  /**
   * Initializes delayed cursor
   */
  initDelayedCursor(restart?: boolean) {
    this.abortCursorAnimation();
    this._tick(restart ? 0 : this.cursorDelay);
  }

  /**
   * Aborts cursor animation, clears all timeouts and clear textarea context if necessary
   */
  abortCursorAnimation() {
    let shouldClear = false;
    [this._currentTickState, this._currentTickCompleteState].forEach(
      (cursorAnimation) => {
        if (cursorAnimation && !cursorAnimation.isDone()) {
          shouldClear = true;
          cursorAnimation.abort();
        }
      },
    );

    this._currentCursorOpacity = 1;

    //  make sure we clear context even if instance is not editing
    if (shouldClear) {
      this.clearContextTop();
    }
  }

  /**
   * Restart tue cursor animation if either is in complete state ( between animations )
   * or if it never started before
   */
  restartCursorIfNeeded() {
    if (
      [this._currentTickState, this._currentTickCompleteState].some(
        (cursorAnimation) => !cursorAnimation || cursorAnimation.isDone(),
      )
    ) {
      this.initDelayedCursor();
    }
  }

  /**
   * Selects entire text
   */
  selectAll() {
    this.selectionStart = 0;
    this.selectionEnd = this._text.length;
    this._fireSelectionChanged();
    this._updateTextarea();
    return this;
  }

  /**
   * Selects entire text and updates the visual state
   */
  cmdAll() {
    this.selectAll();
    this.renderCursorOrSelection();
  }

  /**
   * Returns selected text
   * @return {String}
   */
  getSelectedText(): string {
    return this._text.slice(this.selectionStart, this.selectionEnd).join('');
  }

  /**
   * Find new selection index representing start of current word according to current selection index
   * @param {Number} startFrom Current selection index
   * @return {Number} New selection index
   */
  findWordBoundaryLeft(startFrom: number): number {
    let offset = 0,
      index = startFrom - 1;

    // remove space before cursor first
    if (this._reSpace.test(this._text[index])) {
      while (this._reSpace.test(this._text[index])) {
        offset++;
        index--;
      }
    }
    while (/\S/.test(this._text[index]) && index > -1) {
      offset++;
      index--;
    }

    return startFrom - offset;
  }

  /**
   * Find new selection index representing end of current word according to current selection index
   * @param {Number} startFrom Current selection index
   * @return {Number} New selection index
   */
  findWordBoundaryRight(startFrom: number): number {
    let offset = 0,
      index = startFrom;

    // remove space after cursor first
    if (this._reSpace.test(this._text[index])) {
      while (this._reSpace.test(this._text[index])) {
        offset++;
        index++;
      }
    }
    while (/\S/.test(this._text[index]) && index < this._text.length) {
      offset++;
      index++;
    }

    return startFrom + offset;
  }

  /**
   * Find new selection index representing start of current line according to current selection index
   * @param {Number} startFrom Current selection index
   * @return {Number} New selection index
   */
  findLineBoundaryLeft(startFrom: number): number {
    let offset = 0,
      index = startFrom - 1;

    while (!/\n/.test(this._text[index]) && index > -1) {
      offset++;
      index--;
    }

    return startFrom - offset;
  }

  /**
   * Find new selection index representing end of current line according to current selection index
   * @param {Number} startFrom Current selection index
   * @return {Number} New selection index
   */
  findLineBoundaryRight(startFrom: number): number {
    let offset = 0,
      index = startFrom;

    while (!/\n/.test(this._text[index]) && index < this._text.length) {
      offset++;
      index++;
    }

    return startFrom + offset;
  }

  /**
   * Finds index corresponding to beginning or end of a word
   * @param {Number} selectionStart Index of a character
   * @param {Number} direction 1 or -1
   * @return {Number} Index of the beginning or end of a word
   */
  searchWordBoundary(selectionStart: number, direction: 1 | -1): number {
    const text = this._text;
    // if we land on a space we move the cursor backwards
    // if we are searching boundary end we move the cursor backwards ONLY if we don't land on a line break
    let index =
        selectionStart > 0 &&
        this._reSpace.test(text[selectionStart]) &&
        (direction === -1 || !reNewline.test(text[selectionStart - 1]))
          ? selectionStart - 1
          : selectionStart,
      _char = text[index];
    while (index > 0 && index < text.length && !reNonWord.test(_char)) {
      index += direction;
      _char = text[index];
    }
    if (direction === -1 && reNonWord.test(_char)) {
      index++;
    }
    return index;
  }

  /**
   * Selects the word that contains the char at index selectionStart
   * @param {Number} selectionStart Index of a character
   */
  selectWord(selectionStart?: number) {
    selectionStart = selectionStart ?? this.selectionStart;
    // search backwards
    const newSelectionStart = this.searchWordBoundary(selectionStart, -1),
      // search forward
      newSelectionEnd = Math.max(
        newSelectionStart,
        this.searchWordBoundary(selectionStart, 1),
      );

    this.selectionStart = newSelectionStart;
    this.selectionEnd = newSelectionEnd;
    this._fireSelectionChanged();
    this._updateTextarea();
    // remove next major, for now it renders twice :(
    this.renderCursorOrSelection();
  }

  /**
   * Selects the line that contains selectionStart
   * @param {Number} selectionStart Index of a character
   */
  selectLine(selectionStart?: number) {
    selectionStart = selectionStart ?? this.selectionStart;
    const newSelectionStart = this.findLineBoundaryLeft(selectionStart),
      newSelectionEnd = this.findLineBoundaryRight(selectionStart);

    this.selectionStart = newSelectionStart;
    this.selectionEnd = newSelectionEnd;
    this._fireSelectionChanged();
    this._updateTextarea();
  }

  /**
   * Enters editing state
   */
  enterEditing(e?: TPointerEvent) {
    if (this.isEditing || !this.editable) {
      return;
    }
    this.enterEditingImpl();
    this.fire('editing:entered', e ? { e } : undefined);
    this._fireSelectionChanged();
    if (this.canvas) {
      this.canvas.fire('text:editing:entered', {
        target: this as unknown as IText,
        e,
      });
      this.canvas.requestRenderAll();
    }
  }

  /**
   * runs the actual logic that enter from editing state, see {@link enterEditing}
   */
  enterEditingImpl() {
    if (this.canvas) {
      this.canvas.calcOffset();
      this.canvas.textEditingManager.exitTextEditing();
    }

    this.isEditing = true;

    this.initHiddenTextarea();
    this.hiddenTextarea!.focus();
    this.hiddenTextarea!.value = this.text;
    this._updateTextarea();
    this._saveEditingProps();
    this._setEditingProps();
    this._textBeforeEdit = this.text;

    this._tick();
  }

  /**
   * called by {@link Canvas#textEditingManager}
   */
  updateSelectionOnMouseMove(e: TPointerEvent) {
    if (this.getActiveControl()) {
      return;
    }

    const el = this.hiddenTextarea!;
    // regain focus
    getDocumentFromElement(el).activeElement !== el && el.focus();

    const newSelectionStart = this.getSelectionStartFromPointer(e),
      currentStart = this.selectionStart,
      currentEnd = this.selectionEnd;
    if (
      (newSelectionStart !== this.__selectionStartOnMouseDown ||
        currentStart === currentEnd) &&
      (currentStart === newSelectionStart || currentEnd === newSelectionStart)
    ) {
      return;
    }
    if (newSelectionStart > this.__selectionStartOnMouseDown) {
      this.selectionStart = this.__selectionStartOnMouseDown;
      this.selectionEnd = newSelectionStart;
    } else {
      this.selectionStart = newSelectionStart;
      this.selectionEnd = this.__selectionStartOnMouseDown;
    }
    if (
      this.selectionStart !== currentStart ||
      this.selectionEnd !== currentEnd
    ) {
      this._fireSelectionChanged();
      this._updateTextarea();
      this.renderCursorOrSelection();
    }
  }

  /**
   * @private
   */
  _setEditingProps() {
    this.hoverCursor = 'text';

    if (this.canvas) {
      this.canvas.defaultCursor = this.canvas.moveCursor = 'text';
    }

    this.borderColor = this.editingBorderColor;
    this.hasControls = this.selectable = false;
    this.lockMovementX = this.lockMovementY = true;
  }

  /**
   * convert from textarea to grapheme indexes
   */
  fromStringToGraphemeSelection(start: number, end: number, text: string) {
    const smallerTextStart = text.slice(0, start),
      graphemeStart = this.graphemeSplit(smallerTextStart).length;
    if (start === end) {
      return { selectionStart: graphemeStart, selectionEnd: graphemeStart };
    }
    const smallerTextEnd = text.slice(start, end),
      graphemeEnd = this.graphemeSplit(smallerTextEnd).length;
    return {
      selectionStart: graphemeStart,
      selectionEnd: graphemeStart + graphemeEnd,
    };
  }

  /**
   * convert from fabric to textarea values
   */
  fromGraphemeToStringSelection(
    start: number,
    end: number,
    graphemes: string[],
  ) {
    const smallerTextStart = graphemes.slice(0, start),
      graphemeStart = smallerTextStart.join('').length;
    if (start === end) {
      return { selectionStart: graphemeStart, selectionEnd: graphemeStart };
    }
    const smallerTextEnd = graphemes.slice(start, end),
      graphemeEnd = smallerTextEnd.join('').length;
    return {
      selectionStart: graphemeStart,
      selectionEnd: graphemeStart + graphemeEnd,
    };
  }

  /**
   * @private
   */
  _updateTextarea() {
    this.cursorOffsetCache = {};
    if (!this.hiddenTextarea) {
      return;
    }
    if (!this.inCompositionMode) {
      const newSelection = this.fromGraphemeToStringSelection(
        this.selectionStart,
        this.selectionEnd,
        this._text,
      );
      this.hiddenTextarea.selectionStart = newSelection.selectionStart;
      this.hiddenTextarea.selectionEnd = newSelection.selectionEnd;
    }
    this.updateTextareaPosition();
  }

  /**
   * This function updates the text value from the hidden textarea and recalculates the text bounding box
   * size and position.
   * It is called by fabricJS internals, do not use it directly.
   * @private
   */
  updateFromTextArea() {
    const { hiddenTextarea, direction, textAlign, inCompositionMode } = this;
    if (!hiddenTextarea) {
      return;
    }
    // we want to anchor the textarea position depending on text alignment
    // or in case of text justify depending on ltr/rtl direction.
    // this.textAlign.replace('justify-', '') leverages the fact that our textAlign values all contain the word left/right/center,
    // that match the originX values.
    const anchorX: TOriginX =
      textAlign !== JUSTIFY
        ? (textAlign.replace('justify-', '') as TOriginX)
        : direction === LTR
          ? LEFT
          : RIGHT;
    const originalPosition = this.getPositionByOrigin(anchorX, 'top');
    this.cursorOffsetCache = {};
    this.text = hiddenTextarea.value;
    this.set('dirty', true);
    this.initDimensions();
    this.setPositionByOrigin(originalPosition, anchorX, 'top');
    this.setCoords();
    const newSelection = this.fromStringToGraphemeSelection(
      hiddenTextarea.selectionStart,
      hiddenTextarea.selectionEnd,
      hiddenTextarea.value,
    );
    this.selectionEnd = this.selectionStart = newSelection.selectionEnd;
    if (!inCompositionMode) {
      this.selectionStart = newSelection.selectionStart;
    }
    this.updateTextareaPosition();
  }

  /**
   * @private
   */
  updateTextareaPosition() {
    if (this.selectionStart === this.selectionEnd) {
      const style = this._calcTextareaPosition();
      this.hiddenTextarea!.style.left = style.left;
      this.hiddenTextarea!.style.top = style.top;
    }
  }

  /**
   * @private
   * @return {Object} style contains style for hiddenTextarea
   */
  _calcTextareaPosition() {
    if (!this.canvas) {
      return { left: '1px', top: '1px' };
    }
    const desiredPosition = this.inCompositionMode
        ? this.compositionStart
        : this.selectionStart,
      boundaries = this._getCursorBoundaries(desiredPosition),
      cursorLocation = this.get2DCursorLocation(desiredPosition),
      lineIndex = cursorLocation.lineIndex,
      charIndex = cursorLocation.charIndex,
      charHeight =
        this.getValueOfPropertyAt(lineIndex, charIndex, 'fontSize') *
        this.lineHeight,
      leftOffset = boundaries.leftOffset,
      retinaScaling = this.getCanvasRetinaScaling(),
      upperCanvas = this.canvas.upperCanvasEl,
      upperCanvasWidth = upperCanvas.width / retinaScaling,
      upperCanvasHeight = upperCanvas.height / retinaScaling,
      maxWidth = upperCanvasWidth - charHeight,
      maxHeight = upperCanvasHeight - charHeight;

    const p = new Point(
      boundaries.left + leftOffset,
      boundaries.top + boundaries.topOffset + charHeight,
    )
      .transform(this.calcTransformMatrix())
      .transform(this.canvas.viewportTransform)
      .multiply(
        new Point(
          upperCanvas.clientWidth / upperCanvasWidth,
          upperCanvas.clientHeight / upperCanvasHeight,
        ),
      );

    if (p.x < 0) {
      p.x = 0;
    }
    if (p.x > maxWidth) {
      p.x = maxWidth;
    }
    if (p.y < 0) {
      p.y = 0;
    }
    if (p.y > maxHeight) {
      p.y = maxHeight;
    }

    // add canvas offset on document
    p.x += this.canvas._offset.left;
    p.y += this.canvas._offset.top;

    return {
      left: `${p.x}px`,
      top: `${p.y}px`,
      fontSize: `${charHeight}px`,
      charHeight: charHeight,
    };
  }

  /**
   * @private
   */
  _saveEditingProps() {
    this._savedProps = {
      hasControls: this.hasControls,
      borderColor: this.borderColor,
      lockMovementX: this.lockMovementX,
      lockMovementY: this.lockMovementY,
      hoverCursor: this.hoverCursor,
      selectable: this.selectable,
      defaultCursor: this.canvas && this.canvas.defaultCursor,
      moveCursor: this.canvas && this.canvas.moveCursor,
    };
  }

  /**
   * @private
   */
  _restoreEditingProps() {
    if (!this._savedProps) {
      return;
    }

    this.hoverCursor = this._savedProps.hoverCursor;
    this.hasControls = this._savedProps.hasControls;
    this.borderColor = this._savedProps.borderColor;
    this.selectable = this._savedProps.selectable;
    this.lockMovementX = this._savedProps.lockMovementX;
    this.lockMovementY = this._savedProps.lockMovementY;

    if (this.canvas) {
      this.canvas.defaultCursor =
        this._savedProps.defaultCursor || this.canvas.defaultCursor;
      this.canvas.moveCursor =
        this._savedProps.moveCursor || this.canvas.moveCursor;
    }

    delete this._savedProps;
  }

  /**
   * runs the actual logic that exits from editing state, see {@link exitEditing}
   * But it does not fire events
   */
  exitEditingImpl() {
    const hiddenTextarea = this.hiddenTextarea;
    this.selected = false;
    this.isEditing = false;

    if (hiddenTextarea) {
      hiddenTextarea.blur && hiddenTextarea.blur();
      hiddenTextarea.parentNode &&
        hiddenTextarea.parentNode.removeChild(hiddenTextarea);
    }
    this.hiddenTextarea = null;
    this.abortCursorAnimation();
    this.selectionStart !== this.selectionEnd && this.clearContextTop();
    this.selectionEnd = this.selectionStart;
    this._restoreEditingProps();
    if (this._forceClearCache) {
      this.initDimensions();
      this.setCoords();
    }
  }

  /**
   * Exits from editing state and fires relevant events
   */
  exitEditing() {
    const isTextChanged = this._textBeforeEdit !== this.text;
    this.exitEditingImpl();

    this.fire('editing:exited');
    isTextChanged && this.fire(MODIFIED);
    if (this.canvas) {
      this.canvas.fire('text:editing:exited', {
        target: this as unknown as IText,
      });
      // todo: evaluate add an action to this event
      isTextChanged && this.canvas.fire('object:modified', { target: this });
    }
    return this;
  }

  /**
   * @private
   */
  _removeExtraneousStyles() {
    for (const prop in this.styles) {
      if (!this._textLines[prop as unknown as number]) {
        delete this.styles[prop];
      }
    }
  }

  /**
   * remove and reflow a style block from start to end.
   * @param {Number} start linear start position for removal (included in removal)
   * @param {Number} end linear end position for removal ( excluded from removal )
   */
  removeStyleFromTo(start: number, end: number) {
    const { lineIndex: lineStart, charIndex: charStart } =
        this.get2DCursorLocation(start, true),
      { lineIndex: lineEnd, charIndex: charEnd } = this.get2DCursorLocation(
        end,
        true,
      );
    if (lineStart !== lineEnd) {
      // step1 remove the trailing of lineStart
      if (this.styles[lineStart]) {
        for (
          let i = charStart;
          i < this._unwrappedTextLines[lineStart].length;
          i++
        ) {
          delete this.styles[lineStart][i];
        }
      }
      // step2 move the trailing of lineEnd to lineStart if needed
      if (this.styles[lineEnd]) {
        for (
          let i = charEnd;
          i < this._unwrappedTextLines[lineEnd].length;
          i++
        ) {
          const styleObj = this.styles[lineEnd][i];
          if (styleObj) {
            this.styles[lineStart] || (this.styles[lineStart] = {});
            this.styles[lineStart][charStart + i - charEnd] = styleObj;
          }
        }
      }
      // step3 detects lines will be completely removed.
      for (let i = lineStart + 1; i <= lineEnd; i++) {
        delete this.styles[i];
      }
      // step4 shift remaining lines.
      this.shiftLineStyles(lineEnd, lineStart - lineEnd);
    } else {
      // remove and shift left on the same line
      if (this.styles[lineStart]) {
        const styleObj = this.styles[lineStart];
        const diff = charEnd - charStart;
        for (let i = charStart; i < charEnd; i++) {
          delete styleObj[i];
        }
        for (const char in this.styles[lineStart]) {
          const numericChar = parseInt(char, 10);
          if (numericChar >= charEnd) {
            styleObj[numericChar - diff] = styleObj[char];
            delete styleObj[char];
          }
        }
      }
    }
  }

  /**
   * Shifts line styles up or down
   * @param {Number} lineIndex Index of a line
   * @param {Number} offset Can any number?
   */
  shiftLineStyles(lineIndex: number, offset: number) {
    const clonedStyles = Object.assign({}, this.styles);
    for (const line in this.styles) {
      const numericLine = parseInt(line, 10);
      if (numericLine > lineIndex) {
        this.styles[numericLine + offset] = clonedStyles[numericLine];
        if (!clonedStyles[numericLine - offset]) {
          delete this.styles[numericLine];
        }
      }
    }
  }

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
  insertNewlineStyleObject(
    lineIndex: number,
    charIndex: number,
    qty: number,
    copiedStyle?: { [index: number]: TextStyleDeclaration },
  ) {
    const newLineStyles: { [index: number]: TextStyleDeclaration } = {};
    const originalLineLength = this._unwrappedTextLines[lineIndex].length;
    const isEndOfLine = originalLineLength === charIndex;

    let someStyleIsCarryingOver = false;
    qty || (qty = 1);
    this.shiftLineStyles(lineIndex, qty);
    const currentCharStyle = this.styles[lineIndex]
      ? this.styles[lineIndex][charIndex === 0 ? charIndex : charIndex - 1]
      : undefined;

    // we clone styles of all chars
    // after cursor onto the current line
    for (const index in this.styles[lineIndex]) {
      const numIndex = parseInt(index, 10);
      if (numIndex >= charIndex) {
        someStyleIsCarryingOver = true;
        newLineStyles[numIndex - charIndex] = this.styles[lineIndex][index];
        // remove lines from the previous line since they're on a new line now
        if (!(isEndOfLine && charIndex === 0)) {
          delete this.styles[lineIndex][index];
        }
      }
    }
    let styleCarriedOver = false;
    if (someStyleIsCarryingOver && !isEndOfLine) {
      // if is end of line, the extra style we copied
      // is probably not something we want
      this.styles[lineIndex + qty] = newLineStyles;
      styleCarriedOver = true;
    }
    if (styleCarriedOver || originalLineLength > charIndex) {
      // skip the last line of since we already prepared it.
      // or contains text without style that we don't want to style
      // just because it changed lines
      qty--;
    }
    // for the all the lines or all the other lines
    // we clone current char style onto the next (otherwise empty) line
    while (qty > 0) {
      if (copiedStyle && copiedStyle[qty - 1]) {
        this.styles[lineIndex + qty] = {
          0: { ...copiedStyle[qty - 1] },
        };
      } else if (currentCharStyle) {
        this.styles[lineIndex + qty] = {
          0: { ...currentCharStyle },
        };
      } else {
        delete this.styles[lineIndex + qty];
      }
      qty--;
    }
    this._forceClearCache = true;
  }

  /**
   * Inserts style object for a given line/char index
   * @param {Number} lineIndex Index of a line
   * @param {Number} charIndex Index of a char
   * @param {Number} quantity number Style object to insert, if given
   * @param {Array} copiedStyle array of style objects
   */
  insertCharStyleObject(
    lineIndex: number,
    charIndex: number,
    quantity: number,
    copiedStyle?: TextStyleDeclaration[],
  ) {
    if (!this.styles) {
      this.styles = {};
    }
    const currentLineStyles = this.styles[lineIndex],
      currentLineStylesCloned = currentLineStyles
        ? { ...currentLineStyles }
        : {};

    quantity || (quantity = 1);
    // shift all char styles by quantity forward
    // 0,1,2,3 -> (charIndex=2) -> 0,1,3,4 -> (insert 2) -> 0,1,2,3,4
    for (const index in currentLineStylesCloned) {
      const numericIndex = parseInt(index, 10);
      if (numericIndex >= charIndex) {
        currentLineStyles[numericIndex + quantity] =
          currentLineStylesCloned[numericIndex];
        // only delete the style if there was nothing moved there
        if (!currentLineStylesCloned[numericIndex - quantity]) {
          delete currentLineStyles[numericIndex];
        }
      }
    }
    this._forceClearCache = true;
    if (copiedStyle) {
      while (quantity--) {
        if (!Object.keys(copiedStyle[quantity]).length) {
          continue;
        }
        if (!this.styles[lineIndex]) {
          this.styles[lineIndex] = {};
        }
        this.styles[lineIndex][charIndex + quantity] = {
          ...copiedStyle[quantity],
        };
      }
      return;
    }
    if (!currentLineStyles) {
      return;
    }
    const newStyle = currentLineStyles[charIndex ? charIndex - 1 : 1];
    while (newStyle && quantity--) {
      this.styles[lineIndex][charIndex + quantity] = { ...newStyle };
    }
  }

  /**
   * Inserts style object(s)
   * @param {Array} insertedText Characters at the location where style is inserted
   * @param {Number} start cursor index for inserting style
   * @param {Array} [copiedStyle] array of style objects to insert.
   */
  insertNewStyleBlock(
    insertedText: string[],
    start: number,
    copiedStyle?: TextStyleDeclaration[],
  ) {
    const cursorLoc = this.get2DCursorLocation(start, true),
      addedLines = [0];
    let linesLength = 0;
    // get an array of how many char per lines are being added.
    for (let i = 0; i < insertedText.length; i++) {
      if (insertedText[i] === '\n') {
        linesLength++;
        addedLines[linesLength] = 0;
      } else {
        addedLines[linesLength]++;
      }
    }
    // for the first line copy the style from the current char position.
    if (addedLines[0] > 0) {
      this.insertCharStyleObject(
        cursorLoc.lineIndex,
        cursorLoc.charIndex,
        addedLines[0],
        copiedStyle,
      );
      copiedStyle = copiedStyle && copiedStyle.slice(addedLines[0] + 1);
    }
    linesLength &&
      this.insertNewlineStyleObject(
        cursorLoc.lineIndex,
        cursorLoc.charIndex + addedLines[0],
        linesLength,
      );
    let i;
    for (i = 1; i < linesLength; i++) {
      if (addedLines[i] > 0) {
        this.insertCharStyleObject(
          cursorLoc.lineIndex + i,
          0,
          addedLines[i],
          copiedStyle,
        );
      } else if (copiedStyle) {
        // this test is required in order to close #6841
        // when a pasted buffer begins with a newline then
        // this.styles[cursorLoc.lineIndex + i] and copiedStyle[0]
        // may be undefined for some reason
        if (this.styles[cursorLoc.lineIndex + i] && copiedStyle[0]) {
          this.styles[cursorLoc.lineIndex + i][0] = copiedStyle[0];
        }
      }
      copiedStyle = copiedStyle && copiedStyle.slice(addedLines[i] + 1);
    }
    if (addedLines[i] > 0) {
      this.insertCharStyleObject(
        cursorLoc.lineIndex + i,
        0,
        addedLines[i],
        copiedStyle,
      );
    }
  }

  /**
   * Removes characters from start/end
   * start/end ar per grapheme position in _text array.
   *
   * @param {Number} start
   * @param {Number} end default to start + 1
   */
  removeChars(start: number, end: number = start + 1) {
    this.removeStyleFromTo(start, end);
    this._text.splice(start, end - start);
    this.text = this._text.join('');
    this.set('dirty', true);
    this.initDimensions();
    this.setCoords();
    this._removeExtraneousStyles();
  }

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
  insertChars(
    text: string,
    style: TextStyleDeclaration[] | undefined,
    start: number,
    end: number = start,
  ) {
    if (end > start) {
      this.removeStyleFromTo(start, end);
    }
    const graphemes = this.graphemeSplit(text);
    this.insertNewStyleBlock(graphemes, start, style);
    this._text = [
      ...this._text.slice(0, start),
      ...graphemes,
      ...this._text.slice(end),
    ];
    this.text = this._text.join('');
    this.set('dirty', true);
    this.initDimensions();
    this.setCoords();
    this._removeExtraneousStyles();
  }

  /**
   * Set the selectionStart and selectionEnd according to the new position of cursor
   * mimic the key - mouse navigation when shift is pressed.
   */
  setSelectionStartEndWithShift(
    start: number,
    end: number,
    newSelection: number,
  ) {
    if (newSelection <= start) {
      if (end === start) {
        this._selectionDirection = LEFT;
      } else if (this._selectionDirection === RIGHT) {
        this._selectionDirection = LEFT;
        this.selectionEnd = start;
      }
      this.selectionStart = newSelection;
    } else if (newSelection > start && newSelection < end) {
      if (this._selectionDirection === RIGHT) {
        this.selectionEnd = newSelection;
      } else {
        this.selectionStart = newSelection;
      }
    } else {
      // newSelection is > selection start and end
      if (end === start) {
        this._selectionDirection = RIGHT;
      } else if (this._selectionDirection === LEFT) {
        this._selectionDirection = RIGHT;
        this.selectionStart = end;
      }
      this.selectionEnd = newSelection;
    }
  }
}
