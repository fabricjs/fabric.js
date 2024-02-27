import type { TModificationEvents } from '../EventTypeDefs';
import { Point } from '../Point';
import { CENTER, iMatrix } from '../constants';
import type { Group } from '../shapes/Group';
import type { FabricObject } from '../shapes/Object/FabricObject';
import { invertTransform } from '../util/misc/matrix';
import { resolveOrigin } from '../util/misc/resolveOrigin';
import { FitContentLayout } from './LayoutStrategies/FitContentLayout';
import type { LayoutStrategy } from './LayoutStrategies/LayoutStrategy';
import {
  LAYOUT_TYPE_INITIALIZATION,
  LAYOUT_TYPE_ADDED,
  LAYOUT_TYPE_REMOVED,
  LAYOUT_TYPE_IMPERATIVE,
  LAYOUT_TYPE_OBJECT_MODIFIED,
  LAYOUT_TYPE_OBJECT_MODIFYING,
} from './constants';
import type {
  LayoutContext,
  LayoutResult,
  RegistrationContext,
  StrictLayoutContext,
} from './types';
import { classRegistry } from '../ClassRegistry';

const LAYOUT_MANAGER = 'layoutManager';

export type SerializedLayoutManager = {
  type: string;
  strategy: string;
};

export const layoutingEvents = [
  'modified',
  'moving',
  'resizing',
  'rotating',
  'scaling',
  'skewing',
  'changed',
  'modifyPoly',
] as TModificationEvents[];

export class LayoutManager {
  private declare _prevLayoutStrategy?: LayoutStrategy;
  private declare _subscriptions: Map<FabricObject, VoidFunction[]>;

  strategy: LayoutStrategy;

  constructor(strategy: LayoutStrategy = new FitContentLayout()) {
    this.strategy = strategy;
    this._subscriptions = new Map();
  }

  public performLayout(context: LayoutContext) {
    const strictContext: StrictLayoutContext = {
      bubbles: true,
      strategy: this.strategy,
      ...context,
      prevStrategy: this._prevLayoutStrategy,
      stopPropagation() {
        this.bubbles = false;
      },
    };

    this.onBeforeLayout(strictContext);

    const layoutResult = this.getLayoutResult(strictContext);
    if (layoutResult) {
      this.commitLayout(strictContext, layoutResult);
    } else {
      // if there is no layout result, we may still need to flag the group as dirty
      // if we are moving it through an active selection
      if (
        context.type === LAYOUT_TYPE_OBJECT_MODIFIED ||
        context.type === LAYOUT_TYPE_OBJECT_MODIFYING
      ) {
        context.target.set('dirty', true);
      }
    }

    this.onAfterLayout(strictContext, layoutResult);
    this._prevLayoutStrategy = strictContext.strategy;
  }

  protected attachHandlers(
    childObject: FabricObject,
    context: RegistrationContext & Partial<StrictLayoutContext>
  ): (() => void)[] {
    const { target } = context;
    // TODO fix typescript that block us from condesing this to a single call per key.
    return [
      childObject.on('modified', (e) =>
        this.performLayout({
          trigger: 'modified',
          e,
          type: LAYOUT_TYPE_OBJECT_MODIFIED,
          target,
        })
      ),
      ...layoutingEvents.map((key) =>
        childObject.on(key, (e) => {
          this.performLayout({
            trigger: key,
            e,
            type: LAYOUT_TYPE_OBJECT_MODIFYING,
            target,
          });
        })
      ),
    ];
  }

  /**
   * subscribe to object layout triggers
   */
  protected subscribe(
    object: FabricObject,
    context: RegistrationContext & Partial<StrictLayoutContext>
  ) {
    this.unsubscribe(object, context);
    const disposers = this.attachHandlers(object, context);
    this._subscriptions.set(object, disposers);
  }

  /**
   * unsubscribe object layout triggers
   */
  protected unsubscribe(
    object: FabricObject,
    context?: RegistrationContext & Partial<StrictLayoutContext>
  ) {
    (this._subscriptions.get(object) || []).forEach((d) => d());
    this._subscriptions.delete(object);
  }

  unsubscribeTargets(
    context: RegistrationContext & Partial<StrictLayoutContext>
  ) {
    context.targets.forEach((object) => this.unsubscribe(object, context));
  }

  subscribeTargets(
    context: RegistrationContext & Partial<StrictLayoutContext>
  ) {
    context.targets.forEach((object) => this.subscribe(object, context));
  }

