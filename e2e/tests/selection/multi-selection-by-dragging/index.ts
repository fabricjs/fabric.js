/**
 * Runs in the **BROWSER**
 * Imports are defined in 'e2e/imports.ts'
 */

import { Rect, ActiveSelection } from 'fabric';
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

  canvas.add(rect1, rect2);

  return { rect1, rect2 };
});
