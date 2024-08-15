import type {
  BasicTransformEvent,
  ModifiedEvent,
  TModificationEvents,
} from '../EventTypeDefs';
import type { Point } from '../Point';
import type { Group } from '../shapes/Group';
import type { ITextEvents } from '../shapes/IText/ITextBehavior';
import type { FabricObject } from '../shapes/Object/FabricObject';
import type { LayoutStrategy } from './LayoutStrategies/LayoutStrategy';
import type {
  LAYOUT_TYPE_INITIALIZATION,
  LAYOUT_TYPE_ADDED,
  LAYOUT_TYPE_IMPERATIVE,
  LAYOUT_TYPE_REMOVED,
  LAYOUT_TYPE_OBJECT_MODIFIED,
  LAYOUT_TYPE_OBJECT_MODIFYING,
} from './constants';

export type LayoutTrigger =
  | typeof LAYOUT_TYPE_INITIALIZATION
  | typeof LAYOUT_TYPE_OBJECT_MODIFYING
  | typeof LAYOUT_TYPE_OBJECT_MODIFIED
  | typeof LAYOUT_TYPE_ADDED
  | typeof LAYOUT_TYPE_REMOVED
  | typeof LAYOUT_TYPE_IMPERATIVE;

export type LayoutStrategyResult = {
  /**
   * new center point as measured by the **containing** plane (same as `left` with `originX` set to `center`)
   */
  center: Point;

  /**
   * correction vector to translate objects by, measured in the same plane as `center`
   *
   * Since objects are measured relative to the group's center, once the group's size changes we must apply a correction to
   * the objects' positions so that they relate to the new center.
   * In other words, this value makes it possible to layout objects relative to the tl corner, for instance, but not only.
   */
  correction?: Point;

  /**
   * correction vector to translate objects by as measured by the plane
   */
  relativeCorrection?: Point;

  /**
   * new width and height of the layout target
   */
  size: Point;
};

export type LayoutResult = {
  result?: LayoutStrategyResult;
  prevCenter: Point;
  nextCenter: Point;
  /**
   * The vector used to offset objects by, as measured by the plane
   */
  offset: Point;
};

type ImperativeLayoutCommonOptions = {
  overrides?: LayoutStrategyResult;
  bubbles?: boolean;
  deep?: boolean;
};

export type ImperativeLayoutOptions = ImperativeLayoutCommonOptions & {
  strategy?: LayoutStrategy;
};

export type CommonLayoutContext = {
  target: Group;
  strategy?: LayoutStrategy;
  type: LayoutTrigger;
  /**
   * array of objects starting from the object that triggered the call to the current one
   */
  path?: Group[];
};

export type InitializationLayoutContext = CommonLayoutContext & {
  type: typeof LAYOUT_TYPE_INITIALIZATION;
  targets: FabricObject[];
  x?: number;
  y?: number;
};

export type CollectionChangeLayoutContext = CommonLayoutContext & {
  type: typeof LAYOUT_TYPE_ADDED | typeof LAYOUT_TYPE_REMOVED;
  targets: FabricObject[];
};

export type ObjectModifiedLayoutContext = CommonLayoutContext & {
  type: typeof LAYOUT_TYPE_OBJECT_MODIFIED;
  trigger: 'modified';
  e: ModifiedEvent;
};

export type ObjectModifyingLayoutContext = CommonLayoutContext & {
  type: typeof LAYOUT_TYPE_OBJECT_MODIFYING;
} & (
    | {
        trigger: TModificationEvents;
        e: BasicTransformEvent;
      }
    | {
        trigger: 'changed';
        e: ITextEvents['changed'];
      }
  );

export type ImperativeLayoutContext = CommonLayoutContext &
  ImperativeLayoutCommonOptions & {
    type: typeof LAYOUT_TYPE_IMPERATIVE;
  };

export type LayoutContext =
  | InitializationLayoutContext
  | CollectionChangeLayoutContext
  | ObjectModifiedLayoutContext
  | ObjectModifyingLayoutContext
  | ImperativeLayoutContext;

export type StrictLayoutContext = LayoutContext & {
  strategy: LayoutStrategy;
  prevStrategy?: LayoutStrategy;
  bubbles: boolean;
  stopPropagation(): void;
};

export type RegistrationContext = {
  targets: FabricObject[];
  target: Group;
};

export type LayoutBeforeEvent = {
  context: StrictLayoutContext;
};

export type LayoutAfterEvent = {
  context: StrictLayoutContext;
  /**
   * will be undefined if layout was skipped
   */
  result?: LayoutResult;
};
