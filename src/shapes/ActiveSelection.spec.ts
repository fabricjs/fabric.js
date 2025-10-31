import { FitContentLayout } from '../LayoutManager';
import { Canvas } from '../canvas/Canvas';
import { ActiveSelection } from './ActiveSelection';
import { Group } from './Group';
import { FabricObject } from './Object/FabricObject';

import { afterEach, describe, expect, it, test, vi } from 'vitest';
import { Rect } from './Rect';
import { version } from '../../package.json';

describe('ActiveSelection', () => {
  const canvas = new Canvas(undefined, {
    enableRetinaScaling: false,
    width: 600,
    height: 600,
  });

  afterEach(() => {
    canvas.clear();
    canvas.backgroundColor = Canvas.getDefaults().backgroundColor;
    canvas.calcOffset();
  });

  it('constructor', function () {
    const group = makeAsWith2Objects();

    expect(group).toBeTruthy();
    expect(
      group,
      'should be instance of fabric.ActiveSelection',
    ).toBeInstanceOf(ActiveSelection);
    expect(group.item(0).parent, 'parent ref is undefined').toBeUndefined();
  });

  it('toString', () => {
    const group = makeAsWith2Objects();
    expect(group.toString(), 'should return proper representation').toBe(
      '#<ActiveSelection: (2)>',
    );
  });

  it('toObject', () => {
    const group = makeAsWith2Objects();
    expect(group.toObject).toBeTypeOf('function');

    const clone = group.toObject();
    const expectedObject = {
      version: version,
      type: 'ActiveSelection',
      originX: 'center',
      originY: 'center',
      left: 90,
      top: 130,
      width: 80,
      height: 60,
      fill: 'rgb(0,0,0)',
      // layout: 'fit-content',
      stroke: null,
      strokeWidth: 0,
      strokeDashArray: null,
      strokeLineCap: 'butt',
      strokeDashOffset: 0,
      strokeLineJoin: 'miter',
      strokeMiterLimit: 4,
      scaleX: 1,
      scaleY: 1,
      shadow: null,
      subTargetCheck: false,
      interactive: false,
      visible: true,
      backgroundColor: '',
      angle: 0,
      flipX: false,
      flipY: false,
      opacity: 1,
      fillRule: 'nonzero',
      paintFirst: 'fill',
      globalCompositeOperation: 'source-over',
      skewX: 0,
      skewY: 0,
      strokeUniform: false,
      objects: clone.objects,
      layoutManager: {
        type: 'layoutManager',
        strategy: 'fit-content',
      },
    };

    expect(clone).toEqual(expectedObject);

    expect(group, 'should produce different object').not.toBe(clone);
    expect(
      group.getObjects(),
      'should produce different object array',
    ).not.toBe(clone.objects);
    expect(
      group.getObjects()[0],
      'should produce different objects in array',
    ).not.toBe(clone.objects[0]);
  });

  it('toObject without default values', () => {
    const group = makeAsWith2Objects();
    group.includeDefaultValues = false;

    const clone = group.toObject();
    const objects = [
      {
        version: version,
        type: 'Rect',
        left: 25,
        top: -25,
        width: 30,
        height: 10,
        strokeWidth: 0,
      },
      {
        version: version,
        type: 'Rect',
        left: -35,
        top: 10,
        width: 10,
        height: 40,
        strokeWidth: 0,
      },
    ];
    const expectedObject = {
      version: version,
      type: 'ActiveSelection',
      left: 90,
      top: 130,
      width: 80,
      height: 60,
      objects: objects,
    };

    expect(clone).toEqual(expectedObject);
  });

  it('_renderControls', () => {
    expect(ActiveSelection.prototype._renderControls).toBeTypeOf('function');
  });

  test('fromObject', async () => {
    const group = makeAsWith2ObjectsWithOpacity();

    expect(ActiveSelection.fromObject).toBeTypeOf('function');
    const groupObject = group.toObject();

    const newGroupFromObject = await ActiveSelection.fromObject(groupObject);
    const objectFromOldGroup = group.toObject();
    const objectFromNewGroup = newGroupFromObject.toObject();

    expect(newGroupFromObject).toBeInstanceOf(ActiveSelection);

    expect(objectFromOldGroup.objects[0]).toEqual(
      objectFromNewGroup.objects[0],
    );
    expect(objectFromOldGroup.objects[1]).toEqual(
      objectFromNewGroup.objects[1],
    );

    expect(objectFromOldGroup).toEqual(objectFromNewGroup);
  });

  it('ActiveSelection shouldCache', () => {
    const rect1 = new Rect({
      top: 1,
      left: 1,
      width: 2,
      height: 2,
      strokeWidth: 0,
      fill: 'red',
      opacity: 1,
      objectCaching: true,
    });
    const rect2 = new Rect({
      top: 5,
      left: 5,
      width: 2,
      height: 2,
      strokeWidth: 0,
      fill: 'red',
      opacity: 1,
      objectCaching: true,
    });
    const group = new ActiveSelection([rect1, rect2], { objectCaching: true });

    expect(group.shouldCache(), 'Active selection do not cache').toBe(false);
  });

  it('canvas property propagation', () => {
    const g2 = makeAsWith4Objects();

    canvas.add(g2);
    expect(g2.canvas).toBe(canvas);
    expect(g2._objects[3].canvas).toBe(canvas);
  });

  it('should set the layoutManager in the constructor', () => {
    const activeSelection = new ActiveSelection();
    expect(activeSelection.layoutManager).toBeDefined();
    expect(activeSelection.layoutManager?.strategy).toBeInstanceOf(
      FitContentLayout,
    );
  });

  it('deselect removes all objects', () => {
    const selection = new ActiveSelection([], {
      left: 200,
      top: 100,
      angle: 45,
    });
    const spy = vi.spyOn(selection, 'removeAll');
    selection.onDeselect();
    expect(spy).toHaveBeenCalled();
    expect(selection).toMatchObject({
      left: 200,
      top: 100,
      angle: 45,
      scaleX: 1,
      scaleY: 1,
      skewX: 0,
      skewY: 0,
      flipX: false,
      flipY: false,
      _objects: [],
    });
    selection.add(new FabricObject({ left: 50, top: 50, strokeWidth: 0 }));
    const { x, y } = selection.item(0).getCenterPoint();
    expect({ x: Math.round(x), y: Math.round(y) }).toEqual({ x: 50, y: 50 });
  });

  it('should not set coords in the constructor', () => {
    const spy = vi.spyOn(ActiveSelection.prototype, 'setCoords');
    new ActiveSelection([
      new FabricObject({
        left: 100,
        top: 100,
        width: 100,
        height: 100,
      }),
    ]);
    expect(spy).not.toHaveBeenCalled();
  });

  it('`setActiveObject` should update the active selection ref on canvas if it changed', () => {
    const canvas = new Canvas();
    const obj1 = new FabricObject();
    const obj2 = new FabricObject();
    canvas.add(obj1, obj2);
    const activeSelection = new ActiveSelection([obj1, obj2]);
    const spy = vi.spyOn(activeSelection, 'setCoords');
    canvas.setActiveObject(activeSelection);
    expect(canvas.getActiveObject()).toBe(activeSelection);
    expect(canvas.getActiveObjects()).toEqual([obj1, obj2]);
    expect(spy).toHaveBeenCalled();
    expect(activeSelection.canvas).toBe(canvas);

    spy.mockClear();
    canvas.setActiveObject(activeSelection);
    expect(spy).not.toHaveBeenCalled();
  });

  test('adding and removing an object belonging to a group', () => {
    const object = new FabricObject();
    const group = new Group([object]);
    const activeSelection = new ActiveSelection();

    const eventsSpy = vi.spyOn(object, 'fire');
    const removeSpy = vi.spyOn(group, 'remove');
    const exitSpy = vi.spyOn(group, '_exitGroup');
    const enterSpy = vi.spyOn(activeSelection, 'enterGroup');

    expect(object.group).toBe(group);
    expect(object.parent).toBe(group);
    expect(object.canvas).toBeUndefined();

    activeSelection.add(object);
    expect(object.group).toBe(activeSelection);
    expect(object.parent).toBe(group);
    expect(removeSpy).not.toBeCalled();
    expect(exitSpy).toBeCalledWith(object);
    expect(enterSpy).toBeCalledWith(object, true);
    expect(eventsSpy).toHaveBeenNthCalledWith(1, 'added', {
      target: activeSelection,
    });

    activeSelection.remove(object);
    expect(eventsSpy).toHaveBeenNthCalledWith(2, 'removed', {
      target: activeSelection,
    });
    expect(object.group).toBe(group);
    expect(object.parent).toBe(group);
  });

  test('transferring an object between active selections', () => {
    const object = new FabricObject();
    const group = new Group([object]);
    const activeSelection1 = new ActiveSelection([object]);
    const activeSelection2 = new ActiveSelection();
    expect(object.group).toBe(activeSelection1);
    expect(object.parent).toBe(group);

    const eventsSpy = vi.spyOn(object, 'fire');
    const removeSpy = vi.spyOn(activeSelection1, 'remove');

    Object.entries({
      object,
      group,
      activeSelection1,
      activeSelection2,
    }).forEach(([key, obj]) => vi.spyOn(obj, 'toJSON').mockReturnValue(key));

    activeSelection2.add(object);
    expect(object.group).toBe(activeSelection2);
    expect(object.parent).toBe(group);
    expect(removeSpy).toBeCalledWith(object);
    expect(eventsSpy).toHaveBeenNthCalledWith(1, 'removed', {
      target: activeSelection1,
    });
    expect(eventsSpy).toHaveBeenNthCalledWith(2, 'added', {
      target: activeSelection2,
    });

    activeSelection2.removeAll();
    expect(object.group).toBe(group);
    expect(object.parent).toBe(group);
    expect(eventsSpy).toHaveBeenNthCalledWith(3, 'removed', {
      target: activeSelection2,
    });
    expect(eventsSpy).toBeCalledTimes(3);
  });

  it('should block descendants from entering selection', () => {
    const object = new FabricObject();
    const group = new Group([object]);
    const activeSelection = new ActiveSelection([group]);
    const spy = vi.spyOn(activeSelection, 'canEnterGroup');
    activeSelection.add(object);
    expect(activeSelection.getObjects()).toEqual([group]);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveNthReturnedWith(1, false);
  });

  it('should block ancestors from entering selection', () => {
    const object = new FabricObject();
    const group = new Group([object]);
    const activeSelection = new ActiveSelection([object]);
    const spy = vi.spyOn(activeSelection, 'canEnterGroup');
    activeSelection.add(group);
    expect(activeSelection.getObjects()).toEqual([object]);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveNthReturnedWith(1, false);
  });
});

