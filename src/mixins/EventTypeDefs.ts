import { Point } from '../point.class';
import { FabricObject } from '../shapes/fabricObject.class';
import { Group, LayoutEventData } from '../shapes/group.class';
import { TEvent, TransformEvent, TPointerEvent } from '../typedefs';
import { Canvas } from '../__types__';

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

export type TCanvasEvents = {
  // selection
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

  // tree
  'object:added': { target: FabricObject };
  'object:removed': { target: FabricObject };
  'canvas:cleared': never;

  // rendering
  'before:render': { ctx: CanvasRenderingContext2D };
  'after:render': { ctx: CanvasRenderingContext2D };

  // pointer
  'mouse:down:before': XTransformEvent;
  'mouse:down': XTransformEvent;
  'mouse:move:before': XTransformEvent;
  'mouse:move': XTransformEvent;
  'mouse:up:before': XTransformEvent;
  'mouse:up': XTransformEvent;
  'mouse:dblclick': XTransformEvent;
  'mouse:wheel': XTransformEvent<WheelEvent>;
  'mouse:over': XTransformEvent & InEvent;
  'mouse:out': XTransformEvent & OutEvent;

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
} & CanvasDnDEvents;

export type TObjectEvents = {
  selected: never;
  deselected: never;
  added: { target: Group | Canvas };
  removed: { target: Group | Canvas };

  // pointer events
  'mousedown:before': XTransformEvent;
  mousedown: XTransformEvent;
  'mousemove:before': XTransformEvent;
  mousemove: XTransformEvent;
  'mouseup:before': XTransformEvent;
  mouseup: XTransformEvent;
  mousedblclick: XTransformEvent;
  mousewheel: XTransformEvent<WheelEvent>;
  mouseover: XTransformEvent & InEvent;
  mouseout: XTransformEvent & OutEvent;

  // IText
  'selection:changed': never;
  changed: never;
  tripleclick: XTransformEvent;

  // Group
  layout: LayoutEventData;

  // erasing
  'erasing:end': { path: FabricObject };
} & DnDEvents;
