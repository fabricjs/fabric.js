(function(){

  QUnit.module('fabric.Color');

  test('constructor', function() {
    var oColor = new fabric.Color('ff5555');
    ok(oColor);
    ok(oColor instanceof fabric.Color);
    equal(oColor.toHex(), 'FF5555');

    var oColor = new fabric.Color('rgb(100,100,100)');
    ok(oColor);
    ok(oColor instanceof fabric.Color);
    equal(oColor.toRgb(), 'rgb(100,100,100)');

    var oColor = new fabric.Color('rgba(100,100,100, 0.5)');
    ok(oColor);
    ok(oColor instanceof fabric.Color);
    equal(oColor.toRgba(), 'rgba(100,100,100,0.5)');

    var oColor = new fabric.Color('hsl(262,80%,12%)');
    ok(oColor);
    ok(oColor instanceof fabric.Color);
    equal(oColor.toHsl(), 'hsl(262,80%,12%)');
  });

  test('empty args', function() {
    var oColor = new fabric.Color();
    ok(oColor);
    ok(oColor instanceof fabric.Color);
    equal(oColor.toHex(), '000000');
  });

  test('getSource', function() {
    var oColor = new fabric.Color('ffffff');
    ok(typeof oColor.getSource == 'function');
    deepEqual(oColor.getSource(), [255, 255, 255, 1]);
  });

  test('setSource', function() {
    var oColor = new fabric.Color('ffffff');
    ok(typeof oColor.setSource == 'function');
    oColor.setSource([0,0,0,1]);
    deepEqual(oColor.getSource(), [0,0,0,1]);
  });

  test('toRgb', function() {
    var oColor = new fabric.Color('ffffff');
    ok(typeof oColor.toRgb == 'function');
    equal(oColor.toRgb(), 'rgb(255,255,255)');
    oColor.setSource([0,0,0,0.5]);
    equal(oColor.toRgb(), 'rgb(0,0,0)');
  });

  test('toRgba', function() {
    var oColor = new fabric.Color('ffffff');
    ok(typeof oColor.toRgba == 'function');
    equal(oColor.toRgba(), 'rgba(255,255,255,1)');
    oColor.setSource([0,0,0,0.5]);
    equal(oColor.toRgba(), 'rgba(0,0,0,0.5)');
  });

  test('toHsl', function() {
    var oColor = new fabric.Color('ffffff');
    ok(typeof oColor.toHsl == 'function');
    equal(oColor.toHsl(), 'hsl(0,0%,100%)');
    oColor.setSource([0,0,0,0.5]);
    equal(oColor.toHsl(), 'hsl(0,0%,0%)');
  });

  test('toHsla', function() {
    var oColor = new fabric.Color('ffffff');
    ok(typeof oColor.toHsla == 'function');
    equal(oColor.toHsla(), 'hsla(0,0%,100%,1)');
    oColor.setSource([0,0,0,0.5]);
    equal(oColor.toHsla(), 'hsla(0,0%,0%,0.5)');
  });

  test('toHex', function() {
    var oColor = new fabric.Color('ffffff');
    ok(typeof oColor.toHex == 'function');
    equal(oColor.toHex(), 'FFFFFF');
    oColor.setSource([0,0,0,0.5]);
    equal(oColor.toHex(), '000000');
  });

  test('getAlpha', function() {
    var oColor = new fabric.Color('ffffff');
    ok(typeof oColor.getAlpha == 'function');
    equal(oColor.getAlpha(), 1);
    oColor.setSource([10,20,30, 0.456]);
    equal(oColor.getAlpha(), 0.456);
  });

  test('setAlpha', function() {
    var oColor = new fabric.Color('ffffff');
    ok(typeof oColor.setAlpha == 'function');
    oColor.setAlpha(0.1234);
    equal(oColor.getAlpha(), 0.1234);
    equal(oColor.setAlpha(0), oColor, 'should be chainable');
  });

  test('toGrayscale', function() {
    var oColor = new fabric.Color('ff5555');
    ok(typeof oColor.toGrayscale == 'function');
    oColor.toGrayscale();
    equal(oColor.toHex(), '888888');
    oColor.setSource([10, 20, 30, 1]);
    equal(oColor.toGrayscale(), oColor, 'should be chainable');
    equal(oColor.toHex(), '121212');
  });

  test('toBlackWhite', function() {
    var oColor = new fabric.Color('333333');
    ok(typeof oColor.toBlackWhite == 'function');
    oColor.toBlackWhite();
    equal(oColor.toHex(), '000000');
    oColor.setSource([200,200,200,1]);
    equal(oColor.toBlackWhite(), oColor, 'should be chainable');
    equal(oColor.toHex(), 'FFFFFF');
    oColor.setSource([127,127,127,1]);
    oColor.toBlackWhite(200);
    equal(oColor.toHex(), '000000', 'should work with threshold');
  });

  test('fromRgb', function() {
    ok(typeof fabric.Color.fromRgb == 'function');
    var originalRgb = 'rgb(255,255,255)';
    var oColor = fabric.Color.fromRgb(originalRgb);
    ok(oColor);
    ok(oColor instanceof fabric.Color);
    equal(oColor.toRgb(), originalRgb);
    equal(oColor.toHex(), 'FFFFFF');
  });

  test('fromRgb (with whitespaces)', function() {
    ok(typeof fabric.Color.fromRgb == 'function');
    var originalRgb = 'rgb( 255 , 255 , 255 )';
    var oColor = fabric.Color.fromRgb(originalRgb);
    ok(oColor);
    ok(oColor instanceof fabric.Color);
    equal(oColor.toRgb(), 'rgb(255,255,255)');
    equal(oColor.toHex(), 'FFFFFF');
  });

  test('fromRgb (percentage values)', function() {
    ok(typeof fabric.Color.fromRgb == 'function');
    var originalRgb = 'rgb(100%,100%,100%)';
    var oColor = fabric.Color.fromRgb(originalRgb);
    ok(oColor);
    ok(oColor instanceof fabric.Color);
    equal(oColor.toRgb(), 'rgb(255,255,255)');
    equal(oColor.toHex(), 'FFFFFF');
  });

  test('fromRgb (percentage values with whitespaces)', function() {
    ok(typeof fabric.Color.fromRgb == 'function');
    var originalRgb = 'rgb( 100% , 100% , 100% )';
    var oColor = fabric.Color.fromRgb(originalRgb);
    ok(oColor);
    ok(oColor instanceof fabric.Color);
    equal(oColor.toRgb(), 'rgb(255,255,255)');
    equal(oColor.toHex(), 'FFFFFF');
  });

  test('fromRgba', function() {
    ok(typeof fabric.Color.fromRgba == 'function');
    var originalRgba = 'rgba(255,255,255,0.5)';
    var oColor = fabric.Color.fromRgba(originalRgba);
    ok(oColor);
    ok(oColor instanceof fabric.Color);
    equal(oColor.toRgba(), originalRgba);
    equal(oColor.toHex(), 'FFFFFF');
    equal(oColor.getAlpha(), 0.5, 'alpha should be set properly');
  });

  test('fromRgba (with whitespaces)', function() {
    var originalRgba = 'rgba( 255 , 255 , 255 , 0.5 )';
    oColor = fabric.Color.fromRgba(originalRgba);
    ok(oColor);
    ok(oColor instanceof fabric.Color);
    equal(oColor.toRgba(), 'rgba(255,255,255,0.5)');
    equal(oColor.toHex(), 'FFFFFF');
    equal(oColor.getAlpha(), 0.5, 'alpha should be set properly');
  });

  test('fromRgba (percentage values)', function() {
    var originalRgba = 'rgba(100%,100%,100%,0.5)';
    oColor = fabric.Color.fromRgba(originalRgba);
    ok(oColor);
    ok(oColor instanceof fabric.Color);
    equal(oColor.toRgba(), 'rgba(255,255,255,0.5)');
    equal(oColor.toHex(), 'FFFFFF');
    equal(oColor.getAlpha(), 0.5, 'alpha should be set properly');
  });

  test('fromRgba (percentage values with whitespaces)', function() {
    var originalRgba = 'rgba( 100% , 100% , 100% , 0.5 )';
    oColor = fabric.Color.fromRgba(originalRgba);
    ok(oColor);
    ok(oColor instanceof fabric.Color);
    equal(oColor.toRgba(), 'rgba(255,255,255,0.5)');
    equal(oColor.toHex(), 'FFFFFF');
    equal(oColor.getAlpha(), 0.5, 'alpha should be set properly');
  });

  test('fromRgba (percentage values with decimals)', function() {
    var originalRgba = 'rgba( 100.00%, 100.00%, 100.00% , 0.5 )';
    oColor = fabric.Color.fromRgba(originalRgba);
    ok(oColor);
    ok(oColor instanceof fabric.Color);
    equal(oColor.toRgba(), 'rgba(255,255,255,0.5)');
    equal(oColor.toHex(), 'FFFFFF');
    equal(oColor.getAlpha(), 0.5, 'alpha should be set properly');
  });


  test('fromHsl', function() {
    ok(typeof fabric.Color.fromHsl == 'function');
    var originalHsl = 'hsl(262,80%,12%)';
    var oColor = fabric.Color.fromHsl(originalHsl);
    ok(oColor);
    ok(oColor instanceof fabric.Color);
    equal(oColor.toHsl(), originalHsl);
    equal(oColor.toHex(), '180637');
  });

  test('fromHsl (with whitespaces)', function() {
    ok(typeof fabric.Color.fromHsl == 'function');
    var originalHsl = 'hsl( 262 , 80% , 12% )';
    var oColor = fabric.Color.fromHsl(originalHsl);
    ok(oColor);
    ok(oColor instanceof fabric.Color);
    equal(oColor.toHsl(), 'hsl(262,80%,12%)');
    equal(oColor.toHex(), '180637');
  });

  test('fromHsla', function() {
    ok(typeof fabric.Color.fromHsla == 'function');
    var originalHsla = 'hsla(262,80%,12%,0.2)';
    var oColor = fabric.Color.fromHsla(originalHsla);
    ok(oColor);
    ok(oColor instanceof fabric.Color);
    equal(oColor.toHsla(), originalHsla);
    equal(oColor.toHex(), '180637');
    equal(oColor.getAlpha(), 0.2, 'alpha should be set properly');
  });

  test('fromHsla (with whitespaces)', function() {
    ok(typeof fabric.Color.fromHsla == 'function');
    var originalHsla = 'hsla( 262 , 80% , 12% , 0.2 )';
    var oColor = fabric.Color.fromHsla(originalHsla);
    ok(oColor);
    ok(oColor instanceof fabric.Color);
    equal(oColor.toHsla(), 'hsla(262,80%,12%,0.2)');
    equal(oColor.toHex(), '180637');
    equal(oColor.getAlpha(), 0.2, 'alpha should be set properly');
  });

  test('fromHex', function() {
    ok(typeof fabric.Color.fromHex == 'function');
    var originalHex = 'FF5555';
    var oColor = fabric.Color.fromHex(originalHex);
    ok(oColor);
    ok(oColor instanceof fabric.Color);
    equal(oColor.toHex(), originalHex);
    equal(oColor.toRgb(), 'rgb(255,85,85)');
  });

  test('sourceFromRgb', function() {
    ok(typeof fabric.Color.sourceFromRgb == 'function');
    deepEqual(fabric.Color.sourceFromRgb('rgb(255,255,255)'), [255,255,255,1]);
    deepEqual(fabric.Color.sourceFromRgb('rgb(100,150,200)'), [100,150,200,1]);
  });

  test('sourceFromHsl', function() {
    ok(typeof fabric.Color.sourceFromHsl == 'function');
    deepEqual(fabric.Color.sourceFromHsl('hsl(360,100%,100%)'), [255,255,255,1]);
    deepEqual(fabric.Color.sourceFromHsl('hsl(180,50%,40%)'), [51,153,153,1]);
  });

  test('sourceFromHex', function() {
    ok(typeof fabric.Color.sourceFromHex == 'function');

    // uppercase
    deepEqual(fabric.Color.sourceFromHex('FFFFFF'), [255,255,255,1]);
    deepEqual(fabric.Color.sourceFromHex('FFF'), [255,255,255,1]);
    deepEqual(fabric.Color.sourceFromHex('#FFFFFF'), [255,255,255,1]);
    deepEqual(fabric.Color.sourceFromHex('#FFF'), [255,255,255,1]);

    // lowercase
    deepEqual(fabric.Color.sourceFromHex('#ffffff'), [255,255,255,1]);
    deepEqual(fabric.Color.sourceFromHex('#fff'), [255,255,255,1]);
    deepEqual(fabric.Color.sourceFromHex('ffffff'), [255,255,255,1]);
    deepEqual(fabric.Color.sourceFromHex('fff'), [255,255,255,1]);
  });

  test('fromSource', function() {
    ok(typeof fabric.Color.fromSource == 'function');
    var oColor = fabric.Color.fromSource([255,255,255,0.37]);

    ok(oColor);
    ok(oColor instanceof fabric.Color);
    equal(oColor.toRgba(), 'rgba(255,255,255,0.37)');
    equal(oColor.toHex(), 'FFFFFF');
    equal(oColor.getAlpha(), 0.37);
  });

  test('overlayWith', function() {
    var oColor = new fabric.Color('FF0000');
    ok(typeof oColor.overlayWith == 'function');
    oColor.overlayWith('FFFFFF');
    equal(oColor.toHex(), 'FF8080');

    oColor = new fabric.Color('FFFFFF');
    oColor.overlayWith('FFFFFF');
    equal(oColor.toHex(), 'FFFFFF');

    oColor = new fabric.Color('rgb(255,255,255)');
    oColor.overlayWith('rgb(0,0,0)');
    equal(oColor.toRgb(), 'rgb(128,128,128)');

    oColor = new fabric.Color('rgb(255,255,255)');
    oColor.overlayWith(new fabric.Color('rgb(0,0,0)'));
    equal(oColor.toRgb(), 'rgb(128,128,128)');
  });

  test('transparent', function() {
    deepEqual(new fabric.Color('transparent').getSource(), [255,255,255,0]);
  });
})();
