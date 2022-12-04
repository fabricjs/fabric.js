import type { Control } from './controls/control.class';
import type { Point } from './point.class';
import type { FabricObject } from './shapes/fabricObject.class';
import type { Group } from './shapes/group.class';
import type { TOriginX, TOriginY, TRadian } from './typedefs';
import type { saveObjectTransform } from './util/misc/objectTransforms';
import type { Canvas } from './__types__';
import type { IText } from './shapes/itext.class';
import type { StaticCanvas } from './static_canvas.class';

export type ModifierKey = 'altKey' | 'shiftKey' | 'ctrlKey';

export type TPointerEvent = MouseEvent | TouchEvent;

export type TransformAction<T extends Transform = Transform, R = void> = (
  eventData: TPointerEvent,
  transform: T,
  x: number,
  y: number
) => R;

export type TransformActionHandler<T extends Transform = Transform> =
  TransformAction<T, boolean>;

export type ControlCallback<R = void> = (
  eventData: TPointerEvent,
  control: Control,
  fabricObject: FabricObject
) => R;

export type ControlCursorCallback = ControlCallback<string>;

/**
 * relative to target's containing coordinate plane
 * both agree on every point
 */
export type Transform = {
  target: FabricObject;
  action: string;
  actionHandler: TransformActionHandler;
  corner: string;
  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;
  offsetX: number;
  offsetY: number;
  originX: TOriginX;
  originY: TOriginY;
  ex: number;
  ey: number;
  lastX: number;
  lastY: number;
  theta: TRadian;
  width: number;
  height: number;
  shiftKey: boolean;
  altKey: boolean;
  original: ReturnType<typeof saveObjectTransform>;
};

export type TEvent<E extends Event = TPointerEvent> = {
  e: E;
};

export type BasicTransformEvent<E extends Event = TPointerEvent> = TEvent<E> & {
  transform: Transform;
  pointer: Point;
};

export type TModificationEvents =
  | 'moving'
  | 'scaling'
  | 'rotating'
  | 'skewing'
  | 'resizing';

type ObjectModifiedEvents = Record<TModificationEvents, BasicTransformEvent> & {
  modified: BasicTransformEvent | never;
};

type CanvasModifiedEvents = Record<
  `object:${keyof ObjectModifiedEvents}`,
  BasicTransformEvent & { target: FabricObject }
>;

export type TransformEvent<T extends Event = TPointerEvent> =
  BasicTransformEvent<T> & {
    target: FabricObject;
    subTargets: FabricObject[];
    button: number;
    isClick: boolean;
    pointer: Point;
    absolutePointer: Point;
  };

type SimpleEventHandler<T extends Event = TPointerEvent> = TEvent<T> & {
  target: FabricObject;
  subTargets: FabricObject[];
};

type InEvent = {
  previousTarget?: FabricObject;
};

type OutEvent = {
  nextTarget?: FabricObject;
};

type DragEventData = TEvent<DragEvent> & {
  target: FabricObject;
  subTargets?: FabricObject[];
  dragSource?: FabricObject;
  canDrop?: boolean;
  dropTarget?: FabricObject;
};

type DropEventData = DragEventData & { pointer: Point };

type DnDEvents = {
  dragstart: TEvent<DragEvent> & { target: FabricObject };
  drag: DragEventData;
  dragover: DragEventData;
  dragenter: DragEventData & InEvent;
  dragleave: DragEventData & OutEvent;
  dragend: DragEventData;
  'drop:before': DropEventData;
  drop: DropEventData;
  'drop:after': DropEventData;
};

type CanvasDnDEvents = DnDEvents & {
  'drag:enter': DragEventData & InEvent;
  'drag:leave': DragEventData & OutEvent;
};

type CanvasSelectionEvents = {
  'selection:created': TEvent & {
    selected: FabricObject[];
  };
  'selection:updated': TEvent & {
    selected: FabricObject[];
    deselected: FabricObject[];
  };
  'before:selection:cleared': Partial<TEvent> & {
    deselected: FabricObject[];
  };
  'selection:cleared': Partial<TEvent> & {
    deselected: FabricObject[];
  };
};

type CollectionEvents = {
  'object:added': { target: FabricObject };
  'object:removed': { target: FabricObject };
};

type BeforeSuffix<T extends string> = `${T}:before`;
type WithBeforeSuffix<T extends string> = T | BeforeSuffix<T>;

type TPointerEvents<Prefix extends string, E = Record<string, never>> = Record<
  `${Prefix}${
    | WithBeforeSuffix<'down'>
    | WithBeforeSuffix<'move'>
    | WithBeforeSuffix<'up'>
    | 'dblclick'}`,
  TransformEvent & E
> &
  Record<`${Prefix}wheel`, TransformEvent<WheelEvent> & E> &
  Record<`${Prefix}over`, TransformEvent & InEvent & E> &
  Record<`${Prefix}out`, TransformEvent & OutEvent & E>;

export type ObjectPointerEvents = TPointerEvents<'mouse'>;
export type CanvasPointerEvents = TPointerEvents<'mouse:'>;

export type ObjectEvents = ObjectPointerEvents &
  DnDEvents &
  ObjectModifiedEvents & {
    // selection
    selected: {
      e: TEvent;
      target: FabricObject;
    };
    deselected: {
      e?: TEvent;
      target: FabricObject;
    };

    // tree
    added: { target: Group | Canvas | StaticCanvas };
    removed: { target: Group | Canvas | StaticCanvas };

    // erasing
    'erasing:end': { path: FabricObject };
  };

export type StaticCanvasEvents = CollectionEvents & {
  // tree
  'canvas:cleared': never;

  // rendering
  'before:render': { ctx: CanvasRenderingContext2D };
  'after:render': { ctx: CanvasRenderingContext2D };
};

export type CanvasEvents = StaticCanvasEvents &
  CanvasPointerEvents &
  CanvasDnDEvents &
  CanvasModifiedEvents &
  CanvasSelectionEvents & {
    // brushes
    'before:path:created': { path: FabricObject };
    'path:created': { path: FabricObject };

    // erasing
    'erasing:start': never;
    'erasing:end':
      | never
      | {
          path: FabricObject;
          targets: FabricObject[];
          subTargets: FabricObject[];
          drawables: {
            backgroundImage?: FabricObject;
            overlayImage?: FabricObject;
          };
        };

    // IText
    'text:selection:changed': { target: IText };
    'text:changed': { target: IText };
    'text:editing:entered': { target: IText };
    'text:editing:exited': { target: IText };

    // misc
    'contextmenu:before': SimpleEventHandler<Event>;
    contextmenu: SimpleEventHandler<Event>;
  };
