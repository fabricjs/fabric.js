import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { Container, Nav, Navbar, SSRProvider } from 'react-bootstrap';
import { useRouter } from 'next/router';

export default function MyApp({ Component, pageProps }) {
  const { route } = useRouter();
  return (
    <>
      <Head>
        <title>fabric.js sandbox</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <SSRProvider>
        <Navbar bg="light">
          <Container>
            <Navbar.Brand>
              <strong>fabric.js</strong> sandbox
            </Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link
                as={Link}
                href="/"
                legacyBehavior={false}
                active={route === '/'}
              >
                Browser
              </Nav.Link>
              <Nav.Link
                as={Link}
                href="/node"
                legacyBehavior={false}
                active={route === '/node'}
              >
                Node
              </Nav.Link>
              <Nav.Link
                href="http://fabricjs.com/"
                target="_blank"
                rel="noopener noreferrer"
                active={false}
              >
                <small>Docs</small>
              </Nav.Link>
              <Nav.Link
                href="https://github.com/fabricjs/fabric.js/blob/master/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                active={false}
              >
                <small>Contribution Guide</small>
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        <Component {...pageProps} />
      </SSRProvider>
    </>
  );
}
