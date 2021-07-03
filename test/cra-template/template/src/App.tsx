import React, { useCallback, useEffect, useRef } from 'react';
import './styles.css';
//  open `./fabric.ts` to change the import source (local build or published module)
import { fabric } from './fabric';
import { useCanvas } from './useCanvas';

function App() {
  const [fc, setRef] = useCanvas();

  useEffect(() => {
    // do stuff with canvas after initialization
    const canvas = fc.current;
  }, []);

  return (
    <canvas
      width={500}
      height={500}
      ref={setRef}
    />
  );
}

export default App;
