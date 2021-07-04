import React, { useCallback, useEffect } from 'react';
import { openIDE, useDeployCodeSandbox, useGitInfo, useShowComments, useShowModal } from './hooks';
import githubIcon from './GitHub-Mark-64px.png'
import { Badge, Button, Col, Container, Image, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { CommentsContext } from './Comments';

function SandboxUI({ children, hidden }: { children: React.ReactNode, hidden?: boolean }) {
  const [pending, deployCodeSandbox] = useDeployCodeSandbox();
  const gitInfo = useGitInfo();
  const [showModal, setShowModal] = useShowModal();
  const comments = useShowComments()
  const [showComments, setShowComments] = comments;
  const hideModal = useCallback(() => {
    setShowModal(0);
    showComments === -1 && setShowComments(1);
  }, [showComments]);

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
            <Button
              onClick={deployCodeSandbox}
              disabled={pending}
              style={{ cursor: pending ? 'progress' : 'pointer' }}
              variant="outline-success"
            >
              {pending ? 'Deploying' : 'Deploy'} to codesandbox
              <Image src="https://codesandbox.io/csb-ios.svg" width={24} className="mx-1" />
            </Button>
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
              To edit this test app open <button onClick={openIDE}><code>./src/App.tsx</code></button>.<br />
              You will notice there are actions available to make developing much simpler, the most awesome is <strong>deploying to codesandbox</strong>.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={hideModal}>Let's get started</Button>
          </Modal.Footer>
        </Modal>
      </div >
    );
}

export default SandboxUI;