  protected onBeforeLayout(context: StrictLayoutContext) {
    const { target, type } = context;
    const { canvas } = target;
    // handle layout triggers subscription
    // @TODO: gate the registration when the group is interactive
    if (type === LAYOUT_TYPE_INITIALIZATION || type === LAYOUT_TYPE_ADDED) {
      this.subscribeTargets(context);
    } else if (type === LAYOUT_TYPE_REMOVED) {
      this.unsubscribeTargets(context);
    }
    // fire layout event (event will fire only for layouts after initialization layout)
    target.fire('layout:before', {
      context,
    });
    canvas &&
      canvas.fire('object:layout:before', {
        target,
        context,
      });

    if (type === LAYOUT_TYPE_IMPERATIVE && context.deep) {
      const { strategy: _, ...tricklingContext } = context;
      // traverse the tree
      target.forEachObject(
        (object) =>
          (object as Group).layoutManager &&
          (object as Group).layoutManager.performLayout({
            ...tricklingContext,
            bubbles: false,
            target: object as Group,
          })
      );
    }
  }

  protected getLayoutResult(
    context: StrictLayoutContext
  ): Required<LayoutResult> | undefined {
    const { target } = context;

    const result = context.strategy.calcLayoutResult(
      context,
      target.getObjects()
    );

    if (!result) {
      return;
    }

    const prevCenter =
      context.type === LAYOUT_TYPE_INITIALIZATION
        ? new Point()
        : target.getRelativeCenterPoint();

    const {
      center: nextCenter,
      correction = new Point(),
      relativeCorrection = new Point(),
    } = result;
    const offset = prevCenter
      .subtract(nextCenter)
      .add(correction)
      .transform(
        // in `initialization` we do not account for target's transformation matrix
        context.type === LAYOUT_TYPE_INITIALIZATION
          ? iMatrix
          : invertTransform(target.calcOwnMatrix()),
        true
      )
      .add(relativeCorrection);

    return {
      result,
      prevCenter,
      nextCenter,
      offset,
    };
  }

  protected commitLayout(
    context: StrictLayoutContext,
    layoutResult: Required<LayoutResult>
  ) {
    const { target } = context;
    const {
      result: { size },
      nextCenter,
    } = layoutResult;
    // set dimensions
    target.set({ width: size.x, height: size.y });
    // layout descendants
    this.layoutObjects(context, layoutResult);
    //  set position
    // in `initialization` we do not account for target's transformation matrix
    if (context.type === LAYOUT_TYPE_INITIALIZATION) {
      // TODO: what about strokeWidth?
      target.set({
        left:
          context.x ?? nextCenter.x + size.x * resolveOrigin(target.originX),
        top: context.y ?? nextCenter.y + size.y * resolveOrigin(target.originY),
      });
    } else {
      target.setPositionByOrigin(nextCenter, CENTER, CENTER);
      // invalidate
      target.setCoords();
      context.target.set('dirty', true);
    }
  }

  protected layoutObjects(
    context: StrictLayoutContext,
    layoutResult: Required<LayoutResult>
  ) {
    const { target } = context;
    //  adjust objects to account for new center
    target.forEachObject((object) => {
      object.group === target &&
        this.layoutObject(context, layoutResult, object);
    });
    // adjust clip path to account for new center
    context.strategy.shouldLayoutClipPath(context) &&
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
    object.set({
      left: object.left + offset.x,
      top: object.top + offset.y,
    });
  }

  protected onAfterLayout(
    context: StrictLayoutContext,
    layoutResult?: LayoutResult
  ) {
    const {
      target,
      strategy,
      bubbles,
      prevStrategy: _,
      ...bubblingContext
    } = context;
    const { canvas } = target;

    //  fire layout event (event will fire only for layouts after initialization layout)
    target.fire('layout:after', {
      context,
      result: layoutResult,
    });
    canvas &&
      canvas.fire('object:layout:after', {
        context,
        result: layoutResult,
        target,
      });

    //  bubble
    const parent = target.group;
    if (bubbles && parent?.layoutManager) {
      //  add target to context#path
      (bubblingContext.path || (bubblingContext.path = [])).push(target);
      //  all parents should invalidate their layout
      parent.layoutManager.performLayout({
        ...bubblingContext,
        target: parent,
      });
    }
  }

  dispose() {
    this._subscriptions.forEach((disposers) => disposers.forEach((d) => d()));
    this._subscriptions.clear();
  }

  toObject() {
    return {
      type: LAYOUT_MANAGER,
      strategy: (this.strategy.constructor as typeof LayoutStrategy).type,
    };
  }

  toJSON() {
    return this.toObject();
  }
}

classRegistry.setClass(LayoutManager, LAYOUT_MANAGER);
