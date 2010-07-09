(function() {
  
  var REFERENCE_PATH_OBJECT = {
    'type': 'path', 
    'left': 100, 
    'top': 100, 
    'width': 200, 
    'height': 200, 
    'fill': 'red',
    'overlayFill': null,
    'stroke': 'blue', 
    'strokeWidth': 1, 
    'scaleX': 1, 
    'scaleY': 1, 
    'angle': 0, 
    'flipX': false, 
    'flipY': false, 
    'opacity': 1,
    'path': [['M', 100, 100], ['L', 300, 100], ['L', 200, 300], ['z', NaN]]
  };
  
  function getPathElement(path) {
    var el = document.createElement('path');
    el.setAttribute('d', path);
    el.setAttribute('fill', 'red');
    el.setAttribute('stroke', 'blue');
    el.setAttribute('troke-width', 3);
    return el;
  }
  
  function getPathObject(path) {
    return Canvas.Path.fromElement(getPathElement(path));
  }
  
  function makePathObject() {
    return getPathObject("M 100 100 L 300 100 L 200 300 z");
  }
  
  module('Canvas.Path');
  
  test('constructor', function() {
    ok(Canvas.Path);
    var path = makePathObject();
    
    ok(path instanceof Canvas.Path);
    ok(path instanceof Canvas.Object);
    
    equals(path.get('type'), 'path');
    
    var error;
    try {
      new Canvas.Path();
    }
    catch(err) {
      error = err;
    }
    
    ok(error, 'should throw error');
  });
  
  test('toString', function() {
    var path = makePathObject();
    ok(typeof path.toString == 'function');
    equals('#<Canvas.Path (4): {"top":100,"left":100}>', path.toString());
  });
  
  test('toObject', function() {
    var path = makePathObject();
    ok(typeof path.toObject == 'function');
    same(REFERENCE_PATH_OBJECT, path.toObject());
  });
  
  test('toDatalessObject', function() {
    var path = makePathObject();
    ok(typeof path.toDatalessObject == 'function');
    same(REFERENCE_PATH_OBJECT, path.toDatalessObject());
    
    var src = 'http://example.com/';
    path.setSourcePath(src);
    same(Canvas.base.object.extend(Canvas.base.object.clone(REFERENCE_PATH_OBJECT), {
      path: src
    }), path.toDatalessObject());
  });
  
  test('complexity', function() {
    var path = makePathObject();
    ok(typeof path.complexity == 'function');
  });
  
  test('fromObject', function() {
    ok(typeof Canvas.Path.fromObject == 'function');
    var path = Canvas.Path.fromObject(REFERENCE_PATH_OBJECT);
    ok(path instanceof Canvas.Path);
    same(REFERENCE_PATH_OBJECT, path.toObject());
  });
  
  test('fromElement', function() {
    ok(typeof Canvas.Path.fromElement == 'function');
    var elPath = document.createElement('path');
    
    elPath.setAttribute('d', 'M 100 100 L 300 100 L 200 300 z');
    elPath.setAttribute('fill', 'red');
    elPath.setAttribute('fill-opacity', '1');
    elPath.setAttribute('stroke', 'blue');
    elPath.setAttribute('stroke-width', '1');
    elPath.setAttribute('transform', 'scale(2) translate(10, -20)');
    
    var path = Canvas.Path.fromElement(elPath);
    ok(path instanceof Canvas.Path);
    
    same(Canvas.base.object.extend(REFERENCE_PATH_OBJECT, {
      transformMatrix: [2, 0, 0, 2, 10, -20]
    }), path.toObject());
    
    var ANGLE = 90;
    
    elPath.setAttribute('transform', 'rotate(' + ANGLE + ')');
    path = Canvas.Path.fromElement(elPath);
    
    same(
      [ Math.cos(ANGLE), Math.sin(ANGLE), -Math.sin(ANGLE), Math.cos(ANGLE), 0, 0 ], 
      path.get('transformMatrix')
    );
  });
})();