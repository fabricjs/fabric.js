import { defineProperty as _defineProperty, objectSpread2 as _objectSpread2 } from '../../../_virtual/_rollupPluginBabelHelpers.mjs';
import { Point } from '../../Point.mjs';
import { setStyle } from '../../util/dom_style.mjs';
import { cloneStyles } from '../../util/internals/cloneStyles.mjs';
import { getDocumentFromElement } from '../../util/dom_misc.mjs';
import { NONE, CHANGED } from '../../constants.mjs';

/**
 * #### Dragging IText/Textbox Lifecycle
 * - {@link start} is called from `mousedown` {@link IText#_mouseDownHandler} and determines if dragging should start by testing {@link isPointerOverSelection}
 * - if true `mousedown` {@link IText#_mouseDownHandler} is blocked to keep selection
 * - if the pointer moves, canvas fires numerous mousemove {@link Canvas#_onMouseMove} that we make sure **aren't** prevented ({@link IText#shouldStartDragging}) in order for the window to start a drag session
 * - once/if the session starts canvas calls {@link onDragStart} on the active object to determine if dragging should occur
 * - canvas fires relevant drag events that are handled by the handlers defined in this scope
 * - {@link end} is called from `mouseup` {@link IText#mouseUpHandler}, blocking IText default click behavior
 * - in case the drag session didn't occur, {@link end} handles a click, since logic to do so was blocked during `mousedown`
 */
class DraggableTextDelegate {
  constructor(target) {
    _defineProperty(this, "target", void 0);
    _defineProperty(this, "__mouseDownInPlace", false);
    _defineProperty(this, "__dragStartFired", false);
    _defineProperty(this, "__isDraggingOver", false);
    _defineProperty(this, "__dragStartSelection", void 0);
    _defineProperty(this, "__dragImageDisposer", void 0);
    _defineProperty(this, "_dispose", void 0);
    this.target = target;
    const disposers = [this.target.on('dragenter', this.dragEnterHandler.bind(this)), this.target.on('dragover', this.dragOverHandler.bind(this)), this.target.on('dragleave', this.dragLeaveHandler.bind(this)), this.target.on('dragend', this.dragEndHandler.bind(this)), this.target.on('drop', this.dropHandler.bind(this))];
    this._dispose = () => {
      disposers.forEach(d => d());
      this._dispose = undefined;
    };
  }
  isPointerOverSelection(e) {
    const target = this.target;
    const newSelection = target.getSelectionStartFromPointer(e);
    return target.isEditing && newSelection >= target.selectionStart && newSelection <= target.selectionEnd && target.selectionStart < target.selectionEnd;
  }

  /**
   * @public override this method to disable dragging and default to mousedown logic
   */
  start(e) {
    return this.__mouseDownInPlace = this.isPointerOverSelection(e);
  }

  /**
   * @public override this method to disable dragging without discarding selection
   */
  isActive() {
    return this.__mouseDownInPlace;
  }

  /**
   * Ends interaction and sets cursor in case of a click
   * @returns true if was active
   */
  end(e) {
    const active = this.isActive();
    if (active && !this.__dragStartFired) {
      // mousedown has been blocked since `active` is true => cursor has not been set.
      // `__dragStartFired` is false => dragging didn't occur, pointer didn't move and is over selection.
      // meaning this is actually a click, `active` is a false positive.
      this.target.setCursorByClick(e);
      this.target.initDelayedCursor(true);
    }
    this.__mouseDownInPlace = false;
    this.__dragStartFired = false;
    this.__isDraggingOver = false;
    return active;
  }
  getDragStartSelection() {
    return this.__dragStartSelection;
  }

