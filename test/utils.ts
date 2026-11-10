import { getFabricDocument } from '../fabric';
import { Rect } from '../packages/core/src/shapes/Rect';
import { version } from '../package.json';
import type {
  BasicTransformEvent,
  ModifiedEvent,
  ModifyPathEvent,
} from '../packages/core/src/EventTypeDefs';
import { Point } from '../packages/core/src/Point';
import type { ITextEvents } from '../packages/core/src/shapes/IText/ITextBehavior';
import type { FabricObject } from '../packages/core/src/shapes/Object/FabricObject';
import { saveObjectTransform } from '../packages/core/src/util/misc/objectTransforms';
import { degreesToRadians } from '../packages/core/src/util/misc/radiansDegreesConversion';

const SVG_NS = 'http://www.w3.org/2000/svg';

export function createSVGElement<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs?: Record<string, string | number>,
): SVGElementTagNameMap[K];
export function createSVGElement(
  tag: string,
  attrs?: Record<string, string | number>,
): SVGElement;
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
  const defaults: Omit<typeof BASE_OBJECT_PROPS, keyof T | 'type'> =
    BASE_OBJECT_PROPS;
  return {
    ...defaults,
    type,
    ...shapeProps,
  };
}

export function makeRect(options: Record<string, unknown> = {}) {
  return new Rect({ width: 10, height: 10, ...options });
}

const RECT_FIXTURES = [
  { top: 105, left: 115, width: 30, height: 10 },
  { top: 140, left: 55, width: 10, height: 40 },
  { top: 60, left: 10, width: 20, height: 40 },
  { top: 95, left: 95, width: 40, height: 40 },
];

export function makeRects(
  count: number,
  options: Record<string, unknown> = {},
) {
  return Array.from({ length: count }, (_, i) => {
    const fixture = RECT_FIXTURES[i] ?? {
      top: 50 * (i + 1),
      left: 50 * (i + 1),
      width: 20,
      height: 20,
    };
    return new Rect({ ...fixture, ...options });
  });
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
): MouseEvent {
  return {
    clientX: 0,
    clientY: 0,
    which: 1,
    bubbles: true,
    ...options,
  } as MouseEvent;
}

export const createLayoutEvent = (
  target: FabricObject,
): BasicTransformEvent &
  ModifiedEvent &
  ModifyPathEvent &
  ITextEvents['changed'] => ({
  target,
  e: new MouseEvent('mousemove'),
  pointer: new Point(),
  action: 'drag',
  index: 0,
  commandIndex: 0,
  pointIndex: 0,
  transform: {
    target,
    ...saveObjectTransform(target),
    corner: 'tl',
    offsetX: 0,
    offsetY: 0,
    originX: target.originX,
    originY: target.originY,
    ex: 0,
    ey: 0,
    lastX: 0,
    lastY: 0,
    theta: degreesToRadians(target.angle),
    width: target.width,
    height: target.height,
    shiftKey: false,
    altKey: false,
    original: {
      ...saveObjectTransform(target),
      originX: target.originX,
      originY: target.originY,
    },
    actionPerformed: true,
  },
});
