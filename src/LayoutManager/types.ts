import type { ModifiedEvent } from '../EventTypeDefs';
import type { Point } from '../Point';
import type { Group } from '../shapes/Group';
import type { FabricObject } from '../shapes/Object/FabricObject';
import type { LayoutStrategy } from './LayoutStrategies/LayoutStrategy';

export type LayoutContextTrigger =
  | 'initialization'
  | 'object_modified'
  | 'added'
  | 'removed'
  | 'imperative';

/**
 * positioning and layout data **relative** to instance's parent
 */
export type LayoutStrategyResult = {
  /**
   * new centerX as measured by the containing plane (same as `left` with `originX` set to `center`)
   */
  centerX: number;
  /**
   * new centerY as measured by the containing plane (same as `top` with `originY` set to `center`)
   */
  centerY: number;
  /**
   * correctionX to translate objects by, measured as `centerX`
   */
  correctionX?: number;
  /**
   * correctionY to translate objects by, measured as `centerY`
   */
  correctionY?: number;
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
  offset: Point;
};

export type ImperativeLayoutContext = {
  strategy?: LayoutStrategy;
  overrides: Partial<LayoutStrategyResult>;
};

export type LayoutContext = {
  target: Group;
  strategy?: LayoutStrategy;
  type: LayoutContextTrigger;
  /**
   * array of objects starting from the object that triggered the call to the current one
   */
  path?: Group[];
  [key: string]: any;
} & (
  | {
      type: 'initialization';
      objectsRelativeToGroup?: boolean;
    }
  | {
      type: 'added' | 'removed';
      targets: FabricObject[];
    }
  | ({
      type: 'object_modified';
    } & ModifiedEvent)
  | {
      type: 'imperative';
      overrides?: Partial<LayoutStrategyResult>;
    }
);

export type StrictLayoutContext = LayoutContext & {
  strategy: LayoutStrategy;
  prevStrategy?: LayoutStrategy;
  strategyChange: boolean;
};

export type LayoutBeforeEvent = {
  context: LayoutContext;
};

export type LayoutEvent = {
  context: LayoutContext;
} & LayoutResult;
