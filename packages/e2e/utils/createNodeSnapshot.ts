import * as fabric from '@fabricjs/node';

export class TestingCanvas extends fabric.Canvas {
  requestRenderAll(): void {
    this.renderAll();
  }
}

export async function createNodeSnapshot(
  cb: (
    canvas: TestingCanvas,

    fabric: typeof import('@fabricjs/node'),
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
