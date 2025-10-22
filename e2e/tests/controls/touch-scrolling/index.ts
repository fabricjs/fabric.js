import { Rect, Point } from 'fabric';
import { beforeAll } from '../../test';

beforeAll((canvas) => {
  const rect = new Rect({ width: 50, height: 50, fill: 'blue' });
  rect.setPositionByOrigin(new Point(50, 50), 'left', 'top');
  canvas.allowTouchScrolling = true;
  canvas.setDimensions({ width: 600, height: 4000 });
  canvas.add(rect);
  return { rect };
});
