(function() {

  var REFERENCE_RECT = {
    'version':                  fabric.version,
    'type':                     'rect',
    'originX':                  'left',
    'originY':                  'top',
    'left':                     0,
    'top':                      0,
    'width':                    0,
    'height':                   0,
    'fill':                     'rgb(0,0,0)',
    'stroke':                   null,
    'strokeWidth':              1,
    'strokeDashArray':          null,
    'strokeLineCap':            'butt',
    'strokeDashOffset':         0,
    'strokeLineJoin':           'miter',
    'strokeMiterLimit':         4,
    'scaleX':                   1,
    'scaleY':                   1,
    'angle':                    0,
    'flipX':                    false,
    'flipY':                    false,
    'opacity':                  1,
    'shadow':                   null,
    'visible':                  true,
    'backgroundColor':          '',
    'clipTo':                   null,
    'fillRule':                 'nonzero',
    'paintFirst':               'fill',
    'globalCompositeOperation': 'source-over',
    'transformMatrix':          null,
    'rx':                       0,
    'ry':                       0,
    'skewX':                    0,
    'skewY':                    0
  };

  QUnit.module('fabric.Rect');

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Rect);

    var rect = new fabric.Rect();

    assert.ok(rect instanceof fabric.Rect);
    assert.ok(rect instanceof fabric.Object);

    assert.deepEqual(rect.get('type'), 'rect');
  });

  QUnit.test('complexity', function(assert) {
    var rect = new fabric.Rect();

    assert.ok(typeof rect.complexity === 'function');
  });

  QUnit.test('cache properties', function(assert) {
    var rect = new fabric.Rect();

    assert.ok(rect.cacheProperties.indexOf('rx') > -1, 'rx is in cacheProperties array');
    assert.ok(rect.cacheProperties.indexOf('ry') > -1, 'ry is in cacheProperties array');
  });

  QUnit.test('toObject', function(assert) {
    var rect = new fabric.Rect();
    assert.ok(typeof rect.toObject === 'function');

    var object = rect.toObject();
    assert.deepEqual(object, REFERENCE_RECT);
  });

  QUnit.test('fabric.Rect.fromObject', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.Rect.fromObject === 'function');

    fabric.Rect.fromObject(REFERENCE_RECT, function(rect) {
      assert.ok(rect instanceof fabric.Rect);
      assert.deepEqual(rect.toObject(), REFERENCE_RECT);

      var expectedObject = fabric.util.object.extend({ }, REFERENCE_RECT);
      expectedObject.fill = {'type': 'linear','coords': {'x1': 0,'y1': 0,'x2': 200,'y2': 0},'colorStops': [{'offset': '0','color': 'rgb(255,0,0)','opacity': 1},{'offset': '1','color': 'rgb(0,0,255)','opacity': 1}],'offsetX': 0,'offsetY': 0};
      expectedObject.stroke = {'type': 'linear','coords': {'x1': 0,'y1': 0,'x2': 200,'y2': 0},'colorStops': [{'offset': '0','color': 'rgb(255,0,0)','opacity': 1},{'offset': '1','color': 'rgb(0,0,255)','opacity': 1}],'offsetX': 0,'offsetY': 0};
      fabric.Rect.fromObject(expectedObject, function(rect2) {
        assert.ok(rect2.fill instanceof fabric.Gradient);
        assert.ok(rect2.stroke instanceof fabric.Gradient);
        done();
      });
    });
  });

  QUnit.test('fabric.Rect.fromObject with pattern fill', function(assert) {
    var done = assert.async();
    var fillObj = {
      type: 'pattern',
      source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg=='
    };
    fabric.Rect.fromObject({ fill: fillObj }, function(rect) {
      assert.ok(rect.fill instanceof fabric.Pattern);
      done();
    });
  });

  QUnit.test('fabric.Rect.fromElement', function(assert) {
    assert.ok(typeof fabric.Rect.fromElement === 'function');

    var elRect = fabric.document.createElement('rect');
    fabric.Rect.fromElement(elRect, function(rect) {
      var expectedObject = fabric.util.object.extend({ }, REFERENCE_RECT);
      expectedObject.visible = false;
      assert.ok(rect instanceof fabric.Rect);
      assert.deepEqual(rect.toObject(), expectedObject);
    });
  });

  QUnit.test('fabric.Rect.fromElement with custom attributes', function(assert) {
    var elRectWithAttrs = fabric.document.createElement('rect');

    elRectWithAttrs.setAttribute('x', 10);
    elRectWithAttrs.setAttribute('y', 20);
    elRectWithAttrs.setAttribute('width', 222);
    elRectWithAttrs.setAttribute('height', 333);
    elRectWithAttrs.setAttribute('rx', 11);
    elRectWithAttrs.setAttribute('ry', 12);
    elRectWithAttrs.setAttribute('fill', 'rgb(255,255,255)');
    elRectWithAttrs.setAttribute('opacity', 0.45);
    elRectWithAttrs.setAttribute('stroke', 'blue');
    elRectWithAttrs.setAttribute('stroke-width', 3);
    elRectWithAttrs.setAttribute('stroke-dasharray', '5, 2');
    elRectWithAttrs.setAttribute('stroke-linecap', 'round');
    elRectWithAttrs.setAttribute('stroke-linejoin', 'bevil');
    elRectWithAttrs.setAttribute('stroke-miterlimit', 5);
    //elRectWithAttrs.setAttribute('transform', 'translate(-10,-20) scale(2) rotate(45) translate(5,10)');

    fabric.Rect.fromElement(elRectWithAttrs, function(rectWithAttrs) {
      assert.ok(rectWithAttrs instanceof fabric.Rect);
      var expectedObject = fabric.util.object.extend(REFERENCE_RECT, {
        left:             10,
        top:              20,
        width:            222,
        height:           333,
        fill:             'rgb(255,255,255)',
        opacity:          0.45,
        stroke:           'blue',
        strokeWidth:      3,
        strokeDashArray:  [5, 2],
        strokeLineCap:    'round',
        strokeLineJoin:   'bevil',
        strokeMiterLimit: 5,
        rx:               11,
        ry:               12
      });
      assert.deepEqual(rectWithAttrs.toObject(), expectedObject);
    });
  });

  QUnit.test('empty fromElement', function(assert) {
    fabric.Rect.fromElement(null, function(rect) {
      assert.equal(rect, null);
    });
  });

  QUnit.test('clone with rounded corners', function(assert) {
    var rect = new fabric.Rect({ width: 100, height: 100, rx: 20, ry: 30 });
    rect.clone(function(clone) {
      assert.equal(clone.get('rx'), rect.get('rx'));
      assert.equal(clone.get('ry'), rect.get('ry'));
    });
  });

  QUnit.test('toSVG with rounded corners', function(assert) {
    var rect = new fabric.Rect({ width: 100, height: 100, rx: 20, ry: 30, strokeWidth: 0 });
    var svg = rect.toSVG();

    assert.equal(svg, '<g transform=\"matrix(1 0 0 1 50 50)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-50\" y=\"-50\" rx=\"20\" ry=\"30\" width=\"100\" height=\"100\" />\n</g>\n');
  });

  QUnit.test('toSVG with alpha colors fill', function(assert) {
    var rect = new fabric.Rect({ width: 100, height: 100, strokeWidth: 0, fill: 'rgba(255, 0, 0, 0.5)' });
    var svg = rect.toSVG();
    assert.equal(svg, '<g transform=\"matrix(1 0 0 1 50 50)\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,0,0); fill-opacity: 0.5; fill-rule: nonzero; opacity: 1;\"  x=\"-50\" y=\"-50\" rx=\"0\" ry=\"0\" width=\"100\" height=\"100\" />\n</g>\n');
  });

  QUnit.test('toSVG with id', function(assert) {
    var rect = new fabric.Rect({id: 'myRect', width: 100, height: 100, strokeWidth: 0, fill: 'rgba(255, 0, 0, 0.5)' });
    var svg = rect.toSVG();
    assert.equal(svg, '<g transform=\"matrix(1 0 0 1 50 50)\" id=\"myRect\"  >\n<rect style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,0,0); fill-opacity: 0.5; fill-rule: nonzero; opacity: 1;\"  x=\"-50\" y=\"-50\" rx=\"0\" ry=\"0\" width=\"100\" height=\"100\" />\n</g>\n');
  });

  QUnit.test('toSVG with alpha colors stroke', function(assert) {
    var rect = new fabric.Rect({ width: 100, height: 100, strokeWidth: 0, fill: '', stroke: 'rgba(255, 0, 0, 0.5)' });
    var svg = rect.toSVG();
    assert.equal(svg, '<g transform=\"matrix(1 0 0 1 50 50)\"  >\n<rect style=\"stroke: rgb(255,0,0); stroke-opacity: 0.5; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;\"  x=\"-50\" y=\"-50\" rx=\"0\" ry=\"0\" width=\"100\" height=\"100\" />\n</g>\n');
  });

  QUnit.test('toSVG with paintFirst set to stroke', function(assert) {
    var rect = new fabric.Rect({ width: 100, height: 100, paintFirst: 'stroke' });
    var svg = rect.toSVG();
    assert.equal(svg, '<g transform=\"matrix(1 0 0 1 50.5 50.5)\"  >\n<rect style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  paint-order=\"stroke\"  x=\"-50\" y=\"-50\" rx=\"0\" ry=\"0\" width=\"100\" height=\"100\" />\n</g>\n');
  });

  QUnit.test('toObject without default values', function(assert) {
    var options = { type: 'rect', width: 69, height: 50, left: 10, top: 20, version: fabric.version, };
    var rect = new fabric.Rect(options);
    rect.includeDefaultValues = false;
    assert.deepEqual(rect.toObject(), options);
  });

  QUnit.test('paintFirst life cycle', function(assert) {
    var done = assert.async();
    var svg = '<svg><rect x="10" y="10" height="50" width="55" fill="red" stroke="blue" paint-order="stroke" /></svg>';
    fabric.loadSVGFromString(svg, function(envlivedObjects) {
      var rect = envlivedObjects[0];
      var rectObject = rect.toObject();
      var rectSvg = rect.toSVG();
      assert.equal(rect.paintFirst, 'stroke');
      assert.equal(rectObject.paintFirst, 'stroke');
      assert.ok(rectSvg.indexOf('paint-order="stroke"') > -1);
      done();
    });
  });
})();
