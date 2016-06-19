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

  test('_setCornerCoords', function(){
    var cObj = new fabric.Object({ top: 10, left: 10, width: 10, height: 10, strokeWidth: 0 });
    ok(typeof cObj._setCornerCoords == 'function', '_setCornerCoords should exist');
    cObj.setCoords();

    equal(cObj.oCoords.tl.corner.tl.x.toFixed(2), 3.5);
    equal(cObj.oCoords.tl.corner.tl.y.toFixed(2), 3.5);
    equal(cObj.oCoords.tl.corner.tr.x.toFixed(2), 16.5);
    equal(cObj.oCoords.tl.corner.tr.y.toFixed(2), 3.5);
    equal(cObj.oCoords.tl.corner.bl.x.toFixed(2), 3.5);
    equal(cObj.oCoords.tl.corner.bl.y.toFixed(2), 16.5);
    equal(cObj.oCoords.tl.corner.br.x.toFixed(2), 16.5);
    equal(cObj.oCoords.tl.corner.br.y.toFixed(2), 16.5);
    equal(cObj.oCoords.bl.corner.tl.x.toFixed(2), 3.5);
    equal(cObj.oCoords.bl.corner.tl.y.toFixed(2), 13.5);
    equal(cObj.oCoords.bl.corner.tr.x.toFixed(2), 16.5);
    equal(cObj.oCoords.bl.corner.tr.y.toFixed(2), 13.5);
    equal(cObj.oCoords.bl.corner.bl.x.toFixed(2), 3.5);
    equal(cObj.oCoords.bl.corner.bl.y.toFixed(2), 26.5);
    equal(cObj.oCoords.bl.corner.br.x.toFixed(2), 16.5);
    equal(cObj.oCoords.bl.corner.br.y.toFixed(2), 26.5);
    equal(cObj.oCoords.tr.corner.tl.x.toFixed(2), 13.5);
    equal(cObj.oCoords.tr.corner.tl.y.toFixed(2), 3.5);
    equal(cObj.oCoords.tr.corner.tr.x.toFixed(2), 26.5);
    equal(cObj.oCoords.tr.corner.tr.y.toFixed(2), 3.5);
    equal(cObj.oCoords.tr.corner.bl.x.toFixed(2), 13.5);
    equal(cObj.oCoords.tr.corner.bl.y.toFixed(2), 16.5);
    equal(cObj.oCoords.tr.corner.br.x.toFixed(2), 26.5);
    equal(cObj.oCoords.tr.corner.br.y.toFixed(2), 16.5);
    equal(cObj.oCoords.br.corner.tl.x.toFixed(2), 13.5);
    equal(cObj.oCoords.br.corner.tl.y.toFixed(2), 13.5);
    equal(cObj.oCoords.br.corner.tr.x.toFixed(2), 26.5);
    equal(cObj.oCoords.br.corner.tr.y.toFixed(2), 13.5);
    equal(cObj.oCoords.br.corner.bl.x.toFixed(2), 13.5);
    equal(cObj.oCoords.br.corner.bl.y.toFixed(2), 26.5);
    equal(cObj.oCoords.br.corner.br.x.toFixed(2), 26.5);
    equal(cObj.oCoords.br.corner.br.y.toFixed(2), 26.5);
    equal(cObj.oCoords.mtr.corner.tl.x.toFixed(2), 8.5);
    equal(cObj.oCoords.mtr.corner.tl.y.toFixed(2), -36.5);
    equal(cObj.oCoords.mtr.corner.tr.x.toFixed(2), 21.5);
    equal(cObj.oCoords.mtr.corner.tr.y.toFixed(2), -36.5);
    equal(cObj.oCoords.mtr.corner.bl.x.toFixed(2), 8.5);
    equal(cObj.oCoords.mtr.corner.bl.y.toFixed(2), -23.5);
    equal(cObj.oCoords.mtr.corner.br.x.toFixed(2), 21.5);
    equal(cObj.oCoords.mtr.corner.br.y.toFixed(2), -23.5);

  });

  test('_findTargetCorner', function(){
    var cObj = new fabric.Object({ top: 10, left: 10, width: 30, height: 30, strokeWidth: 0 });
    ok(typeof cObj._findTargetCorner == 'function', '_findTargetCorner should exist');
    cObj.setCoords();
    cObj.active = true;
    equal(cObj._findTargetCorner(cObj.oCoords.br), 'br');
    equal(cObj._findTargetCorner(cObj.oCoords.tl), 'tl');
    equal(cObj._findTargetCorner(cObj.oCoords.tr), 'tr');
    equal(cObj._findTargetCorner(cObj.oCoords.bl), 'bl');
    equal(cObj._findTargetCorner(cObj.oCoords.mr), 'mr');
    equal(cObj._findTargetCorner(cObj.oCoords.ml), 'ml');
    equal(cObj._findTargetCorner(cObj.oCoords.mt), 'mt');
    equal(cObj._findTargetCorner(cObj.oCoords.mb), 'mb');
    equal(cObj._findTargetCorner(cObj.oCoords.mtr), 'mtr');
    equal(cObj._findTargetCorner({ x: 0, y: 0 }), false);

  });

  test('_calculateCurrentDimensions', function(){
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 0 }), dim;
    ok(typeof cObj._calculateCurrentDimensions == 'function', '_calculateCurrentDimensions should exist');

    dim = cObj._calculateCurrentDimensions();
    equal(dim.x, 10);
    equal(dim.y, 15);

    cObj.strokeWidth = 2;
    dim = cObj._calculateCurrentDimensions();
    equal(dim.x, 12, 'strokeWidth should be added to dimension');
    equal(dim.y, 17, 'strokeWidth should be added to dimension');

    cObj.scaleX = 2;
    dim = cObj._calculateCurrentDimensions();
    equal(dim.x, 24, 'width should be doubled');
    equal(dim.y, 17, 'height should not change');

    cObj.scaleY = 2;
    dim = cObj._calculateCurrentDimensions();
    equal(dim.x, 24, 'width should not change');
    equal(dim.y, 34, 'height should be doubled');

    cObj.angle = 45;
    dim = cObj._calculateCurrentDimensions();
    equal(dim.x, 24, 'width should not change');
    equal(dim.y, 34, 'height should not change');

    cObj.skewX = 45;
    dim = cObj._calculateCurrentDimensions();
    equal(dim.x.toFixed(0), 58, 'width should change');
    equal(dim.y.toFixed(0), 34, 'height should not change');

    cObj.skewY = 45;
    dim = cObj._calculateCurrentDimensions();
    equal(dim.x.toFixed(0), 82, 'width should not change');
    equal(dim.y.toFixed(0), 58, 'height should change');

    cObj.padding = 10;
    dim = cObj._calculateCurrentDimensions();
    equal(dim.x.toFixed(0), 102, 'width should change');
    equal(dim.y.toFixed(0), 78, 'height should change');
  });

  test('_getTransformedDimensions', function(){
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 0 }), dim;
    ok(typeof cObj._getTransformedDimensions == 'function', '_getTransformedDimensions should exist');

    dim = cObj._getTransformedDimensions();
    equal(dim.x, 10);
    equal(dim.y, 15);

    cObj.strokeWidth = 2;
    dim = cObj._getTransformedDimensions();
    equal(dim.x, 12, 'strokeWidth should be added to dimension');
    equal(dim.y, 17, 'strokeWidth should be added to dimension');

    cObj.scaleX = 2;
    dim = cObj._getTransformedDimensions();
    equal(dim.x, 24, 'width should be doubled');
    equal(dim.y, 17, 'height should not change');

    cObj.scaleY = 2;
    dim = cObj._getTransformedDimensions();
    equal(dim.x, 24, 'width should not change');
    equal(dim.y, 34, 'height should be doubled');

    cObj.angle = 45;
    dim = cObj._getTransformedDimensions();
    equal(dim.x, 24, 'width should not change');
    equal(dim.y, 34, 'height should not change');

    cObj.skewX = 45;
    dim = cObj._getTransformedDimensions();
    equal(dim.x.toFixed(0), 58, 'width should change');
    equal(dim.y.toFixed(0), 34, 'height should not change');

    cObj.skewY = 45;
    dim = cObj._getTransformedDimensions();
    equal(dim.x.toFixed(0), 82, 'width should not change');
    equal(dim.y.toFixed(0), 58, 'height should change');

    cObj.padding = 10;
    dim = cObj._getTransformedDimensions();
    equal(dim.x.toFixed(0), 82, 'width should not change');
    equal(dim.y.toFixed(0), 58, 'height should not change');
  });

  test('_getNonTransformedDimensions', function(){
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 0 }), dim;
    ok(typeof cObj._getNonTransformedDimensions == 'function', '_getNonTransformedDimensions should exist');

    dim = cObj._getNonTransformedDimensions();
    equal(dim.x, 10);
    equal(dim.y, 15);

    cObj.strokeWidth = 2;
    dim = cObj._getNonTransformedDimensions();
    equal(dim.x, 12, 'strokeWidth should be added to dimension');
    equal(dim.y, 17, 'strokeWidth should be added to dimension');

    cObj.scaleX = 2;
    dim = cObj._getNonTransformedDimensions();
    equal(dim.x, 12, 'width should not change');
    equal(dim.y, 17, 'height should not change');

    cObj.scaleY = 2;
    dim = cObj._getNonTransformedDimensions();
    equal(dim.x, 12, 'width should not change');
    equal(dim.y, 17, 'height should not change');

    cObj.angle = 45;
    dim = cObj._getNonTransformedDimensions();
    equal(dim.x, 12, 'width should not change');
    equal(dim.y, 17, 'height should not change');

    cObj.skewX = 45;
    dim = cObj._getNonTransformedDimensions();
    equal(dim.x, 12, 'width should not change');
    equal(dim.y, 17, 'height should not change');

    cObj.skewY = 45;
    dim = cObj._getNonTransformedDimensions();
    equal(dim.x, 12, 'width should not change');
    equal(dim.y, 17, 'height should not change');

    cObj.padding = 10;
    dim = cObj._getNonTransformedDimensions();
    equal(dim.x, 12, 'width should not change');
    equal(dim.y, 17, 'height should not change');
  });

})();
