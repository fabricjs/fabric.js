import './src/env/offscreen';
import {
  StaticCanvas as StaticCanvasBase,
  Canvas as CanvasBase,
} from './fabric';
import { proxyWebAPIs } from './src/env/offscreen';

// FabricObject.ownDefaults.objectCaching = false;

export * from './fabric';

export function retargetEvents(canvas: HTMLCanvasElement) {}

export class StaticCanvas extends StaticCanvasBase {
  constructor(canvasEl: OffscreenCanvas) {
    super(proxyWebAPIs(canvasEl));
  }
}

export class Canvas extends CanvasBase {
  constructor(canvasEl: OffscreenCanvas) {
    super(proxyWebAPIs(canvasEl));
  }
}
