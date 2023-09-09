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

export type LayoutTrigger =
  | 'initialization'
  | 'object_modifying'
  | 'object_modified'
  | 'added'
  | 'removed'
  | 'imperative';

/**
 * positioning and layout data **relative** to instance's parent
 */
export type LayoutStrategyResult = {
  /**
   * new centerX as measured by the **containing** plane (same as `left` with `originX` set to `center`)
   */
  centerX: number;
  /**
   * new centerY as measured by the **containing** plane (same as `top` with `originY` set to `center`)
   */
  centerY: number;
  /**
   * correctionX to translate objects by, measured as `centerX`
   *
   * Since objects are measured relative to the group's center, once the group's size changes we must apply a correction to
   * the objects' positions so that they relate to the new center.
   * In other words, this value makes it possible to layout objects relative to the tl corner, for instance, but not only.
   *
   * @see `relativeCorrectionX`
   */
  correctionX?: number;
  /**
   * correctionY to translate objects by, measured as `centerY`
   *
   * Since objects are measured relative to the group's center, once the group's size changes we must apply a correction to
   * the objects' positions so that they relate to the new center.
   * In other words, this value makes it possible to layout objects relative to the tl corner, for instance, but not only.
   *
   * @see `relativeCorrectionY`
   */
  correctionY?: number;
  /**
   * correctionX to translate objects by as measured by the plane
   * @see `correctionX`
   */
  relativeCorrectionX?: number;
  /**
   * correctionY to translate objects by as measured by the plane
   * @see `correctionY`
   */
  relativeCorrectionY?: number;
  /**
   * new width of instance
   */
  width: number;
  /**
   * new height of instance
   */
  height: number;
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

export type ImperativeLayoutOptions = {
  strategy?: LayoutStrategy;
  overrides?: LayoutStrategyResult;
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
  type: 'initialization';
  objectsRelativeToGroup?: boolean;
  targets: FabricObject[];
  x?: number;
  y?: number;
};

export type CollectionChangeLayoutContext = CommonLayoutContext & {
  type: 'added' | 'removed';
  targets: FabricObject[];
};

export type ObjectModifiedLayoutContext = CommonLayoutContext & {
  type: 'object_modified';
  trigger: 'modified';
  e: ModifiedEvent;
};

export type ObjectModifyingLayoutContext =
  | CommonLayoutContext & {
      type: 'object_modifying';
    } & (
        | {
            trigger: TModificationEvents;
            e: BasicTransformEvent & { target: FabricObject };
          }
        | {
            trigger: 'text:changed';
            e: ITextEvents['changed'] & { target: FabricObject };
          }
      );

export type ImperativeLayoutContext = CommonLayoutContext & {
  type: 'imperative';
  overrides?: LayoutStrategyResult;
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
  strategyChange: boolean;
};

export type LayoutBeforeEvent = {
  context: StrictLayoutContext;
};

export type LayoutEvent = {
  context: StrictLayoutContext;
  /**
   * will be undefined if layout was skipped
   */
  result?: LayoutResult;
};
