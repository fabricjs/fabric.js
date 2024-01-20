import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

const NodePage: NextPage = () => {
  return (
    <div>
      <ButtonGroup className="m-4">
        <Button
          variant="dark"
          as={Link}
          href="/api/fabric"
          legacyBehavior={false}
        >
          Direct Download
        </Button>
        <Button
          onClick={async () => {
            const res = await fetch('/api/fabric');
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', 'fabric.png');
            link.click();
            URL.revokeObjectURL(blobUrl);
          }}
        >
          Browser Download
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default NodePage;
