import { FabricObject } from './FabricObject';

import { describe, expect, it, vi } from 'vitest';

describe('FabricObject', () => {
  it('setCoords should calculate control coords only if canvas ref is set', () => {
    const object = new FabricObject();
    expect(object.aCoords).toBeUndefined();
    expect(object.oCoords).toBeUndefined();
    object.setCoords();
    expect(object.aCoords).toBeDefined();
    expect(object.oCoords).toBeUndefined();
    object.canvas = vi.fn();
    object.setCoords();
    expect(object.aCoords).toBeDefined();
    expect(object.oCoords).toBeDefined();
  });
});
