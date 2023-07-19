/**
 * Runs in the **BROWSER**
 */

import * as fabric from 'fabric';
import { beforeAll } from 'test';

beforeAll((canvas) => {
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

  const path = fabric.util.getSmoothPathFromPoints([
    new fabric.Point(50, 50),
    new fabric.Point(100, 100),
    new fabric.Point(50, 200),
    new fabric.Point(400, 150),
    new fabric.Point(500, 500),
  ]);
  const circle = new fabric.Circle({ radius: 50, left: -500, opacity: 0.1 });
  const angle = new fabric.Text('', { fill: 'magenta', fontSize: 20 });

  canvas.add(
    circle,
    angle,
    new fabric.Path(path, { fill: '', stroke: 'blue' })
  );

  canvas.on('after:render', ({ ctx }) =>
    canvas.getTopContext().drawImage(ctx.canvas, 0, 0)
  );

  let i = 0;
  function animatePath() {
    const dir = i % 2 === 0;
    fabric.util.animate({
      path,
      duration: 3000,
      startValue: dir ? '7%' : '85%',
      endValue: dir ? '85%' : '7%',
      easing: dir
        ? fabric.util.ease.easeInOutBack
        : fabric.util.ease.easeInOutSine,
      onChange(pos, v, t) {
        circle.setXY(pos, 'center', 'center');
        angle.set(
          'text',
          `${Math.round(
            fabric.util.radiansToDegrees(pos.angle)
          )}deg, ${Math.round(pos.progress * 100)}%`
        );
        angle.setXY(pos, 'center', 'center');
        circle.setCoords();
        canvas.renderAll();
      },
      onComplete() {
        if (i === 0) {
          i++;
          animatePath();
        } else {
          window.dispatchEvent(new CustomEvent('animation:end'));
        }
      },
    });
  }

  animatePath();
});
