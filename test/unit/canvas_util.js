(function(){
  
  module('Canvas.util');
  
  test('toFixed', function(){
    ok(typeof Canvas.util.toFixed == 'function');
    
    function test(what) {
      equals(Canvas.util.toFixed(what, 2), 166.67, 'should leave 2 fractional digits');
      equals(Canvas.util.toFixed(what, 5), 166.66667, 'should leave 5 fractional digits');
      equals(Canvas.util.toFixed(what, 0), 167, 'should leave 0 fractional digits');
      
      var fractionless = (typeof what == 'number') 
        ? parseInt(what) 
        : what.substring(0, what.indexOf('.'));
        
      equals(Canvas.util.toFixed(fractionless, 2), 166, 'should leave fractionless number as is');
    }
    
    test.call(this, '166.66666666666666666666'); // string
    test.call(this, 166.66666666666666666666); // number
  });
  
  test('removeFromArray', function() {
    var testArray = [1,2,3,4,5];
    
    ok(typeof Canvas.util.removeFromArray == 'function');
    
    Canvas.util.removeFromArray(testArray, 2);
    same([1,3,4,5], testArray);
    equals(Canvas.util.removeFromArray(testArray, 1), testArray, 'should return reference to original array');
    
    testArray = [1,2,3,1];
    Canvas.util.removeFromArray(testArray, 1);
    same([2,3,1], testArray, 'only first occurance of value should be deleted');
    
    testArray = [1,2,3];
    Canvas.util.removeFromArray(testArray, 12);
    same([1,2,3], testArray, 'deleting unexistent value should not affect array');
    
    testArray = [];
    Canvas.util.removeFromArray(testArray, 1);
    same([], testArray, 'deleting any value from empty array should not affect it');
    
    testArray = ['0'];
    Canvas.util.removeFromArray(testArray, 0);
    same(['0'], testArray, 'should use (strict) identity comparison, rather than equality one');
  });
  
  test('degreesToRadians', function(){
    ok(typeof Canvas.util.degreesToRadians == 'function');
    equals(Canvas.util.degreesToRadians(0), 0);
    equals(Canvas.util.degreesToRadians(90), Math.PI / 2);
    equals(Canvas.util.degreesToRadians(180), Math.PI);
    
    same(Canvas.util.degreesToRadians(), NaN);
  });
  
  test('getRandomInt', function(){
    ok(typeof Canvas.util.getRandomInt == 'function');
    
    var randomInts = [];
    for (var i = 100; i--; ) {
      var randomInt = Canvas.util.getRandomInt(100, 200); 
      randomInts.push(randomInt);
      ok(randomInt >= 100 && randomInt <= 200);
    }
    
    var areAllTheSame = randomInts.every(function(value){ 
      return value === randomInts[0];
    });
    
    ok(!areAllTheSame);
  });
  
})();