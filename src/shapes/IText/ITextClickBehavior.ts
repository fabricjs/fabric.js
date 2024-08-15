import type { TPointerEvent, TPointerEventInfo } from '../../EventTypeDefs';
import type { XY } from '../../Point';
import { Point } from '../../Point';
import { stopEvent } from '../../util/dom_event';
import { invertTransform } from '../../util/misc/matrix';
import { DraggableTextDelegate } from './DraggableTextDelegate';
import type { ITextEvents } from './ITextBehavior';
import { ITextKeyBehavior } from './ITextKeyBehavior';
import type { TOptions } from '../../typedefs';
import type { TextProps, SerializedTextProps } from '../Text/Text';

/**
 * `LEFT_CLICK === 0`
 */
const notALeftClick = (e: Event) => !!(e as MouseEvent).button;

export abstract class ITextClickBehavior<
  Props extends TOptions<TextProps> = Partial<TextProps>,
  SProps extends SerializedTextProps = SerializedTextProps,
  EventSpec extends ITextEvents = ITextEvents,
> extends ITextKeyBehavior<Props, SProps, EventSpec> {
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

  /**
   * If this method returns true a mouse move operation over a text selection
   * will not prevent the native mouse event allowing the browser to start a drag operation.
   * shouldStartDragging can be read 'do not prevent default for mouse move event'
   * To prevent drag and drop between objects both shouldStartDragging and onDragStart should return false
   * @returns
   */
  shouldStartDragging() {
    return this.draggableTextDelegate.isActive();
  }

  /**
   * @public override this method to control whether instance should/shouldn't become a drag source,
   * @see also {@link DraggableTextDelegate#isActive}
   * To prevent drag and drop between objects both shouldStartDragging and onDragStart should return false
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
    this.__lastSelected = this.selected && !this.getActiveControl();
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
    if (
      !this.canvas ||
      !this.editable ||
      notALeftClick(e) ||
      this.getActiveControl()
    ) {
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
    if (!this.canvas || !this.editable || notALeftClick(e)) {
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
  mouseUpHandler({ e, transform }: TPointerEventInfo) {
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
      notALeftClick(e) ||
      didDrag
    ) {
      return;
    }

    if (this.__lastSelected && !this.getActiveControl()) {
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
   * Returns index of a character corresponding to where an object was clicked
   * @param {TPointerEvent} e Event object
   * @return {Number} Index of a character
   */
  getSelectionStartFromPointer(e: TPointerEvent): number {
    const mouseOffset = this.canvas!.getScenePoint(e)
      .transform(invertTransform(this.calcTransformMatrix()))
      .add(new Point(-this._getLeftOffset(), -this._getTopOffset()));
    let height = 0,
      charIndex = 0,
      lineIndex = 0;

    for (let i = 0; i < this._textLines.length; i++) {
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
    const charLength = this._textLines[lineIndex].length;
    const chars = this.__charBounds[lineIndex];
    for (let j = 0; j < charLength; j++) {
      // i removed something about flipX here, check.
      const charWidth = chars[j].kernedWidth;
      const widthAfter = width + charWidth;
      if (mouseOffset.x <= widthAfter) {
        // if the pointer is closer to the end of the char we increment charIndex
        // in order to position the cursor after the char
        if (
          Math.abs(mouseOffset.x - widthAfter) <=
          Math.abs(mouseOffset.x - width)
        ) {
          charIndex++;
        }
        break;
      }
      width = widthAfter;
      charIndex++;
    }

    return Math.min(
      // if object is horizontally flipped, mirror cursor location from the end
      this.flipX ? charLength - charIndex : charIndex,
      this._text.length,
    );
  }
}
