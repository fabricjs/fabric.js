import { defineProperty as _defineProperty, objectSpread2 as _objectSpread2, objectWithoutProperties as _objectWithoutProperties } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { Point } from '../Point.mjs';
import { MODIFIED, MOVING, RESIZING, ROTATING, SCALING, SKEWING, CHANGED, MODIFY_POLY, MODIFY_PATH, iMatrix, CENTER } from '../constants.mjs';
import { invertTransform } from '../util/misc/matrix.mjs';
import { resolveOrigin } from '../util/misc/resolveOrigin.mjs';
import { FitContentLayout } from './LayoutStrategies/FitContentLayout.mjs';
import { LAYOUT_TYPE_OBJECT_MODIFIED, LAYOUT_TYPE_OBJECT_MODIFYING, LAYOUT_TYPE_INITIALIZATION, LAYOUT_TYPE_ADDED, LAYOUT_TYPE_REMOVED, LAYOUT_TYPE_IMPERATIVE } from './constants.mjs';
import { classRegistry } from '../ClassRegistry.mjs';

const _excluded = ["strategy"],
  _excluded2 = ["target", "strategy", "bubbles", "prevStrategy"];
const LAYOUT_MANAGER = 'layoutManager';
class LayoutManager {
  constructor() {
    let strategy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new FitContentLayout();
    _defineProperty(this, "strategy", void 0);
    this.strategy = strategy;
    this._subscriptions = new Map();
  }
  performLayout(context) {
    const strictContext = _objectSpread2(_objectSpread2({
      bubbles: true,
      strategy: this.strategy
    }, context), {}, {
      prevStrategy: this._prevLayoutStrategy,
      stopPropagation() {
        this.bubbles = false;
      }
    });
    this.onBeforeLayout(strictContext);
    const layoutResult = this.getLayoutResult(strictContext);
    if (layoutResult) {
      this.commitLayout(strictContext, layoutResult);
    }
    this.onAfterLayout(strictContext, layoutResult);
    this._prevLayoutStrategy = strictContext.strategy;
  }

  /**
   * Attach handlers for events that we know will invalidate the layout when
   * performed on child objects ( general transforms ).
   * Returns the disposers for later unsubscribing and cleanup
   * @param {FabricObject} object
   * @param {RegistrationContext & Partial<StrictLayoutContext>} context
   * @returns {VoidFunction[]} disposers remove the handlers
   */
  attachHandlers(object, context) {
    const {
      target
    } = context;
    return [MODIFIED, MOVING, RESIZING, ROTATING, SCALING, SKEWING, CHANGED, MODIFY_POLY, MODIFY_PATH].map(key => object.on(key, e => this.performLayout(key === MODIFIED ? {
      type: LAYOUT_TYPE_OBJECT_MODIFIED,
      trigger: key,
      e,
      target
    } : {
      type: LAYOUT_TYPE_OBJECT_MODIFYING,
      trigger: key,
      e,
      target
    })));
  }

  /**
   * Subscribe an object to transform events that will trigger a layout change on the parent
   * This is important only for interactive groups.
   * @param object
   * @param context
   */
  subscribe(object, context) {
    this.unsubscribe(object, context);
    const disposers = this.attachHandlers(object, context);
    this._subscriptions.set(object, disposers);
  }

