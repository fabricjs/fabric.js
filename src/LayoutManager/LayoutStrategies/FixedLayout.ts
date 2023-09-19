import { Point } from '../../Point';
import type {
  InitializationLayoutContext,
  LayoutStrategyResult,
  StrictLayoutContext,
} from '../types';
import { LayoutStrategy } from './LayoutStrategy';

export class FixedLayout extends LayoutStrategy {
  static readonly type = 'fixed';

  /**
   * @override respect target's initial size
   */
  getInitialSize(
    { target }: StrictLayoutContext & InitializationLayoutContext,
    { size }: Pick<LayoutStrategyResult, 'center' | 'size'>
  ): Point {
    return new Point(target.width || size.x, target.height || size.y);
  }
}
