import * as fabric from 'fabric/node';
import type { Canvas as NodeCanvas } from 'fabric/node';
import type { Canvas } from 'fabric';
export class TestingCanvas extends fabric.Canvas {
  requestRenderAll(): void {
    this.renderAll();
  }
}

export async function createNodeSnapshot(
  cb: (
    canvas: Canvas | NodeCanvas,
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    fabric: typeof import('fabric') | typeof import('fabric/node'),
  ) => any | Promise<any>,
  options: Partial<fabric.StaticCanvasOptions> = {},
) {
  const canvas = new TestingCanvas(undefined, {
    enableRetinaScaling: false,
    renderOnAddRemove: false,
    width: 200,
    height: 200,
    ...options,
  });
  let render = true;
  canvas.once('after:render', () => {
    render = false;
  });
  await cb(canvas, fabric);
  render && canvas.renderAll();
  return canvas.getNodeCanvas().toBuffer();
}
