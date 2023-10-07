import { Canvas } from '../canvas/Canvas';
import { ActiveSelection } from './ActiveSelection';
import { Group } from './Group';
import { FabricObject } from './Object/FabricObject';

describe('ActiveSelection', () => {
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
    expect(canvas.getActiveSelection().lineCoords).toMatchSnapshot();
    expect(canvas.getActiveSelection().aCoords).toMatchSnapshot();
  });

  it('`setActiveObject` should update the active selection ref on canvas if it changed', () => {
    const canvas = new Canvas(null);
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

  it('transferring an object between active selections keeps its owning group', () => {
    const object = new FabricObject();
    const group = new Group([object]);
    const activeSelection1 = new ActiveSelection([object]);
    const activeSelection2 = new ActiveSelection();
    expect(object.group).toBe(activeSelection1);
    expect(object.getParent(true)).toBe(group);
    activeSelection2.add(object);
    expect(object.group).toBe(activeSelection2);
    expect(object.getParent(true)).toBe(group);
    activeSelection2.removeAll();
    expect(object.group).toBe(group);
    expect(object.getParent(true)).toBe(group);
  });
});
