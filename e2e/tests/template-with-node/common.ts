/**
 * Runs from both the browser and node
 */

export function render(
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  fabric: typeof import('fabric'),
  { el }: { el?: HTMLCanvasElement } = {}
) {
  const canvas = new fabric.StaticCanvas(el, {
    width: 200,
    height: 70,
    backgroundColor: 'white',
    enableRetinaScaling: false,
  });
  const textbox = new fabric.Textbox('fabric.js test', {
    width: 200,
    top: 20,
  });
  canvas.add(textbox);
  canvas.centerObjectH(textbox);
  canvas.renderAll();

  return { canvas, objects: { textbox } };
}
