(function() {

  var collection = fabric.Collection;

  QUnit.module('fabric.Collection', {
    setup: function() {
      collection.rendered = 0;
      collection._objects = [];
      delete collection.renderOnAddRemove;
      delete collection._onObjectAdded;
      delete collection._onObjectRemoved;
    }
  });

  collection.renderAll = function() {
    this.rendered++;
  };

  test('add', function() {
    var obj = { prop: 4 }, fired = 0;
    ok(typeof collection.add === 'function', 'has add method');
    deepEqual(collection._objects, [], 'start with empty array of items');
    var returned = collection.add(obj);
    equal(returned, collection, 'is chainable');
    equal(collection._objects[0], obj, 'add object in the array');
    equal(fired, 0, 'fired is 0');

    collection._onObjectAdded = function() {
      fired++;
    };
    collection.add(obj);
    equal(collection._objects[1], obj, 'add object in the array');
    equal(fired, 1, 'fired is incremented if there is a _onObjectAddded');
    collection.renderOnAddRemove = true;
    equal(collection.rendered, 0, 'this.renderAll has not been called');
    collection.add(obj);
    equal(collection.rendered, 1, 'this.renderAll has been called');
    equal(collection._objects.length, 3, 'we have 3 objects in collection');
    fired = 0;
    collection.add(obj, obj, obj, obj);
    equal(fired, 4, 'fired is incremented for every object added');
    equal(collection._objects.length, 7, 'all objects have been added');
    equal(collection.rendered, 2, 'this.renderAll has been called just once more');
  });

  test('insertAt', function() {
    var obj = { prop: 4 }, fired = 0, index = 1, nonSplicing = false;
    collection._objects = [{ prop: 0 }, {prop: 1}];
    ok(typeof collection.insertAt === 'function', 'has insertAdd method');
    var previousObject = collection._objects[index];
    var previousLenght = collection._objects.length;
    collection.insertAt(obj, index, nonSplicing);
    equal(collection._objects[index], obj, 'add object in the array at specified index');
    equal(collection._objects[index + 1], previousObject, 'add old object in the array at next index');
    equal(collection._objects.length, previousLenght + 1, 'length is incremented');

    nonSplicing = true;
    previousLenght = collection._objects.length;
    var newObject = { prop: 5 };
    previousObject = collection._objects[index];
    var returned = collection.insertAt(newObject, index, nonSplicing);
    equal(returned, collection, 'is chainable');
    equal(collection._objects[index], newObject, 'add newobject in the array at specified index');
    notEqual(collection._objects[index + 1], previousObject, 'old object is not in the array at next index');
    equal(collection._objects.indexOf(previousObject), -1, 'old object is no more in array');
    equal(collection._objects.length, previousLenght, 'length is not incremented');
    ok(typeof collection._onObjectAdded === 'undefined', 'do not have a standard _onObjectAdded method');
    equal(fired, 0, 'fired is 0');
    collection._onObjectAdded = function() {
      fired++;
    };
    collection.insertAt(obj, 1);
    equal(fired, 1, 'fired is incremented if there is a _onObjectAddded');
    collection.renderOnAddRemove = true;
    collection.insertAt(obj, 1);
    equal(collection.rendered, 1, 'this.renderAll has been called');
  });

  test('remove', function() {
    var obj = { prop: 4 }, obj2 = { prop: 2 }, obj3 = { prop: 3 }, fired = 0;
    collection.add({ prop: 0 }, {prop: 1}, obj2, obj, obj3);
    var previousLenght = collection._objects.length;
    ok(typeof collection.remove === 'function', 'has remove method');
    var returned = collection.remove(obj);
    equal(returned, collection, 'is chainable');
    equal(collection._objects.indexOf(obj), -1, 'obj is no more in array');
    equal(collection._objects.length, previousLenght - 1, 'length has changed');
    equal(fired, 0, 'fired is 0');
    collection._onObjectRemoved = function() {
      fired++;
    };
    collection.remove(obj2);
    equal(fired, 1, 'fired is incremented if there is a _onObjectAddded');
    collection.remove(obj2);
    equal(fired, 1, 'fired is not incremented again if there is no object to remove');

    collection.add(obj2);
    collection.add(obj);
    collection.renderOnAddRemove = true;
    equal(collection.rendered, 0, 'this.renderAll has not been called');
    collection.remove(obj2);
    equal(collection.rendered, 1, 'this.renderAll has been called');
    previousLenght = collection._objects.length;
    fired = 0;
    collection.remove(obj, obj3);
    equal(collection._objects.length, previousLenght - 2, 'we have 2 objects less');
    equal(fired, 2, 'fired is incremented for every object removed');
    equal(collection.rendered, 2, 'this.renderAll has been called just once more');
  });

  test('forEachObject', function() {
    var obj = { prop: false }, obj2 = { prop: false }, obj3 = { prop: false }, fired = 0;
    collection.add(obj2, obj, obj3);
    ok(typeof collection.forEachObject === 'function', 'has forEachObject method');
    var callback = function(_obj) {
      _obj.prop = true;
      fired++;
    };
    var returned = collection.forEachObject(callback);
    equal(returned, collection, 'is chainable');
    equal(fired, collection._objects.length, 'fired once for every object');
    equal(obj.prop, true, 'fired for obj');
    equal(obj2.prop, true, 'fired for obj2');
    equal(obj3.prop, true, 'fired for obj3');
  });

  test('getObjects', function() {
    var obj = { type: 'a' }, obj2 = { type: 'b' };
    collection.add(obj2, obj);
    ok(typeof collection.getObjects === 'function', 'has getObjects method');
    var returned = collection.getObjects();
    equal(returned, collection._objects, 'return the _objects array directly');
    returned = collection.getObjects('a');
    notEqual(returned, collection._objects, 'return a new array');
    equal(returned.indexOf(obj2), -1, 'object of type B is not included');
    equal(returned.indexOf(obj), 0, 'object of type A is included');
  });

  test('item', function() {
    var obj = { type: 'a' }, obj2 = { type: 'b' }, index = 1;
    collection.add(obj2, obj);
    ok(typeof collection.item === 'function', 'has item method');
    var returned = collection.item(index);
    equal(returned, collection._objects[index], 'return the object at index');
  });

  test('isEmpty', function() {
    var obj = { type: 'a' }, obj2 = { type: 'b' };
    ok(typeof collection.isEmpty === 'function', 'has isEmpty method');
    var returned = collection.isEmpty();
    equal(returned, true, 'collection is empty');
    collection.add(obj2, obj);
    returned = collection.isEmpty();
    equal(returned, false, 'collection is not empty');
  });

  test('size', function() {
    var obj = { type: 'a' }, obj2 = { type: 'b' };
    ok(typeof collection.size === 'function', 'has size method');
    var returned = collection.size();
    ok(typeof returned === 'number', 'returns a number');
    equal(returned, 0, 'collection is empty');
    collection.add(obj2, obj);
    returned = collection.size();
    equal(returned, 2, 'collection has 2 objects');
  });

  test('contains', function() {
    var obj = { type: 'a' };
    ok(typeof collection.contains === 'function', 'has contains method');
    var returned = collection.contains(obj);
    ok(typeof returned === 'boolean', 'returns a boolean');
    equal(returned, false, 'collection is empty so does not contains obj');
    collection.add(obj);
    returned = collection.contains(obj);
    equal(returned, true, 'collection contais obj');
  });

  test('complexity', function() {
    var obj = { type: 'a' }, obj2 = { type: 'b' };
    ok(typeof collection.complexity === 'function', 'has complexity method');
    var returned = collection.complexity();
    ok(typeof returned === 'number', 'returns a number');
    equal(returned, 0, 'collection has complexity 0');
    collection.add(obj2, obj);
    returned = collection.complexity();
    equal(returned, 0, 'collection has complexity 0 if objects have no complexity themselves');
    var complexObject = { complexity: function() { return 9; }};
    var complexObject2 = { complexity: function() { return 10; }};
    collection.add(complexObject, complexObject2);
    returned = collection.complexity();
    equal(returned, 19, 'collection has complexity 9 + 10');
  });
})();
