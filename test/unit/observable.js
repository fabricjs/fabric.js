module('fabric.Observable');

test('fabric.Observable exists', function() {
  ok(fabric.Observable);
  ok(fabric.Observable.fire);
  ok(fabric.Observable.observe);
  ok(fabric.Observable.stopObserving);
});

test('fire + observe', function() {
  var foo = { };
  fabric.util.object.extend(foo, fabric.Observable);

  var eventFired = false;
  foo.observe('bar:baz', function() {
    eventFired = true;
  });

  foo.fire('bar:baz');
  equals(true, eventFired);
});

test('stopObserving', function() {
  var foo = { };
  fabric.util.object.extend(foo, fabric.Observable);

  var eventFired = false;
  var handler = function() {
    eventFired = true;
  };
  foo.observe('bar:baz', handler);
  foo.stopObserving('bar:baz', handler);

  foo.fire('bar:baz');
  equals(false, eventFired);
});

test('observe multiple handlers', function() {
  var foo = { };
  fabric.util.object.extend(foo, fabric.Observable);

  var barBazFired = false;
  var blahBlahFired = false;
  var mooFired = false;

  foo.observe({
    'bar:baz': function() {
      barBazFired = true;
    },
    'blah:blah': function() {
      blahBlahFired = true;
    },
    'moo': function() {
      mooFired = true;
    }
  });

  foo.fire('bar:baz');
  foo.fire('blah:blah');
  foo.fire('moo');

  equals(true, barBazFired);
  equals(true, blahBlahFired);
  equals(true, mooFired);
});

test('event options', function() {
  var foo = { };
  fabric.util.object.extend(foo, fabric.Observable);

  var someValue;
  foo.observe('foo:bar', function(e) {
    someValue = e.value;
  });

  foo.fire('foo:bar', { value: 'sekret' });

  equals('sekret', someValue);
});