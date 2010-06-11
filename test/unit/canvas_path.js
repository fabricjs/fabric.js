function init() {
  
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
  
  new Test.Unit.Runner({
    testConstructor: function() {
      this.assert(Canvas.Path);
      var path = makePathObject();
      
      this.assertInstanceOf(Canvas.Path, path);
      this.assertInstanceOf(Canvas.Object, path);
      
      this.assertIdentical('path', path.get('type'));
      
      this.assertRaise('Error', function() {
        new Canvas.Path();
      });
    },
    testToString: function() {
      var path = makePathObject();
      this.assertRespondsTo('toString', path);
      this.assertIdentical('#<Canvas.Path (4): {"top": 100, "left": 100}>', path.toString());
    },
    testToObject: function() {
      var path = makePathObject();
      this.assertRespondsTo('toObject', path);
      this.assertObjectIdentical(REFERENCE_PATH_OBJECT, path.toObject());
    },
    testToDatalessObject: function() {
      var path = makePathObject();
      this.assertRespondsTo('toDatalessObject', path);
      this.assertObjectIdentical(REFERENCE_PATH_OBJECT, path.toDatalessObject());
      
      var src = 'http://example.com/';
      path.setSourcePath(src);
      this.assertObjectIdentical(Object.extend(Object.clone(REFERENCE_PATH_OBJECT), {
        path: src
      }), path.toDatalessObject());
    },
    testComplexity: function() {
      var path = makePathObject();
      this.assertRespondsTo('complexity', path);
    },
    testCanvasPathFromObject: function() {
      this.assertRespondsTo('fromObject', Canvas.Path);
      var path = Canvas.Path.fromObject(REFERENCE_PATH_OBJECT);
      
      this.assertInstanceOf(Canvas.Path, path);
      this.assertObjectIdentical(REFERENCE_PATH_OBJECT, path.toObject());
    },
    testCanvasPathFromElement: function() {
      this.assertRespondsTo('fromElement', Canvas.Path);
      var elPath = document.createElement('path');
      
      elPath.setAttribute('d', 'M 100 100 L 300 100 L 200 300 z');
      elPath.setAttribute('fill', 'red');
      elPath.setAttribute('fill-opacity', '1');
      elPath.setAttribute('stroke', 'blue');
      elPath.setAttribute('stroke-width', '1');
      elPath.setAttribute('transform', 'scale(2) translate(10, -20)');
      
      var path = Canvas.Path.fromElement(elPath);
      this.assertInstanceOf(Canvas.Path, path);
      
      this.assertObjectIdentical(Object.extend(REFERENCE_PATH_OBJECT, {
        transformMatrix: [2, 0, 0, 2, 10, -20]
      }), path.toObject());
      
      var ANGLE = 90;
      
      elPath.setAttribute('transform', 'rotate(' + ANGLE + ')');
      path = Canvas.Path.fromElement(elPath);
      
      this.assertEnumEqual(
        [ Math.cos(ANGLE), Math.sin(ANGLE), -Math.sin(ANGLE), Math.cos(ANGLE), 0, 0 ], 
        path.get('transformMatrix')
      );
      
    }
  });
}