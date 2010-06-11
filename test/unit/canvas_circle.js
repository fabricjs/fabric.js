function init() {
  new Test.Unit.Runner({
    testConstructor: function(){
      this.assert(Canvas.Circle);
      
      var circle = new Canvas.Circle();
      
      this.assertInstanceOf(Canvas.Circle, circle, 'should inherit from Canvas.Circle');
      this.assertInstanceOf(Canvas.Object, circle, 'should inherit from Canvas.Object');
      
      this.assertIdentical('circle', circle.type);
    },
    testComplexity: function(){
      var circle = new Canvas.Circle();
      this.assertRespondsTo('complexity', circle);
      this.assertIdentical(1, circle.complexity());
    },
    testToObject: function() {
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
      this.assertRespondsTo('toObject', circle);
      this.assertHashEqual(defaultProperties, circle.toObject());
      
      circle.set('left', 100).set('top', 200).set('radius', 15);
      
      var augmentedProperties = Object.extend(Object.clone(defaultProperties), {
        left: 100,
        top: 200,
        radius: 15
      });
      
      this.assertHashEqual(augmentedProperties, circle.toObject());
    },
    testCanvasCircleFromElement: function() {
      this.assertRespondsTo('fromElement', Canvas.Circle);
      
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
      this.assertInstanceOf(Canvas.Circle, oCircle);
      
      this.assertIdentical(radius, oCircle.get('radius'));
      this.assertIdentical(left, oCircle.get('left'));
      this.assertIdentical(top, oCircle.get('top'));
      this.assertIdentical(fill, oCircle.get('fill'));
      this.assertIdentical(fillOpacity, oCircle.get('opacity'));
      this.assertIdentical(strokeWidth, oCircle.get('strokeWidth'));
      
      elFaultyCircle = document.createElement('circle');
      elFaultyCircle.setAttribute('r', '-10');
      
      this.assertRaise('Error', function(){
        Canvas.Circle.fromElement(elFaultyCircle);
      }, 'negative attribute should throw');
      
      elFaultyCircle.removeAttribute('r');
      this.assertRaise('Error', function(){
        Canvas.Circle.fromElement(elFaultyCircle);
      }, 'inexstent attribute should throw');
    },
    testCanvasCircleFromObject: function() {
      this.assertRespondsTo('fromObject', Canvas.Circle);
      
      var left    = 112,
          top     = 234,
          radius  = 13.45,
          fill    = 'ff5555';
      
      var circle = Canvas.Circle.fromObject({
        left: left, top: top, radius: radius, fill: fill
      });
      this.assertInstanceOf(Canvas.Circle, circle);
      
      this.assertIdentical(left, circle.get('left'));
      this.assertIdentical(top, circle.get('top'));
      this.assertIdentical(radius, circle.get('radius'));
      this.assertIdentical(fill, circle.get('fill'));
      
      var expected = circle.toObject();
      var actual = Canvas.Circle.fromObject(expected).toObject();
      
      this.assertHashEqual(expected, actual);
    }
  });
}