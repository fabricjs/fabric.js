import * as fabric from 'fabric';
import { beforeAll } from '../../test';

beforeAll(
  (canvas) => {
    canvas.isDrawingMode = true;
    const brush = new fabric.PencilBrush(canvas);
    brush.width = 10;
    brush.color = 'red';
    canvas.freeDrawingBrush = brush;
  },
  {
    width: 400,
    height: 400,
    enableRetinaScaling: false,
    backgroundColor: 'white',
  },
);
