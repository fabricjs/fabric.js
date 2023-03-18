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
    const text = new fabric.Text(
      'fabric.js per pixel find test\nmore lines more testing\ncached cached',
      {
        originX: 'center',
        left: 200,
        top: 20,
        scaleX: 0.9,
        scaleY: 1.3,
      }
    );
    const text2 = new fabric.Text(
      'fabric.js per pixel find test\nmore lines more testing\nnot chached',
      {
        originX: 'center',
        top: 170,
        left: 200,
        fill: 'red',
        scaleX: 0.9,
        scaleY: 1.3,
        objectCaching: false,
      }
    );
    canvas.add(text, text2);
    canvas.perPixelTargetFind = true;
    canvas.setTargetFindTolerance(7);
    canvas.setViewportTransform([1.5, 0, 0, 1.5, 80, 90]);
    document.getElementById('test')?.appendChild(canvas.pixelFindCanvasEl);
    window.canvas = canvas;
  }, []);

  return (
    <>
      <div className="position-relative">
        <Canvas onLoad={onLoad} />
      </div>
      <div id="test" />
    </>
  );
};

export default IndexPage;
