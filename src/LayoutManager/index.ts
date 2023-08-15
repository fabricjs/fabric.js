import { Point } from '../Point';
import { CENTER } from '../constants';
import type { Group } from '../shapes/Group';
import type { FabricObject } from '../shapes/Object/FabricObject';
import { invertTransform } from '../util/misc/matrix';
import type {
  LayoutContext,
  LayoutResult,
  LayoutStrategy,
  LayoutStrategyResult,
  PassedLayoutContext,
} from './types';

export class LayoutManager {
  private _firstLayoutDone = false;

  protected target: Group;

  constructor(protected layout: LayoutStrategy = 'fit-content') {}

  attach(target: Group) {
    this.target = target;
  }

  /**
   * @public
   * @param {Partial<LayoutStrategyResult> & { layout?: string }} [context] pass values to use for layout calculations
   */
  public triggerLayout<T extends LayoutStrategy>(
    context?: Partial<LayoutStrategyResult> &
      ({ layout?: T; once?: never } | { layout: T; once?: boolean })
  ) {
    const prevLayout = this.layout;
    if (context?.layout && context.layout !== prevLayout && !context.once) {
      this.layout = context.layout;
    }
    this.performLayout({
      type: 'imperative',
      context: {
        ...context,
        prevLayout,
      },
    });
  }

  /**
   * initial layout logic:
   * calculate bbox of objects (if necessary) and translate it according to options received from the constructor (left, top, width, height)
   * so it is placed in the center of the bbox received from the constructor
   *
   * @param {LayoutContext} context
   */
  performLayout(context: LayoutContext) {
    let bubblingContext: LayoutResult | undefined;
    if (!this._firstLayoutDone && context.type !== 'initialization') {
      //  reject layout requests before initialization layout
      return;
    }
    const { result, ...rest } = this.getLayoutResult({
      layout: this.layout,
      ...context,
    });
    if (!this._firstLayoutDone) {
      if (result) {
        this.commitLayout(context, { result, ...rest });
        bubblingContext = { result, ...rest };
      } else {
        const {
          prevCenter: { x: centerX, y: centerY },
        } = rest;
        bubblingContext = {
          ...rest,
          result: {
            centerX,
            centerY,
            width: this.target.width,
            height: this.target.height,
          },
        };
      }

      this._firstLayoutDone = true;
    } else if (result) {
      this.commitLayout(context, { result, ...rest });
      bubblingContext = { result, ...rest };
    }
    bubblingContext && this.onLayout(context, bubblingContext);
  }

  protected getLayoutResult(context: PassedLayoutContext): LayoutResult {
    const prevCenter = this.target.getRelativeCenterPoint();
    const result = context.resolve(
      context.layout,
      this.target.getObjects(),
      context
    );
    if (!result) {
      return {
        result,
        prevCenter,
        nextCenter: prevCenter,
        offset: new Point(),
      };
    }
    const nextCenter = new Point(result.centerX, result.centerY);
    const correction = new Point(
      result.correctionX ?? 0,
      result.correctionY ?? 0
    );
    const vector = prevCenter.subtract(nextCenter).add(correction);
    const offset = vector.transform(
      invertTransform(this.target.calcOwnMatrix()),
      true
    );
    return { result, prevCenter, nextCenter, offset };
  }

  protected commitLayout(
    context: LayoutContext,
    layoutResult: Required<LayoutResult>
  ) {
    const { target } = this;
    const {
      result: { width, height },
      prevCenter,
      nextCenter,
    } = layoutResult;
    // set dimensions
    target.set({ width, height });
    this.layoutChildren(context, layoutResult);
    //  set position
    if (!nextCenter.eq(prevCenter)) {
      target.setPositionByOrigin(nextCenter, CENTER, CENTER);
      target.setCoords();
    }
  }

  protected layoutChildren(
    context: LayoutContext,
    { offset }: Required<LayoutResult>
  ) {
    const { target } = this;
    //  adjust objects to account for new center
    !context.objectsRelativeToGroup &&
      target.forEachObject((object) => {
        object.group === target && this.adjustObjectPosition(object, offset);
      });
    // adjust clip path to account for new center
    context.type !== 'initialization' &&
      context.layout !== 'clip-path' &&
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
    const { target } = this;

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
      target.group.layoutManager.performLayout(context);
    }
  }

  toJSON() {
    return { layout: this.layout };
  }
}
