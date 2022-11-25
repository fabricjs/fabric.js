//@ts-nocheck
import { IPoint, Point } from '../point.class';
import { TPointerEvent, TransformEvent } from '../typedefs';
import { stopEvent } from '../util/dom_event';
import { invertTransform, transformPoint } from '../util/misc/matrix';
import { ITextKeyBehaviorMixin } from './itext_key_behavior.mixin';

export abstract class ITextClickBehaviorMixin extends ITextKeyBehaviorMixin {
  private __lastClickTime: number;
  private __lastLastClickTime: number;
  private __lastPointer: IPoint | Record<string, never>;
  private __newClickTime: number;

  /**
   * Initializes "dbclick" event handler
   */
  initDoubleClickSimulation() {
    this.__lastClickTime = +new Date();

    // for triple click
    this.__lastLastClickTime = +new Date();

    this.__lastPointer = {};

    this.on('mousedown', this.onMouseDown);
  }

  /**
   * Default event handler to simulate triple click
   * @private
   */
  onMouseDown(options: TransformEvent) {
    if (!this.canvas) {
      return;
    }
    this.__newClickTime = +new Date();
    const newPointer = options.pointer;
    if (this.isTripleClick(newPointer)) {
      this.fire('tripleclick', options);
      stopEvent(options.e);
    }
    this.__lastLastClickTime = this.__lastClickTime;
    this.__lastClickTime = this.__newClickTime;
    this.__lastPointer = newPointer;
    this.__lastSelected = this.selected;
  }

  isTripleClick(newPointer: IPoint) {
    return (
      this.__newClickTime - this.__lastClickTime < 500 &&
      this.__lastClickTime - this.__lastLastClickTime < 500 &&
      this.__lastPointer.x === newPointer.x &&
      this.__lastPointer.y === newPointer.y
    );
  }

  /**
   * Initializes event handlers related to cursor or selection
   */
  initCursorSelectionHandlers() {
    this.initMousedownHandler();
    this.initMouseupHandler();
    this.initClicks();
  }

  /**
   * Default handler for double click, select a word
   */
  doubleClickHandler(options: TransformEvent) {
    if (!this.isEditing) {
      return;
    }
    this.selectWord(this.getSelectionStartFromPointer(options.e));
  }

  /**
   * Default handler for triple click, select a line
   */
  tripleClickHandler(options: TransformEvent) {
    if (!this.isEditing) {
      return;
    }
    this.selectLine(this.getSelectionStartFromPointer(options.e));
  }

  /**
   * Initializes double and triple click event handlers
   */
  initClicks() {
    this.on('mousedblclick', this.doubleClickHandler);
    this.on('tripleclick', this.tripleClickHandler);
  }

  /**
   * Default event handler for the basic functionalities needed on _mouseDown
   * can be overridden to do something different.
   * Scope of this implementation is: find the click position, set selectionStart
   * find selectionEnd, initialize the drawing of either cursor or selection area
   * initializing a mousedDown on a text area will cancel fabricjs knowledge of
   * current compositionMode. It will be set to false.
   */
  _mouseDownHandler(options: TransformEvent) {
    if (
      !this.canvas ||
      !this.editable ||
      (options.e.button && options.e.button !== 1)
    ) {
      return;
    }

    this.__isMousedown = true;

    if (this.selected) {
      this.inCompositionMode = false;
      this.setCursorByClick(options.e);
    }

    if (this.isEditing) {
      this.__selectionStartOnMouseDown = this.selectionStart;
      if (this.selectionStart === this.selectionEnd) {
        this.abortCursorAnimation();
      }
      this.renderCursorOrSelection();
    }
  }

  /**
   * Default event handler for the basic functionalities needed on mousedown:before
   * can be overridden to do something different.
   * Scope of this implementation is: verify the object is already selected when mousing down
   */
  _mouseDownHandlerBefore(options: TransformEvent) {
    if (
      !this.canvas ||
      !this.editable ||
      (options.e.button && options.e.button !== 1)
    ) {
      return;
    }
    // we want to avoid that an object that was selected and then becomes unselectable,
    // may trigger editing mode in some way.
    this.selected = this === this.canvas._activeObject;
    // text dragging logic
    const newSelection = this.getSelectionStartFromPointer(options.e);
    this.__isDragging =
      this.isEditing &&
      newSelection >= this.selectionStart &&
      newSelection <= this.selectionEnd &&
      this.selectionStart < this.selectionEnd;
  }

  /**
   * Initializes "mousedown" event handler
   */
  initMousedownHandler() {
    this.on('mousedown', this._mouseDownHandler);
    this.on('mousedown:before', this._mouseDownHandlerBefore);
  }

  /**
   * Initializes "mouseup" event handler
   */
  initMouseupHandler() {
    this.on('mouseup', this.mouseUpHandler);
  }

