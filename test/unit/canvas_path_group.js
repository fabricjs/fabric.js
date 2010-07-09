(function(){
  
  var REFERENCE_PATH_GROUP_OBJECT = {
    'type':         'path-group', 
    'left':         0, 
    'top':          0, 
    'width':        100, 
    'height':       100, 
    'fill':         'rgb(0,0,0)',
    'overlayFill':  null,
    'stroke':       null, 
    'strokeWidth':  1, 
    'scaleX':       1, 
    'scaleY':       1, 
    'angle':        0, 
    'flipX':        false, 
    'flipY':        false, 
    'opacity':      1, 
    'paths':        getPathObjects()
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
  
  function getPathObjects() {
    return [getPathObject("M 100 100 L 300 100 L 200 300 z"), 
            getPathObject("M 200 200 L 100 200 L 400 50 z")];
  }
  
  function getPathGroupObject() {
    return new Canvas.PathGroup(getPathObjects());
  }
  
  module('Canvas.PathGroup');
  
  test('constructor', function() {
    ok(Canvas.PathGroup);
    var pathGroup = getPathGroupObject();
    
    ok(pathGroup instanceof Canvas.PathGroup);
    ok(pathGroup instanceof Canvas.Object);
    //this.assertHasMixin(Enumerable, pathGroup);
    
    equals(pathGroup.get('type'), 'path-group');
  });
  
  test('getObjects', function() {
    var paths = getPathObjects();
    var pathGroup = new Canvas.PathGroup(paths);
    ok(typeof pathGroup.getObjects == 'function');
    same(paths, pathGroup.getObjects());
  });
  
  test('toObject', function() {
    var pathGroup = getPathGroupObject();
    ok(typeof pathGroup.toObject == 'function');
    var object = pathGroup.toObject();
    same(Canvas.base.object.extend(Canvas.base.object.clone(REFERENCE_PATH_GROUP_OBJECT), {
      paths: object.paths
    }), object);
  });
  
  test('complexity', function() {
    function sum(objects) {
      var i = objects.length, total = 0;
      while (i--) {
        total += objects[i];
      }
      return total;
    }
    var pathGroup = getPathGroupObject();
    
    ok(typeof pathGroup.complexity == 'function');
    
    var objectsTotalComplexity = pathGroup.getObjects().reduce(function(total, current) {
      total += current.complexity();
      return total;
    }, 0);
    
    equals(pathGroup.complexity(), objectsTotalComplexity);
  });
  
  test('toDatalessObject', function() {
    var pathGroup = getPathGroupObject();
    ok(typeof pathGroup.toDatalessObject == 'function');
    
    pathGroup.setSourcePath('http://example.com/');
    var expectedObject = Canvas.base.object.extend(Canvas.base.object.clone(REFERENCE_PATH_GROUP_OBJECT), {
      'paths': 'http://example.com/',
      'sourcePath': 'http://example.com/'
    });
    same(expectedObject, pathGroup.toDatalessObject());
  });
  
  test('toString', function() {
    var pathGroup = getPathGroupObject();
    ok(typeof pathGroup.toString == 'function');
    equals(pathGroup.toString(), '#<Canvas.PathGroup (8): { top: 0, left: 0 }>');
  });
  
  test('isSameColor', function() {
    var pathGroup = getPathGroupObject();
    
    ok(typeof pathGroup.isSameColor == 'function');
    equals(pathGroup.isSameColor(), true);
    
    pathGroup.getObjects()[0].set('fill', 'black');
    equals(pathGroup.isSameColor(), false);
  });
  
  test('set', function() {
    var fillValue = 'rgb(100,200,100)';
    var pathGroup = getPathGroupObject();
    
    ok(typeof pathGroup.set == 'function');
    equals(pathGroup.set('fill', fillValue), pathGroup, 'should be chainable');
    
    pathGroup.getObjects().forEach(function(path) {
      equals(path.get('fill'), fillValue);
    }, this);
    
    equals(pathGroup.get('fill'), fillValue);
    
    // set different color to one of the paths
    pathGroup.getObjects()[1].set('fill', 'black');
    pathGroup.set('fill', 'rgb(255,255,255)');
    
    equals(pathGroup.getObjects()[0].get('fill'), 'rgb(100,200,100)',
      'when paths are of different fill, setting fill of a group should not change them');
      
    pathGroup.getObjects()[1].set('fill', 'red');
    
    pathGroup.set('left', 1234);
    ok(pathGroup.getObjects()[0].get('left') !== 1234);
    equals(pathGroup.get('left'), 1234);
  });
  
  test('grayscale', function() {
    var pathGroup = getPathGroupObject();
    
    ok(typeof pathGroup.toGrayscale == 'function');
    equals(pathGroup.toGrayscale(), pathGroup, 'should be chainable');
    
    var firstObject = pathGroup.getObjects()[0],
        secondObject = pathGroup.getObjects()[1];
    
    firstObject.set('overlayFill', null);
    secondObject.set('overlayFill', null);
    
    firstObject.set('fill', 'rgb(200,0,0)');
    secondObject.set('fill', '0000FF');
    
    pathGroup.toGrayscale();
    
    equals(firstObject.get('overlayFill'), 'rgb(60,60,60)');
    equals(secondObject.get('overlayFill'), 'rgb(28,28,28)');

    equals(firstObject.get('fill'), 'rgb(200,0,0)', 'toGrayscale should not change original fill value');
    equals(new Canvas.Color(secondObject.get('fill')).toRgb(), 'rgb(0,0,255)', 'toGrayscale should not change original fill value');
  });
})();