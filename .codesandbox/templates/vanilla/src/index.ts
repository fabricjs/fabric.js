import * as fabric from 'fabric';
import './styles.css';

const el = document.getElementById('canvas');
const canvas = (window.canvas = new fabric.Canvas(el, {
  width: window.document.body.clientWidth,
  height: window.innerHeight,
}));

const rectWithStroke = new fabric.Rect({
  width: 200,
  height: 100,
  fill: 'green',
  stroke: 'blue',
  strokeWidth: 4,
  scaleX: 2,
  scaleY: 1.5,
});

const rectWithStrokeUniform = new fabric.Rect({
  width: 20,
  height: 10,
  fill: 'green',
  stroke: 'blue',
  strokeWidth: 4,
  strokeUniform: true,
  scaleX: 20,
  scaleY: 15,
});

const skewedRect = new fabric.Rect({
  width: 150,
  height: 60,
  angle: 45,
  fill: 'red',
  stroke: 'pink',
  strokeWidth: 4,
  skewX: 15,
});

const skewedRect2 = new fabric.Rect({
  width: 40,
  height: 200,
  angle: 90,
  fill: 'pink',
  stroke: 'red',
  strokeWidth: 4,
  skewY: 15,
  top: 50,
  left: 200,
});

const group = new fabric.Group(
  [rectWithStroke, rectWithStrokeUniform, skewedRect, skewedRect2],
  {
    subTargetCheck: true,
    interactive: true,
    objectCaching: false,
    layoutManager: new fabric.LayoutManager(),
  }
);

canvas.on('after:render', ({ ctx }) => {
  group._renderControls(ctx, { hasControls: false });
});

canvas.add(group);
