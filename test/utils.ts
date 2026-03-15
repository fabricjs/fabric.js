import type { TPointerEvent } from '../src/EventTypeDefs';
import { getFabricDocument } from '../fabric';
import { version } from '../package.json';

const SVG_NS = 'http://www.w3.org/2000/svg';

export function createSVGElement(
  tag: string,
  attrs: Record<string, string | number> = {},
): SVGElement {
  const el = getFabricDocument().createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, String(value));
  }
  return el;
}

const BASE_OBJECT_PROPS = {
  version,
  type: 'Object',
  originX: 'center',
  originY: 'center',
  left: 0,
  top: 0,
  width: 0,
  height: 0,
  fill: 'rgb(0,0,0)',
  stroke: null,
  strokeWidth: 1,
  strokeDashArray: null,
  strokeLineCap: 'butt',
  strokeDashOffset: 0,
  strokeLineJoin: 'miter',
  strokeMiterLimit: 4,
  scaleX: 1,
  scaleY: 1,
  angle: 0,
  flipX: false,
  flipY: false,
  opacity: 1,
  shadow: null,
  visible: true,
  backgroundColor: '',
  fillRule: 'nonzero',
  paintFirst: 'fill',
  globalCompositeOperation: 'source-over',
  skewX: 0,
  skewY: 0,
  strokeUniform: false,
} as const;

export function createReferenceObject<T extends Record<string, unknown>>(
  type: string,
  shapeProps: T = {} as T,
) {
  return {
    ...BASE_OBJECT_PROPS,
    type,
    ...shapeProps,
  };
}

export function createPointerEvent(
  options: Partial<{
    clientX: number;
    clientY: number;
    which: number;
    button: number;
    target: EventTarget;
    shiftKey: boolean;
    type: string;
  }> = {},
): TPointerEvent {
  return {
    clientX: 0,
    clientY: 0,
    which: 1,
    bubbles: true,
    ...options,
  } as TPointerEvent;
}
