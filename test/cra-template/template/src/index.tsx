import React, { useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Canvas from './App';
import reportWebVitals from './reportWebVitals';

function useDeployCodeSandbox() {
  const [pending, setPending] = useState(false);
  const deployCodeSandbox = useCallback(async () => {
    setPending(true);
    try {
      const { uri } = await (await fetch('/codesandbox')).json();
      window.open(uri, '_blank');
    } catch (error) {
      console.error(error);
    }
    setPending(false);
  }, []);
  return [pending, deployCodeSandbox] as [boolean, () => void];
}

function App() {
  const [pending, deployCodeSandbox] = useDeployCodeSandbox();

  return (
    <div className="App">
      <header className="App-header">
        <a
          className="App-link"
          href="http://fabricjs.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Fabric Docs
        </a>
        <div>
          <h2>
            Fabric React Sandbox
          </h2>
          <button
            onClick={deployCodeSandbox}
            disabled={pending}
            style={{ cursor: pending ? 'progress' : 'pointer' }}
          >
            <div className="App-deploy">Deploy to codesandbox <img src="https://codesandbox.io/csb-ios.svg" width={24} /></div>
          </button>
        </div>
        <a
          className="App-link"
          href="https://github.com/fabricjs/fabric.js/blob/master/CONTRIBUTING.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contribution Guide
        </a>
      </header>
      <div className="App-canvas">
        <Canvas />
      </div>
      <footer className="App-footer">
        <code>fabric</code> is being watched for changes. All you need to do is start coding!<br />
        To edit this test app open <code>./src/App.tsx</code><br />
      </footer>
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
