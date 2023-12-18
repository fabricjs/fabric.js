import { StaticCanvas } from '../canvas/StaticCanvas';
import { Point } from '../Point';
import { Group } from '../shapes/Group';
import { FabricObject } from '../shapes/Object/FabricObject';
import { LayoutManager } from './LayoutManager';
import { FitContentLayout } from './LayoutStrategies/FitContentLayout';
import { FixedLayout } from './LayoutStrategies/FixedLayout';

import {
  LAYOUT_TYPE_INITIALIZATION,
  LAYOUT_TYPE_ADDED,
  LAYOUT_TYPE_REMOVED,
  LAYOUT_TYPE_IMPERATIVE,
} from './constants';
import type {
  LayoutContext,
  LayoutResult,
  LayoutTrigger,
  StrictLayoutContext,
} from './types';

describe('Layout Manager', () => {
  it('should set fit content strategy by default', () => {
    expect(new LayoutManager().strategy).toBeInstanceOf(FitContentLayout);
  });

  describe('Lifecycle', () => {
    test.each([true, false])('performLayout with result of %s', (result) => {
      const lifecycle: jest.SpyInstance[] = [];
      const layoutResult: LayoutResult | undefined = result
        ? {
            result: { center: new Point(), size: new Point() },
            prevCenter: new Point(),
            nextCenter: new Point(),
            offset: new Point(),
          }
        : undefined;

      const manager = new LayoutManager();
      const onBeforeLayout = jest
        .spyOn(manager, 'onBeforeLayout')
        .mockImplementation(() => {
          lifecycle.push(onBeforeLayout);
        });
      const getLayoutResult = jest
        .spyOn(manager, 'getLayoutResult')
        .mockImplementation(() => {
          lifecycle.push(getLayoutResult);
          return layoutResult;
        });
      const commitLayout = jest
        .spyOn(manager, 'commitLayout')
        .mockImplementation(() => {
          lifecycle.push(commitLayout);
        });
      const onAfterLayout = jest
        .spyOn(manager, 'onAfterLayout')
        .mockImplementation(() => {
          lifecycle.push(onAfterLayout);
        });

      const targets = [new Group([new FabricObject()]), new FabricObject()];
      const target = new Group(targets);
      manager.performLayout({
        type: LAYOUT_TYPE_INITIALIZATION,
        target,
        targets,
      });

      const context = {
        bubbles: true,
        strategy: manager.strategy,
        type: LAYOUT_TYPE_INITIALIZATION,
        target,
        targets,
        prevStrategy: undefined,
      };

      const expectedLifecycle = [
        onBeforeLayout,
        getLayoutResult,
        ...(result ? [commitLayout] : []),
        onAfterLayout,
      ];

      expect(lifecycle).toEqual(expectedLifecycle);
      expectedLifecycle.forEach(
        ({
          mock: {
            calls: [[arg0]],
          },
        }) => expect(arg0).toMatchObject(context)
      );
      if (result) {
        [commitLayout, onAfterLayout].forEach(
          ({
            mock: {
              calls: [[arg0, arg1]],
            },
          }) => expect(arg1).toEqual(layoutResult)
        );
      } else {
        [onAfterLayout].forEach(
          ({
            mock: {
              calls: [[arg0, arg1]],
            },
          }) => expect(arg1).toBeUndefined()
        );
      }
    });
  });

  describe('onBeforeLayout', () => {
    describe('triggers', () => {
      const triggers = [
        'modified',
        'moving',
        'resizing',
        'rotating',
        'scaling',
        'skewing',
        'changed',
      ] as const;

      it('should subscribe object', () => {
        const lifecycle: jest.SpyInstance[] = [];
        const manager = new LayoutManager();
        const unsubscribe = jest
          .spyOn(manager, 'unsubscribe')
          .mockImplementation(() => {
            lifecycle.push(unsubscribe);
          });
        const object = new FabricObject();
        const on = jest.spyOn(object, 'on').mockImplementation(() => {
          lifecycle.push(on);
        });

        manager['subscribe'](object, {});

        expect(lifecycle).toEqual([
          unsubscribe,
          ...new Array(triggers.length).fill(on),
        ]);
        expect(on.mock.calls.map(([arg0]) => arg0)).toEqual(triggers);
      });

      it('a subscribed object should trigger layout', () => {
        const manager = new LayoutManager();
        const performLayout = jest.spyOn(manager, 'performLayout');
        const object = new FabricObject();
        const target = new Group();
        manager['subscribe'](object, { target });

        const event = { foo: 'bar' };
        triggers.forEach((trigger) => object.fire(trigger, event));
        expect(performLayout.mock.calls).toMatchObject([
          [
            {
              e: { target: object, ...event },
              target,
              trigger: 'modified',
              type: 'object_modified',
            },
          ],
          ...triggers.slice(1).map((trigger) => [
            {
              e: { target: object, ...event },
              target,
              trigger,
              type: 'object_modifying',
            },
          ]),
        ]);

        performLayout.mockClear();
        expect(manager['_subscriptions'].get(object)).toBeDefined();
        manager['unsubscribe'](object, { target });
        expect(manager['_subscriptions'].get(object)).toBeUndefined();
        triggers.forEach((trigger) => object.fire(trigger, event));
        expect(performLayout).not.toHaveBeenCalled();
      });
    });

    it('a non attached manager should not subscribe object', () => {
      const manager = new LayoutManager();
      const subscribe = jest.spyOn(manager, 'subscribe');
      const object = new FabricObject();
      const target = new Group([object]);
      manager.performLayout({
        type: LAYOUT_TYPE_INITIALIZATION,
        target,
        targets: [object],
      });

      expect(subscribe).not.toHaveBeenCalled();
    });

    it.each([
      { trigger: LAYOUT_TYPE_INITIALIZATION, action: 'subscribe' },
      { trigger: LAYOUT_TYPE_ADDED, action: 'subscribe' },
      { trigger: LAYOUT_TYPE_REMOVED, action: 'unsubscribe' },
    ] as {
      trigger: LayoutTrigger;
      action: 'subscribe' | 'unsubscribe';
    }[])(
      '$trigger trigger should $action targets and call target hooks',
      ({ action }) => {
        const lifecycle: jest.SpyInstance[] = [];

        const manager = new LayoutManager();

        const targets = [
          new Group([new FabricObject()], { layoutManager: manager }),
          new FabricObject(),
        ];
        const target = new Group(targets, { layoutManager: manager });
        const canvasFire = jest.fn();
        target.canvas = { fire: canvasFire };
        const targetFire = jest.spyOn(target, 'fire').mockImplementation(() => {
          lifecycle.push(targetFire);
        });

        const subscription = jest
          .spyOn(manager, action)
          .mockImplementation(() => {
            lifecycle.push(subscription);
          });

        const context: StrictLayoutContext = {
          bubbles: true,
          strategy: manager.strategy,
          type: LAYOUT_TYPE_INITIALIZATION,
          target,
          targets,
          prevStrategy: undefined,
          stopPropagation() {
            this.bubbles = false;
          },
        };
        manager['onBeforeLayout'](context);

        expect(lifecycle).toEqual([subscription, subscription, targetFire]);
        expect(targetFire).toBeCalledWith('layout:before', {
          context,
        });
        expect(canvasFire).toBeCalledWith('object:layout:before', {
          context,
          target,
        });
      }
    );

    it('passing deep should layout the entire tree', () => {
      const manager = new LayoutManager();
      const grandchild = new Group([], { layoutManager: manager });
      const child = new Group([grandchild, new FabricObject()], {
        layoutManager: manager,
      });
      const targets = [child, new FabricObject()];
      const target = new Group(targets, { layoutManager: manager });

      const performLayout = jest.spyOn(manager, 'performLayout');

      const context: StrictLayoutContext = {
        bubbles: true,
        strategy: manager.strategy,
        type: LAYOUT_TYPE_IMPERATIVE,
        deep: true,
        target,
        prevStrategy: undefined,
        stopPropagation() {
          this.bubbles = false;
        },
      };
      manager['onBeforeLayout'](context);

      expect(performLayout).toHaveBeenCalledTimes(2);
      expect(performLayout.mock.calls[0][0]).toMatchObject({
        bubbles: false,
        type: LAYOUT_TYPE_IMPERATIVE,
        deep: true,
        target: child,
      });
      expect(performLayout.mock.calls[1][0]).toMatchObject({
        bubbles: false,
        type: LAYOUT_TYPE_IMPERATIVE,
        deep: true,
        target: grandchild,
      });
    });
  });

  describe('getLayoutResult', () => {
    test.each([
      { type: LAYOUT_TYPE_INITIALIZATION, targets: [] },
      {
        type: LAYOUT_TYPE_INITIALIZATION,
        objectsRelativeToGroup: true,
        targets: [],
      },
      { type: LAYOUT_TYPE_IMPERATIVE },
    ] as const)('$type trigger', (options) => {
      const manager = new LayoutManager();
      jest.spyOn(manager.strategy, 'calcLayoutResult').mockReturnValue({
        center: new Point(50, 100),
        size: new Point(200, 250),
        correction: new Point(10, 20),
        relativeCorrection: new Point(-30, -40),
      });

      const target = new Group([], { scaleX: 2, scaleY: 0.5, angle: 30 });

      const context: StrictLayoutContext = {
        bubbles: true,
        strategy: manager.strategy,
        target,
        ...options,
        stopPropagation() {
          this.bubbles = false;
        },
      };

      expect(manager['getLayoutResult'](context)).toMatchSnapshot();
    });
  });

  describe('commitLayout', () => {
    const prepareTest = (
      contextOptions: {
        type: typeof LAYOUT_TYPE_INITIALIZATION | typeof LAYOUT_TYPE_ADDED;
      } & Partial<LayoutContext>
    ) => {
      const lifecycle: jest.SpyInstance[] = [];

      const targets = [new Group([new FabricObject()]), new FabricObject()];
      const target = new Group(targets, { strokeWidth: 0 });
      const targetSet = jest.spyOn(target, 'set').mockImplementation(() => {
        lifecycle.push(targetSet);
      });
      const targetSetCoords = jest
        .spyOn(target, 'setCoords')
        .mockImplementation(() => {
          lifecycle.push(targetSetCoords);
        });
      const targetSetPositionByOrigin = jest
        .spyOn(target, 'setPositionByOrigin')
        .mockImplementation(() => {
          lifecycle.push(targetSetPositionByOrigin);
        });

      const manager = new LayoutManager();
      const layoutObjects = jest
        .spyOn(manager, 'layoutObjects')
        .mockImplementation(() => {
          lifecycle.push(layoutObjects);
        });

      const context: StrictLayoutContext = {
        ...contextOptions,
        bubbles: true,
        strategy: manager.strategy,
        target,
        targets,
        prevStrategy: undefined,
        stopPropagation() {
          this.bubbles = false;
        },
      };

      return {
        manager,
        context,
        layoutResult: {
          result: { center: new Point(5, 5), size: new Point(10, 10) },
          prevCenter: new Point(),
          nextCenter: new Point(5, 5),
          offset: new Point(-5, -5),
        },
        targetMocks: {
          set: targetSet,
          setCoords: targetSetCoords,
          setPositionByOrigin: targetSetPositionByOrigin,
        },
        mocks: {
          layoutObjects,
        },
        lifecycle,
      };
    };

    it.each([{}, { x: 10 }, { y: 10 }, { x: 10, y: 10 }] as const)(
      'initialization trigger with %s should set size and position',
      (pos) => {
        const {
          manager,
          context,
          layoutResult,
          mocks: { layoutObjects },
          targetMocks,
          lifecycle,
        } = prepareTest({ type: LAYOUT_TYPE_INITIALIZATION, ...pos });
        const {
          result: {
            size: { x: width, y: height },
          },
        } = layoutResult;

        manager['commitLayout'](context, layoutResult);

        expect(lifecycle).toEqual([
          targetMocks.set,
          layoutObjects,
          targetMocks.set,
        ]);
        expect(targetMocks.set).nthCalledWith(1, { width, height });
        expect(layoutObjects).toBeCalledWith(context, layoutResult);
        expect(targetMocks.set).nthCalledWith(2, {
          left: pos.x ?? 0,
          top: pos.y ?? 0,
        });
      }
    );

    it('non initialization trigger should set size, position and invalidate target', () => {
      const {
        manager,
        context,
        layoutResult,
        mocks: { layoutObjects },
        targetMocks,
        lifecycle,
      } = prepareTest({ type: LAYOUT_TYPE_ADDED });
      const {
        result: {
          size: { x: width, y: height },
        },
      } = layoutResult;

      manager['commitLayout'](context, layoutResult);

      expect(lifecycle).toEqual([
        targetMocks.set,
        layoutObjects,
        targetMocks.setPositionByOrigin,
        targetMocks.setCoords,
        targetMocks.set,
      ]);
      expect(targetMocks.set).nthCalledWith(1, { width, height });
      expect(layoutObjects).toBeCalledWith(context, layoutResult);
      expect(targetMocks.set).nthCalledWith(2, {
        dirty: true,
      });
    });
  });

  describe('onAfterLayout', () => {
    it.each([true, false])(
      'should call target hooks with bubbling %s',
      (bubbles) => {
        const lifecycle: jest.SpyInstance[] = [];
        const manager = new LayoutManager();
        const targets = [
          new Group([new FabricObject()], { layoutManager: manager }),
          new FabricObject(),
        ];
        const target = new Group(targets, { layoutManager: manager });
        const targetFire = jest.spyOn(target, 'fire').mockImplementation(() => {
          lifecycle.push(targetFire);
        });

        const parent = new Group([target], { layoutManager: manager });
        const parentPerformLayout = jest
          .spyOn(parent.layoutManager, 'performLayout')
          .mockImplementation(() => {
            lifecycle.push(parentPerformLayout);
          });

        const canvasFire = jest.fn();
        target.canvas = { fire: canvasFire };

        const shouldResetTransform = jest
          .spyOn(manager.strategy, 'shouldResetTransform')
          .mockImplementation(() => {
            lifecycle.push(shouldResetTransform);
          });

        const context: StrictLayoutContext = {
          bubbles,
          strategy: manager.strategy,
          type: LAYOUT_TYPE_ADDED,
          target,
          targets,
          prevStrategy: undefined,
          stopPropagation() {
            this.bubbles = false;
          },
        };
        const layoutResult: LayoutResult = {
          result: { center: new Point(), size: new Point() },
          prevCenter: new Point(),
          nextCenter: new Point(),
          offset: new Point(),
        };
        manager['onAfterLayout'](context, layoutResult);

        expect(lifecycle).toEqual([
          shouldResetTransform,
          targetFire,
          ...(bubbles ? [parentPerformLayout] : []),
        ]);
        expect(shouldResetTransform).toBeCalledWith(context);
        expect(targetFire).toBeCalledWith('layout:after', {
          context,
          result: layoutResult,
        });
        expect(canvasFire).toBeCalledWith('object:layout:after', {
          context,
          result: layoutResult,
          target,
        });
        bubbles &&
          expect(parentPerformLayout.mock.calls[0]).toMatchObject([
            {
              type: LAYOUT_TYPE_ADDED,
              targets,
              target: parent,
              path: [target],
            },
          ]);
      }
    );

    test.each([true, false])('reset target transform %s', (reset) => {
      const targets = [new Group([new FabricObject()]), new FabricObject()];
      const target = new Group(targets);
      target.left = 50;

      const manager = new LayoutManager();
      jest
        .spyOn(manager.strategy, 'shouldResetTransform')
        .mockImplementation(() => {
          return reset;
        });

      const context: StrictLayoutContext = {
        bubbles: true,
        strategy: manager.strategy,
        type: LAYOUT_TYPE_REMOVED,
        target,
        targets,
        prevStrategy: undefined,
        stopPropagation() {
          this.bubbles = false;
        },
      };
      manager['onAfterLayout'](context);

      expect(target.left).toBe(reset ? 0 : 50);
    });

    test('bubbling', () => {
      const manager = new LayoutManager();
      const manager2 = new LayoutManager();
      const targets = [
        new Group([new FabricObject()], { layoutManager: manager }),
        new FabricObject(),
      ];
      const target = new Group(targets, { layoutManager: manager });
      const parent = new Group([target], { layoutManager: manager });
      const grandParent = new Group([parent], { layoutManager: manager2 });

      const grandParentPerformLayout = jest.spyOn(manager2, 'performLayout');

      const context: StrictLayoutContext = {
        bubbles: true,
        strategy: manager.strategy,
        type: LAYOUT_TYPE_ADDED,
        target,
        targets,
        prevStrategy: undefined,
        stopPropagation() {
          this.bubbles = false;
        },
      };
      const layoutResult: LayoutResult = {
        result: { center: new Point(), size: new Point() },
        prevCenter: new Point(),
        nextCenter: new Point(),
        offset: new Point(),
      };
      manager['onAfterLayout'](context, layoutResult);

      expect(grandParentPerformLayout.mock.calls[0]).toMatchObject([
        {
          type: LAYOUT_TYPE_ADDED,
          targets,
          target: grandParent,
          path: [target, parent],
        },
      ]);
    });
    it('fires canvas events for a perform layout', () => {
      const manager = new LayoutManager();
      const targets = [
        new Group([new FabricObject()], {
          layoutManager: manager,
        }),
        new FabricObject(),
      ];
      const target = new Group(targets, {
        layoutManager: manager,
      });
      const parent = new Group([target], {
        layoutManager: manager,
      });
      const grandParent = new Group([parent], {
        layoutManager: manager,
      });
      const canvas = new StaticCanvas(undefined, { renderOnAddRemove: false });
      const commonContext = {
        type: 'imperative',
        strategy: manager.strategy,
        prevStrategy: manager.strategy,
        bubbles: false,
        deep: false,
        stopPropagation: expect.any(Function),
      };
      canvas.add(grandParent);
      jest.spyOn(canvas, 'fire');
      grandParent.triggerLayout({
        bubbles: false,
        deep: false,
      });
      // first calls the event for the deep below target
      expect(canvas.fire).toHaveBeenCalledWith('object:layout:before', {
        target: grandParent,
        context: {
          target: grandParent,
          ...commonContext,
        },
      });
      expect(canvas.fire).toHaveBeenCalledWith('object:layout:after', {
        target: grandParent,
        context: {
          target: grandParent,
          ...commonContext,
          bubbles: false,
        },
        result: expect.any(Object),
      });
      expect(canvas.fire.mock.calls.length).toBe(2);
    });
    it('fires canvas events for a perform layout deep: true', () => {
      const manager = new LayoutManager();
      const targets = [
        new Group([new FabricObject()], {
          layoutManager: manager,
        }),
        new FabricObject(),
      ];
      const target = new Group(targets, {
        layoutManager: manager,
      });
      const parent = new Group([target], {
        layoutManager: manager,
      });
      const grandParent = new Group([parent], {
        layoutManager: manager,
      });
      const canvas = new StaticCanvas(undefined, {
        renderOnAddRemove: false,
      });
      const commonContext = {
        type: 'imperative',
        strategy: manager.strategy,
        prevStrategy: manager.strategy,
        bubbles: false,
        deep: true,
        stopPropagation: expect.any(Function),
      };
      canvas.add(grandParent);
      jest.spyOn(canvas, 'fire');
      grandParent.triggerLayout({
        bubbles: false,
        deep: true,
      });
      // first calls the event for the deep below target
      expect(canvas.fire).toHaveBeenCalledWith('object:layout:before', {
        target: grandParent,
        context: {
          target: grandParent,
          ...commonContext,
        },
      });
      expect(canvas.fire).toHaveBeenCalledWith('object:layout:after', {
        target: grandParent,
        context: {
          target: grandParent,
          ...commonContext,
          bubbles: false,
        },
        result: expect.any(Object),
      });
      expect(canvas.fire).toHaveBeenCalledWith('object:layout:before', {
        target: parent,
        context: {
          target: parent,
          ...commonContext,
        },
      });
      expect(canvas.fire).toHaveBeenCalledWith('object:layout:after', {
        target: parent,
        context: {
          target: parent,
          ...commonContext,
          bubbles: false,
        },
        result: expect.any(Object),
      });
      expect(canvas.fire).toHaveBeenCalledWith('object:layout:before', {
        target: target,
        context: {
          target: target,
          ...commonContext,
        },
      });
      expect(canvas.fire).toHaveBeenCalledWith('object:layout:after', {
        target: target,
        context: {
          target: target,
          ...commonContext,
          bubbles: false,
        },
        result: expect.any(Object),
      });
      expect(canvas.fire).toHaveBeenCalledWith('object:layout:before', {
        target: targets[0],
        context: {
          target: targets[0],
          ...commonContext,
        },
      });
      expect(canvas.fire).toHaveBeenCalledWith('object:layout:after', {
        target: targets[0],
        context: {
          target: targets[0],
          ...commonContext,
          bubbles: false,
        },
        result: expect.any(Object),
      });
      expect(canvas.fire.mock.calls.length).toBe(8);
    });
  });

  describe('Group initial layout', () => {
    it('fit content layout should ignore size passed in options', () => {
      const child = new FabricObject({
        width: 200,
        height: 200,
        strokeWidth: 0,
      });
      const group = new Group([child], {
        width: 300,
        height: 300,
        strokeWidth: 0,
        layoutManager: new LayoutManager(),
      });
      expect(child.getRelativeCenterPoint()).toMatchObject({ x: 0, y: 0 });
      expect(group.getCenterPoint()).toMatchObject({ x: 100, y: 100 });
      expect(child.getCenterPoint()).toMatchObject(group.getCenterPoint());
    });

    test.each([true, false])(
      'initialization edge case, legacy layout %s',
      (legacy) => {
        const child = new FabricObject({
          width: 200,
          height: 200,
          strokeWidth: 0,
        });
        const group = new Group([child], {
          width: 200,
          height: 200,
          strokeWidth: 0,
          layoutManager: !legacy ? new LayoutManager() : undefined,
        });
        expect(group).toMatchObject({ width: 200, height: 200 });
        expect(child.getRelativeCenterPoint()).toMatchObject({ x: 0, y: 0 });
        expect(group.getCenterPoint()).toMatchObject({ x: 100, y: 100 });
        expect(child.getCenterPoint()).toMatchObject(group.getCenterPoint());
      }
    );

    it('fixed layout should respect size passed in options', () => {
      const child = new FabricObject({
        width: 200,
        height: 200,
        strokeWidth: 0,
      });
      const group = new Group([child], {
        width: 100,
        height: 300,
        strokeWidth: 0,
        layoutManager: new LayoutManager(new FixedLayout()),
      });
      expect(group).toMatchObject({ width: 100, height: 300 });
      expect(child.getCenterPoint()).toMatchObject({ x: 100, y: 100 });
      expect(group.getCenterPoint()).toMatchObject({ x: 50, y: 150 });
    });
  });
});
