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

const rect = new fabric.Rect({
  top: 65,
  width: 150,
  height: 150,
  angle: 45,
  fill: 'rgba(255,0,0,0.5)',
  strokeWidth: 0,
});

const rect2 = new fabric.Rect({
  left: 130,
  width: 150,
  height: 150,
  angle: 45,
  stroke: 'blue',
  strokeWidth: 10,
  fill: null,
});

const grp = new fabric.Group([rect, rect2, text]);

canvas.add(grp);

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
