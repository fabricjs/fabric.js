import { Point } from '../Point';
import { CENTER } from '../constants';
import type { FabricObject } from '../shapes/Object/FabricObject';
import { invertTransform } from '../util/misc/matrix';
import { ClipPathLayout } from './LayoutStrategies/ClipPathLayout';
import { FitContentLayout } from './LayoutStrategies/FitContentLayout';
import type { LayoutStrategy } from './LayoutStrategies/LayoutStrategy';
import type { LayoutContext, LayoutResult, StrictLayoutContext } from './types';

export class LayoutManager {
  private _firstLayoutDone = false;
  private _prevLayoutStrategy?: LayoutStrategy;

  strategy: LayoutStrategy;

  constructor(strategy: LayoutStrategy = new FitContentLayout()) {
    this.strategy = strategy;
  }

  performLayout(context: LayoutContext) {
    if (!this._firstLayoutDone && context.type !== 'initialization') {
      //  reject layout requests before initialization layout
      return;
    }

    this.onBeforeLayout(context);

    const layoutResult = this.getLayoutResult({
      strategy: this.strategy,
      prevStrategy: this._prevLayoutStrategy,
      strategyChange:
        !!this._prevLayoutStrategy &&
        this.strategy !== this._prevLayoutStrategy,
      ...context,
    });
    let bubblingContext: LayoutResult | undefined;

    if (!this._firstLayoutDone) {
      if (layoutResult) {
        this.commitLayout(context, layoutResult);
        bubblingContext = layoutResult;
      } else {
        const prevCenter = context.target.getRelativeCenterPoint();
        bubblingContext = {
          prevCenter,
          nextCenter: prevCenter,
          offset: new Point(),
          result: {
            centerX: prevCenter.x,
            centerY: prevCenter.y,
            width: context.target.width,
            height: context.target.height,
          },
        };
      }
      this._firstLayoutDone = true;
    } else if (layoutResult) {
      this.commitLayout(context, layoutResult);
      bubblingContext = layoutResult;
    }

    bubblingContext && this.onLayout(context, bubblingContext);
    this._prevLayoutStrategy = context.strategy;
  }

  protected onBeforeLayout(context: LayoutContext) {
    const { target } = context;

    //  fire layout hook and event (event will fire only for layouts after initialization layout)
    target.onBeforeLayout({
      context,
    });
    target.fire('layout:before', {
      context,
    });
  }

  protected getLayoutResult(
    context: StrictLayoutContext
  ): Required<LayoutResult> | undefined {
    const { target } = context;
    const prevCenter = target.getRelativeCenterPoint();
    const result = context.strategy.calcLayoutResult(
      context,
      target.getObjects()
    );
    if (!result) {
      return;
    }
    const nextCenter = new Point(result.centerX, result.centerY);
    const correction = new Point(
      result.correctionX ?? 0,
      result.correctionY ?? 0
    );
    const vector = prevCenter.subtract(nextCenter).add(correction);
    const offset = vector.transform(
      invertTransform(target.calcOwnMatrix()),
      true
    );
    return { result, prevCenter, nextCenter, offset };
  }

  protected commitLayout(
    context: LayoutContext,
    layoutResult: Required<LayoutResult>
  ) {
    const { target } = context;
    const {
      result: { width, height },
      prevCenter,
      nextCenter,
    } = layoutResult;
    // set dimensions
    target.set({ width, height });
    // layout descendants
    this.layoutChildren(context, layoutResult);
    //  set position
    !nextCenter.eq(prevCenter) &&
      target.setPositionByOrigin(nextCenter, CENTER, CENTER);
    context.type !== 'initialization' && target.setCoords();
  }

  protected layoutChildren(
    context: LayoutContext,
    { offset }: Required<LayoutResult>
  ) {
    const { target } = context;
    //  adjust objects to account for new center
    !context.objectsRelativeToGroup &&
      target.forEachObject((object) => {
        object.group === target && this.adjustObjectPosition(object, offset);
      });
    // adjust clip path to account for new center
    context.type !== 'initialization' &&
      !(context.strategy instanceof ClipPathLayout) &&
      target.clipPath &&
      !target.clipPath.absolutePositioned &&
      this.adjustObjectPosition(target.clipPath as FabricObject, offset);
  }

  /**
   * @param {FabricObject} object
   * @param {Point} offset
   */
  protected adjustObjectPosition(object: FabricObject, offset: Point) {
    object.setRelativeXY(object.getRelativeXY().add(offset));
  }

  protected onLayout(context: LayoutContext, layoutData: LayoutResult) {
    const { target } = context;

    //  fire layout hook and event (event will fire only for layouts after initialization layout)
    target.onLayout({
      context,
      ...layoutData,
    });
    target.fire('layout', {
      context,
      ...layoutData,
    });

    //  bubble
    if (target.group?.layoutManager) {
      //  append the path recursion to context
      if (!context.path) {
        context.path = [];
      }
      context.path.push(target);
      //  all parents should invalidate their layout
      const parent = target.group;
      parent.layoutManager.performLayout({
        ...context,
        target: parent,
      });
    }
  }
}
