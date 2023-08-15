import type { ModifiedEvent } from '../EventTypeDefs';
import type { Point } from '../Point';
import type { Group } from '../shapes/Group';
import type { FabricObject } from '../shapes/Object/FabricObject';
import type { LayoutResolver } from './resolvers/LayoutResolver';

export type LayoutContextType =
  | 'initialization'
  | 'object_modified'
  | 'added'
  | 'removed'
  | 'imperative';

export type LayoutContext = {
  target: Group;
  prevResolver?: LayoutResolver;
  resolver?: LayoutResolver;
  type: LayoutContextType;
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
      context?: Partial<LayoutResolverResult>;
    }
);

export type StrictLayoutContext = LayoutContext & {
  resolver: LayoutResolver;
};

export type LayoutBeforeEvent = {
  context: LayoutContext;
};

export type LayoutEvent = {
  context: LayoutContext;
} & LayoutResult;

/**
 * positioning and layout data **relative** to instance's parent
 */
export type LayoutResolverResult = {
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
  result?: LayoutResolverResult;
  prevCenter: Point;
  nextCenter: Point;
  offset: Point;
};

export type ImperativeLayoutContext = Partial<LayoutResolverResult> &
  (
    | { resolver?: LayoutResolver; once?: never }
    | { resolver: LayoutResolver; once?: boolean }
  );
