/**
 * Runs in the **BROWSER**
 */
import * as fabric from 'fabric';
import { beforeAll } from '../../test';

beforeAll((canvas) => {
  const rect = new fabric.Rect({
    left: 200,
    top: 150,
    width: 200,
    height: 120,
    fill: 'rgb(120, 170, 220)',
    borderColor: 'rgb(255, 0, 0)',
    cornerColor: 'rgb(255, 0, 0)',
    transparentCorners: false,
  });
  canvas.add(rect);
  return { rect };
});
