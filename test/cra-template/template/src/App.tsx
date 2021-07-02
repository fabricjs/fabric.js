import React, { useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import logo from './logo.svg';
import './App.css';

function App() {
  const ref = useRef<HTMLCanvasElement>();
  const fc = useRef<HTMLCanvasElement>();
  useEffect(() => {
    fc.currect = new fabric.Canvas(ref.current!);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Fabric React Sandbox
        </p>
        <a
          className="App-link"
          href="http://fabricjs.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Fabric Docs
        </a>
      </header>
      <canvas
        width={500}
        height={500}
        ref={ref}
      />
    </div>
  );
}

export default App;
