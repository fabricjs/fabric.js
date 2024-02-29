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
    <div className="position-relative">
      <CanvasComponent create={create}>
        <CanvasSlot name="main" />
        <CanvasSlot name="pointers" />
        Hello World
        {/* keep on top */}
        {/* <CanvasSlot name="top" /> */}
      </CanvasComponent>
    </div>
  );
};

export default IndexPage;