  /**
   * Override to customize the drag image
   * https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/setDragImage
   */
  setDragImage(e, _ref) {
    var _e$dataTransfer;
    let {
      selectionStart,
      selectionEnd
    } = _ref;
    const target = this.target;
    const canvas = target.canvas;
    const flipFactor = new Point(target.flipX ? -1 : 1, target.flipY ? -1 : 1);
    const boundaries = target._getCursorBoundaries(selectionStart);
    const selectionPosition = new Point(boundaries.left + boundaries.leftOffset, boundaries.top + boundaries.topOffset).multiply(flipFactor);
    const pos = selectionPosition.transform(target.calcTransformMatrix());
    const pointer = canvas.getScenePoint(e);
    const diff = pointer.subtract(pos);
    const retinaScaling = target.getCanvasRetinaScaling();
    const bbox = target.getBoundingRect();
    const correction = pos.subtract(new Point(bbox.left, bbox.top));
    const vpt = canvas.viewportTransform;
    const offset = correction.add(diff).transform(vpt, true);
    //  prepare instance for drag image snapshot by making all non selected text invisible
    const bgc = target.backgroundColor;
    const styles = cloneStyles(target.styles);
    target.backgroundColor = '';
    const styleOverride = {
      stroke: 'transparent',
      fill: 'transparent',
      textBackgroundColor: 'transparent'
    };
    target.setSelectionStyles(styleOverride, 0, selectionStart);
    target.setSelectionStyles(styleOverride, selectionEnd, target.text.length);
    target.dirty = true;
    const dragImage = target.toCanvasElement({
      enableRetinaScaling: canvas.enableRetinaScaling,
      viewportTransform: true
    });
    // restore values
    target.backgroundColor = bgc;
    target.styles = styles;
    target.dirty = true;
    //  position drag image offscreen
    setStyle(dragImage, {
      position: 'fixed',
      left: "".concat(-dragImage.width, "px"),
      border: NONE,
      width: "".concat(dragImage.width / retinaScaling, "px"),
      height: "".concat(dragImage.height / retinaScaling, "px")
    });
    this.__dragImageDisposer && this.__dragImageDisposer();
    this.__dragImageDisposer = () => {
      dragImage.remove();
    };
    getDocumentFromElement(e.target || this.target.hiddenTextarea).body.appendChild(dragImage);
    (_e$dataTransfer = e.dataTransfer) === null || _e$dataTransfer === void 0 || _e$dataTransfer.setDragImage(dragImage, offset.x, offset.y);
  }

  /**
   * @returns {boolean} determines whether {@link target} should/shouldn't become a drag source
   */
  onDragStart(e) {
    this.__dragStartFired = true;
    const target = this.target;
    const active = this.isActive();
    if (active && e.dataTransfer) {
      const selection = this.__dragStartSelection = {
        selectionStart: target.selectionStart,
        selectionEnd: target.selectionEnd
      };
      const value = target._text.slice(selection.selectionStart, selection.selectionEnd).join('');
      const data = _objectSpread2({
        text: target.text,
        value
      }, selection);
      e.dataTransfer.setData('text/plain', value);
      e.dataTransfer.setData('application/fabric', JSON.stringify({
        value: value,
        styles: target.getSelectionStyles(selection.selectionStart, selection.selectionEnd, true)
      }));
      e.dataTransfer.effectAllowed = 'copyMove';
      this.setDragImage(e, data);
    }
    target.abortCursorAnimation();
    return active;
  }

  /**
   * use {@link targetCanDrop} to respect overriding
   * @returns {boolean} determines whether {@link target} should/shouldn't become a drop target
   */
  canDrop(e) {
    if (this.target.editable && !this.target.getActiveControl() && !e.defaultPrevented) {
      if (this.isActive() && this.__dragStartSelection) {
        //  drag source trying to drop over itself
        //  allow dropping only outside of drag start selection
        const index = this.target.getSelectionStartFromPointer(e);
        const dragStartSelection = this.__dragStartSelection;
        return index < dragStartSelection.selectionStart || index > dragStartSelection.selectionEnd;
      }
      return true;
    }
    return false;
  }

