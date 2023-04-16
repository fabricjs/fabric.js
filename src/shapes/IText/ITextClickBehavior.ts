import type { TPointerEvent, TPointerEventInfo } from '../../EventTypeDefs';
import { XY, Point } from '../../Point';
import type { DragMethods } from '../Object/InteractiveObject';
import { stopEvent } from '../../util/dom_event';
import { invertTransform, transformPoint } from '../../util/misc/matrix';
import { DraggableTextDelegate } from './DraggableTextDelegate';
import { ITextEvents } from './ITextBehavior';
import { ITextKeyBehavior } from './ITextKeyBehavior';
import { TProps } from '../Object/types';
import { TextProps, SerializedTextProps } from '../Text/Text';

// TODO: this code seems wrong.
// e.button for a left click is `0` and so different than `1` is more
// not a right click. PR 3888 introduced this code and was about left clicks.
function notALeftClick(e: MouseEvent) {
  return e.button && e.button !== 1;
}

export abstract class ITextClickBehavior<
    Props extends TProps<TextProps> = Partial<TextProps>,
    SProps extends SerializedTextProps = SerializedTextProps,
    EventSpec extends ITextEvents = ITextEvents
  >
  extends ITextKeyBehavior<Props, SProps, EventSpec>
  implements DragMethods
{
  private declare __lastSelected: boolean;
  private declare __lastClickTime: number;
  private declare __lastLastClickTime: number;
  private declare __lastPointer: XY | Record<string, never>;
  private declare __newClickTime: number;

  protected draggableTextDelegate: DraggableTextDelegate;

  initBehavior() {
    // Initializes event handlers related to cursor or selection
    this.on('mousedown', this._mouseDownHandler);
    this.on('mousedown:before', this._mouseDownHandlerBefore);
    this.on('mouseup', this.mouseUpHandler);
    this.on('mousedblclick', this.doubleClickHandler);
    this.on('tripleclick', this.tripleClickHandler);

    // Initializes "dbclick" event handler
    this.__lastClickTime = +new Date();
    // for triple click
    this.__lastLastClickTime = +new Date();
    this.__lastPointer = {};
    this.on('mousedown', this.onMouseDown);

    // @ts-expect-error in reality it is an IText instance
    this.draggableTextDelegate = new DraggableTextDelegate(this);

    super.initBehavior();
  }

  shouldStartDragging() {
    return this.draggableTextDelegate.isActive();
  }

  /**
   * @public override this method to control whether instance should/shouldn't become a drag source, @see also {@link DraggableTextDelegate#isActive}
   * @returns {boolean} should handle event
   */
  onDragStart(e: DragEvent) {
    return this.draggableTextDelegate.onDragStart(e);
  }

  /**
   * @public override this method to control whether instance should/shouldn't become a drop target
   */
  canDrop(e: DragEvent) {
    return this.draggableTextDelegate.canDrop(e);
  }

  /**
   * Default event handler to simulate triple click
   * @private
   */
  onMouseDown(options: TPointerEventInfo) {
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

  isTripleClick(newPointer: XY) {
    return (
      this.__newClickTime - this.__lastClickTime < 500 &&
      this.__lastClickTime - this.__lastLastClickTime < 500 &&
      this.__lastPointer.x === newPointer.x &&
      this.__lastPointer.y === newPointer.y
    );
  }

  /**
   * Default handler for double click, select a word
   */
  doubleClickHandler(options: TPointerEventInfo) {
    if (!this.isEditing) {
      return;
    }
    this.selectWord(this.getSelectionStartFromPointer(options.e));
  }

  /**
   * Default handler for triple click, select a line
   */
  tripleClickHandler(options: TPointerEventInfo) {
    if (!this.isEditing) {
      return;
    }
    this.selectLine(this.getSelectionStartFromPointer(options.e));
  }

  /**
   * Default event handler for the basic functionalities needed on _mouseDown
   * can be overridden to do something different.
   * Scope of this implementation is: find the click position, set selectionStart
   * find selectionEnd, initialize the drawing of either cursor or selection area
   * initializing a mousedDown on a text area will cancel fabricjs knowledge of
   * current compositionMode. It will be set to false.
   */
  _mouseDownHandler({ e }: TPointerEventInfo) {
    if (!this.canvas || !this.editable || notALeftClick(e as MouseEvent)) {
      return;
    }

    if (this.draggableTextDelegate.start(e)) {
      return;
    }

    this.canvas.textEditingManager.register(this);

    if (this.selected) {
      this.inCompositionMode = false;
      this.setCursorByClick(e);
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
  _mouseDownHandlerBefore({ e }: TPointerEventInfo) {
    if (!this.canvas || !this.editable || notALeftClick(e as MouseEvent)) {
      return;
    }
    // we want to avoid that an object that was selected and then becomes unselectable,
    // may trigger editing mode in some way.
    this.selected = this === this.canvas._activeObject;
  }

  /**
   * standard handler for mouse up, overridable
   * @private
   */
  mouseUpHandler({ e, transform, button }: TPointerEventInfo) {
    const didDrag = this.draggableTextDelegate.end(e);
    if (this.canvas) {
      this.canvas.textEditingManager.unregister(this);

      const activeObject = this.canvas._activeObject;
      if (activeObject && activeObject !== this) {
        // avoid running this logic when there is an active object
        // this because is possible with shift click and fast clicks,
        // to rapidly deselect and reselect this object and trigger an enterEdit
        return;
      }
    }
    if (
      !this.editable ||
      (this.group && !this.group.interactive) ||
      (transform && transform.actionPerformed) ||
      notALeftClick(e as MouseEvent) ||
      didDrag
    ) {
      return;
    }

    if (this.__lastSelected && !this.__corner) {
      this.selected = false;
      this.__lastSelected = false;
      this.enterEditing(e);
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
   * @param {Point} [pointer] Pointer to operate upon
   * @return {Point} Coordinates of a pointer (x, y)
   */
  getLocalPointer(pointer: Point): Point {
    return transformPoint(
      pointer,
      invertTransform(this.calcTransformMatrix())
    ).add(new Point(this.width / 2, this.height / 2));
  }

  /**
   * Returns index of a character corresponding to where an object was clicked
   * @param {TPointerEvent} e Event object
   * @return {Number} Index of a character
   */
  getSelectionStartFromPointer(e: TPointerEvent): number {
    const mouseOffset = this.getLocalPointer(this.canvas!.getPointer(e));
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
    mouseOffset: XY,
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
