/**
 * Runs in the **BROWSER**
 * Imports are defined in 'e2e/imports.ts'
 */

import { Rect } from 'fabric';
import { Scrollbars } from 'fabric/extensions';
import { beforeAll } from '../test';

beforeAll(async (canvas) => {
  canvas.setDimensions({ width: 400, height: 150 });
  const rect1 = new Rect({
    originX: 'center',
    originY: 'center',
    left: 100,
    top: 100,
    width: 100,
    height: 100,
    fill: 'green',
  });

  const rect2 = new Rect({
    originX: 'center',
    originY: 'center',
    left: 200,
    top: 200,
    width: 50,
    height: 50,
    fill: 'yellow',
  });

  new Scrollbars(canvas);

  canvas.add(rect1, rect2);

  return { rect1, rect2 };
});
