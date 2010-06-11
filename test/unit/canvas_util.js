function init(){
  var runner = new Test.Unit.Runner({
    
    testToFixed: function() {
      this.assertRespondsTo('toFixed', Canvas.util);
      
      function test(what) {
        this.assertIdentical(166.67, Canvas.util.toFixed(what, 2), 'should leave 2 fractional digits');
        this.assertIdentical(166.66667, Canvas.util.toFixed(what, 5), 'should leave 5 fractional digits');
        this.assertIdentical(167, Canvas.util.toFixed(what, 0), 'should leave 0 fractional digits');
        
        var fractionless = (typeof what == 'number') 
          ? parseInt(what) 
          : what.substring(0, what.indexOf('.'));
          
        this.assertIdentical(166, Canvas.util.toFixed(fractionless, 2), 'should leave fractionless number as is');
      }
      
      test.call(this, '166.66666666666666666666'); // string
      test.call(this, 166.66666666666666666666); // number
    },
    
    testRemoveFromArray: function() {
      var testArray = [1,2,3,4,5];
      
      this.assertRespondsTo('removeFromArray', Canvas.util);
      
      Canvas.util.removeFromArray(testArray, 2);
      this.assertEnumEqual([1,3,4,5], testArray);
      this.assertIdentical(testArray, Canvas.util.removeFromArray(testArray, 1), 'should return reference to original array');
      
      testArray = [1,2,3,1];
      Canvas.util.removeFromArray(testArray, 1);
      this.assertEnumEqual([2,3,1], testArray, 'only first occurance of value should be deleted');
      
      testArray = [1,2,3];
      Canvas.util.removeFromArray(testArray, 12);
      this.assertEnumEqual([1,2,3], testArray, 'deleting unexistent value should not affect array');
      
      testArray = [];
      Canvas.util.removeFromArray(testArray, 1);
      this.assertEnumEqual([], testArray, 'deleting any value from empty array should not affect it');
      
      testArray = ['0'];
      Canvas.util.removeFromArray(testArray, 0);
      this.assertEnumEqual(['0'], testArray, 'should use (strict) identity comparison, rather than equality one');
    },
    
    testDegreesToRadians: function() {
      this.assertRespondsTo('degreesToRadians', Canvas.util);
      this.assertIdentical(0, Canvas.util.degreesToRadians(0));
      this.assertIdentical(Math.PI / 2, Canvas.util.degreesToRadians(90));
      this.assertIdentical(Math.PI, Canvas.util.degreesToRadians(180));
      
      this.assertNaN(Canvas.util.degreesToRadians());
    },
    
    testGetRandomInt: function() {
      this.assertRespondsTo('getRandomInt', Canvas.util);
      
      var randomInts = [];
      for (var i = 100; i--; ) {
        var randomInt = Canvas.util.getRandomInt(100, 200); 
        randomInts.push(randomInt);
        this.assert(randomInt >= 100 && randomInt <= 200);
      }
      
      var areAllTheSame = randomInts.all(function(value){ 
        return value === randomInts[0];
      });
      
      this.assert(!areAllTheSame);
      
    }
  });
}