import { Point } from '../Point';
import { CENTER } from '../constants';
import type { Group } from '../shapes/Group';
import type { FabricObject } from '../shapes/Object/FabricObject';
import { invertTransform } from '../util/misc/matrix';
import { ClipPathLayoutResolver } from './resolvers/ClipPathLayoutResolver';
import { FitContentLayoutResolver } from './resolvers/FitContentLayoutResolver';
import type { LayoutResolver } from './resolvers/LayoutResolver';
import type {
  LayoutContext,
  LayoutResult,
  StrictLayoutContext,
  ImperativeLayoutContext,
} from './types';

export class LayoutManager {
  private _firstLayoutDone = false;

  resolver: LayoutResolver;

  constructor(resolver: LayoutResolver = new FitContentLayoutResolver()) {
    this.resolver = resolver;
  }

  triggerLayout({
    target,
    resolver,
    once,
    ...context
  }: ImperativeLayoutContext & { target: Group }) {
    const prevResolver = this.resolver;
    if (resolver && resolver !== prevResolver && !once) {
      this.resolver = resolver;
    }
    this.performLayout({
      target,
      type: 'imperative',
      resolver,
      prevResolver,
      context,
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
            width: context.target.width,
            height: context.target.height,
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
    const { target } = context;

    //  fire layout hook and event (event will fire only for layouts after initialization layout)
    target.onBeforeLayout({
      context,
    });
    target.fire('layout:before', {
      context,
    });
  }

  protected getLayoutResult(context: StrictLayoutContext): LayoutResult {
    const { target } = context;
    const prevCenter = target.getRelativeCenterPoint();
    const result = context.resolver.calcLayoutResult(
      context,
      target.getObjects()
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
    if (!nextCenter.eq(prevCenter)) {
      target.setPositionByOrigin(nextCenter, CENTER, CENTER);
      target.setCoords();
    }
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
      !(context.resolver instanceof ClipPathLayoutResolver) &&
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
