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
    'height':                   58.76,
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

  test('toSVG', function() {
    var iText = new fabric.IText('test foo bar-baz\nqux', {
      styles: {
        0: {
          0: { fill: '#112233' },
          2: { stroke: '#223344' }
        }
      }
    });

    equal(typeof iText.toSVG, 'function');

    // because translate values differ
    if (!fabric.isLikelyNode) {
      equal(iText.toSVG(), '\t<g transform=\"translate(124.88 52.93)\">\n\t\t<text font-family=\"Times New Roman\" font-size=\"40\" font-weight=\"normal\" style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\" ><tspan x=\"-124.384765625\" y=\"-17.232\" style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; fill: #112233; fill-rule: ; opacity: 1;\">t</tspan><tspan x=\"-113.271484375\" y=\"-17.232\" style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: ; opacity: 1;\">e</tspan><tspan x=\"-95.517578125\" y=\"-17.232\" style=\"stroke: #223344; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: ; opacity: 1;\">s</tspan><tspan x=\"-79.951171875\" y=\"-17.232\" style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: ; opacity: 1;\">t</tspan><tspan x=\"-68.837890625\" y=\"-17.232\" style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: ; opacity: 1;\"> </tspan><tspan x=\"-58.837890625\" y=\"-17.232\" style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: ; opacity: 1;\">f</tspan><tspan x=\"-45.517578125\" y=\"-17.232\" style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: ; opacity: 1;\">o</tspan><tspan x=\"-25.517578125\" y=\"-17.232\" style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: ; opacity: 1;\">o</tspan><tspan x=\"-5.517578125\" y=\"-17.232\" style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: ; opacity: 1;\"> </tspan><tspan x=\"4.482421875\" y=\"-17.232\" style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: ; opacity: 1;\">b</tspan><tspan x=\"24.482421875\" y=\"-17.232\" style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: ; opacity: 1;\">a</tspan><tspan x=\"42.236328125\" y=\"-17.232\" style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: ; opacity: 1;\">r</tspan><tspan x=\"55.556640625\" y=\"-17.232\" style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: ; opacity: 1;\">-</tspan><tspan x=\"68.876953125\" y=\"-17.232\" style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: ; opacity: 1;\">b</tspan><tspan x=\"88.876953125\" y=\"-17.232\" style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: ; opacity: 1;\">a</tspan><tspan x=\"106.630859375\" y=\"-17.232\" style=\"stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: ; opacity: 1;\">z</tspan><tspan x=\"-124.38\" y=\"35.2\" fill=\"rgb(0,0,0)\">qux</tspan></text>\n\t</g>\n');
    }

    // TODO: more SVG tests here?
  });

})();
