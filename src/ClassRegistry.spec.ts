import {
  ClassRegistry,
  classRegistry as genericClassRegistryInstance,
  JSON,
} from './ClassRegistry';
import './shapes/Object/FabricObject';

import { describe, expect, beforeEach, it } from 'vitest';

describe('ClassRegistry', () => {
  let classRegistry: ClassRegistry;
  beforeEach(() => {
    classRegistry = new ClassRegistry();
  });
  it('will error if a class is request that is not registered', () => {
    expect(() => classRegistry.getClass('any')).toThrow(
      'No class registered for any',
    );
  });
  it('will return a class previously registered', () => {
    classRegistry.setClass(Set, 'any');
    expect(classRegistry.getClass('any')).toBe(Set);
  });
  it('will check if a class was previously registered', () => {
    expect(classRegistry.has('any')).toBe(false);
    classRegistry.setClass(Set, 'any');
    expect(classRegistry.has('any')).toBe(true);
  });
  it('not specified will register the class using the type static prop', () => {
    class Set2 extends Set {
      static type = 'SetAbc';
    }
    classRegistry.setClass(Set2);
    expect(classRegistry.has('SetAbc')).toBe(true);
    expect(classRegistry.getClass('SetAbc'), 'exact match').toBe(Set2);
    expect(classRegistry.getClass('setabc'), 'lowercase match').toBe(Set2);
    expect(
      () => classRegistry.getClass('SETABC'),
      'is not a generic match',
    ).toThrowError();
  });
  it('has a method for SVG parsing classes', () => {
    class Set2 extends Set {
      static type = 'SETABC';
    }
    classRegistry.setSVGClass(Set2);
    expect(classRegistry.getSVGClass('SETABC')).toBe(undefined);
    expect(classRegistry.getSVGClass('setabc')).toBe(Set2);
  });
  it('can resolve different class for SVG and JSON', function () {
    class TestClass3 {}
    class TestClass4 {}
    classRegistry.setClass(TestClass3, 'myCustomType');
    classRegistry.setSVGClass(TestClass4, 'myCustomType');
    const resolved = classRegistry.getClass('myCustomType');
    const resolvedSvg = classRegistry.getSVGClass('myCustomType');
    expect(resolved, 'resolved different classes').not.toBe(resolvedSvg);
  });
  it('legacy resolution preparation', async () => {
    genericClassRegistryInstance[JSON].delete('rect');
    genericClassRegistryInstance[JSON].delete('i-text');
    genericClassRegistryInstance[JSON].delete('activeSelelection');
    genericClassRegistryInstance[JSON].delete('object');
    expect(genericClassRegistryInstance.has('rect')).toBe(false);
    expect(genericClassRegistryInstance.has('i-text')).toBe(false);
    expect(genericClassRegistryInstance.has('activeSelection')).toBe(false);
    expect(genericClassRegistryInstance.has('object')).toBe(false);
  });
  it('legacy resolution', async () => {
    const { Rect } = await import('./shapes/Rect');
    const { IText } = await import('./shapes/IText/IText');
    const { ActiveSelection } = await import('./shapes/ActiveSelection');
    // const { FabricObject } = await import('./shapes/Object/FabricObject');
    expect(
      genericClassRegistryInstance.getClass('rect'),
      'resolves Rect class correctly',
    ).toBe(Rect);
    expect(
      genericClassRegistryInstance.getClass('i-text'),
      'resolves IText class correctly',
    ).toBe(IText);
    expect(
      genericClassRegistryInstance.getClass('activeSelection'),
      'resolves ActiveSelection class correctly',
    ).toBe(ActiveSelection);
    // expect(
    //   genericClassRegistryInstance.getClass('object'),
    //   'resolves FabricObject class correctly',
    // ).toBe(FabricObject);
  });
});
