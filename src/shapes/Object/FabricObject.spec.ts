import { FabricObject } from './FabricObject';

describe('FabricObject', () => {
  it('setCoords should calculate control coords only if canvas ref is set', () => {
    const object = new FabricObject();
    expect(object.aCoords).toBeUndefined();
    expect(object.oCoords).toBeUndefined();
    object.setCoords();
    expect(object.aCoords).toBeDefined();
    expect(object.oCoords).toBeUndefined();
    object.canvas = jest.fn();
    object.setCoords();
    expect(object.aCoords).toBeDefined();
    expect(object.oCoords).toBeDefined();
  });
});
