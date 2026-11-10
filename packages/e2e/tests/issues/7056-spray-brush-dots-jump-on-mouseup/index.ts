import * as fabric from 'fabric';
import { beforeAll } from '../../test';

beforeAll(
  (canvas) => {
    canvas.isDrawingMode = true;
    const brush = new fabric.SprayBrush(canvas);
    brush.color = 'black';
    brush.width = 40;
    brush.dotWidth = 20;
    brush.density = 4;
    brush.dotWidthVariance = 0;
    brush.randomOpacity = false;
    canvas.freeDrawingBrush = brush;
    canvas.on('before:path:created', ({ path }) => {
      path.objectCaching = false;
      (path as fabric.Group).forEachObject((rect) => {
        rect.objectCaching = false;
      });
    });
  },
  {
    width: 300,
    height: 300,
    enableRetinaScaling: false,
    backgroundColor: 'white',
  },
);
