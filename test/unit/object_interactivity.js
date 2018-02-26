(function() {

  QUnit.module('fabric.ObjectInteractivity');

  QUnit.test('isControlVisible', function(assert) {
    assert.ok(fabric.Object);

    var cObj = new fabric.Object({ });
    assert.ok(typeof cObj.isControlVisible === 'function', 'isControlVisible should exist');

    assert.equal(cObj.isControlVisible('tl'), true);
    assert.equal(cObj.isControlVisible('tr'), true);
    assert.equal(cObj.isControlVisible('br'), true);
    assert.equal(cObj.isControlVisible('bl'), true);
    assert.equal(cObj.isControlVisible('ml'), true);
    assert.equal(cObj.isControlVisible('mt'), true);
    assert.equal(cObj.isControlVisible('mr'), true);
    assert.equal(cObj.isControlVisible('mb'), true);
    assert.equal(cObj.isControlVisible('mtr'), true);
  });

  QUnit.test('setControlVisible', function(assert) {
    assert.ok(fabric.Object);

    var cObj = new fabric.Object({ });
    assert.ok(typeof cObj.setControlVisible === 'function', 'setControlVisible should exist');
    assert.equal(cObj.setControlVisible('tl'), cObj, 'chainable');

    cObj.setControlVisible('tl', false);
    assert.equal(cObj.isControlVisible('tl'), false);
    cObj.setControlVisible('tl', true);
    assert.equal(cObj.isControlVisible('tl'), true);
  });

  QUnit.test('setControlsVisibility', function(assert) {
    assert.ok(fabric.Object);

    var cObj = new fabric.Object({ });
    assert.ok(typeof cObj.setControlsVisibility === 'function', 'setControlsVisibility should exist');
    assert.equal(cObj.setControlsVisibility(), cObj, 'chainable');

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

    assert.equal(cObj.isControlVisible('tl'), false);
    assert.equal(cObj.isControlVisible('tr'), false);
    assert.equal(cObj.isControlVisible('br'), false);
    assert.equal(cObj.isControlVisible('bl'), false);
    assert.equal(cObj.isControlVisible('ml'), false);
    assert.equal(cObj.isControlVisible('mt'), false);
    assert.equal(cObj.isControlVisible('mr'), false);
    assert.equal(cObj.isControlVisible('mb'), false);
    assert.equal(cObj.isControlVisible('mtr'), false);

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

    assert.equal(cObj.isControlVisible('tl'), true);
    assert.equal(cObj.isControlVisible('tr'), true);
    assert.equal(cObj.isControlVisible('br'), true);
    assert.equal(cObj.isControlVisible('bl'), true);
    assert.equal(cObj.isControlVisible('ml'), true);
    assert.equal(cObj.isControlVisible('mt'), true);
    assert.equal(cObj.isControlVisible('mr'), true);
    assert.equal(cObj.isControlVisible('mb'), true);
    assert.equal(cObj.isControlVisible('mtr'), true);
  });

  QUnit.test('_setCornerCoords', function(assert) {
    var cObj = new fabric.Object({ top: 10, left: 10, width: 10, height: 10, strokeWidth: 0 });
    assert.ok(typeof cObj._setCornerCoords === 'function', '_setCornerCoords should exist');
    cObj.setCoords();

    assert.equal(cObj.oCoords.tl.corner.tl.x.toFixed(2), 3.5);
    assert.equal(cObj.oCoords.tl.corner.tl.y.toFixed(2), 3.5);
    assert.equal(cObj.oCoords.tl.corner.tr.x.toFixed(2), 16.5);
    assert.equal(cObj.oCoords.tl.corner.tr.y.toFixed(2), 3.5);
    assert.equal(cObj.oCoords.tl.corner.bl.x.toFixed(2), 3.5);
    assert.equal(cObj.oCoords.tl.corner.bl.y.toFixed(2), 16.5);
    assert.equal(cObj.oCoords.tl.corner.br.x.toFixed(2), 16.5);
    assert.equal(cObj.oCoords.tl.corner.br.y.toFixed(2), 16.5);
    assert.equal(cObj.oCoords.bl.corner.tl.x.toFixed(2), 3.5);
    assert.equal(cObj.oCoords.bl.corner.tl.y.toFixed(2), 13.5);
    assert.equal(cObj.oCoords.bl.corner.tr.x.toFixed(2), 16.5);
    assert.equal(cObj.oCoords.bl.corner.tr.y.toFixed(2), 13.5);
    assert.equal(cObj.oCoords.bl.corner.bl.x.toFixed(2), 3.5);
    assert.equal(cObj.oCoords.bl.corner.bl.y.toFixed(2), 26.5);
    assert.equal(cObj.oCoords.bl.corner.br.x.toFixed(2), 16.5);
    assert.equal(cObj.oCoords.bl.corner.br.y.toFixed(2), 26.5);
    assert.equal(cObj.oCoords.tr.corner.tl.x.toFixed(2), 13.5);
    assert.equal(cObj.oCoords.tr.corner.tl.y.toFixed(2), 3.5);
    assert.equal(cObj.oCoords.tr.corner.tr.x.toFixed(2), 26.5);
    assert.equal(cObj.oCoords.tr.corner.tr.y.toFixed(2), 3.5);
    assert.equal(cObj.oCoords.tr.corner.bl.x.toFixed(2), 13.5);
    assert.equal(cObj.oCoords.tr.corner.bl.y.toFixed(2), 16.5);
    assert.equal(cObj.oCoords.tr.corner.br.x.toFixed(2), 26.5);
    assert.equal(cObj.oCoords.tr.corner.br.y.toFixed(2), 16.5);
    assert.equal(cObj.oCoords.br.corner.tl.x.toFixed(2), 13.5);
    assert.equal(cObj.oCoords.br.corner.tl.y.toFixed(2), 13.5);
    assert.equal(cObj.oCoords.br.corner.tr.x.toFixed(2), 26.5);
    assert.equal(cObj.oCoords.br.corner.tr.y.toFixed(2), 13.5);
    assert.equal(cObj.oCoords.br.corner.bl.x.toFixed(2), 13.5);
    assert.equal(cObj.oCoords.br.corner.bl.y.toFixed(2), 26.5);
    assert.equal(cObj.oCoords.br.corner.br.x.toFixed(2), 26.5);
    assert.equal(cObj.oCoords.br.corner.br.y.toFixed(2), 26.5);
    assert.equal(cObj.oCoords.mtr.corner.tl.x.toFixed(2), 8.5);
    assert.equal(cObj.oCoords.mtr.corner.tl.y.toFixed(2), -36.5);
    assert.equal(cObj.oCoords.mtr.corner.tr.x.toFixed(2), 21.5);
    assert.equal(cObj.oCoords.mtr.corner.tr.y.toFixed(2), -36.5);
    assert.equal(cObj.oCoords.mtr.corner.bl.x.toFixed(2), 8.5);
    assert.equal(cObj.oCoords.mtr.corner.bl.y.toFixed(2), -23.5);
    assert.equal(cObj.oCoords.mtr.corner.br.x.toFixed(2), 21.5);
    assert.equal(cObj.oCoords.mtr.corner.br.y.toFixed(2), -23.5);

  });

  QUnit.test('_findTargetCorner', function(assert) {
    var cObj = new fabric.Object({ top: 10, left: 10, width: 30, height: 30, strokeWidth: 0 });
    assert.ok(typeof cObj._findTargetCorner === 'function', '_findTargetCorner should exist');
    cObj.setCoords();
    cObj.canvas = {
      _activeObject: cObj
    };
    assert.equal(cObj._findTargetCorner(cObj.oCoords.br), 'br');
    assert.equal(cObj._findTargetCorner(cObj.oCoords.tl), 'tl');
    assert.equal(cObj._findTargetCorner(cObj.oCoords.tr), 'tr');
    assert.equal(cObj._findTargetCorner(cObj.oCoords.bl), 'bl');
    assert.equal(cObj._findTargetCorner(cObj.oCoords.mr), 'mr');
    assert.equal(cObj._findTargetCorner(cObj.oCoords.ml), 'ml');
    assert.equal(cObj._findTargetCorner(cObj.oCoords.mt), 'mt');
    assert.equal(cObj._findTargetCorner(cObj.oCoords.mb), 'mb');
    assert.equal(cObj._findTargetCorner(cObj.oCoords.mtr), 'mtr');
    assert.equal(cObj._findTargetCorner({ x: 0, y: 0 }), false);

  });

  QUnit.test('_calculateCurrentDimensions', function(assert) {
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 0 }), dim;
    assert.ok(typeof cObj._calculateCurrentDimensions === 'function', '_calculateCurrentDimensions should exist');

    dim = cObj._calculateCurrentDimensions();
    assert.equal(dim.x, 10);
    assert.equal(dim.y, 15);

    cObj.strokeWidth = 2;
    dim = cObj._calculateCurrentDimensions();
    assert.equal(dim.x, 12, 'strokeWidth should be added to dimension');
    assert.equal(dim.y, 17, 'strokeWidth should be added to dimension');

    cObj.scaleX = 2;
    dim = cObj._calculateCurrentDimensions();
    assert.equal(dim.x, 24, 'width should be doubled');
    assert.equal(dim.y, 17, 'height should not change');

    cObj.scaleY = 2;
    dim = cObj._calculateCurrentDimensions();
    assert.equal(dim.x, 24, 'width should not change');
    assert.equal(dim.y, 34, 'height should be doubled');

    cObj.angle = 45;
    dim = cObj._calculateCurrentDimensions();
    assert.equal(dim.x, 24, 'width should not change');
    assert.equal(dim.y, 34, 'height should not change');

    cObj.skewX = 45;
    dim = cObj._calculateCurrentDimensions();
    assert.equal(dim.x.toFixed(0), 58, 'width should change');
    assert.equal(dim.y.toFixed(0), 34, 'height should not change');

    cObj.skewY = 45;
    dim = cObj._calculateCurrentDimensions();
    assert.equal(dim.x.toFixed(0), 82, 'width should not change');
    assert.equal(dim.y.toFixed(0), 58, 'height should change');

    cObj.padding = 10;
    dim = cObj._calculateCurrentDimensions();
    assert.equal(dim.x.toFixed(0), 102, 'width should change');
    assert.equal(dim.y.toFixed(0), 78, 'height should change');
  });

  QUnit.test('_getTransformedDimensions', function(assert) {
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 0 }), dim;
    assert.ok(typeof cObj._getTransformedDimensions === 'function', '_getTransformedDimensions should exist');

    dim = cObj._getTransformedDimensions();
    assert.equal(dim.x, 10);
    assert.equal(dim.y, 15);

    cObj.strokeWidth = 2;
    dim = cObj._getTransformedDimensions();
    assert.equal(dim.x, 12, 'strokeWidth should be added to dimension');
    assert.equal(dim.y, 17, 'strokeWidth should be added to dimension');

    cObj.scaleX = 2;
    dim = cObj._getTransformedDimensions();
    assert.equal(dim.x, 24, 'width should be doubled');
    assert.equal(dim.y, 17, 'height should not change');

    cObj.scaleY = 2;
    dim = cObj._getTransformedDimensions();
    assert.equal(dim.x, 24, 'width should not change');
    assert.equal(dim.y, 34, 'height should be doubled');

    cObj.angle = 45;
    dim = cObj._getTransformedDimensions();
    assert.equal(dim.x, 24, 'width should not change');
    assert.equal(dim.y, 34, 'height should not change');

    cObj.skewX = 45;
    dim = cObj._getTransformedDimensions();
    assert.equal(dim.x.toFixed(0), 58, 'width should change');
    assert.equal(dim.y.toFixed(0), 34, 'height should not change');

    cObj.skewY = 45;
    dim = cObj._getTransformedDimensions();
    assert.equal(dim.x.toFixed(0), 82, 'width should not change');
    assert.equal(dim.y.toFixed(0), 58, 'height should change');

    cObj.padding = 10;
    dim = cObj._getTransformedDimensions();
    assert.equal(dim.x.toFixed(0), 82, 'width should not change');
    assert.equal(dim.y.toFixed(0), 58, 'height should not change');
  });

  QUnit.test('_getNonTransformedDimensions', function(assert) {
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 0 }), dim;
    assert.ok(typeof cObj._getNonTransformedDimensions === 'function', '_getNonTransformedDimensions should exist');

    dim = cObj._getNonTransformedDimensions();
    assert.equal(dim.x, 10);
    assert.equal(dim.y, 15);

    cObj.strokeWidth = 2;
    dim = cObj._getNonTransformedDimensions();
    assert.equal(dim.x, 12, 'strokeWidth should be added to dimension');
    assert.equal(dim.y, 17, 'strokeWidth should be added to dimension');

    cObj.scaleX = 2;
    dim = cObj._getNonTransformedDimensions();
    assert.equal(dim.x, 12, 'width should not change');
    assert.equal(dim.y, 17, 'height should not change');

    cObj.scaleY = 2;
    dim = cObj._getNonTransformedDimensions();
    assert.equal(dim.x, 12, 'width should not change');
    assert.equal(dim.y, 17, 'height should not change');

    cObj.angle = 45;
    dim = cObj._getNonTransformedDimensions();
    assert.equal(dim.x, 12, 'width should not change');
    assert.equal(dim.y, 17, 'height should not change');

    cObj.skewX = 45;
    dim = cObj._getNonTransformedDimensions();
    assert.equal(dim.x, 12, 'width should not change');
    assert.equal(dim.y, 17, 'height should not change');

    cObj.skewY = 45;
    dim = cObj._getNonTransformedDimensions();
    assert.equal(dim.x, 12, 'width should not change');
    assert.equal(dim.y, 17, 'height should not change');

    cObj.padding = 10;
    dim = cObj._getNonTransformedDimensions();
    assert.equal(dim.x, 12, 'width should not change');
    assert.equal(dim.y, 17, 'height should not change');
  });

})();
