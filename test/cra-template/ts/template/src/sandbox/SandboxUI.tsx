import React, { useCallback, useState } from 'react';
import { Badge, Button, Col, Container, Image, Modal, OverlayTrigger, Row, Spinner, Tooltip } from 'react-bootstrap';
import { CommentsContext } from './Comments';
import { OpenIDE } from './common';
import githubIcon from './GitHub-Mark-64px.png';
import { SANDBOX_DEPLOYED, useDeployCodeSandbox, useGitInfo, useShowComments, useShowModal } from './hooks';

function SandboxUI({ children, hidden }: { children: React.ReactNode, hidden?: boolean }) {
  const [pending, deployCodeSandbox] = useDeployCodeSandbox();
  const gitInfo = useGitInfo();
  const [showModal, setShowModal] = useShowModal();
  const comments = useShowComments()
  const [showComments, setShowComments] = comments;
  const hideModal = useCallback(() => {
    setShowModal(0);
    showComments === -1 && setShowComments(1);
  }, [showComments, setShowModal, setShowComments]);
  const [showDownload, setShowDownload] = useState(false);

  return hidden ?
    <>{children}</> :
    (
      <div className="App">
        <header className="App-header my-3">
          <div className="f1">
            {
              gitInfo &&
              <OverlayTrigger
                overlay={
                  <Tooltip id="git">
                    <Container className="p-2">
                      <Row className="m-3">
                        Click to browse this repository
                      </Row>
                      <Row>
                        <Col md="auto">user</Col>
                        <Col ><code>{gitInfo.user}</code></Col>
                      </Row>
                      <Row>
                        <Col md="auto">branch</Col>
                        <Col><code>{gitInfo.branch}</code></Col>
                      </Row>
                      <Row>
                        <Col md="auto">tag</Col>
                        <Col><code>{gitInfo.tag}</code></Col>
                      </Row>
                      <Row className="my-3">
                        {gitInfo.changes.length > 0 && <strong>This branch has uncommitted changes</strong>}
                      </Row>
                    </Container>
                  </Tooltip>
                }
                trigger={['focus', 'hover']}
                flip
                placement="right"
              >
                {({ ref, ...props }) =>
                  <div className="position-relative" {...props}>
                    <a
                      ref={ref}
                      href={`https://github.com/${gitInfo.user}/fabric.js/tree/${gitInfo.tag}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={githubIcon}
                        width={48}
                      />
                    </a>
                    {gitInfo.changes.length > 0 && <Badge className="github" bg="secondary"><small>Uncommitted Changes</small></Badge>}
                  </div>
                }
              </OverlayTrigger>
            }
          </div>
          <div className="f1">
            <h2>
              <strong>Fabric.js</strong> React Sandbox
            </h2>
          </div>
          <div className="f1">
            <Button
              as="a"
              href="http://fabricjs.com/"
              target="_blank"
              rel="noopener noreferrer"
              variant="link"
            >
              Docs
            </Button>
            <Button
              as="a"
              href="https://github.com/fabricjs/fabric.js/blob/master/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              variant="link"
            >
              Contribution Guide
            </Button>
            {
              !SANDBOX_DEPLOYED ?
                <Button
                  onClick={deployCodeSandbox}
                  disabled={pending}
                  variant="outline-success"
                >
                  {
                    pending ?
                      <Spinner animation="border" /> :
                      <>
                        Deploy to codesandbox
                        <Image src="https://codesandbox.io/csb-ios.svg" width={24} className="mx-1" />
                      </>
                  }
                </Button> :
                <OverlayTrigger
                  trigger={['focus', 'hover']}
                  flip
                  placement="left"
                  overlay={
                    <Tooltip id="download_diff">
                      Download the diff file if you want to apply these changes to your local repository.<br />
                      Click for more instructions.
                    </Tooltip>
                  }
                >
                  <Button
                    as="a"
                    href="/diff/upstream.diff"
                    download="fabric.diff"
                    onClick={() => setShowDownload(true)}
                    variant="outline-primary"
                  >
                    Download diff
                  </Button>
                </OverlayTrigger>
            }
          </div>
        </header>
        <CommentsContext.Provider value={comments}>
          {children}
        </CommentsContext.Provider>
        <Button
          onClick={() => setShowComments(1)}
          variant="outline-success"
        >
          Show Comments
          <Image src=" https://unpkg.com/ionicons@latest/dist/svg/information-circle-outline.svg" width={24} className="mx-1" />
        </Button>
        <Modal
          show={showModal === 1}
          onHide={hideModal}
          backdrop="static"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Welcome to Fabric.js React Sandbox</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <h5>Overview</h5>
              This tool is designed for developers working on <code>fabric</code>.
              It is a great place for live testing!<br />
              The app's server watches for changes on <code>fabric</code>. All you need to do is <strong>start coding!</strong><br />
            </p>
            <p>
              <h5>Working on the App</h5>
              To edit this test app open <OpenIDE />.<br />
              You will notice there are actions available to make developing much simpler, the most awesome is <strong>deploying to codesandbox</strong>.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={hideModal}>Let's get started</Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showDownload}
          onHide={() => setShowDownload(false)}
          backdrop="static"
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Using <code>.diff</code> files</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Commit your local changes before proceeding.</h5>
            <div className="my-4">
              <p>
                If you want to apply the changes from this sandbox to your local repository run the following command from <code>fabric</code> folder
              </p>
              <div className="m-2">
                <code>
                  git apply {'<path/to/downloaded/.diff>'}
                </code>
              </div>
            </div>
            <div className="my-4">
              <p>
                If you want to apply the changes only to the build folder <code>dist</code> run the following command
              </p>
              <div className="m-2">
                <code>
                  git apply --include dist/fabric.js {'<path/to/downloaded/.diff>'}
                </code>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div >
    );
}

export default SandboxUI;