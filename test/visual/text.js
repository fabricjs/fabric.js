(function() {
  fabric.enableGLFiltering = false;
  fabric.isWebglSupported = false;
  fabric.Object.prototype.objectCaching = false;
  var visualTestLoop;
  if (fabric.isLikelyNode) {
    fabric.nodeCanvas.registerFont(__dirname + '/../fixtures/Ubuntu-Regular.ttf', {
      family: 'Ubuntu', weight: 'regular', style: 'normal'
    });
    fabric.nodeCanvas.registerFont(__dirname + '/../fixtures/Ubuntu-Bold.ttf', {
      family: 'Ubuntu', weight: 'bold', style: 'normal'
    });
    fabric.nodeCanvas.registerFont(__dirname + '/../fixtures/Ubuntu-Italic.ttf', {
      family: 'Ubuntu', weight: 'regular', style: 'italic'
    });
    fabric.nodeCanvas.registerFont(__dirname + '/../fixtures/Ubuntu-BoldItalic.ttf', {
      family: 'Ubuntu', weight: 'bold', style: 'italic'
    });
    visualTestLoop = global.visualTestLoop;
  }
  else {
    visualTestLoop = window.visualTestLoop;
  }

  var tests = [];

  function text1(canvas, callback) {
    var text = new fabric.Text('Kerning: VAVAWA',
      { fontSize: 20, objectCaching: false, strokeWidth: 0 }
    );
    var text2 = new fabric.Text('multi line\ntext\nwith lot of space on some lines',
      { fontSize: 20, objectCaching: false, angle: 45, top: 40, left: 40, strokeWidth: 0 }
    );
    var text3 = new fabric.Text('multi line\ntext\nwith lot of space on some lines',
      { fontSize: 20, objectCaching: false, angle: -45, top: 200, left: 0, textAlign: 'right', strokeWidth: 0 }
    );
    canvas.add(text, text2, text3);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'simple text test',
    code: text1,
    golden: 'text1.png',
    newModule: 'Text',
    percentage: 0.06,
    width: 300,
    height: 300,
  });

  function text2(canvas, callback) {
    var text4 = new fabric.Text('2 spaces trailing  \nno trailing spance\n5 spaces trailing     ',
      { fontSize: 20, objectCaching: false, top: 200, left: 0, textAlign: 'right', strokeWidth: 0 }
    );
    var rect = new fabric.Rect({
      width: text4.width,
      height: text4.height,
      strokeWidth: 2,
      stroke: 'blue',
      fill: 'rgba(255, 255, 0, 0.4)',
      top: text4.top,
      left: text4.left
    });
    var text5 = new fabric.Text('  2 spaces both sides  \nno trailing spance\n     5 spaces both sides     ',
      { fontSize: 20, objectCaching: false, top: 250, angle: -90, left: 200, strokeWidth: 0 }
    );
    var rect2 = new fabric.Rect({
      width: text5.width,
      height: text5.height,
      strokeWidth: 2,
      stroke: 'green',
      fill: 'rgba(255, 0, 255, 0.4)',
      top: text5.top,
      left: text5.left,
      angle: text5.angle
    });
    var text = new fabric.Text('text with all decorations\nmultiline',
      { underline: true, overline: true, linethrough: true, fontSize: 30, strokeWidth: 0 }
    );
    canvas.add(rect, text4, rect2, text5, text);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Text with trailing spaces',
    code: text2,
    golden: 'text2.png',
    percentage: 0.06,
  });

  function text3(canvas, callback) {
    var text = new fabric.Text('lorem ipsum\ndolor\nsit Amet2\nconsectgetur',
      { objectCaching: false, fontFamily: 'Arial', styles:
        {'0': {'0': {'fill': 'red','fontSize': 20},'1': {'fill': 'red','fontSize': 30},'2': {'fill': 'red','fontSize': 40},'3': {'fill': 'red','fontSize': 50},'4': {'fill': 'red','fontSize': 60},'6': {'textBackgroundColor': 'yellow'},'7': {'textBackgroundColor': 'yellow','textDecoration': ' line-through','linethrough': true},'8': {'textBackgroundColor': 'yellow','textDecoration': ' line-through','linethrough': true},'9': {'textBackgroundColor': 'yellow'}},'1': {'0': {'textDecoration': 'underline'},'1': {'textDecoration': 'underline'},'2': {'fill': 'green','fontStyle': 'italic','textDecoration': 'underline'},'3': {'fill': 'green','fontStyle': 'italic','textDecoration': 'underline'},'4': {'fill': 'green','fontStyle': 'italic','textDecoration': 'underline'}},'2': {'0': {'fill': 'blue','fontWeight': 'bold'},'1': {'fill': 'blue','fontWeight': 'bold'},'2': {'fill': 'blue','fontWeight': 'bold','fontSize': 63},'4': {'fontFamily': 'Courier','textDecoration': ' underline','underline': true},'5': {'fontFamily': 'Courier','textDecoration': ' underline','underline': true},'6': {'fontFamily': 'Courier','textDecoration': ' overline','overline': true},'7': {'fontFamily': 'Courier','textDecoration': ' overline','overline': true},'8': {'fontFamily': 'Courier','textDecoration': ' overline','overline': true}},'3': {'0': {'fill': '#666','textDecoration': 'line-through'},'1': {'fill': '#666','textDecoration': 'line-through'},'2': {'fill': '#666','textDecoration': 'line-through'},'3': {'fill': '#666','textDecoration': 'line-through'},'4': {'fill': '#666','textDecoration': 'line-through'},'7': {'textDecoration': ' underline','underline': true},'8': {'stroke': '#ff1e15','strokeWidth': 2},'9': {'stroke': '#ff1e15','strokeWidth': 2}}}
      }
    );
    canvas.add(text);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Text with styles',
    code: text3,
    golden: 'text3.png',
    percentage: 0.06,
  });

  function text4(canvas, callback) {
    var text = new fabric.Text('lorem ipsum\ndolor\nsit Amet2\nconsectgetur', {
      fontSize: 30, scaleX: 20, scaleY: 30, skewX: 30, skewY: 25, skewY: 15, angle: 25
    });
    var matrix = text.calcTransformMatrix();
    canvas.viewportTransform = fabric.util.invertTransform(matrix);
    canvas.viewportTransform[4] = 0;
    canvas.viewportTransform[5] = 0;
    canvas.add(text);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Text on a transformed canvas',
    code: text4,
    golden: 'text4.png',
    percentage: 0.06,
  });

  function text5(canvas, callback) {
    var text = new fabric.Text('Scaling', {
      fontSize: 10, scaleX: 2, scaleY: 2, fill: 'rgba(0,0,255,0.4)', strokeWidth: 0
    });
    var text2 = new fabric.Text('Scaling', {
      fontSize: 10, scaleX: 3, scaleY: 3, fill: 'rgba(0,0,255,0.4)', top: 10, strokeWidth: 0
    });
    var text3 = new fabric.Text('Scaling', {
      fontSize: 10, scaleX: 4, scaleY: 4, fill: 'rgba(0,0,255,0.4)', top: 20, strokeWidth: 0
    });
    var text4 = new fabric.Text('Scaling', {
      fontSize: 10, scaleX: 5, scaleY: 5, fill: 'rgba(0,0,255,0.4)', top: 30, strokeWidth: 0
    });
    var text5 = new fabric.Text('Scaling', {
      fontSize: 10, scaleX: 6, scaleY: 6, fill: 'rgba(0,0,255,0.4)', top: 40, strokeWidth: 0
    });
    var text6 = new fabric.Text('Scaling', {
      fontSize: 10, scaleX: 7, scaleY: 7, fill: 'rgba(0,0,255,0.4)', top: 50, strokeWidth: 0
    });
    var text7 = new fabric.Text('A', {
      fontSize: 80, scaleX: 1, scaleY: 1, fill: 'rgb(0,0,255)', left: 190, strokeWidth: 12, stroke: 'rgba(255,0,0,0.2)'
    });
    var text8 = new fabric.Text('A', {
      fontSize: 65, scaleX: 8, scaleY: 8, fill: 'rgb(0,0,255)', top: -100, left: -100, strokeWidth: 12, stroke: 'rgba(255,0,0,0.2)'
    });
    canvas.add(text8, text, text2, text3, text4, text5, text6, text7);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Text with strokeWidths',
    code: text5,
    golden: 'text5.png',
    disabled: true,
    percentage: 0.15,
  });

  function text6(canvas, callback) {
    var text = new fabric.Text('regular', {
      left: 0,
      top: 0,
      fontFamily: 'Ubuntu'
    });
    canvas.add(text);

    text = new fabric.Text('bold', {
      left: 0,
      top: 50,
      fontFamily: 'Ubuntu',
      fontWeight: 'bold'
    });
    canvas.add(text);

    text = new fabric.Text('italic', {
      left: 0,
      top: 100,
      fontFamily: 'Ubuntu',
      fontStyle: 'italic'
    });
    canvas.add(text);

    text = new fabric.Text('bold italic', {
      left: 0,
      top: 150,
      fontFamily: 'Ubuntu',
      fontWeight: 'bold',
      fontStyle: 'italic'
    });
    canvas.add(text);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Text with custom fonts',
    code: text6,
    golden: 'text6.png',
    disabled: !fabric.isLikelyNode,
    percentage: 0.06,
  });

  tests.forEach(visualTestLoop(QUnit));
})();
