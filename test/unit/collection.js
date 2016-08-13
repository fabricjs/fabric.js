(function() {

  QUnit.module('fabric.Collection');

  var collection = fabric.Collection;

  test('add', function() {
    var obj = { prop: 4 }, fired = 0;
    ok(typeof collection.add === 'function', 'has add method');
    deepEqual(collection._objects, [], 'start with empty array of items');
    collection.add(obj);
    equal(collection._objects[0], obj, 'add object in the array');
    ok(typeof collection._onObjectAdded === 'undefined', 'do not have a standard _onObjectAdded method');
    equal(fired, 0, 'fired is 0');

    collection._onObjectAdded = function() {
      fired++;
    };
    collection.add(obj);
    equal(collection._objects[1], obj, 'add object in the array');
    equal(fired, 1, 'fired is incremented if there is a _onObjectAddded');
    delete collection._onObjectAdded;
  });

})();
