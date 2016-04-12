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
  equal(eventFired, true);
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
  equal(eventFired, false);
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
  equal(eventFired, false);
  equal(event2Fired, false);

  foo.on('bar:baz', handler);
  foo.on('bar:baz', handler2);

  foo.stopObserving({'bar:baz': null});

  foo.fire('bar:baz');
  equal(eventFired, false);
  equal(event2Fired, false);
});

test('stopObserving multiple handlers', function() {
  var foo = { };
  fabric.util.object.extend(foo, fabric.Observable);

  var eventFired = false, event2Fired = false;

  var handler = function() {
    eventFired = true;
  };
  var handler2 = function() {
    event2Fired = true;
  };
  foo.on({'bar:baz': handler, 'blah:blah': handler2});

  foo.stopObserving({'bar:baz': handler, 'blah:blah': handler2});

  foo.fire('bar:baz');
  equal(eventFired, false);
  foo.fire('blah:blah');
  equal(event2Fired, false);
});

test('stopObserving all events', function() {
  var foo = { };
  fabric.util.object.extend(foo, fabric.Observable);

  var eventFired = false, event2Fired = false;

  var handler = function() {
    eventFired = true;
  };
  var handler2 = function() {
    event2Fired = true;
  };
  foo.on({'bar:baz': handler, 'blah:blah': handler2});

  foo.stopObserving();

  foo.fire('bar:baz');
  equal(eventFired, false);
  foo.fire('blah:blah');
  equal(event2Fired, false);
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

  equal(barBazFired, true);
  equal(blahBlahFired, true);
  equal(mooFired, true);
});

test('event options', function() {
  var foo = { };
  fabric.util.object.extend(foo, fabric.Observable);

  var someValue;
  foo.on('foo:bar', function(e) {
    someValue = e.value;
  });

  foo.fire('foo:bar', { value: 'sekret' });

  equal(someValue, 'sekret');
});

test('trigger', function() {
  var foo = { };
  fabric.util.object.extend(foo, fabric.Observable);

  var eventFired = false;
  var context;
  foo.on('bar:baz', function() {
    context = this;
    eventFired = true;
  });

  foo.trigger('bar:baz');
  equal(eventFired, true);
  equal(context, foo);
});

test('removal of past events', function() {
  var foo = { },
      event1Fired = false, event2Fired = false,
      event3Fired = false, event4Fired = false,
      handler1 = function() {
        event1Fired = true;
        foo.off('bar:baz', handler1);
      },
      handler2 = function() {
        event2Fired = true;
      },
      handler3 = function() {
        event3Fired = true;
      },
      handler4 = function() {
        event4Fired = true;
      };

  fabric.util.object.extend(foo, fabric.Observable);
  foo.on('bar:baz', handler1);
  foo.on('bar:baz', handler2);
  foo.on('bar:baz', handler3);
  foo.on('bar:baz', handler4);
  foo.trigger('bar:baz');
  equal(event1Fired, true, 'Event 1 should fire');
  equal(event2Fired, true, 'Event 2 should fire');
  equal(event3Fired, true, 'Event 3 should fire');
  equal(event4Fired, true, 'Event 4 should fire');
});

test('adding events', function() {
  var foo = { },
      event1Fired = false, event2Fired = false,
      event3Fired = false, event4Fired = false,
      handler1 = function() {
        event1Fired = true;
        foo.off('bar:baz', handler1);
        foo.on('bar:baz', handler3);
        foo.on('bar:baz', handler4);
      },
      handler2 = function() {
        event2Fired = true;
      },
      handler3 = function() {
        event3Fired = true;
      },
      handler4 = function() {
        event4Fired = true;
      };

  fabric.util.object.extend(foo, fabric.Observable);
  foo.on('bar:baz', handler1);
  foo.on('bar:baz', handler2);
  foo.trigger('bar:baz');
  equal(event1Fired, true, 'Event 1 should fire');
  equal(event2Fired, true, 'Event 2 should fire');
  equal(event3Fired, false, 'Event 3 should not fire');
  equal(event4Fired, false, 'Event 4 should not fire');
});


test('chaining', function() {
  var foo = { };
  fabric.util.object.extend(foo, fabric.Observable);

  var event1Fired = false, event2Fired = false;
  foo
    .on('event1', function() {
      event1Fired = true;
    })
    .on('event2', function() {
      event2Fired = true;
    });

  foo.trigger('event2').trigger('event1');

  equal(event1Fired, true);
  equal(event2Fired, true);

  event1Fired = false;
  event2Fired = false;

  foo.off('event1').off('event2');
  foo.trigger('event2').trigger('event1');

  equal(event1Fired, false);
  equal(event2Fired, false);
});
