import * as fabric from 'fabric/node';

class TestingCanvas extends fabric.StaticCanvas {
  requestRenderAll(): void {
    this.renderAll();
  }
}

export async function createNodeSnapshot(
  cb: (
    canvas: TestingCanvas,
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    fabric: typeof import('fabric/node')
  ) => any | Promise<any>,
  options: Partial<fabric.StaticCanvasOptions> = {}
) {
  const canvas = new TestingCanvas(null, {
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
