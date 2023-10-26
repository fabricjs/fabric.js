/**
 * Runs from both the browser and node
 */

import type { StaticCanvas } from 'fabric';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
export function render(canvas: StaticCanvas, fabric: typeof import('fabric')) {
  canvas.setDimensions({ width: 640, height: 100 });

  const ellipse = new fabric.Ellipse({
    originX: 'center',
    originY: 'center',
    rx: 300,
    ry: 30,
    fill: 'green',
    stroke: 'black',
    strokeWidth: 40,
    top: 20,
  });

  canvas.add(ellipse);
  canvas.centerObject(ellipse);
  canvas.renderAll();
}
