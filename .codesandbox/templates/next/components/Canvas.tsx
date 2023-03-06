import * as fabric from 'fabric';
import React, { useCallback, useEffect, useRef } from 'react';

const DEV_MODE = process.env.NODE_ENV === 'development';

export function useCanvas(
  ref?: React.ForwardedRef<HTMLCanvasElement>,
  init?: (canvas: fabric.Canvas) => any,
  saveState = false,
  deps: any[] = []
) {
  const elementRef = useRef<HTMLCanvasElement>(null);
  const fc = useRef<fabric.Canvas | null>(null);
  const data = useRef<any>(null);

  const setRef = useCallback(
    (el: HTMLCanvasElement | null) => {
      //@ts-ignore
      elementRef.current = el;
      ref && (ref.current = elementRef.current);
      // save state
      if (DEV_MODE && saveState && fc.current) {
        data.current = fc.current.toJSON();
      }
      // dispose canvas
      fc.current?.dispose();
      // set/clear ref
      if (!el) {
        fc.current = null;
        return;
      }
      const canvas = new fabric.Canvas(el);
      window.canvas = fc.current = canvas;
      // invoke callback
      init && init(canvas);
      // restore state
      if (DEV_MODE && saveState && data.current) {
        canvas.loadFromJSON(data.current);
      }
    },
    [saveState, ...deps]
  );
  useEffect(() => {
    // disposer
    return () => {
      // save state
      if (DEV_MODE && saveState && fc.current) {
        data.current = fc.current.toJSON();
      }
      // we avoid unwanted disposing by doing so only if element ref is unavailable
      if (!elementRef.current) {
        fc.current?.dispose();
        fc.current = null;
      }
    };
  }, [saveState]);
  return [fc, setRef] as [typeof fc, typeof setRef];
}

export const Canvas = React.forwardRef<
  HTMLCanvasElement,
  {
    onLoad?: (canvas: fabric.Canvas) => any;
    saveState?: boolean;
  }
>(({ onLoad, saveState }, ref) => {
  const [canvasRef, setCanvasElRef] = useCanvas(ref, onLoad, saveState);
  return <canvas ref={setCanvasElRef} />;
});
