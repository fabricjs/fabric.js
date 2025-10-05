import { Rect, Point } from 'fabric';
import { beforeAll } from '../../test';

beforeAll(
  (canvas) => {
    const centerPoint = canvas.getCenterPoint();
    const rect1 = new Rect({
      width: 75,
      height: 75,
      originX: 'center',
      originY: 'center',
    });
    const rect2 = new Rect({
      width: 75,
      height: 75,
      originX: 'center',
      originY: 'center',
    });
    rect1.setPositionByOrigin(
      new Point(centerPoint.x - 75, centerPoint.y - 75),
      'left',
      'top',
    );
    rect2.setPositionByOrigin(
      new Point(centerPoint.x + 75, centerPoint.y + 75),
      'left',
      'top',
    );

    canvas.add(rect1, rect2);
    return { rect1, rect2 };
  },
  { enableRetinaScaling: false },
);
