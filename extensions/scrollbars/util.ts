import type { TPointerEventInfo, Canvas, TMat2D } from 'fabric';
import type { MakeMouseWheelProps } from './typedefs';

export const makeMouseWheel =
  (canvas: Canvas, props: Partial<MakeMouseWheelProps> = {}) =>
  (options: TPointerEventInfo<WheelEvent>) => {
    const e = options.e;
    if (e.target == canvas.upperCanvasEl) e.preventDefault();
    const { min, max, tSpeed = 0.99, mSpeed = 0.998, pSpeed = 1 } = props;

    /** Is it touchpad zoom? */
    const isTouchScale = Math.floor(e.deltaY) != Math.ceil(e.deltaY);
    // Touchpad zooming, Mac's touchpad automatically sets e.ctrlKey to true
    if (e.ctrlKey || e.metaKey) {
      // Mouse and touchpad speed separate
      const speed = isTouchScale ? tSpeed : mSpeed;
      let zoom = canvas.getZoom();
      zoom *= speed ** e.deltaY;
      if (max != undefined && zoom > max) zoom = max;
      if (min != undefined && zoom < min) zoom = min;

      canvas.zoomToPoint(options.viewportPoint, zoom);
      canvas.requestRenderAll();
      return;
    }

    const vpt = canvas.viewportTransform.slice(0) as TMat2D;
    let { deltaX, deltaY } = e;
    // Hold down Shift and scroll the mouse to indicate horizontal scrolling
    if (e.shiftKey && deltaX == 0) {
      deltaX = deltaY;
      deltaY = 0;
    }
    vpt[4] -= deltaX * pSpeed;
    vpt[5] -= deltaY * pSpeed;
    canvas.setViewportTransform(vpt);
    canvas.requestRenderAll();
  };
