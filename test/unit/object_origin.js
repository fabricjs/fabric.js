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

  test('getCenterPoint', function(){
    var rect = new fabric.Rect(rectOptions), p;
    p = rect.getCenterPoint();
    deepEqual(p, new fabric.Point(57, 87));
  });

  test('translateToCenterPoint', function(){
    var rect = new fabric.Rect(rectOptions),
        p,
        point = new fabric.Point(15, 20);

    p = rect.translateToCenterPoint(point, 'center', 'center');
    deepEqual(p, new fabric.Point(15, 20));

    p = rect.translateToCenterPoint(point, 'center', 'center');
    deepEqual(p, new fabric.Point(15, 20));

    p = rect.translateToCenterPoint(point, 'center', 'top');
    deepEqual(p, new fabric.Point(15, 62));

    p = rect.translateToCenterPoint(point, 'center', 'bottom');
    deepEqual(p, new fabric.Point(15, -22));

    p = rect.translateToCenterPoint(point, 'left', 'center');
    deepEqual(p, new fabric.Point(37, 20));

    p = rect.translateToCenterPoint(point, 'left', 'top');
    deepEqual(p, new fabric.Point(37, 62));

    p = rect.translateToCenterPoint(point, 'left', 'bottom');
    deepEqual(p, new fabric.Point(37, -22));

    p = rect.translateToCenterPoint(point, 'right', 'center');
    deepEqual(p, new fabric.Point(-7, 20));

    p = rect.translateToCenterPoint(point, 'right', 'top');
    deepEqual(p, new fabric.Point(-7, 62));

    p = rect.translateToCenterPoint(point, 'right', 'bottom');
    deepEqual(p, new fabric.Point(-7, -22));
  });

  test('translateToCenterPointRotated', function(){
    var rect = new fabric.Rect(rectOptions),
        p,
        point = new fabric.Point(15, 20);
    rect.angle = 35;

    p = rect.translateToCenterPoint(point, 'center', 'center');
    deepEqual(p, new fabric.Point(15, 20));

    p = rect.translateToCenterPoint(point, 'center', 'top');
    deepEqual(p, new fabric.Point(-9.090210326743936, 54.40438586013766));

    p = rect.translateToCenterPoint(point, 'center', 'bottom');
    deepEqual(p, new fabric.Point(39.090210326743936, -14.404385860137658));

    p = rect.translateToCenterPoint(point, 'left', 'center');
    deepEqual(p, new fabric.Point(33.02134497435782, 32.61868159972301));

    p = rect.translateToCenterPoint(point, 'left', 'top');
    deepEqual(p, new fabric.Point(8.931134647613884, 67.02306745986067));

    p = rect.translateToCenterPoint(point, 'left', 'bottom');
    deepEqual(p, new fabric.Point(57.11155530110176, -1.7857042604146471));

    p = rect.translateToCenterPoint(point, 'right', 'center');
    deepEqual(p, new fabric.Point(-3.0213449743578202, 7.381318400276987));

    p = rect.translateToCenterPoint(point, 'right', 'top');
    deepEqual(p, new fabric.Point(-27.11155530110176, 41.78570426041465));

    p = rect.translateToCenterPoint(point, 'right', 'bottom');
    deepEqual(p, new fabric.Point(21.068865352386116, -27.02306745986067));
  });


  test('translateToOriginPoint', function(){
    var rect = new fabric.Rect(rectOptions),
        p,
        point = new fabric.Point(15, 20);

    p = rect.translateToOriginPoint(point, 'center', 'center');
    deepEqual(p, new fabric.Point(15, 20));

    p = rect.translateToOriginPoint(point, 'center', 'top');
    deepEqual(p, new fabric.Point(15, -22));

    p = rect.translateToOriginPoint(point, 'center', 'bottom');
    deepEqual(p, new fabric.Point(15, 62));

    p = rect.translateToOriginPoint(point, 'left', 'center');
    deepEqual(p, new fabric.Point(-7, 20));

    p = rect.translateToOriginPoint(point, 'left', 'top');
    deepEqual(p, new fabric.Point(-7, -22));

    p = rect.translateToOriginPoint(point, 'left', 'bottom');
    deepEqual(p, new fabric.Point(-7, 62));

    p = rect.translateToOriginPoint(point, 'right', 'center');
    deepEqual(p, new fabric.Point(37, 20));

    p = rect.translateToOriginPoint(point, 'right', 'top');
    deepEqual(p, new fabric.Point(37, -22));

    p = rect.translateToOriginPoint(point, 'right', 'bottom');
    deepEqual(p, new fabric.Point(37, 62));
  });

  test('translateToOriginPointRotated', function(){
    var rect = new fabric.Rect(rectOptions),
        p,
        point = new fabric.Point(15, 20);
    rect.angle = 35;

    p = rect.translateToOriginPoint(point, 'center', 'center');
    deepEqual(p, new fabric.Point(15, 20));

    p = rect.translateToOriginPoint(point, 'center', 'top');
    deepEqual(p, new fabric.Point(39.090210326743936, -14.404385860137658));

    p = rect.translateToOriginPoint(point, 'center', 'bottom');
    deepEqual(p, new fabric.Point(-9.090210326743936, 54.40438586013766));

    p = rect.translateToOriginPoint(point, 'left', 'center');
    deepEqual(p, new fabric.Point(-3.0213449743578202, 7.381318400276987));

    p = rect.translateToOriginPoint(point, 'left', 'top');
    deepEqual(p, new fabric.Point(21.068865352386116, -27.02306745986067));

    p = rect.translateToOriginPoint(point, 'left', 'bottom');
    deepEqual(p, new fabric.Point(-27.11155530110176, 41.78570426041465));

    p = rect.translateToOriginPoint(point, 'right', 'center');
    deepEqual(p, new fabric.Point(33.02134497435782, 32.61868159972301));

    p = rect.translateToOriginPoint(point, 'right', 'top');
    deepEqual(p, new fabric.Point(57.11155530110176, -1.7857042604146471));

    p = rect.translateToOriginPoint(point, 'right', 'bottom');
    deepEqual(p, new fabric.Point(8.931134647613884, 67.02306745986067));
  });


  test('toLocalPoint', function(){
    var rect = new fabric.Rect(rectOptions),
        p,
        point = new fabric.Point(15, 20);

    p = rect.toLocalPoint(point, 'center', 'center');
    deepEqual(p, new fabric.Point(-42, -67));

    p = rect.toLocalPoint(point, 'center', 'top');
    deepEqual(p, new fabric.Point(-42, -25));

    p = rect.toLocalPoint(point, 'center', 'bottom');
    deepEqual(p, new fabric.Point(-42, -109));

    p = rect.toLocalPoint(point, 'left', 'center');
    deepEqual(p, new fabric.Point(-20, -67));

    p = rect.toLocalPoint(point, 'left', 'top');
    deepEqual(p, new fabric.Point(-20, -25));

    p = rect.toLocalPoint(point, 'left', 'bottom');
    deepEqual(p, new fabric.Point(-20, -109));

    p = rect.toLocalPoint(point, 'right', 'center');
    deepEqual(p, new fabric.Point(-64, -67));

    p = rect.toLocalPoint(point, 'right', 'top');
    deepEqual(p, new fabric.Point(-64, -25));

    p = rect.toLocalPoint(point, 'right', 'bottom');
    deepEqual(p, new fabric.Point(-64, -109));

    p = rect.toLocalPoint(point);
    deepEqual(p, new fabric.Point(-20, -25));
  });

  test('toLocalPointRotated', function(){
    var rect = new fabric.Rect(rectOptions),
        p,
        point = new fabric.Point(15, 20);
    rect.angle = 35;

    p = rect.toLocalPoint(point, 'center', 'center');
    deepEqual(p, new fabric.Point(-52.72245179455599, -51.00727238020387));

    p = rect.toLocalPoint(point, 'center', 'top');
    deepEqual(p, new fabric.Point(-52.72245179455599, -9.007272380203872));

    p = rect.toLocalPoint(point, 'center', 'bottom');
    deepEqual(p, new fabric.Point(-52.72245179455599, -93.00727238020387));

    p = rect.toLocalPoint(point, 'left', 'center');
    deepEqual(p, new fabric.Point(-30.722451794555987, -51.00727238020387));

    p = rect.toLocalPoint(point, 'left', 'top');
    deepEqual(p, new fabric.Point(-30.722451794555987, -9.007272380203872));

    p = rect.toLocalPoint(point, 'left', 'bottom');
    deepEqual(p, new fabric.Point(-30.722451794555987, -93.00727238020387));

    p = rect.toLocalPoint(point, 'right', 'center');
    deepEqual(p, new fabric.Point(-74.722451794556, -51.00727238020387));

    p = rect.toLocalPoint(point, 'right', 'top');
    deepEqual(p, new fabric.Point(-74.722451794556, -9.007272380203872));

    p = rect.toLocalPoint(point, 'right', 'bottom');
    deepEqual(p, new fabric.Point(-74.722451794556, -93.00727238020387));

    p = rect.toLocalPoint(point);
    deepEqual(p, new fabric.Point(-58.791317146942106, -3.9842049203432026));
  });


  test('adjustPosition', function(){
    var rect = new fabric.Rect(rectOptions);

    rect.strokeWidth = 0;
    rect.originX = 'left';
    rect.originY = 'top';
    rect.adjustPosition('left');
    deepEqual(rect.left, 35);
    deepEqual(rect.top, 45);
    equal(rect.originX, 'left');

    rect.adjustPosition('center');
    deepEqual(rect.left, 55);
    deepEqual(rect.top, 45);
    equal(rect.originX, 'center');

    rect.adjustPosition('right');
    deepEqual(rect.left, 75);
    deepEqual(rect.top, 45);
    equal(rect.originX, 'right');

    rect.originX = 'center';
    rect.originY = 'center';
    rect.adjustPosition('left');
    deepEqual(rect.left, 55);
    deepEqual(rect.top, 45);
    equal(rect.originX, 'left');

    rect.adjustPosition('center');
    deepEqual(rect.left, 75);
    deepEqual(rect.top, 45);
    equal(rect.originX, 'center');

    rect.adjustPosition('right');
    deepEqual(rect.left, 95);
    deepEqual(rect.top, 45);
    equal(rect.originX, 'right');

    rect.originX = 'right';
    rect.originY = 'bottom';
    rect.adjustPosition('left');
    deepEqual(rect.left, 55);
    deepEqual(rect.top, 45);
    equal(rect.originX, 'left');

    rect.adjustPosition('center');
    deepEqual(rect.left, 75);
    deepEqual(rect.top, 45);
    equal(rect.originX, 'center');

    rect.adjustPosition('right');
    deepEqual(rect.left, 95);
    deepEqual(rect.top, 45);
    equal(rect.originX, 'right');
  });

  test('adjustPositionRotated', function(){
    var rect = new fabric.Rect(rectOptions);

    rect.angle = 35;
    rect.strokeWidth = 0;
    rect.originX = 'left';
    rect.originY = 'top';
    rect.adjustPosition('left');
    deepEqual(rect.left, 35);
    deepEqual(rect.top, 45);
    equal(rect.originX, 'left');

    rect.adjustPosition('center');
    deepEqual(rect.left, 51.383040885779835);
    deepEqual(rect.top, 56.471528727020925);
    equal(rect.originX, 'center');

    rect.adjustPosition('right');
    deepEqual(rect.left, 67.76608177155967);
    deepEqual(rect.top, 67.94305745404185);
    equal(rect.originX, 'right');

    rect.originX = 'center';
    rect.originY = 'center';
    rect.adjustPosition('left');
    deepEqual(rect.left, 51.383040885779835);
    deepEqual(rect.top, 56.471528727020925);
    equal(rect.originX, 'left');

    rect.adjustPosition('center');
    deepEqual(rect.left, 67.76608177155967);
    deepEqual(rect.top, 67.94305745404185);
    equal(rect.originX, 'center');

    rect.adjustPosition('right');
    deepEqual(rect.left, 84.1491226573395);
    deepEqual(rect.top, 79.41458618106277);
    equal(rect.originX, 'right');

    rect.originX = 'right';
    rect.originY = 'bottom';
    rect.adjustPosition('left');
    deepEqual(rect.left, 51.383040885779835);
    deepEqual(rect.top, 56.47152872702093);
    equal(rect.originX, 'left');

    rect.adjustPosition('center');
    deepEqual(rect.left, 67.76608177155967);
    deepEqual(rect.top, 67.94305745404185);
    equal(rect.originX, 'center');

    rect.adjustPosition('right');
    deepEqual(rect.left, 84.1491226573395);
    deepEqual(rect.top, 79.41458618106277);
    equal(rect.originX, 'right');
  });

  test('translateToCenterPoint with numeric origins', function(){
    var rect = new fabric.Rect(rectOptions),
        p,
        point = new fabric.Point(15, 20);

    p = rect.translateToCenterPoint(point, 0.5, 0.5);
    deepEqual(p, new fabric.Point(15, 20));

    p = rect.translateToCenterPoint(point, 0.5, 0.5);
    deepEqual(p, new fabric.Point(15, 20));

    p = rect.translateToCenterPoint(point, 0.5, 0);
    deepEqual(p, new fabric.Point(15, 62));

    p = rect.translateToCenterPoint(point, 0.5, 1);
    deepEqual(p, new fabric.Point(15, -22));

    p = rect.translateToCenterPoint(point, 0, 0.5);
    deepEqual(p, new fabric.Point(37, 20));

    p = rect.translateToCenterPoint(point, 0, 0);
    deepEqual(p, new fabric.Point(37, 62));

    p = rect.translateToCenterPoint(point, 0, 1);
    deepEqual(p, new fabric.Point(37, -22));

    p = rect.translateToCenterPoint(point, 1, 0.5);
    deepEqual(p, new fabric.Point(-7, 20));

    p = rect.translateToCenterPoint(point, 1, 0);
    deepEqual(p, new fabric.Point(-7, 62));

    p = rect.translateToCenterPoint(point, 1, 1);
    deepEqual(p, new fabric.Point(-7, -22));
  });

  test('translateToCenterPointRotated with numeric origins', function(){
    var rect = new fabric.Rect(rectOptions),
        p,
        point = new fabric.Point(15, 20);
    rect.angle = 35;

    p = rect.translateToCenterPoint(point, 0.5, 0.5);
    deepEqual(p, new fabric.Point(15, 20));

    p = rect.translateToCenterPoint(point, 0.5, 0);
    deepEqual(p, new fabric.Point(-9.090210326743936, 54.40438586013766));

    p = rect.translateToCenterPoint(point, 0.5, 1);
    deepEqual(p, new fabric.Point(39.090210326743936, -14.404385860137658));

    p = rect.translateToCenterPoint(point, 0, 0.5);
    deepEqual(p, new fabric.Point(33.02134497435782, 32.61868159972301));

    p = rect.translateToCenterPoint(point, 0, 0);
    deepEqual(p, new fabric.Point(8.931134647613884, 67.02306745986067));

    p = rect.translateToCenterPoint(point, 0, 1);
    deepEqual(p, new fabric.Point(57.11155530110176, -1.7857042604146471));

    p = rect.translateToCenterPoint(point, 1, 0.5);
    deepEqual(p, new fabric.Point(-3.0213449743578202, 7.381318400276987));

    p = rect.translateToCenterPoint(point, 1, 0);
    deepEqual(p, new fabric.Point(-27.11155530110176, 41.78570426041465));

    p = rect.translateToCenterPoint(point, 1, 1);
    deepEqual(p, new fabric.Point(21.068865352386116, -27.02306745986067));
  });


  test('translateToOriginPoint with numeric origins', function(){
    var rect = new fabric.Rect(rectOptions),
        p,
        point = new fabric.Point(15, 20);

    p = rect.translateToOriginPoint(point, 0.5, 0.5);
    deepEqual(p, new fabric.Point(15, 20));

    p = rect.translateToOriginPoint(point, 0.5, 0);
    deepEqual(p, new fabric.Point(15, -22));

    p = rect.translateToOriginPoint(point, 0.5, 1);
    deepEqual(p, new fabric.Point(15, 62));

    p = rect.translateToOriginPoint(point, 0, 0.5);
    deepEqual(p, new fabric.Point(-7, 20));

    p = rect.translateToOriginPoint(point, 0, 0);
    deepEqual(p, new fabric.Point(-7, -22));

    p = rect.translateToOriginPoint(point, 0, 1);
    deepEqual(p, new fabric.Point(-7, 62));

    p = rect.translateToOriginPoint(point, 1, 0.5);
    deepEqual(p, new fabric.Point(37, 20));

    p = rect.translateToOriginPoint(point, 1, 0);
    deepEqual(p, new fabric.Point(37, -22));

    p = rect.translateToOriginPoint(point, 1, 1);
    deepEqual(p, new fabric.Point(37, 62));
  });

  test('translateToOriginPointRotated with numeric origins', function(){
    var rect = new fabric.Rect(rectOptions),
        p,
        point = new fabric.Point(15, 20);
    rect.angle = 35;

    p = rect.translateToOriginPoint(point, 0.5, 0.5);
    deepEqual(p, new fabric.Point(15, 20));

    p = rect.translateToOriginPoint(point, 0.5, 0);
    deepEqual(p, new fabric.Point(39.090210326743936, -14.404385860137658));

    p = rect.translateToOriginPoint(point, 0.5, 1);
    deepEqual(p, new fabric.Point(-9.090210326743936, 54.40438586013766));

    p = rect.translateToOriginPoint(point, 0, 0.5);
    deepEqual(p, new fabric.Point(-3.0213449743578202, 7.381318400276987));

    p = rect.translateToOriginPoint(point, 0, 0);
    deepEqual(p, new fabric.Point(21.068865352386116, -27.02306745986067));

    p = rect.translateToOriginPoint(point, 0, 1);
    deepEqual(p, new fabric.Point(-27.11155530110176, 41.78570426041465));

    p = rect.translateToOriginPoint(point, 1, 0.5);
    deepEqual(p, new fabric.Point(33.02134497435782, 32.61868159972301));

    p = rect.translateToOriginPoint(point, 1, 0);
    deepEqual(p, new fabric.Point(57.11155530110176, -1.7857042604146471));

    p = rect.translateToOriginPoint(point, 1, 1);
    deepEqual(p, new fabric.Point(8.931134647613884, 67.02306745986067));
  });


  test('toLocalPoint with numeric origins', function(){
    var rect = new fabric.Rect(rectOptions),
        p,
        point = new fabric.Point(15, 20);

    p = rect.toLocalPoint(point, 0.5, 0.5);
    deepEqual(p, new fabric.Point(-42, -67));

    p = rect.toLocalPoint(point, 0.5, 0);
    deepEqual(p, new fabric.Point(-42, -25));

    p = rect.toLocalPoint(point, 0.5, 1);
    deepEqual(p, new fabric.Point(-42, -109));

    p = rect.toLocalPoint(point, 0, 0.5);
    deepEqual(p, new fabric.Point(-20, -67));

    p = rect.toLocalPoint(point, 0, 0);
    deepEqual(p, new fabric.Point(-20, -25));

    p = rect.toLocalPoint(point, 0, 1);
    deepEqual(p, new fabric.Point(-20, -109));

    p = rect.toLocalPoint(point, 1, 0.5);
    deepEqual(p, new fabric.Point(-64, -67));

    p = rect.toLocalPoint(point, 1, 0);
    deepEqual(p, new fabric.Point(-64, -25));

    p = rect.toLocalPoint(point, 1, 1);
    deepEqual(p, new fabric.Point(-64, -109));

    p = rect.toLocalPoint(point);
    deepEqual(p, new fabric.Point(-20, -25));
  });

  test('toLocalPointRotated with numeric origins', function(){
    var rect = new fabric.Rect(rectOptions),
        p,
        point = new fabric.Point(15, 20);
    rect.angle = 35;

    p = rect.toLocalPoint(point, 0.5, 0.5);
    deepEqual(p, new fabric.Point(-52.72245179455599, -51.00727238020387));

    p = rect.toLocalPoint(point, 0.5, 0);
    deepEqual(p, new fabric.Point(-52.72245179455599, -9.007272380203872));

    p = rect.toLocalPoint(point, 0.5, 1);
    deepEqual(p, new fabric.Point(-52.72245179455599, -93.00727238020387));

    p = rect.toLocalPoint(point, 0, 0.5);
    deepEqual(p, new fabric.Point(-30.722451794555987, -51.00727238020387));

    p = rect.toLocalPoint(point, 0, 0);
    deepEqual(p, new fabric.Point(-30.722451794555987, -9.007272380203872));

    p = rect.toLocalPoint(point, 0, 1);
    deepEqual(p, new fabric.Point(-30.722451794555987, -93.00727238020387));

    p = rect.toLocalPoint(point, 1, 0.5);
    deepEqual(p, new fabric.Point(-74.722451794556, -51.00727238020387));

    p = rect.toLocalPoint(point, 1, 0);
    deepEqual(p, new fabric.Point(-74.722451794556, -9.007272380203872));

    p = rect.toLocalPoint(point, 1, 1);
    deepEqual(p, new fabric.Point(-74.722451794556, -93.00727238020387));

    p = rect.toLocalPoint(point);
    deepEqual(p, new fabric.Point(-58.791317146942106, -3.9842049203432026));
  });


  test('adjustPosition with numeric origins', function(){
    var rect = new fabric.Rect(rectOptions);

    rect.strokeWidth = 0;
    rect.originX = 'left';
    rect.originY = 'top';
    rect.adjustPosition(0);
    deepEqual(rect.left, 35);
    deepEqual(rect.top, 45);
    equal(rect.originX, 0);

    rect.adjustPosition(0.5);
    deepEqual(rect.left, 55);
    deepEqual(rect.top, 45);
    equal(rect.originX, 0.5);

    rect.adjustPosition(1);
    deepEqual(rect.left, 75);
    deepEqual(rect.top, 45);
    equal(rect.originX, 1);

    rect.originX = 0.5;
    rect.originY = 0.5;
    rect.adjustPosition(0);
    deepEqual(rect.left, 55);
    deepEqual(rect.top, 45);
    equal(rect.originX, 0);

    rect.adjustPosition(0.5);
    deepEqual(rect.left, 75);
    deepEqual(rect.top, 45);
    equal(rect.originX, 0.5);

    rect.adjustPosition(1);
    deepEqual(rect.left, 95);
    deepEqual(rect.top, 45);
    equal(rect.originX, 1);

    rect.originX = 1;
    rect.originY = 1;
    rect.adjustPosition(0);
    deepEqual(rect.left, 55);
    deepEqual(rect.top, 45);
    equal(rect.originX, 0);

    rect.adjustPosition(0.5);
    deepEqual(rect.left, 75);
    deepEqual(rect.top, 45);
    equal(rect.originX, 0.5);

    rect.adjustPosition(1);
    deepEqual(rect.left, 95);
    deepEqual(rect.top, 45);
    equal(rect.originX, 1);
  });

  test('adjustPositionRotated with numeric origins', function(){
    var rect = new fabric.Rect(rectOptions);

    rect.angle = 35;
    rect.strokeWidth = 0;
    rect.originX = 0;
    rect.originY = 0;
    rect.adjustPosition(0);
    deepEqual(rect.left, 35);
    deepEqual(rect.top, 45);
    equal(rect.originX, 0);

    rect.adjustPosition(0.5);
    deepEqual(rect.left, 51.383040885779835);
    deepEqual(rect.top, 56.471528727020925);
    equal(rect.originX, 0.5);

    rect.adjustPosition(1);
    deepEqual(rect.left, 67.76608177155967);
    deepEqual(rect.top, 67.94305745404185);
    equal(rect.originX, 1);

    rect.originX = 0.5;
    rect.originY = 0.5;
    rect.adjustPosition(0);
    deepEqual(rect.left, 51.383040885779835);
    deepEqual(rect.top, 56.471528727020925);
    equal(rect.originX, 0);

    rect.adjustPosition(0.5);
    deepEqual(rect.left, 67.76608177155967);
    deepEqual(rect.top, 67.94305745404185);
    equal(rect.originX, 0.5);

    rect.adjustPosition(1);
    deepEqual(rect.left, 84.1491226573395);
    deepEqual(rect.top, 79.41458618106277);
    equal(rect.originX, 1);

    rect.originX = 1;
    rect.originY = 1;
    rect.adjustPosition(0);
    deepEqual(rect.left, 51.383040885779835);
    deepEqual(rect.top, 56.47152872702093);
    equal(rect.originX, 0);

    rect.adjustPosition(0.5);
    deepEqual(rect.left, 67.76608177155967);
    deepEqual(rect.top, 67.94305745404185);
    equal(rect.originX, 0.5);

    rect.adjustPosition(1);
    deepEqual(rect.left, 84.1491226573395);
    deepEqual(rect.top, 79.41458618106277);
    equal(rect.originX, 1);
  });

})();
