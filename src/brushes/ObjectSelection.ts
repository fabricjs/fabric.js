import { TPointerEvent, TPointerEventInfo } from '../EventTypeDefs';
import { TFabricEvent } from '../FabricEvent';
import { Point } from '../Point';
import { ActiveSelection } from '../shapes/ActiveSelection';
import { TBBox } from '../typedefs';
import { sendObjectToPlane } from '../util/misc/planeChange';
import { DrawShape } from './DrawShape';

export class ObjectSelection extends DrawShape {
  stroke = 'rgba(255, 255, 255, 0.3)';
  fill = 'rgba(100, 100, 255, 0.3)'; // blue

  /**
   * Select only shapes that are fully contained in the selection rectangle.
   * @type Boolean
   * @default
   */
  selectionFullyContained = false;

  protected async finalize() {
    this.active = false;
    this._resetShadow();
    sendObjectToPlane(this.shape!, undefined, this.canvas.viewportTransform);
  }

  up(ev: TFabricEvent<TPointerEventInfo>) {
    super.up(ev);
    this.groupSelectedObjects(this.shape!.getBoundingRect(true, true), ev.e);
    this.onEnd(this.shape);
    this.shape = undefined;
  }

  /**
   * Finds objects inside the selection rectangle and group them
   * @private
   * @param {Event} e mouse event
   */
  protected groupSelectedObjects(bbox: TBBox, e?: TPointerEvent) {
    const objects = this.collectObjects(bbox, e);
    // do not create group for 1 element only
    if (objects.length === 1) {
      this.canvas.setActiveObject(objects[0], e);
    } else if (objects.length > 1) {
      this.canvas.setActiveObject(
        new ActiveSelection(objects.reverse(), {
          canvas: this.canvas,
        }),
        e
      );
    }
  }

  protected collectObjects(
    { left, top, height, width }: TBBox,
    e?: TPointerEvent
  ) {
    const objects = [];
    const selectionX1Y1 = new Point(left, top),
      selectionX2Y2 = selectionX1Y1.add(new Point(width, height)),
      allowIntersect = !this.selectionFullyContained,
      isClick = width === 0 && height === 0;

    // we iterate in reverse order to collect top first in case of click.
    for (let i = this.canvas._objects.length - 1; i >= 0; i--) {
      const currentObject = this.canvas._objects[i];

      if (
        !currentObject ||
        !currentObject.selectable ||
        !currentObject.visible
      ) {
        continue;
      }

      if (
        (allowIntersect &&
          currentObject.intersectsWithRect(
            selectionX1Y1,
            selectionX2Y2,
            true
          )) ||
        currentObject.isContainedWithinRect(
          selectionX1Y1,
          selectionX2Y2,
          true
        ) ||
        (allowIntersect &&
          currentObject.containsPoint(selectionX1Y1, undefined, true)) ||
        (allowIntersect &&
          currentObject.containsPoint(selectionX2Y2, undefined, true))
      ) {
        objects.push(currentObject);
        // only add one object if it's a click
        if (isClick) {
          break;
        }
      }
    }

    return objects.length > 1
      ? objects.filter((object) => !object.onSelect({ e }))
      : objects;
  }
}
