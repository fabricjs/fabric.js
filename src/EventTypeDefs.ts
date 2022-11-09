import { Point } from './point.class';
import { FabricObject } from './shapes/fabricObject.class';
import { Group, LayoutEventData } from './shapes/group.class';
import { TEvent, TransformEvent, TPointerEvent } from './typedefs';
import { Canvas } from './__types__';

export type TModificationEvents =
  | 'moving'
  | 'scaling'
  | 'rotating'
  | 'skewing'
  | 'resizing';

type ObjectModifiedEvents = Record<TModificationEvents, TransformEvent> & {
  modified: TransformEvent | never;
};

type CanvasModifiedEvents = Record<
  `object:${keyof ObjectModifiedEvents}`,
  TransformEvent & { target: FabricObject }
>;

export type XTransformEvent<T extends Event = TPointerEvent> =
  TransformEvent<T> & {
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

type BeforeSuffix<T extends string> = `${T}:before`;
type WithBeforeSuffix<T extends string> = T | BeforeSuffix<T>;

type TPointerEvents<Prefix extends string, E = Record<string, never>> = Record<
  `${Prefix}${
    | WithBeforeSuffix<'down'>
    | WithBeforeSuffix<'move'>
    | WithBeforeSuffix<'up'>
    | 'dblclick'}`,
  XTransformEvent & E
> &
  Record<`${Prefix}wheel`, XTransformEvent<WheelEvent> & E> &
  Record<`${Prefix}over`, XTransformEvent & InEvent & E> &
  Record<`${Prefix}out`, XTransformEvent & OutEvent & E>;

export type ObjectPointerEvents = TPointerEvents<'mouse'>;
export type CanvasPointerEvents = TPointerEvents<'mouse:'>;

export type TCanvasEvents = CanvasPointerEvents &
  CanvasDnDEvents &
  CanvasModifiedEvents &
  CanvasSelectionEvents & {
    // tree
    'object:added': { target: FabricObject };
    'object:removed': { target: FabricObject };
    'canvas:cleared': never;

    // rendering
    'before:render': { ctx: CanvasRenderingContext2D };
    'after:render': { ctx: CanvasRenderingContext2D };

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
    'text:selection:changed': { target: FabricObject };
    'text:changed': { target: FabricObject };

    // misc
    'contextmenu:before': SimpleEventHandler<Event>;
    contextmenu: SimpleEventHandler<Event>;
  };

export type TObjectEvents = ObjectPointerEvents &
  DnDEvents &
  ObjectModifiedEvents & {
    // selection
    selected: never;
    deselected: never;

    // tree
    added: { target: Group | Canvas };
    removed: { target: Group | Canvas };

    // IText
    'selection:changed': never;
    changed: never;
    tripleclick: XTransformEvent;

    // Group
    layout: LayoutEventData;

    // erasing
    'erasing:end': { path: FabricObject };
  };
