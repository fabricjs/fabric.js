import { describe, it, expect, beforeEach } from 'vitest';
import { createCollectionMixin } from './Collection';
import { Rect } from './shapes/Rect';
import { FabricObject } from '../fabric';

let collection: TestCollection;
let collection2: TestCollection;
let added: FabricObject[];
let removed: FabricObject[];

class TestCollection extends createCollectionMixin(FabricObject) {
  _onObjectAdded(object: FabricObject) {
    added.push(object);
  }

  _onObjectRemoved(object: FabricObject) {
    removed.push(object);
  }
}

describe('fabric.Collection', () => {
  beforeEach(() => {
    collection = new TestCollection();
    collection2 = new TestCollection();
    added = [];
    removed = [];
  });

  it('init', () => {
    expect(Array.isArray(collection._objects), 'is array').toBeTruthy();
    expect(collection._objects.length, 'is empty array').toBe(0);
    expect(Array.isArray(collection2._objects), 'is array').toBeTruthy();
    expect(collection2._objects.length, 'is empty array').toBe(0);
    expect(collection._objects, 'different array').not.toBe(
      collection2._objects,
    );
  });

  it('add', () => {
    const obj = { prop: 4 } as unknown as FabricObject;
    expect(typeof collection.add, 'has add method').toBe('function');
    expect(collection._objects, 'start with empty array of items').toEqual([]);
    collection.add(obj);
    expect(collection._objects[0], 'add object in the array').toBe(obj);
    expect(added.length, 'fired is 0').toBe(1);
    collection.add(obj);
    expect(collection._objects.length, 'we have 2 objects in collection').toBe(
      2,
    );
    expect(collection._objects, 'we have 2 objects in collection').toEqual(
      added,
    );
    collection.add(obj, obj, obj, obj);
    expect(added.length, 'fired is incremented for every object added').toBe(6);
    expect(collection._objects, 'we have 6 objects in collection').toEqual(
      added,
    );
    expect(collection._objects.length, 'all objects have been added').toBe(6);
  });

  it('insertAt', () => {
    const rect1 = new Rect({ id: 1 });
    const rect2 = new Rect({ id: 2 });
    const rect3 = new Rect({ id: 3 });
    const rect4 = new Rect({ id: 4 });
    const rect5 = new Rect({ id: 5 });
    const rect6 = new Rect({ id: 6 });
    const rect7 = new Rect({ id: 7 });
    const rect8 = new Rect({ id: 8 });
    const control: Rect[] = [];
    const firingControl: Rect[] = [];

    collection.add(rect1, rect2);
    control.push(rect1, rect2);
    added = [];

    expect(
      typeof collection.insertAt,
      'should respond to `insertAt` method',
    ).toBe('function');

    const equalsControl = () => {
      expect(
        // @ts-expect-error -- id is custom prop
        collection.getObjects().map((o) => o.id),
        'should equal control array',
        // @ts-expect-error -- id is custom prop
      ).toEqual(control.map((o) => o.id));
      expect(collection.getObjects(), 'should equal control array').toEqual(
        control,
      );
      expect(
        // @ts-expect-error -- id is custom prop
        added.map((o) => o.id),
        'fired events should equal control array',
        // @ts-expect-error -- id is custom prop
      ).toEqual(firingControl.map((o) => o.id));
      expect(added, 'fired events should equal control array').toEqual(
        firingControl,
      );
    };

    collection.insertAt(1, rect3);
    control.splice(1, 0, rect3);
    firingControl.push(rect3);
    equalsControl();
    collection.insertAt(0, rect4);
    control.splice(0, 0, rect4);
    firingControl.push(rect4);
    equalsControl();
    collection.insertAt(2, rect5);
    control.splice(2, 0, rect5);
    firingControl.push(rect5);
    equalsControl();
    collection.insertAt(2, rect6);
    control.splice(2, 0, rect6);
    firingControl.push(rect6);
    equalsControl();
    collection.insertAt(3, rect7, rect8);
    control.splice(3, 0, rect7, rect8);
    firingControl.push(rect7, rect8);
    equalsControl();
    //  insert duplicates
    collection.insertAt(2, rect1, rect2);
    control.splice(2, 0, rect1, rect2);
    firingControl.push(rect1, rect2);
    equalsControl();
  });

  it('remove', () => {
    const obj = { prop: 4 } as unknown as FabricObject;
    const obj2 = { prop: 2 } as unknown as FabricObject;
    const obj3 = { prop: 3 } as unknown as FabricObject;
    collection.add(
      { prop: 0 } as unknown as FabricObject,
      { prop: 1 } as unknown as FabricObject,
      obj2,
      obj,
      obj3,
    );
    const previousLength = collection._objects.length;
    expect(typeof collection.remove, 'has remove method').toBe('function');
    const returned = collection.remove(obj);
    expect(returned, 'should return removed objects').toEqual([obj]);
    expect(
      Array.isArray(collection.remove()),
      'should return empty array',
    ).toBeTruthy();
    expect(
      collection.remove({ prop: 'foo' } as unknown as FabricObject).length,
      'nothing removed',
    ).toBe(0);
    expect(collection._objects.indexOf(obj), 'obj is no more in array').toBe(
      -1,
    );
    expect(collection._objects.length, 'length has changed').toBe(
      previousLength - 1,
    );
    expect(removed, 'should have called _onObjectRemoved').toEqual([obj]);
    const returned2 = collection.remove(obj2);
    expect(removed, 'should have called _onObjectRemoved').toEqual([obj, obj2]);
    expect(returned2, 'should return removed objects').toEqual([obj2]);
    const returned3 = collection.remove(obj2);
    expect(returned3, 'should return removed objects').toEqual([]);
    expect(removed, 'should not have called _onObjectRemoved').toEqual([
      obj,
      obj2,
    ]);

    collection.add(obj2);
    collection.add(obj);
    collection.remove(obj2);
    const previousLength2 = collection._objects.length;
    removed = [];
    const returned4 = collection.remove(obj, obj3, obj2);
    expect(returned4, 'should return removed objects').toEqual([obj, obj3]);
    expect(collection._objects.length, 'we have 2 objects less').toBe(
      previousLength2 - 2,
    );
    expect(removed, 'should have called _onObjectRemoved').toEqual([obj, obj3]);
  });

  it('forEachObject', () => {
    const obj = { prop: false } as unknown as FabricObject;
    const obj2 = { prop: false } as unknown as FabricObject;
    const obj3 = { prop: false } as unknown as FabricObject;
    let fired = 0;
    collection.add(obj2, obj, obj3);
    expect(typeof collection.forEachObject, 'has forEachObject method').toBe(
      'function',
    );
    const callback = function (_obj: FabricObject) {
      // @ts-expect-error -- custom prop
      _obj.prop = true;
      fired++;
    };
    collection.forEachObject(callback);
    expect(fired, 'fired once for every object').toBe(
      collection._objects.length,
    );
    expect(obj, 'fired for obj').toHaveProperty('prop', true);
    expect(obj2, 'fired for obj2').toHaveProperty('prop', true);
    expect(obj3, 'fired for obj3').toHaveProperty('prop', true);
  });

  it('getObjects', () => {
    class A extends FabricObject {}

    class B extends FabricObject {}

    class C extends FabricObject {}

    const obj = new A();
    const obj2 = new B();
    const obj3 = new C();
    collection.add(obj2, obj, obj3);
    expect(typeof collection.getObjects, 'has getObjects method').toBe(
      'function',
    );
    const returned = collection.getObjects();
    expect(returned, 'does not return a reference to _objects').not.toBe(
      collection._objects,
    );
    expect(returned, 'returns objects').toEqual([obj2, obj, obj3]);
  });

  it('item', () => {
    const obj = { type: 'a' } as FabricObject;
    const obj2 = { type: 'b' } as FabricObject;
    const index = 1;
    collection.add(obj2, obj);
    expect(typeof collection.item, 'has item method').toBe('function');
    const returned = collection.item(index);
    expect(returned, 'return the object at index').toBe(
      collection._objects[index],
    );
  });

  it('isEmpty', () => {
    const obj = { type: 'a' } as FabricObject;
    const obj2 = { type: 'b' } as FabricObject;
    expect(typeof collection.isEmpty, 'has isEmpty method').toBe('function');
    const returned = collection.isEmpty();
    expect(returned, 'collection is empty').toBe(true);
    collection.add(obj2, obj);
    const returned2 = collection.isEmpty();
    expect(returned2, 'collection is not empty').toBe(false);
  });

  it('size', () => {
    const obj = { type: 'a' } as FabricObject;
    const obj2 = { type: 'b' } as FabricObject;
    expect(typeof collection.size, 'has size method').toBe('function');
    const returned = collection.size();
    expect(typeof returned, 'returns a number').toBe('number');
    expect(returned, 'collection is empty').toBe(0);
    collection.add(obj2, obj);
    const returned2 = collection.size();
    expect(returned2, 'collection has 2 objects').toBe(2);
  });

  it('contains', () => {
    const obj = { type: 'a' } as FabricObject;
    expect(typeof collection.contains, 'has contains method').toBe('function');
    const returned = collection.contains(obj);
    expect(typeof returned, 'returns a boolean').toBe('boolean');
    expect(returned, 'collection is empty so does not contains obj').toBe(
      false,
    );
    collection.add(obj);
    const returned2 = collection.contains(obj);
    expect(returned2, 'collection contains obj').toBe(true);
    const obj2 = { type: 'b' } as FabricObject;
    collection2.add(obj2);
    collection.add(collection2);
    const returned3 = collection.contains(obj2);
    expect(
      returned3,
      'collection deeply contains obj, this check is shallow',
    ).toBe(false);
    const returned4 = collection.contains(obj2, false);
    expect(
      returned4,
      'collection deeply contains obj, this check is shallow',
    ).toBe(false);
    const returned5 = collection.contains(obj2, true);
    expect(returned5, 'collection deeply contains obj').toBe(true);
  });

  it('complexity', () => {
    const obj = { type: 'a' } as FabricObject;
    const obj2 = { type: 'b' } as FabricObject;
    expect(typeof collection.complexity, 'has complexity method').toBe(
      'function',
    );
    const returned = collection.complexity();
    expect(typeof returned, 'returns a number').toBe('number');
    expect(returned, 'collection has complexity 0').toBe(0);
    collection.add(obj2, obj);
    const returned2 = collection.complexity();
    expect(
      returned2,
      'collection has complexity 0 if objects have no complexity themselves',
    ).toBe(0);
    const complexObject = {
      complexity: function () {
        return 9;
      },
    } as FabricObject;
    const complexObject2 = {
      complexity: function () {
        return 10;
      },
    } as FabricObject;
    collection.add(complexObject, complexObject2);
    const returned3 = collection.complexity();
    expect(returned3, 'collection has complexity 9 + 10').toBe(19);
  });

  describe('collect objects', () => {
    it('method collects object contained in area', () => {
      const rect1 = new Rect({ width: 10, height: 10, top: 0, left: 0 });
      const rect2 = new Rect({ width: 10, height: 10, top: 0, left: 10 });
      const rect3 = new Rect({ width: 10, height: 10, top: 10, left: 0 });
      const rect4 = new Rect({ width: 10, height: 10, top: 10, left: 10 });
      collection.add(rect1, rect2, rect3, rect4);
      const collected = collection.collectObjects({
        left: 1,
        top: 1,
        width: 15,
        height: 15,
      });
      expect(
        collected.length,
        'a rect that contains all objects collects them all',
      ).toBe(4);
      expect(collected[3], 'contains rect1 as last object').toBe(rect1);
      expect(collected[2], 'contains rect2').toBe(rect2);
      expect(collected[1], 'contains rect3').toBe(rect3);
      expect(collected[0], 'contains rect4 as first object').toBe(rect4);
    });

    it('method do not collects object if area is outside', () => {
      const rect1 = new Rect({ width: 10, height: 10, top: 0, left: 0 });
      const rect2 = new Rect({ width: 10, height: 10, top: 0, left: 10 });
      const rect3 = new Rect({ width: 10, height: 10, top: 10, left: 0 });
      const rect4 = new Rect({ width: 10, height: 10, top: 10, left: 10 });
      collection.add(rect1, rect2, rect3, rect4);
      const collected = collection.collectObjects({
        left: 24,
        top: 24,
        width: 1,
        height: 1,
      });
      expect(
        collected.length,
        'a rect outside objects do not collect any of them',
      ).toBe(0);
    });

    it('method collect included objects that are not touched by the selection sides', () => {
      const rect1 = new Rect({ width: 10, height: 10, top: 5, left: 5 });
      collection.add(rect1);
      const collected = collection.collectObjects({
        left: 1,
        top: 1,
        width: 20,
        height: 20,
      });
      expect(
        collected.length,
        'a rect that contains all objects collects them all',
      ).toBe(1);
      expect(collected[0], 'rect1 is collected').toBe(rect1);
    });

    it('method collect topmost object if no dragging occurs', () => {
      const rect1 = new Rect({ width: 10, height: 10, top: 0, left: 0 });
      const rect2 = new Rect({ width: 10, height: 10, top: 0, left: 0 });
      const rect3 = new Rect({ width: 10, height: 10, top: 0, left: 0 });
      collection.add(rect1, rect2, rect3);
      const collected = collection.collectObjects({
        left: 1,
        top: 1,
        width: 0,
        height: 0,
      });
      expect(
        collected.length,
        'a rect that contains all objects collects them all',
      ).toBe(3);
    });

    it('method collect objects if the drag is inside the object', () => {
      const rect1 = new Rect({ width: 10, height: 10, top: 0, left: 0 });
      const rect2 = new Rect({ width: 10, height: 10, top: 0, left: 0 });
      const rect3 = new Rect({ width: 10, height: 10, top: 0, left: 0 });
      collection.add(rect1, rect2, rect3);
      const collected = collection.collectObjects({
        left: 1,
        top: 1,
        width: 2,
        height: 2,
      });
      expect(
        collected.length,
        'a rect that contains all objects collects them all',
      ).toBe(3);
      expect(collected[0], 'rect3 is collected').toBe(rect3);
      expect(collected[1], 'rect2 is collected').toBe(rect2);
      expect(collected[2], 'rect1 is collected').toBe(rect1);
    });

    it('method collects object fully contained in area', () => {
      const rect1 = new Rect({ width: 10, height: 10, top: 0, left: 0 });
      const rect2 = new Rect({ width: 10, height: 10, top: 0, left: 10 });
      const rect3 = new Rect({ width: 10, height: 10, top: 10, left: 0 });
      const rect4 = new Rect({ width: 10, height: 10, top: 10, left: 10 });
      collection.add(rect1, rect2, rect3, rect4);
      const collected = collection.collectObjects(
        {
          left: -6,
          top: -6,
          width: 30,
          height: 30,
        },
        { includeIntersecting: false },
      );
      expect(
        collected.length,
        'a rect that contains all objects collects them all',
      ).toBe(4);
      expect(collected[3], 'contains rect1 as last object').toBe(rect1);
      expect(collected[2], 'contains rect2').toBe(rect2);
      expect(collected[1], 'contains rect3').toBe(rect3);
      expect(collected[0], 'contains rect4 as first object').toBe(rect4);
    });

    it('method does not collect objects not fully contained', () => {
      const rect1 = new Rect({ width: 10, height: 10, top: 0, left: 0 });
      const rect2 = new Rect({ width: 10, height: 10, top: 0, left: 10 });
      const rect3 = new Rect({ width: 10, height: 10, top: 10, left: 0 });
      const rect4 = new Rect({ width: 10, height: 10, top: 10, left: 10 });
      collection.add(rect1, rect2, rect3, rect4);
      const collected = collection.collectObjects(
        {
          left: 0,
          top: 0,
          width: 20,
          height: 20,
        },
        { includeIntersecting: false },
      );
      expect(
        collected.length,
        'a rect intersecting objects does not collect those',
      ).toBe(1);
      expect(collected[0], 'contains rect1 as only one fully contained').toBe(
        rect4,
      );
    });
  });
});
