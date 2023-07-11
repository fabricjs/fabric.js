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
      left: 1,
      top: 1,
      angle: 45,
    });
    expect(selection.removeAll()).toEqual([obj]);
    expect(selection).toMatchObject({
      left: 0,
      top: 0,
      angle: 0,
    });
  });

  it('deselect calls removeAll', () => {
    const selection = new ActiveSelection([], {
      left: 1,
      top: 1,
      angle: 45,
    });
    const spy = jest.spyOn(selection, 'removeAll');
    selection.onDeselect();
    expect(spy).toHaveBeenCalled();
  });
});
