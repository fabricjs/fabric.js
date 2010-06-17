function init(){
  new Test.Unit.Runner({
    testConstructor: function() {
      this.assert(Canvas.Ellipse);
      
      var ellipse = new Canvas.Ellipse();
      
      this.assertInstanceOf(Canvas.Ellipse, ellipse, 'should inherit from Canvas.Ellipse');
      this.assertInstanceOf(Canvas.Object, ellipse, 'should inherit from Canvas.Object');
      
      this.assertIdentical('ellipse', ellipse.type);
    },
    testComplexity: function(){
      var ellipse = new Canvas.Ellipse();
      this.assertRespondsTo('complexity', ellipse);
      this.assertIdentical(1, ellipse.complexity());
    },
    testToObject: function() {
      var ellipse = new Canvas.Ellipse();
      var defaultProperties = {
        'type': 'ellipse', 
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
        'rx': 0,
        'ry': 0
      };
      this.assertRespondsTo('toObject', ellipse);
      this.assertHashEqual(defaultProperties, ellipse.toObject());
      
      ellipse.set('left', 100).set('top', 200).set('rx', 15).set('ry', 25);
      
      var augmentedProperties = Canvas.base.object.extend(Canvas.base.object.clone(defaultProperties), {
        left: 100,
        top: 200,
        rx: 15,
        ry: 25
      });
      
      this.assertHashEqual(augmentedProperties, ellipse.toObject());
    },
    testRender: function() {
      var ellipse = new Canvas.Ellipse();
      ellipse.set('rx', 0).set('ry', 0);
      
      var wasRenderCalled = false;
      
      ellipse._render = function(){
        wasRenderCalled = true;
      }
      ellipse.render({});
      
      this.assertIdentical(false, wasRenderCalled, 'should not render when rx/ry are 0');
    },
    testCanvasEllipseFromElement: function() {
      this.assertRespondsTo('fromElement', Canvas.Ellipse);
      
      var elEllipse     = document.createElement('ellipse'),
          rx            = 5,
          ry            = 7,
          left          = 12,
          top           = 15,
          fill          = 'ff5555',
          fillOpacity   = 0.5,
          strokeWidth   = 2;
          
      elEllipse.setAttribute('rx', rx);
      elEllipse.setAttribute('ry', ry);
      elEllipse.setAttribute('cx', left);
      elEllipse.setAttribute('cy', top);
      elEllipse.setAttribute('fill', fill);
      elEllipse.setAttribute('fill-opacity', fillOpacity);
      elEllipse.setAttribute('stroke-width', strokeWidth);
      
      var oEllipse = Canvas.Ellipse.fromElement(elEllipse);
      this.assertInstanceOf(Canvas.Ellipse, oEllipse);
      
      this.assertIdentical(rx, oEllipse.get('rx'));
      this.assertIdentical(ry, oEllipse.get('ry'));
      this.assertIdentical(left, oEllipse.get('left'));
      this.assertIdentical(top, oEllipse.get('top'));
      this.assertIdentical(fill, oEllipse.get('fill'));
      this.assertIdentical(fillOpacity, oEllipse.get('opacity'));
      this.assertIdentical(strokeWidth, oEllipse.get('strokeWidth'));
    },
    testCanvasEllipseFromObject: function() {
      this.assertRespondsTo('fromObject', Canvas.Ellipse);
      
      var left    = 112,
          top     = 234,
          rx      = 13.45,
          ry      = 14.78,
          fill    = 'ff5555';
      
      var ellipse = Canvas.Ellipse.fromObject({
        left: left, top: top, rx: rx, ry: ry, fill: fill
      });
      this.assertInstanceOf(Canvas.Ellipse, ellipse);
      
      this.assertIdentical(left, ellipse.get('left'));
      this.assertIdentical(top, ellipse.get('top'));
      this.assertIdentical(rx, ellipse.get('rx'));
      this.assertIdentical(ry, ellipse.get('ry'));
      this.assertIdentical(fill, ellipse.get('fill'));
      
      var expected = ellipse.toObject();
      var actual = Canvas.Ellipse.fromObject(expected).toObject();
      
      this.assertHashEqual(expected, actual);
    }
  });
}