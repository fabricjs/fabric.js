(function(){

  QUnit.module('fabric.Ellipse');

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Ellipse);

    var ellipse = new fabric.Ellipse();

    assert.ok(ellipse instanceof fabric.Ellipse, 'should inherit from fabric.Ellipse');
    assert.ok(ellipse instanceof fabric.Object, 'should inherit from fabric.Object');

    assert.equal(ellipse.type, 'ellipse');
  });

  QUnit.test('complexity', function(assert) {
    var ellipse = new fabric.Ellipse();
    assert.ok(typeof ellipse.complexity === 'function');
    assert.equal(ellipse.complexity(), 1);
  });

  QUnit.test('toObject', function(assert) {
    var ellipse = new fabric.Ellipse();
    var defaultProperties = {
      'version':                  fabric.version,
      'type':                     'ellipse',
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
      'strokeLineJoin':           'miter',
      'strokeMiterLimit':         10,
      'scaleX':                   1,
      'scaleY':                   1,
      'angle':                    0,
      'flipX':                    false,
      'flipY':                    false,
      'opacity':                  1,
      'skewX':                    0,
      'skewY':                    0,
      'rx':                       0,
      'ry':                       0,
      'shadow':                   null,
      'visible':                  true,
      'backgroundColor':          '',
      'fillRule':                 'nonzero',
      'paintFirst':               'fill',
      'globalCompositeOperation': 'source-over',
      'clipTo':                   null,
      'transformMatrix':          null
    };
    assert.ok(typeof ellipse.toObject === 'function');
    assert.deepEqual(ellipse.toObject(), defaultProperties);

    ellipse.set('left', 100).set('top', 200).set('rx', 15).set('ry', 25);

    var augmentedProperties = fabric.util.object.extend(fabric.util.object.clone(defaultProperties), {
      left: 100,
      top: 200,
      rx: 15,
      ry: 25,
      width: 30,
      height: 50
    });

    assert.deepEqual(ellipse.toObject(), augmentedProperties);

    ellipse.set('rx', 30);
    assert.deepEqual(ellipse.width, ellipse.rx * 2);

    ellipse.set('scaleX', 2);
    assert.deepEqual(ellipse.getRx(), ellipse.rx * ellipse.scaleX);
  });

  QUnit.test('render', function(assert) {
    var ellipse = new fabric.Ellipse();
    ellipse.set('rx', 0).set('ry', 0);

    var wasRenderCalled = false;

    ellipse._render = function(){
      wasRenderCalled = true;
    };
    ellipse.render({});

    assert.equal(wasRenderCalled, false, 'should not render when rx/ry are 0');
  });

  QUnit.test('fromElement', function(assert) {
    assert.ok(typeof fabric.Ellipse.fromElement === 'function');

    var elEllipse        = fabric.document.createElement('ellipse'),
        rx               = 5,
        ry               = 7,
        left             = 12,
        top              = 15,
        fill             = 'ff5555',
        opacity          = 0.5,
        strokeWidth      = 2,
        strokeDashArray  = [5, 2],
        strokeLineCap    = 'round',
        strokeLineJoin   = 'bevil',
        strokeMiterLimit = 5;

    elEllipse.setAttribute('rx', rx);
    elEllipse.setAttribute('ry', ry);
    elEllipse.setAttribute('cx', left);
    elEllipse.setAttribute('cy', top);
    elEllipse.setAttribute('fill', fill);
    elEllipse.setAttribute('opacity', opacity);
    elEllipse.setAttribute('stroke-width', strokeWidth);
    elEllipse.setAttribute('stroke-dasharray', '5, 2');
    elEllipse.setAttribute('stroke-linecap', strokeLineCap);
    elEllipse.setAttribute('stroke-linejoin', strokeLineJoin);
    elEllipse.setAttribute('stroke-miterlimit', strokeMiterLimit);

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
    }, function(ellipse) {
      assert.ok(ellipse instanceof fabric.Ellipse);

      assert.equal(ellipse.get('left'), left);
      assert.equal(ellipse.get('top'), top);
      assert.equal(ellipse.get('rx'), rx);
      assert.equal(ellipse.get('ry'), ry);
      assert.equal(ellipse.get('fill'), fill);

      var expected = ellipse.toObject();
      fabric.Ellipse.fromObject(expected, function(actual) {
        assert.deepEqual(actual.toObject(), expected);
        done();
      });
    });


  });
})();
