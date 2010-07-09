(function() {
  
  module('Canvas.Circle');
  
  test('constructor', function(){
    ok(Canvas.Circle);

    var circle = new Canvas.Circle();
    
    ok(circle instanceof Canvas.Circle, 'should inherit from Canvas.Circle');
    ok(circle instanceof Canvas.Object, 'should inherit from Canvas.Object');
    
    same(circle.type, 'circle');
  });
  
  test('complexity', function() {
    var circle = new Canvas.Circle();
    ok(typeof circle.complexity == 'function');
    equals(circle.complexity(), 1);
  });
  
  test('toObject', function() {
    var circle = new Canvas.Circle();
    var defaultProperties = {
      'type': 'circle', 
      'left': 0, 
      'top': 0, 
      'width': 0, 
      'height': 0, 
      'fill': 'rgb(0,0,0)', 
      'overlayFill': null,
      'stroke': null, 
      'strokeWidth': 1, 
      'scaleX': 1, 
      'scaleY': 1, 
      'angle': 0, 
      'flipX': false, 
      'flipY': false, 
      'opacity': 1, 
      'radius': 0
    };
    ok(typeof circle.toObject == 'function');
    same(circle.toObject(), defaultProperties);
    
    circle.set('left', 100).set('top', 200).set('radius', 15);
    
    var augmentedProperties = Canvas.base.object.extend(Canvas.base.object.clone(defaultProperties), {
      left: 100,
      top: 200,
      radius: 15
    });
    
    same(circle.toObject(), augmentedProperties);
  });
  
  test('fromElement', function() {
    ok(typeof Canvas.Circle.fromElement == 'function');
    
    var elCircle      = document.createElement('circle'),
        radius        = 10,
        left          = 12,
        top           = 15,
        fill          = 'ff5555',
        fillOpacity   = 0.5,
        strokeWidth   = 2;
    
        
    elCircle.setAttribute('r', radius);
    elCircle.setAttribute('cx', left);
    elCircle.setAttribute('cy', top);
    elCircle.setAttribute('fill', fill);
    elCircle.setAttribute('fill-opacity', fillOpacity);
    elCircle.setAttribute('stroke-width', strokeWidth);
    
    var oCircle = Canvas.Circle.fromElement(elCircle);
    ok(oCircle instanceof Canvas.Circle);
    
    equals(oCircle.get('radius'), radius);
    equals(oCircle.get('left'), left);
    equals(oCircle.get('top'), top);
    equals(oCircle.get('fill'), fill);
    equals(oCircle.get('opacity'), fillOpacity);
    equals(oCircle.get('strokeWidth'), strokeWidth);
    
    elFaultyCircle = document.createElement('circle');
    elFaultyCircle.setAttribute('r', '-10');
    
    var error;
    try {
      Canvas.Circle.fromElement(elFaultyCircle);
    }
    catch(err) {
      error = err;
    }
    ok(error, 'negative attribute should throw');
    
    elFaultyCircle.removeAttribute('r');
    
    error = void 0;
    try {
      Canvas.Circle.fromElement(elFaultyCircle);
    }
    catch(err) {
      error = err;
    }
    
    ok(error, 'inexstent attribute should throw');
  });
  
  test('fromObject', function() {
    ok(typeof Canvas.Circle.fromObject == 'function');
    
    var left    = 112,
        top     = 234,
        radius  = 13.45,
        fill    = 'ff5555';
    
    var circle = Canvas.Circle.fromObject({
      left: left, top: top, radius: radius, fill: fill
    });
    
    ok(circle instanceof Canvas.Circle);
    
    equals(circle.get('left'), left);
    equals(circle.get('top'), top);
    equals(circle.get('radius'), radius);
    equals(circle.get('fill'), fill);
    
    var expected = circle.toObject();
    var actual = Canvas.Circle.fromObject(expected).toObject();
    
    same(expected, actual);
  });
})();