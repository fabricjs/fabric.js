import * as fabric from 'fabric';
import { NextPage } from 'next';
import { useRef, useCallback } from 'react';
import { Canvas } from '../components/Canvas';

const IndexPage: NextPage = () => {
  const ref = useRef<fabric.Canvas>(null);

  const onLoad = useCallback(
    (canvas: fabric.Canvas) => {
      canvas.setDimensions({
        width: window.innerWidth,
        height: 500,
      });
      const textValue = 'fabric.js sandbox';
      const text = new fabric.Textbox(textValue, {
        originX: 'center',
        top: 20,
        textAlign: 'center',
        styles: fabric.util.stylesFromArray(
          [
            {
              style: {
                fontWeight: 'bold',
                fontSize: 64,
              },
              start: 0,
              end: 9,
            },
          ],
          textValue,
        ),
      });
      canvas.add(text);
      canvas.centerObjectH(text);

      const animate = (toState: number) => {
        text.animate(
          { scaleX: Math.max(toState, 0.1) * 2 },
          {
            onChange: () => canvas.renderAll(),
            onComplete: () => animate(Number(!toState)),
            duration: 1000,
            easing: toState
              ? fabric.util.ease.easeInOutQuad
              : fabric.util.ease.easeInOutSine,
          },
        );
      };
      animate(1);
    },
    [ref],
  );

  return (
    <div className="position-relative">
      <Canvas ref={ref} onLoad={onLoad} />
    </div>
  );
};

export default IndexPage;
