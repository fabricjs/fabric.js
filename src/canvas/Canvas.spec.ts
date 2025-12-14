import { Canvas } from './Canvas';
import { Rect } from '../shapes/Rect';
import { IText } from '../shapes/IText/IText';
import '../shapes/ActiveSelection';

import { afterEach, beforeEach, describe, expect, it, test, vi } from 'vitest';
import { config } from '../config';
import type {
  FabricObject,
  MultiSelectionStacking,
  TPointerEvent,
} from '../../fabric';
import {
  ActiveSelection,
  Circle,
  classRegistry,
  getFabricDocument,
  Group,
  Path,
  version,
} from '../../fabric';
import TEST_IMAGE from '../../test/fixtures/test_image.gif';
import { isJSDOM } from '../../vitest.extend';
import {
  EMPTY_JSON,
  PATH_DATALESS_JSON,
  PATH_OBJ_JSON,
  PATH_WITHOUT_DEFAULTS_JSON,
  PATH_JSON,
  RECT_JSON,
} from './Canvas.fixtures.ts';

describe('Canvas', () => {
  let canvas: Canvas;
  let upperCanvasEl: HTMLCanvasElement;
  let lowerCanvasEl: HTMLCanvasElement;

  beforeEach(() => {
    canvas = new Canvas(undefined, {
      enableRetinaScaling: false,
      width: 600,
      height: 600,
    });
    upperCanvasEl = canvas.upperCanvasEl;
    lowerCanvasEl = canvas.lowerCanvasEl;
  });

  afterEach(() => {
    config.restoreDefaults();
    classRegistry.setClass(ActiveSelection);
    return canvas.dispose();
  });

  describe('touchStart', () => {
    test('will prevent default to not allow dom scrolling on canvas touch drag', () => {
      const canvas = new Canvas(undefined, {
        allowTouchScrolling: false,
      });
      const touch = new Touch({
        clientX: 10,
        clientY: 0,
        identifier: 1,
        target: canvas.upperCanvasEl,
      });
      const evt = new TouchEvent('touchstart', {
        touches: [touch],
        changedTouches: [touch],
      });
      evt.preventDefault = vi.fn();
      canvas._onTouchStart(evt);
      expect(evt.preventDefault).toHaveBeenCalled();
    });
    test('will not prevent default when allowTouchScrolling is true and there is no action', () => {
      const canvas = new Canvas(undefined, {
        allowTouchScrolling: true,
      });
      const touch = new Touch({
        clientX: 10,
        clientY: 0,
        identifier: 1,
        target: canvas.upperCanvasEl,
      });
      const evt = new TouchEvent('touchstart', {
        touches: [touch],
        changedTouches: [touch],
      });
      evt.preventDefault = vi.fn();
      canvas._onTouchStart(evt);
      expect(evt.preventDefault).not.toHaveBeenCalled();
    });
    test('will prevent default when allowTouchScrolling is true but we are drawing', () => {
      const canvas = new Canvas(undefined, {
        allowTouchScrolling: true,
        isDrawingMode: true,
      });
      const touch = new Touch({
        clientX: 10,
        clientY: 0,
        identifier: 1,
        target: canvas.upperCanvasEl,
      });
      const evt = new TouchEvent('touchstart', {
        touches: [touch],
        changedTouches: [touch],
      });
      evt.preventDefault = vi.fn();
      canvas._onTouchStart(evt);
      expect(evt.preventDefault).toHaveBeenCalled();
    });
    test('will prevent default when allowTouchScrolling is true and we are dragging an object', () => {
      const canvas = new Canvas(undefined, {
        allowTouchScrolling: true,
      });
      const rect = new Rect({
        width: 2000,
        height: 2000,
        left: -500,
        top: -500,
      });
      canvas.add(rect);
      canvas.setActiveObject(rect);
      const touch = new Touch({
        clientX: 10,
        clientY: 0,
        identifier: 1,
        target: canvas.upperCanvasEl,
      });
      const evt = new TouchEvent('touchstart', {
        touches: [touch],
        changedTouches: [touch],
      });
      evt.preventDefault = vi.fn();
      canvas._onTouchStart(evt);
      expect(evt.preventDefault).toHaveBeenCalled();
    });
    test('will NOT prevent default when allowTouchScrolling is true and we just lost selection', () => {
      const canvas = new Canvas(undefined, {
        allowTouchScrolling: true,
      });
      const rect = new Rect({
        width: 200,
        height: 200,
        left: 1000,
        top: 1000,
      });
      canvas.add(rect);
      canvas.setActiveObject(rect);
      const touch = new Touch({
        clientX: 10,
        clientY: 0,
        identifier: 1,
        target: canvas.upperCanvasEl,
      });
      const evt = new TouchEvent('touchstart', {
        touches: [touch],
        changedTouches: [touch],
      });
      evt.preventDefault = vi.fn();
      canvas._onTouchStart(evt);
      expect(evt.preventDefault).not.toHaveBeenCalled();
    });
    test('dispose after _onTouchStart', () => {
      const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
      const canvas = new Canvas(undefined, {
        allowTouchScrolling: true,
        isDrawingMode: true,
      });
      const touch = new Touch({
        clientX: 10,
        clientY: 0,
        identifier: 1,
        target: canvas.upperCanvasEl,
      });
      const evtStart = new TouchEvent('touchstart', {
        touches: [touch],
        changedTouches: [touch],
      });
      canvas._onTouchStart(evtStart);
      const evtEnd = new TouchEvent('touchend', {
        touches: [],
        changedTouches: [touch],
      });
      canvas._onTouchEnd(evtEnd);
      // @ts-expect-error -- private method
      expect(+canvas._willAddMouseDown).toBeGreaterThan(0);
      canvas.dispose();
      // @ts-expect-error -- private method
      expect(clearTimeoutSpy).toHaveBeenCalledWith(canvas._willAddMouseDown);
    });
  });

  describe('handleMultiSelection', () => {
    const canvas = new Canvas();
    const rect = new Rect({ left: 100, width: 100, height: 100 });
    const iText = new IText('itext');
    canvas.add(rect, iText);
    test('Selecting shapes containing text does not trigger the exit event', () => {
      const exitMock = vi.fn();
      iText.on('editing:exited', exitMock);

      const firstClick = new MouseEvent('click', {
        clientX: 0,
        clientY: 0,
      });
      canvas._onMouseDown(firstClick);
      canvas._onMouseUp(firstClick);
      const secondClick = new MouseEvent('click', {
        shiftKey: true,
        clientX: 100,
        clientY: 0,
      });
      canvas._onMouseDown(secondClick);
      canvas._onMouseUp(secondClick);

      expect(exitMock).toHaveBeenCalledTimes(0);
    });
  });

  it('prevents multiple canvas initialization', () => {
    const newCanvas = new Canvas();
    expect(newCanvas.lowerCanvasEl).toBeTruthy();
    expect(() => new Canvas(newCanvas.lowerCanvasEl)).toThrow();
  });

  it('initializes with element existing in the dom', () => {
    const doc = getFabricDocument();
    const wrapper = doc.createElement('div');
    const canvasEl = doc.createElement('canvas');
    wrapper.appendChild(canvasEl);
    doc.body.appendChild(wrapper);
    const newCanvas = new Canvas(canvasEl);
    expect(wrapper.firstChild, 'replaced canvas el in dom').toBe(
      newCanvas.elements.container,
    );
    expect(
      newCanvas.elements.container.firstChild,
      'appended canvas el to container',
    ).toBe(newCanvas.elements.lower.el);
    expect(
      newCanvas.elements.container.lastChild,
      'appended upper canvas el to container',
    ).toBe(newCanvas.elements.upper.el);
  });

  it('has expected initial properties', () => {
    expect('backgroundColor' in canvas).toBeTruthy();
    expect(canvas.includeDefaultValues).toBe(true);
  });

  it('implements getObjects method', () => {
    expect(
      canvas.getObjects,
      'should respond to `getObjects` method',
    ).toBeTypeOf('function');
    expect(
      canvas.getObjects(),
      'should return empty array for `getObjects` when empty',
    ).toEqual([]);
    expect(
      canvas.getObjects().length,
      'should have a 0 length when empty',
    ).toBe(0);
  });

  it('implements getElement method', () => {
    expect(
      canvas.getElement,
      'should respond to `getElement` method',
    ).toBeTypeOf('function');
    expect(canvas.getElement(), 'should return a proper element').toBe(
      lowerCanvasEl,
    );
  });

  it('implements item method', () => {
    const rect = makeRect();

    expect(canvas.item, 'should respond to item').toBeTypeOf('function');
    canvas.add(rect);
    expect(canvas.item(0), 'should return proper item').toBe(rect);
  });

  it('preserveObjectStacking property', () => {
    expect(canvas.preserveObjectStacking).toBeTypeOf('boolean');
    expect(canvas.preserveObjectStacking, 'default is true').toBeTruthy();
  });

  it('uniformScaling property', () => {
    expect(canvas.uniformScaling).toBeTypeOf('boolean');
    expect(canvas.uniformScaling, 'default is true').toBeTruthy();
  });

  it('uniScaleKey property', () => {
    expect(canvas.uniScaleKey).toBeTypeOf('string');
    expect(canvas.uniScaleKey, 'default is shift').toBe('shiftKey');
  });

  it('centeredScaling property', () => {
    expect(canvas.centeredScaling).toBeTypeOf('boolean');
    expect(canvas.centeredScaling, 'default is false').toBeFalsy();
  });

  it('centeredRotation property', () => {
    expect(canvas.centeredRotation).toBeTypeOf('boolean');
    expect(canvas.centeredRotation, 'default is false').toBeFalsy();
  });

  it('centeredKey property', () => {
    expect(canvas.centeredKey).toBeTypeOf('string');
    expect(canvas.centeredKey, 'default is alt').toBe('altKey');
  });

  it('altActionKey property', () => {
    expect(canvas.altActionKey).toBeTypeOf('string');
    expect(canvas.altActionKey, 'default is shift').toBe('shiftKey');
  });

  it('selection property', () => {
    expect(canvas.selection).toBeTypeOf('boolean');
    expect(canvas.selection, 'default is true').toBeTruthy();
  });

  it('initializes DOM elements correctly', () => {
    expect(
      canvas.lowerCanvasEl.getAttribute('data-fabric'),
      'el should be marked by canvas init',
    ).toBe('main');
    expect(
      canvas.upperCanvasEl.getAttribute('data-fabric'),
      'el should be marked by canvas init',
    ).toBe('top');
    expect(
      canvas.wrapperEl.getAttribute('data-fabric'),
      'el should be marked by canvas init',
    ).toBe('wrapper');
  });

  it('implements renderTop method', () => {
    expect(canvas.renderTop).toBeTypeOf('function');
  });

  it('implements _chooseObjectsToRender method', () => {
    expect(canvas._chooseObjectsToRender).toBeTypeOf('function');
    canvas.preserveObjectStacking = false;
    const rect = makeRect(),
      rect2 = makeRect(),
      rect3 = makeRect();
    canvas.add(rect);
    canvas.add(rect2);
    canvas.add(rect3);

    let objs = canvas._chooseObjectsToRender();
    expect(objs[0]).toBe(rect);
    expect(objs[1]).toBe(rect2);
    expect(objs[2]).toBe(rect3);

    canvas.setActiveObject(rect);
    objs = canvas._chooseObjectsToRender();
    expect(objs[0]).toBe(rect2);
    expect(objs[1]).toBe(rect3);
    expect(objs[2]).toBe(rect);

    canvas.setActiveObject(rect2);
    canvas.preserveObjectStacking = true;
    objs = canvas._chooseObjectsToRender();
    expect(objs[0]).toBe(rect);
    expect(objs[1]).toBe(rect2);
    expect(objs[2]).toBe(rect3);
  });

  it('implements calcOffset method', () => {
    expect(canvas.calcOffset, 'should respond to `calcOffset`').toBeTypeOf(
      'function',
    );
    expect(canvas.calcOffset(), 'should return offset').toEqual({
      left: 0,
      top: 0,
    });
  });

  it('implements add method', () => {
    const rect1 = makeRect(),
      rect2 = makeRect(),
      rect3 = makeRect(),
      rect4 = makeRect();

    expect(canvas.add).toBeTypeOf('function');
    expect(
      canvas.add(rect1),
      'should return the new length of objects array',
    ).toBe(1);
    expect(canvas.item(0)).toBe(rect1);

    canvas.add(rect2, rect3, rect4);
    expect(
      canvas.getObjects().length,
      'should support multiple arguments',
    ).toBe(4);

    expect(canvas.item(1)).toBe(rect2);
    expect(canvas.item(2)).toBe(rect3);
    expect(canvas.item(3)).toBe(rect4);
  });

  it('implements insertAt method', () => {
    const rect1 = makeRect(),
      rect2 = makeRect();

    canvas.add(rect1, rect2);

    expect(canvas.insertAt, 'should respond to `insertAt` method').toBeTypeOf(
      'function',
    );

    const rect = makeRect();
    canvas.insertAt(1, rect);
    expect(canvas.item(1)).toBe(rect);
    canvas.insertAt(2, rect);
    expect(canvas.item(2)).toBe(rect);
  });

  it('implements remove method', () => {
    const rect1 = makeRect(),
      rect2 = makeRect(),
      rect3 = makeRect(),
      rect4 = makeRect();

    canvas.add(rect1, rect2, rect3, rect4);

    expect(canvas.remove).toBeTypeOf('function');
    expect(canvas.remove(rect1)[0], 'should return the object removed').toBe(
      rect1,
    );
    expect(canvas.item(0), 'should be second object').toBe(rect2);

    canvas.remove(rect2, rect3);
    expect(canvas.item(0)).toBe(rect4);

    canvas.remove(rect4);
    expect(canvas.isEmpty(), 'canvas should be empty').toBe(true);
  });

  it('clears hovered target when removed', () => {
    const rect1 = makeRect();
    canvas.add(rect1);
    canvas._hoveredTarget = rect1;
    canvas.remove(rect1);
    expect(
      canvas._hoveredTarget,
      'reference to hovered target should be removed',
    ).toBeUndefined();
  });

  it('fires before:selection:cleared only when removing active objects', () => {
    let isFired = false;
    canvas.on('before:selection:cleared', () => {
      isFired = true;
    });

    canvas.add(new Rect());
    canvas.remove(canvas.item(0));

    expect(
      isFired,
      'removing inactive object shouldnt fire "before:selection:cleared"',
    ).toBe(false);

    canvas.add(new Rect());
    canvas.setActiveObject(canvas.item(0));
    canvas.remove(canvas.item(0));

    expect(
      isFired,
      'removing active object should fire "before:selection:cleared"',
    ).toBe(true);
  });

  it('provides deselected objects in before:selection:cleared event', () => {
    let deselected: FabricObject[] = [];
    canvas.on('before:selection:cleared', (options) => {
      deselected = options.deselected;
    });

    const rect = new Rect();
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.discardActiveObject();

    expect(deselected.length, 'options.deselected was the removed object').toBe(
      1,
    );
    expect(deselected[0], 'options.deselected was the removed object').toBe(
      rect,
    );

    const rect1 = new Rect();
    const rect2 = new Rect();
    canvas.add(rect1, rect2);

    const activeSelection = new ActiveSelection();
    activeSelection.add(rect1, rect2);
    canvas.setActiveObject(activeSelection);
    canvas.discardActiveObject();

    expect(deselected.length, 'options.deselected was the removed object').toBe(
      1,
    );
    expect(
      deselected[0],
      'removing an activeSelection pass that as a target',
    ).toBe(activeSelection);
  });

  it('fires selection:cleared only when removing active objects', () => {
    let isFired = false;
    canvas.on('selection:cleared', () => {
      isFired = true;
    });

    canvas.add(new Rect());
    canvas.remove(canvas.item(0));

    expect(
      isFired,
      'removing inactive object shouldnt fire "selection:cleared"',
    ).toBe(false);

    canvas.add(new Rect());
    canvas.setActiveObject(canvas.item(0));
    canvas.remove(canvas.item(0));

    expect(
      isFired,
      'removing active object should fire "selection:cleared"',
    ).toBe(true);
    canvas.off('selection:cleared');
  });

  it('creating active selection fires selection:created event', () => {
    let isFired = false;
    const rect1 = new Rect();
    const rect2 = new Rect();
    canvas.add(rect1, rect2);
    canvas.on('selection:created', () => {
      isFired = true;
    });

    initActiveSelection(canvas, rect1, rect2, 'selection-order');

    expect(canvas._hoveredTarget, 'the created selection is also hovered').toBe(
      canvas.getActiveObject(),
    );
    expect(isFired, 'selection:created fired').toBe(true);

    canvas.off('selection:created');
    canvas.clear();
  });

  it('creating active selection fires selected event on new objects', () => {
    let isFired = false;
    const rect1 = new Rect();
    const rect2 = new Rect();
    canvas.add(rect1, rect2);
    rect2.on('selected', () => {
      isFired = true;
    });

    initActiveSelection(canvas, rect1, rect2, 'selection-order');

    const activeSelection = canvas.getActiveObjects();
    expect(isFired, 'selected fired on rect2').toBe(true);
    expect(activeSelection[0], 'first rec1').toBe(rect1);
    expect(activeSelection[1], 'then rect2').toBe(rect2);

    canvas.clear();
  });

  it('starts multiselection with correct order (default)', () => {
    const rect1 = new Rect();
    const rect2 = new Rect();
    canvas.add(rect1, rect2);

    initActiveSelection(canvas, rect2, rect1, 'selection-order');

    const activeSelection = canvas.getActiveObjects();
    expect(activeSelection[0], 'first rect2').toBe(rect2);
    expect(activeSelection[1], 'then rect1').toBe(rect1);
  });

  it('starts multiselection with canvas stacking order', () => {
    const rect1 = new Rect();
    const rect2 = new Rect();
    canvas.add(rect1, rect2);

    initActiveSelection(canvas, rect2, rect1, 'canvas-stacking');

    const activeSelection = canvas.getActiveObjects();
    expect(activeSelection[0], 'first rect1').toBe(rect1);
    expect(activeSelection[1], 'then rect2').toBe(rect2);
  });

  it('fires selection:updated when updating active selection', () => {
    let isFired = false;
    const rect1 = new Rect();
    const rect2 = new Rect();
    const rect3 = new Rect();
    canvas.add(rect1, rect2, rect3);
    canvas.on('selection:updated', () => {
      isFired = true;
    });

    updateActiveSelection(canvas, [rect1, rect2], rect3, 'selection-order');

    expect(isFired, 'selection:updated fired').toBe(true);
    expect(canvas._hoveredTarget, 'hovered target is updated').toBe(
      canvas.getActiveObject(),
    );
  });

  it('fires deselected event when removing object from active selection', () => {
    let isFired = false;
    const rect1 = new Rect({ width: 10, height: 10 });
    const rect2 = new Rect({ width: 10, height: 10 });
    canvas.add(rect1, rect2);
    rect2.on('deselected', () => {
      isFired = true;
    });

    updateActiveSelection(canvas, [rect1, rect2], rect2, 'selection-order');

    expect(isFired, 'deselected on rect2 fired').toBe(true);
  });

  it('fires selected event when adding object to active selection', () => {
    let isFired = false;
    const rect1 = new Rect();
    const rect2 = new Rect();
    const rect3 = new Rect();
    canvas.add(rect1, rect2, rect3);
    rect3.on('selected', () => {
      isFired = true;
    });

    updateActiveSelection(canvas, [rect1, rect2], rect3, 'selection-order');

    expect(isFired, 'selected on rect3 fired').toBe(true);
  });

  it('respects order of objects in continuing multiselection', () => {
    const rect1 = new Rect();
    const rect2 = new Rect();
    const rect3 = new Rect();
    canvas.add(rect1, rect2, rect3);

    function assertObjectsInOrder(init: FabricObject[], added: FabricObject) {
      updateActiveSelection(canvas, init, added, 'canvas-stacking');
      expect(
        canvas.getActiveObjects(),
        'updated selection while preserving canvas stacking order',
      ).toEqual([rect1, rect2, rect3]);
      canvas.discardActiveObject();

      updateActiveSelection(canvas, init, added, 'selection-order');
      expect(
        canvas.getActiveObjects(),
        'updated selection while preserving click order',
      ).toEqual([...init, added]);
      canvas.discardActiveObject();
    }

    function assertObjectsInOrderOnCanvas(
      init: FabricObject[],
      added: FabricObject,
    ) {
      expect(canvas.getObjects()).toEqual([rect1, rect2, rect3]);
      assertObjectsInOrder(init, added);
      expect(canvas.getObjects()).toEqual([rect1, rect2, rect3]);
    }

    assertObjectsInOrderOnCanvas([rect1, rect2], rect3);
    assertObjectsInOrderOnCanvas([rect1, rect3], rect2);
    assertObjectsInOrderOnCanvas([rect2, rect3], rect1);

    canvas.remove(rect2, rect3);
    const group = new Group([rect2, rect3], {
      subTargetCheck: true,
      interactive: true,
    });
    canvas.add(group);

    function assertNestedObjectsInOrder(
      init: FabricObject[],
      added: FabricObject,
    ) {
      expect(canvas.getObjects()).toEqual([rect1, group]);
      expect(group.getObjects()).toEqual([rect2, rect3]);
      assertObjectsInOrder(init, added);
      expect(canvas.getObjects()).toEqual([rect1, group]);
      expect(group.getObjects()).toEqual([rect2, rect3]);
    }

    assertNestedObjectsInOrder([rect1, rect2], rect3);
    assertNestedObjectsInOrder([rect1, rect3], rect2);
    assertNestedObjectsInOrder([rect2, rect3], rect1);

    canvas.remove(rect1);
    group.insertAt(0, rect1);
    group.remove(rect3);
    canvas.add(rect3);

    function assertNestedObjectsInOrder2(
      init: FabricObject[],
      added: FabricObject,
    ) {
      expect(canvas.getObjects()).toEqual([group, rect3]);
      expect(group.getObjects()).toEqual([rect1, rect2]);
      assertObjectsInOrder(init, added);
      expect(canvas.getObjects()).toEqual([group, rect3]);
      expect(group.getObjects()).toEqual([rect1, rect2]);
    }

    assertNestedObjectsInOrder2([rect1, rect2], rect3);
    assertNestedObjectsInOrder2([rect1, rect3], rect2);
    assertNestedObjectsInOrder2([rect2, rect3], rect1);
  });

  it('toggles selected objects in multiselection', () => {
    const rect1 = new Rect();
    const rect2 = new Rect();
    const rect3 = new Rect();
    let isFired = false;
    rect2.on('deselected', () => {
      isFired = true;
    });
    canvas.add(rect1, rect2, rect3);

    updateActiveSelection(
      canvas,
      [rect1, rect2, rect3],
      rect2,
      'selection-order',
    );

    expect(canvas.getActiveObjects(), 'rect2 was deselected').toEqual([
      rect1,
      rect3,
    ]);
    expect(isFired, 'fired deselected').toBeTruthy();
  });

  it('toggles nested target when clicking inside active selection', () => {
    const rect1 = new Rect({ width: 10, height: 10 });
    const rect2 = new Rect({ width: 10, height: 10 });
    const rect3 = new Rect({ width: 10, height: 10 });
    let isFired = false;
    rect3.on('deselected', () => {
      isFired = true;
    });
    canvas.add(rect1, rect2, rect3);

    updateActiveSelection(
      canvas,
      [rect1, rect2, rect3],
      null,
      'selection-order',
    );

    expect(canvas.getActiveObjects(), 'rect3 was deselected').toEqual([
      rect1,
      rect2,
    ]);
    expect(isFired, 'fired deselected').toBeTruthy();
  });

  it('does nothing when clicking active selection area', () => {
    const rect1 = new Rect({ left: 10, width: 10, height: 10 });
    const rect2 = new Rect({ left: -10, width: 5, height: 5 });
    const rect3 = new Rect({ top: 10, width: 10, height: 10 });
    canvas.add(rect1, rect2, rect3);

    updateActiveSelection(
      canvas,
      [rect1, rect2, rect3],
      null,
      'selection-order',
    );

    expect(canvas.getActiveObjects(), 'nothing happened').toEqual([
      rect1,
      rect2,
      rect3,
    ]);
    expect(
      canvas.getActiveObject() === canvas.getActiveObject(),
      'still selected',
    ).toBeTruthy();
  });

  it('selects target behind active selection when using selection key', () => {
    const rect1 = new Rect({ left: 15, top: 5, width: 10, height: 10 });
    const rect2 = new Rect({ width: 10, height: 10, left: 5, top: 5 });
    const rect3 = new Rect({ top: 15, left: 5, width: 10, height: 10 });
    canvas.add(rect1, rect2, rect3);

    initActiveSelection(canvas, rect1, rect3);

    expect(
      canvas.getActiveObject() === canvas.getActiveObject(),
      'selected',
    ).toBeTruthy();
    expect(canvas.getActiveObjects(), 'created').toEqual([rect1, rect3]);

    canvas._onMouseDown({
      clientX: 7,
      clientY: 7,
      [canvas.selectionKey as string]: true,
    } as unknown as TPointerEvent);

    expect(
      canvas.getActiveObjects(),
      'added from behind active selection',
    ).toEqual([rect1, rect2, rect3]);
    expect(
      canvas.getActiveObject() === canvas.getActiveObject(),
      'still selected',
    ).toBeTruthy();
  });

  it('fires deselected event when changing active object', () => {
    let isFired = false;
    const rect1 = new Rect();
    const rect2 = new Rect();
    rect1.on('deselected', () => {
      isFired = true;
    });

    canvas.setActiveObject(rect1);
    canvas.setActiveObject(rect2);

    expect(isFired, 'switching active group fires deselected').toBe(true);
  });

  it('fires selected event for each object when group selecting', () => {
    let fired = 0;
    const rect1 = new Rect({ width: 10, height: 10 });
    const rect2 = new Rect({ width: 10, height: 10 });
    const rect3 = new Rect({ width: 10, height: 10 });
    rect1.on('selected', () => {
      fired++;
    });
    rect2.on('selected', () => {
      fired++;
    });
    rect3.on('selected', () => {
      fired++;
    });
    canvas.add(rect1, rect2, rect3);

    setGroupSelector(canvas, {
      x: 1,
      y: 1,
      deltaX: 5,
      deltaY: 5,
    });
    canvas._onMouseUp({
      target: canvas.upperCanvasEl,
    } as unknown as TPointerEvent);

    expect(fired, 'event fired for each of 3 rects').toBe(3);
  });

  it('fires selection:created when multiple objects are selected', () => {
    let isFired = false;
    const rect1 = new Rect({ width: 10, height: 10 });
    const rect2 = new Rect({ width: 10, height: 10 });
    const rect3 = new Rect({ width: 10, height: 10 });
    canvas.on('selection:created', () => {
      isFired = true;
    });
    canvas.add(rect1, rect2, rect3);

    setGroupSelector(canvas, {
      x: 1,
      y: 1,
      deltaX: 5,
      deltaY: 5,
    });
    canvas._onMouseUp({
      target: canvas.upperCanvasEl,
    } as unknown as TPointerEvent);

    expect(isFired, 'selection created fired').toBe(true);
    expect(
      // @ts-expect-error -- constructor function has type
      canvas.getActiveObject()!.constructor.type,
      'an active selection is created',
    ).toBe('ActiveSelection');
    expect(canvas.getActiveObjects()[0], 'rect1 is first object').toBe(rect1);
    expect(canvas.getActiveObjects()[1], 'rect2 is second object').toBe(rect2);
    expect(canvas.getActiveObjects()[2], 'rect3 is third object').toBe(rect3);
    expect(canvas.getActiveObjects().length, 'contains exactly 3 objects').toBe(
      3,
    );
  });

  it('fires selection:created when a single object is selected', () => {
    let isFired = false;
    const rect1 = new Rect({ width: 10, height: 10 });
    canvas.on('selection:created', () => {
      isFired = true;
    });
    canvas.add(rect1);

    setGroupSelector(canvas, {
      x: 1,
      y: 1,
      deltaX: 5,
      deltaY: 5,
    });
    canvas._onMouseUp({
      target: canvas.upperCanvasEl,
    } as unknown as TPointerEvent);

    expect(isFired, 'selection:created fired').toBe(true);
    expect(canvas.getActiveObject(), 'rect1 is set as activeObject').toBe(
      rect1,
    );
  });

  it('collects topmost object when no dragging occurs', () => {
    const rect1 = new Rect({ width: 10, height: 10, top: 0, left: 0 });
    const rect2 = new Rect({ width: 10, height: 10, top: 0, left: 0 });
    const rect3 = new Rect({ width: 10, height: 10, top: 0, left: 0 });
    canvas.add(rect1, rect2, rect3);

    setGroupSelector(canvas, { x: 1, y: 1, deltaX: 0, deltaY: 0 });

    // @ts-expect-error -- protected method
    expect(canvas.handleSelection({}), 'selection occurred').toBeTruthy();
    expect(
      canvas.getActiveObjects().length,
      'a rect that contains all objects collects them all',
    ).toBe(1);
    expect(canvas.getActiveObjects()[0], 'rect3 is collected').toBe(rect3);
  });

  it('does not collect objects with onSelect returning true', () => {
    const rect1 = new Rect({ width: 10, height: 10, top: 2, left: 2 });
    rect1.onSelect = () => {
      return true;
    };
    const rect2 = new Rect({ width: 10, height: 10, top: 2, left: 2 });
    canvas.add(rect1, rect2);

    setGroupSelector(canvas, { x: 1, y: 1, deltaX: 20, deltaY: 20 });

    // @ts-expect-error -- protected method
    expect(canvas.handleSelection({}), 'selection occurred').toBeTruthy();
    expect(
      canvas.getActiveObjects().length,
      'objects are in the same position buy only one gets selected',
    ).toBe(1);
    expect(canvas.getActiveObjects()[0], 'contains rect2 but not rect 1').toBe(
      rect2,
    );
  });

  it('does not call onSelect on objects that are not intersected', () => {
    const rect1 = new Rect({ width: 10, height: 10, top: 5, left: 5 });
    const rect2 = new Rect({ width: 10, height: 10, top: 5, left: 15 });
    let onSelectRect1CallCount = 0;
    let onSelectRect2CallCount = 0;

    rect1.onSelect = () => {
      onSelectRect1CallCount++;
      return false;
    };
    rect2.onSelect = () => {
      onSelectRect2CallCount++;
      return false;
    };
    canvas.add(rect1, rect2);

    // Intersects none
    setGroupSelector(canvas, { x: 25, y: 25, deltaX: 1, deltaY: 1 });
    // @ts-expect-error -- protected method
    expect(canvas.handleSelection({}), 'selection occurred').toBeTruthy();
    const onSelectCalls = onSelectRect1CallCount + onSelectRect2CallCount;
    expect(onSelectCalls, 'none of the onSelect methods was called').toBe(0);

    // Intersects one
    setGroupSelector(canvas, { x: 0, y: 0, deltaX: 5, deltaY: 5 });
    // @ts-expect-error -- protected method
    expect(canvas.handleSelection({}), 'selection occurred').toBeTruthy();
    expect(canvas.getActiveObject(), 'rect1 was selected').toBe(rect1);
    expect(
      onSelectRect1CallCount,
      'rect1 onSelect was called while setting active object',
    ).toBe(1);
    expect(onSelectRect2CallCount, 'rect2 onSelect was not called').toBe(0);

    // Intersects both
    setGroupSelector(canvas, { x: 0, y: 0, deltaX: 15, deltaY: 5 });
    // @ts-expect-error -- protected method
    expect(canvas.handleSelection({}), 'selection occurred').toBeTruthy();
    expect(canvas.getActiveObjects(), 'rect1 selected').toEqual([rect1, rect2]);
    expect(
      onSelectRect1CallCount,
      'rect1 onSelect was called once when collectiong it and once when selecting it',
    ).toBe(2);
    expect(onSelectRect2CallCount, 'rect2 onSelect was called').toBe(1);
  });

  it('returns false from handleMultiSelection when onSelect returns true', () => {
    const rect = new Rect();
    const rect2 = new Rect();
    rect.onSelect = () => {
      return true;
    };
    canvas._activeObject = rect2;
    const selectionKey = canvas.selectionKey;
    const event = {};
    // @ts-expect-error -- typed as readonly but in test case we want to override
    event[selectionKey] = true;
    // @ts-expect-error -- protected method
    const returned = canvas.handleMultiSelection(event, rect);

    expect(returned, 'if onSelect returns true, shouldGroup return false').toBe(
      false,
    );
  });

  it('returns true from handleMultiSelection when onSelect returns false and selectionKey is true', () => {
    const rect = new Rect();
    const rect2 = new Rect();
    rect.onSelect = () => {
      return false;
    };
    canvas._activeObject = rect2;
    const selectionKey = canvas.selectionKey;
    const event = {};
    // @ts-expect-error -- typed as readonly but in test case we want to override
    event[selectionKey] = true;
    // @ts-expect-error -- protected method
    const returned = canvas.handleMultiSelection(event, rect);
    expect(returned, 'if onSelect returns false, shouldGroup return true').toBe(
      true,
    );
  });

  it('returns false from handleMultiSelection when selectionKey is false', () => {
    const rect = new Rect();
    const rect2 = new Rect();
    rect.onSelect = () => {
      return false;
    };
    canvas._activeObject = rect2;
    const selectionKey = canvas.selectionKey;
    const event = {};
    // @ts-expect-error -- typed as readonly but in test case we want to override
    event[selectionKey] = false;
    // @ts-expect-error -- protected method
    const returned = canvas.handleMultiSelection(event, rect);
    expect(returned, 'shouldGroup return false').toBe(false);
  });

  it('fires multiple events from _fireSelectionEvents', () => {
    let rect1Deselected = false;
    let rect3Selected = false;
    const rect1 = new Rect();
    const rect2 = new Rect();
    const rect3 = new Rect();
    const activeSelection = new ActiveSelection();
    activeSelection.add(rect1, rect2);
    canvas.setActiveObject(activeSelection);
    rect1.on('deselected', () => {
      rect1Deselected = true;
    });
    rect3.on('selected', () => {
      rect3Selected = true;
    });
    const currentObjects = canvas.getActiveObjects();
    activeSelection.remove(rect1);
    activeSelection.add(rect3);
    canvas._fireSelectionEvents(currentObjects, {} as TPointerEvent);
    expect(rect3Selected, 'rect 3 selected').toBeTruthy();
    expect(rect1Deselected, 'rect 1 deselected').toBeTruthy();
  });

  it('implements getContext method', () => {
    expect(canvas.getContext).toBeTypeOf('function');
  });

  it('implements clearContext method', () => {
    expect(canvas.clearContext).toBeTypeOf('function');
    canvas.clearContext(canvas.getContext());
  });

  it('implements clear method and empties the canvas', () => {
    expect(canvas.clear).toBeTypeOf('function');
    canvas.clear();
    expect(canvas.getObjects().length).toBe(0);
  });

  it('implements renderAll method', () => {
    expect(canvas.renderAll).toBeTypeOf('function');
  });

  it('implements _drawSelection method', () => {
    expect(canvas._drawSelection).toBeTypeOf('function');
  });

  it('finds target objects correctly with findTarget', () => {
    expect(canvas.findTarget).toBeTypeOf('function');
    const rect = makeRect({ left: 0, top: 0 });
    canvas.add(rect);

    const { target } = canvas.findTarget({
      clientX: 5,
      clientY: 5,
      target: canvas.upperCanvasEl,
    } as unknown as TPointerEvent);
    expect(target, 'Should return the rect').toBe(rect);

    const { target: target2 } = canvas.findTarget({
      clientX: 30,
      clientY: 30,
      target: canvas.upperCanvasEl,
    } as unknown as TPointerEvent);
    expect(target2, 'Should not find target').toBeUndefined();

    canvas.remove(rect);
  });

  it('implements toCanvasElement method that clears the contextTop', () => {
    const canvas = new Canvas();
    const mockSetCtx = vi.fn();
    class UpperMock {
      declare el: any;
      set ctx(value: any) {
        mockSetCtx(value);
      }
      get ctx() {
        return undefined;
      }
      constructor() {
        this.el = {
          getContext: vi.fn(),
        };
      }
    }
    canvas.elements.upper = new UpperMock();

    canvas.toCanvasElement();
    expect(mockSetCtx).toHaveBeenCalledWith(undefined);
    expect(mockSetCtx).toHaveBeenCalledTimes(2);
  });

  it('implements toDataURL method that returns valid data URL', () => {
    expect(canvas.toDataURL).toBeTypeOf('function');
    const dataURL = canvas.toDataURL();
    // don't compare actual data url, as it is often browser-dependent
    expect(typeof dataURL, 'is a string').toBe('string');
    expect(dataURL.substring(0, 21), 'starts with correct prefix').toBe(
      'data:image/png;base64',
    );
  });

  it('implements getCenterPoint method that returns canvas center as Point', () => {
    expect(canvas.getCenterPoint).toBeTypeOf('function');
    const center = canvas.getCenterPoint();
    expect(center.x, 'center x is half width').toBe(upperCanvasEl.width / 2);
    expect(center.y, 'center y is half height').toBe(upperCanvasEl.height / 2);
  });

  it('centers objects horizontally with centerObjectH', () => {
    expect(canvas.centerObjectH).toBeTypeOf('function');
    const rect = makeRect({ left: 102, top: 202 });
    canvas.add(rect);
    canvas.centerObjectH(rect);
    expect(
      rect.getCenterPoint().x,
      'object\'s "left" property should correspond to canvas element\'s center',
    ).toBe(upperCanvasEl.width / 2);
  });

  it('centers objects vertically with centerObjectV', () => {
    expect(canvas.centerObjectV).toBeTypeOf('function');
    const rect = makeRect({ left: 102, top: 202 });
    canvas.add(rect);
    canvas.centerObjectV(rect);
    expect(
      rect.getCenterPoint().y,
      'object\'s "top" property should correspond to canvas element\'s center',
    ).toBe(upperCanvasEl.height / 2);
  });

  it('centers objects with centerObject', () => {
    expect(canvas.centerObject).toBeTypeOf('function');
    const rect = makeRect({ left: 102, top: 202 });
    canvas.add(rect);
    canvas.centerObject(rect);

    expect(
      rect.getCenterPoint().y,
      'object\'s "top" property should correspond to canvas element\'s center',
    ).toBe(upperCanvasEl.height / 2);
    expect(
      rect.getCenterPoint().x,
      'object\'s "left" property should correspond to canvas element\'s center',
    ).toBe(upperCanvasEl.width / 2);
  });

  it('serializes to JSON with toJSON', () => {
    expect(canvas.toJSON).toBeTypeOf('function');
    expect(JSON.stringify(canvas.toJSON())).toBe(JSON.stringify(EMPTY_JSON));

    canvas.backgroundColor = '#ff5555';
    canvas.overlayColor = 'rgba(0,0,0,0.2)';
    expect(
      canvas.toJSON(),
      '`background` and `overlayColor` value should be reflected in json',
    ).toEqual({
      version: version,
      objects: [],
      background: '#ff5555',
      overlay: 'rgba(0,0,0,0.2)',
    });

    canvas.add(makeRect());
    expect(canvas.toJSON()).toEqual(RECT_JSON);
  });

  it('serializes to JSON with active selection', () => {
    const rect = new Rect({ width: 50, height: 50, left: 100, top: 100 });
    const circle = new Circle({ radius: 50, left: 50, top: 50 });
    canvas.add(rect, circle);
    const json = JSON.stringify(canvas);

    const activeSelection = new ActiveSelection();
    activeSelection.add(rect, circle);
    canvas.setActiveObject(activeSelection);
    const jsonWithActiveGroup = JSON.stringify(canvas);

    expect(json).toBe(jsonWithActiveGroup);
  });

  it('serializes to dataless JSON with toDatalessJSON', () => {
    const path = new Path('M 100 100 L 300 100 L 200 300 z', {
      sourcePath: 'http://example.com/',
    });
    canvas.add(path);
    expect(canvas.toDatalessJSON()).toEqual(PATH_DATALESS_JSON);
  });

  it('converts to object with toObject', () => {
    expect(canvas.toObject).toBeTypeOf('function');
    const expectedObject = {
      version: version,
      objects: canvas.getObjects(),
    };
    expect(canvas.toObject()).toEqual(expectedObject);

    const rect = makeRect();
    canvas.add(rect);

    // @ts-expect-error -- constructor function has type
    expect(canvas.toObject().objects[0].type).toBe(rect.constructor.type);
  });

  it('includes clipPath in toObject when present', () => {
    const clipPath = makeRect();
    const canvasWithClipPath = new Canvas(undefined, { clipPath: clipPath });
    const expectedObject = {
      version: version,
      objects: canvasWithClipPath.getObjects(),
      clipPath: {
        type: 'Rect',
        version: version,
        originX: 'center',
        originY: 'center',
        left: 0,
        top: 0,
        width: 10,
        height: 10,
        fill: 'rgb(0,0,0)',
        stroke: null,
        strokeWidth: 1,
        strokeDashArray: null,
        strokeLineCap: 'butt',
        strokeDashOffset: 0,
        strokeLineJoin: 'miter',
        strokeMiterLimit: 4,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        flipX: false,
        flipY: false,
        opacity: 1,
        shadow: null,
        visible: true,
        backgroundColor: '',
        fillRule: 'nonzero',
        paintFirst: 'fill',
        globalCompositeOperation: 'source-over',
        skewX: 0,
        skewY: 0,
        rx: 0,
        ry: 0,
        strokeUniform: false,
      },
    };

    expect(canvasWithClipPath.toObject).toBeTypeOf('function');
    expect(canvasWithClipPath.toObject()).toEqual(expectedObject);

    const rect = makeRect();
    canvasWithClipPath.add(rect);

    expect(canvasWithClipPath.toObject().objects[0].type).toBe(
      // @ts-expect-error -- constructor function has type
      rect.constructor.type,
    );
  });

  it('converts to dataless object with toDatalessObject', () => {
    expect(canvas.toDatalessObject).toBeTypeOf('function');
    const expectedObject = {
      version: version,
      objects: canvas.getObjects(),
    };

    expect(canvas.toDatalessObject()).toEqual(expectedObject);

    const rect = makeRect();
    canvas.add(rect);

    // @ts-expect-error -- constructor function has type
    expect(canvas.toObject().objects[0].type).toBe(rect.constructor.type);
    // TODO (kangax): need to test this method with fabric.Path to ensure that path is not populated
  });

  it('checks if canvas is empty with isEmpty', () => {
    expect(canvas.isEmpty).toBeTypeOf('function');
    expect(canvas.isEmpty()).toBeTruthy();
    canvas.add(makeRect());
    expect(canvas.isEmpty()).toBeFalsy();
  });

  it('loads from JSON string with loadFromJSON', async () => {
    expect(canvas.loadFromJSON).toBeTypeOf('function');
    await canvas.loadFromJSON(PATH_JSON);

    const obj = canvas.item(0);

    expect(canvas.isEmpty(), 'canvas is not empty').toBeFalsy();
    // @ts-expect-error -- constructor function has type
    expect(obj.constructor.type, 'first object is a path object').toBe('Path');
    expect(
      canvas.backgroundColor,
      'backgroundColor is populated properly',
    ).toBe('#ff5555');
    expect(canvas.overlayColor, 'overlayColor is populated properly').toBe(
      'rgba(0,0,0,0.2)',
    );

    expect(obj.get('left')).toBe(268);
    expect(obj.get('top')).toBe(266);
    expect(obj.get('width')).toBe(49.803999999999995);
    expect(obj.get('height')).toBe(48.027);
    expect(obj.get('fill')).toBe('rgb(0,0,0)');
    expect(obj.get('stroke')).toBe(null);
    expect(obj.get('strokeWidth')).toBe(1);
    expect(obj.get('scaleX')).toBe(1);
    expect(obj.get('scaleY')).toBe(1);
    expect(obj.get('angle')).toBe(0);
    expect(obj.get('flipX')).toBe(false);
    expect(obj.get('flipY')).toBe(false);
    expect(obj.get('opacity')).toBe(1);
    expect(obj.get('path').length > 0).toBeTruthy();
  });

  it('loads from JSON object with loadFromJSON', async () => {
    await canvas.loadFromJSON(PATH_JSON);

    const obj = canvas.item(0);

    expect(canvas.isEmpty(), 'canvas is not empty').toBeFalsy();
    // @ts-expect-error -- constructor function has type
    expect(obj.constructor.type, 'first object is a path object').toBe('Path');
    expect(
      canvas.backgroundColor,
      'backgroundColor is populated properly',
    ).toBe('#ff5555');
    expect(canvas.overlayColor, 'overlayColor is populated properly').toBe(
      'rgba(0,0,0,0.2)',
    );

    expect(obj.get('left')).toBe(268);
    expect(obj.get('top')).toBe(266);
    expect(obj.get('width')).toBe(49.803999999999995);
    expect(obj.get('height')).toBe(48.027);
    expect(obj.get('fill')).toBe('rgb(0,0,0)');
    expect(obj.get('stroke')).toBe(null);
    expect(obj.get('strokeWidth')).toBe(1);
    expect(obj.get('scaleX')).toBe(1);
    expect(obj.get('scaleY')).toBe(1);
    expect(obj.get('angle')).toBe(0);
    expect(obj.get('flipX')).toBe(false);
    expect(obj.get('flipY')).toBe(false);
    expect(obj.get('opacity')).toBe(1);
    expect(obj.get('path').length > 0).toBeTruthy();
  });

  it('loads from JSON object without default values', async () => {
    await canvas.loadFromJSON(PATH_WITHOUT_DEFAULTS_JSON);
    const obj = canvas.item(0);

    expect(canvas.isEmpty(), 'canvas is not empty').toBeFalsy();
    // @ts-expect-error -- constructor function has type
    expect(obj.constructor.type, 'first object is a path object').toBe('Path');
    expect(
      canvas.backgroundColor,
      'backgroundColor is populated properly',
    ).toBe('#ff5555');
    expect(canvas.overlayColor, 'overlayColor is populated properly').toBe(
      'rgba(0,0,0,0.2)',
    );

    expect(obj.get('originX')).toBe('center');
    expect(obj.get('originY')).toBe('center');
    expect(obj.get('left')).toBe(268);
    expect(obj.get('top')).toBe(266);
    expect(obj.get('width')).toBe(49.803999999999995);
    expect(obj.get('height')).toBe(48.027);
    expect(obj.get('fill')).toBe('rgb(0,0,0)');
    expect(obj.get('stroke')).toBe(null);
    expect(obj.get('strokeWidth')).toBe(1);
    expect(obj.get('scaleX')).toBe(1);
    expect(obj.get('scaleY')).toBe(1);
    expect(obj.get('angle')).toBe(0);
    expect(obj.get('flipX')).toBe(false);
    expect(obj.get('flipY')).toBe(false);
    expect(obj.get('opacity')).toBe(1);
    expect(obj.get('path').length > 0).toBeTruthy();
  });

  it('loads from JSON with reviver function', async () => {
    await canvas.loadFromJSON(PATH_JSON, function (obj, instance) {
      expect(obj).toEqual(PATH_OBJ_JSON);
      // @ts-expect-error -- constructor function has type
      if (instance.constructor.type === 'Path') {
        // @ts-expect-error -- custom prop
        instance.customID = 'fabric_1';
      }
    });
    const obj = canvas.item(0);

    expect(canvas.isEmpty(), 'canvas is not empty').toBeFalsy();
    // @ts-expect-error -- constructor function has type
    expect(obj.constructor.type, 'first object is a path object').toBe('Path');
    expect(
      canvas.backgroundColor,
      'backgroundColor is populated properly',
    ).toBe('#ff5555');
    expect(canvas.overlayColor, 'overlayColor is populated properly').toBe(
      'rgba(0,0,0,0.2)',
    );

    expect(obj.get('left')).toBe(268);
    expect(obj.get('top')).toBe(266);
    expect(obj.get('width')).toBe(49.803999999999995);
    expect(obj.get('height')).toBe(48.027);
    expect(obj.get('fill')).toBe('rgb(0,0,0)');
    expect(obj.get('stroke')).toBe(null);
    expect(obj.get('strokeWidth')).toBe(1);
    expect(obj.get('scaleX')).toBe(1);
    expect(obj.get('scaleY')).toBe(1);
    expect(obj.get('angle')).toBe(0);
    expect(obj.get('flipX')).toBe(false);
    expect(obj.get('flipY')).toBe(false);
    expect(obj.get('opacity')).toBe(1);
    expect(obj.get('customID')).toBe('fabric_1');
    expect(obj.get('path').length > 0).toBeTruthy();
  });

  it('loads from JSON with no objects', async () => {
    const canvas1 = getFabricDocument().createElement('canvas');
    const canvas2 = getFabricDocument().createElement('canvas');
    const c1 = new Canvas(canvas1, {
      backgroundColor: 'green',
      overlayColor: 'yellow',
    });
    const c2 = new Canvas(canvas2, {
      backgroundColor: 'red',
      overlayColor: 'orange',
    });

    const json = c1.toJSON();
    let fired = false;

    await c2.loadFromJSON(json).then(() => {
      fired = true;
    });

    expect(fired, 'Callback should be fired even if no objects').toBeTruthy();
    expect(c2.backgroundColor, 'Color should be set properly').toBe('green');
    expect(c2.overlayColor, 'Color should be set properly').toBe('yellow');
  });

  it('loads from JSON without "objects" property', async () => {
    const canvas1 = getFabricDocument().createElement('canvas');
    const canvas2 = getFabricDocument().createElement('canvas');
    const c1 = new Canvas(canvas1, {
      backgroundColor: 'green',
      overlayColor: 'yellow',
    });
    const c2 = new Canvas(canvas2, {
      backgroundColor: 'red',
      overlayColor: 'orange',
    });

    const json = c1.toJSON();
    let fired = false;

    delete json.objects;

    await c2.loadFromJSON(json).then(() => {
      fired = true;
    });

    expect(
      fired,
      'Callback should be fired even if no "objects" property exists',
    ).toBeTruthy();
    expect(c2.backgroundColor, 'Color should be set properly').toBe('green');
    expect(c2.overlayColor, 'Color should be set properly').toBe('yellow');
  });

  it('loads from JSON with empty Group', async () => {
    const canvas1 = getFabricDocument().createElement('canvas');
    const canvas2 = getFabricDocument().createElement('canvas');
    const c1 = new Canvas(canvas1);
    const c2 = new Canvas(canvas2);
    const group = new Group();

    c1.add(group);
    expect(c1.isEmpty(), 'canvas is not empty').toBeFalsy();

    const json = c1.toJSON();
    let fired = false;

    await c2.loadFromJSON(json).then(() => {
      fired = true;
    });

    expect(
      fired,
      'Callback should be fired even if empty fabric.Group exists',
    ).toBeTruthy();
  });

  it('loads from JSON with async content', async () => {
    const group = new Group([
      new Rect({ width: 10, height: 20 }),
      new Circle({ radius: 10 }),
    ]);
    const rect = new Rect({ width: 20, height: 10 });
    const circle = new Circle({ radius: 25 });

    canvas.add(group, rect, circle);
    const json = JSON.stringify(canvas);
    canvas.clear();

    expect(canvas.getObjects().length).toBe(0);

    await canvas.loadFromJSON(json);
    expect(canvas.getObjects().length).toBe(3);
  });

  it('loads custom properties on Canvas with no async objects', async () => {
    const serialized = JSON.parse(JSON.stringify(PATH_JSON));
    serialized.controlsAboveOverlay = true;
    serialized.preserveObjectStacking = true;

    expect(canvas.controlsAboveOverlay).toBe(
      Canvas.getDefaults().controlsAboveOverlay,
    );
    expect(canvas.preserveObjectStacking).toBe(
      Canvas.getDefaults().preserveObjectStacking,
    );

    await canvas.loadFromJSON(serialized);

    expect(canvas.isEmpty(), 'canvas is not empty').toBeFalsy();
    expect(canvas.controlsAboveOverlay).toBe(true);
    expect(canvas.preserveObjectStacking).toBe(true);
  });

  it('loads custom properties on Canvas with image', async () => {
    const serialized = {
      objects: [
        {
          type: 'image',
          originX: 'left',
          originY: 'top',
          left: 13.6,
          top: -1.4,
          width: 3000,
          height: 3351,
          fill: 'rgb(0,0,0)',
          stroke: null,
          strokeWidth: 0,
          strokeDashArray: null,
          strokeLineCap: 'butt',
          strokeDashOffset: 0,
          strokeLineJoin: 'miter',
          strokeMiterLimit: 4,
          scaleX: 0.05,
          scaleY: 0.05,
          angle: 0,
          flipX: false,
          flipY: false,
          opacity: 1,
          shadow: null,
          visible: true,
          backgroundColor: '',
          fillRule: 'nonzero',
          globalCompositeOperation: 'source-over',
          skewX: 0,
          skewY: 0,
          src: isJSDOM() ? 'test_image.gif' : TEST_IMAGE,
          filters: [],
          crossOrigin: '',
        },
      ],
      background: 'green',
    };

    // @ts-expect-error -- custom prop
    serialized.controlsAboveOverlay = true;
    // @ts-expect-error -- custom prop
    serialized.preserveObjectStacking = false;

    expect(canvas.controlsAboveOverlay).toBe(
      Canvas.getDefaults().controlsAboveOverlay,
    );
    expect(canvas.preserveObjectStacking).toBe(
      Canvas.getDefaults().preserveObjectStacking,
    );

    // before callback the properties are still false.
    expect(canvas.controlsAboveOverlay).toBe(false);
    expect(canvas.preserveObjectStacking).toBe(true);

    await canvas.loadFromJSON(serialized);

    expect(canvas.isEmpty(), 'canvas is not empty').toBeFalsy();
    expect(canvas.controlsAboveOverlay).toBe(true);
    expect(canvas.preserveObjectStacking).toBe(false);
  });

  // TODO: does this test makes sense in vitest?
  // QUnit.test('loadFromJSON with backgroundImage', function(assert) {
  //   var done = assert.async();
  //   canvas.setBackgroundImage('../../assets/pug.jpg');
  //   var anotherCanvas = new fabric.Canvas();

  //   setTimeout(function() {

  //     var json = JSON.stringify(canvas);
  //     anotherCanvas.loadFromJSON(json);

  //     setTimeout(function() {

  //       assert.equal(JSON.stringify(anotherCanvas), json, 'backgrondImage and properties are initialized correctly');
  //       done();

  //     }, 1000);
  //   }, 1000);
  // });

  it('sends objects to the back of the stack', () => {
    expect(canvas.sendObjectToBack).toBeTypeOf('function');

    const rect1 = makeRect();
    const rect2 = makeRect();
    const rect3 = makeRect();

    canvas.add(rect1, rect2, rect3);

    canvas.sendObjectToBack(rect3);
    expect(canvas.item(0), 'third should now be the first one').toBe(rect3);

    canvas.sendObjectToBack(rect2);
    expect(canvas.item(0), 'second should now be the first one').toBe(rect2);

    canvas.sendObjectToBack(rect2);
    expect(canvas.item(0), 'second should *still* be the first one').toBe(
      rect2,
    );
  });

  it('brings objects to the front of the stack', () => {
    expect(canvas.bringObjectToFront).toBeTypeOf('function');

    const rect1 = makeRect();
    const rect2 = makeRect();
    const rect3 = makeRect();

    canvas.add(rect1, rect2, rect3);

    canvas.bringObjectToFront(rect1);
    expect(canvas.item(2), 'first should now be the last one').toBe(rect1);

    canvas.bringObjectToFront(rect2);
    expect(canvas.item(2), 'second should now be the last one').toBe(rect2);

    canvas.bringObjectToFront(rect2);
    expect(canvas.item(2), 'second should *still* be the last one').toBe(rect2);
  });

  it('sends objects backwards in the stack', () => {
    expect(canvas.sendObjectBackwards).toBeTypeOf('function');

    const rect1 = makeRect();
    const rect2 = makeRect();
    const rect3 = makeRect();

    canvas.add(rect1, rect2, rect3);

    // [ 1, 2, 3 ]
    expect(canvas.item(0)).toBe(rect1);
    expect(canvas.item(1)).toBe(rect2);
    expect(canvas.item(2)).toBe(rect3);

    canvas.sendObjectBackwards(rect3);

    // moved 3 one level back — [1, 3, 2]
    expect(canvas.item(0)).toBe(rect1);
    expect(canvas.item(2)).toBe(rect2);
    expect(canvas.item(1)).toBe(rect3);

    canvas.sendObjectBackwards(rect3);

    // moved 3 one level back — [3, 1, 2]
    expect(canvas.item(1)).toBe(rect1);
    expect(canvas.item(2)).toBe(rect2);
    expect(canvas.item(0)).toBe(rect3);

    canvas.sendObjectBackwards(rect3);

    // 3 stays at the same position — [3, 1, 2]
    expect(canvas.item(1)).toBe(rect1);
    expect(canvas.item(2)).toBe(rect2);
    expect(canvas.item(0)).toBe(rect3);

    canvas.sendObjectBackwards(rect2);

    expect(canvas.item(2)).toBe(rect1);
    expect(canvas.item(1)).toBe(rect2);
    expect(canvas.item(0)).toBe(rect3);

    canvas.sendObjectBackwards(rect2);

    expect(canvas.item(2)).toBe(rect1);
    expect(canvas.item(0)).toBe(rect2);
    expect(canvas.item(1)).toBe(rect3);
  });

  it('brings objects forward in the stack', () => {
    expect(canvas.bringObjectForward).toBeTypeOf('function');

    const rect1 = makeRect();
    const rect2 = makeRect();
    const rect3 = makeRect();

    canvas.add(rect1, rect2, rect3);

    // initial position — [ 1, 2, 3 ]
    expect(canvas.item(0)).toBe(rect1);
    expect(canvas.item(1)).toBe(rect2);
    expect(canvas.item(2)).toBe(rect3);

    canvas.bringObjectForward(rect1);

    // 1 moves one way up — [ 2, 1, 3 ]
    expect(canvas.item(1)).toBe(rect1);
    expect(canvas.item(0)).toBe(rect2);
    expect(canvas.item(2)).toBe(rect3);

    canvas.bringObjectForward(rect1);

    // 1 moves one way up again — [ 2, 3, 1 ]
    expect(canvas.item(2)).toBe(rect1);
    expect(canvas.item(0)).toBe(rect2);
    expect(canvas.item(1)).toBe(rect3);

    canvas.bringObjectForward(rect1);

    // 1 is already all the way on top and so doesn't change position — [ 2, 3, 1 ]
    expect(canvas.item(2)).toBe(rect1);
    expect(canvas.item(0)).toBe(rect2);
    expect(canvas.item(1)).toBe(rect3);

    canvas.bringObjectForward(rect3);

    // 3 moves one way up — [ 2, 1, 3 ]
    expect(canvas.item(1)).toBe(rect1);
    expect(canvas.item(0)).toBe(rect2);
    expect(canvas.item(2)).toBe(rect3);
  });

  it('sets active object and tracks it', () => {
    expect(canvas.setActiveObject).toBeTypeOf('function');

    const rect1 = makeRect();
    const rect2 = makeRect();

    canvas.add(rect1, rect2);

    expect(canvas.setActiveObject(rect1), 'selected').toBeTruthy();
    expect(rect1 === canvas._activeObject).toBeTruthy();

    expect(canvas.setActiveObject(rect2), 'selected').toBeTruthy();
    expect(canvas.setActiveObject(rect2), 'no effect').toBeFalsy();
    expect(rect2 === canvas._activeObject).toBeTruthy();
  });

  it('gets active object', () => {
    expect(canvas.getActiveObject).toBeTypeOf('function');
    expect(
      canvas.getActiveObject(),
      'should initially be undefined',
    ).toBeUndefined();

    const rect1 = makeRect();
    const rect2 = makeRect();

    canvas.add(rect1, rect2);

    canvas.setActiveObject(rect1);
    expect(canvas.getActiveObject()).toBe(rect1);

    canvas.setActiveObject(rect2);
    expect(canvas.getActiveObject()).toBe(rect2);
  });

  it('sets and gets active object with groups', () => {
    expect(
      canvas.getActiveObject(),
      'should initially be undefined',
    ).toBeUndefined();

    const group = new Group([
      makeRect({ left: 10, top: 10 }),
      makeRect({ left: 20, top: 20 }),
    ]);

    canvas.setActiveObject(group);
    expect(canvas.getActiveObject()).toBe(group);
  });

  it('retrieves objects by index with item method', () => {
    expect(canvas.item).toBeTypeOf('function');

    const rect1 = makeRect();
    const rect2 = makeRect();

    canvas.add(rect1, rect2);

    expect(canvas.item(0)).toBe(rect1);
    expect(canvas.item(1)).toBe(rect2);

    canvas.remove(canvas.item(0));

    expect(canvas.item(0)).toBe(rect2);
  });

  it('discards active object on ActiveSelection', () => {
    const group = new ActiveSelection([makeRect(), makeRect()], { canvas });
    canvas.setActiveObject(group);
    canvas.discardActiveObject();
    expect(
      canvas.getActiveObject(),
      'removing active group sets it to undefined',
    ).toBeUndefined();
  });

  it('discards active object with internal method', () => {
    canvas.add(makeRect());
    canvas.setActiveObject(canvas.item(0));

    expect(canvas._discardActiveObject(), 'discarded').toBeTruthy();
    expect(canvas._discardActiveObject(), 'no effect').toBeFalsy();
    expect(canvas.getActiveObject()).toBeUndefined();
  });

  it('cleans up transform when discarding active object', () => {
    const e = {
      clientX: 5,
      clientY: 5,
      which: 1,
      target: canvas.upperCanvasEl,
    };
    const target = makeRect();
    canvas.add(target);
    canvas.setActiveObject(target);
    canvas._setupCurrentTransform(e as unknown as TPointerEvent, target, true);
    expect(canvas._currentTransform, 'transform should be set').toBeTruthy();

    target.isMoving = true;
    canvas._discardActiveObject();

    expect(canvas._currentTransform, 'transform should be cleared').toBeFalsy();
    expect(target.isMoving, 'moving flag should have been negated').toBeFalsy();
    expect(canvas.getActiveObject()).toBeUndefined();
  });

  it('discards active object and fires events', () => {
    expect(canvas.discardActiveObject).toBeTypeOf('function');

    canvas.add(makeRect());
    canvas.setActiveObject(canvas.item(0));

    const group = new Group([
      makeRect({ left: 10, top: 10 }),
      makeRect({ left: 20, top: 20 }),
    ]);

    canvas.setActiveObject(group);

    const eventsFired: Record<string, unknown> = {
      selectionCleared: false,
    };

    canvas.on('selection:cleared', () => {
      eventsFired.selectionCleared = true;
    });

    expect(canvas.discardActiveObject(), 'deselected').toBeTruthy();
    expect(canvas.getActiveObject(), 'no active object').toBeUndefined();
    expect(canvas.discardActiveObject(), 'no effect').toBeFalsy();
    expect(canvas.getActiveObject()).toBeUndefined();

    for (const prop in eventsFired) {
      expect(eventsFired[prop]).toBeTruthy();
    }
  });

  it('refuses to discard active object when onDeselect returns true', () => {
    const rect = makeRect();
    rect.onDeselect = () => true;
    canvas.setActiveObject(rect);

    expect(canvas.discardActiveObject(), 'no effect').toBeFalsy();
    expect(canvas.getActiveObject() === rect, 'active object').toBeTruthy();

    canvas.clear();
    expect(canvas.getActiveObject(), 'cleared the stubborn ref').toBeFalsy();
  });

  it('calculates complexity based on number of objects', () => {
    expect(canvas.complexity).toBeTypeOf('function');
    expect(canvas.complexity()).toBe(0);

    canvas.add(makeRect());
    expect(canvas.complexity()).toBe(1);

    canvas.add(makeRect(), makeRect());
    expect(canvas.complexity()).toBe(3);
  });

  it('converts to string representation', () => {
    expect(canvas.toString).toBeTypeOf('function');

    expect(canvas.toString()).toBe('#<Canvas (0): { objects: 0 }>');

    canvas.add(makeRect());
    expect(canvas.toString()).toBe('#<Canvas (1): { objects: 1 }>');
  });

  it('produces same SVG with or without active selection', () => {
    const rect = new Rect({ width: 50, height: 50, left: 100, top: 100 });
    const circle = new Circle({ radius: 50, left: 50, top: 50 });
    canvas.add(rect, circle);
    const svg = canvas.toSVG();

    const activeSelection = new ActiveSelection();
    activeSelection.add(rect, circle);
    canvas.setActiveObject(activeSelection);
    const svgWithActiveGroup = canvas.toSVG();

    expect(svg).toBe(svgWithActiveGroup);
  });

  describe.each([true, false])(
    'set dimensions with enableRetinaScaling=%s',
    (enableRetinaScaling) => {
      it('sets and restores dimensions correctly', async () => {
        const el = getFabricDocument().createElement('canvas');
        const parentEl = getFabricDocument().createElement('div');
        el.width = 200;
        el.height = 200;
        parentEl.className = 'rootNode';
        parentEl.appendChild(el);

        const dpr = 1.25;
        config.configure({ devicePixelRatio: dpr });

        expect(
          parentEl.firstChild,
          'canvas should be appended at partentEl',
        ).toBe(el);
        expect(parentEl.childNodes.length, 'parentEl has 1 child only').toBe(1);

        el.style.position = 'relative';
        const elStyle = el.style.cssText;
        expect(elStyle, 'el style should not be empty').toBe(
          'position: relative;',
        );

        const canvasObj = new Canvas(el, {
          enableRetinaScaling,
          renderOnAddRemove: false,
        });

        canvasObj.setDimensions({ width: 500, height: 500 });
        expect(
          // @ts-expect-error -- private prop
          canvasObj.elements._originalCanvasStyle,
          'saved original canvas style for disposal',
        ).toBe(elStyle);
        expect(el.style.cssText, 'canvas el style has been changed').not.toBe(
          // @ts-expect-error -- private prop
          canvasObj.elements._originalCanvasStyle,
        );
        expect(el.width, 'expected width').toBe(
          500 * (enableRetinaScaling ? dpr : 1),
        );
        expect(el.height, 'expected height').toBe(
          500 * (enableRetinaScaling ? dpr : 1),
        );
        expect(canvasObj.upperCanvasEl.width, 'expected width').toBe(
          500 * (enableRetinaScaling ? dpr : 1),
        );
        expect(canvasObj.upperCanvasEl.height, 'expected height').toBe(
          500 * (enableRetinaScaling ? dpr : 1),
        );

        await canvasObj.dispose();
        expect(
          // @ts-expect-error -- private prop
          canvasObj.elements._originalCanvasStyle,
          'removed original canvas style',
        ).toBe(undefined);
        expect(el.style.cssText, 'restored original canvas style').toBe(
          elStyle,
        );
        expect(el.width, 'restored width').toBe(500);
        expect(el.height, 'restored height').toBe(500);
      });
    },
  );

  it('clones the canvas and its contents', async () => {
    expect(canvas.clone).toBeTypeOf('function');

    canvas.add(
      new Rect({
        width: 100,
        height: 110,
        top: 120,
        left: 130,
        fill: 'rgba(0,1,2,0.3)',
      }),
    );
    const canvasData = JSON.stringify(canvas);

    const clone = await canvas.clone([]);
    expect(clone).toBeInstanceOf(Canvas);

    expect(
      JSON.stringify(clone),
      'data on cloned canvas should be identical',
    ).toBe(canvasData);

    expect(clone.getWidth()).toBe(canvas.getWidth());
    expect(clone.getHeight()).toBe(canvas.getHeight());
    clone.renderAll();
  });

  it('clones the canvas without data', () => {
    expect(canvas.cloneWithoutData).toBeTypeOf('function');

    canvas.add(
      new Rect({
        width: 100,
        height: 110,
        top: 120,
        left: 130,
        fill: 'rgba(0,1,2,0.3)',
      }),
    );

    const clone = canvas.cloneWithoutData();

    expect(clone).toBeInstanceOf(Canvas);
    expect(clone.toJSON(), 'data on cloned canvas should be empty').toEqual(
      EMPTY_JSON,
    );

    expect(clone.getWidth()).toBe(canvas.getWidth());
    expect(clone.getHeight()).toBe(canvas.getHeight());
    clone.renderAll();
  });

  it('gets and sets width', () => {
    expect(canvas.getWidth).toBeTypeOf('function');
    expect(canvas.getWidth()).toBe(600);

    canvas.setDimensions({ width: 444 });
    expect(canvas.getWidth()).toBe(444);
    expect(canvas.lowerCanvasEl.style.width).toBe('444px');
  });

  it('gets and sets height', () => {
    expect(canvas.getHeight).toBeTypeOf('function');
    expect(canvas.getHeight()).toBe(600);

    canvas.setDimensions({ height: 765 });
    expect(canvas.getHeight()).toBe(765);
    expect(canvas.lowerCanvasEl.style.height).toBe('765px');
  });

  it('sets width with cssOnly option', () => {
    canvas.setDimensions({ width: 123 });
    canvas.setDimensions({ width: '100%' }, { cssOnly: true });

    expect(
      canvas.lowerCanvasEl.style.width,
      'Should be as the css only value',
    ).toBe('100%');
    expect(
      canvas.upperCanvasEl.style.width,
      'Should be as the css only value',
    ).toBe('100%');
    expect(
      canvas.wrapperEl.style.width,
      'Should be as the css only value',
    ).toBe('100%');
    expect(canvas.getWidth(), 'Should be as the none css only value').toBe(123);
  });

  it('sets height with cssOnly option', () => {
    canvas.setDimensions({ height: 123 });
    canvas.setDimensions({ height: '100%' }, { cssOnly: true });

    expect(
      canvas.lowerCanvasEl.style.height,
      'Should be as the css only value',
    ).toBe('100%');
    expect(
      canvas.upperCanvasEl.style.height,
      'Should be as the css only value',
    ).toBe('100%');
    expect(
      canvas.wrapperEl.style.height,
      'Should be as the css only value',
    ).toBe('100%');
    expect(canvas.getHeight(), 'Should be as the none css only value').toBe(
      123,
    );
  });

  it('sets width with backstoreOnly option', () => {
    canvas.setDimensions({ width: 123 });
    canvas.setDimensions({ width: 500 }, { backstoreOnly: true });

    expect(
      canvas.lowerCanvasEl.style.width,
      'Should be as none backstore only value + "px"',
    ).toBe('123px');
    expect(
      canvas.upperCanvasEl.style.width,
      'Should be as none backstore only value + "px"',
    ).toBe('123px');
    expect(
      canvas.wrapperEl.style.width,
      'Should be as none backstore only value + "px"',
    ).toBe('123px');
    expect(canvas.getWidth(), 'Should be as the backstore only value').toBe(
      500,
    );
  });

  it('sets height with backstoreOnly option', () => {
    canvas.setDimensions({ height: 123 });
    canvas.setDimensions({ height: 500 }, { backstoreOnly: true });

    expect(
      canvas.lowerCanvasEl.style.height,
      'Should be as none backstore only value + "px"',
    ).toBe('123px');
    expect(
      canvas.upperCanvasEl.style.height,
      'Should be as none backstore only value + "px"',
    ).toBe('123px');
    expect(
      canvas.wrapperEl.style.height,
      'Should be as none backstore only value + "px"',
    ).toBe('123px');
    expect(canvas.getHeight(), 'Should be as the backstore only value').toBe(
      500,
    );
  });

  it('sets up current transform based on interaction point', () => {
    expect(canvas._setupCurrentTransform).toBeTypeOf('function');

    const rect = new Rect({ left: 100, top: 100, width: 50, height: 50 });
    canvas.add(rect);
    const canvasOffset = canvas.calcOffset();
    let eventStub = {
      clientX: canvasOffset.left + 100,
      clientY: canvasOffset.top + 100,
      target: canvas.upperCanvasEl,
    } as unknown as TPointerEvent;
    canvas.setActiveObject(rect);
    const targetCorner = rect.findControl(canvas.getViewportPoint(eventStub));
    rect.__corner = targetCorner ? targetCorner.key : undefined;
    canvas._setupCurrentTransform(eventStub, rect, false);
    let t = canvas._currentTransform!;
    expect(t.target, 'should have rect as a target').toBe(rect);
    expect(t.action, 'should target inside rect and setup drag').toBe('drag');
    expect(t.corner, 'no corner selected').toBe('');
    expect(t.originX, 'no origin change for drag').toBe(rect.originX);
    expect(t.originY, 'no origin change for drag').toBe(rect.originY);

    eventStub = {
      clientX: canvasOffset.left + rect.oCoords.tl.corner.tl.x + 1,
      clientY: canvasOffset.top + rect.oCoords.tl.corner.tl.y + 1,
      target: canvas.upperCanvasEl,
    } as unknown as TPointerEvent;
    rect.__corner = rect.findControl(canvas.getViewportPoint(eventStub))!.key;
    canvas._setupCurrentTransform(eventStub, rect, false);
    t = canvas._currentTransform!;
    expect(t.target, 'should have rect as a target').toBe(rect);
    expect(
      t.action,
      'should setup drag since the object was not selected',
    ).toBe('drag');
    expect(t.corner, 'tl selected').toBe('tl');
    expect(t.shiftKey, 'shift was not pressed').toBe(undefined);

    const alreadySelected = true;
    rect.__corner = rect.findControl(canvas.getViewportPoint(eventStub))!.key;
    canvas._setupCurrentTransform(eventStub, rect, alreadySelected);
    t = canvas._currentTransform!;
    expect(t.target, 'should have rect as a target').toBe(rect);
    expect(t.action, 'should target a corner and setup scale').toBe('scale');
    expect(t.corner, 'tl selected').toBe('tl');
    expect(t.originX, 'origin in opposite direction').toBe('right');
    expect(t.originY, 'origin in opposite direction').toBe('bottom');
    expect(t.shiftKey, 'shift was not pressed').toBe(undefined);

    eventStub = {
      clientX: canvasOffset.left + rect.left - 2 - rect.width / 2,
      clientY: canvasOffset.top + rect.top,
      target: canvas.upperCanvasEl,
      shiftKey: true,
    } as unknown as TPointerEvent;
    rect.__corner = rect.findControl(canvas.getViewportPoint(eventStub))!.key;
    canvas._setupCurrentTransform(eventStub, rect, alreadySelected);
    t = canvas._currentTransform!;
    expect(t.target, 'should have rect as a target').toBe(rect);
    expect(t.action, 'should target a corner and setup skew').toBe('skewY');
    expect(t.shiftKey, 'shift was pressed').toBe(true);
    expect(t.corner, 'ml selected').toBe('ml');
    expect(t.originX, 'origin in opposite direction').toBe('right');

    // to be replaced with new api test
    // eventStub = {
    //   clientX: canvasOffset.left + rect.oCoords.mtr.x,
    //   clientY: canvasOffset.top + rect.oCoords.mtr.y,
    //   target: canvas.upperCanvasEl,
    // };
    // canvas._setupCurrentTransform(eventStub, rect, alreadySelected);
    // t = canvas._currentTransform;
    // expect(t.target, 'should have rect as a target').toBe(rect);
    // expect(t.action, 'should target a corner and setup rotate').toBe('mtr');
    // expect(t.corner, 'mtr selected').toBe('mtr');
    // expect(t.originX, 'origin in center').toBe('center');
    // expect(t.originY, 'origin in center').toBe('center');
    // canvas._currentTransform = false;
  });

  // TODO: do these tests make sense in vitest?
  // QUnit.test('_rotateObject', function(assert) {
  //   assert.ok(typeof canvas._rotateObject === 'function');
  //   var rect = new fabric.Rect({ left: 75, top: 75, width: 50, height: 50 });
  //   canvas.add(rect);
  //   var canvasEl = canvas.getElement(),
  //       canvasOffset = fabric.util.getElementOffset(canvasEl);
  //   var eventStub = {
  //     clientX: canvasOffset.left + rect.oCoords.mtr.x,
  //     clientY: canvasOffset.top + rect.oCoords.mtr.y,
  //     target: canvas.upperCanvasEl,
  //   };
  //   canvas._setupCurrentTransform(eventStub, rect);
  //   var rotated = canvas._rotateObject(30, 30, 'equally');
  //   assert.equal(rotated, true, 'return true if a rotation happened');
  //   rotated = canvas._rotateObject(30, 30);
  //   assert.equal(rotated, false, 'return true if no rotation happened');
  // });
  //
  // QUnit.test('_rotateObject do not change origins', function(assert) {
  //   assert.ok(typeof canvas._rotateObject === 'function');
  //   var rect = new fabric.Rect({ left: 75, top: 75, width: 50, height: 50, originX: 'right', originY: 'bottom' });
  //   canvas.add(rect);
  //   var canvasEl = canvas.getElement(),
  //       canvasOffset = fabric.util.getElementOffset(canvasEl);
  //   var eventStub = {
  //     clientX: canvasOffset.left + rect.oCoords.mtr.x,
  //     clientY: canvasOffset.top + rect.oCoords.mtr.y,
  //     target: canvas.upperCanvasEl,
  //   };
  //   canvas._setupCurrentTransform(eventStub, rect);
  //   assert.equal(rect.originX, 'right');
  //   assert.equal(rect.originY, 'bottom');
  // });
  //
  // QUnit.test('backgroundImage', function(assert) {
  //   var done = assert.async();
  //   assert.deepEqual('', canvas.backgroundImage);
  //   canvas.setBackgroundImage('../../assets/pug.jpg');

  //   setTimeout(function() {

  //     assert.ok(typeof canvas.backgroundImage == 'object');
  //     assert.ok(/pug\.jpg$/.test(canvas.backgroundImage.src));

  //     assert.deepEqual(canvas.toJSON(), {
  //       "objects": [],
  //       "background": "rgba(0, 0, 0, 0)",
  //       "backgroundImage": (fabric.getFabricDocument().location.protocol +
  //                           '//' +
  //                           fabric.getFabricDocument().location.hostname +
  //                           ((fabric.getFabricDocument().location.port === '' || parseInt(fabric.getFabricDocument().location.port, 10) === 80)
  //                               ? ''
  //                               : (':' + fabric.getFabricDocument().location.port)) +
  //                           '/assets/pug.jpg'),
  //       "backgroundImageOpacity": 1,
  //       "backgroundImageStretch": true
  //     });

  //     done();
  //   }, 1000);
  // });
  //
  // QUnit.skip('fxRemove', function(assert) {
  //   var done = assert.async();
  //   assert.ok(typeof canvas.fxRemove === 'function');
  //
  //   var rect = new fabric.Rect();
  //   canvas.add(rect);
  //
  //   var callbackFired = false;
  //   function onComplete() {
  //     callbackFired = true;
  //   }
  //
  //   assert.equal(canvas.item(0), rect);
  //   assert.ok(typeof canvas.fxRemove(rect, { onComplete: onComplete }).abort === 'function', 'should return animation abort function');
  //
  //   setTimeout(function() {
  //     assert.equal(canvas.item(0), undefined);
  //     assert.ok(callbackFired);
  //     done();
  //   }, 1000);
  // });

  describe.each([true, false])(
    'isTargetTransparent with objectCaching = %s',
    (objectCaching) => {
      function testPixelDetection(
        canvas: Canvas,
        target: FabricObject,
        expectedHits: {
          start: number;
          end: number;
          message: string;
          transparent: boolean;
        }[],
      ) {
        function execute(context = '') {
          expectedHits.forEach(({ start, end, message, transparent }) => {
            // make less sensitive by skipping edges for firefox 110
            const round = 0;
            for (let index = start + round; index < end - round; index++) {
              expect(
                canvas.isTargetTransparent(target, index, index),
                `checking transparency of (${index}, ${index}), expected to be ${transparent}, ${message}, ${context}`,
              ).toBe(transparent);
            }
          });
        }

        execute();
        canvas.setActiveObject(target);
        execute('target is selected');
      }

      it('detects transparent regions correctly', () => {
        const rect = new Rect({
          width: 10,
          height: 10,
          strokeWidth: 4,
          stroke: 'red',
          fill: '',
          top: 7,
          left: 7,
          objectCaching,
        });
        canvas.add(rect);
        testPixelDetection(canvas, rect, [
          { start: -5, end: 0, message: 'outside', transparent: true },
          { start: 0, end: 4, message: 'stroke', transparent: false },
          { start: 4, end: 10, message: 'fill', transparent: true },
          { start: 10, end: 14, message: 'stroke', transparent: false },
          { start: 14, end: 20, message: 'outside', transparent: true },
        ]);
      });

      it('detects transparent regions correctly with viewport transform', () => {
        const rect = new Rect({
          width: 10,
          height: 10,
          strokeWidth: 4,
          stroke: 'red',
          fill: '',
          top: 7,
          left: 7,
          objectCaching,
        });
        canvas.add(rect);
        canvas.setViewportTransform([2, 0, 0, 2, 0, 0]);
        testPixelDetection(canvas, rect, [
          { start: -5, end: 0, message: 'outside', transparent: true },
          { start: 0, end: 8, message: 'stroke', transparent: false },
          { start: 8, end: 20, message: 'fill', transparent: true },
          { start: 20, end: 28, message: 'stroke', transparent: false },
          { start: 28, end: 40, message: 'outside', transparent: true },
        ]);
      });

      it('detects transparent regions correctly with viewport transform and tolerance', () => {
        const rect = new Rect({
          width: 10,
          height: 10,
          strokeWidth: 4,
          stroke: 'red',
          fill: '',
          top: 7,
          left: 7,
          objectCaching,
        });
        canvas.add(rect);
        canvas.setTargetFindTolerance(5);
        canvas.setViewportTransform([2, 0, 0, 2, 0, 0]);
        testPixelDetection(canvas, rect, [
          { start: -10, end: -5, message: 'outside', transparent: true },
          {
            start: -5,
            end: 0,
            message: 'stroke tolerance not affected by vpt',
            transparent: false,
          },
          { start: 0, end: 8, message: 'stroke', transparent: false },
          {
            start: 8,
            end: 13,
            message: 'stroke tolerance not affected by vpt',
            transparent: false,
          },
          { start: 13, end: 15, message: 'fill', transparent: true },
          {
            start: 15,
            end: 20,
            message: 'stroke tolerance not affected by vpt',
            transparent: false,
          },
          { start: 20, end: 28, message: 'stroke', transparent: false },
          {
            start: 28,
            end: 33,
            message: 'stroke tolerance not affected by vpt',
            transparent: false,
          },
          { start: 33, end: 40, message: 'outside', transparent: true },
        ]);
      });
    },
  );

  it('provides access to top context with getTopContext', () => {
    expect(canvas.getTopContext).toBeTypeOf('function');
    expect(canvas.getTopContext(), 'it just returns contextTop').toBe(
      canvas.contextTop,
    );
  });

  it('determines when transformations should be centered', () => {
    expect(
      // @ts-expect-error -- private method
      canvas._shouldCenterTransform({}, 'someAction', false),
      'a non standard action does not center scale',
    ).toBe(false);

    expect(
      // @ts-expect-error -- private method
      canvas._shouldCenterTransform({}, 'someAction', true),
      'a non standard action will center scale if altKey is true',
    ).toBe(true);

    canvas.centeredScaling = true;

    ['scale', 'scaleX', 'scaleY', 'resizing'].forEach((action) => {
      expect(
        // @ts-expect-error -- private method
        canvas._shouldCenterTransform({}, action, false),
        action +
          ' standard action will center scale if canvas.centeredScaling is true and no centeredKey pressed',
      ).toBe(true);
    });

    ['scale', 'scaleX', 'scaleY', 'resizing'].forEach((action) => {
      expect(
        // @ts-expect-error -- private method
        canvas._shouldCenterTransform({}, action, true),
        action +
          ' standard action will NOT center scale if canvas.centeredScaling is true and centeredKey is pressed',
      ).toBe(false);
    });

    expect(
      // @ts-expect-error -- private method
      canvas._shouldCenterTransform({}, 'rotate', false),
      'rotate standard action will NOT center scale if canvas.centeredScaling is true',
    ).toBe(false);

    canvas.centeredRotation = true;

    expect(
      // @ts-expect-error -- private method
      canvas._shouldCenterTransform({}, 'rotate', false),
      'rotate standard action will center scale if canvas.centeredRotation is true',
    ).toBe(true);
  });
});