  /**
   * in order to respect overriding {@link IText#canDrop} we call that instead of calling {@link canDrop} directly
   */
  targetCanDrop(e) {
    return this.target.canDrop(e);
  }
  dragEnterHandler(_ref2) {
    let {
      e
    } = _ref2;
    const canDrop = this.targetCanDrop(e);
    if (!this.__isDraggingOver && canDrop) {
      this.__isDraggingOver = true;
    }
  }
  dragOverHandler(ev) {
    const {
      e
    } = ev;
    const canDrop = this.targetCanDrop(e);
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
  dragLeaveHandler() {
    if (this.__isDraggingOver || this.isActive()) {
      this.__isDraggingOver = false;
    }
  }

  /**
   * Override the `text/plain | application/fabric` types of {@link DragEvent#dataTransfer}
   * in order to change the drop value or to customize styling respectively, by listening to the `drop:before` event
   * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#performing_a_drop
   */
  dropHandler(ev) {
    var _e$dataTransfer2;
    const {
      e
    } = ev;
    const didDrop = e.defaultPrevented;
    this.__isDraggingOver = false;
    // inform browser that the drop has been accepted
    e.preventDefault();
    let insert = (_e$dataTransfer2 = e.dataTransfer) === null || _e$dataTransfer2 === void 0 ? void 0 : _e$dataTransfer2.getData('text/plain');
    if (insert && !didDrop) {
      const target = this.target;
      const canvas = target.canvas;
      let insertAt = target.getSelectionStartFromPointer(e);
      const {
        styles
      } = e.dataTransfer.types.includes('application/fabric') ? JSON.parse(e.dataTransfer.getData('application/fabric')) : {};
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
        target.removeChars(selectionStart, selectionEnd);
        // prevent `dragend` from handling event
        delete this.__dragStartSelection;
      }
      //  remove redundant line break
      if (target._reNewline.test(trailing) && (target._reNewline.test(target._text[insertAt]) || insertAt === target._text.length)) {
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
      target.selectionStart = Math.min(insertAt + selectionStartOffset, target._text.length);
      target.selectionEnd = Math.min(target.selectionStart + insert.length, target._text.length);
      target.hiddenTextarea.value = target.text;
      target._updateTextarea();
      target.hiddenTextarea.focus();
      target.fire(CHANGED, {
        index: insertAt + selectionStartOffset,
        action: 'drop'
      });
      canvas.fire('text:changed', {
        target
      });
      canvas.contextTopDirty = true;
      canvas.requestRenderAll();
    }
  }

  /**
   * fired only on the drag source after drop (if occurred)
   * handle changes to the drag source in case of a drop on another object or a cancellation
   * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#finishing_a_drag
   */
  dragEndHandler(_ref3) {
    let {
      e
    } = _ref3;
    if (this.isActive() && this.__dragStartFired) {
      //  once the drop event finishes we check if we need to change the drag source
      //  if the drag source received the drop we bail out since the drop handler has already handled logic
      if (this.__dragStartSelection) {
        var _e$dataTransfer3;
        const target = this.target;
        const canvas = this.target.canvas;
        const {
          selectionStart,
          selectionEnd
        } = this.__dragStartSelection;
        const dropEffect = ((_e$dataTransfer3 = e.dataTransfer) === null || _e$dataTransfer3 === void 0 ? void 0 : _e$dataTransfer3.dropEffect) || NONE;
        if (dropEffect === NONE) {
          // pointer is back over selection
          target.selectionStart = selectionStart;
          target.selectionEnd = selectionEnd;
          target._updateTextarea();
          target.hiddenTextarea.focus();
        } else {
          target.clearContextTop();
          if (dropEffect === 'move') {
            target.removeChars(selectionStart, selectionEnd);
            target.selectionStart = target.selectionEnd = selectionStart;
            target.hiddenTextarea && (target.hiddenTextarea.value = target.text);
            target._updateTextarea();
            target.fire(CHANGED, {
              index: selectionStart,
              action: 'dragend'
            });
            canvas.fire('text:changed', {
              target
            });
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
  dispose() {
    this._dispose && this._dispose();
  }
}

export { DraggableTextDelegate };
//# sourceMappingURL=DraggableTextDelegate.mjs.map
