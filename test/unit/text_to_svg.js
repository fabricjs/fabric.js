(function() {
  function removeTranslate(str) {
    return str.replace(/translate\(.*?\)/, '');
  }
  QUnit.module('fabric.Text');
  QUnit.test('toSVG', function(assert) {
    var TEXT_SVG = '\t<g transform="translate(10.5 26.72)">\n\t\t<text xml:space="preserve" font-family="Times New Roman" font-size="40" font-style="normal" font-weight="normal" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1; white-space: pre;" ><tspan x="-10" y="12.57" >x</tspan></text>\n\t</g>\n';
    var text = new fabric.Text('x');
    assert.equal(removeTranslate(text.toSVG()), removeTranslate(TEXT_SVG));
    text.set('fontFamily', 'Arial');
    assert.equal(removeTranslate(text.toSVG()), removeTranslate(TEXT_SVG.replace('font-family="Times New Roman"', 'font-family="Arial"')));
  });
  QUnit.test('toSVG justified', function(assert) {
    var TEXT_SVG_JUSTIFIED = '\t<g transform="translate(50.5 26.72)">\n\t\t<text xml:space="preserve" font-family="Times New Roman" font-size="40" font-style="normal" font-weight="normal" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1; white-space: pre;" ><tspan x="-60" y="-13.65" >xxxxxx</tspan><tspan x="-60" y="38.78" style="white-space: pre; ">x </tspan><tspan x=\"40\" y=\"38.78\" >y</tspan></text>\n\t</g>\n';
    var text = new fabric.Text('xxxxxx\nx y', {
      textAlign: 'justify',
    });

    assert.equal(removeTranslate(text.toSVG()), removeTranslate(TEXT_SVG_JUSTIFIED));
  });
  QUnit.test('toSVG with multiple spaces', function(assert) {
    var TEXT_SVG_MULTIPLESPACES = '\t<g transform="translate(50.5 26.72)">\n\t\t<text xml:space="preserve" font-family="Times New Roman" font-size="40" font-style="normal" font-weight="normal" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1; white-space: pre;" ><tspan x="-105" y="12.57" style="white-space: pre; ">x                 y</tspan></text>\n\t</g>\n';
    var text = new fabric.Text('x                 y');
    assert.equal(removeTranslate(text.toSVG()), removeTranslate(TEXT_SVG_MULTIPLESPACES));
  });
  QUnit.test('toSVG with deltaY', function(assert) {
    fabric.Object.NUM_FRACTION_DIGITS = 0;
    var TEXT_SVG = '\t<g transform="translate(10.5 26.7)">\n\t\t<text xml:space="preserve" font-family="Times New Roman" font-size="40" font-style="normal" font-weight="normal" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1; white-space: pre;" ><tspan x="-16" y="13" >x</tspan><tspan x="4" y="13"  dy="-14" style="font-size: 24px; baseline-shift: 14; ">x</tspan></text>\n\t</g>\n';
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
    var TEXT_SVG_WITH_FONT = '\t<g transform="translate(50.5 26.72)">\n\t\t<text xml:space="preserve" font-family="Times New Roman" font-size="40" font-style="normal" font-weight="normal" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1; white-space: pre;" ><tspan x="-60" y="-13.65" style="font-family: \'Times New Roman\'; ">xxxxxx</tspan><tspan x="-60" y="38.78" style="white-space: pre; ">x </tspan><tspan x=\"40\" y=\"38.78\" >y</tspan></text>\n\t</g>\n';
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
})();
