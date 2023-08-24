import { Point } from '../Point';
import { CENTER } from '../constants';
import type { FabricObject } from '../shapes/Object/FabricObject';
import { invertTransform } from '../util/misc/matrix';
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

    const strictContext: StrictLayoutContext = {
      strategy: this.strategy,
      prevStrategy: this._prevLayoutStrategy,
      strategyChange:
        !!this._prevLayoutStrategy &&
        this.strategy !== this._prevLayoutStrategy,
      ...context,
    };

    this.onBeforeLayout(strictContext);

    const layoutResult = this.getLayoutResult(strictContext);
    let bubblingContext: LayoutResult | undefined;

    if (layoutResult) {
      this.commitLayout(strictContext, layoutResult);
      bubblingContext = layoutResult;
    } else if (!this._firstLayoutDone) {
      const prevCenter = strictContext.target.getRelativeCenterPoint();
      bubblingContext = {
        prevCenter,
        nextCenter: prevCenter,
        offset: new Point(),
        result: {
          centerX: prevCenter.x,
          centerY: prevCenter.y,
          width: strictContext.target.width,
          height: strictContext.target.height,
        },
      };
    }

    this._firstLayoutDone = true;
    bubblingContext && this.onAfterLayout(strictContext, bubblingContext);
    this._prevLayoutStrategy = strictContext.strategy;
  }

  protected onBeforeLayout(context: StrictLayoutContext) {
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
    const relativeCorrection = new Point(
      result.relativeCorrectionX ?? 0,
      result.relativeCorrectionY ?? 0
    );
    const offset = prevCenter
      .subtract(nextCenter)
      .add(correction)
      .transform(invertTransform(target.calcOwnMatrix()), true)
      .add(relativeCorrection);
    return { result, prevCenter, nextCenter, offset };
  }

  protected commitLayout(
    context: StrictLayoutContext,
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
    this.layoutObjects(context, layoutResult);
    //  set position
    !nextCenter.eq(prevCenter) &&
      target.setPositionByOrigin(nextCenter, CENTER, CENTER);
    context.type !== 'initialization' && target.setCoords();
    target._set('dirty', true);
  }

  protected layoutObjects(
    context: StrictLayoutContext,
    layoutResult: Required<LayoutResult>
  ) {
    const { target } = context;
    //  adjust objects to account for new center
    !context.objectsRelativeToGroup &&
      target.forEachObject((object) => {
        object.group === target &&
          this.layoutObject(context, layoutResult, object);
      });
    // adjust clip path to account for new center
    context.strategy.shouldLayoutClipPath(context) &&
      target.clipPath &&
      !target.clipPath.absolutePositioned &&
      this.layoutObject(context, layoutResult, target.clipPath as FabricObject);
  }

  /**
   * @param {FabricObject} object
   * @param {Point} offset
   */
  protected layoutObject(
    context: StrictLayoutContext,
    { offset }: Required<LayoutResult>,
    object: FabricObject
  ) {
    object.setRelativeXY(object.getRelativeXY().add(offset));
  }

  protected onAfterLayout(
    context: StrictLayoutContext,
    layoutResult: LayoutResult
  ) {
    const { target } = context;

    //  fire layout hook and event (event will fire only for layouts after initialization layout)
    target.onAfterLayout({
      context,
      ...layoutResult,
    });
    target.fire('layout', {
      context,
      ...layoutResult,
    });

    //  bubble
    if (target.group?.layoutManager) {
      //  add target to context#path
      (context.path || (context.path = [])).push(target);
      //  all parents should invalidate their layout
      const parent = target.group;
      parent.layoutManager.performLayout({
        ...context,
        target: parent,
      });
    }
  }
}
