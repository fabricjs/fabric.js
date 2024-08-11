import type { DragEventData, DropEventData, TPointerEvent } from '../../EventTypeDefs';
import type { IText } from './IText';
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
export declare class DraggableTextDelegate {
    readonly target: IText;
    private __mouseDownInPlace;
    private __dragStartFired;
    private __isDraggingOver;
    private __dragStartSelection?;
    private __dragImageDisposer?;
    private _dispose?;
    constructor(target: IText);
    isPointerOverSelection(e: TPointerEvent): boolean;
    /**
     * @public override this method to disable dragging and default to mousedown logic
     */
    start(e: TPointerEvent): boolean;
    /**
     * @public override this method to disable dragging without discarding selection
     */
    isActive(): boolean;
    /**
     * Ends interaction and sets cursor in case of a click
     * @returns true if was active
     */
    end(e: TPointerEvent): boolean;
    getDragStartSelection(): {
        selectionStart: number;
        selectionEnd: number;
    } | undefined;
    /**
     * Override to customize the drag image
     * https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/setDragImage
     */
    setDragImage(e: DragEvent, { selectionStart, selectionEnd, }: {
        selectionStart: number;
        selectionEnd: number;
    }): void;
    /**
     * @returns {boolean} determines whether {@link target} should/shouldn't become a drag source
     */
    onDragStart(e: DragEvent): boolean;
    /**
     * use {@link targetCanDrop} to respect overriding
     * @returns {boolean} determines whether {@link target} should/shouldn't become a drop target
     */
    canDrop(e: DragEvent): boolean;
    /**
     * in order to respect overriding {@link IText#canDrop} we call that instead of calling {@link canDrop} directly
     */
    protected targetCanDrop(e: DragEvent): boolean;
    dragEnterHandler({ e }: DragEventData): void;
    dragOverHandler(ev: DragEventData): void;
    dragLeaveHandler(): void;
    /**
     * Override the `text/plain | application/fabric` types of {@link DragEvent#dataTransfer}
     * in order to change the drop value or to customize styling respectively, by listening to the `drop:before` event
     * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#performing_a_drop
     */
    dropHandler(ev: DropEventData): void;
    /**
     * fired only on the drag source after drop (if occurred)
     * handle changes to the drag source in case of a drop on another object or a cancellation
     * https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#finishing_a_drag
     */
    dragEndHandler({ e }: DragEventData): void;
    dispose(): void;
}
//# sourceMappingURL=DraggableTextDelegate.d.ts.map