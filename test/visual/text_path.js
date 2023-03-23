(function() {
  var visualTestLoop;
  if (isNode()) {
    visualTestLoop = global.visualTestLoop;
  }
  else {
    visualTestLoop = window.visualTestLoop;
  }
  var tests = [];
  function textpath1(canvas, callback) {
    var circlePath = new fabric.Path('M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0', { visible: false });
    var text = new fabric.Text('Hello this is a test of text on a path', {
      path: circlePath,
      fontSize: 24,
    });
    canvas.add(text);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'text on a circle path',
    code: textpath1,
    golden: 'textpath1.png',
    newModule: 'Text on paths',
    percentage: 0.09,
    width: 200,
    height: 200,
  });

  function textpath2(canvas, callback) {
    var path = new fabric.Path('M100 5 L 5 195 L 195 195 z', { visible: false });
    var text = new fabric.Text('wrapping with thigh corners it is what it is. Maybe one day it will look better', {
      left: 0,
      top: 0,
      fontSize: 16,
      fontFamily: 'Arial',
      paintFirst: 'stroke',
      strokeWidth: 2,
      strokeLineJoin: 'round',
      strokeLineCap: 'round',
      fill: 'blue',
      stroke: 'red',
      path: path,
      textBackgroundColor: 'yellow'
    });
    canvas.add(text);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'text on a triangle with background color',
    code: textpath2,
    golden: 'textpath2.png',
    percentage: 0.09,
    width: 200,
    height: 200,
  });

  function textpath3(canvas, callback) {
    var path = new fabric.Path('M -194 -109 C 538 -300 154 50 98 29', { visible: false });
    var text = new fabric.Text('Testing constant distance on bezier curve.', { path: path, top: 30, left: 30 });
    canvas.add(text);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Textpath on a particular bezier',
    code: textpath3,
    golden: 'textpath3.png',
    percentage: 0.09,
    width: 610,
    height: 270,
  });

  function textpath4(canvas, callback) {
    var path = new fabric.Path('M 0 0 Q 180 0 180 -101.25 Q 180 -180 90 -180 Q 0 -180 0 -112.5 Q 0 -45 78.75 -45 Q 135 -45 146.25 -90', { visible: false });
    var text = new fabric.Text('Text on a swirl path with textAlign right', {
      left: 50,
      top: 50,
      fontSize: 28,
      textAlign: 'right',
      charSpacing: 50,
      path: path
    });
    var text2 = new fabric.Text('Text on a swirl path with textAlign center', {
      left: 50,
      top: 50,
      fontSize: 28,
      textAlign: 'center',
      charSpacing: 50,
      path: path
    });
    canvas.add(text);
    canvas.add(text2);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'textpath aligned right',
    code: textpath4,
    golden: 'textpath4.png',
    percentage: 0.09,
    width: 300,
    height: 300,
  });

  function textpath5(canvas, callback) {
    canvas.loadFromJSON('{"version":"4.5.1","objects":[{"type":"Path","version":"4.5.1","left":213,"top":163,"width":180,"height":180,"fill":"","stroke":"red","strokeWidth":2,"path":[["M",0,0],["Q",180,0,180,-101.25],["Q",180,-180,90,-180],["Q",0,-180,0,-112.5],["Q",0,-45,78.75,-45],["Q",135,-45,146.25,-90]]},{"type":"Path","version":"4.5.1","left":200,"top":6,"width":180,"height":180,"fill":"","stroke":"red","strokeWidth":2,"path":[["M",0,0],["Q",180,0,180,-101.25],["Q",180,-180,90,-180],["Q",0,-180,0,-112.5],["Q",0,-45,78.75,-45],["Q",135,-45,146.25,-90]]},{"type":"Path","version":"4.5.1","left":18,"top":164,"width":180,"height":180,"fill":"","stroke":"red","strokeWidth":2,"path":[["M",0,0],["Q",180,0,180,-101.25],["Q",180,-180,90,-180],["Q",0,-180,0,-112.5],["Q",0,-45,78.75,-45],["Q",135,-45,146.25,-90]]},{"type":"Path","version":"4.5.1","left":9,"top":14,"width":180,"height":180,"fill":"","stroke":"red","strokeWidth":2,"path":[["M",0,0],["Q",180,0,180,-101.25],["Q",180,-180,90,-180],["Q",0,-180,0,-112.5],["Q",0,-45,78.75,-45],["Q",135,-45,146.25,-90]]},{"type":"Text","version":"4.5.1","left":10,"top":14,"width":180,"height":180,"text":"Text on a swirl textAlign right","fontSize":28,"textAlign":"right","charSpacing":50,"path":{"type":"Path","version":"4.5.1","originX":"left","originY":"top","left":-0.5,"top":-180.5,"width":180,"height":180,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":false,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",0,0],["Q",180,0,180,-101.25],["Q",180,-180,90,-180],["Q",0,-180,0,-112.5],["Q",0,-45,78.75,-45],["Q",135,-45,146.25,-90]]},"direction":"ltr","styles":{}},{"type":"Text","version":"4.5.1","left":15,"top":165,"width":180,"height":180,"text":"Text on a swirl textAlign left","fontSize":28,"charSpacing":50,"path":{"type":"Path","version":"4.5.1","originX":"left","originY":"top","left":-0.5,"top":-180.5,"width":180,"height":180,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":false,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",0,0],["Q",180,0,180,-101.25],["Q",180,-180,90,-180],["Q",0,-180,0,-112.5],["Q",0,-45,78.75,-45],["Q",135,-45,146.25,-90]]},"direction":"ltr","styles":{}},{"type":"Text","version":"4.5.1","left":201,"top":9,"width":180,"height":180,"text":"Text on a swirl textAlign center","fontSize":28,"textAlign":"center","charSpacing":50,"path":{"type":"Path","version":"4.5.1","originX":"left","originY":"top","left":-0.5,"top":-180.5,"width":180,"height":180,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":false,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",0,0],["Q",180,0,180,-101.25],["Q",180,-180,90,-180],["Q",0,-180,0,-112.5],["Q",0,-45,78.75,-45],["Q",135,-45,146.25,-90]]},"direction":"ltr","styles":{}},{"type":"Text","version":"4.5.1","left":213,"top":164,"width":180,"height":180,"text":"full text to understand better a Text on a swirl textAlign","fontSize":28,"charSpacing":50,"path":{"type":"Path","version":"4.5.1","originX":"left","originY":"top","left":-0.5,"top":-180.5,"width":180,"height":180,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":false,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",0,0],["Q",180,0,180,-101.25],["Q",180,-180,90,-180],["Q",0,-180,0,-112.5],["Q",0,-45,78.75,-45],["Q",135,-45,146.25,-90]]},"direction":"ltr","styles":{}}]}')
      .then(function() {
        canvas.renderAll();
        callback(canvas.lowerCanvasEl);
      });
  }

  tests.push({
    test: 'various textpath aligned',
    code: textpath5,
    golden: 'textpath5.png',
    percentage: 0.016,
    width: 500,
    height: 400,
  });

  function textpath6(canvas, callback) {
    var path = new fabric.Path('M 0 0 A 150 350 0 0 1 250 0', {
      strokeWidth: 2,
      stroke: 'blue',
      opacity: 0.5,
      left: 25,
      top: 25,
      fill: 'transparent'
    });
    var text = new fabric.Text('Text on the right side of a curve', {
      left: 25,
      top: 25,
      fontSize: 28,
      pathSide: 'right',
      pathStartOffset: 100,
      path: path
    });
    canvas.add(text);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'textpath with pathSide and pathStartOffset and painted path',
    code: textpath6,
    golden: 'textpath6.png',
    percentage: 0.09,
    width: 300,
    height: 200,
  });

  tests.forEach(visualTestLoop(QUnit));
})();
