(function() {

  QUnit.module('fabric.IText');

  var ITEXT_OBJECT = {
    'type':                 'text',
    'originX':              'left',
    'originY':              'top',
    'left':                 0,
    'top':                  0,
    'width':                20,
    'height':               52,
    'fill':                 'rgb(0,0,0)',
    'stroke':               null,
    'strokeWidth':          1,
    'strokeDashArray':      null,
    'strokeLineCap':        'butt',
    'strokeLineJoin':       'miter',
    'strokeMiterLimit':     10,
    'scaleX':               1,
    'scaleY':               1,
    'angle':                0,
    'flipX':                false,
    'flipY':                false,
    'opacity':              1,
    'shadow':               null,
    'visible':              true,
    'clipTo':               null,
    'text':                 'x',
    'fontSize':             40,
    'fontWeight':           'normal',
    'fontFamily':           'Times New Roman',
    'fontStyle':            '',
    'lineHeight':           1.3,
    'textDecoration':       '',
    'textAlign':            'left',
    'path':                 null,
    'backgroundColor':      '',
    'textBackgroundColor':  '',
    'useNative':            true,
    styles:                 { }
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
    var lastInstance = fabric.IText.instances[fabric.IText.instances.length - 1];
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
    var loc = iText.get2DCursorLocation();

    equal(loc.lineIndex, 0);
    equal(loc.charIndex, 3);

    // test
    // fo|o
    iText.selectionStart = iText.selectionEnd = 7;
    var loc = iText.get2DCursorLocation();

    equal(loc.lineIndex, 1);
    equal(loc.charIndex, 2);

    // test
    // foo
    // barba|z
    iText.selectionStart = iText.selectionEnd = 14;
    var loc = iText.get2DCursorLocation();

    equal(loc.lineIndex, 2);
    equal(loc.charIndex, 5);
  });

  test('isEmptyStyles', function() {
    var iText = new fabric.IText('test');
    ok(iText.isEmptyStyles());

    var iText = new fabric.IText('test', {
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

    var iText = new fabric.IText('test', {
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

  // test('getSelectionStyles', function() {
  //   // TODO:
  // });

  // test('setSelectionStyles', function() {
  //   // TODO:
  // });

  // test('getCurrentCharFontSize', function() {
  //   // TODO:
  // });

  // test('getCurrentCharColor', function() {
  //   // TODO:
  // });

  // test('toSVG', function() {
  //   // TODO:
  // });

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

})();
