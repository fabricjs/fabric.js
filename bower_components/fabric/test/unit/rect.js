(function() {

  var REFERENCE_RECT = {
    'type':               'rect',
    'originX':            'left',
    'originY':            'top',
    'left':               0,
    'top':                0,
    'width':              0,
    'height':             0,
    'fill':               'rgb(0,0,0)',
    'stroke':             null,
    'strokeWidth':        1,
    'strokeDashArray':    null,
    'strokeLineCap':      'butt',
    'strokeLineJoin':     'miter',
    'strokeMiterLimit':   10,
    'scaleX':             1,
    'scaleY':             1,
    'angle':              0,
    'flipX':              false,
    'flipY':              false,
    'opacity':            1,
    'shadow':             null,
    'visible':            true,
    'backgroundColor':    '',
    'clipTo':             null,
    'rx':                 0,
    'ry':                 0,
    'x':                  0,
    'y':                  0
  };

  QUnit.module('fabric.Rect');

  test('constructor', function(){
    ok(fabric.Rect);

    var rect = new fabric.Rect();

    ok(rect instanceof fabric.Rect);
    ok(rect instanceof fabric.Object);

    deepEqual(rect.get('type'), 'rect');
  });

  test('complexity', function() {
    var rect = new fabric.Rect();

    ok(typeof rect.complexity == 'function');
  });

  test('toObject', function() {
    var rect = new fabric.Rect();
    ok(typeof rect.toObject == 'function');

    var object = rect.toObject();
    deepEqual(object, REFERENCE_RECT);
  });

  test('fabric.Rect.fromObject', function() {
    ok(typeof fabric.Rect.fromObject == 'function');

    var rect = fabric.Rect.fromObject(REFERENCE_RECT);
    ok(rect instanceof fabric.Rect);
    deepEqual(rect.toObject(), REFERENCE_RECT);
  });

  test('fabric.Rect.fromElement', function() {
    ok(typeof fabric.Rect.fromElement == 'function');

    var elRect = fabric.document.createElement('rect');
    var rect = fabric.Rect.fromElement(elRect);

    ok(rect instanceof fabric.Rect);
    deepEqual(rect.toObject(), REFERENCE_RECT);
  });

  test('fabric.Rect.fromElement with custom attributes', function() {
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

    var rectWithAttrs = fabric.Rect.fromElement(elRectWithAttrs);
    ok(rectWithAttrs instanceof fabric.Rect);

    var expectedObject = fabric.util.object.extend(REFERENCE_RECT, {
      left:             121,
      top:              186.5,
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
      ry:               12,
      x:                10,
      y:                20
    });
    deepEqual(rectWithAttrs.toObject(), expectedObject);
  });

  test('empty fromElement', function() {
    ok(fabric.Rect.fromElement() === null);
  });

  test('clone with rounded corners', function() {
    var rect = new fabric.Rect({ width: 100, height: 100, rx: 20, ry: 30 });
    var clone = rect.clone();

    equal(clone.get('rx'), rect.get('rx'));
    equal(clone.get('ry'), rect.get('ry'));
  });

  test('toSVG with rounded corners', function() {
    var rect = new fabric.Rect({ width: 100, height: 100, rx: 20, ry: 30 });
    var svg = rect.toSVG();

    equal(svg, '<rect x="-50" y="-50" rx="20" ry="30" width="100" height="100" style="stroke: none; stroke-width: 1; stroke-dasharray: ; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); opacity: 1;" transform="translate(50 50)"/>');
  });

  test('toObject without default values', function() {
    var options = { type: 'rect', width: 69, height: 50, left: 10, top: 20 };
    var rect = new fabric.Rect(options);
    rect.includeDefaultValues = false;
    deepEqual(rect.toObject(), options);
  });
})();
