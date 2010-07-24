(function(){
  
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
    return new fabric.Image(elImage);
  }
  
  function createImageObject() {
    return _createImageObject(IMG_WIDTH, IMG_HEIGHT)
  }
  
  function createSmallImageObject() {
    return _createImageObject(IMG_WIDTH / 2, IMG_HEIGHT / 2);
  }
  
  module('fabric.Image');
  
  test('constructor', function() {
    ok(fabric.Image);
    
    var image = createImageObject();
    
    ok(image instanceof fabric.Image);
    ok(image instanceof fabric.Object);
    
    equals(image.get('type'), 'image');
  });
  
  test('toObject', function() {
    var image = createImageObject();
    ok(typeof image.toObject == 'function');
    same(REFERENCE_IMG_OBJECT, image.toObject());
  });
  
  test('toString', function() {
    var image = createImageObject();
    ok(typeof image.toString == 'function');
    equals(image.toString(), '#<fabric.Image: { src: "' + IMG_SRC + '" }>');
  });
  
  test('getSrc', function() {
    var image = createImageObject();
    ok(typeof image.getSrc == 'function');
    equals(image.getSrc(), IMG_SRC);
  });
  
  test('getElement', function() {
    var elImage = document.createElement('image');
    var image = new fabric.Image(elImage);
    ok(typeof image.getElement == 'function');
    equals(image.getElement(), elImage);
  });
  
  test('setElement', function() {
    var image = createImageObject();
    ok(typeof image.setElement == 'function');
    
    var elImage = document.createElement('image');
    equals(image.setElement(elImage), image, 'chainable');
    equals(image.getElement(), elImage);
  });
  
  asyncTest('clone', function() {
    var image = createImageObject();
    ok(typeof image.clone == 'function');
    
    var imageClone = null;
    image.clone(function(clone) {
      imageClone = clone;
    });
    
    setTimeout(function() {
      ok(imageClone instanceof fabric.Image);
      same(imageClone.toObject(), image.toObject());
      start();
    }, 1000);
  });
  
  asyncTest('cloneWidthHeight', function() {
    var image = createSmallImageObject();
    
    var imageClone = null;
    image.clone(function(clone) {
      imageClone = clone;
    });
    
    setTimeout(function() {
      equals(imageClone.getElement().width, IMG_WIDTH / 2,
        'clone\'s element should have width identical to that of original image');
      equals(imageClone.getElement().height, IMG_HEIGHT / 2,
        'clone\'s element should have height identical to that of original image');
      start();
    }, 1000);
  });
  
  asyncTest('fromObject', function() {
    ok(typeof fabric.Image.fromObject == 'function');
    
    // should not throw error when no callback is given
    fabric.Image.fromObject(REFERENCE_IMG_OBJECT);
    
    var image;
    fabric.Image.fromObject(REFERENCE_IMG_OBJECT, function(instance){
      image = instance;
    });
    
    setTimeout(function() {
      ok(image instanceof fabric.Image);
      start();
    }, 1000);
  });
  
  asyncTest('fromURL', function() {
    ok(typeof fabric.Image.fromURL == 'function');
    
    // should not throw error when no callback is given
    // can't use `assertNothingRaised` due to asynchronous callback
    fabric.Image.fromURL(IMG_SRC);
    
    var image;
    fabric.Image.fromURL(IMG_SRC, function(instance) {
      image = instance;
    });
    
    setTimeout(function() {
      ok(image instanceof fabric.Image);
      same(REFERENCE_IMG_OBJECT, image.toObject());
      start();
    }, 1000);
  });
  
  test('toGrayscale', function() {
    var image = createImageObject(),
        imageEl = document.createElement('img');
        
    imageEl.src = IMG_SRC;
    image.setElement(imageEl);
    
    ok(typeof image.toGrayscale == 'function');
    
    if (!fabric.Element.supports('toDataURL')) {
      alert('toDataURL is not supported. Some tests can not be run.');
    }
    else {
      equals(image.__isGrayscaled, false);
      equals(image.toGrayscale(), image, 'chainable');
      equals(image.__isGrayscaled, true);
    }
  });
  
})();