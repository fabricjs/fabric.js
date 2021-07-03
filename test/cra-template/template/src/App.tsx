import React, { useEffect } from 'react';
import './App.css';
import { useCanvasRef } from './hooks';

const SIZE = {
  width: 500,
  height: 500
};

function App() {
  const [fc, setRef] = useCanvasRef(SIZE.width, SIZE.height);

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
