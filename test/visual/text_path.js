(function() {
  var visualTestLoop;
  if (fabric.isLikelyNode) {
    visualTestLoop = global.visualTestLoop;
  }
  else {
    visualTestLoop = window.visualTestLoop;
  }
  var tests = [];
  function textpath1(canvas, callback) {
    var circlePath = new fabric.Path('M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0');
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
    width: 150,
    height: 60,
  });

  tests.forEach(visualTestLoop(QUnit));
})();
