(function() {

  var collection = fabric.Collection;
  var collection2 = fabric.util.object.clone(collection);

  QUnit.module('fabric.Collection', {
    beforeEach: function() {
      collection._objects = [];
      collection2._objects = [];
    }
  });

  QUnit.test('add', function(assert) {
    var obj = { prop: 4 }, fired = 0;
    assert.ok(typeof collection.add === 'function', 'has add method');
    assert.deepEqual(collection._objects, [], 'start with empty array of items');
    collection.add([obj], cb);
    assert.equal(collection._objects[0], obj, 'add object in the array');
    assert.equal(fired, 0, 'fired is 0');
    var cb = function () {
      fired++;
    };
    collection.add([obj], cb);
    assert.equal(collection._objects[1], obj, 'add object in the array');
    assert.equal(fired, 1, 'fired is incremented due to callback');
    collection.add([obj], cb);
    assert.equal(collection._objects.length, 3, 'we have 3 objects in collection');
    fired = 0;
    collection.add([obj, obj, obj, obj], cb);
    assert.equal(fired, 4, 'fired is incremented for every object added');
    assert.equal(collection._objects.length, 7, 'all objects have been added');
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
        fired = [],
        firingControl = [];

    collection.add([rect1, rect2]);
    control.push(rect1, rect2);

    assert.ok(typeof collection.insertAt === 'function', 'should respond to `insertAt` method');

    const equalsControl = () => {
      assert.deepEqual(collection.getObjects().map(o => o.id), control.map(o => o.id), 'should equal control array');
      assert.deepEqual(collection.getObjects(), control, 'should equal control array');
      assert.deepEqual(fired.map(o => o.id), firingControl.map(o => o.id), 'fired events should equal control array');
      assert.deepEqual(fired, firingControl, 'fired events should equal control array');
    }

    assert.ok(typeof collection._onObjectAdded === 'undefined', 'do not have a standard _onObjectAdded method');
    var cb = function (object) {
      fired.push(object);
    };

    collection.insertAt(rect3, 1, cb);
    control.splice(1, 0, rect3);
    firingControl.push(rect3);
    equalsControl();
    collection.insertAt(rect4, 0, cb);
    control.splice(0, 0, rect4);
    firingControl.push(rect4);
    equalsControl();
    collection.insertAt(rect5, 2, cb);
    control.splice(2, 0, rect5);
    firingControl.push(rect5);
    equalsControl();
    collection.insertAt([rect6], 2, cb);
    control.splice(2, 0, rect6);
    firingControl.push(rect6);
    equalsControl();
    collection.insertAt([rect7, rect8], 3, cb);
    control.splice(3, 0, rect7, rect8);
    firingControl.push(rect7, rect8);
    equalsControl();
    //  insert duplicates
    collection.insertAt([rect1, rect2], 2, cb);
    control.splice(2, 0, rect1, rect2);
    firingControl.push(rect1, rect2);
    equalsControl();
  });

  QUnit.test('remove', function(assert) {
    var obj = { prop: 4 }, obj2 = { prop: 2 }, obj3 = { prop: 3 }, fired = 0;
    collection.add([{ prop: 0 }, {prop: 1}, obj2, obj, obj3]);
    var previousLength = collection._objects.length;
    assert.ok(typeof collection.remove === 'function', 'has remove method');
    var returned = collection.remove([obj]);
    assert.ok(returned, 'removed obj');
    assert.ok(Array.isArray(collection.remove([])), 'should return empty array');
    assert.equal(collection.remove([{ prop: 'foo' }]).length, 0, 'nothing removed');
    assert.equal(collection._objects.indexOf(obj), -1, 'obj is no more in array');
    assert.equal(collection._objects.length, previousLength - 1, 'length has changed');
    assert.equal(fired, 0, 'fired is 0');
    var callback = function() {
      fired++;
    };
    var removed = collection.remove([obj2], callback);
    assert.equal(fired, 1, 'fired is incremented if there is a callback');
    assert.deepEqual(removed, [obj2], 'should return removed objects');
    removed = collection.remove([obj2], callback);
    assert.deepEqual(removed, [], 'should return removed objects');
    assert.equal(fired, 1, 'fired is not incremented again if there is no object to remove');

    collection.add([obj2]);
    collection.add([obj]);
    collection.remove([obj2], callback);
    previousLength = collection._objects.length;
    fired = 0;
    removed = collection.remove([obj, obj3, obj2], callback);
    assert.deepEqual(removed, [obj, obj3], 'should return removed objects');
    assert.equal(collection._objects.length, previousLength - 2, 'we have 2 objects less');
    assert.equal(fired, 2, 'fired is incremented for every object removed');
  });

  QUnit.test('forEachObject', function(assert) {
    var obj = { prop: false }, obj2 = { prop: false }, obj3 = { prop: false }, fired = 0;
    collection.add([obj2, obj, obj3]);
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

  QUnit.test('getObjects', function(assert) {
    var obj = { type: 'a' }, obj2 = { type: 'b' }, obj3 = { type: 'c' };
    collection.add([obj2, obj, obj3]);
    assert.ok(typeof collection.getObjects === 'function', 'has getObjects method');
    var returned = collection.getObjects();
    assert.notEqual(returned, collection._objects, 'does not return a reference to _objects');
    returned = collection.getObjects('a');
    assert.notEqual(returned, collection._objects, 'return a new array');
    assert.equal(returned.indexOf(obj2), -1, 'object of type B is not included');
    assert.equal(returned.indexOf(obj), 0, 'object of type A is included');
    returned = collection.getObjects('a', 'b');
    assert.ok(returned.indexOf(obj2) > -1, 'object of type B is not included');
    assert.ok(returned.indexOf(obj) > -1, 'object of type A is included');
    assert.ok(returned.indexOf(obj3) === -1, 'object of type c is included');
    assert.equal(returned.length, 2, 'returned only a, b types');
  });

  QUnit.test('item', function(assert) {
    var obj = { type: 'a' }, obj2 = { type: 'b' }, index = 1;
    collection.add([obj2, obj]);
    assert.ok(typeof collection.item === 'function', 'has item method');
    var returned = collection.item(index);
    assert.equal(returned, collection._objects[index], 'return the object at index');
  });

  QUnit.test('isEmpty', function(assert) {
    var obj = { type: 'a' }, obj2 = { type: 'b' };
    assert.ok(typeof collection.isEmpty === 'function', 'has isEmpty method');
    var returned = collection.isEmpty();
    assert.equal(returned, true, 'collection is empty');
    collection.add([obj2, obj]);
    returned = collection.isEmpty();
    assert.equal(returned, false, 'collection is not empty');
  });

  QUnit.test('size', function(assert) {
    var obj = { type: 'a' }, obj2 = { type: 'b' };
    assert.ok(typeof collection.size === 'function', 'has size method');
    var returned = collection.size();
    assert.ok(typeof returned === 'number', 'returns a number');
    assert.equal(returned, 0, 'collection is empty');
    collection.add([obj2, obj]);
    returned = collection.size();
    assert.equal(returned, 2, 'collection has 2 objects');
  });

  QUnit.test('contains', function(assert) {
    var obj = { type: 'a' };
    assert.ok(typeof collection.contains === 'function', 'has contains method');
    var returned = collection.contains(obj);
    assert.ok(typeof returned === 'boolean', 'returns a boolean');
    assert.equal(returned, false, 'collection is empty so does not contains obj');
    collection.add([obj]);
    returned = collection.contains(obj);
    assert.equal(returned, true, 'collection contains obj');
    var obj2 = { type: 'b' };
    collection2.add([obj2]);
    collection.add([collection2]);
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
    collection.add([obj2, obj]);
    returned = collection.complexity();
    assert.equal(returned, 0, 'collection has complexity 0 if objects have no complexity themselves');
    var complexObject = { complexity: function() { return 9; }};
    var complexObject2 = { complexity: function() { return 10; }};
    collection.add([complexObject, complexObject2]);
    returned = collection.complexity();
    assert.equal(returned, 19, 'collection has complexity 9 + 10');
  });
})();
