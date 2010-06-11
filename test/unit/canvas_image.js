function init() {
  
  function getAbsolutePath(path) {
    var isAbsolute = /^https?:/.test(path);
    if (isAbsolute) return path;
    var imgEl = document.createElement('img');
    imgEl.src = path;
    var src = imgEl.src;
    imgEl = null;
    return src;
  }
  
  var IMG_SRC     = getAbsolutePath('../fixtures/test_image.gif'),
      IMG_WIDTH   = 276,
      IMG_HEIGHT  = 110;
      
  var REFERENCE_IMG_OBJECT = {
    'type':         'image', 
    'left':         0, 
    'top':          0, 
    'width':        IMG_WIDTH, 
    'height':       IMG_HEIGHT, 
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
    'src':          IMG_SRC
  }
  
  function _createImageObject(width, height) {
    var elImage = document.createElement('image');
    elImage.src = IMG_SRC;
    elImage.width = width;
    elImage.height = height;
    return new Canvas.Image(elImage);
  }
  
  function createImageObject() {
    return _createImageObject(IMG_WIDTH, IMG_HEIGHT)
  }
  
  function createSmallImageObject() {
    return _createImageObject(IMG_WIDTH / 2, IMG_HEIGHT / 2);
  }
  
  new Test.Unit.Runner({
    testConstructor: function() {
      this.assert(Canvas.Image);
      
      var image = createImageObject();
      
      this.assertInstanceOf(Canvas.Image, image);
      this.assertInstanceOf(Canvas.Object, image);
      
      this.assertIdentical('image', image.get('type'));
    },
    
    testToObject: function() {
      var image = createImageObject();
      this.assertRespondsTo('toObject', image);
      this.assertObjectIdentical(REFERENCE_IMG_OBJECT, image.toObject());
    },
    
    testToString: function() {
      var image = createImageObject();
      this.assertRespondsTo('toString', image);
      this.assertIdentical('#<Canvas.Image: { src: "' + IMG_SRC + '" }>', image.toString());
    },
    
    testGetSrc: function() {
      var image = createImageObject();
      this.assertRespondsTo('getSrc', image);
      this.assertIdentical(IMG_SRC, image.getSrc());
    },
    
    testGetElement: function() {
      var elImage = document.createElement('image');
      var image = new Canvas.Image(elImage);
      this.assertRespondsTo('getElement', image);
      this.assertIdentical(elImage, image.getElement());
    },
    
    testSetElement: function() {
      var image = createImageObject();
      this.assertRespondsTo('setElement', image);
      
      var elImage = document.createElement('image');
      this.assertIdentical(image, image.setElement(elImage), 'chainable');
      this.assertIdentical(elImage, image.getElement());
    },
    
    testClone: function() {
      var image = createImageObject();
      this.assertRespondsTo('clone', image);
      
      var imageClone = null;
      image.clone(function(clone) {
        imageClone = clone;
      });
      
      this.wait(1000, function(){
        this.assertInstanceOf(Canvas.Image, imageClone);
        this.assertObjectIdentical(imageClone.toObject(), image.toObject());
      }.bind(this));
    },
    
    testCloneWidthHeight: function() {
      
      var image = createSmallImageObject();
      
      var imageClone = null;
      image.clone(function(clone) {
        imageClone = clone;
      });
      
      this.wait(1000, function(){
        this.assertIdentical(IMG_WIDTH / 2, imageClone.getElement().width, 
          'clone\'s element should have width identical to that of original image');
        this.assertIdentical(IMG_HEIGHT / 2, imageClone.getElement().height,
          'clone\'s element should have height identical to that of original image');
      }.bind(this));
    },
    
    testCanvasImageFromObject: function() {
      this.assertRespondsTo('fromObject', Canvas.Image);
      
      // should not throw error when no callback is given
      Canvas.Image.fromObject(REFERENCE_IMG_OBJECT);
      
      var image;
      Canvas.Image.fromObject(REFERENCE_IMG_OBJECT, function(instance){
        image = instance;
      });
      
      this.wait(1000, function(){
        this.assertInstanceOf(Canvas.Image, image);
      });
    },
    
    testCanvasImageFromURL: function() {
      this.assertRespondsTo('fromURL', Canvas.Image);
      
      // should not throw error when no callback is given
      // can't use `assertNothingRaised` due to asynchronous callback
      Canvas.Image.fromURL(IMG_SRC);
      
      var image;
      Canvas.Image.fromURL(IMG_SRC, function(instance) {
        image = instance;
      });
      
      this.wait(1000, function(){
        this.assertInstanceOf(Canvas.Image, image);
        this.assertObjectIdentical(REFERENCE_IMG_OBJECT, image.toObject());
      });
    },
    
    testToGrayscale: function() {
      var image = createImageObject(),
          imageEl = document.createElement('img');
          
      imageEl.src = IMG_SRC;
      image.setElement(imageEl);
      
      this.assertRespondsTo('toGrayscale', image);
      
      if (!Canvas.Element.supports('toDataURL')) {
        this.warn('toDataURL is not supported. Some tests can not be run.');
      }
      else {
        this.assertIdentical(false, image.__isGrayscaled);
        this.assertIdentical(image, image.toGrayscale(), 'chainable');
        this.assertIdentical(true, image.__isGrayscaled);
      }
    }
  });
}