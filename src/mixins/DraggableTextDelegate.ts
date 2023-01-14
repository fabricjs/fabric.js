import { getEnv } from '../env';
import { DragEventData, DropEventData, TPointerEvent } from '../EventTypeDefs';
import { Point } from '../point.class';
import type { IText } from '../shapes/itext.class';
import { setStyle } from '../util/dom_style';
import { clone } from '../util/lang_object';
import { createCanvasElement } from '../util/misc/dom';
import { isIdentityMatrix } from '../util/misc/matrix';
import { TextStyleDeclaration } from './text_style.mixin';

export class DraggableTextDelegate {
  readonly target: IText;
  private __dragImageDisposer?: VoidFunction;
  private __dragStartFired: boolean;
  private __isDragging: boolean;
  private __dragStartSelection?: {
    selectionStart: number;
    selectionEnd: number;
  };
  private __isDraggingOver: boolean;
  private _dispose?: () => void;

  constructor(target: IText) {
    this.target = target;
    this.dragEnterHandler = this.dragEnterHandler.bind(this);
    this.dragOverHandler = this.dragOverHandler.bind(this);
    this.dragLeaveHandler = this.dragLeaveHandler.bind(this);
    this.dragEndHandler = this.dragEndHandler.bind(this);
    this.dropHandler = this.dropHandler.bind(this);
    const disposers = [
      this.target.on('dragenter', this.dragEnterHandler),
      this.target.on('dragover', this.dragOverHandler),
      this.target.on('dragleave', this.dragLeaveHandler),
      this.target.on('dragend', this.dragEndHandler),
      this.target.on('drop', this.dropHandler),
    ];
    this._dispose = () => {
      disposers.forEach((d) => d());
      this._dispose = undefined;
    };
  }

  isPointerOnSelection(e: TPointerEvent) {
    const target = this.target;
    const newSelection = target.getSelectionStartFromPointer(e);
    return (
      target.isEditing &&
      newSelection >= target.selectionStart &&
      newSelection <= target.selectionEnd &&
      target.selectionStart < target.selectionEnd
    );
  }

  isActive() {
    return this.__isDragging;
  }

  start(e: TPointerEvent) {
    this.__isDragging = this.isPointerOnSelection(e);
  }

  /**
   * Ends interaction and sets cursor in case of a click
   * @param e
   * @returns true if was active
   */
  end(e: TPointerEvent) {
    const active = this.__isDragging;
    if (active && !this.__dragStartFired) {
      // false positive `active`, is actually a click
      this.target.setCursorByClick(e);
    }
    this.__isDragging = false;
    return active;
  }

