import React, { useCallback, useEffect, useRef } from 'react';
import './App.css';
import { fabric } from './fabric';

const SIZE = { width: 500, height: 500 };

function useCanvasRef() {
  const fc = useRef<fabric.Canvas | null>(null);
  const setRef = useCallback((ref: HTMLCanvasElement | null) => {
    if (!ref) {
      if (fc.current) {
        const el = fc.current.getElement();
        fc.current.dispose();
        el.width = SIZE.width;
        el.height = SIZE.height;
      }
      fc.current = null;
      return;
    }
    const canvas = new fabric.Canvas(ref, { backgroundColor: 'white' });
    fc.current = canvas;
    return () => {
      fc.current?.dispose();
      fc.current = null;
    }
  }, []);
  return [fc, setRef] as [typeof fc, typeof setRef];
}

function App() {
  const [fc, setRef] = useCanvasRef();

  useEffect(() => {
    // do stuff with canvas after initialization
    const canvas = fc.current;
  }, []);

  return (
    <canvas
      width={SIZE.width}
      height={SIZE.height}
      ref={setRef}
    />
  );
}

export default App;
