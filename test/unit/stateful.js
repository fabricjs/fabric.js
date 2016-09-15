(function(){

  QUnit.module('fabric.stateful');

  test('hasStateChanged', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.hasStateChanged == 'function');
    cObj.setupState();
    ok(!cObj.hasStateChanged(), 'state should not be changed');
    cObj.saveState();
    cObj.set('left', 123).set('top', 456);
    ok(cObj.hasStateChanged());
  });

  test('saveState', function() {
    var cObj = new fabric.Object();
    ok(typeof cObj.saveState == 'function');
    cObj.setupState();
    equal(cObj.saveState(), cObj, 'chainable');
    cObj.set('left', 123).set('top', 456);
    cObj.saveState();
    cObj.set('left', 223).set('top', 556);
    equal(cObj.originalState.left, 123);
    equal(cObj.originalState.top, 456);
  });

  test('saveState with extra props', function() {
    var cObj = new fabric.Object();
    cObj.prop1 = 'a';
    cObj.prop2 = 'b';
    cObj.left = 123;
    var extraProps = ['prop1', 'prop2'];
    var options = { stateProperties: extraProps };
    cObj.setupState(options);
    equal(cObj.originalState.prop1, 'a', 'it saves the extra props');
    equal(cObj.originalState.prop2, 'b', 'it saves the extra props');
    cObj.prop1 = 'c';
    ok(cObj.hasStateChanged(), 'it detects changes in extra props');
    equal(cObj.originalState.left, 123, 'normal props are still there');
  });

  test('saveState with array', function() {
    var cObj = new fabric.Text('Hello');
    cObj.set('textDecoration', ['underline']);
    cObj.setupState();
    deepEqual(cObj.textDecoration, cObj.originalState.textDecoration, 'textDecoration in state is deepEqual');
    notEqual(cObj.textDecoration, cObj.originalState.textDecoration, 'textDecoration in not same Object');
    cObj.textDecoration[0] = 'overline';
    ok(cObj.hasStateChanged(), 'hasStateChanged detects changes in nested props');

    cObj.set('textDecoration', ['overline', 'underline']);
    cObj.saveState();
    cObj.set('textDecoration', ['underline', 'overline']);
    ok(!cObj.hasStateChanged(), 'order does no matter');

    cObj.set('textDecoration', ['underline']);
    cObj.saveState();
    cObj.set('textDecoration', ['underline', 'overline']);
    ok(cObj.hasStateChanged(), 'more properties added');

    cObj.set('textDecoration', ['underline', 'overline']);
    cObj.saveState();
    cObj.set('textDecoration', ['overline']);
    ok(cObj.hasStateChanged(), 'less properties');
  });

  test('saveState with fabric class gradient', function() {
    var cObj = new fabric.Object();
    var gradient = new fabric.Gradient({
      type: 'linear',
      coords: {
        x1: 0,
        y1: 10,
        x2: 100,
        y2: 200,
      },
      colorStops: [
        { offset: 0, color: 'red', opacity: 0 },
        { offset: 1, color: 'green' }
      ]
    });

    cObj.set('fill', '#FF0000');
    cObj.setupState();
    cObj.setFill(gradient);
    ok(cObj.hasStateChanged(), 'hasStateChanged detects changes in nested props');
    cObj.saveState();
    gradient.type = 'radial';
    ok(cObj.hasStateChanged(), 'hasStateChanged detects changes in nested props on first level of nesting');
    cObj.saveState();
    gradient.coords.x1 = 3;
    ok(cObj.hasStateChanged(), 'hasStateChanged detects changes in nested props on second level of nesting');
    cObj.saveState();
    gradient.colorStops[0].color = 'blue';
    ok(cObj.hasStateChanged(), 'hasStateChanged detects changes in nested props on third level of nesting');
  });

})();