  /**
   * standard handler for mouse up, overridable
   * @private
   */
  mouseUpHandler(options: TransformEvent) {
    this.__isMousedown = false;
    if (
      !this.editable ||
      (this.group && !this.group.interactive) ||
      (options.transform && options.transform.actionPerformed) ||
      (options.e.button && options.e.button !== 1)
    ) {
      return;
    }

    if (this.canvas) {
      const currentActive = this.canvas._activeObject;
      if (currentActive && currentActive !== this) {
        // avoid running this logic when there is an active object
        // this because is possible with shift click and fast clicks,
        // to rapidly deselect and reselect this object and trigger an enterEdit
        return;
      }
    }

    if (this.__lastSelected && !this.__corner) {
      this.selected = false;
      this.__lastSelected = false;
      this.enterEditing(options.e);
      if (this.selectionStart === this.selectionEnd) {
        this.initDelayedCursor(true);
      } else {
        this.renderCursorOrSelection();
      }
    } else {
      this.selected = true;
    }
  }

  /**
   * Changes cursor location in a text depending on passed pointer (x/y) object
   * @param {TPointerEvent} e Event object
   */
  setCursorByClick(e: TPointerEvent) {
    const newSelection = this.getSelectionStartFromPointer(e),
      start = this.selectionStart,
      end = this.selectionEnd;
    if (e.shiftKey) {
      this.setSelectionStartEndWithShift(start, end, newSelection);
    } else {
      this.selectionStart = newSelection;
      this.selectionEnd = newSelection;
    }
    if (this.isEditing) {
      this._fireSelectionChanged();
      this._updateTextarea();
    }
  }

  /**
   * Returns coordinates of a pointer relative to object's top left corner in object's plane
   * @param {TPointerEvent} e Event to operate upon
   * @param {IPoint} [pointer] Pointer to operate upon (instead of event)
   * @return {Point} Coordinates of a pointer (x, y)
   */
  getLocalPointer(e: TPointerEvent, pointer: IPoint): Point {
    return transformPoint(
      pointer || this.canvas.getPointer(e),
      invertTransform(this.calcTransformMatrix())
    ).add(new Point(this.width / 2, this.height / 2));
  }

  /**
   * Returns index of a character corresponding to where an object was clicked
   * @param {TPointerEvent} e Event object
   * @return {Number} Index of a character
   */
  getSelectionStartFromPointer(e: TPointerEvent): number {
    const mouseOffset = this.getLocalPointer(e);
    let height = 0,
      charIndex = 0,
      lineIndex = 0;
    for (let i = 0, len = this._textLines.length; i < len; i++) {
      if (height <= mouseOffset.y) {
        height += this.getHeightOfLine(i);
        lineIndex = i;
        if (i > 0) {
          charIndex +=
            this._textLines[i - 1].length + this.missingNewlineOffset(i - 1);
        }
      } else {
        break;
      }
    }
    const lineLeftOffset = Math.abs(this._getLineLeftOffset(lineIndex));
    let width = lineLeftOffset;
    const jlen = this._textLines[lineIndex].length;
    // handling of RTL: in order to get things work correctly,
    // we assume RTL writing is mirrored compared to LTR writing.
    // so in position detection we mirror the X offset, and when is time
    // of rendering it, we mirror it again.
    if (this.direction === 'rtl') {
      mouseOffset.x = this.width - mouseOffset.x;
    }
    let prevWidth = 0;
    for (let j = 0; j < jlen; j++) {
      prevWidth = width;
      // i removed something about flipX here, check.
      width += this.__charBounds[lineIndex][j].kernedWidth;
      if (width <= mouseOffset.x) {
        charIndex++;
      } else {
        break;
      }
    }
    return this._getNewSelectionStartFromOffset(
      mouseOffset,
      prevWidth,
      width,
      charIndex,
      jlen
    );
  }

  /**
   * @private
   */
  _getNewSelectionStartFromOffset(
    mouseOffset: IPoint,
    prevWidth: number,
    width: number,
    index: number,
    jlen: number
  ) {
    const distanceBtwLastCharAndCursor = mouseOffset.x - prevWidth,
      distanceBtwNextCharAndCursor = width - mouseOffset.x,
      offset =
        distanceBtwNextCharAndCursor > distanceBtwLastCharAndCursor ||
        distanceBtwNextCharAndCursor < 0
          ? 0
          : 1;
    let newSelectionStart = index + offset;
    // if object is horizontally flipped, mirror cursor location from the end
    if (this.flipX) {
      newSelectionStart = jlen - newSelectionStart;
    }

    if (newSelectionStart > this._text.length) {
      newSelectionStart = this._text.length;
    }

    return newSelectionStart;
  }
}
