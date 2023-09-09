import * as fabric from 'fabric';
import './styles.css';

const el = document.getElementById('canvas');
const canvas = (window.canvas = new fabric.Canvas(el));

//  edit from here
canvas.setDimensions({
  width: 500,
  height: 500,
});
const textValue = 'fabric.js sandbox';
const text = new fabric.Textbox(textValue, {
  originX: 'center',
  splitByGrapheme: true,
  width: 200,
  top: 20,
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
function animate(toState) {
  text.animate(
    { scaleX: Math.max(toState, 0.1) * 2 },
    {
      onChange: () => canvas.renderAll(),
      onComplete: () => animate(!toState),
      duration: 1000,
      easing: toState
        ? fabric.util.ease.easeInOutQuad
        : fabric.util.ease.easeInOutSine,
    }
  );
}

canvas.add(
  new fabric.Line([30, 30, 30, 150], { strokeWidth: 2, stroke: 'red' })
);
canvas.add(
  new fabric.Rect({
    strokeWidth: 2,
    stroke: 'green',
    width: 400,
    height: 100,
    fill: 'blue',
  })
);
// animate(1);
