import type {
  ObjectEvents,
  TPointerEvent,
  TPointerEventInfo,
} from '../../EventTypeDefs';
import { Point } from '../../Point';
import type { FabricObject } from '../Object/Object';
import { Text } from '../Text/Text';
import { animate } from '../../util/animation/animate';
import type { TOnAnimationChangeCallback } from '../../util/animation/types';
import type { ValueAnimation } from '../../util/animation/ValueAnimation';
import type { TextStyleDeclaration } from '../Text/TextStyles';
import type { SerializedTextProps, TextProps } from '../Text/Text';
import type { TProps } from '../Object/types';
import { getDocumentFromElement } from '../../util/dom_misc';
import { LEFT, RIGHT, reNewline } from '../../constants';

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
  tripleclick: TPointerEventInfo;
  'editing:entered': never | { e: TPointerEvent };
  'editing:exited': never;
};

export abstract class ITextBehavior<
  Props extends TProps<TextProps> = Partial<TextProps>,
  SProps extends SerializedTextProps = SerializedTextProps,
  EventSpec extends ITextEvents = ITextEvents
> extends Text<Props, SProps, EventSpec> {
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
  protected declare inCompositionMode: boolean;

  protected declare _reSpace: RegExp;
  private declare _currentTickState?: ValueAnimation;
  private declare _currentTickCompleteState?: ValueAnimation;
  protected _currentCursorOpacity = 1;
  private declare _textBeforeEdit: string;
  protected declare __selectionStartOnMouseDown: number;

  protected declare selected: boolean;
  protected declare cursorOffsetCache: { left?: number; top?: number };
  protected declare _savedProps?: {
    hasControls: boolean;
    borderColor: string;
    lockMovementX: boolean;
    lockMovementY: boolean;
    selectable: boolean;
    hoverCursor: CSSStyleDeclaration['cursor'] | null;
    defaultCursor?: CSSStyleDeclaration['cursor'];
    moveCursor?: CSSStyleDeclaration['cursor'];
  };
  protected declare _selectionDirection: 'left' | 'right' | null;

  abstract initHiddenTextarea(): void;
  abstract _fireSelectionChanged(): void;
  abstract renderCursorOrSelection(): void;
  abstract getSelectionStartFromPointer(e: TPointerEvent): number;
  abstract _getCursorBoundaries(
    index: number,
    skipCaching?: boolean
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
    onComplete?: TOnAnimationChangeCallback<number, void>;
  }) {
    return animate({
      startValue: this._currentCursorOpacity,
      endValue: toValue,
      duration,
      delay,
      onComplete,
      abort: () => {
        return (
          !this.canvas ||
          // we do not want to animate a selection, only cursor
          this.selectionStart !== this.selectionEnd
        );
      },
      onChange: (value) => {
        this._currentCursorOpacity = value;
        this.renderCursorOrSelection();
      },
    });
  }

  private _tick(delay?: number) {
    this._currentTickState = this._animateCursor({
      toValue: 1,
      duration: this.cursorDuration,
      delay,
      onComplete: this._onTickComplete,
    });
  }

  private _onTickComplete() {
    this._currentTickCompleteState?.abort();
    this._currentTickCompleteState = this._animateCursor({
      toValue: 0,
      duration: this.cursorDuration / 2,
      delay: 100,
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
      }
    );

    this._currentCursorOpacity = 1;

    //  make sure we clear context even if instance is not editing
    if (shouldClear) {
      this.clearContextTop();
    }
  }

  restartCursorIfNeeded() {
    if (
      [this._currentTickState, this._currentTickCompleteState].some(
        (cursorAnimation) => !cursorAnimation || cursorAnimation.isDone()
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
   * Selects a word based on the index
   * @param {Number} selectionStart Index of a character
   */
  selectWord(selectionStart: number) {
    selectionStart = selectionStart || this.selectionStart;
    // search backwards
    const newSelectionStart = this.searchWordBoundary(selectionStart, -1),
      // search forward
      newSelectionEnd = Math.max(
        newSelectionStart,
        this.searchWordBoundary(selectionStart, 1)
      );

    this.selectionStart = newSelectionStart;
    this.selectionEnd = newSelectionEnd;
    this._fireSelectionChanged();
    this._updateTextarea();
    this.renderCursorOrSelection();
  }

  /**
   * Selects a line based on the index
   * @param {Number} selectionStart Index of a character
   */
  selectLine(selectionStart: number) {
    selectionStart = selectionStart || this.selectionStart;
    const newSelectionStart = this.findLineBoundaryLeft(selectionStart),
      newSelectionEnd = this.findLineBoundaryRight(selectionStart);

    this.selectionStart = newSelectionStart;
    this.selectionEnd = newSelectionEnd;
    this._fireSelectionChanged();
    this._updateTextarea();
    return this;
  }

  /**
   * Enters editing state
   */
  enterEditing(e: TPointerEvent) {
    if (this.isEditing || !this.editable) {
      return;
    }
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
    this.fire('editing:entered', { e });
    this._fireSelectionChanged();
    if (this.canvas) {
      // @ts-expect-error in reality it is an IText instance
      this.canvas.fire('text:editing:entered', { target: this, e });
      this.canvas.requestRenderAll();
    }
  }

  /**
   * called by {@link canvas#textEditingManager}
   */
  updateSelectionOnMouseMove(e: TPointerEvent) {
    if (this.__corner) {
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
    graphemes: string[]
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
        this._text
      );
      this.hiddenTextarea.selectionStart = newSelection.selectionStart;
      this.hiddenTextarea.selectionEnd = newSelection.selectionEnd;
    }
    this.updateTextareaPosition();
  }

  /**
   * @private
   */
  updateFromTextArea() {
    if (!this.hiddenTextarea) {
      return;
    }
    this.cursorOffsetCache = {};
    const textarea = this.hiddenTextarea;
    this.text = textarea.value;
    this.set('dirty', true);
    this.initDimensions();
    this.setCoords();
    const newSelection = this.fromStringToGraphemeSelection(
      textarea.selectionStart,
      textarea.selectionEnd,
      textarea.value
    );
    this.selectionEnd = this.selectionStart = newSelection.selectionEnd;
    if (!this.inCompositionMode) {
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
      boundaries.top + boundaries.topOffset + charHeight
    )
      .transform(this.calcTransformMatrix())
      .transform(this.canvas.viewportTransform)
      .multiply(
        new Point(
          upperCanvas.clientWidth / upperCanvasWidth,
          upperCanvas.clientHeight / upperCanvasHeight
        )
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
   */
  protected _exitEditing() {
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
  }

  /**
   * Exits from editing state and fires relevant events
   */
  exitEditing() {
    const isTextChanged = this._textBeforeEdit !== this.text;
    this._exitEditing();
    this.selectionEnd = this.selectionStart;
    this._restoreEditingProps();
    if (this._forceClearCache) {
      this.initDimensions();
      this.setCoords();
    }
    this.fire('editing:exited');
    isTextChanged && this.fire('modified');
    if (this.canvas) {
      // @ts-expect-error in reality it is an IText instance
      this.canvas.fire('text:editing:exited', { target: this });
      isTextChanged && this.canvas.fire('object:modified', { target: this });
    }
    return this;
  }

  /**
   * remove and reflow a style block from start to end.
   * @param {Number} start linear start position for removal (included in removal)
   * @param {Number} end linear end position for removal ( excluded from removal )
   */
  removeStyleFromTo(start: number, end: number) {
    this.styleManager.splice({ offset: start }, end - start);
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
    styles: TextStyleDeclaration[] | undefined,
    start: number,
    end: number = start
  ) {
    if (end > start) {
      this.removeStyleFromTo(start, end);
    }
    const graphemes = this.graphemeSplit(text);
    this.styleManager.splice({ offset: start }, end - start, styles);
    this._text = [
      ...this._text.slice(0, start),
      ...graphemes,
      ...this._text.slice(end),
    ];
    this.text = this._text.join('');
    this.set('dirty', true);
    this.initDimensions();
    this.setCoords();
  }

  /**
   * Set the selectionStart and selectionEnd according to the new position of cursor
   * mimic the key - mouse navigation when shift is pressed.
   */
  setSelectionStartEndWithShift(
    start: number,
    end: number,
    newSelection: number
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
