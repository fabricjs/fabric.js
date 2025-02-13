import { Canvas } from '../../canvas/Canvas';
import { ActiveSelection } from '../ActiveSelection';
import { Group } from '../Group';
import { FabricObject } from './FabricObject';

import { describe, expect, it, test } from 'vitest';

class TestObject extends FabricObject {
  id: string;

  constructor({ id }: { id: string }) {
    super();
    this.id = id;
  }
}

class TestCollection extends Group {
  id: string;

  constructor({ id }: { id: string }) {
    super();
    this.id = id;
  }
}

class TestCanvas extends Canvas {
  id: string;

  constructor({ id }: { id: string }) {
    super();
    this.id = id;
  }
}

function prepareObjectsForTreeTesting() {
  return {
    object: new TestObject({ id: 'object' }),
    other: new TestObject({ id: 'other' }),
    a: new TestCollection({ id: 'a' }),
    b: new TestCollection({ id: 'b' }),
    c: new TestCollection({ id: 'c' }),
    canvas: new TestCanvas({ id: 'canvas' }),
  };
}

describe('FabricObject stacking', () => {
  test('isDescendantOf', function () {
    const canvas = new Canvas();
    const object = new FabricObject();
    const parent = new Group([]);
    expect(typeof object.isDescendantOf === 'function').toBe(true);
    parent.canvas = canvas;
    object.parent = parent;
    expect(object.isDescendantOf(parent)).toBe(true);
    object.parent = new Group();
    object.parent.parent = parent;
    expect(object.isDescendantOf(parent)).toBe(true);
    object.parent = undefined;
    expect(object.isDescendantOf(parent) === false).toBe(true);
    object.canvas = canvas;
    expect(object.isDescendantOf(object) === false).toBe(true);
    object.parent = parent;
    const activeSelection = new ActiveSelection([object], { canvas });
    expect(object.group).toEqual(activeSelection);
    expect(object.parent).toEqual(parent);
    expect(object.canvas).toEqual(canvas);
    expect(object.isDescendantOf(parent));
    expect(object.isDescendantOf(activeSelection)).toBe(true);
    delete object.parent;
    expect(!object.isDescendantOf(parent));
    expect(object.isDescendantOf(activeSelection)).toBe(true);
  });

  test('getAncestors return type', () => {
    const object = new FabricObject();

    const parents: Group[] = object.getAncestors();

    const isGroup = (a: unknown): a is Group => a instanceof Group;

    const ancestors = object.getAncestors();
    const parentAncestors: Group[] = ancestors.filter(isGroup);

    expect(parents).toBeDefined();
    expect(parentAncestors).toBeDefined();
  });

  test('getAncestors', () => {
    const canvas = new Canvas();
    const object = new FabricObject();
    const parent = new Group([]);
    const other = new Group();

    expect(object.getAncestors()).toEqual([]);
    object.parent = parent;
    expect(object.getAncestors()).toEqual([parent]);
    expect<Group[]>(object.getAncestors()).toEqual([parent]);
    parent.canvas = canvas;
    expect(object.getAncestors()).toEqual([parent]);
    parent.parent = other;
    expect(object.getAncestors()).toEqual([parent, other]);
    other.canvas = canvas;
    expect(object.getAncestors()).toEqual([parent, other]);
    delete object.parent;
    expect(object.getAncestors()).toEqual([]);
  });

  describe('findCommonAncestors', () => {
    const getId = (obj: unknown) =>
      (obj as TestObject | TestCollection | TestCanvas).id;

    function findCommonAncestors(
      object: TestObject,
      other: TestObject,
      expected: ReturnType<typeof FabricObject.prototype.findCommonAncestors>,
    ) {
      const common = object.findCommonAncestors(other);
      expect(common.fork.map(getId)).toEqual(expected.fork.map(getId));
      expect(common.otherFork.map(getId)).toEqual(
        expected.otherFork.map(getId),
      );
      expect(common.common.map(getId)).toEqual(expected.common.map(getId));
      const oppositeCommon = other.findCommonAncestors(object);
      expect(oppositeCommon.fork.map(getId)).toEqual(
        expected.otherFork.map(getId),
      );
      expect(oppositeCommon.otherFork.map(getId)).toEqual(
        expected.fork.map(getId),
      );
      expect(oppositeCommon.common.map(getId)).toEqual(
        expected.common.map(getId),
      );
    }
    const { object, other, a, b, c, canvas } = prepareObjectsForTreeTesting();
    it('should be a function', () => {
      expect(typeof object.findCommonAncestors).toBe('function');
    });
    it('_objects should be an array', () => {
      expect(Array.isArray(a._objects)).toBe(true);
    });
    it('_objects should be different', () => {
      expect(a._objects).not.toBe(b._objects);
    });
    // same object
    findCommonAncestors(object, object, {
      fork: [],
      otherFork: [],
      common: [object],
    });
    // foreign objects
    findCommonAncestors(object, other, {
      fork: [object],
      otherFork: [other],
      common: [],
    });
    // same level
    a.add(object, other);
    findCommonAncestors(object, other, {
      fork: [object],
      otherFork: [other],
      common: [a],
    });
    findCommonAncestors(object, a, {
      fork: [object],
      otherFork: [],
      common: [a],
    });
    findCommonAncestors(other, a, {
      fork: [other],
      otherFork: [],
      common: [a],
    });
    findCommonAncestors(a, object, {
      fork: [],
      otherFork: [object],
      common: [a],
    });
    findCommonAncestors(a, object, {
      fork: [],
      otherFork: [object],
      common: [a],
    });
    // different level
    a.remove(object);
    b.add(object);
    a.add(b);
    findCommonAncestors(object, b, {
      fork: [object],
      otherFork: [],
      common: [b, a],
    });
    findCommonAncestors(b, a, { fork: [b], otherFork: [], common: [a] });
    findCommonAncestors(object, other, {
      fork: [object, b],
      otherFork: [other],
      common: [a],
    });
    // with common ancestor
    expect(c.size()).toBe(0);
    c.add(a);
    expect(c.size()).toBe(1);
    findCommonAncestors(object, b, {
      fork: [object],
      otherFork: [],
      common: [b, a, c],
    });
    findCommonAncestors(b, a, {
      fork: [b],
      otherFork: [],
      common: [a, c],
    });
    findCommonAncestors(object, other, {
      fork: [object, b],
      otherFork: [other],
      common: [a, c],
    });
    findCommonAncestors(object, c, {
      fork: [object, b, a],
      otherFork: [],
      common: [c],
    });
    findCommonAncestors(other, c, {
      fork: [other, a],
      otherFork: [],
      common: [c],
    });
    findCommonAncestors(b, c, {
      fork: [b, a],
      otherFork: [],
      common: [c],
    });
    findCommonAncestors(a, c, { fork: [a], otherFork: [], common: [c] });
    //  deeper asymmetrical
    c.removeAll();
    expect(c.size()).toBe(0);
    a.remove(other);
    c.add(other, a);
    findCommonAncestors(object, b, {
      fork: [object],
      otherFork: [],
      common: [b, a, c],
    });
    findCommonAncestors(b, a, {
      fork: [b],
      otherFork: [],
      common: [a, c],
    });
    findCommonAncestors(a, other, {
      fork: [a],
      otherFork: [other],
      common: [c],
    });
    findCommonAncestors(object, other, {
      fork: [object, b, a],
      otherFork: [other],
      common: [c],
    });
    findCommonAncestors(object, c, {
      fork: [object, b, a],
      otherFork: [],
      common: [c],
    });
    findCommonAncestors(other, c, {
      fork: [other],
      otherFork: [],
      common: [c],
    });
    findCommonAncestors(b, c, {
      fork: [b, a],
      otherFork: [],
      common: [c],
    });
    findCommonAncestors(a, c, {
      fork: [a],
      otherFork: [],
      common: [c],
    });
    //  with canvas
    a.removeAll();
    b.removeAll();
    c.removeAll();
    canvas.add(object, other);
    findCommonAncestors(object, other, {
      fork: [object],
      otherFork: [other],
      common: [],
    });
    findCommonAncestors(object, other, {
      fork: [object],
      otherFork: [other],
      common: [],
    });
  });

  test('isInFrontOf', () => {
    const isInFrontOf = (
      object: FabricObject,
      other: FabricObject,
      expected: boolean | undefined,
    ) => {
      const actual = object.isInFrontOf(other);
      expect(actual).toBe(expected);
      if (actual === expected && typeof expected === 'boolean') {
        const actual2 = other.isInFrontOf(object);
        expect(!expected).toBe(actual2);
      }
    };

    const { object, other, a, b, c, canvas } = prepareObjectsForTreeTesting();
    expect(typeof object.isInFrontOf).toBe('function');
    expect(Array.isArray(a._objects)).toBe(true);
    expect(a._objects !== b._objects).toBe(true);
    //  same object
    isInFrontOf(object, object, undefined);
    //  foreign objects
    isInFrontOf(object, other, undefined);
    //  same level
    a.add(object, other);
    isInFrontOf(object, other, false);
    isInFrontOf(object, a, true);
    isInFrontOf(other, a, true);
    // different level
    a.remove(object);
    b.add(object);
    a.add(b);
    isInFrontOf(object, b, true);
    isInFrontOf(b, a, true);
    isInFrontOf(object, other, true);
    //  with common ancestor
    expect(c.size()).toBe(0); // 'c should be empty'
    c.add(a);
    expect(c.size()).toBe(1); // 'c should contain a'
    isInFrontOf(object, b, true);
    isInFrontOf(b, a, true);
    isInFrontOf(object, other, true);
    isInFrontOf(object, c, true);
    isInFrontOf(other, c, true);
    isInFrontOf(b, c, true);
    isInFrontOf(a, c, true);
    //  deeper asymmetrical
    c.removeAll();
    expect(c.size()).toBe(0);
    a.remove(other);
    c.add(other, a);
    isInFrontOf(object, b, true);
    isInFrontOf(b, a, true);
    isInFrontOf(a, other, true);
    isInFrontOf(object, other, true);
    isInFrontOf(object, c, true);
    isInFrontOf(other, c, true);
    isInFrontOf(b, c, true);
    isInFrontOf(a, c, true);
    // with canvas
    a.removeAll();
    b.removeAll();
    c.removeAll();
    canvas.add(object, other);
    isInFrontOf(object, other, false);
    // parent precedes canvas when checking ancestor
    a.add(object);
    expect(other.canvas).toBe(canvas);
    expect(object.canvas).toBe(undefined); // because a is not on canvas
    isInFrontOf(object, other, undefined);
    canvas.insertAt(0, a);
    isInFrontOf(object, other, false);
    isInFrontOf(a, other, false);
    expect(object.canvas).toBe(canvas); // because a is now on a canvas
  });
});
