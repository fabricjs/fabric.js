(function() {
  var canvas = this.canvas = new fabric.Canvas();

  QUnit.module('fabric.IText', {
    teardown: function() {
      canvas.clear();
    }
  });

  var ITEXT_OBJECT = {
    'type':                     'text',
    'originX':                  'left',
    'originY':                  'top',
    'left':                     0,
    'top':                      0,
    'width':                    20,
    'height':                   45.2,
    'fill':                     'rgb(0,0,0)',
    'stroke':                   null,
    'strokeWidth':              1,
    'strokeDashArray':          null,
    'strokeLineCap':            'butt',
    'strokeLineJoin':           'miter',
    'strokeMiterLimit':         10,
    'scaleX':                   1,
    'scaleY':                   1,
    'angle':                    0,
    'flipX':                    false,
    'flipY':                    false,
    'opacity':                  1,
    'shadow':                   null,
    'visible':                  true,
    'clipTo':                   null,
    'text':                     'x',
    'fontSize':                 40,
    'fontWeight':               'normal',
    'fontFamily':               'Times New Roman',
    'fontStyle':                '',
    'lineHeight':               1.3,
    'textDecoration':           '',
    'textAlign':                'left',
    'backgroundColor':          '',
    'textBackgroundColor':      '',
    'fillRule':                 'nonzero',
    'globalCompositeOperation': 'source-over',
    'skewX':                    0,
    'skewY':                    0,
    'transformMatrix':          null,
    'charSpacing':              0,
    styles:                     { }
  };

  test('constructor', function() {
    var iText = new fabric.IText('test');

    ok(iText instanceof fabric.IText);
    ok(iText instanceof fabric.Text);
  });

  test('initial properties', function() {
    var iText = new fabric.IText('test');
    ok(iText instanceof fabric.IText);

    equal(iText.text, 'test');
    equal(iText.type, 'i-text');
    deepEqual(iText.styles, { });
  });

  test('instances', function() {
    var iText = new fabric.IText('test');

    // Not on a sketchpad; storing it in instances array already would leak it forever.
    var instances = canvas._iTextInstances && canvas._iTextInstances;
    var lastInstance = instances && instances[instances.length - 1];
    equal(lastInstance, undefined);

    canvas.add(iText);
    instances = canvas._iTextInstances && canvas._iTextInstances;
    lastInstance = instances && instances[instances.length - 1];
    equal(lastInstance, iText);

    canvas.remove(iText);
    instances = canvas._iTextInstances && canvas._iTextInstances;
    lastInstance = instances && instances[instances.length - 1];
    equal(lastInstance, undefined);

    // Should survive being added again after removal.
    canvas.add(iText);
    lastInstance = canvas._iTextInstances && canvas._iTextInstances[canvas._iTextInstances.length - 1];
    equal(lastInstance, iText);
  });

  test('fromObject', function() {
    ok(typeof fabric.IText.fromObject == 'function');

    var iText = fabric.IText.fromObject(ITEXT_OBJECT);

    ok(iText instanceof fabric.IText);
    deepEqual(ITEXT_OBJECT, iText.toObject());
  });

  test('lineHeight with single line', function() {
    var text = new fabric.IText('text with one line');
    text.lineHeight = 2;
    text._initDimensions();
    var height = text.height;
    text.lineHeight = 0.5;
    text._initDimensions();
    var heightNew = text.height;
    equal(height, heightNew, 'text height does not change with one single line');
  });

  test('lineHeight with multi line', function() {
    var text = new fabric.IText('text with\ntwo lines');
    text.lineHeight = 0.1;
    text._initDimensions();
    var height = text.height,
        minimumHeight = text.fontSize * text._fontSizeMult;
    equal(height > minimumHeight, true, 'text height is always bigger than minimum Height');
  });

  test('toObject', function() {
    var styles = {
      0: {
        0: { fill: 'red' },
        1: { textDecoration: 'underline' }
      }
    };
    var iText = new fabric.IText('test', {
      styles: styles
    });
    equal(typeof iText.toObject, 'function');

    var obj = iText.toObject();
    deepEqual(obj.styles, styles);
    notEqual(obj.styles[0], styles[0]);
    notEqual(obj.styles[0][1], styles[0][1]);
    deepEqual(obj.styles[0], styles[0]);
    deepEqual(obj.styles[0][1], styles[0][1]);
  });

  test('setSelectionStart', function() {
    var iText = new fabric.IText('test');

    equal(typeof iText.setSelectionStart, 'function');

    equal(iText.selectionStart, 0);

    iText.setSelectionStart(3);
    equal(iText.selectionStart, 3);
    equal(iText.selectionEnd, 0);
  });

  test('empty itext', function() {
    var iText = new fabric.IText('');
    equal(iText.width, iText.cursorWidth);
  });

  test('setSelectionEnd', function() {
    var iText = new fabric.IText('test');

    equal(typeof iText.setSelectionEnd, 'function');

    equal(iText.selectionEnd, 0);

    iText.setSelectionEnd(3);
    equal(iText.selectionEnd, 3);
    equal(iText.selectionStart, 0);
  });

  test('get2DCursorLocation', function() {
    var iText = new fabric.IText('test\nfoo\nbarbaz');
    var loc = iText.get2DCursorLocation();

    equal(loc.lineIndex, 0);
    equal(loc.charIndex, 0);

    // 'tes|t'
    iText.selectionStart = iText.selectionEnd = 3;
    loc = iText.get2DCursorLocation();

    equal(loc.lineIndex, 0);
    equal(loc.charIndex, 3);

    // test
    // fo|o
    iText.selectionStart = iText.selectionEnd = 7;
    loc = iText.get2DCursorLocation();

    equal(loc.lineIndex, 1);
    equal(loc.charIndex, 2);

    // test
    // foo
    // barba|z
    iText.selectionStart = iText.selectionEnd = 14;
    loc = iText.get2DCursorLocation();

    equal(loc.lineIndex, 2);
    equal(loc.charIndex, 5);
  });

  test('isEmptyStyles', function() {
    var iText = new fabric.IText('test');
    ok(iText.isEmptyStyles());

    iText = new fabric.IText('test', {
      styles: {
        0: {
          0: { }
        },
        1: {
          0: { }, 1: { }
        }
      }
    });
    ok(iText.isEmptyStyles());

    iText = new fabric.IText('test', {
      styles: {
        0: {
          0: { }
        },
        1: {
          0: { fill: 'red' }, 1: { }
        }
      }
    });
    ok(!iText.isEmptyStyles());
  });

  test('selectAll', function() {
    var iText = new fabric.IText('test');

    iText.selectAll();
    equal(iText.selectionStart, 0);
    equal(iText.selectionEnd, 4);

    iText.selectionStart = 1;
    iText.selectionEnd = 2;

    iText.selectAll();
    equal(iText.selectionStart, 0);
    equal(iText.selectionEnd, 4);
  });

  test('getSelectedText', function() {
    var iText = new fabric.IText('test\nfoobarbaz');
    iText.selectionStart = 1;
    iText.selectionEnd = 10;
    equal(iText.getSelectedText(), 'est\nfooba');

    iText.selectionStart = iText.selectionEnd = 3;
    equal(iText.getSelectedText(), '');
  });

  test('enterEditing, exitEditing', function() {
    var iText = new fabric.IText('test');

    equal(typeof iText.enterEditing, 'function');
    equal(typeof iText.exitEditing, 'function');

    ok(!iText.isEditing);

    iText.enterEditing();
    ok(iText.isEditing);

    iText.exitEditing();
    ok(!iText.isEditing);
  });

/*  test('enterEditing, exitEditing eventlistener counts', function() {
    var iText = new fabric.IText('test');
    canvas.add(iText);
    equal(typeof iText.enterEditing, 'function');
    equal(typeof iText.exitEditing, 'function');
    iText.enterEditing();
    var length = iText.canvas.__eventListeners["mouse:move"].length;
    equal(iText.canvas.__eventListeners["mouse:move"], length);
    iText.exitEditing();
    equal(iText.canvas__eventListeners["mouse:move"].length, length - 1);
  });*/

  test('event firing', function() {
    var iText = new fabric.IText('test'),
        enter = 0, exit = 0, modify = 0;

    function countEnter() {
      enter++;
    }

    function countExit() {
      exit++;
    }

    function countModify() {
      modify++;
    }

    iText.on('editing:entered', countEnter);
    iText.on('editing:exited', countExit);
    iText.on('modified', countModify);

    equal(typeof iText.enterEditing, 'function');
    equal(typeof iText.exitEditing, 'function');

    iText.enterEditing();
    equal(enter, 1);
    equal(exit, 0);
    equal(modify, 0);

    iText.exitEditing();
    equal(enter, 1);
    equal(exit, 1);
    equal(modify, 0);

    iText.enterEditing();
    equal(enter, 2);
    equal(exit, 1);
    equal(modify, 0);

    iText.text = 'Test+';
    iText.exitEditing();
    equal(enter, 2);
    equal(exit, 2);
    equal(modify, 1);
  });

  test('insertChar and changed', function() {
    var iText = new fabric.IText('test'), changed = 0;

    function textChanged () {
      changed++;
    }
    equal(typeof iText.insertChar, 'function');
    iText.on('changed', textChanged);
    equal(changed, 0);
    iText.insertChar('foo_');
    equal(iText.text, 'foo_test');
    equal(changed, 1, 'event will fire once');
  });

  test('insertChar with style', function() {
    var iText = new fabric.IText('test'),
        style = {fontSize: 4};

    equal(typeof iText.insertChar, 'function');
    iText.insertChar('f', false, style);
    equal(iText.text, 'ftest');
    deepEqual(iText.styles[0][0], style);
  });

  test('insertChar with selectionStart with style', function() {
    var iText = new fabric.IText('test'),
        style = {fontSize: 4};
    equal(typeof iText.insertChar, 'function');
    iText.selectionStart = 2;
    iText.selectionEnd = 2;
    iText.insertChar('f', false, style);
    equal(iText.text, 'tefst');
    deepEqual(iText.styles[0][2], style);
  });


  test('insertChars', function() {
    var iText = new fabric.IText('test');

    equal(typeof iText.insertChars, 'function');

    iText.insertChars('foo_');
    equal(iText.text, 'foo_test');

    iText.text = 'test';
    iText.selectionStart = iText.selectionEnd = 2;
    iText.insertChars('_foo_');
    equal(iText.text, 'te_foo_st');

    iText.text = 'test';
    iText.selectionStart = 1;
    iText.selectionEnd = 3;
    iText.insertChars('_foo_');
    equal(iText.text, 't_foo_t');
  });

  test('insertChars changed', function() {
    var iText = new fabric.IText('test'), changed = 0;
    function textChanged () {
      changed++;
    }
    equal(typeof iText.insertChars, 'function');
    iText.on('changed', textChanged);
    equal(changed, 0);
    iText.insertChars('foo_');
    equal(changed, 1, 'insertChars fires the event once if there is no style');
    equal(iText.text, 'foo_test');
  });

  test('insertChars changed with copied style', function() {
    var iText = new fabric.IText('test'), changed = 0,
        style = {0: {fontSize: 20}, 1: {fontSize: 22}};
    function textChanged () {
      changed++;
    }
    fabric.copiedTextStyle = style;
    equal(typeof iText.insertChars, 'function');
    iText.on('changed', textChanged);
    equal(changed, 0);
    iText.insertChars('foo_', true);
    equal(changed, 1, 'insertChars fires once even if style is used');
    equal(iText.text, 'foo_test');
    deepEqual(iText.styles[0][0], style[0], 'style should be copied');
  });


  test('insertNewline', function() {
    var iText = new fabric.IText('test');

    equal(typeof iText.insertNewline, 'function');

    iText.selectionStart = iText.selectionEnd = 2;
    iText.insertNewline();

    equal(iText.text, 'te\nst');

    iText.text = 'test';
    iText.selectionStart = 1;
    iText.selectionEnd = 3;
    iText.insertNewline();

    equal(iText.text, 't\nt');
  });

  test('insertNewlineStyleObject', function() {
    var iText = new fabric.IText('test\n');

    equal(typeof iText.insertNewlineStyleObject, 'function');

    iText.insertNewlineStyleObject(0, 4, true);
    deepEqual(iText.styles, { '1': { '0': { } } });
  });

  test('shiftLineStyles', function() {
    var iText = new fabric.IText('test\ntest\ntest', {
      styles: {
        '1': {
          '0': { 'fill': 'red' },
          '1': { 'fill': 'red' },
          '2': { 'fill': 'red' },
          '3': { 'fill': 'red' }
        }
      }
    });

    equal(typeof iText.shiftLineStyles, 'function');

    iText.shiftLineStyles(0, +1);
    deepEqual(iText.styles, {
      '2': {
        '0': { 'fill': 'red' },
        '1': { 'fill': 'red' },
        '2': { 'fill': 'red' },
        '3': { 'fill': 'red' }
      }
    });

    iText.shiftLineStyles(0, -1);
    deepEqual(iText.styles, {
      '1': {
        '0': { 'fill': 'red' },
        '1': { 'fill': 'red' },
        '2': { 'fill': 'red' },
        '3': { 'fill': 'red' }
      }
    });

  });

  test('selectWord', function() {
    var iText = new fabric.IText('test foo bar-baz\nqux');

    equal(typeof iText.selectWord, 'function');

    iText.selectWord(1);
    equal(iText.selectionStart, 0); // |test|
    equal(iText.selectionEnd, 4);

    iText.selectWord(7);
    equal(iText.selectionStart, 5); // |foo|
    equal(iText.selectionEnd, 8);
  });

  test('selectLine', function() {
    var iText = new fabric.IText('test foo bar-baz\nqux');

    equal(typeof iText.selectLine, 'function');

    iText.selectLine(6);
    equal(iText.selectionStart, 0); // |test foo bar-baz|
    equal(iText.selectionEnd, 16);

    iText.selectLine(18);
    equal(iText.selectionStart, 17); // |qux|
    equal(iText.selectionEnd, 20);
  });

  test('findWordBoundaryLeft', function() {
    var iText = new fabric.IText('test foo bar-baz\nqux');

    equal(typeof iText.findWordBoundaryLeft, 'function');

    equal(iText.findWordBoundaryLeft(3), 0); // 'tes|t'
    equal(iText.findWordBoundaryLeft(20), 17); // 'qux|'
    equal(iText.findWordBoundaryLeft(6), 5); // 'f|oo'
    equal(iText.findWordBoundaryLeft(11), 9); // 'ba|r-baz'
  });

  test('findWordBoundaryRight', function() {
    var iText = new fabric.IText('test foo bar-baz\nqux');

    equal(typeof iText.findWordBoundaryRight, 'function');

    equal(iText.findWordBoundaryRight(3), 4); // 'tes|t'
    equal(iText.findWordBoundaryRight(17), 20); // '|qux'
    equal(iText.findWordBoundaryRight(6), 8); // 'f|oo'
    equal(iText.findWordBoundaryRight(11), 16); // 'ba|r-baz'
  });

  test('findLineBoundaryLeft', function() {
    var iText = new fabric.IText('test foo bar-baz\nqux');

    equal(typeof iText.findLineBoundaryLeft, 'function');

    equal(iText.findLineBoundaryLeft(3), 0); // 'tes|t'
    equal(iText.findLineBoundaryLeft(20), 17); // 'qux|'
  });

  test('findLineBoundaryRight', function() {
    var iText = new fabric.IText('test foo bar-baz\nqux');

    equal(typeof iText.findLineBoundaryRight, 'function');

    equal(iText.findLineBoundaryRight(3), 16); // 'tes|t'
    equal(iText.findLineBoundaryRight(17), 20); // '|qux'
  });

  test('getNumNewLinesInSelectedText', function() {
    var iText = new fabric.IText('test foo bar-baz\nqux');

    equal(typeof iText.getNumNewLinesInSelectedText, 'function');

    equal(iText.getNumNewLinesInSelectedText(), 0);

    iText.selectionStart = 0;
    iText.selectionEnd = 20;

    equal(iText.getNumNewLinesInSelectedText(), 1);
  });

  test('getSelectionStyles with no arguments', function() {
    var iText = new fabric.IText('test foo bar-baz\nqux', {
      styles: {
        0: {
          0: { textDecoration: 'underline' },
          2: { textDecoration: 'overline' },
          4: { textBackgroundColor: '#ffc' }
        },
        1: {
          0: { fill: 'red' },
          1: { fill: 'green' },
          2: { fill: 'blue' }
        }
      }
    });

    equal(typeof iText.getSelectionStyles, 'function');

    iText.selectionStart = 0;
    iText.selectionEnd = 0;

    deepEqual(iText.getSelectionStyles(), {
      textDecoration: 'underline'
    });

    iText.selectionStart = 2;
    iText.selectionEnd = 2;

    deepEqual(iText.getSelectionStyles(), {
      textDecoration: 'overline'
    });

    iText.selectionStart = 17;
    iText.selectionStart = 17;

    deepEqual(iText.getSelectionStyles(), {
      fill: 'red'
    });
  });

  test('getSelectionStyles with 1 arg', function() {

    var iText = new fabric.IText('test foo bar-baz\nqux', {
      styles: {
        0: {
          0: { textDecoration: 'underline' },
          2: { textDecoration: 'overline' },
          4: { textBackgroundColor: '#ffc' }
        },
        1: {
          0: { fill: 'red' },
          1: { fill: 'green' },
          2: { fill: 'blue' }
        }
      }
    });

    iText.selectionStart = 17;
    iText.selectionStart = 17;

    deepEqual(iText.getSelectionStyles(2), {
      textDecoration: 'overline'
    });
  });

  test('getSelectionStyles with 2 args', function() {
    var iText = new fabric.IText('test foo bar-baz\nqux', {
      styles: {
        0: {
          0: { textDecoration: 'underline' },
          2: { textDecoration: 'overline' },
          4: { textBackgroundColor: '#ffc' }
        },
        1: {
          0: { fill: 'red' },
          1: { fill: 'green' },
          2: { fill: 'blue' }
        }
      }
    });

    deepEqual(iText.getSelectionStyles(0, 2), [
      { textDecoration: 'underline' },
      { }
    ]);
  });

  test('setSelectionStyles', function() {
    var iText = new fabric.IText('test foo bar-baz\nqux', {
      styles: {
        0: {
          0: { fill: '#112233' },
          2: { stroke: '#223344' }
        }
      }
    });

    equal(typeof iText.setSelectionStyles, 'function');

    iText.setSelectionStyles({
      fill: 'red',
      stroke: 'yellow'
    });

    deepEqual(iText.styles[0][0], {
      fill: 'red',
      stroke: 'yellow'
    });

    iText.selectionStart = 2;
    iText.selectionEnd = 2;

    iText.setSelectionStyles({
      fill: '#998877',
      stroke: 'yellow'
    });

    deepEqual(iText.styles[0][2], {
      fill: '#998877',
      stroke: 'yellow'
    });
  });

  test('getCurrentCharFontSize', function() {
    var iText = new fabric.IText('test foo bar-baz\nqux', {
      styles: {
        0: {
          0: { fontSize: 20 },
          1: { fontSize: 60 }
        }
      }
    });

    equal(typeof iText.getCurrentCharFontSize, 'function');

    equal(iText.getCurrentCharFontSize(0, 0), 20);
    equal(iText.getCurrentCharFontSize(0, 1), 20);
    equal(iText.getCurrentCharFontSize(0, 2), 60);
    equal(iText.getCurrentCharFontSize(1, 0), 40);
  });

  test('object removal from canvas', function() {
    canvas.clear();
    canvas._iTextInstances = null;
    var text1 = new fabric.IText('Text Will be here');
    var text2 = new fabric.IText('Text Will be here');
    ok(!canvas._iTextInstances, 'canvas has no iText instances');
    ok(!canvas._hasITextHandlers, 'canvas has no handlers');

    canvas.add(text1);
    deepEqual(canvas._iTextInstances, [text1], 'canvas has 1 text instance');
    ok(canvas._hasITextHandlers, 'canvas has handlers');
    equal(canvas._iTextInstances.length, 1, 'just one itext object should be on canvas');

    canvas.add(text2);
    deepEqual(canvas._iTextInstances, [text1, text2], 'canvas has 2 text instance');
    ok(canvas._hasITextHandlers, 'canvas has handlers');
    equal(canvas._iTextInstances.length, 2, 'just two itext object should be on canvas');

    canvas.remove(text1);
    deepEqual(canvas._iTextInstances, [text2], 'canvas has 1 text instance');
    ok(canvas._hasITextHandlers, 'canvas has handlers');
    equal(canvas._iTextInstances.length, 1, 'just two itext object should be on canvas');

    canvas.remove(text2);
    deepEqual(canvas._iTextInstances, [], 'canvas has 0 text instance');
    ok(!canvas._hasITextHandlers, 'canvas has no handlers');
  });

  test('getCurrentCharColor', function() {
    var iText = new fabric.IText('test foo bar-baz\nqux', {
      styles: {
        0: {
          0: { fill: 'red' },
          1: { fill: 'green' }
        }
      }
    });

    equal(typeof iText.getCurrentCharColor, 'function');

    equal(iText.getCurrentCharColor(0, 0), 'red');
    equal(iText.getCurrentCharColor(0, 1), 'red');
    equal(iText.getCurrentCharColor(0, 2), 'green');

    // or cursor color
    equal(iText.getCurrentCharColor(1, 0), '#333');
  });

  // test('toSVG', function() {
  //   var iText = new fabric.IText('test', {
  //     styles: {
  //       0: {
  //         0: { fill: '#112233' },
  //         2: { stroke: '#223344' }
  //       }
  //     }
  //   });
  //   equal(typeof iText.toSVG, 'function');
  //   if (fabric.isLikelyNode) {
  //     equal(iText.toSVG(), '\t<g transform=\"translate(28.27 23.1)\">\n\t\t<text font-family=\"Times New Roman\" font-size=\"40\" font-weight=\"normal\" style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\" >\n\t\t\t<tspan x=\"-27.77\" y=\"12.6\" style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(17,34,51); fill-rule: ; opacity: 1;\">t</tspan>\n\t\t\t<tspan x=\"-16.66\" y=\"12.6\" style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: ; opacity: 1;\">e</tspan>\n\t\t\t<tspan x=\"1.09\" y=\"12.6\" style=\"stroke: rgb(34,51,68); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: ; opacity: 1;\">s</tspan>\n\t\t\t<tspan x=\"16.66\" y=\"12.6\" style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: ; opacity: 1;\">t</tspan>\n\t\t</text>\n\t</g>\n');
  //   }
  //   else {
  //     equal(iText.toSVG(), '\t<g transform=\"translate(28.27 23.1)\">\n\t\t<text font-family=\"Times New Roman\" font-size=\"40\" font-weight=\"normal\" style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\" >\n\t\t\t<tspan x=\"-27.77\" y=\"12.6\" style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(17,34,51); fill-rule: ; opacity: 1;\">t</tspan>\n\t\t\t<tspan x=\"-16.66\" y=\"12.6\" style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: ; opacity: 1;\">e</tspan>\n\t\t\t<tspan x=\"1.09\" y=\"12.6\" style=\"stroke: rgb(34,51,68); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: ; opacity: 1;\">s</tspan>\n\t\t\t<tspan x=\"16.66\" y=\"12.6\" style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: ; opacity: 1;\">t</tspan>\n\t\t</text>\n\t</g>\n');
  //   }
  // });

  test('toSVGWithFonts', function() {
    var iText = new fabric.IText('test foo bar-baz\nqux', {
      styles: {
        0: {
          0: { fill: '#112233' },
          2: { stroke: '#223344', fontFamily: 'Engagement' },
          3: { backgroundColor: '#00FF00' }
        }
      },
      fontFamily: 'Plaster'
    });
    fabric.fontPaths = {
      Engagement: 'path-to-engagement-font-file',
      Plaster: 'path-to-plaster-font-file',
    };
    canvas.add(iText);
    equal(typeof iText.toSVG, 'function');
    var parser;
    if (fabric.isLikelyNode) {
      var XmlDomParser = require('xmldom').DOMParser;
      parser = new XmlDomParser();
    }
    else {
      parser = new DOMParser();
    }
    var svgString = canvas.toSVG(),
        doc = parser.parseFromString(svgString, 'image/svg+xml'),
        style = doc.getElementsByTagName('style')[0].firstChild.data;
    equal(style, '\n\t\t@font-face {\n\t\t\tfont-family: \'Plaster\';\n\t\t\tsrc: url(\'path-to-plaster-font-file\');\n\t\t}\n\t\t@font-face {\n\t\t\tfont-family: \'Engagement\';\n\t\t\tsrc: url(\'path-to-engagement-font-file\');\n\t\t}\n');
  });

  test('measuring width of words', function () {
    var ctx = canvas.getContext('2d');
    var text = 'test foo bar';
    var iText = new fabric.IText(text, {
      styles: {
        0: {
          9: { fontWeight: 'bold' },
          10: { fontWeight: 'bold' },
          11: { fontWeight: 'bold' },
        }
      }
    });

    var textSplitted = text.split(' ');
    var measuredBy_getWidthOfWords_preservedSpaces = iText._getWidthOfWords(ctx, textSplitted.join(' '), 0, 0);
    var measuredBy_getWidthOfWords_omittedSpaces   = iText._getWidthOfWords(ctx, textSplitted.join(''), 0, 0);

    notEqual(measuredBy_getWidthOfWords_preservedSpaces, measuredBy_getWidthOfWords_omittedSpaces);
  });

})();
