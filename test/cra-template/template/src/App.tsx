import React, { useEffect } from 'react';
//  import from local build `./fabric` or from published module `fabric`
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
