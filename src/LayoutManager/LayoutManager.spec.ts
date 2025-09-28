import type { TModificationEvents } from '../EventTypeDefs';
import { Point } from '../Point';
import { StaticCanvas } from '../canvas/StaticCanvas';
import { Group } from '../shapes/Group';
import { FabricObject } from '../shapes/Object/FabricObject';
import { Rect } from '../shapes/Rect';
import { LayoutManager } from './LayoutManager';
import { ClipPathLayout } from './LayoutStrategies/ClipPathLayout';
import { FitContentLayout } from './LayoutStrategies/FitContentLayout';
import { FixedLayout } from './LayoutStrategies/FixedLayout';
import {
  LAYOUT_TYPE_ADDED,
  LAYOUT_TYPE_IMPERATIVE,
  LAYOUT_TYPE_INITIALIZATION,
  LAYOUT_TYPE_REMOVED,
} from './constants';
import type { LayoutContext, LayoutResult, StrictLayoutContext } from './types';

import { describe, expect, it, beforeEach, test, vi } from 'vitest';
import type { MockInstance } from 'vitest';

describe('Layout Manager', () => {
  it('should set fit content strategy by default', () => {
    expect(new LayoutManager().strategy).toBeInstanceOf(FitContentLayout);
  });

  describe('Lifecycle', () => {
    test.each([true, false])('performLayout with result of %s', (result) => {
      const lifecycle: MockInstance[] = [];
      const layoutResult: LayoutResult | undefined = result
        ? {
            result: { center: new Point(), size: new Point() },
            prevCenter: new Point(),
            nextCenter: new Point(),
            offset: new Point(),
          }
        : undefined;

      const manager = new LayoutManager();
      const onBeforeLayout = vi
        .spyOn(manager, 'onBeforeLayout')
        .mockImplementation(() => {
          lifecycle.push(onBeforeLayout);
        });
      const getLayoutResult = vi
        .spyOn(manager, 'getLayoutResult')
        .mockImplementation(() => {
          lifecycle.push(getLayoutResult);
          return layoutResult;
        });
      const commitLayout = vi
        .spyOn(manager, 'commitLayout')
        .mockImplementation(() => {
          lifecycle.push(commitLayout);
        });
      const onAfterLayout = vi
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
        }) => expect(arg0).toMatchObject(context),
      );
      if (result) {
        [commitLayout, onAfterLayout].forEach(
          ({
            mock: {
              calls: [[, arg1]],
            },
          }) => expect(arg1).toEqual(layoutResult),
        );
      } else {
        [onAfterLayout].forEach(
          ({
            mock: {
              calls: [[, arg1]],
            },
          }) => expect(arg1).toBeUndefined(),
        );
      }
    });
  });

  describe('onBeforeLayout', () => {
    describe('triggers', () => {
      const triggers: ('modified' | TModificationEvents | 'changed')[] = [
        'modified',
        'moving',
        'resizing',
        'rotating',
        'scaling',
        'skewing',
        'changed',
        'modifyPoly',
        'modifyPath',
      ];

      it('should subscribe object', () => {
        const lifecycle: MockInstance[] = [];
        const manager = new LayoutManager();
        const unsubscribe = vi
          .spyOn(manager, 'unsubscribe')
          .mockImplementation(() => {
            lifecycle.push(unsubscribe);
          });
        const object = new FabricObject();
        const on = vi.spyOn(object, 'on').mockImplementation(() => {
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
        const performLayout = vi.spyOn(manager, 'performLayout');
        const object = new FabricObject();
        const target = new Group([object], { layoutManager: manager });
        manager['subscribe'](object, { target });
        performLayout.mockClear();
        const event = { foo: 'bar' };
        triggers.forEach((trigger) => object.fire(trigger, event));
        expect(performLayout.mock.calls).toMatchObject([
          [
            {
              e: event,
              target,
              trigger: 'modified',
              type: 'object_modified',
            },
          ],
          ...triggers.slice(1).map((trigger) => [
            {
              e: event,
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
    describe('triggers and event subscriptions', () => {
      let manager: LayoutManager;
      let targets: FabricObject[];
      let target: Group;
      let context: StrictLayoutContext;
      beforeEach(() => {
        manager = new LayoutManager();

        targets = [
          new Group([new FabricObject()], { layoutManager: manager }),
          new FabricObject(),
        ];
        target = new Group(targets, { layoutManager: manager });
        target.canvas = { fire: vi.fn() };

        vi.spyOn(target, 'fire');

        context = {
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
      });
      it(`initialization trigger should subscribe targets and call target hooks`, () => {
        vi.spyOn(manager, 'subscribe');
        context.type = LAYOUT_TYPE_INITIALIZATION;
        manager['onBeforeLayout'](context);
        expect(manager['subscribe']).toHaveBeenCalledTimes(targets.length);
        expect(manager['subscribe']).toHaveBeenCalledWith(targets[0], context);
        expect(target.fire).toBeCalledWith('layout:before', {
          context,
        });
        expect(target.canvas.fire).toBeCalledWith('object:layout:before', {
          context,
          target,
        });
      });
      it(`object removed trigger should unsubscribe targets and call target hooks`, () => {
        vi.spyOn(manager, 'unsubscribe');
        context.type = LAYOUT_TYPE_REMOVED;
        manager['onBeforeLayout'](context);
        expect(manager['unsubscribe']).toHaveBeenCalledTimes(targets.length);
        expect(manager['unsubscribe']).toHaveBeenCalledWith(
          targets[0],
          context,
        );
        expect(target.fire).toBeCalledWith('layout:before', {
          context,
        });
        expect(target.canvas.fire).toBeCalledWith('object:layout:before', {
          context,
          target,
        });
      });
      it(`object added trigger should subscribe targets and call target hooks`, () => {
        vi.spyOn(manager, 'subscribe');
        context.type = LAYOUT_TYPE_ADDED;
        manager['onBeforeLayout'](context);
        expect(manager['subscribe']).toHaveBeenCalledTimes(targets.length);
        expect(manager['subscribe']).toHaveBeenCalledWith(targets[0], context);
        expect(target.fire).toBeCalledWith('layout:before', {
          context,
        });
        expect(target.canvas.fire).toBeCalledWith('object:layout:before', {
          context,
          target,
        });
      });
    });

    it('passing deep should layout the entire tree', () => {
      const manager = new LayoutManager();
      const grandchild = new Group([], { layoutManager: manager });
      const child = new Group([grandchild, new FabricObject()], {
        layoutManager: manager,
      });
      const targets = [child, new FabricObject()];
      const target = new Group(targets, { layoutManager: manager });

      const performLayout = vi.spyOn(manager, 'performLayout');

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
      { type: LAYOUT_TYPE_IMPERATIVE },
    ] as const)('$type trigger', (options) => {
      const manager = new LayoutManager();
      vi.spyOn(manager.strategy, 'calcLayoutResult').mockReturnValue({
        center: new Point(50, 100),
        size: new Point(200, 250),
        correction: new Point(10, 20),
        relativeCorrection: new Point(-30, -40),
      });

      const rect = new FabricObject({
        left: 25,
        top: 25,
        width: 50,
        height: 50,
      });
      const target = new Group([rect], { scaleX: 2, scaleY: 0.5, angle: 30 });

      const context: StrictLayoutContext = {
        bubbles: true,
        strategy: manager.strategy,
        target,
        targets: [rect],
        ...options,
        stopPropagation() {
          this.bubbles = false;
        },
      };

      expect(manager['getLayoutResult'](context)).toMatchSnapshot({
        cloneDeepWith: (value: any) => {
          if (value instanceof Point) {
            return new Point(Math.round(value.x), Math.round(value.y));
          }
        },
      });
    });
  });

  describe('commitLayout', () => {
    const prepareTest = (
      contextOptions: {
        type: typeof LAYOUT_TYPE_INITIALIZATION | typeof LAYOUT_TYPE_ADDED;
      } & Partial<LayoutContext>,
    ) => {
      const lifecycle: vi.SpyInstance[] = [];

      const targets = [new Group([new FabricObject()]), new FabricObject()];
      const target = new Group(targets, {
        strokeWidth: 0,
      });
      const targetSet = vi.spyOn(target, 'set').mockImplementation(() => {
        lifecycle.push(targetSet);
      });
      const targetSetCoords = vi
        .spyOn(target, 'setCoords')
        .mockImplementation(() => {
          lifecycle.push(targetSetCoords);
        });
      const targetSetPositionByOrigin = vi
        .spyOn(target, 'setPositionByOrigin')
        .mockImplementation(() => {
          lifecycle.push(targetSetPositionByOrigin);
        });

      const manager = new LayoutManager();
      const layoutObjects = vi
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
        target,
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
          // this needs to be investigated.
          left: pos.x ?? 5,
          top: pos.y ?? 5,
        });
      },
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
      expect(targetMocks.set).nthCalledWith(2, 'dirty', true);
    });
  });

  describe('onAfterLayout', () => {
    it.each([true, false])(
      'should call target hooks with bubbling %s',
      (bubbles) => {
        const lifecycle: vi.SpyInstance[] = [];
        const manager = new LayoutManager();
        const targets = [
          new Group([new FabricObject()], { layoutManager: manager }),
          new FabricObject(),
        ];
        const target = new Group(targets, { layoutManager: manager });
        const targetFire = vi.spyOn(target, 'fire').mockImplementation(() => {
          lifecycle.push(targetFire);
        });

        const parent = new Group([target], { layoutManager: manager });
        const parentPerformLayout = vi
          .spyOn(parent.layoutManager, 'performLayout')
          .mockImplementation(() => {
            lifecycle.push(parentPerformLayout);
          });

        const canvasFire = vi.fn();
        target.canvas = { fire: canvasFire };

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
          targetFire,
          ...(bubbles ? [parentPerformLayout] : []),
        ]);
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
      },
    );

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

      const grandParentPerformLayout = vi.spyOn(manager2, 'performLayout');

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
      vi.spyOn(canvas, 'fire');
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
      vi.spyOn(canvas, 'fire');
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
      expect(group.getCenterPoint()).toMatchObject({ x: 0, y: 0 });
      expect(child.getCenterPoint()).toMatchObject(group.getCenterPoint());
    });

    it('should subscribe objects on initialization', () => {
      const child = new FabricObject({
        width: 200,
        height: 200,
        strokeWidth: 0,
      });
      vi.spyOn(child, 'toJSON').mockReturnValue('child');
      const group = new Group([child]);
      expect(
        Array.from(group.layoutManager['_subscriptions'].keys()),
      ).toMatchObject([child]);
    });

    describe('fromObject restore', () => {
      const createTestData = (type: string) => ({
        width: 2,
        height: 3,
        left: 6,
        top: 4,
        strokeWidth: 0,
        objects: [
          new Rect({
            width: 100,
            height: 100,
            top: 0,
            left: 0,
            strokeWidth: 0,
          }).toObject(),
          new Rect({
            width: 100,
            height: 100,
            top: 0,
            left: 0,
            strokeWidth: 0,
          }).toObject(),
        ],
        clipPath: new Rect({
          width: 50,
          height: 50,
          top: 0,
          left: 0,
          strokeWidth: 0,
        }).toObject(),
        layoutManager: {
          type: 'layoutManager',
          strategy: type,
        },
      });
      describe('Fitcontent layout', () => {
        it('should subscribe objects', async () => {
          const group = await Group.fromObject(
            createTestData(FitContentLayout.type),
          );
          expect(
            Array.from(group.layoutManager['_subscriptions'].keys()),
          ).toMatchObject(group.getObjects());
        });
      });
      describe('FixedLayout layout', () => {
        it('should subscribe objects', async () => {
          const group = await Group.fromObject(
            createTestData(FixedLayout.type),
          );
          expect(
            Array.from(group.layoutManager['_subscriptions'].keys()),
          ).toMatchObject(group.getObjects());
        });
      });
      describe('ClipPathLayout layout', () => {
        it('should subscribe objects', async () => {
          const group = await Group.fromObject(
            createTestData(ClipPathLayout.type),
          );
          expect(
            Array.from(group.layoutManager['_subscriptions'].keys()),
          ).toMatchObject(group.getObjects());
        });
      });
    });

    test.each([true, false])(
      'initialization edge case, with specified layoutManager %s',
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
          layoutManager: legacy ? undefined : new LayoutManager(),
        });
        expect(group).toMatchObject({ width: 200, height: 200 });
        expect(child.getRelativeCenterPoint()).toMatchObject({ x: 0, y: 0 });
        expect(group.getCenterPoint()).toMatchObject({ x: 0, y: 0 });
        expect(child.getCenterPoint()).toMatchObject(group.getCenterPoint());
      },
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
      expect(child.getCenterPoint()).toMatchObject({ x: 0, y: 0 });
      expect(group.getCenterPoint()).toMatchObject({ x: 0, y: 0 });
    });
  });
});
