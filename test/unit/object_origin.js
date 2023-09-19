(function() {

  var rectOptions = {
    'originX':                  'left',
    'originY':                  'top',
    'left':                     35,
    'top':                      45,
    'width':                    20,
    'height':                   40,
    'fill':                     'rgb(0,0,0)',
    'strokeWidth':              2,
    'angle':                    0,
    'scaleX':                   2,
    'scaleY':                   2,
  };

  QUnit.module('fabric.ObjectOrigins');

  QUnit.skip('getCenterPoint', function(assert) {
    var rect = new fabric.Rect(rectOptions), p;
    p = rect.getCenterPoint();
    assert.deepEqual(p, new fabric.Point(57, 87));
  });

  QUnit.skip('translateToCenterPoint', function(assert) {
    var rect = new fabric.Rect(rectOptions),
        p,
        point = new fabric.Point(15, 20);

    p = rect.translateToCenterPoint(point, 'center', 'center');
    assert.deepEqual(p, new fabric.Point(15, 20));

    p = rect.translateToCenterPoint(point, 'center', 'center');
    assert.deepEqual(p, new fabric.Point(15, 20));

    p = rect.translateToCenterPoint(point, 'center', 'top');
    assert.deepEqual(p, new fabric.Point(15, 62));

    p = rect.translateToCenterPoint(point, 'center', 'bottom');
    assert.deepEqual(p, new fabric.Point(15, -22));

    p = rect.translateToCenterPoint(point, 'left', 'center');
    assert.deepEqual(p, new fabric.Point(37, 20));

    p = rect.translateToCenterPoint(point, 'left', 'top');
    assert.deepEqual(p, new fabric.Point(37, 62));

    p = rect.translateToCenterPoint(point, 'left', 'bottom');
    assert.deepEqual(p, new fabric.Point(37, -22));

    p = rect.translateToCenterPoint(point, 'right', 'center');
    assert.deepEqual(p, new fabric.Point(-7, 20));

    p = rect.translateToCenterPoint(point, 'right', 'top');
    assert.deepEqual(p, new fabric.Point(-7, 62));

    p = rect.translateToCenterPoint(point, 'right', 'bottom');
    assert.deepEqual(p, new fabric.Point(-7, -22));
  });

  QUnit.skip('translateToCenterPointRotated', function(assert) {
    var rect = new fabric.Rect(rectOptions),
        p,
        point = new fabric.Point(15, 20);
    rect.angle = 35;

    p = rect.translateToCenterPoint(point, 'center', 'center');
    assert.deepEqual(p, new fabric.Point(15, 20));

    p = rect.translateToCenterPoint(point, 'center', 'top');
    assert.deepEqual(p, new fabric.Point(-9.090210326743936, 54.40438586013766));

    p = rect.translateToCenterPoint(point, 'center', 'bottom');
    assert.deepEqual(p, new fabric.Point(39.090210326743936, -14.404385860137658));

    p = rect.translateToCenterPoint(point, 'left', 'center');
    assert.deepEqual(p, new fabric.Point(33.02134497435782, 32.61868159972301));

    p = rect.translateToCenterPoint(point, 'left', 'top');
    assert.deepEqual(p, new fabric.Point(8.931134647613884, 67.02306745986067));

    p = rect.translateToCenterPoint(point, 'left', 'bottom');
    assert.deepEqual(p, new fabric.Point(57.11155530110176, -1.7857042604146471));

    p = rect.translateToCenterPoint(point, 'right', 'center');
    assert.deepEqual(p, new fabric.Point(-3.0213449743578202, 7.381318400276987));

    p = rect.translateToCenterPoint(point, 'right', 'top');
    assert.deepEqual(p, new fabric.Point(-27.11155530110176, 41.78570426041465));

    p = rect.translateToCenterPoint(point, 'right', 'bottom');
    assert.deepEqual(p, new fabric.Point(21.068865352386116, -27.02306745986067));
  });


  QUnit.skip('translateToOriginPoint', function(assert) {
    var rect = new fabric.Rect(rectOptions),
        p,
        point = new fabric.Point(15, 20);

    p = rect.translateToOriginPoint(point, 'center', 'center');
    assert.deepEqual(p, new fabric.Point(15, 20));

    p = rect.translateToOriginPoint(point, 'center', 'top');
    assert.deepEqual(p, new fabric.Point(15, -22));

    p = rect.translateToOriginPoint(point, 'center', 'bottom');
    assert.deepEqual(p, new fabric.Point(15, 62));

    p = rect.translateToOriginPoint(point, 'left', 'center');
    assert.deepEqual(p, new fabric.Point(-7, 20));

    p = rect.translateToOriginPoint(point, 'left', 'top');
    assert.deepEqual(p, new fabric.Point(-7, -22));

    p = rect.translateToOriginPoint(point, 'left', 'bottom');
    assert.deepEqual(p, new fabric.Point(-7, 62));

    p = rect.translateToOriginPoint(point, 'right', 'center');
    assert.deepEqual(p, new fabric.Point(37, 20));

    p = rect.translateToOriginPoint(point, 'right', 'top');
    assert.deepEqual(p, new fabric.Point(37, -22));

    p = rect.translateToOriginPoint(point, 'right', 'bottom');
    assert.deepEqual(p, new fabric.Point(37, 62));
  });

  QUnit.skip('translateToOriginPointRotated', function(assert) {
    var rect = new fabric.Rect(rectOptions),
        p,
        point = new fabric.Point(15, 20);
    rect.angle = 35;

    p = rect.translateToOriginPoint(point, 'center', 'center');
    assert.deepEqual(p, new fabric.Point(15, 20));

    p = rect.translateToOriginPoint(point, 'center', 'top');
    assert.deepEqual(p, new fabric.Point(39.090210326743936, -14.404385860137658));

    p = rect.translateToOriginPoint(point, 'center', 'bottom');
    assert.deepEqual(p, new fabric.Point(-9.090210326743936, 54.40438586013766));

    p = rect.translateToOriginPoint(point, 'left', 'center');
    assert.deepEqual(p, new fabric.Point(-3.0213449743578202, 7.381318400276987));

    p = rect.translateToOriginPoint(point, 'left', 'top');
    assert.deepEqual(p, new fabric.Point(21.068865352386116, -27.02306745986067));

    p = rect.translateToOriginPoint(point, 'left', 'bottom');
    assert.deepEqual(p, new fabric.Point(-27.11155530110176, 41.78570426041465));

    p = rect.translateToOriginPoint(point, 'right', 'center');
    assert.deepEqual(p, new fabric.Point(33.02134497435782, 32.61868159972301));

    p = rect.translateToOriginPoint(point, 'right', 'top');
    assert.deepEqual(p, new fabric.Point(57.11155530110176, -1.7857042604146471));

    p = rect.translateToOriginPoint(point, 'right', 'bottom');
    assert.deepEqual(p, new fabric.Point(8.931134647613884, 67.02306745986067));
  });

  QUnit.skip('translateToCenterPoint with numeric origins', function(assert) {
    var rect = new fabric.Rect(rectOptions),
        p,
        point = new fabric.Point(15, 20);

    p = rect.translateToCenterPoint(point, 0.5, 0.5);
    assert.deepEqual(p, new fabric.Point(15, 20));

    p = rect.translateToCenterPoint(point, 0.5, 0.5);
    assert.deepEqual(p, new fabric.Point(15, 20));

    p = rect.translateToCenterPoint(point, 0.5, 0);
    assert.deepEqual(p, new fabric.Point(15, 62));

    p = rect.translateToCenterPoint(point, 0.5, 1);
    assert.deepEqual(p, new fabric.Point(15, -22));

    p = rect.translateToCenterPoint(point, 0, 0.5);
    assert.deepEqual(p, new fabric.Point(37, 20));

    p = rect.translateToCenterPoint(point, 0, 0);
    assert.deepEqual(p, new fabric.Point(37, 62));

    p = rect.translateToCenterPoint(point, 0, 1);
    assert.deepEqual(p, new fabric.Point(37, -22));

    p = rect.translateToCenterPoint(point, 1, 0.5);
    assert.deepEqual(p, new fabric.Point(-7, 20));

    p = rect.translateToCenterPoint(point, 1, 0);
    assert.deepEqual(p, new fabric.Point(-7, 62));

    p = rect.translateToCenterPoint(point, 1, 1);
    assert.deepEqual(p, new fabric.Point(-7, -22));
  });

  QUnit.skip('translateToCenterPointRotated with numeric origins', function(assert) {
    var rect = new fabric.Rect(rectOptions),
        p,
        point = new fabric.Point(15, 20);
    rect.angle = 35;

    p = rect.translateToCenterPoint(point, 0.5, 0.5);
    assert.deepEqual(p, new fabric.Point(15, 20));

    p = rect.translateToCenterPoint(point, 0.5, 0);
    assert.deepEqual(p, new fabric.Point(-9.090210326743936, 54.40438586013766));

    p = rect.translateToCenterPoint(point, 0.5, 1);
    assert.deepEqual(p, new fabric.Point(39.090210326743936, -14.404385860137658));

    p = rect.translateToCenterPoint(point, 0, 0.5);
    assert.deepEqual(p, new fabric.Point(33.02134497435782, 32.61868159972301));

    p = rect.translateToCenterPoint(point, 0, 0);
    assert.deepEqual(p, new fabric.Point(8.931134647613884, 67.02306745986067));

    p = rect.translateToCenterPoint(point, 0, 1);
    assert.deepEqual(p, new fabric.Point(57.11155530110176, -1.7857042604146471));

    p = rect.translateToCenterPoint(point, 1, 0.5);
    assert.deepEqual(p, new fabric.Point(-3.0213449743578202, 7.381318400276987));

    p = rect.translateToCenterPoint(point, 1, 0);
    assert.deepEqual(p, new fabric.Point(-27.11155530110176, 41.78570426041465));

    p = rect.translateToCenterPoint(point, 1, 1);
    assert.deepEqual(p, new fabric.Point(21.068865352386116, -27.02306745986067));
  });


  QUnit.skip('translateToOriginPoint with numeric origins', function(assert) {
    var rect = new fabric.Rect(rectOptions),
        p,
        point = new fabric.Point(15, 20);

    p = rect.translateToOriginPoint(point, 0.5, 0.5);
    assert.deepEqual(p, new fabric.Point(15, 20));

    p = rect.translateToOriginPoint(point, 0.5, 0);
    assert.deepEqual(p, new fabric.Point(15, -22));

    p = rect.translateToOriginPoint(point, 0.5, 1);
    assert.deepEqual(p, new fabric.Point(15, 62));

    p = rect.translateToOriginPoint(point, 0, 0.5);
    assert.deepEqual(p, new fabric.Point(-7, 20));

    p = rect.translateToOriginPoint(point, 0, 0);
    assert.deepEqual(p, new fabric.Point(-7, -22));

    p = rect.translateToOriginPoint(point, 0, 1);
    assert.deepEqual(p, new fabric.Point(-7, 62));

    p = rect.translateToOriginPoint(point, 1, 0.5);
    assert.deepEqual(p, new fabric.Point(37, 20));

    p = rect.translateToOriginPoint(point, 1, 0);
    assert.deepEqual(p, new fabric.Point(37, -22));

    p = rect.translateToOriginPoint(point, 1, 1);
    assert.deepEqual(p, new fabric.Point(37, 62));
  });

  QUnit.skip('translateToOriginPointRotated with numeric origins', function(assert) {
    var rect = new fabric.Rect(rectOptions),
        p,
        point = new fabric.Point(15, 20);
    rect.angle = 35;

    p = rect.translateToOriginPoint(point, 0.5, 0.5);
    assert.deepEqual(p, new fabric.Point(15, 20));

    p = rect.translateToOriginPoint(point, 0.5, 0);
    assert.deepEqual(p, new fabric.Point(39.090210326743936, -14.404385860137658));

    p = rect.translateToOriginPoint(point, 0.5, 1);
    assert.deepEqual(p, new fabric.Point(-9.090210326743936, 54.40438586013766));

    p = rect.translateToOriginPoint(point, 0, 0.5);
    assert.deepEqual(p, new fabric.Point(-3.0213449743578202, 7.381318400276987));

    p = rect.translateToOriginPoint(point, 0, 0);
    assert.deepEqual(p, new fabric.Point(21.068865352386116, -27.02306745986067));

    p = rect.translateToOriginPoint(point, 0, 1);
    assert.deepEqual(p, new fabric.Point(-27.11155530110176, 41.78570426041465));

    p = rect.translateToOriginPoint(point, 1, 0.5);
    assert.deepEqual(p, new fabric.Point(33.02134497435782, 32.61868159972301));

    p = rect.translateToOriginPoint(point, 1, 0);
    assert.deepEqual(p, new fabric.Point(57.11155530110176, -1.7857042604146471));

    p = rect.translateToOriginPoint(point, 1, 1);
    assert.deepEqual(p, new fabric.Point(8.931134647613884, 67.02306745986067));
  });

})();
