function init(){
  new Test.Unit.Runner({
    testConstructor: function() {
      var oColor = new Canvas.Color('ff5555');
      this.assert(oColor);
      this.assert(oColor instanceof Canvas.Color);
      this.assertIdentical('FF5555', oColor.toHex());
      
      var oColor = new Canvas.Color('rgb(100,100,100)');
      this.assert(oColor);
      this.assert(oColor instanceof Canvas.Color);
      this.assertIdentical('rgb(100,100,100)', oColor.toRgb());
    },
    testGetSource: function() {
      var oColor = new Canvas.Color('ffffff');
      this.assertRespondsTo('getSource', oColor);
      this.assertEnumEqual([255,255,255,1], oColor.getSource());
    },
    testSetSource: function() {
      var oColor = new Canvas.Color('ffffff');
      this.assertRespondsTo('setSource', oColor);
      oColor.setSource([0,0,0,1]);
      this.assertEnumEqual([0,0,0,1], oColor.getSource());
    },
    testToRgb: function() {
      var oColor = new Canvas.Color('ffffff');
      this.assertRespondsTo('toRgb', oColor);
      this.assertIdentical('rgb(255,255,255)', oColor.toRgb());
      oColor.setSource([0,0,0,0.5]);
      this.assertIdentical('rgb(0,0,0)', oColor.toRgb());
    },
    testToRgba: function() {
      var oColor = new Canvas.Color('ffffff');
      this.assertRespondsTo('toRgba', oColor);
      this.assertIdentical('rgba(255,255,255,1)', oColor.toRgba());
      oColor.setSource([0,0,0,0.5]);
      this.assertIdentical('rgba(0,0,0,0.5)', oColor.toRgba());
    },
    testToHex: function() {
      var oColor = new Canvas.Color('ffffff');
      this.assertRespondsTo('toHex', oColor);
      this.assertIdentical('FFFFFF', oColor.toHex());
      oColor.setSource([0,0,0,0.5]);
      this.assertIdentical('000000', oColor.toHex());
    },
    testGetAlpha: function() {
      var oColor = new Canvas.Color('ffffff');
      this.assertRespondsTo('getAlpha', oColor);
      this.assertIdentical(1, oColor.getAlpha());
      oColor.setSource([10,20,30, 0.456]);
      this.assertIdentical(0.456, oColor.getAlpha());
    },
    testSetAlpha: function() {
      var oColor = new Canvas.Color('ffffff');
      this.assertRespondsTo('setAlpha', oColor);
      oColor.setAlpha(0.1234);
      this.assertIdentical(0.1234, oColor.getAlpha());
      this.assertIdentical(oColor, oColor.setAlpha(0), 'should be chainable');
    },
    testToGrayscale: function() {
      var oColor = new Canvas.Color('ff5555');
      this.assertRespondsTo('toGrayscale', oColor);
      oColor.toGrayscale();
      this.assertIdentical('888888', oColor.toHex());
      oColor.setSource([10, 20, 30, 1]);
      this.assertIdentical(oColor, oColor.toGrayscale(), 'should be chainable');
      this.assertIdentical('121212', oColor.toHex());
    },
    testToBlackWhite: function() {
      var oColor = new Canvas.Color('333333');
      this.assertRespondsTo('toBlackWhite', oColor);
      oColor.toBlackWhite();
      this.assertIdentical('000000', oColor.toHex());
      oColor.setSource([200,200,200,1]);
      this.assertIdentical(oColor, oColor.toBlackWhite(), 'should be chainable');
      this.assertIdentical('FFFFFF', oColor.toHex());
      oColor.setSource([127,127,127,1]);
      oColor.toBlackWhite(200);
      this.assertIdentical('000000', oColor.toHex(), 'should work with threshold');
    },
    
    // static
    testFromRgb: function() {
      this.assertRespondsTo('fromRgb', Canvas.Color);
      var originalRgb = 'rgb(255,255,255)';
      var oColor = Canvas.Color.fromRgb(originalRgb);
      this.assert(oColor);
      this.assert(oColor instanceof Canvas.Color);
      this.assertIdentical(originalRgb, oColor.toRgb());
      this.assertIdentical('FFFFFF', oColor.toHex());
    },
    testFromRgba: function() {
      this.assertRespondsTo('fromRgba', Canvas.Color);
      var originalRgba = 'rgba(255,255,255,0.5)';
      var oColor = Canvas.Color.fromRgba(originalRgba);
      this.assert(oColor);
      this.assert(oColor instanceof Canvas.Color);
      this.assertIdentical(originalRgba, oColor.toRgba());
      this.assertIdentical('FFFFFF', oColor.toHex());
      this.assertIdentical(0.5, oColor.getAlpha(), 'alpha should be set properly');
    },
    testFromHex: function() {
      this.assertRespondsTo('fromHex', Canvas.Color);
      var originalHex = 'FF5555';
      var oColor = Canvas.Color.fromHex(originalHex);
      this.assert(oColor);
      this.assert(oColor instanceof Canvas.Color);
      this.assertIdentical(originalHex, oColor.toHex());
      this.assertIdentical('rgb(255,85,85)', oColor.toRgb());
    },
    testSourceFromRgb: function() {
      this.assertRespondsTo('sourceFromRgb', Canvas.Color);
      this.assertEnumEqual([255,255,255,1], Canvas.Color.sourceFromRgb('rgb(255,255,255)'));
      this.assertEnumEqual([100,150,200,1], Canvas.Color.sourceFromRgb('rgb(100,150,200)'));
    },
    testSourceFromHex: function() {
      
      this.assertRespondsTo('sourceFromHex', Canvas.Color);
      
      // uppercase
      this.assertEnumEqual([255,255,255,1], Canvas.Color.sourceFromHex('FFFFFF'));
      this.assertEnumEqual([255,255,255,1], Canvas.Color.sourceFromHex('FFF'));
      this.assertEnumEqual([255,255,255,1], Canvas.Color.sourceFromHex('#FFFFFF'));
      this.assertEnumEqual([255,255,255,1], Canvas.Color.sourceFromHex('#FFF'));
      
      // lowercase
      this.assertEnumEqual([255,255,255,1], Canvas.Color.sourceFromHex('#ffffff'));
      this.assertEnumEqual([255,255,255,1], Canvas.Color.sourceFromHex('#fff'));
      this.assertEnumEqual([255,255,255,1], Canvas.Color.sourceFromHex('ffffff'));
      this.assertEnumEqual([255,255,255,1], Canvas.Color.sourceFromHex('fff'));
    },
    testFromSource: function() {
      this.assertRespondsTo('fromSource', Canvas.Color);
      var oColor = Canvas.Color.fromSource([255,255,255,0.37]);
      
      this.assert(oColor);
      this.assert(oColor instanceof Canvas.Color);
      this.assertIdentical('rgba(255,255,255,0.37)', oColor.toRgba());
      this.assertIdentical('FFFFFF', oColor.toHex());
      this.assertIdentical(0.37, oColor.getAlpha());
    },
    testOverlayWith: function() {
      var oColor = new Canvas.Color('FF0000');
      this.assertRespondsTo('overlayWith', oColor);
      oColor.overlayWith('FFFFFF');
      this.assertIdentical('FF8080', oColor.toHex());
      
      oColor = new Canvas.Color('FFFFFF');
      oColor.overlayWith('FFFFFF');
      this.assertIdentical('FFFFFF', oColor.toHex());
      
      oColor = new Canvas.Color('rgb(255,255,255)');
      oColor.overlayWith('rgb(0,0,0)');
      this.assertIdentical('rgb(128,128,128)', oColor.toRgb());
    }
  });
}