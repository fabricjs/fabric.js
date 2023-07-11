import { ActiveSelection } from './ActiveSelection';
import { FabricObject } from './Object/FabricObject';

describe('ActiveSelection', () => {
  it('removeAll clears positioning', () => {
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
    expect(selection.removeAll()).toEqual([obj]);
    expect(selection).toMatchObject({
      left: 0,
      top: 0,
      angle: 0,
      scaleX: 0,
      scaleY: 0,
      skewX: 0,
      skewY: 0,
      flipX: false,
      flipY: false,
    });
  });

  it('deselect removes all objects and clears positioning', () => {
    const selection = new ActiveSelection([], {
      left: 200,
      top: 100,
      angle: 45,
    });
    const spy = jest.spyOn(selection, 'removeAll');
    selection.onDeselect();
    expect(spy).toHaveBeenCalled();
    selection.add(new FabricObject({ left: 50, top: 50, strokeWidth: 0 }));
    expect(selection.item(0).getCenterPoint()).toEqual({ x: 50, y: 50 });
  });
});
