import React from 'react';
import { openIDE, useDeployCodeSandbox, useGitInfo, useShowFooter } from './hooks';

function SandboxUI({ children, hidden }: { children: React.ReactNode, hidden?: boolean }) {
  const [pending, deployCodeSandbox] = useDeployCodeSandbox();
  const gitInfo = useGitInfo();
  const [showFooter, setShowFooter] = useShowFooter();

  return hidden ?
    <>{children}</> :
    (
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
            {
              gitInfo &&
              <p>
                user: <code>{gitInfo.user}</code>, branch: <code>{gitInfo.branch}</code>, tag: <code>{gitInfo.tag}</code><br />
                {gitInfo.changes.length > 0 && <strong>This branch has uncommitted changes</strong>}
              </p>
            }
            <button
              onClick={deployCodeSandbox}
              disabled={pending}
              style={{ cursor: pending ? 'progress' : 'pointer' }}
            >
              <div className="App-deploy">
                {pending ? 'Deploying' : 'Deploy'} to codesandbox
                <img src="https://codesandbox.io/csb-ios.svg" width={24} alt="" />
              </div>
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
        {children}
        <footer className="App-footer" hidden={showFooter !== 1}>
          <code>fabric</code> is being watched for changes.<br />
          All you need to do is start coding!<br />
          To edit this test app open <button onClick={openIDE}><code>./src/App.tsx</code></button><br />
          <button className="close" onClick={() => setShowFooter(0)}>X</button>
        </footer>
      </div>
    );
}

export default SandboxUI;