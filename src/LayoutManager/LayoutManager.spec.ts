import { Point } from '../Point';
import { Group } from '../shapes/Group';
import { FabricObject } from '../shapes/Object/FabricObject';
import { LayoutManager } from './LayoutManager';
import { FitContentLayout } from './LayoutStrategies/FitContentLayout';
import type {
  LayoutContext,
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
      const layoutResult = result
        ? {
            result: { centerX: 0, centerY: 0, width: 0, height: 0 },
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
        type: 'initialization',
        target,
        targets,
      });

      const context = {
        bubbles: true,
        strategy: manager.strategy,
        type: 'initialization',
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

    it('should guard initial layout', () => {
      const manager = new LayoutManager();
      const onBeforeLayout = jest.spyOn(manager, 'onBeforeLayout');
      const target = new Group();
      manager.performLayout({ type: 'imperative', target });
      expect(onBeforeLayout).not.toHaveBeenCalled();
      manager.performLayout({
        type: 'initialization',
        target,
        targets: [],
      });
      expect(onBeforeLayout).toHaveBeenCalled();
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

        manager.subscribe({}, object);

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
        manager.subscribe({ target }, object);

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
        expect(manager._subscriptions.get(object)).toBeDefined();
        manager.unsubscribe({ target }, object);
        expect(manager._subscriptions.get(object)).toBeUndefined();
        triggers.forEach((trigger) => object.fire(trigger, event));
        expect(performLayout).not.toHaveBeenCalled();
      });
    });

    it.each([
      { trigger: 'initialization', action: 'subscribe' },
      { trigger: 'added', action: 'subscribe' },
      { trigger: 'removed', action: 'unsubscribe' },
    ] as {
      trigger: LayoutTrigger;
      action: 'subscribe' | 'unsubscribe';
    }[])(
      '$trigger trigger should $action targets and call target hooks',
      ({ action }) => {
        const lifecycle: jest.SpyInstance[] = [];
        const targets = [new Group([new FabricObject()]), new FabricObject()];
        const target = new Group(targets);
        const targetOnBeforeLayout = jest
          .spyOn(target, 'onBeforeLayout')
          .mockImplementation(() => {
            lifecycle.push(targetOnBeforeLayout);
          });
        const targetFire = jest.spyOn(target, 'fire').mockImplementation(() => {
          lifecycle.push(targetFire);
        });

        const manager = new LayoutManager();
        const subscription = jest
          .spyOn(manager, action)
          .mockImplementation(() => {
            lifecycle.push(subscription);
          });

        const context: StrictLayoutContext = {
          bubbles: true,
          strategy: manager.strategy,
          type: 'initialization',
          target,
          targets,
          prevStrategy: undefined,
          stopPropagation() {
            this.bubbles = false;
          },
        };
        manager.onBeforeLayout(context);

        expect(lifecycle).toEqual([
          subscription,
          subscription,
          targetOnBeforeLayout,
          targetFire,
        ]);
        expect(targetOnBeforeLayout).toBeCalledWith({ context });
        expect(targetFire).toBeCalledWith('layout:before', {
          context,
        });
      }
    );
  });

  describe('getLayoutResult', () => {
    test.each([
      { type: 'initialization', targets: [] },
      { type: 'initialization', objectsRelativeToGroup: true, targets: [] },
      { type: 'imperative' },
    ] as const)('#type trigger', (options) => {
      const manager = new LayoutManager();
      jest.spyOn(manager.strategy, 'calcLayoutResult').mockReturnValue({
        centerX: 50,
        centerY: 100,
        width: 200,
        height: 250,
        correctionX: 10,
        correctionY: 20,
        relativeCorrectionX: -30,
        relativeCorrectionY: -40,
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

      expect(manager.getLayoutResult(context)).toMatchSnapshot();
    });
  });

  describe('commitLayout', () => {
    const prepareTest = (
      contextOptions: {
        type: 'initialization' | 'added';
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
          result: { centerX: 5, centerY: 5, width: 10, height: 10 },
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
        } = prepareTest({ type: 'initialization', ...pos });
        const {
          result: { width, height },
        } = layoutResult;

        manager.commitLayout(context, layoutResult);

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
      } = prepareTest({ type: 'added' });
      const {
        result: { width, height },
      } = layoutResult;

      manager.commitLayout(context, layoutResult);

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
        const targets = [new Group([new FabricObject()]), new FabricObject()];
        const target = new Group(targets);
        const targetOnAfterLayout = jest
          .spyOn(target, 'onAfterLayout')
          .mockImplementation(() => {
            lifecycle.push(targetOnAfterLayout);
          });
        const targetFire = jest.spyOn(target, 'fire').mockImplementation(() => {
          lifecycle.push(targetFire);
        });

        const parent = new Group([target]);
        const parentPerformLayout = jest
          .spyOn(parent.layoutManager, 'performLayout')
          .mockImplementation(() => {
            lifecycle.push(parentPerformLayout);
          });

        const manager = new LayoutManager();
        const shouldResetTransform = jest
          .spyOn(manager.strategy, 'shouldResetTransform')
          .mockImplementation(() => {
            lifecycle.push(shouldResetTransform);
          });

        const context: StrictLayoutContext = {
          bubbles,
          strategy: manager.strategy,
          type: 'added',
          target,
          targets,
          prevStrategy: undefined,
          stopPropagation() {
            this.bubbles = false;
          },
        };
        const layoutResult = {
          result: { centerX: 0, centerY: 0, width: 0, height: 0 },
          prevCenter: new Point(),
          nextCenter: new Point(),
          offset: new Point(),
        };
        manager.onAfterLayout(context, layoutResult);

        expect(lifecycle).toEqual([
          shouldResetTransform,
          targetOnAfterLayout,
          targetFire,
          ...(bubbles ? [parentPerformLayout] : []),
        ]);
        expect(shouldResetTransform).toBeCalledWith(context);
        expect(targetOnAfterLayout).toBeCalledWith({
          context,
          result: layoutResult,
        });
        expect(targetFire).toBeCalledWith('layout', {
          context,
          result: layoutResult,
        });
        bubbles &&
          expect(parentPerformLayout.mock.calls[0]).toMatchObject([
            {
              type: 'added',
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
        type: 'removed',
        target,
        targets,
        prevStrategy: undefined,
        stopPropagation() {
          this.bubbles = false;
        },
      };
      manager.onAfterLayout(context);

      expect(target.left).toBe(reset ? 0 : 50);
    });

    test('bubbling', () => {
      const targets = [new Group([new FabricObject()]), new FabricObject()];
      const target = new Group(targets);
      const parent = new Group([target]);
      const grandParent = new Group([parent]);
      const manager = new LayoutManager();

      const grandParentPerformLayout = jest.spyOn(
        grandParent.layoutManager,
        'performLayout'
      );

      const context: StrictLayoutContext = {
        bubbles: true,
        strategy: manager.strategy,
        type: 'added',
        target,
        targets,
        prevStrategy: undefined,
        stopPropagation() {
          this.bubbles = false;
        },
      };
      const layoutResult = {
        result: { centerX: 0, centerY: 0, width: 0, height: 0 },
        prevCenter: new Point(),
        nextCenter: new Point(),
        offset: new Point(),
      };
      manager.onAfterLayout(context, layoutResult);

      expect(grandParentPerformLayout.mock.calls[0]).toMatchObject([
        {
          type: 'added',
          targets,
          target: grandParent,
          path: [target, parent],
        },
      ]);
    });
  });
});
