import { Point } from '../Point';
import { CENTER } from '../constants';
import type { Group } from '../shapes/Group';
import type { FabricObject } from '../shapes/Object/FabricObject';
import { invertTransform } from '../util/misc/matrix';
import { FitContentLayoutResolver } from './resolvers/FitContentLayoutResolver';
import type { LayoutResolver } from './resolvers/LayoutResolver';
import type {
  LayoutContext,
  LayoutResult,
  LayoutResolverResult,
  StrictLayoutContext,
} from './types';

export class LayoutManager {
  private _firstLayoutDone = false;

  protected target: Group;
  resolver: LayoutResolver;

  constructor(resolver: LayoutResolver = new FitContentLayoutResolver()) {
    this.resolver = resolver;
  }

  attach(target: Group) {
    this.target = target;
  }

  /**
   * @param {Partial<LayoutResolverResult> & { layout?: string }} [context] pass values to use for layout calculations
   */
  public triggerLayout(
    context?: Partial<LayoutResolverResult> &
      (
        | { resolver?: LayoutResolver; once?: never }
        | { resolver: LayoutResolver; once?: boolean }
      )
  ) {
    const prevResolver = this.resolver;
    if (
      context?.resolver &&
      context.resolver !== prevResolver &&
      !context.once
    ) {
      this.resolver = context.resolver;
    }
    this.performLayout({
      type: 'imperative',
      context: {
        ...context,
        prevResolver,
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
    if (!this._firstLayoutDone && context.type !== 'initialization') {
      //  reject layout requests before initialization layout
      return;
    }
    this.onBeforeLayout(context);
    const { result, ...rest } = this.getLayoutResult({
      resolver: this.resolver,
      ...context,
    });
    let bubblingContext: LayoutResult | undefined;
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

  protected onBeforeLayout(context: LayoutContext) {
    const { target } = this;

    //  fire layout hook and event (event will fire only for layouts after initialization layout)
    target.onBeforeLayout({
      context,
    });
    target.fire('layout:before', {
      context,
    });
  }

  protected getLayoutResult(context: StrictLayoutContext): LayoutResult {
    const prevCenter = this.target.getRelativeCenterPoint();
    const result = context.resolver.calcLayoutResult(
      this.target,
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
}