function makeAsWith2Objects() {
  const rect1 = new Rect({
    top: 105,
    left: 115,
    width: 30,
    height: 10,
    strokeWidth: 0,
  });
  const rect2 = new Rect({
    top: 140,
    left: 55,
    width: 10,
    height: 40,
    strokeWidth: 0,
  });

  return new ActiveSelection([rect1, rect2], { strokeWidth: 0 });
}

function makeAsWith4Objects() {
  const rect1 = new Rect({ top: 105, left: 115, width: 30, height: 10 });
  const rect2 = new Rect({ top: 140, left: 55, width: 10, height: 40 });
  const rect3 = new Rect({ top: 60, left: 10, width: 20, height: 40 });
  const rect4 = new Rect({ top: 95, left: 95, width: 40, height: 40 });

  return new ActiveSelection([rect1, rect2, rect3, rect4]);
}

function makeAsWith2ObjectsWithOpacity() {
  const rect1 = new Rect({
    top: 105,
    left: 115,
    width: 30,
    height: 10,
    strokeWidth: 0,
    opacity: 0.5,
  });
  const rect2 = new Rect({
    top: 140,
    left: 55,
    width: 10,
    height: 40,
    strokeWidth: 0,
    opacity: 0.8,
  });

  return new ActiveSelection([rect1, rect2], { strokeWidth: 0 });
}
