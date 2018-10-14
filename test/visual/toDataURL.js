(function() {
  fabric.enableGLFiltering = false;
  fabric.isWebglSupported = false;
  fabric.Object.prototype.objectCaching = true;
  var visualTestLoop;
  if (fabric.isLikelyNode) {
    visualTestLoop = global.visualTestLoop;
  }
  else {
    visualTestLoop = window.visualTestLoop;
  }
  var fabricCanvas = this.canvas = new fabric.Canvas(null, {
    enableRetinaScaling: false, renderOnAddRemove: false, width: 200, height: 200,
  });

  var tests = [];

  function toDataURL1(canvas, callback) {
    var text = new fabric.Text('Hi i m an image',
      { strokeWidth: 2, stroke: 'red', fontSize: 60, objectCaching: false }
    );
    callback(text.toDataURL());
  }

  tests.push({
    test: 'Text to DataURL',
    code: toDataURL1,
    golden: 'dataurl1.png',
    newModule: 'DataURL exports',
    percentage: 0.06,
  });

  function toDataURL2(canvas, callback) {
    var text = new fabric.Text('Hi i m an image',
      { strokeWidth: 0, fontSize: 60, objectCaching: false }
    );
    var shadow = new fabric.Shadow({
      color: 'purple',
      offsetX: 0,
      offsetY: 0,
      blur: 10,
    });
    text.shadow = shadow;
    callback(text.toDataURL());
  }

  tests.push({
    test: 'Text to DataURL with shadow no offset',
    code: toDataURL2,
    golden: 'dataurl2.png',
    percentage: 0.06,
  });

  function toDataURL3(canvas, callback) {
    var text = new fabric.Text('Hi i m an image',
      { strokeWidth: 0, fontSize: 60, objectCaching: false }
    );
    var shadow = new fabric.Shadow({
      color: 'purple',
      offsetX: -30,
      offsetY: +40,
      blur: 15,
    });
    text.shadow = shadow;
    callback(text.toDataURL());
  }

  tests.push({
    test: 'Text to DataURL with shadow large offset',
    code: toDataURL3,
    golden: 'dataurl3.png',
    percentage: 0.06,
  });

  function testWrapper(test) {
    var actualTest = test.code;
    test.code = function(canvas, callback) {
      actualTest(canvas, function(dataURL) {
        var img = fabric.document.createElement('img');
        var canvas = fabric.document.createElement('canvas');
        img.onload = function() {
          canvas.width = img.width;
          canvas.height = img.height;
          canvas.getContext('2d').drawImage(img, 0, 0);
          callback(canvas);
        };
        img.src = dataURL;
      });
    };
    visualTestLoop(fabricCanvas, QUnit)(test);
  }

  tests.forEach(testWrapper);
})();
