QUnit.module('fabric.Observable');

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
  foo.on('bar:baz', function() {
    eventFired = true;
  });

  foo.fire('bar:baz');
  equal(true, eventFired);
});

test('stopObserving', function() {
  var foo = { };
  fabric.util.object.extend(foo, fabric.Observable);

  var eventFired = false;
  var handler = function() {
    eventFired = true;
  };
  foo.on('bar:baz', handler);
  foo.stopObserving('bar:baz', handler);

  foo.fire('bar:baz');
  equal(false, eventFired);
});

test('stopObserving without handler', function() {
  var foo = { };
  fabric.util.object.extend(foo, fabric.Observable);

  var eventFired = false, event2Fired = false;

  var handler = function() {
    eventFired = true;
  };
  var handler2 = function() {
    event2Fired = true;
  };
  foo.on('bar:baz', handler);
  foo.on('bar:baz', handler2);

  foo.stopObserving('bar:baz');

  foo.fire('bar:baz');
  equal(false, eventFired);
  equal(false, event2Fired);
});

test('observe multiple handlers', function() {
  var foo = { };
  fabric.util.object.extend(foo, fabric.Observable);

  var barBazFired = false;
  var blahBlahFired = false;
  var mooFired = false;

  foo.on({
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

  equal(true, barBazFired);
  equal(true, blahBlahFired);
  equal(true, mooFired);
});

test('event options', function() {
  var foo = { };
  fabric.util.object.extend(foo, fabric.Observable);

  var someValue;
  foo.on('foo:bar', function(e) {
    someValue = e.value;
  });

  foo.fire('foo:bar', { value: 'sekret' });

  equal('sekret', someValue);
});

test('trigger', function() {
  var foo = { };
  fabric.util.object.extend(foo, fabric.Observable);

  var eventFired = false;
  foo.on('bar:baz', function() {
    eventFired = true;
  });

  foo.trigger('bar:baz');
  equal(true, eventFired);
});