import * as fabric from 'fabric';
import './styles.css';

const el = document.getElementById('canvas');
const canvas = new fabric.Canvas(el);

//  edit from here
canvas.setDimensions({
  width: 500,
  height: 500,
});
const text = new fabric.Text('fabric.js sandbox', {
  originX: 'center',
  top: 20,
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
animate(1);
