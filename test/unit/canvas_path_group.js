function init(){
  
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
  
  new Test.Unit.Runner({
    testConstructor: function() {
      this.assert(Canvas.PathGroup);
      var pathGroup = getPathGroupObject();
      
      this.assertInstanceOf(Canvas.PathGroup, pathGroup);
      this.assertInstanceOf(Canvas.Object, pathGroup);
      this.assertHasMixin(Enumerable, pathGroup);
      
      this.assertIdentical('path-group', pathGroup.get('type'));
    },
    testGetObjects: function() {
      var paths = getPathObjects();
      var pathGroup = new Canvas.PathGroup(paths);
      this.assertRespondsTo('getObjects', pathGroup);
      this.assertEnumEqual(paths, pathGroup.getObjects());
    },
    testToObject: function() {
      var pathGroup = getPathGroupObject();
      this.assertRespondsTo('toObject', pathGroup);
      var object = pathGroup.toObject();
      this.assertObjectIdentical(Object.extend(Object.clone(REFERENCE_PATH_GROUP_OBJECT), {
        paths: object.paths
      }), object);
    },
    testComplexity: function() {
      function sum(objects) {
        var i = objects.length, total = 0;
        while (i--) {
          total += objects[i];
        }
        return total;
      }
      var pathGroup = getPathGroupObject();
      
      this.assertRespondsTo('complexity', pathGroup);
      
      var objectsTotalComplexity = pathGroup.getObjects().inject(0, function(total, current) {
        total += current.complexity();
        return total;
      });
      
      this.assertIdentical(objectsTotalComplexity, pathGroup.complexity());
    },
    testToDatalessObject: function() {
      var pathGroup = getPathGroupObject();
      this.assertRespondsTo('toDatalessObject', pathGroup);
      
      pathGroup.setSourcePath('http://example.com/');
      var expectedObject = Object.extend(Object.clone(REFERENCE_PATH_GROUP_OBJECT), {
        'paths': 'http://example.com/',
        'sourcePath': 'http://example.com/'
      });
      this.assertObjectIdentical(expectedObject, pathGroup.toDatalessObject());
    },
    testToString: function() {
      var pathGroup = getPathGroupObject();
      this.assertRespondsTo('toString', pathGroup);
      this.assertIdentical('#<Canvas.PathGroup (8): { top: 0, left: 0 }>', pathGroup.toString());
    },
    testIsSameColor: function() {
      var pathGroup = getPathGroupObject();
      
      this.assertRespondsTo('isSameColor', pathGroup);
      this.assertIdentical(true, pathGroup.isSameColor());
      
      pathGroup.getObjects()[0].set('fill', 'black');
      this.assertIdentical(false, pathGroup.isSameColor());
    },
    testSet: function() {
      var fillValue = 'rgb(100,200,100)';
      var pathGroup = getPathGroupObject();
      
      this.assertRespondsTo('set', pathGroup);
      this.assertIdentical(pathGroup, pathGroup.set('fill', fillValue), 'should be chainable');
      
      pathGroup.getObjects().each(function(path){
        this.assertIdentical(fillValue, path.get('fill'));
      }, this);
      this.assertIdentical(fillValue, pathGroup.get('fill'));
      
      // set different color to one of the paths
      pathGroup.getObjects()[1].set('fill', 'black');
      pathGroup.set('fill', 'rgb(255,255,255)');
      this.assertIdentical('rgb(100,200,100)', pathGroup.getObjects()[0].get('fill'),
        'when paths are of different fill, setting fill of a group should not change them');
        
      pathGroup.getObjects()[1].set('fill', 'red');
      
      pathGroup.set('left', 1234);
      this.assertNotEqual(1234, pathGroup.getObjects()[0].get('left'));
      this.assertIdentical(1234, pathGroup.get('left'));
    },
    
    testGrayscale: function() {
      var pathGroup = getPathGroupObject();
      
      this.assertRespondsTo('toGrayscale', pathGroup);
      this.assertIdentical(pathGroup, pathGroup.toGrayscale(), 'should be chainable');
      
      var firstObject = pathGroup.getObjects()[0],
          secondObject = pathGroup.getObjects()[1];
      
      firstObject.set('overlayFill', null);
      secondObject.set('overlayFill', null);
      
      firstObject.set('fill', 'rgb(200,0,0)'/* red */);
      secondObject.set('fill', '0000FF'/* blue */);
      
      pathGroup.toGrayscale();
      
      this.assertIdentical('rgb(60,60,60)', firstObject.get('overlayFill'));
      this.assertIdentical('rgb(28,28,28)', secondObject.get('overlayFill'));
      
      this.assertIdentical('rgb(200,0,0)', firstObject.get('fill'), 'toGrayscale should not change original fill value');
      this.assertIdentical('rgb(0,0,255)', new Canvas.Color(secondObject.get('fill')).toRgb(), 'toGrayscale should not change original fill value');
    }
  });
}