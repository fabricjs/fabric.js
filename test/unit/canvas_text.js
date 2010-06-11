function init(){
  
  var REFERENCE_TEXT_OBJECT = {
    'type':         'text', 
    'left':         10, 
    'top':          10, 
    'width':        100, 
    'height':       100, 
    'fill':         '#000000', 
    'overlayFill':  null,
    'stroke':       null, 
    'strokeWidth':  1, 
    'scaleX':       1, 
    'scaleY':       1, 
    'angle':        0, 
    'flipX':        false, 
    'flipY':        false, 
    'opacity':      1, 
    'text':         'foo', 
    'fontsize':     20, 
    'fontweight':   100, 
    'fontfamily':   'Modernist_One_400', 
    'path':         null
  };
  
  new Test.Unit.Runner({
    testConstructor: function() {
      this.assert(Canvas.Text);
      var text = new Canvas.Text('foo');
      
      this.assertInstanceOf(Canvas.Text, text);
      this.assertInstanceOf(Canvas.Object, text);
      
      this.assertIdentical('text', text.get('type'));
      this.assertIdentical('foo', text.get('text'));
    },
    testToString: function() {
      var text = new Canvas.Text('foo');
      this.assertRespondsTo('toString', text);
      this.assertIdentical('#<Canvas.Text (0): {"text": "foo", "fontfamily": "Modernist_One_400"}>', text.toString());
    },
    testToObject: function() {
      var text = new Canvas.Text('foo');
      this.assertRespondsTo('toObject', text);
      this.assertObjectIdentical(REFERENCE_TEXT_OBJECT, text.toObject());
    },
    testComplexity: function() {
      var text = new Canvas.Text('foo');
      this.assertRespondsTo('complexity', text);
    },
    testSet: function() {
      var text = new Canvas.Text('foo');
      this.assertRespondsTo('set', text);
      this.assertIdentical(text, text.set('text', 'bar'), 'should be chainable');
    },
    testSetColor: function() {
      var text = new Canvas.Text('foo');
      this.assertRespondsTo('setColor', text);
      this.assertIdentical(text, text.setColor('123456'), 'should be chainable');
      this.assertIdentical('123456', text.get('fill'));
    },
    testSetFontsize: function() {
      var text = new Canvas.Text('foo');
      this.assertRespondsTo('setFontsize', text);
      this.assertIdentical(text, text.setFontsize(12));
      this.assertIdentical(12, text.get('fontsize'));
    },
    testGetText: function() {
      var text = new Canvas.Text('foo');
      this.assertRespondsTo('getText', text);
      this.assertIdentical('foo', text.getText());
      this.assertIdentical(text.get('text'), text.getText());
    },
    testSetText: function() {
      var text = new Canvas.Text('foo');
      this.assertRespondsTo('setText', text);
      this.assertIdentical(text, text.setText('bar'), 'should be chainable');
      this.assertIdentical('bar', text.getText());
    },
    testCanvasTextFromObject: function() {
      this.assertRespondsTo('fromObject', Canvas.Text);
      var text = Canvas.Text.fromObject(REFERENCE_TEXT_OBJECT);
      this.assertObjectIdentical(REFERENCE_TEXT_OBJECT, text.toObject());
    },
    testCanvasTextAlreadyDefined: function() {
      var warnWasCalled = false;
      console.warn = function() {
        warnWasCalled = true;
      }
      loadScript('../../canvas/canvas_text.class.js');
      this.wait(1000, function(){
        this.assert(warnWasCalled);
      });
    },
    testCanvasObjectDoesntExist: function() {
      var warnWasCalled = false;
      console.warn = function() {
        warnWasCalled = true;
      }
      delete Canvas.Text;
      delete Canvas.Object;
      loadScript('../../canvas/canvas_text.class.js');
      this.wait(1000, function() {
        this.assert(warnWasCalled);
      });
    }
  });
}
