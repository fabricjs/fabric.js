/**
 * Runs from both the browser and node
 */

import type { StaticCanvas } from 'fabric';
import type { StaticCanvas as NodeStaticCanvas } from 'fabric/node';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
export function render(
  canvas: StaticCanvas | NodeStaticCanvas,
  fabric: typeof import('fabric') | typeof import('fabric/node'),
) {
  canvas.setDimensions({ width: 200, height: 70 });
  const textbox = new fabric.Textbox('fabric.js test', {
    width: 200,
    top: 20,
  });
  textbox.setPositionByOrigin(new fabric.Point(0, 20), 'left', 'top');
  canvas.add(textbox);
  canvas.centerObjectH(textbox);
  canvas.renderAll();
}