  /**
   * unsubscribe object layout triggers
   */
  unsubscribe(object, _context) {
    (this._subscriptions.get(object) || []).forEach(d => d());
    this._subscriptions.delete(object);
  }
  unsubscribeTargets(context) {
    context.targets.forEach(object => this.unsubscribe(object, context));
  }
  subscribeTargets(context) {
    context.targets.forEach(object => this.subscribe(object, context));
  }
  onBeforeLayout(context) {
    const {
      target,
      type
    } = context;
    const {
      canvas
    } = target;
    // handle layout triggers subscription
    // @TODO: gate the registration when the group is interactive
    if (type === LAYOUT_TYPE_INITIALIZATION || type === LAYOUT_TYPE_ADDED) {
      this.subscribeTargets(context);
    } else if (type === LAYOUT_TYPE_REMOVED) {
      this.unsubscribeTargets(context);
    }
    // fire layout event (event will fire only for layouts after initialization layout)
    target.fire('layout:before', {
      context
    });
    canvas && canvas.fire('object:layout:before', {
      target,
      context
    });
    if (type === LAYOUT_TYPE_IMPERATIVE && context.deep) {
      const tricklingContext = _objectWithoutProperties(context, _excluded);
      // traverse the tree
      target.forEachObject(object => object.layoutManager && object.layoutManager.performLayout(_objectSpread2(_objectSpread2({}, tricklingContext), {}, {
        bubbles: false,
        target: object
      })));
    }
  }
  getLayoutResult(context) {
    const {
      target,
      strategy,
      type
    } = context;
    const result = strategy.calcLayoutResult(context, target.getObjects());
    if (!result) {
      return;
    }
    const prevCenter = type === LAYOUT_TYPE_INITIALIZATION ? new Point() : target.getRelativeCenterPoint();
    const {
      center: nextCenter,
      correction = new Point(),
      relativeCorrection = new Point()
    } = result;
    const offset = prevCenter.subtract(nextCenter).add(correction).transform(
    // in `initialization` we do not account for target's transformation matrix
    type === LAYOUT_TYPE_INITIALIZATION ? iMatrix : invertTransform(target.calcOwnMatrix()), true).add(relativeCorrection);
    return {
      result,
      prevCenter,
      nextCenter,
      offset
    };
  }
  commitLayout(context, layoutResult) {
    const {
      target
    } = context;
    const {
      result: {
        size
      },
      nextCenter
    } = layoutResult;
    // set dimensions
    target.set({
      width: size.x,
      height: size.y
    });
    // layout descendants
    this.layoutObjects(context, layoutResult);
    //  set position
    // in `initialization` we do not account for target's transformation matrix
    if (context.type === LAYOUT_TYPE_INITIALIZATION) {
      var _context$x, _context$y;
      // TODO: what about strokeWidth?
      target.set({
        left: (_context$x = context.x) !== null && _context$x !== void 0 ? _context$x : nextCenter.x + size.x * resolveOrigin(target.originX),
        top: (_context$y = context.y) !== null && _context$y !== void 0 ? _context$y : nextCenter.y + size.y * resolveOrigin(target.originY)
      });
    } else {
      target.setPositionByOrigin(nextCenter, CENTER, CENTER);
      // invalidate
      target.setCoords();
      target.set('dirty', true);
    }
  }
  layoutObjects(context, layoutResult) {
    const {
      target
    } = context;
    //  adjust objects to account for new center
    target.forEachObject(object => {
      object.group === target && this.layoutObject(context, layoutResult, object);
    });
    // adjust clip path to account for new center
    context.strategy.shouldLayoutClipPath(context) && this.layoutObject(context, layoutResult, target.clipPath);
  }

  /**
   * @param {FabricObject} object
   * @param {Point} offset
   */
  layoutObject(context, _ref, object) {
    let {
      offset
    } = _ref;
    // TODO: this is here for cache invalidation.
    // verify if this is necessary since we have explicit
    // cache invalidation at the end of commitLayout
    object.set({
      left: object.left + offset.x,
      top: object.top + offset.y
    });
  }
  onAfterLayout(context, layoutResult) {
    const {
        target,
        strategy,
        bubbles,
        prevStrategy: _
      } = context,
      bubblingContext = _objectWithoutProperties(context, _excluded2);
    const {
      canvas
    } = target;

    //  fire layout event (event will fire only for layouts after initialization layout)
    target.fire('layout:after', {
      context,
      result: layoutResult
    });
    canvas && canvas.fire('object:layout:after', {
      context,
      result: layoutResult,
      target
    });

    //  bubble
    const parent = target.parent;
    if (bubbles && parent !== null && parent !== void 0 && parent.layoutManager) {
      //  add target to context#path
      (bubblingContext.path || (bubblingContext.path = [])).push(target);
      //  all parents should invalidate their layout
      parent.layoutManager.performLayout(_objectSpread2(_objectSpread2({}, bubblingContext), {}, {
        target: parent
      }));
    }
    target.set('dirty', true);
  }
  dispose() {
    const {
      _subscriptions
    } = this;
    _subscriptions.forEach(disposers => disposers.forEach(d => d()));
    _subscriptions.clear();
  }
  toObject() {
    return {
      type: LAYOUT_MANAGER,
      strategy: this.strategy.constructor.type
    };
  }
  toJSON() {
    return this.toObject();
  }
}
classRegistry.setClass(LayoutManager, LAYOUT_MANAGER);

export { LayoutManager };
//# sourceMappingURL=LayoutManager.mjs.map