function makeRect(options = {}) {
  const defaultOptions = { width: 10, height: 10 };
  return new Rect({ ...defaultOptions, ...options });
}

function initActiveSelection(
  canvas: Canvas,
  activeObject: FabricObject,
  target: FabricObject,
  multiSelectionStacking?: MultiSelectionStacking,
) {
  classRegistry.setClass(
    class TextActiveSelection extends ActiveSelection {
      static ownDefaults = {
        multiSelectionStacking,
      };

      constructor(
        objects: FabricObject[],
        options: Record<PropertyKey, unknown>,
      ) {
        super(objects, { ...TextActiveSelection.ownDefaults, ...options });
      }
    },
  );
  canvas.setActiveObject(activeObject);
  // @ts-expect-error -- protected method
  canvas.handleMultiSelection(
    {
      clientX: 0,
      clientY: 0,
      [canvas.selectionKey as string]: true,
    } as unknown as TPointerEvent,
    target,
  );
}

function updateActiveSelection(
  canvas: Canvas,
  existing: FabricObject[],
  target: FabricObject | null,
  multiSelectionStacking?: MultiSelectionStacking,
) {
  const activeSelection = new ActiveSelection([], { canvas });
  if (multiSelectionStacking) {
    activeSelection.multiSelectionStacking = multiSelectionStacking;
  }
  activeSelection.add(...existing);
  canvas.setActiveObject(activeSelection);
  // @ts-expect-error -- protected method
  canvas.handleMultiSelection(
    {
      clientX: 1,
      clientY: 1,
      [canvas.selectionKey as string]: true,
      target: canvas.upperCanvasEl,
    } as unknown as TPointerEvent,
    target || activeSelection,
  );
}

function setGroupSelector(
  canvas: Canvas,
  { x = 0, y = 0, deltaX = 0, deltaY = 0 } = {},
) {
  // @ts-expect-error -- protected member
  canvas._groupSelector = {
    x,
    y,
    deltaX,
    deltaY,
  };
}
