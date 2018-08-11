(function() {

  var collection = fabric.Collection;

  QUnit.module('fabric.Collection', {
    beforeEach: function() {
      collection.rendered = 0;
      collection._objects = [];
      delete collection.renderOnAddRemove;
      delete collection._onObjectAdded;
      delete collection._onObjectRemoved;
    }
  });

  collection.requestRenderAll = function() {
    this.rendered++;
  };

  QUnit.test('add', function(assert) {
    var obj = { prop: 4 }, fired = 0;
    assert.ok(typeof collection.add === 'function', 'has add method');
    assert.deepEqual(collection._objects, [], 'start with empty array of items');
    var returned = collection.add(obj);
    assert.equal(returned, collection, 'is chainable');
    assert.equal(collection._objects[0], obj, 'add object in the array');
    assert.equal(fired, 0, 'fired is 0');

    collection._onObjectAdded = function() {
      fired++;
    };
    collection.add(obj);
    assert.equal(collection._objects[1], obj, 'add object in the array');
    assert.equal(fired, 1, 'fired is incremented if there is a _onObjectAddded');
    collection.renderOnAddRemove = true;
    assert.equal(collection.rendered, 0, 'this.renderAll has not been called');
    collection.add(obj);
    assert.equal(collection.rendered, 1, 'this.renderAll has been called');
    assert.equal(collection._objects.length, 3, 'we have 3 objects in collection');
    fired = 0;
    collection.add(obj, obj, obj, obj);
    assert.equal(fired, 4, 'fired is incremented for every object added');
    assert.equal(collection._objects.length, 7, 'all objects have been added');
    assert.equal(collection.rendered, 2, 'this.renderAll has been called just once more');
  });

  QUnit.test('insertAt', function(assert) {
    var obj = { prop: 4 }, fired = 0, index = 1, nonSplicing = false;
    collection._objects = [{ prop: 0 }, {prop: 1}];
    assert.ok(typeof collection.insertAt === 'function', 'has insertAdd method');
    var previousObject = collection._objects[index];
    var previousLenght = collection._objects.length;
    collection.insertAt(obj, index, nonSplicing);
    assert.equal(collection._objects[index], obj, 'add object in the array at specified index');
    assert.equal(collection._objects[index + 1], previousObject, 'add old object in the array at next index');
    assert.equal(collection._objects.length, previousLenght + 1, 'length is incremented');

    nonSplicing = true;
    previousLenght = collection._objects.length;
    var newObject = { prop: 5 };
    previousObject = collection._objects[index];
    var returned = collection.insertAt(newObject, index, nonSplicing);
    assert.equal(returned, collection, 'is chainable');
    assert.equal(collection._objects[index], newObject, 'add newobject in the array at specified index');
    assert.notEqual(collection._objects[index + 1], previousObject, 'old object is not in the array at next index');
    assert.equal(collection._objects.indexOf(previousObject), -1, 'old object is no more in array');
    assert.equal(collection._objects.length, previousLenght, 'length is not incremented');
    assert.ok(typeof collection._onObjectAdded === 'undefined', 'do not have a standard _onObjectAdded method');
    assert.equal(fired, 0, 'fired is 0');
    collection._onObjectAdded = function() {
      fired++;
    };
    collection.insertAt(obj, 1);
    assert.equal(fired, 1, 'fired is incremented if there is a _onObjectAddded');
    collection.renderOnAddRemove = true;
    collection.insertAt(obj, 1);
    assert.equal(collection.rendered, 1, 'this.renderAll has been called');
  });

  QUnit.test('remove', function(assert) {
    var obj = { prop: 4 }, obj2 = { prop: 2 }, obj3 = { prop: 3 }, fired = 0;
    collection.add({ prop: 0 }, {prop: 1}, obj2, obj, obj3);
    var previousLenght = collection._objects.length;
    assert.ok(typeof collection.remove === 'function', 'has remove method');
    var returned = collection.remove(obj);
    assert.equal(returned, collection, 'is chainable');
    assert.equal(collection._objects.indexOf(obj), -1, 'obj is no more in array');
    assert.equal(collection._objects.length, previousLenght - 1, 'length has changed');
    assert.equal(fired, 0, 'fired is 0');
    collection._onObjectRemoved = function() {
      fired++;
    };
    collection.remove(obj2);
    assert.equal(fired, 1, 'fired is incremented if there is a _onObjectAddded');
    collection.remove(obj2);
    assert.equal(fired, 1, 'fired is not incremented again if there is no object to remove');

    collection.add(obj2);
    collection.add(obj);
    collection.renderOnAddRemove = true;
    assert.equal(collection.rendered, 0, 'this.renderAll has not been called');
    collection.remove(obj2);
    assert.equal(collection.rendered, 1, 'this.renderAll has been called');
    previousLenght = collection._objects.length;
    fired = 0;
    collection.remove(obj, obj3);
    assert.equal(collection._objects.length, previousLenght - 2, 'we have 2 objects less');
    assert.equal(fired, 2, 'fired is incremented for every object removed');
    assert.equal(collection.rendered, 2, 'this.renderAll has been called just once more');
  });

  QUnit.test('forEachObject', function(assert) {
    var obj = { prop: false }, obj2 = { prop: false }, obj3 = { prop: false }, fired = 0;
    collection.add(obj2, obj, obj3);
    assert.ok(typeof collection.forEachObject === 'function', 'has forEachObject method');
    var callback = function(_obj) {
      _obj.prop = true;
      fired++;
    };
    var returned = collection.forEachObject(callback);
    assert.equal(returned, collection, 'is chainable');
    assert.equal(fired, collection._objects.length, 'fired once for every object');
    assert.equal(obj.prop, true, 'fired for obj');
    assert.equal(obj2.prop, true, 'fired for obj2');
    assert.equal(obj3.prop, true, 'fired for obj3');
  });

  QUnit.test('getObjects', function(assert) {
    var obj = { type: 'a' }, obj2 = { type: 'b' };
    collection.add(obj2, obj);
    assert.ok(typeof collection.getObjects === 'function', 'has getObjects method');
    var returned = collection.getObjects();
    assert.notEqual(returned, collection._objects, 'does not return a reference to _objects');
    returned = collection.getObjects('a');
    assert.notEqual(returned, collection._objects, 'return a new array');
    assert.equal(returned.indexOf(obj2), -1, 'object of type B is not included');
    assert.equal(returned.indexOf(obj), 0, 'object of type A is included');
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
    assert.equal(returned, true, 'collection contais obj');
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
})();
