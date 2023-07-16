import type { Object as FabricObject } from 'fabric';
import { Canvas } from 'fabric';

type Targets = Record<string, FabricObject>;

export async function beforeAll(
  init: (canvas: Canvas) => Targets | Promise<Targets>,
  options?
) {
  const canvas = new Canvas(document.getElementById('canvas'), options);
  window.canvas = canvas;
  window.targets = await init(canvas);
  window.dispatchEvent(new CustomEvent('setup:completed'));
}
