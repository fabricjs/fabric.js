/**
 * Runs in the **BROWSER**
 * Imports are defined in 'e2e/imports.ts'
 */

import { Rect, ActiveSelection, Point } from 'fabric';
import { beforeAll } from '../../test';

beforeAll(async (canvas) => {
  canvas.setDimensions({ width: 500, height: 500 });
  ActiveSelection.ownDefaults.originX = 'center';
  ActiveSelection.ownDefaults.originY = 'center';
  canvas.preserveObjectStacking = true;
  const rect1 = new Rect({
    strokeWidth: 0,
    left: 250,
    top: 250,
    width: 150,
    height: 150,
    originX: 'right',
    originY: 'bottom',
    fill: 'green',
  });
  rect1.setPositionByOrigin(new Point(250, 250), 'left', 'top');

  const rect2 = new Rect({
    strokeWidth: 0,
    left: 255,
    top: 255,
    width: 150,
    height: 150,
    originX: 'left',
    originY: 'top',
    fill: 'yellow',
  });
  rect2.setPositionByOrigin(new Point(255, 255), 'left', 'top');

  canvas.add(rect1, rect2);

  return { rect1, rect2 };
});
