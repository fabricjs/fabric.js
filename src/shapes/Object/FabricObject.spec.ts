import { FabricObject } from './FabricObject';

import { describe, expect, it } from 'vitest';

describe('FabricObject', () => {
  it('setCoords should calculate control coords only if canvas ref is set', () => {
    const object = new FabricObject();
    expect(object.aCoords).toBeUndefined();
    expect(object.oCoords).toBeUndefined();
    object.setCoords();
    expect(object.aCoords).toBeDefined();
    expect(object.oCoords).toBeUndefined();
    // @ts-expect-error -- mock canvas
    object.canvas = { getZoom: () => 1 };
    object.setCoords();
    expect(object.aCoords).toBeDefined();
    expect(object.oCoords).toBeDefined();
  });
});
