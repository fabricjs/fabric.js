import * as fabric from 'fabric';
import { NextPage } from 'next';
import { useCallback } from 'react';
import { Canvas } from '../components/Canvas';

const IndexPage: NextPage = () => {
  const onLoad = useCallback(async (canvas: fabric.Canvas) => {
    canvas.setDimensions({
      width: window.innerWidth,
      height: 500,
    });
    const text = new fabric.Text('fabric.js sandbox', {
      originX: 'center',
      top: 20,
    });
    canvas.add(text);
    canvas.centerObjectH(text);
    function animate(toState: 0 | 1) {
      text.animate(
        { scaleX: Math.max(toState, 0.1) * 2 },
        {
          onChange: () => canvas.renderAll(),
          onComplete: () => animate(Number(!toState) as 0 | 1),
          duration: 1000,
          easing: toState
            ? fabric.util.ease.easeInOutQuad
            : fabric.util.ease.easeInOutSine,
        }
      );
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
