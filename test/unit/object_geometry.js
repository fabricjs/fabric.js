(function() {

  QUnit.module('fabric.ObjectGeometry');

  test('setCoords', function() {
    var cObj = new fabric.Object({ left: 150, top: 150, width: 100, height: 100, strokeWidth: 0});
    ok(typeof cObj.setCoords == 'function');
    equal(cObj.setCoords(), cObj, 'chainable');

    cObj.set('left', 250).set('top', 250);

    // coords should still correspond to initial one, even after invoking `set`
    equal(cObj.oCoords.tl.x, 150);
    equal(cObj.oCoords.tl.y, 150);
    equal(cObj.oCoords.tr.x, 250);
    equal(cObj.oCoords.tr.y, 150);
    equal(cObj.oCoords.bl.x, 150);
    equal(cObj.oCoords.bl.y, 250);
    equal(cObj.oCoords.br.x, 250);
    equal(cObj.oCoords.br.y, 250);
    equal(cObj.oCoords.mtr.x, 200);
    equal(cObj.oCoords.mtr.y, 110);

    // recalculate coords
    cObj.setCoords();

    // check that coords are now updated
    equal(cObj.oCoords.tl.x, 250);
    equal(cObj.oCoords.tl.y, 250);
    equal(cObj.oCoords.tr.x, 350);
    equal(cObj.oCoords.tr.y, 250);
    equal(cObj.oCoords.bl.x, 250);
    equal(cObj.oCoords.bl.y, 350);
    equal(cObj.oCoords.br.x, 350);
    equal(cObj.oCoords.br.y, 350);
    equal(cObj.oCoords.mtr.x, 300);
    equal(cObj.oCoords.mtr.y, 210);
  });

  test('calcTransformMatrix', function(){
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 0 });
    ok(typeof cObj.calcTransformMatrix == 'function', 'calcTransformMatrix should exist');
  });

  test('_calcDimensionsTransformMatrix', function(){
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 0 });
    ok(typeof cObj._calcDimensionsTransformMatrix == 'function', '_calcDimensionsTransformMatrix should exist');
  });

  test('_calcRotateMatrix', function(){
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 0 });
    ok(typeof cObj._calcRotateMatrix == 'function', '_calcRotateMatrix should exist');
  });

  test('scaleToHeight', function(){
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 0 });
    ok(typeof cObj.scaleToHeight == 'function', 'scaleToHeight should exist');
  });

  test('scaleToWidth', function(){
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 0 });
    ok(typeof cObj.scaleToWidth == 'function', 'scaleToWidth should exist');
  });

  test('scale', function(){
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 0 });
    ok(typeof cObj.scale == 'function', 'scale should exist');
  });

  test('_constrainScale', function(){
    var cObj = new fabric.Object({ width: 10, height: 15, strokeWidth: 0 });
    ok(typeof cObj._constrainScale == 'function', '_constrainScale should exist');
  });

})();
