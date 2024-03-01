import * as fabric from 'fabric';
import { NextPage } from 'next';
import { useCallback } from 'react';
import { CanvasComponent, CanvasSlot } from '../components';

const IndexPage: NextPage = () => {
  const create = useCallback((arg0: fabric.DOMManagerType) => {
    const canvas = (window.canvas = new fabric.Canvas(arg0));
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
        textValue
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
        }
      );
    };
    animate(1);

    return canvas;
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <CanvasComponent create={create}>
        <CanvasSlot name="main" />
        <CanvasSlot name="pointers" />
        <iframe
          src="https://fabricjs.github.io/"
          width="100%"
          height="100%"
          style={{ position: 'absolute', left: 0, top: 0, opacity: 0.8 }}
        />
        Hello World
        {/* keep on top */}
        <CanvasSlot name="top" />
      </CanvasComponent>
    </div>
  );
};

export default IndexPage;
