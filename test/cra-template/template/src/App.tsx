import React, { useEffect } from 'react';
//  open `./fabric/fabric.ts` to change the import source (local build or published module)
import { fabric, useCanvas } from './fabric';

function App() {
  const [fc, setRef] = useCanvas(canvas => {
    // do stuff with canvas after initialization
    const text = new fabric.Text('Fabric.js sandbox');
    canvas.add(text);
    text.center();
  });

  return (
    <>
      <p>
        {/**edit this line */}
        This is the place to explain what this app tests, fixes, changes and does.
      </p>
      <canvas
        width={500}
        height={500}
        ref={setRef}
      />
    </>
  );
}

export default App;