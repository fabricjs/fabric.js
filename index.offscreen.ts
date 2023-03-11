import './src/env/offscreen';
import {
  StaticCanvas as StaticCanvasBase,
  Canvas as CanvasBase,
} from './fabric';
import { proxyWebAPIs } from './src/env/offscreen';

// FabricObject.ownDefaults.objectCaching = false;

export * from './fabric';

export function transferControlToOffscreen(
  canvas: HTMLCanvasElement,
  worker: Worker
) {
  worker.addEventListener(
    'message',
    (
      event: MessageEvent<
        | {
            type: 'cursor';
            value: CSSStyleDeclaration['cursor'];
          }
        | ({ type: string } & Record<string, any>)
      >
    ) => {
      switch (event.data.type) {
        case 'cursor':
          canvas.style.cursor = event.data.value;
          break;

        default:
          console.log(event.data);
          break;
      }
    }
  );
  const postEvent = (e: MouseEvent) => {
    worker.postMessage({
      e: {
        clientX: e.offsetX,
        clientY: e.offsetY,
        offsetX: e.offsetX,
        offsetY: e.offsetY,
        screenX: e.screenX,
        screenY: e.screenY,
        movementX: e.movementX,
        movementY: e.movementY,
        x: e.x,
        y: e.y,
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        metaKey: e.metaKey,
        type: e.type,
      } as MouseEvent,
    });
  };
  const disposers = (['mousedown', 'mousemove', 'mouseup'] as const).map(
    (type) => {
      canvas.addEventListener(type, postEvent);
      return () => canvas.removeEventListener(type, postEvent);
    }
  );

  const offscreenCanvas = canvas.transferControlToOffscreen();
  worker.postMessage({ canvas: offscreenCanvas }, [offscreenCanvas]);

  return [offscreenCanvas, () => disposers.forEach((d) => d())] as const;
}

export class StaticCanvas extends StaticCanvasBase {
  constructor(canvasEl: OffscreenCanvas) {
    super(proxyWebAPIs(canvasEl));
  }
}

export class Canvas extends CanvasBase {
  constructor(canvasEl: OffscreenCanvas) {
    super(proxyWebAPIs(canvasEl));
  }

  setCursor(value: string): void {
    postMessage({
      type: 'cursor',
      value,
    });
  }
}
