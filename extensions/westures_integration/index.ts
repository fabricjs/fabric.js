import wes from 'westures';
import { type Canvas, type CanvasEvents, type XY, util } from 'fabric';

type PinchEventData = {
  centroid: XY;
  event: PointerEvent;
  phase: string;
  type: 'pinch';
  scale: number;
  target: HTMLElement;
};

type RotateEventData = {
  centroid: XY;
  event: PointerEvent;
  phase: string;
  type: 'rotate';
  rotation: number;
  target: HTMLElement;
};

/**
 * Register this handler on canvas.on('pinch', pinchEventHandler);
 * To get an out of the box functionality for the pinch to zoom
 */
export function pinchEventHandler(
  this: Canvas,
  { scale, target, scenePoint }: CanvasEvents['pinch'],
) {
  if (target && this.getActiveObject() === target) {
    // if we are pinching on the active object, let's scale it
    target.scaleX *= scale;
    target.scaleY *= scale;
  } else {
    this.zoomToPoint(scenePoint, this.getZoom() * scale);
  }
}

export function rotateEventHandler(
  this: Canvas,
  { rotation, target }: CanvasEvents['rotate'],
) {
  if (target && this.getActiveObject() === target) {
    target.rotate(target.angle + util.radiansToDegrees(rotation));
  }
}

export const pinchGesture = (canvas: Canvas) => {
  return new wes.Pinch(
    canvas.upperCanvasEl,
    ({ scale, event }: PinchEventData) => {
      canvas.fireEventFromPointerEvent(event, 'pinch', { scale });
    },
  );
};

export const rotateGesture = (canvas: Canvas) => {
  return new wes.Rotate(
    canvas.upperCanvasEl,
    ({ rotation, event }: RotateEventData) => {
      canvas.fireEventFromPointerEvent(event, 'rotate', { rotation });
    },
  );
};

/**
 * Add a serie of gestures recognition on the canvas
 */
export const addGestures = (canvas: Canvas) => {
  const canvasRegion = new wes.Region(canvas.upperCanvasEl);
  canvasRegion.addGesture(rotateGesture(canvas));
  canvasRegion.addGesture(pinchGesture(canvas));
};
