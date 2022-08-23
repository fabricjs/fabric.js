(function(){

  QUnit.module('fabric.Color');

  QUnit.test('constructor', function(assert) {
    var oColor = new fabric.Color('ff5555');
    assert.ok(oColor);
    assert.ok(oColor instanceof fabric.Color);
    assert.equal(oColor.toHex(), 'FF5555');

    oColor = new fabric.Color('rgb(100,100,100)');
    assert.ok(oColor);
    assert.ok(oColor instanceof fabric.Color);
    assert.equal(oColor.toRgb(), 'rgb(100,100,100)');

    oColor = new fabric.Color('rgba(100,100,100, 0.5)');
    assert.ok(oColor);
    assert.ok(oColor instanceof fabric.Color);
    assert.equal(oColor.toRgba(), 'rgba(100,100,100,0.5)');

    oColor = new fabric.Color('hsl(262,80%,12%)');
    assert.ok(oColor);
    assert.ok(oColor instanceof fabric.Color);
    assert.equal(oColor.toHsl(), 'hsl(262,80%,12%)');
  });

  QUnit.test('empty args', function(assert) {
    var oColor = new fabric.Color();
    assert.ok(oColor);
    assert.ok(oColor instanceof fabric.Color);
    assert.equal(oColor.toHex(), '000000');
  });

  QUnit.test('getSource', function(assert) {
    var oColor = new fabric.Color('ffffff');
    assert.ok(typeof oColor.getSource === 'function');
    assert.deepEqual(oColor.getSource(), [255, 255, 255, 1]);
  });

  QUnit.test('setSource', function(assert) {
    var oColor = new fabric.Color('ffffff');
    assert.ok(typeof oColor.setSource === 'function');
    oColor.setSource([0,0,0,1]);
    assert.deepEqual(oColor.getSource(), [0,0,0,1]);
  });

  QUnit.test('toRgb', function(assert) {
    var oColor = new fabric.Color('ffffff');
    assert.ok(typeof oColor.toRgb === 'function');
    assert.equal(oColor.toRgb(), 'rgb(255,255,255)');
    oColor.setSource([0,0,0,0.5]);
    assert.equal(oColor.toRgb(), 'rgb(0,0,0)');
  });

  QUnit.test('toRgba', function(assert) {
    var oColor = new fabric.Color('ffffff');
    assert.ok(typeof oColor.toRgba === 'function');
    assert.equal(oColor.toRgba(), 'rgba(255,255,255,1)');
    oColor.setSource([0,0,0,0.5]);
    assert.equal(oColor.toRgba(), 'rgba(0,0,0,0.5)');
  });

  QUnit.test('toHsl', function(assert) {
    var oColor = new fabric.Color('ffffff');
    assert.ok(typeof oColor.toHsl === 'function');
    assert.equal(oColor.toHsl(), 'hsl(0,0%,100%)');
    oColor.setSource([0,0,0,0.5]);
    assert.equal(oColor.toHsl(), 'hsl(0,0%,0%)');
  });

  QUnit.test('toHsla', function(assert) {
    var oColor = new fabric.Color('ffffff');
    assert.ok(typeof oColor.toHsla === 'function');
    assert.equal(oColor.toHsla(), 'hsla(0,0%,100%,1)');
    oColor.setSource([0,0,0,0.5]);
    assert.equal(oColor.toHsla(), 'hsla(0,0%,0%,0.5)');
  });

  QUnit.test('toHex', function(assert) {
    var oColor = new fabric.Color('ffffff');
    assert.ok(typeof oColor.toHex === 'function');
    assert.equal(oColor.toHex(), 'FFFFFF');
    oColor.setSource([0,0,0,0.5]);
    assert.equal(oColor.toHex(), '000000');
  });

  QUnit.test('toHexa', function(assert) {
    var oColor = new fabric.Color('ffffffff');
    assert.ok(typeof oColor.toHexa === 'function');
    assert.equal(oColor.toHexa(), 'FFFFFFFF');
    oColor.setSource([255,255,255,0.1]);
    assert.equal(oColor.toHexa(), 'FFFFFF1A');
  });

  QUnit.test('getAlpha', function(assert) {
    var oColor = new fabric.Color('ffffff');
    assert.ok(typeof oColor.getAlpha === 'function');
    assert.equal(oColor.getAlpha(), 1);
    oColor.setSource([10,20,30, 0.456]);
    assert.equal(oColor.getAlpha(), 0.456);
    oColor = new fabric.Color('ffffffcc');
    assert.equal(oColor.getAlpha(), 0.8);
  });

  QUnit.test('setAlpha', function(assert) {
    var oColor = new fabric.Color('ffffff');
    assert.ok(typeof oColor.setAlpha === 'function');
    oColor.setAlpha(0.1234);
    assert.equal(oColor.getAlpha(), 0.1234);
    assert.equal(oColor.setAlpha(0), oColor, 'should be chainable');
  });

  QUnit.test('toGrayscale', function(assert) {
    var oColor = new fabric.Color('ff5555');
    assert.ok(typeof oColor.toGrayscale === 'function');
    oColor.toGrayscale();
    assert.equal(oColor.toHex(), '888888');
    oColor.setSource([10, 20, 30, 1]);
    assert.equal(oColor.toGrayscale(), oColor, 'should be chainable');
    assert.equal(oColor.toHex(), '121212');
  });

  QUnit.test('toBlackWhite', function(assert) {
    var oColor = new fabric.Color('333333');
    assert.ok(typeof oColor.toBlackWhite === 'function');
    oColor.toBlackWhite();
    assert.equal(oColor.toHex(), '000000');
    oColor.setSource([200,200,200,1]);
    assert.equal(oColor.toBlackWhite(), oColor, 'should be chainable');
    assert.equal(oColor.toHex(), 'FFFFFF');
    oColor.setSource([127,127,127,1]);
    oColor.toBlackWhite(200);
    assert.equal(oColor.toHex(), '000000', 'should work with threshold');
  });

  QUnit.test('fromRgb', function(assert) {
    assert.ok(typeof fabric.Color.fromRgb === 'function');
    var originalRgb = 'rgb(255,255,255)';
    var oColor = fabric.Color.fromRgb(originalRgb);
    assert.ok(oColor);
    assert.ok(oColor instanceof fabric.Color);
    assert.equal(oColor.toRgb(), originalRgb);
    assert.equal(oColor.toHex(), 'FFFFFF');
  });

  QUnit.test('fromRgb (with whitespaces)', function(assert) {
    assert.ok(typeof fabric.Color.fromRgb === 'function');
    var originalRgb = 'rgb( 255 , 255 , 255 )';
    var oColor = fabric.Color.fromRgb(originalRgb);
    assert.ok(oColor);
    assert.ok(oColor instanceof fabric.Color);
    assert.equal(oColor.toRgb(), 'rgb(255,255,255)');
    assert.equal(oColor.toHex(), 'FFFFFF');
  });

  QUnit.test('fromRgb (percentage values)', function(assert) {
    assert.ok(typeof fabric.Color.fromRgb === 'function');
    var originalRgb = 'rgb(100%,100%,100%)';
    var oColor = fabric.Color.fromRgb(originalRgb);
    assert.ok(oColor);
    assert.ok(oColor instanceof fabric.Color);
    assert.equal(oColor.toRgb(), 'rgb(255,255,255)');
    assert.equal(oColor.toHex(), 'FFFFFF');
  });

  QUnit.test('fromRgb (percentage values with whitespaces)', function(assert) {
    assert.ok(typeof fabric.Color.fromRgb === 'function');
    var originalRgb = 'rgb( 100% , 100% , 100% )';
    var oColor = fabric.Color.fromRgb(originalRgb);
    assert.ok(oColor);
    assert.ok(oColor instanceof fabric.Color);
    assert.equal(oColor.toRgb(), 'rgb(255,255,255)');
    assert.equal(oColor.toHex(), 'FFFFFF');
  });

  QUnit.test('fromRgb (uppercase)', function(assert) {
    assert.ok(typeof fabric.Color.fromRgb === 'function');
    var originalRgb = 'RGB(255,255,255)';
    var oColor = fabric.Color.fromRgb(originalRgb);
    assert.ok(oColor);
    assert.ok(oColor instanceof fabric.Color);
    assert.equal(oColor.toHex(), 'FFFFFF');
  });

  QUnit.test('fromRgba (uppercase)', function(assert) {
    assert.ok(typeof fabric.Color.fromRgba === 'function');
    var originalRgba = 'RGBA(255,255,255,0.5)';
    var oColor = fabric.Color.fromRgba(originalRgba);
    assert.ok(oColor);
    assert.ok(oColor instanceof fabric.Color);
    assert.equal(oColor.toHex(), 'FFFFFF');
    assert.equal(oColor.getAlpha(), 0.5, 'alpha should be set properly');
  });

  QUnit.test('fromRgba', function(assert) {
    assert.ok(typeof fabric.Color.fromRgba === 'function');
    var originalRgba = 'rgba(255,255,255,0.5)';
    var oColor = fabric.Color.fromRgba(originalRgba);
    assert.ok(oColor);
    assert.ok(oColor instanceof fabric.Color);
    assert.equal(oColor.toRgba(), originalRgba);
    assert.equal(oColor.toHex(), 'FFFFFF');
    assert.equal(oColor.getAlpha(), 0.5, 'alpha should be set properly');
  });

  QUnit.test('fromRgba (with missing 0)', function(assert) {
    var originalRgba = 'rgba( 255 , 255 , 255 , .3 )';
    var oColor = fabric.Color.fromRgba(originalRgba);
    assert.equal(oColor.toRgba(), 'rgba(255,255,255,0.3)');
    assert.equal(oColor.toHex(), 'FFFFFF');
    assert.equal(oColor.getAlpha(), 0.3, 'alpha should be set properly');
  });

  QUnit.test('fromRgba (with whitespaces)', function(assert) {
    var originalRgba = 'rgba( 255 , 255 , 255 , 0.5 )';
    var oColor = fabric.Color.fromRgba(originalRgba);
    assert.ok(oColor);
    assert.ok(oColor instanceof fabric.Color);
    assert.equal(oColor.toRgba(), 'rgba(255,255,255,0.5)');
    assert.equal(oColor.toHex(), 'FFFFFF');
    assert.equal(oColor.getAlpha(), 0.5, 'alpha should be set properly');
  });

  QUnit.test('fromRgba (percentage values)', function(assert) {
    var originalRgba = 'rgba(100%,100%,100%,0.5)';
    var oColor = fabric.Color.fromRgba(originalRgba);
    assert.ok(oColor);
    assert.ok(oColor instanceof fabric.Color);
    assert.equal(oColor.toRgba(), 'rgba(255,255,255,0.5)');
    assert.equal(oColor.toHex(), 'FFFFFF');
    assert.equal(oColor.getAlpha(), 0.5, 'alpha should be set properly');
  });

  QUnit.test('fromRgba (percentage values with whitespaces)', function(assert) {
    var originalRgba = 'rgba( 100% , 100% , 100% , 0.5 )';
    var oColor = fabric.Color.fromRgba(originalRgba);
    assert.ok(oColor);
    assert.ok(oColor instanceof fabric.Color);
    assert.equal(oColor.toRgba(), 'rgba(255,255,255,0.5)');
    assert.equal(oColor.toHex(), 'FFFFFF');
    assert.equal(oColor.getAlpha(), 0.5, 'alpha should be set properly');
  });

  QUnit.test('fromRgba (percentage values with decimals)', function(assert) {
    var originalRgba = 'rgba( 100.00%, 100.00%, 100.00% , 0.5 )';
    var oColor = fabric.Color.fromRgba(originalRgba);
    assert.ok(oColor);
    assert.ok(oColor instanceof fabric.Color);
    assert.equal(oColor.toRgba(), 'rgba(255,255,255,0.5)');
    assert.equal(oColor.toHex(), 'FFFFFF');
    assert.equal(oColor.getAlpha(), 0.5, 'alpha should be set properly');
  });


  QUnit.test('fromHsl', function(assert) {
    assert.ok(typeof fabric.Color.fromHsl === 'function');
    var originalHsl = 'hsl(262,80%,12%)';
    var oColor = fabric.Color.fromHsl(originalHsl);
    assert.ok(oColor);
    assert.ok(oColor instanceof fabric.Color);
    assert.equal(oColor.toHsl(), originalHsl);
    assert.equal(oColor.toHex(), '180637');
  });

  QUnit.test('fromHsl (with whitespaces)', function(assert) {
    assert.ok(typeof fabric.Color.fromHsl === 'function');
    var originalHsl = 'hsl( 262 , 80% , 12% )';
    var oColor = fabric.Color.fromHsl(originalHsl);
    assert.ok(oColor);
    assert.ok(oColor instanceof fabric.Color);
    assert.equal(oColor.toHsl(), 'hsl(262,80%,12%)');
    assert.equal(oColor.toHex(), '180637');
  });

  QUnit.test('fromHsl (uppercase)', function(assert) {
    assert.ok(typeof fabric.Color.fromHsl === 'function');
    var originalHsl = 'HSL(270,50%,40%)';
    var oColor = fabric.Color.fromHsl(originalHsl);
    assert.ok(oColor);
    assert.ok(oColor instanceof fabric.Color);
    assert.equal(oColor.toHex(), '663399');
    assert.equal(oColor.toRgba(), 'rgba(102,51,153,1)');
  });

  QUnit.test('fromHsla (uppercase)', function(assert) {
    assert.ok(typeof fabric.Color.fromHsla === 'function');
    var originalHsla = 'HSLA(108,50%,50%,0.7)';
    var oColor = fabric.Color.fromHsla(originalHsla);
    assert.ok(oColor);
    assert.ok(oColor instanceof fabric.Color);
    assert.equal(oColor.toHex(), '59BF40');
    assert.equal(oColor.toRgba(), 'rgba(89,191,64,0.7)');
    assert.equal(oColor.getAlpha(), 0.7, 'alpha should be set properly');
  });

  QUnit.test('fromHsla', function(assert) {
    assert.ok(typeof fabric.Color.fromHsla === 'function');
    var originalHsla = 'hsla(262,80%,12%,0.2)';
    var oColor = fabric.Color.fromHsla(originalHsla);
    assert.ok(oColor);
    assert.ok(oColor instanceof fabric.Color);
    assert.equal(oColor.toHsla(), originalHsla);
    assert.equal(oColor.toHex(), '180637');
    assert.equal(oColor.getAlpha(), 0.2, 'alpha should be set properly');
  });

  QUnit.test('fromHsla (with whitespaces)', function(assert) {
    assert.ok(typeof fabric.Color.fromHsla === 'function');
    var originalHsla = 'hsla( 262 , 80% , 12% , 0.2 )';
    var oColor = fabric.Color.fromHsla(originalHsla);
    assert.ok(oColor);
    assert.ok(oColor instanceof fabric.Color);
    assert.equal(oColor.toHsla(), 'hsla(262,80%,12%,0.2)');
    assert.equal(oColor.toHex(), '180637');
    assert.equal(oColor.getAlpha(), 0.2, 'alpha should be set properly');
  });

  QUnit.test('fromHex', function(assert) {
    assert.ok(typeof fabric.Color.fromHex === 'function');
    var originalHex = 'FF5555';
    var oColor = fabric.Color.fromHex(originalHex);
    assert.ok(oColor);
    assert.ok(oColor instanceof fabric.Color);
    assert.equal(oColor.toHex(), originalHex);
    assert.equal(oColor.toRgb(), 'rgb(255,85,85)');
  });

  QUnit.test('sourceFromRgb', function(assert) {
    assert.ok(typeof fabric.Color.sourceFromRgb === 'function');
    assert.deepEqual(fabric.Color.sourceFromRgb('rgb(255,255,255)'), [255,255,255,1]);
    assert.deepEqual(fabric.Color.sourceFromRgb('rgb(100,150,200)'), [100,150,200,1]);
  });

  QUnit.test('sourceFromHsl', function(assert) {
    assert.ok(typeof fabric.Color.sourceFromHsl === 'function');
    assert.deepEqual(fabric.Color.sourceFromHsl('hsl(360,100%,100%)'), [255,255,255,1]);
    assert.deepEqual(fabric.Color.sourceFromHsl('hsl(180,50%,40%)'), [51,153,153,1]);
  });

  QUnit.test('sourceFromHex', function(assert) {
    assert.ok(typeof fabric.Color.sourceFromHex === 'function');

    // uppercase
    assert.deepEqual(fabric.Color.sourceFromHex('#FFFFFF00'), [255,255,255,0]);
    assert.deepEqual(fabric.Color.sourceFromHex('#FFFFFFCC'), [255,255,255,0.8]);
    assert.deepEqual(fabric.Color.sourceFromHex('#FFFFFFFF'), [255,255,255,1]);
    assert.deepEqual(fabric.Color.sourceFromHex('#FFFFFF00'), [255,255,255,0]);
    assert.deepEqual(fabric.Color.sourceFromHex('#FFFFFF'), [255,255,255,1]);
    assert.deepEqual(fabric.Color.sourceFromHex('#FFFF'), [255,255,255,1]);
    assert.deepEqual(fabric.Color.sourceFromHex('#FFFC'), [255,255,255,0.8]);
    assert.deepEqual(fabric.Color.sourceFromHex('#FFF0'), [255,255,255,0]);
    assert.deepEqual(fabric.Color.sourceFromHex('#FFF'), [255,255,255,1]);
    assert.deepEqual(fabric.Color.sourceFromHex('FFFFFF00'), [255,255,255,0]);
    assert.deepEqual(fabric.Color.sourceFromHex('FFFFFFCC'), [255,255,255,0.8]);
    assert.deepEqual(fabric.Color.sourceFromHex('FFFFFFFF'), [255,255,255,1]);
    assert.deepEqual(fabric.Color.sourceFromHex('FFFFFF00'), [255,255,255,0]);
    assert.deepEqual(fabric.Color.sourceFromHex('FFFFFF'), [255,255,255,1]);
    assert.deepEqual(fabric.Color.sourceFromHex('FFFF'), [255,255,255,1]);
    assert.deepEqual(fabric.Color.sourceFromHex('FFFC'), [255,255,255,0.8]);
    assert.deepEqual(fabric.Color.sourceFromHex('FFF0'), [255,255,255,0]);
    assert.deepEqual(fabric.Color.sourceFromHex('FFF'), [255,255,255,1]);

    // lowercase
    assert.deepEqual(fabric.Color.sourceFromHex('#ffffff00'), [255,255,255,0]);
    assert.deepEqual(fabric.Color.sourceFromHex('#ffffffcc'), [255,255,255,0.8]);
    assert.deepEqual(fabric.Color.sourceFromHex('#ffffffff'), [255,255,255,1]);
    assert.deepEqual(fabric.Color.sourceFromHex('#ffffff00'), [255,255,255,0]);
    assert.deepEqual(fabric.Color.sourceFromHex('#ffffff'), [255,255,255,1]);
    assert.deepEqual(fabric.Color.sourceFromHex('#ffff'), [255,255,255,1]);
    assert.deepEqual(fabric.Color.sourceFromHex('#fffc'), [255,255,255,0.8]);
    assert.deepEqual(fabric.Color.sourceFromHex('#fff0'), [255,255,255,0]);
    assert.deepEqual(fabric.Color.sourceFromHex('#fff'), [255,255,255,1]);
    assert.deepEqual(fabric.Color.sourceFromHex('ffffff00'), [255,255,255,0]);
    assert.deepEqual(fabric.Color.sourceFromHex('ffffffcc'), [255,255,255,0.8]);
    assert.deepEqual(fabric.Color.sourceFromHex('ffffffff'), [255,255,255,1]);
    assert.deepEqual(fabric.Color.sourceFromHex('ffffff00'), [255,255,255,0]);
    assert.deepEqual(fabric.Color.sourceFromHex('ffffff'), [255,255,255,1]);
    assert.deepEqual(fabric.Color.sourceFromHex('ffff'), [255,255,255,1]);
    assert.deepEqual(fabric.Color.sourceFromHex('fffc'), [255,255,255,0.8]);
    assert.deepEqual(fabric.Color.sourceFromHex('fff0'), [255,255,255,0]);
    assert.deepEqual(fabric.Color.sourceFromHex('fff'), [255,255,255,1]);
  });

  QUnit.test('fromSource', function(assert) {
    assert.ok(typeof fabric.Color.fromSource === 'function');
    var oColor = fabric.Color.fromSource([255,255,255,0.37]);

    assert.ok(oColor);
    assert.ok(oColor instanceof fabric.Color);
    assert.equal(oColor.toRgba(), 'rgba(255,255,255,0.37)');
    assert.equal(oColor.toHex(), 'FFFFFF');
    assert.equal(oColor.getAlpha(), 0.37);
  });

  QUnit.test('overlayWith', function(assert) {
    var oColor = new fabric.Color('FF0000');
    assert.ok(typeof oColor.overlayWith === 'function');
    oColor.overlayWith('FFFFFF');
    assert.equal(oColor.toHex(), 'FF8080');

    oColor = new fabric.Color('FFFFFF');
    oColor.overlayWith('FFFFFF');
    assert.equal(oColor.toHex(), 'FFFFFF');

    oColor = new fabric.Color('rgb(255,255,255)');
    oColor.overlayWith('rgb(0,0,0)');
    assert.equal(oColor.toRgb(), 'rgb(128,128,128)');

    oColor = new fabric.Color('rgb(255,255,255)');
    oColor.overlayWith(new fabric.Color('rgb(0,0,0)'));
    assert.equal(oColor.toRgb(), 'rgb(128,128,128)');
  });

  QUnit.test('transparent', function(assert) {
    assert.deepEqual(new fabric.Color('transparent').getSource(), [255,255,255,0]);
  });
})();
