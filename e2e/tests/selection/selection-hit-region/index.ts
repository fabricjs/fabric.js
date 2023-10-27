/**
 * Runs in the **BROWSER**
 * Imports are defined in 'e2e/imports.ts'
 */

import { Rect, Group } from 'fabric';
import { beforeAll } from '../../test';

beforeAll((canvas) => {
  canvas.setDimensions({ width: 500, height: 500 });

  const rect = new Rect({
    width: 200,
    height: 200,
    padding: 30,
    fill: 'green',
  });
  const rect2 = new Rect({
    width: 200,
    angle: 10,
    top: 60,
    left: 250,
    height: 200,
    padding: 5,
    fill: 'yellow',
  });
  const rect3 = new Rect({
    width: 200,
    angle: 45,
    left: 60,
    top: 260,
    height: 200,
    padding: 0,
    fill: 'purple',
  });

  const group = new Group([rect, rect2, rect3], {
    subTargetCheck: true,
  });
  canvas.add(group);

  return { group, rect, rect2, rect3 };
});
