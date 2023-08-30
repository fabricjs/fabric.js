import { Rect } from 'fabric';
import { beforeAll } from '../../test';

beforeAll(
  (canvas) => {
    const centerPoint = canvas.getCenterPoint();
    const rect1 = new Rect({
      width: 75,
      height: 75,
      top: centerPoint.y - 75,
      left: centerPoint.x - 75,
      originX: 'center',
      originY: 'center',
    });
    const rect2 = new Rect({
      width: 75,
      height: 75,
      top: centerPoint.y + 75,
      left: centerPoint.x + 75,
      originX: 'center',
      originY: 'center',
    });
    canvas.add(rect1, rect2);
    canvas.on('mouse:down', ({ pointer, absolutePointer }) =>
      console.log(pointer, absolutePointer)
    );
    canvas.on('mouse:up', ({ pointer, absolutePointer }) =>
      console.log(pointer, absolutePointer)
    );
    return { rect1, rect2 };
  },
  { enableRetinaScaling: false }
);
