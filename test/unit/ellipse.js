(function(){

  QUnit.module('fabric.Ellipse', {

  });

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Ellipse);

    var ellipse = new fabric.Ellipse();

    assert.ok(ellipse instanceof fabric.Ellipse, 'should inherit from fabric.Ellipse');
    assert.ok(ellipse instanceof fabric.Object, 'should inherit from fabric.Object');

    assert.equal(ellipse.constructor.name, 'Ellipse');
  });

  QUnit.test('complexity', function(assert) {
    var ellipse = new fabric.Ellipse();
    assert.ok(typeof ellipse.complexity === 'function');
    assert.equal(ellipse.complexity(), 1);
  });

  QUnit.test('toObject', function(assert) {
    var ellipse = new fabric.Ellipse();
    var defaultProperties = {
      version:                  fabric.version,
      type:                     'Ellipse',
      originX:                  'left',
      originY:                  'top',
      left:                     0,
      top:                      0,
      width:                    0,
      height:                   0,
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
      skewX:                    0,
      skewY:                    0,
      rx:                       0,
      ry:                       0,
      shadow:                   null,
      visible:                  true,
      backgroundColor:          '',
      fillRule:                 'nonzero',
      paintFirst:               'fill',
      globalCompositeOperation: 'source-over',
      strokeUniform:            false,
    };
    assert.ok(typeof ellipse.toObject === 'function');
    assert.deepEqual(ellipse.toObject(), defaultProperties);

    ellipse.set('left', 100);
    ellipse.set('top', 200);
    ellipse.set('rx', 15);
    ellipse.set('ry', 25);

    assert.deepEqual(ellipse.toObject(), {
      ...defaultProperties,
      left: 100,
      top: 200,
      rx: 15,
      ry: 25,
      width: 30,
      height: 50
    });

    ellipse.set('rx', 30);
    assert.deepEqual(ellipse.width, ellipse.rx * 2);

    ellipse.set('scaleX', 2);
    assert.deepEqual(ellipse.getRx(), ellipse.rx * ellipse.scaleX);
  });

  QUnit.test('toObject without defaults', function(assert) {
    const circle = new fabric.Ellipse({
      includeDefaultValues: false,
    });
    assert.deepEqual(circle.toObject(), {
      type: "Ellipse",
      version: fabric.version,
      left: 0,
      top: 0
    });
  });

  QUnit.test('isNotVisible', function(assert) {
    var ellipse = new fabric.Ellipse();
    ellipse.set('rx', 0);
    ellipse.set('ry', 0);

    assert.equal(ellipse.isNotVisible(), false, 'isNotVisible false when rx/ry are 0 because strokeWidth is > 0');

    ellipse.set('strokeWidth', 0);

    assert.equal(ellipse.isNotVisible(), true, 'should not render anymore with also strokeWidth 0');

  });

  QUnit.test('toSVG', function(assert) {
    var ellipse = new fabric.Ellipse({ rx: 100, ry: 12, fill: 'red', stroke: 'blue' });
    assert.equalSVG(ellipse.toSVG(), '<g transform=\"matrix(1 0 0 1 100.5 12.5)\"  >\n<ellipse style=\"stroke: rgb(0,0,255); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,0,0); fill-rule: nonzero; opacity: 1;\"  cx=\"0\" cy=\"0\" rx=\"100\" ry=\"12\" />\n</g>\n', 'SVG should match');
    assert.equalSVG(ellipse.toClipPathSVG(), '\t<ellipse transform=\"matrix(1 0 0 1 100.5 12.5)\" cx=\"0\" cy=\"0\" rx=\"100\" ry=\"12\" />\n', 'SVG clippath should match');
  });

  QUnit.test('toSVG with a clipPath', function(assert) {
    var ellipse = new fabric.Ellipse({ rx: 100, ry: 12, fill: 'red', stroke: 'blue' });
    ellipse.clipPath = new fabric.Ellipse({ rx: 12, ry: 100, left: 60, top: -50 });
    assert.equalSVG(ellipse.toSVG(), '<g transform=\"matrix(1 0 0 1 100.5 12.5)\" clip-path=\"url(#CLIPPATH_0)\"  >\n<clipPath id=\"CLIPPATH_0\" >\n\t<ellipse transform=\"matrix(1 0 0 1 72.5 50.5)\" cx=\"0\" cy=\"0\" rx=\"12\" ry=\"100\" />\n</clipPath>\n<ellipse style=\"stroke: rgb(0,0,255); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,0,0); fill-rule: nonzero; opacity: 1;\"  cx=\"0\" cy=\"0\" rx=\"100\" ry=\"12\" />\n</g>\n', 'SVG with clipPath should match');
  });

  QUnit.test('toSVG with a clipPath absolute positioned', function(assert) {
    var ellipse = new fabric.Ellipse({ rx: 100, ry: 12, fill: 'red', stroke: 'blue' });
    ellipse.clipPath = new fabric.Ellipse({ rx: 12, ry: 100, left: 60, top: -50 });
    ellipse.clipPath.absolutePositioned = true;
    assert.equalSVG(ellipse.toSVG(), '<g clip-path=\"url(#CLIPPATH_0)\"  >\n<g transform=\"matrix(1 0 0 1 100.5 12.5)\"  >\n<clipPath id=\"CLIPPATH_0\" >\n\t<ellipse transform=\"matrix(1 0 0 1 72.5 50.5)\" cx=\"0\" cy=\"0\" rx=\"12\" ry=\"100\" />\n</clipPath>\n<ellipse style=\"stroke: rgb(0,0,255); stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,0,0); fill-rule: nonzero; opacity: 1;\"  cx=\"0\" cy=\"0\" rx=\"100\" ry=\"12\" />\n</g>\n</g>\n', 'SVG with clipPath should match');
  });

  QUnit.test('fromElement', function(assert) {
    assert.ok(typeof fabric.Ellipse.fromElement === 'function');

    var namespace        = 'http://www.w3.org/2000/svg';
    var elEllipse        = fabric.getDocument().createElementNS(namespace, 'ellipse'),
        rx               = 5,
        ry               = 7,
        left             = 12,
        top              = 15,
        fill             = 'ff5555',
        opacity          = 0.5,
        strokeWidth      = 2,
        strokeDashArray  = [5, 2],
        strokeLineCap    = 'round',
        strokeLineJoin   = 'bevel',
        strokeMiterLimit = 5;

    elEllipse.setAttributeNS(namespace, 'rx', rx);
    elEllipse.setAttributeNS(namespace, 'ry', ry);
    elEllipse.setAttributeNS(namespace, 'cx', left);
    elEllipse.setAttributeNS(namespace, 'cy', top);
    elEllipse.setAttributeNS(namespace, 'fill', fill);
    elEllipse.setAttributeNS(namespace, 'opacity', opacity);
    elEllipse.setAttributeNS(namespace, 'stroke-width', strokeWidth);
    elEllipse.setAttributeNS(namespace, 'stroke-dasharray', '5, 2');
    elEllipse.setAttributeNS(namespace, 'stroke-linecap', strokeLineCap);
    elEllipse.setAttributeNS(namespace, 'stroke-linejoin', strokeLineJoin);
    elEllipse.setAttributeNS(namespace, 'stroke-miterlimit', strokeMiterLimit);

    fabric.Ellipse.fromElement(elEllipse, function(oEllipse) {
      assert.ok(oEllipse instanceof fabric.Ellipse);
      assert.equal(oEllipse.get('rx'), rx);
      assert.equal(oEllipse.get('ry'), ry);
      assert.equal(oEllipse.get('left'), left - rx);
      assert.equal(oEllipse.get('top'), top - ry);
      assert.equal(oEllipse.get('fill'), fill);
      assert.equal(oEllipse.get('opacity'), opacity);
      assert.equal(oEllipse.get('strokeWidth'), strokeWidth);
      assert.deepEqual(oEllipse.get('strokeDashArray'), strokeDashArray);
      assert.equal(oEllipse.get('strokeLineCap'), strokeLineCap);
      assert.equal(oEllipse.get('strokeLineJoin'), strokeLineJoin);
      assert.equal(oEllipse.get('strokeMiterLimit'), strokeMiterLimit);
    });
  });

  QUnit.test('fromObject', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.Ellipse === 'function');

    var left    = 112,
        top     = 234,
        rx      = 13.45,
        ry      = 14.78,
        fill    = 'ff5555';

    fabric.Ellipse.fromObject({
      left: left, top: top, rx: rx, ry: ry, fill: fill
    }).then(function(ellipse) {
      assert.ok(ellipse instanceof fabric.Ellipse);

      assert.equal(ellipse.get('left'), left);
      assert.equal(ellipse.get('top'), top);
      assert.equal(ellipse.get('rx'), rx);
      assert.equal(ellipse.get('ry'), ry);
      assert.equal(ellipse.get('fill'), fill);

      var expected = ellipse.toObject();
      fabric.Ellipse.fromObject(expected).then(function(actual) {
        assert.deepEqual(actual.toObject(), expected);
        done();
      });
    });
  });
})();
