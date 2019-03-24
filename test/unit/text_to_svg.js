(function() {
  function removeTranslate(str) {
    return str.replace(/matrix\(.*?\)/, '');
  }
  QUnit.module('fabric.Text');
  QUnit.test('toSVG', function(assert) {
    var TEXT_SVG = '<g transform=\"\" style=\"\"  >\n\t\t<text xml:space=\"preserve\" font-family=\"Times New Roman\" font-size=\"40\" font-style=\"normal\" font-weight=\"normal\" style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1; white-space: pre;\" ><tspan x=\"-10\" y=\"12.57\" >x</tspan></text>\n</g>\n';
    var text = new fabric.Text('x');
    assert.equal(removeTranslate(text.toSVG()), removeTranslate(TEXT_SVG));
    text.set('fontFamily', 'Arial');
    assert.equal(removeTranslate(text.toSVG()), removeTranslate(TEXT_SVG.replace('font-family="Times New Roman"', 'font-family="Arial"')));
  });
  QUnit.test('toSVG justified', function(assert) {
    var TEXT_SVG_JUSTIFIED = '<g transform=\"\" style=\"\"  >\n\t\t<text xml:space=\"preserve\" font-family=\"Times New Roman\" font-size=\"40\" font-style=\"normal\" font-weight=\"normal\" style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1; white-space: pre;\" ><tspan x=\"-60\" y=\"-13.65\" >xxxxxx</tspan><tspan x=\"-60\" y=\"38.78\" style=\"white-space: pre; \">x </tspan><tspan x=\"40\" y=\"38.78\" >y</tspan></text>\n</g>\n';
    var text = new fabric.Text('xxxxxx\nx y', {
      textAlign: 'justify',
    });

    assert.equal(removeTranslate(text.toSVG()), removeTranslate(TEXT_SVG_JUSTIFIED));
  });
  QUnit.test('toSVG with multiple spaces', function(assert) {
    var TEXT_SVG_MULTIPLESPACES = '<g transform=\"\" style=\"\"  >\n\t\t<text xml:space=\"preserve\" font-family=\"Times New Roman\" font-size=\"40\" font-style=\"normal\" font-weight=\"normal\" style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1; white-space: pre;\" ><tspan x=\"-105\" y=\"12.57\" style=\"white-space: pre; \">x                 y</tspan></text>\n</g>\n';
    var text = new fabric.Text('x                 y');
    assert.equal(removeTranslate(text.toSVG()), removeTranslate(TEXT_SVG_MULTIPLESPACES));
  });
  QUnit.test('toSVG with deltaY', function(assert) {
    fabric.Object.NUM_FRACTION_DIGITS = 0;
    var TEXT_SVG = '<g transform=\"\" style=\"\"  >\n\t\t<text xml:space=\"preserve\" font-family=\"Times New Roman\" font-size=\"40\" font-style=\"normal\" font-weight=\"normal\" style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1; white-space: pre;\" ><tspan x=\"-16\" y=\"13\" >x</tspan><tspan x=\"4\" y=\"13\"  dy=\"-14\" style=\"font-size: 24px; baseline-shift: 14; \">x</tspan></text>\n</g>\n';
    var text = new fabric.Text('xx', {
      styles: {
        0: {
          1: {
            deltaY: -14,
            fontSize: 24,
          }
        }
      }
    });
    assert.equal(removeTranslate(text.toSVG()), removeTranslate(TEXT_SVG));
    fabric.Object.NUM_FRACTION_DIGITS = 2;
  });

  QUnit.test('toSVG with font', function(assert) {
    var TEXT_SVG_WITH_FONT = '<g transform=\"\" style=\"\"  >\n\t\t<text xml:space=\"preserve\" font-family=\"Times New Roman\" font-size=\"40\" font-style=\"normal\" font-weight=\"normal\" style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1; white-space: pre;\" ><tspan x=\"-60\" y=\"-13.65\" style=\"font-family: \'Times New Roman\'; \">xxxxxx</tspan><tspan x=\"-60\" y=\"38.78\" style=\"white-space: pre; \">x </tspan><tspan x=\"40\" y=\"38.78\" >y</tspan></text>\n</g>\n';
    var text = new fabric.Text('xxxxxx\nx y', {
      textAlign: 'justify',
      styles: {0: {
        0: {fontFamily: 'Times New Roman'},
        1: {fontFamily: 'Times New Roman'},
        2: {fontFamily: 'Times New Roman'},
        3: {fontFamily: 'Times New Roman'},
        4: {fontFamily: 'Times New Roman'},
        5: {fontFamily: 'Times New Roman'}
      }}
    });
    assert.equal(removeTranslate(text.toSVG()), removeTranslate(TEXT_SVG_WITH_FONT));
  });
  QUnit.test('toSVG with text as a clipPath', function(assert) {
    fabric.Object.NUM_FRACTION_DIGITS = 0;
    fabric.Object.__uid = 0;
    var EXPECTED = '<g transform=\"\" clip-path=\"url(#CLIPPATH_0)\"  >\n<clipPath id=\"CLIPPATH_0\" >\n\t\t\t<text xml:space=\"preserve\" font-family=\"Times New Roman\" font-size=\"40\" font-style=\"normal\" font-weight=\"normal\" style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1; white-space: pre;\" ><tspan x=\"-122\" y=\"13\" >text as clipPath</tspan></text>\n</clipPath>\n<rect style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x=\"-100\" y=\"-50\" rx=\"0\" ry=\"0\" width=\"200\" height=\"100\" />\n</g>\n';
    var clipPath = new fabric.Text('text as clipPath');
    var rect = new fabric.Rect({ width: 200, height: 100 });
    rect.clipPath = clipPath;
    assert.equal(removeTranslate(rect.toSVG()), removeTranslate(EXPECTED));
    fabric.Object.NUM_FRACTION_DIGITS = 2;
  });
})();
