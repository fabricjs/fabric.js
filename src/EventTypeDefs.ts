import type { Control } from './controls/Control';
import type { Point } from './Point';
import type { FabricObject } from './shapes/Object/FabricObject';
import type { FabricObject as StaticFabricObject } from './shapes/Object/Object';
import type { FabricObjectSVGExportMixin } from './shapes/Object/FabricObjectSVGExportMixin';
import type { Group } from './shapes/Group';
import type { TOriginX, TOriginY, TRadian } from './typedefs';
import type { saveObjectTransform } from './util/misc/objectTransforms';
import type { Canvas } from './canvas/Canvas';
import type { IText } from './shapes/IText/IText';
import type { StaticCanvas } from './canvas/StaticCanvas';

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
export interface BaseFabricObject
  extends StaticFabricObject,
    FabricObjectSVGExportMixin {}

export type ModifierKey = keyof Pick<
  MouseEvent | PointerEvent | TouchEvent,
  'altKey' | 'shiftKey' | 'ctrlKey' | 'metaKey'
>;

export type TOptionalModifierKey = ModifierKey | null | undefined;

export type TPointerEvent = MouseEvent | TouchEvent | PointerEvent;

export type TransformAction<T extends Transform = Transform, R = void> = (
  eventData: TPointerEvent,
  transform: T,
  x: number,
  y: number
) => R;

/**
 * Control handlers that define a transformation
 * Those handlers run when the user starts a transform and during a transform
 */
export type TransformActionHandler<T extends Transform = Transform> =
  TransformAction<T, boolean>;

/**
 * Control handlers that run on control click/down/up
 * Those handlers run with or without a transform defined
 */
export type ControlActionHandler = TransformAction<Transform, any>;

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
  actionHandler?: TransformActionHandler;
  corner: string | 0;
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
  original: ReturnType<typeof saveObjectTransform> & {
    originX: TOriginX;
    originY: TOriginY;
  };
  // @TODO: investigate if this reset is really needed
  reset?: boolean;
  actionPerformed: boolean;
};

export type TEvent<E extends Event = TPointerEvent> = {
  e: E;
};

type TEventWithTarget<E extends Event = TPointerEvent> = TEvent<E> & {
  target: FabricObject;
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

export type ModifiedEvent<E extends Event = TPointerEvent> = TEvent<E> & {
  transform: Transform;
  target: FabricObject;
  action: string;
};

type ModificationEventsSpec<
  Prefix extends string = '',
  Modification = BasicTransformEvent,
  Modified = ModifiedEvent | never
> = Record<`${Prefix}${TModificationEvents}`, Modification> &
  Record<`${Prefix}modified`, Modified>;

type ObjectModificationEvents = ModificationEventsSpec;

type CanvasModificationEvents = ModificationEventsSpec<
  'object:',
  BasicTransformEvent & { target: FabricObject },
  ModifiedEvent | { target: FabricObject }
> & {
  'before:transform': TEvent & { transform: Transform };
};

export type TPointerEventInfo<E extends TPointerEvent = TPointerEvent> =
  TEvent<E> & {
    target?: FabricObject;
    subTargets?: FabricObject[];
    button?: number;
    isClick: boolean;
    pointer: Point;
    transform?: Transform | null;
    absolutePointer: Point;
    currentSubTargets?: FabricObject[];
    currentTarget?: FabricObject | null;
  };

type SimpleEventHandler<T extends Event = TPointerEvent> = TEvent<T> & {
  target?: FabricObject;
  subTargets: FabricObject[];
};

type InEvent = {
  previousTarget?: FabricObject;
};

type OutEvent = {
  nextTarget?: FabricObject;
};

export type DragEventData = TEvent<DragEvent> & {
  target?: FabricObject;
  subTargets?: FabricObject[];
  dragSource?: FabricObject;
  canDrop?: boolean;
  didDrop?: boolean;
  dropTarget?: FabricObject;
};

export type DropEventData = DragEventData & { pointer: Point };

type DnDEvents = {
  dragstart: TEventWithTarget<DragEvent>;
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
  'selection:created': Partial<TEvent> & {
    selected: FabricObject[];
  };
  'selection:updated': Partial<TEvent> & {
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

export type CollectionEvents = {
  'object:added': { target: StaticFabricObject };
  'object:removed': { target: StaticFabricObject };
};

type BeforeSuffix<T extends string> = `${T}:before`;
type WithBeforeSuffix<T extends string> = T | BeforeSuffix<T>;

type TPointerEvents<Prefix extends string> = Record<
  `${Prefix}${
    | WithBeforeSuffix<'down'>
    | WithBeforeSuffix<'move'>
    | WithBeforeSuffix<'up'>
    | 'dblclick'}`,
  TPointerEventInfo
> &
  Record<`${Prefix}wheel`, TPointerEventInfo<WheelEvent>> &
  Record<`${Prefix}over`, TPointerEventInfo & InEvent> &
  Record<`${Prefix}out`, TPointerEventInfo & OutEvent>;

export type TPointerEventNames =
  | WithBeforeSuffix<'down'>
  | WithBeforeSuffix<'move'>
  | WithBeforeSuffix<'up'>
  | 'dblclick'
  | 'wheel';

export type ObjectPointerEvents = TPointerEvents<'mouse'>;
export type CanvasPointerEvents = TPointerEvents<'mouse:'>;

export type MiscEvents = {
  'contextmenu:before': SimpleEventHandler<Event>;
  contextmenu: SimpleEventHandler<Event>;
};

export type ObjectEvents = ObjectPointerEvents &
  DnDEvents &
  MiscEvents &
  ObjectModificationEvents & {
    // selection
    selected: Partial<TEvent> & {
      target: FabricObject;
    };
    deselected: Partial<TEvent> & {
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
  MiscEvents &
  CanvasModificationEvents &
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
  };
