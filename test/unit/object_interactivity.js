(function() {

  QUnit.module('fabric.ObjectInteractivity');

  test('isControlVisible', function(){
    ok(fabric.Object);

    var cObj = new fabric.Object({ });
    ok(typeof cObj.isControlVisible == 'function', 'isControlVisible should exist');

    equal(cObj.isControlVisible('tl'), true);
    equal(cObj.isControlVisible('tr'), true);
    equal(cObj.isControlVisible('br'), true);
    equal(cObj.isControlVisible('bl'), true);
    equal(cObj.isControlVisible('ml'), true);
    equal(cObj.isControlVisible('mt'), true);
    equal(cObj.isControlVisible('mr'), true);
    equal(cObj.isControlVisible('mb'), true);
    equal(cObj.isControlVisible('mtr'), true);
  });

  test('setControlVisible', function(){
    ok(fabric.Object);

    var cObj = new fabric.Object({ });
    ok(typeof cObj.setControlVisible == 'function', 'setControlVisible should exist');
    equal(cObj.setControlVisible('tl'), cObj, 'chainable');

    cObj.setControlVisible('tl', false);
    equal(cObj.isControlVisible('tl'), false);
    cObj.setControlVisible('tl', true);
    equal(cObj.isControlVisible('tl'), true);
  });

  test('setControlsVisibility', function(){
    ok(fabric.Object);

    var cObj = new fabric.Object({ });
    ok(typeof cObj.setControlsVisibility == 'function', 'setControlsVisibility should exist');
    equal(cObj.setControlsVisibility(), cObj, 'chainable');

    cObj.setControlsVisibility({
      bl: false,
      br: false,
      mb: false,
      ml: false,
      mr: false,
      mt: false,
      tl: false,
      tr: false,
      mtr: false
    });

    equal(cObj.isControlVisible('tl'), false);
    equal(cObj.isControlVisible('tr'), false);
    equal(cObj.isControlVisible('br'), false);
    equal(cObj.isControlVisible('bl'), false);
    equal(cObj.isControlVisible('ml'), false);
    equal(cObj.isControlVisible('mt'), false);
    equal(cObj.isControlVisible('mr'), false);
    equal(cObj.isControlVisible('mb'), false);
    equal(cObj.isControlVisible('mtr'), false);

    cObj.setControlsVisibility({
      bl: true,
      br: true,
      mb: true,
      ml: true,
      mr: true,
      mt: true,
      tl: true,
      tr: true,
      mtr: true
    });

    equal(cObj.isControlVisible('tl'), true);
    equal(cObj.isControlVisible('tr'), true);
    equal(cObj.isControlVisible('br'), true);
    equal(cObj.isControlVisible('bl'), true);
    equal(cObj.isControlVisible('ml'), true);
    equal(cObj.isControlVisible('mt'), true);
    equal(cObj.isControlVisible('mr'), true);
    equal(cObj.isControlVisible('mb'), true);
    equal(cObj.isControlVisible('mtr'), true);
  });

})();
