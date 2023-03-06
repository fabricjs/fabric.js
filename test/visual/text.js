(function() {
  fabric.config.configure({
    enableGLFiltering: false
  });
  if (isNode()) {
    const { registerFont } = require('canvas');
    registerFont(__dirname + '/../fixtures/Ubuntu-Regular.ttf', {
      family: 'Ubuntu', weight: 'regular', style: 'normal'
    });
    registerFont(__dirname + '/../fixtures/Ubuntu-Bold.ttf', {
      family: 'Ubuntu', weight: 'bold', style: 'normal'
    });
    registerFont(__dirname + '/../fixtures/Ubuntu-Italic.ttf', {
      family: 'Ubuntu', weight: 'regular', style: 'italic'
    });
    registerFont(__dirname + '/../fixtures/Ubuntu-BoldItalic.ttf', {
      family: 'Ubuntu', weight: 'bold', style: 'italic'
    });
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
    beforeEachHandler: function() {
      fabric.Object.ownDefaults.objectCaching = false;
    }
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
        {0: {0: {fill: 'red',fontSize: 20},1: {fill: 'red',fontSize: 30},2: {fill: 'red',fontSize: 40},3: {fill: 'red',fontSize: 50},4: {fill: 'red',fontSize: 60},6: {textBackgroundColor: 'yellow'},7: {textBackgroundColor: 'yellow',textDecoration: ' line-through',linethrough: true},8: {textBackgroundColor: 'yellow',textDecoration: ' line-through',linethrough: true},9: {textBackgroundColor: 'yellow'}},1: {0: {textDecoration: 'underline'},1: {textDecoration: 'underline'},2: {fill: 'green',fontStyle: 'italic',textDecoration: 'underline'},3: {fill: 'green',fontStyle: 'italic',textDecoration: 'underline'},4: {fill: 'green',fontStyle: 'italic',textDecoration: 'underline'}},2: {0: {fill: 'blue',fontWeight: 'bold'},1: {fill: 'blue',fontWeight: 'bold'},2: {fill: 'blue',fontWeight: 'bold',fontSize: 63},4: {fontFamily: 'Courier',textDecoration: ' underline',underline: true},5: {fontFamily: 'Courier',textDecoration: ' underline',underline: true},6: {fontFamily: 'Courier',textDecoration: ' overline',overline: true},7: {fontFamily: 'Courier',textDecoration: ' overline',overline: true},8: {fontFamily: 'Courier',textDecoration: ' overline',overline: true}},3: {0: {fill: '#666',textDecoration: 'line-through'},1: {fill: '#666',textDecoration: 'line-through'},2: {fill: '#666',textDecoration: 'line-through'},3: {fill: '#666',textDecoration: 'line-through'},4: {fill: '#666',textDecoration: 'line-through'},7: {textDecoration: ' underline',underline: true},8: {stroke: '#ff1e15',strokeWidth: 2},9: {stroke: '#ff1e15',strokeWidth: 2}}}
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
      fontSize: 30, scaleX: 20, scaleY: 30, skewX: 30, skewY: 15, angle: 25
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
    disabled: true,
    golden: 'text5.png',
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
    disabled: !isNode(),
    percentage: 0.06,
  });

  function text7(canvas, callback) {
    var gradient = new fabric.Gradient({
      coords: {
        x1: 0,
        y1: 0,
        x2: 1,
        y2: 0
      },
      gradientUnits: 'percentage',
      colorStops: [{
        offset: 0,
        color: 'red',
      }, {
        offset: 1,
        color: 'blue'
      }]
    });
    var text = new fabric.Text('PERCENT GRADIENT\nPERCENT GRADIENT\nPERCENT GRADIENT', {
      left: 0,
      top: 0,
      fontSize: 32,
      fill: gradient,
    });
    canvas.add(text);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Text percentage gradient',
    code: text7,
    width: 350,
    height: 150,
    golden: 'text7.png',
    percentage: 0.04,
  });

  function text8(canvas, callback) {
    var text = new fabric.Text('Scaling down', {
      left: 10,
      top: 10,
      fill: 'red',
      fontSize: 300,
      scaleX: 0.2,
      scaleY: 0.2,
    });
    canvas.add(text);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Text with negative scaling',
    code: text8,
    width: 400,
    height: 150,
    disabled: true,
    golden: 'text8.png',
    percentage: 0.06,
  });

  function text9(canvas, callback) {
    var canvasP = fabric.util.createCanvasElement();
    canvasP.width = 10;
    canvasP.height = 10;
    var ctx = canvasP.getContext('2d');
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, 5, 5);
    ctx.fillStyle = 'red';
    ctx.fillRect(5, 5, 5, 5);
    ctx.fillStyle = 'yellow';
    ctx.fillRect(5, 0, 5, 5);
    ctx.fillStyle = 'purple';
    ctx.fillRect(0, 5, 5, 5);
    var pattern = new fabric.Pattern({ source: canvasP, patternTransform: [1, 0.3, 0.6, 0.8, 0, 0] });
    var relGradient = new fabric.Gradient({
      coords: {
        x1: 0,
        y1: 0,
        x2: 1,
        y2: 0
      },
      gradientUnits: 'percentage',
      colorStops: [{
        offset: 0,
        color: 'red',
      }, {
        offset: 1,
        color: 'blue'
      }]
    });
    var text = new fabric.Text('TEST', {
      left: 5,
      top: 5,
      fontSize: 180,
      fontFamily: 'Arial',
      paintFirst: 'stroke',
      strokeWidth: 12,
      strokeLineJoin: 'round',
      strokeLineCap: 'round',
      stroke: relGradient,
      fill: pattern,
    });
    canvas.add(text);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Text with pattern and gradient',
    code: text9,
    width: 480,
    height: 190,
    golden: 'text9.png',
    percentage: 0.09,
  });

  function text10(canvas, callback) {
    var path = new fabric.Path('M5 100 a95,95 0 1,0 190,0 a95,95 0 1,0 -190,0 z', { visible: false });
    var test = new fabric.Text('this is a long text we need to wrap around a shape. - BETA feature -', {
      left: 10,
      top: 10,
      fontSize: 16,
      fontFamily: 'Arial',
      paintFirst: 'stroke',
      strokeWidth: 4,
      strokeLineJoin: 'round',
      strokeLineCap: 'round',
      fill: 'blue',
      stroke: 'red',
      path: path
    });
    canvas.add(test);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Text on a path',
    code: text10,
    width: 220,
    height: 220,
    golden: 'text10.png',
    percentage: 0.06,
  });

  function text11(canvas, callback) {
    var itext = new fabric.Text('hello\nworld', {
      left: 4,
      top: 4,
      fontFamily: 'Arial',
      fill: 'purple',
      lineHeight: 1.1,
      styles: {
        0: {
          0: {
            fill: 'red',
            underline: true,
            linethrough: true
          },
          1: {
            fill: 'blue',
            underline: true,
            linethrough: true
          },
          2: {
            fill: 'blue',
            underline: true,
            linethrough: true
          },
          3: {
            fill: 'yellow',
            underline: true,
            linethrough: true
          },
        },
      }
    });
    var itext2 = new fabric.Text('Version 4.2.0', {
      left: 105,
      top: 4,
      fontFamily: 'Arial',
      fill: 'blue',
      lineHeight: 1.1,
      styles: {
        0: {
          0: {
            underline: true,
            linethrough: true
          },
          1: {
            fill: 'red',
            underline: true,
            linethrough: true
          },
          2: {
            fill: 'red',
            underline: true,
            linethrough: true
          },
          3: {
            fill: 'red',
            underline: true,
            linethrough: true
          },
          4: {
            fill: 'red',
            underline: true,
            linethrough: true
          },
          5: {
            fill: 'red',
            underline: true,
            linethrough: true
          },
          6: {
            fill: 'red',
            underline: true,
            linethrough: true
          },
        },
      }
    });
    canvas.add(itext);
    canvas.add(itext2);
    canvas.renderAll();
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Text and underline color',
    code: text11,
    width: 350,
    height: 100,
    golden: 'text11.png',
    percentage: 0.01,
  });

  function text12(canvas, callback) {
    fabric.Text.fromObject(
      JSON.parse('{"type":"IText","version":"4.4.0","left":1.28,"top":0.19,"width":740.57,"height":150.06,"fill":"#e38644","scaleX":0.48,"scaleY":0.48,"angle":0.2,"text":"השועל החום והזריז קופץ מעל הכלב העצלן\\nהשועל החום והזר33יז  קופץ מעל הכל העצלן\\nשלום עולם","fontWeight":"","fontFamily":"Arial","textAlign":"right","textBackgroundColor":"#d72323","direction":"rtl","styles":{"0":{"6":{"fill":"red"},"7":{"fill":"red"},"8":{"fill":"red","linethrough":true},"9":{"fill":"red","linethrough":true},"10":{"linethrough":true,"textBackgroundColor":"red"},"11":{"linethrough":true,"textBackgroundColor":"green"},"12":{"linethrough":true},"13":{"linethrough":true}},"1":{"8":{"underline":true},"9":{"underline":true},"10":{"underline":true},"11":{"underline":true},"12":{"underline":true},"13":{"underline":true,"fontSize":22},"14":{"underline":true,"fontSize":22},"15":{"underline":true,"fontSize":22},"16":{"underline":true,"fontSize":22},"17":{"fontSize":22},"18":{"fontSize":22},"19":{"fontSize":22},"20":{"fontSize":22},"21":{"fontSize":22},"22":{"fontSize":22,"textBackgroundColor":"blue"}}},"path":null}')
    ).then(function(text) {
      canvas.add(text);
      canvas.renderAll();
      callback(canvas.lowerCanvasEl);
    });
  }

  tests.push({
    test: 'Text with direction RTL',
    code: text12,
    width: 400,
    height: 150,
    disabled: isNode(),
    golden: 'text12.png',
    percentage: 0.095,
  });

  function text13(canvas, callback) {
    fabric.Textbox.fromObject(
      JSON.parse('{"type":"Textbox","version":"4.5.0","left":0.94,"top":0.46,"width":231.02,"height":254.93,"scaleX":0.9,"scaleY":0.9,"angle":0.19,"text":"اگر شما یک طراح هستین و یا با طراحی های گرافیکی سروکار دارید.","fontFamily":"Arial","underline":true,"linethrough":true,"textAlign":"right","direction":"rtl","minWidth":20,"splitByGrapheme":false,"styles":{},"path":null}')
    ).then(function(text) {
      canvas.add(text);
      canvas.renderAll();
      callback(canvas.lowerCanvasEl);
    });
  }

  tests.push({
    test: 'Text with direction RTL and underline, single render',
    code: text13,
    width: 232,
    height: 255,
    disabled: isNode(),
    golden: 'text13.png',
    percentage: 0.092,
  });

  function dragImage({ viewportTransform = fabric.iMatrix, retinaScaling = 1 }, canvas, callback) {
    const text = new fabric.Textbox('lorem ipsum\ndolor\nsit Amet2\nconsectgetur',
      { objectCaching: false, fontFamily: 'Arial', styles:
        {0: {0: {fill: 'red',fontSize: 20},1: {fill: 'red',fontSize: 30},2: {fill: 'red',fontSize: 40},3: {fill: 'red',fontSize: 50},4: {fill: 'red',fontSize: 60},6: {textBackgroundColor: 'yellow'},7: {textBackgroundColor: 'yellow',textDecoration: ' line-through',linethrough: true},8: {textBackgroundColor: 'yellow',textDecoration: ' line-through',linethrough: true},9: {textBackgroundColor: 'yellow'}},1: {0: {textDecoration: 'underline'},1: {textDecoration: 'underline'},2: {fill: 'green',fontStyle: 'italic',textDecoration: 'underline'},3: {fill: 'green',fontStyle: 'italic',textDecoration: 'underline'},4: {fill: 'green',fontStyle: 'italic',textDecoration: 'underline'}},2: {0: {fill: 'blue',fontWeight: 'bold'},1: {fill: 'blue',fontWeight: 'bold'},2: {fill: 'blue',fontWeight: 'bold',fontSize: 63},4: {fontFamily: 'Courier',textDecoration: ' underline',underline: true},5: {fontFamily: 'Courier',textDecoration: ' underline',underline: true},6: {fontFamily: 'Courier',textDecoration: ' overline',overline: true},7: {fontFamily: 'Courier',textDecoration: ' overline',overline: true},8: {fontFamily: 'Courier',textDecoration: ' overline',overline: true}},3: {0: {fill: '#666',textDecoration: 'line-through'},1: {fill: '#666',textDecoration: 'line-through'},2: {fill: '#666',textDecoration: 'line-through'},3: {fill: '#666',textDecoration: 'line-through'},4: {fill: '#666',textDecoration: 'line-through'},7: {textDecoration: ' underline',underline: true},8: {stroke: '#ff1e15',strokeWidth: 2},9: {stroke: '#ff1e15',strokeWidth: 2}}}
      }
    );
    canvas.add(text);
    canvas.viewportTransform = viewportTransform;
    const dragEventStub = {
      clientX: 0,
      clientY: 0,
      dataTransfer: {
        setDragImage(imageSource, x, y) {
          canvas.getContext().drawImage(imageSource, 0, 0);
          callback(canvas.lowerCanvasEl);
        }
      }
    };
    text.draggableTextDelegate.setDragImage(dragEventStub, {
      selectionStart: 3,
      selectionEnd: 20
    });
  }

  tests.push({
    test: 'Draggable text drag image',
    code: dragImage.bind(null, {}),
    disabled: isNode(),
    golden: 'drag_image.png',
    width: 120,
    height: 220,
    percentage: 0.01,
    fabricClass: 'Canvas'
  });

  tests.push({
    test: 'Draggable text drag image + retina scaling',
    code: dragImage.bind(null, { retinaScaling: 3 }),
    disabled: isNode(),
    golden: 'drag_image.png',
    width: 110,
    height: 250,
    percentage: 0.01,
    fabricClass: 'Canvas'
  });

  tests.push({
    test: 'Draggable text drag image + vpt',
    code: dragImage.bind(null, { viewportTransform: [2, 0, 0, 1, 250, -250] }),
    disabled: isNode(),
    golden: 'drag_image_vpt.png',
    width: 220,
    height: 250,
    percentage: 0.01,
    fabricClass: 'Canvas'
  });

  tests.push({
    test: 'Draggable text drag image + vpt + retina',
    code: dragImage.bind(null, { viewportTransform: [2, 0, 0, 1, 250, -250], retinaScaling: 1.25 }),
    disabled: isNode(),
    golden: 'drag_image_vpt.png',
    width: 220,
    height: 250,
    percentage: 0.01,
    fabricClass: 'Canvas'
  });

  function draggableTextEffects(canvas, callback) {
    const source = new fabric.IText('A draggable text\nSecond line');
    const target = new fabric.Textbox('A draggable textbox, Second line', { width: 200, left: 20, top: 20, fill: 'red' });
    canvas.add(source, target);
    canvas.setActiveObject(source);
    source.enterEditing();
    source.selectAll();
    canvas._onMouseDown({
      clientX: 5,
      clientY: 5,
    });
    canvas._onDragStart({
      clientX: 5,
      clientY: 5,
      preventDefault() {

      },
      stopPropagation() {

      },
      dataTransfer: {
        setData() {

        },
        setDragImage(imageSource, x, y) {

        }
      }
    });
    canvas._onDragOver({
      clientX: 25,
      clientY: 25,
      preventDefault() {

      },
      stopPropagation() {

      },
    });
    canvas.getContext().drawImage(canvas.upperCanvasEl, 0, 0);
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Overlapping draggable text effects',
    code: draggableTextEffects,
    disabled: isNode(),
    golden: 'overlapping_draggable_text_effects.png',
    width: 270,
    height: 120,
    percentage: 0.05,
    fabricClass: 'Canvas'
  });

  // sinon could have spied this w/o effort and in one line
  class TestTextbox extends fabric.Textbox {
    __calledInitDimensions = 0;
    initDimensions() {
      super.initDimensions();
      this.initialized && this.__calledInitDimensions++;
    }
  }

  function selectionClearingEdgeCases(canvas, callback, assert) {
    const text = new TestTextbox('lorem ipsum dolor sit Amet consectgetur', {
      width: 200,
      centeredRotation: true
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing();
    text.selectAll();
    canvas.renderAll();
    text.rotate(90);
    text.scale(0.8);
    canvas.centerObject(text);
    canvas.renderAll();
    assert.equal(text.__calledInitDimensions, 0, 'initDimensions was not called');
    canvas.getContext().drawImage(canvas.upperCanvasEl, 0, 0);
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Text selection clearing edge cases: transform',
    code: selectionClearingEdgeCases,
    width: 200,
    height: 200,
    disabled: isNode(),
    golden: 'textSelectionClearing.png',
    percentage: 0.02,
    fabricClass: 'Canvas'
  });

  function selectionClearingEdgeCases2(canvas, callback, assert) {
    const text = new TestTextbox('lorem ipsum dolor sit Amet sit Amet', {
      width: 200,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing();
    text.selectAll();
    assert.ok(canvas.contextTopDirty, 'flagged as dirty');
    canvas.renderAll();
    text.width = 150;
    text._forceClearCache = true;
    canvas.renderAll();
    assert.equal(text.__calledInitDimensions, 1, 'initDimensions was called');
    canvas.getContext().drawImage(canvas.upperCanvasEl, 0, 0);
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Text selection clearing edge cases: changing width, `initDimensions`',
    code: selectionClearingEdgeCases2,
    width: 200,
    height: 200,
    disabled: isNode(),
    golden: 'textSelectionClearing2.png',
    percentage: 0.02,
    fabricClass: 'Canvas'
  });

  function selectionClearingEdgeCases3(canvas, callback, assert) {
    const text = new TestTextbox('lorem ipsum dolor sit Amet consectgetur', {
      width: 200
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing();
    text.selectAll();
    canvas.renderAll();
    canvas.setViewportTransform([0.8, 0, 0, 1, 0, 0]);
    canvas.renderAll();
    assert.equal(text.__calledInitDimensions, 0, 'initDimensions was not called');
    canvas.getContext().drawImage(canvas.upperCanvasEl, 0, 0);
    callback(canvas.lowerCanvasEl);
  }

  tests.push({
    test: 'Text selection clearing edge cases: vpt',
    code: selectionClearingEdgeCases3,
    width: 200,
    height: 200,
    disabled: isNode(),
    golden: 'textSelectionClearing3.png',
    percentage: 0.03,
    fabricClass: 'Canvas'
  });

  tests.forEach(visualTestLoop(QUnit));
})();
