import { TPointerEventInfo } from '../EventTypeDefs';
import { TFabricEvent } from '../FabricEvent';
import type { FabricObject } from '../shapes/Object/FabricObject';
import { BaseBrush } from './BaseBrush';

export abstract class SimpleBrush<
  T extends FabricObject = FabricObject
> extends BaseBrush<T> {
  /**
   * When `true`, free drawing is limited to the canvas size
   * @type Boolean
   * @default false
   */
  limitedToCanvasSize = false;

  protected subscribe() {
    return [
      ...super.subscribe(),
      this.on(
        'mouse:down:before',
        (ev) => this.shouldHandleEvent(ev, false) && this.down(ev)
      ),
      this.on(
        'mouse:move:before',
        (ev) => this.shouldHandleMoveEvent(ev) && this.move(ev)
      ),
      this.on(
        'mouse:up:before',
        (ev) => this.shouldHandleEvent(ev, true) && this.up(ev)
      ),
    ];
  }

  protected extractPointer(ev: TFabricEvent<TPointerEventInfo>) {
    return ev.absolutePointer;
  }

  protected shouldHandleEvent({ e }: TPointerEventInfo, mustBeActive: boolean) {
    return (
      this.enabled &&
      (!mustBeActive || this.active) &&
      this.canvas._isMainEvent(e)
    );
  }

  protected shouldHandleMoveEvent(ev: TPointerEventInfo) {
    return (
      this.shouldHandleEvent(ev, true) &&
      (!this.limitedToCanvasSize || !this._isOutSideCanvas(ev.absolutePointer))
    );
  }

  protected down(ev: TFabricEvent<TPointerEventInfo>) {
    ev.preventDefault();
    this.start();
    if (this.canvas.getActiveObject()) {
      this.canvas.discardActiveObject(ev.e);
      this.canvas.requestRenderAll();
    }
  }

  protected move(ev: TFabricEvent<TPointerEventInfo>) {
    ev.preventDefault();
  }

  protected up(ev: TFabricEvent<TPointerEventInfo>) {
    ev.preventDefault();
  }
}
