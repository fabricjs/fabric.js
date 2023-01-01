(function(){

  QUnit.module('fabric.stateful');
  QUnit.test('hasStateChanged', function(assert) {
    var cObj = new fabric.Object();
    assert.ok(typeof cObj.hasStateChanged === 'function');
    cObj.saveState();
    assert.ok(!cObj.hasStateChanged(), 'state should not be changed');
    cObj.saveState();
    cObj.set('left', 123).set('top', 456);
    assert.ok(cObj.hasStateChanged(), 'state should be changed now');
  });

  QUnit.test('saveState', function(assert) {
    var cObj = new fabric.Object();
    assert.ok(typeof cObj.saveState === 'function');
    cObj.saveState();
    assert.equal(cObj.saveState(), cObj, 'chainable');
    cObj.set('left', 123).set('top', 456);
    cObj.saveState();
    cObj.set('left', 223).set('top', 556);
    assert.equal(cObj._stateProperties.left, 123);
    assert.equal(cObj._stateProperties.top, 456);
  });

  QUnit.test('saveState with array', function(assert) {
    var cObj = new fabric.Text('Hello');
    cObj.set('strokeDashArray', [0, 4]);
    cObj.saveState();
    //equal(cObj.underline, cObj._stateProperties.underline, 'textDecoration in state is deepEqual');
    //notEqual(cObj.textDecoration, cObj._stateProperties.textDecoration, 'textDecoration in not same Object');
    cObj.strokeDashArray[0] = 2;
    assert.ok(cObj.hasStateChanged(), 'hasStateChanged detects changes in nested props');

    cObj.saveState();
    cObj.strokeDashArray[2] = 2;
    assert.ok(cObj.hasStateChanged(), 'more properties added');
  });

  QUnit.test('saveState with array to null', function(assert) {
    var cObj = new fabric.Text('Hello');
    cObj.set('strokeDashArray', [0, 4]);
    cObj.saveState();
    //equal(cObj.underline, cObj._stateProperties.underline, 'textDecoration in state is deepEqual');
    //notEqual(cObj.textDecoration, cObj._stateProperties.textDecoration, 'textDecoration in not same Object');
    cObj.strokeDashArray = null;
    assert.ok(cObj.hasStateChanged(), 'hasStateChanged detects changes in array without throwing');

    cObj.saveState();
    cObj.strokeDashArray = [2, 3];
    assert.ok(cObj.hasStateChanged(), 'back to array');
  });

  QUnit.test('saveState with fabric class gradient', function(assert) {
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
    cObj.saveState();
    cObj.set('fill', gradient);
    assert.ok(cObj.hasStateChanged(), 'hasStateChanged detects changes in nested props');
    cObj.saveState();
    gradient.type = 'radial';
    assert.ok(cObj.hasStateChanged(), 'hasStateChanged detects changes in nested props on first level of nesting');
    cObj.saveState();
    gradient.coords.x1 = 3;
    assert.ok(cObj.hasStateChanged(), 'hasStateChanged detects changes in nested props on second level of nesting');
    cObj.saveState();
    gradient.colorStops[0].color = 'blue';
    assert.ok(cObj.hasStateChanged(), 'hasStateChanged detects changes in nested props on third level of nesting');
  });

  QUnit.test('saveState with fabric class gradient to other types', function(assert) {
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

    cObj.set('fill', gradient);
    cObj.saveState();
    cObj.set('fill', 'red');
    assert.ok(cObj.hasStateChanged(), 'hasStateChanged detects changes in object to string without throwing');
    cObj.saveState();
    cObj.set('fill', gradient);
    assert.ok(cObj.hasStateChanged(), 'back to gradient');
    cObj.saveState();
    cObj.set('fill', null);
    assert.ok(cObj.hasStateChanged(), 'hasStateChanged detects changes in object to null without throwing');
  });

  QUnit.test('savestate with custom property set', function(assert) {
    var cObj = new fabric.Object();
    cObj.myProperties = ['a', 'b'];
    cObj.a = 1;
    cObj.b = 3;
    cObj.saveState();
    assert.ok(!cObj._myProperties, 'custom properties set does not exist');
    cObj.saveState({ propertySet: 'myProperties' });
    assert.ok(cObj._myProperties.a, 'a has been added in the custom property set');
    cObj.left = 33;
    assert.ok(cObj.hasStateChanged(), 'state has changed');
    assert.ok(!cObj.hasStateChanged('myProperties'), 'custom state has not changed');
    cObj.a = 2;
    assert.ok(cObj.hasStateChanged('myProperties'), 'custom state has changed');
  });
})();