  getDragStartSelection() {
    return this.__dragStartSelection;
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
    const flipFactor = new Point(
      this.target.flipX ? -1 : 1,
      this.target.flipY ? -1 : 1
    );
    const boundaries = this.target._getCursorBoundaries(selectionStart);
    const selectionPosition = new Point(
      boundaries.left + boundaries.leftOffset,
      boundaries.top + boundaries.topOffset
    ).multiply(flipFactor);
    const pos = selectionPosition.transform(this.target.calcTransformMatrix());
    const canvas = this.target.canvas!;
    const pointer = canvas.getPointer(e);
    const diff = pointer.subtract(pos);
    const enableRetinaScaling = canvas._isRetinaScaling();
    const retinaScaling = this.target.getCanvasRetinaScaling();
    const bbox = this.target.getBoundingRect(true);
    const correction = pos.subtract(new Point(bbox.left, bbox.top));
    const vpt = canvas.viewportTransform;
    const offset = correction.add(diff).transform(vpt, true);
    //  prepare instance for drag image snapshot by making all non selected text invisible
    const bgc = this.target.backgroundColor;
    const styles = clone(this.target.styles, true);
    this.target.backgroundColor = '';
    const styleOverride = {
      stroke: 'transparent',
      fill: 'transparent',
      textBackgroundColor: 'transparent',
    };
    this.target.setSelectionStyles(styleOverride, 0, selectionStart);
    this.target.setSelectionStyles(
      styleOverride,
      selectionEnd,
      this.target.text.length
    );
    let dragImage = this.target.toCanvasElement({
      enableRetinaScaling,
    });
    // restore values
    this.target.backgroundColor = bgc;
    this.target.styles = styles;
    //  handle retina scaling and vpt
    if (retinaScaling > 1 || !isIdentityMatrix(vpt)) {
      const dragImageCanvas = createCanvasElement();
      const size = new Point(dragImage.width, dragImage.height)
        .scalarDivide(retinaScaling)
        .transform(vpt, true);
      dragImageCanvas.width = size.x;
      dragImageCanvas.height = size.y;
      const ctx = dragImageCanvas.getContext('2d')!;
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
    e.dataTransfer?.setDragImage(dragImage, offset.x, offset.y);
  }

  /**
   * support native like text dragging
   * @private
   * @param {DragEvent} e
   * @returns {boolean} should handle event
   */
  onDragStart(e: DragEvent): boolean {
    this.__dragStartFired = true;
    if (this.__isDragging && e.dataTransfer) {
      const selection = (this.__dragStartSelection = {
        selectionStart: this.target.selectionStart,
        selectionEnd: this.target.selectionEnd,
      });
      const value = this.target._text
        .slice(selection.selectionStart, selection.selectionEnd)
        .join('');
      const data = { text: this.target.text, value, ...selection };
      e.dataTransfer.setData('text/plain', value);
      e.dataTransfer.setData(
        'application/fabric',
        JSON.stringify({
          value: value,
          styles: this.target.getSelectionStyles(
            selection.selectionStart,
            selection.selectionEnd,
            true
          ),
        })
      );
      e.dataTransfer.effectAllowed = 'copyMove';
      this.setDragImage(e, data);
    }
    this.target.abortCursorAnimation();
    return this.__isDragging;
  }

  /**
   * Override to customize drag and drop behavior
   * @public
   * @param {DragEvent} e
   * @returns {boolean}
   */
  canDrop(e: DragEvent): boolean {
    if (this.target.editable && !this.target.__corner) {
      if (this.__isDragging && this.__dragStartSelection) {
        //  drag source trying to drop over itself
        //  allow dropping only outside of drag start selection
        const index = this.target.getSelectionStartFromPointer(e);
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
      ev.dropTarget = this.target;
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
        const target = this.target;
        const canvas = this.target.canvas!;
        const { selectionStart, selectionEnd } = this.__dragStartSelection;
        const dropEffect = e.dataTransfer?.dropEffect;
        if (dropEffect === 'none') {
          // pointer is back over selection
          target.selectionStart = selectionStart;
          target.selectionEnd = selectionEnd;
          target._updateTextarea();
          target.hiddenTextarea!.focus();
        } else {
          target.clearContextTop();
          if (dropEffect === 'move') {
            target.insertChars('', undefined, selectionStart, selectionEnd);
            target.selectionStart = target.selectionEnd = selectionStart;
            target.hiddenTextarea &&
              (target.hiddenTextarea.value = target.text);
            target._updateTextarea();
            target.fire('changed', {
              index: selectionStart,
              action: 'dragend',
            });
            canvas.fire('text:changed', { target });
            canvas.requestRenderAll();
          }
          target.exitEditing();
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
    let insert = e.dataTransfer?.getData('text/plain');
    if (insert && !didDrop) {
      const target = this.target;
      const canvas = target.canvas!;
      let insertAt = target.getSelectionStartFromPointer(e);
      const { styles } = (
        e.dataTransfer!.types.includes('application/fabric')
          ? JSON.parse(e.dataTransfer!.getData('application/fabric'))
          : {}
      ) as { styles: TextStyleDeclaration[] };
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
        target.insertChars('', undefined, selectionStart, selectionEnd);
        // prevent `dragend` from handling event
        delete this.__dragStartSelection;
      }
      //  remove redundant line break
      if (
        target._reNewline.test(trailing) &&
        (target._reNewline.test(target._text[insertAt]) ||
          insertAt === target._text.length)
      ) {
        insert = insert.trimEnd();
      }
      //  inform subscribers
      ev.didDrop = true;
      ev.dropTarget = target;
      //  finalize
      target.insertChars(insert, styles, insertAt);
      // can this part be moved in an outside event? andrea to check.
      canvas.setActiveObject(target);
      target.enterEditing(e);
      target.selectionStart = Math.min(
        insertAt + selectionStartOffset,
        target._text.length
      );
      target.selectionEnd = Math.min(
        target.selectionStart + insert.length,
        target._text.length
      );
      target.hiddenTextarea!.value = target.text;
      target._updateTextarea();
      target.hiddenTextarea!.focus();
      target.fire('changed', {
        index: insertAt + selectionStartOffset,
        action: 'drop',
      });
      canvas.fire('text:changed', { target });
      canvas.contextTopDirty = true;
      canvas.requestRenderAll();
    }
  }

  dispose() {
    this._dispose && this._dispose();
  }
}
