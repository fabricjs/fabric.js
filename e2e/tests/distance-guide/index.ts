/**
 * Runs in the **BROWSER**
 * Imports are defined in 'e2e/imports.ts'
 */

import { Rect } from 'fabric';
import { DistanceGuide } from 'fabric/extensions';
import { beforeAll } from '../test';

beforeAll(async (canvas) => {
  canvas.setDimensions({ width: 450, height: 100 });
  const rect1 = new Rect({
    originX: 'center',
    originY: 'center',
    strokeWidth: 0,
    left: 150,
    top: 30,
    width: 50,
    height: 50,
    fill: 'green',
  });

  const rect2 = new Rect({
    originX: 'center',
    originY: 'center',
    strokeWidth: 0,
    left: 280,
    top: 30,
    width: 50,
    height: 50,
    fill: 'yellow',
  });

  const rect3 = new Rect({
    originX: 'center',
    originY: 'center',
    strokeWidth: 0,
    left: 0,
    top: 0,
    width: 50,
    height: 50,
    fill: 'black',
  });

  new DistanceGuide(canvas);

  canvas.add(rect1, rect2, rect3);

  return { rect1, rect2, rect3 };
});
