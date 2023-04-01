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
    console.log(
      fabric.util.parsePath(
        'M 3 4 Q 3 5 2 1 4 0 Q 9 12 2 1 4 0 M 3 4 Q 3 5 2 1 4 0 Q 9 12 2 1 4 0 M 3 4 Q 3 5 2 1 4 0 Q 9 12 2 1 4 0 M 3 4 Q 3 5 2 1 4 0 Q 9 12 2 1 4 0 M 3 4 Q 3 5 2 1 4 0 Q 9 12 2 1 4 0 M 3 4 Q 3 5 2 1 4 0 Q 9 12 2 1 4 0'
      )
    );
  }, []);

  return (
    <div className="position-relative">
      <Canvas onLoad={onLoad} />
    </div>
  );
};

export default IndexPage;
