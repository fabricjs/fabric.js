import { ClassRegistry } from './ClassRegistry';

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
      static type = 'SETABC';
    }
    classRegistry.setClass(Set2);
    expect(classRegistry.has('SETABC')).toBe(true);
    expect(classRegistry.getClass('SETABC')).toBe(Set2);
    expect(classRegistry.getClass('setabc')).toBe(Set2);
  });
  it('has a method for SVG parsing classes', () => {
    class Set2 extends Set {
      static type = 'SETABC';
    }
    classRegistry.setSVGClass(Set2);
    expect(classRegistry.getSVGClass('SETABC')).toBe(undefined);
    expect(classRegistry.getSVGClass('setabc')).toBe(Set2);
  });
});
