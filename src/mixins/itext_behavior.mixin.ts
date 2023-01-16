// @ts-nocheck

import { getEnv } from '../env';
import {
  DragEventData,
  DropEventData,
  ObjectEvents,
  TEvent,
  TPointerEvent,
} from '../EventTypeDefs';
import { Point } from '../point.class';
import type { FabricObject } from '../shapes/Object/Object';
import { Text } from '../shapes/text.class';
import { animate } from '../util/animation/animate';
import { TOnAnimationChangeCallback } from '../util/animation/types';
import type { ValueAnimation } from '../util/animation/ValueAnimation';
import { setStyle } from '../util/dom_style';
import { clone } from '../util/lang_object';
import { createCanvasElement } from '../util/misc/dom';
import { isIdentityMatrix } from '../util/misc/matrix';
import { TextStyleDeclaration } from './text_style.mixin';

// extend this regex to support non english languages
const reNonWord = /[ \n\.,;!\?\-]/;

export abstract class ITextBehaviorMixin<
  EventSpec extends ObjectEvents
> extends Text<EventSpec> {
  declare abstract isEditing: boolean;
  declare abstract cursorDelay: number;
  declare abstract selectionStart: number;
  declare abstract selectionEnd: number;
  declare abstract cursorDuration: number;
  declare abstract editable: boolean;
  declare abstract editingBorderColor: string;

  declare abstract compositionStart: number;
  declare abstract compositionEnd: number;

  declare abstract hiddenTextarea: HTMLTextAreaElement;

  /**
   * Helps determining when the text is in composition, so that the cursor
   * rendering is altered.
   */
  protected declare inCompositionMode: boolean;

  protected declare _reSpace: RegExp;
  private declare _currentTickState?: ValueAnimation;
  private declare _currentTickCompleteState?: ValueAnimation;
  protected declare _currentCursorOpacity: number;
  private declare _textBeforeEdit: string;
  protected declare __selectionStartOnMouseDown: number;
  private declare __dragImageDisposer: VoidFunction;
  private declare __dragStartFired: boolean;
  protected declare __isDragging: boolean;
  protected declare __dragStartSelection: {
    selectionStart: number;
    selectionEnd: number;
  };
  protected declare __isDraggingOver: boolean;
  protected declare selected: boolean;
  protected declare __lastSelected: boolean;
  protected declare cursorOffsetCache: { left?: number; top?: number };
  protected declare _savedProps: {
    hasControls: boolean;
    borderColor: string;
    lockMovementX: boolean;
    lockMovementY: boolean;
    selectable: boolean;
    hoverCursor: string | null;
    defaultCursor: string;
    moveCursor: CSSStyleDeclaration['cursor'];
  };
  protected declare _selectionDirection: 'left' | 'right' | null;

  abstract initHiddenTextarea(): void;
  abstract initCursorSelectionHandlers(): void;
  abstract initDoubleClickSimulation(): void;
  abstract _fireSelectionChanged(): void;
  abstract renderCursorOrSelection(): void;
  abstract getSelectionStartFromPointer(e: TPointerEvent): number;
  abstract _getCursorBoundaries(
    index: number,
    skipCaching: boolean
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
    this.initCursorSelectionHandlers();
    this.initDoubleClickSimulation();
    this._tick = this._tick.bind(this);
    this._onTickComplete = this._onTickComplete.bind(this);
    this.updateSelectionOnMouseMove =
      this.updateSelectionOnMouseMove.bind(this);
    this.dragEnterHandler = this.dragEnterHandler.bind(this);
    this.dragOverHandler = this.dragOverHandler.bind(this);
    this.dragLeaveHandler = this.dragLeaveHandler.bind(this);
    this.dragEndHandler = this.dragEndHandler.bind(this);
    this.dropHandler = this.dropHandler.bind(this);
    this.on('dragenter', this.dragEnterHandler);
    this.on('dragover', this.dragOverHandler);
    this.on('dragleave', this.dragLeaveHandler);
    this.on('dragend', this.dragEndHandler);
    this.on('drop', this.dropHandler);
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
  searchWordBoundary(selectionStart: number, direction: number): number {
    const text = this._text;
    let index = this._reSpace.test(text[selectionStart])
        ? selectionStart - 1
        : selectionStart,
      _char = text[index];

    while (!reNonWord.test(_char) && index > 0 && index < text.length) {
      index += direction;
      _char = text[index];
    }
    if (reNonWord.test(_char)) {
      index += direction === 1 ? 0 : 1;
    }
    return index;
  }

  /**
   * Selects a word based on the index
   * @param {Number} selectionStart Index of a character
   */
  selectWord(selectionStart: number) {
    selectionStart = selectionStart || this.selectionStart;
    const newSelectionStart = this.searchWordBoundary(
        selectionStart,
        -1
      ) /* search backwards */,
      newSelectionEnd = this.searchWordBoundary(
        selectionStart,
        1
      ); /* search forward */

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
  enterEditing(e) {
    if (this.isEditing || !this.editable) {
      return;
    }
    if (this.canvas) {
      this.canvas.calcOffset();
      this.canvas.textEditingManager.exitTextEditing();
    }

    this.isEditing = true;

    this.initHiddenTextarea(e);
    this.hiddenTextarea.focus();
    this.hiddenTextarea.value = this.text;
    this._updateTextarea();
    this._saveEditingProps();
    this._setEditingProps();
    this._textBeforeEdit = this.text;

    this._tick();
    this.fire('editing:entered');
    this._fireSelectionChanged();
    if (this.canvas) {
      this.canvas.fire('text:editing:entered', { target: this });
      this.canvas.requestRenderAll();
    }
  }

  /**
   * called by {@link canvas#textEditingManager}
   */
  updateSelectionOnMouseMove(e: TPointerEvent) {
    // regain focus
    getEnv().document.activeElement !== this.hiddenTextarea &&
      this.hiddenTextarea.focus();

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
   * Override to customize the drag image
   * https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/setDragImage
   */
  setDragImage(
    e: DragEvent,
    {
      selectionStart,
      selectionEnd,
    }: {
      selectionStart: number;
      selectionEnd: number;
    }
  ) {
    const flipFactor = new Point(this.flipX ? -1 : 1, this.flipY ? -1 : 1);
    const boundaries = this._getCursorBoundaries(selectionStart);
    const selectionPosition = new Point(
      boundaries.left + boundaries.leftOffset,
      boundaries.top + boundaries.topOffset
    ).multiply(flipFactor);
    const pos = selectionPosition.transform(this.calcTransformMatrix());
    const pointer = this.canvas.getPointer(e);
    const diff = pointer.subtract(pos);
    const enableRetinaScaling = this.canvas._isRetinaScaling();
    const retinaScaling = this.getCanvasRetinaScaling();
    const bbox = this.getBoundingRect(true);
    const correction = pos.subtract(new Point(bbox.left, bbox.top));
    const vpt = this.canvas.viewportTransform;
    const offset = correction.add(diff).transform(vpt, true);
    //  prepare instance for drag image snapshot by making all non selected text invisible
    const bgc = this.backgroundColor;
    const styles = clone(this.styles, true);
    delete this.backgroundColor;
    const styleOverride = {
      stroke: 'transparent',
      fill: 'transparent',
      textBackgroundColor: 'transparent',
    };
    this.setSelectionStyles(styleOverride, 0, selectionStart);
    this.setSelectionStyles(styleOverride, selectionEnd, this.text.length);
    let dragImage = this.toCanvasElement({
      enableRetinaScaling,
    });
    // restore values
    this.backgroundColor = bgc;
    this.styles = styles;
    //  handle retina scaling and vpt
    if (retinaScaling > 1 || !isIdentityMatrix(vpt)) {
      const dragImageCanvas = createCanvasElement();
      const size = new Point(dragImage.width, dragImage.height)
        .scalarDivide(retinaScaling)
        .transform(vpt, true);
      dragImageCanvas.width = size.x;
      dragImageCanvas.height = size.y;
      const ctx = dragImageCanvas.getContext('2d');
      ctx.scale(1 / retinaScaling, 1 / retinaScaling);
      const [a, b, c, d] = vpt;
      ctx.transform(a, b, c, d, 0, 0);
      ctx.drawImage(dragImage, 0, 0);
      dragImage = dragImageCanvas;
    }
    this.__dragImageDisposer && this.__dragImageDisposer();
    this.__dragImageDisposer = () => {
      dragImage.remove();
    };
    //  position drag image offscreen
    setStyle(dragImage, {
      position: 'absolute',
      left: -dragImage.width + 'px',
      border: 'none',
    });
    getEnv().document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, offset.x, offset.y);
  }

  /**
   * support native like text dragging
   * @private
   * @param {DragEvent} e
   * @returns {boolean} should handle event
   */
  onDragStart(e: DragEvent): boolean {
    this.__dragStartFired = true;
    if (this.__isDragging) {
      const selection = (this.__dragStartSelection = {
        selectionStart: this.selectionStart,
        selectionEnd: this.selectionEnd,
      });
      const value = this._text
        .slice(selection.selectionStart, selection.selectionEnd)
        .join('');
      const data = { text: this.text, value, ...selection };
      e.dataTransfer.setData('text/plain', value);
      e.dataTransfer.setData(
        'application/fabric',
        JSON.stringify({
          value: value,
          styles: this.getSelectionStyles(
            selection.selectionStart,
            selection.selectionEnd,
            true
          ),
        })
      );
      e.dataTransfer.effectAllowed = 'copyMove';
      this.setDragImage(e, data);
    }
    this.abortCursorAnimation();
    return this.__isDragging;
  }

  /**
   * Override to customize drag and drop behavior
   * @public
   * @param {DragEvent} e
   * @returns {boolean}
   */
  canDrop(e: DragEvent): boolean {
    if (this.editable && !this.__corner) {
      if (this.__isDragging && this.__dragStartSelection) {
        //  drag source trying to drop over itself
        //  allow dropping only outside of drag start selection
        const index = this.getSelectionStartFromPointer(e);
        const dragStartSelection = this.__dragStartSelection;
        return (
          index < dragStartSelection.selectionStart ||
          index > dragStartSelection.selectionEnd
        );
      }
      return true;
    }
    return false;
  }

  /**
   * support native like text dragging
   * @private
   * @param {object} options
   * @param {DragEvent} options.e
   */
  dragEnterHandler({ e }: DragEventData) {
    const canDrop = !e.defaultPrevented && this.canDrop(e);
    if (!this.__isDraggingOver && canDrop) {
      this.__isDraggingOver = true;
    }
  }

  /**
   * support native like text dragging
   * @private
   * @param {object} options
   * @param {DragEvent} options.e
   */
  dragOverHandler(ev: DragEventData) {
    const { e } = ev;
    const canDrop = !e.defaultPrevented && this.canDrop(e);
    if (!this.__isDraggingOver && canDrop) {
      this.__isDraggingOver = true;
    } else if (this.__isDraggingOver && !canDrop) {
      //  drop state has changed
      this.__isDraggingOver = false;
    }
    if (this.__isDraggingOver) {
      //  can be dropped, inform browser
      e.preventDefault();
      //  inform event subscribers
      ev.canDrop = true;
      ev.dropTarget = this;
    }
  }

  /**
   * support native like text dragging
   * @private
   */
  dragLeaveHandler() {
    if (this.__isDraggingOver || this.__isDragging) {
      this.__isDraggingOver = false;
    }
  }

  /**
   * support native like text dragging
   * fired only on the drag source
   * handle changes to the drag source in case of a drop on another object or a cancellation
   * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#finishing_a_drag
   * @private
   * @param {object} options
   * @param {DragEvent} options.e
   */
  dragEndHandler({ e }: DragEventData) {
    if (this.__isDragging && this.__dragStartFired) {
      //  once the drop event finishes we check if we need to change the drag source
      //  if the drag source received the drop we bail out since the drop handler has already handled logic
      if (this.__dragStartSelection) {
        const selectionStart = this.__dragStartSelection.selectionStart;
        const selectionEnd = this.__dragStartSelection.selectionEnd;
        const dropEffect = e.dataTransfer.dropEffect;
        if (dropEffect === 'none') {
          // pointer is back over selection
          this.selectionStart = selectionStart;
          this.selectionEnd = selectionEnd;
          this._updateTextarea();
          this.hiddenTextarea.focus();
        } else {
          this.clearContextTop();
          if (dropEffect === 'move') {
            this.insertChars('', null, selectionStart, selectionEnd);
            this.selectionStart = this.selectionEnd = selectionStart;
            this.hiddenTextarea && (this.hiddenTextarea.value = this.text);
            this._updateTextarea();
            this.fire('changed', {
              index: selectionStart,
              action: 'dragend',
            });
            this.canvas.fire('text:changed', { target: this });
            this.canvas.requestRenderAll();
          }
          this.exitEditing();
          //  disable mouse up logic
          this.__lastSelected = false;
        }
      }
    }

    this.__dragImageDisposer && this.__dragImageDisposer();
    delete this.__dragImageDisposer;
    delete this.__dragStartSelection;
    this.__isDraggingOver = false;
  }

  /**
   * support native like text dragging
   *
   * Override the `text/plain | application/fabric` types of {@link DragEvent#dataTransfer}
   * in order to change the drop value or to customize styling respectively, by listening to the `drop:before` event
   * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#performing_a_drop
   * @private
   */
  dropHandler(ev: DropEventData) {
    const { e } = ev;
    const didDrop = e.defaultPrevented;
    this.__isDraggingOver = false;
    // inform browser that the drop has been accepted
    e.preventDefault();
    let insert = e.dataTransfer.getData('text/plain');
    if (insert && !didDrop) {
      let insertAt = this.getSelectionStartFromPointer(e);
      const { styles } = e.dataTransfer.types.includes('application/fabric')
        ? JSON.parse(e.dataTransfer.getData('application/fabric'))
        : {};
      const trailing = insert[Math.max(0, insert.length - 1)];
      const selectionStartOffset = 0;
      //  drag and drop in same instance
      if (this.__dragStartSelection) {
        const selectionStart = this.__dragStartSelection.selectionStart;
        const selectionEnd = this.__dragStartSelection.selectionEnd;
        if (insertAt > selectionStart && insertAt <= selectionEnd) {
          insertAt = selectionStart;
        } else if (insertAt > selectionEnd) {
          insertAt -= selectionEnd - selectionStart;
        }
        this.insertChars('', null, selectionStart, selectionEnd);
        // prevent `dragend` from handling event
        delete this.__dragStartSelection;
      }
      //  remove redundant line break
      if (
        this._reNewline.test(trailing) &&
        (this._reNewline.test(this._text[insertAt]) ||
          insertAt === this._text.length)
      ) {
        insert = insert.trimEnd();
      }
      //  inform subscribers
      ev.didDrop = true;
      ev.dropTarget = this;
      //  finalize
      this.insertChars(insert, styles, insertAt);
      // can this part be moved in an outside event? andrea to check.
      this.canvas.setActiveObject(this);
      this.enterEditing();
      this.selectionStart = Math.min(
        insertAt + selectionStartOffset,
        this._text.length
      );
      this.selectionEnd = Math.min(
        this.selectionStart + insert.length,
        this._text.length
      );
      this.hiddenTextarea && (this.hiddenTextarea.value = this.text);
      this._updateTextarea();
      this.hiddenTextarea.focus();
      this.fire('changed', {
        index: insertAt + selectionStartOffset,
        action: 'drop',
      });
      this.canvas.fire('text:changed', { target: this });
      this.canvas.contextTopDirty = true;
      this.canvas.requestRenderAll();
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
  fromStringToGraphemeSelection(start, end, text) {
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
  fromGraphemeToStringSelection(start, end, _text) {
    const smallerTextStart = _text.slice(0, start),
      graphemeStart = smallerTextStart.join('').length;
    if (start === end) {
      return { selectionStart: graphemeStart, selectionEnd: graphemeStart };
    }
    const smallerTextEnd = _text.slice(start, end),
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
    this.text = this.hiddenTextarea.value;
    if (this._shouldClearDimensionCache()) {
      this.initDimensions();
      this.setCoords();
    }
    const newSelection = this.fromStringToGraphemeSelection(
      this.hiddenTextarea.selectionStart,
      this.hiddenTextarea.selectionEnd,
      this.hiddenTextarea.value
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
      this.hiddenTextarea.style.left = style.left;
      this.hiddenTextarea.style.top = style.top;
    }
  }

  /**
   * @private
   * @return {Object} style contains style for hiddenTextarea
   */
  _calcTextareaPosition() {
    if (!this.canvas) {
      return { left: 1, top: 1 };
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
      left: p.x + 'px',
      top: p.y + 'px',
      fontSize: charHeight + 'px',
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
      this.canvas.defaultCursor = this._savedProps.defaultCursor;
      this.canvas.moveCursor = this._savedProps.moveCursor;
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
  }

  /**
   * Exits from editing state and fires relevant events
   */
  exitEditing() {
    const isTextChanged = this._textBeforeEdit !== this.text;
    this.selectionEnd = this.selectionStart;
    this._exitEditing();
    this._restoreEditingProps();
    if (this._shouldClearDimensionCache()) {
      this.initDimensions();
      this.setCoords();
    }
    this.fire('editing:exited');
    isTextChanged && this.fire('modified');
    if (this.canvas) {
      this.canvas.fire('text:editing:exited', { target: this });
      isTextChanged && this.canvas.fire('object:modified', { target: this });
    }
    return this;
  }

  /**
   * @private
   */
  _removeExtraneousStyles() {
    for (const prop in this.styles) {
      if (!this._textLines[prop]) {
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
    let cursorStart = this.get2DCursorLocation(start, true),
      cursorEnd = this.get2DCursorLocation(end, true),
      lineStart = cursorStart.lineIndex,
      charStart = cursorStart.charIndex,
      lineEnd = cursorEnd.lineIndex,
      charEnd = cursorEnd.charIndex,
      i,
      styleObj;
    if (lineStart !== lineEnd) {
      // step1 remove the trailing of lineStart
      if (this.styles[lineStart]) {
        for (
          i = charStart;
          i < this._unwrappedTextLines[lineStart].length;
          i++
        ) {
          delete this.styles[lineStart][i];
        }
      }
      // step2 move the trailing of lineEnd to lineStart if needed
      if (this.styles[lineEnd]) {
        for (i = charEnd; i < this._unwrappedTextLines[lineEnd].length; i++) {
          styleObj = this.styles[lineEnd][i];
          if (styleObj) {
            this.styles[lineStart] || (this.styles[lineStart] = {});
            this.styles[lineStart][charStart + i - charEnd] = styleObj;
          }
        }
      }
      // step3 detects lines will be completely removed.
      for (i = lineStart + 1; i <= lineEnd; i++) {
        delete this.styles[i];
      }
      // step4 shift remaining lines.
      this.shiftLineStyles(lineEnd, lineStart - lineEnd);
    } else {
      // remove and shift left on the same line
      if (this.styles[lineStart]) {
        styleObj = this.styles[lineStart];
        let diff = charEnd - charStart,
          numericChar,
          _char;
        for (i = charStart; i < charEnd; i++) {
          delete styleObj[i];
        }
        for (_char in this.styles[lineStart]) {
          numericChar = parseInt(_char, 10);
          if (numericChar >= charEnd) {
            styleObj[numericChar - diff] = styleObj[_char];
            delete styleObj[_char];
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
    copiedStyle
  ) {
    let currentCharStyle,
      newLineStyles = {},
      somethingAdded = false,
      isEndOfLine = this._unwrappedTextLines[lineIndex].length === charIndex;

    qty || (qty = 1);
    this.shiftLineStyles(lineIndex, qty);
    if (this.styles[lineIndex]) {
      currentCharStyle =
        this.styles[lineIndex][charIndex === 0 ? charIndex : charIndex - 1];
    }
    // we clone styles of all chars
    // after cursor onto the current line
    for (const index in this.styles[lineIndex]) {
      const numIndex = parseInt(index, 10);
      if (numIndex >= charIndex) {
        somethingAdded = true;
        newLineStyles[numIndex - charIndex] = this.styles[lineIndex][index];
        // remove lines from the previous line since they're on a new line now
        if (!(isEndOfLine && charIndex === 0)) {
          delete this.styles[lineIndex][index];
        }
      }
    }
    let styleCarriedOver = false;
    if (somethingAdded && !isEndOfLine) {
      // if is end of line, the extra style we copied
      // is probably not something we want
      this.styles[lineIndex + qty] = newLineStyles;
      styleCarriedOver = true;
    }
    if (styleCarriedOver) {
      // skip the last line of since we already prepared it.
      qty--;
    }
    // for the all the lines or all the other lines
    // we clone current char style onto the next (otherwise empty) line
    while (qty > 0) {
      if (copiedStyle && copiedStyle[qty - 1]) {
        this.styles[lineIndex + qty] = {
          0: Object.assign({}, copiedStyle[qty - 1]),
        };
      } else if (currentCharStyle) {
        this.styles[lineIndex + qty] = {
          0: Object.assign({}, currentCharStyle),
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
    copiedStyle: TextStyleDeclaration[]
  ) {
    if (!this.styles) {
      this.styles = {};
    }
    const currentLineStyles = this.styles[lineIndex],
      currentLineStylesCloned = currentLineStyles
        ? Object.assign({}, currentLineStyles)
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
        this.styles[lineIndex][charIndex + quantity] = Object.assign(
          {},
          copiedStyle[quantity]
        );
      }
      return;
    }
    if (!currentLineStyles) {
      return;
    }
    const newStyle = currentLineStyles[charIndex ? charIndex - 1 : 1];
    while (newStyle && quantity--) {
      this.styles[lineIndex][charIndex + quantity] = Object.assign(
        {},
        newStyle
      );
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
    copiedStyle: TextStyleDeclaration[]
  ) {
    let cursorLoc = this.get2DCursorLocation(start, true),
      addedLines = [0],
      linesLength = 0;
    // get an array of how many char per lines are being added.
    for (var i = 0; i < insertedText.length; i++) {
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
        copiedStyle
      );
      copiedStyle = copiedStyle && copiedStyle.slice(addedLines[0] + 1);
    }
    linesLength &&
      this.insertNewlineStyleObject(
        cursorLoc.lineIndex,
        cursorLoc.charIndex + addedLines[0],
        linesLength
      );
    for (var i = 1; i < linesLength; i++) {
      if (addedLines[i] > 0) {
        this.insertCharStyleObject(
          cursorLoc.lineIndex + i,
          0,
          addedLines[i],
          copiedStyle
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
    // we use i outside the loop to get it like linesLength
    if (addedLines[i] > 0) {
      this.insertCharStyleObject(
        cursorLoc.lineIndex + i,
        0,
        addedLines[i],
        copiedStyle
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
  removeChars(start: number, end: number) {
    if (typeof end === 'undefined') {
      end = start + 1;
    }
    this.removeStyleFromTo(start, end);
    this._text.splice(start, end - start);
    this.text = this._text.join('');
    this.set('dirty', true);
    if (this._shouldClearDimensionCache()) {
      this.initDimensions();
      this.setCoords();
    }
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
    style: TextStyleDeclaration[],
    start: number,
    end: number
  ) {
    if (typeof end === 'undefined') {
      end = start;
    }
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
    if (this._shouldClearDimensionCache()) {
      this.initDimensions();
      this.setCoords();
    }
    this._removeExtraneousStyles();
  }

  /**
   * Set the selectionStart and selectionEnd according to the new position of cursor
   * mimic the key - mouse navigation when shift is pressed.
   */
  setSelectionStartEndWithShift(start, end, newSelection) {
    if (newSelection <= start) {
      if (end === start) {
        this._selectionDirection = 'left';
      } else if (this._selectionDirection === 'right') {
        this._selectionDirection = 'left';
        this.selectionEnd = start;
      }
      this.selectionStart = newSelection;
    } else if (newSelection > start && newSelection < end) {
      if (this._selectionDirection === 'right') {
        this.selectionEnd = newSelection;
      } else {
        this.selectionStart = newSelection;
      }
    } else {
      // newSelection is > selection start and end
      if (end === start) {
        this._selectionDirection = 'right';
      } else if (this._selectionDirection === 'left') {
        this._selectionDirection = 'right';
        this.selectionStart = end;
      }
      this.selectionEnd = newSelection;
    }
  }
}
