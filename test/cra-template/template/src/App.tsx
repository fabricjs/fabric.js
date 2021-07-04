import React, { useEffect } from 'react';
//  open `./fabric/fabric.ts` to change the import source (local build or published module)
import { fabric, useCanvas } from './fabric';

function App() {
  const [fc, setRef] = useCanvas();

  useEffect(() => {
    // do stuff with canvas after initialization
    const canvas = fc.current;
  }, [fc]);

  return (
    <canvas
      width={500}
      height={500}
      ref={setRef}
    />
  );
}

export default App;
