(function() {
  
  var REFERENCE_RECT = {
    'type': 'rect', 
    'left': 0, 
    'top': 0, 
    'width': 100, 
    'height': 100, 
    'fill': 'rgb(0,0,0)',
    'overlayFill': null,
    'stroke': null, 
    'strokeWidth': 1, 
    'scaleX': 1, 
    'scaleY': 1, 
    'angle': 0, 
    'flipX': false, 
    'flipY': false, 
    'opacity': 1
  };
  
  test('constructor', function(){
    ok(Canvas.Rect);

    var rect = new Canvas.Rect();

    ok(rect instanceof Canvas.Rect);
    ok(rect instanceof Canvas.Object);

    same(rect.get('type'), 'rect');
  });
  
  test('complexity', function() {
    var rect = new Canvas.Rect();
    
    ok(typeof rect.complexity == 'function');
  });
  
  test('toObject', function() {
    var rect = new Canvas.Rect();
    ok(typeof rect.toObject == 'function');

    var object = rect.toObject();
    same(object, REFERENCE_RECT);
  });
  
  test('Canvas.Rect.fromObject', function() {
    ok(typeof Canvas.Rect.fromObject == 'function');
    
    var rect = Canvas.Rect.fromObject(REFERENCE_RECT);
    ok(rect instanceof Canvas.Rect);
    same(rect.toObject(), REFERENCE_RECT);
  });
  
  test('Canvas.Rect.fromElement', function() {
    ok(typeof Canvas.Rect.fromElement == 'function');

    var elRect = document.createElement('rect');
    var rect = Canvas.Rect.fromElement(elRect);

    ok(rect instanceof Canvas.Rect);
    same(rect.toObject(), REFERENCE_RECT);

    var elRectWithAttrs = document.createElement('rect');
    elRectWithAttrs.setAttribute('x', 10);
    elRectWithAttrs.setAttribute('y', 20);
    elRectWithAttrs.setAttribute('width', 222);
    elRectWithAttrs.setAttribute('height', 333);
    elRectWithAttrs.setAttribute('rx', 11);
    elRectWithAttrs.setAttribute('ry', 12);
    elRectWithAttrs.setAttribute('fill', 'rgb(255,255,255)');
    elRectWithAttrs.setAttribute('fill-opacity', 0.45);
    elRectWithAttrs.setAttribute('stroke', 'blue');
    elRectWithAttrs.setAttribute('stroke-width', 3);
    //elRectWithAttrs.setAttribute('transform', 'translate(-10,-20) scale(2) rotate(45) translate(5,10)');

    var rectWithAttrs = Canvas.Rect.fromElement(elRectWithAttrs);
    ok(rectWithAttrs instanceof Canvas.Rect);

    var expectedObject = Canvas.base.object.extend(REFERENCE_RECT, {
      left: 121,
      top: 186.5,
      width: 222,
      height: 333,
      fill: 'rgb(255,255,255)',
      opacity: 0.45,
      stroke: 'blue',
      strokeWidth: 3
    });
    same(rectWithAttrs.toObject(), expectedObject);

    ok(Canvas.Rect.fromElement() === null);
  });
})();