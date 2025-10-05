/**
 * Runs in the **BROWSER**
 * Imports are defined in 'e2e/imports.ts'
 */

import { Rect, Point } from 'fabric';
import { initAligningGuidelines } from 'fabric/extensions';
import { beforeAll } from '../../test';
import type { AligningLineConfig } from 'fabric/extensions';

beforeAll(async (canvas) => {
  canvas.setDimensions({ width: 400, height: 150 });
  const rect1 = new Rect({
    strokeWidth: 0,
    left: 30,
    top: 30,
    width: 50,
    height: 50,
    originX: 'center',
    originY: 'center',
    fill: 'green',
  });
  rect1.setPositionByOrigin(new Point(30, 30), 'left', 'top');

  const rect2 = new Rect({
    strokeWidth: 0,
    left: 200,
    top: 30,
    width: 60,
    height: 60,
    originX: 'center',
    originY: 'center',
    fill: 'yellow',
  });
  rect2.setPositionByOrigin(new Point(200, 300), 'left', 'top');

  initAligningGuidelines(canvas, {
    width: 2,
    margin: 60,
  } as AligningLineConfig);

  canvas.add(rect1, rect2);

  return { rect1, rect2 };
});
