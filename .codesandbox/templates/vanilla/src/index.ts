import { StaticCanvas, Canvas, Text } from 'fabric';
import './styles.css';

const c1 = document.getElementById('canvas1');
const c2 = document.getElementById('canvas2');

function prepareCanvas(el: HTMLCanvasElement) {
  const canvas = new StaticCanvas(el, {
    backgroundColor: '#e9e9e9',
    enableRetinaScaling: true,
  });
  canvas.setDimensions({
    width: 100,
    height: 100,
  });
  canvas.add(new Text('Blur?'));
  return canvas;
}

// prepareCanvas(c1);
prepareCanvas(c2);
