import { FitContentLayout } from '../LayoutManager';
import { Canvas } from '../canvas/Canvas';
import { ActiveSelection } from './ActiveSelection';
import { Group } from './Group';
import { FabricObject } from './Object/FabricObject';

describe('ActiveSelection', () => {
  it('should set the layoutManager in the constructor', () => {
    const activeSelection = new ActiveSelection();
    expect(activeSelection.layoutManager).toBeDefined();
    expect(activeSelection.layoutManager?.strategy).toBeInstanceOf(
      FitContentLayout
    );
  });

  it('clearing active selection objects resets transform', () => {
    const obj = new FabricObject({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
    });
    const selection = new ActiveSelection([obj], {
      left: 200,
      top: 200,
      angle: 45,
      skewX: 0.5,
      skewY: -0.5,
    });
    selection.remove(obj);
    expect(selection).toMatchObject({
      left: 0,
      top: 0,
      angle: 0,
      scaleX: 1,
      scaleY: 1,
      skewX: 0,
      skewY: 0,
      flipX: false,
      flipY: false,
      _objects: [],
    });
  });

  it('deselect removes all objects and resets transform', () => {
    const selection = new ActiveSelection([], {
      left: 200,
      top: 100,
      angle: 45,
    });
    const spy = jest.spyOn(selection, 'removeAll');
    selection.onDeselect();
    expect(spy).toHaveBeenCalled();
    expect(selection).toMatchObject({
      left: 0,
      top: 0,
      angle: 0,
      scaleX: 1,
      scaleY: 1,
      skewX: 0,
      skewY: 0,
      flipX: false,
      flipY: false,
      _objects: [],
    });
    selection.add(new FabricObject({ left: 50, top: 50, strokeWidth: 0 }));
    expect(selection.item(0).getCenterPoint()).toEqual({ x: 50, y: 50 });
  });

  // remove skip once #9152 is merged
  it.skip('should not set coords in the constructor', () => {
    const spy = jest.spyOn(ActiveSelection.prototype, 'setCoords');
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

  it('sets coords after attaching to canvas', () => {
    const canvas = new Canvas(undefined, {
      activeSelection: new ActiveSelection([
        new FabricObject({
          left: 100,
          top: 100,
          width: 100,
          height: 100,
        }),
      ]),
      viewportTransform: [2, 0, 0, 0.5, 400, 150],
    });
    expect(canvas.getActiveSelection().aCoords).toMatchSnapshot();
  });

  it('`setActiveObject` should update the active selection ref on canvas if it changed', () => {
    const canvas = new Canvas();
    const obj1 = new FabricObject();
    const obj2 = new FabricObject();
    canvas.add(obj1, obj2);
    const activeSelection = new ActiveSelection([obj1, obj2]);
    const spy = jest.spyOn(activeSelection, 'setCoords');
    canvas.setActiveObject(activeSelection);
    expect(canvas.getActiveSelection()).toBe(activeSelection);
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
    const canvas = new Canvas();
    const activeSelection = canvas.getActiveSelection();

    const eventsSpy = jest.spyOn(object, 'fire');
    const removeSpy = jest.spyOn(group, 'remove');
    const exitSpy = jest.spyOn(group, '_exitGroup');
    const enterSpy = jest.spyOn(activeSelection, 'enterGroup');

    expect(object.group).toBe(group);
    expect(object.parent).toBe(group);
    expect(object.canvas).toBeUndefined();

    activeSelection.add(object);
    expect(object.group).toBe(activeSelection);
    expect(object.parent).toBe(group);
    expect(object.canvas).toBe(canvas);
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
    expect(object.canvas).toBeUndefined();
  });

  test('transferring an object between active selections', () => {
    const object = new FabricObject();
    const group = new Group([object]);
    const activeSelection1 = new ActiveSelection([object]);
    const activeSelection2 = new ActiveSelection();
    expect(object.group).toBe(activeSelection1);
    expect(object.parent).toBe(group);

    const eventsSpy = jest.spyOn(object, 'fire');
    const removeSpy = jest.spyOn(activeSelection1, 'remove');

    Object.entries({
      object,
      group,
      activeSelection1,
      activeSelection2,
    }).forEach(([key, obj]) => jest.spyOn(obj, 'toJSON').mockReturnValue(key));

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
});
