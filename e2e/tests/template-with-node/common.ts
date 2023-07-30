import type { StaticCanvas } from 'fabric';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
export function render(canvas: StaticCanvas, fabric: typeof import('fabric')) {
  canvas.setDimensions({ width: 300, height: 100 });
  const textbox = new fabric.Textbox('fabric.js test', {
    width: 200,
    top: 20,
  });
  canvas.add(textbox);
  canvas.centerObjectH(textbox);
  canvas.renderAll();

  return { textbox };
}
