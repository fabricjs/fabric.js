import * as fabric from 'fabric';
import { NextPage } from 'next';
import { useEffect, useRef } from 'react';
import { CanvasComponent, CanvasSlot } from '../components';

const IndexPage: NextPage = () => {
  const ref = useRef<fabric.Canvas>(null);
  // const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) {
      return;
    }
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
  }, []);

  // useResize(ref, { fillParent: true });

  return (
    <div
      style={{ position: 'relative', margin: 0, padding: 0, borderWidth: 0 }}
    >
      <CanvasComponent ref={ref}>
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
