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

  QUnit.test('getCenterPoint', function(assert) {
    var rect = new fabric.Rect(rectOptions), p;
    p = rect.getCenterPoint();
    assert.deepEqual(p, new fabric.Point(57, 87));
  });

  QUnit.test('translateToCenterPoint', function(assert) {
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

  QUnit.test('translateToCenterPointRotated', function(assert) {
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


  QUnit.test('translateToOriginPoint', function(assert) {
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

  QUnit.test('translateToOriginPointRotated', function(assert) {
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


  QUnit.test('toLocalPoint', function(assert) {
    var rect = new fabric.Rect(rectOptions),
        p,
        point = new fabric.Point(15, 20);

    p = rect.toLocalPoint(point, 'center', 'center');
    assert.deepEqual(p, new fabric.Point(-42, -67));

    p = rect.toLocalPoint(point, 'center', 'top');
    assert.deepEqual(p, new fabric.Point(-42, -25));

    p = rect.toLocalPoint(point, 'center', 'bottom');
    assert.deepEqual(p, new fabric.Point(-42, -109));

    p = rect.toLocalPoint(point, 'left', 'center');
    assert.deepEqual(p, new fabric.Point(-20, -67));

    p = rect.toLocalPoint(point, 'left', 'top');
    assert.deepEqual(p, new fabric.Point(-20, -25));

    p = rect.toLocalPoint(point, 'left', 'bottom');
    assert.deepEqual(p, new fabric.Point(-20, -109));

    p = rect.toLocalPoint(point, 'right', 'center');
    assert.deepEqual(p, new fabric.Point(-64, -67));

    p = rect.toLocalPoint(point, 'right', 'top');
    assert.deepEqual(p, new fabric.Point(-64, -25));

    p = rect.toLocalPoint(point, 'right', 'bottom');
    assert.deepEqual(p, new fabric.Point(-64, -109));

    p = rect.toLocalPoint(point);
    assert.deepEqual(p, new fabric.Point(-20, -25));
  });

  QUnit.test('toLocalPointRotated', function(assert) {
    var rect = new fabric.Rect(rectOptions),
        p,
        point = new fabric.Point(15, 20);
    rect.angle = 35;

    p = rect.toLocalPoint(point, 'center', 'center');
    assert.deepEqual(p, new fabric.Point(-52.72245179455599, -51.00727238020387));

    p = rect.toLocalPoint(point, 'center', 'top');
    assert.deepEqual(p, new fabric.Point(-52.72245179455599, -9.007272380203872));

    p = rect.toLocalPoint(point, 'center', 'bottom');
    assert.deepEqual(p, new fabric.Point(-52.72245179455599, -93.00727238020387));

    p = rect.toLocalPoint(point, 'left', 'center');
    assert.deepEqual(p, new fabric.Point(-30.722451794555987, -51.00727238020387));

    p = rect.toLocalPoint(point, 'left', 'top');
    assert.deepEqual(p, new fabric.Point(-30.722451794555987, -9.007272380203872));

    p = rect.toLocalPoint(point, 'left', 'bottom');
    assert.deepEqual(p, new fabric.Point(-30.722451794555987, -93.00727238020387));

    p = rect.toLocalPoint(point, 'right', 'center');
    assert.deepEqual(p, new fabric.Point(-74.722451794556, -51.00727238020387));

    p = rect.toLocalPoint(point, 'right', 'top');
    assert.deepEqual(p, new fabric.Point(-74.722451794556, -9.007272380203872));

    p = rect.toLocalPoint(point, 'right', 'bottom');
    assert.deepEqual(p, new fabric.Point(-74.722451794556, -93.00727238020387));

    p = rect.toLocalPoint(point);
    assert.deepEqual(p, new fabric.Point(-58.791317146942106, -3.9842049203432026));
  });


  QUnit.test('adjustPosition', function(assert) {
    var rect = new fabric.Rect(rectOptions);

    rect.strokeWidth = 0;
    rect.originX = 'left';
    rect.originY = 'top';
    rect.adjustPosition('left');
    assert.deepEqual(rect.left, 35);
    assert.deepEqual(rect.top, 45);
    assert.equal(rect.originX, 'left');

    rect.adjustPosition('center');
    assert.deepEqual(rect.left, 55);
    assert.deepEqual(rect.top, 45);
    assert.equal(rect.originX, 'center');

    rect.adjustPosition('right');
    assert.deepEqual(rect.left, 75);
    assert.deepEqual(rect.top, 45);
    assert.equal(rect.originX, 'right');

    rect.originX = 'center';
    rect.originY = 'center';
    rect.adjustPosition('left');
    assert.deepEqual(rect.left, 55);
    assert.deepEqual(rect.top, 45);
    assert.equal(rect.originX, 'left');

    rect.adjustPosition('center');
    assert.deepEqual(rect.left, 75);
    assert.deepEqual(rect.top, 45);
    assert.equal(rect.originX, 'center');

    rect.adjustPosition('right');
    assert.deepEqual(rect.left, 95);
    assert.deepEqual(rect.top, 45);
    assert.equal(rect.originX, 'right');

    rect.originX = 'right';
    rect.originY = 'bottom';
    rect.adjustPosition('left');
    assert.deepEqual(rect.left, 55);
    assert.deepEqual(rect.top, 45);
    assert.equal(rect.originX, 'left');

    rect.adjustPosition('center');
    assert.deepEqual(rect.left, 75);
    assert.deepEqual(rect.top, 45);
    assert.equal(rect.originX, 'center');

    rect.adjustPosition('right');
    assert.deepEqual(rect.left, 95);
    assert.deepEqual(rect.top, 45);
    assert.equal(rect.originX, 'right');
  });

  QUnit.test('adjustPositionRotated', function(assert) {
    var rect = new fabric.Rect(rectOptions);

    rect.angle = 35;
    rect.strokeWidth = 0;
    rect.originX = 'left';
    rect.originY = 'top';
    rect.adjustPosition('left');
    assert.deepEqual(rect.left, 35);
    assert.deepEqual(rect.top, 45);
    assert.equal(rect.originX, 'left');

    rect.adjustPosition('center');
    assert.deepEqual(rect.left, 51.383040885779835);
    assert.deepEqual(rect.top, 56.471528727020925);
    assert.equal(rect.originX, 'center');

    rect.adjustPosition('right');
    assert.deepEqual(rect.left, 67.76608177155967);
    assert.deepEqual(rect.top, 67.94305745404185);
    assert.equal(rect.originX, 'right');

    rect.originX = 'center';
    rect.originY = 'center';
    rect.adjustPosition('left');
    assert.deepEqual(rect.left, 51.383040885779835);
    assert.deepEqual(rect.top, 56.471528727020925);
    assert.equal(rect.originX, 'left');

    rect.adjustPosition('center');
    assert.deepEqual(rect.left, 67.76608177155967);
    assert.deepEqual(rect.top, 67.94305745404185);
    assert.equal(rect.originX, 'center');

    rect.adjustPosition('right');
    assert.deepEqual(rect.left, 84.1491226573395);
    assert.deepEqual(rect.top, 79.41458618106277);
    assert.equal(rect.originX, 'right');

    rect.originX = 'right';
    rect.originY = 'bottom';
    rect.adjustPosition('left');
    assert.deepEqual(rect.left, 51.383040885779835);
    assert.deepEqual(rect.top, 56.47152872702093);
    assert.equal(rect.originX, 'left');

    rect.adjustPosition('center');
    assert.deepEqual(rect.left, 67.76608177155967);
    assert.deepEqual(rect.top, 67.94305745404185);
    assert.equal(rect.originX, 'center');

    rect.adjustPosition('right');
    assert.deepEqual(rect.left, 84.1491226573395);
    assert.deepEqual(rect.top, 79.41458618106277);
    assert.equal(rect.originX, 'right');
  });

  QUnit.test('translateToCenterPoint with numeric origins', function(assert) {
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

  QUnit.test('translateToCenterPointRotated with numeric origins', function(assert) {
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


  QUnit.test('translateToOriginPoint with numeric origins', function(assert) {
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

  QUnit.test('translateToOriginPointRotated with numeric origins', function(assert) {
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


  QUnit.test('toLocalPoint with numeric origins', function(assert) {
    var rect = new fabric.Rect(rectOptions),
        p,
        point = new fabric.Point(15, 20);

    p = rect.toLocalPoint(point, 0.5, 0.5);
    assert.deepEqual(p, new fabric.Point(-42, -67));

    p = rect.toLocalPoint(point, 0.5, 0);
    assert.deepEqual(p, new fabric.Point(-42, -25));

    p = rect.toLocalPoint(point, 0.5, 1);
    assert.deepEqual(p, new fabric.Point(-42, -109));

    p = rect.toLocalPoint(point, 0, 0.5);
    assert.deepEqual(p, new fabric.Point(-20, -67));

    p = rect.toLocalPoint(point, 0, 0);
    assert.deepEqual(p, new fabric.Point(-20, -25));

    p = rect.toLocalPoint(point, 0, 1);
    assert.deepEqual(p, new fabric.Point(-20, -109));

    p = rect.toLocalPoint(point, 1, 0.5);
    assert.deepEqual(p, new fabric.Point(-64, -67));

    p = rect.toLocalPoint(point, 1, 0);
    assert.deepEqual(p, new fabric.Point(-64, -25));

    p = rect.toLocalPoint(point, 1, 1);
    assert.deepEqual(p, new fabric.Point(-64, -109));

    p = rect.toLocalPoint(point);
    assert.deepEqual(p, new fabric.Point(-20, -25));
  });

  QUnit.test('toLocalPointRotated with numeric origins', function(assert) {
    var rect = new fabric.Rect(rectOptions),
        p,
        point = new fabric.Point(15, 20);
    rect.angle = 35;

    p = rect.toLocalPoint(point, 0.5, 0.5);
    assert.deepEqual(p, new fabric.Point(-52.72245179455599, -51.00727238020387));

    p = rect.toLocalPoint(point, 0.5, 0);
    assert.deepEqual(p, new fabric.Point(-52.72245179455599, -9.007272380203872));

    p = rect.toLocalPoint(point, 0.5, 1);
    assert.deepEqual(p, new fabric.Point(-52.72245179455599, -93.00727238020387));

    p = rect.toLocalPoint(point, 0, 0.5);
    assert.deepEqual(p, new fabric.Point(-30.722451794555987, -51.00727238020387));

    p = rect.toLocalPoint(point, 0, 0);
    assert.deepEqual(p, new fabric.Point(-30.722451794555987, -9.007272380203872));

    p = rect.toLocalPoint(point, 0, 1);
    assert.deepEqual(p, new fabric.Point(-30.722451794555987, -93.00727238020387));

    p = rect.toLocalPoint(point, 1, 0.5);
    assert.deepEqual(p, new fabric.Point(-74.722451794556, -51.00727238020387));

    p = rect.toLocalPoint(point, 1, 0);
    assert.deepEqual(p, new fabric.Point(-74.722451794556, -9.007272380203872));

    p = rect.toLocalPoint(point, 1, 1);
    assert.deepEqual(p, new fabric.Point(-74.722451794556, -93.00727238020387));

    p = rect.toLocalPoint(point);
    assert.deepEqual(p, new fabric.Point(-58.791317146942106, -3.9842049203432026));
  });


  QUnit.test('adjustPosition with numeric origins', function(assert) {
    var rect = new fabric.Rect(rectOptions);

    rect.strokeWidth = 0;
    rect.originX = 'left';
    rect.originY = 'top';
    rect.adjustPosition(0);
    assert.deepEqual(rect.left, 35);
    assert.deepEqual(rect.top, 45);
    assert.equal(rect.originX, 0);

    rect.adjustPosition(0.5);
    assert.deepEqual(rect.left, 55);
    assert.deepEqual(rect.top, 45);
    assert.equal(rect.originX, 0.5);

    rect.adjustPosition(1);
    assert.deepEqual(rect.left, 75);
    assert.deepEqual(rect.top, 45);
    assert.equal(rect.originX, 1);

    rect.originX = 0.5;
    rect.originY = 0.5;
    rect.adjustPosition(0);
    assert.deepEqual(rect.left, 55);
    assert.deepEqual(rect.top, 45);
    assert.equal(rect.originX, 0);

    rect.adjustPosition(0.5);
    assert.deepEqual(rect.left, 75);
    assert.deepEqual(rect.top, 45);
    assert.equal(rect.originX, 0.5);

    rect.adjustPosition(1);
    assert.deepEqual(rect.left, 95);
    assert.deepEqual(rect.top, 45);
    assert.equal(rect.originX, 1);

    rect.originX = 1;
    rect.originY = 1;
    rect.adjustPosition(0);
    assert.deepEqual(rect.left, 55);
    assert.deepEqual(rect.top, 45);
    assert.equal(rect.originX, 0);

    rect.adjustPosition(0.5);
    assert.deepEqual(rect.left, 75);
    assert.deepEqual(rect.top, 45);
    assert.equal(rect.originX, 0.5);

    rect.adjustPosition(1);
    assert.deepEqual(rect.left, 95);
    assert.deepEqual(rect.top, 45);
    assert.equal(rect.originX, 1);
  });

  QUnit.test('adjustPositionRotated with numeric origins', function(assert) {
    var rect = new fabric.Rect(rectOptions);

    rect.angle = 35;
    rect.strokeWidth = 0;
    rect.originX = 0;
    rect.originY = 0;
    rect.adjustPosition(0);
    assert.deepEqual(rect.left, 35);
    assert.deepEqual(rect.top, 45);
    assert.equal(rect.originX, 0);

    rect.adjustPosition(0.5);
    assert.deepEqual(rect.left, 51.383040885779835);
    assert.deepEqual(rect.top, 56.471528727020925);
    assert.equal(rect.originX, 0.5);

    rect.adjustPosition(1);
    assert.deepEqual(rect.left, 67.76608177155967);
    assert.deepEqual(rect.top, 67.94305745404185);
    assert.equal(rect.originX, 1);

    rect.originX = 0.5;
    rect.originY = 0.5;
    rect.adjustPosition(0);
    assert.deepEqual(rect.left, 51.383040885779835);
    assert.deepEqual(rect.top, 56.471528727020925);
    assert.equal(rect.originX, 0);

    rect.adjustPosition(0.5);
    assert.deepEqual(rect.left, 67.76608177155967);
    assert.deepEqual(rect.top, 67.94305745404185);
    assert.equal(rect.originX, 0.5);

    rect.adjustPosition(1);
    assert.deepEqual(rect.left, 84.1491226573395);
    assert.deepEqual(rect.top, 79.41458618106277);
    assert.equal(rect.originX, 1);

    rect.originX = 1;
    rect.originY = 1;
    rect.adjustPosition(0);
    assert.deepEqual(rect.left, 51.383040885779835);
    assert.deepEqual(rect.top, 56.47152872702093);
    assert.equal(rect.originX, 0);

    rect.adjustPosition(0.5);
    assert.deepEqual(rect.left, 67.76608177155967);
    assert.deepEqual(rect.top, 67.94305745404185);
    assert.equal(rect.originX, 0.5);

    rect.adjustPosition(1);
    assert.deepEqual(rect.left, 84.1491226573395);
    assert.deepEqual(rect.top, 79.41458618106277);
    assert.equal(rect.originX, 1);
  });

})();
