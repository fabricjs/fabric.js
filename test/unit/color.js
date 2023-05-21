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

  QUnit.test('toHexa rounds', function(assert) {
    var oColor = new fabric.Color([211.23213213, 0, 128.1233123131]);
    assert.equal(oColor.toHexa(), 'D30080FF');
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

  QUnit.module('parsing colors');
  [{
    name: 'fromRgb',
    stringToParse: 'rgb(255,255,255)',
    expectedSource: [255, 255, 255, 1]
  },{
    name: 'fromRgb no commas',
    stringToParse: 'rgb(255 0 255)',
    expectedSource: [255, 0, 255, 1]
  },{
    name: 'fromRgb (with whitespaces)',
    stringToParse: 'rgb( 255 , 128 , 64 )',
    expectedSource: [255, 128, 64, 1]
  },{
    name: 'fromRgb no commas (with whitespaces)',
    stringToParse: 'rgb( 255    128 64 )',
    expectedSource: [255, 128, 64, 1]
  },{
    name: 'fromRgb (percentage values)',
    stringToParse: 'rgb(100%,50%,25%)',
    expectedSource: [255, 127, 64, 1]
  },{
    name: 'fromRgb (percentage values with whitespaces)',
    stringToParse: 'rgb(100% ,   50% ,  25%)',
    expectedSource: [255, 127, 64, 1]
  },{
    name: 'fromRgba',
    stringToParse: 'rgba(255,12,10,0.5)',
    expectedSource: [255, 12, 10, 0.5]
  },{
    name: 'fromRgba without commas',
    stringToParse: 'rgba(255 12 10 / 0.5)',
    expectedSource: [255, 12, 10, 0.5]
  },{
    name: 'fromRgba (with spaces and missing 0)',
    stringToParse: 'rgba( 255 , 12 , 10 , .3 )',
    expectedSource: [255, 12, 10, 0.3]
  },{
    name: 'fromRgba (with whitespaces)',
    stringToParse: 'rgba( 255 , 33 , 44 , 0.6 )',
    expectedSource: [255, 33, 44, 0.6]
  },{
    name: 'fromRgba (percentage values)',
    stringToParse: 'rgba(100%,50%,25%,33%)',
    expectedSource: [255, 127, 64, 0.33]
  },{
    name: 'fromRgba (percentage values)',
    stringToParse: 'rgba(  100.00%  ,50.40%,   25.1%   ,  33%  )',
    expectedSource: [255, 129, 64, 0.33]
  },{
    name: 'fromRgba (percentage values with whitespaces)',
    stringToParse: 'rgba(  100.00%  ,50.80%,   25.1%   ,  33%  )',
    expectedSource: [255, 130, 64, 0.33]
  },{
    name: 'fromRgba (percentage values with whitespaces no zeroes)',
    stringToParse: 'rgba(  .99%  ,50.40%,   25.1%   ,  .33  )',
    expectedSource: [3, 129, 64, 0.33]
  }].forEach(({ name, stringToParse, expectedSource }) => {
    QUnit.test(name, function(assert) {
      var oColor = fabric.Color.fromRgba(stringToParse);
      assert.ok(oColor);
      assert.ok(oColor instanceof fabric.Color);
      assert.deepEqual(oColor.getSource(), expectedSource);
      var oColorUppercase = fabric.Color.fromRgb(stringToParse.toUpperCase());
      assert.ok(oColorUppercase);
      assert.ok(oColorUppercase instanceof fabric.Color);
      assert.deepEqual(oColorUppercase.getSource(), expectedSource);
    });
  });
  
  [{
    name: 'fromHsl',
    stringToParse: 'hsl(262,80%,12%)',
    expectedSource: [24, 6, 55, 1]
  },{
    name: 'fromHsl (with whitespaces)',
    stringToParse: 'hsl( 262 , 80% , 12% )',
    expectedSource: [24, 6, 55, 1]
  },{
    name: 'fromHsla',
    stringToParse: 'hsla(108,50%,50%,0.7)',
    expectedSource: [89, 191, 64, 0.7]
  },{
    name: 'fromHsla (with whitespaces)',
    stringToParse: 'hsla(  108  ,50%  , 50%    ,.2)',
    expectedSource: [89, 191, 64, 0.2]
  },{
    name: 'fromHsla no commas(with whitespaces)',
    stringToParse: 'hsl( 108  50%   50%  / .5)',
    expectedSource: [89, 191, 64, 0.5]
  },{
    name: 'fromHsla with very counterClockwise value)',
    stringToParse: 'hsl( -450,  50%,   50%, .5)',
    expectedSource: [127, 64, 191, 0.5]
  }].forEach(({ name, stringToParse, expectedSource }) => {
    QUnit.test(name, function(assert) {
      var oColor = fabric.Color.fromHsla(stringToParse);
      assert.ok(oColor);
      assert.ok(oColor instanceof fabric.Color);
      assert.deepEqual(oColor.getSource(), expectedSource);
      var oColorUppercase = fabric.Color.fromHsla(stringToParse.toUpperCase());
      assert.ok(oColorUppercase);
      assert.ok(oColorUppercase instanceof fabric.Color);
      assert.deepEqual(oColorUppercase.getSource(), expectedSource);
    });
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

  QUnit.test('from rgba', function(assert) {
    var oColor = new fabric.Color([255,255,255,0.37]);

    assert.ok(oColor);
    assert.ok(oColor instanceof fabric.Color);
    assert.equal(oColor.toRgba(), 'rgba(255,255,255,0.37)');
    assert.equal(oColor.toHex(), 'FFFFFF');
    assert.equal(oColor.getAlpha(), 0.37);
  });

  QUnit.test('from rgb', function(assert) {
    var oColor = new fabric.Color([255,255,255]);

    assert.ok(oColor);
    assert.ok(oColor instanceof fabric.Color);
    assert.equal(oColor.toRgba(), 'rgba(255,255,255,1)');
    assert.equal(oColor.toHex(), 'FFFFFF');
    assert.equal(oColor.getAlpha(), 1);
  });

  QUnit.test('from Color instance', function(assert) {
    var oColor = new fabric.Color(new fabric.Color([255,255,255]));

    assert.ok(oColor);
    assert.ok(oColor instanceof fabric.Color);
    assert.equal(oColor.toRgba(), 'rgba(255,255,255,1)');
    assert.equal(oColor.toHex(), 'FFFFFF');
    assert.equal(oColor.getAlpha(), 1);
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
