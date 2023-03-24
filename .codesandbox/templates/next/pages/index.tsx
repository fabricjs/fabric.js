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
    const text = new fabric.Textbox('fabric.js sandbox', {
      originX: 'center',
      top: 20,
    });
    canvas.add(text);
    canvas.centerObjectH(text);
  }, []);

  return (
    <div className="position-relative">
      <Canvas onLoad={onLoad} />
    </div>
  );
};

export default IndexPage;
