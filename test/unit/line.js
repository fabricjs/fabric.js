(function(){

  var LINE_OBJECT = {
    version:                  fabric.version,
    type:                     'Line',
    originX:                  'left',
    originY:                  'top',
    left:                     10.5,
    top:                      11.5,
    width:                    2,
    height:                   2,
    fill:                     'rgb(0,0,0)',
    stroke:                   null,
    strokeWidth:              1,
    strokeDashArray:          null,
    strokeLineCap:            'butt',
    strokeDashOffset:         0,
    strokeLineJoin:           'miter',
    strokeMiterLimit:         4,
    scaleX:                   1,
    scaleY:                   1,
    angle:                    0,
    flipX:                    false,
    flipY:                    false,
    opacity:                  1,
    x1:                       -1,
    y1:                       -1,
    x2:                       1,
    y2:                       1,
    shadow:                   null,
    visible:                  true,
    backgroundColor:          '',
    fillRule:                 'nonzero',
    paintFirst:               'fill',
    globalCompositeOperation: 'source-over',
    skewX:                    0,
    skewY:                    0,
    strokeUniform:            false
  };

  QUnit.module('fabric.Line');

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Line);
    var line = new fabric.Line([10, 11, 20, 21]);

    assert.ok(line instanceof fabric.Line);
    assert.ok(line instanceof fabric.Object);

    assert.equal(line.constructor.name, 'Line');

    assert.equal(line.get('x1'), 10);
    assert.equal(line.get('y1'), 11);
    assert.equal(line.get('x2'), 20);
    assert.equal(line.get('y2'), 21);

    var lineWithoutPoints = new fabric.Line();

    assert.equal(lineWithoutPoints.get('x1'), 0);
    assert.equal(lineWithoutPoints.get('y1'), 0);
    assert.equal(lineWithoutPoints.get('x2'), 0);
    assert.equal(lineWithoutPoints.get('y2'), 0);
  });

  QUnit.test('complexity', function(assert) {
    var line = new fabric.Line();
    assert.ok(typeof line.complexity === 'function');
  });

  QUnit.test('toSVG', function(assert) {
    var line = new fabric.Line([11, 12, 13, 14]);
    var EXPECTED_SVG = '<g transform=\"matrix(1 0 0 1 12 13)\"  >\n<line style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x1=\"-1\" y1=\"-1\" x2=\"1\" y2=\"1\" />\n</g>\n';
    assert.equal(line.toSVG(), EXPECTED_SVG);
  });

  QUnit.test('toObject', function(assert) {
    var line = new fabric.Line([11, 12, 13, 14]);
    assert.ok(typeof line.toObject === 'function');
    assert.deepEqual(LINE_OBJECT, line.toObject());
  });

  QUnit.test('fromObject', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.Line.fromObject === 'function');
    fabric.Line.fromObject(LINE_OBJECT).then(function(line) {
      assert.ok(line instanceof fabric.Line);
      assert.deepEqual(LINE_OBJECT, line.toObject());
      done();
    });
  });

  QUnit.test('fromElement', function(assert) {
    assert.ok(typeof fabric.Line.fromElement === 'function');

    var namespace        = 'http://www.w3.org/2000/svg';
    var lineEl           = fabric.getDocument().createElementNS(namespace, 'line'),
        x1               = 11,
        y1               = 23,
        x2               = 34,
        y2               = 7,
        stroke           = 'ff5555',
        strokeWidth      = 2,
        strokeDashArray  = [5, 2],
        strokeLineCap    = 'round',
        strokeLineJoin   = 'bevel',
        strokeMiterLimit = 5;

    lineEl.setAttributeNS(namespace, 'x1', x1);
    lineEl.setAttributeNS(namespace, 'x2', x2);
    lineEl.setAttributeNS(namespace, 'y1', y1);
    lineEl.setAttributeNS(namespace, 'y2', y2);
    lineEl.setAttributeNS(namespace, 'stroke', stroke);
    lineEl.setAttributeNS(namespace, 'stroke-width', strokeWidth);
    lineEl.setAttributeNS(namespace, 'stroke-dasharray', '5, 2');
    lineEl.setAttributeNS(namespace, 'stroke-linecap', strokeLineCap);
    lineEl.setAttributeNS(namespace, 'stroke-linejoin', strokeLineJoin);
    lineEl.setAttributeNS(namespace, 'stroke-miterlimit', strokeMiterLimit);

    fabric.Line.fromElement(lineEl, function(oLine) {
      assert.ok(oLine instanceof fabric.Line);

      assert.equal(oLine.get('x1'), x1);
      assert.equal(oLine.get('y1'), y1);
      assert.equal(oLine.get('x2'), x2);
      assert.equal(oLine.get('y2'), y2);
      assert.equal(oLine.get('stroke'), stroke);
      assert.equal(oLine.get('strokeWidth'), strokeWidth);
      assert.deepEqual(oLine.get('strokeDashArray'), strokeDashArray);
      assert.equal(oLine.get('strokeLineCap'), strokeLineCap);
      assert.equal(oLine.get('strokeLineJoin'), strokeLineJoin);
      assert.equal(oLine.get('strokeMiterLimit'), strokeMiterLimit);

      var lineElWithMissingAttributes = fabric.getDocument().createElementNS(namespace, 'line');
      lineElWithMissingAttributes.setAttributeNS(namespace, 'x1', 10);
      lineElWithMissingAttributes.setAttributeNS(namespace, 'y1', 20);

      fabric.Line.fromElement(lineElWithMissingAttributes, function(oLine2) {
        assert.equal(oLine2.get('x2'), 0, 'missing attributes count as 0 values');
        assert.equal(oLine2.get('y2'), 0, 'missing attributes count as 0 values');
      });
    });
  });

  QUnit.test('straight lines may have 0 width or height', function(assert) {
    var line1 = new fabric.Line([10,10,100,10]),
        line2 = new fabric.Line([10,10,10,100]);

    assert.equal(line1.get('height'), 0);
    assert.equal(line2.get('width'), 0);
  });

  QUnit.test('changing x/y coords should update width/height', function(assert) {
    var line = new fabric.Line([50, 50, 100, 100]);

    assert.equal(50, line.width);

    line.set({ x1: 75, y1: 75, x2: 175, y2: 175 });

    assert.equal(100, line.width);
    assert.equal(100, line.height);
  });

  QUnit.test('stroke-width in a style', function(assert) {
    var namespace = 'http://www.w3.org/2000/svg';
    var lineEl = fabric.getDocument().createElementNS(namespace, 'line');
    lineEl.setAttribute('style', 'stroke-width:4');
    fabric.Line.fromElement(lineEl, function(oLine) {
      assert.ok(4, oLine.strokeWidth);
    });
  });

  ['left', 'center', 'right'].forEach((originX) => {
    ['top', 'center', 'bottom'].forEach((originY) => {
      [0, 7].forEach((strokeWidth) => {
        [0, 33, 90].forEach((angle) => {
          ['butt', 'round', 'square'].forEach((strokeLineCap) => {
            QUnit.test(`Regardless of strokeWidth or origin, a line is always positioned on its center when left/top are not specified (${originX}/${originY} stroke:${strokeWidth} angle:${angle} cap:${strokeLineCap})`, function(assert) {
              const line = new fabric.Line([1, 1, 15, 7], {
                strokeWidth,
                originX,
                originY,
                angle,
                strokeLineCap,
              });
              const center = line.getCenterPoint();
              assert.equal(Math.round(center.x), 8);
              assert.equal(Math.round(center.y), 4);
            });
          });
        });
      });
    });
  });

})();
