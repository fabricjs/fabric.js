import type { Control } from './controls/Control';
import type { Point } from './Point';
import type { FabricObject } from './shapes/Object/FabricObject';
import type { Group } from './shapes/Group';
import type { TOriginX, TOriginY, TRadian } from './typedefs';
import type { saveObjectTransform } from './util/misc/objectTransforms';
import type { Canvas } from './canvas/Canvas';
import type { IText } from './shapes/IText/IText';
import type { StaticCanvas } from './canvas/StaticCanvas';
import type {
  LayoutBeforeEvent,
  LayoutAfterEvent,
} from './LayoutManager/types';

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
  original: ReturnType<typeof saveObjectTransform> & {
    originX: TOriginX;
    originY: TOriginY;
  };
  // @TODO: investigate if this reset is really needed
  reset?: boolean;
  actionPerformed: boolean;
};

export interface TEvent<E extends Event = TPointerEvent> {
  e: E;
}

interface TEventWithTarget<E extends Event = TPointerEvent> extends TEvent<E> {
  target: FabricObject;
}

export interface BasicTransformEvent<E extends Event = TPointerEvent>
  extends TEvent<E> {
  transform: Transform;
  pointer: Point;
}

export type TModificationEvents =
  | 'moving'
  | 'scaling'
  | 'rotating'
  | 'skewing'
  | 'resizing'
  | 'modifyPoly';

export interface ModifiedEvent<E extends Event = TPointerEvent>
  extends TEvent<E> {
  transform: Transform;
  target: FabricObject;
  action: string;
}

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

export interface TPointerEventInfo<E extends TPointerEvent = TPointerEvent>
  extends TEvent<E> {
  target?: FabricObject;
  subTargets?: FabricObject[];
  transform?: Transform | null;
  /**
   * @deprecated
   * use viewportPoint instead.
   * Kept for compatibility
   */
  pointer: Point;
  /**
   * @deprecated
   * use scenePoint instead.
   * Kept for compatibility
   */
  absolutePointer: Point;
  scenePoint: Point;
  viewportPoint: Point;
}

interface SimpleEventHandler<T extends Event = TPointerEvent>
  extends TEvent<T> {
  target?: FabricObject;
  subTargets: FabricObject[];
}

interface InEvent {
  previousTarget?: FabricObject;
}

interface OutEvent {
  nextTarget?: FabricObject;
}

export interface DragEventData extends TEvent<DragEvent> {
  target?: FabricObject;
  subTargets?: FabricObject[];
  dragSource?: FabricObject;
  canDrop?: boolean;
  didDrop?: boolean;
  dropTarget?: FabricObject;
}

export interface DropEventData extends DragEventData {
  /**
   * @deprecated
   * use viewportPoint instead.
   * Kept for compatibility
   */
  pointer: Point;
  /**
   * @deprecated
   * use scenePoint instead.
   * Kept for compatibility
   */
  absolutePointer: Point;
  scenePoint: Point;
  viewportPoint: Point;
}

interface DnDEvents {
  dragstart: TEventWithTarget<DragEvent>;
  drag: DragEventData;
  dragover: DragEventData;
  dragenter: DragEventData & InEvent;
  dragleave: DragEventData & OutEvent;
  dragend: DragEventData;
  'drop:before': DropEventData;
  drop: DropEventData;
  'drop:after': DropEventData;
}

interface CanvasDnDEvents extends DnDEvents {
  'drag:enter': DragEventData & InEvent;
  'drag:leave': DragEventData & OutEvent;
}

interface CanvasSelectionEvents {
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
}

export interface CollectionEvents {
  'object:added': { target: FabricObject };
  'object:removed': { target: FabricObject };
}

type BeforeSuffix<T extends string> = `${T}:before`;
type WithBeforeSuffix<T extends string> = T | BeforeSuffix<T>;

type TPointerEvents<Prefix extends string> = Record<
  `${Prefix}${
    | WithBeforeSuffix<'down'>
    | WithBeforeSuffix<'move'>
    | 'dblclick'}`,
  TPointerEventInfo
> &
  Record<
    `${Prefix}${WithBeforeSuffix<'up'>}`,
    TPointerEventInfo & {
      isClick: boolean;
      currentTarget?: FabricObject;
      currentSubTargets: FabricObject[];
    }
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

export interface MiscEvents {
  'contextmenu:before': SimpleEventHandler<Event>;
  contextmenu: SimpleEventHandler<Event>;
}

export interface ObjectEvents
  extends ObjectPointerEvents,
    DnDEvents,
    MiscEvents,
    ObjectModificationEvents {
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
}

export interface StaticCanvasEvents extends CollectionEvents {
  // tree
  'canvas:cleared': never;

  // rendering
  'before:render': { ctx: CanvasRenderingContext2D };
  'after:render': { ctx: CanvasRenderingContext2D };
  'object:layout:before': LayoutBeforeEvent & { target: Group };
  'object:layout:after': LayoutAfterEvent & { target: Group };
}

export interface CanvasEvents
  extends StaticCanvasEvents,
    CanvasPointerEvents,
    CanvasDnDEvents,
    MiscEvents,
    CanvasModificationEvents,
    CanvasSelectionEvents {
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
}
