import { Point } from '../../Point';
import type {
  InitializationLayoutContext,
  LayoutStrategyResult,
  StrictLayoutContext,
} from '../types';
import { LayoutStrategy } from './LayoutStrategy';
import { classRegistry } from '../../ClassRegistry';
import type { FabricObject } from '../../shapes/Object/FabricObject';
import { LAYOUT_TYPE_IMPERATIVE } from '../constants';

/**
 * Layout will keep target's initial size.
 */
export class FixedLayout extends LayoutStrategy {
  static readonly type = 'fixed';

  /**
   * @override respect target's initial size
   */
  getInitialSize(
    { target }: StrictLayoutContext & InitializationLayoutContext,
    { size }: Pick<LayoutStrategyResult, 'center' | 'size'>,
  ): Point {
    return new Point(target.width || size.x, target.height || size.y);
  }

  calcBoundingBox(objects: FabricObject[], context: StrictLayoutContext) {
    if (
      context.type === LAYOUT_TYPE_IMPERATIVE &&
      !context.overrides &&
      objects.length > 0
    ) {
      const { target } = context;
      if (!target.width || !target.height) {
        const result = super.calcBoundingBox(objects, context);
        if (!result) {
          return;
        }
        // Use the content center until both dimensions have been established,
        // as with an initially empty group laid out for the first time.
        return {
          ...result,
          size: new Point(
            target.width || result.size.x,
            target.height || result.size.y,
          ),
        };
      }
      return {
        center: target.getRelativeCenterPoint(),
        size: new Point(target.width, target.height),
      };
    }
    return super.calcBoundingBox(objects, context);
  }
}

classRegistry.setClass(FixedLayout);
