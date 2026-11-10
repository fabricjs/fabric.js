import type { StaticCanvasOptions } from '@fabricjs/core';

export const isSkia = process.env.FABRIC_TEST_BACKEND === 'skia';

// Load exactly one environment per Playwright worker. Importing both entrypoints
// would replace Fabric's shared environment.
export const fabric = require(isSkia ? '@fabricjs/skia' : '@fabricjs/node') as
  | typeof import('@fabricjs/node')
  | typeof import('@fabricjs/skia');

type RenderingCanvas = import('@fabricjs/core').Canvas & {
  getNodeCanvas(): { toBuffer(mime: 'image/png'): Buffer };
};
const BackendCanvas = fabric.Canvas as new (
  ...args: ConstructorParameters<typeof import('@fabricjs/core').Canvas>
) => RenderingCanvas;

export class TestingCanvas extends BackendCanvas {
  requestRenderAll(): void {
    this.renderAll();
  }
}

export async function createNodeSnapshot(
  cb: (
    canvas: TestingCanvas,

    backend: typeof fabric,
  ) => any | Promise<any>,
  options: Partial<StaticCanvasOptions> = {},
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
  try {
    await cb(canvas, fabric);
    render && canvas.renderAll();
    return canvas.getNodeCanvas().toBuffer('image/png');
  } finally {
    await canvas.dispose();
  }
}
