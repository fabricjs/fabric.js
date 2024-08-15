import { Point } from '../../Point';
import type { FabricObject } from '../../shapes/Object/FabricObject';
import { makeBoundingBoxFromPoints } from '../../util/misc/boundingBoxFromPoints';
import {
  LAYOUT_TYPE_INITIALIZATION,
  LAYOUT_TYPE_IMPERATIVE,
} from '../constants';
import type {
  InitializationLayoutContext,
  LayoutStrategyResult,
  StrictLayoutContext,
} from '../types';
import { getObjectBounds } from './utils';

/**
 * Exposes a main public method {@link calcLayoutResult} that is used by the `LayoutManager` to perform layout.
 * Returning `undefined` signals the `LayoutManager` to skip the layout.
 *
 * In charge of calculating the bounding box of the passed objects.
 */
export abstract class LayoutStrategy {
  /**
   * override by subclass for persistence (TS does not support `static abstract`)
   */
  static type = 'strategy';

  /**
   * Used by the `LayoutManager` to perform layout
   * @TODO/fix: if this method is calcResult, should calc unconditionally.
   * the condition to not calc should be evaluated by the layoutManager.
   * @returns layout result **OR** `undefined` to skip layout
   */
  public calcLayoutResult(
    context: StrictLayoutContext,
    objects: FabricObject[],
  ): LayoutStrategyResult | undefined {
    if (this.shouldPerformLayout(context)) {
      return this.calcBoundingBox(objects, context);
    }
  }

  shouldPerformLayout({ type, prevStrategy, strategy }: StrictLayoutContext) {
    return (
      type === LAYOUT_TYPE_INITIALIZATION ||
      type === LAYOUT_TYPE_IMPERATIVE ||
      (!!prevStrategy && strategy !== prevStrategy)
    );
  }

  shouldLayoutClipPath({ type, target: { clipPath } }: StrictLayoutContext) {
    return (
      type !== LAYOUT_TYPE_INITIALIZATION &&
      clipPath &&
      !clipPath.absolutePositioned
    );
  }

  getInitialSize(
    context: StrictLayoutContext & InitializationLayoutContext,
    result: Pick<LayoutStrategyResult, 'center' | 'size'>,
  ) {
    return result.size;
  }

  /**
   * Override this method to customize layout.
   */
  calcBoundingBox(
    objects: FabricObject[],
    context: StrictLayoutContext,
  ): LayoutStrategyResult | undefined {
    const { type, target } = context;
    if (type === LAYOUT_TYPE_IMPERATIVE && context.overrides) {
      return context.overrides;
    }
    if (objects.length === 0) {
      return;
    }
    const { left, top, width, height } = makeBoundingBoxFromPoints(
      objects
        .map((object) => getObjectBounds(target, object))
        .reduce<Point[]>((coords, curr) => coords.concat(curr), []),
    );
    const bboxSize = new Point(width, height);
    const bboxLeftTop = new Point(left, top);
    const bboxCenter = bboxLeftTop.add(bboxSize.scalarDivide(2));

    if (type === LAYOUT_TYPE_INITIALIZATION) {
      const actualSize = this.getInitialSize(context, {
        size: bboxSize,
        center: bboxCenter,
      });
      return {
        // in `initialization` we do not account for target's transformation matrix
        center: bboxCenter,
        // TODO: investigate if this is still necessary
        relativeCorrection: new Point(0, 0),
        size: actualSize,
      };
    } else {
      //  we send `relativeCenter` up to group's containing plane
      const center = bboxCenter.transform(target.calcOwnMatrix());
      return {
        center,
        size: bboxSize,
      };
    }
  }
}
