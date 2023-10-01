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
const rect = new fabric.Rect({
  width: 200,
  height: 200,
  padding: 30,
  fill: 'green',
});
const rect2 = new fabric.Rect({
  width: 200,
  angle: 10,
  top: 60,
  left: 250,
  height: 200,
  padding: 5,
  fill: 'yellow',
});
const rect3 = new fabric.Rect({
  width: 200,
  angle: 45,
  left: 60,
  top: 260,
  height: 200,
  padding: 0,
  fill: 'purple',
});

[rect, rect2, rect3].forEach((obj => obj.on('mouseover', ({ e, target }) => {
  obj?.opacity = 0.5;
  obj.group?.set('dirty', true);
  canvas.requestRenderAll();
}));

[rect, rect2, rect3].forEach((obj => obj.on('mouseout', ({ e, target }) => {
  obj?.opacity = 1;
  obj.group?.set('dirty', true);
  canvas.requestRenderAll();
}));

// const group = new fabric.Group([rect, rect2, rect3], { subTargetCheck: true });
// canvas.add(group);

canvas.add(...[rect, rect2, rect3])


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
// animate(1);
