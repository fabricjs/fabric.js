import { Rect } from 'fabric';
import { beforeAll } from '../../test';

beforeAll((canvas) => {
  const rect = new Rect({ width: 50, height: 50, fill: 'blue' });
  canvas.allowTouchScrolling = true;
  canvas.setDimensions({ width: 600, height: 4000 });
  canvas.add(rect);
  return { rect };
});
