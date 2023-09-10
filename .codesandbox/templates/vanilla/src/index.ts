import * as fabric from 'fabric';
import './styles.css';

const el = document.getElementById('canvas');
const canvas = (window.canvas = new fabric.Canvas(el));

//  edit from here
canvas.setDimensions({
  width: 500,
  height: 500,
});
const textValue = 'fabric.js sandbox\nawesome textbox item long long long ';
const text = new fabric.Textbox(textValue, {
  originX: 'center',
  objectCaching: false,
  splitByGrapheme: true,
  fontSize: 48,
  width: 210,
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
      {
        style: {
          fill: 'blue',
        },
        start: 19,
        end: 26,
      },
      {
        style: {
          fill: 'red',
        },
        start: 26,
        end: 32,
      },
      {
        style: {
          fill: 'green',
        },
        start: 33,
        end: 34,
      },
      {
        style: {
          fill: 'yellow',
        },
        start: 35,
        end: 36,
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
// animate(1);
