import React, { useCallback, useContext } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';
import { openIDE } from './hooks';

export const CommentsContext = React.createContext<[show: number, setShow: (value: number) => any] | null>(null);

function Comments({ children }: { children?: React.ReactNode }) {
  const [show, setShow] = useContext(CommentsContext)!;
  const hideModal = useCallback(() => setShow(0), []);

  return (
    <Offcanvas show={show === 1} onHide={hideModal}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Comments</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {children ||
          <>
            This is the place to explain what this app tests, fixes, changes and does.<br />
            To edit comments open <Button variant="link" onClick={openIDE}><code>./src/App.tsx</code></Button>
          </>
        }
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default Comments;