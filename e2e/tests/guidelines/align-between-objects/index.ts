/**
 * Runs in the **BROWSER**
 * Imports are defined in 'e2e/imports.ts'
 */

import { Rect } from 'fabric';
import { AligningGuidelines } from 'fabric/extensions';
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
    fill: 'green',
  });

  const rect2 = new Rect({
    strokeWidth: 0,
    left: 200,
    top: 30,
    width: 60,
    height: 60,
    fill: 'yellow',
  });

  new AligningGuidelines(canvas, {
    width: 2,
    margin: 60,
  } as AligningLineConfig);

  canvas.add(rect1, rect2);

  return { rect1, rect2 };
});
