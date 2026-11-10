import * as fabric from 'fabric';
import { beforeAll } from '../../test';

beforeAll(
  (canvas) => {
    canvas.selectionColor = 'transparent';
    canvas.selectionBorderColor = 'red';
    canvas.selectionLineWidth = 4;
    const brush = new fabric.PencilBrush(canvas);
    brush.color = 'blue';
    brush.width = 6;
    // keep the context line join/cap equal to canvas defaults so only the dash differs
    brush.strokeLineCap = 'butt';
    brush.strokeLineJoin = 'miter';
    canvas.freeDrawingBrush = brush;
    // drop the drawn path so only the drag selection ends up in the screenshot
    canvas.on('path:created', ({ path }) => {
      canvas.remove(path);
    });
  },
  {
    width: 300,
    height: 300,
    enableRetinaScaling: false,
    backgroundColor: 'white',
  },
);
