import wes from 'westures';
import { type Canvas, type XY } from 'fabric';

export type TapEventData = {
  centroid: XY;
  phase: string;
  type: 'tap';
  target: HTMLElement;
};

export const singleTapGesture = (canvas: Canvas) => {
  return (
    new wes.Tap(canvas.upperCanvasEl, (eventdata: TapEventData) => {
      console.log('singleTap', eventdata);
    }),
    {
      maxInputs: 1,
      tolerance: 2,
      numTaps: 1,
    }
  );
};

export const doubleTapGesture = (canvas: Canvas) => {
  return (
    new wes.Tap(canvas.upperCanvasEl, (eventdata: TapEventData) => {
      console.log('doubleTap', eventdata);
    }),
    {
      maxInputs: 1,
      tolerance: 2,
      numTaps: 2,
    }
  );
};

export const tripleTapGesture = (canvas: Canvas) => {
  return (
    new wes.Tap(canvas.upperCanvasEl, (eventdata: TapEventData) => {
      console.log('tripleTap', eventdata);
    }),
    {
      maxInputs: 1,
      tolerance: 2,
      numTaps: 3,
    }
  );
};

/**
 * Add a serie of gestures recognition on the canvas
 */
export const addGestures = (canvas: Canvas) => {
  const canvasRegion = new wes.Region(canvas.upperCanvasEl);

  canvasRegion.addGesture(singleTapGesture(canvas));
  canvasRegion.addGesture(doubleTapGesture(canvas));
  canvasRegion.addGesture(tripleTapGesture(canvas));
};
