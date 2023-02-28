(function () {
  
  
  let collection, collection2, added, removed;

  class TestCollection extends fabric.createCollectionMixin(class {}) {
    _onObjectAdded(object) {
      added.push(object);
    }
    _onObjectRemoved(object) {
      removed.push(object)
    }
  }

  QUnit.module('fabric.Collection', (hooks) => {
    hooks.beforeEach(() => {
      collection = new TestCollection();
      collection2 = new TestCollection();
      added = [];
      removed = [];
    });

  QUnit.test('init', function (assert) {
    assert.ok(Array.isArray(collection._objects), 'is array');
    assert.equal(collection._objects.length, 0, 'is empty array');
    assert.ok(Array.isArray(collection2._objects), 'is array');
    assert.equal(collection2._objects.length, 0, 'is empty array');
    assert.notEqual(collection._objects, collection2._objects, 'different array');
  });

  QUnit.test('add', function(assert) {
    var obj = { prop: 4 };
    assert.ok(typeof collection.add === 'function', 'has add method');
    assert.deepEqual(collection._objects, [], 'start with empty array of items');
    collection.add(obj);
    assert.equal(collection._objects[0], obj, 'add object in the array');
    assert.equal(added.length, 1, 'fired is 0');
    collection.add(obj);
    assert.equal(collection._objects.length, 2, 'we have 2 objects in collection');
    assert.deepEqual(collection._objects, added, 'we have 2 objects in collection');
    collection.add(obj, obj, obj, obj);
    assert.equal(added.length, 6, 'fired is incremented for every object added');
    assert.deepEqual(collection._objects, added, 'we have 6 objects in collection');
    assert.equal(collection._objects.length, 6, 'all objects have been added');
  });

  QUnit.test('insertAt', function (assert) {
    var rect1 = new fabric.Rect({ id: 1 }),
        rect2 = new fabric.Rect({ id: 2 }),
        rect3 = new fabric.Rect({ id: 3 }),
        rect4 = new fabric.Rect({ id: 4 }),
        rect5 = new fabric.Rect({ id: 5 }),
        rect6 = new fabric.Rect({ id: 6 }),
        rect7 = new fabric.Rect({ id: 7 }),
        rect8 = new fabric.Rect({ id: 8 }),
        control = [],
        firingControl = [];

    collection.add(rect1, rect2);
    control.push(rect1, rect2);
    added = [];

    assert.ok(typeof collection.insertAt === 'function', 'should respond to `insertAt` method');

    const equalsControl = () => {
      assert.deepEqual(collection.getObjects().map(o => o.id), control.map(o => o.id), 'should equal control array');
      assert.deepEqual(collection.getObjects(), control, 'should equal control array');
      assert.deepEqual(added.map(o => o.id), firingControl.map(o => o.id), 'fired events should equal control array');
      assert.deepEqual(added, firingControl, 'fired events should equal control array');
    }

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

  QUnit.test('remove', function(assert) {
    var obj = { prop: 4 }, obj2 = { prop: 2 }, obj3 = { prop: 3 };
    collection.add({ prop: 0 }, {prop: 1}, obj2, obj, obj3);
    var previousLength = collection._objects.length;
    assert.ok(typeof collection.remove === 'function', 'has remove method');
    var returned = collection.remove(obj);
    assert.deepEqual(returned, [obj], 'should return removed objects');
    assert.ok(Array.isArray(collection.remove()), 'should return empty array');
    assert.equal(collection.remove({ prop: 'foo' }).length, 0, 'nothing removed');
    assert.equal(collection._objects.indexOf(obj), -1, 'obj is no more in array');
    assert.equal(collection._objects.length, previousLength - 1, 'length has changed');
    assert.deepEqual(removed, [obj], 'should have called _onObjectRemoved');
    returned = collection.remove(obj2);
    assert.deepEqual(removed, [obj, obj2], 'should have called _onObjectRemoved');
    assert.deepEqual(returned, [obj2], 'should return removed objects');
    returned = collection.remove(obj2);
    assert.deepEqual(returned, [], 'should return removed objects');
    assert.deepEqual(removed, [obj, obj2], 'should not have called _onObjectRemoved');

    collection.add(obj2);
    collection.add(obj);
    collection.remove(obj2);
    previousLength = collection._objects.length;
    removed = [];
    returned = collection.remove(obj, obj3, obj2);
    assert.deepEqual(returned, [obj, obj3], 'should return removed objects');
    assert.equal(collection._objects.length, previousLength - 2, 'we have 2 objects less');
    assert.deepEqual(removed, [obj, obj3], 'should have called _onObjectRemoved');
  });

  QUnit.test('forEachObject', function(assert) {
    var obj = { prop: false }, obj2 = { prop: false }, obj3 = { prop: false }, fired = 0;
    collection.add(obj2, obj, obj3);
    assert.ok(typeof collection.forEachObject === 'function', 'has forEachObject method');
    var callback = function(_obj) {
      _obj.prop = true;
      fired++;
    };
    collection.forEachObject(callback);
    assert.equal(fired, collection._objects.length, 'fired once for every object');
    assert.equal(obj.prop, true, 'fired for obj');
    assert.equal(obj2.prop, true, 'fired for obj2');
    assert.equal(obj3.prop, true, 'fired for obj3');
  });

  QUnit.test('getObjects', function (assert) {
    class A extends fabric.Object {
    }
    class B extends fabric.Object {
    }
    class C extends fabric.Object {
    }
    var obj = new A(), obj2 = new B(), obj3 = new C();
    collection.add(obj2, obj, obj3);
    assert.ok(typeof collection.getObjects === 'function', 'has getObjects method');
    var returned = collection.getObjects();
    assert.notEqual(returned, collection._objects, 'does not return a reference to _objects');
    assert.deepEqual(returned, [obj2, obj, obj3], 'returns objects');
  });

  QUnit.test('item', function(assert) {
    var obj = { type: 'a' }, obj2 = { type: 'b' }, index = 1;
    collection.add(obj2, obj);
    assert.ok(typeof collection.item === 'function', 'has item method');
    var returned = collection.item(index);
    assert.equal(returned, collection._objects[index], 'return the object at index');
  });

  QUnit.test('isEmpty', function(assert) {
    var obj = { type: 'a' }, obj2 = { type: 'b' };
    assert.ok(typeof collection.isEmpty === 'function', 'has isEmpty method');
    var returned = collection.isEmpty();
    assert.equal(returned, true, 'collection is empty');
    collection.add(obj2, obj);
    returned = collection.isEmpty();
    assert.equal(returned, false, 'collection is not empty');
  });

  QUnit.test('size', function(assert) {
    var obj = { type: 'a' }, obj2 = { type: 'b' };
    assert.ok(typeof collection.size === 'function', 'has size method');
    var returned = collection.size();
    assert.ok(typeof returned === 'number', 'returns a number');
    assert.equal(returned, 0, 'collection is empty');
    collection.add(obj2, obj);
    returned = collection.size();
    assert.equal(returned, 2, 'collection has 2 objects');
  });

  QUnit.test('contains', function(assert) {
    var obj = { type: 'a' };
    assert.ok(typeof collection.contains === 'function', 'has contains method');
    var returned = collection.contains(obj);
    assert.ok(typeof returned === 'boolean', 'returns a boolean');
    assert.equal(returned, false, 'collection is empty so does not contains obj');
    collection.add(obj);
    returned = collection.contains(obj);
    assert.equal(returned, true, 'collection contains obj');
    var obj2 = { type: 'b' };
    collection2.add(obj2);
    collection.add(collection2);
    returned = collection.contains(obj2);
    assert.equal(returned, false, 'collection deeply contains obj, this check is shallow');
    returned = collection.contains(obj2, false);
    assert.equal(returned, false, 'collection deeply contains obj, this check is shallow');
    returned = collection.contains(obj2, true);
    assert.equal(returned, true, 'collection deeply contains obj');
  });

  QUnit.test('complexity', function(assert) {
    var obj = { type: 'a' }, obj2 = { type: 'b' };
    assert.ok(typeof collection.complexity === 'function', 'has complexity method');
    var returned = collection.complexity();
    assert.ok(typeof returned === 'number', 'returns a number');
    assert.equal(returned, 0, 'collection has complexity 0');
    collection.add(obj2, obj);
    returned = collection.complexity();
    assert.equal(returned, 0, 'collection has complexity 0 if objects have no complexity themselves');
    var complexObject = { complexity: function() { return 9; }};
    var complexObject2 = { complexity: function() { return 10; }};
    collection.add(complexObject, complexObject2);
    returned = collection.complexity();
    assert.equal(returned, 19, 'collection has complexity 9 + 10');
  });

  QUnit.module('collect objects', (hooks) => {
    QUnit.test('method collects object contained in area', function (assert) {
      var rect1 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
      var rect2 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 10 });
      var rect3 = new fabric.Rect({ width: 10, height: 10, top: 10, left: 0 });
      var rect4 = new fabric.Rect({ width: 10, height: 10, top: 10, left: 10 });
      collection.add(rect1, rect2, rect3, rect4);
      var collected = collection.collectObjects({
        left: 1,
        top: 1,
        width: 15,
        height: 15
      });
      assert.equal(collected.length, 4, 'a rect that contains all objects collects them all');
      assert.equal(collected[3], rect1, 'contains rect1 as last object');
      assert.equal(collected[2], rect2, 'contains rect2');
      assert.equal(collected[1], rect3, 'contains rect3');
      assert.equal(collected[0], rect4, 'contains rect4 as first object');
    });

    QUnit.test('method do not collects object if area is outside', function (assert) {
      var rect1 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
      var rect2 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 10 });
      var rect3 = new fabric.Rect({ width: 10, height: 10, top: 10, left: 0 });
      var rect4 = new fabric.Rect({ width: 10, height: 10, top: 10, left: 10 });
      collection.add(rect1, rect2, rect3, rect4);
      var collected = collection.collectObjects({
        left: 24,
        top: 24,
        width: 1,
        height: 1
      });
      assert.equal(collected.length, 0, 'a rect outside objects do not collect any of them');
    });

    QUnit.test('method collect included objects that are not touched by the selection sides', function (assert) {
      var rect1 = new fabric.Rect({ width: 10, height: 10, top: 5, left: 5 });
      collection.add(rect1);
      var collected = collection.collectObjects({
        left: 1,
        top: 1,
        width: 20,
        height: 20
      });
      assert.equal(collected.length, 1, 'a rect that contains all objects collects them all');
      assert.equal(collected[0], rect1, 'rect1 is collected');
    });

    QUnit.test('method collect topmost object if no dragging occurs', function (assert) {
      var rect1 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
      var rect2 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
      var rect3 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
      collection.add(rect1, rect2, rect3);
      var collected = collection.collectObjects({
        left: 1,
        top: 1,
        width: 0,
        height: 0
      });
      assert.equal(collected.length, 3, 'a rect that contains all objects collects them all');
    });



    QUnit.test('method collect objects if the drag is inside the object', function (assert) {
      var rect1 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
      var rect2 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
      var rect3 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
      collection.add(rect1, rect2, rect3);
      var collected = collection.collectObjects({
        left: 1,
        top: 1,
        width: 2,
        height: 2
      });;
      assert.equal(collected.length, 3, 'a rect that contains all objects collects them all');
      assert.equal(collected[0], rect3, 'rect3 is collected');
      assert.equal(collected[1], rect2, 'rect2 is collected');
      assert.equal(collected[2], rect1, 'rect1 is collected');
    });

    QUnit.test('method collects object fully contained in area', function (assert) {
      var rect1 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
      var rect2 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 10 });
      var rect3 = new fabric.Rect({ width: 10, height: 10, top: 10, left: 0 });
      var rect4 = new fabric.Rect({ width: 10, height: 10, top: 10, left: 10 });
      collection.add(rect1, rect2, rect3, rect4);
      var collected = collection.collectObjects({
        left: -1,
        top: -1,
        width: 30,
        height: 30
      }, { includeIntersecting: false });
      assert.equal(collected.length, 4, 'a rect that contains all objects collects them all');
      assert.equal(collected[3], rect1, 'contains rect1 as last object');
      assert.equal(collected[2], rect2, 'contains rect2');
      assert.equal(collected[1], rect3, 'contains rect3');
      assert.equal(collected[0], rect4, 'contains rect4 as first object');
    });

    QUnit.test('method does not collect objects not fully contained', function (assert) {
      var rect1 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
      var rect2 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 10 });
      var rect3 = new fabric.Rect({ width: 10, height: 10, top: 10, left: 0 });
      var rect4 = new fabric.Rect({ width: 10, height: 10, top: 10, left: 10 });
      collection.add(rect1, rect2, rect3, rect4);
      var collected = collection.collectObjects({
        left: 5,
        top: 5,
        width: 20,
        height: 20
      }, { includeIntersecting: false });
      assert.equal(collected.length, 1, 'a rect intersecting objects does not collect those');
      assert.equal(collected[0], rect4, 'contains rect1 as only one fully contained');
    });
  });
    
  });
})();
