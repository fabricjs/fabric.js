import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React, { useCallback } from 'react';

// https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr
const Canvas = dynamic(
  () => import('../components/Canvas').then(({ Canvas }) => Canvas),
  {
    ssr: false,
  }
);

const IndexPage: NextPage = () => {
  const onLoad = useCallback(async (canvas) => {
    // load fabric dynamically for it to load with a browser context
    // regular importing will fail with SSR
    const { fabric } = await import('fabric');
    canvas.setDimensions({
      width: 500,
      height: 500,
    });
    const text = new fabric.Text('fabric.js sandbox', {
      originX: 'center',
      top: 20,
    });
    canvas.add(text);
    text.centerH();
    function animate(toState: 0 | 1) {
      text.animate('scaleX', Math.max(toState, 0.1) * 2, {
        onChange: () => canvas.renderAll(),
        onComplete: () => animate(Number(!toState) as 0 | 1),
        duration: 1000,
        easing: toState
          ? fabric.util.ease.easeInOutQuad
          : fabric.util.ease.easeInOutSine,
      });
    }
    animate(1);
  }, []);

  return (
    <div className="position-relative">
      <Canvas onLoad={onLoad} />
    </div>
  );
};

export default IndexPage;
