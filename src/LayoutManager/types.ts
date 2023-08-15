import type { Point } from '../Point';
import type { Group } from '../shapes/Group';
import type { LayoutResolver } from './resolvers/LayoutResolver';

export type LayoutContextType =
  | 'initialization'
  | 'object_modified'
  | 'added'
  | 'removed'
  | 'imperative';

export type LayoutContext = {
  prevResolver?: LayoutResolver;
  resolver?: LayoutResolver;
  type: LayoutContextType;
  /**
   * array of objects starting from the object that triggered the call to the current one
   */
  path?: Group[];
  [key: string]: any;
};

export type StrictLayoutContext = LayoutContext & {
  resolver: LayoutResolver;
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
