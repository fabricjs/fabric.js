import { NextPage } from 'next';
import React from 'react';
import { fabric } from 'fabric';
import { useCanvas } from '../util/useCanvas';

const IndexPage: NextPage = () => {
  const [canvasRef, setCanvasElRef] = useCanvas((canvas) => {
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
    function animate(toState) {
      text.animate('scaleX', Math.max(toState, 0.1) * 2, {
        onChange: () => canvas.renderAll(),
        onComplete: () => animate(!toState),
        duration: 1000,
        easing: toState
          ? fabric.util.ease.easeInOutQuad
          : fabric.util.ease.easeInOutSine,
      });
    }
    animate(1);
  });

  return (
    <div className="position-relative">
      <canvas ref={setCanvasElRef} />
    </div>
  );
};

export default IndexPage;
